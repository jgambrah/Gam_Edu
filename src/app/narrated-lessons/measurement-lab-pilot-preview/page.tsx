import fs from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import { MeasurementLabPilotPreviewClient } from './MeasurementLabPilotPreviewClient';

export const dynamic = 'force-dynamic';

export default function MeasurementLabPilotPreviewPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  const fixturePath = path.resolve(
    process.cwd(),
    'public/preview-fixtures/step5c-measurement-lab-pilot.json',
  );
  const lesson = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as NarratedLesson;
  return <MeasurementLabPilotPreviewClient lesson={lesson} />;
}
