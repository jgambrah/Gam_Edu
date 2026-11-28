/**
 * The repository's preview fixtures (public/preview-fixtures) are PARTIAL lessons written to exercise one engine each:
 * several lack `meta`, `checkpoints`, `masteryCheck`, `summary`, per-slide `askTeacherContext`, and so on, and the full
 * player throws on them (audit finding D-036: the dev-only *-pilot-preview pages crash for those fixtures). Tests that
 * want to render an activity through the real player first fill the missing lesson/slide fields with inert defaults.
 * Activity (`interactive`) data is never touched.
 */
export function normalizeFixtureForPlayer(input: any): any {
  const l = JSON.parse(JSON.stringify(input));
  l.schemaVersion ??= 1;
  l.meta = {
    title: l.lessonId ?? 'Pilot lesson', class: 'Pilot', subject: 'Pilot', term: '', contentStandard: 'Pilot fixture', indicators: [],
    narrationWordCount: 0, estimatedNarrationMinutes: 1, estimatedTotalMinutes: 1, ...(l.meta ?? {}),
  };
  l.learningOutcomes ??= []; l.pronunciationGuide ??= []; l.vocabulary ??= []; l.misconceptionsAddressed ??= [];
  l.checkpoints ??= []; l.coverageMatrix ??= []; l.verifyFlags ??= [];
  l.glossary ??= [];
  l.masteryCheck ??= { items: [], passMark: 0 };
  l.summary ??= { recap: [], keyTakeaways: [], keyPoints: [], whatWeLearned: [], nextSteps: [] };
  l.extensionActivity ??= { title: '', prompt: '', steps: [] };
  (l.slides ?? []).forEach((s: any, i: number) => {
    s.order ??= i + 1; s.purpose ??= ''; s.onScreenText ??= []; s.keyIdeas ??= []; s.indicatorIds ??= [];
    s.askTeacherContext ??= { summary: '', seedFaqs: [], outOfScopeRule: '' };
    s.teacherNote ??= ''; s.cues ??= [];
    s.narration ??= { script: '', ttsText: '' };
  });
  return l;
}
