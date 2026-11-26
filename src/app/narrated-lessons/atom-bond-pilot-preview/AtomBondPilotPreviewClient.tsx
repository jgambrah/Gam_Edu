'use client';

import React, { useEffect, useState } from 'react';
import { NarratedLessonPlayer } from '@/components/narrated-lessons/NarratedLessonPlayer';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';

export function AtomBondPilotPreviewClient() {
  const [lesson, setLesson] = useState<NarratedLesson | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/preview-fixtures/step4e-atom-bond-pilot.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<NarratedLesson>;
      })
      .then((data) => {
        if (active) setLesson(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load Step 4E preview fixture.');
      });
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl p-8 text-sm text-rose-700">
        Failed to load Step 4E preview fixture: {error}
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="mx-auto max-w-2xl p-8 text-sm text-slate-600">
        Loading Step 4E Atomic &amp; Molecular Bonding preview pilots (12 slides, 13 activities)...
      </div>
    );
  }

  return <NarratedLessonPlayer lesson={lesson} allowReviewerTools={false} />;
}
