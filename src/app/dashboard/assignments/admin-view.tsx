'use client';

import { useState, useEffect, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Assignment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AssignmentSubmissionsList } from './assignment-submissions-list';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Badge } from '@/components/ui/badge';
import { Layers, GraduationCap, CheckCircle, ClipboardCheck, HelpCircle } from 'lucide-react';

export default function AdminAssignmentsView() {
  const firestore = useFirestore();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const assignmentsQuery = useMemoFirebase(
    () => (firestore && schoolId) ? query(collection(firestore, 'assignments'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]
  );
  const { data: assignments, isLoading: isLoadingAssignments } = useCollection<Assignment>(assignmentsQuery);

  const sortedAssignments = useMemo(() => {
    if (!assignments) return [];
    return [...assignments].sort((a, b) => (b.createdAt?.toDate?.()?.getTime() || 0) - (a.createdAt?.toDate?.()?.getTime() || 0));
  }, [assignments]);

  const isLoading = isLoadingSchool || isLoadingAssignments;
  const activeAssignmentsCount = assignments?.length || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6">
      
      {/* Premium Gradient Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-700 via-indigo-650 to-violet-800 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 text-indigo-200 shrink-0">
                <ClipboardCheck className="h-6 w-6 text-white" />
              </span>
              <Badge className="bg-white/15 text-white font-extrabold uppercase text-[10px] border-none px-2.5 py-0.5 rounded-full tracking-widest">
                Curriculum Overview
              </Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight uppercase italic">Global Assignments Registry</h1>
            <p className="text-slate-200 text-sm font-medium mt-1 max-w-xl">
              Monitor course tasks, student submission states, and grading metrics across all grade cohorts.
            </p>
          </div>
        </div>
      </div>

      {/* Stats KPI Counter Deck */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Assignments</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Layers className="h-4 w-4" /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800 font-mono leading-none">{activeAssignmentsCount}</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Active catalog courses</p>
          </div>
        </Card>

        <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Submission Rate</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle className="h-4 w-4" /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800 font-mono leading-none">94%</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Timely response averages</p>
          </div>
        </Card>

        <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl p-5 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Course Average Grade</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><GraduationCap className="h-4 w-4" /></div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-800 font-mono leading-none">83%</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Class evaluation index</p>
          </div>
        </Card>
      </div>

      {/* Submissions List Card */}
      <Card className="border border-slate-100 bg-white/70 backdrop-blur-sm shadow-sm rounded-2xl overflow-hidden p-6">
        <div className="mb-4">
          <h2 className="text-base font-extrabold text-slate-800 uppercase tracking-tight">Active Academic Assignments</h2>
          <p className="text-slate-400 text-xs font-medium">Read-only dashboard panel displaying submissions roster across the institution.</p>
        </div>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full rounded-2xl" />
              <Skeleton className="h-24 w-full rounded-2xl" />
            </div>
          ) : sortedAssignments && sortedAssignments.length > 0 ? (
            <div className="space-y-4">
              {sortedAssignments.map((assignment) => (
                <AssignmentSubmissionsList key={assignment.id} assignment={assignment} readOnly />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50/50 border border-dashed rounded-2xl">
              <HelpCircle className="h-12 w-12 text-slate-350 mx-auto mb-3 stroke-[1.2]" />
              <p className="text-xs font-bold uppercase text-slate-400">No active assignments located in database</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
