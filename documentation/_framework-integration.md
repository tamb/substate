## 🎯 Framework Integrations

Substate works seamlessly with all major JavaScript frameworks. Here are integration guides and best practices for each framework.

### React Integration

#### Basic React Hook Pattern

```typescript
import { useEffect, useState } from 'react';
import { createStore } from 'substate';

const counterStore = createStore({
  name: 'CounterStore',
  state: { count: 0 }
});

// Custom hook for Substate integration
function useSubstate(store: ISubstate) {
  const [state, setState] = useState(store.getCurrentState());

  useEffect(() => {
    const handler = (newState: IState) => setState(newState);
    store.on('UPDATE_STATE', handler);

    return () => store.off('UPDATE_STATE', handler);
  }, [store]);

  return state;
}

// Usage in component
function Counter() {
  const state = useSubstate(counterStore);

  return (
    <div>
      <h1>Count: {state.count}</h1>
      <button onClick={() => counterStore.updateState({ count: state.count + 1 })}>
        Increment
      </button>
    </div>
  );
}
```

#### Advanced React Patterns

```typescript
// Context-based store provider
import { createContext, useContext, ReactNode } from 'react';

const StoreContext = createContext<ISubstate | null>(null);

export function StoreProvider({ children, store }: { children: ReactNode, store: ISubstate }) {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used within StoreProvider');
  return store;
}

// Usage with context
function App() {
  const globalStore = createStore({
    name: 'GlobalStore',
    state: { user: null, theme: 'light' }
  });

  return (
    <StoreProvider store={globalStore}>
      <Header />
      <Content />
    </StoreProvider>
  );
}

function Header() {
  const store = useStore();
  const [user, setUser] = useState(store.getProp('user'));

  useEffect(() => {
    const handler = () => setUser(store.getProp('user'));
    store.on('UPDATE_STATE', handler);
    return () => store.off('UPDATE_STATE', handler);
  }, [store]);

  return <header>Welcome, {user?.name || 'Guest'}</header>;
}
```

#### React with Sync Integration

```typescript
function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    displayName: ''
  });

  const formStore = useMemo(() => createStore({
    name: 'UserForm',
    state: { name: '', email: '' }
  }), []);

  useEffect(() => {
    // Sync store to form display
    const unsyncName = formStore.sync({
      readerObj: formData,
      stateField: 'name',
      readField: 'displayName',
      beforeUpdate: [(name) => name.toUpperCase()]
    });

    return () => unsyncName();
  }, [formStore, formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    formStore.updateState({
      name: formData.name,
      email: formData.email
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Name"
      />
      <input
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        placeholder="Email"
      />
      <p>Display Name: {formData.displayName}</p>
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Preact Integration

Preact works identically to React since Substate is framework agnostic:

```typescript
import { useEffect, useState } from 'preact/hooks';
import { createStore } from 'substate';

function useSubstate(store: ISubstate) {
  const [state, setState] = useState(store.getCurrentState());

  useEffect(() => {
    const handler = (newState: IState) => setState(newState);
    store.on('UPDATE_STATE', handler);

    return () => store.off('UPDATE_STATE', handler);
  }, [store]);

  return state;
}

export default function Counter() {
  const state = useSubstate(counterStore);

  return (
    <div>
      <h1>{state.count}</h1>
      <button onClick={() => counterStore.updateState({ count: state.count + 1 })}>
        +
      </button>
    </div>
  );
}
```

### Vue 3 Integration

```typescript
<template>
  <div>
    <h1>{{ count }}</h1>
    <button @click="increment">+</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { createStore } from 'substate';

const counterStore = createStore({
  name: 'CounterStore',
  state: { count: 0 }
});

const count = ref(0);

const updateCount = (newState: IState) => {
  count.value = newState.count;
};

onMounted(() => {
  count.value = counterStore.getCurrentState().count;
  counterStore.on('UPDATE_STATE', updateCount);
});

onUnmounted(() => {
  counterStore.off('UPDATE_STATE', updateCount);
});

const increment = () => {
  counterStore.updateState({ count: count.value + 1 });
};
</script>
```

#### Vue Composition API with Reactive Store

```typescript
// composables/useSubstate.ts
import { reactive, onMounted, onUnmounted } from 'vue';

export function useSubstate(store: ISubstate) {
  const state = reactive({ ...store.getCurrentState() });

  const updateState = (newState: IState) => {
    Object.assign(state, newState);
  };

  onMounted(() => {
    store.on('UPDATE_STATE', updateState);
  });

  onUnmounted(() => {
    store.off('UPDATE_STATE', updateState);
  });

  return state;
}

// Usage
<script setup>
const counterStore = createStore({
  name: 'Counter',
  state: { count: 0 }
});

const state = useSubstate(counterStore);

const increment = () => {
  counterStore.updateState({ count: state.count + 1 });
};
</script>

<template>
  <div>
    <h1>{{ state.count }}</h1>
    <button @click="increment">+</button>
  </div>
</template>
```

### Angular Integration

```typescript
// counter.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { createStore } from 'substate';

@Injectable({
  providedIn: 'root'
})
export class CounterService {
  private store = createStore({
    name: 'CounterStore',
    state: { count: 0 }
  });

  private countSubject = new BehaviorSubject<number>(0);
  public count$ = this.countSubject.asObservable();

  constructor() {
    this.store.on('UPDATE_STATE', (state) => {
      this.countSubject.next(state.count);
    });
  }

  increment() {
    const currentCount = this.store.getProp('count') as number;
    this.store.updateState({ count: currentCount + 1 });
  }

  getCount(): number {
    return this.store.getProp('count') as number;
  }
}

// counter.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-counter',
  template: `
    <div>
      <h1>{{ count }}</h1>
      <button (click)="increment()">+</button>
    </div>
  `
})
export class CounterComponent implements OnInit, OnDestroy {
  count = 0;
  private subscription!: Subscription;

  constructor(private counterService: CounterService) {}

  ngOnInit() {
    this.subscription = this.counterService.count$.subscribe(count => {
      this.count = count;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  increment() {
    this.counterService.increment();
  }
}
```

### Svelte Integration

```typescript
// stores/counter.js
import { createStore } from 'substate';
import { writable } from 'svelte/store';

const counterStore = createStore({
  name: 'CounterStore',
  state: { count: 0 }
});

export const count = writable(0);

// Sync Substate to Svelte store
counterStore.on('UPDATE_STATE', (newState) => {
  count.set(newState.count);
});

export function increment() {
  const currentCount = counterStore.getProp('count') as number;
  counterStore.updateState({ count: currentCount + 1 });
}

export function decrement() {
  const currentCount = counterStore.getProp('count') as number;
  counterStore.updateState({ count: currentCount - 1 });
}
```

```svelte
<!-- Counter.svelte -->
<script>
  import { count, increment, decrement } from './stores/counter.js';
</script>

<div>
  <h1>{$count}</h1>
  <button on:click={increment}>+</button>
  <button on:click={decrement}>-</button>
</div>
```

### SolidJS Integration

```typescript
import { createSignal, onMount, onCleanup } from 'solid-js';
import { createStore } from 'substate';

const counterStore = createStore({
  name: 'CounterStore',
  state: { count: 0 }
});

export function Counter() {
  const [count, setCount] = createSignal(0);

  onMount(() => {
    setCount(counterStore.getCurrentState().count);

    const handler = (newState: IState) => {
      setCount(newState.count);
    };

    counterStore.on('UPDATE_STATE', handler);

    onCleanup(() => {
      counterStore.off('UPDATE_STATE', handler);
    });
  });

  const increment = () => {
    counterStore.updateState({ count: count() + 1 });
  };

  return (
    <div>
      <h1>{count()}</h1>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

### Vanilla JavaScript Integration

```html
<!DOCTYPE html>
<html>
<head>
  <title>Vanilla JS Counter</title>
</head>
<body>
  <div id="app">
    <h1 id="count">0</h1>
    <button id="increment">+</button>
  </div>

  <script type="module">
    import { createStore } from 'https://cdn.jsdelivr.net/npm/substate@latest/dist/index.esm.js';

    const counterStore = createStore({
      name: 'CounterStore',
      state: { count: 0 }
    });

    // DOM elements
    const countElement = document.getElementById('count');
    const incrementButton = document.getElementById('increment');

    // Update UI function
    function updateUI(state) {
      countElement.textContent = state.count;
    }

    // Subscribe to store changes
    counterStore.on('UPDATE_STATE', updateUI);

    // Initial render
    updateUI(counterStore.getCurrentState());

    // Event listeners
    incrementButton.addEventListener('click', () => {
      const currentCount = counterStore.getProp('count');
      counterStore.updateState({ count: currentCount + 1 });
    });
  </script>
</body>
</html>
```

### Integration Best Practices

#### 1. **Store Organization**
```typescript
// Good: Organize stores by feature
export const userStore = createStore({
  name: 'UserStore',
  state: { profile: null, preferences: {} }
});

export const uiStore = createStore({
  name: 'UIStore',
  state: { theme: 'light', sidebarOpen: false }
});
```

#### 2. **Cleanup Event Listeners**
```typescript
// Always cleanup listeners to prevent memory leaks
useEffect(() => {
  const handler = (state) => updateUI(state);
  store.on('UPDATE_STATE', handler);

  return () => store.off('UPDATE_STATE', handler);
}, []);
```

#### 3. **Store Composition**
```typescript
// Combine related stores
const rootStore = {
  user: userStore,
  ui: uiStore,

  // Helper methods
  logout() {
    userStore.updateState({ profile: null });
    uiStore.updateState({ sidebarOpen: false });
  }
};
```

#### 4. **TypeScript Integration**
```typescript
interface AppState {
  user: User | null;
  settings: UserSettings;
}

const store = createStore<AppState>({
  name: 'AppStore',
  state: {
    user: null,
    settings: { theme: 'light' }
  }
});
```

#### 5. **Performance Optimization**
```typescript
// Use selective subscriptions
store.on('UPDATE_STATE', (newState) => {
  // Only re-render if relevant data changed
  if (newState.user !== oldState.user) {
    updateUserUI(newState.user);
  }
});
```

### Testing Framework Integrations

```typescript
// React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { createStore } from 'substate';

const store = createStore({
  name: 'TestStore',
  state: { count: 0 }
});

test('counter increments', () => {
  render(<Counter store={store} />);

  fireEvent.click(screen.getByText('+'));
  expect(screen.getByText('1')).toBeInTheDocument();

  // Verify store state
  expect(store.getCurrentState().count).toBe(1);
});
```

All frameworks benefit from Substate's framework-agnostic design, providing consistent state management patterns across your entire application stack.
