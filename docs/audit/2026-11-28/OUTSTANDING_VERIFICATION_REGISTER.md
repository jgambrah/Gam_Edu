# Outstanding verification register (reconciled; nothing dropped)

Status key: DONE · PARTIAL · BLOCKED · OUTSTANDING

| Item | Status | Evidence / reason |
|---|---|---|
| Canonical regression suite executed (not repeated from reports) | DONE | whole repo 3,726 tests; enrichment scope 336 tests; 0 skipped |
| Tests whose expectations derive from the implementation | PARTIAL | oracle & new suites use hand/independent expectations; pre-existing suites not re-audited line by line |
| TypeScript status | PARTIAL | 423→418 errors; 0 in enrichment area; legacy debt remains; `ignoreBuildErrors:true` |
| Production build (`next build`) | OUTSTANDING | not run this session |
| Actual production deployment / engine activation verified | OUTSTANDING | requires manual promotion + live check at gam-it-service.app; no activation metadata changed |
| Browser-based verification (360px, landscape, tablet, desktop) | OUTSTANDING | not performed |
| Screen-reader, keyboard-only, focus, reduced-motion, zoom/large-text | OUTSTANDING | not performed (ARIA presence ≠ accessibility) |
| Low-data operation, compressed browser transfers, cold/warm loading, low-end Android, Core Web Vitals | OUTSTANDING | not measured; only source KB known |
| Maximum-bound configurations, cross-engine isolation | PARTIAL | existing multi-activity isolation tests pass; maxima not stress-tested |
| Backward compatibility / publication & rollback / CDN recovery | OUTSTANDING | not exercised |
| Core school-management smoke tests (live) | OUTSTANDING | automated suite + boundary test only; no live transactions (by design) |
| Security & abuse testing | PARTIAL | see SECURITY report; rules emulator, `npm audit`, SQL sandbox, tenant isolation, CDN exposure outstanding |
| D-010 Python worker hardening | OUTSTANDING | needs browser verification |
| Curriculum verification against NaCCA/Cambridge documents | OUTSTANDING | no syllabus documents consulted |
| Mathematical reliability | PARTIAL | see MATHEMATICAL report |
| Scientific reliability (chem/bio/circuits/instruments) | OUTSTANDING (except geometry/stats) | see SCIENTIFIC report |
| Scalability & cost model (1,000 lessons / 10,000 learners) | OUTSTANDING | no model produced |
| Official student-release readiness | OUTSTANDING | release remains owner-controlled |
| Cumulative kit completeness vs earlier kits | BLOCKED | earlier kit archives not in repo |
| Step 5F / 5G / 5H audit of implementations | N/A | not implemented |
| Ask-Teacher shared global cap (cross-instance) | OUTSTANDING | needs shared store |
| `npm ci` on all dev/CI machines | OUTSTANDING | local drift fixed with `--no-save` only |
