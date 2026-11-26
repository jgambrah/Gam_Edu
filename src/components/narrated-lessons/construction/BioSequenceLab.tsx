'use client';

import React, { useMemo, useState } from 'react';
import type { BioSequenceConstructionConfig } from '@/lib/narrated-lessons/interactive-schema';
import {
  computeMonohybridPunnett,
  evaluateBaseSequence,
  evaluateMonohybridPunnett,
  evaluateMrnaTranslation,
  translateMrnaCodons,
} from '@/lib/construction-lab/bio-sequence-engine';
import { CONSTRUCTION_LAB_LIMITS } from '@/lib/construction-lab/construction-schema-validator';
import { ConstructionLabShell } from './ConstructionLabShell';

export function BioSequenceLab({ config }: { config: BioSequenceConstructionConfig }) {
  const slotCount = useMemo(() => {
    if (config.mode === 'monohybrid-punnett') return 4;
    if (config.mode === 'mrna-translation') {
      return translateMrnaCodons(config.templateSequence ?? []).expectedTokens.length;
    }
    return (config.templateSequence ?? []).length;
  }, [config.mode, config.templateSequence]);

  const initialSlots = useMemo(() => Array.from({ length: slotCount }, () => null as string | null), [slotCount]);

  const [slots, setSlots] = useState<Array<string | null>>(initialSlots);
  const [activeIdx, setActiveIdx] = useState(0);
  const [history, setHistory] = useState<Array<Array<string | null>>>([]);
  const [checked, setChecked] = useState(false);

  const punnettRef = useMemo(() => {
    if (config.mode !== 'monohybrid-punnett') return null;
    return computeMonohybridPunnett(
      config.parent1Genotype ?? 'Tt',
      config.parent2Genotype ?? 'Tt',
      config.dominantAllele ?? 'T',
    );
  }, [config.dominantAllele, config.mode, config.parent1Genotype, config.parent2Genotype]);

  const punnettOptions = useMemo(() => {
    if (!punnettRef) return [];
    const dom = config.dominantAllele ?? 'T';
    const rec = dom.toLowerCase();
    return [`${dom}${dom}`, `${dom}${rec}`, `${rec}${rec}`];
  }, [config.dominantAllele, punnettRef]);

  const translationRef = useMemo(
    () => (config.mode === 'mrna-translation' ? translateMrnaCodons(config.templateSequence ?? []) : null),
    [config.mode, config.templateSequence],
  );

  const evaluation = useMemo(() => {
    if (config.mode === 'monohybrid-punnett') {
      return evaluateMonohybridPunnett(
        config.parent1Genotype ?? 'Tt',
        config.parent2Genotype ?? 'Tt',
        config.dominantAllele ?? 'T',
        slots,
      );
    }
    if (config.mode === 'mrna-translation') {
      return evaluateMrnaTranslation(config.templateSequence ?? [], slots);
    }
    return evaluateBaseSequence(config.mode, config.templateSequence ?? [], slots);
  }, [config.dominantAllele, config.mode, config.parent1Genotype, config.parent2Genotype, config.templateSequence, slots]);

  const assignToken = (token: string) => {
    setHistory((h) => [...h.slice(-(CONSTRUCTION_LAB_LIMITS.maxUndoHistory - 1)), slots]);
    setSlots((prev) => prev.map((v, i) => (i === activeIdx ? token : v)));
    setActiveIdx((i) => Math.min(slotCount - 1, i + 1));
    setChecked(false);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setSlots(prev);
    setChecked(false);
  };

  const handleReset = () => {
    setHistory([]);
    setSlots(initialSlots);
    setActiveIdx(0);
    setChecked(false);
  };

  const tilePalette = config.mode === 'monohybrid-punnett' ? punnettOptions : config.palette ?? [];

  return (
    <ConstructionLabShell
      id={config.id}
      labKind={config.labKind}
      title={config.title}
      instructions={config.instructions}
      accessibilityLabel={config.accessibilityLabel}
      subjectTag={config.subjectTag ?? 'Biology'}
      modelNote={config.modelNote}
      hints={config.hints}
      prediction={config.prediction}
      canUndo={history.length > 0}
      onUndo={handleUndo}
      onReset={handleReset}
      onCheck={() => setChecked(true)}
      checkLabel="Check biological sequence"
      feedback={
        checked
          ? {
              passed: evaluation.passed,
              message:
                evaluation.passed && config.successExplanation ? config.successExplanation : evaluation.feedback,
            }
          : null
      }
    >
      {/* Mode 4: Monohybrid Punnett Construction */}
      {config.mode === 'monohybrid-punnett' && punnettRef ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xs font-bold text-slate-800">
            Cross: Parent 1 ({config.parent1Genotype}) × Parent 2 ({config.parent2Genotype})
            {config.inheritanceAssumption && (
              <span className="ml-1.5 font-normal text-slate-600">— {config.inheritanceAssumption}</span>
            )}
          </p>
          <div className="mt-2.5 grid max-w-xs grid-cols-3 gap-1.5 text-center text-xs">
            <div className="flex items-center justify-center rounded-lg bg-slate-200 p-2 font-bold text-slate-700">
              Gametes
            </div>
            <div className="flex items-center justify-center rounded-lg bg-sky-100 p-2 font-mono font-extrabold text-sky-900">
              {punnettRef.parent2Gametes[0]}
            </div>
            <div className="flex items-center justify-center rounded-lg bg-sky-100 p-2 font-mono font-extrabold text-sky-900">
              {punnettRef.parent2Gametes[1]}
            </div>

            {[0, 1].map((row) => (
              <React.Fragment key={row}>
                <div className="flex items-center justify-center rounded-lg bg-teal-100 p-2 font-mono font-extrabold text-teal-900">
                  {punnettRef.parent1Gametes[row]}
                </div>
                {[0, 1].map((col) => {
                  const idx = row * 2 + col;
                  const isActive = activeIdx === idx;
                  const val = slots[idx];
                  return (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Punnett cell row ${row + 1} column ${col + 1}`}
                      aria-pressed={isActive}
                      onClick={() => setActiveIdx(idx)}
                      className={`min-h-[44px] rounded-lg border-2 font-mono text-sm font-extrabold transition motion-reduce:transition-none ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950'
                          : 'border-slate-300 bg-white text-slate-900'
                      }`}
                    >
                      {val ?? '?'}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : (
        /* Modes 1-3: DNA Base Pairing, DNA-to-mRNA Transcription, mRNA Translation */
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          {config.mode === 'mrna-translation' && (
            <div className="mb-2 flex flex-wrap items-center justify-between gap-1 text-[11px] font-bold text-teal-800">
              <span>mRNA Codons ({config.templateDirection ?? '5′→3′'}) → Polypeptide ({config.productDirection ?? 'N-terminus → C-terminus'})</span>
              <span className="rounded bg-teal-100 px-2 py-0.5 text-[10px]">
                {config.isCompleteCodingSequence ? 'Complete coding sequence (start to stop)' : 'Short coding fragment'}
              </span>
            </div>
          )}

          {/* Template Row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 rounded bg-slate-200 px-2 py-1 text-[11px] font-bold text-slate-700">
              {config.mode === 'mrna-translation'
                ? config.templateDirection ?? '5′→3′ mRNA'
                : `${config.templateDirection ?? '3′→5′'} Template`}
            </span>
            {config.mode === 'mrna-translation' && translationRef
              ? translationRef.codons.slice(0, slotCount).map((codon, idx) => (
                  <span
                    key={idx}
                    className="flex h-10 min-w-[3.25rem] items-center justify-center rounded-lg border border-slate-300 bg-white px-2 font-mono text-xs font-extrabold text-slate-900"
                  >
                    {codon}
                  </span>
                ))
              : (config.templateSequence ?? []).map((base, idx) => (
                  <span
                    key={idx}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white font-mono text-sm font-extrabold text-slate-900"
                  >
                    {base}
                  </span>
                ))}
          </div>

          {/* Student Construction Row */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 rounded bg-indigo-100 px-2 py-1 text-[11px] font-bold text-indigo-900">
              {config.mode === 'mrna-translation'
                ? config.productDirection ?? 'N→C Chain'
                : `${config.productDirection ?? '5′→3′'} Built`}
            </span>
            {slots.map((val, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  aria-label={`Position ${idx + 1}${val ? `: ${val}` : ': empty'}`}
                  aria-pressed={isActive}
                  onClick={() => setActiveIdx(idx)}
                  className={`flex min-h-[44px] ${
                    config.mode === 'mrna-translation' ? 'min-w-[3.25rem] px-2' : 'w-11'
                  } items-center justify-center rounded-lg border-2 font-mono text-xs font-extrabold transition motion-reduce:transition-none ${
                    isActive
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950'
                      : checked && evaluation.perSlotCorrect[idx]
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                        : checked && !evaluation.perSlotCorrect[idx]
                          ? 'border-rose-500 bg-rose-50 text-rose-950'
                          : 'border-slate-300 bg-white text-slate-900'
                  }`}
                >
                  {val ?? '?'}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tile Palette (44x44px touch targets, keyboard-friendly, zero drag-and-drop) */}
      <div className="mt-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Select tile for Position {activeIdx + 1}:
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {tilePalette.map((tok) => (
            <button
              key={tok}
              type="button"
              onClick={() => assignToken(tok)}
              className="min-h-[44px] min-w-[44px] rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-1.5 font-mono text-xs font-extrabold text-indigo-950 transition motion-reduce:transition-none hover:bg-indigo-100"
            >
              {tok}
            </button>
          ))}
        </div>
      </div>
    </ConstructionLabShell>
  );
}
