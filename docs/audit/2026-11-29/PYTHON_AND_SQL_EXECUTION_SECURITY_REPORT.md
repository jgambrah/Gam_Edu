# Python, SQL and pseudocode execution security (audit checkpoint 2)

Evidence tags: **EXECUTED** (run in a real browser or test runner), **READ** (code review only), **NOT EXAMINED**.

## 1. Python (D-010) — reclassified **High**, fixed, verified in Chromium

### Method
A synthetic, isolated harness (`scripts/audit/python-sandbox-harness/`) with a fake "victim" origin (HttpOnly session cookie, IndexedDB record shaped like the Firebase auth store, Cache Storage entry, authenticated JSON endpoint) and an "attacker" server that logs every request that reaches it. The **real** `python-runner.ts` was bundled with esbuild and run in the in-app Chromium browser. No real data, accounts or school services were involved.

### What learner Python could do before (EXECUTED, pre-audit code)
| Capability | Result |
|---|---|
| `js.fetch` to a same-origin authenticated endpoint | **Succeeded; the HttpOnly session cookie was attached** |
| `js.fetch(..., mode:'no-cors')` to another origin | **Succeeded; the attacker server received the request** |
| Open IndexedDB and read the Firebase-auth-shaped record | **Succeeded (full read of the refresh-token record)** |
| Cache Storage list | Succeeded |
| WebSocket, synchronous XHR, nested `Worker`, `importScripts` | Available |
| `localStorage` / `sessionStorage` | Not defined in workers |
| Dynamic `import()` of a cross-origin URL | A request was sent (script refused only because of a MIME/CORS type error) |

Impact: any Python a pupil or staff member runs — typed, pasted from a classmate or website, or loaded from a shared link — could read that user's Firebase refresh token from IndexedDB and call authenticated same-origin endpoints. For a teacher or administrator this is an account-takeover path to school data. That is why this is **High** (potentially Critical for staff accounts), not the "author-trusted, defence-in-depth" Medium recorded at checkpoint 1.

### Fix (EXECUTED after)
`python-runner.ts` now runs Pyodide in a **sandboxed iframe** (`sandbox="allow-scripts"`, never `allow-same-origin`; opaque origin) whose document carries a **CSP** (`default-src 'none'`; `connect-src` only `https://cdn.jsdelivr.net/pyodide/`; `worker-src blob:`; `script-src` only the Pyodide path + the inline bootstrap + eval/wasm that Pyodide needs). The worker inherits the CSP and **refuses to start unless `self.origin === 'null'`** (fail closed). The page talks to the frame only through `postMessage`, accepting messages solely from that frame's `contentWindow`, with type/size validation and base64-only image output. A runaway program is stopped by destroying the iframe. Code (100 k chars), stdin (50 k), validation (20 k) and output (200 k chars inside the sandbox) are bounded. If the browser cannot provide a sandboxed iframe plus workers, **Python is disabled with an explicit message** rather than run unsafely.

| Probe after the fix (EXECUTED, same harness) | Result |
|---|---|
| Same-origin authenticated fetch | `TypeError: Failed to fetch` (CSP) |
| Cross-origin fetch | Blocked; **zero new requests reached the attacker server** |
| IndexedDB | `SecurityError` (opaque origin) |
| Cache Storage | Not available |
| Synchronous XHR | `NetworkError` |
| WebSocket | Closed immediately; nothing reached the attacker |
| `Worker`/`importScripts` | Present, but confined by the same CSP |

### Functional regression and resource tests in the sandbox (EXECUTED, 16 of 17 expected behaviours confirmed; the 17th was a wrong expectation in my own test)
print, `input()` with supplied stdin, strict-input EOF, validation expressions, NameError with line number, variable isolation between runs, **matplotlib PNG**, **pygame stub**, infinite-loop stop followed by a working restart, output flood capped, memory bomb (`bytearray(3e9)`) recovers and the next run works, oversize code refused, hostile `js.fetch`/IndexedDB attempts blocked.

### A pre-existing bug found by those tests (D-020)
`strictInput` mode **always failed** with `SyntaxError: unterminated string literal` because the CR/LF escape in the Python `input()` shim was written with the wrong number of backslashes. It affects Python Academy, `InlineCodePlayground` and the missions that set `strictInput`. Reproduced on the pre-audit code in the browser, fixed, re-verified, and pinned by a unit test.

### Remaining limits (honest)
- Verified in **Chromium only**; Safari and Firefox behaviour (sandbox/CSP/worker-in-sandbox, opaque-origin `self.origin`) is **NOT EXAMINED** (D-035). The fail-closed checks mean an unsupported browser should disable Python, not run it unsafely, but that must be confirmed.
- Memory/CPU exhaustion is bounded by the 8 s timeout and the browser, not by a hard per-iframe memory quota.
- CSP allows the Pyodide CDN path; a compromised CDN is out of scope (pin/self-host Pyodide is a possible follow-up; `OWNER_DECISION` on hosting cost).
- Code that is **sent to the server** is not part of this system (no server-side execution exists).

## 2. SQL practice engine — EXECUTED
`executeIgcseSql` is a hand-written interpreter over fixed in-memory tables (no real database, no `eval`). 28 adversarial tests: refuses `DROP/DELETE/INSERT/UPDATE/CREATE/ALTER/TRUNCATE/ATTACH/PRAGMA/VACUUM/WITH`; stacked statements and comment/quote smuggling never run a second statement; unknown tables (`sqlite_master`, `information_schema`) error; results are copies, so changing a returned result never alters later queries (no cross-activity state); 5,000-column lists, 5,000-deep parentheses, 3,000 `AND` terms and million-character strings finish in under 2 s without throwing; the documented example query returns the documented answer.

## 3. Cambridge pseudocode runner — EXECUTED (one defect fixed)
`DIV`/`MOD` (operator and function forms) match the syllabus for positive integers; division by zero is a clean error; arrays are 1-based by declaration and bounds-checked (1-D and 2-D); recursion works; infinite `WHILE`/`REPEAT`/recursion stop with a clear error in bounded time (10,000-step cap); string doubling fails cleanly (`Invalid string length`); file handling is virtual (real paths are never read); hostile and malformed source never throws out of the runner. **Defect D-021:** `ARRAY[1:2000000000]` (and large 2-D bounds) froze the main thread for 10–15 s; now rejected up front (cap 100,000 cells).
Not examined: Cambridge conventions for negative-number `DIV`/`MOD` (the syllabus defines positive integers only), user-defined types, `CASE`, `RECORD`.
