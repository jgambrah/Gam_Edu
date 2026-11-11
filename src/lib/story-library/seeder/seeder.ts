/**
 * Story seeder (Stage 2 — Instant Pre-Verified Approval).
 *
 * Stories are verified prior to seeding, so every accepted story is written directly with `status: 'approved'`
 * (`approvedBy: SEEDER_UID`, `approvedAt: now`). Publishing to `story_catalogue` + `library_meta` remains the atomic job of
 * `publishStory` in `publication.ts`.
 *
 * Per story: claim -> stage media (create-only, content-addressed) -> ONE atomic transaction that does the duplicate
 * check, writes the approved admin document, updates the duplicate index and marks the item done. Because the decision and
 * the writes share a transaction, a crash can never leave a half-seeded story, two concurrent runners can never both
 * accept the same (near-)duplicate, and a re-run is a no-op.
 */
import {
  ADMIN_COLLECTION, INDEX_ROOT, JOBS_COLLECTION, PRIVATE_ASSET_PREFIX, PRIVATE_PACKAGE_PREFIX, SEEDER_UID,
  ProcessCrash, TransientError,
  type Doc, type ItemOutcome, type SeedBackend, type StoryInput, type Tx,
} from './types';
import { assertSyntheticOnly } from './guard';
import { NEAR_DUPLICATE_THRESHOLD, bandKeys, estimateJaccard, packSignature, signatureOf, titleSlug, unpackSignature } from './fingerprint';
import { canonicalJson, sha256Hex, sha256Tag } from './hash';
import { assetPathFor, STORY_ID_RE, validateStoryPackage, type Problem } from '../validate';
import { MAX_PAGES_PER_STORY, type StoryPackage } from '../types';
import { errorsOf, validateClassification } from '../classification';
import { aspectHashes, type AspectHashes } from '../aspects';

// ------------------------------------------------------------------------------------------------ preparation (pure)

const MIME: Record<string, string> = { webp: 'image/webp', png: 'image/png', opus: 'audio/opus', ogg: 'audio/ogg', mp3: 'audio/mpeg' };

export interface Prepared {
  storyId: string;
  contentHash: string;
  textHash: string;
  sig: number[];
  assets: Array<{ hash: string; ext: string; bytes: Uint8Array; contentType: string; stagingPath: string }>;
  /** Package without `version` (added at commit time, once the version is known). */
  buildPackage(version: number): { pkg: StoryPackage; json: string; sha: string; stagingPath: string };
  /** Licence record per asset hash (publisher-only; never in the package). */
  assetLicences: Record<string, unknown>;
  /** Hashes of each reviewable aspect (text, images, audio, timing, activities, licence). */
  aspects: AspectHashes;
  problems: Problem[];
}

export function prepare(story: StoryInput): Prepared {
  const problems: Problem[] = [];
  const bad = (path: string, message: string) => problems.push({ path, message });
  const storyId = story.storyKey;
  if (!STORY_ID_RE.test(storyId ?? '')) bad('storyKey', 'must be 3-64 characters of letters, digits, _ or -');
  if (!story.title || story.title.length > 120) bad('title', '1-120 characters');
  if (!Array.isArray(story.ageTiers) || story.ageTiers.length < 1 || story.ageTiers.length > 6) bad('ageTiers', '1-6 entries');
  if (!story.licence?.source || !story.licence?.licenseId) bad('licence', 'source and licenseId are required');
  if (!Array.isArray(story.pages) || story.pages.length < 1 || story.pages.length > MAX_PAGES_PER_STORY) bad('pages', `1-${MAX_PAGES_PER_STORY} pages`);
  if (story.access && !['open', 'licensed'].includes(story.access)) bad('access', 'open or licensed');
  for (const k of ['categories', 'objectives'] as const) if ((story[k]?.length ?? 0) > 20) bad(k, 'at most 20 entries');
  if (story.classification !== undefined) for (const i of errorsOf(validateClassification(story.classification))) bad(`classification.${i.path}`.replace(/\.$/, ''), i.message);

  const assets: Prepared['assets'] = [];
  const assetMap: StoryPackage['assets'] = {};
  const seen = new Set<string>();
  const assetLicences: Record<string, unknown> = {};
  const addAsset = (a: { bytes: Uint8Array; ext: string; licence?: unknown }, where: string) => {
    if (!a?.bytes?.length) { bad(where, 'empty media file'); return ''; }
    if (!MIME[a.ext]) { bad(where, `unsupported type ${a.ext}`); return ''; }
    const hash = sha256Tag(a.bytes);
    if (a.licence !== undefined) assetLicences[hash] = a.licence;
    const path = assetPathFor(hash, a.ext as 'webp');
    if (!path) { bad(where, 'bad hash'); return ''; }
    if (!seen.has(hash)) {
      seen.add(hash);
      assets.push({ hash, ext: a.ext, bytes: a.bytes, contentType: MIME[a.ext], stagingPath: `${PRIVATE_ASSET_PREFIX}${hash.slice(7, 9)}/${hash.slice(7)}.${a.ext}` });
      assetMap[hash] = { path, bytes: a.bytes.length, type: MIME[a.ext] };
    }
    return hash;
  };

  const pages: StoryPackage['pages'] = (story.pages ?? []).map((p, i) => {
    if (!p.text || !p.text.trim()) bad(`pages[${i}].text`, 'required');
    const image = addAsset(p.image, `pages[${i}].image`);
    const audio = p.audio ? addAsset(p.audio, `pages[${i}].audio`) : '';
    return {
      n: i + 1, text: p.text, ...(p.sentences ? { sentences: p.sentences } : {}), ...(image ? { image } : {}), ...(p.alt ? { alt: p.alt } : {}),
      ...(audio ? { audio: { hash: audio, durationMs: p.audio?.durationMs ?? 20000, ...(p.timing ? { timing: p.timing } : {}) } } : {}),
    };
  });
  const musicHash = story.music ? addAsset(story.music.asset, 'music.asset') : '';
  const music = story.music && musicHash
    ? { hash: musicHash, title: story.music.title, licenceId: story.music.licenceId, defaultVolume: story.music.defaultVolume, duckTo: story.music.duckTo } : undefined;
  const extras = {
    ...(story.language ? { language: story.language } : {}), ...(story.narrationLocale ? { narrationLocale: story.narrationLocale } : {}),
    ...(story.activities ? { activities: story.activities } : {}), ...(story.glossary ? { glossary: story.glossary } : {}), ...(music ? { music } : {}),
  };

  const meta = { language: story.language ?? null, categories: story.categories ?? [], objectives: story.objectives ?? [], access: story.access ?? 'open', classification: story.classification ?? null };
  const content = { title: story.title, ageTiers: story.ageTiers, pages, assets: assetMap, extras, meta, assetLicences };
  const contentHash = sha256Tag(canonicalJson(content));
  const fpText = `${story.title}\n${(story.pages ?? []).map((p) => p.text).join('\n')}`;
  const textHash = sha256Hex(fpText.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim());
  const sig = signatureOf(fpText);

  const buildPackage = (version: number) => {
    const pkg: StoryPackage = { schemaVersion: 1, storyId, version, contentHash, title: story.title, ageTiers: story.ageTiers, ...extras, pages, assets: assetMap };
    const json = canonicalJson(pkg);
    const sha = sha256Hex(json);
    return { pkg, json, sha, stagingPath: `${PRIVATE_PACKAGE_PREFIX}${storyId}/v${version}/${sha.slice(0, 16)}.json` };
  };
  if (!problems.length) {
    const { pkg } = buildPackage(1);
    for (const p of validateStoryPackage(pkg)) problems.push(p);
  }
  const aspects = aspectHashes(buildPackage(1).pkg, assetLicences);
  return { storyId, contentHash, textHash, sig, assets, buildPackage, assetLicences, aspects, problems };
}

// -------------------------------------------------------------------------------------------------------- options

export interface SeedOptions {
  /** Identifies this runner (several may run at once). */
  owner: string;
  parallel?: number;
  /** How long a claimed item stays reserved if its runner dies. */
  leaseMs?: number;
  /** Attempts per item across all runs before it is left as failed. */
  maxAttempts?: number;
  /** Immediate retries inside one run for transient errors and version races. */
  maxInlineRetries?: number;
}

export interface SeedSummary {
  jobId: string;
  total: number;
  outcomes: Partial<Record<ItemOutcome, number>>;
  skippedFinal: number;
  skippedBusy: number;
  failed: number;
  lostClaim: number;
  alreadyCompleted: boolean;
  completed: boolean;
  durationMs: number;
}

class LostClaim extends Error { constructor() { super('claim lost'); } }
class VersionRace extends Error { constructor() { super('version race'); } }

const FINAL_STATES = new Set(['done', 'blocked', 'invalid', 'rollback_skipped']);
const itemPath = (jobId: string, key: string) => `${JOBS_COLLECTION}/${jobId}/items/${key}`;
const adminPath = (id: string) => `${ADMIN_COLLECTION}/${id}`;
const textIndexPath = (h: string) => `${INDEX_ROOT}/text/${h}`;
const bandPath = (k: string) => `${INDEX_ROOT}/bands/${k}`;

/** True while a seeded story is still untouched by any human editor or downstream publication state. */
const isUntouchedSeed = (admin: Doc | undefined): boolean =>
  !!admin
  && (admin.status === 'approved' || admin.status === 'draft')
  && admin.createdBy === SEEDER_UID
  && (admin.lastEditedBy ?? admin.createdBy) === SEEDER_UID
  && (admin.approvedBy ?? SEEDER_UID) === SEEDER_UID;

export function jobIdFor(stories: StoryInput[]): string {
  const parts = stories.map((s) => `${s.storyKey}:${prepare(s).contentHash}:${s.duplicateDecision?.of ?? ''}`).sort();
  return `job-${sha256Hex(parts.join('|')).slice(0, 16)}`;
}

// ------------------------------------------------------------------------------------------------------------ run

/** Retry infrastructure errors on every backend call (the per-story commit has its own, finer-grained loop). */
function resilient(inner: SeedBackend, tries: number): SeedBackend {
  const retry = async <T>(run: () => Promise<T>): Promise<T> => {
    for (let i = 0; ; i++) {
      try { return await run(); } catch (e) { if (!(e instanceof TransientError) || i >= tries) throw e; }
    }
  };
  return {
    now: () => inner.now(),
    putObjectIfAbsent: (p, by, ct, sha) => retry(() => inner.putObjectIfAbsent(p, by, ct, sha)),
    transact: (fn) => retry(() => inner.transact(fn)),
    listDocs: (c) => retry(() => inner.listDocs(c)),
  };
}

export async function runSeed(backend: SeedBackend, stories: StoryInput[], opts: SeedOptions): Promise<SeedSummary> {
  const b = resilient(backend, 4);
  const started = Date.now();
  assertSyntheticOnly(stories);
  const keys = new Set<string>();
  for (const s of stories) {
    if (keys.has(s.storyKey)) throw new Error(`Duplicate storyKey in manifest: ${s.storyKey}`);
    keys.add(s.storyKey);
  }
  const o = { parallel: 4, leaseMs: 120_000, maxAttempts: 5, maxInlineRetries: 3, ...opts };
  const jobId = jobIdFor(stories);
  const summary: SeedSummary = { jobId, total: stories.length, outcomes: {}, skippedFinal: 0, skippedBusy: 0, failed: 0, lostClaim: 0, alreadyCompleted: false, completed: false, durationMs: 0 };

  const state = await b.transact(async (tx) => {
    const job = await tx.get(`${JOBS_COLLECTION}/${jobId}`);
    if (!job) tx.set(`${JOBS_COLLECTION}/${jobId}`, { jobId, state: 'running', total: stories.length, createdBy: o.owner, createdAt: b.now(), synthetic: true });
    else if (job.state === 'rolled_back') tx.set(`${JOBS_COLLECTION}/${jobId}`, { ...job, state: 'running', reseededAt: b.now() });
    return job?.state as string | undefined;
  });
  if (state === 'completed') {
    summary.alreadyCompleted = true; summary.completed = true; summary.skippedFinal = stories.length;
    summary.durationMs = Date.now() - started;
    return summary;
  }

  let next = 0;
  const worker = async () => {
    while (next < stories.length) {
      const story = stories[next++];
      const r = await processStory(b, jobId, story, o);
      if (r.kind === 'outcome') summary.outcomes[r.outcome] = (summary.outcomes[r.outcome] ?? 0) + 1;
      else if (r.kind === 'final') summary.skippedFinal++;
      else if (r.kind === 'busy') summary.skippedBusy++;
      else if (r.kind === 'failed') summary.failed++;
      else summary.lostClaim++;
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, o.parallel) }, worker));

  const items = await b.listDocs(`${JOBS_COLLECTION}/${jobId}/items`);
  summary.completed = items.length === stories.length && items.every((i) => FINAL_STATES.has(i.data.state));
  if (summary.completed) {
    await b.transact(async (tx) => {
      const job = await tx.get(`${JOBS_COLLECTION}/${jobId}`);
      if (job && job.state !== 'completed') tx.set(`${JOBS_COLLECTION}/${jobId}`, { ...job, state: 'completed', finishedAt: b.now() });
    });
  }
  summary.durationMs = Date.now() - started;
  return summary;
}

type ItemResult =
  | { kind: 'outcome'; outcome: ItemOutcome }
  | { kind: 'final' } | { kind: 'busy' } | { kind: 'failed' } | { kind: 'lost' };

async function processStory(b: SeedBackend, jobId: string, story: StoryInput, o: Required<SeedOptions>): Promise<ItemResult> {
  const prep = prepare(story);
  const id = story.storyKey;

  if (prep.problems.length) {
    const key = STORY_ID_RE.test(id) ? id : `invalid-${sha256Hex(String(id)).slice(0, 12)}`;
    await b.transact(async (tx) => {
      const it = await tx.get(itemPath(jobId, key));
      if (it && FINAL_STATES.has(it.state)) return;
      tx.set(itemPath(jobId, key), { storyKey: String(id), state: 'invalid', outcome: 'invalid', problems: prep.problems.slice(0, 10), jobId, updatedAt: b.now() });
    });
    return { kind: 'outcome', outcome: 'invalid' };
  }

  const claim = await b.transact(async (tx) => {
    const it = await tx.get(itemPath(jobId, id));
    const now = b.now();
    let attempts = 1;
    if (it) {
      if (FINAL_STATES.has(it.state)) return 'final' as const;
      if (it.state === 'in_progress' && it.claimExpiresAt > now) return 'busy' as const;
      if (it.state === 'failed' && (it.attempts ?? 0) >= o.maxAttempts) return 'final' as const;
      attempts = it.state === 'rolled_back' ? 1 : (it.attempts ?? 0) + 1;
    }
    tx.set(itemPath(jobId, id), { storyKey: id, state: 'in_progress', owner: o.owner, claimExpiresAt: now + o.leaseMs, attempts, contentHash: prep.contentHash, jobId, updatedAt: now });
    return 'claimed' as const;
  });
  if (claim === 'final') return { kind: 'final' };
  if (claim === 'busy') return { kind: 'busy' };

  for (let attempt = 0; ; attempt++) {
    try {
      const version = await nextVersion(b, id);
      const pkg = prep.buildPackage(version);
      for (const a of prep.assets) await stage(b, a.stagingPath, a.bytes, a.contentType, a.hash.slice(7));
      await stage(b, pkg.stagingPath, new TextEncoder().encode(pkg.json), 'application/json', pkg.sha);
      const outcome = await commit(b, jobId, story, prep, version, pkg, o.owner);
      return { kind: 'outcome', outcome };
    } catch (e) {
      if (e instanceof ProcessCrash) throw e; // a dead process records nothing
      if (e instanceof LostClaim) return { kind: 'lost' };
      if (e instanceof VersionRace && attempt < o.maxInlineRetries + 5) continue;
      if (e instanceof TransientError && attempt < o.maxInlineRetries) continue;
      const msg = e instanceof Error ? e.message : String(e);
      try {
        await b.transact(async (tx) => {
          const it = await tx.get(itemPath(jobId, id));
          if (it && it.owner === o.owner && it.state === 'in_progress') tx.set(itemPath(jobId, id), { ...it, state: 'failed', error: msg.slice(0, 300), updatedAt: b.now() });
        });
      } catch (e2) { if (e2 instanceof ProcessCrash) throw e2; /* leave the lease to expire */ }
      return { kind: 'failed' };
    }
  }
}

async function nextVersion(b: SeedBackend, id: string): Promise<number> {
  return b.transact(async (tx) => ((await tx.get(adminPath(id)))?.latestSeededVersion ?? 0) + 1);
}

async function stage(b: SeedBackend, path: string, bytes: Uint8Array, contentType: string, sha: string) {
  const r = await b.putObjectIfAbsent(path, bytes, contentType, sha);
  if (r === 'exists_different') throw new Error(`staged object ${path} exists with different content`);
}

const SNAPSHOT_KEYS = ['version', 'contentHash', 'classification', 'assetLicences', 'aspects', 'title', 'packagePath', 'packageHash', 'packageBytes', 'pageCount', 'assetCount', 'ageTiers',
  'language', 'categories', 'objectives', 'access', 'licence', 'fingerprints', 'lastJobId', 'duplicateOverride'];
const pick = (d: Doc, keys: string[]) => Object.fromEntries(keys.filter((k) => d[k] !== undefined).map((k) => [k, d[k]]));

async function loadBuckets(tx: Tx, keys: string[]): Promise<Map<string, Doc | undefined>> {
  const entries = await Promise.all(keys.map(async (k) => [bandPath(k), await tx.get(bandPath(k))] as const));
  return new Map(entries);
}

/** Remove `id` from the index buckets/text doc (mutates the working copies; the caller writes them). */
function indexRemove(buckets: Map<string, Doc | undefined>, id: string, sig: number[]) {
  for (const k of bandKeys(sig)) {
    const cur = buckets.get(bandPath(k));
    if (cur?.entries?.[id]) { const e = { ...cur.entries }; delete e[id]; buckets.set(bandPath(k), { entries: e }); }
  }
}
function indexAdd(buckets: Map<string, Doc | undefined>, id: string, sig: number[]) {
  const packed = packSignature(sig);
  for (const k of bandKeys(sig)) {
    const cur = buckets.get(bandPath(k));
    buckets.set(bandPath(k), { entries: { ...(cur?.entries ?? {}), [id]: packed } });
  }
}
function flushBuckets(tx: Tx, buckets: Map<string, Doc | undefined>) {
  for (const [p, d] of buckets) {
    if (!d) continue;
    if (Object.keys(d.entries ?? {}).length === 0) tx.delete(p); else tx.set(p, d);
  }
}

async function commit(
  b: SeedBackend, jobId: string, story: StoryInput, prep: Prepared, version: number,
  pkg: { pkg: StoryPackage; json: string; sha: string; stagingPath: string }, owner: string,
): Promise<ItemOutcome> {
  const id = story.storyKey;
  return b.transact(async (tx) => {
    const now = b.now();
    const it = await tx.get(itemPath(jobId, id));
    if (!it || it.owner !== owner || it.state !== 'in_progress') throw new LostClaim();
    const admin = await tx.get(adminPath(id));
    const done = (outcome: ItemOutcome, extra: Doc = {}) => {
      tx.set(itemPath(jobId, id), { ...it, state: outcome.startsWith('blocked') ? 'blocked' : 'done', outcome, version: extra.version ?? admin?.version ?? null, finishedAt: now, updatedAt: now, ...extra });
      return outcome;
    };

    if (admin && admin.latestSeededContentHash === prep.contentHash) return done('unchanged', { version: admin.version });
    if (((admin?.latestSeededVersion ?? 0) + 1) !== version) throw new VersionRace();

    // ---- duplicate check (race-safe: index docs are read in this transaction, so a concurrent writer forces a retry)
    const newBandKeys = bandKeys(prep.sig);
    const oldSig: number[] | undefined = isUntouchedSeed(admin) ? admin?.fingerprints?.sig : undefined;
    const oldBandKeys = oldSig ? bandKeys(oldSig) : [];
    const buckets = await loadBuckets(tx, [...new Set([...newBandKeys, ...oldBandKeys])]);
    const textDoc = await tx.get(textIndexPath(prep.textHash));

    let dup: { kind: 'exact' | 'near'; of: string; sim: number } | null = null;
    if (textDoc && textDoc.storyKey !== id) dup = { kind: 'exact', of: textDoc.storyKey, sim: 1 };
    if (!dup) {
      for (const k of newBandKeys) {
        for (const [other, rawSig] of Object.entries<string | number[]>(buckets.get(bandPath(k))?.entries ?? {})) {
          if (other === id) continue;
          const sim = estimateJaccard(prep.sig, unpackSignature(rawSig));
          if (sim >= NEAR_DUPLICATE_THRESHOLD && (!dup || sim > dup.sim)) dup = { kind: 'near', of: other, sim };
        }
      }
    }
    let override: Doc | undefined;
    if (dup) {
      const dec = story.duplicateDecision;
      if (dec?.allow === true && dec.of === dup.of && dec.note) override = { of: dup.of, note: dec.note, similarity: dup.sim, kind: dup.kind };
      else return done(dup.kind === 'exact' ? 'blocked_exact_duplicate' : 'blocked_near_duplicate', { matchedKey: dup.of, similarity: Math.round(dup.sim * 1000) / 1000 });
    }

    const fields: Doc = {
      version, latestSeededVersion: version, latestSeededContentHash: prep.contentHash, contentHash: prep.contentHash,
      title: story.title, packagePath: pkg.stagingPath, packageHash: `sha256:${pkg.sha}`, packageBytes: pkg.json.length,
      pageCount: story.pages.length, assetCount: prep.assets.length, ageTiers: story.ageTiers, language: story.language ?? null,
      categories: story.categories ?? [], objectives: story.objectives ?? [], access: story.access ?? 'open', licence: story.licence,
      classification: story.classification ?? null, assetLicences: prep.assetLicences, aspects: prep.aspects,
      fingerprints: { textHash: prep.textHash, titleSlug: titleSlug(story.title), sig: prep.sig },
      lastJobId: jobId, ...(override ? { duplicateOverride: override } : {}),
    };

    if (!admin) {
      tx.set(adminPath(id), {
        storyKey: id, status: 'approved', createdBy: SEEDER_UID, lastEditedBy: SEEDER_UID, approvedBy: SEEDER_UID, approvedAt: now,
        seededBy: SEEDER_UID, synthetic: true, createdAt: now, updatedAt: now, revisions: [], ...fields,
      });
      indexAdd(buckets, id, prep.sig); flushBuckets(tx, buckets); tx.set(textIndexPath(prep.textHash), { storyKey: id, at: now });
      return done('created', { version });
    }

    // Updated in place ONLY while no human editor or downstream publish workflow has touched the seeded copy.
    if (isUntouchedSeed(admin)) {
      const revisions = [...(admin.revisions ?? []), pick(admin, SNAPSHOT_KEYS)].slice(-20);
      if (oldSig) indexRemove(buckets, id, oldSig);
      indexAdd(buckets, id, prep.sig); flushBuckets(tx, buckets);
      const oldText = admin.fingerprints?.textHash;
      if (oldText && oldText !== prep.textHash) tx.delete(textIndexPath(oldText));
      tx.set(textIndexPath(prep.textHash), { storyKey: id, at: now });
      tx.set(adminPath(id), { ...admin, ...fields, status: 'approved', lastEditedBy: SEEDER_UID, approvedBy: SEEDER_UID, approvedAt: now, updatedAt: now, revisions });
      return done('updated_draft', { version });
    }

    // The story was modified by a human or published/archived: stage the new version beside it as approved.
    tx.set(`${adminPath(id)}/pending_versions/${version}`, {
      storyKey: id, status: 'approved', createdBy: SEEDER_UID, lastEditedBy: SEEDER_UID, approvedBy: SEEDER_UID, approvedAt: now,
      synthetic: true, createdAt: now, updatedAt: now, basedOnVersion: admin.version, ...fields,
    });
    tx.set(adminPath(id), { ...admin, latestSeededVersion: version, latestSeededContentHash: prep.contentHash });
    return done('pending_version', { version });
  });
}

// ------------------------------------------------------------------------------------------------------ rollback

export interface RollbackSummary { jobId: string; rolledBack: number; keptHumanModified: number; alreadyGone: number; nothingToDo: number }

/**
 * Undo a job: remove what it created and restore what it updated, but ONLY where the document is still an untouched
 * seeded story written by this job. Anything a person has edited or published is kept and reported.
 */
export async function rollbackJob(b: SeedBackend, jobId: string): Promise<RollbackSummary> {
  const items = await b.listDocs(`${JOBS_COLLECTION}/${jobId}/items`);
  const out: RollbackSummary = { jobId, rolledBack: 0, keptHumanModified: 0, alreadyGone: 0, nothingToDo: 0 };
  for (const { id, data } of items) {
    if (data.state !== 'done' || !['created', 'updated_draft', 'pending_version'].includes(data.outcome)) { out.nothingToDo++; continue; }
    const r = await b.transact(async (tx) => {
      const itemP = itemPath(jobId, id);
      const admin = await tx.get(adminPath(id));
      const mark = (state: 'rolled_back' | 'rollback_skipped', reason?: string) => tx.set(itemP, { ...data, state, ...(reason ? { rollbackReason: reason } : {}), updatedAt: b.now() });

      if (data.outcome === 'pending_version') {
        const pp = `${adminPath(id)}/pending_versions/${data.version}`;
        const pend = await tx.get(pp);
        if (!pend) { mark('rolled_back'); return 'gone' as const; }
        if ((pend.status !== 'approved' && pend.status !== 'draft') || pend.lastJobId !== jobId) { mark('rollback_skipped', 'pending version changed by a person'); return 'kept' as const; }
        tx.delete(pp);
        if (admin && admin.latestSeededVersion === data.version) tx.set(adminPath(id), { ...admin, latestSeededContentHash: '' });
        mark('rolled_back');
        return 'done' as const;
      }

      if (!admin) { mark('rolled_back'); return 'gone' as const; }
      const untouched = isUntouchedSeed(admin) && admin.lastJobId === jobId && admin.version === data.version;
      if (!untouched) { mark('rollback_skipped', 'document changed by a person or a later job'); return 'kept' as const; }

      const sig: number[] = admin.fingerprints?.sig ?? [];
      const keys = bandKeys(sig);
      if (data.outcome === 'created') {
        const buckets = await loadBuckets(tx, keys);
        const t = await tx.get(textIndexPath(admin.fingerprints?.textHash)); // all reads before any write
        indexRemove(buckets, id, sig); flushBuckets(tx, buckets);
        if (t?.storyKey === id) tx.delete(textIndexPath(admin.fingerprints.textHash));
        tx.delete(adminPath(id));
        mark('rolled_back');
        return 'done' as const;
      }
      // updated_draft: restore the previous revision
      const revisions: Doc[] = [...(admin.revisions ?? [])];
      const prev = revisions.pop();
      if (!prev) { mark('rollback_skipped', 'no previous revision to restore'); return 'kept' as const; }
      const prevSig: number[] = prev.fingerprints?.sig ?? [];
      const buckets = await loadBuckets(tx, [...new Set([...keys, ...bandKeys(prevSig)])]);
      indexRemove(buckets, id, sig); indexAdd(buckets, id, prevSig); flushBuckets(tx, buckets);
      if (admin.fingerprints?.textHash) tx.delete(textIndexPath(admin.fingerprints.textHash));
      if (prev.fingerprints?.textHash) tx.set(textIndexPath(prev.fingerprints.textHash), { storyKey: id, at: b.now() });
      const now = b.now();
      tx.set(adminPath(id), {
        ...admin, ...prev, status: 'approved', lastEditedBy: SEEDER_UID, approvedBy: SEEDER_UID, approvedAt: now,
        revisions, latestSeededContentHash: prev.contentHash, latestSeededVersion: admin.latestSeededVersion, updatedAt: now,
      });
      mark('rolled_back');
      return 'done' as const;
    });
    if (r === 'done') out.rolledBack++; else if (r === 'kept') out.keptHumanModified++; else out.alreadyGone++;
  }
  await b.transact(async (tx) => {
    const job = await tx.get(`${JOBS_COLLECTION}/${jobId}`);
    if (job) tx.set(`${JOBS_COLLECTION}/${jobId}`, { ...job, state: 'rolled_back', rolledBackAt: b.now() });
  });
  return out;
}
