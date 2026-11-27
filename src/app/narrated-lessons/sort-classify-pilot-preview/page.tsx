import fs from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import { SortClassifyPilotPreviewClient } from './SortClassifyPilotPreviewClient';

export const dynamic = 'force-dynamic';

/**
 * Step 5B Preview-Only Route: fails CLOSED in production (HTTP 404).
 */
export default function SortClassifyPilotPreviewPage() {
  const isLocalDev = process.env.NODE_ENV === 'development';
  const isVercelPreview = process.env.VERCEL_ENV === 'preview';

  if (!isLocalDev && !isVercelPreview) {
    notFound();
  }

  const fixturePath = path.join(process.cwd(), 'public', 'preview-fixtures', 'step5b-sort-classify-pilot.json');
  const initialLesson = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as NarratedLesson;
  return <SortClassifyPilotPreviewClient initialLesson={initialLesson} />;
}
