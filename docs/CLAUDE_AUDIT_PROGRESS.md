# Claude Audit Progress (Independent Auditor and Corrective Engineer track)

Supersedes `docs/audit/2026-11-28/AUDIT_PROGRESS.md` (preserved unchanged). Gemini's progress is in `GEMINI_DEVELOPMENT_PROGRESS.md`.

## Checkpoint 1 — complete (`01ed818a`, pushed 2026-11-28)
Baseline; math oracle reproduced; 37 adversarial math cases; exhaustive cube-net verification (35 hexominoes, 11 fold); statistics maths and chart renderers; SVG sanitiser (+20 vectors, 1,500 fuzz payloads); API route sweep; 9 defects fixed (D-001…D-009); reports and AUDIT-1 kit.

## Checkpoint 2 — complete (see git log on `fixed-version` after `01ed818a`)
| Priority | Work | Outcome |
|---|---|---|
| P1 | **Python execution security** | D-010 reclassified **High** after a real-browser demonstration (cookie-bearing authenticated same-origin fetch, cross-origin exfiltration, IndexedDB auth read). Fixed with an opaque-origin sandboxed iframe + CSP + validated messaging + limits + fail-closed. Pre-existing `strictInput` bug (D-020) found and fixed |
| P1 | SQL and pseudocode | 28 adversarial tests; one defect (D-021 huge ARRAY froze the page) fixed |
| P2 | Firestore/Storage emulator | **BLOCKED locally (no Java)**; rules job added to CI; new rules test for the Ask Teacher counters (D-028) |
| P2 | Ask Teacher | Server authorisation, bounds and a Firestore-backed shared per-user/per-school cap (fails closed) (D-009) |
| P2 | Dependencies | Clean `npm ci` in an isolated checkout reproduced the lockfile (1,296 packages); `npm audit` triaged (D-025…D-027); tested `next` patch branch (see report) |
| P3 | Build and TypeScript | `next build` exit 0; errors categorised; 4 runtime ReferenceErrors fixed; 423 → 351; ratchet + plan |
| P4 | Scientific verification | Chemistry, biology, circuits independently verified; no defects |
| P4 | Statistics follow-up | Proportional pictogram part-symbols; readable tall dot stacks (D-005) |
| 11 | Oracle and CI | Honest counts, failing exit code, CI gate, `foundation-verification.yml` (D-012, D-022) |
| 16 | Hub pages | `clubs` kept reachable with Under-construction badges; `resources` is not Student Enrichment (D-017) |
| — | Coordination | Seven coordination documents, AGENTS.md and the Standard updated; v2.4 cumulative kit |

## Not examined in checkpoint 2 (moved to checkpoint 3)
Browser/mobile/accessibility verification of the gated pilot routes (D-033), measuring-instrument rendering (D-030), curriculum evidence (D-034), performance measurement beyond build output, publication/rollback lifecycle, Safari/Firefox Python sandbox (D-035), geometry learner-facing completeness (D-031, Gemini close-out first).

## Next assignment
Checkpoint 3 per `CLAUDE_AUDIT_ROADMAP.md`. Does not start Gemini's Steps 5F/5G/5H/6.
