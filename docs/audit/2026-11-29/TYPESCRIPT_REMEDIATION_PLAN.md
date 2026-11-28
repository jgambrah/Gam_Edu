# TypeScript remediation plan (audit checkpoint 2)

`next.config.ts` sets `typescript.ignoreBuildErrors: true`, so a green `next build` does **not** prove type safety. The build itself was run for the audit and succeeded (compiled in ~93 s, exit 0), which is exactly why the error count must be ratcheted separately.

## Measured counts (`node scripts/audit/tsc-report.mjs`, categorised report in `tsc-report.json`)
| Moment | Errors |
|---|---:|
| Audit start (checkpoint 1) | 423 |
| After clean locked dependencies (`@types/dompurify` restored) | 418 |
| After fixing 4 runtime ReferenceErrors (finance procurement, legacy maths practice) | 414 |
| After the one-line `EntryKind` correction (63 errors from one missing union member) | **351** (current ratchet baseline) |

## Categories (from the 414 snapshot taken before the 63-error enum fix; "runtime risk" = the line can throw when executed)
| Area | Errors | Runtime risk | Security / core impact | Remediation |
|---|---:|---|---|---|
| `src/lib/story-library/pronunciation/dictionary.ts` | 63 | None (type-only: data used an unlisted `kind`) | None | **Fixed** by adding `'place-or-people'` to `EntryKind` |
| `src/lib/data/*` (curriculum seed data) | 105 | Low (data shape vs type) | None | Realign the data types in one pass (`TS2353`/`TS2741`/`TS2739`); regenerate fixtures; ~2 PRs |
| `src/lib/story-library/pilot/*` | ~70 | Low (object literals with extra/mis-cased keys, e.g. `Materials` vs `materials`) | None | Correct the keys in the batch files or widen the content type; content-owner review because it is published content |
| `scripts/*` | 99 | None shipped; `seed-dashboard-summaries.ts` cannot run as written (15 × `TS2304`) | None | Move scripts to their own `tsconfig.scripts.json` and exclude from the app config; repair or retire the broken seeder |
| CORE finance: `finance/shop/page.tsx` | 12 | Low-medium (`ShopItem` lacks vendor/reorder fields the UI reads: returns `undefined`) | Core operational (inventory UI) | Add the missing optional fields to `ShopItem`; verify against Firestore documents |
| Student enrichment: `coding-club/python-academy/page.tsx` | 13 | **Medium**: `res.data` possibly null (2), `phases/curriculum/cheatSheets/version` read off a union (UI may render nothing) | Enrichment | Narrow the union at the data boundary, null-check `res.data`; add a render test |
| components / dashboard (other) | ~9 | Mixed | — | File-by-file |
| **Runtime ReferenceErrors (`TS2304`)** | 19 → **15** | **High** if executed | — | **Fixed 4:** `finance/procurement/page.tsx` (`deleteDoc`, `toast` undeclared: the supplier-delete flow always threw) and legacy `maths-club/practice/page.tsx` (hook called inside the submit handler and removed `resultsCollection`: submitting a quiz always threw). Remaining 15 are all in `scripts/seed-dashboard-summaries.ts` |

## Phases
1. **Done:** categorisation, ratchet script and `docs/tsc-baseline.json`, CI step, the four runtime bugs, the 63-error enum correction, 5 sanitiser errors (restored `@types`).
2. **Next (small, high value):** python-academy page narrowing and null check; `ShopItem` optional fields; repair/retire `seed-dashboard-summaries.ts`.
3. **Data typing:** `src/lib/data/*` and `story-library/pilot/*` (content-owner review).
4. **Tooling:** separate scripts tsconfig; lint rule that forbids hooks inside handlers (`react-hooks/rules-of-hooks` already errors; confirm it is enforced in CI).
5. **Flip `ignoreBuildErrors` to `false` only when** the count is 0, the build passes with the flag off in CI, and the owner approves. Until then the ratchet prevents regressions. No `any` casts, `@ts-ignore` or disabled checks are used to reach zero.

