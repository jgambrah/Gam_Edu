/**
 * One-off premium candidate generation for Efua's Honest Business (illustration sample + narration audition).
 *
 * SAFE BY DEFAULT: with no flags it only prints the plan and a worst-case cost estimate. It makes paid calls only when
 * run with --approve-spend AND GEMINI_API_KEY is set (the existing GAM EDU project key, supplied by the environment: it is
 * never read from, or written to, a file). Every call is reserved against a hard ceiling (default $10) BEFORE it is made.
 * Output goes to assets/premium-candidates/ (NOT public/): candidates are never shown to learners until reviewed.
 *
 *   npx tsx scripts/library/premium-generate.ts                       # dry run
 *   GEMINI_API_KEY=... npx tsx scripts/library/premium-generate.ts --approve-spend \
 *       --image-model <id> --tts-model gemini-3.1-flash-tts-preview [--ceiling 10]
 *
 * STATUS: NOT RUN AGAINST THE LIVE API. The sandbox it was written in has no key and no route to Google.
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { EFUA_ILLUSTRATION_PLAN } from '../../src/lib/story-library/pilot/efua-premium';
import { assemblePrompt, promptHash } from '../../src/lib/story-library/illustration/plan';
import { GHANAIAN_PRONUNCIATIONS } from '../../src/lib/story-library/pronunciation/dictionary';
import { buildSpokenScript } from '../../src/lib/story-library/pronunciation/apply';
import { newLedger, reserve, settle, spentOrReservedUsd, type Ledger } from '../../src/lib/story-library/spend-ledger';
import { PILOT_STORIES } from '../../src/lib/story-library/pilot/pilot-stories';

// Convenience for running on your own computer: if GEMINI_API_KEY is not already set, read ONLY that variable from the
// git-ignored .env.local in the project folder. The key is never printed, logged or written anywhere by this script.
if (!process.env.GEMINI_API_KEY && existsSync(path.resolve(__dirname, '../../.env.local'))) {
  const m = /^\s*GEMINI_API_KEY\s*=\s*["']?([^"'\r\n]+?)["']?\s*$/m.exec(readFileSync(path.resolve(__dirname, '../../.env.local'), 'utf8'));
  if (m) process.env.GEMINI_API_KEY = m[1];
}
const arg = (n: string) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : undefined; };
const approve = process.argv.includes('--approve-spend');
const ceiling = Number(arg('ceiling') ?? 10);
const imageModel = arg('image-model'), ttsModel = arg('tts-model') ?? 'gemini-3.1-flash-tts-preview';
const out = path.resolve(__dirname, '../../assets/premium-candidates/efuas-honest-business');
const ledgerPath = path.join(out, 'spend-ledger.json');

// Conservative upper bounds (see premium-cost.ts; re-verify against Google's pricing page before approving).
const IMAGE_UPPER_USD = 0.12;          // above the reported 2K price of ~$0.10
const TTS_UPPER_USD_PER_SECOND = 25 * 20 / 1e6 * 2; // 2x the audio-token price, to cover input tokens and rounding
const NAMES = ['Efua', 'Kwabena', 'Dede', 'Nana', 'Ama', 'Kofi', 'Kwame', 'Akosua', 'Adwoa', 'Nhyira', 'Yaa'];
const VOICES = ['Kore', 'Puck'];

const efua = PILOT_STORIES.find((s) => s.key === 'efuas-honest-business')!;
const plan = EFUA_ILLUSTRATION_PLAN;
const refShot = (id: string) => ({ ...plan.shots[1], page: -1, characters: [{ id, expression: 'neutral, friendly', pose: 'standing, full body, front three-quarter view, neutral background' }], action: `Character reference sheet for ${id}: full body, plain warm background.`, mustShow: ['full body', 'face clearly visible'] });
const imageJobs = [
  ...['efua', 'nana-ama'].flatMap((id) => [1, 2].map((n) => ({ id: `ref-${id}-${n}`, prompt: assemblePrompt(plan, refShot(id)) }))),
  ...[1, 2, 3].map((n) => ({ id: `page1-${n}`, prompt: assemblePrompt(plan, plan.shots[1]) })),
];
const page1 = efua.pages[0].text;
const ttsJobs = VOICES.flatMap((v) => [
  { id: `tts-${v}-page1`, voice: v, seconds: 30, text: page1, hints: buildSpokenScript(page1, GHANAIAN_PRONUNCIATIONS, 'gemini-tts', { allowUnverified: true }).promptHints },
  { id: `tts-${v}-names`, voice: v, seconds: 3 * NAMES.length, text: NAMES.join('. ') + '.', hints: buildSpokenScript(NAMES.join(' '), GHANAIAN_PRONUNCIATIONS, 'gemini-tts', { allowUnverified: true }).promptHints },
]);
const worst = imageJobs.length * IMAGE_UPPER_USD + ttsJobs.reduce((n, j) => n + j.seconds * TTS_UPPER_USD_PER_SECOND, 0);

console.log(`Plan: ${imageJobs.length} images (worst case $${(imageJobs.length * IMAGE_UPPER_USD).toFixed(2)}), ${ttsJobs.length} TTS clips (worst case $${ttsJobs.reduce((n, j) => n + j.seconds * TTS_UPPER_USD_PER_SECOND, 0).toFixed(3)}). Total worst case $${worst.toFixed(2)} against a $${ceiling} ceiling.`);
if (worst > ceiling) { console.error('Refusing: worst-case estimate exceeds the ceiling.'); process.exit(2); }
const listMode = process.argv.includes('--list-models');
if (listMode) {
  // Free call: lists the models this key can use, so you can copy the exact image and TTS model ids. Spends nothing.
  if (!process.env.GEMINI_API_KEY) { console.error('GEMINI_API_KEY is not set.'); process.exit(3); }
  fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=200', { headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY } })
    .then((r) => r.json()).then((j: any) => (j.models ?? []).filter((m: any) => /image|tts|imagen/i.test(m.name)).forEach((m: any) => console.log(m.name.replace('models/', ''), '-', m.displayName)))
    .catch((e) => { console.error('could not list models:', e.message); process.exit(5); });
}
if (!listMode) { // list mode must not fall through to the generation checks while its fetch is still pending
if (!approve) { console.log('Dry run only. Nothing was called or written. Re-run with --approve-spend (and GEMINI_API_KEY) to generate.'); process.exit(0); }
if (!process.env.GEMINI_API_KEY) { console.error('GEMINI_API_KEY is not set: cannot make paid calls.'); process.exit(3); }
if (!imageModel) { console.error('--image-model is required (verify the current model id on Google’s pricing page first).'); process.exit(4); }

(async () => {
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  mkdirSync(out, { recursive: true });
  const ledger: Ledger = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, 'utf8')) : newLedger(ceiling);
  const save = () => writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
  const manifest: unknown[] = [];
  // A failed call returned no asset, so it is recorded as $0 (check Google billing for the true figure) and its id is freed for a retry.
  const failed = (l: Ledger, id: string) => { const e = l.entries.find((x) => x.id === id && x.actualUsd === undefined); if (e) { e.actualUsd = 0; e.id = `${id}#failed-${Date.now()}`; } };
  for (const j of imageJobs) {
    const r = reserve(ledger, j.id, 'image', IMAGE_UPPER_USD, new Date().toISOString()); if (!r.ok) { console.error('STOP:', r.reason); break; } save();
    try {
      const res: any = await ai.models.generateContent({ model: imageModel, contents: j.prompt, config: { responseModalities: ['IMAGE'] } });
      const part = res.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
      if (!part) throw new Error('no image returned');
      const buf = Buffer.from(part.inlineData.data, 'base64'); const f = `${j.id}.png`;
      writeFileSync(path.join(out, f), buf);
      settle(ledger, j.id, IMAGE_UPPER_USD); // exact usage is not read here; the upper bound is kept as the recorded cost
      manifest.push({ file: f, status: 'candidate', promptHash: promptHash(j.prompt), model: imageModel, sha256: createHash('sha256').update(buf).digest('hex'), bytes: buf.length });
    } catch (e) { console.error(j.id, 'failed:', (e as Error).message); failed(ledger, j.id); } save();
  }
  for (const j of ttsJobs) {
    const cost = j.seconds * TTS_UPPER_USD_PER_SECOND;
    const r = reserve(ledger, j.id, 'tts', cost, new Date().toISOString()); if (!r.ok) { console.error('STOP:', r.reason); break; } save();
    try {
      const style = `Narrate warmly in natural Ghanaian English. ${j.hints.join(' ')} Read these names clearly and slowly.`;
      const res: any = await ai.models.generateContent({ model: ttsModel, contents: `${style}\n\n${j.text}`, config: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: j.voice } } } } });
      const d = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data; if (!d) throw new Error('no audio returned');
      const pcm = Buffer.from(d, 'base64'); const f = `${j.id}.pcm`; writeFileSync(path.join(out, f), pcm); // raw 24 kHz mono 16-bit; convert with ffmpeg
      settle(ledger, j.id, cost);
      manifest.push({ file: f, status: 'candidate', engine: ttsModel, voice: j.voice, pronunciation: 'UNVERIFIED: awaiting native-speaker review', bytes: pcm.length });
    } catch (e) { console.error(j.id, 'failed:', (e as Error).message); failed(ledger, j.id); } save();
  }
  writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log(`Done. Recorded spend (upper bound) $${spentOrReservedUsd(ledger).toFixed(3)} of $${ceiling}.`);
})();
} // end !listMode
