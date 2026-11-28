# GAM EDU — Comprehensive Independent Audit (Checkpoint 1)

Date: 2026-11-28 · Starting commit: `a3706446` (`fixed-version`, equal to `origin/fixed-version`) · Auditor: Claude (Sonnet 5.5)

> **Scope honesty.** The brief covers far more than one session can verify. This report separates what was
> **executed and measured** from what was **only read** and from what was **not examined**. Nothing here is a
> claim of universal correctness. The evidence-based score at the end is **67/100**, well below the 95 target,
> mainly because large areas (browser/mobile/accessibility, performance measurement, chemistry/biology/circuit
> re-verification, Firestore-rules emulator tests, live deployment) are *unverified*, not because they are known bad.
> See `OUTSTANDING_VERIFICATION_REGISTER.md`. Work continues from `AUDIT_PROGRESS.md`.

## A. Executive summary

**Outcome:** the foundation is sound where it was tested. Mathematical evaluator, cube-net engine, statistics maths, SVG sanitiser,
release gate and core-route isolation all held up under independent attack. The audit found and fixed **9 real defects**
(3 High) — mostly in *renderers and tests*, not in the maths models — and logged 10 more.

**Principal strengths**
- Math evaluator: reproduced oracle (10,000 cases, 0 false accepts/rejects) **and** 37 new hand-derived adversarial cases all pass
  (x/x vs 1, cancellation domain loss, extraneous/lost roots, inequality reversal, sin(πx)≡0 trap, missing +C, ln|x|).
- Cube nets: independent enumeration gives exactly **35 free hexominoes, 11 foldable / 24 not**; engine agrees on all
  35 × 8 orientations × 2 translations × 2 start cells (1,120 checks).
- SVG sanitiser (DOMPurify 3.5.0): 13 existing vectors + 20 new vectors + 1,500 deterministic mutation-fuzz payloads — no live dangerous element/attribute.
- Release gate fails closed (loading, unauthenticated, wrong role); 19 layout files wrap the enrichment routes.
- Core isolation: `architecture-boundaries.test.ts` passes (no direct/transitive enrichment imports in core routes).

**Principal weaknesses**
- Chart *renderers* misrepresented data (dot plot hid >10 observations, pictogram hid >20 symbols, polygon plotted the wrong quantity, no y-axes) while the maths models were right — "model correct, UI wrong".
- Mode of a constant data set was wrongly "no mode".
- 60 safeguarding phrases and 2 pointer tests were not actually passing/executing.
- Local dependency drift hid a security-relevant version difference (dompurify 2.5.8 locally vs 3.5.0 locked).
- Ask-Teacher (Gemini) endpoint was anonymous with a header-bypassable limit.

**Critical findings:** none confirmed. **High (fixed):** D-004, D-005, D-008.
**Remaining blockers for official student release:** all items in the outstanding register; D-010 (Python worker hardening) is the main open security item.

**Production readiness:** *not assessed as live.* Pushing to `fixed-version` is not a deployment. Student Enrichment stays Under Construction and restricted.

## B. Before / after baseline

| Metric | Before | After |
|---|---:|---:|
| Engine families registered | 8 (code-playground, construction-lab, rule-explorer, graph-slider, process-stepper, diagram-hotspots, math-evaluator, sort-classify) | 8 (unchanged) |
| Engine versions | construction-lab 1.6.0; math-evaluator 1.1.0; others 1.0.0 | unchanged |
| productionVersion | construction-lab 1.3.0; math-evaluator 1.1.0; sort-classify **null**; others 1.0.0 | unchanged (owner decision) |
| Enrichment-scope tests (33 files) | 242 (240 pass, **2 fail**, 1 suite with 0 tests) | **336 (0 fail)** |
| Whole-repo tests | 3,699 (3,698 pass, 1 fail) | **3,726 (3,725 pass, 1 fail)** |
| Skipped / todo tests | 0 | 0 |
| TypeScript errors (`tsc --noEmit`) | 423 | **418** (0 in enrichment area, 0 in any file touched) |
| Math oracle | 10,000 cases, 0 discrepancies (9,248 structurally distinct) | reproduced identically |
| `next build` | not run (see register) | not run |

The one remaining whole-repo failure (`story-library/pronunciation/pronunciation.test.ts`) coincides with the owner's **uncommitted** edit to
`src/lib/narrated-lessons/pronunciation.ts`; it was deliberately left untouched.

## C. Defect register
See `DEFECT_REGISTER.csv` (19 entries; each with evidence and status). Summary: FIXED D-001–D-009 · OPEN D-010–D-012, D-014, D-016 · OWNER_DECISION D-013 · NOT_TOUCHED D-015 · VERIFY D-017 · BLOCKED D-018 · ACCEPTED D-019.

## D–H. Engine, maths, science, geometry, statistics
See `ENGINE_CAPABILITY_AND_READINESS_MATRIX.md`, `MATHEMATICAL_RELIABILITY_VERIFICATION.md`, `SCIENTIFIC_ACCURACY_VERIFICATION.md`.

## I–L. Security, performance, accessibility, core regression
See `SECURITY_AUDIT_REPORT.md`, `PERFORMANCE_AND_SCALABILITY_REPORT.md`, `MOBILE_AND_ACCESSIBILITY_REPORT.md`, `CORE_SCHOOL_MANAGEMENT_REGRESSION_REPORT.md`.

## M–Q. Curriculum, Git, kit, register, roadmap
See `CURRICULUM_CAPABILITY_MATRIX.md`, `GIT_INTEGRATION_AND_DEPLOYMENT_STATUS.md`, `OUTSTANDING_VERIFICATION_REGISTER.md`, `REMAINING_FOUNDATION_ROADMAP.md`. Kit: `GAM_EDU_Interactive_Lesson_Authoring_Kit_AUDIT-1.zip` (manifest + SHA-256 in the Git report).

## Evidence-based quality assessment (qualitative, not a measured accuracy)

| Area | Weight | Score | Justification |
|---|---:|---:|---|
| Architecture & maintainability | 10 | 7 | Registry + boundary tests + lazy adapters are sound; 2,312-line player, production-version drift, `ignoreBuildErrors`, 418 TS errors repo-wide |
| Mathematical correctness | 15 | 12 | Oracle + 37 independent adversarial cases + exact-arithmetic design; finite corpus only, bounded domains, no universal claim |
| Scientific correctness | 15 | 9 | Geometry (exhaustive nets) and statistics verified; chemistry, biology, circuits, measuring-instrument rendering **not** independently re-verified |
| Educational effectiveness | 10 | 6 | Chart fidelity fixed; pedagogy/curriculum alignment not evaluated this session |
| Assessment reliability | 10 | 7 | Evaluators resist adversarial input; mode bug fixed; assessment of non-audited engines unverified |
| Security & privacy | 15 | 11 | Sanitiser, gate, SSRF guard, admin guards, webhook HMAC fine; Ask-Teacher fixed; Python worker open; no rules-emulator run; no dependency audit |
| Performance & scalability | 10 | 5 | Architecture intends lazy loading; **nothing measured** |
| Mobile & accessibility | 5 | 2 | Not tested in a browser |
| Core school-management compatibility | 5 | 4 | Whole suite + boundary tests pass; no live smoke test |
| Documentation & reproducibility | 5 | 4 | Reports, register, reproducible tests; prior kits unavailable |
| **Total** | **100** | **67** | Not manipulated; gaps are verification gaps |
