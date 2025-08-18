import type { IState, ISubstate } from '../../core/Substate/Substate.interface';

/**
 * Selector function that extracts a value from the store state
 */
export type StateSelector<T = unknown> = (state: IState) => T;

/**
 * String selector using dot notation for nested property access
 */
export type StringSelector = string;

/**
 * Union type for all supported selector types
 */
export type Selector<T = unknown> = StateSelector<T> | StringSelector;

/**
 * Return type for useSubstateActions hook containing all bound store methods
 */
export interface SubstateActions {
  // Core state methods
  updateState: ISubstate['updateState'];
  resetState: ISubstate['resetState'];
  getCurrentState: ISubstate['getCurrentState'];
  getState: ISubstate['getState'];
  getProp: ISubstate['getProp'];

  // History management
  clearHistory: ISubstate['clearHistory'];
  limitHistory: ISubstate['limitHistory'];
  getMemoryUsage: ISubstate['getMemoryUsage'];

  // Tagged states
  jumpToTag: ISubstate['jumpToTag'];
  getTaggedState: ISubstate['getTaggedState'];
  getAvailableTags: ISubstate['getAvailableTags'];
  removeTag: ISubstate['removeTag'];
  clearTags: ISubstate['clearTags'];

  // Sync functionality
  sync: ISubstate['sync'];

  // Event methods (from PubSub)
  on: ISubstate['on'];
  off: ISubstate['off'];
  emit: ISubstate['emit'];
}

/**
 * Hook overloads for useSubstate with different selector types
 */
export interface UseSubstateHook {
  // No selector - returns entire state
  (store: ISubstate): IState;

  // Function selector - returns selected value with type inference
  <T>(store: ISubstate, selector: StateSelector<T>): T;

  // String selector - returns unknown (since we can't infer dot notation types)
  (store: ISubstate, selector: StringSelector): unknown;
}
