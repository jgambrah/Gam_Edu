// Builds the cumulative Interactive Lesson Authoring Kit archive (reproducible; no credentials, UTF-8, POSIX paths).
// Usage: node scripts/audit/build-authoring-kit.mjs <outDir>
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { zipSync, strToU8 } = require('fflate');

const root = process.cwd();
const outDir = path.resolve(process.argv[2] || 'docs/audit/2026-11-28');
const KIT_NAME = 'GAM_EDU_Interactive_Lesson_Authoring_Kit_AUDIT-1';

const includeDirs = [
  ['docs', /\.md$/],
  ['docs/audit/2026-11-28', /\.(md|csv)$/],
  ['src/lib/narrated-lessons', /(interactive-schema|interactive-registry|svg-sanitizer|architecture-boundaries|student-enrichment-release|safeguarding|types)[^/]*\.(ts|tsx)$/],
  ['src/lib/student-enrichment-release.ts', null],
  ['src/lib/construction-lab', /\.(ts|tsx)$/],
  ['src/lib/math-evaluator', /\.(ts|tsx)$/],
  ['src/lib/sort-classify', /\.(ts|tsx)$/],
  ['src/components/narrated-lessons/InteractiveEngineRegistry.tsx', null],
  ['scripts/math-oracle', /\.(ts|json)$/],
  ['scripts/audit', /\.mjs$/],
];

const skip = /node_modules|\.next|\.env|secret|credential|serviceAccount/i;
const files = [];
const walk = (p, re) => {
  const abs = path.join(root, p);
  if (!fs.existsSync(abs)) return;
  const st = fs.statSync(abs);
  if (st.isFile()) { files.push(p.replace(/\\/g, '/')); return; }
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = path.posix.join(p.replace(/\\/g, '/'), e.name);
    if (skip.test(rel)) continue;
    if (e.isDirectory()) { if (p !== 'docs') walk(rel, re); continue; }
    if (!re || re.test(rel)) files.push(rel);
  }
};
for (const [p, re] of includeDirs) walk(p, re);
const unique = [...new Set(files)].sort();

const entries = {};
const manifest = [];
for (const rel of unique) {
  const buf = fs.readFileSync(path.join(root, rel));
  entries[rel] = new Uint8Array(buf);
  manifest.push({ path: rel, bytes: buf.length, sha256: crypto.createHash('sha256').update(buf).digest('hex') });
}

const readme = `# ${KIT_NAME}

Cumulative authoring kit generated from the repository at the audit checkpoint (2026-11-28).

Contents: standards and authoring guides, engine registry + versions, JSON schemas/validators, engine models + UI entry points,
regression/adversarial tests, executable math oracle + its report, security/release-gate sources, curriculum matrix, audit
reports, defect + outstanding-verification registers.

Status notes
- Engine families: code-playground, construction-lab, rule-explorer, graph-slider, process-stepper, diagram-hotspots, math-evaluator, sort-classify.
- Production activation is NOT implied by this kit: see interactive-schema.ts \`productionVersion\` (construction-lab 1.3.0 live vs 1.6.0 engine; sort-classify not activated).
- Student Enrichment remains Under Construction (restricted); deployment requires manual Vercel promotion.
- Earlier kit versions were not available in the repository, so cumulative completeness against them could not be verified.
- Planned but not implemented: Step 5F, 5G, 5H, Step 6.
`;
entries['README_KIT.md'] = strToU8(readme);
entries['MANIFEST.json'] = strToU8(JSON.stringify({ kit: KIT_NAME, generatedFor: 'audit checkpoint 1', fileCount: manifest.length, files: manifest }, null, 2));

const zip = zipSync(entries, { level: 9 });
fs.mkdirSync(outDir, { recursive: true });
const zipPath = path.join(outDir, `${KIT_NAME}.zip`);
fs.writeFileSync(zipPath, zip);
const sha = crypto.createHash('sha256').update(zip).digest('hex');
fs.writeFileSync(path.join(outDir, `${KIT_NAME}.zip.sha256`), `${sha}  ${KIT_NAME}.zip\n`);
console.log(JSON.stringify({ zip: zipPath, files: manifest.length + 2, bytes: zip.length, sha256: sha }, null, 2));
