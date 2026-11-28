// Builds the cumulative Interactive Lesson Authoring Kit v2.4 from the previous kit (v2.3) plus the audit additions.
// Nothing from v2.3 is dropped: every v2.3 file is carried forward byte-for-byte unless it is listed in REPLACE/RENAME
// below, and the manifest records added / modified / renamed files and verifies there are no unexpected removals.
// Usage: node scripts/audit/build-authoring-kit-v2.4.mjs <path-to-v2.3.zip> <outDir>
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { zipSync, unzipSync, strToU8 } = require('fflate');

const prevZipPath = process.argv[2];
const outDir = path.resolve(process.argv[3] || 'docs/audit/2026-11-29');
if (!prevZipPath || !fs.existsSync(prevZipPath)) { console.error('Provide the path to the previous kit (v2.3 zip).'); process.exit(1); }

const KIT = 'GAM-EDU-Interactive-Lesson-Authoring-Kit-v2.4';
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
const norm = (n) => path.posix.normalize(n);

// 1. previous kit, carried forward
const prevZip = fs.readFileSync(prevZipPath);
const prev = unzipSync(new Uint8Array(prevZip));
const prevNames = Object.keys(prev).filter((n) => !n.endsWith('/') && n !== 'MANIFEST.json').map(norm);
const out = {};
for (const n of prevNames) out[n] = prev[n];

// 2. files whose current repository version replaces the kit copy (kit path -> repo path)
const REPLACE = {
  'AGENTS.md': 'AGENTS.md',
  'STUDENT_ENRICHMENT_STANDARD.md': 'docs/STUDENT_ENRICHMENT_STANDARD.md',
  'INTERACTIVE_LESSON_AUTHORING_GUIDE.md': 'docs/INTERACTIVE_LESSON_AUTHORING_GUIDE.md',
  'MATH_CURRICULUM_CAPABILITY_MATRIX.md': 'docs/MATH_CURRICULUM_CAPABILITY_MATRIX.md',
  'STEP_5H_CREATIVE_COMPUTATIONAL_AUDIT.md': 'docs/STEP_5H_CREATIVE_COMPUTATIONAL_AUDIT.md',
  'schemas/data-stats-engine.ts': 'src/lib/construction-lab/data-stats-engine.ts',
  'ui/DataStatsLab.tsx': 'src/components/narrated-lessons/construction/DataStatsLab.tsx',
  'oracle/run-independent-oracle.ts': 'scripts/math-oracle/run-independent-oracle.ts',
  'oracle/step5a3-oracle-report.json': 'scripts/math-oracle/step5a3-oracle-report.json',
  'security/student-enrichment-release.ts': 'src/lib/student-enrichment-release.ts',
  'schemas/svg-sanitizer.ts': 'src/lib/narrated-lessons/svg-sanitizer.ts',
};
const modified = [];
for (const [kitPath, repoPath] of Object.entries(REPLACE)) {
  if (!fs.existsSync(repoPath)) continue;
  const buf = fs.readFileSync(repoPath);
  const old = out[kitPath];
  if (!old || sha(Buffer.from(old)) !== sha(buf)) { out[kitPath] = new Uint8Array(buf); modified.push(kitPath); }
}

// 3. additions (new files)
const ADD = {
  // execution security and server authorisation
  'security/python-runner.ts': 'src/lib/python-runner.ts',
  'security/pseudocode-runner.ts': 'src/lib/pseudocode-runner.ts',
  'security/ask-teacher-guard.ts': 'src/lib/ask-teacher-guard.ts',
  'security/ask-route.ts': 'src/app/api/narrated-lessons/ask/route.ts',
  'security/clubs-hub-page.tsx': 'src/app/dashboard/clubs/page.tsx',
  'security/foundation-verification.yml': '.github/workflows/foundation-verification.yml',
  'security/python-sandbox-harness/README.md': 'scripts/audit/python-sandbox-harness/README.md',
  'security/python-sandbox-harness/server.js': 'scripts/audit/python-sandbox-harness/server.js',
  'security/python-sandbox-harness/sandbox.html': 'scripts/audit/python-sandbox-harness/sandbox.html',
  'security/python-sandbox-harness/current.html': 'scripts/audit/python-sandbox-harness/current.html',
  'security/python-sandbox-harness/functional.html': 'scripts/audit/python-sandbox-harness/functional.html',
  'security/firestore-rules-ask-usage.test.ts': 'tests/rules/ask-teacher-usage.firestore.rules.test.ts',
  // independent verification tests
  'tests/math-adversarial.test.ts': 'src/lib/math-evaluator/math-adversarial.test.ts',
  'tests/cube-net-independent.test.ts': 'src/lib/construction-lab/cube-net-independent.test.ts',
  'tests/data-stats-independent.test.ts': 'src/lib/construction-lab/data-stats-independent.test.ts',
  'tests/data-stats-rendering-audit.test.tsx': 'src/lib/construction-lab/data-stats-rendering-audit.test.tsx',
  'tests/chemistry-biology-independent.test.ts': 'src/lib/construction-lab/chemistry-biology-independent.test.ts',
  'tests/dc-circuit-independent.test.ts': 'src/lib/construction-lab/dc-circuit-independent.test.ts',
  'tests/svg-sanitizer-adversarial.test.ts': 'src/lib/narrated-lessons/svg-sanitizer-adversarial.test.ts',
  'tests/python-runner.sandbox.test.ts': 'src/lib/python-runner.sandbox.test.ts',
  'tests/execution-adversarial.test.ts': 'src/lib/execution-adversarial.test.ts',
  'tests/ask-teacher-guard.test.ts': 'src/lib/ask-teacher-guard.test.ts',
  'tests/ask-route.test.ts': 'src/app/api/narrated-lessons/ask/route.test.ts',
  'tests/clubs-hub.test.tsx': 'src/app/dashboard/clubs/clubs-hub.test.tsx',
  'tests/safeguarding.test.ts': 'src/lib/narrated-lessons/safeguarding.test.ts',
  // scripts and baselines
  'scripts/check-lockfile-sync.mjs': 'scripts/audit/check-lockfile-sync.mjs',
  'scripts/tsc-report.mjs': 'scripts/audit/tsc-report.mjs',
  'scripts/tsc-baseline.json': 'docs/tsc-baseline.json',
  'scripts/build-authoring-kit-v2.4.mjs': 'scripts/audit/build-authoring-kit-v2.4.mjs',
  'scripts/build-consolidated-register.mjs': 'scripts/audit/build-consolidated-register.mjs',
  // permanent coordination documents (required in every cumulative kit)
  'coordination/AGENT_COORDINATION_PROTOCOL.md': 'docs/AGENT_COORDINATION_PROTOCOL.md',
  'coordination/GEMINI_DEVELOPMENT_ROADMAP.md': 'docs/GEMINI_DEVELOPMENT_ROADMAP.md',
  'coordination/GEMINI_DEVELOPMENT_PROGRESS.md': 'docs/GEMINI_DEVELOPMENT_PROGRESS.md',
  'coordination/CLAUDE_AUDIT_ROADMAP.md': 'docs/CLAUDE_AUDIT_ROADMAP.md',
  'coordination/CLAUDE_AUDIT_PROGRESS.md': 'docs/CLAUDE_AUDIT_PROGRESS.md',
  'coordination/CONSOLIDATED_DEFECT_REGISTER.csv': 'docs/CONSOLIDATED_DEFECT_REGISTER.csv',
  'coordination/FOUNDATION_MASTER_STATUS.md': 'docs/FOUNDATION_MASTER_STATUS.md',
};
const added = [];
for (const [kitPath, repoPath] of Object.entries(ADD)) {
  if (!fs.existsSync(repoPath)) { console.warn('skipping missing', repoPath); continue; }
  out[kitPath] = new Uint8Array(fs.readFileSync(repoPath));
  added.push(kitPath);
}
// audit reports of both checkpoints
for (const dir of ['docs/audit/2026-11-28', 'docs/audit/2026-11-29']) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!/\.(md|csv|json)$/.test(f) || /Authoring-Kit|Authoring_Kit/.test(f)) continue;
    const kitPath = `audit/${path.basename(dir)}/${f}`;
    out[kitPath] = new Uint8Array(fs.readFileSync(path.join(dir, f)));
    added.push(kitPath);
  }
}

// 4. documents regenerated for v2.4
const regenerated = ['README.md', 'OUTSTANDING_VERIFICATION_REGISTER.md', `CHATGPT-SINGLE-FILE-REFERENCE-v2.4.md`];
const readFileIf = (p) => (fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '');
out['README.md'] = strToU8(readFileIf('docs/audit/2026-11-29/KIT_V2.4_README.md'));
out['OUTSTANDING_VERIFICATION_REGISTER.md'] = strToU8(readFileIf('docs/audit/2026-11-29/OUTSTANDING_VERIFICATION_REGISTER.md'));
const prevRef = Buffer.from(prev['CHATGPT-SINGLE-FILE-REFERENCE-v2.3.md']).toString('utf8');
const addendum = readFileIf('docs/audit/2026-11-29/KIT_V2.4_REFERENCE_ADDENDUM.md');
out['CHATGPT-SINGLE-FILE-REFERENCE-v2.4.md'] = strToU8(
  prevRef.replace(/^# GAM EDU[^\n]*\n/, '# GAM EDU — Interactive Lesson Authoring Reference (v2.4 · Independent Audit Checkpoints 1–2 applied)\n') + '\n' + addendum + '\n',
);
delete out['CHATGPT-SINGLE-FILE-REFERENCE-v2.3.md']; // renamed, not removed

// 5. manifest with removal check
const finalNames = Object.keys(out).sort();
const renamed = [{ from: 'CHATGPT-SINGLE-FILE-REFERENCE-v2.3.md', to: 'CHATGPT-SINGLE-FILE-REFERENCE-v2.4.md' }];
const renamedFrom = new Set(renamed.map((r) => r.from));
const unexpectedRemovals = prevNames.filter((n) => !out[n] && !renamedFrom.has(n));
const manifest = {
  kitVersion: '2.4',
  generatedAt: new Date().toISOString(),
  previousKitComparison: {
    previousKit: path.basename(prevZipPath),
    previousFileCount: prevNames.length + 1, // + MANIFEST.json
    currentFileCount: finalNames.length + 1,
    addedFiles: finalNames.filter((n) => !prevNames.includes(n) && !renamed.some((r) => r.to === n)),
    modifiedFiles: [...new Set([...modified, 'README.md', 'OUTSTANDING_VERIFICATION_REGISTER.md'])].sort(),
    renamedFiles: renamed,
    unexpectedRemovals,
  },
  files: finalNames.map((n) => ({ path: n, bytes: out[n].length, sha256: sha(Buffer.from(out[n])) })),
};
if (unexpectedRemovals.length) { console.error('UNEXPECTED REMOVALS vs previous kit:', unexpectedRemovals); process.exit(1); }
out['MANIFEST.json'] = strToU8(JSON.stringify(manifest, null, 2));

const zip = zipSync(out, { level: 9 });
fs.mkdirSync(outDir, { recursive: true });
const zipPath = path.join(outDir, `${KIT}.zip`);
fs.writeFileSync(zipPath, zip);
const digest = crypto.createHash('sha256').update(zip).digest('hex');
fs.writeFileSync(path.join(outDir, `${KIT}.zip.sha256`), `${digest}  ${KIT}.zip\n`);
console.log(JSON.stringify({ zip: zipPath, previousFiles: prevNames.length + 1, files: finalNames.length + 1, added: manifest.previousKitComparison.addedFiles.length, modified: manifest.previousKitComparison.modifiedFiles.length, unexpectedRemovals: 0, bytes: zip.length, sha256: digest }, null, 2));
