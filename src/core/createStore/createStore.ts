import type { TState } from '../Substate/interfaces';
import { Substate } from '../Substate/Substate';
import type { ISubstateConfig } from '../Substate/Substate.interface';

/**
 * Creates a new Substate store instance
 *
 * @param config - Configuration options for the store
 * @returns A new Substate store instance
 *
 * @example
 * // Basic usage
 * const store = createStore({
 *   state: { count: 0, user: { name: "John" } }
 * });
 *
 * @example
 * // With middleware
 * const store = createStore({
 *   state: { data: [] },
 *   beforeUpdate: [(store, action) => console.log("Before:", action)],
 *   afterUpdate: [(store, action) => console.log("After:", action)]
 * });
 */
function createStore<TSubstateState extends TState = TState>(
  config: ISubstateConfig<TSubstateState> = {} as ISubstateConfig<TSubstateState>
): Substate<TSubstateState> {
  return new Substate<TSubstateState>({
    name: config.name,
    state: config.state,
    defaultDeep: config.defaultDeep ?? false,
    beforeUpdate: config.beforeUpdate || [],
    afterUpdate: config.afterUpdate || [],
    maxHistorySize: config.maxHistorySize ?? 50,
  });
}

export { createStore };
