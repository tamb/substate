/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/integrations/**/*.test.ts', 'src/integrations/**/*.test.tsx'],
    exclude: [
      'node_modules/',
      'dist/',
      'coverage/',
      '**/*.d.ts',
      '**/*.config.*',
      'integration-tests/',
      'build-tests/',
      'performance-tests/',
      'scripts/'
    ]
  }
})
