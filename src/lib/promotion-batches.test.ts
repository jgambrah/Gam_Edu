import { describe, it, expect } from 'vitest';
import { PROMOTION_BATCH_SIZE, chunkForPromotion } from './promotion-batches';

describe('Promotion / graduation batches', () => {
  it('keeps each batch within the Firestore limit of 20 rule look-ups (pupils + the signed-in user\'s profile)', () => {
    // Up to 4 look-ups can be spent on the signed-in user's own profile documents.
    expect(PROMOTION_BATCH_SIZE + 4).toBeLessThanOrEqual(20);
  });

  it('USE CASE: a final-year class of 45 is split into small batches with nobody left out or repeated', () => {
    const pupils = Array.from({ length: 45 }, (_, i) => `pupil-${i + 1}`);
    const groups = chunkForPromotion(pupils);
    expect(groups.every(g => g.length <= PROMOTION_BATCH_SIZE)).toBe(true);
    expect(groups.flat()).toEqual(pupils);
  });

  it('handles an empty class, a single pupil and a bad size', () => {
    expect(chunkForPromotion([])).toEqual([]);
    expect(chunkForPromotion(['a'])).toEqual([['a']]);
    expect(chunkForPromotion(['a', 'b'], 0)).toEqual([['a'], ['b']]);
  });
});
