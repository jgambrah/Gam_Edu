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
| `graph-slider` | **Reserved (Step 4 — Blocked at Publish)** | `0.0.0-planned` | `1` | *Not yet implemented.* Rejected by `publish-lesson.ts` |
| `process-stepper` | **Reserved (Step 4 — Blocked at Publish)** | `0.0.0-planned` | `1` | *Not yet implemented.* Rejected by `publish-lesson.ts` |
| `diagram-hotspots` | **Reserved (Step 4 — Blocked at Publish)** | `0.0.0-planned` | `1` | *Not yet implemented.* Rejected by `publish-lesson.ts` |

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
- **Slide Navigation**: Navigating away from a slide unmounts its interactive widget; returning restores the configured `defaultValue` state cleanly. `code-playground` drafts are stored locally in `localStorage` scoped by `lessonId:activityId:language`.
- **Multiple Activities per Slide**: Each item in `slide.interactive[]` mounts with its own `id` key and completely isolated state.
- **`persistCompletion` Status**: **Reserved (not yet implemented).** Existing lesson step/checkpoint/mastery progress restoration (`localStorage` + `resolveRestoredStepIndex`) continues working unchanged.

---

## 8. Valid & Invalid Configuration Examples

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
