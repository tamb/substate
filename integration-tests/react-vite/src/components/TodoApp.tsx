import React, { useRef } from 'react'
import type { TUserState, ISubstate } from 'substate'
import { useSubstate, useSubstateActions } from 'substate/react'

import { type CounterState } from '../App'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

interface TodoState extends TUserState {
  todos: Todo[]
  filter: 'all' | 'active' | 'completed'
  newTodoText: string
}

interface TodoProps {
  store: ISubstate<TodoState>
  counterStore: ISubstate<CounterState>
}

export default function TodoApp({ store, counterStore }: TodoProps) {
  const formRef = useRef<HTMLFormElement>(null)
  
  // Test multiple selectors for performance optimization
  const todos = useSubstate(store, (state) => state.todos)
  const filter = useSubstate(store, (state) => state.filter)
  const newTodoText = useSubstate(store, (state) => state.newTodoText)
  const count = useSubstate(counterStore, (state) => state.count)
  
  const { 
    updateState, 
    jumpToTag, 
    getAvailableTags,
    clearHistory 
  } = useSubstateActions(store)
  
  // Test sync functionality with form
  // useEffect(() => {
  //   if (!formRef.current) return
    
  //   const inputElement = formRef.current.querySelector('input[name="newTodo"]') as HTMLInputElement
  //   if (!inputElement) return
    
  //   const unsync = sync({
  //     readerObj: inputElement as unknown as Record<string, unknown>,
  //     stateField: 'newTodoText',
  //     readField: 'value'
  //   })
    
  //   return unsync // Test cleanup
  // }, [sync])
  
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodoText.trim()) return
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: newTodoText.trim(),
      completed: false,
      createdAt: Date.now()
    }
    
    updateState({
      todos: [...todos, newTodo],
      newTodoText: '',
      $tag: `added-${newTodo.text.slice(0, 10)}`
    })
  }
  
  const toggleTodo = (id: string) => {
    updateState({
      todos: todos.map((todo : Todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
      $tag: `toggled-${id.slice(0, 8)}`
    })
  }
  
  const deleteTodo = (id: string) => {
    const todoText = todos.find((t : Todo) => t.id === id)?.text || 'todo'
    updateState({
      todos: todos.filter((todo : Todo) => todo.id !== id),
      $tag: `deleted-${todoText.slice(0, 10)}`
    })
  }
  
  const filteredTodos = todos.filter((todo : Todo) => {
    switch (filter) {
      case 'active': return !todo.completed
      case 'completed': return todo.completed
      default: return true
    }
  })
  
  const stats = {
    total: todos.length,
    active: todos.filter((t : Todo) => !t.completed).length,
    completed: todos.filter((t : Todo) => t.completed).length
  }
  
  const availableTags = getAvailableTags()
  
  return (
    <div style={{ padding: '1rem', textAlign: 'left' }}>
      <h2>Todo App Example</h2> <span>Counter: {count}</span>
      <p>Testing: Complex state, sync functionality, tagged states, memory management</p>
      
      <form ref={formRef} onSubmit={addTodo} style={{ marginBottom: '1rem' }}>
        <input
          name="newTodo"
          type="text"
          placeholder="Add a new todo..."
          value={newTodoText}
          onChange={(e) => updateState({ newTodoText: e.target.value })}
          style={{ 
            width: '60%', 
            padding: '0.5rem', 
            marginRight: '0.5rem',
            border: '1px solid #ddd',
            borderRadius: '0.25rem'
          }}
        />
        <button type="submit">Add Todo</button>
      </form>
      
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => updateState({ filter: 'all' })}
          style={{ 
            marginRight: '0.5rem',
            fontWeight: filter === 'all' ? 'bold' : 'normal',
            background: filter === 'all' ? '#e7f3ff' : 'transparent'
          }}
        >
          All ({stats.total})
        </button>
        <button 
          onClick={() => updateState({ filter: 'active' })}
          style={{ 
            marginRight: '0.5rem',
            fontWeight: filter === 'active' ? 'bold' : 'normal',
            background: filter === 'active' ? '#e7f3ff' : 'transparent'
          }}
        >
          Active ({stats.active})
        </button>
        <button 
          onClick={() => updateState({ filter: 'completed' })}
          style={{ 
            fontWeight: filter === 'completed' ? 'bold' : 'normal',
            background: filter === 'completed' ? '#e7f3ff' : 'transparent'
          }}
        >
          Completed ({stats.completed})
        </button>
      </div>
      
      <div style={{ minHeight: '200px', marginBottom: '1rem' }}>
        {filteredTodos.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            {filter === 'all' ? 'No todos yet' : `No ${filter} todos`}
          </p>
        ) : (
          filteredTodos.map((todo : Todo) => (
            <div 
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem',
                borderBottom: '1px solid #eee',
                background: todo.completed ? '#f8f9fa' : 'white'
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                style={{ marginRight: '0.5rem' }}
              />
              <span 
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#666' : 'black'
                }}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  padding: '0.25rem 0.5rem',
                  background: '#ff6b6b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.25rem',
                  fontSize: '0.8rem'
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
      
      {availableTags.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h4>Recent Actions (Click to undo):</h4>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            {availableTags.slice(-5).map((tag : string) => (
              <button
                key={tag}
                onClick={() => jumpToTag(tag)}
                style={{
                  fontSize: '0.8rem',
                  padding: '0.25rem 0.5rem',
                  background: '#fff3cd',
                  border: '1px solid #ffeaa7',
                  borderRadius: '0.25rem'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div style={{ fontSize: '0.8rem', color: '#666' }}>
        <button onClick={() => clearHistory()} style={{ marginBottom: '0.5rem' }}>
          Clear History
        </button>
        <p>📊 Stats: {stats.total} total, {stats.active} active, {stats.completed} completed</p>
        <p>🏷️ Tagged actions: {availableTags.length}</p>
      </div>
    </div>
  )
}
