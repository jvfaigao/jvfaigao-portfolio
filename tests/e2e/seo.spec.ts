import { expect, test } from '@playwright/test';

const PAGES = [
  '/',
  '/projects',
  '/projects/ja1-church',
  '/projects/marami-cafe',
  '/projects/urban-towns',
  '/projects/degz-athletic-club',
  '/projects/faceattend',
  '/projects/ambagpay',
  '/projects/thesis-payroll',
];

test('unique titles and a meta description on every page', async ({ page }) => {
  const titles = new Set<string>();
  for (const path of PAGES) {
    await page.goto(path);
    titles.add(await page.title());
    expect((await page.locator('meta[name="description"]').getAttribute('content'))?.length, path).toBeGreaterThan(20);
    await expect(page.locator('link[rel="canonical"]'), path).toHaveAttribute('href', new RegExp(`${path === '/' ? '/$' : path + '$'}`));
  }
  expect(titles.size).toBe(PAGES.length);
});

test('og:image and favicons resolve', async ({ page, request }) => {
  await page.goto('/');
  const og = (await page.locator('meta[property="og:image"]').getAttribute('content'))!;
  expect(og).toMatch(/\/og\.png$/);
  expect((await request.get(new URL(og).pathname)).status()).toBe(200);
  for (const href of ['/favicon.svg', '/favicon-32.png', '/apple-touch-icon.png', '/icon-512.png', '/robots.txt', '/logo.svg']) {
    expect((await request.get(href)).status(), href).toBe(200);
  }
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png');
});

test('unknown page returns 404 with a way home', async ({ page }) => {
  const res = await page.goto('/nope');
  expect(res!.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.locator('main')).toContainText("That page doesn't exist.");
  await expect(page.getByRole('link', { name: 'Back to home' })).toHaveAttribute('href', '/');
});
