import React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { evaluateMathAst, parseMathExpr, tryParseMathExpr } from './math-expr';
import {
  buildStepSeriesPoints,
  evaluateGraphChallengeCheck,
  sampleFormulaCurve,
} from './graph-sampler';
import {
  assertValidLessonInteractives,
  validateSlideInteractiveConfig,
  type GraphSliderInteractiveConfig,
} from './interactive-schema';
import { GraphSliderEngine } from '@/components/narrated-lessons/GraphSliderEngine';
import { InteractiveEngineRegistry } from '@/components/narrated-lessons/InteractiveEngineRegistry';
import type { LessonSlide, NarratedLesson } from './types';

function evalScalar(expr: string, vars: Record<string, number> = {}): number {
  const parsed = parseMathExpr(expr, Object.keys(vars));
  return evaluateMathAst(parsed.ast, vars);
}

describe('Step 4A Mathematical Expression Parser & Bounded AST Evaluator', () => {
  it('passes all 10 required operator precedence, associativity, unary, constant & function checks', () => {
    expect(evalScalar('2 + 3 * 4')).toBe(14);
    expect(evalScalar('(2 + 3) * 4')).toBe(20);
    expect(evalScalar('-2^2')).toBe(-4);
    expect(evalScalar('(-2)^2')).toBe(4);
    expect(evalScalar('2^3^2')).toBe(512);
    expect(evalScalar('2^-3')).toBeCloseTo(0.125, 10);
    expect(evalScalar('sin(PI/2)')).toBeCloseTo(1, 10);
    expect(evalScalar('log10(100)')).toBeCloseTo(2, 10);
    expect(evalScalar('ln(E)')).toBeCloseTo(1, 10);
    expect(evalScalar('sqrt(16)')).toBe(4);
  });

  it('enforces explicit function arity (min/max require 2..4 args; unary functions require 1 arg)', () => {
    expect(evalScalar('min(3, 7, 1)')).toBe(1);
    expect(evalScalar('max(3, 7, 1, 9)')).toBe(9);
    expect(tryParseMathExpr('min(5)', []).ok).toBe(false);
    expect(tryParseMathExpr('max(1, 2, 3, 4, 5)', []).ok).toBe(false);
    expect(tryParseMathExpr('sin(1, 2)', []).ok).toBe(false);
    expect(tryParseMathExpr('sqrt()', []).ok).toBe(false);
  });

  it('rejects unknown variables, disallowed functions, malicious syntax, and excessive AST complexity', () => {
    expect(tryParseMathExpr('x + y', ['x']).ok).toBe(false);
    expect(tryParseMathExpr('eval(1)', []).ok).toBe(false);
    expect(tryParseMathExpr('window.location', ['window']).ok).toBe(false);
    expect(tryParseMathExpr('constructor(1)', []).ok).toBe(false);

    // Depth > 8 rejected
    const deep = '((((((((((1 + 1))))))))))';
    expect(tryParseMathExpr(deep, []).ok).toBe(false);

    // Node count > 48 rejected
    const wide = Array.from({ length: 30 }, () => '1').join(' + ');
    expect(tryParseMathExpr(wide, []).ok).toBe(false);
  });

  it('returns NaN cleanly on mathematical domain violations and numeric overflow without throwing', () => {
    expect(Number.isNaN(evalScalar('1 / x', { x: 0 }))).toBe(true);
    expect(Number.isNaN(evalScalar('sqrt(x)', { x: -4 }))).toBe(true);
    expect(Number.isNaN(evalScalar('ln(x)', { x: 0 }))).toBe(true);
    expect(Number.isNaN(evalScalar('log10(x)', { x: -10 }))).toBe(true);
    expect(Number.isNaN(evalScalar('tan(PI / 2)'))).toBe(true);
    expect(Number.isNaN(evalScalar('10^50'))).toBe(true); // exceeds 1e12 overflow guard
  });
});

describe('Step 4A Independent Mathematical & Scientific Verification Matrix', () => {
  it('verifies projectile motion range, max height, complementary angles (30° & 60°), 45° max, and stopAtYZero landing interpolation', () => {
    const trajExpr = 'x * tan(deg2rad(theta)) - (9.81 * x^2) / (2 * v0^2 * cos(deg2rad(theta))^2)';
    const rangeExpr = '(v0^2 * sin(2 * deg2rad(theta))) / 9.81';
    const heightExpr = '(v0^2 * sin(deg2rad(theta))^2) / (2 * 9.81)';

    const trajAst = parseMathExpr(trajExpr, ['x', 'theta', 'v0']).ast;
    const rangeAst = parseMathExpr(rangeExpr, ['theta', 'v0']).ast;
    const heightAst = parseMathExpr(heightExpr, ['theta', 'v0']).ast;

    // Independent analytical reference values for v0 = 26 m/s, g = 9.81 m/s^2:
    // R = 676 * sin(2*theta) / 9.81; H = 676 * sin^2(theta) / 19.62
    const cases = [
      { theta: 30, expectedRange: 59.6772, expectedHeight: 8.6137 },
      { theta: 45, expectedRange: 68.9093, expectedHeight: 17.2273 },
      { theta: 60, expectedRange: 59.6772, expectedHeight: 25.8410 },
    ];

    for (const c of cases) {
      const r = evaluateMathAst(rangeAst, { theta: c.theta, v0: 26 });
      const h = evaluateMathAst(heightAst, { theta: c.theta, v0: 26 });
      expect(r).toBeCloseTo(c.expectedRange, 3);
      expect(h).toBeCloseTo(c.expectedHeight, 3);

      const sampled = sampleFormulaCurve(trajAst, { theta: c.theta, v0: 26 }, {
        xVar: 'x',
        xMin: 0,
        xMax: 100,
        yMin: 0,
        yMax: 50,
        samples: 160,
        stopAtYZero: true,
      });
      // Must NOT terminate at x = 0 launch point
      expect(sampled.segments.length).toBe(1);
      expect(sampled.segments[0].length).toBeGreaterThan(20);
      // Bisected landing point must agree with analytical horizontal range
      expect(sampled.landingX).toBeDefined();
      expect(sampled.landingX!).toBeCloseTo(c.expectedRange, 2);
    }

    // Complementary angles 30° and 60° share equal range; 45° is strictly greater
    const r30 = evaluateMathAst(rangeAst, { theta: 30, v0: 26 });
    const r45 = evaluateMathAst(rangeAst, { theta: 45, v0: 26 });
    const r60 = evaluateMathAst(rangeAst, { theta: 60, v0: 26 });
    expect(r30).toBeCloseTo(r60, 6);
    expect(r45).toBeGreaterThan(r30);
  });

  it('verifies transverse wave spatial snapshot y(x) = A sin(2*PI*x / lambda), wave speed f*lambda, and period 1/f', () => {
    const waveAst = parseMathExpr('A * sin(2 * PI * x / lambda)', ['x', 'A', 'lambda']).ast;
    expect(evaluateMathAst(waveAst, { A: 1.5, lambda: 4, x: 0 })).toBeCloseTo(0, 8);
    expect(evaluateMathAst(waveAst, { A: 1.5, lambda: 4, x: 1 })).toBeCloseTo(1.5, 8);
    expect(evaluateMathAst(waveAst, { A: 1.5, lambda: 4, x: 2 })).toBeCloseTo(0, 8);
    expect(evaluateMathAst(waveAst, { A: 1.5, lambda: 4, x: 3 })).toBeCloseTo(-1.5, 8);
    expect(evalScalar('f * lambda', { f: 1.5, lambda: 2 })).toBeCloseTo(3.0, 8);
    expect(evalScalar('1 / f', { f: 1.5 })).toBeCloseTo(0.6667, 3);
  });

  it('segments reciprocal (1/x), tangent (tan(x)), sqrt(x), and ln(x) without false lines across discontinuities', () => {
    const recipAst = parseMathExpr('1 / x', ['x']).ast;
    const recipSampled = sampleFormulaCurve(recipAst, {}, {
      xVar: 'x',
      xMin: -4,
      xMax: 4,
      yMin: -6,
      yMax: 6,
      samples: 160,
    });
    expect(recipSampled.segments.length).toBeGreaterThanOrEqual(2);
    // No single segment should span from negative x to positive x across x = 0
    for (const seg of recipSampled.segments) {
      const hasNeg = seg.some((p) => p.x < 0);
      const hasPos = seg.some((p) => p.x > 0);
      expect(hasNeg && hasPos).toBe(false);
    }

    const tanAst = parseMathExpr('tan(x)', ['x']).ast;
    const tanSampled = sampleFormulaCurve(tanAst, {}, {
      xVar: 'x',
      xMin: -4,
      xMax: 4,
      yMin: -6,
      yMax: 6,
      samples: 160,
    });
    expect(tanSampled.segments.length).toBeGreaterThanOrEqual(3);

    const sqrtAst = parseMathExpr('sqrt(x)', ['x']).ast;
    const sqrtSampled = sampleFormulaCurve(sqrtAst, {}, {
      xVar: 'x',
      xMin: -4,
      xMax: 4,
      yMin: -2,
      yMax: 4,
      samples: 100,
    });
    expect(sqrtSampled.segments.every((seg) => seg.every((p) => p.x >= 0))).toBe(true);
  });

  it('builds accurate step-line coordinates for digital waveforms without diagonal slopes', () => {
    const stepPts = buildStepSeriesPoints([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 0 },
    ]);
    expect(stepPts).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 3, y: 0 },
    ]);
  });
});

describe('Step 4A Schema Validation, Production Compatibility & UI Integration', () => {
  const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step4a-graph-slider-pilot.json');
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as NarratedLesson;

  it('validates all 8 cross-subject pilot slides under dev validation and blocks them at production publish gate (productionVersion: null)', () => {
    expect(fixture.slides.length).toBe(8);

    // Valid under dev-branch validation (allowDevOnlyEngines: true)
    expect(() =>
      assertValidLessonInteractives(fixture, { allowDevOnlyEngines: true }),
    ).not.toThrow();

    // MUST be blocked at production publish gate because graph-slider productionVersion is null
    expect(() => assertValidLessonInteractives(fixture)).toThrow(/not yet deployed in production/i);
  });

  it('rejects CSS/SVG injection in curve color, unknown fields, and invalid challenge references', () => {
    const baseCfg = fixture.slides[1].interactive as GraphSliderInteractiveConfig;

    const badColor = validateSlideInteractiveConfig({
      ...baseCfg,
      curves: [{ ...baseCfg.curves[0], color: 'red; background:url(javascript:alert(1))' }],
    });
    expect(badColor.ok).toBe(false);
    expect(badColor.errors.join(' ')).toMatch(/6-digit hex color/i);

    const badChallengeRef = validateSlideInteractiveConfig({
      ...baseCfg,
      challenges: [
        {
          id: 'bad-ch',
          prompt: 'Check nonexistent slider',
          check: { operator: 'AND', conditions: [{ sliderId: 'missingSlider', target: 1 }] },
          successText: 'Done',
        },
      ],
    });
    expect(badChallengeRef.ok).toBe(false);
    expect(badChallengeRef.errors.join(' ')).toMatch(/unknown sliderId/i);
  });

  it('enforces compound AND challenge on Projectile Motion (requires BOTH theta=45° AND v0=26 m/s) and supports Reset & Low-Data Mode', () => {
    const projectileCfg = fixture.slides[1].interactive as GraphSliderInteractiveConfig;

    // Pure evaluator check: theta=45 with v0=20 MUST FAIL
    expect(
      evaluateGraphChallengeCheck(projectileCfg.challenges![0].check, { theta: 45, v0: 20 }, {}),
    ).toBe(false);
    // theta=45 with v0=26 MUST PASS
    expect(
      evaluateGraphChallengeCheck(projectileCfg.challenges![0].check, { theta: 45, v0: 26 }, {}),
    ).toBe(true);

    // Render live GraphSliderEngine
    const { container } = render(<GraphSliderEngine config={projectileCfg} />);
    const challengeEl = container.querySelector('[data-challenge-id="max-range-at-26"]')!;
    expect(challengeEl.getAttribute('data-challenge-passed')).toBe('false');

    // Click preset 45° (v0 defaults to 26 m/s) -> challenge passes!
    fireEvent.click(screen.getByRole('button', { name: '45°' }));
    expect(challengeEl.getAttribute('data-challenge-passed')).toBe('true');

    // Change speed preset to 20m/s while at 45° -> challenge must immediately revert to false!
    fireEvent.click(screen.getByRole('button', { name: '20m/s' }));
    expect(challengeEl.getAttribute('data-challenge-passed')).toBe('false');

    // Reset restores defaults (60°, 26 m/s)
    fireEvent.click(screen.getByRole('button', { name: /Reset/i }));
    expect(screen.getByText('60 °')).toBeTruthy();
    expect(screen.getByText('26 m/s')).toBeTruthy();

    // Low-Data Mode via InteractiveEngineRegistry
    const stubSlide = fixture.slides[1] as LessonSlide;
    render(<InteractiveEngineRegistry lesson={fixture} slide={stubSlide} lowDataMode={true} />);
    expect(screen.getByText(/Low-Data Summary/i)).toBeTruthy();
  });
});
