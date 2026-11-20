import type { Metadata } from 'next';
import lessonData from '@/lib/narrated-lessons/bs7-sci-t1-water-cycle.json';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import { NarratedLessonPlayer } from '@/components/narrated-lessons/NarratedLessonPlayer';

export const metadata: Metadata = {
  title: 'Basic 7 Science: The Water Cycle — GAM Edu Narrated Lesson Pilot',
  description:
    'Interactive narrated science lesson for Basic 7 (JHS 1) aligned to GES/NaCCA B7.2.1.1 with Kore teacher narration, checkpoints, and Ask Teacher.',
};

export default function WaterCycleNarratedLessonPage() {
  return <NarratedLessonPlayer lesson={lessonData as unknown as NarratedLesson} />;
}
