/**
 * GAM EDU — Student Enrichment Under-Construction Release Gate (Pure Policy Module)
 *
 * Controls access to Student Enrichment routes (/dashboard/narrated-lessons/*,
 * /dashboard/coding-club/*, /narrated-lessons/*) while the programme is under
 * construction awaiting the owner's official release authorisation.
 *
 * Zero Firestore reads/writes. Reuses existing Firebase Auth + RoleContext.
 *
 * Security / Scope Honesty Note:
 * - Protects all Student Enrichment UI routes and interactive preview routes against
 *   ordinary student/parent/unauthenticated access (including direct URL navigation).
 * - Public static CDN learning assets (e.g. cdn.gam-it-service.app JSON/images/audio)
 *   remain publicly fetchable by direct CDN URL if known; protected school/student
 *   assessment and gradebook data remain guarded by Firebase Auth + Firestore Rules.
 */

export type StudentEnrichmentReleaseStatus = 'under-construction' | 'released';

export type StudentEnrichmentAccessReason =
  | 'released'
  | 'super-admin'
  | 'authorized-role'
  | 'designated-reviewer'
  | 'restricted-under-construction';

export interface StudentEnrichmentAccessInput {
  role: string | null | undefined;
  email?: string | null;
  uid?: string | null;
  /** Optional override for deterministic unit testing. */
  releaseStatusOverride?: StudentEnrichmentReleaseStatus;
  /** Optional override for comma-separated designated reviewer emails in tests. */
  reviewerEmailsOverride?: string;
}

export interface StudentEnrichmentAccessDecision {
  allowed: boolean;
  status: StudentEnrichmentReleaseStatus;
  reason: StudentEnrichmentAccessReason;
}

export const SUPER_ADMIN_EMAIL = 'jamesgambrah@gmail.com';
export const SUPER_ADMIN_UID = 'L4oE5XWweKRYrhtIXn6hB8IDHBC2';

/** Roles authorised to access and review Student Enrichment while under construction. */
export const AUTHORIZED_UNDER_CONSTRUCTION_ROLES: ReadonlySet<string> = new Set([
  'Director',
  'Administrator',
  'Teacher',
]);

/**
 * Single owner-controlled release switch:
 * Set `NEXT_PUBLIC_STUDENT_ENRICHMENT_RELEASED=true` in Vercel Production env vars
 * (and redeploy/promote) when the owner authorises official student release.
 */
export function getStudentEnrichmentReleaseStatus(
  override?: StudentEnrichmentReleaseStatus,
): StudentEnrichmentReleaseStatus {
  if (override) return override;
  return process.env.NEXT_PUBLIC_STUDENT_ENRICHMENT_RELEASED === 'true'
    ? 'released'
    : 'under-construction';
}

function parseReviewerEmails(raw?: string): Set<string> {
  const source = raw ?? process.env.NEXT_PUBLIC_STUDENT_ENRICHMENT_REVIEWER_EMAILS ?? '';
  const out = new Set<string>();
  for (const part of source.split(',')) {
    const cleaned = part.trim().toLowerCase();
    if (cleaned) out.add(cleaned);
  }
  return out;
}

export function evaluateStudentEnrichmentAccess(
  input: StudentEnrichmentAccessInput,
): StudentEnrichmentAccessDecision {
  const status = getStudentEnrichmentReleaseStatus(input.releaseStatusOverride);
  if (status === 'released') {
    return { allowed: true, status, reason: 'released' };
  }

  const normalizedEmail = (input.email ?? '').trim().toLowerCase();
  if (normalizedEmail === SUPER_ADMIN_EMAIL || input.uid === SUPER_ADMIN_UID) {
    return { allowed: true, status, reason: 'super-admin' };
  }

  if (input.role && AUTHORIZED_UNDER_CONSTRUCTION_ROLES.has(input.role)) {
    return { allowed: true, status, reason: 'authorized-role' };
  }

  if (normalizedEmail) {
    const reviewers = parseReviewerEmails(input.reviewerEmailsOverride);
    if (reviewers.has(normalizedEmail)) {
      return { allowed: true, status, reason: 'designated-reviewer' };
    }
  }

  return { allowed: false, status, reason: 'restricted-under-construction' };
}
