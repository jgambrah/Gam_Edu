/**
 * @jest-environment jsdom
 */

import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import fs from 'node:fs';
import { AtomBondLab } from '@/components/narrated-lessons/construction/AtomBondLab';
import { EquationBalancerLab } from '@/components/narrated-lessons/construction/EquationBalancerLab';
import {
  evaluateAtomicConstruction,
  evaluateFreeAtomicExploration,
  evaluateIonicBonding,
  evaluateCovalentBonding,
  evaluateVseprConstruction,
} from '@/lib/construction-lab/atom-bond-engine';
import { evaluateEquationBalance } from '@/lib/construction-lab/stoichiometry-engine';
import {
  SUPPORTED_INTERACTIVE_ENGINES,
  assertValidLessonInteractives,
  validateSlideInteractiveConfig,
  type AtomBondBuilderConstructionConfig,
  type EquationBalancerConstructionConfig,
} from '@/lib/narrated-lessons/interactive-schema';

describe('PCV-1 Refinement 3: Atomic Scientific Validation (Section 3)', () => {
  it('never certifies unsupported ions as verified ground-state configs in shells mode', () => {
    // Carbon 2+ (6p, 6n, 4e -> [2, 2, 0, 0]): simplified filling matches 4e, but C2+ is NOT a supported ion
    const res = evaluateFreeAtomicExploration({
      protons: 6,
      neutrons: 6,
      representation: 'shells',
      shells: [2, 2, 0, 0],
      maxZ: 20,
    });
    expect(res.passed).toBe(false);
    expect(res.evaluationTier).toBe('unverified-consistent');
    expect(res.status).toBe('unverified-ion');
    expect(res.isCommonIon).toBe(false);
    expect(res.isGroundStateConfig).toBe(false);
  });

  it('distinguishes verified vs unverified-consistent (unlisted isotope) vs incorrect in both model and UI', () => {
    const unverifiedIso = evaluateFreeAtomicExploration({
      protons: 6,
      neutrons: 14, // C-20 (unlisted isotope)
      representation: 'shells',
      shells: [2, 4, 0, 0],
      maxZ: 20,
    });
    expect(unverifiedIso.passed).toBe(false);
    expect(unverifiedIso.evaluationTier).toBe('unverified-consistent');
    expect(unverifiedIso.status).toBe('unverified-isotope');

    const cfg: AtomBondBuilderConstructionConfig = {
      id: 'ref3-atomic-ui-tier',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'atomic-structure',
      representation: 'shells',
      interactionMode: 'free-exploration',
      allowElementSelector: true,
      maxElementZ: 20,
      initialProtons: 6,
      initialNeutrons: 14,
      initialElectrons: 6,
      schemaVersion: 1,
      minEngineVersion: '1.8.0',
      curriculumLevel: 'introductory',
      title: 'Atomic Tier Test',
      instructions: 'Explore isotopes and ions.',
      accessibilityLabel: 'Atomic tier test',
      fallbackText: 'Fallback',
    };
    render(<AtomBondLab config={cfg} />);
    fireEvent.click(screen.getByRole('button', { name: /Check atomic structure/i }));
    const banner = screen.getByRole('status');
    expect(banner.getAttribute('data-construction-feedback')).toBe('unverified');
    expect(banner.textContent).toMatch(/Unverified construction:/i);
  });

  it('explains Helium (Z=2) 2 outer electrons duet exception in Group 18', () => {
    const res = evaluateFreeAtomicExploration({
      protons: 2,
      neutrons: 2,
      representation: 'shells',
      shells: [2, 0, 0, 0],
      maxZ: 20,
    });
    expect(res.passed).toBe(true);
    expect(res.evaluationTier).toBe('verified');
    expect(res.groupPeriodNote).toMatch(/Group 18/i);
    expect(res.groupPeriodNote).toMatch(/2 outer electrons/i);
    expect(res.groupPeriodNote).toMatch(/duet/i);
  });

  it('enforces strict input validation in both evaluateFreeAtomicExploration and evaluateAtomicConstruction', () => {
    // Bad representation
    expect(
      evaluateFreeAtomicExploration({
        protons: 6,
        neutrons: 6,
        representation: 'orbitals' as 'shells',
        shells: [2, 4, 0, 0],
      }).status,
    ).toBe('invalid-input');

    // Out-of-bounds maxZ
    expect(
      evaluateFreeAtomicExploration({
        protons: 6,
        neutrons: 6,
        representation: 'shells',
        shells: [2, 4, 0, 0],
        maxZ: 25,
      }).status,
    ).toBe('invalid-input');

    // Wrong shell array length
    expect(
      evaluateAtomicConstruction({
        targetElement: 'C',
        targetMassNumber: 12,
        targetCharge: 0,
        representation: 'shells',
        protons: 6,
        neutrons: 6,
        shells: [2, 4],
      }).passed,
    ).toBe(false);

    // Unknown subshell key
    expect(
      evaluateAtomicConstruction({
        targetElement: 'C',
        targetMassNumber: 12,
        targetCharge: 0,
        representation: 'subshells',
        protons: 6,
        neutrons: 6,
        subshells: { '1s': 2, '2s': 2, '2p': 2, '3s': 0, '3p': 0, '4s': 0, '3d': 0, '4p': 0 } as unknown as Record<'1s' | '2s' | '2p' | '3s' | '3p' | '4s' | '3d', number>,
      }).passed,
    ).toBe(false);
  });
});

describe('PCV-1 Refinement 3: Dynamic Playgrounds, Explore Further & Capability Gate', () => {
  it('supports selectable Ionic Bonding bank (NaCl, MgO, MgCl2, CaCl2, Al2O3) and rejects non-simplest/unconserved transfer', () => {
    const ionicCases = [
      { c: 'Na', a: 'Cl', cc: 1, ac: 1, cq: 1, aq: -1, e: 1 },
      { c: 'Mg', a: 'O', cc: 1, ac: 1, cq: 2, aq: -2, e: 2 },
      { c: 'Mg', a: 'Cl', cc: 1, ac: 2, cq: 2, aq: -1, e: 2 },
      { c: 'Ca', a: 'Cl', cc: 1, ac: 2, cq: 2, aq: -1, e: 2 },
      { c: 'Al', a: 'O', cc: 2, ac: 3, cq: 3, aq: -2, e: 6 },
    ];
    for (const tc of ionicCases) {
      const ok = evaluateIonicBonding({
        cationElement: tc.c,
        anionElement: tc.a,
        targetCationCount: tc.cc,
        targetAnionCount: tc.ac,
        targetCationCharge: tc.cq,
        targetAnionCharge: tc.aq,
        cationCount: tc.cc,
        anionCount: tc.ac,
        electronsTransferred: tc.e,
        requireSimplestRatio: true,
      });
      expect(ok.passed).toBe(true);
    }
    // Reject non-simplest ratio Na2Cl2
    expect(
      evaluateIonicBonding({
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
      }).passed,
    ).toBe(false);
  });

  it('supports selectable Covalent bank (H2, O2, N2, H2O, CO2, CH4, NH3) and rejects invalid structures', () => {
    // N2 triple bond + 1 LP each passes
    const n2Ok = evaluateCovalentBonding({
      atoms: [
        { id: 'N1', element: 'N', xPct: 30, yPct: 50 },
        { id: 'N2', element: 'N', xPct: 70, yPct: 50 },
      ],
      bonds: [{ from: 'N1', to: 'N2', order: 3 }],
      lonePairsByAtom: { N1: 1, N2: 1 },
      netCharge: 0,
      octetPolicy: 'strict-duet-octet',
      referenceBonds: [{ from: 'N1', to: 'N2', order: 3 }],
    });
    expect(n2Ok.passed).toBe(true);

    // N2 with single bond fails
    const n2Bad = evaluateCovalentBonding({
      atoms: [
        { id: 'N1', element: 'N', xPct: 30, yPct: 50 },
        { id: 'N2', element: 'N', xPct: 70, yPct: 50 },
      ],
      bonds: [{ from: 'N1', to: 'N2', order: 1 }],
      lonePairsByAtom: { N1: 1, N2: 1 },
      netCharge: 0,
      octetPolicy: 'strict-duet-octet',
      referenceBonds: [{ from: 'N1', to: 'N2', order: 3 }],
    });
    expect(n2Bad.passed).toBe(false);
  });

  it('supports selectable VSEPR bank (CO2, CH4, NH3, H2O, PCl5, SF6)', () => {
    const sf6 = evaluateVseprConstruction({
      moleculeFormula: 'SF₆',
      centralElement: 'S',
      surroundingElements: ['F', 'F', 'F', 'F', 'F', 'F'],
      targetBondingDomains: 6,
      targetLonePairs: 0,
      targetElectronGeometry: 'octahedral',
      targetMolecularShape: 'octahedral',
      checkPolarity: true,
      expectedPolar: false,
      selectedBondingDomains: 6,
      selectedLonePairs: 0,
      selectedElectronGeometry: 'octahedral',
      selectedMolecularShape: 'octahedral',
      selectedPolarity: 'non-polar',
    });
    expect(sf6.passed).toBe(true);
  });

  it('supports selectable Equation Balancer bank including butane (2C4H10 + 13O2 -> 8CO2 + 10H2O) and Explore Further state isolation', () => {
    // Verify butane stoichiometry with maxCoefficient 15
    const butane = evaluateEquationBalance(
      [{ formula: 'C4H10' }, { formula: 'O2' }],
      [{ formula: 'CO2' }, { formula: 'H2O' }],
      [2, 13],
      [8, 10],
      { requireSimplestRatio: true, maxCoefficient: 15 },
    );
    expect(butane.ok).toBe(true);
    expect(butane.isBalanced).toBe(true);
    expect(butane.isSimplestRatio).toBe(true);

    const cfg: EquationBalancerConstructionConfig = {
      id: 'ref3-eq-explore-test',
      engine: 'construction-lab',
      labKind: 'equation-balancer',
      schemaVersion: 1,
      minEngineVersion: '1.9.0',
      title: 'Dynamic Combustion Test',
      instructions: 'Balance equations.',
      accessibilityLabel: 'Dynamic combustion test',
      fallbackText: 'CH4 + 2O2 -> CO2 + 2H2O',
      exploreFurther: true,
      maxCoefficient: 15,
      reactants: [{ formula: 'CH4', display: 'CH₄' }, { formula: 'O2', display: 'O₂' }],
      products: [{ formula: 'CO2', display: 'CO₂' }, { formula: 'H2O', display: 'H₂O' }],
      examples: [
        {
          id: 'ex-ch4',
          label: 'Methane (CH₄)',
          reactants: [{ formula: 'CH4', display: 'CH₄' }, { formula: 'O2', display: 'O₂' }],
          products: [{ formula: 'CO2', display: 'CO₂' }, { formula: 'H2O', display: 'H₂O' }],
        },
        {
          id: 'ex-c3h8',
          label: 'Propane (C₃H₈)',
          reactants: [{ formula: 'C3H8', display: 'C₃H₈' }, { formula: 'O2', display: 'O₂' }],
          products: [{ formula: 'CO2', display: 'CO₂' }, { formula: 'H2O', display: 'H₂O' }],
        },
      ],
    };

    render(<EquationBalancerLab config={cfg} />);
    // Open Explore Further sandbox
    fireEvent.click(screen.getByRole('button', { name: /Explore Further/i }));
    const panel = screen.getByRole('region', { name: /Explore Further sandbox/i });
    // Mutate sandbox by switching to Propane inside sandbox
    fireEvent.click(within(panel).getByRole('tab', { name: /Propane/i }));
    // Close via Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('region', { name: /Explore Further sandbox/i })).toBeNull();
    // Parent exercise remains on Methane untouched
    expect(screen.getByRole('tab', { name: /Methane/i }).getAttribute('aria-selected')).toBe('true');
  });

  it('disables Explore Further when isAssessment is true', () => {
    const cfg: EquationBalancerConstructionConfig = {
      id: 'ref3-eq-assessment',
      engine: 'construction-lab',
      labKind: 'equation-balancer',
      schemaVersion: 1,
      minEngineVersion: '1.9.0',
      title: 'Formal Exam Check',
      instructions: 'Balance equation.',
      accessibilityLabel: 'Formal exam check',
      fallbackText: 'CH4 + 2O2 -> CO2 + 2H2O',
      exploreFurther: true,
      isAssessment: true,
      reactants: [{ formula: 'CH4' }, { formula: 'O2' }],
      products: [{ formula: 'CO2' }, { formula: 'H2O' }],
    };
    render(<EquationBalancerLab config={cfg} />);
    expect(screen.queryByRole('button', { name: /Explore Further/i })).toBeNull();
  });

  it('enforces capability-level production activation without activating unverified sibling domains', () => {
    const dynamicIonicCfg = {
      id: 'gate-ionic-190',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'ionic-bonding',
      curriculumLevel: 'introductory',
      schemaVersion: 1,
      minEngineVersion: '1.9.0',
      title: 'Dynamic Ionic',
      instructions: 'Explore ionic compounds.',
      accessibilityLabel: 'Dynamic ionic',
      fallbackText: 'NaCl',
      cationElement: 'Na',
      anionElement: 'Cl',
      targetCationCount: 1,
      targetAnionCount: 1,
      targetCationCharge: 1,
      targetAnionCharge: -1,
      examples: [
        {
          id: 'nacl',
          label: 'NaCl',
          cationElement: 'Na',
          anionElement: 'Cl',
          targetCationCount: 1,
          targetAnionCount: 1,
          targetCationCharge: 1,
          targetAnionCharge: -1,
        },
      ],
    };

    // 1. Before manual Vercel promotion & activation: MUST BE REJECTED under requireProduction: true
    expect(validateSlideInteractiveConfig(dynamicIonicCfg, { requireProduction: true }).ok).toBe(false);

    // 2. Simulated post-promotion capability activation for atom-bond-builder ONLY:
    const simulatedRegistry = {
      ...SUPPORTED_INTERACTIVE_ENGINES,
      'construction-lab': {
        ...SUPPORTED_INTERACTIVE_ENGINES['construction-lab'],
        productionCapabilities: {
          ...SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].productionCapabilities,
          'construction-lab:atom-bond-builder': '1.9.0',
        },
      },
    };
    expect(
      validateSlideInteractiveConfig(dynamicIonicCfg, {
        requireProduction: true,
        engineRegistry: simulatedRegistry,
      }).ok,
    ).toBe(true);

    // Unverified sibling domain (measurement-lab 1.4.0) MUST STILL BE BLOCKED!
    const measurementCfg = {
      id: 'gate-meas-140',
      engine: 'construction-lab',
      labKind: 'measurement-lab',
      instrument: 'ruler',
      curriculumLevel: 'primary',
      schemaVersion: 1,
      minEngineVersion: '1.4.0',
      title: 'Ruler',
      instructions: 'Measure length.',
      accessibilityLabel: 'Ruler',
      fallbackText: 'Measure',
      unit: 'cm',
      minVal: 0,
      maxVal: 10,
      majorStep: 1,
      minorStep: 0.1,
      targetValue: 4.5,
      tolerance: 0.1,
    };
    expect(
      validateSlideInteractiveConfig(measurementCfg, {
        requireProduction: true,
        engineRegistry: simulatedRegistry,
      }).ok,
    ).toBe(false);
  });

  it('validates both actual PCV-1 Refinement 3 enriched pilot lesson JSONs', () => {
    const base =
      'C:/Users/DELL/.gemini/antigravity/brain/c229576f-28ea-43b0-b4c2-466e9ffcd1e3/scratch/pcv1-impl';
    const b8Path = `${base}/b8-sci-t1-atoms-and-the-periodic-table.refinement3-v1.9.0.json`;
    const hcPath = `${base}/cambridge-as-a-level-chemistry-hydrocarbons.refinement3-v1.9.0.json`;

    if (fs.existsSync(b8Path) && fs.existsSync(hcPath)) {
      const b8 = JSON.parse(fs.readFileSync(b8Path, 'utf8'));
      const hc = JSON.parse(fs.readFileSync(hcPath, 'utf8'));
      expect(() => assertValidLessonInteractives(b8, { allowDevOnlyEngines: true })).not.toThrow();
      expect(() => assertValidLessonInteractives(hc, { allowDevOnlyEngines: true })).not.toThrow();
      // Live production gate must still reject them BEFORE owner manual Vercel promotion!
      expect(() => assertValidLessonInteractives(b8, { allowDevOnlyEngines: false })).toThrow();
      expect(() => assertValidLessonInteractives(hc, { allowDevOnlyEngines: false })).toThrow();
    }
  });
});
