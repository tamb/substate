// 🎉 Simple Substate Usage Examples
// This shows how much cleaner and more intuitive the API is now!

import { createStore } from './src';
import type { TUpdateMiddleware, TState } from './src';

type TMyState = TState & {
  count: number;
  user: { name: string; age: number };
  todos: string[];
};

// Example 1: Basic Usage (Super Simple!)
const store = createStore<TMyState>({
  state: {
    count: 0,
    user: { name: "John", age: 30 },
    todos: ["Learn TypeScript", "Build awesome apps"]
  }
});

// That's it! No complex types, no confusing generics.
// The store automatically infers your state type from the initial state.

// Example 2: Using it (Still Simple!)
store.updateState({ count: 1 });
store.updateState({ "user.name": "Jane" }); // Nested updates work!
store.updateState({ todos: [...store.getCurrentState().todos, "New todo"] });
store.updateState({ $deep: true, $type: "UPDATE_STATE", $tag: "test", count: 1 });

// Example 3: Middleware (Easy to understand!)
const logger: TUpdateMiddleware = (store, action) => {
  console.log('Before update:', action);
};

const storeWithMiddleware = createStore({
  state: { count: 0 },
  beforeUpdate: [logger],
  afterUpdate: [(store, action) => console.log('After update:', action)]
});

// Example 4: Type Safety (Works automatically!)
store.updateState({ count: 1 }); // ✅ Type-safe
// store.updateState({ invalidProp: "oops" }); // ❌ TypeScript error!

// Example 5: React Usage (Clean and simple!)
// import { useSubstate } from './src/integrations/react';

// In a React component:
/*
function Counter() {
  const count = useSubstate(store, state => state.count);
  const user = useSubstate(store, state => state.user);

  return (
    <div>
      <p>Count: {count}</p>
      <p>User: {user.name}</p>
      <button onClick={() => store.updateState({ count: count + 1 })}>
        Increment
      </button>
    </div>
  );
}
*/

// Example 6: Advanced Features (Available when needed)
store.on('STATE_UPDATED', (data) => {
  console.log('State updated:', data);
});

// Tagged states for time travel
store.updateState({ count: 5, $tag: 'checkpoint' });
store.jumpToTag('checkpoint'); // Go back to count: 5

// Example 7: Sync with external objects
const uiModel = { displayCount: 0 };

const unsync = store.sync({
  readerObj: uiModel,
  stateField: 'count',
  readField: 'displayCount'
});

// uiModel.displayCount will now automatically stay in sync!

// Example 8: Sync to class instances or any object
class MyComponent {
  public displayValue = 0;
}

const component = new MyComponent();

const componentSync = store.sync({
  readerObj: component,  // ✅ Now works with class instances!
  stateField: 'count',
  readField: 'displayValue'
});

// Cleanup when done
unsync.unsync();

// 🎊 Summary:
// - Simple, intuitive API
// - Automatic type inference
// - Clear, readable code
// - Powerful features available when needed
// - No complex generics or confusing type parameters!

export { store, storeWithMiddleware };
