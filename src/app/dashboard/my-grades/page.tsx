'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, orderBy, limit, documentId } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, TrendingUp, BookOpen, User as UserIcon, Calendar, History, Sparkles, X, Info, AlertCircle, Award, ChevronRight, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { Assessment, Student, Subject } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const toDateSafe = (d: any): Date => {
    if (!d) return new Date();
    if (d instanceof Date) return d;
    if (d.toDate && typeof d.toDate === 'function') return d.toDate();
    if (d.seconds) return new Date(d.seconds * 1000);
    return new Date(d);
};

export default function MyGradesPage() {
    const { user } = useUser();
    const { role, profile } = useRole();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const firestore = useFirestore();

    // View State
    const [viewMode, setViewMode] = useState<'recent' | 'history'>('recent');
    const [selectedYear, setSelectedYear] = useState(MOCK_ACADEMIC_YEARS[MOCK_ACADEMIC_YEARS.length - 1]);
    const [selectedTerm, setSelectedTerm] = useState(MOCK_TERMS[0] || 'First Term');
    const [selectedChildId, setSelectedChildId] = useState<string>('');

    const parentStudentIds = useMemo(() => {
        const ids = profile?.studentIds || profile?.students || profile?.childrenIds || profile?.linkedStudentIds || [];
        // Cap at 30 to respect Firestore 'in' query limits
        return ids.slice(0, 30);
    }, [profile]);
    const parentStudentIdsStr = parentStudentIds.join(',');

    const activeChildId = useMemo(() => {
        if (role === 'Student') return user?.uid || '';
        return selectedChildId || parentStudentIds[0] || '';
    }, [role, user?.uid, selectedChildId, parentStudentIds]);

    const assessmentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !role || !activeChildId) return null;
        
        const baseQuery = collection(firestore, 'assessments');
        
        // --- RECENT MODE: Last 20 items across any period ---
        if (viewMode === 'recent') {
            return query(
                baseQuery,
                where('schoolId', '==', schoolId),
                where('studentId', '==', activeChildId),
                orderBy('createdAt', 'desc'),
                limit(20)
            );
        }
        
        // --- HISTORY MODE: Filtered by specific year and term ---
        return query(
            baseQuery,
            where('schoolId', '==', schoolId),
            where('studentId', '==', activeChildId),
            where('academicYear', '==', selectedYear),
            where('term', '==', selectedTerm),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, schoolId, role, activeChildId, selectedYear, selectedTerm, viewMode]);

    const { data: assessments, isLoading: loadingAssessments } = useCollection<Assessment>(assessmentsQuery);

    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !role) return null;
        if (role === 'Student' && user) {
            return query(
                collection(firestore, 'students'), 
                where('schoolId', '==', schoolId), 
                where('uid', '==', user.uid)
            );
        }
        if (role === 'Parent' && parentStudentIds.length > 0) {
            return query(
                collection(firestore, 'students'),
                where('schoolId', '==', schoolId),
                where(documentId(), 'in', parentStudentIds)
            );
        }
        return null;
    }, [firestore, schoolId, parentStudentIdsStr, role, user?.uid]);

    const { data: students } = useCollection<Student>(studentsQuery);

    const activeChild = useMemo(() => {
        if (!students || !activeChildId) return null;
        return students.find(s => s.id === activeChildId || s.uid === activeChildId) || null;
    }, [students, activeChildId]);

    const activeClassId = activeChild?.classId || '';

    const subjectsQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]);

    const { data: subjects } = useCollection<Subject>(subjectsQuery);

    const classAssessmentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !activeClassId) return null;
        return query(
            collection(firestore, 'assessments'),
            where('schoolId', '==', schoolId),
            where('classId', '==', activeClassId),
            limit(250)
        );
    }, [firestore, schoolId, activeClassId]);
    
    const { data: classAssessments } = useCollection<Assessment>(classAssessmentsQuery);

    const classAssessmentAverages = useMemo(() => {
        if (!classAssessments) return {};
        const averages: Record<string, { totalPct: number; count: number }> = {};
        classAssessments.forEach((a: any) => {
            const score = Number(a.score) || 0;
            const max = Number(a.maxScore) || 100;
            if (max > 0) {
                const pct = (score / max) * 100;
                // Key by subjectId and assessmentName
                const key = `${a.subjectId}_${(a.assessmentName || '').toLowerCase().trim()}`;
                if (!averages[key]) {
                    averages[key] = { totalPct: 0, count: 0 };
                }
                averages[key].totalPct += pct;
                averages[key].count++;
            }
        });
        const result: Record<string, number> = {};
        Object.entries(averages).forEach(([key, data]) => {
            result[key] = Math.round(data.totalPct / data.count);
        });
        return result;
    }, [classAssessments]);

    const classSubjectAverages = useMemo(() => {
        if (!classAssessments) return {};
        const averages: Record<string, { totalPct: number; count: number }> = {};
        classAssessments.forEach((a: any) => {
            const score = Number(a.score) || 0;
            const max = Number(a.maxScore) || 100;
            if (max > 0) {
                const pct = (score / max) * 100;
                const sub = subjects?.find((s: any) => s.id === a.subjectId);
                const subName = sub?.name || a.subjectName || 'Other';
                if (!averages[subName]) {
                    averages[subName] = { totalPct: 0, count: 0 };
                }
                averages[subName].totalPct += pct;
                averages[subName].count++;
            }
        });
        const result: Record<string, number> = {};
        Object.entries(averages).forEach(([name, data]) => {
            result[name] = Math.round(data.totalPct / data.count);
        });
        return result;
    }, [classAssessments, subjects]);

    const subjectAverages = useMemo(() => {
        if (!assessments) return [];
        const averages: Record<string, { totalPct: number; count: number; name: string }> = {};
        assessments.forEach((a: any) => {
            const score = Number(a.score) || 0;
            const max = Number(a.maxScore) || 100;
            if (max > 0) {
                const pct = (score / max) * 100;
                const sub = subjects?.find((s: any) => s.id === a.subjectId);
                const subName = sub?.name || a.subjectName || 'Other';
                if (!averages[subName]) {
                    averages[subName] = { totalPct: 0, count: 0, name: subName };
                }
                averages[subName].totalPct += pct;
                averages[subName].count++;
            }
        });
        return Object.values(averages).map(avg => {
            const childAvg = Math.round(avg.totalPct / avg.count);
            const classAvg = classSubjectAverages[avg.name] || 0;
            return {
                name: avg.name,
                average: childAvg,
                classAverage: classAvg
            };
        });
    }, [assessments, subjects, classSubjectAverages]);

    const enrichedAssessments = useMemo(() => {
        if (!assessments) return [];
        return assessments.map(a => {
            const student = students?.find(s => s.uid === a.studentId);
            const subject = subjects?.find(s => s.id === a.subjectId);
            const key = `${a.subjectId}_${(a.assessmentName || '').toLowerCase().trim()}`;
            const specificClassAvg = classAssessmentAverages[key] || 0;
            return {
                ...a,
                studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
                subjectName: subject?.name || a.subjectName || 'Unknown Subject',
                percentage: (a.score && a.maxScore) ? (a.score / a.maxScore) * 100 : 0,
                classAverage: specificClassAvg
            };
        });
    }, [assessments, students, subjects, classAssessmentAverages]);

    const stats = useMemo(() => {
        if (enrichedAssessments.length === 0) {
            return { average: 0, count: 0, classAverage: 0 };
        }
        let totalPct = 0;
        let count = 0;
        enrichedAssessments.forEach(a => {
            totalPct += a.percentage;
            count++;
        });
        const average = Math.round(totalPct / count);

        let classTotalPct = 0;
        let classCount = 0;
        Object.values(classSubjectAverages).forEach((val: number) => {
            classTotalPct += val;
            classCount++;
        });
        const classAverage = classCount > 0 ? Math.round(classTotalPct / classCount) : 0;

        return { average, count, classAverage };
    }, [enrichedAssessments, classSubjectAverages]);

    const isLoading = schoolLoading || loadingAssessments;

    if (role !== 'Student' && role !== 'Parent') {
        return (
            <div className="p-8 flex justify-center">
                <Card className="max-w-md w-full border-red-100 bg-red-50/50">
                    <CardHeader className="text-center">
                        <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                        <CardTitle>Access Restricted</CardTitle>
                        <CardDescription>Only students and parents can view personal grade logs.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto pb-20 animate-in fade-in duration-500">
            {/* Header Banner */}
            <div className="relative p-8 xl:p-10 rounded-[2rem] text-white border-b-8 border-black/10 overflow-hidden shadow-2xl flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border-indigo-500/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.06),_rgba(255,255,255,0))] pointer-events-none" />
                <div className="space-y-3 relative z-10 max-w-xl">
                    <span className="text-[9px] font-black tracking-[0.25em] px-3.5 py-1.5 rounded-full uppercase bg-indigo-500/20 text-indigo-300">
                        Academic Performance Console
                    </span>
                    <h2 className="text-2.5xl xl:text-3.5xl font-black tracking-tight uppercase italic mt-2">
                        {role === 'Parent' ? "Ward Grade Index" : "My Grade Index"}
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        Track live grades, subject-specific averages, and compare performance directly against class cohort averages.
                    </p>
                </div>
                <div className="hidden xl:flex p-5 bg-white/5 border border-white/10 rounded-[1.5rem] relative z-10 shrink-0">
                    <TrendingUp className="h-10 w-10 text-white opacity-80" />
                </div>
            </div>

            {/* Child Selector Tabs (Parents with multiple students) */}
            {role === 'Parent' && students && students.length > 1 && (
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Select Child</Label>
                    <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl border w-fit">
                        {students.map((st: any) => {
                            const targetId = st.id || st.uid;
                            return (
                                <button
                                    key={targetId}
                                    onClick={() => setSelectedChildId(targetId)}
                                    className={cn(
                                        "px-5 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-300",
                                        activeChildId === targetId
                                            ? "bg-white text-indigo-600 shadow-md scale-[1.02]"
                                            : "text-slate-500 hover:text-slate-900"
                                    )}
                                >
                                    {st.firstName} {st.lastName}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Statistics Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <Card className="hover:shadow-md transition-all border-l-4 border-l-indigo-500 rounded-[1.5rem] bg-white overflow-hidden relative">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ward Cumulative Average</p>
                            <h3 className="text-2xl font-black text-slate-900">{stats.average}%</h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Cumulative score index</p>
                        </div>
                        <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-all border-l-4 border-l-emerald-500 rounded-[1.5rem] bg-white overflow-hidden relative">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Class Cohort Average</p>
                            <h3 className="text-2xl font-black text-slate-900">{stats.classAverage}%</h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Classroom cohort index</p>
                        </div>
                        <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner">
                            <BookOpen className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-all border-l-4 border-l-purple-500 rounded-[1.5rem] bg-white overflow-hidden relative">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Assessments</p>
                            <h3 className="text-2xl font-black text-slate-900">{stats.count} Marks</h3>
                            <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Logged continuous marks</p>
                        </div>
                        <div className="p-3.5 bg-purple-50 text-purple-600 rounded-2xl shadow-inner">
                            <Award className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side: Subject tracker */}
                <Card className="lg:col-span-1 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-indigo-600" /> Subject Tracker
                            </CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 font-black">Performance averages compared directly with class averages</CardDescription>
                        </div>
                    </div>

                    {subjectAverages.length > 0 ? (
                        <div className="space-y-4">
                            {subjectAverages.map((sub: any) => (
                                <div key={sub.name} className="p-5 bg-slate-50/60 border border-slate-100 rounded-[1.5rem] space-y-3 relative hover:scale-[1.02] transition-all duration-300">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-black text-slate-800 uppercase tracking-tight truncate max-w-[140px]" title={sub.name}>{sub.name}</span>
                                        <div className="flex flex-col items-end gap-0.5">
                                            <span className={cn(
                                                "text-sm font-black uppercase italic tracking-wider",
                                                sub.average >= 50 ? "text-emerald-600" : "text-rose-600"
                                            )}>{sub.average}%</span>
                                            {sub.classAverage > 0 && (
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-tight",
                                                    sub.average >= sub.classAverage ? "text-emerald-500" : "text-rose-500"
                                                )}>
                                                    {sub.average >= sub.classAverage ? `+${sub.average - sub.classAverage}% Above Class` : `${sub.average - sub.classAverage}% Below Class`}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        {/* Student Progress */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                <span>Student</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
                                                <div 
                                                    className={cn("h-full rounded-full transition-all duration-500", sub.average >= 50 ? "bg-emerald-500" : "bg-rose-500")}
                                                    style={{ width: `${sub.average}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Class Average Progress */}
                                        {sub.classAverage > 0 && (
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                                    <span>Class Average ({sub.classAverage}%)</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-200/30 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full rounded-full bg-slate-400"
                                                        style={{ width: `${sub.classAverage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Subject difficulty coaching advice highlight */}
                                    <div className="pt-3 border-t border-slate-200 mt-2 space-y-1">
                                        {sub.average < sub.classAverage - 3 || sub.average < 50 ? (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 text-[9px] font-black text-rose-600 uppercase tracking-wider">
                                                    <AlertTriangle className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
                                                    <span>Needs Support: Below Average</span>
                                                </div>
                                                <p className="text-[9.5px] text-rose-700 leading-normal font-semibold bg-rose-50/50 p-2 rounded-lg">
                                                    Advisory: scoring below average in {sub.name}. Encourage daily textbook revisions, review homework answers, or drop a line to the teacher.
                                                </p>
                                            </div>
                                        ) : sub.average > sub.classAverage + 5 ? (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-wider">
                                                    <Award className="h-3.5 w-3.5 text-emerald-500" />
                                                    <span>Excelling in {sub.name}</span>
                                                </div>
                                                <p className="text-[9.5px] text-emerald-700 leading-normal font-semibold bg-emerald-50/30 p-2 rounded-lg">
                                                    Advisory: performing exceptionally! Keep up the encouragement and sustain their structured reading environment.
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 text-[9px] font-black text-amber-600 uppercase tracking-wider">
                                                    <Info className="h-3.5 w-3.5 text-amber-500" />
                                                    <span>Steady: Average standing</span>
                                                </div>
                                                <p className="text-[9.5px] text-amber-700 leading-normal font-semibold bg-amber-50/30 p-2 rounded-lg">
                                                    Advisory: on track with classmates. Practicing additional quizzes and chapter summaries can help push them above class cohort index.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-6 text-slate-400 italic font-black uppercase tracking-widest text-xs">No grades to compute subject averages.</p>
                    )}
                </Card>

                {/* Right side: Detailed Grade Feed */}
                <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b p-8 flex flex-row justify-between items-center">
                        <div>
                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">
                                {viewMode === 'recent' ? "Latest Marks Posted" : "Archived Results"}
                            </CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                {viewMode === 'recent' ? "Showing recent assessments across all terms" : `Results filtered for term`}
                            </CardDescription>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            {viewMode === 'history' && (
                                <Button 
                                    variant="ghost" 
                                    onClick={() => setViewMode('recent')}
                                    className="text-indigo-600 hover:text-indigo-700 font-bold uppercase text-[10px] tracking-widest"
                                >
                                    <X className="mr-1 h-3 w-3" /> Reset
                                </Button>
                            )}
                            
                            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
                                <Button 
                                    variant={viewMode === 'recent' ? 'secondary' : 'ghost'} 
                                    size="sm"
                                    onClick={() => setViewMode('recent')}
                                    className={cn("rounded-lg text-[10px] font-black uppercase tracking-widest h-8 px-4", viewMode === 'recent' && "bg-white shadow-sm")}
                                >
                                    <Sparkles className="mr-1.5 h-3 w-3" /> Recent
                                </Button>
                                <Button 
                                    variant={viewMode === 'history' ? 'secondary' : 'ghost'} 
                                    size="sm"
                                    onClick={() => setViewMode('history')}
                                    className={cn("rounded-lg text-[10px] font-black uppercase tracking-widest h-8 px-4", viewMode === 'history' && "bg-white shadow-sm")}
                                >
                                    <History className="mr-1.5 h-3 w-3" /> Archive
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {viewMode === 'history' && (
                            <div className="bg-slate-50/50 p-6 border-b flex flex-wrap gap-4">
                                <div className="space-y-1.5 flex-1 min-w-[200px]">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Year</Label>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger className="bg-white border-2 rounded-xl h-11"><SelectValue placeholder="Year" /></SelectTrigger>
                                        <SelectContent>
                                            {MOCK_ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5 flex-1 min-w-[200px]">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Term</Label>
                                    <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                                        <SelectTrigger className="bg-white border-2 rounded-xl h-11"><SelectValue placeholder="Term" /></SelectTrigger>
                                        <SelectContent>
                                            {MOCK_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="p-32 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="animate-spin text-indigo-600 h-10 w-10 opacity-20"/>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Syncing Gradebook...</p>
                            </div>
                        ) : enrichedAssessments.length === 0 ? (
                            <div className="p-32 text-center flex flex-col items-center gap-4 text-slate-300">
                                <BookOpen className="h-16 w-16 opacity-10" />
                                <div className="space-y-1">
                                    <p className="text-sm font-black uppercase tracking-widest">No assessments recorded</p>
                                    <p className="text-xs font-medium lowercase">No continuous marks match the select criteria.</p>
                                </div>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-slate-50/30">
                                    <TableRow>
                                        <TableHead className="w-[180px] font-black text-[10px] uppercase tracking-widest pl-8 py-6">Date Posted</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase tracking-widest">Subject & Type</TableHead>
                                        <TableHead className="w-[220px] font-black text-[10px] uppercase tracking-widest">Performance vs Class</TableHead>
                                        <TableHead className="font-black text-[10px] uppercase tracking-widest pr-8">Teacher Remark</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {enrichedAssessments.map((a) => (
                                        <TableRow key={a.id} className="hover:bg-slate-50/50 transition-colors group h-24">
                                            <TableCell className="pl-8">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                        <Calendar className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-700 tracking-tight">
                                                            {format(toDateSafe(a.assessmentDate), 'PPP')}
                                                        </span>
                                                        {viewMode === 'recent' && (
                                                            <span className="text-[9px] font-black uppercase text-indigo-400 tracking-tighter">
                                                                {a.term} · {a.academicYear}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-black text-slate-800 uppercase italic tracking-tighter leading-none">
                                                        {a.subjectName}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {a.assessmentType}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-sm font-black text-slate-900 tracking-tighter leading-none">
                                                            {a.score} <span className="text-[10px] text-slate-400 font-bold uppercase">/ {a.maxScore}</span>
                                                        </span>
                                                        <div className="text-right">
                                                            <span className={cn(
                                                                "text-xs font-black uppercase italic tracking-widest",
                                                                a.percentage >= 50 ? 'text-emerald-600' : 'text-rose-600'
                                                            )}>
                                                                {Math.round(a.percentage)}%
                                                            </span>
                                                            {a.classAverage > 0 && (
                                                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">
                                                                    Class Avg: {a.classAverage}%
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
                                                        <div 
                                                            className={cn("h-full rounded-full transition-all duration-1000", a.percentage >= 50 ? "bg-emerald-500" : "bg-rose-500")} 
                                                            style={{ width: `${a.percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="pr-8">
                                                <div className="max-w-[200px]">
                                                    {a.teacherRemark ? (
                                                        <p className="text-xs font-medium text-slate-500 italic leading-relaxed line-clamp-2" title={a.teacherRemark}>
                                                            "{a.teacherRemark}"
                                                        </p>
                                                    ) : (
                                                        <span className="text-[10px] font-bold uppercase text-slate-300 tracking-[0.2em] italic">No comment recorded</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                    <CardFooter className="bg-slate-50/50 p-6 border-t flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                            <Info className="h-4 w-4 text-indigo-500" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                            Continuous assessment marks are updated in real-time as teachers submit them. 
                            Overall terminal results are released separately via the "Report Cards" module.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
