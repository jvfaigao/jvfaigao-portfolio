import { describe, expect, it } from 'vitest';
import { sectionToNav } from '../../src/lib/activeSection';

describe('sectionToNav', () => {
  it.each([
    ['top', 'home'],
    ['how', 'about'],
    ['words', 'about'],
    ['stack', 'about'],
    ['about', 'about'],
    ['personal', 'about'],
    ['contact', 'contact'],
  ])('%s → %s', (id, nav) => {
    expect(sectionToNav(id)).toBe(nav);
  });
  it('unknown → null', () => {
    expect(sectionToNav('nope')).toBeNull();
  });
});
