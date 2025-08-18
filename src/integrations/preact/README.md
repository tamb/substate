# Substate Preact Integration

Preact hooks for [Substate](https://github.com/tamb/substate) - a lightweight, type-safe state management library.

> 📖 **For comprehensive documentation**, see the [React integration README](../react/README.md) - the API is identical between React and Preact.

## Installation

```bash
npm install substate preact
```

## Quick Start

```typescript
import { createStore } from 'substate';
import { useSubstate, useSubstateActions } from 'substate/preact';

// Create store outside Preact - works everywhere!
const counterStore = createStore({
  name: 'Counter',
  state: { count: 0 }
});

function Counter() {
  // Get specific state with selector (optimized re-renders)
  const count = useSubstate(counterStore, state => state.count);
  
  // Get all store methods
  const { updateState, resetState } = useSubstateActions(counterStore);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => updateState({ count: count + 1 })}>
        Increment
      </button>
      <button onClick={() => resetState()}>
        Reset
      </button>
    </div>
  );
}
```

## API Reference

### `useSubstate(store, selector?)`

Subscribe to state changes with optional selector for performance optimization.

```typescript
// Get entire state
const state = useSubstate(store);

// Get specific value with function selector
const count = useSubstate(store, state => state.count);

// Get nested value with string selector (dot notation)
const userName = useSubstate(store, 'user.profile.name');
```

### `useSubstateActions(store)`

Get all store methods bound to the provided store.

```typescript
const {
  // Core state methods
  updateState,
  resetState,
  getCurrentState,
  getState,
  getProp,
  
  // History management
  clearHistory,
  limitHistory,
  getMemoryUsage,
  
  // Tagged states
  jumpToTag,
  getTaggedState,
  getAvailableTags,
  removeTag,
  clearTags,
  
  // Sync functionality
  sync,
  
  // Event methods
  on,
  off,
  emit
} = useSubstateActions(store);
```

## Framework Differences

### **Identical API**
The hooks API is **exactly the same** between React and Preact:
```typescript
// Same imports, just different subpath
import { useSubstate, useSubstateActions } from 'substate/preact';

// Same function signatures
const state = useSubstate(store, selector);
const actions = useSubstateActions(store);
```

### **Implementation Details**
- Uses `preact/hooks` instead of `react`
- Same performance optimizations (shallow equality, memoization)
- Same cleanup behavior on component unmount
- Same TypeScript support and type inference

## Advanced Features

### Sync with Form Elements

```typescript
import { useRef, useEffect } from 'preact/hooks';

function UserForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { sync } = useSubstateActions(userStore);
  
  useEffect(() => {
    const unsync = sync({
      readerObj: formRef.current?.elements.email,
      stateField: 'user.email',
      readField: 'value'
    });
    
    return unsync; // Cleanup on unmount
  }, [sync]);
  
  return <form ref={formRef}>...</form>;
}
```

### Tagged States for Undo/Redo

```typescript
function TodoApp() {
  const { updateState, jumpToTag, getAvailableTags } = useSubstateActions(todoStore);
  const tags = useSubstate(todoStore, () => getAvailableTags());
  
  const addTodo = (text: string) => {
    updateState({
      todos: [...todos, newTodo],
      $tag: `added-${text}` // Create checkpoint
    });
  };
  
  return (
    <div>
      {/* Undo buttons */}
      {tags.map(tag => (
        <button key={tag} onClick={() => jumpToTag(tag)}>
          Undo: {tag}
        </button>
      ))}
    </div>
  );
}
```

## TypeScript Support

Full TypeScript support with type inference:

```typescript
interface AppState {
  user: { name: string; email: string };
  settings: { theme: 'light' | 'dark' };
}

const store = createStore({
  name: 'App',
  state: { user: { name: '', email: '' }, settings: { theme: 'light' } } as AppState
});

// Type is inferred as string
const userName = useSubstate(store, state => state.user.name);

// Type is 'light' | 'dark'
const theme = useSubstate(store, state => state.settings.theme);
```

## Examples & Testing

For comprehensive examples and testing, see:

- **Integration Tests**: `integration-tests/preact-vite/` - Full Vite project with examples
- **React Documentation**: `../react/README.md` - Detailed API documentation and examples

```bash
# Run Preact integration test
npm run dev:preact

# See live examples at http://localhost:3002
```

## Why Substate + Preact?

- 🚀 **Store Injection**: Use the same store in Preact, React, Node.js, or vanilla JS
- ⚡ **Optimized Re-renders**: Selective updates only when your data changes
- 🕰️ **Built-in Time Travel**: Complete state history without external tools
- 🔗 **Unique Sync Feature**: Unidirectional data binding with middleware
- 🧠 **Automatic Memory Management**: No memory leaks from unbounded state growth
- 🏷️ **Tagged States**: Named checkpoints for easy undo/redo
- 📦 **Tiny Bundle**: All features in a lightweight package
- 🎯 **Framework Agnostic**: Same store works across different environments

Perfect for Preact applications that need powerful state management without the complexity!