/**
 * Generates Kore narration MP3s (via gemini-3.1-flash-tts-preview + ffmpeg 64 kbps),
 * converts Ultra-generated scene illustrations to 1280x720 WebP,
 * and uploads all media to Firebase Storage CDN under:
 *   story-spark-preview/narrated-lessons/bs7-sci-t1-water-cycle/
 *
 * Usage:
 *   npx tsx scripts/lessons/publish-water-cycle-media.ts --audio-only
 *   npx tsx scripts/lessons/publish-water-cycle-media.ts --images-only --brain-dir <dir>
 *   npx tsx scripts/lessons/publish-water-cycle-media.ts --upload-only
 *   npx tsx scripts/lessons/publish-water-cycle-media.ts --brain-dir <dir>
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as https from 'node:https';
import * as zlib from 'node:zlib';
import * as cp from 'node:child_process';
import { createRequire } from 'node:module';
import * as dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';
import type { NarratedLesson } from '../../src/lib/narrated-lessons/types';
import { NARRATED_LESSON_CDN_BUCKET, NARRATED_LESSON_CDN_PREFIX } from '../../src/lib/narrated-lessons/types';

const REPO_ROOT = path.resolve(__dirname, '../..');
dotenv.config({ path: path.join(REPO_ROOT, '.env.local') });
dotenv.config({ path: path.join(REPO_ROOT, '.env') });

const LESSON_JSON_PATH = path.join(REPO_ROOT, 'src', 'lib', 'narrated-lessons', 'bs7-sci-t1-water-cycle.json');
const BUILD_DIR = path.join(REPO_ROOT, '.narrated-lesson-build', 'bs7-sci-t1-water-cycle');
const AUDIO_DIR = path.join(BUILD_DIR, 'audio');
const IMAGES_DIR = path.join(BUILD_DIR, 'images');
const STRICT_TTS_MODEL = 'gemini-3.1-flash-tts-preview';
const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable';

const agent = new https.Agent({ keepAlive: true, maxSockets: 6, family: 4, timeout: 90_000 });

function collectGeminiKeys(): string[] {
  const keys: string[] = [];
  const candidates = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GOOGLE_GENAI_API_KEY,
  ];
  for (const k of candidates) {
    if (k && k.trim() && !keys.includes(k.trim())) keys.push(k.trim());
  }
  return keys;
}

function resolvePortableFfmpeg(): string {
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) {
    return process.env.FFMPEG_PATH;
  }
  const webotsFfmpeg = 'C:\\Users\\LENOVO\\AppData\\Local\\Programs\\Webots\\msys64\\mingw64\\bin\\ffmpeg.exe';
  if (fs.existsSync(webotsFfmpeg)) {
    process.env.PATH = [
      'C:\\Users\\LENOVO\\AppData\\Local\\Programs\\Webots\\msys64\\mingw64\\bin',
      'C:\\Users\\LENOVO\\AppData\\Local\\Programs\\Webots\\msys64\\mingw64\\bin\\cpp',
      'C:\\Users\\LENOVO\\AppData\\Local\\Programs\\Webots\\msys64\\usr\\bin',
      process.env.PATH || '',
    ].join(';');
    try {
      cp.execFileSync(webotsFfmpeg, ['-version'], { stdio: 'ignore' });
      return webotsFfmpeg;
    } catch {
      // DLL missing; fall through to system ffmpeg or ffmpeg-static
    }
  }
  try {
    cp.execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return 'ffmpeg';
  } catch {
    // fallback
  }
  const repoRequire = createRequire(path.join(REPO_ROOT, 'package.json'));
  try {
    const bin = repoRequire('ffmpeg-static') as string;
    if (bin && fs.existsSync(bin)) return bin;
  } catch {
    // ignore
  }
  const resolved = cp
    .execSync('npx --yes -p ffmpeg-static node -e "process.stdout.write(require(\'ffmpeg-static\'))"', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    .trim();
  if (!resolved || !fs.existsSync(resolved)) {
    throw new Error('Could not find ffmpeg.');
  }
  return resolved;
}

function geminiPost(model: string, apiKey: string, payloadObj: unknown): Promise<any> {
  const payload = Buffer.from(JSON.stringify(payloadObj), 'utf8');
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1beta/models/${model}:generateContent`,
        method: 'POST',
        agent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': payload.length,
          'Accept-Encoding': 'gzip',
          'x-goog-api-key': apiKey,
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => {
          try {
            let raw = Buffer.concat(chunks);
            if (res.headers['content-encoding'] === 'gzip') raw = zlib.gunzipSync(raw);
            resolve(JSON.parse(raw.toString('utf8')));
          } catch (err) {
            reject(err);
          }
        });
        res.on('error', reject);
      },
    );
    req.setTimeout(90_000, () => req.destroy(new Error(`Gemini ${model} request timeout (90s)`)));
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function pcm24kMonoToWav(pcm: Buffer): Buffer {
  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

async function getAccessToken(): Promise<string> {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS || (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)) {
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

  // Fallback to firebase-tools CLI login in npm cache
  const npmCache = cp.execSync('npm config get cache', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  const npxDir = path.join(npmCache, '_npx');
  if (fs.existsSync(npxDir)) {
    for (const sub of fs.readdirSync(npxDir)) {
      const candidate = path.join(npxDir, sub, 'node_modules', 'firebase-tools', 'package.json');
      if (fs.existsSync(candidate)) {
        const ftAuth = createRequire(candidate)('./lib/auth');
        const account = ftAuth.getGlobalDefaultAccount?.();
        if (account?.tokens?.refresh_token) {
          const refreshed = await ftAuth.getAccessToken(account.tokens.refresh_token, account.tokens.scopes || []);
          if (refreshed?.access_token) return refreshed.access_token;
        }
      }
    }
  }
  throw new Error('No Google Cloud / Firebase Storage credentials found.');
}

function uploadObject(
  token: string,
  bucket: string,
  remotePath: string,
  data: Buffer,
  contentType: string,
): Promise<void> {
  const boundary = '----GamEduLessonUpload' + Math.random().toString(36).slice(2);
  const metadata = JSON.stringify({
    name: remotePath,
    contentType,
    cacheControl: IMMUTABLE_CACHE,
  });
  const head = Buffer.from(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
      `--${boundary}\r\nContent-Type: ${contentType}\r\n\r\n`,
    'utf8',
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
  const body = Buffer.concat([head, data, tail]);

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'storage.googleapis.com',
        port: 443,
        path: `/upload/storage/v1/b/${encodeURIComponent(bucket)}/o?uploadType=multipart`,
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
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed (${res.statusCode}) for ${remotePath}: ${Buffer.concat(chunks).toString('utf8').slice(0, 240)}`));
          }
        });
        res.on('error', reject);
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function verifyPublicUrl(bucket: string, remotePath: string): Promise<number> {
  return new Promise((resolve) => {
    const req = https.request(
      {
        hostname: 'firebasestorage.googleapis.com',
        port: 443,
        path: `/v0/b/${encodeURIComponent(bucket)}/o/${encodeURIComponent(remotePath)}?alt=media`,
        method: 'HEAD',
        agent,
      },
      (res) => {
        res.resume();
        resolve(res.statusCode ?? 0);
      },
    );
    req.on('error', () => resolve(0));
    req.end();
  });
}

async function generateAudio(lesson: NarratedLesson) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  const apiKeys = collectGeminiKeys();
  if (apiKeys.length === 0) throw new Error('No GEMINI_API_KEY* found in .env.local');
  const ffmpegBin = resolvePortableFfmpeg();
  const exhausted = new Set<string>();
  const nextKey = (attempt: number) => {
    const active = apiKeys.filter((k) => !exhausted.has(k));
    const pool = active.length > 0 ? active : apiKeys;
    return pool[(attempt - 1) % pool.length];
  };

  const tracks: Array<{ id: string; style: string; text: string }> = [
    ...lesson.slides.map((s) => ({
      id: s.id,
      style: s.narration.ttsStyleInstruction,
      text: s.narration.ttsText,
    })),
    {
      id: 'recap',
      style: 'Say warmly and clearly like a proud JHS science teacher summarising the lesson:',
      text: lesson.summary.recapScript,
    },
  ];

  for (const track of tracks) {
    const outMp3 = path.join(AUDIO_DIR, `${track.id}.mp3`);
    if (fs.existsSync(outMp3) && fs.statSync(outMp3).size > 4000) {
      console.log(`  [audio] skipping existing ${track.id}.mp3`);
      continue;
    }

    let generated = false;
    const maxAttempts = Math.max(6, apiKeys.length * 3);
    for (let attempt = 1; attempt <= maxAttempts && !generated; attempt++) {
      const key = nextKey(attempt);
      const prompt =
        `You are a warm, patient Ghanaian JHS science teacher speaking in clear, natural Ghanaian English (en-GH).\n` +
        `${track.style}\n` +
        `Speak ONLY the exact words below verbatim from start to finish, with no introduction or extra commentary:\n\n` +
        track.text;

      let res: any;
      try {
        res = await geminiPost(STRICT_TTS_MODEL, key, {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          },
        });
      } catch (err: any) {
        res = { error: { message: err?.message || String(err) } };
      }

      const b64 = res?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!b64) {
        if ([400, 402, 403, 429].includes(res?.error?.code)) exhausted.add(key);
        if (attempt === maxAttempts) {
          throw new Error(`TTS failed for ${track.id}: ${JSON.stringify(res?.error || res).slice(0, 240)}`);
        }
        await new Promise((r) => setTimeout(r, 1500 * Math.min(attempt, 3)));
        continue;
      }

      const pcm = Buffer.from(b64, 'base64');
      const wavTmp = path.join(AUDIO_DIR, `${track.id}.tmp.wav`);
      fs.writeFileSync(wavTmp, pcm24kMonoToWav(pcm));
      cp.execFileSync(ffmpegBin, ['-y', '-i', wavTmp, '-codec:a', 'libmp3lame', '-b:a', '64k', outMp3], {
        stdio: 'ignore',
      });
      fs.unlinkSync(wavTmp);
      const durSec = (pcm.length / 2 / 24000).toFixed(2);
      console.log(`  [audio] generated ${track.id}.mp3 (${durSec}s)`);
      generated = true;
    }
  }
}

async function convertImages(brainDir: string) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  const repoRequire = createRequire(path.join(REPO_ROOT, 'package.json'));
  const sharp = repoRequire('sharp') as typeof import('sharp');

  const slideIds = ['s01', 's08', 's10', 's11', 's12', 's13'];
  const files = fs.readdirSync(brainDir);

  for (const id of slideIds) {
    const matches = files
      .filter((f) => f.startsWith(`wc_${id}_`) && /\.(jpg|jpeg|png|webp)$/i.test(f))
      .map((f) => ({ name: f, mtime: fs.statSync(path.join(brainDir, f)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime);

    if (matches.length === 0) {
      throw new Error(`Missing Ultra illustration wc_${id}_* in ${brainDir}`);
    }
    const src = path.join(brainDir, matches[0].name);
    const dest = path.join(IMAGES_DIR, `${id}.webp`);
    await sharp(src)
      .resize(1280, 720, { fit: 'cover', position: 'centre' })
      .webp({ quality: 84 })
      .toFile(dest);
    const kb = (fs.statSync(dest).size / 1024).toFixed(1);
    console.log(`  [image] converted ${matches[0].name} -> ${id}.webp (${kb} KB)`);
  }
}

async function uploadAll(lesson: NarratedLesson) {
  const token = await getAccessToken();
  const basePrefix = `${NARRATED_LESSON_CDN_PREFIX}/${lesson.lessonId}`;
  const uploads: Array<{ local: string; remote: string; contentType: string }> = [];

  if (fs.existsSync(AUDIO_DIR)) {
    for (const f of fs.readdirSync(AUDIO_DIR).filter((x) => x.endsWith('.mp3'))) {
      uploads.push({
        local: path.join(AUDIO_DIR, f),
        remote: `${basePrefix}/audio/${f}`,
        contentType: 'audio/mpeg',
      });
    }
  }
  if (fs.existsSync(IMAGES_DIR)) {
    for (const f of fs.readdirSync(IMAGES_DIR).filter((x) => x.endsWith('.webp'))) {
      uploads.push({
        local: path.join(IMAGES_DIR, f),
        remote: `${basePrefix}/images/${f}`,
        contentType: 'image/webp',
      });
    }
  }

  console.log(`[lesson:media] Uploading ${uploads.length} assets to gs://${NARRATED_LESSON_CDN_BUCKET}/${basePrefix}/ ...`);
  for (const u of uploads) {
    const buf = fs.readFileSync(u.local);
    await uploadObject(token, NARRATED_LESSON_CDN_BUCKET, u.remote, buf, u.contentType);
    console.log(`  [upload] ${u.remote} (${(buf.length / 1024).toFixed(1)} KB)`);
  }

  // Spot-check HTTP 200 on first audio & first image
  for (const sample of uploads.filter((_, i) => i === 0 || i === uploads.length - 1)) {
    const code = await verifyPublicUrl(NARRATED_LESSON_CDN_BUCKET, sample.remote);
    if (code !== 200) {
      throw new Error(`Public CDN check failed (HTTP ${code}) for ${sample.remote}`);
    }
    console.log(`  [verify] HTTP 200 OK -> ${sample.remote}`);
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const audioOnly = argv.includes('--audio-only');
  const imagesOnly = argv.includes('--images-only');
  const uploadOnly = argv.includes('--upload-only');
  const brainIdx = argv.indexOf('--brain-dir');
  const brainDir = brainIdx !== -1 ? argv[brainIdx + 1] : '';

  const lesson = JSON.parse(fs.readFileSync(LESSON_JSON_PATH, 'utf8')) as NarratedLesson;

  if (!imagesOnly && !uploadOnly) {
    console.log('[lesson:media] Generating Kore narration MP3s...');
    await generateAudio(lesson);
  }
  if (!audioOnly && !uploadOnly) {
    if (!brainDir) throw new Error('Pass --brain-dir <path> to convert Ultra illustrations.');
    console.log('[lesson:media] Converting Ultra illustrations to 1280x720 WebP...');
    await convertImages(brainDir);
  }
  if (!audioOnly && !imagesOnly) {
    await uploadAll(lesson);
  }
  console.log('[lesson:media] Done.');
}

main().catch((err) => {
  console.error('[lesson:media] ERROR:', err);
  process.exit(1);
});
