'use client';

import { useParams } from 'next/navigation';
import { CdnLessonPlayerLoader } from '@/components/narrated-lessons/CdnLessonPlayerLoader';
import { useRole } from '@/context/role-context';

export default function DashboardCambridgeLessonPlayerPage() {
  const params = useParams<{ lessonId: string }>();
  const { role } = useRole();
  const lessonId = typeof params?.lessonId === 'string' ? decodeURIComponent(params.lessonId) : '';
  const isStaff = [
    'teacher',
    'administrator',
    'director',
    'admin',
    'headmaster',
    'headmistress',
    'head teacher',
    'principal',
    'owner',
  ].includes((role || '').toLowerCase());

  return (
    <CdnLessonPlayerLoader
      lessonIdOrSlug={lessonId}
      backHref="/dashboard/cambridge-lessons"
      backLabel="Back to Cambridge Lessons"
      allowReviewerTools={isStaff}
    />
  );
}
