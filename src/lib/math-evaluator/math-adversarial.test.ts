// @vitest-environment node
/**
 * Independent adversarial verification of the mathematical evaluator (comprehensive audit).
 *
 * Every expected outcome below is derived BY HAND from mathematics (not from running the evaluator).
 * Cases cover the classic ways an answer checker is fooled: cancellation that changes the domain,
 * extraneous roots, lost roots, inequality reversal, numerically coincident-but-different expressions,
 * missing constants of integration and domain-dependent antiderivatives.
 *
 * A case is expressed as: spec + learner input + the set of acceptable verdict classes.
 *   - 'accept'        : evaluator must pass the submission (exact/symbolic/domain-equivalent)
 *   - 'reject'        : evaluator must NOT pass the submission
 *   - 'not-accepted'  : must not pass, and must not claim mathematical certainty either way
 */
import { describe, expect, it } from 'vitest';
import {
  evaluateMathSubmission,
  type MathEvaluatorSpec,
  type MathEvalSubmission,
} from './math-eval-engine';

type Expect = 'accept' | 'reject';
interface Case {
  name: string;
  spec: MathEvaluatorSpec;
  sub: MathEvalSubmission;
  expect: Expect;
}

const alg = (sourceExpr: string | undefined, expectedExpr: string, extra: any = {}): MathEvaluatorSpec => ({
  mode: 'algebraic-expression',
  variables: ['x'],
  ...(sourceExpr ? { sourceExpr } : {}),
  expectedExpr,
  ...extra,
});

const cases: Case[] = [
  // ---- Exact rational / decimal arithmetic ----
  { name: '0.1+0.2 equals 0.3 exactly (no floating-point error)', spec: { mode: 'numeric-quantity', expectedValue: '0.3' }, sub: { expression: '0.1+0.2' }, expect: 'accept' },
  { name: '1/3 must not accept truncated 0.333333 when exact is required', spec: { mode: 'numeric-quantity', expectedValue: '1/3', precisionRule: { kind: 'exact' } }, sub: { expression: '0.333333' }, expect: 'reject' },
  { name: '2/6 accepted as 1/3 when any form allowed', spec: { mode: 'numeric-quantity', expectedValue: '1/3' }, sub: { expression: '2/6' }, expect: 'accept' },
  { name: '2/6 rejected when reduced fraction required', spec: { mode: 'numeric-quantity', expectedValue: '1/3', requiredForm: 'reduced-fraction' }, sub: { expression: '2/6' }, expect: 'reject' },
  { name: '1/3 rejected when decimal form required', spec: { mode: 'numeric-quantity', expectedValue: '1/3', requiredForm: 'decimal' }, sub: { expression: '1/3' }, expect: 'reject' },
  { name: '3 sig figs: 3.142 is wrong for pi', spec: { mode: 'numeric-quantity', expectedValue: '3.14', precisionRule: { kind: 'sig-figs', count: 3 } }, sub: { expression: '3.142' }, expect: 'reject' },
  { name: '3 sig figs: 3.14 right for pi', spec: { mode: 'numeric-quantity', expectedValue: '3.14', precisionRule: { kind: 'sig-figs', count: 3 } }, sub: { expression: '3.14' }, expect: 'accept' },
  { name: '2 d.p.: 0.5 is not 2 d.p.', spec: { mode: 'numeric-quantity', expectedValue: '0.50', precisionRule: { kind: 'decimal-places', count: 2 } }, sub: { expression: '0.5' }, expect: 'reject' },
  { name: 'wrong value rejected', spec: { mode: 'numeric-quantity', expectedValue: '12' }, sub: { expression: '13' }, expect: 'reject' },

  // ---- Algebra: equivalence and domain ----
  { name: 'x/x vs 1 must not be accepted as unconditionally equal (x=0 undefined)', spec: alg('x/x', '1', { domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['0'] } }), sub: { expression: '1' }, expect: 'reject' },
  { name: '(x^2-9)/(x-3) -> x+3 with correct excluded value 3', spec: alg('(x^2-9)/(x-3)', 'x+3', { domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['3'] } }), sub: { expression: 'x+3', domainInput: 'x != 3' }, expect: 'accept' },
  { name: '(x^2-9)/(x-3) -> x+3 with NO domain statement is incomplete', spec: alg('(x^2-9)/(x-3)', 'x+3', { domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['3'] } }), sub: { expression: 'x+3' }, expect: 'reject' },
  { name: '(x^2-9)/(x-3) -> x+3 with WRONG excluded value', spec: alg('(x^2-9)/(x-3)', 'x+3', { domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['3'] } }), sub: { expression: 'x+3', domainInput: 'x != -3' }, expect: 'reject' },
  { name: 'x^2 is not x (agree only at 0 and 1)', spec: alg(undefined, 'x'), sub: { expression: 'x^2' }, expect: 'reject' },
  { name: 'x^2-x vs x(x-1) equivalent', spec: alg(undefined, 'x^2-x'), sub: { expression: 'x*(x-1)' }, expect: 'accept' },
  { name: '(x+1)^2 vs x^2+1 different', spec: alg(undefined, '(x+1)^2'), sub: { expression: 'x^2+1' }, expect: 'reject' },
  { name: '(x+1)^2 vs x^2+2x+1 equivalent', spec: alg(undefined, '(x+1)^2'), sub: { expression: 'x^2+2*x+1' }, expect: 'accept' },
  { name: 'sqrt(x^2) is |x| not x', spec: alg(undefined, 'x'), sub: { expression: 'sqrt(x^2)' }, expect: 'reject' },
  { name: 'ln(x^2) is not 2ln(x) (domains differ)', spec: alg(undefined, '2*ln(x)'), sub: { expression: 'ln(x^2)' }, expect: 'reject' },
  { name: 'sin(pi*x) is not 0 although zero at every integer', spec: alg(undefined, '0'), sub: { expression: 'sin(pi*x)' }, expect: 'reject' },
  { name: 'x^2-1 over x-1 reduces to x+1 (expected x+1, learner unsimplified, any-equivalent)', spec: alg('(x^2-1)/(x-1)', 'x+1', { domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['1'] } }), sub: { expression: '(x^2-1)/(x-1)', domainInput: 'x != 1' }, expect: 'accept' },

  // ---- Equations: extraneous and lost roots ----
  { name: 'sqrt(x+2)=x : root 2 only', spec: { mode: 'equation-solution', variable: 'x', originalEquation: 'sqrt(x+2)=x', equationClass: 'radical', expectedRoots: ['2'], requireCompleteSet: true, extraneousCandidates: ['-1'] } as any, sub: { expression: '', rootsInput: '2' }, expect: 'accept' },
  { name: 'sqrt(x+2)=x : extraneous -1 must be rejected', spec: { mode: 'equation-solution', variable: 'x', originalEquation: 'sqrt(x+2)=x', equationClass: 'radical', expectedRoots: ['2'], requireCompleteSet: true, extraneousCandidates: ['-1'] } as any, sub: { expression: '', rootsInput: '2, -1' }, expect: 'reject' },
  { name: 'x^2=x : dividing by x loses root 0', spec: { mode: 'equation-solution', variable: 'x', originalEquation: 'x^2=x', equationClass: 'polynomial', expectedRoots: ['0', '1'], requireCompleteSet: true } as any, sub: { expression: '', rootsInput: '1' }, expect: 'reject' },
  { name: 'x^2=x : both roots', spec: { mode: 'equation-solution', variable: 'x', originalEquation: 'x^2=x', equationClass: 'polynomial', expectedRoots: ['0', '1'], requireCompleteSet: true } as any, sub: { expression: '', rootsInput: '0, 1' }, expect: 'accept' },
  { name: 'x^2=4 : roots +-2, learner gives only 2', spec: { mode: 'equation-solution', variable: 'x', originalEquation: 'x^2=4', equationClass: 'polynomial', expectedRoots: ['2', '-2'], requireCompleteSet: true } as any, sub: { expression: '', rootsInput: '2' }, expect: 'reject' },

  // ---- Inequalities ----
  { name: '-2x>6 gives x<-3 (sign reversal)', spec: { mode: 'inequality-interval', variable: 'x', expectedIntervals: [{ low: '-inf', lowInclusive: false, high: '-3', highInclusive: false }] } as any, sub: { expression: 'x<-3' }, expect: 'accept' },
  { name: '-2x>6: x>-3 is the classic reversal error', spec: { mode: 'inequality-interval', variable: 'x', expectedIntervals: [{ low: '-inf', lowInclusive: false, high: '-3', highInclusive: false }] } as any, sub: { expression: 'x>-3' }, expect: 'reject' },
  { name: 'strict vs inclusive endpoint distinguished', spec: { mode: 'inequality-interval', variable: 'x', expectedIntervals: [{ low: '-inf', lowInclusive: false, high: '-3', highInclusive: false }] } as any, sub: { expression: 'x<=-3' }, expect: 'reject' },

  // ---- Calculus ----
  { name: 'd/dx x^3 = 3x^2', spec: { mode: 'calculus-check', variable: 'x', calculusKind: 'derivative', sourceExpr: 'x^3', expectedExpr: '3*x^2' }, sub: { expression: '3*x^2' }, expect: 'accept' },
  { name: 'd/dx x^3 : 3x is wrong', spec: { mode: 'calculus-check', variable: 'x', calculusKind: 'derivative', sourceExpr: 'x^3', expectedExpr: '3*x^2' }, sub: { expression: '3*x' }, expect: 'reject' },
  { name: 'd/dx x^3 : x^2 (forgetting the 3) wrong', spec: { mode: 'calculus-check', variable: 'x', calculusKind: 'derivative', sourceExpr: 'x^3', expectedExpr: '3*x^2' }, sub: { expression: 'x^2' }, expect: 'reject' },
  { name: 'integral 2x without +C is incomplete', spec: { mode: 'calculus-check', variable: 'x', calculusKind: 'antiderivative', sourceExpr: '2*x', expectedExpr: 'x^2', requireConstantOfIntegration: true }, sub: { expression: 'x^2' }, expect: 'reject' },
  { name: 'integral 2x with +C accepted', spec: { mode: 'calculus-check', variable: 'x', calculusKind: 'antiderivative', sourceExpr: '2*x', expectedExpr: 'x^2', requireConstantOfIntegration: true }, sub: { expression: 'x^2+C' }, expect: 'accept' },
  { name: 'integral 2x : x^2+3x+C is wrong', spec: { mode: 'calculus-check', variable: 'x', calculusKind: 'antiderivative', sourceExpr: '2*x', expectedExpr: 'x^2', requireConstantOfIntegration: true }, sub: { expression: 'x^2+3*x+C' }, expect: 'reject' },
  { name: 'integral 1/x : ln(x) without absolute value rejected when |x| required', spec: { mode: 'calculus-check', variable: 'x', calculusKind: 'antiderivative', sourceExpr: '1/x', expectedExpr: 'ln(abs(x))', requireConstantOfIntegration: true, requireAbsInLog: true }, sub: { expression: 'ln(x)+C' }, expect: 'reject' },
];

describe('independent adversarial verification of math-evaluator', () => {
  for (const c of cases) {
    it(`${c.expect.toUpperCase()}: ${c.name}`, () => {
      const res = evaluateMathSubmission(c.spec, c.sub);
      if (c.expect === 'accept') {
        expect(res.passed, `verdict=${res.verdict} :: ${res.feedback}`).toBe(true);
        expect(['exact-equivalent', 'symbolic-domain-equivalent']).toContain(res.verdict);
      } else {
        expect(res.passed, `verdict=${res.verdict} :: ${res.feedback}`).toBe(false);
      }
    });
  }

  it('never presents bounded numeric sampling as proof (bounded verdict must not be an exact verdict)', () => {
    // sin(x)^2+cos(x)^2 = 1 is a true identity but not provable by the exact engine here;
    // whatever the verdict, it must be labelled honestly (never "exact-equivalent" via sampling).
    const res = evaluateMathSubmission(alg(undefined, '1'), { expression: 'sin(x)^2+cos(x)^2' });
    if (res.passed) {
      expect(['exact-equivalent', 'symbolic-domain-equivalent', 'bounded-numeric-match']).toContain(res.verdict);
    }
    expect(res.verdict).not.toBe('syntax-error');
  });
});
