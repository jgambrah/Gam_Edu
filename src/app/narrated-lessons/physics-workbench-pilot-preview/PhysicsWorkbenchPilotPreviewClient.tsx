'use client';

import React from 'react';
import { NarratedLessonPlayer } from '@/components/narrated-lessons/NarratedLessonPlayer';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';

export function PhysicsWorkbenchPilotPreviewClient({ lesson }: { lesson: NarratedLesson }) {
  return <NarratedLessonPlayer lesson={lesson} />;
}
