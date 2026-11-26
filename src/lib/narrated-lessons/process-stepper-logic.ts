/**
 * Pure, testable domain logic for GAM EDU's Reusable Process & Mechanism Engine (Step 4B).
 *
 * - Safe structured state snapshots & previous-stage diffing (no prototype pollution).
 * - Linear & cyclic stage navigation.
 * - Keyboard-friendly sequencing challenge validation.
 * - Strict approved media path allowlist for Mode B & Mode C illustrations.
 */

export interface ProcessStateField {
  id: string;
  label: string;
  value: string;
}

export type StateDiffStatus = 'unchanged' | 'changed' | 'added' | 'removed';

export interface ProcessStateDiffRow {
  id: string;
  label: string;
  previousValue: string | null;
  currentValue: string | null;
  status: StateDiffStatus;
}

export const FORBIDDEN_STATE_IDS = new Set([
  '__proto__',
  'constructor',
  'prototype',
  'tostring',
  'valueof',
  'hasownproperty',
]);

/**
 * Computes an accessible, ordered comparison between the previous stage's state snapshot
 * and the current stage's state snapshot, handling unchanged, changed, added, and removed fields.
 */
export function computeProcessStateDiff(
  prevFields: readonly ProcessStateField[] | undefined,
  currFields: readonly ProcessStateField[] | undefined
): ProcessStateDiffRow[] {
  const prev = prevFields ?? [];
  const curr = currFields ?? [];
  const prevMap = new Map<string, ProcessStateField>();
  const currMap = new Map<string, ProcessStateField>();

  for (const f of prev) prevMap.set(f.id, f);
  for (const f of curr) currMap.set(f.id, f);

  const rows: ProcessStateDiffRow[] = [];
  const seen = new Set<string>();

  // Preserve current stage ordering first
  for (const cf of curr) {
    seen.add(cf.id);
    const pf = prevMap.get(cf.id);
    if (!pf) {
      rows.push({
        id: cf.id,
        label: cf.label,
        previousValue: null,
        currentValue: cf.value,
        status: prev.length > 0 ? 'added' : 'unchanged',
      });
    } else if (pf.value !== cf.value) {
      rows.push({
        id: cf.id,
        label: cf.label,
        previousValue: pf.value,
        currentValue: cf.value,
        status: 'changed',
      });
    } else {
      rows.push({
        id: cf.id,
        label: cf.label,
        previousValue: pf.value,
        currentValue: cf.value,
        status: 'unchanged',
      });
    }
  }

  // Append any fields removed compared to previous stage
  for (const pf of prev) {
    if (!seen.has(pf.id)) {
      rows.push({
        id: pf.id,
        label: pf.label,
        previousValue: pf.value,
        currentValue: null,
        status: 'removed',
      });
    }
  }

  return rows;
}

export function stepNextStage(
  currentIndex: number,
  totalStages: number,
  mode: 'linear' | 'cyclic'
): { nextIndex: number; wrapped: boolean; atEnd: boolean } {
  if (totalStages <= 0) return { nextIndex: 0, wrapped: false, atEnd: true };
  if (currentIndex + 1 < totalStages) {
    return { nextIndex: currentIndex + 1, wrapped: false, atEnd: currentIndex + 1 === totalStages - 1 };
  }
  if (mode === 'cyclic') {
    return { nextIndex: 0, wrapped: true, atEnd: false };
  }
  return { nextIndex: totalStages - 1, wrapped: false, atEnd: true };
}

export function stepPrevStage(
  currentIndex: number,
  totalStages: number,
  mode: 'linear' | 'cyclic'
): { prevIndex: number; wrapped: boolean } {
  if (totalStages <= 0) return { prevIndex: 0, wrapped: false };
  if (currentIndex > 0) {
    return { prevIndex: currentIndex - 1, wrapped: false };
  }
  if (mode === 'cyclic') {
    return { prevIndex: totalStages - 1, wrapped: true };
  }
  return { prevIndex: 0, wrapped: false };
}

export function deterministicPermuteIds(ids: readonly string[]): string[] {
  if (ids.length <= 1) return [...ids];
  const rotated = [...ids.slice(1), ids[0]];
  if (rotated.length >= 3) {
    const tmp = rotated[0];
    rotated[0] = rotated[1];
    rotated[1] = tmp;
  }
  return rotated;
}

export function evaluateSequenceOrder(
  submittedIds: readonly string[],
  expectedIds: readonly string[]
): { correct: boolean; matchedPositions: number; total: number } {
  const total = expectedIds.length;
  if (submittedIds.length !== total) {
    return { correct: false, matchedPositions: 0, total };
  }
  let matched = 0;
  for (let i = 0; i < total; i++) {
    if (submittedIds[i] === expectedIds[i]) matched += 1;
  }
  return { correct: matched === total, matchedPositions: matched, total };
}

const APPROVED_RELATIVE_IMAGE_RE = /^(?:images\/[A-Za-z0-9_.-]+\.(?:webp|png)|\/preview-fixtures\/[A-Za-z0-9_.-]+\.(?:webp|png))$/;
const APPROVED_CDN_IMAGE_RE =
  /^https:\/\/(?:storage\.googleapis\.com\/gamedu-[A-Za-z0-9_-]+\.firebasestorage\.app|firebasestorage\.googleapis\.com\/v0\/b\/gamedu-[A-Za-z0-9_-]+\.firebasestorage\.app)\/[^\s"'<>]+\.(?:webp|png)(?:\?[^\s"'<>]*)?$/;

/**
 * Validates that a stage or shared illustration path points ONLY to an approved
 * GAM EDU WebP/PNG media location (blocks javascript:, data:, external untrusted URLs, and HTML).
 */
export function isApprovedProcessAssetPath(src: string): boolean {
  if (typeof src !== 'string') return false;
  const trimmed = src.trim();
  if (trimmed.length === 0 || trimmed.length > 512) return false;
  if (trimmed.includes('..')) return false;
  return APPROVED_RELATIVE_IMAGE_RE.test(trimmed) || APPROVED_CDN_IMAGE_RE.test(trimmed);
}
