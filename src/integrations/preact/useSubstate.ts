import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import type { TState } from '../../core/Substate/interfaces';
import type { ISubstate } from '../../core/Substate/Substate.interface';
import type { StateSelector, StringSelector } from './types';

// Simple state type alias
type State = TState;

/**
 * Shallow equality comparison for objects and arrays
 */
function shallowEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (a == null || b == null) return false;

  if (typeof a !== 'object' || typeof b !== 'object') return false;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;

  const keysA = Object.keys(aObj);
  const keysB = Object.keys(bObj);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.hasOwn(bObj, key)) return false;
    if (aObj[key] !== bObj[key]) return false;
  }

  return true;
}

/**
 * Preact hook for subscribing to Substate store changes with optional selector
 *
 * @param store - The Substate store instance
 * @param selector - Optional selector function or string for nested property access
 * @returns Selected state value or entire state if no selector provided
 *
 * @example
 * // Get entire state
 * const state = useSubstate(store);
 *
 * @example
 * // Get specific property with function selector
 * const count = useSubstate(store, state => state.count);
 *
 * @example
 * // Get nested property with string selector
 * const userName = useSubstate(store, 'user.profile.name');
 */
function useSubstate<TSubstateState extends State = State>(
  store: ISubstate<TSubstateState>
): TSubstateState;
function useSubstate<TSubstateState extends State = State, TReturn = unknown>(
  store: ISubstate<TSubstateState>,
  selector: StateSelector<TSubstateState, TReturn>
): TReturn;
function useSubstate<TSubstateState extends State = State>(
  store: ISubstate<TSubstateState>,
  selector: StringSelector
): unknown;
function useSubstate<TSubstateState extends State = State, TReturn = unknown>(
  store: ISubstate<TSubstateState>,
  selector?: StateSelector<TSubstateState, TReturn> | StringSelector
): TReturn | TSubstateState | unknown {
  // Memoize the selector function to prevent unnecessary re-subscriptions
  const memoizedSelector = useCallback(
    (state: TSubstateState) => {
      if (!selector) {
        return state;
      }

      if (typeof selector === 'string') {
        return store.getProp(selector);
      }

      return selector(state);
    },
    [store, selector]
  );

  // Get initial value
  const getSelectedValue = useCallback(() => {
    return memoizedSelector(store.getCurrentState());
  }, [store, memoizedSelector]);

  const [selectedValue, setSelectedValue] = useState(getSelectedValue);

  // Keep track of the last value to implement shallow equality check
  const lastValueRef = useRef(selectedValue);

  useEffect(() => {
    // Update handler that only triggers re-render if selected value actually changed
    const handleStateUpdate = (newState: object) => {
      const newSelectedValue = memoizedSelector(newState as TSubstateState);

      // Only update if the selected value has actually changed (shallow equality)
      if (!shallowEqual(lastValueRef.current, newSelectedValue)) {
        lastValueRef.current = newSelectedValue;
        setSelectedValue(newSelectedValue);
      }
    };

    // Subscribe to store updates and resets
    store.on('STATE_UPDATED', handleStateUpdate);
    store.on('STATE_RESET', handleStateUpdate);

    // Cleanup subscription on unmount or dependency change
    return () => {
      store.off('STATE_UPDATED', handleStateUpdate);
      store.off('STATE_RESET', handleStateUpdate);
    };
  }, [store, memoizedSelector]);

  // Update the current value if store or selector changes
  useEffect(() => {
    const currentValue = getSelectedValue();
    if (!shallowEqual(lastValueRef.current, currentValue)) {
      lastValueRef.current = currentValue;
      setSelectedValue(currentValue);
    }
  }, [getSelectedValue]);

  return selectedValue;
}

export { useSubstate };
