'use client';
import { useMemo, useState } from 'react';
import type { Activity } from '@/lib/story-library/premium';

export type ActivityResult = { id: string; type: Activity['type']; correct?: boolean };

/** Deterministic shuffle so a re-render never reshuffles the options under the child's finger. */
function shuffled<T>(items: T[], seed: string): T[] {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; const j = h % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

const btn = 'rounded-2xl border-2 px-4 py-3 text-left text-lg font-semibold transition focus:outline-none focus:ring-4 focus:ring-indigo-300 min-h-[52px]';

export function ActivityPlayer({ activity, onDone }: { activity: Activity; onDone: (r: ActivityResult) => void }) {
  const [feedback, setFeedback] = useState<null | { correct?: boolean; message: string }>(null);
  const done = (correct?: boolean) => onDone({ id: activity.id, type: activity.type, correct });

  const heading: Record<Activity['type'], string> = {
    comprehension: 'Think about the story', vocabulary: 'Word power', phonics: 'Sound it out', sequencing: 'Put it in order', prediction: 'What do you think?', sel: 'How do you feel?',
  };
  return (
    <section aria-labelledby={`act-${activity.id}`} className="rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-200">
      <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">Activity · {activity.type}</p>
      <h3 id={`act-${activity.id}`} className="mb-3 text-2xl font-extrabold text-slate-900">{heading[activity.type]}</h3>
      {activity.type === 'comprehension' && <Choice id={activity.id} prompt={activity.question} options={activity.options} correct={[activity.correctIndex]} explanation={activity.explanation} onFeedback={setFeedback} feedback={feedback} />}
      {activity.type === 'vocabulary' && <Vocabulary a={activity} onFeedback={setFeedback} feedback={feedback} />}
      {activity.type === 'phonics' && <Choice id={activity.id} prompt={`${activity.prompt} (choose all that fit)`} options={activity.options} correct={activity.correctIndexes} multi onFeedback={setFeedback} feedback={feedback} />}
      {activity.type === 'sequencing' && <Sequencing a={activity} onFeedback={setFeedback} feedback={feedback} />}
      {activity.type === 'prediction' && <Reflect prompt={activity.prompt} options={activity.options} onSubmit={() => done()} />}
      {activity.type === 'sel' && <Reflect prompt={activity.prompt} options={activity.feelingOptions} onSubmit={() => done()} private />}
      {feedback && (
        <div role="status" aria-live="polite" className={`mt-4 rounded-2xl p-3 text-lg font-semibold ${feedback.correct ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'}`}>
          {feedback.message}
          <div className="mt-3"><button type="button" onClick={() => done(feedback.correct)} className="rounded-full bg-indigo-600 px-5 py-2 text-white font-bold hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300">Continue</button></div>
        </div>
      )}
    </section>
  );
}

function Choice({ id, prompt, options, correct, multi, explanation, onFeedback, feedback }: { id: string; prompt: string; options: string[]; correct: number[]; multi?: boolean; explanation?: string; onFeedback: (f: { correct?: boolean; message: string }) => void; feedback: unknown }) {
  const [picked, setPicked] = useState<number[]>([]);
  const order = useMemo(() => shuffled(options.map((_, i) => i), id), [id, options]);
  const check = (sel: number[]) => {
    const ok = sel.length === correct.length && correct.every((c) => sel.includes(c));
    onFeedback({ correct: ok, message: ok ? `Well done! ${explanation ?? ''}` : `Not quite. ${explanation ?? 'Have another think about the story.'}` });
  };
  return (
    <div>
      <p className="mb-3 text-xl font-semibold text-slate-800">{prompt}</p>
      <div className="grid gap-2" role={multi ? 'group' : 'radiogroup'} aria-label={prompt}>
        {order.map((i) => {
          const on = picked.includes(i);
          return (
            <button key={i} type="button" disabled={!!feedback} role={multi ? 'checkbox' : 'radio'} aria-checked={on}
              onClick={() => { if (multi) setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i])); else { setPicked([i]); check([i]); } }}
              className={`${btn} ${on ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>{options[i]}</button>
          );
        })}
      </div>
      {multi && !feedback && <button type="button" onClick={() => check(picked)} disabled={!picked.length} className="mt-3 rounded-full bg-indigo-600 px-5 py-2 text-white font-bold disabled:opacity-40">Check</button>}
    </div>
  );
}

function Vocabulary({ a, onFeedback, feedback }: { a: Extract<Activity, { type: 'vocabulary' }>; onFeedback: (f: { correct?: boolean; message: string }) => void; feedback: unknown }) {
  const options = useMemo(() => shuffled([a.definition, ...a.distractors], a.id), [a]);
  return (
    <div>
      <p className="mb-3 text-xl font-semibold text-slate-800">What does <span className="rounded bg-yellow-200 px-1.5">{a.word}</span> mean?</p>
      <div className="grid gap-2" role="radiogroup" aria-label={`Meaning of ${a.word}`}>
        {options.map((o) => (
          <button key={o} type="button" role="radio" aria-checked={false} disabled={!!feedback} className={`${btn} border-slate-200 bg-white hover:border-indigo-300`}
            onClick={() => onFeedback(o === a.definition ? { correct: true, message: `Yes! ${a.word} means: ${a.definition}` } : { correct: false, message: `Not quite. ${a.word} means: ${a.definition}` })}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function Sequencing({ a, onFeedback, feedback }: { a: Extract<Activity, { type: 'sequencing' }>; onFeedback: (f: { correct?: boolean; message: string }) => void; feedback: unknown }) {
  const order = useMemo(() => {
    const s = shuffled(a.items.map((_, i) => i), a.id);
    return s.every((v, i) => v === i) ? [...s].reverse() : s;
  }, [a]);
  const [chosen, setChosen] = useState<number[]>([]);
  const done = chosen.length === a.items.length;
  const check = () => { const ok = chosen.every((v, i) => v === i); onFeedback({ correct: ok, message: ok ? 'Perfect order!' : `Not quite. The order is: ${a.items.map((t, i) => `${i + 1}. ${t}`).join('  ')}` }); };
  return (
    <div>
      <p className="mb-1 text-xl font-semibold text-slate-800">{a.prompt}</p>
      <p className="mb-3 text-slate-600">Tap the sentences in the order they happened.</p>
      <div className="grid gap-2">
        {order.map((i) => {
          const pos = chosen.indexOf(i);
          return (
            <button key={i} type="button" disabled={!!feedback || pos >= 0} onClick={() => setChosen((c) => [...c, i])}
              className={`${btn} flex items-center gap-3 ${pos >= 0 ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>
              <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-200 text-base">{pos >= 0 ? pos + 1 : ''}</span>{a.items[i]}
            </button>
          );
        })}
      </div>
      {!feedback && <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setChosen([])} disabled={!chosen.length} className="rounded-full border-2 border-slate-300 px-4 py-2 font-bold disabled:opacity-40">Start again</button>
        <button type="button" onClick={check} disabled={!done} className="rounded-full bg-indigo-600 px-5 py-2 text-white font-bold disabled:opacity-40">Check</button>
      </div>}
    </div>
  );
}

function Reflect({ prompt, options, onSubmit, private: isPrivate }: { prompt: string; options?: string[]; onSubmit: () => void; private?: boolean }) {
  const [pick, setPick] = useState<string | null>(null);
  return (
    <div>
      <p className="mb-3 text-xl font-semibold text-slate-800">{prompt}</p>
      {options && <div className="mb-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Choices">{options.map((o) => (
        <button key={o} type="button" role="radio" aria-checked={pick === o} onClick={() => setPick(o)} className={`${btn} ${pick === o ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-white'}`}>{o}</button>
      ))}</div>}
      <p className="mb-3 text-sm text-slate-600">{isPrivate ? 'There is no right or wrong answer. Your answer is not saved or shared.' : 'There is no right or wrong answer. Share your idea with a friend or your teacher.'}</p>
      <button type="button" onClick={onSubmit} className="rounded-full bg-indigo-600 px-5 py-2 text-white font-bold hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300">Continue</button>
    </div>
  );
}
