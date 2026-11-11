import { describe, expect, it } from 'vitest';
import { evaluateReadiness, passingReviews, type HumanReview } from './readiness';
import { prepare } from './seeder/seeder';
import { SYNTHETIC_LICENCE } from './seeder/synthetic';
import { LIC, premiumStory, wordTrack } from './test-fixtures';
import type { StoryInput } from './seeder/types';
import { splitSentences } from './premium';
import { coverageHash } from './aspects';

function evalStory(s: StoryInput, reviews?: (a: any) => HumanReview[], extra: any = {}) {
  const p = prepare(s);
  expect(p.problems).toEqual([]);
  const { pkg } = p.buildPackage(1);
  return { p, pkg, run: (r?: HumanReview[]) => evaluateReadiness({ contentHash: p.contentHash, classification: s.classification, aspects: p.aspects, assetLicences: p.assetLicences as any, licence: SYNTHETIC_LICENCE, pkg, reviews: r ?? (reviews ? reviews(p.aspects) : []), ...extra }) };
}
const codes = (r: ReturnType<typeof evaluateReadiness>) => r.blockers.map((b) => b.code);

describe('readiness: the complete pre-verified premium story', () => {
  it('is immediately premium-ready with zero post-seed review records required', () => {
    const r = evalStory(premiumStory()).run([]);
    expect(codes(r)).toEqual([]);
    expect(r.premiumReady).toBe(true);
    expect(r.step).toBe('premium-ready');
    expect(r.facts.wordLevelSync).toBe(true);
    expect(r.pagesNeedingWork).toEqual([]);
  });
  it('also accepts explicit passing reviews when supplied', () => {
    const e = evalStory(premiumStory());
    const r = e.run(passingReviews(e.p.aspects));
    expect(r.premiumReady).toBe(true);
    expect(r.step).toBe('premium-ready');
  });
});

describe('readiness: each missing mandatory technical element blocks premium', () => {
  it('missing illustration/alt text', () => {
    const s = premiumStory(); (s.pages[1] as any).alt = undefined;
    const r = evalStory(s).run();
    expect(codes(r)).toContain('missing-alt-text'); expect(r.premiumReady).toBe(false); expect(r.pagesNeedingWork).toEqual([2]);
  });
  it('missing narration names the page', () => {
    const s = premiumStory(); delete (s.pages[2] as any).audio; delete (s.pages[2] as any).timing;
    const r = evalStory(s).run();
    expect(codes(r)).toContain('missing-narration'); expect(r.pagesNeedingWork).toEqual([3]); expect(r.steps.narrated).toBe(false);
  });
  it('estimated or unverified timing never satisfies premium', () => {
    const s = premiumStory();
    (s.pages[0] as any).timing = wordTrack(s.pages[0].text, 15000, { verified: false });
    (s.pages[1] as any).timing = { granularity: 'sentence', method: 'estimated', verified: true, sentences: splitSentences(s.pages[1].text).map((_, i) => [i * 7000, i * 7000 + 6000]) };
    const r = evalStory(s).run();
    expect(r.blockers.filter((b) => b.code === 'timing-unverified' || b.code === 'timing-unusable').map((b) => b.page).sort()).toEqual([1, 2]);
    expect(r.premiumReady).toBe(false);
  });
  it('bad word timing falls back to verified sentence timing with a warning, never claiming word sync', () => {
    const s = premiumStory();
    const t = wordTrack(s.pages[0].text, 15000); t.words = t.words!.slice(1);
    (s.pages[0] as any).timing = t;
    const r = evalStory(s).run();
    expect(r.facts.wordLevelSync).toBe(false);
    expect(r.warnings.map((w) => w.code)).toContain('word-timing-rejected');
  });
  it('no activities, too few types, no comprehension, objective without practice', () => {
    expect(codes(evalStory(premiumStory({ activities: [] })).run())).toEqual(expect.arrayContaining(['too-few-activities', 'no-comprehension']));
    const s = premiumStory({ classification: { ...premiumStory().classification!, objectives: ['phonics'] } as any });
    expect(codes(evalStory(s).run())).toContain('objective-without-practice');
  });
  it('glossary required at reading levels that need it', () => {
    const c = { ...premiumStory().classification!, readingLevel: 'early' } as any;
    expect(codes(evalStory(premiumStory({ glossary: [], classification: c })).run())).toContain('glossary-too-small');
    expect(codes(evalStory(premiumStory({ glossary: [] })).run())).not.toContain('glossary-too-small');
  });
  it('missing licence records block (story, asset, music)', () => {
    const s = premiumStory(); (s.pages[0].image as any).licence = undefined;
    expect(codes(evalStory(s).run())).toContain('asset-without-licence');
    const e = evalStory(premiumStory());
    const r = evaluateReadiness({ contentHash: e.p.contentHash, classification: premiumStory().classification, aspects: e.p.aspects, assetLicences: e.p.assetLicences as any, licence: {}, pkg: e.pkg, reviews: [] });
    expect(codes(r)).toContain('no-story-licence');
  });
  it('expired licences block', () => {
    const s = premiumStory(); (s.pages[0].image as any).licence = { ...LIC, expiresAt: '2000-01-01T00:00:00.000Z' };
    expect(codes(evalStory(s).run())).toContain('asset-licence-expired');
  });
  it('a missing asset file in storage blocks', () => {
    const r = evalStory(premiumStory(), undefined, { assetExists: () => false }).run();
    expect(codes(r)).toContain('asset-missing');
  });
  it('unclassified and personal data in text block', () => {
    expect(codes(evalStory(premiumStory({ classification: undefined })).run())).toContain('unclassified');
    const s = premiumStory(); s.pages[0] = { ...s.pages[0], text: s.pages[0].text + ' Call 0244123456 or mail a@b.com.' };
    expect(codes(evalStory(s).run())).toContain('personal-data');
  });
  it('content hash mismatch blocks', () => {
    const e = evalStory(premiumStory());
    const r = evaluateReadiness({ contentHash: 'sha256:' + '0'.repeat(64), classification: premiumStory().classification, aspects: e.p.aspects, assetLicences: e.p.assetLicences as any, licence: SYNTHETIC_LICENCE, pkg: e.pkg, reviews: [] });
    expect(codes(r)).toContain('content-mismatch');
  });
});

describe('readiness: optional diagnostic reviews', () => {
  it('an explicit failed review still flags review-failed; a later pass clears it', () => {
    const e = evalStory(premiumStory());
    const reviews = passingReviews(e.p.aspects).map((r) => (r.type === 'cultural' ? { ...r, outcome: 'needs-work' as const } : r));
    expect(codes(e.run(reviews))).toEqual(['review-failed']);
    const fixed = [...reviews, { ...reviews[0], type: 'cultural' as const, outcome: 'pass' as const, coverage: coverageHash('cultural', e.p.aspects), at: 5 }];
    expect(e.run(fixed).premiumReady).toBe(true);
  });
  it('when explicit reviews are supplied, changing one page marks only covered reviews stale', () => {
    const before = evalStory(premiumStory());
    const reviews = passingReviews(before.p.aspects);
    const s = premiumStory(); (s.pages[1] as any).alt = 'A different picture description';
    const after = evalStory(s);
    const r = after.run(reviews);
    const stale = Object.entries(r.reviews).filter(([, v]) => v === 'stale').map(([k]) => k);
    expect(stale.length).toBeGreaterThan(0);
    expect(stale.length).toBeLessThan(7);
    expect(r.premiumReady).toBe(false);
  });
});
