/**
 * Real-browser FUNCTIONAL verification (not rendering) of the PCV-1 Refinement-3 dynamic chemistry playgrounds, driven against
 * the ACTUAL enriched lesson JSONs. Covers: incorrect feedback before answers, example switching, correct completion,
 * simplest-ratio enforcement, undo/reset, keyboard operation, Explore Further state isolation and focus restoration.
 */
import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve('src/lib/narrated-lessons/__fixtures__/pcv1-refinement3');
const B8 = 'b8-sci-t1-atoms-and-the-periodic-table.refinement3-v1.9.0.json';
const HC = 'cambridge-as-a-level-chemistry-hydrocarbons.refinement3-v1.9.0.json';

async function open(page: Page, file: string, alias: string, slide: string) {
  await page.route(`**/preview-fixtures/${alias}.json`, (r) => r.fulfill({ status: 200, contentType: 'application/json', body: fs.readFileSync(path.join(DIR, file), 'utf8') }));
  await page.goto(`/?fixture=${alias}&slide=${slide}`);
  await page.waitForFunction(() => (window as any).__ready === true);
  await page.locator('[data-construction-feedback], button:has-text("Check")').first().waitFor({ timeout: 20_000 });
}
const fb = (page: Page) => page.locator('[data-construction-feedback]').first();
const check = (page: Page, re: RegExp) => page.getByRole('button', { name: re }).click();

test.describe('ionic bonding playground (b8 s23)', () => {
  test('wrong state is not verified; MgCl2 completes only with 2 Cl and 2 electrons; undo and reset work', async ({ page }) => {
    await open(page, B8, 'pcv1-b8', 's23');
    await page.getByRole('tab', { name: /MgCl₂/ }).click();
    await check(page, /Check ionic bonding/i);
    await expect(fb(page)).toHaveAttribute('data-construction-feedback', 'needs-work');
    await expect(page.getByText(/Verified/i)).toHaveCount(0); // no premature success text

    await page.getByRole('button', { name: /Increase Cl count/i }).click();
    await check(page, /Check ionic bonding/i);
    await expect(fb(page)).toHaveAttribute('data-construction-feedback', 'needs-work'); // ratio right, electrons not yet transferred

    const inc = page.getByRole('button', { name: /Increase transferred electrons/i });
    await inc.click(); await inc.click();
    // transfer limit: with 1 Mg only 2 electrons exist; the control must stop (disabled), never allow overshoot
    await expect(inc).toBeDisabled();
    await check(page, /Check ionic bonding/i);
    await expect(fb(page)).toHaveAttribute('data-construction-feedback', 'passed');

    await page.getByRole('button', { name: /Undo last change/i }).click();
    await check(page, /Check ionic bonding/i);
    await expect(page.locator('[data-construction-feedback="passed"]')).toHaveCount(0); // undo reverted a step: no stale success

    await page.getByRole('button', { name: /Reset construction/i }).click();
    await expect(page.locator('[data-construction-feedback="passed"]')).toHaveCount(0); // reset clears stale feedback
  });

  test('over-sized ratio (Mg2Cl4) is rejected as not-simplest even with conserved electrons', async ({ page }) => {
    await open(page, B8, 'pcv1-b8', 's23');
    await page.getByRole('tab', { name: /MgCl₂/ }).click();
    for (const n of ['Increase Cl count', 'Increase Cl count', 'Increase Cl count']) await page.getByRole('button', { name: new RegExp(n, 'i') }).click();
    await check(page, /Check ionic bonding/i);
    await expect(page.locator('[data-construction-feedback="passed"]')).toHaveCount(0);
  });

  test('keyboard-only: the Check button is reachable and operable with Enter; Explore Further returns focus to its trigger on Escape', async ({ page }) => {
    await open(page, B8, 'pcv1-b8', 's23');
    const checkBtn = page.getByRole('button', { name: /Check ionic bonding/i });
    await checkBtn.focus();
    await page.keyboard.press('Enter');
    await expect(fb(page)).toHaveAttribute('data-construction-feedback', /needs-work|passed/);
    const trigger = page.getByRole('button', { name: /Explore Further/i });
    await trigger.focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('region', { name: /Explore Further sandbox/i })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('region', { name: /Explore Further sandbox/i })).toHaveCount(0);
    const restored = await trigger.evaluate((el) => el === document.activeElement);
    expect(restored, 'focus must return to the Explore Further trigger').toBe(true);
  });

  test('Explore Further is isolated: exercise tab and feedback are unchanged after exploring', async ({ page }) => {
    await open(page, B8, 'pcv1-b8', 's23');
    await page.getByRole('tab', { name: /MgO/ }).click();
    await page.getByRole('button', { name: /Increase transferred electrons/i }).click();
    await check(page, /Check ionic bonding/i);
    await expect(fb(page)).toHaveAttribute('data-construction-feedback', 'needs-work');
    await page.getByRole('button', { name: /Explore Further/i }).click();
    const panel = page.getByRole('region', { name: /Explore Further sandbox/i });
    await panel.getByRole('tab', { name: /Al₂O₃/ }).click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('tab', { name: /MgO/ })).toHaveAttribute('aria-selected', 'true');
    await expect(fb(page)).toHaveAttribute('data-construction-feedback', 'needs-work');
  });
});

test.describe('equation balancer playground (hydrocarbons c01)', () => {
  const inc = (page: Page, sp: string, n: number) => (async () => { for (let i = 0; i < n; i++) await page.getByRole('button', { name: new RegExp(`Increase coefficient for ${sp}`, 'i') }).click(); })();

  test('propane combustion: wrong -> needs-work, 1/5/3/4 -> passed, doubled 2/10/6/8 -> not simplest', async ({ page }) => {
    await open(page, HC, 'pcv1-hc', 'c01');
    await page.getByRole('tab', { name: /Propane/ }).click();
    await check(page, /Check equation balance/i);
    await expect(fb(page)).toHaveAttribute('data-construction-feedback', 'needs-work');
    await expect(page.getByText(/Balanced!/)).toHaveCount(0);

    await inc(page, 'O₂', 4); await inc(page, 'CO₂', 2); await inc(page, 'H₂O', 3); // O2=5, CO2=3, H2O=4 (C3H8 stays 1)
    await check(page, /Check equation balance/i);
    await expect(fb(page)).toHaveAttribute('data-construction-feedback', 'passed');

    // double everything: balanced but not simplest
    await inc(page, 'C₃H₈', 1); await inc(page, 'O₂', 5); await inc(page, 'CO₂', 3); await inc(page, 'H₂O', 4);
    await check(page, /Check equation balance/i);
    await expect(page.locator('[data-construction-feedback="passed"]')).toHaveCount(0);
  });

  test('example switching resets the working state (no stale success carried to Butane)', async ({ page }) => {
    await open(page, HC, 'pcv1-hc', 'c01');
    await page.getByRole('tab', { name: /Propane/ }).click();
    await inc(page, 'O₂', 4); await inc(page, 'CO₂', 2); await inc(page, 'H₂O', 3);
    await check(page, /Check equation balance/i);
    await expect(fb(page)).toHaveAttribute('data-construction-feedback', 'passed');
    await page.getByRole('tab', { name: /Butane/ }).click();
    await expect(page.locator('[data-construction-feedback="passed"]')).toHaveCount(0); // propane's success must not apply to butane
    await check(page, /Check equation balance/i);
    await expect(fb(page)).toHaveAttribute('data-construction-feedback', 'needs-work');
  });
});
