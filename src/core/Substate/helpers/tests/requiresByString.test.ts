import { describe, expect, it } from 'vitest';
import { requiresByString } from '../requiresByString';

describe('requiresByString', () => {
  it('should return true if the string contains a dot', () => {
    expect(requiresByString('a.b')).toBe(true);
  });

  it('should return true if the string contains a bracket', () => {
    expect(requiresByString('a[2]')).toBe(true);
  });

  it('should return false if the string does not contain a dot or bracket', () => {
    expect(requiresByString('a')).toBe(false);
  });

  it('should return true if the string contains a dot and bracket', () => {
    expect(requiresByString('a.b[2]')).toBe(true);
  });

  it('should return true if string is empty', () => {
    expect(requiresByString('')).toBe(false);
  });

  it('should throw an error if string is undefined', () => {
    expect(() => requiresByString(undefined as unknown as string)).toThrow('String is undefined');
  });
});
