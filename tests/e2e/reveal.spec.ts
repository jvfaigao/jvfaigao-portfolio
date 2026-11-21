import { expect, test, type Page } from '@playwright/test';

const opacity = (page: Page, sel: string) => page.locator(sel).first().evaluate((e) => getComputedStyle(e).opacity);

test('text below the fold waits, then rises in when scrolled to', async ({ page }) => {
  await page.goto('/');
  const target = '#stack li';
  await expect(page.locator(target).first()).toHaveClass(/rv-item/);
  expect(await opacity(page, target)).toBe('0');
  await page.locator(target).first().scrollIntoViewIfNeeded();
  await expect(page.locator(target).first()).toHaveClass(/rv-in/);
  await expect.poll(() => opacity(page, target), { timeout: 3000 }).toBe('1');
});

test('every kind of text is included, each on its own', async ({ page }) => {
  await page.goto('/');
  for (const sel of ['#how h2', '.step-num', '#how h3', '#how p', '#words blockquote', '#words figcaption', '#stack h3', '#stack li', '#about p', '#personal .inst span', '.social', '#contact h2', '#contact p']) {
    await expect(page.locator(sel).first(), sel).toHaveClass(/rv-item/);
  }
  // No item sits inside another item (that would double the motion).
  const nested = await page.locator('.rv-item .rv-item').count();
  expect(nested).toBe(0);
});

test('items that enter together are staggered', async ({ page }) => {
  await page.goto('/');
  await page.locator('#how .steps').scrollIntoViewIfNeeded();
  await expect(page.locator('#how .steps h3').last()).toHaveClass(/rv-in/);
  const delays = await page.locator('#how .steps h3').evaluateAll((els) => els.map((e) => (e as HTMLElement).style.transitionDelay));
  expect(new Set(delays).size).toBeGreaterThan(1);
});

test('contact form and footer do not move', async ({ page }) => {
  await page.goto('/');
  for (const sel of ['.cform label', '.cform .field', '.cform button', 'footer span', 'footer a']) {
    await expect(page.locator(sel).first(), sel).not.toHaveClass(/rv-item/);
  }
});

test('hero text rises in on load', async ({ page }) => {
  await page.goto('/');
  for (const sel of ['.hero-intro h1', '.hero-intro p', '.hero-cta', '.hero-stats > div']) {
    await expect(page.locator(sel).first(), sel).toHaveCSS('animation-name', 'jvRise');
  }
  await expect.poll(() => opacity(page, '.hero-stats > div:last-child'), { timeout: 3000 }).toBe('1');
});

test('projects page and project pages reveal too', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.locator('.row > *').first()).toHaveClass(/rv-item/);
  await page.goto('/projects/marami-cafe');
  for (const sel of ['.pp-body h2', '.pp-body p', '.pp-body li', '.pp blockquote', '.shot']) {
    await expect(page.locator(sel).first(), sel).toHaveClass(/rv-item/);
  }
});

test('reduced motion: nothing hidden, nothing moves', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/\brv\b/);
  expect(await opacity(page, '#stack li')).toBe('1');
  await expect(page.locator('.hero-intro h1')).toHaveCSS('animation-name', 'none');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('all text is visible', async ({ page }) => {
    await page.goto('/');
    expect(await opacity(page, '#stack li')).toBe('1');
  });
});

test('if the reveal script breaks halfway, text still appears', async ({ page }) => {
  // IntersectionObserver exists but throws: the script has already hidden the text when it fails.
  await page.addInitScript(() => {
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = function () {
      throw new Error('broken');
    };
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/\brv\b/);
  await expect(page.locator('html')).not.toHaveClass(/rv-ready/);
  await expect.poll(() => opacity(page, '#stack li'), { timeout: 5000 }).toBe('1');
});
