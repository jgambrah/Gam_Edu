'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, TrendingUp, BookOpen, User as UserIcon, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { Assessment, Student, Subject } from '@/lib/types';

export default function MyGradesPage() {
    const { user } = useUser();
    const { role, profile } = useRole();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const firestore = useFirestore();

    // Default to the current/latest available academic year
    const [selectedYear, setSelectedYear] = useState(MOCK_ACADEMIC_YEARS[MOCK_ACADEMIC_YEARS.length - 1]);
    const [selectedTerm, setSelectedTerm] = useState(MOCK_TERMS[0] || 'First Term');

    // 1. Determine Target Students
    const studentIds = useMemo(() => {
        if (role === 'Student' && user) return [user.uid];
        if (role === 'Parent' && profile?.studentIds) return profile.studentIds;
        return [];
    }, [role, user, profile]);

    // 2. Data Fetching
    const assessmentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || studentIds.length === 0) return null;
        return query(
            collection(firestore, 'assessments'),
            where('schoolId', '==', schoolId),
            where('studentId', 'in', studentIds),
            where('academicYear', '==', selectedYear),
            where('term', '==', selectedTerm),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, schoolId, studentIds, selectedYear, selectedTerm]);

    const { data: assessments, isLoading: loadingAssessments } = useCollection<Assessment>(assessmentsQuery);

    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || studentIds.length === 0) return null;
        return query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('uid', 'in', studentIds));
    }, [firestore, schoolId, studentIds]);

    const { data: students } = useCollection<Student>(studentsQuery);

    const subjectsQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null,
    [firestore, schoolId]);

    const { data: subjects } = useCollection<Subject>(subjectsQuery);

    // 3. Mapping Logic
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
        return <div className="p-8 text-center text-muted-foreground">Access Restricted.</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <TrendingUp className="text-indigo-600 h-8 w-8" /> Live Grades
                    </h1>
                    <p className="text-muted-foreground">Real-time tracker for ongoing term assessments.</p>
                </div>
                <div className="flex gap-2">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-[160px] bg-white">
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                            {MOCK_ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                        <SelectTrigger className="w-[160px] bg-white">
                            <SelectValue placeholder="Term" />
                        </SelectTrigger>
                        <SelectContent>
                            {MOCK_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Card className="border-t-4 border-t-indigo-600 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50">
                    <CardTitle>Continuous Assessments</CardTitle>
                    <CardDescription>
                        Marks for {selectedTerm}, {selectedYear}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-indigo-600 h-8 w-8"/></div>
                    ) : enrichedAssessments.length === 0 ? (
                        <div className="p-20 text-center flex flex-col items-center gap-3 text-muted-foreground">
                            <BookOpen className="h-12 w-12 opacity-20" />
                            <p>No marks have been entered for this period yet.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50">
                                    <TableHead className="w-[150px]">Date</TableHead>
                                    {role === 'Parent' && <TableHead>Student</TableHead>}
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="w-[200px]">Score</TableHead>
                                    <TableHead>Remark</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {enrichedAssessments.map((a) => (
                                    <TableRow key={a.id} className="hover:bg-slate-50 transition-colors">
                                        <TableCell className="text-xs font-medium text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {a.assessmentDate?.toDate ? format(a.assessmentDate.toDate(), 'MMM dd, yyyy') : format(new Date(), 'MMM dd, yyyy')}
                                            </div>
                                        </TableCell>
                                        {role === 'Parent' && (
                                            <TableCell className="font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <UserIcon className="h-4 w-4 text-slate-400" />
                                                    {a.studentName}
                                                </div>
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            <Badge variant="outline" className="font-bold border-indigo-100 text-indigo-700 bg-indigo-50/30">
                                                {a.subjectName}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {a.assessmentType}
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-xs font-bold">
                                                    <span>{a.score} / {a.maxScore}</span>
                                                    <span className={a.percentage >= 50 ? 'text-green-600' : 'text-red-600'}>
                                                        {Math.round(a.percentage)}%
                                                    </span>
                                                </div>
                                                <Progress value={a.percentage} className={cn("h-1.5", a.percentage < 50 ? "bg-red-100" : "bg-green-100")} />
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-xs italic text-slate-600 max-w-[200px] truncate" title={a.teacherRemark}>
                                            {a.teacherRemark || "-"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
