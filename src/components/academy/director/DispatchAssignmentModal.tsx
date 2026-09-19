'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

interface SchoolClassOption {
  id: string;
  name: string;
  gradeLevel?: string;
  studentCount: number;
}

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
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL_JHS');
  const [classList, setClassList] = useState<SchoolClassOption[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
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

  // Load real school classes and compute live student enrollment count
  useEffect(() => {
    if (!firestore || !schoolId || !isOpen) return;

    let isMounted = true;
    async function loadSchoolClassesAndCounts() {
      setIsLoadingClasses(true);
      try {
        // 1. Fetch classes
        const classesRef = collection(firestore!, 'classes');
        const classSnap = await getDocs(query(classesRef, where('schoolId', '==', schoolId)));
        const rawClasses: Array<{ id: string; name: string; gradeLevel?: string }> = [];
        classSnap.forEach(d => {
          const data = d.data();
          rawClasses.push({
            id: d.id,
            name: data.name || 'Unnamed Class',
            gradeLevel: data.gradeLevel
          });
        });

        // 2. Fetch students to count active live students per class
        const studentsRef = collection(firestore!, 'students');
        const studentSnap = await getDocs(query(studentsRef, where('schoolId', '==', schoolId)));

        const countsByClassId: Record<string, number> = {};
        const countsByClassName: Record<string, number> = {};
        let totalJhsStudents = 0;
        let totalSchoolStudents = 0;

        studentSnap.forEach(docSnap => {
          const s = docSnap.data();
          const rawStatus = String(s.enrollmentStatus || s.status || 'Active').toLowerCase();
          if (rawStatus === 'inactive' || rawStatus === 'graduated' || rawStatus === 'withdrawn' || rawStatus === 'suspended') {
            return;
          }

          totalSchoolStudents++;

          const cId = String(s.classId || '').trim();
          const cName = String(s.className || s.class || '').trim().toLowerCase();

          if (cId) {
            countsByClassId[cId] = (countsByClassId[cId] || 0) + 1;
          }
          if (cName) {
            countsByClassName[cName] = (countsByClassName[cName] || 0) + 1;
          }

          // Check if this student is in JHS
          const clsDoc = rawClasses.find(c => c.id === cId);
          const gradeText = (clsDoc?.gradeLevel || clsDoc?.name || cName || '').toLowerCase();
          if (
            gradeText.includes('jhs') ||
            gradeText.includes('bs 7') ||
            gradeText.includes('bs 8') ||
            gradeText.includes('bs 9')
          ) {
            totalJhsStudents++;
          }
        });

        const formattedOptions: SchoolClassOption[] = rawClasses.map(cls => {
          const count =
            countsByClassId[cls.id] ||
            countsByClassName[cls.name.toLowerCase().trim()] ||
            0;
          return {
            id: cls.id,
            name: cls.name,
            gradeLevel: cls.gradeLevel,
            studentCount: count
          };
        });

        // Sort classes logically (JHS 1, 2, 3 first, or alphabetical)
        formattedOptions.sort((a, b) => a.name.localeCompare(b.name));

        // Add whole-cohort aggregate option
        const jhsOption: SchoolClassOption = {
          id: 'ALL_JHS',
          name: 'All JHS Classes (Whole Cohort)',
          studentCount: totalJhsStudents > 0 ? totalJhsStudents : totalSchoolStudents
        };

        const finalClassOptions = [jhsOption, ...formattedOptions];

        if (isMounted) {
          setClassList(finalClassOptions);
          // Default to JHS 2 if available, or the first option with students
          const jhs2Match = finalClassOptions.find(
            c => c.id !== 'ALL_JHS' && (c.name.toLowerCase().includes('jhs 2') || c.name.toLowerCase().includes('bs 8'))
          );
          if (jhs2Match) {
            setSelectedClassId(jhs2Match.id);
          } else {
            setSelectedClassId(finalClassOptions[0]?.id || 'ALL_JHS');
          }
        }
      } catch (err) {
        console.warn('[DispatchModal] Could not fetch school classes:', err);
      } finally {
        if (isMounted) setIsLoadingClasses(false);
      }
    }

    loadSchoolClassesAndCounts();

    return () => {
      isMounted = false;
    };
  }, [firestore, schoolId, isOpen]);

  // Find currently selected class option
  const activeClassOption = useMemo(() => {
    return classList.find(c => c.id === selectedClassId) || classList[0];
  }, [classList, selectedClassId]);

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
      const cleanExamTitle = activeSelectedExam.title
        .replace(' (Objective CBT)', '')
        .replace(' Theory', '')
        .replace(' (Set 65)', '')
        .replace(' (Set 60)', '')
        .replace(' (Set 61)', '')
        .replace(' (Set 62)', '')
        .replace(' (Set 63)', '')
        .replace(' (Set 64)', '')
        .replace(' (Set 67)', '')
        .replace(' (Set 66)', '');

      setCustomTitle(`Weekend Task: ${cleanExamTitle} ${typeLabel}`);
    }
  }, [activeSelectedExam, selectedPaperType, selectedClassId]);

  // Handle Dispatch Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !schoolId || isSubmitting) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    if (!activeSelectedExam) {
      setErrorMsg('Please select a past paper variant to dispatch.');
      return;
    }

    if (!activeClassOption) {
      setErrorMsg('Please select a target class.');
      return;
    }

    if (activeClassOption.studentCount === 0) {
      setErrorMsg(
        `Cannot dispatch: No active students are currently enrolled in "${activeClassOption.name}". Please ensure students are registered in this class first.`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const parsedDueDate = new Date(dueDateStr);
      if (isNaN(parsedDueDate.getTime())) {
        throw new Error('Please enter a valid submission cutoff date and time.');
      }

      const res = await dispatchAssignment(firestore, {
        schoolId,
        title: customTitle.trim() || activeSelectedExam.title,
        examId: activeSelectedExam.id,
        paperType: selectedPaperType,
        targetClass: activeClassOption.name,
        targetClassId: activeClassOption.id,
        dueDate: parsedDueDate,
        isTimed,
        timeLimitMinutes: Number(timeLimitMinutes) || 60,
        assignedByUid: userUid,
        assignedByName: userName || 'Director',
        instructions: instructions.trim()
      });

      setSuccessMsg(
        `Assignment successfully dispatched to ${res.totalAssigned} active students in ${res.targetClassName}!`
      );

      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // confetti fallback
      }

      if (onDispatched) {
        onDispatched(res.assignmentId);
      }

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error('[DispatchModal] Dispatch error:', err);
      setErrorMsg(err.message || 'Failed to dispatch assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider px-2 py-0.5">
                Senior Academy
              </Badge>
              <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px] font-bold">
                Assignment Dispatcher
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Dispatch Past Paper Assignment
            </h2>
            <p className="text-xs text-slate-400">
              Assign Paper 1 (Objective) or Paper 2 (Theory) past exams directly to your school&apos;s live student roster.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Dispatch Notice</p>
              <p className="text-[11px] text-rose-300/90 leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="font-bold">{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Paper Type Selection Toggle */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Choose Paper Format
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
            {/* Target Class with Live Enrollment Count */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Target Class
                </Label>
                {isLoadingClasses ? (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Counting students...
                  </span>
                ) : activeClassOption ? (
                  <span className={cn(
                    'text-[10px] font-bold',
                    activeClassOption.studentCount > 0 ? 'text-emerald-400' : 'text-rose-400'
                  )}>
                    {activeClassOption.studentCount} live students
                  </span>
                ) : null}
              </div>

              <div className="relative">
                <select
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  className="w-full h-11 px-4 pr-10 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-100 focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
                >
                  {classList.map(cls => (
                    <option key={cls.id} value={cls.id} className="bg-slate-900 text-white">
                      {cls.name} ({cls.studentCount} enrolled students)
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
              </div>

              {activeClassOption && activeClassOption.studentCount === 0 && !isLoadingClasses && (
                <p className="text-[11px] text-rose-400/90 leading-tight">
                  ⚠️ No active students are currently enrolled in this class. Please assign students in Students directory.
                </p>
              )}
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
              placeholder="e.g., Weekend Task: BECE 2020 Mathematics Paper 2"
              className="h-11 rounded-2xl bg-slate-950 border-slate-800 text-xs font-medium text-slate-100 focus:border-amber-500"
              required
            />
          </div>

          {/* 5. Instructions (Optional) */}
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
              disabled={isSubmitting || (activeClassOption?.studentCount === 0)}
              className={cn(
                'text-white font-bold text-xs rounded-xl px-6 h-11 shadow-lg transition-all flex items-center gap-2 cursor-pointer',
                selectedPaperType === 1
                  ? 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/30 disabled:bg-slate-800 disabled:text-slate-600'
                  : 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30 disabled:bg-slate-800 disabled:text-slate-600'
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Dispatching to {activeClassOption?.name || 'Class'}...</span>
                </>
              ) : activeClassOption?.studentCount === 0 ? (
                <span>Class Has 0 Enrolled Students</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    Dispatch to {activeClassOption?.name || 'Class'} ({activeClassOption?.studentCount || 0} Students)
                  </span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
