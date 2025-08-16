import { describe, expect, test, vi } from 'vitest'
import { Substate } from '../Substate/Substate'
import { createStore } from './createStore'

const STATE = {
  name: 'Thomas',
  timeOfFun: new Date().toISOString(),
  nested: {
    double: {
      reason: 'Just the start',
    },
  },
}

describe('createStore factory function', () => {
  test('creates store with required name', () => {
    const store = createStore({
      name: 'TestStore',
    })
    expect(store instanceof Substate).toBe(true)
    expect(store.name).toBe('TestStore')
  })

  test('creates store with initial state', () => {
    const store = createStore({
      name: 'TestStore',
      state: STATE,
    })
    expect(store.getCurrentState()).toMatchObject(STATE)
  })

  test('creates store with defaultDeep setting', () => {
    const store = createStore({
      name: 'TestStore',
      defaultDeep: true,
    })
    expect(store.defaultDeep).toBe(true)
  })

  test('creates store with middleware functions', () => {
    const beforeFn = vi.fn()
    const afterFn = vi.fn()

    const store = createStore({
      name: 'TestStore',
      beforeUpdate: [beforeFn],
      afterUpdate: [afterFn],
    })

    expect(store.beforeUpdate).toContain(beforeFn)
    expect(store.afterUpdate).toContain(afterFn)
  })

  test('creates store with all options', () => {
    const beforeFn = vi.fn()
    const afterFn = vi.fn()

    const store = createStore({
      name: 'CompleteStore',
      state: STATE,
      defaultDeep: true,
      beforeUpdate: [beforeFn],
      afterUpdate: [afterFn],
    })

    expect(store.name).toBe('CompleteStore')
    expect(store.getCurrentState()).toMatchObject(STATE)
    expect(store.defaultDeep).toBe(true)
    expect(store.beforeUpdate).toContain(beforeFn)
    expect(store.afterUpdate).toContain(afterFn)
  })

  test('factory function creates functional store', () => {
    const store = createStore({
      name: 'FunctionalStore',
      state: STATE,
    })

    // Test that the store is functional
    store.updateState({ name: 'Updated' })
    expect(store.getProp('name')).toBe('Updated')
  })

  test('creates store with default values when options not provided', () => {
    const store = createStore({
      name: 'DefaultStore',
    })

    expect(store.name).toBe('DefaultStore')
    expect(store.defaultDeep).toBe(false)
    expect(store.beforeUpdate).toEqual([])
    expect(store.afterUpdate).toEqual([])
    expect(store.getCurrentState()).toBeUndefined()
  })
})
