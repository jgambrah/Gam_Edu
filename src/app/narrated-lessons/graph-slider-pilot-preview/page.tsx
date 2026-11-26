import { notFound } from 'next/navigation';
import { GraphSliderPilotPreviewClient } from './GraphSliderPilotPreviewClient';

export const dynamic = 'force-dynamic';

/**
 * Preview-only Server Component gate for Step 4A's GraphSliderEngine pilot.
 * Fails CLOSED (HTTP 404) in production and any environment where VERCEL_ENV
 * is absent or unexpected.
 */
export default function GraphSliderPilotPreviewPage() {
  const isAllowedPreviewEnv =
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.ALLOW_STEP4A_GRAPH_PILOT === 'true';

  if (!isAllowedPreviewEnv) {
    notFound();
  }

  return <GraphSliderPilotPreviewClient />;
}
