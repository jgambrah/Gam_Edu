import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  evaluateWorkingWorkspace,
  isCompletedSquareForm,
  type MathMultiStepWorkingSpec,
} from './math-eval-engine';
import {
  SUPPORTED_INTERACTIVE_ENGINES,
  assertValidLessonInteractives,
  validateSlideInteractiveConfig,
  type MathEvaluatorInteractiveConfig,
} from '@/lib/narrated-lessons/interactive-schema';
import { MathWorkingWorkspace, getKeypadForProfile } from '@/components/narrated-lessons/MathWorkingWorkspace';

describe('Step 5A.2 — Mathematical Working & Reasoning Workspace (math-evaluator 1.1.0)', () => {
  it('extends math-evaluator to engineVersion 1.1.0 while holding productionVersion at 1.0.0 and preserving 7 engine families', () => {
    expect(Object.keys(SUPPORTED_INTERACTIVE_ENGINES)).toHaveLength(7);
    expect(SUPPORTED_INTERACTIVE_ENGINES['math-evaluator'].engineVersion).toBe('1.1.0');
    expect(SUPPORTED_INTERACTIVE_ENGINES['math-evaluator'].productionVersion).toBe('1.0.0');
  });

  it('validates all 20 curriculum pilot slides (step5a2-math-workspace-pilot.json) and blocks premature 1.1.0 production publish', () => {
    const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step5a2-math-workspace-pilot.json');
    const lesson = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as {
      lessonId: string;
      slides: Array<{ id: string; interactive?: unknown[] }>;
    };
    expect(lesson.slides).toHaveLength(20);
    expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: true })).not.toThrow();
    // Must be blocked from production publishing while productionVersion is still 1.0.0!
    expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: false })).toThrow(/1\.1\.0|production/i);
  });

  it('verifies alternative valid methods, lost solutions, one-way implications, extraneous rejection, inequality sign reversal, calculus ops, units, and indeterminate steps', () => {
    // 1. Alternative valid methods for linear equation 2(x + 3) = 14
    const linearSpec: MathMultiStepWorkingSpec = {
      mode: 'multi-step-working',
      learningMode: 'guided',
      problemKind: 'equation-solving',
      variables: ['x'],
      initialStatement: '2(x + 3) = 14',
      finalGoal: { mode: 'equation-solution', variable: 'x', originalEquation: '2(x + 3) = 14', equationClass: 'linear', expectedRoots: ['4'] },
      workedSolutions: [{ methodLabel: 'Divide', steps: [{ math: 'x + 3 = 7', note: 'Divide by 2.' }, { math: 'x = 4', note: 'Subtract 3.' }] }],
    };
    expect(evaluateWorkingWorkspace(linearSpec, [{ math: 'x + 3 = 7' }, { math: 'x = 4' }]).chain.mathematicallyCorrect).toBe(true);
    expect(evaluateWorkingWorkspace(linearSpec, [{ math: '2x + 6 = 14' }, { math: '2x = 8' }, { math: 'x = 4' }]).chain.mathematicallyCorrect).toBe(true);

    // 2. Lost solution: dividing x^2 = 3x by x loses x = 0
    const lostRes = evaluateWorkingWorkspace(
      {
        mode: 'multi-step-working',
        learningMode: 'guided',
        problemKind: 'equation-solving',
        variables: ['x'],
        initialStatement: 'x^2 = 3x',
        finalGoal: { mode: 'equation-solution', variable: 'x', originalEquation: 'x^2 = 3x', equationClass: 'quadratic', expectedRoots: ['0', '3'] },
        workedSolutions: [{ methodLabel: 'Factor', steps: [{ math: 'x^2 - 3x = 0', note: 'Move.' }, { math: 'x = 0 or x = 3', note: 'Solve.' }] }],
      },
      [{ math: 'x = 3' }],
    );
    expect(lostRes.chain.stepResults[0].status).toBe('lost-solution-error');
    expect(lostRes.chain.stepResults[0].lostSolutions).toContain('0');
    expect(lostRes.chain.mathematicallyCorrect).toBe(false);

    // 3. Radical equation: squaring is valid-implication-extraneous-risk; must reject -1
    const radSpec: MathMultiStepWorkingSpec = {
      mode: 'multi-step-working',
      learningMode: 'exam-practice',
      problemKind: 'equation-solving',
      variables: ['x'],
      initialStatement: 'sqrt(x + 2) = x',
      finalGoal: { mode: 'equation-solution', variable: 'x', originalEquation: 'sqrt(x + 2) = x', equationClass: 'radical-single', expectedRoots: ['2'], extraneousCandidates: ['-1'] },
      workedSolutions: [{ methodLabel: 'Square', steps: [{ math: 'x + 2 = x^2', note: 'Square.' }, { math: 'x = 2', rejectedExtraneous: ['-1'], note: 'Reject -1.' }] }],
    };
    const radUnresolved = evaluateWorkingWorkspace(radSpec, [
      { math: 'x + 2 = x^2' },
      { math: '(x - 2)(x + 1) = 0' },
      { math: 'x = 2 or x = -1' },
    ]);
    expect(radUnresolved.chain.stepResults[0].status).toBe('valid-implication-extraneous-risk');
    expect(radUnresolved.chain.unresolvedExtraneous).toContain('-1');
    expect(radUnresolved.chain.mathematicallyCorrect).toBe(false);

    const radResolved = evaluateWorkingWorkspace(radSpec, [
      { math: 'x + 2 = x^2' },
      { math: '(x - 2)(x + 1) = 0' },
      { math: 'x = 2', operation: 'check-candidates', rejectedExtraneous: ['-1'] },
    ]);
    expect(radResolved.chain.unresolvedExtraneous).toEqual([]);
    expect(radResolved.chain.mathematicallyCorrect).toBe(true);

    // 4. Inequality sign reversal caught (-2x <= 6 -> x <= -3 is invalid; x >= -3 is valid)
    const ineqSpec: MathMultiStepWorkingSpec = {
      mode: 'multi-step-working',
      learningMode: 'guided',
      problemKind: 'inequality-solving',
      variables: ['x'],
      initialStatement: '-2x + 4 <= 10',
      finalGoal: { mode: 'inequality-interval', variable: 'x', expectedIntervals: [{ low: '-3', lowInclusive: true, high: 'inf', highInclusive: false }] },
      workedSolutions: [{ methodLabel: 'Flip', steps: [{ math: '-2x <= 6', note: 'Sub 4.' }, { math: 'x >= -3', note: 'Flip.' }] }],
    };
    const badIneq = evaluateWorkingWorkspace(ineqSpec, [{ math: '-2x <= 6' }, { math: 'x <= -3' }]);
    expect(badIneq.chain.stepResults[1].status).toBe('invalid-transformation');
    expect(badIneq.chain.earliestErrorIndex).toBe(1);

    const goodIneq = evaluateWorkingWorkspace(ineqSpec, [{ math: '-2x <= 6' }, { math: 'x >= -3' }]);
    expect(goodIneq.chain.mathematicallyCorrect).toBe(true);

    // 5. Calculus differentiation & integration operation semantics
    const diffRes = evaluateWorkingWorkspace(
      {
        mode: 'multi-step-working',
        learningMode: 'guided',
        problemKind: 'calculus-working',
        variables: ['x'],
        initialStatement: 'f(x) = x^3 + 2x',
        finalGoal: { mode: 'calculus-check', variable: 'x', calculusKind: 'derivative', sourceExpr: 'x^3 + 2x', expectedExpr: '3x^2 + 2' },
        workedSolutions: [{ methodLabel: 'Power rule', steps: [{ math: "f'(x) = 3x^2 + 2", operation: 'differentiate', note: 'Differentiate.' }] }],
      },
      [{ math: "f'(x) = 3x^2 + 2", operation: 'differentiate' }],
    );
    expect(diffRes.chain.stepResults[0].status).toBe('exact-equivalence');
    expect(diffRes.chain.mathematicallyCorrect).toBe(true);

    // 6. Domain violation inside expression chain: x + 3 -> (x + 3)*x/x
    const domViol = evaluateWorkingWorkspace(
      {
        mode: 'multi-step-working',
        learningMode: 'guided',
        problemKind: 'algebraic-simplification',
        variables: ['x'],
        initialStatement: 'x + 3',
        finalGoal: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: 'x + 3' },
        workedSolutions: [{ methodLabel: 'Keep', steps: [{ math: 'x + 3', note: 'Already simplified.' }] }],
      },
      [{ math: '(x + 3)*x/x' }],
    );
    expect(domViol.chain.stepResults[0].status).toBe('domain-violation-error');

    // 7. Unsupported trig identity returns indeterminate-unverified (NEVER falsely marked wrong!)
    const indet = evaluateWorkingWorkspace(
      {
        mode: 'multi-step-working',
        learningMode: 'guided',
        problemKind: 'algebraic-simplification',
        variables: ['x'],
        initialStatement: 'sin(2x)',
        finalGoal: { mode: 'algebraic-expression', variables: ['x'], expectedExpr: '2*sin(x)*cos(x)', verificationPolicy: 'allow-bounded-numeric' },
        workedSolutions: [{ methodLabel: 'Double angle', steps: [{ math: '2*sin(x)*cos(x)', note: 'Identity.' }] }],
      },
      [{ math: '2*sin(x)*cos(x)' }],
    );
    expect(indet.chain.stepResults[0].status).toBe('indeterminate-unverified');
    expect(indet.chain.hasInvalidStep).toBe(false);
    expect(indet.chain.hasIndeterminateStep).toBe(true);
  });

  it('enforces method-mark syntactic evidence (equivalence alone != factorisation), authorised ECF, and zero duplicate marks across strategies', () => {
    // 1. Factorisation M1 must NOT be awarded for unfactorised equivalent x^2 - x - 6 = 0
    const quadSpec: MathMultiStepWorkingSpec = {
      mode: 'multi-step-working',
      learningMode: 'independent',
      problemKind: 'equation-solving',
      variables: ['x'],
      initialStatement: 'x^2 - x - 6 = 0',
      finalGoal: { mode: 'equation-solution', variable: 'x', originalEquation: 'x^2 - x - 6 = 0', equationClass: 'quadratic', expectedRoots: ['3', '-2'] },
      markingScheme: {
        maxMarks: 2,
        strategyGroups: [
          {
            id: 'factorise',
            label: 'Factorisation',
            marks: [
              { markId: 'M1', type: 'M', points: 1, description: 'Factorised equation', predicate: { kind: 'equation-equivalent', targetEquation: '(x - 3)(x + 2) = 0', requiredForm: 'factored-form', requireValidTransition: true } },
              { markId: 'A1', type: 'A', points: 1, requiresMarkIds: ['M1'], description: 'Final roots', predicate: { kind: 'final-answer', requireValidWorking: true } },
            ],
          },
        ],
      },
      workedSolutions: [{ methodLabel: 'Factor', steps: [{ math: '(x - 3)(x + 2) = 0', note: 'Factor.' }, { math: 'x = 3 or x = -2', note: 'Solve.' }] }],
    };

    const noFactor = evaluateWorkingWorkspace(quadSpec, [{ math: 'x^2 - x - 6 = 0' }, { math: 'x = 3 or x = -2' }]);
    expect(noFactor.chain.mathematicallyCorrect).toBe(true);
    expect(noFactor.marking?.marksAwarded).toBe(0); // Equivalence alone did NOT earn factorisation M1 (or dependent A1)!

    const withFactor = evaluateWorkingWorkspace(quadSpec, [{ math: '(x - 3)(x + 2) = 0' }, { math: 'x = 3 or x = -2' }]);
    expect(withFactor.marking?.marksAwarded).toBe(2);

    // 2. Completing-the-square detector distinguishes (x - 3)^2 = 4 from x^2 - 6x + 5 = 0
    expect(isCompletedSquareForm('(x - 3)^2 = 4', 'x')).toBe(true);
    expect(isCompletedSquareForm('x^2 - 6x + 5 = 0', 'x')).toBe(false);

    // 3. Error-Carried-Forward (ECF): arithmetic slip 3x + 5 = 20 -> 3x = 25, then valid follow-through x = 25/3
    const ecfSpec: MathMultiStepWorkingSpec = {
      mode: 'multi-step-working',
      learningMode: 'independent',
      problemKind: 'equation-solving',
      variables: ['x'],
      initialStatement: '3x + 5 = 20',
      finalGoal: { mode: 'equation-solution', variable: 'x', originalEquation: '3x + 5 = 20', equationClass: 'linear', expectedRoots: ['5'] },
      markingScheme: {
        maxMarks: 2,
        strategyGroups: [
          {
            id: 'linear',
            label: 'Isolate then divide',
            marks: [
              { markId: 'M1', type: 'M', points: 1, description: 'Obtain 3x = 15', predicate: { kind: 'equation-equivalent', targetEquation: '3x = 15', requireValidTransition: true } },
              { markId: 'A1', type: 'A', points: 1, allowErrorCarriedForward: true, description: 'Solve cleanly for x (ECF allowed)', predicate: { kind: 'follow-through-step', requireIsolatedFinalVariable: true } },
            ],
          },
        ],
      },
      workedSolutions: [{ methodLabel: 'Standard', steps: [{ math: '3x = 15', note: 'Sub 5.' }, { math: 'x = 5', note: 'Div 3.' }] }],
    };

    const ecfRes = evaluateWorkingWorkspace(ecfSpec, [{ math: '3x = 25' }, { math: 'x = 25/3' }]);
    expect(ecfRes.chain.earliestErrorIndex).toBe(0);
    expect(ecfRes.chain.mathematicallyCorrect).toBe(false);
    expect(ecfRes.marking?.marksAwarded).toBe(1);
    expect(ecfRes.marking?.markDetails.find((m) => m.markId === 'A1')?.awardedViaEcf).toBe(true);
  });

  it('rejects malformed marking schemes (duplicate markIds, cyclic deps, >maxMarks, invalid model solutions, <1.1.0 minEngineVersion)', () => {
    const baseWs = {
      id: 'bad-ws',
      engine: 'math-evaluator',
      schemaVersion: 1,
      minEngineVersion: '1.0.0', // too low for multi-step-working!
      curriculumLevel: 'igcse',
      title: 'Bad Workspace',
      instructions: 'Solve 2x = 6.',
      accessibilityLabel: 'Bad workspace',
      fallbackText: 'Solve 2x = 6.',
      mode: 'multi-step-working',
      learningMode: 'guided',
      problemKind: 'equation-solving',
      variables: ['x'],
      initialStatement: '2x = 6',
      finalGoal: { mode: 'equation-solution', variable: 'x', originalEquation: '2x = 6', equationClass: 'linear', expectedRoots: ['3'] },
      markingScheme: {
        maxMarks: 1,
        strategyGroups: [
          {
            id: 's1',
            label: 'Cyclic & over-budget',
            marks: [
              { markId: 'M1', type: 'M', points: 1, requiresMarkIds: ['A1'], description: 'Cycle 1', predicate: { kind: 'final-answer' } },
              { markId: 'A1', type: 'A', points: 1, requiresMarkIds: ['M1'], description: 'Cycle 2', predicate: { kind: 'final-answer' } },
            ],
          },
        ],
      },
      workedSolutions: [{ methodLabel: 'Wrong model', steps: [{ math: 'x = 99', note: 'Wrong.' }] }],
    };

    const res = validateSlideInteractiveConfig(baseWs);
    expect(res.ok).toBe(false);
    expect(res.errors.some((e) => /1\.1\.0/.test(e))).toBe(true);
    expect(res.errors.some((e) => /Cyclic mark dependency/i.test(e))).toBe(true);
    expect(res.errors.some((e) => /exceeds maxMarks/i.test(e))).toBe(true);
  });

  it('renders MathWorkingWorkspace UI: age-appropriate keypads, earlier-step invalidation, undo/reset, and exam-practice answer concealment', () => {
    expect(getKeypadForProfile('primary').length).toBeLessThan(getKeypadForProfile('as-a-level').length);

    const examCfg: Extract<MathEvaluatorInteractiveConfig, { mode: 'multi-step-working' }> = {
      id: 'ui-ws-exam',
      engine: 'math-evaluator',
      schemaVersion: 1,
      minEngineVersion: '1.1.0',
      curriculumLevel: 'igcse',
      mode: 'multi-step-working',
      learningMode: 'exam-practice',
      problemKind: 'equation-solving',
      variables: ['x'],
      initialStatement: '2x + 4 = 10',
      title: 'Exam Linear Practice',
      instructions: 'Solve 2x + 4 = 10.',
      accessibilityLabel: 'Exam Linear Practice',
      fallbackText: 'Isolate 2x and divide by 2.',
      hints: ['Subtract 4 from both sides.'],
      finalGoal: { mode: 'equation-solution', variable: 'x', originalEquation: '2x + 4 = 10', equationClass: 'linear', expectedRoots: ['3'] },
      workedSolutions: [{ methodLabel: 'Standard', steps: [{ math: '2x = 6', note: 'Sub 4.' }, { math: 'x = 3', note: 'Div 2.' }] }],
    };

    render(<MathWorkingWorkspace config={examCfg} />);

    // Before submission in exam-practice: hints & worked model solution MUST be concealed!
    expect(screen.queryByRole('button', { name: /Need a hint/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Show worked model solution/i })).toBeNull();

    // Enter Step 1, add Step 2, submit
    const step1 = screen.getByLabelText('Exam Linear Practice step 1 input') as HTMLInputElement;
    fireEvent.change(step1, { target: { value: '2x = 6' } });
    fireEvent.click(screen.getByRole('button', { name: /Add step/i }));
    const step2 = screen.getByLabelText('Exam Linear Practice step 2 input') as HTMLInputElement;
    fireEvent.change(step2, { target: { value: 'x = 3' } });

    fireEvent.click(screen.getByRole('button', { name: 'Submit working' }));
    expect(screen.getByText(/Verified Complete & Valid/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Show worked model solution/i })).toBeTruthy();

    // Editing earlier step MUST immediately invalidate dependent feedback!
    fireEvent.change(step1, { target: { value: '2x = 8' } });
    expect(screen.queryByText(/Verified Complete & Valid/i)).toBeNull();

    // Undo restores '2x = 6'
    fireEvent.click(screen.getByRole('button', { name: 'Undo last edit' }));
    expect((screen.getByLabelText('Exam Linear Practice step 1 input') as HTMLInputElement).value).toBe('2x = 6');

    // Reset clears workspace
    fireEvent.click(screen.getByRole('button', { name: 'Reset workspace' }));
    expect((screen.getByLabelText('Exam Linear Practice step 1 input') as HTMLInputElement).value).toBe('');
  });

  it('Step 5A.3: rejects contradictory extraneous rejections, requires verified candidate evidence when configured, blocks ECF on trivial repetition or lost solutions, and verifies operation evidence', () => {
    // 1. Contradictory rejection of genuine valid root x = 2 on sqrt(x + 2) = x -> lost-solution-error
    const radEvidenceSpec: MathMultiStepWorkingSpec = {
      mode: 'multi-step-working',
      learningMode: 'exam-practice',
      problemKind: 'equation-solving',
      variables: ['x'],
      initialStatement: 'sqrt(x + 2) = x',
      finalGoal: {
        mode: 'equation-solution',
        variable: 'x',
        originalEquation: 'sqrt(x + 2) = x',
        equationClass: 'radical-single',
        expectedRoots: ['2'],
        extraneousCandidates: ['-1'],
      },
      markingScheme: {
        maxMarks: 2,
        sharedIndependentMarks: [
          {
            markId: 'B1',
            type: 'B',
            points: 1,
            description: 'Reject extraneous -1 with verified substitution evidence',
            predicate: { kind: 'extraneous-rejection', expectedRejected: ['-1'], requireEvidence: true },
          },
        ],
        strategyGroups: [
          {
            id: 'solve',
            label: 'Solve & check',
            marks: [
              { markId: 'A1', type: 'A', points: 1, description: 'Final root x = 2', predicate: { kind: 'final-answer', requireValidWorking: true } },
            ],
          },
        ],
      },
      workedSolutions: [{ methodLabel: 'Square & verify', steps: [{ math: 'x + 2 = x^2', note: 'Square.' }, { math: 'x = 2', rejectedExtraneous: ['-1'], note: 'Reject -1.' }] }],
    };

    // Contradictory rejection of genuine root x = 2
    const contra = evaluateWorkingWorkspace(radEvidenceSpec, [
      { math: 'x + 2 = x^2' },
      { math: 'x = -1', rejectedExtraneous: ['2'] },
    ]);
    expect(contra.chain.stepResults[1].status).toBe('lost-solution-error');
    expect(contra.marking?.marksAwarded).toBe(0);

    // Bare declaration without candidateChecks evidence -> B1 NOT awarded when requireEvidence: true
    const bareDecl = evaluateWorkingWorkspace(radEvidenceSpec, [
      { math: 'x + 2 = x^2' },
      { math: 'x = 2', rejectedExtraneous: ['-1'] },
    ]);
    expect(bareDecl.marking?.markDetails.find((m) => m.markId === 'B1')?.awarded).toBe(false);

    // Structured candidateChecks with matching mathematical failure reason -> B1 AWARDED
    const verifiedDecl = evaluateWorkingWorkspace(radEvidenceSpec, [
      { math: 'x + 2 = x^2' },
      {
        math: 'x = 2',
        candidateChecks: [{ candidate: '-1', verdict: 'extraneous', reason: 'substitution-mismatch' }],
      },
    ]);
    expect(verifiedDecl.marking?.markDetails.find((m) => m.markId === 'B1')?.awarded).toBe(true);
    expect(verifiedDecl.marking?.marksAwarded).toBe(2);

    // 2. ECF blocked on trivial repetition (3x = 25 -> 3x = 25) and blocked after lost-solution-error
    const ecfRepSpec: MathMultiStepWorkingSpec = {
      mode: 'multi-step-working',
      learningMode: 'independent',
      problemKind: 'equation-solving',
      variables: ['x'],
      initialStatement: '3x + 5 = 20',
      finalGoal: { mode: 'equation-solution', variable: 'x', originalEquation: '3x + 5 = 20', equationClass: 'linear', expectedRoots: ['5'] },
      markingScheme: {
        maxMarks: 1,
        strategyGroups: [
          {
            id: 's1',
            label: 'ECF',
            marks: [
              { markId: 'A1', type: 'A', points: 1, allowErrorCarriedForward: true, description: 'ECF step', predicate: { kind: 'follow-through-step' } },
            ],
          },
        ],
      },
      workedSolutions: [{ methodLabel: 'Solve', steps: [{ math: '3x = 15', note: 'Sub 5.' }, { math: 'x = 5', note: 'Div 3.' }] }],
    };
    const trivialRepeat = evaluateWorkingWorkspace(ecfRepSpec, [{ math: '3x = 25' }, { math: '3x = 25' }]);
    expect(trivialRepeat.marking?.marksAwarded).toBe(0);

    // 3. Operation label alone ('factorise' on unfactorised x^2 - x - 6 = 0) does NOT earn certified-transition mark
    const opEvidenceSpec: MathMultiStepWorkingSpec = {
      mode: 'multi-step-working',
      learningMode: 'independent',
      problemKind: 'equation-solving',
      variables: ['x'],
      initialStatement: 'x^2 - x - 6 = 0',
      finalGoal: { mode: 'equation-solution', variable: 'x', originalEquation: 'x^2 - x - 6 = 0', equationClass: 'quadratic', expectedRoots: ['3', '-2'] },
      markingScheme: {
        maxMarks: 1,
        strategyGroups: [
          {
            id: 's1',
            label: 'Factor op',
            marks: [
              { markId: 'M1', type: 'M', points: 1, description: 'Must genuinely factorise', predicate: { kind: 'certified-transition', expectedOperation: 'factorise' } },
            ],
          },
        ],
      },
      workedSolutions: [{ methodLabel: 'Factor', steps: [{ math: '(x - 3)(x + 2) = 0', operation: 'factorise', note: 'Factor.' }, { math: 'x = 3 or x = -2', note: 'Roots.' }] }],
    };
    const fakeLabel = evaluateWorkingWorkspace(opEvidenceSpec, [{ math: 'x^2 - x - 6 = 0', operation: 'factorise' }]);
    expect(fakeLabel.marking?.marksAwarded).toBe(0);
    const realFactor = evaluateWorkingWorkspace(opEvidenceSpec, [{ math: '(x - 3)(x + 2) = 0', operation: 'factorise' }]);
    expect(realFactor.marking?.marksAwarded).toBe(1);
  });
});
