# GAM EDU — Student Enrichment Architecture & Maintenance Standard

> **Permanent Architectural Standard** — Mandatory for all developers and AI coding agents (Antigravity, Gemini, Claude, Codex, Cursor) working on GAM EDU.

## 1. Core Context & Modular-Monolith Boundary

GAM EDU is fundamentally a **comprehensive school management system** (administration, finance, billing, attendance, HR, academics, reporting). Narrated lessons, interactive laboratories, stories, and study clubs form an integrated **Student Enrichment & Independent Learning** subsystem inside the same modular monolith.

- **One integrated application**: Do not introduce microservices, separate repositories, or a separate CMS without explicit architectural approval.
- **Strict one-way dependency boundary**:
  - Core school management routes (`finance`, `financials`, `accounts`, `attendance`, `admin`, `students`, `staff`, `payroll`, `boarding`, `transport`, `dashboard/layout.tsx`) **MUST NOT** import student-enrichment engines (`narrated-lessons`, `boolean-logic`, `sql-practice`, `pseudocode-runner`, `python-runner`).
  - Enforced automatically by `src/lib/narrated-lessons/architecture-boundaries.test.ts`.

## 2. Core Scaling Principle

> **The educational content library can grow almost indefinitely (1,000+ lessons), but the application codebase should grow only when genuinely new reusable capabilities are required.**

- **CDN-First Content**: All lesson JSONs, images (WebP), and narration audio (MP3) live in Firebase Cloud Storage (`story-spark-preview/narrated-lessons/`) with content-hashed immutable caching (`max-age=31536000, immutable`). Adding or updating a lesson using supported engines **MUST NOT** require a Git push or Vercel deployment.
- **No Lesson-Specific React Components**: Do **NOT** create new per-lesson React components or add hardcoded `if (lesson.lessonId === '...')` branches in `NarratedLessonPlayer.tsx` without explicit architectural approval.
- **Reuse Existing Interactive Engines**: Reuse existing Python (`python-runner.ts`), Pseudocode (`pseudocode-runner.ts`), SQL (`igcse-sql-engine.ts`), Boolean Circuit Lab & Construction Lab domain adapters (`ConstructionLabRouter.tsx` — `boolean-circuit` legacy 1.0.0 LIVE; `equation-balancer`, `electrical-circuit`, `bio-sequence-builder`, and declarative `boolean-circuit` 1.1.0 LIVE; `atom-bond-builder` 1.2.0 LIVE), Rule Explorer (`RuleExplorerEngine.tsx`), Graph & Slider Engine (`GraphSliderEngine.tsx`), Process & Mechanism Engine (`ProcessStepperEngine.tsx`), and Diagram & Hotspots Engine (`DiagramHotspotsEngine.tsx`) through `InteractiveEngineRegistry.tsx`. Do not build competing editors or monolithic universal simulators.
- **Lazy Loading Heavy Modules**: Heavy interactive labs, language runtimes, and reviewer-only tools (`PointerCueEditor`) must be lazy-loaded so unrelated school management routes and non-CS lessons do not download them.

## 3. Security & Privacy Standards

- **SVG Sanitisation (Mandatory)**: All inline SVG content from CDN lesson JSONs must pass strict allowlist sanitisation (`src/lib/narrated-lessons/svg-sanitizer.ts`) at **both** publish time (`publish-lesson.ts`) and render time (`NarratedLessonPlayer.tsx`).
  - Forbidden: `<script>`, `<foreignObject>`, `<iframe>`, `<object>`, `<embed>`, `<animate>`, `<set>`, all `on*` event attributes, `javascript:` / `vbscript:` / `data:` URIs, and external `http(s)://` references in `href`/`xlink:href`.
  - Allowed: Safe geometric, text, gradient, marker, clipPath, filter, and internal `#id` references required for accurate educational diagrams.
- **No Arbitrary Executable Code in Lesson JSON**: Never execute CDN JSON fields with `eval()` or `new Function()`. Use declarative rule trees and restricted expression parsers only.
- **Teacher Solutions Isolation**: Never include `teacherReference`, `teacherPseudocode`, `gradingTests`, or `solutionSql` in public CDN lesson packages or client JS bundles.
- **Zero-Write Interactive State**: Ordinary slider, toggle, circuit, pseudocode, and SQL exploration runs locally in browser state (0 Firestore reads/writes). Only meaningful progress/assessments are persisted.

## 4. Schema Evolution, Progress Preservation & Rollback

- **Stable IDs**: Never renumber or rename existing `lessonId`, `slide.id`, `checkpoint.id`, or `item.id` values on published lessons.
- **Progress Preservation**: `NarratedLessonPlayer` persists stable `currentStepId` alongside `stepIdx` (see `src/lib/narrated-lessons/progress-migration.ts`). Never silently reset returning students' progress or mark newly inserted slides as completed.
- **Publish-Time Gates (`scripts/lessons/publish-lesson.ts`)**: Every publish must validate schema/IDs, pronunciation coverage (`assertPronunciationCoverage`), SVG safety (`assertSafeSvg`), absence of protected teacher keys, and automatically back up the prior `catalogue.json` generation for instant rollback.
- **Preserve Approved Pedagogy**: Architectural refactoring must preserve approved educational quality, narration, illustrations, transitions, mobile readability, and accessibility.

## 5. Approval & Release Discipline

- **Manual Vercel Production Promotion Policy (Mandatory)**: Production releases on `https://gam-it-service.app` are promoted **manually** in Vercel. A successful Git push to `origin/fixed-version` or a "Ready" preview build does **not** establish that a revision is live in production. Never raise `SUPPORTED_INTERACTIVE_ENGINES[id].productionVersion` or publish CDN lessons depending on new engine capabilities until the corresponding web-app revision has been manually promoted and independently verified live on `https://gam-it-service.app`.
- Do not delete legacy lesson files during unrelated security or performance changes.
- Do not generate paid media (TTS/image generation) or deploy/push to production without explicit approval.
- Run automated Vitest regression tests (security, dependency boundaries, interactive engines, progress migration) before every release.

## 6. Permanent Interactive Foundation Roadmap (Approved Sequence)

1. **Steps 1–4F (LIVE on `https://gam-it-service.app`):** Security hardening, selective lazy loading, `InteractiveEngineRegistry`, `code-playground` (`1.0.0`), `rule-explorer` (`1.0.0`), `graph-slider` (`1.0.0`), `process-stepper` (`1.0.0`), `diagram-hotspots` (`1.0.0`), and `construction-lab` (`1.3.0`: `boolean-circuit`, `equation-balancer`, `electrical-circuit`, `bio-sequence-builder`, `atom-bond-builder`, `geometry-constructor`).
2. **Step 5A.1 — Mathematical Answer Evaluator (`math-evaluator` `1.0.0`):** *Current Preview Stage (`productionVersion: null` until accepted & promoted).* Five discriminated modes (`numeric-quantity`, `algebraic-expression`, `equation-solution`, `inequality-interval`, `calculus-check`), exact `BigRat`/polynomial/surd/symbolic equivalence, unified 1D real domain certification, strict verification policies (`exact-only`, `exact-or-symbolic`, `allow-bounded-numeric`), exact SI units & precision.
3. **Step 5A.2 — Mathematical Working and Reasoning Workspace *(Planned — Not Yet Implemented)*:** Extends `math-evaluator` (no redundant 8th engine family); student-friendly touch/keyboard mathematical keypad (Primary, JHS, SHS, IGCSE, AS/A Level layouts; no LaTeX required), step-by-step transformation verification (distinguishing equality, equivalence, implication, extraneous/eliminated solutions, and indeterminate steps), optional marking schemes (M/A/B marks, partial credit, ECF, no duplicate marks), Guided/Independent/Exam practice modes (formative client-side practice only; no gradebook writes), worked solution comparison; future handwriting/OCR recorded as deferred (no paid AI/OCR).
4. **Step 5A.3 — Comprehensive Mathematical Reliability Verification *(Planned — Not Yet Implemented)*:** Large-scale reproducible oracle verification across supported classes, domain/undefined cases, alternative methods, false-acceptance/false-rejection analysis, indeterminate handling, accessibility, and real browser performance measurements (explicit supported/unsupported/deferred boundary disclosures).
5. **Step 5B — Sorting and Classification (`sort-classify` `1.0.0`):** *Planned.*
6. **Step 5C — Virtual Measuring Instruments (`construction-lab: measurement-lab`):** *Planned.*
7. **Step 5D — Probability and Statistics (`construction-lab: data-stats-lab`):** *Planned.*
8. **Step 5E — Remaining Geometry Capabilities (`geometry-constructor` extensions):** *Planned.*
9. **Step 5F — Primary Number Manipulatives (`construction-lab: number-manipulative`):** *Planned.*
10. **Step 5G — Bounded Physics Workbench (`construction-lab: physics-workbench`):** *Planned.*
11. **Step 6 — Comprehensive Foundation Verification & Final Sign-Off:** *Planned.*
