/**
 * Central Story Library: shared types and constants (Stage 1 — Scaled & Instant Approval).
 *
 * Design: docs/STORY-SPARK-2.0-PLAN.md, Part 3. The library is separate from the school-created `junior_stories`
 * collection, which is untouched and still read through `normalizeStory()`.
 *
 *   Firestore  library_meta/current        the one document every client reads per session (version pointer + totalPublished)
 *              story_catalogue/{storyId}   compact published/archived metadata (no pages, no media)
 *              story_library_admin/{id}    publisher-only workflow, licensing and review state
 *              library_seed_jobs/{job}     publisher-only seeding state (resumable)
 *   Storage    story_library/private/...   staging, publishers only
 *              story_library/published/... immutable, content-addressed, readable by authorized schools / CDN
 */

export const ADMIN_STATUSES = ['draft', 'review', 'approved', 'published', 'archived'] as const;
export type AdminStatus = (typeof ADMIN_STATUSES)[number];

/** Only these two ever appear in the school-readable catalogue. Drafts live only in `story_library_admin`. */
export const CATALOGUE_STATUSES = ['published', 'archived'] as const;
export type CatalogueStatus = (typeof CATALOGUE_STATUSES)[number];

/** Allowed workflow transitions (mirrors firestore.rules `story_library_admin`). Stories are pre-verified prior to seeding. */
export const ADMIN_TRANSITIONS: Record<AdminStatus, AdminStatus[]> = {
  draft: ['review', 'approved'],
  review: ['draft', 'approved'],
  approved: ['published', 'review', 'draft'],
  published: ['archived'],
  archived: ['review', 'draft'],
};

export const MAX_CATALOGUE_PAGE_SIZE = 50;
export const MAX_PAGES_PER_STORY = 40;
export const MAX_CATALOGUE_ENTRY_BYTES = 3_072;

export interface CoverRef { hash: string; w: number; h: number; alt: string }

/** One compact catalogue document. About 1.5 KB. Never holds page text, media, learner or school data. */
export interface CatalogueEntry {
  storyKey: string;
  version: number;
  packageVersion: number;
  status: CatalogueStatus;
  title: string;
  summary?: string;
  language?: string;
  ageTiers: string[];
  level?: number;
  categories?: string[];
  themes?: string[];
  objectives?: string[];
  pageCount: number;
  durationSec?: number;
  cover?: CoverRef;
  /** Compact 2-colour cover gradient so shelf cards render without downloading per-story sidecar files. */
  palette?: [string, string];
  /** Compact cover emoji/motif fallback for shelf cards. */
  coverMotif?: string;
  hasNarration?: boolean;
  hasActivities?: boolean;
  packagePath: string;
  packageHash: string;
  packageBytes?: number;
  contentHash: string;
  publishedAt?: unknown;
  /** Unix epoch ms when the 48-hour developer quarantine ends (`releaseAt <= Date.now()` => public). */
  releaseAt?: number;
  /** True if held/flagged by developer during review so it does not auto-promote after 48 hours. */
  reviewHold?: boolean;
  updatedAt?: unknown;
  sortKey?: number;
  attribution?: string;
  publishedBy: string;
  // ---- Classification facets (flat, so each filter is one indexed query; see classification.ts toCatalogueFacets)
  classIds?: string[];
  classMin?: number;
  classMax?: number;
  ageMin?: number;
  ageMax?: number;
  readingLevel?: string;
  difficulty?: number;
  genres?: string[];
  /** NaCCA curriculum codes this story supports (for example B4.2.2.1.1), taken from its teacher-guide subject links. */
  nacca?: string[];
  ghanaianContext?: string;
  /** catalogueVersion at which this entry last changed. Delta refresh asks for entries with changedInVersion > the cached version. */
  changedInVersion?: number;
}

export const CATALOGUE_ALLOWED_KEYS: ReadonlyArray<keyof CatalogueEntry> = [
  'storyKey', 'version', 'packageVersion', 'status', 'title', 'summary', 'language', 'ageTiers', 'level', 'categories',
  'themes', 'objectives', 'pageCount', 'durationSec', 'cover', 'palette', 'coverMotif', 'hasNarration', 'hasActivities', 'packagePath',
  'packageHash', 'packageBytes', 'contentHash', 'publishedAt', 'releaseAt', 'reviewHold', 'updatedAt', 'sortKey', 'attribution', 'publishedBy',
  'classIds', 'classMin', 'classMax', 'ageMin', 'ageMax', 'readingLevel', 'difficulty', 'genres', 'nacca', 'ghanaianContext', 'changedInVersion',
];

export const CATALOGUE_REQUIRED_KEYS: ReadonlyArray<keyof CatalogueEntry> = [
  'storyKey', 'version', 'packageVersion', 'status', 'title', 'ageTiers', 'pageCount', 'packagePath', 'packageHash',
  'contentHash', 'publishedBy',
];

export type { AudioRef, TimingTrack, Activity, GlossaryEntry, MusicRef } from './premium';
import type { AudioRef, Activity, GlossaryEntry, MusicRef } from './premium';

export interface PackagePage {
  n: number;
  text: string;
  sentences?: string[];
  /** Content hash of the illustration; resolved through `assets`. Fetched lazily. */
  image?: string;
  /** Alt text for the illustration (accessibility; required for premium stories). */
  alt?: string;
  /** Narration, fetched lazily and only in the modes that use it. */
  audio?: AudioRef;
}

export interface AssetInfo { path: string; bytes: number; type: string }

/** The immutable story package: ALL text in one small JSON, media by hash. One fetch opens the story. */
export interface StoryPackage {
  schemaVersion: 1;
  storyId: string;
  version: number;
  contentHash: string;
  title: string;
  ageTiers: string[];
  language?: string;
  narrationLocale?: string;
  pages: PackagePage[];
  activities?: Activity[];
  glossary?: GlossaryEntry[];
  music?: MusicRef;
  assets: Record<string, AssetInfo>;
}

/** Allow-list: a package may contain ONLY these keys, so personal or school data cannot slip into public-safe content. */
export const PACKAGE_ALLOWED_KEYS = [
  'schemaVersion', 'storyId', 'version', 'contentHash', 'title', 'ageTiers', 'language', 'narrationLocale', 'pages', 'activities',
  'glossary', 'music', 'assets',
] as const;
export const PAGE_ALLOWED_KEYS = ['n', 'text', 'sentences', 'image', 'alt', 'audio'] as const;

export const PUBLISHED_PREFIX = 'story_library/published/';
export const PRIVATE_PREFIX = 'story_library/private/';
