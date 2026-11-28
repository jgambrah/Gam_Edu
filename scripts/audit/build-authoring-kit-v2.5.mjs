// Builds the cumulative Interactive Lesson Authoring Kit v2.5 from v2.4 plus Step 5E Close-Out & Step 5F Primary Number Manipulatives.
// Nothing from v2.4 is dropped: every v2.4 file is carried forward byte-for-byte unless listed in REPLACE/RENAME below.
// Usage: node scripts/audit/build-authoring-kit-v2.5.mjs <path-to-v2.4.zip> <outDir>
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { zipSync, unzipSync, strToU8 } = require('fflate');

const prevZipPath = process.argv[2] || 'docs/audit/2026-11-29/GAM-EDU-Interactive-Lesson-Authoring-Kit-v2.4.zip';
const outDir = path.resolve(process.argv[3] || 'docs/audit/2026-11-29');
if (!fs.existsSync(prevZipPath)) {
  console.error('Missing previous kit v2.4 zip at:', prevZipPath);
  process.exit(1);
}

const KIT = 'GAM-EDU-Interactive-Lesson-Authoring-Kit-v2.5';
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();
const norm = (n) => path.posix.normalize(n);

// 1. Carry forward every file from v2.4
const prevZip = fs.readFileSync(prevZipPath);
const prev = unzipSync(new Uint8Array(prevZip));
const prevNames = Object.keys(prev).filter((n) => !n.endsWith('/') && n !== 'MANIFEST.json').map(norm);
const out = {};
for (const n of prevNames) out[n] = prev[n];

// 2. Updated files from current repo
const REPLACE = {
  'coordination/GEMINI_DEVELOPMENT_PROGRESS.md': 'docs/GEMINI_DEVELOPMENT_PROGRESS.md',
  'schemas/data-stats-engine.ts': 'src/lib/construction-lab/data-stats-engine.ts',
  'oracle/run-independent-oracle.ts': 'scripts/math-oracle/run-independent-oracle.ts',
  'schemas/interactive-schema.ts': 'src/lib/narrated-lessons/interactive-schema.ts',
  'schemas/construction-schema-validator.ts': 'src/lib/construction-lab/construction-schema-validator.ts',
  'schemas/geometry-schema-validator.ts': 'src/lib/construction-lab/geometry-schema-validator.ts',
  'schemas/geometry-compass.ts': 'src/lib/construction-lab/geometry-compass.ts',
  'schemas/geometry-circle-theorems.ts': 'src/lib/construction-lab/geometry-circle-theorems.ts',
  'schemas/math-eval-engine.ts': 'src/lib/math-evaluator/math-eval-engine.ts',
  'schemas/math-eval-schema-validator.ts': 'src/lib/math-evaluator/math-eval-schema-validator.ts',
  'ui/GeometryConstructorLab.tsx': 'src/components/narrated-lessons/construction/GeometryConstructorLab.tsx',
  'ui/ConstructionLabRouter.tsx': 'src/components/narrated-lessons/construction/ConstructionLabRouter.tsx',
  'ui/NarratedLessonPlayer.tsx': 'src/components/narrated-lessons/NarratedLessonPlayer.tsx',
  'ui/GraphSliderEngine.tsx': 'src/components/narrated-lessons/GraphSliderEngine.tsx',
  'ui/ProcessStepperEngine.tsx': 'src/components/narrated-lessons/ProcessStepperEngine.tsx',
  'ui/EquationBalancerLab.tsx': 'src/components/narrated-lessons/construction/EquationBalancerLab.tsx',
  'ui/MeasurementLab.tsx': 'src/components/narrated-lessons/construction/MeasurementLab.tsx',
};

const modified = [];
for (const [kitPath, repoPath] of Object.entries(REPLACE)) {
  if (!fs.existsSync(repoPath)) continue;
  const buf = fs.readFileSync(repoPath);
  const old = out[kitPath];
  if (!old || sha(Buffer.from(old)) !== sha(buf)) {
    out[kitPath] = new Uint8Array(buf);
    if (old) modified.push(kitPath);
  }
}

// 3. New additions for Step 5E Close-Out & Step 5F Primary Number Manipulatives
const ADD = {
  'schemas/math-eval-linear-systems.ts': 'src/lib/math-evaluator/math-eval-linear-systems.ts',
  'schemas/number-manipulative-engine.ts': 'src/lib/construction-lab/number-manipulative-engine.ts',
  'schemas/number-manipulative-schema-validator.ts': 'src/lib/construction-lab/number-manipulative-schema-validator.ts',
  'schemas/data-stats-schema-validator.ts': 'src/lib/construction-lab/data-stats-schema-validator.ts',
  'ui/NumberManipulativeLab.tsx': 'src/components/narrated-lessons/construction/NumberManipulativeLab.tsx',
  'fixtures/step5f-number-manipulatives-pilot.json': 'public/preview-fixtures/step5f-number-manipulatives-pilot.json',
  'fixtures/step4f-geometry-pilot.json': 'public/preview-fixtures/step4f-geometry-pilot.json',
  'tests/accessibility-standards.test.tsx': 'src/components/narrated-lessons/accessibility-standards.test.tsx',
  'tests/geometry-step5e.test.tsx': 'src/lib/construction-lab/geometry-step5e.test.tsx',
  'tests/simultaneous-linear.test.ts': 'src/lib/math-evaluator/simultaneous-linear.test.ts',
  'tests/number-manipulatives.test.tsx': 'src/lib/construction-lab/number-manipulatives.test.tsx',
  'scripts/build-authoring-kit-v2.5.mjs': 'scripts/audit/build-authoring-kit-v2.5.mjs',
};

for (const [kitPath, repoPath] of Object.entries(ADD)) {
  if (!fs.existsSync(repoPath)) {
    console.warn('skipping missing', repoPath);
    continue;
  }
  const buf = fs.readFileSync(repoPath);
  if (out[kitPath] && sha(Buffer.from(out[kitPath])) !== sha(buf)) {
    modified.push(kitPath);
  }
  out[kitPath] = new Uint8Array(buf);
}

// 4. Rename single-file reference v2.4 -> v2.5 with Step 5E/5F addendum
const prevRef = Buffer.from(prev['CHATGPT-SINGLE-FILE-REFERENCE-v2.4.md']).toString('utf8');
const v25Addendum = `
---

## v2.5 Addendum — Step 5E Close-Out & Step 5F Primary Number Manipulatives (2026-11-28)

### 1. Step 5E-A — Shared Accessibility Improvements (D-038, D-039, D-040, D-042)
- WCAG AA (>=4.5:1) high-contrast primary controls in \`NarratedLessonPlayer.tsx\`, \`GraphSliderEngine.tsx\`, and \`MeasurementLab.tsx\`.
- Explicit \`altText\` on all 13 slides of \`step4f-geometry-pilot.json\` plus non-empty \`alt\` fallback in \`NarratedLessonPlayer.tsx\`.
- Minimum 44px touch targets (\`min-h-[44px]\`) on range sliders and toolbar/preset buttons; 48px primary touch targets in Step 5F.
- Keyboard-focusable scrollable regions (\`tabIndex={0} role="region" aria-label="..."\`) in \`ProcessStepperEngine.tsx\` and \`EquationBalancerLab.tsx\`.

### 2. Step 5E-B — Geometry Educational Close-Out (D-031)
- \`triangle-rhs\` (reflected solutions + compass hypotenuse arc provenance) and \`protractor-angle\` (interactive SVG virtual protractor overlay + Plot Protractor Ray tool) wired into \`CompassWorkbench\` and \`geometry-compass.ts\`.
- Full SVG visualisations in \`CircleTheoremWorkbench\` for \`alternate-segment\`, \`equal-tangents\`, and \`chord-perp-bisector\`.
- Interactive SVG coordinate plane in \`LociRegionWorkbench\` with shaded feasible regions and finite-segment stadium endpoint arcs.
- Congruence & Similarity live readout in \`TransformationsWorkbench\` and Undo + folded face labels in \`CubeNetWorkbench\`.

### 3. Step 5E-C — Exact Linear Simultaneous Equations (D-032) & Positional Quartiles (D-011)
- New \`simultaneous-linear\` mode in \`math-evaluator\` (\`math-eval-linear-systems.ts\`) using exact \`BigRat\` RREF Gaussian elimination for 2×2 and 3×3 systems (unique, no-solution, infinitely-many, substitution/elimination working lines, swapped-variable diagnostics, independent substitution verification).
- 200 new independent oracle cases added to \`run-independent-oracle.ts\` (10,200 executed / 9,448 structurally distinct, 0 discrepancies).
- Explicitly selectable \`'positional-n-plus-1'\` \`(n+1)/4\` quartile convention in \`data-stats-engine.ts\` (preserving default \`'tukey-exclusive'\`).

### 4. Step 5F — Primary Number Manipulatives (\`construction-lab\`, \`labKind: 'number-manipulative'\`, \`engineVersion: '1.7.0'\`, \`productionVersion: '1.3.0'\`)
- 9 CPA modes covering counting/1:1, single & double ten frames, number bonds, base-ten place value with bidirectional canonical/non-canonical regrouping, proportional number lines, multiplication arrays / equal grouping / division with remainders, exact rational fraction bars & decimal place value, authentic Bank of Ghana currency in exact integer pesewas (exact amount / make change / minimum pieces), continuous hour-hand analogue clocks (12h/24h & elapsed time), and repeating/growing patterns.
- 18-slide NaCCA/Cambridge Primary pilot fixture (\`step5f-number-manipulatives-pilot.json\`) and dev-only preview route failing closed in production.
`;

out['CHATGPT-SINGLE-FILE-REFERENCE-v2.5.md'] = strToU8(
  prevRef.replace(
    /^# GAM EDU[^\n]*\n/,
    '# GAM EDU — Interactive Lesson Authoring Reference (v2.5 · Step 5E Close-Out & Step 5F Primary Number Manipulatives)\n',
  ) + v25Addendum,
);
delete out['CHATGPT-SINGLE-FILE-REFERENCE-v2.4.md'];

// 5. Manifest & removal check
const finalNames = Object.keys(out).sort();
const renamed = [{ from: 'CHATGPT-SINGLE-FILE-REFERENCE-v2.4.md', to: 'CHATGPT-SINGLE-FILE-REFERENCE-v2.5.md' }];
const renamedFrom = new Set(renamed.map((r) => r.from));
const unexpectedRemovals = prevNames.filter((n) => !out[n] && !renamedFrom.has(n));
if (unexpectedRemovals.length > 0) {
  console.error('UNEXPECTED REMOVALS vs v2.4:', unexpectedRemovals);
  process.exit(1);
}

const manifest = {
  kitVersion: '2.5',
  generatedAt: new Date().toISOString(),
  previousKitComparison: {
    previousKit: path.basename(prevZipPath),
    previousFileCount: prevNames.length + 1,
    currentFileCount: finalNames.length + 1,
    addedFiles: finalNames.filter((n) => !prevNames.includes(n) && !renamed.some((r) => r.to === n)),
    modifiedFiles: [...new Set(modified)].sort(),
    renamedFiles: renamed,
    unexpectedRemovals,
  },
  files: finalNames.map((n) => ({ path: n, bytes: out[n].length, sha256: sha(Buffer.from(out[n])) })),
};

out['MANIFEST.json'] = strToU8(JSON.stringify(manifest, null, 2));
const zip = zipSync(out, { level: 9 });
fs.mkdirSync(outDir, { recursive: true });
const zipPath = path.join(outDir, `${KIT}.zip`);
fs.writeFileSync(zipPath, zip);
const digest = crypto.createHash('sha256').update(zip).digest('hex');
fs.writeFileSync(path.join(outDir, `${KIT}.zip.sha256`), `${digest}  ${KIT}.zip\n`);

console.log(
  JSON.stringify(
    {
      zip: zipPath,
      previousFiles: prevNames.length + 1,
      files: finalNames.length + 1,
      added: manifest.previousKitComparison.addedFiles.length,
      modified: manifest.previousKitComparison.modifiedFiles.length,
      unexpectedRemovals: 0,
      bytes: zip.length,
      sha256: digest,
    },
    null,
    2,
  ),
);
