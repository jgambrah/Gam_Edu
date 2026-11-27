import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  EvalOpBudget,
  areIntervalUnionsEqual,
  certifyEquationAuthorConfig,
  checkBoundedNumericAgreement,
  decimalStringToBigRat,
  evaluateMathSubmission,
  inspectRawNumericPrecision,
  normaliseIntervalUnion,
  parseEndpoint,
  parseEvalExpr,
  parseIntervalOrInequality,
  parseUnitExpression,
  roundBigRatToDecimalPlaces,
  type MathAlgebraicExpressionSpec,
  type MathNumericQuantitySpec,
} from './math-eval-engine';
import {
  SUPPORTED_INTERACTIVE_ENGINES,
  assertValidLessonInteractives,
  validateSlideInteractiveConfig,
  type MathEvaluatorInteractiveConfig,
} from '@/lib/narrated-lessons/interactive-schema';
import { MathEvaluatorEngine } from '@/components/narrated-lessons/MathEvaluatorEngine';
import { InteractiveEngineRegistry } from '@/components/narrated-lessons/InteractiveEngineRegistry';

describe('Step 5A — Mathematical Evaluator (math-evaluator 1.0.0 Preview)', () => {
  it('registers math-evaluator as 7th engine with engineVersion 1.0.0 and productionVersion null (closed)', () => {
    expect(SUPPORTED_INTERACTIVE_ENGINES['math-evaluator'].engineVersion).toBe('1.0.0');
    expect(SUPPORTED_INTERACTIVE_ENGINES['math-evaluator'].productionVersion).toBeNull();
    expect(SUPPORTED_INTERACTIVE_ENGINES['math-evaluator'].implemented).toBe(true);
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].productionVersion).toBe('1.3.0');
  });

  describe('1. Expression Grammar, Precedence & Disambiguation', () => {
    it.each([
      ['-2^2', '-4'],
      ['(-2)^2', '4'],
      ['2^3^2', '512'],
      ['2^-3', '0.125'],
      ['(2/3)x', '2*x/3'],
      ['2/(3x)', '2/(3*x)'],
      ['3xy', '3*x*y'],
      ['2(x+1)', '2*x+2'],
      ['2sin(x)', '2*sin(x)'],
      ['sin(x)^2', '(sin(x))^2'],
    ])('parses %s consistently with %s', (input, expected) => {
      const res = evaluateMathSubmission(
        { mode: 'algebraic-expression', variables: ['x', 'y'], expectedExpr: expected, verificationPolicy: 'exact-or-symbolic' },
        { expression: input },
      );
      expect(res.passed).toBe(true);
    });

    it('rejects ambiguous 2/3x, missing function parens (sin x), and undeclared variables', () => {
      expect(() => parseEvalExpr('2/3x', { allowedVariables: ['x'] })).toThrow(/Ambiguous/i);
      expect(() => parseEvalExpr('sin x', { allowedVariables: ['x'] })).toThrow(/parentheses/i);
      expect(() => parseEvalExpr('3z + 1', { allowedVariables: ['x'] })).toThrow(/undeclared/i);
    });

    it('distinguishes scientific notation (3.00e8) from Euler constant e (2e, e^x)', () => {
      const sci = parseEvalExpr('3.00e8');
      expect(sci.ast.type).toBe('number');
      const twoE = parseEvalExpr('2e');
      expect(twoE.ast.type).toBe('binary');
    });
  });

  describe('2. Exact Arithmetic, Precision, Sig Figs & Rounding (Zero Float Drift)', () => {
    it('rounds 9.995 to 10.00 under half-up, handles negative rounding and half-even ties', () => {
      expect(roundBigRatToDecimalPlaces(decimalStringToBigRat('9.995'), 2, 'half-up').formatted).toBe('10.00');
      expect(roundBigRatToDecimalPlaces(decimalStringToBigRat('-2.5'), 0, 'half-up').formatted).toBe('-3');
      expect(roundBigRatToDecimalPlaces(decimalStringToBigRat('2.5'), 0, 'half-even').formatted).toBe('2');
      expect(roundBigRatToDecimalPlaces(decimalStringToBigRat('3.5'), 0, 'half-even').formatted).toBe('4');
    });

    it('inspects raw significant figures, trailing zeros, scientific notation, and zero-valued answers', () => {
      expect(inspectRawNumericPrecision('0.0450').sigFigs).toBe(3);
      expect(inspectRawNumericPrecision('12.00').sigFigs).toBe(4);
      expect(inspectRawNumericPrecision('3.00e8')).toMatchObject({ sigFigs: 3, isScientific: true });
      expect(inspectRawNumericPrecision('1200').ambiguousTrailingZeros).toBe(true);
      expect(inspectRawNumericPrecision('0.00').sigFigs).toBe(2);
    });

    it('separates reduced-fraction form from equivalence (6/8 vs 3/4)', () => {
      const spec: MathNumericQuantitySpec = {
        mode: 'numeric-quantity',
        expectedValue: '3/4',
        precisionRule: { kind: 'exact' },
        requiredForm: 'reduced-fraction',
      };
      const unreduced = evaluateMathSubmission(spec, { expression: '6/8' });
      expect(unreduced.passed).toBe(false);
      expect(unreduced.verdict).toBe('wrong-form');
      expect(evaluateMathSubmission(spec, { expression: '3/4' }).passed).toBe(true);
    });
  });

  describe('3. Full 7-Component SI Units & Temperature Offset Boundaries', () => {
    it.each([
      ['12.5', 'm/s', '45', 'km/h', 'difference'],
      ['1000', 'cm^3', '1', 'dm^3', 'difference'],
      ['1', 'g/cm^3', '1000', 'kg/m^3', 'difference'],
      ['0.25', 'mol/dm^3', '250', 'mol/m^3', 'difference'],
      ['37.5', '%', '0.375', '', 'difference'],
      ['180', 'deg', '3.14159265', 'rad', 'difference'],
      ['25', '°C', '298.15', 'K', 'absolute'],
      ['25', '°C', '25', 'K', 'difference'],
    ] as const)('verifies %s %s equals %s %s (%s)', (expV, expU, lrnV, lrnU, tMode) => {
      const res = evaluateMathSubmission(
        {
          mode: 'numeric-quantity',
          expectedValue: expV,
          tolerance: { rel: 1e-5 },
          unitSpec: { expectedUnit: expU, allowEquivalentUnits: true, temperatureMode: tMode },
        },
        { expression: lrnV, unit: lrnU },
      );
      expect(res.passed).toBe(true);
    });

    it('distinguishes conventional units (J vs N m), rejects dimension mismatch and ambiguous m/s/s', () => {
      const energyRes = evaluateMathSubmission(
        {
          mode: 'numeric-quantity',
          expectedValue: '10',
          unitSpec: { expectedUnit: 'J', allowedUnits: ['J', 'kJ'] },
        },
        { expression: '10', unit: 'N m' },
      );
      expect(energyRes.passed).toBe(false);
      expect(energyRes.verdict).toBe('wrong-unit-or-precision');

      const dimMismatch = evaluateMathSubmission(
        { mode: 'numeric-quantity', expectedValue: '10', unitSpec: { expectedUnit: 'm/s' } },
        { expression: '10', unit: 'm/s^2' },
      );
      expect(dimMismatch.passed).toBe(false);
      expect(dimMismatch.verdict).toBe('wrong-unit-or-precision');

      expect(() => parseUnitExpression('m/s/s')).toThrow(/Ambiguous/i);
      // Compound unit J/°C must NOT apply +273.15 affine offset
      expect(parseUnitExpression('J/°C').offsetK).toBe(0);
    });
  });

  describe('4. Algebraic Equivalence, Forms, Surds, Domains & Misleading Sampling', () => {
    it('separates equivalence from expanded-polynomial form (2(x+3) vs 2x+6)', () => {
      const spec: MathAlgebraicExpressionSpec = {
        mode: 'algebraic-expression',
        variables: ['x'],
        expectedExpr: '2x + 6',
        requiredForm: 'expanded-polynomial',
      };
      const wrongForm = evaluateMathSubmission(spec, { expression: '2(x+3)' });
      expect(wrongForm.passed).toBe(false);
      expect(wrongForm.verdict).toBe('wrong-form');
      expect(evaluateMathSubmission(spec, { expression: '6 + 2x' }).passed).toBe(true);
    });

    it('enforces domain restrictions on (x²-9)/(x-3), 1/(1/x), and ln(x)+ln(x-2)', () => {
      const ratSpec: MathAlgebraicExpressionSpec = {
        mode: 'algebraic-expression',
        variables: ['x'],
        sourceExpr: '(x^2 - 9)/(x - 3)',
        expectedExpr: 'x + 3',
        domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['3'] },
      };
      expect(evaluateMathSubmission(ratSpec, { expression: 'x + 3' }).passed).toBe(false);
      expect(evaluateMathSubmission(ratSpec, { expression: 'x + 3', domainInput: 'x != 3' }).passed).toBe(true);

      const invSpec: MathAlgebraicExpressionSpec = {
        mode: 'algebraic-expression',
        variables: ['x'],
        sourceExpr: '1/(1/x)',
        expectedExpr: 'x',
        domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['0'] },
      };
      expect(evaluateMathSubmission(invSpec, { expression: 'x', domainInput: 'x != 0' }).passed).toBe(true);

      const logSpec: MathAlgebraicExpressionSpec = {
        mode: 'algebraic-expression',
        variables: ['x'],
        sourceExpr: 'ln(x) + ln(x - 2)',
        expectedExpr: 'ln(x*(x - 2))',
        domainRestrictions: {
          requireLearnerDomain: true,
          expectedDomainInterval: 'x > 2',
          variableAssumptions: { x: 'positive' },
        },
      };
      expect(evaluateMathSubmission(logSpec, { expression: 'ln(x^2 - 2x)', domainInput: 'x > 0' }).passed).toBe(false);
      expect(evaluateMathSubmission(logSpec, { expression: 'ln(x^2 - 2x)', domainInput: 'x > 2' }).passed).toBe(true);
    });

    it('canonicalises quadratic surds (√12 + √27 === 5√3) and defeats misleading integer-sampling trap sin(pi*x) vs 0', () => {
      const surdSpec: MathAlgebraicExpressionSpec = {
        mode: 'algebraic-expression',
        variables: ['x'],
        expectedExpr: '5sqrt(3)',
        requiredForm: 'simplified-surd',
      };
      expect(evaluateMathSubmission(surdSpec, { expression: 'sqrt(12) + sqrt(27)' }).verdict).toBe('wrong-form');
      expect(evaluateMathSubmission(surdSpec, { expression: '5sqrt(3)' }).verdict).toBe('exact-equivalent');

      // Misleading integer-sampling trap: sin(pi*x) === 0 at every integer, must NOT match!
      const budget = new EvalOpBudget();
      const trap = checkBoundedNumericAgreement(
        parseEvalExpr('sin(pi*x)', { allowedVariables: ['x'] }).ast,
        parseEvalExpr('0', { allowedVariables: ['x'] }).ast,
        ['x'],
        budget,
      );
      expect(trap.agreed).toBe(false);
    });
  });

  describe('5. Equation Completeness, Extraneous Roots & Exact Interval Unions', () => {
    it('detects missing roots, extraneous roots, repeated roots, empty set, and authoring incompleteness', () => {
      // Quadratic completeness
      expect(
        evaluateMathSubmission(
          { mode: 'equation-solution', variable: 'x', originalEquation: 'x^2 - 5x + 6 = 0', equationClass: 'quadratic', expectedRoots: ['2', '3'] },
          { expression: '2' },
        ).passed,
      ).toBe(false);
      expect(
        evaluateMathSubmission(
          { mode: 'equation-solution', variable: 'x', originalEquation: 'x^2 - 5x + 6 = 0', equationClass: 'quadratic', expectedRoots: ['2', '3'] },
          { expression: '3, 2' },
        ).passed,
      ).toBe(true);

      // Radical extraneous root rejection
      const ext = evaluateMathSubmission(
        { mode: 'equation-solution', variable: 'x', originalEquation: 'sqrt(x + 2) = x', equationClass: 'radical-single', expectedRoots: ['2'], extraneousCandidates: ['-1'] },
        { expression: '2, -1' },
      );
      expect(ext.passed).toBe(false);
      expect(ext.feedback).toMatch(/Extraneous/i);

      // Empty set & identity
      expect(
        evaluateMathSubmission(
          { mode: 'equation-solution', variable: 'x', originalEquation: 'x^2 + 1 = 0', equationClass: 'quadratic', expectedRoots: [], solutionType: 'empty-set' },
          { expression: 'no solution' },
        ).passed,
      ).toBe(true);
      expect(
        evaluateMathSubmission(
          { mode: 'equation-solution', variable: 'x', originalEquation: '2(x + 1) = 2x + 2', equationClass: 'linear', expectedRoots: [], solutionType: 'all-reals' },
          { expression: 'all reals' },
        ).passed,
      ).toBe(true);

      // Authoring-time completeness certification catches missing root in author JSON!
      expect(certifyEquationAuthorConfig('x^2 - 5x + 6 = 0', 'x', 'quadratic', ['2'], 'finite-set').length).toBeGreaterThan(0);
    });

    it('handles exact interval merging, non-merging (0,1) U (1,2), singletons, empty sets, and rejects inclusive infinity', () => {
      const openSplit = parseIntervalOrInequality('(0, 1) U (1, 2)', 'x');
      expect(openSplit).toHaveLength(2); // MUST NOT merge!

      const halfMerged = parseIntervalOrInequality('(0, 1] U (1, 2)', 'x');
      expect(areIntervalUnionsEqual(halfMerged, parseIntervalOrInequality('(0, 2)', 'x'))).toBe(true);

      const closedMerged = parseIntervalOrInequality('[0, 1] U [1, 2]', 'x');
      expect(areIntervalUnionsEqual(closedMerged, parseIntervalOrInequality('[0, 2]', 'x'))).toBe(true);

      expect(parseIntervalOrInequality('[2, 2]', 'x')).toHaveLength(1);
      expect(parseIntervalOrInequality('(2, 2)', 'x')).toHaveLength(0);
      expect(areIntervalUnionsEqual(parseIntervalOrInequality('-3 <= x < 4', 'x'), parseIntervalOrInequality('[-3, 4)', 'x'))).toBe(true);

      expect(() =>
        normaliseIntervalUnion([{ low: parseEndpoint('-inf'), lowInclusive: true, high: parseEndpoint('2'), highInclusive: false }]),
      ).toThrow(/infinity/i);
    });
  });

  describe('6. Calculus Verification (Derivatives, Particular vs General Antiderivative, ln|x|)', () => {
    it('verifies derivatives, particular vs general antiderivatives, and ln|x| vs ln(x)', () => {
      expect(
        evaluateMathSubmission(
          { mode: 'calculus-check', variable: 'x', calculusKind: 'derivative', sourceExpr: '3x^2 + sin(x)', expectedExpr: '6x + cos(x)' },
          { expression: '6x + cos(x)' },
        ).passed,
      ).toBe(true);

      // Particular antiderivative x^4 - x^2 + 7 passes when C not required, fails as wrong-form when + C required!
      expect(
        evaluateMathSubmission(
          { mode: 'calculus-check', variable: 'x', calculusKind: 'antiderivative', sourceExpr: '4x^3 - 2x', expectedExpr: 'x^4 - x^2', requireConstantOfIntegration: false },
          { expression: 'x^4 - x^2 + 7' },
        ).passed,
      ).toBe(true);

      const missingC = evaluateMathSubmission(
        { mode: 'calculus-check', variable: 'x', calculusKind: 'antiderivative', sourceExpr: '4x^3 - 2x', expectedExpr: 'x^4 - x^2 + C', requireConstantOfIntegration: true },
        { expression: 'x^4 - x^2 + 7' },
      );
      expect(missingC.passed).toBe(false);
      expect(missingC.verdict).toBe('wrong-form');

      // ln|x| vs ln(x) for 1/x
      const logAbsSpec = {
        mode: 'calculus-check' as const,
        variable: 'x',
        calculusKind: 'antiderivative' as const,
        sourceExpr: '1/x',
        expectedExpr: 'ln|x| + C',
        requireConstantOfIntegration: true,
        requireAbsInLog: true,
      };
      expect(evaluateMathSubmission(logAbsSpec, { expression: 'ln(x) + C' }).verdict).toBe('wrong-form');
      expect(evaluateMathSubmission(logAbsSpec, { expression: 'ln|x| + C' }).passed).toBe(true);
    });
  });

  describe('7. Security, Adversarial DoS Protection & Pilot Fixture Validation', () => {
    it('blocks expansion bombs, deep nesting, prototype pollution, oversized inputs, and corrupted Unicode', () => {
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: 'x' },
          { expression: '(x+1)^100' },
        ).verdict,
      ).toBe('unsupported-or-indeterminate');

      expect(() => parseEvalExpr('(((((((((((x)))))))))))', { allowedVariables: ['x'] })).toThrow(/depth/i);
      expect(() => parseEvalExpr('__proto__', { allowedVariables: ['x'] })).toThrow(/Disallowed/i);
      expect(() => parseEvalExpr('x'.repeat(250), { allowedVariables: ['x'] })).toThrow(/length/i);
      expect(() => parseEvalExpr('x + \uFFFD', { allowedVariables: ['x'] })).toThrow(/corrupted/i);
    });

    it('validates all 15 slides (18 activities) in step5a-math-evaluator-pilot.json and keeps production gate CLOSED', () => {
      const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step5a-math-evaluator-pilot.json');
      const lesson = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as {
        lessonId: string;
        slides: Array<{ id: string; interactive?: unknown[] }>;
      };
      expect(lesson.slides).toHaveLength(15);
      const totalActs = lesson.slides.reduce((acc, s) => acc + (s.interactive?.length ?? 0), 0);
      expect(totalActs).toBe(18);

      // Passes preview gate (allowDevOnlyEngines: true)
      expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: true })).not.toThrow();
      // Blocked at production publish gate while productionVersion is null!
      expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: false })).toThrow(/production/i);
    });
  });

  describe('8. UI, Accessible Keypad, Multi-Activity Isolation, Low-Data Mode & Performance', () => {
    const cfgA: MathEvaluatorInteractiveConfig = {
      id: 'ui-me-a',
      engine: 'math-evaluator',
      schemaVersion: 1,
      minEngineVersion: '1.0.0',
      curriculumLevel: 'lower-secondary',
      mode: 'algebraic-expression',
      title: 'Expand A',
      instructions: 'Expand 2(x+3).',
      accessibilityLabel: 'Expand A',
      fallbackText: '2x + 6',
      variables: ['x'],
      expectedExpr: '2x + 6',
      requiredForm: 'expanded-polynomial',
    };

    const cfgB: MathEvaluatorInteractiveConfig = {
      id: 'ui-me-b',
      engine: 'math-evaluator',
      schemaVersion: 1,
      minEngineVersion: '1.0.0',
      curriculumLevel: 'primary',
      mode: 'numeric-quantity',
      title: 'Fraction B',
      instructions: 'Reduce 6/8.',
      accessibilityLabel: 'Fraction B',
      fallbackText: '3/4',
      expectedValue: '3/4',
      requiredForm: 'reduced-fraction',
    };

    it('supports keypad insertion, live AST preview, Check/Reset, multi-activity isolation, and Low-Data Mode', () => {
      render(
        <div>
          <MathEvaluatorEngine config={cfgA} />
          <MathEvaluatorEngine config={cfgB} />
        </div>,
      );

      const inputA = screen.getByLabelText('Expand A answer input') as HTMLInputElement;
      const inputB = screen.getByLabelText('Fraction B answer input') as HTMLInputElement;

      fireEvent.change(inputA, { target: { value: '2x + 6' } });
      expect(screen.getByText(/Spoken: 2 times x plus 6/i)).toBeTruthy();

      const checkBtns = screen.getAllByRole('button', { name: 'Check answer' });
      fireEvent.click(checkBtns[0]);
      expect(screen.getByText(/exact algebraic equivalence confirmed/i)).toBeTruthy();
      expect(inputB.value).toBe(''); // isolated!

      // Toggle keypad & insert symbol
      const keypadBtns = screen.getAllByRole('button', { name: 'Show math keypad' });
      fireEvent.click(keypadBtns[1]);
      fireEvent.click(screen.getByRole('button', { name: 'Insert fraction slash' }));
      expect(inputB.value).toBe('/');

      // Low-Data Mode via InteractiveEngineRegistry
      render(
        <InteractiveEngineRegistry
          lesson={{ lessonId: 'step5a-test' } as never}
          slide={{ id: 'me-s01', interactive: cfgB } as never}
          lowDataMode={true}
        />,
      );
      expect(screen.getByText('3/4')).toBeTruthy();
    });

    it('meets performance budgets (< 2 ms representative, < 15 ms max-bound)', () => {
      const t0 = performance.now();
      for (let i = 0; i < 500; i++) {
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: '2x + 6', requiredForm: 'expanded-polynomial' },
          { expression: '2x + 6' },
        );
      }
      const repAvgMs = (performance.now() - t0) / 500;

      const t1 = performance.now();
      for (let i = 0; i < 100; i++) {
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x', 'y'], expectedExpr: '(x + y)^4', verificationPolicy: 'exact-only' },
          { expression: 'x^4 + 4x^3y + 6x^2y^2 + 4xy^3 + y^4' },
        );
      }
      const maxAvgMs = (performance.now() - t1) / 100;
      console.log(`STEP5A_PERF: representative=${repAvgMs.toFixed(4)}ms, max_bound=${maxAvgMs.toFixed(4)}ms`);

      expect(repAvgMs).toBeLessThan(2);
      expect(maxAvgMs).toBeLessThan(15);
    });
  });
});
