/**
 * Generates missing candidate narration audio (`tts-Kore-page<N>.mp3` via `gemini-3.1-flash-tts-preview`, voice `Kore`)
 * and gouache `960x717` WebP illustrations (`page<N>-1.webp` via `gemini-2.5-flash-image` + `sharp`) into
 * `.story-spark-build/candidates/<storyKey>/` for any story in `PILOT_STORIES` that does not yet have packaged media
 * (or for explicit `--keys key1,key2`).
 *
 * Self-contained inside the repository — zero scratch-folder dependencies and zero mutations to `public/story-spark-preview/`.
 *
 * Usage:
 *   npm run story:media
 *   npm run story:media -- --keys the-leopards-drum,akansis-pot-of-wisdom
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as https from 'node:https';
import * as zlib from 'node:zlib';
import * as cp from 'node:child_process';
import { createRequire } from 'node:module';
import * as dotenv from 'dotenv';
import { PILOT_STORIES, type PilotStory } from '../../src/lib/story-library/pilot/pilot-stories';

const REPO_ROOT = path.resolve(__dirname, '../..');
dotenv.config({ path: path.join(REPO_ROOT, '.env.local') });
dotenv.config({ path: path.join(REPO_ROOT, '.env') });

const BASELINE_PACKAGES_DIR = path.join(REPO_ROOT, 'public', 'story-spark-preview', 'packages');
const STAGE_CANDIDATES_DIR = path.join(REPO_ROOT, '.story-spark-build', 'candidates');
const STRICT_TTS_MODEL = 'gemini-3.1-flash-tts-preview';
const IMAGE_MODEL = process.env.STORY_IMAGE_MODEL || 'gemini-2.5-flash-image';

function collectGeminiKeys(): string[] {
  const keys: string[] = [];
  const add = (v?: string) => {
    const t = v?.trim();
    if (t && !keys.includes(t)) keys.push(t);
  };
  if (process.env.GEMINI_API_KEYS) process.env.GEMINI_API_KEYS.split(',').forEach(add);
  for (const [k, v] of Object.entries(process.env)) {
    if (/^GEMINI_API_KEY(_\d+)?$/.test(k)) add(v);
  }
  return keys;
}

function resolvePortableFfmpeg(): string {
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) {
    return process.env.FFMPEG_PATH;
  }
  try {
    cp.execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' });
    return 'ffmpeg';
  } catch {
    // Try node_modules or npm _npx cache for ffmpeg-static
  }
  const repoRequire = createRequire(path.join(REPO_ROOT, 'package.json'));
  try {
    const bin = repoRequire('ffmpeg-static') as string;
    if (bin && fs.existsSync(bin)) return bin;
  } catch {
    // Resolve via npx ffmpeg-static (populates npm cache cleanly on any OS)
  }
  const resolved = cp
    .execSync('npx --yes -p ffmpeg-static node -e "process.stdout.write(require(\'ffmpeg-static\'))"', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    .trim();
  if (!resolved || !fs.existsSync(resolved)) {
    throw new Error('Could not find ffmpeg on PATH or resolve ffmpeg-static. Install ffmpeg or set FFMPEG_PATH.');
  }
  return resolved;
}

const agent = new https.Agent({ keepAlive: true, maxSockets: 6, family: 4, timeout: 90_000 });

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

async function main() {
  const argv = process.argv.slice(2);
  const keysIdx = argv.indexOf('--keys');
  const explicitKeys =
    keysIdx !== -1 && argv[keysIdx + 1]
      ? new Set(argv[keysIdx + 1].split(',').map((s) => s.trim()).filter(Boolean))
      : null;
  const audioOnly = argv.includes('--audio-only');
  const imagesOnly = argv.includes('--images-only');

  const storiesToProcess: PilotStory[] = PILOT_STORIES.filter((s) => {
    if (explicitKeys) return explicitKeys.has(s.key);
    return !fs.existsSync(path.join(BASELINE_PACKAGES_DIR, `${s.key}.json`));
  });

  if (storiesToProcess.length === 0) {
    console.log('[story:media] All stories in PILOT_STORIES already have baseline packages. Pass `--keys <storyKey>` to regenerate.');
    return;
  }

  const apiKeys = collectGeminiKeys();
  if (apiKeys.length === 0) {
    throw new Error('No GEMINI_API_KEY* found in .env.local or environment.');
  }

  const repoRequire = createRequire(path.join(REPO_ROOT, 'package.json'));
  const sharp = repoRequire('sharp') as typeof import('sharp');
  const ffmpegBin = imagesOnly ? '' : resolvePortableFfmpeg();
  let keyCursor = 0;
  const nextKey = () => apiKeys[keyCursor++ % apiKeys.length];

  console.log(`[story:media] Preparing candidate media for ${storiesToProcess.length} story/stories into .story-spark-build/candidates/...`);

  for (const story of storiesToProcess) {
    const storyDir = path.join(STAGE_CANDIDATES_DIR, story.key);
    fs.mkdirSync(storyDir, { recursive: true });

    for (let i = 0; i < story.pages.length; i++) {
      const page = story.pages[i];
      const pageNo = i + 1;

      if (!imagesOnly) {
        const outMp3 = path.join(storyDir, `tts-Kore-page${pageNo}.mp3`);
        if (!fs.existsSync(outMp3)) {
          let generated = false;
          for (let attempt = 1; attempt <= apiKeys.length * 2 && !generated; attempt++) {
            const key = nextKey();
            const prompt = `Read the following paragraph aloud in warm, natural Ghanaian English, speaking ONLY the exact words below with no introduction:\n\n${page.text}`;
            const res = await geminiPost(STRICT_TTS_MODEL, key, {
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseModalities: ['AUDIO'],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
              },
            });
            const b64 = res?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (!b64) {
              if (attempt === apiKeys.length * 2) {
                throw new Error(`TTS failed for ${story.key} p${pageNo}: ${JSON.stringify(res?.error || res).slice(0, 220)}`);
              }
              await new Promise((r) => setTimeout(r, 1500));
              continue;
            }
            const pcm = Buffer.from(b64, 'base64');
            const wavTmp = path.join(storyDir, `tts-Kore-page${pageNo}.tmp.wav`);
            fs.writeFileSync(wavTmp, pcm24kMonoToWav(pcm));
            cp.execFileSync(ffmpegBin, ['-y', '-i', wavTmp, '-codec:a', 'libmp3lame', '-b:a', '64k', outMp3], {
              stdio: 'ignore',
            });
            fs.unlinkSync(wavTmp);
            const durSec = (pcm.length / 2 / 24000).toFixed(3);
            fs.writeFileSync(path.join(storyDir, `tts-Kore-page${pageNo}.dur.txt`), durSec);
            console.log(`  [audio] ${story.key} page ${pageNo}/${story.pages.length} (${durSec}s)`);
            generated = true;
          }
        }
      }

      if (!audioOnly) {
        const outWebp = path.join(storyDir, `page${pageNo}-1.webp`);
        if (!fs.existsSync(outWebp)) {
          const charContext = story.characters.length ? `Character visual consistency notes:\n- ${story.characters.join('\n- ')}\n\n` : '';
          const imgPrompt =
            `${charContext}${page.brief}\n` +
            `Aspect ratio 4:3 landscape. Absolutely NO text, letters, numbers, captions, or watermarks anywhere in the image.`;
          let generated = false;
          for (let attempt = 1; attempt <= apiKeys.length * 2 && !generated; attempt++) {
            const key = nextKey();
            const res = await geminiPost(IMAGE_MODEL, key, {
              contents: [{ parts: [{ text: imgPrompt }] }],
              generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
            });
            const parts: any[] = res?.candidates?.[0]?.content?.parts ?? [];
            const imgPart = parts.find((pt) => pt?.inlineData?.data);
            if (!imgPart) {
              if (attempt === apiKeys.length * 2) {
                throw new Error(`Image generation failed for ${story.key} p${pageNo}: ${JSON.stringify(res?.error || res).slice(0, 220)}`);
              }
              await new Promise((r) => setTimeout(r, 1500));
              continue;
            }
            const rawImg = Buffer.from(imgPart.inlineData.data, 'base64');
            await sharp(rawImg).resize(960, 717, { fit: 'cover' }).webp({ quality: 82 }).toFile(outWebp);
            console.log(`  [image] ${story.key} page ${pageNo}/${story.pages.length} (960x717 webp)`);
            generated = true;
          }
        }
      }
    }
  }
  console.log('[story:media] Candidate media ready. Run `npm run story:publish` next.');
}

if (require.main === module || process.argv[1]?.replace(/\\/g, '/').endsWith('scripts/library/seed-batch-media.ts')) {
  main().catch((err) => {
    console.error('[story:media] Error:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
}

