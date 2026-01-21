import type { ISubstate } from './Substate.interface';

// #region State Interfaces
type TStateKeywords = {
  $type?: string;
  $deep?: boolean;
  $tag?: string;
  [key: string]: unknown;
};

type TUserState = object & TStateKeywords;
// #endregion

// #region Middleware Interfaces
type TUpdateMiddleware = (store: ISubstate, action: Partial<TUserState>) => void;
// #endregion

// #region Sync Interfaces
type TSyncMiddleware = (value: unknown, context: ISyncContext, store: ISubstate) => unknown;

type TSyncConfig = {
  readerObj: Record<string, unknown> | object;
  stateField: string;
  readField?: string;
  /**
   * @deprecated `syncEvents` is deprecated and will be removed in a future major version.
   * Substate emits `STATE_UPDATED` by default. If you pass a custom `$type` to `updateState`,
   * Substate emits that event name instead of `STATE_UPDATED`.
   *
   * This option lets you choose which event(s) the sync should subscribe to.
   */
  syncEvents?: string | string[];
  beforeUpdate?: TSyncMiddleware[];
  afterUpdate?: TSyncMiddleware[];
};

interface ISyncContext {
  source: string;
  field: string;
  readField: string;
}
// #endregion

export type { TUserState, TUpdateMiddleware, TSyncMiddleware, TSyncConfig, ISyncContext };
