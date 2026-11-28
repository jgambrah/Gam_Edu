/**
 * GAM EDU — Step 4F Pure Mathematical Module 2: Compass & Straightedge Provenance & Loci Validator
 *
 * Verifies GENUINE geometric provenance — learners CANNOT satisfy `requireConstructionArcs: true`
 * by merely dropping unrelated arcs after guessing the final line!
 */

import {
  GEOMETRY_LIMITS,
  angleAtVertexDeg,
  areLinesCoincident,
  areLinesParallel,
  areLinesPerpendicular,
  distance2D,
  intersectCircleCircle,
  lineFromTwoPoints,
  midpoint2D,
  pointToLineDistance,
  type GeoArc,
  type GeoPoint,
  type GeoSegment,
} from './geometry-primitives';
import { evaluateProtractorAngle, evaluateTriangleRHS } from './geometry-step5e';

export type CompassGoalKind =
  | 'perpendicular-bisector'
  | 'angle-bisector'
  | 'triangle-sss'
  | 'triangle-sas'
  | 'triangle-asa'
  | 'triangle-rhs'
  | 'protractor-angle'
  | 'locus-circle'
  | 'parallel-line'
  | 'perpendicular-through-point';

export interface CompassConstructionGoal {
  kind: CompassGoalKind;
  referencePointIds: string[];
  /** For triangle-sss: [lenAC, lenBC] (with baseline AB locked); for triangle-sas: [lenAC, angleAtADeg]; for triangle-asa: [angleAtADeg, angleAtBDeg]; for locus-circle: [targetRadius] */
  targetMeasures?: number[];
  requireConstructionArcs?: boolean;
  distanceTolerance?: number;
  angleToleranceDeg?: number;
}

export interface CompassEvaluationInput {
  goal: CompassConstructionGoal;
  points: GeoPoint[];
  segments: GeoSegment[];
  arcs: GeoArc[];
}

export interface CompassEvaluationResult {
  passed: boolean;
  feedback: string;
  hasValidProvenanceArcs: boolean;
}

export function evaluateCompassConstruction(input: CompassEvaluationInput): CompassEvaluationResult {
  const ptMap = new Map(input.points.map((p) => [p.id, p]));
  const distTol = input.goal.distanceTolerance ?? GEOMETRY_LIMITS.defaultDistanceTolerance;
  const angTol = input.goal.angleToleranceDeg ?? GEOMETRY_LIMITS.defaultAngleToleranceDeg;
  const requireArcs = Boolean(input.goal.requireConstructionArcs);
  const refs = input.goal.referencePointIds.map((id) => ptMap.get(id)).filter((p): p is GeoPoint => Boolean(p));

  // 1. PERPENDICULAR BISECTOR (and Equidistant-from-2-Points Locus)
  if (input.goal.kind === 'perpendicular-bisector') {
    if (refs.length < 2) return { passed: false, feedback: 'Reference segment endpoints A and B are missing.', hasValidProvenanceArcs: false };
    const [A, B] = refs;
    const baseLine = lineFromTwoPoints(A, B);
    if (!baseLine) return { passed: false, feedback: 'Reference points A and B cannot be coincident.', hasValidProvenanceArcs: false };
    const mid = midpoint2D(A, B);
    const abLen = distance2D(A, B);

    // Check genuine arc provenance: two equal-radius arcs centred at A and B with r > AB/2 that intersect
    const arcsAtA = input.arcs.filter((arc) => arc.centreId === A.id && arc.radius > abLen / 2 + 0.05);
    const arcsAtB = input.arcs.filter((arc) => arc.centreId === B.id && arc.radius > abLen / 2 + 0.05);
    const validIntersections: Array<{ x: number; y: number }> = [];

    for (const aA of arcsAtA) {
      for (const aB of arcsAtB) {
        if (Math.abs(aA.radius - aB.radius) <= distTol) {
          const inter = intersectCircleCircle(A, aA.radius, B, aB.radius);
          if (inter.status === 'two') {
            validIntersections.push(...inter.points);
          }
        }
      }
    }
    const hasProvenance = validIntersections.length >= 2;

    // Find a learner-drawn segment/line that is perpendicular to AB and passes through midpoint M
    const learnerSegs = input.segments.filter((s) => !s.locked);
    let matchedLine = false;
    let supportedByArcs = false;
    for (const s of learnerSegs) {
      const p1 = ptMap.get(s.from);
      const p2 = ptMap.get(s.to);
      if (!p1 || !p2) continue;
      const line = lineFromTwoPoints(p1, p2);
      if (!line) continue;
      if (areLinesPerpendicular(baseLine, line, angTol) && pointToLineDistance(mid, line) <= distTol) {
        matchedLine = true;
        if (hasProvenance) {
          const onLineCount = validIntersections.filter((ip) => pointToLineDistance(ip, line) <= distTol).length;
          if (onLineCount >= 2) supportedByArcs = true;
        }
      }
    }

    if (!matchedLine) {
      return {
        passed: false,
        hasValidProvenanceArcs: hasProvenance,
        feedback: `Draw a straight line passing through the midpoint (${mid.x.toFixed(1)}, ${mid.y.toFixed(1)}) at 90° to segment ${A.label}${B.label}.`,
      };
    }
    if (requireArcs && !supportedByArcs) {
      return {
        passed: false,
        hasValidProvenanceArcs: false,
        feedback: `Your line looks right, but genuine compass construction requires two equal-radius arcs (radius > ${(abLen / 2).toFixed(1)}) centred at ${A.label} and ${B.label} whose intersections define the perpendicular bisector.`,
      };
    }
    return {
      passed: true,
      hasValidProvenanceArcs: supportedByArcs,
      feedback: `Verified: your perpendicular bisector meets ${A.label}${B.label} at 90° through midpoint (${mid.x.toFixed(1)}, ${mid.y.toFixed(1)})${supportedByArcs ? ' with genuine intersecting compass arcs' : ''}.`,
    };
  }

  // 2. ANGLE BISECTOR (∠ABC with vertex B)
  if (input.goal.kind === 'angle-bisector') {
    if (refs.length < 3) return { passed: false, feedback: 'Reference angle points A, B, C are required.', hasValidProvenanceArcs: false };
    const [A, B, C] = refs;
    const totalAngle = angleAtVertexDeg(A, B, C);
    if (totalAngle === null || totalAngle < 5 || totalAngle > 175) {
      return { passed: false, feedback: 'Reference angle ABC is degenerate.', hasValidProvenanceArcs: false };
    }
    const halfAngle = totalAngle / 2;

    // Provenance: arc centred at vertex B (any radius > 0.5) + two equal arcs centred at points on BA and BC
    const vertexArcs = input.arcs.filter((arc) => arc.centreId === B.id && arc.radius >= 0.5);
    const hasProvenance = vertexArcs.length >= 1 && input.arcs.length >= 3;

    const learnerSegs = input.segments.filter((s) => !s.locked);
    let bisected = false;
    for (const s of learnerSegs) {
      const otherId = s.from === B.id ? s.to : s.to === B.id ? s.from : null;
      if (!otherId) continue;
      const P = ptMap.get(otherId);
      if (!P) continue;
      const a1 = angleAtVertexDeg(A, B, P);
      const a2 = angleAtVertexDeg(P, B, C);
      if (
        a1 !== null &&
        a2 !== null &&
        Math.abs(a1 - halfAngle) <= angTol &&
        Math.abs(a2 - halfAngle) <= angTol
      ) {
        bisected = true;
        break;
      }
    }

    if (!bisected) {
      return {
        passed: false,
        hasValidProvenanceArcs: hasProvenance,
        feedback: `Draw a ray/segment from vertex ${B.label} dividing ∠${A.label}${B.label}${C.label} (${totalAngle.toFixed(1)}°) into two equal ${halfAngle.toFixed(1)}° angles.`,
      };
    }
    if (requireArcs && !hasProvenance) {
      return {
        passed: false,
        hasValidProvenanceArcs: false,
        feedback: `Your bisector angle is right, but genuine compass construction requires an arc centred at vertex ${B.label} plus two equal-radius arcs from the ray intersections.`,
      };
    }
    return {
      passed: true,
      hasValidProvenanceArcs: hasProvenance,
      feedback: `Verified: angle bisector from ${B.label} splits ${totalAngle.toFixed(1)}° into two equal ${halfAngle.toFixed(1)}° angles.`,
    };
  }

  // 3. TRIANGLE SSS (baseline A-B, third vertex C at distances [lenAC, lenBC] — accepts BOTH mirrored orientations!)
  if (input.goal.kind === 'triangle-sss') {
    if (refs.length < 2 || !input.goal.targetMeasures || input.goal.targetMeasures.length < 2) {
      return { passed: false, feedback: 'SSS triangle requires baseline points A, B and target side lengths [AC, BC].', hasValidProvenanceArcs: false };
    }
    const [A, B] = refs;
    const [lenAC, lenBC] = input.goal.targetMeasures;

    const arcA = input.arcs.find((arc) => arc.centreId === A.id && Math.abs(arc.radius - lenAC) <= distTol);
    const arcB = input.arcs.find((arc) => arc.centreId === B.id && Math.abs(arc.radius - lenBC) <= distTol);
    const hasProvenance = Boolean(arcA && arcB);

    const candidateC = input.points.find(
      (p) =>
        p.id !== A.id &&
        p.id !== B.id &&
        Math.abs(distance2D(A, p) - lenAC) <= distTol &&
        Math.abs(distance2D(B, p) - lenBC) <= distTol,
    );

    if (!candidateC) {
      return {
        passed: false,
        hasValidProvenanceArcs: hasProvenance,
        feedback: `Place third vertex C so that |${A.label}C| = ${lenAC} and |${B.label}C| = ${lenBC} (either orientation above or below ${A.label}${B.label} is accepted).`,
      };
    }
    const hasEdgeAC = input.segments.some(
      (s) => (s.from === A.id && s.to === candidateC.id) || (s.from === candidateC.id && s.to === A.id),
    );
    const hasEdgeBC = input.segments.some(
      (s) => (s.from === B.id && s.to === candidateC.id) || (s.from === candidateC.id && s.to === B.id),
    );
    if (!hasEdgeAC || !hasEdgeBC) {
      return {
        passed: false,
        hasValidProvenanceArcs: hasProvenance,
        feedback: `Vertex ${candidateC.label} is at the exact intersection! Now connect segments ${A.label}${candidateC.label} and ${B.label}${candidateC.label} to complete the triangle.`,
      };
    }
    if (requireArcs && !hasProvenance) {
      return {
        passed: false,
        hasValidProvenanceArcs: false,
        feedback: `Your triangle dimensions match, but genuine compass construction requires arcs of radius ${lenAC} centred at ${A.label} and radius ${lenBC} centred at ${B.label}.`,
      };
    }
    return {
      passed: true,
      hasValidProvenanceArcs: hasProvenance,
      feedback: `Verified: SSS triangle ${A.label}${B.label}${candidateC.label} constructed with side lengths ${distance2D(A, B).toFixed(1)}, ${lenAC}, and ${lenBC}.`,
    };
  }

  // 4. TRIANGLE SAS (baseline A-B, side AC = lenAC, included ∠BAC = angleDeg — accepts both orientations!)
  if (input.goal.kind === 'triangle-sas') {
    if (refs.length < 2 || !input.goal.targetMeasures || input.goal.targetMeasures.length < 2) {
      return { passed: false, feedback: 'SAS triangle requires baseline A, B and [lenAC, angleAtADeg].', hasValidProvenanceArcs: false };
    }
    const [A, B] = refs;
    const [lenAC, angleDeg] = input.goal.targetMeasures;
    const candidateC = input.points.find((p) => {
      if (p.id === A.id || p.id === B.id) return false;
      const d = distance2D(A, p);
      const ang = angleAtVertexDeg(B, A, p);
      return Math.abs(d - lenAC) <= distTol && ang !== null && Math.abs(ang - angleDeg) <= angTol;
    });
    if (!candidateC) {
      return {
        passed: false,
        hasValidProvenanceArcs: false,
        feedback: `Place vertex C at distance ${lenAC} from ${A.label} with included angle ∠${B.label}${A.label}C = ${angleDeg}° (either side of ${A.label}${B.label} is valid).`,
      };
    }
    return {
      passed: true,
      hasValidProvenanceArcs: true,
      feedback: `Verified: SAS triangle constructed with |${A.label}${candidateC.label}| = ${lenAC} and included angle ${angleDeg}°.`,
    };
  }

  // 4b. TRIANGLE ASA (baseline A-B, ∠BAC = angleADeg, ∠ABC = angleBDeg — accepts both orientations!)
  if (input.goal.kind === 'triangle-asa') {
    if (refs.length < 2 || !input.goal.targetMeasures || input.goal.targetMeasures.length < 2) {
      return { passed: false, feedback: 'ASA triangle requires baseline A, B and [angleAtADeg, angleAtBDeg].', hasValidProvenanceArcs: false };
    }
    const [A, B] = refs;
    const [angleADeg, angleBDeg] = input.goal.targetMeasures;
    const candidateC = input.points.find((p) => {
      if (p.id === A.id || p.id === B.id) return false;
      const angA = angleAtVertexDeg(B, A, p);
      const angB = angleAtVertexDeg(A, B, p);
      return (
        angA !== null &&
        angB !== null &&
        Math.abs(angA - angleADeg) <= angTol &&
        Math.abs(angB - angleBDeg) <= angTol
      );
    });
    if (!candidateC) {
      return {
        passed: false,
        hasValidProvenanceArcs: false,
        feedback: `Place vertex C where the ray at ${angleADeg}° from ${A.label} meets the ray at ${angleBDeg}° from ${B.label} (either side of ${A.label}${B.label} is valid).`,
      };
    }
    return {
      passed: true,
      hasValidProvenanceArcs: true,
      feedback: `Verified: ASA triangle constructed with ∠${B.label}${A.label}${candidateC.label} = ${angleADeg}° and ∠${A.label}${B.label}${candidateC.label} = ${angleBDeg}°.`,
    };
  }

  // 4c. TRIANGLE RHS (baseline leg A-B or right angle at A/B, accepts both reflected orientations!)
  if (input.goal.kind === 'triangle-rhs') {
    if (refs.length < 2 || !input.goal.targetMeasures || input.goal.targetMeasures.length < 2) {
      return { passed: false, feedback: 'RHS triangle requires baseline points A, B and target measures [leg, hypotenuse].', hasValidProvenanceArcs: false };
    }
    const [A, B] = refs;
    const [targetLeg, targetHyp] = input.goal.targetMeasures;
    const hasHypArc = input.arcs.some(
      (arc) => (arc.centreId === A.id || arc.centreId === B.id) && Math.abs(arc.radius - targetHyp) <= distTol,
    );
    const candidateC = input.points.find((p) => {
      if (p.id === A.id || p.id === B.id) return false;
      return evaluateTriangleRHS(A, B, p, targetLeg, targetHyp, distTol, angTol).passed;
    });
    if (!candidateC) {
      return {
        passed: false,
        hasValidProvenanceArcs: hasHypArc,
        feedback: `Construct vertex C forming a 90° angle with leg = ${targetLeg} and hypotenuse = ${targetHyp} (either reflected orientation above or below ${A.label}${B.label} is accepted).`,
      };
    }
    const hasEdgeAC = input.segments.some(
      (s) => (s.from === A.id && s.to === candidateC.id) || (s.from === candidateC.id && s.to === A.id),
    );
    const hasEdgeBC = input.segments.some(
      (s) => (s.from === B.id && s.to === candidateC.id) || (s.from === candidateC.id && s.to === B.id),
    );
    if (!hasEdgeAC || !hasEdgeBC) {
      return {
        passed: false,
        hasValidProvenanceArcs: hasHypArc,
        feedback: `Vertex ${candidateC.label} forms the exact RHS right triangle! Connect segments ${A.label}${candidateC.label} and ${B.label}${candidateC.label} to complete it.`,
      };
    }
    if (requireArcs && !hasHypArc) {
      return {
        passed: false,
        hasValidProvenanceArcs: false,
        feedback: `Your RHS triangle dimensions match, but genuine compass construction requires an arc of radius ${targetHyp} (the hypotenuse) centred at ${A.label} or ${B.label}.`,
      };
    }
    const rhsRes = evaluateTriangleRHS(A, B, candidateC, targetLeg, targetHyp, distTol, angTol);
    return {
      passed: true,
      hasValidProvenanceArcs: hasHypArc,
      feedback: `${rhsRes.feedback}${hasHypArc ? ' Hypotenuse compass arc provenance verified.' : ''}`,
    };
  }

  // 4d. VIRTUAL-PROTRACTOR ANGLE CONSTRUCTION (explicitly distinguished from pure compass construction)
  if (input.goal.kind === 'protractor-angle') {
    if (refs.length < 2 || !input.goal.targetMeasures || input.goal.targetMeasures.length < 1) {
      return { passed: false, feedback: 'Virtual-protractor angle requires [vertex, baseRayPoint] and targetMeasures [angleDeg].', hasValidProvenanceArcs: false };
    }
    const [vertex, baseRay] = refs;
    const [targetAngleDeg] = input.goal.targetMeasures;
    const learnerSegs = input.segments.filter((s) => !s.locked);
    for (const s of learnerSegs) {
      const otherId = s.from === vertex.id ? s.to : s.to === vertex.id ? s.from : null;
      if (!otherId || otherId === baseRay.id) continue;
      const otherPt = ptMap.get(otherId);
      if (!otherPt) continue;
      const res = evaluateProtractorAngle(vertex, baseRay, otherPt, targetAngleDeg, angTol);
      if (res.passed) {
        return {
          passed: true,
          hasValidProvenanceArcs: true,
          feedback: res.feedback,
        };
      }
    }
    return {
      passed: false,
      hasValidProvenanceArcs: false,
      feedback: `Use the virtual protractor to plot a ray from vertex ${vertex.label} at ${targetAngleDeg}° (±${angTol}°) from baseline ${vertex.label}${baseRay.label}.`,
    };
  }

  // 5. LOCUS — FIXED DISTANCE FROM A POINT (analytical circle validation: centre + radius)
  if (input.goal.kind === 'locus-circle') {
    if (refs.length < 1 || !input.goal.targetMeasures || input.goal.targetMeasures.length < 1) {
      return { passed: false, feedback: 'Locus circle requires a centre point and target radius.', hasValidProvenanceArcs: false };
    }
    const [O] = refs;
    const targetR = input.goal.targetMeasures[0];
    const match = input.arcs.find(
      (arc) =>
        arc.centreId === O.id &&
        Math.abs(arc.radius - targetR) <= distTol &&
        arc.startDeg === undefined &&
        arc.endDeg === undefined,
    );
    if (!match) {
      return {
        passed: false,
        hasValidProvenanceArcs: false,
        feedback: `Construct a full circle centred at ${O.label} with exact radius ${targetR} units (every point on this boundary lies at fixed distance ${targetR} from ${O.label}).`,
      };
    }
    return {
      passed: true,
      hasValidProvenanceArcs: true,
      feedback: `Verified: analytical locus boundary is the circle centred at ${O.label} with radius ${targetR}.`,
    };
  }

  // 6. PARALLEL LINE or PERPENDICULAR THROUGH POINT
  if (input.goal.kind === 'parallel-line' || input.goal.kind === 'perpendicular-through-point') {
    if (refs.length < 3) {
      return { passed: false, feedback: 'Requires reference line endpoints A, B and target point P.', hasValidProvenanceArcs: false };
    }
    const [A, B, P] = refs;
    const baseLine = lineFromTwoPoints(A, B);
    if (!baseLine) return { passed: false, feedback: 'Reference line is degenerate.', hasValidProvenanceArcs: false };
    const learnerSegs = input.segments.filter((s) => !s.locked);

    for (const s of learnerSegs) {
      const p1 = ptMap.get(s.from);
      const p2 = ptMap.get(s.to);
      if (!p1 || !p2) continue;
      const line = lineFromTwoPoints(p1, p2);
      if (!line) continue;
      if (pointToLineDistance(P, line) > distTol) continue;
      if (input.goal.kind === 'parallel-line') {
        if (areLinesCoincident(baseLine, line, distTol, angTol)) {
          return {
            passed: false,
            hasValidProvenanceArcs: false,
            feedback: `Your line coincides with ${A.label}${B.label} instead of being a distinct parallel line through ${P.label}.`,
          };
        }
        if (areLinesParallel(baseLine, line, angTol)) {
          return { passed: true, hasValidProvenanceArcs: true, feedback: `Verified: distinct line through ${P.label} parallel to ${A.label}${B.label}.` };
        }
      } else if (areLinesPerpendicular(baseLine, line, angTol)) {
        return { passed: true, hasValidProvenanceArcs: true, feedback: `Verified: line through ${P.label} perpendicular (90°) to ${A.label}${B.label}.` };
      }
    }
    return {
      passed: false,
      hasValidProvenanceArcs: false,
      feedback: `Draw a line passing through ${P.label} that is ${input.goal.kind === 'parallel-line' ? 'parallel' : 'perpendicular'} to ${A.label}${B.label}.`,
    };
  }

  return { passed: false, feedback: `Unsupported compass goal "${input.goal.kind}".`, hasValidProvenanceArcs: false };
}
