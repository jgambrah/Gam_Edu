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
- **Reuse Existing Interactive Engines**: Reuse existing Python (`python-runner.ts`), Pseudocode (`pseudocode-runner.ts`), SQL (`igcse-sql-engine.ts`), Boolean Circuit Lab (`BooleanCircuitLab.tsx`), Rule Explorer (`RuleExplorerEngine.tsx`), and Graph & Slider Engine (`GraphSliderEngine.tsx`, Step 4A preview — `productionVersion: null` until production approval) through `InteractiveEngineRegistry.tsx`. Do not build competing editors or simulators.
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

- Do not delete legacy lesson files during unrelated security or performance changes.
- Do not generate paid media (TTS/image generation) or deploy/push to production without explicit approval.
- Run automated Vitest regression tests (security, dependency boundaries, interactive engines, progress migration) before every release.
