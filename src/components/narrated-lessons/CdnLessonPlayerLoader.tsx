'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Code2, Database, Loader2, Rocket } from 'lucide-react';
import { fetchLessonPackageById } from '@/lib/narrated-lessons/catalogue';
import { getSeniorAcademyLinkForLesson } from '@/lib/narrated-lessons/senior-academy-map';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import type { LessonNotesPackage, LessonStage } from '@/lib/narrated-lessons/notes-types';
import { NarratedLessonPlayer } from './NarratedLessonPlayer';

const CAMBRIDGE_PRACTICE_LINKS: Record<
  string,
  { href: string; label: string; kind: 'python' | 'sql' }
> = {
  'igcse-cs-programming-1-basics': {
    href: '/dashboard/coding-club/python-academy?mission=igcse-ch8-1-ipo',
    label: 'Practice in Python Lab (Ch. 8 Part 1)',
    kind: 'python',
  },
  'igcse-cs-programming-2-selection-iteration': {
    href: '/dashboard/coding-club/python-academy?mission=igcse-ch8-2-grade',
    label: 'Practice in Python Lab (Ch. 8 Part 2)',
    kind: 'python',
  },
  'igcse-cs-programming-3-subroutines-arrays-files': {
    href: '/dashboard/coding-club/python-academy?mission=igcse-ch8-3-func',
    label: 'Practice in Python Lab (Ch. 8 Part 3)',
    kind: 'python',
  },
  'igcse-cs-databases-a': {
    href: '/dashboard/coding-club/sql-lab?part=a',
    label: 'Practice Live in SQL Lab (Part A)',
    kind: 'sql',
  },
  'igcse-cs-databases-b': {
    href: '/dashboard/coding-club/sql-lab?part=b',
    label: 'Practice Live in SQL Lab (Part B)',
    kind: 'sql',
  },
};

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
  const [notes, setNotes] = useState<LessonNotesPackage | null>(null);
  const [initialStage, setInitialStage] = useState<LessonStage>('listen');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stageParam = new URLSearchParams(window.location.search).get('stage');
      if (stageParam === 'notes' || stageParam === 'questions') {
        setInitialStage(stageParam);
      } else {
        setInitialStage('listen');
      }
    } catch {
      setInitialStage('listen');
    }
  }, [lessonIdOrSlug]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchLessonPackageById(lessonIdOrSlug)
      .then((res) => {
        if (!active) return;
        if (!res) {
          setError(`Lesson "${lessonIdOrSlug}" was not found in the central library.`);
          setLesson(null);
          setNotes(null);
        } else {
          setLesson(res.lesson);
          setNotes(res.notes);
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

  const seniorLink = getSeniorAcademyLinkForLesson(lesson.lessonId);
  const practiceLink = CAMBRIDGE_PRACTICE_LINKS[lesson.lessonId];

  return (
    <div>
      {(backHref || seniorLink || practiceLink) && (
        <div className="border-b border-slate-200 bg-white px-4 py-2">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
            {backHref ? (
              <Link
                href={backHref}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {backLabel}
              </Link>
            ) : (
              <span />
            )}
            <div className="flex flex-wrap items-center gap-2">
              {practiceLink && (
                <Link
                  href={practiceLink.href}
                  className={
                    practiceLink.kind === 'sql'
                      ? 'inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100'
                      : 'inline-flex items-center gap-1.5 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-xs font-bold text-fuchsia-800 transition hover:bg-fuchsia-100'
                  }
                >
                  {practiceLink.kind === 'sql' ? (
                    <Database className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Code2 className="h-3.5 w-3.5 text-fuchsia-600" />
                  )}
                  <span>{practiceLink.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              )}
              {seniorLink && (
                <Link
                  href={seniorLink.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-800 transition hover:bg-indigo-100"
                  title={`Open ${seniorLink.seniorHubTitle} in Senior Academy`}
                >
                  <Rocket className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Senior Academy: Deep Notes &amp; Past Questions</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      <NarratedLessonPlayer
        lesson={lesson}
        notes={notes}
        initialStage={notes ? initialStage : 'listen'}
        allowReviewerTools={allowReviewerTools}
      />
    </div>
  );
}
