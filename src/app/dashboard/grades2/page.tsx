
'use client';

import { useRole } from '@/context/role-context';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { collection, query, where } from 'firebase/firestore';
import { useState } from 'react';
import { StudentGradesView } from './student-grades-view';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Student, FinancialRecord } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function ParentReportCardView() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [selectedTerm, setSelectedTerm] = useState(MOCK_TERMS[0]);
    const [selectedYear, setSelectedYear] = useState(MOCK_ACADEMIC_YEARS[0]);

    // This is a simplified query; a real app might have a 'parentUid' field on the student doc.
    // For now, we assume the parent's email is linked in some way or we fetch all students.
    const parentQuery = useMemoFirebase(() => user ? query(collection(firestore, 'parents'), where('uid', '==', user.uid)) : null, [firestore, user]);
    const { data: parentData } = useCollection<{studentIds: string[]}>(parentQuery);
    
    const studentsQuery = useMemoFirebase(() => parentData?.[0]?.studentIds ? query(collection(firestore, 'students'), where('uid', 'in', parentData[0].studentIds)) : null, [firestore, parentData]);
    const { data: students } = useCollection<Student>(studentsQuery);

    const financialRecordsQuery = useMemoFirebase(() => students ? query(collection(firestore, 'financialRecords'), where('studentId', 'in', students.map(s=>s.uid))) : null, [firestore, students]);
    const { data: financialRecords } = useCollection<FinancialRecord>(financialRecordsQuery);

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Children's Grades</CardTitle>
                <CardDescription>Select a term and year to view the grade summary for your children.</CardDescription>
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
            </CardContent>
            <CardContent>
                {students && students.length > 0 ? (
                    <Accordion type="single" collapsible defaultValue={students[0].id}>
                        {students.map(student => (
                            <AccordionItem value={student.id} key={student.id}>
                                <AccordionTrigger>{student.firstName} {student.lastName}</AccordionTrigger>
                                <AccordionContent>
                                    <StudentGradesView student={student} term={selectedTerm} year={selectedYear} financialRecords={financialRecords || []}/>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ): (
                    <p>No students linked to your parent account.</p>
                )}
            </CardContent>
        </Card>
    )
}

export default function GradesPage() {
    const { role } = useRole();
    const { user } = useUser();
    const firestore = useFirestore();

    const studentsQuery = useMemoFirebase(() => user ? query(collection(firestore, 'students'), where('uid', '==', user.uid)): null, [firestore, user]);
    const { data: students } = useCollection<Student>(studentsQuery);

    const financialRecordsQuery = useMemoFirebase(() => user ? query(collection(firestore, 'financialRecords'), where('studentId', '==', user.uid)) : null, [firestore, user]);
    const { data: financialRecords } = useCollection<FinancialRecord>(financialRecordsQuery);

    if (role === 'Student' && students && students[0]) {
        return <StudentGradesView student={students[0]} term={MOCK_TERMS[0]} year={MOCK_ACADEMIC_YEARS[0]} financialRecords={financialRecords || []} />;
    }

    if (role === 'Parent') {
        return <ParentReportCardView />;
    }
  
    return (
        <Card>
            <CardHeader>
                <CardTitle>Gradebook</CardTitle>
                <CardDescription>This is a placeholder for the teacher and admin gradebook views. Student and Parent views are functional.</CardDescription>
            </CardHeader>
        </Card>
    )
}
