/**
 * The school a signed-in person is working in is remembered in this browser (so pages open instantly).
 * It must belong to THAT person: before, it outlived sign-out, so after the platform owner signed in with a
 * school's staff login to help them, the owner's own account kept opening that school for days.
 *
 * - The remembered school carries the uid of the account that chose it (gam_school_owner).
 * - Signing out, or a different account signing in, forgets it (and the cached role/profile).
 */
export const SCHOOL_KEYS = ['gam_school_id', 'selected_school_id'] as const;
const OWNER_KEY = 'gam_school_owner';

/** The remembered school, only if it was chosen by `uid`. */
export function storedSchoolFor(uid: string | null | undefined): string | null {
  if (typeof window === 'undefined' || !uid) return null;
  try {
    const owner = localStorage.getItem(OWNER_KEY);
    if (owner !== uid) return null; // chosen by another account (or before owners were recorded)
    return localStorage.getItem('gam_school_id') || localStorage.getItem('selected_school_id') || null;
  } catch { return null; }
}

export function rememberSchool(uid: string | null | undefined, schoolId: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (schoolId && uid) {
      SCHOOL_KEYS.forEach(k => localStorage.setItem(k, schoolId));
      localStorage.setItem(OWNER_KEY, uid);
    } else {
      SCHOOL_KEYS.forEach(k => localStorage.removeItem(k));
      localStorage.removeItem(OWNER_KEY);
    }
  } catch { /* storage unavailable */ }
}

/** Forget everything tied to the previous account in this browser. */
export function clearSessionForAccountChange(): void {
  if (typeof window === 'undefined') return;
  try {
    SCHOOL_KEYS.forEach(k => localStorage.removeItem(k));
    localStorage.removeItem(OWNER_KEY);
  } catch { /* ignore */ }
  try {
    sessionStorage.removeItem('gam_cached_role');
    sessionStorage.removeItem('gam_cached_profile');
    sessionStorage.removeItem('gam_cached_uid');
  } catch { /* ignore */ }
}
