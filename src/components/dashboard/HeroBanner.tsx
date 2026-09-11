import React from 'react';
import { SectionHeroBanner } from '@/components/common/SectionHeroBanner';

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
  icon,
  className,
}: HeroBannerProps) {
  return (
    <SectionHeroBanner
      eyebrow={`SUNNY SIDE ACADEMY • ${tag}`}
      title={title}
      subtitle={description}
      icon={icon}
      actions={
        (statusBadge || actions) ? (
          <div className="flex flex-wrap items-center gap-2.5">
            {statusBadge}
            {actions}
          </div>
        ) : undefined
      }
      className={className}
    />
  );
}

export default HeroBanner;

