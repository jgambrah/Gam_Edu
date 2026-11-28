# Gemini Development Roadmap (Primary Developer track)

Permanent roadmap: **5A → 5B → 5C → 5D → 5E → 5F → 5G → 5H → Step 6.** Maintained by ChatGPT; built by Gemini; independently audited by Claude (see `AGENT_COORDINATION_PROTOCOL.md`). Claude does not start any open stage below.

| Stage | Scope | Status (as of last audited commit `a3706446`, audit checkpoints through `01ed818a`+) |
|---|---|---|
| Steps 1–4F | SVG security, lazy loading, registry, graph/process/diagram engines, construction lab extensions, atom-bond, geometry constructor | Implemented; audited in part (see Claude progress) |
| 5A | Mathematical evaluator, working workspace, 10,000-case oracle | Implemented; `math-evaluator` 1.1.0 production version 1.1.0 |
| 5B | Sorting and classification | Implemented; `sort-classify` 1.0.0, **production version not activated** |
| 5C | Virtual measuring instruments | Implemented (`measurement-lab` 1.4.0), not production-activated |
| 5D | Probability and statistics | Implemented (`data-stats-lab` 1.5.0); renderer defects corrected by audit |
| 5E | Remaining geometry | Implemented (`geometry-constructor` 1.6.0), not production-activated |
| **5E close-out** | Learner-facing completeness of the geometry capabilities (see queue) | **OPEN — next assignment** |
| **5F** | Primary Number Manipulatives | **PLANNED — next after 5E close-out** |
| 5G | Physics Workbench | PLANNED |
| 5H | Visual Programming Studio, Art Studio, Game Zone integration (see `STEP_5H_CREATIVE_COMPUTATIONAL_AUDIT.md`) | PLANNED — blocked until the Python sandbox rule is honoured (it is, as of audit commit `9d89dc70`) |
| 6 | Final foundation integration and verification | PLANNED |

## Active assignment queue (from audit; class `GEMINI_BUILD` unless stated)
1. **Step 5E close-out.** For each advertised capability confirm there is a usable learner interface, not only a verification function: RHS construction, virtual-protractor interaction, reflected triangle solutions, similarity investigations, complete locus construction, feasible regions, finite-segment loci, circle-theorem visualisation, cube-net exploration. Where an interface is missing, add it or mark the capability *partial* in the schema description and the authoring guide. Acceptance: a Vitest UI test per capability that performs the learner action and asserts the assessed outcome, plus a screenshot in the audit browser pass.
2. **Bounded exact linear simultaneous equations (2×2, optionally 3×3)** as a new `equation-solution` class in `math-evaluator`. Feasible with the existing exact rational type (Gaussian elimination, unique / none / infinitely many solutions). Acceptance: oracle families added to `scripts/math-oracle` with independently derived answers; no general symbolic solver.
3. **(n+1)/4 positional quartile convention** for raw-data statistics, **only after** the applicable syllabus (Cambridge IGCSE 0580 / 0626, NaCCA) is consulted and recorded in the curriculum matrix. Acceptance: hand fixtures in `data-stats-independent.test.ts`.
4. **Step 5F — Primary Number Manipulatives** (counting, ten frames, number bonds, base-ten blocks, number lines, arrays, fractions, Ghanaian money in integer pesewas, analogue clocks). Prerequisites: large-touch-target and non-drag interaction pattern agreed in the Standard; independent models (exact rationals, integer pesewas) with hand fixtures; hour hand moves with minute hand.
5. **5G / 5H / 6** as in the table. Each stage must ship with: independent oracle or hand fixtures, UI tests that assess outcomes, Low-Data `fallbackText`, accessibility labels that do not leak answers, and an entry in `GEMINI_DEVELOPMENT_PROGRESS.md`.

## Rules for every Gemini stage
- No lesson-specific components; reuse the registry; CDN-first lessons.
- Do not raise `productionVersion` until the owner has promoted and the capability is verified live.
- Do not weaken audit fixes (Python sandbox, Ask Teacher guard, pictogram/dot-plot fidelity, mode convention) without `JOINT_REVIEW`.
- Run `npx vitest run` and the CI gates before pushing; report the commit SHA in the progress file.
