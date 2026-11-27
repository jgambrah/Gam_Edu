import { notFound } from 'next/navigation';
import { MathEvaluatorPilotPreviewClient } from './MathEvaluatorPilotPreviewClient';

export const dynamic = 'force-dynamic';

/**
 * Step 5A Preview-Only Route: fails CLOSED in production (HTTP 404).
 * Only renders in local development (`NODE_ENV === 'development'`) or Vercel Preview (`VERCEL_ENV === 'preview'`).
 */
export default function MathEvaluatorPilotPreviewPage() {
  const isLocalDev = process.env.NODE_ENV === 'development';
  const isVercelPreview = process.env.VERCEL_ENV === 'preview';

  if (!isLocalDev && !isVercelPreview) {
    notFound();
  }

  return <MathEvaluatorPilotPreviewClient />;
}
