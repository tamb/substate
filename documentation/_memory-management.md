## 🧠 Memory Management

Substate automatically manages memory through configurable history limits and provides tools for monitoring and optimization.

### Automatic History Management

By default, Substate keeps the last **50 states** in memory. This provides excellent debugging capabilities while preventing unbounded memory growth:

```typescript
const store = createStore({
  name: 'AutoManagedStore',
  state: { data: [] },
  maxHistorySize: 50 // Default - good for most applications
});

// After 100 updates, only the last 50 states are kept
for (let i = 0; i < 100; i++) {
  store.updateState({ data: [i] });
}

console.log(store.stateStorage.length); // 50 (not 100!)
```

### Memory Optimization Strategies

#### For Small Applications (Default)
```typescript
// Use default settings - 50 states is perfect for small apps
const store = createStore({
  name: 'SmallApp',
  state: { user: null, settings: {} }
  // maxHistorySize: 50 (default)
});
```

#### For High-Frequency Updates
```typescript
// Reduce history for apps with frequent state changes
const store = createStore({
  name: 'RealtimeApp',
  state: { liveData: [] },
  maxHistorySize: 10 // Keep minimal history
});

// Or dynamically adjust
if (isRealtimeMode) {
  store.limitHistory(5);
}
```

#### For Large State Objects
```typescript
// Monitor and manage memory proactively
const store = createStore({
  name: 'LargeDataApp',
  state: { dataset: [], cache: {} },
  maxHistorySize: 20
});

// Regular memory monitoring
setInterval(() => {
  const { stateCount, estimatedSizeKB } = store.getMemoryUsage();
  
  if (estimatedSizeKB > 5000) { // Over 5MB
    console.log('Memory usage high, clearing history...');
    store.clearHistory();
  }
}, 30000);
```

#### For Debugging vs Production
```typescript
const store = createStore({
  name: 'FlexibleApp',
  state: { app: 'data' },
  maxHistorySize: process.env.NODE_ENV === 'development' ? 100 : 25
});

// Runtime adjustment
if (debugMode) {
  store.limitHistory(200); // More history for debugging
} else {
  store.limitHistory(10);  // Minimal for production
}
```

### Memory Monitoring

Use the built-in monitoring tools to track memory usage:

```typescript
// Basic monitoring
function logMemoryUsage(store: ISubstate, context: string) {
  const { stateCount, estimatedSizeKB } = store.getMemoryUsage();
  console.log(`${context}: ${stateCount} states, ~${estimatedSizeKB}KB`);
}

// After bulk operations
logMemoryUsage(store, 'After data import');

// Regular health checks
setInterval(() => logMemoryUsage(store, 'Health check'), 60000);
```

### Best Practices

1. **🎯 Choose appropriate limits**: 50 states for normal apps, 10-20 for high-frequency updates
2. **📊 Monitor memory usage**: Use `getMemoryUsage()` to track growth patterns
3. **🧹 Clean up after bulk operations**: Call `clearHistory()` after large imports/updates
4. **⚖️ Balance debugging vs performance**: More history = better debugging, less history = better performance
5. **🔄 Adjust dynamically**: Use `limitHistory()` to adapt to different application modes

### Performance Impact

The default settings are optimized for most use cases:

- **Memory**: ~50KB - 5MB typical usage depending on state size
- **Performance**: Negligible impact with default 50-state limit  
- **Time Travel**: Full debugging capabilities maintained
- **Automatic cleanup**: No manual intervention required

> **💡 Note**: The 50-state default is designed for smaller applications. For enterprise applications with large state objects or high-frequency updates, consider customizing `maxHistorySize` based on your specific memory constraints.
