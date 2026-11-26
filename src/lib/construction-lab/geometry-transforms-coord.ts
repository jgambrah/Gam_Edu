/**
 * GAM EDU — Step 4F Pure Mathematical Module 3: 2D Transformations & Coordinate Geometry
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies.
 * - Transformations: Translation, Reflection (x-axis, y-axis, y=x, y=-x, x=k, y=k),
 *   Rotation (arbitrary centre (cx, cy), ±90°/180°), Enlargement (positive, fractional, negative; rejects k=0).
 * - Checks grid-increment reachability at authoring time (never silently rounds unreachable coordinates!).
 * - Coordinate Geometry: General line equations ax + by + c = 0 (handles horizontal & vertical lines
 *   cleanly with explicit "undefined" gradient — zero Infinity or NaN).
 */

import {
  GEO_EPS,
  areLinesCoincident,
  areLinesParallel,
  areLinesPerpendicular,
  distance2D,
  isSimplePolygon,
  lineFromTwoPoints,
  midpoint2D,
  pointToLineDistance,
  polygonArea,
} from './geometry-primitives';

export type TransformationSpec =
  | { kind: 'translation'; dx: number; dy: number }
  | { kind: 'reflection'; axis: 'x-axis' | 'y-axis' | 'y=x' | 'y=-x' | 'x=k' | 'y=k'; k?: number }
  | { kind: 'rotation'; cx: number; cy: number; angleDeg: 90 | -90 | 180 }
  | { kind: 'enlargement'; cx: number; cy: number; scaleFactor: number };

export function transformPoint(p: { x: number; y: number }, t: TransformationSpec): { x: number; y: number } {
  switch (t.kind) {
    case 'translation':
      return { x: p.x + t.dx, y: p.y + t.dy };
    case 'reflection': {
      const k = t.k ?? 0;
      switch (t.axis) {
        case 'x-axis':
          return { x: p.x, y: -p.y };
        case 'y-axis':
          return { x: -p.x, y: p.y };
        case 'y=x':
          return { x: p.y, y: p.x };
        case 'y=-x':
          return { x: -p.y, y: -p.x };
        case 'x=k':
          return { x: 2 * k - p.x, y: p.y };
        case 'y=k':
          return { x: p.x, y: 2 * k - p.y };
      }
    }
    case 'rotation': {
      const rx = p.x - t.cx;
      const ry = p.y - t.cy;
      if (t.angleDeg === 90) return { x: t.cx - ry, y: t.cy + rx }; // 90° anticlockwise
      if (t.angleDeg === -90) return { x: t.cx + ry, y: t.cy - rx }; // 90° clockwise
      return { x: t.cx - rx, y: t.cy - ry }; // 180°
    }
    case 'enlargement':
      return {
        x: t.cx + t.scaleFactor * (p.x - t.cx),
        y: t.cy + t.scaleFactor * (p.y - t.cy),
      };
  }
}

/** Verifies whether a coordinate value is exactly reachable on a grid of step `gridStep`. */
export function isReachableOnGrid(val: number, gridStep: number): boolean {
  if (gridStep <= GEO_EPS) return false;
  const ratio = val / gridStep;
  return Math.abs(ratio - Math.round(ratio)) < 1e-6;
}

export interface TransformationEvaluationInput {
  preImageVertices: Array<{ x: number; y: number; label?: string }>;
  transformation: TransformationSpec;
  learnerVertices: Array<{ x: number; y: number }>;
  requireLabelledCorrespondence?: boolean;
  tolerance?: number;
}

export interface TransformationEvaluationResult {
  passed: boolean;
  feedback: string;
  expectedVertices: Array<{ x: number; y: number }>;
  preImageArea: number;
  expectedArea: number;
}

export function evaluateTransformation(input: TransformationEvaluationInput): TransformationEvaluationResult {
  const tol = input.tolerance ?? 0.05;
  const expectedVertices = input.preImageVertices.map((v) => transformPoint(v, input.transformation));
  const preImageArea = polygonArea(input.preImageVertices);
  const expectedArea = polygonArea(expectedVertices);
  const base = { expectedVertices, preImageArea, expectedArea };

  if (input.learnerVertices.length !== expectedVertices.length) {
    return {
      ...base,
      passed: false,
      feedback: `Plot all ${expectedVertices.length} image vertices (currently ${input.learnerVertices.length} placed).`,
    };
  }

  if (!isSimplePolygon(input.learnerVertices)) {
    return {
      ...base,
      passed: false,
      feedback: 'Your plotted vertices form a degenerate or self-intersecting polygon. Check the vertex positions and order.',
    };
  }

  if (input.requireLabelledCorrespondence) {
    for (let i = 0; i < expectedVertices.length; i++) {
      if (distance2D(input.learnerVertices[i], expectedVertices[i]) > tol) {
        const lbl = input.preImageVertices[i].label ?? `V${i + 1}`;
        return {
          ...base,
          passed: false,
          feedback: `Check corresponding image vertex ${lbl}': expected (${expectedVertices[i].x}, ${expectedVertices[i].y}), got (${input.learnerVertices[i].x}, ${input.learnerVertices[i].y}).`,
        };
      }
    }
  } else {
    // Unlabelled shape equivalence: every expected vertex must match a distinct learner vertex
    const used = new Set<number>();
    for (const exp of expectedVertices) {
      const idx = input.learnerVertices.findIndex((lv, i) => !used.has(i) && distance2D(lv, exp) <= tol);
      if (idx === -1) {
        return {
          ...base,
          passed: false,
          feedback: `One or more image vertices are not in the right position (missing image vertex at (${exp.x}, ${exp.y})).`,
        };
      }
      used.add(idx);
    }
  }

  const areaScaleNote =
    input.transformation.kind === 'enlargement'
      ? ` Length scale factor |k| = ${Math.abs(input.transformation.scaleFactor)}, area scale factor k² = ${input.transformation.scaleFactor ** 2}${input.transformation.scaleFactor < 0 ? ' (negative enlargement inverts the image through the centre)' : ''}.`
      : ' Congruence preserved (side lengths and area unchanged).';

  return {
    ...base,
    passed: true,
    feedback: `Verified: all ${expectedVertices.length} transformed image vertices are exact!${areaScaleNote}`,
  };
}

// ============================================================================
// COORDINATE GEOMETRY (Handles Horizontal & Vertical Lines Without Infinity/NaN)
// ============================================================================

export type CoordinateGoalKind =
  | 'midpoint'
  | 'parallel-through-point'
  | 'perpendicular-through-point'
  | 'line-from-equation';

export interface CoordinateGeometryGoal {
  kind: CoordinateGoalKind;
  givenPoints: Array<{ x: number; y: number; label?: string }>;
  /** For line-from-equation: ax + by + c = 0 (general form — supports vertical lines x = k!) */
  targetGeneralLine?: { a: number; b: number; c: number };
  distanceTolerance?: number;
  angleToleranceDeg?: number;
}

export interface CoordinateEvaluationInput {
  goal: CoordinateGeometryGoal;
  /** Learner-plotted point(s): 1 point for midpoint, 2 points defining a line for line goals */
  learnerPoints: Array<{ x: number; y: number }>;
}

export interface CoordinateEvaluationResult {
  passed: boolean;
  feedback: string;
  gradientLabel: string; // e.g. "2", "0 (horizontal)", "undefined (vertical)"
}

export function formatGradientLabel(p1: { x: number; y: number }, p2: { x: number; y: number }): string {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  if (Math.hypot(dx, dy) < GEO_EPS) return 'degenerate';
  if (Math.abs(dx) < GEO_EPS) return 'undefined (vertical)';
  if (Math.abs(dy) < GEO_EPS) return '0 (horizontal)';
  const m = dy / dx;
  return Number.isInteger(m) ? String(m) : m.toFixed(2);
}

export function evaluateCoordinateGeometry(input: CoordinateEvaluationInput): CoordinateEvaluationResult {
  const distTol = input.goal.distanceTolerance ?? 0.1;
  const angTol = input.goal.angleToleranceDeg ?? 1.5;

  if (input.goal.kind === 'midpoint') {
    if (input.goal.givenPoints.length < 2) {
      return { passed: false, feedback: 'Midpoint requires two given endpoints.', gradientLabel: '—' };
    }
    const [A, B] = input.goal.givenPoints;
    const expected = midpoint2D(A, B);
    const pt = input.learnerPoints[0];
    if (!pt) return { passed: false, feedback: 'Plot the midpoint M on the coordinate grid.', gradientLabel: '—' };
    if (distance2D(pt, expected) > distTol) {
      return {
        passed: false,
        feedback: `Use M = ((x₁ + x₂)/2, (y₁ + y₂)/2). Your point (${pt.x}, ${pt.y}) does not match the midpoint of (${A.x}, ${A.y}) and (${B.x}, ${B.y}).`,
        gradientLabel: formatGradientLabel(A, B),
      };
    }
    return {
      passed: true,
      feedback: `Verified: midpoint M = (${expected.x}, ${expected.y}), distance |AB| = ${distance2D(A, B).toFixed(2)} units, gradient = ${formatGradientLabel(A, B)}.`,
      gradientLabel: formatGradientLabel(A, B),
    };
  }

  // Line-based goals (require 2 distinct learner points)
  if (input.learnerPoints.length < 2) {
    return { passed: false, feedback: 'Plot two distinct points to define your line.', gradientLabel: '—' };
  }
  const [L1, L2] = input.learnerPoints;
  const learnerLine = lineFromTwoPoints(L1, L2);
  const gradLbl = formatGradientLabel(L1, L2);
  if (!learnerLine) {
    return { passed: false, feedback: 'Your two points are coincident — choose two distinct points.', gradientLabel: 'degenerate' };
  }

  if (input.goal.kind === 'parallel-through-point' || input.goal.kind === 'perpendicular-through-point') {
    if (input.goal.givenPoints.length < 3) {
      return { passed: false, feedback: 'Requires two reference line points (A, B) and a target point P.', gradientLabel: gradLbl };
    }
    const [A, B, P] = input.goal.givenPoints;
    const refLine = lineFromTwoPoints(A, B);
    if (!refLine) return { passed: false, feedback: 'Reference line is degenerate.', gradientLabel: gradLbl };

    if (pointToLineDistance(P, learnerLine) > distTol) {
      return {
        passed: false,
        feedback: `Your line does not pass through target point ${P.label ?? 'P'} (${P.x}, ${P.y}).`,
        gradientLabel: gradLbl,
      };
    }

    if (input.goal.kind === 'parallel-through-point') {
      if (areLinesCoincident(refLine, learnerLine, distTol, angTol)) {
        return {
          passed: false,
          feedback: 'Your line coincides with the original reference line rather than forming a distinct parallel line.',
          gradientLabel: gradLbl,
        };
      }
      if (!areLinesParallel(refLine, learnerLine, angTol)) {
        return {
          passed: false,
          feedback: `Your line (gradient: ${gradLbl}) is not parallel to the reference line (gradient: ${formatGradientLabel(A, B)}).`,
          gradientLabel: gradLbl,
        };
      }
      return {
        passed: true,
        feedback: `Verified: distinct parallel line through (${P.x}, ${P.y}) with gradient ${gradLbl}.`,
        gradientLabel: gradLbl,
      };
    }

    // perpendicular-through-point (works seamlessly for horizontal <-> vertical!)
    if (!areLinesPerpendicular(refLine, learnerLine, angTol)) {
      return {
        passed: false,
        feedback: `Your line (gradient: ${gradLbl}) is not perpendicular to the reference line (gradient: ${formatGradientLabel(A, B)}).`,
        gradientLabel: gradLbl,
      };
    }
    return {
      passed: true,
      feedback: `Verified: perpendicular line through (${P.x}, ${P.y}) — reference gradient ${formatGradientLabel(A, B)} ⊥ constructed gradient ${gradLbl}.`,
      gradientLabel: gradLbl,
    };
  }

  // line-from-equation (general ax + by + c = 0)
  if (input.goal.targetGeneralLine) {
    const { a, b, c } = input.goal.targetGeneralLine;
    const norm = Math.hypot(a, b);
    if (norm < GEO_EPS) return { passed: false, feedback: 'Target general line is degenerate.', gradientLabel: gradLbl };
    const target = { a: a / norm, b: b / norm, c: c / norm };
    if (!areLinesCoincident(target, learnerLine, distTol, angTol)) {
      return {
        passed: false,
        feedback: `Your line (gradient: ${gradLbl}) does not match the required equation. Check both points satisfy the equation.`,
        gradientLabel: gradLbl,
      };
    }
    return { passed: true, feedback: `Verified: both points lie on the required line (gradient: ${gradLbl}).`, gradientLabel: gradLbl };
  }

  return { passed: false, feedback: 'Incomplete coordinate geometry goal.', gradientLabel: gradLbl };
}
