import type { TUserState } from '../../core/Substate/interfaces';
import type { ISubstate } from '../../core/Substate/Substate.interface';

// Simple state type alias
type State = TUserState;

/**
 * Selector function that extracts a value from the store state
 */
export type StateSelector<TState extends State = State, TReturn = unknown> = (
  state: TState
) => TReturn;

/**
 * String selector using dot notation for nested property access
 */
export type StringSelector = string;

/**
 * Union type for all supported selector types
 */
export type Selector<TState extends State = State> = StateSelector<TState> | StringSelector;

/**
 * Return type for useSubstateActions hook containing all bound store methods
 */
export interface SubstateActions<TState extends State = State> {
  // Core state methods
  updateState: ISubstate<TState>['updateState'];
  resetState: ISubstate<TState>['resetState'];
  getCurrentState: ISubstate<TState>['getCurrentState'];
  getState: ISubstate<TState>['getState'];
  getProp: ISubstate<TState>['getProp'];

  // History management
  clearHistory: ISubstate<TState>['clearHistory'];
  limitHistory: ISubstate<TState>['limitHistory'];
  getMemoryUsage: ISubstate<TState>['getMemoryUsage'];

  // Tagged states
  jumpToTag: ISubstate<TState>['jumpToTag'];
  getTaggedState: ISubstate<TState>['getTaggedState'];
  getAvailableTags: ISubstate<TState>['getAvailableTags'];
  removeTag: ISubstate<TState>['removeTag'];
  clearTags: ISubstate<TState>['clearTags'];

  // Sync functionality
  sync: ISubstate<TState>['sync'];

  // Event methods (from PubSub)
  on: ISubstate<TState>['on'];
  off: ISubstate<TState>['off'];
  emit: ISubstate<TState>['emit'];
}

/**
 * Hook overloads for useSubstate with different selector types
 */
export interface UseSubstateHook {
  // No selector - returns entire state
  <TState extends State = State>(store: ISubstate<TState>): TState;

  // Function selector - returns selected value with type inference
  <TState extends State = State, TReturn = unknown>(
    store: ISubstate<TState>,
    selector: StateSelector<TState, TReturn>
  ): TReturn;

  // String selector - returns unknown (since we can't infer dot notation types)
  <TState extends State = State>(store: ISubstate<TState>, selector: StringSelector): unknown;
}
