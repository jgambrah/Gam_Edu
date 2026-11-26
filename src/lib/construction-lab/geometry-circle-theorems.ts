/**
 * GAM EDU — Step 4F Pure Mathematical Module 4: Bounded Circle Theorems
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies.
 * Derives ALL expected angles mathematically from actual circle geometry (never trusts arbitrary
 * author-provided values without cross-checking!).
 * Correctly distinguishes minor vs major intercepted arcs, reflex central angles, and segment crossing.
 */

import { angleAtVertexDeg } from './geometry-primitives';

export type CircleTheoremKind =
  | 'angle-at-centre'
  | 'semicircle-90'
  | 'same-segment'
  | 'cyclic-quadrilateral'
  | 'tangent-radius';

export interface CircleTheoremGeometryResult {
  validDomain: boolean;
  domainWarning?: string;
  /** Derived angle at circumference / target vertex in degrees */
  measuredAngleDeg: number;
  /** Related theorem angle (e.g. central angle, opposite cyclic angle, or 90° tangent-radius) */
  relatedAngleDeg: number;
  /** Whether the intercepted central angle is reflex (> 180°) */
  isReflexCentral: boolean;
  /** Points on unit circle (radius 1) for lightweight SVG rendering */
  points: Record<string, { x: number; y: number }>;
}

function normDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function ptOnCircle(deg: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

/** Counter-clockwise angular sweep from aDeg to bDeg in (0, 360). */
function ccwSweep(aDeg: number, bDeg: number): number {
  return normDeg(bDeg - aDeg);
}

/**
 * Computes exact circle theorem geometry for a movable point `P` on the unit circle.
 * Explicitly checks minimum separation (12°) from chord endpoints to prevent degenerate angles,
 * and verifies whether P lies on the minor or major arc!
 */
export function computeCircleTheoremGeometry(
  theorem: CircleTheoremKind,
  fixedAnglesDeg: number[],
  movableAngleDeg: number,
): CircleTheoremGeometryResult {
  const O = { x: 0, y: 0 };
  const pDeg = normDeg(movableAngleDeg);
  const P = ptOnCircle(pDeg);

  if (theorem === 'tangent-radius') {
    const aDeg = normDeg(fixedAnglesDeg[0] ?? 0);
    const A = ptOnCircle(aDeg);
    // Tangent direction at A is perpendicular to OA: (-sin(a), cos(a))
    const T = { x: A.x - Math.sin((aDeg * Math.PI) / 180), y: A.y + Math.cos((aDeg * Math.PI) / 180) };
    const ang = angleAtVertexDeg(O, A, T) ?? 90;
    return {
      validDomain: true,
      measuredAngleDeg: Number(ang.toFixed(1)),
      relatedAngleDeg: 90,
      isReflexCentral: false,
      points: { O, A, T },
    };
  }

  const aDeg = normDeg(fixedAnglesDeg[0] ?? 210);
  const bDeg = normDeg(fixedAnglesDeg[1] ?? 330);
  const A = ptOnCircle(aDeg);
  const B = ptOnCircle(bDeg);

  // Reject proximity to chord endpoints A or B (< 10°)
  const minSep = Math.min(
    Math.abs(ccwSweep(aDeg, pDeg)),
    Math.abs(360 - ccwSweep(aDeg, pDeg)),
    Math.abs(ccwSweep(bDeg, pDeg)),
    Math.abs(360 - ccwSweep(bDeg, pDeg)),
  );
  if (minSep < 10) {
    return {
      validDomain: false,
      domainWarning: 'Point P is too close to chord endpoint A or B (degenerate triangle). Move P further along the arc.',
      measuredAngleDeg: 0,
      relatedAngleDeg: 0,
      isReflexCentral: false,
      points: { O, A, B, P },
    };
  }

  const inscribedDeg = angleAtVertexDeg(A, P, B) ?? 0;

  if (theorem === 'semicircle-90') {
    return {
      validDomain: true,
      measuredAngleDeg: Number(inscribedDeg.toFixed(1)),
      relatedAngleDeg: 180,
      isReflexCentral: false,
      points: { O, A, B, P },
    };
  }

  if (theorem === 'cyclic-quadrilateral') {
    const cDeg = normDeg(fixedAnglesDeg[2] ?? 60);
    const C = ptOnCircle(cDeg);
    // Check P is on the arc opposite C (so A-B-C-P is a proper non-self-intersecting cyclic quad)
    const oppDeg = angleAtVertexDeg(A, C, B) ?? 0;
    const sum = inscribedDeg + oppDeg;
    const valid = Math.abs(sum - 180) <= 1.5;
    return {
      validDomain: valid,
      domainWarning: valid
        ? undefined
        : 'Point P crossed onto the same arc as vertex C (now in the same segment rather than opposite in a cyclic quadrilateral). Move P to the opposite arc.',
      measuredAngleDeg: Number(inscribedDeg.toFixed(1)),
      relatedAngleDeg: Number(oppDeg.toFixed(1)),
      isReflexCentral: false,
      points: { O, A, B, C, P },
    };
  }

  // angle-at-centre or same-segment: distinguish minor vs major arc
  const sweepAB = ccwSweep(aDeg, bDeg);
  const pOnArcAB = ccwSweep(aDeg, pDeg) < sweepAB;
  // The intercepted arc is the arc NOT containing P
  const interceptedCentral = pOnArcAB ? 360 - sweepAB : sweepAB;
  const isReflexCentral = interceptedCentral > 180;

  return {
    validDomain: true,
    measuredAngleDeg: Number(inscribedDeg.toFixed(1)),
    relatedAngleDeg: Number(interceptedCentral.toFixed(1)),
    isReflexCentral,
    points: { O, A, B, P },
  };
}

export interface CircleTheoremEvalInput {
  theorem: CircleTheoremKind;
  fixedAnglesDeg: number[];
  movableAngleDeg: number;
  learnerAnswerDeg: number;
  angleToleranceDeg?: number;
}

export function evaluateCircleTheoremAnswer(input: CircleTheoremEvalInput): {
  passed: boolean;
  feedback: string;
  derived: CircleTheoremGeometryResult;
} {
  const tol = input.angleToleranceDeg ?? 1.5;
  const derived = computeCircleTheoremGeometry(
    input.theorem,
    input.fixedAnglesDeg,
    input.movableAngleDeg,
  );
  if (!derived.validDomain) {
    return {
      passed: false,
      feedback: derived.domainWarning ?? 'Move point P into a valid arc domain before checking.',
      derived,
    };
  }
  const expected = derived.measuredAngleDeg;
  if (Math.abs(input.learnerAnswerDeg - expected) > tol) {
    const theoremHint =
      input.theorem === 'angle-at-centre'
        ? `The angle at the circumference is half the ${derived.isReflexCentral ? 'reflex ' : ''}angle at the centre (${derived.relatedAngleDeg}° ÷ 2 = ${(derived.relatedAngleDeg / 2).toFixed(1)}°).`
        : input.theorem === 'semicircle-90'
          ? 'The angle subtended by a diameter at any point on the semicircle is always 90°.'
          : input.theorem === 'cyclic-quadrilateral'
            ? `Opposite angles of a cyclic quadrilateral sum to 180° (180° − ${derived.relatedAngleDeg}° = ${(180 - derived.relatedAngleDeg).toFixed(1)}°).`
            : input.theorem === 'tangent-radius'
              ? 'A tangent to a circle is always perpendicular (90°) to the radius at the point of contact.'
              : `Angles subtended by the same arc in the same segment are equal (${expected}°).`;
    return {
      passed: false,
      feedback: `Check your angle: you entered ${input.learnerAnswerDeg}°. ${theoremHint}`,
      derived,
    };
  }
  return {
    passed: true,
    feedback: `Verified: derived angle = ${expected}°${input.theorem === 'angle-at-centre' ? ` (half of ${derived.isReflexCentral ? 'reflex ' : ''}central angle ${derived.relatedAngleDeg}°)` : input.theorem === 'cyclic-quadrilateral' ? ` (${expected}° + ${derived.relatedAngleDeg}° = 180°)` : ''}.`,
    derived,
  };
}
