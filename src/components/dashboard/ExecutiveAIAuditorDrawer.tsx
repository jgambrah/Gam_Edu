import React, { useState, useEffect, useRef } from 'react';
import { 
  BrainCircuit, Sparkles, X, Pin, PinOff, AlertTriangle, 
  Award, Clock, FileText, RefreshCw, Send, ChevronRight,
  Sparkle, CheckCircle2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export interface ExecutiveAIAuditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
  aiCredits: number;
  aiChatHistory: ChatMessage[];
  isAiAuditing: boolean;
  aiPrompt: string;
  setAiPrompt: (val: string) => void;
  onSendQuery: (queryText?: string) => void;
  onOpenDraftTemplate: (type: 'arrears' | 'academic' | 'staff') => void;
  telemetry: {
    financials?: {
      totalRevenue: number;
      collectionRate: number;
    };
    staff?: {
      pendingCheckins: number;
    };
    academics?: {
      avgScore: number;
      atRiskCount: number;
    };
    highArrearsCount?: number;
    pendingStaffCheckins?: number;
  };
}

export const SUGGESTED_PROMPT_CHIPS = [
  'Draft Fee Arrears Collection Notice',
  'Draft Staff Punctuality Memo',
  'What is our projected cash flow for next month?',
  'Which grade has highest academic gap?'
];

export function ExecutiveAIAuditorDrawer({
  isOpen,
  onClose,
  isPinned,
  onTogglePin,
  aiCredits,
  aiChatHistory,
  isAiAuditing,
  aiPrompt,
  setAiPrompt,
  onSendQuery,
  onOpenDraftTemplate,
  telemetry
}: ExecutiveAIAuditorDrawerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the single outer scroll container when new messages arrive or loading state changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiChatHistory.length, isAiAuditing, isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* 
        MODAL BACKDROP:
        Only rendered in Floating/Modal mode (!isPinned).
        When Pinned/Split mode is active, the backdrop is completely omitted so the user can freely
        inspect, scroll, and interact with the live dashboard while reading the AI audit.
      */}
      {!isPinned && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* 
        SLIDE-OVER / DOCKED SIDE PANEL CONTAINER:
        - When Pinned: Docked directly to the right viewport edge (z-40) with no backdrop.
        - When Floating: Sits on top of the modal backdrop (z-50).
        - Responsive: On smaller desktop viewports (< lg), width is capped at 100% or 440px so it collapses cleanly.
      */}
      <aside
        className={cn(
          "fixed top-0 right-0 bottom-0 h-full h-[100dvh] flex flex-col justify-between bg-slate-900 text-white border-l border-slate-800 shadow-2xl transition-all duration-300 ease-in-out animate-in slide-in-from-right duration-300",
          isPinned 
            ? "z-40 w-full sm:w-[420px] lg:w-[460px] xl:w-[480px] bg-slate-900/98 backdrop-blur-md" 
            : "z-50 w-full sm:w-[460px] md:w-[500px] bg-slate-900"
        )}
      >
        {/* ─── 1. FIXED HEADER BAR (STAYS AT TOP) ─── */}
        <header className="shrink-0 px-5 py-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm sm:text-base tracking-tight truncate">Executive AI Auditor</h3>
                {isPinned && (
                  <Badge variant="outline" className="hidden sm:inline-flex bg-indigo-950/60 text-indigo-300 border-indigo-800 text-[10px] px-1.5 py-0">
                    Docked
                  </Badge>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate">Daily briefings & 1-click memo execution</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Badge variant="outline" className="bg-indigo-950/80 text-indigo-300 border-indigo-700 text-xs px-2 py-0.5 font-medium">
              <Sparkles className="h-3 w-3 text-amber-400 mr-1" /> {aiCredits}
            </Badge>

            {/* Persistent Dock/Pin Mode Toggle Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onTogglePin}
              className={cn(
                "h-8 px-2.5 rounded-xl text-xs font-semibold gap-1.5 transition-colors cursor-pointer",
                isPinned 
                  ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
              title={isPinned ? "Unpin side panel (Switch to floating overlay mode)" : "Dock side panel (Keep live dashboard visible)"}
            >
              {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
              <span className="hidden md:inline">{isPinned ? "Unpin" : "Dock"}</span>
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="rounded-full h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              title="Close drawer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* ─── 2. SINGLE OUTER SCROLLABLE BODY (NO NESTED SCROLL CONTAINERS) ─── */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-5 py-4 space-y-4 overscroll-contain"
        >
          {/* Proactive Auto-Generated Daily Executive Briefing */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-indigo-500/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                  Proactive Daily Executive Briefing
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Live Audit Active</span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Financial Alert */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-indigo-900/50 space-y-1">
                <div className="flex items-center justify-between text-red-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" /> Finance Alert
                  </span>
                  <Badge className="bg-red-950 text-red-300 border-red-800 text-[9px] px-1 py-0">Critical</Badge>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  3 critical financial accounts require attention (&gt;60d overdue, GH₵ 94.5k sum).
                </p>
                <button 
                  onClick={() => onOpenDraftTemplate('arrears')}
                  className="text-[10px] font-semibold text-red-300 hover:text-red-200 underline flex items-center pt-0.5 cursor-pointer"
                >
                  <FileText className="h-3 w-3 mr-1" /> Draft Collection Notice →
                </button>
              </div>

              {/* Academic Outperformer */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-indigo-900/50 space-y-1">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5" /> Academic Outperformer
                  </span>
                  <Badge className="bg-emerald-950 text-emerald-300 border-emerald-800 text-[9px] px-1 py-0">+12.4%</Badge>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Grade 6 Science outperforming target benchmark by +12.4% (avg API 94.2%).
                </p>
                <button 
                  onClick={() => onOpenDraftTemplate('academic')}
                  className="text-[10px] font-semibold text-emerald-300 hover:text-emerald-200 underline flex items-center pt-0.5 cursor-pointer"
                >
                  <FileText className="h-3 w-3 mr-1" /> Send Commendation →
                </button>
              </div>

              {/* Staff Inspection */}
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-indigo-900/50 space-y-1">
                <div className="flex items-center justify-between text-amber-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> Staff Inspection
                  </span>
                  <Badge className="bg-amber-950 text-amber-300 border-amber-800 text-[9px] px-1 py-0">Pending</Badge>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {telemetry.pendingStaffCheckins ?? telemetry.staff?.pendingCheckins ?? 21} staff check-ins pending morning assembly verification.
                </p>
                <button 
                  onClick={() => onOpenDraftTemplate('staff')}
                  className="text-[10px] font-semibold text-amber-300 hover:text-amber-200 underline flex items-center pt-0.5 cursor-pointer"
                >
                  <FileText className="h-3 w-3 mr-1" /> Draft Punctuality Memo →
                </button>
              </div>
            </div>
          </div>

          {/* Conversation Stream (Naturally flowing inline, NOT inside an inner scrollable box) */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1">
              <span>Interactive Audit Stream</span>
            </div>

            {aiChatHistory.map((msg, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "p-3.5 rounded-2xl text-xs max-w-[88%] leading-relaxed space-y-2 transition-all shadow-sm",
                  msg.role === 'user' 
                    ? "ml-auto bg-indigo-600 text-white font-medium shadow-indigo-500/10" 
                    : "mr-auto bg-slate-950/80 text-slate-200 border border-slate-800/80 shadow-black/20"
                )}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                {msg.role === 'assistant' && (
                  <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-slate-800/80">
                    <button 
                      onClick={() => onOpenDraftTemplate('arrears')}
                      className="text-[10px] font-semibold text-indigo-300 hover:text-white bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 px-2.5 py-1 rounded-lg transition-colors flex items-center cursor-pointer"
                    >
                      <FileText className="h-3 w-3 mr-1.5" /> Draft Collection Notice
                    </button>
                    <button 
                      onClick={() => onOpenDraftTemplate('staff')}
                      className="text-[10px] font-semibold text-amber-300 hover:text-white bg-amber-950/60 hover:bg-amber-900 border border-amber-700/50 px-2.5 py-1 rounded-lg transition-colors flex items-center cursor-pointer"
                    >
                      <FileText className="h-3 w-3 mr-1.5" /> Staff Memo
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Live Loading Indicator */}
            {isAiAuditing && (
              <div className="mr-auto bg-slate-950/80 p-3.5 rounded-2xl text-xs text-indigo-300 border border-slate-800 flex items-center gap-2.5 animate-pulse">
                <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" />
                <span>Auditing operational databases & generating executive insights...</span>
              </div>
            )}

            {/* Scroll Anchor */}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        </div>

        {/* ─── 3. FIXED PROMPT INPUT BAR DOCKED TO BOTTOM (STICKY BOTTOM-0) ─── */}
        <footer className="shrink-0 sticky bottom-0 z-10 bg-slate-900/98 backdrop-blur-md border-t border-slate-800 p-4 space-y-3">
          {/* Horizontally scrollable prompt suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            {SUGGESTED_PROMPT_CHIPS.map((suggest, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSendQuery(suggest)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-indigo-200 hover:text-white transition-colors font-medium cursor-pointer shrink-0"
              >
                {suggest}
              </button>
            ))}
          </div>

          {/* AI Input Form */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ask Dr. GAM AI Auditor..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSendQuery();
                }
              }}
              className="text-xs bg-slate-950/90 border-slate-800 text-white placeholder:text-slate-500 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <Button 
              type="button"
              onClick={() => onSendQuery()}
              disabled={isAiAuditing || !aiPrompt.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs px-4 cursor-pointer shrink-0"
            >
              {isAiAuditing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Ask AI'}
            </Button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
            <span>Press Enter to send • 5 credits per deep query</span>
            <button 
              type="button"
              onClick={onClose}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Close Auditor
            </button>
          </div>
        </footer>
      </aside>
    </>
  );
}
