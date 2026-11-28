// @vitest-environment node
/**
 * Independent verification of chemistry / biology reference models (audit checkpoint 2).
 * Oracles are written independently of the engines: an Aufbau/Madelung generator with the two textbook
 * exceptions (Cr, Cu), hand-listed ion configurations, atom/charge bookkeeping, and the degeneracy
 * counts of the standard genetic code (a published constant), not a copy of the engine's table.
 */
import { describe, expect, it } from 'vitest';
import { APPROVED_ELEMENTS, getExpectedSubshells } from './atom-bond-atomic';
import {
  evaluateEquationBalance,
  parseChemicalFormula,
  type ChemicalSpeciesDef,
} from './stoichiometry-engine';
import {
  STANDARD_GENETIC_CODE,
  computeExpectedDnaComplement,
  computeExpectedMrnaFromTemplate,
  computeMonohybridPunnett,
  translateMrnaCodons,
} from './bio-sequence-engine';

// ---------------- electron configurations ----------------
const SYMBOLS_Z1_30 = ['H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn'];

/** Madelung (n+l) filling for subshells the engine models, with the Cr and Cu half/full d exceptions. */
function aufbau(z: number): Record<string, number> {
  const order: Array<[string, number]> = [['1s', 2], ['2s', 2], ['2p', 6], ['3s', 2], ['3p', 6], ['4s', 2], ['3d', 10]];
  const cfg: Record<string, number> = { '1s': 0, '2s': 0, '2p': 0, '3s': 0, '3p': 0, '4s': 0, '3d': 0 };
  let left = z;
  for (const [name, cap] of order) { const put = Math.min(left, cap); cfg[name] = put; left -= put; }
  if (z === 24) { cfg['4s'] = 1; cfg['3d'] = 5; }   // chromium
  if (z === 29) { cfg['4s'] = 1; cfg['3d'] = 10; }  // copper
  return cfg;
}

describe('electron configurations vs independent Aufbau oracle', () => {
  it('neutral ground-state configurations for Z=1..30 match (including Cr and Cu exceptions)', () => {
    SYMBOLS_Z1_30.forEach((sym, i) => {
      const z = i + 1;
      expect(APPROVED_ELEMENTS[sym].z, `${sym} atomic number`).toBe(z);
      expect(getExpectedSubshells(sym, 0), `${sym} neutral`).toEqual(aufbau(z));
    });
  });

  const ions: Array<[string, number, Record<string, number>]> = [
    ['Na', 1, { '1s': 2, '2s': 2, '2p': 6, '3s': 0, '3p': 0, '4s': 0, '3d': 0 }],
    ['Mg', 2, { '1s': 2, '2s': 2, '2p': 6, '3s': 0, '3p': 0, '4s': 0, '3d': 0 }],
    ['Al', 3, { '1s': 2, '2s': 2, '2p': 6, '3s': 0, '3p': 0, '4s': 0, '3d': 0 }],
    ['Ca', 2, { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 0, '3d': 0 }],
    ['Fe', 2, { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 0, '3d': 6 }],  // 4s electrons leave first
    ['Fe', 3, { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 0, '3d': 5 }],
    ['Cu', 1, { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 0, '3d': 10 }],
    ['Cu', 2, { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 0, '3d': 9 }],
    ['Cr', 3, { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 0, '3d': 3 }],
    ['Zn', 2, { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 0, '3d': 10 }],
    ['Ti', 4, { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 0, '3d': 0 }],
    ['Cl', -1, { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 0, '3d': 0 }],
    ['O', -2, { '1s': 2, '2s': 2, '2p': 6, '3s': 0, '3p': 0, '4s': 0, '3d': 0 }],
    ['N', -3, { '1s': 2, '2s': 2, '2p': 6, '3s': 0, '3p': 0, '4s': 0, '3d': 0 }],
    ['H', -1, { '1s': 2, '2s': 0, '2p': 0, '3s': 0, '3p': 0, '4s': 0, '3d': 0 }],
  ];
  for (const [sym, charge, expected] of ions) {
    it(`${sym}${charge > 0 ? '+'.repeat(1) + charge : charge} ion configuration`, () => {
      expect(getExpectedSubshells(sym, charge)).toEqual(expected);
    });
  }

  it('unsupported charges are rejected rather than invented', () => {
    expect(getExpectedSubshells('Na', 2)).toBeNull();
    expect(getExpectedSubshells('O', 2)).toBeNull();
    expect(getExpectedSubshells('Xx', 0)).toBeNull();
  });

  it('electron count of every neutral configuration equals Z, and electronegativities follow published Pauling values', () => {
    for (const sym of SYMBOLS_Z1_30) {
      const cfg = getExpectedSubshells(sym, 0)!;
      expect(Object.values(cfg).reduce((a, b) => a + b, 0)).toBe(APPROVED_ELEMENTS[sym].z);
    }
    const pauling: Record<string, number> = { H: 2.2, Li: 0.98, C: 2.55, N: 3.04, O: 3.44, F: 3.98, Na: 0.93, Mg: 1.31, Al: 1.61, Si: 1.9, P: 2.19, S: 2.58, Cl: 3.16, K: 0.82, Ca: 1.0, Fe: 1.83, Cu: 1.9, Zn: 1.65, Br: 2.96, I: 2.66 };
    for (const [sym, v] of Object.entries(pauling)) expect(APPROVED_ELEMENTS[sym].electronegativity, sym).toBeCloseTo(v, 2);
  });
});

// ---------------- equation balancing ----------------
const sp = (formula: string, extra: Partial<ChemicalSpeciesDef> = {}): ChemicalSpeciesDef => ({ formula, ...extra });

/** Independent bookkeeping: total atoms (and charge) on a side. */
function side(species: ChemicalSpeciesDef[], coeffs: number[]) {
  const atoms: Record<string, number> = {};
  let charge = 0;
  species.forEach((s, i) => {
    const p = parseChemicalFormula(s.formula, !!s.isElectron);
    for (const [el, n] of Object.entries(p.atoms)) atoms[el] = (atoms[el] ?? 0) + n * coeffs[i];
    charge += (s.charge ?? (s.isElectron ? -1 : 0)) * coeffs[i];
  });
  return { atoms, charge };
}

describe('formula parsing and equation balance vs independent bookkeeping', () => {
  it('parses nested formulae', () => {
    expect(parseChemicalFormula('Ca(OH)2').atoms).toEqual({ Ca: 1, O: 2, H: 2 });
    expect(parseChemicalFormula('Al2(SO4)3').atoms).toEqual({ Al: 2, S: 3, O: 12 });
    expect(parseChemicalFormula('(NH4)2SO4').atoms).toEqual({ N: 2, H: 8, S: 1, O: 4 });
  });
  it('rejects malformed formulae', () => {
    for (const bad of ['', 'Xx2', 'H0', 'Ca(OH', 'CaOH)2', 'H2O!', '()', 'h2o']) expect(parseChemicalFormula(bad).ok, bad).toBe(false);
  });

  const equations: Array<{ name: string; r: ChemicalSpeciesDef[]; p: ChemicalSpeciesDef[]; rc: number[]; pc: number[] }> = [
    { name: 'combustion of methane', r: [sp('CH4'), sp('O2')], p: [sp('CO2'), sp('H2O')], rc: [1, 2], pc: [1, 2] },
    { name: 'photosynthesis', r: [sp('CO2'), sp('H2O')], p: [sp('C6H12O6'), sp('O2')], rc: [6, 6], pc: [1, 6] },
    { name: 'aluminium + oxygen', r: [sp('Al'), sp('O2')], p: [sp('Al2O3')], rc: [4, 3], pc: [2] },
    { name: 'Haber process', r: [sp('N2'), sp('H2')], p: [sp('NH3')], rc: [1, 3], pc: [2] },
    { name: 'neutralisation', r: [sp('Ca(OH)2'), sp('HCl')], p: [sp('CaCl2'), sp('H2O')], rc: [1, 2], pc: [1, 2] },
    { name: 'ionic with charge: Fe3+ + 3e- -> Fe', r: [sp('Fe', { charge: 3 }), sp('e-', { isElectron: true, charge: -1 })], p: [sp('Fe')], rc: [1, 3], pc: [1] },
    { name: 'ionic with charge: Zn + 2Ag+ -> Zn2+ + 2Ag', r: [sp('Zn'), sp('Ag', { charge: 1 })], p: [sp('Zn', { charge: 2 }), sp('Ag')], rc: [1, 2], pc: [1, 2] },
  ];

  for (const e of equations) {
    it(`balanced: ${e.name}`, () => {
      const L = side(e.r, e.rc); const R = side(e.p, e.pc);
      expect(L.atoms).toEqual(R.atoms); expect(L.charge).toBe(R.charge); // oracle self-check
      const res = evaluateEquationBalance(e.r, e.p, e.rc, e.pc);
      expect(res.isAtomsBalanced).toBe(true);
      expect(res.isChargeBalanced).toBe(true);
      expect(res.isBalanced).toBe(true);
      expect(res.isSimplestRatio).toBe(true);
    });
    it(`any single-coefficient error is detected: ${e.name}`, () => {
      const rc = [...e.rc]; rc[0] += 1;
      const L = side(e.r, rc); const R = side(e.p, e.pc);
      const oracleBalanced = JSON.stringify(Object.entries(L.atoms).sort()) === JSON.stringify(Object.entries(R.atoms).sort()) && L.charge === R.charge;
      expect(evaluateEquationBalance(e.r, e.p, rc, e.pc).isBalanced).toBe(oracleBalanced);
    });
  }

  it('doubling a balanced equation is balanced but NOT simplest ratio', () => {
    const e = equations[0];
    const res = evaluateEquationBalance(e.r, e.p, e.rc.map((c) => c * 2), e.pc.map((c) => c * 2));
    expect(res.isBalanced).toBe(true);
    expect(res.isSimplestRatio).toBe(false);
  });

  it('atoms balanced but charge not balanced is reported as unbalanced', () => {
    const res = evaluateEquationBalance([sp('Zn'), sp('Ag', { charge: 1 })], [sp('Zn', { charge: 2 }), sp('Ag')], [1, 1], [1, 1]);
    expect(res.isChargeBalanced).toBe(false);
    expect(res.isBalanced).toBe(false);
  });
});

// ---------------- biology ----------------
describe('genetic code and sequence models', () => {
  it('standard code has 64 codons: 61 sense + 3 stop, with the published degeneracy of each amino acid', () => {
    const codons = Object.keys(STANDARD_GENETIC_CODE);
    expect(codons).toHaveLength(64);
    expect(new Set(codons).size).toBe(64);
    expect(codons.every((c) => /^[ACGU]{3}$/.test(c))).toBe(true);
    const tally: Record<string, number> = {};
    for (const aa of Object.values(STANDARD_GENETIC_CODE)) tally[aa] = (tally[aa] ?? 0) + 1;
    expect(tally).toEqual({
      STOP: 3, Leu: 6, Ser: 6, Arg: 6, Ala: 4, Gly: 4, Pro: 4, Thr: 4, Val: 4, Ile: 3,
      Phe: 2, Tyr: 2, His: 2, Gln: 2, Asn: 2, Lys: 2, Asp: 2, Glu: 2, Cys: 2, Met: 1, Trp: 1,
    });
  });
  it('landmark codons', () => {
    const c = STANDARD_GENETIC_CODE;
    expect([c.AUG, c.UGG, c.UAA, c.UAG, c.UGA, c.UUU, c.GGG, c.AAA, c.CAU]).toEqual(['Met', 'Trp', 'STOP', 'STOP', 'STOP', 'Phe', 'Gly', 'Lys', 'His']);
  });
  it('base pairing and transcription (A-T, C-G; template DNA -> mRNA with U)', () => {
    expect(computeExpectedDnaComplement(['A', 'T', 'C', 'G'])).toEqual(['T', 'A', 'G', 'C']);
    expect(computeExpectedMrnaFromTemplate(['T', 'A', 'C', 'T', 'T', 'T'])).toEqual(['A', 'U', 'G', 'A', 'A', 'A']);
  });
  it('translation stops at the first stop codon and assigns no amino acid to or after it', () => {
    const r = translateMrnaCodons('AUGUUUUAAGGG'.split(''));
    expect(r.aminoAcids).toEqual(['Met', 'Phe']);
    expect(r.terminatedAtStop).toBe(true);
    expect(r.stopCodonIndex).toBe(2);
  });
  it('trailing incomplete codon is ignored', () => {
    expect(translateMrnaCodons('AUGUU'.split('')).codons).toEqual(['AUG']);
  });
  it('monohybrid Punnett ratios (hand-worked)', () => {
    const hetero = computeMonohybridPunnett('Aa', 'Aa', 'A');
    expect(hetero.genotypeProbabilities).toEqual({ AA: 25, Aa: 50, aa: 25 });
    expect(hetero.dominantProbabilityPct).toBe(75);
    expect(computeMonohybridPunnett('AA', 'aa', 'A').genotypeProbabilities).toEqual({ Aa: 100 });
    const testcross = computeMonohybridPunnett('Aa', 'aa', 'A');
    expect(testcross.genotypeProbabilities).toEqual({ Aa: 50, aa: 50 });
    expect(testcross.recessiveProbabilityPct).toBe(50);
  });
});
