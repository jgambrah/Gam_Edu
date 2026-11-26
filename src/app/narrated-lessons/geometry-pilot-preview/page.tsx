import { notFound } from 'next/navigation';
import { GeometryPilotPreviewClient } from './GeometryPilotPreviewClient';

export const dynamic = 'force-dynamic';

/**
 * Step 4F Preview-Only Route: fails CLOSED in production (HTTP 404).
 * Only renders in local development (`NODE_ENV === 'development'`) or Vercel Preview (`VERCEL_ENV === 'preview'`).
 */
export default function GeometryPilotPreviewPage() {
  const isLocalDev = process.env.NODE_ENV === 'development';
  const isVercelPreview = process.env.VERCEL_ENV === 'preview';

  if (!isLocalDev && !isVercelPreview) {
    notFound();
  }

  return <GeometryPilotPreviewClient />;
}
