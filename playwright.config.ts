import { defineConfig } from '@playwright/test';
import enDesktopChrome from './configs/projects/en-desktop-chrome.config';
import frDesktopChrome from './configs/projects/fr-desktop-chrome.config';

/**
 * See https://playwright.dev/docs/test-configuration.
 *
 * Language, device, and browser are each a Playwright project (see
 * configs/projects/) rather than an env var — `npx playwright test` runs
 * every project (both languages); `--project=fr-desktop-chrome` runs one.
 * Target environment (QA/dev/staging) is still an env var: each project
 * config reads `BASE_URL`, e.g.
 * `BASE_URL=https://app.dev.nesto.ca npx playwright test --project=en-desktop-chrome`.
 */
export default defineConfig({
  testDir: './tests/specs',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html'], ['list']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  timeout: 15000,
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    /* Capture a screenshot and video only for failed tests. */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: !!process.env.CI,
  },

  /* One project per language-device-browser combination, see configs/projects/. */
  projects: [enDesktopChrome, frDesktopChrome],

  globalSetup: require.resolve('./tests/helpers/global-setup.ts'),
  globalTeardown: require.resolve('./tests/helpers/global-teardown.ts'),

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
