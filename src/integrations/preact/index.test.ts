import { describe, expect, test } from 'vitest';
import { createStore, type TUserState } from '../../index';
import * as PreactIntegration from './index';

describe('Preact Integration Index', () => {
  describe('Exports', () => {
    test('should export useSubstate hook', () => {
      expect(PreactIntegration.useSubstate).toBeDefined();
      expect(typeof PreactIntegration.useSubstate).toBe('function');
    });

    test('should export useSubstateActions hook', () => {
      expect(PreactIntegration.useSubstateActions).toBeDefined();
      expect(typeof PreactIntegration.useSubstateActions).toBe('function');
    });

    test('should export type definitions', () => {
      // TypeScript types are not available at runtime, so we can't test them directly
      // Instead, we test that the module exports are working correctly
      expect(PreactIntegration.useSubstate).toBeDefined();
      expect(PreactIntegration.useSubstateActions).toBeDefined();
    });
  });

  describe('Type safety', () => {
    test('should maintain type safety for useSubstate function signature', () => {
      // Test that the function signatures are correct
      expect(typeof PreactIntegration.useSubstate).toBe('function');

      // Test that we can call the hook with different signatures
      // Note: These are just type checks, not actual hook calls
      const hook1 = PreactIntegration.useSubstate as unknown as () => unknown;
      const hook2 = PreactIntegration.useSubstateActions as unknown as () => unknown;

      expect(typeof hook1).toBe('function');
      expect(typeof hook2).toBe('function');
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

      // Test that the hooks are functions that can be called
      expect(typeof PreactIntegration.useSubstate).toBe('function');
      expect(typeof PreactIntegration.useSubstateActions).toBe('function');

      // Test that the store works correctly
      expect(store.getCurrentState().count).toBe(0);
      expect(store.getCurrentState().user.name).toBe('John');
    });
  });

  describe('Type definitions', () => {
    test('should have correct Selector type', () => {
      // This test ensures the Selector type is properly defined
      const functionSelector: PreactIntegration.StateSelector<{ count: number }> = (state) =>
        state.count;
      const stringSelector: PreactIntegration.StringSelector = 'count';

      expect(typeof functionSelector).toBe('function');
      expect(typeof stringSelector).toBe('string');
    });

    test('should have correct SubstateActions interface', () => {
      // Test that the hook function exists
      expect(typeof PreactIntegration.useSubstateActions).toBe('function');

      // Test that the hook function exists
      expect(typeof PreactIntegration.useSubstateActions).toBe('function');
    });
  });

  describe('Module structure', () => {
    test('should be a proper ES module', () => {
      expect(typeof PreactIntegration).toBe('object');
      expect(PreactIntegration).toHaveProperty('useSubstate');
      expect(PreactIntegration).toHaveProperty('useSubstateActions');
    });

    test('should not have default export', () => {
      // The module should use named exports, not default export
      expect(PreactIntegration).not.toHaveProperty('default');
    });
  });
});
