# Substate

[![npm version](https://badge.fury.io/js/substate.svg)](https://badge.fury.io/js/substate)
[![npm downloads](https://img.shields.io/npm/dm/substate.svg)](https://www.npmjs.com/package/substate)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/substate)](https://bundlephobia.com/package/substate)
[![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/TomSaporito/substate)
[![license](https://img.shields.io/npm/l/substate.svg)](https://github.com/TomSaporito/substate/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

**A lightweight, type-safe state management library that combines the Pub/Sub pattern with immutable state management.**

Substate provides a simple yet powerful way to manage application state with built-in event handling, middleware support, and seamless synchronization capabilities. Perfect for applications that need reactive state management without the complexity of larger frameworks.
## 📑 Table of Contents

- [📦 Installation](#-installation)
- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [🏷️ Tagged States - Named Checkpoints](#-tagged-states---named-state-checkpoint-system)
- [📚 Usage Examples](#-usage-examples)
- [🎯 Framework Integrations](#-framework-integration)
- [🔗 Sync - Unidirectional Data Binding](#-sync---unidirectional-data-binding)
- [📖 API Reference](#-api-reference)
- [🧠 Memory Management](#-memory-management)
- [⚡ Performance Benchmarks](#-performance-benchmarks)
- [🔄 Why Choose Substate?](#-why-choose-substate)
- [📋 TypeScript Definitions](#-typescript-definitions)
- [📈 Migration Guide](#-migration-guide)
- [🔧 Troubleshooting](#-troubleshooting)
- [🛠️ Development](#-development)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
## ✨ Features

- 🚀 **Lightweight** - Tiny bundle size at 10kb
- 🔒 **Type-safe** - Full TypeScript support with comprehensive type definitions
- 🔄 **Reactive** - Built-in Pub/Sub pattern for reactive state updates
- 🕰️ **Time Travel** - Complete state history with ability to navigate between states
- 🏷️ **Tagged States** - Named checkpoints for easy state restoration
- 🎯 **Immutable** - Automatic deep cloning prevents accidental state mutations
- 🔗 **Sync** - Unidirectional data binding with middleware transformations
- 🎪 **Middleware** - Extensible with before/after update hooks
- 🌳 **Nested Props** - Easy access to nested properties with optional dot notation or standard object spread
- 📦 **Framework Agnostic** - Works with any JavaScript framework or vanilla JS
## Installation

```bash
npm install substate
```
## 🚀 Quick Start

### Installation & Basic Usage

```bash
npm install substate
```

```typescript
import { createStore } from 'substate';

// Create a simple counter store
const counterStore = createStore({
  name: 'CounterStore',
  state: { count: 0, lastUpdated: Date.now() }
});

// Update state
counterStore.updateState({ count: 1 });
console.log(counterStore.getCurrentState()); // { count: 1, lastUpdated: 1234567890 }

// Listen to changes
counterStore.on('UPDATE_STATE', (newState) => {
  console.log('Counter updated:', newState.count);
});
```
## 🏷️ Tagged States - Named State Checkpoint System

Tagged states is a **Named State Checkpoint System** that allows you to create semantic, named checkpoints in your application's state history. Instead of navigating by numeric indices, you can jump to meaningful moments in your app's lifecycle.

### What is a Named State Checkpoint System?

A Named State Checkpoint System provides:
- **Semantic Navigation**: Jump to states by meaningful names instead of numbers
- **State Restoration**: Restore to any named checkpoint and continue from there
- **Debugging Support**: Tag known-good states for easy rollback
- **User Experience**: Enable features like "save points" and "undo to specific moment"

### Basic Usage

```typescript
import { createStore } from 'substate';

const gameStore = createStore({
  name: 'GameStore',
  state: { level: 1, score: 0, lives: 3 }
});

// Create tagged checkpoints with meaningful names
gameStore.updateState({ 
  level: 5, 
  score: 1250, 
  $tag: "level-5-start" 
});

gameStore.updateState({ 
  level: 10, 
  score: 5000, 
  lives: 2, 
  $tag: "boss-fight" 
});

// Jump back to any tagged state by name
gameStore.jumpToTag("level-5-start");
console.log(gameStore.getCurrentState()); // { level: 5, score: 1250, lives: 3 }

// Access tagged states without changing current state
const bossState = gameStore.getTaggedState("boss-fight");
console.log(bossState); // { level: 10, score: 5000, lives: 2 }

// Manage your tags
console.log(gameStore.getAvailableTags()); // ["level-5-start", "boss-fight"]
gameStore.removeTag("level-5-start");
```

### Advanced Checkpoint Patterns

#### Form Wizard with Step Restoration

```typescript
const formStore = createStore({
  name: 'FormWizard',
  state: {
    currentStep: 1,
    personalInfo: { firstName: '', lastName: '', email: '' },
    addressInfo: { street: '', city: '', zip: '' },
    paymentInfo: { cardNumber: '', expiry: '' }
  }
});

// Save progress at each completed step
function completePersonalInfo(data) {
  formStore.updateState({
    personalInfo: data,
    currentStep: 2,
    $tag: "step-1-complete"
  });
}

function completeAddressInfo(data) {
  formStore.updateState({
    addressInfo: data,
    currentStep: 3,
    $tag: "step-2-complete"
  });
}

// User can jump back to any completed step
function goToStep(stepNumber) {
  const stepTag = `step-${stepNumber}-complete`;
  if (formStore.getAvailableTags().includes(stepTag)) {
    formStore.jumpToTag(stepTag);
  }
}

// Usage
goToStep(1); // Jump back to personal info step
goToStep(2); // Jump back to address info step
```

#### Debugging and Error Recovery

```typescript
const appStore = createStore({
  name: 'AppStore',
  state: {
    userData: null,
    settings: {},
    lastError: null
  }
});

// Tag known good states for debugging
function markKnownGoodState() {
  appStore.updateState({
    $tag: "last-known-good"
  });
}

// When errors occur, jump back to known good state
function handleError(error) {
  console.error('Error occurred:', error);
  
  if (appStore.getAvailableTags().includes("last-known-good")) {
    console.log('Rolling back to last known good state...');
    appStore.jumpToTag("last-known-good");
  }
}

// Tag states before risky operations
function performRiskyOperation() {
  appStore.updateState({
    $tag: "before-risky-operation"
  });
  
  // ... perform operation that might fail
  
  if (operationFailed) {
    appStore.jumpToTag("before-risky-operation");
  }
}
```

#### Game Save System

```typescript
const gameStore = createStore({
  name: 'GameStore',
  state: {
    player: { health: 100, level: 1, inventory: [] },
    world: { currentArea: 'town', discoveredAreas: [] },
    quests: { active: [], completed: [] }
  }
});

// Auto-save system
function autoSave() {
  const timestamp = new Date().toISOString();
  gameStore.updateState({
    $tag: `auto-save-${timestamp}`
  });
}

// Manual save system
function manualSave(saveName) {
  gameStore.updateState({
    $tag: `save-${saveName}`
  });
}

// Load save system
function loadSave(saveName) {
  const saveTag = `save-${saveName}`;
  if (gameStore.getAvailableTags().includes(saveTag)) {
    gameStore.jumpToTag(saveTag);
    return true;
  }
  return false;
}

// Get all available saves
function getAvailableSaves() {
  return gameStore.getAvailableTags()
    .filter(tag => tag.startsWith('save-'))
    .map(tag => tag.replace('save-', ''));
}

// Usage
manualSave("checkpoint-1");
manualSave("before-boss-fight");
loadSave("checkpoint-1");
```

#### Feature Flag and A/B Testing

```typescript
const experimentStore = createStore({
  name: 'ExperimentStore',
  state: {
    features: {},
    userGroup: null,
    experimentResults: {}
  }
});

// Tag different experiment variants
function setupExperimentVariant(variant) {
  experimentStore.updateState({
    userGroup: variant,
    $tag: `experiment-${variant}`
  });
}

// Jump between experiment variants
function switchToVariant(variant) {
  const variantTag = `experiment-${variant}`;
  if (experimentStore.getAvailableTags().includes(variantTag)) {
    experimentStore.jumpToTag(variantTag);
  }
}

// Usage
setupExperimentVariant("control");
setupExperimentVariant("variant-a");
setupExperimentVariant("variant-b");

switchToVariant("variant-a"); // Switch to variant A
```

### 🎯 Common Tagging Patterns

```typescript
// Form checkpoints
formStore.updateState({ ...formData, $tag: "before-validation" });

// API operation snapshots  
store.updateState({ users: userData, $tag: "after-user-import" });

// Feature flags / A-B testing
store.updateState({ features: newFeatures, $tag: "experiment-variant-a" });

// Debugging checkpoints
store.updateState({ debugInfo: data, $tag: "issue-reproduction" });

// Game saves
gameStore.updateState({ saveData, $tag: `save-${Date.now()}` });

// Workflow states
workflowStore.updateState({ status: "approved", $tag: "workflow-approved" });

// User session states
sessionStore.updateState({ user: userData, $tag: "user-logged-in" });
```
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
## 🔗 Sync - Unidirectional Data Binding

One of Substate's most powerful features is the `sync` method, which provides unidirectional data binding between your store and any target object (like UI models, form objects, or API payloads).

### Basic Sync Example

```typescript
import { createStore } from 'substate';

const userStore = createStore({
  name: 'UserStore',
  state: { userName: 'John', age: 25 }
});

// Target object (could be a UI model, form, etc.)
const uiModel = { displayName: '', userAge: 0 };

// Sync userName from store to displayName in uiModel
const unsync = userStore.sync({
  readerObj: uiModel,
  stateField: 'userName',
  readField: 'displayName'
});

console.log(uiModel.displayName); // 'John' - immediately synced

// When store updates, uiModel automatically updates
userStore.updateState({ userName: 'Alice' });
console.log(uiModel.displayName); // 'Alice'

// Changes to uiModel don't affect the store (unidirectional)
uiModel.displayName = 'Bob';
console.log(userStore.getProp('userName')); // Still 'Alice'

// Cleanup when no longer needed
unsync();
```

### Sync with Middleware Transformations

```typescript
const productStore = createStore({
  name: 'ProductStore',
  state: { 
    price: 29.99,
    currency: 'USD',
    name: 'awesome widget'
  }
});

const displayModel = { formattedPrice: '', productTitle: '' };

// Sync with transformation middleware
const unsyncPrice = productStore.sync({
  readerObj: displayModel,
  stateField: 'price',
  readField: 'formattedPrice',
  beforeUpdate: [
    // Transform price to currency format
    (price, context) => `$${price.toFixed(2)}`,
    // Add currency symbol based on store state
    (formattedPrice, context) => {
      const currency = productStore.getProp('currency');
      return currency === 'EUR' ? formattedPrice.replace('$', '€') : formattedPrice;
    }
  ],
  afterUpdate: [
    // Log the transformation
    (finalValue, context) => {
      console.log(`Price synced: ${finalValue} for field ${context.readField}`);
    }
  ]
});

const unsyncName = productStore.sync({
  readerObj: displayModel,
  stateField: 'name',
  readField: 'productTitle',
  beforeUpdate: [
    // Transform to title case
    (name) => name.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  ]
});

console.log(displayModel.formattedPrice); // '$29.99'
console.log(displayModel.productTitle); // 'Awesome Widget'

// Update triggers all synced transformations
productStore.updateState({ price: 39.99, name: 'super awesome widget' });
console.log(displayModel.formattedPrice); // '$39.99'
console.log(displayModel.productTitle); // 'Super Awesome Widget'
```

### Real-world Sync Example: Form Binding

```typescript
// Form state store
const formStore = createStore({
  name: 'FormStore',
  state: {
    user: {
      firstName: '',
      lastName: '',
      email: '',
      birthDate: null
    },
    validation: {
      isValid: false,
      errors: []
    }
  }
});

// Form UI object (could be from any UI framework)
const formUI = {
  fullName: '',
  emailInput: '',
  ageDisplay: '',
  submitEnabled: false
};

// Sync full name (combining first + last)
const unsyncName = formStore.sync({
  readerObj: formUI,
  stateField: 'user',
  readField: 'fullName',
  beforeUpdate: [
    (user) => `${user.firstName} ${user.lastName}`.trim()
  ]
});

// Sync email directly
const unsyncEmail = formStore.sync({
  readerObj: formUI,
  stateField: 'user.email',
  readField: 'emailInput'
});

// Sync age calculation from birth date
const unsyncAge = formStore.sync({
  readerObj: formUI,
  stateField: 'user.birthDate',
  readField: 'ageDisplay',
  beforeUpdate: [
    (birthDate) => {
      if (!birthDate) return 'Not provided';
      const age = new Date().getFullYear() - new Date(birthDate).getFullYear();
      return `${age} years old`;
    }
  ]
});

// Sync form validity to submit button
const unsyncValid = formStore.sync({
  readerObj: formUI,
  stateField: 'validation.isValid',
  readField: 'submitEnabled'
});

// Update form data
formStore.updateState({
  'user.firstName': 'John',
  'user.lastName': 'Doe',
  'user.email': 'john@example.com',
  'user.birthDate': '1990-05-15',
  'validation.isValid': true
});

console.log(formUI);
// {
//   fullName: 'John Doe',
//   emailInput: 'john@example.com', 
//   ageDisplay: '34 years old',
//   submitEnabled: true
// }
```

### Multiple Sync Instances

You can sync the same state field to multiple targets with different transformations:

```typescript
const dataStore = createStore({
  name: 'DataStore',
  state: { timestamp: Date.now() }
});

const dashboard = { lastUpdate: '' };
const report = { generatedAt: '' };
const api = { timestamp: 0 };

// Sync to dashboard with human-readable format
const unsync1 = dataStore.sync({
  readerObj: dashboard,
  stateField: 'timestamp',
  readField: 'lastUpdate',
  beforeUpdate: [(ts) => new Date(ts).toLocaleString()]
});

// Sync to report with ISO string
const unsync2 = dataStore.sync({
  readerObj: report,
  stateField: 'timestamp', 
  readField: 'generatedAt',
  beforeUpdate: [(ts) => new Date(ts).toISOString()]
});

// Sync to API with raw timestamp
const unsync3 = dataStore.sync({
  readerObj: api,
  stateField: 'timestamp' // uses same field name when readField omitted
});

// One update triggers all syncs
dataStore.updateState({ timestamp: Date.now() });
```
### TypeScript Support

```typescript
import { createStore, type ISubstate, type ICreateStoreConfig } from 'substate';

const config: ICreateStoreConfig = {
  name: 'TypedStore',
  state: { count: 0 },
  defaultDeep: true
};

const store: ISubstate = createStore(config);
```
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

#### `batchUpdateState(actions: Array<Partial<TSubstateState> & IState>): void`

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
## ⚡ Performance Benchmarks

Substate delivers excellent performance across different use cases. Here are real benchmark results from our test suite (averaged over 5 runs for statistical accuracy):

**🖥️ Test Environment**: 13th Gen Intel(R) Core(TM) i7-13650HX (14 cores), 16 GB RAM, Windows 10 Home

### 🚀 Shallow State Performance

| State Size | Store Creation | Single Update | Avg Update | Property Access | Memory (50 states) |
|------------|----------------|---------------|------------|-----------------|-------------------|
| **Small** (10 props) | 41μs | 61μs | **1.41μs** | **0.15μs** | 127KB |
| **Medium** (100 props) | 29μs | 63μs | **25.93μs** | **0.15μs** | 1.3MB |
| **Large** (1000 props) | 15μs | 598μs | **254μs** | **0.32μs** | 12.8MB |

### 🏗️ Deep State Performance

| Complexity | Store Creation | Deep Update | Deep Access | Deep Clone | Memory Usage |
|------------|----------------|-------------|-------------|------------|--------------|
| **Shallow Deep** (1.2K nodes) | 52μs | **428μs** | **0.90μs** | 200μs | 10.4MB |
| **Medium Deep** (5.7K nodes) | 39μs | **694μs** | **0.75μs** | 705μs | 45.8MB |
| **Very Deep** (6K nodes) | 17μs | **754μs** | **0.90μs** | 788μs | 43.3MB |

### 📊 Key Performance Insights

- **⚡ Ultra-fast property access**: Sub-microsecond access times regardless of state size
- **🔄 Efficient updates**: Shallow updates scale linearly, deep cloning adds ~10-100x overhead (expected)
- **🧠 Smart memory management**: Automatic history limits prevent unbounded growth
- **🎯 Consistent performance**: Property access speed stays constant as state grows
- **📈 Scalable architecture**: Handles 1000+ properties with <300μs update times

### 🏃‍♂️ Real-World Performance

```typescript
// ✅ Excellent for high-frequency updates
const fastStore = createStore({
  name: 'RealtimeStore',
  state: { liveData: [] },
  defaultDeep: false // 1.41μs per update
});

// ✅ Great for complex nested state  
const complexStore = createStore({
  name: 'ComplexStore', 
  state: deepNestedObject,
  defaultDeep: true // 428μs per deep update
});

// ✅ Property access is always fast
const value = store.getProp('deeply.nested.property'); // ~1μs
```

### 🆚 Performance Comparison

| Operation | Substate | Native Object | Redux | Zustand |
|-----------|----------|---------------|-------|---------|
| Property Access | **0.15μs** | ~0.1μs | ~2-5μs | ~1-3μs |
| Shallow Update | **1.41μs** | ~1μs | ~50-100μs | ~20-50μs |
| Memory Management | **Automatic** | Manual | Manual | Manual |
| History/Time Travel | **Built-in** | None | DevTools | None |

> **🔬 Benchmark Environment**: 
> - **Hardware**: 13th Gen Intel(R) Core(TM) i7-13650HX (14 cores), 16 GB RAM
> - **OS**: Windows 10 Home (Version 2009)
> - **Runtime**: Node.js v18+
> - **Method**: Averaged over 5 runs for statistical accuracy
> 
> Your results may vary based on hardware and usage patterns.
## 🔬 Performance Comparison Benchmarks

Substate includes comprehensive performance benchmarks comparing it with other popular state management libraries. These benchmarks provide **scientifically accurate** performance data based on real measurements, not estimates.

### 📊 What We Compare

- **Substate** - Our lightweight state management library
- **Redux** - Industry standard state management
- **Zustand** - Modern lightweight alternative  
- **Native JavaScript Objects** - Baseline performance

### 🎯 Measured Metrics

- **Store Creation** - Time to initialize a new store/state
- **Single Update** - Time for individual state updates
- **Batch Updates** - Time for multiple updates in sequence
- **Property Access** - Time to read state properties
- **Memory Usage** - Estimated memory consumption

### 🚀 Running Comparison Benchmarks

```bash
# Run all comparison benchmarks
npm run test:comparison

# Generate comparison report
npm run test:comparison:report

# Run individual benchmarks
cd benchmark-comparisons
npm run benchmark:substate
npm run benchmark:redux
npm run benchmark:zustand
npm run benchmark:native
```

### 📈 Sample Results

Here's a sample comparison from our benchmark suite:

| Library | Property Access | Update Performance | Store Creation | Memory (Small State) |
|---------|----------------|-------------------|----------------|---------------------|
| **Native JS** | 47.90ns | **75.19ns** | **525.13ns** | **1KB** |
| **Redux** | **47.76ns** | 78.20ns | 2.23μs | 61KB |
| **Zustand** | 48.07ns | 78.62ns | 3.29μs | 61KB |
| **Substate** | 61.42ns | 285.69ns | 5.45μs | 7KB |

### 🔬 Benchmark Methodology

**✅ Fair Comparison:**
- **Identical test data** across all libraries
- **Same operations** (store creation, updates, property access)
- **Statistical rigor** (5 runs per test with mean/median/min/max/std)
- **Multiple state sizes** (small: 10 props, medium: 100 props, large: 1000 props)

**✅ Scientific Accuracy:**
- **Real measurements**, not estimates
- **Reproducible** - anyone can run the same tests
- **Comprehensive** - tests multiple scenarios and metrics
- **Transparent** - full statistical analysis provided

### 📁 Results Storage

Benchmark results are automatically saved as JSON files in `benchmark-comparisons/results/` with:
- **Timestamped filenames** for version tracking
- **Complete statistical data** (mean, median, min, max, standard deviation)
- **Environment information** (platform, Node.js version, CI status)
- **Detailed breakdowns** for each test scenario

### 📊 Report Generation

The report generator creates multiple output formats:

**JSON Summary** (`performance-summary-latest.json`):
- **Consolidated averages** from all libraries
- **Structured data** for programmatic analysis
- **Environment metadata** for reproducibility

**Markdown Tables** (`performance-tables-latest.md`):
- **Ready-to-use markdown tables** for documentation
- **Formatted performance comparisons** with proper units
- **Best performance highlighted in bold** for easy identification
- **Performance insights** and recommendations
- **Can be directly included** in README files or documentation

**Console Output**:
- **Real-time display** of comparison results
- **Detailed statistical breakdowns** for each library
- **Performance insights** and fastest metrics identification

### 🎯 Key Insights

- **Native JavaScript**: Fastest raw performance, no overhead
- **Substate**: Optimized for reactive state with minimal overhead (~5x slower than native)
- **Zustand**: Good balance of features and performance
- **Redux**: More overhead due to action/reducer pattern

### 📊 Use Case Recommendations

- **High-frequency updates**: Consider Native JS or Substate
- **Complex state logic**: Redux provides predictable patterns
- **Simple state management**: Zustand offers good balance
- **Reactive features needed**: Substate provides built-in Pub/Sub

> **💡 Note**: Performance varies by use case. Choose based on your specific requirements, not just raw speed. The comparison benchmarks help you make informed decisions based on real data.
> 
> **📊 Latest Results**: The most recent benchmark results are available in `benchmark-comparisons/results/performance-tables-latest.md` and can be included directly in documentation.
## 🔄 Why Choose Substate?

### Comparison with Other State Management Solutions

| Feature | Substate | Redux | Zustand | Valtio | MobX |
|---------|----------|-------|---------|--------|------|
| **Bundle Size** | ~11KB | ~4KB | ~2KB | ~7KB | ~63KB |
| **TypeScript** | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent | ✅ Excellent |
| **Learning Curve** | 🟢 Low | 🔴 High | 🟢 Low | 🟡 Medium | 🔴 High |
| **Boilerplate** | 🟢 Minimal | 🔴 Heavy | 🟢 Minimal | 🟢 Minimal | 🟡 Some |
| **Time Travel** | ✅ Built-in | ⚡ DevTools | ❌ No | ❌ No | ❌ No |
| **Memory Management** | ✅ Auto + Manual | ❌ Manual only | ❌ Manual only | ❌ Manual only | ❌ Manual only |
| **Immutability** | ✅ Auto | ⚡ Manual | ⚡ Manual | ✅ Auto | ❌ Mutable |
| **Sync/Binding** | ✅ Built-in | ❌ No | ❌ No | ❌ No | ✅ Yes |
| **Framework Agnostic** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Middleware Support** | ✅ Simple | ✅ Complex | ✅ Yes | ✅ Yes | ✅ Yes |
| **Nested Updates** | ✅ Dot notation + Object spread | ⚡ Reducers | ⚡ Manual | ✅ Direct | ✅ Direct |
| **Tagged States** | ✅ Built-in | ❌ No | ❌ No | ❌ No | ❌ No |

**NOTE:** Clone our repo and run the benchmarks to see how we stack up!

> **💡 About This Comparison**: 
> - **Bundle sizes** are approximate and may vary by version
> - **Learning curve** and **boilerplate** assessments are subjective and based on typical developer experience
> - **Feature availability** is based on core functionality (some libraries may have community plugins for additional features)
> - **Middleware Support** includes traditional middleware, subscriptions, interceptors, and other extensibility patterns
> - **Performance data** is based on our benchmark suite - run `npm run test:comparison` for current results

### When to Use Substate

**✅ Perfect for:**
- **Any size application** that needs reactive state with automatic memory management
- **Rapid prototyping** where you want full features without configuration overhead
- **Projects requiring unidirectional data binding** (unique sync functionality)
- **Applications with complex nested state** (dot notation updates)
- **Teams that want minimal setup** with enterprise-grade features
- **Long-running applications** where memory management is critical
- **Time-travel debugging** and comprehensive state history requirements
- **High-frequency updates** with configurable memory optimization

**✅ Especially great for:**
- **Real-time applications** (automatic memory limits prevent bloat)
- **Form-heavy applications** (sync functionality + memory management)
- **Development and debugging** (built-in time travel + memory monitoring)
- **Production apps** that need to scale without memory leaks

**⚠️ Consider alternatives for:**
- **Extremely large enterprise apps** with complex distributed state (consider Redux + RTK for strict patterns)
- **Teams requiring specific architectural constraints** (Redux enforces stricter patterns)
- **Projects already heavily invested** in other state solutions with extensive tooling

### Migration Benefits

**From Redux:**
- 🎯 **Significantly less boilerplate** - No action creators, reducers, or complex setup
- 🔄 **Built-in time travel** without DevTools dependency
- 🧠 **Automatic memory management** - No manual cleanup required
- 🎪 **Simpler middleware** system with before/after hooks
- 📊 **Built-in monitoring** tools for performance optimization

**From Context API:**
- ⚡ **Better performance** with granular updates and memory limits
- 🕰️ **Built-in state history** with configurable retention
- 🔗 **Advanced synchronization** capabilities (unique to Substate)
- 📦 **Smaller bundle** size with more features
- 🧠 **No memory leaks** from unbounded state growth

**From Zustand:**
- 🔗 **Unique sync functionality** for unidirectional data binding
- 🕰️ **Complete state history** with automatic memory management
- 🎯 **Built-in TypeScript** support with comprehensive types
- 🌳 **Flexible nested property** handling with dot notation
- 📊 **Built-in memory monitoring** and optimization tools

**From Vanilla State Management:**
- 🏗️ **Structured approach** without architectural overhead
- 🔄 **Automatic immutability** and history tracking
- 🧠 **Memory management** prevents common memory leak issues
- 🛠️ **Developer tools** built-in (no external dependencies)

---

### 🎯 What Makes Substate Unique

Substate is **one of the few state management libraries** that combines all these features out of the box:

1. **🔗 Built-in Sync System** - Unidirectional data binding with middleware transformations
2. **🧠 Intelligent Memory Management** - Automatic history limits with manual controls
3. **🕰️ Zero-Config Time Travel** - Full debugging without external tools
4. **🏷️ Tagged State Checkpoints** - Named snapshots for easy navigation
5. **📊 Performance Monitoring** - Built-in memory usage tracking
6. **🌳 Flexible Nested Updates** - Intuitive nested state management with dot notation or object spread
7. **⚡ Production Ready** - Optimized defaults that scale from prototype to enterprise

> **💡 Key Insight**: Most libraries make you choose between features and simplicity. Substate gives you enterprise-grade capabilities with a learning curve measured in minutes, not weeks.
## 📋 TypeScript Definitions

### Core Interfaces

```typescript
interface ISubstate extends IPubSub {
  name: string;
  afterUpdate: UpdateMiddleware[];
  beforeUpdate: UpdateMiddleware[];
  currentState: number;
  stateStorage: IState[];
  defaultDeep: boolean;
  
  getState(index: number): IState;
  getCurrentState(): IState;
  getProp(prop: string): unknown;
  resetState(): void;
  updateState(action: IState): void;
  sync(config: ISyncConfig): () => void;
}

interface ICreateStoreConfig {
  name: string;
  state?: object;
  defaultDeep?: boolean;
  beforeUpdate?: UpdateMiddleware[];
  afterUpdate?: UpdateMiddleware[];
}

interface IState {
  [key: string]: unknown;
  $type?: string;
  $deep?: boolean;
}

interface ISyncConfig {
  readerObj: Record<string, unknown>;
  stateField: string;
  readField?: string;
  beforeUpdate?: BeforeMiddleware[];
  afterUpdate?: AfterMiddleware[];
}
```

### Middleware Types

```typescript
// Update middleware for state changes
type TUpdateMiddleware = (store: ISubstate, action: Partial<TUserState>) => void;

// Sync middleware for unidirectional data binding
type TSyncMiddleware = (value: unknown, context: ISyncContext, store: ISubstate) => unknown;

// Sync configuration with middleware support
type TSyncConfig = {
  readerObj: Record<string, unknown> | object;
  stateField: string;
  readField?: string;
  beforeUpdate?: TSyncMiddleware[];
  afterUpdate?: TSyncMiddleware[];
  syncEvents?: string[] | string;
};

// Context provided to sync middleware
interface ISyncContext {
  source: string;
  field: string;
  readField: string;
}

// State keywords for special functionality
type TStateKeywords = {
  $type?: string;
  $deep?: boolean;
  $tag?: string;
  [key: string]: unknown;
};

// User-defined state with keyword support
type TUserState = object & TStateKeywords;

// Primary state type - represents any state object with optional keywords
type TSubstateState = object & TStateKeywords;
```
## 📈 Migration Guide

### Version 10.x Migration

Substate v10 introduces several improvements and breaking changes. Here's how to upgrade:

#### Breaking Changes

1. **Import Changes**
```typescript
// ❌ Old (v9)
import Substate from 'substate';

// ✅ New (v10)
import { createStore, Substate } from 'substate';
```

2. **Store Creation**
```typescript
// ❌ Old (v9)
const store = new Substate({ name: 'MyStore', state: { count: 0 } });

// ✅ New (v10) - Recommended
const store = createStore({ name: 'MyStore', state: { count: 0 } });

// ✅ New (v10) - Still works but not recommended
const store = new Substate({ name: 'MyStore', state: { count: 0 } });
```

3. **Peer Dependencies**
```bash
# Install peer dependencies
npm install clone-deep object-bystring
```

#### New Features in v10

- **Sync Method**: Unidirectional data binding with middleware
- **Enhanced TypeScript**: Better type inference and safety
- **Improved Performance**: Optimized event handling and state updates
- **Better Tree Shaking**: Only import what you use

#### Migration Steps

1. **Update imports and installation**
```bash
npm install substate@10 clone-deep object-bystring
```

2. **Replace direct instantiation with createStore**
```typescript
// Before
const stores = [
  new Substate({ name: 'Store1', state: { data: [] } }),
  new Substate({ name: 'Store2', state: { user: null } })
];

// After  
const stores = [
  createStore({ name: 'Store1', state: { data: [] } }),
  createStore({ name: 'Store2', state: { user: null } })
];
```

3. **Leverage new sync functionality**
```typescript
// New capability - sync store to UI models
const unsync = store.sync({
  readerObj: uiModel,
  stateField: 'user.profile',
  readField: 'userInfo'
});
```

### From Other Libraries

#### From Redux
```typescript
// Redux setup
const store = createStore(rootReducer);
store.dispatch({ type: 'INCREMENT', payload: 1 });

// Substate equivalent
const store = createStore({ name: 'Counter', state: { count: 0 } });
store.updateState({ count: store.getProp('count') + 1 });
```

#### From Zustand
```typescript
// Zustand
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}));

// Substate
const store = createStore({ name: 'Counter', state: { count: 0 } });
const increment = () => store.updateState({ 
  count: store.getProp('count') + 1 
});
```
## 🛠️ Development

### Project Structure

```
substate/
├── src/
│   ├── index.ts                    # Main exports and type definitions
│   ├── index.test.ts               # Main export tests
│   └── core/
│       ├── consts.ts               # Event constants and shared values
│       ├── createStore/
│       │   ├── createStore.ts      # Factory function for store creation
│       │   └── createStore.interface.ts
│       ├── Substate/
│       │   ├── Substate.ts         # Main Substate class implementation
│       │   ├── Substate.interface.ts # Substate class interfaces
│       │   ├── interfaces.ts       # Type definitions for state and middleware
│       │   ├── helpers/            # Utility functions for optimization
│       │   │   ├── canUseFastPath.ts
│       │   │   ├── checkForFastPathPossibility.ts
│       │   │   ├── isDeep.ts
│       │   │   ├── requiresByString.ts
│       │   │   ├── tempUpdate.ts
│       │   │   └── tests/          # Helper function tests
│       │   └── tests/              # Substate class tests
│       │       ├── Substate.test.ts
│       │       ├── sync.test.ts    # Sync functionality tests
│       │       ├── tagging.test.ts # Tag functionality tests
│       │       ├── memory-management.test.ts
│       │       └── mocks.ts        # Test utilities
│       └── PubSub/
│           ├── PubSub.ts           # Event system base class
│           ├── PubSub.interface.ts
│           └── PubSub.test.ts
│   └── integrations/               # Framework-specific integrations
│       ├── preact/                 # Preact hooks and components
│       └── react/                  # React hooks and components
├── dist/                           # Compiled output (ESM, UMD, declarations)
├── coverage/                       # Test coverage reports
├── integration-tests/              # End-to-end integration tests
│   ├── lit-vite/                   # Lit integration test
│   ├── preact-vite/                # Preact integration test
│   └── react-vite/                 # React integration test
├── benchmark-comparisons/          # Performance comparison suite
├── performance-tests/              # Internal performance testing
└── scripts/                        # Build and utility scripts
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with tests
4. Run tests: `npm test`
5. Run linting: `npm run lint:fix`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Scripts

#### Core Development
```bash
npm run build         # Build all distributions (ESM, UMD, declarations)
npm run clean         # Clean dist directory
npm run fix           # Auto-fix formatting and linting issues
npm run format        # Format code with Biome
npm run lint          # Check code linting with Biome
npm run check         # Run Biome checks on source code
```

#### Testing Suite
```bash
npm test              # Run all tests (core + integration)
npm run test:core     # Run core unit tests only
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:all      # Comprehensive test suite (check + test + builds + integrations + perf)
```

#### Build Testing
```bash
npm run test:builds   # Test both ESM and UMD builds
npm run _test:esm     # Test ESM build specifically
npm run _test:umd     # Test UMD build specifically
```

#### Performance Testing
```bash
npm run test:perf           # Run all performance tests (shallow + deep)
npm run _test:perf:shallow   # Shallow state performance test
npm run _test:perf:deep      # Deep state performance test
npm run test:perf:avg        # Run performance tests with 5-run averages
npm run _test:perf:shallow:avg # Shallow performance with averaging
npm run _test:perf:deep:avg    # Deep performance with averaging
```

#### Integration Testing
```bash
npm run test:integrations           # Run all integration tests
npm run _test:integrations:check     # Check dependency compatibility
npm run _test:integration:react      # Test React integration
npm run _test:integration:preact     # Test Preact integration
```

#### Isolation Testing
```bash
npm run test:isolation # Test module isolation and integrity
```

#### Development Servers
```bash
npm run dev:react     # Start React integration dev server
npm run dev:preact    # Start Preact integration dev server
```

#### Setup and Maintenance
```bash
npm run integration:setup           # Setup all integration test environments
npm run _integration:setup:react    # Setup React integration only
npm run _integration:setup:preact   # Setup Preact integration only
npm run reset                       # Clear all dependencies and reinstall
npm run refresh                     # Clean install and setup integrations
```

#### Performance Benchmarking
```bash
npm run benchmark   # Run performance comparisons vs other libraries
```

#### Publishing
```bash
npm run pre         # Pre-publish checks (test + build) - publishes to 'next' tag
npm run safe-publish # Full publish pipeline (test + build + publish)
```
## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to help improve Substate.

## 📄 License

MIT © [Tom Saporito "Tamb"](https://github.com/tamb)

---

**Made with ❤️ for developers who want powerful state management without the complexity.**
