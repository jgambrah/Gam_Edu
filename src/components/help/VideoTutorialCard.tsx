'use client';

import React, { useState } from 'react';
import { ChevronDown, ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { parseTutorialDescription, splitInline } from '@/lib/tutorial-description';
import type { Tutorial } from '@/lib/types';

const Inline = ({ text }: { text: string }) => (
  <>
    {splitInline(text).map((p, i) =>
      p.kind === 'bold' ? <strong key={i} className="font-bold text-slate-800">{p.value}</strong>
      : p.kind === 'code' ? <code key={i} className="rounded bg-slate-100 px-1.5 py-0.5 text-[0.8em] font-semibold text-indigo-700">{p.value}</code>
      : <React.Fragment key={i}>{p.value}</React.Fragment>)}
  </>
);

/** One video with its description tucked away until the viewer opens it. */
export function VideoTutorialCard({ tutorial: t }: { tutorial: Tutorial }) {
  const [open, setOpen] = useState(false);
  const { heading, steps } = parseTutorialDescription(t.description);
  const hasDetails = steps.length > 0 || !!heading;
  const isList = steps.length > 1;

  return (
    <div className="group flex flex-col gap-4 rounded-[2rem] border border-slate-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden rounded-[1.5rem] border-4 border-slate-100 bg-black shadow-lg">
        <iframe
          width="100%" height="100%"
          src={`https://www.youtube.com/embed/${encodeURIComponent(t.youtubeId)}?rel=0&modestbranding=1`}
          title={t.title} loading="lazy" frameBorder="0" allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          className="absolute inset-0"
        />
      </div>

      <div className="px-2 pb-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-black uppercase italic leading-tight text-slate-800">{t.title}</h3>
          <Badge variant="secondary" className="shrink-0 rounded-full border-indigo-100 bg-indigo-50 px-3 py-1 font-bold text-indigo-700">
            {t.category}
          </Badge>
        </div>

        {hasDetails && (
          <Collapsible open={open} onOpenChange={setOpen} className="mt-3">
            <CollapsibleTrigger
              className="flex w-full items-center justify-between gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-left text-sm font-bold text-slate-600 transition-colors hover:bg-indigo-50 hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
              aria-label={open ? 'Hide video details' : 'Show video details'}
            >
              <span className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" />
                {open ? 'Hide details' : isList ? `Show details · ${steps.length} steps` : 'Show details'}
              </span>
              <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', open && 'rotate-180')} />
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="mt-3 space-y-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                {heading && <p className="text-sm font-black text-slate-800"><Inline text={heading} /></p>}
                {isList ? (
                  <ol className="space-y-3">
                    {steps.map((s, i) => (
                      <li key={i} className="flex gap-3 text-sm font-medium leading-relaxed text-slate-600">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">{i + 1}</span>
                        <span><Inline text={s} /></span>
                      </li>
                    ))}
                  </ol>
                ) : steps[0] ? (
                  <div className="rounded-xl bg-white p-3.5 border border-slate-200/80 shadow-xs">
                    <p className="text-sm font-medium leading-relaxed text-slate-700"><Inline text={steps[0]} /></p>
                  </div>
                ) : null}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
}
