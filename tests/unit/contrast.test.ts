import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('../../src/styles/tokens.css', import.meta.url), 'utf8');

function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  if (start < 0) throw new Error(`missing ${selector}`);
  const body = css.slice(css.indexOf('{', start) + 1, css.indexOf('}', start));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]));
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('token contrast (WCAG AA)', () => {
  for (const theme of ['dark', 'light']) {
    const t = block(`html[data-theme='${theme}']`);
    for (const fg of ['text', 'muted', 'redtext']) {
      it(`${theme}: ${fg} on bg ≥ 4.5`, () => {
        expect(ratio(t[fg], t.bg)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
  it('white on --red ≥ 4.5', () => {
    expect(ratio('#FFFFFF', block(':root').red)).toBeGreaterThanOrEqual(4.5);
  });
});
