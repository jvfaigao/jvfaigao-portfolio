import { expect, test } from '@playwright/test';

async function fill(page: import('@playwright/test').Page) {
  await page.getByLabel('Name').fill('Ana Cruz');
  await page.getByLabel('Email').fill('ana@example.com');
  await page.getByLabel('Message').fill('Hello JV, I need a booking system.');
}

test('js submit shows inline success', async ({ page }) => {
  await page.goto('/#contact');
  await fill(page);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('status')).toHaveText("Message sent. I'll reply to your email soon.");
  await expect(page.getByLabel('Name')).toHaveValue('');
});

test('field errors', async ({ page }) => {
  await page.goto('/#contact');
  await page.getByLabel('Email').fill('nope');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.locator('#err-name')).toHaveText('Enter your name');
  await expect(page.locator('#err-email')).toHaveText('Enter a valid email');
  await expect(page.locator('#err-message')).toHaveText('Write at least 10 characters');
  await expect(page.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true');
});

test('send failure shows email fallback', async ({ page }) => {
  await page.route('**/api/contact', (route) => route.fulfill({ status: 502, json: { ok: false } }));
  await page.goto('/#contact');
  await fill(page);
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByRole('status')).toContainText('faigaojv027@gmail.com');
  await expect(page.getByLabel('Message')).toHaveValue('Hello JV, I need a booking system.');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('no-JS submit shows result page', async ({ page }) => {
    await page.goto('/#contact');
    await fill(page);
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page).toHaveURL(/\/contact-result\?status=sent$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Message sent');
  });

  test('no-JS invalid submit explains what to fix', async ({ page }) => {
    await page.goto('/#contact');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page).toHaveURL(/status=invalid/);
    await expect(page.locator('main')).toContainText('Enter your name');
    await expect(page.locator('main')).toContainText('faigaojv027@gmail.com');
  });
});

test('endpoint rejects GET and bad JSON', async ({ request }) => {
  expect((await request.get('/api/contact')).status()).toBe(405);
  const bad = await request.post('/api/contact', { headers: { 'content-type': 'application/json' }, data: '{oops' });
  expect(bad.status()).toBe(400);
});
