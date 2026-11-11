'use client';
import type { StoryPreviewInfo } from '@/lib/story-library/library-source';

/** Collapsible teacher's guide for classroom discussion, learning goals, and extension activities. */
export function StoryNotes({ info }: { info?: StoryPreviewInfo }) {
  const g = info?.teacherGuide as (NonNullable<StoryPreviewInfo['teacherGuide']> & Record<string, any>) | undefined;
  if (!g) return null;

  const learningGoals: string[] = Array.isArray(g.learningGoals)
    ? g.learningGoals
    : Array.isArray(g.learningObjectives)
      ? g.learningObjectives
      : [];
  const subjectLinks: Array<{ subject: string; link: string; status: string }> = Array.isArray(g.subjectLinks)
    ? g.subjectLinks.map((s: any) => ({ ...s, status: 'approved' }))
    : Array.isArray(g.crossCurricularLinks)
      ? g.crossCurricularLinks.map((c: string) => {
          const idx = c.indexOf(':');
          return idx > 0
            ? { subject: c.slice(0, idx).trim(), link: c.slice(idx + 1).trim(), status: 'approved' }
            : { subject: 'Curriculum link', link: c, status: 'approved' };
        })
      : [];
  const beforeReading: string[] = Array.isArray(g.beforeReading) ? g.beforeReading : [];
  const whileReading: string[] = Array.isArray(g.whileReading) ? g.whileReading : [];
  const afterReading: string[] = Array.isArray(g.afterReading)
    ? g.afterReading
    : Array.isArray(g.classroomActivities)
      ? g.classroomActivities
      : [];
  const discussion: string[] = Array.isArray(g.discussion)
    ? g.discussion
    : Array.isArray(g.discussionPrompts)
      ? g.discussionPrompts
      : [];
  const reflection: string[] = Array.isArray(g.reflection) ? g.reflection : [];
  const mathsExtension: Array<{ task: string; answer: string }> = Array.isArray(g.mathsExtension) ? g.mathsExtension : [];
  const support: string[] = Array.isArray(g.differentiation?.support) ? g.differentiation.support : [];
  const stretch: string[] = Array.isArray(g.differentiation?.stretch) ? g.differentiation.stretch : [];
  const culturalNotes: string[] = Array.isArray(g.culturalNotes) ? g.culturalNotes : [];

  const whatWeKnow: string[] = Array.isArray(g.discoveryStatus?.whatWeKnow)
    ? g.discoveryStatus.whatWeKnow
    : Array.isArray((g.discoveryStatus as any)?.established)
      ? (g.discoveryStatus as any).established
      : [];
  const whatWeAreStillDiscovering: string[] = Array.isArray(g.discoveryStatus?.whatWeAreStillDiscovering)
    ? g.discoveryStatus.whatWeAreStillDiscovering
    : Array.isArray((g.discoveryStatus as any)?.underInvestigation)
      ? (g.discoveryStatus as any).underInvestigation
      : [];

  const inv = g.investigation as Record<string, any> | undefined;
  const invMaterials: string[] = Array.isArray(inv?.materials)
    ? inv!.materials
    : typeof inv?.Materials === 'string'
      ? [inv.Materials]
      : typeof inv?.materials === 'string'
        ? [inv.materials]
        : [];
  const invSteps: string[] = Array.isArray(inv?.steps) ? inv!.steps : [];
  const invWhatToNotice: string = inv?.whatToNotice ?? inv?.expectedOutcome ?? '';
  const invSafetyNote: string = inv?.safetyNote ?? inv?.safetyNotes ?? '';
  const factCheck: Array<{ claim: string; explanation: string; reference: string; analogyNote?: string }> = Array.isArray(g.factCheck)
    ? g.factCheck
    : [];

  return (
    <section aria-label="About this story" className="mt-4 space-y-2" data-testid="story-notes">
      <details className="rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200" data-testid="teacher-guide">
        <summary className="cursor-pointer text-base font-extrabold text-slate-900">Teacher’s guide ({g.lessonMinutes ?? 40} min)</summary>
        <div className="mt-2 space-y-3 text-sm text-slate-800">
          {g.overview && <p>{g.overview}</p>}
          <Block title="Learning goals" items={learningGoals} />
          {subjectLinks.length > 0 && (
            <div>
              <h4 className="font-bold">NaCCA curriculum subject links</h4>
              <ul className="ml-5 list-disc space-y-1">
                {subjectLinks.map((s, i) => (
                  <li key={i}>
                    <strong>{s.subject}:</strong> {s.link}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Block title="Before reading" items={beforeReading} />
          <Block title="While reading" items={whileReading} />
          <Block title="After reading" items={afterReading} />
          <Block title="Discussion" items={discussion} />
          <Block title="Reflection: use it in real life" items={reflection} />
          {mathsExtension.length > 0 && (
            <div><h4 className="font-bold">Maths &amp; classroom extension (with answers)</h4>
              <ol className="ml-5 list-decimal space-y-1">{mathsExtension.map((m, i) => <li key={i}>{m.task} <em className="text-slate-600">Answer: {m.answer}</em></li>)}</ol></div>
          )}
          <Block title="Support" items={support} />
          <Block title="Stretch" items={stretch} />
          <Block title="Cultural notes" items={culturalNotes} />
          {(whatWeKnow.length > 0 || whatWeAreStillDiscovering.length > 0) && (
            <div data-testid="discovery-status" className="rounded-xl bg-indigo-50/70 p-3 ring-1 ring-indigo-200">
              <h4 className="font-bold text-indigo-950">What We Know / What We Are Still Discovering</h4>
              <div className="mt-1 space-y-2">
                {whatWeKnow.length > 0 && (
                  <div>
                    <strong className="text-indigo-900">What we know (established by evidence):</strong>
                    <ul className="ml-5 list-disc space-y-1">
                      {whatWeKnow.map((x, i) => <li key={i}>{x}</li>)}
                    </ul>
                  </div>
                )}
                {whatWeAreStillDiscovering.length > 0 && (
                  <div>
                    <strong className="text-indigo-900">What scientists are still discovering:</strong>
                    <ul className="ml-5 list-disc space-y-1">
                      {whatWeAreStillDiscovering.map((x, i) => <li key={i}>{x}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          {inv && (invMaterials.length > 0 || invSteps.length > 0) && (
            <div data-testid="classroom-investigation" className="rounded-xl bg-emerald-50/70 p-3 ring-1 ring-emerald-200">
              <h4 className="font-bold text-emerald-950">Hands-on investigation: {inv.title}</h4>
              {invMaterials.length > 0 && <p className="mt-1"><strong>Materials:</strong> {invMaterials.join(', ')}</p>}
              {invSteps.length > 0 && (
                <ol className="mt-1 ml-5 list-decimal space-y-1">
                  {invSteps.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
              )}
              {invWhatToNotice && <p className="mt-1"><strong>What to notice:</strong> {invWhatToNotice}</p>}
              {invSafetyNote && <p className="mt-1 text-xs font-semibold text-emerald-900"><strong>Safety note:</strong> {invSafetyNote}</p>}
            </div>
          )}
          {factCheck.length > 0 && (
            <div data-testid="fact-check-sheet" className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
              <h4 className="font-bold text-slate-900">Science fact-check sheet &amp; references</h4>
              <ul className="mt-1 ml-5 list-disc space-y-2">
                {factCheck.map((fc, i) => (
                  <li key={i}>
                    <strong>Claim:</strong> {fc.claim}<br />
                    <span><strong>Scientific basis:</strong> {fc.explanation}</span><br />
                    {fc.analogyNote && <><span><strong>Analogy note:</strong> {fc.analogyNote}</span><br /></>}
                    <span className="text-xs text-slate-600"><strong>Reference:</strong> {fc.reference}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </details>
    </section>
  );
}
const Block = ({ title, items }: { title: string; items?: string[] }) => Array.isArray(items) && items.length > 0 ? <div><h4 className="font-bold">{title}</h4><ul className="ml-5 list-disc space-y-1">{items.map((x, i) => <li key={i}>{x}</li>)}</ul></div> : null;
