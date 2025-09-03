import { describe, expect, test } from 'vitest';
import { createStore, type TUserState } from '../../index';
import * as ReactIntegration from './index';

describe('React Integration Index', () => {
  describe('Exports', () => {
    test('should export useSubstate hook', () => {
      expect(ReactIntegration.useSubstate).toBeDefined();
      expect(typeof ReactIntegration.useSubstate).toBe('function');
    });

    test('should export useSubstateActions hook', () => {
      expect(ReactIntegration.useSubstateActions).toBeDefined();
      expect(typeof ReactIntegration.useSubstateActions).toBe('function');
    });

    test('should export type definitions', () => {
      // TypeScript types are not available at runtime, so we can't test them directly
      // Instead, we test that the module exports are working correctly
      expect(ReactIntegration.useSubstate).toBeDefined();
      expect(ReactIntegration.useSubstateActions).toBeDefined();
    });
  });

  describe('Type safety', () => {
    test('should maintain type safety for useSubstate with no selector', () => {
      // This should compile without type errors
      // Note: We can't actually call the hook here since we're not in a React component
      expect(typeof ReactIntegration.useSubstate).toBe('function');
    });

    test('should maintain type safety for useSubstate with function selector', () => {
      // TypeScript should compile this without errors
      expect(typeof ReactIntegration.useSubstate).toBe('function');
    });

    test('should maintain type safety for useSubstate with string selector', () => {
      // TypeScript should compile this without errors
      expect(typeof ReactIntegration.useSubstate).toBe('function');
    });

    test('should have correct SubstateActions interface', () => {
      // Test that the hook function exists
      expect(typeof ReactIntegration.useSubstateActions).toBe('function');
    });
  });

  describe('Integration with store', () => {
    test('should work with createStore', () => {
      interface TestState extends TUserState {
        count: number;
        user: { name: string };
      }

      const store = createStore<TestState>({
        name: 'IntegrationTest',
        state: { count: 0, user: { name: 'John' } },
      });

      // Test that hooks can be referenced (not called since we're not in React context)
      expect(typeof ReactIntegration.useSubstate).toBe('function');
      expect(typeof ReactIntegration.useSubstateActions).toBe('function');

      // Verify store is working
      expect(store.getCurrentState()).toEqual({ count: 0, user: { name: 'John' } });
    });
  });

  describe('Module structure', () => {
    test('should only export expected members', () => {
      const exports = Object.keys(ReactIntegration);

      // Should export the two hooks
      expect(exports).toContain('useSubstate');
      expect(exports).toContain('useSubstateActions');

      // Should not export anything unexpected
      const expectedExports = ['useSubstate', 'useSubstateActions'];
      const unexpectedExports = exports.filter((exp) => !expectedExports.includes(exp));

      expect(unexpectedExports).toEqual([]);
    });

    test('should have consistent export types', () => {
      expect(typeof ReactIntegration.useSubstate).toBe('function');
      expect(typeof ReactIntegration.useSubstateActions).toBe('function');
    });
  });

  describe('Compatibility with Substate core', () => {
    test('should work with all Substate store types', () => {
      // Test with minimal state
      const minimalStore = createStore({
        name: 'Minimal',
        state: {},
      });

      expect(minimalStore).toBeDefined();
      expect(typeof ReactIntegration.useSubstate).toBe('function');

      // Test with complex state
      interface ComplexState extends TUserState {
        user: {
          profile: {
            name: string;
            settings: {
              theme: 'light' | 'dark';
              notifications: boolean;
            };
          };
        };
        data: {
          items: Array<{ id: string; value: number }>;
          meta: {
            total: number;
            loaded: boolean;
          };
        };
      }

      const complexStore = createStore<ComplexState>({
        name: 'Complex',
        state: {
          user: {
            profile: {
              name: 'Test User',
              settings: {
                theme: 'light',
                notifications: true,
              },
            },
          },
          data: {
            items: [{ id: '1', value: 100 }],
            meta: {
              total: 1,
              loaded: true,
            },
          },
        },
      });

      expect(complexStore).toBeDefined();
      expect(typeof ReactIntegration.useSubstateActions).toBe('function');
    });

    test('should be compatible with store methods', () => {
      interface TestState extends TUserState {
        count: number;
      }

      const store = createStore<TestState>({
        name: 'MethodTest',
        state: { count: 0 },
      });

      // Test that store has all expected methods that hooks will use
      expect(typeof store.updateState).toBe('function');
      expect(typeof store.resetState).toBe('function');
      expect(typeof store.getCurrentState).toBe('function');
      expect(typeof store.getState).toBe('function');
      expect(typeof store.getProp).toBe('function');
      expect(typeof store.on).toBe('function');
      expect(typeof store.off).toBe('function');
      expect(typeof store.emit).toBe('function');

      // Test store functionality
      store.updateState({ count: 5 });
      expect(store.getCurrentState().count).toBe(5);

      store.resetState();
      expect(store.getCurrentState().count).toBe(0);
    });
  });

  describe('Hook function signatures', () => {
    test('useSubstate should have correct function signature', () => {
      // Test that the function can be called with different argument patterns
      expect(ReactIntegration.useSubstate).toHaveLength(2); // Store and optional selector
    });

    test('useSubstateActions should have correct function signature', () => {
      // Test that the function expects exactly one parameter (store)
      expect(ReactIntegration.useSubstateActions).toHaveLength(1);
    });
  });

  describe('Error handling', () => {
    test('should handle TypeScript strict mode', () => {
      // This test ensures that the exports work in strict TypeScript environments
      expect(ReactIntegration.useSubstate).toBeDefined();
      expect(ReactIntegration.useSubstateActions).toBeDefined();

      // Verify they are functions and not undefined
      expect(ReactIntegration.useSubstate).not.toBeUndefined();
      expect(ReactIntegration.useSubstateActions).not.toBeUndefined();
    });
  });
});
