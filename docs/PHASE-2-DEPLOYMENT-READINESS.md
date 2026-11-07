# Phase 2 — deployment-readiness report

Branch `story-spark-2.0-phase-2-security` (includes `fixed-version` up to c1df183). **Nothing is deployed, merged, or changed in production.**

## 1. Test evidence (from GitHub Actions, not from written tests)
| Run | Commit | Unit/component | Emulator rules suites | Result |
|---|---|---|---|---|
| #1 | 2dfa6eb | 53 pass | failed | ❌ |
| #2 | 4f1966c | 68 pass | **186 failed**, 624 passed | ❌ |
| #3 | 8504091 | 68 pass | 1 failed, 809 passed | ❌ |
| #4 | f4ec4d8 | 68 pass | **810 passed, 1 skipped, 0 failed** | ✅ |
Latest run on the final commit is recorded at the bottom of this file once complete.

Why runs 1-3 failed (all test-harness problems; **the rules files were not changed to make tests pass**):
1. Test tokens had no `email`; `firestore.rules`' `isSuperAdmin()` reads `token.email` unguarded and errored for everyone else. (Real email logins carry an email. Latent fragility noted in the auth proposal.)
2. The Storage test seeded Firestore under a different project id than the emulator; Storage's cross-service lookups saw no profiles.
3. The Storage emulator holds one rule set for the whole emulator; the "legacy rules" block overwrote the new rules mid-file.
The one skipped test is intentional (`junior_abc_words` never checked `createdBy`; documented).
Coverage: super admin, school admin/registrar, teacher, other staff, pupil, parent, unauthenticated, missing/outdated/forged claims, older accounts with a single profile doc, cross-school access, file-type limits, unknown paths, plus before/after tests proving the legacy rules were open. Real bundled-rules behaviour: **cannot be proven by the emulator alone** — see "Staging check" below.

Other checks: `tsc` 245 errors (unchanged baseline, none from new files); 72 unit tests (incl. new ledger and audit classifier tests) pass locally.

## 2. What would change in production when rules are deployed
- **Storage:** from "any signed-in user, any school" to membership + role per path, default-deny.
- **Firestore (Junior content + credit ledger only).**
- No data migration. No document is modified. The credit ledger is additive and only written by server code.

## 3. Compatibility concerns / possible breakage
| Risk | Who | Mitigation |
|---|---|---|
| Account has no `users/{uid}`/`staff/{uid}`/`students/{uid}`/`parents/{uid}` with `schoolId` | Loses Storage access to their school's files | Run the audit (counts only) first and fix accounts |
| A feature uploads to a Storage path not covered by the rules (default-deny) | That upload fails | Path inventory done from code; verify on staging by exercising each upload (logo, website, pupil photo, timeline, submissions, learning materials, chat, signatures, clock-in selfie, Story Spark covers) |
| Pupils/parents reading website/logo files through rules | Allowed (members read) | Public website pages that load images with plain URLs use token URLs and are unaffected |
| Existing token download URLs | Keep working (cannot be revoked by rules) | Documented limit |
| School admins editing legacy "no school" Junior items | Now denied (super admin or original creator only) | Intended (finding S3) |
| Cross-service reads | Each Storage check bills Firestore reads (≤2 docs) | Minor cost |
| First publish of Storage rules | Needs one-time IAM grant to the Storage service account | Requires you; not done |
| Firestore `src/firestore.rules` duplicate | Must stay identical | CI step checks it |

## 4. Unresolved risks (not fixed in Phase 2)
- S5 token-claim precedence — see `AUTHORIZATION-MODEL-PROPOSAL.md`.
- 26 permissive Firestore write rules (1 Critical: `pos_transactions`) — see `FIRESTORE-WRITE-RULES-HARDENING-PROPOSAL.md`.
- ~100 permissive read rules across schools.
- 245 TypeScript errors with `ignoreBuildErrors: true`; 4 files with undefined names that will throw if executed — `TYPESCRIPT-DEBT.md`.
- Only Story Spark's story+cover calls use the idempotent ledger; ~20 other credit spenders still use the plain spend.
- The membership audit has **not been run** against production (no access, and it would need your credentials). It is ready and tested; run it yourself or approve me running it.

## 5. Credit ledger review
| Scenario | Behaviour now |
|---|---|
| Double click / replayed request | Same request id → only one charge. A replay is refused ("already processed") and **does not run the AI again**, so no free generations |
| Two concurrent submissions with the same id | Firestore transaction: one writes the ledger entry and charges, the other sees it and is refused |
| Two submissions, different ids | Two legitimate charges (two stories) |
| AI fails / returns nothing | Server refunds that charge **once** (refund requires ledger status `charged`; sets `refunded`) |
| Duplicate refund | Impossible: second attempt sees `refunded` and does nothing; no client-callable refund exists |
| Server crashes after charging, before finishing | Entry stays `charged`; `refundStaleCharges()` (idempotent) returns them after 15 min. **Not scheduled yet** — needs a cron/Cloud Scheduler job (your approval) |
| Job finished (`completed`) | Final: automatic refund paths refuse it, so a user cannot claim a refund on a story they received |
| **Charge succeeded but the result never reached the user** (network drop after the server finished) | Ledger shows `completed`; automatic refund is deliberately blocked. Recovery: school admin/support sees the entry (ledger readable by school director/super admin) and a **manual, audited refund** (`refundChargeOnce(..., {includeCompleted: true})`, exactly once) is run by a super admin. Self-service is intentionally not offered because "I never got it" is indistinguishable from abuse. **Gap:** the admin UI/action for this does not exist yet (proposed for Phase 3 with a "Credit activity" panel) |
| Cover picture upload fails after generation | No credits involved: the saved story keeps the picture in memory and "Retry picture upload" never calls AI |
Residual: if the browser closes before saving, the generated (paid) story is lost; Phase 3 should auto-save drafts.

## 6. Branch reconciliation
`fixed-version` was 1 commit ahead (c1df183 "THINK TANK SUBMIT FORM FIXED", 8 Think Tank files). Zero file overlap with this branch. Resolved with a normal merge commit of `origin/fixed-version` **into** the feature branch (no rebase, no force-push, no history rewritten); tests and tsc re-run after the merge. `fixed-version` itself is untouched.

## 7. Membership audit
`scripts/audit-school-membership.ts` is read-only (only `.get()` with a field mask on `schoolId`/`role`; reads no names/emails/phones). Default output = counts. `--report` writes hashed ids (random salt, not stored); `--show-ids` writes real uids for the person fixing accounts. Classifier is unit-tested. Run: `npx ts-node scripts/audit-school-membership.ts` (or with `FIRESTORE_EMULATOR_HOST` for a dry run).

## 8. Staging check (recommended before production)
Create a throwaway Firebase project, deploy these rules there, seed one test user per role in two schools, and click through each Storage-using screen. CI proves rule logic on the emulator; staging proves the real project (IAM grant, real tokens, app behaviour).

## 9. Rollback
1. `git show fixed-version:storage.rules > storage.rules` and `git show fixed-version:firestore.rules > firestore.rules` (also `src/firestore.rules`), then `firebase deploy --only storage,firestore:rules`. Rules deploys apply within about a minute, and no data is touched.
2. Keep the pre-deploy rules text: before any deploy, export the live rules (`firebase` console → Rules → history, or `firebase deploy` dry run) and save it with the date.
3. App code is backward compatible with old rules (the new Storage path is also valid under the old rule); reverting code is optional. Ledger documents are harmless if code is reverted.

## 10. Approvals needed (nothing proceeds without them)
Deploy to staging · deploy to production (+IAM grant) · run the audit against production · schedule the stale-charge sweep · apply any of the hardening proposals · merge into `fixed-version`.
