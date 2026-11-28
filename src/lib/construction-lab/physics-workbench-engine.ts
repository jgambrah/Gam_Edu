/**
 * GAM EDU — Step 5G Pure Scientific Module: Bounded Dynamic Physics Workbench
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies, zero WebGL/eval.
 * Covers 6 bounded reusable curriculum domains:
 *   1. Reflection of light (plane mirror, normal-based angles, deviation)
 *   2. Refraction & Total Internal Reflection (Snell's law, critical angle, normal/equal-n boundaries)
 *   3. Thin lenses & image formation (converging/diverging, real-is-positive, u = f infinity singularity)
 *   4. Spherical mirrors (concave/convex, shared paraxial optical geometry)
 *   5. Moments & rotational vs complete static equilibrium (adjustable pivot, up to 6 forces, pivot reaction)
 *   6. Simple machines (levers Class 1/2/3, bounded pulleys 1..6 strands, inclined planes; ideal vs non-ideal)
 */

export type PhysicsWorkbenchMode =
  | 'reflection'
  | 'refraction'
  | 'thin-lens'
  | 'spherical-mirror'
  | 'moments'
  | 'simple-machines';

export type PhysicsInteractionMode = 'free-exploration' | 'guided' | 'independent-challenge';

export const PHYSICS_LIMITS = {
  minIncidenceDeg: 0,
  maxIncidenceDeg: 85,
  minRefractiveIndex: 1.0,
  maxRefractiveIndex: 2.5,
  minFocalLengthCm: 4,
  maxFocalLengthCm: 30,
  minObjectDistCm: 2,
  maxObjectDistCm: 80,
  minObjectHeightCm: 1,
  maxObjectHeightCm: 15,
  minBeamPosM: -5,
  maxBeamPosM: 5,
  maxForces: 6,
  maxForceN: 200,
  maxPulleyStrands: 6,
  maxExamples: 8,
} as const;

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

function roundTo(n: number, dp = 2): number {
  const f = Math.pow(10, dp);
  return Math.round(n * f) / f;
}

function isFiniteInRange(n: unknown, min: number, max: number): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max;
}

/* ========================================================================== */
/* DOMAIN A: REFLECTION OF LIGHT (PLANE MIRROR)                               */
/* ========================================================================== */

export interface ReflectionInput {
  incidentAngleDeg: number;
}

export interface ReflectionResult {
  ok: boolean;
  error?: string;
  incidentAngleDeg: number;
  reflectedAngleDeg: number;
  glancingAngleDeg: number;
  angleBetweenRaysDeg: number;
  deviationAngleDeg: number;
  isNormalIncidence: boolean;
  summary: string;
}

export function computePlaneReflection(input: ReflectionInput): ReflectionResult {
  if (!isFiniteInRange(input.incidentAngleDeg, PHYSICS_LIMITS.minIncidenceDeg, PHYSICS_LIMITS.maxIncidenceDeg)) {
    return {
      ok: false,
      error: `Angle of incidence must be a finite number between ${PHYSICS_LIMITS.minIncidenceDeg}° and ${PHYSICS_LIMITS.maxIncidenceDeg}° (measured from the normal).`,
      incidentAngleDeg: 0,
      reflectedAngleDeg: 0,
      glancingAngleDeg: 90,
      angleBetweenRaysDeg: 0,
      deviationAngleDeg: 180,
      isNormalIncidence: true,
      summary: 'Invalid incidence angle.',
    };
  }
  const thetaI = roundTo(input.incidentAngleDeg, 2);
  const thetaR = thetaI;
  const glancing = roundTo(90 - thetaI, 2);
  const between = roundTo(2 * thetaI, 2);
  const deviation = roundTo(180 - 2 * thetaI, 2);
  const isNormal = Math.abs(thetaI) < 1e-6;

  return {
    ok: true,
    incidentAngleDeg: thetaI,
    reflectedAngleDeg: thetaR,
    glancingAngleDeg: glancing,
    angleBetweenRaysDeg: between,
    deviationAngleDeg: deviation,
    isNormalIncidence: isNormal,
    summary: isNormal
      ? 'Normal incidence (0° from normal): the ray strikes perpendicularly and reflects directly back along the normal (0°).'
      : `Law of reflection: θᵢ = ${thetaI}° = θᵣ = ${thetaR}° (measured from the normal; glancing angle with mirror = ${glancing}°, total angle between rays = ${between}°).`,
  };
}

/* ========================================================================== */
/* DOMAIN B: REFRACTION & TOTAL INTERNAL REFLECTION                           */
/* ========================================================================== */

export interface OpticalMediumDef {
  id: string;
  name: string;
  n: number;
}

export const APPROVED_OPTICAL_MEDIA: readonly OpticalMediumDef[] = [
  { id: 'vacuum', name: 'Vacuum', n: 1.0 },
  { id: 'air', name: 'Air', n: 1.0 },
  { id: 'water', name: 'Water', n: 1.33 },
  { id: 'ethanol', name: 'Ethanol', n: 1.36 },
  { id: 'perspex', name: 'Perspex (Acrylic)', n: 1.49 },
  { id: 'crown-glass', name: 'Crown Glass', n: 1.52 },
  { id: 'flint-glass', name: 'Flint Glass', n: 1.62 },
  { id: 'diamond', name: 'Diamond', n: 2.42 },
];

export interface RefractionInput {
  incidentAngleDeg: number;
  n1: number;
  n2: number;
}

export interface RefractionResult {
  ok: boolean;
  error?: string;
  incidentAngleDeg: number;
  n1: number;
  n2: number;
  refractedAngleDeg: number | null;
  reflectedAngleDeg: number;
  criticalAngleDeg: number | null;
  isTotalInternalReflection: boolean;
  isAtCriticalAngle: boolean;
  isNormalIncidence: boolean;
  isEqualIndex: boolean;
  bendDirection: 'towards-normal' | 'away-from-normal' | 'undeviated' | 'total-internal-reflection' | 'grazing-critical';
  summary: string;
}

export function computeRefraction(input: RefractionInput): RefractionResult {
  const errBase = (msg: string): RefractionResult => ({
    ok: false,
    error: msg,
    incidentAngleDeg: 0,
    n1: 1,
    n2: 1,
    refractedAngleDeg: null,
    reflectedAngleDeg: 0,
    criticalAngleDeg: null,
    isTotalInternalReflection: false,
    isAtCriticalAngle: false,
    isNormalIncidence: false,
    isEqualIndex: false,
    bendDirection: 'undeviated',
    summary: msg,
  });

  if (!isFiniteInRange(input.incidentAngleDeg, PHYSICS_LIMITS.minIncidenceDeg, PHYSICS_LIMITS.maxIncidenceDeg)) {
    return errBase(`Angle of incidence must be between ${PHYSICS_LIMITS.minIncidenceDeg}° and ${PHYSICS_LIMITS.maxIncidenceDeg}°.`);
  }
  if (
    !isFiniteInRange(input.n1, PHYSICS_LIMITS.minRefractiveIndex, PHYSICS_LIMITS.maxRefractiveIndex) ||
    !isFiniteInRange(input.n2, PHYSICS_LIMITS.minRefractiveIndex, PHYSICS_LIMITS.maxRefractiveIndex)
  ) {
    return errBase(`Refractive indices n₁ and n₂ must be between ${PHYSICS_LIMITS.minRefractiveIndex} and ${PHYSICS_LIMITS.maxRefractiveIndex}.`);
  }

  const thetaI = roundTo(input.incidentAngleDeg, 2);
  const n1 = roundTo(input.n1, 3);
  const n2 = roundTo(input.n2, 3);
  const criticalAngleDeg = n1 > n2 ? roundTo(Math.asin(n2 / n1) * RAD_TO_DEG, 2) : null;
  const isNormal = Math.abs(thetaI) < 1e-6;
  const isEqual = Math.abs(n1 - n2) < 1e-6;

  if (isNormal) {
    return {
      ok: true,
      incidentAngleDeg: 0,
      n1,
      n2,
      refractedAngleDeg: 0,
      reflectedAngleDeg: 0,
      criticalAngleDeg,
      isTotalInternalReflection: false,
      isAtCriticalAngle: false,
      isNormalIncidence: true,
      isEqualIndex: isEqual,
      bendDirection: 'undeviated',
      summary: isEqual
        ? `Normal incidence with equal refractive indices (n₁ = n₂ = ${n1}): ray continues straight with no change in speed or direction.`
        : `Normal incidence (θᵢ = 0°): ray enters straight along the normal (θᵣ = 0°) without bending, although wave speed and wavelength change between n₁ = ${n1} and n₂ = ${n2}.`,
    };
  }

  if (isEqual) {
    return {
      ok: true,
      incidentAngleDeg: thetaI,
      n1,
      n2,
      refractedAngleDeg: thetaI,
      reflectedAngleDeg: thetaI,
      criticalAngleDeg: null,
      isTotalInternalReflection: false,
      isAtCriticalAngle: false,
      isNormalIncidence: false,
      isEqualIndex: true,
      bendDirection: 'undeviated',
      summary: `Equal refractive indices (n₁ = n₂ = ${n1}): optically uniform boundary — ray passes straight through at θᵣ = ${thetaI}° with no refraction or TIR.`,
    };
  }

  const sinThetaR = (n1 / n2) * Math.sin(thetaI * DEG_TO_RAD);

  // Critical angle boundary check (within 0.05° of exact critical angle)
  if (criticalAngleDeg !== null && Math.abs(thetaI - criticalAngleDeg) <= 0.05) {
    return {
      ok: true,
      incidentAngleDeg: thetaI,
      n1,
      n2,
      refractedAngleDeg: 90,
      reflectedAngleDeg: thetaI,
      criticalAngleDeg,
      isTotalInternalReflection: false,
      isAtCriticalAngle: true,
      isNormalIncidence: false,
      isEqualIndex: false,
      bendDirection: 'grazing-critical',
      summary: `At the critical angle (θᵢ ≈ θc = ${criticalAngleDeg}°): the refracted ray grazes along the boundary at θᵣ = 90° alongside partial internal reflection.`,
    };
  }

  if (sinThetaR > 1.0) {
    return {
      ok: true,
      incidentAngleDeg: thetaI,
      n1,
      n2,
      refractedAngleDeg: null,
      reflectedAngleDeg: thetaI,
      criticalAngleDeg,
      isTotalInternalReflection: true,
      isAtCriticalAngle: false,
      isNormalIncidence: false,
      isEqualIndex: false,
      bendDirection: 'total-internal-reflection',
      summary: `Total Internal Reflection (TIR): θᵢ = ${thetaI}° exceeds critical angle θc = ${criticalAngleDeg}° (n₁ = ${n1} > n₂ = ${n2}). No refracted ray exits; 100% reflects at θ = ${thetaI}°.`,
    };
  }

  const thetaR = roundTo(Math.asin(Math.min(1, Math.max(-1, sinThetaR))) * RAD_TO_DEG, 2);
  const bendDirection = n2 > n1 ? 'towards-normal' : 'away-from-normal';
  return {
    ok: true,
    incidentAngleDeg: thetaI,
    n1,
    n2,
    refractedAngleDeg: thetaR,
    reflectedAngleDeg: thetaI,
    criticalAngleDeg,
    isTotalInternalReflection: false,
    isAtCriticalAngle: false,
    isNormalIncidence: false,
    isEqualIndex: false,
    bendDirection,
    summary: `Snell's law: n₁ sin(${thetaI}°) = n₂ sin(${thetaR}°) → ray bends ${bendDirection === 'towards-normal' ? 'towards' : 'away from'} the normal (θᵣ = ${thetaR}°${criticalAngleDeg !== null ? `; critical angle θc = ${criticalAngleDeg}°` : '; no critical angle because n₁ < n₂'}).`,
  };
}

/* ========================================================================== */
/* DOMAINS C & D: THIN LENSES & SPHERICAL MIRRORS (REAL-IS-POSITIVE)          */
/* ========================================================================== */

export type OpticalElementKind = 'converging-lens' | 'diverging-lens' | 'concave-mirror' | 'convex-mirror';

export interface OpticalImageInput {
  elementKind: OpticalElementKind;
  /** Magnitude of focal length in cm (positive number; sign derived from elementKind) */
  focalLengthMagCm: number;
  /** Real object distance u > 0 in cm */
  objectDistanceCm: number;
  /** Object height h_o > 0 in cm */
  objectHeightCm: number;
}

export interface OpticalImageResult {
  ok: boolean;
  error?: string;
  elementKind: OpticalElementKind;
  signedFocalLengthCm: number;
  objectDistanceCm: number;
  objectHeightCm: number;
  imageAtInfinity: boolean;
  /** Signed image distance v in cm (real-is-positive: v > 0 real, v < 0 virtual, null at infinity) */
  imageDistanceCm: number | null;
  /** Signed linear magnification m = -v/u (m < 0 inverted, m > 0 upright, null at infinity) */
  magnification: number | null;
  imageHeightCm: number | null;
  imageNature: 'real' | 'virtual' | 'at-infinity';
  orientation: 'inverted' | 'upright' | 'undefined';
  sizeRelation: 'magnified' | 'same-size' | 'diminished' | 'undefined';
  summary: string;
}

export function computeOpticalImage(input: OpticalImageInput): OpticalImageResult {
  const errBase = (msg: string): OpticalImageResult => ({
    ok: false,
    error: msg,
    elementKind: input.elementKind,
    signedFocalLengthCm: 0,
    objectDistanceCm: 0,
    objectHeightCm: 0,
    imageAtInfinity: false,
    imageDistanceCm: null,
    magnification: null,
    imageHeightCm: null,
    imageNature: 'at-infinity',
    orientation: 'undefined',
    sizeRelation: 'undefined',
    summary: msg,
  });

  if (
    input.elementKind !== 'converging-lens' &&
    input.elementKind !== 'diverging-lens' &&
    input.elementKind !== 'concave-mirror' &&
    input.elementKind !== 'convex-mirror'
  ) {
    return errBase(`Unsupported optical element "${String(input.elementKind)}".`);
  }
  if (!isFiniteInRange(input.focalLengthMagCm, PHYSICS_LIMITS.minFocalLengthCm, PHYSICS_LIMITS.maxFocalLengthCm)) {
    return errBase(`Focal length magnitude must be between ${PHYSICS_LIMITS.minFocalLengthCm} cm and ${PHYSICS_LIMITS.maxFocalLengthCm} cm.`);
  }
  if (!isFiniteInRange(input.objectDistanceCm, PHYSICS_LIMITS.minObjectDistCm, PHYSICS_LIMITS.maxObjectDistCm)) {
    return errBase(`Object distance u must be between ${PHYSICS_LIMITS.minObjectDistCm} cm and ${PHYSICS_LIMITS.maxObjectDistCm} cm.`);
  }
  if (!isFiniteInRange(input.objectHeightCm, PHYSICS_LIMITS.minObjectHeightCm, PHYSICS_LIMITS.maxObjectHeightCm)) {
    return errBase(`Object height hₒ must be between ${PHYSICS_LIMITS.minObjectHeightCm} cm and ${PHYSICS_LIMITS.maxObjectHeightCm} cm.`);
  }

  const isConverging = input.elementKind === 'converging-lens' || input.elementKind === 'concave-mirror';
  const f = isConverging ? input.focalLengthMagCm : -input.focalLengthMagCm;
  const u = input.objectDistanceCm;
  const ho = input.objectHeightCm;

  // Singularity check: object placed at focal point (u == f for converging lens / concave mirror)
  if (Math.abs(u - f) < 1e-4) {
    return {
      ok: true,
      elementKind: input.elementKind,
      signedFocalLengthCm: roundTo(f, 2),
      objectDistanceCm: roundTo(u, 2),
      objectHeightCm: roundTo(ho, 2),
      imageAtInfinity: true,
      imageDistanceCm: null,
      magnification: null,
      imageHeightCm: null,
      imageNature: 'at-infinity',
      orientation: 'undefined',
      sizeRelation: 'undefined',
      summary: `Object at principal focus (u = f = ${roundTo(f, 2)} cm): emerging rays are parallel, so no finite image is formed (image at infinity).`,
    };
  }

  const vRaw = (u * f) / (u - f);
  const mRaw = -vRaw / u;
  const hiRaw = mRaw * ho;

  const v = roundTo(vRaw, 2);
  const m = roundTo(mRaw, 2);
  const hi = roundTo(hiRaw, 2);
  const imageNature: 'real' | 'virtual' = vRaw > 0 ? 'real' : 'virtual';
  const orientation: 'inverted' | 'upright' = mRaw < 0 ? 'inverted' : 'upright';
  const absM = Math.abs(mRaw);
  const sizeRelation: 'magnified' | 'same-size' | 'diminished' =
    Math.abs(absM - 1) < 0.02 ? 'same-size' : absM > 1 ? 'magnified' : 'diminished';

  const label = input.elementKind.replace('-', ' ');
  return {
    ok: true,
    elementKind: input.elementKind,
    signedFocalLengthCm: roundTo(f, 2),
    objectDistanceCm: roundTo(u, 2),
    objectHeightCm: roundTo(ho, 2),
    imageAtInfinity: false,
    imageDistanceCm: v,
    magnification: m,
    imageHeightCm: hi,
    imageNature,
    orientation,
    sizeRelation,
    summary: `${label} (f = ${f > 0 ? `+${roundTo(f, 2)}` : roundTo(f, 2)} cm, u = ${roundTo(u, 2)} cm): v = ${v > 0 ? `+${v}` : v} cm, m = ${m > 0 ? `+${m}` : m} → ${imageNature}, ${orientation}, ${sizeRelation} image (height ${Math.abs(hi)} cm).`,
  };
}

/* ========================================================================== */
/* DOMAIN E: MOMENTS & EQUILIBRIUM                                            */
/* ========================================================================== */

export interface BeamForceDef {
  id: string;
  label: string;
  /** Force magnitude in Newtons (>= 0) */
  forceN: number;
  /** Position along uniform beam in metres [-5, +5] */
  positionM: number;
  direction: 'down' | 'up';
}

export interface MomentsInput {
  pivotPositionM: number;
  forces: BeamForceDef[];
  equilibriumToleranceNm?: number;
}

export interface ForceMomentBreakdown {
  id: string;
  label: string;
  leverArmM: number;
  momentNm: number;
  sense: 'clockwise' | 'anticlockwise' | 'zero';
}

export interface MomentsResult {
  ok: boolean;
  error?: string;
  pivotPositionM: number;
  breakdown: ForceMomentBreakdown[];
  totalClockwiseNm: number;
  totalAnticlockwiseNm: number;
  /** Signed net moment (CW positive, ACW negative) */
  netMomentNm: number;
  isRotationalEquilibrium: boolean;
  /** Net external vertical force (up positive, down negative) BEFORE pivot reaction */
  netExternalVerticalForceN: number;
  /** Upward (+) or downward (-) reaction force the pivot must supply so sum(Fy) = 0 */
  requiredPivotReactionN: number;
  summary: string;
}

export function computeMomentsEquilibrium(input: MomentsInput): MomentsResult {
  const errBase = (msg: string): MomentsResult => ({
    ok: false,
    error: msg,
    pivotPositionM: 0,
    breakdown: [],
    totalClockwiseNm: 0,
    totalAnticlockwiseNm: 0,
    netMomentNm: 0,
    isRotationalEquilibrium: false,
    netExternalVerticalForceN: 0,
    requiredPivotReactionN: 0,
    summary: msg,
  });

  if (!isFiniteInRange(input.pivotPositionM, PHYSICS_LIMITS.minBeamPosM, PHYSICS_LIMITS.maxBeamPosM)) {
    return errBase(`Pivot position must be between ${PHYSICS_LIMITS.minBeamPosM} m and ${PHYSICS_LIMITS.maxBeamPosM} m.`);
  }
  if (!Array.isArray(input.forces) || input.forces.length < 1 || input.forces.length > PHYSICS_LIMITS.maxForces) {
    return errBase(`Moments workbench requires 1 to ${PHYSICS_LIMITS.maxForces} forces.`);
  }

  let totalCW = 0;
  let totalACW = 0;
  let netFy = 0;
  const breakdown: ForceMomentBreakdown[] = [];

  for (const f of input.forces) {
    if (!isFiniteInRange(f.forceN, 0, PHYSICS_LIMITS.maxForceN)) {
      return errBase(`Force "${f.label}" magnitude must be between 0 N and ${PHYSICS_LIMITS.maxForceN} N.`);
    }
    if (!isFiniteInRange(f.positionM, PHYSICS_LIMITS.minBeamPosM, PHYSICS_LIMITS.maxBeamPosM)) {
      return errBase(`Force "${f.label}" position must be between ${PHYSICS_LIMITS.minBeamPosM} m and ${PHYSICS_LIMITS.maxBeamPosM} m.`);
    }
    if (f.direction !== 'down' && f.direction !== 'up') {
      return errBase(`Force "${f.label}" direction must be "down" or "up".`);
    }
    const d = f.positionM - input.pivotPositionM;
    // Clockwise positive: downward force to right (d > 0) OR upward force to left (d < 0)
    const signedTorqueCW = f.direction === 'down' ? f.forceN * d : -f.forceN * d;
    const mag = roundTo(Math.abs(signedTorqueCW), 2);
    let sense: 'clockwise' | 'anticlockwise' | 'zero' = 'zero';
    if (signedTorqueCW > 1e-6) {
      totalCW += signedTorqueCW;
      sense = 'clockwise';
    } else if (signedTorqueCW < -1e-6) {
      totalACW += -signedTorqueCW;
      sense = 'anticlockwise';
    }
    netFy += f.direction === 'up' ? f.forceN : -f.forceN;
    breakdown.push({
      id: f.id,
      label: f.label,
      leverArmM: roundTo(Math.abs(d), 2),
      momentNm: mag,
      sense,
    });
  }

  const tol = input.equilibriumToleranceNm ?? 0.05;
  const cwR = roundTo(totalCW, 2);
  const acwR = roundTo(totalACW, 2);
  const netM = roundTo(totalCW - totalACW, 2);
  const isRotEq = Math.abs(totalCW - totalACW) <= tol;
  const reqReaction = roundTo(-netFy, 2);

  return {
    ok: true,
    pivotPositionM: roundTo(input.pivotPositionM, 2),
    breakdown,
    totalClockwiseNm: cwR,
    totalAnticlockwiseNm: acwR,
    netMomentNm: netM,
    isRotationalEquilibrium: isRotEq,
    netExternalVerticalForceN: roundTo(netFy, 2),
    requiredPivotReactionN: reqReaction,
    summary: isRotEq
      ? `Rotational equilibrium reached: Clockwise (${cwR} N·m) = Anticlockwise (${acwR} N·m). For complete static equilibrium, the pivot must also supply a vertical reaction of ${reqReaction >= 0 ? `+${reqReaction}` : reqReaction} N (${reqReaction >= 0 ? 'upward' : 'downward'}) so net force is zero.`
      : `Not in rotational equilibrium: Clockwise = ${cwR} N·m vs Anticlockwise = ${acwR} N·m (net moment ${Math.abs(netM)} N·m ${netM > 0 ? 'clockwise' : 'anticlockwise'}).`,
  };
}

/* ========================================================================== */
/* DOMAIN F: SIMPLE MACHINES (LEVERS, PULLEYS, INCLINED PLANES)               */
/* ========================================================================== */

export type SimpleMachineKind = 'lever' | 'pulley' | 'inclined-plane';

export interface SimpleMachineInput {
  machineKind: SimpleMachineKind;
  /** Load force L in Newtons (> 0) */
  loadN: number;
  /** Load displacement in metres (> 0, default 1 m) */
  loadDistanceM?: number;
  /** Efficiency percentage (10..100]; 100% = ideal frictionless model */
  efficiencyPct: number;
  /** Lever parameters (m) */
  effortArmM?: number;
  loadArmM?: number;
  /** Pulley parameter: number of supporting rope strands (1..6) */
  supportingStrands?: number;
  /** Inclined plane parameters (m): length >= height > 0 */
  planeLengthM?: number;
  planeHeightM?: number;
}

export interface SimpleMachineResult {
  ok: boolean;
  error?: string;
  machineKind: SimpleMachineKind;
  velocityRatio: number;
  mechanicalAdvantage: number;
  idealEffortN: number;
  actualEffortN: number;
  efficiencyPct: number;
  isIdealModel: boolean;
  workOutputJ: number;
  workInputJ: number;
  energyLostToFrictionJ: number;
  inclineAngleDeg: number | null;
  summary: string;
}

export function computeSimpleMachine(input: SimpleMachineInput): SimpleMachineResult {
  const errBase = (msg: string): SimpleMachineResult => ({
    ok: false,
    error: msg,
    machineKind: input.machineKind,
    velocityRatio: 1,
    mechanicalAdvantage: 1,
    idealEffortN: 0,
    actualEffortN: 0,
    efficiencyPct: 0,
    isIdealModel: false,
    workOutputJ: 0,
    workInputJ: 0,
    energyLostToFrictionJ: 0,
    inclineAngleDeg: null,
    summary: msg,
  });

  if (!isFiniteInRange(input.loadN, 1, 5000)) {
    return errBase('Load force must be a finite number between 1 N and 5,000 N.');
  }
  const dLoad = input.loadDistanceM ?? 1;
  if (!isFiniteInRange(dLoad, 0.1, 20)) {
    return errBase('Load displacement must be between 0.1 m and 20 m.');
  }
  if (!isFiniteInRange(input.efficiencyPct, 10, 100)) {
    return errBase('Efficiency must be between 10% and 100% (conservation of energy forbids > 100%).');
  }

  let vr = 1;
  let inclineAngleDeg: number | null = null;

  if (input.machineKind === 'lever') {
    if (!isFiniteInRange(input.effortArmM, 0.1, 10) || !isFiniteInRange(input.loadArmM, 0.1, 10)) {
      return errBase('Lever effort arm and load arm must be between 0.1 m and 10 m.');
    }
    vr = input.effortArmM / input.loadArmM;
  } else if (input.machineKind === 'pulley') {
    if (
      typeof input.supportingStrands !== 'number' ||
      !Number.isInteger(input.supportingStrands) ||
      input.supportingStrands < 1 ||
      input.supportingStrands > PHYSICS_LIMITS.maxPulleyStrands
    ) {
      return errBase(`Pulley supporting strands must be an integer between 1 and ${PHYSICS_LIMITS.maxPulleyStrands}.`);
    }
    vr = input.supportingStrands;
  } else if (input.machineKind === 'inclined-plane') {
    if (!isFiniteInRange(input.planeLengthM, 0.5, 20) || !isFiniteInRange(input.planeHeightM, 0.1, 20)) {
      return errBase('Inclined plane length (0.5..20 m) and height (0.1..20 m) must be finite positive numbers.');
    }
    if (input.planeHeightM > input.planeLengthM) {
      return errBase('Inclined plane height cannot exceed plane length (sin θ ≤ 1).');
    }
    vr = input.planeLengthM / input.planeHeightM;
    inclineAngleDeg = roundTo(Math.asin(input.planeHeightM / input.planeLengthM) * RAD_TO_DEG, 2);
  } else {
    return errBase(`Unsupported simple machine "${String(input.machineKind)}".`);
  }

  const etaFrac = input.efficiencyPct / 100;
  const ma = vr * etaFrac;
  const idealEffort = input.loadN / vr;
  const actualEffort = input.loadN / ma;
  const workOut = input.loadN * dLoad;
  const workIn = actualEffort * (vr * dLoad);
  const loss = Math.max(0, workIn - workOut);
  const isIdeal = Math.abs(input.efficiencyPct - 100) < 1e-6;

  return {
    ok: true,
    machineKind: input.machineKind,
    velocityRatio: roundTo(vr, 2),
    mechanicalAdvantage: roundTo(ma, 2),
    idealEffortN: roundTo(idealEffort, 2),
    actualEffortN: roundTo(actualEffort, 2),
    efficiencyPct: roundTo(input.efficiencyPct, 1),
    isIdealModel: isIdeal,
    workOutputJ: roundTo(workOut, 2),
    workInputJ: roundTo(workIn, 2),
    energyLostToFrictionJ: roundTo(loss, 2),
    inclineAngleDeg,
    summary: `${input.machineKind.replace('-', ' ')}: VR = ${roundTo(vr, 2)}, MA = ${roundTo(ma, 2)}, actual effort = ${roundTo(actualEffort, 2)} N (ideal = ${roundTo(idealEffort, 2)} N), efficiency = ${roundTo(input.efficiencyPct, 1)}% (${isIdeal ? 'ideal frictionless model' : `${roundTo(loss, 2)} J dissipated against friction/moving parts`}).`,
  };
}

/* ========================================================================== */
/* CHALLENGE EVALUATION HELPER (GUIDED & INDEPENDENT CHALLENGES)              */
/* ========================================================================== */

export interface PhysicsChallengeGoal {
  description: string;
  /** Target numerical readout key & value with tolerance */
  metric:
    | 'reflectedAngleDeg'
    | 'angleBetweenRaysDeg'
    | 'refractedAngleDeg'
    | 'requireTIR'
    | 'imageDistanceCm'
    | 'requireVirtualImage'
    | 'requireImageAtInfinity'
    | 'requireRotationalEquilibrium'
    | 'actualEffortN'
    | 'mechanicalAdvantage';
  targetValue?: number;
  tolerance?: number;
}

export function evaluatePhysicsGoal(
  goal: PhysicsChallengeGoal,
  result:
    | ReflectionResult
    | RefractionResult
    | OpticalImageResult
    | MomentsResult
    | SimpleMachineResult,
): { passed: boolean; feedback: string } {
  if (!result.ok) {
    return { passed: false, feedback: result.error ?? 'Invalid physical configuration.' };
  }
  const tol = goal.tolerance ?? 0.5;

  if (goal.metric === 'requireTIR') {
    const r = result as RefractionResult;
    return r.isTotalInternalReflection
      ? { passed: true, feedback: `Verified: Total Internal Reflection achieved! ${r.summary}` }
      : {
          passed: false,
          feedback: `Not in Total Internal Reflection yet. Ensure n₁ > n₂ and increase θᵢ beyond the critical angle${r.criticalAngleDeg !== null ? ` (${r.criticalAngleDeg}°)` : ''}.`,
        };
  }
  if (goal.metric === 'requireVirtualImage') {
    const r = result as OpticalImageResult;
    return r.imageNature === 'virtual'
      ? { passed: true, feedback: `Verified: Virtual upright image formed! ${r.summary}` }
      : { passed: false, feedback: `Current image is ${r.imageNature}. Adjust object distance u relative to focal length f to produce a virtual image.` };
  }
  if (goal.metric === 'requireImageAtInfinity') {
    const r = result as OpticalImageResult;
    return r.imageAtInfinity
      ? { passed: true, feedback: `Verified: Object is at the principal focus so rays emerge parallel! ${r.summary}` }
      : { passed: false, feedback: `Image is currently at v = ${r.imageDistanceCm} cm. Place the object at u = f to produce parallel emerging rays.` };
  }
  if (goal.metric === 'requireRotationalEquilibrium') {
    const r = result as MomentsResult;
    return r.isRotationalEquilibrium
      ? { passed: true, feedback: `Verified: ${r.summary}` }
      : { passed: false, feedback: `Beam is not balanced yet. ${r.summary}` };
  }

  const target = goal.targetValue;
  if (typeof target !== 'number' || !Number.isFinite(target)) {
    return { passed: false, feedback: 'Challenge goal is missing a valid numeric target.' };
  }
  const actual = (result as unknown as Record<string, unknown>)[goal.metric];
  if (typeof actual !== 'number' || !Number.isFinite(actual)) {
    return { passed: false, feedback: `Target quantity "${goal.metric}" is undefined for the current setup. ${result.summary}` };
  }
  if (Math.abs(actual - target) <= tol) {
    return { passed: true, feedback: `Verified: ${goal.metric} = ${actual} (within ±${tol} of ${target}). ${result.summary}` };
  }
  return {
    passed: false,
    feedback: `Current ${goal.metric} is ${actual} (target: ${target} ± ${tol}). Adjust the physical variables and try again.`,
  };
}
