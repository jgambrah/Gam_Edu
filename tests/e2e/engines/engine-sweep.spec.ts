/**
 * Real-browser sweep of every interactive slide in the 13 preview fixtures (182 activities): renders the real
 * NarratedLessonPlayer + engines, then records console/page errors, whether the activity actually rendered, horizontal
 * overflow, touch-target sizes, automated accessibility (axe WCAG 2 A/AA) and the JavaScript chunks fetched.
 * Rendering is NOT functional verification of the activity; learner workflows are tested in engine-workflows.spec.ts.
 */
import { test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
import path from 'node:path';

const FIXTURES_DIR = path.resolve('public/preview-fixtures');
// NOT under test-results/: Playwright empties that folder at the start of every run, which would erase concurrent results.
const OUT = path.resolve('audit-output/engine-sweep');

type Slide = { id: string; interactive?: any };
const fixtures = fs.readdirSync(FIXTURES_DIR).filter((f) => f.endsWith('.json')).sort();

for (const file of fixtures) {
  const fixture = file.replace(/\.json$/, '');
  const lesson = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, file), 'utf8'));
  for (const slide of (lesson.slides as Slide[]).filter((s) => s.interactive)) {
    const acts: any[] = Array.isArray(slide.interactive) ? slide.interactive : [slide.interactive];
    test(`${fixture} ${slide.id}`, async ({ page }, info) => {
      const errors: string[] = [];
      const jsChunks: string[] = [];
      page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 200)));
      page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)); });
      page.on('request', (r) => { if (/\/dist\/.*\.js$/.test(r.url())) jsChunks.push(path.basename(new URL(r.url()).pathname)); });

      await page.goto(`/?fixture=${fixture}&slide=${slide.id}`);
      await page.waitForFunction(() => (window as any).__ready === true, null, { timeout: 30_000 });
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(1200);

      const rendered: boolean[] = [];
      for (const a of acts) {
        const title = String(a.title ?? '').slice(0, 40);
        rendered.push(title ? await page.getByText(title, { exact: false }).first().isVisible().catch(() => false) : false);
      }
      const metrics = await page.evaluate(() => {
        const vw = window.innerWidth;
        const boxes = [...document.querySelectorAll('button, [role="button"], input, select, a[href], [role="slider"]')]
          .map((e) => (e as HTMLElement).getBoundingClientRect())
          .filter((b) => b.width > 0 && b.height > 0);
        return {
          viewport: [vw, window.innerHeight],
          overflowX: Math.max(0, document.documentElement.scrollWidth - vw),
          controls: boxes.length,
          below24: boxes.filter((b) => Math.min(b.width, b.height) < 24).length,
          below44: boxes.filter((b) => Math.min(b.width, b.height) < 44).length,
        };
      });
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const violations = axe.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length }));

      const record = { project: info.project.name, fixture, slide: slide.id, activities: acts.map((a) => `${a.engine}${a.labKind ? '/' + a.labKind : ''}${a.mode ? '/' + a.mode : ''}${a.chartKind ? '/' + a.chartKind : ''}`), rendered, errors, jsChunks: [...new Set(jsChunks)], metrics, violations };
      fs.mkdirSync(path.join(OUT, info.project.name), { recursive: true });
      fs.writeFileSync(path.join(OUT, info.project.name, `${fixture}__${slide.id}.json`), JSON.stringify(record));
      if (process.env.SHOTS === '1') await page.screenshot({ path: path.join(OUT, info.project.name, `${fixture}__${slide.id}.png`), fullPage: true });
    });
  }
}
