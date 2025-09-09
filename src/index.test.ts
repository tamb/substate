import { describe, expect, it } from 'vitest';
import { createStore, type ICreateStoreConfig, type ISubstate, Substate } from './index';

describe('Integration tests', () => {
  it('createStore is exported and functional', () => {
    const store = createStore({
      name: 'IntegrationTest',
      state: { test: true },
    });

    expect(store).toBeDefined();
    expect(store.getProp('test')).toBe(true);
  });

  it('types are properly exported', () => {
    // This test ensures TypeScript compilation works
    const config: ICreateStoreConfig = {
      name: 'TypeTest',
    };

    const store: ISubstate = createStore(config);
    expect(store.name).toBe('TypeTest');
  });

  it('should return a new instance of substate', () => {
    const store = createStore({
      name: 'IntegrationTest',
      state: { test: true },
    });

    expect(store instanceof Substate).toBe(true);
    expect(store.name).toBe('IntegrationTest');
  });
});
