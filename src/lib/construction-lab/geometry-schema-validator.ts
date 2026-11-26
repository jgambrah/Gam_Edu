/**
 * GAM EDU — Step 4F Strict Discriminated Schema & Mathematical Feasibility Validator
 * for `labKind: 'geometry-constructor'` (`minEngineVersion >= '1.3.0'`).
 *
 * Pure TypeScript, zero React/DOM dependencies.
 */

import {
  GEO_EPS,
  GEOMETRY_LIMITS,
  computeCircleTheoremGeometry,
  distance2D,
  isReachableOnGrid,
  isSimplePolygon,
  isValidTriangleASA,
  isValidTriangleSAS,
  isValidTriangleSSS,
  transformPoint,
  type CircleTheoremKind,
  type CompassGoalKind,
  type CoordinateGoalKind,
  type GeometryConstructorMode,
  type TransformationSpec,
} from './geometry-engine';

const SHARED_GEO_KEYS = [
  'id',
  'engine',
  'schemaVersion',
  'minEngineVersion',
  'title',
  'instructions',
  'accessibilityLabel',
  'fallbackText',
  'hints',
  'persistCompletion',
  'labKind',
  'mode',
  'curriculumLevel',
  'subjectTag',
  'modelNote',
  'prediction',
  'successExplanation',
  'gridBounds',
] as const;

const COMPASS_KEYS = new Set([
  ...SHARED_GEO_KEYS,
  'initialPoints',
  'initialSegments',
  'allowedTools',
  'constructionGoal',
]);

const TRANSFORM_KEYS = new Set([
  ...SHARED_GEO_KEYS,
  'preImageVertices',
  'transformation',
  'requireLabelledCorrespondence',
]);

const COORD_KEYS = new Set([
  ...SHARED_GEO_KEYS,
  'coordGoal',
]);

const CIRCLE_KEYS = new Set([
  ...SHARED_GEO_KEYS,
  'circleTheorem',
]);

const VALID_CURRICULUM_LEVELS = new Set(['introductory', 'igcse', 'as-a-level']);
const VALID_COMPASS_GOALS = new Set<CompassGoalKind>([
  'perpendicular-bisector',
  'angle-bisector',
  'triangle-sss',
  'triangle-sas',
  'triangle-asa',
  'locus-circle',
  'parallel-line',
  'perpendicular-through-point',
]);
const VALID_COORD_GOALS = new Set<CoordinateGoalKind>([
  'midpoint',
  'parallel-through-point',
  'perpendicular-through-point',
  'line-from-equation',
]);
const VALID_THEOREMS = new Set<CircleTheoremKind>([
  'angle-at-centre',
  'semicircle-90',
  'same-segment',
  'cyclic-quadrilateral',
  'tangent-radius',
]);

function checkAllowed(
  rec: Record<string, unknown>,
  allowed: ReadonlySet<string>,
  ctx: string,
  errors: string[],
): void {
  for (const k of Object.keys(rec)) {
    if (!allowed.has(k)) {
      errors.push(`Unknown field "${k}" in ${ctx}.`);
    }
  }
}

function isFiniteNum(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

export function validateGeometryConstructorConfig(
  obj: Record<string, unknown>,
  errors: string[],
): void {
  const mode = obj.mode as GeometryConstructorMode;
  if (
    mode !== 'compass-straightedge' &&
    mode !== 'transformations' &&
    mode !== 'coordinate-geometry' &&
    mode !== 'circle-theorems'
  ) {
    errors.push(
      'geometry-constructor "mode" must be compass-straightedge, transformations, coordinate-geometry, or circle-theorems.',
    );
    return;
  }

  if (typeof obj.curriculumLevel !== 'string' || !VALID_CURRICULUM_LEVELS.has(obj.curriculumLevel)) {
    errors.push('geometry-constructor "curriculumLevel" must be "introductory", "igcse", or "as-a-level".');
  }

  // Validate gridBounds when present (required for compass, transformations, coordinate-geometry)
  let gridStep = 1;
  let xMin = -10;
  let xMax = 10;
  let yMin = -10;
  let yMax = 10;
  if (mode !== 'circle-theorems') {
    const gb = obj.gridBounds as Record<string, unknown> | undefined;
    if (!gb || typeof gb !== 'object' || Array.isArray(gb)) {
      errors.push(`geometry-constructor(${mode}) requires a "gridBounds" object.`);
    } else {
      if (!isFiniteNum(gb.xMin) || !isFiniteNum(gb.xMax) || !isFiniteNum(gb.yMin) || !isFiniteNum(gb.yMax)) {
        errors.push('geometry-constructor gridBounds xMin/xMax/yMin/yMax must be finite numbers.');
      } else if (gb.xMax <= gb.xMin || gb.yMax <= gb.yMin) {
        errors.push('geometry-constructor gridBounds must satisfy xMax > xMin and yMax > yMin.');
      } else {
        xMin = gb.xMin;
        xMax = gb.xMax;
        yMin = gb.yMin;
        yMax = gb.yMax;
      }
      if (gb.step !== undefined) {
        if (!isFiniteNum(gb.step) || gb.step <= 0 || gb.step > 5) {
          errors.push('geometry-constructor gridBounds.step must be a finite number in (0, 5].');
        } else {
          gridStep = gb.step;
        }
      }
    }
  }

  // MODE 1: COMPASS & STRAIGHTEDGE
  if (mode === 'compass-straightedge') {
    checkAllowed(obj, COMPASS_KEYS, 'geometry-constructor(compass-straightedge)', errors);
    const pts = obj.initialPoints;
    const ptMap = new Map<string, { x: number; y: number }>();
    if (!Array.isArray(pts) || pts.length < 1 || pts.length > GEOMETRY_LIMITS.maxPoints) {
      errors.push(`compass-straightedge "initialPoints" must contain 1..${GEOMETRY_LIMITS.maxPoints} points.`);
    } else {
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i] as Record<string, unknown>;
        if (!p || typeof p !== 'object' || typeof p.id !== 'string' || !isFiniteNum(p.x) || !isFiniteNum(p.y)) {
          errors.push(`compass-straightedge initialPoints[${i}] must have string id and finite x, y.`);
          continue;
        }
        if (ptMap.has(p.id)) {
          errors.push(`Duplicate point id "${p.id}" in compass-straightedge.`);
        } else {
          ptMap.set(p.id, { x: p.x, y: p.y });
        }
      }
    }

    const goal = obj.constructionGoal as Record<string, unknown> | undefined;
    if (!goal || typeof goal !== 'object' || Array.isArray(goal)) {
      errors.push('compass-straightedge requires a "constructionGoal" object.');
      return;
    }
    if (typeof goal.kind !== 'string' || !VALID_COMPASS_GOALS.has(goal.kind as CompassGoalKind)) {
      errors.push(`Unsupported compass constructionGoal.kind "${String(goal.kind)}".`);
      return;
    }
    if (
      goal.distanceTolerance !== undefined &&
      (!isFiniteNum(goal.distanceTolerance) ||
        goal.distanceTolerance < GEOMETRY_LIMITS.minDistanceTolerance ||
        goal.distanceTolerance > GEOMETRY_LIMITS.maxDistanceTolerance)
    ) {
      errors.push(
        `compass-straightedge distanceTolerance must be between ${GEOMETRY_LIMITS.minDistanceTolerance} and ${GEOMETRY_LIMITS.maxDistanceTolerance}.`,
      );
    }
    if (
      goal.angleToleranceDeg !== undefined &&
      (!isFiniteNum(goal.angleToleranceDeg) ||
        goal.angleToleranceDeg < GEOMETRY_LIMITS.minAngleToleranceDeg ||
        goal.angleToleranceDeg > GEOMETRY_LIMITS.maxAngleToleranceDeg)
    ) {
      errors.push(
        `compass-straightedge angleToleranceDeg must be between ${GEOMETRY_LIMITS.minAngleToleranceDeg} and ${GEOMETRY_LIMITS.maxAngleToleranceDeg}.`,
      );
    }
    const refIds = goal.referencePointIds;
    if (!Array.isArray(refIds) || refIds.some((id) => typeof id !== 'string' || !ptMap.has(id))) {
      errors.push('compass-straightedge constructionGoal.referencePointIds must reference declared initialPoints.');
      return;
    }

    // Authoring-time triangle feasibility check (rejects impossible triangles!)
    if (goal.kind === 'triangle-sss') {
      const m = goal.targetMeasures as number[] | undefined;
      if (!Array.isArray(m) || m.length < 2 || !isFiniteNum(m[0]) || !isFiniteNum(m[1]) || refIds.length < 2) {
        errors.push('triangle-sss requires 2 baseline referencePointIds and 2 finite targetMeasures [lenAC, lenBC].');
      } else {
        const ab = distance2D(ptMap.get(refIds[0])!, ptMap.get(refIds[1])!);
        if (!isValidTriangleSSS(ab, m[0], m[1])) {
          errors.push(
            `Impossible SSS triangle dimensions: baseline AB = ${ab.toFixed(2)}, AC = ${m[0]}, BC = ${m[1]} violate the triangle inequality.`,
          );
        }
      }
    }
    if (goal.kind === 'triangle-sas') {
      const m = goal.targetMeasures as number[] | undefined;
      if (!Array.isArray(m) || m.length < 2 || !isFiniteNum(m[0]) || !isFiniteNum(m[1]) || refIds.length < 2) {
        errors.push('triangle-sas requires 2 baseline referencePointIds and [lenAC, angleAtADeg].');
      } else {
        const ab = distance2D(ptMap.get(refIds[0])!, ptMap.get(refIds[1])!);
        if (!isValidTriangleSAS(ab, m[1], m[0])) {
          errors.push(`Impossible SAS triangle dimensions: AB = ${ab.toFixed(2)}, angle = ${m[1]}°, AC = ${m[0]}.`);
        }
      }
    }
    if (goal.kind === 'triangle-asa') {
      const m = goal.targetMeasures as number[] | undefined;
      if (!Array.isArray(m) || m.length < 2 || !isFiniteNum(m[0]) || !isFiniteNum(m[1]) || refIds.length < 2) {
        errors.push('triangle-asa requires 2 baseline referencePointIds and [angleAtADeg, angleAtBDeg].');
      } else {
        const ab = distance2D(ptMap.get(refIds[0])!, ptMap.get(refIds[1])!);
        if (!isValidTriangleASA(m[0], ab, m[1])) {
          errors.push(`Impossible ASA triangle angles: ${m[0]}° + ${m[1]}° must be strictly less than 180° with AB > 0.`);
        }
      }
    }
    return;
  }

  // MODE 2: TRANSFORMATIONS
  if (mode === 'transformations') {
    checkAllowed(obj, TRANSFORM_KEYS, 'geometry-constructor(transformations)', errors);
    const verts = obj.preImageVertices as Array<{ x: number; y: number }> | undefined;
    if (
      !Array.isArray(verts) ||
      verts.length < 3 ||
      verts.length > GEOMETRY_LIMITS.maxPolygonVertices ||
      verts.some((v) => !v || !isFiniteNum(v.x) || !isFiniteNum(v.y))
    ) {
      errors.push(`transformations "preImageVertices" must contain 3..${GEOMETRY_LIMITS.maxPolygonVertices} finite points.`);
      return;
    }
    if (!isSimplePolygon(verts)) {
      errors.push('transformations preImageVertices must form a non-degenerate, non-self-intersecting polygon.');
      return;
    }
    const tr = obj.transformation as TransformationSpec | undefined;
    if (!tr || typeof tr !== 'object') {
      errors.push('transformations requires a "transformation" object.');
      return;
    }
    if (tr.kind === 'enlargement') {
      if (!isFiniteNum(tr.scaleFactor) || Math.abs(tr.scaleFactor) < GEO_EPS || Math.abs(tr.scaleFactor) > 5) {
        errors.push('transformations enlargement scaleFactor must be a non-zero finite number with |k| <= 5.');
        return;
      }
    }
    // Check EVERY expected image coordinate is in bounds AND reachable on gridStep!
    for (let i = 0; i < verts.length; i++) {
      const img = transformPoint(verts[i], tr);
      if (img.x < xMin - GEO_EPS || img.x > xMax + GEO_EPS || img.y < yMin - GEO_EPS || img.y > yMax + GEO_EPS) {
        errors.push(
          `transformations expected image vertex ${i} (${img.x}, ${img.y}) falls outside gridBounds [${xMin}, ${xMax}] × [${yMin}, ${yMax}].`,
        );
      }
      if (!isReachableOnGrid(img.x, gridStep) || !isReachableOnGrid(img.y, gridStep)) {
        errors.push(
          `transformations expected image vertex ${i} (${img.x}, ${img.y}) is NOT reachable on gridBounds.step = ${gridStep}. Adjust gridBounds.step (e.g. 0.5 or 0.25) so exact coordinates are enterable.`,
        );
      }
    }
    return;
  }

  // MODE 3: COORDINATE GEOMETRY
  if (mode === 'coordinate-geometry') {
    checkAllowed(obj, COORD_KEYS, 'geometry-constructor(coordinate-geometry)', errors);
    const cg = obj.coordGoal as Record<string, unknown> | undefined;
    if (!cg || typeof cg !== 'object' || Array.isArray(cg)) {
      errors.push('coordinate-geometry requires a "coordGoal" object.');
      return;
    }
    if (typeof cg.kind !== 'string' || !VALID_COORD_GOALS.has(cg.kind as CoordinateGoalKind)) {
      errors.push(`Unsupported coordinate-geometry coordGoal.kind "${String(cg.kind)}".`);
      return;
    }
    const gpts = cg.givenPoints as Array<{ x: number; y: number }> | undefined;
    if (!Array.isArray(gpts) || gpts.length < 1 || gpts.some((p) => !p || !isFiniteNum(p.x) || !isFiniteNum(p.y))) {
      errors.push('coordinate-geometry coordGoal.givenPoints must contain valid finite points.');
    }
    if (cg.kind === 'line-from-equation') {
      const gl = cg.targetGeneralLine as Record<string, unknown> | undefined;
      if (!gl || !isFiniteNum(gl.a) || !isFiniteNum(gl.b) || !isFiniteNum(gl.c) || Math.hypot(gl.a, gl.b) < GEO_EPS) {
        errors.push('coordinate-geometry line-from-equation requires finite targetGeneralLine { a, b, c } with a² + b² > 0.');
      }
    }
    return;
  }

  // MODE 4: CIRCLE THEOREMS
  checkAllowed(obj, CIRCLE_KEYS, 'geometry-constructor(circle-theorems)', errors);
  const ct = obj.circleTheorem as Record<string, unknown> | undefined;
  if (!ct || typeof ct !== 'object' || Array.isArray(ct)) {
    errors.push('circle-theorems requires a "circleTheorem" object.');
    return;
  }
  if (typeof ct.theorem !== 'string' || !VALID_THEOREMS.has(ct.theorem as CircleTheoremKind)) {
    errors.push(`Unsupported circleTheorem.theorem "${String(ct.theorem)}".`);
    return;
  }
  const fixed = ct.fixedAnglesDeg;
  const movable = ct.movablePointAngleDeg;
  if (!Array.isArray(fixed) || fixed.length < 1 || fixed.some((a) => !isFiniteNum(a))) {
    errors.push('circleTheorem.fixedAnglesDeg must be a non-empty array of finite angles in degrees.');
    return;
  }
  if (!isFiniteNum(movable)) {
    errors.push('circleTheorem.movablePointAngleDeg must be a finite angle in degrees.');
    return;
  }
  if (ct.theorem === 'semicircle-90' && fixed.length >= 2) {
    const diff = Math.abs((((fixed[1] as number) - (fixed[0] as number)) % 360 + 360) % 360 - 180);
    if (diff > 1) {
      errors.push('circleTheorem "semicircle-90" requires fixedAnglesDeg[0] and [1] to be 180° apart (a diameter).');
    }
  }
  // Cross-check derived mathematical angle against optional author expectedAngleDeg
  const derived = computeCircleTheoremGeometry(ct.theorem as CircleTheoremKind, fixed as number[], movable);
  if (!derived.validDomain) {
    errors.push(`circleTheorem initial movablePointAngleDeg is invalid: ${derived.domainWarning}`);
  } else if (ct.expectedAngleDeg !== undefined) {
    if (!isFiniteNum(ct.expectedAngleDeg) || Math.abs(ct.expectedAngleDeg - derived.measuredAngleDeg) > 1.5) {
      errors.push(
        `circleTheorem author expectedAngleDeg (${String(ct.expectedAngleDeg)}°) conflicts with mathematically derived angle (${derived.measuredAngleDeg}°).`,
      );
    }
  }
}
