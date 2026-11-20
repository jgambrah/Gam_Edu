'use client';

import React, { useRef } from 'react';
import { AlertTriangle, Crosshair, Download, Plus, Trash2, Upload } from 'lucide-react';
import type { CueStyle, LessonSlide, PointerCue } from '@/lib/narrated-lessons/types';

interface PointerCueEditorProps {
  slide: LessonSlide;
  cues: PointerCue[];
  selectedCueId: string | null;
  audioCurrent: number;
  isAudioHashStale: boolean;
  onSelectCue: (id: string | null) => void;
  onChangeCues: (next: PointerCue[]) => void;
  onSeekTo: (sec: number) => void;
  onExportAllCues: () => void;
  onImportAllCues: (jsonText: string) => void;
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function PointerCueEditor({
  slide,
  cues,
  selectedCueId,
  audioCurrent,
  isAudioHashStale,
  onSelectCue,
  onChangeCues,
  onSeekTo,
  onExportAllCues,
  onImportAllCues,
}: PointerCueEditorProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sentences = splitSentences(slide.narration.script);

  const updateCue = (id: string, updater: (c: PointerCue) => PointerCue) => {
    onChangeCues(cues.map((c) => (c.id === id ? updater(c) : c)));
  };

  const addCue = () => {
    const start = Math.round(audioCurrent * 10) / 10;
    const end = Math.round((start + 4) * 10) / 10;
    const newId = `${slide.id}.c${cues.length + 1}`;
    const created: PointerCue = {
      id: newId,
      sentenceIndex: 0,
      startSec: start,
      endSec: end,
      style: 'ring',
      target: { type: 'region', x: 25, y: 25, w: 30, h: 25 },
      label: 'New target',
      ...(slide.visual.type === 'illustration' ? { needsHumanCheck: true } : {}),
    };
    onChangeCues([...cues, created]);
    onSelectCue(newId);
  };

  const deleteCue = (id: string) => {
    onChangeCues(cues.filter((c) => c.id !== id));
    if (selectedCueId === id) onSelectCue(null);
  };

  const nudge = (id: string, field: 'startSec' | 'endSec', delta: number) => {
    updateCue(id, (c) => {
      const nextVal = Math.max(0, Math.round((c[field] + delta) * 10) / 10);
      return { ...c, [field]: nextVal };
    });
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImportAllCues(reader.result);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Crosshair className="h-4 w-4 text-amber-700" />
          <h3 className="text-xs font-extrabold uppercase tracking-wide text-amber-950">
            Pointer Cues Editor — Slide {slide.id}
          </h3>
          {slide.timingMethod && (
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-amber-800">
              timing: {slide.timingMethod}
            </span>
          )}
          <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-mono text-slate-600">
            t = {audioCurrent.toFixed(1)}s
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={addCue}
            className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-amber-700"
          >
            <Plus className="h-3 w-3" />
            Add Cue
          </button>
          <button
            type="button"
            onClick={onExportAllCues}
            className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-100"
          >
            <Download className="h-3 w-3" />
            Export Cues JSON
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-white px-2.5 py-1 text-[11px] font-bold text-amber-900 hover:bg-amber-100"
          >
            <Upload className="h-3 w-3" />
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImportFile}
            className="hidden"
          />
        </div>
      </div>

      {isAudioHashStale && (
        <div className="mt-2.5 flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">
          <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>
            <strong>Audio hash changed:</strong> saved cue timings may be stale for this slide. Play audio and click{' '}
            <em>Mark here</em> to retime.
          </span>
        </div>
      )}

      <p className="mt-2 text-[11px] text-amber-900/80">
        Select a cue below to drag/resize its highlight box directly on the slide image above. Use <strong>Mark here</strong> while listening to snap start time to the current audio timestamp.
      </p>

      {/* Cue list */}
      <div className="mt-3 space-y-2">
        {cues.length === 0 ? (
          <p className="rounded-xl border border-dashed border-amber-300 bg-white/70 p-3 text-xs text-slate-600">
            No pointer cues on this slide yet. Click <strong>Add Cue</strong> to create one.
          </p>
        ) : (
          cues.map((cue) => {
            const isSelected = selectedCueId === cue.id;
            const sentenceText = sentences[cue.sentenceIndex] ?? '(sentence)';
            return (
              <div
                key={cue.id}
                onClick={() => onSelectCue(cue.id)}
                className={`cursor-pointer rounded-xl border-2 bg-white p-3 text-xs transition ${
                  isSelected ? 'border-amber-500 ring-2 ring-amber-200' : 'border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[11px] font-bold text-white">
                      {cue.id}
                    </span>
                    <input
                      type="text"
                      value={cue.label ?? ''}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateCue(cue.id, (c) => ({ ...c, label: e.target.value }))}
                      placeholder="Label..."
                      className="w-36 rounded border border-slate-200 px-2 py-0.5 text-xs font-semibold"
                    />
                    {cue.needsHumanCheck && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        needsHumanCheck
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onSeekTo(cue.startSec)}
                      className="rounded border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-bold text-sky-800 hover:bg-sky-100"
                    >
                      Jump
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateCue(cue.id, (c) => ({
                          ...c,
                          startSec: Math.round(audioCurrent * 10) / 10,
                        }))
                      }
                      className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100"
                      title="Set startSec to current audio playback time"
                    >
                      Mark here
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteCue(cue.id)}
                      className="rounded border border-rose-200 bg-rose-50 p-1 text-rose-700 hover:bg-rose-100"
                      aria-label={`Delete cue ${cue.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sentence preview */}
                <p className="mt-1.5 truncate text-[11px] text-slate-500">
                  <strong>S{cue.sentenceIndex}:</strong> {sentenceText}
                </p>

                {/* Controls row */}
                <div
                  className="mt-2 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Style selector */}
                  <label className="flex items-center gap-1 font-semibold text-slate-600">
                    Style:
                    <select
                      value={cue.style}
                      onChange={(e) => {
                        const style = e.target.value as CueStyle;
                        updateCue(cue.id, (c) => ({
                          ...c,
                          style,
                          target:
                            style === 'chip'
                              ? { type: 'chip', index: c.target.type === 'chip' ? c.target.index : 0 }
                              : c.target.type === 'region'
                                ? c.target
                                : { type: 'region', x: 20, y: 20, w: 30, h: 25 },
                        }));
                      }}
                      className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs"
                    >
                      <option value="ring">ring</option>
                      <option value="arrow">arrow</option>
                      <option value="spotlight">spotlight</option>
                      <option value="chip">chip</option>
                    </select>
                  </label>

                  {/* Start nudge */}
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-600">Start:</span>
                    <button
                      type="button"
                      onClick={() => nudge(cue.id, 'startSec', -0.1)}
                      className="rounded border border-slate-200 px-1.5 py-0.5 font-bold hover:bg-slate-100"
                    >
                      -0.1
                    </button>
                    <span className="w-11 text-center font-mono font-bold">{cue.startSec.toFixed(1)}s</span>
                    <button
                      type="button"
                      onClick={() => nudge(cue.id, 'startSec', 0.1)}
                      className="rounded border border-slate-200 px-1.5 py-0.5 font-bold hover:bg-slate-100"
                    >
                      +0.1
                    </button>
                  </div>

                  {/* End nudge */}
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-600">End:</span>
                    <button
                      type="button"
                      onClick={() => nudge(cue.id, 'endSec', -0.1)}
                      className="rounded border border-slate-200 px-1.5 py-0.5 font-bold hover:bg-slate-100"
                    >
                      -0.1
                    </button>
                    <span className="w-11 text-center font-mono font-bold">{cue.endSec.toFixed(1)}s</span>
                    <button
                      type="button"
                      onClick={() => nudge(cue.id, 'endSec', 0.1)}
                      className="rounded border border-slate-200 px-1.5 py-0.5 font-bold hover:bg-slate-100"
                    >
                      +0.1
                    </button>
                  </div>

                  {cue.target.type === 'chip' ? (
                    <label className="flex items-center gap-1 font-semibold text-slate-600">
                      Chip #:
                      <select
                        value={cue.target.index}
                        onChange={(e) =>
                          updateCue(cue.id, (c) => ({
                            ...c,
                            target: { type: 'chip', index: Number(e.target.value) },
                          }))
                        }
                        className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs"
                      >
                        {slide.onScreenText.map((_, idx) => (
                          <option key={idx} value={idx}>
                            Chip {idx + 1}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <span className="font-mono text-[10px] text-slate-500">
                      x:{cue.target.x}% y:{cue.target.y}% w:{cue.target.w}% h:{cue.target.h}%
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
