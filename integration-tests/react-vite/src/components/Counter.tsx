import type { TState, ISubstate } from 'substate'
import { useSubstate, useSubstateActions } from 'substate/react'

interface CounterState extends TState {
  count: number
  lastUpdated: number
}

interface CounterProps {
  store: ISubstate<CounterState>
}

export default function Counter({ store }: CounterProps) {
  // Test selector optimization - only re-renders when count changes
  const count1 = useSubstate(store, (state) => state.count)
  const lastUpdated1 = useSubstate(store, (state) => state.lastUpdated)
  const { count, lastUpdated } = useSubstate(store);
  
  // Test comprehensive actions hook
  const { 
    updateState, 
    resetState, 
    jumpToTag, 
    getAvailableTags,
    getMemoryUsage 
  } = useSubstateActions(store)
  
  const increment = () => {
    updateState({
      count: count + 1,
      lastUpdated: Date.now(),
      $tag: `count-${count + 1}` // Test tagged states
    })
  }
  
  const decrement = () => {
    updateState({
      count: count - 1,
      lastUpdated: Date.now(),
      $tag: `count-${count - 1}`
    })
  }
  
  const availableTags = getAvailableTags()
  const memoryUsage = getMemoryUsage()
  
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Counter Example</h2>
      <p>Testing: Store injection, selectors, actions, tagged states</p>
      
      <div style={{ fontSize: '2rem', margin: '1rem 0' }}>
        Count: <strong>{count}</strong>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={increment} style={{ marginRight: '0.5rem' }}>
          Increment
        </button>
        <button onClick={decrement} style={{ marginRight: '0.5rem' }}>
          Decrement
        </button>
        <button onClick={() => resetState()}>
          Reset
        </button>
      </div>
      
      {availableTags.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <h4>Tagged States (Click to jump):</h4>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            {availableTags.slice(-5).map((tag : string) => (
              <button
                key={tag}
                onClick={() => jumpToTag(tag)}
                style={{ 
                  fontSize: '0.8rem', 
                  padding: '0.25rem 0.5rem',
                  background: '#e7f3ff',
                  border: '1px solid #b3d9ff',
                  borderRadius: '0.25rem'
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        {count1} - {lastUpdated1} | {count} - {lastUpdated}
      </div>
      
      <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem' }}>
        <p>Last updated: {new Date(lastUpdated).toLocaleTimeString()}</p>
        <p>Memory: ~{memoryUsage.estimatedSizeKB}KB ({memoryUsage.stateCount} states)</p>
        <p>Available tags: {availableTags.length}</p>
      </div>
    </div>
  )
}
