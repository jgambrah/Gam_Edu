/**
 * GAM EDU — Step 4E Pure Scientific Module 4: Bounded VSEPR Molecular Geometry & Polarity
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies.
 * Features:
 * - Steric numbers 2..6 (multiple bonds count as ONE electron domain)
 * - Explicit distinction between electron-domain geometry and molecular shape
 * - Curated reference bond angles (supports multi-angle geometries like 90°/120°; never implies
 *   exact quantum-mechanical calculation)
 * - True 3D unit-vector dipole summation using Pauling electronegativities + 3D VSEPR ligand vectors
 *   (NEVER infers polarity from 2D screen coordinates or molecular shape alone!)
 *   Accurately distinguishes CO2 (linear, non-polar) vs HCN (linear, polar) and CH4 (non-polar) vs CH3Cl (polar).
 */

import { getElementBySymbol } from './atom-bond-atomic';

export type VseprShapeId =
  | 'linear'
  | 'bent'
  | 'trigonal-planar'
  | 'trigonal-pyramidal'
  | 'tetrahedral'
  | 'trigonal-bipyramidal'
  | 'seesaw'
  | 't-shaped'
  | 'octahedral'
  | 'square-pyramidal'
  | 'square-planar';

export interface VseprRuleEntry {
  bondingDomains: number;
  lonePairs: number;
  stericNumber: number;
  electronGeometry: VseprShapeId;
  molecularShape: VseprShapeId;
  referenceAngleLabel: string;
  /** True 3D unit vectors for each bonding ligand position (used for dipole symmetry cancellation) */
  ligandUnitVectors: ReadonlyArray<readonly [number, number, number]>;
}

const SQRT2 = Math.SQRT2;
const SQRT3 = Math.sqrt(3);
const INV_SQRT3 = 1 / SQRT3;

export const VSEPR_TABLE: readonly VseprRuleEntry[] = [
  // Steric 2
  {
    bondingDomains: 2,
    lonePairs: 0,
    stericNumber: 2,
    electronGeometry: 'linear',
    molecularShape: 'linear',
    referenceAngleLabel: '180°',
    ligandUnitVectors: [[-1, 0, 0], [1, 0, 0]],
  },
  // Steric 3
  {
    bondingDomains: 3,
    lonePairs: 0,
    stericNumber: 3,
    electronGeometry: 'trigonal-planar',
    molecularShape: 'trigonal-planar',
    referenceAngleLabel: '120°',
    ligandUnitVectors: [[0, 1, 0], [SQRT3 / 2, -0.5, 0], [-SQRT3 / 2, -0.5, 0]],
  },
  {
    bondingDomains: 2,
    lonePairs: 1,
    stericNumber: 3,
    electronGeometry: 'trigonal-planar',
    molecularShape: 'bent',
    referenceAngleLabel: '~118° (<120°)',
    ligandUnitVectors: [[SQRT3 / 2, -0.5, 0], [-SQRT3 / 2, -0.5, 0]],
  },
  // Steric 4
  {
    bondingDomains: 4,
    lonePairs: 0,
    stericNumber: 4,
    electronGeometry: 'tetrahedral',
    molecularShape: 'tetrahedral',
    referenceAngleLabel: '109.5°',
    ligandUnitVectors: [
      [INV_SQRT3, INV_SQRT3, INV_SQRT3],
      [INV_SQRT3, -INV_SQRT3, -INV_SQRT3],
      [-INV_SQRT3, INV_SQRT3, -INV_SQRT3],
      [-INV_SQRT3, -INV_SQRT3, INV_SQRT3],
    ],
  },
  {
    bondingDomains: 3,
    lonePairs: 1,
    stericNumber: 4,
    electronGeometry: 'tetrahedral',
    molecularShape: 'trigonal-pyramidal',
    referenceAngleLabel: '~107° (<109.5°)',
    ligandUnitVectors: [
      [INV_SQRT3, -INV_SQRT3, -INV_SQRT3],
      [-INV_SQRT3, INV_SQRT3, -INV_SQRT3],
      [-INV_SQRT3, -INV_SQRT3, INV_SQRT3],
    ],
  },
  {
    bondingDomains: 2,
    lonePairs: 2,
    stericNumber: 4,
    electronGeometry: 'tetrahedral',
    molecularShape: 'bent',
    referenceAngleLabel: '104.5° (<109.5°)',
    ligandUnitVectors: [
      [-INV_SQRT3, INV_SQRT3, -INV_SQRT3],
      [-INV_SQRT3, -INV_SQRT3, INV_SQRT3],
    ],
  },
  // Steric 5
  {
    bondingDomains: 5,
    lonePairs: 0,
    stericNumber: 5,
    electronGeometry: 'trigonal-bipyramidal',
    molecularShape: 'trigonal-bipyramidal',
    referenceAngleLabel: '90° / 120°',
    ligandUnitVectors: [
      [0, 0, 1],
      [0, 0, -1],
      [1, 0, 0],
      [-0.5, SQRT3 / 2, 0],
      [-0.5, -SQRT3 / 2, 0],
    ],
  },
  {
    bondingDomains: 4,
    lonePairs: 1,
    stericNumber: 5,
    electronGeometry: 'trigonal-bipyramidal',
    molecularShape: 'seesaw',
    referenceAngleLabel: '<90° / <120°',
    ligandUnitVectors: [
      [0, 0, 1],
      [0, 0, -1],
      [-0.5, SQRT3 / 2, 0],
      [-0.5, -SQRT3 / 2, 0],
    ],
  },
  {
    bondingDomains: 3,
    lonePairs: 2,
    stericNumber: 5,
    electronGeometry: 'trigonal-bipyramidal',
    molecularShape: 't-shaped',
    referenceAngleLabel: '<90°',
    ligandUnitVectors: [
      [0, 0, 1],
      [0, 0, -1],
      [1, 0, 0],
    ],
  },
  // Steric 6
  {
    bondingDomains: 6,
    lonePairs: 0,
    stericNumber: 6,
    electronGeometry: 'octahedral',
    molecularShape: 'octahedral',
    referenceAngleLabel: '90°',
    ligandUnitVectors: [
      [1, 0, 0], [-1, 0, 0],
      [0, 1, 0], [0, -1, 0],
      [0, 0, 1], [0, 0, -1],
    ],
  },
  {
    bondingDomains: 5,
    lonePairs: 1,
    stericNumber: 6,
    electronGeometry: 'octahedral',
    molecularShape: 'square-pyramidal',
    referenceAngleLabel: '<90°',
    ligandUnitVectors: [
      [1, 0, 0], [-1, 0, 0],
      [0, 1, 0], [0, -1, 0],
      [0, 0, 1],
    ],
  },
  {
    bondingDomains: 4,
    lonePairs: 2,
    stericNumber: 6,
    electronGeometry: 'octahedral',
    molecularShape: 'square-planar',
    referenceAngleLabel: '90°',
    ligandUnitVectors: [
      [1 / SQRT2, 1 / SQRT2, 0],
      [-1 / SQRT2, 1 / SQRT2, 0],
      [-1 / SQRT2, -1 / SQRT2, 0],
      [1 / SQRT2, -1 / SQRT2, 0],
    ],
  },
];

export function lookupVseprEntry(bondingDomains: number, lonePairs: number): VseprRuleEntry | null {
  return (
    VSEPR_TABLE.find((e) => e.bondingDomains === bondingDomains && e.lonePairs === lonePairs) ?? null
  );
}

/**
 * Computes net 3D bond-dipole magnitude using Pauling electronegativity differences
 * projected along the true 3D VSEPR ligand unit vectors.
 * Returns null if any element lacks a Pauling electronegativity value.
 */
export function computeMolecularPolarity(
  centralElement: string,
  surroundingElements: string[],
  lonePairs: number,
): { isPolar: boolean; netDipoleMagnitude: number; hasPolarBonds: boolean } | null {
  const entry = lookupVseprEntry(surroundingElements.length, lonePairs);
  const central = getElementBySymbol(centralElement);
  if (!entry || !central || central.electronegativity === null) return null;

  let dx = 0;
  let dy = 0;
  let dz = 0;
  let hasPolarBonds = false;

  for (let i = 0; i < surroundingElements.length; i++) {
    const lig = getElementBySymbol(surroundingElements[i]);
    if (!lig || lig.electronegativity === null) return null;
    const diff = lig.electronegativity - central.electronegativity;
    if (Math.abs(diff) >= 0.35) hasPolarBonds = true;
    const [vx, vy, vz] = entry.ligandUnitVectors[i];
    dx += diff * vx;
    dy += diff * vy;
    dz += diff * vz;
  }

  const mag = Math.sqrt(dx * dx + dy * dy + dz * dz);
  return {
    isPolar: mag > 0.15,
    netDipoleMagnitude: Number(mag.toFixed(3)),
    hasPolarBonds,
  };
}

export interface VseprEvaluationInput {
  moleculeFormula: string;
  centralElement: string;
  surroundingElements: string[];
  targetBondingDomains: number;
  targetLonePairs: number;
  targetElectronGeometry: VseprShapeId;
  targetMolecularShape: VseprShapeId;
  checkPolarity: boolean;
  expectedPolar?: boolean;
  /** Learner selections */
  selectedBondingDomains: number;
  selectedLonePairs: number;
  selectedElectronGeometry: VseprShapeId;
  selectedMolecularShape: VseprShapeId;
  selectedPolarity: 'polar' | 'non-polar' | null;
}

export interface VseprEvaluationResult {
  passed: boolean;
  feedback: string;
  computedPolarity: { isPolar: boolean; netDipoleMagnitude: number; hasPolarBonds: boolean } | null;
}

export function evaluateVseprConstruction(input: VseprEvaluationInput): VseprEvaluationResult {
  const computedPolarity = computeMolecularPolarity(
    input.centralElement,
    input.surroundingElements,
    input.targetLonePairs,
  );

  // 1. Check bonding domains (remind that multiple bonds count as ONE electron domain)
  if (input.selectedBondingDomains !== input.targetBondingDomains) {
    return {
      passed: false,
      feedback: `Check the bonding domains around ${input.centralElement} in ${input.moleculeFormula}: you selected ${input.selectedBondingDomains}, but there are ${input.targetBondingDomains} bonding domains (remember: a double or triple bond counts as ONE electron domain).`,
      computedPolarity,
    };
  }

  // 2. Check lone pairs
  if (input.selectedLonePairs !== input.targetLonePairs) {
    return {
      passed: false,
      feedback: `Check the lone pairs on the central ${input.centralElement} atom in ${input.moleculeFormula}: you selected ${input.selectedLonePairs}, but there ${input.targetLonePairs === 1 ? 'is 1 lone pair' : `are ${input.targetLonePairs} lone pairs`}.`,
      computedPolarity,
    };
  }

  // 3. Check electron-domain geometry vs molecular shape
  if (input.selectedElectronGeometry !== input.targetElectronGeometry) {
    return {
      passed: false,
      feedback: `With ${input.targetBondingDomains} bonding domains and ${input.targetLonePairs} lone pair(s) (${input.targetBondingDomains + input.targetLonePairs} total electron domains), the electron-domain geometry is ${input.targetElectronGeometry.replace(/-/g, ' ')}, not ${input.selectedElectronGeometry.replace(/-/g, ' ')}.`,
      computedPolarity,
    };
  }

  if (input.selectedMolecularShape !== input.targetMolecularShape) {
    const lonePairHint =
      input.targetLonePairs > 0
        ? ' Remember: lone pairs repel bonding pairs and affect the geometry, but molecular shape describes only the positions of the bonded atoms.'
        : '';
    return {
      passed: false,
      feedback: `Electron-domain geometry (${input.targetElectronGeometry.replace(/-/g, ' ')}) is right, but the molecular shape is ${input.targetMolecularShape.replace(/-/g, ' ')}.${lonePairHint}`,
      computedPolarity,
    };
  }

  // 4. Polarity check (when enabled)
  if (input.checkPolarity) {
    if (!input.selectedPolarity) {
      return {
        passed: false,
        feedback: `Select whether ${input.moleculeFormula} is overall polar or non-polar before checking.`,
        computedPolarity,
      };
    }
    const expected = input.expectedPolar ?? computedPolarity?.isPolar ?? false;
    const learnerIsPolar = input.selectedPolarity === 'polar';
    if (learnerIsPolar !== expected) {
      if (!expected && computedPolarity?.hasPolarBonds) {
        return {
          ...{ computedPolarity },
          passed: false,
          feedback: `${input.moleculeFormula} has polar individual bonds, but because of its symmetrical ${input.targetMolecularShape.replace(/-/g, ' ')} arrangement with identical surrounding atoms, the bond dipoles cancel out — making the overall molecule non-polar.`,
        };
      }
      return {
        passed: false,
        feedback: `Re-check the dipole symmetry of ${input.moleculeFormula}: ${expected ? 'the individual bond dipoles do not cancel out, so the overall molecule is polar' : 'the bond dipoles cancel symmetrically, so the overall molecule is non-polar'}.`,
        computedPolarity,
      };
    }
  }

  const ref = lookupVseprEntry(input.targetBondingDomains, input.targetLonePairs);
  return {
    passed: true,
    feedback: `Verified: ${input.moleculeFormula} has ${input.targetBondingDomains} bonding domain(s) and ${input.targetLonePairs} lone pair(s) → ${input.targetElectronGeometry.replace(/-/g, ' ')} electron geometry, ${input.targetMolecularShape.replace(/-/g, ' ')} molecular shape (reference angle: ${ref?.referenceAngleLabel ?? '—'})${input.checkPolarity ? `, overall ${(input.expectedPolar ?? computedPolarity?.isPolar) ? 'polar' : 'non-polar'}` : ''}.`,
    computedPolarity,
  };
}
