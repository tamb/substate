# Substate

Pub/Sub pattern with State Management

## Installation

```bash
npm install substate
```

## Usage

### Basic Usage

```javascript
import { createStore } from 'substate';

const store = createStore({
  name: 'MyStore',
  state: { count: 0 }
});

store.updateState({ count: 1 });
console.log(store.getCurrentState()); // { count: 1 }
```

### Using the createStore Factory Function

The `createStore` factory function provides a clean API for creating Substate instances:

```javascript
import { createStore } from 'substate';

// Create a store with just a name
const simpleStore = createStore({
  name: 'SimpleStore'
});

// Create a store with initial state
const counterStore = createStore({
  name: 'CounterStore',
  state: { count: 0, user: 'John' }
});

// Create a store with all options
const advancedStore = createStore({
  name: 'AdvancedStore',
  state: { data: [] },
  defaultDeep: true,
  beforeUpdate: [(store, action) => console.log('Before update:', action)],
  afterUpdate: [(store, action) => console.log('After update:', action)]
});

// Use the store
counterStore.updateState({ count: 5 });
console.log(counterStore.getProp('count')); // 5
```

### Advanced Usage

```javascript
import { createStore } from 'substate';

const store = createStore({
  name: 'UserStore',
  state: {
    user: {
      name: 'John',
      age: 30
    }
  },
  defaultDeep: true,
  beforeUpdate: [
    (store, action) => console.log('Before update:', action)
  ],
  afterUpdate: [
    (store, action) => console.log('After update:', action)
  ]
});

// Update nested properties
store.updateState({ 'user.age': 31 });

// Listen to state changes
store.on('UPDATE_STATE', (newState) => {
  console.log('State updated:', newState);
});

// Get specific properties
console.log(store.getProp('user.name')); // 'John'
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

## API

### createStore(config)

Factory function to create a new Substate store.

**Parameters:**
- `config.name` (string, required): Name of the store
- `config.state` (object, optional): Initial state
- `config.defaultDeep` (boolean, optional): Default deep clone setting (default: false)
- `config.beforeUpdate` (Function[], optional): Array of functions to call before state updates
- `config.afterUpdate` (Function[], optional): Array of functions to call after state updates

**Returns:** A new Substate instance

### Methods

#### updateState(action)
Updates the state with the provided action.

#### getCurrentState()
Returns the current state.

#### getProp(prop)
Returns a specific property from the current state using dot notation.

#### getState(index)
Returns the state at the specified index.

#### resetState()
Resets the state to the initial state.

#### on(event, callback)
Subscribes to an event.

#### emit(event, data)
Emits an event with optional data.

#### off(event, callback)
Unsubscribes from an event.

## Types

### ISubstate
Interface for the Substate instance.

### ICreateStoreConfig
Interface for the createStore configuration object.

### IConfig
Interface for the Substate constructor configuration object.

### IState
Interface for state objects.

### IChangeStateAction
Interface for state change actions.

## Project Structure

```
src/
├── index.ts              # Main exports
├── createStore.ts        # Factory function
├── Substate.ts          # Substate class
├── PubSub.ts            # PubSub base class
├── index.test.ts        # Integration tests
├── createStore.test.ts  # Factory function tests
├── Substate.test.ts     # Substate class tests
└── PubSub.test.ts       # PubSub class tests
```

## License

MIT
