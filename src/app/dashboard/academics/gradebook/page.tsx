
'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, doc, addDoc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { 
  TrendingUp, User, PlusCircle, Printer, Trophy, BookOpen, AlertCircle, FileText, Loader2, ArrowRight, GraduationCap, CheckSquare, Info 
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

// Define Subject Type locally
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
    subjectsList 
}: { 
    student: Student; 
    assessments: Assessment[];
    rank: number;
    totalStudents: number;
    year: string;
    term: string;
    subjectsList: Subject[] | undefined;
}) {
    // 1. Create Lookup Map (ID -> Name)
    const subjectMap = useMemo(() => {
        const map: Record<string, string> = {};
        if (subjectsList) {
            subjectsList.forEach(s => {
                map[s.id] = s.name; // ID -> Name
                map[s.id.trim()] = s.name; // Trimmed ID -> Name (Safety)
                if (s.name) map[s.name] = s.name; // Map Name to Name (self-reference)
            });
        }
        return map;
    }, [subjectsList]);

    // 2. Group by Subject
    const subjectGrades = useMemo(() => {
        const subjects: Record<string, { total: number, max: number, count: number }> = {};
        
        assessments.forEach(a => {
            if (a.studentId !== student.uid) return;
            
            // --- FIX: AGGRESSIVE NAME RESOLUTION ---
            let displaySub = 'General';

            // Check field priority
            const rawSubject = a.subjectId || a.subject || '';
            
            if (rawSubject && subjectMap[rawSubject]) {
                displaySub = subjectMap[rawSubject];
            } else if (rawSubject) {
                // If we can't find it in the map, use the raw string, 
                // but if it looks like an ID (long alphanumeric), label it "Unknown" to alert user
                const isLikelyID = rawSubject.length > 15 && !rawSubject.includes(' ');
                displaySub = isLikelyID ? `Unknown Subject (${rawSubject.slice(0,4)}...)` : rawSubject;
            }

            if (!subjects[displaySub]) subjects[displaySub] = { total: 0, max: 0, count: 0 };
            
            subjects[displaySub].total += a.score || 0;
            subjects[displaySub].max += a.maxScore || 0;
            subjects[displaySub].count++;
        });

        return Object.entries(subjects).map(([name, data]) => {
            const percentage = data.max > 0 ? (data.total / data.max) * 100 : 0;
            return { name, percentage, ...getGrade(percentage) };
        });
    }, [assessments, student.uid, subjectMap]);

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
                            subjectsList={subjectsList} // <-- PASS LIST
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
                        // Resolve Name for detailed list
                        let displaySub = 'General';
                        const rawSubject = a.subjectId || a.subject || '';
                        if (rawSubject && subjectMap[rawSubject]) displaySub = subjectMap[rawSubject];
                        else if (rawSubject) displaySub = rawSubject;

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

  // 1. Fetch Classes 
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

  // 5. FETCH SUBJECTS LIST (FIX - REMOVED ORDERBY TO PREVENT CRASH)
  const subjectsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'subjects')) : null, 
  [firestore]);
  const { data: allSubjects, isLoading: isLoadingSubjects } = useCollection<Subject>(subjectsQuery);

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

  const isLoading = isUserLoading || isRoleLoading || isLoadingClasses || isLoadingSubjects || (selectedClassId && (isLoadingStudents || isLoadingAssessments || isLoadingFinancial));

  if (!isStaff && !isLoading) {
      return <div className="p-8 text-center text-red-500">Access Denied. Staff only.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* --- DEBUG SECTION --- */}
      {isStaff && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800 flex flex-wrap gap-2 items-center">
              <Info className="h-4 w-4"/>
              <strong>Subjects Loaded: {allSubjects?.length || 0}.</strong>
              {allSubjects && allSubjects.length > 0 && 
                <span className="opacity-0 hover:opacity-100 transition-opacity">Sample: {allSubjects[0].name} ({allSubjects[0].id})</span>
              }
              {isLoadingSubjects && <Loader2 className="h-3 w-3 animate-spin"/>}
              {!allSubjects && !isLoadingSubjects && <span className="text-red-500">Subject list is empty!</span>}
          </div>
      )}
      
      <Card className="border-t-4 border-t-indigo-600 shadow-sm">
        <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2 text-xl"><TrendingUp className="text-indigo-600"/> Smart Gradebook 2.0</CardTitle>
                    <CardDescription>Comprehensive academic reporting and fee tracking.</CardDescription>
                </div>
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

      {activeForm === 'grade' && selectedClassId && (
          <div className="animate-in slide-in-from-top-4 fade-in duration-300">
              <AssessmentFeedbackForm classId={selectedClassId} classes={classes || []} />
          </div>
      )}
      
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
                                                        subjectsList={allSubjects} 
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

2. Fix the PDF Report Card (src/app/dashboard/academics/gradebook/report-card-pdf.tsx)
I will update the PDF component to receive and use the same subjectsList. This ensures the PDF also shows the correct names.

'use client';

import React, { useMemo } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Student, Assessment, Subject } from '@/lib/types'; // Import Subject
import { format } from 'date-fns';
import { Printer, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- STYLES (Keep as is) ---
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
  header: { marginBottom: 20, borderBottom: 1, borderBottomColor: '#ccc', paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  schoolName: { fontSize: 24, fontWeight: 'bold', color: '#1a365d', textTransform: 'uppercase' },
  schoolInfo: { fontSize: 9, color: '#666' },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 15, textTransform: 'uppercase', letterSpacing: 1 },
  infoContainer: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#f8fafc', padding: 10, borderRadius: 4 },
  infoCol: { flex: 1 },
  infoRow: { flexDirection: 'row', marginBottom: 4 },
  label: { width: 80, fontWeight: 'bold', color: '#64748b' },
  value: { flex: 1, fontWeight: 'bold' },
  table: { width: 'auto', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', minHeight: 25, alignItems: 'center' },
  tableHeader: { backgroundColor: '#f1f5f9', fontWeight: 'bold' },
  colSubject: { width: '40%', padding: 5, borderRightWidth: 1, borderRightColor: '#e2e8f0' },
  colMetric: { width: '15%', padding: 5, borderRightWidth: 1, borderRightColor: '#e2e8f0', textAlign: 'center' },
  colRemark: { width: '30%', padding: 5, textAlign: 'left' },
  footer: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' },
  signatureBox: { width: 200, borderTopWidth: 1, borderTopColor: '#000', paddingTop: 5, marginTop: 40, textAlign: 'center' },
  disclaimer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, textAlign: 'center', color: '#999' }
});

// Grading Helper
function getGrade(percentage: number) {
    if (percentage >= 80) return { grade: 'A', remark: 'Excellent' };
    if (percentage >= 70) return { grade: 'B', remark: 'Very Good' };
    if (percentage >= 60) return { grade: 'C', remark: 'Good' };
    if (percentage >= 50) return { grade: 'D', remark: 'Pass' };
    return { grade: 'F', remark: 'Fail' };
}

// --- PDF DOCUMENT COMPONENT ---
const ReportCardDocument = ({ 
    student, 
    assessments, 
    year, 
    term,
    rank,
    totalStudents,
    subjectsList // FIX: Receive the subjects list
}: { 
    student: Student, 
    assessments: Assessment[], 
    year: string, 
    term: string,
    rank: number,
    totalStudents: number,
    subjectsList: Subject[] | undefined // FIX: Type for the new prop
}) => {
    
    // Create the same lookup map here
    const subjectMap = useMemo(() => {
        const map: Record<string, string> = {};
        if (subjectsList) {
            subjectsList.forEach(s => { map[s.id] = s.name; });
        }
        return map;
    }, [subjectsList]);

    // Process Data: Group assessments by Subject Name
    const subjectGrades = useMemo(() => {
        const subjects: Record<string, { total: number, max: number }> = {};
        
        assessments.forEach(a => {
            // Same robust name resolution as the main page
            let subName = 'General';
            if (a.subjectId && subjectMap[a.subjectId]) subName = subjectMap[a.subjectId];
            else if (a.subject && subjectMap[a.subject]) subName = subjectMap[a.subject];
            else if (a.subject) subName = a.subject;

            if (!subjects[subName]) subjects[subName] = { total: 0, max: 0 };
            
            subjects[subName].total += a.score || 0;
            subjects[subName].max += a.maxScore || 0;
        });

        return Object.entries(subjects).map(([name, data]) => {
            const pct = data.max > 0 ? (data.total / data.max) * 100 : 0;
            return { name, percentage: pct, ...getGrade(pct) };
        });
    }, [assessments, subjectMap]);

    const overallAvg = subjectGrades.length > 0 
        ? subjectGrades.reduce((acc, s) => acc + s.percentage, 0) / subjectGrades.length 
        : 0;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header, Student Info (Keep as is) */}
                 <View style={styles.header}>
                    <View>
                        <Text style={styles.schoolName}>SunnySide Academy</Text>
                        <Text style={styles.schoolInfo}>123 Education Lane, Accra, Ghana</Text>
                        <Text style={styles.schoolInfo}>contact@sunnyside.com</Text>
                    </View>
                </View>
                <Text style={styles.title}>Student Report Card</Text>
                <View style={styles.infoContainer}>
                    <View style={styles.infoCol}>
                        <View style={styles.infoRow}><Text style={styles.label}>Name:</Text><Text style={styles.value}>{student.firstName} {student.lastName}</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>ID:</Text><Text style={styles.value}>{student.id ? student.id.slice(0,8).toUpperCase() : 'N/A'}</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>Class:</Text><Text style={styles.value}>{student.classId}</Text></View>
                    </View>
                    <View style={styles.infoCol}>
                        <View style={styles.infoRow}><Text style={styles.label}>Year:</Text><Text style={styles.value}>{year}</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>Term:</Text><Text style={styles.value}>{term}</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>Position:</Text><Text style={styles.value}>{rank} / {totalStudents}</Text></View>
                    </View>
                </View>

                {/* GRADES TABLE */}
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.colSubject}>Subject</Text>
                        <Text style={styles.colMetric}>Percent</Text>
                        <Text style={styles.colMetric}>Grade</Text>
                        <Text style={styles.colRemark}>Remark</Text>
                    </View>
                    {subjectGrades.map((sub, i) => (
                        <View key={i} style={styles.tableRow}>
                            <Text style={styles.colSubject}>{sub.name}</Text>
                            <Text style={styles.colMetric}>{sub.percentage.toFixed(1)}%</Text>
                            <Text style={styles.colMetric}>{sub.grade}</Text>
                            <Text style={styles.colRemark}>{sub.remark}</Text>
                        </View>
                    ))}
                    {/* Total Row */}
                    <View style={[styles.tableRow, { borderTopWidth: 2, backgroundColor: '#f8fafc' }]}>
                        <Text style={[styles.colSubject, { fontWeight: 'bold' }]}>Overall Average</Text>
                        <Text style={[styles.colMetric, { fontWeight: 'bold' }]}>{overallAvg.toFixed(1)}%</Text>
                        <Text style={styles.colMetric}></Text>
                        <Text style={styles.colRemark}></Text>
                    </View>
                </View>

                {/* Footer, Disclaimer (Keep as is) */}
                 <View style={styles.footer}>
                    <View style={styles.signatureBox}><Text>Class Teacher Signature</Text></View>
                    <View style={styles.signatureBox}><Text>Headmaster Signature</Text></View>
                </View>
                <Text style={styles.disclaimer}>Generated via CampusConnect System on {format(new Date(), 'PPP')}</Text>
            </Page>
        </Document>
    );
};

// --- BUTTON COMPONENT (This is what appears on the page) ---
export const GenerateReportCard = ({ 
    student, assessments, year, term, rank, totalStudents, subjectsList
}: {
    student: Student,
    assessments: Assessment[],
    year: string,
    term: string,
    rank: number,
    totalStudents: number,
    subjectsList: Subject[] | undefined
}) => (
    <PDFDownloadLink
        document={
            <ReportCardDocument 
                student={student} 
                assessments={assessments} 
                year={year} 
                term={term}
                rank={rank}
                totalStudents={totalStudents}
                subjectsList={subjectsList} // <-- Pass down
            />
        }
        fileName={`${student.firstName}_${student.lastName}_Report.pdf`}
    >
        {/* @ts-ignore */}
        {({ loading }) => (
            <Button variant="outline" className="w-full gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Printer className="h-4 w-4"/>}
                {loading ? 'Generating...' : 'Download Report Card'}
            </Button>
        )}
    </PDFDownloadLink>
);