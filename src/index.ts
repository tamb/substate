// 🎯 Main API - Simple and intuitive
export { createStore } from './core/createStore/createStore';
// 🔧 Common types you'll need
export type { IPubSub } from './core/PubSub/PubSub.interface';
export type {
  ISyncContext,
  TState,
  TSyncConfig,
  TSyncMiddleware,
  TUpdateMiddleware,
} from './core/Substate/interfaces';
// The Substate class itself (for advanced usage)
export { Substate } from './core/Substate/Substate';
export type {
  ISubstate,
  ISubstateConfig as CreateStoreConfig,
  ISyncInstance,
} from './core/Substate/Substate.interface';
