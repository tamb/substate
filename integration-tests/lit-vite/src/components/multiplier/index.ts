import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { store } from '../../store';

/**
 * An example element demonstrating store middleware for derived state.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('multiplier-el')
export class Multiplier extends LitElement {

    private unsyncFunctions: (() => void)[] = [];

    constructor() {
        super();

        // Simple sync - just handle UI updates
        this.unsyncFunctions.push(
            store.sync({
                readerObj: this as any,
                stateField: 'isMultiplierEven',
            })
        );

        this.unsyncFunctions.push(
            store.sync({
                readerObj: this as any,
                stateField: 'multipliedCount',
            })
        );

        this.unsyncFunctions.push(
            store.sync({
                readerObj: this as any,
                stateField: 'count',
            })
        );
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        // Clean up all sync subscriptions
        this.unsyncFunctions.forEach(unsync => unsync());
        this.unsyncFunctions = [];
    }

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  multipliedCount = 0;

  @property({ type: Boolean })
  isMultiplierEven = false;

  @property({ type: Number })
  count = 0;

 

  render() {
    return html`
    <div>
        <h2>Multiplier</h2>
        <p>Multiplies by 3</p>
        <p>Count: ${this.count}</p>
        <p>Multiplied: ${this.multipliedCount}</p>
        <p>${this.isMultiplierEven ? 'Even' : 'Odd'}</p>
    </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'multiplier-el': Multiplier
  }
}
