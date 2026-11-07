# Story Spark 2.0: premium content upgrade, report

*Branch `story-spark-2.0-central-library`. Previous verified commit `577c651`. Date: 7 November 2026. Nothing has been merged into `fixed-version`, deployed to production, published to the live library, or spent on paid services. No production Firebase configuration, rules or data were touched, and no new write operation was added.*

## 1. What is complete, what is a placeholder, what is not done

| Item | State |
|---|---|
| Existing reader, three modes, synchronised highlighting, activities, phonics, vocabulary, caching, central-library architecture, school-created stories | **Preserved, unchanged** (all earlier tests still pass) |
| *Efua’s Honest Business* revised manuscript (12 pages), 13 activities, 8-word glossary, teacher’s guide, character and setting bible, 13-shot list | **Complete as a draft.** Not yet reviewed by any human. |
| Pronunciation dictionary (18 entries), spoken-script builder, sentence/page regeneration with timing revalidation | **Complete and tested.** Every entry is `needs-native-review`; none is verified. |
| Reusable illustration pipeline (style bible, sheets, shots, deterministic prompts, validation, honest status, dry-run cost) | **Complete as specification and code.** |
| Illustrations | **None generated.** The reader shows labelled placeholders and states "0 of 13 approved image files exist". |
| Narration | **Placeholder robotic voice** (free espeak-ng) with engine word timing; now fed the dictionary’s candidate respellings. Not production audio. |
| Native-speaker pronunciation verification | **Not done** (needs people). |
| Two additional samples for editorial review | **Drafted:** *Yaa and the Blocked Drain* (Primary 4) and *Kofi Counts the Market* (KG 2), each with activities, glossary, teacher’s guide, open review questions. |
| Proposed 65-story catalogue | **Complete as a plan** (`PROPOSED-CATALOGUE.md`), generated from typed data and tested. |
| Cost comparison | **Done** (`NARRATION-ASSESSMENT.md` section 6, `premium-cost.ts`). |

## 2. Deliverables (as requested)

1. **Assessment of the existing narration:** `NARRATION-ASSESSMENT.md` §1-2. The original narrator is the browser’s built-in speech engine, not Gemini.
2. **Recommended Ghanaian pronunciation solution:** §5 of the same document. Pre-generated sentence clips, written spelling never changed, native-speaker-verified lexicon as a hard gate, a small audition before any spend.
3. **Cost comparison:** audio and images, per story and for 65 stories. Machine costs are small; review people are the real cost.
4. **Revised manuscript and activities:** `EFUA-MANUSCRIPT-REVIEW.md`, source in `pilot/efua-premium.ts`.
5. **Illustration specification and sample:** `ILLUSTRATION-SPEC.md`. **No sample image exists**, because generating one needs your approval of the model and spend.
6. **Working protected preview:** `/story-spark-preview` (8 stories). It now shows an honest status panel, a name-pronunciation panel and the teacher’s guide for the stories that have one. It shows only what is genuinely done.
7. **65-story catalogue:** `PROPOSED-CATALOGUE.md`.
8. **This report.** Also `PRODUCTION-PIPELINE.md`.

## 3. Preview isolation from production Firebase

* **The page itself is isolated.** `src/lib/story-library/preview-isolation.test.ts` walks the real import graph of `/story-spark-preview` and fails if any module imports Firebase (client or admin), the app’s Firebase wrapper, server actions or the AI flows, or makes a write request. It passes. The page reads only static files under `/story-spark-preview` and keeps reading progress in the browser.
* **The app around it is not isolated.** `src/app/layout.tsx` mounts the app-wide `FirebaseClientProvider` for every route, and `src/firebase/config.ts` **falls back to the production project (`gamedu-69888475-f5783`)** when no `NEXT_PUBLIC_FIREBASE_*` variables are set. For an anonymous visitor this only starts the auth listener (no reads or writes). If anyone *signs in* on a Vercel preview URL, the whole app talks to production Firebase, exactly as every existing preview already does.
* **I changed no Vercel or Firebase setting.** Vercel is integrated with GitHub (the bot creates a Preview deployment per push). I cannot open `vercel.app` addresses from this environment, so I cannot confirm whether Deployment Protection is on or what environment variables the previews use.
* **Needs your decision before any new write feature:** point Vercel *Preview* environment variables at a staging Firebase project (or the emulator), and confirm Deployment Protection. Both need access I was not given.

## 4. Things I found that you should know

* **The existing image action may be broken.** `generateLessonImageAction` calls `imagen-4.0-fast-generate-001`, which a third-party report says Google planned to shut down from 17 August 2026. Not verified against Google’s own page; not changed.
* **Gemini TTS cannot be guaranteed on Ghanaian names:** no phoneme control is documented; en-GH is not a listed locale; word timestamps are not documented. Tone in Akan cannot be expressed by any engine considered.
* **Unverified cultural details:** every Ghanaian name, the groundnut-cake recipe, prices in cedis, Dede’s origin, and the settings in the catalogue need review by people from the relevant communities.
* **The Yaa story needs a safety review:** children working at a drain should be shown with adult supervision and gloves.
* **The catalogue contains a few politically or culturally sensitive premises** (a vote, small-scale mining and a river, a named community). They are flagged for neutral, sensitive handling and must not proceed without local review.

## 5. Tests and checks

* Unit tests: see CI (below). New tests this round: pronunciation (24), Efua premium and illustration plan (about 25), catalogue (8), preview isolation (3), cost model (7), updated pilot and dashboard tests.
* TypeScript: **245 errors, identical to the known baseline; 0 new** (`.next` removed before counting).
* Production build: passes locally.
* Security-rules suite: unchanged by this work; see CI.

## 6. Remaining work and decisions needed

**Approvals I need (nothing proceeds without them):**
1. Approve (or change) the style bible and Efua’s character sheets.
2. Approve a first sample image of Efua page 1 (about $0.40 with retries) and name the model, the billing project and who approves spend.
3. Approve a text-to-speech audition (about $1) of the seven names and one Efua page through two or three engines, and name two native-speaker reviewers.
4. Decide where Vercel previews should point for Firebase (staging project or emulator).

**People needed:** native-speaker pronunciation reviewers, a Ghanaian educator for text and culture, a financial-literacy reviewer for Efua, a curriculum reviewer to verify subject alignment, an art reviewer.

**Next engineering steps once approved:** audition harness and scoring sheet; forced-alignment option for word timing on engine-generated clips; sentence-clip audio player support for splicing; image pipeline script with a dry-run and an explicit cost-approval switch; wire pronunciation blockers into the readiness check.
