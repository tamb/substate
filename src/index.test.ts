import { describe, expect, test } from 'vitest'
import { createStore, type ICreateStoreConfig, type ISubstate } from './index'

describe('Integration tests', () => {
  test('createStore is exported and functional', () => {
    const store = createStore({
      name: 'IntegrationTest',
      state: { test: true },
    })

    expect(store).toBeDefined()
    expect(store.getProp('test')).toBe(true)
  })

  test('types are properly exported', () => {
    // This test ensures TypeScript compilation works
    const config: ICreateStoreConfig = {
      name: 'TypeTest',
    }

    const store: ISubstate = createStore(config)
    expect(store.name).toBe('TypeTest')
  })
})
