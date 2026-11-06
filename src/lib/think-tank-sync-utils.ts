import type {
  ThinkTankParadoxItem,
  ThinkTankDetectiveCaseItem,
  ThinkTankRiddleItem,
  ThinkTankDebateItem,
} from './think-tank-data';

/**
 * Compares two semantic version strings (e.g. "19.2.0" vs "19.1.0").
 * Returns > 0 if a > b, 0 if a === b, < 0 if a < b.
 */
export function compareCurriculumVersions(a?: string, b?: string): number {
  if (!a && !b) return 0;
  if (!a) return -1;
  if (!b) return 1;

  const parse = (v: string) =>
    v
      .trim()
      .replace(/^v/i, '')
      .split('.')
      .map((part) => {
        const n = parseInt(part, 10);
        return Number.isFinite(n) ? n : 0;
      });

  const pa = parse(a);
  const pb = parse(b);
  const len = Math.max(pa.length, pb.length, 3);
  for (let i = 0; i < len; i++) {
    const va = pa[i] ?? 0;
    const vb = pb[i] ?? 0;
    if (va !== vb) return va - vb;
  }
  return 0;
}

export interface ShardedCurriculumManifest {
  id?: string;
  version?: string;
  sharded?: boolean;
  shardIds?: string[];
  paradoxCount?: number;
  caseCount?: number;
  riddleCount?: number;
  debateCount?: number;
  totalCount?: number;
}

export interface ShardDocumentData {
  id: string;
  version?: string;
  kind: 'paradoxes' | 'detectiveCases' | 'riddles' | 'debates';
  index?: number;
  count?: number;
  items?: unknown[];
}

export interface VerifiedCurriculumPayload {
  isVerifiedRemote: boolean;
  reason: string;
  version: string;
  paradoxes: ThinkTankParadoxItem[];
  detectiveCases: ThinkTankDetectiveCaseItem[];
  riddles: ThinkTankRiddleItem[];
  debates: ThinkTankDebateItem[];
}

/**
 * Verifies that a remote Firestore curriculum manifest is at least as fresh as `localVersion`
 * AND that all referenced shards are present and match their declared counts.
 */
export function assembleAndVerifyRemoteCurriculum(
  manifest: ShardedCurriculumManifest | null | undefined,
  shards: Array<ShardDocumentData | null | undefined>,
  localVersion: string,
  localFallback: {
    paradoxes: any[];
    detectiveCases: any[];
    riddles: any[];
    debates: any[];
  } = {
    paradoxes: [],
    detectiveCases: [],
    riddles: [],
    debates: [],
  }
): VerifiedCurriculumPayload {
  if (!manifest || !manifest.sharded || !Array.isArray(manifest.shardIds) || manifest.shardIds.length === 0) {
    return {
      isVerifiedRemote: false,
      reason: 'Manifest missing or not sharded',
      version: localVersion,
      ...localFallback,
    };
  }

  // 1. Version-aware freshness gate: reject stale Firestore curriculum even if item counts match
  if (compareCurriculumVersions(manifest.version, localVersion) < 0) {
    return {
      isVerifiedRemote: false,
      reason: `Remote version (${manifest.version || 'none'}) is older than local version (${localVersion})`,
      version: localVersion,
      ...localFallback,
    };
  }

  // 2. Shard completeness gate: every declared shardId must exist and have a valid items array
  const shardById = new Map<string, ShardDocumentData>();
  for (const s of shards) {
    if (s && typeof s.id === 'string' && Array.isArray(s.items)) {
      shardById.set(s.id, s);
    }
  }

  for (const expectedId of manifest.shardIds) {
    const shard = shardById.get(expectedId);
    if (!shard) {
      return {
        isVerifiedRemote: false,
        reason: `Missing or corrupted shard "${expectedId}"`,
        version: localVersion,
        ...localFallback,
      };
    }
    if (typeof shard.count === 'number' && shard.items!.length !== shard.count) {
      return {
        isVerifiedRemote: false,
        reason: `Shard "${expectedId}" item count mismatch (${shard.items!.length} vs ${shard.count})`,
        version: localVersion,
        ...localFallback,
      };
    }
  }

  // 3. Reconstruct in declared shard order and verify category totals
  const paradoxes: ThinkTankParadoxItem[] = [];
  const detectiveCases: ThinkTankDetectiveCaseItem[] = [];
  const riddles: ThinkTankRiddleItem[] = [];
  const debates: ThinkTankDebateItem[] = [];

  for (const expectedId of manifest.shardIds) {
    const shard = shardById.get(expectedId)!;
    const items = shard.items as any[];
    if (shard.kind === 'paradoxes') paradoxes.push(...items);
    else if (shard.kind === 'detectiveCases') detectiveCases.push(...items);
    else if (shard.kind === 'riddles') riddles.push(...items);
    else if (shard.kind === 'debates') debates.push(...items);
  }

  const totalLoaded = paradoxes.length + detectiveCases.length + riddles.length + debates.length;
  if (typeof manifest.totalCount === 'number' && totalLoaded !== manifest.totalCount) {
    return {
      isVerifiedRemote: false,
      reason: `Assembled total (${totalLoaded}) does not match manifest totalCount (${manifest.totalCount})`,
      version: localVersion,
      ...localFallback,
    };
  }
  if (typeof manifest.paradoxCount === 'number' && paradoxes.length !== manifest.paradoxCount) {
    return {
      isVerifiedRemote: false,
      reason: `Paradox count mismatch (${paradoxes.length} vs ${manifest.paradoxCount})`,
      version: localVersion,
      ...localFallback,
    };
  }
  if (typeof manifest.caseCount === 'number' && detectiveCases.length !== manifest.caseCount) {
    return {
      isVerifiedRemote: false,
      reason: `Detective Case count mismatch (${detectiveCases.length} vs ${manifest.caseCount})`,
      version: localVersion,
      ...localFallback,
    };
  }
  if (typeof manifest.riddleCount === 'number' && riddles.length !== manifest.riddleCount) {
    return {
      isVerifiedRemote: false,
      reason: `Riddle count mismatch (${riddles.length} vs ${manifest.riddleCount})`,
      version: localVersion,
      ...localFallback,
    };
  }
  if (typeof manifest.debateCount === 'number' && debates.length !== manifest.debateCount) {
    return {
      isVerifiedRemote: false,
      reason: `Debate count mismatch (${debates.length} vs ${manifest.debateCount})`,
      version: localVersion,
      ...localFallback,
    };
  }

  return {
    isVerifiedRemote: true,
    reason: `Verified remote curriculum v${manifest.version} across ${manifest.shardIds.length} shards`,
    version: manifest.version || localVersion,
    paradoxes,
    detectiveCases,
    riddles,
    debates,
  };
}

export interface StudentThinkTankProgressDoc {
  thinkTankCompleted?: string[];
  thinkTankAwardedXp?: Record<string, number>;
  thinkTankLockedBlueprints?: string[];
  thinkTankScore?: number;
}

export interface AtomicSolveResult {
  effectiveDelta: number;
  isNowFullySolved: boolean;
  nextState: {
    thinkTankCompleted: string[];
    thinkTankAwardedXp: Record<string, number>;
    thinkTankLockedBlueprints: string[];
    thinkTankScore: number;
  };
}

/**
 * Pure atomic state transition function executed inside a Firestore `runTransaction` callback.
 * Guarantees that concurrent or duplicate submissions cannot double-award XP.
 */
export function computeAtomicProgressTransition(
  currentDoc: StudentThinkTankProgressDoc | undefined,
  params: {
    activityId: string;
    points: number;
    maxPoints?: number;
    targetTotalXp?: number;
  }
): AtomicSolveResult {
  const existingCompleted = Array.isArray(currentDoc?.thinkTankCompleted)
    ? [...currentDoc!.thinkTankCompleted!]
    : [];
  const existingAwardedMap: Record<string, number> =
    currentDoc?.thinkTankAwardedXp && typeof currentDoc.thinkTankAwardedXp === 'object'
      ? { ...currentDoc.thinkTankAwardedXp }
      : {};
  const existingLocked = Array.isArray(currentDoc?.thinkTankLockedBlueprints)
    ? [...currentDoc!.thinkTankLockedBlueprints!]
    : [];
  const existingScore = Math.max(0, Number(currentDoc?.thinkTankScore || 0));

  const { activityId, points, maxPoints, targetTotalXp } = params;
  const cap = maxPoints ?? points;

  // 1. If the blueprint was revealed before mastery, revisions and XP awards are permanently locked
  if (existingLocked.includes(activityId)) {
    return {
      effectiveDelta: 0,
      isNowFullySolved: existingCompleted.includes(activityId),
      nextState: {
        thinkTankCompleted: existingCompleted,
        thinkTankAwardedXp: existingAwardedMap,
        thinkTankLockedBlueprints: existingLocked,
        thinkTankScore: existingScore,
      },
    };
  }

  // 2. Determine XP already awarded for this activity
  const alreadyAwarded = Math.max(
    existingAwardedMap[activityId] ?? 0,
    existingCompleted.includes(activityId) ? cap : 0
  );

  // 3. Compute desired total XP (capped at `cap`) and incremental delta
  const desiredTotal =
    targetTotalXp !== undefined
      ? Math.min(cap, targetTotalXp)
      : Math.min(cap, alreadyAwarded + points);

  const effectiveDelta = Math.max(0, desiredTotal - alreadyAwarded);
  if (effectiveDelta <= 0) {
    return {
      effectiveDelta: 0,
      isNowFullySolved: alreadyAwarded >= cap,
      nextState: {
        thinkTankCompleted: existingCompleted,
        thinkTankAwardedXp: existingAwardedMap,
        thinkTankLockedBlueprints: existingLocked,
        thinkTankScore: existingScore,
      },
    };
  }

  const newTotalForActivity = alreadyAwarded + effectiveDelta;
  const isNowFullySolved = newTotalForActivity >= cap;
  const nextCompleted =
    isNowFullySolved && !existingCompleted.includes(activityId)
      ? [...existingCompleted, activityId]
      : existingCompleted;
  const nextAwardedMap = {
    ...existingAwardedMap,
    [activityId]: newTotalForActivity,
  };
  const nextScore = existingScore + effectiveDelta;

  return {
    effectiveDelta,
    isNowFullySolved,
    nextState: {
      thinkTankCompleted: nextCompleted,
      thinkTankAwardedXp: nextAwardedMap,
      thinkTankLockedBlueprints: existingLocked,
      thinkTankScore: nextScore,
    },
  };
}

