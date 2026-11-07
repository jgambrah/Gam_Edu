/**
 * Central Story Library: shared types and constants (Stage 1).
 *
 * Design: docs/STORY-SPARK-2.0-PLAN.md, Part 3. The library is separate from the school-created `junior_stories`
 * collection, which is untouched and still read through `normalizeStory()`.
 *
 *   Firestore  library_meta/current        the one document every client reads per session (version pointer)
 *              story_catalogue/{storyId}   compact published/archived metadata (no pages, no media)
 *              story_library_admin/{id}    publisher-only workflow, licensing and review state
 *              library_seed_jobs/{job}     publisher-only seeding state (resumable)
 *   Storage    story_library/private/...   staging, publishers only
 *              story_library/published/... immutable, content-addressed, readable by authorized schools
 */

export const ADMIN_STATUSES = ['draft', 'review', 'approved', 'published', 'archived'] as const;
export type AdminStatus = (typeof ADMIN_STATUSES)[number];

/** Only these two ever appear in the school-readable catalogue. Drafts live only in `story_library_admin`. */
export const CATALOGUE_STATUSES = ['published', 'archived'] as const;
export type CatalogueStatus = (typeof CATALOGUE_STATUSES)[number];

/** Allowed workflow transitions (mirrors firestore.rules `story_library_admin`). Approval needs a different person. */
export const ADMIN_TRANSITIONS: Record<AdminStatus, AdminStatus[]> = {
  draft: ['review'],
  review: ['draft', 'approved'],
  approved: ['published', 'review'],
  published: ['archived'],
  archived: ['review'],
};

export const MAX_CATALOGUE_PAGE_SIZE = 50;
export const MAX_PAGES_PER_STORY = 40;
export const MAX_CATALOGUE_ENTRY_BYTES = 2_048;

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
  hasNarration?: boolean;
  hasActivities?: boolean;
  packagePath: string;
  packageHash: string;
  packageBytes?: number;
  contentHash: string;
  publishedAt?: unknown;
  updatedAt?: unknown;
  sortKey?: number;
  attribution?: string;
  publishedBy: string;
}

export const CATALOGUE_ALLOWED_KEYS: ReadonlyArray<keyof CatalogueEntry> = [
  'storyKey', 'version', 'packageVersion', 'status', 'title', 'summary', 'language', 'ageTiers', 'level', 'categories',
  'themes', 'objectives', 'pageCount', 'durationSec', 'cover', 'hasNarration', 'hasActivities', 'packagePath',
  'packageHash', 'packageBytes', 'contentHash', 'publishedAt', 'updatedAt', 'sortKey', 'attribution', 'publishedBy',
];

export const CATALOGUE_REQUIRED_KEYS: ReadonlyArray<keyof CatalogueEntry> = [
  'storyKey', 'version', 'packageVersion', 'status', 'title', 'ageTiers', 'pageCount', 'packagePath', 'packageHash',
  'contentHash', 'publishedBy',
];

export interface AudioRef { hash: string; durationMs: number; sentenceTimings?: number[] }

export interface PackagePage {
  n: number;
  text: string;
  sentences?: string[];
  /** Content hash of the illustration; resolved through `assets`. Fetched lazily. */
  image?: string;
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
  pages: PackagePage[];
  activities?: Array<Record<string, unknown>>;
  assets: Record<string, AssetInfo>;
}

/** Allow-list: a package may contain ONLY these keys, so personal or school data cannot slip into public-safe content. */
export const PACKAGE_ALLOWED_KEYS = [
  'schemaVersion', 'storyId', 'version', 'contentHash', 'title', 'ageTiers', 'pages', 'activities', 'assets',
] as const;
export const PAGE_ALLOWED_KEYS = ['n', 'text', 'sentences', 'image', 'audio'] as const;

export const PUBLISHED_PREFIX = 'story_library/published/';
export const PRIVATE_PREFIX = 'story_library/private/';
