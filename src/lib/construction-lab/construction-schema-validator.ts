/**
 * GAM EDU — Step 4D Strict Discriminated Construction Lab Schema Validator
 *
 * Pure TypeScript validator invoked by `interactive-schema.ts` for `engine: 'construction-lab'`.
 * Enforces:
 * - Backward-compatible `labKind` discriminator ('boolean-circuit' | 'equation-balancer' | 'electrical-circuit' | 'bio-sequence-builder')
 * - Domain-specific minimum engine version gate (new domains & declarative circuitConfig MUST require >= 1.1.0)
 * - Strict per-domain key allowlists and resource caps
 * - Authoring-time solvability check for chemical equations
 * - Cycle/arity/reference validation via existing `circuit-engine.ts` for declarative Boolean circuits
 */

import {
  hasValidEquationSolution,
  parseChemicalFormula,
  STOICHIOMETRY_LIMITS,
  type ChemicalSpeciesDef,
  type ChemicalStateSymbol,
} from './stoichiometry-engine';
import type {
  DcCircuitGoalDef,
  DcCircuitSlotDef,
  DcCircuitTopology,
  DcComponentKind,
  DcComponentOption,
  DcSlotPosition,
} from './dc-circuit-engine';
import { BIO_SEQUENCE_LIMITS, type BioSequenceMode } from './bio-sequence-engine';
import {
  GATE_ARITY,
  validateCircuit,
  type CircuitGradingMode,
  type LogicCircuitNetlist,
  type LogicGateOp,
} from '@/lib/boolean-logic/circuit-engine';
import { validateAtomBondBuilderConfig } from './atom-bond-schema-validator';
import { validateGeometryConstructorConfig } from './geometry-schema-validator';
import { validateMeasurementLabConfig } from './measurement-schema-validator';
import { validateDataStatsLabConfig } from './data-stats-schema-validator';
import { validateNumberManipulativeConfig } from './number-manipulative-schema-validator';

export type ConstructionLabKind =
  | 'boolean-circuit'
  | 'equation-balancer'
  | 'electrical-circuit'
  | 'bio-sequence-builder'
  | 'atom-bond-builder'
  | 'geometry-constructor'
  | 'measurement-lab'
  | 'data-stats-lab'
  | 'number-manipulative';

export interface ConstructionPredictionDef {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DeclarativeBooleanCircuitConfig {
  inputs: string[];
  outputLabel?: string;
  allowedGates: LogicGateOp[];
  initialGates?: Array<{ id: string; op: LogicGateOp; inputs: string[] }>;
  initialOutput?: string;
  /** Expected output (0 or 1) for each truth-table row in binary counting order (length = 2^inputs.length). */
  targetTruthTable: Array<0 | 1>;
  gradingMode?: CircuitGradingMode;
  targetNetlist?: LogicCircuitNetlist;
  maxGates?: number;
  successExplanation?: string;
}

export const CONSTRUCTION_LAB_LIMITS = {
  maxUndoHistory: 25,
  maxDcSlots: 8,
  maxDcPalette: 8,
  maxDcResistanceOhm: 1000,
  maxBooleanInputs: 4,
  maxBooleanGates: 10,
  maxExamples: 8,
} as const;

const SHARED_OPTIONAL_KEYS = [
  'subjectTag',
  'modelNote',
  'prediction',
  'successExplanation',
  'exploreFurther',
  'isAssessment',
] as const;

const BOOLEAN_CIRCUIT_KEYS = new Set([
  'labKind',
  'activityId',
  'circuitConfig',
  ...SHARED_OPTIONAL_KEYS,
]);

const EQUATION_BALANCER_KEYS = new Set([
  'labKind',
  'arrow',
  'maxCoefficient',
  'requireSimplestRatio',
  'reactants',
  'products',
  'showAtomVisuals',
  'difficulty',
  'examples',
  ...SHARED_OPTIONAL_KEYS,
]);

const EQUATION_EXAMPLE_KEYS = new Set([
  'id',
  'label',
  'prompt',
  'arrow',
  'maxCoefficient',
  'requireSimplestRatio',
  'reactants',
  'products',
  'modelNote',
  'successExplanation',
]);

const ELECTRICAL_CIRCUIT_KEYS = new Set([
  'labKind',
  'topology',
  'supplyVoltageV',
  'palette',
  'slots',
  'goal',
  'isMisconceptionActivity',
  ...SHARED_OPTIONAL_KEYS,
]);

const BIO_SEQUENCE_KEYS = new Set([
  'labKind',
  'mode',
  'templateDirection',
  'productDirection',
  'templateSequence',
  'palette',
  'isCompleteCodingSequence',
  'parent1Genotype',
  'parent2Genotype',
  'dominantAllele',
  'dominantTrait',
  'recessiveTrait',
  'inheritanceAssumption',
  ...SHARED_OPTIONAL_KEYS,
]);

const PREDICTION_ALLOWED_KEYS = new Set(['prompt', 'options', 'correctIndex', 'explanation']);
const SPECIES_ALLOWED_KEYS = new Set(['formula', 'display', 'charge', 'state', 'isElectron']);
const DC_PALETTE_ALLOWED_KEYS = new Set(['id', 'kind', 'label', 'resistanceOhm']);
const DC_SLOT_ALLOWED_KEYS = new Set(['id', 'label', 'position', 'initialComponentId', 'targetSlotId', 'locked']);
const DC_GOAL_ALLOWED_KEYS = new Set([
  'description',
  'targetTotalCurrentA',
  'toleranceA',
  'targetBranchACurrentA',
  'targetBranchBCurrentA',
  'targetVoltmeterV',
  'toleranceV',
  'requiredComponents',
  'requireNoShortCircuit',
  'requireNoMeterMisconnection',
]);
const DC_REQ_COMP_ALLOWED_KEYS = new Set(['kind', 'minCount', 'position']);
const BOOL_CFG_ALLOWED_KEYS = new Set([
  'inputs',
  'outputLabel',
  'allowedGates',
  'initialGates',
  'initialOutput',
  'targetTruthTable',
  'gradingMode',
  'targetNetlist',
  'maxGates',
  'successExplanation',
]);
const BOOL_GATE_ALLOWED_KEYS = new Set(['id', 'op', 'inputs']);

const VALID_STATES = new Set<ChemicalStateSymbol>(['s', 'l', 'g', 'aq']);
const VALID_ARROWS = new Set(['→', '⇌', '->']);
const VALID_TOPOLOGIES = new Set<DcCircuitTopology>(['series', 'parallel-2-branch', 'series-parallel']);
const VALID_DC_KINDS = new Set<DcComponentKind>([
  'wire',
  'switch-open',
  'switch-closed',
  'resistor',
  'lamp',
  'ammeter',
  'voltmeter',
]);
const VALID_DC_POSITIONS = new Set<DcSlotPosition>(['main', 'branch-a', 'branch-b', 'voltmeter-probe']);
const VALID_BIO_MODES = new Set<BioSequenceMode>([
  'dna-base-pairing',
  'dna-to-mrna',
  'mrna-translation',
  'monohybrid-punnett',
]);
const VALID_LOGIC_GATES = new Set<LogicGateOp>(['NOT', 'AND', 'OR', 'NAND', 'NOR', 'XOR']);

const BASE_KEYS = new Set([
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
]);

function checkAllowed(
  rec: Record<string, unknown>,
  allowed: ReadonlySet<string>,
  ctx: string,
  errors: string[],
  includeBase = false,
): void {
  for (const k of Object.keys(rec)) {
    if (includeBase && BASE_KEYS.has(k)) continue;
    if (!allowed.has(k)) {
      errors.push(`Unknown field "${k}" in ${ctx}.`);
    }
  }
}

function validatePrediction(raw: unknown, errors: string[]): void {
  if (raw === undefined) return;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    errors.push('construction-lab "prediction" must be an object.');
    return;
  }
  const p = raw as Record<string, unknown>;
  checkAllowed(p, PREDICTION_ALLOWED_KEYS, 'construction-lab.prediction', errors);
  if (typeof p.prompt !== 'string' || p.prompt.trim().length < 4) {
    errors.push('construction-lab prediction.prompt must be a non-empty string.');
  }
  if (
    !Array.isArray(p.options) ||
    p.options.length < 2 ||
    p.options.length > 4 ||
    p.options.some((o) => typeof o !== 'string' || o.trim().length === 0)
  ) {
    errors.push('construction-lab prediction.options must contain 2 to 4 non-empty strings.');
  } else if (
    typeof p.correctIndex !== 'number' ||
    !Number.isInteger(p.correctIndex) ||
    p.correctIndex < 0 ||
    p.correctIndex >= p.options.length
  ) {
    errors.push('construction-lab prediction.correctIndex must be a valid option index.');
  }
  if (typeof p.explanation !== 'string' || p.explanation.trim().length < 4) {
    errors.push('construction-lab prediction.explanation must be a non-empty string.');
  }
}

export function getRequiredConstructionLabMinVersion(obj: Record<string, unknown>): '1.0.0' | '1.1.0' | '1.2.0' | '1.3.0' | '1.4.0' | '1.5.0' | '1.6.0' | '1.7.0' | '1.8.0' | '1.9.0' {
  if (obj.labKind === 'boolean-circuit' && obj.circuitConfig === undefined) {
    return '1.0.0';
  }
  if (
    obj.exploreFurther === true ||
    ((obj.labKind === 'atom-bond-builder' || obj.labKind === 'equation-balancer') &&
      Array.isArray(obj.examples))
  ) {
    return '1.9.0';
  }
  if (
    obj.labKind === 'atom-bond-builder' &&
    obj.mode === 'atomic-structure' &&
    (obj.interactionMode === 'free-exploration' ||
      obj.interactionMode === 'independent-challenge' ||
      obj.allowElementSelector === true ||
      obj.startEmpty === true)
  ) {
    return '1.8.0';
  }
  if (obj.labKind === 'number-manipulative') {
    return '1.7.0';
  }
  if (obj.labKind === 'data-stats-lab') {
    return '1.5.0';
  }
  if (obj.labKind === 'measurement-lab') {
    return '1.4.0';
  }
  if (obj.labKind === 'geometry-constructor') {
    const mode = obj.mode;
    const ct = obj.circleTheorem as Record<string, unknown> | undefined;
    const cg = obj.constructionGoal as Record<string, unknown> | undefined;
    if (
      mode === 'cube-nets' ||
      mode === 'loci-regions' ||
      (mode === 'compass-straightedge' &&
        (cg?.kind === 'triangle-rhs' || cg?.kind === 'protractor-angle')) ||
      (mode === 'circle-theorems' &&
        (ct?.theorem === 'alternate-segment' ||
          ct?.theorem === 'equal-tangents' ||
          ct?.theorem === 'chord-perp-bisector'))
    ) {
      return '1.6.0';
    }
    return '1.3.0';
  }
  if (obj.labKind === 'atom-bond-builder') {
    return '1.2.0';
  }
  return '1.1.0';
}

export function validateConstructionLabConfig(
  obj: Record<string, unknown>,
  compareSemverFn: (a: string, b: string) => number | null,
  errors: string[],
): void {
  const labKind = obj.labKind;
  if (
    labKind !== 'boolean-circuit' &&
    labKind !== 'equation-balancer' &&
    labKind !== 'electrical-circuit' &&
    labKind !== 'bio-sequence-builder' &&
    labKind !== 'atom-bond-builder' &&
    labKind !== 'geometry-constructor' &&
    labKind !== 'measurement-lab' &&
    labKind !== 'data-stats-lab' &&
    labKind !== 'number-manipulative'
  ) {
    errors.push(`Unsupported construction-lab labKind "${String(labKind)}".`);
    return;
  }

  // Enforce domain-specific minimum engine version so new domains CANNOT bypass the production gate!
  const requiredMin = getRequiredConstructionLabMinVersion(obj);
  if (requiredMin !== '1.0.0') {
    if (typeof obj.minEngineVersion !== 'string') {
      errors.push(
        `construction-lab "${labKind}"${labKind === 'boolean-circuit' ? ' with declarative circuitConfig' : ''} requires explicit "minEngineVersion": "${requiredMin}" (or higher).`,
      );
    } else {
      const cmp = compareSemverFn(obj.minEngineVersion, requiredMin);
      if (cmp === null || cmp < 0) {
        errors.push(
          `construction-lab "${labKind}" requires minEngineVersion >= "${requiredMin}" (got "${obj.minEngineVersion}"). Older versions cannot run this domain adapter.`,
        );
      }
    }
  }

  // Shared optional metadata checks
  for (const optStr of ['subjectTag', 'modelNote', 'successExplanation'] as const) {
    if (obj[optStr] !== undefined && typeof obj[optStr] !== 'string') {
      errors.push(`construction-lab "${optStr}" must be a string.`);
    }
  }
  for (const optBool of ['exploreFurther', 'isAssessment'] as const) {
    if (obj[optBool] !== undefined && typeof obj[optBool] !== 'boolean') {
      errors.push(`construction-lab "${optBool}" must be a boolean.`);
    }
  }
  validatePrediction(obj.prediction, errors);

  // Domain 5 (Step 4E): Atomic & Molecular Bonding Laboratory
  if (labKind === 'atom-bond-builder') {
    validateAtomBondBuilderConfig(obj, errors);
    return;
  }

  // Domain 6 (Step 4F): Geometry Construction Laboratory
  if (labKind === 'geometry-constructor') {
    validateGeometryConstructorConfig(obj, errors);
    return;
  }

  // Domain 7 (Step 5C): Virtual Measuring Instruments Laboratory
  if (labKind === 'measurement-lab') {
    validateMeasurementLabConfig(obj, errors);
    return;
  }

  // Domain 8 (Step 5D): Probability & Statistics Laboratory
  if (labKind === 'data-stats-lab') {
    validateDataStatsLabConfig(obj, errors);
    return;
  }

  // Domain 9 (Step 5F): Primary Number Manipulatives Laboratory
  if (labKind === 'number-manipulative') {
    validateNumberManipulativeConfig(obj, errors);
    return;
  }

  // Domain 4: Boolean Circuit (legacy activityId OR declarative circuitConfig)
  if (labKind === 'boolean-circuit') {
    checkAllowed(obj, BOOLEAN_CIRCUIT_KEYS, 'construction-lab(boolean-circuit)', errors, true);
    if (obj.activityId !== undefined && typeof obj.activityId !== 'string') {
      errors.push('construction-lab "activityId" must be a string.');
    }
    if (obj.circuitConfig !== undefined) {
      validateDeclarativeBooleanCircuit(obj.circuitConfig, errors);
    }
    return;
  }

  // Domain 1: Chemical Equation Balancer
  if (labKind === 'equation-balancer') {
    checkAllowed(obj, EQUATION_BALANCER_KEYS, 'construction-lab(equation-balancer)', errors, true);
    if (obj.arrow !== undefined && (typeof obj.arrow !== 'string' || !VALID_ARROWS.has(obj.arrow))) {
      errors.push('equation-balancer "arrow" must be "→", "⇌", or "->".');
    }
    const maxCoeff = obj.maxCoefficient === undefined ? 10 : obj.maxCoefficient;
    if (
      typeof maxCoeff !== 'number' ||
      !Number.isInteger(maxCoeff) ||
      maxCoeff < 2 ||
      maxCoeff > STOICHIOMETRY_LIMITS.maxCoefficientHardCap
    ) {
      errors.push(
        `equation-balancer "maxCoefficient" must be an integer between 2 and ${STOICHIOMETRY_LIMITS.maxCoefficientHardCap}.`,
      );
    }
    if (obj.requireSimplestRatio !== undefined && typeof obj.requireSimplestRatio !== 'boolean') {
      errors.push('equation-balancer "requireSimplestRatio" must be a boolean.');
    }
    if (obj.showAtomVisuals !== undefined && typeof obj.showAtomVisuals !== 'boolean') {
      errors.push('equation-balancer "showAtomVisuals" must be a boolean.');
    }
    if (
      obj.difficulty !== undefined &&
      obj.difficulty !== 'foundation' &&
      obj.difficulty !== 'standard' &&
      obj.difficulty !== 'challenge'
    ) {
      errors.push('equation-balancer "difficulty" must be "foundation", "standard", or "challenge".');
    }

    const validateSide = (side: unknown, label: string): ChemicalSpeciesDef[] => {
      if (
        !Array.isArray(side) ||
        side.length === 0 ||
        side.length > STOICHIOMETRY_LIMITS.maxSpeciesPerSide
      ) {
        errors.push(`equation-balancer "${label}" must contain 1 to ${STOICHIOMETRY_LIMITS.maxSpeciesPerSide} species.`);
        return [];
      }
      const out: ChemicalSpeciesDef[] = [];
      side.forEach((sp, idx) => {
        if (!sp || typeof sp !== 'object' || Array.isArray(sp)) {
          errors.push(`equation-balancer ${label}[${idx}] must be an object.`);
          return;
        }
        const rec = sp as Record<string, unknown>;
        checkAllowed(rec, SPECIES_ALLOWED_KEYS, `${label}[${idx}]`, errors);
        if (typeof rec.formula !== 'string' || rec.formula.trim().length === 0) {
          errors.push(`equation-balancer ${label}[${idx}].formula must be a non-empty string.`);
          return;
        }
        if (rec.display !== undefined && typeof rec.display !== 'string') {
          errors.push(`equation-balancer ${label}[${idx}].display must be a string.`);
        }
        if (rec.isElectron !== undefined && typeof rec.isElectron !== 'boolean') {
          errors.push(`equation-balancer ${label}[${idx}].isElectron must be a boolean.`);
        }
        if (
          rec.charge !== undefined &&
          (typeof rec.charge !== 'number' || !Number.isInteger(rec.charge) || rec.charge < -8 || rec.charge > 8)
        ) {
          errors.push(`equation-balancer ${label}[${idx}].charge must be an integer between -8 and +8.`);
        }
        if (rec.state !== undefined && (typeof rec.state !== 'string' || !VALID_STATES.has(rec.state as ChemicalStateSymbol))) {
          errors.push(`equation-balancer ${label}[${idx}].state must be one of s, l, g, aq.`);
        }
        const parsed = parseChemicalFormula(rec.formula, Boolean(rec.isElectron));
        if (!parsed.ok) {
          errors.push(`equation-balancer ${label}[${idx}]: ${parsed.error}`);
          return;
        }
        out.push({
          formula: rec.formula,
          display: typeof rec.display === 'string' ? rec.display : undefined,
          charge: typeof rec.charge === 'number' ? rec.charge : undefined,
          state: typeof rec.state === 'string' ? (rec.state as ChemicalStateSymbol) : undefined,
          isElectron: Boolean(rec.isElectron),
        });
      });
      return out;
    };

    const reactants = validateSide(obj.reactants, 'reactants');
    const products = validateSide(obj.products, 'products');
    if (
      reactants.length > 0 &&
      products.length > 0 &&
      typeof maxCoeff === 'number' &&
      Number.isInteger(maxCoeff)
    ) {
      const check = hasValidEquationSolution(reactants, products, maxCoeff);
      if (!check.solvable) {
        errors.push(
          `equation-balancer challenge has no valid positive whole-number balanced solution within 1..${maxCoeff}.`,
        );
      }
    }

    if (obj.examples !== undefined) {
      if (
        !Array.isArray(obj.examples) ||
        obj.examples.length < 1 ||
        obj.examples.length > CONSTRUCTION_LAB_LIMITS.maxExamples
      ) {
        errors.push(
          `equation-balancer "examples" must contain 1 to ${CONSTRUCTION_LAB_LIMITS.maxExamples} validated equations.`,
        );
      } else {
        const seenExampleIds = new Set<string>();
        obj.examples.forEach((rawEx, idx) => {
          const ctx = `equation-balancer.examples[${idx}]`;
          if (!rawEx || typeof rawEx !== 'object' || Array.isArray(rawEx)) {
            errors.push(`${ctx} must be an object.`);
            return;
          }
          const ex = rawEx as Record<string, unknown>;
          checkAllowed(ex, EQUATION_EXAMPLE_KEYS, ctx, errors);
          if (typeof ex.id !== 'string' || !/^[A-Za-z0-9_-]{1,40}$/.test(ex.id)) {
            errors.push(`${ctx}.id must be a 1-40 char identifier.`);
          } else if (seenExampleIds.has(ex.id)) {
            errors.push(`Duplicate example id "${ex.id}" in equation-balancer.examples.`);
          } else {
            seenExampleIds.add(ex.id);
          }
          if (typeof ex.label !== 'string' || ex.label.trim().length < 2) {
            errors.push(`${ctx}.label must be a non-empty string.`);
          }
          for (const optStr of ['prompt', 'modelNote', 'successExplanation'] as const) {
            if (ex[optStr] !== undefined && typeof ex[optStr] !== 'string') {
              errors.push(`${ctx}.${optStr} must be a string.`);
            }
          }
          if (ex.arrow !== undefined && (typeof ex.arrow !== 'string' || !VALID_ARROWS.has(ex.arrow))) {
            errors.push(`${ctx}.arrow must be "→", "⇌", or "->".`);
          }
          if (ex.requireSimplestRatio !== undefined && typeof ex.requireSimplestRatio !== 'boolean') {
            errors.push(`${ctx}.requireSimplestRatio must be a boolean.`);
          }
          const exMaxCoeff = ex.maxCoefficient === undefined ? (typeof maxCoeff === 'number' ? maxCoeff : 10) : ex.maxCoefficient;
          if (
            typeof exMaxCoeff !== 'number' ||
            !Number.isInteger(exMaxCoeff) ||
            exMaxCoeff < 2 ||
            exMaxCoeff > STOICHIOMETRY_LIMITS.maxCoefficientHardCap
          ) {
            errors.push(`${ctx}.maxCoefficient must be an integer between 2 and ${STOICHIOMETRY_LIMITS.maxCoefficientHardCap}.`);
          }
          const exReactants = validateSide(ex.reactants, `examples[${idx}].reactants`);
          const exProducts = validateSide(ex.products, `examples[${idx}].products`);
          if (
            exReactants.length > 0 &&
            exProducts.length > 0 &&
            typeof exMaxCoeff === 'number' &&
            Number.isInteger(exMaxCoeff)
          ) {
            const check = hasValidEquationSolution(exReactants, exProducts, exMaxCoeff);
            if (!check.solvable) {
              errors.push(
                `${ctx} has no valid positive whole-number balanced solution within 1..${exMaxCoeff}.`,
              );
            }
          }
        });
      }
    }
    return;
  }

  // Domain 2: Bounded DC Electrical Circuit Builder
  if (labKind === 'electrical-circuit') {
    checkAllowed(obj, ELECTRICAL_CIRCUIT_KEYS, 'construction-lab(electrical-circuit)', errors, true);
    if (typeof obj.topology !== 'string' || !VALID_TOPOLOGIES.has(obj.topology as DcCircuitTopology)) {
      errors.push('electrical-circuit "topology" must be "series", "parallel-2-branch", or "series-parallel".');
    }
    if (
      typeof obj.supplyVoltageV !== 'number' ||
      !Number.isFinite(obj.supplyVoltageV) ||
      obj.supplyVoltageV < 1 ||
      obj.supplyVoltageV > 24
    ) {
      errors.push('electrical-circuit "supplyVoltageV" must be a finite number between 1 and 24 V.');
    }
    if (obj.isMisconceptionActivity !== undefined && typeof obj.isMisconceptionActivity !== 'boolean') {
      errors.push('electrical-circuit "isMisconceptionActivity" must be a boolean.');
    }

    const paletteIds = new Set<string>();
    const palette: DcComponentOption[] = [];
    if (!Array.isArray(obj.palette) || obj.palette.length === 0 || obj.palette.length > CONSTRUCTION_LAB_LIMITS.maxDcPalette) {
      errors.push(`electrical-circuit "palette" must contain 1 to ${CONSTRUCTION_LAB_LIMITS.maxDcPalette} component options.`);
    } else {
      obj.palette.forEach((item, idx) => {
        if (!item || typeof item !== 'object' || Array.isArray(item)) {
          errors.push(`electrical-circuit palette[${idx}] must be an object.`);
          return;
        }
        const rec = item as Record<string, unknown>;
        checkAllowed(rec, DC_PALETTE_ALLOWED_KEYS, `palette[${idx}]`, errors);
        if (typeof rec.id !== 'string' || !/^[A-Za-z0-9_-]{1,32}$/.test(rec.id)) {
          errors.push(`electrical-circuit palette[${idx}].id must be a 1-32 char identifier.`);
        } else if (paletteIds.has(rec.id)) {
          errors.push(`electrical-circuit duplicate palette id "${rec.id}".`);
        } else {
          paletteIds.add(rec.id);
        }
        if (typeof rec.kind !== 'string' || !VALID_DC_KINDS.has(rec.kind as DcComponentKind)) {
          errors.push(`electrical-circuit palette[${idx}].kind is invalid.`);
        }
        if (typeof rec.label !== 'string' || rec.label.trim().length < 2) {
          errors.push(`electrical-circuit palette[${idx}].label must be a non-empty string.`);
        }
        if (rec.kind === 'resistor' || rec.kind === 'lamp') {
          if (
            typeof rec.resistanceOhm !== 'number' ||
            !Number.isFinite(rec.resistanceOhm) ||
            rec.resistanceOhm < 1 ||
            rec.resistanceOhm > CONSTRUCTION_LAB_LIMITS.maxDcResistanceOhm
          ) {
            errors.push(
              `electrical-circuit palette[${idx}] (${rec.kind}) requires finite resistanceOhm between 1 and ${CONSTRUCTION_LAB_LIMITS.maxDcResistanceOhm}.`,
            );
          }
        } else if (rec.resistanceOhm !== undefined) {
          errors.push(`electrical-circuit palette[${idx}] (${String(rec.kind)}) must not specify resistanceOhm.`);
        }
        palette.push(rec as unknown as DcComponentOption);
      });
    }

    const slotIds = new Set<string>();
    const pendingProbeTargets: Array<{ idx: number; target: string }> = [];
    if (!Array.isArray(obj.slots) || obj.slots.length < 2 || obj.slots.length > CONSTRUCTION_LAB_LIMITS.maxDcSlots) {
      errors.push(`electrical-circuit "slots" must contain 2 to ${CONSTRUCTION_LAB_LIMITS.maxDcSlots} slots.`);
    } else {
      obj.slots.forEach((s, idx) => {
        if (!s || typeof s !== 'object' || Array.isArray(s)) {
          errors.push(`electrical-circuit slots[${idx}] must be an object.`);
          return;
        }
        const rec = s as Record<string, unknown>;
        checkAllowed(rec, DC_SLOT_ALLOWED_KEYS, `slots[${idx}]`, errors);
        if (typeof rec.id !== 'string' || !/^[A-Za-z0-9_-]{1,32}$/.test(rec.id)) {
          errors.push(`electrical-circuit slots[${idx}].id must be a 1-32 char identifier.`);
        } else if (slotIds.has(rec.id)) {
          errors.push(`electrical-circuit duplicate slot id "${rec.id}".`);
        } else {
          slotIds.add(rec.id);
        }
        if (typeof rec.label !== 'string' || rec.label.trim().length < 2) {
          errors.push(`electrical-circuit slots[${idx}].label must be a non-empty string.`);
        }
        if (typeof rec.position !== 'string' || !VALID_DC_POSITIONS.has(rec.position as DcSlotPosition)) {
          errors.push(`electrical-circuit slots[${idx}].position is invalid.`);
        } else if (obj.topology === 'series' && (rec.position === 'branch-a' || rec.position === 'branch-b')) {
          errors.push(`electrical-circuit series topology cannot contain "${rec.position}" slot.`);
        }
        if (typeof rec.initialComponentId !== 'string' || !paletteIds.has(rec.initialComponentId)) {
          errors.push(`electrical-circuit slots[${idx}].initialComponentId "${String(rec.initialComponentId)}" is not in palette.`);
        }
        if (rec.targetSlotId !== undefined) {
          if (typeof rec.targetSlotId !== 'string') {
            errors.push(`electrical-circuit slots[${idx}].targetSlotId must be a string.`);
          } else {
            pendingProbeTargets.push({ idx, target: rec.targetSlotId });
          }
        }
        if (rec.locked !== undefined && typeof rec.locked !== 'boolean') {
          errors.push(`electrical-circuit slots[${idx}].locked must be a boolean.`);
        }
      });

      for (const p of pendingProbeTargets) {
        if (!slotIds.has(p.target)) {
          errors.push(`electrical-circuit slots[${p.idx}].targetSlotId "${p.target}" does not match any slot id.`);
        }
      }
    }

    if (obj.goal !== undefined) {
      if (!obj.goal || typeof obj.goal !== 'object' || Array.isArray(obj.goal)) {
        errors.push('electrical-circuit "goal" must be an object.');
      } else {
        const g = obj.goal as Record<string, unknown>;
        checkAllowed(g, DC_GOAL_ALLOWED_KEYS, 'electrical-circuit.goal', errors);
        if (typeof g.description !== 'string' || g.description.trim().length < 4) {
          errors.push('electrical-circuit goal.description must be a non-empty string.');
        }
        for (const numKey of [
          'targetTotalCurrentA',
          'toleranceA',
          'targetBranchACurrentA',
          'targetBranchBCurrentA',
          'targetVoltmeterV',
          'toleranceV',
        ] as const) {
          if (g[numKey] !== undefined && (typeof g[numKey] !== 'number' || !Number.isFinite(g[numKey]) || (g[numKey] as number) < 0)) {
            errors.push(`electrical-circuit goal.${numKey} must be a non-negative finite number.`);
          }
        }
        if (g.requiredComponents !== undefined) {
          if (!Array.isArray(g.requiredComponents) || g.requiredComponents.length > 6) {
            errors.push('electrical-circuit goal.requiredComponents must be an array of at most 6 items.');
          } else {
            g.requiredComponents.forEach((rc, rIdx) => {
              if (!rc || typeof rc !== 'object' || Array.isArray(rc)) {
                errors.push(`electrical-circuit goal.requiredComponents[${rIdx}] must be an object.`);
                return;
              }
              const rcRec = rc as Record<string, unknown>;
              checkAllowed(rcRec, DC_REQ_COMP_ALLOWED_KEYS, `goal.requiredComponents[${rIdx}]`, errors);
              if (typeof rcRec.kind !== 'string' || !VALID_DC_KINDS.has(rcRec.kind as DcComponentKind)) {
                errors.push(`electrical-circuit goal.requiredComponents[${rIdx}].kind is invalid.`);
              }
              if (typeof rcRec.minCount !== 'number' || !Number.isInteger(rcRec.minCount) || rcRec.minCount < 1 || rcRec.minCount > 8) {
                errors.push(`electrical-circuit goal.requiredComponents[${rIdx}].minCount must be an integer 1..8.`);
              }
              if (rcRec.position !== undefined && (typeof rcRec.position !== 'string' || !VALID_DC_POSITIONS.has(rcRec.position as DcSlotPosition))) {
                errors.push(`electrical-circuit goal.requiredComponents[${rIdx}].position is invalid.`);
              }
            });
          }
        }
      }
    }
    return;
  }

  // Domain 3: Biological Sequence & Inheritance Builder
  if (labKind === 'bio-sequence-builder') {
    checkAllowed(obj, BIO_SEQUENCE_KEYS, 'construction-lab(bio-sequence-builder)', errors, true);
    if (typeof obj.mode !== 'string' || !VALID_BIO_MODES.has(obj.mode as BioSequenceMode)) {
      errors.push(
        'bio-sequence-builder "mode" must be "dna-base-pairing", "dna-to-mrna", "mrna-translation", or "monohybrid-punnett".',
      );
      return;
    }

    if (obj.mode === 'monohybrid-punnett') {
      if (typeof obj.parent1Genotype !== 'string' || !/^[A-Za-z]{2}$/.test(obj.parent1Genotype)) {
        errors.push('bio-sequence-builder monohybrid-punnett requires 2-letter "parent1Genotype" (e.g. "Tt").');
      }
      if (typeof obj.parent2Genotype !== 'string' || !/^[A-Za-z]{2}$/.test(obj.parent2Genotype)) {
        errors.push('bio-sequence-builder monohybrid-punnett requires 2-letter "parent2Genotype" (e.g. "Tt").');
      }
      if (typeof obj.dominantAllele !== 'string' || !/^[A-Z]$/.test(obj.dominantAllele)) {
        errors.push('bio-sequence-builder monohybrid-punnett requires single uppercase "dominantAllele" (e.g. "T").');
      }
      if (obj.dominantTrait !== undefined && typeof obj.dominantTrait !== 'string') {
        errors.push('bio-sequence-builder "dominantTrait" must be a string.');
      }
      if (obj.recessiveTrait !== undefined && typeof obj.recessiveTrait !== 'string') {
        errors.push('bio-sequence-builder "recessiveTrait" must be a string.');
      }
      if (obj.inheritanceAssumption !== undefined && typeof obj.inheritanceAssumption !== 'string') {
        errors.push('bio-sequence-builder "inheritanceAssumption" must be a string.');
      }
      return;
    }

    // Sequence modes: dna-base-pairing, dna-to-mrna, mrna-translation
    const validBaseSet =
      obj.mode === 'mrna-translation'
        ? new Set(['A', 'U', 'C', 'G'])
        : new Set(['A', 'T', 'C', 'G']);

    if (
      !Array.isArray(obj.templateSequence) ||
      obj.templateSequence.length < BIO_SEQUENCE_LIMITS.minSequenceLength ||
      obj.templateSequence.length > BIO_SEQUENCE_LIMITS.maxSequenceLength ||
      obj.templateSequence.some((t) => typeof t !== 'string' || !validBaseSet.has(t))
    ) {
      errors.push(
        `bio-sequence-builder "${obj.mode}" requires templateSequence of ${BIO_SEQUENCE_LIMITS.minSequenceLength}..${BIO_SEQUENCE_LIMITS.maxSequenceLength} valid bases.`,
      );
    } else if (obj.mode === 'mrna-translation' && obj.templateSequence.length % 3 !== 0) {
      errors.push('bio-sequence-builder "mrna-translation" templateSequence length must be a multiple of 3 (codons).');
    }

    if (
      !Array.isArray(obj.palette) ||
      obj.palette.length < 2 ||
      obj.palette.length > 12 ||
      obj.palette.some((p) => typeof p !== 'string' || p.trim().length === 0)
    ) {
      errors.push('bio-sequence-builder requires "palette" with 2 to 12 non-empty tile tokens.');
    }
    if (obj.templateDirection !== undefined && typeof obj.templateDirection !== 'string') {
      errors.push('bio-sequence-builder "templateDirection" must be a string.');
    }
    if (obj.productDirection !== undefined && typeof obj.productDirection !== 'string') {
      errors.push('bio-sequence-builder "productDirection" must be a string.');
    }
    if (obj.isCompleteCodingSequence !== undefined && typeof obj.isCompleteCodingSequence !== 'boolean') {
      errors.push('bio-sequence-builder "isCompleteCodingSequence" must be a boolean.');
    }
  }
}

function validateDeclarativeBooleanCircuit(raw: unknown, errors: string[]): void {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    errors.push('boolean-circuit "circuitConfig" must be an object.');
    return;
  }
  const cfg = raw as Record<string, unknown>;
  checkAllowed(cfg, BOOL_CFG_ALLOWED_KEYS, 'boolean-circuit.circuitConfig', errors);

  if (
    !Array.isArray(cfg.inputs) ||
    cfg.inputs.length < 1 ||
    cfg.inputs.length > CONSTRUCTION_LAB_LIMITS.maxBooleanInputs ||
    cfg.inputs.some((i) => typeof i !== 'string' || !/^[A-Za-z][A-Za-z0-9_]{0,8}$/.test(i))
  ) {
    errors.push(`circuitConfig.inputs must contain 1 to ${CONSTRUCTION_LAB_LIMITS.maxBooleanInputs} valid input labels.`);
  }
  if (
    !Array.isArray(cfg.allowedGates) ||
    cfg.allowedGates.length === 0 ||
    cfg.allowedGates.some((g) => typeof g !== 'string' || !VALID_LOGIC_GATES.has(g as LogicGateOp))
  ) {
    errors.push('circuitConfig.allowedGates must be a non-empty array of supported gates (NOT, AND, OR, NAND, NOR, XOR).');
  }
  const expectedRows = Array.isArray(cfg.inputs) ? Math.pow(2, cfg.inputs.length) : 0;
  if (
    !Array.isArray(cfg.targetTruthTable) ||
    cfg.targetTruthTable.length !== expectedRows ||
    cfg.targetTruthTable.some((v) => v !== 0 && v !== 1)
  ) {
    errors.push(`circuitConfig.targetTruthTable must have exactly ${expectedRows} binary entries (0 or 1).`);
  }
  if (
    cfg.gradingMode !== undefined &&
    cfg.gradingMode !== 'functional-equivalence' &&
    cfg.gradingMode !== 'specified-gate-structure'
  ) {
    errors.push('circuitConfig.gradingMode must be "functional-equivalence" or "specified-gate-structure".');
  }
  if (
    cfg.maxGates !== undefined &&
    (typeof cfg.maxGates !== 'number' ||
      !Number.isInteger(cfg.maxGates) ||
      cfg.maxGates < 1 ||
      cfg.maxGates > CONSTRUCTION_LAB_LIMITS.maxBooleanGates)
  ) {
    errors.push(`circuitConfig.maxGates must be an integer between 1 and ${CONSTRUCTION_LAB_LIMITS.maxBooleanGates}.`);
  }

  if (cfg.initialGates !== undefined) {
    if (!Array.isArray(cfg.initialGates) || cfg.initialGates.length > CONSTRUCTION_LAB_LIMITS.maxBooleanGates) {
      errors.push(`circuitConfig.initialGates must be an array of at most ${CONSTRUCTION_LAB_LIMITS.maxBooleanGates} gates.`);
    } else if (Array.isArray(cfg.inputs)) {
      const allowedSet = new Set(Array.isArray(cfg.allowedGates) ? cfg.allowedGates : []);
      for (let i = 0; i < cfg.initialGates.length; i++) {
        const g = cfg.initialGates[i] as Record<string, unknown>;
        if (!g || typeof g !== 'object' || Array.isArray(g)) {
          errors.push(`circuitConfig.initialGates[${i}] must be an object.`);
          continue;
        }
        checkAllowed(g, BOOL_GATE_ALLOWED_KEYS, `circuitConfig.initialGates[${i}]`, errors);
        if (typeof g.op !== 'string' || !VALID_LOGIC_GATES.has(g.op as LogicGateOp) || !allowedSet.has(g.op)) {
          errors.push(`circuitConfig.initialGates[${i}].op "${String(g.op)}" is not in allowedGates.`);
        } else if (!Array.isArray(g.inputs) || g.inputs.length !== GATE_ARITY[g.op as LogicGateOp]) {
          errors.push(`circuitConfig.initialGates[${i}] has invalid arity for ${g.op}.`);
        }
      }
      if (cfg.initialGates.length > 0 && typeof cfg.initialOutput === 'string') {
        const check = validateCircuit({
          inputs: cfg.inputs as string[],
          gates: cfg.initialGates as LogicCircuitNetlist['gates'],
          output: cfg.initialOutput,
        });
        if (!check.ok) {
          errors.push(`circuitConfig initial circuit invalid: ${check.errors.join(' ')}`);
        }
      }
    }
  }
}
