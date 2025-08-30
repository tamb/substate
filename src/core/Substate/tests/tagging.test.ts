import { beforeEach, describe, expect, test, vi } from 'vitest';
import { createStore } from '../../createStore/createStore';
import { Substate } from '../Substate';
import type { IState } from '../Substate.interface';

// Type definitions for test data structures
interface TestDataState extends IState {
  data: {
    nested: {
      value: string;
    };
  };
}

interface ComplexTestState extends IState {
  user: {
    profile: {
      name: string;
      age: number;
    };
    settings: {
      theme: string;
    };
  };
  app: {
    version: string;
  };
}

describe('Tagging Features', () => {
  let store: Substate;

  beforeEach(() => {
    store = new Substate({
      name: 'TagStore',
      state: { counter: 0, user: null },
      maxHistorySize: 10,
    });
  });

  describe('Basic tagging functionality', () => {
    test('should create tags when using $tag in updateState', () => {
      store.updateState({ counter: 1, $tag: 'first-update' });

      expect(store.getAvailableTags()).toEqual(['first-update']);
      expect(store.getTaggedState('first-update')).toMatchObject({ counter: 1 });
    });

    test('should handle multiple tags', () => {
      store.updateState({ counter: 1, $tag: 'step-1' });
      store.updateState({ counter: 2, $tag: 'step-2' });
      store.updateState({ counter: 3, $tag: 'step-3' });

      const tags = store.getAvailableTags();
      expect(tags).toHaveLength(3);
      expect(tags).toEqual(expect.arrayContaining(['step-1', 'step-2', 'step-3']));
    });

    test('should overwrite existing tags with same name', () => {
      store.updateState({ counter: 1, $tag: 'checkpoint' });
      store.updateState({ counter: 2, $tag: 'checkpoint' });

      expect(store.getAvailableTags()).toEqual(['checkpoint']);
      expect(store.getTaggedState('checkpoint')).toMatchObject({ counter: 2 });
    });

    test('should not create tags when $tag is not provided', () => {
      store.updateState({ counter: 1 });
      store.updateState({ counter: 2 });

      expect(store.getAvailableTags()).toHaveLength(0);
    });

    test('should handle empty string tags', () => {
      store.updateState({ counter: 1, $tag: '' });

      expect(store.getAvailableTags()).toEqual(['']);
      expect(store.getTaggedState('')).toMatchObject({ counter: 1 });
    });
  });

  describe('getTaggedState method', () => {
    test('should return undefined for non-existent tags', () => {
      expect(store.getTaggedState('non-existent')).toBeUndefined();
    });

    test('should return deep cloned state to prevent mutations', () => {
      const originalData = { nested: { value: 'test' } };
      store.updateState({ data: originalData, $tag: 'test-data' });

      const taggedState = store.getTaggedState('test-data') as TestDataState;
      taggedState!.data.nested.value = 'modified';

      // Original tagged state should not be affected
      const taggedStateAgain = store.getTaggedState('test-data') as TestDataState;
      expect(taggedStateAgain!.data.nested.value).toBe('test');
    });

    test('should return state without affecting current state', () => {
      store.updateState({ counter: 5, $tag: 'tagged-state' });
      store.updateState({ counter: 10 });

      expect(store.getCurrentState().counter).toBe(10);
      expect(store.getTaggedState('tagged-state')!.counter).toBe(5);
      expect(store.getCurrentState().counter).toBe(10); // Still unchanged
    });
  });

  describe('getAvailableTags method', () => {
    test('should return empty array when no tags exist', () => {
      expect(store.getAvailableTags()).toEqual([]);
    });

    test('should return all tag names', () => {
      store.updateState({ step: 1, $tag: 'alpha' });
      store.updateState({ step: 2, $tag: 'beta' });
      store.updateState({ step: 3, $tag: 'gamma' });

      const tags = store.getAvailableTags();
      expect(tags).toHaveLength(3);
      expect(tags).toEqual(expect.arrayContaining(['alpha', 'beta', 'gamma']));
    });

    test('should return array that can be safely modified', () => {
      store.updateState({ value: 1, $tag: 'test' });

      const tags = store.getAvailableTags();
      tags.push('fake-tag');

      // Should not affect the actual tags
      expect(store.getAvailableTags()).toEqual(['test']);
    });
  });

  describe('jumpToTag method', () => {
    test('should restore tagged state as current state', () => {
      store.updateState({ counter: 5, $tag: 'checkpoint' });
      store.updateState({ counter: 10 });

      expect(store.getCurrentState().counter).toBe(10);

      store.jumpToTag('checkpoint');
      expect(store.getCurrentState().counter).toBe(5);
    });

    test('should add restored state to history', () => {
      const initialLength = store.stateStorage.length;

      store.updateState({ counter: 5, $tag: 'checkpoint' });
      store.updateState({ counter: 10 });

      store.jumpToTag('checkpoint');

      // Should have added a new state to history
      expect(store.stateStorage.length).toBe(initialLength + 3); // initial + tagged + update + jump
    });

    test('should emit TAG_JUMPED and STATE_UPDATED events', () => {
      const tagJumpedMock = vi.fn();
      const stateUpdatedMock = vi.fn();

      store.on('TAG_JUMPED', tagJumpedMock);
      store.on('STATE_UPDATED', stateUpdatedMock);

      store.updateState({ counter: 5, $tag: 'test-tag' });
      store.jumpToTag('test-tag');

      expect(tagJumpedMock).toHaveBeenCalledWith({
        tag: 'test-tag',
        state: expect.objectContaining({ counter: 5 }),
      });
      expect(stateUpdatedMock).toHaveBeenCalledWith(expect.objectContaining({ counter: 5 }));
    });

    test('should throw error for non-existent tags', () => {
      expect(() => store.jumpToTag('non-existent')).toThrow('Tag "non-existent" not found');
    });

    test('should remove $tag metadata from restored state', () => {
      store.updateState({ counter: 5, $tag: 'test-tag' });
      store.jumpToTag('test-tag');

      const currentState = store.getCurrentState();
      expect(currentState.$tag).toBeUndefined();
    });

    test('should allow continuing from restored state', () => {
      store.updateState({ counter: 5, $tag: 'checkpoint' });
      store.updateState({ counter: 10 });

      store.jumpToTag('checkpoint');
      store.updateState({ counter: 15 });

      expect(store.getCurrentState().counter).toBe(15);
    });
  });

  describe('removeTag method', () => {
    test('should remove existing tags and return true', () => {
      store.updateState({ counter: 1, $tag: 'to-remove' });

      const wasRemoved = store.removeTag('to-remove');

      expect(wasRemoved).toBe(true);
      expect(store.getAvailableTags()).toEqual([]);
      expect(store.getTaggedState('to-remove')).toBeUndefined();
    });

    test('should return false for non-existent tags', () => {
      const wasRemoved = store.removeTag('non-existent');

      expect(wasRemoved).toBe(false);
    });

    test('should emit TAG_REMOVED event for existing tags', () => {
      const tagRemovedMock = vi.fn();
      store.on('TAG_REMOVED', tagRemovedMock);

      store.updateState({ counter: 1, $tag: 'test-tag' });
      store.removeTag('test-tag');

      expect(tagRemovedMock).toHaveBeenCalledWith({ tag: 'test-tag' });
    });

    test('should not emit TAG_REMOVED event for non-existent tags', () => {
      const tagRemovedMock = vi.fn();
      store.on('TAG_REMOVED', tagRemovedMock);

      store.removeTag('non-existent');

      expect(tagRemovedMock).not.toHaveBeenCalled();
    });

    test('should not affect state history', () => {
      store.updateState({ counter: 1, $tag: 'test-tag' });
      const historyLength = store.stateStorage.length;

      store.removeTag('test-tag');

      expect(store.stateStorage.length).toBe(historyLength);
      expect(store.getCurrentState().counter).toBe(1);
    });
  });

  describe('clearTags method', () => {
    test('should remove all tags', () => {
      store.updateState({ counter: 1, $tag: 'tag-1' });
      store.updateState({ counter: 2, $tag: 'tag-2' });
      store.updateState({ counter: 3, $tag: 'tag-3' });

      store.clearTags();

      expect(store.getAvailableTags()).toEqual([]);
    });

    test('should emit TAGS_CLEARED event with count', () => {
      const tagsClearedMock = vi.fn();
      store.on('TAGS_CLEARED', tagsClearedMock);

      store.updateState({ counter: 1, $tag: 'tag-1' });
      store.updateState({ counter: 2, $tag: 'tag-2' });

      store.clearTags();

      expect(tagsClearedMock).toHaveBeenCalledWith({ clearedCount: 2 });
    });

    test('should handle clearing when no tags exist', () => {
      const tagsClearedMock = vi.fn();
      store.on('TAGS_CLEARED', tagsClearedMock);

      store.clearTags();

      expect(tagsClearedMock).toHaveBeenCalledWith({ clearedCount: 0 });
      expect(store.getAvailableTags()).toEqual([]);
    });

    test('should not affect state history', () => {
      store.updateState({ counter: 1, $tag: 'tag-1' });
      store.updateState({ counter: 2, $tag: 'tag-2' });
      const historyLength = store.stateStorage.length;

      store.clearTags();

      expect(store.stateStorage.length).toBe(historyLength);
      expect(store.getCurrentState().counter).toBe(2);
    });
  });

  describe('Memory management integration', () => {
    test('should include tagged count in getMemoryUsage', () => {
      store.updateState({ counter: 1, $tag: 'tag-1' });
      store.updateState({ counter: 2, $tag: 'tag-2' });

      const usage = store.getMemoryUsage();

      expect(usage.taggedCount).toBe(2);
      expect(usage.stateCount).toBeGreaterThan(0);
      expect(usage.estimatedSizeKB).toBeGreaterThan(0);
    });

    test('should remove tags when their referenced states are trimmed', () => {
      // Create a store with very small history limit
      const smallStore = new Substate({
        name: 'SmallStore',
        state: { counter: 0 },
        maxHistorySize: 3,
      });

      // Add tagged states
      // States: [initial{0}]
      smallStore.updateState({ counter: 1, $tag: 'tag-1' }); // States: [initial{0}, tag-1{1}]
      smallStore.updateState({ counter: 2, $tag: 'tag-2' }); // States: [initial{0}, tag-1{1}, tag-2{2}]
      smallStore.updateState({ counter: 3, $tag: 'tag-3' }); // States: [tag-1{1}, tag-2{2}, tag-3{3}] - initial trimmed
      smallStore.updateState({ counter: 4 }); // States: [tag-2{2}, tag-3{3}, update{4}] - tag-1 trimmed

      // tag-2 and tag-3 should survive (tag-1 should be trimmed)
      const availableTags = smallStore.getAvailableTags();
      expect(availableTags).toEqual(expect.arrayContaining(['tag-2', 'tag-3']));
      expect(availableTags).toHaveLength(2);
      expect(smallStore.getTaggedState('tag-1')).toBeUndefined();
      expect(smallStore.getTaggedState('tag-2')).toMatchObject({ counter: 2 });
      expect(smallStore.getTaggedState('tag-3')).toMatchObject({ counter: 3 });
    });

    test('should adjust tag indices when history is trimmed', () => {
      const smallStore = new Substate({
        name: 'SmallStore',
        state: { counter: 0 },
        maxHistorySize: 3,
      });

      smallStore.updateState({ counter: 1 });
      smallStore.updateState({ counter: 2, $tag: 'survivor' });
      smallStore.updateState({ counter: 3 });
      smallStore.updateState({ counter: 4 }); // This should trim the first state

      // The tagged state should still be accessible and correct
      expect(smallStore.getTaggedState('survivor')).toMatchObject({ counter: 2 });
    });

    test('should clear all tags when clearHistory is called', () => {
      store.updateState({ counter: 1, $tag: 'tag-1' });
      store.updateState({ counter: 2, $tag: 'tag-2' });

      store.clearHistory();

      expect(store.getAvailableTags()).toEqual([]);
      expect(store.getTaggedState('tag-1')).toBeUndefined();
      expect(store.getTaggedState('tag-2')).toBeUndefined();
    });

    test('should handle tagged states correctly with limitHistory', () => {
      // Fill up history - starting with initial state, then add 8 tagged states = 9 total
      // States: [initial{0}, tag-1{1}, tag-2{2}, ..., tag-8{8}]
      for (let i = 1; i <= 8; i++) {
        store.updateState({ counter: i, $tag: `tag-${i}` });
      }

      expect(store.stateStorage.length).toBe(9); // initial + 8 tagged states

      // Limit history to 5 states (should remove first 4 states: initial + tag-1,2,3)
      // Remaining: [tag-4{4}, tag-5{5}, tag-6{6}, tag-7{7}, tag-8{8}]
      store.limitHistory(5);

      const availableTags = store.getAvailableTags();
      expect(availableTags).toHaveLength(5); // tags 4, 5, 6, 7, 8 should survive
      expect(availableTags).toEqual(
        expect.arrayContaining(['tag-4', 'tag-5', 'tag-6', 'tag-7', 'tag-8'])
      );

      // Removed tags should be undefined
      expect(store.getTaggedState('tag-1')).toBeUndefined();
      expect(store.getTaggedState('tag-2')).toBeUndefined();
      expect(store.getTaggedState('tag-3')).toBeUndefined();

      // Remaining tags should be accessible
      expect(store.getTaggedState('tag-4')).toMatchObject({ counter: 4 });
      expect(store.getTaggedState('tag-8')).toMatchObject({ counter: 8 });
    });
  });

  describe('Integration with existing features', () => {
    test('should work with middleware functions', () => {
      const beforeMock = vi.fn();
      const afterMock = vi.fn();

      const storeWithMiddleware = new Substate({
        name: 'MiddlewareStore',
        state: { value: 0 },
        beforeUpdate: [beforeMock],
        afterUpdate: [afterMock],
      });

      storeWithMiddleware.updateState({ value: 1, $tag: 'test-tag' });

      expect(beforeMock).toHaveBeenCalledWith(
        storeWithMiddleware,
        expect.objectContaining({ value: 1, $tag: 'test-tag' })
      );
      expect(afterMock).toHaveBeenCalledWith(
        storeWithMiddleware,
        expect.objectContaining({ value: 1, $tag: 'test-tag' })
      );
      expect(storeWithMiddleware.getTaggedState('test-tag')).toBeDefined();
    });

    test('should work with sync functionality', () => {
      const uiModel = { displayValue: 0 };

      const synced = store.sync({
        readerObj: uiModel,
        stateField: 'counter',
        readField: 'displayValue',
      });

      store.updateState({ counter: 5, $tag: 'synced-state' });
      expect(uiModel.displayValue).toBe(5);

      store.jumpToTag('synced-state');
      expect(uiModel.displayValue).toBe(5); // Should still be synced

      synced.unsync();
    });

    test('should work with createStore factory', () => {
      const factoryStore = createStore({
        name: 'FactoryStore',
        state: { data: 'initial' },
      });

      factoryStore.updateState({ data: 'tagged', $tag: 'factory-tag' });

      expect(factoryStore.getAvailableTags()).toEqual(['factory-tag']);
      expect(factoryStore.getTaggedState('factory-tag')).toMatchObject({ data: 'tagged' });
    });

    test('should handle complex nested state with tags', () => {
      const complexState = {
        user: {
          profile: { name: 'John', age: 30 },
          settings: { theme: 'dark' },
        },
        app: { version: '1.0' },
      };

      store.updateState({ ...complexState, $tag: 'complex-state' });

      const retrieved = store.getTaggedState('complex-state') as ComplexTestState;
      expect(retrieved).toMatchObject(complexState);

      // Test deep cloning
      retrieved!.user.profile.name = 'Jane';
      const retrievedAgain = store.getTaggedState('complex-state') as ComplexTestState;
      expect(retrievedAgain!.user.profile.name).toBe('John'); // Should not be mutated
    });
  });

  describe('Edge cases and error handling', () => {
    test('should handle special characters in tag names', () => {
      const specialTags = [
        'tag-with-dash',
        'tag_with_underscore',
        'tag.with.dots',
        'tag with spaces',
      ];

      specialTags.forEach((tag, index) => {
        store.updateState({ counter: index, $tag: tag });
      });

      expect(store.getAvailableTags()).toEqual(expect.arrayContaining(specialTags));

      specialTags.forEach((tag, index) => {
        expect(store.getTaggedState(tag)).toMatchObject({ counter: index });
      });
    });

    test('should handle numeric-like tag names', () => {
      store.updateState({ counter: 1, $tag: '123' });
      store.updateState({ counter: 2, $tag: '0' });

      expect(store.getAvailableTags()).toEqual(expect.arrayContaining(['123', '0']));
      expect(store.getTaggedState('123')).toMatchObject({ counter: 1 });
      expect(store.getTaggedState('0')).toMatchObject({ counter: 2 });
    });

    test('should handle case-sensitive tag names', () => {
      store.updateState({ counter: 1, $tag: 'CaseSensitive' });
      store.updateState({ counter: 2, $tag: 'casesensitive' });

      expect(store.getAvailableTags()).toHaveLength(2);
      expect(store.getTaggedState('CaseSensitive')).toMatchObject({ counter: 1 });
      expect(store.getTaggedState('casesensitive')).toMatchObject({ counter: 2 });
    });

    test('should handle jumping to tags when state storage is at capacity', () => {
      const smallStore = new Substate({
        name: 'SmallStore',
        state: { counter: 0 },
        maxHistorySize: 2,
      });

      smallStore.updateState({ counter: 1, $tag: 'tag-1' });
      smallStore.updateState({ counter: 2 }); // This should trim initial state

      // The tag should still work even though we're at capacity
      smallStore.jumpToTag('tag-1');
      expect(smallStore.getCurrentState().counter).toBe(1);
    });
  });
});
