# Dependency security and reproducibility (audit checkpoint 2)

## 1. Reproducibility (EXECUTED)
- A clean isolated checkout (git worktree of the committed head, **owner's working tree untouched**) ran `npm ci --no-audit --no-fund`: **exit 0, 1,301 packages, 138 s**. `node scripts/audit/check-lockfile-sync.mjs` then reported **1,296 installed packages match `package-lock.json`**; `dompurify` resolved to **3.5.0** with `@types/dompurify` present.
- The owner's real working copy had drifted (dompurify 2.5.8, no `@types/dompurify`); it was corrected earlier with a no-save install of the locked versions and now also passes the check. **Action for every dev machine and CI: `npm ci`.**
- Added: `scripts/audit/check-lockfile-sync.mjs` and a CI step (`foundation-verification.yml`) so drift fails the build.

## 2. `npm audit` (EXECUTED, lockfile as committed)
**136 advisories: 9 critical, 37 high, 84 moderate, 6 low across 1,382 dependencies.** Automatic `npm audit fix --force` was **not** run (it would take major upgrades such as vitest 5 and jspdf 4).

| Package | Severity | Kind | Exploitability review | Recommendation | Class |
|---|---|---|---|---|---|
| **next 15.5.9** | critical (aggregate) | production direct | Advisories: Server Components request-deserialization DoS, Image Optimizer DoS, request smuggling in rewrites, unbounded image cache. Vercel hosting mitigates some self-hosted-only items, but not every one is verified as mitigated | **Patch to 15.5.29** (same minor). **Tested** on branch `audit/next-15.5.29-patch`: `npm ci`, install, `next build` exit 0 (156 static pages, first-load JS unchanged within 1 kB), whole-repo Vitest 3,819 tests with only the two failures `fixed-version` already corrects. **Not merged** | OWNER_DECISION (D-025) |
| **jspdf 2.5.2** | critical (aggregate) | production direct | ReDoS and DoS in old APIs; Node-only local-file inclusion (not in the browser build); AcroForm field injection (feature unused); BMP-decoder DoS (the statement PDF accepts only PNG/JPEG/WebP logos; other finance PDFs not reviewed); XMP metadata injection. jspdf bundles its own old `dompurify@2` for `html()` (not used) | Major upgrade to 4.x needs a regression pass over every PDF in finance (receipts, statements, payslips) | JOINT_REVIEW (D-026) |
| zod | high | production direct | Memory exhaustion validating oversized constrained collections; no fix available upstream in range | Bound input sizes at API boundaries (done for Ask Teacher); watch for a fix | OWNER_DECISION (D-027) |
| @genkit-ai/next | high | production direct | No fix available | Review usage; do not auto-upgrade | OWNER_DECISION (D-027) |
| fast-xml-parser, protobufjs, proxy-addr, websocket-driver, @grpc/grpc-js, ws, axios, node-forge, lodash, etc. | critical/high | transitive (Firebase Admin / Google Cloud / Genkit tooling) | **Not traced path-by-path.** Mostly server-side client libraries that parse responses from Google services or dev tooling; exploitation needs attacker-controlled input to those parsers | `npm audit fix` (non-force) in a branch with the full test suite; re-run audit | VERIFICATION_REQUIRED |
| vitest / tinypool, genkit-cli, postcss | critical/high | dev tooling | Only on a developer machine or CI; vitest advisory needs the dev server exposed | Upgrade vitest 3 → 5 deliberately (major) | OWNER_DECISION |
| dompurify | moderate | production (sanitiser) | Locked **3.5.0 is above every listed vulnerable range**; the flagged range is jspdf's nested 2.x copy (html() unused) | None for the app; resolved with the jspdf upgrade | — |

## 3. Related configuration risk (READ)
`next.config.ts` allows the Image Optimizer to fetch **any https host** (`images.remotePatterns: [{ protocol: 'https', hostname: '**' }]`). On Vercel this is an open image-processing proxy that anyone can call, i.e. a **cost-abuse vector** and the same class as the optimiser advisories above. Inventory the real image hosts (Firebase Storage, Google profile photos, the CDN bucket) and restrict the pattern. Class JOINT_REVIEW (D-029); the cost effect is an owner decision.

## 4. What was and was not done
Done: reproducible install proven, advisories triaged by direct/dev/transitive and by usage, one tested patch branch. Not done: path-by-path exploitability of every transitive advisory; automated Dependabot/`npm audit` gating in CI (a non-blocking report step is recommended once the owner decides the severity threshold); major upgrades (jspdf, vitest).
