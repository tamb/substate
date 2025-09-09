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
```
