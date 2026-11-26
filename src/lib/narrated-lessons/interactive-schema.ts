/**
 * Versioned, declarative `slide.interactive` configuration schema & validator
 * for GAM EDU's Reusable Interactive Engine Registry (Step 3).
 *
 * Strictly data-only:
 * - No arbitrary JavaScript, eval(), new Function(), or executable HTML.
 * - Safe declarative boolean/condition ASTs only.
 * - Rejects protected teacher fields and unknown/unsupported engine versions gracefully.
 */

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
  supportedSchemaVersions: readonly number[];
  implemented: boolean;
  description: string;
}

export const SUPPORTED_INTERACTIVE_ENGINES: Record<InteractiveEngineId, InteractiveEngineMeta> = {
  'code-playground': {
    id: 'code-playground',
    engineVersion: '1.0.0',
    supportedSchemaVersions: [1],
    implemented: true,
    description: 'Reuses InlineCodePlayground (Python 3, Cambridge Pseudocode, Read-Only SQL).',
  },
  'construction-lab': {
    id: 'construction-lab',
    engineVersion: '1.0.0',
    supportedSchemaVersions: [1],
    implemented: true,
    description: 'Reuses BooleanCircuitLab and future construction simulators.',
  },
  'rule-explorer': {
    id: 'rule-explorer',
    engineVersion: '1.0.0',
    supportedSchemaVersions: [1],
    implemented: true,
    description: 'Cross-subject declarative condition/rule explorer (CS, Chemistry, Biology, Physics).',
  },
  'graph-slider': {
    id: 'graph-slider',
    engineVersion: '0.0.0-planned',
    supportedSchemaVersions: [1],
    implemented: false,
    description: 'Planned Step 4: Dynamic graph, parameter slider, and digital/orbital waveform explorer.',
  },
  'process-stepper': {
    id: 'process-stepper',
    engineVersion: '0.0.0-planned',
    supportedSchemaVersions: [1],
    implemented: false,
    description: 'Planned Step 4: Step-by-step process and mechanism explorer.',
  },
  'diagram-hotspots': {
    id: 'diagram-hotspots',
    engineVersion: '0.0.0-planned',
    supportedSchemaVersions: [1],
    implemented: false,
    description: 'Planned Step 4: Non-graded interactive diagram hotspot explorer.',
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

export interface ConstructionLabInteractiveConfig extends SlideInteractiveBase {
  engine: 'construction-lab';
  labKind: 'boolean-circuit';
  activityId?: string;
}

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

export interface PlannedEngineInteractiveConfig extends SlideInteractiveBase {
  engine: 'graph-slider' | 'process-stepper' | 'diagram-hotspots';
  params?: Record<string, unknown>;
}

export type SlideInteractiveConfig =
  | CodePlaygroundInteractiveConfig
  | ConstructionLabInteractiveConfig
  | RuleExplorerInteractiveConfig
  | PlannedEngineInteractiveConfig;

const ALLOWED_RULE_OPS = new Set<RuleOperator>(['AND', 'OR', 'NOT', 'XOR']);
const MAX_RULE_DEPTH = 6;
const MAX_INPUTS = 8;

const UNSAFE_SCRIPT_RE = /<\s*script\b|\beval\s*\(|\bnew\s+Function\s*\(|javascript\s*:/i;
const FORBIDDEN_TEACHER_KEYS = new Set([
  'teacherreference',
  'teacherpseudocode',
  'gradingtests',
  'solutionsql',
  'teachersolutions',
  'hiddentests',
  'answerkey',
  'modelsolution',
]);

/**
 * Pure, safe evaluator for declarative RuleExplorer ASTs (zero eval, bounded depth).
 */
export function evaluateDeclarativeRule(
  node: DeclarativeRuleNode,
  values: Record<string, boolean>,
  depth = 0
): boolean {
  if (depth > MAX_RULE_DEPTH) {
    throw new Error('Declarative rule exceeds maximum allowed nesting depth.');
  }
  if ('input' in node) {
    return Boolean(values[node.input]);
  }
  const evaluated = node.operands.map((op) => evaluateDeclarativeRule(op, values, depth + 1));
  switch (node.operator) {
    case 'AND':
      return evaluated.length > 0 && evaluated.every(Boolean);
    case 'OR':
      return evaluated.some(Boolean);
    case 'NOT':
      return !Boolean(evaluated[0]);
    case 'XOR':
      return evaluated.reduce((acc, v) => acc !== v, false);
    default:
      throw new Error(`Unsupported rule operator.`);
  }
}

function validateRuleTree(
  node: unknown,
  validInputIds: Set<string>,
  errors: string[],
  depth = 0
): void {
  if (depth > MAX_RULE_DEPTH) {
    errors.push(`Rule nesting depth exceeds maximum (${MAX_RULE_DEPTH}).`);
    return;
  }
  if (!node || typeof node !== 'object') {
    errors.push('Rule node must be an object.');
    return;
  }
  const obj = node as Record<string, unknown>;
  if ('input' in obj) {
    if (typeof obj.input !== 'string' || !validInputIds.has(obj.input)) {
      errors.push(`Rule references unknown input "${String(obj.input)}".`);
    }
    return;
  }
  if (typeof obj.operator !== 'string' || !ALLOWED_RULE_OPS.has(obj.operator as RuleOperator)) {
    errors.push(`Unsupported rule operator "${String(obj.operator)}". Allowed: AND, OR, NOT, XOR.`);
    return;
  }
  if (!Array.isArray(obj.operands) || obj.operands.length === 0 || obj.operands.length > 8) {
    errors.push(`Rule operator "${obj.operator}" must have between 1 and 8 operands.`);
    return;
  }
  if (obj.operator === 'NOT' && obj.operands.length !== 1) {
    errors.push('NOT operator must have exactly 1 operand.');
  }
  for (const child of obj.operands) {
    validateRuleTree(child, validInputIds, errors, depth + 1);
  }
}

function scanUnsafeKeysOrPayloads(node: unknown, errors: string[], trail = 'interactive'): void {
  if (typeof node === 'string') {
    if (UNSAFE_SCRIPT_RE.test(node)) {
      errors.push(`Unsafe executable payload detected at ${trail}.`);
    }
    return;
  }
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    node.forEach((item, idx) => scanUnsafeKeysOrPayloads(item, errors, `${trail}[${idx}]`));
    return;
  }
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    if (FORBIDDEN_TEACHER_KEYS.has(k.toLowerCase())) {
      errors.push(`Protected teacher-only field "${trail}.${k}" is prohibited in public interactive configs.`);
    }
    scanUnsafeKeysOrPayloads(v, errors, `${trail}.${k}`);
  }
}

export interface InteractiveValidationResult {
  ok: boolean;
  errors: string[];
  config?: SlideInteractiveConfig;
}

export function validateSlideInteractiveConfig(raw: unknown): InteractiveValidationResult {
  const errors: string[] = [];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { ok: false, errors: ['Interactive config must be a JSON object.'] };
  }

  const obj = raw as Record<string, unknown>;
  scanUnsafeKeysOrPayloads(obj, errors);

  if (typeof obj.id !== 'string' || !/^[A-Za-z0-9_-]{2,64}$/.test(obj.id)) {
    errors.push('Invalid or missing interactive "id" (expected 2-64 alphanumeric/hyphen/underscore chars).');
  }
  if (typeof obj.engine !== 'string' || !(obj.engine in SUPPORTED_INTERACTIVE_ENGINES)) {
    errors.push(`Unknown or unsupported interactive engine "${String(obj.engine)}".`);
  } else {
    const meta = SUPPORTED_INTERACTIVE_ENGINES[obj.engine as InteractiveEngineId];
    if (typeof obj.schemaVersion !== 'number' || !meta.supportedSchemaVersions.includes(obj.schemaVersion)) {
      errors.push(
        `Unsupported schemaVersion "${String(obj.schemaVersion)}" for engine "${obj.engine}" (supported: ${meta.supportedSchemaVersions.join(', ')}).`
      );
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

  // Engine-specific strict validation
  if (obj.engine === 'rule-explorer') {
    if (!Array.isArray(obj.inputs) || obj.inputs.length === 0 || obj.inputs.length > MAX_INPUTS) {
      errors.push(`rule-explorer requires 1 to ${MAX_INPUTS} input definitions.`);
    } else {
      const ids = new Set<string>();
      for (const inp of obj.inputs) {
        const rec = inp as Record<string, unknown>;
        if (typeof rec?.id !== 'string' || typeof rec?.label !== 'string') {
          errors.push('Each rule-explorer input must have string "id" and "label".');
        } else {
          ids.add(rec.id);
        }
      }
      validateRuleTree(obj.rule, ids, errors);
    }
    const out = obj.output as Record<string, unknown> | undefined;
    if (!out || typeof out.trueLabel !== 'string' || typeof out.falseLabel !== 'string') {
      errors.push('rule-explorer requires output.trueLabel and output.falseLabel.');
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
  } else if (obj.engine === 'construction-lab') {
    if (obj.labKind !== 'boolean-circuit') {
      errors.push(`Unsupported construction-lab labKind "${String(obj.labKind)}".`);
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

/**
 * Publish-time validation gate for all `slide.interactive` entries across a lesson.
 */
export function assertValidLessonInteractives(lesson: {
  lessonId: string;
  slides: Array<{ id: string; interactive?: unknown }>;
}): void {
  const seenIds = new Set<string>();
  const errors: string[] = [];

  for (const slide of lesson.slides) {
    if (!slide.interactive) continue;
    const list = Array.isArray(slide.interactive) ? slide.interactive : [slide.interactive];
    for (const raw of list) {
      const res = validateSlideInteractiveConfig(raw);
      if (!res.ok) {
        errors.push(`Slide ${slide.id}: ${res.errors.join(' ')}`);
      } else if (res.config) {
        if (seenIds.has(res.config.id)) {
          errors.push(`Slide ${slide.id}: duplicate interactive activity id "${res.config.id}".`);
        }
        seenIds.add(res.config.id);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Interactive schema validation FAILED for ${lesson.lessonId}:\n - ${errors.join('\n - ')}`
    );
  }
}
