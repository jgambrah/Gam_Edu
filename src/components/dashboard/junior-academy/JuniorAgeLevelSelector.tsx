'use client';

import React from 'react';
import { AGE_TIERS, AgeTierConfig } from '@/lib/junior-age-levels';
import { cn } from '@/lib/utils';
import { Sparkles, Trophy, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface JuniorAgeLevelSelectorProps {
  activeTier: string;
  onSelectTier: (tierId: 'ages2-3' | 'ages3-4' | 'ages4-5' | 'ages5+') => void;
  isCompact?: boolean;
  onToggleCompact?: () => void;
}

export function JuniorAgeLevelSelector({ activeTier, onSelectTier, isCompact = false, onToggleCompact }: JuniorAgeLevelSelectorProps) {
  const tiers = Object.values(AGE_TIERS);

  if (isCompact) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/90 shadow-xs my-1">
        <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Pathway:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none py-0.5">
          <div className="flex items-center gap-1.5" role="group" aria-label="Learning pathway age levels">
            {tiers.map((tier) => {
              const isSelected = activeTier === tier.id;
              return (
                <button
                  key={tier.id}
                  type="button"
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={`${tier.name}: ${tier.recommendedGrade} (${tier.internationalTier})`}
                  onClick={() => onSelectTier(tier.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shrink-0 border cursor-pointer outline-none focus-visible:ring-3 focus-visible:ring-pink-400",
                    isSelected
                      ? "bg-pink-600 text-white border-pink-700 shadow-sm scale-102 font-extrabold"
                      : "bg-white/90 text-slate-700 border-slate-200 hover:bg-pink-50 hover:text-pink-800 hover:border-pink-200"
                  )}
                >
                  <span className="text-sm">{tier.iconEmoji}</span>
                  <span>{tier.name}</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-md font-bold uppercase tracking-tight hidden sm:inline",
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  )}>
                    {tier.internationalTier}
                  </span>
                </button>
              );
            })}
          </div>
          {onToggleCompact && (
            <button
              type="button"
              onClick={onToggleCompact}
              title="Expand Pathway Cards"
              aria-label="Expand structured learning pathway view"
              className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white rounded-xl border border-slate-200 flex items-center gap-1 shrink-0 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
            >
              <span>Expand</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 my-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Structured Learning Pathway <Sparkles className="w-5 h-5 text-amber-500" />
          </h2>
          <p className="text-xs text-slate-600 font-semibold">UK EYFS & Science of Reading aligned progression from Sensory Exploration to Polysyllabic Fluency</p>
        </div>
        {onToggleCompact && (
          <button
            type="button"
            onClick={onToggleCompact}
            title="Collapse to compact bar"
            aria-label="Collapse structured learning pathway to compact view"
            className="px-3 py-1.5 text-xs font-extrabold text-slate-600 hover:text-slate-900 bg-white/90 hover:bg-white rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
          >
            <span>Compact View</span>
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5" role="group" aria-label="Structured learning pathway tiers">
        {tiers.map((tier) => {
          const isSelected = activeTier === tier.id;
          return (
            <div
              key={tier.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={`${tier.name} (${tier.recommendedGrade}, ${tier.internationalTier}): ${tier.subtitle}`}
              onClick={() => onSelectTier(tier.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTier(tier.id);
                }
              }}
              className={cn(
                "p-4 rounded-3xl cursor-pointer transition-all duration-200 border-2 relative overflow-hidden group shadow-sm hover:shadow-md outline-none focus-visible:ring-4 focus-visible:ring-pink-400 focus-visible:ring-offset-2",
                isSelected
                  ? "bg-white border-pink-600 shadow-xl scale-[1.02] ring-4 ring-pink-100"
                  : "bg-white/90 border-slate-200 hover:border-slate-300 hover:bg-white"
              )}
            >
              {/* Active Badge Checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-pink-600 text-white rounded-full p-1 shadow-md animate-in zoom-in-75 duration-200">
                  <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              <div className="flex items-center gap-3 mb-2">
                <div className={cn("text-3xl p-2.5 rounded-2xl bg-gradient-to-br shadow-inner text-white flex items-center justify-center", tier.color)}>
                  {tier.iconEmoji}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1 mb-0.5">
                    <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded-full border leading-none", tier.badgeBg)}>
                      {tier.recommendedGrade}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">{tier.name}</h3>
                </div>
              </div>

              {/* International Standard Subtitle Badge */}
              <div className="mb-2.5 flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 tracking-wider">
                  🌍 {tier.internationalTier}
                </span>
              </div>

              <p className="text-xs font-bold text-slate-600 mb-3">{tier.subtitle}</p>

              {/* Objectives List (Science of Reading & EYFS Aligned) */}
              <div className="space-y-1.5 border-t border-slate-100 pt-2.5">
                <div className="text-[9px] font-black uppercase tracking-wider text-slate-400">Core Objectives:</div>
                {tier.objectives.slice(0, 3).map((obj, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700 font-medium leading-snug">
                    <span className="text-pink-600 font-bold shrink-0">•</span> 
                    <span className="line-clamp-2">{obj}</span>
                  </div>
                ))}
                {tier.objectives.length > 3 && (
                  <p className="text-[10px] font-black text-pink-700 uppercase tracking-wider pt-0.5">+ {tier.objectives.length - 3} more skills</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
