'use client';
import type { StoryPreviewInfo } from '@/lib/story-library/library-source';

/** Honest, collapsible "what is real and what is not yet" panel plus the teacher's guide. Preview-only information. */
export function StoryNotes({ info }: { info?: StoryPreviewInfo }) {
  if (!info) return null;
  const g = info.teacherGuide;
  const ill = info.illustration;
  return (
    <section aria-label="About this story" className="mt-4 space-y-2" data-testid="story-notes">
      <details className="rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200">
        <summary className="cursor-pointer text-base font-extrabold text-slate-900">What is finished and what is not</summary>
        <ul className="mt-2 space-y-1 text-sm text-slate-800">
          {Object.entries(info.assetStatus).map(([k, v]) => <li key={k}><strong className="capitalize">{k}:</strong> {v}</li>)}
          {ill && <li data-testid="illustration-status"><strong>Illustrations:</strong> {ill.approved} of {ill.total} approved image files exist ({ill.candidate} candidates, {ill.placeholder} placeholders). The pictures shown are labelled placeholders.</li>}
        </ul>
      </details>
      {info.pronunciation && info.pronunciation.length > 0 && (
        <details className="rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200">
          <summary className="cursor-pointer text-base font-extrabold text-slate-900">Name pronunciation ({info.pronunciation.length} names, awaiting native-speaker review)</summary>
          <p className="mt-2 text-sm text-slate-700">The written spelling is never changed. These notes only guide the voice. Nothing below is verified yet.</p>
          <ul className="mt-2 space-y-2 text-sm text-slate-800">
            {info.pronunciation.map((p) => (
              <li key={p.written}><strong>{p.written}</strong> <span className="text-slate-600">({p.language}; {p.status === 'needs-native-review' ? 'unverified' : p.status})</span><br />{p.guidance}
                {p.reviewerNotes.length > 0 && <span className="block text-slate-600">Reviewer: {p.reviewerNotes.join(' ')}</span>}</li>
            ))}
          </ul>
        </details>
      )}
      {g && (
        <details className="rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200" data-testid="teacher-guide">
          <summary className="cursor-pointer text-base font-extrabold text-slate-900">Teacher’s guide ({g.lessonMinutes} min)</summary>
          <div className="mt-2 space-y-3 text-sm text-slate-800">
            <p>{g.overview}</p>
            <Block title="Learning goals" items={g.learningGoals} />
            <Block title="Before reading" items={g.beforeReading} />
            <Block title="While reading" items={g.whileReading} />
            <Block title="After reading" items={g.afterReading} />
            <Block title="Discussion" items={g.discussion} />
            <Block title="Reflection: use it in real life" items={g.reflection} />
            {g.mathsExtension.length > 0 && (
              <div><h4 className="font-bold">Maths extension (with answers)</h4>
                <ol className="ml-5 list-decimal space-y-1">{g.mathsExtension.map((m, i) => <li key={i}>{m.task} <em className="text-slate-600">Answer: {m.answer}</em></li>)}</ol></div>
            )}
            <Block title="Support" items={g.differentiation.support} />
            <Block title="Stretch" items={g.differentiation.stretch} />
            <Block title="Cultural notes" items={g.culturalNotes} />
            <Block title="Check locally before use" items={g.localiseThis} />
            <p className="text-xs text-slate-600">Subject links (to be verified by a curriculum reviewer): {g.subjectLinks.map((l) => l.subject).join(', ')}. No curriculum codes are claimed.</p>
          </div>
        </details>
      )}
    </section>
  );
}
const Block = ({ title, items }: { title: string; items: string[] }) => items.length ? <div><h4 className="font-bold">{title}</h4><ul className="ml-5 list-disc space-y-1">{items.map((x, i) => <li key={i}>{x}</li>)}</ul></div> : null;
