import React, { useState } from 'react'
import { createStore } from 'substate'
import { useSubstate, useSubstateActions } from 'substate/react'
import Counter from './components/Counter'
import TodoApp from './components/TodoApp'
import './App.css'

// Create stores outside React - demonstrates framework-agnostic nature
const counterStore = createStore({
  name: 'CounterStore',
  state: { count: 0, lastUpdated: Date.now() }
})

const todoStore = createStore({
  name: 'TodoStore',
  state: {
    todos: [],
    filter: 'all' as 'all' | 'active' | 'completed',
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
        {activeDemo === 'todo' && <TodoApp store={todoStore} />}
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
