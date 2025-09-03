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
