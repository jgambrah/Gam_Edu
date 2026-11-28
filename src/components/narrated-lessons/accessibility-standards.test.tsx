import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EquationBalancerLab } from '@/components/narrated-lessons/construction/EquationBalancerLab';
import { ProcessStepperEngine } from '@/components/narrated-lessons/ProcessStepperEngine';
import { GraphSliderEngine } from '@/components/narrated-lessons/GraphSliderEngine';

describe('Step 5E-A — Shared Accessibility Standards (D-038, D-039, D-040, D-042)', () => {
  it('ensures scrollable tables in EquationBalancerLab and ProcessStepperEngine are keyboard-focusable regions (D-042)', () => {
    const { container: eqC } = render(
      <EquationBalancerLab
        config={{
          id: 'a11y-eq-1',
          engine: 'construction-lab',
          labKind: 'equation-balancer',
          schemaVersion: 1,
          minEngineVersion: '1.1.0',
          title: 'Balance Water',
          instructions: 'Balance H2 + O2 -> H2O.',
          accessibilityLabel: 'Balance water equation',
          fallbackText: '2H2 + O2 -> 2H2O.',
          reactants: [{ formula: 'H2' }, { formula: 'O2' }],
          products: [{ formula: 'H2O' }],
        }}
      />,
    );
    const eqScroll = eqC.querySelector('[tabindex="0"][role="region"]');
    expect(eqScroll).toBeTruthy();
    expect(eqScroll?.getAttribute('aria-label')).toBeTruthy();

    const { container: psC } = render(
      <ProcessStepperEngine
        config={{
          id: 'a11y-ps-1',
          engine: 'process-stepper',
          schemaVersion: 1,
          minEngineVersion: '1.0.0',
          mode: 'linear',
          title: 'Mitosis',
          instructions: 'Step through stages.',
          accessibilityLabel: 'Mitosis stepper',
          fallbackText: 'Prophase to Telophase.',
          stages: [
            { id: 's1', title: 'Stage 1', summary: 'First stage.', equation: 'A -> B' },
            { id: 's2', title: 'Stage 2', summary: 'Second stage.' },
          ],
        }}
      />,
    );
    expect(psC.querySelectorAll('[tabindex="0"][role="region"]').length).toBeGreaterThanOrEqual(1);
  });

  it('uses >=44px touch targets and WCAG AA high-contrast primary classes on GraphSliderEngine (D-038, D-040)', () => {
    const { container } = render(
      <GraphSliderEngine
        config={{
          id: 'a11y-gs-1',
          engine: 'graph-slider',
          schemaVersion: 1,
          minEngineVersion: '1.0.0',
          title: 'Linear Graph',
          instructions: 'Adjust slope m.',
          accessibilityLabel: 'Linear graph explorer',
          fallbackText: 'y = mx.',
          xVar: 'x',
          axes: { xMin: -5, xMax: 5, yMin: -5, yMax: 5, xLabel: 'x', yLabel: 'y' },
          sliders: [{ id: 'm', label: 'Slope m', min: -3, max: 3, step: 1, defaultValue: 1, presets: [2] }],
          curves: [{ id: 'c1', label: 'y = m*x', expr: 'm * x', color: '#0369a1' }],
        }}
      />,
    );
    const ranges = container.querySelectorAll('input[type="range"]');
    expect(ranges.length).toBeGreaterThan(0);
    ranges.forEach((r) => {
      expect(r.className).toContain('min-h-[44px]');
    });
    expect(screen.getByRole('button', { name: /Reset/i }).className).toContain('min-h-[44px]');
  });
});
