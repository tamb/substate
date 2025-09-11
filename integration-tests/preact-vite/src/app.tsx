import { useState } from 'preact/hooks'
import { createStore, type TState } from 'substate'
import { useSubstate, useSubstateActions } from 'substate/preact'
import './app.css'

// Define state interface that extends TState
interface CounterState extends TState {
  count: number
  lastUpdated: number
}

// Create stores - with full type safety
const counterStore = createStore<CounterState>({
  name: 'PreactCounterStore', 
  state: { count: 0, lastUpdated: Date.now() }
})

export function App() {
  const [activeDemo, setActiveDemo] = useState<'counter' | 'info'>('counter')
  
  return (
    <div className="app">
      <h1>Substate Preact Integration Test</h1>
      
      <div className="demo-selector">
        <button 
          onClick={() => setActiveDemo('counter')}
          className={activeDemo === 'counter' ? 'active' : ''}
        >
          Counter Demo
        </button>
        <button 
          onClick={() => setActiveDemo('info')}
          className={activeDemo === 'info' ? 'active' : ''}
        >
          Integration Info
        </button>
      </div>

      <div className="demo-container">
        {activeDemo === 'counter' && <CounterDemo />}
        {activeDemo === 'info' && <IntegrationInfo />}
      </div>
    </div>
  )
}

function CounterDemo() {
  const count = useSubstate(counterStore, state => state.count)
  const lastUpdated = useSubstate(counterStore, state => state.lastUpdated)
  const { updateState, resetState, getMemoryUsage } = useSubstateActions(counterStore)
  
  const increment = () => {
    updateState({
      count: count + 1,
      lastUpdated: Date.now(),
      $tag: `preact-count-${count + 1}`
    })
  }
  
  const memoryUsage = getMemoryUsage()
  
  return (
    <div>
      <h2>Preact Counter</h2>
      <p>Testing the same Substate integration with Preact hooks</p>
      
      <div style={{ fontSize: '2rem', margin: '2rem 0' }}>
        Count: <strong>{count}</strong>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={increment} style={{ marginRight: '1rem' }}>
          Increment
        </button>
        <button onClick={() => resetState()}>
          Reset
        </button>
      </div>
      
      <div style={{ fontSize: '0.9rem', color: '#666' }}>
        <p>Last updated: {new Date(lastUpdated).toLocaleTimeString()}</p>
        <p>Memory usage: ~{memoryUsage.estimatedSizeKB}KB</p>
        <p>States in history: {memoryUsage.stateCount}</p>
      </div>
    </div>
  )
}

function IntegrationInfo() {
  return (
    <div style={{ textAlign: 'left' }}>
      <h2>Preact Integration Status</h2>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>✅ Successfully Tested:</h3>
        <ul>
          <li>Store injection pattern with Preact</li>
          <li>useSubstate hook with selectors</li>
          <li>useSubstateActions hook with all methods</li>
          <li>Tagged states functionality</li>
          <li>Memory management</li>
          <li>TypeScript integration</li>
          <li>Isolated dependencies (no hoisting)</li>
        </ul>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>📦 Package Structure:</h3>
        <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '0.5rem' }}>
{`import { createStore } from 'substate'
import { useSubstate, useSubstateActions } from 'substate/preact'`}
        </pre>
      </div>
      
      <div>
        <h3>🎯 Key Benefits:</h3>
        <ul>
          <li><strong>Framework Agnostic:</strong> Same store works in React, Preact, Node.js</li>
          <li><strong>Isolated Dependencies:</strong> No conflicts between React/Preact versions</li>
          <li><strong>Identical API:</strong> Same hooks interface across frameworks</li>
          <li><strong>Full Features:</strong> All Substate features available (sync, tags, memory management)</li>
        </ul>
      </div>
    </div>
  )
}
