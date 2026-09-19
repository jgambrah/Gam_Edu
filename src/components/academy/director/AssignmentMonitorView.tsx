'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Eye,
  Bell,
  RefreshCw,
  Sparkles,
  Award,
  ChevronRight,
  ChevronDown,
  FileText,
  Calendar,
  Send,
  X,
  PlayCircle,
  Trash2,
  Loader2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import {
  SchoolAssignment,
  StudentAssignmentSubmission
} from '@/types/assignmentTypes';
import {
  subscribeToAssignmentSubmissions,
  subscribeToSchoolAssignments,
  nudgeStudent,
  deleteSchoolAssignment,
  resyncAssignmentRoster
} from '@/lib/services/assignmentService';
import { MathRenderer } from '@/components/curriculum/MathRenderer';

interface AssignmentMonitorViewProps {
  schoolId: string;
  userRole?: string;
  initialAssignmentId?: string;
  onOpenDispatchModal?: () => void;
  onBack?: () => void;
}

export function AssignmentMonitorView({
  schoolId,
  userRole = 'Director',
  initialAssignmentId,
  onOpenDispatchModal,
  onBack
}: AssignmentMonitorViewProps) {
  const firestore = useFirestore();

  const [assignments, setAssignments] = useState<SchoolAssignment[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(initialAssignmentId || '');
  const [submissions, setSubmissions] = useState<StudentAssignmentSubmission[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmissionForReport, setSelectedSubmissionForReport] = useState<StudentAssignmentSubmission | null>(null);
  const [nudgedStudents, setNudgedStudents] = useState<Record<string, boolean>>({});

  const [isDeleting, setIsDeleting] = useState(false);
  const [isResyncing, setIsResyncing] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 1. Subscribe to all assignments for this school
  useEffect(() => {
    if (!firestore || !schoolId) return;
    const unsub = subscribeToSchoolAssignments(firestore, schoolId, list => {
      setAssignments(list);
      if (!selectedAssignmentId && list.length > 0) {
        setSelectedAssignmentId(list[0].id);
      } else if (selectedAssignmentId && !list.some(a => a.id === selectedAssignmentId) && list.length > 0) {
        setSelectedAssignmentId(list[0].id);
      }
    });
    return () => unsub();
  }, [firestore, schoolId, selectedAssignmentId]);

  // 2. Real-time subscription to submissions of selected assignment
  useEffect(() => {
    if (!firestore || !schoolId || !selectedAssignmentId) return;
    const unsub = subscribeToAssignmentSubmissions(firestore, schoolId, selectedAssignmentId, list => {
      setSubmissions(list);
    });
    return () => unsub();
  }, [firestore, schoolId, selectedAssignmentId]);

  const activeAssignment = assignments.find(a => a.id === selectedAssignmentId) || assignments[0];

  // Check if current assignment contains legacy demo students
  const hasDemoStudents = useMemo(() => {
    return submissions.some(
      s =>
        s.studentUid.startsWith('demo_') ||
        s.studentUid.startsWith('demo_std_') ||
        s.studentName === 'Kwame Mensah' ||
        s.studentName === 'Abena Osei' ||
        s.studentName === 'Kofi Boateng' ||
        s.studentName === 'Akosua Frimpong' ||
        s.studentName === 'Yaw Addo'
    );
  }, [submissions]);

  // Metrics calculations
  const totalEnrolled = submissions.length || activeAssignment?.totalAssigned || 0;
  const completedList = submissions.filter(s => s.status === 'completed');
  const inProgressList = submissions.filter(s => s.status === 'in_progress');
  const notStartedList = submissions.filter(s => s.status === 'not_started');

  const completedCount = completedList.length;
  const inProgressCount = inProgressList.length;
  const notStartedCount = notStartedList.length;
  const completionPercentage = totalEnrolled > 0 ? Math.round((completedCount / totalEnrolled) * 100) : 0;

  // Filtered roster
  const filteredSubmissions = submissions.filter(s => {
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentClass.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle Nudge student
  const handleNudge = async (studentUid: string) => {
    if (!firestore || !schoolId || !selectedAssignmentId) return;
    try {
      await nudgeStudent(firestore, schoolId, selectedAssignmentId, studentUid);
      setNudgedStudents(prev => ({ ...prev, [studentUid]: true }));
    } catch (e) {
      console.warn('Nudge error:', e);
    }
  };

  // Handle Resync Live Roster
  const handleResyncRoster = async () => {
    if (!firestore || !schoolId || !activeAssignment || isResyncing) return;
    setIsResyncing(true);
    setActionNotice(null);
    try {
      const res = await resyncAssignmentRoster(
        firestore,
        schoolId,
        activeAssignment.id,
        activeAssignment.targetClass,
        activeAssignment.targetClassId
      );
      setActionNotice({
        type: 'success',
        message: `Roster synced! ${res.totalSynced} live students enrolled. (Removed ${res.removedDemoCount} demo records, added ${res.addedCount} real students).`
      });
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        message: err.message || 'Failed to sync live roster. Please verify student enrollment in this class.'
      });
    } finally {
      setIsResyncing(false);
    }
  };

  // Handle Delete Assignment
  const handleDeleteAssignment = async () => {
    if (!firestore || !schoolId || !activeAssignment || isDeleting) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${activeAssignment.title}"? This will permanently remove the assignment and all associated student submissions.`
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    setActionNotice(null);
    try {
      await deleteSchoolAssignment(firestore, schoolId, activeAssignment.id);
      setSelectedAssignmentId('');
      setActionNotice({
        type: 'success',
        message: 'Assignment successfully deleted.'
      });
    } catch (err: any) {
      setActionNotice({
        type: 'error',
        message: err.message || 'Failed to delete assignment.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Format timestamps
  const formatTimestamp = (ts: any) => {
    if (!ts) return '-';
    try {
      const date = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
      if (isNaN(date.getTime())) return '-';
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
    } catch {
      return '-';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Assignment Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-[28px] bg-slate-900/90 border border-slate-800 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider">
              Live Progress Monitor
            </Badge>
            {activeAssignment && (
              <Badge className={cn(
                'text-[10px] font-bold uppercase tracking-wider',
                activeAssignment.paperType === 1
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              )}>
                {activeAssignment.paperType === 1 ? 'Paper 1 (CBT)' : 'Paper 2 (Theory)'}
              </Badge>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {activeAssignment?.title || 'Assignment Progress & Gradebook'}
          </h2>
          <p className="text-xs text-slate-400">
            Target Class: <strong className="text-white">{activeAssignment?.targetClass || 'All'}</strong> | Due:{' '}
            <strong className="text-amber-300">{formatTimestamp(activeAssignment?.dueDate)}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Assignment Dropdown */}
          {assignments.length > 1 && (
            <div className="relative flex-1 md:w-64">
              <select
                value={selectedAssignmentId}
                onChange={e => setSelectedAssignmentId(e.target.value)}
                className="w-full h-10 px-3 pr-8 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200 focus:outline-none focus:border-amber-500 appearance-none cursor-pointer"
              >
                {assignments.map(a => (
                  <option key={a.id} value={a.id} className="bg-slate-900 text-white">
                    {a.title} ({a.targetClass})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
            </div>
          )}

          {activeAssignment && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResyncRoster}
                disabled={isResyncing}
                title="Refresh live student list from school database"
                className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs h-10 rounded-xl px-3 flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={cn('w-3.5 h-3.5', isResyncing && 'animate-spin')} />
                <span className="hidden sm:inline">Sync Live Roster</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteAssignment}
                disabled={isDeleting}
                title="Delete this assignment and submissions"
                className="border-rose-900/60 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 text-xs h-10 rounded-xl px-3 flex items-center gap-1.5 cursor-pointer"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">Delete Task</span>
              </Button>
            </div>
          )}

          {onOpenDispatchModal && (
            <Button
              onClick={onOpenDispatchModal}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl px-4 h-10 shadow-lg shadow-amber-600/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch New Task</span>
            </Button>
          )}
        </div>
      </div>

      {/* Action Notification */}
      {actionNotice && (
        <div
          className={cn(
            'p-4 rounded-2xl text-xs flex items-center justify-between gap-3 animate-in fade-in',
            actionNotice.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
          )}
        >
          <div className="flex items-center gap-2">
            {actionNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-semibold">{actionNotice.message}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Warning Banner: Legacy Demo Students Detected */}
      {hasDemoStudents && activeAssignment && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-amber-500/5 animate-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white text-sm">Demo Placeholder Students Detected</p>
              <p className="text-amber-200/80 mt-0.5 leading-relaxed">
                This assignment currently contains mock placeholder records (such as Kwame Mensah, Abena Osei).
                Click <strong>&quot;Sync Live Class Roster&quot;</strong> to purge them and pull your real enrolled students for{' '}
                <strong className="text-white">{activeAssignment.targetClass}</strong>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <Button
              size="sm"
              onClick={handleResyncRoster}
              disabled={isResyncing}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl px-4 h-9 shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              {isResyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>Sync Live Class Roster</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDeleteAssignment}
              disabled={isDeleting}
              className="border-rose-800/60 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs rounded-xl px-3 h-9 cursor-pointer"
            >
              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              <span>Delete</span>
            </Button>
          </div>
        </div>
      )}

      {/* Real-time Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Enrolled */}
        <Card className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Roster</span>
            <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-white">{totalEnrolled}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Live students in {activeAssignment?.targetClass || 'class'}</span>
          </div>
        </Card>

        {/* Metric 2: Completed / Submitted */}
        <Card className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-emerald-400">{completedCount}</span>
            <span className="text-xs text-slate-400 block mt-0.5">{completionPercentage}% submitted & scored</span>
          </div>
        </Card>

        {/* Metric 3: In Progress (Active Session) */}
        <Card className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">In Progress</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Clock className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-sky-400">{inProgressCount}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Currently taking paper</span>
          </div>
        </Card>

        {/* Metric 4: Not Started (Pending) */}
        <Card className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Not Started</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-amber-400">{notStartedCount}</span>
            <span className="text-xs text-slate-400 block mt-0.5">Pending student start</span>
          </div>
        </Card>
      </div>

      {/* Cohort Progress Bar */}
      <Card className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300">Cohort Completion Rate</span>
          <span className="font-mono font-bold text-white">
            {completedCount} / {totalEnrolled} ({completionPercentage}%)
          </span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden flex">
          <div
            style={{ width: `${totalEnrolled > 0 ? (completedCount / totalEnrolled) * 100 : 0}%` }}
            className="bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
          />
          <div
            style={{ width: `${totalEnrolled > 0 ? (inProgressCount / totalEnrolled) * 100 : 0}%` }}
            className="bg-sky-500 transition-all duration-500"
          />
        </div>
        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Completed
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" /> In Progress
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" /> Not Started
          </span>
        </div>
      </Card>

      {/* Live Student Submission Roster Table */}
      <Card className="rounded-[28px] bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
        {/* Table Filters & Search */}
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              type="text"
              placeholder="Search student by name or class..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-10 pl-9 rounded-xl bg-slate-950 border-slate-800 text-xs text-white focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {(['all', 'not_started', 'in_progress', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
                  filterStatus === tab
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                )}
              >
                {tab === 'all'
                  ? `All (${submissions.length})`
                  : tab === 'not_started'
                  ? `Not Started (${notStartedCount})`
                  : tab === 'in_progress'
                  ? `In Progress (${inProgressCount})`
                  : `Completed (${completedCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-5">Student</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Start Time</th>
                <th className="py-3.5 px-4">Submission Time</th>
                <th className="py-3.5 px-4">Score</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold">No student records match the current filter.</p>
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map(sub => {
                  const isNudged = nudgedStudents[sub.studentUid] || !!sub.nudgedAt;
                  const isDemo = sub.studentUid.startsWith('demo_');

                  return (
                    <tr key={sub.studentUid} className="hover:bg-slate-800/30 transition-colors">
                      {/* Student Info */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-xs">
                            {sub.studentName.charAt(0) || 'S'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white">{sub.studentName}</span>
                              {isDemo && (
                                <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] px-1 py-0">
                                  Demo
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="font-mono">UID: {sub.studentUid.slice(0, 10)}...</span>
                              <span>•</span>
                              <span>{sub.studentClass}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {sub.status === 'completed' ? (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px]">
                            Completed
                          </Badge>
                        ) : sub.status === 'in_progress' ? (
                          <Badge className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-[10px] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block animate-pulse" />
                            In Progress
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-800 text-slate-400 border border-slate-700 text-[10px]">
                            Not Started
                          </Badge>
                        )}
                      </td>

                      {/* Start Time */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                        {formatTimestamp(sub.startedAt)}
                      </td>

                      {/* Submitted Time */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-300">
                        {formatTimestamp(sub.submittedAt)}
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4">
                        {sub.status === 'completed' && sub.score !== null ? (
                          <div className="flex items-center gap-2">
                            <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs">
                              {sub.score} / {sub.maxScore}
                            </Badge>
                            <span className="text-[11px] font-mono text-slate-400">
                              ({sub.percentage}%)
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">Pending submission</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {sub.status === 'completed' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedSubmissionForReport(sub)}
                              className="h-8 px-3 rounded-lg border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Eye className="w-3 h-3 text-amber-400" />
                              <span>View Report</span>
                            </Button>
                          ) : sub.status === 'not_started' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleNudge(sub.studentUid)}
                              disabled={isNudged}
                              className={cn(
                                'h-8 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors',
                                isNudged
                                  ? 'border-emerald-800/40 bg-emerald-950/40 text-emerald-400 opacity-80 cursor-default'
                                  : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300'
                              )}
                            >
                              <Bell className="w-3 h-3 text-amber-400" />
                              <span>{isNudged ? 'Nudged' : 'Nudge'}</span>
                            </Button>
                          ) : (
                            <span className="text-[11px] text-sky-400 font-semibold italic">Session Active</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Item-Level Evaluation & AI Rubric Report Dialog */}
      {selectedSubmissionForReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[32px] bg-slate-900 border border-slate-800 shadow-2xl text-white p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] mb-2">
                  Student Evaluation Report
                </Badge>
                <h3 className="text-xl font-black text-white">
                  {selectedSubmissionForReport.studentName}
                </h3>
                <p className="text-xs text-slate-400">
                  Class: <strong className="text-white">{selectedSubmissionForReport.studentClass}</strong> | Final Score:{' '}
                  <strong className="text-amber-400 font-mono">
                    {selectedSubmissionForReport.score} / {selectedSubmissionForReport.maxScore} ({selectedSubmissionForReport.percentage}%)
                  </strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedSubmissionForReport(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI Graded Breakdown (Paper 2) */}
            {selectedSubmissionForReport.aiGradedResults && selectedSubmissionForReport.aiGradedResults.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  AI Chief Examiner Marking Scheme Breakdown
                </h4>
                <div className="space-y-4">
                  {selectedSubmissionForReport.aiGradedResults.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">
                          Question {item.questionNumber} - Part {item.subId || item.partLabel || '(a)'}
                        </span>
                        <Badge className="bg-sky-500/20 text-sky-300 border border-sky-500/40 text-xs font-mono">
                          Awarded: {item.awardedMarks} / {item.maxMarks} Marks
                        </Badge>
                      </div>

                      {item.prompt && (
                        <div className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                          <MathRenderer content={item.prompt} />
                        </div>
                      )}

                      {/* Student Submitted Answer */}
                      {item.studentText && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Student Derivation:</span>
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200">
                            {item.studentText}
                          </div>
                        </div>
                      )}

                      {/* Step Method/Accuracy Marks Breakdown */}
                      {item.breakdown && item.breakdown.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-slate-500">Marks Distribution:</span>
                          <div className="space-y-1">
                            {item.breakdown.map((step, sIdx) => (
                              <div key={sIdx} className="text-xs flex items-start justify-between gap-2 p-2 rounded-lg bg-slate-900/40 border border-slate-800/40">
                                <span className="text-slate-300">{step.step}</span>
                                <span className="text-amber-400 font-mono font-semibold whitespace-nowrap">
                                  {step.awarded} / {step.max}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Constructive Examiner Feedback */}
                      {item.feedback && (
                        <div className="p-2.5 rounded-xl bg-sky-950/40 border border-sky-800/30 text-xs text-sky-300">
                          <strong className="text-sky-400 block mb-0.5">Examiner Note:</strong>
                          {item.feedback}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs bg-slate-950 rounded-2xl border border-slate-800">
                <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p>Objective CBT Submission: Total score {selectedSubmissionForReport.score} of {selectedSubmissionForReport.maxScore} questions ({selectedSubmissionForReport.percentage}%).</p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                onClick={() => setSelectedSubmissionForReport(null)}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl px-6 h-10 cursor-pointer"
              >
                Close Report
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
