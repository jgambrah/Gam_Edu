/**
 * Versioned, declarative `slide.interactive` configuration schema & validator
 * for GAM EDU's Reusable Interactive Engine Registry (Step 3).
 *
 * Security & Architectural Model:
 * - Strictly data-only, schema-allowlisted JSON (unknown keys and invalid types rejected).
 * - Zero arbitrary JavaScript execution or raw HTML rendering (`dangerouslySetInnerHTML` never used).
 * - Safe declarative boolean/condition ASTs only (bounded depth, node count, and operator arity).
 * - Legitimate educational prose and isolated sandbox starter code (Python / Pseudocode / read-only SQL)
 *   are distinguished from unauthorized application execution.
 * - Rejects protected teacher-only fields, incompatible `minEngineVersion`, oversized payloads,
 *   duplicate activity IDs, and (at publish time) reserved/unimplemented engines.
 */

import { MATH_EXPR_LIMITS, tryParseMathExpr } from './math-expr';
import type { GraphChallengeCheck, GraphPoint } from './graph-sampler';
import {
  FORBIDDEN_STATE_IDS,
  isApprovedProcessAssetPath,
  type ProcessStateField,
} from './process-stepper-logic';
import {
  isApprovedInteractiveAssetPath,
  isValidPointPercent,
  isValidRectPercent,
} from './visual-region';
import {
  CONSTRUCTION_LAB_LIMITS,
  validateConstructionLabConfig,
  type ConstructionLabKind,
  type ConstructionPredictionDef,
  type DeclarativeBooleanCircuitConfig,
} from '@/lib/construction-lab/construction-schema-validator';
import {
  STOICHIOMETRY_LIMITS,
  type ChemicalSpeciesDef,
} from '@/lib/construction-lab/stoichiometry-engine';
import type {
  DcCircuitGoalDef,
  DcCircuitSlotDef,
  DcCircuitTopology,
  DcComponentOption,
} from '@/lib/construction-lab/dc-circuit-engine';
import { BIO_SEQUENCE_LIMITS, type BioSequenceMode } from '@/lib/construction-lab/bio-sequence-engine';

export type InteractiveEngineId =
  | 'code-playground'
  | 'construction-lab'
  | 'rule-explorer'
  | 'graph-slider'
  | 'process-stepper'
  | 'diagram-hotspots';

export interface InteractiveEngineMeta {
  id: InteractiveEngineId;
  engineVersion: string;
  /**
   * Highest version of this engine currently verified & deployed in production (`null` if not yet in production).
   * Prevents publishing live CDN lessons that require an engine only present on a development branch.
   */
  productionVersion: string | null;
  supportedSchemaVersions: readonly number[];
  implemented: boolean;
  description: string;
}

export const INTERACTIVE_RESOURCE_LIMITS = {
  maxConfigBytes: 24_576,
  maxActivitiesPerSlide: 4,
  maxRuleDepth: 6,
  maxRuleNodes: 32,
  maxInputs: 8,
  maxHints: 6,
  maxPublicTests: 8,
  maxGraphSliders: 4,
  maxGraphCurves: 4,
  maxGraphReadouts: 4,
  maxGraphSamples: 200,
  minGraphSamples: 20,
  maxGraphChallenges: 3,
  maxGraphChallengeConditions: 4,
  maxGraphSeriesPoints: 24,
  maxGraphCurvesPerSlide: 8,
  maxMathAstDepth: MATH_EXPR_LIMITS.maxAstDepth,
  maxMathAstNodes: MATH_EXPR_LIMITS.maxAstNodes,
  minProcessStages: 2,
  maxProcessStages: 10,
  maxProcessStateFields: 6,
  maxProcessPredictions: 3,
  maxProcessSequenceItems: 6,
  minDiagramHotspots: 2,
  maxDiagramHotspots: 12,
  maxDiagramIdentifyPrompts: 6,
  maxDiagramLinkedHotspots: 6,
  maxChemSpeciesPerSide: STOICHIOMETRY_LIMITS.maxSpeciesPerSide,
  maxChemFormulaLength: STOICHIOMETRY_LIMITS.maxFormulaLength,
  maxChemCoefficient: STOICHIOMETRY_LIMITS.maxCoefficientHardCap,
  maxDcSlots: CONSTRUCTION_LAB_LIMITS.maxDcSlots,
  maxDcPalette: CONSTRUCTION_LAB_LIMITS.maxDcPalette,
  maxBioSequenceLength: BIO_SEQUENCE_LIMITS.maxSequenceLength,
  maxBooleanInputs: CONSTRUCTION_LAB_LIMITS.maxBooleanInputs,
  maxBooleanGates: CONSTRUCTION_LAB_LIMITS.maxBooleanGates,
  maxConstructionUndoHistory: CONSTRUCTION_LAB_LIMITS.maxUndoHistory,
} as const;

export const SUPPORTED_INTERACTIVE_ENGINES: Record<InteractiveEngineId, InteractiveEngineMeta> = {
  'code-playground': {
    id: 'code-playground',
    engineVersion: '1.0.0',
    productionVersion: '1.0.0',
    supportedSchemaVersions: [1],
    implemented: true,
    description: 'Reuses InlineCodePlayground (Python 3, Cambridge Pseudocode, Read-Only SQL).',
  },
  'construction-lab': {
    id: 'construction-lab',
    engineVersion: '1.1.0',
    productionVersion: '1.1.0',
    supportedSchemaVersions: [1],
    implemented: true,
    description: 'Shared ConstructionLabShell with independently lazy-loaded domain adapters (boolean-circuit 1.0.0; equation-balancer, electrical-circuit, bio-sequence-builder, declarative boolean-circuit 1.1.0).',
  },
  'rule-explorer': {
    id: 'rule-explorer',
    engineVersion: '1.0.0',
    productionVersion: '1.0.0',
    supportedSchemaVersions: [1],
    implemented: true,
    description: 'Cross-subject declarative condition/rule explorer (CS, Chemistry, Biology, Physics).',
  },
  'graph-slider': {
    id: 'graph-slider',
    engineVersion: '1.0.0',
    productionVersion: '1.0.0',
    supportedSchemaVersions: [1],
    implemented: true,
    description: 'Cross-subject dynamic graph, parameter slider, piecewise, step-line, and discovery engine (Step 4A).',
  },
  'process-stepper': {
    id: 'process-stepper',
    engineVersion: '1.0.0',
    productionVersion: '1.0.0',
    supportedSchemaVersions: [1],
    implemented: true,
    description: 'Cross-subject step-by-step process & mechanism explorer with state tracking, highlights, and discovery checks (Step 4B).',
  },
  'diagram-hotspots': {
    id: 'diagram-hotspots',
    engineVersion: '1.0.0',
    productionVersion: '1.0.0',
    supportedSchemaVersions: [1],
    implemented: true,
    description: 'Cross-subject interactive diagram, structure-to-function hotspot explorer, and accessible identification challenges (Step 4C).',
  },
};

export interface SlideInteractiveBase {
  id: string;
  engine: InteractiveEngineId;
  schemaVersion: 1;
  minEngineVersion?: string;
  title: string;
  instructions: string;
  accessibilityLabel: string;
  fallbackText: string;
  hints?: string[];
  /**
   * Reserved metadata flag for future scoped completion persistence.
   * Currently NOT persisted to Firestore (0 Firestore reads/writes during interactive exploration).
   */
  persistCompletion?: boolean;
}

export interface CodePlaygroundInteractiveConfig extends SlideInteractiveBase {
  engine: 'code-playground';
  languages: Array<'python' | 'pseudocode' | 'sql'>;
  pythonStarter?: string;
  pseudocodeStarter?: string;
  sqlStarter?: string;
  publicTests?: Array<{ stdin: string; expectedStdout: string }>;
}

export type {
  ConstructionLabKind,
  ConstructionPredictionDef,
  DeclarativeBooleanCircuitConfig,
};

export interface ConstructionLabSharedFields extends SlideInteractiveBase {
  engine: 'construction-lab';
  subjectTag?: string;
  modelNote?: string;
  prediction?: ConstructionPredictionDef;
  successExplanation?: string;
}

export interface BooleanCircuitConstructionConfig extends ConstructionLabSharedFields {
  labKind: 'boolean-circuit';
  activityId?: string;
  circuitConfig?: DeclarativeBooleanCircuitConfig;
}

export interface EquationBalancerConstructionConfig extends ConstructionLabSharedFields {
  labKind: 'equation-balancer';
  arrow?: '→' | '⇌' | '->';
  maxCoefficient?: number;
  requireSimplestRatio?: boolean;
  showAtomVisuals?: boolean;
  difficulty?: 'foundation' | 'standard' | 'challenge';
  reactants: ChemicalSpeciesDef[];
  products: ChemicalSpeciesDef[];
}

export interface ElectricalCircuitConstructionConfig extends ConstructionLabSharedFields {
  labKind: 'electrical-circuit';
  topology: DcCircuitTopology;
  supplyVoltageV: number;
  palette: DcComponentOption[];
  slots: DcCircuitSlotDef[];
  goal?: DcCircuitGoalDef;
  isMisconceptionActivity?: boolean;
}

export interface BioSequenceConstructionConfig extends ConstructionLabSharedFields {
  labKind: 'bio-sequence-builder';
  mode: BioSequenceMode;
  templateDirection?: string;
  productDirection?: string;
  templateSequence?: string[];
  palette?: string[];
  isCompleteCodingSequence?: boolean;
  parent1Genotype?: string;
  parent2Genotype?: string;
  dominantAllele?: string;
  dominantTrait?: string;
  recessiveTrait?: string;
  inheritanceAssumption?: string;
}

export type ConstructionLabInteractiveConfig =
  | BooleanCircuitConstructionConfig
  | EquationBalancerConstructionConfig
  | ElectricalCircuitConstructionConfig
  | BioSequenceConstructionConfig;

export type RuleOperator = 'AND' | 'OR' | 'NOT' | 'XOR';

export type DeclarativeRuleNode =
  | { input: string }
  | { operator: RuleOperator; operands: DeclarativeRuleNode[] };

export interface RuleExplorerInputDef {
  id: string;
  label: string;
  defaultValue?: boolean;
  trueText?: string;
  falseText?: string;
}

export interface RuleExplorerInteractiveConfig extends SlideInteractiveBase {
  engine: 'rule-explorer';
  subjectTag?: string;
  inputs: RuleExplorerInputDef[];
  rule: DeclarativeRuleNode;
  output: {
    trueLabel: string;
    falseLabel: string;
    explanationTrue: string;
    explanationFalse: string;
    showBinaryValues?: boolean;
  };
}

export interface GraphSliderAxesDef {
  xLabel: string;
  xUnit?: string;
  xMin: number;
  xMax: number;
  yLabel: string;
  yUnit?: string;
  yMin: number;
  yMax: number;
}

export interface GraphSliderControlDef {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
  presets?: number[];
}

export type GraphCurveKind = 'formula' | 'piecewise' | 'step';
export type GraphCurveStyle = 'solid' | 'dashed' | 'dotted';

export interface GraphCurveDef {
  id: string;
  label: string;
  kind?: GraphCurveKind;
  expr?: string;
  points?: GraphPoint[];
  color: string;
  style?: GraphCurveStyle;
  isReference?: boolean;
  domainMin?: number;
  domainMax?: number;
  stopAtYZero?: boolean;
}

export interface GraphReadoutDef {
  id: string;
  label: string;
  expr: string;
  unit?: string;
  precision?: number;
}

export interface GraphPredictionPromptDef {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GraphChallengeDef {
  id: string;
  prompt: string;
  check: GraphChallengeCheck;
  successText: string;
  hintText?: string;
}

export interface GraphSliderInteractiveConfig extends SlideInteractiveBase {
  engine: 'graph-slider';
  subjectTag?: string;
  modelNote?: string;
  xVar?: string;
  axes: GraphSliderAxesDef;
  sliders?: GraphSliderControlDef[];
  curves: GraphCurveDef[];
  readouts?: GraphReadoutDef[];
  prediction?: GraphPredictionPromptDef;
  challenges?: GraphChallengeDef[];
  samples?: number;
  showDataTable?: boolean;
}

export type ProcessStepperMode = 'linear' | 'cyclic';
export type ProcessVisualMode = 'diagram' | 'stage-illustrations' | 'shared-highlight';

export interface ProcessVisualRef {
  src: string;
  altText: string;
  caption?: string;
}

export interface ProcessHighlightRegion {
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
  label: string;
}

export interface ProcessStagePredictionDef {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ProcessReactionMetadata {
  reactants?: string[];
  intermediates?: string[];
  products?: string[];
  bondsBroken?: string[];
  bondsFormed?: string[];
  electronMovement?: string;
}

export interface ProcessStageDef {
  id: string;
  title: string;
  shortLabel?: string;
  summary: string;
  equation?: string;
  startingCondition?: string;
  whatChanges?: string;
  whyItMatters?: string;
  connectionToNext?: string;
  commonMisconception?: string;
  inputs?: string[];
  outputs?: string[];
  reactionMeta?: ProcessReactionMetadata;
  stateSnapshot?: ProcessStateField[];
  visual?: ProcessVisualRef;
  highlightRegion?: ProcessHighlightRegion;
  prediction?: ProcessStagePredictionDef;
}

export interface ProcessSequenceChallengeDef {
  id: string;
  prompt: string;
  stageIdsToOrder: string[];
  explanation: string;
}

export interface ProcessStepperInteractiveConfig extends SlideInteractiveBase {
  engine: 'process-stepper';
  subjectTag?: string;
  modelNote?: string;
  mode: ProcessStepperMode;
  visualMode?: ProcessVisualMode;
  sharedVisual?: ProcessVisualRef;
  stages: ProcessStageDef[];
  sequenceChallenge?: ProcessSequenceChallengeDef;
}

export interface DiagramHotspotItemDef {
  id: string;
  label: string;
  xPct: number;
  yPct: number;
  widthPct?: number;
  heightPct?: number;
  summary: string;
  functionText?: string;
  structureToFunction?: string;
  equation?: string;
  commonMisconception?: string;
  linkedHotspotIds?: string[];
  relationshipExplanation?: string;
  discoveryPrompt?: string;
}

export interface DiagramVisualRef extends ProcessVisualRef {
  /** Optional unlabelled alt text used during Identify mode before checking so screen readers never leak answers. */
  identifyAltText?: string;
}

export interface DiagramNonVisualQuestionDef {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface DiagramIdentifyPromptDef {
  id: string;
  prompt: string;
  targetHotspotId: string;
  explanation: string;
  hintText?: string;
  /** Equivalent conceptual text-only identification question for nonvisual / screen-reader learners. */
  nonVisualQuestion?: DiagramNonVisualQuestionDef;
}

export interface DiagramHotspotsInteractiveConfig extends SlideInteractiveBase {
  engine: 'diagram-hotspots';
  subjectTag?: string;
  modelNote?: string;
  diagram: DiagramVisualRef;
  defaultMode?: 'explore' | 'identify';
  progressiveDisclosure?: boolean;
  guidedOrder?: string[];
  hotspots: DiagramHotspotItemDef[];
  identifyPrompts?: DiagramIdentifyPromptDef[];
}

export type SlideInteractiveConfig =
  | CodePlaygroundInteractiveConfig
  | ConstructionLabInteractiveConfig
  | RuleExplorerInteractiveConfig
  | GraphSliderInteractiveConfig
  | ProcessStepperInteractiveConfig
  | DiagramHotspotsInteractiveConfig;

const ALLOWED_RULE_OPS = new Set<RuleOperator>(['AND', 'OR', 'NOT', 'XOR']);
const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)$/;
const UNSAFE_PROTOCOL_RE = /\b(?:javascript|vbscript)\s*:|data\s*:\s*text\/html/i;
const READONLY_SQL_FORBIDDEN_RE = /\b(?:DROP|DELETE|INSERT|UPDATE|ALTER|TRUNCATE|CREATE|ATTACH|DETACH)\b/i;

const FORBIDDEN_TEACHER_KEYS = new Set([
  'teacherreference',
  'teacherpseudocode',
  'gradingtests',
  'solutionsql',
  'teachersolutions',
  'hiddentests',
  'answerkey',
  'modelsolution',
  'rubricanswers',
]);

const BASE_ALLOWED_KEYS = new Set([
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

const ENGINE_EXTRA_KEYS: Record<InteractiveEngineId, ReadonlySet<string>> = {
  'rule-explorer': new Set(['subjectTag', 'inputs', 'rule', 'output']),
  'code-playground': new Set(['languages', 'pythonStarter', 'pseudocodeStarter', 'sqlStarter', 'publicTests']),
  'construction-lab': new Set(['labKind', 'activityId']),
  'graph-slider': new Set([
    'subjectTag',
    'modelNote',
    'xVar',
    'axes',
    'sliders',
    'curves',
    'readouts',
    'prediction',
    'challenges',
    'samples',
    'showDataTable',
  ]),
  'process-stepper': new Set([
    'subjectTag',
    'modelNote',
    'mode',
    'visualMode',
    'sharedVisual',
    'stages',
    'sequenceChallenge',
  ]),
  'diagram-hotspots': new Set([
    'subjectTag',
    'modelNote',
    'diagram',
    'defaultMode',
    'progressiveDisclosure',
    'guidedOrder',
    'hotspots',
    'identifyPrompts',
  ]),
};

const DIAGRAM_HOTSPOT_ALLOWED_KEYS = new Set([
  'id',
  'label',
  'xPct',
  'yPct',
  'widthPct',
  'heightPct',
  'summary',
  'functionText',
  'structureToFunction',
  'equation',
  'commonMisconception',
  'linkedHotspotIds',
  'relationshipExplanation',
  'discoveryPrompt',
]);
const DIAGRAM_VISUAL_ALLOWED_KEYS = new Set(['src', 'altText', 'caption', 'identifyAltText']);
const DIAGRAM_IDENTIFY_ALLOWED_KEYS = new Set([
  'id',
  'prompt',
  'targetHotspotId',
  'explanation',
  'hintText',
  'nonVisualQuestion',
]);
const DIAGRAM_NONVISUAL_QUESTION_ALLOWED_KEYS = new Set(['prompt', 'options', 'correctIndex', 'explanation']);

const PROCESS_VISUAL_ALLOWED_KEYS = new Set(['src', 'altText', 'caption']);
const PROCESS_HIGHLIGHT_ALLOWED_KEYS = new Set(['xPct', 'yPct', 'widthPct', 'heightPct', 'label']);
const PROCESS_STATE_ALLOWED_KEYS = new Set(['id', 'label', 'value']);
const PROCESS_PREDICTION_ALLOWED_KEYS = new Set(['prompt', 'options', 'correctIndex', 'explanation']);
const PROCESS_SEQUENCE_ALLOWED_KEYS = new Set(['id', 'prompt', 'stageIdsToOrder', 'explanation']);
const PROCESS_REACTION_META_ALLOWED_KEYS = new Set([
  'reactants',
  'intermediates',
  'products',
  'bondsBroken',
  'bondsFormed',
  'electronMovement',
]);
const PROCESS_STAGE_ALLOWED_KEYS = new Set([
  'id',
  'title',
  'shortLabel',
  'summary',
  'equation',
  'startingCondition',
  'whatChanges',
  'whyItMatters',
  'connectionToNext',
  'commonMisconception',
  'inputs',
  'outputs',
  'reactionMeta',
  'stateSnapshot',
  'visual',
  'highlightRegion',
  'prediction',
]);

const HEX_COLOR_RE = /^#[0-9A-Fa-f]{6}$/;
const GRAPH_VAR_RE = /^[A-Za-z][A-Za-z0-9_]{0,24}$/;
const GRAPH_AXES_ALLOWED_KEYS = new Set(['xLabel', 'xUnit', 'xMin', 'xMax', 'yLabel', 'yUnit', 'yMin', 'yMax']);
const GRAPH_SLIDER_ALLOWED_KEYS = new Set(['id', 'label', 'min', 'max', 'step', 'defaultValue', 'unit', 'presets']);
const GRAPH_CURVE_ALLOWED_KEYS = new Set([
  'id',
  'label',
  'kind',
  'expr',
  'points',
  'color',
  'style',
  'isReference',
  'domainMin',
  'domainMax',
  'stopAtYZero',
]);
const GRAPH_POINT_ALLOWED_KEYS = new Set(['x', 'y']);
const GRAPH_READOUT_ALLOWED_KEYS = new Set(['id', 'label', 'expr', 'unit', 'precision']);
const GRAPH_PREDICTION_ALLOWED_KEYS = new Set(['prompt', 'options', 'correctIndex', 'explanation']);
const GRAPH_CHALLENGE_ALLOWED_KEYS = new Set(['id', 'prompt', 'check', 'successText', 'hintText']);
const GRAPH_CHECK_ALLOWED_KEYS = new Set(['operator', 'conditions']);
const GRAPH_CONDITION_ALLOWED_KEYS = new Set(['sliderId', 'readoutId', 'min', 'max', 'target', 'tolerance']);

const RULE_INPUT_ALLOWED_KEYS = new Set(['id', 'label', 'defaultValue', 'trueText', 'falseText']);
const RULE_OUTPUT_ALLOWED_KEYS = new Set([
  'trueLabel',
  'falseLabel',
  'explanationTrue',
  'explanationFalse',
  'showBinaryValues',
]);
const PUBLIC_TEST_ALLOWED_KEYS = new Set(['stdin', 'expectedStdout']);

export function compareSemver(a: string, b: string): number | null {
  const ma = SEMVER_RE.exec(a.trim());
  const mb = SEMVER_RE.exec(b.trim());
  if (!ma || !mb) return null;
  for (let i = 1; i <= 3; i++) {
    const diff = Number(ma[i]) - Number(mb[i]);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }
  return 0;
}

/**
 * Pure, safe evaluator for declarative RuleExplorer ASTs (zero eval, bounded depth).
 */
export function evaluateDeclarativeRule(
  node: DeclarativeRuleNode,
  values: Record<string, boolean>,
  depth = 0
): boolean {
  if (depth > INTERACTIVE_RESOURCE_LIMITS.maxRuleDepth) {
    throw new Error('Declarative rule exceeds maximum allowed nesting depth.');
  }
  if ('input' in node) {
    return Boolean(values[node.input]);
  }
  const evaluated = node.operands.map((op) => evaluateDeclarativeRule(op, values, depth + 1));
  switch (node.operator) {
    case 'AND':
      return evaluated.length >= 2 && evaluated.every(Boolean);
    case 'OR':
      return evaluated.length >= 2 && evaluated.some(Boolean);
    case 'NOT':
      if (evaluated.length !== 1) {
        throw new Error('NOT operator requires exactly 1 operand.');
      }
      return !Boolean(evaluated[0]);
    case 'XOR':
      if (evaluated.length < 2) {
        throw new Error('XOR operator requires at least 2 operands.');
      }
      return evaluated.reduce((acc, v) => acc !== v, false);
    default:
      throw new Error('Unsupported rule operator.');
  }
}

function validateRuleTree(
  node: unknown,
  validInputIds: Set<string>,
  errors: string[],
  counter: { nodes: number },
  depth = 0
): void {
  counter.nodes += 1;
  if (counter.nodes > INTERACTIVE_RESOURCE_LIMITS.maxRuleNodes) {
    errors.push(`Rule complexity exceeds maximum (${INTERACTIVE_RESOURCE_LIMITS.maxRuleNodes} AST nodes).`);
    return;
  }
  if (depth > INTERACTIVE_RESOURCE_LIMITS.maxRuleDepth) {
    errors.push(`Rule nesting depth exceeds maximum (${INTERACTIVE_RESOURCE_LIMITS.maxRuleDepth}).`);
    return;
  }
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    errors.push('Rule node must be a plain JSON object.');
    return;
  }
  const obj = node as Record<string, unknown>;
  const keys = Object.keys(obj);
  if ('input' in obj) {
    if (keys.some((k) => k !== 'input')) {
      errors.push(`Rule input leaf contains unexpected field(s): ${keys.filter((k) => k !== 'input').join(', ')}.`);
    }
    if (typeof obj.input !== 'string' || !validInputIds.has(obj.input)) {
      errors.push(`Rule references unknown input "${String(obj.input)}".`);
    }
    return;
  }
  if (keys.some((k) => k !== 'operator' && k !== 'operands')) {
    errors.push(
      `Rule operator node contains unexpected field(s): ${keys.filter((k) => k !== 'operator' && k !== 'operands').join(', ')}.`
    );
  }
  if (typeof obj.operator !== 'string' || !ALLOWED_RULE_OPS.has(obj.operator as RuleOperator)) {
    errors.push(`Unsupported rule operator "${String(obj.operator)}". Allowed: AND, OR, NOT, XOR.`);
    return;
  }
  if (!Array.isArray(obj.operands)) {
    errors.push(`Rule operator "${obj.operator}" requires an "operands" array.`);
    return;
  }
  if (obj.operator === 'NOT') {
    if (obj.operands.length !== 1) {
      errors.push(`NOT operator must have exactly 1 operand (received ${obj.operands.length}).`);
      return;
    }
  } else if (obj.operands.length < 2 || obj.operands.length > 8) {
    errors.push(
      `Rule operator "${obj.operator}" must have between 2 and 8 operands (received ${obj.operands.length}).`
    );
    return;
  }
  for (const child of obj.operands) {
    validateRuleTree(child, validInputIds, errors, counter, depth + 1);
  }
}

function scanProtectedAndUnsafeProtocols(node: unknown, errors: string[], trail = 'interactive'): void {
  if (typeof node === 'string') {
    if (UNSAFE_PROTOCOL_RE.test(node)) {
      errors.push(`Unsafe executable URL protocol detected at ${trail}.`);
    }
    return;
  }
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((item, idx) => scanProtectedAndUnsafeProtocols(item, errors, `${trail}[${idx}]`));
    return;
  }
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    if (FORBIDDEN_TEACHER_KEYS.has(k.toLowerCase())) {
      errors.push(`Protected teacher-only field "${trail}.${k}" is prohibited in public interactive configs.`);
    }
    scanProtectedAndUnsafeProtocols(v, errors, `${trail}.${k}`);
  }
}

function checkAllowedKeys(
  obj: Record<string, unknown>,
  allowed: ReadonlySet<string>,
  label: string,
  errors: string[]
): void {
  for (const k of Object.keys(obj)) {
    if (!allowed.has(k) && !FORBIDDEN_TEACHER_KEYS.has(k.toLowerCase())) {
      errors.push(`Unknown configuration field "${label}.${k}" is not permitted by the schema.`);
    }
  }
}

export interface ValidateInteractiveOptions {
  /** When true (publish-time gate), rejects reserved/unimplemented engines. */
  requireImplemented?: boolean;
  /**
   * When true (production CDN publish gate), requires the engine and requested `minEngineVersion`
   * to be available in `productionVersion` (prevents publishing lessons for dev-branch-only engines).
   */
  requireProduction?: boolean;
  /** Optional custom engine registry map for testing production vs dev-branch availability. */
  engineRegistry?: Record<InteractiveEngineId, InteractiveEngineMeta>;
}

export interface InteractiveValidationResult {
  ok: boolean;
  errors: string[];
  config?: SlideInteractiveConfig;
}

export function validateSlideInteractiveConfig(
  raw: unknown,
  options: ValidateInteractiveOptions = {}
): InteractiveValidationResult {
  const errors: string[] = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: ['Interactive config must be a JSON object.'] };
  }

  let serializedBytes = 0;
  try {
    serializedBytes = new TextEncoder().encode(JSON.stringify(raw)).length;
  } catch {
    return { ok: false, errors: ['Interactive config must be valid JSON-serializable data.'] };
  }
  if (serializedBytes > INTERACTIVE_RESOURCE_LIMITS.maxConfigBytes) {
    errors.push(
      `Interactive config exceeds maximum allowed size (${serializedBytes} bytes > ${INTERACTIVE_RESOURCE_LIMITS.maxConfigBytes} bytes).`
    );
  }

  const obj = raw as Record<string, unknown>;
  scanProtectedAndUnsafeProtocols(obj, errors);

  if (typeof obj.id !== 'string' || !/^[A-Za-z0-9_-]{2,64}$/.test(obj.id)) {
    errors.push('Invalid or missing interactive "id" (expected 2-64 alphanumeric/hyphen/underscore chars).');
  }

  const registry = options.engineRegistry ?? SUPPORTED_INTERACTIVE_ENGINES;
  let engineMeta: InteractiveEngineMeta | null = null;
  if (typeof obj.engine !== 'string' || !(obj.engine in registry)) {
    errors.push(`Unknown or unsupported interactive engine "${String(obj.engine)}".`);
  } else {
    engineMeta = registry[obj.engine as InteractiveEngineId];
    // For construction-lab, validateConstructionLabConfig enforces stricter per-labKind allowlists.
    if (engineMeta.id !== 'construction-lab') {
      const allowedTopLevel = new Set([...BASE_ALLOWED_KEYS, ...ENGINE_EXTRA_KEYS[engineMeta.id]]);
      checkAllowedKeys(obj, allowedTopLevel, 'interactive', errors);
    }

    if (options.requireImplemented && !engineMeta.implemented) {
      errors.push(
        `Engine "${engineMeta.id}" is reserved for future development and is not yet implemented for production publishing.`
      );
    }

    if (options.requireProduction && !engineMeta.productionVersion) {
      errors.push(
        `Engine "${engineMeta.id}" is not yet deployed in production (productionVersion: none). Deploy the engine to production before publishing live CDN lessons.`
      );
    }

    if (typeof obj.schemaVersion !== 'number' || !engineMeta.supportedSchemaVersions.includes(obj.schemaVersion)) {
      errors.push(
        `Unsupported schemaVersion "${String(obj.schemaVersion)}" for engine "${engineMeta.id}" (supported: ${engineMeta.supportedSchemaVersions.join(', ')}).`
      );
    }

    if (obj.minEngineVersion !== undefined) {
      if (typeof obj.minEngineVersion !== 'string' || !SEMVER_RE.test(obj.minEngineVersion.trim())) {
        errors.push(`Invalid minEngineVersion "${String(obj.minEngineVersion)}" (expected SemVer MAJOR.MINOR.PATCH).`);
      } else {
        if (engineMeta.implemented) {
          const cmp = compareSemver(engineMeta.engineVersion, obj.minEngineVersion);
          if (cmp === null || cmp < 0) {
            errors.push(
              `Incompatible minEngineVersion "${obj.minEngineVersion}" for engine "${engineMeta.id}" (installed: ${engineMeta.engineVersion}).`
            );
          }
        }
        if (options.requireProduction && engineMeta.productionVersion) {
          const prodCmp = compareSemver(engineMeta.productionVersion, obj.minEngineVersion);
          if (prodCmp === null || prodCmp < 0) {
            errors.push(
              `Engine "${engineMeta.id}" requires minEngineVersion "${obj.minEngineVersion}" which exceeds productionVersion "${engineMeta.productionVersion}". Deploy the newer engine to production before publishing.`
            );
          }
        }
      }
    }
  }

  if (typeof obj.title !== 'string' || obj.title.trim().length < 2) {
    errors.push('Missing required "title".');
  }
  if (typeof obj.instructions !== 'string' || obj.instructions.trim().length < 4) {
    errors.push('Missing required "instructions".');
  }
  if (typeof obj.accessibilityLabel !== 'string' || obj.accessibilityLabel.trim().length < 4) {
    errors.push('Missing required "accessibilityLabel".');
  }
  if (typeof obj.fallbackText !== 'string' || obj.fallbackText.trim().length < 4) {
    errors.push('Missing required "fallbackText" for low-data/fallback support.');
  }
  if (obj.hints !== undefined) {
    if (
      !Array.isArray(obj.hints) ||
      obj.hints.length > INTERACTIVE_RESOURCE_LIMITS.maxHints ||
      obj.hints.some((h) => typeof h !== 'string' || h.trim().length === 0)
    ) {
      errors.push(`Optional "hints" must be an array of up to ${INTERACTIVE_RESOURCE_LIMITS.maxHints} non-empty strings.`);
    }
  }
  if (obj.persistCompletion !== undefined && typeof obj.persistCompletion !== 'boolean') {
    errors.push('Optional "persistCompletion" must be a boolean.');
  }

  // Engine-specific strict schema validation
  if (obj.engine === 'rule-explorer') {
    if (obj.subjectTag !== undefined && typeof obj.subjectTag !== 'string') {
      errors.push('rule-explorer "subjectTag" must be a string.');
    }
    if (
      !Array.isArray(obj.inputs) ||
      obj.inputs.length === 0 ||
      obj.inputs.length > INTERACTIVE_RESOURCE_LIMITS.maxInputs
    ) {
      errors.push(`rule-explorer requires 1 to ${INTERACTIVE_RESOURCE_LIMITS.maxInputs} input definitions.`);
    } else {
      const ids = new Set<string>();
      for (let i = 0; i < obj.inputs.length; i++) {
        const inp = obj.inputs[i];
        if (!inp || typeof inp !== 'object' || Array.isArray(inp)) {
          errors.push(`rule-explorer inputs[${i}] must be an object.`);
          continue;
        }
        const rec = inp as Record<string, unknown>;
        checkAllowedKeys(rec, RULE_INPUT_ALLOWED_KEYS, `inputs[${i}]`, errors);
        if (typeof rec.id !== 'string' || !/^[A-Za-z0-9_-]{1,40}$/.test(rec.id)) {
          errors.push(`rule-explorer inputs[${i}].id must be a 1-40 char identifier.`);
        } else if (ids.has(rec.id)) {
          errors.push(`rule-explorer duplicate input id "${rec.id}".`);
        } else {
          ids.add(rec.id);
        }
        if (typeof rec.label !== 'string' || rec.label.trim().length === 0) {
          errors.push(`rule-explorer inputs[${i}].label must be a non-empty string.`);
        }
        if (rec.defaultValue !== undefined && typeof rec.defaultValue !== 'boolean') {
          errors.push(`rule-explorer inputs[${i}].defaultValue must be a boolean.`);
        }
        if (rec.trueText !== undefined && typeof rec.trueText !== 'string') {
          errors.push(`rule-explorer inputs[${i}].trueText must be a string.`);
        }
        if (rec.falseText !== undefined && typeof rec.falseText !== 'string') {
          errors.push(`rule-explorer inputs[${i}].falseText must be a string.`);
        }
      }
      validateRuleTree(obj.rule, ids, errors, { nodes: 0 });
    }
    const out = obj.output as Record<string, unknown> | undefined;
    if (!out || typeof out !== 'object' || Array.isArray(out)) {
      errors.push('rule-explorer requires an "output" object.');
    } else {
      checkAllowedKeys(out, RULE_OUTPUT_ALLOWED_KEYS, 'output', errors);
      if (typeof out.trueLabel !== 'string' || typeof out.falseLabel !== 'string') {
        errors.push('rule-explorer requires output.trueLabel and output.falseLabel strings.');
      }
      if (typeof out.explanationTrue !== 'string' || typeof out.explanationFalse !== 'string') {
        errors.push('rule-explorer requires output.explanationTrue and output.explanationFalse strings.');
      }
      if (out.showBinaryValues !== undefined && typeof out.showBinaryValues !== 'boolean') {
        errors.push('rule-explorer output.showBinaryValues must be a boolean.');
      }
    }
  } else if (obj.engine === 'code-playground') {
    if (!Array.isArray(obj.languages) || obj.languages.length === 0) {
      errors.push('code-playground requires a non-empty "languages" array.');
    } else {
      for (const lang of obj.languages) {
        if (!['python', 'pseudocode', 'sql'].includes(String(lang))) {
          errors.push(`Unsupported code-playground language "${String(lang)}".`);
        }
      }
    }
    for (const starterKey of ['pythonStarter', 'pseudocodeStarter', 'sqlStarter'] as const) {
      if (obj[starterKey] !== undefined && typeof obj[starterKey] !== 'string') {
        errors.push(`code-playground "${starterKey}" must be a string.`);
      }
    }
    if (typeof obj.sqlStarter === 'string' && READONLY_SQL_FORBIDDEN_RE.test(obj.sqlStarter)) {
      errors.push('code-playground "sqlStarter" must be a read-only SELECT query (DDL/DML statements are prohibited).');
    }
    if (obj.publicTests !== undefined) {
      if (!Array.isArray(obj.publicTests) || obj.publicTests.length > INTERACTIVE_RESOURCE_LIMITS.maxPublicTests) {
        errors.push(`code-playground "publicTests" must be an array of at most ${INTERACTIVE_RESOURCE_LIMITS.maxPublicTests} items.`);
      } else {
        obj.publicTests.forEach((t, idx) => {
          if (!t || typeof t !== 'object' || Array.isArray(t)) {
            errors.push(`code-playground publicTests[${idx}] must be an object.`);
            return;
          }
          const rec = t as Record<string, unknown>;
          checkAllowedKeys(rec, PUBLIC_TEST_ALLOWED_KEYS, `publicTests[${idx}]`, errors);
          if (typeof rec.stdin !== 'string' || typeof rec.expectedStdout !== 'string') {
            errors.push(`code-playground publicTests[${idx}] requires string "stdin" and "expectedStdout".`);
          }
        });
      }
    }
  } else if (obj.engine === 'construction-lab') {
    validateConstructionLabConfig(obj, compareSemver, errors);
  } else if (obj.engine === 'graph-slider') {
    if (obj.subjectTag !== undefined && typeof obj.subjectTag !== 'string') {
      errors.push('graph-slider "subjectTag" must be a string.');
    }
    if (obj.modelNote !== undefined && typeof obj.modelNote !== 'string') {
      errors.push('graph-slider "modelNote" must be a string.');
    }
    if (obj.showDataTable !== undefined && typeof obj.showDataTable !== 'boolean') {
      errors.push('graph-slider "showDataTable" must be a boolean.');
    }
    const xVar = obj.xVar === undefined ? 'x' : obj.xVar;
    if (typeof xVar !== 'string' || !GRAPH_VAR_RE.test(xVar) || xVar === 'PI' || xVar === 'E') {
      errors.push('graph-slider "xVar" must be a valid variable identifier (not PI or E).');
    }
    if (obj.samples !== undefined) {
      if (
        typeof obj.samples !== 'number' ||
        !Number.isInteger(obj.samples) ||
        obj.samples < INTERACTIVE_RESOURCE_LIMITS.minGraphSamples ||
        obj.samples > INTERACTIVE_RESOURCE_LIMITS.maxGraphSamples
      ) {
        errors.push(
          `graph-slider "samples" must be an integer between ${INTERACTIVE_RESOURCE_LIMITS.minGraphSamples} and ${INTERACTIVE_RESOURCE_LIMITS.maxGraphSamples}.`
        );
      }
    }

    // Axes
    const axes = obj.axes as Record<string, unknown> | undefined;
    if (!axes || typeof axes !== 'object' || Array.isArray(axes)) {
      errors.push('graph-slider requires an "axes" object.');
    } else {
      checkAllowedKeys(axes, GRAPH_AXES_ALLOWED_KEYS, 'axes', errors);
      if (typeof axes.xLabel !== 'string' || axes.xLabel.trim().length === 0) {
        errors.push('graph-slider axes.xLabel must be a non-empty string.');
      }
      if (typeof axes.yLabel !== 'string' || axes.yLabel.trim().length === 0) {
        errors.push('graph-slider axes.yLabel must be a non-empty string.');
      }
      if (axes.xUnit !== undefined && typeof axes.xUnit !== 'string') {
        errors.push('graph-slider axes.xUnit must be a string.');
      }
      if (axes.yUnit !== undefined && typeof axes.yUnit !== 'string') {
        errors.push('graph-slider axes.yUnit must be a string.');
      }
      if (
        typeof axes.xMin !== 'number' ||
        typeof axes.xMax !== 'number' ||
        !Number.isFinite(axes.xMin) ||
        !Number.isFinite(axes.xMax) ||
        axes.xMax <= axes.xMin
      ) {
        errors.push('graph-slider axes.xMin and axes.xMax must be finite numbers with xMax > xMin.');
      }
      if (
        typeof axes.yMin !== 'number' ||
        typeof axes.yMax !== 'number' ||
        !Number.isFinite(axes.yMin) ||
        !Number.isFinite(axes.yMax) ||
        axes.yMax <= axes.yMin
      ) {
        errors.push('graph-slider axes.yMin and axes.yMax must be finite numbers with yMax > yMin.');
      }
    }

    // Sliders (0..4)
    const sliderIds = new Set<string>();
    if (obj.sliders !== undefined) {
      if (!Array.isArray(obj.sliders) || obj.sliders.length > INTERACTIVE_RESOURCE_LIMITS.maxGraphSliders) {
        errors.push(`graph-slider "sliders" must be an array of at most ${INTERACTIVE_RESOURCE_LIMITS.maxGraphSliders} items.`);
      } else {
        obj.sliders.forEach((s, idx) => {
          if (!s || typeof s !== 'object' || Array.isArray(s)) {
            errors.push(`graph-slider sliders[${idx}] must be an object.`);
            return;
          }
          const rec = s as Record<string, unknown>;
          checkAllowedKeys(rec, GRAPH_SLIDER_ALLOWED_KEYS, `sliders[${idx}]`, errors);
          if (typeof rec.id !== 'string' || !GRAPH_VAR_RE.test(rec.id) || rec.id === 'PI' || rec.id === 'E' || rec.id === xVar) {
            errors.push(`graph-slider sliders[${idx}].id must be a valid unique variable identifier (not PI, E, or xVar).`);
          } else if (sliderIds.has(rec.id)) {
            errors.push(`graph-slider duplicate slider id "${rec.id}".`);
          } else {
            sliderIds.add(rec.id);
          }
          if (typeof rec.label !== 'string' || rec.label.trim().length === 0) {
            errors.push(`graph-slider sliders[${idx}].label must be a non-empty string.`);
          }
          if (
            typeof rec.min !== 'number' ||
            typeof rec.max !== 'number' ||
            !Number.isFinite(rec.min) ||
            !Number.isFinite(rec.max) ||
            rec.max <= rec.min
          ) {
            errors.push(`graph-slider sliders[${idx}] requires finite min < max.`);
          }
          if (typeof rec.step !== 'number' || !Number.isFinite(rec.step) || rec.step <= 0) {
            errors.push(`graph-slider sliders[${idx}].step must be a positive finite number.`);
          }
          if (
            typeof rec.defaultValue !== 'number' ||
            !Number.isFinite(rec.defaultValue) ||
            (typeof rec.min === 'number' && rec.defaultValue < rec.min) ||
            (typeof rec.max === 'number' && rec.defaultValue > rec.max)
          ) {
            errors.push(`graph-slider sliders[${idx}].defaultValue must be within [min, max].`);
          }
          if (rec.unit !== undefined && typeof rec.unit !== 'string') {
            errors.push(`graph-slider sliders[${idx}].unit must be a string.`);
          }
          if (rec.presets !== undefined) {
            if (
              !Array.isArray(rec.presets) ||
              rec.presets.length > 8 ||
              rec.presets.some(
                (p) =>
                  typeof p !== 'number' ||
                  !Number.isFinite(p) ||
                  (typeof rec.min === 'number' && p < rec.min) ||
                  (typeof rec.max === 'number' && p > rec.max)
              )
            ) {
              errors.push(`graph-slider sliders[${idx}].presets must be up to 8 finite numbers within [min, max].`);
            }
          }
        });
      }
    }

    // Curves (1..4)
    const curveAllowedVars = new Set<string>([...sliderIds, ...(typeof xVar === 'string' ? [xVar] : ['x'])]);
    const curveIds = new Set<string>();
    if (!Array.isArray(obj.curves) || obj.curves.length === 0 || obj.curves.length > INTERACTIVE_RESOURCE_LIMITS.maxGraphCurves) {
      errors.push(`graph-slider requires 1 to ${INTERACTIVE_RESOURCE_LIMITS.maxGraphCurves} curves.`);
    } else {
      obj.curves.forEach((c, idx) => {
        if (!c || typeof c !== 'object' || Array.isArray(c)) {
          errors.push(`graph-slider curves[${idx}] must be an object.`);
          return;
        }
        const rec = c as Record<string, unknown>;
        checkAllowedKeys(rec, GRAPH_CURVE_ALLOWED_KEYS, `curves[${idx}]`, errors);
        if (typeof rec.id !== 'string' || !/^[A-Za-z0-9_-]{1,40}$/.test(rec.id)) {
          errors.push(`graph-slider curves[${idx}].id must be a 1-40 char identifier.`);
        } else if (curveIds.has(rec.id)) {
          errors.push(`graph-slider duplicate curve id "${rec.id}".`);
        } else {
          curveIds.add(rec.id);
        }
        if (typeof rec.label !== 'string' || rec.label.trim().length === 0) {
          errors.push(`graph-slider curves[${idx}].label must be a non-empty string.`);
        }
        if (typeof rec.color !== 'string' || !HEX_COLOR_RE.test(rec.color)) {
          errors.push(`graph-slider curves[${idx}].color must be a 6-digit hex color (e.g. "#0284c7").`);
        }
        if (rec.style !== undefined && !['solid', 'dashed', 'dotted'].includes(String(rec.style))) {
          errors.push(`graph-slider curves[${idx}].style must be "solid", "dashed", or "dotted".`);
        }
        if (rec.isReference !== undefined && typeof rec.isReference !== 'boolean') {
          errors.push(`graph-slider curves[${idx}].isReference must be a boolean.`);
        }
        if (rec.stopAtYZero !== undefined && typeof rec.stopAtYZero !== 'boolean') {
          errors.push(`graph-slider curves[${idx}].stopAtYZero must be a boolean.`);
        }
        if (rec.domainMin !== undefined && (typeof rec.domainMin !== 'number' || !Number.isFinite(rec.domainMin))) {
          errors.push(`graph-slider curves[${idx}].domainMin must be a finite number.`);
        }
        if (rec.domainMax !== undefined && (typeof rec.domainMax !== 'number' || !Number.isFinite(rec.domainMax))) {
          errors.push(`graph-slider curves[${idx}].domainMax must be a finite number.`);
        }
        if (typeof rec.domainMin === 'number' && typeof rec.domainMax === 'number' && rec.domainMax <= rec.domainMin) {
          errors.push(`graph-slider curves[${idx}] requires domainMax > domainMin.`);
        }

        const kind = rec.kind === undefined ? 'formula' : rec.kind;
        if (kind === 'formula') {
          if (typeof rec.expr !== 'string') {
            errors.push(`graph-slider curves[${idx}] (kind="formula") requires a string "expr".`);
          } else {
            const parsed = tryParseMathExpr(rec.expr, curveAllowedVars);
            if (!parsed.ok) {
              errors.push(`graph-slider curves[${idx}].expr invalid: ${parsed.error}`);
            }
          }
        } else if (kind === 'piecewise' || kind === 'step') {
          if (
            !Array.isArray(rec.points) ||
            rec.points.length < 2 ||
            rec.points.length > INTERACTIVE_RESOURCE_LIMITS.maxGraphSeriesPoints
          ) {
            errors.push(
              `graph-slider curves[${idx}] (kind="${kind}") requires 2 to ${INTERACTIVE_RESOURCE_LIMITS.maxGraphSeriesPoints} points.`
            );
          } else {
            let prevX = -Infinity;
            rec.points.forEach((pt, pIdx) => {
              if (!pt || typeof pt !== 'object' || Array.isArray(pt)) {
                errors.push(`graph-slider curves[${idx}].points[${pIdx}] must be an object.`);
                return;
              }
              const ptRec = pt as Record<string, unknown>;
              checkAllowedKeys(ptRec, GRAPH_POINT_ALLOWED_KEYS, `curves[${idx}].points[${pIdx}]`, errors);
              if (
                typeof ptRec.x !== 'number' ||
                typeof ptRec.y !== 'number' ||
                !Number.isFinite(ptRec.x) ||
                !Number.isFinite(ptRec.y)
              ) {
                errors.push(`graph-slider curves[${idx}].points[${pIdx}] requires finite numeric x and y.`);
              } else if (ptRec.x < prevX) {
                errors.push(`graph-slider curves[${idx}].points must have non-decreasing x values.`);
              } else {
                prevX = ptRec.x;
              }
            });
          }
        } else {
          errors.push(`graph-slider curves[${idx}].kind must be "formula", "piecewise", or "step".`);
        }
      });
    }

    // Readouts (0..4)
    const readoutIds = new Set<string>();
    if (obj.readouts !== undefined) {
      if (!Array.isArray(obj.readouts) || obj.readouts.length > INTERACTIVE_RESOURCE_LIMITS.maxGraphReadouts) {
        errors.push(`graph-slider "readouts" must be an array of at most ${INTERACTIVE_RESOURCE_LIMITS.maxGraphReadouts} items.`);
      } else {
        obj.readouts.forEach((r, idx) => {
          if (!r || typeof r !== 'object' || Array.isArray(r)) {
            errors.push(`graph-slider readouts[${idx}] must be an object.`);
            return;
          }
          const rec = r as Record<string, unknown>;
          checkAllowedKeys(rec, GRAPH_READOUT_ALLOWED_KEYS, `readouts[${idx}]`, errors);
          if (typeof rec.id !== 'string' || !/^[A-Za-z0-9_-]{1,40}$/.test(rec.id)) {
            errors.push(`graph-slider readouts[${idx}].id must be a 1-40 char identifier.`);
          } else if (readoutIds.has(rec.id)) {
            errors.push(`graph-slider duplicate readout id "${rec.id}".`);
          } else {
            readoutIds.add(rec.id);
          }
          if (typeof rec.label !== 'string' || rec.label.trim().length === 0) {
            errors.push(`graph-slider readouts[${idx}].label must be a non-empty string.`);
          }
          if (typeof rec.expr !== 'string') {
            errors.push(`graph-slider readouts[${idx}].expr must be a string.`);
          } else {
            const parsed = tryParseMathExpr(rec.expr, sliderIds);
            if (!parsed.ok) {
              errors.push(`graph-slider readouts[${idx}].expr invalid: ${parsed.error}`);
            }
          }
          if (rec.unit !== undefined && typeof rec.unit !== 'string') {
            errors.push(`graph-slider readouts[${idx}].unit must be a string.`);
          }
          if (
            rec.precision !== undefined &&
            (typeof rec.precision !== 'number' || !Number.isInteger(rec.precision) || rec.precision < 0 || rec.precision > 4)
          ) {
            errors.push(`graph-slider readouts[${idx}].precision must be an integer between 0 and 4.`);
          }
        });
      }
    }

    // Optional Prediction Prompt
    if (obj.prediction !== undefined) {
      const pred = obj.prediction as Record<string, unknown>;
      if (!pred || typeof pred !== 'object' || Array.isArray(pred)) {
        errors.push('graph-slider "prediction" must be an object.');
      } else {
        checkAllowedKeys(pred, GRAPH_PREDICTION_ALLOWED_KEYS, 'prediction', errors);
        if (typeof pred.prompt !== 'string' || pred.prompt.trim().length < 4) {
          errors.push('graph-slider prediction.prompt must be a non-empty string.');
        }
        if (
          !Array.isArray(pred.options) ||
          pred.options.length < 2 ||
          pred.options.length > 4 ||
          pred.options.some((o) => typeof o !== 'string' || o.trim().length === 0)
        ) {
          errors.push('graph-slider prediction.options must be 2 to 4 non-empty strings.');
        } else if (
          typeof pred.correctIndex !== 'number' ||
          !Number.isInteger(pred.correctIndex) ||
          pred.correctIndex < 0 ||
          pred.correctIndex >= pred.options.length
        ) {
          errors.push('graph-slider prediction.correctIndex must be a valid option index.');
        }
        if (typeof pred.explanation !== 'string' || pred.explanation.trim().length < 4) {
          errors.push('graph-slider prediction.explanation must be a non-empty string.');
        }
      }
    }

    // Optional Discovery Challenges (0..3)
    if (obj.challenges !== undefined) {
      if (!Array.isArray(obj.challenges) || obj.challenges.length > INTERACTIVE_RESOURCE_LIMITS.maxGraphChallenges) {
        errors.push(`graph-slider "challenges" must be an array of at most ${INTERACTIVE_RESOURCE_LIMITS.maxGraphChallenges} items.`);
      } else {
        const challengeIds = new Set<string>();
        obj.challenges.forEach((ch, idx) => {
          if (!ch || typeof ch !== 'object' || Array.isArray(ch)) {
            errors.push(`graph-slider challenges[${idx}] must be an object.`);
            return;
          }
          const rec = ch as Record<string, unknown>;
          checkAllowedKeys(rec, GRAPH_CHALLENGE_ALLOWED_KEYS, `challenges[${idx}]`, errors);
          if (typeof rec.id !== 'string' || !/^[A-Za-z0-9_-]{1,40}$/.test(rec.id)) {
            errors.push(`graph-slider challenges[${idx}].id must be a 1-40 char identifier.`);
          } else if (challengeIds.has(rec.id)) {
            errors.push(`graph-slider duplicate challenge id "${rec.id}".`);
          } else {
            challengeIds.add(rec.id);
          }
          if (typeof rec.prompt !== 'string' || rec.prompt.trim().length < 4) {
            errors.push(`graph-slider challenges[${idx}].prompt must be a non-empty string.`);
          }
          if (typeof rec.successText !== 'string' || rec.successText.trim().length < 4) {
            errors.push(`graph-slider challenges[${idx}].successText must be a non-empty string.`);
          }
          if (rec.hintText !== undefined && typeof rec.hintText !== 'string') {
            errors.push(`graph-slider challenges[${idx}].hintText must be a string.`);
          }
          const chk = rec.check as Record<string, unknown> | undefined;
          if (!chk || typeof chk !== 'object' || Array.isArray(chk)) {
            errors.push(`graph-slider challenges[${idx}].check must be an object.`);
          } else {
            checkAllowedKeys(chk, GRAPH_CHECK_ALLOWED_KEYS, `challenges[${idx}].check`, errors);
            if (chk.operator !== 'AND' && chk.operator !== 'OR') {
              errors.push(`graph-slider challenges[${idx}].check.operator must be "AND" or "OR".`);
            }
            if (
              !Array.isArray(chk.conditions) ||
              chk.conditions.length === 0 ||
              chk.conditions.length > INTERACTIVE_RESOURCE_LIMITS.maxGraphChallengeConditions
            ) {
              errors.push(
                `graph-slider challenges[${idx}].check.conditions must have 1 to ${INTERACTIVE_RESOURCE_LIMITS.maxGraphChallengeConditions} items.`
              );
            } else {
              chk.conditions.forEach((cond, cIdx) => {
                if (!cond || typeof cond !== 'object' || Array.isArray(cond)) {
                  errors.push(`graph-slider challenges[${idx}].check.conditions[${cIdx}] must be an object.`);
                  return;
                }
                const cRec = cond as Record<string, unknown>;
                checkAllowedKeys(cRec, GRAPH_CONDITION_ALLOWED_KEYS, `challenges[${idx}].check.conditions[${cIdx}]`, errors);
                const hasSlider = typeof cRec.sliderId === 'string';
                const hasReadout = typeof cRec.readoutId === 'string';
                if (hasSlider === hasReadout) {
                  errors.push(
                    `graph-slider challenges[${idx}].check.conditions[${cIdx}] must specify exactly one of "sliderId" or "readoutId".`
                  );
                } else if (hasSlider && !sliderIds.has(cRec.sliderId as string)) {
                  errors.push(
                    `graph-slider challenges[${idx}].check.conditions[${cIdx}] references unknown sliderId "${String(cRec.sliderId)}".`
                  );
                } else if (hasReadout && !readoutIds.has(cRec.readoutId as string)) {
                  errors.push(
                    `graph-slider challenges[${idx}].check.conditions[${cIdx}] references unknown readoutId "${String(cRec.readoutId)}".`
                  );
                }
                const hasBounds =
                  typeof cRec.min === 'number' || typeof cRec.max === 'number' || typeof cRec.target === 'number';
                if (!hasBounds) {
                  errors.push(
                    `graph-slider challenges[${idx}].check.conditions[${cIdx}] requires numeric min, max, or target.`
                  );
                }
              });
            }
          }
        });
      }
    }
  } else if (obj.engine === 'process-stepper') {
    const validateVisualRef = (vis: unknown, label: string) => {
      if (!vis || typeof vis !== 'object' || Array.isArray(vis)) {
        errors.push(`process-stepper ${label} must be an object.`);
        return;
      }
      const vRec = vis as Record<string, unknown>;
      checkAllowedKeys(vRec, PROCESS_VISUAL_ALLOWED_KEYS, label, errors);
      if (typeof vRec.src !== 'string' || !isApprovedProcessAssetPath(vRec.src)) {
        errors.push(`process-stepper ${label}.src must be an approved WebP/PNG media path.`);
      }
      if (typeof vRec.altText !== 'string' || vRec.altText.trim().length < 4) {
        errors.push(`process-stepper ${label}.altText must be at least 4 characters.`);
      }
      if (vRec.caption !== undefined && typeof vRec.caption !== 'string') {
        errors.push(`process-stepper ${label}.caption must be a string.`);
      }
    };

    if (obj.subjectTag !== undefined && typeof obj.subjectTag !== 'string') {
      errors.push('process-stepper "subjectTag" must be a string.');
    }
    if (obj.modelNote !== undefined && typeof obj.modelNote !== 'string') {
      errors.push('process-stepper "modelNote" must be a string.');
    }
    if (obj.mode !== 'linear' && obj.mode !== 'cyclic') {
      errors.push('process-stepper "mode" must be "linear" or "cyclic".');
    }
    const visualMode = obj.visualMode === undefined ? 'diagram' : obj.visualMode;
    if (!['diagram', 'stage-illustrations', 'shared-highlight'].includes(String(visualMode))) {
      errors.push('process-stepper "visualMode" must be "diagram", "stage-illustrations", or "shared-highlight".');
    }
    if (visualMode === 'shared-highlight') {
      if (obj.sharedVisual === undefined) {
        errors.push('process-stepper visualMode="shared-highlight" requires "sharedVisual".');
      } else {
        validateVisualRef(obj.sharedVisual, 'sharedVisual');
      }
    } else if (obj.sharedVisual !== undefined) {
      validateVisualRef(obj.sharedVisual, 'sharedVisual');
    }

    const stageIds = new Set<string>();
    let predictionCount = 0;
    if (
      !Array.isArray(obj.stages) ||
      obj.stages.length < INTERACTIVE_RESOURCE_LIMITS.minProcessStages ||
      obj.stages.length > INTERACTIVE_RESOURCE_LIMITS.maxProcessStages
    ) {
      errors.push(
        `process-stepper requires ${INTERACTIVE_RESOURCE_LIMITS.minProcessStages} to ${INTERACTIVE_RESOURCE_LIMITS.maxProcessStages} stages.`
      );
    } else {
      obj.stages.forEach((st, idx) => {
        if (!st || typeof st !== 'object' || Array.isArray(st)) {
          errors.push(`process-stepper stages[${idx}] must be an object.`);
          return;
        }
        const sRec = st as Record<string, unknown>;
        checkAllowedKeys(sRec, PROCESS_STAGE_ALLOWED_KEYS, `stages[${idx}]`, errors);
        if (typeof sRec.id !== 'string' || !/^[A-Za-z0-9_-]{1,40}$/.test(sRec.id)) {
          errors.push(`process-stepper stages[${idx}].id must be a 1-40 char identifier.`);
        } else if (stageIds.has(sRec.id)) {
          errors.push(`process-stepper duplicate stage id "${sRec.id}".`);
        } else {
          stageIds.add(sRec.id);
        }
        if (typeof sRec.title !== 'string' || sRec.title.trim().length < 2) {
          errors.push(`process-stepper stages[${idx}].title must be a non-empty string.`);
        }
        if (typeof sRec.summary !== 'string' || sRec.summary.trim().length < 4) {
          errors.push(`process-stepper stages[${idx}].summary must be a non-empty string.`);
        }
        for (const optStr of [
          'shortLabel',
          'equation',
          'startingCondition',
          'whatChanges',
          'whyItMatters',
          'connectionToNext',
          'commonMisconception',
        ] as const) {
          if (sRec[optStr] !== undefined && typeof sRec[optStr] !== 'string') {
            errors.push(`process-stepper stages[${idx}].${optStr} must be a string.`);
          }
        }
        if (typeof sRec.equation === 'string' && sRec.equation.length > 180) {
          errors.push(`process-stepper stages[${idx}].equation must be at most 180 characters.`);
        }
        if (sRec.reactionMeta !== undefined) {
          const rm = sRec.reactionMeta as Record<string, unknown>;
          if (!rm || typeof rm !== 'object' || Array.isArray(rm)) {
            errors.push(`process-stepper stages[${idx}].reactionMeta must be an object.`);
          } else {
            checkAllowedKeys(rm, PROCESS_REACTION_META_ALLOWED_KEYS, `stages[${idx}].reactionMeta`, errors);
            for (const listKey of ['reactants', 'intermediates', 'products', 'bondsBroken', 'bondsFormed'] as const) {
              if (rm[listKey] !== undefined) {
                if (
                  !Array.isArray(rm[listKey]) ||
                  (rm[listKey] as unknown[]).length > 4 ||
                  (rm[listKey] as unknown[]).some((x) => typeof x !== 'string' || x.trim().length === 0 || x.length > 120)
                ) {
                  errors.push(`process-stepper stages[${idx}].reactionMeta.${listKey} must be up to 4 non-empty strings (<=120 chars).`);
                }
              }
            }
            if (rm.electronMovement !== undefined && (typeof rm.electronMovement !== 'string' || rm.electronMovement.length > 200)) {
              errors.push(`process-stepper stages[${idx}].reactionMeta.electronMovement must be a string (<=200 chars).`);
            }
          }
        }
        for (const optArr of ['inputs', 'outputs'] as const) {
          if (sRec[optArr] !== undefined) {
            if (
              !Array.isArray(sRec[optArr]) ||
              (sRec[optArr] as unknown[]).length > 6 ||
              (sRec[optArr] as unknown[]).some((x) => typeof x !== 'string' || x.trim().length === 0)
            ) {
              errors.push(`process-stepper stages[${idx}].${optArr} must be an array of up to 6 non-empty strings.`);
            }
          }
        }

        if (sRec.stateSnapshot !== undefined) {
          if (
            !Array.isArray(sRec.stateSnapshot) ||
            sRec.stateSnapshot.length > INTERACTIVE_RESOURCE_LIMITS.maxProcessStateFields
          ) {
            errors.push(
              `process-stepper stages[${idx}].stateSnapshot must have at most ${INTERACTIVE_RESOURCE_LIMITS.maxProcessStateFields} fields.`
            );
          } else {
            const fieldIds = new Set<string>();
            sRec.stateSnapshot.forEach((f, fIdx) => {
              if (!f || typeof f !== 'object' || Array.isArray(f)) {
                errors.push(`process-stepper stages[${idx}].stateSnapshot[${fIdx}] must be an object.`);
                return;
              }
              const fRec = f as Record<string, unknown>;
              checkAllowedKeys(fRec, PROCESS_STATE_ALLOWED_KEYS, `stages[${idx}].stateSnapshot[${fIdx}]`, errors);
              if (
                typeof fRec.id !== 'string' ||
                !/^[A-Za-z0-9_-]{1,32}$/.test(fRec.id) ||
                FORBIDDEN_STATE_IDS.has(fRec.id.toLowerCase())
              ) {
                errors.push(`process-stepper stages[${idx}].stateSnapshot[${fIdx}].id is invalid or unsafe.`);
              } else if (fieldIds.has(fRec.id)) {
                errors.push(`process-stepper stages[${idx}] duplicate state field id "${fRec.id}".`);
              } else {
                fieldIds.add(fRec.id);
              }
              if (typeof fRec.label !== 'string' || fRec.label.trim().length === 0 || fRec.label.length > 60) {
                errors.push(`process-stepper stages[${idx}].stateSnapshot[${fIdx}].label must be 1-60 chars.`);
              }
              if (typeof fRec.value !== 'string' || fRec.value.trim().length === 0 || fRec.value.length > 80) {
                errors.push(`process-stepper stages[${idx}].stateSnapshot[${fIdx}].value must be 1-80 chars.`);
              }
            });
          }
        }

        if (sRec.visual !== undefined) {
          validateVisualRef(sRec.visual, `stages[${idx}].visual`);
        }

        if (sRec.highlightRegion !== undefined) {
          const hr = sRec.highlightRegion as Record<string, unknown>;
          if (!hr || typeof hr !== 'object' || Array.isArray(hr)) {
            errors.push(`process-stepper stages[${idx}].highlightRegion must be an object.`);
          } else {
            checkAllowedKeys(hr, PROCESS_HIGHLIGHT_ALLOWED_KEYS, `stages[${idx}].highlightRegion`, errors);
            const numsOk =
              typeof hr.xPct === 'number' &&
              typeof hr.yPct === 'number' &&
              typeof hr.widthPct === 'number' &&
              typeof hr.heightPct === 'number' &&
              hr.xPct >= 0 &&
              hr.xPct <= 100 &&
              hr.yPct >= 0 &&
              hr.yPct <= 100 &&
              hr.widthPct > 0 &&
              hr.widthPct <= 100 &&
              hr.heightPct > 0 &&
              hr.heightPct <= 100 &&
              hr.xPct + hr.widthPct <= 100 &&
              hr.yPct + hr.heightPct <= 100;
            if (!numsOk) {
              errors.push(`process-stepper stages[${idx}].highlightRegion coordinates must be bounded within 0..100%.`);
            }
            if (typeof hr.label !== 'string' || hr.label.trim().length === 0) {
              errors.push(`process-stepper stages[${idx}].highlightRegion.label must be a non-empty string.`);
            }
          }
        }

        if (sRec.prediction !== undefined) {
          predictionCount += 1;
          const pr = sRec.prediction as Record<string, unknown>;
          if (!pr || typeof pr !== 'object' || Array.isArray(pr)) {
            errors.push(`process-stepper stages[${idx}].prediction must be an object.`);
          } else {
            checkAllowedKeys(pr, PROCESS_PREDICTION_ALLOWED_KEYS, `stages[${idx}].prediction`, errors);
            if (typeof pr.prompt !== 'string' || pr.prompt.trim().length < 4) {
              errors.push(`process-stepper stages[${idx}].prediction.prompt must be a non-empty string.`);
            }
            if (
              !Array.isArray(pr.options) ||
              pr.options.length < 2 ||
              pr.options.length > 4 ||
              pr.options.some((o) => typeof o !== 'string' || o.trim().length === 0)
            ) {
              errors.push(`process-stepper stages[${idx}].prediction.options must be 2 to 4 non-empty strings.`);
            } else if (
              typeof pr.correctIndex !== 'number' ||
              !Number.isInteger(pr.correctIndex) ||
              pr.correctIndex < 0 ||
              pr.correctIndex >= pr.options.length
            ) {
              errors.push(`process-stepper stages[${idx}].prediction.correctIndex must be a valid option index.`);
            }
            if (typeof pr.explanation !== 'string' || pr.explanation.trim().length < 4) {
              errors.push(`process-stepper stages[${idx}].prediction.explanation must be a non-empty string.`);
            }
          }
        }
      });

      if (predictionCount > INTERACTIVE_RESOURCE_LIMITS.maxProcessPredictions) {
        errors.push(
          `process-stepper supports at most ${INTERACTIVE_RESOURCE_LIMITS.maxProcessPredictions} stage prediction questions.`
        );
      }
    }

    if (obj.sequenceChallenge !== undefined) {
      const seq = obj.sequenceChallenge as Record<string, unknown>;
      if (!seq || typeof seq !== 'object' || Array.isArray(seq)) {
        errors.push('process-stepper "sequenceChallenge" must be an object.');
      } else {
        checkAllowedKeys(seq, PROCESS_SEQUENCE_ALLOWED_KEYS, 'sequenceChallenge', errors);
        if (typeof seq.id !== 'string' || !/^[A-Za-z0-9_-]{1,40}$/.test(seq.id)) {
          errors.push('process-stepper sequenceChallenge.id must be a 1-40 char identifier.');
        }
        if (typeof seq.prompt !== 'string' || seq.prompt.trim().length < 4) {
          errors.push('process-stepper sequenceChallenge.prompt must be a non-empty string.');
        }
        if (typeof seq.explanation !== 'string' || seq.explanation.trim().length < 4) {
          errors.push('process-stepper sequenceChallenge.explanation must be a non-empty string.');
        }
        if (
          !Array.isArray(seq.stageIdsToOrder) ||
          seq.stageIdsToOrder.length < 2 ||
          seq.stageIdsToOrder.length > INTERACTIVE_RESOURCE_LIMITS.maxProcessSequenceItems
        ) {
          errors.push(
            `process-stepper sequenceChallenge.stageIdsToOrder must have 2 to ${INTERACTIVE_RESOURCE_LIMITS.maxProcessSequenceItems} stage IDs.`
          );
        } else {
          const seenSeq = new Set<string>();
          for (const sid of seq.stageIdsToOrder) {
            if (typeof sid !== 'string' || !stageIds.has(sid)) {
              errors.push(`process-stepper sequenceChallenge references unknown stage id "${String(sid)}".`);
            } else if (seenSeq.has(sid)) {
              errors.push(`process-stepper sequenceChallenge has duplicate stage id "${sid}".`);
            } else {
              seenSeq.add(sid);
            }
          }
        }
      }
    }
  } else if (obj.engine === 'diagram-hotspots') {
    if (obj.subjectTag !== undefined && typeof obj.subjectTag !== 'string') {
      errors.push('diagram-hotspots "subjectTag" must be a string.');
    }
    if (obj.modelNote !== undefined && typeof obj.modelNote !== 'string') {
      errors.push('diagram-hotspots "modelNote" must be a string.');
    }
    if (obj.defaultMode !== undefined && obj.defaultMode !== 'explore' && obj.defaultMode !== 'identify') {
      errors.push('diagram-hotspots "defaultMode" must be "explore" or "identify".');
    }
    if (obj.progressiveDisclosure !== undefined && typeof obj.progressiveDisclosure !== 'boolean') {
      errors.push('diagram-hotspots "progressiveDisclosure" must be a boolean.');
    }

    const diag = obj.diagram as Record<string, unknown> | undefined;
    if (!diag || typeof diag !== 'object' || Array.isArray(diag)) {
      errors.push('diagram-hotspots requires a "diagram" object.');
    } else {
      checkAllowedKeys(diag, DIAGRAM_VISUAL_ALLOWED_KEYS, 'diagram', errors);
      if (typeof diag.src !== 'string' || !isApprovedInteractiveAssetPath(diag.src)) {
        errors.push('diagram-hotspots diagram.src must be an approved WebP/PNG media path.');
      }
      if (typeof diag.altText !== 'string' || diag.altText.trim().length < 4) {
        errors.push('diagram-hotspots diagram.altText must be at least 4 characters.');
      }
      if (diag.caption !== undefined && typeof diag.caption !== 'string') {
        errors.push('diagram-hotspots diagram.caption must be a string.');
      }
      if (diag.identifyAltText !== undefined && typeof diag.identifyAltText !== 'string') {
        errors.push('diagram-hotspots diagram.identifyAltText must be a string.');
      }
    }

    const hotspotIds = new Set<string>();
    const pendingLinks: Array<{ idx: number; id: string; links: unknown }> = [];
    if (
      !Array.isArray(obj.hotspots) ||
      obj.hotspots.length < INTERACTIVE_RESOURCE_LIMITS.minDiagramHotspots ||
      obj.hotspots.length > INTERACTIVE_RESOURCE_LIMITS.maxDiagramHotspots
    ) {
      errors.push(
        `diagram-hotspots requires ${INTERACTIVE_RESOURCE_LIMITS.minDiagramHotspots} to ${INTERACTIVE_RESOURCE_LIMITS.maxDiagramHotspots} hotspots.`
      );
    } else {
      obj.hotspots.forEach((h, idx) => {
        if (!h || typeof h !== 'object' || Array.isArray(h)) {
          errors.push(`diagram-hotspots hotspots[${idx}] must be an object.`);
          return;
        }
        const hRec = h as Record<string, unknown>;
        checkAllowedKeys(hRec, DIAGRAM_HOTSPOT_ALLOWED_KEYS, `hotspots[${idx}]`, errors);
        let hid = '';
        if (typeof hRec.id !== 'string' || !/^[A-Za-z0-9_-]{1,40}$/.test(hRec.id)) {
          errors.push(`diagram-hotspots hotspots[${idx}].id must be a 1-40 char identifier.`);
        } else if (hotspotIds.has(hRec.id)) {
          errors.push(`diagram-hotspots duplicate hotspot id "${hRec.id}".`);
        } else {
          hotspotIds.add(hRec.id);
          hid = hRec.id;
        }
        if (typeof hRec.label !== 'string' || hRec.label.trim().length < 2) {
          errors.push(`diagram-hotspots hotspots[${idx}].label must be a non-empty string.`);
        }
        if (typeof hRec.summary !== 'string' || hRec.summary.trim().length < 4) {
          errors.push(`diagram-hotspots hotspots[${idx}].summary must be a non-empty string.`);
        }
        const hasRect = hRec.widthPct !== undefined || hRec.heightPct !== undefined;
        if (hasRect) {
          if (!isValidRectPercent(hRec.xPct, hRec.yPct, hRec.widthPct, hRec.heightPct)) {
            errors.push(`diagram-hotspots hotspots[${idx}] rectangular coordinates must be bounded within 0..100%.`);
          }
        } else if (!isValidPointPercent(hRec.xPct, hRec.yPct)) {
          errors.push(`diagram-hotspots hotspots[${idx}] point coordinates (xPct, yPct) must be bounded within 0..100%.`);
        }
        for (const optStr of [
          'functionText',
          'structureToFunction',
          'equation',
          'commonMisconception',
          'relationshipExplanation',
          'discoveryPrompt',
        ] as const) {
          if (hRec[optStr] !== undefined && typeof hRec[optStr] !== 'string') {
            errors.push(`diagram-hotspots hotspots[${idx}].${optStr} must be a string.`);
          }
        }
        if (typeof hRec.equation === 'string' && hRec.equation.length > 180) {
          errors.push(`diagram-hotspots hotspots[${idx}].equation must be at most 180 characters.`);
        }
        if (hRec.linkedHotspotIds !== undefined) {
          pendingLinks.push({ idx, id: hid, links: hRec.linkedHotspotIds });
        }
      });

      for (const item of pendingLinks) {
        if (
          !Array.isArray(item.links) ||
          item.links.length > INTERACTIVE_RESOURCE_LIMITS.maxDiagramLinkedHotspots
        ) {
          errors.push(
            `diagram-hotspots hotspots[${item.idx}].linkedHotspotIds must be an array of at most ${INTERACTIVE_RESOURCE_LIMITS.maxDiagramLinkedHotspots} IDs.`
          );
        } else {
          for (const lid of item.links) {
            if (typeof lid !== 'string' || !hotspotIds.has(lid)) {
              errors.push(`diagram-hotspots hotspots[${item.idx}] references unknown linkedHotspotId "${String(lid)}".`);
            } else if (lid === item.id) {
              errors.push(`diagram-hotspots hotspots[${item.idx}] cannot link to itself ("${lid}").`);
            }
          }
        }
      }
    }

    if (obj.guidedOrder !== undefined) {
      if (!Array.isArray(obj.guidedOrder) || obj.guidedOrder.length === 0) {
        errors.push('diagram-hotspots "guidedOrder" must be a non-empty array of hotspot IDs.');
      } else {
        const seenGuided = new Set<string>();
        for (const gid of obj.guidedOrder) {
          if (typeof gid !== 'string' || !hotspotIds.has(gid)) {
            errors.push(`diagram-hotspots guidedOrder references unknown hotspot id "${String(gid)}".`);
          } else if (seenGuided.has(gid)) {
            errors.push(`diagram-hotspots guidedOrder contains duplicate hotspot id "${gid}".`);
          } else {
            seenGuided.add(gid);
          }
        }
      }
    }

    if (obj.identifyPrompts !== undefined) {
      if (
        !Array.isArray(obj.identifyPrompts) ||
        obj.identifyPrompts.length > INTERACTIVE_RESOURCE_LIMITS.maxDiagramIdentifyPrompts
      ) {
        errors.push(
          `diagram-hotspots "identifyPrompts" must be an array of at most ${INTERACTIVE_RESOURCE_LIMITS.maxDiagramIdentifyPrompts} items.`
        );
      } else {
        const promptIds = new Set<string>();
        obj.identifyPrompts.forEach((p, idx) => {
          if (!p || typeof p !== 'object' || Array.isArray(p)) {
            errors.push(`diagram-hotspots identifyPrompts[${idx}] must be an object.`);
            return;
          }
          const pRec = p as Record<string, unknown>;
          checkAllowedKeys(pRec, DIAGRAM_IDENTIFY_ALLOWED_KEYS, `identifyPrompts[${idx}]`, errors);
          if (typeof pRec.id !== 'string' || !/^[A-Za-z0-9_-]{1,40}$/.test(pRec.id)) {
            errors.push(`diagram-hotspots identifyPrompts[${idx}].id must be a 1-40 char identifier.`);
          } else if (promptIds.has(pRec.id)) {
            errors.push(`diagram-hotspots duplicate identifyPrompt id "${pRec.id}".`);
          } else {
            promptIds.add(pRec.id);
          }
          if (typeof pRec.prompt !== 'string' || pRec.prompt.trim().length < 4) {
            errors.push(`diagram-hotspots identifyPrompts[${idx}].prompt must be a non-empty string.`);
          }
          if (typeof pRec.targetHotspotId !== 'string' || !hotspotIds.has(pRec.targetHotspotId)) {
            errors.push(
              `diagram-hotspots identifyPrompts[${idx}] references unknown targetHotspotId "${String(pRec.targetHotspotId)}".`
            );
          }
          if (typeof pRec.explanation !== 'string' || pRec.explanation.trim().length < 4) {
            errors.push(`diagram-hotspots identifyPrompts[${idx}].explanation must be a non-empty string.`);
          }
          if (pRec.hintText !== undefined && typeof pRec.hintText !== 'string') {
            errors.push(`diagram-hotspots identifyPrompts[${idx}].hintText must be a string.`);
          }
          if (pRec.nonVisualQuestion !== undefined) {
            const nv = pRec.nonVisualQuestion as Record<string, unknown>;
            if (!nv || typeof nv !== 'object' || Array.isArray(nv)) {
              errors.push(`diagram-hotspots identifyPrompts[${idx}].nonVisualQuestion must be an object.`);
            } else {
              checkAllowedKeys(
                nv,
                DIAGRAM_NONVISUAL_QUESTION_ALLOWED_KEYS,
                `identifyPrompts[${idx}].nonVisualQuestion`,
                errors
              );
              if (typeof nv.prompt !== 'string' || nv.prompt.trim().length < 4) {
                errors.push(
                  `diagram-hotspots identifyPrompts[${idx}].nonVisualQuestion.prompt must be a non-empty string.`
                );
              }
              if (
                !Array.isArray(nv.options) ||
                nv.options.length < 2 ||
                nv.options.length > 4 ||
                nv.options.some((opt) => typeof opt !== 'string' || opt.trim().length === 0)
              ) {
                errors.push(
                  `diagram-hotspots identifyPrompts[${idx}].nonVisualQuestion.options must contain 2 to 4 non-empty strings.`
                );
              } else if (
                typeof nv.correctIndex !== 'number' ||
                !Number.isInteger(nv.correctIndex) ||
                nv.correctIndex < 0 ||
                nv.correctIndex >= nv.options.length
              ) {
                errors.push(
                  `diagram-hotspots identifyPrompts[${idx}].nonVisualQuestion.correctIndex must be a valid option index.`
                );
              }
              if (nv.explanation !== undefined && typeof nv.explanation !== 'string') {
                errors.push(
                  `diagram-hotspots identifyPrompts[${idx}].nonVisualQuestion.explanation must be a string.`
                );
              }
            }
          }
        });
      }
    }
  }

  return errors.length === 0
    ? { ok: true, errors: [], config: raw as SlideInteractiveConfig }
    : { ok: false, errors };
}

export function normalizeSlideInteractives(
  interactive: SlideInteractiveConfig | SlideInteractiveConfig[] | undefined
): SlideInteractiveConfig[] {
  if (!interactive) return [];
  return Array.isArray(interactive) ? interactive : [interactive];
}

export interface AssertLessonInteractivesOptions {
  /**
   * Defaults to false (production publish gate rejects unimplemented reserved engines).
   * May be set to true ONLY for explicit preview-only fallback demonstrations.
   */
  allowUnimplementedEngines?: boolean;
  /**
   * Defaults to false (production publish gate rejects engines/versions not yet in production).
   */
  allowDevOnlyEngines?: boolean;
  /** Optional custom engine registry map for testing. */
  engineRegistry?: Record<InteractiveEngineId, InteractiveEngineMeta>;
}

/**
 * Publish-time validation gate for all `slide.interactive` entries across a lesson.
 */
export function assertValidLessonInteractives(
  lesson: {
    lessonId: string;
    slides: Array<{ id: string; interactive?: unknown }>;
  },
  options: AssertLessonInteractivesOptions = {}
): void {
  const seenIds = new Set<string>();
  const errors: string[] = [];

  for (const slide of lesson.slides) {
    if (!slide.interactive) continue;
    const list = Array.isArray(slide.interactive) ? slide.interactive : [slide.interactive];
    if (list.length > INTERACTIVE_RESOURCE_LIMITS.maxActivitiesPerSlide) {
      errors.push(
        `Slide ${slide.id}: exceeds maximum of ${INTERACTIVE_RESOURCE_LIMITS.maxActivitiesPerSlide} interactive activities per slide.`
      );
    }
    let slideGraphCurves = 0;
    for (const raw of list) {
      const res = validateSlideInteractiveConfig(raw, {
        requireImplemented: !options.allowUnimplementedEngines,
        requireProduction: !options.allowUnimplementedEngines && !options.allowDevOnlyEngines,
        engineRegistry: options.engineRegistry,
      });
      if (!res.ok) {
        errors.push(`Slide ${slide.id}: ${res.errors.join(' ')}`);
      } else if (res.config) {
        if (seenIds.has(res.config.id)) {
          errors.push(`Slide ${slide.id}: duplicate interactive activity id "${res.config.id}".`);
        }
        seenIds.add(res.config.id);
        if (res.config.engine === 'graph-slider') {
          slideGraphCurves += res.config.curves.length;
        }
      }
    }
    if (slideGraphCurves > INTERACTIVE_RESOURCE_LIMITS.maxGraphCurvesPerSlide) {
      errors.push(
        `Slide ${slide.id}: total graph-slider curves (${slideGraphCurves}) exceeds slide maximum (${INTERACTIVE_RESOURCE_LIMITS.maxGraphCurvesPerSlide}).`
      );
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Interactive schema validation FAILED for ${lesson.lessonId}:\n - ${errors.join('\n - ')}`
    );
  }
}
