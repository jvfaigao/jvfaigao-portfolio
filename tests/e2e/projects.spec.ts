import { expect, test } from '@playwright/test';

const PRODUCTION = [
  ['JA1 Church Management System', 'https://ja1-attendance.web.app'],
  ['Marami Cafe POS and Online Ordering', 'https://marami-cafe-pos-system.vercel.app/order'],
  ['Urban Towns Attendance and Payroll', 'https://urban-towns-attendance.web.app/'],
  ['Degz Athletic Club Booking System', 'https://degz-athletic-club.pages.dev/'],
];
const OTHER = ['FaceAttend', 'AmbagPay', 'Automated Attendance and Payroll System (Thesis)'];

const PAGES: { slug: string; title: string; result: boolean; quote: boolean }[] = [
  { slug: 'ja1-church', title: 'JA1 CHURCH MANAGEMENT SYSTEM', result: true, quote: true },
  { slug: 'marami-cafe', title: 'MARAMI CAFE POS AND ONLINE ORDERING', result: true, quote: true },
  { slug: 'urban-towns', title: 'URBAN TOWNS ATTENDANCE AND PAYROLL', result: true, quote: true },
  { slug: 'degz-athletic-club', title: 'DEGZ ATHLETIC CLUB BOOKING SYSTEM', result: true, quote: true },
  { slug: 'faceattend', title: 'FACEATTEND', result: true, quote: false },
  { slug: 'ambagpay', title: 'AMBAGPAY', result: false, quote: false },
  { slug: 'thesis-payroll', title: 'AUTOMATED ATTENDANCE AND PAYROLL SYSTEM (THESIS)', result: false, quote: false },
];

test('projects page lists 4 + 3 in order with Visit site links', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('PROJECTS');
  const groups = page.locator('main section.group');
  await expect(groups.nth(0).getByRole('heading', { level: 2 })).toHaveText('In production');
  await expect(groups.nth(0).locator('.rname')).toHaveText(PRODUCTION.map(([n]) => n));
  for (const [, url] of PRODUCTION) {
    await expect(groups.nth(0).locator(`a[href="${url}"]`)).toHaveText(/Visit site/);
  }
  await expect(groups.nth(1).getByRole('heading', { level: 2 })).toHaveText('Other work');
  await expect(groups.nth(1).locator('.rname')).toHaveText(OTHER);
  await expect(page.locator('.cta-band')).toContainText("LET'S WORKTOGETHER");
});

test('project names link to their pages', async ({ page }) => {
  await page.goto('/projects');
  await page.getByRole('link', { name: 'Urban Towns Attendance and Payroll' }).click();
  await expect(page).toHaveURL(/\/projects\/urban-towns$/);
});

for (const p of PAGES) {
  test(`${p.slug} page renders title, result and quote`, async ({ page }) => {
    await page.goto(`/projects/${p.slug}`);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(p.title, { useInnerText: true });
    await expect(page.getByRole('link', { name: 'All projects' })).toHaveAttribute('href', '/projects');
    await expect(page.locator('.result')).toHaveCount(p.result ? 1 : 0);
    await expect(page.locator('blockquote')).toHaveCount(p.quote ? 1 : 0);
    await expect(page.getByRole('heading', { name: 'How it works' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'What I built' })).toBeVisible();
  });
}

test('marami page shows Order online link', async ({ page }) => {
  await page.goto('/projects/marami-cafe');
  await expect(page.getByRole('link', { name: 'Order online' })).toHaveAttribute(
    'href',
    'https://marami-cafe-pos-system.vercel.app/order',
  );
  await expect(page.locator('.pp-meta')).toContainText('Solo developer · 2026 · React, Supabase (PostgreSQL), Dexie.js, PWA');
});

test('screenshots section hidden when empty', async ({ page }) => {
  await page.goto('/projects/marami-cafe');
  await expect(page.getByRole('heading', { name: 'Screenshots' })).toHaveCount(0);
});

test('diagram wide at 1280, vertical at 390', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/projects/marami-cafe');
  await expect(page.locator('.diag-wide')).toBeVisible();
  await expect(page.locator('.diag-narrow')).toBeHidden();
  await expect(page.locator('.diag-wide .wcard')).toHaveCount(5);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.diag-wide')).toBeHidden();
  await expect(page.locator('.diag-narrow')).toBeVisible();
});

test('card and page share a view-transition name', async ({ page }) => {
  await page.goto('/projects');
  const listName = await page.locator('.rname').first().evaluate((e) => getComputedStyle(e).viewTransitionName);
  await page.goto('/projects/ja1-church');
  const pageName = await page.locator('h1').evaluate((e) => getComputedStyle(e).viewTransitionName);
  expect(listName).toBe('p-ja1-church');
  expect(pageName).toBe(listName);
});

for (const slug of ['thesis-payroll', 'marami-cafe']) {
  test(`no horizontal overflow at 360px on /projects/${slug}`, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto(`/projects/${slug}`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
