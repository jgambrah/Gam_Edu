/**
 * ONE-TIME SEED: copy the bundled BECE papers into the shared question bank in Firestore.
 *
 * After this, every school reads each paper with ONE Firestore read, and the app no longer has to download
 * the bundled copy (it stays in the code only as a fallback).
 *
 * Run from the project root (the folder with package.json):
 *   npx tsx scripts/seed-question-bank.ts            REPORT ONLY — shows what would be written, nothing changes
 *   npx tsx scripts/seed-question-bank.ts --apply    writes the papers
 *   add --force to overwrite papers that are already in the bank (by default they are left alone)
 *
 * Uses FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY from .env (same as the other scripts).
 *
 * Where papers go (the paths the Senior Academy page reads):
 *   global_curriculum/jhs/subjects/mathematics/past_papers/bece_{year}_math_p{1|2}
 *   global_curriculum/jhs/subjects/mathematics/mocks/mock_{n}        { paper1, paper2 }
 *   global_curriculum/jhs/subjects/english/mocks/mock_{n}            { paper1, paper2 }
 *   global_curriculum/jhs/subjects/science/mock_exams/mock_{n}       { paper1, paper2 }
 * Each paper is stored as a JSON string in a `json` field (Firestore cannot hold nested arrays, which some
 * papers use for tables); the page decodes it.
 */
import * as dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

import * as M2013 from '../src/lib/data/bece-math-2013';
import * as M2014 from '../src/lib/data/bece-math-2014';
import * as M2015 from '../src/lib/data/bece-math-2015';
import * as M2016 from '../src/lib/data/bece-math-2016';
import * as M2017 from '../src/lib/data/bece-math-2017';
import * as M2018 from '../src/lib/data/bece-math-2018';
import * as MM1 from '../src/lib/data/bece-math-mock-1';
import * as MM2 from '../src/lib/data/bece-math-mock-2';
import * as MM3 from '../src/lib/data/bece-math-mock-3';
import * as MM4 from '../src/lib/data/bece-math-mock-4';
import * as MM5 from '../src/lib/data/bece-math-mock-5';
import * as MM6 from '../src/lib/data/bece-math-mock-6';
import * as MM7 from '../src/lib/data/bece-math-mock-7';
import * as MM8 from '../src/lib/data/bece-math-mock-8';
import * as MM9 from '../src/lib/data/bece-math-mock-9';
import * as MM10 from '../src/lib/data/bece-math-mock-10';
import * as MM11 from '../src/lib/data/bece-math-mock-11';
import * as EM1 from '../src/lib/data/bece-english-mock-1';
import * as EM2 from '../src/lib/data/bece-english-mock-2';
import * as EM3 from '../src/lib/data/bece-english-mock-3';
import * as EM4 from '../src/lib/data/bece-english-mock-4';
import * as EM5 from '../src/lib/data/bece-english-mock-5';
import * as EM6 from '../src/lib/data/bece-english-mock-6';
import * as EM7 from '../src/lib/data/bece-english-mock-7';
import * as EM8 from '../src/lib/data/bece-english-mock-8';
import * as EM9 from '../src/lib/data/bece-english-mock-9';
import * as EM10 from '../src/lib/data/bece-english-mock-10';
import * as EM11 from '../src/lib/data/bece-english-mock-11';
import * as SM1 from '../src/lib/data/jhs-curriculum-set-132';
import * as SM2 from '../src/lib/data/jhs-curriculum-set-133';
import * as SM3 from '../src/lib/data/jhs-curriculum-set-134';
import * as SM4 from '../src/lib/data/jhs-curriculum-set-135';
import * as SM5 from '../src/lib/data/jhs-curriculum-set-136';
import * as SM6 from '../src/lib/data/jhs-curriculum-set-137';
import * as SM7 from '../src/lib/data/jhs-curriculum-set-138';
import * as SM8 from '../src/lib/data/jhs-curriculum-set-139';
import * as SM9 from '../src/lib/data/jhs-curriculum-set-140';
import * as SM10 from '../src/lib/data/jhs-curriculum-set-141';
import * as SM11 from '../src/lib/data/jhs-curriculum-set-142';

dotenv.config({ path: '.env' });

const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');
const MAX_BYTES = 1_000_000; // Firestore's limit is 1 MiB per document; keep a margin.

type Entry = { path: string; title: string; content: any };
const entries: Entry[] = [];
const ROOT = 'global_curriculum/jhs/subjects';

const past: [number, any][] = [[2013, M2013], [2014, M2014], [2015, M2015], [2016, M2016], [2017, M2017], [2018, M2018]];
for (const [year, mod] of past) {
  for (const n of [1, 2]) {
    const set = mod[`SET_BECE_${year}_MATH_P${n}`];
    entries.push({ path: `${ROOT}/mathematics/past_papers/bece_${year}_math_p${n}`, title: `BECE ${year} Mathematics Paper ${n}`, content: set });
  }
}

function addMocks(mods: any[], subjectKey: 'MATH' | 'ENGLISH' | 'SCIENCE', folder: string, label: string) {
  mods.forEach((mod, i) => {
    const n = i + 1;
    entries.push({
      path: `${ROOT}/${folder}/mock_${n}`,
      title: `BECE ${label} Mock ${n}`,
      content: { paper1: mod[`SET_BECE_MOCK_${n}_${subjectKey}_P1`], paper2: mod[`SET_BECE_MOCK_${n}_${subjectKey}_P2`] },
    });
  });
}
addMocks([MM1, MM2, MM3, MM4, MM5, MM6, MM7, MM8, MM9, MM10, MM11], 'MATH', 'mathematics/mocks', 'Mathematics');
addMocks([EM1, EM2, EM3, EM4, EM5, EM6, EM7, EM8, EM9, EM10, EM11], 'ENGLISH', 'english/mocks', 'English Language');
addMocks([SM1, SM2, SM3, SM4, SM5, SM6, SM7, SM8, SM9, SM10, SM11], 'SCIENCE', 'science/mock_exams', 'Integrated Science');

(async () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/"/g, '');
  if (!projectId || !clientEmail || !privateKey) {
    console.error('Missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY in .env');
    process.exit(1);
  }
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  const db = getFirestore();

  console.log(APPLY ? 'WRITING papers to the question bank…' : 'REPORT ONLY (add --apply to write)');
  let written = 0, skippedExisting = 0, problems = 0;
  for (const e of entries) {
    const missing = e.content === undefined || e.content === null
      || (e.content && 'paper1' in e.content && (!e.content.paper1 || !e.content.paper2));
    if (missing) {
      console.log(`  ✗ ${e.path} — data not found in the bundled file, skipped`);
      problems++;
      continue;
    }
    const json = JSON.stringify(e.content);
    const bytes = Buffer.byteLength(json, 'utf8');
    if (bytes > MAX_BYTES) {
      console.log(`  ✗ ${e.path} — ${(bytes / 1024).toFixed(0)} KB is too large for one document, skipped (the app keeps using the bundled copy)`);
      problems++;
      continue;
    }
    const ref = db.doc(e.path);
    const existing = await ref.get();
    if (existing.exists && !FORCE) {
      console.log(`  • ${e.path} — already in the bank, left alone (use --force to replace)`);
      skippedExisting++;
      continue;
    }
    console.log(`  ✓ ${e.path} — ${(bytes / 1024).toFixed(0)} KB${existing.exists ? ' (replacing)' : ''}`);
    if (APPLY) {
      await ref.set({ title: e.title, json, format: 'json-v1', source: 'bundled-seed', seededAt: FieldValue.serverTimestamp() });
      written++;
    }
  }
  console.log(`\n${APPLY ? `Written: ${written}` : `Would write: ${entries.length - skippedExisting - problems}`}, already present: ${skippedExisting}, problems: ${problems}`);
  console.log(APPLY ? 'Done.' : 'Nothing was written.');
})().catch(err => { console.error(err); process.exit(1); });
