# Scientific / geometric / statistical accuracy verification

| Area | Status | Evidence |
|---|---|---|
| Cube nets (35 hexominoes, 11 fold) | **Independently verified** | `src/lib/construction-lab/cube-net-independent.test.ts`: polyomino enumeration → 35 free hexominoes; rolling-die oracle → 11 foldable / 24 not; engine agrees on 1,120 orientation/translation/start-cell variants; textbook families (six 1-4-1, 3-3 + three 2-3-1, one 2-2-2) confirmed; malformed input rejected |
| Descriptive statistics (mean/median/mode/variance/SD/quartiles/outliers) | **Hand-verified** | `data-stats-independent.test.ts` (16 tests). Defect D-008 found and fixed (constant set had "no mode") |
| Regression / Pearson r | **Hand-verified** | (1,2)(2,4)(3,5)(4,4)(5,5): m=0.6, c=2.2, r=6/√60; perfect −1; zero-variance → null; interpolation vs extrapolation flagged |
| Pie / histogram models | **Hand-verified** | 14/32×360=157.5°; frequency density 0.5/1/0.4 and bar area = frequency |
| Chart *rendering* (dot plot, pictogram, polygon, axes, pie angles) | **Rendering-tested** | `data-stats-rendering-audit.test.tsx` (6 tests). 5 of 6 **fail on the old component** (proves tests can fail) and pass now. Not visually inspected in a browser |
| Seeded PRNG | Verified | same seed → same sequence; different seeds differ; 60,000 die rolls within tolerance |
| Quartile convention | Documented gap | Tukey inclusive/exclusive + linear (n−1)p offered; (n+1)/4 positional not (D-011) |
| Atomic structure, bonding, VSEPR, electron configs (Cr/Cu), ions | **Not independently re-verified** | existing `atom-bond-lab.test.tsx` passes (8 tests); independent oracle not written |
| Equation balancing, charge conservation, electrolysis | Not independently re-verified | existing tests only |
| DNA/RNA, codons, Punnett, mitosis/meiosis, enzymes | Not independently re-verified | existing tests only |
| DC circuits (series/parallel/Ohm/meter placement) | Not independently re-verified | existing tests only |
| Measuring instruments (9) | **Partially read** | Model code read: signed zero-error wrap-around for vernier/micrometer, over-range blocking, alignment-off-zero blocking, tare gating, repeated-trial gating, mass-vs-weight unit check, °C/K offset handling all present. Rendered graduations, meniscus and parallax geometry **not** inspected visually; mercury virtual-demo labelling not checked |
| Physics Workbench (5G), manipulatives (5F), visual programming (5H) | **Not implemented** | no physics-workbench / manipulative engine in the repo; only a legacy `BlocklyEditor.tsx` component exists |

Simplified school-level models should be labelled as such in lessons; this audit did not review lesson text.
