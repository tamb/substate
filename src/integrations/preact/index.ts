/**
 * Preact integration for Substate
 *
 * This module provides Preact hooks for using Substate stores in Preact components.
 * The implementation reuses the React hooks but imports from 'preact/hooks' instead.
 *
 * @example
 * ```typescript
 * import { createStore } from 'substate';
 * import { useSubstate, useSubstateActions } from 'substate/preact';
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
} from '../react/types';
// Use dedicated Preact implementations that import from 'preact/hooks'
export { useSubstate } from './useSubstate';
export { useSubstateActions } from './useSubstateActions';
