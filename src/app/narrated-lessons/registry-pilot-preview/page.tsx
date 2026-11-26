import { notFound } from 'next/navigation';
import { RegistryPilotPreviewClient } from './RegistryPilotPreviewClient';

export const dynamic = 'force-dynamic';

/**
 * Preview-only Server Component gate for Step 3's InteractiveEngineRegistry pilot.
 *
 * Fails CLOSED by default in production and any environment where `VERCEL_ENV`
 * is absent or unexpected:
 * - Allowed ONLY in local development (`NODE_ENV === 'development'`),
 *   Vercel preview builds (`VERCEL_ENV === 'preview'`), or explicit opt-in
 *   (`ALLOW_STEP3_REGISTRY_PILOT === 'true'`).
 * - Returns HTTP 404 everywhere else.
 * - Never bypasses reviewer authorisation or exposes school/student/teacher data.
 */
export default function RegistryPilotPreviewPage() {
  const isAllowedPreviewEnv =
    process.env.NODE_ENV === 'development' ||
    process.env.VERCEL_ENV === 'preview' ||
    process.env.ALLOW_STEP3_REGISTRY_PILOT === 'true';

  if (!isAllowedPreviewEnv) {
    notFound();
  }

  return <RegistryPilotPreviewClient />;
}
