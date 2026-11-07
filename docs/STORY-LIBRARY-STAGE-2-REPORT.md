# Story Library — Stage 2 completion report

Branch `story-spark-2.0-central-library` (not merged into `fixed-version`). **Nothing deployed, no rules published, no billing enabled, no production data touched, no production credentials used, no paid AI generation.** Everything below ran in memory, in the Firestore/Storage **emulators**, or in GitHub Actions.

## 1. What was asked and where it stands

| # | Request | Status | Evidence |
|---|---|---|---|
| 1 | Super-admin publishing controls (approved) | Done in Stage 1 and re-proven in Stage 2 | §6; emulator tests: a super admin cannot publish a seeded draft |
| 2 | Shared and personal devices; 60% for planning only; pilot strategy | Done | §5, `STORY-LIBRARY-PILOT-MEASUREMENT.md` |
| 3 | Access control and revocation for licensed content | Proposal written, **awaiting your decision** | `STORY-LIBRARY-ACCESS-CONTROL-PROPOSAL.md` |
| 4 | Emulator-only seeding pipeline, ~1,000 synthetic stories, draft only | Done | §3, §4 |
| 5 | Pagination, lazy loading, caching, Storage request counts; 100 → 1,000 stories test | Done | §5 |
| 6 | Report with CI results, seeding performance, duplicate-prevention results, security findings, next steps | This document | §2–§8 |
| – | Emergency recovery procedure (server-side, audited) | Design written, **not built** | `STORY-LIBRARY-EMERGENCY-RECOVERY.md` |

## 2. Actual CI results

All runs on GitHub Actions, branch `story-spark-2.0-central-library`.

| Commit | Workflow | Result |
|---|---|---|
| `946d40a` | Unit tests (run 42389777459) | **success** — 16 test files, **251 tests passed** |
| `946d40a` | Security rules tests (run 42389777464) | **success** — 5 test files, **1,061 tests passed, 1 skipped** (the skip is a pre-existing junior-rules test, unrelated); includes the 15-test seeder emulator suite below |
| `e5b397c` | Both workflows | success (first run of the emulator suite, 100 stories) |

Stage 2 test inventory: seeder 39 + catalogue client 16 + session simulation 8 (unit, run in CI and locally); seeder emulator suite 15 and 2 new rules tests for seed jobs / pending versions (emulator). TypeScript errors: **245**, unchanged from the baseline. `firestore.rules` and `src/firestore.rules` are identical.

The 15 emulator tests exercise the Admin-SDK seeder against the real Firestore emulator (real transactions, read-before-write, contention) and the client security rules over what it wrote: seeding 1,000 stories; drafts only; duplicates blocked; second run a no-op; schools cannot see drafts/jobs; publishers cannot write job or index records; nobody can publish a seeded draft; a client cannot claim to be the seeder; the seeder identity cannot approve; the full human path draft → review → approved by a different publisher → published → visible to schools; rollback keeps human-moved work; crash-and-resume equals an uninterrupted run; three concurrent runners create each story once; Storage-emulator create-only staging.

## 3. Seeding performance

Corpus: 1,000 deterministic synthetic stories (950 distinct, 20 planted exact copies, 30 planted near copies), 10 pages each, three sentences per page, one image and one narration file per page (small dummy bytes), one closing illustration shared by every story. No AI generation; no real content.

| Run | Result |
|---|---|
| In memory, 1 worker (unit test and CLI) | 1,000 stories in **≈ 3.4–3.7 s** (≈ 3.5 ms/story) |
| Operations for that run | 3,002 transactions, 21,002 document reads, 19,102 document writes, 19,051 objects staged, 1,949 duplicate-object skips (content addressing), 0 conflicts |
| Per distinct story (billing view) | ≈ 22 reads and ≈ 20 writes, **independent of library size** (the LSH index touches 16 small bucket documents) |
| Real Firestore emulator via Admin SDK | **1,000 stories in 12.1 s** (≈ 12 ms/story, 4 workers, in GitHub Actions); rollback of 947 untouched drafts in 10.1 s (3 human-moved stories correctly kept) |

At production Firestore prices a 1,000-story seeding run is about 21,000 reads and 19,100 writes: **under $0.02** ($0.03 per 100k reads, $0.09 per 100k writes), most of which falls inside the daily free quota. The cost of seeding is not a budget concern; the cost of *human review* is.

## 4. Duplicate prevention and seeder safety — results

| Property | Result |
|---|---|
| Exact duplicates planted (same text, new key) | **20 of 20 blocked** |
| Near duplicates planted (two words changed in a ~300-word story) | **30 of 30 blocked** (estimated similarity ≥ 0.85 on 64 MinHash values; LSH 16 bands × 4 rows) |
| False positives among 950 distinct stories | **0** (also 0 on a separate run of 1,000 distinct stories) |
| Human override | A recorded decision `{ of, allow: true, note }` lets a named duplicate through, **only** for the story it names; a decision naming a different story is ignored; the override is stored on the draft |
| Idempotent | A second run of the same manifest: job already completed, **0 writes** |
| Crash and resume | Crash before a transaction, **crash after a commit but before the runner knew**, and crash during media upload, injected at 8 different points each: the resumed run converged to **exactly** the uninterrupted result (documents, index, object set) |
| Leases | A claim that has not expired is respected (no double work); once expired, another runner takes it |
| Transient faults | Injected network errors are retried; result identical to a clean run; a permanently failing story stops at `maxAttempts` and does not block the rest |
| Concurrent runners | 3 runners × 3 workers over one manifest: each story created once, equal to the clean run; 20 trials of 4 racing near-duplicates submitted by different runners: **exactly one created every time** |
| Versions | Unchanged content: no-op. Changed content of a draft: updated in place with a revision trail. Changed content of a story already in review/approved/published/archived: **never touches the live copy**; staged as a `pending_versions/{n}` draft |
| Draft only | Every created document is `status: 'draft'`, `createdBy: 'seeder-bot'`, `synthetic: true`; the write log proves **no writes** to `story_catalogue`, `library_meta`, or `story_library/published/`; the seeder module exports no publish/approve function and its source never names those targets |
| Rollback | Removes untouched created drafts, restores updated drafts, deletes pending versions; **keeps anything a person has moved or edited** and reports it; idempotent; re-seeding after rollback works; the duplicate index is cleaned |
| Emulator-only guard | Refuses the production project id, any non-`demo-` project, a missing emulator host, any real credentials in the environment, and non-synthetic stories |

## 5. Cost and performance

### Catalogue reads do not grow with the library (test: `session-simulation.test.ts`)

A normal learner session: one read of `library_meta` (the version), then only the catalogue pages actually browsed (page ≤ 50 enforced), cached on the device by version. Opening a story costs **no** Firestore read.

| Library size | Firestore reads per learner-month (+ rules lookups), personal devices | Same, shared devices | Naive "read the whole catalogue" per session |
|---|---|---|---|
| 100 stories | 45.4 (+61.2) | 13.1 (+36.8) | 101 |
| 1,000 stories | 57.9 (+62.3) | 13.6 (+36.9) | 1,001 |
| 10,000 stories | 57.9 (+62.3) | 13.6 (+36.9) | 10,001 |

Ten times the library (100 → 1,000) raises reads by 1.3× at most (a 100-story library cannot fill three 20-entry pages per age tier); from 1,000 to 10,000 reads are **flat (1.00×)**, while the naive client grows **10× each step**. Asserted in the tests.

How the catalogue is refreshed when stories are published matters more than library size:

| Refresh strategy (library 1,000, 8 publishes/month) | Catalogue Firestore reads per learner-month |
|---|---|
| Re-fetch the pages the learner browses after each publish | 278 |
| **Delta refresh** (only entries changed since the cached version, using the existing `updatedAt` field) — new stories sort at the end | **58** |
| Delta refresh, worst case: new stories land at random positions | 92 |

Recommendation: delta refresh and append-ordered `sortKey`, with a small separate "new and featured" list. No schema change is needed.

### Storage requests and shared vs personal devices

Same simulation (12 sessions/month, 2 opens per session, Zipf-skewed popularity, half of first opens teacher-assigned, a quarter of other opens re-reads, 10% monthly chance a cache is lost). **All behaviour parameters are assumptions** until the pilot.

| Device mix (library 1,000) | Opens needing no network | Storage GETs / learner-month | MB / learner-month | Model $/month at 100k learners (Option B) |
|---|---|---|---|---|
| 0% shared (all personal) | 39% | 208 | 10.8 | $162 |
| 25% shared | 48% | 176 | 9.2 | $138 |
| 50% shared | 58% | 144 | 7.5 | $115 |
| 75% shared | 67% | 112 | 5.8 | $91 |
| 100% shared | 76% | 80 | 4.2 | $68 |
| **Planning figure (60%)** | 60% | – | – | **$109** |

* **The 60% planning figure is not conservative for a personal-device-heavy deployment**: all-personal gives 39% and costs about 49% more than planned ($162 vs $109). It is roughly right for a 50/50 mix. We do not assume which dominates; the pilot (stratified by device type) decides.
* Hit rate **falls as the library grows** (personal devices: 51% at 100 stories, 39% at 1,000, 32% at 10,000), because children see more distinct stories. Egress, not Firestore, is the cost driver (≈ $94 of ≈ $109 at 60%).
* Even the worst mix stays within 2× of the planning cost (asserted); the budget is not hostage to the assumption, but the budget alert thresholds should be set from the pilot, not the planning figure.
* Storage requests per learner-month grow sub-linearly with library size (asserted: 100 → 1,000 raises them less than 5×, 1,000 → 10,000 less than 2×).

## 6. Security findings

| ID | Finding | Severity | Status |
|---|---|---|---|
| F0 | Seed job records, per-story items and the duplicate index were client-writable by any publisher (Stage 1 rule `library_seed_jobs`). A publisher could forge item state. | Medium (bookkeeping, not an approval bypass) | **Fixed in the repo rules** (now read-only for clients, written only by the server-side seeder). Tests updated. Not deployed. |
| F0b | `story_library_admin/{id}/pending_versions` had no explicit rule: only super admins could read it, claim-based publishers could not. | Low | **Fixed in the repo rules** (publisher read, no client write). Not deployed. |
| F1 | **One human publisher can move a seeded draft to review and then approve it.** The approval rule compares the approver with the *author* (`seeder-bot`) only, so for machine-authored stories a single person can submit and approve. | **Medium — recommend fixing before any real seeding** | Pinned by an emulator test. Recommended fix: record `updatedBy`/`submittedBy` on every draft/review write and require approver ≠ author **and** ≠ last editor/submitter. A rules change plus test updates; not made, because it changes Stage 1 semantics and needs your decision. |
| F2 | **A publisher can edit a story in review, and a second publisher approves it without a record of who edited it** (no `updatedBy`). | Medium | Pinned by an emulator test; closed by the same fix as F1. |
| F3 | Per-school revocation for files is unbounded today (the Storage rule never consults the school switch). | High **for production licensed content only**; acceptable in the emulator | Addressed by the access-control proposal; awaiting decision. |
| F4 | Duplicate-index bucket documents hold one entry per story that shares a bucket. Normal stories almost never collide, but a large batch of *intentionally similar* stories could grow a bucket toward the 1 MiB document limit. | Low | Not hit in 1,000 stories. Add a per-bucket cap with a "too many near-identical stories" block before a very large import. |
| F5 | The seeder runs with Admin privileges and bypasses all rules by design. Its safety comes from the guard and from running only where you choose. | Info | The guard refuses production ids and credentials; the CLI defaults to in-memory. A production seeder must be a separate, reviewed, approved step. |

Confirmed secure (tested on the emulator): no client — publisher or super admin — can publish a seeded draft; a client cannot claim `createdBy: 'seeder-bot'`; even a token carrying the seeder uid and the publisher claim cannot approve its own story; schools cannot read drafts, job records, the duplicate index, or pending versions; the super admin's blanket write rule does not apply to the four library collections.

## 7. Pending decisions

1. **Fix F1/F2** (approver ≠ author ≠ last editor) before any real seeding? Recommended **yes**.
2. **Access control for licensed content** — approve the two-tier design, Option A, R = 11 minutes (quoted as 15), R_offline = 7 days best effort, Option C fallback.
3. **Emergency recovery** — approve the design (takedown fast, publish never an emergency action; two named people; audited; server-side).
4. **Pilot measurement** — approve the definitions, counters and stratified design.
5. Delta refresh with append-ordered catalogue, as in §5.

## 8. Recommended next implementation steps (Stage 3, emulator-first, each needing its own approval to leave the emulator)

1. Rules fix for F1/F2 with tests (small).
2. Publication service: the human-driven draft → review → approved → published path, including catalogue/`library_meta` version bump in one server-side transaction (server-written, so clients never write the catalogue).
3. Reader slice in the app: catalogue client with IndexedDB store, lazy loader wired to Storage, progress batching.
4. Access-control tier (`access: 'licensed'`) once decision 2 is made.
5. Garbage collection for staged-but-unreferenced objects (content-addressed, harmless but should not accumulate).
6. Admin review screen for drafts and duplicate decisions.
7. Only after approval: a pilot environment, budget alerts and kill-switch quotas, and real (non-synthetic) content ingestion with licence checks.

## 9. Not done, deliberately

No merge into `fixed-version`. No rules, functions or hosting deployed. No billing or IAM changes. No production data read or written. No paid AI generation. No scheduled jobs. No load test against anything real. The Storage emulator test covers only create-only object staging; real GCS behaviour (preconditions, signed URLs) is unverified until approved production-like testing.
