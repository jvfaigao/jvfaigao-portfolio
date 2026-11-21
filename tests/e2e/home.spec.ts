import { expect, test } from '@playwright/test';

test('hero copy and stats', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('#top');
  await expect(hero.getByRole('heading', { level: 1 })).toHaveText("Hi, I'm JV.");
  await expect(hero).toContainText('Computer Engineering student who builds complete systems that real people use every day.');
  await expect(hero.getByRole('link', { name: 'View projects' })).toHaveAttribute('href', '/projects');
  await expect(hero.getByRole('link', { name: 'Contact', exact: true })).toHaveAttribute('href', '#contact');
  const stats = hero.locator('.hero-stats');
  await expect(stats).toContainText('4systems in production');
  await expect(stats).toContainText('~500users on the largest');
  await expect(stats).toContainText('CHAMPIONCPEYESTA System Making 2026');
  await expect(hero.getByRole('img', { name: 'John Vincent Faigao' })).toBeVisible();
});

test('hero word spans viewport with fallback font', async ({ page }) => {
  await page.route(/\.(woff2?|ttf)(\?.*)?$/, (route) => route.abort());
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const box = (await page.locator('.bigword svg').boundingBox())!;
  const vw = await page.evaluate(() => window.innerWidth);
  expect(Math.abs(box.width - vw)).toBeLessThanOrEqual(1);
  const textWidth = await page.locator('.bigword text').evaluate((t) => (t as SVGTextElement).getBBox().width);
  expect(Math.abs(textWidth - 1000)).toBeLessThanOrEqual(2);
});

test('sections in order', async ({ page }) => {
  await page.goto('/');
  const ids = await page.locator('main > section').evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(['top', 'how', 'words', 'stack', 'about', 'personal', 'contact']);
});

test('how I work has four steps', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#how h3')).toHaveText(['Understand', 'Plan', 'Build', 'Support']);
});

test('testimonial is Urban Towns quote', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#words blockquote')).toHaveText(
    'We save a lot of time computing salaries now. And we can always check if our workers really showed up for work.',
  );
  await expect(page.locator('#words figcaption')).toHaveText('Owner, Urban Towns · Attendance and Payroll System');
});

test('stack shows 4 groups with icons', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#stack h3')).toHaveText(['Languages', 'Frontend', 'Backend and data', 'Tools and hosting']);
  expect(await page.locator('#stack li svg').count()).toBeGreaterThanOrEqual(12);
});

test('beyond code shows 69.5K and 23.3K with correct links', async ({ page }) => {
  await page.goto('/');
  const fb = page.locator('#personal a[href="https://www.facebook.com/JvFaigao/"]');
  const tt = page.locator('#personal a[href="https://www.tiktok.com/@jv.faigao"]');
  await expect(fb).toContainText('69.5K');
  await expect(fb).toContainText('Jv Faigao');
  await expect(tt).toContainText('23.3K');
  await expect(tt).toContainText('@jv.faigao');
  await expect(page.locator('#personal .inst')).toHaveText('PIANODRUMSGUITARBASS');
});

test('reduced motion disables rise animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.bigword')).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.hero-photo')).toHaveCSS('animation-name', 'none');
});

for (const path of ['/', '/projects']) {
  test(`no horizontal overflow at 360px on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
