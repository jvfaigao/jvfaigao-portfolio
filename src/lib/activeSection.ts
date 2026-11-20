export type NavKey = 'home' | 'projects' | 'about' | 'contact';

const MAP: Record<string, Exclude<NavKey, 'projects'>> = {
  top: 'home',
  how: 'about',
  words: 'about',
  stack: 'about',
  about: 'about',
  personal: 'about',
  contact: 'contact',
};

export function sectionToNav(id: string): Exclude<NavKey, 'projects'> | null {
  return MAP[id] ?? null;
}
