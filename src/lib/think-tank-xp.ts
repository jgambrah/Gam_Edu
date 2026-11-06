export const PARADOX_MAX_XP = 15;
export const MAX_XP_PER_ACTIVITY = 150;
export const MAX_SELF_XP_PER_DAY = 1000;

export type ParadoxGrade =
  | "Mastered"
  | "Partially Correct"
  | "Needs Revision"
  | "Uncertain";

export interface XpCalculationInput {
  grade: ParadoxGrade;
  alreadyAwarded: number;
  earnedToday: number;
  isBlueprintLocked: boolean;
}

export interface XpCalculationResult {
  awarded: number;
  newParadoxAward: number;
  newDailyEarned: number;
}

export function calculateParadoxXp(
  input: XpCalculationInput
): XpCalculationResult {
  const {
    grade,
    alreadyAwarded,
    earnedToday,
    isBlueprintLocked,
  } = input;

  const previous = Math.max(
    0,
    Math.min(PARADOX_MAX_XP, alreadyAwarded)
  );

  const dailyUsed = Math.max(0, earnedToday);

  const target =
    grade === "Mastered"
      ? 15
      : grade === "Partially Correct"
        ? 8
        : 0;

  const remainingForParadox = Math.max(
    0,
    target - previous
  );

  const remainingDaily = Math.max(
    0,
    MAX_SELF_XP_PER_DAY - dailyUsed
  );

  const awarded = isBlueprintLocked
    ? 0
    : Math.min(
        remainingForParadox,
        remainingDaily,
        MAX_XP_PER_ACTIVITY
      );

  return {
    awarded,
    newParadoxAward: previous + awarded,
    newDailyEarned: dailyUsed + awarded,
  };
}

