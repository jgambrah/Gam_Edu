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

## 5. Approval, Under-Construction Gate & Release Discipline

- **Owner's Revised Accelerated Development Policy (Student Enrichment Only)**: Because participating schools have been notified that Student Enrichment is **Under Construction**, the owner has authorised accelerated implementation, automated verification, controlled integration into `fixed-version`, and curriculum lesson development using available capabilities — without requiring repeated individual preview acceptance cycles for every approved foundation step. Official release to ordinary students remains strictly subject to the owner's explicit approval.
- **Under-Construction Access Gate (`src/lib/student-enrichment-release.ts`)**: All 19 Student Enrichment route trees (`/dashboard/narrated-lessons/*`, `/dashboard/coding-club/*`, `/dashboard/cambridge-lessons/*`, `/dashboard/nursery-bloom/*`, `/dashboard/senior-academy/*`, `/dashboard/senior_academy/*`, `/dashboard/class-stories/*`, `/dashboard/study-club/*`, `/dashboard/maths-club*/*`, `/dashboard/science-club*/*`, `/dashboard/ela-club/*`, `/dashboard/game-zone/*`, `/dashboard/think-tank/*`, `/narrated-lessons/*`, `/story-spark-preview/*`, `/topical-labs/*`) enforce a fail-closed under-construction access gate reusing `useRole()` + `useUser()` (zero extra Firestore reads/writes; zero hardcoded owner identifiers in client release policy). Trusted school-staff roles (`Director`, `Administrator`, `Teacher`) may access and review; ordinary students (`Student`, `Parent`, unauthenticated) see an Under Construction notice until the owner enables `NEXT_PUBLIC_STUDENT_ENRICHMENT_RELEASED=true` (note: changing `NEXT_PUBLIC_*` requires a **new build and deployment**).
- **Manual Vercel Production Promotion Policy (Mandatory)**: Production releases on `https://gam-it-service.app` are promoted **manually** in Vercel. A successful Git push to `origin/fixed-version` or a "Ready" preview build does **not** establish that a revision is live in production. Always provide the exact commit SHA and verify live behaviour on `https://gam-it-service.app` after explicit manual promotion.
- Do not delete legacy lesson files or modify unrelated core school-management modules.
- Do not generate paid media (TTS/image generation) without separate explicit approval.
- Run the canonical 23-suite regression baseline (19 student-enrichment + 4 core school-management suites) plus any new feature suites before every release.

## 6. Permanent Interactive Foundation Roadmap (Approved Sequence)

1. **Steps 1–4F (LIVE on `https://gam-it-service.app`):** Security hardening, selective lazy loading, `InteractiveEngineRegistry`, `code-playground` (`1.0.0`), `rule-explorer` (`1.0.0`), `graph-slider` (`1.0.0`), `process-stepper` (`1.0.0`), `diagram-hotspots` (`1.0.0`), and `construction-lab` (`1.3.0`: `boolean-circuit`, `equation-balancer`, `electrical-circuit`, `bio-sequence-builder`, `atom-bond-builder`, `geometry-constructor`).
2. **Step 5A.1 — Mathematical Answer Evaluator (`math-evaluator` `1.0.0`):** *Production LIVE on `https://gam-it-service.app` (`productionVersion: '1.1.0'`).* Five discriminated modes (`numeric-quantity`, `algebraic-expression`, `equation-solution`, `inequality-interval`, `calculus-check`), exact `BigRat`/polynomial/surd/symbolic equivalence, unified 1D real domain certification, strict verification policies (`exact-only`, `exact-or-symbolic`, `allow-bounded-numeric`), exact SI units & precision, and calculus domain restriction UI.
3. **Step 5A.2 & Step 5A.3 — Mathematical Working Workspace (`math-evaluator` `1.1.0`, `mode: 'multi-step-working'`) & 10,000-Case SymPy Oracle Verification:** *Production LIVE on `https://gam-it-service.app` (`productionVersion: '1.1.0'`).* Extends `math-evaluator` (zero duplicate engine family); age-appropriate touch/keyboard keypads, 8-status bounded step verifier, declarative M/A/B/ECF marking engine, Guided/Independent/Exam-Practice modes, and 10,000-case independent Python/SymPy oracle verification with structural uniqueness accounting and strict marking-sum invariants (0 false accepts, 0 false rejects, 0 unexpected indeterminates, 0 marking mismatches). Simultaneous linear equations remain explicitly deferred.
4. **Step 5B — Sorting and Classification (`sort-classify` `1.0.0`):** *Integrated into `fixed-version` (`productionVersion: null` pending manual Vercel production promotion & live verification).* Eighth top-level interactive engine family with four cross-subject modes (`category-bins` with overlapping set membership & explicit empty-set decisions, `pair-matching` with enforced 1:1 cardinality or many-to-many, `cloze-tiles` with bipartite feasibility checking for non-reusable tokens, and `order-sequence` with closest-order diagnostics & deterministic tie-breaking), approved optional visual assets, accessible drag-and-drop + keyboard UI, and 15-slide / 19-activity pilot.
5. **Step 5C — Virtual Measuring Instruments (`construction-lab: measurement-lab` `1.4.0`):** *Integrated into `fixed-version` (`construction-lab` `engineVersion: '1.4.0'`, `productionVersion` held at `'1.3.0'` pending manual Vercel production promotion & live verification).* Nine bounded instrument models (ruler, vernier callipers, micrometer screw gauge, measuring cylinder with concave/convex meniscus & parallax, thermometer, laboratory balance with tare & mass-vs-weight distinction, stopwatch with resolution vs reaction-time uncertainty, analogue ammeter & voltmeter with selectable ranges) plus digital display mode, reusing `math-eval-units-precision.ts` for SI units, significant figures, and decimal places; 15-slide NaCCA & Cambridge pilot; isolated preview route `/narrated-lessons/measurement-lab-pilot-preview` failing closed in production.
6. **Step 5D — Probability and Statistics (`construction-lab: data-stats-lab`):** *Planned.*
7. **Step 5E — Remaining Geometry Capabilities (`geometry-constructor` extensions):** *Planned.*
8. **Step 5F — Primary Number Manipulatives (`construction-lab: number-manipulative`):** *Planned.*
9. **Step 5G — Bounded Physics Workbench (`construction-lab: physics-workbench`):** *Planned.*
10. **Step 5H — Visual Programming & Computational Thinking Studio (including bounded Art Studio & Game Zone integration):** *Planned — accepted planning reference saved at [`docs/STEP_5H_CREATIVE_COMPUTATIONAL_AUDIT.md`](STEP_5H_CREATIVE_COMPUTATIONAL_AUDIT.md). Do NOT commence until Steps 5A–5G are complete (investigate any confirmed high-severity security items in its register promptly).*
11. **Step 6 — Comprehensive Foundation Verification & Final Sign-Off:** *Planned.*
12. **Curriculum Content Development & Official Student Release:** Real NaCCA and Cambridge curriculum lessons may be developed alongside foundation work using production-compatible engines; official release to ordinary students awaits the owner's explicit approval.
