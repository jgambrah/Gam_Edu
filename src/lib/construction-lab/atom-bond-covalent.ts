/**
 * GAM EDU — Step 4E Pure Scientific Module 3: Covalent & Coordinate (Dative) Bonding
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies.
 * Validates:
 * - Unique atom and bond IDs, no self-bonds or duplicate bonds
 * - Total valence electron conservation (accounting for netCharge)
 * - Individual formal charges and overall charge conservation
 * - Duet (H) / Octet (Period 2) / explicit atom-specific exceptions (BF3 electron-deficient, PCl5/SF6 expanded-octet)
 * - Coordinate (dative) donor lone-pair & acceptor vacant-site validity (e.g. NH3 + H+ -> NH4+)
 * - Structural connectivity / degree signature (rejects arbitrary wrong connectivity while accepting
 *   equivalent permutations of identical atoms)
 */

import { getElementBySymbol } from './atom-bond-atomic';

export const COVALENT_LIMITS = {
  maxAtoms: 8,
  maxBonds: 12,
  maxLonePairsPerAtom: 4,
} as const;

export type OctetPolicy = 'strict-duet-octet' | 'electron-deficient' | 'expanded-octet';

export interface CovalentAtomNode {
  id: string;
  element: string;
  xPct: number;
  yPct: number;
  isCentral?: boolean;
  /** Optional atom-specific valence electron bounds (e.g. B in BF3: { min: 6, max: 6 }, P in PCl5: { min: 10, max: 10 }) */
  minValenceElectrons?: number;
  maxValenceElectrons?: number;
  /** For coordinate-bonding formation tasks: marks an incoming acceptor site (e.g. H+ in NH3 + H+ -> NH4+) */
  isCoordinateAcceptor?: boolean;
  /** For coordinate-bonding formation tasks: marks a donor atom carrying an available lone pair (e.g. N in NH3) */
  isCoordinateDonor?: boolean;
}

export interface CovalentBondDef {
  id?: string;
  from: string;
  to: string;
  order: 1 | 2 | 3;
  isDative?: boolean; // true => 'from' donates both shared electrons to 'to'
}

export interface CovalentEvaluationInput {
  atoms: CovalentAtomNode[];
  bonds: CovalentBondDef[];
  /** Learner-assigned non-bonding lone pairs per atom ID */
  lonePairsByAtom: Record<string, number>;
  netCharge: number;
  octetPolicy: OctetPolicy;
  expectedDativeCount?: number;
  /** Optional canonical connectivity check: expected sorted bond-order multiset per element+atom role */
  referenceBonds?: CovalentBondDef[];
}

export interface AtomElectronReport {
  atomId: string;
  element: string;
  bondingElectrons: number;
  lonePairElectrons: number;
  totalSurroundElectrons: number;
  formalCharge: number;
}

export interface CovalentEvaluationResult {
  passed: boolean;
  feedback: string;
  totalValenceAvailable: number;
  totalElectronsPlaced: number;
  atomReports: AtomElectronReport[];
  sumFormalCharge: number;
}

export function computeExpectedValenceElectrons(atoms: CovalentAtomNode[], netCharge: number): number | null {
  let total = 0;
  for (const a of atoms) {
    const el = getElementBySymbol(a.element);
    if (!el) return null;
    total += el.valenceElectrons;
  }
  return total - netCharge;
}

/**
 * Checks whether all atoms belong to one connected molecular graph (ignoring isolated H+ only before bonding).
 */
function isConnectedGraph(atomIds: string[], bonds: CovalentBondDef[]): boolean {
  if (atomIds.length <= 1) return true;
  const adj = new Map<string, string[]>();
  for (const id of atomIds) adj.set(id, []);
  for (const b of bonds) {
    adj.get(b.from)?.push(b.to);
    adj.get(b.to)?.push(b.from);
  }
  const visited = new Set<string>();
  const stack = [atomIds[0]];
  while (stack.length > 0) {
    const cur = stack.pop()!;
    if (visited.has(cur)) continue;
    visited.add(cur);
    for (const nxt of adj.get(cur) ?? []) {
      if (!visited.has(nxt)) stack.push(nxt);
    }
  }
  return visited.size === atomIds.length;
}

/**
 * Computes an element-labelled bond-order signature (order-invariant under identical-atom permutations).
 * E.g. for HCN: ["C-H:1", "C-N:3"]; for H2O: ["H-O:1", "H-O:1"].
 */
function canonicalBondMultiset(atoms: CovalentAtomNode[], bonds: CovalentBondDef[]): string[] {
  const elMap = new Map(atoms.map((a) => [a.id, a.element]));
  return bonds
    .map((b) => {
      const e1 = elMap.get(b.from) ?? '?';
      const e2 = elMap.get(b.to) ?? '?';
      const pair = e1 <= e2 ? `${e1}-${e2}` : `${e2}-${e1}`;
      return `${pair}:${b.order}`;
    })
    .sort();
}

export function evaluateCovalentBonding(input: CovalentEvaluationInput): CovalentEvaluationResult {
  const atomMap = new Map(input.atoms.map((a) => [a.id, a]));
  const totalValenceAvailable = computeExpectedValenceElectrons(input.atoms, input.netCharge);

  if (totalValenceAvailable === null || totalValenceAvailable < 0) {
    return {
      passed: false,
      feedback: 'Invalid element or charge in covalent bonding configuration.',
      totalValenceAvailable: 0,
      totalElectronsPlaced: 0,
      atomReports: [],
      sumFormalCharge: 0,
    };
  }

  // Validate bond integrity (no self-bonds, no duplicate pairs, valid endpoints)
  const seenPairs = new Set<string>();
  for (const b of input.bonds) {
    if (!atomMap.has(b.from) || !atomMap.has(b.to)) {
      return {
        passed: false,
        feedback: 'A bond references an unknown atom.',
        totalValenceAvailable,
        totalElectronsPlaced: 0,
        atomReports: [],
        sumFormalCharge: 0,
      };
    }
    if (b.from === b.to) {
      return {
        passed: false,
        feedback: 'An atom cannot form a covalent bond with itself.',
        totalValenceAvailable,
        totalElectronsPlaced: 0,
        atomReports: [],
        sumFormalCharge: 0,
      };
    }
    const key = b.from < b.to ? `${b.from}|${b.to}` : `${b.to}|${b.from}`;
    if (seenPairs.has(key)) {
      return {
        passed: false,
        feedback: 'Duplicate bond detected between the same pair of atoms. Increase the bond order instead.',
        totalValenceAvailable,
        totalElectronsPlaced: 0,
        atomReports: [],
        sumFormalCharge: 0,
      };
    }
    seenPairs.add(key);
  }

  // Compute per-atom electron counts and formal charges
  const bondingElectronsMap = new Map<string, number>();
  const bondOrderSumMap = new Map<string, number>();
  for (const a of input.atoms) {
    bondingElectronsMap.set(a.id, 0);
    bondOrderSumMap.set(a.id, 0);
  }

  let totalBondElectrons = 0;
  for (const b of input.bonds) {
    const shared = b.order * 2;
    totalBondElectrons += shared;
    bondingElectronsMap.set(b.from, (bondingElectronsMap.get(b.from) ?? 0) + shared);
    bondingElectronsMap.set(b.to, (bondingElectronsMap.get(b.to) ?? 0) + shared);
    bondOrderSumMap.set(b.from, (bondOrderSumMap.get(b.from) ?? 0) + b.order);
    bondOrderSumMap.set(b.to, (bondOrderSumMap.get(b.to) ?? 0) + b.order);
  }

  let totalLoneElectrons = 0;
  const atomReports: AtomElectronReport[] = [];
  let sumFormalCharge = 0;

  for (const a of input.atoms) {
    const el = getElementBySymbol(a.element)!;
    const lp = Math.max(0, Math.floor(input.lonePairsByAtom[a.id] ?? 0));
    const loneE = lp * 2;
    totalLoneElectrons += loneE;
    const bondE = bondingElectronsMap.get(a.id) ?? 0;
    const formalCharge = el.valenceElectrons - loneE - bondE / 2;
    sumFormalCharge += formalCharge;
    atomReports.push({
      atomId: a.id,
      element: a.element,
      bondingElectrons: bondE,
      lonePairElectrons: loneE,
      totalSurroundElectrons: bondE + loneE,
      formalCharge,
    });
  }

  const totalElectronsPlaced = totalBondElectrons + totalLoneElectrons;
  const base = {
    totalValenceAvailable,
    totalElectronsPlaced,
    atomReports,
    sumFormalCharge,
  };

  // 1. Connectivity check
  if (!isConnectedGraph(input.atoms.map((a) => a.id), input.bonds)) {
    return {
      ...base,
      passed: false,
      feedback: 'All atoms in this molecule or polyatomic ion must be connected by covalent bonds.',
    };
  }

  // 2. Total valence electron conservation
  if (totalElectronsPlaced !== totalValenceAvailable) {
    return {
      ...base,
      passed: false,
      feedback: `Valence electron conservation check failed: this species has ${totalValenceAvailable} valence electrons available, but your structure uses ${totalElectronsPlaced} electrons (${totalBondElectrons} in bonds + ${totalLoneElectrons} in lone pairs).`,
    };
  }

  // 3. Formal charge sum must equal netCharge
  if (sumFormalCharge !== input.netCharge) {
    return {
      ...base,
      passed: false,
      feedback: `Formal charges sum to ${sumFormalCharge}, which does not match the overall charge (${input.netCharge}).`,
    };
  }

  // 4. Duet / Octet / Atom-specific exception checks
  for (const rep of atomReports) {
    const node = atomMap.get(rep.atomId)!;
    const el = getElementBySymbol(rep.element)!;

    if (rep.element === 'H') {
      if (rep.totalSurroundElectrons !== 2 || rep.lonePairElectrons > 0) {
        return {
          ...base,
          passed: false,
          feedback: `Hydrogen (${rep.atomId}) follows the duet rule: it forms 1 single bond (2 shared electrons) and has 0 lone pairs. Currently it has ${rep.totalSurroundElectrons} electrons.`,
        };
      }
      continue;
    }

    // Period 2 elements (B, C, N, O, F) can NEVER exceed 8 valence electrons
    if (el.period === 2 && rep.totalSurroundElectrons > 8) {
      return {
        ...base,
        passed: false,
        feedback: `${el.name} (${rep.atomId}) is a Period 2 element and cannot exceed 8 valence electrons (currently ${rep.totalSurroundElectrons}).`,
      };
    }

    const minE = node.minValenceElectrons ?? (input.octetPolicy === 'electron-deficient' && node.isCentral ? 4 : 8);
    const maxE = node.maxValenceElectrons ?? (input.octetPolicy === 'expanded-octet' && node.isCentral && el.period >= 3 ? 12 : 8);

    if (rep.totalSurroundElectrons < minE || rep.totalSurroundElectrons > maxE) {
      const ruleText =
        minE === maxE ? `exactly ${minE} electrons` : `between ${minE} and ${maxE} electrons`;
      return {
        ...base,
        passed: false,
        feedback: `Check ${el.name} (${rep.atomId}): it currently has ${rep.totalSurroundElectrons} electrons around it (${rep.bondingElectrons} bonding + ${rep.lonePairElectrons} non-bonding), but requires ${ruleText}.`,
      };
    }
  }

  // 5. Coordinate (dative) bonding validation: donor must have donated from an eligible pair, acceptor must be valid
  const dativeBonds = input.bonds.filter((b) => b.isDative);
  if (input.expectedDativeCount !== undefined) {
    if (dativeBonds.length !== input.expectedDativeCount) {
      return {
        ...base,
        passed: false,
        feedback: `Expected ${input.expectedDativeCount} coordinate (dative) bond(s), but ${dativeBonds.length} marked. Mark the bond where both shared electrons are donated by one atom's lone pair.`,
      };
    }
    for (const db of dativeBonds) {
      const donorNode = atomMap.get(db.from)!;
      const acceptorNode = atomMap.get(db.to)!;
      const donorEl = getElementBySymbol(donorNode.element)!;
      // Hydrogen cannot donate a lone pair in a coordinate bond
      if (donorNode.element === 'H' || donorEl.valenceElectrons < 5) {
        return {
          ...base,
          passed: false,
          feedback: `Invalid coordinate bond direction: ${donorEl.name} (${db.from}) does not have a lone pair to donate to ${acceptorNode.element} (${db.to}). Reverse the dative arrow from the electron-pair donor to the acceptor.`,
        };
      }
      // If activity specifies explicit donor/acceptor roles (e.g. NH3 + H+ -> NH4+), validate them
      const hasExplicitDonor = input.atoms.some((a) => a.isCoordinateDonor);
      const hasExplicitAcceptor = input.atoms.some((a) => a.isCoordinateAcceptor);
      if (hasExplicitDonor && !donorNode.isCoordinateDonor) {
        return {
          ...base,
          passed: false,
          feedback: `${donorEl.name} (${db.from}) is not the lone-pair donor in this formation step.`,
        };
      }
      if (hasExplicitAcceptor && !acceptorNode.isCoordinateAcceptor) {
        // Still allow equivalent N-H positions if all acceptors are identical H and donor is valid
        const acceptorEl = acceptorNode.element;
        const explicitAccEls = new Set(input.atoms.filter((a) => a.isCoordinateAcceptor).map((a) => a.element));
        if (!explicitAccEls.has(acceptorEl)) {
          return {
            ...base,
            passed: false,
            feedback: `${acceptorNode.element} (${db.to}) is not a valid electron-pair acceptor site here.`,
          };
        }
      }
    }
  }

  // 6. Reference connectivity check (accepts equivalent permutations of identical atoms, rejects wrong connectivity)
  if (input.referenceBonds && input.referenceBonds.length > 0) {
    const actualSig = canonicalBondMultiset(input.atoms, input.bonds).join(',');
    const expectedSig = canonicalBondMultiset(input.atoms, input.referenceBonds).join(',');
    if (actualSig !== expectedSig) {
      return {
        ...base,
        passed: false,
        feedback: 'Valence electrons and octets are satisfied, but the bond connectivity or bond orders do not match the target molecule. Check which atoms are bonded and whether single, double, or triple bonds are needed.',
      };
    }
  }

  const dativeNote =
    dativeBonds.length > 0
      ? ' Note: once formed, all equivalent bonds (such as the four N–H bonds in NH₄⁺) are identical in length and strength.'
      : '';

  return {
    ...base,
    passed: true,
    feedback: `Verified: all ${totalValenceAvailable} valence electrons are conserved, formal charges sum to ${input.netCharge}, and bonding satisfies the required model.${dativeNote}`,
  };
}
