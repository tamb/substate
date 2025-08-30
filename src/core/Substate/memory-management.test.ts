import { beforeEach, describe, expect, test, vi } from 'vitest';
import { createStore } from '../createStore/createStore';
import { Substate } from './Substate';
import type { IState } from './Substate.interface';

describe('Memory Management Features', () => {
  let store: Substate;

  describe('maxHistorySize configuration', () => {
    test('should default to 50 states when not specified', () => {
      const defaultStore = new Substate({ name: 'DefaultStore' });
      expect(defaultStore.maxHistorySize).toBe(50);
    });

    test('should respect custom maxHistorySize in constructor', () => {
      const customStore = new Substate({
        name: 'CustomStore',
        maxHistorySize: 10,
      });
      expect(customStore.maxHistorySize).toBe(10);
    });

    test('should respect maxHistorySize in createStore', () => {
      const store = createStore({
        name: 'CreateStoreTest',
        maxHistorySize: 25,
      });
      expect(store.maxHistorySize).toBe(25);
    });

    test('should use default of 50 when maxHistorySize not specified in createStore', () => {
      const store = createStore({
        name: 'CreateStoreDefault',
      });
      expect(store.maxHistorySize).toBe(50);
    });
  });

  describe('automatic history trimming', () => {
    beforeEach(() => {
      store = new Substate({
        name: 'TrimStore',
        state: { counter: 0 },
        maxHistorySize: 5,
      });
    });

    test('should not trim history when under limit', () => {
      // Make 3 updates (total: initial + 3 = 4 states)
      store.updateState({ counter: 1 });
      store.updateState({ counter: 2 });
      store.updateState({ counter: 3 });

      expect(store.stateStorage.length).toBe(4);
      expect(store.currentState).toBe(3);
      expect(store.getCurrentState().counter).toBe(3);
    });

    test('should trim oldest states when exceeding limit', () => {
      // Make 6 updates (would be 7 states total, exceeds limit of 5)
      for (let i = 1; i <= 6; i++) {
        store.updateState({ counter: i });
      }

      expect(store.stateStorage.length).toBe(5);
      expect(store.currentState).toBe(4);
      expect(store.getCurrentState().counter).toBe(6);

      // Should have states for counter values: 2, 3, 4, 5, 6
      // (original + counter:1 should have been trimmed)
      expect(store.getState(0).counter).toBe(2);
      expect(store.getState(1).counter).toBe(3);
      expect(store.getState(4).counter).toBe(6);
    });

    test('should maintain current state correctness after trimming', () => {
      // Add many states
      for (let i = 1; i <= 10; i++) {
        store.updateState({ counter: i });
      }

      // Verify we can still access current state correctly
      expect(store.getCurrentState().counter).toBe(10);
      expect(store.stateStorage.length).toBe(5);

      // Add one more and verify continuity
      store.updateState({ counter: 11 });
      expect(store.getCurrentState().counter).toBe(11);
      expect(store.stateStorage.length).toBe(5);
    });
  });

  describe('clearHistory method', () => {
    beforeEach(() => {
      store = new Substate({
        name: 'ClearStore',
        state: { data: 'initial' },
      });
    });

    test('should clear all history except current state', () => {
      // Add several states
      store.updateState({ data: 'first' });
      store.updateState({ data: 'second' });
      store.updateState({ data: 'third' });

      expect(store.stateStorage.length).toBe(4);
      expect(store.currentState).toBe(3);

      // Clear history
      store.clearHistory();

      expect(store.stateStorage.length).toBe(1);
      expect(store.currentState).toBe(0);
      expect(store.getCurrentState().data).toBe('third');
    });

    test('should emit HISTORY_CLEARED event with correct data', () => {
      const mockListener = vi.fn();
      store.on('HISTORY_CLEARED', mockListener);

      // Add some states
      store.updateState({ data: 'test1' });
      store.updateState({ data: 'test2' });

      store.clearHistory();

      expect(mockListener).toHaveBeenCalledWith({ previousLength: 3 });
    });

    test('should work correctly when called multiple times', () => {
      store.updateState({ data: 'test' });

      store.clearHistory();
      expect(store.stateStorage.length).toBe(1);

      store.clearHistory();
      expect(store.stateStorage.length).toBe(1);
      expect(store.getCurrentState().data).toBe('test');
    });
  });

  describe('limitHistory method', () => {
    beforeEach(() => {
      store = new Substate({
        name: 'LimitStore',
        state: { value: 0 },
        maxHistorySize: 10,
      });
    });

    test('should update maxHistorySize property', () => {
      expect(store.maxHistorySize).toBe(10);

      store.limitHistory(5);
      expect(store.maxHistorySize).toBe(5);
    });

    test('should trim history when new limit is smaller', () => {
      // Add 8 states (9 total with initial)
      for (let i = 1; i <= 8; i++) {
        store.updateState({ value: i });
      }

      expect(store.stateStorage.length).toBe(9);

      // Limit to 5 states
      store.limitHistory(5);

      expect(store.stateStorage.length).toBe(5);
      expect(store.maxHistorySize).toBe(5);
      expect(store.currentState).toBe(4);
      expect(store.getCurrentState().value).toBe(8);
    });

    test('should not affect history when new limit is larger', () => {
      // Add 3 states
      store.updateState({ value: 1 });
      store.updateState({ value: 2 });
      store.updateState({ value: 3 });

      expect(store.stateStorage.length).toBe(4);

      // Increase limit
      store.limitHistory(20);

      expect(store.stateStorage.length).toBe(4);
      expect(store.maxHistorySize).toBe(20);
      expect(store.getCurrentState().value).toBe(3);
    });

    test('should throw error for invalid limit', () => {
      expect(() => store.limitHistory(0)).toThrow('History size must be at least 1');
      expect(() => store.limitHistory(-5)).toThrow('History size must be at least 1');
    });

    test('should emit HISTORY_LIMIT_CHANGED event', () => {
      const mockListener = vi.fn();
      store.on('HISTORY_LIMIT_CHANGED', mockListener);

      store.limitHistory(15);

      expect(mockListener).toHaveBeenCalledWith({
        previousSize: 10,
        newSize: 15,
        currentHistoryLength: 1,
      });
    });

    test('should work with minimum limit of 1', () => {
      store.updateState({ value: 1 });
      store.updateState({ value: 2 });

      store.limitHistory(1);

      expect(store.stateStorage.length).toBe(1);
      expect(store.maxHistorySize).toBe(1);
      expect(store.getCurrentState().value).toBe(2);
    });
  });

  describe('getMemoryUsage method', () => {
    beforeEach(() => {
      store = new Substate({
        name: 'MemoryStore',
        state: { data: 'test' },
      });
    });

    test('should return correct state count', () => {
      const initialUsage = store.getMemoryUsage();
      expect(initialUsage.stateCount).toBe(1);

      store.updateState({ data: 'updated' });
      store.updateState({ data: 'updated2' });

      const updatedUsage = store.getMemoryUsage();
      expect(updatedUsage.stateCount).toBe(3);
    });

    test('should return estimated size in KB', () => {
      const usage = store.getMemoryUsage();

      expect(usage.estimatedSizeKB).toBeGreaterThanOrEqual(1);
      expect(typeof usage.estimatedSizeKB).toBe('number');
    });

    test('should show increased memory usage with more states', () => {
      const initialUsage = store.getMemoryUsage();

      // Add states with larger data
      for (let i = 0; i < 10; i++) {
        store.updateState({
          data: `large data string with lots of content ${i}`.repeat(10),
        });
      }

      const finalUsage = store.getMemoryUsage();
      expect(finalUsage.stateCount).toBeGreaterThan(initialUsage.stateCount);
      expect(finalUsage.estimatedSizeKB).toBeGreaterThan(initialUsage.estimatedSizeKB!);
    });

    test('should handle empty state storage gracefully', () => {
      // This is a bit artificial since we always have at least one state,
      // but let's test the edge case
      const emptyStore = new Substate({ name: 'EmptyStore' });
      const usage = emptyStore.getMemoryUsage();

      expect(usage.stateCount).toBe(0);
      expect(usage.estimatedSizeKB).toBe(0);
    });

    test('should handle states with complex nested objects', () => {
      const complexState = {
        user: {
          profile: {
            name: 'John Doe',
            settings: {
              theme: 'dark',
              notifications: {
                email: true,
                push: false,
                sms: true,
              },
            },
          },
        },
        data: [1, 2, 3, 4, 5],
        metadata: {
          created: new Date().toISOString(),
          version: '1.0.0',
        },
      };

      store.updateState(complexState);
      const usage = store.getMemoryUsage();

      expect(usage.stateCount).toBe(2);
      expect(usage.estimatedSizeKB).toBeGreaterThan(0);
    });

    test('should handle JSON.stringify errors gracefully', () => {
      // Mock console.error to verify it's called
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Create a state with circular reference that will cause JSON.stringify to throw
      const circularState: IState = { data: 'test' };
      circularState.self = circularState; // Circular reference

      store.updateState(circularState);
      const usage = store.getMemoryUsage();

      // Should return fallback values when JSON.stringify fails
      expect(usage.stateCount).toBe(store.stateStorage.length);
      expect(usage.taggedCount).toBe(store.taggedStates.size);
      expect(usage.estimatedSizeKB).toBeNull();

      // Should log the error
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error estimating memory usage:',
        expect.any(Error)
      );

      // Clean up
      consoleErrorSpy.mockRestore();
    });

    test('should handle edge case with zero sample size in memory estimation', () => {
      const store = new Substate({
        name: 'EdgeCaseStore',
        state: { data: 'test' },
      });

      // Mock Math.min to return 0, forcing the sampleSize to be 0
      // This tests the defensive `: 0` fallback in line 525
      const originalMathMin = Math.min;
      const mathMinSpy = vi.spyOn(Math, 'min').mockImplementation((a: number, b: number) => {
        // For the specific call in getMemoryUsage, return 0 to force the edge case
        if (a === 3) {
          return 0;
        }
        return originalMathMin(a, b);
      });

      try {
        const usage = store.getMemoryUsage();

        // Should still return valid results with defensive programming
        expect(usage.stateCount).toBe(1);
        expect(usage.estimatedSizeKB).toBeGreaterThanOrEqual(1);

        // The sampleSize would be 0, triggering the `: 0` part of the ternary
        // which should result in estimatedBytes = 0 * stateCount = 0
        // But the final result is Math.max(1, ...) so it should be at least 1
      } finally {
        mathMinSpy.mockRestore();
      }
    });
  });

  describe('integration with existing functionality', () => {
    test('should work correctly with resetState', () => {
      const store = new Substate({
        name: 'ResetStore',
        state: { count: 0 },
        maxHistorySize: 5,
      });

      // Add several states
      for (let i = 1; i <= 7; i++) {
        store.updateState({ count: i });
      }

      expect(store.stateStorage.length).toBe(5); // Limited by maxHistorySize

      // Reset state
      store.resetState();

      expect(store.stateStorage.length).toBe(1);
      expect(store.currentState).toBe(0);
      // The reset should keep the original initial state from index 0
      expect(store.getCurrentState().count).toBe(3); // First state that wasn't trimmed
    });

    test('should work with middleware functions', () => {
      const beforeMock = vi.fn();
      const afterMock = vi.fn();

      const store = new Substate({
        name: 'MiddlewareStore',
        state: { value: 0 },
        maxHistorySize: 3,
        beforeUpdate: [beforeMock],
        afterUpdate: [afterMock],
      });

      // Add states that exceed limit
      store.updateState({ value: 1 });
      store.updateState({ value: 2 });
      store.updateState({ value: 3 });

      expect(beforeMock).toHaveBeenCalledTimes(3);
      expect(afterMock).toHaveBeenCalledTimes(3);
      expect(store.stateStorage.length).toBe(3); // Should be limited
    });

    test('should maintain sync functionality with history limits', () => {
      const store = new Substate({
        name: 'SyncStore',
        state: { userName: 'John' },
        maxHistorySize: 2,
      });

      const uiModel = { displayName: '' };

      const synced = store.sync({
        readerObj: uiModel,
        stateField: 'userName',
        readField: 'displayName',
      });

      expect(uiModel.displayName).toBe('John');

      // Update multiple times to trigger history trimming
      store.updateState({ userName: 'Alice' });
      store.updateState({ userName: 'Bob' });

      expect(uiModel.displayName).toBe('Bob');
      expect(store.stateStorage.length).toBe(2);

      synced.unsync();
    });
  });
});
