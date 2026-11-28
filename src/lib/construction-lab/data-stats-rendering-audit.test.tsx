// @vitest-environment jsdom
/**
 * Comprehensive-audit regression tests for the data-visualisation RENDERER (not just the maths model):
 * the chart a learner sees must represent the data exactly.
 */
import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { DataStatsLab } from '@/components/narrated-lessons/construction/DataStatsLab';

const base = { minEngineVersion: '1.5.0', curriculumLevel: 'primary', mode: 'data-visualisation', title: 'audit', prompt: 'p' } as any;

describe('data-visualisation renderer fidelity (audit)', () => {
  it('dot plot draws EVERY observation (previously stacks were silently cut off at 10 dots)', () => {
    const rawValues = [...Array(25).fill(3), 7];
    const { container } = render(<DataStatsLab config={{ ...base, chartKind: 'dot-plot', rawValues, expectedNumericAnswer: 3 }} />);
    const stack = container.querySelector('[data-dot-value="3"]')!;
    expect(stack.getAttribute('data-dot-stack')).toBe('25');
    expect(stack.querySelectorAll('circle')).toHaveLength(25);
    expect(container.querySelector('[data-dot-value="7"]')!.querySelectorAll('circle')).toHaveLength(1);
  });

  it('pictogram never drops symbols beyond 20 and always prints the exact frequency', () => {
    const { container } = render(
      <DataStatsLab config={{ ...base, chartKind: 'pictogram', pictogramUnit: 1, categories: [{ label: 'Maize', frequency: 25 }, { label: 'Rice', frequency: 4.5 }], expectedNumericAnswer: 25 }} />,
    );
    const maize = container.querySelector('[data-picto-row="Maize"]')!;
    expect(maize.getAttribute('data-full-symbols')).toBe('25');
    expect(maize.querySelectorAll('span.rounded-full')).toHaveLength(25);
    expect(maize.textContent).toContain('= 25');
    const rice = container.querySelector('[data-picto-row="Rice"]')!;
    expect(rice.getAttribute('data-full-symbols')).toBe('4');
    expect(rice.getAttribute('data-half-symbol')).toBe('true');
  });

  it('frequency polygon plots FREQUENCY against mid-points for equal class widths and closes to the axis', () => {
    const groupedTable = [
      { lower: 0, upper: 10, frequency: 4 },
      { lower: 10, upper: 20, frequency: 12 },
      { lower: 20, upper: 30, frequency: 8 },
    ];
    const { container } = render(<DataStatsLab config={{ ...base, chartKind: 'frequency-polygon', groupedTable, expectedNumericAnswer: 12 }} />);
    const plotted = [0, 1, 2].map((i) => container.querySelector(`[data-testid="fp-pt-${i}"]`)!.getAttribute('data-plotted-value'));
    expect(plotted).toEqual(['4', '12', '8']); // frequencies, not frequency densities (0.4, 1.2, 0.8)
    const pts = container.querySelector('[data-testid="freq-polygon-line"]')!.getAttribute('points')!.split(' ');
    expect(pts).toHaveLength(5); // two closing points on the x-axis + 3 data points
    expect(pts[0].endsWith(',120')).toBe(true);
    expect(pts[pts.length - 1].endsWith(',120')).toBe(true);
  });

  it('frequency polygon switches to frequency density when class widths are unequal', () => {
    const groupedTable = [
      { lower: 0, upper: 10, frequency: 5 },
      { lower: 10, upper: 30, frequency: 20 },
    ];
    const { container } = render(<DataStatsLab config={{ ...base, chartKind: 'frequency-polygon', groupedTable, expectedNumericAnswer: 20 }} />);
    expect(container.querySelector('[data-testid="fp-pt-0"]')!.getAttribute('data-plotted-value')).toBe('0.5');
    expect(container.querySelector('[data-testid="fp-pt-1"]')!.getAttribute('data-plotted-value')).toBe('1');
  });

  it('histogram, cumulative frequency and bar charts show a numeric y-axis that reaches the true maximum', () => {
    const groupedTable = [
      { lower: 0, upper: 5, frequency: 10 },
      { lower: 5, upper: 15, frequency: 30 },
    ];
    const hist = render(<DataStatsLab config={{ ...base, chartKind: 'histogram', groupedTable, expectedNumericAnswer: 30 }} />);
    const ticks = [...hist.container.querySelectorAll('[data-testid="y-tick"]')].map((t) => Number(t.getAttribute('data-tick-value')));
    expect(ticks).toEqual([0, 1.5, 3]); // max frequency density = 30 / 10 = 3
    const cum = render(<DataStatsLab config={{ ...base, chartKind: 'cumulative-frequency', groupedTable, expectedNumericAnswer: 40 }} />);
    expect([...cum.container.querySelectorAll('[data-testid="y-tick"]')].map((t) => Number(t.getAttribute('data-tick-value')))).toEqual([0, 20, 40]);
    const bar = render(<DataStatsLab config={{ ...base, chartKind: 'bar', categories: [{ label: 'A', frequency: 6 }, { label: 'B', frequency: 2 }], expectedNumericAnswer: 6 }} />);
    expect([...bar.container.querySelectorAll('[data-testid="y-tick"]')].map((t) => Number(t.getAttribute('data-tick-value')))).toEqual([0, 3, 6]);
  });

  it('pie sector angles equal frequency/total x 360 and sum to 360', () => {
    const categories = [{ label: 'A', frequency: 30 }, { label: 'B', frequency: 20 }, { label: 'C', frequency: 10 }];
    const { container } = render(<DataStatsLab config={{ ...base, chartKind: 'pie', categories, expectedNumericAnswer: 30 }} />);
    const angles = [0, 1, 2].map((i) => Number(container.querySelector(`[data-testid="pie-sector-${i}"]`)!.getAttribute('data-angle-deg')));
    expect(angles).toEqual([180, 120, 60]);
    expect(angles.reduce((a, b) => a + b, 0)).toBe(360);
  });
});
