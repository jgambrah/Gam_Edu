'use client';

import React from 'react';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import { NarratedLessonPlayer } from '@/components/narrated-lessons/NarratedLessonPlayer';

export function MathWorkspacePilotPreviewClient({ initialLesson }: { initialLesson: NarratedLesson }) {
  return <NarratedLessonPlayer lesson={initialLesson} />;
}
