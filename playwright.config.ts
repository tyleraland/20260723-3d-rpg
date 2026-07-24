import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: true
  },
  projects: [
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] }
    }
  ]
});
