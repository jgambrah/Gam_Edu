'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, Loader2 } from 'lucide-react';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import { NarratedLessonPlayer } from '@/components/narrated-lessons/NarratedLessonPlayer';

/**
 * Client renderer for the Step 4C Diagram & Hotspots cross-subject preview pilot.
 * Never bypasses reviewer authorisation (`allowReviewerTools={false}`).
 */
export function DiagramHotspotsPilotPreviewClient() {
  const [lesson, setLesson] = useState<NarratedLesson | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/preview-fixtures/step4c-diagram-hotspots-pilot.json', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<NarratedLesson>;
      })
      .then((data) => {
        if (active) setLesson(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load Step 4C preview fixture.');
      });
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-sm text-rose-700">
        Could not load Step 4C preview fixture: {error}
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm font-medium text-slate-600">
        <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
        Loading Step 4C Diagram &amp; Hotspots Pilot Preview...
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-teal-200 bg-teal-50 px-4 py-2 text-xs text-teal-950">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Compass className="h-3.5 w-3.5 text-teal-700" />
            Step 4C Preview-Only Pilot (8 Cross-Subject DiagramHotspotsEngine Activities · Disabled in Production)
          </span>
          <Link
            href="/dashboard/narrated-lessons"
            className="inline-flex items-center gap-1 font-bold text-teal-700 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Narrated Lessons
          </Link>
        </div>
      </div>
      <NarratedLessonPlayer lesson={lesson} allowReviewerTools={false} />
    </div>
  );
}
