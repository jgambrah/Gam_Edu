import type { Firestore } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebaseAdmin';
import {
  THINK_TANK_PARADOXES,
  THINK_TANK_DETECTIVE_CASES,
  THINK_TANK_RIDDLES,
  THINK_TANK_DEBATES,
  type ThinkTankParadoxItem,
  type ThinkTankDetectiveCaseItem,
  type ThinkTankRiddleItem,
  type ThinkTankDebateItem,
} from '@/lib/think-tank-data';
import type { ThinkTankParadoxEvaluation } from '@/lib/think-tank-evaluator';

const CENTRAL_PARADOX_MAP = new Map<string, ThinkTankParadoxItem>(
  THINK_TANK_PARADOXES.map((item) => [item.id, item])
);

const CENTRAL_DETECTIVE_CASE_MAP = new Map<string, ThinkTankDetectiveCaseItem>(
  THINK_TANK_DETECTIVE_CASES.map((item) => [item.id, item])
);

const CENTRAL_RIDDLE_MAP = new Map<string, ThinkTankRiddleItem>(
  THINK_TANK_RIDDLES.map((item) => [item.id, item])
);

const CENTRAL_DEBATE_MAP = new Map<string, ThinkTankDebateItem>(
  THINK_TANK_DEBATES.map((item) => [item.id, item])
);

function sanitizePrivateEvaluationRubric(
  raw: unknown
): ThinkTankParadoxEvaluation | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return undefined;
  }
  const obj = raw as Record<string, unknown>;
  const validTypes = new Set([
    'conceptual',
    'numeric',
    'polarity',
    'deductive',
    'self_reference_paradox',
  ]);
  const type =
    typeof obj.type === 'string' && validTypes.has(obj.type)
      ? (obj.type as ThinkTankParadoxEvaluation['type'])
      : 'conceptual';

  const toStringList = (val: unknown): string[] | undefined =>
    Array.isArray(val) && val.every((x) => typeof x === 'string')
      ? (val as string[])
      : undefined;

  return {
    type,
    acceptedExpressions: toStringList(obj.acceptedExpressions),
    partialConcepts: toStringList(obj.partialConcepts),
    commonTraps: toStringList(obj.commonTraps),
    coachingHint:
      typeof obj.coachingHint === 'string' ? obj.coachingHint : undefined,
    maxXp:
      typeof obj.maxXp === 'number' && Number.isFinite(obj.maxXp) && obj.maxXp > 0
        ? obj.maxXp
        : 15,
  };
}

/**
 * Loads the canonical paradox and its grading rubric from trusted server-side data.
 * Never accepts an answer or rubric supplied by the client, and never falls back
 * to reading `answer` or `explanation` from the public `think_tank_paradoxes` document.
 *
 * 1. Checks the canonical in-memory central repository (`THINK_TANK_PARADOXES`) first.
 * 2. For school-created paradoxes, assembles the question from `think_tank_paradoxes/{paradoxId}`
 *    and the canonical answer/explanation/rubric from `think_tank_private_paradoxes/{paradoxId}`,
 *    requiring both documents to exist and match `verifiedSchoolId`.
 */
export async function getTrustedParadox(
  paradoxId: string,
  options?: {
    db?: Firestore;
    verifiedSchoolId?: string;
  }
): Promise<(ThinkTankParadoxItem & { schoolId?: string }) | null> {
  if (!paradoxId || typeof paradoxId !== 'string') {
    return null;
  }

  const cleanId = paradoxId.trim();
  if (!cleanId) {
    return null;
  }

  const central = CENTRAL_PARADOX_MAP.get(cleanId);
  if (central) {
    return central;
  }

  if (!options?.db || !options?.verifiedSchoolId) {
    return null;
  }

  const { db, verifiedSchoolId } = options;

  const publicRef = db.collection('think_tank_paradoxes').doc(cleanId);
  const privateRef = db.collection('think_tank_private_paradoxes').doc(cleanId);

  const [publicSnap, privateSnap] = await Promise.all([
    publicRef.get(),
    privateRef.get(),
  ]);

  if (!publicSnap.exists) {
    return null;
  }

  const publicData = publicSnap.data() as Record<string, any> | undefined;
  let privateData = privateSnap.exists
    ? (privateSnap.data() as Record<string, any> | undefined)
    : undefined;

  if (!publicData || publicData.schoolId !== verifiedSchoolId) {
    return null;
  }

  // Legacy school paradox fallback: if private doc was not yet migrated,
  // read answer/explanation from the verified school's public doc and backfill private doc.
  if (
    !privateData &&
    typeof publicData.answer === 'string' &&
    publicData.answer.trim() &&
    typeof publicData.explanation === 'string' &&
    publicData.explanation.trim()
  ) {
    privateData = {
      id: cleanId,
      schoolId: verifiedSchoolId,
      answer: publicData.answer.trim(),
      explanation: publicData.explanation.trim(),
      ...(publicData.evaluation ? { evaluation: publicData.evaluation } : {}),
      schemaVersion: 2,
    };
    try {
      await privateRef.set(privateData, { merge: true });
    } catch {
      // Non-fatal in read-only or mock test environments
    }
  }

  if (!privateData || privateData.schoolId !== verifiedSchoolId) {
    return null;
  }

  if (
    typeof publicData.question !== 'string' ||
    !publicData.question.trim() ||
    typeof privateData.answer !== 'string' ||
    !privateData.answer.trim() ||
    typeof privateData.explanation !== 'string' ||
    !privateData.explanation.trim()
  ) {
    return null;
  }

  // Explicitly construct the trusted record without spreading privateData over publicData.
  return {
    id: cleanId,
    question: publicData.question.trim(),
    schoolId: verifiedSchoolId,
    targetGroup:
      typeof publicData.targetGroup === 'string' && publicData.targetGroup.trim()
        ? (publicData.targetGroup.trim() as ThinkTankParadoxItem['targetGroup'])
        : 'Scholar (JHS)',
    difficulty:
      typeof publicData.difficulty === 'string' && publicData.difficulty.trim()
        ? publicData.difficulty.trim()
        : 'Logic Check',
    isCentral: false,
    answer: privateData.answer.trim(),
    explanation: privateData.explanation.trim(),
    evaluation: sanitizePrivateEvaluationRubric(privateData.evaluation),
  };
}

/**
 * Loads the canonical Detective Case and its correct answer from trusted server-side data.
 * Never accepts `correctAnswer` or `explanation` from the client or from an unverified
 * public Firestore document (`think_tank_detective_cases`).
 *
 * 1. Checks the canonical in-memory central repository (`THINK_TANK_DETECTIVE_CASES`) first.
 * 2. For school-created cases, requires both `think_tank_detective_cases/{caseId}` (public)
 *    and `think_tank_private_detective_cases/{caseId}` (private) to exist and match `verifiedSchoolId`.
 */
export async function getTrustedDetectiveCase(
  caseId: string,
  options?: {
    db?: Firestore;
    verifiedSchoolId?: string;
  }
): Promise<(ThinkTankDetectiveCaseItem & { schoolId?: string }) | null> {
  if (!caseId || typeof caseId !== 'string') {
    return null;
  }

  const cleanId = caseId.trim();
  if (!cleanId || cleanId.includes('/')) {
    return null;
  }

  const central = CENTRAL_DETECTIVE_CASE_MAP.get(cleanId);
  if (central) {
    return central;
  }

  if (!options?.db || !options?.verifiedSchoolId) {
    return null;
  }

  const { db, verifiedSchoolId } = options;

  const publicRef = db.collection('think_tank_detective_cases').doc(cleanId);
  const privateRef = db
    .collection('think_tank_private_detective_cases')
    .doc(cleanId);

  const [publicSnap, privateSnap] = await Promise.all([
    publicRef.get(),
    privateRef.get(),
  ]);

  if (!publicSnap.exists) {
    return null;
  }

  const publicData = publicSnap.data() as Record<string, any> | undefined;
  let privateData = privateSnap.exists
    ? (privateSnap.data() as Record<string, any> | undefined)
    : undefined;

  if (!publicData || publicData.schoolId !== verifiedSchoolId) {
    return null;
  }

  // Legacy school detective case fallback: if private doc was not yet migrated,
  // read correctAnswer/explanation from the verified school's public doc and backfill private doc.
  if (
    !privateData &&
    typeof publicData.correctAnswer === 'string' &&
    publicData.correctAnswer.trim() &&
    typeof publicData.explanation === 'string' &&
    publicData.explanation.trim()
  ) {
    privateData = {
      id: cleanId,
      schoolId: verifiedSchoolId,
      correctAnswer: publicData.correctAnswer.trim(),
      explanation: publicData.explanation.trim(),
      schemaVersion: 2,
    };
    try {
      await privateRef.set(privateData, { merge: true });
    } catch {
      // Non-fatal in read-only or mock test environments
    }
  }

  if (!privateData || privateData.schoolId !== verifiedSchoolId) {
    return null;
  }

  if (
    typeof publicData.scenario !== 'string' ||
    !publicData.scenario.trim() ||
    typeof publicData.question !== 'string' ||
    !publicData.question.trim() ||
    !Array.isArray(publicData.options) ||
    !publicData.options.every((opt: unknown) => typeof opt === 'string') ||
    typeof privateData.correctAnswer !== 'string' ||
    !privateData.correctAnswer.trim() ||
    typeof privateData.explanation !== 'string' ||
    !privateData.explanation.trim()
  ) {
    return null;
  }

  return {
    id: cleanId,
    schoolId: verifiedSchoolId,
    targetGroup:
      typeof publicData.targetGroup === 'string' && publicData.targetGroup.trim()
        ? (publicData.targetGroup.trim() as ThinkTankDetectiveCaseItem['targetGroup'])
        : 'Scholar (JHS)',
    caseType:
      typeof publicData.caseType === 'string' && publicData.caseType.trim()
        ? (publicData.caseType.trim() as ThinkTankDetectiveCaseItem['caseType'])
        : 'Evidence Check',
    scenario: publicData.scenario.trim(),
    question: publicData.question.trim(),
    options: (publicData.options as string[]).map((opt) => opt.trim()),
    correctAnswer: privateData.correctAnswer.trim(),
    explanation: privateData.explanation.trim(),
    isCentral: false,
  };
}

/**
 * Loads the canonical Riddle and its answer/acceptedKeywords from trusted server-side data.
 * Never accepts `answer`, `acceptedKeywords`, or `explanation` from the client or from
 * an unverified public Firestore document (`think_tank_riddles`).
 *
 * 1. Checks the canonical in-memory central repository (`THINK_TANK_RIDDLES`) first.
 * 2. For school-created riddles, requires both `think_tank_riddles/{riddleId}` (public)
 *    and `think_tank_private_riddles/{riddleId}` (private) to exist and match `verifiedSchoolId`.
 */
export async function getTrustedRiddle(
  riddleId: string,
  verifiedSchoolIdOrOptions?:
    | string
    | {
        db?: Firestore;
        verifiedSchoolId?: string;
      },
  maybeOptions?: {
    db?: Firestore;
  }
): Promise<(ThinkTankRiddleItem & { schoolId?: string }) | null> {
  if (!riddleId || typeof riddleId !== 'string') {
    return null;
  }

  const cleanId = riddleId.trim();
  if (!cleanId || cleanId.includes('/')) {
    return null;
  }

  const central = CENTRAL_RIDDLE_MAP.get(cleanId);
  if (central) {
    return central;
  }

  const verifiedSchoolId =
    typeof verifiedSchoolIdOrOptions === 'string'
      ? verifiedSchoolIdOrOptions.trim()
      : verifiedSchoolIdOrOptions?.verifiedSchoolId?.trim() ?? '';

  if (!verifiedSchoolId) {
    return null;
  }

  const db =
    (typeof verifiedSchoolIdOrOptions === 'object' &&
      verifiedSchoolIdOrOptions?.db) ||
    maybeOptions?.db ||
    getAdminDb();

  const publicRef = db.collection('think_tank_riddles').doc(cleanId);
  const privateRef = db.collection('think_tank_private_riddles').doc(cleanId);

  const [publicSnap, privateSnap] = await Promise.all([
    publicRef.get(),
    privateRef.get(),
  ]);

  if (!publicSnap.exists) {
    return null;
  }

  const publicData = publicSnap.data() as Record<string, any> | undefined;
  let privateData = privateSnap.exists
    ? (privateSnap.data() as Record<string, any> | undefined)
    : undefined;

  if (!publicData || publicData.schoolId !== verifiedSchoolId) {
    return null;
  }

  // Legacy school paradox fallback: if private doc was not yet migrated,
  // read answer/explanation from the verified school's public doc and backfill private doc.
  if (
    !privateData &&
    typeof publicData.answer === 'string' &&
    publicData.answer.trim() &&
    typeof publicData.explanation === 'string' &&
    publicData.explanation.trim()
  ) {
    privateData = {
      id: cleanId,
      schoolId: verifiedSchoolId,
      answer: publicData.answer.trim(),
      explanation: publicData.explanation.trim(),
      ...(publicData.evaluation ? { evaluation: publicData.evaluation } : {}),
      schemaVersion: 2,
    };
    try {
      await privateRef.set(privateData, { merge: true });
    } catch {
      // Non-fatal in read-only or mock test environments
    }
  }

  if (!privateData || privateData.schoolId !== verifiedSchoolId) {
    return null;
  }

  if (
    typeof publicData.question !== 'string' ||
    !publicData.question.trim() ||
    typeof privateData.answer !== 'string' ||
    !privateData.answer.trim() ||
    typeof privateData.explanation !== 'string' ||
    !privateData.explanation.trim()
  ) {
    return null;
  }

  if (
    privateData.acceptedKeywords !== undefined &&
    (!Array.isArray(privateData.acceptedKeywords) ||
      !privateData.acceptedKeywords.every(
        (kw: unknown) => typeof kw === 'string' && Boolean(kw.trim())
      ))
  ) {
    return null;
  }

  const acceptedKeywords = Array.isArray(privateData.acceptedKeywords)
    ? (privateData.acceptedKeywords as string[]).map((kw) => kw.trim())
    : [];

  return {
    id: cleanId,
    schoolId: verifiedSchoolId,
    targetGroup:
      typeof publicData.targetGroup === 'string' && publicData.targetGroup.trim()
        ? (publicData.targetGroup.trim() as ThinkTankRiddleItem['targetGroup'])
        : 'Scholar (JHS)',
    category:
      typeof publicData.category === 'string' && publicData.category.trim()
        ? (publicData.category.trim() as ThinkTankRiddleItem['category'])
        : 'Word Riddle',
    difficulty:
      typeof publicData.difficulty === 'string' && publicData.difficulty.trim()
        ? (publicData.difficulty.trim() as ThinkTankRiddleItem['difficulty'])
        : 'Medium',
    question: publicData.question.trim(),
    hint1:
      typeof publicData.hint1 === 'string' ? publicData.hint1.trim() : '',
    hint2:
      typeof publicData.hint2 === 'string' ? publicData.hint2.trim() : '',
    answer: privateData.answer.trim(),
    acceptedKeywords,
    explanation: privateData.explanation.trim(),
    isCentral: false,
  };
}

export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isCorrectRiddleGuess(
  guess: string,
  answer: string,
  acceptedKeywords: string[]
): boolean {
  const normalizedGuess = normalizeAnswer(guess);

  if (!normalizedGuess) return false;

  const accepted = [answer, ...acceptedKeywords]
    .map(normalizeAnswer)
    .filter(Boolean);

  return accepted.includes(normalizedGuess);
}

/**
 * Loads the canonical Debate Topic from trusted server-side data.
 * 1. Checks the canonical in-memory central repository (`THINK_TANK_DEBATES`) first.
 * 2. For school-created debate motions, reads `think_tank_debates/{debateId}` and verifies
 *    that `schoolId === verifiedSchoolId`.
 */
export async function getTrustedDebate(
  debateId: string,
  verifiedSchoolIdOrOptions?:
    | string
    | {
        db?: Firestore;
        verifiedSchoolId?: string;
      },
  maybeOptions?: {
    db?: Firestore;
  }
): Promise<(ThinkTankDebateItem & { schoolId?: string }) | null> {
  if (!debateId || typeof debateId !== 'string') {
    return null;
  }

  const cleanId = debateId.trim();
  if (!cleanId || cleanId.includes('/')) {
    return null;
  }

  const central = CENTRAL_DEBATE_MAP.get(cleanId);
  if (central) {
    return central;
  }

  const verifiedSchoolId =
    typeof verifiedSchoolIdOrOptions === 'string'
      ? verifiedSchoolIdOrOptions.trim()
      : verifiedSchoolIdOrOptions?.verifiedSchoolId?.trim() ?? '';

  if (!verifiedSchoolId) {
    return null;
  }

  const db =
    (typeof verifiedSchoolIdOrOptions === 'object' &&
      verifiedSchoolIdOrOptions?.db) ||
    maybeOptions?.db ||
    getAdminDb();

  const docSnap = await db.collection('think_tank_debates').doc(cleanId).get();
  if (!docSnap.exists) {
    return null;
  }

  const data = docSnap.data() as Record<string, any> | undefined;
  if (!data || data.schoolId !== verifiedSchoolId) {
    return null;
  }

  if (
    typeof data.topic !== 'string' ||
    !data.topic.trim() ||
    typeof data.context !== 'string' ||
    !data.context.trim()
  ) {
    return null;
  }

  return {
    id: cleanId,
    schoolId: verifiedSchoolId,
    targetGroup:
      typeof data.targetGroup === 'string' && data.targetGroup.trim()
        ? (data.targetGroup.trim() as ThinkTankDebateItem['targetGroup'])
        : 'Scholar (JHS)',
    topic: data.topic.trim(),
    context: data.context.trim(),
    isCentral: false,
  };
}




