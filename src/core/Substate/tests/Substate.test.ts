import { beforeEach, describe, expect, type Mock, test, vi } from 'vitest';
import { Substate } from '../Substate';
import type { IState, ISubstate } from '../Substate.interface';

import { MOCK_STATE } from './mocks';

let A: ISubstate;
let func1: Mock;
let func2: Mock;
let func3: Mock;
let func4: Mock;

describe('Substate instantiation', () => {
  beforeEach(() => {
    func1 = vi.fn();
    func2 = vi.fn();
    func3 = vi.fn();
    func4 = vi.fn();

    A = new Substate({
      name: 'HamburgerStore',
      defaultDeep: true,
      state: MOCK_STATE,
      beforeUpdate: [func1, func3],
      afterUpdate: [func2, func4],
    });
  });
  test('creates new instance of substate', () => {
    expect(A instanceof Substate).toBe(true);
  });

  test('expects store to have name', () => {
    expect(A.name).toBe('HamburgerStore');
  });

  test('events to contain UPDATE_STATE on initialization', () => {
    expect(A.events.UPDATE_STATE).toHaveLength(1);
  });
});

describe('Substate getters', () => {
  beforeEach(() => {
    func1 = vi.fn();
    func2 = vi.fn();
    func3 = vi.fn();
    func4 = vi.fn();

    A = new Substate({
      name: 'HamburgerStore',
      defaultDeep: true,
      state: MOCK_STATE,
      beforeUpdate: [func1, func3],
      afterUpdate: [func2, func4],
    });
  });

  test('get props to return correct value', () => {
    expect(A.getProp('nested.double.reason')).toBe('Just the start');
  });

  test('getCurrentState returns current state and fires middleware', () => {
    expect(A.getCurrentState()).toMatchObject(MOCK_STATE);
    A.emit('UPDATE_STATE', { timeOfFun: new Date().toISOString() });
    expect(func1).toHaveBeenCalledTimes(1);
    expect(func2).toHaveBeenCalledTimes(1);
    expect(func3).toHaveBeenCalledTimes(1);
    expect(func4).toHaveBeenCalledTimes(1);
  });

  test('getState returns correct state from array', () => {
    expect(A.getState(0)).toMatchObject(MOCK_STATE);
  });
});

describe('Substate state management', () => {
  beforeEach(() => {
    func1 = vi.fn();
    func2 = vi.fn();
    func3 = vi.fn();
    func4 = vi.fn();

    A = new Substate({
      name: 'HamburgerStore',
      defaultDeep: true,
      state: MOCK_STATE,
      beforeUpdate: [func1, func3],
      afterUpdate: [func2, func4],
    });
  });

  test('deep clone does not alter older nested state', () => {
    const NEWTEXT = 'This has changed';
    A.emit('UPDATE_STATE', { 'nested.double.reason': NEWTEXT });
    expect(A.getState(0)).not.toMatchObject(A.getCurrentState());
    expect(A.getState(0)).not.toMatchObject(A.getCurrentState());
  });

  test('update via string notation works', () => {
    const NEWTEXT = 'This has changed';
    A.emit('UPDATE_STATE', { 'nested.double': NEWTEXT });
    expect(A.getProp('nested.double')).toMatch(NEWTEXT);
  });

  test('update via object notation works', () => {
    const NEWDATE = new Date().toISOString();
    A.emit('UPDATE_STATE', { timeOfFun: NEWDATE });
    expect(A.getProp('timeOfFun')).toMatch(NEWDATE);
  });

  test('nested update without string notation works', () => {
    const NEWTEXT = 'This has changed';
    A.emit('UPDATE_STATE', { nested: { double: NEWTEXT } });
    expect(A.getProp('nested.double')).toMatch(NEWTEXT);
  });

  test('updateState updates state updates nested string', () => {
    const NEWTEXT = 'foobar';
    A.updateState({ 'nested.double': NEWTEXT });
    const currentState = A.getCurrentState() as IState;
    expect((currentState.nested as Record<string, unknown>).double).toBe(NEWTEXT);
  });

  test('updateState applies state when no listeners for STATE_UPDATED', () => {
    const store = new Substate({
      name: 'NoListenersStore',
      state: { count: 0 },
      defaultDeep: false,
    });
    expect(store.getCurrentState()).toMatchObject({ count: 0 });
    store.updateState({ count: 1 });
    expect(store.getCurrentState()).toMatchObject({ count: 1 });
  });

  test('updateState fires middleware', () => {
    const NEWTEXT = 'foobar';
    A.updateState({ 'nested.double': NEWTEXT });
    expect(func1).toHaveBeenCalledTimes(1);
    expect(func2).toHaveBeenCalledTimes(1);
    expect(func3).toHaveBeenCalledTimes(1);
    expect(func4).toHaveBeenCalledTimes(1);
  });

  test('callback fires for custom $type', () => {
    const myMock = vi.fn();
    const DATEUPDATED = 'DATE_UPDATED';
    A.on(DATEUPDATED, myMock);
    A.emit('UPDATE_STATE', { timeOfFun: new Date(), $type: DATEUPDATED });
    expect(myMock).toHaveBeenCalled();
  });

  test('UPDATE_STATE emit sets $type', () => {
    const DATEUPDATED = 'DATE_UPDATED';
    A.emit('UPDATE_STATE', { timeOfFun: new Date(), $type: DATEUPDATED });
    expect(A.getProp('$type')).toMatch(DATEUPDATED);
  });

  test('Update state sets $type value', () => {
    const DATEUPDATED = 'DATE_UPDATED';
    A.updateState({ timeOfFun: new Date(), $type: DATEUPDATED });
    expect(A.getProp('$type')).toMatch(DATEUPDATED);
  });

  test('should use $deep property to override default deep cloning behavior', () => {
    // Create a store with shallow cloning by default
    const shallowStore = new Substate({
      name: 'ShallowStore',
      state: { nested: { value: 'original' } },
      defaultDeep: false,
    });

    // Update with $deep: true to force deep cloning
    shallowStore.updateState({
      'nested.value': 'updated',
      $deep: true,
    });

    // The $deep property should override the defaultDeep setting
    expect(
      (shallowStore.getCurrentState().nested as unknown as Record<string, unknown>).value
    ).toBe('updated');

    // Create a store with deep cloning by default
    const deepStore = new Substate({
      name: 'DeepStore',
      state: { nested: { value: 'original' } },
      defaultDeep: true,
    });

    // Update with $deep: false to force shallow cloning
    deepStore.updateState({
      'nested.value': 'updated',
      $deep: false,
    });

    // The $deep property should override the defaultDeep setting
    expect((deepStore.getCurrentState().nested as unknown as Record<string, unknown>).value).toBe(
      'updated'
    );
  });
});
