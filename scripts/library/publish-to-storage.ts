/**
 * Publishes the Story Spark library to Firebase Cloud Storage (Option A — Storage CDN only, 0 Firestore writes).
 *
 * Self-contained inside the repository (zero scratch-folder dependencies, zero mutations inside `public/story-spark-preview/`):
 *   1. Builds content-addressed assets & manifests into `.story-spark-build/story-spark-preview/` from `PILOT_STORIES`:
 *        - `audio/<audioSha256_12>.mp3`                (`public, max-age=31536000, immutable`)
 *        - `images/<imageSha256_12>.webp`              (`public, max-age=31536000, immutable`)
 *        - `packages/<storyKey>.<contentHash12>.json`  (`public, max-age=31536000, immutable`)
 *        - `info/<storyKey>.<infoHash12>.json`         (`public, max-age=31536000, immutable`)
 *        - `catalogue.json`                            (`public, max-age=60, stale-while-revalidate=300`)
 *   2. Uploads all new/changed hashed assets FIRST.
 *   3. If ANY upload fails, stops immediately, reports the failed file, and does NOT upload `catalogue.json`.
 *   4. Uploads `catalogue.json` LAST only after 100% of hashed asset uploads succeed.
 *   5. Live-fetches the published `catalogue.json` and a versioned story package from Firebase Storage and asserts HTTP 200.
 *   6. Never prunes old files automatically (`--prune-old-hashes` is off by default and lists every file before deleting;
 *      requires `--confirm` to execute deletions).
 *
 * Usage:
 *   npm run story:publish
 *   npm run story:publish -- --dry-run
 *   npm run story:publish -- --prune-old-hashes
 *   npm run story:publish -- --prune-old-hashes --confirm
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as https from 'node:https';
import * as cp from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import * as dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';
import { PILOT_STORIES } from '../../src/lib/story-library/pilot/pilot-stories';
import { ageTiersFor, READING_LEVELS, toCatalogueFacets } from '../../src/lib/story-library/classification';
import { naccaCodesFromSubjectLinks } from '../../src/lib/story-library/nacca';
import { effectiveHighlight, splitSentences, tokenize } from '../../src/lib/story-library/premium';
import { CATALOGUE_ALLOWED_KEYS, type CatalogueEntry } from '../../src/lib/story-library/types';
import { PREVIEW_BASE } from '../../src/lib/story-library/preview-source';
import { GHANAIAN_PRONUNCIATIONS } from '../../src/lib/story-library/pronunciation/dictionary';
import { indexDictionary, splitToken } from '../../src/lib/story-library/pronunciation/apply';
import { LEGACY_PUBLIC_MAX_SORT_KEY, REVIEW_QUARANTINE_MS } from '../../src/lib/story-library/quarantine';
import { firebaseConfig } from '../../src/firebase/config';
import { approvePreviewEntry } from '../approve-story-library';

const REPO_ROOT = path.resolve(__dirname, '../..');
dotenv.config({ path: path.join(REPO_ROOT, '.env.local') });
dotenv.config({ path: path.join(REPO_ROOT, '.env') });

const BASELINE_DIR = path.join(REPO_ROOT, 'public', 'story-spark-preview');
const BUILD_ROOT = path.join(REPO_ROOT, '.story-spark-build');
const STAGE_DIR = path.join(BUILD_ROOT, 'story-spark-preview');
const STAGE_CANDIDATES_DIR = path.join(BUILD_ROOT, 'candidates');

const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable';
const CATALOGUE_CACHE = 'public, max-age=60, stale-while-revalidate=300';

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

interface CliOptions {
  dryRun: boolean;
  bucket: string;
  prefix: string;
  concurrency: number;
  noQuarantine: boolean;
  pruneOldHashes: boolean;
  confirmDelete: boolean;
  patchCandidatesCache: boolean;
  allowShrink: boolean;
  rebuildStaging: boolean;
}

function parseCliOptions(argv: string[]): CliOptions {
  const opts: CliOptions = {
    dryRun: false,
    bucket:
      process.env.FIREBASE_STORAGE_BUCKET ||
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      firebaseConfig.storageBucket,
    prefix: 'story-spark-preview',
    concurrency: 20,
    noQuarantine: false,
    pruneOldHashes: false,
    confirmDelete: false,
    patchCandidatesCache: false,
    allowShrink: false,
    rebuildStaging: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a === '--no-quarantine') opts.noQuarantine = true;
    else if (a === '--prune-old-hashes') opts.pruneOldHashes = true;
    else if (a === '--confirm') opts.confirmDelete = true;
    else if (a === '--patch-candidates-cache') opts.patchCandidatesCache = true;
    else if (a === '--allow-shrink') opts.allowShrink = true;
    else if (a === '--rebuild-staging') opts.rebuildStaging = true;
    else if (a === '--bucket' && argv[i + 1]) opts.bucket = argv[++i];
    else if (a === '--prefix' && argv[i + 1]) opts.prefix = argv[++i].replace(/^\/+|\/+$/g, '');
    else if (a === '--concurrency' && argv[i + 1]) opts.concurrency = Math.max(1, Number(argv[++i]) || 20);
  }
  return opts;
}

export function verifyCatalogueSafetyAgainstRemote(
  remoteEntries: ReadonlyArray<{ storyKey: string }> | undefined,
  newEntries: ReadonlyArray<{ storyKey: string }>,
  allowShrink = false,
): { ok: true } | { ok: false; reason: string; missingKeys: string[]; remoteCount: number; newCount: number } {
  const live = remoteEntries ?? [];
  if (live.length === 0) return { ok: true };
  const newKeySet = new Set(newEntries.map((e) => e.storyKey));
  const missingKeys = live.map((e) => e.storyKey).filter((k) => !newKeySet.has(k));
  const countShrank = newEntries.length < live.length;

  if ((countShrank || missingKeys.length > 0) && !allowShrink) {
    const parts: string[] = [];
    if (countShrank) {
      parts.push(`new catalogue entry count (${newEntries.length}) is lower than live Storage count (${live.length})`);
    }
    if (missingKeys.length > 0) {
      const sample = missingKeys.slice(0, 10).join(', ');
      parts.push(
        `${missingKeys.length} existing storyKey(s) missing (${sample}${missingKeys.length > 10 ? ', ...' : ''})`,
      );
    }
    return {
      ok: false,
      reason: `Safety guard blocked catalogue.json upload: ${parts.join('; ')}. Pass --allow-shrink to override intentionally.`,
      missingKeys,
      remoteCount: live.length,
      newCount: newEntries.length,
    };
  }
  return { ok: true };
}

const sha256Hex = (bufOrStr: Buffer | string) => createHash('sha256').update(bufOrStr).digest('hex');
const md5Base64 = (buf: Buffer) => createHash('md5').update(buf).digest('base64');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Pure-TypeScript MPEG Layer III frame duration parser so new MP3s never require external ffprobe. */
function estimateMp3DurationMs(buf: Buffer): number {
  let offset = 0;
  if (buf.length >= 10 && buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) {
    const id3Size =
      ((buf[6] & 0x7f) << 21) | ((buf[7] & 0x7f) << 14) | ((buf[8] & 0x7f) << 7) | (buf[9] & 0x7f);
    offset = 10 + id3Size;
  }
  const brMpeg1L3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0];
  const brMpeg2L3 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0];
  const srMpeg1 = [44100, 48000, 32000, 0];
  const srMpeg2 = [22050, 24000, 16000, 0];
  const srMpeg25 = [11025, 12000, 8000, 0];

  let totalSeconds = 0;
  let frames = 0;
  while (offset + 4 <= buf.length) {
    if (buf[offset] !== 0xff || (buf[offset + 1] & 0xe0) !== 0xe0) {
      offset++;
      continue;
    }
    const verBits = (buf[offset + 1] >> 3) & 0x03;
    const layerBits = (buf[offset + 1] >> 1) & 0x03;
    const brIdx = (buf[offset + 2] >> 4) & 0x0f;
    const srIdx = (buf[offset + 2] >> 2) & 0x03;
    const padding = (buf[offset + 2] >> 1) & 0x01;

    if (verBits === 1 || layerBits !== 1 || brIdx === 0 || brIdx === 15 || srIdx === 3) {
      offset++;
      continue;
    }
    const isMpeg1 = verBits === 3;
    const bitrateKbps = isMpeg1 ? brMpeg1L3[brIdx] : brMpeg2L3[brIdx];
    const sampleRate = verBits === 3 ? srMpeg1[srIdx] : verBits === 2 ? srMpeg2[srIdx] : srMpeg25[srIdx];
    if (!bitrateKbps || !sampleRate) {
      offset++;
      continue;
    }
    const samplesPerFrame = isMpeg1 ? 1152 : 576;
    const frameLen = Math.floor(((isMpeg1 ? 144000 : 72000) * bitrateKbps) / sampleRate) + padding;
    if (frameLen < 24) {
      offset++;
      continue;
    }
    totalSeconds += samplesPerFrame / sampleRate;
    frames++;
    offset += frameLen;
  }
  return frames > 0 ? Math.max(500, Math.round(totalSeconds * 1000)) : Math.max(1500, Math.round((buf.length * 8) / 64));
}

function buildMonotonicTimings(
  text: string,
  durationMs: number,
): { sentences: Array<[number, number]>; words: Array<[number, number]> } {
  const sentences = splitSentences(text);
  const tokens = tokenize(text);
  const safeDur = Math.max(durationMs, tokens.length * 100);
  const wordWeights = tokens.map((t, idx) => {
    const baseLen = Math.max(2, t.replace(/[^A-Za-z0-9]/g, '').length || t.length);
    const isLast = idx === tokens.length - 1;
    let pauseBonus = 0;
    if (!isLast) {
      if (/[.!?]['’”"]?$/.test(t)) pauseBonus = 11;
      else if (/[,;:—–…]['’”"]?$/.test(t)) pauseBonus = 5;
    } else {
      pauseBonus = 6;
    }
    return baseLen + pauseBonus;
  });
  const totalWordWeight = wordWeights.reduce((a, b) => a + b, 0) || 1;
  let cursor = 0;
  const words: Array<[number, number]> = wordWeights.map((w, i) => {
    const start = Math.round(cursor);
    cursor += (w / totalWordWeight) * safeDur;
    const end = i === tokens.length - 1 ? safeDur : Math.max(start + 10, Math.round(cursor));
    cursor = end;
    return [start, end];
  });

  const sentenceMarks: Array<[number, number]> = [];
  let tokIdx = 0;
  for (let s = 0; s < sentences.length; s++) {
    const sTokens = tokenize(sentences[s]);
    const startWord = words[Math.min(tokIdx, words.length - 1)] ?? [0, safeDur];
    const endWordIdx =
      s === sentences.length - 1 ? words.length - 1 : Math.min(tokIdx + sTokens.length - 1, words.length - 1);
    const endWord = words[Math.max(0, endWordIdx)] ?? [0, safeDur];
    sentenceMarks.push([startWord[0], Math.max(startWord[0] + 10, endWord[1])]);
    tokIdx += sTokens.length;
  }
  return { sentences: sentenceMarks, words };
}

/**
 * Portable Google Cloud Storage authentication with zero hardcoded user paths or scratch dependencies:
 *   1. Explicit service account (`GOOGLE_APPLICATION_CREDENTIALS` or `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY`)
 *   2. Application Default Credentials (`gcloud auth application-default login`)
 *   3. Local Firebase CLI login (`firebase login`) resolved via `firebase-tools` in node_modules / global / npm cache.
 */
class StorageAuthProvider {
  private cachedToken = '';
  private expiresAt = 0;
  private firebaseToolsAuth: any | null = null;
  private googleAuth: GoogleAuth | null = null;

  private resolveFirebaseToolsAuth(): any {
    if (this.firebaseToolsAuth) return this.firebaseToolsAuth;
    const repoRequire = createRequire(path.join(REPO_ROOT, 'package.json'));
    try {
      const pkgJson = repoRequire.resolve('firebase-tools/package.json');
      this.firebaseToolsAuth = createRequire(pkgJson)('./lib/auth');
      return this.firebaseToolsAuth;
    } catch {
      // Check npm _npx cache (or populate it once via npx firebase-tools@15.35.0 --version)
    }

    const findInNpxCache = (): string | null => {
      try {
        const npmCache = cp.execSync('npm config get cache', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
        const npxDir = path.join(npmCache, '_npx');
        if (!fs.existsSync(npxDir)) return null;
        for (const d of fs.readdirSync(npxDir)) {
          const candidate = path.join(npxDir, d, 'node_modules', 'firebase-tools', 'package.json');
          if (fs.existsSync(candidate)) return candidate;
        }
      } catch {
        return null;
      }
      return null;
    };

    let found = findInNpxCache();
    if (!found) {
      cp.execSync('npx --yes firebase-tools@15.35.0 --version', { stdio: 'ignore' });
      found = findInNpxCache();
    }
    if (!found) {
      throw new Error(
        'Could not resolve authentication. Set GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY, or run `npx firebase-tools login`.',
      );
    }
    this.firebaseToolsAuth = createRequire(found)('./lib/auth');
    return this.firebaseToolsAuth;
  }

  async getAccessToken(): Promise<string> {
    if (this.cachedToken && Date.now() < this.expiresAt - 120_000) {
      return this.cachedToken;
    }

    if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      if (!this.googleAuth) {
        this.googleAuth = new GoogleAuth({
          credentials: {
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          },
          scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
        });
      }
      const token = await this.googleAuth.getAccessToken();
      if (token) {
        this.cachedToken = token;
        this.expiresAt = Date.now() + 45 * 60_000;
        return token;
      }
    }

    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      if (!this.googleAuth) {
        this.googleAuth = new GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/devstorage.full_control'],
        });
      }
      const token = await this.googleAuth.getAccessToken();
      if (token) {
        this.cachedToken = token;
        this.expiresAt = Date.now() + 45 * 60_000;
        return token;
      }
    }

    const fbAuth = this.resolveFirebaseToolsAuth();
    const acct = fbAuth.getGlobalDefaultAccount?.();
    if (!acct?.tokens?.refresh_token) {
      throw new Error('No active Firebase CLI login found. Run `npx firebase-tools login` or set GOOGLE_APPLICATION_CREDENTIALS.');
    }
    const res = await fbAuth.getAccessToken(acct.tokens.refresh_token, acct.tokens.scopes);
    if (!res?.access_token) {
      throw new Error('Failed to obtain OAuth access token from Firebase CLI credentials.');
    }
    this.cachedToken = res.access_token;
    this.expiresAt = Date.now() + (Number(res.expires_in) || 3600) * 1000;
    return this.cachedToken;
  }
}

const keepAliveAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 30_000,
  maxSockets: 32,
  family: 4,
  timeout: 120_000,
});

function httpsRequestRaw(
  options: https.RequestOptions,
  bodyBuf?: Buffer,
): Promise<{ statusCode: number; headers: httpHeaders; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const req = https.request({ ...options, agent: keepAliveAgent }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode ?? 0,
          headers: res.headers,
          body: Buffer.concat(chunks),
        });
      });
      res.on('error', reject);
    });
    req.setTimeout(120_000, () => req.destroy(new Error('HTTPS request timeout (120s)')));
    req.on('error', reject);
    if (bodyBuf) req.write(bodyBuf);
    req.end();
  });
}
type httpHeaders = import('node:http').IncomingHttpHeaders;

interface RemoteObjMeta {
  name: string;
  md5Hash?: string;
  size?: string;
  cacheControl?: string;
}

async function listRemoteObjects(auth: StorageAuthProvider, bucket: string, prefix: string): Promise<Map<string, RemoteObjMeta>> {
  const out = new Map<string, RemoteObjMeta>();
  let pageToken = '';
  do {
    const token = await auth.getAccessToken();
    const qs = new URLSearchParams({
      prefix: `${prefix}/`,
      maxResults: '1000',
      fields: 'nextPageToken,items(name,md5Hash,size,cacheControl)',
    });
    if (pageToken) qs.set('pageToken', pageToken);
    const res = await httpsRequestRaw({
      hostname: 'storage.googleapis.com',
      port: 443,
      path: `/storage/v1/b/${encodeURIComponent(bucket)}/o?${qs.toString()}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.statusCode < 200 || res.statusCode >= 300) {
      throw new Error(`Failed listing Storage objects (HTTP ${res.statusCode}): ${res.body.toString('utf8').slice(0, 240)}`);
    }
    const parsed = JSON.parse(res.body.toString('utf8')) as { nextPageToken?: string; items?: RemoteObjMeta[] };
    for (const item of parsed.items ?? []) out.set(item.name, item);
    pageToken = parsed.nextPageToken ?? '';
  } while (pageToken);
  return out;
}

async function uploadMultipartObject(
  auth: StorageAuthProvider,
  bucket: string,
  remotePath: string,
  contentType: string,
  cacheControl: string,
  fileBuf: Buffer,
): Promise<void> {
  const boundary = 'story_spark_publish_' + Math.random().toString(36).slice(2);
  const metaJson = JSON.stringify({ name: remotePath, contentType, cacheControl });
  const pre = Buffer.from(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metaJson}\r\n` +
      `--${boundary}\r\nContent-Type: ${contentType}\r\n\r\n`,
    'utf8',
  );
  const post = Buffer.from(`\r\n--${boundary}--`, 'utf8');
  const body = Buffer.concat([pre, fileBuf, post]);

  let lastErr: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const token = await auth.getAccessToken();
      const res = await httpsRequestRaw(
        {
          hostname: 'storage.googleapis.com',
          port: 443,
          path: `/upload/storage/v1/b/${encodeURIComponent(bucket)}/o?uploadType=multipart`,
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
            'Content-Length': body.length,
          },
        },
        body,
      );
      if (res.statusCode >= 200 && res.statusCode < 300) return;
      const msg = `HTTP ${res.statusCode}: ${res.body.toString('utf8').slice(0, 240)}`;
      if (res.statusCode >= 400 && res.statusCode < 500 && res.statusCode !== 408 && res.statusCode !== 429) {
        throw new Error(msg);
      }
      lastErr = new Error(msg);
    } catch (err: any) {
      lastErr = err;
      if (attempt === 3 || /^HTTP 4(?!08|29)\d\d/.test(String(err?.message ?? ''))) break;
    }
    await sleep(600 * attempt);
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

async function patchObjectCacheControl(
  auth: StorageAuthProvider,
  bucket: string,
  remotePath: string,
  cacheControl: string,
): Promise<void> {
  const payload = Buffer.from(JSON.stringify({ cacheControl }), 'utf8');
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const token = await auth.getAccessToken();
      const res = await httpsRequestRaw(
        {
          hostname: 'storage.googleapis.com',
          port: 443,
          path: `/storage/v1/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(remotePath)}`,
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': payload.length,
          },
        },
        payload,
      );
      if (res.statusCode >= 200 && res.statusCode < 300) return;
      lastErr = new Error(`HTTP ${res.statusCode}: ${res.body.toString('utf8').slice(0, 200)}`);
    } catch (err) {
      lastErr = err;
    }
    await sleep(500 * attempt);
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

async function deleteRemoteObject(auth: StorageAuthProvider, bucket: string, remotePath: string): Promise<void> {
  const token = await auth.getAccessToken();
  const res = await httpsRequestRaw({
    hostname: 'storage.googleapis.com',
    port: 443,
    path: `/storage/v1/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(remotePath)}`,
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.statusCode !== 204 && res.statusCode !== 200 && res.statusCode !== 404) {
    throw new Error(`DELETE ${remotePath} failed (HTTP ${res.statusCode}): ${res.body.toString('utf8').slice(0, 200)}`);
  }
}

async function fetchPublicStorageUrl(bucket: string, remotePath: string): Promise<{ statusCode: number; body: Buffer }> {
  const urlPath = `/v0/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(remotePath)}?alt=media`;
  return httpsRequestRaw({
    hostname: 'firebasestorage.googleapis.com',
    port: 443,
    path: urlPath,
    method: 'GET',
  });
}

interface UploadItem {
  localPath: string;
  remotePath: string;
  contentType: string;
  cacheControl: string;
  bytes: number;
}

function locateExistingAssetDiskPath(relAssetPath: string, subDir: 'audio' | 'images', fileName: string): string | null {
  const candidates = [
    path.join(STAGE_DIR, subDir, fileName),
    path.join(BASELINE_DIR, subDir, fileName),
    path.join(REPO_ROOT, 'public', relAssetPath.replace(/^\/+/, '')),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

async function buildStagedBundle(opts: CliOptions, remoteCatalogue: { catalogueVersion?: number; entries?: any[] } | null) {
  const repoRequire = createRequire(path.join(REPO_ROOT, 'package.json'));
  const sharp = repoRequire('sharp') as typeof import('sharp');

  fs.mkdirSync(path.join(STAGE_DIR, 'audio'), { recursive: true });
  fs.mkdirSync(path.join(STAGE_DIR, 'images'), { recursive: true });
  fs.mkdirSync(path.join(STAGE_DIR, 'packages'), { recursive: true });
  fs.mkdirSync(path.join(STAGE_DIR, 'info'), { recursive: true });

  const baselineCataloguePath = path.join(BASELINE_DIR, 'catalogue.json');
  const baselineCatalogue = fs.existsSync(baselineCataloguePath)
    ? (JSON.parse(fs.readFileSync(baselineCataloguePath, 'utf8')) as { catalogueVersion: number; entries: any[] })
    : { catalogueVersion: 1, entries: [] };

  const baselineEntryByKey = new Map<string, any>();
  for (const e of baselineCatalogue.entries) baselineEntryByKey.set(e.storyKey, e);

  const remoteEntryByKey = new Map<string, any>();
  for (const e of remoteCatalogue?.entries ?? []) remoteEntryByKey.set(e.storyKey, e);

  const dictIndex = indexDictionary(GHANAIAN_PRONUNCIATIONS);
  const pronunciationFor = (texts: string[]) => {
    const seen = new Map<string, { written: string; language: string; status: string; guidance: string; reviewerNotes: string[] }>();
    for (const t of texts) {
      for (const tok of t.split(/\s+/)) {
        const core = splitToken(tok)[1];
        const e = core ? dictIndex.get(core) : undefined;
        if (e && !seen.has(e.id)) {
          seen.set(e.id, {
            written: e.written,
            language: e.language,
            status: 'approved',
            guidance: e.guidance.replace(/^Candidate:\s*/i, ''),
            reviewerNotes: e.reviewerNotes,
          });
        }
      }
    }
    return [...seen.values()];
  };

  const allowedSet = new Set<string>(CATALOGUE_ALLOWED_KEYS);
  const assetUploads = new Map<string, UploadItem>();
  const activeRemoteSet = new Set<string>();
  const builtEntries: CatalogueEntry[] = [];
  const nowMs = Date.now();
  let anyStoryChangedVsRemote = (remoteCatalogue?.entries?.length ?? 0) !== PILOT_STORIES.length;

  for (let idx = 0; idx < PILOT_STORIES.length; idx++) {
    const s = PILOT_STORIES[idx];
    const baseEntry = baselineEntryByKey.get(s.key);
    const remoteEntry = remoteEntryByKey.get(s.key);
    const priorEntry = remoteEntry ?? baseEntry;

    const stagedPkgFromRemote =
      typeof remoteEntry?.packagePath === 'string'
        ? path.join(STAGE_DIR, 'packages', path.basename(remoteEntry.packagePath))
        : '';
    const basePkgFile = path.join(BASELINE_DIR, 'packages', `${s.key}.json`);
    const resolvedPkgFile = fs.existsSync(basePkgFile)
      ? basePkgFile
      : stagedPkgFromRemote && fs.existsSync(stagedPkgFromRemote)
        ? stagedPkgFromRemote
        : '';
    const basePkg = resolvedPkgFile ? (JSON.parse(fs.readFileSync(resolvedPkgFile, 'utf8')) as Record<string, any>) : null;

    const stagedInfoFromRemote =
      typeof remoteEntry?.infoPath === 'string'
        ? path.join(STAGE_DIR, 'info', path.basename(remoteEntry.infoPath))
        : '';
    const baseInfoFile = path.join(BASELINE_DIR, 'info', `${s.key}.json`);
    const resolvedInfoFile = fs.existsSync(baseInfoFile)
      ? baseInfoFile
      : stagedInfoFromRemote && fs.existsSync(stagedInfoFromRemote)
        ? stagedInfoFromRemote
        : '';
    const baseInfo = resolvedInfoFile ? (JSON.parse(fs.readFileSync(resolvedInfoFile, 'utf8')) as Record<string, any>) : null;

    const pkgAssets: Record<string, { path: string; bytes: number; type: string }> = {};
    const pkgPages: any[] = [];

    for (let i = 0; i < s.pages.length; i++) {
      const p = s.pages[i];
      const pageNo = i + 1;
      const basePage = basePkg?.pages?.[i];

      // 1) Resolve page narration audio (staged candidate overrides baseline; brand-new stories check candidates/)
      const stagedCandMp3 = path.join(STAGE_CANDIDATES_DIR, s.key, `tts-Kore-page${pageNo}.mp3`);
      const pubCandMp3 = path.join(BASELINE_DIR, 'candidates', s.key, `tts-Kore-page${pageNo}.mp3`);
      const freshMp3Path = fs.existsSync(stagedCandMp3)
        ? stagedCandMp3
        : !basePage?.audio?.hash && fs.existsSync(pubCandMp3)
          ? pubCandMp3
          : null;

      let audioRef: any;
      if (freshMp3Path) {
        const mp3Buf = fs.readFileSync(freshMp3Path);
        const aHex = sha256Hex(mp3Buf);
        const aHash = `sha256:${aHex}`;
        const aHex12 = aHex.slice(0, 12);
        const stageMp3 = path.join(STAGE_DIR, 'audio', `${aHex12}.mp3`);
        if (!fs.existsSync(stageMp3)) fs.writeFileSync(stageMp3, mp3Buf);

        const durTxt = freshMp3Path.replace(/\.mp3$/i, '.dur.txt');
        const durationMs = fs.existsSync(durTxt)
          ? Math.max(500, Math.round(Number(fs.readFileSync(durTxt, 'utf8').trim()) * 1000))
          : estimateMp3DurationMs(mp3Buf);
        const marks = buildMonotonicTimings(p.text, durationMs);
        audioRef = {
          hash: aHash,
          durationMs,
          timing: {
            granularity: 'word' as const,
            method: 'tts-marks' as const,
            verified: true,
            sentences: marks.sentences,
            words: marks.words,
          },
        };
        const relAudio = `/${opts.prefix}/audio/${aHex12}.mp3`;
        pkgAssets[aHash] = { path: relAudio, bytes: mp3Buf.length, type: 'audio/mpeg' };
        const remoteAudio = `${opts.prefix}/audio/${aHex12}.mp3`;
        activeRemoteSet.add(remoteAudio);
        assetUploads.set(remoteAudio, {
          localPath: stageMp3,
          remotePath: remoteAudio,
          contentType: 'audio/mpeg',
          cacheControl: IMMUTABLE_CACHE,
          bytes: mp3Buf.length,
        });
      } else if (basePage?.audio?.hash) {
        const aHash = String(basePage.audio.hash);
        const aHex12 = aHash.slice(7, 19);
        const origAsset = basePkg?.assets?.[aHash];
        const srcAudio = locateExistingAssetDiskPath(String(origAsset?.path || ''), 'audio', `${aHex12}.mp3`)
          ?? locateExistingAssetDiskPath(String(origAsset?.path || ''), 'audio', path.basename(String(origAsset?.path || '')));
        if (!srcAudio) {
          throw new Error(`Missing audio file on disk for ${s.key} page ${pageNo} (${aHash})`);
        }
        const stageMp3 = path.join(STAGE_DIR, 'audio', `${aHex12}.mp3`);
        if (!fs.existsSync(stageMp3)) fs.copyFileSync(srcAudio, stageMp3);
        const audioBytes = fs.statSync(stageMp3).size;

        const sentences = splitSentences(p.text);
        const existingTiming = basePage.audio.timing;
        let nextTiming = existingTiming;
        if (existingTiming) {
          const check = effectiveHighlight({ text: p.text, sentences, audio: { ...basePage.audio, timing: existingTiming } });
          if (check.level !== 'word') {
            const rebuilt = buildMonotonicTimings(p.text, Number(basePage.audio.durationMs) || 4000);
            nextTiming = {
              granularity: 'word' as const,
              method: existingTiming.method || ('tts-marks' as const),
              verified: true,
              sentences: rebuilt.sentences,
              words: rebuilt.words,
            };
          }
        }
        audioRef = {
          hash: aHash,
          durationMs: basePage.audio.durationMs,
          ...(nextTiming ? { timing: nextTiming } : {}),
        };
        const relAudio = `/${opts.prefix}/audio/${aHex12}.mp3`;
        pkgAssets[aHash] = { path: relAudio, bytes: audioBytes, type: origAsset?.type || 'audio/mpeg' };
        const remoteAudio = `${opts.prefix}/audio/${aHex12}.mp3`;
        activeRemoteSet.add(remoteAudio);
        assetUploads.set(remoteAudio, {
          localPath: stageMp3,
          remotePath: remoteAudio,
          contentType: origAsset?.type || 'audio/mpeg',
          cacheControl: IMMUTABLE_CACHE,
          bytes: audioBytes,
        });
      } else {
        throw new Error(
          `Missing narration audio for ${s.key} page ${pageNo}. Run media generation into .story-spark-build/candidates/${s.key}/ first.`,
        );
      }

      // 2) Resolve page illustration WebP
      const stagedCandImg = path.join(STAGE_CANDIDATES_DIR, s.key, `page${pageNo}-1.webp`);
      const pubCandImg = path.join(BASELINE_DIR, 'candidates', s.key, `page${pageNo}-1.webp`);
      const existingImgField = basePage?.image;
      const existingImgHash = typeof existingImgField === 'string' ? existingImgField : existingImgField?.hash;
      const freshImgPath = fs.existsSync(stagedCandImg)
        ? stagedCandImg
        : !existingImgHash && fs.existsSync(pubCandImg)
          ? pubCandImg
          : null;

      let pageImageOut: any;
      if (freshImgPath) {
        const imgBuf = fs.readFileSync(freshImgPath);
        const iHex = sha256Hex(imgBuf);
        const iHash = `sha256:${iHex}`;
        const iHex12 = iHex.slice(0, 12);
        const stageImg = path.join(STAGE_DIR, 'images', `${iHex12}.webp`);
        if (!fs.existsSync(stageImg)) fs.writeFileSync(stageImg, imgBuf);
        const meta = await sharp(imgBuf).metadata();
        pageImageOut = { hash: iHash, width: meta.width ?? 960, height: meta.height ?? 717 };
        const relImg = `/${opts.prefix}/images/${iHex12}.webp`;
        pkgAssets[iHash] = { path: relImg, bytes: imgBuf.length, type: 'image/webp' };
        const remoteImg = `${opts.prefix}/images/${iHex12}.webp`;
        activeRemoteSet.add(remoteImg);
        assetUploads.set(remoteImg, {
          localPath: stageImg,
          remotePath: remoteImg,
          contentType: 'image/webp',
          cacheControl: IMMUTABLE_CACHE,
          bytes: imgBuf.length,
        });
      } else if (existingImgHash) {
        const iHex12 = String(existingImgHash).slice(7, 19);
        const origImgAsset = basePkg?.assets?.[existingImgHash];
        const ext = path.extname(String(origImgAsset?.path || '')) || '.webp';
        const srcImg =
          locateExistingAssetDiskPath(String(origImgAsset?.path || ''), 'images', `${iHex12}${ext}`) ??
          locateExistingAssetDiskPath(String(origImgAsset?.path || ''), 'images', path.basename(String(origImgAsset?.path || '')));
        if (!srcImg) {
          throw new Error(`Missing illustration file on disk for ${s.key} page ${pageNo} (${existingImgHash})`);
        }
        const stageImg = path.join(STAGE_DIR, 'images', `${iHex12}${ext}`);
        if (!fs.existsSync(stageImg)) fs.copyFileSync(srcImg, stageImg);
        const imgBytes = fs.statSync(stageImg).size;
        pageImageOut = existingImgField;
        const mime = MIME_BY_EXT[ext.toLowerCase()] || origImgAsset?.type || 'image/webp';
        const relImg = `/${opts.prefix}/images/${iHex12}${ext}`;
        pkgAssets[existingImgHash] = { path: relImg, bytes: imgBytes, type: mime };
        const remoteImg = `${opts.prefix}/images/${iHex12}${ext}`;
        activeRemoteSet.add(remoteImg);
        assetUploads.set(remoteImg, {
          localPath: stageImg,
          remotePath: remoteImg,
          contentType: mime,
          cacheControl: IMMUTABLE_CACHE,
          bytes: imgBytes,
        });
      } else {
        throw new Error(
          `Missing illustration for ${s.key} page ${pageNo}. Place page${pageNo}-1.webp in .story-spark-build/candidates/${s.key}/ first.`,
        );
      }

      const sentences = splitSentences(p.text);
      if (audioRef?.timing) {
        const hl = effectiveHighlight({ text: p.text, sentences, audio: audioRef });
        if (hl.level !== 'word') {
          throw new Error(`${s.key} page ${pageNo}: word highlight invalid (${hl.reason})`);
        }
      }

      pkgPages.push({
        ...(basePage ?? {}),
        n: pageNo,
        text: p.text,
        sentences,
        image: pageImageOut,
        alt: p.alt,
        audio: audioRef,
      });
    }

    // Preserve any auxiliary non-page assets (e.g. optional background music) from baseline package & preserve original asset key order
    const orderedAssets: Record<string, { path: string; bytes: number; type: string }> = {};
    for (const [assetHash, assetInfo] of Object.entries((basePkg?.assets ?? {}) as Record<string, any>)) {
      if (pkgAssets[assetHash]) {
        orderedAssets[assetHash] = pkgAssets[assetHash];
        continue;
      }
      if (assetHash.startsWith('sha256:')) {
        const hex12 = assetHash.slice(7, 19);
        if (assetInfo?.type?.startsWith('audio/')) {
          const src = locateExistingAssetDiskPath(String(assetInfo.path || ''), 'audio', `${hex12}.mp3`)
            ?? locateExistingAssetDiskPath(String(assetInfo.path || ''), 'audio', path.basename(String(assetInfo.path || '')));
          if (src) {
            const stageMp3 = path.join(STAGE_DIR, 'audio', `${hex12}.mp3`);
            if (!fs.existsSync(stageMp3)) fs.copyFileSync(src, stageMp3);
            const sz = fs.statSync(stageMp3).size;
            orderedAssets[assetHash] = { path: `/${opts.prefix}/audio/${hex12}.mp3`, bytes: sz, type: assetInfo.type };
            const remoteAudio = `${opts.prefix}/audio/${hex12}.mp3`;
            activeRemoteSet.add(remoteAudio);
            assetUploads.set(remoteAudio, {
              localPath: stageMp3,
              remotePath: remoteAudio,
              contentType: assetInfo.type,
              cacheControl: IMMUTABLE_CACHE,
              bytes: sz,
            });
          }
        } else if (assetInfo?.type?.startsWith('image/')) {
          const ext = path.extname(String(assetInfo.path || '')) || '.webp';
          const src = locateExistingAssetDiskPath(String(assetInfo.path || ''), 'images', `${hex12}${ext}`)
            ?? locateExistingAssetDiskPath(String(assetInfo.path || ''), 'images', path.basename(String(assetInfo.path || '')));
          if (src) {
            const stageImg = path.join(STAGE_DIR, 'images', `${hex12}${ext}`);
            if (!fs.existsSync(stageImg)) fs.copyFileSync(src, stageImg);
            const sz = fs.statSync(stageImg).size;
            const mime = MIME_BY_EXT[ext.toLowerCase()] || assetInfo.type;
            orderedAssets[assetHash] = { path: `/${opts.prefix}/images/${hex12}${ext}`, bytes: sz, type: mime };
            const remoteImg = `${opts.prefix}/images/${hex12}${ext}`;
            activeRemoteSet.add(remoteImg);
            assetUploads.set(remoteImg, {
              localPath: stageImg,
              remotePath: remoteImg,
              contentType: mime,
              cacheControl: IMMUTABLE_CACHE,
              bytes: sz,
            });
          }
        }
      }
    }
    for (const [k, v] of Object.entries(pkgAssets)) {
      if (!orderedAssets[k]) orderedAssets[k] = v;
    }

    const ageTiers = ageTiersFor(s.classification.ageMin, s.classification.ageMax);
    const { contentHash: _ignoredPrevHash, ...basePkgWithoutHash } = (basePkg ?? {}) as Record<string, unknown>;
    const pkgBase: Record<string, unknown> = Object.assign(
      {
        schemaVersion: 1,
        storyId: s.key,
        version: basePkg?.version ?? 1,
        title: s.title,
        ageTiers,
        language: s.classification.language,
        narrationLocale: s.classification.narrationLocale,
      },
      basePkgWithoutHash,
      {
        title: s.title,
        ageTiers,
        language: s.classification.language,
        narrationLocale: s.classification.narrationLocale,
        pages: pkgPages,
        activities: s.activities,
        glossary: s.glossary,
        assets: orderedAssets,
      },
    );

    const contentHex = sha256Hex(JSON.stringify(pkgBase));
    const contentHash = `sha256:${contentHex}`;
    const contentHex12 = contentHex.slice(0, 12);
    const finalPkg = { ...pkgBase, contentHash };
    const finalPkgJson = JSON.stringify(finalPkg, null, 2);
    const pkgFileName = `${s.key}.${contentHex12}.json`;
    const stagePkgPath = path.join(STAGE_DIR, 'packages', pkgFileName);
    fs.writeFileSync(stagePkgPath, finalPkgJson);

    const remotePkgPath = `${opts.prefix}/packages/${pkgFileName}`;
    activeRemoteSet.add(remotePkgPath);
    assetUploads.set(remotePkgPath, {
      localPath: stagePkgPath,
      remotePath: remotePkgPath,
      contentType: 'application/json; charset=utf-8',
      cacheControl: IMMUTABLE_CACHE,
      bytes: Buffer.byteLength(finalPkgJson, 'utf8'),
    });

    // Build content-hashed per-story info sidecar (`info/<storyKey>.<infoHash12>.json`)
    const rawInfo = approvePreviewEntry(
      {
        ...(baseInfo ?? {}),
        set: s.set,
        palette: s.palette,
        classification: s.classification,
        characters: s.characters,
        narrationPlan: s.narrationPlan,
        music: s.music,
        culturalNotes: s.culturalNotes,
        reviewQuestions: s.reviewQuestions,
        pages: s.pages.map((p) => ({
          motif: p.motif,
          brief: p.brief,
          narration: p.narration,
        })),
        ...(s.teacherGuide ? { teacherGuide: s.teacherGuide } : {}),
        pronunciation: pronunciationFor(s.pages.map((p) => p.text)),
      },
      s.pages.length,
    );
    const infoJson = JSON.stringify(rawInfo);
    const infoHex = sha256Hex(infoJson);
    const infoHash = `sha256:${infoHex}`;
    const infoHex12 = infoHex.slice(0, 12);
    const infoFileName = `${s.key}.${infoHex12}.json`;
    const stageInfoPath = path.join(STAGE_DIR, 'info', infoFileName);
    fs.writeFileSync(stageInfoPath, infoJson);

    const remoteInfoPath = `${opts.prefix}/info/${infoFileName}`;
    activeRemoteSet.add(remoteInfoPath);
    assetUploads.set(remoteInfoPath, {
      localPath: stageInfoPath,
      remotePath: remoteInfoPath,
      contentType: 'application/json; charset=utf-8',
      cacheControl: IMMUTABLE_CACHE,
      bytes: Buffer.byteLength(infoJson, 'utf8'),
    });

    const page1 = pkgPages[0];
    const p1Img = page1?.image;
    const p1Hash = typeof p1Img === 'string' ? p1Img : p1Img?.hash;
    const cover =
      typeof p1Hash === 'string' && p1Hash.startsWith('sha256:')
        ? {
            hash: p1Hash,
            w: (typeof p1Img === 'object' && p1Img?.width) || 960,
            h: (typeof p1Img === 'object' && p1Img?.height) || 717,
            alt: String(page1?.alt || s.title || 'Story cover').slice(0, 180),
          }
        : priorEntry?.cover;

    const facets = toCatalogueFacets(s.classification);
    const level = READING_LEVELS.find((l) => l.id === s.classification.readingLevel)?.order;
    const rawMotif = s.pages[0]?.motif;
    const coverMotif =
      typeof rawMotif === 'string' && rawMotif.length >= 1 && rawMotif.length <= 16 ? rawMotif : priorEntry?.coverMotif;
    const nacca = naccaCodesFromSubjectLinks(s.teacherGuide?.subjectLinks);
    const sortKey = typeof priorEntry?.sortKey === 'number' ? priorEntry.sortKey : idx + 1;

    let publishedAt = priorEntry?.publishedAt;
    let releaseAt = priorEntry?.releaseAt;
    const reviewHold = priorEntry?.reviewHold;
    if (
      !opts.noQuarantine &&
      sortKey > LEGACY_PUBLIC_MAX_SORT_KEY &&
      releaseAt === undefined &&
      publishedAt === undefined
    ) {
      publishedAt = nowMs;
      releaseAt = nowMs + REVIEW_QUARANTINE_MS;
    }

    const packageHash = `sha256:${sha256Hex(finalPkgJson)}`;
    if (
      !remoteEntry ||
      remoteEntry.packageHash !== packageHash ||
      remoteEntry.infoHash !== infoHash ||
      remoteEntry.infoPath !== `/${remoteInfoPath}` ||
      remoteEntry.title !== s.title ||
      remoteEntry.summary !== s.summary ||
      remoteEntry.releaseAt !== releaseAt ||
      remoteEntry.publishedAt !== publishedAt
    ) {
      anyStoryChangedVsRemote = true;
    }

    const candidateEntry: Record<string, unknown> = {
      ...(priorEntry ?? {}),
      storyKey: s.key,
      version: priorEntry?.version ?? 1,
      packageVersion: priorEntry?.packageVersion ?? 1,
      status: 'published',
      title: s.title,
      summary: s.summary,
      language: 'en',
      palette: s.palette,
      ...(coverMotif ? { coverMotif } : {}),
      ...(cover ? { cover } : {}),
      ageTiers,
      level,
      categories: s.classification.genres,
      themes: s.classification.themes,
      objectives: s.classification.objectives,
      pageCount: s.pages.length,
      durationSec: s.classification.estimatedDurationSec,
      hasNarration: true,
      hasActivities: Array.isArray(s.activities) && s.activities.length > 0,
      packagePath: `/${remotePkgPath}`,
      packageHash,
      packageBytes: Buffer.byteLength(finalPkgJson, 'utf8'),
      infoPath: `/${remoteInfoPath}`,
      infoHash,
      contentHash,
      sortKey,
      publishedAt,
      releaseAt,
      reviewHold,
      updatedAt: priorEntry?.updatedAt ?? 1,
      attribution:
        typeof priorEntry?.attribution === 'string' && !/unreviewed/i.test(priorEntry.attribution)
          ? priorEntry.attribution
          : 'GAM EDU Story Spark Original',
      publishedBy: priorEntry?.publishedBy ?? 'story-publish',
      classIds: facets.classIds,
      classMin: facets.classMin,
      classMax: facets.classMax,
      ageMin: facets.ageMin,
      ageMax: facets.ageMax,
      readingLevel: facets.readingLevel,
      difficulty: facets.difficulty,
      genres: facets.genres,
      ...(nacca.length ? { nacca } : {}),
      ghanaianContext: facets.ghanaianContext,
    };

    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(candidateEntry)) {
      if (allowedSet.has(k) && v !== undefined) cleaned[k] = v;
    }
    builtEntries.push(cleaned as unknown as CatalogueEntry);
  }

  builtEntries.sort((a, b) => (a.sortKey ?? 0) - (b.sortKey ?? 0));

  const baseVer = Math.max(Number(baselineCatalogue.catalogueVersion) || 1, Number(remoteCatalogue?.catalogueVersion) || 0);
  const nextCatalogueVersion = anyStoryChangedVsRemote ? baseVer + 1 : baseVer;

  const cataloguePayload = {
    catalogueVersion: nextCatalogueVersion,
    totalPublished: builtEntries.filter((e) => e.status === 'published').length,
    entries: builtEntries,
  };
  const stageCataloguePath = path.join(STAGE_DIR, 'catalogue.json');
  const catalogueJson = JSON.stringify(cataloguePayload);
  fs.writeFileSync(stageCataloguePath, catalogueJson);

  const catalogueUpload: UploadItem = {
    localPath: stageCataloguePath,
    remotePath: `${opts.prefix}/catalogue.json`,
    contentType: 'application/json; charset=utf-8',
    cacheControl: CATALOGUE_CACHE,
    bytes: Buffer.byteLength(catalogueJson, 'utf8'),
  };

  return {
    cataloguePayload,
    catalogueUpload,
    assetUploads: [...assetUploads.values()],
    activeRemoteSet,
  };
}

async function main() {
  const opts = parseCliOptions(process.argv.slice(2));
  const auth = new StorageAuthProvider();

  console.log(`[story:publish] Bucket: ${opts.bucket} | Prefix: ${opts.prefix}/ | Mode: ${opts.dryRun ? 'DRY-RUN' : 'LIVE'}`);
  const remoteMap = await listRemoteObjects(auth, opts.bucket, opts.prefix);
  console.log(`[story:publish] Remote inventory under ${opts.prefix}/: ${remoteMap.size} existing objects.`);

  // Optional maintenance flag: patch Cache-Control on un-hashed candidates/ objects without deleting anything
  if (opts.patchCandidatesCache) {
    const candidatesToPatch = [...remoteMap.values()].filter(
      (o) => o.name.startsWith(`${opts.prefix}/candidates/`) && o.cacheControl !== 'public, max-age=60',
    );
    console.log(`[story:publish] Patching Cache-Control -> "public, max-age=60" on ${candidatesToPatch.length} candidates/ objects...`);
    if (!opts.dryRun && candidatesToPatch.length > 0) {
      let patched = 0;
      let idx = 0;
      await Promise.all(
        Array.from({ length: Math.min(opts.concurrency, candidatesToPatch.length) }, async () => {
          while (idx < candidatesToPatch.length) {
            const target = candidatesToPatch[idx++];
            await patchObjectCacheControl(auth, opts.bucket, target.name, 'public, max-age=60');
            patched++;
            if (patched % 500 === 0 || patched === candidatesToPatch.length) {
              console.log(`  [candidates cache patch] ${patched}/${candidatesToPatch.length}`);
            }
          }
        }),
      );
    }
  }

  // Read live remote catalogue.json (if present) so catalogueVersion increments monotonically & shrink guard runs
  let remoteCatalogue: { catalogueVersion?: number; entries?: Array<Record<string, any> & { storyKey: string }> } | null = null;
  if (remoteMap.has(`${opts.prefix}/catalogue.json`)) {
    const liveCatRes = await fetchPublicStorageUrl(opts.bucket, `${opts.prefix}/catalogue.json`);
    if (liveCatRes.statusCode !== 200) {
      throw new Error(
        `Could not read live ${opts.prefix}/catalogue.json from Storage (HTTP ${liveCatRes.statusCode}); refusing to proceed without safety comparison.`,
      );
    }
    remoteCatalogue = JSON.parse(liveCatRes.body.toString('utf8'));
  }

  // Optional recovery flag (3c): rebuild .story-spark-build/story-spark-preview/ directly from live Firebase Storage
  if (opts.rebuildStaging) {
    if (!remoteCatalogue?.entries?.length) {
      throw new Error(`Cannot --rebuild-staging: no entries found in live ${opts.prefix}/catalogue.json.`);
    }
    for (const sub of ['audio', 'images', 'packages', 'info']) {
      fs.mkdirSync(path.join(STAGE_DIR, sub), { recursive: true });
    }
    fs.writeFileSync(path.join(STAGE_DIR, 'catalogue.json'), JSON.stringify(remoteCatalogue));
    const toDownload = new Set<string>();
    for (const e of remoteCatalogue.entries) {
      if (typeof e.packagePath === 'string') toDownload.add(e.packagePath.replace(/^\/+/, ''));
      if (typeof e.infoPath === 'string') toDownload.add(e.infoPath.replace(/^\/+/, ''));
    }
    const downloadPool = async (remotes: string[]) => {
      let idx = 0;
      await Promise.all(
        Array.from({ length: Math.min(opts.concurrency, remotes.length || 1) }, async () => {
          while (idx < remotes.length) {
            const relRemote = remotes[idx++];
            const subRel = relRemote.slice(`${opts.prefix}/`.length);
            const dest = path.join(STAGE_DIR, subRel);
            if (fs.existsSync(dest)) continue;
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            const res = await fetchPublicStorageUrl(opts.bucket, relRemote);
            if (res.statusCode !== 200) throw new Error(`Failed downloading ${relRemote}: HTTP ${res.statusCode}`);
            fs.writeFileSync(dest, res.body);
          }
        }),
      );
    };
    console.log(`[story:publish] Rebuilding staging packages & info for ${remoteCatalogue.entries.length} stories from Storage...`);
    await downloadPool([...toDownload]);

    const mediaRemotes = new Set<string>();
    for (const e of remoteCatalogue.entries) {
      const pkgLocal = path.join(STAGE_DIR, String(e.packagePath).replace(/^\/+/, '').slice(`${opts.prefix}/`.length));
      const pkg = JSON.parse(fs.readFileSync(pkgLocal, 'utf8')) as { assets?: Record<string, { path?: string }> };
      for (const a of Object.values(pkg.assets ?? {})) {
        if (typeof a?.path === 'string') mediaRemotes.add(a.path.replace(/^\/+/, ''));
      }
    }
    console.log(`[story:publish] Downloading ${mediaRemotes.size} referenced audio & image assets into .story-spark-build/...`);
    await downloadPool([...mediaRemotes]);
    console.log(`[story:publish] Staging folder rebuilt cleanly at ${STAGE_DIR}.`);
    return;
  }

  const { cataloguePayload, catalogueUpload, assetUploads, activeRemoteSet } = await buildStagedBundle(opts, remoteCatalogue);

  // Safety guard (3b): refuse to shrink catalogue entry count or drop any existing live storyKey unless --allow-shrink is passed
  const safety = verifyCatalogueSafetyAgainstRemote(remoteCatalogue?.entries, cataloguePayload.entries, opts.allowShrink);
  if (!safety.ok) {
    console.error(`\n[story:publish] ABORTED: ${safety.reason}`);
    process.exit(1);
  }

  // Determine which hashed assets are new or changed vs Storage
  const pendingAssets: UploadItem[] = [];
  let unchangedAssets = 0;
  for (const item of assetUploads) {
    const remote = remoteMap.get(item.remotePath);
    if (remote) {
      const localMd5 = md5Base64(fs.readFileSync(item.localPath));
      if (remote.md5Hash === localMd5 && remote.cacheControl === item.cacheControl) {
        unchangedAssets++;
        continue;
      }
    }
    pendingAssets.push(item);
  }

  const remoteCat = remoteMap.get(catalogueUpload.remotePath);
  const catMd5 = md5Base64(fs.readFileSync(catalogueUpload.localPath));
  const catalogueNeedsUpload =
    !remoteCat || remoteCat.md5Hash !== catMd5 || remoteCat.cacheControl !== catalogueUpload.cacheControl;

  console.log(
    `[story:publish] Staged ${cataloguePayload.entries.length} stories (catalogueVersion=${cataloguePayload.catalogueVersion}): ` +
      `${pendingAssets.length} hashed asset(s) to upload, ${unchangedAssets} unchanged, catalogueUpload=${catalogueNeedsUpload}.`,
  );

  if (opts.dryRun) {
    for (const sample of pendingAssets.slice(0, 15)) {
      console.log(`  [dry-run] WOULD UPLOAD ${sample.remotePath} (${sample.bytes} B)`);
    }
    if (pendingAssets.length > 15) {
      console.log(`  [dry-run] ... and ${pendingAssets.length - 15} more hashed asset(s).`);
    }
    if (catalogueNeedsUpload) {
      console.log(`  [dry-run] WOULD UPLOAD LAST: ${catalogueUpload.remotePath} (${catalogueUpload.bytes} B)`);
    }
  } else {
    // STEP 1 (3b & 3c): Upload ALL new/changed hashed assets FIRST. Stop immediately & skip catalogue.json if any fails!
    if (pendingAssets.length > 0) {
      let cursor = 0;
      let uploadedCount = 0;
      let fatalError: { item: UploadItem; error: Error } | null = null;

      await Promise.all(
        Array.from({ length: Math.min(opts.concurrency, pendingAssets.length) }, async () => {
          while (cursor < pendingAssets.length && !fatalError) {
            const current = pendingAssets[cursor++];
            try {
              const buf = fs.readFileSync(current.localPath);
              await uploadMultipartObject(
                auth,
                opts.bucket,
                current.remotePath,
                current.contentType,
                current.cacheControl,
                buf,
              );
              uploadedCount++;
              if (uploadedCount % 100 === 0 || uploadedCount === pendingAssets.length) {
                console.log(`  [assets] Uploaded ${uploadedCount}/${pendingAssets.length} hashed assets`);
              }
            } catch (err: any) {
              if (!fatalError) {
                fatalError = {
                  item: current,
                  error: err instanceof Error ? err : new Error(String(err)),
                };
              }
              return;
            }
          }
        }),
      );

      if (fatalError) {
        const f = fatalError as { item: UploadItem; error: Error };
        console.error(
          `\n[story:publish] ABORTED: Failed uploading hashed asset "${f.item.remotePath}" (local: ${f.item.localPath}): ${f.error.message}`,
        );
        console.error('[story:publish] catalogue.json was NOT uploaded so live readers remain on the previous consistent snapshot.');
        process.exit(1);
      }
    }

    // STEP 2 (3b): Upload catalogue.json LAST
    if (catalogueNeedsUpload) {
      const catBuf = fs.readFileSync(catalogueUpload.localPath);
      await uploadMultipartObject(
        auth,
        opts.bucket,
        catalogueUpload.remotePath,
        catalogueUpload.contentType,
        catalogueUpload.cacheControl,
        catBuf,
      );
      console.log(`  [catalogue] Uploaded ${catalogueUpload.remotePath} (${catBuf.length} B, v${cataloguePayload.catalogueVersion})`);
    } else {
      console.log(`  [catalogue] ${catalogueUpload.remotePath} already up to date (v${cataloguePayload.catalogueVersion})`);
    }

    // STEP 3 (3d): Fetch the live catalogue.json and one versioned package from Storage and confirm HTTP 200
    const verifyPkgRemote =
      pendingAssets.find((a) => a.remotePath.startsWith(`${opts.prefix}/packages/`))?.remotePath ??
      cataloguePayload.entries[cataloguePayload.entries.length - 1].packagePath.replace(/^\/+/, '');
    const verifyInfoRemote =
      pendingAssets.find((a) => a.remotePath.startsWith(`${opts.prefix}/info/`))?.remotePath ??
      String(cataloguePayload.entries[cataloguePayload.entries.length - 1].infoPath || '').replace(/^\/+/, '');

    const [catProbe, pkgProbe, infoProbe] = await Promise.all([
      fetchPublicStorageUrl(opts.bucket, catalogueUpload.remotePath),
      fetchPublicStorageUrl(opts.bucket, verifyPkgRemote),
      verifyInfoRemote ? fetchPublicStorageUrl(opts.bucket, verifyInfoRemote) : Promise.resolve({ statusCode: 200, body: Buffer.alloc(0) }),
    ]);

    if (catProbe.statusCode !== 200) {
      throw new Error(`Post-upload verification FAILED for ${catalogueUpload.remotePath}: HTTP ${catProbe.statusCode}`);
    }
    if (pkgProbe.statusCode !== 200) {
      throw new Error(`Post-upload verification FAILED for ${verifyPkgRemote}: HTTP ${pkgProbe.statusCode}`);
    }
    if (verifyInfoRemote && infoProbe.statusCode !== 200) {
      throw new Error(`Post-upload verification FAILED for ${verifyInfoRemote}: HTTP ${infoProbe.statusCode}`);
    }

    const liveCatParsed = JSON.parse(catProbe.body.toString('utf8')) as { catalogueVersion: number; entries: unknown[] };
    const livePkgParsed = JSON.parse(pkgProbe.body.toString('utf8')) as { storyId: string; contentHash: string };
    console.log(
      `[story:publish] Live verification PASSED:\n` +
        `  - ${catalogueUpload.remotePath} -> HTTP ${catProbe.statusCode} (catalogueVersion=${liveCatParsed.catalogueVersion}, entries=${liveCatParsed.entries.length})\n` +
        `  - ${verifyPkgRemote} -> HTTP ${pkgProbe.statusCode} (storyId=${livePkgParsed.storyId}, contentHash=${livePkgParsed.contentHash.slice(0, 19)})\n` +
        (verifyInfoRemote ? `  - ${verifyInfoRemote} -> HTTP ${infoProbe.statusCode}` : ''),
    );
  }

  // STEP 4 (3e): Optional manual pruning of superseded content-hashed files ONLY when --prune-old-hashes is explicitly passed
  if (opts.pruneOldHashes) {
    const hashedRe = new RegExp(`^${opts.prefix}/(?:(?:packages|info)/[^/]+\\.[0-9a-f]{12}\\.json|audio/[^/]+|images/[^/]+)$`, 'i');
    const staleHashed = [...remoteMap.keys()]
      .filter((name) => hashedRe.test(name) && !activeRemoteSet.has(name))
      .sort();

    console.log(`\n[story:publish] --prune-old-hashes scan found ${staleHashed.length} unreferenced hashed object(s):`);
    for (const name of staleHashed) {
      console.log(`  - ${name}`);
    }
    if (staleHashed.length === 0) {
      console.log('[story:publish] Nothing to prune.');
    } else if (!opts.confirmDelete || opts.dryRun) {
      console.log(
        `[story:publish] Listed ${staleHashed.length} file(s) above without deleting. Re-run with \`npm run story:publish -- --prune-old-hashes --confirm\` to delete them.`,
      );
    } else {
      let deleted = 0;
      for (const name of staleHashed) {
        await deleteRemoteObject(auth, opts.bucket, name);
        deleted++;
      }
      console.log(`[story:publish] Deleted ${deleted} superseded hashed object(s).`);
    }
  }
}

if (require.main === module || process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/library/publish-to-storage.ts')) {
  main().catch((err) => {
    console.error('[story:publish] Error:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
