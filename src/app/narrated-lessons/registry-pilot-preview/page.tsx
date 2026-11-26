'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FlaskConical, Loader2 } from 'lucide-react';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import { NarratedLessonPlayer } from '@/components/narrated-lessons/NarratedLessonPlayer';

/**
 * Preview-only route demonstrating Step 3's Reusable InteractiveEngineRegistry
 * through the actual NarratedLessonPlayer using a static preview JSON fixture
 * (never published to the live CDN catalogue; zero lesson-specific React components).
 */
export default function RegistryPilotPreviewPage() {
  const [lesson, setLesson] = useState<NarratedLesson | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/preview-fixtures/step3-registry-pilot.json', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<NarratedLesson>;
      })
      .then((data) => {
        if (active) setLesson(data);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load preview fixture.');
      });
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl p-6 text-sm text-rose-700">
        Could not load Step 3 preview fixture: {error}
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm font-medium text-slate-600">
        <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
        Loading Step 3 Interactive Engine Registry Preview...
      </div>
    );
  }

  return (
    <div>
      <div className="border-b border-indigo-200 bg-indigo-50 px-4 py-2 text-xs text-indigo-950">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <FlaskConical className="h-3.5 w-3.5 text-indigo-700" />
            Step 3 Preview-Only Fixture (JSON-driven InteractiveEngineRegistry — Not in Live CDN Catalogue)
          </span>
          <Link
            href="/dashboard/narrated-lessons"
            className="inline-flex items-center gap-1 font-bold text-indigo-700 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Narrated Lessons
          </Link>
        </div>
      </div>
      <NarratedLessonPlayer lesson={lesson} allowReviewerTools={true} />
    </div>
  );
}
