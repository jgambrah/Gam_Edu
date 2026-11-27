/**
 * GAM EDU — Step 5D Strict Discriminated Schema Validator for `labKind: 'data-stats-lab'`
 * (`construction-lab` `1.5.0`).
 *
 * Pure TypeScript, zero React/DOM dependencies.
 * Rejects invalid probabilities, negative frequencies, overlapping class intervals,
 * impossible samples, out-of-bound datasets, and malformed configurations.
 */

import { DATA_STATS_LIMITS } from './data-stats-engine';

const VALID_MODES = new Set([
  'probability-experiment',
  'descriptive-stats',
  'data-visualisation',
  'scatter-regression',
]);
const VALID_LEVELS = new Set(['primary', 'lower-secondary', 'igcse', 'as-a-level']);
const VALID_EXP_KINDS = new Set(['coin', 'die', 'spinner', 'counters']);
const VALID_QUARTILE = new Set(['tukey-exclusive', 'tukey-inclusive', 'linear-interpolation']);
const VALID_VARIANCE = new Set(['population', 'sample']);
const VALID_CHARTS = new Set([
  'bar',
  'pictogram',
  'pie',
  'dot-plot',
  'histogram',
  'frequency-polygon',
  'cumulative-frequency',
  'box-plot',
]);

const SHARED_KEYS = [
  'id',
  'engine',
  'schemaVersion',
  'minEngineVersion',
  'title',
  'instructions',
  'accessibilityLabel',
  'fallbackText',
  'hints',
  'persistCompletion',
  'labKind',
  'subjectTag',
  'modelNote',
  'prediction',
  'successExplanation',
  'curriculumLevel',
  'learningMode',
  'mode',
  'nonVisualQuestion',
] as const;

const MODE_KEYS: Record<string, ReadonlySet<string>> = {
  'probability-experiment': new Set([
    ...SHARED_KEYS,
    'experimentKind',
    'outcomes',
    'withReplacement',
    'drawsPerTrial',
    'seed',
    'targetEvent',
    'expectedAnswerKind',
    'minRequiredTrials',
    'tolerance',
  ]),
  'descriptive-stats': new Set([
    ...SHARED_KEYS,
    'data',
    'frequencyTable',
    'groupedTable',
    'quartileConvention',
    'varianceMode',
    'allowDataEditing',
    'outlierCandidate',
    'targetMeasure',
    'tolerance',
    'unit',
  ]),
  'data-visualisation': new Set([
    ...SHARED_KEYS,
    'chartKind',
    'categories',
    'rawValues',
    'groupedTable',
    'pictogramUnit',
    'quartileConvention',
    'whiskerConvention',
    'xLabel',
    'yLabel',
    'questionPrompt',
    'expectedNumericAnswer',
    'tolerance',
  ]),
  'scatter-regression': new Set([
    ...SHARED_KEYS,
    'points',
    'xLabel',
    'yLabel',
    'allowOutlierToggle',
    'outlierPoint',
    'predictX',
    'targetMeasure',
    'tolerance',
    'causationNote',
  ]),
};

function isFiniteBounded(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v) && Math.abs(v) <= DATA_STATS_LIMITS.maxNumericMagnitude;
}

function validateGroupedTable(table: unknown, ctx: string, errors: string[]) {
  if (!Array.isArray(table) || table.length < 2 || table.length > DATA_STATS_LIMITS.maxClasses) {
    errors.push(`${ctx} must have 2..${DATA_STATS_LIMITS.maxClasses} class intervals.`);
    return;
  }
  let prevUpper = -Infinity;
  let totalFreq = 0;
  table.forEach((row, i) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      errors.push(`${ctx}[${i}] must be an object.`);
      return;
    }
    const r = row as Record<string, unknown>;
    if (!isFiniteBounded(r.lower) || !isFiniteBounded(r.upper) || r.upper <= r.lower) {
      errors.push(`${ctx}[${i}] requires finite lower < upper.`);
      return;
    }
    if (r.lower < prevUpper - 1e-9) {
      errors.push(`${ctx}[${i}] overlaps with the previous class interval.`);
    }
    prevUpper = r.upper;
    if (!isFiniteBounded(r.frequency) || !Number.isInteger(r.frequency) || r.frequency < 0) {
      errors.push(`${ctx}[${i}].frequency must be a non-negative integer.`);
    } else {
      totalFreq += r.frequency;
    }
  });
  if (totalFreq <= 0) {
    errors.push(`${ctx} must have positive total frequency.`);
  }
}

export function validateDataStatsLabConfig(
  obj: Record<string, unknown>,
  errors: string[],
): void {
  const mode = obj.mode;
  if (typeof mode !== 'string' || !VALID_MODES.has(mode)) {
    errors.push('data-stats-lab "mode" must be probability-experiment, descriptive-stats, data-visualisation, or scatter-regression.');
    return;
  }

  const allowed = MODE_KEYS[mode];
  for (const k of Object.keys(obj)) {
    if (!allowed.has(k)) errors.push(`Unknown field "${k}" in data-stats-lab(${mode}).`);
  }

  if (typeof obj.curriculumLevel !== 'string' || !VALID_LEVELS.has(obj.curriculumLevel)) {
    errors.push('data-stats-lab "curriculumLevel" must be primary, lower-secondary, igcse, or as-a-level.');
  }
  if (obj.learningMode !== undefined && obj.learningMode !== 'guided' && obj.learningMode !== 'practice') {
    errors.push('data-stats-lab "learningMode" must be "guided" or "practice".');
  }
  if (obj.tolerance !== undefined && (!isFiniteBounded(obj.tolerance) || obj.tolerance <= 0)) {
    errors.push('data-stats-lab "tolerance" must be a positive finite number.');
  }

  // MODE 1: PROBABILITY EXPERIMENT
  if (mode === 'probability-experiment') {
    if (typeof obj.experimentKind !== 'string' || !VALID_EXP_KINDS.has(obj.experimentKind)) {
      errors.push('probability-experiment "experimentKind" must be coin, die, spinner, or counters.');
    }
    if (obj.withReplacement !== undefined && typeof obj.withReplacement !== 'boolean') {
      errors.push('probability-experiment "withReplacement" must be a strict boolean.');
    }
    const draws = obj.drawsPerTrial ?? 1;
    if (!isFiniteBounded(draws) || !Number.isInteger(draws) || draws < 1 || draws > DATA_STATS_LIMITS.maxDrawsPerTrial) {
      errors.push(`probability-experiment "drawsPerTrial" must be an integer 1..${DATA_STATS_LIMITS.maxDrawsPerTrial}.`);
    }
    const outcomes = obj.outcomes;
    let totalPop = 0;
    const outcomeIds = new Set<string>();
    if (!Array.isArray(outcomes) || outcomes.length < 2 || outcomes.length > DATA_STATS_LIMITS.maxOutcomes) {
      errors.push(`probability-experiment requires 2..${DATA_STATS_LIMITS.maxOutcomes} outcomes.`);
    } else {
      outcomes.forEach((o, i) => {
        if (!o || typeof o !== 'object' || Array.isArray(o)) {
          errors.push(`outcomes[${i}] must be an object.`);
          return;
        }
        const rec = o as Record<string, unknown>;
        if (typeof rec.id !== 'string' || !rec.id.trim() || typeof rec.label !== 'string' || !rec.label.trim()) {
          errors.push(`outcomes[${i}] requires non-empty string id and label.`);
        } else if (outcomeIds.has(rec.id)) {
          errors.push(`Duplicate outcome id "${rec.id}".`);
        } else {
          outcomeIds.add(rec.id);
        }
        if (obj.experimentKind === 'counters') {
          const c = rec.count;
          if (!isFiniteBounded(c) || !Number.isInteger(c) || c < 0) {
            errors.push(`counters outcomes[${i}].count must be a non-negative integer.`);
          } else {
            totalPop += c;
          }
        } else if (rec.weight !== undefined) {
          if (!isFiniteBounded(rec.weight) || rec.weight <= 0) {
            errors.push(`outcomes[${i}].weight must be a positive finite number.`);
          }
        }
      });
      if (obj.experimentKind === 'counters') {
        if (totalPop <= 0 || totalPop > DATA_STATS_LIMITS.maxPopulation) {
          errors.push(`counters total population (${totalPop}) must be within 1..${DATA_STATS_LIMITS.maxPopulation}.`);
        }
        if (obj.withReplacement === false && typeof draws === 'number' && draws > totalPop) {
          errors.push(`Impossible sampling without replacement: drawsPerTrial (${draws}) exceeds population (${totalPop}).`);
        }
      }
    }
    if (!obj.targetEvent || typeof obj.targetEvent !== 'object' || Array.isArray(obj.targetEvent)) {
      errors.push('probability-experiment requires a targetEvent object.');
    } else {
      const evt = obj.targetEvent as Record<string, unknown>;
      if (evt.kind === 'outcome-equals' || evt.kind === 'at-least-one') {
        if (typeof evt.outcomeId !== 'string' || !outcomeIds.has(evt.outcomeId)) {
          errors.push(`targetEvent.outcomeId "${String(evt.outcomeId)}" is not a declared outcome.`);
        }
      } else if (evt.kind === 'exact-sequence') {
        if (!Array.isArray(evt.sequence) || evt.sequence.length !== draws || evt.sequence.some((id) => typeof id !== 'string' || !outcomeIds.has(id))) {
          errors.push(`targetEvent.sequence must have length ${draws} referencing declared outcome IDs.`);
        }
      }
    }
    if (obj.minRequiredTrials !== undefined && (!isFiniteBounded(obj.minRequiredTrials) || !Number.isInteger(obj.minRequiredTrials) || obj.minRequiredTrials < 1 || obj.minRequiredTrials > DATA_STATS_LIMITS.maxTrialsTotal)) {
      errors.push(`minRequiredTrials must be an integer 1..${DATA_STATS_LIMITS.maxTrialsTotal}.`);
    }
    return;
  }

  // MODE 2: DESCRIPTIVE STATS
  if (mode === 'descriptive-stats') {
    if (obj.quartileConvention !== undefined && (typeof obj.quartileConvention !== 'string' || !VALID_QUARTILE.has(obj.quartileConvention))) {
      errors.push('descriptive-stats quartileConvention is invalid.');
    }
    if (obj.varianceMode !== undefined && (typeof obj.varianceMode !== 'string' || !VALID_VARIANCE.has(obj.varianceMode))) {
      errors.push('descriptive-stats varianceMode must be "population" or "sample".');
    }
    if (obj.groupedTable !== undefined && obj.targetMeasure === 'mode') {
      errors.push('Exact "mode" is not a supported targetMeasure for groupedTable data.');
    }
    const sources = [obj.data !== undefined, obj.frequencyTable !== undefined, obj.groupedTable !== undefined].filter(Boolean).length;
    if (sources !== 1) {
      errors.push('descriptive-stats requires exactly one of data, frequencyTable, or groupedTable.');
    }
    if (obj.data !== undefined) {
      if (!Array.isArray(obj.data) || obj.data.length === 0 || obj.data.length > DATA_STATS_LIMITS.maxDatasetSize || obj.data.some((v) => !isFiniteBounded(v))) {
        errors.push(`descriptive-stats data must contain 1..${DATA_STATS_LIMITS.maxDatasetSize} finite numbers.`);
      }
    }
    if (obj.frequencyTable !== undefined) {
      if (!Array.isArray(obj.frequencyTable) || obj.frequencyTable.length === 0 || obj.frequencyTable.length > DATA_STATS_LIMITS.maxCategories) {
        errors.push(`descriptive-stats frequencyTable requires 1..${DATA_STATS_LIMITS.maxCategories} rows.`);
      } else {
        let total = 0;
        obj.frequencyTable.forEach((r, i) => {
          const rec = r as Record<string, unknown>;
          if (!isFiniteBounded(rec?.value) || !isFiniteBounded(rec?.frequency) || !Number.isInteger(rec.frequency) || rec.frequency < 0) {
            errors.push(`frequencyTable[${i}] requires finite value and non-negative integer frequency.`);
          } else {
            total += rec.frequency;
          }
        });
        if (total <= 0 || total > DATA_STATS_LIMITS.maxDatasetSize) {
          errors.push(`frequencyTable total observations (${total}) must be 1..${DATA_STATS_LIMITS.maxDatasetSize}.`);
        }
      }
    }
    if (obj.groupedTable !== undefined) {
      validateGroupedTable(obj.groupedTable, 'groupedTable', errors);
    }
    return;
  }

  // MODE 3: DATA VISUALISATION
  if (mode === 'data-visualisation') {
    if (typeof obj.chartKind !== 'string' || !VALID_CHARTS.has(obj.chartKind)) {
      errors.push('data-visualisation "chartKind" is invalid.');
      return;
    }
    if (obj.chartKind === 'histogram' || obj.chartKind === 'frequency-polygon' || obj.chartKind === 'cumulative-frequency') {
      validateGroupedTable(obj.groupedTable, `${obj.chartKind}.groupedTable`, errors);
    } else if (obj.chartKind === 'bar' || obj.chartKind === 'pictogram' || obj.chartKind === 'pie') {
      const cats = obj.categories;
      if (!Array.isArray(cats) || cats.length < 2 || cats.length > DATA_STATS_LIMITS.maxCategories) {
        errors.push(`${obj.chartKind} requires 2..${DATA_STATS_LIMITS.maxCategories} categories.`);
      } else {
        let total = 0;
        cats.forEach((c, i) => {
          const rec = c as Record<string, unknown>;
          if (typeof rec?.label !== 'string' || !rec.label.trim() || !isFiniteBounded(rec?.frequency) || rec.frequency < 0) {
            errors.push(`categories[${i}] requires non-empty label and non-negative finite frequency.`);
          } else {
            total += rec.frequency;
          }
        });
        if (obj.chartKind === 'pie' && total <= 0) {
          errors.push('pie chart requires a positive total frequency.');
        }
        if (obj.chartKind === 'pictogram' && obj.pictogramUnit !== undefined && (!isFiniteBounded(obj.pictogramUnit) || obj.pictogramUnit <= 0)) {
          errors.push('pictogram pictogramUnit must be > 0.');
        }
      }
    } else {
      const vals = obj.rawValues;
      if (!Array.isArray(vals) || vals.length < 3 || vals.length > DATA_STATS_LIMITS.maxDatasetSize || vals.some((v) => !isFiniteBounded(v))) {
        errors.push(`${obj.chartKind} requires 3..${DATA_STATS_LIMITS.maxDatasetSize} finite rawValues.`);
      }
    }
    return;
  }

  // MODE 4: SCATTER REGRESSION
  const pts = obj.points;
  if (!Array.isArray(pts) || pts.length < 3 || pts.length > DATA_STATS_LIMITS.maxPoints) {
    errors.push(`scatter-regression requires 3..${DATA_STATS_LIMITS.maxPoints} points.`);
  } else {
    pts.forEach((p, i) => {
      const rec = p as Record<string, unknown>;
      if (!isFiniteBounded(rec?.x) || !isFiniteBounded(rec?.y)) {
        errors.push(`points[${i}] requires finite x and y coordinates.`);
      }
    });
  }
  if (typeof obj.xLabel !== 'string' || !obj.xLabel.trim() || typeof obj.yLabel !== 'string' || !obj.yLabel.trim()) {
    errors.push('scatter-regression requires non-empty xLabel and yLabel.');
  }
}
