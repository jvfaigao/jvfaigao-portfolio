import { describe, expect, it } from 'vitest';
import { getStoredTheme, storeTheme } from '../../src/lib/theme';

const throwing = {
  getItem: (): string | null => {
    throw new Error('denied');
  },
  setItem: (): void => {
    throw new Error('denied');
  },
};

function memory() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
}

describe('theme storage', () => {
  it('returns null when storage throws', () => {
    expect(getStoredTheme(throwing)).toBeNull();
  });
  it('storeTheme does not throw when storage throws', () => {
    expect(() => storeTheme('light', throwing)).not.toThrow();
  });
  it('round-trips a stored theme', () => {
    const s = memory();
    storeTheme('light', s);
    expect(getStoredTheme(s)).toBe('light');
  });
  it('ignores unknown values', () => {
    const s = memory();
    s.setItem('theme', 'purple');
    expect(getStoredTheme(s)).toBeNull();
  });
});
