'use client';

import React, { useState } from 'react';
import { 
  Building2, ChevronDown, Download, Globe, BrainCircuit 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { SectionHeroBanner } from '@/components/common/SectionHeroBanner';

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
  eyebrow?: string;
  stats?: Array<{ label: string; value: string | number; change?: string }>;
  children?: React.ReactNode;
}

export function ExecutiveCockpitHeader({
  campuses = [],
  selectedCampus,
  onSelectCampus,
  onExportPdf,
  title = "Executive Director Cockpit",
  subtitle = "Real-time institutional telemetry, financial velocity & executive action desk",
  eyebrow = "SUNNY SIDE ACADEMY • DIRECTOR SUITE",
  stats,
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
    <SectionHeroBanner
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      icon={BrainCircuit}
      badge={{
        label: "Live Telemetry",
        variant: "success"
      }}
      breadcrumbs={[
        { label: 'Director Suite' },
        { label: 'Executive Console', href: '/dashboard' },
        { label: 'Overview Hub' }
      ]}
      stats={stats}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          {/* Dynamic Campus Selector */}
          {campuses && campuses.length > 1 ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  type="button"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-xs font-semibold text-slate-100 transition shadow-xs cursor-pointer backdrop-blur-md"
                >
                  <Building2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span className="truncate max-w-[150px]">
                    Campus: <strong className="text-white">{activeCampus}</strong>
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl p-1.5 text-xs z-50 text-white animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Operating Branch
                </div>
                {campuses.map((c) => (
                  <DropdownMenuItem
                    key={c.id}
                    onClick={() => handleCampusChange(c.name)}
                    className={cn(
                      "flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors",
                      activeCampus === c.name ? "bg-amber-500/20 text-amber-300 font-bold" : "hover:bg-white/10 text-slate-200"
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {c.id === 'all' ? (
                        <Globe className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                      ) : (
                        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      )}
                      <span className="truncate">{c.name}</span>
                    </div>
                    {c.code && (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-white/10 text-slate-300 shrink-0 ml-2 border-white/20">
                        {c.code}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.08] border border-white/15 text-xs font-semibold text-slate-100 backdrop-blur-md">
              <Building2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>
                Campus: <strong className="text-white">{activeCampus}</strong>
              </span>
            </div>
          )}

          {/* Export PDF Button */}
          <Button
            size="sm"
            onClick={handleExport}
            className="bg-white/10 hover:bg-white/20 text-white font-bold border border-white/15 rounded-xl text-xs h-8 px-3 gap-1.5 shadow-xs cursor-pointer backdrop-blur-md"
          >
            <Download className="h-3.5 w-3.5 text-amber-400" />
            <span>Export PDF</span>
          </Button>
        </div>
      }
    >
      {children}
    </SectionHeroBanner>
  );
}

export default ExecutiveCockpitHeader;

