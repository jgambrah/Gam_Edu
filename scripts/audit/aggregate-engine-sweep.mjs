// Aggregates test-results/engine-sweep/<project>/*.json (written by engine-sweep.spec.ts) into a summary.
// Usage: node scripts/audit/aggregate-engine-sweep.mjs [outFile.json]
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('audit-output/engine-sweep');
const summary = {};
for (const project of fs.existsSync(root) ? fs.readdirSync(root) : []) {
  const dir = path.join(root, project);
  const recs = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  const byEngine = {};
  const axe = {};
  const ignorable = (e) => /audio|\.mp3|Failed to load resource|net::ERR|favicon|Autoplay|play\(\)|NotAllowedError|cdn\.tailwindcss/i.test(e);
  let notRendered = [], overflow = [], errs = [], below24 = 0, controls = 0;
  for (const r of recs) {
    const key = r.activities[0]?.split('/').slice(0, 2).join('/') ?? 'unknown';
    (byEngine[key] ??= { slides: 0, notRendered: 0, errors: 0, overflow: 0 });
    byEngine[key].slides++;
    if (r.rendered.some((x) => !x)) { byEngine[key].notRendered++; notRendered.push(`${r.fixture}:${r.slide}`); }
    const realErrors = r.errors.filter((e) => !ignorable(e));
    if (realErrors.length) { byEngine[key].errors++; errs.push(`${r.fixture}:${r.slide} ${realErrors[0].slice(0, 110)}`); }
    if (r.metrics.overflowX > 1) { byEngine[key].overflow++; overflow.push(`${r.fixture}:${r.slide} +${r.metrics.overflowX}px`); }
    below24 += r.metrics.below24; controls += r.metrics.controls;
    for (const v of r.violations) { const k = `${v.id}:${v.impact}`; (axe[k] ??= { slides: 0, nodes: 0 }); axe[k].slides++; axe[k].nodes += v.nodes; }
  }
  summary[project] = { slides: recs.length, byEngine, notRendered, overflow, errors: errs.slice(0, 40), controls, controlsBelow24px: below24, axe };
}
const out = process.argv[2];
if (out) fs.writeFileSync(out, JSON.stringify(summary, null, 2));
for (const [p, s] of Object.entries(summary)) {
  console.log(`\n== ${p}: ${s.slides} slides | not rendered ${s.notRendered.length} | overflow>1px ${s.overflow.length} | runtime errors on ${s.errors.length} | controls<24px ${s.controlsBelow24px}/${s.controls}`);
  console.log('   axe:', Object.entries(s.axe).map(([k, v]) => `${k} on ${v.slides} slides`).join('; ') || 'no WCAG A/AA violations');
}
