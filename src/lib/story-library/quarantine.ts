/**
 * 48-Hour Developer Review Quarantine for Story Spark Library.
 *
 * Pure module (zero Firebase / Node imports) so it is safe inside `/story-spark-preview`'s
 * isolated client import graph (`preview-isolation.test.ts`).
 *
 * Workflow:
 *   1. Newly seeded / newly published stories receive `publishedAt = now` and
 *      `releaseAt = now + REVIEW_QUARANTINE_MS` (48 hours).
 *   2. While `now < releaseAt` OR when held (`reviewHold === true` / in `heldKeys`),
 *      the story is visible ONLY when the signed-in user's email is `jamesgambrah@gmail.com`.
 *   3. Once `now >= releaseAt` (and the story has not been held/flagged), it automatically
 *      appears in the general repository for every reader and school with zero cron jobs.
 *   4. Legacy stories without `releaseAt` remain immediately visible to everyone.
 */
import type { CatalogueEntry } from './types';

export const DEVELOPER_REVIEWER_EMAIL = 'jamesgambrah@gmail.com';
export const REVIEW_QUARANTINE_HOURS = 48;
export const REVIEW_QUARANTINE_MS = REVIEW_QUARANTINE_HOURS * 60 * 60 * 1000; // 172_800_000 ms

/** Legacy stories up to sortKey 228 (Batches 1–32) predate the quarantine rollout and stay public. */
export const LEGACY_PUBLIC_MAX_SORT_KEY = 228;

const LOCAL_OVERRIDES_KEY = 'story-spark:review-overrides:v1';
const LOCAL_VIEWER_EMAIL_KEY = 'story-spark:viewer-email:v1';

export interface ReviewOverrides {
  /** Story keys held/flagged by the developer so they do NOT auto-release when 48h expires. */
  heldKeys: string[];
  /** Story keys explicitly approved early by the developer before the 48h window ends. */
  approvedKeys: string[];
  updatedAt?: number;
}

export interface StoryQuarantineStatus {
  /** True if hidden from general readers/schools (either still within 48h window or held). */
  isQuarantined: boolean;
  /** True if explicitly held/flagged from public release by the developer. */
  isHeld: boolean;
  /** True if currently inside the initial 48-hour review window (and not early-approved). */
  inWindow: boolean;
  /** True if early-promoted to public before `releaseAt` elapsed. */
  isApprovedEarly: boolean;
  /** Milliseconds remaining until auto-promotion (`0` once expired or early-approved). */
  remainingMs: number;
  releaseAt?: number;
}

export function isDeveloperReviewer(email?: string | null): boolean {
  return typeof email === 'string' && email.trim().toLowerCase() === DEVELOPER_REVIEWER_EMAIL;
}

export function getStoryQuarantineStatus(
  entry: Pick<CatalogueEntry, 'storyKey' | 'releaseAt' | 'reviewHold'>,
  opts?: {
    nowMs?: number;
    heldKeys?: ReadonlySet<string>;
    approvedKeys?: ReadonlySet<string>;
  },
): StoryQuarantineStatus {
  const nowMs = opts?.nowMs ?? Date.now();
  const isApprovedEarly = opts?.approvedKeys?.has(entry.storyKey) ?? false;
  const isHeld = opts?.heldKeys
    ? opts.heldKeys.has(entry.storyKey)
    : Boolean(entry.reviewHold) && !isApprovedEarly;
  const releaseAt =
    typeof entry.releaseAt === 'number' && Number.isFinite(entry.releaseAt) ? entry.releaseAt : undefined;
  const inWindow = !isApprovedEarly && releaseAt !== undefined && releaseAt > nowMs;
  const remainingMs = inWindow && releaseAt !== undefined ? Math.max(0, releaseAt - nowMs) : 0;

  return {
    isQuarantined: isHeld || inWindow,
    isHeld,
    inWindow,
    isApprovedEarly,
    remainingMs,
    releaseAt,
  };
}

export function isStoryVisibleToViewer(
  entry: Pick<CatalogueEntry, 'storyKey' | 'status' | 'releaseAt' | 'reviewHold'>,
  opts?: {
    viewerEmail?: string | null;
    nowMs?: number;
    heldKeys?: ReadonlySet<string>;
    approvedKeys?: ReadonlySet<string>;
  },
): boolean {
  if (entry.status !== 'published') return false;
  const status = getStoryQuarantineStatus(entry, opts);
  if (!status.isQuarantined) return true;
  return isDeveloperReviewer(opts?.viewerEmail);
}

export function formatQuarantineBadge(status: StoryQuarantineStatus): string {
  if (status.isHeld) return '🚩 Held from Release';
  if (status.inWindow) {
    const hours = Math.max(1, Math.ceil(status.remainingMs / (60 * 60 * 1000)));
    return `⏳ Under Review • ${hours}h left`;
  }
  return '';
}

export function loadLocalReviewOverrides(): ReviewOverrides {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return { heldKeys: [], approvedKeys: [] };
  }
  try {
    const raw = localStorage.getItem(LOCAL_OVERRIDES_KEY);
    if (!raw) return { heldKeys: [], approvedKeys: [] };
    const parsed = JSON.parse(raw) as Partial<ReviewOverrides>;
    return {
      heldKeys: Array.isArray(parsed.heldKeys) ? parsed.heldKeys.filter((x): x is string => typeof x === 'string') : [],
      approvedKeys: Array.isArray(parsed.approvedKeys)
        ? parsed.approvedKeys.filter((x): x is string => typeof x === 'string')
        : [],
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : undefined,
    };
  } catch {
    return { heldKeys: [], approvedKeys: [] };
  }
}

export function saveLocalReviewOverrides(overrides: ReviewOverrides): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(
      LOCAL_OVERRIDES_KEY,
      JSON.stringify({
        heldKeys: [...new Set(overrides.heldKeys)],
        approvedKeys: [...new Set(overrides.approvedKeys)],
        updatedAt: overrides.updatedAt ?? Date.now(),
      }),
    );
  } catch {
    /* ignore quota errors */
  }
}

export function loadCachedViewerEmail(): string | null {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return null;
  try {
    const v = localStorage.getItem(LOCAL_VIEWER_EMAIL_KEY);
    return v && v.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}

export function saveCachedViewerEmail(email: string | null): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    if (email && email.trim()) {
      localStorage.setItem(LOCAL_VIEWER_EMAIL_KEY, email.trim());
    } else {
      localStorage.removeItem(LOCAL_VIEWER_EMAIL_KEY);
    }
  } catch {
    /* ignore storage errors */
  }
}

