import React from 'react';
import { cn } from '@/lib/utils';

export interface HeroBannerProps {
  eyebrow: string;
  title: string;
  description: string;
  badgeColor?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  gradient?: string;
  className?: string;
}

export function HeroBanner({
  eyebrow,
  title,
  description,
  badgeColor,
  badge,
  actions,
  icon: Icon,
  gradient,
  className,
}: HeroBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 rounded-2xl text-white shadow-md gap-4 border transition-all duration-300 relative overflow-hidden",
        gradient || "bg-slate-900 border-slate-800",
        className
      )}
    >
      {/* Background subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.06),_transparent)] pointer-events-none" />

      {/* Left side: Icon, Eyebrow, Title, Description */}
      <div className="flex items-start sm:items-center gap-3.5 relative z-10 max-w-3xl">
        {Icon && (
          <div className="p-3 rounded-xl bg-white/10 text-white border border-white/15 shrink-0 hidden xs:flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            {badge ? (
              badge
            ) : (
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md border",
                  badgeColor || "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                )}
              >
                {eyebrow}
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase mt-1">
            {title}
          </h2>
          <p className="text-xs text-slate-300 font-medium leading-relaxed mt-0.5">
            {description}
          </p>
        </div>
      </div>

      {/* Right side: Actions / Controls / Badges / Icon */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0 shrink-0 relative z-10">
        {actions ? (
          actions
        ) : Icon ? (
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl hidden sm:flex items-center justify-center">
            <Icon className="h-6 w-6 text-white/80" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
