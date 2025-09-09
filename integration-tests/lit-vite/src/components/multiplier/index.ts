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

    private syncedMultiplier;
    private syncedMultipliedCount;
    private syncedCount;

    constructor() {
        super();
            this.syncedMultiplier = store.sync({
                readerObj: this as Multiplier,
                stateField: 'isMultiplierEven',
            });
        
            this.syncedMultipliedCount = store.sync({
                readerObj: this as Multiplier,
                stateField: 'multipliedCount',
            })
        

            this.syncedCount = store.sync({
                readerObj: this as Multiplier,
                stateField: 'count',
            });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.syncedMultiplier.unsync();
        this.syncedMultipliedCount.unsync();
        this.syncedCount.unsync();
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
