import { describe, expect, it } from 'vitest';
import { isDeep } from '../isDeep';

describe('isDeep', () => {
  it('should return true if the action has $deep', () => {
    expect(isDeep({ $deep: true }, false)).toBe(true);
  });

  it('should return false if the action has $deep set to false', () => {
    expect(isDeep({ $deep: false }, true)).toBe(false);
  });

  it('should return the default deep if the action has $deep set to undefined', () => {
    expect(isDeep({ $deep: undefined }, true)).toBe(true);
  });

  it('should return the default deep if the action has $deep set to undefined', () => {
    expect(isDeep({ $deep: undefined }, false)).toBe(false);
  });
});
