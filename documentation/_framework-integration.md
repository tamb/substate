## 🎯 Framework Integrations

### React/Preact
```jsx
import { createStore, type TState } from "substate";
import { useSubstate, useSubstateActions } from "substate/react"

type MyAppState = TState & {
  firstName: string;
}

const store = createStore<MyAppState>({
  state: {
    firstName: "Ralph"
  }
});

function MyApp(){
  const { state } = useSubstate(store (state) => state); //whole state
  const { firstName } = useSubstate(store, (state) => state.firstName); //state with seletor

const { 
    updateState, 
    resetState, 
    jumpToTag, 
    getAvailableTags,
    getMemoryUsage 
  } = useSubstateActions(store);
  return (
    <input onChange={e => updateState({firstName: e.target.value})} value={firstName}/>
  );
}

```

### Lit
```typescript
import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { store } from '../../store'; // store instance

@customElement('counter')
export class Counter LitElement {

  private syncedCount;

  constructor() {
    super();
    this.syncedCount = store.sync({
      readerObj: this as Multiplier,
      stateField: 'count',
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.syncedCount.unsync();
  }

  @property({ type: Number })
  count = 0;

  render() {
    return html`
    <div>
       ${this.count}
       <button type="button" @click=${this._increment}
        +1
       </button>
    </div>
    `
  }

  private _increment(){
    store.updateState({
      count: this.count + 1
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'multiplier-el': Multiplier
  }
}

```