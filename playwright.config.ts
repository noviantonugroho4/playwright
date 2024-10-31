import { defineConfig, devices } from '@playwright/test';
import * as dotenv from "dotenv";
dotenv.config({path: '.env'});

export default defineConfig({
  timeout: 60000, 
  testDir: './tests',
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless: process.env.HEADLESS == 'true',
    video: 'retain-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
});
