import type { Firestore } from 'firebase-admin/firestore';
import {
  THINK_TANK_PARADOXES,
  type ThinkTankParadoxItem,
} from '@/lib/think-tank-data';

const CENTRAL_PARADOX_MAP = new Map<string, ThinkTankParadoxItem>(
  THINK_TANK_PARADOXES.map((item) => [item.id, item])
);

/**
 * Loads the canonical paradox and its grading rubric from trusted server-side data.
 * Never accepts an answer or rubric supplied by the client.
 *
 * 1. Checks the canonical in-memory central repository (`THINK_TANK_PARADOXES`) first.
 * 2. Falls back to `think_tank_paradoxes/{paradoxId}` in Firestore only for verified
 *    school-created custom paradoxes belonging to `verifiedSchoolId`.
 */
export async function getTrustedParadox(
  paradoxId: string,
  options?: {
    db?: Firestore;
    verifiedSchoolId?: string;
  }
): Promise<ThinkTankParadoxItem | null> {
  if (!paradoxId || typeof paradoxId !== 'string') {
    return null;
  }

  const cleanId = paradoxId.trim();
  const central = CENTRAL_PARADOX_MAP.get(cleanId);
  if (central) {
    return central;
  }

  if (options?.db && options?.verifiedSchoolId) {
    const customSnap = await options.db
      .collection('think_tank_paradoxes')
      .doc(cleanId)
      .get();

    if (!customSnap.exists) {
      return null;
    }

    const data = customSnap.data() as Record<string, any> | undefined;
    if (!data) {
      return null;
    }

    if (data.schoolId !== options.verifiedSchoolId && data.isCentral !== true) {
      return null;
    }

    if (
      typeof data.question !== 'string' ||
      !data.question.trim() ||
      typeof data.answer !== 'string' ||
      !data.answer.trim() ||
      typeof data.explanation !== 'string' ||
      !data.explanation.trim()
    ) {
      return null;
    }

    return {
      id: cleanId,
      question: data.question,
      answer: data.answer,
      explanation: data.explanation,
      targetGroup: data.targetGroup || 'Scholar (JHS)',
      difficulty: data.difficulty || 'Logic Check',
      isCentral: Boolean(data.isCentral),
      evaluation: data.evaluation,
    };
  }

  return null;
}

