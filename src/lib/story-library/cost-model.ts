/**
 * Story Library cost model (design stage). Pure arithmetic: no network, no Firebase, no credentials.
 *
 *   node --experimental-strip-types src/lib/story-library/cost-model.ts          # markdown tables
 *   node --experimental-strip-types src/lib/story-library/cost-model.ts --json   # machine-readable
 * Unit tests: src/lib/story-library/cost-model.test.ts (pricing snapshot, linearity, ordering, tier maths).
 *
 * EVERY number in PRICING was read from the official page named in `source` on 2026-11-07.
 * Every number in ASSUMPTIONS is an assumption, not a measurement: replace with pilot data.
 * Erasable TypeScript syntax only (no enums / parameter properties) so Node can strip types.
 */

export const PRICING = {
  asOf: '2026-11-07',
  firestore: {
    source: 'https://cloud.google.com/firestore/pricing (Standard edition, on-demand)',
    readPer100k: 0.03,
    writePer100k: 0.09,
    freeReadsPerDay: 50_000, // one free database per project
    freeWritesPerDay: 20_000,
    // The page lists $0.000205479 per GiB with no unit in the extracted text. Cloud Storage's page lists hourly rates, so
    // this is read as per GiB-HOUR: x 730 = about $0.15 per GiB-month. UNVERIFIED unit; does not affect any total because
    // the catalogue (a few MB) sits inside the free 1 GiB.
    storedGiBMonth: 0.000205479 * 730,
    egressPerGiB: 0.12, // worldwide internet, 10 GiB/month free (page lists same tiers as GCS)
    egressFreeGiB: 10,
  },
  gcs: {
    source: 'https://cloud.google.com/storage/pricing (Standard, us-central1 regional / multi-region)',
    storedGiBMonthRegional: 0.02,
    storedGiBMonthMulti: 0.026,
    classBPer1k: 0.0004, // regional + multi-region, flat namespace
    classAPer1kRegional: 0.005,
    // egress to internet, worldwide excluding Asia/Australia, per GiB (Ghana falls in this row; Africa is not
    // listed separately, so treating it as "worldwide" is an ASSUMPTION)
    egressTier1PerGiB: 0.12, // 0-10 TiB / month
    egressTier2PerGiB: 0.11, // 10-150 TiB / month
  },
  hosting: {
    source: 'https://firebase.google.cn/docs/hosting/usage-quotas-pricing (mirror of firebase.google.com)',
    transferPerGB: 0.15, // hits AND misses count; so Hosting is NOT cheaper than Storage egress
    storagePerGB: 0.026,
  },
  cloudCdn: {
    source: 'https://cloud.google.com/cdn/pricing',
    egressOtherDestPerGiB_0_10TiB: 0.09, // "all other destinations"; Africa not listed -> CLOSEST MATCH, unconfirmed
    egressOtherDestPerGiB_10_150TiB: 0.06,
    cacheFillPerGiBInterRegion: 0.04, // conservative: origin bucket outside Africa
    lookupPer10kRequests: 0.0075,
    // NOT VERIFIED and NOT INCLUDED: external HTTPS load balancer fixed + per-GB charges for the backend bucket,
    // Cloud CDN invalidation charges, whether origin->CDN fill from a bucket is billed again as GCS egress.
  },
};

export interface Assumptions {
  learners: number; // active learners / month
  schools: number;
  sessionsPerLearnerMonth: number;
  opensPerSession: number; // stories opened per session
  deviceCacheHit: number; // fraction of opens served from the device's IndexedDB cache (no network)
  edgeCacheHit: number; // option C only: fraction of device misses served by CDN edge without origin fill
  packageMB: number; // text + media actually downloaded per uncached open
  filesPerPackage: number; // GETs per uncached open (1 package.json + images + audio)
  catalogueDocBytes: number;
  fullStoryDocBytes: number; // option A: one doc with embedded pages
  cataloguePageSize: number;
  cataloguePagesPerSession: number; // option A browsing (no bundle, no persistent cache)
  checkpointsPerOpen: number; // batched progress writes per open
  naiveWritesPerOpen: number; // write per page turn, for comparison
  teacherViewsPerSchoolMonth: number;
  studentsPerTeacherView: number;
  storiesInLibrary: number;
  versionsKept: number;
  /** Fraction of a full package's bytes / files an uncached open actually downloads (lazy loading). 1 = eager. */
  lazyBytesFactor: number;
  lazyFilesFactor: number;
  /** Firestore reads billed to rules lookups per library request (profile docs + school doc). ASSUMPTION. */
  rulesReadsPerLibraryRequest: number;
  /** Firestore reads billed to rules lookups per Storage file read (B-lookup only; rule allows at most 2). ASSUMPTION. */
  rulesReadsPerStorageFile: number;
}

export const BASE: Assumptions = {
  learners: 100_000,
  schools: 1_000,
  sessionsPerLearnerMonth: 12, // ~3 per week
  opensPerSession: 2,
  deviceCacheHit: 0.6,
  edgeCacheHit: 0.9,
  packageMB: 1.2, // ~10 pages: ~0.5 MB webp images + ~0.6 MB opus speech + text. UNMEASURED.
  filesPerPackage: 21,
  catalogueDocBytes: 1_500,
  fullStoryDocBytes: 20_000,
  cataloguePageSize: 20,
  cataloguePagesPerSession: 3,
  checkpointsPerOpen: 1.5,
  naiveWritesPerOpen: 10,
  teacherViewsPerSchoolMonth: 400, // 20 teachers x 20 views
  studentsPerTeacherView: 30,
  storiesInLibrary: 2_000,
  versionsKept: 3,
  lazyBytesFactor: 1, // BASE = the eager, no-rules-lookup assumptions of the first design pass
  lazyFilesFactor: 1,
  rulesReadsPerLibraryRequest: 0,
  rulesReadsPerStorageFile: 1.5,
};

/**
 * MEASURED with the real StoryLoader on a synthetic 10-page story (src/lib/story-library/lazy-measurement.ts,
 * guarded by lazy-measurement.test.ts). The reading-behaviour mix behind it is an assumption: 70% finish, 30% stop at
 * page 3; 50% listen, 30% follow, 20% solo (no narration). Re-measure with pilot data.
 */
export const MEASURED_LAZY = { bytesFactor: 0.734, filesFactor: 0.753 };

/** Stage 1 estimate: lazy loading measured, plus the Firestore reads that the implemented rules lookups cause. */
export const REVISED: Assumptions = {
  ...BASE,
  lazyBytesFactor: MEASURED_LAZY.bytesFactor,
  lazyFilesFactor: MEASURED_LAZY.filesFactor,
  rulesReadsPerLibraryRequest: 3, // staff/users doc (up to 2) + school-eligibility doc (1)
  rulesReadsPerStorageFile: 1.5, // users doc, or staff doc for older accounts (rule allows 2 lookups at most)
};

const GiB = 1024 ** 3;
const MB = 1e6;

export function firestoreOps(reads: number, writes: number, egressGiB: number) {
  const f = PRICING.firestore;
  const paidReads = Math.max(0, reads - f.freeReadsPerDay * 30);
  const paidWrites = Math.max(0, writes - f.freeWritesPerDay * 30);
  const egress = Math.max(0, egressGiB - f.egressFreeGiB) * f.egressPerGiB;
  return (paidReads / 1e5) * f.readPer100k + (paidWrites / 1e5) * f.writePer100k + egress;
}

export function gcsEgress(gib: number) {
  const g = PRICING.gcs;
  const t1 = Math.min(gib, 10 * 1024);
  const t2 = Math.max(0, gib - 10 * 1024);
  return t1 * g.egressTier1PerGiB + t2 * g.egressTier2PerGiB;
}

export function cdnEgress(gib: number) {
  const c = PRICING.cloudCdn;
  const t1 = Math.min(gib, 10 * 1024);
  const t2 = Math.max(0, gib - 10 * 1024);
  return t1 * c.egressOtherDestPerGiB_0_10TiB + t2 * c.egressOtherDestPerGiB_10_150TiB;
}

export interface Result {
  option: string;
  firestoreReads: number;
  firestoreWrites: number;
  storageGets: number;
  mediaGiB: number;
  firestoreUsd: number;
  storageUsd: number;
  cdnUsd: number;
  totalUsd: number;
  perLearnerUsd: number;
}

export type OptionKey = 'A' | 'B' | 'B-lookup' | 'C';

/**
 * A  = full story docs in Firestore (pages embedded in one doc), media in Storage, catalogue = the same docs, paged.
 * B  = compact catalogue + immutable packages in Storage; versioned pointer doc, client cache; Storage rules need NO
 *      Firestore lookup for published content.
 * B-lookup = B, but keeping the existing pattern of school-membership lookups inside Storage rules (1-2 reads/file).
 * C  = B's catalogue + packages served by Cloud CDN from public immutable URLs.
 */
export function model(key: OptionKey, a: Assumptions): Result {
  const sessions = a.learners * a.sessionsPerLearnerMonth;
  const opens = sessions * a.opensPerSession;
  const misses = opens * (1 - a.deviceCacheHit);
  const teacherReads = a.schools * a.teacherViewsPerSchoolMonth * a.studentsPerTeacherView;
  // per session: 1 progress doc + 1 class-assignments doc (all options)
  const commonReads = sessions * 2 + teacherReads;
  const writes = opens * a.checkpointsPerOpen;

  let reads = commonReads;
  let fsEgressGiB = 0;
  let gets = 0;
  let mediaGiB = 0;

  if (key === 'A') {
    const browseDocs = sessions * a.cataloguePagesPerSession * a.cataloguePageSize;
    reads += browseDocs + misses + sessions * a.cataloguePagesPerSession * a.rulesReadsPerLibraryRequest; // full docs; 1 doc per un-cached open
    fsEgressGiB = (browseDocs * a.fullStoryDocBytes + misses * a.fullStoryDocBytes) / GiB;
    gets = misses * (a.filesPerPackage - 1) * a.lazyFilesFactor; // media only; text came with the doc
    mediaGiB = (misses * a.packageMB * MB * 0.95 * a.lazyBytesFactor) / GiB; // text is ~5% of the package
  } else {
    reads += sessions * (1 + a.rulesReadsPerLibraryRequest); // versioned pointer doc, once per session (+ rules lookups)
    // catalogue bundle fetched from Storage only when the version changes (counted as GETs, not reads)
    const publishesPerMonth = 8;
    gets = misses * a.filesPerPackage * a.lazyFilesFactor + a.learners * publishesPerMonth * 0.5;
    mediaGiB = (misses * a.packageMB * MB * a.lazyBytesFactor) / GiB;
    if (key === 'B-lookup') reads += misses * a.filesPerPackage * a.lazyFilesFactor * a.rulesReadsPerStorageFile;
  }

  let firestoreUsd = firestoreOps(reads, writes, fsEgressGiB);
  let storageUsd = 0;
  let cdnUsd = 0;
  const stored = a.storiesInLibrary * a.packageMB * a.versionsKept * MB / GiB;
  storageUsd += stored * PRICING.gcs.storedGiBMonthMulti;
  storageUsd += (gets / 1000) * PRICING.gcs.classBPer1k;

  if (key === 'C') {
    const edgeMissGiB = mediaGiB * (1 - a.edgeCacheHit);
    cdnUsd = cdnEgress(mediaGiB) + edgeMissGiB * PRICING.cloudCdn.cacheFillPerGiBInterRegion +
      (gets / 1e4) * PRICING.cloudCdn.lookupPer10kRequests;
    // origin only sees edge misses
    storageUsd = stored * PRICING.gcs.storedGiBMonthMulti + ((gets * (1 - a.edgeCacheHit)) / 1000) * PRICING.gcs.classBPer1k;
  } else {
    storageUsd += gcsEgress(mediaGiB);
  }

  const totalUsd = firestoreUsd + storageUsd + cdnUsd;
  return {
    option: key, firestoreReads: reads, firestoreWrites: writes, storageGets: gets, mediaGiB,
    firestoreUsd, storageUsd, cdnUsd, totalUsd, perLearnerUsd: totalUsd / a.learners,
  };
}

export const SCALE_POINTS: Array<{ name: string; learners: number; schools: number }> = [
  { name: 'Pilot (10 schools)', learners: 1_000, schools: 10 },
  { name: '100 schools', learners: 10_000, schools: 100 },
  { name: 'Target (1,000 schools)', learners: 100_000, schools: 1_000 },
  { name: '5x target', learners: 500_000, schools: 5_000 },
];

export const CACHE_SCENARIOS: Array<{ name: string; hit: number }> = [
  { name: 'worst (20% device hit)', hit: 0.2 },
  { name: 'typical (60%)', hit: 0.6 },
  { name: 'best (85%)', hit: 0.85 },
];

/** Progress-write cost: naive (per page turn) vs batched checkpoints at the target scale. */
export function progressWrites(a: Assumptions) {
  const opens = a.learners * a.sessionsPerLearnerMonth * a.opensPerSession;
  const naive = opens * a.naiveWritesPerOpen;
  const batched = opens * a.checkpointsPerOpen;
  const usd = (w: number) => firestoreOps(0, w, 0);
  return { naiveWrites: naive, batchedWrites: batched, naiveUsd: usd(naive), batchedUsd: usd(batched) };
}

const fmt = (n: number) => (n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(0) + 'k' : n.toFixed(0));
const usd = (n: number) => '$' + (n < 10 ? n.toFixed(2) : n.toFixed(0));

function main() {
  const asJson = process.argv.includes('--json');
  const A0 = process.argv.includes('--first-pass') ? BASE : REVISED;
  const out: Record<string, unknown> = { pricing: PRICING, assumptions: A0, measuredLazy: MEASURED_LAZY };
  const lines: string[] = [];
  const keys: OptionKey[] = ['A', 'B', 'B-lookup', 'C'];

  lines.push(`### Scale (typical cache: 60% device hit; ${process.argv.includes('--first-pass') ? 'first-pass assumptions' : 'Stage 1 revised assumptions'})\n`);
  lines.push('| Scale | Option | Firestore reads/mo | Firestore writes/mo | Storage GETs/mo | Media GiB/mo | Firestore $ | Storage $ | CDN $ | Total $/mo | $/learner/mo |');
  lines.push('|---|---|---|---|---|---|---|---|---|---|---|');
  const scale: unknown[] = [];
  for (const s of SCALE_POINTS) for (const k of keys) {
    const r = model(k, { ...A0, learners: s.learners, schools: s.schools });
    scale.push({ scale: s.name, ...r });
    lines.push(`| ${s.name} | ${k} | ${fmt(r.firestoreReads)} | ${fmt(r.firestoreWrites)} | ${fmt(r.storageGets)} | ${r.mediaGiB.toFixed(0)} | ${usd(r.firestoreUsd)} | ${usd(r.storageUsd)} | ${usd(r.cdnUsd)} | **${usd(r.totalUsd)}** | ${(r.perLearnerUsd).toFixed(4)} |`);
  }
  out.scale = scale;

  lines.push('\n### Cache sensitivity at target scale (100,000 learners)\n');
  lines.push('| Device cache | Option | Media GiB/mo | Total $/mo |');
  lines.push('|---|---|---|---|');
  const cache: unknown[] = [];
  for (const c of CACHE_SCENARIOS) for (const k of keys) {
    const r = model(k, { ...A0, deviceCacheHit: c.hit });
    cache.push({ scenario: c.name, ...r });
    lines.push(`| ${c.name} | ${k} | ${r.mediaGiB.toFixed(0)} | ${usd(r.totalUsd)} |`);
  }
  out.cache = cache;

  const p = progressWrites(A0);
  out.progress = p;
  lines.push('\n### Progress writes at target scale\n');
  lines.push(`Per-page-turn writes: ${fmt(p.naiveWrites)}/mo = ${usd(p.naiveUsd)}; batched checkpoints: ${fmt(p.batchedWrites)}/mo = ${usd(p.batchedUsd)}.`);

  const hosting = (model('B', A0).mediaGiB * 1.0737) * PRICING.hosting.transferPerGB; // GiB->GB approx
  out.hostingAsCdn = hosting;
  lines.push(`\nFor reference, serving the same target-scale media via Firebase Hosting would be about ${usd(hosting)}/mo (transfer only, hits and misses both counted): not cheaper than Storage egress.`);

  if (asJson) console.log(JSON.stringify(out, null, 2));
  else console.log(lines.join('\n'));
}

if (process.argv[1] && process.argv[1].endsWith('cost-model.ts')) main();
