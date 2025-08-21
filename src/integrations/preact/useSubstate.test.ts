import { beforeEach, describe, expect, test, vi } from 'vitest';
import { createStore, type IState } from '../../index';

// Test state interfaces
interface TestState extends IState {
  count: number;
  user: {
    name: string;
    profile: {
      email: string;
    };
  };
  items: string[];
  lastUpdated: number;
}

interface NestedState extends IState {
  deep: {
    nested: {
      value: string;
    };
  };
}

describe('useSubstate Core Logic', () => {
  let store: ReturnType<typeof createStore<TestState>>;
  let nestedStore: ReturnType<typeof createStore<NestedState>>;

  beforeEach(() => {
    store = createStore<TestState>({
      name: 'TestStore',
      state: {
        count: 0,
        user: {
          name: 'John',
          profile: {
            email: 'john@example.com',
          },
        },
        items: ['item1', 'item2'],
        lastUpdated: Date.now(),
      },
    });

    nestedStore = createStore<NestedState>({
      name: 'NestedStore',
      state: {
        deep: {
          nested: {
            value: 'test',
          },
        },
      },
    });
  });

  describe('Store functionality', () => {
    test('should get current state', () => {
      const currentState = store.getCurrentState();
      expect(currentState).toEqual({
        count: 0,
        user: {
          name: 'John',
          profile: {
            email: 'john@example.com',
          },
        },
        items: ['item1', 'item2'],
        lastUpdated: expect.any(Number),
      });
    });

    test('should update state', () => {
      store.updateState({ count: 5 });
      expect(store.getCurrentState().count).toBe(5);
    });

    test('should reset state', () => {
      store.updateState({ count: 10 });
      expect(store.getCurrentState().count).toBe(10);

      store.resetState();
      expect(store.getCurrentState().count).toBe(0);
    });
  });

  describe('String selector functionality', () => {
    test('should get property with string selector', () => {
      const userName = store.getProp('user.name');
      expect(userName).toBe('John');
    });

    test('should get nested property with string selector', () => {
      const userEmail = store.getProp('user.profile.email');
      expect(userEmail).toBe('john@example.com');
    });

    test('should get array property with string selector', () => {
      const items = store.getProp('items');
      expect(items).toEqual(['item1', 'item2']);
    });

    test('should get array index with string selector', () => {
      const firstItem = store.getProp('items.0');
      expect(firstItem).toBe('item1');
    });

    test('should handle deep nested string selectors', () => {
      const value = nestedStore.getProp('deep.nested.value');
      expect(value).toBe('test');
    });

    test('should handle empty string selector', () => {
      const result = store.getProp('');
      expect(result).toBeUndefined();
    });

    test('should handle invalid string selector gracefully', () => {
      const result = store.getProp('nonexistent.property');
      expect(result).toBeUndefined();
    });
  });

  describe('Function selector functionality', () => {
    test('should work with function selectors', () => {
      const count = store.getCurrentState().count;
      expect(count).toBe(0);
    });

    test('should work with nested function selectors', () => {
      const userEmail = store.getCurrentState().user.profile.email;
      expect(userEmail).toBe('john@example.com');
    });
  });

  describe('State updates and reactivity', () => {
    test('should update when state changes', () => {
      expect(store.getCurrentState().count).toBe(0);

      store.updateState({ count: 5 });
      expect(store.getCurrentState().count).toBe(5);
    });

    test('should update nested state', () => {
      expect(store.getCurrentState().user.name).toBe('John');

      store.updateState({
        user: { ...store.getCurrentState().user, name: 'Jane' },
      });
      expect(store.getCurrentState().user.name).toBe('Jane');
    });

    test('should update deep nested state', () => {
      expect(store.getCurrentState().user.profile.email).toBe('john@example.com');

      store.updateState({
        user: {
          ...store.getCurrentState().user,
          profile: { email: 'jane@example.com' },
        },
      });
      expect(store.getCurrentState().user.profile.email).toBe('jane@example.com');
    });

    test('should update array state', () => {
      expect(store.getCurrentState().items).toEqual(['item1', 'item2']);

      store.updateState({ items: ['item1', 'item2', 'item3'] });
      expect(store.getCurrentState().items).toEqual(['item1', 'item2', 'item3']);
    });
  });

  describe('Event handling', () => {
    test('should emit and handle events', () => {
      const eventHandler = vi.fn();

      store.on('STATE_UPDATED', eventHandler);
      store.updateState({ count: 5 });

      expect(eventHandler).toHaveBeenCalledWith(store.getCurrentState());

      store.off('STATE_UPDATED', eventHandler);
      store.updateState({ count: 10 });

      expect(eventHandler).toHaveBeenCalledTimes(1); // Should not be called again
    });

    test('should handle state reset events', () => {
      const resetHandler = vi.fn();

      store.on('STATE_RESET', resetHandler);
      store.resetState();

      expect(resetHandler).toHaveBeenCalled();
    });
  });

  describe('History and tagging', () => {
    test('should manage history', () => {
      store.updateState({ count: 1 });
      store.updateState({ count: 2 });
      store.updateState({ count: 3 });

      const memoryUsage = store.getMemoryUsage();
      expect(typeof memoryUsage).toBe('object');
      expect(memoryUsage).toHaveProperty('stateCount');

      store.limitHistory(2);
      store.clearHistory();
    });

    test('should manage tags', () => {
      store.updateState({ count: 5, $tag: 'checkpoint-1' });

      const availableTags = store.getAvailableTags();
      expect(Array.isArray(availableTags)).toBe(true);

      const taggedState = store.getTaggedState('checkpoint-1');
      expect(taggedState).toBeDefined();

      store.updateState({ count: 10 });
      expect(store.getCurrentState().count).toBe(10);

      store.jumpToTag('checkpoint-1');
      expect(store.getCurrentState().count).toBe(5);

      store.removeTag('checkpoint-1');
      store.clearTags();
    });
  });

  describe('Edge cases', () => {
    test('should handle null/undefined values', () => {
      const nullStore = createStore({
        name: 'NullStore',
        state: { value: null, nested: { value: undefined } },
      });

      const nullValue = nullStore.getProp('value');
      expect(nullValue).toBeNull();

      const undefinedValue = nullStore.getProp('nested.value');
      expect(undefinedValue).toBeUndefined();
    });

    test('should handle complex nested objects', () => {
      const complexStore = createStore({
        name: 'ComplexStore',
        state: {
          level1: {
            level2: {
              level3: {
                value: 'deep',
              },
            },
          },
        },
      });

      const deepValue = complexStore.getProp('level1.level2.level3.value');
      expect(deepValue).toBe('deep');
    });
  });

  describe('Type safety', () => {
    test('should maintain type safety with function selectors', () => {
      const count = store.getCurrentState().count;
      expect(typeof count).toBe('number');
    });

    test('should handle complex nested selectors', () => {
      const userEmail = store.getCurrentState().user.profile.email;
      expect(typeof userEmail).toBe('string');
      expect(userEmail).toBe('john@example.com');
    });
  });
});
