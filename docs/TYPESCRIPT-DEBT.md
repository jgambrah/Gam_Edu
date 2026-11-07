# TypeScript debt — 245 errors (baseline, unchanged by Story Spark 2.0 work)

`next.config.ts` sets `ignoreBuildErrors: true`, so **a green production build does not prove type safety**.
Measured with `npx tsc --noEmit` on this branch: **245 errors**, same as before our changes (our new/edited files add none).

## By location
| Area | Errors | Risk |
|---|---|---|
| `src/lib/data/*` (seed/curriculum data typed too strictly: TS2353/TS2741/TS2739) | 105 | Low – data shape vs. type, not logic |
| `scripts/*` (one-off seeders/migrations) | ~98 | Low – not shipped; but 2 scripts are broken (below) |
| `src/app/dashboard/*` pages | 35 | **Mixed – see "likely runtime bugs"** |
| `src/components/*` | ~7 | Low–medium |

## By kind
TS2353 ×80 and TS2741 ×63 (object literal vs type — mostly seed data) · TS2339 ×27 (property missing on type) ·
**TS2304 ×21 (name not found)** · TS2739 ×16 · TS7006 ×10 (implicit any) · TS2345 ×7 · TS18048/18047 ×7 (possibly undefined/null) · others ×14.

## Likely RUNTIME bugs hidden by ignored errors (verify, then fix separately)
These are "Cannot find name" — if the line executes, it throws `ReferenceError`:
- `src/app/dashboard/finance/procurement/page.tsx:1081-1085` — `deleteDoc`, `toast` not defined (delete flow).
- `src/app/dashboard/maths-club/practice/page.tsx:174` — `resultsCollection` not defined.
- `src/app/dashboard/resources/bs7-integrated-science/page.tsx:190,192` — `DialogDescription` not imported.
- `src/app/dashboard/coding-club/python-academy/page.tsx:425` — `res.data` possibly null.
- `src/app/dashboard/finance/shop/page.tsx:2383-2475` — `ShopItem` lacks vendor/reorder fields the UI reads (type out of date, probably harmless).
- Scripts: `scripts/seed-dashboard-summaries.ts` references undefined `currentAccounts`/`age30Accounts`/… (script cannot work as written); `update_local_mock_files*.ts` redeclare `fs`/functions.

## Suggested paydown (separate PRs, not part of Story Spark)
1. Fix the 4 ReferenceError files above (tiny, high value).
2. Loosen/realign `src/lib/data` types (single type change clears ~100).
3. Exclude `scripts/` from the app `tsconfig` or fix them.
4. Remaining page/component errors file by file; then turn `ignoreBuildErrors` off and add `tsc --noEmit` to CI with a ratchet (fail if count rises).
