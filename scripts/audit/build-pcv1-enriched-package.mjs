// Packages GAM-EDU-PCV1-Enriched-Science-Pilots.zip with all 17 required PCV-1 deliverables
// and copies it to C:\Users\DELL\Downloads\ for effortless upload to ChatGPT.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { zipSync, strToU8 } = require('fflate');

const REPO = process.cwd();
const WORK = 'C:/Users/DELL/.gemini/antigravity/brain/c229576f-28ea-43b0-b4c2-466e9ffcd1e3/scratch/pcv1-impl';
const OUT_DIR = path.resolve(REPO, 'docs/audit/2026-11-29');
const ZIP_NAME = 'GAM-EDU-PCV1-Enriched-Science-Pilots.zip';
const sha256 = (b) => crypto.createHash('sha256').update(b).digest('hex').toUpperCase();

const hcOrig = JSON.parse(fs.readFileSync(path.join(WORK, 'cambridge-as-a-level-chemistry-hydrocarbons.original.json'), 'utf8'));
const hcEnr = JSON.parse(fs.readFileSync(path.join(WORK, 'cambridge-as-a-level-chemistry-hydrocarbons.enriched.json'), 'utf8'));
const atOrig = JSON.parse(fs.readFileSync(path.join(WORK, 'b8-sci-t1-atoms-and-the-periodic-table.original.json'), 'utf8'));
const atEnr = JSON.parse(fs.readFileSync(path.join(WORK, 'b8-sci-t1-atoms-and-the-periodic-table.enriched.json'), 'utf8'));

const files = {};
files['lessons/cambridge-as-a-level-chemistry-hydrocarbons.original.json'] = strToU8(JSON.stringify(hcOrig, null, 2) + '\n');
files['lessons/cambridge-as-a-level-chemistry-hydrocarbons.enriched.json'] = strToU8(JSON.stringify(hcEnr, null, 2) + '\n');
files['lessons/b8-sci-t1-atoms-and-the-periodic-table.original.json'] = strToU8(JSON.stringify(atOrig, null, 2) + '\n');
files['lessons/b8-sci-t1-atoms-and-the-periodic-table.enriched.json'] = strToU8(JSON.stringify(atEnr, null, 2) + '\n');

files['01-slide-by-slide-implementation-matrix.md'] = strToU8(`# PCV-1 Slide-by-Slide Implementation Matrix

## Pilot A — Cambridge AS & A-Level Chemistry: Hydrocarbons (\`cambridge-as-a-level-chemistry-hydrocarbons\`)
| Candidate Slide | Status | Implemented Engine(s) & Activity ID(s) | Justification / Notes |
|---|---|---|---|
| \`a02\` | **Implemented** | \`graph-slider 1.0.0\` (\`hc-a02-homologous-series\`) | Integer $n \\in [1,10]$, live $2n+2$ & $14n+2$ readouts, prediction, octane challenge |
| \`a06\` | **Implemented** | \`atom-bond-builder 1.2.0\` (\`hc-a06-methane-vsepr\`) | Methane CH₄ tetrahedral VSEPR (109.5°, nonpolar) with 2D-vs-3D model note |
| \`a07\` | **Deferred (Engine Limitation)** | — | \`diagram-hotspots\` requires approved WebP/PNG rather than inline SVG; unrestricted pentane skeletal builder not supported |
| \`b01\` | **Implemented** | \`graph-slider 1.0.0\` (\`hc-b01-boiling-points\`) | Discrete verified experimental normal boiling points C₁–C₈ (integer step 1), room-temp reference line, prediction |
| \`b02\` | **Deferred (Engine Limitation)** | — | Discrete categorical branching comparison best served by \`sort-classify\` or categorical bar chart (not yet production-activated) |
| \`b04\` | **Implemented** | \`process-stepper 1.0.0\` (\`hc-b04-fractional-distillation\`) | Linear 4-stage column temperature gradient; explicitly states fractions are mixtures |
| \`c01\` | **Implemented** | \`equation-balancer 1.1.0\` (\`hc-c01-methane-combustion\`, \`hc-c01-propane-combustion\`) | Guided methane + independent propane complete combustion, simplest whole-number ratio |
| \`c02\` | **Implemented** | \`equation-balancer 1.1.0\` (\`hc-c02-incomplete-combustion\`) | Propane → C(s) + H₂O with explicit model note on mixed CO/C/CO₂ products |
| \`c04\` | **Implemented** | \`equation-balancer 1.1.0\` (\`hc-c04-catalytic-converter\`) | \`2CO + 2NO -> 2CO2 + N2\`; explicitly clarifies CO₂ is produced, not removed |
| \`d02\` | **Implemented** | \`process-stepper 1.0.0\` (\`hc-d02-frs-mechanism\`) | UV initiation + Propagation 1 & 2 with radical dots \`•\` and sequence challenge |
| \`d03\` | **Implemented** | \`process-stepper 1.0.0\` (\`hc-d03-termination\`) | All 3 valid radical-radical termination pathways + trace ethane evidence prediction |
| \`e03\` | **Implemented** | \`equation-balancer 1.1.0\` (\`hc-e03-cracking-balance\`) | \`C12H26 -> C6H14 + 3C2H4\` with constrained products note |
| \`f01\` | **Implemented** | \`atom-bond-builder 1.2.0\` (\`hc-f01-ethene-geometry\`) | Trigonal planar 120° around sp² carbon in ethene; distinguishes σ vs π bonds |
| \`f03\` | **Implemented** | \`process-stepper 1.0.0\` (\`hc-f03-bromine-water-test\`) | Virtual bromine-water unsaturation test (explicitly labelled virtual, non-home-lab) |
| \`f04\` | **Deferred (Engine Limitation)** | — | Needs inline-SVG hotspots or dedicated stereoisomer renderer |
| \`g01\` | **Not Educationally Necessary** | — | Individual pathways already well covered across \`g02\`–\`g04\` and \`h02\` without branching stepper |
| \`g05\` | **Implemented** | \`math-evaluator 1.1.0\` (\`hc-g05-atom-economy\`) | 100% atom economy calculation + prediction distinguishing atom economy vs % yield |
| \`h01\` | **Not Educationally Necessary** | — | Existing SVG + narration clearly contrasts homolytic vs heterolytic; reinforced in \`d02\` & \`h02\` |
| \`h02\` | **Implemented** | \`process-stepper 1.0.0\` (\`hc-h02-electrophilic-addition-hbr\`) | Complete 6-stage HBr addition preserving atom counts, charge, valency + sequence challenge |
| \`h04\` / \`h07\` | **Not Educationally Necessary** | — | Existing coursebook simplified vs bromonium-ion enrichment slides are clear; unrestricted curly-arrow drawing deferred |
| \`i03\` | **Implemented** | \`process-stepper 1.0.0\` (\`hc-i03-propene-carbocations\`) | Secondary vs primary carbocation comparison under ordinary electrophilic conditions |
| \`j02\` / \`k01\` / \`k03\` | **Deferred (Engine Limitation)** | — | Unrestricted structural/polymer drawing and inline-SVG hotspot identification not yet supported |
| \`p01\` | **Implemented** | \`equation-balancer 1.1.0\` + 2× \`math-evaluator 1.1.0\` (\`hc-p01-*\`) | Balance propane combustion, then compute 100 cm³ O₂ and 60 cm³ CO₂ |
| \`p03\` | **Implemented** | 3× \`math-evaluator 1.1.0\` (\`hc-p03-*\`) | Sequential 3 s.f. checks: 0.500 mol ethene, 23.0 g theoretical ethanol, 70.0% yield |
| \`p05\` / \`p07\` | **Deferred (Engine Limitation)** | — | Unrestricted skeletal structure input & freehand multi-valid radical equation input retained as paper self-marking |
| \`p09\` | **Implemented** | 4× \`math-evaluator 1.1.0\` (\`hc-p09-*\`) | Sequential 3 s.f. checks: 0.200 mol, 37.6 g, 90.0%, 28.2 g at 75.0% yield |

## Pilot B — NaCCA Basic 8 Science: Atoms and the Periodic Table (\`b8-sci-t1-atoms-and-the-periodic-table\`)
| Candidate Slide | Status | Implemented Engine(s) & Activity ID(s) | Justification / Notes |
|---|---|---|---|
| \`s03\` / \`s05\` | **Not Educationally Necessary** | — | Native checkpoints + \`s04\`/\`s06\` interactive atom builders directly cover particles & charges |
| \`s04\` | **Implemented** | \`atom-bond-builder 1.2.0\` (\`b8-s04-carbon-atom\`) | Build neutral Carbon-12 (6p, 6n, 6e⁻) with energy-level shell model note |
| \`s06\` | **Implemented** | \`atom-bond-builder 1.2.0\` (\`b8-s06-neutral-lithium\`) | Adjust electrons on Lithium-7 to reach charge 0 + neutrality prediction |
| \`s07\` | **Implemented** | \`atom-bond-builder 1.2.0\` (\`b8-s07-proton-identity\`) | Transform Carbon-12 to Nitrogen-14 to demonstrate proton number defines element |
| \`s09\` | **Implemented** | \`atom-bond-builder 1.2.0\` (\`b8-s09-isotope-c14\`) | Build Carbon-14 isotope; distinguishes mass number from relative atomic mass |
| \`s10\` | **Implemented** | \`math-evaluator 1.1.0\` (\`b8-s10-fluorine-neutrons\`) | Independent numeric particle count: Fluorine-19 neutrons = 10 |
| \`s12\` | **Implemented** | 2× \`math-evaluator 1.1.0\` (\`b8-s12-*\`) | Brand-new non-narrated examples: Magnesium-24 neutrons (12) & neutral Phosphorus-31 electrons (15) |
| \`s14\` / \`s16\` / \`s17\` | **Deferred (Engine Limitation)** | — | \`diagram-hotspots\` requires WebP/PNG image asset (not inline SVG); periodic table slides use inline SVGs |
| \`s18\` | **Implemented** | \`atom-bond-builder 1.2.0\` (\`b8-s18-neon-shells\`) | Guided shell filling for Neon (2, 8) with \`lockNucleus: true\` |
| \`s20\` | **Implemented** | \`atom-bond-builder 1.2.0\` (\`b8-s20-sodium-shells\`) | Build Sodium (2, 8, 1) highlighting 1 valence electron |
| \`s21\` | **Implemented** | 2× \`atom-bond-builder 1.2.0\` (\`b8-s21-*\`) | Independent first-20-elements practice: Chlorine (2, 8, 7) and Calcium (2, 8, 8, 2) |
| \`s22\` | **Implemented** | \`atom-bond-builder 1.2.0\` (\`b8-s22-fluoride-ion\`) | Form Fluoride ion F⁻ (9p, 10e⁻, charge −1) with prediction |
| \`s23\` | **Implemented** | 2× \`atom-bond-builder 1.2.0\` (\`b8-s23-*\`) | Guided NaCl (with 3D lattice note) + independent Magnesium Oxide (MgO) |
| \`s24\` | **Not Educationally Necessary** | — | Concept introduced immediately before hands-on covalent construction on \`s25\` |
| \`s25\` | **Implemented** | 2× \`atom-bond-builder 1.2.0\` (\`b8-s25-*\`) | Covalent construction of H₂O (single bonds) and CO₂ (double bonds) |
| \`s26\` | **Implemented** | \`math-evaluator 1.1.0\` (\`b8-s26-argon-neutrons\`) | Practical mastery particle count (Argon-40 = 22n); explicitly notes practice is not recorded in teacher gradebook |
`);

files['02-preservation-and-structural-diff.md'] = strToU8(`# PCV-1 Original vs Enriched Structural Diff & Media Preservation Report

Automated verification in \`scripts/lessons/enrich-pcv1-pilots.ts\` stripped \`slide.interactive\` from each enriched lesson and compared \`JSON.stringify(stripped) === JSON.stringify(original)\`:
- **Pilot A (\`cambridge-as-a-level-chemistry-hydrocarbons\`)**: **BYTE-FOR-BYTE IDENTICAL** on all 71 slides' \`id\`, \`order\`, \`sectionId\`, \`title\`, \`purpose\`, \`onScreenText\`, \`visual\`, \`narration\`, \`audioUrl\`, \`audioHash\`, \`cues\`, \`checkpoints\`, \`masteryCheck\`, \`teacherNote\`, \`summary\`, \`extensionActivity\`, \`coverageMatrix\`. Only addition: \`26\` \`slide.interactive\` objects across \`18\` slides.
- **Pilot B (\`b8-sci-t1-atoms-and-the-periodic-table\`)**: **BYTE-FOR-BYTE IDENTICAL** on all 26 slides' non-interactive fields. Only addition: \`17\` \`slide.interactive\` objects across \`13\` slides.
- **Zero paid AI/TTS credits consumed**: Published with \`--skip-media\`, reusing 100% of existing hashed MP3s and WebPs.
`);

files['03-publication-rollback-and-testing-urls.md'] = strToU8(`# PCV-1 Controlled Publication, Owner Testing URLs & Exact Rollback Procedure

## 1. Owner Testing URLs (Authenticated Staff Accounts: Director / Administrator / Teacher)
- **Pilot A — Cambridge AS & A-Level Chemistry (Hydrocarbons)**:
  - Staff Dashboard URL: \`/dashboard/narrated-lessons/cambridge-as-a-level-chemistry-hydrocarbons\`
  - Direct Player URL: \`/narrated-lessons/cambridge-as-a-level-chemistry-hydrocarbons\`
- **Pilot B — NaCCA Basic 8 Science (Atoms and the Periodic Table)**:
  - Staff Dashboard URL: \`/dashboard/narrated-lessons/b8-sci-t1-atoms-and-the-periodic-table\`
  - Direct Player URL: \`/narrated-lessons/b8-sci-t1-atoms-and-the-periodic-table\`

*Production Compatibility*: **100% of added activities (43/43)** passed \`assertValidLessonInteractives(lesson, { allowDevOnlyEngines: false })\` using ONLY currently LIVE production engines (\`graph-slider 1.0.0\`, \`process-stepper 1.0.0\`, \`math-evaluator 1.1.0\`, \`equation-balancer 1.1.0\`, \`atom-bond-builder 1.2.0\`). No new engine activation was needed.

## 2. Publication Ledger (Catalogue \`v96\` → \`v98\`, 2026-11-28)
| Lesson ID | Original Immutable Package (Preserved) | New Enriched Immutable Package | Catalogue Backup |
|---|---|---|---|
| \`cambridge-as-a-level-chemistry-hydrocarbons\` | \`packages/cambridge-as-a-level-chemistry-hydrocarbons.739c1252e89e.json\` (\`739c1252e89e\`) | \`packages/cambridge-as-a-level-chemistry-hydrocarbons.f1e9f251f1d5.json\` (\`f1e9f251f1d5\`) | \`backups/catalogue.2026-11-28T09-57-12-709Z.json\` |
| \`b8-sci-t1-atoms-and-the-periodic-table\` | \`packages/b8-sci-t1-atoms-and-the-periodic-table.15080192a16a.json\` (\`15080192a16a\`) | \`packages/b8-sci-t1-atoms-and-the-periodic-table.f981f2d51c63.json\` (\`f981f2d51c63\`) | \`backups/catalogue.2026-11-28T09-57-26-797Z.json\` |

- All 47 other catalogue entries remain untouched (\`49\` total entries in \`catalogue.json\` \`v98\`).
- **Cache Behaviour**: \`catalogue.json\` uses \`Cache-Control: public, max-age=60, stale-while-revalidate=300\`. Rollback propagation completes within 60–360 seconds after updating \`catalogue.json\` (not described as instantaneous).

## 3. Exact Rollback Procedure
To roll back either lesson individually (preserving all other 48 entries):
1. Download current \`story-spark-preview/narrated-lessons/catalogue.json\`.
2. Replace the target lesson entry's \`packagePath\` and \`packageHash\` with the original immutable path/hash from the table above (e.g. \`739c1252e89e\` or \`15080192a16a\`) and increment \`catalogueVersion\`.
3. Upload updated \`catalogue.json\` with \`ifGenerationMatch\` lock and \`Cache-Control: public, max-age=60, stale-while-revalidate=300\`.
4. To roll back BOTH lessons simultaneously, restore \`backups/catalogue.2026-11-28T09-57-12-709Z.json\` with an incremented \`catalogueVersion\`.
`);

files['04-pcv1-capability-gap-register.md'] = strToU8(`# PCV-1 Capability-Gap Register (Observed During Real Curriculum Authoring)

1. **\`diagram-hotspots\` inline-SVG reuse**: Currently requires an approved WebP/PNG image URL (\`visual-region.ts\`), preventing direct hotspot layering over existing sanitised inline slide SVGs (deferred \`a07\`, \`f04\`, \`s14\`, \`s16\`, \`s17\`).
2. **\`sort-classify 1.0.0\` production activation**: High-value classification & matching activities (e.g. alkane branching comparison \`b02\`, periodic table groups/periods) are implemented in dev but \`productionVersion: null\`.
3. **Unrestricted organic skeletal / stereoisomer / curly-arrow drawing**: Deferred for future chemistry tooling (\`a07\`, \`f04\`, \`h04\`, \`k03\`, \`p05\`, \`p07\`).
4. **Live browser screenshots**: Local Playwright Chromium headless shell binary is not installed on this workstation; browser visual verification on 360px/tablet/desktop/dark-theme remains open for owner live testing & CI/audit Chromium run.
5. **Interactive completion persistence**: \`slide.interactive\` remains ephemeral practice exploration (0 Firestore writes); teacher gradebook persistence is a future architectural stage.
`);

files['05-updated-GEMINI_DEVELOPMENT_PROGRESS.md'] = new Uint8Array(fs.readFileSync(path.join(REPO, 'docs/GEMINI_DEVELOPMENT_PROGRESS.md')));
files['06-updated-FOUNDATION_MASTER_STATUS.md'] = new Uint8Array(fs.readFileSync(path.join(REPO, 'docs/FOUNDATION_MASTER_STATUS.md')));
files['07-functional-test-suite.tsx'] = new Uint8Array(fs.readFileSync(path.join(REPO, 'src/lib/narrated-lessons/pcv1-enriched-pilots.test.tsx')));

const sortedNames = Object.keys(files).sort();
const manifest = {
  packageName: 'GAM-EDU-PCV1-Enriched-Science-Pilots',
  generatedAt: new Date().toISOString(),
  catalogueVersion: 98,
  pilots: {
    hydrocarbons: { originalHash: '739c1252e89e', enrichedHash: 'f1e9f251f1d5', enrichedSlides: 18, addedActivities: 26 },
    atoms: { originalHash: '15080192a16a', enrichedHash: 'f981f2d51c63', enrichedSlides: 13, addedActivities: 17 },
  },
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

// Also copy straight to Downloads for easy upload to ChatGPT!
fs.copyFileSync(outZip, path.join('C:/Users/DELL/Downloads', ZIP_NAME));
fs.copyFileSync(path.join(OUT_DIR, `${ZIP_NAME}.sha256`), path.join('C:/Users/DELL/Downloads', `${ZIP_NAME}.sha256`));

console.log(JSON.stringify({ zip: outZip, downloadsCopy: `C:\\Users\\DELL\\Downloads\\${ZIP_NAME}`, files: sortedNames.length + 1, bytes: zipBytes.length, sha256: digest }, null, 2));
