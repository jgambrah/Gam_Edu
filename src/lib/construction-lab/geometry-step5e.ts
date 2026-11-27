/**
 * GAM EDU — Step 5E Pure Mathematical Geometry Extensions
 * (`construction-lab`, `labKind: 'geometry-constructor'`, `engineVersion: '1.6.0'`)
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies, zero WebGL, zero eval().
 * Reuses `geometry-primitives.ts` and extends Step 4F without duplicating working code:
 *  1. RHS triangle construction (accepting both reflected orientations) & virtual-protractor angles
 *  2. Extended loci & bounded feasible regions (point, infinite line, finite segment with endpoint arcs,
 *     equidistant two points, intersecting lines internal/external bisectors, parallel lines midline)
 *  3. Exact 3D rigid-rotation cube-net foldability solver (certifying all 11 valid cube nets under
 *     all rotations/reflections and rejecting all invalid hexominoes) + cuboid SA/volume metrics
 */

import {
  GEO_EPS,
  angleAtVertexDeg,
  areLinesParallel,
  distance2D,
  lineFromTwoPoints,
  pointToLineDistance,
  type GeoPoint,
} from './geometry-primitives';

// ============================================================================
// 1. RHS TRIANGLE & GENERAL VIRTUAL-PROTRACTOR ANGLE CONSTRUCTION
// ============================================================================

export function isValidTriangleRHS(leg: number, hypotenuse: number): boolean {
  return (
    Number.isFinite(leg) &&
    Number.isFinite(hypotenuse) &&
    leg > GEO_EPS &&
    hypotenuse > leg + GEO_EPS
  );
}

export interface RhsEvaluationResult {
  passed: boolean;
  feedback: string;
  rightAngleDeg: number | null;
  measuredLeg: number;
  measuredHypotenuse: number;
}

/**
 * Verifies a Right-angle-Hypotenuse-Side (RHS) triangle ABC where the right angle
 * is at vertex A or B, accepting both reflected orientations above/below AB.
 */
export function evaluateTriangleRHS(
  A: GeoPoint,
  B: GeoPoint,
  C: GeoPoint,
  targetLeg: number,
  targetHyp: number,
  distTol = 0.25,
  angTolDeg = 2.0,
): RhsEvaluationResult {
  if (!isValidTriangleRHS(targetLeg, targetHyp)) {
    return {
      passed: false,
      feedback: 'Invalid RHS specification: hypotenuse must strictly exceed the given leg.',
      rightAngleDeg: null,
      measuredLeg: 0,
      measuredHypotenuse: 0,
    };
  }
  const ab = distance2D(A, B);
  const ac = distance2D(A, C);
  const bc = distance2D(B, C);
  const angA = angleAtVertexDeg(B, A, C);
  const angB = angleAtVertexDeg(A, B, C);

  // Case 1: right angle at A, leg = AB (or AC), hyp = BC
  if (angA !== null && Math.abs(angA - 90) <= angTolDeg) {
    const legMatch = Math.abs(ab - targetLeg) <= distTol || Math.abs(ac - targetLeg) <= distTol;
    const hypMatch = Math.abs(bc - targetHyp) <= distTol;
    if (legMatch && hypMatch) {
      return {
        passed: true,
        feedback: `Verified RHS triangle (∠A = ${angA.toFixed(1)}°, hypotenuse = ${bc.toFixed(2)}).`,
        rightAngleDeg: angA,
        measuredLeg: Math.abs(ab - targetLeg) <= distTol ? ab : ac,
        measuredHypotenuse: bc,
      };
    }
  }
  // Case 2: right angle at B, leg = AB (or BC), hyp = AC
  if (angB !== null && Math.abs(angB - 90) <= angTolDeg) {
    const legMatch = Math.abs(ab - targetLeg) <= distTol || Math.abs(bc - targetLeg) <= distTol;
    const hypMatch = Math.abs(ac - targetHyp) <= distTol;
    if (legMatch && hypMatch) {
      return {
        passed: true,
        feedback: `Verified RHS triangle (∠B = ${angB.toFixed(1)}°, hypotenuse = ${ac.toFixed(2)}).`,
        rightAngleDeg: angB,
        measuredLeg: Math.abs(ab - targetLeg) <= distTol ? ab : bc,
        measuredHypotenuse: ac,
      };
    }
  }

  return {
    passed: false,
    feedback: `RHS check failed: ensure one angle is 90° (±${angTolDeg}°), leg = ${targetLeg}, and hypotenuse = ${targetHyp}.`,
    rightAngleDeg: angA ?? angB,
    measuredLeg: ab,
    measuredHypotenuse: Math.max(ac, bc),
  };
}

export function evaluateProtractorAngle(
  vertex: GeoPoint,
  ray1: GeoPoint,
  ray2: GeoPoint,
  targetAngleDeg: number,
  angTolDeg = 2.0,
): { passed: boolean; measuredDeg: number | null; method: 'virtual-protractor'; feedback: string } {
  const measured = angleAtVertexDeg(ray1, vertex, ray2);
  if (measured === null) {
    return {
      passed: false,
      measuredDeg: null,
      method: 'virtual-protractor',
      feedback: 'Angle rays cannot be degenerate (coincident with vertex).',
    };
  }
  const ok = Math.abs(measured - targetAngleDeg) <= angTolDeg;
  return {
    passed: ok,
    measuredDeg: Number(measured.toFixed(2)),
    method: 'virtual-protractor',
    feedback: ok
      ? `Verified virtual-protractor angle (${measured.toFixed(1)}°; note: protractor measurement is distinct from pure straightedge-and-compass construction).`
      : `Measured angle is ${measured.toFixed(1)}°, target is ${targetAngleDeg}° (±${angTolDeg}°).`,
  };
}

// ============================================================================
// 2. EXTENDED LOCI & BOUNDED FEASIBLE REGIONS (PURE ANALYTICAL)
// ============================================================================

export type LocusConstraintDef =
  | { kind: 'fixed-distance-point'; center: { x: number; y: number }; distance: number; relation: 'eq' | 'lte' | 'gte' }
  | { kind: 'fixed-distance-line'; p1: { x: number; y: number }; p2: { x: number; y: number }; distance: number; relation: 'eq' | 'lte' | 'gte' }
  | { kind: 'fixed-distance-segment'; p1: { x: number; y: number }; p2: { x: number; y: number }; distance: number; relation: 'eq' | 'lte' | 'gte' }
  | { kind: 'equidistant-two-points'; p1: { x: number; y: number }; p2: { x: number; y: number }; relation: 'eq' | 'closer-to-p1' | 'closer-to-p2' }
  | { kind: 'equidistant-intersecting-lines'; l1p1: { x: number; y: number }; l1p2: { x: number; y: number }; l2p1: { x: number; y: number }; l2p2: { x: number; y: number } }
  | { kind: 'equidistant-parallel-lines'; l1p1: { x: number; y: number }; l1p2: { x: number; y: number }; l2p1: { x: number; y: number }; l2p2: { x: number; y: number } };

/** Exact Euclidean distance from point P to finite line segment AB (including semicircular endpoint arcs!). */
export function pointToSegmentDistance(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const lenSq = vx * vx + vy * vy;
  if (lenSq < GEO_EPS * GEO_EPS) return distance2D(p, a);
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / lenSq));
  return distance2D(p, { x: a.x + t * vx, y: a.y + t * vy });
}

export function evaluateLocusConstraint(
  c: LocusConstraintDef,
  pt: { x: number; y: number },
  tol = 0.25,
): { satisfied: boolean; error?: string } {
  if (c.kind === 'fixed-distance-point') {
    const d = distance2D(pt, c.center);
    if (c.relation === 'eq') return { satisfied: Math.abs(d - c.distance) <= tol };
    if (c.relation === 'lte') return { satisfied: d <= c.distance + tol };
    return { satisfied: d >= c.distance - tol };
  }

  if (c.kind === 'fixed-distance-line') {
    const line = lineFromTwoPoints(c.p1, c.p2);
    if (!line) return { satisfied: false, error: 'Degenerate line in locus constraint.' };
    const d = pointToLineDistance(pt, line);
    if (c.relation === 'eq') return { satisfied: Math.abs(d - c.distance) <= tol };
    if (c.relation === 'lte') return { satisfied: d <= c.distance + tol };
    return { satisfied: d >= c.distance - tol };
  }

  if (c.kind === 'fixed-distance-segment') {
    const d = pointToSegmentDistance(pt, c.p1, c.p2);
    if (c.relation === 'eq') return { satisfied: Math.abs(d - c.distance) <= tol };
    if (c.relation === 'lte') return { satisfied: d <= c.distance + tol };
    return { satisfied: d >= c.distance - tol };
  }

  if (c.kind === 'equidistant-two-points') {
    if (distance2D(c.p1, c.p2) < GEO_EPS) return { satisfied: false, error: 'Reference points must be distinct.' };
    const d1 = distance2D(pt, c.p1);
    const d2 = distance2D(pt, c.p2);
    if (c.relation === 'eq') return { satisfied: Math.abs(d1 - d2) <= tol };
    if (c.relation === 'closer-to-p1') return { satisfied: d1 <= d2 + tol };
    return { satisfied: d2 <= d1 + tol };
  }

  if (c.kind === 'equidistant-intersecting-lines') {
    const l1 = lineFromTwoPoints(c.l1p1, c.l1p2);
    const l2 = lineFromTwoPoints(c.l2p1, c.l2p2);
    if (!l1 || !l2 || areLinesParallel(l1, l2)) {
      return { satisfied: false, error: 'Intersecting-lines locus requires two non-parallel lines.' };
    }
    const d1 = pointToLineDistance(pt, l1);
    const d2 = pointToLineDistance(pt, l2);
    return { satisfied: Math.abs(d1 - d2) <= tol };
  }

  // equidistant-parallel-lines
  const l1 = lineFromTwoPoints(c.l1p1, c.l1p2);
  const l2 = lineFromTwoPoints(c.l2p1, c.l2p2);
  if (!l1 || !l2 || !areLinesParallel(l1, l2)) {
    return { satisfied: false, error: 'Parallel-lines locus requires two distinct parallel lines.' };
  }
  const sep = pointToLineDistance(c.l2p1, l1);
  if (sep < GEO_EPS) return { satisfied: false, error: 'Parallel lines cannot be coincident.' };
  const d1 = pointToLineDistance(pt, l1);
  const d2 = pointToLineDistance(pt, l2);
  // Must lie BETWEEN the two parallel lines and equidistant from both
  return { satisfied: Math.abs(d1 - d2) <= tol && Math.abs(d1 + d2 - sep) <= tol * 1.5 };
}

export function evaluateCombinedLocus(
  constraints: ReadonlyArray<LocusConstraintDef>,
  pt: { x: number; y: number },
  tol = 0.25,
): { passed: boolean; failedIndices: number[]; feedback: string } {
  const failed: number[] = [];
  for (let i = 0; i < constraints.length; i++) {
    const res = evaluateLocusConstraint(constraints[i], pt, tol);
    if (!res.satisfied) failed.push(i);
  }
  return {
    passed: failed.length === 0 && constraints.length > 0,
    failedIndices: failed,
    feedback:
      failed.length === 0
        ? `Verified! Point (${pt.x}, ${pt.y}) satisfies all ${constraints.length} locus constraint(s).`
        : `Point (${pt.x}, ${pt.y}) violates locus constraint(s) #${failed.map((i) => i + 1).join(', #')}.`,
  };
}

// ============================================================================
// 3. EXACT 3D CUBE-NET FOLDABILITY ENGINE & CUBOID METRICS
// ============================================================================

export interface GridCell {
  r: number;
  c: number;
}

type Vec3 = readonly [number, number, number];

function neg3(v: Vec3): Vec3 {
  return [-v[0], -v[1], -v[2]];
}

function key3(v: Vec3): string {
  return `${v[0]},${v[1]},${v[2]}`;
}

export interface CubeNetResult {
  valid: boolean;
  reason: string;
  faceCount: number;
  connected: boolean;
  overlappingFaces: boolean;
  /** Map of "r,c" -> cube face normal label ("bottom", "top", "north", "south", "east", "west") */
  foldedFaceMap: Record<string, string>;
}

const NORMAL_NAMES: Record<string, string> = {
  '0,0,-1': 'bottom',
  '0,0,1': 'top',
  '1,0,0': 'east',
  '-1,0,0': 'west',
  '0,1,0': 'south',
  '0,-1,0': 'north',
};

/**
 * Exact deterministic 3D rigid-rotation cube-net verifier.
 * Certifies ALL 11 distinct cube nets under all 8 rotations/reflections, and rejects
 * every disconnected, overlapping-cell, wrong-count, or colliding-face hexomino!
 */
export function evaluateCubeNet(cells: ReadonlyArray<GridCell>): CubeNetResult {
  const cellSet = new Set<string>();
  for (const cell of cells) {
    if (!Number.isInteger(cell.r) || !Number.isInteger(cell.c)) {
      return { valid: false, reason: 'Grid coordinates must be integers.', faceCount: cells.length, connected: false, overlappingFaces: false, foldedFaceMap: {} };
    }
    const k = `${cell.r},${cell.c}`;
    if (cellSet.has(k)) {
      return { valid: false, reason: `Duplicate overlapping grid cell (${cell.r}, ${cell.c}).`, faceCount: cells.length, connected: false, overlappingFaces: true, foldedFaceMap: {} };
    }
    cellSet.add(k);
  }

  if (cells.length !== 6) {
    return { valid: false, reason: `A cube net requires exactly 6 square faces (got ${cells.length}).`, faceCount: cells.length, connected: false, overlappingFaces: false, foldedFaceMap: {} };
  }

  // BFS from cells[0] carrying exact orthonormal basis (n = face normal, u = east/+c, v = south/+r)
  interface Frame {
    r: number;
    c: number;
    n: Vec3;
    u: Vec3;
    v: Vec3;
  }

  const visited = new Set<string>([`${cells[0].r},${cells[0].c}`]);
  const usedNormals = new Set<string>();
  const foldedFaceMap: Record<string, string> = {};
  const queue: Frame[] = [
    { r: cells[0].r, c: cells[0].c, n: [0, 0, -1], u: [1, 0, 0], v: [0, 1, 0] },
  ];
  let overlap = false;

  while (queue.length > 0) {
    const cur = queue.shift()!;
    const nKey = key3(cur.n);
    if (usedNormals.has(nKey)) {
      overlap = true;
    } else {
      usedNormals.add(nKey);
    }
    foldedFaceMap[`${cur.r},${cur.c}`] = NORMAL_NAMES[nKey] ?? nKey;

    // 4-connected orthogonal folds (exact 90° rotations of local frame around shared edge):
    const steps: Array<{ dr: number; dc: number; nextN: Vec3; nextU: Vec3; nextV: Vec3 }> = [
      // Move East (+c): fold up around +u edge -> new normal = u, new u = -n, v unchanged
      { dr: 0, dc: 1, nextN: cur.u, nextU: neg3(cur.n), nextV: cur.v },
      // Move West (-c): new normal = -u, new u = n, v unchanged
      { dr: 0, dc: -1, nextN: neg3(cur.u), nextU: cur.n, nextV: cur.v },
      // Move South (+r): new normal = v, u unchanged, new v = -n
      { dr: 1, dc: 0, nextN: cur.v, nextU: cur.u, nextV: neg3(cur.n) },
      // Move North (-r): new normal = -v, u unchanged, new v = n
      { dr: -1, dc: 0, nextN: neg3(cur.v), nextU: cur.u, nextV: cur.n },
    ];

    for (const st of steps) {
      const nr = cur.r + st.dr;
      const nc = cur.c + st.dc;
      const k = `${nr},${nc}`;
      if (cellSet.has(k) && !visited.has(k)) {
        visited.add(k);
        queue.push({ r: nr, c: nc, n: st.nextN, u: st.nextU, v: st.nextV });
      }
    }
  }

  const connected = visited.size === 6;
  if (!connected) {
    return {
      valid: false,
      reason: 'All 6 squares must be connected edge-to-edge (not corner-only or disconnected).',
      faceCount: 6,
      connected: false,
      overlappingFaces: false,
      foldedFaceMap,
    };
  }
  if (overlap || usedNormals.size !== 6) {
    return {
      valid: false,
      reason: 'Invalid cube net: when folded in 3D, two or more squares overlap onto the same cube face.',
      faceCount: 6,
      connected: true,
      overlappingFaces: true,
      foldedFaceMap,
    };
  }
  return {
    valid: true,
    reason: 'Valid cube net! All 6 squares fold cleanly onto the 6 distinct faces of a cube.',
    faceCount: 6,
    connected: true,
    overlappingFaces: false,
    foldedFaceMap,
  };
}

export function computeCuboidMetrics(length: number, width: number, height: number): {
  faces: 6;
  edges: 12;
  vertices: 8;
  surfaceArea: number;
  volume: number;
} {
  return {
    faces: 6,
    edges: 12,
    vertices: 8,
    surfaceArea: Number((2 * (length * width + length * height + width * height)).toFixed(6)),
    volume: Number((length * width * height).toFixed(6)),
  };
}
