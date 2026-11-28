// Packages GAM-EDU-PCV1-Refinement2-Dynamic-Playgrounds.zip with all 14 required Refinement 2 deliverables
// and copies it straight to C:\Users\DELL\Downloads\.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { zipSync, strToU8 } = require('fflate');

const REPO = process.cwd();
const WORK = 'C:/Users/DELL/.gemini/antigravity/brain/c229576f-28ea-43b0-b4c2-466e9ffcd1e3/scratch/pcv1-impl';
const OUT_DIR = path.resolve(REPO, 'docs/audit/2026-11-29');
const ZIP_NAME = 'GAM-EDU-PCV1-Refinement2-Dynamic-Playgrounds.zip';
const sha256 = (b) => crypto.createHash('sha256').update(b).digest('hex').toUpperCase();

async function main() {
  const catUrl =
    'https://firebasestorage.googleapis.com/v0/b/gamedu-69888475-f5783.firebasestorage.app/o/' +
    encodeURIComponent('story-spark-preview/narrated-lessons/catalogue.json') +
    '?alt=media';
  const cat = await (await fetch(catUrl)).json();
  const hcEntry = cat.entries.find((e) => e.lessonId === 'cambridge-as-a-level-chemistry-hydrocarbons');
  const atEntry = cat.entries.find((e) => e.lessonId === 'b8-sci-t1-atoms-and-the-periodic-table');

  const files = {};

  files['01-deployment-and-activation-status.md'] = strToU8(`# 01 — Actual Current Deployment, CDN & Activation Status (Reconciled)

- **Git \`origin/fixed-version\`**: Updated through PCV-1 Refinement 2 (previous checkpoints: \`512fca19\` foundation, \`1bd9eaab\` discovery, \`a35a207b\` PCV-1 implementation, \`5103e762\` Refinement 1).
- **Live CDN \`catalogue.json\`**: \`catalogueVersion: ${cat.catalogueVersion}\` (updated \`${cat.updatedAt}\`, \`${cat.entries.length}\` entries).
  - **Hydrocarbons (\`cambridge-as-a-level-chemistry-hydrocarbons\`)**: \`${hcEntry.packageHash}\` (\`${hcEntry.packagePath}\`) — 100% LIVE \`1.0.0–1.2.0\` engines, including dimensionless \`Mr\` + \`Molar mass g mol⁻¹\`, \`showDataTable: true\`, full integer presets, and \`reactionMeta\`. Original \`739c1252e89e\` preserved.
  - **Basic 8 Atoms (\`b8-sci-t1-atoms-and-the-periodic-table\`)**: \`${atEntry.packageHash}\` (\`${atEntry.packagePath}\`) — 100% LIVE \`1.2.0\` engines (removed premature \`s21\` disclosure). Original \`15080192a16a\` preserved.
- **Reconciliation of Owner Observation vs \`1.8.0\` Gate**:
  - \`construction-lab\` \`engineVersion\` is \`1.8.0\`, while \`productionVersion\` remains strictly held at \`1.3.0\`.
  - The live CDN Basic 8 package (\`${atEntry.packageHash}\`) uses \`minEngineVersion: "1.2.0"\` (fixed-target activities); the upgraded **v1.8.0 Open-Ended Atomic Playground JSON** (\`lessons/b8-sci-t1-atoms-and-the-periodic-table.playground-v1.8.0-ready.json\`) is validated (\`allowDevOnlyEngines: true\`) and held back from live CDN publish until the owner manually promotes \`fixed-version\` on Vercel and approves \`construction-lab\` activation.
  - Student Enrichment remains **Under Construction** (\`src/lib/student-enrichment-release.ts\`).
`);

  files['02-slide-by-slide-dynamic-audit-43-activities.md'] = strToU8(`# 02 — Configuration-First Dynamic Capability Audit (All 43 Pilot Activities)

Classification key: **A** = Dynamic capability already available · **B** = Configuration-only improvement (implemented now) · **C** = Small shared engine refinement proposed · **D** = Significant new capability (separate approval) · **E** = Fixed-target assessment intentionally retained.

## Pilot A — Hydrocarbons (26 Activities across 18 Slides)
| Slide | Activity ID | Engine | Class | Current Mode & Recommendation |
|---|---|---|---|---|
| \`a02\` | \`hc-a02-homologous-series\` | \`graph-slider 1.0.0\` | **B (Implemented)** | Dynamic slider; upgraded via config with \`showDataTable: true\`, full integer presets \`[1,2,3,4,5,8,10]\`, dimensionless \`Mr\` + \`Molar mass g mol⁻¹\` |
| \`a06\` | \`hc-a06-methane-vsepr\` | \`atom-bond-builder 1.2.0\` | **C (Proposed)** | Guided VSEPR (CH₄); small reusable \`moleculeBank\` selector would allow comparing CH₄, NH₃, H₂O, CO₂ in one lab |
| \`b01\` | \`hc-b01-boiling-points\` | \`graph-slider 1.0.0\` | **B (Implemented)** | Dynamic slider; upgraded via config with \`showDataTable: true\` & full integer presets \`[1..8]\` |
| \`b04\` | \`hc-b04-fractional-distillation\` | \`process-stepper 1.0.0\` | **A** | Interactive 4-stage column explorer with state table & prediction |
| \`c01\` | \`hc-c01-methane-combustion\` | \`equation-balancer 1.1.0\` | **C (Proposed)** | Guided example; small reusable \`equationBank\` would let learners pick CH₄/C₂H₆/C₃H₈/C₄H₁₀ |
| \`c01\` | \`hc-c01-propane-combustion\` | \`equation-balancer 1.1.0\` | **E** | Independent stoichiometry practice intentionally retained |
| \`c02\` | \`hc-c02-incomplete-combustion\` | \`equation-balancer 1.1.0\` | **C (Proposed)** | Could offer selectable CO vs C(soot) incomplete pathways via \`equationBank\` |
| \`c04\` | \`hc-c04-catalytic-converter\` | \`equation-balancer 1.1.0\` | **E** | Focused catalytic converter redox check intentionally retained |
| \`d02\` | \`hc-d02-frs-mechanism\` | \`process-stepper 1.0.0\` | **B (Implemented)** | Enriched via config with \`whatChanges\`, \`whyItMatters\`, \`reactionMeta\` (bonds broken, electron movement) |
| \`d03\` | \`hc-d03-termination\` | \`process-stepper 1.0.0\` | **A** | Multi-pathway termination explorer + prediction |
| \`e03\` | \`hc-e03-cracking-balance\` | \`equation-balancer 1.1.0\` | **C (Proposed)** | Selectable cracking equation bank would illustrate multiple valid cracking splits |
| \`f01\` | \`hc-f01-ethene-geometry\` | \`atom-bond-builder 1.2.0\` | **E** | Focused sp² trigonal planar check intentionally retained |
| \`f03\` | \`hc-f03-bromine-water-test\` | \`process-stepper 1.0.0\` | **A** | Virtual comparison explorer + prediction |
| \`g05\` | \`hc-g05-atom-economy\` | \`math-evaluator 1.1.0\` | **E** | Quantitative atom economy check + prediction intentionally retained |
| \`h02\` | \`hc-h02-electrophilic-addition-hbr\` | \`process-stepper 1.0.0\` | **B (Implemented)** | Enriched via config with \`whatChanges\` and \`reactionMeta\` |
| \`i03\` | \`hc-i03-propene-carbocations\` | \`process-stepper 1.0.0\` | **A** | Secondary vs primary carbocation pathway comparison + prediction |
| \`p01\` (×3) | \`hc-p01-*\` | \`equation-balancer\` + \`math-evaluator\` | **E** | Digital exam practice intentionally retained as fixed assessment |
| \`p03\` (×3) | \`hc-p03-*\` | \`math-evaluator 1.1.0\` | **E** | Sequential 3 s.f. exam practice intentionally retained |
| \`p09\` (×4) | \`hc-p09-*\` | \`math-evaluator 1.1.0\` | **E** | Sequential 3 s.f. exam practice intentionally retained |

## Pilot B — Basic 8 Atoms & Periodic Table (17 Activities across 13 Slides)
| Slide | Activity ID | Engine | Class | Current Mode & Recommendation |
|---|---|---|---|---|
| \`s04\` | \`b8-s04-carbon-atom\` | \`atom-bond-builder\` | **A (Ready in 1.8.0)** | Upgraded to Open-Ended Atomic Playground (\`free-exploration\` + Periodic Table selector) in \`playground-v1.8.0-ready.json\` |
| \`s06\`, \`s07\`, \`s09\` | \`b8-s06/07/09-*\` | \`atom-bond-builder 1.2.0\` | **E** | Focused guided discoveries (neutrality, proton identity, C-14 isotope) intentionally retained; optional \`Explore Further\` proposed |
| \`s10\`, \`s12\` (×2), \`s26\` | \`b8-s10/12/26-*\` | \`math-evaluator 1.1.0\` | **E** | Independent numeric particle-count practice intentionally retained |
| \`s18\`, \`s20\` | \`b8-s18/20-*\` | \`atom-bond-builder 1.2.0\` | **E** | Guided Neon (2,8) & Sodium (2,8,1) shell construction intentionally retained |
| \`s21\` (×2) | \`b8-s21-*\` | \`atom-bond-builder\` | **A (Ready in 1.8.0)** | Upgraded to 4-target \`independent-challenge\` (H, O, Cl, Ca) with zero premature disclosure |
| \`s22\` | \`b8-s22-fluoride-ion\` | \`atom-bond-builder 1.2.0\` | **E** | Focused Fluoride ion formation intentionally retained |
| \`s23\` (×2) | \`b8-s23-nacl/mgo-ionic\` | \`atom-bond-builder 1.2.0\` | **C (Proposed)** | Small reusable \`ionicBank\` selector would let learners explore NaCl, MgO, MgCl₂, CaCl₂, Al₂O₃ in one playground |
| \`s25\` (×2) | \`b8-s25-water/co2-covalent\` | \`atom-bond-builder 1.2.0\` | **C (Proposed)** | Small reusable \`covalentBank\` selector would let learners build H₂, O₂, N₂, H₂O, CO₂, NH₃, CH₄ in one playground |
`);

  files['03-complete-16-engine-dynamic-capability-matrix.md'] = strToU8(`# 03 — Complete 16-Engine Dynamic Exploration Capability Matrix

| # | Engine / Subtype | Current Dynamic Support | Proposed Small Extension (For Review) |
|---|---|---|---|
| 1 | \`atom-bond-builder: atomic-structure\` | **Implemented (1.8.0)**: \`free-exploration\` + Periodic Table selector (Z=1..20/30) + \`guided\` + \`independent-challenge\` + 6 scientific fixes | Activate after manual Vercel promotion |
| 2 | \`atom-bond-builder: ionic-bonding\` | Fixed cation/anion pair per activity | Add optional \`ionicBank: IonicExample[]\` selector (reusing existing \`evaluateIonicBonding\`) |
| 3 | \`atom-bond-builder: covalent-bonding\` | Fixed molecule per activity | Add optional \`covalentBank: CovalentExample[]\` selector (H₂, O₂, N₂, H₂O, CO₂, CH₄, NH₃) |
| 4 | \`atom-bond-builder: molecular-geometry\` | Fixed VSEPR molecule per activity | Add optional \`vseprBank: VseprExample[]\` selector |
| 5 | \`equation-balancer\` | Fixed equation per activity | Add optional \`equationBank: EquationExample[]\` selector (validated at authoring time) |
| 6 | \`electrical-circuit\` | Fixed topology with swappable component palette | Already supports open-ended slot experimentation + check |
| 7 | \`bio-sequence-builder\` | Fixed target sequence per activity | Optional \`sequenceBank\` selector |
| 8 | \`graph-slider\` | **LIVE dynamic**: sliders, presets, \`showDataTable\`, challenges, predictions | Already strongly dynamic via config |
| 9 | \`process-stepper\` | **LIVE dynamic**: linear/cyclic stages, state diff, \`reactionMeta\`, predictions, sequence challenge | Already dynamic for non-branching processes |
| 10 | \`diagram-hotspots\` | **LIVE dynamic**: Explore + Identify modes | Future: allow safe inline-SVG reuse alongside WebP/PNG |
| 11 | \`math-evaluator\` | Guided / Independent / Exam-Practice working workspace | Intentional assessment engine (not a free playground) |
| 12 | \`sort-classify\` | Category bins, matching, cloze, ordering (dev-only) | Activate when promoted |
| 13 | \`measurement-lab\` | Interactive scale/parallax/tare/zero-error manipulation (dev 1.4.0) | Already interactive; activate when promoted |
| 14 | \`data-stats-lab\` | Interactive trial runner, data editing, outlier toggle, 8 charts (dev 1.5.0) | Already strongly dynamic; activate when promoted |
| 15 | \`geometry-constructor\` | Interactive compass/protractor, movable circle theorems, loci plane, cube nets (1.3.0 LIVE / 1.6.0 dev) | Already strongly dynamic |
| 16 | \`number-manipulative\` | 9 interactive CPA primary manipulatives (dev 1.7.0) | Optional \`free-exploration\` toggle in future refinement |

## Proposed \`Explore Further\` Control (Section 10 Feasibility)
- **Feasibility**: Cleanly implementable inside \`ConstructionLabShell\` (or \`AtomBondLab\`) via an optional \`exploreFurther?: boolean\` flag that opens a sandboxed local React state drawer/modal backed by the **same already-loaded lazy chunk** (0 extra downloads, 0 Firestore writes).
- **Isolation Guarantee**: Separate \`exploreSnapshot\` state object so closing \`Explore Further\` restores the learner's untouched assessment \`state\` without corrupting answers or leaking target solutions.
- **Status**: Proposed for ChatGPT approval before implementation.
`);

  files['04-scientific-corrections-and-bundle-report.md'] = strToU8(`# 04 — Scientific Corrections, Functional Tests & Bundle-Size Report

## 1. All 6 Atomic Structure Playground Scientific Corrections Completed (\`atom-bond-atomic.ts\`)
1. **Unsupported subshell configurations**: \`getExpectedSubshells(el.symbol, actualCharge) === null\` now returns \`passed: false, status: 'unverified-subshells'\` (never silently passed as verified!).
2. **Neutral atoms vs common ions**: \`isCommonIon\` is now \`actualCharge !== 0 && el.supportedCharges.includes(actualCharge)\` (neutral atoms always have \`isCommonIon: false\`).
3. **Malformed/negative/fractional/non-finite counts**: Explicitly rejected with \`status: 'invalid-input'\`, \`passed: false\`.
4. **Independent shell/subshell capacity validation**: Enforced directly inside \`evaluateFreeAtomicExploration\` (\`0 <= shells[i] <= [2,8,8,2][i]\`, \`0 <= subshells[k] <= SUBSHELL_MAX_CAPACITY[k]\`) independent of UI button clamping.
5. **Known isotopes vs unverified combinations**: Strict check against verified \`el.isotopes\`; unlisted neutron counts classified as \`unverified-isotope\` without claiming stability.
6. **Group/Period invariance on ion formation**: \`groupPeriodNote\` and ion feedback explicitly state that forming an ion changes charge/electrons only, never the element's Group or Period.

## 2. Verification & Bundle-Size Impact
- **Unit & Functional UI Tests**: \`atom-playground.test.tsx\` (6/6), \`atom-bond-lab.test.tsx\` (8/8), \`pcv1-enriched-pilots.test.tsx\` (3/3) — **17/17 PASSED**.
- **TypeScript Ratchet**: \`Ratchet OK: 351 <= 351\`.
- **Production Build (\`npm run build\`, Next.js 15.5.29)**: **Exit 0**.
  - Shared First Load JS: **\`103 kB\`** (0 kB increase on core school-management routes!).
  - \`/narrated-lessons/[lessonId]\` First Load JS: \`257 kB\` (\`+2 kB\` vs \`255 kB\`; \`AtomBondLab\` remains independently lazy-loaded).
  - Operational cost: **0 Firestore reads/writes**, **0 paid AI calls**, **0 paid media regeneration**.
`);

  files['lessons/cambridge-as-a-level-chemistry-hydrocarbons.enriched-v101-live.json'] = new Uint8Array(
    fs.readFileSync(path.join(WORK, 'cambridge-as-a-level-chemistry-hydrocarbons.enriched.json')),
  );
  files['lessons/b8-sci-t1-atoms-and-the-periodic-table.playground-v1.8.0-ready.json'] = new Uint8Array(
    fs.readFileSync(path.join(WORK, 'b8-sci-t1-atoms-and-the-periodic-table.playground-v1.8.0.json')),
  );
  files['engine/atom-bond-atomic.ts'] = new Uint8Array(fs.readFileSync(path.join(REPO, 'src/lib/construction-lab/atom-bond-atomic.ts')));
  files['engine/atom-playground.test.tsx'] = new Uint8Array(fs.readFileSync(path.join(REPO, 'src/lib/construction-lab/atom-playground.test.tsx')));
  files['docs/GEMINI_DEVELOPMENT_PROGRESS.md'] = new Uint8Array(fs.readFileSync(path.join(REPO, 'docs/GEMINI_DEVELOPMENT_PROGRESS.md')));
  files['docs/FOUNDATION_MASTER_STATUS.md'] = new Uint8Array(fs.readFileSync(path.join(REPO, 'docs/FOUNDATION_MASTER_STATUS.md')));

  const sortedNames = Object.keys(files).sort();
  const manifest = {
    packageName: 'GAM-EDU-PCV1-Refinement2-Dynamic-Playgrounds',
    generatedAt: new Date().toISOString(),
    catalogueVersion: cat.catalogueVersion,
    liveHashes: { hydrocarbons: hcEntry.packageHash, atoms: atEntry.packageHash },
    fileCount: sortedNames.length + 1,
    files: sortedNames.map((n) => ({ path: n, bytes: files[n].length, sha256: sha256(Buffer.from(files[n])) })),
  };
  files['manifest.json'] = strToU8(JSON.stringify(manifest, null, 2) + '\n');

  const zipBytes = zipSync(files, { level: 9 });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outZip = path.join(OUT_DIR, ZIP_NAME);
  fs.writeFileSync(outZip, zipBytes);
  const digest = crypto.createHash('sha256').update(zipBytes).digest('hex');
  fs.writeFileSync(path.join(OUT_DIR, `${ZIP_NAME}.sha256`), `${digest}  ${ZIP_NAME}\n`);
  fs.copyFileSync(outZip, path.join('C:/Users/DELL/Downloads', ZIP_NAME));
  fs.copyFileSync(path.join(OUT_DIR, `${ZIP_NAME}.sha256`), path.join('C:/Users/DELL/Downloads', `${ZIP_NAME}.sha256`));

  console.log(JSON.stringify({ zip: outZip, downloadsCopy: `C:\\Users\\DELL\\Downloads\\${ZIP_NAME}`, files: sortedNames.length + 1, bytes: zipBytes.length, sha256: digest, catalogueVersion: cat.catalogueVersion, hcHash: hcEntry.packageHash, atHash: atEntry.packageHash }, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });
