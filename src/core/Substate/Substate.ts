import cloneDeep from 'clone-deep'
import byString from 'object-bystring'

import { PubSub } from '../PubSub/PubSub'
import type {
  IConfig,
  IState,
  ISubstate,
  ISyncConfig,
  SyncContext,
  UpdateMiddleware,
} from './Substate.interface'

const S: string = 'UPDATE_STATE'

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
  name: string
  afterUpdate: UpdateMiddleware[] | []
  beforeUpdate: UpdateMiddleware[] | []
  currentState: number
  stateStorage: IState[]
  defaultDeep: boolean

  constructor(obj: IConfig = {}) {
    super()

    this.name = obj.name || 'SubStateInstance'
    this.afterUpdate = obj.afterUpdate || []
    this.beforeUpdate = obj.beforeUpdate || []
    this.currentState = obj.currentState || 0
    this.stateStorage = obj.stateStorage || []
    this.defaultDeep = obj.defaultDeep || false

    if (obj.state) this.stateStorage.push(obj.state as unknown as IState)
    this.on(S, this.updateState.bind(this))
  }

  public getState(index: number): IState {
    return this.stateStorage[index]
  }

  public getCurrentState(): IState {
    return this.getState(this.currentState) as IState
  }

  public getProp(prop: string): unknown {
    return byString(this.getCurrentState(), prop)
  }

  public resetState() {
    this.currentState = 0
    this.stateStorage = [this.stateStorage[0]]
    this.emit('STATE_RESET')
  }

  // Updates the state history array and sets the currentState pointer properly
  private pushState(newState: IState) {
    this.stateStorage.push(newState)
    this.currentState = this.stateStorage.length - 1
  }

  private cloneState(deep: boolean): IState {
    return deep ? cloneDeep(this.getCurrentState()) : Object.assign({}, this.getCurrentState())
  }

  private fireBeforeMiddleware(action: IState): void {
    this.beforeUpdate.length > 0
      ? this.beforeUpdate.forEach((func) => {
          func(this, action)
        })
      : null
  }

  private fireAfterMiddleware(action: IState): void {
    this.afterUpdate.length > 0
      ? this.afterUpdate.forEach((func) => {
          func(this, action)
        })
      : null
  }

  public updateState(action: IState): void {
    this.fireBeforeMiddleware(action)
    let deep: boolean = this.defaultDeep
    if (action.$deep !== undefined) deep = action.$deep
    const newState = this.cloneState(deep)

    //update temp new state
    for (const key in action) {
      byString(newState, key, action[key])
      //update cloned state
    }

    if (!this.defaultDeep) newState.$deep = false // reset $deep keyword
    newState.$type = action.$type || S // set $type if not already set

    //pushes new state
    this.pushState(newState)
    this.fireAfterMiddleware(action)
    this.emit(action.$type || 'STATE_UPDATED', this.getCurrentState()) //emit with latest data
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
    } = config

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
      }

      // Use reduce to chain transformations - each middleware gets the result of the previous
      return beforeMiddleware.reduce((transformedValue, middleware) => {
        return middleware(transformedValue, context)
      }, value)
    }

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
      }

      // Execute each afterMiddleware function with the final synced value
      afterMiddleware.forEach((middleware) => {
        middleware(value, context)
      })
    }

    /**
     * The main sync handler that executes when the state is updated
     * This function is called every time STATE_UPDATED is emitted
     */
    const syncHandler = (state: IState) => {
      // Extract the value from the state using dot notation support (via byString)
      const stateValue = byString(state, stateField)

      // Only proceed if the state field exists and has a value
      if (stateValue !== undefined) {
        // Apply transformation middleware first
        const transformedValue = applyBeforeMiddleware(stateValue)

        // Set the transformed value on the reader object (supports nested paths)
        byString(readerObj, readField, transformedValue)

        // Execute side effect middleware after the sync is complete
        applyAfterMiddleware(transformedValue)
      }
    }

    // INITIALIZATION: Set up the initial sync
    // Get the current value from state to initialize the reader object
    const currentStateValue = this.getProp(stateField)
    if (currentStateValue !== undefined) {
      const transformedValue = applyBeforeMiddleware(currentStateValue)
      byString(readerObj, readField, transformedValue)
      applyAfterMiddleware(transformedValue)
    }

    // SUBSCRIPTION: Register the sync handler to listen for state updates
    // Uses the existing pub/sub system - when updateState is called, it emits STATE_UPDATED
    this.on('STATE_UPDATED', syncHandler)

    // CLEANUP: Return the unsync function for memory management
    // This removes the event listener to prevent memory leaks
    // Important for component unmounting in React, Vue, etc.
    return () => {
      this.off('STATE_UPDATED', syncHandler)
    }
  }
}

export { Substate }
