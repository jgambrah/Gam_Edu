/**
 * Real-browser verification of the virtual measuring instruments (audit D-030). Expected graduations are computed here,
 * independently, from the fixture's physical parameters (true value, least count, pitch, zero error, tare), then compared
 * with the geometry the real SVG actually renders (data attributes and readouts), and learner outcomes are checked in
 * valid AND invalid instrument states. Nine instrument types are covered across slides ml-s01…ml-s15.
 */
import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const fixture = JSON.parse(fs.readFileSync(path.resolve('public/preview-fixtures/step5c-measurement-lab-pilot.json'), 'utf8'));
const act = (id: string) => { const a = fixture.slides.find((s: any) => s.id === id).interactive; return Array.isArray(a) ? a[0] : a; };
const mod = (n: number, m: number) => ((n % m) + m) % m;

async function open(page: Page, id: string) {
  await page.goto(`/?fixture=step5c-measurement-lab-pilot&slide=${id}`);
  await page.waitForFunction(() => (window as any).__ready === true);
  await page.locator('[data-testid^="svg-"], [data-testid="digital-readout"]').first().waitFor();
}
const feedback = async (page: Page) => (await page.locator('[role=status], [role=alert], [aria-live]').allInnerTexts()).join(' | ');
async function submit(page: Page, value: string, unit: string) {
  const val = page.locator('input[id$="-val"]'); const un = page.locator('input[id$="-unit"]');
  await val.fill(value); await un.fill(unit);
  await page.getByRole('button', { name: 'Check Measurement' }).click();
  await page.waitForTimeout(250);
  return feedback(page);
}

test.describe('graduations match independent physical expectations', () => {
  test('vernier (ml-s08): main scale and coinciding division', async ({ page }) => {
    const a = act('ml-s08'); const lc = a.mainScaleStep / a.vernierDivisions;
    const ticks = Math.round(a.trueValue / lc); // 237 tenths
    await open(page, 'ml-s08');
    const g = page.locator('[data-testid="svg-vernier"]');
    expect(Number(await g.getAttribute('data-aligned-div'))).toBe(mod(ticks, a.vernierDivisions)); // 7
    expect(await g.textContent()).toContain(`Main = ${Math.floor(ticks / a.vernierDivisions) * a.mainScaleStep} mm`); // 23 (guided caption)
  });

  test('vernier with +0.2 mm zero error (ml-s10): observed reading is true + zero error', async ({ page }) => {
    const a = act('ml-s10'); const lc = a.mainScaleStep / a.vernierDivisions;
    const observedTicks = Math.round((a.trueValue + a.zeroError) / lc); // 18.6 mm -> 186
    await open(page, 'ml-s10');
    const aligned = Number(await page.locator('[data-testid="svg-vernier"]').getAttribute('data-aligned-div'));
    // either the measuring view (6) or the zero-error inspection view (2 = 0.2/0.1); record which, and require it to be one of them
    expect([mod(observedTicks, a.vernierDivisions), mod(Math.round(a.zeroError / lc), a.vernierDivisions)]).toContain(aligned);
    test.info().annotations.push({ type: 'vernier-zero-error-view', description: `aligned=${aligned}` });
  });

  test('micrometer (ml-s09): thimble division and sleeve reading', async ({ page }) => {
    const a = act('ml-s09'); const lc = a.pitchMm / a.thimbleDivisions; const ticks = Math.round(a.trueValue / lc); // 478
    await open(page, 'ml-s09');
    const g = page.locator('[data-testid="svg-micrometer"]');
    expect(Number(await g.getAttribute('data-thimble-div'))).toBe(mod(ticks, a.thimbleDivisions)); // 28
    expect(await g.textContent()).toContain(`Sleeve = ${Math.floor(ticks / a.thimbleDivisions) * a.pitchMm} mm`); // 4.5 (guided caption)
  });

  test('micrometer with NEGATIVE zero error (ml-s11): closed-jaw reading wraps around the thimble (-0.03 mm = division 47, not 0)', async ({ page }) => {
    const a = act('ml-s11'); const lc = a.pitchMm / a.thimbleDivisions;
    await open(page, 'ml-s11');
    await page.getByRole('button', { name: /Check Zero Error/ }).click();
    await page.waitForTimeout(300);
    const g = page.locator('[data-testid="svg-micrometer"]');
    expect(Number(await g.getAttribute('data-thimble-div'))).toBe(mod(Math.round(a.zeroError / lc), a.thimbleDivisions)); // -3 -> 47
  });

  test('balance (ml-s05): reading before tare = true mass + container offset; tare removes it', async ({ page }) => {
    const a = act('ml-s05');
    await open(page, 'ml-s05');
    const ro = page.locator('[data-testid="digital-readout"]');
    expect(parseFloat((await ro.innerText()))).toBeCloseTo(a.trueValue + a.initialTareOffset, 1); // 179.8
    await page.getByRole('button', { name: /Tare/ }).click();
    expect(parseFloat((await ro.innerText()))).toBeCloseTo(a.trueValue, 1); // 145.6
  });

  test('analogue ammeter (ml-s12): needle sits further along the scale on the smaller range (deg = 180 - 180*value/range)', async ({ page }) => {
    const a = act('ml-s12');
    await open(page, 'ml-s12');
    const deg = async () => Number(await page.locator('[data-testid="svg-meter"]').getAttribute('data-needle-deg'));
    await page.getByRole('button', { name: '0–0.6 A' }).click(); const small = await deg();
    await page.getByRole('button', { name: '0–3 A' }).click(); const large = await deg();
    // the needle sweeps from 180 deg (zero) down to 0 deg (full scale): a SMALLER angle means further along the scale
    expect(small).toBeLessThan(large);
    expect(small).toBeCloseTo(180 - (180 * a.trueValue) / 0.6, 0);
    expect(large).toBeCloseTo(180 - (180 * a.trueValue) / 3, 0);
  });

  test('measuring cylinder (ml-s03): apparent meniscus equals the physical one only when the eye is level', async ({ page }) => {
    await open(page, 'ml-s03');
    const g = page.locator('[data-testid="svg-cylinder"]');
    const eye = page.locator('input[id$="-eye"]');
    const y = async () => ({ phys: Number(await g.getAttribute('data-phys-y')), app: Number(await g.getAttribute('data-app-y')) });
    await eye.fill('0'); const level = await y();
    expect(level.app).toBeCloseTo(level.phys, 2);
    await eye.fill('20'); const hi = await y();
    await eye.fill('-20'); const lo = await y();
    expect(Math.abs(hi.app - hi.phys)).toBeGreaterThan(0.01);
    expect(hi.phys).toBeCloseTo(level.phys, 2); // the liquid itself does not move
    expect(Math.sign(hi.app - hi.phys)).toBe(-Math.sign(lo.app - lo.phys)); // opposite eye positions displace in opposite directions
  });
});

test.describe('state-aware grading: a correct number from an invalid instrument state is not a correct practical result', () => {
  test('cylinder (ml-s03): true value with the eye off-level is refused; level eye accepted', async ({ page }) => {
    const a = act('ml-s03');
    await open(page, 'ml-s03');
    const eye = page.locator('input[id$="-eye"]');
    await eye.fill('15'); // fixture starts at 15 degrees
    const bad = await submit(page, String(a.trueValue), a.unit);
    expect(bad).not.toMatch(/Verified/i);
    test.info().annotations.push({ type: 'off-level-feedback', description: bad.slice(0, 160) });
    await eye.fill('0');
    const good = await submit(page, String(a.trueValue), a.unit);
    expect(good).toMatch(/Verified/i);
  });

  test('balance (ml-s05): the true mass is refused until the container is tared, then accepted', async ({ page }) => {
    const a = act('ml-s05');
    await open(page, 'ml-s05');
    const bad = await submit(page, String(a.trueValue), a.unit);
    expect(bad).not.toMatch(/Verified/i);
    await page.getByRole('button', { name: /Tare/ }).click();
    const good = await submit(page, String(a.trueValue), a.unit);
    expect(good).toMatch(/Verified/i);
  });

  test('micrometer with zero error (ml-s11): the raw reading is refused, the corrected value accepted', async ({ page }) => {
    const a = act('ml-s11');
    await open(page, 'ml-s11');
    const raw = await submit(page, String(+(a.trueValue + a.zeroError).toFixed(3)), a.unit);
    expect(raw).not.toMatch(/Verified/i);
    const good = await submit(page, String(a.trueValue), a.unit);
    expect(good).toMatch(/Verified/i);
  });

  test('wrong unit and wrong quantity are refused (vernier ml-s08)', async ({ page }) => {
    const a = act('ml-s08');
    await open(page, 'ml-s08');
    expect(await submit(page, String(a.trueValue), 'N')).not.toMatch(/Verified/i);
    expect(await submit(page, String(a.trueValue + 1), a.unit)).not.toMatch(/Verified/i);
    expect(await submit(page, String(a.trueValue), a.unit)).toMatch(/Verified/i);
  });
});

test.describe('all nine instrument types render a graduated scale', () => {
  const expected: Record<string, string> = { 'ml-s01': 'ruler', 'ml-s02': 'thermometer', 'ml-s03': 'cylinder', 'ml-s05': 'digital-readout', 'ml-s07': 'digital-readout', 'ml-s08': 'vernier', 'ml-s09': 'micrometer', 'ml-s12': 'meter', 'ml-s13': 'meter' };
  for (const [id, kind] of Object.entries(expected)) {
    test(`${act(id).instrument} (${id}) renders its instrument graphic`, async ({ page }) => {
      await open(page, id);
      const sel = kind === 'digital-readout' ? '[data-testid="digital-readout"]' : `[data-testid="svg-${kind}"]`;
      await expect(page.locator(sel).first()).toBeVisible();
      if (kind !== 'digital-readout') {
        const box = await page.locator(sel).first().boundingBox();
        expect(box!.width).toBeGreaterThan(100);
      }
    });
  }
});
