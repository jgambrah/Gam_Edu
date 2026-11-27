/**
 * GAM EDU — Step 5D Pure TypeScript Engine: Probability & Statistics Laboratory
 * (`construction-lab`, `labKind: 'data-stats-lab'`, `engineVersion: '1.5.0'`)
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies, zero eval().
 * Supports 4 discriminated modes:
 *  1. `probability-experiment` — coins, dice, spinners, coloured counters (with & without replacement),
 *     single & compound events, deterministic seeded PRNG (`mulberry32`), theoretical vs experimental
 *     probability, relative frequency, sample spaces & bounded tree diagrams.
 *  2. `descriptive-stats` — raw data, frequency tables, grouped frequency tables (clearly distinguishing
 *     exact statistics from grouped estimates), mean, median, mode (none/single/multi), range, explicit
 *     configurable quartile conventions, IQR, population vs sample variance/SD, weighted mean, outliers.
 *  3. `data-visualisation` — bar chart, pictogram, pie chart, dot plot, histogram (frequency density =
 *     frequency / classWidth for unequal class widths), frequency polygon, cumulative frequency, box plot.
 *  4. `scatter-regression` — Pearson r, stable two-pass simple linear regression (y = mx + c),
 *     interpolation vs extrapolation, outlier sensitivity, degenerate dataset handling, correlation != causation.
 */

export const DATA_STATS_LIMITS = {
  maxDatasetSize: 200,
  maxCategories: 12,
  maxClasses: 12,
  maxTrialsTotal: 5000,
  maxBatchSize: 500,
  maxPopulation: 100,
  maxPoints: 100,
  maxOutcomes: 12,
  maxDrawsPerTrial: 3,
  maxNumericMagnitude: 1e9,
} as const;

export type DataStatsMode =
  | 'probability-experiment'
  | 'descriptive-stats'
  | 'data-visualisation'
  | 'scatter-regression';

export type ProbabilityExperimentKind = 'coin' | 'die' | 'spinner' | 'counters';
export type QuartileConvention = 'tukey-exclusive' | 'tukey-inclusive' | 'linear-interpolation';
export type VarianceMode = 'population' | 'sample';
export type StatsChartKind =
  | 'bar'
  | 'pictogram'
  | 'pie'
  | 'dot-plot'
  | 'histogram'
  | 'frequency-polygon'
  | 'cumulative-frequency'
  | 'box-plot';

export interface ProbabilityOutcomeDef {
  id: string;
  label: string;
  /** Relative weight/probability for spinner/coin/die (defaults to 1) */
  weight?: number;
  /** Integer count in bag/urn for counters (sampling with or without replacement) */
  count?: number;
  /** Numeric face value for die sum events */
  numericValue?: number;
  color?: string;
}

export interface TargetProbabilityEvent {
  kind: 'outcome-equals' | 'at-least-one' | 'exact-sequence' | 'sum-equals';
  outcomeId?: string;
  sequence?: string[];
  targetSum?: number;
  description: string;
}

export interface ProbabilityExperimentSpec {
  mode: 'probability-experiment';
  experimentKind: ProbabilityExperimentKind;
  outcomes: ProbabilityOutcomeDef[];
  withReplacement?: boolean;
  drawsPerTrial?: number;
  seed?: number;
  targetEvent: TargetProbabilityEvent;
  expectedAnswerKind?: 'theoretical-probability' | 'experimental-observation';
  tolerance?: number;
}

export interface FrequencyRow {
  value: number;
  frequency: number;
}

export interface GroupedClassRow {
  lower: number;
  upper: number;
  frequency: number;
}

export interface DescriptiveStatsSpec {
  mode: 'descriptive-stats';
  data?: number[];
  frequencyTable?: FrequencyRow[];
  groupedTable?: GroupedClassRow[];
  quartileConvention?: QuartileConvention;
  varianceMode?: VarianceMode;
  allowDataEditing?: boolean;
  outlierCandidate?: number;
  targetMeasure:
    | 'mean'
    | 'estimated-mean'
    | 'median'
    | 'mode'
    | 'range'
    | 'iqr'
    | 'q1'
    | 'q3'
    | 'population-sd'
    | 'sample-sd'
    | 'population-variance'
    | 'sample-variance';
  tolerance?: number;
  unit?: string;
}

export interface CategoryRow {
  label: string;
  frequency: number;
  color?: string;
}

export interface DataVisualisationSpec {
  mode: 'data-visualisation';
  chartKind: StatsChartKind;
  categories?: CategoryRow[];
  rawValues?: number[];
  groupedTable?: GroupedClassRow[];
  pictogramUnit?: number;
  quartileConvention?: QuartileConvention;
  whiskerConvention?: 'min-max' | 'tukey-1.5-iqr';
  xLabel?: string;
  yLabel?: string;
  questionPrompt?: string;
  expectedNumericAnswer?: number;
  tolerance?: number;
}

export interface ScatterPoint {
  x: number;
  y: number;
  label?: string;
}

export interface ScatterRegressionSpec {
  mode: 'scatter-regression';
  points: ScatterPoint[];
  xLabel: string;
  yLabel: string;
  allowOutlierToggle?: boolean;
  outlierPoint?: ScatterPoint;
  predictX?: number;
  targetMeasure: 'pearson-r' | 'slope' | 'intercept' | 'predicted-y';
  tolerance?: number;
  causationNote?: string;
}

export type DataStatsSpec =
  | ProbabilityExperimentSpec
  | DescriptiveStatsSpec
  | DataVisualisationSpec
  | ScatterRegressionSpec;

export function roundClean(v: number, dp = 6): number {
  const f = Math.pow(10, dp);
  return Math.round((v + Number.EPSILON) * f) / f;
}

/**
 * Deterministic stateful mulberry32 PRNG.
 * Each call advances internal state — NEVER resets to the same seed per trial.
 */
export function createSeededRng(seed: number): () => number {
  let a = (seed >>> 0) || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ============================================================================
// 1. PROBABILITY EXPERIMENTS (Theoretical & Deterministic Seeded Simulation)
// ============================================================================

export function computeTheoreticalProbability(spec: ProbabilityExperimentSpec): number {
  const draws = spec.drawsPerTrial ?? 1;
  const withRep = spec.withReplacement !== false;
  const evt = spec.targetEvent;

  // Build initial weights/counts
  const items = spec.outcomes.map((o) => ({
    id: o.id,
    val: o.numericValue ?? 0,
    w: spec.experimentKind === 'counters' ? (o.count ?? 1) : (o.weight ?? 1),
  }));
  const totalW = items.reduce((s, it) => s + it.w, 0);
  if (totalW <= 0) return 0;

  if (draws === 1) {
    if (evt.kind === 'outcome-equals' || evt.kind === 'at-least-one') {
      const target = items.find((it) => it.id === evt.outcomeId);
      return target ? roundClean(target.w / totalW, 8) : 0;
    }
    if (evt.kind === 'exact-sequence' && evt.sequence?.length === 1) {
      const target = items.find((it) => it.id === evt.sequence![0]);
      return target ? roundClean(target.w / totalW, 8) : 0;
    }
    if (evt.kind === 'sum-equals' && evt.targetSum !== undefined) {
      const matchW = items.filter((it) => it.val === evt.targetSum).reduce((s, it) => s + it.w, 0);
      return roundClean(matchW / totalW, 8);
    }
    return 0;
  }

  // Exact enumeration over bounded compound sample space (draws <= 3, outcomes <= 12 -> <= 1728 branches)
  let eventProb = 0;
  const recurse = (depth: number, probSoFar: number, seq: string[], sumSoFar: number, rem: number[]) => {
    if (depth === draws) {
      let match = false;
      if (evt.kind === 'outcome-equals' && evt.outcomeId) {
        match = seq.every((id) => id === evt.outcomeId);
      } else if (evt.kind === 'at-least-one' && evt.outcomeId) {
        match = seq.includes(evt.outcomeId);
      } else if (evt.kind === 'exact-sequence' && evt.sequence) {
        match = seq.length === evt.sequence.length && seq.every((id, i) => id === evt.sequence![i]);
      } else if (evt.kind === 'sum-equals' && evt.targetSum !== undefined) {
        match = sumSoFar === evt.targetSum;
      }
      if (match) eventProb += probSoFar;
      return;
    }

    const remTotal = rem.reduce((a, b) => a + b, 0);
    if (remTotal <= 0) return;

    for (let i = 0; i < items.length; i++) {
      if (rem[i] <= 0) continue;
      const p = rem[i] / remTotal;
      const nextRem = withRep ? rem : rem.map((c, idx) => (idx === i ? c - 1 : c));
      recurse(depth + 1, probSoFar * p, [...seq, items[i].id], sumSoFar + items[i].val, nextRem);
    }
  };

  recurse(0, 1, [], 0, items.map((it) => it.w));
  return roundClean(eventProb, 8);
}

export interface ProbabilityTrialResult {
  drawnIds: string[];
  eventOccurred: boolean;
}

export interface ProbabilityBatchSummary {
  totalTrials: number;
  eventHits: number;
  experimentalProbability: number;
  theoreticalProbability: number;
  outcomeCounts: Record<string, number>;
  recentTrials: ProbabilityTrialResult[];
}

export function runProbabilityBatch(
  spec: ProbabilityExperimentSpec,
  trialCount: number,
  rng: () => number,
): ProbabilityBatchSummary {
  const draws = spec.drawsPerTrial ?? 1;
  const withRep = spec.withReplacement !== false;
  const evt = spec.targetEvent;
  const boundedCount = Math.max(0, Math.min(trialCount, DATA_STATS_LIMITS.maxBatchSize));

  const baseWeights = spec.outcomes.map((o) =>
    spec.experimentKind === 'counters' ? (o.count ?? 1) : (o.weight ?? 1),
  );
  const outcomeCounts: Record<string, number> = {};
  for (const o of spec.outcomes) outcomeCounts[o.id] = 0;

  let eventHits = 0;
  const recentTrials: ProbabilityTrialResult[] = [];

  for (let t = 0; t < boundedCount; t++) {
    const pool = [...baseWeights];
    const drawnIds: string[] = [];
    let sumVal = 0;

    for (let d = 0; d < draws; d++) {
      const poolTotal = pool.reduce((a, b) => a + b, 0);
      if (poolTotal <= 0) break;
      const r = rng() * poolTotal;
      let acc = 0;
      let chosenIdx = pool.length - 1;
      for (let i = 0; i < pool.length; i++) {
        if (pool[i] <= 0) continue;
        acc += pool[i];
        if (r < acc) {
          chosenIdx = i;
          break;
        }
      }
      const chosen = spec.outcomes[chosenIdx];
      drawnIds.push(chosen.id);
      sumVal += chosen.numericValue ?? 0;
      outcomeCounts[chosen.id] = (outcomeCounts[chosen.id] ?? 0) + 1;
      if (!withRep) pool[chosenIdx] = Math.max(0, pool[chosenIdx] - 1);
    }

    let hit = false;
    if (evt.kind === 'outcome-equals' && evt.outcomeId) {
      hit = drawnIds.length === draws && drawnIds.every((id) => id === evt.outcomeId);
    } else if (evt.kind === 'at-least-one' && evt.outcomeId) {
      hit = drawnIds.includes(evt.outcomeId);
    } else if (evt.kind === 'exact-sequence' && evt.sequence) {
      hit =
        drawnIds.length === evt.sequence.length &&
        drawnIds.every((id, idx) => id === evt.sequence![idx]);
    } else if (evt.kind === 'sum-equals' && evt.targetSum !== undefined) {
      hit = sumVal === evt.targetSum;
    }

    if (hit) eventHits++;
    if (recentTrials.length < 12) {
      recentTrials.push({ drawnIds, eventOccurred: hit });
    }
  }

  return {
    totalTrials: boundedCount,
    eventHits,
    experimentalProbability: boundedCount > 0 ? roundClean(eventHits / boundedCount, 6) : 0,
    theoreticalProbability: computeTheoreticalProbability(spec),
    outcomeCounts,
    recentTrials,
  };
}

// ============================================================================
// 2. DESCRIPTIVE STATISTICS (Exact vs Grouped Estimates, Explicit Quartiles)
// ============================================================================

export interface DescriptiveStatsSummary {
  n: number;
  isGroupedEstimate: boolean;
  mean: number | null;
  median: number | null;
  modes: number[];
  min: number | null;
  max: number | null;
  range: number | null;
  q1: number | null;
  q3: number | null;
  iqr: number | null;
  populationVariance: number | null;
  populationStdDev: number | null;
  sampleVariance: number | null;
  sampleStdDev: number | null;
  outliers: number[];
  quartileConvention: QuartileConvention;
}

function medianOfSorted(sorted: number[]): number {
  const n = sorted.length;
  const mid = Math.floor(n / 2);
  return n % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function computeQuartiles(
  sorted: number[],
  convention: QuartileConvention = 'tukey-exclusive',
): { q1: number | null; median: number | null; q3: number | null } {
  const n = sorted.length;
  if (n === 0) return { q1: null, median: null, q3: null };
  const med = roundClean(medianOfSorted(sorted), 6);
  if (n < 2) return { q1: med, median: med, q3: med };

  if (convention === 'linear-interpolation') {
    const quantile = (p: number) => {
      const pos = p * (n - 1);
      const lo = Math.floor(pos);
      const hi = Math.ceil(pos);
      const frac = pos - lo;
      return sorted[lo] + frac * (sorted[hi] - sorted[lo]);
    };
    return {
      q1: roundClean(quantile(0.25), 6),
      median: med,
      q3: roundClean(quantile(0.75), 6),
    };
  }

  const mid = Math.floor(n / 2);
  const lowerHalf =
    n % 2 === 1 && convention === 'tukey-inclusive' ? sorted.slice(0, mid + 1) : sorted.slice(0, mid);
  const upperHalf =
    n % 2 === 1 && convention === 'tukey-inclusive'
      ? sorted.slice(mid)
      : sorted.slice(n % 2 === 1 ? mid + 1 : mid);

  return {
    q1: roundClean(medianOfSorted(lowerHalf), 6),
    median: med,
    q3: roundClean(medianOfSorted(upperHalf), 6),
  };
}

export function computeDescriptiveStats(
  values: ReadonlyArray<number>,
  quartileConvention: QuartileConvention = 'tukey-exclusive',
): DescriptiveStatsSummary {
  const n = values.length;
  if (n === 0) {
    return {
      n: 0,
      isGroupedEstimate: false,
      mean: null,
      median: null,
      modes: [],
      min: null,
      max: null,
      range: null,
      q1: null,
      q3: null,
      iqr: null,
      populationVariance: null,
      populationStdDev: null,
      sampleVariance: null,
      sampleStdDev: null,
      outliers: [],
      quartileConvention,
    };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const { q1, median, q3 } = computeQuartiles(sorted, quartileConvention);
  const iqr = q1 !== null && q3 !== null ? roundClean(q3 - q1, 6) : null;

  // Mode(s): returns [] if all values have equal frequency (no mode)
  const freqMap = new Map<number, number>();
  let maxFreq = 0;
  for (const v of sorted) {
    const f = (freqMap.get(v) ?? 0) + 1;
    freqMap.set(v, f);
    if (f > maxFreq) maxFreq = f;
  }
  const uniqueVals = Array.from(freqMap.keys());
  const allEqualFreq = uniqueVals.every((k) => freqMap.get(k) === maxFreq);
  const modes = allEqualFreq || maxFreq <= 1 ? [] : uniqueVals.filter((k) => freqMap.get(k) === maxFreq);

  // Two-pass centred sum of squares for numerical stability
  let ss = 0;
  for (const v of sorted) {
    const d = v - mean;
    ss += d * d;
  }
  const popVar = ss / n;
  const popSd = Math.sqrt(popVar);
  const sampVar = n >= 2 ? ss / (n - 1) : null;
  const sampSd = sampVar !== null ? Math.sqrt(sampVar) : null;

  const outliers =
    q1 !== null && q3 !== null && iqr !== null
      ? sorted.filter((v) => v < q1 - 1.5 * iqr || v > q3 + 1.5 * iqr)
      : [];

  return {
    n,
    isGroupedEstimate: false,
    mean: roundClean(mean, 6),
    median,
    modes,
    min: sorted[0],
    max: sorted[n - 1],
    range: roundClean(sorted[n - 1] - sorted[0], 6),
    q1,
    q3,
    iqr,
    populationVariance: roundClean(popVar, 6),
    populationStdDev: roundClean(popSd, 6),
    sampleVariance: sampVar !== null ? roundClean(sampVar, 6) : null,
    sampleStdDev: sampSd !== null ? roundClean(sampSd, 6) : null,
    outliers,
    quartileConvention,
  };
}

export function expandFrequencyTable(table: ReadonlyArray<FrequencyRow>): number[] {
  const out: number[] = [];
  for (const row of table) {
    for (let i = 0; i < row.frequency; i++) out.push(row.value);
  }
  return out;
}

export function computeGroupedStats(
  grouped: ReadonlyArray<GroupedClassRow>,
  quartileConvention: QuartileConvention = 'tukey-exclusive',
): DescriptiveStatsSummary {
  const totalFreq = grouped.reduce((s, r) => s + r.frequency, 0);
  if (totalFreq <= 0) {
    return { ...computeDescriptiveStats([], quartileConvention), isGroupedEstimate: true };
  }
  let sumFx = 0;
  for (const r of grouped) {
    const mid = (r.lower + r.upper) / 2;
    sumFx += r.frequency * mid;
  }
  const estMean = sumFx / totalFreq;

  // Linear interpolation inside grouped classes for median, Q1, Q3
  const interpAt = (targetRank: number): number => {
    let cum = 0;
    for (const r of grouped) {
      if (cum + r.frequency >= targetRank && r.frequency > 0) {
        const frac = (targetRank - cum) / r.frequency;
        return r.lower + frac * (r.upper - r.lower);
      }
      cum += r.frequency;
    }
    return grouped[grouped.length - 1].upper;
  };

  const q1 = roundClean(interpAt(totalFreq * 0.25), 6);
  const median = roundClean(interpAt(totalFreq * 0.5), 6);
  const q3 = roundClean(interpAt(totalFreq * 0.75), 6);
  const iqr = roundClean(q3 - q1, 6);

  let ss = 0;
  for (const r of grouped) {
    const mid = (r.lower + r.upper) / 2;
    const d = mid - estMean;
    ss += r.frequency * d * d;
  }
  const popVar = ss / totalFreq;
  const sampVar = totalFreq >= 2 ? ss / (totalFreq - 1) : null;

  return {
    n: totalFreq,
    isGroupedEstimate: true,
    mean: roundClean(estMean, 6),
    median,
    modes: [],
    min: grouped[0].lower,
    max: grouped[grouped.length - 1].upper,
    range: roundClean(grouped[grouped.length - 1].upper - grouped[0].lower, 6),
    q1,
    q3,
    iqr,
    populationVariance: roundClean(popVar, 6),
    populationStdDev: roundClean(Math.sqrt(popVar), 6),
    sampleVariance: sampVar !== null ? roundClean(sampVar, 6) : null,
    sampleStdDev: sampVar !== null ? roundClean(Math.sqrt(sampVar), 6) : null,
    outliers: [],
    quartileConvention,
  };
}

// ============================================================================
// 3. HISTOGRAM FREQUENCY DENSITY & CUMULATIVE FREQUENCY
// ============================================================================

export interface HistogramBinModel {
  lower: number;
  upper: number;
  classWidth: number;
  frequency: number;
  frequencyDensity: number;
  midpoint: number;
  barArea: number;
}

export function buildHistogramModel(grouped: ReadonlyArray<GroupedClassRow>): HistogramBinModel[] {
  return grouped.map((g) => {
    const classWidth = roundClean(g.upper - g.lower, 6);
    const frequencyDensity = classWidth > 0 ? roundClean(g.frequency / classWidth, 6) : 0;
    return {
      lower: g.lower,
      upper: g.upper,
      classWidth,
      frequency: g.frequency,
      frequencyDensity,
      midpoint: roundClean((g.lower + g.upper) / 2, 6),
      barArea: roundClean(frequencyDensity * classWidth, 6),
    };
  });
}

export function buildCumulativeFrequency(
  grouped: ReadonlyArray<GroupedClassRow>,
): Array<{ x: number; cumulativeFrequency: number }> {
  if (grouped.length === 0) return [];
  const pts: Array<{ x: number; cumulativeFrequency: number }> = [
    { x: grouped[0].lower, cumulativeFrequency: 0 },
  ];
  let cum = 0;
  for (const g of grouped) {
    cum += g.frequency;
    pts.push({ x: g.upper, cumulativeFrequency: cum });
  }
  return pts;
}

// ============================================================================
// 4. SCATTERPLOT, PEARSON CORRELATION & SIMPLE LINEAR REGRESSION
// ============================================================================

export interface RegressionSummary {
  n: number;
  meanX: number | null;
  meanY: number | null;
  pearsonR: number | null;
  rSquared: number | null;
  slope: number | null;
  intercept: number | null;
  isDegenerate: boolean;
  correlationLabel: string;
  minX: number | null;
  maxX: number | null;
  predict: (x: number) => { y: number | null; isExtrapolation: boolean };
}

export function computeScatterRegression(points: ReadonlyArray<ScatterPoint>): RegressionSummary {
  const n = points.length;
  if (n < 2) {
    return {
      n,
      meanX: n === 1 ? points[0].x : null,
      meanY: n === 1 ? points[0].y : null,
      pearsonR: null,
      rSquared: null,
      slope: null,
      intercept: null,
      isDegenerate: true,
      correlationLabel: 'Undefined (insufficient data)',
      minX: n === 1 ? points[0].x : null,
      maxX: n === 1 ? points[0].x : null,
      predict: () => ({ y: null, isExtrapolation: false }),
    };
  }

  let sumX = 0;
  let sumY = 0;
  let minX = points[0].x;
  let maxX = points[0].x;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
  }
  const meanX = sumX / n;
  const meanY = sumY / n;

  // Two-pass centred sums for numerical stability
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (const p of points) {
    const dx = p.x - meanX;
    const dy = p.y - meanY;
    sxx += dx * dx;
    syy += dy * dy;
    sxy += dx * dy;
  }

  if (sxx === 0 || syy === 0) {
    return {
      n,
      meanX: roundClean(meanX, 6),
      meanY: roundClean(meanY, 6),
      pearsonR: null,
      rSquared: null,
      slope: sxx === 0 ? null : 0,
      intercept: sxx === 0 ? null : roundClean(meanY, 6),
      isDegenerate: true,
      correlationLabel: 'Undefined (zero variance in X or Y)',
      minX,
      maxX,
      predict: (x: number) => ({
        y: sxx === 0 ? null : roundClean(meanY, 6),
        isExtrapolation: x < minX || x > maxX,
      }),
    };
  }

  const r = Math.max(-1, Math.min(1, sxy / Math.sqrt(sxx * syy)));
  const slope = sxy / sxx;
  const intercept = meanY - slope * meanX;
  const absR = Math.abs(r);
  const dir = r >= 0 ? 'positive' : 'negative';
  const correlationLabel =
    absR >= 0.8
      ? `Strong ${dir} linear correlation`
      : absR >= 0.5
        ? `Moderate ${dir} linear correlation`
        : absR >= 0.25
          ? `Weak ${dir} linear correlation`
          : 'Negligible linear correlation';

  return {
    n,
    meanX: roundClean(meanX, 6),
    meanY: roundClean(meanY, 6),
    pearsonR: roundClean(r, 6),
    rSquared: roundClean(r * r, 6),
    slope: roundClean(slope, 6),
    intercept: roundClean(intercept, 6),
    isDegenerate: false,
    correlationLabel,
    minX,
    maxX,
    predict: (x: number) => ({
      y: roundClean(slope * x + intercept, 6),
      isExtrapolation: x < minX || x > maxX,
    }),
  };
}

// ============================================================================
// 5. UNIFIED ANSWER EVALUATOR FOR DATA-STATS-LAB
// ============================================================================

export interface DataStatsEvalResult {
  passed: boolean;
  expectedValue: number | null;
  feedback: string;
}

export function parseFractionOrDecimal(raw: string): number | null {
  const s = raw.trim();
  if (!s) return null;
  if (/^[+-]?\d+\s*\/\s*[+-]?\d+$/.test(s)) {
    const [num, den] = s.split('/').map((x) => Number(x.trim()));
    if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return null;
    return num / den;
  }
  if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)) {
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function evaluateDataStatsAnswer(
  spec: DataStatsSpec,
  answerText: string,
  activeDatasetOverride?: number[],
  includeOutlier?: boolean,
): DataStatsEvalResult {
  const parsed = parseFractionOrDecimal(answerText);
  if (parsed === null) {
    return {
      passed: false,
      expectedValue: null,
      feedback: 'Enter a valid decimal or fraction (for example 0.25 or 1/4).',
    };
  }

  if (spec.mode === 'probability-experiment') {
    const expected = computeTheoreticalProbability(spec);
    const tol = spec.tolerance ?? 0.01;
    const ok = Math.abs(parsed - expected) <= tol;
    return {
      passed: ok,
      expectedValue: expected,
      feedback: ok
        ? `Verified! Theoretical probability is ${expected} (remember: experimental relative frequency fluctuates around the theoretical value).`
        : `Not quite — check the sample space${spec.withReplacement === false ? ' (remember counts decrease without replacement!)' : ''}.`,
    };
  }

  if (spec.mode === 'descriptive-stats') {
    const stats = spec.groupedTable
      ? computeGroupedStats(spec.groupedTable, spec.quartileConvention)
      : computeDescriptiveStats(
          activeDatasetOverride ??
            (spec.frequencyTable ? expandFrequencyTable(spec.frequencyTable) : spec.data ?? []),
          spec.quartileConvention,
        );
    const map: Record<DescriptiveStatsSpec['targetMeasure'], number | null> = {
      mean: stats.mean,
      'estimated-mean': stats.mean,
      median: stats.median,
      mode: stats.modes[0] ?? null,
      range: stats.range,
      iqr: stats.iqr,
      q1: stats.q1,
      q3: stats.q3,
      'population-sd': stats.populationStdDev,
      'sample-sd': stats.sampleStdDev,
      'population-variance': stats.populationVariance,
      'sample-variance': stats.sampleVariance,
    };
    const expected = map[spec.targetMeasure];
    if (expected === null) {
      return { passed: false, expectedValue: null, feedback: 'Target statistic is undefined for this dataset.' };
    }
    const tol = spec.tolerance ?? 0.05;
    const ok = Math.abs(parsed - expected) <= tol;
    return {
      passed: ok,
      expectedValue: expected,
      feedback: ok
        ? `Verified! ${stats.isGroupedEstimate ? 'Grouped-data estimate' : 'Exact value'} = ${expected}${spec.unit ? ` ${spec.unit}` : ''}.`
        : `Check your calculation for ${spec.targetMeasure}${spec.varianceMode ? ` (${spec.varianceMode} formula)` : ''}.`,
    };
  }

  if (spec.mode === 'data-visualisation') {
    const expected = spec.expectedNumericAnswer ?? null;
    if (expected === null) {
      return { passed: true, expectedValue: null, feedback: 'Exploration recorded.' };
    }
    const tol = spec.tolerance ?? 0.1;
    const ok = Math.abs(parsed - expected) <= tol;
    return {
      passed: ok,
      expectedValue: expected,
      feedback: ok
        ? `Verified! Accurate reading (${expected}) from the ${spec.chartKind}.`
        : `Recheck the ${spec.chartKind} scale${spec.chartKind === 'histogram' ? ' (remember: bar area = frequency density × class width)' : ''}.`,
    };
  }

  // scatter-regression
  const pts =
    includeOutlier && spec.outlierPoint ? [...spec.points, spec.outlierPoint] : spec.points;
  const reg = computeScatterRegression(pts);
  const expected =
    spec.targetMeasure === 'pearson-r'
      ? reg.pearsonR
      : spec.targetMeasure === 'slope'
        ? reg.slope
        : spec.targetMeasure === 'intercept'
          ? reg.intercept
          : spec.predictX !== undefined
            ? reg.predict(spec.predictX).y
            : null;
  if (expected === null) {
    return { passed: false, expectedValue: null, feedback: 'Correlation/regression is undefined for this degenerate dataset.' };
  }
  const tol = spec.tolerance ?? 0.05;
  const ok = Math.abs(parsed - expected) <= tol;
  return {
    passed: ok,
    expectedValue: expected,
    feedback: ok
      ? `Verified! ${spec.targetMeasure} = ${expected}. Remember: correlation does not prove causation.`
      : `Recheck your ${spec.targetMeasure} calculation using the plotted points.`,
  };
}
