# GAM EDU — Repository Agent Instructions

Before modifying student-enrichment modules (`narrated-lessons`, `coding-club`, `boolean-logic`, `sql-practice`, `python-runner`, `pseudocode-runner`) or publishing lessons:

1. **Read and follow** [`docs/STUDENT_ENRICHMENT_STANDARD.md`](docs/STUDENT_ENRICHMENT_STANDARD.md).
2. **Protect core school management routes**: Never import student-enrichment engines into core school management modules (`finance`, `financials`, `accounts`, `attendance`, `admin`, `students`, `staff`, `dashboard/layout.tsx`).
3. **Keep content CDN-first**: Never commit lesson JSONs or teacher solution packs to git; publish approved lessons via `scripts/lessons/publish-lesson.ts`.
4. **No new lesson-specific React components** or hardcoded `lessonId` branches in `NarratedLessonPlayer.tsx` without explicit architectural approval.
5. **Security & Tests**: Run `npx vitest run src/lib/narrated-lessons/svg-sanitizer.test.ts src/lib/narrated-lessons/architecture-boundaries.test.ts` after any narrated-lesson or sanitizer change.
6. **Manual Vercel Production Promotion Policy**: Production deployment is strictly manual in Vercel. A successful Git push to `origin/fixed-version` or a "Ready" Vercel preview build does **not** establish that a revision is live in production. Always verify live behaviour on `https://gam-it-service.app` after explicit manual promotion before certifying a release as live.
7. **Owner's Revised Student Enrichment Development & Under-Construction Policy**: The owner has authorised accelerated development and controlled `fixed-version` integration of approved Student Enrichment foundation capabilities (Steps 5A.1 → 6) and real NaCCA/Cambridge curriculum lessons while Student Enrichment remains **Under Construction** (`src/lib/student-enrichment-release.ts`). Ordinary student access MUST remain restricted until the owner's explicit release approval (`NEXT_PUBLIC_STUDENT_ENRICHMENT_RELEASED=true`). Core school-management functionality remains strictly protected and unaffected.
