# Python sandbox browser harness (audit D-010)

Synthetic, isolated test bed. It contains NO real data: a fake HttpOnly session cookie, a fake IndexedDB
"Firebase auth" record, a fake Cache entry, an "attacker" server that logs any request that reaches it.

1. Bundle the runner under test (run from the repo root; rebuild after every change):
   `node node_modules/esbuild/bin/esbuild src/lib/python-runner.ts --bundle --format=iife --global-name=PR --outfile=scripts/audit/python-sandbox-harness/python-runner.sandbox.bundle.js`
   (To reproduce the BEFORE state, bundle the pre-audit file from git history as `python-runner.bundle.js`.)
2. `node scripts/audit/python-sandbox-harness/server.js` (ports 4173 victim, 4174 attacker, 4175 attacker log)
3. Open `http://localhost:4173/sandbox.html` (capability probes) and `functional.html` (functional + resource tests),
   click the button, read the results. `current.html` runs the same probes against the pre-audit bundle.

Evidence recorded 2026-11-29 (Chrome, Pyodide 0.25.1):
- BEFORE (same-origin Blob worker): authenticated same-origin API call with the session cookie succeeded; cross-origin
  request reached the attacker server; the IndexedDB auth store was fully readable; Cache Storage listable; WebSocket,
  sync XHR, nested Worker, importScripts all available.
- AFTER (opaque-origin sandboxed iframe + CSP): same-origin and cross-origin fetch blocked; IndexedDB SecurityError;
  Cache Storage unavailable; sync XHR blocked; WebSocket closed immediately; zero new requests reached the attacker server.
- Functional/resource: print, input (legacy and strict), validation, NameError line numbers, variable isolation,
  matplotlib PNG, pygame stub, infinite-loop stop + restart, output flood cap, memory-bomb recovery, oversize refusal: all pass.
