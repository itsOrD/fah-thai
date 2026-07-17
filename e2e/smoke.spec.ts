import { expect, test } from '@playwright/test';

/**
 * Smoke suite — runs identically against a local preview and every deployed
 * environment. EXPECT_INSTALLABLE=0 flips the installability assertions for
 * test/staging, which deliberately ship without a manifest (ADR-018).
 */
const expectInstallable = process.env.EXPECT_INSTALLABLE !== '0';

test('shell loads with the neon tab bar', async ({ page }) => {
  await page.goto('');
  await expect(page).toHaveTitle(/Fah/);
  const nav = page.getByRole('navigation', { name: 'Main' });
  await expect(nav).toBeVisible();
  await expect(nav.getByRole('button')).toHaveCount(4);
});

test('tab navigation routes and updates the hash', async ({ page }) => {
  await page.goto('');
  await page.getByRole('button', { name: /Practice/ }).click();
  await expect(page).toHaveURL(/#\/practice$/);
  await expect(page.getByRole('heading', { name: 'Practice' })).toBeVisible();

  await page.getByRole('button', { name: /Fah/ }).click();
  await expect(page).toHaveURL(/#\/fah$/);
  await expect(page.getByRole('heading', { name: 'Fah' })).toBeVisible();
});

test('deep links resolve directly', async ({ page }) => {
  await page.goto('#/tone');
  await expect(page.getByRole('heading', { name: 'Tone Studio' })).toBeVisible();
});

test('unknown routes fall back to Today', async ({ page }) => {
  await page.goto('#/not-a-real-route');
  await expect(page.getByRole('heading', { name: 'Today' })).toBeVisible();
});

test('sound lab loads the pack and opens a phoneme detail', async ({ page }) => {
  await page.goto('#/sounds');
  await expect(page.getByRole('heading', { name: 'Sound Lab' })).toBeVisible();
  await page.getByRole('button', { name: /^ป\s/ }).click();
  await expect(page.getByText('The trap:', { exact: false })).toBeVisible();
  await expect(page.locator('figure svg').first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'EN ghost' })).toBeVisible();
});

test('device lab renders and runs a non-interactive probe', async ({ page }) => {
  await page.goto('#/lab');
  await expect(page.getByRole('heading', { name: 'Device Lab' })).toBeVisible();
  await page.getByRole('button', { name: /Environment/ }).click();
  await expect(page.locator('pre').first()).toContainText('ua:');
});

test('version stamp is served', async ({ request, baseURL }) => {
  const res = await request.get(new URL('version.json', baseURL).href);
  expect(res.status()).toBe(200);
  const body = (await res.json()) as { sha: string };
  expect(body.sha).toBeTruthy();
});

test(`installability assets are ${expectInstallable ? 'present' : 'absent (non-prod)'}`, async ({
  request,
  baseURL,
}) => {
  const manifest = await request.get(new URL('manifest.webmanifest', baseURL).href);
  if (expectInstallable) {
    expect(manifest.status()).toBe(200);
    const sw = await request.get(new URL('sw.js', baseURL).href);
    expect(sw.status()).toBe(200);
  } else {
    expect(manifest.status()).toBe(404);
  }
});
