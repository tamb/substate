<a id="migration-guide"></a>
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
