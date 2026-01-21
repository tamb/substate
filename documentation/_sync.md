<a id="sync---unidirectional-data-binding"></a>
## 🔗 Sync - Unidirectional Data Binding

Substate supports two `sync()` modes:

- **Proxy mode (v11+, recommended)**: `sync(path?, config?)` returns a reactive proxy for a state slice. Reads always reflect the latest store state, and writes auto-commit via `updateState()`.
- **Legacy binding mode (v10 compatible)**: `sync(configObject)` keeps the unidirectional binding behavior. It remains supported, but logs a one-time `console.warn` per store instance to encourage migration.

### Proxy Sync (v11+): Reactive Proxy

```typescript
import { createStore } from 'substate';

const store = createStore({
  name: 'UserStore',
  state: { user: { name: 'John', settings: { theme: 'light' } } }
});

const user = store.sync('user'); // reactive proxy

console.log(user.name);     // 'John'
user.name = 'Thomas';       // updateState({ 'user.name': 'Thomas' })

// Nested writes work
user.settings.theme = 'dark';

// Batch multiple writes
const batch = user.batch();
batch.name = 'Thomas R.';
batch.settings.theme = 'light';
batch.commit(); // one updateState call

// Tag/type/deep and scoped middleware for next write(s)
user.with({ $tag: 'profile-save', $type: 'USER_EDIT', $deep: true }).name = 'Tom';

// Or callback form (auto-batch + auto-commit once)
user.with({ $tag: 'profile-save' }, (draft) => {
  draft.name = 'Tom';
});

### Primitive Sync (v11+): `.value`

For single primitive fields, use `.value` on the proxy returned by `sync()`:

```typescript
const age = store.sync<number>('age');
console.log(age.value); // 25
age.value = 30;
```

### Proxy Sync Config

```typescript
type TProxySyncConfig = {
  beforeUpdate?: UpdateMiddleware[];
  afterUpdate?: UpdateMiddleware[];
};
```

### Root Sync (v11+): `sync()` with no args

Calling `sync()` without a path returns a proxy for the **entire state**.

```typescript
const state = store.sync();       // root proxy
console.log(state.value);         // full current state snapshot
console.log(state.user.name);     // nested read
state.user.name = 'Thomas';       // nested write
```

### `with()` semantics (v11+)

`with()` applies **tags/metadata + scoped middleware** to the **next write** (one assignment) or to the single commit produced by the callback form.

```typescript
// Applies to this one write only
store
  .sync('user')
  .with(
    {
      $tag: 'profile-save',
      before: [(store, action) => {}],
      after: [(store, action) => {}],
    }
  )
  .name = 'Tom';

// Callback form: auto-batch and apply once at commit
store.sync('user').with({ $tag: 'profile-save' }, (draft) => {
  draft.name = 'Tom';
  draft.settings.theme = 'dark';
});
```

### `batch()` + `with()` (v11+)

- If you call `with(...)` and then do **one immediate assignment**, it applies to that assignment and is cleared.
- If you call `batch()` and then `with(...)`, the attributes apply to the **commit** (the grouped update).

---

### Legacy Sync Example (v10): Unidirectional Data Binding

This is the classic sync API that binds store state to a target object (unidirectional). It remains supported.

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
