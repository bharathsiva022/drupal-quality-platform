import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * ------------------------------------------------------------------
 * Environment resolution
 * ------------------------------------------------------------------
 * Cypress style: --env configFile=dev
 * Playwright style: TEST_ENV=dev
 */
const envName = process.env.TEST_ENV || 'dev';

const envPath = path.resolve(
  process.cwd(),
  'config',
  'env',
  `${envName}.json`
);

if (!fs.existsSync(envPath)) {
  throw new Error(`❌ Env file not found: ${envPath}`);
}

const envConfig = JSON.parse(fs.readFileSync(envPath, 'utf-8'));

console.log(`✅ Playwright env loaded: ${envName}`);
console.log(`🌐 Base URL: ${envConfig.baseUrl}`);

/**
 * ------------------------------------------------------------------
 * Playwright configuration
 * ------------------------------------------------------------------
 */
export default defineConfig({
  /**
   * Where Playwright tests live
   */
  testDir: 'playwright/tests',

  /**
   * Test artifacts (screenshots, videos, traces)
   */
  outputDir: 'playwright/test-results',

  /**
   * Reports
   */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright/reports/html', open: 'never' }],
    ['json', { outputFile: 'playwright/reports/results.json' }]
  ],

  /**
   * Shared browser options
   */
  use: {
    baseURL: 'https://chartis:chartis@2026@staging-chartis.specbee.site.staging-5em2ouy-54r75fgxijexy.us-4.platformsh.site',
    // httpCredentials: process.env.SHIELD_USERNAME
    //   ? {
    //     username: process.env.SHIELD_USERNAME,
    //     password: process.env.SHIELD_PASSWORD
    //   }
    //   : undefined,
    actionTimeout: envConfig.timeouts.defaultCommand,
    navigationTimeout: envConfig.timeouts.pageLoad,
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure'
  },

  /**
   * Execution behavior
   */
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  /**
   * Browsers matrix
   */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    }
  ]
});
