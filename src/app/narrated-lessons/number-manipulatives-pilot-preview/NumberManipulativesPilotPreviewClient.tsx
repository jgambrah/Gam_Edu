'use client';

import React from 'react';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import { NarratedLessonPlayer } from '@/components/narrated-lessons/NarratedLessonPlayer';

export function NumberManipulativesPilotPreviewClient({ lesson }: { lesson: NarratedLesson }) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-950">
        DEV-ONLY PREVIEW — Step 5F Primary Number Manipulatives Pilot (`construction-lab` 1.7.0 · Production Gate CLOSED at 1.3.0)
      </div>
      <NarratedLessonPlayer lesson={lesson} />
    </main>
  );
}
