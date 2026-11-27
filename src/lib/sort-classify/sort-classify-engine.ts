/**
 * GAM EDU — Step 5B Pure TypeScript Engine: Cross-Subject Sorting, Classification,
 * Set Membership, Many-to-Many Matching, Cloze Tiles & Sequencing (`sort-classify` v1.0.0)
 *
 * Pure TypeScript, deterministic, zero React/DOM dependencies, zero eval().
 * Supports:
 * - Overlapping set membership (`allowMultipleBinsPerItem: true`)
 * - Explicit empty-set decisions (`explicitEmptyDecision: true`) distinct from unanswered items
 * - One-to-one and many-to-many matching (`allowManyToMany`) with strict cardinality enforcement
 * - Cloze tiles with reusable/non-reusable tokens & deterministic bipartite feasibility checking
 * - Multi-order sequencing with closest-accepted-order diagnostics & deterministic tie-breaking
 * - Approved optional visual assets (`visual: { src, alt }`) and misconception-specific feedback
 */

export const SORT_CLASSIFY_LIMITS = {
  minBins: 2,
  maxBins: 4,
  minItems: 2,
  maxItems: 16,
  minPairs: 2,
  maxPairs: 10,
  maxExpectedMatches: 24,
  minBlanks: 1,
  maxBlanks: 8,
  maxTokens: 16,
  maxSequenceItems: 10,
  maxAcceptedOrders: 8,
  maxUndoHistory: 25,
  maxLabelLength: 140,
  maxDescriptionLength: 240,
  maxTemplateLength: 1500,
  maxExplanationLength: 400,
} as const;

export type SortClassifyMode =
  | 'category-bins'
  | 'pair-matching'
  | 'cloze-tiles'
  | 'order-sequence';

export type SortClassifyLearningMode = 'explore' | 'practice';

export interface SortVisualRef {
  src: string;
  alt: string;
}

export interface SortBinDef {
  id: string;
  label: string;
  description?: string;
  visual?: SortVisualRef;
}

export interface SortItemDef {
  id: string;
  label: string;
  /** Valid bin ID(s). When allowMultipleBinsPerItem is false, placing in ANY validBinId passes. When true, item must be assigned to ALL validBinIds (overlapping set membership!). */
  validBinIds: string[];
  /** Optional misconception feedback keyed by wrong binId */
  misconceptionByBin?: Record<string, string>;
  visual?: SortVisualRef;
}

export interface SortCategoryBinsSpec {
  mode: 'category-bins';
  bins: SortBinDef[];
  items: SortItemDef[];
  /** True for overlapping set membership (e.g. an element belongs to both Set A and Set B) */
  allowMultipleBinsPerItem?: boolean;
  /** When true, an item whose validBinIds is [] requires an explicit "None / Empty Set" learner decision rather than being left unanswered. */
  explicitEmptyDecision?: boolean;
  learningMode?: SortClassifyLearningMode;
}

export interface SortMatchSideItem {
  id: string;
  label: string;
  visual?: SortVisualRef;
}

export interface SortPairMatchingSpec {
  mode: 'pair-matching';
  leftItems: SortMatchSideItem[];
  rightItems: SortMatchSideItem[];
  expectedMatches: Array<{ leftId: string; rightId: string }>;
  allowManyToMany?: boolean;
  learningMode?: SortClassifyLearningMode;
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
  learningMode?: SortClassifyLearningMode;
}

export interface SortOrderSequenceSpec {
  mode: 'order-sequence';
  items: Array<{ id: string; label: string; visual?: SortVisualRef }>;
  /** One or more valid complete orderings (arrays of item IDs) */
  acceptedOrders: string[][];
  learningMode?: SortClassifyLearningMode;
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
  /** Optional index of closest accepted order for order-sequence diagnostics */
  closestOrderIndex?: number;
}

/**
 * Deterministic maximum bipartite matching (augmenting-path DFS) to verify that a
 * non-reusable cloze-tiles activity has at least one complete valid token assignment
 * where every blank receives a distinct accepted token.
 */
export function hasValidNonReusableClozeAssignment(
  blanks: ReadonlyArray<{ id: string; acceptedTokenIds: ReadonlyArray<string> }>,
  declaredTokenIds: ReadonlySet<string>,
): boolean {
  if (blanks.length === 0) return false;
  if (blanks.length > declaredTokenIds.size) return false;

  const tokenToBlank = new Map<string, number>();

  const tryMatch = (blankIdx: number, visitedTokens: Set<string>): boolean => {
    const candidates = blanks[blankIdx].acceptedTokenIds;
    for (const tokId of candidates) {
      if (!declaredTokenIds.has(tokId) || visitedTokens.has(tokId)) continue;
      visitedTokens.add(tokId);
      const prevBlank = tokenToBlank.get(tokId);
      if (prevBlank === undefined || tryMatch(prevBlank, visitedTokens)) {
        tokenToBlank.set(tokId, blankIdx);
        return true;
      }
    }
    return false;
  };

  for (let i = 0; i < blanks.length; i++) {
    if (!tryMatch(i, new Set<string>())) {
      return false;
    }
  }
  return true;
}

export function evaluateCategoryBins(
  spec: SortCategoryBinsSpec,
  /** Map of itemId -> assigned binId(s) */
  assignments: Record<string, string[]>,
  /** Optional set/array of item IDs for which the learner explicitly chose "None / Empty Set" */
  explicitEmptyDecidedIds?: ReadonlySet<string> | ReadonlyArray<string>,
): SortClassifyEvalResult {
  const multi = Boolean(spec.allowMultipleBinsPerItem);
  const requireExplicitEmpty = Boolean(spec.explicitEmptyDecision);
  const decidedEmptySet = new Set<string>(explicitEmptyDecidedIds ?? []);
  const validItemIds = new Set(spec.items.map((it) => it.id));
  const validBinIds = new Set(spec.bins.map((b) => b.id));

  const diagnostics: Record<string, 'correct' | 'incorrect' | 'unassigned'> = {};
  for (const item of spec.items) diagnostics[item.id] = 'unassigned';

  // Reject malformed learner assignments: unknown item IDs
  if (!assignments || typeof assignments !== 'object' || Array.isArray(assignments)) {
    return {
      passed: false,
      correctCount: 0,
      totalCount: spec.items.length,
      feedback: 'Malformed submission: assignments must be an object mapping item IDs to bin IDs.',
      itemDiagnostics: diagnostics,
    };
  }

  for (const rawItemId of Object.keys(assignments)) {
    if (!validItemIds.has(rawItemId)) {
      return {
        passed: false,
        correctCount: 0,
        totalCount: spec.items.length,
        feedback: `Malformed submission: unknown item reference "${rawItemId}".`,
        itemDiagnostics: diagnostics,
      };
    }
    const rawBins = assignments[rawItemId];
    if (!Array.isArray(rawBins)) {
      return {
        passed: false,
        correctCount: 0,
        totalCount: spec.items.length,
        feedback: `Malformed submission: assignment for "${rawItemId}" must be an array of bin IDs.`,
        itemDiagnostics: diagnostics,
      };
    }
    const seen = new Set<string>();
    for (const bId of rawBins) {
      if (typeof bId !== 'string' || !validBinIds.has(bId)) {
        return {
          passed: false,
          correctCount: 0,
          totalCount: spec.items.length,
          feedback: `Malformed submission: unknown bin reference "${String(bId)}" for item "${rawItemId}".`,
          itemDiagnostics: diagnostics,
        };
      }
      if (seen.has(bId)) {
        return {
          passed: false,
          correctCount: 0,
          totalCount: spec.items.length,
          feedback: `Malformed submission: duplicate bin "${bId}" assigned to item "${rawItemId}".`,
          itemDiagnostics: diagnostics,
        };
      }
      seen.add(bId);
    }
    if (!multi && rawBins.length > 1) {
      return {
        passed: false,
        correctCount: 0,
        totalCount: spec.items.length,
        feedback: `Item "${rawItemId}" was placed in ${rawBins.length} bins, but only one bin per item is allowed.`,
        itemDiagnostics: diagnostics,
      };
    }
  }

  let correctCount = 0;
  const hints: string[] = [];

  for (const item of spec.items) {
    const picked = assignments[item.id] ?? [];
    const expected = Array.from(new Set(item.validBinIds));
    const explicitlyMarkedNone = decidedEmptySet.has(item.id);

    if (picked.length === 0) {
      if (expected.length === 0) {
        if (requireExplicitEmpty && !explicitlyMarkedNone) {
          diagnostics[item.id] = 'unassigned';
        } else {
          diagnostics[item.id] = 'correct';
          correctCount++;
        }
      } else {
        diagnostics[item.id] = explicitlyMarkedNone ? 'incorrect' : 'unassigned';
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
    feedback = `${correctCount}/${total} correct (${unassignedCount} item(s) still unassigned${requireExplicitEmpty ? ' — use "None of these" if an item belongs to no set' : ''}).`;
  } else {
    feedback = `${correctCount}/${total} correct — review the highlighted items${multi ? ' (remember an item may belong to more than one set)' : ''}.`;
  }

  return { passed, correctCount, totalCount: total, feedback, itemDiagnostics: diagnostics };
}

export function evaluatePairMatching(
  spec: SortPairMatchingSpec,
  learnerPairs: Array<{ leftId: string; rightId: string }>,
): SortClassifyEvalResult {
  const validLeftIds = new Set(spec.leftItems.map((l) => l.id));
  const validRightIds = new Set(spec.rightItems.map((r) => r.id));
  const keyOf = (p: { leftId: string; rightId: string }) => `${p.leftId}::${p.rightId}`;
  const expectedSet = new Set(spec.expectedMatches.map(keyOf));
  const total = expectedSet.size;

  const diagnostics: Record<string, 'correct' | 'incorrect' | 'unassigned'> = {};
  for (const l of spec.leftItems) diagnostics[l.id] = 'unassigned';

  if (!Array.isArray(learnerPairs)) {
    return {
      passed: false,
      correctCount: 0,
      totalCount: total,
      feedback: 'Malformed submission: pairs must be an array.',
      itemDiagnostics: diagnostics,
    };
  }

  const seenPairKeys = new Set<string>();
  const leftUseCounts = new Map<string, number>();
  const rightUseCounts = new Map<string, number>();

  for (const p of learnerPairs) {
    if (!p || typeof p !== 'object' || typeof p.leftId !== 'string' || typeof p.rightId !== 'string') {
      return {
        passed: false,
        correctCount: 0,
        totalCount: total,
        feedback: 'Malformed submission: every pair must specify string leftId and rightId.',
        itemDiagnostics: diagnostics,
      };
    }
    if (!validLeftIds.has(p.leftId) || !validRightIds.has(p.rightId)) {
      return {
        passed: false,
        correctCount: 0,
        totalCount: total,
        feedback: `Malformed submission: unknown pair reference (${p.leftId} -> ${p.rightId}).`,
        itemDiagnostics: diagnostics,
      };
    }
    const k = keyOf(p);
    if (seenPairKeys.has(k)) {
      return {
        passed: false,
        correctCount: 0,
        totalCount: total,
        feedback: `Malformed submission: duplicate match (${p.leftId} -> ${p.rightId}) is not permitted.`,
        itemDiagnostics: diagnostics,
      };
    }
    seenPairKeys.add(k);
    leftUseCounts.set(p.leftId, (leftUseCounts.get(p.leftId) ?? 0) + 1);
    rightUseCounts.set(p.rightId, (rightUseCounts.get(p.rightId) ?? 0) + 1);
  }

  // Enforce strict one-to-one cardinality when allowManyToMany is false
  if (!spec.allowManyToMany) {
    for (const [lId, cnt] of leftUseCounts.entries()) {
      if (cnt > 1) {
        diagnostics[lId] = 'incorrect';
        return {
          passed: false,
          correctCount: 0,
          totalCount: total,
          feedback: `One-to-one matching violation: left item "${lId}" is matched ${cnt} times.`,
          itemDiagnostics: diagnostics,
        };
      }
    }
    for (const [rId, cnt] of rightUseCounts.entries()) {
      if (cnt > 1) {
        for (const p of learnerPairs) {
          if (p.rightId === rId) diagnostics[p.leftId] = 'incorrect';
        }
        return {
          passed: false,
          correctCount: 0,
          totalCount: total,
          feedback: `One-to-one matching violation: right item "${rId}" is matched ${cnt} times.`,
          itemDiagnostics: diagnostics,
        };
      }
    }
  }

  let correctPairs = 0;
  let extraWrongPairs = 0;

  for (const k of seenPairKeys) {
    if (expectedSet.has(k)) correctPairs++;
    else extraWrongPairs++;
  }

  for (const l of spec.leftItems) {
    const expForLeft = Array.from(
      new Set(spec.expectedMatches.filter((m) => m.leftId === l.id).map((m) => m.rightId)),
    );
    const lrnForLeft = Array.from(
      new Set(learnerPairs.filter((m) => m.leftId === l.id).map((m) => m.rightId)),
    );
    if (lrnForLeft.length === 0) {
      diagnostics[l.id] = expForLeft.length === 0 ? 'correct' : 'unassigned';
    } else {
      const exact =
        lrnForLeft.length === expForLeft.length && expForLeft.every((r) => lrnForLeft.includes(r));
      diagnostics[l.id] = exact ? 'correct' : 'incorrect';
    }
  }

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
  const validBlankIds = new Set(spec.blanks.map((b) => b.id));
  const validTokenIds = new Set(spec.tokens.map((t) => t.id));
  const diagnostics: Record<string, 'correct' | 'incorrect' | 'unassigned'> = {};
  for (const b of spec.blanks) diagnostics[b.id] = 'unassigned';

  if (!filledBlanks || typeof filledBlanks !== 'object' || Array.isArray(filledBlanks)) {
    return {
      passed: false,
      correctCount: 0,
      totalCount: spec.blanks.length,
      feedback: 'Malformed submission: filledBlanks must be an object.',
      itemDiagnostics: diagnostics,
    };
  }

  for (const bId of Object.keys(filledBlanks)) {
    if (!validBlankIds.has(bId)) {
      return {
        passed: false,
        correctCount: 0,
        totalCount: spec.blanks.length,
        feedback: `Malformed submission: unknown blank reference "${bId}".`,
        itemDiagnostics: diagnostics,
      };
    }
    const tok = filledBlanks[bId];
    if (tok !== null && tok !== undefined && (typeof tok !== 'string' || !validTokenIds.has(tok))) {
      diagnostics[bId] = 'incorrect';
      return {
        passed: false,
        correctCount: 0,
        totalCount: spec.blanks.length,
        feedback: `Malformed submission: unknown token reference "${String(tok)}" for blank "${bId}".`,
        itemDiagnostics: diagnostics,
      };
    }
  }

  // Enforce non-reusable token uniqueness if reusableTokens is false
  const tokenBlankUsers = new Map<string, string[]>();
  for (const b of spec.blanks) {
    const tok = filledBlanks[b.id];
    if (tok) {
      const list = tokenBlankUsers.get(tok) ?? [];
      list.push(b.id);
      tokenBlankUsers.set(tok, list);
    }
  }
  if (!spec.reusableTokens) {
    for (const [tokId, users] of tokenBlankUsers.entries()) {
      if (users.length > 1) {
        for (const u of users) diagnostics[u] = 'incorrect';
        return {
          passed: false,
          correctCount: 0,
          totalCount: spec.blanks.length,
          feedback: `Token "${tokId}" was used ${users.length} times, but each tile can be used only once in this activity.`,
          itemDiagnostics: diagnostics,
        };
      }
    }
  }

  let correctCount = 0;
  const hints: string[] = [];

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
  const validItemIds = new Set(spec.items.map((it) => it.id));
  const diagnostics: Record<string, 'correct' | 'incorrect' | 'unassigned'> = {};
  for (const it of spec.items) diagnostics[it.id] = 'unassigned';

  if (!Array.isArray(learnerOrder)) {
    return {
      passed: false,
      correctCount: 0,
      totalCount: total,
      feedback: 'Malformed submission: learnerOrder must be an array of item IDs.',
      itemDiagnostics: diagnostics,
    };
  }

  const seen = new Set<string>();
  for (const id of learnerOrder) {
    if (typeof id !== 'string' || !validItemIds.has(id)) {
      return {
        passed: false,
        correctCount: 0,
        totalCount: total,
        feedback: `Malformed submission: unknown sequence item "${String(id)}".`,
        itemDiagnostics: diagnostics,
      };
    }
    if (seen.has(id)) {
      return {
        passed: false,
        correctCount: 0,
        totalCount: total,
        feedback: `Malformed submission: duplicate sequence item "${id}".`,
        itemDiagnostics: diagnostics,
      };
    }
    seen.add(id);
  }

  if (learnerOrder.length !== total) {
    return {
      passed: false,
      correctCount: 0,
      totalCount: total,
      feedback: `Place all ${total} items in order (currently ${learnerOrder.length}).`,
      itemDiagnostics: diagnostics,
    };
  }

  // Evaluate against EVERY accepted order and select the closest one with deterministic tie-breaking
  let bestIdx = 0;
  let bestScore = -1;
  let bestKey = '';

  spec.acceptedOrders.forEach((ord, idx) => {
    if (ord.length !== total) return;
    let score = 0;
    for (let i = 0; i < total; i++) {
      if (ord[i] === learnerOrder[i]) score++;
    }
    const key = ord.join('\u0000');
    if (score > bestScore || (score === bestScore && (bestKey === '' || key < bestKey))) {
      bestScore = score;
      bestIdx = idx;
      bestKey = key;
    }
  });

  const closest = spec.acceptedOrders[bestIdx] ?? [];
  let inPlace = 0;
  learnerOrder.forEach((id, idx) => {
    if (closest[idx] === id) {
      diagnostics[id] = 'correct';
      inPlace++;
    } else {
      diagnostics[id] = 'incorrect';
    }
  });

  const passed = inPlace === total;
  if (passed) {
    return {
      passed: true,
      correctCount: total,
      totalCount: total,
      feedback: `Verified: all ${total} items are in the exact required sequence!`,
      itemDiagnostics: diagnostics,
      closestOrderIndex: bestIdx,
    };
  }

  return {
    passed: false,
    correctCount: inPlace,
    totalCount: total,
    feedback: `${inPlace}/${total} items are in the right position — reorder the highlighted items.`,
    itemDiagnostics: diagnostics,
    closestOrderIndex: bestIdx,
  };
}
