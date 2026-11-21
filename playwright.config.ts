import { defineConfig, devices } from '@playwright/test';

// Astro allows one dev server per project: set E2E_BASE_URL to test against one that is already running
// (contact tests need that server started with CONTACT_DRY_RUN=1).
const external = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: 0,
  use: { baseURL: external ?? 'http://localhost:4329' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: external ? undefined : {
    // shortcut: dev server, because the Vercel adapter has no `astro preview`; Lighthouse runs on the Vercel preview instead.
    command: 'npx astro dev --port 4329',
    url: 'http://localhost:4329',
    reuseExistingServer: true,
    env: { CONTACT_DRY_RUN: '1' },
    timeout: 120_000,
  },
});
