# Central Story Library: Stage 1 completion report

Branch `story-spark-2.0-central-library` (based on `story-spark-2.0-phase-2-security` + the reader slice). Final commit for this report's evidence: **`4e746f6`**.
**Nothing is deployed, merged into `fixed-version`, or run against production. No paid AI generation was enabled. No production data was read or written. No credentials were used.**

## 1. Your eight requests

| # | Request | Status | Evidence |
|---|---|---|---|
| 1 | Unit tests for the cost model and its assumptions | Done | `src/lib/story-library/cost-model.test.ts`, 20 tests: pricing snapshot, assumption snapshot, free-quota and 10 TiB tier maths, linearity, A > B, cache monotonicity, hand-calculated Option C, reads independent of library size |
| 2 | Measure lazy loading, caching, file-request counts | Done (synthetic, see 3) | `lazy-loader.ts`, `lazy-measurement.ts`, `lazy-loader.test.ts` (13 tests) |
| 3 | Central library schema + publisher-only rules | Done | `types.ts`, `validate.ts`, `firestore.rules` (+ `src/` copy), `storage.rules` |
| 4 | Emulator tests: published, draft, archived, unauthorized | Done | 2 new files, 235 new emulator tests, all passing in CI |
| 5 | Compatibility with school-created stories | Done | Existing junior suites unchanged and passing; new tests that teachers still save and read `junior_stories`, covers still work, publishers get no power over school stories |
| 6 | Bulk seeding pipeline design | Done (design) | Plan section 3.7, now with an approval gate enforced by the rules |
| 7 | Compact metadata, no needless listeners or per-page queries | Done in design and rules | Catalogue is `hasOnly`-limited; lists require `limit <= 50` and a published filter; no listener code was written; the loader makes no Firestore call per page |
| 8 | This report | Here | |

## 2. D3: Firebase regions (read-only; nothing changed)

**I could not determine either region.** This environment has no Google credentials (`gcloud auth list`: "No credentialed accounts"), and I did not try to obtain any. From the repository alone:

- Project id: `gamedu-69888475-f5783` (`.firebaserc`, `src/firebase/config.ts`).
- Storage bucket: `gamedu-69888475-f5783.firebasestorage.app` (the newer default-bucket naming). The name does not encode a location.
- `firebase.json` has no region setting; `apphosting.yaml` has none either (`maxInstances: 1`, `minInstances: 0`); Cloud Functions source does not set a region.

To report it yourself, these are read-only (please run them and tell me the output, or paste a screenshot of Firestore and Storage locations in the console):

```
gcloud firestore databases list --project=gamedu-69888475-f5783 --format="table(name,locationId,type)"
gcloud storage buckets describe gs://gamedu-69888475-f5783.firebasestorage.app --format="value(location,locationType,storageClass)"
```

This matters because egress pricing and Ghana latency depend on it (cost doc D3/D8).

## 3. What lazy loading and caching measured

Real `StoryLoader` code against a counting backend. Synthetic 10-page story: 50 KB illustration + 60 KB narration per page, 8 KB package JSON, closing card reuses the first page's art. **Measured behaviour; assumed reader behaviour** (70% finish the story, 30% stop at page 3; 50% listen, 30% follow, 20% solo with no narration).

| Strategy (first open, empty cache) | Requests | MB |
|---|---|---|
| Eager: download everything on open | 20.0 | 1.058 |
| Lazy, no look-ahead | 14.5 | 0.747 |
| **Lazy, look-ahead 1 page (default)** | **15.1** | **0.777** |
| Lazy, look-ahead 2 pages | 15.6 | 0.806 |

| Cache situation | Requests per child | MB per child |
|---|---|---|
| Repeat open, same device, warm cache | **0** | **0** |
| Class of 30, ONE shared device | 0.67 | 0.035 |
| Class of 30, 30 personal devices | 20 | 1.058 |

What this shows, plainly:
- **Lazy loading saves about 27% of bytes and 25% of requests**, not more. A child who finishes a story in listen mode downloads exactly as much as eager loading; the saving comes only from children who stop early and from solo mode. If pilot data shows few abandon, the saving shrinks.
- **Look-ahead is cheap** (about 4% more bytes for one page) and is what keeps page turns instant.
- **Shared devices are where the cache pays most**: a class on one device costs 1/30th per child. Personal devices get no sharing. That is why D6 (shared vs personal) decides the bill.
- Content addressing de-duplicates shared art inside a story (9 images for 10 pages).
- The measurement caught a real bug in my first loader (parsed packages were cached per loader instead of in the shared store, so a second child re-fetched the package). It is fixed and pinned by a test.
- A test fails if the cost model's `MEASURED_LAZY` constants drift from this measurement.
- **Not measured:** real packages, real browsers, IndexedDB behaviour, real networks. The IndexedDB-backed store is Stage 3.

## 4. Security rules delivered

**Firestore:** `library_meta`, `story_catalogue`, `story_library_admin`, `library_seed_jobs`.
**Storage:** `story_library/published/**`, `story_library/private/**`.

| | School users (eligible school) | Central publisher | Super admin |
|---|---|---|---|
| Read published catalogue entry | Yes | Yes | Yes |
| List catalogue | Only `status == 'published'` + `limit <= 50` | Any | Any |
| Read draft / archived / admin / licences / seed jobs | No | Yes | Yes |
| Write catalogue, admin copy, seed jobs | No | Yes, subject to the rules below | Same rules (see finding) |
| Delete anything published | No | No | No |
| Read published files in Storage | Yes (any school member) | Yes | Yes |
| Write published files from a client | No | No | No (server promotes) |
| Stage draft files (`private/`) | No | Create-only, typed, <= 4 MB | Same |

Publisher = platform super admin, or the server-set custom claim `story_publisher: true` (a role *name* or `story_publisher: false` does not count; both are tested).

Workflow rules: drafts and reviews are editable; `review -> approved` needs a **different** publisher who records themselves as `approvedBy`; draft cannot jump to approved or published; approved and published content is frozen (a correction goes back through review); the catalogue entry can only be created when the admin copy is `approved` or `published`; the catalogue entry is schema-limited (`hasOnly`, lengths, counts, a package path that must match the story id) so it cannot carry page text, school ids or personal data; catalogue entries and `library_meta` are never deleted (archive instead, which acts as the tombstone); the catalogue version can only increase.

### Finding that needs your attention: a blanket super-admin write rule

CI on my first commit (`a35603a`) failed 4 of 1,041 rules tests, and 3 of those showed a **pre-existing** rule at the end of `firestore.rules` (`match /{collectionId}/{documentId}`) that grants the hard-coded platform super admins read **and write** on every top-level collection. Rules are OR-ed, so it silently overrode my restrictions: a super admin could have skipped the approval step, bypassed schema checks, or deleted catalogue entries.

I changed that one rule to exclude only the four library collections from its **write** side (reads and every other collection are untouched, so this only narrows privileges and only for new collections). Super admins are still publishers, and are now bound by the same workflow. Five new tests pin this, including that a super admin still reads a school collection as before. **This edits an existing rule in `firestore.rules` and its `src/` copy (kept identical; CI checks it). It is not deployed. Please confirm you want it.** The Admin SDK (server) bypasses all rules, so a break-glass path still exists.

### Limits you should know (decisions, not surprises)

1. **Per-school switch-off is enforced in Firestore, not in Storage.** A Storage rule may do only two Firestore lookups, and checking membership already uses them. A school with `storyLibraryEnabled: false` is refused the catalogue and version pointer (which is the only way to discover a file's content-hash path), but a determined member who already holds a path could still fetch that file until the person is removed. If you need hard per-school revocation at the file layer, the alternative is a server-set claim, which does not exist in this codebase yet (finding S5).
2. **Accounts that only have a `students/{uid}` profile** can read the catalogue (existing `getUserSchoolId()`) but not Storage files. This is pinned by a test. New accounts always get a `users/{uid}` document, and the read-only audit script counts the others. I have not run it (it needs production access).
3. **Token-claim precedence (S5)** also applies here: a token that claims a school with no profile is treated as a member of it. Pinned by a test; the content is non-confidential.
4. **Each Storage read costs about 1.5 Firestore reads** (rules lookups are billed). It is included in the revised estimate below (about $7/month at target).
5. **Staging immutability in the emulator.** The rule is `create`-only with `resource == null`, and update is denied. The first CI run showed the emulator allowed an overwrite; after I added the explicit `resource == null` check it passes. Production behaviour matches the documented create/update split, but this is worth a spot check when a staging project exists.

## 5. Evidence

| Run | Commit | Unit tests | Rules tests (emulator) | Result |
|---|---|---|---|---|
| First push of Stage 1 | `a35603a` | 188 passed | 1,036 passed, **4 failed** | Failed. Found the super-admin override and an emulator overwrite behaviour |
| After fixes | `4e746f6` | **188 passed** (13 files; was 115) | **1,045 passed**, 1 skipped (was 810 on the base branch) | **Green** |

- Unit: https://github.com/jgambrah/Gam_Edu/actions/runs/42386841489
- Rules: https://github.com/jgambrah/Gam_Edu/actions/runs/42386841473
- TypeScript errors: **245, unchanged** (checked with `tsc --noEmit`; none in the new files).
- `firestore.rules` and `src/firestore.rules` identical (CI step passes).
- I cannot run the Firebase emulator in this environment (jar download is blocked), so every emulator result above is from GitHub Actions, not my machine. I read the failing job log directly rather than guessing.

## 6. Revised cost estimate (target: 1,000 schools, 100,000 active learners)

Changes from the first estimate: (a) lazy loading is now measured (0.734x bytes, 0.753x requests) instead of assumed away; (b) the implemented design checks school membership in Storage rules, so it is the "B-lookup" variant, with about 3 rules-lookup reads per library request and about 1.5 per Storage file. Everything else is unchanged and still **assumed** (12 sessions per learner per month, 2 opens per session, 60% device cache hit, 1.2 MB full package).

| Option at 60% device cache | First pass | **Revised** |
|---|---|---|
| A: full story docs in Firestore | $320 | $289 |
| B: packages in Storage, no Storage lookups | $144 | $109 |
| **B-lookup: what is implemented** | **$153** | **$116** |
| C: CDN (excludes unverified load-balancer cost) | $124 | $95 |

**Implemented design (B-lookup), revised: about $116/month at target (about $1.2 per 1,000 learners per month).** Breakdown: Firestore $14.84 (42.0M reads, 3.6M writes), Storage $100.91 (about 787 GiB egress and 15.6M GETs).

| Device cache hit | First pass | Revised |
|---|---|---|
| 20% (worst) | $299 | $223 |
| 60% (typical) | $153 | **$116** |
| 85% (best) | $62 | $49 |

| Scale | Revised, implemented design |
|---|---|
| Pilot, 10 schools (1,000 learners) | $1.18 |
| 100 schools (10,000) | $11 |
| 1,000 schools (100,000) | $116 |
| 5,000 schools (500,000) | $582 |

Stays linear in learners (about $0.0012 per learner per month). Reads do not grow with the number of stories (tested).

**How much to trust this:** the dollar figures are only as good as four unmeasured inputs: real package size, real device-cache hit rate, real session behaviour, and the Ghana egress rate (Google's tables do not list Ghana separately; I used the generic worldwide rate). Treat the range ($49 to $223) as the honest answer and the $116 as a central guess. Not included: one-time AI generation, the Cloud CDN load balancer, the existing app's traffic, and any Firebase-specific no-cost Storage quota I could not read.

**Correction to my earlier document:** I had stated the Firestore stored-data price as about $0.075/GiB-month by misreading the unit. It is more plausibly about $0.15/GiB-month (unverified). It has no effect on any total (the catalogue is a few MB inside the free 1 GiB). A unit test caught the inconsistency.

## 7. Seeding pipeline (design, not built)

Full design: plan section 3.7. Summary: manifest-driven; each story is validated, fingerprinted and checked for duplicates (exact hash, new version of the same key, or near-duplicate by text similarity, which blocks publication until a person decides); media is uploaded create-only to content-addressed paths; the job state is recorded per story so re-running the same input resumes; versions are immutable and a rollback is a pointer flip. **Human approval is enforced by the rules**: the seeder creates drafts and can move them to `review`, but only a different publisher can approve, and only approved stories can be published. The seeder, when built, runs only against emulators or synthetic data and refuses a production target.

## 8. Not done in Stage 1 (and why)

- No seeder code, no server "promote" step that copies approved files to `published/` (needs the Admin SDK; Stage 2, emulator only).
- No IndexedDB store, no reader wiring, no progress batching code (Stage 3).
- No usage dashboard or kill-switch UI (Stage 4); the kill-switch flags exist only as fields in `library_meta`, and nothing enforces them yet.
- No scheduled jobs, no deploys, no production access, no billing or IAM changes.
- Region inspection (D3) blocked by lack of credentials.

## 9. Decisions I need from you

1. **Approve or reject the narrowing of the super-admin blanket write rule for the four library collections** (section 4). Without it, super admins can bypass approval.
2. Run the two read-only region commands in section 2 (or share a console screenshot).
3. Accept the Storage-level limit in section 4 (per-school switch-off enforced at Firestore only), or ask for a claim-based design (new server code, up to an hour of lag).
4. Cache assumptions: is a shared-device cache realistic for most schools? I would like to measure one pilot school before trusting the 60% figure.
5. Go-ahead for Stage 2 (emulator-only seeder, synthetic corpus of about 1,000 stories).
