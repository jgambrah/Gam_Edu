/**
 * GAM EDU — Step 4E Atomic & Molecular Bonding Engine Barrel
 * Re-exports the 4 modular pure scientific engines for `labKind: 'atom-bond-builder'`.
 */

export * from './atom-bond-atomic';
export * from './atom-bond-ionic';
export * from './atom-bond-covalent';
export * from './atom-bond-vsepr';

export type AtomBondMode =
  | 'atomic-structure'
  | 'ionic-bonding'
  | 'covalent-bonding'
  | 'molecular-geometry';

export const ATOM_BOND_LIMITS = {
  maxShellElementsZ: 20,
  maxSubshellElementsZ: 30,
  maxIonicIons: 6,
  maxCovalentAtoms: 8,
  maxCovalentBonds: 12,
  maxVseprStericNumber: 6,
} as const;
