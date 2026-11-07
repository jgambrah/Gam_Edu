# Story Library: educational classification (proposed final schema, v1)

Code: `src/lib/story-library/classification.ts` (vocabularies, validator, catalogue projection, query shapes, index generator).
Tests: `classification.test.ts` (39). Indexes (repo config, **not deployed**): `firestore.indexes.json`.

## Principles

1. **Controlled vocabulary, stable ids.** Every classified value is a lowercase slug from a registry (`kg-1`, `early`, `folktale`). Labels are display text and can be re-worded without touching stored data. Unknown ids are rejected.
2. **Vocabulary is data.** A new class, genre, theme, objective or language is an append to a registry. Nothing else changes. (Test: adding `primary-4`; enabling `ak`.)
3. **Multi-valued where the product needs it:** classes, genres, themes, objectives, cultural tags. A story may serve several classes and a range of ages.
4. **Humans decide classification; the validator catches mistakes.** Errors block; warnings go to the reviewer (for example a Primary 3 class with ages 4–5).
5. **No invented curriculum codes.** See below.

## The classification object (stored on the draft as `classification`)

| Field | Type / values | Notes |
|---|---|---|
| `schemaVersion` | `1` | |
| `language` | `en` now; `ak`, `fat`, `ee`, `gaa`, `dag` reserved | reserved languages are **rejected** until a registry update marks them `supported` |
| `classIds[]` | `nursery-1`, `nursery-2`, `kg-1`, `kg-2`, `primary-1`, `primary-2`, `primary-3` | 1–12; registry has an `order` so later primary classes append |
| `ageMin`, `ageMax` | integers 2–12 | recommended ages; independent of classes (a story can serve several age groups) |
| `readingLevel` | `pre-reader`, `emergent`, `early`, `developing`, `fluent` | one primary level |
| `difficulty` | 1–5 | concept and vocabulary load, separate from reading level |
| `genres[]` | folktale, animal, adventure, bedtime, fantasy, science, nature, cultural, moral, educational, historical, humour, family, friendship, school-life, mystery, rhyme | 1–5 |
| `themes[]` | family, friendship, school, farm-and-garden, weather, night-sky, helping-others, lost-and-found, food, community, fear-and-courage, new-beginnings, animals-and-habitats, festivals | 0–5 |
| `objectives[]` | phonics, letter-recognition, vocabulary, reading-comprehension, sequencing, prediction, oral-language, counting, reasoning, problem-solving, emotional-intelligence, teamwork, perseverance, kindness, honesty, responsibility, respect, environmental-awareness, scientific-curiosity, cultural-heritage | 1–8; each has a `domain` (literacy, numeracy-reasoning, social-emotional, values, environment-science, culture) for analytics grouping |
| `ghanaianContext` | `none`, `incidental`, `central` | |
| `culturalTags[]` | ananse-tradition, local-food, village-life, market, festival, local-names, proverb | not allowed when context is `none` |
| `curriculum[]` | see below | optional |
| `estimatedDurationSec` | 10–3600 | read-aloud time at default speed |
| `narrationLocale` | `en-GH`, `en-GB` | must belong to the language; chosen after voice evaluation |

**Derived, not hand-entered** (computed from the package by the readiness checks, never typed by an importer): page count, narration availability (`none`/`partial`/`complete`), illustration completeness, activity availability and types. A human cannot declare a story "fully narrated"; the package either contains the narration or it does not.

## Curriculum alignment (NaCCA): verified only

We ship **no curriculum codes** (a test greps for the pattern). A `curriculum[]` entry is one of:

* **unverified** — `{ framework: 'NaCCA', verified: false, note: '...' }`: a free-text description of the strand we believe the story supports. Never shown as an official alignment. A `code` on an unverified entry is **rejected**.
* **verified** — `verified: true` with `code`, `source` (the framework document), `verifiedBy`, `verifiedAt`, all mandatory.

Before any alignment claim is shown to teachers, someone with the NaCCA documents verifies it; until then the product says "suggested focus", not "aligned".

## Catalogue projection and filters (no whole-library download)

The catalogue entry carries only compact facets: `classIds`, `classMin/classMax`, `ageMin/ageMax`, `readingLevel`, `difficulty`, `genres`, `themes`, `objectives`, `language`, `ghanaianContext`, `durationSec`, plus legacy `ageTiers` derived from the ages. Under 600 bytes of facets.

Firestore allows **one** array-contains per query, so we support exactly these server-side filters, each backed by one composite index
(`status == published`, equality fields, the array field, `sortKey` ascending; cursor-paginated, ≤ 50 per page):

| Filter | Index fields after `status` |
|---|---|
| everything (newest last) | `sortKey` |
| a class | `classIds` ∋, `sortKey` |
| a class at a reading level | `readingLevel`, `classIds` ∋, `sortKey` |
| a class in a language | `language`, `classIds` ∋, `sortKey` |
| a class, Ghanaian-context stories | `ghanaianContext`, `classIds` ∋, `sortKey` |
| a genre at a reading level | `readingLevel`, `genres` ∋, `sortKey` |
| an objective | `objectives` ∋, `sortKey` |
| a theme | `themes` ∋, `sortKey` |
| a reading level | `readingLevel`, `sortKey` |

Combinations outside this list (for example genre **and** class) are not offered server-side; the app refines the already-fetched page. 8 composite indexes total, generated by `catalogueIndexes()` and kept in sync by a test. Deploying indexes is a separate approved step.

## Classification rules (documented for importers and reviewers)

1. Choose every class the story genuinely suits; do not tick classes to widen reach. Age range follows the story's real audience, not the class list.
2. Reading level describes the **text**, not the topic: pre-reader means the child can enjoy it with no decoding.
3. Objectives are what the page activities actually practise. Do not list an objective with no activity or discussion behind it.
4. `ghanaianContext: central` only when setting, characters or customs are Ghanaian and essential to the story; `incidental` for local names or foods; otherwise `none`. A cultural reviewer confirms before publication.
5. Never enter a curriculum code from memory. Use an unverified note, or verify against the NaCCA document and record the source.
6. Use `reserved` languages only after content, narration voices and a reviewer exist for them and the registry marks the language supported.

## Not yet decided (needs the product owner or a reviewer)

* Whether `Nursery 1/2` map to Ghana's current "Crèche/Nursery" naming in all schools (ids are neutral; labels can change).
* The `typicalAge` hints in the class registry are approximate planning aids used for warnings only; confirm against GES/NaCCA documents.
* The thesaurus of themes/genres should be reviewed by teachers before real import; it is an easy append/rename.
