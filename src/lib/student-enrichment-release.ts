/**
 * GAM EDU — Student Enrichment Under-Construction Release Gate (Pure Policy Module)
 *
 * Controls UI route access to Student Enrichment routes while the programme is
 * under construction awaiting the owner's official release authorisation.
 *
 * Architecture & Security Boundaries:
 * - Zero extra Firestore reads/writes. Relies strictly on trusted `RoleContext`
 *   roles (`Director`, `Administrator`, `Teacher` — where `RoleContext` already
 *   resolves Super Admin accounts to `Director`).
 * - Zero hardcoded owner emails, UIDs, or reviewer email lists in public client
 *   bundles or authoring documentation.
 * - Fails closed when unauthenticated (`isAuthenticated === false`) or while
 *   authentication/role state is loading.
 * - Release-control notice: Client-side route gating is a release-control mechanism,
 *   NOT a substitute for server-side authorisation. Protected school/student
 *   assessment records remain guarded by Firebase Auth + Firestore Security Rules,
 *   whereas public static CDN lesson assets remain publicly fetchable if a direct
 *   CDN URL is known.
 * - Build-time env var notice: `NEXT_PUBLIC_STUDENT_ENRICHMENT_RELEASED` is inlined
 *   at Next.js build time. Changing it in Vercel requires a NEW build and deployment;
 *   promoting an older build does not apply updated `NEXT_PUBLIC_*` variables.
 */

export type StudentEnrichmentReleaseStatus = 'under-construction' | 'released';

export type StudentEnrichmentAccessReason =
  | 'released'
  | 'authorized-role'
  | 'loading-fail-closed'
  | 'restricted-under-construction';

export interface StudentEnrichmentAccessInput {
  role: string | null | undefined;
  isAuthenticated: boolean;
  isLoading?: boolean;
  /** Optional override for deterministic unit testing. */
  releaseStatusOverride?: StudentEnrichmentReleaseStatus;
}

export interface StudentEnrichmentAccessDecision {
  allowed: boolean;
  status: StudentEnrichmentReleaseStatus;
  reason: StudentEnrichmentAccessReason;
}

/** Trusted school-staff roles authorised to access & review Student Enrichment while under construction. */
export const AUTHORIZED_UNDER_CONSTRUCTION_ROLES: ReadonlySet<string> = new Set([
  'Director',
  'Administrator',
  'Teacher',
]);

/**
 * Single owner-controlled release switch (default: 'under-construction').
 * To release officially to students, set `NEXT_PUBLIC_STUDENT_ENRICHMENT_RELEASED=true`
 * in Vercel Production environment variables, trigger a NEW build, and promote it.
 */
export function getStudentEnrichmentReleaseStatus(
  override?: StudentEnrichmentReleaseStatus,
): StudentEnrichmentReleaseStatus {
  if (override) return override;
  return process.env.NEXT_PUBLIC_STUDENT_ENRICHMENT_RELEASED === 'true'
    ? 'released'
    : 'under-construction';
}

export function evaluateStudentEnrichmentAccess(
  input: StudentEnrichmentAccessInput,
): StudentEnrichmentAccessDecision {
  const status = getStudentEnrichmentReleaseStatus(input.releaseStatusOverride);
  if (status === 'released') {
    return { allowed: true, status, reason: 'released' };
  }

  // Always fail closed while auth or role state is loading
  if (input.isLoading) {
    return { allowed: false, status, reason: 'loading-fail-closed' };
  }

  // Never trust a cached/stale role when unauthenticated
  if (!input.isAuthenticated) {
    return { allowed: false, status, reason: 'restricted-under-construction' };
  }

  if (input.role && AUTHORIZED_UNDER_CONSTRUCTION_ROLES.has(input.role)) {
    return { allowed: true, status, reason: 'authorized-role' };
  }

  return { allowed: false, status, reason: 'restricted-under-construction' };
}
