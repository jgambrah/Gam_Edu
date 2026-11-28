/**
 * Diagnostic (audit CP3): lists the actual elements behind axe color-contrast / aria-prohibited-attr findings so defects are
 * reproduced precisely (selector, computed colours, contrast ratio) instead of only counted. Writes audit-output/axe-detail.json.
 */
import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const FIXTURES_DIR = path.resolve('public/preview-fixtures');
const OUT = path.resolve('audit-output');
const sample: Array<[string, string]> = [];
for (const f of fs.readdirSync(FIXTURES_DIR).filter((x) => x.endsWith('.json')).sort()) {
  const lesson = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, f), 'utf8'));
  const slides = (lesson.slides as any[]).filter((s) => s.interactive);
  for (const s of slides.slice(0, 2)) sample.push([f.replace(/\.json$/, ''), s.id]);
}

const found: Record<string, { rule: string; count: number; examples: any[] }> = {};

test('collect axe node detail', async ({ page }) => {
  test.setTimeout(600_000);
  for (const [fixture, slide] of sample) {
    await page.goto(`/?fixture=${fixture}&slide=${slide}`);
    await page.waitForFunction(() => (window as any).__ready === true, null, { timeout: 30_000 });
    await page.waitForTimeout(800);
    const res = await new AxeBuilder({ page }).withRules(['color-contrast', 'aria-prohibited-attr']).analyze();
    for (const v of res.violations) {
      for (const n of v.nodes) {
        const d: any = (n.any[0]?.data) ?? {};
        const key = `${v.id}|${(n.target as string[]).join(' ').replace(/\[id="[^"]*"\]|#[\w-]+/g, '#id').slice(0, 80)}|${d.fgColor ?? ''}|${d.bgColor ?? ''}`;
        const e = (found[key] ??= { rule: v.id, count: 0, examples: [] });
        e.count++;
        if (e.examples.length < 1) e.examples.push({ where: `${fixture}:${slide}`, html: n.html.slice(0, 160), fg: d.fgColor, bg: d.bgColor, ratio: d.contrastRatio, expected: d.expectedContrastRatio, size: d.fontSize, msg: (n.any[0]?.message ?? n.failureSummary ?? '').slice(0, 160) });
      }
    }
  }
  fs.mkdirSync(OUT, { recursive: true });
  const rows = Object.entries(found).map(([k, v]) => ({ key: k, ...v })).sort((a, b) => b.count - a.count);
  fs.writeFileSync(path.join(OUT, 'axe-detail.json'), JSON.stringify(rows, null, 1));
});
