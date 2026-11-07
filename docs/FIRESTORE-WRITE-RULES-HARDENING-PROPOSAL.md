# Firestore write-rule hardening proposal (separate from Story Spark)

Status: **proposal only — no rule here is applied.** Found by scanning `firestore.rules` for write rules that are just `isSignedIn()` (26 matches in 20 collections), then reading each one. "Any signed-in user" includes pupils and parents of **every** school, because top-level collections are shared across schools and these rules never compare `schoolId`.

## Severity key
- **Critical** — exposes or lets forging of financial or pupil-identifying records across schools
- **High** — cross-school tampering with academic or operational data
- **Medium** — spam/impersonation/integrity, limited data exposure
- **Low** — by-design public-ish or low-value

| # | Collection (rule line) | What any signed-in user can do | Data exposed | Severity | Proposed fix |
|---|---|---|---|---|---|
| 1 | `pos_transactions` (1145) | **read + list every school's POS sales**, create arbitrary sales | Pupil purchases, amounts, cashier — financial + pupil data | **Critical** | read/list: finance staff or the owning pupil/parent of own school; create: school member with `schoolId == own`, `createdBy == uid` |
| 2 | `assignments` create/update (772) | Create or **edit any school's assignments** (incl. rewriting `schoolId`) | Academic records, cross-school tamper | **High** | create/update: teacher/admin of that school; `schoolId` immutable |
| 3 | `assignments/*/submissions` create/update (781) | Write or **overwrite any pupil's submission/grade** in any school | Pupil work and marks | **High** (pupil data) | pupil writes own submission only (`studentId == uid`, same school); teacher/admin update grades |
| 4 | `quizzes/*/attempts` create/update (821) | Write/overwrite any pupil's quiz attempt/score | Pupil scores | **High** | same pattern as 3 |
| 5 | `class_stories` second block (1944-1949) | **Duplicate `match` ORs with the stricter block (1314):** any signed-in user can update/delete any class story and comment | Pupil photos/captions posted to class feed | **High** (pupil-facing content) | delete the duplicate block; keep the teacher/admin rules, school-scope reads |
| 6 | `counters` create (595) | Create counter docs (receipt/student number sequences) | Finance numbering integrity | **High** (financial integrity) | create: finance/admin of that school only, `currentId == 0` |
| 7 | `leaveRequests` create (614) | Create leave requests as/for anyone in any school | HR records | **Medium** | `staffId == uid` and own school |
| 8 | `notifications` create (588) | Send notifications to any user/school (phishing-style spam) | None read, but impersonation | **Medium** | server-only (Admin SDK) or `fromUid == uid` + same school as target |
| 9 | `notification_queue` + subtree (723-728) | Read/write the queue, incl. other schools' | Message content, recipients | **Medium–High** | server-only; deny client write |
| 10 | `canteen_headcounts` + subtree (711-716) | Read/write any school's canteen numbers | Headcounts (low) | **Medium** | school staff of own school |
| 11 | `liveSessions` ×2 (322, 666) | Create/edit/**delete any live class** incl. via collection-group wildcard | Class links/meetings | **Medium** | teacher/admin of that school; wildcard rule removed |
| 12 | `direct_messages` create (1798) + `list` (1797) | Create chats naming arbitrary participants; **list all chats' metadata** | Participant uids, last message previews | **High** (privacy; messages themselves need participant check ✔) | create: `uid in participants`, same-school participants; list: only `where participants array-contains uid` |
| 13 | `forumThreads` / replies (1785-1790) | Create/**update any thread** | Forum content | **Medium** | update: author or admin; school-scope |
| 14 | `science_lab_results` create (1643) | Write results for any pupil | Pupil results | **Medium** | `studentId == uid` or teacher of that school |
| 15 | `book_reviews` create (1831) | Post reviews as any pupil | Impersonation | **Low–Medium** | `studentId == uid` |
| 16 | `parent_satisfaction` create (1934) | Submit surveys for any parent/school | Survey integrity | **Low–Medium** | `parentId == uid` |
| 17 | `auditLogs` create (29) | Forge audit entries (update/delete already super-admin only) | Audit-trail trust | **Medium** | `actorUid == uid`, schoolId == own; prefer server-only |

Also noted while reading (reads, not writes): many top-level `read/list: if isSignedIn()` rules expose whole collections across schools; a read audit should follow the write fixes.

## Approach (do not do all at once)
1. **Test first:** extend `tests/rules/` with a "cross-school" matrix per collection (pupil/teacher/admin of A and B) against current rules to pin today's behaviour, then change rules until the A-vs-B cells flip to denied.
2. **Order:** Critical (1) → High (2-6, 12) → Medium → Low. One PR per group, each with its tests green in CI.
3. **Compatibility check per collection:** grep the app for writers; many writers (e.g. pupils submitting assignments) are legitimate and must stay allowed, scoped to own school/own record. Where a client path would break, move it to a server action first.
4. **Rollout:** deploy to a staging Firebase project first; watch denied-request metrics for a week before production.

## Not in scope here
The other ~100 read rules that are `isSignedIn()`-only; token-claim precedence (see AUTHORIZATION-MODEL-PROPOSAL.md).
