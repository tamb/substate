import { describe, expect, it } from 'vitest';
import type { IState, ISubstate } from '../../Substate.interface';
import { checkForFastPathPossibility } from '../checkForFastPathPossibility';

const MOCK_STORE_NO_MIDDLEWARE_NO_TAGGED_STATES = {
  hasMiddleware: false,
  hasTaggedStates: false,
} as ISubstate<IState>;

const MOCK_STORE_NO_MIDDLEWARE_HAS_TAGGED_STATES = {
  hasMiddleware: false,
  hasTaggedStates: true,
} as ISubstate<IState>;

const MOCK_STORE_HAS_MIDDLEWARE_NO_TAGGED_STATES = {
  hasMiddleware: true,
  hasTaggedStates: false,
} as ISubstate<IState>;

const MOCK_STORE_HAS_MIDDLEWARE_HAS_TAGGED_STATES = {
  hasMiddleware: true,
  hasTaggedStates: true,
} as ISubstate<IState>;

describe('checkForFastPathPossibility', () => {
  it('should return true if the fast path is possible', () => {
    expect(
      checkForFastPathPossibility(MOCK_STORE_NO_MIDDLEWARE_NO_TAGGED_STATES, {
        $deep: false,
        $tag: undefined,
      })
    ).toBe(true);
  });

  describe('store fields', () => {
    it('should return false if the store has middleware', () => {
      expect(
        checkForFastPathPossibility(MOCK_STORE_HAS_MIDDLEWARE_NO_TAGGED_STATES, {
          $deep: false,
          $tag: undefined,
        })
      ).toBe(false);
    });

    it('should return false if the store has tagged states', () => {
      expect(
        checkForFastPathPossibility(MOCK_STORE_NO_MIDDLEWARE_HAS_TAGGED_STATES, {
          $deep: false,
          $tag: undefined,
        })
      ).toBe(false);
    });

    it('should return false if the store has middleware and has tagged states', () => {
      expect(
        checkForFastPathPossibility(MOCK_STORE_HAS_MIDDLEWARE_HAS_TAGGED_STATES, {
          $deep: false,
          $tag: undefined,
        })
      ).toBe(false);
    });
  });

  describe('action fields', () => {
    it('should return false if the action has $deep', () => {
      expect(
        checkForFastPathPossibility(MOCK_STORE_NO_MIDDLEWARE_NO_TAGGED_STATES, {
          $deep: true,
          $tag: undefined,
        })
      ).toBe(false);
    });

    it('should return false if the action has $tag', () => {
      expect(
        checkForFastPathPossibility(MOCK_STORE_NO_MIDDLEWARE_NO_TAGGED_STATES, {
          $deep: false,
          $tag: 'test',
        })
      ).toBe(false);
    });

    it('should return false if the action has $deep and $tag', () => {
      expect(
        checkForFastPathPossibility(MOCK_STORE_NO_MIDDLEWARE_NO_TAGGED_STATES, {
          $deep: true,
          $tag: 'test',
        })
      ).toBe(false);
    });

    it('should return true if the action $deep is false and $tag is undefined', () => {
      expect(
        checkForFastPathPossibility(MOCK_STORE_NO_MIDDLEWARE_NO_TAGGED_STATES, {
          $deep: false,
          $tag: undefined, // this is actually the same as having no $tag or an empty string
        })
      ).toBe(true);
    });

    it('should return true if the action $deep is false and $tag is an empty string', () => {
      expect(
        checkForFastPathPossibility(MOCK_STORE_NO_MIDDLEWARE_NO_TAGGED_STATES, {
          $deep: false,
          $tag: '',
        })
      ).toBe(true);
    });

    it('should return true if the action $deep is false and $tag is null', () => {
      expect(
        checkForFastPathPossibility(MOCK_STORE_NO_MIDDLEWARE_NO_TAGGED_STATES, {
          $deep: false,
          $tag: null as unknown as string | undefined,
        })
      ).toBe(true);
    });
  });
});
