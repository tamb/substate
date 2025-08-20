/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    isolate: true,
    pool: 'threads',
    environmentOptions: {
      jsdom: {
        // Ensure proper DOM environment for Preact
        resources: 'usable'
      }
    }
  },
  resolve: {
    alias: {
      // Map React testing imports to work with Preact
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils'
    }
  }
})
