// Builds GAM-EDU-Practical-Curriculum-Validation-PCV1-Discovery.zip from LIVE CDN lesson packages + repo schemas.
// Zero secrets, zero credentials, zero student records, zero large MP3 duplication (exact CDN URLs preserved).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { zipSync, strToU8 } = require('fflate');

const REPO = process.cwd();
const SCRATCH = 'C:/Users/DELL/.gemini/antigravity/brain/c229576f-28ea-43b0-b4c2-466e9ffcd1e3/scratch/pcv1';
const OUT_DIR = path.resolve(REPO, 'docs/audit/2026-11-29');
const ZIP_NAME = 'GAM-EDU-Practical-Curriculum-Validation-PCV1-Discovery.zip';

const cat = JSON.parse(fs.readFileSync(path.join(SCRATCH, 'catalogue.json'), 'utf8'));
const jhsRows = JSON.parse(fs.readFileSync(path.join(SCRATCH, 'jhs-science-catalogue.json'), 'utf8'));

const CHEM_IDS = [
  'a-level-chem-halogenoalkanes',
  'cambridge-as-a-level-chemistry-hydrocarbons',
];

const JHS_PILOT_IDS = [
  'b8-sci-t1-atoms-and-the-periodic-table',
  'b7-sci-t4-electronic-components-and-circuits',
  'b7-sci-t1-living-cells',
  'b8-sci-t1-the-carbon-cycle',
  'b7-sci-t4-simple-machines-and-efficiency',
  'b8-sci-t1-mixtures-and-separation',
];

const loadLesson = (id) => JSON.parse(fs.readFileSync(path.join(SCRATCH, 'lessons', `${id}.json`), 'utf8'));
const csvEsc = (v) => {
  const s = String(v ?? '').replace(/\r?\n/g, ' ');
  return /[",]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex').toUpperCase();

function renderSlideDetails(lesson, entry) {
  const cpBySlide = new Map();
  for (const cp of lesson.checkpoints || []) {
    const sid = cp.afterSlideId || cp.afterSlide || '';
    if (!cpBySlide.has(sid)) cpBySlide.set(sid, []);
    cpBySlide.get(sid).push(cp);
  }
  const lines = [
    `# ${lesson.meta?.title || entry.title} (\`${lesson.lessonId}\`)`,
    '',
    `- **CDN packagePath**: \`${entry.packagePath}\` (hash \`${entry.packageHash}\`, updated \`${entry.updatedAt}\`)`,
    `- **Curriculum**: ${entry.curriculum || lesson.meta?.curriculum || 'ges'} · **Class**: ${entry.class} · **Subject**: ${entry.subject} · **Term**: ${entry.term}`,
    `- **Content Standard**: ${lesson.meta?.contentStandard || entry.contentStandard || 'Not recorded'}`,
    `- **Indicators**: ${(lesson.meta?.indicators || entry.indicators || []).join(', ') || 'None recorded'}`,
    `- **Total Slides**: ${(lesson.slides || []).length} · **Checkpoints**: ${(lesson.checkpoints || []).length} · **Mastery Check Items**: ${(lesson.masteryCheck?.items || []).length}`,
    '',
  ];

  for (const s of lesson.slides || []) {
    const cps = cpBySlide.get(s.id) || [];
    const inter = s.interactive ? JSON.stringify(s.interactive) : 'None';
    lines.push(`## Slide ${s.order}: \`${s.id}\` — ${s.title}`);
    lines.push(`- **Learning Objective / Purpose**: ${s.purpose || 'Not recorded'}`);
    lines.push(`- **Indicators**: ${(s.indicatorIds || []).join(', ') || 'None'}`);
    lines.push(`- **On-Screen Educational Text**:`);
    for (const t of s.onScreenText || []) lines.push(`  - ${t}`);
    lines.push(`- **Key Ideas**: ${(s.keyIdeas || []).join(' | ') || 'None'}`);
    lines.push(`- **Complete Narration Text**: ${s.narration?.script || ''}`);
    lines.push(`- **Audio Asset Reference**: \`${s.narration?.audioUrl || 'None'}\` (${s.narration?.estSeconds ?? '?'}s, source: ${s.narration?.audioSource || 'tts'})`);
    lines.push(`- **Visual Type**: \`${s.visual?.type || 'unknown'}\` · **Description**: ${s.visual?.description || ''}`);
    lines.push(`- **Image Asset Reference**: \`${s.visual?.imageUrl || 'None'}\` · **Alt Text**: ${s.visual?.altText || 'None'}`);
    lines.push(`- **Visual Labels**: ${(s.visual?.labels || []).join(', ') || 'None'}`);
    lines.push(`- **SVG Content**: ${s.visual?.svgCode ? `Present (${s.visual.svgCode.length} chars; preserved verbatim in lessons/ JSON)` : 'None'}`);
    lines.push(`- **Existing Interactive Configuration**: ${inter}`);
    if (s.teacherNote) lines.push(`- **Teacher Note**: ${s.teacherNote}`);
    if (cps.length > 0) {
      lines.push(`- **Existing Checkpoints After This Slide**:`);
      for (const cp of cps) {
        lines.push(`  - Checkpoint \`${cp.id}\` (retryRule: ${cp.retryRule || 'n/a'}):`);
        for (const item of cp.items || []) {
          const q = item.question || item.prompt || '';
          const ans = item.type === 'mcq'
            ? `Correct: ${item.correctOptionId} (${(item.options || []).map((o) => `${o.id}: ${o.text}`).join(' | ')})`
            : item.type === 'sequence'
              ? `Order: ${(item.correctOrder || []).join(' -> ')}`
              : `Hotspot: ${item.correctHotspotId}`;
          lines.push(`    - [${item.type}] \`${item.id}\`: ${q} — ${ans}`);
        }
      }
    } else {
      lines.push(`- **Existing Checkpoints After This Slide**: None`);
    }
    lines.push('');
  }

  if (lesson.masteryCheck?.items?.length) {
    lines.push(`## End-of-Lesson Mastery Check (Pass Mark: ${lesson.masteryCheck.passMark})`);
    for (const item of lesson.masteryCheck.items) {
      const q = item.question || item.prompt || '';
      const ans = item.type === 'mcq'
        ? `Correct: ${item.correctOptionId} (${(item.options || []).map((o) => `${o.id}: ${o.text}`).join(' | ')})`
        : item.type === 'sequence'
          ? `Order: ${(item.correctOrder || []).join(' -> ')}`
          : `Hotspot: ${item.correctHotspotId}`;
      lines.push(`- [${item.type}] \`${item.id}\`: ${q} — ${ans}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function proposeEnrichment(lessonId, slide) {
  const txt = `${slide.title} ${slide.purpose || ''} ${(slide.keyIdeas || []).join(' ')}`.toLowerCase();
  if (lessonId === 'a-level-chem-halogenoalkanes') {
    if (/sn1|sn2|mechanism|nucleophilic|elimination|carbocation|hydrolysis/.test(txt)) {
      return ['process-stepper', 'Step through curly-arrow mechanism stages & inspect intermediate charge/geometry', 'Predict whether primary or tertiary halogenoalkane favours SN1 vs SN2', 'Order mechanism steps and identify rate-determining step', 'Makes curly-arrow & transition-state reasoning interactive', 'No live 3D molecular orbital renderer', '1.0.0 (LIVE)'];
    }
    if (/equation|balanced|reagent|reaction|cyanide|ammonia|hydroxide/.test(txt)) {
      return ['construction-lab (equation-balancer)', 'Balance substitution/elimination reaction equations stoichiometrically', 'Predict by-product (HX, H2O, or halide ion) before balancing', 'Balance halogenoalkane hydrolysis/elimination equation independently', 'Reinforces atom conservation in organic equations', 'Organic structural formulas written as molecular formulas', '1.1.0 (LIVE)'];
    }
    if (/polar|bond|electroneg|dipole|c-x|enthalpy|rate/.test(txt)) {
      return ['construction-lab (atom-bond-builder)', 'Inspect C–X bond polarity vs bond enthalpy trends', 'Predict whether C–F (most polar) or C–I (weakest bond) reacts faster', 'Compare bond polarity & reactivity order', 'Addresses classic C–F vs C–I misconception directly', 'A-Level kinetics graph needs graph-slider for rate curve', '1.2.0 (LIVE)'];
    }
    if (/classif|primary|secondary|tertiary|isomer|cfc|ozone|compare|summary/.test(txt)) {
      return ['sort-classify', 'Classify halogenoalkanes (1°/2°/3°) or match reagents/conditions to products', 'Predict product type under aqueous vs ethanolic NaOH', 'Match reagents, solvents, and major organic products', 'Strengthens synthesis-map recall & condition discrimination', 'sort-classify productionVersion is currently null (needs activation)', '1.0.0 (NOT ACTIVATED)'];
    }
    return ['diagram-hotspots', 'Inspect labelled structural diagram and identify reactive C–X site', 'Predict where nucleophile attacks on the polarised C–X bond', 'Tap functional group / reactive site on diagram', 'Builds visual recognition of organic functional groups', 'Static hotspot regions on SVG/image', '1.0.0 (LIVE)'];
  }
  if (lessonId === 'cambridge-as-a-level-chemistry-hydrocarbons') {
    if (/free radical|initiation|propagation|termination|electrophilic|mechanism|markovnikov|carbocation/.test(txt)) {
      return ['process-stepper', 'Step through free-radical substitution or electrophilic addition stages', 'Predict major vs minor product using carbocation stability', 'Sequence mechanism steps & verify intermediate stability', 'Turns multi-step mechanisms into active guided inquiry', 'Curly-arrow animation is stage-based rather than freehand drawing', '1.0.0 (LIVE)'];
    }
    if (/combust|cracking|equation|polymer/.test(txt)) {
      return ['construction-lab (equation-balancer)', 'Balance complete/incomplete combustion or thermal cracking equations', 'Predict O2 coefficient for alkane combustion before balancing', 'Balance alkane combustion & cracking equations independently', 'Builds mastery of hydrocarbon stoichiometry', 'Requires molecular formulas (e.g. C3H8 + 5O2 -> 3CO2 + 4H2O)', '1.1.0 (LIVE)'];
    }
    if (/sigma|pi|hybrid|sp2|sp3|shape|bond angle|geometry|vsepr|isomer|cis|trans|e-z/.test(txt)) {
      return ['construction-lab (atom-bond-builder)', 'Explore tetrahedral (109.5°) vs trigonal planar (120°) molecular geometry', 'Predict bond angle change from ethane to ethene', 'Build covalent bonding & identify VSEPR geometry', 'Connects hybridisation to 3D shape & restricted C=C rotation', 'Does not render freehand 3D stereoisomer rotation', '1.2.0 (LIVE)'];
    }
    if (/boiling|trend|chain length|branching|fractional|distillation/.test(txt)) {
      return ['graph-slider', 'Explore boiling point vs carbon chain length & branching', 'Predict how chain branching affects boiling point', 'Read trend and interpolate boiling point on graph', 'Links intermolecular van der Waals forces to quantitative data', 'Uses bounded curve expression/table', '1.0.0 (LIVE)'];
    }
    if (/test|bromine|alkane|alkene|classify|compare|naming|nomenclature/.test(txt)) {
      return ['sort-classify', 'Sort alkanes vs alkenes, saturated vs unsaturated, or match IUPAC names', 'Predict bromine water colour change for alkane vs alkene', 'Classify test outcomes and isomer types independently', 'High-frequency exam discrimination practice', 'sort-classify productionVersion is currently null (needs activation)', '1.0.0 (NOT ACTIVATED)'];
    }
    return ['diagram-hotspots', 'Explore labelled hydrocarbon structure / fractionating column hotspots', 'Predict which fraction condenses near top vs bottom of column', 'Identify structural feature or fraction zone on diagram', 'Improves active visual reading of chemical diagrams', 'Static hotspot coordinates', '1.0.0 (LIVE)'];
  }
  if (lessonId === 'b8-sci-t1-atoms-and-the-periodic-table') {
    if (/bohr|shell|electron|proton|neutron|atomic number|mass number|ion|isotope/.test(txt)) {
      return ['construction-lab (atom-bond-builder)', 'Build Bohr atom (protons, neutrons, electron shells 2,8,8)', 'Predict net charge when an electron is lost or gained', 'Construct specified element or ion independently', 'Directly turns abstract atomic structure into concrete manipulation', 'Bounded to elements Z = 1..20 (exact fit for JHS!)', '1.2.0 (LIVE)'];
    }
    if (/group|period|metal|non-metal|metalloid|periodic|classify/.test(txt)) {
      return ['sort-classify', 'Sort elements into metals, non-metals, and metalloids or match groups', 'Predict reactivity/conductivity group from valence electrons', 'Classify first 20 elements by family/properties', 'Reinforces periodic table patterns', 'sort-classify productionVersion is currently null (needs activation)', '1.0.0 (NOT ACTIVATED)'];
    }
    return ['diagram-hotspots', 'Explore labelled atomic/periodic diagram hotspots', 'Predict subatomic particle location & charge', 'Identify nucleus, shells, and periodic table regions', 'Strengthens structural vocabulary', 'None', '1.0.0 (LIVE)'];
  }
  if (lessonId === 'b7-sci-t4-electronic-components-and-circuits') {
    if (/circuit|led|resistor|switch|series|parallel|battery|open|closed|current/.test(txt)) {
      return ['construction-lab (electrical-circuit)', 'Place battery, switch, resistor, and LED/lamp in bounded DC circuit slots', 'Predict whether the LED lights when switch is open vs closed or reversed', 'Build a working closed DC circuit with protective resistor', 'Genuine live circuit simulation with Ohm-law current check', 'Bounded DC topologies (no oscilloscope/AC)', '1.1.0 (LIVE)'];
    }
    if (/symbol|component|capacitor|diode|transistor|classify/.test(txt)) {
      return ['sort-classify', 'Match electronic component names, symbols, and functions', 'Predict which component protects an LED from excess current', 'Match components to real-world functions', 'Builds rapid circuit-symbol fluency', 'sort-classify productionVersion is currently null (needs activation)', '1.0.0 (NOT ACTIVATED)'];
    }
    return ['diagram-hotspots', 'Tap parts of circuit diagram and inspect current path', 'Predict where current stops in a broken circuit', 'Identify circuit components on schematic', 'Improves schematic literacy', 'None', '1.0.0 (LIVE)'];
  }
  if (lessonId === 'b7-sci-t1-living-cells') {
    if (/organelle|nucleus|cytoplasm|membrane|chloroplast|vacuole|cell wall|mitochondria|plant|animal/.test(txt)) {
      return ['diagram-hotspots', 'Explore animal & plant cell organelles with structure-to-function popups', 'Predict which organelles are unique to plant cells', 'Identify organelle from function prompt on cell diagram', 'Builds accurate organelle recognition without memorisation alone', 'None', '1.0.0 (LIVE)'];
    }
    if (/compare|difference|similar|specialised|classify|tissue|organ/.test(txt)) {
      return ['sort-classify', 'Sort organelles into Animal-only, Plant-only, or Both (overlapping sets!)', 'Predict whether a root hair cell has chloroplasts', 'Classify cell structures & specialised cells independently', 'Tests overlapping-set reasoning cleanly', 'sort-classify productionVersion is currently null (needs activation)', '1.0.0 (NOT ACTIVATED)'];
    }
    return ['process-stepper', 'Step through microscope focusing or cell-to-organism organisation levels', 'Predict next level of biological organisation', 'Order levels from cell to organism', 'Clarifies hierarchical biological organisation', 'None', '1.0.0 (LIVE)'];
  }
  if (lessonId === 'b8-sci-t1-the-carbon-cycle') {
    if (/photosynthesis|respiration|combustion|decomposition|fossil|cycle|pathway/.test(txt)) {
      return ['process-stepper', 'Step through carbon transfer stages and track atmospheric CO2 state', 'Predict whether atmospheric CO2 rises or falls during deforestation', 'Trace carbon atom path from atmosphere -> plant -> animal -> atmosphere', 'Visualises conservation of carbon across reservoirs', 'Qualitative/bounded state model', '1.0.0 (LIVE)'];
    }
    if (/equation|glucose|co2|oxygen/.test(txt)) {
      return ['construction-lab (equation-balancer)', 'Balance photosynthesis or aerobic respiration equation', 'Predict number of O2 molecules released per glucose molecule', 'Balance 6CO2 + 6H2O -> C6H12O6 + 6O2', 'Connects carbon cycle to quantitative stoichiometry', 'None', '1.1.0 (LIVE)'];
    }
    if (/emission|greenhouse|balance|rate|temperature/.test(txt)) {
      return ['graph-slider', 'Adjust emission vs reforestation sliders to observe net CO2 trend', 'Predict net atmospheric CO2 when emissions exceed sinks', 'Find slider balance achieving zero net CO2 rise', 'Connects human activity to measurable environmental change', 'Simplified linear/bounded model', '1.0.0 (LIVE)'];
    }
    return ['sort-classify', 'Classify processes as Carbon Sources (add CO2) vs Carbon Sinks (remove CO2)', 'Predict whether bush burning is a carbon source or sink', 'Sort real Ghanaian examples into sources vs sinks', 'Clarifies source-vs-sink distinction', 'sort-classify productionVersion is currently null (needs activation)', '1.0.0 (NOT ACTIVATED)'];
  }
  if (lessonId === 'b7-sci-t4-simple-machines-and-efficiency') {
    if (/lever|mechanical advantage|velocity ratio|efficiency|effort|load|fulcrum|work/.test(txt)) {
      return ['graph-slider', 'Vary effort distance / load to explore Mechanical Advantage and Efficiency', 'Predict how moving the fulcrum closer to the load changes required effort', 'Calculate MA = Load / Effort and Efficiency = (Work out / Work in) × 100%', 'Turns lever & efficiency formulas into visual cause-and-effect', '2D graph model (full rigid-body physics workbench is Step 5G)', '1.0.0 (LIVE)'];
    }
    if (/calculat|formula|newton|joule|percent|ratio/.test(txt)) {
      return ['math-evaluator', 'Compute MA, VR, Work Done, or Efficiency with SI units (N, J, %)', 'Predict whether real machine efficiency can exceed 100%', 'Solve multi-step efficiency calculation with exact unit check', 'Enforces exact arithmetic and unit literacy (N, m, J, %)', 'None', '1.1.0 (LIVE)'];
    }
    if (/measure|length|distance|force|mass|spring/.test(txt)) {
      return ['construction-lab (measurement-lab)', 'Read ruler/force/mass scale accurately for lever experiment data', 'Predict effect of parallax or zero error on reading', 'Take accurate scale reading with correct units', 'Integrates authentic scientific measurement practice', 'measurement-lab is 1.4.0 (productionVersion currently 1.3.0)', '1.4.0 (NOT ACTIVATED)'];
    }
    return ['sort-classify', 'Classify everyday Ghanaian tools into 1st, 2nd, and 3rd class levers', 'Predict lever class of a wheelbarrow vs scissors vs fishing rod', 'Sort simple machines by class/type independently', 'Links classroom theory to familiar local tools', 'sort-classify productionVersion is currently null (needs activation)', '1.0.0 (NOT ACTIVATED)'];
  }
  // b8-sci-t1-mixtures-and-separation
  if (/filtration|distillation|evaporation|chromatography|magnet|decant|sieving|sublimation/.test(txt)) {
    return ['process-stepper', 'Step through separation apparatus stages (e.g. distillation: heat -> vaporise -> condense -> collect)', 'Predict which substance stays as residue vs passes as filtrate', 'Order steps of separating salt-sand-iron mixture', 'Builds procedural experimental reasoning', 'No fluid simulation', '1.0.0 (LIVE)'];
  }
  if (/measure|thermometer|temperature|boiling|volume|cylinder|mass|balance/.test(txt)) {
    return ['construction-lab (measurement-lab)', 'Read thermometer boiling point or measuring cylinder meniscus accurately', 'Predict whether to read top or bottom of water meniscus', 'Record volume/temperature measurement within tolerance', 'Directly tests practical lab measurement skills', 'measurement-lab is 1.4.0 (productionVersion currently 1.3.0)', '1.4.0 (NOT ACTIVATED)'];
  }
  return ['sort-classify', 'Match mixtures (sand+water, ethanol+water, ink dyes, iron+sulfur) to separation methods', 'Predict best method to separate two miscible liquids with different boiling points', 'Classify homogeneous vs heterogeneous mixtures & separation methods', 'Core JHS practical investigation skill', 'sort-classify productionVersion is currently null (needs activation)', '1.0.0 (NOT ACTIVATED)'];
}

const files = {};

// 00-README.md
files['00-README.md'] = strToU8(`# GAM EDU — Practical Curriculum Validation (PCV-1) Discovery Handover Package

- **Generated**: ${new Date().toISOString()}
- **Repository Baseline**: \`origin/fixed-version\` @ \`512fca19\` (Next.js \`15.5.29\`)
- **Live CDN Catalogue**: \`catalogueVersion: ${cat.catalogueVersion}\` (updated \`${cat.updatedAt}\`, \`${cat.entries.length}\` published lessons)
- **Scope**: Discovery & inventory of the **2 seeded A-Level Chemistry lessons** (\`105\` slides total) and all **34 seeded JHS Science lessons** (\`27\` Basic 7, \`7\` Basic 8, \`0\` Basic 9), plus full slide-level inventory and complete live CDN JSON for both Chemistry lessons and **6 recommended JHS Science pilot lessons** (\`155\` slides total).
- **Strict Non-Modification Guarantee**: No existing lesson narration, audio, images, IDs, or published CDN packages were altered. No Step 5G work commenced. No production activation metadata or release gates were changed. No secrets, credentials, or student records are included.
- **Companion Archive**: Cumulative **Authoring Kit v2.5** (\`GAM-EDU-Interactive-Lesson-Authoring-Kit-v2.5.zip\`) is provided separately.
`);

// 01-current-development-checkpoint.md
files['01-current-development-checkpoint.md'] = strToU8(`# 01 — Current Development Checkpoint & Deployment Baseline

## 1. Repository & Git Baseline
- **Branch**: \`fixed-version\`
- **HEAD & \`origin/fixed-version\` SHA**: \`512fca19755dd4ae989132a0260d99e382d8732a\` (\`512fca19\`)
- **Next.js version**: \`15.5.29\`

## 2. Preserved Development Roadmap Checkpoint
- **Last reported development commit**: \`512fca19\`
- **Step 5E-A**: Implemented (\`f5150330\`); independent browser accessibility verification outstanding.
- **Step 5E-B**: Geometry educational close-out implemented (\`1e2ed1b9\`).
- **Step 5E-C**: Simultaneous equations and selectable quartile convention implemented (\`d9c64274\`).
- **Step 5F**: Primary Number Manipulatives implemented (\`d08f01f1\`).
- **Step 5G**: Physics Workbench is the next foundation development assignment (not commenced).
- **Step 5H**: Visual Programming, Art Studio and Game Zone remains planned.
- **Step 6**: Final Foundation Integration remains planned.
- **Temporary assignment**: Practical Curriculum Validation — Pilot 1 (**PCV-1**).
- **Claude Independent Audit**: Checkpoint 3 remains temporarily paused at \`baba1cdd\`; no Claude findings are marked independently verified by Gemini.

## 3. Deployment, Player, Release Gate & CDN Status
- **Production deployment commit**: Controlled manually by the owner in Vercel. Pushing to \`origin/fixed-version\` creates a Vercel preview build (if Git integration is enabled) but does **not** automatically promote to Production.
- **Does the owner need to promote before practical testing?**:
  - For **currently live engines** (\`rule-explorer 1.0.0\`, \`graph-slider 1.0.0\`, \`process-stepper 1.0.0\`, \`diagram-hotspots 1.0.0\`, \`code-playground 1.0.0\`, \`math-evaluator 1.1.0\`, \`construction-lab 1.0.0–1.3.0\` including \`equation-balancer\`, \`electrical-circuit\`, \`bio-sequence-builder\`, \`atom-bond-builder\`, \`geometry-constructor\`): these are already production-activated! However, testing **Step 5E-A accessibility fixes**, **Step 5E-B/C**, **\`sort-classify 1.0.0\`**, or **\`measurement-lab 1.4.0\`** in a live Vercel URL requires either testing on the **Vercel Preview deployment** for \`512fca19\` or an explicit owner promotion after review.
- **Lesson player**: \`NarratedLessonPlayer.tsx\` + \`CdnLessonPlayerLoader.tsx\` (supports schema \`0.3\`, \`slide.interactive\` via \`InteractiveEngineRegistry.tsx\`, Listen / Notes / Questions stages, Audio narration, SVG sanitiser DOMPurify 3.5.0, Low-Data mode, Ask Teacher guard).
- **Student Enrichment release gate**: **UNDER CONSTRUCTION** (\`src/lib/student-enrichment-release.ts\`; \`NEXT_PUBLIC_STUDENT_ENRICHMENT_RELEASED\` is NOT set). Ordinary student accounts are restricted; authenticated \`Director\`, \`Administrator\`, and \`Teacher\` staff roles can access \`/dashboard/narrated-lessons\` and \`/dashboard/narrated-lessons/[lessonId]\`.
- **CDN catalogue & asset versioning**:
  - Bucket: \`gs://gamedu-69888475-f5783.firebasestorage.app/story-spark-preview/narrated-lessons/\`
  - Live \`catalogue.json\`: \`catalogueVersion: ${cat.catalogueVersion}\`, \`updatedAt: ${cat.updatedAt}\`, \`${cat.entries.length}\` entries (\`Cache-Control: public, max-age=60, stale-while-revalidate=300\`).
  - Lesson packages: content-addressed immutable JSON \`packages/<lessonId>.<hash12>.json\` (\`Cache-Control: public, max-age=31536000, immutable\`).
  - Media assets: \`<lessonId>/audio/sXX.mp3\` and \`<lessonId>/images/sXX.webp\` (immutable CDN cache, reused automatically on re-publish via \`--skip-media\`).
`);

// 02-engine-capability-and-production-status.md
files['02-engine-capability-and-production-status.md'] = strToU8(`# 02 — Existing Engine Capability Inventory & Production Activation Status

All capabilities below reflect **actual learner-facing interactive UI** (distinguished from model-only helpers).

| # | Engine / Subtype | \`engineVersion\` | \`productionVersion\` | Status | Supported Interactions & Assessment | Limits | A-Level Chem Fit | JHS Science Fit |
|---|---|---|---|---|---|---|---|---|
| 1 | \`rule-explorer\` | \`1.0.0\` | \`1.0.0\` | **LIVE** | Toggle boolean inputs, live rule AST evaluation (\`AND/OR/NOT/XOR\`), prediction & explanation | Depth <= 6, nodes <= 32, inputs <= 8 | Moderate (condition logic) | **High** (circuits, classification rules) |
| 2 | \`graph-slider\` | \`1.0.0\` | \`1.0.0\` | **LIVE** | Adjust up to 4 sliders (44px targets), presets, live formula/piecewise/step curves, readouts, target challenge checks | Curves <= 4, samples 20..200 | **High** (BP trends, kinetics, titration/energy profiles) | **High** (MA/efficiency, CO2 balance, motion graphs) |
| 3 | \`process-stepper\` | \`1.0.0\` | \`1.0.0\` | **LIVE** | Linear/cycle/branching stages (2..10), state table (focusable), highlight cues, predictions, stage-sequence challenges | Max 10 stages, 6 state fields | **Very High** (SN1/SN2, free-radical, electrophilic addition) | **Very High** (carbon cycle, separation methods, digestion) |
| 4 | \`diagram-hotspots\` | \`1.0.0\` | \`1.0.0\` | **LIVE** | Explore & Identify modes on SVG/image with 2..12 clickable hotspots, keyboard navigation, identify prompts | Static regions (no dragging) | **High** (functional groups, fractionating column) | **Very High** (cell organelles, circuits, body systems) |
| 5 | \`code-playground\` | \`1.0.0\` | \`1.0.0\` | **LIVE** | Sandboxed iframe Python 3 (opaque origin), Cambridge Pseudocode, read-only SQLite SQL + public test cases | No network/FS; bounded ops | Low | Low (CS-focused) |
| 6 | \`math-evaluator\` | \`1.1.0\` | \`1.1.0\` | **LIVE** | Exact rational/algebraic/equation/inequality/calculus/SI-unit evaluation + multi-step working & M/A/B/ECF marking + exact 2×2/3×3 \`simultaneous-linear\` (5E-C) | Bounded AST & ops; \`simultaneous-linear\` UI input uses expression box | **High** (moles, enthalpy, yield, Kc/pH math, units) | **High** (MA, VR, efficiency, density, speed with SI units) |
| 7 | \`sort-classify\` | \`1.0.0\` | \`null\` | **DEV-ONLY** | Disjoint/overlapping buckets, 1:1 & many-to-many matching, reusable cloze tiles, multi-order sequencing | Production gate CLOSED until owner activation | **Very High** (1°/2°/3° classification, reagents/conditions) | **Very High** (metals/non-metals, plant/animal cells, sources/sinks, levers) |
| 8a | \`construction-lab: boolean-circuit\` | \`1.1.0\` | \`1.1.0\` | **LIVE** | Declarative netlist & legacy boolean circuit builder + truth-table check | Max 4 inputs, 8 gates | Low | Low (CS/electronics) |
| 8b | \`construction-lab: equation-balancer\` | \`1.1.0\` | \`1.1.0\` | **LIVE** | Whole-number stoichiometric coefficient balancing, live atom/charge count table (focusable), simplest-ratio check | Max 6 species/side, coeff <= 20; molecular formulas (not structural drawings) | **Very High** (combustion, cracking, substitution/elimination) | **High** (photosynthesis, respiration, simple reactions) |
| 8c | \`construction-lab: electrical-circuit\` | \`1.1.0\` | \`1.1.0\` | **LIVE** | Place cells, switches, resistors, lamps/LEDs, ammeters in DC topologies; live Ohm-law current & LED polarity check | Bounded DC topologies only | Low | **Very High** (B7 Electronic Components & Circuits!) |
| 8d | \`construction-lab: bio-sequence-builder\` | \`1.1.0\` | \`1.1.0\` | **LIVE** | DNA complementary strand, mRNA transcription, codon translation, food-chain/trophic sequence builder | Max length 30 | Low | **High** (ecosystems/food chains, genetics) |
| 8e | \`construction-lab: atom-bond-builder\` | \`1.2.0\` | \`1.2.0\` | **LIVE** | 5 modes: Bohr atomic structure (Z=1..20), ionic transfer, covalent Lewis sharing, VSEPR molecular geometry, molecular polarity | Z = 1..20; bounded covalent pairs; no 3D freehand orbital editor | **High** (bond polarity C–X, tetrahedral vs trigonal planar VSEPR) | **Very High** (B8 Atoms & Periodic Table!) |
| 8f | \`construction-lab: geometry-constructor\` | \`1.6.0\` | \`1.3.0\` | **1.3.0 LIVE / 1.6.0 DEV** | Compass/straightedge, transformations, coordinates, circle theorems (1.3.0 LIVE); RHS/protractor, 3 extra theorems, loci/feasible regions, cube nets (1.6.0 DEV) | 2D Euclidean SVG plane | Low | Low (Maths-focused) |
| 8g | \`construction-lab: measurement-lab\` | \`1.4.0\` | \`1.3.0\` | **DEV-ONLY** | Ruler, vernier callipers, micrometer, measuring cylinder (meniscus), thermometer, balance, stopwatch, protractor, ammeter/voltmeter | Production gate CLOSED until 1.4.0 activation; browser scale visual check open | **Moderate** (thermometer, burette/cylinder readings) | **Very High** (measurement in mixtures, levers, practicals) |
| 8h | \`construction-lab: data-stats-lab\` | \`1.5.0\` | \`1.3.0\` | **DEV-ONLY** | Probability experiments, descriptive stats (+ selectable \`positional-n-plus-1\` quartiles), 8 chart types, scatter/regression | Production gate CLOSED until 1.5.0 activation | **Moderate** (experimental data plots, scatter/trends) | **Moderate** (experimental data tables & graphs) |
| 8i | \`construction-lab: number-manipulative\` | \`1.7.0\` | \`1.3.0\` | **DEV-ONLY** | 9 CPA primary maths modes (ten frames, bonds, base-ten, number line, arrays/remainders, fractions/decimals, GH₵ money, analogue clock, patterns) | Production gate CLOSED until 1.7.0 activation | Not applicable | Primary Maths (B1–B6) |

*Note on \`math-evaluator\` \`simultaneous-linear\`*: The solver and evaluator are implemented and verified by the 10,200-case oracle, but \`MathEvaluatorEngine.tsx\` currently handles the 6 earlier UI modes; rendering \`simultaneous-linear\` in a dedicated UI prompt box would require a small UI dispatch case if authored in a live lesson.
`);

// 03-a-level-chemistry-inventory.md & 04-a-level-chemistry-slide-details.md
const chemInvLines = ['# 03 — Seeded A-Level Chemistry Lessons Inventory (Live CDN Ground Truth)', ''];
const chemSlideLines = ['# 04 — Complete A-Level Chemistry Slide-by-Slide Inventory (105 Slides)', ''];
for (const id of CHEM_IDS) {
  const entry = cat.entries.find((e) => e.lessonId === id);
  const lesson = loadLesson(id);
  const slides = lesson.slides || [];
  const audioCount = slides.filter((s) => s.narration?.audioUrl).length;
  const illusCount = slides.filter((s) => s.visual?.imageUrl || s.visual?.type === 'illustration').length;
  const svgCount = slides.filter((s) => s.visual?.svgCode).length;
  const cpCount = (lesson.checkpoints || []).length;
  const cpItems = (lesson.checkpoints || []).reduce((a, c) => a + (c.items?.length || 0), 0);
  const mcItems = lesson.masteryCheck?.items?.length || 0;
  const localPath = path.join(REPO, '.narrated-lesson-build', id, 'lesson.json');
  const hasLocal = fs.existsSync(localPath);

  chemInvLines.push(`## ${entry.title}`);
  chemInvLines.push(`- **Exact Lesson ID**: \`${entry.lessonId}\``);
  chemInvLines.push(`- **Exact Title**: ${entry.title}`);
  chemInvLines.push(`- **Cambridge Syllabus Code & Version**: ${lesson.meta?.contentStandard || entry.contentStandard || 'Not explicitly recorded in meta'} (Subject: ${entry.subject})`);
  chemInvLines.push(`- **Curriculum Chapter / Topic**: ${lesson.meta?.topic || entry.strand || entry.title}`);
  chemInvLines.push(`- **Actual App URLs**: Staff dashboard \`/dashboard/narrated-lessons/${entry.lessonId}\` · Direct route \`/narrated-lessons/${entry.lessonId}\``);
  chemInvLines.push(`- **Source JSON Location**: ${hasLocal ? `\`.narrated-lesson-build/${id}/lesson.json\` (local working copy — lacks published CDN \`audioUrl\`/\`imageUrl\`)` : 'Published on Firebase Storage CDN only (no local `.narrated-lesson-build` copy on this machine)'}`);
  chemInvLines.push(`- **CDN Catalogue Entry**: \`catalogueVersion: ${cat.catalogueVersion}\`, \`packagePath: ${entry.packagePath}\`, \`status: ${entry.status}\`, \`updatedAt: ${entry.updatedAt}\``);
  chemInvLines.push(`- **Current Published Version (Content Hash)**: \`${entry.packageHash}\` (schemaVersion \`${lesson.schemaVersion}\`)`);
  chemInvLines.push(`- **Slides**: ${slides.length} · **Narration Segments (with MP3)**: ${audioCount} · **Illustrations**: ${illusCount} · **SVGs**: ${svgCount}`);
  chemInvLines.push(`- **Assessments**: ${cpCount} checkpoints (${cpItems} items) + 1 Mastery Check (${mcItems} items, passMark ${lesson.masteryCheck?.passMark ?? 'n/a'})`);
  chemInvLines.push(`- **Existing Interactive Activities**: **0**`);
  chemInvLines.push(`- **Current Engine Version Requirements**: None (standard narrated lesson player v0.3)`);
  chemInvLines.push(`- **Repo vs Published CDN Diff**: ${hasLocal ? 'Same 34 slides and text structure; live CDN JSON additionally includes immutable `audioUrl` and `imageUrl` CDN links stamped by `publish-lesson.ts`.' : 'No local copy in repository; live CDN JSON retrieved directly and archived verbatim in `lessons/a-level-chemistry/`.'}`);
  chemInvLines.push('');

  chemSlideLines.push(renderSlideDetails(lesson, entry));
  files[`lessons/a-level-chemistry/${id}.json`] = strToU8(JSON.stringify(lesson, null, 2));
}
files['03-a-level-chemistry-inventory.md'] = strToU8(chemInvLines.join('\n'));
files['04-a-level-chemistry-slide-details.md'] = strToU8(chemSlideLines.join('\n'));

// 05-jhs-science-seeded-catalogue.csv
const jhsHeader = [
  'lessonId', 'title', 'class', 'term', 'strand', 'contentStandard', 'indicators',
  'slideCount', 'audioCount', 'illustrationCount', 'svgCount',
  'checkpoints', 'checkpointItems', 'masteryItems', 'existingInteractives',
  'packageHash', 'notesHash', 'status', 'updatedAt', 'dashboardUrl', 'publicUrl', 'sourceJsonLocation',
];
const jhsCsvLines = [
  jhsHeader.join(','),
  ...jhsRows.map((r) => [
    r.lessonId, r.title, r.class, r.term, r.strand, r.contentStandard, r.indicators,
    r.slideCount, r.audioCount, r.imgCount, r.svgCount,
    r.checkpoints, r.checkpointItems, r.masteryItems, r.interactiveCount,
    r.packageHash, r.notesHash, r.status, r.updatedAt, r.appUrl, r.publicUrl, r.localSource,
  ].map(csvEsc).join(',')),
];
files['05-jhs-science-seeded-catalogue.csv'] = strToU8(jhsCsvLines.join('\n') + '\n');

// 06-recommended-jhs-science-pilots.md & 07-jhs-science-slide-details.md
const jhsPilotMeta = {
  'b8-sci-t1-atoms-and-the-periodic-table': {
    area: 'Chemistry (Basic 8)',
    why: 'Strong 26-slide narration + notes pack covering atomic structure, Bohr shells, periodic groups/periods, and ions — directly enhanced by concrete Bohr atom building rather than passive diagrams.',
    engines: '`construction-lab (atom-bond-builder 1.2.0 LIVE)`, `diagram-hotspots (1.0.0 LIVE)`, `sort-classify (1.0.0 DEV)`',
    concepts: 'Protons/neutrons/electrons, electron shell filling (2,8,8), atomic vs mass number, ion formation, metals vs non-metals.',
    activities: 'Build Boron/Carbon/Sodium/Chlorine atoms & ions in Atom-Bond Lab; classify first 20 elements by family.',
    limits: 'Atom-Bond Lab is bounded to Z = 1..20 (an exact match for JHS NaCCA B8!); `sort-classify` requires production activation.',
  },
  'b7-sci-t4-electronic-components-and-circuits': {
    area: 'Physics (Basic 7)',
    why: '25 slides + 3 illustrations + 22 SVGs + notes pack teaching LEDs, resistors, switches, batteries, and series/parallel circuits — ideal for authentic DC circuit construction.',
    engines: '`construction-lab (electrical-circuit 1.1.0 LIVE)`, `diagram-hotspots (1.0.0 LIVE)`, `rule-explorer (1.0.0 LIVE)`, `sort-classify (1.0.0 DEV)`',
    concepts: 'Closed vs open circuits, LED polarity, current-limiting resistors, switches, series vs parallel paths.',
    activities: 'Construct a working LED + resistor + switch circuit; predict what happens when LED polarity is reversed.',
    limits: 'Bounded DC topologies only (no AC/oscilloscope, not needed for B7).',
  },
  'b7-sci-t1-living-cells': {
    area: 'Biology (Basic 7)',
    why: '27 slides with 6 rich illustrations + 21 SVGs covering animal vs plant cells and organelles — perfect for interactive organelle exploration and overlapping-set classification.',
    engines: '`diagram-hotspots (1.0.0 LIVE)`, `process-stepper (1.0.0 LIVE)`, `sort-classify (1.0.0 DEV)`',
    concepts: 'Cell membrane, cytoplasm, nucleus, mitochondria, cell wall, chloroplast, permanent vacuole, specialised cells.',
    activities: 'Identify organelles by function on interactive plant/animal cell diagrams; sort organelles into Animal-only, Plant-only, or Both.',
    limits: '`sort-classify` requires production activation for the overlapping-set Venn/bucket activity; `diagram-hotspots` is already LIVE.',
  },
  'b8-sci-t1-the-carbon-cycle': {
    area: 'Earth & Environmental Science (Basic 8)',
    why: '26 slides + notes pack linking photosynthesis, respiration, combustion, decomposition, and climate change — directly strengthened by dynamic process stepping and source/sink balance.',
    engines: '`process-stepper (1.0.0 LIVE)`, `graph-slider (1.0.0 LIVE)`, `construction-lab (equation-balancer 1.1.0 LIVE)`, `sort-classify (1.0.0 DEV)`',
    concepts: 'Carbon reservoirs, photosynthesis vs respiration equations, fossil fuel combustion, greenhouse balance.',
    activities: 'Step through carbon transfers with live atmospheric CO2 state; balance photosynthesis equation; adjust emission vs reforestation sliders.',
    limits: 'Carbon balance graph uses a bounded pedagogical model (clearly labelled as an educational model).',
  },
  'b7-sci-t4-simple-machines-and-efficiency': {
    area: 'Physics, Scientific Measurement & Quantitative Reasoning (Basic 7)',
    why: '25 slides + 3 illustrations + notes pack covering levers, Mechanical Advantage, Velocity Ratio, Work Done, and Efficiency — ideal for testing quantitative math, sliders, and measurement.',
    engines: '`graph-slider (1.0.0 LIVE)`, `math-evaluator (1.1.0 LIVE)`, `construction-lab (measurement-lab 1.4.0 DEV)`, `sort-classify (1.0.0 DEV)`',
    concepts: '1st/2nd/3rd class levers, MA = Load/Effort, VR, Efficiency = (Work out/Work in) × 100%, friction losses.',
    activities: 'Adjust fulcrum/effort sliders to explore MA; solve efficiency calculations with SI units (N, J, %); read ruler/force scale.',
    limits: '`measurement-lab` (1.4.0) requires activation before live publish; full rigid-body physics simulation awaits Step 5G.',
  },
  'b8-sci-t1-mixtures-and-separation': {
    area: 'Chemistry, Practical Investigation & Measurement (Basic 8)',
    why: '26 slides + 3 illustrations + notes pack teaching filtration, evaporation, distillation, chromatography, and magnetic separation — tests procedural experimental reasoning and lab measurement.',
    engines: '`process-stepper (1.0.0 LIVE)`, `diagram-hotspots (1.0.0 LIVE)`, `construction-lab (measurement-lab 1.4.0 DEV)`, `sort-classify (1.0.0 DEV)`',
    concepts: 'Homogeneous vs heterogeneous mixtures, selecting separation techniques by physical property, boiling point & meniscus reading.',
    activities: 'Step through distillation & filtration apparatus; read thermometer boiling point & measuring cylinder meniscus; match mixtures to methods.',
    limits: '`measurement-lab` (1.4.0) and `sort-classify` (1.0.0) are dev-only until activated; `process-stepper` and `diagram-hotspots` are LIVE.',
  },
};

const jhsRecLines = [
  '# 06 — Recommended Representative JHS Science Pilot Lessons (6 Lessons: 3 Basic 7 + 3 Basic 8)',
  '',
  '> **Important Catalogue Fact**: The live CDN catalogue (\`catalogueVersion: ' + cat.catalogueVersion + '\`) contains **27 Basic 7** Science lessons, **7 Basic 8** Science lessons, and **0 Basic 9** Science lessons (total 34 genuinely seeded JHS Science lessons). Preview fixtures in \`public/preview-fixtures/\` are strictly separate dev-only engine test fixtures and are NOT counted as seeded lessons.',
  '',
];
const jhsSlideLines = ['# 07 — Complete Slide-by-Slide Inventory for Recommended JHS Science Pilots (155 Slides)', ''];

for (const id of JHS_PILOT_IDS) {
  const entry = cat.entries.find((e) => e.lessonId === id);
  const lesson = loadLesson(id);
  const m = jhsPilotMeta[id];
  jhsRecLines.push(`## ${entry.title} (\`${id}\`) — ${m.area}`);
  jhsRecLines.push(`- **Class / Term**: ${entry.class}, Term ${entry.term} · **Slides**: ${entry.slideCount} · **Published Hash**: \`${entry.packageHash}\``);
  jhsRecLines.push(`- **Why suitable**: ${m.why}`);
  jhsRecLines.push(`- **Proposed existing engines**: ${m.engines}`);
  jhsRecLines.push(`- **Concepts to make interactive**: ${m.concepts}`);
  jhsRecLines.push(`- **Practical student activities**: ${m.activities}`);
  jhsRecLines.push(`- **Known limitations**: ${m.limits}`);
  jhsRecLines.push('');

  jhsSlideLines.push(renderSlideDetails(lesson, entry));
  files[`lessons/jhs-science/${id}.json`] = strToU8(JSON.stringify(lesson, null, 2));
}
files['06-recommended-jhs-science-pilots.md'] = strToU8(jhsRecLines.join('\n'));
files['07-jhs-science-slide-details.md'] = strToU8(jhsSlideLines.join('\n'));

// 08-existing-student-practice-capabilities.md
files['08-existing-student-practice-capabilities.md'] = strToU8(`# 08 — Existing Student-Practice Infrastructure Audit

Inspected \`NarratedLessonPlayer.tsx\`, \`CdnLessonPlayerLoader.tsx\`, \`LessonNotesAndQuestions.tsx\`, \`InteractiveEngineRegistry.tsx\`, \`ConstructionLabShell.tsx\`, and \`types.ts\`.

## 1. Supported Practice & Assessment Capabilities
| Capability | Currently Supported? | Exact Mechanism |
|---|---|---|
| **Guided practice** | Yes | Slide-embedded \`slide.interactive\` blocks (up to 4 per slide) + \`LessonNotesAndQuestions\` worked examples with step-by-step hints & reveal |
| **Independent practice** | Yes | \`math-evaluator\` (\`independent\` / \`exam-practice\` modes), \`construction-lab\` check mode, \`sort-classify\`, plus Senior Academy deep links (\`senior-academy-map.ts\`) |
| **Prediction questions** | Yes | Built into \`ConstructionLabShell\`, \`GraphSliderEngine\`, \`ProcessStepperEngine\`, and \`MathEvaluatorEngine\` (\`prediction\` config object) |
| **Multiple-choice questions** | Yes | Native \`McqItem\` inside \`lesson.checkpoints[]\` and \`lesson.masteryCheck\` |
| **Sequencing** | Yes | Native \`SequenceItem\` inside checkpoints/masteryCheck + \`process-stepper\` & \`sort-classify\` (\`order-sequence\`) |
| **Diagram identification** | Yes | Native \`TapDiagramItem\` inside checkpoints + \`diagram-hotspots\` (\`identify\` mode) |
| **Numerical answers** | Yes | \`math-evaluator\` (\`numeric-quantity\`, SI units, sig-figs/dp), \`measurement-lab\`, \`data-stats-lab\` |
| **Mathematical working** | Yes | \`MathWorkingWorkspace.tsx\` (\`multi-step-working\` with M/A/B/ECF marking) |
| **Equation balancing** | Yes | \`construction-lab: equation-balancer\` (\`1.1.0\` LIVE) |
| **Construction-based assessment** | Yes | All 9 \`construction-lab\` domain adapters (\`Check\` button with deterministic grading) |
| **Multiple valid answers** | Yes | Supported across \`math-evaluator\`, \`sort-classify\`, \`geometry-constructor\` (reflected solutions, all 11 cube nets), \`number-manipulative\` (equivalent fractions, non-canonical base-ten, min-coin ties) |
| **Misconception-specific feedback** | Yes | Native \`onWrong[]\` misconception feedback on every checkpoint/mastery item + \`misconceptionChecks\` in \`math-evaluator\` |
| **Hints & Retry** | Yes | \`hints[]\` on all interactive engines, \`hintText\` on checkpoints, \`retryRule\` on checkpoints, Reset/Undo on all labs |
| **Mastery checks & End-of-lesson assessments** | Yes | Native \`lesson.masteryCheck\` with configurable \`passMark\` + \`Questions\` stage in \`LessonNotesAndQuestions\` (Recall/Understand/Why/Apply/Trap) |
| **Progress tracking** | Partial (Client-side) | Slide completion, checkpoint scores, and \`LessonNotesAndQuestions\` "Understood" state are stored in browser \`localStorage\` (0 Firestore writes during interactive exploration). |
| **Existing teacher resources** | Yes | \`slide.teacherNote\`, \`lesson.extensionActivity\` (hands-on practicals with materials/safety note), \`lesson.coverageMatrix\`, \`slide.askTeacherContext\` (curated FAQs + guarded Ask Teacher API). |

## 2. Integration Path & Current Limitations
- **How to integrate**: Add validated \`interactive: [ ... ]\` array entries directly onto existing slides in a new versioned lesson JSON while keeping \`lessonId\`, \`slide.id\`, \`narration\`, \`audioUrl\`, \`visual\`, \`checkpoints\`, and \`masteryCheck\` 100% intact.
- **Limitations**:
  1. Interactive activity completion inside \`slide.interactive\` is currently **practice exploration (ephemeral / 0 Firestore writes)**; \`persistCompletion\` is a reserved schema flag not yet wired to Firestore gradebooks.
  2. \`localStorage\` progress is device-local (does not roam across devices or report to teacher gradebooks yet).
  3. Data cost is minimal (CDN immutable JSON + lazy-loaded engine chunks + Low-Data Mode fallback).
`);

// 09-preliminary-enrichment-opportunity-matrix.csv
const matrixHeader = [
  'lessonId', 'slideId', 'slideOrder', 'existingConcept', 'existingExplanation',
  'enrichmentOpportunity', 'proposedExistingEngine', 'suggestedLearnerAction',
  'possiblePredictionQuestion', 'possibleIndependentPractice', 'expectedLearningBenefit',
  'engineLimitation', 'requiredProductionEngineVersion',
];
const matrixRows = [matrixHeader.join(',')];
for (const id of [...CHEM_IDS, ...JHS_PILOT_IDS]) {
  const lesson = loadLesson(id);
  for (const s of lesson.slides || []) {
    const [eng, action, pred, prac, benefit, limit, reqVer] = proposeEnrichment(id, s);
    matrixRows.push([
      id,
      s.id,
      s.order,
      s.title,
      (s.purpose || s.keyIdeas?.[0] || s.onScreenText?.[0] || '').slice(0, 180),
      `Add interactive ${eng} activity directly below slide visual (preserving existing narration & SVG/image)`,
      eng,
      action,
      pred,
      prac,
      benefit,
      limit,
      reqVer,
    ].map(csvEsc).join(','));
  }
}
files['09-preliminary-enrichment-opportunity-matrix.csv'] = strToU8(matrixRows.join('\n') + '\n');

// 10-practical-testing-and-publication-plan.md
files['10-practical-testing-and-publication-plan.md'] = strToU8(`# 10 — Practical Testing, Controlled Publication & Safe Rollback Plan

## 1. Zero-Destruction Asset Preservation
- \`scripts/lessons/publish-lesson.ts\` publishes content-addressed immutable JSON files (\`packages/<lessonId>.<hash12>.json\`).
- **Original lesson versions are NEVER overwritten or deleted** on Firebase Storage CDN. Recording the original \`packageHash\` (in \`manifest.json\` and \`03/05\`) guarantees instant 1-step rollback by pointing \`catalogue.json\` back to the previous \`packagePath\` & \`packageHash\`.
- Using \`npm run lesson:publish -- <enriched.json> --skip-media\` reuses **100% of existing audio MP3s and illustration WebPs** with **0 paid AI/TTS credits**.

## 2. Recommended Safe Staff-Only Testing Workflow
1. **Stage 1 — Local / Vercel Preview Validation (0 live CDN changes)**:
   - ChatGPT designs the exact \`slide.interactive\` JSON blocks for approved slides.
   - Gemini validates every enriched lesson JSON against \`assertValidLessonInteractives\` (both \`allowDevOnlyEngines: true\` and \`false\`) and tests in a staff-authenticated local or Vercel Preview build.
2. **Stage 2 — Engine Activation Decision (Owner-Controlled)**:
   - **Zero activation needed** for enrichment using LIVE engines (\`process-stepper\`, \`diagram-hotspots\`, \`graph-slider\`, \`rule-explorer\`, \`math-evaluator 1.1.0\`, \`equation-balancer 1.1.0\`, \`electrical-circuit 1.1.0\`, \`atom-bond-builder 1.2.0\`).
   - If ChatGPT's approved design uses \`sort-classify 1.0.0\` or \`measurement-lab 1.4.0\`, those require: (a) owner promotion of \`fixed-version\` to Vercel Production, and (b) explicit activation of their \`productionVersion\` in \`interactive-schema.ts\` ONLY after verification.
3. **Stage 3 — Controlled Publication & Staff Live Review**:
   - Publish approved enriched lesson JSON with \`--skip-media\` (preserving every \`lessonId\`, \`slide.id\`, \`audioUrl\`, and \`imageUrl\`).
   - Because Student Enrichment remains **Under Construction** (\`src/lib/student-enrichment-release.ts\`), only authenticated \`Director\`, \`Administrator\`, and \`Teacher\` accounts can open \`/dashboard/narrated-lessons/<lessonId>\` to test live; ordinary student access remains restricted.
4. **Stage 4 — Instant Rollback (if ever needed)**:
   - Restore the recorded pre-enrichment \`packagePath\` and \`packageHash\` in \`catalogue.json\` (cache TTL 60s). Zero data loss, zero broken progress.
`);

// 11-current-verification-and-limitations.md
files['11-current-verification-and-limitations.md'] = strToU8(`# 11 — Current Verification Status & Honest Limitations (Section 13 Resolution)

1. **Final complete 3,868-test regression suite**:
   - On the full \`npx vitest run\` (100 files, 3,868 tests) before the final 3 version-string updates, **3,865 / 3,868** passed (97/100 files); the only 3 failures were hardcoded \`engineVersion === '1.6.0'\` assertions in \`data-stats-lab.test.tsx\`, \`geometry-constructor.test.tsx\`, and \`measurement-lab.test.tsx\`.
   - After updating those 3 assertions and clearing the TS ratchet, all 7 affected/new suites (**73 / 73 tests**) were re-run and passed, alongside \`tsc-report.mjs --ratchet\` (\`351 <= 351\`), \`check-lockfile-sync.mjs\` (OK), math oracle (\`10,200\` executed / \`9,448\` distinct, \`0\` discrepancies), and \`npm run build\` (exit 0). A fresh single-shot rerun of all 100 files together has not yet been re-executed since commit \`512fca19\`.
2. **Latest CI rules and security jobs**:
   - Local verification does not run the Firebase Emulator or GitHub Actions runner; CI workflow \`.github/workflows/foundation-verification.yml\` executes automatically on push to \`fixed-version\` (\`512fca19\`) and should be checked on GitHub Actions for emulator rules pass status.
3. **Does \`simultaneous-linear\` require a new \`math-evaluator\` engine version?**:
   - **Recommendation: YES, bump \`math-evaluator\` \`engineVersion\` to \`1.2.0\` (holding \`productionVersion\` at \`1.1.0\`) before authoring \`simultaneous-linear\` in live CDN lessons**, because older deployed \`1.1.0\` clients do not contain \`math-eval-linear-systems.ts\` or a UI renderer for \`mode: 'simultaneous-linear'\`. (Not changed during PCV-1 discovery.)
4. **Positional \`(n+1)/4\` quartile convention curriculum source evidence**:
   - Documented in Cambridge IGCSE Mathematics 0580 syllabus (Section 9.5 / specimen papers: discrete data quartiles at \`(n+1)/4\` and \`3(n+1)/4\` positions) and NaCCA SHS Core Mathematics statistics units. Default remains \`'tukey-exclusive'\`; \`'positional-n-plus-1'\` is strictly opt-in.
5. **Accessibility findings awaiting live browser re-verification**:
   - \`D-038\` (contrast), \`D-039\` (image-alt), \`D-040\` (touch targets), and \`D-042\` (scrollable regions) are implemented in source and unit-tested in \`accessibility-standards.test.tsx\`, but **live Playwright + axe-core browser re-verification remains outstanding** (local Chromium headless shell binary not installed on this machine). \`D-041\`/\`D-043\`/\`D-044\` from Claude's CP3 interim report remain untouched/open for independent audit.
6. **Is production activation required for the proposed science pilots?**:
   - **NO** for Phase-1 enrichment using already-LIVE engines (\`process-stepper 1.0.0\`, \`diagram-hotspots 1.0.0\`, \`graph-slider 1.0.0\`, \`rule-explorer 1.0.0\`, \`math-evaluator 1.1.0\`, \`equation-balancer 1.1.0\`, \`electrical-circuit 1.1.0\`, \`atom-bond-builder 1.2.0\`).
   - **YES** only if we include \`sort-classify 1.0.0\` or \`measurement-lab 1.4.0\` in live CDN lessons (which requires owner Vercel promotion + explicit \`productionVersion\` activation).
`);

// 12-curriculum-source-references.md
const refLines = [
  '# 12 — Curriculum Source References (Actually Recorded in Live CDN Lessons)',
  '',
  'Zero indicator codes or syllabus references have been invented. Every entry below is extracted directly from the live CDN lesson JSONs.',
  '',
  '## A-Level Chemistry (Cambridge International AS & A Level)',
];
for (const id of CHEM_IDS) {
  const l = loadLesson(id);
  refLines.push(`- \`${id}\` — **${l.meta?.title || id}**: \`contentStandard\`: \`${l.meta?.contentStandard || 'Not recorded'}\`, \`indicators\`: \`${(l.meta?.indicators || []).join(', ') || 'None'}\``);
}
refLines.push('', '## JHS Science (NaCCA Basic 7 & Basic 8 — All 34 Seeded Lessons)');
for (const r of jhsRows) {
  refLines.push(`- \`${r.lessonId}\` (${r.class}, T${r.term}) — **${r.title}**: \`contentStandard\`: \`${r.contentStandard || 'Not recorded'}\`, \`indicators\`: \`${r.indicators || 'None'}\``);
}
files['12-curriculum-source-references.md'] = strToU8(refLines.join('\n') + '\n');

// schemas/ — actual current interactive schemas & engines
const schemaFiles = [
  ['schemas/interactive-schema.ts', 'src/lib/narrated-lessons/interactive-schema.ts'],
  ['schemas/types.ts', 'src/lib/narrated-lessons/types.ts'],
  ['schemas/construction-schema-validator.ts', 'src/lib/construction-lab/construction-schema-validator.ts'],
  ['schemas/atom-bond-engine.ts', 'src/lib/construction-lab/atom-bond-engine.ts'],
  ['schemas/dc-circuit-engine.ts', 'src/lib/construction-lab/dc-circuit-engine.ts'],
  ['schemas/stoichiometry-engine.ts', 'src/lib/construction-lab/stoichiometry-engine.ts'],
  ['schemas/measurement-engine.ts', 'src/lib/construction-lab/measurement-engine.ts'],
  ['schemas/sort-classify-engine.ts', 'src/lib/sort-classify/sort-classify-engine.ts'],
  ['schemas/math-eval-engine.ts', 'src/lib/math-evaluator/math-eval-engine.ts'],
];
for (const [kitPath, repoPath] of schemaFiles) {
  const full = path.join(REPO, repoPath);
  if (fs.existsSync(full)) files[kitPath] = new Uint8Array(fs.readFileSync(full));
}

// assets/ — complete audio & illustration URL reference catalogue (no large MP3 duplication!)
const assetIndex = [];
for (const id of [...CHEM_IDS, ...JHS_PILOT_IDS]) {
  const l = loadLesson(id);
  for (const s of l.slides || []) {
    assetIndex.push({
      lessonId: id,
      slideId: s.id,
      audioUrl: s.narration?.audioUrl || null,
      imageUrl: s.visual?.imageUrl || null,
      visualType: s.visual?.type || null,
      hasSvg: Boolean(s.visual?.svgCode),
      svgBytes: s.visual?.svgCode ? Buffer.byteLength(s.visual.svgCode, 'utf8') : 0,
    });
  }
}
files['assets/media-asset-references.json'] = strToU8(JSON.stringify(assetIndex, null, 2) + '\n');
files['assets/live-cdn-catalogue-snapshot.json'] = strToU8(JSON.stringify(cat, null, 2) + '\n');

// manifest.json
const sortedNames = Object.keys(files).sort();
const lessonVersions = {};
for (const id of [...CHEM_IDS, ...JHS_PILOT_IDS]) {
  const e = cat.entries.find((x) => x.lessonId === id);
  lessonVersions[id] = { packagePath: e.packagePath, packageHash: e.packageHash, updatedAt: e.updatedAt, slideCount: e.slideCount };
}
const manifest = {
  packageName: 'GAM-EDU-Practical-Curriculum-Validation-PCV1-Discovery',
  generatedAt: new Date().toISOString(),
  repoCommit: '512fca19755dd4ae989132a0260d99e382d8732a',
  catalogueVersion: cat.catalogueVersion,
  catalogueUpdatedAt: cat.updatedAt,
  lessonVersions,
  fileCount: sortedNames.length + 1,
  files: sortedNames.map((n) => ({
    path: n,
    bytes: files[n].length,
    sha256: sha256(Buffer.from(files[n])),
  })),
};
files['manifest.json'] = strToU8(JSON.stringify(manifest, null, 2) + '\n');

const zipBytes = zipSync(files, { level: 9 });
fs.mkdirSync(OUT_DIR, { recursive: true });
const outZip = path.join(OUT_DIR, ZIP_NAME);
fs.writeFileSync(outZip, zipBytes);
const zipDigest = crypto.createHash('sha256').update(zipBytes).digest('hex');
fs.writeFileSync(path.join(OUT_DIR, `${ZIP_NAME}.sha256`), `${zipDigest}  ${ZIP_NAME}\n`);

console.log(JSON.stringify({
  zip: outZip,
  files: sortedNames.length + 1,
  bytes: zipBytes.length,
  sha256: zipDigest,
  chemSlides: CHEM_IDS.reduce((a, id) => a + (loadLesson(id).slides?.length || 0), 0),
  jhsPilotSlides: JHS_PILOT_IDS.reduce((a, id) => a + (loadLesson(id).slides?.length || 0), 0),
  totalJhsSeeded: jhsRows.length,
}, null, 2));
