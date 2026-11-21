import { expect, test } from '@playwright/test';

const SLUGS = ['ja1-church', 'marami-cafe', 'urban-towns', 'degz-athletic-club', 'faceattend', 'ambagpay', 'thesis-payroll'];
const WITH_DEMO = SLUGS.filter((s) => s !== 'thesis-payroll');

test('every project row shows a real screenshot thumbnail', async ({ page }) => {
  await page.goto('/projects');
  const thumbs = page.locator('.row .th img');
  await expect(thumbs).toHaveCount(7);
  for (const alt of await thumbs.evaluateAll((els) => els.map((e) => e.getAttribute('alt')))) expect(alt?.length).toBeGreaterThan(5);
});

for (const slug of SLUGS) {
  test(`${slug}: screenshots have alt text and load`, async ({ page }) => {
    await page.goto(`/projects/${slug}`);
    await expect(page.getByRole('heading', { name: 'Screenshots' })).toBeVisible();
    const imgs = page.locator('.shots img');
    expect(await imgs.count()).toBeGreaterThanOrEqual(1);
    for (const img of await imgs.all()) {
      await img.scrollIntoViewIfNeeded();
      expect((await img.getAttribute('alt'))?.length).toBeGreaterThan(5);
      await expect.poll(() => img.evaluate((e) => (e as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    }
  });
}

for (const slug of WITH_DEMO) {
  test(`${slug}: demo clip is muted, looping, lazy and has a poster`, async ({ page, request }) => {
    await page.goto(`/projects/${slug}`);
    const video = page.locator('video.demo');
    await expect(video).toHaveCount(1);
    for (const attr of ['muted', 'loop', 'playsinline', 'controls']) await expect(video).toHaveAttribute(attr, /.*/);
    await expect(video).toHaveAttribute('preload', 'none');
    const poster = (await video.getAttribute('poster'))!;
    const src = (await video.locator('source').getAttribute('src'))!;
    expect((await request.get(poster)).status()).toBe(200);
    const res = await request.get(src);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toContain('video/mp4');
  });
}

test('thesis page has no demo clip', async ({ page }) => {
  await page.goto('/projects/thesis-payroll');
  await expect(page.locator('video')).toHaveCount(0);
});

// Bundled Chromium cannot decode H.264, so these check our play/pause logic, not decoding.
async function trackPlay(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    (window as unknown as { plays: number }).plays = 0;
    HTMLMediaElement.prototype.play = function () {
      (window as unknown as { plays: number }).plays++;
      return Promise.resolve();
    };
  });
}

test('demo starts playing only when scrolled into view', async ({ page }) => {
  await trackPlay(page);
  await page.goto('/projects/marami-cafe');
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => (window as unknown as { plays: number }).plays)).toBe(0);
  await page.locator('video.demo').scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => (window as unknown as { plays: number }).plays)).toBeGreaterThan(0);
});

test('reduced motion: demo never autoplays', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await trackPlay(page);
  await page.goto('/projects/marami-cafe');
  await page.locator('video.demo').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => (window as unknown as { plays: number }).plays)).toBe(0);
});

test('CV download works', async ({ request }) => {
  const res = await request.get('/JV-Faigao-CV.pdf');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('pdf');
});
