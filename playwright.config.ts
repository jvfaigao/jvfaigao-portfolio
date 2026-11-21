import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: 0,
  use: { baseURL: 'http://localhost:4329' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // shortcut: dev server, because the Vercel adapter has no `astro preview`; Lighthouse runs on the Vercel preview instead.
    command: 'npx astro dev --port 4329',
    url: 'http://localhost:4329',
    reuseExistingServer: true,
    env: { CONTACT_DRY_RUN: '1' },
    timeout: 120_000,
  },
});
