// Development-only engine verification in real browsers (audit checkpoint 3). Renders the REAL NarratedLessonPlayer and
// engines from public/preview-fixtures through a small esbuild harness (tests/e2e/harness). It does not exercise Next.js
// routing, middleware or the release gate. Run: `npx playwright test -c playwright.engines.config.ts`.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e/engines',
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  workers: 3,
  reporter: [['list'], ['json', { outputFile: 'test-results/engines-results.json' }]],
  use: { baseURL: 'http://localhost:4180', trace: 'off' },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'mobile-360', use: { ...devices['Pixel 7'], viewport: { width: 360, height: 740 } } }, // emulation, not a device
    { name: 'mobile-landscape', use: { ...devices['Pixel 7 landscape'] } },
    { name: 'tablet', use: { ...devices['iPad (gen 7)'], browserName: 'chromium' } },
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox-desktop', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'node tests/e2e/harness/serve.mjs',
    url: 'http://localhost:4180/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
