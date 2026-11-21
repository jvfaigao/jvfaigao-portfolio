import { expect, test } from '@playwright/test';

test('dark by default', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
});

test('toggle persists across reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
});

test('toggle works when localStorage throws', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new Error('denied');
    };
    Storage.prototype.setItem = () => {
      throw new Error('denied');
    };
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('desktop shows header links and hides bottom nav', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const main = page.getByRole('navigation', { name: 'Main' });
  for (const name of ['Projects', 'About', 'Contact', 'Download CV']) {
    await expect(main.getByRole('link', { name, exact: true })).toBeVisible();
  }
  await expect(page.getByRole('navigation', { name: 'Bottom' })).toBeHidden();
});

test('phone shows bottom nav with 4 items and CV pill', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const bottom = page.getByRole('navigation', { name: 'Bottom' });
  await expect(bottom).toBeVisible();
  await expect(bottom.getByRole('link')).toHaveText(['Home', 'Projects', 'About', 'Contact']);
  const main = page.getByRole('navigation', { name: 'Main' });
  await expect(main.getByRole('link', { name: 'Download CV' })).toBeVisible();
  await expect(main.getByRole('link', { name: 'About', exact: true })).toBeHidden();
});

test('bubble moves on tap', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const bottom = page.getByRole('navigation', { name: 'Bottom' });
  const bubble = page.locator('.bnav-bubble');
  const before = (await bubble.boundingBox())!.x;
  await bottom.getByRole('link', { name: 'About' }).click();
  await expect.poll(async () => (await bubble.boundingBox())!.x).toBeGreaterThan(before + 100);
  await expect(bottom.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
});

test('projects page marks Projects active', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/projects');
  const bottom = page.getByRole('navigation', { name: 'Bottom' });
  await expect(bottom.getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
});

test('bottom nav never covers footer', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(500);
  const footerLast = (await page.locator('footer .foot-links').boundingBox())!;
  const bubble = (await page.locator('.bnav-bubble').boundingBox())!;
  expect(footerLast.y + footerLast.height).toBeLessThanOrEqual(bubble.y);
});

test.describe('phone bottom nav motion', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  const scrollTo = (page: import('@playwright/test').Page, top: number) =>
    page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), top);

  test('hides on scroll down and comes back on scroll up', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('.bnav');
    await scrollTo(page, 900);
    await expect(nav).toHaveClass(/is-hidden/);
    await expect.poll(async () => (await page.locator('.bnav-bubble').boundingBox())!.y).toBeGreaterThanOrEqual(844);
    await scrollTo(page, 700);
    await expect(nav).not.toHaveClass(/is-hidden/);
  });

  test('stays visible at the top and at the end of the page', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('.bnav');
    await scrollTo(page, 900);
    await expect(nav).toHaveClass(/is-hidden/);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await expect(nav).not.toHaveClass(/is-hidden/);
  });

  test('tapping a nav item does not hide it while the page scrolls there', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Bottom' }).getByRole('link', { name: 'About' }).click();
    await page.waitForTimeout(700);
    await expect(page.locator('.bnav')).not.toHaveClass(/is-hidden/);
  });

  test('keyboard focus brings a hidden nav back', async ({ page }) => {
    await page.goto('/');
    await scrollTo(page, 900);
    await expect(page.locator('.bnav')).toHaveClass(/is-hidden/);
    await page.getByRole('navigation', { name: 'Bottom' }).getByRole('link', { name: 'Home' }).focus();
    await expect(page.locator('.bnav')).not.toHaveClass(/is-hidden/);
  });

  test('bubble icon cross-fades to the active item', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.bico-home')).toHaveCSS('opacity', '1');
    await expect(page.locator('.bico-contact')).toHaveCSS('opacity', '0');
    await page.getByRole('navigation', { name: 'Bottom' }).getByRole('link', { name: 'Contact' }).click();
    await expect(page.locator('.bico-contact')).toHaveCSS('opacity', '1');
    await expect(page.locator('.bico-home')).toHaveCSS('opacity', '0');
    await expect(page.locator('.bnav-bubble')).toHaveCSS('transition-property', /transform/);
  });
});
