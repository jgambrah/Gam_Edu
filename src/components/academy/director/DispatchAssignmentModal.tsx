'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Calendar,
  Clock,
  BookOpen,
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Radio,
  Layers,
  Search,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {
  PAST_PAPER_EXAM_OPTIONS,
  dispatchAssignment
} from '@/lib/services/assignmentService';
import confetti from 'canvas-confetti';

interface DispatchAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId: string;
  userUid: string;
  userName: string;
  initialExamId?: string;
  initialPaperType?: 1 | 2;
  onDispatched?: (assignmentId: string) => void;
}

export function DispatchAssignmentModal({
  isOpen,
  onClose,
  schoolId,
  userUid,
  userName,
  initialExamId,
  initialPaperType = 2,
  onDispatched
}: DispatchAssignmentModalProps) {
  const firestore = useFirestore();

  // Form states
  const [selectedPaperType, setSelectedPaperType] = useState<1 | 2>(initialPaperType);
  const [selectedExamId, setSelectedExamId] = useState<string>(initialExamId || 'paper_2020_variant');
  const [customTitle, setCustomTitle] = useState('');
  const [targetClass, setTargetClass] = useState('JHS 2');
  const [availableClasses, setAvailableClasses] = useState<string[]>(['JHS 1', 'JHS 2', 'JHS 3', 'ALL_JHS']);
  const [dueDateStr, setDueDateStr] = useState<string>(() => {
    // Default to upcoming Sunday 23:59
    const d = new Date();
    const day = d.getDay();
    const diff = (7 - day) % 7 || 7;
    d.setDate(d.getDate() + diff);
    d.setHours(23, 59, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [isTimed, setIsTimed] = useState(false);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(60);
  const [instructions, setInstructions] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync initial exam when modal opens
  useEffect(() => {
    if (initialExamId) {
      setSelectedExamId(initialExamId);
    }
    if (initialPaperType) {
      setSelectedPaperType(initialPaperType);
    }
  }, [initialExamId, initialPaperType, isOpen]);

  // Load school classes from Firestore
  useEffect(() => {
    if (!firestore || !schoolId) return;
    async function loadSchoolClasses() {
      try {
        const classesRef = collection(firestore!, 'classes');
        const q = query(classesRef, where('schoolId', '==', schoolId));
        const snap = await getDocs(q);
        const fetchedNames: string[] = [];
        snap.forEach(d => {
          const name = d.data()?.name;
          if (name && !fetchedNames.includes(name)) {
            fetchedNames.push(name);
          }
        });

        if (fetchedNames.length > 0) {
          const combined = Array.from(new Set([...fetchedNames, 'ALL_JHS']));
          setAvailableClasses(combined);
          if (!combined.includes(targetClass)) {
            setTargetClass(combined[0]);
          }
        }
      } catch (err) {
        console.warn('[DispatchModal] Could not fetch school classes:', err);
      }
    }
    loadSchoolClasses();
  }, [firestore, schoolId]);

  // Filter exam options based on paper type and search query
  const filteredExams = PAST_PAPER_EXAM_OPTIONS.filter(opt => {
    const matchesPaper = opt.paperType === selectedPaperType;
    const matchesQuery =
      searchFilter === '' ||
      opt.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      opt.badge.toLowerCase().includes(searchFilter.toLowerCase()) ||
      String(opt.year || '').includes(searchFilter);
    return matchesPaper && matchesQuery;
  });

  const activeSelectedExam = PAST_PAPER_EXAM_OPTIONS.find(o => o.id === selectedExamId) || filteredExams[0];

  // Auto-generate title when exam or class changes
  useEffect(() => {
    if (activeSelectedExam) {
      const typeLabel = selectedPaperType === 1 ? 'Paper 1 (CBT)' : 'Paper 2 (Theory)';
      setCustomTitle('Weekend Task: ' + activeSelectedExam.title.replace(' (Objective CBT)', '').replace(' Theory', '') + ' ' + typeLabel);
    }
  }, [selectedExamId, selectedPaperType, targetClass]);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const parsedDueDate = new Date(dueDateStr);
      if (isNaN(parsedDueDate.getTime())) {
        throw new Error('Please select a valid deadline date and time.');
      }

      const res = await dispatchAssignment(firestore, {
        schoolId: schoolId || 'demo-school',
        title: customTitle.trim() || 'Weekend Mathematics Past Paper Task',
        examId: selectedExamId,
        paperType: selectedPaperType,
        targetClass,
        dueDate: parsedDueDate,
        isTimed,
        timeLimitMinutes: Number(timeLimitMinutes) || 60,
        assignedByUid: userUid || 'director-1',
        assignedByName: userName || 'School Director',
        instructions: instructions.trim()
      });

      setSuccessMsg('Successfully dispatched to ' + res.totalAssigned + ' students in ' + targetClass + '!');
      
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}

      if (onDispatched) {
        onDispatched(res.assignmentId);
      }

      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 1500);

    } catch (err: any) {
      console.error('[DispatchAssignmentModal] Dispatch failed:', err);
      setErrorMsg(err.message || 'Failed to dispatch assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-[32px] bg-slate-900 border border-slate-800 shadow-2xl text-white">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-slate-900/95 border-b border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                Dispatch Remote Weekend Task
              </h2>
              <p className="text-xs text-slate-400">
                Assign Past Paper variants to class rosters with real-time live monitoring
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleDispatch} className="p-6 sm:p-8 space-y-6">
          {/* Notification Alerts */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5 animate-in shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. Paper Type Selector (Paper 1 CBT vs Paper 2 Theory) */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Select Examination Paper Format
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedPaperType(1);
                  const firstP1 = PAST_PAPER_EXAM_OPTIONS.find(o => o.paperType === 1);
                  if (firstP1) setSelectedExamId(firstP1.id);
                }}
                className={cn(
                  'p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2',
                  selectedPaperType === 1
                    ? 'bg-sky-500/10 border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)] ring-1 ring-sky-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                )}
              >
                <div className="flex items-center justify-between">
                  <Badge className={cn(
                    'text-[10px] font-bold px-2 py-0.5',
                    selectedPaperType === 1
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  )}>
                    Paper 1
                  </Badge>
                  <Radio className={cn('w-4 h-4', selectedPaperType === 1 ? 'text-sky-400' : 'text-slate-600')} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Objective CBT</h4>
                  <p className="text-[11px] text-slate-400">40 Multiple Choice Questions with Instant Scoring</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPaperType(2);
                  const firstP2 = PAST_PAPER_EXAM_OPTIONS.find(o => o.paperType === 2);
                  if (firstP2) setSelectedExamId(firstP2.id);
                }}
                className={cn(
                  'p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2',
                  selectedPaperType === 2
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                )}
              >
                <div className="flex items-center justify-between">
                  <Badge className={cn(
                    'text-[10px] font-bold px-2 py-0.5',
                    selectedPaperType === 2
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  )}>
                    Paper 2
                  </Badge>
                  <FileText className={cn('w-4 h-4', selectedPaperType === 2 ? 'text-amber-400' : 'text-slate-600')} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Structured Theory</h4>
                  <p className="text-[11px] text-slate-400">Step-by-Step Derivations & AI Marking Rubrics</p>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Exam Variant Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Select Past Paper Variant (BECE Math 2019–2025)
              </Label>
              <span className="text-[11px] text-slate-500">
                {filteredExams.length} variants available
              </span>
            </div>

            <div className="relative">
              <select
                value={selectedExamId}
                onChange={e => setSelectedExamId(e.target.value)}
                className="w-full h-11 px-4 pr-10 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-100 focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
              >
                {filteredExams.map(opt => (
                  <option key={opt.id} value={opt.id} className="bg-slate-900 text-white">
                    {opt.title} [{opt.badge}]
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* 3. Class Target & Deadline Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Class */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Target Class
              </Label>
              <div className="relative">
                <select
                  value={targetClass}
                  onChange={e => setTargetClass(e.target.value)}
                  className="w-full h-11 px-4 pr-10 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-100 focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
                >
                  {availableClasses.map(cls => (
                    <option key={cls} value={cls} className="bg-slate-900 text-white">
                      {cls === 'ALL_JHS' ? 'All JHS Classes (Whole School)' : cls}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Due Date & Time */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Due Date & Time Cutoff
              </Label>
              <Input
                type="datetime-local"
                value={dueDateStr}
                onChange={e => setDueDateStr(e.target.value)}
                className="h-11 rounded-2xl bg-slate-950 border-slate-800 text-xs font-mono text-slate-200 focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* 4. Assignment Title Customization */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              3. Assignment Display Title (Shown on Student Dashboard)
            </Label>
            <Input
              type="text"
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
              placeholder="e.g., Weekend Task: BECE 2020 Mathematics Paper 2 (Set 61)"
              className="h-11 rounded-2xl bg-slate-950 border-slate-800 text-xs font-medium text-slate-100 focus:border-amber-500"
              required
            />
          </div>

          {/* 5. Pedagogical Directives / Instructions (Optional) */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              4. Instructions / Teacher Notes (Optional)
            </Label>
            <Textarea
              value={instructions}
              onChange={e => setInstructions(e.target.value)}
              placeholder="e.g., Show all working formulas and intermediate algebraic steps clearly. AI Examiner will award partial marks for correct method."
              className="rounded-2xl min-h-[70px] bg-slate-950 border-slate-800 text-xs text-slate-200 focus:border-amber-500 placeholder:text-slate-600"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-slate-800 bg-slate-950 text-slate-400 hover:text-white text-xs rounded-xl px-5 h-11 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                'text-white font-bold text-xs rounded-xl px-6 h-11 shadow-lg transition-all flex items-center gap-2 cursor-pointer',
                selectedPaperType === 1
                  ? 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/30'
                  : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching to {targetClass}...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Dispatch Assignment to {targetClass}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
