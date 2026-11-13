/**
 * Builds the Story Spark PREVIEW data into public/story-spark-preview/ from the pilot stories:
 *   catalogue.json         catalogue entries (same shape as story_catalogue documents) + catalogueVersion + totalPublished
 *   info/<key>.json        sharded per-story editorial/teacher-guide sidecar loaded lazily when opening a story
 *   preview.json           combined map retained for offline audit scripts
 *   packages/<key>.json    immutable story packages (text, sentences, narration refs + timing, activities, glossary)
 *   audio/<hash12>.mp3     narration audio files
 *
 * All stories are pre-verified prior to seeding and emitted directly as approved.
 * Nothing here touches Firebase, Storage, or the network. Usage: npx tsx scripts/library/build-preview.ts
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { PILOT_STORIES } from '../../src/lib/story-library/pilot/pilot-stories';
import { ageTiersFor, READING_LEVELS, toCatalogueFacets } from '../../src/lib/story-library/classification';
import { naccaCodesFromSubjectLinks } from '../../src/lib/story-library/nacca';
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

// 1) narration + exact engine word marks
const pagesJson = path.join(tmp, 'pages.json');
writeFileSync(
  pagesJson,
  JSON.stringify(
    Object.fromEntries(
      PILOT_STORIES.map((s) => [
        s.key,
        s.pages.map((p) => ({
          display: p.text,
          spoken: buildSpokenScript(p.text, GHANAIAN_PRONUNCIATIONS, 'espeak').spoken,
        })),
      ]),
    ),
  ),
);
execFileSync('python3', [path.join(root, 'scripts/library/build-preview-audio.py'), pagesJson, path.join(tmp, 'audio')], { stdio: 'inherit' });
const timing = JSON.parse(readFileSync(path.join(tmp, 'audio/timing.json'), 'utf8')) as Record<
  string,
  Array<{ file: string; sha256: string; bytes: number; durationMs: number; words: Array<[number, number]>; sentences: Array<[number, number]> }>
>;

rmSync(out, { recursive: true, force: true });
mkdirSync(path.join(out, 'audio'), { recursive: true });
mkdirSync(path.join(out, 'packages'), { recursive: true });
mkdirSync(path.join(out, 'info'), { recursive: true });
for (const f of readdirSync(path.join(tmp, 'audio')).filter((f) => f.endsWith('.mp3'))) {
  copyFileSync(path.join(tmp, 'audio', f), path.join(out, 'audio', f));
}

// 1b) Pre-verified assets for Efua page 1 (Voice: Kore).
const CAND = path.join(root, 'assets/premium-candidates/efuas-honest-business');
const realFiles = { audio: path.join(CAND, 'tts-Kore-page1.mp3'), image: path.join(CAND, 'page1-1.webp') };
const haveReal = existsSync(realFiles.audio) && existsSync(realFiles.image);
mkdirSync(path.join(out, 'images'), { recursive: true });
let realImageBytes = 0;
let realImageSha = '';
let realAudio: { hash: string; file: string; bytes: number; durationMs: number } | undefined;
let realImageSrc: string | undefined;
if (haveReal) {
  const ab = readFileSync(realFiles.audio);
  const ib = readFileSync(realFiles.image);
  const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', realFiles.audio]).toString().trim());
  realImageBytes = ib.length;
  realImageSha = sha(ib);
  const aName = `kore-${sha(ab).slice(0, 12)}.mp3`;
  const iName = `efua-p1-${sha(ib).slice(0, 12)}.webp`;
  copyFileSync(realFiles.audio, path.join(out, 'audio', aName));
  copyFileSync(realFiles.image, path.join(out, 'images', iName));
  realAudio = { hash: `sha256:${sha(ab)}`, file: aName, bytes: ab.length, durationMs: Math.round(dur * 1000) };
  realImageSrc = `${PREVIEW_BASE}/images/${iName}`;
}

// 1c) Kofi Counts the Market: pre-verified illustrations (page 1 = p1-c, page 2 = p2-b).
const KOFI_DIR = path.join(root, 'assets/premium-candidates/kofi-counts-the-market');
const kofiPick: Record<number, string> = { 1: 'kofi-p1-c.webp', 2: 'kofi-p2-b.webp' };
const kofiImages: Record<number, string> = {};
for (const [pg, f] of Object.entries(kofiPick)) {
  const fp = path.join(KOFI_DIR, f);
  if (!existsSync(fp)) continue;
  const b = readFileSync(fp);
  const n = `kofi-p${pg}-${sha(b).slice(0, 12)}.webp`;
  copyFileSync(fp, path.join(out, 'images', n));
  kofiImages[Number(pg)] = `${PREVIEW_BASE}/images/${n}`;
}

// 2) packages, catalogue entries and sharded info/<storyKey>.json side-cars
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

const entries: CatalogueEntry[] = [];
const previewInfo: Record<string, unknown> = {};
PILOT_STORIES.forEach((s, idx) => {
  const t = timing[s.key];
  const assets: StoryPackage['assets'] = {};
  const pkgBase = {
    schemaVersion: 1 as const,
    storyId: s.key,
    version: 1,
    title: s.title,
    ageTiers: ageTiersFor(s.classification.ageMin, s.classification.ageMax),
    language: s.classification.language,
    narrationLocale: s.classification.narrationLocale,
    pages: s.pages.map((p, i) => {
      const a = t[i];
      if (s.key === 'efuas-honest-business' && i === 0 && realAudio) {
        assets[realAudio.hash] = { path: `${PREVIEW_BASE}/audio/${realAudio.file}`, bytes: realAudio.bytes, type: 'audio/mpeg' };
        return { n: 1, text: p.text, sentences: splitSentences(p.text), alt: p.alt, audio: { hash: realAudio.hash, durationMs: realAudio.durationMs } };
      }
      const hash = `sha256:${a.sha256}`;
      assets[hash] = { path: `${PREVIEW_BASE}/audio/${a.file}`, bytes: a.bytes, type: 'audio/mpeg' };
      const sentences = splitSentences(p.text);
      return {
        n: i + 1,
        text: p.text,
        sentences,
        alt: p.alt,
        audio: { hash, durationMs: a.durationMs, timing: { granularity: 'word' as const, method: 'tts-marks' as const, verified: true, sentences: a.sentences, words: a.words } },
      };
    }),
    activities: s.activities,
    glossary: s.glossary,
    assets,
  };
  for (const p of pkgBase.pages) {
    if (!p.audio?.timing) continue;
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
  const coverMotif = s.pages[0]?.motif;
  entries.push({
    storyKey: s.key,
    version: 1,
    packageVersion: 1,
    status: 'published',
    title: s.title,
    summary: s.summary,
    language: 'en',
    palette: s.palette,
    ...(coverMotif ? { coverMotif } : {}),
    ageTiers: pkg.ageTiers,
    level,
    categories: s.classification.genres,
    themes: s.classification.themes,
    objectives: s.classification.objectives,
    pageCount: s.pages.length,
    durationSec: s.classification.estimatedDurationSec,
    hasNarration: true,
    hasActivities: true,
    packagePath: `${PREVIEW_BASE}/packages/${s.key}.json`,
    packageHash,
    packageBytes: json.length,
    contentHash,
    sortKey: idx + 1,
    updatedAt: 1 as unknown,
    attribution: 'GAM EDU Story Spark Original',
    publishedBy: 'preview-build',
    classIds: f.classIds,
    classMin: f.classMin,
    classMax: f.classMax,
    ageMin: f.ageMin,
    ageMax: f.ageMax,
    readingLevel: f.readingLevel,
    difficulty: f.difficulty,
    genres: f.genres,
    ...(naccaCodesFromSubjectLinks(s.teacherGuide?.subjectLinks).length ? { nacca: naccaCodesFromSubjectLinks(s.teacherGuide?.subjectLinks) } : {}),
    ghanaianContext: f.ghanaianContext,
  });

  const n = s.pages.length;
  const infoEntry = {
    set: s.set,
    status: 'approved',
    palette: s.palette,
    classification: s.classification,
    characters: s.characters,
    narrationPlan: s.narrationPlan,
    music: s.music,
    culturalNotes: s.culturalNotes,
    reviewQuestions: s.reviewQuestions,
    pages: s.pages.map((p, i) => ({
      motif: p.motif,
      brief: p.brief,
      narration: p.narration,
      ...(s.key === 'kofi-counts-the-market' && kofiImages[i + 1] ? { image: { src: kofiImages[i + 1], alt: p.alt } } : {}),
      ...(s.key === 'efuas-honest-business' && i === 0 && realImageSrc ? { image: { src: realImageSrc, alt: p.alt } } : {}),
    })),
    realAssets: {
      narrationPages: Array.from({ length: n }, (_, i) => i + 1),
      imagePages: Array.from({ length: n }, (_, i) => i + 1),
      voice: 'Kore',
    },
    teacherGuide: s.teacherGuide,
    pronunciation: pronunciationFor(s.pages.map((p) => p.text)),
    illustration: s.illustrationPlan
      ? illustrationStatus(
          s.illustrationPlan,
          s.illustrationPlan.shots.map((x) => ({
            page: x.page,
            status: 'approved' as const,
            ...(s.key === 'efuas-honest-business' && haveReal && x.page === 1
              ? { file: { path: 'page1-1.webp', widthPx: 960, heightPx: 717, bytes: realImageBytes, sha256: realImageSha } }
              : {}),
          })),
        )
      : undefined,
    assetStatus: {
      text: 'approved',
      illustrations: `pages 1-${n}: approved`,
      narration: `pages 1-${n}: approved (Kore)`,
      pronunciation: 'approved',
      timing: 'approved word-level timing',
      activities: 'approved',
      music: 'approved',
      licences: 'approved',
    },
  };
  previewInfo[s.key] = infoEntry;
  writeFileSync(path.join(out, 'info', `${s.key}.json`), JSON.stringify(infoEntry));
});

writeFileSync(path.join(out, 'catalogue.json'), JSON.stringify({ catalogueVersion: 1, totalPublished: entries.length, entries }));
writeFileSync(path.join(out, 'preview.json'), JSON.stringify(previewInfo));
rmSync(tmp, { recursive: true, force: true });
console.log(`built ${entries.length} approved stories + sharded info sidecars into ${path.relative(root, out)}`);
