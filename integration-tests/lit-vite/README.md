# Lit + Substate Integration Example

This example demonstrates how to properly use Substate's `sync` feature with Lit components using two different approaches.

## Key Concepts

### 1. Proper Sync Configuration

The `sync` method requires:
- `readerObj`: A plain object to receive synced values
- `stateField`: The property in the store state to watch
- `readField`: The property in `readerObj` to update
- `afterMiddleware`: Functions to execute after syncing (for triggering re-renders)

### 2. Two Sync Approaches

#### Approach 1: Store Middleware (Multiplier Component)
```typescript
// Store with middleware for derived state
const store = createStore({
  name: 'counter',
  state: { count: 0, multipliedCount: 0, isEven: false },
  afterUpdate: [
    (store, action) => {
      // Compute derived values after any state update
      if (action.count !== undefined) {
        const count = store.getCurrentState().count;
        const multiplied = count * 3;
        const isEven = multiplied % 2 === 0;
        
        store.updateState({
          multipliedCount: multiplied,
          isEven,
          $type: 'DERIVED_UPDATE'
        });
      }
    }
  ]
});

// Simple sync - just handle UI updates
store.sync({
  readerObj: this as any,
  stateField: 'count',
  readField: 'count',
  afterMiddleware: [() => this.requestUpdate('count')]
});
```

**Pros:**
- **Clean separation** - Store handles logic, sync handles UI
- **No infinite loops** - Middleware runs once per update
- **Centralized logic** - All derived state in one place
- **Reusable** - Works with any component that syncs to the store
- **Type-safe** - No complex sync middleware

**Cons:**
- Requires type assertion (`as any`)
- Store configuration is more complex

#### Approach 2: SyncTarget Pattern (Counter Component)
```typescript
private syncTarget: Record<string, unknown> = {};

store.sync({
  readerObj: this.syncTarget,  // Type-safe
  stateField: 'count',
  readField: 'count',
  afterMiddleware: [
    (value) => {
      this.count = value as number;     // Manual property update
      this.requestUpdate('count');      // Trigger re-render
    }
  ]
});
```

**Pros:**
- Type-safe
- Clear separation of concerns
- Easier to debug
- More control over property updates

**Cons:**
- More boilerplate code
- Manual property assignment

### 3. Memory Management

Always store the returned unsync functions and call them in `disconnectedCallback()`:

```typescript
private unsyncFunctions: (() => void)[] = [];

constructor() {
  super();
  this.unsyncFunctions.push(store.sync({...}));
}

disconnectedCallback() {
  super.disconnectedCallback();
  this.unsyncFunctions.forEach(unsync => unsync());
  this.unsyncFunctions = [];
}
```

### 4. State Updates

Always update the store state, not local properties:

```typescript
// ❌ Wrong - updates local property only
this.count++;

// ✅ Correct - updates store state
store.updateState({ count: this.count + 1 });
```

### 5. Preventing Infinite Loops with Custom `$type`

Use custom `$type` values to prevent infinite loops in derived state computations:

```typescript
// User action - emits 'USER_ACTION' event
store.updateState({ 
  count: 5,
  $type: 'USER_ACTION'
});

// Computed update - emits 'COMPUTED_UPDATE' event
store.updateState({ 
  multipliedCount: 15,
  isEven: false,
  $type: 'COMPUTED_UPDATE'
});
```

**How it works:**
- Sync listeners only respond to `'STATE_UPDATED'` events
- Custom `$type` values emit different events (`'USER_ACTION'`, `'COMPUTED_UPDATE'`, etc.)
- This prevents computed updates from triggering more computations

## Components

### Counter Component (`counter-el`)
- Uses **SyncTarget Pattern**
- Demonstrates basic sync with a single property
- Shows how to handle button clicks to update store state
- **Reacts to derived state** - Changes color based on `isMultiplierEven`

### Multiplier Component (`multiplier-el`)
- Uses **Store Middleware** for derived state
- Demonstrates automatic computation of `multipliedCount` and `isMultiplierEven`
- Shows how store middleware handles complex logic
- **Reacts to count changes** - Automatically updates when counter increments

## Running the Example

```bash
npm run dev
```

Visit the page to see both components working with shared state through the Substate store. Try clicking the buttons to see how state updates propagate between components using different sync approaches.
