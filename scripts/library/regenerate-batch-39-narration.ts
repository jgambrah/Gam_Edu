import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync, copyFileSync, unlinkSync } from 'node:fs';
import { execFileSync, execSync } from 'node:child_process';
import https from 'node:https';
import path from 'node:path';
import { BATCH_39_STORIES } from '../../src/lib/story-library/pilot/batch-39-stories';

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

const candidateModels = [
  'gemini-2.5-pro-preview-tts',
  'gemini-3.8-flash-tts',
  'gemini-3.1-flash-tts-preview',
];

function fetchPureTTS(model: string, textToSpeak: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Pure text only - absolutely NO meta-instructions or prompt prefixes!
    const payload = JSON.stringify({
      contents: [{ parts: [{ text: textToSpeak }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });

    const req = https.request(
      {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${model}:generateContent?key=${apiKey}`,
        method: 'POST',
        family: 4,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        timeout: 45000,
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            return reject(new Error(`HTTP ${res.statusCode}: ${raw.slice(0, 180)}`));
          }
          try {
            const data = JSON.parse(raw);
            const b64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (!b64) return reject(new Error('No inline audio data returned'));
            resolve(Buffer.from(b64, 'base64'));
          } catch (e: any) {
            reject(new Error(`Parse error: ${e.message}`));
          }
        });
      }
    );

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.on('error', (e) => reject(e));
    req.write(payload);
    req.end();
  });
}

async function callTTS(text: string): Promise<Buffer> {
  for (const model of candidateModels) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        return await fetchPureTTS(model, text);
      } catch (err: any) {
        console.warn(`[${model} attempt ${attempt}] error: ${err.message}`);
        await sleep(2000 * attempt);
      }
    }
  }
  throw new Error('All candidate TTS models failed');
}

export async function run() {
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY is not set in .env.local.');
    process.exit(1);
  }

  if (!existsSync(ffmpegPath)) throw new Error(`ffmpeg not found at ${ffmpegPath}`);

  mkdirSync(path.join(previewOut, 'audio'), { recursive: true });

  console.log(`Starting clean narration regeneration for Batch 39 (30 pages total)...`);
  console.log(`Voice: Kore (natural Ghanaian English)`);
  console.log(`Purity check: ZERO prompt prefixes or meta-instructions will be spoken.`);

  let pageCount = 0;
  for (const story of BATCH_39_STORIES) {
    console.log(`\n=== Story: ${story.title} (${story.key}) ===`);
    const pubDir = path.join(repoRoot, 'public/story-spark-preview/candidates', story.key);
    mkdirSync(pubDir, { recursive: true });

    for (let i = 0; i < story.pages.length; i++) {
      const pageNo = i + 1;
      const page = story.pages[i];
      pageCount++;
      const id = `tts-Kore-page${pageNo}`;
      const mp3Pub = path.join(pubDir, `${id}.mp3`);
      const durPub = path.join(pubDir, `${id}.dur.txt`);
      const pcmPath = path.join(pubDir, `${id}.pcm`);

      console.log(`[${pageCount}/30] Generating ${story.key}/${id} ("${page.text.slice(0, 45)}...")...`);

      // Pure text to speak:
      const cleanText = page.text.trim();
      const pcm = await callTTS(cleanText);
      const durationMs = Math.round((pcm.length / 48000) * 1000);

      writeFileSync(durPub, String(durationMs));
      writeFileSync(pcmPath, pcm);

      try {
        execFileSync(ffmpegPath, ['-y', '-f', 's16le', '-ar', '24000', '-ac', '1', '-i', pcmPath, mp3Pub], { stdio: 'ignore' });
      } finally {
        if (existsSync(pcmPath)) unlinkSync(pcmPath);
      }

      // Copy hashed audio to public audio folder
      const mp3Buf = readFileSync(mp3Pub);
      const audioHash = sha(mp3Buf);
      const audioFileName = `${audioHash.slice(0, 12)}.mp3`;
      copyFileSync(mp3Pub, path.join(previewOut, 'audio', audioFileName));

      console.log(`  -> Page ${pageNo} OK: ${(durationMs / 1000).toFixed(1)}s, ${audioFileName}`);
      await sleep(1000);
    }
  }

  console.log('\nAll 30 audio clips generated! Rebuilding packages, sidecars, and catalogue...');
  const finalizePath = 'C:/Users/DELL/.gemini/antigravity/brain/c229576f-28ea-43b0-b4c2-466e9ffcd1e3/scratch/finalize-batch-39.ts';
  if (existsSync(finalizePath)) {
    execSync(`npx tsx ${finalizePath}`, { cwd: repoRoot, stdio: 'inherit' });
  }

  console.log('\nSUCCESS! Batch 39 narration has been completely regenerated with pure Kore voice.');
}

if (require.main === module || process.argv[1]?.endsWith('regenerate-batch-39-narration.ts')) {
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
