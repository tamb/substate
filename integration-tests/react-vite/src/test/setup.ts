import '@testing-library/jest-dom'

// Set up React 19 testing environment
declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean
}

if (typeof globalThis !== 'undefined') {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
}
