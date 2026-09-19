'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  FileText,
  AlertTriangle,
  PlayCircle,
  Award,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  onSnapshot
} from 'firebase/firestore';
import {
  SchoolAssignment,
  StudentAssignmentSubmission
} from '@/types/assignmentTypes';
import { startStudentAssignment } from '@/lib/services/assignmentService';

interface AssignedRemoteTaskBannerProps {
  schoolId: string;
  studentUid: string;
  studentName?: string;
  studentClass: string;
  studentClassId?: string;
}

export function AssignedRemoteTaskBanner({
  schoolId,
  studentUid,
  studentName,
  studentClass,
  studentClassId
}: AssignedRemoteTaskBannerProps) {
  const firestore = useFirestore();
  const router = useRouter();

  const [activeTasks, setActiveTasks] = useState<Array<{
    assignment: SchoolAssignment;
    submission?: StudentAssignmentSubmission;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [startingTaskId, setStartingTaskId] = useState<string | null>(null);

  // Subscribe to active assignments matching the student's class
  useEffect(() => {
    if (!firestore || !schoolId || !studentUid) return;

    const assignmentsCol = collection(firestore, 'schools', schoolId, 'assignments');
    const unsub = onSnapshot(assignmentsCol, async snapshot => {
      const now = new Date();
      const matched: Array<{ assignment: SchoolAssignment; submission?: StudentAssignmentSubmission }> = [];

      for (const docSnap of snapshot.docs) {
        const aData = { id: docSnap.id, ...(docSnap.data() as any) } as SchoolAssignment;

        // Check if due date is in the future
        let dueDate: Date | null = null;
        if (aData.dueDate) {
          dueDate = typeof aData.dueDate.toDate === 'function' ? aData.dueDate.toDate() : new Date(aData.dueDate);
        }

        const isFuture = !dueDate || dueDate > now;
        if (!isFuture) continue;

        // Check class match
        const aClass = (aData.targetClass || '').toLowerCase().trim();
        const sClass = (studentClass || '').toLowerCase().trim();
        const matchesClassId =
          !!(aData.targetClassId &&
          studentClassId &&
          (aData.targetClassId === studentClassId || aData.targetClassId === 'ALL_JHS'));

        const matchesClass =
          matchesClassId ||
          aClass === 'all_jhs' ||
          aClass === 'all classes' ||
          aClass === sClass ||
          sClass.includes(aClass) ||
          aClass.includes(sClass);

        if (!matchesClass) continue;

        // Check this student's submission document
        const subDocRef = doc(firestore, 'schools', schoolId, 'assignments', aData.id, 'submissions', studentUid);
        try {
          const subSnap = await getDoc(subDocRef);
          const subData = subSnap.exists() ? (subSnap.data() as StudentAssignmentSubmission) : undefined;

          // If not completed yet, it's an active pending task!
          if (!subData || subData.status !== 'completed') {
            matched.push({
              assignment: aData,
              submission: subData
            });
          }
        } catch (e) {
          // If subDoc doesn't exist yet, it's pending
          matched.push({ assignment: aData });
        }
      }

      setActiveTasks(matched);
      setLoading(false);
    });

    return () => unsub();
  }, [firestore, schoolId, studentUid, studentClass, studentClassId]);

  if (loading || activeTasks.length === 0) {
    return null;
  }

  // Focus on the first pending task
  const currentItem = activeTasks[0];
  const { assignment, submission } = currentItem;
  const isPaper1 = assignment.paperType === 1;

  // Calculate remaining countdown
  const getCountdownString = () => {
    if (!assignment.dueDate) return 'Due Soon';
    try {
      const due = typeof assignment.dueDate.toDate === 'function' ? assignment.dueDate.toDate() : new Date(assignment.dueDate);
      const diffMs = due.getTime() - Date.now();
      if (diffMs <= 0) return 'Due past';

      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      const remainingHours = diffHours % 24;

      if (diffDays > 0) {
        return diffDays + 'd ' + remainingHours + 'h remaining';
      }
      return diffHours + ' hours remaining';
    } catch {
      return 'Due this weekend';
    }
  };

  const handleStartTask = async () => {
    if (!firestore || startingTaskId) return;
    setStartingTaskId(assignment.id);

    try {
      // 1. Mark status as 'in_progress' and log startedAt
      await startStudentAssignment(
        firestore,
        schoolId,
        assignment.id,
        studentUid,
        studentName,
        studentClass
      );

      // 2. Route directly to the Senior Academy exam runner with assignment query params
      const examParam = assignment.examId || 'paper_2020_variant';
      const paperTypeParam = assignment.paperType || 2;
      const targetUrl = '/dashboard/senior-academy?tab=past-papers&examId=' + examParam + '&paperType=' + paperTypeParam + '&assignmentId=' + assignment.id;

      router.push(targetUrl);
    } catch (err) {
      console.error('[AssignedRemoteTaskBanner] Error starting task:', err);
      // Still route if network error
      const examParam = assignment.examId || 'paper_2020_variant';
      router.push('/dashboard/senior-academy?tab=past-papers&examId=' + examParam + '&paperType=' + assignment.paperType + '&assignmentId=' + assignment.id);
    } finally {
      setStartingTaskId(null);
    }
  };

  const isInProgress = submission?.status === 'in_progress';

  return (
    <div className="w-full mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
      <div
        className={cn(
          'relative overflow-hidden rounded-3xl p-5 sm:p-6 border backdrop-blur-xl transition-all shadow-2xl',
          isPaper1
            ? 'bg-gradient-to-r from-sky-950/90 via-slate-900/90 to-slate-950/90 border-sky-500/30 shadow-[0_0_25px_rgba(14,165,233,0.12)]'
            : 'bg-gradient-to-r from-amber-950/90 via-slate-900/90 to-slate-950/90 border-amber-500/30 shadow-[0_0_25px_rgba(245,158,11,0.12)]'
        )}
      >
        {/* Subtle Decorative Background Glow */}
        <div
          className={cn(
            'absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none',
            isPaper1 ? 'bg-sky-500' : 'bg-amber-500'
          )}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={cn(
                  'text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5',
                  isPaper1
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                )}
              >
                {isPaper1 ? 'Paper 1 Objective CBT' : 'Paper 2 Structured Theory'}
              </Badge>

              <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-[10px] flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>{getCountdownString()}</span>
              </Badge>

              {isInProgress && (
                <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/40 text-[10px] flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" />
                  <span>Session In Progress</span>
                </Badge>
              )}
            </div>

            {/* Title & Instructions */}
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Zap className={cn('w-4 h-4 shrink-0', isPaper1 ? 'text-sky-400' : 'text-amber-400')} />
              <span>{assignment.title}</span>
            </h3>

            {assignment.instructions && (
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {assignment.instructions}
              </p>
            )}

            <p className="text-[11px] text-slate-400">
              Assigned by <strong className="text-slate-200">{assignment.assignedByName || 'Director'}</strong> for{' '}
              <strong className="text-white">{assignment.targetClass}</strong>
            </p>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button
              onClick={handleStartTask}
              disabled={!!startingTaskId}
              className={cn(
                'w-full md:w-auto h-11 px-6 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer',
                isPaper1
                  ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30'
                  : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
              )}
            >
              {startingTaskId ? (
                <span>Launching...</span>
              ) : isInProgress ? (
                <>
                  <PlayCircle className="w-4 h-4" />
                  <span>Resume Assignment</span>
                </>
              ) : (
                <>
                  <span>Start Assignment</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
