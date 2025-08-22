import './components/multiplier/index.js';
import './components/counter/index.js';

// The components are now registered and can be used in the HTML
console.log('Lit components registered:', {
  multiplier: customElements.get('multiplier-el'),
  counter: customElements.get('counter-el')
});
