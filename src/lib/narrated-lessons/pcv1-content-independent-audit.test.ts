/**
 * Content audit (CP3): checks the TARGETS authored in the real PCV-1 Refinement-3 lesson JSONs against independent
 * chemistry, not just that the engines run. Engine correctness is covered by chemistry-independent-oracle.test.ts.
 */
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { APPROVED_ELEMENTS, getElementBySymbol } from '../construction-lab/atom-bond-atomic';
import { computeMolecularPolarity, lookupVseprEntry } from '../construction-lab/atom-bond-vsepr';
import { evaluateCovalentBonding } from '../construction-lab/atom-bond-covalent';
import { independentSolve, parseF } from '../construction-lab/chemistry-oracle-helpers';

const DIR = path.resolve('src/lib/narrated-lessons/__fixtures__/pcv1-refinement3');
const lessons = fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => ({ f, lesson: JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) }));

/** every construction-lab activity, with each `examples[]` entry merged over its parent so examples are audited as activities too */
function activities(): any[] {
  const out: any[] = [];
  const walk = (o: any, where: string) => {
    if (Array.isArray(o)) return o.forEach((x) => walk(x, where));
    if (o && typeof o === 'object') {
      if (o.engine === 'construction-lab' && o.labKind) {
        out.push({ ...o, __id: o.id, __where: where });
        for (const ex of o.examples ?? []) out.push({ ...o, ...ex, __id: `${o.id}/${ex.id}`, __where: where, __isExample: true });
      }
      for (const v of Object.values(o)) walk(v, where);
    }
  };
  for (const { f, lesson } of lessons) walk(lesson, f);
  return out;
}
const ALL = activities();
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const SUB: Record<string, string> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
const asciiFormula = (s: string) => s.replace(/[₀-₉]/g, (c) => SUB[c]);

describe('PCV-1 lesson content: independent target verification', () => {
  it('finds the enriched activities to audit', () => {
    expect(lessons.length).toBe(2);
    expect(ALL.length).toBeGreaterThan(20);
  });

  describe('atomic-structure targets', () => {
    for (const a of ALL.filter((x) => x.labKind === 'atom-bond-builder' && x.mode === 'atomic-structure' && x.targetElement)) {
      it(`${a.__id}: ${a.targetElement}-${a.targetMassNumber} charge ${a.targetCharge} is a real, supported species`, () => {
        const el = getElementBySymbol(a.targetElement);
        expect(el, 'element approved').toBeTruthy();
        if (!a.allowHypotheticalIsotope) expect(el!.isotopes.map((i) => i.massNumber), `${a.targetElement}-${a.targetMassNumber}`).toContain(a.targetMassNumber);
        expect(el!.supportedCharges, 'charge supported for this element').toContain(a.targetCharge ?? 0);
        if (typeof a.initialProtons === 'number' && a.lockNucleus) expect(a.initialProtons, 'locked nucleus must match target Z').toBe(el!.z);
        if (typeof a.initialNeutrons === 'number' && a.lockNucleus) expect(a.initialProtons + a.initialNeutrons, 'A = Z + N').toBe(a.targetMassNumber);
      });
    }
  });

  describe('ionic-bonding targets', () => {
    for (const a of ALL.filter((x) => x.mode === 'ionic-bonding' && x.cationElement)) {
      it(`${a.__id}: ${a.cationElement}${a.targetCationCharge}+ / ${a.anionElement}${a.targetAnionCharge}-`, () => {
        const cat = getElementBySymbol(a.cationElement)!; const an = getElementBySymbol(a.anionElement)!;
        expect(cat.isMetal, 'cation is a metal').toBe(true); expect(an.isNonMetal, 'anion is a non-metal').toBe(true);
        expect(cat.supportedCharges).toContain(a.targetCationCharge); expect(an.supportedCharges).toContain(a.targetAnionCharge);
        // charge from group number: groups 1,2,13 -> +g (g-10 for 13); non-metals 16,17 -> -(18-g)
        const cG = cat.group === 13 ? 3 : cat.group; const aG = 18 - an.group;
        expect(a.targetCationCharge, 'cation charge from group').toBe(cG); expect(Math.abs(a.targetAnionCharge), 'anion charge from group').toBe(aG);
        const g = gcd(a.targetCationCharge, Math.abs(a.targetAnionCharge));
        expect(a.targetCationCount, 'simplest ratio (cation)').toBe(Math.abs(a.targetAnionCharge) / g);
        expect(a.targetAnionCount, 'simplest ratio (anion)').toBe(a.targetCationCharge / g);
      });
    }
  });

  describe('covalent-bonding references are achievable Lewis structures', () => {
    for (const a of ALL.filter((x) => x.mode === 'covalent-bonding' && x.referenceBonds)) {
      it(`${a.__id} ${a.formulaDisplay ?? ''}`, () => {
        const bondOrder: Record<string, number> = {};
        for (const b of a.referenceBonds) { bondOrder[b.from] = (bondOrder[b.from] ?? 0) + b.order; bondOrder[b.to] = (bondOrder[b.to] ?? 0) + b.order; }
        const lp: Record<string, number> = {};
        for (const at of a.atoms) {
          const el = getElementBySymbol(at.element)!;
          const free = el.valenceElectrons - (bondOrder[at.id] ?? 0) - (a.netCharge && at.isCentral ? 0 : 0);
          lp[at.id] = Math.max(0, Math.floor(free / 2));
        }
        const r = evaluateCovalentBonding({ atoms: a.atoms, bonds: a.referenceBonds, lonePairsByAtom: lp, netCharge: a.netCharge ?? 0, octetPolicy: a.octetPolicy ?? 'strict-duet-octet', expectedDativeCount: a.referenceBonds.filter((b: any) => b.isDative).length || undefined });
        expect(r.passed, `${a.__id}: ${r.feedback}`).toBe(true);
        // independent total valence count
        const total = a.atoms.reduce((s: number, at: any) => s + APPROVED_ELEMENTS[at.element].valenceElectrons, 0) - (a.netCharge ?? 0);
        expect(r.totalValenceAvailable).toBe(total);
      });
    }
  });

  describe('molecular-geometry targets (idealised model) match VSEPR and independent polarity', () => {
    const KNOWN_POLAR: Record<string, boolean> = { CH4: false, CO2: false, NH3: true, H2O: true, PCl5: false, SF6: false, CCl4: false, BF3: false, SO2: true, H2S: true, CH3Cl: true };
    for (const a of ALL.filter((x) => x.mode === 'molecular-geometry' && x.centralElement)) {
      it(`${a.__id} ${a.moleculeFormula}`, () => {
        const e = lookupVseprEntry(a.targetBondingDomains, a.targetLonePairs);
        expect(e, 'supported domain combination').toBeTruthy();
        expect(a.targetElectronGeometry).toBe(e!.electronGeometry);
        expect(a.targetMolecularShape).toBe(e!.molecularShape);
        expect(a.surroundingElements.length, 'ligand list length equals bonding domains').toBe(a.targetBondingDomains);
        const label: string = a.targetBondAngleLabel ?? '';
        if (e!.molecularShape === 'linear') expect(label).toContain('180');
        if (e!.molecularShape === 'trigonal-planar') expect(label).toContain('120');
        if (e!.molecularShape === 'tetrahedral') expect(label).toContain('109.5');
        if (a.checkPolarity) {
          const pol = computeMolecularPolarity(a.centralElement, a.surroundingElements, a.targetLonePairs);
          expect(pol, 'polarity computable').not.toBeNull();
          expect(a.expectedPolar, 'authored expectedPolar equals engine polarity').toBe(pol!.isPolar);
          const key = asciiFormula(String(a.moleculeFormula));
          if (key in KNOWN_POLAR) expect(a.expectedPolar, `${key} textbook polarity`).toBe(KNOWN_POLAR[key]);
        }
      });
    }
  });

  describe('equation-balancer: authored equations are solvable and the explanation coefficients are correct', () => {
    const coeffFromText = (side: string) => side.split('+').map((t) => { const m = t.trim().match(/^(\d+)?\s*(.+)$/); return { c: m && m[1] ? +m[1] : 1, f: asciiFormula(m ? m[2].trim() : t.trim()) }; });
    for (const a of ALL.filter((x) => x.labKind === 'equation-balancer' && x.reactants && x.products)) {
      it(`${a.__id}`, () => {
        const R = a.reactants; const P = a.products;
        const sol = independentSolve(R, P);
        expect(sol, `no positive integer solution for ${R.map((s: any) => s.formula).join('+')} -> ${P.map((s: any) => s.formula).join('+')}`).not.toBeNull();
        expect(Math.max(...sol!), 'within the coefficient bound').toBeLessThanOrEqual(a.maxCoefficient ?? 12);
        // atom parser sanity on each species
        for (const s of [...R, ...P]) expect(Object.keys(parseF(s.formula)).length).toBeGreaterThan(0);
        const text: string | undefined = a.successExplanation;
        const m = text && asciiFormula(text).match(/([^.]*→[^.]*)/);
        if (m) {
          const [l, r] = m[1].split('→').map((s) => s.trim().replace(/^[^0-9A-Z]*/, ''));
          const lt = coeffFromText(l); const rt = coeffFromText(r.replace(/\s*(conserves.*)$/, ''));
          if (lt.length === R.length && rt.length === P.length && [...lt, ...rt].every((t, i) => t.f === asciiFormula([...R, ...P][i].formula))) {
            expect([...lt, ...rt].map((t) => t.c), `explanation text coefficients for ${a.__id}`).toEqual(sol);
          }
        }
      });
    }
  });
});
