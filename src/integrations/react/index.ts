/**
 * React integration for Substate
 *
 * This module provides React hooks for using Substate stores in React components.
 *
 * @example
 * ```typescript
 * import { createStore } from 'substate';
 * import { useSubstate, useSubstateActions } from 'substate/react';
 *
 * const store = createStore({
 *   name: 'Counter',
 *   state: { count: 0 }
 * });
 *
 * function Counter() {
 *   const count = useSubstate(store, state => state.count);
 *   const { updateState } = useSubstateActions(store);
 *
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={() => updateState({ count: count + 1 })}>
 *         Increment
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */

// Export types for consumers
export type {
  Selector,
  StateSelector,
  StringSelector,
  SubstateActions,
  UseSubstateHook,
} from './types';
export { useSubstate } from './useSubstate';
export { useSubstateActions } from './useSubstateActions';
