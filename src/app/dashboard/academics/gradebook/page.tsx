
'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, doc, addDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { 
  TrendingUp, User, PlusCircle, Trophy, BookOpen, AlertCircle, FileText, Loader2, ArrowRight, GraduationCap, CheckSquare 
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
import { Label } from '@/components/ui/label';
import { AssessmentFeedbackForm } from '../assessments/assessment-feedback-form';
import { useToast } from '@/hooks/use-toast';

// Imports
import { GenerateReportCard } from './report-card-pdf';

// Types
import { Assessment, FinancialRecord, Class, Student } from '@/lib/types';

// Define Subject Type locally if needed
type Subject = { id: string; name: string; code?: string };

// --- HELPER: Grading Logic ---
function getGrade(percentage: number) {
    if (percentage >= 80) return { grade: 'A', remark: 'Excellent' };
    if (percentage >= 70) return { grade: 'B', remark: 'Very Good' };
    if (percentage >= 60) return { grade: 'C', remark: 'Good' };
    if (percentage >= 50) return { grade: 'D', remark: 'Pass' };
    return { grade: 'F', remark: 'Fail' };
}

// --- SUB-COMPONENT: Student Promotion Tool ---
function PromoteStudentsTab({ classes }: { classes: Class[] | undefined }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [fromClassId, setFromClassId] = useState('');
    const [toClassId, setToClassId] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
    const [isPromoting, setIsPromoting] = useState(false);

    // Fetch students from the "Source" class
    const studentsQuery = useMemoFirebase(() => 
        (firestore && fromClassId) ? query(collection(firestore, 'students'), where('classId', '==', fromClassId)) : null,
    [firestore, fromClassId]);
    
    const { data: students, isLoading } = useCollection<Student>(studentsQuery);

    const toggleStudent = (id: string) => {
        const newSet = new Set(selectedStudentIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedStudentIds(newSet);
    };

    const toggleAll = () => {
        if (!students) return;
        if (selectedStudentIds.size === students.length) {
            setSelectedStudentIds(new Set());
        } else {
            setSelectedStudentIds(new Set(students.map(s => s.uid)));
        }
    };

    const handlePromote = async () => {
        if (!firestore || selectedStudentIds.size === 0) return;
        if (!toClassId) {
            toast({ variant: 'destructive', title: "Select Destination", description: "Please select which class to move them to." });
            return;
        }

        if (!confirm(`Are you sure you want to move ${selectedStudentIds.size} students?`)) return;

        setIsPromoting(true);
        try {
            const batch = writeBatch(firestore);
            
            selectedStudentIds.forEach(studentId => {
                const studentRef = doc(firestore, 'students', studentId);
                
                if (toClassId === 'GRADUATED') {
                    batch.update(studentRef, { classId: 'GRADUATED', status: 'Alumni', graduatedAt: serverTimestamp() });
                } else {
                    batch.update(studentRef, { classId: toClassId });
                }
            });

            await batch.commit();
            toast({ title: "Promotion Successful", description: `Moved ${selectedStudentIds.size} students.` });
            setSelectedStudentIds(new Set());
            setFromClassId('');
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsPromoting(false);
        }
    };

    return (
        <Card className="border-t-4 border-t-emerald-600">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-emerald-600"/> Student Promotion
                </CardTitle>
                <CardDescription>Move students to the next class at the end of the academic year.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end bg-slate-50 p-4 rounded-lg border">
                    <div className="space-y-2">
                        <Label>From Class (Current)</Label>
                        <Select value={fromClassId} onValueChange={setFromClassId}>
                            <SelectTrigger className="bg-white"><SelectValue placeholder="Select Source Class" /></SelectTrigger>
                            <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="flex justify-center pb-2"><ArrowRight className="h-6 w-6 text-slate-400" /></div>
                    <div className="space-y-2">
                        <Label>To Class (Next Level)</Label>
                        <Select value={toClassId} onValueChange={setToClassId}>
                            <SelectTrigger className="bg-white"><SelectValue placeholder="Select Destination" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="GRADUATED" className="text-red-600 font-bold">🎓 Mark as Graduated</SelectItem>
                                {classes?.filter(c => c.id !== fromClassId).map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {fromClassId && (
                    <div className="border rounded-md">
                        <div className="p-2 border-b bg-slate-100 flex justify-between items-center">
                            <h4 className="font-semibold text-sm pl-2">Select Students ({selectedStudentIds.size}/{students?.length || 0})</h4>
                            <Button variant="ghost" size="sm" onClick={toggleAll}>{students && selectedStudentIds.size === students.length ? "Unselect All" : "Select All"}</Button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {isLoading ? <div className="p-8 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></div> : 
                            !students || students.length === 0 ? <div className="p-8 text-center text-muted-foreground">No students in this class.</div> : (
                                <Table>
                                    <TableHeader><TableRow><TableHead className="w-[50px]">Select</TableHead><TableHead>Student Name</TableHead><TableHead>Student ID</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {students.map(student => (
                                            <TableRow key={student.uid} className={selectedStudentIds.has(student.uid) ? "bg-emerald-50" : ""}>
                                                <TableCell>
                                                    <div className={`h-5 w-5 border rounded cursor-pointer flex items-center justify-center ${selectedStudentIds.has(student.uid) ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'}`} onClick={() => toggleStudent(student.uid)}>
                                                        {selectedStudentIds.has(student.uid) && <CheckSquare className="h-3 w-3 text-white" />}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                                                <TableCell className="text-muted-foreground">{student.id.slice(0,8)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </div>
                )}
                <div className="flex justify-end pt-4 border-t">
                    <Button onClick={handlePromote} disabled={isPromoting || selectedStudentIds.size === 0 || !toClassId} className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto">
                        {isPromoting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <GraduationCap className="mr-2 h-4 w-4"/>} Promote {selectedStudentIds.size} Students
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// --- SUB-COMPONENT: Student Academics Detail ---
function StudentGradesDetail({ 
    student, 
    assessments, 
    rank, 
    totalStudents,
    year, 
    term,
    subjectsList // This list comes from the database
}: { 
    student: Student; 
    assessments: Assessment[];
    rank: number;
    totalStudents: number;
    year: string;
    term: string;
    subjectsList: Subject[] | undefined;
}) {
    // Group by Subject
    const subjectGrades = useMemo(() => {
        const subjects: Record<string, { total: number, max: number, count: number }> = {};
        
        assessments.forEach(a => {
            if (a.studentId !== student.uid) return;
            
            // --- FIX: Name Resolution Logic ---
            let displaySub = 'General';

            // Strategy 1: Try finding by the specific subjectId field
            const foundByCode = subjectsList?.find(s => s.id === a.subjectId);

            if (foundByCode) {
                displaySub = foundByCode.name;
            } else if (a.subject) {
                // Strategy 2: Check if the 'subject' text field is actually an ID in our list
                // (This fixes the issue where IDs like 'zO7lg...' were saved as names)
                const foundByNameID = subjectsList?.find(s => s.id === a.subject);
                
                if (foundByNameID) {
                    displaySub = foundByNameID.name;
                } else {
                    // Strategy 3: It's just a text string (legacy data), use it as is
                    displaySub = a.subject;
                }
            }
            // ----------------------------------
            
            if (!subjects[displaySub]) subjects[displaySub] = { total: 0, max: 0, count: 0 };
            
            subjects[displaySub].total += a.score || 0;
            subjects[displaySub].max += a.maxScore || 0;
            subjects[displaySub].count++;
        });

        return Object.entries(subjects).map(([name, data]) => {
            const percentage = data.max > 0 ? (data.total / data.max) * 100 : 0;
            return { name, percentage, ...getGrade(percentage) };
        });
    }, [assessments, student.uid, subjectsList]);

    const overallAverage = subjectGrades.length > 0 
        ? subjectGrades.reduce((acc, s) => acc + s.percentage, 0) / subjectGrades.length 
        : 0;

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
                
                {/* PDF REPORT CARD BUTTON */}
                <Card className="bg-white border-slate-200 shadow-sm">
                     <CardContent className="p-4 flex flex-col justify-center h-full">
                        <GenerateReportCard 
                            student={student}
                            assessments={assessments.filter(a => a.studentId === student.uid)}
                            year={year}
                            term={term}
                            rank={rank}
                            totalStudents={totalStudents}
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
                        {subjectGrades.map((sub) => (
                            <TableRow key={sub.name}>
                                <TableCell className="font-medium">{sub.name}</TableCell>
                                <TableCell className="text-right">{sub.percentage.toFixed(1)}%</TableCell>
                                <TableCell className="text-center"><Badge variant={sub.grade === 'F' ? 'destructive' : 'outline'}>{sub.grade}</Badge></TableCell>
                                <TableCell className="text-muted-foreground text-sm">{sub.remark}</TableCell>
                            </TableRow>
                        ))}
                        {subjectGrades.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No grades recorded yet.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </div>
            
            {/* Raw Assessments List */}
            <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-slate-600"><BookOpen className="h-4 w-4"/> Detailed Assessment Log</h4>
                <div className="space-y-1">
                    {assessments.filter(a => a.studentId === student.uid).map(a => {
                        // FIX: Logic for displaying name in the detailed list
                        let displaySub = a.subject || 'General';
                        
                        // Check if ID matches a known subject
                        const foundSub = subjectsList?.find(s => s.id === a.subjectId || s.id === a.subject);
                        if (foundSub) displaySub = foundSub.name;

                        return (
                            <div key={a.id} className="flex justify-between text-sm py-2 px-3 hover:bg-slate-50 rounded border border-transparent hover:border-slate-100 transition-colors">
                                <div className="flex flex-col">
                                    <span className="font-medium">{a.assessmentName}</span>
                                    <span className="text-xs text-slate-400">{displaySub} • {a.assessmentType}</span>
                                </div>
                                <span className="font-mono font-medium">{a.score}/{a.maxScore}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// --- MAIN PAGE ---
export default function GradebookManager() {
  const { user, isUserLoading } = useUser(); 
  const { role, isRoleLoading } = useRole();
  const firestore = useFirestore();

  // State
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(MOCK_TERMS[0]);
  const [selectedYear, setSelectedYear] = useState(MOCK_ACADEMIC_YEARS[0]);

  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);

  // 1. Fetch Classes (Correctly handled for both Admin and Teacher)
  const classesQuery = useMemoFirebase(() => {
      if (!firestore || !user || !isStaff) return null;
      if (role === 'Administrator' || role === 'Director') {
          return query(collection(firestore, 'classes'));
      }
      if (role === 'Teacher') {
          return query(collection(firestore, 'classes'), where('teacherId', '==', user.uid));
      }
      return null;
  }, [firestore, user, role, isStaff]);
  
  const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

  // 2. Fetch Students
  const studentsQuery = useMemoFirebase(() => 
    (firestore && selectedClassId) ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId)) : null,
  [firestore, selectedClassId]);
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
  }, [firestore, selectedClassId, selectedYear, selectedTerm]);
  const { data: assessments, isLoading: isLoadingAssessments } = useCollection<Assessment>(assessmentsQuery);

  // 4. Fetch Financials
  const financialRecordsQuery = useMemoFirebase(() => 
    (firestore && selectedClassId) ? query(collection(firestore, 'financialRecords'), where('classId', '==', selectedClassId)) : null,
  [firestore, selectedClassId]);
  const { data: financialRecords, isLoading: isLoadingFinancial } = useCollection<FinancialRecord>(financialRecordsQuery);

  // 5. FETCH SUBJECTS (NEW - Needed for mapping IDs to Names)
  const subjectsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'subjects')) : null, 
  [firestore]);
  const { data: allSubjects } = useCollection<Subject>(subjectsQuery);

  // --- DERIVED DATA ---
  
  // A. Calculate Ranks
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

  // B. Financials Map
  const studentFinancials = useMemo(() => {
    if (!students || !financialRecords) return {};
    const financials: Record<string, { balance: number }> = {};

    students.forEach(student => {
        const myRecords = financialRecords.filter(r => r.studentId === student.uid);
        const billed = myRecords.reduce((acc, r) => acc + r.billedAmount, 0);
        const paid = myRecords.reduce((acc, r) => acc + r.amountPaid, 0);
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
                {/* ACTION BUTTONS */}
                <div className="flex gap-2">
                    <Button 
                        variant={activeForm === 'grade' ? 'secondary' : 'outline'} 
                        onClick={() => setActiveForm(activeForm === 'grade' ? null : 'grade')} 
                        disabled={!selectedClassId}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Enter Grades
                    </Button>
                </div>
            </div>
        </CardHeader>
        
        {/* FILTERS */}
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
                    {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
             </Select>
          </div>
        </CardContent>
      </Card>

      {/* GRADE ENTRY FORM (Conditional) */}
      {activeForm === 'grade' && selectedClassId && (
          <div className="animate-in slide-in-from-top-4 fade-in duration-300">
              <AssessmentFeedbackForm classId={selectedClassId} classes={classes || []} />
          </div>
      )}
      
      {/* STUDENT LIST */}
      <Tabs defaultValue="academics" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="academics">Report Cards</TabsTrigger>
            {(role === 'Administrator' || role === 'Director') && (
                <TabsTrigger value="promotion">Promote Class</TabsTrigger>
            )}
        </TabsList>

        <TabsContent value="academics" className="mt-6">
            {selectedClassId && (
                <Card>
                    <CardHeader className="py-4 px-6 border-b bg-white">
                        <CardTitle className="text-lg">Class Performance Report</CardTitle>
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
                                                        {financials.balance > 0 ? `Owes: GH₵${financials.balance}` : 'Fees Paid'}
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
                                                        <TabsTrigger value="academics" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none shadow-none">Report Card</TabsTrigger>
                                                        <TabsTrigger value="financials" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none shadow-none">Fee History</TabsTrigger>
                                                    </TabsList>
                                                </div>

                                                <TabsContent value="academics" className="mt-0">
                                                    <StudentGradesDetail 
                                                        student={student} 
                                                        assessments={assessments || []} 
                                                        rank={rank}
                                                        totalStudents={rankedStudents.length}
                                                        year={selectedYear}
                                                        term={selectedTerm}
                                                        subjectsList={allSubjects} // <--- PASSING THE SUBJECTS HERE
                                                    />
                                                </TabsContent>

                                                <TabsContent value="financials" className="mt-0 p-6">
                                                    <div className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow-sm max-w-md">
                                                        <div className="bg-slate-100 p-3 rounded-full"><AlertCircle className="h-6 w-6 text-slate-500"/></div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-500">Current Balance</p>
                                                            <p className="text-2xl font-bold text-slate-800">GH₵{financials.balance.toFixed(2)}</p>
                                                        </div>
                                                        <Button variant="outline" size="sm" className="ml-auto">View Ledger</Button>
                                                    </div>
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
             {!selectedClassId && <div className="text-center py-10 text-muted-foreground">Select a class above to view grades.</div>}
        </TabsContent>

        <TabsContent value="promotion" className="mt-6">
            <PromoteStudentsTab classes={classes} />
        </TabsContent>
      </Tabs>
    </div>
  );
}