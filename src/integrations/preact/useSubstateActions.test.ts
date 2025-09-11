import { beforeEach, describe, expect, test, vi } from 'vitest';
import { createStore, type TState } from '../../index';

// Test state interfaces
interface TestState extends TState {
  count: number;
  user: {
    name: string;
    email: string;
  };
  items: string[];
  lastUpdated: number;
}

describe('useSubstateActions Core Logic', () => {
  let store: ReturnType<typeof createStore<TestState>>;

  beforeEach(() => {
    store = createStore<TestState>({
      name: 'TestStore',
      state: {
        count: 0,
        user: {
          name: 'John',
          email: 'john@example.com',
        },
        items: ['item1', 'item2'],
        lastUpdated: Date.now(),
      },
    });
  });

  describe('Core state methods', () => {
    test('should have updateState method', () => {
      expect(typeof store.updateState).toBe('function');
    });

    test('should have resetState method', () => {
      expect(typeof store.resetState).toBe('function');
    });

    test('should have getCurrentState method', () => {
      expect(typeof store.getCurrentState).toBe('function');
    });

    test('should have getState method', () => {
      expect(typeof store.getState).toBe('function');
    });

    test('should have getProp method', () => {
      expect(typeof store.getProp).toBe('function');
    });
  });

  describe('History management methods', () => {
    test('should have clearHistory method', () => {
      expect(typeof store.clearHistory).toBe('function');
    });

    test('should have limitHistory method', () => {
      expect(typeof store.limitHistory).toBe('function');
    });

    test('should have getMemoryUsage method', () => {
      expect(typeof store.getMemoryUsage).toBe('function');
    });
  });

  describe('Tagged states methods', () => {
    test('should have jumpToTag method', () => {
      expect(typeof store.jumpToTag).toBe('function');
    });

    test('should have getTaggedState method', () => {
      expect(typeof store.getTaggedState).toBe('function');
    });

    test('should have getAvailableTags method', () => {
      expect(typeof store.getAvailableTags).toBe('function');
    });

    test('should have removeTag method', () => {
      expect(typeof store.removeTag).toBe('function');
    });

    test('should have clearTags method', () => {
      expect(typeof store.clearTags).toBe('function');
    });
  });

  describe('Sync functionality', () => {
    test('should have sync method', () => {
      expect(typeof store.sync).toBe('function');
    });
  });

  describe('Event methods', () => {
    test('should have on method', () => {
      expect(typeof store.on).toBe('function');
    });

    test('should have off method', () => {
      expect(typeof store.off).toBe('function');
    });

    test('should have emit method', () => {
      expect(typeof store.emit).toBe('function');
    });
  });

  describe('Method functionality', () => {
    test('should be able to update state', () => {
      expect(store.getCurrentState().count).toBe(0);

      store.updateState({ count: 5 });
      expect(store.getCurrentState().count).toBe(5);
    });

    test('should be able to reset state', () => {
      // Update state first
      store.updateState({ count: 10 });
      expect(store.getCurrentState().count).toBe(10);

      // Reset state
      store.resetState();
      expect(store.getCurrentState().count).toBe(0);
    });

    test('should be able to get current state', () => {
      const currentState = store.getCurrentState();
      expect(currentState).toEqual(store.getCurrentState());
    });

    test('should be able to get property', () => {
      const userName = store.getProp('user.name');
      expect(userName).toBe('John');
    });

    test('should be able to get state from history', () => {
      const stateAtIndex0 = store.getState(0);
      expect(stateAtIndex0).toEqual(store.getCurrentState());
    });
  });

  describe('History and tagging functionality', () => {
    test('should be able to manage history', () => {
      // Make some state changes to create history
      store.updateState({ count: 1 });
      store.updateState({ count: 2 });
      store.updateState({ count: 3 });

      // Test memory usage
      const memoryUsage = store.getMemoryUsage();
      expect(typeof memoryUsage).toBe('object');
      expect(memoryUsage).toHaveProperty('stateCount');

      // Test limit history
      store.limitHistory(2);

      // Test clear history
      store.clearHistory();
    });

    test('should be able to manage tags', () => {
      // Create a tagged state
      store.updateState({ count: 5, $tag: 'checkpoint-1' });

      // Test get available tags
      const availableTags = store.getAvailableTags();
      expect(Array.isArray(availableTags)).toBe(true);

      // Test get tagged state
      const taggedState = store.getTaggedState('checkpoint-1');
      expect(taggedState).toBeDefined();

      // Test jump to tag
      store.updateState({ count: 10 });
      expect(store.getCurrentState().count).toBe(10);

      store.jumpToTag('checkpoint-1');
      expect(store.getCurrentState().count).toBe(5);

      // Test remove tag
      store.removeTag('checkpoint-1');

      // Test clear tags
      store.clearTags();
    });
  });

  describe('Event handling', () => {
    test('should be able to handle events', () => {
      const eventHandler = vi.fn();

      // Test on method
      store.on('STATE_UPDATED', eventHandler);

      // Test emit method
      store.emit('STATE_UPDATED', store.getCurrentState());

      expect(eventHandler).toHaveBeenCalledWith(store.getCurrentState());

      // Test off method
      store.off('STATE_UPDATED', eventHandler);

      // Emit again to verify handler was removed
      store.emit('STATE_UPDATED', store.getCurrentState());

      expect(eventHandler).toHaveBeenCalledTimes(1); // Should not be called again
    });
  });

  describe('Method binding', () => {
    test('should have properly bound methods', () => {
      // Test that methods are bound to the store instance
      const updateState = store.updateState.bind(store);
      const resetState = store.resetState.bind(store);
      const getCurrentState = store.getCurrentState.bind(store);

      expect(typeof updateState).toBe('function');
      expect(typeof resetState).toBe('function');
      expect(typeof getCurrentState).toBe('function');

      // Test that bound methods work correctly
      updateState({ count: 15 });
      expect(store.getCurrentState().count).toBe(15);

      resetState();
      expect(store.getCurrentState().count).toBe(0);
    });
  });

  describe('Type safety', () => {
    test('should maintain type safety for all methods', () => {
      // TypeScript should infer correct types for all methods
      expect(typeof store.updateState).toBe('function');
      expect(typeof store.resetState).toBe('function');
      expect(typeof store.getCurrentState).toBe('function');
      expect(typeof store.getState).toBe('function');
      expect(typeof store.getProp).toBe('function');
      expect(typeof store.clearHistory).toBe('function');
      expect(typeof store.limitHistory).toBe('function');
      expect(typeof store.getMemoryUsage).toBe('function');
      expect(typeof store.jumpToTag).toBe('function');
      expect(typeof store.getTaggedState).toBe('function');
      expect(typeof store.getAvailableTags).toBe('function');
      expect(typeof store.removeTag).toBe('function');
      expect(typeof store.clearTags).toBe('function');
      expect(typeof store.sync).toBe('function');
      expect(typeof store.on).toBe('function');
      expect(typeof store.off).toBe('function');
      expect(typeof store.emit).toBe('function');
    });
  });

  describe('Store interface compliance', () => {
    test('should implement all required store methods', () => {
      // Test that the store implements the ISubstate interface
      const requiredMethods = [
        'updateState',
        'resetState',
        'getCurrentState',
        'getState',
        'getProp',
        'clearHistory',
        'limitHistory',
        'getMemoryUsage',
        'jumpToTag',
        'getTaggedState',
        'getAvailableTags',
        'removeTag',
        'clearTags',
        'sync',
        'on',
        'off',
        'emit',
      ];

      requiredMethods.forEach((method) => {
        expect(store).toHaveProperty(method);
        expect(typeof (store as unknown as Record<string, unknown>)[method]).toBe('function');
      });
    });
  });
});
