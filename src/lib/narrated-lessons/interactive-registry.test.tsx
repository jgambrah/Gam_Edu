import React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import {
  assertValidLessonInteractives,
  compareSemver,
  evaluateDeclarativeRule,
  SUPPORTED_INTERACTIVE_ENGINES,
  validateSlideInteractiveConfig,
  type DeclarativeRuleNode,
  type RuleExplorerInteractiveConfig,
} from './interactive-schema';
import { RuleExplorerEngine } from '@/components/narrated-lessons/RuleExplorerEngine';
import { InteractiveEngineRegistry } from '@/components/narrated-lessons/InteractiveEngineRegistry';
import { resolveInlineCodeDraftStorage } from '@/components/narrated-lessons/InlineCodePlayground';
import { runPseudocode } from '@/lib/pseudocode-runner';
import { executeIgcseSql } from '@/lib/sql-practice/igcse-sql-engine';
import type { LessonSlide, NarratedLesson } from './types';

// Cross-Subject Pilot Config 1: Computer Science (IGCSE Boolean Logic)
const CS_LAB_ACCESS_CONFIG: RuleExplorerInteractiveConfig = {
  id: 'cs-lab-access-rule',
  engine: 'rule-explorer',
  schemaVersion: 1,
  minEngineVersion: '1.0.0',
  subjectTag: 'Computer Science',
  title: 'Computer Laboratory Access Rule',
  instructions: 'Toggle the two entry conditions to see when access is granted.',
  accessibilityLabel: 'Computer laboratory access condition explorer',
  fallbackText: 'A pupil enters the computer laboratory only when they have BOTH a valid student ID card AND teacher permission.',
  hints: ['Try turning both conditions to Present / Granted to satisfy the AND rule.'],
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
  minEngineVersion: '1.0.0',
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

function makeStubSlide(interactive?: LessonSlide['interactive'], id = 's01'): LessonSlide {
  return {
    id,
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

describe('Interactive Schema Validation, Security Boundaries & Versioning (Step 3)', () => {
  it('validates all machine-readable authoring examples in docs/examples/interactive-lesson-examples.json', () => {
    const examplesPath = path.resolve(process.cwd(), 'docs/examples/interactive-lesson-examples.json');
    const parsed = JSON.parse(fs.readFileSync(examplesPath, 'utf8')) as {
      examples: Record<string, unknown>;
    };
    const entries = Object.entries(parsed.examples);
    expect(entries.length).toBeGreaterThanOrEqual(6);
    for (const [name, cfg] of entries) {
      const res = validateSlideInteractiveConfig(cfg, { requireImplemented: true });
      expect(res.ok, `Example "${name}" failed: ${res.errors.join('; ')}`).toBe(true);
    }
  });

  it('validates slides p01-p07 of the preview fixture under strict publish rules and confirms p08 exercises fallback', () => {
    const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step3-registry-pilot.json');
    const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as NarratedLesson;
    expect(fixture.slides.length).toBe(8);

    // Slides p01-p07 must pass strict publish validation (requireImplemented: true)
    expect(() =>
      assertValidLessonInteractives({
        lessonId: fixture.lessonId,
        slides: fixture.slides.slice(0, 7),
      }),
    ).not.toThrow();

    // Slide p08 intentionally includes a reserved engine + incompatible minEngineVersion
    expect(() =>
      assertValidLessonInteractives({
        lessonId: fixture.lessonId,
        slides: [fixture.slides[7]],
      }),
    ).toThrow(/reserved for future development|Incompatible minEngineVersion/i);
  });

  it('rejects unknown engines, unsupported schemaVersion, and incompatible minEngineVersion', () => {
    expect(compareSemver('1.0.0', '1.0.0')).toBe(0);
    expect(compareSemver('1.0.0', '2.0.0')).toBe(-1);
    expect(compareSemver('1.2.0', '1.0.5')).toBe(1);

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

    const badMinVer = validateSlideInteractiveConfig({
      ...CS_LAB_ACCESS_CONFIG,
      minEngineVersion: '2.0.0',
    });
    expect(badMinVer.ok).toBe(false);
    expect(badMinVer.errors.join(' ')).toMatch(/Incompatible minEngineVersion/i);
  });

  it('rejects unknown configuration fields, invalid types, oversized payloads, and unsafe URL protocols', () => {
    const unknownTop = validateSlideInteractiveConfig({
      ...CS_LAB_ACCESS_CONFIG,
      customHtml: '<div>nope</div>',
    });
    expect(unknownTop.ok).toBe(false);
    expect(unknownTop.errors.join(' ')).toMatch(/Unknown configuration field/i);

    const invalidType = validateSlideInteractiveConfig({
      ...CS_LAB_ACCESS_CONFIG,
      persistCompletion: 'yes' as unknown as boolean,
    });
    expect(invalidType.ok).toBe(false);
    expect(invalidType.errors.join(' ')).toMatch(/persistCompletion.*boolean/i);

    const oversized = validateSlideInteractiveConfig({
      ...CS_LAB_ACCESS_CONFIG,
      fallbackText: 'A'.repeat(26_000),
    });
    expect(oversized.ok).toBe(false);
    expect(oversized.errors.join(' ')).toMatch(/exceeds maximum allowed size/i);

    const badProto = validateSlideInteractiveConfig({
      ...CS_LAB_ACCESS_CONFIG,
      instructions: 'Open javascript:alert(1) to continue.',
    });
    expect(badProto.ok).toBe(false);
    expect(badProto.errors.join(' ')).toMatch(/Unsafe executable URL protocol/i);
  });

  it('rejects invalid input references, invalid operator arity, excessive nesting depth, and excessive AST nodes', () => {
    const badInputRef = validateSlideInteractiveConfig({
      ...CS_LAB_ACCESS_CONFIG,
      rule: { operator: 'AND', operands: [{ input: 'idCard' }, { input: 'nonExistent' }] },
    });
    expect(badInputRef.ok).toBe(false);
    expect(badInputRef.errors.join(' ')).toMatch(/unknown input "nonExistent"/i);

    const badNotArity = validateSlideInteractiveConfig({
      ...CS_LAB_ACCESS_CONFIG,
      rule: { operator: 'NOT', operands: [{ input: 'idCard' }, { input: 'permission' }] },
    });
    expect(badNotArity.ok).toBe(false);
    expect(badNotArity.errors.join(' ')).toMatch(/NOT operator must have exactly 1 operand/i);

    const badAndArity = validateSlideInteractiveConfig({
      ...CS_LAB_ACCESS_CONFIG,
      rule: { operator: 'AND', operands: [{ input: 'idCard' }] },
    });
    expect(badAndArity.ok).toBe(false);
    expect(badAndArity.errors.join(' ')).toMatch(/between 2 and 8 operands/i);

    // Build depth 8 nested NOT chain (> max 6)
    let deepRule: DeclarativeRuleNode = { input: 'idCard' };
    for (let i = 0; i < 8; i++) {
      deepRule = { operator: 'NOT', operands: [deepRule] };
    }
    const tooDeep = validateSlideInteractiveConfig({
      ...CS_LAB_ACCESS_CONFIG,
      rule: deepRule,
    });
    expect(tooDeep.ok).toBe(false);
    expect(tooDeep.errors.join(' ')).toMatch(/nesting depth exceeds maximum/i);
  });

  it('distinguishes legitimate CS educational explanations & isolated starter code from protected teacher content and destructive SQL', () => {
    // Legitimate CS lesson explaining why eval() or <script> is unsafe MUST be allowed
    const legitCsExplanation = validateSlideInteractiveConfig({
      id: 'cs-security-lesson',
      engine: 'code-playground',
      schemaVersion: 1,
      title: 'Why Safe Parsing Beats eval()',
      instructions: 'Explain why avoiding eval() and sanitizing <script> tags protects web apps.',
      accessibilityLabel: 'Python safe parsing sandbox',
      fallbackText: 'Use int() instead of eval() to convert numeric input safely.',
      languages: ['python'],
      pythonStarter: '# Safe conversion instead of eval()\nval = int(input())\nprint(val * 2)',
      publicTests: [{ stdin: '5', expectedStdout: '10' }],
    });
    expect(legitCsExplanation.ok).toBe(true);

    // Destructive SQL in read-only inline runner MUST be rejected
    const badSql = validateSlideInteractiveConfig({
      id: 'bad-sql-ddl',
      engine: 'code-playground',
      schemaVersion: 1,
      title: 'Unsafe SQL',
      instructions: 'Do not allow DROP TABLE.',
      accessibilityLabel: 'SQL playground',
      fallbackText: 'Read-only SELECT only.',
      languages: ['sql'],
      sqlStarter: 'DROP TABLE Stock;',
    });
    expect(badSql.ok).toBe(false);
    expect(badSql.errors.join(' ')).toMatch(/read-only SELECT/i);

    // Protected teacher-only fields MUST be rejected
    const leakedTeacherKey = validateSlideInteractiveConfig({
      ...CS_LAB_ACCESS_CONFIG,
      answerKey: 'SECRET',
    });
    expect(leakedTeacherKey.ok).toBe(false);
    expect(leakedTeacherKey.errors.join(' ')).toMatch(/Protected teacher-only field/i);
  });

  it('rejects duplicate interactive IDs both on the same slide and across slides', () => {
    expect(() =>
      assertValidLessonInteractives({
        lessonId: 'dup-same-slide',
        slides: [{ id: 's01', interactive: [CS_LAB_ACCESS_CONFIG, CS_LAB_ACCESS_CONFIG] }],
      }),
    ).toThrow(/duplicate interactive activity id/i);

    expect(() =>
      assertValidLessonInteractives({
        lessonId: 'dup-cross-slide',
        slides: [
          { id: 's01', interactive: CS_LAB_ACCESS_CONFIG },
          { id: 's02', interactive: CS_LAB_ACCESS_CONFIG },
        ],
      }),
    ).toThrow(/duplicate interactive activity id/i);
  });

  it('rejects reserved Step 4 engines at publish time while allowing explicit preview opt-in', () => {
    const reservedLesson = {
      lessonId: 'reserved-test',
      slides: [
        {
          id: 's01',
          interactive: {
            id: 'future-hotspots',
            engine: 'diagram-hotspots',
            schemaVersion: 1,
            title: 'Heart Anatomy Hotspots',
            instructions: 'Tap each chamber to inspect its role.',
            accessibilityLabel: 'Heart anatomy hotspot diagram',
            fallbackText: 'The heart has four chambers: left/right atria and left/right ventricles.',
          },
        },
      ],
    };

    // Production publish gate rejects reserved engine
    expect(() => assertValidLessonInteractives(reservedLesson)).toThrow(/reserved for future development/i);

    // Explicit preview-only fallback opt-in succeeds
    expect(() =>
      assertValidLessonInteractives(reservedLesson, { allowUnimplementedEngines: true }),
    ).not.toThrow();
  });

  it('evaluates nested NOT / OR / XOR declarative rules safely', () => {
    const rule: DeclarativeRuleNode = {
      operator: 'AND',
      operands: [
        { operator: 'OR', operands: [{ input: 'a' }, { input: 'b' }] },
        { operator: 'NOT', operands: [{ input: 'c' }] },
      ],
    };
    expect(evaluateDeclarativeRule(rule, { a: true, b: false, c: false })).toBe(true);
    expect(evaluateDeclarativeRule(rule, { a: true, b: false, c: true })).toBe(false);
    expect(evaluateDeclarativeRule(rule, { a: false, b: false, c: false })).toBe(false);
  });
});

describe('Cross-Subject Pilot, Multi-Activity Independence & State Behaviour', () => {
  it('runs Computer Science (Lab Access) and Chemistry (Combustion) through the exact same RuleExplorerEngine', () => {
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

    render(<RuleExplorerEngine config={CHEMISTRY_COMBUSTION_CONFIG} />);
    expect(screen.getByText('Combustion Conditions (Fire Triangle)')).toBeTruthy();
    expect(screen.getByText('No Combustion')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Heat above ignition temperature/i }));
    expect(screen.getByText('Combustion Occurs')).toBeTruthy();
  });

  it('maintains completely independent state & reset controls for two activities on one slide', () => {
    const { container } = render(
      <div>
        <RuleExplorerEngine config={CS_LAB_ACCESS_CONFIG} />
        <RuleExplorerEngine config={CHEMISTRY_COMBUSTION_CONFIG} />
      </div>,
    );

    const sections = container.querySelectorAll('section[data-interactive-engine="rule-explorer"]');
    expect(sections.length).toBe(2);
    const csSection = sections[0] as HTMLElement;
    const chemSection = sections[1] as HTMLElement;

    // Activate CS activity only -> Chemistry must remain untouched
    fireEvent.click(within(csSection).getByRole('button', { name: /Teacher permission/i }));
    expect(within(csSection).getByText('Access Granted')).toBeTruthy();
    expect(within(chemSection).getByText('No Combustion')).toBeTruthy();

    // Activate Chemistry -> Reset CS -> Chemistry must remain active
    fireEvent.click(within(chemSection).getByRole('button', { name: /Heat above ignition temperature/i }));
    expect(within(chemSection).getByText('Combustion Occurs')).toBeTruthy();

    fireEvent.click(within(csSection).getByRole('button', { name: /Reset/i }));
    expect(within(csSection).getByText('Access Denied')).toBeTruthy();
    expect(within(chemSection).getByText('Combustion Occurs')).toBeTruthy();
  });

  it('resets ephemeral state cleanly on slide navigation away and return', () => {
    const { rerender } = render(<RuleExplorerEngine config={CS_LAB_ACCESS_CONFIG} />);
    fireEvent.click(screen.getByRole('button', { name: /Teacher permission/i }));
    expect(screen.getByText('Access Granted')).toBeTruthy();

    // Navigate to another slide's config and back
    rerender(<RuleExplorerEngine config={CHEMISTRY_COMBUSTION_CONFIG} />);
    expect(screen.getByText('No Combustion')).toBeTruthy();

    rerender(<RuleExplorerEngine config={CS_LAB_ACCESS_CONFIG} />);
    expect(screen.getByText('Access Denied')).toBeTruthy();
  });
});

describe('InteractiveEngineRegistry Fallbacks, Low-Data Opt-In & Backward Compatibility', () => {
  it('renders nothing when slide.interactive is omitted (backward compatible with all 49 existing lessons)', () => {
    const { container } = render(
      <InteractiveEngineRegistry lesson={STUB_LESSON} slide={makeStubSlide(undefined)} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders a graceful fallback card for invalid configs, incompatible minEngineVersion, or reserved Step 4 engines', () => {
    const multiFallbackSlide = makeStubSlide([
      {
        ...CS_LAB_ACCESS_CONFIG,
        minEngineVersion: '9.0.0',
      },
      {
        id: 'bio-diagram-hotspots',
        engine: 'diagram-hotspots',
        schemaVersion: 1,
        title: 'Heart Anatomy Explorer',
        instructions: 'Explore labeled chambers on the diagram.',
        accessibilityLabel: 'Heart anatomy hotspot explorer',
        fallbackText: 'The heart pumps blood through four chambers: right/left atria and right/left ventricles.',
      },
    ]);
    render(<InteractiveEngineRegistry lesson={STUB_LESSON} slide={multiFallbackSlide} />);
    expect(screen.getByText('Computer Laboratory Access Rule')).toBeTruthy();
    expect(screen.getByText('Heart Anatomy Explorer')).toBeTruthy();
    expect(screen.getByText(/four chambers/i)).toBeTruthy();
  });

  it('respects Low-Data Mode with text summary first and allows manual opt-in loading', () => {
    const slide = makeStubSlide(CHEMISTRY_COMBUSTION_CONFIG);
    render(<InteractiveEngineRegistry lesson={STUB_LESSON} slide={slide} lowDataMode={true} />);
    expect(screen.getByText(/Low-Data Summary/i)).toBeTruthy();
    expect(screen.getByText(/all three sides of the fire triangle/i)).toBeTruthy();

    const optInBtn = screen.getByRole('button', { name: /Load interactive activity anyway/i });
    fireEvent.click(optInBtn);
    // Fallback card is dismissed once the learner opts in
    expect(screen.queryByText(/Low-Data Summary/i)).toBeNull();
  });
});

describe('Step 3 Closure Guards: Shared-Computer Draft Isolation, Production Compatibility & Authoring Examples', () => {
  it('isolates student code drafts by schoolId + userId in localStorage and uses tab-only sessionStorage when anonymous', () => {
    const studentA = resolveInlineCodeDraftStorage('lesson-1', 'act-1', 'python', {
      userId: 'uid-alice',
      schoolId: 'school-knust',
    });
    const studentB = resolveInlineCodeDraftStorage('lesson-1', 'act-1', 'python', {
      userId: 'uid-kwame',
      schoolId: 'school-knust',
    });
    const studentOtherSchool = resolveInlineCodeDraftStorage('lesson-1', 'act-1', 'python', {
      userId: 'uid-alice',
      schoolId: 'school-accra',
    });

    expect(studentA.scopedToUser).toBe(true);
    expect(studentA.storage).toBe(window.localStorage);
    expect(studentA.key).not.toBe(studentB.key);
    expect(studentA.key).not.toBe(studentOtherSchool.key);

    // Anonymous / unauthenticated preview uses sessionStorage (cleared on tab close), never localStorage
    window.sessionStorage.removeItem('gam_cached_uid');
    const anon = resolveInlineCodeDraftStorage('lesson-1', 'act-1', 'python', {
      userId: null,
      schoolId: null,
    });
    expect(anon.scopedToUser).toBe(false);
    expect(anon.storage).toBe(window.sessionStorage);
    expect(anon.key).toContain(':session:');
  });

  it('blocks production publication of dev-branch-only engines (implemented=true, productionVersion=null or behind minEngineVersion)', () => {
    const devOnlyRegistry = {
      ...SUPPORTED_INTERACTIVE_ENGINES,
      'graph-slider': {
        ...SUPPORTED_INTERACTIVE_ENGINES['graph-slider'],
        engineVersion: '1.0.0',
        productionVersion: null,
        implemented: true,
      },
      'rule-explorer': {
        ...SUPPORTED_INTERACTIVE_ENGINES['rule-explorer'],
        engineVersion: '1.1.0',
        productionVersion: '1.0.0',
        implemented: true,
      },
    };

    // Dev-branch-only engine (productionVersion: null) MUST fail production publish gate
    expect(() =>
      assertValidLessonInteractives(
        {
          lessonId: 'dev-only-lesson',
          slides: [
            {
              id: 's01',
              interactive: {
                id: 'dev-graph-1',
                engine: 'graph-slider',
                schemaVersion: 1,
                title: 'Dev Graph',
                instructions: 'Adjust m.',
                accessibilityLabel: 'Graph slider',
                fallbackText: 'Fallback summary.',
              },
            },
          ],
        },
        { engineRegistry: devOnlyRegistry },
      ),
    ).toThrow(/not yet deployed in production/i);

    // Engine requiring minEngineVersion 1.1.0 when productionVersion is 1.0.0 MUST fail production publish gate
    expect(() =>
      assertValidLessonInteractives(
        {
          lessonId: 'newer-version-lesson',
          slides: [
            {
              id: 's01',
              interactive: {
                ...CS_LAB_ACCESS_CONFIG,
                minEngineVersion: '1.1.0',
              },
            },
          ],
        },
        { engineRegistry: devOnlyRegistry },
      ),
    ).toThrow(/exceeds productionVersion/i);
  });

  it('verifies refined authoring examples execute accurately (Cambridge DECLARE pseudocode -> 15; Stock SQL -> Bag, Ruler, Pencil)', () => {
    const examplesPath = path.resolve(process.cwd(), 'docs/examples/interactive-lesson-examples.json');
    const parsed = JSON.parse(fs.readFileSync(examplesPath, 'utf8')) as {
      examples: {
        codePlaygroundPseudocode: { pseudocodeStarter: string };
        codePlaygroundSql: { sqlStarter: string };
      };
    };

    const pseudoRes = runPseudocode(parsed.examples.codePlaygroundPseudocode.pseudocodeStarter);
    expect(pseudoRes.error).toBeUndefined();
    expect(pseudoRes.output.join('\n').trim()).toBe('15');

    const sqlRes = executeIgcseSql(parsed.examples.codePlaygroundSql.sqlStarter);
    expect(sqlRes.error).toBeUndefined();
    expect(sqlRes.columns).toEqual(['ItemName', 'Price']);
    expect(sqlRes.rows).toEqual([
      ['Bag', 35],
      ['Ruler', 4],
      ['Pencil', 1.5],
    ]);
  });
});
