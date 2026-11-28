// @vitest-environment node
/**
 * Independent, hand-calculated fixtures for the statistics engine (comprehensive audit).
 * Expected values are worked by hand, NOT produced by running the engine.
 */
import { describe, expect, it } from 'vitest';
import {
  computeDescriptiveStats,
  computeQuartiles,
  computeScatterRegression,
  computeBoxPlotModel,
  computePieChartModel,
  buildHistogramModel,
  createSeededRng,
} from './data-stats-engine';

describe('descriptive statistics against hand calculations', () => {
  // classic dataset: mean 5, population variance 4 (sd 2), sample variance 32/7
  const d = computeDescriptiveStats([2, 4, 4, 4, 5, 5, 7, 9]);
  it('mean, median, mode, range', () => {
    expect(d.mean).toBe(5);
    expect(d.median).toBe(4.5);
    expect(d.modes).toEqual([4]);
    expect(d.range).toBe(7);
  });
  it('population and sample variance / standard deviation', () => {
    expect(d.populationVariance).toBe(4);
    expect(d.populationStdDev).toBe(2);
    expect(d.sampleVariance).toBeCloseTo(32 / 7, 5);
    expect(d.sampleStdDev).toBeCloseTo(Math.sqrt(32 / 7), 5);
  });
  it('Tukey-exclusive quartiles: halves [2,4,4,4] and [5,5,7,9] -> Q1=4, Q3=6, IQR=2', () => {
    expect(d.q1).toBe(4);
    expect(d.q3).toBe(6);
    expect(d.iqr).toBe(2);
  });
  it('odd n: exclusive removes the median, inclusive keeps it', () => {
    const odd = [1, 2, 3, 4, 5];
    expect(computeQuartiles(odd, 'tukey-exclusive')).toEqual({ q1: 1.5, median: 3, q3: 4.5 });
    expect(computeQuartiles(odd, 'tukey-inclusive')).toEqual({ q1: 2, median: 3, q3: 4 });
    expect(computeQuartiles(odd, 'linear-interpolation')).toEqual({ q1: 2, median: 3, q3: 4 });
  });
  it('empty, single and constant datasets are handled honestly (no NaN, no invented values)', () => {
    expect(computeDescriptiveStats([]).mean).toBeNull();
    const one = computeDescriptiveStats([7]);
    expect(one.mean).toBe(7);
    expect(one.sampleVariance).toBeNull();
    const constant = computeDescriptiveStats([3, 3, 3]);
    expect(constant.populationVariance).toBe(0);
    expect(constant.modes).toEqual([3]); // audit regression: previously [] ("no mode") for a constant data set
  });
  it('bimodal data lists every mode; single repeated value is the mode', () => {
    expect(computeDescriptiveStats([1, 1, 2, 2]).modes).toEqual([1, 2]);
    expect(computeDescriptiveStats([1, 1, 2, 3, 3]).modes).toEqual([1, 3]);
    expect(computeDescriptiveStats([5, 6, 6, 7]).modes).toEqual([6]);
  });
  it('all-distinct data has no mode', () => {
    expect(computeDescriptiveStats([2, 4, 6, 8]).modes).toEqual([]);
  });
  it('outliers use the 1.5xIQR fences: 100 is an outlier of [1,2,3,4,5,100]', () => {
    expect(computeDescriptiveStats([1, 2, 3, 4, 5, 100]).outliers).toEqual([100]);
    const box = computeBoxPlotModel([1, 2, 3, 4, 5, 100], 'tukey-exclusive', 'tukey-1.5-iqr')!;
    expect(box.outliers).toEqual([100]);
    expect(box.upperWhisker).toBe(5); // whisker stops at the largest non-outlier
    expect(computeBoxPlotModel([1, 2, 3, 4, 5, 100], 'tukey-exclusive', 'min-max')!.upperWhisker).toBe(100);
  });
});

describe('regression and correlation against hand calculations', () => {
  // (1,2)(2,4)(3,5)(4,4)(5,5): xbar=3 ybar=4 Sxy=6 Sxx=10 Syy=6 -> m=0.6 c=2.2 r=6/sqrt(60)
  const pts = [[1, 2], [2, 4], [3, 5], [4, 4], [5, 5]].map(([x, y]) => ({ x, y }));
  const r = computeScatterRegression(pts);
  it('slope, intercept and Pearson r', () => {
    expect(r.slope).toBeCloseTo(0.6, 6);
    expect(r.intercept).toBeCloseTo(2.2, 6);
    expect(r.pearsonR).toBeCloseTo(6 / Math.sqrt(60), 5);
    expect(r.rSquared).toBeCloseTo(36 / 60, 5);
  });
  it('flags interpolation vs extrapolation', () => {
    expect(r.predict(3).isExtrapolation).toBe(false);
    expect(r.predict(8).isExtrapolation).toBe(true);
    expect(r.predict(8).y).toBeCloseTo(0.6 * 8 + 2.2, 5);
  });
  it('perfect negative correlation and zero-variance degenerate cases', () => {
    const neg = computeScatterRegression([{ x: 1, y: 6 }, { x: 2, y: 4 }, { x: 3, y: 2 }]);
    expect(neg.pearsonR).toBeCloseTo(-1, 9);
    expect(computeScatterRegression([{ x: 2, y: 1 }, { x: 2, y: 5 }]).pearsonR).toBeNull();
    expect(computeScatterRegression([{ x: 1, y: 3 }, { x: 4, y: 3 }]).pearsonR).toBeNull();
  });
});

describe('chart models against hand calculations', () => {
  it('pie: angles are frequency/total x 360 and cover exactly 360 degrees', () => {
    const s = computePieChartModel([{ label: 'A', frequency: 14 }, { label: 'B', frequency: 18 }])!;
    expect(s[0].endAngleDeg - s[0].startAngleDeg).toBeCloseTo(157.5, 6);
    expect(s[1].endAngleDeg).toBeCloseTo(360, 6);
  });
  it('pie: all-zero total is undefined (not a divide-by-zero chart)', () => {
    expect(computePieChartModel([{ label: 'A', frequency: 0 }])).toBeNull();
  });
  it('histogram: unequal widths use frequency density and bar AREA equals frequency', () => {
    const bins = buildHistogramModel([
      { lower: 0, upper: 10, frequency: 5 },
      { lower: 10, upper: 30, frequency: 20 },
      { lower: 30, upper: 40, frequency: 4 },
    ]);
    expect(bins.map((b) => b.frequencyDensity)).toEqual([0.5, 1, 0.4]);
    expect(bins.map((b) => b.barArea)).toEqual([5, 20, 4]);
  });
});

describe('seeded random experiments are reproducible and fair', () => {
  it('same seed gives the same sequence; different seeds differ; values lie in [0,1)', () => {
    const a = createSeededRng(12345);
    const b = createSeededRng(12345);
    const seqA = Array.from({ length: 50 }, () => a());
    const seqB = Array.from({ length: 50 }, () => b());
    expect(seqA).toEqual(seqB);
    expect(seqA.every((v) => v >= 0 && v < 1)).toBe(true);
    const c = createSeededRng(54321);
    expect(Array.from({ length: 50 }, () => c())).not.toEqual(seqA);
  });
  it('a die rolled 60,000 times has every face within 5% of 1/6 (chi-square style sanity)', () => {
    const rng = createSeededRng(2026);
    const counts = [0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 60000; i++) counts[Math.floor(rng() * 6)]++;
    counts.forEach((n) => expect(Math.abs(n / 60000 - 1 / 6)).toBeLessThan(0.05 / 6 * 1.5));
  });
});
