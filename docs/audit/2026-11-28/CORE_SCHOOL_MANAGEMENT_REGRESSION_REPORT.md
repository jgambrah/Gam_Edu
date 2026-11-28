# Core school-management regression

**Executed:** full repository vitest run before and after the audit changes: 3,699 → 3,726 tests; one failure both times
(`src/lib/story-library/pronunciation/pronunciation.test.ts`, unrelated, coincident with the owner's uncommitted pronunciation edit). Finance/billing/accounting/attendance/payroll/dashboard unit suites in the repository are part of that run and pass.

**Boundary:** `architecture-boundaries.test.ts` passes — core routes (finance, financials, accounts, attendance, admin, students, staff, dashboard layout) have zero direct/transitive imports of student-enrichment engines.

**Changes touching shared areas:** none to billing, accounting, payroll, attendance, authentication, roles, credits, Firestore rules, or Vercel config. Audit edits were confined to enrichment files, one enrichment API route, tests, and documentation.

**Not done (by design or scope):** live smoke tests, live financial transactions, Firestore rules emulator run, authenticated end-to-end tests.

**Note:** the earlier statement-PDF work (separate request) is already in history (`43a16a91`) and its tests are part of the passing run.
