# Mathematical reliability verification

## 1. Oracle reproduction (executed)
`npx tsx scripts/math-oracle/run-independent-oracle.ts` (seed 20260503) → 10,000 cases in ~1.3 s:
correctAccept 5,217 · correctReject 4,383 · correctIndeterminate 400 · **falseAccept 0 · falseReject 0 · unexpectedIndeterminate 0 · markingMismatch 0 · duplicateMarks 0 · exceededMaxMarks 0**.
Matches the committed `step5a3-oracle-report.json` (topics: arithmetic, algebra, rational/domains, equations, inequalities, surds/indices/logs, calculus, units/precision, multi-step marking, adversarial limits).

**Caveats**
- "10,000 unique" are unique by *case id*; the report itself shows **9,248 structurally distinct** (752 structural duplicates) — quote 9,248.
- Cases are template-generated; expected outcomes come from BigInt exact arithmetic / known-by-construction truth, not from the evaluator (good), but the families are finite.
- The oracle is a script, not part of `vitest run`/CI; a regression would not fail the normal suite (D-012).
- The script rewrites `step5a3-oracle-report.json` on each run; the audit restored the committed file.

## 2. Independent adversarial suite (new, executed): `src/lib/math-evaluator/math-adversarial.test.ts` — 37 cases, all pass
Expected outcomes were derived by hand from mathematics before running. Classes: exact decimal arithmetic (0.1+0.2=0.3), non-terminating
fractions vs truncated decimals, required forms, sig-fig/d.p. rules; **x/x vs 1** (domain exclusion required), **(x²−9)/(x−3)→x+3** (correct/missing/wrong excluded value), x² vs x (agree at 0,1), sqrt(x²)≠x, ln(x²)≠2ln x, **sin(πx)≢0** (zero at every integer),
extraneous root of √(x+2)=x, lost root x=0 in x²=x, missing ±2, **inequality reversal** (−2x>6), strict vs inclusive endpoints, derivative errors, **missing +C**, wrong antiderivative, **ln|x|** requirement.
Result: every accept case verdict ∈ {exact-equivalent, symbolic-domain-equivalent}; every reject case `passed:false`. No false accept or reject found.
A further test asserts a bounded-numeric verdict is never presented as exact proof.

## 3. Not verified (explicit)
Trigonometric identity proof (only bounded evidence/indeterminate), full simultaneous-equation support, error-carried-forward marking beyond oracle families,
partial-mark independence beyond the oracle's marking checks, resource-limit behaviour beyond the 500 adversarial oracle cases, exhaustive property-based fuzzing.
The evaluator makes **no universal-correctness claim** and this audit does not either.
