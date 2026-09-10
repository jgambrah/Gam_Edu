'use client';

import React, { useState } from 'react';
import { 
  Building2, ChevronDown, ChevronRight, Download, Globe, BrainCircuit 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export interface CampusItem {
  id: string;
  name: string;
  code?: string;
  badge?: string;
}

export interface ExecutiveCockpitHeaderProps {
  campuses?: CampusItem[];
  selectedCampus?: string;
  onSelectCampus?: (campusName: string) => void;
  onExportPdf?: () => void;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function ExecutiveCockpitHeader({
  campuses = [],
  selectedCampus,
  onSelectCampus,
  onExportPdf,
  title = "Executive Director Cockpit",
  subtitle = "Real-time institutional telemetry, financial velocity & executive action desk",
  children
}: ExecutiveCockpitHeaderProps) {
  const { toast } = useToast();
  const [internalCampus, setInternalCampus] = useState(selectedCampus || campuses[0]?.name || 'Main Campus');

  const activeCampus = selectedCampus || internalCampus;

  const handleCampusChange = (name: string) => {
    setInternalCampus(name);
    if (onSelectCampus) {
      onSelectCampus(name);
    } else {
      toast({
        title: "Campus Context Switched",
        description: `Active operating branch set to ${name}.`,
      });
    }
  };

  const handleExport = () => {
    if (onExportPdf) {
      onExportPdf();
    } else {
      toast({
        title: "Executive Report Exported",
        description: "PDF executive summary generated successfully.",
      });
    }
  };

  return (
    <header className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs transition-all mb-4">
      {/* Top Meta Line: Breadcrumbs & Campus Selector + Export PDF */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        {/* Consolidated Breadcrumbs: Director Suite > Executive Console > Overview Hub */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <span className="text-slate-500 hover:text-slate-800 transition-colors">Director Suite</span>
          <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
          <span className="text-slate-500 hover:text-slate-800 transition-colors">Executive Console</span>
          <ChevronRight className="h-3 w-3 text-slate-300 shrink-0" />
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100/80">
            Overview Hub
          </span>
        </nav>

        {/* Action Controls: Campus Switcher & Export PDF */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          {/* Dynamic Campus Selector */}
          {campuses && campuses.length > 1 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition shadow-2xs cursor-pointer"
                >
                  <Building2 className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                  <span className="truncate max-w-[160px]">
                    Campus: <strong className="text-slate-900">{activeCampus}</strong>
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-1.5 text-xs z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Operating Branch
                </div>
                {campuses.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onClick={() => handleCampusChange(c.name)}
                    className={cn(
                      "flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors",
                      activeCampus === c.name ? "bg-indigo-50 text-indigo-700 font-bold" : "hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {c.id === 'all' ? (
                        <Globe className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      ) : (
                        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      )}
                      <span className="truncate">{c.name}</span>
                    </div>
                    {c.code && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-white shrink-0 ml-2 border-slate-200">
                        {c.code}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs">
              <Building2 className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span>
                Campus: <strong className="text-slate-900">{activeCampus}</strong>
              </span>
            </div>
          )}

          {/* Export PDF Button */}
          <Button
            size="sm"
            onClick={handleExport}
            className="bg-white hover:bg-slate-50 text-slate-800 font-bold border border-slate-200 rounded-xl text-xs h-8 px-3 gap-1.5 shadow-2xs cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-slate-600" />
            <span>Export PDF</span>
          </Button>
        </div>
      </div>

      {/* Main Title & Docked Navigation Area */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-xs shadow-indigo-200 shrink-0">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {title}
              </h1>
              <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Telemetry
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 font-medium mt-0.5 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Docked Right Navigation Slot (e.g. Domain Segmented Control & AI Auditor) */}
        {children && (
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
