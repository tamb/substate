import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/preact'
import { createStore, type IState } from 'substate'
import { useSubstate, useSubstateActions } from 'substate/preact'

// Test state interfaces
interface CounterState extends IState {
  count: number
  lastUpdated: number
}

interface TodoState extends IState {
  todos: Array<{ id: string; text: string; completed: boolean }>
  filter: 'all' | 'active' | 'completed'
}

interface Todo {
  id: string
  text: string
  completed: boolean
}

// Test Components
function CounterComponent({ store }: { store: any }) {
  const count = useSubstate<CounterState>(store, (state) => state.count)
  const { updateState, resetState } = useSubstateActions(store)

  return (
    <div>
      <span data-testid="count">{count as number}</span>
      <button 
        data-testid="increment" 
        onClick={() => updateState({ count: (count as number) + 1, lastUpdated: Date.now() })}
      >
        Increment
      </button>
      <button data-testid="reset" onClick={() => resetState()}>
        Reset
      </button>
    </div>
  )
}

function TodoComponent({ store }: { store: any }) {
  const todos = useSubstate<TodoState>(store, (state) => state.todos)
  const filter = useSubstate<TodoState>(store, (state) => state.filter)
  const { updateState } = useSubstateActions(store)

  const addTodo = () => {
    const newTodo = { 
      id: Date.now().toString(), 
      text: 'Test Todo', 
      completed: false 
    }
    updateState({ todos: [...(todos as Todo[]), newTodo] })
  }

  const filteredTodos = (todos as Todo[]).filter((todo: Todo) => {
    if (filter === 'completed') return todo.completed
    if (filter === 'active') return !todo.completed
    return true
  })

  return (
    <div>
      <span data-testid="todo-count">{filteredTodos.length}</span>
      <button data-testid="add-todo" onClick={addTodo}>Add Todo</button>
      <button 
        data-testid="set-filter-completed" 
        onClick={() => updateState({ filter: 'completed' })}
      >
        Show Completed
      </button>
    </div>
  )
}

describe('Preact Integration Tests', () => {
  describe('Generic Store Creation and Typing', () => {
    it('should create typed stores with full type safety', () => {
      const counterStore = createStore<CounterState>({
        name: 'TestCounter',
        state: { count: 0, lastUpdated: Date.now() }
      })

      expect(counterStore.name).toBe('TestCounter')
      expect(counterStore.getCurrentState().count).toBe(0)
    })

    it('should enforce type constraints at compile time', () => {
      // This test verifies that our generic typing works
      interface TestState extends IState {
        value: string
      }

      const store = createStore<TestState>({
        name: 'TypeTest',
        state: { value: 'test' }
      })

      // TypeScript should infer the correct types
      const state = store.getCurrentState()
      expect(typeof state.value).toBe('string')
    })
  })

  describe('useSubstate Hook', () => {
    let counterStore: any

    beforeEach(() => {
      counterStore = createStore<CounterState>({
        name: 'TestCounter',
        state: { count: 0, lastUpdated: Date.now() }
      })
    })

    it('should return current state without selector', () => {
      function TestComponent() {
        const state = useSubstate(counterStore)
        return <span data-testid="full-state">{JSON.stringify(state)}</span>
      }

      render(<TestComponent />)
      const element = screen.getByTestId('full-state')
      expect(element.textContent).toContain('"count":0')
    })

    it('should return selected value with function selector', () => {
      render(<CounterComponent store={counterStore} />)
      expect(screen.getByTestId('count')).toHaveTextContent('0')
    })

    it('should update when state changes', async () => {
      render(<CounterComponent store={counterStore} />)
      
      const incrementButton = screen.getByTestId('increment')
      const countDisplay = screen.getByTestId('count')

      expect(countDisplay).toHaveTextContent('0')

      fireEvent.click(incrementButton)
      await waitFor(() => {
        expect(countDisplay).toHaveTextContent('1')
      })

      fireEvent.click(incrementButton)
      await waitFor(() => {
        expect(countDisplay).toHaveTextContent('2')
      })
    })

    it('should handle string selectors', () => {
      function TestComponent() {
        const count = useSubstate(counterStore, 'count')
        return <span data-testid="string-selector">{String(count)}</span>
      }

      render(<TestComponent />)
      expect(screen.getByTestId('string-selector')).toHaveTextContent('0')
    })
  })

  describe('useSubstateActions Hook', () => {
    let counterStore: any

    beforeEach(() => {
      counterStore = createStore<CounterState>({
        name: 'TestCounter',
        state: { count: 5, lastUpdated: Date.now() }
      })
    })

    it('should provide updateState action', async () => {
      render(<CounterComponent store={counterStore} />)
      
      const incrementButton = screen.getByTestId('increment')
      const countDisplay = screen.getByTestId('count')

      expect(countDisplay).toHaveTextContent('5')

      fireEvent.click(incrementButton)
      await waitFor(() => {
        expect(countDisplay).toHaveTextContent('6')
      })
    })

    it('should provide resetState action', async () => {
      render(<CounterComponent store={counterStore} />)
      
      const resetButton = screen.getByTestId('reset')
      const countDisplay = screen.getByTestId('count')

      // First increment to change state
      fireEvent.click(screen.getByTestId('increment'))
      await waitFor(() => {
        expect(countDisplay).toHaveTextContent('6')
      })

      // Then reset
      fireEvent.click(resetButton)
      await waitFor(() => {
        expect(countDisplay).toHaveTextContent('5') // Back to initial state
      })
    })
  })

  describe('Complex State Management', () => {
    let todoStore: any

    beforeEach(() => {
      todoStore = createStore<TodoState>({
        name: 'TestTodos',
        state: {
          todos: [
            { id: '1', text: 'Existing Todo', completed: false }
          ],
          filter: 'all'
        }
      })
    })

    it('should handle array state updates', async () => {
      render(<TodoComponent store={todoStore} />)
      
      const addButton = screen.getByTestId('add-todo')
      const countDisplay = screen.getByTestId('todo-count')

      expect(countDisplay).toHaveTextContent('1') // Initial todo

      fireEvent.click(addButton)
      await waitFor(() => {
        expect(countDisplay).toHaveTextContent('2')
      })
    })

    it('should handle filtered selectors', async () => {
      render(<TodoComponent store={todoStore} />)
      
      const filterButton = screen.getByTestId('set-filter-completed')
      const countDisplay = screen.getByTestId('todo-count')

      expect(countDisplay).toHaveTextContent('1') // All todos

      fireEvent.click(filterButton)
      await waitFor(() => {
        expect(countDisplay).toHaveTextContent('0') // No completed todos
      })
    })
  })

  describe('Preact-Specific Features', () => {
    it('should work with Preact hooks and lifecycle', () => {
      interface StateWithEffect extends IState {
        mounted: boolean
        effectCount: number
      }

      const store = createStore<StateWithEffect>({
        name: 'EffectTest',
        state: { mounted: false, effectCount: 0 }
      })

      function EffectComponent() {
        const mounted = useSubstate(store, (state) => state.mounted)
        const effectCount = useSubstate(store, (state) => state.effectCount)
        const { updateState } = useSubstateActions(store)

        // Simulate useEffect behavior
        if (!mounted) {
          updateState({ mounted: true, effectCount: effectCount + 1 })
        }

        return (
          <div>
            <span data-testid="mounted">{mounted ? 'true' : 'false'}</span>
            <span data-testid="effect-count">{effectCount}</span>
          </div>
        )
      }

      render(<EffectComponent />)
      expect(screen.getByTestId('mounted')).toHaveTextContent('true')
    })
  })

  describe('Type Safety Integration', () => {
    it('should maintain type safety throughout the flow', () => {
      interface StrictState extends IState {
        requiredField: string
        optionalField?: number
      }

      const store = createStore<StrictState>({
        name: 'StrictTest',
        state: { requiredField: 'test' }
      })

      function StrictComponent() {
        // These should all be properly typed
        const required = useSubstate(store, (state) => state.requiredField)
        const optional = useSubstate(store, (state) => state.optionalField)
        const { updateState } = useSubstateActions(store)

        return (
          <div>
            <span data-testid="required">{required}</span>
            <span data-testid="optional">{optional || 'undefined'}</span>
            <button 
              data-testid="update"
              onClick={() => updateState({ optionalField: 42 })}
            >
              Update
            </button>
          </div>
        )
      }

      render(<StrictComponent />)
      expect(screen.getByTestId('required')).toHaveTextContent('test')
      expect(screen.getByTestId('optional')).toHaveTextContent('undefined')
    })
  })
})
