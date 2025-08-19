import { Substate } from '../Substate/Substate';
import type { IConfig } from '../Substate/Substate.interface';
import type { ICreateStoreConfig } from './createStore.interface';

/**
 * Factory function to create a new Substate store
 * @template TState - The type of the state object
 * @param config - Configuration object for the store
 * @returns A new Substate instance with typed state
 */
function createStore<TState extends Record<string, unknown> = Record<string, unknown>>(
  config: ICreateStoreConfig<TState>
): Substate<TState> {
  const substateConfig: IConfig<TState> = {
    name: config.name,
    state: config.state,
    defaultDeep: config.defaultDeep ?? false,
    beforeUpdate: config.beforeUpdate || [],
    afterUpdate: config.afterUpdate || [],
    maxHistorySize: config.maxHistorySize ?? 50,
  };

  return new Substate<TState>(substateConfig);
}

export { createStore };
