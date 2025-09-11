import type { ISubstate } from './Substate.interface';

// #region State Interfaces
type TStateKeywords = {
  $type?: string;
  $deep?: boolean;
  $tag?: string;
  [key: string]: unknown;
};

type TState = object & TStateKeywords;
// #endregion

// #region Middleware Interfaces
type TUpdateMiddleware = (store: ISubstate, action: Partial<TState>) => void;
// #endregion

// #region Sync Interfaces
type TSyncMiddleware = (value: unknown, context: ISyncContext, store: ISubstate) => unknown;

type TSyncConfig = {
  readerObj: Record<string, unknown> | object;
  stateField: string;
  readField?: string;
  beforeUpdate?: TSyncMiddleware[];
  afterUpdate?: TSyncMiddleware[];
};

interface ISyncContext {
  source: string;
  field: string;
  readField: string;
}
// #endregion

export type { TState, TUpdateMiddleware, TSyncMiddleware, TSyncConfig, ISyncContext };
