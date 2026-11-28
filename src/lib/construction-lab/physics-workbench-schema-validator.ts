/**
 * GAM EDU — Step 5G Strict Schema Validator for `labKind: 'physics-workbench'` (construction-lab 1.10.0)
 *
 * Pure TypeScript, zero React/DOM dependencies.
 * Enforces strict key allowlists, physical parameter bounds, and shared selectable `examples` validation.
 */

import {
  PHYSICS_LIMITS,
  computeMomentsEquilibrium,
  computeOpticalImage,
  computePlaneReflection,
  computeRefraction,
  computeSimpleMachine,
  type BeamForceDef,
  type OpticalElementKind,
  type PhysicsChallengeGoal,
  type PhysicsInteractionMode,
  type PhysicsWorkbenchMode,
  type SimpleMachineKind,
} from './physics-workbench-engine';

const SHARED_KEYS = [
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
  'interactionMode',
  'subjectTag',
  'modelNote',
  'prediction',
  'successExplanation',
  'exploreFurther',
  'isAssessment',
  'goal',
  'examples',
] as const;

const MODE_SPECIFIC_KEYS: Record<PhysicsWorkbenchMode, readonly string[]> = {
  reflection: ['initialIncidentAngleDeg'],
  refraction: ['initialIncidentAngleDeg', 'initialN1', 'initialN2', 'medium1Name', 'medium2Name'],
  'thin-lens': ['elementKind', 'initialFocalLengthCm', 'initialObjectDistanceCm', 'initialObjectHeightCm'],
  'spherical-mirror': ['elementKind', 'initialFocalLengthCm', 'initialObjectDistanceCm', 'initialObjectHeightCm'],
  moments: ['initialPivotPositionM', 'initialForces', 'equilibriumToleranceNm'],
  'simple-machines': [
    'machineKind',
    'initialLoadN',
    'initialLoadDistanceM',
    'initialEfficiencyPct',
    'initialEffortArmM',
    'initialLoadArmM',
    'initialSupportingStrands',
    'initialPlaneLengthM',
    'initialPlaneHeightM',
  ],
};

const EXAMPLE_META_KEYS = ['id', 'label', 'prompt', 'modelNote', 'successExplanation', 'goal'] as const;
const GOAL_ALLOWED_KEYS = new Set(['description', 'metric', 'targetValue', 'tolerance']);
const FORCE_ALLOWED_KEYS = new Set(['id', 'label', 'forceN', 'positionM', 'direction']);

const VALID_MODES = new Set<PhysicsWorkbenchMode>([
  'reflection',
  'refraction',
  'thin-lens',
  'spherical-mirror',
  'moments',
  'simple-machines',
]);
const VALID_LEVELS = new Set(['introductory', 'igcse', 'as-a-level']);
const VALID_INTERACTION_MODES = new Set<PhysicsInteractionMode>(['free-exploration', 'guided', 'independent-challenge']);
const VALID_METRICS = new Set<PhysicsChallengeGoal['metric']>([
  'reflectedAngleDeg',
  'angleBetweenRaysDeg',
  'refractedAngleDeg',
  'requireTIR',
  'imageDistanceCm',
  'requireVirtualImage',
  'requireImageAtInfinity',
  'requireRotationalEquilibrium',
  'actualEffortN',
  'mechanicalAdvantage',
]);

function checkAllowed(rec: Record<string, unknown>, allowed: ReadonlySet<string>, ctx: string, errors: string[]): void {
  for (const k of Object.keys(rec)) {
    if (!allowed.has(k)) {
      errors.push(`Unknown field "${k}" in ${ctx}.`);
    }
  }
}

function validateGoal(raw: unknown, ctx: string, errors: string[]): void {
  if (raw === undefined) return;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    errors.push(`${ctx}.goal must be an object.`);
    return;
  }
  const g = raw as Record<string, unknown>;
  checkAllowed(g, GOAL_ALLOWED_KEYS, `${ctx}.goal`, errors);
  if (typeof g.description !== 'string' || g.description.trim().length < 4) {
    errors.push(`${ctx}.goal.description must be a non-empty string.`);
  }
  if (typeof g.metric !== 'string' || !VALID_METRICS.has(g.metric as PhysicsChallengeGoal['metric'])) {
    errors.push(`${ctx}.goal.metric "${String(g.metric)}" is invalid.`);
  }
  if (g.targetValue !== undefined && (typeof g.targetValue !== 'number' || !Number.isFinite(g.targetValue))) {
    errors.push(`${ctx}.goal.targetValue must be a finite number.`);
  }
  if (g.tolerance !== undefined && (typeof g.tolerance !== 'number' || !Number.isFinite(g.tolerance) || g.tolerance < 0)) {
    errors.push(`${ctx}.goal.tolerance must be a non-negative finite number.`);
  }
}

function validateModePayload(mode: PhysicsWorkbenchMode, rec: Record<string, unknown>, ctx: string, errors: string[]): void {
  if (mode === 'reflection') {
    const angle = rec.initialIncidentAngleDeg === undefined ? 30 : rec.initialIncidentAngleDeg;
    const res = computePlaneReflection({ incidentAngleDeg: angle as number });
    if (!res.ok) errors.push(`${ctx}: ${res.error}`);
    return;
  }

  if (mode === 'refraction') {
    const angle = rec.initialIncidentAngleDeg === undefined ? 30 : rec.initialIncidentAngleDeg;
    const n1 = rec.initialN1 === undefined ? 1.0 : rec.initialN1;
    const n2 = rec.initialN2 === undefined ? 1.52 : rec.initialN2;
    const res = computeRefraction({ incidentAngleDeg: angle as number, n1: n1 as number, n2: n2 as number });
    if (!res.ok) errors.push(`${ctx}: ${res.error}`);
    return;
  }

  if (mode === 'thin-lens' || mode === 'spherical-mirror') {
    const kind = rec.elementKind as OpticalElementKind;
    const expectedKinds =
      mode === 'thin-lens' ? ['converging-lens', 'diverging-lens'] : ['concave-mirror', 'convex-mirror'];
    if (!expectedKinds.includes(kind)) {
      errors.push(`${ctx}.elementKind must be one of ${expectedKinds.join(', ')}.`);
      return;
    }
    const f = rec.initialFocalLengthCm === undefined ? 12 : rec.initialFocalLengthCm;
    const u = rec.initialObjectDistanceCm === undefined ? 24 : rec.initialObjectDistanceCm;
    const ho = rec.initialObjectHeightCm === undefined ? 6 : rec.initialObjectHeightCm;
    const res = computeOpticalImage({
      elementKind: kind,
      focalLengthMagCm: f as number,
      objectDistanceCm: u as number,
      objectHeightCm: ho as number,
    });
    if (!res.ok) errors.push(`${ctx}: ${res.error}`);
    return;
  }

  if (mode === 'moments') {
    const pivot = rec.initialPivotPositionM === undefined ? 0 : rec.initialPivotPositionM;
    if (!Array.isArray(rec.initialForces) || rec.initialForces.length < 1 || rec.initialForces.length > PHYSICS_LIMITS.maxForces) {
      errors.push(`${ctx}.initialForces must contain 1 to ${PHYSICS_LIMITS.maxForces} force objects.`);
      return;
    }
    const seenIds = new Set<string>();
    for (let i = 0; i < rec.initialForces.length; i++) {
      const f = rec.initialForces[i];
      if (!f || typeof f !== 'object' || Array.isArray(f)) {
        errors.push(`${ctx}.initialForces[${i}] must be an object.`);
        continue;
      }
      const fRec = f as Record<string, unknown>;
      checkAllowed(fRec, FORCE_ALLOWED_KEYS, `${ctx}.initialForces[${i}]`, errors);
      if (typeof fRec.id !== 'string' || !fRec.id.trim()) {
        errors.push(`${ctx}.initialForces[${i}].id must be a non-empty string.`);
      } else if (seenIds.has(fRec.id)) {
        errors.push(`${ctx}: duplicate force id "${fRec.id}".`);
      } else {
        seenIds.add(fRec.id);
      }
      if (typeof fRec.label !== 'string' || !fRec.label.trim()) {
        errors.push(`${ctx}.initialForces[${i}].label must be a non-empty string.`);
      }
    }
    const res = computeMomentsEquilibrium({
      pivotPositionM: pivot as number,
      forces: rec.initialForces as BeamForceDef[],
      equilibriumToleranceNm: typeof rec.equilibriumToleranceNm === 'number' ? rec.equilibriumToleranceNm : undefined,
    });
    if (!res.ok) errors.push(`${ctx}: ${res.error}`);
    return;
  }

  // simple-machines
  const mk = rec.machineKind as SimpleMachineKind;
  const res = computeSimpleMachine({
    machineKind: mk,
    loadN: (rec.initialLoadN ?? 100) as number,
    loadDistanceM: (rec.initialLoadDistanceM ?? 1) as number,
    efficiencyPct: (rec.initialEfficiencyPct ?? 100) as number,
    effortArmM: rec.initialEffortArmM as number | undefined,
    loadArmM: rec.initialLoadArmM as number | undefined,
    supportingStrands: rec.initialSupportingStrands as number | undefined,
    planeLengthM: rec.initialPlaneLengthM as number | undefined,
    planeHeightM: rec.initialPlaneHeightM as number | undefined,
  });
  if (!res.ok) errors.push(`${ctx}: ${res.error}`);
}

export function validatePhysicsWorkbenchConfig(obj: Record<string, unknown>, errors: string[]): void {
  const mode = obj.mode as PhysicsWorkbenchMode;
  if (typeof mode !== 'string' || !VALID_MODES.has(mode)) {
    errors.push(
      'physics-workbench "mode" must be reflection, refraction, thin-lens, spherical-mirror, moments, or simple-machines.',
    );
    return;
  }

  const allowedTop = new Set<string>([...SHARED_KEYS, ...MODE_SPECIFIC_KEYS[mode]]);
  checkAllowed(obj, allowedTop, `physics-workbench(${mode})`, errors);

  if (typeof obj.curriculumLevel !== 'string' || !VALID_LEVELS.has(obj.curriculumLevel)) {
    errors.push('physics-workbench "curriculumLevel" must be "introductory", "igcse", or "as-a-level".');
  }
  if (
    obj.interactionMode !== undefined &&
    (typeof obj.interactionMode !== 'string' || !VALID_INTERACTION_MODES.has(obj.interactionMode as PhysicsInteractionMode))
  ) {
    errors.push('physics-workbench "interactionMode" must be "free-exploration", "guided", or "independent-challenge".');
  }

  validateGoal(obj.goal, `physics-workbench(${mode})`, errors);
  validateModePayload(mode, obj, `physics-workbench(${mode})`, errors);

  if (obj.examples !== undefined) {
    if (!Array.isArray(obj.examples) || obj.examples.length < 1 || obj.examples.length > PHYSICS_LIMITS.maxExamples) {
      errors.push(`physics-workbench "examples" must contain 1 to ${PHYSICS_LIMITS.maxExamples} validated examples.`);
      return;
    }
    const allowedEx = new Set<string>([...EXAMPLE_META_KEYS, ...MODE_SPECIFIC_KEYS[mode]]);
    const seenIds = new Set<string>();
    obj.examples.forEach((rawEx, idx) => {
      const ctx = `physics-workbench(${mode}).examples[${idx}]`;
      if (!rawEx || typeof rawEx !== 'object' || Array.isArray(rawEx)) {
        errors.push(`${ctx} must be an object.`);
        return;
      }
      const rec = rawEx as Record<string, unknown>;
      checkAllowed(rec, allowedEx, ctx, errors);
      if (typeof rec.id !== 'string' || !/^[A-Za-z0-9_-]{1,40}$/.test(rec.id)) {
        errors.push(`${ctx}.id must be a 1-40 char identifier.`);
      } else if (seenIds.has(rec.id)) {
        errors.push(`Duplicate example id "${rec.id}" in physics-workbench(${mode}).examples.`);
      } else {
        seenIds.add(rec.id);
      }
      if (typeof rec.label !== 'string' || rec.label.trim().length < 2) {
        errors.push(`${ctx}.label must be a non-empty string.`);
      }
      validateGoal(rec.goal, ctx, errors);
      validateModePayload(mode, rec, ctx, errors);
    });
  }
}
