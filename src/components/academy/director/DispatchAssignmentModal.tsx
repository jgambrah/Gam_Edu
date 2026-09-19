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
  Loader2,
  Filter,
  GraduationCap,
  Microscope,
  Languages,
  Laptop,
  Calculator,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { dispatchAssignment } from '@/lib/services/assignmentService';
import {
  COMPREHENSIVE_QUESTION_CATALOG,
  SUBJECT_CATEGORIES,
  GRADE_TIERS
} from '@/lib/data/curriculumCatalog';
import { AssignmentExamOption } from '@/types/assignmentTypes';
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

  // Search Engine & Filter states
  const [allExams, setAllExams] = useState<AssignmentExamOption[]>(COMPREHENSIVE_QUESTION_CATALOG);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All Subjects');
  const [selectedPaperTypeFilter, setSelectedPaperTypeFilter] = useState<'all' | 1 | 2>('all');
  const [selectedGradeTier, setSelectedGradeTier] = useState<string>('All Levels');
  const [selectedExamId, setSelectedExamId] = useState<string>(initialExamId || 'paper_2025_variant');
  const [selectedPaperType, setSelectedPaperType] = useState<1 | 2>(initialPaperType);

  // Form states
  const [customTitle, setCustomTitle] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('ALL_JHS');
  const [classList, setClassList] = useState<SchoolClassOption[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);
  const [isLoadingCustomQuestions, setIsLoadingCustomQuestions] = useState(false);
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync initial exam when modal opens
  useEffect(() => {
    if (initialExamId) {
      setSelectedExamId(initialExamId);
      const matched = allExams.find(e => e.id === initialExamId);
      if (matched) {
        setSelectedPaperType(matched.paperType);
      }
    }
    if (initialPaperType) {
      setSelectedPaperType(initialPaperType);
    }
  }, [initialExamId, initialPaperType, isOpen, allExams]);

  // Dynamically fetch any custom question sets or online curriculum from Firestore
  useEffect(() => {
    if (!firestore || !isOpen) return;

    let isMounted = true;
    async function loadFirestoreQuestions() {
      setIsLoadingCustomQuestions(true);
      try {
        const customList: AssignmentExamOption[] = [];

        // Check global_curriculum collection or questions
        try {
          const globalRef = collection(firestore!, 'global_curriculum');
          const globalSnap = await getDocs(globalRef);
          globalSnap.forEach(d => {
            const data = d.data();
            if (data.title && !customList.some(c => c.id === d.id)) {
              customList.push({
                id: d.id,
                title: data.title,
                year: data.year ? Number(data.year) : undefined,
                paperType: (data.paperType === 1 ? 1 : 2) as 1 | 2,
                subject: data.subject || 'Mathematics',
                badge: 'Custom Curriculum',
                gradeTier: data.gradeTier || 'Junior High (JHS)',
                questionCount: data.questions?.length || data.totalQuestions || 10,
                topic: data.topic || data.title,
                description: data.description || 'Custom shared curriculum set from school database.'
              });
            }
          });
        } catch {
          // ignore if collection is secured or empty
        }

        // Check school-specific question sets
        if (schoolId) {
          try {
            const schoolQuestionsRef = collection(firestore!, 'schools', schoolId, 'question_sets');
            const schoolSnap = await getDocs(schoolQuestionsRef);
            schoolSnap.forEach(d => {
              const data = d.data();
              if (data.title && !customList.some(c => c.id === d.id)) {
                customList.push({
                  id: d.id,
                  title: data.title,
                  year: data.year ? Number(data.year) : undefined,
                  paperType: (data.paperType === 1 ? 1 : 2) as 1 | 2,
                  subject: data.subject || 'Mathematics',
                  badge: 'School Custom Set',
                  gradeTier: data.gradeTier || 'Junior High (JHS)',
                  questionCount: data.questions?.length || data.totalQuestions || 10,
                  topic: data.topic || data.title,
                  description: data.description || 'Custom school repository question set.'
                });
              }
            });
          } catch {
            // ignore if not configured
          }
        }

        if (isMounted && customList.length > 0) {
          // Merge with built-in comprehensive catalog, avoiding duplicates
          const seen = new Set(COMPREHENSIVE_QUESTION_CATALOG.map(c => c.id));
          const additions = customList.filter(c => !seen.has(c.id));
          if (additions.length > 0) {
            setAllExams([...COMPREHENSIVE_QUESTION_CATALOG, ...additions]);
          }
        }
      } catch (err) {
        console.warn('[DispatchModal] Could not fetch remote question sets:', err);
      } finally {
        if (isMounted) setIsLoadingCustomQuestions(false);
      }
    }

    loadFirestoreQuestions();

    return () => {
      isMounted = false;
    };
  }, [firestore, schoolId, isOpen]);

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

        // Sort classes logically
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
          // Default to JHS 2 if available, or first option
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

  // Search Engine Filter Logic
  const filteredExams = useMemo(() => {
    return allExams.filter(opt => {
      // 1. Subject filter
      if (selectedSubject !== 'All Subjects' && opt.subject !== selectedSubject) {
        return false;
      }

      // 2. Paper type filter
      if (selectedPaperTypeFilter !== 'all' && opt.paperType !== selectedPaperTypeFilter) {
        return false;
      }

      // 3. Grade tier filter
      if (selectedGradeTier !== 'All Levels') {
        const tier = (opt.gradeTier || '').toLowerCase();
        if (selectedGradeTier === 'Junior High (JHS)' && !tier.includes('jhs') && !tier.includes('junior')) {
          return false;
        }
        if (
          selectedGradeTier === 'Upper Primary (BS 4 - 6)' &&
          !tier.includes('upper primary') &&
          !tier.includes('bs 4') &&
          !tier.includes('bs 5') &&
          !tier.includes('bs 6')
        ) {
          return false;
        }
        if (
          selectedGradeTier === 'Lower Primary (BS 1 - 3)' &&
          !tier.includes('lower primary') &&
          !tier.includes('bs 1') &&
          !tier.includes('bs 2') &&
          !tier.includes('bs 3')
        ) {
          return false;
        }
        if (selectedGradeTier === 'Senior High (SHS)' && !tier.includes('shs') && !tier.includes('senior')) {
          return false;
        }
      }

      // 4. Multi-field Text Search Query
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchTitle = opt.title.toLowerCase().includes(q);
      const matchTopic = (opt.topic || '').toLowerCase().includes(q);
      const matchSubject = opt.subject.toLowerCase().includes(q);
      const matchBadge = (opt.badge || '').toLowerCase().includes(q);
      const matchDesc = (opt.description || '').toLowerCase().includes(q);
      const matchYear = String(opt.year || '').includes(q);
      const matchSet = opt.setNumber ? ('set ' + opt.setNumber).includes(q) || String(opt.setNumber) === q : false;

      return matchTitle || matchTopic || matchSubject || matchBadge || matchDesc || matchYear || matchSet;
    });
  }, [allExams, selectedSubject, selectedPaperTypeFilter, selectedGradeTier, searchQuery]);

  // Find currently selected exam
  const activeSelectedExam = useMemo(() => {
    return allExams.find(o => o.id === selectedExamId) || filteredExams[0] || allExams[0];
  }, [allExams, selectedExamId, filteredExams]);

  // Auto-generate title when selected exam changes
  useEffect(() => {
    if (activeSelectedExam) {
      const typeLabel = activeSelectedExam.paperType === 1 ? 'Paper 1 (CBT)' : 'Paper 2 (Theory)';
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

      setCustomTitle('Weekend Task: ' + cleanExamTitle + ' ' + typeLabel);
      setSelectedPaperType(activeSelectedExam.paperType);
    }
  }, [activeSelectedExam]);

  // Helper icon for subjects
  const getSubjectIcon = (sub: string) => {
    switch (sub) {
      case 'Integrated Science':
        return <Microscope className="w-3.5 h-3.5 text-purple-400" />;
      case 'English Language':
        return <Languages className="w-3.5 h-3.5 text-pink-400" />;
      case 'Computing':
        return <Laptop className="w-3.5 h-3.5 text-amber-400" />;
      case 'Mathematics':
      default:
        return <Calculator className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  // Helper color for subjects
  const getSubjectBadgeStyle = (sub: string) => {
    switch (sub) {
      case 'Integrated Science':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'English Language':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/40';
      case 'Computing':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Mathematics':
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  // Handle Dispatch Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !schoolId || isSubmitting) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    if (!activeSelectedExam) {
      setErrorMsg('Please select a question set or past exam variant to dispatch.');
      return;
    }

    if (!activeClassOption) {
      setErrorMsg('Please select a target class.');
      return;
    }

    if (activeClassOption.studentCount === 0) {
      setErrorMsg(
        'Cannot dispatch: No active students are currently enrolled in "' + activeClassOption.name + '". Please ensure students are registered in this class first.'
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
        'Assignment successfully dispatched to ' + res.totalAssigned + ' active students in ' + res.targetClassName + '!'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 space-y-6 text-slate-100">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider px-2 py-0.5">
                Senior Academy
              </Badge>
              <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px] font-bold">
                Assignment Dispatcher & Universal Search
              </Badge>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Dispatch Assignment to Class
            </h2>
            <p className="text-xs text-slate-400">
              Search and select from 100+ past exam variants, topical mastery sets, and curriculum questions across all subjects.
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ========================================================================= */}
          {/* SECTION 1: QUESTION SEARCH ENGINE & CURRICULUM CATALOG */}
          {/* ========================================================================= */}
          <div className="space-y-3.5 p-4 sm:p-5 rounded-3xl bg-slate-950/70 border border-slate-800/80 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-amber-400" />
                <Label className="text-xs font-black uppercase tracking-wider text-slate-300">
                  1. Search & Select Question Set or Past Exam Variant
                </Label>
              </div>
              <div className="flex items-center gap-2">
                {isLoadingCustomQuestions && (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-amber-400" /> Syncing questions...
                  </span>
                )}
                <Badge className="bg-slate-800 text-amber-400 border-slate-700 text-[10px] font-mono">
                  {filteredExams.length} Available
                </Badge>
              </div>
            </div>

            {/* Instant Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search by year (e.g. 2024), set (e.g. Set 60), topic (e.g. Algebra, Vectors, Newton), or subject..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-11 pl-10 pr-9 rounded-2xl bg-slate-900 border-slate-700/80 text-xs font-medium text-white placeholder:text-slate-500 focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Subject Filter Chips & Format Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {/* Subject Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                {SUBJECT_CATEGORIES.map(sub => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubject(sub)}
                    className={cn(
                      'px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5',
                      selectedSubject === sub
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                    )}
                  >
                    {sub !== 'All Subjects' && getSubjectIcon(sub)}
                    <span>{sub}</span>
                  </button>
                ))}
              </div>

              {/* Format Filter Toggles (Paper 1 vs Paper 2 vs All) */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedPaperTypeFilter('all')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer',
                    selectedPaperTypeFilter === 'all'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  All Formats
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaperTypeFilter(1)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1',
                    selectedPaperTypeFilter === 1
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  <Radio className="w-3 h-3 text-sky-400" />
                  <span>Paper 1 (CBT)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPaperTypeFilter(2)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1',
                    selectedPaperTypeFilter === 2
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  <FileText className="w-3 h-3 text-amber-400" />
                  <span>Paper 2 (Theory)</span>
                </button>
              </div>
            </div>

            {/* Grade Tier Pills */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tier:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {GRADE_TIERS.map(tier => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setSelectedGradeTier(tier)}
                    className={cn(
                      'px-2.5 py-0.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer whitespace-nowrap',
                      selectedGradeTier === tier
                        ? 'bg-slate-800 text-white font-bold border border-slate-700'
                        : 'text-slate-400 hover:text-slate-300'
                    )}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Results Catalog Grid */}
            <div className="space-y-2 pt-2">
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {filteredExams.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800/80 space-y-2">
                    <Search className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-xs font-semibold text-slate-300">
                      No questions found matching &quot;{searchQuery}&quot;
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Try searching with fewer filters or by year (e.g. &apos;2024&apos;), subject (e.g. &apos;Science&apos;), or set number (e.g. &apos;Set 60&apos;).
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedSubject('All Subjects');
                        setSelectedPaperTypeFilter('all');
                        setSelectedGradeTier('All Levels');
                      }}
                      className="mt-2 text-xs border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                ) : (
                  filteredExams.map(opt => {
                    const isSelected = selectedExamId === opt.id;
                    const isP1 = opt.paperType === 1;

                    return (
                      <div
                        key={opt.id}
                        onClick={() => {
                          setSelectedExamId(opt.id);
                          setSelectedPaperType(opt.paperType);
                        }}
                        className={cn(
                          'p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 group',
                          isSelected
                            ? isP1
                              ? 'bg-sky-500/15 border-sky-500/80 shadow-[0_0_15px_rgba(14,165,233,0.15)] ring-1 ring-sky-500/50'
                              : 'bg-amber-500/15 border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/50'
                            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                        )}
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          {/* Top Badges */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <Badge className={cn('text-[9px] font-bold px-2 py-0', getSubjectBadgeStyle(opt.subject))}>
                              {opt.subject}
                            </Badge>

                            <Badge
                              className={cn(
                                'text-[9px] font-bold px-2 py-0',
                                isP1
                                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              )}
                            >
                              {isP1 ? 'Paper 1 CBT' : 'Paper 2 Theory'}
                            </Badge>

                            {opt.questionCount && (
                              <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[9px] px-1.5 py-0">
                                {opt.questionCount} {isP1 ? 'MCQs' : 'Problems'}
                              </Badge>
                            )}

                            {opt.gradeTier && (
                              <span className="text-[10px] text-slate-500 font-medium">
                                • {opt.gradeTier}
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                            {opt.title}
                          </h4>

                          {/* Description / Topics snippet */}
                          {opt.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                              {opt.description}
                            </p>
                          )}
                        </div>

                        {/* Selection Checkmark */}
                        <div className="shrink-0 pt-1">
                          <div
                            className={cn(
                              'w-5 h-5 rounded-full flex items-center justify-center border transition-all',
                              isSelected
                                ? isP1
                                  ? 'bg-sky-500 border-sky-400 text-slate-950'
                                  : 'bg-amber-500 border-amber-400 text-slate-950'
                                : 'border-slate-700 bg-slate-800/40'
                            )}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Currently Selected Summary Pill */}
            {activeSelectedExam && (
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="text-slate-400 shrink-0">Selected Exam:</span>
                  <span className="font-bold text-white truncate">{activeSelectedExam.title}</span>
                </div>
                <Badge
                  className={cn(
                    'text-[10px] shrink-0',
                    activeSelectedExam.paperType === 1
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  )}
                >
                  {activeSelectedExam.paperType === 1 ? 'Objective CBT' : 'Structured Theory'}
                </Badge>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: CLASS TARGET & DEADLINE GRID */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Class with Live Enrollment Count */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" /> 2. Target Class
                </Label>
                {isLoadingClasses ? (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-amber-400" /> Counting students...
                  </span>
                ) : activeClassOption ? (
                  <span
                    className={cn(
                      'text-[10px] font-bold',
                      activeClassOption.studentCount > 0 ? 'text-emerald-400' : 'text-rose-400'
                    )}
                  >
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
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Due Date & Time Cutoff
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

          {/* ========================================================================= */}
          {/* SECTION 3: ASSIGNMENT TITLE & INSTRUCTIONS */}
          {/* ========================================================================= */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              3. Assignment Display Title (Shown on Student Dashboard)
            </Label>
            <Input
              type="text"
              value={customTitle}
              onChange={e => setCustomTitle(e.target.value)}
              placeholder="e.g., Weekend Task: 2024 BECE Integrated Science Paper 2"
              className="h-11 rounded-2xl bg-slate-950 border-slate-800 text-xs font-medium text-slate-100 focus:border-amber-500"
              required
            />
          </div>

          {/* Instructions (Optional) */}
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
              disabled={isSubmitting || activeClassOption?.studentCount === 0}
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
