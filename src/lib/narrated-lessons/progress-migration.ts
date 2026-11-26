/**
 * Stable step-ID progress restoration and legacy-index migration
 * for NarratedLessonPlayer (preserves returning learners' exact position
 * when introductory slides/checkpoints are prepended to an existing lesson).
 */

export interface SavedLessonProgress {
  stepIdx?: number;
  currentStepId?: string;
  itemProgress?: Record<string, any>;
  lowDataMode?: boolean;
}

export interface StepLike {
  id: string;
}

/**
 * Known legacy step-index offsets for lessons that received prepended
 * introductory slides after initial publication.
 * - `igcse-cs-boolean-logic-a`: +6 steps (3 intro slides + 3 intro checkpoints)
 */
const LEGACY_PREPEND_STEP_OFFSET: Record<string, number> = {
  'igcse-cs-boolean-logic-a': 6,
};

export function resolveRestoredStepIndex(
  lessonId: string,
  steps: readonly StepLike[],
  saved: SavedLessonProgress | null | undefined
): number {
  if (!saved || steps.length === 0) return 0;

  // 1. Prefer stable step ID whenever present (immune to slide insertions)
  if (saved.currentStepId) {
    const byId = steps.findIndex((s) => s.id === saved.currentStepId);
    if (byId !== -1) return byId;
  }

  // 2. Fallback for legacy records saved before currentStepId existed
  if (typeof saved.stepIdx === 'number' && Number.isFinite(saved.stepIdx)) {
    const raw = Math.max(0, Math.floor(saved.stepIdx));
    const offset = LEGACY_PREPEND_STEP_OFFSET[lessonId] ?? 0;
    // Step 0 is always the lesson intro screen; only shift learners who had already started (> 0)
    const migrated = raw > 0 && offset > 0 ? raw + offset : raw;
    return Math.min(steps.length - 1, migrated);
  }

  return 0;
}
