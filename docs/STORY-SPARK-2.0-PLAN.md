# Story Spark 2.0 — implementation plan

Status: **plan written; Phase 1 complete on branch `story-spark-2.0-phase-1`. Part 3 (Central Story Library) is a design for review, see below. Nothing deployed, no rules published, no production data touched.**
Every finding below was checked against the code in this repo (commit `f4259f7`). Items marked *unverified* were not.

## 1. What exists today (to preserve)

- Story Spark is the `StorySpark` function in `src/app/dashboard/nursery-bloom/page.tsx` (~lines 4158–5030), module id `stories`, inside a 9,891-line page. Navigation (age tiers, module tabs, Dashboard tab for editors) must stay as is.
- Story shape today: `{ title, emojiIcon, content, questions[3], imageUrl?, topic, wordCount, schoolId, createdBy, createdAt }` in Firestore `junior_stories`, read through `useSchoolAndMine` (this school's + my own).
- Read-aloud: browser `speechSynthesis` with word highlighting via `onboundary`; 4 "voice characters" are just pitch/rate presets; "Word Explorer" (tap a word → AI definition, 1 credit); a 3-question typed-answer quiz; confetti.
- AI: `generateJuniorStory` (Gemini, 3 credits), `generateLessonImageAction` (Imagen, 5 credits), `generateTTSAction` (Gemini TTS, 5 voices, 1 credit — currently used only by the math modules), `generateWordDetails`.
- Credits: `checkAndSpendCredits` is already guarded by `requireSchoolMember` (a signed-in member of that school or a super admin).
- Same-file helpers other Nursery Bloom activities also use: `JuniorSchoolContext`, `useJuniorSchoolId`, `juniorStamp`, `visibleForSchool`, `removeJuniorDoc`, `useSchoolAndMine`.

## 2. Confirmed defects (verified in code)

| # | Defect | Evidence | Fix |
|---|---|---|---|
| D1 | **Cover illustrations are never saved.** | `handleSave` uploads to `junior_stories/{uid}_{ts}_cover.png`; `storage.rules` only has `schools/{schoolId}/**` and `signatures/**`, so every other path is default-denied. The `catch` then sets `imageUrl = ''`, silently. | Upload under `schools/{schoolId}/junior_stories/…` (matches an existing rule, so **no rules deploy needed**); tell the teacher if the upload fails instead of silently dropping the image. |
| D2 | **`pages` stories break the reader.** | `TODDLER_STORY` has `pages` and no `content`/`questions`; the reader only uses `story.content`, so it renders blank, and `handleNextQuestion` reads `story.questions.length` (would throw). The built-in story shows by default on the 2–3 tier. | `normalizeStory()` turns legacy `content` and `pages` stories into one page model; reader and quiz use only that. |
| D3 | **Credits are spent and not refunded when generation fails.** | `generateJuniorStory` calls `checkAndSpendCredits` first and its `catch` returns an error with no refund; the image action is the same. Retrying silently spends again. | Job tracking + refund-on-failure + retry limits (Phase 5). |
| D4 | **Credit label is wrong.** | UI says "Costs 10 Credits"; code spends 3 (+5 for the cover image). | Show the real estimate before generating. |
| D5 | **No tests exist** for any of this (no test framework in `package.json`). | `package.json` scripts: dev/build/start/lint/typecheck only; `next.config.ts` sets `ignoreBuildErrors: true`, so the build is not a type gate. | Add vitest + Testing Library; run `tsc --noEmit` ourselves. |

## 3. Cross-school / security findings (verified in rules text)

| # | Finding | Why it matters | Proposed change (not applied) |
|---|---|---|---|
| S1 | `storage.rules` `schools/{schoolId}/**`: **any signed-in user can read and write any school's files.** | One school's user can read or overwrite another school's files (logos, student photos, chats). | Restrict to members of that school. Risky: some users may lack a `schoolId` token claim, so the rule needs a tested fallback. **Needs your approval and a staged rollout.** |
| S2 | `junior_stories` `create`: any signed-in user (including a pupil or parent) may create a story with **no `schoolId`**, and `juniorReadable()` lets every school read no-school stories. | The same mechanism a shared library would use is currently open to anyone for writing. | Keep legacy no-school stories readable, but block new no-school writes; shared content moves to a new `story_library` with publisher-only writes. |
| S3 | `juniorCanChange()` lets any `isTeacher()`/`isAdmin()` change docs with no `schoolId` that they created, and admins change all no-school docs. | Harmless today; unsafe once a global library exists. | Library collections get their own rules; no reuse of `juniorCanChange`. |
| S4 | Platform super-admins are hard-coded UIDs/emails in `firestore.rules` and `session-guard.ts`. | Cannot grant "central publisher" to a content editor without a code change. | Add a `story_publisher` custom claim (set server-side), checked in rules and server actions. |

Also noted, not a defect: the `junior_*` content collections are readable by any signed-in user by design.

## 4. Proposed data model (additive; legacy docs keep working)

```
junior_stories/{id}                 // legacy + school-private stories, unchanged
  content?, pages?, questions?, imageUrl?, …   // read via normalizeStory()

story_library/{storyId}             // central, publisher-write / school-read-published
  version, status: draft|review|published|archived, title, description, language,
  coverImage{path,alt}, author, createdBy, publishedAt, revisions[]
  ageTiers[], level, durationSec, themes[], curriculumTags[], targetVocab[], phonics[],
  comprehensionGoals[], sel[], licensing{assets[],music[],attribution}
  pages[]{ id, text, sentences[], image{path,alt,prompt,seed}, audio{path,durationSec,
           voice,lang,sentenceTimings[], wordTimings?} , sfx? }
  activities[]{ type, ageTiers[], …}      // comprehension, vocab, sequencing, prediction, emotions, retell
  characterBible{ name, description, palette, styleSeed }
storage: story_library/{storyId}/v{n}/…  (webp images, opus/aac audio) — signed-in read, publisher-only write

school_story_assignments/{id}  // schoolId, storyId, scope: class|group|student, ids[], assignedBy, due?
story_progress/{schoolId_studentId_storyId}  // mode: listen|read-with|independent, pages reached,
                                             // completed, activity results (no audio, no voice data)
story_jobs/{jobId}             // generation job: kind, estimate, spent, status, attempts, error, assetPaths
```

Rules for the progress data: written server-side or by the owning school's staff/parent only; never in the global library; `listen` completion is stored separately from `independent` reading and never presented as mastery.

## 5. Components (new, under `src/components/dashboard/junior-academy/story-spark/`)

`types.ts` · `normalize.ts` (legacy → pages) · `StorySpark.tsx` (module shell, preserves the library grid) · `StoryReader.tsx` (full-screen) · `ReaderControls.tsx` · `useNarration.ts` (audio file → fallback browser voice; sentence/word highlight) · `useAmbience.ts` (Web Audio gain, ducking, fade) · `ReadingModes.tsx` · `Activities/*` · `StoryLibrary.tsx` · `StoryStudio/*` (generate → review → edit → preview → approve → publish) · `TeacherAnalytics.tsx` · `ParentStories.tsx`. Shared Junior helpers move to `junior-shared.tsx` and `page.tsx` imports them back, so other activities are untouched.

## 6. Generation and narration workflow

1. **Estimate** (pages × image + audio + text credits, shown before any call) → budget check.
2. **Draft** text + structured metadata (Gemini, schema-validated, with a safety pass: frightening/violent/discriminatory/sexual/unsuitable).
3. **Character bible** first, reused in every image prompt (stable description + seed); one image per page, written to Storage with a content hash so identical requests are reused, not regenerated.
4. **Narration** per page (Gemini TTS, chosen voice, pauses from sentence boundaries) generated **once**, stored compressed, reused by all schools. Word timings only if the model returns reliable alignment; otherwise **sentence-level highlighting** (no estimated word timing).
5. **Human review** (text, each image vs. text, audio) → edit/regenerate single assets with a per-story retry cap → preview → approve → publish. AI output never reaches `published` without a person approving.
6. Every media call is a `story_jobs` record: idempotent, refund on failure, no silent retries.

## 7. Reader, modes, music

- Modes: **Listen to Me**, **Read With Me** (tap a word to hear it; definition only on request), **Let Me Read** (no recording or upload by default; on-device recognition only if the browser provides it, encouragement-only, never scored against the child, no claim of assessing reading ability; any recording needs a school-level consent switch, which does not exist yet and will be designed with you first).
- Reduced motion honoured via `prefers-reduced-motion` plus an in-reader toggle; large touch targets; progress bar; speed control; fullscreen.
- Music: optional, **off by default for Let Me Read**, teacher can disable school-wide; Web Audio gain ducks under narration and fades at page turns; no unexpected loud sounds. **Licensed audio is required — I cannot verify licences, so every track gets a `licensing` record and a human sign-off before it ships.** Placeholder: none shipped until a source is chosen.

## 8. Migration and backward compatibility

No destructive migration. Old docs are read through `normalizeStory()` forever; new fields are optional. Old stories can later be "upgraded" per story by a teacher (opt-in), never in bulk.

## 9. Testing requirements

- Unit: `normalizeStory`, storage-path builder, highlight/timing logic, credit estimator.
- Component (Testing Library): legacy `content` story, `pages` story and the built-in toddler story open and quiz works; reader controls; audio hook with a mocked `Audio`; ducking.
- Rules (Firebase emulator, needs Java — present — and the emulator download): creation, read, cross-school denial, publisher-only writes; a test that fails today for S1/S2 and passes after the change.
- Server actions: refund-on-failure, retry cap, duplicate prevention.
- Gate after each phase: `tsc --noEmit` (project's own typecheck, since the build ignores type errors), lint, tests.

## 10. Costs and risks

- Credits for one 8-page story: text 3 + cover 5 + 8 page images × 5 + 8 narrations × 1 = **56**; 5 pilot stories ≈ **280** before retries (set a retry budget, e.g. 25% headroom). I cannot convert credits to money; you know the credit price.
- Risks: character consistency across AI images (mitigation: character bible, seed, human review, per-page regeneration); Ghanaian-language narration quality (English first, other languages only after a fluent reviewer signs off); tightening S1 can break uploads for users without a school claim (staged rollout); music licensing; tablet storage for offline caching (cap per device, wipe on sign-out).

## 11. Phases

1. **Foundation** — DONE: normalise legacy stories (D2), fix cover save (D1), quiz length, extract Story Spark and shared helpers, test framework + 53 tests. Storage-rule behaviour itself still needs an emulator test (Phase 2).
2. **Security**: draft rules for S1–S4 + emulator tests; **you approve before anything is published.**
3. **Reader core**: pages, narration hook, reading modes A/B, controls, reduced motion, ambience hook (no audio assets yet).
4. **Library + learning framework**: `story_library`, publisher claim, assignments, activities, pin-to-class.
5. **Studio + cost control**: jobs, estimates, refunds, safety pass, review/approve/publish.
6. **Pilot content**: the 5 proposed original stories, reviewed before publishing.
7. **Offline, analytics, parent view, recommendations (rule-based)**.

Not inspected yet (will be before the phase that needs it): class/student assignment models and parent-child links (Phase 4/7), and the Dashboard tab in Nursery Bloom.

---
# Phase 2 results (security → reliability)

Branch: `story-spark-2.0-phase-2-security` (nothing merged to `fixed-version`, nothing deployed, no production data touched).

## New findings
- **S5** — `firestore.rules` trusts `schoolId`/`role` *token claims* before profile documents (Storage rules do not). Nothing in the repo sets those claims today; a stale or hand-set claim would override a person's real school. Pinned by characterization tests; **not changed — needs your decision**.
- **S6** — ~26 Firestore write rules are `isSignedIn()`-only (heuristic count; e.g. class_stories, forum, notifications, counters, leaveRequests, assignments/submissions). Out of Phase 2 scope; listed for a later hardening pass.
- Token download URLs bypass rules entirely; tightening Storage does not revoke URLs already issued.

## Changed
1. `storage.rules` — school-scoped, role-based, default-deny (was: any signed-in user, any school's folder).
2. `firestore.rules` (+`src/firestore.rules`) — Junior content: no "shared with every school" writes by non-super-admins; school can't be changed after creation; credit ledger server-only.
3. Story Spark: one resolved `ownerSchoolId` for cover path, document stamp and credit charge; refuses to save with no school; partial-save banner + credit-free "Retry picture upload".
4. Credits: idempotent ledger (`schools/{id}/credit_ledger/{key}`), one charge per request id, refund-once on AI failure, no client-callable refund, replayed key can't generate for free; label corrected to 8 credits (3 + 5).
5. Tests: 57→68 unit/component tests; emulator suites for Storage and Firestore rules; CI workflow.
6. Docs/scripts: `docs/TYPESCRIPT-DEBT.md`, `scripts/audit-school-membership.ts` (read-only).

## Not done / honest limits
- **Emulator rules tests have not been executed by me** (emulator download blocked in my sandbox; I can't see GitHub Actions results). Treat the rules as *unverified until the CI run is green*.
- Only the story + cover steps use the ledger; the other ~20 `checkAndSpendCredits` callers are unchanged (they still work).
- Existing schools' stories remain readable as before; 245 TS errors unchanged.

## Breaking-change risks when rules are deployed
- Accounts with no `users/{uid}`/`staff/{uid}`/… `schoolId` lose Storage access → run the audit script first.
- Any feature writing to a Storage path not in the new rules is denied (unknown paths denied by design).
- Super-admin-only editing of legacy "no school" Junior items.

## Rollback
Re-deploy the previous `storage.rules`/`firestore.rules` from git (`git show fixed-version:storage.rules`); rules deploy is instant and data is untouched. Ledger documents are additive and harmless if code is reverted.

---
# Part 3: Central Story Library (DESIGN FOR REVIEW, nothing implemented)

Branch: `story-spark-2.0-central-library` (phase-2-security + reader slice; independent of the other security branches). Status: **design and cost model only.** No seeder, cache, dashboard or rules have been written. Nothing merged, deployed, or run against production; no credentials used. This part **supersedes the `story_library` shape in section 4**, which embedded full pages in one Firestore document (that is Option A below, and it is the most expensive option).

## 3.1 What the numbers say (read this first)

Reproduce with `node --experimental-strip-types scripts/cost-model/story-library-cost.ts` (pure arithmetic, no network).

1. **Media bandwidth, not Firestore reads, is the recurring cost.** At 100,000 learners with a 60% device-cache hit, Option B costs about $144/month, of which about $137 is Storage (almost all egress) and about $7 is Firestore. Cutting Firestore reads to zero would barely change the bill.
2. **The device cache hit rate is the biggest lever.** Same scale, Option B: $281/month at a 20% hit rate, $144 at 60%, $59 at 85%. The IndexedDB cache is a cost feature, not a nicety.
3. **Option A (full story docs in Firestore) is about 2.2x Option B** at target scale ($320 vs $144) and 4x at an 85% hit rate. Browsing reads full documents, and A cannot shed the media bandwidth because media must live in Storage anyway.
4. **Option C (CDN) saves only about 14%** at target ($124 vs $144) before the load balancer fixed costs I could not verify. It is not decisive at this scale. Recommendation: build B with content-hashed immutable URLs so C becomes a base-URL change later.
5. **Firebase Hosting is not a cheaper CDN:** at the Hosting rate ($0.15/GB, hits and misses both counted) the same traffic is about $173/month versus about $129 for Storage egress.
6. **Centralization does not remove per-learner costs.** Generation and storage are paid once (storage for 2,000 stories x 3 versions is well under $1/month), but reads, writes and downloads still grow linearly with learners x sessions. They do not grow with the number of stories.
7. **Per-page-turn progress writes cost about 8x more** than batched checkpoints ($21 vs $2.70/month at target). Batching is cheap to do and is in the design.
8. **Teacher dashboards dominate Firestore reads** (12M of 15.6M reads/month at target, under my assumption of 400 class views per school per month x 30 students). Design response: cached class rollups (3.10).
9. **Storage rules with Firestore lookups cost money per file.** The existing `storage.rules` header states that each rule evaluation that reads Firestore is billed as a read. Applying the school-membership lookups to every image and audio file would add about 30M reads/month at target (about $9), plus latency. The new library path therefore uses no Firestore lookups (3.8).

## 3.2 Pricing used (verified 2026-11-07)

| Item | Price | Source |
|---|---|---|
| Firestore reads / writes / deletes | $0.03 / $0.09 / $0.01 per 100k | [Firestore pricing](https://cloud.google.com/firestore/pricing) |
| Firestore free quota | 50k reads, 20k writes, 20k deletes per day; 1 GiB stored; one free database per project | same |
| Firestore stored data | $0.000205479/GiB/day (about $0.075/GiB-month, my derivation) | same |
| Firestore egress | 10 GiB/month free, then $0.12/GiB (worldwide row, 10 GiB to 1 TiB) | same |
| Firestore billing detail | Minimum one read per query; skipped docs via offset are billed; requests succeed even when a budget is exceeded | same |
| Cloud Storage Standard | us-central1 $0.02/GiB-month; multi-region $0.026 | [Cloud Storage pricing](https://cloud.google.com/storage/pricing) |
| Storage operations | Class B (reads) $0.0004 per 1,000; Class A (writes) $0.005 per 1,000 regional, $0.01 multi-region | same |
| Storage egress to internet | $0.12/GiB (0 to 10 TiB), $0.11 (10 to 150 TiB), worldwide excluding Asia/Australia | same |
| Firebase Hosting | 10 GB storage and 10 GB/month transfer free; Blaze $0.026/GB stored, $0.15/GB transfer; cache hits and misses both count; budget alerts do not cap usage | [Hosting pricing](https://firebase.google.cn/docs/hosting/usage-quotas-pricing?hl=en) (mirror of firebase.google.com) |
| Cloud CDN egress | "All other destinations" $0.09/GiB (0 to 10 TiB), $0.06 (10 to 150 TiB); Europe/North America $0.08 | [Cloud CDN pricing](https://cloud.google.com/cdn/pricing) |
| Cloud CDN cache fill | $0.01 within NA/EU; $0.02 within Africa etc.; $0.04 inter-region | same |
| Cloud CDN requests | $0.0075 per 10,000 cache lookups | same |

**Unverified or assumed, and flagged:**
- Ghana is not listed as a destination on either egress table. I treated it as "worldwide" for Storage ($0.12) and "all other destinations" for Cloud CDN ($0.09). **Please confirm against the pricing calculator.**
- Cloud Storage for Firebase's own pricing page could not be fetched (blocked by the site's robots.txt). I used Cloud Storage pricing as the proxy and did not model any Firebase-specific no-cost Storage quota, so costs may be slightly overstated.
- Cloud CDN needs an external HTTPS load balancer in front of a backend bucket. Its fixed and per-GB charges, invalidation charges, and whether origin-to-CDN fill is billed again as Storage egress are **not verified and not included**. Option C's real cost is therefore higher than shown.
- Your production Firestore and bucket locations are unknown to me; prices above are the single set the page lists. Multi-region vs regional price differences were not confirmed.
- The model subtracts the full Firestore free quota, but the existing app already consumes part of it, so real cost is slightly higher.
- One-time AI generation cost is **not** in USD: I did not verify current Gemini/Imagen/TTS pricing. Phase 1 estimated 56 credits for an 8-page story; 2,000 stories is about 112,000 credits before retries, and I cannot convert credits to money.
- Firestore stored data, Cloud Functions, App Hosting and existing app traffic are excluded.

## 3.3 Assumptions (all unmeasured; replace with pilot data)

| Assumption | Value |
|---|---|
| Active learners / schools | 100,000 / 1,000 (target); 1,000 / 10, 10,000 / 100 and 500,000 / 5,000 also modelled |
| Sessions per learner per month | 12 (about 3 per week) |
| Story opens per session | 2 |
| Device cache hit (opens needing no network) | 60% typical; 20% worst; 85% best |
| Package size per uncached open | 1.2 MB (about 10 pages: roughly 0.5 MB WebP images, 0.6 MB Opus speech, text) |
| Files per package | 21 (package JSON + 10 images + 10 audio) |
| Progress checkpoints per open | 1.5 (batched); 10 (naive, per page) |
| Reads per session, all options | 1 progress doc + 1 class-assignment doc; B/C add 1 versioned-pointer doc |
| Option A browsing | 3 catalogue pages x 20 full docs (about 20 KB each) per session, no persistent cache |
| Teacher dashboard | 400 views per school per month x 30 student docs |
| Library | 2,000 stories, 3 versions kept |
| Option C edge hit | 90% of device misses served from the CDN edge |

## 3.4 Results

Options: **A** full story docs in Firestore (media in Storage). **B** compact Firestore catalogue + immutable packages in Storage, no Firestore lookups in Storage rules. **B-lookup** same as B but with school-membership lookups in Storage rules. **C** same catalogue, packages served by Cloud CDN.

**By scale (typical 60% device cache):**

| Scale | Option | Firestore reads/mo | Writes/mo | Media GiB/mo | Total $/mo | $/learner/mo |
|---|---|---|---|---|---|---|
| Pilot (1,000 learners) | A / B / C | 874k / 156k / 156k | 36k | 10 to 11 | $1.91 / $1.54 / $1.35 | 0.0019 / 0.0015 / 0.0013 |
| 100 schools (10,000) | A / B / C | 8.7M / 1.6M / 1.6M | 360k | 102 to 107 | $30 / $14 / $12 | 0.0030 / 0.0014 / 0.0012 |
| **Target: 1,000 schools (100,000)** | A | 87.4M | 3.6M | 1,019 | **$320** | 0.0032 |
| | B | 15.6M | 3.6M | 1,073 | **$144** | 0.0014 |
| | B-lookup | 45.8M | 3.6M | 1,073 | $153 | 0.0015 |
| | C | 15.6M | 3.6M | 1,073 | $124 (excl. LB) | 0.0012 |
| 5x target (500,000) | A / B / C | 437M / 78M / 78M | 18M | 5,096 to 5,364 | $1,611 / $724 / $624 | 0.0032 / 0.0014 / 0.0012 |

**Cache sensitivity at target scale (total $/month):**

| Device cache hit | A | B | B-lookup | C |
|---|---|---|---|---|
| 20% (worst) | $453 | $281 | $299 | $241 |
| 60% (typical) | $320 | $144 | $153 | $124 |
| 85% (best) | $238 | $59 | $62 | $51 |

Cost is almost exactly linear in learners (B stays near $0.0014 per learner per month) and in package size: if the real package is 3 MB instead of 1.2 MB, the media portion scales 2.5x. **Measure the pilot stories' real package size before trusting any dollar figure.**

## 3.5 Recommendation

**Build Option B, with every media URL content-hashed and immutable so that moving to C is a base-URL configuration change, not a redesign.** Reasons: lowest complexity per dollar saved; C's saving (about $20/month at target) is within the noise of my unverified assumptions and the unverified load-balancer fixed cost; B keeps Firebase security rules and SDK in the path. Revisit C if (a) Ghana latency is poor from the chosen bucket location, or (b) monthly egress approaches the 10 TiB tier boundary where CDN rates fall to $0.06 vs $0.11. Not recommended: Option A (2x to 4x the cost, no benefit), and Firebase Hosting as the media CDN (dearer than Storage).

## 3.6 Data model

All catalogue and admin writes are **server-only** (Admin SDK bypasses rules; client rules say `write: if false`).

```
Firestore
  library_meta/current               // the ONE doc every client reads per session
    catalogueVersion:int, updatedAt, minClientVersion,
    bundles:[{tier, path, sha256, bytes, count}],         // static catalogue bundles in Storage (see 3.10)
    tombstones:[{storyId, withdrawnAtVersion}],           // so clients purge withdrawn stories
    controls:{downloadsEnabled, catalogueSyncEnabled, progressWritesEnabled}   // kill switches, 3.11
  story_catalogue/{storyId}          // compact, published or withdrawn only (about 1.5 KB)
    storyKey, version, packageVersion, status:'published'|'withdrawn', title, summary, language,
    ageTiers[], level, categories[], themes[], objectives[], pageCount, durationSec,
    cover:{hash, w, h, alt}, hasNarration, hasActivities,
    packagePath, packageHash, packageBytes, contentHash, publishedAt, updatedAt, sortKey, attribution
  story_library_admin/{storyId}      // publisher-only: workflow + licensing + dedup fingerprints
    status: draft|review|approved|published|withdrawn, author, approver, revisions[], reviewNotes,
    licensing:{assets:[{hash, kind, source, licenseId, territory, expiresAt, attribution, aiProvenance?}]},
    fingerprints:{contentHash, textMinHash, titleSlug}
  library_seed_jobs/{jobId}  + /items/{storyKey}    // resumable seeding state (3.7)
  school_story_assignments/{schoolId}_{classId}     // one doc per class: list of storyIds, due dates
  story_progress/{schoolId}_{studentId}             // ONE doc per learner: entries.{storyId}:{v, page, status, mode, updatedAt}
  library_usage_daily/{yyyymmdd}                    // server-written aggregates for the dashboard

Storage (new paths, no Firestore lookups in their rules)
  story_library/private/{jobId}/...                 // staging: publishers only
  story_library/published/packages/{storyId}/v{n}/package.json
  story_library/published/assets/{hash[0:2]}/{sha256}.{webp|opus}    // content-addressed, shared across stories
  story_library/published/catalogue/{tier}-{sha256}.json.gz          // versioned catalogue bundles
```

`package.json` (immutable; one fetch gives all text; media fetched lazily by hash):

```json
{ "schemaVersion": 1, "storyId": "…", "version": 3, "contentHash": "sha256:…", "title": "…",
  "pages": [ { "n": 1, "text": "…", "sentences": ["…"], "image": "sha256:…",
               "audio": { "hash": "sha256:…", "durationMs": 21400, "sentenceTimings": [0, 3100, 6900] } } ],
  "activities": [ { "type": "comprehension", "…": "…" } ],
  "assets": { "sha256:…": { "path": "story_library/published/assets/ab/…webp", "bytes": 48211, "type": "image/webp" } } }
```

Why this shape: a child opening a story costs one package fetch plus lazy media, with **no Firestore document per page** (Firestore's 1 MiB document limit and per-doc read billing both disappear for page content). Content-addressed assets mean a recurring character illustration or shared sound is stored, billed and cached once.

Objects are uploaded with `Cache-Control: public, max-age=31536000, immutable`. Note: Storage objects that require a signed-in user are cached by the browser but not by shared CDNs; shared caching needs Option C's public URLs.

## 3.7 Seeding architecture (idempotent, resumable, versioned, duplicate-aware)

CLI: `scripts/library/seed-story-library.ts --input <dir> --target emulator|synthetic [--dry-run] [--resume]`. Default is dry-run. It **refuses any target that resolves to the production project** unless a separate explicit approval flag is added in a later change (same guard pattern as `src/lib/staging-guard.ts`). Until you approve otherwise it only runs against the emulator or synthetic data.

Input per story: `story.json` (metadata, pages, objectives, activities, licence records) + referenced image/audio files. A `manifest.json` lists stories.

Pipeline per story, each stage recorded in `library_seed_jobs/{jobId}/items/{storyKey}.state`:
1. **validate**: JSON schema; age tier; page count; every asset present, within size/dimension/duration caps; every asset has a licence record; required objectives; basic content-safety checklist flags. Failures are reported, never auto-fixed.
2. **fingerprint**: canonical JSON + asset hashes give `contentHash`; normalised-text 5-gram MinHash gives `textMinHash`; title slug.
3. **dedupe**: (a) same `storyKey` and same `contentHash` is skipped (idempotent re-run); (b) same `storyKey`, different hash is a **new version** n+1; (c) different key but same hash, or MinHash similarity at or above 0.85 (LSH, so thousands of stories need no full pairwise scan), is **blocked as a duplicate** pending a publisher decision recorded in the manifest; (d) identical assets are uploaded once.
4. **upload assets** to `private/{jobId}/` as create-only (`ifGenerationMatch: 0`), so a retried upload can never overwrite or double-write.
5. **write package + admin doc** (status `review`). Firestore writes are chunked (at most 500 per batch, ramped via BulkWriter).
6. **publish** is a separate command: copies private objects to `published/` content-addressed paths, writes `story_catalogue/{id}`, updates the catalogue bundle, then bumps `library_meta/current.catalogueVersion` **last** (so clients never see a catalogue entry whose package is missing).

`jobId` is derived from the manifest hash, so re-running the same input resumes the same job: `done` items are skipped, `failed` items retry with an attempt cap. Every stage is safe to repeat. **Rollback of a bad publish** = flip `packageVersion` back and bump the catalogue version; old versions are never deleted until a retention sweep that you approve.

## 3.8 Security design

**Who can do what**

| Action | Who |
|---|---|
| Seed, edit, approve, publish, withdraw | Central publishers only: custom claim `story_publisher` set server-side (addresses S4), or the existing super-admin rule. Four-eyes: the approver must differ from the author (enforced in the server publish step and tested). |
| Read published catalogue and packages | Any signed-in member of an authorized school |
| Read drafts, review notes, licence details | Publishers only |
| Assignments, progress | The owning school only (existing school-isolation pattern); parents and students limited to their own |

**Rules sketch (to be written and emulator-tested in Stage 1):**

```
match /library_meta/{d}       { allow get: if libraryReader(); allow write: if false; }
match /story_catalogue/{id}   { allow get: if libraryReader() && resource.data.status == 'published';
                                allow list: if libraryReader() && request.query.limit <= 50
                                            && resource.data.status == 'published';
                                allow write: if false; }
match /story_library_admin/{id} { allow read: if isStoryPublisher(); allow write: if false; }
match /story_progress/{key}   { // school-scoped as today, plus a throttle: one write per 10 s per learner
                                allow update: if sameSchool(resource) && request.time > resource.data.updatedAt + duration.value(10, 's'); }
// storage.rules
match /story_library/published/{p=**} { allow read: if signedIn(); allow write: if false; }
match /story_library/private/{p=**}   { allow read: if request.auth.token.story_publisher == true; allow write: if false; }
```

The Storage read rule deliberately does **no Firestore lookup** (cost, 3.1 item 9; latency; and the 2-lookup limit). Trade-off to decide (D2): any signed-in user who has a path can fetch the file. Paths are content hashes and are only discoverable through the catalogue, and the content is non-confidential and licensed for all schools. If you need cheap revocation at the Storage layer, the alternative is a server-set claim `library=true` checked without any read; claims refresh with the ID token (up to an hour) and nothing in this repo sets claims today (S5), so that is new, approvable work.

**Public or CDN delivery (Option C only):** packages and assets contain no personal data by construction: the seeder validates that packages contain only story content, no user ids, school ids, names, voice recordings or analytics. A schema allow-list, not a deny-list, enforces this. Progress, assignments and any learner data never go near the library bucket paths.

**Publication, caching and revocation (honest limits):**
- Withdraw = catalogue `status: 'withdrawn'` + tombstone + catalogue version bump; clients purge on next session. Hard removal deletes the immutable objects (and, for Option C, invalidates the CDN).
- Revocation is **prospective, not retroactive**: a copy already on a child's device stays there until the app purges it, and a tampered client could ignore the purge. This is true of any offline content.
- Token download URLs (`?alt=media&token=…`) bypass rules entirely and are not revoked by rule changes (as noted in Phase 2). The library uses SDK or content-hash path access, never stored token URLs.
- A school's access is gated by `schools/{id}.libraryEnabled` at the Firestore catalogue layer (one extra document lookup per query, not per document).

**Asset licensing (needs a human, I cannot verify licences):** the publish step refuses any story whose assets lack a licence record (source, licence id, territory, expiry, attribution). For AI-generated art and speech the record stores the model, version and prompt hash, and a person must confirm the provider's terms allow commercial redistribution to schools before publication; that is a legal question for you, not something I can certify. No music ships until a licensed source is chosen. Licences with an expiry date feed a withdraw-by report.

## 3.9 Reads discipline

- **No `onSnapshot` on the library, ever.** Catalogue and packages are fetched, not subscribed. The one document read per session (`library_meta/current`) is a `getDoc`.
- Opening a story or turning a page costs **zero** Firestore reads (package and media come from cache or Storage).
- Catalogue browsing uses the cached bundle; Firestore catalogue queries (search by category, "new this week") are cursor-paginated (`startAfter`, never offset), `limit <= 50`, enforced in rules.
- Progress is read once per session (one document), not per story.

## 3.10 Client cache, progress batching, and teacher views

- **IndexedDB** database `gam-story-library`: stores `meta`, `catalogue`, `packages` (`storyId@version`), `media` (hash to Blob, with `lastUsed`, `bytes`), `outbox` (pending progress). LRU eviction with a cap (default 250 MB, configurable); `navigator.storage.persist()` requested. Caveat: some browsers (notably Safari on iOS) may evict site data after inactivity; the cache is an optimisation, never the source of truth.
- **Version-based refresh:** read `library_meta/current` at session start and at most every 6 hours; if `catalogueVersion` is unchanged, do nothing. If changed, fetch only the changed catalogue bundle (content-hashed file, so also HTTP-cacheable). One read per session, flat regardless of library size.
- **Shared school devices:** library content is non-personal, so it stays cached across learners; the progress outbox is keyed by learner and flushed or cleared on sign-out.
- **Prefetch:** next story in an assignment, on unmetered or school Wi-Fi only; a teacher "download for class" action warms the cache before the lesson (also protects families and schools from mobile data costs).
- **Progress checkpoints** (instead of a write per page): halfway page, completion, tab hidden, 60 s idle, and session end; queued in the outbox and flushed as one field-path update to the learner's single progress doc. Rules throttle to one write per 10 s per learner, which also caps abuse.
- **Teacher dashboards:** read per-class rollups cached client-side for 15 minutes, with a manual refresh, so one view is not 30 fresh reads each time. (Server-computed rollups are an option once a scheduled job is approved; none is created here.)

## 3.11 Monitoring, budgets, safeguards

**Budget alerts do not stop billing.** Google states that requests succeed even when a budget is exceeded, and the Hosting page says the same. An alert is a notification, not a limit. The safeguards below are layered, from soft to hard:

| Layer | Mechanism | Stops spend? |
|---|---|---|
| 1. Efficiency | Cache, batching, bundle, throttled progress (rules) | Reduces it |
| 2. Query limits | `request.query.limit <= 50` in rules; no offset | Yes, per query |
| 3. Soft kill switches | `library_meta/current.controls` (`downloadsEnabled`, `catalogueSyncEnabled`, `progressWritesEnabled`), honoured by the client and by server routes | Cooperative (a modified client could ignore them) |
| 4. Hard stop, Firestore | Rules read the control flag (about one extra read per query or write) | Yes |
| 5. Hard stop, Storage | Emergency rules deploy that denies `story_library/published/**` (instant, needs your approval at the time) or claim-based gating | Yes |
| 6. Alerts | Budget alerts at 50/80/100/150% of the modelled monthly figure; anomaly rules: reads/day above 3x the 14-day median, media GiB/day above 2.5x | No: notifies |
| 7. Billing detach (nuclear) | Disabling billing stops all paid services; **not recommended** as automation (can take the whole platform down) | Yes, drastically |

Items 5 to 7 and any Pub/Sub budget wiring need IAM or billing resources: **nothing is created without your approval.** App Check on Storage and Firestore is recommended against scripted abuse; it needs console configuration, so it is a decision, not something I will switch on.

**Admin usage dashboard** (super-admin only):
- *Tier 1 (no new IAM):* estimates computed from data the app already writes (progress checkpoints, catalogue, `library_usage_daily` aggregates written by server routes): story opens, estimated Firestore reads (opens x per-session reads), estimated media GiB (cache misses x package bytes), AI credits spent from the existing ledger, 30-day trend, the model's budget line, current control flags.
- *Tier 2 (needs approval):* actuals from Cloud Monitoring (Firestore `document/read_count`, Storage sent bytes) and Cloud Billing export to BigQuery, which need monitoring/BigQuery read roles on a service account.
- Always labelled **estimate** vs **actual**, never mixed.

## 3.12 Testing the economics

| Level | What | Where | Proves |
|---|---|---|---|
| L1 | Cost-model unit tests (pricing constants, linearity in learners, A > B, batching about 8x) | CI (Vitest) | The model is arithmetic-correct |
| L2 | Deterministic simulator: N virtual learners x one month, driving the **real** cache and progress-batching code against a fake backend that counts reads, writes, GETs and bytes | CI | The code's operation counts match the model within a set tolerance; catalogue reads stay constant as library size grows; page turns cost zero reads |
| L3 | Rules matrix: publisher-only writes, drafts hidden, other school denied, `limit` cap, 10 s throttle, no stored-token reads, `firestore.rules` and `src/firestore.rules` identical | Emulator in GitHub Actions | Security and the hard query limits |
| L4 | Emulator micro-load (hundreds of virtual clients) | CI | Correctness under concurrency only. **Emulator timing is not evidence of production capacity.** |
| L5 | Production-scale test | **Not run.** Needs your approval, a staging project (Workstream A), a capped budget and a verified kill switch first | Real latency, hot-object behaviour, true bandwidth |

Scale points to simulate: 10, 100, 1,000 schools; 1,000, 10,000, 100,000 learners; cache hit 20/60/85%; stories 200/2,000/20,000 (reads must be flat in the last axis).

Capacity questions I cannot answer from documentation I verified: popular-object read limits on Cloud Storage at a school-morning peak (100,000 learners, roughly 10% concurrent, a shared story: on the order of 10,000 simultaneous fetches). That is what L5 exists for; until then it is a risk, not a finding.

## 3.13 Staged implementation (after you approve this design)

Each stage is its own commit set on `story-spark-2.0-central-library`, with a CI run link as evidence, and a separate report.
1. Schema, rules, rules tests (Firestore + Storage), cost-model tests.
2. Seeder (emulator or synthetic only) + a synthetic corpus of 1,000 procedurally generated stories with realistically sized dummy media.
3. Client cache + progress batching library (fake-IndexedDB tests), wired to the reader behind a flag that is off by default.
4. Usage dashboard (tier 1) and controls.
5. Simulator and load tests (L1 to L4).
6. Decision point on Option C with measured package sizes.

## 3.14 Decisions I need from you

- **D1** Per-story `package.json` + content-addressed media (recommended), or a single bundled archive per story (fewer requests, no cross-story asset dedup)?
- **D2** Storage read gating: signed-in only (recommended for cost; no cheap revocation) or server-set `library` claim (cheap revocation; new claim-setting code and up to an hour of lag)?
- **D3** Bucket location for the library and where your Firestore database lives (affects price and Ghana latency; I could not verify either).
- **D4** Publisher roles: confirm the `story_publisher` claim and four-eyes approval.
- **D5** Target library size and languages for the first year (I assumed 2,000 English stories).
- **D6** Is the 85%/60%/20% cache range realistic? Are school devices shared and persistent (Chromebooks, tablets) or personal phones?
- **D7** Is the 1.2 MB package assumption acceptable, or should I set a byte budget per page for the seeder to enforce?
- **D8** Confirm Ghana egress pricing in the calculator, and approve the load-balancer research for Option C, or drop C.

## 3.15 Risks and limits (honest)

- All costs rest on the assumptions in 3.3. Package size and device cache hit are the two that move the bill most, and both are unmeasured.
- Storage-layer revocation is prospective only; offline copies persist.
- The teacher-dashboard read estimate (12M of 15.6M reads) comes from my usage assumption, not data.
- Two things I could not verify are listed in 3.2; Option C is the one they affect.
- Existing `junior_stories` content is untouched and remains readable through `normalizeStory()`.
- This design adds no scheduled job; anything periodic (retention sweep, rollups, licence-expiry report) is proposed as a manual or approved-schedule action.
