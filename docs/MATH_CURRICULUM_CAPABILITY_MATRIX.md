# GAM EDU — Mathematical Curriculum Capability Matrix & Deferred Linear-Systems Assessment (Step 5A.3)

> **Scope Honesty Notice:** This matrix maps GAM EDU's verified Step 5A.1 (`math-evaluator` `1.0.0`) and Step 5A.2 (`math-evaluator` `1.1.0`) capabilities against NaCCA and Cambridge Mathematics & STEM syllabuses. Passing finite automated oracle tests (10,000 unique cases) provides strong regression assurance within certified classes, **not** a claim of universal mathematical completeness.

---

## 1. Capability Legend
- **Full (Bounded):** Fully supported and certified within Step 5A.1/5A.2 exact/symbolic resource bounds.
- **Partial:** Supported for common school sub-classes; complex edge cases return `indeterminate-unverified` or require manual review.
- **Other Engine:** Supported cleanly through another existing GAM EDU interactive engine (`graph-slider`, `construction-lab`, `diagram-hotspots`, `process-stepper`, `code-playground`).
- **Manual / Teacher:** Requires human/teacher grading (open-ended proofs, essay justifications, sketch interpretation).
- **Deferred:** Explicitly planned for a future bounded step (not claimed today).
- **Unsupported:** Out of scope for client-side bounded evaluation (heavyweight CAS / general theorem proving).

---

## 2. Curriculum Capability Matrix

| Curriculum / Domain | Key Topics | Status | Engine / Notes |
| :--- | :--- | :--- | :--- |
| **NaCCA Primary Mathematics (B1–B6)** | Whole-number arithmetic, order of operations, fractions (equivalent/reduced), decimals, percentages, ratios, money/discounts | **Full (Bounded)** | `math-evaluator` (`numeric-quantity`, `multi-step-working` with `primary` keypad) |
| **NaCCA Primary Mathematics (B1–B6)** | Place-value blocks, fraction bars, number lines, regrouping manipulatives | **Deferred (Step 5F)** | Planned for `construction-lab: number-manipulative` |
| **NaCCA JHS Mathematics (B7–B9)** | Integers, powers/indices, algebraic expansion & collection, factorisation, linear equations, linear inequalities & sign reversal, simple financial maths | **Full (Bounded)** | `math-evaluator` (`1.0.0` + `1.1.0` `lower-secondary` keypad) |
| **NaCCA JHS Mathematics (B7–B9)** | Geometric constructions, transformations, coordinate plotting | **Other Engine** | `construction-lab: geometry-constructor` (`1.3.0` LIVE) |
| **NaCCA SHS Core & Elective Maths** | Surds, quadratic equations (factorisation, completing the square, quadratic formula), rational expressions & domains, logarithms (with explicit domain), univariate differentiation & integration (`+ C`) | **Full (Bounded)** | `math-evaluator` (`igcse` / `as-a-level` keypads) |
| **NaCCA SHS Core & Elective Maths** | 2×2 / 3×3 simultaneous linear equations, matrices, vectors, probability/statistics distributions | **Deferred** | Linear systems deferred (see Section 3); Probability/Stats planned for Step 5D |
| **Cambridge Primary & Lower Secondary (0096 / 0862)** | Number operations, fractions/percentages, algebraic expressions, linear equations/inequalities, unit conversions, formula substitution | **Full (Bounded)** | `math-evaluator` (`primary` / `lower-secondary`) + `graph-slider` for linear graphs |
| **Cambridge IGCSE Mathematics (0580)** | Exact fractions/surds, sig-figs & decimal rounding, expansion/factorisation, quadratics, rational & single-radical equations, compound inequalities & intervals, algebraic fractions + excluded values, differentiation of polynomials | **Full (Bounded)** | `math-evaluator` (`igcse` keypad, M/A/B/ECF formative marking) |
| **Cambridge IGCSE Mathematics (0580)** | Simultaneous linear/non-linear equations, circle theorems, loci/constructions, kinematics graphs, histograms/boxplots | **Partial / Other Engine / Deferred** | Circle theorems & constructions → `geometry-constructor`; Graphs → `graph-slider`; Simultaneous equations → **Deferred**; Stats → Step 5D |
| **Cambridge IGCSE Additional Maths (0606)** | Surds/indices/logs (explicit domain), polynomials (up to degree 6), quadratic inequalities (interval union), differentiation & antiderivatives (`ln|x| + C`, trig in radians) | **Partial** | Univariate certified classes supported; arbitrary trig identities & non-linear systems return `indeterminate-unverified` |
| **Cambridge AS & A Level Maths (9709)** | Pure 1/2/3: algebraic manipulation, quadratics, rational/radical equations, logarithmic laws under explicit domain, symbolic differentiation & standard antiderivatives (`+ C`, `ln|x|`) | **Partial** | Supported within Step 5A.1/5A.2 bounds; integration by parts/substitution chains outside basic forms, differential equations, complex numbers, vectors, and formal proofs are **Unsupported / Manual** |
| **Physics (IGCSE 0625 / NaCCA)** | Formula substitution, exact 7-component SI unit conversions (`m/s` ↔ `km/h`, `°C` ↔ `K` absolute/difference, `N`, `J`, `W`, `Pa`), sig-figs, scientific notation | **Full (Bounded)** | `math-evaluator` (`numeric-quantity`, `formula-unit`) + `graph-slider` + `electrical-circuit` |
| **Chemistry (IGCSE 0620 / NaCCA)** | Molarity (`mol/dm^3` ↔ `mol/m^3`), stoichiometry calculations, percentage yield | **Full (Bounded) + Other Engine** | `math-evaluator` for numeric/unit calculations; `equation-balancer` & `atom-bond-builder` LIVE |
| **Economics / Accounting / Business** | Gross profit margin vs mark-up, percentage change, discounts, elasticity calculations, compound financial formulas | **Full (Bounded)** | `math-evaluator` (`numeric-quantity` with `%`, `multi-step-working`) |

---

## 3. Deferred Simultaneous Linear Equations — Bounded Design Recommendation (Section 14)

**Current Status:** Explicitly **DEFERRED** (not implemented or claimed in Step 5A.3).

**Feasibility Assessment:** A lightweight exact-rational 2×2 and 3×3 linear-system verifier can be added safely in a future minor extension (`math-evaluator` `1.2.0`) with **zero CAS dependencies**:
- **Exact `BigRat` Gaussian Elimination / RREF:** Parse each equation into exact linear form $a_i x + b_i y (+ c_i z) = d_i$ using existing `astToRationalPoly` (`polyDegree <= 1`).
- **Exact Classification of All 3 Cases:**
  1. **Unique solution** ($\det(A) \neq 0$): exact rational tuple $(x^*, y^*)$ or $(x^*, y^*, z^*)$.
  2. **No solution** (inconsistent row $[0 \dots 0 \mid k], k \neq 0$): `empty-set`.
  3. **Infinitely many solutions** (consistent rank-deficient system): `dependent-infinite`.
- **Multi-Step Support (Substitution & Elimination):** Verify that each derived equation is an exact linear combination of the current system (preserving the solution set) and verify substitution steps against the original system, consuming the shared cumulative `EvalOpBudget`.
- **Recommendation:** Retain as explicitly deferred during Step 5A.3 closure so Step 5A.3 stays focused on reliability certification of existing `1.0.0`/`1.1.0` capabilities; schedule as an optional Step 5A.4 micro-extension if prioritised by curriculum authors.
