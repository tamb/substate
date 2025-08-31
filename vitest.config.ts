/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.ts', 'performance-tests/**/*.perf.ts'],
    exclude: [
      'src/integrations/**/*.test.ts',
      'src/integrations/**/*.test.tsx',
      'node_modules/',
      'dist/',
      'coverage/',
      '**/*.d.ts',
      '**/*.config.*',
      'integration-tests/',
      'build-tests/',
      'scripts/'
    ],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
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
  }
})
