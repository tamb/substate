import { describe, expect, test, vi } from 'vitest';
import { Substate } from '../Substate';

describe('Substate sync() proxy (v11+)', () => {
  test('primitive paths use .value for read/write', () => {
    const store = new Substate({ state: { age: 25 } });
    const age = store.sync<number>('age');
    expect(age.value).toBe(25);
    age.value = 30;
    expect(store.getProp('age')).toBe(30);
  });

  test('reads reflect latest store state', () => {
    const store = new Substate({
      state: {
        user: { name: 'John', settings: { theme: 'light' } },
      },
    });

    const user = store.sync<{ name: string; settings: { theme: string } }>('user');
    expect(user.name).toBe('John');

    store.updateState({ user: { name: 'Alice', settings: { theme: 'light' } } });
    expect(user.name).toBe('Alice');
    expect(user.settings.theme).toBe('light');
  });

  test('writes auto-commit via updateState using dot paths', () => {
    const store = new Substate({ state: { user: { name: 'John' } } });
    const user = store.sync<{ name: string }>('user');

    user.name = 'Thomas';
    expect(store.getProp('user.name')).toBe('Thomas');
  });

  test('nested writes work lazily (sub-proxies)', () => {
    const store = new Substate({ state: { user: { settings: { theme: 'light' } } } });
    const user = store.sync<{ settings: { theme: string } }>('user');

    user.settings.theme = 'dark';
    expect(store.getProp('user.settings.theme')).toBe('dark');
  });

  test('batch() accumulates writes and commit() applies atomically', () => {
    const store = new Substate({ state: { user: { name: 'John', bio: '' } } });
    const user = store.sync<{ name: string; bio: string }>('user');

    const updateSpy = vi.spyOn(store, 'updateState');

    const batch = user.batch();
    batch.name = 'Thomas';
    batch.bio = 'Developer';

    // No updateState calls until commit
    expect(updateSpy).toHaveBeenCalledTimes(0);

    batch.commit();
    expect(updateSpy).toHaveBeenCalledTimes(1);

    expect(store.getProp('user.name')).toBe('Thomas');
    expect(store.getProp('user.bio')).toBe('Developer');
  });

  test('cancel() discards pending batch writes', () => {
    const store = new Substate({ state: { user: { name: 'John' } } });
    const user = store.sync<{ name: string }>('user');

    const batch = user.batch();
    batch.name = 'Thomas';
    batch.cancel();

    expect(store.getProp('user.name')).toBe('John');
  });

  test('with() buffers $tag/$type/$deep for next write', () => {
    const store = new Substate({ state: { user: { name: 'John' } } });
    const user = store.sync<{ name: string }>('user');

    const updateSpy = vi.spyOn(store, 'updateState');

    user.with({ $tag: 'profile-save', $type: 'USER_EDIT', $deep: true }).name = 'Thomas';

    expect(updateSpy).toHaveBeenCalledTimes(1);
    const actionArg = updateSpy.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(actionArg['user.name']).toBe('Thomas');
    expect(actionArg.$tag).toBe('profile-save');
    expect(actionArg.$type).toBe('USER_EDIT');
    expect(actionArg.$deep).toBe(true);
  });

  test('with(callback) batches changes and auto-commits once', () => {
    const store = new Substate({ state: { user: { name: 'John', bio: '' } } });
    const user = store.sync<{ name: string; bio: string }>('user');

    const updateSpy = vi.spyOn(store, 'updateState');

    user.with({ $tag: 'profile-save' }, (draft) => {
      draft.name = 'Thomas';
      draft.bio = 'Developer';
    });

    expect(updateSpy).toHaveBeenCalledTimes(1);
    const actionArg = updateSpy.mock.calls[0]?.[0] as Record<string, unknown>;
    expect(actionArg.$tag).toBe('profile-save');
    expect(actionArg['user.name']).toBe('Thomas');
    expect(actionArg['user.bio']).toBe('Developer');
  });

  test('array mutators (push/splice) commit a new array value', () => {
    const store = new Substate({ state: { items: [1, 2] } });
    const items = store.sync<number[]>('items');

    items.push(3);
    expect(store.getProp('items')).toEqual([1, 2, 3]);

    items.splice(1, 1, 9);
    expect(store.getProp('items')).toEqual([1, 9, 3]);
  });

  test('legacy sync(configObject) still works and warns once per store instance', () => {
    const store = new Substate({ state: { userName: 'John' } });
    const uiModel: Record<string, unknown> = { name: '' };
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const synced1 = store.sync({ readerObj: uiModel, stateField: 'userName', readField: 'name' });
    expect(uiModel.name).toBe('John');

    // Warned once for legacy detection
    expect(warnSpy).toHaveBeenCalledTimes(1);

    const synced2 = store.sync({ readerObj: uiModel, stateField: 'userName', readField: 'name' });
    expect(warnSpy).toHaveBeenCalledTimes(1);

    store.updateState({ userName: 'Alice' });
    expect(uiModel.name).toBe('Alice');

    synced1.unsync();
    synced2.unsync();
  });
});

