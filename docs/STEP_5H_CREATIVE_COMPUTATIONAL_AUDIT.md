# GAM EDU — Step 5H: Existing Creative & Computational Learning Features Audit & Permanent Planning Reference

> **Status:** Accepted Planning Reference (**96/100** review score). **Do NOT commence Step 5H implementation yet** — continue the approved foundation sequence (`5A → 5B → 5C → 5D → 5E → 5F → 5G → 5H → 6`).  
> **Inclusion:** Mandatory reference in `AGENTS.md`, `docs/STUDENT_ENRICHMENT_STANDARD.md`, and all subsequent Authoring Kits.

---

## 1. Audited Existing Creative & Computational Assets (Preserve & Reuse)

Direct read-only codebase inspection confirmed substantial working educational investments that **MUST be preserved** and not needlessly rebuilt or replaced:

| Existing Feature / Route | Actual Current Implementation | Preservation Mandate |
| :--- | :--- | :--- |
| **Game Zone (`/dashboard/game-zone`)** | Cyber Logic Arcade: AI/offline trivia, `BinaryCodeBreaker`, `BooleanGates`, Kahoot Hub links, and existing XP / achievement integration | **Preserve** as an educational challenge & computational-thinking destination; reuse XP/achievements; surface selected JSON-driven visual programming challenges without duplicating execution engines; do **not** build multiplayer merely because an orphaned lobby component exists |
| **Logic Lab (`/dashboard/coding-club/logic-lab`)** | 43 built-in missions using click-to-append Python token chips running free client-side via Pyodide Web Worker (`src/lib/python-runner.ts`) | **Preserve** all 43 built-in missions |
| **Python Academy (`/dashboard/coding-club/python-academy`)** | 73 lesson & mission entries running Monaco + Pyodide Web Worker | **Preserve** all 73 entries |
| **SQL Lab (`/dashboard/coding-club/sql-lab`)** | Read-only SQL practice (`src/lib/sql-practice/igcse-sql-engine.ts`) | **Preserve** |
| **Scratch / TurboWarp Links (`/dashboard/coding-club`)** | External TurboWarp iframe (`13a80b48`) replacing deleted `ScratchEngine.tsx` (`b0c6ad95`, `39a85349`, `5fdef7ad`) | **Preserve** existing links alongside future built-in visual studio |
| **Art Studio (`src/app/dashboard/nursery-bloom/page.tsx`, lines 4901–5316)** | Embedded inside the 522 KB Nursery Bloom monolith; currently has unscaled click coordinates and a stubbed "Save Masterpiece" button | **Preserve**; do **not** undertake a full Nursery Bloom monolith refactor; apply bounded reusable canvas & truthful export/save improvements in Step 5H |
| **Story Spark, Think Tank & Code Playground** | Illustrated story reader, critical thinking hub, and `InlineCodePlayground` (`code-playground` `1.0.0` LIVE — Python 3, Cambridge 0478 Pseudocode, Read-Only SQL) | **Preserve** all existing capabilities |
| **Orphaned `src/components/BlocklyEditor.tsx`** | Zero imports anywhere in app; executes generated JS via unsafe `new Function()` | **NEVER revive as-is** (security risk recorded in Section 6) |

---

## 2. Approved Future Architecture: Visual Programming Studio (Step 5H)

1. **Strict Separation of Editor and Execution Engine:**
   - Separate the visual block editor UI from the deterministic execution engine.
   - During Step 5H design, formally evaluate **Blockly** (measuring actual compressed JS transfer, not estimates) versus a **lightweight custom structured block editor**.
   - **NEVER** revive abandoned `BlocklyEditor.tsx` or `ScratchEngine.tsx` as-is.
   - **NEVER** execute generated JavaScript through `eval()` or `new Function()`.
2. **Bounded Deterministic TypeScript AST Interpreter:**
   - Programs are represented as strictly schema-validated **JSON AST structures**.
   - Supports coloured structured blocks, accessible keyboard + touch construction and reordering, variables, expressions, conditions, loops, bounded execution limits (step/loop caps), step-by-step tracing, **Play / Pause / Step / Stop / Reset**, and deterministic educational grading.
   - Generates **read-only Python and Cambridge 0478 Pseudocode** equivalents strictly where semantically accurate (do **not** claim arbitrary Python-to-block conversion).
3. **Engine Family Placement:**
   - **Prefer extending `code-playground`** (zero unnecessary engine-family sprawl). If a separate top-level engine family is demonstrably necessary, provide explicit architectural justification before implementation.

---

## 3. Prioritised Stage Capabilities

| Priority | Stage | Required Capabilities |
| :---: | :--- | :--- |
| **1 (Mandatory)** | **A. Grid Navigator** | Character movement, direction & turning, walls & obstacles, collectibles, goals, sensor predicates, maze & algorithm challenges |
| **2 (Mandatory)** | **B. Turtle Graphics** | Pen up/down & movement, angles, colours, geometric shapes, symmetry, repeating patterns, mathematical art |
| **3 (Feasibility Assessment)** | **C. Bounded Single-Character Animation** | Simple movement, appearance changes, dialogue, and safe reuse of Art Studio assets where feasible — **NO** unrestricted concurrency, complex physics, or full Scratch clone |

---

## 4. Bounded Art Studio & Game Zone Integration

- **Art Studio (Bounded Improvement — No Monolith Refactor):**
  - Correct canvas coordinate scaling (`getBoundingClientRect` → internal canvas resolution).
  - **Truthful save confirmation:** Never claim artwork has been saved unless the save operation actually succeeded.
  - Real local image export (including transparent PNG export where appropriate), basic Undo/Redo, artwork preservation across appropriate navigation, reusable character/background assets, and safe integration with the Visual Programming Studio.
  - Any persistent student asset storage must be explicitly **school-scoped** with strict access controls and resource limits.
- **Game Zone Integration:**
  - Surface selected JSON-driven visual programming challenges inside Game Zone reusing existing XP/achievement flows without duplicating execution engines. No multiplayer work.

---

## 5. Educational Progression & Curriculum Verification

- **Progression Pathway:** `Visual Programming Studio → Logic Lab → Python Academy → Advanced Programming & Computer Science`.
- **Curriculum Grounding:** Verify actual **Ghana NaCCA** (Basic 1–6, CCP Basic 7–9, SHS Computing) and **Cambridge** (`0059` Primary, `0860` Lower Secondary, `0478` IGCSE, `9618` AS & A Level) objectives during Step 5H design. Do **not** claim `> 90%` coverage without a verified indicator-level or syllabus-level matrix.

---

## 6. Outstanding Security, Functional & Technical Debt Register

> **Security Escalation Rule:** Confirmed high-severity security risks MUST be investigated promptly — never defer an active exploitable vulnerability solely because it relates to a later stage.

| # | Item | Category | Risk / Action |
| :---: | :--- | :--- | :--- |
| 1 | Unsafe `new Function()` execution in orphaned `src/components/BlocklyEditor.tsx` | Security | Orphaned (0 imports); never revive; schedule clean removal or explicit quarantine |
| 2 | Hardcoded administrator identifiers in legacy modules | Security | Audit & replace with role/claims-based checks where still present (Under-Construction gate already cleaned) |
| 3 | Legacy unscoped project storage | Security / Multi-tenancy | Ensure all student project/asset persistence is strictly `schoolId`-scoped with Firestore rule enforcement |
| 4 | Python Worker isolation & network-access verification | Security | Verify `python-runner.ts` Pyodide Web Worker isolation and confirm no unintended network/credential exfiltration |
| 5 | Art Studio false "Save Masterpiece" confirmation | Functional | Fix so save status is truthful and performs real export or verified scoped persistence |
| 6 | Art Studio canvas coordinate scaling defect | Functional | Scale pointer coordinates from CSS display box to internal canvas dimensions |
| 7 | Orphaned Game Zone lobby component | Technical Debt | Do not implement multiplayer; audit for clean removal or isolation |
| 8 | Unused `blockly` and `p5` package dependencies (if present in `package.json`) | Bundle / Supply Chain | Audit and prune unused packages if confirmed unreferenced |
| 9 | Existing paid AI credit consumption in Game Zone / Nursery Bloom | Operating Cost | Ensure Step 5H visual execution, grading, and animation use **zero paid AI** and **zero per-step/per-run Firestore writes** |
| 10 | Third-party Scratch / TurboWarp external link dependency | Availability | Retain as optional external links; built-in Step 5H studio provides offline/low-data resilience |

---

## 7. Performance, Cost & Roadmap Discipline

- Independently lazy-load all Step 5H modules; measure **actual compressed JS transfers** (not estimates).
- Zero paid AI calls and zero per-step/per-run Firestore writes during visual program execution, deterministic grading, or animation.
- **Do NOT start Step 5H now.** Complete Steps `5A → 5B → 5C → 5D → 5E → 5F → 5G` first, followed by `5H` and `Step 6` (Comprehensive Foundation Verification).
