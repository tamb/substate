/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import preact from '@preact/preset-vite'

export default defineConfig({
  plugins: [preact()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    isolate: false,
    pool: 'threads',
    environmentOptions: {
      jsdom: {
        // Ensure proper DOM environment for Preact
        resources: 'usable'
      }
    }
  },
})
