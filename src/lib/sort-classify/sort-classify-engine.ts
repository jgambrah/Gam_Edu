/**
 * GAM EDU — Step 5B Pure TypeScript Engine: Cross-Subject Sorting, Classification,
 * Set Membership, Many-to-Many Matching, Cloze Tiles & Sequencing (`sort-classify` v1.0.0)
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies, zero eval().
 * Supports:
 * - Overlapping set membership (`allowMultipleBinsPerItem: true`)
 * - Multiple valid answers (`validBinIds[]`, `acceptedTokenIds[]`, `acceptedOrders[][]`)
 * - Many-to-many matching (`allowManyToMany: true`)
 * - Reusable tokens in cloze-tiles (`reusableTokens: true`)
 * - Misconception-specific diagnostic feedback per item
 */

export const SORT_CLASSIFY_LIMITS = {
  minBins: 2,
  maxBins: 4,
  minItems: 2,
  maxItems: 16,
  minPairs: 2,
  maxPairs: 10,
  minBlanks: 1,
  maxBlanks: 8,
  maxTokens: 16,
  maxSequenceItems: 10,
  maxUndoHistory: 25,
} as const;

export type SortClassifyMode =
  | 'category-bins'
  | 'pair-matching'
  | 'cloze-tiles'
  | 'order-sequence';

export interface SortBinDef {
  id: string;
  label: string;
  description?: string;
}

export interface SortItemDef {
  id: string;
  label: string;
  /** Valid bin ID(s). When allowMultipleBinsPerItem is false, placing in ANY validBinId passes. When true, item must be assigned to ALL validBinIds (overlapping set membership!). */
  validBinIds: string[];
  /** Optional misconception feedback keyed by wrong binId */
  misconceptionByBin?: Record<string, string>;
}

export interface SortCategoryBinsSpec {
  mode: 'category-bins';
  bins: SortBinDef[];
  items: SortItemDef[];
  /** True for overlapping set membership (e.g. an element belongs to both Set A and Set B) */
  allowMultipleBinsPerItem?: boolean;
}

export interface SortMatchSideItem {
  id: string;
  label: string;
}

export interface SortPairMatchingSpec {
  mode: 'pair-matching';
  leftItems: SortMatchSideItem[];
  rightItems: SortMatchSideItem[];
  expectedMatches: Array<{ leftId: string; rightId: string }>;
  allowManyToMany?: boolean;
}

export interface SortClozeBlankDef {
  id: string;
  acceptedTokenIds: string[];
  misconceptionByToken?: Record<string, string>;
}

export interface SortClozeTokenDef {
  id: string;
  label: string;
}

export interface SortClozeTilesSpec {
  mode: 'cloze-tiles';
  /** Text with `{{blankId}}` placeholders */
  template: string;
  blanks: SortClozeBlankDef[];
  tokens: SortClozeTokenDef[];
  reusableTokens?: boolean;
}

export interface SortOrderSequenceSpec {
  mode: 'order-sequence';
  items: Array<{ id: string; label: string }>;
  /** One or more valid complete orderings (arrays of item IDs) */
  acceptedOrders: string[][];
}

export type SortClassifySpec =
  | SortCategoryBinsSpec
  | SortPairMatchingSpec
  | SortClozeTilesSpec
  | SortOrderSequenceSpec;

export interface SortClassifyEvalResult {
  passed: boolean;
  correctCount: number;
  totalCount: number;
  feedback: string;
  itemDiagnostics: Record<string, 'correct' | 'incorrect' | 'unassigned'>;
}

export function evaluateCategoryBins(
  spec: SortCategoryBinsSpec,
  /** Map of itemId -> assigned binId(s) */
  assignments: Record<string, string[]>,
): SortClassifyEvalResult {
  const multi = Boolean(spec.allowMultipleBinsPerItem);
  const diagnostics: Record<string, 'correct' | 'incorrect' | 'unassigned'> = {};
  let correctCount = 0;
  const hints: string[] = [];

  for (const item of spec.items) {
    const picked = Array.from(new Set(assignments[item.id] ?? []));
    const expected = Array.from(new Set(item.validBinIds));

    if (picked.length === 0) {
      if (expected.length === 0) {
        diagnostics[item.id] = 'correct';
        correctCount++;
      } else {
        diagnostics[item.id] = 'unassigned';
      }
      continue;
    }

    let ok = false;
    if (multi) {
      // Overlapping set membership: exact set equality required
      ok = picked.length === expected.length && expected.every((b) => picked.includes(b));
    } else {
      // Single-bin classification with optional multiple valid answers
      ok = picked.length === 1 && expected.includes(picked[0]);
    }

    if (ok) {
      diagnostics[item.id] = 'correct';
      correctCount++;
    } else {
      diagnostics[item.id] = 'incorrect';
      for (const wrongBin of picked) {
        if (!expected.includes(wrongBin) && item.misconceptionByBin?.[wrongBin]) {
          hints.push(`${item.label}: ${item.misconceptionByBin[wrongBin]}`);
        }
      }
    }
  }

  const total = spec.items.length;
  const passed = correctCount === total;
  const unassignedCount = Object.values(diagnostics).filter((d) => d === 'unassigned').length;

  let feedback: string;
  if (passed) {
    feedback = `Verified: all ${total} items are classified accurately!`;
  } else if (hints.length > 0) {
    feedback = `${correctCount}/${total} correct. ${hints[0]}`;
  } else if (unassignedCount > 0) {
    feedback = `${correctCount}/${total} correct (${unassignedCount} item(s) still unassigned).`;
  } else {
    feedback = `${correctCount}/${total} correct — review the highlighted items${multi ? ' (remember an item may belong to more than one set)' : ''}.`;
  }

  return { passed, correctCount, totalCount: total, feedback, itemDiagnostics: diagnostics };
}

export function evaluatePairMatching(
  spec: SortPairMatchingSpec,
  learnerPairs: Array<{ leftId: string; rightId: string }>,
): SortClassifyEvalResult {
  const keyOf = (p: { leftId: string; rightId: string }) => `${p.leftId}::${p.rightId}`;
  const expectedSet = new Set(spec.expectedMatches.map(keyOf));
  const learnerUnique = Array.from(new Set(learnerPairs.map(keyOf)));
  const learnerSet = new Set(learnerUnique);

  const diagnostics: Record<string, 'correct' | 'incorrect' | 'unassigned'> = {};
  let correctPairs = 0;
  let extraWrongPairs = 0;

  for (const k of learnerSet) {
    if (expectedSet.has(k)) correctPairs++;
    else extraWrongPairs++;
  }

  for (const l of spec.leftItems) {
    const expForLeft = spec.expectedMatches.filter((m) => m.leftId === l.id).map((m) => m.rightId);
    const lrnForLeft = learnerPairs.filter((m) => m.leftId === l.id).map((m) => m.rightId);
    if (lrnForLeft.length === 0) {
      diagnostics[l.id] = expForLeft.length === 0 ? 'correct' : 'unassigned';
    } else {
      const exact =
        lrnForLeft.length === expForLeft.length && expForLeft.every((r) => lrnForLeft.includes(r));
      diagnostics[l.id] = exact ? 'correct' : 'incorrect';
    }
  }

  const total = expectedSet.size;
  const passed = correctPairs === total && extraWrongPairs === 0;
  const feedback = passed
    ? `Verified: all ${total} required matches are exact!`
    : extraWrongPairs > 0
      ? `${correctPairs}/${total} valid matches found, with ${extraWrongPairs} incorrect pair(s). Review highlighted links.`
      : `${correctPairs}/${total} matches complete — link the remaining pairs.`;

  return { passed, correctCount: correctPairs, totalCount: total, feedback, itemDiagnostics: diagnostics };
}

export function evaluateClozeTiles(
  spec: SortClozeTilesSpec,
  /** Map of blankId -> chosen tokenId */
  filledBlanks: Record<string, string | null>,
): SortClassifyEvalResult {
  const diagnostics: Record<string, 'correct' | 'incorrect' | 'unassigned'> = {};
  let correctCount = 0;
  const hints: string[] = [];

  // Enforce non-reusable token uniqueness if reusableTokens is false
  const usedCounts = new Map<string, number>();
  for (const b of spec.blanks) {
    const tok = filledBlanks[b.id];
    if (tok) usedCounts.set(tok, (usedCounts.get(tok) ?? 0) + 1);
  }
  if (!spec.reusableTokens) {
    for (const [tokId, cnt] of usedCounts.entries()) {
      if (cnt > 1) {
        return {
          passed: false,
          correctCount: 0,
          totalCount: spec.blanks.length,
          feedback: `Token "${tokId}" was used ${cnt} times, but each tile can be used only once in this activity.`,
          itemDiagnostics: diagnostics,
        };
      }
    }
  }

  for (const blank of spec.blanks) {
    const tok = filledBlanks[blank.id];
    if (!tok) {
      diagnostics[blank.id] = 'unassigned';
      continue;
    }
    if (blank.acceptedTokenIds.includes(tok)) {
      diagnostics[blank.id] = 'correct';
      correctCount++;
    } else {
      diagnostics[blank.id] = 'incorrect';
      if (blank.misconceptionByToken?.[tok]) {
        hints.push(blank.misconceptionByToken[tok]);
      }
    }
  }

  const total = spec.blanks.length;
  const passed = correctCount === total;
  const feedback = passed
    ? `Verified: all ${total} blanks are completed accurately!`
    : hints.length > 0
      ? `${correctCount}/${total} blanks correct. ${hints[0]}`
      : `${correctCount}/${total} blanks correct — check the remaining gap(s).`;

  return { passed, correctCount, totalCount: total, feedback, itemDiagnostics: diagnostics };
}

export function evaluateOrderSequence(
  spec: SortOrderSequenceSpec,
  learnerOrder: string[],
): SortClassifyEvalResult {
  const total = spec.items.length;
  const diagnostics: Record<string, 'correct' | 'incorrect' | 'unassigned'> = {};

  if (learnerOrder.length !== total) {
    return {
      passed: false,
      correctCount: 0,
      totalCount: total,
      feedback: `Place all ${total} items in order (currently ${learnerOrder.length}).`,
      itemDiagnostics: diagnostics,
    };
  }

  const matchedOrder = spec.acceptedOrders.find(
    (ord) => ord.length === total && ord.every((id, idx) => learnerOrder[idx] === id),
  );

  if (matchedOrder) {
    for (const id of learnerOrder) diagnostics[id] = 'correct';
    return {
      passed: true,
      correctCount: total,
      totalCount: total,
      feedback: `Verified: all ${total} items are in the exact required sequence!`,
      itemDiagnostics: diagnostics,
    };
  }

  // Score against closest accepted order for helpful positional feedback
  const primary = spec.acceptedOrders[0] ?? [];
  let inPlace = 0;
  learnerOrder.forEach((id, idx) => {
    if (primary[idx] === id) {
      diagnostics[id] = 'correct';
      inPlace++;
    } else {
      diagnostics[id] = 'incorrect';
    }
  });

  return {
    passed: false,
    correctCount: inPlace,
    totalCount: total,
    feedback: `${inPlace}/${total} items are in the right position — reorder the highlighted items.`,
    itemDiagnostics: diagnostics,
  };
}
