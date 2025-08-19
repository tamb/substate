/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    isolate: true,
    pool: 'forks',
    environmentOptions: {
      jsdom: {
        // Ensure proper DOM environment for React 19
        resources: 'usable'
      }
    }
  },
})
