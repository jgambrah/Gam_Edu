'use client';

import { useParams } from 'next/navigation';
import { CdnLessonPlayerLoader } from '@/components/narrated-lessons/CdnLessonPlayerLoader';

export default function PublicNarratedLessonPage() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = typeof params?.lessonId === 'string' ? decodeURIComponent(params.lessonId) : '';

  return <CdnLessonPlayerLoader lessonIdOrSlug={lessonId} />;
}
