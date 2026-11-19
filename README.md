# GAM EDU - Smart Learning OS

This is the Next.js GAM EDU School Management Application.

## Academic Read-Budget Guardrails

To keep Cloud Firestore usage predictable during peak exam entry, report-card compilation, and parent portal traffic across multi-series assessments (**End of Term**, **Mid-Term**, and **Mock 1..N**), every academic surface enforces explicit read budgets:

| Surface / Trigger | Read Budget | Enforcement Mechanism |
|---|---|---|
| **`onAssessmentWriteForSummary`** (`functions/src/academic-summary.ts`) | **1 scan** per 245-write Gradebook batch; **0 scans** on `gradedOnServer` / `quizId` quiz writes; **0 scans** on term close/unlock; **<= 10 scans** across 700 trickled CA writes | Skips `quizId`/`gradedOnServer` and archival-only flips; 60s per-instance memory cooldown exits before transaction; 5-minute lease sets `dirty.<safeSubId> = true` (0-read merge) flushed once by `flushDirtyClassSeriesProfiles` (`onSchedule` every 5 min, max 200/run). Scoped by stamped `termId` with spelling-tolerant `academicYear` / `term` variant fallback. |
| **Master List (`src/app/dashboard/reports/academics/page.tsx`)** | **<= 5 reads** when active/archived term is unchanged (exact: **2 reads**); **class marks + class cards only** when changed; **0 extra reads** when switching series | Compares `snapshot.builtAt >= classAverages.lastMarkWriteAt` (`calcVersion === 2`). Uses class-scoped `useOnceQuery` (10-min TTL) instead of school-wide `onSnapshot` listeners; explicit `Refresh` button only. |
| **My Grades / Ward Grades (`src/app/dashboard/my-grades/page.tsx`)** | **<= 150 reads** typical per child open; **0 reads** when switching series | One-time `useOnceQuery` scoped to `termId == selectedTermId` (falling back to `limit(600)` only when a term has 0 stamped marks). Single-doc `classAverages` and `classSeriesProfiles` read once per `(classId, termId)`. |
| **Report Card Manager (`src/app/dashboard/report-cards/report-card-manager.tsx`)** | **Class roster + class report cards only** on class select (**0 assessment reads**) | Discovers custom Mock series from `classDoc.customMockSeries`, `schoolSettings.customMockSeries`, and loaded report cards; reads `assessments` only when **Generate / Compile All** is clicked. |
| **Security-Rule Profile Lookups (`firestore.rules` + `functions/src/auth-claims.ts`)** | **0 rule-lookup reads** per request when `ENABLE_CUSTOM_CLAIMS=true` / `NEXT_PUBLIC_ENABLE_CUSTOM_CLAIMS=true` | Admin SDK stamps `{ role, schoolId }` custom claims on login (`/api/auth/sync-claims`) and profile updates (`onStaffWriteSyncClaims`, `onUserDocWriteSyncClaims`, `onStudentDocWriteSyncClaims`, `onParentDocWriteSyncClaims`); `firestore.rules` retains full document-lookup fallback when claims are absent. |

### Observability & Verification

- **Cloud Logging Metric**: Both `onAssessmentWriteForSummary` and `flushDirtyClassSeriesProfiles` emit structured `[readBudget]` log entries (`{ fn, schoolId, reads, scans | recomputed }`) for Cloud Logging charts and alerts.
- **Automated Verification**:
  - Run `npm run test:read-budget` (`node scripts/verify-read-budgets.mjs`) to verify exact read & scan counts across all scenarios.
  - Run `npm run test:rules` (requires local Java runtime for Firebase Firestore Emulator) to verify security rules across `Director`, `Teacher`, `Student`, and `Parent` with and without custom claims.
