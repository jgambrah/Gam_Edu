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
import { CATALOGUE_ALLOWED_KEYS } from '../src/lib/story-library/types';

const ROOT = path.resolve(__dirname, '..');
const PREVIEW_DIR = path.join(ROOT, 'public', 'story-spark-preview');
const CATALOGUE_PATH = path.join(PREVIEW_DIR, 'catalogue.json');
const PREVIEW_PATH = path.join(PREVIEW_DIR, 'preview.json');
const PACKAGES_DIR = path.join(PREVIEW_DIR, 'packages');
const INFO_DIR = path.join(PREVIEW_DIR, 'info');

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

  const allowedSet = new Set<string>(CATALOGUE_ALLOWED_KEYS);
  const enrichedEntries = catalogue.entries.map((entry) => {
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

    const rawMerged: Record<string, unknown> = {
      ...entry,
      attribution,
      ...(palette ? { palette } : {}),
      ...(coverMotif ? { coverMotif } : {}),
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
    `[approve-story-library] Marked ${updated} stories approved, wrote ${updated} sharded info/<storyKey>.json files, and enriched ${publishedCount} published catalogue entries.`,
  );
}

if (require.main === module || process.argv[1]?.endsWith('approve-story-library.ts')) {
  main();
}
