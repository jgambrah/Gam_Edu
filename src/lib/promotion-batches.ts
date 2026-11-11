/**
 * Batch sizing for Student Promotion / Graduation.
 *
 * Each pupil moved makes two writes: the pupil document and a timeline entry. To approve the timeline
 * entry, the security rules look up that pupil's document, and Firestore allows at most 20 document
 * look-ups in ONE batched write (the signed-in user's own profile look-ups count too). A bigger batch is
 * refused with "Missing or insufficient permissions" — even for a Director. Keep batches small.
 */
export const PROMOTION_BATCH_SIZE = 10;

/** Splits a list into groups small enough for one promotion batch. */
export function chunkForPromotion<T>(items: T[], size: number = PROMOTION_BATCH_SIZE): T[][] {
  const safeSize = Math.max(1, Math.floor(size));
  const groups: T[][] = [];
  for (let i = 0; i < items.length; i += safeSize) groups.push(items.slice(i, i + safeSize));
  return groups;
}
