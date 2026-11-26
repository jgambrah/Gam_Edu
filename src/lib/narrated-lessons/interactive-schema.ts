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

export const INTERACTIVE_RESOURCE_LIMITS = {
  maxConfigBytes: 24_576,
  maxActivitiesPerSlide: 4,
  maxRuleDepth: 6,
  maxRuleNodes: 32,
  maxInputs: 8,
  maxHints: 6,
  maxPublicTests: 8,
} as const;

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
    description: 'Reuses BooleanCircuitLab (interactive logic gate circuit builder).',
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
    description: 'Reserved for Step 4: Dynamic graph, parameter slider, and waveform/orbital explorer.',
  },
  'process-stepper': {
    id: 'process-stepper',
    engineVersion: '0.0.0-planned',
    supportedSchemaVersions: [1],
    implemented: false,
    description: 'Reserved for Step 4: Step-by-step process and mechanism explorer.',
  },
  'diagram-hotspots': {
    id: 'diagram-hotspots',
    engineVersion: '0.0.0-planned',
    supportedSchemaVersions: [1],
    implemented: false,
    description: 'Reserved for Step 4: Non-graded interactive diagram hotspot explorer.',
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
  'graph-slider': new Set(['params']),
  'process-stepper': new Set(['params']),
  'diagram-hotspots': new Set(['params']),
};

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

  let engineMeta: InteractiveEngineMeta | null = null;
  if (typeof obj.engine !== 'string' || !(obj.engine in SUPPORTED_INTERACTIVE_ENGINES)) {
    errors.push(`Unknown or unsupported interactive engine "${String(obj.engine)}".`);
  } else {
    engineMeta = SUPPORTED_INTERACTIVE_ENGINES[obj.engine as InteractiveEngineId];
    const allowedTopLevel = new Set([...BASE_ALLOWED_KEYS, ...ENGINE_EXTRA_KEYS[engineMeta.id]]);
    checkAllowedKeys(obj, allowedTopLevel, 'interactive', errors);

    if (options.requireImplemented && !engineMeta.implemented) {
      errors.push(
        `Engine "${engineMeta.id}" is reserved for future development and is not yet implemented for production publishing.`
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
      } else if (engineMeta.implemented) {
        const cmp = compareSemver(engineMeta.engineVersion, obj.minEngineVersion);
        if (cmp === null || cmp < 0) {
          errors.push(
            `Incompatible minEngineVersion "${obj.minEngineVersion}" for engine "${engineMeta.id}" (installed: ${engineMeta.engineVersion}).`
          );
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
    if (obj.labKind !== 'boolean-circuit') {
      errors.push(`Unsupported construction-lab labKind "${String(obj.labKind)}".`);
    }
    if (obj.activityId !== undefined && typeof obj.activityId !== 'string') {
      errors.push('construction-lab "activityId" must be a string.');
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
    for (const raw of list) {
      const res = validateSlideInteractiveConfig(raw, {
        requireImplemented: !options.allowUnimplementedEngines,
      });
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
