'use client';
import type { StoryPreviewInfo } from '@/lib/story-library/library-source';

/** Collapsible teacher's guide for classroom discussion, learning goals, and extension activities. */
export function StoryNotes({ info }: { info?: StoryPreviewInfo }) {
  const g = info?.teacherGuide;
  if (!g) return null;
  return (
    <section aria-label="About this story" className="mt-4 space-y-2" data-testid="story-notes">
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
        </div>
      </details>
    </section>
  );
}
const Block = ({ title, items }: { title: string; items: string[] }) => items.length ? <div><h4 className="font-bold">{title}</h4><ul className="ml-5 list-disc space-y-1">{items.map((x, i) => <li key={i}>{x}</li>)}</ul></div> : null;
