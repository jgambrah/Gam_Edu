
'use client';

import { Suspense, useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, User, PlusCircle, Printer } from 'lucide-react';
import { Assessment, FinancialRecord, ReportCard, Subject } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AssessmentFeedbackForm } from '../assessments/assessment-feedback-form';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS, MOCK_SUBJECTS } from '@/lib/data';
import { StudentReportCardPDF } from './student-report-card-pdf';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type Student = { uid: string; firstName: string; lastName: string; classId: string; id: string; };

const getGradeForScore = (score: number) => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    if (score > 0) return 'E';
    return 'F';
};

function StudentGradesDetail({ student, assessments }: { student: Student; assessments: Assessment[] }) {
    const firestore = useFirestore();
    const { data: subjects } = useCollection<Subject>(useMemoFirebase(() => collection(firestore, 'subjects'), [firestore]));

    const subjectGrades = useMemo(() => {
        if (!subjects) return [];
        return subjects.map(subject => {
            const subjectAssessments = assessments.filter(a => a.studentId === student.uid && a.subjectId === subject.id && a.score != null && a.maxScore != null && a.maxScore > 0);
            if (subjectAssessments.length === 0) return { subjectName: subject.name, average: null, grade: 'N/A' };
            const totalScore = subjectAssessments.reduce((acc, a) => acc + a.score!, 0);
            const totalMaxScore = subjectAssessments.reduce((acc, a) => acc + a.maxScore!, 0);
            const average = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
            return {
                subjectName: subject.name,
                average: parseFloat(average.toFixed(1)),
                grade: getGradeForScore(average),
            };
        });
    }, [subjects, assessments, student.uid]);

    return (
        <div className="space-y-4 p-4 bg-muted/50 rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-right">Average Score</TableHead>
                        <TableHead className="text-right">Grade</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {subjectGrades.map(s => (
                        <TableRow key={s.subjectName}>
                            <TableCell>{s.subjectName}</TableCell>
                            <TableCell className="text-right">{s.average?.toFixed(1) ?? 'N/A'}%</TableCell>
                            <TableCell className="text-right font-bold">{s.grade}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default function Gradebook2Manager() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(MOCK_TERMS[0]);
  const [selectedYear, setSelectedYear] = useState(MOCK_ACADEMIC_YEARS[0]);
  const { toast } = useToast();
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  
  const teacherClassesQuery = useMemoFirebase(() => user && (role === 'Administrator' || role === 'Director') ? collection(firestore, 'classes') : query(collection(firestore, 'classes'), where('teacherId', '==', user?.uid || '')), [firestore, user, role]);
  const { data: teacherClasses } = useCollection(teacherClassesQuery);

  const studentsQuery = useMemoFirebase(() => selectedClassId ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId)) : null, [firestore, selectedClassId]);
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);
  
  const assessmentsQuery = useMemoFirebase(() => selectedClassId ? query(collection(firestore, 'assessments'), where('classId', '==', selectedClassId), where('academicYear', '==', selectedYear), where('term', '==', selectedTerm)) : null, [firestore, selectedClassId, selectedYear, selectedTerm]);
  const { data: assessments, isLoading: isLoadingAssessments } = useCollection<Assessment>(assessmentsQuery);

  const { data: reportCards, isLoading: isLoadingReportCards } = useCollection<ReportCard>(useMemoFirebase(() => selectedClassId ? query(collection(firestore, 'report-cards'), where('classId', '==', selectedClassId), where('academicYear', '==', selectedYear), where('term', '==', selectedTerm)) : null, [firestore, selectedClassId, selectedYear, selectedTerm]));

  const isLoading = isLoadingStudents || isLoadingAssessments || isLoadingReportCards;

  const handleSaveRemarks = async (studentId: string) => {
    const reportCardId = `${studentId}-${selectedYear}-${selectedTerm}`;
    const reportCardRef = doc(firestore, 'report-cards', reportCardId);
    try {
        await setDoc(reportCardRef, { generalComment: remarks[studentId] }, { merge: true });
        toast({ title: "Success", description: "Remarks saved." });
    } catch(e) {
        toast({ variant: 'destructive', title: "Error", description: "Could not save remarks." });
    }
  };

  const studentDataForRanking = useMemo(() => {
    if (!students || !assessments) return [];
    return students.map(student => {
      const studentAssessments = assessments.filter(a => a.studentId === student.uid && a.score != null && a.maxScore != null && a.maxScore > 0);
      if (studentAssessments.length === 0) return { student, average: 0 };
      const totalScore = studentAssessments.reduce((acc, a) => acc + a.score!, 0);
      const totalMaxScore = studentAssessments.reduce((acc, a) => acc + a.maxScore!, 0);
      const average = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
      return { student, average };
    });
  }, [students, assessments]);

  const rankedStudents = useMemo(() => {
    const sorted = [...studentDataForRanking].sort((a, b) => b.average - a.average);
    let rank = 1;
    return sorted.map((s, index) => {
        if (index > 0 && s.average < sorted[index - 1].average) {
            rank = index + 1;
        }
        return { ...s, rank };
    });
  }, [studentDataForRanking]);

  const getRankOrdinal = (rank: number) => {
    if (rank % 100 >= 11 && rank % 100 <= 13) return `${rank}th`;
    switch (rank % 10) {
      case 1: return `${rank}st`;
      case 2: return `${rank}nd`;
      case 3: return `${rank}rd`;
      default: return `${rank}th`;
    }
  };

  const toggleForm = (formName: string) => {
    setActiveForm(activeForm === formName ? null : formName);
  };
  
  const handlePromoteClass = async () => {
    if (!selectedClassId || !students || students.length === 0) return;
    
    // Simple logic: "JHS 1" -> "JHS 2" etc.
    const currentClassName = teacherClasses?.find(c => c.id === selectedClassId)?.name || '';
    const currentGrade = parseInt(currentClassName.match(/\d+/)?.[0] || '0');
    const nextGradeName = currentClassName.replace(String(currentGrade), String(currentGrade + 1));
    
    // Find or create the next class
    let nextClass = classes?.find(c => c.name === nextGradeName);
    if (!nextClass) {
        // Create it if it doesn't exist (basic version)
        const newClassRef = await addDoc(collection(firestore, 'classes'), { name: nextGradeName });
        nextClass = { id: newClassRef.id, name: nextGradeName };
    }
    
    const batch = writeBatch(firestore);
    students.forEach(student => {
        const studentRef = doc(firestore, 'students', student.uid);
        batch.update(studentRef, { classId: nextClass!.id });
    });

    await batch.commit();
    toast({ title: 'Success', description: `${students.length} students promoted to ${nextGradeName}.` });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2"><TrendingUp /> Gradebook</CardTitle>
              <CardDescription>Select a class and term to view student performance and financial status.</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="destructive" onClick={handlePromoteClass} disabled={!selectedClassId || !students || students.length === 0}>Promote Class</Button>
                <Button variant={activeForm === 'grade' ? 'default' : 'outline'} onClick={() => toggleForm('grade')} disabled={!selectedClassId}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Grade Entry
                </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select onValueChange={setSelectedYear} defaultValue={selectedYear}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{MOCK_ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent></Select>
          <Select onValueChange={setSelectedTerm} defaultValue={selectedTerm}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{MOCK_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
          <Select onValueChange={setSelectedClassId}><SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger><SelectContent>{teacherClasses?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
        </CardContent>
      </Card>

      {activeForm === 'grade' && selectedClassId && <AssessmentFeedbackForm classId={selectedClassId} />}
      
      {selectedClassId && (
        <Card>
          <CardHeader><CardTitle>Student Overview for {selectedYear} - {selectedTerm}</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div> :
            rankedStudents && rankedStudents.length > 0 && assessments ? (
            <Accordion type="single" collapsible>
                {rankedStudents.map(({ student, average, rank }) => (
                    <AccordionItem value={student.uid} key={student.uid}>
                        <AccordionTrigger>
                            <div className='flex justify-between items-center w-full pr-4'>
                                <span className="flex items-center gap-2"><User className="h-4 w-4"/>{student.firstName} {student.lastName}</span>
                                <div className="flex items-center gap-4">
                                    <Badge variant={average > 0 ? "default" : "secondary"}>
                                        Overall: {average.toFixed(1)}% ({getGradeForScore(average)})
                                    </Badge>
                                     <Badge variant="outline">
                                        Position: {getRankOrdinal(rank)}
                                    </Badge>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-2 space-y-4">
                            <Tabs defaultValue="academics">
                                <TabsList><TabsTrigger value="academics">Academics</TabsTrigger><TabsTrigger value="remarks">Teacher's Remarks</TabsTrigger></TabsList>
                                <TabsContent value="academics">
                                    <StudentGradesDetail student={student} assessments={assessments}/>
                                </TabsContent>
                                <TabsContent value="remarks">
                                    <div className="p-4 bg-muted/50 rounded-md space-y-2">
                                        <Textarea placeholder="Enter general remarks for this student..." defaultValue={reportCards?.find(rc => rc.studentId === student.uid)?.generalComment || ''} onChange={(e) => setRemarks(prev => ({...prev, [student.uid]: e.target.value}))}/>
                                        <Button size="sm" onClick={() => handleSaveRemarks(student.uid)}>Save Remarks</Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                             <CardFooter>
                                <PDFDownloadLink
                                document={<StudentReportCardPDF student={student} term={selectedTerm} year={selectedYear} assessments={assessments} rank={getRankOrdinal(rank)} />}
                                fileName={`${student.firstName}_${student.lastName}_Report.pdf`}
                                >
                                {({ blob, url, loading, error }) =>
                                    loading ? <Button disabled><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Generating...</Button> : <Button><Printer className="mr-2 h-4 w-4"/>Generate PDF Report</Button>
                                }
                                </PDFDownloadLink>
                            </CardFooter>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            ) : (
                <p className="text-muted-foreground text-center py-8">No students or records found.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
