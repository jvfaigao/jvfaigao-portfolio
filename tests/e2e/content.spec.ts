import { expect, test } from '@playwright/test';

// Exact client wording from spec §8. Never edit these to make a test pass.
const QUOTES: Record<string, string> = {
  'ja1-church':
    'We can now keep track of who attends every Sunday and manage our members better. No more listing attendees by hand. One QR scan and their attendance is in.',
  'marami-cafe':
    "Our POS is easier to use now because the features aren't limited anymore. Ordering is faster since we have online orders, and we don't check the inventory by hand as much. The kitchen display helps a lot too. Our kitchen is far from the counter, so no more going up and down.",
  'urban-towns':
    'We save a lot of time computing salaries now. And we can always check if our workers really showed up for work.',
  'degz-athletic-club':
    "Booking a court, training or a recovery session is much faster now, and our schedule is more organized. Before, we wrote everything on paper, and sometimes two clients booked the same slot without the owner or staff knowing. That doesn't happen anymore.",
};

const LIVE: Record<string, string> = {
  'ja1-church': 'https://ja1-attendance.web.app',
  'marami-cafe': 'https://marami-cafe-pos-system.vercel.app/order',
  'urban-towns': 'https://urban-towns-attendance.web.app/',
  'degz-athletic-club': 'https://degz-athletic-club.pages.dev/',
};

for (const [slug, quote] of Object.entries(QUOTES)) {
  test(`${slug}: live link, result and exact quote`, async ({ page }) => {
    await page.goto(`/projects/${slug}`);
    await expect(page.locator('blockquote')).toHaveText(quote);
    await expect(page.locator('.result')).toBeVisible();
    await expect(page.locator(`main a[href="${LIVE[slug]}"]`).first()).toBeVisible();
  });
}
