/** Writes docs/story-spark/PROPOSED-CATALOGUE.md from the typed catalogue so the document can never drift from the data. */
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { PROPOSED_CATALOGUE } from '../../src/lib/story-library/catalogue-plan/proposed-catalogue';
import { CLASS_REGISTRY, GENRES, OBJECTIVES, READING_LEVELS } from '../../src/lib/story-library/classification';

const label = (list: readonly { id: string; label: string }[], id: string) => list.find((x) => x.id === id)?.label ?? id;
const lines: string[] = [];
lines.push('# Proposed Story Spark catalogue: 65 stories, five per class', '');
lines.push('> **This is an editorial plan, not content.** Only the stories marked **existing draft** have any text, and those are unreviewed drafts. Titles and synopses are proposals for editorial review.');
lines.push('> Curriculum alignment lists **subject areas to be verified** by a curriculum reviewer. No strand names or codes are claimed.');
lines.push('> Settings and cultural details need review by people from the communities shown. Vocabulary difficulty: 1 (very simple) to 5 (rich, academic).', '');
lines.push('Generated from `src/lib/story-library/catalogue-plan/proposed-catalogue.ts` by `scripts/library/build-catalogue-doc.ts`.', '');
for (const c of CLASS_REGISTRY) {
  lines.push(`## ${c.label} (ages ${c.typicalAge[0]}-${c.typicalAge[1]})`, '');
  lines.push('| # | Title | Synopsis | Learning objectives | Reading level | Vocab | Subjects to verify | Suggested activities | Setting |', '|---|---|---|---|---|---|---|---|---|');
  PROPOSED_CATALOGUE.filter((s) => s.classId === c.id).forEach((s, i) => {
    lines.push(`| ${i + 1} | **${s.title}**${s.existing ? '<br>*existing draft*' : ''}${s.needsCulturalReview ? '<br>*cultural review*' : ''} | ${s.synopsis} | ${s.objectives.map((o) => label(OBJECTIVES, o)).join(', ')} | ${label(READING_LEVELS, s.readingLevel)} | ${s.vocabularyDifficulty} | ${s.curriculumSubjects.join('; ')} | ${s.activityIdeas} (${s.activities.join(', ')}) | ${s.setting} |`);
  });
  lines.push('');
}
const count = (f: (s: (typeof PROPOSED_CATALOGUE)[number]) => boolean) => PROPOSED_CATALOGUE.filter(f).length;
lines.push('## Coverage check', '', '| Priority area | Stories |', '|---|---|');
for (const [name, f] of [
  ['Financial literacy', (s: any) => s.objectives.includes('financial-literacy')], ['Environmental responsibility', (s: any) => s.objectives.includes('environmental-awareness')],
  ['Digital citizenship (technology theme)', (s: any) => s.themes.includes('technology')], ['Critical thinking', (s: any) => s.objectives.includes('critical-thinking')],
  ['Science', (s: any) => s.objectives.includes('scientific-curiosity')], ['Cultural heritage', (s: any) => s.objectives.includes('cultural-heritage')],
  ['Character values (honesty, kindness, respect, responsibility, perseverance)', (s: any) => ['honesty', 'kindness', 'respect', 'responsibility', 'perseverance'].some((o) => s.objectives.includes(o))],
] as Array<[string, (s: any) => boolean]>) lines.push(`| ${name} | ${count(f)} |`);
lines.push('', `Genres used: ${[...new Set(PROPOSED_CATALOGUE.flatMap((s) => s.genres))].map((g) => label(GENRES, g)).join(', ')}.`, '');
writeFileSync(path.resolve(__dirname, '../../docs/story-spark/PROPOSED-CATALOGUE.md'), lines.join('\n'));
console.log('wrote PROPOSED-CATALOGUE.md', PROPOSED_CATALOGUE.length, 'stories');
