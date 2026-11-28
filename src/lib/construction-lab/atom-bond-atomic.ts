/**
 * GAM EDU — Step 4E Pure Scientific Module 1: Atomic Structure, Isotopes & Electron Configurations
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies.
 * Supports:
 * - Introductory shell model (Z = 1..20, simplified first-20 ground-state filling: 2, 8, 8, 2)
 * - Advanced AS/A-Level subshell model (Z = 1..30: 1s, 2s, 2p, 3s, 3p, 4s, 3d with Cr/Cu anomalies
 *   and 4s-before-3d transition-metal cation ionisation)
 * - Physically verified isotopes (distinguishing stable vs radioactive, e.g. Carbon-14)
 * - Scientifically verified supported ion charges
 */

export type AtomicRepresentation = 'shells' | 'subshells';
export type AtomicInteractionMode = 'guided' | 'free-exploration' | 'independent-challenge';

export interface AtomicChallengeTarget {
  id?: string;
  prompt: string;
  targetElement: string;
  targetMassNumber: number;
  targetCharge?: number;
  lockNucleus?: boolean;
  initialProtons?: number;
  initialNeutrons?: number;
  initialElectrons?: number;
  hint?: string;
}

export type SubshellId = '1s' | '2s' | '2p' | '3s' | '3p' | '4s' | '3d';

export const SUBSHELL_ORDER: readonly SubshellId[] = ['1s', '2s', '2p', '3s', '3p', '4s', '3d'];

export const SUBSHELL_MAX_CAPACITY: Record<SubshellId, number> = {
  '1s': 2,
  '2s': 2,
  '2p': 6,
  '3s': 2,
  '3p': 6,
  '4s': 2,
  '3d': 10,
};

/**
 * Simplified first-20-element ground-state shell filling limits (NOT universal maximum shell capacities;
 * actual 3rd shell capacity is 18, which is handled in the AS/A-Level subshell model).
 */
export const INTRO_SHELL_FILL_CAPS = [2, 8, 8, 2] as const;

export interface IsotopeRecord {
  massNumber: number;
  radioactive: boolean;
  note?: string;
}

export interface ElementRecord {
  z: number;
  symbol: string;
  name: string;
  period: number;
  group: number;
  valenceElectrons: number;
  electronegativity: number | null; // Pauling scale
  supportedCharges: readonly number[];
  isotopes: readonly IsotopeRecord[];
  isMetal: boolean;
  isNonMetal: boolean;
  /** Neutral ground-state subshell occupancy for Z = 1..30 */
  neutralSubshells?: Record<SubshellId, number>;
}

function makeSubshells(
  s1: number,
  s2: number,
  p2: number,
  s3: number,
  p3: number,
  s4: number,
  d3: number,
): Record<SubshellId, number> {
  return { '1s': s1, '2s': s2, '2p': p2, '3s': s3, '3p': p3, '4s': s4, '3d': d3 };
}

/**
 * Approved element dataset for Step 4E:
 * - Z = 1..30 (full atomic structure, shells Z=1..20, subshells Z=1..30)
 * - Br (Z = 35) and I (Z = 53) included explicitly for covalent/ionic/VSEPR bonding
 */
export const APPROVED_ELEMENTS: Record<string, ElementRecord> = {
  H: { z: 1, symbol: 'H', name: 'Hydrogen', period: 1, group: 1, valenceElectrons: 1, electronegativity: 2.20, supportedCharges: [-1, 0, 1], isotopes: [{ massNumber: 1, radioactive: false }, { massNumber: 2, radioactive: false, note: 'Deuterium' }, { massNumber: 3, radioactive: true, note: 'Tritium (radioactive)' }], isMetal: false, isNonMetal: true, neutralSubshells: makeSubshells(1, 0, 0, 0, 0, 0, 0) },
  He: { z: 2, symbol: 'He', name: 'Helium', period: 1, group: 18, valenceElectrons: 2, electronegativity: null, supportedCharges: [0], isotopes: [{ massNumber: 3, radioactive: false }, { massNumber: 4, radioactive: false }], isMetal: false, isNonMetal: true, neutralSubshells: makeSubshells(2, 0, 0, 0, 0, 0, 0) },
  Li: { z: 3, symbol: 'Li', name: 'Lithium', period: 2, group: 1, valenceElectrons: 1, electronegativity: 0.98, supportedCharges: [0, 1], isotopes: [{ massNumber: 6, radioactive: false }, { massNumber: 7, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 1, 0, 0, 0, 0, 0) },
  Be: { z: 4, symbol: 'Be', name: 'Beryllium', period: 2, group: 2, valenceElectrons: 2, electronegativity: 1.57, supportedCharges: [0, 2], isotopes: [{ massNumber: 9, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 0, 0, 0, 0, 0) },
  B: { z: 5, symbol: 'B', name: 'Boron', period: 2, group: 13, valenceElectrons: 3, electronegativity: 2.04, supportedCharges: [0], isotopes: [{ massNumber: 10, radioactive: false }, { massNumber: 11, radioactive: false }], isMetal: false, isNonMetal: true, neutralSubshells: makeSubshells(2, 2, 1, 0, 0, 0, 0) },
  C: { z: 6, symbol: 'C', name: 'Carbon', period: 2, group: 14, valenceElectrons: 4, electronegativity: 2.55, supportedCharges: [0], isotopes: [{ massNumber: 12, radioactive: false }, { massNumber: 13, radioactive: false }, { massNumber: 14, radioactive: true, note: 'Carbon-14 is radioactive (beta emitter used in radiocarbon dating)' }], isMetal: false, isNonMetal: true, neutralSubshells: makeSubshells(2, 2, 2, 0, 0, 0, 0) },
  N: { z: 7, symbol: 'N', name: 'Nitrogen', period: 2, group: 15, valenceElectrons: 5, electronegativity: 3.04, supportedCharges: [-3, 0], isotopes: [{ massNumber: 14, radioactive: false }, { massNumber: 15, radioactive: false }], isMetal: false, isNonMetal: true, neutralSubshells: makeSubshells(2, 2, 3, 0, 0, 0, 0) },
  O: { z: 8, symbol: 'O', name: 'Oxygen', period: 2, group: 16, valenceElectrons: 6, electronegativity: 3.44, supportedCharges: [-2, 0], isotopes: [{ massNumber: 16, radioactive: false }, { massNumber: 17, radioactive: false }, { massNumber: 18, radioactive: false }], isMetal: false, isNonMetal: true, neutralSubshells: makeSubshells(2, 2, 4, 0, 0, 0, 0) },
  F: { z: 9, symbol: 'F', name: 'Fluorine', period: 2, group: 17, valenceElectrons: 7, electronegativity: 3.98, supportedCharges: [-1, 0], isotopes: [{ massNumber: 19, radioactive: false }], isMetal: false, isNonMetal: true, neutralSubshells: makeSubshells(2, 2, 5, 0, 0, 0, 0) },
  Ne: { z: 10, symbol: 'Ne', name: 'Neon', period: 2, group: 18, valenceElectrons: 8, electronegativity: null, supportedCharges: [0], isotopes: [{ massNumber: 20, radioactive: false }, { massNumber: 21, radioactive: false }, { massNumber: 22, radioactive: false }], isMetal: false, isNonMetal: true, neutralSubshells: makeSubshells(2, 2, 6, 0, 0, 0, 0) },
  Na: { z: 11, symbol: 'Na', name: 'Sodium', period: 3, group: 1, valenceElectrons: 1, electronegativity: 0.93, supportedCharges: [0, 1], isotopes: [{ massNumber: 23, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 6, 1, 0, 0, 0) },
  Mg: { z: 12, symbol: 'Mg', name: 'Magnesium', period: 3, group: 2, valenceElectrons: 2, electronegativity: 1.31, supportedCharges: [0, 2], isotopes: [{ massNumber: 24, radioactive: false }, { massNumber: 25, radioactive: false }, { massNumber: 26, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 6, 2, 0, 0, 0) },
  Al: { z: 13, symbol: 'Al', name: 'Aluminium', period: 3, group: 13, valenceElectrons: 3, electronegativity: 1.61, supportedCharges: [0, 3], isotopes: [{ massNumber: 27, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 6, 2, 1, 0, 0) },
  Si: { z: 14, symbol: 'Si', name: 'Silicon', period: 3, group: 14, valenceElectrons: 4, electronegativity: 1.90, supportedCharges: [0], isotopes: [{ massNumber: 28, radioactive: false }, { massNumber: 29, radioactive: false }, { massNumber: 30, radioactive: false }], isMetal: false, isNonMetal: true, neutralSubshells: makeSubshells(2, 2, 6, 2, 2, 0, 0) },
  P: { z: 15, symbol: 'P', name: 'Phosphorus', period: 3, group: 15, valenceElectrons: 5, electronegativity: 2.19, supportedCharges: [-3, 0], isotopes: [{ massNumber: 31, radioactive: false }], isMetal: false, isNonMetal: true, neutralSubshells: makeSubshells(2, 2, 6, 2, 3, 0, 0) },
  S: { z: 16, symbol: 'S', name: 'Sulfur', period: 3, group: 16, valenceElectrons: 6, electronegativity: 2.58, supportedCharges: [-2, 0], isotopes: [{ massNumber: 32, radioactive: false }, { massNumber: 33, radioactive: false }, { massNumber: 34, radioactive: false }], isMetal: false, isNonMetal: true, neutralSubshells: makeSubshells(2, 2, 6, 2, 4, 0, 0) },
  Cl: { z: 17, symbol: 'Cl', name: 'Chlorine', period: 3, group: 17, valenceElectrons: 7, electronegativity: 3.16, supportedCharges: [-1, 0], isotopes: [{ massNumber: 35, radioactive: false }, { massNumber: 37, radioactive: false }], isMetal: false, isNonMetal: true, neutralSubshells: makeSubshells(2, 2, 6, 2, 5, 0, 0) },
  Ar: { z: 18, symbol: 'Ar', name: 'Argon', period: 3, group: 18, valenceElectrons: 8, electronegativity: null, supportedCharges: [0], isotopes: [{ massNumber: 36, radioactive: false }, { massNumber: 38, radioactive: false }, { massNumber: 40, radioactive: false }], isMetal: false, isNonMetal: true, neutralSubshells: makeSubshells(2, 2, 6, 2, 6, 0, 0) },
  K: { z: 19, symbol: 'K', name: 'Potassium', period: 4, group: 1, valenceElectrons: 1, electronegativity: 0.82, supportedCharges: [0, 1], isotopes: [{ massNumber: 39, radioactive: false }, { massNumber: 41, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 6, 2, 6, 1, 0) },
  Ca: { z: 20, symbol: 'Ca', name: 'Calcium', period: 4, group: 2, valenceElectrons: 2, electronegativity: 1.00, supportedCharges: [0, 2], isotopes: [{ massNumber: 40, radioactive: false }, { massNumber: 42, radioactive: false }, { massNumber: 44, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 6, 2, 6, 2, 0) },
  Sc: { z: 21, symbol: 'Sc', name: 'Scandium', period: 4, group: 3, valenceElectrons: 3, electronegativity: 1.36, supportedCharges: [0, 3], isotopes: [{ massNumber: 45, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 6, 2, 6, 2, 1) },
  Ti: { z: 22, symbol: 'Ti', name: 'Titanium', period: 4, group: 4, valenceElectrons: 4, electronegativity: 1.54, supportedCharges: [0, 2, 3, 4], isotopes: [{ massNumber: 48, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 6, 2, 6, 2, 2) },
  V: { z: 23, symbol: 'V', name: 'Vanadium', period: 4, group: 5, valenceElectrons: 5, electronegativity: 1.63, supportedCharges: [0, 2, 3], isotopes: [{ massNumber: 51, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 6, 2, 6, 2, 3) },
  Cr: { z: 24, symbol: 'Cr', name: 'Chromium', period: 4, group: 6, valenceElectrons: 6, electronegativity: 1.66, supportedCharges: [0, 2, 3], isotopes: [{ massNumber: 52, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 6, 2, 6, 1, 5) },
  Mn: { z: 25, symbol: 'Mn', name: 'Manganese', period: 4, group: 7, valenceElectrons: 7, electronegativity: 1.55, supportedCharges: [0, 2], isotopes: [{ massNumber: 55, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 6, 2, 6, 2, 5) },
  Fe: { z: 26, symbol: 'Fe', name: 'Iron', period: 4, group: 8, valenceElectrons: 8, electronegativity: 1.83, supportedCharges: [0, 2, 3], isotopes: [{ massNumber: 56, radioactive: false }, { massNumber: 54, radioactive: false }, { massNumber: 57, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 6, 2, 6, 2, 6) },
  Co: { z: 27, symbol: 'Co', name: 'Cobalt', period: 4, group: 9, valenceElectrons: 9, electronegativity: 1.88, supportedCharges: [0, 2, 3], isotopes: [{ massNumber: 59, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 6, 2, 6, 2, 7) },
  Ni: { z: 28, symbol: 'Ni', name: 'Nickel', period: 4, group: 10, valenceElectrons: 10, electronegativity: 1.91, supportedCharges: [0, 2], isotopes: [{ massNumber: 58, radioactive: false }, { massNumber: 60, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 6, 2, 6, 2, 8) },
  Cu: { z: 29, symbol: 'Cu', name: 'Copper', period: 4, group: 11, valenceElectrons: 11, electronegativity: 1.90, supportedCharges: [0, 1, 2], isotopes: [{ massNumber: 63, radioactive: false }, { massNumber: 65, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 6, 2, 6, 1, 10) },
  Zn: { z: 30, symbol: 'Zn', name: 'Zinc', period: 4, group: 12, valenceElectrons: 12, electronegativity: 1.65, supportedCharges: [0, 2], isotopes: [{ massNumber: 64, radioactive: false }, { massNumber: 66, radioactive: false }], isMetal: true, isNonMetal: false, neutralSubshells: makeSubshells(2, 2, 6, 2, 6, 2, 10) },
  Br: { z: 35, symbol: 'Br', name: 'Bromine', period: 4, group: 17, valenceElectrons: 7, electronegativity: 2.96, supportedCharges: [-1, 0], isotopes: [{ massNumber: 79, radioactive: false }, { massNumber: 81, radioactive: false }], isMetal: false, isNonMetal: true },
  I: { z: 53, symbol: 'I', name: 'Iodine', period: 5, group: 17, valenceElectrons: 7, electronegativity: 2.66, supportedCharges: [-1, 0], isotopes: [{ massNumber: 127, radioactive: false }], isMetal: false, isNonMetal: true },
};

export function getElementBySymbol(symbol: string): ElementRecord | null {
  return APPROVED_ELEMENTS[symbol] ?? null;
}

export function getElementByZ(z: number): ElementRecord | null {
  for (const el of Object.values(APPROVED_ELEMENTS)) {
    if (el.z === z) return el;
  }
  return null;
}

export function getApprovedElementsUpToZ(maxZ: number): ElementRecord[] {
  return Object.values(APPROVED_ELEMENTS)
    .filter((el) => el.z >= 1 && el.z <= maxZ)
    .sort((a, b) => a.z - b.z);
}

export function formatIntroShellArrangement(shells: readonly number[]): string {
  let lastNonZero = -1;
  for (let i = shells.length - 1; i >= 0; i--) {
    if (shells[i] > 0) {
      lastNonZero = i;
      break;
    }
  }
  if (lastNonZero === -1) return '0 (no electrons)';
  return shells.slice(0, lastNonZero + 1).join(', ');
}

export type FreeAtomicStatus =
  | 'empty'
  | 'invalid-input'
  | 'unsupported-element'
  | 'excited-or-invalid-shells'
  | 'unverified-subshells'
  | 'known-stable-neutral'
  | 'known-radioactive-neutral'
  | 'known-stable-ion'
  | 'known-radioactive-ion'
  | 'unverified-isotope'
  | 'unverified-ion';

/**
 * Three-tier scientific evaluation classification (PCV-1 Refinement 3):
 * - 'verified': known isotope + neutral or verified common ion + verified ground-state configuration
 * - 'unverified-consistent': particle counts and simplified arrangement are internally consistent,
 *   but isotope stability and/or ion charge/configuration is unverified in this dataset
 * - 'incorrect': empty, invalid input, unsupported Z, or excited/invalid electron arrangement
 */
export type AtomicEvaluationTier = 'verified' | 'unverified-consistent' | 'incorrect';

export const ATOMIC_INPUT_LIMITS = {
  maxProtonsInput: 118,
  maxNeutronsInput: 200,
} as const;

export interface FreeAtomicEvaluationInput {
  protons: number;
  neutrons: number;
  representation: AtomicRepresentation;
  shells?: number[];
  subshells?: Record<SubshellId, number>;
  maxZ?: number;
}

export interface FreeAtomicEvaluationResult {
  /** True ONLY for scientifically verified constructions (evaluationTier === 'verified'). */
  passed: boolean;
  evaluationTier: AtomicEvaluationTier;
  status: FreeAtomicStatus;
  feedback: string;
  element: ElementRecord | null;
  actualSymbol: string | null;
  actualMassNumber: number;
  actualElectrons: number;
  actualCharge: number;
  isKnownIsotope: boolean;
  isRadioactiveIsotope: boolean;
  isotopeNote?: string;
  isCommonIon: boolean;
  /** True ONLY when electron arrangement is a verified ground-state configuration for a supported neutral atom or supported ion. */
  isGroundStateConfig: boolean;
  electronArrangementLabel: string;
  groupPeriodNote: string | null;
}

function validateShellsArray(shells: unknown): { ok: true; values: number[] } | { ok: false; error: string } {
  if (!Array.isArray(shells) || shells.length !== INTRO_SHELL_FILL_CAPS.length) {
    return {
      ok: false,
      error: 'Shell occupancy must specify exactly 4 energy levels (simplified first-20-element filling model: 2, 8, 8, 2 — not absolute physical shell capacities).',
    };
  }
  for (let i = 0; i < INTRO_SHELL_FILL_CAPS.length; i++) {
    const v = shells[i];
    if (typeof v !== 'number' || !Number.isSafeInteger(v) || v < 0 || v > INTRO_SHELL_FILL_CAPS[i]) {
      return {
        ok: false,
        error: `Invalid electron count in Energy Level ${i + 1}: must be a whole integer between 0 and ${INTRO_SHELL_FILL_CAPS[i]} (simplified first-20 filling model).`,
      };
    }
  }
  return { ok: true, values: shells as number[] };
}

function validateSubshellsMap(
  subshells: unknown,
): { ok: true; values: Record<SubshellId, number> } | { ok: false; error: string } {
  if (!subshells || typeof subshells !== 'object' || Array.isArray(subshells)) {
    return { ok: false, error: 'Subshell occupancy must be an object specifying exact allowed subshells (1s..3d).' };
  }
  const rec = subshells as Record<string, unknown>;
  const allowed = new Set<string>(SUBSHELL_ORDER);
  for (const key of Object.keys(rec)) {
    if (!allowed.has(key)) {
      return { ok: false, error: `Unknown subshell key "${key}". Allowed subshells: ${SUBSHELL_ORDER.join(', ')}.` };
    }
  }
  const out = makeSubshells(0, 0, 0, 0, 0, 0, 0);
  for (const k of SUBSHELL_ORDER) {
    if (!(k in rec)) {
      return { ok: false, error: `Missing required subshell key "${k}".` };
    }
    const v = rec[k];
    if (typeof v !== 'number' || !Number.isSafeInteger(v) || v < 0 || v > SUBSHELL_MAX_CAPACITY[k]) {
      return {
        ok: false,
        error: `Invalid electron count in subshell ${k}: must be a whole integer between 0 and ${SUBSHELL_MAX_CAPACITY[k]}.`,
      };
    }
    out[k] = v;
  }
  return { ok: true, values: out };
}

function buildGroupPeriodNote(el: ElementRecord): string {
  if (el.symbol === 'He') {
    return 'Period 1, Group 18 (noble gas) · 2 outer electrons fill its first energy level completely (duet exception in Group 18; forming an ion changes charge only, never Group or Period)';
  }
  const mainGroupNum = el.group <= 2 ? el.group : el.group >= 13 ? el.group - 10 : null;
  return mainGroupNum !== null
    ? `Period ${el.period}, Group ${el.group} (main-group ${mainGroupNum}) · ${el.valenceElectrons} outer electron${el.valenceElectrons === 1 ? '' : 's'} when neutral (forming an ion changes charge only, never Group or Period)`
    : `Period ${el.period}, Group ${el.group} (d-block transition element; forming an ion never changes Group or Period)`;
}

/**
 * Evaluates an open-ended learner-constructed atom, isotope, or ion in Free Exploration mode
 * without comparing against any fixed target element. Strictly distinguishes:
 * - 'verified': known isotope + neutral or supported ion + verified ground-state arrangement
 * - 'unverified-consistent': internally consistent particle/filling counts, but unverified isotope or unsupported ion
 * - 'incorrect': invalid inputs, empty atom, out-of-range Z, or excited/non-ground-state shells
 */
export function evaluateFreeAtomicExploration(
  input: FreeAtomicEvaluationInput,
): FreeAtomicEvaluationResult {
  const invalidBase = (msg: string): FreeAtomicEvaluationResult => ({
    passed: false,
    evaluationTier: 'incorrect',
    status: 'invalid-input',
    feedback: msg,
    element: null,
    actualSymbol: null,
    actualMassNumber: 0,
    actualElectrons: 0,
    actualCharge: 0,
    isKnownIsotope: false,
    isRadioactiveIsotope: false,
    isCommonIon: false,
    isGroundStateConfig: false,
    electronArrangementLabel: 'invalid',
    groupPeriodNote: null,
  });

  // 1. Validate representation and maxZ bounds
  if (input.representation !== 'shells' && input.representation !== 'subshells') {
    return invalidBase(`Invalid atomic representation "${String(input.representation)}". Expected "shells" or "subshells".`);
  }
  const modelMaxZ = input.representation === 'subshells' ? 30 : 20;
  const maxZ = input.maxZ ?? modelMaxZ;
  if (typeof maxZ !== 'number' || !Number.isSafeInteger(maxZ) || maxZ < 1 || maxZ > modelMaxZ) {
    return invalidBase(`Invalid maxZ "${String(input.maxZ)}": must be a whole integer between 1 and ${modelMaxZ} for "${input.representation}".`);
  }

  // 2. Strict safe-integer particle count bounds (independent of UI)
  if (
    typeof input.protons !== 'number' ||
    !Number.isSafeInteger(input.protons) ||
    input.protons < 0 ||
    input.protons > ATOMIC_INPUT_LIMITS.maxProtonsInput ||
    typeof input.neutrons !== 'number' ||
    !Number.isSafeInteger(input.neutrons) ||
    input.neutrons < 0 ||
    input.neutrons > ATOMIC_INPUT_LIMITS.maxNeutronsInput
  ) {
    return invalidBase(
      `Particle counts must be whole integers within safe bounds (0..${ATOMIC_INPUT_LIMITS.maxProtonsInput} protons, 0..${ATOMIC_INPUT_LIMITS.maxNeutronsInput} neutrons).`,
    );
  }

  let validatedShells: number[] | null = null;
  let validatedSubshells: Record<SubshellId, number> | null = null;
  if (input.representation === 'shells') {
    const check = validateShellsArray(input.shells ?? [0, 0, 0, 0]);
    if (!check.ok) return invalidBase(check.error);
    validatedShells = check.values;
  } else {
    const check = validateSubshellsMap(input.subshells ?? makeSubshells(0, 0, 0, 0, 0, 0, 0));
    if (!check.ok) return invalidBase(check.error);
    validatedSubshells = check.values;
  }

  const actualElectrons =
    input.representation === 'shells'
      ? validatedShells!.reduce((a, b) => a + b, 0)
      : SUBSHELL_ORDER.reduce((a, sub) => a + validatedSubshells![sub], 0);
  const actualMassNumber = input.protons + input.neutrons;
  const actualCharge = input.protons - actualElectrons;
  const arrangementLabel =
    input.representation === 'shells'
      ? formatIntroShellArrangement(validatedShells!)
      : formatSubshellNotation(validatedSubshells!);

  if (input.protons === 0) {
    return {
      passed: false,
      evaluationTier: 'incorrect',
      status: 'empty',
      feedback:
        'Empty atom: add at least 1 proton to define an element (proton number Z determines element identity).',
      element: null,
      actualSymbol: null,
      actualMassNumber,
      actualElectrons,
      actualCharge,
      isKnownIsotope: false,
      isRadioactiveIsotope: false,
      isCommonIon: false,
      isGroundStateConfig: false,
      electronArrangementLabel: arrangementLabel,
      groupPeriodNote: null,
    };
  }

  const el = getElementByZ(input.protons);
  if (!el || el.z > maxZ) {
    return {
      passed: false,
      evaluationTier: 'incorrect',
      status: 'unsupported-element',
      feedback: `Proton count Z = ${input.protons} is outside this activity's verified teaching model (Z = 1..${maxZ}).`,
      element: null,
      actualSymbol: null,
      actualMassNumber,
      actualElectrons,
      actualCharge,
      isKnownIsotope: false,
      isRadioactiveIsotope: false,
      isCommonIon: false,
      isGroundStateConfig: false,
      electronArrangementLabel: arrangementLabel,
      groupPeriodNote: null,
    };
  }

  const groupPeriodNote = buildGroupPeriodNote(el);
  const matchedIso = el.isotopes.find((iso) => iso.massNumber === actualMassNumber);
  const isKnownIsotope = Boolean(matchedIso);
  const isRadioactiveIsotope = Boolean(matchedIso?.radioactive);
  // Neutral atoms (charge === 0) are NOT ions — isCommonIon is true ONLY for verified non-zero ions.
  const isCommonIon = actualCharge !== 0 && el.supportedCharges.includes(actualCharge);
  const isSupportedChargeState = actualCharge === 0 || isCommonIon;

  const chargeText =
    actualCharge === 0
      ? 'neutral atom (charge 0)'
      : actualCharge > 0
        ? `${el.symbol}${actualCharge === 1 ? '⁺' : `${actualCharge}⁺`} cation (charge +${actualCharge})`
        : `${el.symbol}${actualCharge === -1 ? '⁻' : `${Math.abs(actualCharge)}⁻`} anion (charge ${actualCharge})`;

  // Check electron arrangement against the active teaching model
  let followsModelFilling = false;
  let expectedConfigLabel = '';
  if (input.representation === 'shells') {
    if (actualElectrons <= 20) {
      const exp = getExpectedIntroShells(actualElectrons);
      expectedConfigLabel = formatIntroShellArrangement(exp);
      followsModelFilling = exp.every((v, i) => validatedShells![i] === v);
    } else {
      expectedConfigLabel = 'max 20 electrons in simplified first-20 filling model';
      followsModelFilling = false;
    }
  } else {
    const expSub = getExpectedSubshells(el.symbol, actualCharge);
    if (!expSub) {
      return {
        passed: false,
        evaluationTier: 'unverified-consistent',
        status: 'unverified-subshells',
        feedback: `Internally consistent counts for ${el.name}-${actualMassNumber} (${chargeText}), but its subshell configuration (${arrangementLabel}) is unverified in this dataset; only verified neutral atoms and supported ions can be certified as ground-state configurations.`,
        element: el,
        actualSymbol: el.symbol,
        actualMassNumber,
        actualElectrons,
        actualCharge,
        isKnownIsotope,
        isRadioactiveIsotope,
        isotopeNote: matchedIso?.note,
        isCommonIon,
        isGroundStateConfig: false,
        electronArrangementLabel: arrangementLabel,
        groupPeriodNote,
      };
    }
    expectedConfigLabel = formatSubshellNotation(expSub);
    followsModelFilling = SUBSHELL_ORDER.every((s) => validatedSubshells![s] === expSub[s]);
  }

  if (!followsModelFilling) {
    return {
      passed: false,
      evaluationTier: 'incorrect',
      status: 'excited-or-invalid-shells',
      feedback: `You built ${el.name}-${actualMassNumber} (${chargeText}), but your electron arrangement (${arrangementLabel}) does not follow ground-state filling for ${actualElectrons} electron${actualElectrons === 1 ? '' : 's'} (fill inner levels first: ${expectedConfigLabel}).`,
      element: el,
      actualSymbol: el.symbol,
      actualMassNumber,
      actualElectrons,
      actualCharge,
      isKnownIsotope,
      isRadioactiveIsotope,
      isotopeNote: matchedIso?.note,
      isCommonIon,
      isGroundStateConfig: false,
      electronArrangementLabel: arrangementLabel,
      groupPeriodNote,
    };
  }

  // Never certify unsupported ions as having verified ground-state configurations merely from simplified shell filling!
  const isGroundStateConfig = isSupportedChargeState;

  const isoClause = isKnownIsotope
    ? isRadioactiveIsotope
      ? `verified radioactive isotope${matchedIso?.note ? ` (${matchedIso.note})` : ''}`
      : `verified stable isotope${matchedIso?.note ? ` (${matchedIso.note})` : ''}`
    : `nuclear stability unverified in this dataset (unlisted neutron count for ${el.name})`;

  const ionClause =
    actualCharge === 0
      ? 'electrically neutral atom'
      : isCommonIon
        ? `verified common ion (${chargeText}; Group ${el.group}, Period ${el.period} unchanged)`
        : `unverified/unsupported ion charge (${chargeText} is not a certified common ion of ${el.name}; simplified shell filling ${arrangementLabel} is NOT certified as a verified ground-state ion configuration)`;

  let status: FreeAtomicStatus;
  let evaluationTier: AtomicEvaluationTier;
  if (actualCharge !== 0 && !isCommonIon) {
    status = 'unverified-ion';
    evaluationTier = 'unverified-consistent';
  } else if (!isKnownIsotope) {
    status = 'unverified-isotope';
    evaluationTier = 'unverified-consistent';
  } else if (actualCharge === 0) {
    status = isRadioactiveIsotope ? 'known-radioactive-neutral' : 'known-stable-neutral';
    evaluationTier = 'verified';
  } else {
    status = isRadioactiveIsotope ? 'known-radioactive-ion' : 'known-stable-ion';
    evaluationTier = 'verified';
  }

  const configClause = isGroundStateConfig
    ? `ground-state arrangement ${arrangementLabel}`
    : `simplified filling pattern ${arrangementLabel} (unverified ion configuration)`;

  return {
    passed: evaluationTier === 'verified',
    evaluationTier,
    status,
    feedback: `Constructed ${el.name}-${actualMassNumber} (${el.symbol}, Z = ${el.z}, A = ${actualMassNumber}): ${ionClause}; ${isoClause}; ${configClause}.`,
    element: el,
    actualSymbol: el.symbol,
    actualMassNumber,
    actualElectrons,
    actualCharge,
    isKnownIsotope,
    isRadioactiveIsotope,
    isotopeNote: matchedIso?.note,
    isCommonIon,
    isGroundStateConfig,
    electronArrangementLabel: arrangementLabel,
    groupPeriodNote,
  };
}

/**
 * Computes ground-state shell occupancy for introductory first-20-element model (1..20 electrons).
 */
export function getExpectedIntroShells(electronCount: number): number[] {
  const shells = [0, 0, 0, 0];
  let rem = Math.max(0, Math.min(20, Math.floor(electronCount)));
  for (let i = 0; i < INTRO_SHELL_FILL_CAPS.length; i++) {
    const put = Math.min(rem, INTRO_SHELL_FILL_CAPS[i]);
    shells[i] = put;
    rem -= put;
  }
  return shells;
}

/**
 * Computes verified ground-state subshell configuration for Z = 1..30 (neutral or supported ion).
 * Explicitly removes 4s electrons before 3d electrons for transition-metal cations.
 */
export function getExpectedSubshells(symbol: string, charge = 0): Record<SubshellId, number> | null {
  const el = getElementBySymbol(symbol);
  if (!el || !el.neutralSubshells) return null;
  if (!el.supportedCharges.includes(charge)) return null;

  const cfg: Record<SubshellId, number> = { ...el.neutralSubshells };
  if (charge === 0) return cfg;

  if (charge > 0) {
    // Cation formation: remove from highest principal quantum number first (4s before 3d, then 3p, 3s, 2p, 2s, 1s)
    let toRemove = charge;
    const removalOrder: SubshellId[] = ['4s', '3d', '3p', '3s', '2p', '2s', '1s'];
    for (const sub of removalOrder) {
      if (toRemove <= 0) break;
      const take = Math.min(cfg[sub], toRemove);
      cfg[sub] -= take;
      toRemove -= take;
    }
    return toRemove === 0 ? cfg : null;
  }

  // Anion formation (main-group non-metals): add electrons in standard filling order
  let toAdd = -charge;
  for (const sub of SUBSHELL_ORDER) {
    if (toAdd <= 0) break;
    const space = SUBSHELL_MAX_CAPACITY[sub] - cfg[sub];
    if (space > 0) {
      const add = Math.min(space, toAdd);
      cfg[sub] += add;
      toAdd -= add;
    }
  }
  return toAdd === 0 ? cfg : null;
}

export function formatSubshellNotation(cfg: Record<SubshellId, number>): string {
  const superscripts: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  };
  const toSup = (n: number) => String(n).split('').map((c) => superscripts[c] ?? c).join('');
  // Display in increasing n order (1s 2s 2p 3s 3p 3d 4s) for standard Cambridge chemistry notation
  const displayOrder: SubshellId[] = ['1s', '2s', '2p', '3s', '3p', '3d', '4s'];
  return displayOrder
    .filter((s) => cfg[s] > 0)
    .map((s) => `${s}${toSup(cfg[s])}`)
    .join(' ') || '(0 electrons)';
}

export interface AtomicEvaluationInput {
  targetElement: string;
  targetMassNumber: number;
  targetCharge: number;
  representation: AtomicRepresentation;
  protons: number;
  neutrons: number;
  /** Learner-controlled shell occupancy [n1, n2, n3, n4] when representation === 'shells' */
  shells?: number[];
  /** Learner-controlled subshell occupancy when representation === 'subshells' */
  subshells?: Record<SubshellId, number>;
  allowHypotheticalIsotope?: boolean;
}

export interface AtomicEvaluationResult {
  passed: boolean;
  feedback: string;
  actualSymbol: string | null;
  actualMassNumber: number;
  actualElectrons: number;
  actualCharge: number;
  isRadioactiveIsotope: boolean;
  isotopeNote?: string;
}

export function evaluateAtomicConstruction(input: AtomicEvaluationInput): AtomicEvaluationResult {
  const invalidTargetBase = {
    actualSymbol: null,
    actualMassNumber: 0,
    actualElectrons: 0,
    actualCharge: 0,
    isRadioactiveIsotope: false,
    isotopeNote: undefined,
  };

  if (input.representation !== 'shells' && input.representation !== 'subshells') {
    return {
      ...invalidTargetBase,
      passed: false,
      feedback: `Invalid atomic representation "${String(input.representation)}". Expected "shells" or "subshells".`,
    };
  }

  if (
    typeof input.protons !== 'number' ||
    !Number.isSafeInteger(input.protons) ||
    input.protons < 1 ||
    input.protons > ATOMIC_INPUT_LIMITS.maxProtonsInput ||
    typeof input.neutrons !== 'number' ||
    !Number.isSafeInteger(input.neutrons) ||
    input.neutrons < 0 ||
    input.neutrons > ATOMIC_INPUT_LIMITS.maxNeutronsInput
  ) {
    return {
      ...invalidTargetBase,
      passed: false,
      feedback: 'Particle counts must be valid non-negative whole integers within safe bounds (at least 1 proton).',
    };
  }

  let validatedShells: number[] | null = null;
  let validatedSubshells: Record<SubshellId, number> | null = null;
  if (input.representation === 'shells') {
    const check = validateShellsArray(input.shells ?? [0, 0, 0, 0]);
    if (!check.ok) {
      return { ...invalidTargetBase, passed: false, feedback: check.error };
    }
    validatedShells = check.values;
  } else {
    const check = validateSubshellsMap(input.subshells ?? makeSubshells(0, 0, 0, 0, 0, 0, 0));
    if (!check.ok) {
      return { ...invalidTargetBase, passed: false, feedback: check.error };
    }
    validatedSubshells = check.values;
  }

  const targetEl = getElementBySymbol(input.targetElement);
  const actualEl = getElementByZ(input.protons);
  const actualElectrons =
    input.representation === 'shells'
      ? validatedShells!.reduce((a, b) => a + b, 0)
      : SUBSHELL_ORDER.reduce((a, sub) => a + validatedSubshells![sub], 0);
  const actualMassNumber = input.protons + input.neutrons;
  const actualCharge = input.protons - actualElectrons;

  const matchedIso = targetEl?.isotopes.find((iso) => iso.massNumber === input.targetMassNumber);
  const isRadioactiveIsotope = Boolean(matchedIso?.radioactive);

  const base = {
    actualSymbol: actualEl?.symbol ?? null,
    actualMassNumber,
    actualElectrons,
    actualCharge,
    isRadioactiveIsotope,
    isotopeNote: matchedIso?.note,
  };

  if (!targetEl) {
    return { ...base, passed: false, feedback: `Unsupported target element "${input.targetElement}".` };
  }

  if (
    typeof input.targetMassNumber !== 'number' ||
    !Number.isSafeInteger(input.targetMassNumber) ||
    typeof input.targetCharge !== 'number' ||
    !Number.isSafeInteger(input.targetCharge)
  ) {
    return { ...base, passed: false, feedback: 'Target mass number and target charge must be whole integers.' };
  }

  // 1. Check protons (element identity)
  if (input.protons !== targetEl.z) {
    const builtName = actualEl ? `${actualEl.name} (${actualEl.symbol}, Z = ${actualEl.z})` : `Z = ${input.protons}`;
    return {
      ...base,
      passed: false,
      feedback: `Changing the proton count changes the element! You currently have ${input.protons} protons (${builtName}). ${targetEl.name} (${targetEl.symbol}) must have exactly ${targetEl.z} protons.`,
    };
  }

  // 2. Check neutrons (mass number / isotope)
  const expectedNeutrons = input.targetMassNumber - targetEl.z;
  if (input.neutrons !== expectedNeutrons) {
    return {
      ...base,
      passed: false,
      feedback: `Check the neutron count: Mass number (${input.targetMassNumber}) = protons (${targetEl.z}) + neutrons. You have ${input.neutrons} neutrons (mass number ${actualMassNumber}), but ${targetEl.symbol}-${input.targetMassNumber} requires ${expectedNeutrons} neutrons.`,
    };
  }

  // 3. Check total electrons (charge)
  const expectedElectrons = targetEl.z - input.targetCharge;
  if (actualElectrons !== expectedElectrons) {
    const chargeStr = input.targetCharge === 0 ? 'neutral (charge 0)' : `charge ${input.targetCharge > 0 ? `+${input.targetCharge}` : input.targetCharge}`;
    return {
      ...base,
      passed: false,
      feedback: `Total electrons do not match ${chargeStr}. With ${targetEl.z} protons, you need ${expectedElectrons} electrons in total (you placed ${actualElectrons}, giving charge ${actualCharge > 0 ? `+${actualCharge}` : actualCharge}).`,
    };
  }

  // 4. Independent check of arrangement (shells vs subshells)
  if (input.representation === 'shells') {
    const shells = validatedShells!;
    const expectedShells = getExpectedIntroShells(expectedElectrons);
    for (let i = 0; i < 4; i++) {
      if (shells[i] !== expectedShells[i]) {
        return {
          ...base,
          passed: false,
          feedback: `Total electrons (${actualElectrons}) is correct, but the shell arrangement [${shells.filter((x, idx) => x > 0 || idx === 0).join(', ')}] is not the ground-state filling order. Fill inner energy levels before outer ones (simplified first-20-element filling model: 2, 8, 8, 2 — not absolute physical shell capacities).`,
        };
      }
    }
    const radioNote = isRadioactiveIsotope ? ` Note: ${targetEl.name}-${input.targetMassNumber} is a radioactive isotope.` : '';
    return {
      ...base,
      passed: true,
      feedback: `Verified: ${targetEl.name}-${input.targetMassNumber} (${targetEl.symbol}${input.targetCharge === 0 ? '' : input.targetCharge > 0 ? `${input.targetCharge}+` : `${Math.abs(input.targetCharge)}−`}) with ${targetEl.z}p, ${expectedNeutrons}n, and ground-state shell arrangement ${expectedShells.filter((x) => x > 0).join(', ') || '0'}.${radioNote}`,
    };
  }

  // Subshell representation (AS/A-Level Z=1..30)
  const sub = validatedSubshells!;
  const expectedSub = getExpectedSubshells(targetEl.symbol, input.targetCharge);
  if (!expectedSub) {
    return { ...base, passed: false, feedback: `Unsupported charge ${input.targetCharge} for ${targetEl.symbol}.` };
  }

  const mismatch = SUBSHELL_ORDER.find((s) => (sub[s] ?? 0) !== expectedSub[s]);
  if (mismatch) {
    // Specific misconception check: transition metal cation removed 3d before 4s
    if (targetEl.z >= 21 && input.targetCharge > 0 && sub['4s'] > expectedSub['4s']) {
      return {
        ...base,
        passed: false,
        feedback: `Check your 4s and 3d subshells: when transition metals form positive ions, 4s electrons are always removed before 3d electrons (you still have ${sub['4s']} electron(s) in 4s).`,
      };
    }
    // Specific misconception check: Cr or Cu half-filled / full 3d stability
    if ((targetEl.symbol === 'Cr' || targetEl.symbol === 'Cu') && input.targetCharge === 0 && sub['4s'] === 2) {
      return {
        ...base,
        passed: false,
        feedback: `${targetEl.name} (${targetEl.symbol}) is an important ground-state exception: a ${targetEl.symbol === 'Cr' ? 'half-filled 3d⁵' : 'completely filled 3d¹⁰'} subshell with 4s¹ is lower in energy than 4s² 3d${targetEl.symbol === 'Cr' ? '⁴' : '⁹'}.`,
      };
    }
    return {
      ...base,
      passed: false,
      feedback: `Total electrons (${actualElectrons}) is correct, but subshell ${mismatch} has ${sub[mismatch]} electron(s) instead of the ground-state occupancy. Review your subshell filling order.`,
    };
  }

  return {
    ...base,
    passed: true,
    feedback: `Verified: ${targetEl.symbol}${input.targetCharge === 0 ? '' : input.targetCharge > 0 ? `${input.targetCharge}+` : `${Math.abs(input.targetCharge)}−`} ground-state subshell configuration is ${formatSubshellNotation(expectedSub)}.`,
  };
}
