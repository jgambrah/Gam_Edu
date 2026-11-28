# GAM EDU — Comprehensive Outstanding Foundation Verification Register (Reconciled 26 Items, checkpoint 2)

Items 1–17 are carried forward from kit v2.3 with updated status and evidence; 18–26 were added by the independent audit. Nothing was removed.
Status: **Done · Partial · Pending · Blocked**.

| # | Verification Area | Status | Evidence / reason | Target |
| :---: | :--- | :---: | :--- | :---: |
| 1 | Actual compressed JS transfers (Next.js build / DevTools) | Partial | Production build route table measured (≈241 kB first-load per pilot route, 330/460 kB for dashboard lesson routes); **compressed browser transfer not measured** | CP3 |
| 2 | Shared validator bundle impact on non-lesson routes | Pending | Route table available, not yet analysed | CP3 |
| 3 | Live selective loading trace (DevTools Network) | Pending | Needs the gated routes in a browser | CP3 |
| 4 | Cold-cache & warm-cache performance (throttled 3G/4G) | Pending | | CP3 |
| 5 | Low-end Android device CPU/memory profiling | Pending | Emulation vs real device must be distinguished | CP3 |
| 6 | Actual 360px portrait & landscape visual testing | Pending | | CP3 |
| 7 | Live keyboard-only navigation & focus-ring walkthrough | Pending | | CP3 |
| 8 | Live screen-reader audit (NVDA / VoiceOver / TalkBack) | Pending | No screen reader tested; compatibility is **not** claimed | CP3 |
| 9 | Low-Data Mode live network trace | Pending | Existing Vitest asserts zero pointer requests | CP3 |
| 10 | Live browser maximum-bound activity performance | Partial | Bounds tested in Vitest/jsdom (dot-plot 200 values, pictogram, array cap, Python limits); browser performance not measured | CP3 |
| 11 | Core Web Vitals (LCP, INP, CLS) | Pending | | CP3 |
| 12 | Cross-engine multi-activity live state isolation | Partial | Vitest isolation tests pass; live not done | CP3 |
| 13 | Backward compatibility end-to-end on live CDN lessons | Partial | Full Vitest and `next build` pass; live CDN lessons not exercised | CP3 |
| 14 | Controlled publication & instant catalogue rollback drill | Pending | Use non-production fixtures only | CP3 |
| 15 | Core school management live smoke test | Partial | Whole-repo Vitest, boundary test and production build (exit 0); no live transactions by design | CP3 |
| 16 | Scalability & operating cost model | Pending | No validated assumptions yet | CP3 |
| 17 | Content lifecycle, version migration & corrupted CDN asset recovery | Pending | | CP3 |
| 18 | Python sandbox in Safari and Firefox | Pending | Verified in Chromium only (D-035); fail-closed design should disable Python on an unsupported browser | CP3 |
| 19 | Firestore & Storage emulator security-rules suites | **Blocked** locally (Java not installed) | `rules` job added to `foundation-verification.yml`; read the GitHub Actions result (D-028) | Owner/CP3 |
| 20 | Dependency vulnerability remediation | Pending (owner decision) | `npm audit` triaged; `next` patch branch tested; jspdf major and zod need decisions (D-025…D-027) | Owner |
| 21 | TypeScript remediation phases | Partial | 423 → 351 errors; ratchet in CI; plan in `docs/audit/2026-11-29/TYPESCRIPT_REMEDIATION_PLAN.md` (D-014) | CP3+ |
| 22 | Measuring instruments (9): rendered scales vs independent reference readings | Pending | Model read; rendering not inspected (D-030) | CP3 |
| 23 | Curriculum evidence (NaCCA / Cambridge documents) per pilot | Pending | No documents consulted (D-034) | CP3 |
| 24 | Geometry learner-facing completeness (RHS, protractor, loci, regions) | Pending | Gemini 5E close-out first (D-031) | Gemini → CP3 |
| 25 | Ask Teacher shared cap against live Firestore | Partial | Cap logic verified with a transactional fake; live Firestore not exercised | Owner/CP3 |
| 26 | Production promotion and engine activation | Pending (owner) | Nothing promoted or activated; manual Vercel policy kept | Owner |
