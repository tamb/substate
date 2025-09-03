## 📚 Usage Examples

### 1. Todo List Management

```typescript
import { createStore } from 'substate';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const todoStore = createStore({
  name: 'TodoStore',
  state: {
    todos: [] as Todo[],
    filter: 'all' as 'all' | 'active' | 'completed'
  },
  defaultDeep: true
});

// Add a new todo
function addTodo(text: string) {
  const currentTodos = todoStore.getProp('todos') as Todo[];
  todoStore.updateState({
    todos: [...currentTodos, {
      id: crypto.randomUUID(),
      text,
      completed: false
    }]
  });
}

// Toggle todo completion
function toggleTodo(id: string) {
  const todos = todoStore.getProp('todos') as Todo[];
  todoStore.updateState({
    todos: todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  });
}

// Subscribe to changes
todoStore.on('UPDATE_STATE', (state) => {
  console.log(`${state.todos.length} todos, filter: ${state.filter}`);
});
```

### 2. User Authentication Store

```typescript
import { createStore } from 'substate';

const authStore = createStore({
  name: 'AuthStore',
  state: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  beforeUpdate: [
    (store, action) => {
      // Log all state changes
      console.log('Auth state changing:', action);
    }
  ],
  afterUpdate: [
    (store, action) => {
      // Persist authentication state
      if (action.user || action.isAuthenticated !== undefined) {
        localStorage.setItem('auth', JSON.stringify(store.getCurrentState()));
      }
    }
  ]
});

// Login action
async function login(email: string, password: string) {
  authStore.updateState({ loading: true, error: null });
  
  try {
    const user = await authenticateUser(email, password);
    authStore.updateState({
      user,
      isAuthenticated: true,
      loading: false
    });
  } catch (error) {
    authStore.updateState({
      error: error.message,
      loading: false,
      isAuthenticated: false
    });
  }
}
```

### 3. Shopping Cart with Middleware

```typescript
import { createStore } from 'substate';

const cartStore = createStore({
  name: 'CartStore',
  state: {
    items: [],
    total: 0,
    tax: 0,
    discount: 0
  },
  defaultDeep: true,
  afterUpdate: [
    // Automatically calculate totals after any update
    (store) => {
      const state = store.getCurrentState();
      const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + tax - state.discount;
      
      // Update calculated fields without triggering infinite loop
      store.stateStorage[store.currentState] = {
        ...state,
        total,
        tax
      };
    }
  ]
});

function addToCart(product) {
  const items = cartStore.getProp('items');
  const existingItem = items.find(item => item.id === product.id);
  
  if (existingItem) {
    cartStore.updateState({
      items: items.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    });
  } else {
    cartStore.updateState({
      items: [...items, { ...product, quantity: 1 }]
    });
  }
}
```

### 4. Working with Nested Properties

```typescript
const userStore = createStore({
  name: 'UserStore',
  state: {
    profile: {
      personal: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      preferences: {
        theme: 'dark',
        notifications: true
      }
    },
    settings: {
      privacy: {
        publicProfile: false
      }
    }
  },
  defaultDeep: true
});

// Update nested properties using dot notation (convenient for simple updates)
userStore.updateState({ 'profile.personal.name': 'Jane Doe' });
userStore.updateState({ 'profile.preferences.theme': 'light' });
userStore.updateState({ 'settings.privacy.publicProfile': true });

// Or update nested properties using object spread (no string notation required)
userStore.updateState({ 
  profile: { 
    ...userStore.getProp('profile'),
    personal: { 
      ...userStore.getProp('profile.personal'),
      name: 'Jane Doe' 
    }
  }
});

// Both approaches work - choose what feels more natural for your use case
userStore.updateState({ 'profile.preferences.theme': 'light' }); // Dot notation
userStore.updateState({ 
  profile: { 
    ...userStore.getProp('profile'),
    preferences: { 
      ...userStore.getProp('profile.preferences'),
      theme: 'light' 
    }
  }
}); // Object spread

// Get nested properties
console.log(userStore.getProp('profile.personal.name')); // 'Jane Doe'
console.log(userStore.getProp('profile.preferences')); // { theme: 'light', notifications: true }
```
