// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Test Automation Configuration
 * Target Application: Practice Software Testing (Toolshop Demo)
 * URL: https://practicesoftwaretesting.com
 */
module.exports = defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for */
  timeout: 30 * 1000,
  expect: {
    /* Maximum time expect() should wait for the condition to be met */
    timeout: 7000
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only or 1 retry on local */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI if needed */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ],
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://practicesoftwaretesting.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
    navigationTimeout: 15000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
