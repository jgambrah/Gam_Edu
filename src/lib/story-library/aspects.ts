/**
 * Aspect hashes (Stage 3). SERVER/IMPORT-SIDE ONLY (uses node:crypto via the seeder's hash helpers).
 *
 * A story is reviewed by aspect (text, illustrations, narration, timing, cultural, educational, licensing). Each review is
 * bound to the hash of the aspect(s) it covers. Targeted correction therefore works naturally: regenerate one page's
 * illustration and ONLY `images` changes, so only the illustration (and cultural) reviews must be repeated; the text,
 * narration and timing reviews stay valid. Assets are content-addressed, so unchanged pages cost nothing to re-store.
 */
import { canonicalJson, sha256Tag } from './seeder/hash';
import type { StoryPackage } from './types';

export const ASPECTS = ['text', 'images', 'audio', 'timing', 'activities', 'licence'] as const;
export type Aspect = (typeof ASPECTS)[number];
export type AspectHashes = Record<Aspect, string>;

export function aspectHashes(pkg: StoryPackage, assetLicences: Record<string, unknown> = {}): AspectHashes {
  const h = (v: unknown) => sha256Tag(canonicalJson(v));
  return {
    text: h({ title: pkg.title, pages: pkg.pages.map((p) => ({ text: p.text, sentences: p.sentences ?? null })) }),
    images: h(pkg.pages.map((p) => [p.image ?? null, p.alt ?? null])),
    audio: h({ pages: pkg.pages.map((p) => p.audio?.hash ?? null), music: pkg.music ?? null }),
    timing: h(pkg.pages.map((p) => (p.audio ? { d: p.audio.durationMs, t: p.audio.timing ?? null } : null))),
    activities: h({ activities: pkg.activities ?? [], glossary: pkg.glossary ?? [] }),
    licence: h(assetLicences),
  };
}

/** The human reviews required before publication, and the aspects each one covers. */
export const REVIEW_TYPES = ['text', 'illustrations', 'narration', 'timing', 'cultural', 'educational', 'licensing'] as const;
export type ReviewType = (typeof REVIEW_TYPES)[number];

export const REVIEW_COVERS: Record<ReviewType, Aspect[]> = {
  text: ['text'],
  illustrations: ['images'],
  narration: ['audio'],
  timing: ['audio', 'timing'],
  cultural: ['text', 'images'],
  educational: ['text', 'activities'],
  licensing: ['licence'],
};

/** A single hash identifying exactly what a review covered (changes iff any covered aspect changes). */
export function coverageHash(type: ReviewType, aspects: AspectHashes): string {
  return sha256Tag(canonicalJson(REVIEW_COVERS[type].map((a) => [a, aspects[a]])));
}
