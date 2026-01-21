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

/**
 * New v11+ proxy sync config (scoped to a single proxy instance)
 */
type TProxySyncConfig = {
  /**
   * Runs before `updateState` for writes performed via the proxy.
   * Signature matches store middleware: (store, action) => void
   */
  beforeUpdate?: TUpdateMiddleware[];
  /**
   * Runs after `updateState` for writes performed via the proxy.
   * Signature matches store middleware: (store, action) => void
   */
  afterUpdate?: TUpdateMiddleware[];
};

/**
 * Attributes applied to the next write(s) (or a batch commit).
 */
type TProxyAttributesConfig = {
  $tag?: string;
  $deep?: boolean;
  $type?: string;
  before?: TUpdateMiddleware[];
  after?: TUpdateMiddleware[];
};

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

export type {
  TUserState,
  TUpdateMiddleware,
  TSyncMiddleware,
  TSyncConfig,
  ISyncContext,
  TProxySyncConfig,
  TProxyAttributesConfig,
};
