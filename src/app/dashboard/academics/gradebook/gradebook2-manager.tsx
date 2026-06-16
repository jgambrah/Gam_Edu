'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  TrendingUp, User, PlusCircle, Printer, Trophy, BookOpen, AlertCircle, FileText, Loader2, History, Settings2
} from 'lucide-react';
import { format } from 'date-fns';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import Link from 'next/link';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AssessmentFeedbackForm } from '../../assessments/assessment-feedback-form';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { GenerateReportCard } from './report-card-pdf';
import { AcademicResetTool } from '@/components/dashboard/academics/AcademicResetTool';

// Types
import { Assessment, FinancialRecord, Class, Student, Subject } from '@/lib/types';
import { StudentDisplay } from '@/components/student-display';
import { searchStudent } from '@/lib/student-utils';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { getGradeFromScale } from '@/lib/utils';


// Professional Ordinal Formatter
function formatOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// --- SUB-COMPONENT: Fee History ---
function FeeHistoryDetail({ student, financialRecords }: { student: Student; financialRecords: FinancialRecord[] }) {
    
    const studentRecords = useMemo(() => {
        return (financialRecords || [])
            .filter(r => r.studentId === student.uid)
            .sort((a, b) => (b.createdAt?.toDate() || 0) - (a.createdAt?.toDate() || 0));
    }, [financialRecords, student.uid]);

    if (studentRecords.length === 0) {
        return <p className="text-center text-muted-foreground p-8">No financial records found for this student.</p>
    }

    return (
        <div className="p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Billed</TableHead>
                        <TableHead className="text-right">Paid</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {studentRecords.map((record) => (
                        <TableRow key={record.id}>
                            <TableCell className="text-xs">{record.createdAt ? format(record.createdAt.toDate(), 'PPP') : 'N/A'}</TableCell>
                            <TableCell>{record.description}</TableCell>
                            <TableCell><Badge variant="outline">{record.type}</Badge></TableCell>
                            <TableCell className="text-right">GH₵{record.billedAmount.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-green-600">GH₵{(record.amountPaid || 0).toFixed(2)}</TableCell>
                            <TableCell className="text-right"><Badge variant={record.status === 'Paid' ? 'default' : 'destructive'}>{record.status}</Badge></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

// --- SUB-COMPONENT: Student Academics Detail ---
function StudentGradesDetail({ 
    student, 
    allAssessments, 
    allSubjects,
    rank, 
    totalStudents,
    term,
    year,
    caWeight,
    examWeight,
    gradingScale
}: { 
    student: Student; 
    allAssessments: Assessment[];
    allSubjects: Subject[];
    rank: number | string;
    totalStudents: number;
    term: string;
    year: string;
    caWeight: number;
    examWeight: number;
    gradingScale?: any[];
}) {
    // 1. GLOBAL STATS (The Fix: Calculate Weighted Averages for the whole class)
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
                const caPct = data.caMax > 0 ? (data.ca / data.caMax) * caWeight : 0;
                const examPct = data.examMax > 0 ? (data.exam / data.examMax) * examWeight : 0;
                const final = caPct + examPct;
                
                scoresMap[uid] = final;
                sumPercentages += final;
                count++;
            });

            stats[subId] = {
                average: count > 0 ? sumPercentages / count : 0,
                studentScores: scoresMap
            };
        });
        
        return stats;
    }, [allAssessments, caWeight, examWeight]);

    // 2. STUDENT SPECIFIC DATA (Display Logic) - FIXED TO ITERATE OVER SUBJECTS
    const reportData = useMemo(() => {
        if (!allSubjects || allSubjects.length === 0) return [];
        
        return allSubjects.map(subject => {
            const subId = subject.id;
            const subName = subject.name;

            const studentAssessments = allAssessments.filter(a => a.studentId === student.uid && a.subjectId === subId);

            let caObtained = 0, caMax = 0, examObtained = 0, examMax = 0;

            studentAssessments.forEach(a => {
                const type = (a.assessmentType || '').toLowerCase();
                const isExam = type.includes('exam') || type.includes('term');
                if (isExam) {
                    examObtained += (a.score || 0);
                    examMax += (a.maxScore || 0);
                } else {
                    caObtained += (a.score || 0);
                    caMax += (a.maxScore || 0);
                }
            });

            const caWeighted = caMax > 0 ? (caObtained / caMax) * caWeight : 0;
            const examWeighted = examMax > 0 ? (examObtained / examMax) * examWeight : 0;
            const totalPercent = caWeighted + examWeighted;

            const subStats = globalSubjectStats[subId];
            let classAvg = subStats ? subStats.average : 0;
            let subRank: string | number = 'N/A';
            let totalSubStudents = 0;

            if (subStats && subStats.studentScores) {
                const studentScore = subStats.studentScores[student.uid];
                if (studentScore !== undefined) {
                    const allScores = Object.values(subStats.studentScores);
                    // Standard Competition Ranking
                    const higherCount = allScores.filter(s => s > studentScore + 0.001).length;
                    subRank = formatOrdinal(higherCount + 1);
                }
                totalSubStudents = Object.keys(subStats.studentScores).length;
            }

            return { 
                id: subId,
                name: subName,
                caWeighted, 
                examWeighted, 
                totalPercent, 
                classAvg, 
                rank: subRank,
                totalSubStudents,
                ...getGradeFromScale(totalPercent, gradingScale) 
            };
        });
    }, [allAssessments, student.uid, allSubjects, globalSubjectStats, caWeight, examWeight, gradingScale]);


    const overallAverage = reportData.length > 0 
        ? reportData.reduce((sum, i) => sum + i.totalPercent, 0) / reportData.length 
        : 0;

    return (
        <div className="space-y-6 p-4">
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
                     <CardContent className="p-4 flex flex-col justify-center h-full">
                        <GenerateReportCard
                            student={student}
                            assessments={allAssessments}
                            subjects={allSubjects || []}
                            year={year}
                            term={term}
                            rank={rank}
                            totalStudents={totalStudents}
                            caWeight={caWeight}
                            examWeight={examWeight}
                        />
                     </CardContent>
                </Card>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[25%]">Subject</TableHead>
                            <TableHead className="text-center">C.A ({caWeight}%)</TableHead>
                            <TableHead className="text-center">Exam ({examWeight}%)</TableHead>
                            <TableHead className="text-center font-bold">Total (%)</TableHead>
                            <TableHead className="text-center">Class Avg</TableHead>
                            <TableHead className="text-center">Pos</TableHead>
                            <TableHead>Grade</TableHead>
                            <TableHead>Remark</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reportData.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium">{row.name}</TableCell>
                                <TableCell className="text-center">{row.caWeighted > 0 ? row.caWeighted.toFixed(1) : '-'}</TableCell>
                                <TableCell className="text-center">{row.examWeighted > 0 ? row.examWeighted.toFixed(1) : '-'}</TableCell>
                                <TableCell className="text-center font-bold">{row.totalPercent > 0 ? `${row.totalPercent.toFixed(1)}%` : '-'}</TableCell>
                                <TableCell className="text-center text-muted-foreground">{row.classAvg > 0 ? `${row.classAvg.toFixed(1)}%` : '-'}</TableCell>
                                <TableCell className="text-center">{row.rank !== 'N/A' ? `${row.rank}/${row.totalSubStudents}` : '-'}</TableCell>
                                <TableCell><Badge variant={row.grade === 'F' ? 'destructive' : row.grade === 'N/A' ? 'outline' : 'default'}>{row.grade}</Badge></TableCell>
                                <TableCell className="text-muted-foreground text-sm">{row.totalPercent > 0 ? row.remark : ''}</TableCell>
                            </TableRow>
                        ))}
                        {reportData.length === 0 && <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No subjects or grades found.</TableCell></TableRow>}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// --- MAIN PAGE ---
export default function GradebookManager() {
  const { user, isUserLoading } = useUser();
  const { role, loading: isRoleLoading } = useRole();
  const firestore = useFirestore();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const schoolSettingsRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
  const { data: schoolSettings } = useDoc<any>(schoolSettingsRef);

  // State
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(MOCK_TERMS[0]);
  const [selectedYear, setSelectedYear] = useState(MOCK_ACADEMIC_YEARS[MOCK_ACADEMIC_YEARS.length - 1]);

  const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role || '');

  // 1. Fetch Classes (SAAS Aware)
  const classesQuery = useMemoFirebase(() => {
      if (!firestore || !user || !isStaff || !schoolId) return null;
      let q = query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
      if (role === 'Teacher') {
          q = query(q, where('teacherId', '==', user.uid));
      }
      return q;
  }, [firestore, user, role, isStaff, schoolId]);
  
  const { data: teacherClasses, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

  const selectedClassObj = teacherClasses?.find(c => c.id === selectedClassId);
  const effectiveCaWeight = selectedClassObj?.caWeight ?? schoolSettings?.caWeight ?? 30;
  const effectiveExamWeight = selectedClassObj?.examWeight ?? schoolSettings?.examWeight ?? 70;

  // 2. Fetch Students for the selected class (SAAS Aware)
  const studentsQuery = useMemoFirebase(() => 
    (firestore && selectedClassId && schoolId) 
        ? query(
            collection(firestore, 'students'), 
            where('schoolId', '==', schoolId), 
            where('classId', '==', selectedClassId)
        ) 
        : null,
  [firestore, selectedClassId, schoolId]);
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);

  // Filter for ACTIVE students in memory to handle legacy records with undefined status
  const activeStudents = useMemo(() => {
      if (!students) return [];
      return students.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus);
  }, [students]);
  
  // 3. Fetch Assessments for the selected class, term, and year (SAAS Aware)
  const assessmentsQuery = useMemoFirebase(() => {
    if (!selectedClassId || !firestore || !schoolId) return null;
    return query(
        collection(firestore, 'assessments'),
        where('schoolId', '==', schoolId),
        where('classId', '==', selectedClassId),
        where('academicYear', '==', selectedYear),
        where('term', '==', selectedTerm)
    );
  }, [firestore, selectedClassId, selectedYear, selectedTerm, schoolId]);
  const { data: assessments, isLoading: isLoadingAssessments, forceRefetch } = useCollection<Assessment>(assessmentsQuery);

  // 4. Fetch ALL Subjects for the school (for name mapping)
  const subjectsQuery = useMemoFirebase(() => firestore && schoolId ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: allSubjects, isLoading: isLoadingSubjects } = useCollection<Subject>(subjectsQuery);

  // 5. Fetch Financials (SAAS Aware)
  const financialRecordsQuery = useMemoFirebase(() => 
    (firestore && selectedClassId && schoolId) ? query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId), where('classId', '==', selectedClassId)) : null,
  [firestore, selectedClassId, schoolId]);
  const { data: financialRecords, isLoading: isLoadingFinancial } = useCollection<FinancialRecord>(financialRecordsQuery);

  // --- DERIVED DATA ---
  
  const studentStats = useMemo(() => {
      if (!activeStudents || !assessments) return [];
      
      return activeStudents.map(s => {
          const myAssessments = assessments.filter(a => a.studentId === s.uid);
          const total = myAssessments.reduce((acc, curr) => acc + (curr.score || 0), 0);
          const max = myAssessments.reduce((acc, curr) => acc + (curr.maxScore || 100), 0);
          const average = max > 0 ? (total / max) * 100 : 0;
          return { ...s, average };
      });
  }, [activeStudents, assessments]);

  const studentFinancials = useMemo(() => {
    if (!activeStudents || !financialRecords) return {};
    const financials: Record<string, { balance: number }> = {};

    activeStudents.forEach(student => {
        const myRecords = financialRecords.filter(r => r.studentId === student.uid);
        const billed = myRecords.reduce((acc, r) => acc + r.billedAmount, 0);
        const paid = myRecords.reduce((acc, r) => acc + (r.amountPaid || 0) + (r.waiverAmount || 0), 0);
        financials[student.uid] = { balance: billed - paid };
    });
    return financials;
  }, [activeStudents, financialRecords]);

  const isLoading = isUserLoading || isRoleLoading || isLoadingSchool || isLoadingClasses || (selectedClassId && (isLoadingStudents || isLoadingAssessments || isLoadingFinancial || isLoadingSubjects));
  
  const handleGradeSubmissionSuccess = () => {
    forceRefetch();
    setActiveForm(null); 
  };


  if (!isStaff && !isLoading) {
      return <div className="p-8 text-center text-red-500">Access Denied. Staff only.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {schoolId && (
          <AcademicResetTool 
            schoolId={schoolId} 
            onResetComplete={() => forceRefetch()} 
          />
      )}

      <Card className="border-t-4 border-t-indigo-600 shadow-sm">
        <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2 text-xl"><TrendingUp className="text-indigo-600"/> Smart Gradebook</CardTitle>
                    <CardDescription>Comprehensive academic reporting and fee tracking.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 shadow-sm">
                        <Link href="/dashboard/academics/gradebook/manual-entry">
                            <History className="mr-2 h-4 w-4" /> Batch Management
                        </Link>
                    </Button>
                    <Button 
                        variant={activeForm === 'grade' ? 'secondary' : 'default'} 
                        className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
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
                    {teacherClasses?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
             </Select>
          </div>
        </CardContent>
      </Card>

      {activeForm === 'grade' && selectedClassId && (
          <div className="animate-in slide-in-from-top-4 fade-in duration-300">
              <AssessmentFeedbackForm 
                classId={selectedClassId} 
                classes={teacherClasses || []} 
                academicYear={selectedYear}
                term={selectedTerm}
                onSuccess={handleGradeSubmissionSuccess}
              />
          </div>
      )}
      
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
                studentStats.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {[...studentStats].sort((a,b) => b.average - a.average).map((student) => {
                        const financials = studentFinancials[student.uid] || { balance: 0 };
                        // Standard Competition Ranking
                        const higherCount = studentStats.filter(s => s.average > student.average + 0.001).length;
                        const rankNum = higherCount + 1;
                        const rank = formatOrdinal(rankNum);
                        
                        return (
                            <AccordionItem value={student.uid} key={student.uid} className="px-4 border-b last:border-0 hover:bg-slate-50 transition-colors">
                                <AccordionTrigger className="hover:no-underline py-4">
                                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center w-full pr-4 gap-2'>
                                        
                                        <div className="flex items-center gap-3">
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-full text-xs font-bold ${rankNum <= 3 ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-400' : 'bg-slate-100 text-slate-500'}`}>
                                                {rank}
                                            </div>
                                            <StudentDisplay student={student} variant="list" showAvatar />
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
                                                <TabsTrigger value="academics" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none shadow-none">Report Card</TabsTrigger>
                                                <TabsTrigger value="financials" className="data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 rounded-none shadow-none">Fee History</TabsTrigger>
                                            </TabsList>
                                        </div>

                                        <TabsContent value="academics" className="mt-0">
                                            <StudentGradesDetail 
                                                student={student} 
                                                allAssessments={assessments || []} 
                                                allSubjects={allSubjects || []}
                                                rank={rank}
                                                totalStudents={studentStats.length}
                                                term={selectedTerm}
                                                year={selectedYear}
                                                caWeight={effectiveCaWeight}
                                                examWeight={effectiveExamWeight}
                                                gradingScale={schoolSettings?.gradingSystem}
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
                        <p className="text-muted-foreground">No active students found.</p>
                        <p className="text-xs text-slate-400">Select a different class or check enrollment statuses.</p>
                    </div>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
