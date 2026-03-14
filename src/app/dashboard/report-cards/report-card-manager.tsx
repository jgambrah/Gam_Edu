
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, doc, setDoc, serverTimestamp, getDoc, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportCardCommentSchema, ReportCard, ReportCardComment, ReportCardStatus, Class, Subject, Assessment, Student, FinancialRecord } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { Loader2, Send, CheckCircle, ShieldCheck, Printer, Trophy, TrendingUp, FileText, Landmark } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GenerateReportCard } from '../academics/gradebook/report-card-pdf';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { StudentDisplay } from '@/components/student-display';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// --- HELPER: Grading Logic ---
function getGrade(percentage: number) {
    if (percentage >= 80) return { grade: 'A', remark: 'Excellent' };
    if (percentage >= 70) return { grade: 'B', remark: 'Very Good' };
    if (percentage >= 60) return { grade: 'C', remark: 'Good' };
    if (percentage >= 50) return { grade: 'D', remark: 'Pass' };
    if (percentage > 0) return { grade: 'F', remark: 'Fail' };
    return { grade: 'N/A', remark: '' };
}

// --- SUB-COMPONENT: Student Detail ---
function StudentGradesDetail({ 
    student, 
    allAssessments, 
    allSubjects,
    rank, 
    totalStudents,
    term,
    year,
    schoolId,
    reportCard,
    onUpdate
}: { 
    student: Student; 
    allAssessments: Assessment[];
    allSubjects: Subject[];
    rank: number;
    totalStudents: number;
    term: string;
    year: string;
    schoolId: string;
    reportCard?: ReportCard;
    onUpdate: () => void;
}) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const commentsQuery = useMemoFirebase(
        () => (firestore && reportCard) ? query(collection(firestore, `report-cards/${reportCard.id}/comments`)) : null,
        [firestore, reportCard?.id]
    );
    const { data: comments } = useCollection<ReportCardComment>(commentsQuery);

    const commentForm = useForm({
        resolver: zodResolver(reportCardCommentSchema),
        defaultValues: { subjectId: '', comment: '' },
    });

    // 1. Calculate weighted scores
    const globalSubjectStats = useMemo(() => {
        const grouping: Record<string, Record<string, { ca: number, caMax: number, exam: number, examMax: number }>> = {};
        allAssessments.forEach((a: Assessment) => {
             const subId = a.subjectId || 'unknown';
             const uId = a.studentId;
             if (!grouping[subId]) grouping[subId] = {};
             if (!grouping[subId][uId]) grouping[subId][uId] = { ca: 0, caMax: 0, exam: 0, examMax: 0 };
             const type = (a.assessmentType || '').toLowerCase();
             const isExam = type.includes('exam') || type.includes('term');
             if (isExam) {
                 grouping[subId][uId].exam += (a.score || 0);
                 grouping[subId][uId].examMax += (a.maxScore || 0);
             } else {
                 grouping[subId][uId].ca += (a.score || 0);
                 grouping[subId][uId].caMax += (a.maxScore || 0);
             }
        });
        const stats: Record<string, { average: number, studentScores: Record<string, number> }> = {};
        Object.keys(grouping).forEach(subId => {
            const studentsInSub = grouping[subId];
            let sumPercentages = 0;
            let count = 0;
            const scoresMap: Record<string, number> = {};
            Object.entries(studentsInSub).forEach(([uid, data]) => {
                const caPct = data.caMax > 0 ? (data.ca / data.caMax) * 50 : 0;
                const examPct = data.examMax > 0 ? (data.exam / data.examMax) * 50 : 0;
                const final = caPct + examPct;
                scoresMap[uid] = final;
                sumPercentages += final;
                count++;
            });
            stats[subId] = { average: count > 0 ? sumPercentages / count : 0, studentScores: scoresMap };
        });
        return stats;
    }, [allAssessments]);

    const reportData = useMemo(() => {
        if (!allSubjects || allSubjects.length === 0) return [];
        return allSubjects.map(subject => {
            const subId = subject.id;
            const studentAssessments = allAssessments.filter(a => a.studentId === student.uid && a.subjectId === subId);
            let caObt = 0, caMax = 0, exObt = 0, exMax = 0;
            studentAssessments.forEach(a => {
                const isExam = (a.assessmentType || '').toLowerCase().includes('exam');
                if (isExam) { exObt += (a.score || 0); exMax += (a.maxScore || 0); }
                else { caObt += (a.score || 0); caMax += (a.maxScore || 0); }
            });
            const caW = caMax > 0 ? (caObt / caMax) * 50 : 0;
            const exW = exMax > 0 ? (exObt / exMax) * 50 : 0;
            const total = caW + exW;
            const subStats = globalSubjectStats[subId];
            let subRank = 0;
            let totalSubStudents = 0;
            if (subStats && subStats.studentScores) {
                const allScores = Object.values(subStats.studentScores).sort((a,b) => b - a);
                const score = subStats.studentScores[student.uid];
                if (score !== undefined) subRank = allScores.findIndex(s => Math.abs(s - score) < 0.001) + 1;
                totalSubStudents = allScores.length;
            }
            const existingComment = comments?.find(c => c.subjectId === subId)?.comment || "";
            return { id: subId, name: subject.name, caW, exW, total, classAvg: subStats?.average || 0, rank: subRank, totalSubStudents, comment: existingComment, ...getGrade(total) };
        });
    }, [allAssessments, student.uid, allSubjects, globalSubjectStats, comments]);

    const overallAverage = reportData.length > 0 
        ? reportData.reduce((sum, i) => sum + i.total, 0) / reportData.length 
        : 0;

    const handleSaveComment = async (values: { subjectId: string, comment: string }) => {
        if (!firestore || !user || !schoolId) return;
        setIsSubmitting(true);
        try {
            const reportCardId = `${student.uid}-${year}-${term}`;
            const commentRef = doc(firestore, `report-cards/${reportCardId}/comments`, `${values.subjectId}_${user.uid}`);
            await setDoc(commentRef, {
                studentId: student.uid,
                subjectId: values.subjectId,
                comment: values.comment,
                teacherId: user.uid,
                term, academicYear: year,
                updatedAt: serverTimestamp(),
                createdAt: serverTimestamp(),
            }, { merge: true });
            toast({ title: "Comment Saved" });
            onUpdate();
        } catch (e) {
            toast({ variant: 'destructive', title: "Error Saving Comment" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-indigo-50 border-indigo-100 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3 text-indigo-900">
                        <Trophy className="h-8 w-8 text-indigo-600"/>
                        <div><p className="text-[10px] font-black uppercase tracking-widest">Class Position</p><p className="text-2xl font-black">{rank} <span className="text-sm font-normal opacity-50">/ {totalStudents}</span></p></div>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-emerald-100 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3 text-emerald-900">
                        <TrendingUp className="h-8 w-8 text-emerald-600"/>
                        <div><p className="text-[10px] font-black uppercase tracking-widest">Overall Average</p><p className="text-2xl font-black">{overallAverage.toFixed(1)}%</p></div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                     <CardContent className="p-4 flex flex-col justify-center h-full">
                        <GenerateReportCard
                            student={student}
                            assessments={allAssessments}
                            subjects={allSubjects || []}
                            year={year}
                            term={term}
                            rank={rank}
                            totalStudents={totalStudents}
                        />
                     </CardContent>
                </Card>
            </div>

            <div className="border rounded-xl bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[20%]">Subject</TableHead>
                            <TableHead className="text-center">CA (50%)</TableHead>
                            <TableHead className="text-center">Exam (50%)</TableHead>
                            <TableHead className="text-center font-bold">Total</TableHead>
                            <TableHead className="text-center">Pos</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead className="w-[30%]">Teacher's Remark</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reportData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-bold text-slate-700">{row.name}</TableCell>
                                <TableCell className="text-center font-mono">{row.caW > 0 ? row.caW.toFixed(1) : '-'}</TableCell>
                                <TableCell className="text-center font-mono">{row.exW > 0 ? row.exW.toFixed(1) : '-'}</TableCell>
                                <TableCell className="text-center font-black text-indigo-600">{row.total > 0 ? `${row.total.toFixed(1)}%` : '-'}</TableCell>
                                <TableCell className="text-center text-xs font-bold text-slate-400">{row.rank > 0 ? `${row.rank}/${row.totalSubStudents}` : '-'}</TableCell>
                                <TableCell><Badge variant={row.grade === 'F' ? 'destructive' : row.grade === 'N/A' ? 'outline' : 'default'}>{row.grade}</Badge></TableCell>
                                <TableCell className="text-xs italic text-slate-500">{row.comment || "No comment yet."}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {reportCard?.status === 'Draft' && (
                <Card className="border-t-4 border-t-amber-400 shadow-sm">
                    <CardHeader className="py-3 px-4 bg-slate-50 border-b">
                        <CardTitle className="text-sm font-black uppercase flex items-center gap-2"><FileText className="h-4 w-4"/> Add/Update Subject Remarks</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Form {...commentForm}>
                            <form onSubmit={commentForm.handleSubmit(handleSaveComment)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                                    <div className="md:col-span-4">
                                        <FormField control={commentForm.control} name="subjectId" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase font-bold text-slate-400">Select Subject</FormLabel>
                                                <Select onValueChange={(v) => { field.onChange(v); const existing = comments?.find(c => c.subjectId === v); commentForm.setValue('comment', existing?.comment || ''); }} value={field.value}>
                                                    <SelectTrigger className="rounded-xl border-2"><SelectValue placeholder="..." /></SelectTrigger>
                                                    <SelectContent>
                                                        {allSubjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}/>
                                    </div>
                                    <div className="md:col-span-6">
                                        <FormField control={commentForm.control} name="comment" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs uppercase font-bold text-slate-400">Teacher's Remark</FormLabel>
                                                <FormControl><Input placeholder="Enter student performance remark..." {...field} className="rounded-xl border-2"/></FormControl>
                                            </FormItem>
                                        )}/>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Button type="submit" disabled={isSubmitting || !commentForm.watch('subjectId')} className="w-full rounded-xl bg-indigo-600 h-10">
                                            {isSubmitting ? <Loader2 className="animate-spin h-4 w-4"/> : "Save"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// --- MAIN PAGE ---
export default function ReportCardManager() {
  const { user } = useUser();
  const { role, isRoleLoading } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(MOCK_TERMS[0]);
  const [selectedYear, setSelectedYear] = useState(MOCK_ACADEMIC_YEARS[MOCK_ACADEMIC_YEARS.length - 1]);
  const [processingStudentId, setProcessingStudentId] = useState<string | null>(null);
  
  // 1. Metadata Fetching
  const classesQuery = useMemoFirebase(() => {
      if(!firestore || !user || !schoolId) return null;
      let q = query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
      if (role === 'Teacher') q = query(q, where('teacherId', '==', user.uid));
      return q;
  }, [firestore, user, role, schoolId]);
  const { data: classes, isLoading: loadingClasses } = useCollection<Class>(classesQuery);

  const subjectsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: subjects } = useCollection<Subject>(subjectsQuery);

  // 2. Student & Result Fetching
  const studentsQuery = useMemoFirebase(() => (selectedClassId && schoolId) ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId), where('schoolId', '==', schoolId)) : null, [firestore, selectedClassId, schoolId]);
  const { data: students, isLoading: loadingStudents } = useCollection<Student>(studentsQuery);
  
  const reportCardsQuery = useMemoFirebase(() => {
    if (!selectedClassId || !selectedYear || !selectedTerm || !schoolId) return null;
    return query(collection(firestore, 'report-cards'), where('schoolId', '==', schoolId), where('classId', '==', selectedClassId), where('academicYear', '==', selectedYear), where('term', '==', selectedTerm));
  }, [firestore, selectedClassId, selectedYear, selectedTerm, schoolId]);
  const { data: reportCards, forceRefetch: refetchReports } = useCollection<ReportCard>(reportCardsQuery);

  const assessmentsQuery = useMemoFirebase(() => {
    if (!selectedClassId || !selectedYear || !selectedTerm || !schoolId) return null;
    return query(collection(firestore, 'assessments'), where('schoolId', '==', schoolId), where('classId', '==', selectedClassId), where('academicYear', '==', selectedYear), where('term', '==', selectedTerm));
  }, [firestore, selectedClassId, selectedYear, selectedTerm, schoolId]);
  const { data: assessments, isLoading: loadingAssessments, forceRefetch: refetchAssessments } = useCollection<Assessment>(assessmentsQuery);

  const financialRecordsQuery = useMemoFirebase(() => (firestore && selectedClassId && schoolId) ? query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId), where('classId', '==', selectedClassId)) : null, [firestore, selectedClassId, schoolId]);
  const { data: financialRecords } = useCollection<FinancialRecord>(financialRecordsQuery);

  // 3. Derived Ranking Logic
  const rankedStudents = useMemo(() => {
      if (!students || !assessments) return [];
      const studentsWithScore = students.map(s => {
          const myAssessments = assessments.filter(a => a.studentId === s.uid);
          const grouping: Record<string, { ca: number, caMax: number, exam: number, examMax: number }> = {};
          myAssessments.forEach(a => {
              const subId = a.subjectId || 'unknown';
              if (!grouping[subId]) grouping[subId] = { ca: 0, caMax: 0, exam: 0, examMax: 0 };
              const isExam = (a.assessmentType || '').toLowerCase().includes('exam');
              if (isExam) { grouping[subId].exam += (a.score || 0); grouping[subId].examMax += (a.maxScore || 0); }
              else { grouping[subId].ca += (a.score || 0); grouping[subId].caMax += (a.maxScore || 0); }
          });
          const subjectAverages = Object.values(grouping).map(g => {
              const caPct = g.caMax > 0 ? (g.ca / g.caMax) * 50 : 0;
              const exPct = g.examMax > 0 ? (g.exam / g.examMax) * 50 : 0;
              return caPct + exPct;
          });
          const average = subjectAverages.length > 0 ? subjectAverages.reduce((a,b) => a+b, 0) / subjectAverages.length : 0;
          return { ...s, average };
      });
      return studentsWithScore.sort((a, b) => b.average - a.average);
  }, [students, assessments]);

  const studentFinancials = useMemo(() => {
    if (!students || !financialRecords) return {};
    const financials: Record<string, { balance: number }> = {};
    students.forEach(student => {
        const myRecords = financialRecords.filter(r => r.studentId === student.uid && r.status !== 'Pending Reversal');
        const billed = myRecords.reduce((acc, r) => acc + r.billedAmount, 0);
        const paid = myRecords.reduce((acc, r) => acc + (r.amountPaid || 0) + (r.waiverAmount || 0), 0);
        financials[student.uid] = { balance: billed - paid };
    });
    return financials;
  }, [students, financialRecords]);

  // 4. Action Handlers
  const handleStatusUpdate = async (student: Student, newStatus: ReportCardStatus) => {
    setProcessingStudentId(student.uid);
    if (!firestore || !schoolId) return;
    const reportCardId = `${student.uid}-${selectedYear}-${selectedTerm}`;
    try {
        const reportCardRef = doc(firestore, 'report-cards', reportCardId);
        const dataToSet: any = { status: newStatus, studentName: `${student.firstName} ${student.lastName}`, className: classes?.find(c => c.id === selectedClassId)?.name || 'N/A' };
        if (newStatus === 'Published') dataToSet.publishedAt = serverTimestamp();
        await setDoc(reportCardRef, {
            id: reportCardId, studentId: student.uid, classId: selectedClassId,
            academicYear: selectedYear, term: selectedTerm, schoolId, ...dataToSet
        }, { merge: true });
        toast({ title: `Report ${newStatus}` });
        refetchReports();
    } catch(error) {
        toast({ variant: 'destructive', title: 'Update Failed' });
    } finally {
        setProcessingStudentId(null);
    }
  };

  const isLoading = isRoleLoading || isLoadingSchool || loadingClasses || (selectedClassId && (loadingStudents || loadingAssessments));

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-indigo-600 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="text-indigo-600"/> Terminal Report Engine</CardTitle>
          <CardDescription>Finalize grades, add remarks, and publish student results.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-6 border-t border-b">
          <div className="space-y-1">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Year</span>
             <Select onValueChange={setSelectedYear} defaultValue={selectedYear}>
                <SelectTrigger className="bg-white rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{MOCK_ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
             </Select>
          </div>
          <div className="space-y-1">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Term</span>
             <Select onValueChange={setSelectedTerm} defaultValue={selectedTerm}>
                <SelectTrigger className="bg-white rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{MOCK_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
             </Select>
          </div>
          <div className="space-y-1">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</span>
             <Select onValueChange={setSelectedClassId} disabled={loadingClasses}>
                <SelectTrigger className="bg-white rounded-xl"><SelectValue placeholder="Choose class..." /></SelectTrigger>
                <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
             </Select>
          </div>
        </CardContent>
      </Card>
      
      {selectedClassId && (
        <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden">
            <CardHeader className="py-4 px-6 border-b bg-white">
                <CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5 text-slate-400"/> Class Performance Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="flex flex-col items-center py-20 gap-2 text-slate-400">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                        <p className="font-bold text-xs uppercase tracking-widest">Compiling Results...</p>
                    </div>
                ) : rankedStudents.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {rankedStudents.map((student, index) => {
                        const financials = studentFinancials[student.uid] || { balance: 0 };
                        const report = reportCards?.find(rc => rc.studentId === student.uid);
                        const status = report?.status || 'Draft';
                        const rank = index + 1;
                        
                        return (
                            <AccordionItem value={student.uid} key={student.uid} className="px-4 border-b last:border-0 hover:bg-slate-50 transition-colors">
                                <AccordionTrigger className="hover:no-underline py-5">
                                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center w-full pr-4 gap-4'>
                                        <div className="flex items-center gap-4">
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-2xl text-sm font-black ${rank <= 3 ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-500/20' : 'bg-slate-100 text-slate-500'}`}>
                                                #{rank}
                                            </div>
                                            <StudentDisplay student={student} variant="list" showAvatar />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className={cn("rounded-lg px-3 py-1 font-bold", status === 'Published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200')}>
                                                {status}
                                            </Badge>
                                            <div className="text-right min-w-[80px]">
                                                <p className="text-[10px] font-black text-slate-400 uppercase">Average</p>
                                                <p className="text-xl font-black text-indigo-600">{student.average.toFixed(1)}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-0 border-t bg-slate-50/30">
                                    <StudentGradesDetail 
                                        student={student}
                                        allAssessments={assessments || []}
                                        allSubjects={subjects || []}
                                        rank={rank}
                                        totalStudents={rankedStudents.length}
                                        term={selectedTerm}
                                        year={selectedYear}
                                        schoolId={schoolId!}
                                        reportCard={report}
                                        onUpdate={refetchReports}
                                    />
                                    
                                    <div className="p-6 border-t bg-white flex justify-end gap-3">
                                        {role === 'Teacher' && status === 'Draft' && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6 font-bold"><Send className="mr-2 h-4 w-4" /> Submit for Approval</Button></AlertDialogTrigger>
                                                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Ready to Submit?</AlertDialogTitle><AlertDialogDescription>This will lock the report card and send it to the Director for final review.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleStatusUpdate(student, 'AwaitingFinalApproval')}>Submit Report</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                        {['Administrator', 'Director'].includes(role || '') && status === 'AwaitingFinalApproval' && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild><Button variant="destructive" className="rounded-xl px-6 font-bold"><ShieldCheck className="mr-2 h-4 w-4" /> Publish Report</Button></DialogTrigger>
                                                <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Publish Official Result?</AlertDialogTitle><AlertDialogDescription>This will make the report card visible to parents and students. They will receive a notification.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleStatusUpdate(student, 'Published')} className="bg-green-600">Publish Now</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
                ) : (
                    <div className="text-center py-20 text-slate-300 flex flex-col items-center">
                        <FileText className="h-16 w-16 mb-4 opacity-10" />
                        <p className="font-black uppercase tracking-tighter text-xl">No Results Found</p>
                        <p className="text-sm">Please ensure grades have been entered in the Gradebook.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
