---

# v2.4 Addendum — Independent Audit Corrections (authoritative where it differs from the text above)

The sections above are the v2.3 reference, preserved. Where this addendum differs, **this addendum wins.**

## A. Permanent roles and tracking (new)
Gemini = Primary Developer · Claude = Independent Auditor and Corrective Engineer · ChatGPT = Technical Coordinator · Owner = final authority. Documents: `coordination/` folder (`AGENT_COORDINATION_PROTOCOL.md`, Gemini and Claude roadmaps and progress files, `CONSOLIDATED_DEFECT_REGISTER.csv`, `FOUNDATION_MASTER_STATUS.md`). Findings are classified `CLAUDE_FIX`, `GEMINI_BUILD`, `JOINT_REVIEW`, `OWNER_DECISION`, `VERIFICATION_REQUIRED`.

## B. `data-stats-lab` behaviour (engine 1.5.0 text above is amended)
- **Mode:** a value is a mode when it occurs most often among repeated values. "No mode" only when no value repeats. `[3,3,3]` has mode 3; `[1,1,2,2]` has modes 1 and 2; `[2,4,6,8]` has no mode. Authors using `targetMeasure: 'mode'` with expected "none" must use data in which no value repeats.
- **Dot plot:** every observation is drawn; stacks taller than 10 print "×N" and keep spacing larger than the dot diameter.
- **Pictogram:** symbols are mathematically proportional; the leftover fraction is one part-symbol cut to that fraction of a symbol (frequency 5 with `pictogramUnit` 4 = 1 and a quarter symbol). Nothing is rounded; the exact frequency is always printed. Choose a `pictogramUnit` that divides the frequencies when whole or half symbols are wanted.
- **Frequency polygon:** plots **frequency** against class mid-points for equal class widths (frequency **density** only when widths differ), closed to the axis one class width beyond the first and last mid-points.
- **Charts** (histogram, cumulative frequency, bar) show numeric y-axis ticks (0, half, maximum) and axis titles.
- **Quartiles:** `tukey-exclusive`, `tukey-inclusive`, `linear-interpolation`. The (n+1)/4 positional method is **not** offered (D-011, Gemini after syllabus evidence).

## C. `code-playground` (Python) execution model
Learner Python runs **only** in a sandboxed opaque-origin iframe with a CSP (connect-src limited to the Pyodide CDN path). Code ≤ 100,000 characters, stdin ≤ 50,000, validation ≤ 20,000, sandbox output ≤ 200,000 characters. Lessons must not rely on network access from Python (no `micropip` installs, no `js.fetch`). `strictInput: true` works (a previous escaping bug made it always fail). If the browser cannot provide the sandbox, Python is disabled with a message. Pseudocode `ARRAY` declarations are limited to 100,000 cells per array.

## D. Ask Teacher
`POST /api/narrated-lessons/ask` requires a signed-in user with a school and, while Under Construction, a staff role (Director/Administrator/Teacher or equivalent spellings). Request body ≤ 4 KB; lesson/slide ids `^[A-Za-z0-9_.-]{1,80}$`; question ≤ 400 characters; answers ≤ 1,200 characters. A Firestore-backed daily cap (30 per user, 1,000 per school by default; `ASK_TEACHER_USER_DAILY_CAP`, `ASK_TEACHER_SCHOOL_DAILY_CAP`) applies only to paid AI calls and fails closed.

## E. Math evaluator verification
`scripts/math-oracle/run-independent-oracle.ts` reports **10,000 cases executed, 9,248 structurally distinct**, and exits non-zero on any false accept, false reject, unexpected indeterminate, marking mismatch, duplicate or excessive mark, or if fewer than 9,000 distinct cases are generated. `--no-write` leaves the committed report untouched. Bounded exact linear simultaneous equations are feasible and assigned to Gemini (D-032).

## F. Verification gates
`.github/workflows/foundation-verification.yml`: `npm ci`, `node scripts/audit/check-lockfile-sync.mjs`, enrichment/security/sandbox/execution/Ask Teacher tests, the oracle, the TypeScript ratchet (`docs/tsc-baseline.json`, currently 351) and the Firestore/Storage emulator rules tests.

## G. Verified independently (do not re-derive)
Cube nets (35 free hexominoes, 11 fold, engine agrees on 1,120 variants), electron configurations Z=1–30 with Cr/Cu, 15 ions, equation/charge balance, genetic code degeneracy, Punnett squares, DC circuit KCL/KVL/short/open cases, SQL read-only guarantees, pseudocode DIV/MOD/arrays/limits, SVG sanitiser (33 vectors + 1,500 fuzz payloads).

## H. Not yet verified (see `OUTSTANDING_VERIFICATION_REGISTER.md`)
Browser/mobile/accessibility, performance measurement, measuring-instrument rendering, curriculum documents, publication/rollback lifecycle, Safari/Firefox Python sandbox, live emulator rules results.
