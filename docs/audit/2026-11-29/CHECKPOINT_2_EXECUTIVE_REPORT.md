# Checkpoint 2 — Executive Report (Independent Auditor and Corrective Engineer)

Start: `01ed818a` (checkpoint 1). Evidence tags: **EXECUTED** (run), **READ** (code review only), **NOT EXAMINED**. Nothing here claims universal correctness. Student Enrichment stays Under Construction; Vercel promotion stays manual.

## 1. Outcome in one paragraph
The largest finding is that learner Python could steal an account's credentials; it was **demonstrated** in a real browser on synthetic data, reclassified **High**, fixed with a properly isolated sandbox and re-verified. Along the way the same tests exposed that `strictInput` mode had never worked (D-020). Ask Teacher now authorises callers on the server and has a shared fail-closed daily cap. Chemistry, biology and circuit models were independently verified with no scientific defects. CI now covers `fixed-version`, the math oracle can fail a build, and TypeScript errors are ratcheted (423 → 351) after two always-throwing production bugs (finance supplier delete, legacy maths practice submit) were found by triaging errors. The whole-repository test suite is **green for the first time: 3,823 of 3,823**. Browser, mobile, accessibility and performance verification of the gated pilot routes were **not** done and move to checkpoint 3.

## 2. Gemini's development status and next assignment
Last reported commit `a3706446`; Steps 1–5E implemented (subject to refinement and independent verification). **Next assignment: Step 5E close-out (learner-facing completeness of geometry capabilities), then Step 5F — Primary Number Manipulatives**; 5G, 5H, Step 6 planned. Claude did not start any of them. See `docs/GEMINI_DEVELOPMENT_ROADMAP.md` and `_PROGRESS.md`.

## 3. Claude's audit status and next assignment
Checkpoints 1 and 2 complete. **Next: checkpoint 3** — browser/accessibility/performance verification of the gated pilot routes (auth emulator + synthetic staff account), measuring-instrument rendering, remaining render-vs-model audits, curriculum evidence, publication/rollback lifecycle. See `docs/CLAUDE_AUDIT_ROADMAP.md`.

## 4. Defects corrected by Claude in checkpoint 2
| ID | Severity | Fix |
|---|---|---|
| D-010 | **High (reclassified)** | Python isolated in an opaque-origin sandboxed iframe + CSP + validated messaging + limits + fail-closed; demonstrated before/after |
| D-020 | High | `strictInput` always failed with SyntaxError (mis-escaped CR/LF) — fixed and pinned |
| D-023 | High | Finance supplier delete always threw (undeclared `deleteDoc`/`toast`) |
| D-024 | High | Legacy maths practice submit always threw (hook in handler; removed `resultsCollection`) |
| D-009 | Medium | Ask Teacher: server authorisation (school + release-gate role), body/id/answer bounds, Firestore shared per-user/per-school cap, fail-closed |
| D-021 | Medium | Pseudocode `ARRAY[1:2000000000]` froze the page 10–15 s → capped at 100,000 cells |
| D-022 | Medium | CI never ran on `fixed-version` → `foundation-verification.yml` |
| D-012 | Medium | Oracle mislabelled counts and never failed → honest counts + non-zero exit + CI gate |
| D-005 | High→fixed | Pictogram: proportional part-symbols, never rounded |
| D-004 | High→fixed | Dot-plot tall stacks print a count and stay distinguishable |
| D-014 | Medium | TypeScript 423 → 351; ratchet; plan |
| D-015 | Low | Stale pronunciation test (fails on clean committed code — **not** caused by the owner's uncommitted edit); hermetic now |
| D-017 | Low | `clubs` hub kept reachable with Under-construction badges; `resources` is not Student Enrichment |
| D-018 | Low | v2.4 cumulative kit (all of v2.3 + audit additions) |

## 5. Development requirements transferred to Gemini (`GEMINI_BUILD`)
Step 5E close-out (D-031); bounded exact linear simultaneous equations (D-032; oracle generator duplicates by topic recorded in the oracle report to help); (n+1)/4 quartile convention only after syllabus evidence (D-011); then 5F. Specs and acceptance criteria are in `docs/GEMINI_DEVELOPMENT_ROADMAP.md`.

## 6. Outstanding verification (26-item register in `OUTSTANDING_VERIFICATION_REGISTER.md`)
Blocked: Firestore/Storage emulator suites (no Java locally; CI job added, result must be read from GitHub Actions). Pending: browser/mobile/accessibility/performance (D-033), measuring-instrument rendering (D-030), curriculum documents (D-034), Safari/Firefox Python sandbox (D-035), publication/rollback lifecycle, scalability/cost model. Owner decisions: `next` patch (tested branch), jspdf major upgrade, zod/genkit exposure, image-optimiser hosts (D-025…D-029).

## 7. Before and after
| Metric | CP1 start | CP1 end | CP2 end |
|---|---:|---:|---:|
| Whole-repo tests | 3,699 (1 fail) | 3,726 (1 fail) | **3,823 (0 fail)** |
| Enrichment-scope tests | 242 (2 fail) | 336 (0 fail) | **433 (0 fail)** |
| TypeScript errors | 423 | 418 | **351** |
| Math oracle | 10,000 "unique" / 9,248 distinct, exit always 0 | same | 10,000 executed / 9,248 distinct, **fails on any discrepancy** |
| `npm audit` | not run | not run | 136 (9 critical / 37 high) triaged; one tested patch branch |
| Production build | not run | not run | exit 0, 156 pages, shared JS 103 kB |
| CI on `fixed-version` | none | none | foundation-verification workflow |

New independent suites this checkpoint: Python sandbox (6), SQL/pseudocode adversarial (28), chemistry/biology (42), DC circuits (6), Ask Teacher guard (7) and route (8), clubs hub (4), proportional pictogram/dot-plot (1+), rules test for server-only counters (executes in CI). **Real-browser harness:** 15 capability/functional checks pre- and post-fix.

## 8. Git integration status
Integrated into `fixed-version` without force-push; the owner's uncommitted `src/lib/narrated-lessons/pronunciation.ts` was preserved and never staged. Checkpoint 2 commits: `9d89dc70` (Python sandbox + strictInput), `f25a0031` (pseudocode ARRAY cap + adversarial tests), `913aacc2` (science tests), `da494397` (Ask Teacher), `a417244d` (pictogram/dot-plot), `b83bca03` (CI/oracle/ratchet), `9b36b35c` (runtime fixes/hub/enum), `1148dbe1` (coordination docs and reports), plus the final kit/status commit (exact final SHA reported in the hand-off). Separate review branch pushed, **not merged**: `audit/next-15.5.29-patch` (`7d97a6e4`).

## 9. Production deployment and activation status
No deployment, promotion, `productionVersion` change, or release-variable change was made. The commit awaiting any promotion is the head of `fixed-version` (hand-off message). Under Construction restriction unchanged. Engines `construction-lab` (1.6.0 vs production 1.3.0) and `sort-classify` (null) remain unactivated pending manual promotion and live verification (D-013).

## 10. Deliverables not produced because the work was not performed
Browser screenshots and interaction results; accessibility verification; browser performance measurements; scalability/cost model; curriculum verification matrix with sources; publication/rollback drills. They are listed as Pending in the register with reasons; **no result is fabricated**.

## 11. Updated evidence-based quality assessment (qualitative; not a measured accuracy; not adjusted to a target)
| Area | Weight | CP1 | CP2 | Justification |
|---|---:|---:|---:|---|
| Architecture and maintainability | 10 | 7 | 8 | CI gates, lockfile check, ratchet, coordination documents; 2,312-line player and production drift remain |
| Mathematical correctness | 15 | 12 | 13 | Oracle now honest and gating; bounded domains; no universal claim |
| Scientific correctness | 15 | 9 | 11 | Chemistry, biology, circuits, cube nets, statistics verified; instruments rendering and bonding/VSEPR/electrolysis not independently verified |
| Educational effectiveness | 10 | 6 | 6 | Chart fidelity improved; pedagogy and curriculum not evaluated |
| Assessment reliability | 10 | 7 | 8 | Mode, pictogram and oracle fixes; unaudited engines remain |
| Security and privacy | 15 | 11 | 13 | Demonstrated and fixed credential theft path; server authorisation; emulator results, dependency advisories, Safari/Firefox, image-optimiser host pattern open |
| Performance and scalability | 10 | 5 | 5 | Build route sizes measured only; no browser measurement or cost model |
| Mobile usability and accessibility | 5 | 2 | 2 | Not tested |
| Core school-management compatibility | 5 | 4 | 4 | Full suite green, build exit 0, two core runtime bugs fixed; no live smoke test |
| Documentation and reproducibility | 5 | 4 | 5 | Coordination documents, cumulative kit, reproducible harnesses and scripts |
| **Total** | **100** | **67** | **75** | |

## 12. Recommendation for checkpoint 3
Proceed. Priorities: (1) browser + accessibility + performance against the gated pilot routes using the Firebase Auth emulator and a synthetic staff account (needs owner approval to add Playwright as a dev dependency); (2) measuring instruments; (3) render-vs-model audits for the remaining engines; (4) curriculum evidence; (5) read the GitHub Actions result for the emulator rules job; (6) owner decisions on the `next` patch branch, jspdf, image hosts.
