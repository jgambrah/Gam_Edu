# Security audit (scope: Student Enrichment surface + API routes; no live/production testing performed)

## Verified OK
- **SVG sanitiser** (`svg-sanitizer.ts`, DOMPurify **3.5.0** as locked): 13 pre-existing vectors, +20 new vectors (tab/newline-split `javascript:`, `xlink:href`, `data:` URIs, animate/set, iframe/srcdoc, object/embed, link, CSS expression/behaviour/`-moz-binding`, CDATA, mXSS via noscript/math/mglyph, template, form action, null bytes, external feImage/filter) and **1,500 deterministic mutation-fuzz payloads**: no live dangerous element or attribute. (My first detector over-flagged inert *text* such as `javascript:`; replaced with a DOM-based check.)
- **No `dangerouslySetInnerHTML`, `eval`, `new Function`, `innerHTML=`, `document.write`** in enrichment components/libs.
- **Release gate** (`student-enrichment-release.ts`): fails closed while loading, unauthenticated, and for non-staff roles; default `under-construction`; no hard-coded owner identities. 19 layout files wrap enrichment routes. Not changed.
- **Core isolation**: `architecture-boundaries.test.ts` passes.
- **API routes** (33 inspected by heuristic + targeted reads): terms/* use `requireSchoolAdmin`; `v1/ai/deduct` requires a Firebase ID token and school membership; wallet statement requires a bearer token; webhooks verify HMAC (Paystack global and per-school secrets); `proxy-image` blocks SSRF with an exact-hostname + https check; pronunciation route hard-disabled in production.

## Fixed
- **D-009 Ask-Teacher (`/api/narrated-lessons/ask`)**: was anonymous; limiter keyed on a client-chosen header → bypassable and able to exhaust the shared Gemini budget. Now requires a verified Firebase ID token; limiter keyed by uid; client attaches the token. 5 new route tests (anonymous 401, forged token 401, header rotation cannot bypass, other users unaffected, safeguarding path still protective). **Residual:** counters/daily cap are in-memory per serverless instance — use a shared store (e.g. Firestore/Upstash) if a hard global cap is required.
- **D-003 Dependency drift**: local `node_modules` had dompurify 2.5.8 / no `@types/dompurify` while lockfile pins 3.5.0 / 3.0.5. Installed the locked versions with `--no-save`. **Run `npm ci` on every dev/CI machine.**

## Open
- **D-010 Python/Pyodide worker is same-origin (Blob URL)**: learner Python can call `fetch`/open IndexedDB (where Firebase Auth state lives). Threat is mainly self-inflicted (lesson code is author-trusted), but it violates defence-in-depth. Recommended: lock down network/IDB globals in the worker after load with a Pyodide-CDN allow-list, or run it in a sandboxed opaque-origin iframe. Not changed because it needs real-browser verification of package loading.
- Pseudocode runner has a 10,000-step cap (OK); Python timeout 8 s with worker termination (OK); SQL sandbox not reviewed.
- **Not performed:** Firestore/Storage rules emulator run (`npm run test:rules`), `npm audit`/dependency CVE review, CDN exposure review, tenant-isolation tests, hidden-answer/teacher-pack leakage review, cross-account localStorage review, AI-credit abuse on other endpoints, live-site checks.
- Public CDN lesson assets remain fetchable by URL (documented in the gate); gate is a release control, not authorisation.
