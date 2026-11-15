import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import https from 'node:https';
import zlib from 'node:zlib';
import path from 'node:path';
import { BATCH_44_STORIES } from '../../src/lib/story-library/pilot/batch-44-stories';

const repoRoot = path.resolve(__dirname, '../..');
const envPath = path.join(repoRoot, '.env.local');
const previewOut = path.join(repoRoot, 'public/story-spark-preview');
const ffmpegPath = 'C:/Users/DELL/.gemini/antigravity/brain/ab432cb2-3465-4ebb-a6a5-9020b86bd570/scratch/node_modules/ffmpeg-static/ffmpeg.exe';

const rawKeys: string[] = [];
const addKey = (k?: string) => {
  const trimmed = k?.trim();
  if (trimmed && !rawKeys.includes(trimmed)) rawKeys.push(trimmed);
};
if (process.env.GEMINI_API_KEYS) {
  process.env.GEMINI_API_KEYS.split(',').forEach(addKey);
}
for (const [k, v] of Object.entries(process.env)) {
  if (/^GEMINI_API_KEY(_\d+)?$/.test(k)) addKey(v);
}
if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf8');
  const multi = /^\s*GEMINI_API_KEYS\s*=\s*["']?([^"'\r\n]+?)["']?\s*$/m.exec(content);
  if (multi) multi[1].split(',').forEach(addKey);
  const lineRe = /^\s*GEMINI_API_KEY(?:_\d+)?\s*=\s*["']?([^"'\r\n#]+?)["']?\s*$/gm;
  let m: RegExpExecArray | null;
  while ((m = lineRe.exec(content)) !== null) {
    addKey(m[1]);
  }
}

// Put keys 2..4 first (fresh 100 RPD Tier 1 each)
const apiKeys = rawKeys.length > 1 ? [...rawKeys.slice(1), rawKeys[0]] : [...rawKeys];
const exhaustedDailyKeys = new Set<string>();
if (rawKeys.length > 1) {
  exhaustedDailyKeys.add(rawKeys[0]);
  if (rawKeys[4]) exhaustedDailyKeys.add(rawKeys[4]);
}

let keyCursor = 0;
const pickNextApiKey = (): { key: string; label: string } => {
  const active = apiKeys.filter((k) => !exhaustedDailyKeys.has(k));
  if (active.length === 0) {
    throw new Error('All configured GEMINI_API_KEYs have exhausted their daily quota (RPD) for gemini-3.1-flash-tts-preview.');
  }
  const key = active[keyCursor % active.length];
  keyCursor = (keyCursor + 1) % active.length;
  const origIdx = rawKeys.indexOf(key) + 1;
  return { key, label: `Key#${origIdx}` };
};

const sha = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Persistent IPv4 HTTPS Keep-Alive Agent — reuses TLS sockets across requests!
const keepAliveAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 30000,
  maxSockets: 4,
  family: 4,
  timeout: 90000,
});

// STRICT MODEL LOCK: Only gemini-3.1-flash-tts-preview (Kore). Never fall back to 2.5!
const STRICT_TTS_MODEL = 'gemini-3.1-flash-tts-preview';

function postGeminiTTS(payloadStr: string, key: string, label: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const bodyBuf = Buffer.from(payloadStr, 'utf8');
    const req = https.request(
      {
        hostname: 'generativelanguage.googleapis.com',
        port: 443,
        path: `/v1beta/models/${STRICT_TTS_MODEL}:generateContent`,
        method: 'POST',
        agent: keepAliveAgent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': bodyBuf.length,
          'Accept-Encoding': 'gzip',
          'x-goog-api-key': key,
          Connection: 'keep-alive',
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        let lastChunkTime = Date.now();
        const stallInterval = setInterval(() => {
          if (Date.now() - lastChunkTime > 30000) {
            clearInterval(stallInterval);
            req.destroy(new Error(`${label} socket stalled for 30s`));
          }
        }, 5000);

        res.on('data', (chunk: Buffer) => {
          lastChunkTime = Date.now();
          chunks.push(chunk);
        });
        res.on('end', () => {
          clearInterval(stallInterval);
          try {
            let rawBuf = Buffer.concat(chunks);
            if (res.headers['content-encoding'] === 'gzip') {
              rawBuf = zlib.gunzipSync(rawBuf);
            }
            const parsed = JSON.parse(rawBuf.toString('utf8'));
            resolve(parsed);
          } catch (e) {
            reject(e);
          }
        });
        res.on('error', (err) => {
          clearInterval(stallInterval);
          reject(err);
        });
      }
    );

    req.setTimeout(90000, () => {
      req.destroy(new Error(`${label} request timeout (90s)`));
    });
    req.on('error', reject);
    req.write(bodyBuf);
    req.end();
  });
}

async function fetchGhanaianKoreTTS(text: string): Promise<Buffer> {
  const prompt = `Read the following paragraph aloud in warm, natural Ghanaian English, speaking ONLY the exact words below with no introduction:\n\n${text}`;
  const payload = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
    },
  });

  const { key, label } = pickNextApiKey();
  const data = await postGeminiTTS(payload, key, label);
  if (data.error) {
    if (data.error.code === 429 && String(data.error.message).includes('per_day')) {
      exhaustedDailyKeys.add(key);
      console.warn(`  [${label} hit daily RPD limit; ${apiKeys.length - exhaustedDailyKeys.size} active keys remaining]`);
    }
    throw new Error(`${label} API Error ${data.error.code}: ${data.error.message}`);
  }
  const b64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!b64) throw new Error(`${label} No inline audio data returned: ${JSON.stringify(data).slice(0, 200)}`);
  return Buffer.from(b64, 'base64');
}

async function runPool<T>(items: T[], concurrency: number, worker: (item: T) => Promise<void>) {
  const queue = [...items];
  const runners = Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      const next = queue.shift();
      if (next !== undefined) await worker(next);
    }
  });
  await Promise.all(runners);
}

export async function run() {
  if (apiKeys.length === 0) {
    console.error('ERROR: GEMINI_API_KEY is not set in .env.local.');
    process.exit(1);
  }

  if (!existsSync(ffmpegPath)) throw new Error(`ffmpeg not found at ${ffmpegPath}`);

  mkdirSync(path.join(previewOut, 'audio'), { recursive: true });

  console.log(`=== Generating Ghanaian English Kore TTS (${STRICT_TTS_MODEL} ONLY, ${apiKeys.length - exhaustedDailyKeys.size} active key(s)) for Batch 44 (60 pages) ===`);

  interface Job {
    idx: number;
    story: (typeof BATCH_44_STORIES)[number];
    pageNo: number;
    text: string;
    pubDir: string;
  }

  const jobs: Job[] = [];
  let counter = 0;
  for (const story of BATCH_44_STORIES) {
    const pubDir = path.join(repoRoot, 'public/story-spark-preview/candidates', story.key);
    mkdirSync(pubDir, { recursive: true });
    for (let i = 0; i < story.pages.length; i++) {
      counter++;
      jobs.push({
        idx: counter,
        story,
        pageNo: i + 1,
        text: story.pages[i].text.trim(),
        pubDir,
      });
    }
  }

  let completed = 0;
  const total = jobs.length;

  await runPool(jobs, 3, async (job) => {
    const { idx, story, pageNo, text, pubDir } = job;
    const id = `tts-Kore-page${pageNo}`;
    const mp3Pub = path.join(pubDir, `${id}.mp3`);
    const durPub = path.join(pubDir, `${id}.dur.txt`);
    const pcmPath = path.join(pubDir, `${id}.pcm`);
    const okMarker = path.join(pubDir, `${id}.gh-v31.ok`);

    if (existsSync(okMarker) && existsSync(mp3Pub) && existsSync(durPub)) {
      const mp3Buf = readFileSync(mp3Pub);
      const audioFileName = `${sha(mp3Buf).slice(0, 12)}.mp3`;
      const dest = path.join(previewOut, 'audio', audioFileName);
      if (!existsSync(dest)) copyFileSync(mp3Pub, dest);
      completed++;
      console.log(`[${completed}/${total} SKIP verified] ${story.key}/${id} (${audioFileName})`);
      return;
    }

    const wordCount = text.split(/\s+/).length;
    console.log(`[Job ${idx}/${total}] Generating ${story.key}/${id} (${wordCount} words)...`);

    let attempts = 0;
    while (attempts < 12) {
      attempts++;
      try {
        const t0 = Date.now();
        const pcm = await fetchGhanaianKoreTTS(text);
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        const durationMs = Math.round((pcm.length / 48000) * 1000);
        const wps = wordCount / (durationMs / 1000);
        if (wps < 1.35 && attempts < 2) {
          throw new Error(`Low WPS (${wps.toFixed(2)} w/s, ${(durationMs / 1000).toFixed(1)}s for ${wordCount}w) — retrying`);
        }

        writeFileSync(durPub, String(durationMs));
        writeFileSync(pcmPath, pcm);
        try {
          execFileSync(ffmpegPath, ['-y', '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', pcmPath, mp3Pub], { stdio: 'ignore' });
        } finally {
          if (existsSync(pcmPath)) unlinkSync(pcmPath);
        }

        const mp3Buf = readFileSync(mp3Pub);
        const audioHash = sha(mp3Buf);
        const audioFileName = `${audioHash.slice(0, 12)}.mp3`;
        copyFileSync(mp3Pub, path.join(previewOut, 'audio', audioFileName));
        writeFileSync(okMarker, audioFileName, 'utf8');

        completed++;
        console.log(`[${completed}/${total} OK in ${elapsed}s] ${story.key}/${id} -> ${(durationMs / 1000).toFixed(1)}s (${wps.toFixed(2)} w/s), ${audioFileName}`);
        break;
      } catch (err: any) {
        console.warn(`  [Attempt ${attempts}/12] ${story.key}/${id}: ${err.message}`);
        if (attempts >= 12) throw err;
        await sleep(2500);
      }
    }
  });

  // Clean up temporary .gh-v31.ok markers
  for (const job of jobs) {
    const okMarker = path.join(job.pubDir, `tts-Kore-page${job.pageNo}.gh-v31.ok`);
    if (existsSync(okMarker)) unlinkSync(okMarker);
  }

  console.log('\nAll 60 Batch 44 audio clips generated strictly with gemini-3.1-flash-tts-preview (Ghanaian English Kore)!');
}

if (require.main === module || process.argv[1]?.endsWith('generate-batch-44-narration.ts')) {
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
