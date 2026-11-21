import { expect, test } from '@playwright/test';

test.describe('"How it works" diagram draws in', () => {
  test('waits off screen, then reveals boxes and arrows in order', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/projects/marami-cafe');
    const wide = page.locator('.diag-wide');
    await expect(wide).toHaveClass(/pending/);
    await wide.scrollIntoViewIfNeeded();
    await expect(wide).toHaveClass(/\bin\b/);
    await expect(wide).not.toHaveClass(/pending/);
    const delays = await page.locator('.diag-wide .wcard').evaluateAll((els) => els.map((e) => getComputedStyle(e).transitionDelay));
    expect(delays[0]).toBe('0s');
    expect(new Set(delays).size).toBeGreaterThan(2); // staggered
    await expect(page.locator('.diag-wide .wcard').last()).toHaveCSS('opacity', '1', { timeout: 4000 });
    await expect(page.locator('.diag-wide .warrow').last()).toHaveCSS('clip-path', 'inset(0px)', { timeout: 4000 });
  });

  test('phone layout draws in too', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/projects/marami-cafe');
    const narrow = page.locator('.diag-narrow');
    await expect(narrow).toHaveClass(/pending/);
    await narrow.scrollIntoViewIfNeeded();
    await expect(page.locator('.diag-narrow .ncard').last()).toHaveCSS('opacity', '1', { timeout: 4000 });
  });

  test('reduced motion shows the diagram at once', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/projects/marami-cafe');
    await expect(page.locator('.diag-wide')).not.toHaveClass(/pending/);
    await expect(page.locator('.diag-wide .wcard').first()).toHaveCSS('opacity', '1');
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });
    test('diagram is fully visible', async ({ page }) => {
      await page.goto('/projects/marami-cafe');
      await expect(page.locator('.diag-wide .wcard').first()).toHaveCSS('opacity', '1');
      await expect(page.locator('.diag-wide .warrow').first()).toHaveCSS('clip-path', 'none');
    });
  });
});

test('project row hover zooms the thumbnail (desktop)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/projects');
  const img = page.locator('.row .th img').first();
  await page.locator('.row').first().hover();
  await expect.poll(() => img.evaluate((e) => getComputedStyle(e).transform)).not.toBe('none');
});

test.describe('contact form feedback', () => {
  async function fill(page: import('@playwright/test').Page) {
    await page.getByLabel('Name').fill('Ana Cruz');
    await page.getByLabel('Email').fill('ana@example.com');
    await page.getByLabel('Message').fill('Hello JV, I need a booking system.');
  }

  test('button shows a busy state while sending, then a check on success', async ({ page }) => {
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    await page.route('**/api/contact', async (route) => {
      await gate;
      await route.fulfill({ status: 200, json: { ok: true, status: 'sent' } });
    });
    await page.goto('/#contact');
    await fill(page);
    const button = page.getByRole('button', { name: /Send/ });
    await button.click();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toBeDisabled();
    release();
    await expect(page.getByRole('status')).toHaveAttribute('data-state', 'sent');
    await expect(page.getByRole('status')).toHaveText("Message sent. I'll reply to your email soon.");
    await expect(button).not.toHaveAttribute('aria-busy', 'true');
  });

  test('failure clears the busy state and shows no check', async ({ page }) => {
    await page.route('**/api/contact', (route) => route.fulfill({ status: 502, json: { ok: false } }));
    await page.goto('/#contact');
    await fill(page);
    await page.getByRole('button', { name: /Send/ }).click();
    await expect(page.getByRole('status')).toContainText('faigaojv027@gmail.com');
    await expect(page.getByRole('status')).toHaveAttribute('data-state', 'error');
    await expect(page.getByRole('button', { name: /Send/ })).toBeEnabled();
  });
});

test.describe('theme toggle animation', () => {
  test('icons rotate and cross-fade instead of popping', async ({ page }) => {
    await page.goto('/');
    const sun = page.locator('.theme-btn .ico-sun');
    const moon = page.locator('.theme-btn .ico-moon');
    await expect(sun).toHaveCSS('opacity', '1');
    await expect(moon).toHaveCSS('opacity', '0');
    await expect(moon).toHaveCSS('transition-property', /transform/);
    await page.getByRole('button', { name: 'Switch to light theme' }).click();
    await expect(moon).toHaveCSS('opacity', '1');
    await expect(sun).toHaveCSS('opacity', '0');
  });

  test('uses a view transition for the colour change when supported', async ({ page }) => {
    await page.addInitScript(() => {
      const d = document as unknown as { startViewTransition?: (cb: () => void) => unknown; vtCalls: number };
      d.vtCalls = 0;
      const original = d.startViewTransition?.bind(document);
      if (original) d.startViewTransition = (cb) => (d.vtCalls++, original(cb));
    });
    await page.goto('/');
    await page.getByRole('button', { name: 'Switch to light theme' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    expect(await page.evaluate(() => (document as unknown as { vtCalls: number }).vtCalls)).toBe(1);
  });
});
