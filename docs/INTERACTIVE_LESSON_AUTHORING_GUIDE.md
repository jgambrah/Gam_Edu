# GAM EDU — Interactive Lesson JSON Authoring Guide (`slide.interactive` v1)

This guide is the authoritative reference for human curriculum authors and AI content agents generating interactive activities inside GAM EDU Narrated Lessons. Following this specification allows lessons to be validated and published via `scripts/lessons/publish-lesson.ts` with **zero application code changes**.

---

## 1. Where `slide.interactive` Lives

Inside any slide object in `lesson.slides[]`, add the optional `interactive` field as either:
- A single `SlideInteractiveConfig` JSON object, OR
- An array of up to **4** `SlideInteractiveConfig` JSON objects (`SlideInteractiveConfig[]`).

Slides without `interactive` continue working identically as standard narrated slides.

---

## 2. Supported & Reserved Engine Identifiers

| Engine ID | Status | Installed Version | Supported `schemaVersion` | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| `rule-explorer` | **Implemented (Publishable)** | `1.0.0` | `1` | Cross-subject condition/rule toggling (CS, Chemistry, Biology, Physics, Geography, Civics) |
| `code-playground` | **Implemented (Publishable)** | `1.0.0` | `1` | Live sandboxed Python 3 (Pyodide), Cambridge Pseudocode, and Read-Only SQL (`SELECT`) |
| `construction-lab` | **Implemented (Publishable)** | `1.0.0` | `1` | Interactive Boolean Logic Circuit Builder (`labKind: "boolean-circuit"`) |
| `graph-slider` | **Step 4A Preview (`productionVersion: null`)** | `1.0.0` | `1` | Cross-subject dynamic graph, sliders, piecewise & step waveforms, readouts & discovery challenges *(blocked from production CDN publish until Step 4A is deployed to production)* |
| `process-stepper` | **Reserved (Step 4B — Blocked at Publish)** | `0.0.0-planned` | `1` | *Not yet implemented.* Rejected by `publish-lesson.ts` |
| `diagram-hotspots` | **Reserved (Step 4C — Blocked at Publish)** | `0.0.0-planned` | `1` | *Not yet implemented.* Rejected by `publish-lesson.ts` |

> **Important:** Do **not** author production lessons using reserved Step 4 engines (`graph-slider`, `process-stepper`, `diagram-hotspots`). The publishing validator (`assertValidLessonInteractives`) explicitly rejects unimplemented engines.

---

## 3. Base Schema Fields (All Engines)

Strict field allowlisting is enforced — **unknown keys are rejected**.

| Field | Type | Required | Rules |
| :--- | :--- | :---: | :--- |
| `id` | `string` | **Yes** | `^[A-Za-z0-9_-]{2,64}$`. Must be **globally unique** across all slides in the lesson (including multiple activities on the same slide). |
| `engine` | `string` | **Yes** | Must be an implemented engine ID (`rule-explorer`, `code-playground`, `construction-lab`). |
| `schemaVersion` | `number` | **Yes** | Must be `1`. |
| `minEngineVersion` | `string` | No | SemVer `MAJOR.MINOR.PATCH` (e.g. `"1.0.0"`). Rejected if higher than the installed engine version. |
| `title` | `string` | **Yes** | At least 2 non-whitespace characters. Short student-facing heading. |
| `instructions` | `string` | **Yes** | At least 4 non-whitespace characters. Clear action prompt for the learner. |
| `accessibilityLabel` | `string` | **Yes** | At least 4 non-whitespace characters. Screen-reader landmark label (`aria-label`). |
| `fallbackText` | `string` | **Yes** | At least 4 non-whitespace characters. Educational text summary shown in Low-Data Mode or graceful fallback. |
| `hints` | `string[]` | No | Up to **6** non-empty progressive hint strings. |
| `persistCompletion` | `boolean` | No | **Reserved for future use.** Currently ignored at runtime (zero Firestore reads/writes). |

---

## 4. Engine-Specific Configuration Requirements

### A. `rule-explorer` (Cross-Subject Declarative Condition Explorer)

Extra allowed top-level fields: `subjectTag`, `inputs`, `rule`, `output`.

- `subjectTag` *(optional string)*: Short curriculum badge (e.g. `"Computer Science"`, `"Chemistry"`, `"Biology"`).
- `inputs` *(required array, 1–8 items)*: Each item allows only:
  - `id` *(required string, `^[A-Za-z0-9_-]{1,40}$`, unique within activity)*
  - `label` *(required non-empty string)*
  - `defaultValue` *(optional boolean, default `false`)*
  - `trueText` *(optional string, default `"YES"`)*
  - `falseText` *(optional string, default `"NO"`)*
- `rule` *(required Declarative AST)*:
  - Leaf node: `{ "input": "<inputId>" }` (must reference a declared `inputs[].id`)
  - Operator node: `{ "operator": "AND" | "OR" | "NOT" | "XOR", "operands": [ ... ] }`
  - **Arity rules**: `NOT` requires **exactly 1** operand; `AND`, `OR`, `XOR` require **2 to 8** operands.
  - **Complexity limits**: Maximum nesting depth **6**, maximum **32** AST nodes.
- `output` *(required object)*: Allows only:
  - `trueLabel` *(required string)*
  - `falseLabel` *(required string)*
  - `explanationTrue` *(required string)*
  - `explanationFalse` *(required string)*
  - `showBinaryValues` *(optional boolean — set `true` for CS binary `1`/`0` badges, `false` for general Science/Humanities)*

### B. `code-playground` (Python 3, Cambridge Pseudocode, Read-Only SQL)

Extra allowed top-level fields: `languages`, `pythonStarter`, `pseudocodeStarter`, `sqlStarter`, `publicTests`.

- `languages` *(required non-empty array)*: Subset of `["python", "pseudocode", "sql"]`. First item is the default active tab.
- `pythonStarter` *(optional string)*: Starter Python 3 code (executed in isolated Pyodide Web Worker).
- `pseudocodeStarter` *(optional string)*: Starter Cambridge IGCSE Pseudocode (executed in browser AST runner).
- `sqlStarter` *(optional string)*: Starter **read-only `SELECT`** SQL query. DDL/DML keywords (`DROP`, `DELETE`, `INSERT`, `UPDATE`, `ALTER`, `TRUNCATE`, `CREATE`, `ATTACH`, `DETACH`) are rejected.
- `publicTests` *(optional array, max 8 items)*: Each item allows only `{ "stdin": string, "expectedStdout": string }`.

### C. `construction-lab` (Boolean Circuit Builder)

Extra allowed top-level fields: `labKind`, `activityId`.

- `labKind` *(required string)*: Currently must be `"boolean-circuit"`.
- `activityId` *(optional string)*: Optional preset reference identifier.

### D. `graph-slider` (Step 4A Preview — Cross-Subject Graph & Slider Discovery Engine)

> **Production Gate Notice:** On the Step 4A feature branch, `graph-slider` has `implemented: true, engineVersion: "1.0.0", productionVersion: null`. Do **not** publish live CDN lessons using `graph-slider` until Step 4A is merged and verified in production.

Extra allowed top-level fields: `subjectTag`, `modelNote`, `xVar`, `axes`, `sliders`, `curves`, `readouts`, `prediction`, `challenges`, `samples`, `showDataTable`.

- `axes` *(required)*: `{ xLabel, xUnit?, xMin, xMax, yLabel, yUnit?, yMin, yMax }` (`xMax > xMin`, `yMax > yMin`).
- `sliders` *(optional, 0–4 items)*: `{ id, label, min, max, step, defaultValue, unit?, presets? }` (`step > 0`, `min <= defaultValue <= max`, `presets` within `[min, max]`).
- `curves` *(required, 1–4 items; max 8 total curves per slide)*:
  - `kind`: `"formula"` (default), `"piecewise"` (2–24 `{ x, y }` points), or `"step"` (2–24 `{ x, y }` discrete step-line points).
  - `color`: strict 6-digit hex (`#RRGGBB`); `style`: `"solid" | "dashed" | "dotted"`; `isReference?: boolean`; `domainMin?`, `domainMax?`; `stopAtYZero?: boolean` (for projectile landing root bisection — never stops at initial launch point).
- `readouts` *(optional, 0–4 items)*: `{ id, label, expr, unit?, precision? (0..4) }`.
- `prediction` *(optional Predict-before-Experiment prompt)*: `{ prompt, options (2..4), correctIndex, explanation }`.
- `challenges` *(optional, 0–3 items)*: `{ id, prompt, check: { operator: "AND" | "OR", conditions (1..4) }, successText, hintText? }`. Each condition targets one `sliderId` or `readoutId` with `min`/`max` or `target` + `tolerance`.
- **Safe Mathematical Expression Grammar** (`src/lib/narrated-lessons/math-expr.ts`, zero `eval()`):
  - **Precedence (lowest → highest):** `+`/`-` (left) → `*`/`/` (left) → unary `+`/`-` (binds looser than `^`, so `-2^2 = -4`, `(-2)^2 = 4`) → `^` (right-associative, `2^3^2 = 512`, `2^-3 = 0.125`) → primary.
  - **Constants:** `PI`, `E`.
  - **Unary functions (arity = 1):** `abs`, `sin`, `cos`, `tan`, `sqrt`, `ln`, `log10`, `exp`, `deg2rad`, `rad2deg`, `floor`, `ceil`, `round`. (Trig uses radians internally; use `deg2rad(theta)` for degrees.)
  - **Multi-arg functions (arity = 2..4):** `min`, `max`.
  - **Limits:** Max AST depth **8**, max **48** AST nodes, max **200** sample points per curve, max `24,576` bytes per activity.
  - **Mathematical Status Distinction (`evaluateMathAstDetailed`):**
    - `undefined`: mathematically undefined operations (`1/0`, `ln(0)`, `log10(0)`, `tan(PI/2)`, `0^-1`) → displays `"Undefined"`.
    - `outside-real-domain`: operations outside the supported real numbers (`sqrt(-4)`, `ln(-2)`, `(-2)^0.5`) → displays `"Outside real domain"`.
    - `exceeds-numeric-limit`: mathematically valid results exceeding `±1e12` or `|exponent| > 100` (e.g. `10^50`) → displays `"Exceeds numeric limit"` (never mislabelled as mathematically undefined).
  - **Deferred in v1.0:** Parametric plotting `(x(t), y(t))` and continuous animation loops (e.g., Solar System orbital animation) are intentionally deferred.

---

## 5. Resource Limits

| Limit | Maximum |
| :--- | :---: |
| Serialized JSON size per activity | **24,576 bytes (24 KB)** |
| Interactive activities per slide | **4** |
| `rule-explorer` inputs | **8** |
| `rule-explorer` AST nesting depth | **6** |
| `rule-explorer` total AST nodes | **32** |
| `hints` per activity | **6** |
| `publicTests` per `code-playground` | **8** |

---

## 6. Security, Accessibility & Low-Data Requirements

1. **Zero Teacher Secrets in Public JSON**: Keys such as `teacherReference`, `teacherPseudocode`, `gradingTests`, `solutionSql`, `teacherSolutions`, `hiddenTests`, `answerKey`, `modelSolution`, and `rubricAnswers` are recursively blocked at publish and runtime. Public student guidance (`hints`, `publicTests`, `explanationTrue`, `explanationFalse`) is allowed.
2. **Educational Code vs. Application Code**: Legitimate CS text or sandboxed starter code may mention programming concepts (e.g. explaining why `eval()` is dangerous) safely because all text is rendered via React text nodes (never `dangerouslySetInnerHTML`) and starter code runs inside isolated sandboxes. Executable URL protocols (`javascript:`, `vbscript:`, `data:text/html`) are always blocked.
3. **Accessibility**: Always provide meaningful `accessibilityLabel` and `instructions`. Never rely on color alone — provide clear `trueText`/`falseText` and `trueLabel`/`falseLabel`.
4. **Low-Data Mode**: Every activity **must** provide a pedagogically useful `fallbackText` so learners on 2G/3G networks in Low-Data Mode receive the full conceptual takeaway without downloading heavy lab chunks (with an opt-in button to load the engine manually).

---

## 7. State, Reset & Progress Behaviour

- **Ephemeral Local State**: `rule-explorer` holds toggle state in local React state (resettable via the Reset button; **0 Firestore reads/writes**).
- **Slide Navigation**: Navigating away from a slide unmounts its interactive widget; returning restores the configured `defaultValue` state cleanly.
- **Shared-Computer Draft Isolation (`code-playground`)**:
  - For authenticated users, drafts are stored in `localStorage` scoped strictly by school and user: `gam:inline-code:v2:${schoolId}:${userId}:${lessonId}:${activityId}:${mode}` (students sharing a school computer never see another student's drafts; 0 Firestore writes).
  - For unauthenticated/public preview sessions, drafts are stored in tab-scoped `sessionStorage` (`gam:inline-code:v2:session:...`) and cleared automatically when the tab closes.
- **Multiple Activities per Slide**: Each item in `slide.interactive[]` mounts with its own `id` key and completely isolated state.
- **`persistCompletion` Status**: **Reserved (not yet implemented).** Existing lesson step/checkpoint/mastery progress restoration (`localStorage` + `resolveRestoredStepIndex`) continues working unchanged.

---

## 8. Built-in Read-Only SQL Fixture (`Stock` Table)

The inline SQL runner executes read-only `SELECT` queries against GAM EDU's built-in `Stock` table (`src/lib/sql-practice/igcse-sql-engine.ts`):

| ItemID | ItemName | Colour | Quantity | Price | Ordered |
| :--- | :--- | :--- | :-: | :-: | :-: |
| `A01` | Pen | Blue | 12 | 2.5 | 0 |
| `A02` | Ruler | Red | 5 | 4.0 | 1 |
| `A03` | Book | Blue | 20 | 8.0 | 0 |
| `A04` | Bag | Red | 5 | 35.0 | 0 |
| `A05` | Pencil | Green | 0 | 1.5 | 1 |

**Expected result** for `SELECT ItemName, Price FROM Stock WHERE Quantity < 6 ORDER BY Price DESC;`:

| ItemName | Price |
| :--- | :-: |
| Bag | 35 |
| Ruler | 4 |
| Pencil | 1.5 |

---

## 9. Production Engine Compatibility & Rollback Policy

- **Production-First Rule**: Never publish a live CDN lesson requiring an engine or `minEngineVersion` that has not yet been deployed and verified in production. `SUPPORTED_INTERACTIVE_ENGINES[id].productionVersion` tracks the highest version verified in production (`null` for dev-branch-only or Step 4 reserved engines), and `assertValidLessonInteractives` rejects any lesson whose engine or `minEngineVersion` exceeds `productionVersion`.
- **Rollback Implications**: Once live CDN lessons depend on `slide.interactive`, reverting the web app to a revision prior to `InteractiveEngineRegistry` (or prior to a newly published engine) would prevent those interactive widgets from mounting. Always keep `InteractiveEngineRegistry` forward-compatible (additive schema changes only) and rely on each activity's mandatory `fallbackText` for graceful degradation if an older client ever encounters a newer engine.

---

## 10. Valid & Invalid Configuration Examples

See machine-readable valid examples for every implemented engine in [interactive-lesson-examples.json](file:///c:/Users/LENOVO/OneDrive%20-%20Kwame%20Nkrumah%20Uni.%20of%20Sci.%20and%20Tech/Documents/GitHub/Gam_Edu/docs/examples/interactive-lesson-examples.json).

### Common Invalid Authoring Mistakes (Rejected by `publish-lesson.ts`)

| Mistake | Why Rejected |
| :--- | :--- |
| `"engine": "graph-slider"` in a production lesson | Reserved Step 4 engine — not yet implemented |
| `"schemaVersion": 2` | Only `schemaVersion: 1` is supported |
| `"minEngineVersion": "2.0.0"` | Exceeds installed engine version `1.0.0` |
| Unknown field like `"customCss": "..."` or `"onClick": "..."` | Strict schema allowlist rejects unknown keys |
| `{ "operator": "AND", "operands": [{ "input": "a" }] }` | `AND`/`OR`/`XOR` require 2–8 operands (`NOT` requires exactly 1) |
| `{ "input": "missingId" }` | References an input ID not declared in `inputs[]` |
| Duplicate `"id"` on two activities (same slide or different slides) | Activity IDs must be unique per lesson |
| `"sqlStarter": "DROP TABLE Stock;"` | Inline SQL is strictly read-only `SELECT` |
| Including `"answerKey"` or `"hiddenTests"` | Protected teacher-only fields are prohibited in public CDN JSON |
