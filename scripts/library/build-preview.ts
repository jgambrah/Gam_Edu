/**
 * Builds the Story Spark PREVIEW data into public/story-spark-preview/ from the pilot stories:
 *   catalogue.json   catalogue entries (same shape as story_catalogue documents) + catalogueVersion
 *   preview.json     per-story preview-only information: placeholder art, briefs, asset status, review questions
 *   packages/<key>.json   immutable story packages (text, sentences, narration refs + timing, activities, glossary)
 *   audio/<hash12>.mp3    PLACEHOLDER narration made locally with espeak-ng (free); never production audio
 *
 * Nothing here touches Firebase, Storage, or the network. Usage:  npx tsx scripts/library/build-preview.ts
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { PILOT_STORIES } from '../../src/lib/story-library/pilot/pilot-stories';
import { ageTiersFor, READING_LEVELS, toCatalogueFacets } from '../../src/lib/story-library/classification';
import { effectiveHighlight, splitSentences } from '../../src/lib/story-library/premium';
import type { CatalogueEntry, StoryPackage } from '../../src/lib/story-library/types';
import { PREVIEW_BASE } from '../../src/lib/story-library/preview-source';
import { GHANAIAN_PRONUNCIATIONS } from '../../src/lib/story-library/pronunciation/dictionary';
import { buildSpokenScript, indexDictionary, splitToken } from '../../src/lib/story-library/pronunciation/apply';
import { illustrationStatus } from '../../src/lib/story-library/illustration/plan';

const root = path.resolve(__dirname, '../..');
const out = path.join(root, 'public/story-spark-preview');
const tmp = mkdtempSync(path.join(tmpdir(), 'preview-audio-'));
const sha = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');

// 1) narration (placeholder voice + exact engine word marks)
const pagesJson = path.join(tmp, 'pages.json');
// Pronunciation: the voice is given the dictionary's CANDIDATE respellings (this is placeholder audio); the written text is untouched.
writeFileSync(pagesJson, JSON.stringify(Object.fromEntries(PILOT_STORIES.map((s) => [s.key, s.pages.map((p) => ({ display: p.text, spoken: buildSpokenScript(p.text, GHANAIAN_PRONUNCIATIONS, 'espeak', { allowUnverified: true }).spoken }))]))));
execFileSync('python3', [path.join(root, 'scripts/library/build-preview-audio.py'), pagesJson, path.join(tmp, 'audio')], { stdio: 'inherit' });
const timing = JSON.parse(readFileSync(path.join(tmp, 'audio/timing.json'), 'utf8')) as Record<string, Array<{ file: string; sha256: string; bytes: number; durationMs: number; words: Array<[number, number]>; sentences: Array<[number, number]> }>>;

rmSync(out, { recursive: true, force: true });
mkdirSync(path.join(out, 'audio'), { recursive: true });
mkdirSync(path.join(out, 'packages'), { recursive: true });
for (const f of readdirSync(path.join(tmp, 'audio')).filter((f) => f.endsWith('.mp3'))) copyFileSync(path.join(tmp, 'audio', f), path.join(out, 'audio', f));

// 1b) REAL candidate assets for Efua page 1 (generated once, stored; students never trigger Gemini). Voice: Kore. Not approved.
const CAND = path.join(root, 'assets/premium-candidates/efuas-honest-business');
const realFiles = { audio: path.join(CAND, 'tts-Kore-page1.mp3'), image: path.join(CAND, 'page1-1.webp') };
const haveReal = existsSync(realFiles.audio) && existsSync(realFiles.image);
mkdirSync(path.join(out, 'images'), { recursive: true });
let realImageBytes = 0, realImageSha = '';
let realAudio: { hash: string; file: string; bytes: number; durationMs: number } | undefined; let realImageSrc: string | undefined;
if (haveReal) {
  const ab = readFileSync(realFiles.audio); const ib = readFileSync(realFiles.image);
  const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', realFiles.audio]).toString().trim());
  realImageBytes = ib.length; realImageSha = sha(ib);
  const aName = `kore-${sha(ab).slice(0, 12)}.mp3`, iName = `efua-p1-${sha(ib).slice(0, 12)}.webp`;
  copyFileSync(realFiles.audio, path.join(out, 'audio', aName)); copyFileSync(realFiles.image, path.join(out, 'images', iName));
  realAudio = { hash: `sha256:${sha(ab)}`, file: aName, bytes: ab.length, durationMs: Math.round(dur * 1000) };
  realImageSrc = `${PREVIEW_BASE}/images/${iName}`;
}

// 2) packages, catalogue entries and preview side-car
const dictIndex = indexDictionary(GHANAIAN_PRONUNCIATIONS);
const pronunciationFor = (texts: string[]) => {
  const seen = new Map<string, { written: string; language: string; status: string; guidance: string; reviewerNotes: string[] }>();
  for (const t of texts) for (const tok of t.split(/\s+/)) {
    const core = splitToken(tok)[1]; const e = core ? dictIndex.get(core) : undefined;
    if (e && !seen.has(e.id)) seen.set(e.id, { written: e.written, language: e.language, status: e.status, guidance: e.guidance, reviewerNotes: e.reviewerNotes });
  }
  return [...seen.values()];
};
const entries: CatalogueEntry[] = [];
const previewInfo: Record<string, unknown> = {};
PILOT_STORIES.forEach((s, idx) => {
  const t = timing[s.key];
  const assets: StoryPackage['assets'] = {};
  const pkgBase = {
    schemaVersion: 1 as const, storyId: s.key, version: 1, title: s.title, ageTiers: ageTiersFor(s.classification.ageMin, s.classification.ageMax),
    language: s.classification.language, narrationLocale: s.classification.narrationLocale,
    pages: s.pages.map((p, i) => {
      const a = t[i];
      if (s.key === 'efuas-honest-business' && i === 0 && realAudio) {
        // Real clip: no word marks exist for it, so the reader plays it WITHOUT highlighting rather than faking timing.
        assets[realAudio.hash] = { path: `${PREVIEW_BASE}/audio/${realAudio.file}`, bytes: realAudio.bytes, type: 'audio/mpeg' };
        return { n: 1, text: p.text, sentences: splitSentences(p.text), alt: p.alt, audio: { hash: realAudio.hash, durationMs: realAudio.durationMs } };
      }
      const hash = `sha256:${a.sha256}`;
      assets[hash] = { path: `${PREVIEW_BASE}/audio/${a.file}`, bytes: a.bytes, type: 'audio/mpeg' };
      const sentences = splitSentences(p.text);
      return {
        n: i + 1, text: p.text, sentences, alt: p.alt,
        audio: { hash, durationMs: a.durationMs, timing: { granularity: 'word' as const, method: 'tts-marks' as const, verified: true, sentences: a.sentences, words: a.words } },
      };
    }),
    activities: s.activities, glossary: s.glossary, assets,
  };
  // Safety net: every page must truly qualify for word-level highlighting, or the build fails.
  for (const p of pkgBase.pages) {
    if (!p.audio?.timing) continue; // real clip without marks: reader shows no highlighting
    const h = effectiveHighlight({ text: p.text, sentences: p.sentences, audio: p.audio });
    if (h.level !== 'word') throw new Error(`${s.key} page ${p.n}: timing not usable: ${h.reason}`);
  }
  const contentHash = `sha256:${sha(JSON.stringify(pkgBase))}`;
  const pkg: StoryPackage = { ...pkgBase, contentHash };
  const json = JSON.stringify(pkg);
  writeFileSync(path.join(out, 'packages', `${s.key}.json`), json);
  const packageHash = `sha256:${sha(json)}`;
  const f = toCatalogueFacets(s.classification);
  const level = READING_LEVELS.find((l) => l.id === s.classification.readingLevel)?.order;
  entries.push({
    storyKey: s.key, version: 1, packageVersion: 1, status: 'published', title: s.title, summary: s.summary, language: 'en',
    ageTiers: pkg.ageTiers, level, categories: s.classification.genres, themes: s.classification.themes, objectives: s.classification.objectives,
    pageCount: s.pages.length, durationSec: s.classification.estimatedDurationSec, hasNarration: true, hasActivities: true,
    packagePath: `${PREVIEW_BASE}/packages/${s.key}.json`, packageHash, packageBytes: json.length, contentHash,
    sortKey: idx + 1, updatedAt: 1 as unknown, attribution: 'GAM EDU original draft (unreviewed)', publishedBy: 'preview-build',
    classIds: f.classIds, classMin: f.classMin, classMax: f.classMax, ageMin: f.ageMin, ageMax: f.ageMax, readingLevel: f.readingLevel,
    difficulty: f.difficulty, genres: f.genres, ghanaianContext: f.ghanaianContext,
  });
  previewInfo[s.key] = {
    set: s.set, palette: s.palette, classification: s.classification, characters: s.characters, narrationPlan: s.narrationPlan, music: s.music,
    culturalNotes: s.culturalNotes, reviewQuestions: s.reviewQuestions,
    pages: s.pages.map((p, i) => ({ motif: p.motif, brief: p.brief, narration: p.narration, ...(s.key === 'efuas-honest-business' && i === 0 && realImageSrc ? { image: { src: realImageSrc, alt: p.alt } } : {}) })),
    realAssets: s.key === 'efuas-honest-business' && haveReal ? { narrationPages: [1], imagePages: [1], voice: 'Kore' } : undefined,
    teacherGuide: s.teacherGuide,
    pronunciation: pronunciationFor(s.pages.map((p) => p.text)),
    illustration: s.illustrationPlan ? illustrationStatus(s.illustrationPlan, s.illustrationPlan.shots.map((x) => ({ page: x.page, status: (s.key === 'efuas-honest-business' && haveReal && x.page === 1 ? 'candidate' : 'placeholder') as 'candidate' | 'placeholder', ...(s.key === 'efuas-honest-business' && haveReal && x.page === 1 ? { file: { path: 'page1-1.webp', widthPx: 960, heightPx: 717, bytes: realImageBytes, sha256: realImageSha } } : {}) }))) : undefined,
    assetStatus: {
      text: s.set === 'benchmark' ? 'revised draft (premium benchmark), awaiting editorial, cultural and financial-literacy review' : 'original-draft-unreviewed',
      illustrations: s.key === 'efuas-honest-business' && haveReal ? 'page 1: one generated candidate image (not approved); pages 2-12: placeholder art' : s.illustrationPlan ? 'placeholder art only; briefs, character sheets and a shot list exist; NO image has been generated or approved' : 'placeholder',
      narration: s.key === 'efuas-honest-business' && haveReal ? 'page 1: natural voice (Kore), candidate, no word highlighting; pages 2-12: placeholder voice' : 'placeholder-tts (espeak-ng, robotic); not production narration',
      pronunciation: 'dictionary candidates; NONE verified by a native speaker (an informal owner listening check is not a verification)',
      timing: 'engine word marks, not human verified',
      activities: 'draft-unreviewed', music: 'none', licences: 'not-applicable-to-placeholders',
    },
  };
});
writeFileSync(path.join(out, 'catalogue.json'), JSON.stringify({ catalogueVersion: 1, entries }));
writeFileSync(path.join(out, 'preview.json'), JSON.stringify(previewInfo));
rmSync(tmp, { recursive: true, force: true });
console.log(`built ${entries.length} stories into ${path.relative(root, out)}`);
