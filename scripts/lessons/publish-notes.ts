/**
 * Narrated Lesson Notes & Question Series Publisher — Firebase Cloud Storage CDN.
 *
 * Uploads a content-hashed sibling notes JSON to:
 *   gs://gamedu-69888475-f5783.firebasestorage.app/story-spark-preview/narrated-lessons/
 *     └── packages/<lessonId>.notes.<hash12>.json   (max-age=31536000, immutable)
 *
 * Then updates the matching lesson entry in catalogue.json with `notesPath` and `notesHash`
 * using GCS optimistic concurrency (`ifGenerationMatch`) and backs up the prior catalogue.
 *
 * Usage:
 *   npm run lesson:publish-notes -- path/to/notes.json
 *   npm run lesson:publish-notes -- --unpublish <lessonId>
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as https from 'node:https';
import * as cp from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import * as dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';
import {
  NARRATED_LESSON_CDN_BUCKET,
  NARRATED_LESSON_CDN_PREFIX,
} from '../../src/lib/narrated-lessons/types';
import type { LessonCatalogue } from '../../src/lib/narrated-lessons/catalogue';
import type { LessonNotesPackage } from '../../src/lib/narrated-lessons/notes-types';

const REPO_ROOT = path.resolve(__dirname, '../..');
dotenv.config({ path: path.join(REPO_ROOT, '.env.local') });
dotenv.config({ path: path.join(REPO_ROOT, '.env') });

const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable';
const CATALOGUE_CACHE = 'public, max-age=60, stale-while-revalidate=300';
const agent = new https.Agent({ keepAlive: true, maxSockets: 6, family: 4, timeout: 90_000 });

async function getAccessToken(): Promise<string> {
  if (
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
  ) {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/devstorage.read_write'],
      ...(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY
        ? {
            credentials: {
              client_email: process.env.FIREBASE_CLIENT_EMAIL,
              private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
          }
        : {}),
    });
    const token = await auth.getAccessToken();
    if (token) return token;
  }

  const npmCache = cp
    .execSync('npm config get cache', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    .trim();
  const npxDir = path.join(npmCache, '_npx');
  if (fs.existsSync(npxDir)) {
    for (const sub of fs.readdirSync(npxDir)) {
      const candidate = path.join(npxDir, sub, 'node_modules', 'firebase-tools', 'package.json');
      if (fs.existsSync(candidate)) {
        const ftAuth = createRequire(candidate)('./lib/auth');
        const account = ftAuth.getGlobalDefaultAccount?.();
        if (account?.tokens?.refresh_token) {
          const refreshed = await ftAuth.getAccessToken(
            account.tokens.refresh_token,
            account.tokens.scopes || [],
          );
          if (refreshed?.access_token) return refreshed.access_token;
        }
      }
    }
  }
  throw new Error('No Google Cloud / Firebase Storage credentials found.');
}

function fetchObjectGeneration(token: string, remotePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'storage.googleapis.com',
        port: 443,
        path: `/storage/v1/b/${encodeURIComponent(NARRATED_LESSON_CDN_BUCKET)}/o/${encodeURIComponent(remotePath)}`,
        method: 'GET',
        agent,
        headers: { Authorization: `Bearer ${token}` },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => {
          if (res.statusCode === 404) return resolve('0');
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const meta = JSON.parse(Buffer.concat(chunks).toString('utf8')) as {
                generation?: string;
              };
              return resolve(meta.generation ?? '0');
            } catch (e) {
              return reject(e);
            }
          }
          reject(new Error(`Metadata fetch failed (${res.statusCode}) for ${remotePath}`));
        });
        res.on('error', reject);
      },
    );
    req.on('error', reject);
    req.end();
  });
}

function fetchObjectByGeneration(
  token: string,
  remotePath: string,
  generation: string,
): Promise<{ statusCode: number; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'storage.googleapis.com',
        port: 443,
        path: `/storage/v1/b/${encodeURIComponent(NARRATED_LESSON_CDN_BUCKET)}/o/${encodeURIComponent(remotePath)}?alt=media&generation=${encodeURIComponent(generation)}`,
        method: 'GET',
        agent,
        headers: { Authorization: `Bearer ${token}` },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () =>
          resolve({ statusCode: res.statusCode ?? 0, body: Buffer.concat(chunks) }),
        );
        res.on('error', reject);
      },
    );
    req.on('error', reject);
    req.end();
  });
}

function uploadObject(
  token: string,
  remotePath: string,
  data: Buffer,
  contentType: string,
  cacheControl: string,
  ifGenerationMatch?: string,
): Promise<void> {
  const boundary = '----GamEduNotesPub' + Math.random().toString(36).slice(2);
  const metadata = JSON.stringify({ name: remotePath, contentType, cacheControl });
  const head = Buffer.from(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
      `--${boundary}\r\nContent-Type: ${contentType}\r\n\r\n`,
    'utf8',
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
  const body = Buffer.concat([head, data, tail]);
  const genParam =
    ifGenerationMatch !== undefined
      ? `&ifGenerationMatch=${encodeURIComponent(ifGenerationMatch)}`
      : '';

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'storage.googleapis.com',
        port: 443,
        path: `/upload/storage/v1/b/${encodeURIComponent(NARRATED_LESSON_CDN_BUCKET)}/o?uploadType=multipart${genParam}`,
        method: 'POST',
        agent,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
          'Content-Length': body.length,
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) resolve();
          else
            reject(
              new Error(
                `Upload failed (${res.statusCode}) for ${remotePath}: ${Buffer.concat(chunks).toString('utf8').slice(0, 240)}`,
              ),
            );
        });
        res.on('error', reject);
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function fetchPublicObject(remotePath: string): Promise<{ statusCode: number; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'firebasestorage.googleapis.com',
        port: 443,
        path: `/v0/b/${encodeURIComponent(NARRATED_LESSON_CDN_BUCKET)}/o/${encodeURIComponent(remotePath)}?alt=media`,
        method: 'GET',
        agent,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () =>
          resolve({ statusCode: res.statusCode ?? 0, body: Buffer.concat(chunks) }),
        );
        res.on('error', reject);
      },
    );
    req.on('error', reject);
    req.end();
  });
}

function validateNotes(notes: LessonNotesPackage) {
  if (!notes.lessonId || typeof notes.lessonId !== 'string') {
    throw new Error('Notes JSON must include a string lessonId.');
  }
  if (!notes.schemaVersion || typeof notes.schemaVersion !== 'string') {
    throw new Error('Notes JSON must include a string schemaVersion.');
  }
  if (!Array.isArray(notes.sectionSummaries) || !Array.isArray(notes.comprehensiveNotes)) {
    throw new Error('Notes JSON must include sectionSummaries[] and comprehensiveNotes[].');
  }
  if (!Array.isArray(notes.questionSeries)) {
    throw new Error('Notes JSON must include questionSeries[].');
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const unpublishIdx = argv.indexOf('--unpublish');
  const isUnpublish = unpublishIdx !== -1;

  const token = await getAccessToken();
  const remoteCat = `${NARRATED_LESSON_CDN_PREFIX}/catalogue.json`;
  const expectedGeneration = await fetchObjectGeneration(token, remoteCat);
  if (expectedGeneration === '0') {
    throw new Error('Live catalogue.json does not exist yet.');
  }

  const catRes = await fetchObjectByGeneration(token, remoteCat, expectedGeneration);
  if (catRes.statusCode !== 200) {
    throw new Error(`Failed to fetch catalogue.json (HTTP ${catRes.statusCode})`);
  }
  const priorCatalogueRaw = catRes.body;
  const catalogue = JSON.parse(priorCatalogueRaw.toString('utf8')) as LessonCatalogue;

  if (isUnpublish) {
    const lessonId = argv[unpublishIdx + 1];
    if (!lessonId) throw new Error('Usage: npm run lesson:publish-notes -- --unpublish <lessonId>');
    const idx = catalogue.entries.findIndex((e) => e.lessonId === lessonId);
    if (idx === -1) throw new Error(`Lesson "${lessonId}" not found in catalogue.json.`);

    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${NARRATED_LESSON_CDN_PREFIX}/backups/catalogue.${stamp}.json`;
    await uploadObject(token, backupPath, priorCatalogueRaw, 'application/json; charset=utf-8', IMMUTABLE_CACHE);

    const updated = { ...catalogue.entries[idx] };
    delete updated.notesPath;
    delete updated.notesHash;
    catalogue.entries[idx] = updated;
    catalogue.catalogueVersion = (catalogue.catalogueVersion || 0) + 1;
    catalogue.updatedAt = new Date().toISOString();

    await uploadObject(
      token,
      remoteCat,
      Buffer.from(JSON.stringify(catalogue, null, 2), 'utf8'),
      'application/json; charset=utf-8',
      CATALOGUE_CACHE,
      expectedGeneration,
    );
    console.log(
      `[notes:publish] Removed notesPath from "${lessonId}" (catalogue v${catalogue.catalogueVersion})`,
    );
    return;
  }

  const jsonArg = argv.find((a) => !a.startsWith('--'));
  if (!jsonArg) {
    console.error('Usage: npm run lesson:publish-notes -- path/to/notes.json');
    process.exit(1);
  }

  const jsonPath = path.resolve(jsonArg);
  const notes = JSON.parse(fs.readFileSync(jsonPath, 'utf8')) as LessonNotesPackage;
  validateNotes(notes);

  const existingIdx = catalogue.entries.findIndex((e) => e.lessonId === notes.lessonId);
  if (existingIdx === -1) {
    throw new Error(
      `Lesson "${notes.lessonId}" was not found in live catalogue.json. Publish the lesson first.`,
    );
  }

  const questionCount = notes.questionSeries.reduce((acc, g) => acc + g.questions.length, 0);
  console.log(
    `[notes:publish] ${notes.lessonId} — ${notes.sectionSummaries.length} summaries, ${notes.comprehensiveNotes.length} notes, ${notes.questionSeries.length} exemplars (${questionCount} questions)`,
  );

  // 1. Upload content-hashed immutable notes package
  const notesStr = JSON.stringify(notes, null, 2);
  const notesHash = createHash('sha256').update(notesStr, 'utf8').digest('hex').slice(0, 12);
  const relNotesPath = `packages/${notes.lessonId}.notes.${notesHash}.json`;
  const remoteNotes = `${NARRATED_LESSON_CDN_PREFIX}/${relNotesPath}`;
  await uploadObject(
    token,
    remoteNotes,
    Buffer.from(notesStr, 'utf8'),
    'application/json; charset=utf-8',
    IMMUTABLE_CACHE,
  );
  console.log(`[notes:publish] Uploaded notes package -> ${remoteNotes}`);

  // 2. Backup prior catalogue and write updated catalogue with optimistic concurrency
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${NARRATED_LESSON_CDN_PREFIX}/backups/catalogue.${stamp}.json`;
  await uploadObject(
    token,
    backupPath,
    priorCatalogueRaw,
    'application/json; charset=utf-8',
    IMMUTABLE_CACHE,
  );
  console.log(`[notes:publish] Backed up prior catalogue (gen=${expectedGeneration}) -> ${backupPath}`);

  catalogue.entries[existingIdx] = {
    ...catalogue.entries[existingIdx],
    notesPath: relNotesPath,
    notesHash,
    updatedAt: new Date().toISOString(),
  };
  catalogue.catalogueVersion = (catalogue.catalogueVersion || 0) + 1;
  catalogue.updatedAt = new Date().toISOString();

  await uploadObject(
    token,
    remoteCat,
    Buffer.from(JSON.stringify(catalogue, null, 2), 'utf8'),
    'application/json; charset=utf-8',
    CATALOGUE_CACHE,
    expectedGeneration,
  );
  console.log(
    `[notes:publish] Updated catalogue.json (v${catalogue.catalogueVersion}, ${catalogue.entries.length} lesson(s))`,
  );

  // 3. Verify HTTP 200 on both notes package and catalogue
  const vNotes = await fetchPublicObject(remoteNotes);
  const vCat = await fetchPublicObject(remoteCat);
  if (vNotes.statusCode !== 200 || vCat.statusCode !== 200) {
    throw new Error(`Verification failed: notes=${vNotes.statusCode}, cat=${vCat.statusCode}`);
  }
  console.log('[notes:publish] Verified HTTP 200 OK on notes package & catalogue.json!');
}

main().catch((err) => {
  console.error('[notes:publish] ERROR:', err);
  process.exit(1);
});
