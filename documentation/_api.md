## 📖 API Reference

### createStore(config)

Factory function to create a new Substate store with a clean, intuitive API.

```typescript
function createStore(config: ICreateStoreConfig): ISubstate
```

**Parameters:**

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `name` | `string` | ✅ | - | Unique identifier for the store |
| `state` | `object` | ❌ | `{}` | Initial state object |
| `defaultDeep` | `boolean` | ❌ | `false` | Enable deep cloning by default for all updates |
| `beforeUpdate` | `UpdateMiddleware[]` | ❌ | `[]` | Functions called before each state update |
| `afterUpdate` | `UpdateMiddleware[]` | ❌ | `[]` | Functions called after each state update |
| `maxHistorySize` | `number` | ❌ | `50` | Maximum number of states to keep in history |

**Returns:** A new `ISubstate` instance

**Example:**
```typescript
const store = createStore({
  name: 'MyStore',
  state: { count: 0 },
  defaultDeep: true,
  maxHistorySize: 25, // Keep only last 25 states for memory efficiency
  beforeUpdate: [(store, action) => console.log('Updating...', action)],
  afterUpdate: [(store, action) => console.log('Updated!', store.getCurrentState())]
});
```

---

### Store Methods

#### `updateState(action: IState): void`

Updates the current state with new values. Supports both shallow and deep merging.

```typescript
// Simple update
store.updateState({ count: 5 });

// Nested property update with dot notation (optional convenience feature)
store.updateState({ 'user.profile.name': 'John' });

// Or update nested properties using standard object spread (no strings required)
store.updateState({ 
  user: { 
    ...store.getProp('user'),
    profile: { 
      ...store.getProp('user.profile'),
      name: 'John' 
    }
  }
});

// Force deep cloning for this update
store.updateState({ 
  data: complexObject,
  $deep: true 
});

// Update with custom type identifier
store.updateState({ 
  items: newItems,
  $type: 'BULK_UPDATE'
});

// Adding a tag
store.updateState({
  items: importantItem,
  $tag: 'important-item-added'
});
```

**Parameters:**
- `action` - Object containing the properties to update
- `action.$deep` (optional) - Force deep cloning for this update
- `action.$type` (optional) - Custom identifier for this update
- `action.$tag` (optional) - Tag name to create a named checkpoint of this state

---

#### `batchUpdateState(actions: Array<Partial<TState> & IState>): void`

Updates multiple properties at once for better performance. This method is optimized for bulk operations and provides significant performance improvements over multiple individual `updateState()` calls.

```typescript
// Instead of multiple individual updates (slower)
store.updateState({ counter: 1 });
store.updateState({ user: { name: "John" } });
store.updateState({ theme: "dark" });

// Use batch update for better performance
store.batchUpdateState([
  { counter: 1 },
  { user: { name: "John" } },
  { theme: "dark" }
]);

// Batch updates with complex operations
store.batchUpdateState([
  { 'user.profile.name': 'Jane' },
  { 'user.profile.email': 'jane@example.com' },
  { 'settings.theme': 'light' },
  { 'settings.notifications': true }
]);

// Batch updates with metadata
store.batchUpdateState([
  { data: newData, $type: 'DATA_IMPORT' },
  { lastUpdated: Date.now() },
  { version: '2.0.0' }
]);
```

**Performance Benefits:**
- **Single state clone** instead of multiple clones
- **One event emission** instead of multiple events
- **Reduced middleware calls** (if using middleware)
- **Better memory efficiency**

**When to Use:**
- **Multiple related updates** that should happen together
- **Performance-critical code** with frequent state changes
- **Bulk operations** like form submissions or data imports
- **Reducing re-renders** in React/Preact components

**Parameters:**
- `actions` - Array of update action objects (same format as `updateState`)

**Smart Optimization:**
The method automatically detects if it can use the fast path (no middleware, no deep cloning, no tagging) and processes all updates in a single optimized operation. If any action requires the full feature set, it falls back to processing each action individually.

**Example Use Cases:**
```typescript
// Form submission with multiple fields
function submitForm(formData) {
  store.batchUpdateState([
    { 'form.isSubmitting': true },
    { 'form.data': formData },
    { 'form.errors': [] },
    { 'form.lastSubmitted': Date.now() }
  ]);
}

// Bulk data import
function importData(items) {
  store.batchUpdateState([
    { 'data.items': items },
    { 'data.totalCount': items.length },
    { 'data.lastImport': Date.now() },
    { 'ui.showImportSuccess': true }
  ]);
}

// User profile update
function updateProfile(profileData) {
  store.batchUpdateState([
    { 'user.profile': profileData },
    { 'user.lastUpdated': Date.now() },
    { 'ui.profileUpdated': true }
  ]);
}
```

---

#### `getCurrentState(): IState`

Returns the current active state object.

```typescript
const currentState = store.getCurrentState();
console.log(currentState); // { count: 5, user: { name: 'John' } }
```

---

#### `getProp(prop: string): unknown`

Retrieves a specific property from the current state using dot notation for nested access.

```typescript
// Get top-level property
const count = store.getProp('count'); // 5

// Get nested property
const userName = store.getProp('user.profile.name'); // 'John'

// Get array element
const firstItem = store.getProp('items.0.title');

// Returns undefined for non-existent properties
const missing = store.getProp('nonexistent.path'); // undefined
```

---

#### `getState(index: number): IState`

Returns a specific state from the store's history by index.

```typescript
// Get initial state (always at index 0)
const initialState = store.getState(0);

// Get previous state
const previousState = store.getState(store.currentState - 1);

// Get specific historical state
const specificState = store.getState(3);
```

---

#### `resetState(): void`

Resets the store to its initial state (index 0) and emits an `UPDATE_STATE` event.

```typescript
store.resetState();
console.log(store.currentState); // 0
console.log(store.getCurrentState()); // Returns initial state
```

---

#### `sync(config: ISyncConfig): () => void`

Creates unidirectional data binding between a state property and a target object.

```typescript
const unsync = store.sync({
  readerObj: targetObject,
  stateField: 'user.name',
  readField: 'displayName',
  beforeUpdate: [(value) => value.toUpperCase()],
  afterUpdate: [(value) => console.log('Synced:', value)]
});

// Call to cleanup the sync
unsync();
```

**Parameters:**

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `readerObj` | `Record<string, unknown>` | ✅ | Target object to sync to |
| `stateField` | `string` | ✅ | State property to watch (supports dot notation) |
| `readField` | `string` | ❌ | Target property name (defaults to `stateField`) |
| `beforeUpdate` | `BeforeMiddleware[]` | ❌ | Transform functions applied before sync |
| `afterUpdate` | `AfterMiddleware[]` | ❌ | Side-effect functions called after sync |

**Returns:** Function to call for cleanup (removes event listeners)

---

#### `clearHistory(): void`

Clears all state history except the current state to free up memory.

```typescript
// After many state updates...
console.log(store.stateStorage.length); // 50+ states

store.clearHistory();
console.log(store.stateStorage.length); // 1 state
console.log(store.currentState); // 0

// Current state is preserved
console.log(store.getCurrentState()); // Latest state data
```

**Use cases:**
- Memory optimization in long-running applications
- Cleaning up after bulk operations
- Preparing for application state snapshots

---

#### `limitHistory(maxSize: number): void`

Sets a new limit for state history size and trims existing history if necessary.

```typescript
// Current setup
store.limitHistory(10); // Keep only last 10 states

// If current history exceeds the limit, it gets trimmed
console.log(store.stateStorage.length); // Max 10 states

// Dynamic adjustment for debugging
if (debugMode) {
  store.limitHistory(100); // More history for debugging
} else {
  store.limitHistory(5);   // Minimal history for production
}
```

**Parameters:**
- `maxSize` - Maximum number of states to keep (minimum: 1)

**Throws:** Error if `maxSize` is less than 1

---

#### `getMemoryUsage(): { stateCount: number; taggedCount: number; estimatedSizeKB: number }`

Returns estimated memory usage information for performance monitoring.

```typescript
const usage = store.getMemoryUsage();
console.log(`States: ${usage.stateCount}`);
console.log(`Estimated Size: ${usage.estimatedSizeKB}KB`);

// Memory monitoring
if (usage.estimatedSizeKB > 1000) {
  console.warn('Store using over 1MB of memory');
  store.clearHistory(); // Clean up if needed
}

// Performance tracking
setInterval(() => {
  const { stateCount, estimatedSizeKB } = store.getMemoryUsage();
  console.log(`Memory: ${estimatedSizeKB}KB (${stateCount} states)`);
}, 10000);
```

**Returns:**
- `stateCount` - Number of states currently stored  
- `taggedCount` - Number of tagged states currently stored
- `estimatedSizeKB` - Rough estimation of memory usage in kilobytes

**Note:** Size estimation is approximate and based on JSON serialization size.

---

#### `getTaggedState(tag: string): IState | undefined`

Retrieves a tagged state by its tag name without affecting the current state.

```typescript
// Create tagged states
store.updateState({ user: userData, $tag: "user-login" });
store.updateState({ cart: cartData, $tag: "checkout-ready" });

// Retrieve specific tagged states
const loginState = store.getTaggedState("user-login");
const checkoutState = store.getTaggedState("checkout-ready");

// Returns undefined for non-existent tags
const missing = store.getTaggedState("non-existent"); // undefined
```

**Parameters:**
- `tag` - The tag name to look up

**Returns:** Deep cloned tagged state or `undefined` if tag doesn't exist

---

#### `getAvailableTags(): string[]`

Returns an array of all available tag names.

```typescript
store.updateState({ step: 1, $tag: "step-1" });
store.updateState({ step: 2, $tag: "step-2" });

console.log(store.getAvailableTags()); // ["step-1", "step-2"]

// Use for conditional navigation
if (store.getAvailableTags().includes("last-known-good")) {
  store.jumpToTag("last-known-good");
}
```

**Returns:** Array of tag names currently stored

---

#### `jumpToTag(tag: string): void`

Jumps to a tagged state, making it the current state and adding it to history.

```typescript
// Create checkpoints
store.updateState({ page: "home", $tag: "home-page" });
store.updateState({ page: "profile", user: userData, $tag: "profile-page" });
store.updateState({ page: "settings" });

// Jump back to a checkpoint
store.jumpToTag("profile-page");
console.log(store.getCurrentState().page); // "profile"

// Continue from the restored state
store.updateState({ page: "edit-profile" });
```

**Parameters:**
- `tag` - The tag name to jump to

**Throws:** Error if the tag doesn't exist

**Events:** Emits `TAG_JUMPED` and `STATE_UPDATED`

---

#### `removeTag(tag: string): boolean`

Removes a tag from the tagged states collection.

```typescript
store.updateState({ temp: "data", $tag: "temporary" });

const wasRemoved = store.removeTag("temporary");
console.log(wasRemoved); // true

// Tag is now gone
console.log(store.getTaggedState("temporary")); // undefined
```

**Parameters:**
- `tag` - The tag name to remove

**Returns:** `true` if tag was found and removed, `false` if it didn't exist

**Events:** Emits `TAG_REMOVED` for existing tags

---

#### `clearTags(): void`

Removes all tagged states from the collection.

```typescript
// After bulk operations with many tags
store.clearTags();
console.log(store.getAvailableTags()); // []

// State history remains intact
console.log(store.stateStorage.length); // Still has all states
```

**Events:** Emits `TAGS_CLEARED` with count of cleared tags

---

### Event Methods (Inherited from PubSub)

#### `on(event: string, callback: Function): void`

Subscribe to store events. Substate emits several built-in events for different operations.

**Built-in Events:**

| Event | When Emitted | Data Payload |
|-------|--------------|--------------|
| `STATE_UPDATED` | After any state update | `newState: IState` |
| `STATE_RESET` | When `resetState()` is called | None |
| `TAG_JUMPED` | When `jumpToTag()` is called | `{ tag: string, state: IState }` |
| `TAG_REMOVED` | When `removeTag()` removes an existing tag | `{ tag: string }` |
| `TAGS_CLEARED` | When `clearTags()` is called | `{ clearedCount: number }` |
| `HISTORY_CLEARED` | When `clearHistory()` is called | `{ previousLength: number }` |
| `HISTORY_LIMIT_CHANGED` | When `limitHistory()` is called | `{ newLimit: number, oldLimit: number, trimmed: number }` |

```typescript
// Listen to state updates
store.on('STATE_UPDATED', (newState: IState) => {
  console.log('State changed:', newState);
});

// Listen to tagging events
store.on('TAG_JUMPED', ({ tag, state }) => {
  console.log(`Jumped to tag: ${tag}`, state);
});

// Listen to memory management events
store.on('HISTORY_CLEARED', ({ previousLength }) => {
  console.log(`Cleared ${previousLength} states from history`);
});

// Listen to custom events
store.on('USER_LOGIN', (userData) => {
  console.log('User logged in:', userData);
});
```

---

#### `emit(event: string, data?: unknown): void`

Emit custom events to all subscribers.

```typescript
// Emit custom event
store.emit('USER_LOGIN', { userId: 123, name: 'John' });

// Emit without data
store.emit('CACHE_CLEARED');
```

---

#### `off(event: string, callback: Function): void`

Unsubscribe from store events.

```typescript
const handler = (state) => console.log(state);

store.on('UPDATE_STATE', handler);
store.off('UPDATE_STATE', handler); // Removes this specific handler
```

---

### Store Properties

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Store identifier |
| `currentState` | `number` | Index of current state in history |
| `stateStorage` | `IState[]` | Array of all state versions |
| `defaultDeep` | `boolean` | Default deep cloning setting |
| `maxHistorySize` | `number` | Maximum number of states to keep in history |
| `beforeUpdate` | `UpdateMiddleware[]` | Pre-update middleware functions |
| `afterUpdate` | `UpdateMiddleware[]` | Post-update middleware functions |

#### Middleware Order

updateState(action)
├── store.beforeUpdate[] (store-wide)
├── State Processing
│   ├── Clone state
│   ├── Apply temp updates
│   ├── Push to history
│   └── Update tagged states
├── sync.beforeUpdate[] (per sync instance)
├── sync.afterUpdate[] (per sync instance)
├── store.afterUpdate[] (store-wide)
└── emit STATE_UPDATED or `$type` event

