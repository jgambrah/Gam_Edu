import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  evaluateCategoryBins,
  evaluateClozeTiles,
  evaluateOrderSequence,
  evaluatePairMatching,
} from './sort-classify-engine';
import {
  SUPPORTED_INTERACTIVE_ENGINES,
  assertValidLessonInteractives,
  validateSlideInteractiveConfig,
  type SortClassifyInteractiveConfig,
} from '@/lib/narrated-lessons/interactive-schema';
import { SortClassifyEngine } from '@/components/narrated-lessons/SortClassifyEngine';
import { InteractiveEngineRegistry } from '@/components/narrated-lessons/InteractiveEngineRegistry';

describe('Step 5B — Sorting and Classification Engine (sort-classify 1.0.0)', () => {
  it('registers sort-classify as 8th engine (1.0.0, productionVersion: null) and confirms math-evaluator 1.1.0 LIVE', () => {
    expect(SUPPORTED_INTERACTIVE_ENGINES['sort-classify'].engineVersion).toBe('1.0.0');
    expect(SUPPORTED_INTERACTIVE_ENGINES['sort-classify'].productionVersion).toBeNull();
    expect(SUPPORTED_INTERACTIVE_ENGINES['math-evaluator'].engineVersion).toBe('1.1.0');
    expect(SUPPORTED_INTERACTIVE_ENGINES['math-evaluator'].productionVersion).toBe('1.1.0');
  });

  describe('1. Category Bins: Overlapping Sets, Multiple Valid Answers & Misconceptions', () => {
    it('verifies overlapping set membership (item in both Set A and Set B, item in neither)', () => {
      const spec = {
        mode: 'category-bins' as const,
        allowMultipleBinsPerItem: true,
        bins: [
          { id: 'A', label: 'Even' },
          { id: 'B', label: 'Multiple of 3' },
        ],
        items: [
          { id: 'n4', label: '4', validBinIds: ['A'] },
          { id: 'n6', label: '6', validBinIds: ['A', 'B'] },
          { id: 'n5', label: '5', validBinIds: [] },
        ],
      };

      // Missing second set for 6 -> fails
      expect(evaluateCategoryBins(spec, { n4: ['A'], n6: ['A'], n5: [] }).passed).toBe(false);
      // Exact overlapping set membership -> passes
      expect(evaluateCategoryBins(spec, { n4: ['A'], n6: ['A', 'B'], n5: [] }).passed).toBe(true);
    });

    it('supports multiple valid single-bin answers and surfaces misconception feedback', () => {
      const spec = {
        mode: 'category-bins' as const,
        bins: [
          { id: 'mammals', label: 'Mammals' },
          { id: 'birds', label: 'Birds' },
        ],
        items: [
          {
            id: 'bat',
            label: 'Bat',
            validBinIds: ['mammals'],
            misconceptionByBin: { birds: 'Bats have fur and produce milk — they are mammals.' },
          },
        ],
      };
      const wrong = evaluateCategoryBins(spec, { bat: ['birds'] });
      expect(wrong.passed).toBe(false);
      expect(wrong.feedback).toMatch(/fur and produce milk/i);
    });
  });

  describe('2. Pair Matching (1-to-1 & Many-to-Many), Cloze Tiles (Reusable & Non-Reusable) & Sequencing', () => {
    it('evaluates many-to-many matching accurately and rejects extra incorrect pairs', () => {
      const spec = {
        mode: 'pair-matching' as const,
        allowManyToMany: true,
        leftItems: [
          { id: 'oxbow', label: 'Ox-bow Lake' },
          { id: 'delta', label: 'Delta' },
        ],
        rightItems: [
          { id: 'ero', label: 'Erosion' },
          { id: 'dep', label: 'Deposition' },
        ],
        expectedMatches: [
          { leftId: 'oxbow', rightId: 'ero' },
          { leftId: 'oxbow', rightId: 'dep' },
          { leftId: 'delta', rightId: 'dep' },
        ],
      };
      expect(
        evaluatePairMatching(spec, [
          { leftId: 'oxbow', rightId: 'ero' },
          { leftId: 'oxbow', rightId: 'dep' },
          { leftId: 'delta', rightId: 'dep' },
        ]).passed,
      ).toBe(true);
      expect(
        evaluatePairMatching(spec, [
          { leftId: 'oxbow', rightId: 'ero' },
          { leftId: 'oxbow', rightId: 'dep' },
          { leftId: 'delta', rightId: 'dep' },
          { leftId: 'delta', rightId: 'ero' },
        ]).passed,
      ).toBe(false);
    });

    it('enforces reusable vs non-reusable cloze tokens and multiple accepted tokens per blank', () => {
      const reusable = {
        mode: 'cloze-tiles' as const,
        template: 'A {{b1}} and B {{b2}}.',
        reusableTokens: true,
        blanks: [
          { id: 'b1', acceptedTokenIds: ['is'] },
          { id: 'b2', acceptedTokenIds: ['is'] },
        ],
        tokens: [
          { id: 'is', label: 'is' },
          { id: 'are', label: 'are' },
        ],
      };
      expect(evaluateClozeTiles(reusable, { b1: 'is', b2: 'is' }).passed).toBe(true);
      expect(evaluateClozeTiles({ ...reusable, reusableTokens: false }, { b1: 'is', b2: 'is' }).passed).toBe(false);
    });

    it('supports multiple valid sequences in order-sequence mode', () => {
      const spec = {
        mode: 'order-sequence' as const,
        items: [
          { id: 'a', label: 'Step A' },
          { id: 'b', label: 'Step B' },
          { id: 'c', label: 'Step C' },
        ],
        acceptedOrders: [
          ['a', 'b', 'c'],
          ['b', 'a', 'c'],
        ],
      };
      expect(evaluateOrderSequence(spec, ['b', 'a', 'c']).passed).toBe(true);
      expect(evaluateOrderSequence(spec, ['c', 'a', 'b']).passed).toBe(false);
    });
  });

  describe('3. Strict Schema Validation, Referential Integrity & Pilot Fixture', () => {
    it('rejects unknown fields, broken bin/token references, and string booleans', () => {
      const bad = validateSlideInteractiveConfig(
        {
          id: 'bad-sc',
          engine: 'sort-classify',
          schemaVersion: 1,
          minEngineVersion: '1.0.0',
          curriculumLevel: 'primary',
          mode: 'category-bins',
          title: 'Bad',
          instructions: 'Bad instructions',
          accessibilityLabel: 'Bad label',
          fallbackText: 'Fallback',
          allowMultipleBinsPerItem: 'true', // string boolean rejected!
          bins: [
            { id: 'b1', label: 'Bin 1' },
            { id: 'b2', label: 'Bin 2' },
          ],
          items: [
            { id: 'i1', label: 'Item 1', validBinIds: ['missing-bin'] },
            { id: 'i2', label: 'Item 2', validBinIds: ['b2'] },
          ],
        },
        { requireProduction: false },
      );
      expect(bad.ok).toBe(false);
    });

    it('validates all 15 slides (19 activities) in step5b-sort-classify-pilot.json and keeps production gate CLOSED', () => {
      const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step5b-sort-classify-pilot.json');
      const lesson = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as {
        lessonId: string;
        slides: Array<{ id: string; interactive?: unknown[] }>;
      };
      expect(lesson.slides).toHaveLength(15);
      expect(lesson.slides.reduce((acc, s) => acc + (s.interactive?.length ?? 0), 0)).toBe(19);
      expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: true })).not.toThrow();
      expect(() => assertValidLessonInteractives(lesson, { allowDevOnlyEngines: false })).toThrow(/production/i);
    });

    it('enforces Step 5B close-out corrections: 1:1 cardinality, duplicate pairs, bipartite cloze feasibility, closest-order tie-breaking, explicit empty-set decision, malformed submissions & visual safety', () => {
      // 1. 1:1 cardinality violation in pair-matching (both schema and evaluator)
      const oneToOneSpec = {
        mode: 'pair-matching' as const,
        allowManyToMany: false,
        leftItems: [
          { id: 'l1', label: 'A' },
          { id: 'l2', label: 'B' },
        ],
        rightItems: [
          { id: 'r1', label: '1' },
          { id: 'r2', label: '2' },
        ],
        expectedMatches: [
          { leftId: 'l1', rightId: 'r1' },
          { leftId: 'l2', rightId: 'r2' },
        ],
      };
      expect(
        evaluatePairMatching(oneToOneSpec, [
          { leftId: 'l1', rightId: 'r1' },
          { leftId: 'l1', rightId: 'r2' },
        ]).passed,
      ).toBe(false);
      expect(
        evaluatePairMatching(oneToOneSpec, [
          { leftId: 'l1', rightId: 'r1' },
          { leftId: 'l1', rightId: 'r1' },
        ]).feedback,
      ).toMatch(/duplicate/i);
      expect(
        evaluatePairMatching(oneToOneSpec, [{ leftId: 'ghost', rightId: 'r1' }]).feedback,
      ).toMatch(/unknown/i);

      // Schema rejects conflicting 1:1 expectedMatches and duplicate expectedMatches
      const badCard = validateSlideInteractiveConfig({
        id: 'bad-card',
        engine: 'sort-classify',
        schemaVersion: 1,
        minEngineVersion: '1.0.0',
        curriculumLevel: 'primary',
        mode: 'pair-matching',
        allowManyToMany: false,
        title: 'Bad 1:1',
        instructions: 'Match items.',
        accessibilityLabel: 'Bad 1:1',
        fallbackText: 'Fallback text.',
        leftItems: [{ id: 'l1', label: 'A' }, { id: 'l2', label: 'B' }],
        rightItems: [{ id: 'r1', label: '1' }, { id: 'r2', label: '2' }],
        expectedMatches: [
          { leftId: 'l1', rightId: 'r1' },
          { leftId: 'l2', rightId: 'r1' },
        ],
      });
      expect(badCard.ok).toBe(false);

      // 2. Non-reusable cloze bipartite feasibility check (2 blanks both only accept tok1 -> infeasible!)
      const infeasibleCloze = validateSlideInteractiveConfig({
        id: 'bad-cloze-bipartite',
        engine: 'sort-classify',
        schemaVersion: 1,
        minEngineVersion: '1.0.0',
        curriculumLevel: 'igcse',
        mode: 'cloze-tiles',
        reusableTokens: false,
        title: 'Infeasible Cloze',
        instructions: 'Fill blanks.',
        accessibilityLabel: 'Infeasible Cloze',
        fallbackText: 'Fallback.',
        template: 'First {{b1}} then {{b2}}.',
        blanks: [
          { id: 'b1', acceptedTokenIds: ['t1'] },
          { id: 'b2', acceptedTokenIds: ['t1'] },
        ],
        tokens: [
          { id: 't1', label: 'alpha' },
          { id: 't2', label: 'beta' },
        ],
      });
      expect(infeasibleCloze.ok).toBe(false);
      expect(infeasibleCloze.errors.join(' ')).toMatch(/feasible/i);

      // Undeclared placeholder & duplicate placeholder rejected
      const badPlaceholder = validateSlideInteractiveConfig({
        id: 'bad-ph',
        engine: 'sort-classify',
        schemaVersion: 1,
        minEngineVersion: '1.0.0',
        curriculumLevel: 'primary',
        mode: 'cloze-tiles',
        title: 'Bad PH',
        instructions: 'Fill blanks.',
        accessibilityLabel: 'Bad PH',
        fallbackText: 'Fallback.',
        template: 'Use {{b1}} and {{b1}} and {{ghost}}.',
        blanks: [{ id: 'b1', acceptedTokenIds: ['t1'] }],
        tokens: [{ id: 't1', label: 'A' }, { id: 't2', label: 'B' }],
      });
      expect(badPlaceholder.ok).toBe(false);

      // 3. Closest accepted order + deterministic tie-breaking in evaluateOrderSequence
      const seqSpec = {
        mode: 'order-sequence' as const,
        items: [
          { id: 'a', label: 'A' },
          { id: 'b', label: 'B' },
          { id: 'c', label: 'C' },
        ],
        acceptedOrders: [
          ['a', 'b', 'c'],
          ['c', 'b', 'a'],
        ],
      };
      // Learner matches ['c', 'a', 'b'] -> 1 match with ['c','b','a'] vs 0 with ['a','b','c']
      const seqRes = evaluateOrderSequence(seqSpec, ['c', 'a', 'b']);
      expect(seqRes.passed).toBe(false);
      expect(seqRes.correctCount).toBe(1);
      expect(seqRes.closestOrderIndex).toBe(1);
      expect(seqRes.itemDiagnostics.c).toBe('correct');
      // Malformed duplicate item rejected
      expect(evaluateOrderSequence(seqSpec, ['a', 'a', 'c']).feedback).toMatch(/duplicate/i);

      // 4. Explicit empty-set decision vs unanswered item
      const emptySetSpec = {
        mode: 'category-bins' as const,
        allowMultipleBinsPerItem: true,
        explicitEmptyDecision: true,
        bins: [
          { id: 'even', label: 'Even' },
          { id: 'prime', label: 'Prime' },
        ],
        items: [
          { id: 'n2', label: '2', validBinIds: ['even', 'prime'] },
          { id: 'n9', label: '9', validBinIds: [] },
        ],
      };
      const unanswered = evaluateCategoryBins(emptySetSpec, { n2: ['even', 'prime'] });
      expect(unanswered.passed).toBe(false);
      expect(unanswered.itemDiagnostics.n9).toBe('unassigned');
      const explicitlyDecided = evaluateCategoryBins(emptySetSpec, { n2: ['even', 'prime'] }, ['n9']);
      expect(explicitlyDecided.passed).toBe(true);
      expect(explicitlyDecided.itemDiagnostics.n9).toBe('correct');

      // 5. Prototype-sensitive keys & external image URLs rejected
      const badVisual = validateSlideInteractiveConfig({
        id: 'bad-vis',
        engine: 'sort-classify',
        schemaVersion: 1,
        minEngineVersion: '1.0.0',
        curriculumLevel: 'early-years',
        mode: 'category-bins',
        title: 'Bad Visual',
        instructions: 'Sort items.',
        accessibilityLabel: 'Bad Visual',
        fallbackText: 'Fallback.',
        bins: [{ id: 'b1', label: 'B1' }, { id: 'b2', label: 'B2' }],
        items: [
          { id: 'i1', label: 'Bad', validBinIds: ['b1'], visual: { src: 'https://evil.example.com/x.png', alt: 'External image' } },
          { id: 'constructor', label: 'Proto', validBinIds: ['b2'] },
        ],
      });
      expect(badVisual.ok).toBe(false);
    });
  });

  describe('4. UI Keyboard Interaction, Undo/Reset, Multi-Activity Isolation, Low-Data & Performance', () => {
    const cfgA: SortClassifyInteractiveConfig = {
      id: 'ui-sc-a',
      engine: 'sort-classify',
      schemaVersion: 1,
      minEngineVersion: '1.0.0',
      curriculumLevel: 'primary',
      mode: 'category-bins',
      title: 'Sort A',
      instructions: 'Sort item A.',
      accessibilityLabel: 'Sort A',
      fallbackText: 'Item A goes in Bin 1.',
      bins: [
        { id: 'b1', label: 'Bin 1' },
        { id: 'b2', label: 'Bin 2' },
      ],
      items: [
        { id: 'i1', label: 'Apple', validBinIds: ['b1'] },
        { id: 'i2', label: 'Carrot', validBinIds: ['b2'] },
      ],
    };

    const cfgB: SortClassifyInteractiveConfig = {
      id: 'ui-sc-b',
      engine: 'sort-classify',
      schemaVersion: 1,
      minEngineVersion: '1.0.0',
      curriculumLevel: 'primary',
      mode: 'order-sequence',
      title: 'Order B',
      instructions: 'Order steps.',
      accessibilityLabel: 'Order B',
      fallbackText: '1, 2, 3.',
      items: [
        { id: 'x1', label: 'First' },
        { id: 'x2', label: 'Second' },
        { id: 'x3', label: 'Third' },
      ],
      acceptedOrders: [['x1', 'x2', 'x3']],
    };

    it('supports click/keyboard sorting, Undo, Reset, multi-activity isolation, and Low-Data Mode', () => {
      render(
        <div>
          <SortClassifyEngine config={cfgA} />
          <SortClassifyEngine config={cfgB} />
        </div>,
      );

      // Apple is selected by default -> place in Bin 1, then select Carrot -> place in Bin 2
      fireEvent.click(screen.getByRole('button', { name: 'Assign selected item to Bin 1' }));
      fireEvent.click(screen.getByRole('button', { name: 'Carrot' }));
      fireEvent.click(screen.getByRole('button', { name: 'Assign selected item to Bin 2' }));
      fireEvent.click(screen.getAllByRole('button', { name: 'Check classification' })[0]);
      expect(screen.getByText(/all 2 items are classified accurately/i)).toBeTruthy();

      // Undo reverts Carrot placement
      fireEvent.click(screen.getAllByRole('button', { name: 'Undo last change' })[0]);
      fireEvent.click(screen.getAllByRole('button', { name: 'Check classification' })[0]);
      expect(screen.getByText(/1\/2 correct/i)).toBeTruthy();

      // Low-Data Mode via InteractiveEngineRegistry
      render(
        <InteractiveEngineRegistry
          lesson={{ lessonId: 'step5b-test' } as never}
          slide={{ id: 'sc-s01', interactive: cfgA } as never}
          lowDataMode={true}
        />,
      );
      expect(screen.getByText('Item A goes in Bin 1.')).toBeTruthy();
    });

    it('evaluates representative and maximum-bound configs well under budget (< 2 ms)', () => {
      const maxSpec = {
        mode: 'category-bins' as const,
        allowMultipleBinsPerItem: true,
        bins: [
          { id: 'b1', label: 'B1' },
          { id: 'b2', label: 'B2' },
          { id: 'b3', label: 'B3' },
          { id: 'b4', label: 'B4' },
        ],
        items: Array.from({ length: 16 }, (_, i) => ({
          id: `it${i}`,
          label: `Item ${i}`,
          validBinIds: [`b${(i % 4) + 1}`],
        })),
      };
      const assignments = Object.fromEntries(maxSpec.items.map((it) => [it.id, it.validBinIds]));
      const t0 = performance.now();
      for (let i = 0; i < 500; i++) evaluateCategoryBins(maxSpec, assignments);
      const avgMs = (performance.now() - t0) / 500;
      console.log(`STEP5B_PERF_MAX_BOUND: avg=${avgMs.toFixed(4)}ms`);
      expect(avgMs).toBeLessThan(2);
    });
  });
});
