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

describe('Step 5A — Mathematical Evaluator (math-evaluator 1.0.0 Corrected Preview)', () => {
  it('registers math-evaluator as 7th engine with engineVersion 1.0.0 and productionVersion 1.0.0', () => {
    expect(SUPPORTED_INTERACTIVE_ENGINES['math-evaluator'].engineVersion).toBe('1.0.0');
    expect(SUPPORTED_INTERACTIVE_ENGINES['math-evaluator'].productionVersion).toBe('1.0.0');
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

    it('distinguishes scientific notation (3.00e8) from Euler constant e (2e)', () => {
      expect(parseEvalExpr('3.00e8').ast.type).toBe('number');
      expect(parseEvalExpr('2e').ast.type).toBe('binary');
    });
  });

  describe('2. Defect #1: Genuine Symbolic Equivalence vs Bounded Numeric vs Unsupported', () => {
    it('proves log product rule under explicit shared domain (x > 2) and Pythagorean identity symbolically (zero numerical sampling)', () => {
      // Documented Step 5A.1 correction: ln(x)+ln(x-2) has natural domain (2, inf) whereas ln(x(x-2)) has (-inf,0) U (2,inf).
      // Without x > 2 they are NOT equivalent; WITH explicit shared domain x > 2 they ARE symbolic-domain-equivalent.
      const logUnrestricted = evaluateMathSubmission(
        { mode: 'algebraic-expression', variables: ['x'], expectedExpr: 'ln(x*(x - 2))', verificationPolicy: 'exact-or-symbolic' },
        { expression: 'ln(x) + ln(x - 2)' },
      );
      expect(logUnrestricted.passed).toBe(false);
      expect(logUnrestricted.verdict).toBe('incorrect');

      const logRes = evaluateMathSubmission(
        {
          mode: 'algebraic-expression',
          variables: ['x'],
          expectedExpr: 'ln(x*(x - 2))',
          domainRestrictions: { expectedDomainInterval: 'x > 2' },
          verificationPolicy: 'exact-or-symbolic',
        },
        { expression: 'ln(x) + ln(x - 2)' },
      );
      expect(logRes.passed).toBe(true);
      expect(logRes.verdict).toBe('symbolic-domain-equivalent');

      const trigRes = evaluateMathSubmission(
        { mode: 'algebraic-expression', variables: ['x'], expectedExpr: '1', verificationPolicy: 'exact-or-symbolic' },
        { expression: 'sin(x)^2 + cos(x)^2' },
      );
      expect(trigRes.passed).toBe(true);
      expect(trigRes.verdict).toBe('symbolic-domain-equivalent');
    });

    it('returns unsupported-or-indeterminate (NOT symbolic-domain-equivalent) for unsupported trig identity unless allow-bounded-numeric', () => {
      const unsup = evaluateMathSubmission(
        { mode: 'algebraic-expression', variables: ['x'], expectedExpr: 'sin(2x)', verificationPolicy: 'exact-or-symbolic' },
        { expression: '2*sin(x)*cos(x)' },
      );
      expect(unsup.passed).toBe(false);
      expect(unsup.verdict).toBe('unsupported-or-indeterminate');

      const optIn = evaluateMathSubmission(
        { mode: 'algebraic-expression', variables: ['x'], expectedExpr: 'sin(2x)', verificationPolicy: 'allow-bounded-numeric' },
        { expression: '2*sin(x)*cos(x)' },
      );
      expect(optIn.passed).toBe(true);
      expect(optIn.verdict).toBe('bounded-numeric-match'); // NEVER symbolic-domain-equivalent!
    });
  });

  describe('3. Defect #2: Parsed Domain Certification (Zero Substring Matching)', () => {
    it('rejects x != 30 and extra exclusions (x != 3, x != 4) when exact restriction is x != 3', () => {
      const ratSpec: MathAlgebraicExpressionSpec = {
        mode: 'algebraic-expression',
        variables: ['x'],
        sourceExpr: '(x^2 - 9)/(x - 3)',
        expectedExpr: 'x + 3',
        domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['3'] },
      };
      expect(evaluateMathSubmission(ratSpec, { expression: 'x + 3', domainInput: 'x != 30' }).passed).toBe(false);
      expect(evaluateMathSubmission(ratSpec, { expression: 'x + 3', domainInput: 'x != 3 and x != 4' }).passed).toBe(false);
      expect(evaluateMathSubmission(ratSpec, { expression: 'x + 3', domainInput: 'x != 3' }).passed).toBe(true);
    });

    it('verifies 1/(1/x), (x²-1)/(x-1), ln(x)+ln(x-2), sqrt(x²) vs x vs abs(x), and rejects uncertifiable multivariate denominators', () => {
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], sourceExpr: '1/(1/x)', expectedExpr: 'x', domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['0'] } },
          { expression: 'x', domainInput: 'x != 0' },
        ).passed,
      ).toBe(true);

      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], sourceExpr: '(x^2 - 1)/(x - 1)', expectedExpr: 'x + 1', domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['1'] } },
          { expression: 'x + 1', domainInput: 'x != 1' },
        ).passed,
      ).toBe(true);

      // sqrt(x^2) !== x over all reals, but sqrt(x^2) === abs(x)!
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: 'x' },
          { expression: 'sqrt(x^2)' },
        ).passed,
      ).toBe(false);
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: 'abs(x)' },
          { expression: 'sqrt(x^2)' },
        ).passed,
      ).toBe(true);

      // Unsupported multivariate denominator returns unsupported-or-indeterminate
      const multiDen = evaluateMathSubmission(
        { mode: 'algebraic-expression', variables: ['x', 'y'], sourceExpr: '1/(x^2 + y^2 - 1)', expectedExpr: '1/(x^2 + y^2 - 1)' },
        { expression: '1/(x^2 + y^2 - 1)' },
      );
      expect(multiDen.passed).toBe(false);
      expect(multiDen.verdict).toBe('unsupported-or-indeterminate');
    });
  });

  describe('4. Defects #3 & #4: Independent Equation Certification & Exact Root Comparison', () => {
    it('independently certifies all 5 equation classes and rejects malformed/incomplete author configs', () => {
      expect(certifyEquationAuthorConfig('x^2 - 5x + 6 = 0', 'x', 'quadratic', ['2', '2']).length).toBeGreaterThan(0);
      expect(certifyEquationAuthorConfig('x^2 - 5x + 6 = 0', 'x', 'quadratic', ['2']).length).toBeGreaterThan(0);
      expect(certifyEquationAuthorConfig('x^2 - 5x + 6 = 0', 'x', 'quadratic', [], 'all-reals').length).toBeGreaterThan(0);
      expect(certifyEquationAuthorConfig('(x - 1)(x - 2)(x - 3) = 0', 'x', 'factored-polynomial', ['1', '2']).length).toBeGreaterThan(0);
      expect(certifyEquationAuthorConfig('(x - 1)(x - 2)(x - 3) = 0', 'x', 'factored-polynomial', ['1', '2', '3'])).toHaveLength(0);
      expect(certifyEquationAuthorConfig('sqrt(x + 2) = x', 'x', 'radical-single', ['2'])).toHaveLength(0);
      expect(certifyEquationAuthorConfig('sqrt(x + 2) = x', 'x', 'radical-single', [], 'empty-set').length).toBeGreaterThan(0);
      expect(certifyEquationAuthorConfig('sqrt(x + 2) = x', 'x', 'radical-single', ['2', '-1']).length).toBeGreaterThan(0);
      // Restricted-domain identity cannot be declared all-reals!
      expect(certifyEquationAuthorConfig('(x - 1)/(x - 1) = 1', 'x', 'rational-linear-quadratic', [], 'all-reals').length).toBeGreaterThan(0);
      // Rational equation incorrectly declared as linear polynomial -> rejected!
      expect(certifyEquationAuthorConfig('1/x = 2', 'x', 'linear', ['1/2']).length).toBeGreaterThan(0);
      // Irrational quadratic roots certified exactly!
      expect(certifyEquationAuthorConfig('x^2 - 2 = 0', 'x', 'quadratic', ['-sqrt(2)', 'sqrt(2)'])).toHaveLength(0);
      // Constant contradiction & repeated root
      expect(certifyEquationAuthorConfig('0 = 5', 'x', 'linear', [], 'empty-set')).toHaveLength(0);
      expect(certifyEquationAuthorConfig('(x - 3)^2 = 0', 'x', 'quadratic', ['3'])).toHaveLength(0);
    });

    it('keeps closely spaced distinct roots (x-1)(x-1.000001)=0 distinct and avoids false completeness claims', () => {
      const closeSpec = {
        mode: 'equation-solution' as const,
        variable: 'x',
        originalEquation: '(x - 1)(x - 1.000001) = 0',
        equationClass: 'factored-polynomial' as const,
        expectedRoots: ['1', '1.000001'],
        requireCompleteSet: true,
      };
      expect(evaluateMathSubmission(closeSpec, { expression: '1' }).passed).toBe(false);
      expect(evaluateMathSubmission(closeSpec, { expression: '1, 1.000001' }).passed).toBe(true);

      const partial = evaluateMathSubmission({ ...closeSpec, requireCompleteSet: false }, { expression: '1' });
      expect(partial.passed).toBe(true);
      expect(partial.feedback).not.toMatch(/complete solution set/i);
    });
  });

  describe('5. Defect #5: Arbitrary Constant of Integration C & Specific ln|x| Check', () => {
    it('distinguishes x²+C, x²+2C (valid) from x²+7, x²+0C, x²+C-C (wrong-form) and x²+Cx (incorrect)', () => {
      const genSpec = {
        mode: 'calculus-check' as const,
        variable: 'x',
        calculusKind: 'antiderivative' as const,
        sourceExpr: '2x',
        expectedExpr: 'x^2 + C',
        requireConstantOfIntegration: true,
      };
      expect(evaluateMathSubmission(genSpec, { expression: 'x^2 + C' }).passed).toBe(true);
      expect(evaluateMathSubmission(genSpec, { expression: 'x^2 + 2C' }).passed).toBe(true);
      expect(evaluateMathSubmission(genSpec, { expression: 'x^2 + 7' }).verdict).toBe('wrong-form');
      expect(evaluateMathSubmission(genSpec, { expression: 'x^2 + 0C' }).verdict).toBe('wrong-form');
      expect(evaluateMathSubmission(genSpec, { expression: 'x^2 + C - C' }).verdict).toBe('wrong-form');
      expect(evaluateMathSubmission(genSpec, { expression: 'x^2 + C*x' }).verdict).toBe('incorrect');
    });

    it('requires abs() specifically inside ln(...) for ln|x| (rejects ln(x) + abs(0) + C)', () => {
      const logAbsSpec = {
        mode: 'calculus-check' as const,
        variable: 'x',
        calculusKind: 'antiderivative' as const,
        sourceExpr: '1/x',
        expectedExpr: 'ln|x| + C',
        requireConstantOfIntegration: true,
        requireAbsInLog: true,
      };
      expect(evaluateMathSubmission(logAbsSpec, { expression: 'ln(x) + abs(0) + C' }).verdict).toBe('wrong-form');
      expect(evaluateMathSubmission(logAbsSpec, { expression: 'ln|x| + C' }).passed).toBe(true);
    });
  });

  describe('6. Defects #6 & #7: Zero Hidden Tolerances, Exact Units, Precision & All Required Forms', () => {
    it('rejects 1.0000000001 vs 1 in exact mode and never labels tolerance matches exact', () => {
      expect(
        evaluateMathSubmission({ mode: 'numeric-quantity', expectedValue: '1' }, { expression: '1.0000000001' }).passed,
      ).toBe(false);

      const tolMatch = evaluateMathSubmission(
        { mode: 'numeric-quantity', expectedValue: '180', tolerance: { rel: 1e-4 }, unitSpec: { expectedUnit: 'deg', allowEquivalentUnits: true } },
        { expression: '3.14159', unit: 'rad' },
      );
      expect(tolMatch.passed).toBe(true);
      expect(tolMatch.verdict).toBe('bounded-numeric-match'); // NOT exact-equivalent!
    });

    it('enforces precision rules in the learner accepted unit (12.5 m/s -> 45.0 km/h passes 3 s.f., 45 km/h fails)', () => {
      const spec: MathNumericQuantitySpec = {
        mode: 'numeric-quantity',
        expectedValue: '12.5',
        precisionRule: { kind: 'sig-figs', count: 3, rounding: 'half-up' },
        unitSpec: { expectedUnit: 'm/s', allowEquivalentUnits: true },
      };
      expect(evaluateMathSubmission(spec, { expression: '45.0', unit: 'km/h' }).passed).toBe(true);
      expect(evaluateMathSubmission(spec, { expression: '45', unit: 'km/h' }).verdict).toBe('wrong-unit-or-precision');
    });

    it('enforces decimal, reduced-fraction, normalised scientific (30*10^7 rejected), fully factored (2(x²-9) rejected), and simplified-fraction', () => {
      expect(
        evaluateMathSubmission({ mode: 'numeric-quantity', expectedValue: '0.75', requiredForm: 'decimal' }, { expression: '3/4' }).verdict,
      ).toBe('wrong-form');
      expect(
        evaluateMathSubmission({ mode: 'numeric-quantity', expectedValue: '0.75', requiredForm: 'decimal' }, { expression: '0.75' }).passed,
      ).toBe(true);

      expect(
        evaluateMathSubmission({ mode: 'numeric-quantity', expectedValue: '300000000', requiredForm: 'scientific' }, { expression: '30 * 10^7' }).verdict,
      ).toBe('wrong-form');
      expect(
        evaluateMathSubmission({ mode: 'numeric-quantity', expectedValue: '300000000', requiredForm: 'scientific' }, { expression: '3.00e8' }).passed,
      ).toBe(true);

      // Partially factorised 2(x^2 - 9) rejected!
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: '2(x - 3)(x + 3)', requiredForm: 'factored-form' },
          { expression: '2(x^2 - 9)' },
        ).verdict,
      ).toBe('wrong-form');
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: '2(x - 3)(x + 3)', requiredForm: 'factored-form' },
          { expression: '2(x + 3)(x - 3)' },
        ).passed,
      ).toBe(true);

      // Unsimplified algebraic fraction rejected on simplification task (with sourceExpr preserving x != 3)!
      expect(
        evaluateMathSubmission(
          {
            mode: 'algebraic-expression',
            variables: ['x'],
            sourceExpr: '(x^2 - 9)/(x - 3)',
            expectedExpr: 'x + 3',
            requiredForm: 'simplified-fraction',
          },
          { expression: '(x^2 - 9)/(x - 3)' },
        ).verdict,
      ).toBe('wrong-form');
    });

    it.each([
      ['12.5', 'm/s', '45', 'km/h', 'difference'],
      ['1000', 'cm^3', '1', 'dm^3', 'difference'],
      ['1', 'g/cm^3', '1000', 'kg/m^3', 'difference'],
      ['0.25', 'mol/dm^3', '250', 'mol/m^3', 'difference'],
      ['37.5', '%', '0.375', '', 'difference'],
      ['25', '°C', '298.15', 'K', 'absolute'],
      ['25', '°C', '25', 'K', 'difference'],
    ] as const)('verifies exact BigRat unit conversion %s %s === %s %s (%s)', (expV, expU, lrnV, lrnU, tMode) => {
      const res = evaluateMathSubmission(
        {
          mode: 'numeric-quantity',
          expectedValue: expV,
          unitSpec: { expectedUnit: expU, allowEquivalentUnits: true, temperatureMode: tMode },
        },
        { expression: lrnV, unit: lrnU },
      );
      expect(res.passed).toBe(true);
      expect(res.verdict).toBe('exact-equivalent');
    });
  });

  describe('7. Defects #8 & #9: Strict Nested Schema Validation, Interval Style & Misconception Precedence', () => {
    it('rejects string booleans (lowInclusive: "false"), duplicate vars, negative tolerance, and conflicting misconception rules', () => {
      const badInterval = validateSlideInteractiveConfig(
        {
          id: 'bad-iv',
          engine: 'math-evaluator',
          schemaVersion: 1,
          minEngineVersion: '1.0.0',
          curriculumLevel: 'igcse',
          mode: 'inequality-interval',
          title: 'Bad Interval',
          instructions: 'Test strict boolean check.',
          accessibilityLabel: 'Bad Interval',
          fallbackText: 'Fallback text',
          variable: 'x',
          expectedIntervals: [{ low: '0', lowInclusive: 'false', high: '2', highInclusive: false }],
        },
        { requireProduction: false },
      );
      expect(badInterval.ok).toBe(false);

      const badMisconception = validateSlideInteractiveConfig(
        {
          id: 'bad-misc',
          engine: 'math-evaluator',
          schemaVersion: 1,
          minEngineVersion: '1.0.0',
          curriculumLevel: 'igcse',
          mode: 'algebraic-expression',
          title: 'Conflict',
          instructions: 'Test conflict.',
          accessibilityLabel: 'Conflict',
          fallbackText: 'Fallback',
          variables: ['x'],
          expectedExpr: '2x + 6',
          misconceptionChecks: [{ matchExpr: '6 + 2x', feedback: 'Wrong!' }],
        },
        { requireProduction: false },
      );
      expect(badMisconception.ok).toBe(false);

      // Correct learner answer is NEVER overridden by a conflicting misconception rule at runtime!
      const runtimeRes = evaluateMathSubmission(
        {
          mode: 'algebraic-expression',
          variables: ['x'],
          expectedExpr: '2x + 6',
          misconceptionChecks: [{ matchExpr: '6 + 2x', feedback: 'Erroneous rule' }],
        },
        { expression: '6 + 2x' },
      );
      expect(runtimeRes.passed).toBe(true);

      // acceptedInputStyle enforcement
      expect(
        evaluateMathSubmission(
          {
            mode: 'inequality-interval',
            variable: 'x',
            expectedIntervals: [{ low: '-inf', lowInclusive: false, high: '2', highInclusive: false }],
            acceptedInputStyle: 'interval',
          },
          { expression: 'x < 2' },
        ).verdict,
      ).toBe('syntax-error');
    });

    it('preserves exact interval union rules: (0,1) U (1,2) unmerged, (0,1] U (1,2) merged, [2,2] singleton, (2,2) empty', () => {
      expect(parseIntervalOrInequality('(0, 1) U (1, 2)', 'x')).toHaveLength(2);
      expect(areIntervalUnionsEqual(parseIntervalOrInequality('(0, 1] U (1, 2)', 'x'), parseIntervalOrInequality('(0, 2)', 'x'))).toBe(true);
      expect(areIntervalUnionsEqual(parseIntervalOrInequality('[0, 1] U [1, 2]', 'x'), parseIntervalOrInequality('[0, 2]', 'x'))).toBe(true);
      expect(parseIntervalOrInequality('[2, 2]', 'x')).toHaveLength(1);
      expect(parseIntervalOrInequality('(2, 2)', 'x')).toHaveLength(0);
      expect(() =>
        normaliseIntervalUnion([{ low: parseEndpoint('-inf'), lowInclusive: true, high: parseEndpoint('2'), highInclusive: false }]),
      ).toThrow(/infinity/i);
    });
  });

  describe('8. Security, Pilot Fixture Validation, UI & Performance Percentiles', () => {
    it('blocks expansion bombs, deep nesting, prototype pollution, oversized strings, and defeats sin(pi*x) trap', () => {
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
      expect(() => parseUnitExpression('m/s/s')).toThrow(/Ambiguous/i);

      const budget = new EvalOpBudget();
      expect(
        checkBoundedNumericAgreement(
          parseEvalExpr('sin(pi*x)', { allowedVariables: ['x'] }).ast,
          parseEvalExpr('0', { allowedVariables: ['x'] }).ast,
          ['x'],
          budget,
        ).agreed,
      ).toBe(false);
    });

    it('validates all 15 slides (19 activities) in step5a-math-evaluator-pilot.json under production-compatible math-evaluator 1.0.0', () => {
      const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step5a-math-evaluator-pilot.json');
      const lesson = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as {
        lessonId: string;
        slides: Array<{ id: string; interactive?: unknown[] }>;
      };
      expect(lesson.slides).toHaveLength(15);
      expect(lesson.slides.reduce((acc, s) => acc + (s.interactive?.length ?? 0), 0)).toBe(19);
      expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: true })).not.toThrow();
      expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: false })).not.toThrow();
    });

    it('supports keypad insertion, live AST preview, multi-activity isolation, and Low-Data Mode', () => {
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

      fireEvent.click(screen.getAllByRole('button', { name: 'Check answer' })[0]);
      expect(screen.getByText(/exact algebraic equivalence confirmed/i)).toBeTruthy();
      expect(inputB.value).toBe('');

      fireEvent.click(screen.getAllByRole('button', { name: 'Show math keypad' })[1]);
      fireEvent.click(screen.getByRole('button', { name: 'Insert fraction slash' }));
      expect(inputB.value).toBe('/');

      render(
        <InteractiveEngineRegistry
          lesson={{ lessonId: 'step5a-test' } as never}
          slide={{ id: 'me-s01', interactive: cfgB } as never}
          lowDataMode={true}
        />,
      );
      expect(screen.getByText('3/4')).toBeTruthy();
    });

    it('meets performance budgets (median, avg, p95) on representative and degree-6 maximum-bound cases', () => {
      const repTimes: number[] = [];
      for (let i = 0; i < 200; i++) {
        const t = performance.now();
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: '2x + 6', requiredForm: 'expanded-polynomial' },
          { expression: '2x + 6' },
        );
        repTimes.push(performance.now() - t);
      }
      repTimes.sort((a, b) => a - b);

      // Max-bound degree 6 binomial expansion (7 terms, exact BigInt polynomial)
      const maxTimes: number[] = [];
      for (let i = 0; i < 100; i++) {
        const t = performance.now();
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x', 'y'], expectedExpr: '(x + y)^6', verificationPolicy: 'exact-only' },
          { expression: 'x^6 + 6x^5y + 15x^4y^2 + 20x^3y^3 + 15x^2y^4 + 6xy^5 + y^6' },
        );
        maxTimes.push(performance.now() - t);
      }
      maxTimes.sort((a, b) => a - b);

      const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
      console.log(
        `STEP5A_PERF_DETAIL: rep(avg=${avg(repTimes).toFixed(4)}ms, p50=${repTimes[100].toFixed(4)}ms, p95=${repTimes[190].toFixed(4)}ms) | max_deg6(avg=${avg(maxTimes).toFixed(4)}ms, p50=${maxTimes[50].toFixed(4)}ms, p95=${maxTimes[95].toFixed(4)}ms)`,
      );

      expect(avg(repTimes)).toBeLessThan(2);
      expect(avg(maxTimes)).toBeLessThan(15);
    });
  });

  describe('9. Rounding & Precision Reference Cases', () => {
    it('rounds 9.995 -> 10.00 (half-up), -2.5 -> -3, half-even ties, and inspects raw sig figs', () => {
      expect(roundBigRatToDecimalPlaces(decimalStringToBigRat('9.995'), 2, 'half-up').formatted).toBe('10.00');
      expect(roundBigRatToDecimalPlaces(decimalStringToBigRat('-2.5'), 0, 'half-up').formatted).toBe('-3');
      expect(roundBigRatToDecimalPlaces(decimalStringToBigRat('2.5'), 0, 'half-even').formatted).toBe('2');
      expect(roundBigRatToDecimalPlaces(decimalStringToBigRat('3.5'), 0, 'half-even').formatted).toBe('4');
      expect(inspectRawNumericPrecision('0.0450').sigFigs).toBe(3);
      expect(inspectRawNumericPrecision('12.00').sigFigs).toBe(4);
      expect(inspectRawNumericPrecision('3.00e8')).toMatchObject({ sigFigs: 3, isNormalisedScientific: true });
      expect(inspectRawNumericPrecision('30e7')).toMatchObject({ isScientific: true, isNormalisedScientific: false });
      expect(inspectRawNumericPrecision('1200').ambiguousTrailingZeros).toBe(true);
      expect(inspectRawNumericPrecision('0.00').sigFigs).toBe(2);
    });
  });

  describe('10. Step 5A.1 Mandatory Independent Domain, Verification Policy & Calculus Domain Suite', () => {
    it('rejects x vs x²/x, 1 vs x/x, x+3 vs (x²-9)/(x-3), and 1/(1/x) vs x over all reals, and accepts them under explicit exclusion assumptions', () => {
      // 1. x vs x^2/x over all R -> REJECTED
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: 'x' },
          { expression: 'x^2 / x' },
        ),
      ).toMatchObject({ passed: false, verdict: 'incorrect' });

      // 2. 1 vs x/x over all R -> REJECTED
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: '1' },
          { expression: 'x / x' },
        ),
      ).toMatchObject({ passed: false, verdict: 'incorrect' });

      // 3. Same expressions under explicit x != 0 assumption -> ACCEPTED
      expect(
        evaluateMathSubmission(
          {
            mode: 'algebraic-expression',
            variables: ['x'],
            expectedExpr: 'x',
            domainRestrictions: { variableAssumptions: { x: 'nonzero' } },
          },
          { expression: 'x^2 / x' },
        ),
      ).toMatchObject({ passed: true, verdict: 'exact-equivalent' });

      expect(
        evaluateMathSubmission(
          {
            mode: 'algebraic-expression',
            variables: ['x'],
            expectedExpr: '1',
            domainRestrictions: { expectedExcluded: ['0'] },
          },
          { expression: 'x / x' },
        ),
      ).toMatchObject({ passed: true, verdict: 'exact-equivalent' });

      // 4. x + 3 vs (x^2 - 9)/(x - 3) over all R -> REJECTED
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: 'x + 3' },
          { expression: '(x^2 - 9)/(x - 3)' },
        ),
      ).toMatchObject({ passed: false, verdict: 'incorrect' });

      // 5. Simplification of (x^2 - 9)/(x - 3) with x != 3 preserved -> ACCEPTED, extra exclusion rejected, extra removable discontinuity rejected
      const simpSpec: MathAlgebraicExpressionSpec = {
        mode: 'algebraic-expression',
        variables: ['x'],
        sourceExpr: '(x^2 - 9)/(x - 3)',
        expectedExpr: 'x + 3',
        domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['3'] },
      };
      expect(evaluateMathSubmission(simpSpec, { expression: 'x + 3', domainInput: 'x != 3' }).passed).toBe(true);
      expect(evaluateMathSubmission(simpSpec, { expression: 'x + 3', domainInput: 'x != 3, x != 0' }).passed).toBe(false);
      // Learner introduces an additional removable discontinuity at x = 0 inside D_req = R \ {3}
      expect(
        evaluateMathSubmission(simpSpec, { expression: '(x + 3)*x/x', domainInput: 'x != 3' }),
      ).toMatchObject({ passed: false, verdict: 'incorrect' });

      // 6. 1/(1/x) vs x over all R -> REJECTED; under x != 0 -> ACCEPTED
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: 'x' },
          { expression: '1/(1/x)' },
        ),
      ).toMatchObject({ passed: false, verdict: 'incorrect' });
      expect(
        evaluateMathSubmission(
          {
            mode: 'algebraic-expression',
            variables: ['x'],
            expectedExpr: 'x',
            domainRestrictions: { variableAssumptions: { x: 'nonzero' } },
          },
          { expression: '1/(1/x)' },
        ),
      ).toMatchObject({ passed: true, verdict: 'exact-equivalent' });
    });

    it('enforces exact logarithmic, radical, constant-undefined (0/0), and multivariate denominator domain rules', () => {
      // ln(x^2) vs 2*ln(x) over all R -> REJECTED (domains R\{0} vs (0,inf))
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: 'ln(x^2)' },
          { expression: '2*ln(x)' },
        ),
      ).toMatchObject({ passed: false, verdict: 'incorrect' });

      // ln(x^2) vs 2*ln|x| on x != 0 -> ACCEPTED (both have domain R\{0} and ln(|x|^2) = ln(x^2))
      expect(
        evaluateMathSubmission(
          {
            mode: 'algebraic-expression',
            variables: ['x'],
            expectedExpr: 'ln(x^2)',
            domainRestrictions: { variableAssumptions: { x: 'nonzero' } },
          },
          { expression: '2*ln(abs(x))' },
        ),
      ).toMatchObject({ passed: true, verdict: 'symbolic-domain-equivalent' });

      // sqrt(x^2) vs x over all R -> REJECTED; sqrt(x^2) vs abs(x) -> ACCEPTED
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: 'sqrt(x^2)' },
          { expression: 'x' },
        ),
      ).toMatchObject({ passed: false, verdict: 'incorrect' });
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: 'sqrt(x^2)' },
          { expression: 'abs(x)' },
        ),
      ).toMatchObject({ passed: true, verdict: 'symbolic-domain-equivalent' });

      // Undefined constant 0/0 -> REJECTED (never passed!)
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: '1' },
          { expression: '0/0' },
        ).passed,
      ).toBe(false);
      expect(
        evaluateMathSubmission(
          { mode: 'numeric-quantity', expectedValue: '1' },
          { expression: '0/0' },
        ).passed,
      ).toBe(false);

      // Unsupported multivariate denominator domain -> unsupported-or-indeterminate (even without sourceExpr!)
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x', 'y'], expectedExpr: 'x + y' },
          { expression: '(x^2 - y^2)/(x - y)' },
        ),
      ).toMatchObject({ passed: false, verdict: 'unsupported-or-indeterminate' });
    });

    it('enforces verificationPolicy (exact-only vs exact-or-symbolic vs allow-bounded-numeric) and calculus domain preservation', () => {
      // exact-only MUST NOT accept symbolic-domain-equivalent trig/log identities
      expect(
        evaluateMathSubmission(
          { mode: 'algebraic-expression', variables: ['x'], expectedExpr: '1', verificationPolicy: 'exact-only' },
          { expression: 'sin(x)^2 + cos(x)^2' },
        ),
      ).toMatchObject({ passed: false, verdict: 'unsupported-or-indeterminate' });

      // Calculus derivative: d/dx(x^2) = 2x; learner writing 2x^2/x introduces undefined point at x=0 -> REJECTED
      expect(
        evaluateMathSubmission(
          { mode: 'calculus-check', variable: 'x', calculusKind: 'derivative', sourceExpr: 'x^2', expectedExpr: '2x' },
          { expression: '2x^2 / x' },
        ),
      ).toMatchObject({ passed: false, verdict: 'incorrect' });

      // Calculus antiderivative: integral of 2x is x^2 + C; learner writing x^2 + x/x - 1 + C narrows domain -> REJECTED
      expect(
        evaluateMathSubmission(
          {
            mode: 'calculus-check',
            variable: 'x',
            calculusKind: 'antiderivative',
            sourceExpr: '2x',
            expectedExpr: 'x^2 + C',
            requireConstantOfIntegration: true,
          },
          { expression: 'x^2 + x/x - 1 + C' },
        ),
      ).toMatchObject({ passed: false, verdict: 'incorrect' });

      // Generated independent parametric domain family: k in [-5..5]
      for (let k = -5; k <= 5; k++) {
        const factor = k === 0 ? 'x' : k > 0 ? `(x - ${k})` : `(x + ${-k})`;
        const withHole = `((x + 1)*${factor})/${factor}`;
        // Over all reals: MUST FAIL (removable discontinuity at x = k)
        expect(
          evaluateMathSubmission(
            { mode: 'algebraic-expression', variables: ['x'], expectedExpr: 'x + 1' },
            { expression: withHole },
          ).passed,
        ).toBe(false);
        // Under explicit x != k: MUST PASS
        expect(
          evaluateMathSubmission(
            {
              mode: 'algebraic-expression',
              variables: ['x'],
              expectedExpr: 'x + 1',
              domainRestrictions: { expectedExcluded: [String(k)] },
            },
            { expression: withHole },
          ),
        ).toMatchObject({ passed: true, verdict: 'exact-equivalent' });
      }
    });
  });

  describe('10. Step 5A.1 Final Acceptance Refinements — Simplification Authoring & Calculus Domains', () => {
    const baseAlg = {
      id: 'ref-alg-1',
      engine: 'math-evaluator',
      schemaVersion: 1,
      minEngineVersion: '1.0.0',
      title: 'Simplification Authoring Check',
      instructions: 'Simplify the expression.',
      accessibilityLabel: 'Simplification check',
      fallbackText: 'Simplify the algebraic expression.',
      curriculumLevel: 'igcse',
      mode: 'algebraic-expression',
      variables: ['x'],
    } as const;

    it('rejects inconsistent source/reference, empty required domains, extra reference holes, and invalid learner-domain requirements at authoring time', () => {
      // 1. Inconsistent source and reference
      expect(
        validateSlideInteractiveConfig({
          ...baseAlg,
          sourceExpr: '(x^2 - 9)/(x - 3)',
          expectedExpr: 'x + 4',
        }).errors.some((e) => /not mathematically equivalent/i.test(e)),
      ).toBe(true);

      // 2. Empty / contradictory required source domain
      expect(
        validateSlideInteractiveConfig({
          ...baseAlg,
          sourceExpr: 'ln(x - 5)',
          expectedExpr: 'ln(x - 5)',
          domainRestrictions: { expectedDomainInterval: 'x < 2' },
        }).errors.some((e) => /empty or contradictory/i.test(e)),
      ).toBe(true);

      // 3. Reference introduces additional undefined point inside D_req
      expect(
        validateSlideInteractiveConfig({
          ...baseAlg,
          sourceExpr: '(x^2 - 9)/(x - 3)',
          expectedExpr: '(x + 3)*x/x',
        }).errors.some((e) => /additional undefined points/i.test(e)),
      ).toBe(true);

      // 4. requireLearnerDomain: true without expectedExcluded or expectedDomainInterval
      expect(
        validateSlideInteractiveConfig({
          ...baseAlg,
          sourceExpr: '(x^2 - 9)/(x - 3)',
          expectedExpr: 'x + 3',
          domainRestrictions: { requireLearnerDomain: true },
        }).errors.some((e) => /at least one of expectedExcluded or expectedDomainInterval/i.test(e)),
      ).toBe(true);

      // 5. Valid simplification authoring config passes with 0 errors
      expect(
        validateSlideInteractiveConfig({
          ...baseAlg,
          sourceExpr: '(x^2 - 9)/(x - 3)',
          expectedExpr: 'x + 3',
          domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['3'] },
        }).errors,
      ).toEqual([]);

      // 6. Runtime guards against reference expression with extra undefined point inside D_req
      expect(
        evaluateMathSubmission(
          {
            mode: 'algebraic-expression',
            variables: ['x'],
            sourceExpr: '(x^2 - 9)/(x - 3)',
            expectedExpr: '(x + 3)*x/x',
          },
          { expression: 'x + 3' },
        ),
      ).toMatchObject({ passed: false, verdict: 'unsupported-or-indeterminate' });
    });

    it('accepts simplified derivative d/dx(x/x) = 0 while preserving optional learner restrictions and rejecting extra derivative holes', () => {
      // d/dx(x/x) -> 0 passes (D_req = R \ {0} subset of D_lrn = R)
      expect(
        evaluateMathSubmission(
          {
            mode: 'calculus-check',
            variable: 'x',
            calculusKind: 'derivative',
            sourceExpr: 'x/x',
            expectedExpr: '0',
          },
          { expression: '0' },
        ),
      ).toMatchObject({ passed: true, verdict: 'exact-equivalent' });

      // d/dx(x/x) -> 0 with requireLearnerDomain: true requires x != 0
      expect(
        evaluateMathSubmission(
          {
            mode: 'calculus-check',
            variable: 'x',
            calculusKind: 'derivative',
            sourceExpr: 'x/x',
            expectedExpr: '0',
            domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['0'] },
          },
          { expression: '0' },
        ),
      ).toMatchObject({ passed: false, verdict: 'wrong-form' });

      expect(
        evaluateMathSubmission(
          {
            mode: 'calculus-check',
            variable: 'x',
            calculusKind: 'derivative',
            sourceExpr: 'x/x',
            expectedExpr: '0',
            domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['0'] },
          },
          { expression: '0', domainInput: 'x != 0' },
        ),
      ).toMatchObject({ passed: true, verdict: 'exact-equivalent' });

      // d/dx(x^2) -> 2*x^2/x STILL FAILS (introduces hole at x = 0 inside R)
      expect(
        evaluateMathSubmission(
          {
            mode: 'calculus-check',
            variable: 'x',
            calculusKind: 'derivative',
            sourceExpr: 'x^2',
            expectedExpr: '2x',
          },
          { expression: '2*x^2/x' },
        ),
      ).toMatchObject({ passed: false, verdict: 'incorrect' });

      // d/dx(ln(x)) -> 1/x passes (D_req = (0, +inf) subset of R \ {0}), while 1/x + 0/(x - 1) fails
      expect(
        evaluateMathSubmission(
          {
            mode: 'calculus-check',
            variable: 'x',
            calculusKind: 'derivative',
            sourceExpr: 'ln(x)',
            expectedExpr: '1/x',
          },
          { expression: '1/x' },
        ),
      ).toMatchObject({ passed: true, verdict: 'exact-equivalent' });

      expect(
        evaluateMathSubmission(
          {
            mode: 'calculus-check',
            variable: 'x',
            calculusKind: 'derivative',
            sourceExpr: 'ln(x)',
            expectedExpr: '1/x',
          },
          { expression: '1/x + 0/(x - 1)' },
        ),
      ).toMatchObject({ passed: false, verdict: 'incorrect' });

      // Authoring validation rejects derivative expectedExpr introducing extra undefined points
      expect(
        validateSlideInteractiveConfig({
          id: 'ref-calc-1',
          engine: 'math-evaluator',
          schemaVersion: 1,
          minEngineVersion: '1.0.0',
          title: 'Derivative Authoring Check',
          instructions: 'Differentiate x^2.',
          accessibilityLabel: 'Derivative check',
          fallbackText: 'Differentiate x^2.',
          curriculumLevel: 'as-a-level',
          mode: 'calculus-check',
          variable: 'x',
          calculusKind: 'derivative',
          sourceExpr: 'x^2',
          expectedExpr: '2*x^2/x',
        }).errors.some((e) => /additional undefined points/i.test(e)),
      ).toBe(true);
    });

    it('renders and submits domain restriction input for algebraic-expression and calculus-check (when required), hides it when not required, and clears it on Reset', () => {
      const algDomCfg: MathEvaluatorInteractiveConfig = {
        id: 'ui-alg-dom',
        engine: 'math-evaluator',
        schemaVersion: 1,
        minEngineVersion: '1.0.0',
        curriculumLevel: 'igcse',
        mode: 'algebraic-expression',
        title: 'Rational Domain UI',
        instructions: 'Simplify (x^2 - 9)/(x - 3) and state x != 3.',
        accessibilityLabel: 'Rational Domain UI',
        fallbackText: 'x + 3, x != 3',
        variables: ['x'],
        sourceExpr: '(x^2 - 9)/(x - 3)',
        expectedExpr: 'x + 3',
        domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['3'] },
      };

      const calcDomCfg: MathEvaluatorInteractiveConfig = {
        id: 'ui-calc-dom',
        engine: 'math-evaluator',
        schemaVersion: 1,
        minEngineVersion: '1.0.0',
        curriculumLevel: 'as-a-level',
        mode: 'calculus-check',
        title: 'Derivative Domain UI',
        instructions: 'Differentiate x/x and state x != 0.',
        accessibilityLabel: 'Derivative Domain UI',
        fallbackText: '0, x != 0',
        variable: 'x',
        calculusKind: 'derivative',
        sourceExpr: 'x/x',
        expectedExpr: '0',
        domainRestrictions: { requireLearnerDomain: true, expectedExcluded: ['0'] },
      };

      const calcPlainCfg: MathEvaluatorInteractiveConfig = {
        id: 'ui-calc-plain',
        engine: 'math-evaluator',
        schemaVersion: 1,
        minEngineVersion: '1.0.0',
        curriculumLevel: 'as-a-level',
        mode: 'calculus-check',
        title: 'Plain Derivative UI',
        instructions: 'Differentiate 3x^2.',
        accessibilityLabel: 'Plain Derivative UI',
        fallbackText: '6x',
        variable: 'x',
        calculusKind: 'derivative',
        sourceExpr: '3x^2',
        expectedExpr: '6x',
      };

      render(
        <div>
          <MathEvaluatorEngine config={algDomCfg} />
          <MathEvaluatorEngine config={calcDomCfg} />
          <MathEvaluatorEngine config={calcPlainCfg} />
        </div>,
      );

      // 1. Algebraic-expression domain input appears & submits correctly
      const algExprInput = screen.getByLabelText('Rational Domain UI answer input') as HTMLInputElement;
      const algDomInput = screen.getByLabelText('Rational Domain UI domain restriction input') as HTMLInputElement;
      const checkButtons = screen.getAllByRole('button', { name: 'Check answer' });
      const resetButtons = screen.getAllByRole('button', { name: 'Reset answer' });

      fireEvent.change(algExprInput, { target: { value: 'x + 3' } });
      fireEvent.change(algDomInput, { target: { value: 'x != 3' } });
      fireEvent.click(checkButtons[0]);
      expect(screen.getByText(/exact algebraic equivalence confirmed/i)).toBeTruthy();

      // 2. Calculus-check domain input appears ONLY when requireLearnerDomain is enabled
      const calcExprInput = screen.getByLabelText('Derivative Domain UI answer input') as HTMLInputElement;
      const calcDomInput = screen.getByLabelText('Derivative Domain UI domain restriction input') as HTMLInputElement;
      expect(screen.queryByLabelText('Plain Derivative UI domain restriction input')).toBeNull();

      // 3. Missing required restriction receives appropriate feedback
      fireEvent.change(calcExprInput, { target: { value: '0' } });
      fireEvent.click(checkButtons[1]);
      expect(screen.getByText(/must also state the domain restriction/i)).toBeTruthy();

      // 4. Incorrect required restriction receives appropriate feedback
      fireEvent.change(calcDomInput, { target: { value: 'x != 1' } });
      fireEvent.click(checkButtons[1]);
      expect(screen.getByText(/Check your excluded value\(s\)/i)).toBeTruthy();

      // 5. Correct learner domain restriction is submitted and passes
      fireEvent.change(calcDomInput, { target: { value: 'x != 0' } });
      fireEvent.click(checkButtons[1]);
      expect(screen.getByText(/exact symbolic derivative confirmed/i)).toBeTruthy();

      // 6. Reset clears the domain input, expression input, and previous feedback
      fireEvent.click(resetButtons[1]);
      expect(calcExprInput.value).toBe('');
      expect(calcDomInput.value).toBe('');
      expect(screen.queryByText(/exact symbolic derivative confirmed/i)).toBeNull();
    });
  });
});
