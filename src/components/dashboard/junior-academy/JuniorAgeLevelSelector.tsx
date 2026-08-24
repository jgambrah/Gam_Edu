'use client';

import React from 'react';
import { AGE_TIERS, AgeTierConfig } from '@/lib/junior-age-levels';
import { cn } from '@/lib/utils';
import { Sparkles, Trophy, CheckCircle2 } from 'lucide-react';

interface JuniorAgeLevelSelectorProps {
  activeTier: string;
  onSelectTier: (tierId: 'ages2-3' | 'ages3-4' | 'ages4-5' | 'ages5+') => void;
}

export function JuniorAgeLevelSelector({ activeTier, onSelectTier }: JuniorAgeLevelSelectorProps) {
  const tiers = Object.values(AGE_TIERS);

  return (
    <div className="space-y-4 my-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            Structured Learning Pathway <Sparkles className="w-5 h-5 text-amber-500" />
          </h2>
          <p className="text-xs text-slate-500 font-medium">Select your child's age group to unlock age-tailored interactive exercises</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {tiers.map((tier) => {
          const isSelected = activeTier === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => onSelectTier(tier.id)}
              className={cn(
                "p-4 rounded-3xl cursor-pointer transition-all duration-300 border-2 relative overflow-hidden group shadow-sm hover:shadow-md",
                isSelected
                  ? "bg-white border-pink-500 shadow-xl scale-[1.03] ring-4 ring-pink-100"
                  : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white"
              )}
            >
              {/* Active Badge Checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 bg-pink-500 text-white rounded-full p-1 shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}

              <div className="flex items-center gap-3 mb-2">
                <div className={cn("text-3xl p-2.5 rounded-2xl bg-gradient-to-br shadow-inner", tier.color)}>
                  {tier.iconEmoji}
                </div>
                <div>
                  <span className={cn("text-[10px] font-black uppercase px-2 py-0.5 rounded-full border", tier.badgeBg)}>
                    {tier.recommendedGrade}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 leading-tight mt-0.5">{tier.name}</h3>
                </div>
              </div>

              <p className="text-xs font-bold text-slate-500 mb-3">{tier.subtitle}</p>

              {/* Objectives List */}
              <div className="space-y-1 border-t border-slate-100 pt-2.5">
                {tier.objectives.slice(0, 3).map((obj, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600 font-medium line-clamp-1">
                    <span className="text-pink-500 font-bold">•</span> {obj}
                  </div>
                ))}
                {tier.objectives.length > 3 && (
                  <p className="text-[10px] font-black text-pink-600 uppercase tracking-wider pt-0.5">+ {tier.objectives.length - 3} more skills</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
