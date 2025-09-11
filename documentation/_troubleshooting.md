## 🔧 Troubleshooting

### Common Issues and Solutions

#### 🔄 State Updates Not Triggering Re-renders

**Problem**: State updates aren't triggering component re-renders or event listeners.

**Solutions**:

```typescript
// ✅ Correct: Use updateState method
store.updateState({ count: 1 });

// ❌ Wrong: Direct state mutation
store.stateStorage[store.currentState].count = 1; // Won't trigger events

// ✅ Correct: Subscribe properly
store.on('UPDATE_STATE', (newState) => {
  console.log('State changed:', newState);
  // Update your UI here
});
```

#### 🧊 Deep Cloning Issues

**Problem**: Performance issues with deep cloning on complex objects.

**Solutions**:

```typescript
// For simple updates, disable deep cloning
store.updateState({
  simpleValue: 'new value',
  $deep: false  // Skip deep cloning for this update
});

// Or configure store to skip deep cloning by default
const store = createStore({
  name: 'FastStore',
  state: { data: largeObject },
  defaultDeep: false  // Skip deep cloning by default
});

// Force deep cloning when needed
store.updateState({
  complexData: largeObject,
  $deep: true  // Force deep cloning
});
```

#### 🔗 Sync Not Working

**Problem**: Sync bindings aren't updating target objects.

**Solutions**:

```typescript
// ✅ Correct sync setup
const unsync = store.sync({
  readerObj: targetObject,
  stateField: 'user.name',
  readField: 'displayName'
});

// Make sure to call unsync() when component unmounts
useEffect(() => {
  return () => unsync(); // Cleanup sync binding
}, []);

// Check that property paths exist
console.log(store.getProp('user.name')); // Should not be undefined
```

#### 🏷️ Tagged States Not Found

**Problem**: `jumpToTag()` throws "tag not found" error.

**Solutions**:

```typescript
// ✅ Correct tag creation
store.updateState({
  data: importantData,
  $tag: 'checkpoint-1'  // Create tag when updating
});

// Wait for state update before jumping
store.updateState({ step: 2, $tag: 'step-2' });
setTimeout(() => {
  store.jumpToTag('step-2'); // Tag exists now
}, 0);

// Check available tags first
if (store.getAvailableTags().includes('my-tag')) {
  store.jumpToTag('my-tag');
}
```

#### 📊 Memory Usage Issues

**Problem**: Store consuming too much memory.

**Solutions**:

```typescript
// Limit history size
const store = createStore({
  name: 'MemoryEfficientStore',
  state: { data: [] },
  maxHistorySize: 10  // Keep only last 10 states
});

// Manually clear history
store.clearHistory();

// Monitor memory usage
setInterval(() => {
  const usage = store.getMemoryUsage();
  if (usage.estimatedSizeKB > 1000) {
    store.clearHistory(); // Clean up if over 1MB
  }
}, 30000);
```

#### 🔄 Event Listener Memory Leaks

**Problem**: Event listeners not being cleaned up.

**Solutions**:

```typescript
// ✅ Correct cleanup
const handler = (state) => console.log(state);
store.on('UPDATE_STATE', handler);

// Later, remove the listener
store.off('UPDATE_STATE', handler);

// Or use unsync for sync bindings
const unsync = store.sync({ /* config */ });
// Later
unsync(); // Clean up sync binding
```

#### 🐛 TypeScript Type Errors

**Problem**: TypeScript complaining about state types.

**Solutions**:

```typescript
// Define proper interfaces
interface User {
  id: number;
  name: string;
  email: string;
}

interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Type your store
const store = createStore({
  name: 'TypedStore',
  state: {
    user: null,
    loading: false,
    error: null
  } as AppState
});

// Or use generics if available
const store = createStore<AppState>({
  name: 'TypedStore',
  state: {
    user: null,
    loading: false,
    error: null
  }
});
```

#### ⚡ Performance Issues with Large State

**Problem**: Slow updates with large state objects.

**Solutions**:

```typescript
// Use batch updates for multiple changes
store.batchUpdateState([
  { 'user.name': 'John' },
  { 'user.email': 'john@example.com' },
  { 'settings.theme': 'dark' }
]);

// Minimize state size
const store = createStore({
  name: 'OptimizedStore',
  state: {
    // Only store what you need
    essentialData: smallObject,
    // Avoid storing large objects if possible
    // computedData: computeOnDemand()
  }
});

// Use shallow updates when possible
store.updateState({
  simpleField: 'value',
  $deep: false
});
```

#### 🔍 Debugging State Changes

**Problem**: Hard to track what changed in state.

**Solutions**:

```typescript
// Add logging middleware
const store = createStore({
  name: 'DebugStore',
  state: { count: 0 },
  beforeUpdate: [
    (store, action) => {
      console.log('Before update:', store.getCurrentState());
      console.log('Action:', action);
    }
  ],
  afterUpdate: [
    (store, action) => {
      console.log('After update:', store.getCurrentState());
    }
  ]
});

// Log all state changes
store.on('UPDATE_STATE', (newState, oldState) => {
  console.log('State changed from:', oldState, 'to:', newState);
});

// Use tagged states for debugging
store.updateState({
  debugInfo: data,
  $tag: 'before-bug'
});
```

### Need More Help?

- **📖 Check the [API Reference](#-api-reference)** for detailed method documentation
- **🔍 Review [Usage Examples](#-usage-examples)** for common patterns
- **⚡ Look at [Performance Benchmarks](#-performance-benchmarks)** for optimization tips
- **🐛 [Open an Issue](https://github.com/TomSaporito/substate/issues)** on GitHub
