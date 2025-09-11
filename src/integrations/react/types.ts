import type { TState } from '../../core/Substate/interfaces';
import type { ISubstate } from '../../core/Substate/Substate.interface';

// Simple state type alias
type State = TState;

/**
 * Selector function that extracts a value from the store state
 * @template TSubstateState - Your state type
 * @template TReturn - The type this selector returns
 */
export type StateSelector<TSubstateState extends State = State, TReturn = unknown> = (
  state: TSubstateState
) => TReturn;

/**
 * String selector for accessing nested properties (e.g., "user.name")
 */
export type StringSelector = string;

/**
 * All supported selector types
 */
export type Selector<TSubstateState extends State = State> =
  | StateSelector<TSubstateState>
  | StringSelector;

/**
 * Actions available on the store (for useSubstateActions hook)
 * @template TSubstateState - Your state type
 */
export interface SubstateActions<TSubstateState extends State = State> {
  // Core state methods
  updateState: ISubstate<TSubstateState>['updateState'];
  resetState: ISubstate<TSubstateState>['resetState'];
  getCurrentState: ISubstate<TSubstateState>['getCurrentState'];
  getState: ISubstate<TSubstateState>['getState'];
  getProp: ISubstate<TSubstateState>['getProp'];

  // History management
  clearHistory: ISubstate<TSubstateState>['clearHistory'];
  limitHistory: ISubstate<TSubstateState>['limitHistory'];
  getMemoryUsage: ISubstate<TSubstateState>['getMemoryUsage'];

  // Tagged states
  jumpToTag: ISubstate<TSubstateState>['jumpToTag'];
  getTaggedState: ISubstate<TSubstateState>['getTaggedState'];
  getAvailableTags: ISubstate<TSubstateState>['getAvailableTags'];
  removeTag: ISubstate<TSubstateState>['removeTag'];
  clearTags: ISubstate<TSubstateState>['clearTags'];

  // Sync functionality
  sync: ISubstate<TSubstateState>['sync'];

  // Event methods (from PubSub)
  on: ISubstate<TSubstateState>['on'];
  off: ISubstate<TSubstateState>['off'];
  emit: ISubstate<TSubstateState>['emit'];
}

/**
 * Hook overloads for useSubstate with different selector types
 *
 * @example
 * // Define your state type
 * interface AppState {
 *   count: number;
 *   user: { name: string; age: number };
 * }
 *
 * // Get entire state
 * const state = useSubstate(store); // Returns AppState & IState
 *
 * // Get specific property with function selector
 * const count = useSubstate(store, state => state.count); // Returns number
 *
 * // Get nested property with string selector
 * const userName = useSubstate(store, 'user.name'); // Returns unknown
 */
export interface UseSubstateHook {
  // No selector - returns entire state
  <TSubstateState extends State = State>(store: ISubstate<TSubstateState>): TSubstateState;

  // Function selector - returns selected value with type inference
  <TSubstateState extends State = State, TReturn = unknown>(
    store: ISubstate<TSubstateState>,
    selector: StateSelector<TSubstateState, TReturn>
  ): TReturn;

  // String selector - returns unknown (since we can't infer dot notation types)
  <TSubstateState extends State = State>(
    store: ISubstate<TSubstateState>,
    selector: StringSelector
  ): unknown;
}
