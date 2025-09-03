import { LitElement, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { type ISyncInstance } from 'substate';
import { store } from '../../store';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('counter-el')
export class Counter extends LitElement {
  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  @property({ type: Boolean })
  isMultiplierEven = false;

  private syncedCount: ISyncInstance;
  private syncedIsMultiplierEven: ISyncInstance;

  constructor() {
    super();
    
    // Set up sync for count
      this.syncedCount = store.sync({
        readerObj: this,
        stateField: 'count',        
      })
    

      this.syncedIsMultiplierEven = store.sync({
        readerObj: this,
        stateField: 'isMultiplierEven',
      })
    
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.syncedCount.unsync();
    this.syncedIsMultiplierEven.unsync();
  }

  render() {
    return html`
      <div class="${this.isMultiplierEven ? 'even' : 'odd'}">
        <h2>Counter</h2>
        <p>Count: ${this.count}</p>
        <p>Multiplier is: ${this.isMultiplierEven ? 'Even' : 'Odd'}</p>
        <button @click=${this._onClick}>Increment</button>
      </div>
    `
  }

  private _onClick() {
    // Update the store state instead of local property
    store.updateState({ count: this.count + 1 });
  }

  static styles = css`
    :host{
      display: block;
    }

    .even {
      color: green;
      border: 4px solid green;
    }

    .odd {
      color: red;
      border: 4px solid red;
    }
  `
}

declare global {
  interface HTMLElementTagNameMap {
    'counter-el': Counter
  }
}
