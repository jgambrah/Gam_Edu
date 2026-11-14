import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, unlinkSync } from 'node:fs';
import { execFile, execFileSync, execSync } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { BATCH_39_STORIES } from '../../src/lib/story-library/pilot/batch-39-stories';

const execFileAsync = promisify(execFile);

const repoRoot = path.resolve(__dirname, '../..');
const envPath = path.join(repoRoot, '.env.local');
const previewOut = path.join(repoRoot, 'public/story-spark-preview');
const ffmpegPath = 'C:/Users/DELL/.gemini/antigravity/brain/ab432cb2-3465-4ebb-a6a5-9020b86bd570/scratch/node_modules/ffmpeg-static/ffmpeg.exe';

let apiKey = process.env.GEMINI_API_KEY || '';
if (!apiKey && existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf8');
  const m = /^\s*GEMINI_API_KEY\s*=\s*["']?([^"'\r\n]+?)["']?\s*$/m.exec(content);
  if (m) apiKey = m[1].trim();
}

const sha = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Exact model used across all earlier Ghanaian English stories in Story Spark:
const ttsModel = 'gemini-3.1-flash-tts-preview';

async function fetchGhanaianKoreTTS(text: string, tempDir: string, tag: string): Promise<Buffer> {
  // Exact director prompt used in Batches 1–29 and verified on Page 1 sample:
  const prompt = `Read the following paragraph aloud in warm, natural Ghanaian English, speaking ONLY the exact words below with no introduction:\n\n${text}`;
  const payload = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
    },
  });

  const reqFile = path.join(tempDir, `tts-req-${tag}.json`);
  const resFile = path.join(tempDir, `tts-res-${tag}.json`);
  writeFileSync(reqFile, payload, 'utf8');

  try {
    await execFileAsync(
      'curl.exe',
      [
        '-4',
        '-sS',
        '--compressed',
        '--max-time',
        '210',
        '-X',
        'POST',
        `https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent?key=${apiKey}`,
        '-H',
        'Content-Type: application/json',
        '-d',
        `@${reqFile}`,
        '-o',
        resFile,
      ],
      { maxBuffer: 10 * 1024 * 1024 }
    );

    const raw = readFileSync(resFile, 'utf8');
    const data = JSON.parse(raw);
    if (data.error) {
      throw new Error(`API Error ${data.error.code}: ${data.error.message}`);
    }
    const b64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!b64) throw new Error(`No inline audio data returned: ${raw.slice(0, 200)}`);
    return Buffer.from(b64, 'base64');
  } finally {
    if (existsSync(reqFile)) unlinkSync(reqFile);
    if (existsSync(resFile)) unlinkSync(resFile);
  }
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
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY is not set in .env.local.');
    process.exit(1);
  }

  if (!existsSync(ffmpegPath)) throw new Error(`ffmpeg not found at ${ffmpegPath}`);

  mkdirSync(path.join(previewOut, 'audio'), { recursive: true });

  console.log(`=== Generating Ghanaian English Kore TTS (${ttsModel}) for Batch 39 ===`);

  interface Job {
    idx: number;
    story: (typeof BATCH_39_STORIES)[number];
    pageNo: number;
    text: string;
    pubDir: string;
  }

  const jobs: Job[] = [];
  let counter = 0;
  for (const story of BATCH_39_STORIES) {
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

  // Mark already-verified sample (how-far-is-far-measuring-space page 1)
  const sampleMp3 = path.join(repoRoot, 'public/story-spark-preview/candidates/how-far-is-far-measuring-space/tts-Kore-page1.mp3');
  const sampleMarker = path.join(repoRoot, 'public/story-spark-preview/candidates/how-far-is-far-measuring-space/tts-Kore-page1.gh-v31.ok');
  if (existsSync(sampleMp3) && sha(readFileSync(sampleMp3)).slice(0, 12) === 'dc1483fe4128') {
    writeFileSync(sampleMarker, 'dc1483fe4128', 'utf8');
  }

  let completed = 0;

  await runPool(jobs, 2, async (job) => {
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
      console.log(`[${completed}/30 SKIP verified] ${story.key}/${id} (${audioFileName})`);
      return;
    }

    const wordCount = text.split(/\s+/).length;
    console.log(`[Job ${idx}/30] Generating ${story.key}/${id} (${wordCount} words)...`);

    let attempts = 0;
    while (attempts < 4) {
      attempts++;
      try {
        const t0 = Date.now();
        const pcm = await fetchGhanaianKoreTTS(text, pubDir, `${story.key}-p${pageNo}`);
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        const durationMs = Math.round((pcm.length / 48000) * 1000);
        const wps = wordCount / (durationMs / 1000);
        if (wps < 1.35 && attempts < 3) {
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
        console.log(`[${completed}/30 OK in ${elapsed}s] ${story.key}/${id} -> ${(durationMs / 1000).toFixed(1)}s (${wps.toFixed(2)} w/s), ${audioFileName}`);
        break;
      } catch (err: any) {
        console.warn(`  [Attempt ${attempts}/4] ${story.key}/${id}: ${err.message}`);
        if (attempts >= 4) throw err;
        await sleep(4000 * attempts);
      }
    }
  });

  // Clean up temporary .gh-v31.ok markers
  for (const job of jobs) {
    const okMarker = path.join(job.pubDir, `tts-Kore-page${job.pageNo}.gh-v31.ok`);
    if (existsSync(okMarker)) unlinkSync(okMarker);
  }

  console.log('\nAll 30 audio clips generated! Rebuilding packages, sidecars, and catalogue...');
  const finalizePath = 'C:/Users/DELL/.gemini/antigravity/brain/c229576f-28ea-43b0-b4c2-466e9ffcd1e3/scratch/finalize-batch-39.ts';
  if (existsSync(finalizePath)) {
    execSync(`npx tsx ${finalizePath}`, { cwd: repoRoot, stdio: 'inherit' });
  }

  console.log('\nSUCCESS! Batch 39 narration has been completely regenerated with authentic Ghanaian English Kore voice.');
}

if (require.main === module || process.argv[1]?.endsWith('regenerate-batch-39-narration.ts')) {
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
