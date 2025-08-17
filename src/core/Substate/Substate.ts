import cloneDeep from 'clone-deep';
import byString from 'object-bystring';

import { PubSub } from '../PubSub/PubSub';
import type {
  IConfig,
  IState,
  ISubstate,
  ISyncConfig,
  SyncContext,
  UpdateMiddleware,
} from './Substate.interface';

const S: string = 'UPDATE_STATE';

/**
 * Substate - A lightweight, pub/sub-based state management library
 *
 * Substate provides immutable state management with middleware support, state history,
 * and a powerful sync feature for unidirectional data binding to external objects.
 *
 * @class Substate
 * @extends PubSub
 * @implements ISubstate
 *
 * @example
 * // Basic usage
 * const store = new Substate({
 *   name: "AppStore",
 *   state: { counter: 0, user: { name: "John" } }
 * });
 *
 * // Update state
 * store.updateState({ counter: 1 });
 * store.updateState({ "user.name": "Jane" }); // Nested updates
 *
 * // Listen to changes
 * store.on("STATE_UPDATED", (newState) => {
 *   console.log("State changed:", newState);
 * });
 *
 * @example
 * // With middleware
 * const store = new Substate({
 *   state: { data: [] },
 *   beforeUpdate: [(store, action) => console.log("Before:", action)],
 *   afterUpdate: [(store, action) => console.log("After:", action)]
 * });
 *
 * @example
 * // Using sync for UI binding
 * const uiModel = { displayName: "", formattedName: "" };
 *
 * // Basic sync
 * const unsync1 = store.sync({
 *   readerObj: uiModel,
 *   stateField: "user.name",
 *   readField: "displayName"
 * });
 *
 * // Sync with transformations
 * const unsync2 = store.sync({
 *   readerObj: uiModel,
 *   stateField: "user.name",
 *   readField: "formattedName",
 *   beforeMiddleware: [
 *     (value) => value.toUpperCase(),
 *     (value) => `Hello, ${value}!`
 *   ],
 *   afterMiddleware: [
 *     (value) => console.log(`UI updated: ${value}`)
 *   ]
 * });
 *
 * // Cleanup when component unmounts
 * unsync1();
 * unsync2();
 *
 * @since 1.0.0
 */
class Substate extends PubSub implements ISubstate {
  name: string;
  afterUpdate: UpdateMiddleware[] | [];
  beforeUpdate: UpdateMiddleware[] | [];
  currentState: number;
  stateStorage: IState[];
  defaultDeep: boolean;
  maxHistorySize: number;
  private taggedStates: Map<string, { stateIndex: number; state: IState }>;

  constructor(obj: IConfig = {}) {
    super();

    this.name = obj.name || 'SubStateInstance';
    this.afterUpdate = obj.afterUpdate || [];
    this.beforeUpdate = obj.beforeUpdate || [];
    this.currentState = obj.currentState || 0;
    this.stateStorage = obj.stateStorage || [];
    this.defaultDeep = obj.defaultDeep || false;
    this.maxHistorySize = obj.maxHistorySize || 50;
    this.taggedStates = new Map();

    if (obj.state) this.stateStorage.push(obj.state as unknown as IState);
    this.on(S, this.updateState.bind(this));
  }

  /**
   * Gets a state from the state storage
   * @param index - The index of the state to get
   * @returns The state
   */
  public getState(index: number): IState {
    return this.stateStorage[index];
  }

  /**
   * Gets the current state
   * @returns The current state
   */
  public getCurrentState(): IState {
    return this.getState(this.currentState) as IState;
  }

  /**
   * Gets a property from the current state
   * @param prop - The property to get
   * @returns The property value
   */
  public getProp(prop: string): unknown {
    return byString(this.getCurrentState(), prop);
  }

  /**
   * Resets the state to the initial state
   */
  public resetState(): void {
    this.currentState = 0;
    this.stateStorage = [this.stateStorage[0]];
    this.emit('STATE_RESET');
  }

  /**
   * Updates the state history array and sets the currentState pointer properly
   * Automatically trims history if it exceeds maxHistorySize
   * Also updates tagged state indices when history is trimmed
   * @param newState - The new state object
   */
  private pushState(newState: IState): void {
    this.stateStorage.push(newState);

    // Trim history if it exceeds the maximum size
    if (this.stateStorage.length > this.maxHistorySize) {
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
    } else {
      this.currentState = this.stateStorage.length - 1;
    }
  }

  /**
   * Clones the current state
   * @param deep - Whether to clone the state deeply
   * @returns The cloned state
   */
  private cloneState(deep: boolean): IState {
    return deep ? cloneDeep(this.getCurrentState()) : Object.assign({}, this.getCurrentState());
  }

  /**
   * Fires the beforeUpdate middleware
   * @param action - The new state object
   */
  private fireBeforeMiddleware(action: IState): void {
    this.beforeUpdate.length > 0
      ? this.beforeUpdate.forEach((func) => {
          func(this, action);
        })
      : null;
  }

  /**
   * Fires the afterUpdate middleware
   * @param action - The new state object
   */
  private fireAfterMiddleware(action: IState): void {
    this.afterUpdate.length > 0
      ? this.afterUpdate.forEach((func) => {
          func(this, action);
        })
      : null;
  }

  /**
   * Updates the state with a new state object
   * @param action - The new state object
   */
  public updateState(action: IState): void {
    this.fireBeforeMiddleware(action);
    let deep: boolean = this.defaultDeep;
    if (action.$deep !== undefined) deep = action.$deep;
    const newState = this.cloneState(deep);

    //update temp new state
    for (const key in action) {
      byString(newState, key, action[key]);
      //update cloned state
    }

    if (!this.defaultDeep) newState.$deep = false; // reset $deep keyword
    newState.$type = action.$type || S; // set $type if not already set

    //pushes new state
    this.pushState(newState);

    // Handle tagging if $tag is provided (including empty strings)
    if (action.$tag !== undefined) {
      this.taggedStates.set(action.$tag, {
        stateIndex: this.currentState,
        state: cloneDeep(newState), // Store a deep copy to prevent mutations
      });
    }

    this.fireAfterMiddleware(action);
    this.emit(action.$type || 'STATE_UPDATED', this.getCurrentState()); //emit with latest data
  }

  /**
   * Establishes a unidirectional synchronization between a state property and a target object property
   *
   * This method creates a live sync relationship where changes to the specified state field
   * automatically update the corresponding property in the target object. The sync is unidirectional,
   * meaning changes to the target object do not affect the state.
   *
   * @param {ISyncConfig} config - Configuration object for the sync operation
   * @returns {Function} unsync - Function to call for cleanup that removes the sync listener
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
   *   beforeMiddleware: [
   *     (value) => value.toUpperCase(),
   *     (value) => `Dr. ${value}`
   *   ],
   *   afterMiddleware: [
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
  public sync(config: ISyncConfig): () => void {
    // Destructure configuration with defaults
    const {
      readerObj,
      stateField,
      readField = stateField, // Default to stateField if readField not provided
      beforeMiddleware = [], // Default to empty array if no middleware
      afterMiddleware = [], // Default to empty array if no middleware
    } = config;

    /**
     * Applies the beforeMiddleware transformation chain to a value
     * Each middleware function receives the transformed value from the previous function
     * and a context object containing metadata about the sync operation
     */
    const applyBeforeMiddleware = (value: unknown): unknown => {
      const context: SyncContext = {
        source: 'substate', // Indicates this sync originated from substate
        field: stateField, // The original state field being watched
        readField, // The target field in the reader object
      };

      // Use reduce to chain transformations - each middleware gets the result of the previous
      return beforeMiddleware.reduce((transformedValue, middleware) => {
        return middleware(transformedValue, context);
      }, value);
    };

    /**
     * Applies the afterMiddleware side effects after syncing is complete
     * These functions are called for their side effects only (logging, notifications, etc.)
     * Return values are ignored
     */
    const applyAfterMiddleware = (value: unknown): void => {
      const context: SyncContext = {
        source: 'substate',
        field: stateField,
        readField,
      };

      // Execute each afterMiddleware function with the final synced value
      afterMiddleware.forEach((middleware) => {
        middleware(value, context);
      });
    };

    /**
     * The main sync handler that executes when the state is updated
     * This function is called every time STATE_UPDATED is emitted
     */
    const syncHandler = (state: IState) => {
      // Extract the value from the state using dot notation support (via byString)
      const stateValue = byString(state, stateField);

      // Only proceed if the state field exists and has a value
      if (stateValue !== undefined) {
        // Apply transformation middleware first
        const transformedValue = applyBeforeMiddleware(stateValue);

        // Set the transformed value on the reader object (supports nested paths)
        byString(readerObj, readField, transformedValue);

        // Execute side effect middleware after the sync is complete
        applyAfterMiddleware(transformedValue);
      }
    };

    // INITIALIZATION: Set up the initial sync
    // Get the current value from state to initialize the reader object
    const currentStateValue = this.getProp(stateField);
    if (currentStateValue !== undefined) {
      const transformedValue = applyBeforeMiddleware(currentStateValue);
      byString(readerObj, readField, transformedValue);
      applyAfterMiddleware(transformedValue);
    }

    // SUBSCRIPTION: Register the sync handler to listen for state updates
    // Uses the existing pub/sub system - when updateState is called, it emits STATE_UPDATED
    this.on('STATE_UPDATED', syncHandler);

    // CLEANUP: Return the unsync function for memory management
    // This removes the event listener to prevent memory leaks
    // Important for component unmounting in React, Vue, etc.
    return () => {
      this.off('STATE_UPDATED', syncHandler);
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

    this.emit('HISTORY_CLEARED', { previousLength });
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

    this.emit('HISTORY_LIMIT_CHANGED', {
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
  public getMemoryUsage(): { stateCount: number; taggedCount: number; estimatedSizeKB: number } {
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
      // Fallback estimation if JSON.stringify fails
      estimatedBytes = stateCount * 1024; // Assume 1KB per state as fallback
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
  public getTaggedState(tag: string): IState | undefined {
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
    delete restoredState.$tag;

    // Add it as a new state in history
    this.pushState(restoredState);

    // Emit state change event
    this.emit('TAG_JUMPED', { tag, state: this.getCurrentState() });
    this.emit('STATE_UPDATED', this.getCurrentState());
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
      this.emit('TAG_REMOVED', { tag });
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
}

export { Substate };
