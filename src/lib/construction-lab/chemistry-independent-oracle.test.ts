/**
 * INDEPENDENT chemistry oracle (audit CP3, PCV-1). Every expected value below comes from textbook chemistry written out here
 * (Madelung/Aufbau with the Cr/Cu exceptions, valence-bond/VSEPR tables, exact rational nullspace balancing, a separate formula
 * parser) and NOT from the implementation under test. The implementation is only called to be compared.
 */
import { describe, expect, it } from 'vitest';
import {
  APPROVED_ELEMENTS,
  evaluateAtomicConstruction,
  getElementByZ,
  getExpectedIntroShells,
  getExpectedSubshells,
  type SubshellId,
} from './atom-bond-atomic';
import { evaluateIonicBonding } from './atom-bond-ionic';
import { evaluateCovalentBonding, type CovalentAtomNode, type CovalentBondDef } from './atom-bond-covalent';
import { VSEPR_TABLE, computeMolecularPolarity, lookupVseprEntry } from './atom-bond-vsepr';
import { evaluateEquationBalance, hasValidEquationSolution, type ChemicalSpeciesDef } from './stoichiometry-engine';
import { independentSolve, parseF } from './chemistry-oracle-helpers';

// ───────────────────────── 1. Atomic structure ─────────────────────────
const ORDER: SubshellId[] = ['1s', '2s', '2p', '3s', '3p', '4s', '3d']; // Madelung order up to Z=30
const CAP: Record<SubshellId, number> = { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 2, '3d': 10 };
function aufbau(z: number): Record<SubshellId, number> {
  const cfg: Record<SubshellId, number> = { '1s': 0, '2s': 0, '2p': 0, '3s': 0, '3p': 0, '4s': 0, '3d': 0 };
  let rem = z;
  for (const s of ORDER) { const put = Math.min(rem, CAP[s]); cfg[s] = put; rem -= put; }
  if (z === 24) { cfg['4s'] = 1; cfg['3d'] = 5; } // Cr [Ar]3d5 4s1
  if (z === 29) { cfg['4s'] = 1; cfg['3d'] = 10; } // Cu [Ar]3d10 4s1
  return cfg;
}
const total = (c: Record<SubshellId, number>) => Object.values(c).reduce((a, b) => a + b, 0);

describe('atomic structure: independent Aufbau oracle', () => {
  it('neutral ground-state configuration matches for every element Z=1..30', () => {
    for (let z = 1; z <= 30; z++) {
      const el = getElementByZ(z)!;
      expect(el, `element Z=${z}`).toBeTruthy();
      expect(getExpectedSubshells(el.symbol, 0), `${el.symbol} (Z=${z})`).toEqual(aufbau(z));
    }
  });

  it('every supported ion has Z - charge electrons, no over-filled subshell and 4s is emptied before 3d', () => {
    for (const el of Object.values(APPROVED_ELEMENTS)) {
      if (el.z > 30) continue;
      for (const q of el.supportedCharges) {
        const cfg = getExpectedSubshells(el.symbol, q);
        expect(cfg, `${el.symbol}${q}`).not.toBeNull();
        expect(total(cfg!), `${el.symbol} charge ${q} electron count`).toBe(el.z - q);
        for (const s of ORDER) expect(cfg![s]).toBeLessThanOrEqual(CAP[s]);
        if (q > 0 && cfg!['3d'] < aufbau(el.z)['3d']) expect(cfg!['4s'], `${el.symbol}${q}: 3d electrons removed so 4s must already be empty`).toBe(0);
      }
    }
  });

  it('named transition-metal and main-group ions match textbook values', () => {
    const d = (sym: string, q: number) => getExpectedSubshells(sym, q)!;
    expect(d('Fe', 2)['3d']).toBe(6); expect(d('Fe', 2)['4s']).toBe(0);
    expect(d('Fe', 3)['3d']).toBe(5);
    expect(d('Cu', 1)['3d']).toBe(10); expect(d('Cu', 1)['4s']).toBe(0);
    expect(d('Cu', 2)['3d']).toBe(9);
    expect(d('Cr', 3)['3d']).toBe(3);
    expect(d('Mn', 2)['3d']).toBe(5);
    expect(d('Zn', 2)['3d']).toBe(10);
    expect(d('Ni', 2)['3d']).toBe(8);
    expect(d('Co', 3)['3d']).toBe(6);
    expect(d('Ti', 4)).toEqual(aufbau(18)); // Ti4+ = [Ar]
    expect(d('Sc', 3)).toEqual(aufbau(18));
    expect(d('Al', 3)).toEqual(aufbau(10)); // Al3+ = [Ne]
    expect(d('Mg', 2)).toEqual(aufbau(10));
    expect(d('Na', 1)).toEqual(aufbau(10));
    expect(d('Cl', -1)).toEqual(aufbau(18));
    expect(d('O', -2)).toEqual(aufbau(10));
    expect(d('N', -3)).toEqual(aufbau(10));
    expect(d('H', -1)).toEqual(aufbau(2));
  });

  it('unsupported charges are refused rather than invented', () => {
    expect(getExpectedSubshells('Na', 2)).toBeNull(); // Na2+ does not form chemically
    expect(getExpectedSubshells('Cl', 1)).toBeNull();
    expect(getExpectedSubshells('Xx', 0)).toBeNull();
  });

  it('introductory shell model: 2,8,8,2 filling for Z<=20', () => {
    const expected = (n: number) => { const caps = [2, 8, 8, 2]; const out = [0, 0, 0, 0]; let r = n; caps.forEach((c, i) => { out[i] = Math.min(r, c); r -= out[i]; }); return out; };
    for (let n = 1; n <= 20; n++) expect(getExpectedIntroShells(n)).toEqual(expected(n));
    expect(getExpectedIntroShells(19)).toEqual([2, 8, 8, 1]); // K
    expect(getExpectedIntroShells(20)).toEqual([2, 8, 8, 2]); // Ca
  });

  it('isotopes: mass numbers listed are real, and A = Z + N is enforced', () => {
    const real: Record<string, number[]> = { H: [1, 2, 3], He: [3, 4], Li: [6, 7], B: [10, 11], C: [12, 13, 14], N: [14, 15], O: [16, 17, 18], Cl: [35, 37], Fe: [54, 56, 57], Cu: [63, 65], Br: [79, 81] };
    for (const [sym, masses] of Object.entries(real)) {
      const got = APPROVED_ELEMENTS[sym].isotopes.map((i) => i.massNumber);
      for (const m of masses) expect(got, `${sym}-${m}`).toContain(m);
      for (const m of got) expect(masses, `${sym}-${m} should be a real isotope`).toContain(m);
    }
    expect(APPROVED_ELEMENTS.C.isotopes.find((i) => i.massNumber === 14)!.radioactive).toBe(true);
    expect(APPROVED_ELEMENTS.H.isotopes.find((i) => i.massNumber === 3)!.radioactive).toBe(true);
    expect(APPROVED_ELEMENTS.C.isotopes.find((i) => i.massNumber === 12)!.radioactive).toBe(false);
  });

  it('Pauling electronegativities are the published values', () => {
    const pauling: Record<string, number> = { H: 2.2, Li: 0.98, Be: 1.57, B: 2.04, C: 2.55, N: 3.04, O: 3.44, F: 3.98, Na: 0.93, Mg: 1.31, Al: 1.61, Si: 1.9, P: 2.19, S: 2.58, Cl: 3.16, K: 0.82, Ca: 1.0, Br: 2.96, I: 2.66 };
    for (const [s, v] of Object.entries(pauling)) expect(APPROVED_ELEMENTS[s].electronegativity, s).toBeCloseTo(v, 2);
  });

  it('invalid particle input is rejected, never graded as correct', () => {
    const base = { targetElement: 'C', targetMassNumber: 12, targetCharge: 0, representation: 'shells' as const, protons: 6, neutrons: 6, shells: [2, 4, 0, 0] };
    expect(evaluateAtomicConstruction(base).passed).toBe(true);
    for (const bad of [0, -1, 1.5, NaN, Infinity, 1e12, Number.MAX_SAFE_INTEGER + 2]) {
      expect(evaluateAtomicConstruction({ ...base, protons: bad as number }).passed, `protons=${bad}`).toBe(false);
    }
    for (const bad of [-1, 2.2, NaN, Infinity, 1e12]) {
      expect(evaluateAtomicConstruction({ ...base, neutrons: bad as number }).passed, `neutrons=${bad}`).toBe(false);
    }
    expect(evaluateAtomicConstruction({ ...base, representation: 'orbitals' as any }).passed).toBe(false);
    expect(evaluateAtomicConstruction({ ...base, neutrons: 7 }).passed, 'C-13 asked for C-12').toBe(false);
    expect(evaluateAtomicConstruction({ ...base, shells: [2, 3, 1, 0] }).passed, 'excited-state shells must not pass as ground state').toBe(false);
    expect(evaluateAtomicConstruction({ ...base, shells: [3, 3, 0, 0] }).passed, 'shell over capacity').toBe(false);
  });
});

// ───────────────────────── 2. Ionic bonding ─────────────────────────
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const COMPOUNDS: Array<[string, number, string, number]> = [
  ['Na', 1, 'Cl', -1], ['Mg', 2, 'O', -2], ['Mg', 2, 'Cl', -1], ['Ca', 2, 'Cl', -1], ['Na', 1, 'O', -2],
  ['Al', 3, 'O', -2], ['Al', 3, 'Cl', -1], ['Ca', 2, 'O', -2], ['K', 1, 'Br', -1], ['Li', 1, 'F', -1], ['Mg', 2, 'S', -2],
];

describe('ionic bonding: independent charge-balance oracle', () => {
  for (const [cat, qc, an, qa] of COMPOUNDS) {
    it(`${cat}${qc}+ with ${an}${qa}-: exact simplest ratio and electron conservation`, () => {
      const g = gcd(qc, Math.abs(qa));
      const nCat = Math.abs(qa) / g; const nAn = qc / g; // criss-cross then reduce
      const input = { cationElement: cat, anionElement: an, targetCationCount: nCat, targetAnionCount: nAn, targetCationCharge: qc, targetAnionCharge: qa };
      const ok = evaluateIonicBonding({ ...input, cationCount: nCat, anionCount: nAn, electronsTransferred: nCat * qc });
      expect(ok.passed, ok.feedback).toBe(true);
      expect(ok.netCharge).toBe(0);
      // wrong transfer
      expect(evaluateIonicBonding({ ...input, cationCount: nCat, anionCount: nAn, electronsTransferred: nCat * qc - 1 }).passed).toBe(false);
      // impossible transfer (more than donors can give)
      const imp = evaluateIonicBonding({ ...input, cationCount: nCat, anionCount: nAn, electronsTransferred: nCat * qc + 1 });
      expect(imp.passed).toBe(false); expect(imp.isImpossibleTransfer).toBe(true);
      // unbalanced
      if (nCat + nAn + 1 <= 6) expect(evaluateIonicBonding({ ...input, cationCount: nCat + 1, anionCount: nAn, electronsTransferred: (nCat + 1) * qc }).passed).toBe(false);
      // neutral but not simplest
      if (2 * (nCat + nAn) <= 6) expect(evaluateIonicBonding({ ...input, cationCount: 2 * nCat, anionCount: 2 * nAn, electronsTransferred: 2 * nCat * qc }).passed).toBe(false);
    });
  }

  it('exhaustive property: passes iff counts equal the simplest balanced ratio AND transfer equals donor electrons', () => {
    for (const [cat, qc, an, qa] of COMPOUNDS) {
      const g = gcd(qc, Math.abs(qa)); const wantC = Math.abs(qa) / g; const wantA = qc / g;
      const input = { cationElement: cat, anionElement: an, targetCationCount: wantC, targetAnionCount: wantA, targetCationCharge: qc, targetAnionCharge: qa };
      for (let c = 1; c <= 5; c++) for (let a = 1; a <= 5; a++) for (let e = 0; e <= 12; e++) {
        const r = evaluateIonicBonding({ ...input, cationCount: c, anionCount: a, electronsTransferred: e });
        const expected = c === wantC && a === wantA && e === wantC * qc && c + a <= 6;
        expect(r.passed, `${cat}${c}${an}${a} e=${e}`).toBe(expected);
      }
    }
  });

  it('non-integer / negative / NaN transfers are impossible, not silently clamped to success', () => {
    const input = { cationElement: 'Na', anionElement: 'Cl', targetCationCount: 1, targetAnionCount: 1, targetCationCharge: 1, targetAnionCharge: -1, cationCount: 1, anionCount: 1 };
    for (const e of [-1, 0.5, NaN, Infinity]) expect(evaluateIonicBonding({ ...input, electronsTransferred: e as number }).passed, `e=${e}`).toBe(false);
  });
});

// ───────────────────────── 3. Covalent bonding ─────────────────────────
const A = (id: string, element: string, extra: Partial<CovalentAtomNode> = {}): CovalentAtomNode => ({ id, element, xPct: 50, yPct: 50, ...extra });
const B = (from: string, to: string, order: 1 | 2 | 3 = 1, isDative = false): CovalentBondDef => ({ from, to, order, isDative });
type Case = { name: string; atoms: CovalentAtomNode[]; bonds: CovalentBondDef[]; lp: Record<string, number>; q: number; policy: any; fc: Record<string, number>; dative?: number; ref?: boolean };
const CASES: Case[] = [
  { name: 'H2O', atoms: [A('O', 'O', { isCentral: true }), A('H1', 'H'), A('H2', 'H')], bonds: [B('O', 'H1'), B('O', 'H2')], lp: { O: 2 }, q: 0, policy: 'strict-duet-octet', fc: { O: 0, H1: 0, H2: 0 } },
  { name: 'NH3', atoms: [A('N', 'N', { isCentral: true }), A('H1', 'H'), A('H2', 'H'), A('H3', 'H')], bonds: [B('N', 'H1'), B('N', 'H2'), B('N', 'H3')], lp: { N: 1 }, q: 0, policy: 'strict-duet-octet', fc: { N: 0 } },
  { name: 'CH4', atoms: [A('C', 'C', { isCentral: true }), A('H1', 'H'), A('H2', 'H'), A('H3', 'H'), A('H4', 'H')], bonds: [B('C', 'H1'), B('C', 'H2'), B('C', 'H3'), B('C', 'H4')], lp: {}, q: 0, policy: 'strict-duet-octet', fc: { C: 0 } },
  { name: 'CO2', atoms: [A('C', 'C', { isCentral: true }), A('O1', 'O'), A('O2', 'O')], bonds: [B('C', 'O1', 2), B('C', 'O2', 2)], lp: { O1: 2, O2: 2 }, q: 0, policy: 'strict-duet-octet', fc: { C: 0, O1: 0 } },
  { name: 'N2', atoms: [A('N1', 'N', { isCentral: true }), A('N2', 'N')], bonds: [B('N1', 'N2', 3)], lp: { N1: 1, N2: 1 }, q: 0, policy: 'strict-duet-octet', fc: { N1: 0 } },
  { name: 'O2', atoms: [A('O1', 'O', { isCentral: true }), A('O2', 'O')], bonds: [B('O1', 'O2', 2)], lp: { O1: 2, O2: 2 }, q: 0, policy: 'strict-duet-octet', fc: { O1: 0 } },
  { name: 'HCN', atoms: [A('C', 'C', { isCentral: true }), A('H', 'H'), A('N', 'N')], bonds: [B('C', 'H'), B('C', 'N', 3)], lp: { N: 1 }, q: 0, policy: 'strict-duet-octet', fc: { C: 0, N: 0 } },
  { name: 'C2H4', atoms: [A('C1', 'C', { isCentral: true }), A('C2', 'C'), A('H1', 'H'), A('H2', 'H'), A('H3', 'H'), A('H4', 'H')], bonds: [B('C1', 'C2', 2), B('C1', 'H1'), B('C1', 'H2'), B('C2', 'H3'), B('C2', 'H4')], lp: {}, q: 0, policy: 'strict-duet-octet', fc: { C1: 0, C2: 0 } },
  { name: 'NH4+ (coordinate bond)', atoms: [A('N', 'N', { isCentral: true, isCoordinateDonor: true }), A('H1', 'H'), A('H2', 'H'), A('H3', 'H'), A('H4', 'H', { isCoordinateAcceptor: true })], bonds: [B('N', 'H1'), B('N', 'H2'), B('N', 'H3'), B('N', 'H4', 1, true)], lp: {}, q: 1, policy: 'strict-duet-octet', fc: { N: 1, H1: 0, H4: 0 }, dative: 1 },
  { name: 'H3O+', atoms: [A('O', 'O', { isCentral: true, isCoordinateDonor: true }), A('H1', 'H'), A('H2', 'H'), A('H3', 'H', { isCoordinateAcceptor: true })], bonds: [B('O', 'H1'), B('O', 'H2'), B('O', 'H3', 1, true)], lp: { O: 1 }, q: 1, policy: 'strict-duet-octet', fc: { O: 1 }, dative: 1 },
  { name: 'CO (dative; C-1, O+1)', atoms: [A('C', 'C', { isCentral: true }), A('O', 'O', { isCoordinateDonor: true })], bonds: [B('O', 'C', 3, true)], lp: { C: 1, O: 1 }, q: 0, policy: 'strict-duet-octet', fc: { C: -1, O: 1 }, dative: 1 },
  { name: 'BF3 (electron-deficient)', atoms: [A('B', 'B', { isCentral: true, minValenceElectrons: 6, maxValenceElectrons: 6 }), A('F1', 'F'), A('F2', 'F'), A('F3', 'F')], bonds: [B('B', 'F1'), B('B', 'F2'), B('B', 'F3')], lp: { F1: 3, F2: 3, F3: 3 }, q: 0, policy: 'electron-deficient', fc: { B: 0 } },
  { name: 'SF6 (expanded octet)', atoms: [A('S', 'S', { isCentral: true, minValenceElectrons: 12, maxValenceElectrons: 12 }), ...[1, 2, 3, 4, 5, 6].map((i) => A('F' + i, 'F'))], bonds: [1, 2, 3, 4, 5, 6].map((i) => B('S', 'F' + i)), lp: Object.fromEntries([1, 2, 3, 4, 5, 6].map((i) => ['F' + i, 3])), q: 0, policy: 'expanded-octet', fc: { S: 0 } },
];

describe('covalent bonding: independent Lewis-structure oracle', () => {
  for (const c of CASES) {
    it(`${c.name}: correct structure passes with textbook formal charges`, () => {
      const r = evaluateCovalentBonding({ atoms: c.atoms, bonds: c.bonds, lonePairsByAtom: c.lp, netCharge: c.q, octetPolicy: c.policy, expectedDativeCount: c.dative });
      expect(r.passed, r.feedback).toBe(true);
      for (const [id, fc] of Object.entries(c.fc)) expect(r.atomReports.find((x) => x.atomId === id)!.formalCharge, `${c.name} ${id}`).toBe(fc);
      expect(r.totalElectronsPlaced).toBe(r.totalValenceAvailable);
      expect(r.sumFormalCharge).toBe(c.q);
    });
    it(`${c.name}: removing a lone pair / wrong charge / missing bond is rejected`, () => {
      const lpKeys = Object.keys(c.lp).filter((k) => c.lp[k] > 0);
      if (lpKeys.length) {
        const less = { ...c.lp, [lpKeys[0]]: c.lp[lpKeys[0]] - 1 };
        expect(evaluateCovalentBonding({ atoms: c.atoms, bonds: c.bonds, lonePairsByAtom: less, netCharge: c.q, octetPolicy: c.policy, expectedDativeCount: c.dative }).passed, 'one lone pair removed').toBe(false);
      }
      expect(evaluateCovalentBonding({ atoms: c.atoms, bonds: c.bonds, lonePairsByAtom: c.lp, netCharge: c.q + 1, octetPolicy: c.policy, expectedDativeCount: c.dative }).passed, 'wrong net charge').toBe(false);
      if (c.bonds.length > 1) expect(evaluateCovalentBonding({ atoms: c.atoms, bonds: c.bonds.slice(1), lonePairsByAtom: c.lp, netCharge: c.q, octetPolicy: c.policy, expectedDativeCount: c.dative }).passed, 'bond removed').toBe(false);
    });
  }

  it('reference connectivity rejects an isomer that satisfies every octet (HCN vs HNC)', () => {
    const atoms = [A('C', 'C', { isCentral: true }), A('H', 'H'), A('N', 'N')];
    const hnc = evaluateCovalentBonding({ atoms, bonds: [B('N', 'H'), B('N', 'C', 3)], lonePairsByAtom: { C: 1 }, netCharge: 0, octetPolicy: 'strict-duet-octet', referenceBonds: [B('C', 'H'), B('C', 'N', 3)] });
    // N bonded to H and C with a triple bond: N has 8 shared electrons... check engine honours the reference
    expect(hnc.passed, 'HNC must not be accepted as HCN').toBe(false);
  });

  it('refuses self-bonds, duplicate bonds, unknown atoms and disconnected fragments', () => {
    const atoms = [A('O', 'O'), A('H1', 'H'), A('H2', 'H')];
    const run = (bonds: CovalentBondDef[]) => evaluateCovalentBonding({ atoms, bonds, lonePairsByAtom: { O: 2 }, netCharge: 0, octetPolicy: 'strict-duet-octet' }).passed;
    expect(run([B('O', 'O')])).toBe(false);
    expect(run([B('O', 'H1'), B('O', 'H1')])).toBe(false);
    expect(run([B('O', 'ZZ')])).toBe(false);
    expect(run([B('O', 'H1')])).toBe(false);
  });

  it('period-2 elements can never exceed an octet even under the expanded-octet policy', () => {
    const atoms = [A('N', 'N', { isCentral: true, minValenceElectrons: 10, maxValenceElectrons: 10 }), ...[1, 2, 3, 4, 5].map((i) => A('F' + i, 'F'))];
    const r = evaluateCovalentBonding({ atoms, bonds: [1, 2, 3, 4, 5].map((i) => B('N', 'F' + i)), lonePairsByAtom: Object.fromEntries([1, 2, 3, 4, 5].map((i) => ['F' + i, 3])), netCharge: 0, octetPolicy: 'expanded-octet' });
    expect(r.passed, 'NF5 does not exist').toBe(false);
  });
});

// ───────────────────────── 4. VSEPR / geometry / polarity ─────────────────────────
const TEXTBOOK: Array<[number, number, string, string]> = [
  [2, 0, 'linear', 'linear'], [3, 0, 'trigonal-planar', 'trigonal-planar'], [2, 1, 'trigonal-planar', 'bent'],
  [4, 0, 'tetrahedral', 'tetrahedral'], [3, 1, 'tetrahedral', 'trigonal-pyramidal'], [2, 2, 'tetrahedral', 'bent'],
  [5, 0, 'trigonal-bipyramidal', 'trigonal-bipyramidal'], [4, 1, 'trigonal-bipyramidal', 'seesaw'], [3, 2, 'trigonal-bipyramidal', 't-shaped'],
  [6, 0, 'octahedral', 'octahedral'], [5, 1, 'octahedral', 'square-pyramidal'], [4, 2, 'octahedral', 'square-planar'],
];
const dot = (a: readonly number[], b: readonly number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const angle = (a: readonly number[], b: readonly number[]) => (Math.acos(Math.max(-1, Math.min(1, dot(a, b)))) * 180) / Math.PI;

describe('VSEPR: independent textbook table and 3D vectors', () => {
  it('each (bonding domains, lone pairs) maps to the textbook electron geometry and molecular shape', () => {
    for (const [bp, lp, eg, ms] of TEXTBOOK) {
      const e = lookupVseprEntry(bp, lp)!;
      expect(e, `${bp},${lp}`).toBeTruthy();
      expect(e.electronGeometry).toBe(eg); expect(e.molecularShape).toBe(ms); expect(e.stericNumber).toBe(bp + lp);
      expect(e.ligandUnitVectors.length).toBe(bp);
    }
  });

  it('ligand vectors are unit length and give the ideal inter-ligand angles', () => {
    const angles = (bp: number, lp: number) => { const v = lookupVseprEntry(bp, lp)!.ligandUnitVectors; const out: number[] = []; for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) out.push(Math.round(angle(v[i], v[j]) * 10) / 10); return [...new Set(out)].sort((a, b) => a - b); };
    for (const e of VSEPR_TABLE) for (const v of e.ligandUnitVectors) expect(Math.hypot(v[0], v[1], v[2])).toBeCloseTo(1, 6);
    expect(angles(2, 0)).toEqual([180]);
    expect(angles(3, 0)).toEqual([120]);
    expect(angles(4, 0)).toEqual([109.5]);
    expect(angles(3, 1)).toEqual([109.5]); // ideal; real NH3 ~107 deg shown as reference label
    expect(angles(5, 0)).toEqual([90, 120, 180]);
    expect(angles(6, 0)).toEqual([90, 180]);
    expect(angles(4, 2)).toEqual([90, 180]);
    expect(angles(5, 1)).toEqual([90, 180]);
    expect(angles(3, 2)).toEqual([90, 180]);
  });

  it('lone-pair compression is labelled below the ideal angle (and water is 104.5, ammonia ~107)', () => {
    expect(lookupVseprEntry(2, 2)!.referenceAngleLabel).toContain('104.5');
    expect(lookupVseprEntry(3, 1)!.referenceAngleLabel).toContain('107');
    expect(lookupVseprEntry(4, 0)!.referenceAngleLabel).toContain('109.5');
  });

  const POLARITY: Array<[string, string, string[], number, boolean]> = [
    ['CO2', 'C', ['O', 'O'], 0, false], ['CH4', 'C', ['H', 'H', 'H', 'H'], 0, false], ['CCl4', 'C', ['Cl', 'Cl', 'Cl', 'Cl'], 0, false],
    ['BF3', 'B', ['F', 'F', 'F'], 0, false], ['SF6', 'S', ['F', 'F', 'F', 'F', 'F', 'F'], 0, false], ['PCl5', 'P', ['Cl', 'Cl', 'Cl', 'Cl', 'Cl'], 0, false],
    ['H2O', 'O', ['H', 'H'], 2, true], ['NH3', 'N', ['H', 'H', 'H'], 1, true], ['SO2', 'S', ['O', 'O'], 1, true], ['H2S', 'S', ['H', 'H'], 2, true],
    ['CH3Cl', 'C', ['H', 'H', 'H', 'Cl'], 0, true], ['CH2Cl2', 'C', ['H', 'H', 'Cl', 'Cl'], 0, true], ['SF4', 'S', ['F', 'F', 'F', 'F'], 1, true], ['ClF3', 'Cl', ['F', 'F', 'F'], 2, true],
  ];
  for (const [name, central, lig, lp, polar] of POLARITY) {
    it(`${name} is ${polar ? 'polar' : 'non-polar'}`, () => {
      const r = computeMolecularPolarity(central, lig, lp);
      expect(r, name).not.toBeNull();
      expect(r!.isPolar, `${name} net dipole ${r!.netDipoleMagnitude}`).toBe(polar);
    });
  }

  it('C-H bonds are treated as non-polar (delta-EN 0.35 < 0.4 convention used in Cambridge/NaCCA teaching); floating-point must not flip this', () => {
    const r = computeMolecularPolarity('C', ['H', 'H', 'H', 'H'], 0)!;
    expect(r.hasPolarBonds, 'methane C-H flagged as a polar bond').toBe(false);
  });

  it('XeF2-type linear (2 bonding + 3 lone pairs) is an unsupported case that fails closed (null), never mis-graded', () => {
    expect(lookupVseprEntry(2, 3)).toBeNull();
    expect(computeMolecularPolarity('S', ['F', 'F'], 3)).toBeNull();
  });
});

// ───────────────────────── 5. Equation balancing ─────────────────────────
const S = (formula: string, charge?: number): ChemicalSpeciesDef => ({ formula, ...(charge ? { charge } : {}) });
const EQS: Array<[string, ChemicalSpeciesDef[], ChemicalSpeciesDef[]]> = [
  ['methane combustion', [S('CH4'), S('O2')], [S('CO2'), S('H2O')]],
  ['propane combustion', [S('C3H8'), S('O2')], [S('CO2'), S('H2O')]],
  ['ethane combustion', [S('C2H6'), S('O2')], [S('CO2'), S('H2O')]],
  ['butane incomplete (CO)', [S('C4H10'), S('O2')], [S('CO'), S('H2O')]],
  ['ethene combustion', [S('C2H4'), S('O2')], [S('CO2'), S('H2O')]],
  ['hexane incomplete (C soot)', [S('C6H14'), S('O2')], [S('C'), S('H2O')]],
  ['cracking C10H22', [S('C10H22')], [S('C8H18'), S('C2H4')]],
  ['thermite', [S('Fe2O3'), S('Al')], [S('Al2O3'), S('Fe')]],
  ['aluminium oxidation', [S('Al'), S('O2')], [S('Al2O3')]],
  ['neutralisation Ca(OH)2', [S('Ca(OH)2'), S('HCl')], [S('CaCl2'), S('H2O')]],
  ['Al2(SO4)3 + Ca(OH)2', [S('Al2(SO4)3'), S('Ca(OH)2')], [S('Al(OH)3'), S('CaSO4')]],
  ['permanganate / Fe2+ (charge)', [S('MnO4', -1), S('Fe', 2), S('H', 1)], [S('Mn', 2), S('Fe', 3), S('H2O')]],
];

describe('equation balancing: independent exact-rational oracle', () => {
  for (const [name, R, P] of EQS) {
    it(`${name}: engine agrees with the exact nullspace solution and rejects near-misses`, () => {
      const sol = independentSolve(R, P);
      expect(sol, `oracle could not solve ${name}`).not.toBeNull();
      const rc = sol!.slice(0, R.length); const pc = sol!.slice(R.length);
      const ok = evaluateEquationBalance(R, P, rc, pc, { maxCoefficient: 15 });
      expect(ok.ok, ok.feedback).toBe(true);
      expect(ok.isBalanced && ok.isSimplestRatio, `${name} ${JSON.stringify(sol)}`).toBe(true);
      const doubled = evaluateEquationBalance(R, P, rc.map((x) => 2 * x), pc.map((x) => 2 * x), { maxCoefficient: 15 });
      if (doubled.ok) { expect(doubled.isBalanced).toBe(true); expect(doubled.isSimplestRatio, 'doubled is not simplest').toBe(false); }
      const bad = [...rc]; bad[0] = bad[0] + 1;
      const wrong = evaluateEquationBalance(R, P, bad, pc, { maxCoefficient: 15 });
      if (wrong.ok) expect(wrong.isBalanced, 'off-by-one coefficient must not balance').toBe(false);
      const solv = hasValidEquationSolution(R, P, 15);
      expect(solv.solvable, `${name} solvable`).toBe(true);
      if (solv.sampleSolution) { const sc = evaluateEquationBalance(R, P, solv.sampleSolution.reactants, solv.sampleSolution.products, { maxCoefficient: 15 }); expect(sc.isBalanced, 'engine sample solution must balance').toBe(true); }
    });
  }

  it('atom/charge conservation is independent: balanced atoms with unbalanced charge is NOT balanced', () => {
    const r = evaluateEquationBalance([S('Fe', 2), S('Cl2')], [S('Fe', 3), S('Cl', -1)], [1, 1], [1, 2]);
    expect(r.isAtomsBalanced).toBe(true); expect(r.isChargeBalanced).toBe(false); expect(r.isBalanced).toBe(false);
  });

  it('unsolvable equations and coefficient bounds are reported honestly', () => {
    expect(hasValidEquationSolution([S('CH4'), S('O2')], [S('CO2')], 15).solvable).toBe(false); // no H on the right
    expect(hasValidEquationSolution([S('C3H8'), S('O2')], [S('CO2'), S('H2O')], 3).solvable, 'needs coefficient 5').toBe(false);
    expect(hasValidEquationSolution([S('C3H8'), S('O2')], [S('CO2'), S('H2O')], 5).solvable).toBe(true);
    expect(evaluateEquationBalance([S('CH4'), S('O2')], [S('CO2'), S('H2O')], [0, 2], [1, 2]).ok, 'coefficient 0').toBe(false);
    expect(evaluateEquationBalance([S('CH4'), S('O2')], [S('CO2'), S('H2O')], [1, 2.5], [1, 2]).ok, 'fractional coefficient').toBe(false);
    expect(evaluateEquationBalance([S('CH4'), S('O2')], [S('CO2'), S('H2O')], [1, 99], [1, 2]).ok, 'over hard cap').toBe(false);
    expect(evaluateEquationBalance([S('Xx')], [S('Xx')], [1], [1]).ok, 'unknown element').toBe(false);
  });

  it('independent parser agrees with the engine parser on bracketed formulae', () => {
    for (const f of ['Ca(OH)2', 'Al2(SO4)3', 'C10H22', 'Fe2O3', 'Mg(NO3)2', 'NH4Cl']) {
      const mine = parseF(f);
      const r = evaluateEquationBalance([S(f)], [S(f)], [1], [1]);
      for (const row of r.elements) expect(row.lhs, `${f} ${row.element}`).toBe(mine[row.element]);
      expect(r.elements.length).toBe(Object.keys(mine).length);
    }
  });
});
