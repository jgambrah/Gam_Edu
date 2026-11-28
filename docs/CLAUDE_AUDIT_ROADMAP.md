# Claude Audit Roadmap (Independent Auditor and Corrective Engineer track)

Preserves the complete original mandate (comprehensive independent audit of architecture, security, mathematics, science, assessment, accessibility, performance, curriculum, publication lifecycle and core school-management safety). Claude audits and corrects; Gemini builds (`AGENT_COORDINATION_PROTOCOL.md`).

## Checkpoints
| Checkpoint | Status | Integrated commit |
|---|---|---|
| 1 — baseline, math/geometry/stats/sanitiser verification, 9 defects fixed | **Complete** | `01ed818a` |
| 2 — Python sandbox, SQL/pseudocode, Ask Teacher authorisation, scientific verification (chemistry/biology/circuits), pictogram/dot-plot, oracle gate, CI, dependency + TypeScript triage, hub decision, coordination documents | **Complete in this push (see progress file)** | recorded in `CLAUDE_AUDIT_PROGRESS.md` |
| 3 — browser and accessibility verification, performance measurement, measuring-instrument rendering, remaining engine render-vs-model audits, curriculum evidence, publication/rollback lifecycle | **Next** | — |
| 4+ — as required until the original mandate is substantially fulfilled | Planned | — |

## Checkpoint 3 plan (priority order)
1. **Browser harness for the gated pilot routes.** The pilot routes sit behind the release gate and Firebase auth, so run them against the Firebase Auth emulator with a synthetic staff account (no live data, no change to the release variable). Playwright (install as a dev dependency, needs owner approval to add) or the in-app browser. Capture screenshots at desktop, tablet, 360 px portrait and landscape; run keyboard-only, focus, reduced-motion, zoom and touch flows for one activity per engine family.
2. **Measuring instruments (all nine)**: independent reference readings against rendered scales (vernier coincidence, micrometer sleeve/thimble, meniscus, parallax, tare, over-range, zero errors).
3. **Render-vs-model audit** for atom-bond, geometry SVG, process-stepper, diagram-hotspots (answer concealment in aria labels), sort-classify (keyboard/tap alternatives).
4. **Performance**: per-route chunk sizes from the production build (measured at checkpoint 2: ~241 kB first-load per pilot route), compressed transfer and cold/warm loads in the browser, heavyweight-runtime loading (Pyodide only when Python is used), memory, a transparent cost model.
5. **Curriculum evidence**: consult NaCCA and Cambridge documents for the implemented pilots; record source, version and reference per activity.
6. **Publication lifecycle**: schema migration, minimum engine versions, missing assets, CDN recovery, rollback using safe non-production fixtures.
7. **Dependency remediation** with owner approval (see `OWNER_DECISION` items in the consolidated register).
8. **TypeScript remediation** phases from `docs/audit/2026-11-29/TYPESCRIPT_REMEDIATION_PLAN.md`.

## Standing rules
- Never raise `productionVersion`; never change the release variable; never touch live school data.
- Every fix ships with a regression test that fails on the old code.
- Report honestly: executed vs read-only vs not examined; the evidence-based score is never adjusted to reach a target.
