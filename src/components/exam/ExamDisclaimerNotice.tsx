'use client';

import React, { useState } from 'react';
import { Info as InformationCircleIcon } from 'lucide-react';

interface Props {
  variantYear?: number | null;
  compact?: boolean;
}

export const ExamDisclaimerTooltip: React.FC<Props> = ({ variantYear, compact = false }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-sky-300 transition-colors bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60 cursor-pointer"
        aria-label="Practice Model Disclaimer"
      >
        <InformationCircleIcon className="w-3.5 h-3.5 text-sky-400" />
        <span>{compact ? 'Practice Model' : 'Calibrated Variant'}</span>
      </button>

      {open && (
        <div 
          className="absolute z-50 bottom-full left-0 mb-2 w-72 max-w-[calc(100vw-3rem)] p-3 text-xs rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl text-slate-300 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="font-semibold text-sky-400 mb-1 flex items-center justify-between">
            <span>Isomorphic Exam Model</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">GAM EDU</span>
          </div>
          <p className="leading-relaxed">
            This paper is an authentic WAEC BECE syllabus-aligned practice model. Questions are mathematically calibrated clones designed to evaluate true conceptual mastery with fresh numerical parameters.
          </p>
          <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
            Proprietary content &copy; {new Date().getFullYear()} GAM IT Solutions. All rights reserved.
          </div>
        </div>
      )}
    </div>
  );
};

export const ActiveExamHeaderDisclaimer: React.FC<{ year?: number | null }> = ({ year }) => {
  return (
    <div className="w-full bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
      <span>
        <strong>GAM EDU Practice Series{year ? ` (BECE ${year} Model)` : ''}:</strong> Questions are mathematically calibrated isomorphic variants developed by GAM IT Solutions to mirror authentic exam difficulty and cognitive depth.
      </span>
    </div>
  );
};

export const PlatformExamFooterNotice: React.FC = () => {
  return (
    <div className="mt-12 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400 space-y-1">
      <p>
        GAM EDU is an educational technology initiative developed and operated exclusively by <strong>GAM IT Solutions</strong>.
      </p>
      <p className="text-slate-400">
        All BECE practice papers are independently generated curriculum variants. WAEC is a registered trademark of the West African Examinations Council, with which this platform holds no direct affiliation.
      </p>
      <p className="text-[11px] text-slate-400">
        &copy; {new Date().getFullYear()} GAM IT Solutions. All rights reserved.
      </p>
    </div>
  );
};
