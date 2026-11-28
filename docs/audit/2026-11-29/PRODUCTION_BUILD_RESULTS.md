# Production build results (audit checkpoint 2)

| Item | Value |
|---|---|
| Command | `npx next build` (`NEXT_TELEMETRY_DISABLED=1`) |
| Next.js | 15.5.9 (also run on 15.5.29 in the isolated patch branch) |
| Exit status | **0** (both) |
| Duration | Compile 93 s (15.5.9, idle machine); 2.1 min on 15.5.29 while other jobs ran; full build 335 s under contention |
| Static pages generated | 156 of 156 |
| Route lines in the table | 175 |
| Shared first-load JS | **103 kB** (15.5.9 and 15.5.29) |
| Selected routes (first-load JS) | `/dashboard` 745 kB · `/dashboard/narrated-lessons` 330 kB · `/dashboard/narrated-lessons/[lessonId]` 460 kB · `/narrated-lessons/[lessonId]` 245 kB · each `/narrated-lessons/*-pilot-preview` ≈ 241 kB · `/dashboard/coding-club/python-academy` 397 kB · `/dashboard/clubs` 120 kB (before the badge change) · `/dashboard/finance/procurement` 431 kB |
| Compiler errors | none; **type errors are not checked at build**: `typescript.ignoreBuildErrors: true` |
| Warnings | npm deprecation warnings only; none from the compiler captured as failures |

## `ignoreBuildErrors`
The flag stays **on**. A green build proves the code bundles, not that it type-checks (the supplier-delete and maths-practice ReferenceErrors both passed the build). Policy: the error count is ratcheted in CI (`docs/tsc-baseline.json`, now 351, down from 423); flip the flag only when the count is 0, the build passes with it off in CI, and the owner approves. See `TYPESCRIPT_REMEDIATION_PLAN.md`.

## Not measured here
Compressed browser transfer, route-specific and engine-specific chunk loading, cold/warm loads and Core Web Vitals need a browser (checkpoint 3). Source or route-table sizes above are **not** browser transfer sizes.
