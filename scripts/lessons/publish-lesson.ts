/**
 * Generic Narrated Lesson Publisher — Firebase Cloud Storage CDN (0 Firestore writes, 0 lesson JSON in app code).
 *
 * Publishes ANY Claude-authored v0.3 Narrated Lesson JSON to:
 *   gs://gamedu-69888475-f5783.firebasestorage.app/story-spark-preview/narrated-lessons/
 *     ├── catalogue.json                              (max-age=60, stale-while-revalidate=300)
 *     ├── packages/<lessonId>.<hash12>.json           (max-age=31536000, immutable)
 *     └── <lessonId>/
 *         ├── audio/s01.mp3 .. sNN.mp3, recap.mp3     (max-age=31536000, immutable)
 *         └── images/sXX.webp                         (max-age=31536000, immutable)
 *
 * Usage:
 *   npm run lesson:publish -- path/to/lesson.json
 *   npm run lesson:publish -- path/to/lesson.json --images-dir <folder-with-slide-images>
 *   npm run lesson:publish -- path/to/lesson.json --skip-media
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as https from 'node:https';
import * as zlib from 'node:zlib';
import * as cp from 'node:child_process';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import * as dotenv from 'dotenv';
import { GoogleAuth } from 'google-auth-library';
import {
  NARRATED_LESSON_CDN_BUCKET,
  NARRATED_LESSON_CDN_PREFIX,
  type NarratedLesson,
} from '../../src/lib/narrated-lessons/types';
import {
  assertPronunciationCoverage,
  buildTtsText,
  computeTtsCacheKey,
} from '../../src/lib/narrated-lessons/pronunciation';
import {
  normalizeCambridgeLevel,
  normalizeClassLevel,
  type CurriculumSystem,
  type LessonCatalogue,
  type LessonCatalogueEntry,
} from '../../src/lib/narrated-lessons/catalogue';

const REPO_ROOT = path.resolve(__dirname, '../..');
dotenv.config({ path: path.join(REPO_ROOT, '.env.local') });
dotenv.config({ path: path.join(REPO_ROOT, '.env') });

const STRICT_TTS_MODEL = 'gemini-3.1-flash-tts-preview';
const IMMUTABLE_CACHE = 'public, max-age=31536000, immutable';
const CATALOGUE_CACHE = 'public, max-age=60, stale-while-revalidate=300';
const agent = new https.Agent({ keepAlive: true, maxSockets: 6, family: 4, timeout: 90_000 });

function collectGeminiKeys(): string[] {
  const keys: string[] = [];
  for (const k of [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
    process.env.GOOGLE_GENAI_API_KEY,
  ]) {
    if (k && k.trim() && !keys.includes(k.trim())) keys.push(k.trim());
  }
  return keys;
}

function resolveFfmpeg(): string {
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) return process.env.FFMPEG_PATH;
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
      // fall through
    }
  }
  return 'ffmpeg';
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
    req.setTimeout(90_000, () => req.destroy(new Error(`Gemini ${model} timeout`)));
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function pcm24kMonoToWav(pcm: Buffer): Buffer {
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(24000, 24);
  header.writeUInt32LE(48000, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

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
        res.on('end', () => resolve({ statusCode: res.statusCode ?? 0, body: Buffer.concat(chunks) }));
        res.on('error', reject);
      },
    );
    req.on('error', reject);
    req.end();
  });
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
              const meta = JSON.parse(Buffer.concat(chunks).toString('utf8')) as { generation?: string };
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

function uploadObject(
  token: string,
  remotePath: string,
  data: Buffer,
  contentType: string,
  cacheControl: string,
  ifGenerationMatch?: string,
): Promise<void> {
  const boundary = '----GamEduLessonPub' + Math.random().toString(36).slice(2);
  const metadata = JSON.stringify({ name: remotePath, contentType, cacheControl });
  const head = Buffer.from(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n` +
      `--${boundary}\r\nContent-Type: ${contentType}\r\n\r\n`,
    'utf8',
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
  const body = Buffer.concat([head, data, tail]);
  const genParam = ifGenerationMatch !== undefined ? `&ifGenerationMatch=${encodeURIComponent(ifGenerationMatch)}` : '';

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
          else reject(new Error(`Upload failed (${res.statusCode}) for ${remotePath}: ${Buffer.concat(chunks).toString('utf8').slice(0, 240)}`));
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
        res.on('end', () => resolve({ statusCode: res.statusCode ?? 0, body: Buffer.concat(chunks) }));
        res.on('error', reject);
      },
    );
    req.on('error', reject);
    req.end();
  });
}

function splitSentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
}

function autoAlignSlideCues(ffmpeg: string, mp3Path: string, slide: NarratedLesson['slides'][number]) {
  if (!slide.cues || slide.cues.length === 0) return;
  const needsTiming = slide.cues.some((c) => c.startSec === 0 && c.endSec === 0);
  if (!needsTiming || !fs.existsSync(mp3Path)) return;

  const out = cp.spawnSync(
    ffmpeg,
    ['-i', mp3Path, '-af', 'silencedetect=noise=-32dB:d=0.22', '-f', 'null', '-'],
    { encoding: 'utf8' },
  );
  const stderr = out.stderr || '';
  let duration = 0;
  const durMatch = stderr.match(/Duration:\s*(\d+):(\d+):([\d.]+)/);
  if (durMatch) duration = Number(durMatch[1]) * 3600 + Number(durMatch[2]) * 60 + Number(durMatch[3]);
  const silences: Array<{ start: number; end: number; mid: number }> = [];
  let curStart: number | null = null;
  for (const line of stderr.split(/\r?\n/)) {
    const s = line.match(/silence_start:\s*([\d.]+)/);
    if (s) curStart = Number(s[1]);
    const e = line.match(/silence_end:\s*([\d.]+)/);
    if (e && curStart !== null) {
      const end = Number(e[1]);
      silences.push({ start: curStart, end, mid: Number(((curStart + end) / 2).toFixed(2)) });
      curStart = null;
    }
  }

  const sentences = splitSentences(slide.narration.ttsText || slide.narration.script);
  const speechStart = silences[0] && silences[0].start < 0.15 ? Math.min(silences[0].end, 0.8) : 0;
  const lastSil = silences[silences.length - 1];
  const speechEnd = lastSil && duration - lastSil.end < 0.25 ? Math.max(lastSil.start, duration - 1.2) : duration;
  const span = Math.max(1, speechEnd - speechStart);
  const internal = silences.filter((s) => s.mid > speechStart + 0.5 && s.mid < speechEnd - 0.5);
  const weights = sentences.map((s) => s.length + (/[?!]$/.test(s) ? 10 : 6));
  const totalW = weights.reduce((a, b) => a + b, 0) || 1;

  const bounds: number[] = [speechStart];
  let acc = 0;
  let matched = 0;
  let lastIdx = -1;
  for (let i = 0; i < sentences.length - 1; i++) {
    acc += weights[i];
    const exp = speechStart + (acc / totalW) * span;
    let best = -1;
    let bestDist = 2.2;
    for (let j = lastIdx + 1; j < internal.length; j++) {
      const d = Math.abs(internal[j].mid - exp);
      if (d < bestDist && internal[j].mid > bounds[bounds.length - 1] + 0.8) {
        bestDist = d;
        best = j;
      }
    }
    if (best !== -1) {
      bounds.push(internal[best].mid);
      lastIdx = best;
      matched++;
    } else {
      bounds.push(Number(exp.toFixed(2)));
    }
  }
  bounds.push(Number(speechEnd.toFixed(2)));

  slide.timingMethod = matched >= Math.ceil((sentences.length - 1) * 0.5) ? 'silence-detect' : 'estimated';
  for (const cue of slide.cues) {
    if (cue.startSec === 0 && cue.endSec === 0) {
      const idx = Math.max(0, Math.min(sentences.length - 1, cue.sentenceIndex));
      cue.startSec = Number(bounds[idx].toFixed(1));
      cue.endSec = Number(bounds[idx + 1].toFixed(1));
    }
  }
}

async function main() {
  const argv = process.argv.slice(2);
  const jsonArg = argv.find((a) => !a.startsWith('--'));
  if (!jsonArg) {
    console.error('Usage: npm run lesson:publish -- <path-to-lesson.json> [--images-dir <dir>] [--skip-media] [--slug <slug>]');
    process.exit(1);
  }
  const skipMedia = argv.includes('--skip-media');
  const imgDirIdx = argv.indexOf('--images-dir');
  const imagesDirArg = imgDirIdx !== -1 ? argv[imgDirIdx + 1] : '';
  const slugIdx = argv.indexOf('--slug');
  const explicitSlug = slugIdx !== -1 ? argv[slugIdx + 1] : undefined;

  const lessonPath = path.resolve(process.cwd(), jsonArg);
  const lesson = JSON.parse(fs.readFileSync(lessonPath, 'utf8')) as NarratedLesson;
  if (!lesson.lessonId || !Array.isArray(lesson.slides) || lesson.slides.length === 0) {
    throw new Error('Invalid lesson JSON: missing lessonId or slides.');
  }

  // 1. Validate pronunciation coverage & compute ttsText + audioHash
  assertPronunciationCoverage(lesson.slides, lesson.pronunciationGuide ?? []);
  for (const slide of lesson.slides) {
    slide.narration.audioSource = slide.narration.audioSource ?? 'tts';
    slide.narration.ttsText = buildTtsText(slide.narration.script, lesson.pronunciationGuide ?? []);
    slide.audioHash = computeTtsCacheKey(slide.narration.ttsText, slide.narration.ttsStyleInstruction, 'Kore');
  }

  const buildRoot = path.join(REPO_ROOT, '.narrated-lesson-build', lesson.lessonId);
  const audioDir = path.join(buildRoot, 'audio');
  const imagesDir = path.join(buildRoot, 'images');
  fs.mkdirSync(audioDir, { recursive: true });
  fs.mkdirSync(imagesDir, { recursive: true });

  const token = await getAccessToken();

  // Fetch exact current catalogue.json by GCS generation FIRST (never from cached public CDN)
  const remoteCat = `${NARRATED_LESSON_CDN_PREFIX}/catalogue.json`;
  const expectedGeneration = await fetchObjectGeneration(token, remoteCat);
  let catalogue: LessonCatalogue = {
    catalogueVersion: 0,
    updatedAt: new Date().toISOString(),
    entries: [],
  };
  let priorCatalogueRaw: Buffer | null = null;
  if (expectedGeneration !== '0') {
    const exactCat = await fetchObjectByGeneration(token, remoteCat, expectedGeneration);
    if (exactCat.statusCode !== 200) {
      throw new Error(`Could not read catalogue.json at generation ${expectedGeneration} (HTTP ${exactCat.statusCode})`);
    }
    priorCatalogueRaw = exactCat.body;
    catalogue = JSON.parse(exactCat.body.toString('utf8')) as LessonCatalogue;
  }

  // 2. Media generation & upload (or preserve existing hashed URLs when --skip-media is passed)
  if (skipMedia) {
    const prevEntry = catalogue.entries.find((e) => e.lessonId === lesson.lessonId);
    if (!prevEntry) {
      throw new Error('--skip-media cannot be used for a brand-new lesson not yet in catalogue.json.');
    }
    const prevPkgRes = await fetchPublicObject(`${NARRATED_LESSON_CDN_PREFIX}/${prevEntry.packagePath}`);
    if (prevPkgRes.statusCode !== 200) {
      throw new Error(`--skip-media could not read prior package ${prevEntry.packagePath} (HTTP ${prevPkgRes.statusCode}).`);
    }
    const prevPkg = JSON.parse(prevPkgRes.body.toString('utf8')) as NarratedLesson;
    if (prevPkg.summary?.recapAudioUrl) {
      lesson.summary.recapAudioUrl = prevPkg.summary.recapAudioUrl;
    }
    for (const slide of lesson.slides) {
      const prevSlide = prevPkg.slides.find((s) => s.id === slide.id);
      if (!slide.narration.audioUrl && prevSlide?.narration?.audioUrl) {
        slide.narration.audioUrl = prevSlide.narration.audioUrl;
      }
      if (slide.visual.type === 'illustration' && !slide.visual.imageUrl && prevSlide?.visual?.imageUrl) {
        slide.visual.imageUrl = prevSlide.visual.imageUrl;
      }
      if (
        Array.isArray(slide.cues) &&
        slide.cues.length > 0 &&
        slide.cues.every((c) => c.startSec === 0 && c.endSec === 0) &&
        Array.isArray(prevSlide?.cues) &&
        prevSlide.cues.length === slide.cues.length
      ) {
        slide.cues = slide.cues.map((c, idx) => ({
          ...c,
          startSec: prevSlide.cues![idx].startSec,
          endSec: prevSlide.cues![idx].endSec,
        }));
      }
      if (!slide.narration.audioUrl) {
        throw new Error(`--skip-media refused: slide ${slide.id} has no existing hashed audioUrl. Republish without --skip-media first.`);
      }
      if (slide.visual.type === 'illustration' && !slide.visual.imageUrl) {
        throw new Error(`--skip-media refused: slide ${slide.id} has no existing hashed imageUrl. Republish without --skip-media first.`);
      }
    }
    console.log('[lesson:publish] --skip-media preserved all existing hashed audioUrl and imageUrl fields.');
  } else {
    const apiKeys = collectGeminiKeys();
    const ffmpeg = resolveFfmpeg();
    const exhausted = new Set<string>();
    const nextKey = (attempt: number) => {
      const active = apiKeys.filter((k) => !exhausted.has(k));
      const pool = active.length > 0 ? active : apiKeys;
      return pool[(attempt - 1) % pool.length];
    };

    const tracks = [
      ...lesson.slides.map((s) => ({
        id: s.id,
        style: s.narration.ttsStyleInstruction,
        text: s.narration.ttsText || s.narration.script,
        hash: s.audioHash!,
        audioSource: s.narration.audioSource ?? 'tts',
      })),
      {
        id: 'recap',
        style: 'Say warmly and clearly like a proud Ghanaian teacher summarising the lesson:',
        text: buildTtsText(lesson.summary.recapScript, lesson.pronunciationGuide ?? []),
        hash: computeTtsCacheKey(lesson.summary.recapScript, 'recap', 'Kore'),
        audioSource: 'tts' as const,
      },
    ];

    for (const track of tracks) {
      const outMp3 = path.join(audioDir, `${track.id}.mp3`);
      const hashFile = path.join(audioDir, `${track.id}.sha256`);
      const existingHash = fs.existsSync(hashFile) ? fs.readFileSync(hashFile, 'utf8').trim() : '';

      if (track.audioSource === 'human') {
        console.log(`  [audio] PRESERVING human recording ${track.id}.mp3 (audioSource: "human")`);
      } else if (!fs.existsSync(outMp3) || (existingHash && existingHash !== track.hash)) {
        if (apiKeys.length === 0) throw new Error('No GEMINI_API_KEY* found for TTS generation.');
        let ok = false;
        for (let attempt = 1; attempt <= Math.max(6, apiKeys.length * 3) && !ok; attempt++) {
          const key = nextKey(attempt);
          const prompt =
            `You are a warm, patient Ghanaian classroom teacher speaking in clear, natural Ghanaian English (en-GH).\n` +
            `${track.style}\nSpeak ONLY the exact words below verbatim:\n\n${track.text}`;
          const res = await geminiPost(STRICT_TTS_MODEL, key, {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
            },
          });
          const b64 = res?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (!b64) {
            if ([400, 402, 403, 429].includes(res?.error?.code)) exhausted.add(key);
            await new Promise((r) => setTimeout(r, 1500));
            continue;
          }
          const wavTmp = `${outMp3}.tmp.wav`;
          fs.writeFileSync(wavTmp, pcm24kMonoToWav(Buffer.from(b64, 'base64')));
          cp.execFileSync(ffmpeg, ['-y', '-i', wavTmp, '-codec:a', 'libmp3lame', '-b:a', '64k', outMp3], { stdio: 'ignore' });
          fs.unlinkSync(wavTmp);
          fs.writeFileSync(hashFile, track.hash, 'utf8');
          console.log(`  [audio] generated ${track.id}.mp3`);
          ok = true;
        }
        if (!ok) throw new Error(`TTS failed for ${track.id}`);
      } else if (!existingHash) {
        fs.writeFileSync(hashFile, track.hash, 'utf8');
      }

      const mp3Buf = fs.readFileSync(outMp3);
      const mp3ContentHash = createHash('sha256').update(mp3Buf).digest('hex').slice(0, 12);
      const relHashedAudio = `audio/${track.id}.${mp3ContentHash}.mp3`;
      const remoteAudio = `${NARRATED_LESSON_CDN_PREFIX}/${lesson.lessonId}/${relHashedAudio}`;
      await uploadObject(token, remoteAudio, mp3Buf, 'audio/mpeg', IMMUTABLE_CACHE);
      if (track.id === 'recap') {
        lesson.summary.recapAudioUrl = relHashedAudio;
      } else {
        const targetSlide = lesson.slides.find((s) => s.id === track.id);
        if (targetSlide) targetSlide.narration.audioUrl = relHashedAudio;
      }
      console.log(`  [upload] ${remoteAudio}`);
    }

    // Auto-align cues with 0-0 timings via ffmpeg silencedetect
    for (const slide of lesson.slides) {
      autoAlignSlideCues(ffmpeg, path.join(audioDir, `${slide.id}.mp3`), slide);
    }

    // Convert any raw images in --images-dir, then upload all slide WebPs with content-hashed filenames
    if (imagesDirArg && fs.existsSync(imagesDirArg)) {
      const sharp = createRequire(path.join(REPO_ROOT, 'package.json'))('sharp') as typeof import('sharp');
      const files = fs.readdirSync(imagesDirArg);
      for (const slide of lesson.slides) {
        if (slide.visual.type !== 'illustration') continue;
        const match = files.find((f) => new RegExp(`(^|_)${slide.id}(_|\\.)`, 'i').test(f) && /\.(jpg|jpeg|png|webp)$/i.test(f));
        if (!match) continue;
        const dest = path.join(imagesDir, `${slide.id}.webp`);
        await sharp(path.join(imagesDirArg, match))
          .resize(1280, 720, { fit: 'cover', position: 'centre' })
          .webp({ quality: 84 })
          .toFile(dest);
      }
    }

    for (const slide of lesson.slides) {
      if (slide.visual.type !== 'illustration') continue;
      const localWebp = path.join(imagesDir, `${slide.id}.webp`);
      if (!fs.existsSync(localWebp)) {
        throw new Error(`Missing illustration ${localWebp} for slide ${slide.id}. Pass --images-dir <dir>.`);
      }
      const imgBuf = fs.readFileSync(localWebp);
      const imgHash = createHash('sha256').update(imgBuf).digest('hex').slice(0, 12);
      const relHashedImg = `images/${slide.id}.${imgHash}.webp`;
      const remoteImg = `${NARRATED_LESSON_CDN_PREFIX}/${lesson.lessonId}/${relHashedImg}`;
      await uploadObject(token, remoteImg, imgBuf, 'image/webp', IMMUTABLE_CACHE);
      slide.visual.imageUrl = relHashedImg;
      console.log(`  [upload] ${remoteImg}`);
    }
  }

  // 3. Upload content-hashed lesson package JSON
  const pkgStr = JSON.stringify(lesson, null, 2);
  const pkgHash = createHash('sha256').update(pkgStr, 'utf8').digest('hex').slice(0, 12);
  const relPackagePath = `packages/${lesson.lessonId}.${pkgHash}.json`;
  const remotePkg = `${NARRATED_LESSON_CDN_PREFIX}/${relPackagePath}`;
  await uploadObject(token, remotePkg, Buffer.from(pkgStr, 'utf8'), 'application/json; charset=utf-8', IMMUTABLE_CACHE);
  console.log(`[lesson:publish] Uploaded package -> ${remotePkg}`);

  // 4. Back up prior catalogue (from exact generation) and write updated catalogue with ifGenerationMatch lock
  if (priorCatalogueRaw) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${NARRATED_LESSON_CDN_PREFIX}/backups/catalogue.${stamp}.json`;
    await uploadObject(token, backupPath, priorCatalogueRaw, 'application/json; charset=utf-8', IMMUTABLE_CACHE);
    console.log(`[lesson:publish] Backed up prior catalogue (gen=${expectedGeneration}) -> ${backupPath}`);
  }

  const currIdx = argv.indexOf('--curriculum');
  const cliCurriculum = currIdx !== -1 ? argv[currIdx + 1]?.toLowerCase() : undefined;
  const inferredCambridge =
    cliCurriculum === 'cambridge' ||
    lesson.meta.curriculum === 'cambridge' ||
    /^(cam|igcse|alevel|aslevel)-/i.test(lesson.lessonId);
  const curriculum: CurriculumSystem = inferredCambridge ? 'cambridge' : 'ges';
  if (curriculum === 'cambridge' && !lesson.meta.curriculum) {
    lesson.meta.curriculum = 'cambridge';
  }

  const coverImgIdx = argv.indexOf('--cover-image');
  const coverImageArg = coverImgIdx !== -1 ? argv[coverImgIdx + 1] : undefined;
  let explicitCoverRel: string | undefined;
  if (coverImageArg) {
    const absCover = path.resolve(coverImageArg);
    if (!fs.existsSync(absCover)) {
      throw new Error(`--cover-image file not found: ${absCover}`);
    }
    const sharp = createRequire(path.join(REPO_ROOT, 'package.json'))('sharp') as typeof import('sharp');
    const webpBuf = await sharp(absCover)
      .resize(1280, 720, { fit: 'cover' })
      .webp({ quality: 88 })
      .toBuffer();
    const coverHash = createHash('sha256').update(webpBuf).digest('hex').slice(0, 12);
    const relImg = `images/cover.${coverHash}.webp`;
    const remoteImg = `${NARRATED_LESSON_CDN_PREFIX}/${lesson.lessonId}/${relImg}`;
    await uploadObject(token, remoteImg, webpBuf, 'image/webp', IMMUTABLE_CACHE);
    console.log(`  [upload] ${remoteImg}`);
    explicitCoverRel = `${lesson.lessonId}/${relImg}`;
  }

  const firstImgSlide = lesson.slides.find((s) => s.visual.type === 'illustration');
  const normalizedClass =
    curriculum === 'cambridge'
      ? (normalizeCambridgeLevel(lesson.meta.class) ?? lesson.meta.class)
      : (normalizeClassLevel(lesson.meta.class) ?? lesson.meta.class);
  const derivedTitle =
    lesson.meta.title?.trim() ||
    lesson.slides[0]?.title ||
    lesson.lessonId;
  const coverRel =
    explicitCoverRel ??
    (firstImgSlide
      ? `${lesson.lessonId}/${firstImgSlide.visual.imageUrl || `images/${firstImgSlide.id}.webp`}`
      : undefined);

  const entry: LessonCatalogueEntry = {
    lessonId: lesson.lessonId,
    ...(explicitSlug ? { slug: explicitSlug } : {}),
    ...(curriculum === 'cambridge' ? { curriculum: 'cambridge' } : {}),
    title: derivedTitle,
    summary: lesson.learningOutcomes[0] ?? lesson.summary.takeaways[0] ?? '',
    class: normalizedClass,
    subject: lesson.meta.subject,
    term: lesson.meta.term,
    contentStandard: lesson.meta.contentStandard,
    indicators: lesson.meta.indicators,
    slideCount: lesson.slides.length,
    estimatedNarrationMinutes: lesson.meta.estimatedNarrationMinutes,
    estimatedTotalMinutes: lesson.meta.estimatedTotalMinutes,
    schemaVersion: lesson.schemaVersion,
    packagePath: relPackagePath,
    packageHash: pkgHash,
    ...(coverRel ? { coverImagePath: coverRel } : {}),
    status: 'published',
    updatedAt: new Date().toISOString(),
  };

  // Preserve custom slug if already present in live catalogue
  const existingIdx = catalogue.entries.findIndex((e) => e.lessonId === lesson.lessonId);
  if (existingIdx !== -1) {
    const prev = catalogue.entries[existingIdx];
    catalogue.entries[existingIdx] = {
      ...prev,
      ...entry,
      slug: explicitSlug ?? prev.slug,
    };
  } else {
    catalogue.entries.push(entry);
  }

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
  console.log(`[lesson:publish] Updated catalogue.json (v${catalogue.catalogueVersion}, ${catalogue.entries.length} lesson(s))`);

  // 5. Verify HTTP 200 on both package and catalogue
  const vPkg = await fetchPublicObject(remotePkg);
  const vCat = await fetchPublicObject(remoteCat);
  if (vPkg.statusCode !== 200 || vCat.statusCode !== 200) {
    throw new Error(`Verification failed: pkg=${vPkg.statusCode}, cat=${vCat.statusCode}`);
  }
  console.log(`[lesson:publish] Verified HTTP 200 OK on package & catalogue.json!`);
}

main().catch((err) => {
  console.error('[lesson:publish] ERROR:', err);
  process.exit(1);
});
