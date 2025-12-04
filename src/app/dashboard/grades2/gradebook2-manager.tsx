
'use client';

import { Suspense, useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, User, PlusCircle } from 'lucide-react';
import { StudentGradesView } from './student-grades-view';
import { Assessment, FinancialRecord } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AssessmentFeedbackForm } from '../assessments/assessment-feedback-form';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { format } from 'date-fns';

type Student = { uid: string; firstName: string; lastName: string; classId: string; id: string; };

// Helper to calculate overall grade for a student
function calculateStudentGrade(studentId: string, assessments: Assessment[]) {
    const studentAssessments = assessments.filter(a => a.studentId === studentId && a.score != null && a.maxScore != null && a.maxScore > 0);
    if (studentAssessments.length === 0) {
      return { finalGrade: 'N/A', percentage: 0 };
    }
  
    const totalScore = studentAssessments.reduce((acc, a) => acc + a.score!, 0);
    const maxScore = studentAssessments.reduce((acc, a) => acc + a.maxScore!, 0);
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  
    let finalGrade = 'N/A';
    if (percentage >= 90) finalGrade = 'A';
    else if (percentage >= 80) finalGrade = 'B';
    else if (percentage >= 70) finalGrade = 'C';
    else if (percentage >= 60) finalGrade = 'D';
    else if (percentage >= 0) finalGrade = 'F';
    
    return { finalGrade, percentage: parseFloat(percentage.toFixed(1)) };
}


function StudentGradesDetail({ student, assessments }: { student: Student; assessments: Assessment[] }) {
    const studentAssessments = assessments.filter(a => a.studentId === student.uid && a.score != null && a.maxScore != null);

    return (
        <div className="space-y-4 p-4 bg-muted/50 rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Assessment Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {studentAssessments.length > 0 ? studentAssessments.map(a => (
                        <TableRow key={a.id}>
                            <TableCell>{a.assessmentName}</TableCell>
                            <TableCell>{a.assessmentType}</TableCell>
                            <TableCell className="text-right">{a.score}/{a.maxScore}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">No assessments recorded for this student.</TableCell>
                        </TableRow>
                    )}
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
  
  const teacherClassesQuery = useMemoFirebase(
    () => user && (role === 'Administrator' || role === 'Director') ? collection(firestore, 'classes') : query(collection(firestore, 'classes'), where('teacherId', '==', user?.uid || '')),
    [firestore, user, role]
  );
  const { data: teacherClasses, isLoading: isLoadingClasses } = useCollection(teacherClassesQuery);

  const studentsQuery = useMemoFirebase(
    () => selectedClassId ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId)) : null,
    [firestore, selectedClassId]
  );
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);
  
  const assessmentsQuery = useMemoFirebase(() => {
    if (!selectedClassId) return null;
    return query(
        collection(firestore, 'assessments'),
        where('classId', '==', selectedClassId),
        where('academicYear', '==', selectedYear),
        where('term', '==', selectedTerm)
    );
  }, [firestore, selectedClassId, selectedYear, selectedTerm]);
  const { data: assessments, isLoading: isLoadingAssessments } = useCollection<Assessment>(assessmentsQuery);

  const financialRecordsQuery = useMemoFirebase(() => {
    if (!selectedClassId) return null;
    return query(collection(firestore, 'financialRecords'), where('classId', '==', selectedClassId));
  }, [firestore, selectedClassId]);

  const { data: financialRecords, isLoading: isLoadingFinancial } = useCollection<FinancialRecord>(financialRecordsQuery);

  const isLoading = isLoadingClasses || (selectedClassId && (isLoadingStudents || isLoadingAssessments || isLoadingFinancial));

  const studentFinancials = useMemo(() => {
    if (!students || !financialRecords) return {};
    const financials: Record<string, { openingBalance: number, currentCharges: number, totalPaid: number, balance: number }> = {};

    const termIndex = MOCK_TERMS.indexOf(selectedTerm);

    students.forEach(student => {
        const studentRecords = financialRecords.filter(r => r.studentId === student.uid);
        
        let openingBalance = 0;
        let currentCharges = 0;
        let totalPaid = 0;

        studentRecords.forEach(record => {
            const recordTermIndex = MOCK_TERMS.indexOf(record.term || '');
            
            if (record.academicYear < selectedYear || (record.academicYear === selectedYear && recordTermIndex < termIndex)) {
                openingBalance += record.billedAmount - (record.amountPaid + (record.waiverAmount || 0));
            } else if (record.academicYear === selectedYear && recordTermIndex === termIndex) {
                currentCharges += record.billedAmount;
                totalPaid += record.amountPaid + (record.waiverAmount || 0);
            }
        });

        financials[student.uid] = {
            openingBalance,
            currentCharges,
            totalPaid,
            balance: openingBalance + currentCharges - totalPaid
        };
    });
    return financials;
  }, [students, financialRecords, selectedYear, selectedTerm]);

  const toggleForm = (formName: string) => {
    setActiveForm(activeForm === formName ? null : formName);
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
                <Button variant={activeForm === 'grade' ? 'default' : 'outline'} onClick={() => toggleForm('grade')} disabled={!selectedClassId}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Grade Entry
                </Button>
            </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select onValueChange={setSelectedYear} defaultValue={selectedYear}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{MOCK_ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
          </Select>
          <Select onValueChange={setSelectedTerm} defaultValue={selectedTerm}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{MOCK_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          <Select onValueChange={setSelectedClassId} disabled={isLoadingClasses}>
            <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
            <SelectContent>{teacherClasses?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </CardContent>
      </Card>

      {activeForm === 'grade' && selectedClassId && <AssessmentFeedbackForm classId={selectedClassId} />}
      
      {selectedClassId && (
        <Card>
            <CardHeader>
                <CardTitle>Student Overview for {selectedYear} - {selectedTerm}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div> :
                students && students.length > 0 && assessments ? (
                <Accordion type="single" collapsible>
                    {students.map(student => {
                        const { finalGrade, percentage } = calculateStudentGrade(student.uid, assessments);
                        const financials = studentFinancials[student.uid] || { openingBalance: 0, balance: 0 };
                        return (
                            <AccordionItem value={student.uid} key={student.uid}>
                                <AccordionTrigger>
                                    <div className='flex justify-between items-center w-full pr-4'>
                                        <span className="flex items-center gap-2"><User className="h-4 w-4"/>{student.firstName} {student.lastName}</span>
                                        <div className="flex items-center gap-4">
                                            <Badge variant={percentage > 0 ? "default" : "secondary"}>
                                                Academics: {finalGrade} ({percentage}%)
                                            </Badge>
                                            <Badge variant={financials.balance > 0 ? "destructive" : "outline"}>
                                                Balance: GH₵{financials.balance.toFixed(2)}
                                            </Badge>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-2">
                                    <Tabs defaultValue="academics">
                                        <TabsList>
                                            <TabsTrigger value="academics">Academics</TabsTrigger>
                                            <TabsTrigger value="financials">Financials</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="academics">
                                            <StudentGradesDetail student={student} assessments={assessments}/>
                                        </TabsContent>
                                        <TabsContent value="financials">
                                            <div className="p-4 bg-muted/50 rounded-md">
                                                <Table>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell className="font-semibold">Balance Brought Forward</TableCell>
                                                            <TableCell className="text-right">GH₵{financials.openingBalance.toFixed(2)}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-semibold">Charges for this Term</TableCell>
                                                            <TableCell className="text-right">GH₵{financials.currentCharges.toFixed(2)}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="font-semibold">Payments this Term</TableCell>
                                                            <TableCell className="text-right text-green-600">GH₵{financials.totalPaid.toFixed(2)}</TableCell>
                                                        </TableRow>
                                                        <TableRow className="font-bold text-lg border-t-2">
                                                            <TableCell>Outstanding Balance</TableCell>
                                                            <TableCell className="text-right">GH₵{financials.balance.toFixed(2)}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
                ) : (
                    <p className="text-muted-foreground text-center py-8">
                      {isLoadingStudents ? 'Loading students...' : 'No students or records found for this class and term.'}
                    </p>
                )}
            </CardContent>
        </Card>
      )}
    </div>
  );
}
