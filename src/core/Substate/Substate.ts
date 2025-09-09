// Third party
import { byString } from 'object-bystring';
import rfdc from 'rfdc';

import { EVENTS } from '../consts';
import { PubSub } from '../PubSub/PubSub';
import { isDeep } from './helpers/isDeep';
import { requiresByString } from './helpers/requiresByString';
import type {
  ISyncContext,
  TSyncConfig,
  TSyncMiddleware,
  TUpdateMiddleware,
  TUserState,
} from './interfaces';
import type { ISubstate, ISubstateConfig, ISyncInstance } from './Substate.interface';

const cloneDeep = rfdc();

class Substate<TState extends TUserState = TUserState> extends PubSub implements ISubstate<TState> {
  name?: string;
  afterUpdate: TUpdateMiddleware[] | [];
  beforeUpdate: TUpdateMiddleware[] | [];
  currentState: number;
  stateStorage: TState[];
  defaultDeep: boolean;
  maxHistorySize: number;
  taggedStates: Map<string, { stateIndex: number; state: TState }>;
  private _hasMiddleware: boolean;
  private _hasTaggedStates: boolean;

  constructor(conf: ISubstateConfig<TState> = {} as ISubstateConfig<TState>) {
    super();

    this.name = conf.name || 'SubStateInstance';
    this.afterUpdate = conf.afterUpdate || [];
    this.beforeUpdate = conf.beforeUpdate || [];
    this.currentState = conf.currentState || 0;
    this.stateStorage = conf.stateStorage || [];
    this.defaultDeep = conf.defaultDeep || false;
    this.maxHistorySize = conf.maxHistorySize || 50;
    this.taggedStates = new Map();

    // Pre-compute middleware flags for performance
    this._hasMiddleware = this.beforeUpdate.length > 0 || this.afterUpdate.length > 0;
    this._hasTaggedStates = false;

    if (conf.state) this.stateStorage.push(conf.state);

    // Optimize event binding by using arrow function to avoid bind overhead
    this.on(EVENTS.UPDATE_STATE, (action: object) => this.updateState(action as TState));
  }

  // #region Public API Methods

  /**
   * Gets a state from the state storage
   * @param index - The index of the state to get
   * @returns The state
   */
  public getState(index: number): TState {
    return this.stateStorage[index];
  }

  /**
   * Gets the current state
   * @returns The current state
   */
  public getCurrentState(): TState {
    return this.stateStorage[this.currentState];
  }

  /**
   * Gets a property from the current state with optimized access
   * @param prop - The property to get
   * @returns The property value
   */
  public getProp(prop: string): unknown {
    const currentState = this.getCurrentState();

    // Fast path for direct property access (most common case)
    if (!requiresByString(prop)) {
      return currentState[prop as keyof TState];
    }

    // Use byString for nested property access
    return byString(currentState, prop);
  }

  /**
   * Resets the state to the initial state
   */
  public resetState(): void {
    this.currentState = 0;
    this.stateStorage = [this.stateStorage[0]];
    this.emit(EVENTS.STATE_RESET);
  }

  /**
   * Updates the state with a new state object
   * @param action - The new state object
   */
  public updateState(action: Partial<TState>): void {
    // Pre-compute keys and cache current state for performance
    const keys = Object.keys(action);
    const currentState = this.getCurrentState();

    // Combined fast path check - single pass through logic
    if (this.canUseFastPathOptimized(action, keys)) {
      this.fastUpdateStateOptimized(action, currentState, keys);
      return;
    }

    // Standard path with full feature support
    if (this._hasMiddleware) {
      this.fireBeforeMiddleware(action);
    }

    // Deep check
    const deep = isDeep(action, this.defaultDeep);

    // State cloning using cached current state
    let newState = this.cloneStateOptimized(deep, currentState);

    // Temp update with pre-computed keys
    newState = this.tempUpdateOptimized(
      newState as TUserState,
      action as TUserState,
      keys,
      this.defaultDeep
    ) as TState;

    // Push state
    this.pushState(newState);

    // Tagged states update
    this.updateTaggedStates(action, newState);

    // After middleware
    if (this._hasMiddleware) {
      this.fireAfterMiddleware(action);
    }

    // Event emission using already computed newState
    this.emit(action.$type || EVENTS.STATE_UPDATED, newState);
  }

  /**
   * Batch update multiple properties at once for better performance
   * @param actions - Array of update actions
   */
  public batchUpdateState(actions: Array<Partial<TState>>): void {
    if (actions.length === 0) return;

    // Fast path for batch updates without middleware, deep cloning, or tagging
    if (!this._hasMiddleware && !this._hasTaggedStates) {
      // Check if all actions can use fast path
      let canUseFastPath = true;
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        if (action.$deep || action.$tag !== undefined) {
          canUseFastPath = false;
          break;
        }

        const keys = Object.keys(action);
        for (let j = 0; j < keys.length; j++) {
          const key = keys[j];
          if (key.includes('.') || key === '$deep' || key === '$type' || key === '$tag') {
            canUseFastPath = false;
            break;
          }
        }
        if (!canUseFastPath) break;
      }

      if (canUseFastPath) {
        this.fastBatchUpdate(actions);
        return;
      }
    }

    // Standard path - process each action individually
    for (let i = 0; i < actions.length; i++) {
      this.updateState(actions[i]);
    }
  }

  /**
   * Establishes a unidirectional synchronization between a state property and a target object property
   *
   * This method creates a live sync relationship where changes to the specified state field
   * automatically update the corresponding property in the target object. The sync is unidirectional,
   * meaning changes to the target object do not affect the state.
   *
   * @param {ISyncConfig} config - Configuration object for the sync operation
   * @returns {ISyncInstance} unsync - Function to call for cleanup that removes the sync listener
   *
   * @example
   * // Basic usage - sync userName to a UI model
   * const store = new Substate({ state: { userName: "John" } });
   * const uiModel = { displayName: "" };
   *
   * const unsync = store.sync({
   *   readerObj: uiModel,
   *   stateField: "userName",
   *   readField: "displayName"
   * });
   *
   * console.log(uiModel.displayName); // "John"
   * store.updateState({ userName: "Alice" }); // uiModel.displayName becomes "Alice"
   * unsync(); // Stop syncing
   *
   * @example
   * // With middleware transformations
   * const unsync = store.sync({
   *   readerObj: uiModel,
   *   stateField: "userName",
   *   readField: "formattedName",
   *   beforeUpdate: [
   *     (value) => value.toUpperCase(),
   *     (value) => `Dr. ${value}`
   *   ],
   *   afterUpdate: [
   *     (value) => console.log(`Name updated to: ${value}`)
   *   ]
   * });
   *
   * @example
   * // Syncing nested properties
   * const store = new Substate({
   *   state: {
   *     user: {
   *       profile: {
   *         email: "user@example.com"
   *       }
   *     }
   *   }
   * });
   *
   * const unsync = store.sync({
   *   readerObj: viewModel,
   *   stateField: "user.profile.email",
   *   readField: "email"
   * });
   *
   * @since 10.0.0
   */
  public sync(config: TSyncConfig): ISyncInstance {
    // Destructure configuration with defaults
    const {
      readerObj,
      stateField,
      readField = stateField, // Default to stateField if readField not provided
      beforeUpdate = [], // Default to empty array if no middleware
      afterUpdate = [], // Default to empty array if no middleware
    } = config;

    // Check if the fields exist using byString to support dot notation
    this.validateSyncFields(stateField);

    /**
     * Applies the beforeUpdate transformation chain to a value
     * Each middleware function receives the transformed value, sync context, and substate instance
     */
    const applyBeforeUpdate = (value: unknown): unknown => {
      const context: ISyncContext = {
        source: 'substate',
        field: stateField,
        readField,
      };

      let transformedValue = value;

      // Apply each middleware function in sequence
      beforeUpdate.forEach((middleware: TSyncMiddleware) => {
        transformedValue = middleware(transformedValue, context, this);
      });

      return transformedValue;
    };

    /**
     * Applies the afterUpdate side effects after syncing is complete
     * These functions are called for their side effects only (logging, notifications, etc.)
     * Return values are ignored
     */
    const applyAfterUpdate = (value: unknown): void => {
      const context: ISyncContext = {
        source: 'substate',
        field: stateField,
        readField,
      };

      // Execute each afterUpdate function with the final synced value
      afterUpdate.forEach((middleware: TSyncMiddleware) => {
        middleware(value, context, this);
      });
    };

    /**
     * The main sync handler that executes when the state is updated
     * This function is called every time STATE_UPDATED is emitted
     */
    const syncHandler = (state: object) => {
      // Extract the value from the state using dot notation support (via byString)
      const stateValue = byString(state as TState, stateField);

      // Only proceed if the state field exists and has a value
      if (stateValue !== undefined) {
        // Apply transformation middleware first
        const transformedValue = applyBeforeUpdate(stateValue);

        // Set the transformed value on the reader object (supports nested paths)
        byString(readerObj, readField, transformedValue);

        // Execute side effect middleware after the sync is complete
        applyAfterUpdate(transformedValue);
      }
    };

    // INITIALIZATION: Set up the initial sync
    // Get the current value from state to initialize the reader object
    const currentStateValue = this.getProp(stateField);
    if (currentStateValue !== undefined) {
      const transformedValue = applyBeforeUpdate(currentStateValue);
      byString(readerObj, readField, transformedValue);
      applyAfterUpdate(transformedValue);
    }

    // SUBSCRIPTION: Register the sync handler to listen for state updates
    // Uses the existing pub/sub system - when updateState is called, it emits STATE_UPDATED
    this.on(EVENTS.STATE_UPDATED, syncHandler);

    // CLEANUP: Return the unsync function for memory management
    // This removes the event listener to prevent memory leaks
    // Important for component unmounting in React, Vue, etc.
    return {
      unsync: () => {
        this.off(EVENTS.STATE_UPDATED, syncHandler);
      },
    };
  }

  /**
   * Clears all state history except the current state
   *
   * This method is useful for memory management when you want to keep only
   * the current state and discard all historical states. After calling this,
   * the state history will contain only one state (the current one) at index 0.
   *
   * @example
   * // After many state updates...
   * console.log(store.stateStorage.length); // 50+ states
   *
   * store.clearHistory();
   * console.log(store.stateStorage.length); // 1 state
   * console.log(store.currentState); // 0
   *
   * @since 10.0.0
   */
  public clearHistory(): void {
    const previousLength = this.stateStorage.length;
    const currentState = this.getCurrentState();
    this.stateStorage = [currentState];
    this.currentState = 0;

    // Clear all tagged states since they all reference old history
    this.taggedStates.clear();

    this.emit(EVENTS.HISTORY_CLEARED, { previousLength });
  }

  /**
   * Sets a new limit for state history size and trims history if necessary
   *
   * This method allows you to dynamically change the maximum number of states
   * kept in history. If the new limit is smaller than the current history size,
   * the oldest states will be removed to fit the new limit.
   *
   * @param maxSize - The new maximum number of states to keep in history (minimum: 1)
   *
   * @example
   * // Reduce memory usage by limiting history
   * store.limitHistory(10); // Keep only last 10 states
   *
   * // Increase history for debugging
   * store.limitHistory(100); // Allow up to 100 states
   *
   * @throws {Error} If maxSize is less than 1
   * @since 10.0.0
   */
  public limitHistory(maxSize: number): void {
    if (maxSize < 1) {
      throw new Error('History size must be at least 1');
    }

    const previousSize = this.maxHistorySize;
    this.maxHistorySize = maxSize;

    // Trim current history if it exceeds the new limit
    if (this.stateStorage.length > maxSize) {
      const statesToRemove = this.stateStorage.length - maxSize;
      this.stateStorage.splice(0, statesToRemove);

      // Update tagged state indices after trimming (same logic as pushState)
      for (const [tag, taggedEntry] of this.taggedStates.entries()) {
        if (taggedEntry.stateIndex < statesToRemove) {
          // This tagged state was trimmed, remove the tag
          this.taggedStates.delete(tag);
        } else {
          // Adjust the state index
          taggedEntry.stateIndex -= statesToRemove;
        }
      }

      // Adjust currentState index after removal
      this.currentState = this.stateStorage.length - 1;
    }

    this.emit(EVENTS.HISTORY_LIMIT_CHANGED, {
      previousSize,
      newSize: maxSize,
      currentHistoryLength: this.stateStorage.length,
    });
  }

  /**
   * Returns estimated memory usage information for the store
   *
   * This method provides insight into the current memory footprint of the store,
   * helping with performance monitoring and optimization decisions.
   *
   * @returns Object containing state count and estimated memory usage
   *
   * @example
   * const usage = store.getMemoryUsage();
   * console.log(`States: ${usage.stateCount}, Est. Size: ${usage.estimatedSizeKB}KB`);
   *
   * // Monitor memory growth
   * if (usage.estimatedSizeKB > 1000) {
   *   store.clearHistory(); // Clean up if over 1MB
   * }
   *
   * @since 10.0.0
   */
  public getMemoryUsage(): {
    stateCount: number;
    taggedCount: number;
    estimatedSizeKB: number | null;
  } {
    const stateCount = this.stateStorage.length;

    // Handle empty state storage
    if (stateCount === 0) {
      return {
        stateCount: 0,
        taggedCount: 0,
        estimatedSizeKB: 0,
      };
    }

    // Rough estimation: JSON.stringify size as approximation
    // This is not perfectly accurate but gives a reasonable estimate
    let estimatedBytes = 0;

    try {
      // Sample a few states to estimate average size
      const sampleSize = Math.min(3, stateCount);
      let totalSampleSize = 0;

      for (let i = 0; i < sampleSize; i++) {
        const stateIndex = Math.floor((i * (stateCount - 1)) / Math.max(1, sampleSize - 1));
        const stateJson = JSON.stringify(this.stateStorage[stateIndex]);
        totalSampleSize += stateJson.length * 2; // Rough UTF-16 byte estimation
      }

      // Extrapolate to total size (avoid division by zero)
      const averageStateSize = sampleSize > 0 ? totalSampleSize / sampleSize : 0;
      estimatedBytes = averageStateSize * stateCount;
    } catch (_error) {
      console.error('Error estimating memory usage:', _error);
      return {
        stateCount: this.stateStorage.length,
        taggedCount: this.taggedStates.size,
        estimatedSizeKB: null,
      };
    }

    const estimatedSizeKB = Math.max(1, Math.round(estimatedBytes / 1024));

    return {
      stateCount,
      taggedCount: this.taggedStates.size,
      estimatedSizeKB,
    };
  }

  /**
   * Retrieves a tagged state by its tag name
   *
   * This method allows you to access previously tagged states without affecting
   * the current state. Useful for comparing states or retrieving specific snapshots.
   *
   * @param tag - The tag name to look up
   * @returns The tagged state object, or undefined if the tag doesn't exist
   *
   * @example
   * // Tag a state
   * store.updateState({ user: userData, $tag: "user-login" });
   *
   * // Later, retrieve that tagged state
   * const loginState = store.getTaggedState("user-login");
   * if (loginState) {
   *   console.log("User at login:", loginState.user);
   * }
   *
   * @since 10.0.0
   */
  public getTaggedState(tag: string): TState | undefined {
    const taggedEntry = this.taggedStates.get(tag);
    return taggedEntry ? cloneDeep(taggedEntry.state) : undefined;
  }

  /**
   * Returns an array of all available tag names
   *
   * Useful for debugging, UI display of available states, or programmatic
   * iteration over tagged states.
   *
   * @returns Array of tag names currently stored
   *
   * @example
   * store.updateState({ step: 1, $tag: "step-1" });
   * store.updateState({ step: 2, $tag: "step-2" });
   *
   * console.log(store.getAvailableTags()); // ["step-1", "step-2"]
   *
   * // Check if a specific tag exists
   * if (store.getAvailableTags().includes("checkpoint")) {
   *   store.jumpToTag("checkpoint");
   * }
   *
   * @since 10.0.0
   */
  public getAvailableTags(): string[] {
    return Array.from(this.taggedStates.keys());
  }

  /**
   * Jumps to a tagged state, making it the current state
   *
   * This method restores a previously tagged state as the current state and
   * adds it to the state history. This allows you to "time travel" to named
   * checkpoints in your application's state.
   *
   * @param tag - The tag name to jump to
   * @throws {Error} If the tag doesn't exist
   *
   * @example
   * // Create some tagged states
   * store.updateState({ page: "home", $tag: "home-page" });
   * store.updateState({ page: "profile", $tag: "profile-page" });
   * store.updateState({ page: "settings" });
   *
   * // Jump back to a tagged state
   * store.jumpToTag("home-page");
   * console.log(store.getCurrentState().page); // "home"
   *
   * // Can continue from there
   * store.updateState({ page: "about" });
   *
   * @since 10.0.0
   */
  public jumpToTag(tag: string): void {
    const taggedEntry = this.taggedStates.get(tag);
    if (!taggedEntry) {
      throw new Error(`Tag "${tag}" not found`);
    }

    // Create a new state entry from the tagged state
    const restoredState = cloneDeep(taggedEntry.state);

    // Remove the $tag metadata to avoid re-tagging
    delete (restoredState as TState).$tag;

    // Add it as a new state in history
    this.pushState(restoredState);

    // Emit state change event
    this.emit(EVENTS.TAG_JUMPED, { tag, state: this.getCurrentState() });
    this.emit(EVENTS.STATE_UPDATED, this.getCurrentState());
  }

  /**
   * Removes a tag from the tagged states collection
   *
   * This cleans up tagged states that are no longer needed, helping with
   * memory management. The actual state in history is not affected.
   *
   * @param tag - The tag name to remove
   * @returns true if the tag was found and removed, false if it didn't exist
   *
   * @example
   * store.updateState({ temp: "data", $tag: "temporary" });
   *
   * // Later, clean up
   * const wasRemoved = store.removeTag("temporary");
   * console.log(wasRemoved); // true
   *
   * // Attempting to remove again
   * const wasRemovedAgain = store.removeTag("temporary");
   * console.log(wasRemovedAgain); // false
   *
   * @since 10.0.0
   */
  public removeTag(tag: string): boolean {
    const existed = this.taggedStates.has(tag);
    this.taggedStates.delete(tag);

    if (existed) {
      this.emit(EVENTS.TAG_REMOVED, { tag });
    }

    return existed;
  }

  /**
   * Clears all tagged states
   *
   * Removes all tags from the collection. This is useful for memory cleanup
   * or when starting a new phase of the application. The actual states in
   * history are not affected.
   *
   * @example
   * // After bulk operations with many tags
   * store.clearTags();
   * console.log(store.getAvailableTags()); // []
   *
   * // State history is still intact
   * console.log(store.stateStorage.length); // Still has all states
   *
   * @since 10.0.0
   */
  public clearTags(): void {
    const tagCount = this.taggedStates.size;
    this.taggedStates.clear();

    this.emit('TAGS_CLEARED', { clearedCount: tagCount });
  }

  // #endregion

  // #region Private Property Getters and Setters

  get hasMiddleware(): boolean {
    return this._hasMiddleware;
  }

  get hasTaggedStates(): boolean {
    return this._hasTaggedStates;
  }
  // #endregion

  // #region Private Methods

  private updateTaggedStates(action: Partial<TState>, newState: TState): void {
    if (action.$tag) {
      this._hasTaggedStates = true;
      this.taggedStates.set(action.$tag, {
        stateIndex: this.currentState,
        state: cloneDeep(newState) as TState, // Store a deep copy to prevent mutations
      });
    }
  }

  /**
   * Updates the state history array and sets the currentState pointer properly
   * Uses immediate history trimming for optimal performance
   * @param newState - The new state object
   */
  private pushState(newState: TState): void {
    this.stateStorage.push(newState);

    // Check if history needs trimming and do it immediately
    if (this.stateStorage.length > this.maxHistorySize) {
      this.performHistoryTrim();
    }

    this.currentState = this.stateStorage.length - 1;
  }

  /**
   * Performs the actual history trimming operation
   * This is called immediately when the history limit is exceeded
   */
  private performHistoryTrim(): void {
    if (this.stateStorage.length <= this.maxHistorySize) {
      return;
    }

    // Remove oldest states to maintain the limit
    const statesToRemove = this.stateStorage.length - this.maxHistorySize;
    this.stateStorage.splice(0, statesToRemove);

    // Update tagged state indices after trimming
    // Remove tags that reference trimmed states, update indices for remaining tags
    for (const [tag, taggedEntry] of this.taggedStates.entries()) {
      if (taggedEntry.stateIndex < statesToRemove) {
        // This tagged state was trimmed, remove the tag
        this.taggedStates.delete(tag);
      } else {
        // Adjust the state index
        taggedEntry.stateIndex -= statesToRemove;
      }
    }

    // Adjust currentState index after removal
    this.currentState = this.stateStorage.length - 1;
  }

  /**
   * Fires the beforeUpdate middleware
   * @param action - The new state object
   */
  private fireBeforeMiddleware(action: Partial<TState>): void {
    if (this.beforeUpdate.length > 0) {
      this.beforeUpdate.forEach((func) => {
        func(this as unknown as ISubstate, action as TUserState);
      });
    }
  }

  /**
   * Fires the afterUpdate middleware
   * @param action - The new state object
   */
  private fireAfterMiddleware(action: Partial<TState>): void {
    if (this.afterUpdate.length > 0) {
      this.afterUpdate.forEach((func) => {
        func(this as unknown as ISubstate, action as TUserState);
      });
    }
  }

  /**
   * Combined and optimized fast path check - single pass through logic
   * @param action - The action to check
   * @param keys - Pre-computed keys to avoid Object.keys() call
   * @returns true if fast path can be used
   */
  private canUseFastPathOptimized(action: Partial<TState>, keys: string[]): boolean {
    // Quick checks first - most likely to fail
    if (this._hasMiddleware || this._hasTaggedStates || action.$deep || action.$tag) {
      return false;
    }

    // Single pass through keys with early exit
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key.includes('.') || key.includes('[') || key === '$type') {
        return false;
      }
    }
    return true;
  }

  /**
   * Optimized state cloning using cached current state
   * @param deep - Whether to clone deeply
   * @param currentState - Pre-fetched current state
   * @returns The cloned state
   */
  private cloneStateOptimized(deep: boolean, currentState: TState): TState {
    if (deep) {
      return cloneDeep(currentState);
    }
    // Optimized shallow clone using spread operator
    return { ...currentState } as TState;
  }

  /**
   * Optimized tempUpdate with pre-computed keys and fast path for direct properties
   * @param newState - The state to update
   * @param action - The action containing updates
   * @param keys - Pre-computed keys
   * @param defaultDeep - Default deep setting
   * @returns Updated state
   */
  private tempUpdateOptimized(
    newState: TUserState,
    action: Partial<TUserState>,
    keys: string[],
    defaultDeep: boolean
  ): TUserState {
    // Fast path: if all keys are direct properties, skip array allocation
    let hasNestedKeys = false;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key.includes('.') || key.includes('[')) {
        hasNestedKeys = true;
        break;
      }
    }

    if (!hasNestedKeys) {
      // Fast path: all direct properties
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        (newState as Record<string, unknown>)[key] = (action as Record<string, unknown>)[key];
      }
    } else {
      // Standard path: separate direct and nested keys
      const directKeys: string[] = [];
      const nestedKeys: string[] = [];

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (key.includes('.') || key.includes('[')) {
          nestedKeys.push(key);
        } else {
          directKeys.push(key);
        }
      }

      // Process direct keys
      for (let i = 0; i < directKeys.length; i++) {
        const key = directKeys[i];
        (newState as Record<string, unknown>)[key] = (action as Record<string, unknown>)[key];
      }

      // Process nested keys
      for (let i = 0; i < nestedKeys.length; i++) {
        const key = nestedKeys[i];
        byString(newState, key, (action as Record<string, unknown>)[key]);
      }
    }

    if (!defaultDeep) (newState as TUserState).$deep = false;
    (newState as TUserState).$type = action.$type || EVENTS.UPDATE_STATE;

    return newState;
  }

  /**
   * Ultra-fast state update that takes current state as parameter to avoid redundant array access
   * @param action - The new state object
   * @param currentState - The current state (pre-fetched for performance)
   * @param keys - Pre-computed keys for performance
   */
  private fastUpdateStateOptimized(
    action: Partial<TState>,
    currentState: TState,
    keys: string[]
  ): void {
    // Use provided currentState instead of array access for better performance
    const newState = { ...currentState } as TState;

    // Fast property assignment for direct properties
    // Use pre-computed keys to avoid Object.keys() call
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key !== '$deep' && key !== '$type' && key !== '$tag') {
        (newState as Record<string, unknown>)[key] = (action as Record<string, unknown>)[key];
      }
    }

    (newState as TState).$type = EVENTS.UPDATE_STATE;
    this.pushState(newState);
    this.emit(EVENTS.STATE_UPDATED, newState);
  }

  /**
   * Ultra-fast batch update for multiple properties at once
   * @param actions - Array of update actions
   */
  private fastBatchUpdate(actions: Array<Partial<TState>>): void {
    // Get current state for batch operations
    const currentState = this.getCurrentState();

    // Pre-allocate the new state object
    const newState = { ...currentState } as TState;

    // Process all actions in a single pass
    for (let actionIndex = 0; actionIndex < actions.length; actionIndex++) {
      const action = actions[actionIndex];
      const keys = Object.keys(action);

      for (let keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        const key = keys[keyIndex];
        if (key !== '$deep' && key !== '$type' && key !== '$tag') {
          (newState as Record<string, unknown>)[key] = (action as Record<string, unknown>)[key];
        }
      }
    }

    (newState as TState).$type = EVENTS.UPDATE_STATE;
    this.pushState(newState);
    this.emit(EVENTS.STATE_UPDATED, newState);
  }

  private validateSyncFields(stateField: string): void {
    // Check if stateField exists in the current state
    const currentStateValue = this.getProp(stateField);
    if (currentStateValue === undefined) {
      throw new Error(
        `State field '${stateField}' not found in current state. ` +
          `Available state properties: ${Object.keys(this.getCurrentState()).join(', ')}`
      );
    }

    // NOTE: removed to make the code more flexible
    // byString already adds the field in.

    // Check if readField exists in the reader object
    // const useByString = requiresByString(readField);
    // const readFieldExists = useByString ? byString(readerObj, readField) !== undefined : readerObj[readField] !== undefined;
    // if (!readFieldExists) {
    //   throw new Error(
    //     `Read field '${readField}' not found in reader object. ` +
    //       `Available reader properties: ${Object.keys(readerObj).join(', ')}`
    //   );
    // }
  }
  // #endregion
}

export { Substate };
