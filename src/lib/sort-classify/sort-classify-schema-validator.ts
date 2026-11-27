/**
 * GAM EDU — Step 5B Strict Discriminated Schema & Referential Integrity Validator
 * for `engine: 'sort-classify'` (`1.0.0`).
 *
 * Pure TypeScript, zero React/DOM dependencies.
 * Enforces:
 * - Safe bounded IDs & prototype-pollution key rejection
 * - Duplicate IDs, duplicate references, duplicate expected matches & duplicate accepted orders
 * - One-to-one expected match cardinality when `allowManyToMany` is false
 * - Deterministic bipartite matching feasibility for non-reusable cloze activities
 * - Undeclared, missing, and duplicate cloze placeholders
 * - Nested misconception maps & valid references
 * - Approved visual asset refs (`isApprovedInteractiveAssetPath`) with mandatory alt text
 * - Optional `prediction`, `learningMode`, `explicitEmptyDecision`, `successExplanation`
 */

import {
  SORT_CLASSIFY_LIMITS,
  hasValidNonReusableClozeAssignment,
} from './sort-classify-engine';
import { isApprovedInteractiveAssetPath } from '../narrated-lessons/visual-region';

const SAFE_ID_RE = /^[A-Za-z0-9_-]{1,48}$/;
const FORBIDDEN_PROP_NAMES = new Set([
  '__proto__',
  'constructor',
  'prototype',
  'toString',
  'valueOf',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
]);
const PLACEHOLDER_RE = /\{\{([^{}]+)\}\}/g;

const SHARED_SORT_KEYS = [
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
  'subjectTag',
  'curriculumLevel',
  'mode',
  'learningMode',
  'prediction',
  'successExplanation',
] as const;

const BINS_KEYS = new Set([...SHARED_SORT_KEYS, 'bins', 'items', 'allowMultipleBinsPerItem', 'explicitEmptyDecision']);
const MATCH_KEYS = new Set([...SHARED_SORT_KEYS, 'leftItems', 'rightItems', 'expectedMatches', 'allowManyToMany']);
const CLOZE_KEYS = new Set([...SHARED_SORT_KEYS, 'template', 'blanks', 'tokens', 'reusableTokens']);
const ORDER_KEYS = new Set([...SHARED_SORT_KEYS, 'items', 'acceptedOrders']);

const BIN_ITEM_KEYS = new Set(['id', 'label', 'description', 'visual']);
const SORT_ITEM_KEYS = new Set(['id', 'label', 'validBinIds', 'misconceptionByBin', 'visual']);
const SIDE_ITEM_KEYS = new Set(['id', 'label', 'visual']);
const TOKEN_ITEM_KEYS = new Set(['id', 'label']);
const PAIR_KEYS = new Set(['leftId', 'rightId']);
const BLANK_KEYS = new Set(['id', 'acceptedTokenIds', 'misconceptionByToken']);
const VISUAL_KEYS = new Set(['src', 'alt']);
const PREDICTION_KEYS = new Set(['prompt', 'options', 'correctIndex', 'explanation']);
const VALID_LEVELS = new Set(['early-years', 'primary', 'lower-secondary', 'igcse', 'as-a-level']);

function isPlainObj(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === 'object' && !Array.isArray(v);
}

function checkAllowed(rec: Record<string, unknown>, allowed: ReadonlySet<string>, ctx: string, errors: string[]) {
  for (const k of Object.keys(rec)) {
    if (FORBIDDEN_PROP_NAMES.has(k)) {
      errors.push(`Prototype-sensitive key "${k}" is forbidden in ${ctx}.`);
    } else if (!allowed.has(k)) {
      errors.push(`Unknown field "${k}" in ${ctx}.`);
    }
  }
}

function isSafeId(v: unknown): v is string {
  return typeof v === 'string' && SAFE_ID_RE.test(v) && !FORBIDDEN_PROP_NAMES.has(v);
}

function validateLabel(v: unknown, ctx: string, errors: string[], maxLen: number = SORT_CLASSIFY_LIMITS.maxLabelLength) {
  if (typeof v !== 'string' || !v.trim() || v.trim().length > maxLen) {
    errors.push(`${ctx} must be a non-empty string of at most ${maxLen} characters.`);
  }
}

function validateOptionalVisual(vis: unknown, ctx: string, errors: string[]) {
  if (vis === undefined) return;
  if (!isPlainObj(vis)) {
    errors.push(`${ctx} must be an object with approved src and alt.`);
    return;
  }
  checkAllowed(vis, VISUAL_KEYS, ctx, errors);
  if (typeof vis.src !== 'string' || !isApprovedInteractiveAssetPath(vis.src)) {
    errors.push(`${ctx}.src must be an approved interactive visual asset path (no external URLs, HTML, or unsafe SVG).`);
  }
  if (typeof vis.alt !== 'string' || vis.alt.trim().length < 4 || vis.alt.trim().length > 200) {
    errors.push(`${ctx}.alt must be a meaningful alternative text string (4..200 chars).`);
  }
}

function validateMisconceptionMap(
  map: unknown,
  declaredRefIds: ReadonlySet<string>,
  ctx: string,
  errors: string[],
) {
  if (map === undefined) return;
  if (!isPlainObj(map)) {
    errors.push(`${ctx} must be a plain object mapping declared IDs to feedback strings.`);
    return;
  }
  for (const key of Object.keys(map)) {
    if (FORBIDDEN_PROP_NAMES.has(key)) {
      errors.push(`${ctx} contains forbidden prototype-sensitive key "${key}".`);
      continue;
    }
    if (!declaredRefIds.has(key)) {
      errors.push(`${ctx}["${key}"] references an undeclared ID.`);
    }
    const msg = map[key];
    if (typeof msg !== 'string' || !msg.trim() || msg.length > SORT_CLASSIFY_LIMITS.maxDescriptionLength) {
      errors.push(`${ctx}["${key}"] must be a non-empty string of at most ${SORT_CLASSIFY_LIMITS.maxDescriptionLength} characters.`);
    }
  }
}

function validateOptionalPrediction(pred: unknown, errors: string[]) {
  if (pred === undefined) return;
  if (!isPlainObj(pred)) {
    errors.push('sort-classify "prediction" must be an object.');
    return;
  }
  checkAllowed(pred, PREDICTION_KEYS, 'sort-classify.prediction', errors);
  if (typeof pred.prompt !== 'string' || pred.prompt.trim().length < 4 || pred.prompt.length > 300) {
    errors.push('prediction.prompt must be a string (4..300 chars).');
  }
  if (!Array.isArray(pred.options) || pred.options.length < 2 || pred.options.length > 4) {
    errors.push('prediction.options must contain 2..4 string options.');
  } else {
    pred.options.forEach((opt, i) => {
      if (typeof opt !== 'string' || !opt.trim() || opt.length > 160) {
        errors.push(`prediction.options[${i}] must be a non-empty string (<= 160 chars).`);
      }
    });
    if (
      typeof pred.correctIndex !== 'number' ||
      !Number.isInteger(pred.correctIndex) ||
      pred.correctIndex < 0 ||
      pred.correctIndex >= pred.options.length
    ) {
      errors.push('prediction.correctIndex must be a valid option index.');
    }
  }
  if (typeof pred.explanation !== 'string' || pred.explanation.trim().length < 4 || pred.explanation.length > SORT_CLASSIFY_LIMITS.maxExplanationLength) {
    errors.push(`prediction.explanation must be a string (4..${SORT_CLASSIFY_LIMITS.maxExplanationLength} chars).`);
  }
}

export function validateSortClassifyConfig(obj: Record<string, unknown>, errors: string[]): void {
  const mode = obj.mode;
  if (
    mode !== 'category-bins' &&
    mode !== 'pair-matching' &&
    mode !== 'cloze-tiles' &&
    mode !== 'order-sequence'
  ) {
    errors.push('sort-classify "mode" must be category-bins, pair-matching, cloze-tiles, or order-sequence.');
    return;
  }

  if (typeof obj.curriculumLevel !== 'string' || !VALID_LEVELS.has(obj.curriculumLevel)) {
    errors.push('sort-classify "curriculumLevel" must be early-years, primary, lower-secondary, igcse, or as-a-level.');
  }

  if (obj.learningMode !== undefined && obj.learningMode !== 'explore' && obj.learningMode !== 'practice') {
    errors.push('sort-classify "learningMode" must be "explore" or "practice".');
  }

  if (obj.subjectTag !== undefined) {
    if (typeof obj.subjectTag !== 'string' || !obj.subjectTag.trim() || obj.subjectTag.length > 60) {
      errors.push('sort-classify "subjectTag" must be a non-empty string (<= 60 chars).');
    }
  }

  if (obj.successExplanation !== undefined) {
    if (
      typeof obj.successExplanation !== 'string' ||
      obj.successExplanation.trim().length < 4 ||
      obj.successExplanation.length > SORT_CLASSIFY_LIMITS.maxExplanationLength
    ) {
      errors.push(`sort-classify "successExplanation" must be a string (4..${SORT_CLASSIFY_LIMITS.maxExplanationLength} chars).`);
    }
  }

  validateOptionalPrediction(obj.prediction, errors);

  // MODE 1: CATEGORY BINS
  if (mode === 'category-bins') {
    checkAllowed(obj, BINS_KEYS, 'sort-classify(category-bins)', errors);
    if (obj.allowMultipleBinsPerItem !== undefined && typeof obj.allowMultipleBinsPerItem !== 'boolean') {
      errors.push('category-bins "allowMultipleBinsPerItem" must be a strict boolean.');
    }
    if (obj.explicitEmptyDecision !== undefined && typeof obj.explicitEmptyDecision !== 'boolean') {
      errors.push('category-bins "explicitEmptyDecision" must be a strict boolean.');
    }
    const bins = obj.bins;
    const binIds = new Set<string>();
    if (!Array.isArray(bins) || bins.length < SORT_CLASSIFY_LIMITS.minBins || bins.length > SORT_CLASSIFY_LIMITS.maxBins) {
      errors.push(`category-bins requires ${SORT_CLASSIFY_LIMITS.minBins}..${SORT_CLASSIFY_LIMITS.maxBins} bins.`);
    } else {
      bins.forEach((b, i) => {
        if (!isPlainObj(b)) {
          errors.push(`bins[${i}] must be an object.`);
          return;
        }
        checkAllowed(b, BIN_ITEM_KEYS, `bins[${i}]`, errors);
        if (!isSafeId(b.id)) {
          errors.push(`bins[${i}].id must be a safe bounded identifier (^[A-Za-z0-9_-]{1,48}$).`);
        } else if (binIds.has(b.id)) {
          errors.push(`Duplicate bin id "${b.id}".`);
        } else {
          binIds.add(b.id);
        }
        validateLabel(b.label, `bins[${i}].label`, errors);
        if (b.description !== undefined) {
          validateLabel(b.description, `bins[${i}].description`, errors, SORT_CLASSIFY_LIMITS.maxDescriptionLength);
        }
        validateOptionalVisual(b.visual, `bins[${i}].visual`, errors);
      });
    }

    const items = obj.items;
    const itemIds = new Set<string>();
    if (!Array.isArray(items) || items.length < SORT_CLASSIFY_LIMITS.minItems || items.length > SORT_CLASSIFY_LIMITS.maxItems) {
      errors.push(`category-bins requires ${SORT_CLASSIFY_LIMITS.minItems}..${SORT_CLASSIFY_LIMITS.maxItems} items.`);
    } else {
      items.forEach((it, i) => {
        if (!isPlainObj(it)) {
          errors.push(`items[${i}] must be an object.`);
          return;
        }
        checkAllowed(it, SORT_ITEM_KEYS, `items[${i}]`, errors);
        if (!isSafeId(it.id)) {
          errors.push(`items[${i}].id must be a safe bounded identifier (^[A-Za-z0-9_-]{1,48}$).`);
        } else if (itemIds.has(it.id)) {
          errors.push(`Duplicate item id "${it.id}".`);
        } else {
          itemIds.add(it.id);
        }
        validateLabel(it.label, `items[${i}].label`, errors);
        validateOptionalVisual(it.visual, `items[${i}].visual`, errors);

        if (!Array.isArray(it.validBinIds)) {
          errors.push(`items[${i}].validBinIds must be an array of declared bin IDs.`);
        } else {
          const seenValid = new Set<string>();
          for (const bid of it.validBinIds) {
            if (typeof bid !== 'string' || !binIds.has(bid)) {
              errors.push(`items[${i}].validBinIds references undeclared bin ID "${String(bid)}".`);
            } else if (seenValid.has(bid)) {
              errors.push(`items[${i}].validBinIds contains duplicate bin ID "${bid}".`);
            } else {
              seenValid.add(bid);
            }
          }
        }
        validateMisconceptionMap(it.misconceptionByBin, binIds, `items[${i}].misconceptionByBin`, errors);
      });
    }
    return;
  }

  // MODE 2: PAIR MATCHING
  if (mode === 'pair-matching') {
    checkAllowed(obj, MATCH_KEYS, 'sort-classify(pair-matching)', errors);
    if (obj.allowManyToMany !== undefined && typeof obj.allowManyToMany !== 'boolean') {
      errors.push('pair-matching "allowManyToMany" must be a strict boolean.');
    }
    const allowMany = Boolean(obj.allowManyToMany);
    const leftIds = new Set<string>();
    const rightIds = new Set<string>();
    for (const [field, setRef] of [
      ['leftItems', leftIds],
      ['rightItems', rightIds],
    ] as const) {
      const arr = obj[field];
      if (!Array.isArray(arr) || arr.length < SORT_CLASSIFY_LIMITS.minPairs || arr.length > SORT_CLASSIFY_LIMITS.maxPairs) {
        errors.push(`pair-matching "${field}" requires ${SORT_CLASSIFY_LIMITS.minPairs}..${SORT_CLASSIFY_LIMITS.maxPairs} items.`);
      } else {
        arr.forEach((it, i) => {
          if (!isPlainObj(it)) {
            errors.push(`${field}[${i}] must be an object.`);
            return;
          }
          checkAllowed(it, SIDE_ITEM_KEYS, `${field}[${i}]`, errors);
          if (!isSafeId(it.id)) {
            errors.push(`${field}[${i}].id must be a safe bounded identifier (^[A-Za-z0-9_-]{1,48}$).`);
          } else if (setRef.has(it.id)) {
            errors.push(`Duplicate id "${it.id}" in ${field}.`);
          } else {
            setRef.add(it.id);
          }
          validateLabel(it.label, `${field}[${i}].label`, errors);
          validateOptionalVisual(it.visual, `${field}[${i}].visual`, errors);
        });
      }
    }
    const matches = obj.expectedMatches;
    if (!Array.isArray(matches) || matches.length < 1 || matches.length > SORT_CLASSIFY_LIMITS.maxExpectedMatches) {
      errors.push(`pair-matching requires 1..${SORT_CLASSIFY_LIMITS.maxExpectedMatches} expectedMatches entries.`);
    } else {
      const seenPairs = new Set<string>();
      const seenLeft = new Set<string>();
      const seenRight = new Set<string>();
      matches.forEach((m, i) => {
        if (!isPlainObj(m)) {
          errors.push(`expectedMatches[${i}] must be an object.`);
          return;
        }
        checkAllowed(m, PAIR_KEYS, `expectedMatches[${i}]`, errors);
        if (typeof m.leftId !== 'string' || !leftIds.has(m.leftId) || typeof m.rightId !== 'string' || !rightIds.has(m.rightId)) {
          errors.push(`expectedMatches[${i}] must reference declared leftItems and rightItems IDs.`);
          return;
        }
        const pairKey = `${m.leftId}::${m.rightId}`;
        if (seenPairs.has(pairKey)) {
          errors.push(`Duplicate expectedMatches pair (${m.leftId} -> ${m.rightId}).`);
        } else {
          seenPairs.add(pairKey);
        }
        if (!allowMany) {
          if (seenLeft.has(m.leftId)) {
            errors.push(`Conflicting one-to-one expectedMatches: leftId "${m.leftId}" appears more than once while allowManyToMany is false.`);
          }
          if (seenRight.has(m.rightId)) {
            errors.push(`Conflicting one-to-one expectedMatches: rightId "${m.rightId}" appears more than once while allowManyToMany is false.`);
          }
          seenLeft.add(m.leftId);
          seenRight.add(m.rightId);
        }
      });
    }
    return;
  }

  // MODE 3: CLOZE TILES
  if (mode === 'cloze-tiles') {
    checkAllowed(obj, CLOZE_KEYS, 'sort-classify(cloze-tiles)', errors);
    if (obj.reusableTokens !== undefined && typeof obj.reusableTokens !== 'boolean') {
      errors.push('cloze-tiles "reusableTokens" must be a strict boolean.');
    }
    const reusable = Boolean(obj.reusableTokens);
    const templatePlaceholders = new Map<string, number>();
    if (typeof obj.template !== 'string' || !obj.template.includes('{{') || obj.template.length > SORT_CLASSIFY_LIMITS.maxTemplateLength) {
      errors.push(`cloze-tiles "template" must be a string (<= ${SORT_CLASSIFY_LIMITS.maxTemplateLength} chars) containing {{blankId}} placeholders.`);
    } else {
      let match: RegExpExecArray | null;
      PLACEHOLDER_RE.lastIndex = 0;
      while ((match = PLACEHOLDER_RE.exec(obj.template)) !== null) {
        const ph = match[1];
        templatePlaceholders.set(ph, (templatePlaceholders.get(ph) ?? 0) + 1);
      }
    }

    const tokenIds = new Set<string>();
    const tokens = obj.tokens;
    if (!Array.isArray(tokens) || tokens.length < 2 || tokens.length > SORT_CLASSIFY_LIMITS.maxTokens) {
      errors.push(`cloze-tiles requires 2..${SORT_CLASSIFY_LIMITS.maxTokens} tokens.`);
    } else {
      tokens.forEach((t, i) => {
        if (!isPlainObj(t)) {
          errors.push(`tokens[${i}] must be an object.`);
          return;
        }
        checkAllowed(t, TOKEN_ITEM_KEYS, `tokens[${i}]`, errors);
        if (!isSafeId(t.id)) {
          errors.push(`tokens[${i}].id must be a safe bounded identifier (^[A-Za-z0-9_-]{1,48}$).`);
        } else if (tokenIds.has(t.id)) {
          errors.push(`Duplicate token id "${t.id}".`);
        } else {
          tokenIds.add(t.id);
        }
        validateLabel(t.label, `tokens[${i}].label`, errors);
      });
    }

    const blanks = obj.blanks;
    const blankIds = new Set<string>();
    const validBlanksForFeasibility: Array<{ id: string; acceptedTokenIds: string[] }> = [];
    if (!Array.isArray(blanks) || blanks.length < SORT_CLASSIFY_LIMITS.minBlanks || blanks.length > SORT_CLASSIFY_LIMITS.maxBlanks) {
      errors.push(`cloze-tiles requires ${SORT_CLASSIFY_LIMITS.minBlanks}..${SORT_CLASSIFY_LIMITS.maxBlanks} blanks.`);
    } else {
      blanks.forEach((b, i) => {
        if (!isPlainObj(b)) {
          errors.push(`blanks[${i}] must be an object.`);
          return;
        }
        checkAllowed(b, BLANK_KEYS, `blanks[${i}]`, errors);
        if (!isSafeId(b.id)) {
          errors.push(`blanks[${i}].id must be a safe bounded identifier (^[A-Za-z0-9_-]{1,48}$).`);
        } else if (blankIds.has(b.id)) {
          errors.push(`Duplicate blank id "${b.id}".`);
        } else {
          blankIds.add(b.id);
          const occ = templatePlaceholders.get(b.id) ?? 0;
          if (occ === 0) {
            errors.push(`Blank "${b.id}" is missing placeholder {{${b.id}}} in template.`);
          } else if (occ > 1) {
            errors.push(`Duplicate placeholder {{${b.id}}} appears ${occ} times in template; each blank must appear exactly once.`);
          }
        }
        if (!Array.isArray(b.acceptedTokenIds) || b.acceptedTokenIds.length === 0) {
          errors.push(`blanks[${i}].acceptedTokenIds must reference at least one declared token ID.`);
        } else {
          const seenTok = new Set<string>();
          for (const tid of b.acceptedTokenIds) {
            if (typeof tid !== 'string' || !tokenIds.has(tid)) {
              errors.push(`blanks[${i}].acceptedTokenIds references undeclared token ID "${String(tid)}".`);
            } else if (seenTok.has(tid)) {
              errors.push(`blanks[${i}].acceptedTokenIds contains duplicate token ID "${tid}".`);
            } else {
              seenTok.add(tid);
            }
          }
          if (isSafeId(b.id) && seenTok.size > 0) {
            validBlanksForFeasibility.push({ id: b.id, acceptedTokenIds: Array.from(seenTok) });
          }
        }
        validateMisconceptionMap(b.misconceptionByToken, tokenIds, `blanks[${i}].misconceptionByToken`, errors);
      });

      // Check for undeclared placeholders in template
      for (const ph of templatePlaceholders.keys()) {
        if (!blankIds.has(ph)) {
          errors.push(`Template contains undeclared placeholder {{${ph}}} not found in blanks[].`);
        }
      }

      // Deterministic bipartite matching feasibility check when tokens are non-reusable
      if (!reusable && validBlanksForFeasibility.length === blanks.length && errors.length === 0) {
        if (!hasValidNonReusableClozeAssignment(validBlanksForFeasibility, tokenIds)) {
          errors.push('cloze-tiles with reusableTokens=false has no feasible complete distinct token assignment across blanks.');
        }
      }
    }
    return;
  }

  // MODE 4: ORDER SEQUENCE
  checkAllowed(obj, ORDER_KEYS, 'sort-classify(order-sequence)', errors);
  const items = obj.items;
  const itemIds = new Set<string>();
  if (!Array.isArray(items) || items.length < 3 || items.length > SORT_CLASSIFY_LIMITS.maxSequenceItems) {
    errors.push(`order-sequence requires 3..${SORT_CLASSIFY_LIMITS.maxSequenceItems} items.`);
  } else {
    items.forEach((it, i) => {
      if (!isPlainObj(it)) {
        errors.push(`items[${i}] must be an object.`);
        return;
      }
      checkAllowed(it, SIDE_ITEM_KEYS, `items[${i}]`, errors);
      if (!isSafeId(it.id)) {
        errors.push(`items[${i}].id must be a safe bounded identifier (^[A-Za-z0-9_-]{1,48}$).`);
      } else if (itemIds.has(it.id)) {
        errors.push(`Duplicate sequence item id "${it.id}".`);
      } else {
        itemIds.add(it.id);
      }
      validateLabel(it.label, `items[${i}].label`, errors);
      validateOptionalVisual(it.visual, `items[${i}].visual`, errors);
    });
  }
  const orders = obj.acceptedOrders;
  if (!Array.isArray(orders) || orders.length === 0 || orders.length > SORT_CLASSIFY_LIMITS.maxAcceptedOrders) {
    errors.push(`order-sequence requires 1..${SORT_CLASSIFY_LIMITS.maxAcceptedOrders} acceptedOrders arrays.`);
  } else {
    const seenOrders = new Set<string>();
    orders.forEach((ord, i) => {
      if (
        !Array.isArray(ord) ||
        ord.length !== itemIds.size ||
        new Set(ord).size !== itemIds.size ||
        ord.some((id) => typeof id !== 'string' || !itemIds.has(id))
      ) {
        errors.push(`acceptedOrders[${i}] must be a complete permutation of all declared item IDs.`);
        return;
      }
      const key = ord.join('\u0000');
      if (seenOrders.has(key)) {
        errors.push(`Duplicate acceptedOrders[${i}] permutation.`);
      } else {
        seenOrders.add(key);
      }
    });
  }
}
