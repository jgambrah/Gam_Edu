import type {
  ThinkTankParadoxItem,
  ThinkTankTargetGroup,
} from '@/lib/think-tank-data';

export type PublicParadox = {
  id: string;
  title?: string;
  question: string;
  targetGroup: ThinkTankTargetGroup;
  difficulty: string;
  isCentral?: boolean;
};

/**
 * Serializes a canonical paradox item into a student-safe public object
 * using an explicit allowlist. Never copies `answer`, `explanation`,
 * `evaluation`, or any grading keywords.
 */
export function toPublicParadox(
  paradox: ThinkTankParadoxItem & { title?: string }
): PublicParadox {
  const pub: PublicParadox = {
    id: paradox.id,
    question: paradox.question,
    targetGroup: paradox.targetGroup,
    difficulty: paradox.difficulty,
    isCentral: Boolean(paradox.isCentral),
  };

  if (typeof paradox.title === 'string' && paradox.title.trim()) {
    pub.title = paradox.title.trim();
  }

  return pub;
}

export function toPublicParadoxes(
  paradoxes: Array<ThinkTankParadoxItem & { title?: string }>
): PublicParadox[] {
  return paradoxes.map(toPublicParadox);
}

