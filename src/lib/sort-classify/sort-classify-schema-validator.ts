/**
 * GAM EDU — Step 5B Strict Discriminated Schema & Referential Integrity Validator
 * for `engine: 'sort-classify'` (`1.0.0`).
 *
 * Pure TypeScript, zero React/DOM dependencies.
 */

import { SORT_CLASSIFY_LIMITS } from './sort-classify-engine';

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
  'prediction',
  'successExplanation',
] as const;

const BINS_KEYS = new Set([...SHARED_SORT_KEYS, 'bins', 'items', 'allowMultipleBinsPerItem']);
const MATCH_KEYS = new Set([...SHARED_SORT_KEYS, 'leftItems', 'rightItems', 'expectedMatches', 'allowManyToMany']);
const CLOZE_KEYS = new Set([...SHARED_SORT_KEYS, 'template', 'blanks', 'tokens', 'reusableTokens']);
const ORDER_KEYS = new Set([...SHARED_SORT_KEYS, 'items', 'acceptedOrders']);

const BIN_ITEM_KEYS = new Set(['id', 'label', 'description']);
const SORT_ITEM_KEYS = new Set(['id', 'label', 'validBinIds', 'misconceptionByBin']);
const SIDE_ITEM_KEYS = new Set(['id', 'label']);
const PAIR_KEYS = new Set(['leftId', 'rightId']);
const BLANK_KEYS = new Set(['id', 'acceptedTokenIds', 'misconceptionByToken']);
const VALID_LEVELS = new Set(['early-years', 'primary', 'lower-secondary', 'igcse', 'as-a-level']);

function isPlainObj(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === 'object' && !Array.isArray(v);
}

function checkAllowed(rec: Record<string, unknown>, allowed: ReadonlySet<string>, ctx: string, errors: string[]) {
  for (const k of Object.keys(rec)) {
    if (!allowed.has(k)) errors.push(`Unknown field "${k}" in ${ctx}.`);
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

  // MODE 1: CATEGORY BINS
  if (mode === 'category-bins') {
    checkAllowed(obj, BINS_KEYS, 'sort-classify(category-bins)', errors);
    if (obj.allowMultipleBinsPerItem !== undefined && typeof obj.allowMultipleBinsPerItem !== 'boolean') {
      errors.push('category-bins "allowMultipleBinsPerItem" must be a strict boolean.');
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
        if (typeof b.id !== 'string' || !b.id.trim() || typeof b.label !== 'string' || !b.label.trim()) {
          errors.push(`bins[${i}] requires non-empty string id and label.`);
        } else if (binIds.has(b.id)) {
          errors.push(`Duplicate bin id "${b.id}".`);
        } else {
          binIds.add(b.id);
        }
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
        if (typeof it.id !== 'string' || !it.id.trim() || typeof it.label !== 'string' || !it.label.trim()) {
          errors.push(`items[${i}] requires non-empty string id and label.`);
        } else if (itemIds.has(it.id)) {
          errors.push(`Duplicate item id "${it.id}".`);
        } else {
          itemIds.add(it.id);
        }
        if (
          !Array.isArray(it.validBinIds) ||
          it.validBinIds.some((bid) => typeof bid !== 'string' || !binIds.has(bid))
        ) {
          errors.push(`items[${i}].validBinIds must reference declared bin IDs.`);
        }
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
          if (typeof it.id !== 'string' || !it.id.trim() || typeof it.label !== 'string' || !it.label.trim()) {
            errors.push(`${field}[${i}] requires non-empty string id and label.`);
          } else if (setRef.has(it.id)) {
            errors.push(`Duplicate id "${it.id}" in ${field}.`);
          } else {
            setRef.add(it.id);
          }
        });
      }
    }
    const matches = obj.expectedMatches;
    if (!Array.isArray(matches) || matches.length < 1) {
      errors.push('pair-matching requires at least 1 expectedMatches entry.');
    } else {
      matches.forEach((m, i) => {
        if (!isPlainObj(m)) {
          errors.push(`expectedMatches[${i}] must be an object.`);
          return;
        }
        checkAllowed(m, PAIR_KEYS, `expectedMatches[${i}]`, errors);
        if (typeof m.leftId !== 'string' || !leftIds.has(m.leftId) || typeof m.rightId !== 'string' || !rightIds.has(m.rightId)) {
          errors.push(`expectedMatches[${i}] must reference declared leftItems and rightItems IDs.`);
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
    if (typeof obj.template !== 'string' || !obj.template.includes('{{')) {
      errors.push('cloze-tiles "template" must be a string containing {{blankId}} placeholders.');
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
        checkAllowed(t, SIDE_ITEM_KEYS, `tokens[${i}]`, errors);
        if (typeof t.id !== 'string' || !t.id.trim() || typeof t.label !== 'string' || !t.label.trim()) {
          errors.push(`tokens[${i}] requires non-empty string id and label.`);
        } else if (tokenIds.has(t.id)) {
          errors.push(`Duplicate token id "${t.id}".`);
        } else {
          tokenIds.add(t.id);
        }
      });
    }
    const blanks = obj.blanks;
    const blankIds = new Set<string>();
    if (!Array.isArray(blanks) || blanks.length < SORT_CLASSIFY_LIMITS.minBlanks || blanks.length > SORT_CLASSIFY_LIMITS.maxBlanks) {
      errors.push(`cloze-tiles requires ${SORT_CLASSIFY_LIMITS.minBlanks}..${SORT_CLASSIFY_LIMITS.maxBlanks} blanks.`);
    } else {
      blanks.forEach((b, i) => {
        if (!isPlainObj(b)) {
          errors.push(`blanks[${i}] must be an object.`);
          return;
        }
        checkAllowed(b, BLANK_KEYS, `blanks[${i}]`, errors);
        if (typeof b.id !== 'string' || !b.id.trim()) {
          errors.push(`blanks[${i}].id must be a non-empty string.`);
        } else if (blankIds.has(b.id)) {
          errors.push(`Duplicate blank id "${b.id}".`);
        } else {
          blankIds.add(b.id);
          if (typeof obj.template === 'string' && !obj.template.includes(`{{${b.id}}}`)) {
            errors.push(`Blank "${b.id}" is missing placeholder {{${b.id}}} in template.`);
          }
        }
        if (
          !Array.isArray(b.acceptedTokenIds) ||
          b.acceptedTokenIds.length === 0 ||
          b.acceptedTokenIds.some((tid) => typeof tid !== 'string' || !tokenIds.has(tid))
        ) {
          errors.push(`blanks[${i}].acceptedTokenIds must reference at least one declared token ID.`);
        }
      });
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
      if (typeof it.id !== 'string' || !it.id.trim() || typeof it.label !== 'string' || !it.label.trim()) {
        errors.push(`items[${i}] requires non-empty string id and label.`);
      } else if (itemIds.has(it.id)) {
        errors.push(`Duplicate sequence item id "${it.id}".`);
      } else {
        itemIds.add(it.id);
      }
    });
  }
  const orders = obj.acceptedOrders;
  if (!Array.isArray(orders) || orders.length === 0) {
    errors.push('order-sequence requires at least one acceptedOrders array.');
  } else {
    orders.forEach((ord, i) => {
      if (
        !Array.isArray(ord) ||
        ord.length !== itemIds.size ||
        new Set(ord).size !== itemIds.size ||
        ord.some((id) => typeof id !== 'string' || !itemIds.has(id))
      ) {
        errors.push(`acceptedOrders[${i}] must be a complete permutation of all declared item IDs.`);
      }
    });
  }
}
