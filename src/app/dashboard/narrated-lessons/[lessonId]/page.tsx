'use client';

import { useParams } from 'next/navigation';
import { CdnLessonPlayerLoader } from '@/components/narrated-lessons/CdnLessonPlayerLoader';

export default function DashboardNarratedLessonPlayerPage() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = typeof params?.lessonId === 'string' ? decodeURIComponent(params.lessonId) : '';

  return (
    <CdnLessonPlayerLoader
      lessonIdOrSlug={lessonId}
      backHref="/dashboard/narrated-lessons"
      backLabel="Back to Narrated Lessons"
    />
  );
}
