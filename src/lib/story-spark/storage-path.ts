/**
 * Where a story's cover illustration is stored.
 *
 * The old path (`junior_stories/…`) is not covered by any rule in storage.rules, so every upload was
 * denied and the illustration was silently dropped. `schools/{schoolId}/…` is covered, so using it fixes
 * the save without needing a rules deploy.
 *
 * Returns null when a path can't be built safely (no school, no user, or an id that isn't a plain id),
 * so callers must handle "no illustration saved" explicitly rather than guessing a path.
 */
const SAFE_ID = /^[A-Za-z0-9_-]{1,128}$/;

export function buildStoryCoverPath(
  schoolId: string | null | undefined,
  uid: string | null | undefined,
  now: number = Date.now(),
): string | null {
  if (!schoolId || !uid) return null;
  if (!SAFE_ID.test(schoolId) || !SAFE_ID.test(uid)) return null;
  return `schools/${schoolId}/junior_stories/${uid}_${now}_cover.png`;
}
