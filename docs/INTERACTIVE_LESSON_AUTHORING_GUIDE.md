# GAM EDU — Interactive Lesson JSON Authoring Guide (`slide.interactive` v1)

This guide is the authoritative reference for human curriculum authors and AI content agents generating interactive activities inside GAM EDU Narrated Lessons. Following this specification allows lessons to be validated and published via `scripts/lessons/publish-lesson.ts` with **zero application code changes**.

---

## 1. Where `slide.interactive` Lives

Inside any slide object in `lesson.slides[]`, add the optional `interactive` field as either:
- A single `SlideInteractiveConfig` JSON object, OR
- An array of up to **4** `SlideInteractiveConfig` JSON objects (`SlideInteractiveConfig[]`).

Slides without `interactive` continue working identically as standard narrated slides.

---

## 2. Supported Engine Identifiers & Production Compatibility Manifest

All eight engines in `SUPPORTED_INTERACTIVE_ENGINES` (`src/lib/narrated-lessons/interactive-schema.ts`): Steps 1–5A (`rule-explorer`, `code-playground`, `graph-slider`, `process-stepper`, `diagram-hotspots`, `construction-lab` `1.3.0`, and `math-evaluator` `1.1.0`) are verified **Production LIVE** on `https://gam-it-service.app`; Step 5B (`sort-classify` `1.0.0`) is integrated on `fixed-version` with `productionVersion: null` pending manual Vercel production promotion and live verification:

| Engine ID | Status | Installed `engineVersion` | Configured `productionVersion` | Supported `schemaVersion` | Minimum `minEngineVersion` | Use Case |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `rule-explorer` | **Production LIVE** | `1.0.0` | `1.0.0` | `1` | `"1.0.0"` | Cross-subject condition/rule toggling (CS, Chemistry, Biology, Physics, Geography, Civics) |
| `code-playground` | **Production LIVE** | `1.0.0` | `1.0.0` | `1` | `"1.0.0"` | Live sandboxed Python 3 (Pyodide), Cambridge 0478 Pseudocode, and Read-Only SQL (`SELECT`) |
| `graph-slider` | **Production LIVE** | `1.0.0` | `1.0.0` | `1` | `"1.0.0"` | Cross-subject dynamic graph, sliders, piecewise & step waveforms, readouts, predictions & compound discovery challenges |
| `process-stepper` | **Production LIVE** | `1.0.0` | `1.0.0` | `1` | `"1.0.0"` | Cross-subject linear & cyclic process/mechanism stepper with state snapshots, visual modes A/B/C, `reactionMeta`, predictions & sequencing |
| `diagram-hotspots` | **Production LIVE** | `1.0.0` | `1.0.0` | `1` | `"1.0.0"` | Cross-subject interactive WebP/PNG diagram, point/rect hotspots, structure-to-function links, progressive disclosure, Identify challenges & `nonVisualQuestion` |
| `construction-lab` | **1.3.0 Production LIVE · 1.4.0 (`measurement-lab`) & 1.5.0 (`data-stats-lab`) Integrated** | `1.5.0` | `1.3.0` (held until 1.4.0/1.5.0 live-verified) | `1` | `"1.0.0"` (legacy `boolean-circuit`) · `"1.1.0"` (Step 4D) · `"1.2.0"` (`atom-bond-builder`) · `"1.3.0"` (`geometry-constructor`) · `"1.4.0"` (`measurement-lab`) · `"1.5.0"` (`data-stats-lab`) | Legacy & declarative `boolean-circuit`, `equation-balancer`, `electrical-circuit`, `bio-sequence-builder`, `atom-bond-builder`, `geometry-constructor` (all LIVE), `measurement-lab` (9 virtual measuring instruments, Step 5C), and `data-stats-lab` (probability, descriptive stats, frequency-density histograms, box plots & linear regression, Step 5D) |
| `math-evaluator` | **Production LIVE (`1.1.0`)** | `1.1.0` | `1.1.0` | `1` | `"1.0.0"` (single-answer) · `"1.1.0"` (`multi-step-working`) | Bounded exact rational, polynomial, surd, domain, equation, interval, 7-component SI unit, significant-figure, symbolic calculus evaluator (`1.0.0`), and multi-step working/marking workspace (`1.1.0`) |
| `sort-classify` | **Integrated (`fixed-version`) — Preview Gate** | `1.0.0` | `null` (pending manual Vercel promotion) | `1` | `"1.0.0"` | Cross-subject `category-bins` (with optional overlapping set membership), `pair-matching` (1:1 or many-to-many), `cloze-tiles` (word bank with reusable tokens), and `order-sequence` (with multiple valid orderings) |

> **Version Distinction:** `engineVersion` is the version installed in the codebase; `productionVersion` is the highest version verified live on `https://gam-it-service.app` after manual Vercel promotion; `schemaVersion` is the JSON config schema format (`1`); `minEngineVersion` is the minimum engine version required by a specific slide activity.

---

## 3. Base Schema Fields (All Engines)

Strict field allowlisting is enforced — **unknown keys are rejected**.

| Field | Type | Required | Rules |
| :--- | :--- | :---: | :--- |
| `id` | `string` | **Yes** | `^[A-Za-z0-9_-]{2,64}$`. Must be **globally unique** across all slides in the lesson (including multiple activities on the same slide). |
| `engine` | `string` | **Yes** | Must be one of the seven implemented engine IDs: `rule-explorer`, `code-playground`, `construction-lab`, `graph-slider`, `process-stepper`, `diagram-hotspots` (all Production LIVE), or `math-evaluator` (Step 5A Preview Only — blocked at production publish gate while `productionVersion: null`). |
| `schemaVersion` | `number` | **Yes** | Must be `1`. |
| `minEngineVersion` | `string` | No (Required `"1.1.0"` Step 4D, `"1.2.0"` Step 4E, `"1.3.0"` Step 4F Preview) | SemVer `MAJOR.MINOR.PATCH` (e.g. `"1.0.0"`, `"1.1.0"`, `"1.2.0"`, `"1.3.0"`). Rejected if higher than the engine's `productionVersion` (at publish time) or `engineVersion` (at runtime). |
| `title` | `string` | **Yes** | At least 2 non-whitespace characters. Short student-facing heading. |
| `instructions` | `string` | **Yes** | At least 4 non-whitespace characters. Clear action prompt for the learner. |
| `accessibilityLabel` | `string` | **Yes** | At least 4 non-whitespace characters. Screen-reader landmark label (`aria-label`). |
| `fallbackText` | `string` | **Yes** | At least 4 non-whitespace characters. Educational text summary shown in Low-Data Mode or graceful fallback. |
| `hints` | `string[]` | No | Up to **6** non-empty progressive hint strings. |
| `persistCompletion` | `boolean` | No | **Reserved for future use.** Currently ignored at runtime (zero Firestore reads/writes). |

---

## 4. Engine-Specific Configuration Requirements

### A. `rule-explorer` (Cross-Subject Declarative Condition Explorer)

Extra allowed top-level fields: `subjectTag`, `inputs`, `rule`, `output`.

- `subjectTag` *(optional string)*: Short curriculum badge (e.g. `"Computer Science"`, `"Chemistry"`, `"Biology"`).
- `inputs` *(required array, 1–8 items)*: Each item allows only:
  - `id` *(required string, `^[A-Za-z0-9_-]{1,40}$`, unique within activity)*
  - `label` *(required non-empty string)*
  - `defaultValue` *(optional boolean, default `false`)*
  - `trueText` *(optional string, default `"YES"`)*
  - `falseText` *(optional string, default `"NO"`)*
- `rule` *(required Declarative AST)*:
  - Leaf node: `{ "input": "<inputId>" }` (must reference a declared `inputs[].id`)
  - Operator node: `{ "operator": "AND" | "OR" | "NOT" | "XOR", "operands": [ ... ] }`
  - **Arity rules**: `NOT` requires **exactly 1** operand; `AND`, `OR`, `XOR` require **2 to 8** operands.
  - **Complexity limits**: Maximum nesting depth **6**, maximum **32** AST nodes.
- `output` *(required object)*: Allows only:
  - `trueLabel` *(required string)*
  - `falseLabel` *(required string)*
  - `explanationTrue` *(required string)*
  - `explanationFalse` *(required string)*
  - `showBinaryValues` *(optional boolean — set `true` for CS binary `1`/`0` badges, `false` for general Science/Humanities)*

### B. `code-playground` (Python 3, Cambridge Pseudocode, Read-Only SQL)

Extra allowed top-level fields: `languages`, `pythonStarter`, `pseudocodeStarter`, `sqlStarter`, `publicTests`.

- `languages` *(required non-empty array)*: Subset of `["python", "pseudocode", "sql"]`. First item is the default active tab.
- `pythonStarter` *(optional string)*: Starter Python 3 code (executed in isolated Pyodide Web Worker).
- `pseudocodeStarter` *(optional string)*: Starter Cambridge IGCSE Pseudocode (executed in browser AST runner).
- `sqlStarter` *(optional string)*: Starter **read-only `SELECT`** SQL query. DDL/DML keywords (`DROP`, `DELETE`, `INSERT`, `UPDATE`, `ALTER`, `TRUNCATE`, `CREATE`, `ATTACH`, `DETACH`) are rejected.
- `publicTests` *(optional array, max 8 items)*: Each item allows only `{ "stdin": string, "expectedStdout": string }`.

### C. `construction-lab` (Step 4D — Production LIVE `1.1.0`)

> **Production Status:** `construction-lab` is verified live in production (`implemented: true, engineVersion: "1.1.0", productionVersion: "1.1.0"`). Existing `labKind: "boolean-circuit"` lessons without `circuitConfig` remain 100% compatible (`minEngineVersion: "1.0.0"`). All Step 4D domain adapters (`equation-balancer`, `electrical-circuit`, `bio-sequence-builder`, and declarative `boolean-circuit` with `circuitConfig`) **MUST** declare `"minEngineVersion": "1.1.0"` and now pass the production publish gate.

Shared optional fields across all Step 4D domain adapters: `subjectTag`, `modelNote`, `prediction` (`{ prompt, options (2..4), correctIndex, explanation }`), `successExplanation`.

- **`labKind: "boolean-circuit"`**:
  - **Legacy (`1.0.0` LIVE):** `{ labKind: "boolean-circuit", activityId? }` — preserves `BooleanCircuitLab.tsx` and all seeded Chapter 10 lessons unchanged.
  - **Declarative (`1.1.0` LIVE):** Add `circuitConfig` (`{ inputs (1..4), outputLabel?, allowedGates, initialGates? (<=10, cycle-free), initialOutput?, targetTruthTable (2^n binary outputs), gradingMode? ("functional-equivalence" | "specified-gate-structure"), targetNetlist?, maxGates?, successExplanation? }`). Reuses `circuit-engine.ts` with zero duplicate logic.
- **`labKind: "equation-balancer"` (`1.1.0` LIVE — Chemistry Stoichiometry & Charge Conservation)**:
  - Fields: `reactants` (1–6), `products` (1–6), `arrow?` (`"→" | "⇌" | "->"`), `maxCoefficient?` (`2..12`), `requireSimplestRatio?` (default `true`), `showAtomVisuals?`, `difficulty?` (`"foundation" | "standard" | "challenge"`).
  - Each species: `{ formula, display?, charge? (-8..+8), state? ("s"|"l"|"g"|"aq"), isElectron? }`. Validates real IUPAC element symbols, balanced parentheses (nesting ≤ 2), positive integer subscripts, and authoring-time solvability within `1..maxCoefficient`. Students adjust whole-number coefficients only (never subscripts).
- **`labKind: "electrical-circuit"` (`1.1.0` LIVE — Bounded DC Circuit Builder)**:
  - Fields: `topology` (`"series" | "parallel-2-branch" | "series-parallel"`), `supplyVoltageV` (`1..24`), `palette` (1–8 components: `wire`, `switch-open`, `switch-closed`, `resistor`, `lamp`, `ammeter`, `voltmeter` with finite `resistanceOhm` `1..1000` for resistors/lamps only), `slots` (2–8, `position`: `"main" | "branch-a" | "branch-b" | "voltmeter-probe"`), `goal?` (structural `requiredComponents` + numerical `targetTotalCurrentA`, `targetBranchACurrentA`, `targetBranchBCurrentA`, `targetVoltmeterV`), `isMisconceptionActivity?`.
  - Never uses `Infinity` in JSON; detects short circuits safely (no finite current computed through 0 Ω closed loop) and diagnoses meter misconnections. Lamps use simplified constant-resistance models with qualitative brightness.
- **`labKind: "bio-sequence-builder"` (`1.1.0` LIVE — Biological Sequence & Inheritance Builder)**:
  - Modes: `"dna-base-pairing"` (antiparallel A–T/C–G), `"dna-to-mrna"` (3′→5′ template → 5′→3′ mRNA, A→U, catches T-in-RNA), `"mrna-translation"` (standard 64-codon table, N→C polypeptide, STOP codons terminate without assigning an amino acid, `isCompleteCodingSequence?`), `"monohybrid-punnett"` (`parent1Genotype`, `parent2Genotype`, `dominantAllele`, `dominantTrait?`, `recessiveTrait?`, `inheritanceAssumption?`, ratios presented strictly as probabilities).
- **`labKind: "atom-bond-builder"` (`1.2.0` Production LIVE — Atomic & Molecular Bonding Laboratory)**:
  - **Required:** `"minEngineVersion": "1.2.0"`, `"curriculumLevel": "introductory" | "igcse" | "as-a-level"`, and `"mode"`:
    - `"atomic-structure"`: `representation` (`"shells"` for `Z = 1..20` simplified first-20 filling model, or `"subshells"` for `Z = 1..30` `1s..3d` with Cr/Cu anomalies and `4s`-before-`3d` cation ionisation), `targetElement`, `targetMassNumber` (physically verified isotopes unless `allowHypotheticalIsotope: true`; flags radioactive Carbon-14), `targetCharge?`, `lockNucleus?`.
    - `"ionic-bonding"`: up to **6 ions** (`NaCl`, `MgO`, `MgCl₂`, `CaCl₂`, `Al₂O₃`), `cationElement`, `anionElement`, `targetCationCount`, `targetAnionCount`, `targetCationCharge`, `targetAnionCharge`, `requireSimplestRatio?` (default `true`; rejects electrically neutral non-simplest ratios like `Na₂Cl₂`). Framed as extended ionic lattice empirical composition, never isolated molecules.
    - `"covalent-bonding"`: `2..8` atoms (`Z = 1..30, Br, I`), single/double/triple/dative bonds, learner-controlled lone pairs, `formulaDisplay` consistency check, `netCharge?`, `octetPolicy` (`"strict-duet-octet"` | `"electron-deficient"` | `"expanded-octet"`), atom-specific `minValenceElectrons`/`maxValenceElectrons` (`BF₃`, `PCl₅`, `SF₆`), coordinate donor/acceptor validation (`NH₃ + H⁺ → NH₄⁺`), `referenceBonds?`. Odd-electron radicals and resonance hybrids are rejected cleanly.
    - `"molecular-geometry"`: bounded VSEPR (`stericNumber 2..6`, multiple bonds count as 1 domain), `centralElement`, `surroundingElements` (2–6), `targetBondingDomains`, `targetLonePairs`, `targetElectronGeometry`, `targetMolecularShape`, `targetBondAngleLabel`, `checkPolarity?`, `expectedPolar?`. Evaluates polarity via true 3D VSEPR unit-vector Pauling dipole summation (`CO₂` non-polar vs `HCN` polar; `CH₄` non-polar vs `CH₃Cl` polar).
  - **Scientific Model Disclaimers (Mandatory):**
    - Electronegativity-based molecular polarity calculations are simplified educational approximations, not exact experimental dipole-moment predictions.
    - The supported element registry (`Z = 1..30`, plus `Br`, `I`) does not imply unrestricted validation of transition-metal bonding or coordination complexes.
    - Individual orbital spin-box construction, resonance hybrids, odd-electron radicals, molecular orbital (MO) theory, and heavyweight 3D molecular viewers remain outside the approved scope.
  - **Existing engines reused (no duplication):** Metallic bonding & Intermolecular Forces (noting London dispersion forces occur between ALL molecules) use existing LIVE `diagram-hotspots`, `process-stepper`, `rule-explorer`, and `graph-slider`.
- **`labKind: "geometry-constructor"` (`1.3.0` Production LIVE — Geometry Construction Laboratory)**:
  - **Required:** `"minEngineVersion": "1.3.0"`, `"curriculumLevel": "introductory" | "igcse" | "as-a-level"` and `"mode"`:
    - `"compass-straightedge"`: `gridBounds`, `initialPoints` (`1..60`), `initialSegments?` (`<= 80`), `constructionGoal` (`perpendicular-bisector`, `angle-bisector`, `triangle-sss`, `triangle-sas`, `triangle-asa`, `locus-circle`, `parallel-line`, `perpendicular-through-point`), `requireConstructionArcs?` (verifies genuine equal-radius / intersecting arc provenance, never merely counting unrelated arcs), `distanceTolerance?` (`0.01..1.0`), `angleToleranceDeg?` (`0.1..5.0`). Validates SSS/SAS/ASA triangle feasibility at authoring time and accepts both mirrored orientations.
    - `"transformations"`: `gridBounds` (with `step` in `(0, 5]`), `preImageVertices` (`3..8`, simple non-self-intersecting polygon), `transformation` (`translation`, `reflection` across `x-axis`, `y-axis`, `y = x`, `y = −x`, `x = k`, `y = k`, `rotation` about arbitrary `(cx, cy)`, `enlargement` with non-zero `scaleFactor`, including fractional and negative scale factors), `requireLabelledCorrespondence?`. Enforces authoring-time grid reachability (`isReachableOnGrid`) and in-bounds checks for every expected image vertex.
    - `"coordinate-geometry"`: `gridBounds`, `coordGoal` (`midpoint`, `parallel-through-point`, `perpendicular-through-point`, `line-from-equation`). Uses general line form `ax + by + c = 0` so horizontal and vertical perpendicular lines never produce `Infinity` or `NaN` (vertical gradients report `"undefined (vertical)"`).
    - `"circle-theorems"`: `circleTheorem` (`angle-at-centre`, `semicircle-90`, `same-segment`, `cyclic-quadrilateral`, `tangent-radius`), `fixedAnglesDeg`, `movablePointAngleDeg`, `targetPrompt`, `expectedAngleDeg?` (cross-checked against derived mathematical angle at authoring time), `angleToleranceDeg?`. Enforces arc/chord domain guards (major vs minor/reflex arc, non-crossing cyclic quadrilateral).
  - **Existing engines reused (no duplication):** 3D solid geometry nets reuse existing LIVE `process-stepper` / `diagram-hotspots`.

### D. `graph-slider` (Step 4A — Production LIVE `1.0.0`)

> **Production Status:** `graph-slider` is verified live in production (`implemented: true, engineVersion: "1.0.0", productionVersion: "1.0.0"`).

Extra allowed top-level fields: `subjectTag`, `modelNote`, `xVar`, `axes`, `sliders`, `curves`, `readouts`, `prediction`, `challenges`, `samples`, `showDataTable`.

- `axes` *(required)*: `{ xLabel, xUnit?, xMin, xMax, yLabel, yUnit?, yMin, yMax }` (`xMax > xMin`, `yMax > yMin`).
- `sliders` *(optional, 0–4 items)*: `{ id, label, min, max, step, defaultValue, unit?, presets? }` (`step > 0`, `min <= defaultValue <= max`, `presets` within `[min, max]`).
- `curves` *(required, 1–4 items; max 8 total curves per slide)*:
  - `kind`: `"formula"` (default), `"piecewise"` (2–24 `{ x, y }` points), or `"step"` (2–24 `{ x, y }` discrete step-line points).
  - `color`: strict 6-digit hex (`#RRGGBB`); `style`: `"solid" | "dashed" | "dotted"`; `isReference?: boolean`; `domainMin?`, `domainMax?`; `stopAtYZero?: boolean` (for projectile landing root bisection — never stops at initial launch point).
- `readouts` *(optional, 0–4 items)*: `{ id, label, expr, unit?, precision? (0..4) }`.
- `prediction` *(optional Predict-before-Experiment prompt)*: `{ prompt, options (2..4), correctIndex, explanation }`.
- `challenges` *(optional, 0–3 items)*: `{ id, prompt, check: { operator: "AND" | "OR", conditions (1..4) }, successText, hintText? }`. Each condition targets one `sliderId` or `readoutId` with `min`/`max` or `target` + `tolerance`.
- **Safe Mathematical Expression Grammar** (`src/lib/narrated-lessons/math-expr.ts`, zero `eval()`):
  - **Precedence (lowest → highest):** `+`/`-` (left) → `*`/`/` (left) → unary `+`/`-` (binds looser than `^`, so `-2^2 = -4`, `(-2)^2 = 4`) → `^` (right-associative, `2^3^2 = 512`, `2^-3 = 0.125`) → primary.
  - **Constants:** `PI`, `E`.
  - **Unary functions (arity = 1):** `abs`, `sin`, `cos`, `tan`, `sqrt`, `ln`, `log10`, `exp`, `deg2rad`, `rad2deg`, `floor`, `ceil`, `round`. (Trig uses radians internally; use `deg2rad(theta)` for degrees.)
  - **Multi-arg functions (arity = 2..4):** `min`, `max`.
  - **Limits:** Max AST depth **8**, max **48** AST nodes, max **200** sample points per curve, max `24,576` bytes per activity.
  - **Mathematical Status Distinction (`evaluateMathAstDetailed`):**
    - `undefined`: mathematically undefined operations (`1/0`, `ln(0)`, `log10(0)`, `tan(PI/2)`, `0^-1`) → displays `"Undefined"`.
    - `outside-real-domain`: operations outside the supported real numbers (`sqrt(-4)`, `ln(-2)`, `(-2)^0.5`) → displays `"Outside real domain"`.
    - `exceeds-numeric-limit`: mathematically valid results exceeding `±1e12` or `|exponent| > 100` (e.g. `10^50`) → displays `"Exceeds numeric limit"` (never mislabelled as mathematically undefined).
  - **Deferred in v1.0:** Parametric plotting `(x(t), y(t))` and continuous animation loops (e.g., Solar System orbital animation) are intentionally deferred.

### E. `process-stepper` (Step 4B — Production LIVE `1.0.0`)

> **Production Status:** `process-stepper` is verified live in production (`implemented: true, engineVersion: "1.0.0", productionVersion: "1.0.0"`).

Extra allowed top-level fields: `subjectTag`, `modelNote`, `mode`, `visualMode`, `sharedVisual`, `stages`, `sequenceChallenge`.

- `mode` *(required)*: `"linear"` (stops at final stage with Replay) or `"cyclic"` (wraps cleanly from final stage back to Stage 1 with explicit cycle-restart notice).
- `visualMode` *(optional, default `"diagram"`)*:
  - `"diagram"` (Mode A): Auto-generated accessible linear/cyclic flow overview highlighting active & visited stages (visited ≠ mastery).
  - `"stage-illustrations"` (Mode B): Renders stage-specific `stage.visual` (`{ src, altText, caption? }`) from approved WebP/PNG paths with Enlarge lightbox.
  - `"shared-highlight"` (Mode C): Renders `sharedVisual` with a declarative bounded `stage.highlightRegion` (`{ xPct, yPct, widthPct, heightPct, label }`, all within `0..100%`) and Enlarge lightbox.
- `stages` *(required, 2–10 items, unique IDs)*:
  - Required: `id`, `title`, `summary`.
  - Optional pedagogy: `shortLabel`, `equation` (highlighted chemical/algebraic equation, ≤ 180 chars), `startingCondition`, `whatChanges`, `whyItMatters`, `connectionToNext`, `commonMisconception`, `inputs[]`, `outputs[]`.
  - Optional `reactionMeta` *(for A-Level Chemistry & Biology mechanisms)*: `{ reactants?, intermediates?, products?, bondsBroken?, bondsFormed?, electronMovement? }` (up to 4 strings per list, ≤ 120 chars each; `electronMovement` ≤ 200 chars). Supports electrophilic addition, nucleophilic substitution, peptide bond condensation/hydrolysis, DNA replication, transcription/translation, polymerisation, and electrolysis cleanly with approved WebP/PNG diagrams and zero 3D/molecular simulator bloat.
  - Optional `stateSnapshot` *(0–6 items)*: `[{ id, label, value }]` (rejects prototype keys like `constructor`/`__proto__`; values ≤ 80 chars; renders accessible textual diff badges `"Changed (was ...)"`, `"New in this stage"`, `"Removed"`, `"Unchanged"`).
  - Optional `prediction` *(max 3 across activity)*: `{ prompt, options (2..4), correctIndex, explanation }` (non-blocking).
- `sequenceChallenge` *(optional, max 1)*: `{ id, prompt, stageIdsToOrder (2..6 valid stage IDs), explanation }` — keyboard-accessible `Move Up`/`Move Down` controls (zero drag-and-drop).
- **Deferred in v1.0:** Stage-specific audio tracks (deferred to avoid competing with `NarratedLessonPlayer` main narration audio), branching state machines, and continuous animation.

### F. `diagram-hotspots` (Step 4C — Production LIVE `1.0.0`)

> **Production Status:** `diagram-hotspots` is verified live in production (`implemented: true, engineVersion: "1.0.0", productionVersion: "1.0.0"`).

Extra allowed top-level fields: `subjectTag`, `modelNote`, `diagram`, `defaultMode`, `progressiveDisclosure`, `guidedOrder`, `hotspots`, `identifyPrompts`.

- `diagram` *(required)*: `{ src, altText, identifyAltText?, caption? }` — approved **WebP or PNG** path only (validated by shared `visual-region.ts`; raw SVG markup, untrusted external URLs, `..` and `%2e`/`%2f` traversal are rejected). In Identify mode before checking, `identifyAltText` (or a neutral unlabelled fallback) replaces `altText` and `caption` is hidden so answers never leak to screen readers or captions.
- `hotspots` *(required, 2–12 items, unique IDs)*:
  - Point hotspot: `{ id, label, xPct, yPct, summary, ... }` (`0..100%` relative to the rendered image).
  - Rectangular hotspot: add `widthPct`, `heightPct` (`> 0`, `xPct + widthPct <= 100`, `yPct + heightPct <= 100`).
  - Optional pedagogy: `functionText`, `structureToFunction`, `equation` (≤ 180 chars), `commonMisconception`, `linkedHotspotIds` (max 6 valid non-self IDs), `relationshipExplanation`, `discoveryPrompt`.
- `guidedOrder` *(optional)*: ordered array of hotspot IDs for `Prev Part` / `Next Part` guided tours.
- `progressiveDisclosure` *(optional boolean)*: starts on a clean diagram so learners observe before revealing markers.
- `identifyPrompts` *(optional, 0–6 items)*: `{ id, prompt, targetHotspotId, explanation, hintText?, nonVisualQuestion? }`.
  - Before checking, **all pin & list labels are concealed as `Region 1`, `Region 2`…** and `caption`/`altText` are concealed so answers never leak.
  - `nonVisualQuestion` *(optional, recommended for every Identify prompt)*: `{ prompt, options (2..4), correctIndex, explanation? }` — provides a genuinely equivalent conceptual text-only identification question toggleable for screen-reader and nonvisual learners.
- **Deferred in v1.0:** Freeform polygon hitboxes, in-app diagram editing, 3D molecular viewers, and synchronised side-by-side diagram comparison.

### G. `sort-classify` (Step 5B — Integrated on `fixed-version`, `productionVersion: null`)

> **Production Status:** `sort-classify` (`engineVersion: "1.0.0"`, `productionVersion: null`) is integrated into `fixed-version` and previewable at `/narrated-lessons/sort-classify-pilot-preview` (which fails closed with `404` in production). It remains blocked at the production publish gate until manually promoted to Vercel and verified live.

Extra allowed top-level fields: `subjectTag`, `curriculumLevel`, `mode`, `prediction`, `successExplanation`, `bins`, `items`, `allowMultipleBinsPerItem`, `leftItems`, `rightItems`, `expectedMatches`, `allowManyToMany`, `template`, `blanks`, `tokens`, `reusableTokens`, `acceptedOrders`.

- **`mode: "category-bins"`**:
  - `bins` *(2–6 items)*: `{ id, label, description? }`
  - `items` *(2–24 items)*: `{ id, label, validBinIds: string[], misconceptionByBin?: Record<string, string> }`
  - `allowMultipleBinsPerItem?` *(boolean, default `false`)*: when `true`, learners may place an item into multiple bins (e.g. overlapping sets / prime & even numbers / amphoteric oxides) and grading checks exact set equality against `validBinIds`.
- **`mode: "pair-matching"`**:
  - `leftItems` *(2–12)*, `rightItems` *(2–12)*: `{ id, label }`
  - `expectedMatches` *(1–24)*: `{ leftId, rightId }`
  - `allowManyToMany?` *(boolean, default `false`)*: supports 1:1 or many-to-many matching cleanly.
- **`mode: "cloze-tiles"`**:
  - `template` *(string with `{{blankId}}` placeholders)*
  - `blanks` *(1–12 items)*: `{ id, acceptedTokenIds: string[], misconceptionByToken?: Record<string, string> }` (each blank may accept multiple valid tokens).
  - `tokens` *(2–24 items)*: `{ id, label }`
  - `reusableTokens?` *(boolean, default `false`)*: when `false`, each token can be used in at most one blank; when `true`, tokens can be reused across blanks.
- **`mode: "order-sequence"`**:
  - `items` *(3–12 items)*: `{ id, label }`
  - `acceptedOrders` *(1–8)*: each a complete permutation of `items[].id` (supports multiple equally valid chronological, algorithmic, or experimental sequences).

---

## 5. Resource Limits

| Limit | Maximum |
| :--- | :---: |
| Serialized JSON size per activity | **24,576 bytes (24 KB)** |
| Interactive activities per slide | **4** |
| `rule-explorer` inputs | **8** |
| `rule-explorer` AST nesting depth | **6** |
| `rule-explorer` total AST nodes | **32** |
| `hints` per activity | **6** |
| `publicTests` per `code-playground` | **8** |

---

## 6. Security, Accessibility & Low-Data Requirements

1. **Zero Teacher Secrets in Public JSON**: Keys such as `teacherReference`, `teacherPseudocode`, `gradingTests`, `solutionSql`, `teacherSolutions`, `hiddenTests`, `answerKey`, `modelSolution`, and `rubricAnswers` are recursively blocked at publish and runtime. Public student guidance (`hints`, `publicTests`, `explanationTrue`, `explanationFalse`) is allowed.
2. **Educational Code vs. Application Code**: Legitimate CS text or sandboxed starter code may mention programming concepts (e.g. explaining why `eval()` is dangerous) safely because all text is rendered via React text nodes (never `dangerouslySetInnerHTML`) and starter code runs inside isolated sandboxes. Executable URL protocols (`javascript:`, `vbscript:`, `data:text/html`) are always blocked.
3. **Accessibility**: Always provide meaningful `accessibilityLabel` and `instructions`. Never rely on color alone — provide clear `trueText`/`falseText` and `trueLabel`/`falseLabel`.
4. **Low-Data Mode**: Every activity **must** provide a pedagogically useful `fallbackText` so learners on 2G/3G networks in Low-Data Mode receive the full conceptual takeaway without downloading heavy lab chunks (with an opt-in button to load the engine manually).

---

## 7. State, Reset & Progress Behaviour

- **Ephemeral Local State**: `rule-explorer` holds toggle state in local React state (resettable via the Reset button; **0 Firestore reads/writes**).
- **Slide Navigation**: Navigating away from a slide unmounts its interactive widget; returning restores the configured `defaultValue` state cleanly.
- **Shared-Computer Draft Isolation (`code-playground`)**:
  - For authenticated users, drafts are stored in `localStorage` scoped strictly by school and user: `gam:inline-code:v2:${schoolId}:${userId}:${lessonId}:${activityId}:${mode}` (students sharing a school computer never see another student's drafts; 0 Firestore writes).
  - For unauthenticated/public preview sessions, drafts are stored in tab-scoped `sessionStorage` (`gam:inline-code:v2:session:...`) and cleared automatically when the tab closes.
- **Multiple Activities per Slide**: Each item in `slide.interactive[]` mounts with its own `id` key and completely isolated state.
- **`persistCompletion` Status**: **Reserved (not yet implemented).** Existing lesson step/checkpoint/mastery progress restoration (`localStorage` + `resolveRestoredStepIndex`) continues working unchanged.

---

## 8. Built-in Read-Only SQL Fixture (`Stock` Table)

The inline SQL runner executes read-only `SELECT` queries against GAM EDU's built-in `Stock` table (`src/lib/sql-practice/igcse-sql-engine.ts`):

| ItemID | ItemName | Colour | Quantity | Price | Ordered |
| :--- | :--- | :--- | :-: | :-: | :-: |
| `A01` | Pen | Blue | 12 | 2.5 | 0 |
| `A02` | Ruler | Red | 5 | 4.0 | 1 |
| `A03` | Book | Blue | 20 | 8.0 | 0 |
| `A04` | Bag | Red | 5 | 35.0 | 0 |
| `A05` | Pencil | Green | 0 | 1.5 | 1 |

**Expected result** for `SELECT ItemName, Price FROM Stock WHERE Quantity < 6 ORDER BY Price DESC;`:

| ItemName | Price |
| :--- | :-: |
| Bag | 35 |
| Ruler | 4 |
| Pencil | 1.5 |

---

## 9. Production Engine Compatibility & Rollback Policy

- **Production-First Rule**: Never publish a live CDN lesson requiring an engine or `minEngineVersion` that has not yet been deployed and verified in production. `SUPPORTED_INTERACTIVE_ENGINES[id].productionVersion` tracks the highest version verified in production (`null` for dev-branch-only or Step 4 reserved engines), and `assertValidLessonInteractives` rejects any lesson whose engine or `minEngineVersion` exceeds `productionVersion`.
- **Rollback Implications**: Once live CDN lessons depend on `slide.interactive`, reverting the web app to a revision prior to `InteractiveEngineRegistry` (or prior to a newly published engine) would prevent those interactive widgets from mounting. Always keep `InteractiveEngineRegistry` forward-compatible (additive schema changes only) and rely on each activity's mandatory `fallbackText` for graceful degradation if an older client ever encounters a newer engine.

---

## 10. Valid & Invalid Configuration Examples

See machine-readable valid examples for all six implemented engines in [examples/interactive-lesson-examples.json](./examples/interactive-lesson-examples.json).

### Common Invalid Authoring Mistakes (Rejected by `publish-lesson.ts`)

| Mistake | Why Rejected |
| :--- | :--- |
| `"labKind": "atom-bond-builder"` or `"geometry-constructor"` | Deferred future construction extension — not yet implemented |
| Step 4D `construction-lab` domain (`equation-balancer`, `electrical-circuit`, `bio-sequence-builder`, or declarative `boolean-circuit` with `circuitConfig`) with `"minEngineVersion": "1.0.0"` | Step 4D domains require `"minEngineVersion": "1.1.0"` or higher |
| `"schemaVersion": 2` | Only `schemaVersion: 1` is supported |
| `"minEngineVersion": "2.0.0"` | Exceeds verified `productionVersion` (`1.0.0` or `1.1.0`) |
| Unknown field like `"customCss": "..."` or `"onClick": "..."` | Strict schema allowlist rejects unknown keys |
| `{ "operator": "AND", "operands": [{ "input": "a" }] }` | `AND`/`OR`/`XOR` require 2–8 operands (`NOT` requires exactly 1) |
| `{ "input": "missingId" }` | References an input ID not declared in `inputs[]` |
| Duplicate `"id"` on two activities (same slide or different slides) | Activity IDs must be unique per lesson |
| `"sqlStarter": "DROP TABLE Stock;"` | Inline SQL is strictly read-only `SELECT` |
| Including `"answerKey"` or `"hiddenTests"` | Protected teacher-only fields are prohibited in public CDN JSON |
