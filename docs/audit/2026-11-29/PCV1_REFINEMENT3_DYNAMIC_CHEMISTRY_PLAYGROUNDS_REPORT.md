# GAM EDU — PCV-1 Refinement 3: Reusable Dynamic Chemistry Playgrounds Report

**Date:** 2026-11-28  
**Branch:** `fixed-version`  
**Prior Checkpoints Preserved:**
- Foundation development checkpoint: `512fca19` (Steps 1–5F; Step 5E-A independent browser accessibility verification open)
- PCV-1 discovery checkpoint: `1bd9eaab`
- PCV-1 initial implementation: `a35a207b`
- PCV-1 Refinement 1: `5103e762`
- PCV-1 Refinement 2: `e6470751` (live CDN catalogue `v101`: Hydrocarbons `d81bff77545d`, Basic 8 Atoms `379856075c2c`)
- Claude independent Audit Checkpoint 3: paused at `baba1cdd` (untouched; 75/100 score and `VERIFICATION_REQUIRED` states preserved)
- Next foundation assignments preserved: Step 5G Physics Workbench, Step 5H Visual Programming/Art Studio/Game Zone, Step 6 Final Integration (not commenced)

---

## 1. Summary of Changes

All approved Refinement 3 capabilities were implemented inside the existing `construction-lab` architecture (`ConstructionLabShell.tsx`, `AtomBondLab.tsx`, `EquationBalancerLab.tsx`) and existing scientific modules (`atom-bond-atomic.ts`, `stoichiometry-engine.ts`, `atom-bond-schema-validator.ts`, `construction-schema-validator.ts`, `interactive-schema.ts`). Zero new engine families, zero duplicate validators, and zero lesson-specific React components were created.

### A. Complete Atomic Scientific Validation (Section 3)
- **`atom-bond-atomic.ts`:**
  - Added 3-tier `evaluationTier: 'verified' | 'unverified-consistent' | 'incorrect'` to `FreeAtomicEvaluationResult`.
  - Unsupported ions in `shells` or `subshells` mode are **never** certified as having verified ground-state configurations (`isGroundStateConfig: false`, `passed: false`, `evaluationTier: 'unverified-consistent'`).
  - Hardened input validation in **both** `evaluateFreeAtomicExploration` and `evaluateAtomicConstruction`: validates `representation`, `maxZ` bounds, safe integer particle bounds (`0..118` protons, `0..200` neutrons), exact 4-element `shells` array, and exact 7-key `subshells` map.
  - Clarified `[2, 8, 8, 2]` as a simplified first-20-element filling model (not physical shell capacities) and explained Helium (`Z = 2`) having 2 outer electrons (full first-shell duet) in Group 18.
- **`ConstructionLabShell.tsx` & `AtomBondLab.tsx`:**
  - Added 3-tier `tone?: 'verified' | 'unverified' | 'error'` feedback banner; unverified constructions render an amber informational banner (`Unverified construction:`) — never a misleading green checkmark.

### B. Shared Example-Selection Convention & 4 Dynamic Playgrounds (Sections 4–8)
- Single shared typed `examples` array (1–8 validated items, unique `id`, non-empty `label`, optional `prompt`/`modelNote`/`successExplanation`) across `atom-bond-builder` (`ionic-bonding`, `covalent-bonding`, `molecular-geometry`) and `equation-balancer`, validated at authoring time by reusing existing subtype validators.
- **Dynamic Ionic Bonding Playground:** Selectable bank (`NaCl`, `MgO`, `MgCl₂`, `CaCl₂`, `Al₂O₃`) + reusable electron-transfer teaching interaction (neutral atoms & outer electrons → electron loss/gain conservation readout → ion charges → charge balance & simplest ratio → extended 3D ionic lattice framing).
- **Dynamic Covalent Bonding Playground:** Selectable bank (`H₂`, `O₂`, `N₂`, `H₂O`, `CO₂`, `CH₄`, `NH₃`) reusing existing valence/octet/formal-charge/connectivity evaluators with coordinate-bond support preserved.
- **Dynamic Molecular Geometry Playground:** Selectable bank (`CH₄`, `CO₂`, `NH₃`, `H₂O`, `PCl₅`, `SF₆`) distinguishing electron-domain geometry vs molecular shape and idealised VSEPR vs measured lone-pair-compressed angles.
- **Dynamic Equation Balancing Playground:** Selectable validated combustion (complete `CH₄`, `C₂H₆`, `C₃H₈`, `C₄H₁₀`; incomplete `CO` and `C` soot) and cracking banks. Raised `STOICHIOMETRY_LIMITS.maxCoefficientHardCap` to `15` (keeping default `12` for backward compatibility) so genuine butane complete combustion (`2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O`) balances natively.

### C. Optional Isolated `Explore Further` Control (Section 9)
- Implemented inside `ConstructionLabShell.tsx` and wired into `AtomBondLab.tsx` and `EquationBalancerLab.tsx` (`exploreFurther?: boolean`).
- Isolated local React state (returning restores the main exercise untouched), Escape-to-close with focus restoration, 0 Firestore writes, and automatically disabled when `isAssessment: true`.

### D. Capability-Level Production Activation & Deployment Reconciliation (Section 11)
- Added lightweight optional `productionCapabilities?: Record<string, string>` on `InteractiveEngineMeta` inside the existing `SUPPORTED_INTERACTIVE_ENGINES` registry (`interactive-schema.ts`) — no second registry.
- **Current live state (pre-promotion):** `construction-lab` has `engineVersion: '1.9.0'`, `productionVersion: '1.3.0'`, and `productionCapabilities: { 'construction-lab:atom-bond-builder': '1.2.0', 'construction-lab:equation-balancer': '1.1.0' }`.
- **Safety guarantee:** Live CDN `catalogue.json` (`v101`) was **NOT** overwritten with `1.8.0`/`1.9.0` lesson JSONs prior to manual Vercel production promotion. After the owner manually promotes the Refinement 3 commit on Vercel, activating `atom-bond-builder: '1.9.0'` and `equation-balancer: '1.9.0'` unlocks the dynamic chemistry playgrounds while keeping unverified `measurement-lab 1.4.0`, `data-stats-lab 1.5.0`, `geometry-constructor 1.6.0`, and `number-manipulative 1.7.0` gated.

### E. Integration into Both Actual PCV-1 Enriched Pilot Lessons (Section 10)
- `b8-sci-t1-atoms-and-the-periodic-table.refinement3-v1.9.0.json` (26 slides): `s04` Open-Ended Atomic Playground, `s14` Periodic Table Explorer, `s21` multi-target challenges, `s23` Dynamic Ionic Bonding Playground (`NaCl`, `MgO`, `MgCl₂`, `CaCl₂`, `Al₂O₃`), `s25` Dynamic Covalent Playground (`H₂`, `O₂`, `N₂`, `H₂O`, `CO₂`, `CH₄`, `NH₃`).
- `cambridge-as-a-level-chemistry-hydrocarbons.refinement3-v1.9.0.json` (71 slides): `a06` Comparative VSEPR Playground (`CH₄`, `CO₂`, `NH₃`, `H₂O`, `PCl₅`, `SF₆`), `c01` Complete Combustion (`CH₄`–`C₄H₁₀`), `c02` Incomplete Combustion (`CO`/`C`), `e03` Thermal Cracking; retains `f01` and exam practice (`p01`, `p03`, `p09`).
- Both JSONs pass `assertValidLessonInteractives(..., { allowDevOnlyEngines: true })`, fail `allowDevOnlyEngines: false` (proving the pre-promotion gate works), and pass byte-for-byte preservation of all non-interactive fields (narration, audio, visuals, checkpoints, mastery checks). Zero paid media regenerated.

---

## 2. Verification Results (Final Corrections)

- **Portable Enriched Lesson & Refinement 3 Suite (`pcv1-refinement3-playgrounds.test.tsx`):** **12 / 12 passed** using portable repository-relative fixtures (`src/lib/narrated-lessons/__fixtures__/pcv1-refinement3/`) with zero conditional `existsSync` skips; validates both actual enriched lessons (dev pass, pre-activation prod fail, scoped activation pass), all 5 ionic compounds (`NaCl`, `MgO`, `MgCl₂`, `CaCl₂`, `Al₂O₃`) + donor/acceptor/imbalance/impossible-transfer rejection + UI clamping/Undo/Reset, genuine valid pilot fixtures for Measurement `1.4.0` / Data Stats `1.5.0` / Geometry `1.6.0` / Number Manipulative `1.7.0` remaining blocked after scoped Chemistry activation, version-omission bypass prevention, Explore Further state isolation across all 4 interfaces (`ionic`, `covalent`, `molecular-geometry`, `equation-balancer`), and `isAssessment: true` protection (disables Explore Further, hints, prediction, and example switching).
- **Complete Repository Vitest Suite (`npx vitest run --maxWorkers=2`, no concurrent build):** **Exit code 0 — 103 / 103 test files passed (3,889 / 3,889 tests passed, 0 failures, 0 unhandled worker errors)**.
- **Scoped Production Activation State (`interactive-schema.ts`):** `construction-lab` retains shared `productionVersion: '1.3.0'` with scoped `productionCapabilities: { 'construction-lab:atom-bond-builder': '1.9.0', 'construction-lab:equation-balancer': '1.9.0' }` (Measurement `1.4.0`, Data Stats `1.5.0`, Geometry 5E `1.6.0`, and Number Manipulative `1.7.0` remain blocked).
- **TypeScript Ratchet (`node scripts/audit/tsc-report.mjs --ratchet`):** **351 <= 351 (PASS, 0 new errors)**.
- **Lockfile Sync (`node scripts/audit/check-lockfile-sync.mjs`):** **OK (1,301 installed packages match `package-lock.json`)**.
- **Production Build (`npm run build`):** **Exit 0 (`156/156` static pages)**.
  - Shared First Load JS: **`103 kB`** (unchanged from `103 kB` baseline)
  - `/narrated-lessons/[lessonId]` First Load JS: **`259 kB`** (`2.07 kB` route)
- **Local Browser / Playwright Note:** Local Chromium headless shell binary (`chromium_headless_shell-1255`) remains uninstalled on this workstation; browser, mobile, accessibility, and live performance visual inspection are therefore **not claimed** and remain explicitly open pending owner practical testing and CI browser verification.

---

## 3. Controlled Production Deployment & Immutable CDN Publication (2026-11-28)

1. **Verified Production Deployment (`cd041363` on `https://gam-it-service.app`):**
   - Inspected live served Next.js chunks directly from `https://gam-it-service.app`:
     - `/_next/static/chunks/4736-aeb84a5c3dedf6f2.js` → confirmed `construction-lab:atom-bond-builder: "1.9.0"`, `construction-lab:equation-balancer: "1.9.0"`, `productionVersion: "1.3.0"`, `maxTransferableElectrons`, and `isImpossibleTransfer`.
     - `/_next/static/chunks/8171.9d37c0eb79cc600d.js` → confirmed `data-explore-further-panel` and `Unverified construction:`.
     - `/_next/static/chunks/9442.b6cf20474931f5a4.js` → confirmed `maxTransferableElectrons`.
   - Shared `construction-lab` `productionVersion` remains `1.3.0`; Measurement `1.4.0`, Data Statistics `1.5.0`, Extended Geometry `1.6.0`, and Primary Number Manipulatives `1.7.0` remain blocked.
   - Student Enrichment Under-Construction restriction remains active (`NEXT_PUBLIC_STUDENT_ENRICHMENT_RELEASED` unset).
2. **Immutable CDN Publication (`--skip-media`, 0 paid media regenerated):**
   - `b8-sci-t1-atoms-and-the-periodic-table`: uploaded `packages/b8-sci-t1-atoms-and-the-periodic-table.64fb68126435.json` (`299,799` bytes, HTTP 200; prior `379856075c2c` & original `15080192a16a` preserved HTTP 200; catalogue backup `backups/catalogue.2026-11-28T15-58-48-838Z.json`) → `catalogue.json` `v102`.
   - `cambridge-as-a-level-chemistry-hydrocarbons`: uploaded `packages/cambridge-as-a-level-chemistry-hydrocarbons.5c82c89a794b.json` (`878,913` bytes, HTTP 200; prior `d81bff77545d` & original `739c1252e89e` preserved HTTP 200; catalogue backup `backups/catalogue.2026-11-28T15-59-04-993Z.json`) → `catalogue.json` **`v103` (`49` published lessons — all 47 other lessons preserved untouched)**.
