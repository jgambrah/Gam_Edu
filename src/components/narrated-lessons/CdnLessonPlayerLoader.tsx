'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { fetchLessonPackageById } from '@/lib/narrated-lessons/catalogue';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import { NarratedLessonPlayer } from './NarratedLessonPlayer';

interface CdnLessonPlayerLoaderProps {
  lessonIdOrSlug: string;
  backHref?: string;
  backLabel?: string;
  allowReviewerTools?: boolean;
}

export function CdnLessonPlayerLoader({
  lessonIdOrSlug,
  backHref,
  backLabel = 'All Narrated Lessons',
  allowReviewerTools = false,
}: CdnLessonPlayerLoaderProps) {
  const [lesson, setLesson] = useState<NarratedLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchLessonPackageById(lessonIdOrSlug)
      .then((res) => {
        if (!active) return;
        if (!res) {
          setError(`Lesson "${lessonIdOrSlug}" was not found in the central library.`);
          setLesson(null);
        } else {
          setLesson(res.lesson);
          setError(null);
        }
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load lesson from CDN.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [lessonIdOrSlug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-slate-600">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
        <p className="text-sm font-medium">Loading narrated lesson...</p>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-900">
          {error || 'Lesson not found.'}
        </p>
        {backHref && (
          <Link
            href={backHref}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      {backHref && (
        <div className="border-b border-slate-200 bg-white px-4 py-2">
          <div className="mx-auto max-w-5xl">
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {backLabel}
            </Link>
          </div>
        </div>
      )}
      <NarratedLessonPlayer lesson={lesson} allowReviewerTools={allowReviewerTools} />
    </div>
  );
}
