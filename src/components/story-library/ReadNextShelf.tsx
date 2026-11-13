'use client';
import { useState } from 'react';
import type { CatalogueEntry } from '@/lib/story-library/types';
import { CLASS_REGISTRY } from '@/lib/story-library/classification';
import { INTEREST_OPTIONS, interestsOf } from '@/lib/story-library/interests';
import type { Recommendation } from '@/lib/story-library/recommendations';
import { PlaceholderArt } from './PlaceholderArt';

const classText = (ids: readonly string[] = []) => {
  const name = (id: string) => CLASS_REGISTRY.find((c) => c.id === id)?.label ?? id;
  return ids.length > 2 ? `${name(ids[0])} to ${name(ids[ids.length - 1])}` : ids.map(name).join(', ');
};

/** One short, honest reason a story was picked. */
export function reasonFor(r: Recommendation, interests: readonly string[], focusLabel?: string): string {
  if (r.reasons.includes('class-focus')) return focusLabel ? `Your class is studying: ${focusLabel}` : 'Matches what your class is studying';
  const mine = interestsOf(r.entry).find((i) => interests.includes(i));
  if (mine) { const o = INTEREST_OPTIONS.find((x) => x.id === mine); if (o) return `Because you like ${o.label.toLowerCase()}`; }
  if (r.reasons.includes('like-your-reads')) return 'Like stories you have read';
  if (r.reasons.includes('next-step')) return 'A good next step up';
  return 'Something new to explore';
}

/**
 * "Read next for you": interest chips plus a short shelf of suggestions. With no interests picked and nothing read yet,
 * it opens with the chips so the first visit is one tap away from a personal shelf.
 */
export function ReadNextShelf({
  recs, interests, onToggleInterest, onOpen, busyKey, coverFor, focusLabel,
}: {
  recs: readonly Recommendation[];
  interests: readonly string[];
  onToggleInterest: (id: string) => void;
  onOpen: (e: CatalogueEntry) => void;
  busyKey: string | null;
  coverFor: (e: CatalogueEntry) => { motif: string; palette: [string, string]; alt: string; src: string };
  focusLabel?: string;
}) {
  const [editing, setEditing] = useState(false);
  const showPicker = editing || interests.length === 0;
  if (!showPicker && recs.length === 0) {
    return (
      <section className="mb-5 rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200" data-testid="read-next" aria-label="Read next">
        <p className="text-sm font-semibold text-slate-700">Nothing new fits your interests and class right now.
          {' '}<button type="button" onClick={() => setEditing(true)} className="font-extrabold text-indigo-700 underline">Change interests</button></p>
      </section>
    );
  }
  return (
    <section className="mb-5 rounded-2xl bg-white p-4 shadow ring-1 ring-slate-200" data-testid="read-next" aria-label="Read next">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-black text-slate-900" style={{ fontFamily: 'Fredoka, Nunito, system-ui, sans-serif' }}>📖 Read next for you</h2>
          <p className="text-sm text-slate-600">{interests.length ? 'Picked from what you like and what you have read.' : 'What do you love reading about? Tap a few to start.'}</p>
        </div>
        {interests.length > 0 && (
          <button type="button" aria-expanded={showPicker} onClick={() => setEditing((v) => !v)}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-800 hover:bg-slate-200">
            {showPicker ? 'Done' : 'Change interests'}
          </button>
        )}
      </div>

      {showPicker && (
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Your interests" data-testid="interest-chips">
          {INTEREST_OPTIONS.map((o) => {
            const on = interests.includes(o.id);
            return (
              <button key={o.id} type="button" aria-pressed={on} onClick={() => onToggleInterest(o.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-extrabold transition ${on ? 'bg-violet-700 text-white ring-2 ring-violet-300' : 'bg-slate-100 text-slate-800 ring-1 ring-slate-200 hover:bg-violet-50'}`}>
                <span aria-hidden>{o.emoji}</span> {o.label}
              </button>
            );
          })}
        </div>
      )}

      {recs.length > 0 && (
        <ul className="mt-3 flex gap-3 overflow-x-auto pb-2" data-testid="read-next-list">
          {recs.map((r) => {
            const cv = coverFor(r.entry);
            return (
              <li key={r.entry.storyKey} data-testid="rec-card" data-story={r.entry.storyKey}
                className="flex w-56 shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow ring-1 ring-slate-200">
                <PlaceholderArt motif={cv.motif} palette={cv.palette} alt={cv.alt} imageSrc={cv.src} compact />
                <div className="flex flex-1 flex-col p-3">
                  <h3 className="line-clamp-2 text-base font-extrabold leading-tight text-slate-900">{r.entry.title}</h3>
                  <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{classText(r.entry.classIds)}</p>
                  <p className="mt-1 text-xs font-bold text-violet-800">{reasonFor(r, interests, focusLabel)}</p>
                  <button type="button" onClick={() => onOpen(r.entry)} disabled={busyKey === r.entry.storyKey} aria-label={`Read next: ${r.entry.title}`}
                    className="mt-auto rounded-full bg-indigo-600 px-3 py-2 text-sm font-bold text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:opacity-60">
                    {busyKey === r.entry.storyKey ? 'Opening…' : 'Read this'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
