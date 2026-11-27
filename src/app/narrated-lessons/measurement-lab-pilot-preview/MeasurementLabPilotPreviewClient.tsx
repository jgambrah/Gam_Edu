'use client';

import React from 'react';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import { NarratedLessonPlayer } from '@/components/narrated-lessons/NarratedLessonPlayer';

export function MeasurementLabPilotPreviewClient({ lesson }: { lesson: NarratedLesson }) {
  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-xs font-semibold text-teal-900">
          Step 5C Isolated Preview — Virtual Measuring Instruments (construction-lab 1.4.0 · productionVersion held at 1.3.0)
        </div>
        <NarratedLessonPlayer lesson={lesson} />
      </div>
    </div>
  );
}
