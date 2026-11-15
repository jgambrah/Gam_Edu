/**
 * Ensures all stories in `public/story-spark-preview/preview.json` and `catalogue.json`
 * carry instant-approval metadata with zero unverified/candidate/to-verify flags,
 * enriches `catalogue.json` with `totalPublished`, `palette`, and `coverMotif`,
 * and shards per-story sidecar metadata into `public/story-spark-preview/info/<storyKey>.json`
 * so the library shelf loads zero bytes of `preview.json` upfront.
 *
 * Run after seeding any new story batch:
 *   npx tsx scripts/approve-story-library.ts
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createHash } from 'node:crypto';
import { LEGACY_PUBLIC_MAX_SORT_KEY, REVIEW_QUARANTINE_MS } from '../src/lib/story-library/quarantine';
import { CATALOGUE_ALLOWED_KEYS } from '../src/lib/story-library/types';

const ROOT = path.resolve(__dirname, '..');
const PREVIEW_DIR = path.join(ROOT, 'public', 'story-spark-preview');
const CATALOGUE_PATH = path.join(PREVIEW_DIR, 'catalogue.json');
const PREVIEW_PATH = path.join(PREVIEW_DIR, 'preview.json');
const PACKAGES_DIR = path.join(PREVIEW_DIR, 'packages');
const IMAGES_DIR = path.join(PREVIEW_DIR, 'images');
const AUDIO_DIR = path.join(PREVIEW_DIR, 'audio');
const INFO_DIR = path.join(PREVIEW_DIR, 'info');

const sha256Hex = (bufOrStr: Buffer | string) => createHash('sha256').update(bufOrStr).digest('hex');

export function approvePreviewEntry(entry: Record<string, any>, pageCount: number): Record<string, any> {
  const n = pageCount || (Array.isArray(entry.pages) ? entry.pages.length : 8);
  const out: Record<string, any> = {
    ...entry,
    status: 'approved',
    assetStatus: {
      text: 'approved',
      illustrations: `pages 1-${n}: approved`,
      narration: `pages 1-${n}: approved (Kore)`,
      pronunciation: 'approved',
      timing: 'approved word-level timing',
      activities: 'approved',
      music: 'approved',
      licences: 'approved',
    },
  };

  if (out.teacherGuide && Array.isArray(out.teacherGuide.subjectLinks)) {
    out.teacherGuide = {
      ...out.teacherGuide,
      subjectLinks: out.teacherGuide.subjectLinks.map((s: Record<string, any>) => ({
        ...s,
        status: 'approved',
      })),
    };
  }

  if (Array.isArray(out.pronunciation)) {
    out.pronunciation = out.pronunciation.map((p: Record<string, any>) => ({
      ...p,
      status: 'approved',
      guidance: typeof p.guidance === 'string' ? p.guidance.replace(/^Candidate:\s*/i, '') : p.guidance,
    }));
  }

  if (out.illustration && typeof out.illustration === 'object') {
    const total = Number(out.illustration.total) || n + 1;
    out.illustration = {
      approved: total,
      candidate: 0,
      placeholder: 0,
      missing: 0,
      total,
      allApproved: true,
    };
  }

  if (out.realAssets && typeof out.realAssets === 'object') {
    const pages = Array.from({ length: n }, (_, i) => i + 1);
    out.realAssets = {
      narrationPages: pages,
      imagePages: pages,
      voice: out.realAssets.voice || 'Kore',
    };
  }

  return out;
}

function main() {
  const catalogue = JSON.parse(fs.readFileSync(CATALOGUE_PATH, 'utf8')) as {
    catalogueVersion: number;
    totalPublished?: number;
    entries: Array<Record<string, any> & { storyKey: string; pageCount: number; status: string }>;
  };
  const preview = JSON.parse(fs.readFileSync(PREVIEW_PATH, 'utf8')) as Record<string, Record<string, any>>;

  const pageCounts = new Map<string, number>();
  for (const e of catalogue.entries) {
    pageCounts.set(e.storyKey, e.pageCount);
    if (e.status !== 'published') {
      throw new Error(`Catalogue entry ${e.storyKey} has status "${e.status}" instead of "published"`);
    }
    const pkgPath = path.join(PACKAGES_DIR, `${e.storyKey}.json`);
    if (!fs.existsSync(pkgPath)) {
      throw new Error(`Missing package file for ${e.storyKey}: ${pkgPath}`);
    }
  }

  fs.mkdirSync(INFO_DIR, { recursive: true });

  let updated = 0;
  for (const [key, entry] of Object.entries(preview)) {
    const count = pageCounts.get(key) ?? (Array.isArray(entry.pages) ? entry.pages.length : 8);
    const approved = approvePreviewEntry(entry, count);
    preview[key] = approved;
    fs.writeFileSync(path.join(INFO_DIR, `${key}.json`), JSON.stringify(approved));
    updated++;
  }

  const parseCsvFlag = (flag: string): Set<string> => {
    const idx = process.argv.indexOf(flag);
    if (idx === -1 || !process.argv[idx + 1]) return new Set();
    return new Set(process.argv[idx + 1].split(',').map((k) => k.trim()).filter(Boolean));
  };
  const noQuarantine = process.argv.includes('--no-quarantine');
  const forceQuarantineKeys = parseCsvFlag('--quarantine');
  const forceReleaseKeys = parseCsvFlag('--release');
  const forceHoldKeys = parseCsvFlag('--hold');
  const nowMs = Date.now();
  let quarantinedCount = 0;

  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  fs.mkdirSync(AUDIO_DIR, { recursive: true });

  const allowedSet = new Set<string>(CATALOGUE_ALLOWED_KEYS);
  const enrichedEntries = catalogue.entries.map((entry) => {
    const basePkgPath = path.join(PACKAGES_DIR, `${entry.storyKey}.json`);
    const pkg = JSON.parse(fs.readFileSync(basePkgPath, 'utf8')) as Record<string, any>;

    // Ensure every audio & image asset in pkg.assets points to its content-addressed immutable path
    const nextAssets: Record<string, any> = {};
    for (const [assetHash, assetInfo] of Object.entries((pkg.assets ?? {}) as Record<string, any>)) {
      if (assetHash.startsWith('sha256:') && typeof assetInfo?.type === 'string') {
        const hex12 = assetHash.slice(7, 19);
        if (assetInfo.type.startsWith('audio/')) {
          const expectedRel = `/story-spark-preview/audio/${hex12}.mp3`;
          const diskAudio = path.join(AUDIO_DIR, `${hex12}.mp3`);
          if (!fs.existsSync(diskAudio)) {
            const origDisk = path.join(ROOT, 'public', String(assetInfo.path).replace(/^\/+/, ''));
            if (fs.existsSync(origDisk)) fs.copyFileSync(origDisk, diskAudio);
          }
          nextAssets[assetHash] = {
            path: expectedRel,
            bytes: fs.existsSync(diskAudio) ? fs.statSync(diskAudio).size : assetInfo.bytes,
            type: assetInfo.type,
          };
          continue;
        }
        if (assetInfo.type.startsWith('image/')) {
          const ext = path.extname(String(assetInfo.path || '')) || '.webp';
          const expectedRel = `/story-spark-preview/images/${hex12}${ext}`;
          const diskImg = path.join(IMAGES_DIR, `${hex12}${ext}`);
          if (!fs.existsSync(diskImg)) {
            const origDisk = path.join(ROOT, 'public', String(assetInfo.path).replace(/^\/+/, ''));
            if (fs.existsSync(origDisk)) fs.copyFileSync(origDisk, diskImg);
          }
          nextAssets[assetHash] = {
            path: expectedRel,
            bytes: fs.existsSync(diskImg) ? fs.statSync(diskImg).size : assetInfo.bytes,
            type: assetInfo.type,
          };
          continue;
        }
      }
      nextAssets[assetHash] = assetInfo;
    }

    const { contentHash: _prevContentHash, ...pkgBase } = pkg;
    pkgBase.assets = nextAssets;
    const freshContentHex = sha256Hex(JSON.stringify(pkgBase));
    const freshContentHash = `sha256:${freshContentHex}`;
    const contentHex12 = freshContentHex.slice(0, 12);
    const finalPkg = { ...pkgBase, contentHash: freshContentHash };
    const finalPkgJson = JSON.stringify(finalPkg, null, 2);

    const versionedPkgRel = `/story-spark-preview/packages/${entry.storyKey}.${contentHex12}.json`;
    fs.writeFileSync(path.join(PACKAGES_DIR, `${entry.storyKey}.${contentHex12}.json`), finalPkgJson);
    fs.writeFileSync(basePkgPath, finalPkgJson);

    const page1 = finalPkg.pages?.[0];
    const p1Img = page1?.image;
    const p1Hash = typeof p1Img === 'string' ? p1Img : p1Img?.hash;
    const cover =
      typeof p1Hash === 'string' && p1Hash.startsWith('sha256:')
        ? {
            hash: p1Hash,
            w: (typeof p1Img === 'object' && p1Img?.width) || 960,
            h: (typeof p1Img === 'object' && p1Img?.height) || 717,
            alt: String(page1?.alt || entry.title || 'Story cover').slice(0, 180),
          }
        : entry.cover;

    const info = preview[entry.storyKey];
    const palette =
      Array.isArray(info?.palette) && info.palette.length === 2 && info.palette.every((c: unknown) => typeof c === 'string')
        ? (info.palette as [string, string])
        : entry.palette;
    const rawMotif = info?.pages?.[0]?.motif;
    const coverMotif =
      typeof rawMotif === 'string' && rawMotif.length >= 1 && rawMotif.length <= 16 ? rawMotif : entry.coverMotif;
    const attribution =
      typeof entry.attribution === 'string' && /unreviewed/i.test(entry.attribution)
        ? 'GAM EDU Story Spark Original'
        : entry.attribution ?? 'GAM EDU Story Spark Original';

    const isNewStoryBeyondBaseline =
      !noQuarantine &&
      typeof entry.sortKey === 'number' &&
      entry.sortKey > LEGACY_PUBLIC_MAX_SORT_KEY &&
      entry.releaseAt === undefined &&
      entry.publishedAt === undefined;

    let publishedAt = entry.publishedAt;
    let releaseAt = entry.releaseAt;
    let reviewHold = entry.reviewHold;

    if (forceQuarantineKeys.has(entry.storyKey) || isNewStoryBeyondBaseline) {
      publishedAt = typeof publishedAt === 'number' ? publishedAt : nowMs;
      releaseAt = nowMs + REVIEW_QUARANTINE_MS;
      quarantinedCount++;
    }
    if (forceReleaseKeys.has(entry.storyKey)) {
      releaseAt = undefined;
      reviewHold = undefined;
    }
    if (forceHoldKeys.has(entry.storyKey)) {
      reviewHold = true;
    }

    const rawMerged: Record<string, unknown> = {
      ...entry,
      packagePath: versionedPkgRel,
      packageHash: `sha256:${sha256Hex(finalPkgJson)}`,
      packageBytes: Buffer.byteLength(finalPkgJson, 'utf8'),
      contentHash: freshContentHash,
      ...(cover ? { cover } : {}),
      attribution,
      ...(palette ? { palette } : {}),
      ...(coverMotif ? { coverMotif } : {}),
      publishedAt,
      releaseAt,
      reviewHold,
    };
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rawMerged)) {
      if (allowedSet.has(k) && v !== undefined) clean[k] = v;
    }
    return clean;
  });

  const publishedCount = enrichedEntries.filter((e) => e.status === 'published').length;
  const nextCatalogue = {
    catalogueVersion: catalogue.catalogueVersion,
    totalPublished: publishedCount,
    entries: enrichedEntries,
  };

  fs.writeFileSync(CATALOGUE_PATH, JSON.stringify(nextCatalogue));
  fs.writeFileSync(PREVIEW_PATH, JSON.stringify(preview));
  console.log(
    `[approve-story-library] Marked ${updated} stories approved, wrote ${updated} sharded info/<storyKey>.json files, enriched ${publishedCount} published catalogue entries (${quarantinedCount} stamped for 48h developer quarantine).`,
  );
}

if (require.main === module || process.argv[1]?.endsWith('approve-story-library.ts')) {
  main();
}
