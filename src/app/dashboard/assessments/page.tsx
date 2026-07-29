'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRole } from '@/context/role-context';
import { 
  ClipboardCheck, FilePlus, UserCog, Wand2, Loader2, ShieldAlert,
  Search, Calculator, Sparkles, BookOpen, AlertTriangle, CheckCircle2,
  XCircle, Play, Check, ChevronRight, X, Clock, HelpCircle, Heart,
  Shield, TrendingUp, Calendar, AlertCircle
} from 'lucide-react';
import { BehavioralRecordForm } from './behavioral-record-form';
import { AiQuizGenerator } from './ai-quiz-generator';
import { AssessmentFeedbackForm } from './assessment-feedback-form';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, orderBy, where, doc } from 'firebase/firestore';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { Assessment, BehavioralRecord, Student, Class } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentSchool } from '@/hooks/use-current-school';
import CreditBalance from '@/components/CreditBalance';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const toDateSafe = (d: any): Date => {
  if (!d) return new Date();
  if (typeof d.toDate === 'function') return d.toDate();
  if (d instanceof Date) return d;
  if (d.seconds) return new Date(d.seconds * 1000);
  return new Date(d);
};

export default function AssessmentsPage() {
    const { role, loading: roleLoading } = useRole();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const firestore = useFirestore();
    const { user } = useUser();

    // Dialog state controllers
    const [isGradesOpen, setIsGradesOpen] = useState(false);
    const [isBehaviorOpen, setIsBehaviorOpen] = useState(false);
    const [isAiOpen, setIsAiOpen] = useState(false);

    // Filter contexts
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [academicYear, setAcademicYear] = useState<string>('2025-2026');
    const [term, setTerm] = useState<string>('Third Term');

    const schoolSettingsRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
    const { data: schoolSettings } = useDoc<any>(schoolSettingsRef);

    useEffect(() => {
        if (schoolSettings) {
            const savedYear = schoolSettings.academicYear || schoolSettings.activeAcademicYear;
            const savedTerm = schoolSettings.term || schoolSettings.activeTerm || schoolSettings.currentTerm;
            if (savedYear) setAcademicYear(savedYear);
            if (savedTerm) setTerm(savedTerm);
        }
    }, [schoolSettings]);

    // Search query states
    const [assessmentSearch, setAssessmentSearch] = useState('');
    const [behaviorSearch, setBehaviorSearch] = useState('');

    // Detailed incident view dialog state
    const [selectedIncident, setSelectedIncident] = useState<BehavioralRecord | null>(null);

    const canAccess = role === 'Teacher' || role === 'Administrator' || role === 'Director';
    const isStaffRole = ['Teacher', 'Administrator', 'Director'].includes(role || '');

    // 1. Fetch assessments
    const assessmentsQuery = useMemoFirebase(
        () => (firestore && schoolId && isStaffRole) ? query(
            collection(firestore, 'assessments'), 
            where('schoolId', '==', schoolId),
            orderBy('assessmentDate', 'desc')
        ) : null, 
        [firestore, schoolId, isStaffRole]
    );
    const { data: assessments, isLoading: isLoadingAssessments, forceRefetch: forceRefetchAssessments } = useCollection<Assessment>(assessmentsQuery);

    // 2. Fetch behavioral incidents
    const recordsQuery = useMemoFirebase(() => 
        (firestore && schoolId && isStaffRole) ? query(
            collection(firestore, 'behavioral_records'), 
            where('schoolId', '==', schoolId),
            orderBy('date', 'desc')
        ) : null, 
        [firestore, schoolId, isStaffRole]
    );
    const { data: records, isLoading: isLoadingRecords, forceRefetch: forceRefetchRecords } = useCollection<BehavioralRecord>(recordsQuery);

    // 3. Fetch classes
    const classesQuery = useMemoFirebase(() => 
      (firestore && schoolId && isStaffRole) ? query(
          collection(firestore, 'classes'), 
          where('schoolId', '==', schoolId)
      ) : null, 
      [firestore, schoolId, isStaffRole]
    );
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

    // 4. Fetch subjects
    const subjectsQuery = useMemoFirebase(() => 
      (firestore && schoolId && isStaffRole) ? query(
          collection(firestore, 'subjects'), 
          where('schoolId', '==', schoolId)
      ) : null, 
      [firestore, schoolId, isStaffRole]
    );
    const { data: subjects, isLoading: isLoadingSubjects } = useCollection<any>(subjectsQuery);

    // 5. Fetch students roster
    const studentsQuery = useMemoFirebase(
        () => (firestore && schoolId && isStaffRole) ? query(
            collection(firestore, 'students'),
            where('schoolId', '==', schoolId)
        ) : null,
        [firestore, schoolId, isStaffRole]
    );
    const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);
    
    const studentMap = useMemo(() => {
        if (!students) return new Map<string, string>();
        return new Map(students.map(s => [s.uid, `${s.firstName} ${s.lastName}`]));
    }, [students]);

    const classMap = useMemo(() => {
        if (!classes) return new Map<string, string>();
        return new Map(classes.map(c => [c.id, c.name]));
    }, [classes]);

    const subjectMap = useMemo(() => {
        if (!subjects) return new Map<string, string>();
        return new Map(subjects.map(sub => [sub.id, sub.name]));
    }, [subjects]);

    const studentClassMap = useMemo(() => {
        if (!students || !classMap) return new Map<string, string>();
        return new Map(students.map(s => [s.uid, classMap.get(s.classId) || '']));
    }, [students, classMap]);

    // Active loading status
    const isLogsLoading = isLoadingAssessments || isLoadingRecords || isLoadingStudents || isLoadingClasses || isLoadingSubjects;

    // Filtered Assessments List
    const filteredAssessments = useMemo(() => {
        if (!assessments) return [];
        const search = (assessmentSearch || '').toLowerCase();
        return assessments.filter(item => {
            if (!item) return false;
            if ((item as any).isArchived === true) return false;
            const studentName = String(studentMap.get(item.studentId) || item.studentId || '');
            const className = String((item as any).className || classMap.get(item.classId) || studentClassMap.get(item.studentId) || '');
            const subjectName = String((item as any).subjectName || (item as any).subject || subjectMap.get(item.subjectId) || '');
            const assessmentName = String(item.assessmentName || '');
            const assessmentType = String(item.assessmentType || '');

            return search === '' ||
                studentName.toLowerCase().includes(search) ||
                className.toLowerCase().includes(search) ||
                subjectName.toLowerCase().includes(search) ||
                assessmentName.toLowerCase().includes(search) ||
                assessmentType.toLowerCase().includes(search);
        });
    }, [assessments, assessmentSearch, studentMap, classMap, subjectMap, studentClassMap]);

    // Filtered Behavior Records List
    const filteredBehavior = useMemo(() => {
        if (!records) return [];
        const search = (behaviorSearch || '').toLowerCase();
        return records.filter(item => {
            if (!item) return false;
            if ((item as any).isArchived === true) return false;
            const studentName = String(item.studentName || studentMap.get(item.studentId) || item.studentId || '');
            const incidentType = String(item.incidentType || '');
            const description = String(item.description || '');

            return search === '' ||
                studentName.toLowerCase().includes(search) ||
                incidentType.toLowerCase().includes(search) ||
                description.toLowerCase().includes(search);
        });
    }, [records, behaviorSearch, studentMap]);

    // Calculations of stats summary
    const stats = useMemo(() => {
        if (!assessments || !records) return { totalGraded: 0, totalIncidents: 0, highScores: 0, infractions: 0 };
        
        // Count of grades >= 80%
        const high = assessments.filter(a => {
            if (a.score === undefined || a.maxScore === undefined || a.maxScore === 0) return false;
            return (a.score / a.maxScore) >= 0.8;
        }).length;

        // Infractions counts
        const infractions = records.filter(r => r.incidentType === 'Infraction' || r.incidentType === 'Disciplinary Action').length;

        return {
            totalGraded: assessments.length,
            totalIncidents: records.length,
            highScores: high,
            infractions
        };
    }, [assessments, records]);

    if (roleLoading || schoolLoading) {
        return (
            <div className="flex justify-center p-20 flex-col gap-3 items-center">
                <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
                <p className="text-xs text-slate-400 font-semibold animate-pulse">Loading assessments center...</p>
            </div>
        );
    }

    if (!canAccess) {
        return (
            <div className="flex justify-center p-8">
                <Card className="max-w-md w-full border-red-150 bg-red-50/50 shadow-md">
                    <CardHeader className="text-center">
                        <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                            <ShieldAlert className="h-8 w-8 text-red-600" />
                        </div>
                        <CardTitle className="font-extrabold text-slate-800">Access Restricted</CardTitle>
                        <CardDescription>
                            Assessment logs and management tools are restricted to staff members.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 flex flex-col h-full">
            {/* Header banner */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 shadow-lg border border-purple-900/50">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <ClipboardCheck className="h-40 w-40 transform rotate-12 text-purple-300" />
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-500/20 p-2 rounded-xl border border-purple-500/30">
                      <ClipboardCheck className="h-6 w-6 text-purple-400" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Assessments & Records</h1>
                  </div>
                  <p className="text-slate-400 text-sm max-w-xl">
                    Log and track student grades, behavioral milestones, and build custom tests with AI utilities.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
                  <CreditBalance />
                </div>
              </div>
            </div>

            {/* Statistics Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Grades Recorded */}
              <Card className="border-slate-200/80 shadow-sm bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-purple-100 dark:bg-purple-950/40 p-2.5 rounded-xl text-purple-700 dark:text-purple-400">
                    <Calculator className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Grades Logged</p>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">{isLogsLoading ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : stats.totalGraded}</h3>
                  </div>
                </CardContent>
              </Card>

              {/* Behavior Notes */}
              <Card className="border-slate-200/80 shadow-sm bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-950/40 p-2.5 rounded-xl text-amber-700 dark:text-amber-400">
                    <UserCog className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Behavior Logs</p>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">{isLogsLoading ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : stats.totalIncidents}</h3>
                  </div>
                </CardContent>
              </Card>

              {/* High Score Ratios */}
              <Card className="border-slate-200/80 shadow-sm bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-emerald-100 dark:bg-emerald-950/40 p-2.5 rounded-xl text-emerald-700 dark:text-emerald-400">
                    <TrendingUp className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">High Score Ratios (80%+)</p>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">{isLogsLoading ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : stats.highScores}</h3>
                  </div>
                </CardContent>
              </Card>

              {/* Infractions Tracker */}
              <Card className="border-slate-200/80 shadow-sm bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="bg-red-100 dark:bg-red-950/40 p-2.5 rounded-xl text-red-700 dark:text-red-400">
                    <AlertTriangle className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Infractions Logged</p>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">{isLogsLoading ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : stats.infractions}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Record grades action */}
              <div 
                onClick={() => {
                  setSelectedClassId('');
                  setIsGradesOpen(true);
                }} 
                className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-5 rounded-2xl cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300 relative overflow-hidden group shadow-md"
              >
                <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none group-hover:scale-110 transition-transform">
                  <Calculator className="h-28 w-28" />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="bg-white/10 p-2.5 rounded-xl w-fit border border-white/20">
                    <Calculator className="h-5.5 w-5.5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base">Record Class Grades</h3>
                    <p className="text-indigo-100 text-xs">Batch log quiz, assignment, and midterm results.</p>
                  </div>
                </div>
              </div>

              {/* Behavioral incident action */}
              <div 
                onClick={() => setIsBehaviorOpen(true)} 
                className="bg-gradient-to-br from-amber-500 to-orange-500 text-white p-5 rounded-2xl cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300 relative overflow-hidden group shadow-md"
              >
                <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none group-hover:scale-110 transition-transform">
                  <UserCog className="h-28 w-28" />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="bg-white/10 p-2.5 rounded-xl w-fit border border-white/20">
                    <UserCog className="h-5.5 w-5.5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base">Behavioral Incidents</h3>
                    <p className="text-amber-100 text-xs">Record student infractions, positive behaviors, or notes.</p>
                  </div>
                </div>
              </div>

              {/* AI Quiz Generator action */}
              <div 
                onClick={() => setIsAiOpen(true)} 
                className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-5 rounded-2xl cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300 relative overflow-hidden group shadow-md"
              >
                <div className="absolute -right-4 -bottom-4 opacity-15 pointer-events-none group-hover:scale-110 transition-transform">
                  <Wand2 className="h-28 w-28" />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="bg-white/10 p-2.5 rounded-xl w-fit border border-white/20">
                    <Wand2 className="h-5.5 w-5.5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base">Generate AI Quiz</h3>
                    <p className="text-blue-100 text-xs">Create custom multiple choice tests using AI (-10 Credits).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Tabs Container */}
            <Card className="border-slate-200/80 shadow-sm dark:border-slate-800 bg-white dark:bg-slate-950">
              <Tabs defaultValue="assessments" className="w-full p-6">
                <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-slate-100/80 dark:bg-slate-900 rounded-xl p-1 mb-6">
                  <TabsTrigger value="assessments" className="rounded-lg font-bold text-xs md:text-sm py-2">
                    <Calculator className="h-4 w-4 mr-1.5" /> Gradebook Log ({filteredAssessments.length})
                  </TabsTrigger>
                  <TabsTrigger value="behavior" className="rounded-lg font-bold text-xs md:text-sm py-2">
                    <UserCog className="h-4 w-4 mr-1.5" /> Behavioral Log ({filteredBehavior.length})
                  </TabsTrigger>
                </TabsList>

                    {/* TAB 1: Assessments Log */}
                    <TabsContent value="assessments" className="space-y-4 focus:outline-none">
                        <div className="flex items-center gap-3 max-w-md">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input 
                                    placeholder="Search student, class, subject, or assessment..."
                                    value={assessmentSearch}
                                    onChange={(e) => setAssessmentSearch(e.target.value)}
                                    className="pl-9 border-slate-200 focus:border-purple-500 rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="border rounded-2xl overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50 dark:bg-slate-900">
                                    <TableRow>
                                        <TableHead className="font-extrabold">Date</TableHead>
                                        <TableHead className="font-extrabold">Student</TableHead>
                                        <TableHead className="font-extrabold">Class</TableHead>
                                        <TableHead className="font-extrabold">Subject</TableHead>
                                        <TableHead className="font-extrabold">Assessment Name</TableHead>
                                        <TableHead className="font-extrabold">Category</TableHead>
                                        <TableHead className="font-extrabold text-right">Score</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLogsLoading ? Array.from({ length: 3 }).map((_, i) => (
                                        <TableRow key={`skl-assess-${i}`}>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                                            <TableCell className="text-right"><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                                        </TableRow>
                                    )) : filteredAssessments.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-12 text-slate-400 italic text-xs">
                                                <Calculator className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                                                No assessment log entries found matching criteria.
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredAssessments.map((item) => {
                                        const assessmentDate = toDateSafe(item.assessmentDate);
                                        const studentName = studentMap.get(item.studentId) || item.studentId;
                                        const className = (item as any).className || classMap.get(item.classId) || studentClassMap.get(item.studentId) || '—';
                                        const subjectName = (item as any).subjectName || (item as any).subject || subjectMap.get(item.subjectId) || '—';
                                        const percentage = item.score !== undefined && item.maxScore ? (item.score / item.maxScore) * 100 : 0;
                                        
                                        // Score highlighting logic
                                        let scoreColor = "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200";
                                        if (percentage >= 80) scoreColor = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200";
                                        else if (percentage >= 50) scoreColor = "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200";
                                        
                                        return (
                                            <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                                                <TableCell className="text-xs font-semibold text-slate-600 dark:text-slate-400">{format(assessmentDate, 'PPP')}</TableCell>
                                                <TableCell className="font-bold text-slate-800 dark:text-slate-200">{studentName}</TableCell>
                                                <TableCell className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                                    <Badge variant="outline" className="bg-slate-50 text-slate-700 dark:bg-slate-900 border-slate-200">
                                                        {className}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200/60 font-bold">
                                                        {subjectName}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs font-semibold text-slate-700 dark:text-slate-300">{item.assessmentName}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-600 dark:bg-slate-900 border-slate-200">
                                                        {item.assessmentType}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {item.score !== undefined && item.maxScore !== undefined ? (
                                                        <Badge className={cn("font-mono text-xs font-bold px-2 py-0.5 border shadow-sm", scoreColor)}>
                                                            {item.score}/{item.maxScore}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-slate-400 italic text-xs">N/A</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                {/* TAB 2: Behavioral Incident Logs */}
                <TabsContent value="behavior" className="space-y-4 focus:outline-none">
                  <div className="flex items-center gap-3 max-w-md">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Search student or description..."
                        value={behaviorSearch}
                        onChange={(e) => setBehaviorSearch(e.target.value)}
                        className="pl-9 border-slate-200 focus:border-purple-500 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="border rounded-2xl overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader className="bg-slate-50 dark:bg-slate-900">
                        <TableRow>
                          <TableHead className="font-extrabold">Date</TableHead>
                          <TableHead className="font-extrabold">Student</TableHead>
                          <TableHead className="font-extrabold">Incident Type</TableHead>
                          <TableHead className="font-extrabold">Description</TableHead>
                          <TableHead className="font-extrabold text-right">Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLogsLoading ? Array.from({ length: 3 }).map((_, i) => (
                          <TableRow key={`skl-behavior-${i}`}>
                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-6 w-6 ml-auto rounded-full" /></TableCell>
                          </TableRow>
                        )) : filteredBehavior.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-slate-400 italic text-xs">
                              <UserCog className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                              No behavioral incidents registered yet.
                            </TableCell>
                          </TableRow>
                        ) : filteredBehavior.map((item) => {
                          const incidentDate = toDateSafe(item.date);
                          const studentName = item.studentName || studentMap.get(item.studentId) || item.studentId;

                          // Color-coded incident type badge
                          let typeColor = "bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 border-blue-200";
                          if (item.incidentType === 'Infraction' || item.incidentType === 'Disciplinary Action') {
                            typeColor = "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 border-red-200 animate-pulse";
                          } else if (item.incidentType === 'Positive Behavior') {
                            typeColor = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-200";
                          } else if (item.incidentType === 'Counseling Note') {
                            typeColor = "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-200";
                          }

                          return (
                            <TableRow key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                              <TableCell className="text-xs font-semibold text-slate-600 dark:text-slate-400">{format(incidentDate, 'PPP')}</TableCell>
                              <TableCell className="font-bold text-slate-800 dark:text-slate-200">{studentName}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-wider border shadow-sm px-2.5 py-0.5", typeColor)}>
                                  {item.incidentType}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-slate-500 max-w-sm truncate leading-relaxed">
                                {item.description}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => setSelectedIncident(item)}
                                  className="h-8 w-8 rounded-full"
                                  title="View full notes"
                                >
                                  <ChevronRight className="h-4 w-4 text-slate-400" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Modal Dialog for Recording Grades */}
            <Dialog open={isGradesOpen} onOpenChange={setIsGradesOpen}>
              <DialogContent className="sm:max-w-[720px] h-[85vh] flex flex-col p-6 rounded-2xl">
                <DialogHeader className="shrink-0 border-b pb-4">
                  <DialogTitle className="text-xl font-black flex items-center gap-2">
                    <Calculator className="text-violet-600 h-5 w-5" />
                    Record Class Grades
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Select class, academic parameters, and enter student continuous assessment scores.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto pt-4 pr-1">
                  {!selectedClassId ? (
                    <div className="space-y-5 py-4 max-w-md mx-auto">
                      <div className="space-y-2">
                        <Label className="text-slate-700 font-bold dark:text-slate-300">Select Class</Label>
                        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                          <SelectTrigger className="border-slate-200 focus:border-violet-500 focus:ring-violet-500/20 rounded-xl">
                            <SelectValue placeholder="Select Class..." />
                          </SelectTrigger>
                          <SelectContent>
                            {classes?.map(c => (
                              <SelectItem key={c.id} value={c.id} className="cursor-pointer">{c.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-bold">Academic Year</Label>
                          <Select value={academicYear} onValueChange={setAcademicYear} disabled={role === 'Teacher'}>
                            <SelectTrigger className="border-slate-200"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {MOCK_ACADEMIC_YEARS.map(year => (
                                <SelectItem key={year} value={year}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-700 font-bold">Term</Label>
                          <Select value={term} onValueChange={setTerm} disabled={role === 'Teacher'}>
                            <SelectTrigger className="border-slate-200"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {MOCK_TERMS.map(t => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 border p-3 rounded-xl">
                        <div className="text-xs">
                          Class: <strong className="text-slate-700 dark:text-slate-200">{classes?.find(c => c.id === selectedClassId)?.name}</strong> | Term: <strong className="text-slate-700 dark:text-slate-200">{term}</strong>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => setSelectedClassId('')} className="text-xs text-purple-600 font-bold h-7 py-0">Change Class</Button>
                      </div>
                      
                      <AssessmentFeedbackForm 
                        classId={selectedClassId}
                        classes={classes || []}
                        academicYear={academicYear}
                        term={term}
                        onSuccess={() => {
                          setIsGradesOpen(false);
                          setSelectedClassId('');
                          forceRefetchAssessments();
                        }}
                      />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Modal Dialog for Incident logs */}
            <Dialog open={isBehaviorOpen} onOpenChange={setIsBehaviorOpen}>
              <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-6 rounded-2xl">
                <DialogHeader className="shrink-0 border-b pb-4">
                  <DialogTitle className="text-xl font-black flex items-center gap-2">
                    <UserCog className="text-amber-500 h-5 w-5" />
                    Log Behavioral Incident
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Document student achievements, infractions, or counseling reminders.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto pt-4 pr-1">
                  <BehavioralRecordForm />
                </div>
                <DialogFooter className="shrink-0 border-t pt-3 mt-2">
                  <Button variant="outline" onClick={() => {
                    setIsBehaviorOpen(false);
                    forceRefetchRecords();
                  }} className="w-full font-bold">Close Dialog</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Modal Dialog for AI Quiz Generator */}
            <Dialog open={isAiOpen} onOpenChange={setIsAiOpen}>
              <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-6 rounded-2xl">
                <DialogHeader className="shrink-0 border-b pb-4">
                  <DialogTitle className="text-xl font-black flex items-center gap-2">
                    <Wand2 className="text-blue-500 h-5 w-5" />
                    AI-Powered Quiz Generator
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500">
                    Use Gemini to generate diagnostic tests and assign them to a class.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto pt-4 pr-1">
                  <AiQuizGenerator />
                </div>
                <DialogFooter className="shrink-0 border-t pt-3 mt-2">
                  <Button variant="outline" onClick={() => setIsAiOpen(false)} className="w-full font-bold">Close Dialog</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Behavioral Incident Detail Dialog */}
            <Dialog open={!!selectedIncident} onOpenChange={(open) => { if(!open) setSelectedIncident(null); }}>
              <DialogContent className="sm:max-w-[500px] rounded-2xl p-6">
                {selectedIncident && (
                  <div className="space-y-4">
                    <DialogHeader className="border-b pb-3">
                      <DialogTitle className="text-base font-black flex items-center justify-between">
                        <span>Incident Log Details</span>
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-black uppercase tracking-wider px-2 py-0.5",
                          selectedIncident.incidentType === 'Infraction' || selectedIncident.incidentType === 'Disciplinary Action'
                            ? "bg-red-50 text-red-700 border-red-200"
                            : selectedIncident.incidentType === 'Positive Behavior'
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                        )}>
                          {selectedIncident.incidentType}
                        </Badge>
                      </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-3.5 text-sm leading-relaxed">
                      <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Student</p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200">{selectedIncident.studentName || studentMap.get(selectedIncident.studentId) || selectedIncident.studentId}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Date of Incident</p>
                          <p className="font-semibold text-slate-700 dark:text-slate-300">{format(toDateSafe(selectedIncident.date), 'PPP')}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-[10px] text-slate-400 font-bold uppercase">Description of Event</Label>
                        <div className="p-3.5 border rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs md:text-sm whitespace-pre-wrap leading-relaxed shadow-inner font-medium">
                          {selectedIncident.description}
                        </div>
                      </div>

                      {selectedIncident.actionTaken && (
                        <div className="space-y-1">
                          <Label className="text-[10px] text-slate-400 font-bold uppercase">Action Taken</Label>
                          <div className="p-3 border rounded-xl bg-slate-50/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 text-xs leading-relaxed italic">
                            {selectedIncident.actionTaken}
                          </div>
                        </div>
                      )}
                    </div>

                    <DialogFooter className="pt-3 border-t">
                      <Button onClick={() => setSelectedIncident(null)} className="w-full font-bold">Done</Button>
                    </DialogFooter>
                  </div>
                )}
              </DialogContent>
            </Dialog>

        </div>
    );
}
