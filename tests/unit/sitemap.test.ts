import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// Reads the last `npm run build` output; run the build first.
const dir = new URL('../../dist/client/', import.meta.url);

describe.runIf(existsSync(dir))('sitemap (from last build)', () => {
  it('lists home, /projects and all 7 project pages, and no result page', () => {
    const file = readdirSync(dir).find((f) => /^sitemap-\d+\.xml$/.test(f));
    expect(file).toBeTruthy();
    const xml = readFileSync(new URL(file!, dir), 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/');
    expect(locs).toEqual(
      expect.arrayContaining([
        '/',
        '/projects',
        ...['ja1-church', 'marami-cafe', 'urban-towns', 'degz-athletic-club', 'faceattend', 'ambagpay', 'thesis-payroll'].map((s) => `/projects/${s}`),
      ]),
    );
    expect(locs).toHaveLength(9);
  });
});
