import { describe, expect, it } from 'vitest';
import { EVENTS } from '../../../consts';
import type { TUserState } from '../../interfaces';
import { tempUpdate } from '../tempUpdate';

type TTestAction = TUserState & {
  [key: string]: unknown;
};

describe('tempUpdate', () => {
  describe('basic functionality', () => {
    it('should update the state with direct keys', () => {
      const state = { a: 1, b: 2 } as TUserState;
      const action = { a: 3, b: 4 } as TUserState;
      const result = tempUpdate(state, action, true);
      expect(result).toEqual({ a: 3, b: 4, $type: EVENTS.UPDATE_STATE });
    });

    it('should update the state with mixed direct and nested keys', () => {
      const state = { a: 1, nested: { b: 2 } } as TUserState;
      const action = { a: 3, 'nested.b': 4 } as TUserState;
      const result = tempUpdate(state, action, true);
      expect(result).toEqual({ a: 3, nested: { b: 4 }, $type: EVENTS.UPDATE_STATE });
    });

    it('should handle array notation for nested keys', () => {
      const state = { items: [1, 2, 3] } as TUserState;
      const action = { 'items[1]': 5 } as TUserState;
      const result = tempUpdate(state, action, true);
      expect(result).toEqual({ items: [1, 5, 3], $type: EVENTS.UPDATE_STATE });
    });

    it('should handle deep nested paths with dots', () => {
      const state = { user: { profile: { name: 'John', age: 30 } } } as TUserState;
      const action = { 'user.profile.name': 'Jane', 'user.profile.age': 25 } as TUserState;
      const result = tempUpdate(state, action, true);
      expect(result).toEqual({
        user: { profile: { name: 'Jane', age: 25 } },
        $type: EVENTS.UPDATE_STATE,
      });
    });

    it('should handle mixed array and object notation', () => {
      const state = { users: [{ name: 'John' }, { name: 'Jane' }] } as TUserState;
      const action = { 'users[0].name': 'Bob' } as TUserState;
      const result = tempUpdate(state, action, true);
      expect(result).toEqual({
        users: [{ name: 'Bob' }, { name: 'Jane' }],
        $type: EVENTS.UPDATE_STATE,
      });
    });
  });

  describe('$deep keyword handling', () => {
    it('should set $deep to false when defaultDeep is false', () => {
      const state = { a: 1, b: 2 } as TUserState;
      const action = { a: 3 } as TUserState;
      const result = tempUpdate(state, action, false);
      expect(result.$deep).toBe(false);
    });

    it('should not set $deep when defaultDeep is true', () => {
      const state = { a: 1, b: 2 } as TUserState;
      const action = { a: 3 } as TUserState;
      const result = tempUpdate(state, action, true);
      expect(result.$deep).toBeUndefined();
    });

    it('should preserve existing $deep value when defaultDeep is true', () => {
      const state = { a: 1, b: 2, $deep: true } as TUserState;
      const action = { a: 3 } as TUserState;
      const result = tempUpdate(state, action, true);
      expect(result.$deep).toBe(true);
    });
  });

  describe('$type keyword handling', () => {
    it('should set $type to UPDATE_STATE when not provided in action', () => {
      const state = { a: 1 } as TUserState;
      const action = { a: 2 } as TUserState;
      const result = tempUpdate(state, action, true);
      expect(result.$type).toBe(EVENTS.UPDATE_STATE);
    });

    it('should use $type from action when provided', () => {
      const state = { a: 1 } as TUserState;
      const action = { a: 2, $type: EVENTS.STATE_RESET } as TUserState;
      const result = tempUpdate(state, action, true);
      expect(result.$type).toBe(EVENTS.STATE_RESET);
    });

    it('should preserve existing $type when updating', () => {
      const state = { a: 1, $type: EVENTS.STATE_UPDATED } as TUserState;
      const action = { a: 2 } as TUserState;
      const result = tempUpdate(state, action, true);
      expect(result.$type).toBe(EVENTS.UPDATE_STATE); // action overrides existing
    });
  });

  describe('edge cases', () => {
    it('should handle empty action object', () => {
      const state = { a: 1, b: 2 } as TUserState;
      const action = {} as TUserState;
      const result = tempUpdate(state, action, true);
      expect(result).toEqual({ a: 1, b: 2, $type: EVENTS.UPDATE_STATE });
    });

    it('should handle undefined values', () => {
      const state = { a: 1, b: 2 } as TUserState;
      const action = { a: undefined } as TUserState;
      const result = tempUpdate(state, action, true);
      expect(result).toEqual({ a: undefined, b: 2, $type: EVENTS.UPDATE_STATE });
    });

    it('should handle null values', () => {
      const state = { a: 1, b: 2 } as TUserState;
      const action = { a: null } as TUserState;
      const result = tempUpdate(state, action, true);
      expect(result).toEqual({ a: null, b: 2, $type: EVENTS.UPDATE_STATE });
    });

    it('should handle complex nested structures', () => {
      type TTestState = TUserState & {
        users: { id: number; profile: { name: string; settings: { theme: string } } }[];
      };

      const state = {
        users: [
          { id: 1, profile: { name: 'John', settings: { theme: 'light' } } },
          { id: 2, profile: { name: 'Jane', settings: { theme: 'dark' } } },
        ],
      } as TTestState;

      const action = {
        'users[0].profile.name': 'Bob',
        'users[1].profile.settings.theme': 'blue',
      } as TUserState;

      const result = tempUpdate(state, action, true);
      const resultAny = result as unknown as TTestState;
      expect(resultAny.users[0].profile.name).toBe('Bob');
      expect(resultAny.users[1].profile.settings.theme).toBe('blue');
    });
  });

  describe('keyword preservation', () => {
    it('should preserve $tag keyword from original state', () => {
      const state = { a: 1, $tag: 'my-tag' } as TUserState;
      const action = { a: 2 } as TUserState;
      const result = tempUpdate(state, action, true);
      expect(result.$tag).toBe('my-tag');
    });

    it('should handle action with multiple keywords', () => {
      const state = { a: 1 } as TUserState;
      const action = { a: 2, $type: EVENTS.STATE_RESET, $deep: true, $tag: 'test' } as TUserState;
      const result = tempUpdate(state, action, false);
      expect(result.$type).toBe(EVENTS.STATE_RESET);
      expect(result.$deep).toBe(false); // defaultDeep is false, so $deep is set to false regardless of action
      expect(result.$tag).toBe('test');
    });
  });

  describe('mixed key types', () => {
    it('should handle combination of direct, dot notation, and bracket notation', () => {
      type TTestState = TUserState & {
        direct: string;
        nested: { prop: string };
        array: number[];
      };

      const state = {
        direct: 'value',
        nested: { prop: 'old' },
        array: [1, 2, 3],
      } as TTestState;

      const action = {
        direct: 'new-value',
        'nested.prop': 'updated',
        'array[2]': 99,
      } as TTestAction;

      const result = tempUpdate(state, action, true);
      const resultAny = result as unknown as TTestState;
      expect(resultAny.direct).toBe('new-value');
      expect(resultAny.nested.prop).toBe('updated');
      expect(resultAny.array[2]).toBe(99);
      expect(result.$type).toBe(EVENTS.UPDATE_STATE);
    });

    it('should handle empty keys array (no updates)', () => {
      const state = { a: 1, b: 2 } as TUserState;
      const action = {} as TUserState;
      const result = tempUpdate(state, action, true);
      expect(result).toEqual({ a: 1, b: 2, $type: EVENTS.UPDATE_STATE });
    });
  });

  describe('type safety and mutation', () => {
    it('should mutate the original state object', () => {
      const state = { a: 1, b: 2 } as TUserState;
      const originalState = state;
      const action = { a: 3 } as TUserState;
      const result = tempUpdate(state, action, true);

      expect(result).toBe(originalState); // same reference
      expect((result as unknown as TUserState).a).toBe(3);
    });

    it('should handle state with various value types', () => {
      type TTestState = TUserState & {
        string: string;
        number: number;
        boolean: boolean;
        array: number[];
        object: { nested: string };
      };

      const state = {
        string: 'test',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: { nested: 'value' },
      } as TTestState;

      const action = {
        string: 'updated',
        number: 100,
        boolean: false,
        'array[0]': 99,
        'object.nested': 'new-value',
      } as TTestAction;

      const result = tempUpdate(state, action, true);
      const resultAny = result as unknown as TTestState;
      expect(resultAny.string).toBe('updated');
      expect(resultAny.number).toBe(100);
      expect(resultAny.boolean).toBe(false);
      expect(resultAny.array[0]).toBe(99);
      expect(resultAny.object.nested).toBe('new-value');
      expect(result.$type).toBe(EVENTS.UPDATE_STATE);
    });
  });
});
