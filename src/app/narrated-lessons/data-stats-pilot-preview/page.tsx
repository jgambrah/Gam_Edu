import fs from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import { DataStatsPilotPreviewClient } from './DataStatsPilotPreviewClient';

export const dynamic = 'force-dynamic';

export default function DataStatsPilotPreviewPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }
  const fixturePath = path.resolve(
    process.cwd(),
    'public/preview-fixtures/step5d-data-stats-pilot.json',
  );
  const lesson = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as NarratedLesson;
  return <DataStatsPilotPreviewClient lesson={lesson} />;
}
