import { notFound } from 'next/navigation';
import { AtomBondPilotPreviewClient } from './AtomBondPilotPreviewClient';

export const dynamic = 'force-dynamic';

/**
 * Step 4E Preview-Only Route: fails CLOSED in production (HTTP 404).
 * Only renders in local development (`NODE_ENV === 'development'`) or Vercel Preview (`VERCEL_ENV === 'preview'`).
 */
export default function AtomBondPilotPreviewPage() {
  const isLocalDev = process.env.NODE_ENV === 'development';
  const isVercelPreview = process.env.VERCEL_ENV === 'preview';

  if (!isLocalDev && !isVercelPreview) {
    notFound();
  }

  return <AtomBondPilotPreviewClient />;
}
