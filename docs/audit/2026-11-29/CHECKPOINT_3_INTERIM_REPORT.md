# Checkpoint 3 — Interim Report (Independent Auditor / Corrective Engineer)

Status labels: **EXECUTED** (I ran it and saw the result), **READ** (inspected only), **BLOCKED** (could not run), **NOT EXAMINED**.
This is an interim report written because the owner's usage allowance was nearly exhausted. It is honest about what is unfinished.
Student Enrichment remains Under Construction. No production promotion, release flag, rule deployment or live data was touched.

## 1. Executive summary
Checkpoint 3 is roughly **55% complete**. The security-critical items (Python sandbox cross-browser, Firestore rules in CI, Next.js patch,
image optimiser, Ask Teacher cost control) are done and evidenced. The real-browser engine sweep ran over all 13 fixtures / 166 interactive
slides and found **no runtime errors and no horizontal overflow**, but **real accessibility defects** (contrast, image alt, tiny touch targets).
Not started: jsPDF compatibility test, zod/genkit report, core supplier-delete regression, curriculum (NaCCA/Cambridge) evidence,
publication/rollback verification, performance/cost model, kit v2.5.
**Score: unchanged at 75/100 (CP2) pending completion; I will not raise it on partial evidence.**

## 2. Completed and verified
| Item | Result | Evidence |
|---|---|---|
| D-035 Python sandbox cross-browser | Chromium EXECUTED, WebKit EXECUTED (Playwright WebKit, not real Safari), Firefox EXECUTED in GitHub Actions (passed). Local Firefox BLOCKED (`spawn UNKNOWN`). **Real Safari/iOS device NOT EXAMINED.** | `tests/e2e/python-sandbox.spec.ts`, CI run |
| D-028 Firestore rules emulator | EXECUTED in CI (Java unavailable locally); src/root rules copies synced after CI caught drift | workflow `rules` job |
| D-029 Image optimiser | Bounded `remotePatterns`; look-alike host and unapproved host refused on the real production server | `image-optimizer-hosts.test.ts`, smoke test |
| Ask Teacher concurrency/cost | Mocked AI only (no credits spent): shared cap atomic under concurrency, fails closed, allowance released when no paid answer | `ask-teacher-concurrency.test.ts`, `route.cost.test.ts` |
| Next 15.5.9 -> 15.5.29 | **Integrated locally.** 35 next advisories -> 0. Full vitest on merged tree: all pass except see section 4. Production build exit 0 (277 s). **Production-server smoke 16/16** (anonymous refusals, 413 oversize, image host refusals, pilot preview fails closed, unknown route 404). TS ratchet 351 <= 351 | `scripts/audit/next-smoke.mjs`, `docs/tsc-baseline.json` |
| D-036 player crash on partial lessons | FIXED (`withLessonDefaults`); 5/5 regression tests | `player-partial-lesson.test.tsx` |
| D-037 measuring-lab parallax | FIXED: off-level eye was being reported as over-range | `measurement-parallax-audit.test.ts` |
| Engine sweep (real browsers) | desktop Chromium, 360px, landscape, iPad-emulation Chromium: **166/166 slides each, 0 runtime errors, 0 overflow**. WebKit run was in progress (59/166 done, same result so far). Playwright WebKit and device emulation are **not** real devices | `audit-output/summary.json` (local, git-ignored) |

Note: the pilot preview route returns HTTP 200 with the Next not-found fallback in production (streaming); no fixture content leaks. Test was corrected to assert that.

## 3. New defects (all in `docs/CONSOLIDATED_DEFECT_REGISTER.csv`)
- **D-038 (High, GEMINI_BUILD):** colour-contrast failure on **every** interactive slide (588 nodes). Automated axe only; no screen reader used.
- **D-039 (High, GEMINI_BUILD):** `image-alt` critical on 13 slides.
- **D-040 (Medium, GEMINI_BUILD):** 591 of 3,488 controls (17%) under 24x24 px.
- **D-042 (Medium, GEMINI_BUILD):** 5 slides at 360px with non-focusable scrollable regions.
- **D-041 (Medium, VERIFICATION_REQUIRED):** `step3-registry-pilot` slide `p06` (boolean-circuit) title not visible; may be fixture, not code.
- Automated axe detects only part of WCAG; absence of other axe violations is **not** an accessibility certificate.

## 4. Open / unverified (do not treat as passed)
- Full vitest showed **6 failures in 2 files** on the merged tree: 5 were my new partial-lesson test (now fixed, passes 5/5); **1 failure in a second file is not yet identified** (appeared during a run concurrent with the sweep and build — possibly a timeout under load). **Re-run `npx vitest run` alone and identify it before pushing.** Earlier isolated-worktree run was 3,826/3,826.
- Measuring-instruments Playwright spec (all nine instruments, state-aware grading) corrected but **not yet re-run**: `npx playwright test -c playwright.engines.config.ts tests/e2e/engines/measuring-instruments.spec.ts`.
- Functional learner workflows per engine (undo/reset/guided vs independent/incorrect feedback/keyboard/state isolation): **NOT EXAMINED** beyond render + axe.
- Remaining science (covalent, formal charge, dative, VSEPR, electrolysis, mechanisms): **NOT EXAMINED** independently.
- jsPDF 2.5.2 -> 4.x compatibility, zod/genkit exposure (D-027): **NOT EXAMINED**.
- Core regression (finance supplier delete with synthetic records, tenant isolation, maths practice persistence): **NOT EXAMINED**.
- NaCCA/Cambridge curriculum verification (D-034): **NOT EXAMINED**.
- Publication/backward-compat/rollback, 1,000-lesson/10,000-learner cost model, performance budget: **NOT EXAMINED**.
- npm audit after patch still has other critical/high advisories from non-Next dependencies (earlier count 8 critical / 37 high) — triage not complete.
- Git push: see section 6.

## 5. Gemini resumption advice
Gemini **may resume** new curriculum content, provided it: (a) ships complete lesson JSON (no partial fixtures), (b) fixes D-038/D-039/D-040/D-042 in engine components before adding more engines, (c) does **not** touch `src/lib/python-runner.ts`, `ask-teacher-guard.ts`, `next.config.ts` image rules, `firestore.rules`, release gate, or core school-management modules, and (d) does not start 5F/5G/5H (per owner). Keep isolated: sandbox, AI routes, rules, release gate.

## 6. Repository state and next actions for the next session (in order)
1. Re-run `npx vitest run` alone; identify the 1 unexplained failure.
2. Re-run the measuring-instruments spec (chromium + webkit); fix any real failures.
3. Wait for/aggregate the WebKit sweep (`node scripts/audit/aggregate-engine-sweep.mjs audit-output/summary.json`).
4. Triage D-038 (which colours) — likely one shared Tailwind class, quick win.
5. jsPDF isolated test; zod/genkit report; supplier-delete synthetic regression; curriculum evidence; publication/rollback.
6. Build cumulative kit v2.5 (retain all v2.3/v2.4 files, verify manifest hashes).
7. Owner actions: manual Vercel promotion decision for Next 15.5.29; real iPhone/Safari check for the Python sandbox.

Owner's unrelated `src/lib/narrated-lessons/pronunciation.ts` modification was preserved and not committed.
