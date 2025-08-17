import type { IPubSub } from '../PubSub/PubSub.interface';

// Type definitions for middleware functions
type BeforeMiddleware = (value: unknown, context: SyncContext) => unknown;
type AfterMiddleware = (value: unknown, context: SyncContext) => void;
type UpdateMiddleware = (store: ISubstate, action: IState) => void;

interface SyncContext {
  source: string;
  field: string;
  readField: string;
}

interface IState {
  [key: string]: unknown;
  $type?: string;
  $deep?: boolean;
  $tag?: string;
}

/**
 * Configuration object for the sync method
 * @interface ISyncConfig
 */
interface ISyncConfig {
  /**
   * The target object to synchronize state values to (e.g., a UI model)
   * @type {Record<string, unknown>}
   */
  readerObj: Record<string, unknown>;

  /**
   * The property name in the store's state to watch for changes
   * Supports nested properties using dot notation (e.g., "user.profile.name")
   * @type {string}
   */
  stateField: string;

  /**
   * The property name in readerObj to update when stateField changes
   * If not provided, defaults to the value of stateField
   * @type {string}
   * @optional
   */
  readField?: string;

  /**
   * Array of transformation functions applied to the value before syncing
   * Each function receives (value, context) and should return the transformed value
   * Functions are applied in sequence, with each receiving the output of the previous
   * @type {BeforeMiddleware[]}
   * @optional
   * @example
   * // Transform username to uppercase then add prefix
   * beforeMiddleware: [
   *   (value) => value.toUpperCase(),
   *   (value) => `User: ${value}`
   * ]
   */
  beforeMiddleware?: BeforeMiddleware[];

  /**
   * Array of functions called after syncing for side effects (logging, notifications, etc.)
   * Each function receives (value, context) where value is the final synced value
   * These functions should not return anything as their return values are ignored
   * @type {AfterMiddleware[]}
   * @optional
   * @example
   * // Log changes and trigger UI update
   * afterMiddleware: [
   *   (value) => console.log(`Synced: ${value}`),
   *   (value) => triggerRerender()
   * ]
   */
  afterMiddleware?: AfterMiddleware[];
}

/**
 * Interface defining the public API of the Substate class
 * Extends IPubSub to inherit event management capabilities
 */
interface ISubstate extends IPubSub {
  /** Name identifier for this Substate instance */
  name: string;

  /** Array of functions called after each state update */
  afterUpdate: UpdateMiddleware[] | [];

  /** Array of functions called before each state update */
  beforeUpdate: UpdateMiddleware[] | [];

  /** Index pointing to the current state in the state history */
  currentState: number;

  /** Array storing the complete state history */
  stateStorage: IState[];

  /** Default setting for deep cloning during state updates */
  defaultDeep: boolean;

  /** Maximum number of states to keep in history (default: 50) */
  maxHistorySize: number;

  /** Retrieves a specific state from history by index */
  getState(index: number): IState;

  /** Gets the current active state object */
  getCurrentState(): IState;

  /** Extracts a property value from current state using dot notation */
  getProp(prop: string): unknown;

  /** Resets state to the initial state (index 0) */
  resetState(): void;

  /** Updates the current state with new values and emits change events */
  updateState(action: IState): void;

  /**
   * Establishes unidirectional sync between state property and target object
   * @param config - Sync configuration including target object and middleware
   * @returns Function to call for cleanup (unsync)
   */
  sync(config: ISyncConfig): () => void;

  /** Clears all state history except the current state */
  clearHistory(): void;

  /** Sets a new limit for state history size and trims if necessary */
  limitHistory(maxSize: number): void;

  /** Returns estimated memory usage information for the store */
  getMemoryUsage(): { stateCount: number; taggedCount: number; estimatedSizeKB: number | null };

  /** Retrieves a tagged state by its tag name */
  getTaggedState(tag: string): IState | undefined;

  /** Returns an array of all available tag names */
  getAvailableTags(): string[];

  /** Jumps to a tagged state, making it the current state */
  jumpToTag(tag: string): void;

  /** Removes a tag from the tagged states collection */
  removeTag(tag: string): void;

  /** Clears all tagged states */
  clearTags(): void;
}

interface IConfig {
  name?: string;
  afterUpdate?: UpdateMiddleware[] | [];
  beforeUpdate?: UpdateMiddleware[] | [];
  currentState?: number;
  stateStorage?: IState[];
  defaultDeep?: boolean;
  state?: object;
  maxHistorySize?: number;
}

interface IChangeStateAction extends IState {
  $requestedState: number;
}

export type {
  IState,
  ISyncConfig,
  ISubstate,
  IConfig,
  IChangeStateAction,
  BeforeMiddleware,
  AfterMiddleware,
  UpdateMiddleware,
  SyncContext,
};
