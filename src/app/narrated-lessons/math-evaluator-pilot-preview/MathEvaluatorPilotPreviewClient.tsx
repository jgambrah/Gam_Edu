'use client';

import React from 'react';
import { NarratedLessonPlayer } from '@/components/narrated-lessons/NarratedLessonPlayer';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';

export function MathEvaluatorPilotPreviewClient({ initialLesson }: { initialLesson: NarratedLesson }) {
  return <NarratedLessonPlayer lesson={initialLesson} allowReviewerTools={false} />;
}
