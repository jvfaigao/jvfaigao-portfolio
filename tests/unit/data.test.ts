import * as icons from 'simple-icons';
import { describe, expect, it } from 'vitest';
import social from '../../src/data/social.json';
import stack from '../../src/data/stack.json';

describe('social.json', () => {
  it('matches spec §6.6', () => {
    expect(social.facebook).toEqual({ name: 'Jv Faigao', url: 'https://www.facebook.com/JvFaigao/', followers: '69.5K' });
    expect(social.tiktok).toEqual({ name: '@jv.faigao', url: 'https://www.tiktok.com/@jv.faigao', followers: '23.3K' });
    expect(social.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('stack.json', () => {
  const slugs = new Set(Object.values(icons).map((i) => (i as { slug?: string }).slug));

  it('has the four groups from spec §6.4 in order', () => {
    expect(stack.map((g) => g.title)).toEqual(['Languages', 'Frontend', 'Backend and data', 'Tools and hosting']);
    expect(stack[0].items.map((i) => i.label)).toEqual(['TypeScript', 'JavaScript', 'Python', 'PHP', 'C++', 'HTML and CSS']);
  });

  it('every icon slug exists in simple-icons', () => {
    for (const g of stack) for (const i of g.items) if ('icon' in i && i.icon) expect(slugs.has(i.icon), i.icon).toBe(true);
  });
});
