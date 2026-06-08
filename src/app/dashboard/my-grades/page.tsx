'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, TrendingUp, BookOpen, User as UserIcon, Calendar, History, Sparkles, X, Info } from 'lucide-react';
import { format } from 'date-fns';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { Assessment, Student, Subject } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function MyGradesPage() {
    const { user } = useUser();
    const { role, profile } = useRole();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const firestore = useFirestore();

    // View State
    const [viewMode, setViewMode] = useState<'recent' | 'history'>('recent');
    const [selectedYear, setSelectedYear] = useState(MOCK_ACADEMIC_YEARS[MOCK_ACADEMIC_YEARS.length - 1]);
    const [selectedTerm, setSelectedTerm] = useState(MOCK_TERMS[0] || 'First Term');

    const parentStudentIds = useMemo(() => {
        const ids = profile?.studentIds || profile?.students || profile?.childrenIds || profile?.linkedStudentIds || [];
        // Cap at 30 to respect Firestore 'in' query limits
        return ids.slice(0, 30);
    }, [profile]);
    const parentStudentIdsStr = parentStudentIds.join(',');

    const assessmentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !role) return null;
        
        const baseQuery = collection(firestore, 'assessments');
        const targetIds = role === 'Student' ? [user?.uid] : parentStudentIds;
        
        if (targetIds.length === 0 || !targetIds[0]) return null;

        // --- RECENT MODE: Last 20 items across any period ---
        if (viewMode === 'recent') {
            return query(
                baseQuery,
                where('schoolId', '==', schoolId),
                where('studentId', 'in', targetIds),
                orderBy('createdAt', 'desc'),
                limit(20)
            );
        }
        
        // --- HISTORY MODE: Filtered by specific year and term ---
        return query(
            baseQuery,
            where('schoolId', '==', schoolId),
            where('studentId', 'in', targetIds),
            where('academicYear', '==', selectedYear),
            where('term', '==', selectedTerm),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, schoolId, role, user?.uid, parentStudentIdsStr, selectedYear, selectedTerm, viewMode]);

    const { data: assessments, isLoading: loadingAssessments } = useCollection<Assessment>(assessmentsQuery);

    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !role) return null;
        const targetIds = role === 'Student' ? [user?.uid] : parentStudentIds;
        if (targetIds.length === 0 || !targetIds[0]) return null;
        return query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('uid', 'in', targetIds));
    }, [firestore, schoolId, parentStudentIdsStr, role, user?.uid]);

    const { data: students } = useCollection<Student>(studentsQuery);

    const subjectsQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]);

    const { data: subjects } = useCollection<Subject>(subjectsQuery);

    const enrichedAssessments = useMemo(() => {
        if (!assessments) return [];
        return assessments.map(a => {
            const student = students?.find(s => s.uid === a.studentId);
            const subject = subjects?.find(s => s.id === a.subjectId);
            return {
                ...a,
                studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown Student',
                subjectName: subject?.name || a.subjectName || 'Unknown Subject',
                percentage: (a.score && a.maxScore) ? (a.score / a.maxScore) * 100 : 0
            };
        });
    }, [assessments, students, subjects]);

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
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
                        <TrendingUp className="text-indigo-600 h-8 w-8" /> 
                        {viewMode === 'recent' ? "Recent Updates" : "Grade History"}
                    </h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                        {viewMode === 'recent' 
                            ? "Latest marks posted by your teachers" 
                            : `Filtered results for ${selectedTerm}, ${selectedYear}`}
                    </p>
                </div>
                
                <div className="flex items-center gap-2">
                    {viewMode === 'history' && (
                        <Button 
                            variant="ghost" 
                            onClick={() => setViewMode('recent')}
                            className="text-indigo-600 hover:text-indigo-700 font-bold uppercase text-[10px] tracking-widest"
                        >
                            <X className="mr-1 h-3 w-3" /> Reset to Latest
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
            </div>

            {viewMode === 'history' && (
                <Card className="bg-indigo-50/30 border-indigo-100 animate-in slide-in-from-top-2 duration-300">
                    <CardContent className="pt-6 flex flex-wrap gap-4">
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
                    </CardContent>
                </Card>
            )}

            <Card className="border-t-4 border-t-indigo-600 shadow-xl rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b p-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800">
                                {viewMode === 'recent' ? "Latest Marks Posted" : "Archived Results"}
                            </CardTitle>
                            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                {viewMode === 'recent' ? "Showing recent assessments across all periods" : `Results for ${selectedTerm}`}
                            </CardDescription>
                        </div>
                        {viewMode === 'recent' && (
                            <Badge className="bg-indigo-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-lg px-3 py-1">
                                Live Feed
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-32 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-indigo-600 h-10 w-10 opacity-20"/>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Synchronizing Records...</p>
                        </div>
                    ) : enrichedAssessments.length === 0 ? (
                        <div className="p-32 text-center flex flex-col items-center gap-4 text-slate-300">
                            <BookOpen className="h-16 w-16 opacity-10" />
                            <div className="space-y-1">
                                <p className="text-sm font-black uppercase tracking-widest">No data available</p>
                                <p className="text-xs font-medium lowercase">We couldn't find any marks for this specific selection.</p>
                            </div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="w-[180px] font-black text-[10px] uppercase tracking-widest pl-8 py-6">Date Posted</TableHead>
                                    {role === 'Parent' && <TableHead className="font-black text-[10px] uppercase tracking-widest">Student</TableHead>}
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Subject & Type</TableHead>
                                    <TableHead className="w-[200px] font-black text-[10px] uppercase tracking-widest">Performance</TableHead>
                                    <TableHead className="font-black text-[10px] uppercase tracking-widest pr-8">Teacher's Insight</TableHead>
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
                                                        {a.assessmentDate?.toDate ? format(a.assessmentDate.toDate(), 'PPP') : format(new Date(), 'PPP')}
                                                    </span>
                                                    {viewMode === 'recent' && (
                                                        <span className="text-[9px] font-black uppercase text-indigo-400 tracking-tighter">
                                                            {a.term} · {a.academicYear}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        
                                        {role === 'Parent' && (
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
                                                        {a.studentName?.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-slate-800 text-sm tracking-tight">{a.studentName}</span>
                                                </div>
                                            </TableCell>
                                        )}
                                        
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
                                                    <span className="text-lg font-black text-slate-900 tracking-tighter leading-none">
                                                        {a.score} <span className="text-[10px] text-slate-400 font-bold uppercase">/ {a.maxScore}</span>
                                                    </span>
                                                    <span className={cn(
                                                        "text-xs font-black uppercase italic tracking-widest",
                                                        a.percentage >= 50 ? 'text-emerald-600' : 'text-rose-600'
                                                    )}>
                                                        {Math.round(a.percentage)}%
                                                    </span>
                                                </div>
                                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={cn("h-full rounded-full transition-all duration-1000", a.percentage >= 50 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]")} 
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
    );
}
