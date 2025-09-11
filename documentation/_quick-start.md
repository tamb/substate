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

### Next Steps

1. **[📚 Usage Examples](#-usage-examples)** - Learn through practical examples
2. **[🔗 Sync - Unidirectional Data Binding](#-sync---unidirectional-data-binding)** - Connect your store to UI components
3. **[🏷️ Tagged States](#-tagged-states---named-state-checkpoint-system)** - Save and restore state checkpoints
4. **[📖 API Reference](#-api-reference)** - Complete method documentation

### Common Patterns

#### Counter with Actions
```typescript
const counterStore = createStore({
  name: 'Counter',
  state: { count: 0 }
});

// Action functions (optional but recommended)
function increment() {
  counterStore.updateState({
    count: counterStore.getProp('count') + 1
  });
}

function decrement() {
  counterStore.updateState({
    count: counterStore.getProp('count') - 1
  });
}

function reset() {
  counterStore.resetState(); // Back to initial state
}

// Subscribe to changes
counterStore.on('UPDATE_STATE', (state) => {
  console.log('Count changed to:', state.count);
});

// Use the actions
increment(); // count: 1
increment(); // count: 2
decrement(); // count: 1
reset();     // count: 0
```

#### Form State Management
```typescript
const formStore = createStore({
  name: 'ContactForm',
  state: {
    name: '',
    email: '',
    message: '',
    isSubmitting: false,
    errors: {}
  }
});

// Update form fields
function updateField(field: string, value: string) {
  formStore.updateState({ [field]: value });
}

// Submit form
async function submitForm() {
  formStore.updateState({ isSubmitting: true, errors: {} });

  try {
    await submitToAPI(formStore.getCurrentState());
    console.log('Form submitted successfully!');
    formStore.resetState(); // Clear form
  } catch (error) {
    formStore.updateState({
      isSubmitting: false,
      errors: { submit: error.message }
    });
  }
}

// Listen for form changes
formStore.on('UPDATE_STATE', (state) => {
  if (state.isSubmitting) {
    console.log('Submitting form...');
  }
});
```
