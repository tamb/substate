import { useState } from 'react'
import { createStore, type TState } from 'substate'
import Counter from './components/Counter'
import TodoApp from './components/TodoApp'
import './App.css'

// Define state interfaces that extend IState
interface CounterState extends TState {
  count: number
  lastUpdated: number,
}

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

interface TodoState extends TState {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
  newTodoText: string
}

// Create stores outside React - demonstrates framework-agnostic nature with full type safety
const counterStore = createStore<CounterState>({
  name: 'CounterStore',
  state: { count: 0, lastUpdated: Date.now() }
})

const todoStore = createStore<TodoState>({
  name: 'TodoStore',
  state: {
    todos: [],
    filter: 'all',
    newTodoText: ''
  },
  defaultDeep: true
})

function App() {
  const [activeDemo, setActiveDemo] = useState<'counter' | 'todo'>('counter')

  return (
    <div className="App">
      <h1>Substate React Integration Test</h1>
      
      <div className="demo-selector">
        <button 
          onClick={() => setActiveDemo('counter')}
          className={activeDemo === 'counter' ? 'active' : ''}
        >
          Counter Demo
        </button>
        <button 
          onClick={() => setActiveDemo('todo')}
          className={activeDemo === 'todo' ? 'active' : ''}
        >
          Todo Demo
        </button>
      </div>

      <div className="demo-container">
        {activeDemo === 'counter' && <Counter store={counterStore} />}
        {activeDemo === 'todo' && <TodoApp store={todoStore} counterStore={counterStore} />}
      </div>

      <footer>
        <p>Testing Substate integration with React + Vite</p>
        <p>✅ Store injection pattern</p>
        <p>✅ Isolated dependencies</p>
        <p>✅ Full TypeScript support</p>
      </footer>
    </div>
  )
}

export default App
export type { CounterState, TodoState }
