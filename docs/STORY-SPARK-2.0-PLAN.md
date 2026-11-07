# Story Spark 2.0 — implementation plan

Status: **plan written; Phase 1 complete on branch `story-spark-2.0-phase-1` (local commit, not pushed). Nothing deployed, no rules published, no production data touched.**
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
