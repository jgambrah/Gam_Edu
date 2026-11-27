import fs from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
import type { NarratedLesson } from '@/lib/narrated-lessons/types';
import { MathEvaluatorPilotPreviewClient } from './MathEvaluatorPilotPreviewClient';

export const dynamic = 'force-dynamic';

/**
 * Step 5A Preview-Only Route: fails CLOSED in production (HTTP 404).
 * Only renders in local development (`NODE_ENV === 'development'`) or Vercel Preview (`VERCEL_ENV === 'preview'`).
 * Loads the fixture directly on the server so preview rendering never depends on a client `/preview-fixtures/` fetch.
 */
export default function MathEvaluatorPilotPreviewPage() {
  const isLocalDev = process.env.NODE_ENV === 'development';
  const isVercelPreview = process.env.VERCEL_ENV === 'preview';

  if (!isLocalDev && !isVercelPreview) {
    notFound();
  }

  const fixturePath = path.join(process.cwd(), 'public', 'preview-fixtures', 'step5a-math-evaluator-pilot.json');
  const initialLesson = JSON.parse(fs.readFileSync(fixturePath, 'utf8')) as NarratedLesson;

  return <MathEvaluatorPilotPreviewClient initialLesson={initialLesson} />;
}
