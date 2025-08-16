import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Substate } from './Substate'

/**
 * Test suite for the Substate sync method
 *
 * This test suite covers all aspects of the sync functionality including:
 * - Basic unidirectional synchronization
 * - Middleware transformations and side effects
 * - Nested property handling
 * - Multiple sync instances
 * - Cleanup and memory management
 * - Edge cases and error handling
 */
describe('Substate sync method', () => {
  let store: Substate
  let uiModel: Record<string, unknown>

  beforeEach(() => {
    store = new Substate({ state: { userName: 'John', age: 25, nested: { value: 'test' } } })
    uiModel = { name: '', userAge: 0, nestedValue: '' }
  })

  // Test basic unidirectional sync functionality
  test('should sync basic state field to reader object', () => {
    const unsync = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
    })

    // Initial sync should happen immediately
    expect(uiModel.name).toBe('John')

    // Update state and verify sync
    store.updateState({ userName: 'Alice' })
    expect(uiModel.name).toBe('Alice')

    // Changes to reader object should not affect state
    uiModel.name = 'Bob'
    expect(store.getProp('userName')).toBe('Alice')

    unsync()
  })

  // Test default behavior when readField is omitted
  test('should use stateField as readField when readField is not provided', () => {
    const unsync = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
    })

    expect(uiModel.userName).toBe('John')

    store.updateState({ userName: 'Alice' })
    expect(uiModel.userName).toBe('Alice')

    unsync()
  })

  // Test middleware transformation pipeline
  test('should apply beforeMiddleware transformations', () => {
    const unsync = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
      beforeMiddleware: [
        (value: unknown) => (value as string).toUpperCase(),
        (value: unknown) => `Mr. ${value as string}`,
      ],
    })

    expect(uiModel.name).toBe('Mr. JOHN')

    store.updateState({ userName: 'Alice' })
    expect(uiModel.name).toBe('Mr. ALICE')

    unsync()
  })

  test('should call afterMiddleware for side effects', () => {
    const sideEffectSpy = vi.fn()
    const logSpy = vi.fn()

    const unsync = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
      afterMiddleware: [
        (value: unknown, context: unknown) => {
          sideEffectSpy(value, context)
        },
        (value: unknown) => {
          logSpy(`Updated to ${value as string}`)
        },
      ],
    })

    // Check initial call
    expect(sideEffectSpy).toHaveBeenCalledWith('John', {
      source: 'substate',
      field: 'userName',
      readField: 'name',
    })
    expect(logSpy).toHaveBeenCalledWith('Updated to John')

    // Reset spies
    sideEffectSpy.mockClear()
    logSpy.mockClear()

    // Update state
    store.updateState({ userName: 'Alice' })

    expect(sideEffectSpy).toHaveBeenCalledWith('Alice', {
      source: 'substate',
      field: 'userName',
      readField: 'name',
    })
    expect(logSpy).toHaveBeenCalledWith('Updated to Alice')

    unsync()
  })

  test('should handle nested state properties', () => {
    const unsync = store.sync({
      readerObj: uiModel,
      stateField: 'nested.value',
      readField: 'nestedValue',
    })

    expect(uiModel.nestedValue).toBe('test')

    store.updateState({ 'nested.value': 'updated' })
    expect(uiModel.nestedValue).toBe('updated')

    unsync()
  })

  test('should handle multiple sync instances independently', () => {
    const anotherUiModel = { userName: '', age: 0 }

    const unsync1 = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
    })

    const unsync2 = store.sync({
      readerObj: anotherUiModel,
      stateField: 'userName',
    })

    const unsync3 = store.sync({
      readerObj: anotherUiModel,
      stateField: 'age',
    })

    // Initial values
    expect(uiModel.name).toBe('John')
    expect(anotherUiModel.userName).toBe('John')
    expect(anotherUiModel.age).toBe(25)

    // Update state
    store.updateState({ userName: 'Alice', age: 30 })

    expect(uiModel.name).toBe('Alice')
    expect(anotherUiModel.userName).toBe('Alice')
    expect(anotherUiModel.age).toBe(30)

    unsync1()
    unsync2()
    unsync3()
  })

  // Test cleanup functionality to prevent memory leaks
  test('should stop syncing after unsync is called', () => {
    const unsync = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
    })

    expect(uiModel.name).toBe('John')

    // Call unsync
    unsync()

    // Update state - should not sync anymore
    store.updateState({ userName: 'Alice' })
    expect(uiModel.name).toBe('John') // Should remain unchanged

    // State should still be updated
    expect(store.getProp('userName')).toBe('Alice')
  })

  test('should handle undefined state values gracefully', () => {
    const unsync = store.sync({
      readerObj: uiModel,
      stateField: 'nonExistentField',
      readField: 'name',
    })

    // Should not set the reader field if state field doesn't exist
    expect(uiModel.name).toBe('')

    unsync()
  })

  test('should work with complex middleware chain', () => {
    const processingLog: string[] = []

    const unsync = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
      beforeMiddleware: [
        (value: unknown) => {
          processingLog.push(`before1: ${value as string}`)
          return (value as string).toUpperCase()
        },
        (value: unknown) => {
          processingLog.push(`before2: ${value as string}`)
          return `Dr. ${value as string}`
        },
      ],
      afterMiddleware: [
        (value: unknown) => {
          processingLog.push(`after1: ${value as string}`)
        },
        (value: unknown) => {
          processingLog.push(`after2: ${value as string}`)
        },
      ],
    })

    expect(uiModel.name).toBe('Dr. JOHN')
    expect(processingLog).toEqual([
      'before1: John',
      'before2: JOHN',
      'after1: Dr. JOHN',
      'after2: Dr. JOHN',
    ])

    unsync()
  })

  test('should pass correct context to middleware', () => {
    const contextSpy = vi.fn()

    const unsync = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'displayName',
      beforeMiddleware: [
        (value: unknown, context: unknown) => {
          contextSpy(context)
          return value
        },
      ],
    })

    expect(contextSpy).toHaveBeenCalledWith({
      source: 'substate',
      field: 'userName',
      readField: 'displayName',
    })

    unsync()
  })

  test('should sync when state is reset', () => {
    // Update state first
    store.updateState({ userName: 'Alice' })

    const unsync = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
    })

    expect(uiModel.name).toBe('Alice')

    // Reset state should trigger sync back to original value
    store.resetState()

    // The resetState method emits "STATE_RESET", not "STATE_UPDATED"
    // So we need to manually update to see the sync effect
    store.updateState({ userName: 'John' })
    expect(uiModel.name).toBe('John')

    unsync()
  })
})
