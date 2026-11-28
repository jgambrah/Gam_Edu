/**
 * @jest-environment jsdom
 */

import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import fs from 'node:fs';
import path from 'node:path';
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
  type InteractiveEngineId,
  type InteractiveEngineMeta,
} from '@/lib/narrated-lessons/interactive-schema';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';

function loadRepoJson<T>(relativePath: string): T {
  const fullPath = path.resolve(process.cwd(), relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Required portable test fixture missing: ${relativePath} (${fullPath})`);
  }
  return JSON.parse(fs.readFileSync(fullPath, 'utf8')) as T;
}

const B8_REF3_LESSON = loadRepoJson<NarratedLesson>(
  'src/lib/narrated-lessons/__fixtures__/pcv1-refinement3/b8-sci-t1-atoms-and-the-periodic-table.refinement3-v1.9.0.json',
);
const HC_REF3_LESSON = loadRepoJson<NarratedLesson>(
  'src/lib/narrated-lessons/__fixtures__/pcv1-refinement3/cambridge-as-a-level-chemistry-hydrocarbons.refinement3-v1.9.0.json',
);

function getSlideActivity<T>(lesson: NarratedLesson, slideId: string, activityId: string): T {
  const slide = lesson.slides.find((s) => s.id === slideId);
  if (!slide || !slide.interactive) {
    throw new Error(`Missing slide ${slideId} or interactive in ${lesson.lessonId}`);
  }
  const list = Array.isArray(slide.interactive) ? slide.interactive : [slide.interactive];
  const found = list.find((a) => a.id === activityId);
  if (!found) {
    throw new Error(`Missing activity ${activityId} on slide ${slideId} in ${lesson.lessonId}`);
  }
  return found as unknown as T;
}

function makeScopedChemistryActivatedRegistry(): Record<InteractiveEngineId, InteractiveEngineMeta> {
  return {
    ...SUPPORTED_INTERACTIVE_ENGINES,
    'construction-lab': {
      ...SUPPORTED_INTERACTIVE_ENGINES['construction-lab'],
      productionVersion: '1.3.0',
      productionCapabilities: {
        ...SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].productionCapabilities,
        'construction-lab:atom-bond-builder': '1.9.0',
        'construction-lab:equation-balancer': '1.9.0',
      },
    },
  };
}

describe('PCV-1 Refinement 3: Atomic Scientific Validation (Section 3)', () => {
  it('never certifies unsupported ions as verified ground-state configs in shells mode', () => {
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
      neutrons: 14,
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
    expect(
      evaluateFreeAtomicExploration({
        protons: 6,
        neutrons: 6,
        representation: 'orbitals' as 'shells',
        shells: [2, 4, 0, 0],
      }).status,
    ).toBe('invalid-input');

    expect(
      evaluateFreeAtomicExploration({
        protons: 6,
        neutrons: 6,
        representation: 'shells',
        shells: [2, 4, 0, 0],
        maxZ: 25,
      }).status,
    ).toBe('invalid-input');

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

    expect(
      evaluateAtomicConstruction({
        targetElement: 'C',
        targetMassNumber: 12,
        targetCharge: 0,
        representation: 'subshells',
        protons: 6,
        neutrons: 6,
        subshells: {
          '1s': 2,
          '2s': 2,
          '2p': 2,
          '3s': 0,
          '3p': 0,
          '4s': 0,
          '3d': 0,
          '4p': 0,
        } as unknown as Record<'1s' | '2s' | '2p' | '3s' | '3p' | '4s' | '3d', number>,
      }).passed,
    ).toBe(false);
  });
});

describe('PCV-1 Refinement 3: Strengthened Ionic Electron-Transfer Validation', () => {
  it('validates all five ionic compounds (NaCl, MgO, MgCl2, CaCl2, Al2O3) and distinguishes donor/acceptor/imbalance metrics', () => {
    const cases = [
      { c: 'Na', a: 'Cl', cc: 1, ac: 1, cq: 1, aq: -1, e: 1 },
      { c: 'Mg', a: 'O', cc: 1, ac: 1, cq: 2, aq: -2, e: 2 },
      { c: 'Mg', a: 'Cl', cc: 1, ac: 2, cq: 2, aq: -1, e: 2 },
      { c: 'Ca', a: 'Cl', cc: 1, ac: 2, cq: 2, aq: -1, e: 2 },
      { c: 'Al', a: 'O', cc: 2, ac: 3, cq: 3, aq: -2, e: 6 },
    ];
    for (const tc of cases) {
      const res = evaluateIonicBonding({
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
      expect(res.passed).toBe(true);
      expect(res.electronsAvailableFromMetals).toBe(tc.e);
      expect(res.electronsRequiredByNonMetals).toBe(tc.e);
      expect(res.maxTransferableElectrons).toBe(tc.e);
      expect(res.remainingElectronImbalance).toBe(0);
      expect(res.remainingDonorElectrons).toBe(0);
      expect(res.remainingAcceptorDemand).toBe(0);
      expect(res.isChargeBalanced).toBe(true);
      expect(res.isSimplestRatio).toBe(true);
      expect(res.isImpossibleTransfer).toBe(false);
      expect(res.feedback).toMatch(/extended ionic lattice, not an isolated molecule/i);
    }
  });

  it('rejects impossible excess transfer, insufficient transfer, incorrect ratios, and non-simplest ratios', () => {
    // Incorrect ratio: 1 Mg (+2) + 1 Cl (-1) -> donor available = 2, acceptor required = 1, maxTransferable = 1, imbalance = +1
    const badRatio = evaluateIonicBonding({
      cationElement: 'Mg',
      anionElement: 'Cl',
      targetCationCount: 1,
      targetAnionCount: 2,
      targetCationCharge: 2,
      targetAnionCharge: -1,
      cationCount: 1,
      anionCount: 1,
      electronsTransferred: 1,
      requireSimplestRatio: true,
    });
    expect(badRatio.passed).toBe(false);
    expect(badRatio.electronsAvailableFromMetals).toBe(2);
    expect(badRatio.electronsRequiredByNonMetals).toBe(1);
    expect(badRatio.maxTransferableElectrons).toBe(1);
    expect(badRatio.remainingElectronImbalance).toBe(1);
    expect(badRatio.isChargeBalanced).toBe(false);
    expect(badRatio.isImpossibleTransfer).toBe(false);

    // Impossible excess transfer: trying to transfer 2 electrons into 1 Cl atom (can accept at most 1)
    const impossibleExcess = evaluateIonicBonding({
      cationElement: 'Mg',
      anionElement: 'Cl',
      targetCationCount: 1,
      targetAnionCount: 2,
      targetCationCharge: 2,
      targetAnionCharge: -1,
      cationCount: 1,
      anionCount: 1,
      electronsTransferred: 2,
      requireSimplestRatio: true,
    });
    expect(impossibleExcess.passed).toBe(false);
    expect(impossibleExcess.isImpossibleTransfer).toBe(true);
    expect(impossibleExcess.feedback).toMatch(/Impossible electron transfer/i);

    // Insufficient transfer on balanced Al2O3 (6 required, only 4 transferred)
    const insufficient = evaluateIonicBonding({
      cationElement: 'Al',
      anionElement: 'O',
      targetCationCount: 2,
      targetAnionCount: 3,
      targetCationCharge: 3,
      targetAnionCharge: -2,
      cationCount: 2,
      anionCount: 3,
      electronsTransferred: 4,
      requireSimplestRatio: true,
    });
    expect(insufficient.passed).toBe(false);
    expect(insufficient.isChargeBalanced).toBe(true);
    expect(insufficient.isSimplestRatio).toBe(true);
    expect(insufficient.remainingDonorElectrons).toBe(2);

    // Non-simplest ratio Na2Cl2
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
    expect(nonSimplest.isChargeBalanced).toBe(true);
    expect(nonSimplest.isSimplestRatio).toBe(false);
  });

  it('constrains transfer control to max(donor, acceptor), clamps on atom-count reduction, and supports Undo/Reset in actual Basic 8 s23 UI', () => {
    const ionicCfg = getSlideActivity<AtomBondBuilderConstructionConfig>(
      B8_REF3_LESSON,
      's23',
      'b8-s23-ionic-playground',
    );
    const { container } = render(<AtomBondLab config={ionicCfg} />);

    // Select MgCl2 (1:2)
    fireEvent.click(screen.getByRole('tab', { name: /MgCl₂/i }));
    // Initially 1 Mg + 1 Cl -> max transferable is 1 (NOT 12!)
    const incTransfer = screen.getByRole('button', { name: /Increase transferred electrons/i });
    fireEvent.click(incTransfer);
    expect(container.querySelector('[data-ionic-transferred]')?.textContent).toBe('1');
    expect((incTransfer as HTMLButtonElement).disabled).toBe(true);

    // Add 2nd Cl -> max transferable becomes 2; transfer 2nd electron -> verified!
    fireEvent.click(screen.getByRole('button', { name: /Increase Cl count/i }));
    expect((incTransfer as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(incTransfer);
    expect(container.querySelector('[data-ionic-transferred]')?.textContent).toBe('2');

    // Now reduce Cl back to 1 -> transferred electrons MUST automatically clamp from 2 down to 1!
    fireEvent.click(screen.getByRole('button', { name: /Decrease Cl count/i }));
    expect(container.querySelector('[data-ionic-anion-count]')?.textContent).toBe('1');
    expect(container.querySelector('[data-ionic-transferred]')?.textContent).toBe('1');

    // Undo restores 2 Cl AND 2 transferred electrons!
    fireEvent.click(screen.getByRole('button', { name: /Undo last change/i }));
    expect(container.querySelector('[data-ionic-anion-count]')?.textContent).toBe('2');
    expect(container.querySelector('[data-ionic-transferred]')?.textContent).toBe('2');

    // Check passes with ionic lattice wording
    fireEvent.click(screen.getByRole('button', { name: /Check ionic bonding/i }));
    expect(screen.getByRole('status').getAttribute('data-construction-feedback')).toBe('passed');

    // Reset returns to 1 Mg, 1 Cl, 0 transferred
    fireEvent.click(screen.getByRole('button', { name: /Reset construction/i }));
    expect(container.querySelector('[data-ionic-cation-count]')?.textContent).toBe('1');
    expect(container.querySelector('[data-ionic-anion-count]')?.textContent).toBe('1');
    expect(container.querySelector('[data-ionic-transferred]')?.textContent).toBe('0');
  });
});

describe('PCV-1 Refinement 3: Portable Actual Enriched Lesson Validation & Capability-Level Gate', () => {
  it('validates both actual enriched Refinement 3 lesson JSONs (pre-activation registry fails, live scoped 1.9.0 activation passes while shared productionVersion remains 1.3.0)', () => {
    expect(B8_REF3_LESSON.slides.length).toBe(26);
    expect(HC_REF3_LESSON.slides.length).toBe(71);

    // Dev gate passes
    expect(() => assertValidLessonInteractives(B8_REF3_LESSON, { allowDevOnlyEngines: true })).not.toThrow();
    expect(() => assertValidLessonInteractives(HC_REF3_LESSON, { allowDevOnlyEngines: true })).not.toThrow();

    // Simulated pre-activation registry (capabilities held at 1.2.0 / 1.1.0) MUST reject both
    const preActivationRegistry: Record<InteractiveEngineId, InteractiveEngineMeta> = {
      ...SUPPORTED_INTERACTIVE_ENGINES,
      'construction-lab': {
        ...SUPPORTED_INTERACTIVE_ENGINES['construction-lab'],
        productionVersion: '1.3.0',
        productionCapabilities: {
          'construction-lab:atom-bond-builder': '1.2.0',
          'construction-lab:equation-balancer': '1.1.0',
        },
      },
    };
    expect(() =>
      assertValidLessonInteractives(B8_REF3_LESSON, {
        allowDevOnlyEngines: false,
        engineRegistry: preActivationRegistry,
      }),
    ).toThrow();
    expect(() =>
      assertValidLessonInteractives(HC_REF3_LESSON, {
        allowDevOnlyEngines: false,
        engineRegistry: preActivationRegistry,
      }),
    ).toThrow();

    // Live scoped production activation (atom-bond-builder: 1.9.0, equation-balancer: 1.9.0; shared productionVersion stays 1.3.0)
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].productionVersion).toBe('1.3.0');
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].productionCapabilities).toEqual({
      'construction-lab:atom-bond-builder': '1.9.0',
      'construction-lab:equation-balancer': '1.9.0',
    });
    expect(() => assertValidLessonInteractives(B8_REF3_LESSON, { allowDevOnlyEngines: false })).not.toThrow();
    expect(() => assertValidLessonInteractives(HC_REF3_LESSON, { allowDevOnlyEngines: false })).not.toThrow();
  });

  it('keeps genuine valid Measurement (1.4.0), Data Stats (1.5.0), Geometry (1.6.0), and Number Manipulative (1.7.0) pilots blocked even after Chemistry capability activation, while preserving 1.1.0-1.3.0 production compatibility and blocking version-omission bypasses', () => {
    const activatedRegistry = makeScopedChemistryActivatedRegistry();

    const step5cMeasurement = loadRepoJson<NarratedLesson>('public/preview-fixtures/step5c-measurement-lab-pilot.json');
    const step5dDataStats = loadRepoJson<NarratedLesson>('public/preview-fixtures/step5d-data-stats-pilot.json');
    const step5eGeometry = loadRepoJson<NarratedLesson>('public/preview-fixtures/step5e-geometry-extensions-pilot.json');
    const step5fNumbers = loadRepoJson<NarratedLesson>('public/preview-fixtures/step5f-number-manipulatives-pilot.json');
    const step4dProd = loadRepoJson<NarratedLesson>('public/preview-fixtures/step4d-construction-lab-pilot.json');
    const step4eProd = loadRepoJson<NarratedLesson>('public/preview-fixtures/step4e-atom-bond-pilot.json');

    // First prove all 4 unactivated fixtures are genuinely valid under dev gate (not malformed!)
    expect(() => assertValidLessonInteractives(step5cMeasurement, { allowDevOnlyEngines: true })).not.toThrow();
    expect(() => assertValidLessonInteractives(step5dDataStats, { allowDevOnlyEngines: true })).not.toThrow();
    expect(() => assertValidLessonInteractives(step5eGeometry, { allowDevOnlyEngines: true })).not.toThrow();
    expect(() => assertValidLessonInteractives(step5fNumbers, { allowDevOnlyEngines: true })).not.toThrow();

    // All 4 MUST remain blocked under strict production gate even when Chemistry 1.9.0 capabilities are activated!
    expect(() =>
      assertValidLessonInteractives(step5cMeasurement, { allowDevOnlyEngines: false, engineRegistry: activatedRegistry }),
    ).toThrow(/exceeds productionVersion/i);
    expect(() =>
      assertValidLessonInteractives(step5dDataStats, { allowDevOnlyEngines: false, engineRegistry: activatedRegistry }),
    ).toThrow(/exceeds productionVersion/i);
    expect(() =>
      assertValidLessonInteractives(step5eGeometry, { allowDevOnlyEngines: false, engineRegistry: activatedRegistry }),
    ).toThrow(/exceeds productionVersion/i);
    expect(() =>
      assertValidLessonInteractives(step5fNumbers, { allowDevOnlyEngines: false, engineRegistry: activatedRegistry }),
    ).toThrow(/exceeds productionVersion/i);

    // Existing production-compatible lessons remain valid under both default and scoped-activated registries
    expect(() => assertValidLessonInteractives(step4dProd, { allowDevOnlyEngines: false })).not.toThrow();
    expect(() => assertValidLessonInteractives(step4eProd, { allowDevOnlyEngines: false })).not.toThrow();
    expect(() =>
      assertValidLessonInteractives(step4dProd, { allowDevOnlyEngines: false, engineRegistry: activatedRegistry }),
    ).not.toThrow();
    expect(() =>
      assertValidLessonInteractives(step4eProd, { allowDevOnlyEngines: false, engineRegistry: activatedRegistry }),
    ).not.toThrow();

    // Omitting or understating minEngineVersion CANNOT bypass the 1.9.0 capability gate
    const actualIonic = getSlideActivity<AtomBondBuilderConstructionConfig>(
      B8_REF3_LESSON,
      's23',
      'b8-s23-ionic-playground',
    );
    const { minEngineVersion: _omitted, ...withoutMin } = actualIonic;
    expect(validateSlideInteractiveConfig(withoutMin, { requireProduction: true }).ok).toBe(false);
    expect(validateSlideInteractiveConfig({ ...actualIonic, minEngineVersion: '1.2.0' }, { requireProduction: true }).ok).toBe(false);

    const actualEq = getSlideActivity<EquationBalancerConstructionConfig>(
      HC_REF3_LESSON,
      'c01',
      'hc-c01-complete-combustion-playground',
    );
    expect(validateSlideInteractiveConfig({ ...actualEq, minEngineVersion: '1.1.0' }, { requireProduction: true }).ok).toBe(false);
  });
});

describe('PCV-1 Refinement 3: Explore Further Isolation Across All 4 Interfaces & Formal Assessment Protection', () => {
  it('isolates state, feedback, selected example, and Undo history across Ionic, Covalent, Molecular Geometry, and Equation Balancer interfaces', () => {
    // 1. IONIC (from actual Basic 8 s23)
    const ionicCfg = getSlideActivity<AtomBondBuilderConstructionConfig>(B8_REF3_LESSON, 's23', 'b8-s23-ionic-playground');
    const ionicView = render(<AtomBondLab config={ionicCfg} />);
    fireEvent.click(screen.getByRole('tab', { name: /MgO/i }));
    fireEvent.click(screen.getByRole('button', { name: /Increase transferred electrons/i }));
    fireEvent.click(screen.getByRole('button', { name: /Check ionic bonding/i }));
    expect(screen.getByRole('status').getAttribute('data-construction-feedback')).toBe('needs-work');
    const ionicTrigger = screen.getByRole('button', { name: /Explore Further/i });
    fireEvent.click(ionicTrigger);
    const ionicPanel = screen.getByRole('region', { name: /Explore Further sandbox/i });
    fireEvent.click(within(ionicPanel).getByRole('tab', { name: /Al₂O₃/i }));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('region', { name: /Explore Further sandbox/i })).toBeNull();
    // Parent preserved: still MgO, 1 e- transferred, feedback intact, Undo works!
    expect(screen.getByRole('tab', { name: /MgO/i }).getAttribute('aria-selected')).toBe('true');
    expect(ionicView.container.querySelector('[data-ionic-transferred]')?.textContent).toBe('1');
    expect(screen.getByRole('status').getAttribute('data-construction-feedback')).toBe('needs-work');
    fireEvent.click(screen.getByRole('button', { name: /Undo last change/i }));
    expect(ionicView.container.querySelector('[data-ionic-transferred]')?.textContent).toBe('0');
    ionicView.unmount();

    // 2. COVALENT (from actual Basic 8 s25)
    const covCfg = getSlideActivity<AtomBondBuilderConstructionConfig>(B8_REF3_LESSON, 's25', 'b8-s25-covalent-playground');
    const covView = render(<AtomBondLab config={covCfg} />);
    fireEvent.click(screen.getByRole('tab', { name: /^N₂/i }));
    fireEvent.click(screen.getByRole('button', { name: /Cycle Bond/i }));
    fireEvent.click(screen.getByRole('button', { name: /Check covalent structure/i }));
    expect(screen.getByRole('status').getAttribute('data-construction-feedback')).toBe('needs-work');
    fireEvent.click(screen.getByRole('button', { name: /Explore Further/i }));
    const covPanel = screen.getByRole('region', { name: /Explore Further sandbox/i });
    fireEvent.click(within(covPanel).getByRole('tab', { name: /H₂O/i }));
    fireEvent.click(within(covPanel).getByRole('button', { name: /Return to exercise/i }));
    expect(screen.queryByRole('region', { name: /Explore Further sandbox/i })).toBeNull();
    expect(screen.getByRole('tab', { name: /^N₂/i }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('status').getAttribute('data-construction-feedback')).toBe('needs-work');
    covView.unmount();

    // 3. MOLECULAR GEOMETRY (from actual Hydrocarbons a06)
    const vseprCfg = getSlideActivity<AtomBondBuilderConstructionConfig>(HC_REF3_LESSON, 'a06', 'hc-a06-vsepr-playground');
    const vseprView = render(<AtomBondLab config={vseprCfg} />);
    fireEvent.click(screen.getByRole('tab', { name: /NH₃/i }));
    fireEvent.click(screen.getByRole('button', { name: /Increase bonding domains/i }));
    fireEvent.click(screen.getByRole('button', { name: /Check geometry & polarity/i }));
    expect(screen.getByRole('status').getAttribute('data-construction-feedback')).toBe('needs-work');
    fireEvent.click(screen.getByRole('button', { name: /Explore Further/i }));
    const vseprPanel = screen.getByRole('region', { name: /Explore Further sandbox/i });
    fireEvent.click(within(vseprPanel).getByRole('tab', { name: /SF₆/i }));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.getByRole('tab', { name: /NH₃/i }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('status').getAttribute('data-construction-feedback')).toBe('needs-work');
    vseprView.unmount();

    // 4. EQUATION BALANCER (from actual Hydrocarbons c01, including Butane)
    const eqCfg = getSlideActivity<EquationBalancerConstructionConfig>(HC_REF3_LESSON, 'c01', 'hc-c01-complete-combustion-playground');
    const eqView = render(<EquationBalancerLab config={eqCfg} />);
    fireEvent.click(screen.getByRole('tab', { name: /Propane/i }));
    fireEvent.click(screen.getByRole('button', { name: /Increase coefficient for O₂/i }));
    fireEvent.click(screen.getByRole('button', { name: /Check equation balance/i }));
    expect(screen.getByRole('status').getAttribute('data-construction-feedback')).toBe('needs-work');
    fireEvent.click(screen.getByRole('button', { name: /Explore Further/i }));
    const eqPanel = screen.getByRole('region', { name: /Explore Further sandbox/i });
    fireEvent.click(within(eqPanel).getByRole('tab', { name: /Butane/i }));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.getByRole('tab', { name: /Propane/i }).getAttribute('aria-selected')).toBe('true');
    expect(eqView.container.querySelector('[data-coeff-value="reactants-1"]')?.textContent).toBe('2');
    expect(screen.getByRole('status').getAttribute('data-construction-feedback')).toBe('needs-work');
    // Undo steps back O2 coefficient to 1!
    fireEvent.click(screen.getByRole('button', { name: /Undo last change/i }));
    expect(eqView.container.querySelector('[data-coeff-value="reactants-1"]')?.textContent).toBe('1');
    eqView.unmount();
  });

  it('blocks Explore Further, hints, prediction scaffolding, and example switching when isAssessment is true', () => {
    const eqCfg = getSlideActivity<EquationBalancerConstructionConfig>(HC_REF3_LESSON, 'c01', 'hc-c01-complete-combustion-playground');
    render(
      <EquationBalancerLab
        config={{
          ...eqCfg,
          id: 'formal-assessment-eq',
          isAssessment: true,
          exploreFurther: true,
          hints: ['Should be hidden in formal assessment'],
        }}
      />,
    );
    expect(screen.queryByRole('button', { name: /Explore Further/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Need a hint/i })).toBeNull();
    expect(screen.queryByRole('tablist')).toBeNull();
  });

  it('verifies butane stoichiometry (2C4H10 + 13O2 -> 8CO2 + 10H2O), covalent N2 triple bond, and VSEPR SF6', () => {
    const butane = evaluateEquationBalance(
      [{ formula: 'C4H10' }, { formula: 'O2' }],
      [{ formula: 'CO2' }, { formula: 'H2O' }],
      [2, 13],
      [8, 10],
      { requireSimplestRatio: true, maxCoefficient: 15 },
    );
    expect(butane.ok && butane.isBalanced && butane.isSimplestRatio).toBe(true);

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
});
