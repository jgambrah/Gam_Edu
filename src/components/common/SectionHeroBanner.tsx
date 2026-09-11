'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles, Shield, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SectionHeroBadgeVariant = 'success' | 'warning' | 'info' | 'gold';

export interface SectionHeroStat {
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export interface SectionHeroBreadcrumb {
  label: string;
  href?: string;
}

export interface SectionHeroBadge {
  label: string;
  variant?: SectionHeroBadgeVariant;
  icon?: React.ReactNode;
}

export interface SectionHeroBannerProps {
  /** Main section or page title */
  title: string;
  /** Explanatory subtitle or institutional descriptor */
  subtitle?: string;
  /** Eyebrow tag preceding title, defaults to "SUNNY SIDE ACADEMY • DIRECTOR SUITE" */
  eyebrow?: string;
  /** Status badge indicating system state, telemetry, or active term */
  badge?: SectionHeroBadge;
  /** Navigation breadcrumb path */
  breadcrumbs?: SectionHeroBreadcrumb[];
  /** Right-aligned quick action buttons (Export PDF, Broadcast, Campus selector, etc.) */
  actions?: React.ReactNode;
  /** Inline quick-stat metric chips */
  stats?: SectionHeroStat[];
  /** Primary category or module icon */
  icon?: React.ComponentType<{ className?: string }> | React.ReactNode;
  /** Additional docked controls (e.g. tab bars, search, segmented filters) */
  children?: React.ReactNode;
  /** Optional custom class name overrides */
  className?: string;
}

export function SectionHeroBanner({
  title,
  subtitle,
  eyebrow = "SUNNY SIDE ACADEMY • DIRECTOR SUITE",
  badge,
  breadcrumbs,
  actions,
  stats,
  icon: IconOrElement,
  children,
  className,
}: SectionHeroBannerProps) {
  // Variant styling dictionary for dynamic status badges
  const badgeStyles: Record<SectionHeroBadgeVariant, { bg: string; text: string; border: string; dot: string }> = {
    success: {
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-300',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400',
    },
    gold: {
      bg: 'bg-amber-500/15',
      text: 'text-amber-300',
      border: 'border-amber-500/30',
      dot: 'bg-amber-400',
    },
    info: {
      bg: 'bg-sky-500/15',
      text: 'text-sky-300',
      border: 'border-sky-500/30',
      dot: 'bg-sky-400',
    },
    warning: {
      bg: 'bg-rose-500/15',
      text: 'text-rose-300',
      border: 'border-rose-500/30',
      dot: 'bg-rose-400',
    },
  };

  const badgeVariant = badge?.variant || 'success';
  const currentBadgeStyle = badgeStyles[badgeVariant];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-800/80 shadow-2xl text-white transition-all duration-300",
        // Deep institutional gradient: Navy/Slate `#0f172a` to `#1e1b4b` with subtle gold accent hairline
        "bg-gradient-to-br from-[#0f172a] via-[#131b35] to-[#1e1b4b]",
        "after:absolute after:inset-x-0 after:top-0 after:h-[1px] after:bg-gradient-to-r after:from-transparent after:via-amber-400/40 after:to-transparent",
        className
      )}
    >
      {/* Background Institutional Crest & Geometric Watermark Pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Soft radial blur glow */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-amber-500/5 blur-3xl" />

        {/* Subtle geometric grid mesh */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
        >
          <defs>
            <pattern id="hero-grid-mesh" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid-mesh)" />
        </svg>

        {/* Institutional Watermark Crest (Shield + Laurel + Stars) */}
        <svg
          className="absolute -right-8 -bottom-10 h-64 w-64 text-amber-300 opacity-[0.035] transform rotate-12"
          viewBox="0 0 200 200"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M100 15 L160 45 V95 C160 145 100 185 100 185 C100 185 40 145 40 95 V45 L100 15 Z" fill="none" stroke="currentColor" strokeWidth="6" />
          <path d="M100 30 L145 53 V95 C145 133 100 166 100 166 C100 166 55 133 55 95 V53 L100 30 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <polygon points="100,55 106,72 124,72 109,83 115,100 100,89 85,100 91,83 76,72 94,72" />
          <path d="M70 120 C75 135 90 145 100 145 C110 145 125 135 130 120" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 py-5 px-6 space-y-3.5">
        {/* Top Bar: Breadcrumbs & Right Action Controls */}
        {(breadcrumbs?.length || actions) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-white/[0.08]">
            {/* Breadcrumb Navigation */}
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-400">
                {breadcrumbs.map((crumb, idx) => {
                  const isLast = idx === breadcrumbs.length - 1;
                  return (
                    <React.Fragment key={idx}>
                      {crumb.href && !isLast ? (
                        <Link
                          href={crumb.href}
                          className="hover:text-amber-300 transition-colors duration-150"
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span
                          className={cn(
                            isLast
                              ? "text-slate-200 font-bold px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/10"
                              : "text-slate-400"
                          )}
                        >
                          {crumb.label}
                        </span>
                      )}
                      {!isLast && (
                        <ChevronRight className="h-3 w-3 text-slate-500 shrink-0" />
                      )}
                    </React.Fragment>
                  );
                })}
              </nav>
            ) : <div />}

            {/* Actions Slot */}
            {actions && (
              <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-auto">
                {actions}
              </div>
            )}
          </div>
        )}

        {/* Hero Body: Icon, Eyebrow, Title, Subtitle, Badges */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5 max-w-3xl">
            {/* Category / Module Icon */}
            {IconOrElement && (
              <div className="p-2.5 sm:p-3 rounded-2xl bg-white/[0.06] border border-white/10 text-amber-400 backdrop-blur-md shadow-inner shrink-0 hidden xs:flex items-center justify-center">
                {React.isValidElement(IconOrElement) ? (
                  IconOrElement
                ) : typeof IconOrElement === 'function' ? (
                  React.createElement(IconOrElement as React.ComponentType<{ className?: string }>, {
                    className: "h-5 w-5 sm:h-6 sm:w-6 text-amber-400",
                  })
                ) : null}
              </div>
            )}

            <div>
              {/* Eyebrow Tag & Optional Badge */}
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {eyebrow && (
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-400/90 bg-amber-400/10 px-2.5 py-0.5 rounded-md border border-amber-400/20">
                    {eyebrow}
                  </span>
                )}

                {badge && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border",
                      currentBadgeStyle.bg,
                      currentBadgeStyle.text,
                      currentBadgeStyle.border
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", currentBadgeStyle.dot)} />
                    {badge.label}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
                {title}
              </h1>

              {/* Subtitle / Description */}
              {subtitle && (
                <p className="text-xs sm:text-sm text-slate-300/85 font-normal leading-relaxed max-w-2xl mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats Chips (if provided) */}
          {stats && stats.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 lg:self-center shrink-0">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 backdrop-blur-md shadow-xs min-w-[75px]"
                >
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {stat.label}
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-sm sm:text-base font-black text-white">
                      {stat.value}
                    </span>
                    {stat.change && (
                      <span
                        className={cn(
                          "text-[9px] font-bold",
                          stat.changeType === 'negative'
                            ? "text-rose-400"
                            : stat.changeType === 'neutral'
                            ? "text-slate-400"
                            : "text-emerald-400"
                        )}
                      >
                        {stat.change}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Optional Docked Children (e.g. Domain Segmented Controls, Search bars, Filter pills) */}
        {children && (
          <div className="pt-2 border-t border-white/[0.08]">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default SectionHeroBanner;
