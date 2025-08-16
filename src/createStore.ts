import Substate, { type IConfig } from "./Substate";

export interface ICreateStoreConfig {
  name: string;
  state?: object;
  defaultDeep?: boolean;
  beforeUpdate?: Function[];
  afterUpdate?: Function[];
}

/**
 * Factory function to create a new Substate store
 * @param config - Configuration object for the store
 * @returns A new Substate instance
 */
export function createStore(config: ICreateStoreConfig): Substate {
  const substateConfig: IConfig = {
    name: config.name,
    state: config.state,
    defaultDeep: config.defaultDeep ?? false,
    beforeUpdate: config.beforeUpdate || [],
    afterUpdate: config.afterUpdate || [],
  };

  return new Substate(substateConfig);
}
