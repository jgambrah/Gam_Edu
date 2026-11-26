/**
 * GAM EDU — Step 4F Pure Mathematical Module 1: 2D Euclidean Primitives & Analytical Intersections
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies.
 * Explicitly separates:
 * - Computational epsilon (`GEO_EPS = 1e-9`) for bounded IEEE-754 double-precision stability
 * - Educational grading tolerances (`distanceTolerance`, `angleToleranceDeg`)
 * - Display precision (rounded only at UI formatting time, never silently rounded during math)
 *
 * Uses general line equations `ax + by + c = 0` so horizontal and vertical lines are handled
 * identically with ZERO `Infinity` or `NaN` values.
 */

export const GEO_EPS = 1e-9;

export const GEOMETRY_LIMITS = {
  maxPoints: 16,
  maxSegments: 16,
  maxArcs: 12,
  maxPolygonVertices: 6,
  maxUndoHistory: 25,
  minDistanceTolerance: 0.05,
  maxDistanceTolerance: 0.5,
  defaultDistanceTolerance: 0.15,
  minAngleToleranceDeg: 0.5,
  maxAngleToleranceDeg: 5,
  defaultAngleToleranceDeg: 1.5,
} as const;

export interface GeoPoint {
  id: string;
  label: string;
  x: number;
  y: number;
  locked?: boolean;
}

export interface GeoSegment {
  id?: string;
  from: string; // Point ID
  to: string;   // Point ID
  kind?: 'segment' | 'line' | 'ray';
  locked?: boolean;
}

export interface GeoArc {
  id?: string;
  centreId: string; // Point ID
  radius: number;
  /** Optional restricted arc span in degrees (0..360); omit for full compass circle */
  startDeg?: number;
  endDeg?: number;
}

/** Normalised general line equation: a*x + b*y + c = 0 with sqrt(a^2 + b^2) === 1 */
export interface GeoLineGeneral {
  a: number;
  b: number;
  c: number;
}

export function distance2D(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

export function midpoint2D(p1: { x: number; y: number }, p2: { x: number; y: number }): { x: number; y: number } {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

export function lineFromTwoPoints(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
): GeoLineGeneral | null {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy);
  if (len < GEO_EPS) return null; // Degenerate coincident points
  let a = -dy / len;
  let b = dx / len;
  let c = -(a * p1.x + b * p1.y);
  // Canonical sign so equivalent lines compare cleanly
  if (a < -GEO_EPS || (Math.abs(a) <= GEO_EPS && b < 0)) {
    a = -a;
    b = -b;
    c = -c;
  }
  return { a, b, c };
}

export function pointToLineDistance(p: { x: number; y: number }, line: GeoLineGeneral): number {
  return Math.abs(line.a * p.x + line.b * p.y + line.c);
}

export function areLinesParallel(l1: GeoLineGeneral, l2: GeoLineGeneral, angleTolDeg = 0.5): boolean {
  const cross = Math.abs(l1.a * l2.b - l1.b * l2.a);
  return cross <= Math.sin((angleTolDeg * Math.PI) / 180) + GEO_EPS;
}

export function areLinesCoincident(
  l1: GeoLineGeneral,
  l2: GeoLineGeneral,
  distTol = 0.1,
  angleTolDeg = 0.5,
): boolean {
  if (!areLinesParallel(l1, l2, angleTolDeg)) return false;
  // Since l1 and l2 are unit-normalised with canonical sign, |c1 - c2| is the perpendicular distance
  const dot = l1.a * l2.a + l1.b * l2.b;
  const cDiff = dot >= 0 ? Math.abs(l1.c - l2.c) : Math.abs(l1.c + l2.c);
  return cDiff <= distTol;
}

export function areLinesPerpendicular(l1: GeoLineGeneral, l2: GeoLineGeneral, angleTolDeg = 1.5): boolean {
  const dot = Math.abs(l1.a * l2.a + l1.b * l2.b);
  return dot <= Math.sin((angleTolDeg * Math.PI) / 180) + GEO_EPS;
}

export type LineIntersectionResult =
  | { status: 'point'; point: { x: number; y: number } }
  | { status: 'parallel' }
  | { status: 'coincident' };

export function intersectLineLine(l1: GeoLineGeneral, l2: GeoLineGeneral): LineIntersectionResult {
  const det = l1.a * l2.b - l2.a * l1.b;
  if (Math.abs(det) < GEO_EPS) {
    return areLinesCoincident(l1, l2, 1e-6, 1e-6) ? { status: 'coincident' } : { status: 'parallel' };
  }
  const x = (l1.b * l2.c - l2.b * l1.c) / det;
  const y = (l2.a * l1.c - l1.a * l2.c) / det;
  return { status: 'point', point: { x, y } };
}

export type CircleIntersectionResult =
  | { status: 'none' }
  | { status: 'coincident' }
  | { status: 'tangent'; points: [{ x: number; y: number }] }
  | { status: 'two'; points: [{ x: number; y: number }, { x: number; y: number }] };

export function intersectCircleCircle(
  c1: { x: number; y: number },
  r1: number,
  c2: { x: number; y: number },
  r2: number,
): CircleIntersectionResult {
  if (r1 <= GEO_EPS || r2 <= GEO_EPS) return { status: 'none' };
  const d = distance2D(c1, c2);
  if (d < GEO_EPS && Math.abs(r1 - r2) < GEO_EPS) return { status: 'coincident' };
  if (d > r1 + r2 + GEO_EPS || d < Math.abs(r1 - r2) - GEO_EPS || d < GEO_EPS) return { status: 'none' };

  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const hSq = r1 * r1 - a * a;
  const px = c1.x + (a * (c2.x - c1.x)) / d;
  const py = c1.y + (a * (c2.y - c1.y)) / d;

  if (hSq <= GEO_EPS) {
    return { status: 'tangent', points: [{ x: px, y: py }] };
  }
  const h = Math.sqrt(hSq);
  const rx = (-(c2.y - c1.y) * h) / d;
  const ry = ((c2.x - c1.x) * h) / d;
  return {
    status: 'two',
    points: [
      { x: px + rx, y: py + ry },
      { x: px - rx, y: py - ry },
    ],
  };
}

export function intersectLineCircle(
  line: GeoLineGeneral,
  centre: { x: number; y: number },
  radius: number,
): { status: 'none' | 'tangent' | 'two'; points: Array<{ x: number; y: number }> } {
  if (radius <= GEO_EPS) return { status: 'none', points: [] };
  const signedDist = line.a * centre.x + line.b * centre.y + line.c;
  const footX = centre.x - line.a * signedDist;
  const footY = centre.y - line.b * signedDist;
  const distSq = signedDist * signedDist;
  const rSq = radius * radius;
  if (distSq > rSq + GEO_EPS) return { status: 'none', points: [] };
  if (Math.abs(rSq - distSq) <= GEO_EPS) {
    return { status: 'tangent', points: [{ x: footX, y: footY }] };
  }
  const t = Math.sqrt(rSq - distSq);
  // Direction along the line is (-b, a)
  return {
    status: 'two',
    points: [
      { x: footX - line.b * t, y: footY + line.a * t },
      { x: footX + line.b * t, y: footY - line.a * t },
    ],
  };
}

/** Computes interior angle ∠ABC in degrees (0..180), or null if degenerate. */
export function angleAtVertexDeg(
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number },
): number | null {
  const v1x = a.x - b.x;
  const v1y = a.y - b.y;
  const v2x = c.x - b.x;
  const v2y = c.y - b.y;
  const l1 = Math.hypot(v1x, v1y);
  const l2 = Math.hypot(v2x, v2y);
  if (l1 < GEO_EPS || l2 < GEO_EPS) return null;
  const cos = Math.max(-1, Math.min(1, (v1x * v2x + v1y * v2y) / (l1 * l2)));
  return (Math.acos(cos) * 180) / Math.PI;
}

/** Validates strict triangle inequality for SSS side lengths. */
export function isValidTriangleSSS(a: number, b: number, c: number): boolean {
  return a > GEO_EPS && b > GEO_EPS && c > GEO_EPS && a + b > c + GEO_EPS && a + c > b + GEO_EPS && b + c > a + GEO_EPS;
}

/** Validates SAS (two positive sides and strictly interior included angle 0 < θ < 180). */
export function isValidTriangleSAS(s1: number, angleDeg: number, s2: number): boolean {
  return s1 > GEO_EPS && s2 > GEO_EPS && angleDeg > 1 && angleDeg < 179;
}

/** Validates ASA (positive included side and two angles summing to < 180°). */
export function isValidTriangleASA(angle1Deg: number, side: number, angle2Deg: number): boolean {
  return side > GEO_EPS && angle1Deg > 1 && angle2Deg > 1 && angle1Deg + angle2Deg < 179;
}

function segmentsProperlyIntersect(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  p4: { x: number; y: number },
): boolean {
  const orient = (a: { x: number; y: number }, b: { x: number; y: number }, c: { x: number; y: number }) =>
    (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  const o1 = orient(p1, p2, p3);
  const o2 = orient(p1, p2, p4);
  const o3 = orient(p3, p4, p1);
  const o4 = orient(p3, p4, p2);
  return o1 * o2 < -GEO_EPS && o3 * o4 < -GEO_EPS;
}

/** Checks that a polygon has >= 3 vertices, non-zero area, and zero self-intersections. */
export function isSimplePolygon(vertices: Array<{ x: number; y: number }>): boolean {
  const n = vertices.length;
  if (n < 3) return false;
  // Shoelace area check (rejects collinear / degenerate polygons)
  let area2 = 0;
  for (let i = 0; i < n; i++) {
    const cur = vertices[i];
    const nxt = vertices[(i + 1) % n];
    if (distance2D(cur, nxt) < GEO_EPS) return false;
    area2 += cur.x * nxt.y - nxt.x * cur.y;
  }
  if (Math.abs(area2) < 1e-4) return false;

  // Reject self-intersecting non-adjacent edges
  for (let i = 0; i < n; i++) {
    const a1 = vertices[i];
    const a2 = vertices[(i + 1) % n];
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue; // adjacent wrap
      const b1 = vertices[j];
      const b2 = vertices[(j + 1) % n];
      if (segmentsProperlyIntersect(a1, a2, b1, b2)) return false;
    }
  }
  return true;
}

export function polygonArea(vertices: Array<{ x: number; y: number }>): number {
  let area2 = 0;
  for (let i = 0; i < vertices.length; i++) {
    const cur = vertices[i];
    const nxt = vertices[(i + 1) % vertices.length];
    area2 += cur.x * nxt.y - nxt.x * cur.y;
  }
  return Math.abs(area2) / 2;
}
