/**
 * Adds `nacca` (NaCCA curriculum codes) to every catalogue entry in public/story-spark-preview/catalogue.json, reading
 * each story's teacher-guide subject links from info/<key>.json. It does not rebuild audio or packages, so it is safe to
 * run on an already published preview. Idempotent: entries whose codes are unchanged are left alone; changed entries get
 * the new catalogue version so browsers that cached the catalogue pick them up on their next delta refresh.
 * Usage: npx tsx scripts/library/backfill-nacca.ts
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { naccaCodesFromSubjectLinks } from '../../src/lib/story-library/nacca';

const dir = path.resolve(__dirname, '../../public/story-spark-preview');
const file = path.join(dir, 'catalogue.json');
const cat = JSON.parse(readFileSync(file, 'utf8')) as { catalogueVersion: number; totalPublished: number; entries: Array<Record<string, any>> };

const next = cat.catalogueVersion + 1;
let changed = 0;
let withCodes = 0;
for (const e of cat.entries) {
  const infoPath = path.join(dir, 'info', `${e.storyKey}.json`);
  const info = existsSync(infoPath) ? JSON.parse(readFileSync(infoPath, 'utf8')) : undefined;
  const codes = naccaCodesFromSubjectLinks(info?.teacherGuide?.subjectLinks);
  if (codes.length) withCodes++;
  const before = JSON.stringify(e.nacca ?? []);
  if (before === JSON.stringify(codes)) continue;
  if (codes.length) e.nacca = codes; else delete e.nacca;
  e.updatedAt = next;
  if (e.changedInVersion !== undefined) e.changedInVersion = next;
  changed++;
}
if (changed) { cat.catalogueVersion = next; writeFileSync(file, JSON.stringify(cat)); }
console.log(`${withCodes} of ${cat.entries.length} stories carry NaCCA codes; ${changed} entries updated; catalogue version ${cat.catalogueVersion}`);
