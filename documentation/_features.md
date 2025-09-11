## ✨ Features

### 🚀 **Lightweight** - Tiny bundle size at ~11KB
Substate is designed to be minimal yet powerful. The core library weighs just ~11KB minified, making it perfect for applications where bundle size matters.

```typescript
import { createStore } from 'substate'; // Only ~11KB total
```

### 🔒 **Type-safe** - Full TypeScript support with comprehensive type definitions
Complete TypeScript support with advanced type inference, ensuring type safety throughout your application.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const userStore = createStore({
  name: 'UserStore',
  state: { user: null as User | null, loading: false }
});

// TypeScript knows the exact shape of your state
userStore.updateState({ user: { id: 1, name: 'John', email: 'john@example.com' } });
```

### 🔄 **Reactive** - Built-in Pub/Sub pattern for reactive state updates
Event-driven architecture with built-in subscription system for reactive updates.

```typescript
const store = createStore({
  name: 'ReactiveStore',
  state: { count: 0 }
});

// Subscribe to state changes
store.on('UPDATE_STATE', (newState) => {
  console.log('State updated:', newState);
  // React to changes automatically
});
```

### 🕰️ **Time Travel** - Complete state history with ability to navigate between states
Full state history with configurable memory management. Navigate through state changes like a debugger.

```typescript
const store = createStore({
  name: 'TimeTravelStore',
  state: { count: 0 }
});

// Make some changes
store.updateState({ count: 1 });
store.updateState({ count: 2 });
store.updateState({ count: 3 });

// Go back in time
console.log(store.getState(0)); // { count: 0 } - initial state
console.log(store.getState(1)); // { count: 1 } - first update
console.log(store.getState(2)); // { count: 2 } - second update
```

### 🏷️ **Tagged States** - Named checkpoints for easy state restoration
Create named checkpoints in your state history for easy navigation and debugging.

```typescript
const gameStore = createStore({
  name: 'GameStore',
  state: { level: 1, score: 0 }
});

// Create a checkpoint
gameStore.updateState({ level: 5, score: 1250, $tag: 'level-5-start' });

// Later, jump back to that checkpoint
gameStore.jumpToTag('level-5-start');
console.log(gameStore.getCurrentState()); // { level: 5, score: 1250 }
```

### 🎯 **Immutable** - Automatic deep cloning prevents accidental state mutations
Automatic deep cloning ensures immutability by default, preventing accidental mutations.

```typescript
const store = createStore({
  name: 'ImmutableStore',
  state: { user: { name: 'John', settings: { theme: 'dark' } } }
});

// State is automatically deep cloned - original object is safe
const originalState = store.getCurrentState();
originalState.user.name = 'Jane'; // This won't affect the store

console.log(store.getProp('user.name')); // Still 'John'
```

### 🔗 **Sync** - Unidirectional data binding with middleware transformations
Connect your store to UI components or external systems with powerful sync capabilities.

```typescript
const store = createStore({
  name: 'SyncStore',
  state: { price: 29.99 }
});

// Sync to UI with formatting
const uiModel = { formattedPrice: '' };
const unsync = store.sync({
  readerObj: uiModel,
  stateField: 'price',
  readField: 'formattedPrice',
  beforeUpdate: [(price) => `$${price.toFixed(2)}`]
});

console.log(uiModel.formattedPrice); // '$29.99'
```

### 🎪 **Middleware** - Extensible with before/after update hooks
Powerful middleware system for logging, validation, persistence, and custom logic.

```typescript
const store = createStore({
  name: 'MiddlewareStore',
  state: { count: 0 },
  beforeUpdate: [
    (store, action) => {
      console.log('About to update:', action);
      // Validation logic here
    }
  ],
  afterUpdate: [
    (store, action) => {
      console.log('Updated to:', store.getCurrentState());
      // Persistence logic here
    }
  ]
});
```

### 🌳 **Nested Props** - Easy access to nested properties with optional dot notation or standard object spread
Flexible nested property access with both dot notation convenience and object spread patterns.

```typescript
const store = createStore({
  name: 'NestedStore',
  state: {
    user: {
      profile: { name: 'John', email: 'john@example.com' }
    }
  }
});

// Dot notation (convenient)
store.updateState({ 'user.profile.name': 'Jane' });

// Object spread (explicit)
store.updateState({
  user: {
    ...store.getProp('user'),
    profile: {
      ...store.getProp('user.profile'),
      name: 'Jane'
    }
  }
});

// Both approaches work equally well
```

### 📦 **Framework Agnostic** - Works with any JavaScript framework or vanilla JS
No framework dependencies - use with React, Vue, Angular, Svelte, or vanilla JavaScript.

```typescript
// Vanilla JavaScript
const store = createStore({ name: 'VanillaStore', state: { count: 0 } });

// React
import { useEffect, useState } from 'react';
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    store.on('UPDATE_STATE', (state) => setCount(state.count));
  }, []);
}

// Vue, Angular, Svelte - works with all frameworks!
```
