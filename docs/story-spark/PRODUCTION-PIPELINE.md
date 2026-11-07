# Content pipeline: Nursery 1 to JHS 3

*A plan for building the 65-story library one reviewed story at a time. Pipeline code that exists today is named; everything else is a process to adopt.*

## Principle

Quality before quantity. Each story is a small product with a writer, reviewers and an approval. **No bulk generation, no bulk publication.** The benchmark (Efua) sets the bar; two samples test it; then stories enter production a few at a time.

## Stages and gates

| # | Stage | Output | Who | Gate (must pass to continue) | Exists today |
|---|---|---|---|---|---|
| 1 | Brief | Class, reading level, objectives, genre, cultural focus | Editor | Fits the catalogue plan and is balanced across regions and themes | `PROPOSED_CATALOGUE` |
| 2 | Manuscript | Page-by-page text, glossary | Writer (original text only) | Reading level, length, vocabulary, no personal data | validators in `premium.ts`, classification checks |
| 3 | Cultural and educational review | Reviewer notes | Ghanaian educator + people from the community shown | Authentic, respectful, age appropriate, accurate (prices, foods, proverbs, names) | review records bound to content (`readiness.ts`) |
| 4 | Activities and teacher’s guide | Comprehension, vocabulary, critical thinking, reflection; guide | Educator | Every objective is backed by an activity; answers checked | `validateActivities`, readiness |
| 5 | Pronunciation | Dictionary entries verified | Native speaker | Every name verified (`pronunciationBlockers()` empty) | `pronunciation/` |
| 6 | Illustration | Character sheets, shot list, approved images | Art director / illustrator / approved generator | Sample first; every image approved with alt text; budgets met | `illustration/` |
| 7 | Narration | Sentence clips, composed timing | Narrator (human or approved engine) | Native-speaker listening review; timing verified, never estimated | `regeneration.ts`, `effectiveHighlight` |
| 8 | Premium-ready check | Readiness report | System | All steps pass; reviews match the exact content | `evaluateReadiness` |
| 9 | Independent approval | Approved | A person who did not write, edit, submit or review it | Server-checked (security rules: independent, premium-ready, not a reviewer) | rules + tests |
| 10 | Publication | Catalogue entry, version bump | Central publication service only | No client path | `publication.ts` |

## Throughput and roles (planning assumptions to confirm)

* Pilot cadence: 2-4 stories a month through all gates, increasing as the reviewer panel grows.
* Roles needed: editor, 2+ writers, 2+ Ghanaian educators (different regions), 2+ native-speaker reviewers per language used, art director, narrator or voice reviewer, curriculum reviewer, a second publisher for independent approval.
* A story that fails a gate returns to the previous stage; nothing is patched at the end.

## Order of work

1. Efua (benchmark): reviews, pronunciation, one sample image, then the rest.
2. Yaa and the Blocked Drain and Kofi Counts the Market (editorial samples): review the *method*, not just the stories.
3. Then five stories chosen to cover Nursery to JHS (one per band) as a pilot of the whole line.
4. Then the remaining catalogue in small batches, re-planning after each batch.

## Costs

Machine costs are small (see `NARRATION-ASSESSMENT.md`, section 6). Plan the budget around reviewer and art-direction hours.
