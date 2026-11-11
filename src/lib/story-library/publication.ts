/**
 * Central-library publication service (Stage 3C/3F — Instant Pre-Verified Approval & Scalable Meta). SERVER-SIDE ONLY.
 *
 * Why this exists: Firestore rules cannot compute content hashes, copy files, or update the catalogue and the catalogue
 * version in one atomic step. So clients (publishers and super admins included) can NOT write `story_catalogue` or
 * `library_meta`, and cannot set `published` or `archived` on a story. The only way to publish is through this service,
 * which verifies technical readiness and integrity before promoting content-addressed assets and bumping catalogueVersion:
 *
 *   - the story is `approved` (including stories instantly approved upon seeding or approved directly by a publisher);
 *   - the story is technically `premiumReady` for EXACTLY the content being published (valid package, classification,
 *     illustrations, narration, timing, activities, glossary, licences, and staged storage objects);
 *   - the staged package matches its recorded hash; assets are promoted by content hash (create-only, never overwritten).
 */
import { createHash } from 'node:crypto';
import { coverageHash, REVIEW_TYPES, type ReviewType } from './aspects';
import { toCatalogueFacets, ageTiersFor, READING_LEVELS, type Classification } from './classification';
import { evaluateReadiness, type HumanReview, type ReadinessResult } from './readiness';
import { packagePathFor, validateCatalogueEntry } from './validate';
import { PRIVATE_ASSET_PREFIX, type Doc, type PutResult, type SeedBackend } from './seeder/types';
import type { CatalogueEntry, StoryPackage } from './types';

export interface PublishBackend extends SeedBackend {
  getObject(path: string): Promise<Uint8Array | undefined>;
  hasObject(path: string): Promise<boolean>;
  copyObjectIfAbsent(from: string, to: string, contentType: string): Promise<PutResult>;
}

/** Who is asking. The caller (an authenticated endpoint) must establish this from the verified ID token, never from the request body. */
export interface Actor { uid: string; isPublisher: boolean }

export class PublicationError extends Error {
  constructor(readonly code: 'not-authorised' | 'not-found' | 'bad-state' | 'not-independent' | 'not-ready' | 'integrity' | 'conflict' | 'invalid', message: string) { super(message); }
}

export const ADMIN = 'story_library_admin';
export const CATALOGUE = 'story_catalogue';
export const META = 'library_meta/current';
export const FEATURED = 'library_meta/featured';
export const FEATURED_MAX = 12;
export const TOMBSTONE_MAX = 500;
export const READINESS_VERSION = 'readiness-v2-instant';

const adminPath = (id: string) => `${ADMIN}/${id}`;
const readinessPath = (id: string) => `${ADMIN}/${id}/readiness/current`;
const reviewsPath = (id: string) => `${ADMIN}/${id}/reviews`;
const sha256Hex = (b: Uint8Array | string) => createHash('sha256').update(b).digest('hex');
const need = (a: Actor) => { if (!a?.isPublisher || !a.uid) throw new PublicationError('not-authorised', 'only central publishers may do this'); };

// ------------------------------------------------------------------------------------------------------ reading a story

async function loadStaged(b: PublishBackend, admin: Doc): Promise<{ pkg: StoryPackage; bytes: Uint8Array }> {
  const bytes = await b.getObject(admin.packagePath);
  if (!bytes) throw new PublicationError('integrity', `staged package is missing: ${admin.packagePath}`);
  if (`sha256:${sha256Hex(bytes)}` !== admin.packageHash) throw new PublicationError('integrity', 'staged package does not match its recorded hash');
  const pkg = JSON.parse(new TextDecoder().decode(bytes)) as StoryPackage;
  if (pkg.contentHash !== admin.contentHash) throw new PublicationError('integrity', 'staged package content hash differs from the admin record');
  return { pkg, bytes };
}

const assetStagingPath = (hash: string, publishedPath: string) => `${PRIVATE_ASSET_PREFIX}${hash.slice(7, 9)}/${hash.slice(7)}.${publishedPath.split('.').pop()}`;

async function humanReviews(b: PublishBackend, storyId: string): Promise<HumanReview[]> {
  return (await b.listDocs(reviewsPath(storyId))).map((d) => d.data as HumanReview);
}

async function evaluate(b: PublishBackend, admin: Doc, storyId: string, pkg: StoryPackage): Promise<{ result: ReadinessResult; reviewers: string[] }> {
  const reviews = await humanReviews(b, storyId);
  const current = reviews.filter((r) => (r as unknown as Doc).contentHash === admin.contentHash);
  const stagedHas = new Map<string, boolean>();
  for (const [hash, a] of Object.entries(pkg.assets)) stagedHas.set(a.path, (await b.hasObject(a.path)) || (await b.hasObject(assetStagingPath(hash, a.path))));
  const result = evaluateReadiness({
    contentHash: admin.contentHash, classification: admin.classification as Classification | null, aspects: admin.aspects, assetLicences: admin.assetLicences,
    licence: admin.licence, pkg, reviews: current, assetExists: (p) => stagedHas.get(p) === true, now: b.now(),
  });
  const reviewers = [...new Set(current.filter((r) => r.outcome === 'pass').map((r) => r.reviewer))].sort();
  return { result, reviewers };
}

// ------------------------------------------------------------------------------------------------------ readiness record

/** Recompute readiness for the story's CURRENT content and store it where the Firestore rules can read it. */
export async function refreshReadiness(b: PublishBackend, storyId: string): Promise<{ result: ReadinessResult; reviewers: string[] }> {
  const admin = (await b.transact((tx) => tx.get(adminPath(storyId))));
  if (!admin) throw new PublicationError('not-found', `no such story: ${storyId}`);
  const { pkg } = await loadStaged(b, admin);
  const out = await evaluate(b, admin, storyId, pkg);
  const r = out.result;
  await b.transact(async (tx) => {
    const fresh = await tx.get(adminPath(storyId));
    if (!fresh || fresh.contentHash !== admin.contentHash) throw new PublicationError('conflict', 'the story changed while readiness was computed; try again');
    tx.set(readinessPath(storyId), {
      contentHash: r.contentHash, premiumReady: r.premiumReady, step: r.step, steps: r.steps, reviews: r.reviews, reviewerIds: out.reviewers,
      blockers: r.blockers.slice(0, 50), warnings: r.warnings.slice(0, 50), pagesNeedingWork: r.pagesNeedingWork.slice(0, 40), facts: r.facts,
      evaluator: READINESS_VERSION, evaluatedAt: b.now(),
    });
  });
  return out;
}

/** Optional diagnostic review note (stories are pre-verified prior to seeding and do not require separate review records). */
export async function recordReview(b: PublishBackend, actor: Actor, i: { storyId: string; type: ReviewType; outcome: HumanReview['outcome']; notes?: string }) {
  need(actor);
  if (!(REVIEW_TYPES as readonly string[]).includes(i.type)) throw new PublicationError('invalid', `unknown review type ${i.type}`);
  if (!['pass', 'fail', 'needs-work'].includes(i.outcome)) throw new PublicationError('invalid', 'outcome must be pass, fail or needs-work');
  if ((i.notes ?? '').length > 2000) throw new PublicationError('invalid', 'notes are limited to 2000 characters');
  await b.transact(async (tx) => {
    const admin = await tx.get(adminPath(i.storyId));
    if (!admin) throw new PublicationError('not-found', `no such story: ${i.storyId}`);
    if (!['draft', 'review'].includes(admin.status)) throw new PublicationError('bad-state', `reviews are recorded while a story is in draft or review, not ${admin.status}`);
    const now = b.now();
    tx.set(`${reviewsPath(i.storyId)}/${i.type}-${now}-${actor.uid.slice(0, 8)}`, {
      type: i.type, outcome: i.outcome, reviewer: actor.uid, coverage: coverageHash(i.type, admin.aspects), contentHash: admin.contentHash, at: now, ...(i.notes ? { notes: i.notes } : {}),
    });
  });
  return refreshReadiness(b, i.storyId);
}

// ------------------------------------------------------------------------------------------------------ approval check

/** Pre-verified instant approval: only checks that an approver identity is recorded (four-eyes gate removed). */
export function independenceProblem(admin: Doc, _reviewers: string[] = []): string | null {
  if (!admin.approvedBy) return 'the story has no approver';
  return null;
}

// ------------------------------------------------------------------------------------------------------ catalogue entry

export function buildCatalogueEntry(admin: Doc, pkg: StoryPackage, o: { catalogueVersion: number; sortKey: number; version: number; publishedBy: string }): CatalogueEntry {
  const c = admin.classification as Classification | null;
  const f = c ? toCatalogueFacets(c) : undefined;
  const level = c ? READING_LEVELS.find((l) => l.id === c.readingLevel)?.order : undefined;
  const summary = typeof admin.summary === 'string' ? admin.summary : undefined;
  const palette = Array.isArray(admin.palette) && admin.palette.length === 2 ? (admin.palette as [string, string]) : undefined;
  const coverMotif = typeof admin.coverMotif === 'string' && admin.coverMotif ? admin.coverMotif : undefined;
  const entry: CatalogueEntry = {
    storyKey: admin.storyKey, version: o.version, packageVersion: pkg.version, status: 'published', title: pkg.title, ...(summary ? { summary } : {}),
    ...(pkg.language ? { language: pkg.language } : {}), ageTiers: c ? ageTiersFor(c.ageMin, c.ageMax) : pkg.ageTiers, ...(level ? { level } : {}),
    categories: c?.genres ?? admin.categories ?? [], themes: c?.themes ?? [], objectives: c?.objectives ?? admin.objectives ?? [],
    pageCount: pkg.pages.length, ...(c ? { durationSec: c.estimatedDurationSec } : {}),
    ...(palette ? { palette } : {}), ...(coverMotif ? { coverMotif } : {}),
    hasNarration: pkg.pages.every((p) => !!p.audio), hasActivities: (pkg.activities?.length ?? 0) > 0,
    packagePath: packagePathFor(admin.storyKey, pkg.version), packageHash: admin.packageHash, packageBytes: admin.packageBytes, contentHash: admin.contentHash,
    sortKey: o.sortKey, publishedBy: o.publishedBy, changedInVersion: o.catalogueVersion, updatedAt: o.catalogueVersion as unknown,
    ...(f ? { classIds: f.classIds, classMin: f.classMin, classMax: f.classMax, ageMin: f.ageMin, ageMax: f.ageMax, readingLevel: f.readingLevel, difficulty: f.difficulty, genres: f.genres, ghanaianContext: f.ghanaianContext } : {}),
  };
  return entry;
}

const newMeta = (): Doc => ({
  catalogueVersion: 0,
  totalPublished: 0,
  nextSortKey: 1,
  minClientVersion: 1,
  tombstones: [],
  controls: { downloadsEnabled: true, catalogueSyncEnabled: true, progressWritesEnabled: true },
});

// ------------------------------------------------------------------------------------------------------ publish

export type PublishOutcome = { outcome: 'published' | 'republished' | 'unchanged'; catalogueVersion: number; sortKey: number; version: number };

export async function publishStory(b: PublishBackend, actor: Actor, storyId: string): Promise<PublishOutcome> {
  need(actor);
  // ---- 1. read and verify everything outside the transaction (object reads cannot be part of it)
  const admin0 = await b.transact((tx) => tx.get(adminPath(storyId)));
  if (!admin0) throw new PublicationError('not-found', `no such story: ${storyId}`);
  if (admin0.status === 'published' && admin0.publishedContentHash === admin0.contentHash) {
    const cat = await b.transact((tx) => tx.get(`${CATALOGUE}/${storyId}`));
    return { outcome: 'unchanged', catalogueVersion: cat?.changedInVersion ?? 0, sortKey: cat?.sortKey ?? 0, version: cat?.version ?? 0 };
  }
  if (admin0.status !== 'approved') throw new PublicationError('bad-state', `only an approved story can be published (this one is ${admin0.status})`);
  const { pkg } = await loadStaged(b, admin0);
  const { result, reviewers } = await evaluate(b, admin0, storyId, pkg);
  const ind = independenceProblem(admin0, reviewers);
  if (ind) throw new PublicationError('bad-state', ind);
  if (!result.premiumReady) throw new PublicationError('not-ready', `not premium-ready: ${result.blockers.slice(0, 5).map((x) => x.code + (x.page ? `@p${x.page}` : '')).join(', ')}${result.blockers.length > 5 ? ' …' : ''}`);

  // ---- 2. promote files: content-addressed and create-only, so a retry or a lost race cannot damage anything
  const target = packagePathFor(storyId, pkg.version);
  for (const [hash, a] of Object.entries(pkg.assets)) {
    const r = await b.copyObjectIfAbsent(assetStagingPath(hash, a.path), a.path, a.type);
    if (r === 'exists_different') throw new PublicationError('integrity', `a different file already exists at ${a.path}`);
  }
  const pr = await b.copyObjectIfAbsent(admin0.packagePath, target, 'application/json');
  if (pr === 'exists_different') throw new PublicationError('integrity', `a different package already exists at ${target}`);

  // ---- 3. one transaction: re-check, then catalogue + meta + featured + the story's published trail
  return b.transact(async (tx) => {
    const admin = await tx.get(adminPath(storyId));
    const cat = await tx.get(`${CATALOGUE}/${storyId}`);
    const meta = (await tx.get(META)) ?? newMeta();
    const feat = (await tx.get(FEATURED)) ?? { items: [] };
    if (!admin || admin.status !== 'approved' || admin.contentHash !== admin0.contentHash || admin.approvedBy !== admin0.approvedBy) throw new PublicationError('conflict', 'the story changed while publishing; nothing was published');
    const now = b.now();
    const catalogueVersion = (meta.catalogueVersion ?? 0) + 1;
    const sortKey = cat?.sortKey ?? meta.nextSortKey ?? 1; // a story keeps its place in the list; new stories append
    const version = (cat?.version ?? 0) + 1;
    const wasPublished = cat?.status === 'published';
    const totalPublished = (meta.totalPublished ?? 0) + (wasPublished ? 0 : 1);
    const entry = buildCatalogueEntry(admin, pkg, { catalogueVersion, sortKey, version, publishedBy: actor.uid });
    const problems = validateCatalogueEntry(storyId, entry);
    if (problems.length) throw new PublicationError('invalid', `catalogue entry invalid: ${problems.map((p) => `${p.path}: ${p.message}`).join('; ')}`);
    tx.set(`${CATALOGUE}/${storyId}`, entry as unknown as Doc);
    tx.set(META, { ...meta, catalogueVersion, totalPublished, nextSortKey: cat ? meta.nextSortKey : sortKey + 1, updatedAt: now, tombstones: (meta.tombstones ?? []).filter((t: Doc) => t.storyId !== storyId) });
    const items = [{ storyKey: storyId, title: entry.title, publishedAtVersion: catalogueVersion }, ...(feat.items ?? []).filter((x: Doc) => x.storyKey !== storyId)].slice(0, FEATURED_MAX);
    tx.set(FEATURED, { items, updatedAtVersion: catalogueVersion, updatedAt: now });
    tx.set(adminPath(storyId), { ...admin, status: 'published', publishedBy: actor.uid, publishedAt: now, publishedContentHash: admin.contentHash, publishedVersion: version, updatedAt: now });
    return { outcome: cat ? 'republished' : 'published', catalogueVersion, sortKey, version } as PublishOutcome;
  });
}

// ------------------------------------------------------------------------------------------------------ withdraw

/**
 * Withdraw a published story: it stays in the catalogue as an `archived` tombstone (so clients purge it), leaves the
 * featured list, and the catalogue version moves so every client learns of it. Idempotent.
 */
export async function withdrawStory(b: PublishBackend, actor: Actor, storyId: string, reason: string): Promise<{ outcome: 'withdrawn' | 'unchanged'; catalogueVersion: number }> {
  need(actor);
  if (!reason || reason.length > 500) throw new PublicationError('invalid', 'a reason of 1-500 characters is required');
  return b.transact(async (tx) => {
    const admin = await tx.get(adminPath(storyId));
    const cat = await tx.get(`${CATALOGUE}/${storyId}`);
    const meta = (await tx.get(META)) ?? newMeta();
    const feat = (await tx.get(FEATURED)) ?? { items: [] };
    if (!admin) throw new PublicationError('not-found', `no such story: ${storyId}`);
    if (cat?.status === 'archived') return { outcome: 'unchanged' as const, catalogueVersion: meta.catalogueVersion ?? 0 };
    if (!cat || cat.status !== 'published') throw new PublicationError('bad-state', 'only a story that is live in the catalogue can be withdrawn');
    const now = b.now();
    const catalogueVersion = (meta.catalogueVersion ?? 0) + 1;
    const totalPublished = Math.max(0, (meta.totalPublished ?? 1) - 1);
    tx.set(`${CATALOGUE}/${storyId}`, { ...cat, status: 'archived', changedInVersion: catalogueVersion, updatedAt: catalogueVersion });
    const tombstones = [...(meta.tombstones ?? []).filter((t: Doc) => t.storyId !== storyId), { storyId, withdrawnAtVersion: catalogueVersion }].slice(-TOMBSTONE_MAX);
    tx.set(META, { ...meta, catalogueVersion, totalPublished, updatedAt: now, tombstones });
    tx.set(FEATURED, { items: (feat.items ?? []).filter((x: Doc) => x.storyKey !== storyId), updatedAtVersion: catalogueVersion, updatedAt: now });
    tx.set(adminPath(storyId), { ...admin, ...(admin.status === 'published' ? { status: 'archived' } : {}), archivedBy: actor.uid, archivedAt: now, archiveReason: reason, publishedContentHash: null, updatedAt: now });
    return { outcome: 'withdrawn' as const, catalogueVersion };
  });
}

// ------------------------------------------------------------------------------------------------------ new content version

/**
 * Promote a staged new version (from the seeder's `pending_versions`) into the story. Since seeded content is verified
 * prior to seeding, promoting it marks the working copy `approved` immediately (by the promoting publisher) so it is ready
 * to publish via `publishStory` once automated readiness checks pass.
 * A published story stays LIVE at its previous catalogue entry until `publishStory` promotes the new version.
 */
export async function promotePendingVersion(b: PublishBackend, actor: Actor, storyId: string, version: number) {
  need(actor);
  await b.transact(async (tx) => {
    const admin = await tx.get(adminPath(storyId));
    const pending = await tx.get(`${adminPath(storyId)}/pending_versions/${version}`);
    if (!admin || !pending) throw new PublicationError('not-found', 'no such story or pending version');
    const now = b.now();
    const { status: _s, createdBy: _c, lastEditedBy: _l, approvedBy: _ab, approvedAt: _aa, createdAt: _ca, updatedAt: _u, basedOnVersion: _b, synthetic: _syn, ...content } = pending;
    tx.set(adminPath(storyId), {
      ...admin, ...content, status: 'approved', lastEditedBy: actor.uid, submittedBy: '', submittedAt: null, approvedBy: actor.uid, approvedAt: now, updatedAt: now,
    });
    tx.delete(`${adminPath(storyId)}/pending_versions/${version}`);
    tx.delete(readinessPath(storyId));
  });
}
