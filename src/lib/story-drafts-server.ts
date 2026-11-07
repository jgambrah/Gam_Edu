import { randomUUID } from 'node:crypto';
import { getAdminDb, getAdminApp } from '@/lib/firebaseAdmin';
import { getStorage } from 'firebase-admin/storage';

/**
 * Server-side safety copy of every story a teacher has paid for, so a closed tab, dropped connection or failed
 * save never loses it. Written by server code only (Admin SDK); the owner may read and delete their own drafts
 * (see firestore.rules → schools/{id}/junior_story_drafts).
 *
 *   draft doc : schools/{schoolId}/junior_story_drafts/{uid}_{requestId}
 *   cover file: schools/{schoolId}/junior_stories/drafts/{uid}_{requestId}_cover.png   (Storage)
 */
const BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'gamedu-69888475-f5783.firebasestorage.app';
const SAFE = /^[A-Za-z0-9_-]{1,128}$/;
export const DRAFT_TTL_DAYS = 30;
const MAX_COVER_BYTES = 8 * 1024 * 1024;

export function draftId(uid: string, requestId: string): string | null {
  return SAFE.test(uid) && SAFE.test(requestId) ? `${uid}_${requestId}` : null;
}
export function draftCoverPath(schoolId: string, uid: string, requestId: string): string | null {
  const id = draftId(uid, requestId);
  return id && SAFE.test(schoolId) ? `schools/${schoolId}/junior_stories/drafts/${id}_cover.png` : null;
}

/** Never throws: a failed safety copy must not turn a successful generation into an error. */
export async function saveStoryDraft(args: { schoolId: string; uid: string; requestId: string; story: unknown }): Promise<boolean> {
  try {
    const id = draftId(args.uid, args.requestId);
    if (!id || !SAFE.test(args.schoolId)) return false;
    const now = new Date();
    await getAdminDb().collection('schools').doc(args.schoolId).collection('junior_story_drafts').doc(id).set({
      uid: args.uid, schoolId: args.schoolId, requestId: args.requestId, status: 'unsaved',
      story: args.story, coverPath: null, createdAt: now,
      expiresAt: new Date(now.getTime() + DRAFT_TTL_DAYS * 86_400_000),
    }, { merge: true });
    return true;
  } catch (e: any) {
    console.error('[story-drafts] could not save draft:', e?.message || e);
    return false;
  }
}

/** Stores the cover image and links it to the draft (only if the draft exists). Never throws. */
export async function attachDraftCover(args: { schoolId: string; uid: string; requestId: string; dataUrl: string }): Promise<boolean> {
  try {
    const id = draftId(args.uid, args.requestId);
    const path = draftCoverPath(args.schoolId, args.uid, args.requestId);
    const m = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/.exec(args.dataUrl || '');
    if (!id || !path || !m) return false;
    const bytes = Buffer.from(m[2], 'base64');
    if (bytes.length === 0 || bytes.length > MAX_COVER_BYTES) return false;
    const ref = getAdminDb().collection('schools').doc(args.schoolId).collection('junior_story_drafts').doc(id);
    if (!(await ref.get()).exists) return false;
    await getStorage(getAdminApp()).bucket(BUCKET).file(path).save(bytes, {
      contentType: `image/${m[1]}`, resumable: false,
      metadata: { cacheControl: 'private, max-age=3600', metadata: { firebaseStorageDownloadTokens: randomUUID() } },
    });
    await ref.set({ coverPath: path }, { merge: true });
    return true;
  } catch (e: any) {
    console.error('[story-drafts] could not attach cover:', e?.message || e);
    return false;
  }
}
