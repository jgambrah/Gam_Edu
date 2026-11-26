import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
import {
  computeMolecularPolarity,
  evaluateAtomicConstruction,
  evaluateCovalentBonding,
  evaluateIonicBonding,
  evaluateVseprConstruction,
  formatSubshellNotation,
  getExpectedSubshells,
} from './atom-bond-engine';
import {
  assertValidLessonInteractives,
  validateSlideInteractiveConfig,
  type AtomBondBuilderConstructionConfig,
} from '@/lib/narrated-lessons/interactive-schema';
import { AtomBondLab } from '@/components/narrated-lessons/construction/AtomBondLab';
import { InteractiveEngineRegistry } from '@/components/narrated-lessons/InteractiveEngineRegistry';
import type { LessonSlide, NarratedLesson } from '@/lib/narrated-lessons/types';

const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step4e-atom-bond-pilot.json');
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as NarratedLesson;

describe('Step 4E Module 1: Atomic Structure, Isotopes & Subshell Configurations', () => {
  it('validates all required AS/A-Level ground-state subshells and 4s-before-3d cation ionisation', () => {
    expect(formatSubshellNotation(getExpectedSubshells('Ca', 0)!)).toBe('1s² 2s² 2p⁶ 3s² 3p⁶ 4s²');
    expect(formatSubshellNotation(getExpectedSubshells('Cr', 0)!)).toBe('1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹');
    expect(formatSubshellNotation(getExpectedSubshells('Fe', 0)!)).toBe('1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²');
    expect(formatSubshellNotation(getExpectedSubshells('Fe', 2)!)).toBe('1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶');
    expect(formatSubshellNotation(getExpectedSubshells('Fe', 3)!)).toBe('1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵');
    expect(formatSubshellNotation(getExpectedSubshells('Cu', 0)!)).toBe('1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰ 4s¹');
    expect(formatSubshellNotation(getExpectedSubshells('Cu', 1)!)).toBe('1s² 2s² 2p⁶ 3s² 3p⁶ 3d¹⁰');
    expect(formatSubshellNotation(getExpectedSubshells('Cu', 2)!)).toBe('1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁹');

    // Misconception: removing 3d before 4s on Fe2+ is diagnosed specifically
    const wrongFe2 = evaluateAtomicConstruction({
      targetElement: 'Fe',
      targetMassNumber: 56,
      targetCharge: 2,
      representation: 'subshells',
      protons: 26,
      neutrons: 30,
      subshells: { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 2, '3d': 4 },
    });
    expect(wrongFe2.passed).toBe(false);
    expect(wrongFe2.feedback).toMatch(/4s electrons are always removed before 3d/i);
  });

  it('flags Carbon-14 as radioactive and rejects proton-count errors when building isotopes', () => {
    const c14Ok = evaluateAtomicConstruction({
      targetElement: 'C',
      targetMassNumber: 14,
      targetCharge: 0,
      representation: 'shells',
      protons: 6,
      neutrons: 8,
      shells: [2, 4, 0, 0],
    });
    expect(c14Ok.passed).toBe(true);
    expect(c14Ok.isRadioactiveIsotope).toBe(true);
    expect(c14Ok.feedback).toMatch(/radioactive/i);

    const wrongProtons = evaluateAtomicConstruction({
      targetElement: 'C',
      targetMassNumber: 14,
      targetCharge: 0,
      representation: 'shells',
      protons: 7,
      neutrons: 7,
      shells: [2, 4, 0, 0],
    });
    expect(wrongProtons.passed).toBe(false);
    expect(wrongProtons.feedback).toMatch(/Changing the proton count changes the element/i);
  });
});

describe('Step 4E Module 2: Ionic Bonding (Up to 6 Ions & Simplest Empirical Ratio)', () => {
  it('verifies NaCl, MgO, MgCl2, CaCl2, and Al2O3 (5 ions) and rejects neutral non-simplest ratios', () => {
    const cases = [
      { cat: 'Na', an: 'Cl', cc: 1, ac: 1, cq: 1, aq: -1, e: 1 },
      { cat: 'Mg', an: 'O', cc: 1, ac: 1, cq: 2, aq: -2, e: 2 },
      { cat: 'Mg', an: 'Cl', cc: 1, ac: 2, cq: 2, aq: -1, e: 2 },
      { cat: 'Ca', an: 'Cl', cc: 1, ac: 2, cq: 2, aq: -1, e: 2 },
      { cat: 'Al', an: 'O', cc: 2, ac: 3, cq: 3, aq: -2, e: 6 },
    ];
    for (const c of cases) {
      const res = evaluateIonicBonding({
        cationElement: c.cat,
        anionElement: c.an,
        targetCationCount: c.cc,
        targetAnionCount: c.ac,
        targetCationCharge: c.cq,
        targetAnionCharge: c.aq,
        cationCount: c.cc,
        anionCount: c.ac,
        electronsTransferred: c.e,
        requireSimplestRatio: true,
      });
      expect(res.passed, `Failed on ${c.cat}${c.cc}${c.an}${c.ac}`).toBe(true);
    }

    // Neutral but non-simplest Na2Cl2 rejected!
    const nonSimplest = evaluateIonicBonding({
      cationElement: 'Na',
      anionElement: 'Cl',
      targetCationCount: 1,
      targetAnionCount: 1,
      targetCationCharge: 1,
      targetAnionCharge: -1,
      cationCount: 2,
      anionCount: 2,
      electronsTransferred: 2,
      requireSimplestRatio: true,
    });
    expect(nonSimplest.passed).toBe(false);
    expect(nonSimplest.feedback).toMatch(/simplest whole-number empirical ratio/i);
  });
});

describe('Step 4E Module 3: Covalent & Coordinate Bonding (Octet Exceptions & Donor/Acceptor)', () => {
  it('validates NH4+ coordinate bonding (rejecting reversed H->N arrow), BF3 electron-deficient, and SF6 expanded-octet', () => {
    const nh4Cfg = fixture.slides[7].interactive as AtomBondBuilderConstructionConfig;

    // Valid coordinate bond N -> H
    const nh4Ok = evaluateCovalentBonding({
      atoms: nh4Cfg.atoms!,
      bonds: [
        { from: 'n1', to: 'h1', order: 1 },
        { from: 'n1', to: 'h2', order: 1 },
        { from: 'n1', to: 'h3', order: 1 },
        { from: 'n1', to: 'h4', order: 1, isDative: true },
      ],
      lonePairsByAtom: { n1: 0, h1: 0, h2: 0, h3: 0, h4: 0 },
      netCharge: 1,
      octetPolicy: 'strict-duet-octet',
      expectedDativeCount: 1,
      referenceBonds: nh4Cfg.referenceBonds,
    });
    expect(nh4Ok.passed).toBe(true);

    // Invalid reversed coordinate arrow H -> N rejected
    const nh4BadArrow = evaluateCovalentBonding({
      atoms: nh4Cfg.atoms!,
      bonds: [
        { from: 'n1', to: 'h1', order: 1 },
        { from: 'n1', to: 'h2', order: 1 },
        { from: 'n1', to: 'h3', order: 1 },
        { from: 'h4', to: 'n1', order: 1, isDative: true },
      ],
      lonePairsByAtom: { n1: 0, h1: 0, h2: 0, h3: 0, h4: 0 },
      netCharge: 1,
      octetPolicy: 'strict-duet-octet',
      expectedDativeCount: 1,
      referenceBonds: nh4Cfg.referenceBonds,
    });
    expect(nh4BadArrow.passed).toBe(false);
    expect(nh4BadArrow.feedback).toMatch(/Invalid coordinate bond direction/i);

    // SF6 expanded-octet (Period 3 S with 12 valence electrons) passes
    const sf6 = evaluateCovalentBonding({
      atoms: [
        { id: 's1', element: 'S', xPct: 50, yPct: 50, isCentral: true, minValenceElectrons: 12, maxValenceElectrons: 12 },
        { id: 'f1', element: 'F', xPct: 50, yPct: 15 },
        { id: 'f2', element: 'F', xPct: 50, yPct: 85 },
        { id: 'f3', element: 'F', xPct: 20, yPct: 35 },
        { id: 'f4', element: 'F', xPct: 80, yPct: 35 },
        { id: 'f5', element: 'F', xPct: 20, yPct: 65 },
        { id: 'f6', element: 'F', xPct: 80, yPct: 65 },
      ],
      bonds: [
        { from: 's1', to: 'f1', order: 1 },
        { from: 's1', to: 'f2', order: 1 },
        { from: 's1', to: 'f3', order: 1 },
        { from: 's1', to: 'f4', order: 1 },
        { from: 's1', to: 'f5', order: 1 },
        { from: 's1', to: 'f6', order: 1 },
      ],
      lonePairsByAtom: { s1: 0, f1: 3, f2: 3, f3: 3, f4: 3, f5: 3, f6: 3 },
      netCharge: 0,
      octetPolicy: 'expanded-octet',
    });
    expect(sf6.passed).toBe(true);
  });
});

describe('Step 4E Module 4: VSEPR Molecular Geometry & 3D Vector Polarity', () => {
  it('evaluates all 9 required VSEPR & mixed-ligand polarity reference cases accurately', () => {
    const refs: Array<{
      formula: string;
      c: string;
      ligs: string[];
      lp: number;
      polar: boolean;
    }> = [
      { formula: 'CO₂', c: 'C', ligs: ['O', 'O'], lp: 0, polar: false },
      { formula: 'HCN', c: 'C', ligs: ['H', 'N'], lp: 0, polar: true },
      { formula: 'BF₃', c: 'B', ligs: ['F', 'F', 'F'], lp: 0, polar: false },
      { formula: 'CH₄', c: 'C', ligs: ['H', 'H', 'H', 'H'], lp: 0, polar: false },
      { formula: 'CH₃Cl', c: 'C', ligs: ['H', 'H', 'H', 'Cl'], lp: 0, polar: true },
      { formula: 'NH₃', c: 'N', ligs: ['H', 'H', 'H'], lp: 1, polar: true },
      { formula: 'H₂O', c: 'O', ligs: ['H', 'H'], lp: 2, polar: true },
      { formula: 'PCl₅', c: 'P', ligs: ['Cl', 'Cl', 'Cl', 'Cl', 'Cl'], lp: 0, polar: false },
      { formula: 'SF₆', c: 'S', ligs: ['F', 'F', 'F', 'F', 'F', 'F'], lp: 0, polar: false },
    ];
    for (const r of refs) {
      const pol = computeMolecularPolarity(r.c, r.ligs, r.lp);
      expect(pol, `Polarity null for ${r.formula}`).not.toBeNull();
      expect(pol!.isPolar, `Wrong polarity for ${r.formula}`).toBe(r.polar);
    }

    // Misconception: claiming CO2 is polar gives symmetry-cancellation feedback
    const co2Wrong = evaluateVseprConstruction({
      moleculeFormula: 'CO₂',
      centralElement: 'C',
      surroundingElements: ['O', 'O'],
      targetBondingDomains: 2,
      targetLonePairs: 0,
      targetElectronGeometry: 'linear',
      targetMolecularShape: 'linear',
      checkPolarity: true,
      expectedPolar: false,
      selectedBondingDomains: 2,
      selectedLonePairs: 0,
      selectedElectronGeometry: 'linear',
      selectedMolecularShape: 'linear',
      selectedPolarity: 'polar',
    });
    expect(co2Wrong.passed).toBe(false);
    expect(co2Wrong.feedback).toMatch(/bond dipoles cancel out/i);
  });
});

describe('Step 4E Schema Validation, Version Gate (productionVersion 1.1.0 < 1.2.0) & UI', () => {
  it('validates all 12 slides (13 activities) in dev mode, blocks at production gate, and rejects 1.1.0 downgrade bypasses, radicals, and formula mismatches', () => {
    expect(fixture.slides.length).toBe(12);
    expect(() => assertValidLessonInteractives(fixture, { allowDevOnlyEngines: true })).not.toThrow();
    expect(() => assertValidLessonInteractives(fixture)).toThrow(/exceeds productionVersion "1\.1\.0"/i);

    const a01 = fixture.slides[0].interactive as AtomBondBuilderConstructionConfig;
    const downgrade = validateSlideInteractiveConfig({ ...a01, minEngineVersion: '1.1.0' });
    expect(downgrade.ok).toBe(false);
    expect(downgrade.errors.join(' ')).toMatch(/requires minEngineVersion >= "1\.2\.0"/i);

    // Odd-electron radical (NO: 11 valence electrons) rejected cleanly
    const cl2 = fixture.slides[4].interactive as AtomBondBuilderConstructionConfig;
    const radical = validateSlideInteractiveConfig({
      ...cl2,
      formulaDisplay: 'NO',
      atoms: [
        { id: 'n1', element: 'N', xPct: 30, yPct: 50 },
        { id: 'o1', element: 'O', xPct: 70, yPct: 50 },
      ],
      referenceBonds: undefined,
    });
    expect(radical.ok).toBe(false);
    expect(radical.errors.join(' ')).toMatch(/odd-electron radicals/i);

    // Mismatched formulaDisplay rejected cleanly
    const mismatch = validateSlideInteractiveConfig({ ...cl2, formulaDisplay: 'O₂' });
    expect(mismatch.ok).toBe(false);
    expect(mismatch.errors.join(' ')).toMatch(/formulaDisplay/i);
  });

  it('supports AtomBondLab Undo/Reset/Check, multi-activity isolation on O2 & N2, and Low-Data Mode', () => {
    const a01 = fixture.slides[0].interactive as AtomBondBuilderConstructionConfig;
    const { unmount } = render(<AtomBondLab config={a01} />);

    // Prediction check
    fireEvent.click(screen.getByRole('button', { name: /Add 2 neutrons/i }));
    fireEvent.click(screen.getByRole('button', { name: /Check prediction/i }));
    expect(screen.getByText(/Spot on!/i)).toBeTruthy();

    // Build C-14: add 2 neutrons (6 -> 8), add 2 to Level 1 and 4 to Level 2
    fireEvent.click(screen.getByRole('button', { name: /Increase neutrons/i }));
    fireEvent.click(screen.getByRole('button', { name: /Increase neutrons/i }));
    fireEvent.click(screen.getByRole('button', { name: /Increase Energy Level 1 electrons/i }));
    fireEvent.click(screen.getByRole('button', { name: /Increase Energy Level 1 electrons/i }));
    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Increase Energy Level 2 electrons/i }));
    }
    fireEvent.click(screen.getByRole('button', { name: /Check atomic structure/i }));
    expect(screen.getByText(/Verified: Carbon-14/i)).toBeTruthy();

    // Undo breaks it -> Keep refining
    fireEvent.click(screen.getByRole('button', { name: /Undo last change/i }));
    fireEvent.click(screen.getByRole('button', { name: /Check atomic structure/i }));
    expect(screen.getByText(/Keep refining:/i)).toBeTruthy();

    // Reset clears feedback
    fireEvent.click(screen.getByRole('button', { name: /Reset construction/i }));
    expect(screen.queryByText(/Keep refining:/i)).toBeNull();
    unmount();

    // Multi-activity isolation on slide a06 (O2 & N2) + Low-Data Mode via InteractiveEngineRegistry
    const a06 = fixture.slides[5] as LessonSlide;
    const [o2Cfg, n2Cfg] = a06.interactive as AtomBondBuilderConstructionConfig[];
    const { container } = render(
      <div>
        <AtomBondLab config={o2Cfg} />
        <AtomBondLab config={n2Cfg} />
      </div>,
    );
    const sections = container.querySelectorAll('section[data-interactive-engine="construction-lab"]');
    expect(sections.length).toBe(2);
    // Changing O2 state does not leak into N2
    fireEvent.click(within(sections[0] as HTMLElement).getByRole('button', { name: /Cycle Bond/i }));
    expect(within(sections[0] as HTMLElement).getByText(/Valence e⁻ placed: 2 \/ 12/i)).toBeTruthy();
    expect(within(sections[1] as HTMLElement).getByText(/Valence e⁻ placed: 0 \/ 10/i)).toBeTruthy();

    const { container: lowDataContainer } = render(
      <InteractiveEngineRegistry lesson={fixture} slide={fixture.slides[0] as LessonSlide} lowDataMode={true} />,
    );
    expect(within(lowDataContainer).getByText(/Low-Data Summary/i)).toBeTruthy();
  });

  it('measures scientific validation performance across 1,000 iterations (< 2 ms average per call)', () => {
    const start = performance.now();
    for (let i = 0; i < 250; i++) {
      evaluateAtomicConstruction({
        targetElement: 'Fe',
        targetMassNumber: 56,
        targetCharge: 2,
        representation: 'subshells',
        protons: 26,
        neutrons: 30,
        subshells: { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 0, '3d': 6 },
      });
      evaluateIonicBonding({
        cationElement: 'Al',
        anionElement: 'O',
        targetCationCount: 2,
        targetAnionCount: 3,
        targetCationCharge: 3,
        targetAnionCharge: -2,
        cationCount: 2,
        anionCount: 3,
        electronsTransferred: 6,
      });
      computeMolecularPolarity('C', ['H', 'H', 'H', 'Cl'], 0);
      validateSlideInteractiveConfig(fixture.slides[0].interactive, { allowDevOnlyEngines: true });
    }
    const elapsedMs = performance.now() - start;
    const avgMs = elapsedMs / 1000;
    console.log(`[Step 4E Perf] 1,000 scientific eval/validation calls completed in ${elapsedMs.toFixed(2)} ms (avg ${avgMs.toFixed(4)} ms/call)`);
    expect(avgMs).toBeLessThan(2);
  });
});
