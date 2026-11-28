# Foundation Master Status

Single status page for the Student Enrichment foundation. Detail lives in the linked documents; this page is reconciled at the end of every checkpoint.

## Release and production state
- **Student Enrichment: UNDER CONSTRUCTION and restricted** (`src/lib/student-enrichment-release.ts`; `NEXT_PUBLIC_STUDENT_ENRICHMENT_RELEASED` not set). No agent changes it.
- **Vercel promotion: manual (owner).** A push to `fixed-version` is not a deployment. No `productionVersion` was changed by the audit.
- Commit awaiting owner promotion: the head of `fixed-version` (recorded in each checkpoint report).

## Engines (registry)
| Engine | engineVersion | productionVersion | Notes |
|---|---|---|---|
| code-playground | 1.0.0 | 1.0.0 | Python now sandboxed (audit D-010) |
| construction-lab | 1.8.0 | 1.3.0 | measurement 1.4.0, stats 1.5.0, geometry 5E 1.6.0, number-manipulative 1.7.0, atomic playground 1.8.0 not production-activated (D-013) |
| rule-explorer / graph-slider / process-stepper / diagram-hotspots | 1.0.0 | 1.0.0 | |
| math-evaluator | 1.1.0 | 1.1.0 | Oracle gate enforced in CI (10,200 executed / 9,448 distinct, 0 discrepancies; simultaneous-linear added in 5E-C) |
| sort-classify | 1.0.0 | null | Not activated |

## Roadmap position
- **Last reported development commit**: `512fca19` (Steps 1–5F implemented; Step 5E-A independent browser accessibility verification outstanding; Step 5E-B, 5E-C, and 5F implemented).
- **Next foundation development assignment**: Step 5G (Physics Workbench); Step 5H (Visual Programming, Art Studio and Game Zone) and Step 6 (Final Foundation Integration) remain planned.
- **Temporary assignment**: Practical Curriculum Validation — Pilot 1 (**PCV-1**): Discovery (`1bd9eaab`) and 2-lesson Implementation published via `--skip-media` (catalogue `v98`: Hydrocarbons `739c1252e89e` → `f1e9f251f1d5`; Basic 8 Atoms `15080192a16a` → `f981f2d51c63`), awaiting owner practical testing & ChatGPT review.
- **Claude (audit)**: Checkpoint 3 remains temporarily paused at its previously recorded position (`baba1cdd`); no audit findings are marked independently verified by Gemini. See the two roadmaps and progress files.

## Quality gates (all in `.github/workflows/foundation-verification.yml`)
Lockfile sync · enrichment + security + sandbox + execution + Ask Teacher tests · independent math oracle (fails on any discrepancy) · TypeScript ratchet (351) · Firestore/Storage emulator rules tests.

## Security posture (verified items)
SVG sanitiser (DOMPurify 3.5.0, 33 vectors + 1,500 fuzz) · Python sandbox (opaque origin + CSP; Chromium) · SQL/pseudocode interpreters bounded · Ask Teacher authorised + shared cap · admin/finance routes use `requireSchoolAdmin`/Bearer tokens · webhooks HMAC · SSRF guard on image proxy. Open: dependency advisories (D-025…D-027), image optimiser host pattern (D-029), emulator results (D-028).

## Verification posture
Executed: math (oracle + 37 adversarial), geometry cube nets (exhaustive), statistics, chemistry, biology, DC circuits, SQL, pseudocode, sanitiser. **Not yet examined:** browser/mobile/accessibility, performance measurement, measuring-instrument rendering, curriculum documents, publication/rollback lifecycle, live deployment.

## Tests (checkpoint 2 end; detail in `docs/audit/2026-11-29/CHECKPOINT_2_EXECUTIVE_REPORT.md`)
Whole repository **3,823 / 3,823 passing** (92 files) · Student Enrichment scope 433 tests (39 files), 0 failing · TypeScript errors 351 (ratchet baseline) · production build exit 0 (156 static pages) · math oracle 10,000 executed / 9,248 structurally distinct, 0 discrepancies.

## Evidence-based quality assessment
**75 / 100** at checkpoint 2 (67 at checkpoint 1): qualitative and never adjusted to a target; the gap to 95 is mainly unverified areas (browser, accessibility, performance, curriculum, instrument rendering, emulator results).

## Where things are
`docs/CONSOLIDATED_DEFECT_REGISTER.csv` (all findings, classified) · `docs/AGENT_COORDINATION_PROTOCOL.md` · `docs/GEMINI_DEVELOPMENT_ROADMAP.md` / `_PROGRESS.md` · `docs/CLAUDE_AUDIT_ROADMAP.md` / `_PROGRESS.md` · `docs/audit/2026-11-28/` (checkpoint 1) · `docs/audit/2026-11-29/` (checkpoint 2).
