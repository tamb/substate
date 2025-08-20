import '@testing-library/jest-dom'

// Set up React testing environment for Preact
// This allows us to use React's testing tools with Preact components
import { configure } from '@testing-library/react'

// Configure testing library for Preact
configure({
  // Use Preact's render function instead of React's
  testIdAttribute: 'data-testid'
})
