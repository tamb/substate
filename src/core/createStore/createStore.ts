import { Substate } from '../Substate/Substate';
import type { IConfig } from '../Substate/Substate.interface';
import type { ICreateStoreConfig } from './createStore.interface';

/**
 * Factory function to create a new Substate store
 * @param config - Configuration object for the store
 * @returns A new Substate instance
 */
function createStore(config: ICreateStoreConfig): Substate {
  const substateConfig: IConfig = {
    name: config.name,
    state: config.state,
    defaultDeep: config.defaultDeep ?? false,
    beforeUpdate: config.beforeUpdate || [],
    afterUpdate: config.afterUpdate || [],
    maxHistorySize: config.maxHistorySize ?? 50,
  };

  return new Substate(substateConfig);
}

export { createStore };
