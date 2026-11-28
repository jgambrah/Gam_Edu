# Agent Coordination Protocol

Permanent division of responsibilities for GAM EDU Student Enrichment (established by the owner, 2026-11-29).

| Party | Role | Owns |
|---|---|---|
| **Gemini** | Primary Developer | New engines, educational capabilities, curriculum lessons, the approved development roadmap (`docs/GEMINI_DEVELOPMENT_ROADMAP.md`) |
| **Claude** | Independent Auditor and Corrective Engineer | Critical review of Gemini's work, independent verification, fixes for confirmed defects, security hardening, regression testing, verified pushes to `fixed-version` (`docs/CLAUDE_AUDIT_ROADMAP.md`) |
| **ChatGPT** | Technical Coordinator | Reviews both agents' outputs, maintains the two roadmaps, issues subsequent instructions |
| **Owner** | Final authority | Manual Vercel promotion, official student release, expenditure, major architectural decisions |

## 1. Separate tracks, shared branch
- Gemini's track and Claude's track keep **separate progress records** (`GEMINI_DEVELOPMENT_PROGRESS.md`, `CLAUDE_AUDIT_PROGRESS.md`). Neither agent edits the other's progress file.
- Both integrate into `fixed-version`. Always `git fetch` and reconcile before pushing; never force-push, never rewrite pushed history, never discard another agent's or the owner's uncommitted changes.
- Claude does **not** start Gemini's development stages (5F, 5G, 5H, Step 6) and Gemini does **not** weaken or bypass an audit fix without a `JOINT_REVIEW`.
- Claude may correct confirmed defects inside Gemini-built engines (`CLAUDE_FIX`). Anything that is a new capability is handed to Gemini (`GEMINI_BUILD`).

## 2. Finding classification (every defect/recommendation carries exactly one)
| Class | Meaning | Who acts |
|---|---|---|
| `CLAUDE_FIX` | Confirmed defect in existing code | Claude fixes, tests, pushes |
| `GEMINI_BUILD` | New capability or extension | Gemini builds (needs spec + acceptance tests) |
| `JOINT_REVIEW` | Major architectural decision | Gemini + Claude + ChatGPT agree before work |
| `OWNER_DECISION` | Needs owner approval (spend, release, production, risky upgrade) | Owner decides |
| `VERIFICATION_REQUIRED` | Existing capability needs further evidence | Claude (or owner for live checks) |

The single source of truth is `docs/CONSOLIDATED_DEFECT_REGISTER.csv` (id, stage, component, severity, class, status, evidence, resolution). Earlier per-checkpoint registers under `docs/audit/` are preserved and never deleted.

## 3. Handoff rules
1. **Gemini → Claude:** when a stage lands, record commit SHA, engine/schema versions, new tests and known limitations in `GEMINI_DEVELOPMENT_PROGRESS.md`. Claude audits the next checkpoint from that SHA.
2. **Claude → Gemini:** `GEMINI_BUILD` items get a one-paragraph spec, acceptance criteria and the independent oracle/fixture to satisfy, recorded in the roadmap.
3. **Shared files:** engine registry, schemas, validators, `AGENTS.md`, the Standard. Edit minimally; describe the reason in the commit message.
4. **No silent behaviour changes:** a fix that changes learner-visible behaviour (for example mode of constant data, pictogram symbols) is listed in the progress file so Gemini's fixtures and docs stay consistent.

## 4. Permanent engineering gates (apply to both agents)
- **Learner code is untrusted.** Python must run only in the isolated sandbox (`src/lib/python-runner.ts`: sandboxed opaque-origin iframe, restrictive CSP, validated messages). No execution of learner code in the app origin, ever.
- **Server authorisation, not client gates.** AI/credit-spending endpoints verify the Firebase token, school membership and role, apply the release restriction on the server, bound request size, and use a shared (Firestore) cap; the client route gate is a UX control.
- **Independent verification.** Mathematical/scientific behaviour is verified against oracles or hand fixtures that do not call the code under test. A rendered chart/instrument must be tested against its own model.
- **CI must stay green on `fixed-version`:** `.github/workflows/foundation-verification.yml` (lockfile sync, enrichment + security tests, math oracle with failing exit code, TypeScript ratchet, Firestore/Storage emulator rules tests).
- **Core school management is protected:** no enrichment imports into finance, accounts, attendance, payroll, admin, students, staff, boarding, transport or the dashboard layout (`architecture-boundaries.test.ts`).
- **CDN-first content; no lesson-specific components; no paid media generation without approval.**

## 5. Production policy (unchanged)
- Vercel promotion is **manual** and belongs to the owner. A push to `fixed-version` is not a deployment.
- `productionVersion` in `SUPPORTED_INTERACTIVE_ENGINES` is raised only after the owner promotes a build and the capability is verified live on `https://gam-it-service.app`.
- Student Enrichment stays **Under Construction and restricted** until the owner sets `NEXT_PUBLIC_STUDENT_ENRICHMENT_RELEASED=true` in a new build. Agents never change that variable.

## 6. Checkpoint report format (every audit checkpoint ends with these seven sections)
1. Gemini development status and next assignment
2. Claude audit status and next assignment
3. Defects corrected by Claude
4. Development requirements transferred to Gemini
5. Outstanding verification
6. Git integration status
7. Production deployment and activation status
