
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, doc, writeBatch, updateDoc, setDoc, getDocs } from 'firebase/firestore';
import { 
  TrendingUp, Trophy, BookOpen, FileText, Loader2, Eye, Calendar, Receipt, 
  AlertCircle, RefreshCw, Bug, PlusCircle, XCircle, Pencil, Check, MessageSquare 
} from 'lucide-react';
import { format } from 'date-fns';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

import { AssessmentFeedbackForm } from '../../assessments/assessment-feedback-form';
import { GenerateReportCard } from './report-card-pdf';

// Types
import { Assessment, FinancialRecord, Class, Student } from '@/lib/types';

// --- HELPER: Grading Logic ---
function getGrade(percentage: number) {
    if (percentage >= 80) return { grade: 'A', remark: 'Excellent' };
    if (percentage >= 70) return { grade: 'B', remark: 'Very Good' };
    if (percentage >= 60) return { grade: 'C', remark: 'Good' };
    if (percentage >= 50) return { grade: 'D', remark: 'Pass' };
    return { grade: 'F', remark: 'Fail' };
}

// --- SUB-COMPONENT: Remarks Form (New Feature) ---
function RemarksForm({ 
    studentId, classId, year, term, existingRemark, onRefresh 
}: { 
    studentId: string, classId: string, year: string, term: string, existingRemark: any, onRefresh: () => void 
}) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [teacherRemark, setTeacherRemark] = useState(existingRemark?.teacherRemark || '');
    const [principalRemark, setPrincipalRemark] = useState(existingRemark?.principalRemark || '');
    const [isSaving, setIsSaving] = useState(false);

    // Update state if existingRemark changes from parent
    useEffect(() => {
        setTeacherRemark(existingRemark?.teacherRemark || '');
        setPrincipalRemark(existingRemark?.principalRemark || '');
    }, [existingRemark]);

    const handleSave = async () => {
        if (!firestore) return;
        setIsSaving(true);
        try {
            // Create a unique ID based on student-year-term
            // We use setDoc with merge to create or update
            const docId = `remark_${studentId}_${year}_${term}`.replace(/[^a-zA-Z0-9_]/g, '_');
            const ref = doc(firestore, 'report_card_remarks', docId);
            
            await setDoc(ref, {
                studentId, classId, academicYear: year, term,
                teacherRemark, principalRemark, updatedAt: new Date()
            }, { merge: true });

            toast({ title: "Saved", description: "Remarks updated." });
            onRefresh();
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error", description: "Failed to save remarks." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 border rounded-md mt-4">
            <div className="space-y-2">
                <Label className="flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Class Teacher's Remark</Label>
                <Textarea 
                    value={teacherRemark} 
                    onChange={(e) => setTeacherRemark(e.target.value)} 
                    placeholder="Enter teacher's comments..."
                    className="bg-white min-h-[80px]"
                />
            </div>
            <div className="space-y-2">
                <Label className="flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Headmaster/Principal's Remark</Label>
                <Textarea 
                    value={principalRemark} 
                    onChange={(e) => setPrincipalRemark(e.target.value)} 
                    placeholder="Enter principal's comments..."
                    className="bg-white min-h-[80px]"
                />
            </div>
            <div className="md:col-span-2 flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin"/> : <Check className="h-4 w-4 mr-2"/>}
                    Save Remarks
                </Button>
            </div>
        </div>
    );
}

// ... (TransactionDetailModal & FeeHistoryDetail remain the same - omitted for brevity) ...
// (Assume standard imports for FeeHistoryDetail here)
// import { FeeHistoryDetail } from './fee-history-detail'; // Or paste the code if inline

// --- SUB-COMPONENT: Student Academics Detail ---
function StudentGradesDetail({ 
    student, assessments, rank, totalStudents, term, year, subjects, isDebug, 
    customRemark, onRefresh // NEW PROPS
}: { 
    student: Student; assessments: Assessment[]; rank: number; totalStudents: number; 
    term: string; year: string; subjects: any[]; isDebug: boolean;
    customRemark: any; onRefresh: () => void;
}) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
    const [newSubjectId, setNewSubjectId] = useState<string>('');

    // 1. Subject Map
    const subjectMap = useMemo(() => {
        const map = new Map<string, string>();
        if(subjects) subjects.forEach(s => map.set(s.id, s.name || s.title || "Unnamed"));
        return map;
    }, [subjects]);

    // 2. GLOBAL STATS (FIXED: Uses 50/50 logic for Class Average)
    const globalSubjectStats = useMemo(() => {
        // Map<SubjectID, Map<StudentID, { ca: 0, caMax: 0, exam: 0, examMax: 0 }>>
        const grouping: Record<string, Record<string, { ca: number, caMax: number, exam: number, examMax: number }>> = {};

        // A. Aggregate Raw Scores per Student per Subject
        assessments.forEach(a => {
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

        // B. Calculate Averages
        const stats: Record<string, { average: number, studentScores: Record<string, number> }> = {};
        
        Object.keys(grouping).forEach(subId => {
            const studentsInSub = grouping[subId];
            let totalPercentageSum = 0;
            let count = 0;
            const scoresMap: Record<string, number> = {};

            Object.entries(studentsInSub).forEach(([uid, data]) => {
                const caPct = data.caMax > 0 ? (data.ca / data.caMax) * 50 : 0;
                const examPct = data.examMax > 0 ? (data.exam / data.examMax) * 50 : 0;
                const total = caPct + examPct; // This is the final mark for this student (e.g., 78.5)
                
                scoresMap[uid] = total;
                totalPercentageSum += total;
                count++;
            });

            stats[subId] = {
                average: count > 0 ? totalPercentageSum / count : 0, // This is now the avg of totals
                studentScores: scoresMap
            };
        });
        
        return stats;
    }, [assessments]);

    // 3. STUDENT SPECIFIC CALCULATION
    const subjectGrades = useMemo(() => {
        const grouped: Record<string, { 
            name: string, id: string, caObtained: number, caMax: number, 
            examObtained: number, examMax: number, assessmentIds: string[] 
        }> = {};
        
        assessments.forEach(a => {
            if (a.studentId !== student.uid) return;
            const subId = a.subjectId || 'unknown';
            let subName = (a as any).subjectName || subjectMap.get(subId);
            if (!subName) subName = isDebug ? `ID: ${subId}` : 'Unknown Subject';

            if (!grouped[subId]) grouped[subId] = { name: subName, id: subId, caObtained: 0, caMax: 0, examObtained: 0, examMax: 0, assessmentIds: [] };
            if (grouped[subId].name.startsWith('ID:') && !subName.startsWith('ID:')) grouped[subId].name = subName;

            const type = (a.assessmentType || '').toLowerCase();
            const isExam = type.includes('exam') || type.includes('term');
            if (isExam) {
                grouped[subId].examObtained += (a.score || 0);
                grouped[subId].examMax += (a.maxScore || 0);
            } else {
                grouped[subId].caObtained += (a.score || 0);
                grouped[subId].caMax += (a.maxScore || 0);
            }
            grouped[subId].assessmentIds.push(a.id);
        });

        return Object.values(grouped).map((data) => {
            const caRaw = data.caMax > 0 ? (data.caObtained / data.caMax) : 0;
            const caWeighted = caRaw * 50; 
            const examRaw = data.examMax > 0 ? (data.examObtained / data.examMax) : 0;
            const examWeighted = examRaw * 50;
            const totalPercent = caWeighted + examWeighted;

            // Stats from Global
            const stats = globalSubjectStats[data.id];
            let classAvg = stats ? stats.average : 0; // This is now correct 50/50 avg
            let subRank = 0;
            let totalSubStudents = 0;
            if (stats) {
                const allScores = Object.values(stats.studentScores).sort((a,b) => b - a);
                subRank = allScores.findIndex(s => Math.abs(s - totalPercent) < 0.01) + 1;
                totalSubStudents = allScores.length;
            }

            return { ...data, caWeighted, examWeighted, totalPercent, classAvg, rank: subRank, totalSubStudents, ...getGrade(totalPercent) };
        });
    }, [assessments, student.uid, subjectMap, isDebug, globalSubjectStats]);

    const overallAverage = subjectGrades.length > 0 
        ? subjectGrades.reduce((acc, s) => acc + s.totalPercent, 0) / subjectGrades.length 
        : 0;

    // Fix Handler
    const handleUpdateSubject = async (oldSubjectId: string, assessmentIds: string[]) => {
        if (!firestore || !newSubjectId) return;
        try {
            const selectedSubject = subjects.find(s => s.id === newSubjectId);
            if (!selectedSubject) return;
            const batch = writeBatch(firestore);
            assessmentIds.forEach(id => {
                const ref = doc(firestore, 'assessments', id);
                batch.update(ref, { subjectId: selectedSubject.id, subjectName: selectedSubject.name });
            });
            await batch.commit();
            toast({ title: "Fixed", description: "Subject updated." });
            setEditingSubjectId(null);
        } catch (e) { console.error(e); }
    };

    return (
        <div className="space-y-6 p-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-indigo-50 border-indigo-100 shadow-sm"><CardContent className="p-4 flex items-center gap-3"><Trophy className="h-8 w-8 text-indigo-600"/><div><p className="text-xs font-semibold text-indigo-600 uppercase">Class Position</p><p className="text-2xl font-bold text-slate-800">{rank} <span className="text-sm text-slate-400 font-normal">/ {totalStudents}</span></p></div></CardContent></Card>
                <Card className="bg-emerald-50 border-emerald-100 shadow-sm"><CardContent className="p-4 flex items-center gap-3"><TrendingUp className="h-8 w-8 text-emerald-600"/><div><p className="text-xs font-semibold text-emerald-600 uppercase">Overall Average</p><p className="text-2xl font-bold text-slate-800">{overallAverage.toFixed(1)}%</p></div></CardContent></Card>
                <Card className="bg-white border-slate-200 shadow-sm"><CardContent className="p-4 flex flex-col justify-center h-full items-center">
                    <GenerateReportCard 
                        student={student} 
                        assessments={assessments || []} 
                        year={year} term={term} rank={rank} totalStudents={totalStudents} 
                        subjects={subjects || []}
                        customRemark={customRemark} // Pass to PDF
                    />
                </CardContent></Card>
            </div>

            {/* Table */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[20%]">Subject</TableHead>
                            <TableHead className="text-center bg-blue-50/50">C.A. (50%)</TableHead>
                            <TableHead className="text-center bg-purple-50/50">Exam (50%)</TableHead>
                            <TableHead className="text-right font-bold">Total</TableHead>
                            <TableHead className="text-center text-slate-500 text-xs bg-slate-50">Class Avg</TableHead>
                            <TableHead className="text-center text-slate-500 text-xs bg-slate-50">Pos</TableHead>
                            <TableHead className="text-center">Grade</TableHead>
                            <TableHead>Remark</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subjectGrades.map((sub) => {
                            const isEditing = editingSubjectId === sub.id;
                            const isBroken = sub.name.length > 15 && !sub.name.includes(' ');
                            return (
                                <TableRow key={sub.id}>
                                    <TableCell className="font-medium">
                                        {isEditing ? (
                                            <div className="flex gap-2 items-center"><Select value={newSubjectId} onValueChange={setNewSubjectId}><SelectTrigger className="h-8 w-[180px]"><SelectValue placeholder="Select Subject"/></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select><Button size="sm" onClick={() => handleUpdateSubject(sub.id, sub.assessmentIds)} className="h-8 w-8 p-0 bg-green-600"><Check className="h-4 w-4"/></Button><Button size="sm" variant="ghost" onClick={() => setEditingSubjectId(null)} className="h-8 w-8 p-0"><XCircle className="h-4 w-4"/></Button></div>
                                        ) : (
                                            <div className="flex items-center gap-2"><span>{sub.name}</span>{isBroken && <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-orange-400" onClick={() => { setEditingSubjectId(sub.id); setNewSubjectId(''); }}><Pencil className="h-3 w-3"/></Button>}</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center bg-blue-50/20 text-slate-600 font-mono">{sub.caWeighted.toFixed(1)}</TableCell>
                                    <TableCell className="text-center bg-purple-50/20 text-slate-600 font-mono">{sub.examWeighted.toFixed(1)}</TableCell>
                                    <TableCell className="text-right font-bold text-slate-800">{sub.totalPercent.toFixed(1)}%</TableCell>
                                    <TableCell className="text-center text-slate-500 bg-slate-50/30 text-xs">{sub.classAvg.toFixed(1)}%</TableCell>
                                    <TableCell className="text-center font-bold text-slate-700 bg-slate-50/30">{sub.rank}/{sub.totalSubStudents}</TableCell>
                                    <TableCell className="text-center"><Badge variant={sub.grade === 'F' ? 'destructive' : 'outline'}>{sub.grade}</Badge></TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{sub.remark}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
            
            {/* NEW: REMARKS SECTION */}
            <RemarksForm 
                studentId={student.uid} 
                classId={student.classId} 
                year={year} 
                term={term} 
                existingRemark={customRemark}
                onRefresh={onRefresh}
            />
        </div>
    );
}

// --- MAIN PAGE ---
export default function GradebookManager() {
  const { user, isUserLoading } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(MOCK_TERMS[0]);
  const [selectedYear, setSelectedYear] = useState(MOCK_ACADEMIC_YEARS[0]);
  const [showDebug, setShowDebug] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role || '');
  const forceRefresh = () => { setRefreshKey(prev => prev + 1); toast({ title: "Refreshing Data..." }); };

  // Queries (Same as before)
  const classesQuery = useMemoFirebase(() => {
      if (!firestore || !user || !isStaff) return null;
      if (role === 'Administrator' || role === 'Director') return query(collection(firestore, 'classes'));
      if (role === 'Teacher') return query(collection(firestore, 'classes'), where('teacherId', '==', user.uid));
      return null;
  }, [firestore, user, role, isStaff, refreshKey]);
  const { data: teacherClasses, isLoading: loadingClasses } = useCollection<Class>(classesQuery);

  const studentsQuery = useMemoFirebase(() => (firestore && selectedClassId) ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId)) : null, [firestore, selectedClassId, refreshKey]);
  const { data: students, isLoading: loadingStudents } = useCollection<Student>(studentsQuery);
  
  const assessmentsQuery = useMemoFirebase(() => {
    if (!selectedClassId || !firestore) return null;
    return query(collection(firestore, 'assessments'), where('classId', '==', selectedClassId), where('academicYear', '==', selectedYear), where('term', '==', selectedTerm));
  }, [firestore, selectedClassId, selectedYear, selectedTerm, refreshKey]); 
  const { data: assessments, isLoading: loadingAssessments } = useCollection<Assessment>(assessmentsQuery);

  const financialRecordsQuery = useMemoFirebase(() => (firestore && selectedClassId) ? query(collection(firestore, 'financialRecords'), where('classId', '==', selectedClassId)) : null, [firestore, selectedClassId, refreshKey]);
  const { data: financialRecords, isLoading: loadingFinancial } = useCollection<FinancialRecord>(financialRecordsQuery);

  const subjectsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'subjects') : null, [firestore, refreshKey]);
  const { data: subjects } = useCollection<any>(subjectsQuery);

  // --- NEW: Fetch Remarks for this Class/Year/Term ---
  const remarksQuery = useMemoFirebase(() => {
      if (!firestore || !selectedClassId) return null;
      return query(
          collection(firestore, 'report_card_remarks'),
          where('classId', '==', selectedClassId),
          where('academicYear', '==', selectedYear),
          where('term', '==', selectedTerm)
      );
  }, [firestore, selectedClassId, selectedYear, selectedTerm, refreshKey]);
  const { data: remarks } = useCollection<any>(remarksQuery);

  // Derived
  const rankedStudents = useMemo(() => {
      if (!students || !assessments) return [];
      const studentsWithScore = students.map(s => {
          const myAssessments = assessments.filter(a => a.studentId === s.uid);
          const total = myAssessments.reduce((acc, curr) => acc + (curr.score || 0), 0);
          const max = myAssessments.reduce((acc, curr) => acc + (curr.maxScore || 0), 0);
          const average = max > 0 ? (total / max) * 100 : 0;
          return { ...s, average };
      });
      return studentsWithScore.sort((a, b) => b.average - a.average);
  }, [students, assessments]);

  const isLoading = isUserLoading || loadingClasses || (selectedClassId && (loadingStudents || loadingAssessments || loadingFinancial));

  if (!isStaff && !isLoading) return <div className="p-8 text-center text-red-500">Access Denied.</div>;

  return (
    <div className="space-y-6 p-6">
      <Card className="border-t-4 border-t-indigo-600 shadow-sm">
        <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div><CardTitle className="flex items-center gap-2 text-xl"><TrendingUp className="text-indigo-600"/> Smart Gradebook 2.0</CardTitle><CardDescription>Comprehensive academic reporting.</CardDescription></div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={forceRefresh} title="Reload Data" className="h-9"><RefreshCw className="mr-2 h-3 w-3 text-slate-500"/> Refresh</Button>
                    <Button variant={activeForm === 'grade' ? 'secondary' : 'default'} onClick={() => setActiveForm(activeForm === 'grade' ? null : 'grade')} disabled={!selectedClassId} className="bg-indigo-600 hover:bg-indigo-700 text-white h-9">{activeForm === 'grade' ? <XCircle className="mr-2 h-4 w-4"/> : <PlusCircle className="mr-2 h-4 w-4"/>} {activeForm === 'grade' ? "Close Form" : "Enter Grades"}</Button>
                </div>
            </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-6 border-t border-b">
          <div className="space-y-1"><span className="text-xs font-semibold text-slate-500 uppercase">Academic Year</span><Select onValueChange={setSelectedYear} defaultValue={selectedYear}><SelectTrigger className="bg-white"><SelectValue /></SelectTrigger><SelectContent>{MOCK_ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><span className="text-xs font-semibold text-slate-500 uppercase">Term</span><Select onValueChange={setSelectedTerm} defaultValue={selectedTerm}><SelectTrigger className="bg-white"><SelectValue /></SelectTrigger><SelectContent>{MOCK_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><span className="text-xs font-semibold text-slate-500 uppercase">Class</span><Select onValueChange={setSelectedClassId} disabled={loadingClasses}><SelectTrigger className="bg-white"><SelectValue placeholder={loadingClasses ? "Loading..." : "Select Class..."} /></SelectTrigger><SelectContent>{teacherClasses?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select></div>
        </CardContent>
      </Card>

      {activeForm === 'grade' && selectedClassId && <div className="animate-in slide-in-from-top-4 fade-in duration-300"><AssessmentFeedbackForm classId={selectedClassId} classes={teacherClasses || []} /></div>}
      
      {selectedClassId && (
        <Card>
            <CardHeader className="py-4 px-6 border-b bg-white flex flex-row justify-between items-center"><CardTitle className="text-lg">Class Performance Report</CardTitle><Badge variant="secondary" className="bg-slate-100 text-slate-600">{rankedStudents.length} Students</Badge></CardHeader>
            <CardContent className="p-0">
                {isLoading ? <div className="flex flex-col items-center py-12 gap-2 text-muted-foreground"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /><p>Compiling results...</p></div> :
                rankedStudents.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {rankedStudents.map((student, index) => {
                        const rank = index + 1; 
                        // Find this student's specific remark
                        const myRemark = remarks?.find((r: any) => r.studentId === student.uid);

                        return (
                            <AccordionItem value={student.uid} key={student.uid} className="px-4 border-b last:border-0 hover:bg-slate-50 transition-colors">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center w-full pr-4 gap-2'>
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${rank <= 3 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400' : 'bg-slate-100 text-slate-500'}`}>{rank}</div>
                                            <div className="text-left"><p className="font-semibold text-slate-800">{student.firstName} {student.lastName}</p><p className="text-xs text-muted-foreground">ID: {student.id.slice(0,6)}</p></div>
                                        </div>
                                        <Badge className={student.average >= 50 ? "bg-indigo-600" : "bg-red-500"}>Avg: {student.average.toFixed(1)}%</Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-0 border-t bg-slate-50/50">
                                    <Tabs defaultValue="academics" className="w-full">
                                        <div className="px-4 pt-2 border-b bg-white"><TabsList className="bg-transparent h-10 p-0"><TabsTrigger value="academics" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none shadow-none text-sm px-4">Report Card</TabsTrigger><TabsTrigger value="financials" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none shadow-none text-sm px-4">Fee History</TabsTrigger></TabsList></div>
                                        <TabsContent value="academics" className="mt-0">
                                            <StudentGradesDetail 
                                                student={student} 
                                                assessments={assessments || []} 
                                                rank={rank}
                                                totalStudents={rankedStudents.length}
                                                term={selectedTerm}
                                                year={selectedYear}
                                                subjects={subjects || []}
                                                isDebug={showDebug}
                                                customRemark={myRemark}
                                                onRefresh={forceRefresh}
                                            />
                                        </TabsContent>
                                        <TabsContent value="financials" className="mt-0">
                                            <FeeHistoryDetail student={student} financialRecords={financialRecords || []} />
                                        </TabsContent>
                                    </Tabs>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
                ) : <div className="text-center py-16"><FileText className="mx-auto h-12 w-12 text-slate-300 mb-2"/><p className="text-muted-foreground">No students found.</p></div>}
            </CardContent>
        </Card>
      )}
    </div>
  );
}