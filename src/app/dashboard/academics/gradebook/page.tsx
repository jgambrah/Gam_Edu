
'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, where, doc, writeBatch } from 'firebase/firestore';
import { 
  TrendingUp, Trophy, FileText, Loader2, Eye, Calendar, Receipt, 
  AlertCircle, RefreshCw, PlusCircle, Check, XCircle, Pencil
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

// --- SUB-COMPONENT: Transaction Detail Modal ---
function TransactionDetailModal({ record, open, setOpen }: { record: FinancialRecord | null, open: boolean, setOpen: (o: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-indigo-600"/> Transaction Ledger
                    </DialogTitle>
                    <DialogDescription>
                        Details for Transaction ID: <span className="font-mono text-xs">{record?.id ? record.id.slice(0, 8) : '...'}...</span>
                    </DialogDescription>
                </DialogHeader>

                {record ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Type</p>
                                <Badge variant="outline">{record.type}</Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">Status</p>
                                <Badge variant={record.status === 'Paid' ? 'default' : 'destructive'}>{record.status}</Badge>
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Description</p>
                            <div className="p-3 bg-slate-50 rounded-md border text-sm">{record.description}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Billed Amount</p>
                                <p className="text-lg font-bold text-slate-800">GH₵{record.billedAmount.toFixed(2)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-500 mb-1">Amount Paid</p>
                                <p className="text-lg font-bold text-green-600">GH₵{(record.amountPaid || 0).toFixed(2)}</p>
                            </div>
                        </div>

                        <Separator />
                        
                        <div className="space-y-2 text-xs text-slate-500">
                            <div className="flex justify-between">
                                <span className="flex items-center gap-1"><Calendar className="h-3 w-3"/> Created At:</span>
                                <span>{record.createdAt ? format(record.createdAt.toDate(), 'PPP p') : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3"/> Due Date:</span>
                                <span className="text-red-500 font-medium">{record.dueDate ? format(record.dueDate.toDate(), 'PPP') : 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-10 text-center text-muted-foreground">Loading details...</div>
                )}
            </DialogContent>
        </Dialog>
    );
}

// --- SUB-COMPONENT: Fee History ---
function FeeHistoryDetail({ student, financialRecords }: { student: Student; financialRecords: FinancialRecord[] }) {
    const [selectedRecord, setSelectedRecord] = useState<FinancialRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const studentRecords = useMemo(() => {
        return (financialRecords || [])
            .filter(r => r.studentId === student.uid)
            .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)); 
    }, [financialRecords, student.uid]);

    const handleViewDetails = (record: FinancialRecord) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    if (studentRecords.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-lg m-4">
                <p className="text-muted-foreground">No financial records found for this student.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Billed</TableHead>
                            <TableHead className="text-right">Paid</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="w-[80px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {studentRecords.map((record) => (
                            <TableRow key={record.id} className="hover:bg-slate-50/50">
                                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                                    {record.createdAt ? format(record.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A'}
                                </TableCell>
                                <TableCell className="max-w-[200px]">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-sm truncate">{record.description}</span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">{record.type}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono">GH₵{record.billedAmount.toFixed(2)}</TableCell>
                                <TableCell className="text-right font-mono text-green-600">GH₵{(record.amountPaid || 0).toFixed(2)}</TableCell>
                                <TableCell className="text-center">
                                    {record.status === 'Paid' ? (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Paid</Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">Unpaid</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 text-xs h-8"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewDetails(record);
                                        }}
                                    >
                                        <Eye className="h-3 w-3 mr-1"/> View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <TransactionDetailModal 
                record={selectedRecord} 
                open={isModalOpen} 
                setOpen={setIsModalOpen} 
            />
        </div>
    );
}

// --- SUB-COMPONENT: Student Academics Detail ---
function StudentGradesDetail({ 
    student, 
    assessments, 
    rank, 
    totalStudents,
    term,
    year,
    subjects
}: { 
    student: Student; 
    assessments: Assessment[];
    rank: number;
    totalStudents: number;
    term: string;
    year: string;
    subjects: any[];
}) {
    const firestore = useFirestore();
    const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
    const [newSubjectId, setNewSubjectId] = useState<string>('');

    // 1. Smart Map for Subjects
    const subjectMap = useMemo(() => {
        const map = new Map<string, string>();
        if(subjects && subjects.length > 0) {
            subjects.forEach(s => {
                const name = s.name || s.title || s.subjectName || s.label || s.subject || "Unnamed Subject";
                map.set(s.id, name);
            });
        }
        return map;
    }, [subjects]);

    // 2. Group by Subject Logic
    const subjectGrades = useMemo(() => {
        const grouped: Record<string, { name: string, total: number, max: number, count: number, id: string, assessmentIds: string[] }> = {};
        
        assessments.forEach(a => {
            if (a.studentId !== student.uid) return;
            
            const subId = a.subjectId || 'unknown';
            
            // Priority 1: Check Map
            let subName = subjectMap.get(subId);
            
            // Priority 2: Check assessment cache
            if (!subName) subName = (a as any).subjectName;

            // Priority 3: Fallback 
            if (!subName) subName = 'Unknown Subject';

            if (!grouped[subId]) {
                grouped[subId] = { name: subName, total: 0, max: 0, count: 0, id: subId, assessmentIds: [] };
            }
            
            // Fix display name if we found a better one later in the loop
            if (grouped[subId].name === 'Unknown Subject' && subName !== 'Unknown Subject') {
                grouped[subId].name = subName;
            }
            
            grouped[subId].total += a.score || 0;
            grouped[subId].max += a.maxScore || 0;
            grouped[subId].count++;
            grouped[subId].assessmentIds.push(a.id); 
        });

        return Object.values(grouped).map((data) => {
            const percentage = data.max > 0 ? (data.total / data.max) * 100 : 0;
            return { ...data, percentage, ...getGrade(percentage) };
        });
    }, [assessments, student.uid, subjectMap]);

    const overallAverage = subjectGrades.length > 0 
        ? subjectGrades.reduce((acc, s) => acc + s.percentage, 0) / subjectGrades.length 
        : 0;

    // --- FIX HANDLER ---
    const handleUpdateSubject = async (oldSubjectId: string, assessmentIds: string[]) => {
        if (!firestore || !newSubjectId) return;
        try {
            const selectedSubject = subjects.find(s => s.id === newSubjectId);
            if (!selectedSubject) return;

            const batch = writeBatch(firestore);
            assessmentIds.forEach(id => {
                const ref = doc(firestore, 'assessments', id);
                batch.update(ref, {
                    subjectId: selectedSubject.id,
                    subjectName: selectedSubject.name
                });
            });

            await batch.commit();
            setEditingSubjectId(null);
        } catch (e) {
            console.error("Error updating subject", e);
        }
    };

    return (
        <div className="space-y-6 p-4">
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-indigo-50 border-indigo-100 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <Trophy className="h-8 w-8 text-indigo-600"/>
                        <div>
                            <p className="text-xs font-semibold text-indigo-600 uppercase">Class Position</p>
                            <p className="text-2xl font-bold text-slate-800">{rank} <span className="text-sm text-slate-400 font-normal">/ {totalStudents}</span></p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-emerald-100 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                        <TrendingUp className="h-8 w-8 text-emerald-600"/>
                        <div>
                            <p className="text-xs font-semibold text-emerald-600 uppercase">Overall Average</p>
                            <p className="text-2xl font-bold text-slate-800">{overallAverage.toFixed(1)}%</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                     <CardContent className="p-4 flex flex-col justify-center h-full items-center">
                        <GenerateReportCard
                            student={student}
                            assessments={assessments || []}
                            year={year}
                            term={term}
                            rank={rank}
                            totalStudents={totalStudents}
                            subjects={subjects || []}
                        />
                     </CardContent>
                </Card>
            </div>

            {/* Subject Breakdown Table */}
            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead className="text-right">Score (%)</TableHead>
                            <TableHead className="text-center">Grade</TableHead>
                            <TableHead>Remark</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subjectGrades.map((sub) => {
                            // Only show edit if name is weirdly long/unknown (looks like ID)
                            const isBroken = sub.name === 'Unknown Subject' || (sub.name.length > 15 && !sub.name.includes(' '));
                            const isEditing = editingSubjectId === sub.id;

                            return (
                                <TableRow key={sub.id}>
                                    <TableCell className="font-medium">
                                        {isEditing ? (
                                            <div className="flex gap-2 items-center">
                                                <Select value={newSubjectId} onValueChange={setNewSubjectId}>
                                                    <SelectTrigger className="h-8 w-[180px]"><SelectValue placeholder="Select Subject"/></SelectTrigger>
                                                    <SelectContent>
                                                        {subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                                <Button size="sm" onClick={() => handleUpdateSubject(sub.id, sub.assessmentIds)} className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700">
                                                    <Check className="h-4 w-4"/>
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingSubjectId(null)} className="h-8 w-8 p-0">
                                                    <XCircle className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span>{sub.name}</span>
                                                {/* Hidden unless broken */}
                                                {isBroken && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-6 px-2 text-xs text-orange-400 hover:text-orange-600 hover:bg-orange-50"
                                                        onClick={() => {
                                                            setEditingSubjectId(sub.id);
                                                            setNewSubjectId('');
                                                        }}
                                                    >
                                                        <Pencil className="h-3 w-3"/>
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">{sub.percentage.toFixed(1)}%</TableCell>
                                    <TableCell className="text-center"><Badge variant={sub.grade === 'F' ? 'destructive' : 'outline'}>{sub.grade}</Badge></TableCell>
                                    <TableCell className="text-muted-foreground text-sm">{sub.remark}</TableCell>
                                </TableRow>
                            );
                        })}
                        {subjectGrades.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No grades recorded yet.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// --- MAIN PAGE ---
export default function GradebookManager() {
  const { user, isUserLoading } = useUser();
  const { role, isRoleLoading } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  // State
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(MOCK_TERMS[0]);
  const [selectedYear, setSelectedYear] = useState(MOCK_ACADEMIC_YEARS[0]);
  
  const [refreshKey, setRefreshKey] = useState(0);

  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role || '');

  const forceRefresh = () => {
      setRefreshKey(prev => prev + 1);
      toast({ title: "Refreshing..." });
  };

  // 1. Fetch Classes
  const classesQuery = useMemoFirebase(() => {
      if (!firestore || !user || !isStaff) return null;
      if (role === 'Administrator' || role === 'Director') return query(collection(firestore, 'classes'));
      if (role === 'Teacher') return query(collection(firestore, 'classes'), where('teacherId', '==', user.uid));
      return null;
  }, [firestore, user, role, isStaff, refreshKey]);
  
  const { data: teacherClasses, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

  // 2. Fetch Students
  const studentsQuery = useMemoFirebase(() => 
    (firestore && selectedClassId) ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId)) : null,
  [firestore, selectedClassId, refreshKey]);
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);
  
  // 3. Fetch Assessments
  const assessmentsQuery = useMemoFirebase(() => {
    if (!selectedClassId || !firestore) return null;
    return query(
        collection(firestore, 'assessments'),
        where('classId', '==', selectedClassId),
        where('academicYear', '==', selectedYear),
        where('term', '==', selectedTerm)
    );
  }, [firestore, selectedClassId, selectedYear, selectedTerm, refreshKey]); 
  const { data: assessments, isLoading: isLoadingAssessments } = useCollection<Assessment>(assessmentsQuery);

  // 4. Fetch Financials
  const financialRecordsQuery = useMemoFirebase(() => 
    (firestore && selectedClassId) ? query(collection(firestore, 'financialRecords'), where('classId', '==', selectedClassId)) : null,
  [firestore, selectedClassId, refreshKey]);
  const { data: financialRecords, isLoading: isLoadingFinancial } = useCollection<FinancialRecord>(financialRecordsQuery);

  // 5. Fetch Subjects
  const subjectsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'subjects') : null, [firestore, refreshKey]);
  const { data: subjects } = useCollection<any>(subjectsQuery);

  // --- DERIVED DATA ---
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

  const studentFinancials = useMemo(() => {
    if (!students || !financialRecords) return {};
    const financials: Record<string, { balance: number }> = {};
    students.forEach(student => {
        const myRecords = financialRecords.filter(r => r.studentId === student.uid);
        const billed = myRecords.reduce((acc, r) => acc + r.billedAmount, 0);
        const paid = myRecords.reduce((acc, r) => acc + (r.amountPaid || 0), 0);
        financials[student.uid] = { balance: billed - paid };
    });
    return financials;
  }, [students, financialRecords]);

  const isLoading = isUserLoading || isRoleLoading || isLoadingClasses || (selectedClassId && (isLoadingStudents || isLoadingAssessments || isLoadingFinancial));

  if (!isStaff && !isLoading) {
      return <div className="p-8 text-center text-red-500">Access Denied. Staff only.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="border-t-4 border-t-indigo-600 shadow-sm">
        <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2 text-xl"><TrendingUp className="text-indigo-600"/> Smart Gradebook 2.0</CardTitle>
                    <CardDescription>Comprehensive academic reporting and fee tracking.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    
                    <Button variant="outline" size="sm" onClick={forceRefresh} title="Reload Data" className="h-9">
                        <RefreshCw className="mr-2 h-3 w-3 text-slate-500"/> Refresh
                    </Button>

                    <Button 
                        variant={activeForm === 'grade' ? 'secondary' : 'default'} 
                        onClick={() => setActiveForm(activeForm === 'grade' ? null : 'grade')} 
                        disabled={!selectedClassId}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white h-9"
                    >
                        {activeForm === 'grade' ? <XCircle className="mr-2 h-4 w-4"/> : <PlusCircle className="mr-2 h-4 w-4"/>} 
                        {activeForm === 'grade' ? "Close Form" : "Enter Grades"}
                    </Button>
                </div>
            </div>
        </CardHeader>
        
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-6 border-t border-b">
          <div className="space-y-1">
             <span className="text-xs font-semibold text-slate-500 uppercase">Academic Year</span>
             <Select onValueChange={setSelectedYear} defaultValue={selectedYear}>
                <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>{MOCK_ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
             </Select>
          </div>
          <div className="space-y-1">
             <span className="text-xs font-semibold text-slate-500 uppercase">Term</span>
             <Select onValueChange={setSelectedTerm} defaultValue={selectedTerm}>
                <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                <SelectContent>{MOCK_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
             </Select>
          </div>
          <div className="space-y-1">
             <span className="text-xs font-semibold text-slate-500 uppercase">Class</span>
             <Select onValueChange={setSelectedClassId} disabled={isLoadingClasses}>
                <SelectTrigger className="bg-white">
                    <SelectValue placeholder={isLoadingClasses ? "Loading..." : "Select Class..."} />
                </SelectTrigger>
                <SelectContent>
                    {teacherClasses?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
             </Select>
          </div>
        </CardContent>
      </Card>

      {activeForm === 'grade' && selectedClassId && (
          <div className="animate-in slide-in-from-top-4 fade-in duration-300">
              <AssessmentFeedbackForm classId={selectedClassId} classes={teacherClasses || []} />
          </div>
      )}
      
      {selectedClassId && (
        <Card>
            <CardHeader className="py-4 px-6 border-b bg-white flex flex-row justify-between items-center">
                <CardTitle className="text-lg">Class Performance Report</CardTitle>
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">
                    {rankedStudents.length} Students
                </Badge>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                    <div className="flex flex-col items-center py-12 gap-2 text-muted-foreground">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        <p>Compiling results...</p>
                    </div>
                ) :
                rankedStudents.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {rankedStudents.map((student, index) => {
                        const financials = studentFinancials[student.uid] || { balance: 0 };
                        const rank = index + 1; 
                        
                        return (
                            <AccordionItem value={student.uid} key={student.uid} className="px-4 border-b last:border-0 hover:bg-slate-50 transition-colors">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center w-full pr-4 gap-2'>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${rank <= 3 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400' : 'bg-slate-100 text-slate-500'}`}>
                                                {rank}
                                            </div>
                                            <div className="text-left">
                                                <p className="font-semibold text-slate-800">{student.firstName} {student.lastName}</p>
                                                <p className="text-xs text-muted-foreground">ID: {student.id.slice(0,6)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className={`${financials.balance > 0 ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>
                                                {financials.balance > 0 ? `Owes: GH₵${financials.balance.toFixed(2)}` : 'Fees Paid'}
                                            </Badge>
                                            <Badge className={student.average >= 50 ? "bg-indigo-600" : "bg-red-500"}>
                                                Avg: {student.average.toFixed(1)}%
                                            </Badge>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-0 border-t bg-slate-50/50">
                                    <Tabs defaultValue="academics" className="w-full">
                                        <div className="px-4 pt-2 border-b bg-white">
                                            <TabsList className="bg-transparent h-10 p-0">
                                                <TabsTrigger value="academics" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none shadow-none text-sm px-4">Report Card</TabsTrigger>
                                                <TabsTrigger value="financials" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none shadow-none text-sm px-4">Fee History</TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <TabsContent value="academics" className="mt-0">
                                            <StudentGradesDetail 
                                                student={student} 
                                                assessments={assessments || []} 
                                                rank={rank}
                                                totalStudents={rankedStudents.length}
                                                term={selectedTerm}
                                                year={selectedYear}
                                                subjects={subjects || []}
                                            />
                                        </TabsContent>

                                        <TabsContent value="financials" className="mt-0">
                                            <FeeHistoryDetail 
                                                student={student} 
                                                financialRecords={financialRecords || []}
                                            />
                                        </TabsContent>
                                    </Tabs>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
                ) : (
                    <div className="text-center py-16">
                        <FileText className="mx-auto h-12 w-12 text-slate-300 mb-2"/>
                        <p className="text-muted-foreground">No students found.</p>
                        <p className="text-xs text-slate-400">Select a different class or add students.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}


    