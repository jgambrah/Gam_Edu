import type {
  ThinkTankParadoxItem,
  ThinkTankDetectiveCaseItem,
  ThinkTankRiddleItem,
  ThinkTankDebateItem,
  ThinkTankTargetGroup,
} from '@/lib/think-tank-data';
import {
  toPublicParadox,
  toPublicParadoxes,
  type PublicParadox,
} from '@/lib/think-tank-public-paradox';
import {
  THINK_TANK_PUBLIC_V2_VERSION,
  toPublicDetectiveCase,
  toPublicDetectiveCases,
  toPublicRiddle,
  toPublicRiddles,
  toPublicDebate,
  toPublicDebates,
  type PublicDetectiveCase,
  type PublicRiddle,
  type PublicDebate,
} from '@/lib/think-tank-public-challenges';
import {
  compareCurriculumVersions,
  type ShardedCurriculumManifest,
  type ShardDocumentData,
} from '@/lib/think-tank-sync-utils';

export {
  THINK_TANK_PUBLIC_V2_VERSION,
  toPublicParadox,
  toPublicParadoxes,
  toPublicDetectiveCase,
  toPublicDetectiveCases,
  toPublicRiddle,
  toPublicRiddles,
  toPublicDebate,
  toPublicDebates,
};

export type {
  ThinkTankTargetGroup,
  PublicParadox,
  PublicDetectiveCase,
  PublicRiddle,
  PublicDebate,
  ThinkTankParadoxItem,
  ThinkTankDetectiveCaseItem,
  ThinkTankRiddleItem,
  ThinkTankDebateItem,
};

export const EXPECTED_V2_SHARD_COUNT = 8;

export const EXPECTED_V2_COUNTS = {
  paradoxes: 747,
  detectiveCases: 752,
  riddles: 1052,
  debates: 361,
  total: 2912,
} as const;

export const FORBIDDEN_PUBLIC_CHALLENGE_FIELDS = [
  'answer',
  'correctAnswer',
  'explanation',
  'acceptedKeywords',
  'evaluation',
  'rubric',
] as const;

export interface VerifiedPublicV2CurriculumPayload {
  isVerifiedRemote: boolean;
  reason: string;
  version: string;
  paradoxes: PublicParadox[];
  detectiveCases: PublicDetectiveCase[];
  riddles: PublicRiddle[];
  debates: PublicDebate[];
}

function isNonEmptyString(val: unknown): val is string {
  return typeof val === 'string' && val.trim().length > 0;
}

function hasForbiddenPrivateField(item: Record<string, unknown>): string | null {
  for (const field of FORBIDDEN_PUBLIC_CHALLENGE_FIELDS) {
    if (field in item && item[field] !== undefined) {
      return field;
    }
  }
  return null;
}

function validatePublicParadoxItem(
  raw: unknown
): { valid: true; item: PublicParadox } | { valid: false; reason: string } {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, reason: 'Paradox item is not an object' };
  }
  const obj = raw as Record<string, unknown>;
  const leaked = hasForbiddenPrivateField(obj);
  if (leaked) {
    return {
      valid: false,
      reason: `Paradox "${String(obj.id ?? '')}" contains forbidden private field "${leaked}"`,
    };
  }
  if (
    !isNonEmptyString(obj.id) ||
    !isNonEmptyString(obj.question) ||
    !isNonEmptyString(obj.targetGroup) ||
    !isNonEmptyString(obj.difficulty)
  ) {
    return {
      valid: false,
      reason: `Paradox "${String(obj.id ?? '')}" is missing required public fields`,
    };
  }
  const item: PublicParadox = {
    id: obj.id.trim(),
    question: obj.question.trim(),
    targetGroup: obj.targetGroup.trim() as ThinkTankTargetGroup,
    difficulty: obj.difficulty.trim(),
    isCentral: Boolean(obj.isCentral ?? true),
  };
  if (isNonEmptyString(obj.title)) {
    item.title = obj.title.trim();
  }
  return { valid: true, item };
}

function validatePublicDetectiveCaseItem(
  raw: unknown
): { valid: true; item: PublicDetectiveCase } | { valid: false; reason: string } {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, reason: 'Detective case item is not an object' };
  }
  const obj = raw as Record<string, unknown>;
  const leaked = hasForbiddenPrivateField(obj);
  if (leaked) {
    return {
      valid: false,
      reason: `Detective case "${String(obj.id ?? '')}" contains forbidden private field "${leaked}"`,
    };
  }
  if (
    !isNonEmptyString(obj.id) ||
    !isNonEmptyString(obj.targetGroup) ||
    !isNonEmptyString(obj.caseType) ||
    !isNonEmptyString(obj.scenario) ||
    !isNonEmptyString(obj.question) ||
    !Array.isArray(obj.options) ||
    obj.options.length < 2 ||
    obj.options.some((opt) => !isNonEmptyString(opt))
  ) {
    return {
      valid: false,
      reason: `Detective case "${String(obj.id ?? '')}" is missing required public fields`,
    };
  }
  return {
    valid: true,
    item: {
      id: obj.id.trim(),
      targetGroup: obj.targetGroup.trim() as ThinkTankTargetGroup,
      caseType: obj.caseType.trim(),
      scenario: obj.scenario.trim(),
      question: obj.question.trim(),
      options: (obj.options as string[]).map((o) => o.trim()),
      isCentral: Boolean(obj.isCentral ?? true),
    },
  };
}

function validatePublicRiddleItem(
  raw: unknown
): { valid: true; item: PublicRiddle } | { valid: false; reason: string } {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, reason: 'Riddle item is not an object' };
  }
  const obj = raw as Record<string, unknown>;
  const leaked = hasForbiddenPrivateField(obj);
  if (leaked) {
    return {
      valid: false,
      reason: `Riddle "${String(obj.id ?? '')}" contains forbidden private field "${leaked}"`,
    };
  }
  if (
    !isNonEmptyString(obj.id) ||
    !isNonEmptyString(obj.targetGroup) ||
    !isNonEmptyString(obj.category) ||
    !isNonEmptyString(obj.difficulty) ||
    !isNonEmptyString(obj.question) ||
    !isNonEmptyString(obj.hint1) ||
    !isNonEmptyString(obj.hint2)
  ) {
    return {
      valid: false,
      reason: `Riddle "${String(obj.id ?? '')}" is missing required public fields`,
    };
  }
  return {
    valid: true,
    item: {
      id: obj.id.trim(),
      targetGroup: obj.targetGroup.trim() as ThinkTankTargetGroup,
      category: obj.category.trim() as PublicRiddle['category'],
      difficulty: obj.difficulty.trim() as PublicRiddle['difficulty'],
      question: obj.question.trim(),
      hint1: obj.hint1.trim(),
      hint2: obj.hint2.trim(),
      isCentral: Boolean(obj.isCentral ?? true),
    },
  };
}

function validatePublicDebateItem(
  raw: unknown
): { valid: true; item: PublicDebate } | { valid: false; reason: string } {
  if (!raw || typeof raw !== 'object') {
    return { valid: false, reason: 'Debate item is not an object' };
  }
  const obj = raw as Record<string, unknown>;
  const leaked = hasForbiddenPrivateField(obj);
  if (leaked) {
    return {
      valid: false,
      reason: `Debate "${String(obj.id ?? '')}" contains forbidden private field "${leaked}"`,
    };
  }
  if (
    !isNonEmptyString(obj.id) ||
    !isNonEmptyString(obj.targetGroup) ||
    !isNonEmptyString(obj.topic) ||
    !isNonEmptyString(obj.context)
  ) {
    return {
      valid: false,
      reason: `Debate "${String(obj.id ?? '')}" is missing required public fields`,
    };
  }
  return {
    valid: true,
    item: {
      id: obj.id.trim(),
      targetGroup: obj.targetGroup.trim() as ThinkTankTargetGroup,
      topic: obj.topic.trim(),
      context: obj.context.trim(),
      isCentral: Boolean(obj.isCentral ?? true),
    },
  };
}

function failClosedResult(
  reason: string,
  version: string = THINK_TANK_PUBLIC_V2_VERSION
): VerifiedPublicV2CurriculumPayload {
  return {
    isVerifiedRemote: false,
    reason,
    version,
    paradoxes: [],
    detectiveCases: [],
    riddles: [],
    debates: [],
  };
}

/**
 * Strictly validates the `think_tank_v2` manifest and all 8 public shards.
 * Fails closed with empty arrays if any shard is missing, malformed, contains
 * duplicate IDs, leaks any private grading field, or does not match the canonical
 * 2,912 challenge distribution (747 Paradoxes, 752 Detective Cases, 1,052 Riddles, 361 Debates).
 */
export function verifyAndAssemblePublicV2Curriculum(
  manifest: ShardedCurriculumManifest | null | undefined,
  shards: Array<ShardDocumentData | null | undefined>,
  minVersion: string = THINK_TANK_PUBLIC_V2_VERSION
): VerifiedPublicV2CurriculumPayload {
  if (
    !manifest ||
    manifest.sharded !== true ||
    !Array.isArray(manifest.shardIds) ||
    manifest.shardIds.length !== EXPECTED_V2_SHARD_COUNT
  ) {
    return failClosedResult(
      `Manifest missing or does not declare ${EXPECTED_V2_SHARD_COUNT} shards`,
      minVersion
    );
  }

  if (compareCurriculumVersions(manifest.version, minVersion) < 0) {
    return failClosedResult(
      `Remote v2 manifest version (${manifest.version || 'none'}) is older than required (${minVersion})`,
      minVersion
    );
  }

  const declaredShardSet = new Set<string>();
  for (const shardId of manifest.shardIds) {
    if (!isNonEmptyString(shardId) || !shardId.startsWith('think_tank_v2_')) {
      return failClosedResult(
        `Invalid v2 shard identifier "${String(shardId)}"`,
        minVersion
      );
    }
    if (declaredShardSet.has(shardId)) {
      return failClosedResult(
        `Duplicate shard identifier "${shardId}" in manifest`,
        minVersion
      );
    }
    declaredShardSet.add(shardId);
  }

  const shardById = new Map<string, ShardDocumentData>();
  for (const s of shards) {
    if (s && isNonEmptyString(s.id) && Array.isArray(s.items)) {
      shardById.set(s.id, s);
    }
  }

  const paradoxes: PublicParadox[] = [];
  const detectiveCases: PublicDetectiveCase[] = [];
  const riddles: PublicRiddle[] = [];
  const debates: PublicDebate[] = [];
  const seenChallengeIds = new Set<string>();

  for (const expectedId of manifest.shardIds) {
    const shard = shardById.get(expectedId);
    if (!shard || !Array.isArray(shard.items)) {
      return failClosedResult(
        `Missing or corrupted v2 shard "${expectedId}"`,
        minVersion
      );
    }
    if (
      typeof shard.count !== 'number' ||
      shard.count <= 0 ||
      shard.items.length !== shard.count
    ) {
      return failClosedResult(
        `Shard "${expectedId}" item count mismatch (${shard.items.length} vs ${String(shard.count)})`,
        minVersion
      );
    }

    for (const rawItem of shard.items) {
      if (shard.kind === 'paradoxes') {
        const res = validatePublicParadoxItem(rawItem);
        if (!res.valid) return failClosedResult(res.reason, minVersion);
        if (seenChallengeIds.has(res.item.id)) {
          return failClosedResult(
            `Duplicate challenge ID "${res.item.id}" in shard "${expectedId}"`,
            minVersion
          );
        }
        seenChallengeIds.add(res.item.id);
        paradoxes.push(res.item);
      } else if (shard.kind === 'detectiveCases') {
        const res = validatePublicDetectiveCaseItem(rawItem);
        if (!res.valid) return failClosedResult(res.reason, minVersion);
        if (seenChallengeIds.has(res.item.id)) {
          return failClosedResult(
            `Duplicate challenge ID "${res.item.id}" in shard "${expectedId}"`,
            minVersion
          );
        }
        seenChallengeIds.add(res.item.id);
        detectiveCases.push(res.item);
      } else if (shard.kind === 'riddles') {
        const res = validatePublicRiddleItem(rawItem);
        if (!res.valid) return failClosedResult(res.reason, minVersion);
        if (seenChallengeIds.has(res.item.id)) {
          return failClosedResult(
            `Duplicate challenge ID "${res.item.id}" in shard "${expectedId}"`,
            minVersion
          );
        }
        seenChallengeIds.add(res.item.id);
        riddles.push(res.item);
      } else if (shard.kind === 'debates') {
        const res = validatePublicDebateItem(rawItem);
        if (!res.valid) return failClosedResult(res.reason, minVersion);
        if (seenChallengeIds.has(res.item.id)) {
          return failClosedResult(
            `Duplicate challenge ID "${res.item.id}" in shard "${expectedId}"`,
            minVersion
          );
        }
        seenChallengeIds.add(res.item.id);
        debates.push(res.item);
      } else {
        return failClosedResult(
          `Shard "${expectedId}" has unsupported kind "${String(shard.kind)}"`,
          minVersion
        );
      }
    }
  }

  const totalLoaded =
    paradoxes.length +
    detectiveCases.length +
    riddles.length +
    debates.length;

  if (
    paradoxes.length !== EXPECTED_V2_COUNTS.paradoxes ||
    manifest.paradoxCount !== EXPECTED_V2_COUNTS.paradoxes
  ) {
    return failClosedResult(
      `Paradox count mismatch (${paradoxes.length}, manifest=${String(manifest.paradoxCount)}, expected=${EXPECTED_V2_COUNTS.paradoxes})`,
      minVersion
    );
  }

  if (
    detectiveCases.length !== EXPECTED_V2_COUNTS.detectiveCases ||
    manifest.caseCount !== EXPECTED_V2_COUNTS.detectiveCases
  ) {
    return failClosedResult(
      `Detective case count mismatch (${detectiveCases.length}, manifest=${String(manifest.caseCount)}, expected=${EXPECTED_V2_COUNTS.detectiveCases})`,
      minVersion
    );
  }

  if (
    riddles.length !== EXPECTED_V2_COUNTS.riddles ||
    manifest.riddleCount !== EXPECTED_V2_COUNTS.riddles
  ) {
    return failClosedResult(
      `Riddle count mismatch (${riddles.length}, manifest=${String(manifest.riddleCount)}, expected=${EXPECTED_V2_COUNTS.riddles})`,
      minVersion
    );
  }

  if (
    debates.length !== EXPECTED_V2_COUNTS.debates ||
    manifest.debateCount !== EXPECTED_V2_COUNTS.debates
  ) {
    return failClosedResult(
      `Debate count mismatch (${debates.length}, manifest=${String(manifest.debateCount)}, expected=${EXPECTED_V2_COUNTS.debates})`,
      minVersion
    );
  }

  if (
    totalLoaded !== EXPECTED_V2_COUNTS.total ||
    manifest.totalCount !== EXPECTED_V2_COUNTS.total
  ) {
    return failClosedResult(
      `Total challenge count mismatch (${totalLoaded}, manifest=${String(manifest.totalCount)}, expected=${EXPECTED_V2_COUNTS.total})`,
      minVersion
    );
  }

  return {
    isVerifiedRemote: true,
    reason: `Verified public v2 curriculum (${manifest.version}) across ${manifest.shardIds.length} shards (${totalLoaded} items)`,
    version: manifest.version || minVersion,
    paradoxes,
    detectiveCases,
    riddles,
    debates,
  };
}

