import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { EquationBalancerLab } from '@/components/narrated-lessons/construction/EquationBalancerLab';
import { MathEvaluatorEngine } from '@/components/narrated-lessons/MathEvaluatorEngine';
import { ProcessStepperEngine } from '@/components/narrated-lessons/ProcessStepperEngine';
import { GraphSliderEngine } from '@/components/narrated-lessons/GraphSliderEngine';

describe('PCV-1 Enriched Science Pilots — Functional Interaction & Production Compatibility Tests', () => {
  it('renders and verifies Pilot A (Hydrocarbons) GraphSliderEngine discrete boiling points + challenge', () => {
    render(
      <GraphSliderEngine
        config={{
          id: 'hc-b01-boiling-points',
          engine: 'graph-slider',
          schemaVersion: 1,
          minEngineVersion: '1.0.0',
          title: 'Normal Boiling Points of Straight-Chain Alkanes (C₁ to C₈)',
          instructions: 'Inspect boiling points.',
          accessibilityLabel: 'Alkane boiling points',
          fallbackText: 'C1 -161.5 to C8 125.6 °C.',
          xVar: 'x',
          axes: { xMin: 1, xMax: 8, yMin: -180, yMax: 150, xLabel: 'n', yLabel: 'bp (°C)' },
          sliders: [{ id: 'n', label: 'Carbon count', min: 1, max: 8, step: 1, defaultValue: 1, presets: [1, 5, 8] }],
          curves: [
            {
              id: 'alkane-bp',
              label: 'Experimental normal bp',
              kind: 'piecewise',
              points: [
                { x: 1, y: -161.5 },
                { x: 5, y: 36.1 },
                { x: 8, y: 125.6 },
              ],
              color: '#0369a1',
            },
          ],
          challenges: [
            {
              id: 'ch-first-liquid',
              prompt: 'Select pentane (n = 5).',
              check: { operator: 'AND', conditions: [{ sliderId: 'n', target: 5, tolerance: 0.01 }] },
              successText: 'Correct! Pentane is liquid at 25 °C.',
            },
          ],
        }}
      />,
    );
    expect(screen.getByText(/Normal Boiling Points/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    expect(screen.getByText(/Correct! Pentane is liquid at 25 °C/i)).toBeTruthy();
  });

  it('renders and verifies Pilot A EquationBalancerLab (catalytic converter) and ProcessStepperEngine (HBr addition)', () => {
    const { unmount } = render(
      <EquationBalancerLab
        config={{
          id: 'hc-c04-catalytic-converter',
          engine: 'construction-lab',
          labKind: 'equation-balancer',
          schemaVersion: 1,
          minEngineVersion: '1.1.0',
          title: 'Catalytic Converter Redox Equation',
          instructions: 'Balance 2CO + 2NO -> 2CO2 + N2.',
          accessibilityLabel: 'Catalytic converter balancer',
          fallbackText: '2CO + 2NO -> 2CO2 + N2.',
          reactants: [{ formula: 'CO', state: 'g' }, { formula: 'NO', state: 'g' }],
          products: [{ formula: 'CO2', state: 'g' }, { formula: 'N2', state: 'g' }],
          requireSimplestRatio: true,
        }}
      />,
    );
    expect(screen.getByText(/Catalytic Converter Redox Equation/i)).toBeTruthy();
    unmount();

    render(
      <ProcessStepperEngine
        config={{
          id: 'hc-h02-electrophilic-addition-hbr',
          engine: 'process-stepper',
          schemaVersion: 1,
          minEngineVersion: '1.0.0',
          mode: 'linear',
          visualMode: 'diagram',
          title: 'Electrophilic Addition of HBr to Ethene',
          instructions: 'Step through the mechanism.',
          accessibilityLabel: 'Electrophilic addition stepper',
          fallbackText: 'Ethene + HBr -> bromoethane.',
          stages: [
            { id: 'ea-1', title: '1. Reactants & Bond Polarity', summary: 'Polar HBr approaches C=C.' },
            { id: 'ea-2', title: '2. Bromoethane Product', summary: 'CH3CH2Br formed.' },
          ],
        }}
      />,
    );
    expect(screen.getByText(/Polar HBr approaches C=C/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    expect(screen.getByText(/CH3CH2Br formed/i)).toBeTruthy();
  });

  it('renders and verifies Pilot B (Atoms) MathEvaluatorEngine numeric particle calculation', () => {
    render(
      <MathEvaluatorEngine
        config={{
          id: 'b8-s10-fluorine-neutrons',
          engine: 'math-evaluator',
          mode: 'numeric-quantity',
          schemaVersion: 1,
          minEngineVersion: '1.1.0',
          curriculumLevel: 'lower-secondary',
          title: 'Calculate Neutrons in Fluorine-19',
          instructions: 'Enter neutrons in Fluorine-19.',
          accessibilityLabel: 'Neutrons in Fluorine-19',
          fallbackText: '19 - 9 = 10.',
          expectedValue: '10',
        }}
      />,
    );
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /Check/i }));
    expect(screen.getByText(/Exact|Verified|Correct/i)).toBeTruthy();
  });
});
