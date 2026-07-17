import { defineConfig, devices } from '@playwright/test';

/**
 * Two modes, one suite:
 *  - Local / verify job: no SMOKE_BASE_URL → Playwright boots `vite preview`
 *    over the built dist/ and tests against it.
 *  - Deploy gates: SMOKE_BASE_URL points at a live environment
 *    (…/fah-thai/test/, …/staging/, or prod) and no server is started.
 *
 * webkit here is engine-level smoke only — Playwright WebKit is not iOS
 * Safari and is never treated as proof of iPhone behavior (ADR-018);
 * real-device checks live in docs/device-tests.md.
 */
const base = process.env.SMOKE_BASE_URL;

export default defineConfig({
  testDir: 'e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : 'list',
  use: {
    baseURL: base ?? 'http://localhost:4173/',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Pixel 7'] } },
    { name: 'webkit', use: { ...devices['iPhone 13'] } },
  ],
  webServer: base
    ? undefined
    : {
        command: 'pnpm preview --port 4173 --strictPort',
        url: 'http://localhost:4173/',
        reuseExistingServer: !process.env.CI,
      },
});
