/**
 * Pure, testable curve sampler, discontinuity detector, projectile landing interpolator,
 * piecewise/step point-series builder, and compound challenge evaluator for GraphSliderEngine (Step 4A).
 */

import { evaluateMathAst, type MathAstNode } from './math-expr';

export interface GraphPoint {
  x: number;
  y: number;
}

export interface SampleCurveOptions {
  xVar: string;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  samples: number;
  domainMin?: number;
  domainMax?: number;
  stopAtYZero?: boolean;
}

export interface SampledCurveResult {
  /** Disjoint continuous polyline segments (broken at NaN, domain boundaries, and detected asymptotes). */
  segments: GraphPoint[][];
  /** Optional refined landing point when `stopAtYZero` finds a root after rising above y = 0. */
  landingX?: number;
}

/**
 * Samples a pre-parsed formula AST across `[xStart, xEnd]` with:
 * - Accurate `stopAtYZero` root bisection (12 iterations) that does NOT stop at the initial launch point.
 * - Bounded discontinuity / asymptote detection (breaks polyline across poles like 1/x and tan(x)
 *   even when grid sampling misses the exact undefined point).
 * - Preserves true coordinates for SVG `<clipPath>` clipping (never flattens curves onto yMin/yMax).
 */
export function sampleFormulaCurve(
  ast: MathAstNode,
  sliderValues: Readonly<Record<string, number>>,
  opts: SampleCurveOptions
): SampledCurveResult {
  const xStart = Math.max(opts.xMin, opts.domainMin ?? opts.xMin);
  const xEnd = Math.min(opts.xMax, opts.domainMax ?? opts.xMax);
  if (xEnd <= xStart || opts.samples < 2) {
    return { segments: [] };
  }

  const ySpan = Math.max(1e-6, opts.yMax - opts.yMin);
  const jumpThreshold = ySpan * 1.5;
  const extremeBound = ySpan * 4;
  const step = (xEnd - xStart) / (opts.samples - 1);

  const evalAt = (x: number): number => evaluateMathAst(ast, { ...sliderValues, [opts.xVar]: x });

  const segments: GraphPoint[][] = [];
  let current: GraphPoint[] = [];
  let hasRisen = false;
  let landingX: number | undefined;

  const flush = () => {
    if (current.length > 0) {
      segments.push(current);
      current = [];
    }
  };

  for (let i = 0; i < opts.samples; i++) {
    const x = i === opts.samples - 1 ? xEnd : xStart + i * step;
    const y = evalAt(x);

    if (!Number.isFinite(y)) {
      flush();
      continue;
    }

    if (opts.stopAtYZero) {
      if (y > 1e-9) {
        hasRisen = true;
      } else if (hasRisen && y <= 0 && current.length > 0) {
        // Bisect between previous positive point and current <= 0 point to locate exact landing root
        const prev = current[current.length - 1];
        let lo = prev.x;
        let hi = x;
        for (let iter = 0; iter < 12; iter++) {
          const mid = 0.5 * (lo + hi);
          const ym = evalAt(mid);
          if (!Number.isFinite(ym)) break;
          if (ym > 0) lo = mid;
          else hi = mid;
        }
        landingX = 0.5 * (lo + hi);
        current.push({ x: landingX, y: 0 });
        flush();
        return { segments, landingX };
      }
    }

    // Extreme out-of-viewport values (e.g. near vertical asymptote) should not anchor false connecting lines
    if (y > opts.yMax + extremeBound || y < opts.yMin - extremeBound) {
      flush();
      continue;
    }

    if (current.length > 0) {
      const prev = current[current.length - 1];
      const dy = Math.abs(y - prev.y);
      const signFlip = (prev.y > 0 && y < 0) || (prev.y < 0 && y > 0);

      // Discontinuity heuristic:
      // 1) Large jump across a sign flip (e.g. 1/x or tan(x) crossing vertical asymptote)
      // 2) Confirm via midpoint probe: if midpoint blows up or reverses direction sharply, break segment
      if (dy > jumpThreshold && signFlip) {
        const midY = evalAt(0.5 * (prev.x + x));
        const prevOutside = prev.y > opts.yMax || prev.y < opts.yMin;
        const currOutside = y > opts.yMax || y < opts.yMin;
        if (
          !Number.isFinite(midY) ||
          Math.abs(midY) > Math.max(Math.abs(prev.y), Math.abs(y)) ||
          prevOutside ||
          currOutside
        ) {
          flush();
        }
      }
    }

    current.push({ x, y });
  }

  flush();
  return { segments, landingX };
}

/**
 * Converts a discrete point series into step-line coordinates (horizontal-then-vertical),
 * ideal for Computer Science digital logic waveforms (0/1 signals).
 */
export function buildStepSeriesPoints(points: readonly GraphPoint[]): GraphPoint[] {
  if (points.length === 0) return [];
  const out: GraphPoint[] = [points[0]];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    if (curr.y !== prev.y) {
      out.push({ x: curr.x, y: prev.y });
    }
    out.push(curr);
  }
  return out;
}

export interface GraphChallengeCondition {
  sliderId?: string;
  readoutId?: string;
  min?: number;
  max?: number;
  target?: number;
  tolerance?: number;
}

export interface GraphChallengeCheck {
  operator: 'AND' | 'OR';
  conditions: GraphChallengeCondition[];
}

export function evaluateChallengeCondition(
  cond: GraphChallengeCondition,
  sliderValues: Readonly<Record<string, number>>,
  readoutValues: Readonly<Record<string, number>>
): boolean {
  const val = cond.sliderId
    ? sliderValues[cond.sliderId]
    : cond.readoutId
      ? readoutValues[cond.readoutId]
      : Number.NaN;

  if (!Number.isFinite(val)) return false;

  if (typeof cond.target === 'number') {
    const tol = typeof cond.tolerance === 'number' ? Math.abs(cond.tolerance) : 1e-6;
    return Math.abs(val - cond.target) <= tol;
  }

  if (typeof cond.min === 'number' && val < cond.min - 1e-9) return false;
  if (typeof cond.max === 'number' && val > cond.max + 1e-9) return false;
  return typeof cond.min === 'number' || typeof cond.max === 'number';
}

export function evaluateGraphChallengeCheck(
  check: GraphChallengeCheck,
  sliderValues: Readonly<Record<string, number>>,
  readoutValues: Readonly<Record<string, number>>
): boolean {
  if (check.conditions.length === 0) return false;
  if (check.operator === 'AND') {
    return check.conditions.every((c) => evaluateChallengeCondition(c, sliderValues, readoutValues));
  }
  return check.conditions.some((c) => evaluateChallengeCondition(c, sliderValues, readoutValues));
}
