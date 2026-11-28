# Engine capability & readiness matrix (as found at `a3706446`, plus audit corrections)

Legend — *Verified*: executed independent evidence this session · *Existing tests*: pre-existing suite passes, not independently re-derived · *Not examined*.

| Engine (engine ver / production ver) | Submodes (source) | Maths/logic | UI | Assessment | Security | Perf | A11y | Prod status |
|---|---|---|---|---|---|---|---|---|
| code-playground (1.0.0 / 1.0.0) | Python (Pyodide worker), Cambridge pseudocode, SQL (read-only) | pseudocode tests pass (6); 10,000-step cap | not browser-tested | not examined | **D-010 open** (same-origin worker); timeouts/terminate present | not measured | not tested | production 1.0.0 |
| construction-lab (**1.6.0 / 1.3.0**) | boolean-circuit, equation-balancer, electrical-circuit, bio-sequence, atom-bond, geometry-constructor (+5E), measurement-lab, data-stats-lab | geometry cube-nets **Verified**; stats **Verified**; others Existing tests | **data-stats renderer defects D-004–D-007 fixed**; others not visually inspected | stats/mode **D-008 fixed**; measurement validity gating read, looks sound | sanitiser n/a | lazy adapters by design; not measured | not tested | production 1.3.0 — measurement 1.4.0, stats 1.5.0, geometry-5E 1.6.0 **not production-activated** (D-013) |
| rule-explorer (1.0.0 / 1.0.0) | declarative rules | Existing tests | not examined | not examined | n/a | not measured | not tested | production |
| graph-slider (1.0.0 / 1.0.0) | functions, sliders, piecewise, step | Existing tests (13) | not examined | not examined | n/a | not measured | not tested | production |
| process-stepper (1.0.0 / 1.0.0) | staged mechanisms | Existing tests (11) | not examined | not examined | SVG via sanitiser **Verified** | not measured | not tested | production |
| diagram-hotspots (1.0.0 / 1.0.0) | explore / identify | Existing tests (8) | not examined | answer-leak in aria labels: measurement-lab test covers one case only | sanitiser **Verified** | not measured | not tested | production |
| math-evaluator (1.1.0 / 1.1.0) | numeric, algebraic, equation, inequality, calculus, multi-step working | **Verified** (oracle + 37 adversarial) | not examined | marking oracle passes | bounded op-budget | not measured | not tested | production 1.1.0 |
| sort-classify (1.0.0 / **null**) | sort, classify, match, cloze, sequence | Existing tests (11) | not examined | not examined | n/a | not measured | not tested | **not production-activated** |

Planned, **not implemented**: Step 5F primary manipulatives, 5G physics workbench, 5H visual programming studio (legacy `BlocklyEditor.tsx` only), Step 6 formal verification. Pilot fixtures: 12 `*-pilot-preview` routes under `src/app/narrated-lessons/`; one lesson JSON (water cycle) plus a pronunciation test-clips JSON remain in the repository (CDN-first policy deviation is limited to these two).

Schema-vs-UI-vs-assessment discrepancies found: the data-stats **chart renderer** disagreed with its own maths model (fixed). No other schema/UI mismatch was *looked for* exhaustively.
