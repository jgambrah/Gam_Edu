import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  evaluateAtomicConstruction,
  evaluateFreeAtomicExploration,
  getApprovedElementsUpToZ,
  getExpectedIntroShells,
} from './atom-bond-engine';
import {
  SUPPORTED_INTERACTIVE_ENGINES,
  assertValidLessonInteractives,
  type AtomBondBuilderConstructionConfig,
} from '@/lib/narrated-lessons/interactive-schema';
import { AtomBondLab } from '@/components/narrated-lessons/construction/AtomBondLab';

describe('PCV-1 Refinement 1 — Open-Ended Atomic Structure Playground (construction-lab 1.8.0)', () => {
  it('advances construction-lab engineVersion to 1.9.0 while holding productionVersion at 1.3.0', () => {
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].engineVersion).toBe('1.9.0');
    expect(SUPPORTED_INTERACTIVE_ENGINES['construction-lab'].productionVersion).toBe('1.3.0');
  });

  it('validates all 20 neutral elements (Z = 1..20) in Free Exploration mode without fixed-target rejection', () => {
    const first20 = getApprovedElementsUpToZ(20);
    expect(first20).toHaveLength(20);
    for (const el of first20) {
      const mass = el.isotopes[0].massNumber;
      const res = evaluateFreeAtomicExploration({
        protons: el.z,
        neutrons: mass - el.z,
        representation: 'shells',
        shells: getExpectedIntroShells(el.z),
        maxZ: 20,
      });
      expect(res.passed).toBe(true);
      expect(res.actualSymbol).toBe(el.symbol);
      expect(res.actualCharge).toBe(0);
      expect(res.isCommonIon).toBe(false); // Neutral atoms MUST NOT be classified as common ions!
      expect(res.isKnownIsotope).toBe(true);
      expect(res.isGroundStateConfig).toBe(true);
      expect(res.groupPeriodNote).toContain(`Period ${el.period}`);
      expect(res.groupPeriodNote).toMatch(/never Group or Period/i);
    }
  });

  it('rejects malformed/negative/fractional/over-capacity particle counts and classifies unsupported subshell ions as unverified', () => {
    // Negative, fractional, NaN particle counts
    expect(evaluateFreeAtomicExploration({ protons: -1, neutrons: 0, representation: 'shells', shells: [0, 0, 0, 0] }).status).toBe('invalid-input');
    expect(evaluateFreeAtomicExploration({ protons: 6.5, neutrons: 6, representation: 'shells', shells: [2, 4, 0, 0] }).status).toBe('invalid-input');
    expect(evaluateFreeAtomicExploration({ protons: Number.NaN, neutrons: 0, representation: 'shells', shells: [0, 0, 0, 0] }).status).toBe('invalid-input');
    // Over-capacity shell occupancy (independent of UI!)
    expect(evaluateFreeAtomicExploration({ protons: 6, neutrons: 6, representation: 'shells', shells: [5, 1, 0, 0] }).status).toBe('invalid-input');
    // Over-capacity subshell occupancy (independent of UI!)
    expect(
      evaluateFreeAtomicExploration({
        protons: 6,
        neutrons: 6,
        representation: 'subshells',
        subshells: { '1s': 4, '2s': 2, '2p': 0, '3s': 0, '3p': 0, '4s': 0, '3d': 0 },
      }).status,
    ).toBe('invalid-input');
    // Unsupported subshell ion (e.g. Na5+): MUST be classified as unverified-subshells (passed: false), NEVER true!
    const unvSub = evaluateFreeAtomicExploration({
      protons: 11,
      neutrons: 12,
      representation: 'subshells',
      subshells: { '1s': 2, '2s': 2, '2p': 2, '3s': 0, '3p': 0, '4s': 0, '3d': 0 },
    });
    expect(unvSub.passed).toBe(false);
    expect(unvSub.status).toBe('unverified-subshells');
  });

  it('distinguishes Carbon-12/13/14 isotopes, common ions (Na+, Cl-, Mg2+, O2-), empty atom, invalid shells, and unverified species', () => {
    // Carbon-12 & Carbon-13 stable; Carbon-14 radioactive
    expect(evaluateFreeAtomicExploration({ protons: 6, neutrons: 6, representation: 'shells', shells: [2, 4, 0, 0] }).status).toBe('known-stable-neutral');
    expect(evaluateFreeAtomicExploration({ protons: 6, neutrons: 7, representation: 'shells', shells: [2, 4, 0, 0] }).status).toBe('known-stable-neutral');
    const c14 = evaluateFreeAtomicExploration({ protons: 6, neutrons: 8, representation: 'shells', shells: [2, 4, 0, 0] });
    expect(c14.status).toBe('known-radioactive-neutral');
    expect(c14.isRadioactiveIsotope).toBe(true);

    // Verified common ions: Na+, Cl-, Mg2+, O2-
    expect(evaluateFreeAtomicExploration({ protons: 11, neutrons: 12, representation: 'shells', shells: [2, 8, 0, 0] }).status).toBe('known-stable-ion');
    expect(evaluateFreeAtomicExploration({ protons: 17, neutrons: 18, representation: 'shells', shells: [2, 8, 8, 0] }).status).toBe('known-stable-ion');
    expect(evaluateFreeAtomicExploration({ protons: 12, neutrons: 12, representation: 'shells', shells: [2, 8, 0, 0] }).status).toBe('known-stable-ion');
    expect(evaluateFreeAtomicExploration({ protons: 8, neutrons: 8, representation: 'shells', shells: [2, 8, 0, 0] }).status).toBe('known-stable-ion');

    // Empty atom
    expect(evaluateFreeAtomicExploration({ protons: 0, neutrons: 0, representation: 'shells', shells: [0, 0, 0, 0] }).status).toBe('empty');

    // Non-ground-state shell arrangement (e.g. 1, 5 instead of 2, 4)
    const badShells = evaluateFreeAtomicExploration({ protons: 6, neutrons: 6, representation: 'shells', shells: [1, 5, 0, 0] });
    expect(badShells.passed).toBe(false);
    expect(badShells.status).toBe('excited-or-invalid-shells');

    // Unverified isotope & unverified ion (does NOT invent stability!)
    const unvIso = evaluateFreeAtomicExploration({ protons: 6, neutrons: 20, representation: 'shells', shells: [2, 4, 0, 0] });
    expect(unvIso.status).toBe('unverified-isotope');
    expect(unvIso.feedback).toMatch(/unverified/i);

    const unvIon = evaluateFreeAtomicExploration({ protons: 11, neutrons: 12, representation: 'shells', shells: [2, 4, 0, 0] });
    expect(unvIon.status).toBe('unverified-ion');
    expect(unvIon.feedback).toMatch(/unverified|uncommon/i);

    // Fixed-target guided mode still rejects wrong element (Nitrogen instead of Carbon-12)
    expect(
      evaluateAtomicConstruction({
        targetElement: 'C',
        targetMassNumber: 12,
        targetCharge: 0,
        representation: 'shells',
        protons: 7,
        neutrons: 7,
        shells: [2, 5, 0, 0],
      }).passed,
    ).toBe(false);
  });

  it('supports learner-facing Periodic Table selection, Empty Atom, and Nitrogen construction in Free Exploration UI', () => {
    const cfg: AtomBondBuilderConstructionConfig = {
      id: 'ui-free-atom-1',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'atomic-structure',
      representation: 'shells',
      interactionMode: 'free-exploration',
      allowElementSelector: true,
      maxElementZ: 20,
      startEmpty: true,
      schemaVersion: 1,
      minEngineVersion: '1.8.0',
      curriculumLevel: 'introductory',
      title: 'Atomic Structure Playground',
      instructions: 'Select any element or build from an empty atom.',
      accessibilityLabel: 'Open-ended atomic structure playground',
      fallbackText: 'Explore elements 1 to 20.',
    };
    render(<AtomBondLab config={cfg} />);
    expect(screen.getByText(/Empty atom \(add protons\)/i)).toBeTruthy();

    // Select Nitrogen via Periodic Table button
    fireEvent.click(screen.getByRole('button', { name: /Select Nitrogen, symbol N, atomic number 7/i }));
    fireEvent.click(screen.getByRole('button', { name: /Check atomic structure/i }));
    expect(screen.getByText(/Constructed Nitrogen-14/i)).toBeTruthy();

    // Clear back to empty atom
    fireEvent.click(screen.getByRole('button', { name: 'Empty Atom' }));
    expect(screen.getByText(/Empty atom \(add protons\)/i)).toBeTruthy();
  });

  it('supports multi-target Independent Challenge UI without prematurely revealing electron arrangements', () => {
    const chCfg: AtomBondBuilderConstructionConfig = {
      id: 'ui-indep-ch-1',
      engine: 'construction-lab',
      labKind: 'atom-bond-builder',
      mode: 'atomic-structure',
      representation: 'shells',
      interactionMode: 'independent-challenge',
      schemaVersion: 1,
      minEngineVersion: '1.8.0',
      curriculumLevel: 'introductory',
      title: 'Independent Electron Arrangement Challenge',
      instructions: 'Use atomic numbers to build each neutral element.',
      accessibilityLabel: 'Independent electron arrangement challenge',
      fallbackText: 'Construct H, O, Cl, and Ca.',
      challengeTargets: [
        { id: 'c-h', prompt: 'Construct a neutral Hydrogen atom (Z = 1).', targetElement: 'H', targetMassNumber: 1, targetCharge: 0, lockNucleus: true, initialElectrons: 0 },
        { id: 'c-ca', prompt: 'Construct a neutral Calcium atom (Z = 20) from its atomic number.', targetElement: 'Ca', targetMassNumber: 40, targetCharge: 0, lockNucleus: true, initialElectrons: 0 },
      ],
    };
    // Verify production gate blocks 1.8.0 until owner activates it!
    expect(() =>
      assertValidLessonInteractives(
        { lessonId: 'test-180', slides: [{ id: 's1', interactive: [chCfg] }] },
        { allowDevOnlyEngines: true },
      ),
    ).not.toThrow();
    expect(() =>
      assertValidLessonInteractives(
        { lessonId: 'test-180', slides: [{ id: 's1', interactive: [chCfg] }] },
        { allowDevOnlyEngines: false },
      ),
    ).toThrow(/1\.8\.0|production/i);

    render(<AtomBondLab config={chCfg} />);
    expect(screen.getByText(/Construct a neutral Hydrogen atom/i)).toBeTruthy();
    // Ensure Calcium prompt does NOT leak "2, 8, 8, 2"
    fireEvent.click(screen.getByRole('tab', { name: /Challenge 2/i }));
    expect(screen.getByText(/Construct a neutral Calcium atom \(Z = 20\)/i)).toBeTruthy();
    expect(screen.queryByText(/2, 8, 8, 2/)).toBeNull();
  });
});
