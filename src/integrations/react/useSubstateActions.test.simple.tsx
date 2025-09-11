import React from 'react';
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { render, act, renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createStore, type TState } from '../../index';
import { useSubstateActions } from './useSubstateActions';

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

describe('useSubstateActions React Hook', () => {
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

  describe('Method availability', () => {
    test('should provide all expected methods', () => {
      const { result } = renderHook(() => useSubstateActions(store));

      // Core state methods
      expect(typeof result.current.updateState).toBe('function');
      expect(typeof result.current.resetState).toBe('function');
      expect(typeof result.current.getCurrentState).toBe('function');
      expect(typeof result.current.getState).toBe('function');
      expect(typeof result.current.getProp).toBe('function');

      // History management
      expect(typeof result.current.clearHistory).toBe('function');
      expect(typeof result.current.limitHistory).toBe('function');
      expect(typeof result.current.getMemoryUsage).toBe('function');

      // Tagged states
      expect(typeof result.current.jumpToTag).toBe('function');
      expect(typeof result.current.getTaggedState).toBe('function');
      expect(typeof result.current.getAvailableTags).toBe('function');
      expect(typeof result.current.removeTag).toBe('function');
      expect(typeof result.current.clearTags).toBe('function');

      // Sync functionality
      expect(typeof result.current.sync).toBe('function');

      // Event methods
      expect(typeof result.current.on).toBe('function');
      expect(typeof result.current.off).toBe('function');
      expect(typeof result.current.emit).toBe('function');
    });
  });

  describe('Method functionality', () => {
    test('should be able to update state', () => {
      const { result } = renderHook(() => useSubstateActions(store));

      expect(store.getCurrentState().count).toBe(0);

      act(() => {
        result.current.updateState({ count: 5 });
      });

      expect(store.getCurrentState().count).toBe(5);
    });

    test('should be able to reset state', () => {
      const { result } = renderHook(() => useSubstateActions(store));

      // Update state first
      act(() => {
        result.current.updateState({ count: 10 });
      });
      expect(store.getCurrentState().count).toBe(10);

      // Reset state
      act(() => {
        result.current.resetState();
      });
      expect(store.getCurrentState().count).toBe(0);
    });

    test('should be able to get current state', () => {
      const { result } = renderHook(() => useSubstateActions(store));

      const currentState = result.current.getCurrentState();
      expect(currentState).toEqual(store.getCurrentState());
    });

    test('should be able to get property', () => {
      const { result } = renderHook(() => useSubstateActions(store));

      const userName = result.current.getProp('user.name');
      expect(userName).toBe('John');
    });

    test('should be able to get state from history', () => {
      const { result } = renderHook(() => useSubstateActions(store));

      const stateAtIndex0 = result.current.getState(0);
      expect(stateAtIndex0).toEqual(store.getCurrentState());
    });
  });

  describe('History and tagging functionality', () => {
    test('should be able to manage history', () => {
      const { result } = renderHook(() => useSubstateActions(store));

      // Make some state changes to create history
      act(() => {
        result.current.updateState({ count: 1 });
        result.current.updateState({ count: 2 });
        result.current.updateState({ count: 3 });
      });

      // Test memory usage
      const memoryUsage = result.current.getMemoryUsage();
      expect(typeof memoryUsage).toBe('object');
      expect(memoryUsage).toHaveProperty('stateCount');

      // Test limit history
      act(() => {
        result.current.limitHistory(2);
      });

      // Test clear history
      act(() => {
        result.current.clearHistory();
      });
    });

    test('should be able to manage tags', () => {
      const { result } = renderHook(() => useSubstateActions(store));

      // Create a tagged state
      act(() => {
        result.current.updateState({ count: 5, $tag: 'checkpoint-1' });
      });

      // Test get available tags
      const availableTags = result.current.getAvailableTags();
      expect(Array.isArray(availableTags)).toBe(true);

      // Test get tagged state
      const taggedState = result.current.getTaggedState('checkpoint-1');
      expect(taggedState).toBeDefined();

      // Test jump to tag
      act(() => {
        result.current.updateState({ count: 10 });
      });
      expect(store.getCurrentState().count).toBe(10);

      act(() => {
        result.current.jumpToTag('checkpoint-1');
      });
      expect(store.getCurrentState().count).toBe(5);

      // Test remove tag
      act(() => {
        result.current.removeTag('checkpoint-1');
      });

      // Test clear tags
      act(() => {
        result.current.clearTags();
      });
    });
  });

  describe('Event handling', () => {
    test('should be able to handle events', () => {
      const { result } = renderHook(() => useSubstateActions(store));

      const eventHandler = vi.fn();
      
      // Test on method
      act(() => {
        result.current.on('STATE_UPDATED', eventHandler);
      });

      // Test emit method
      act(() => {
        result.current.emit('STATE_UPDATED', store.getCurrentState());
      });

      expect(eventHandler).toHaveBeenCalledWith(store.getCurrentState());

      // Test off method
      act(() => {
        result.current.off('STATE_UPDATED', eventHandler);
      });

      // Emit again to verify handler was removed
      act(() => {
        result.current.emit('STATE_UPDATED', store.getCurrentState());
      });

      expect(eventHandler).toHaveBeenCalledTimes(1); // Should not be called again
    });
  });

  describe('Memoization', () => {
    test('should memoize the actions object', () => {
      const { result, rerender } = renderHook(() => useSubstateActions(store));

      const firstResult = result.current;

      // Rerender with same store
      rerender();

      // Should return the same object reference due to memoization
      expect(result.current).toBe(firstResult);
    });

    test('should create new actions object when store changes', () => {
      const { result, rerender } = renderHook(
        ({ store }) => useSubstateActions(store),
        { initialProps: { store } }
      );

      const firstResult = result.current;

      // Create a new store
      const newStore = createStore<TestState>({
        name: 'NewStore',
        state: { 
          count: 0, 
          user: { name: 'Jane', email: 'jane@example.com' }, 
          items: [], 
          lastUpdated: Date.now() 
        },
      });

      // Rerender with new store
      rerender({ store: newStore });

      // Should return a different object reference
      expect(result.current).not.toBe(firstResult);
    });
  });

  describe('Component integration', () => {
    test('should work correctly in React components', () => {
      function TestComponent() {
        const actions = useSubstateActions(store);
        
        return (
          <div>
            <button 
              data-testid="increment" 
              onClick={() => actions.updateState({ count: store.getCurrentState().count + 1 })}
            >
              Increment
            </button>
            <button data-testid="reset" onClick={() => actions.resetState()}>
              Reset
            </button>
            <span data-testid="count">{store.getCurrentState().count}</span>
          </div>
        );
      }

      const { getByTestId } = render(<TestComponent />);
      
      expect(getByTestId('count')).toHaveTextContent('0');

      act(() => {
        getByTestId('increment').click();
      });

      expect(getByTestId('count')).toHaveTextContent('1');

      act(() => {
        getByTestId('reset').click();
      });

      expect(getByTestId('count')).toHaveTextContent('0');
    });
  });

  describe('Performance considerations', () => {
    test('should not cause unnecessary re-renders', () => {
      let renderCount = 0;
      
      function TestComponent() {
        renderCount++;
        const actions = useSubstateActions(store);
        return <span>{actions.getCurrentState().count}</span>;
      }

      render(<TestComponent />);
      expect(renderCount).toBe(1);

      // Update state - component shouldn't re-render just because we have actions
      act(() => {
        store.updateState({ count: 1 });
      });

      // Should still be 1 since useSubstateActions doesn't cause re-renders
      expect(renderCount).toBe(1);
    });

    test('should maintain stable references across re-renders', () => {
      const { result, rerender } = renderHook(() => useSubstateActions(store));

      const initialActions = result.current;

      // Force re-render
      rerender();

      // Should be the same object due to useMemo
      expect(result.current).toBe(initialActions);
      expect(result.current.updateState).toBe(initialActions.updateState);
      expect(result.current.resetState).toBe(initialActions.resetState);
    });
  });
});
