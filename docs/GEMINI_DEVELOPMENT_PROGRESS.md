# Gemini Development Progress (Primary Developer track)

> Maintained by Gemini (and reconciled by ChatGPT). Claude records audit outcomes in `CLAUDE_AUDIT_PROGRESS.md` and never edits this file except to reconcile facts verified from the repository, which is what this initial version is.

## Last reported development commit
`a3706446` — "feat(enrichment): close Step 5D charts/assessment and implement Step 5E geometry 1.6.0" (2026-11-27).

## Engine state at that commit (verified from `src/lib/narrated-lessons/interactive-schema.ts`)
| Engine | engineVersion | productionVersion |
|---|---|---|
| code-playground | 1.0.0 | 1.0.0 |
| construction-lab | 1.6.0 | **1.3.0** (measurement-lab 1.4.0, data-stats-lab 1.5.0, geometry 5E 1.6.0 not production-activated) |
| rule-explorer, graph-slider, process-stepper, diagram-hotspots | 1.0.0 | 1.0.0 |
| math-evaluator | 1.1.0 | 1.1.0 |
| sort-classify | 1.0.0 | **null** |

## Stage status
| Stage | Gemini status | Audit status (Claude) |
|---|---|---|
| 1–4F | Implemented | Sanitiser, registry, gate, boundaries verified; engine-by-engine render audit ongoing |
| 5A | Implemented | Math oracle reproduced; 37 adversarial cases pass; oracle now fails CI on discrepancy |
| 5B | Implemented | Existing tests pass; independent verification **not yet done** |
| 5C | Implemented | Model code reviewed; rendered scales not yet inspected in a browser |
| 5D | Implemented | Renderer defects fixed by audit (see register D-004..D-008, D-025); stats maths hand-verified |
| 5E | Implemented (close-out open) | Cube nets exhaustively verified; learner-facing completeness of other capabilities **VERIFICATION_REQUIRED** |
| 5F | Not started | — |
| 5G | Not started | — |
| 5H | Not started (planning audit preserved) | Python sandbox prerequisite met by audit |
| 6 | Not started | — |

## Next assignment
1. Step 5E close-out (see roadmap queue item 1).
2. Step 5F — Primary Number Manipulatives.

## Changes made by the audit that touch Gemini-built code (for awareness; do not revert)
- `data-stats-engine.ts`: "no mode" only when no value repeats ([3,3,3] has mode 3; [1,1,2,2] is bimodal).
- `DataStatsLab.tsx`: dot plot draws every observation (stack count label above 10), pictogram uses proportional part-symbols and prints the exact frequency, frequency polygon plots frequency vs mid-points (density only for unequal widths) closed to the axis, numeric y-axes on histogram/cumulative/bar.
- `python-runner.ts`: learner Python now runs in a sandboxed iframe; `runPython` refuses oversized input; `strictInput` bug fixed.
- `pseudocode-runner.ts`: ARRAY declarations capped at 100,000 cells.
- `/api/narrated-lessons/ask`: server-side authorisation and a Firestore-backed shared daily cap.
- `scripts/math-oracle/run-independent-oracle.ts`: honest executed/distinct counts; non-zero exit on any discrepancy; `--no-write`.
