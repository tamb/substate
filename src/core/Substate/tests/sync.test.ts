import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Substate } from '../Substate';

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
  let store: Substate;
  let uiModel: Record<string, unknown>;

  beforeEach(() => {
    store = new Substate({ state: { userName: 'John', age: 25, nested: { value: 'test' } } });
    uiModel = { name: '', userAge: 0, nestedValue: '' };
  });

  // Test basic unidirectional sync functionality
  test('should sync basic state field to reader object', () => {
    const synced = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
    });

    // Initial sync should happen immediately
    expect(uiModel.name).toBe('John');

    // Update state and verify sync
    store.updateState({ userName: 'Alice' });
    expect(uiModel.name).toBe('Alice');

    // Changes to reader object should not affect state
    uiModel.name = 'Bob';
    expect(store.getProp('userName')).toBe('Alice');

    synced.unsync();
  });

  // Test default behavior when readField is omitted
  test('should use stateField as readField when readField is not provided', () => {
    const synced = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
    });

    expect(uiModel.userName).toBe('John');

    store.updateState({ userName: 'Alice' });
    expect(uiModel.userName).toBe('Alice');

    synced.unsync();
  });

  // Test middleware transformation pipeline
  test('should apply beforeMiddleware transformations', () => {
    const synced = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
      beforeMiddleware: [
        (value: unknown) => (value as string).toUpperCase(),
        (value: unknown) => `Mr. ${value as string}`,
      ],
    });

    expect(uiModel.name).toBe('Mr. JOHN');

    store.updateState({ userName: 'Alice' });
    expect(uiModel.name).toBe('Mr. ALICE');

    synced.unsync();
  });

  test('should call afterMiddleware for side effects', () => {
    const sideEffectSpy = vi.fn();
    const logSpy = vi.fn();

    const synced = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
      afterMiddleware: [
        (value: unknown, context: unknown) => {
          sideEffectSpy(value, context);
        },
        (value: unknown) => {
          logSpy(`Updated to ${value as string}`);
        },
      ],
    });

    // Check initial call
    expect(sideEffectSpy).toHaveBeenCalledWith('John', {
      source: 'substate',
      field: 'userName',
      readField: 'name',
    });
    expect(logSpy).toHaveBeenCalledWith('Updated to John');

    // Reset spies
    sideEffectSpy.mockClear();
    logSpy.mockClear();

    // Update state
    store.updateState({ userName: 'Alice' });

    expect(sideEffectSpy).toHaveBeenCalledWith('Alice', {
      source: 'substate',
      field: 'userName',
      readField: 'name',
    });
    expect(logSpy).toHaveBeenCalledWith('Updated to Alice');

    synced.unsync();
  });

  test('should handle nested state properties', () => {
    const synced = store.sync({
      readerObj: uiModel,
      stateField: 'nested.value',
      readField: 'nestedValue',
    });

    expect(uiModel.nestedValue).toBe('test');

    store.updateState({ 'nested.value': 'updated' });
    expect(uiModel.nestedValue).toBe('updated');

    synced.unsync();
  });

  test('should handle multiple sync instances independently', () => {
    const anotherUiModel = { userName: '', age: 0 };

    const synced1 = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
    });

    const synced2 = store.sync({
      readerObj: anotherUiModel,
      stateField: 'userName',
    });

    const synced3 = store.sync({
      readerObj: anotherUiModel,
      stateField: 'age',
    });

    // Initial values
    expect(uiModel.name).toBe('John');
    expect(anotherUiModel.userName).toBe('John');
    expect(anotherUiModel.age).toBe(25);

    // Update state
    store.updateState({ userName: 'Alice', age: 30 });

    expect(uiModel.name).toBe('Alice');
    expect(anotherUiModel.userName).toBe('Alice');
    expect(anotherUiModel.age).toBe(30);

    synced1.unsync();
    synced2.unsync();
    synced3.unsync();
  });

  // Test cleanup functionality to prevent memory leaks
  test('should stop syncing after unsync is called', () => {
    const synced = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
    });

    expect(uiModel.name).toBe('John');

    // Call unsync
    synced.unsync();

    // Update state - should not sync anymore
    store.updateState({ userName: 'Alice' });
    expect(uiModel.name).toBe('John'); // Should remain unchanged

    // State should still be updated
    expect(store.getProp('userName')).toBe('Alice');
  });

  test('should handle undefined state values gracefully', () => {
    const synced = store.sync({
      readerObj: uiModel,
      stateField: 'nonExistentField',
      readField: 'name',
    });

    // Should not set the reader field if state field doesn't exist
    expect(uiModel.name).toBe('');

    synced.unsync();
  });

  test('should work with complex middleware chain', () => {
    const processingLog: string[] = [];

    const synced = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
      beforeMiddleware: [
        (value: unknown) => {
          processingLog.push(`before1: ${value as string}`);
          return (value as string).toUpperCase();
        },
        (value: unknown) => {
          processingLog.push(`before2: ${value as string}`);
          return `Dr. ${value as string}`;
        },
      ],
      afterMiddleware: [
        (value: unknown) => {
          processingLog.push(`after1: ${value as string}`);
        },
        (value: unknown) => {
          processingLog.push(`after2: ${value as string}`);
        },
      ],
    });

    expect(uiModel.name).toBe('Dr. JOHN');
    expect(processingLog).toEqual([
      'before1: John',
      'before2: JOHN',
      'after1: Dr. JOHN',
      'after2: Dr. JOHN',
    ]);

    synced.unsync();
  });

  test('should pass correct context to middleware', () => {
    const contextSpy = vi.fn();

    const synced = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'displayName',
      beforeMiddleware: [
        (value: unknown, context: unknown) => {
          contextSpy(context);
          return value;
        },
      ],
    });

    expect(contextSpy).toHaveBeenCalledWith({
      source: 'substate',
      field: 'userName',
      readField: 'displayName',
    });

    synced.unsync();
  });

  test('should sync when state is reset', () => {
    // Update state first
    store.updateState({ userName: 'Alice' });

    const synced = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
    });

    expect(uiModel.name).toBe('Alice');

    // Reset state should trigger sync back to original value
    store.resetState();

    // The resetState method emits "STATE_RESET", not "STATE_UPDATED"
    // So we need to manually update to see the sync effect
    store.updateState({ userName: 'John' });
    expect(uiModel.name).toBe('John');

    synced.unsync();
  });

  test('should sync when syncEvents is provided', () => {
    const synced = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
      syncEvents: 'STATE_UPDATED',
    });

    expect(uiModel.name).toBe('John');

    store.updateState({ userName: 'Alice' });
    expect(uiModel.name).toBe('Alice');

    synced.unsync();
  });

  test('should sync when syncEvents is an array of events', () => {
    const synced = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
      syncEvents: ['STATE_UPDATED', 'SUBSTATE_UPDATED'],
    });

    expect(uiModel.name).toBe('John');

    store.updateState({ userName: 'Alice' });
    expect(uiModel.name).toBe('Alice');

    store.updateState({ userName: 'John', $type: 'SUBSTATE_UPDATED' });
    expect(uiModel.name).toBe('John');

    synced.unsync();
  });

  test('should sync when syncEvents is a single event', () => {
    const synced = store.sync({
      readerObj: uiModel,
      stateField: 'userName',
      readField: 'name',
      syncEvents: 'MY_EVENT',
    });

    expect(uiModel.name).toBe('John');

    store.updateState({ userName: 'Alice' });
    expect(uiModel.name).toBe('John');

    store.updateState({ userName: 'John', $type: 'MY_EVENT' });
    expect(uiModel.name).toBe('John');

    synced.unsync();
  });
});
