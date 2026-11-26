import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  assertValidLessonInteractives,
  evaluateDeclarativeRule,
  validateSlideInteractiveConfig,
  type RuleExplorerInteractiveConfig,
} from './interactive-schema';
import { RuleExplorerEngine } from '@/components/narrated-lessons/RuleExplorerEngine';
import { InteractiveEngineRegistry } from '@/components/narrated-lessons/InteractiveEngineRegistry';
import type { LessonSlide, NarratedLesson } from './types';

// Cross-Subject Pilot Config 1: Computer Science (IGCSE Boolean Logic)
const CS_LAB_ACCESS_CONFIG: RuleExplorerInteractiveConfig = {
  id: 'cs-lab-access-rule',
  engine: 'rule-explorer',
  schemaVersion: 1,
  subjectTag: 'Computer Science',
  title: 'Computer Laboratory Access Rule',
  instructions: 'Toggle the two entry conditions to see when access is granted.',
  accessibilityLabel: 'Computer laboratory access condition explorer',
  fallbackText: 'A pupil enters the computer laboratory only when they have BOTH a valid student ID card AND teacher permission.',
  hints: ['Try turning both conditions to YES to satisfy the AND rule.'],
  inputs: [
    { id: 'idCard', label: 'Valid student ID card', defaultValue: true, trueText: 'Present', falseText: 'Missing' },
    { id: 'permission', label: 'Teacher permission', defaultValue: false, trueText: 'Granted', falseText: 'Not granted' },
  ],
  rule: {
    operator: 'AND',
    operands: [{ input: 'idCard' }, { input: 'permission' }],
  },
  output: {
    trueLabel: 'Access Granted',
    falseLabel: 'Access Denied',
    explanationTrue: 'Both required conditions are satisfied, so the door unlocks.',
    explanationFalse: 'At least one required condition is missing, so entry is blocked.',
    showBinaryValues: true,
  },
};

// Cross-Subject Pilot Config 2: Chemistry / Integrated Science (Fire Triangle)
const CHEMISTRY_COMBUSTION_CONFIG: RuleExplorerInteractiveConfig = {
  id: 'chem-fire-triangle-rule',
  engine: 'rule-explorer',
  schemaVersion: 1,
  subjectTag: 'Chemistry',
  title: 'Combustion Conditions (Fire Triangle)',
  instructions: 'Toggle Fuel, Oxygen, and Heat to observe when combustion can occur.',
  accessibilityLabel: 'Chemistry combustion fire triangle explorer',
  fallbackText: 'Combustion requires all three sides of the fire triangle: Fuel, Oxygen, and Heat.',
  inputs: [
    { id: 'fuel', label: 'Fuel (e.g. dry wood or gas)', defaultValue: true },
    { id: 'oxygen', label: 'Oxygen supply', defaultValue: true },
    { id: 'heat', label: 'Heat above ignition temperature', defaultValue: false },
  ],
  rule: {
    operator: 'AND',
    operands: [{ input: 'fuel' }, { input: 'oxygen' }, { input: 'heat' }],
  },
  output: {
    trueLabel: 'Combustion Occurs',
    falseLabel: 'No Combustion',
    explanationTrue: 'All three fire triangle conditions are present, so the reaction sustains.',
    explanationFalse: 'Removing any one of fuel, oxygen, or heat prevents or extinguishes combustion.',
    showBinaryValues: false,
  },
};

const STUB_LESSON = {
  lessonId: 'pilot-lesson',
  schemaVersion: '0.3',
  meta: {
    title: 'Pilot Lesson',
    subject: 'Integrated Science',
    class: 'Basic 8',
    topic: 'Combustion',
    contentStandard: 'B8.1',
  },
  slides: [],
  checkpoints: [],
  masteryCheck: { items: [] },
  summary: { recapScript: 'Recap' },
} as unknown as NarratedLesson;

function makeStubSlide(interactive?: LessonSlide['interactive']): LessonSlide {
  return {
    id: 's01',
    order: 1,
    title: 'Pilot Slide',
    purpose: 'Demonstrate cross-subject interactive engine reuse',
    indicatorIds: ['B8.1.1'],
    keyIdeas: ['Declarative condition rules'],
    onScreenText: ['Key takeaway'],
    askTeacherContext: {
      focus: 'Combustion conditions',
      keyTerms: [],
      commonMisconceptions: [],
    } as unknown as LessonSlide['askTeacherContext'],
    visual: {
      type: 'illustration',
      altText: 'Diagram',
      description: 'Pilot visual description',
      labels: [],
      svgCode: null,
      imagePrompt: null,
    },
    narration: {
      script: 'Narration text',
      estSeconds: 10,
      ttsStyleInstruction: 'Warm',
      pauseCues: [],
    },
    teacherNote: 'Note',
    interactive,
  };
}

describe('Interactive Schema Validation & Security Gates (Step 3)', () => {
  it('accepts valid cross-subject rule-explorer, code-playground, and construction-lab configs', () => {
    expect(validateSlideInteractiveConfig(CS_LAB_ACCESS_CONFIG).ok).toBe(true);
    expect(validateSlideInteractiveConfig(CHEMISTRY_COMBUSTION_CONFIG).ok).toBe(true);

    expect(
      validateSlideInteractiveConfig({
        id: 'py-sandbox-1',
        engine: 'code-playground',
        schemaVersion: 1,
        title: 'Try Python Loops',
        instructions: 'Run the starter code and modify the loop limit.',
        accessibilityLabel: 'Inline Python playground',
        fallbackText: 'Read the loop example in the slide diagram above.',
        languages: ['python', 'pseudocode'],
      }).ok,
    ).toBe(true);

    expect(
      validateSlideInteractiveConfig({
        id: 'gate-lab-1',
        engine: 'construction-lab',
        schemaVersion: 1,
        labKind: 'boolean-circuit',
        title: 'Build an AND-NOT Circuit',
        instructions: 'Wire inputs A and B to verify the truth table.',
        accessibilityLabel: 'Boolean circuit construction lab',
        fallbackText: 'Inspect the circuit truth table in the slide.',
      }).ok,
    ).toBe(true);
  });

  it('rejects unknown engines and unsupported schema versions', () => {
    const badEngine = validateSlideInteractiveConfig({
      ...CS_LAB_ACCESS_CONFIG,
      engine: 'arbitrary-widget',
    });
    expect(badEngine.ok).toBe(false);
    expect(badEngine.errors.join(' ')).toMatch(/Unknown or unsupported interactive engine/i);

    const badVersion = validateSlideInteractiveConfig({
      ...CS_LAB_ACCESS_CONFIG,
      schemaVersion: 99,
    });
    expect(badVersion.ok).toBe(false);
    expect(badVersion.errors.join(' ')).toMatch(/Unsupported schemaVersion/i);
  });

  it('rejects unsafe executable payloads (script tags, eval, Function, javascript:)', () => {
    const payloads = [
      '<script>alert(1)</script>',
      'eval("document.cookie")',
      'new Function("return 1")',
      'javascript:alert(1)',
    ];
    for (const payload of payloads) {
      const res = validateSlideInteractiveConfig({
        ...CS_LAB_ACCESS_CONFIG,
        instructions: `Run this: ${payload}`,
      });
      expect(res.ok).toBe(false);
      expect(res.errors.join(' ')).toMatch(/Unsafe executable payload/i);
    }
  });

  it('rejects protected teacher-only fields inside public interactive configs', () => {
    const res = validateSlideInteractiveConfig({
      ...CS_LAB_ACCESS_CONFIG,
      answerKey: 'SECRET',
    });
    expect(res.ok).toBe(false);
    expect(res.errors.join(' ')).toMatch(/Protected teacher-only field/i);
  });

  it('rejects duplicate interactive IDs across slides at publish time', () => {
    expect(() =>
      assertValidLessonInteractives({
        lessonId: 'test-lesson',
        slides: [
          { id: 's01', interactive: CS_LAB_ACCESS_CONFIG },
          { id: 's02', interactive: CS_LAB_ACCESS_CONFIG },
        ],
      }),
    ).toThrow(/duplicate interactive activity id/i);
  });

  it('evaluates nested NOT / OR / XOR declarative rules safely', () => {
    const rule = {
      operator: 'AND' as const,
      operands: [
        { operator: 'OR' as const, operands: [{ input: 'a' }, { input: 'b' }] },
        { operator: 'NOT' as const, operands: [{ input: 'c' }] },
      ],
    };
    expect(evaluateDeclarativeRule(rule, { a: true, b: false, c: false })).toBe(true);
    expect(evaluateDeclarativeRule(rule, { a: true, b: false, c: true })).toBe(false);
    expect(evaluateDeclarativeRule(rule, { a: false, b: false, c: false })).toBe(false);
  });
});

describe('Cross-Subject Pilot: RuleExplorerEngine (Zero Engine Code Duplication)', () => {
  it('runs Computer Science (Lab Access) and Chemistry (Combustion) through the exact same engine component', () => {
    // 1. Computer Science pilot
    const csView = render(<RuleExplorerEngine config={CS_LAB_ACCESS_CONFIG} />);
    expect(screen.getByText('Computer Laboratory Access Rule')).toBeTruthy();
    expect(screen.getByText('Access Denied')).toBeTruthy();
    expect(screen.getByText('Output = 0')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Teacher permission/i }));
    expect(screen.getByText('Access Granted')).toBeTruthy();
    expect(screen.getByText('Output = 1')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Need a hint/i }));
    expect(screen.getByText(/satisfy the AND rule/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Reset/i }));
    expect(screen.getByText('Access Denied')).toBeTruthy();
    csView.unmount();

    // 2. Chemistry pilot (exact same RuleExplorerEngine, pure JSON change)
    render(<RuleExplorerEngine config={CHEMISTRY_COMBUSTION_CONFIG} />);
    expect(screen.getByText('Combustion Conditions (Fire Triangle)')).toBeTruthy();
    expect(screen.getByText('No Combustion')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Heat above ignition temperature/i }));
    expect(screen.getByText('Combustion Occurs')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Oxygen supply/i }));
    expect(screen.getByText('No Combustion')).toBeTruthy();
  });
});

describe('InteractiveEngineRegistry Graceful Fallbacks & Backward Compatibility', () => {
  it('renders nothing when slide.interactive is omitted (backward compatible with all 49 existing lessons)', () => {
    const { container } = render(
      <InteractiveEngineRegistry lesson={STUB_LESSON} slide={makeStubSlide(undefined)} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders a graceful fallback card for invalid configs or unsupported schemaVersion without crashing', () => {
    const invalidSlide = makeStubSlide({
      ...CS_LAB_ACCESS_CONFIG,
      schemaVersion: 99 as unknown as 1,
    });
    render(<InteractiveEngineRegistry lesson={STUB_LESSON} slide={invalidSlide} />);
    expect(screen.getByText('Computer Laboratory Access Rule')).toBeTruthy();
    expect(screen.getByText(/BOTH a valid student ID card AND teacher permission/i)).toBeTruthy();
  });

  it('renders a graceful fallback card for planned Step 4 engines (e.g. graph-slider)', () => {
    const plannedSlide = makeStubSlide({
      id: 'math-linear-graph',
      engine: 'graph-slider',
      schemaVersion: 1,
      title: 'Gradient & Intercept Explorer',
      instructions: 'Adjust m and c to inspect y = mx + c.',
      accessibilityLabel: 'Linear equation graph explorer',
      fallbackText: 'Increasing gradient m makes the line steeper; c shifts the y-intercept.',
    });
    render(<InteractiveEngineRegistry lesson={STUB_LESSON} slide={plannedSlide} />);
    expect(screen.getByText('Gradient & Intercept Explorer')).toBeTruthy();
    expect(screen.getByText(/Increasing gradient m makes the line steeper/i)).toBeTruthy();
  });

  it('respects Low-Data Mode by showing the text fallback before loading the interactive engine', () => {
    const slide = makeStubSlide(CHEMISTRY_COMBUSTION_CONFIG);
    render(<InteractiveEngineRegistry lesson={STUB_LESSON} slide={slide} lowDataMode={true} />);
    expect(screen.getByText(/Low-Data Summary/i)).toBeTruthy();
    expect(screen.getByText(/all three sides of the fire triangle/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Load interactive activity anyway/i })).toBeTruthy();
  });
});
