import { notFound } from 'next/navigation';
import { RegistryPilotPreviewClient } from './RegistryPilotPreviewClient';

export const dynamic = 'force-dynamic';

/**
 * Preview-only Server Component gate for Step 3's InteractiveEngineRegistry pilot.
 *
 * - Automatically returns HTTP 404 in Vercel production (`VERCEL_ENV === 'production'`)
 *   unless explicitly opted in via `ALLOW_STEP3_REGISTRY_PILOT=true`.
 * - Remains accessible on Vercel preview deployments (`VERCEL_ENV === 'preview'`)
 *   and local development for regression testing.
 * - Never bypasses reviewer authorisation or exposes school/student/teacher data.
 */
export default function RegistryPilotPreviewPage() {
  if (
    process.env.VERCEL_ENV === 'production' &&
    process.env.ALLOW_STEP3_REGISTRY_PILOT !== 'true'
  ) {
    notFound();
  }

  return <RegistryPilotPreviewClient />;
}
