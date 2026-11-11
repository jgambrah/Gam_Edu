/**
 * Premium-content readiness (Stage 3F — Instant Pre-Verified Approval). SERVER/IMPORT-SIDE ONLY.
 *
 * Readiness answers "is this story COMPLETE and TECHNICALLY CHECKED?". Stories are verified prior to seeding, so
 * separate post-seed human review records are NOT required: any complete story that passes automated structural,
 * classification, media, timing, activity, glossary and licence checks is immediately `premiumReady: true`.
 */
import { errorsOf, validateClassification, type Classification } from './classification';
import { effectiveHighlight, tokenize } from './premium';
import { validateStoryPackage } from './validate';
import { coverageHash, REVIEW_TYPES, type AspectHashes, type ReviewType } from './aspects';
import type { StoryPackage } from './types';

export interface HumanReview {
  type: ReviewType;
  outcome: 'pass' | 'fail' | 'needs-work';
  reviewer: string;
  /** `coverageHash(type, aspects)` at the time of review: what exactly the reviewer looked at. */
  coverage: string;
  at: number;
  notes?: string;
}

export interface AssetLicenceRecord { source: string; licenseId: string; territory?: string; expiresAt?: string }

export interface ReadinessInput {
  contentHash: string;
  classification?: Classification | null;
  /** Aspect hashes recorded by the importer for the current version. */
  aspects: AspectHashes;
  assetLicences?: Record<string, AssetLicenceRecord>;
  /** Story-level licence. */
  licence?: { source?: string; licenseId?: string; expiresAt?: string };
  pkg: StoryPackage;
  reviews?: HumanReview[];
  /** Optional technical check that each asset file really exists in storage. */
  assetExists?: (publishedPath: string) => boolean;
  now?: number;
}

export interface Blocker { code: string; message: string; page?: number }
export type ReadinessStep = 'imported' | 'classified' | 'illustrated' | 'narrated' | 'interactive' | 'checked' | 'premium-ready';
export const READINESS_STEPS: readonly ReadinessStep[] = ['imported', 'classified', 'illustrated', 'narrated', 'interactive', 'checked', 'premium-ready'];

export type ReviewState = 'pass' | 'missing' | 'stale' | 'fail';

export interface ReadinessResult {
  contentHash: string;
  premiumReady: boolean;
  /** Highest step reached with every earlier step satisfied. */
  step: ReadinessStep;
  steps: Record<ReadinessStep, boolean>;
  blockers: Blocker[];
  warnings: Blocker[];
  reviews: Record<ReviewType, ReviewState>;
  facts: {
    pageCount: number; pagesWithImage: number; pagesWithAlt: number; pagesWithNarration: number;
    pagesWordLevel: number; pagesSentenceLevel: number; wordLevelSync: boolean;
    activityCount: number; activityTypes: string[]; glossaryCount: number; hasMusic: boolean;
    narrationMs: number; assetBytes: number;
  };
  /** The pages that need work, so a correction can target them instead of regenerating the story. */
  pagesNeedingWork: number[];
}

/** Objectives whose practice must be backed by at least one activity of the mapped type. */
export const OBJECTIVE_NEEDS_ACTIVITY: Record<string, string> = {
  phonics: 'phonics', vocabulary: 'vocabulary', 'reading-comprehension': 'comprehension', sequencing: 'sequencing', prediction: 'prediction',
};
const LEVELS_NEEDING_GLOSSARY = new Set(['early', 'developing', 'fluent']);
export const MIN_ACTIVITIES = 3;
export const MIN_ACTIVITY_TYPES = 2;
const PERSONAL_DATA = /([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|https?:\/\/|www\.|(?:\+?\d[\d\s().-]{8,}\d))/i;

export function evaluateReadiness(input: ReadinessInput): ReadinessResult {
  const { pkg } = input;
  const now = input.now ?? Date.now();
  const blockers: Blocker[] = [];
  const warnings: Blocker[] = [];
  const block = (code: string, message: string, page?: number) => blockers.push({ code, message, ...(page ? { page } : {}) });
  const warn = (code: string, message: string, page?: number) => warnings.push({ code, message, ...(page ? { page } : {}) });
  const needsWork = new Set<number>();
  const stepBlockers: Record<ReadinessStep, number> = { imported: 0, classified: 0, illustrated: 0, narrated: 0, interactive: 0, checked: 0, 'premium-ready': 0 };
  const b = (step: ReadinessStep, code: string, message: string, page?: number) => { block(code, message, page); stepBlockers[step]++; if (page) needsWork.add(page); };

  // ---- imported: the package is structurally valid and is the content the admin record describes
  for (const p of validateStoryPackage(pkg)) b('imported', 'package-invalid', `${p.path}: ${p.message}`);
  if (pkg.contentHash !== input.contentHash) b('imported', 'content-mismatch', 'package content hash differs from the recorded content hash');
  const text = pkg.pages.map((p) => p.text).join(' ') + ' ' + pkg.title;
  if (PERSONAL_DATA.test(text)) b('imported', 'personal-data', 'story text contains something that looks like an email address, phone number or link');

  // ---- classified
  if (!input.classification) b('classified', 'unclassified', 'no classification');
  else {
    for (const i of errorsOf(validateClassification(input.classification))) b('classified', 'classification-invalid', `${i.path}: ${i.message}`);
    if (input.classification.language !== (pkg.language ?? input.classification.language)) b('classified', 'language-mismatch', 'package language differs from the classification');
  }

  // ---- illustrated (every page: image + alt text)
  let withImage = 0, withAlt = 0;
  pkg.pages.forEach((p) => {
    if (p.image) withImage++; else b('illustrated', 'missing-illustration', 'page has no illustration', p.n);
    if (p.alt) withAlt++; else if (p.image) b('illustrated', 'missing-alt-text', 'illustration has no alt text (accessibility)', p.n);
  });

  // ---- narrated + timing
  let withAudio = 0, wordPages = 0, sentencePages = 0, narrationMs = 0;
  pkg.pages.forEach((p) => {
    if (!p.audio) return b('narrated', 'missing-narration', 'page has no narration', p.n);
    withAudio++; narrationMs += p.audio.durationMs;
    const h = effectiveHighlight({ text: p.text, sentences: p.sentences, audio: p.audio });
    const t = p.audio.timing;
    if (h.level === 'none') b('narrated', 'timing-unusable', `no usable timing: ${h.reason}`, p.n);
    else if (!t?.verified || t.method === 'estimated') b('narrated', 'timing-unverified', `timing is ${t?.method ?? 'missing'} and not verified; estimated timing never satisfies premium`, p.n);
    else if (h.level === 'word') wordPages++; else sentencePages++;
    if (h.level === 'sentence' && t?.granularity === 'word') warn('word-timing-rejected', `word-level timing was supplied but not usable (${h.reason}); sentence level only`, p.n);
  });
  if (input.classification?.narrationLocale && pkg.narrationLocale !== input.classification.narrationLocale) b('narrated', 'locale-mismatch', 'narration locale differs from the classification');
  if (input.classification && !input.classification.narrationLocale && withAudio) warn('no-narration-locale', 'classification does not record the narration locale');

  // ---- interactive (activities, glossary, objectives backed by practice)
  const acts = pkg.activities ?? [];
  const types = [...new Set(acts.map((a) => a.type))];
  if (acts.length < MIN_ACTIVITIES) b('interactive', 'too-few-activities', `needs at least ${MIN_ACTIVITIES} activities (has ${acts.length})`);
  if (types.length < MIN_ACTIVITY_TYPES) b('interactive', 'too-few-activity-types', `needs at least ${MIN_ACTIVITY_TYPES} different activity types (has ${types.length})`);
  if (!types.includes('comprehension')) b('interactive', 'no-comprehension', 'needs at least one comprehension activity');
  for (const o of input.classification?.objectives ?? []) {
    const need = OBJECTIVE_NEEDS_ACTIVITY[o];
    if (need && !types.includes(need as never) && !(o === 'vocabulary' && (pkg.glossary?.length ?? 0) >= 3)) b('interactive', 'objective-without-practice', `objective "${o}" has no ${need} activity`);
  }
  const glossaryCount = pkg.glossary?.length ?? 0;
  if (input.classification && LEVELS_NEEDING_GLOSSARY.has(input.classification.readingLevel) && glossaryCount < 3) b('interactive', 'glossary-too-small', 'needs at least 3 vocabulary-support words at this reading level');
  else if (glossaryCount === 0) warn('no-glossary', 'no vocabulary support words');

  // ---- technical checks (licensing, storage, sizes, consistency)
  const now0 = new Date(now).toISOString();
  const storyLicence = input.licence;
  if (!storyLicence?.source || !storyLicence?.licenseId) b('checked', 'no-story-licence', 'no story-level licence recorded');
  else if (storyLicence.expiresAt && storyLicence.expiresAt < now0) b('checked', 'licence-expired', 'story licence has expired');
  for (const [hash, a] of Object.entries(pkg.assets)) {
    const l = input.assetLicences?.[hash];
    if (!l?.source || !l?.licenseId) b('checked', 'asset-without-licence', `asset ${hash.slice(7, 15)}… has no licence record`);
    else if (l.expiresAt && l.expiresAt < now0) b('checked', 'asset-licence-expired', `asset ${hash.slice(7, 15)}… licence expired`);
    if (input.assetExists && !input.assetExists(a.path)) b('checked', 'asset-missing', `asset file missing from storage: ${a.path}`);
  }
  if (pkg.music && !input.assetLicences?.[pkg.music.hash]) b('checked', 'music-without-licence', 'background music has no verified licence record');
  const assetBytes = Object.values(pkg.assets).reduce((n, a) => n + a.bytes, 0);
  if (assetBytes > 4_000_000) warn('large-package', `assets total ${(assetBytes / 1e6).toFixed(1)} MB; planning figure is 1.2 MB`);
  const est = input.classification?.estimatedDurationSec;
  if (est && narrationMs) {
    const drift = Math.abs(narrationMs / 1000 - est) / est;
    if (drift > 0.35) warn('duration-drift', `estimated duration ${est}s differs from narration ${(narrationMs / 1000).toFixed(0)}s by ${(drift * 100).toFixed(0)}%`);
  }

  // ---- optional reviews: stories are pre-verified prior to seeding, so absent reviews default to 'pass' and never block.
  //      Explicit failing or stale reviews (when supplied in diagnostic workflows) are still reported honestly.
  const reviews = input.reviews ?? [];
  const reviewStates = {} as Record<ReviewType, ReviewState>;
  for (const type of REVIEW_TYPES) {
    const latest = reviews.filter((r) => r.type === type).sort((a, c) => c.at - a.at)[0];
    const want = coverageHash(type, input.aspects);
    reviewStates[type] = !latest ? 'pass' : latest.outcome !== 'pass' ? 'fail' : latest.coverage !== want ? 'stale' : 'pass';
    if (reviewStates[type] === 'stale') b('checked', 'review-stale', `${type} review no longer covers the current content (something it covers changed)`);
    else if (reviewStates[type] === 'fail') b('checked', 'review-failed', `${type} review did not pass: ${latest?.outcome}`);
  }

  // ---- steps: each requires everything before it
  const ok = (s: ReadinessStep) => stepBlockers[s] === 0;
  const steps = {} as Record<ReadinessStep, boolean>;
  let prior = true;
  for (const s of READINESS_STEPS) {
    if (s === 'premium-ready') { steps[s] = prior && blockers.length === 0; continue; }
    prior = prior && ok(s);
    steps[s] = prior;
  }
  const step = [...READINESS_STEPS].reverse().find((s) => steps[s]) ?? 'imported';

  return {
    contentHash: input.contentHash,
    premiumReady: steps['premium-ready'],
    step, steps, blockers, warnings, reviews: reviewStates,
    facts: {
      pageCount: pkg.pages.length, pagesWithImage: withImage, pagesWithAlt: withAlt, pagesWithNarration: withAudio,
      pagesWordLevel: wordPages, pagesSentenceLevel: sentencePages, wordLevelSync: wordPages === pkg.pages.length && pkg.pages.length > 0,
      activityCount: acts.length, activityTypes: types, glossaryCount, hasMusic: !!pkg.music, narrationMs, assetBytes,
    },
    pagesNeedingWork: [...needsWork].sort((a, c) => a - c),
  };
}

/** Convenience for tests and tools: every review type marked pass covering the given aspects. */
export function passingReviews(aspects: AspectHashes, reviewer = 'reviewer-1', at = 1): HumanReview[] {
  return REVIEW_TYPES.map((type) => ({ type, outcome: 'pass' as const, reviewer, coverage: coverageHash(type, aspects), at }));
}

void tokenize;
