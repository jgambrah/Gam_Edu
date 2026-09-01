import React from 'react';
import { cn } from '@/lib/utils';

export interface HeroBannerProps {
  tag: string;                   // e.g. "OVERVIEW HUB", "ACADEMICS PULSE"
  title: string;                 // e.g. "EXECUTIVE DIRECTOR COCKPIT"
  description: string;           // 1-sentence summary description
  statusBadge?: React.ReactNode; // e.g. Green dot + "LIVE EXECUTIVE DATA" or "TERM 2 ACTIVE"
  actions?: React.ReactNode;     // e.g. Export PDF, Generate Report, Filter buttons
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function HeroBanner({
  tag,
  title,
  description,
  statusBadge,
  actions,
  icon: Icon,
  className,
}: HeroBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl text-white shadow-md gap-4 bg-[#1E255E] border border-indigo-900/40 transition-all duration-300 relative overflow-hidden",
        className
      )}
    >
      {/* Background subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_70%)] pointer-events-none" />

      {/* Left Column */}
      <div className="flex items-start sm:items-center gap-4 relative z-10 max-w-3xl">
        {Icon && (
          <div className="p-3 rounded-xl bg-white/10 text-white border border-white/15 shrink-0 hidden xs:flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 text-indigo-200 px-3 py-1 rounded-full border border-white/15">
              {tag}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase mt-1.5">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-2xl mt-1">
            {description}
          </p>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-indigo-800/40 pt-3 sm:pt-0 shrink-0 relative z-10">
        {statusBadge && (
          <div className="flex items-center shrink-0">
            {statusBadge}
          </div>
        )}
        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
