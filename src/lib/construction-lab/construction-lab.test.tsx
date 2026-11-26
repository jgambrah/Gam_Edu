import React from 'react';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import {
  evaluateEquationBalance,
  hasValidEquationSolution,
  parseChemicalFormula,
} from './stoichiometry-engine';
import {
  evaluateDcCircuitGoal,
  solveDcCircuit,
} from './dc-circuit-engine';
import {
  computeMonohybridPunnett,
  evaluateBaseSequence,
  evaluateMonohybridPunnett,
  evaluateMrnaTranslation,
  translateMrnaCodons,
} from './bio-sequence-engine';
import {
  assertValidLessonInteractives,
  validateSlideInteractiveConfig,
  type BioSequenceConstructionConfig,
  type BooleanCircuitConstructionConfig,
  type ElectricalCircuitConstructionConfig,
  type EquationBalancerConstructionConfig,
} from '@/lib/narrated-lessons/interactive-schema';
import { EquationBalancerLab } from '@/components/narrated-lessons/construction/EquationBalancerLab';
import { ElectricalCircuitLab } from '@/components/narrated-lessons/construction/ElectricalCircuitLab';
import { BioSequenceLab } from '@/components/narrated-lessons/construction/BioSequenceLab';
import { DeclarativeBooleanCircuitAdapter } from '@/components/narrated-lessons/construction/DeclarativeBooleanCircuitAdapter';
import { InteractiveEngineRegistry } from '@/components/narrated-lessons/InteractiveEngineRegistry';
import type { LessonSlide, NarratedLesson } from '@/lib/narrated-lessons/types';

const fixturePath = path.resolve(process.cwd(), 'public/preview-fixtures/step4d-construction-lab-pilot.json');
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as NarratedLesson;

describe('Step 4D Domain 1: Chemical Equation Balancer (Stoichiometry & Charge Conservation)', () => {
  it('parses neutral, parenthesised, and electron species accurately and rejects malformed formulae', () => {
    expect(parseChemicalFormula('Ca(OH)2')).toEqual({ ok: true, atoms: { Ca: 1, O: 2, H: 2 } });
    expect(parseChemicalFormula('Al2(SO4)3')).toEqual({ ok: true, atoms: { Al: 2, S: 3, O: 12 } });
    expect(parseChemicalFormula('e-', true)).toEqual({ ok: true, atoms: {} });

    expect(parseChemicalFormula('Qq2O').ok).toBe(false);
    expect(parseChemicalFormula('Ca(OH2').ok).toBe(false);
    expect(parseChemicalFormula('(((H2)))').ok).toBe(false);
    expect(parseChemicalFormula('H0O').ok).toBe(false);
  });

  it('verifies atom conservation, charge conservation, simplest whole-number ratio, and unsolvable authoring rejection', () => {
    const water = evaluateEquationBalance(
      [{ formula: 'H2' }, { formula: 'O2' }],
      [{ formula: 'H2O' }],
      [2, 1],
      [2],
    );
    expect(water.isBalanced).toBe(true);
    expect(water.isSimplestRatio).toBe(true);

    // Non-simplest multiple (4:2:4, GCD=2)
    const doubled = evaluateEquationBalance(
      [{ formula: 'H2' }, { formula: 'O2' }],
      [{ formula: 'H2O' }],
      [4, 2],
      [4],
    );
    expect(doubled.isBalanced).toBe(true);
    expect(doubled.isSimplestRatio).toBe(false);
    expect(doubled.gcd).toBe(2);

    // Redox half-equation: 2Br- -> Br2 + 2e- (atoms balanced at 2:1:1, but charge unbalanced!)
    const badCharge = evaluateEquationBalance(
      [{ formula: 'Br', charge: -1 }],
      [{ formula: 'Br2' }, { formula: 'e-', charge: -1, isElectron: true }],
      [2],
      [1, 1],
    );
    expect(badCharge.isAtomsBalanced).toBe(true);
    expect(badCharge.isChargeBalanced).toBe(false);

    const goodRedox = evaluateEquationBalance(
      [{ formula: 'Br', charge: -1 }],
      [{ formula: 'Br2' }, { formula: 'e-', charge: -1, isElectron: true }],
      [2],
      [1, 2],
    );
    expect(goodRedox.isBalanced).toBe(true);
    expect(goodRedox.lhsCharge).toBe(-2);
    expect(goodRedox.rhsCharge).toBe(-2);

    // Unsolvable authoring equation rejected
    expect(
      hasValidEquationSolution([{ formula: 'H2' }, { formula: 'O2' }], [{ formula: 'CO2' }], 10).solvable,
    ).toBe(false);
  });
});

describe('Step 4D Domain 2: Bounded DC Electrical Circuit Solver (Ohm, Kirchhoff, Safety & Structural Goals)', () => {
  it('verifies series KVL, parallel KCL, independent branch opening, short-circuit safety, and structural goals', () => {
    const c05 = fixture.slides[4].interactive as ElectricalCircuitConstructionConfig;
    const c05Solved = solveDcCircuit(c05.topology, c05.supplyVoltageV, c05.slots, c05.palette, {
      's-sw': 'sw-closed',
      's-load2': 'lamp-6',
    });
    expect(c05Solved.status).toBe('normal');
    expect(c05Solved.equivalentResistanceOhm).toBeCloseTo(12, 5);
    expect(c05Solved.totalCurrentA).toBeCloseTo(1.0, 5);
    expect(c05Solved.voltmeterProbeV).toBeCloseTo(6.0, 5);
    expect(c05Solved.kvlResidualV).toBeLessThan(1e-6);
    expect(evaluateDcCircuitGoal(c05Solved, c05.goal!).passed).toBe(true);

    // Structural goal check: replacing both lamps with a single 12 Ohm resistor achieves I=1.00 A
    // numerically, yet MUST fail because structural goal requires 2 lamps!
    const cheatSeries = solveDcCircuit(c05.topology, c05.supplyVoltageV, c05.slots, c05.palette, {
      's-sw': 'sw-closed',
      's-load1': 'res-12',
      's-load2': 'wire',
    });
    expect(cheatSeries.totalCurrentA).toBeCloseTo(1.0, 5);
    expect(evaluateDcCircuitGoal(cheatSeries, c05.goal!).passed).toBe(false);

    // Parallel KCL & independent branch open check on C06
    const c06 = fixture.slides[5].interactive as ElectricalCircuitConstructionConfig;
    const c06OneOpen = solveDcCircuit(c06.topology, c06.supplyVoltageV, c06.slots, c06.palette, {});
    expect(c06OneOpen.branchBOpen).toBe(true);
    expect(c06OneOpen.branchACurrentA).toBeCloseTo(1.0, 5);
    expect(c06OneOpen.branchBCurrentA).toBe(0);

    const c06Both = solveDcCircuit(c06.topology, c06.supplyVoltageV, c06.slots, c06.palette, {
      'p-bb': 'lamp-6',
    });
    expect(c06Both.equivalentResistanceOhm).toBeCloseTo(3.0, 5);
    expect(c06Both.totalCurrentA).toBeCloseTo(2.0, 5);
    expect(c06Both.kclResidualA).toBeLessThan(1e-6);
    expect(evaluateDcCircuitGoal(c06Both, c06.goal!).passed).toBe(true);

    // Short circuit & meter misconnection on C07 initial faulty state
    const c07 = fixture.slides[6].interactive as ElectricalCircuitConstructionConfig;
    const c07Faulty = solveDcCircuit(c07.topology, c07.supplyVoltageV, c07.slots, c07.palette, {});
    expect(c07Faulty.status).toBe('short-circuit');
    expect(c07Faulty.totalCurrentA).toBeNull();
    expect(c07Faulty.hasShortCircuit).toBe(true);
    expect(c07Faulty.hasMeterMisconnection).toBe(true);

    // Voltmeter placed in series blocks current & flags meter misconnection
    const voltInSeries = solveDcCircuit(c05.topology, c05.supplyVoltageV, c05.slots, c05.palette, {
      's-sw': 'volt',
      's-load2': 'lamp-6',
    });
    expect(voltInSeries.status).toBe('open-main');
    expect(voltInSeries.hasMeterMisconnection).toBe(true);
  });
});

describe('Step 4D Domain 3: Biological Sequence & Inheritance Engine', () => {
  it('verifies DNA pairing, mRNA transcription (catching T in RNA), translation with STOP codon, and Punnett probabilities', () => {
    const dnaOk = evaluateBaseSequence('dna-base-pairing', ['T', 'A', 'C', 'G', 'G', 'A'], ['A', 'T', 'G', 'C', 'C', 'T']);
    expect(dnaOk.passed).toBe(true);

    const rnaMisconception = evaluateBaseSequence('dna-to-mrna', ['T', 'A', 'C'], ['A', 'T', 'G']);
    expect(rnaMisconception.passed).toBe(false);
    expect(rnaMisconception.feedback).toMatch(/Thymine \(T\) is found in DNA, not RNA/i);

    const mrnaOk = evaluateBaseSequence('dna-to-mrna', ['T', 'A', 'C', 'G', 'A', 'A'], ['A', 'U', 'G', 'C', 'U', 'U']);
    expect(mrnaOk.passed).toBe(true);

    // Translation: AUG GGA UUU UAA -> Met, Gly, Phe, STOP (no amino acid assigned to STOP)
    const transRef = translateMrnaCodons(['A', 'U', 'G', 'G', 'G', 'A', 'U', 'U', 'U', 'U', 'A', 'A']);
    expect(transRef.aminoAcids).toEqual(['Met', 'Gly', 'Phe']);
    expect(transRef.terminatedAtStop).toBe(true);
    expect(transRef.expectedTokens).toEqual(['Met', 'Gly', 'Phe', 'STOP']);

    const badStop = evaluateMrnaTranslation(
      ['A', 'U', 'G', 'G', 'G', 'A', 'U', 'U', 'U', 'U', 'A', 'A'],
      ['Met', 'Gly', 'Phe', 'Pro'],
    );
    expect(badStop.passed).toBe(false);
    expect(badStop.feedback).toMatch(/stop codon.*does NOT code for an amino acid/i);

    const punnettRef = computeMonohybridPunnett('Tt', 'Tt', 'T');
    expect(punnettRef.genotypeProbabilities).toEqual({ TT: 25, Tt: 50, tt: 25 });
    expect(punnettRef.dominantProbabilityPct).toBe(75);
    expect(punnettRef.recessiveProbabilityPct).toBe(25);
    expect(evaluateMonohybridPunnett('Tt', 'Tt', 'T', ['TT', 'tT', 'Tt', 'tt']).passed).toBe(true);
  });
});

describe('Step 4D Strict Schema Validation, Domain Version Gates & Legacy Compatibility', () => {
  it('validates all 12 pilots under dev validation and blocks them at production publish gate (productionVersion: 1.0.0 < 1.1.0)', () => {
    expect(fixture.slides.length).toBe(12);
    expect(() => assertValidLessonInteractives(fixture, { allowDevOnlyEngines: true })).not.toThrow();
    expect(() => assertValidLessonInteractives(fixture)).toThrow(/exceeds productionVersion "1\.0\.0"/i);
  });

  it('prevents Step 4D domains from bypassing the version gate with minEngineVersion 1.0.0 while keeping legacy boolean-circuit valid', () => {
    const c01 = fixture.slides[0].interactive as EquationBalancerConstructionConfig;
    const downgradeAttempt = validateSlideInteractiveConfig({ ...c01, minEngineVersion: '1.0.0' });
    expect(downgradeAttempt.ok).toBe(false);
    expect(downgradeAttempt.errors.join(' ')).toMatch(/requires minEngineVersion >= "1\.1\.0"/i);

    // Legacy boolean-circuit without circuitConfig MUST remain valid at productionVersion 1.0.0
    const legacy = validateSlideInteractiveConfig(
      {
        id: 'legacy-bool-1',
        engine: 'construction-lab',
        schemaVersion: 1,
        minEngineVersion: '1.0.0',
        labKind: 'boolean-circuit',
        activityId: 's04-and-or',
        title: 'Legacy Boolean Lab',
        instructions: 'Wire the gates.',
        accessibilityLabel: 'Legacy Boolean logic lab',
        fallbackText: 'Fallback explanation for legacy Boolean lab.',
      },
      { requireImplemented: true, requireProduction: true },
    );
    expect(legacy.ok).toBe(true);
  });

  it('rejects cyclic declarative Boolean circuits and unsolvable chemical equations at schema validation time', () => {
    const c12 = fixture.slides[11].interactive as BooleanCircuitConstructionConfig;
    const cyclic = validateSlideInteractiveConfig({
      ...c12,
      circuitConfig: {
        ...c12.circuitConfig!,
        initialGates: [
          { id: 'G1', op: 'NOT', inputs: ['G2'] },
          { id: 'G2', op: 'NOT', inputs: ['G1'] },
        ],
        initialOutput: 'G2',
      },
    });
    expect(cyclic.ok).toBe(false);
    expect(cyclic.errors.join(' ')).toMatch(/cycle/i);
  });
});

describe('Step 4D UI Components: Undo/Reset, Interactive Grading, Multi-Activity Isolation & Low-Data', () => {
  it('supports EquationBalancerLab coefficient stepping, Undo, Reset, and verification on C01', () => {
    const c01 = fixture.slides[0].interactive as EquationBalancerConstructionConfig;
    render(<EquationBalancerLab config={c01} />);

    fireEvent.click(screen.getByRole('button', { name: /^Increase coefficient for H₂$/i }));
    fireEvent.click(screen.getByRole('button', { name: /^Increase coefficient for H₂O$/i }));
    fireEvent.click(screen.getByRole('button', { name: /Check equation balance/i }));
    expect(screen.getByText(/Verified:/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /Undo last change/i }));
    fireEvent.click(screen.getByRole('button', { name: /Check equation balance/i }));
    expect(screen.getByText(/Keep refining:/i)).toBeTruthy();
  });

  it('supports DeclarativeBooleanCircuitAdapter functional-equivalence grading on C12, BioSequenceLab, ElectricalCircuitLab, and Low-Data Mode', () => {
    const c05 = fixture.slides[4].interactive as ElectricalCircuitConstructionConfig;
    const c08 = fixture.slides[7].interactive as BioSequenceConstructionConfig;
    const c12 = fixture.slides[11].interactive as BooleanCircuitConstructionConfig;

    const { container } = render(
      <div>
        <ElectricalCircuitLab config={c05} />
        <BioSequenceLab config={c08} />
        <DeclarativeBooleanCircuitAdapter config={c12} />
      </div>,
    );

    const sections = container.querySelectorAll('section[data-interactive-engine="construction-lab"]');
    expect(sections.length).toBe(3);

    // Wire C12: G1 = NOT B is already present; add AND gate, wire In 1 = A, In 2 = G1 -> output G2
    const c12Sec = sections[2] as HTMLElement;
    fireEvent.click(within(c12Sec).getByRole('button', { name: /^AND$/ }));
    fireEvent.change(within(c12Sec).getByLabelText(/G2 input 1/i), { target: { value: 'A' } });
    fireEvent.change(within(c12Sec).getByLabelText(/G2 input 2/i), { target: { value: 'G1' } });
    fireEvent.click(within(c12Sec).getByRole('button', { name: /Grade logic circuit/i }));
    expect(within(c12Sec).getByText(/Verified:/i)).toBeTruthy();

    // Low-Data Mode via InteractiveEngineRegistry
    const stubSlide = fixture.slides[0] as LessonSlide;
    render(<InteractiveEngineRegistry lesson={fixture} slide={stubSlide} lowDataMode={true} />);
    expect(screen.getByText(/Low-Data Summary/i)).toBeTruthy();
  });
});
