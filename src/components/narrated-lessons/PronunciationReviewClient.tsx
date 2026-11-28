'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Download, Volume2 } from 'lucide-react';
import { lessonMediaUrl } from '@/lib/narrated-lessons/types';

type VariantRating = 'best' | 'acceptable' | 'wrong' | '';

interface TestVariant {
  variant: string;
  respelling: string;
  sentence: string;
  filePath: string;
}

interface TestTerm {
  term: string;
  slides: string[];
  variants: TestVariant[];
}

export interface TestClipsManifest {
  lessonId: string;
  voiceName: string;
  styleInstruction: string;
  terms: TestTerm[];
}

interface ReviewState {
  ratings: Record<string, VariantRating>; // key: `${term}:${variant}`
  notes: Record<string, string>; // key: `${term}:${variant}`
  chosenRespelling: Record<string, string>; // key: term
}

const STORAGE_KEY = 'gamedu_water_cycle_pronunciation_test_review_v1';

export function PronunciationReviewClient({ manifest }: { manifest: TestClipsManifest }) {
  const [state, setState] = useState<ReviewState>({
    ratings: {},
    notes: {},
    chosenRespelling: {},
  });
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as ReviewState);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const setRating = (term: string, variant: string, respelling: string, rating: VariantRating) => {
    const key = `${term}:${variant}`;
    setState((old) => {
      const nextRatings = { ...old.ratings, [key]: rating };
      const nextChosen = { ...old.chosenRespelling };
      if (rating === 'best') {
        // Ensure only one variant per term is marked "best"
        for (const k of Object.keys(nextRatings)) {
          if (k.startsWith(`${term}:`) && k !== key && nextRatings[k] === 'best') {
            nextRatings[k] = 'acceptable';
          }
        }
        nextChosen[term] = respelling;
      }
      return { ...old, ratings: nextRatings, chosenRespelling: nextChosen };
    });
  };

  const setNote = (term: string, variant: string, note: string) => {
    const key = `${term}:${variant}`;
    setState((old) => ({ ...old, notes: { ...old.notes, [key]: note } }));
  };

  const handleExport = () => {
    const payload = {
      lessonId: manifest.lessonId,
      exportedAt: new Date().toISOString(),
      chosenRespellings: state.chosenRespelling,
      variants: manifest.terms.flatMap((t) =>
        t.variants.map((v) => ({
          term: t.term,
          variant: v.variant,
          respelling: v.respelling,
          filePath: v.filePath,
          rating: state.ratings[`${t.term}:${v.variant}`] || 'unreviewed',
          note: state.notes[`${t.term}:${v.variant}`] || '',
        })),
      ),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${manifest.lessonId}-pronunciation-test-review.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportMessage(
      'Exported your pronunciation review JSON! Send this file to the curriculum publisher to apply the winning respellings and regenerate only the affected slides.',
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/narrated-lessons/water-cycle"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Lesson
            </Link>
            <div>
              <h1 className="text-base font-extrabold text-slate-900">
                Ghanaian Name Pronunciation Review (Test Clips)
              </h1>
              <p className="text-xs text-slate-500">
                Voice: {manifest.voiceName} · Listen to Variants A, B, and C side by side. Real lesson audio is untouched.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-sky-800"
            >
              <Download className="h-3.5 w-3.5" />
              Export Review JSON
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6">
        {exportMessage && (
          <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-950">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>{exportMessage}</span>
          </div>
        )}

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-950">
          <strong>Instructions for Ghanaian Staff / Teacher Reviewers:</strong> Play all three variants for each name.
          Mark the natural-sounding option as <strong>Best variant</strong> (or mark options as <strong>Acceptable</strong> /{' '}
          <strong>Wrong</strong>) and add any notes. Variant C is always the baseline with no respelling.
        </div>

        {manifest.terms.map((termObj) => (
          <section key={termObj.term} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">{termObj.term}</h2>
                <p className="text-xs text-slate-500">
                  Used in slide(s): <strong>{termObj.slides.join(', ')}</strong>
                </p>
              </div>
              {state.chosenRespelling[termObj.term] && (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  Selected for guide: {state.chosenRespelling[termObj.term]}
                </span>
              )}
            </div>

            <div className="grid gap-4 p-5 md:grid-cols-3">
              {termObj.variants.map((v) => {
                const key = `${termObj.term}:${v.variant}`;
                const currentRating = state.ratings[key] || '';
                const audioUrl = lessonMediaUrl(manifest.lessonId, v.filePath);
                return (
                  <div
                    key={v.variant}
                    className={`flex flex-col justify-between rounded-xl border-2 p-4 transition ${
                      currentRating === 'best'
                        ? 'border-emerald-500 bg-emerald-50/40'
                        : currentRating === 'wrong'
                          ? 'border-rose-300 bg-rose-50/30'
                          : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-md bg-slate-900 px-2 py-0.5 text-xs font-bold text-white">
                          Variant {v.variant}
                        </span>
                        <span className="text-xs font-bold text-sky-700">{v.respelling}</span>
                      </div>
                      <p className="mt-2 text-xs text-slate-500">{v.filePath}</p>

                      <div className="mt-3 flex items-center gap-2">
                        <Volume2 className="h-4 w-4 shrink-0 text-sky-600" />
                        <audio controls preload="none" src={audioUrl} className="h-9 w-full" />
                      </div>
                    </div>

                    <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-3">
                      <div className="grid grid-cols-3 gap-1.5">
                        {(
                          [
                            ['best', 'Best variant'],
                            ['acceptable', 'Acceptable'],
                            ['wrong', 'Wrong'],
                          ] as const
                        ).map(([val, label]) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setRating(termObj.term, v.variant, v.respelling, val)}
                            className={`rounded-lg border px-2 py-1.5 text-[11px] font-bold transition ${
                              currentRating === val
                                ? val === 'best'
                                  ? 'border-emerald-600 bg-emerald-700 text-white'
                                  : val === 'acceptable'
                                    ? 'border-amber-500 bg-amber-500 text-white'
                                    : 'border-rose-600 bg-rose-600 text-white'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        value={state.notes[key] || ''}
                        onChange={(e) => setNote(termObj.term, v.variant, e.target.value)}
                        placeholder="Short reviewer note (optional)..."
                        className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
