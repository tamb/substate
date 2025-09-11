import { describe, expect, it } from 'vitest';
import type { TState } from '../../interfaces';
import { canUseFastPath } from '../canUseFastPath';

describe('canUseFastPath', () => {
  it('should return true if the fast path if object is shallow and DOES NOThave keywords', () => {
    expect(
      canUseFastPath({
        a: 1,
        b: 2,
      } as TState)
    ).toBe(true);
  });

  it('should return false if the fast path if object is shallow and HAS all keywords', () => {
    expect(
      canUseFastPath({
        $deep: true,
        $type: 'update',
        $tag: 'test',
      })
    ).toBe(false);
  });

  it('should return false if the fast path if object is shallow and HAS all keywords EXCEPT $deep', () => {
    expect(
      canUseFastPath({
        $deep: false,
        $type: 'update',
        $tag: 'test',
        a: 1,
        b: 2,
      } as TState)
    ).toBe(false);
  });

  it('should return false if the fast path if object is shallow and HAS $tag', () => {
    expect(
      canUseFastPath({
        $deep: false,
        $tag: 'test',
        a: 1,
        b: 2,
      } as TState)
    ).toBe(false);
  });

  it('should return true if the fast path if object is shallow and $deep is false', () => {
    expect(
      canUseFastPath({
        $deep: false,
        a: 1,
        b: 2,
      } as TState)
    ).toBe(true);
  });

  it('should return false if using dot notation', () => {
    expect(
      canUseFastPath({
        $deep: false,
        'a.b': 1,
        a: 2,
      } as TState)
    ).toBe(false);
  });

  it('should return false if using bracket notation', () => {
    expect(
      canUseFastPath({
        $deep: false,
        'a[2]': 1,
        a: 2,
      } as TState)
    ).toBe(false);
  });
});
