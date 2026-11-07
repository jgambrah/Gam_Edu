import type { Classification } from '../classification';
import type { Activity, GlossaryEntry, TimingTrack } from '../premium';
/**
 * Story seeder: types and the storage layout it writes. Stage 2: EMULATOR / SYNTHETIC ONLY, DRAFT ONLY.
 *
 * The seeder writes only these places:
 *   Firestore  story_library_admin/{storyId}                     status is ALWAYS 'draft'
 *              story_library_admin/{storyId}/pending_versions/{n} a new version of a story already past draft
 *              library_seed_jobs/{jobId}, .../items/{storyKey}    resumable job state
 *              library_seed_jobs/_index/text|bands/...             duplicate index
 *   Storage    story_library/private/assets/...  story_library/private/packages/...
 * It never writes story_catalogue, library_meta or story_library/published (tests spy on every write to prove it).
 */
export const SEEDER_UID = 'seeder-bot';
export const ADMIN_COLLECTION = 'story_library_admin';
export const JOBS_COLLECTION = 'library_seed_jobs';
export const INDEX_ROOT = `${JOBS_COLLECTION}/_index`;
export const PRIVATE_ASSET_PREFIX = 'story_library/private/assets/';
export const PRIVATE_PACKAGE_PREFIX = 'story_library/private/packages/';

export const ALLOWED_DOC_PREFIXES = [`${ADMIN_COLLECTION}/`, `${JOBS_COLLECTION}/`] as const;
export const ALLOWED_OBJECT_PREFIXES = [PRIVATE_ASSET_PREFIX, PRIVATE_PACKAGE_PREFIX] as const;

export type Doc = Record<string, any>;

export interface AssetInput { bytes: Uint8Array; ext: 'webp' | 'png' | 'opus' | 'ogg'; durationMs?: number; /** Where this file came from and under what licence (required for premium; reviewed by a person). */ licence?: LicenceInput }

export interface LicenceInput { source: string; licenseId: string; territory?: string; expiresAt?: string }

export type DuplicateDecision = { of: string; allow: true; note: string };

export interface StoryInput {
  /** Stage 2 accepts synthetic stories only. */
  synthetic: true;
  /** Stable author-defined key; also the story id. 3-64 of letters, digits, _ and -. */
  storyKey: string;
  title: string;
  ageTiers: string[];
  language?: string;
  categories?: string[];
  objectives?: string[];
  /** 'open' = free educational content; 'licensed' = restricted school-licensed content (see the access-control proposal). */
  access?: 'open' | 'licensed';
  /** Educational classification (Stage 3B). Optional for plain imports; required before a story can be treated as classified. */
  classification?: Classification;
  /** Narration locale (from the language's registry), when narration exists. */
  narrationLocale?: string;
  pages: Array<{ text: string; image: AssetInput; audio?: AssetInput; alt?: string; sentences?: string[]; timing?: TimingTrack }>;
  activities?: Activity[];
  glossary?: GlossaryEntry[];
  music?: { asset: AssetInput; title: string; licenceId: string; defaultVolume: number; duckTo: number };
  licence: LicenceInput;
  /** A person's recorded decision to allow a flagged near-duplicate. Must name the story it matched. */
  duplicateDecision?: DuplicateDecision;
}

export type ItemOutcome =
  | 'created' | 'updated_draft' | 'pending_version' | 'unchanged'
  | 'blocked_exact_duplicate' | 'blocked_near_duplicate' | 'invalid';

export type ItemState = 'in_progress' | 'done' | 'blocked' | 'invalid' | 'failed' | 'rolled_back' | 'rollback_skipped';

/** Database access, as small as the seeder needs. Implemented in memory (tests) and on Firestore (emulator). */
export interface Tx {
  get(path: string): Promise<Doc | undefined>;
  set(path: string, data: Doc): void;
  delete(path: string): void;
}

export type PutResult = 'created' | 'exists_same' | 'exists_different';

export interface SeedBackend {
  now(): number;
  /** Create-only upload. Never overwrites. `sha256` is stored with the object and compared on a clash. */
  putObjectIfAbsent(path: string, bytes: Uint8Array, contentType: string, sha256: string): Promise<PutResult>;
  /** Run `fn` atomically. May be re-run on conflict, so `fn` must only touch the database through `tx`. */
  transact<T>(fn: (tx: Tx) => Promise<T>): Promise<T>;
  listDocs(collectionPath: string): Promise<Array<{ id: string; data: Doc }>>;
}

/** A simulated process death: the runner must NOT record it as a failure (a dead process records nothing). */
export class ProcessCrash extends Error { constructor(msg = 'process crashed') { super(msg); this.name = 'ProcessCrash'; } }
/** A retryable infrastructure error (network blip, contention). */
export class TransientError extends Error { constructor(msg = 'transient error') { super(msg); this.name = 'TransientError'; } }
