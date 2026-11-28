import { describe, expect, it } from 'vitest';
import {
  evaluateMathSubmission,
  evaluateSimultaneousLinearSystem,
  solveLinearSystemExact,
  type MathSimultaneousLinearSpec,
} from './math-eval-engine';
import { computeQuartiles } from '@/lib/construction-lab/data-stats-engine';

describe('Step 5E-C — Bounded Exact Linear Simultaneous Equations (D-032) & Positional Quartiles (D-011)', () => {
  describe('1. Exact 2×2 and 3×3 Linear Simultaneous Equations (BigRat RREF)', () => {
    it('solves 2×2 unique integer and rational systems exactly, supporting assignments, tuples, and elimination/substitution working lines', () => {
      const specInt: MathSimultaneousLinearSpec = {
        mode: 'simultaneous-linear',
        variables: ['x', 'y'],
        equations: ['2*x + y = 7', 'x - y = 2'],
      };
      const solvedInt = solveLinearSystemExact(specInt.equations, specInt.variables);
      expect(solvedInt.classification).toBe('unique');
      expect(solvedInt.solution?.x).toEqual({ n: BigInt(3), d: BigInt(1) });
      expect(solvedInt.solution?.y).toEqual({ n: BigInt(1), d: BigInt(1) });

      // Assignment order-independent
      expect(evaluateMathSubmission(specInt, { expression: 'y = 1, x = 3' }).passed).toBe(true);
      expect(evaluateMathSubmission(specInt, { expression: 'y = 1, x = 3' }).verdict).toBe('exact-equivalent');
      // Ordered tuple
      expect(evaluateMathSubmission(specInt, { expression: '(3, 1)' }).passed).toBe(true);
      // Elimination / substitution working lines before final assignment
      expect(
        evaluateMathSubmission(specInt, {
          expression: '3*x = 9; x = 3; y = 7 - 2*3; y = 1',
        }).passed,
      ).toBe(true);
      // Swapped values rejected with clear diagnostic feedback
      const swapped = evaluateMathSubmission(specInt, { expression: 'x = 1, y = 3' });
      expect(swapped.passed).toBe(false);
      expect(swapped.feedback).toMatch(/swapped/i);

      // Exact fractional solution: 3x + 2y = 1, 2x - 3y = 5 => x = 1, y = -1; try 2x + 3y = 1, x - y = 1 => x = 4/5, y = -1/5
      const specFrac: MathSimultaneousLinearSpec = {
        mode: 'simultaneous-linear',
        variables: ['x', 'y'],
        equations: ['2*x + 3*y = 1', 'x - y = 1'],
      };
      expect(evaluateMathSubmission(specFrac, { expression: 'x = 4/5, y = -1/5' }).passed).toBe(true);
      expect(evaluateMathSubmission(specFrac, { expression: 'x = 0.8, y = -0.2' }).passed).toBe(true);
      expect(evaluateMathSubmission(specFrac, { expression: 'x = 0.799, y = -0.2' }).passed).toBe(false);
    });

    it('solves 3×3 systems exactly and classifies no-solution (inconsistent) and infinitely-many (dependent) systems', () => {
      const spec3: MathSimultaneousLinearSpec = {
        mode: 'simultaneous-linear',
        variables: ['x', 'y', 'z'],
        equations: ['x + y + z = 6', '2*x - y + z = 3', 'x + 2*y - z = 2'],
      };
      // Ground truth: x = 1, y = 2, z = 3
      expect(evaluateMathSubmission(spec3, { expression: 'x = 1, y = 2, z = 3' }).passed).toBe(true);
      expect(evaluateMathSubmission(spec3, { expression: '(1, 2, 3)' }).passed).toBe(true);
      expect(evaluateMathSubmission(spec3, { expression: 'x = 1, y = 2, z = 4' }).passed).toBe(false);

      const noSol: MathSimultaneousLinearSpec = {
        mode: 'simultaneous-linear',
        variables: ['x', 'y'],
        equations: ['2*x + 4*y = 6', 'x + 2*y = 5'],
      };
      expect(solveLinearSystemExact(noSol.equations, noSol.variables).classification).toBe('no-solution');
      expect(evaluateMathSubmission(noSol, { expression: 'no solution' }).passed).toBe(true);
      expect(evaluateMathSubmission(noSol, { expression: 'x = 1, y = 1' }).passed).toBe(false);

      const infSol: MathSimultaneousLinearSpec = {
        mode: 'simultaneous-linear',
        variables: ['x', 'y'],
        equations: ['2*x + 4*y = 6', 'x + 2*y = 3'],
      };
      expect(solveLinearSystemExact(infSol.equations, infSol.variables).classification).toBe('infinitely-many');
      expect(evaluateMathSubmission(infSol, { expression: 'infinitely many solutions' }).passed).toBe(true);
      expect(evaluateMathSubmission(infSol, { expression: 'no solution' }).passed).toBe(false);
    });

    it('rejects non-linear equations as unsupported-or-indeterminate', () => {
      const nonLinear: MathSimultaneousLinearSpec = {
        mode: 'simultaneous-linear',
        variables: ['x', 'y'],
        equations: ['x^2 + y = 5', 'x - y = 1'],
      };
      const res = evaluateSimultaneousLinearSystem(nonLinear, 'x = 2, y = 1');
      expect(res.passed).toBe(false);
      expect(res.verdict).toBe('unsupported-or-indeterminate');
    });
  });

  describe('2. Selectable Positional (n+1)/4 Quartile Convention (D-011 — Cambridge IGCSE 0580 / NaCCA)', () => {
    it('preserves default tukey-exclusive while computing exact hand-derived positional-n-plus-1 quartiles', () => {
      // Hand-derived n = 6: [2, 4, 6, 8, 10, 12]
      // tukey-exclusive: lower=[2,4,6]->Q1=4, upper=[8,10,12]->Q3=10
      expect(computeQuartiles([2, 4, 6, 8, 10, 12])).toEqual({ q1: 4, median: 7, q3: 10 });
      // positional-n-plus-1: Q1 at 0.25*(6+1)=1.75 -> 2 + 0.75*(4-2) = 3.5; Q3 at 5.25 -> 10 + 0.25*(12-10) = 10.5
      expect(computeQuartiles([2, 4, 6, 8, 10, 12], 'positional-n-plus-1')).toEqual({
        q1: 3.5,
        median: 7,
        q3: 10.5,
      });

      // Hand-derived n = 7: [1, 2, 3, 4, 5, 6, 7] -> (7+1)/4 = 2nd value = 2, 3*(7+1)/4 = 6th value = 6
      expect(computeQuartiles([1, 2, 3, 4, 5, 6, 7], 'positional-n-plus-1')).toEqual({
        q1: 2,
        median: 4,
        q3: 6,
      });

      // Hand-derived n = 4: [1, 3, 5, 7] -> 0.25*5=1.25 -> 1.5; 0.75*5=3.75 -> 6.5
      expect(computeQuartiles([1, 3, 5, 7], 'positional-n-plus-1')).toEqual({
        q1: 1.5,
        median: 4,
        q3: 6.5,
      });
    });
  });
});
