import React from 'react';
import { createRoot } from 'react-dom/client';
import { NarratedLessonPlayer } from '@/components/narrated-lessons/NarratedLessonPlayer';
import { normalizeFixtureForPlayer } from './normalize';

// ?fixture=step5c-measurement-lab-pilot&slide=s03  (slide is read by the player itself from the URL)
async function main() {
  const params = new URLSearchParams(window.location.search);
  const fixture = params.get('fixture') || 'step5c-measurement-lab-pilot';
  const res = await fetch(`/preview-fixtures/${fixture}.json`);
  const lesson = normalizeFixtureForPlayer(await res.json());
  (window as any).__lesson = lesson;
  createRoot(document.getElementById('root')!).render(
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto max-w-4xl px-4">
        <NarratedLessonPlayer lesson={lesson} />
      </div>
    </div>,
  );
  (window as any).__ready = true;
}
main();
