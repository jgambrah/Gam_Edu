'use client';

import { NarratedLessonsHub } from '@/components/narrated-lessons/NarratedLessonsHub';

export default function DashboardCambridgeLessonsPage() {
  return (
    <NarratedLessonsHub
      curriculum="cambridge"
      basePath="/dashboard/cambridge-lessons"
    />
  );
}
