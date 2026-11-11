/**
 * Cloud Storage / CDN & Central Catalogue Sync CLI for Story Spark Library.
 *
 * Offloads Story Spark static bundles (`packages/`, `info/`, `candidates/`, `images/`, `audio/`)
 * to Firebase Cloud Storage with long-lived CDN caching (`public, max-age=31536000, immutable`)
 * and optionally syncs `story_catalogue` + `library_meta/current` in Firestore so the platform
 * scales cleanly to 1,000–10,000+ stories without bloating the Git repository.
 *
 * Safe by default (runs in dry-run mode unless `--apply` is passed):
 *   npx tsx scripts/library/sync-storage-cdn.ts
 *   npx tsx scripts/library/sync-storage-cdn.ts --apply --bucket <bucket-name> --sync-firestore
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { createHash } from 'node:crypto';
import * as admin from 'firebase-admin';
import { CATALOGUE_ALLOWED_KEYS } from '../../src/lib/story-library/types';

const ROOT = path.resolve(__dirname, '../..');
const SOURCE_DIR = path.join(ROOT, 'public', 'story-spark-preview');
const IMMUTABLE_SUBDIRS = ['packages', 'info', 'candidates', 'images', 'audio'] as const;

const MIME_BY_EXT: Record<string, string> = {
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.opus': 'audio/opus',
};

interface CliArgs {
  apply: boolean;
  syncFirestore: boolean;
  bucket?: string;
  prefix: string;
  concurrency: number;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    apply: false,
    syncFirestore: false,
    bucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    prefix: 'story-spark-preview',
    concurrency: 16,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--apply') args.apply = true;
    else if (a === '--sync-firestore') args.syncFirestore = true;
    else if (a === '--bucket' && argv[i + 1]) args.bucket = argv[++i];
    else if (a === '--prefix' && argv[i + 1]) args.prefix = argv[++i].replace(/^\/+|\/+$/g, '');
    else if (a === '--concurrency' && argv[i + 1]) args.concurrency = Math.max(1, Number(argv[++i]) || 16);
  }
  return args;
}

function walkFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function md5Base64(buf: Buffer): string {
  return createHash('md5').update(buf).digest('base64');
}

async function runPool<T>(items: T[], concurrency: number, worker: (item: T) => Promise<void>): Promise<void> {
  let index = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (index < items.length) {
        const current = items[index++];
        await worker(current);
      }
    }),
  );
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const cataloguePath = path.join(SOURCE_DIR, 'catalogue.json');
  if (!fs.existsSync(cataloguePath)) {
    throw new Error(`Missing catalogue.json at ${cataloguePath}`);
  }

  const catalogue = JSON.parse(fs.readFileSync(cataloguePath, 'utf8')) as {
    catalogueVersion: number;
    totalPublished?: number;
    entries: Array<Record<string, unknown> & { storyKey: string; status: string }>;
  };

  const filesToSync: Array<{ localPath: string; remotePath: string; cacheControl: string; contentType: string; bytes: number }> = [];

  for (const sub of IMMUTABLE_SUBDIRS) {
    const subDir = path.join(SOURCE_DIR, sub);
    for (const file of walkFiles(subDir)) {
      const rel = path.relative(SOURCE_DIR, file).split(path.sep).join('/');
      const ext = path.extname(file).toLowerCase();
      filesToSync.push({
        localPath: file,
        remotePath: `${opts.prefix}/${rel}`,
        cacheControl: sub === 'info' ? 'public, max-age=3600, stale-while-revalidate=86400' : 'public, max-age=31536000, immutable',
        contentType: MIME_BY_EXT[ext] ?? 'application/octet-stream',
        bytes: fs.statSync(file).size,
      });
    }
  }

  filesToSync.push({
    localPath: cataloguePath,
    remotePath: `${opts.prefix}/catalogue.json`,
    cacheControl: 'public, max-age=60, stale-while-revalidate=300',
    contentType: 'application/json; charset=utf-8',
    bytes: fs.statSync(cataloguePath).size,
  });

  const totalBytes = filesToSync.reduce((sum, f) => sum + f.bytes, 0);
  console.log(
    `[sync-storage-cdn] Mode: ${opts.apply ? 'APPLY' : 'DRY-RUN'} | Stories: ${catalogue.entries.length} | Files: ${filesToSync.length} (${(totalBytes / (1024 * 1024)).toFixed(2)} MB)`,
  );

  if (!opts.apply) {
    console.log('[sync-storage-cdn] Dry-run complete. Re-run with --apply --bucket <bucket> [--sync-firestore] to upload.');
    return;
  }

  if (!opts.bucket) {
    throw new Error('Pass --bucket <bucket-name> or set FIREBASE_STORAGE_BUCKET when running with --apply.');
  }

  if (admin.apps.length === 0) {
    admin.initializeApp({ storageBucket: opts.bucket });
  }

  const bucket = admin.storage().bucket(opts.bucket);
  let uploaded = 0;
  let skipped = 0;

  await runPool(filesToSync, opts.concurrency, async (item) => {
    const buf = fs.readFileSync(item.localPath);
    const localMd5 = md5Base64(buf);
    const remote = bucket.file(item.remotePath);
    const [exists] = await remote.exists();
    if (exists) {
      const [meta] = await remote.getMetadata();
      if (meta.md5Hash === localMd5) {
        skipped++;
        return;
      }
    }
    await remote.save(buf, {
      resumable: false,
      contentType: item.contentType,
      metadata: { cacheControl: item.cacheControl },
    });
    uploaded++;
  });

  console.log(`[sync-storage-cdn] Storage sync complete: ${uploaded} uploaded, ${skipped} unchanged.`);

  if (opts.syncFirestore) {
    const db = admin.firestore();
    const allowedSet = new Set<string>(CATALOGUE_ALLOWED_KEYS);
    const batchSize = 400;
    for (let i = 0; i < catalogue.entries.length; i += batchSize) {
      const batch = db.batch();
      for (const entry of catalogue.entries.slice(i, i + batchSize)) {
        const clean: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(entry)) {
          if (allowedSet.has(k) && v !== undefined) clean[k] = v;
        }
        batch.set(db.collection('story_catalogue').doc(entry.storyKey), {
          ...clean,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      await batch.commit();
    }
    const totalPublished = catalogue.entries.filter((e) => e.status === 'published').length;
    await db.doc('library_meta/current').set(
      {
        catalogueVersion: catalogue.catalogueVersion,
        totalPublished,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    console.log(`[sync-storage-cdn] Firestore synced: ${catalogue.entries.length} catalogue docs (totalPublished=${totalPublished}).`);
  }
}

if (require.main === module || process.argv[1]?.endsWith('sync-storage-cdn.ts')) {
  main().catch((err) => {
    console.error('[sync-storage-cdn] Failed:', err);
    process.exit(1);
  });
}
