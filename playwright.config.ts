// Development-only browser verification (audit). Not part of the production bundle: @playwright/test is a devDependency
// and nothing in src/ imports it. Run: `npx playwright install chromium firefox webkit` once, then `npm run e2e`.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 180_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1, // the synthetic attacker log is shared, so tests run one at a time
  reporter: [['list'], ['json', { outputFile: 'test-results/e2e-results.json' }]],
  use: { baseURL: 'http://localhost:4173', trace: 'off', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }, // WebKit engine automation, NOT real Safari
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } }, // emulation, not a real device
    { name: 'mobile-webkit', use: { ...devices['iPhone 13'] } }, // emulation, not a real device
  ],
  webServer: {
    command: 'node scripts/audit/python-sandbox-harness/serve.mjs',
    url: 'http://localhost:4173/',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
