import { notFound } from 'next/navigation';
import { ProcessStepperPilotPreviewClient } from './ProcessStepperPilotPreviewClient';

export const dynamic = 'force-dynamic';

/**
 * Preview-only Server Component gate for Step 4B's ProcessStepperEngine pilot.
 * Fails CLOSED (HTTP 404) in production and any environment where VERCEL_ENV
 * is absent or unexpected.
 */
export default function ProcessStepperPilotPreviewPage() {
  const isAllowedPreviewEnv =
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.ALLOW_STEP4B_PROCESS_PILOT === 'true';

  if (!isAllowedPreviewEnv) {
    notFound();
  }

  return <ProcessStepperPilotPreviewClient />;
}
