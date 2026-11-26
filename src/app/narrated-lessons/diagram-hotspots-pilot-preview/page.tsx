import { notFound } from 'next/navigation';
import { DiagramHotspotsPilotPreviewClient } from './DiagramHotspotsPilotPreviewClient';

export const dynamic = 'force-dynamic';

/**
 * Preview-only Server Component gate for Step 4C's DiagramHotspotsEngine pilot.
 * Fails CLOSED (HTTP 404) in production and any environment where VERCEL_ENV
 * is absent or unexpected.
 */
export default function DiagramHotspotsPilotPreviewPage() {
  const isAllowedPreviewEnv =
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.ALLOW_STEP4C_DIAGRAM_PILOT === 'true';

  if (!isAllowedPreviewEnv) {
    notFound();
  }

  return <DiagramHotspotsPilotPreviewClient />;
}
