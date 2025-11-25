'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, doc, query, where } from 'firebase/firestore';
import { ReportCard, Student } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { StudentGradebook } from './student-gradebook';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Suspense } from 'react';
import { useRole } from '@/context/role-context';

function ReportListForStudent({ student }: { student: Student }) {
    const firestore = useFirestore();
    const [selectedReport, setSelectedReport] = useState<ReportCard | null>(null);

    const reportsQuery = useMemoFirebase(
      () => query(collection(firestore, 'report-cards'), where('studentId', '==', student.uid), where('status', '==', 'Published')),
      [firestore, student.uid]
    );
    const { data: reports, isLoading } = useCollection<ReportCard>(reportsQuery);

    if (isLoading) {
        return <Loader2 className="h-5 w-5 animate-spin" />;
    }

    if (!reports || reports.length === 0) {
        return <p className="text-sm text-muted-foreground">No published gradebooks available.</p>;
    }
    
    return (
        <div className="space-y-2">
            {reports.map(report => (
                <div key={report.id} className="flex justify-between items-center p-2 border rounded-md">
                    <div>
                        <p className="font-medium">{report.academicYear} - {report.term}</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">View Gradebook</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                            <DialogHeader><DialogTitle>Student Gradebook</DialogTitle></DialogHeader>
                            <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
                                <StudentGradebook student={student} term={report.term} year={report.academicYear} />
                            </Suspense>
                        </DialogContent>
                    </Dialog>
                </div>
            ))}
        </div>
    )
}

export default function StudentParentGradebook2View() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { role } = useRole();

    // Fetch parent data to find their children
    const parentDocRef = useMemoFirebase(() => (role === 'Parent' && user) ? doc(firestore, 'parents', user.uid) : null, [firestore, user, role]);
    const { data: parentData, isLoading: isParentLoading } = useDoc<{ studentIds: string[] }>(parentDocRef);

    // Fetch student data for the children
    const studentsQuery = useMemoFirebase(() => {
        if (role === 'Parent' && parentData && parentData.studentIds.length > 0) {
            return query(collection(firestore, 'students'), where('uid', 'in', parentData.studentIds));
        }
        if (role === 'Student' && user) {
            return query(collection(firestore, 'students'), where('uid', '==', user.uid));
        }
        return null;
    }, [firestore, role, user, parentData]);
    const { data: students, isLoading: areStudentsLoading } = useCollection<Student>(studentsQuery);
    
    const isLoading = isUserLoading || isParentLoading || areStudentsLoading;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText /> My Gradebooks</CardTitle>
                <CardDescription>View published academic gradebooks for each term.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : students && students.length > 0 ? (
                    <Accordion type="single" collapsible defaultValue={students[0].id}>
                        {students.map(student => (
                            <AccordionItem value={student.id} key={student.id}>
                                <AccordionTrigger>
                                    <h3 className="text-lg font-semibold">{student.firstName} {student.lastName}</h3>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ReportListForStudent student={student} />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No student information found.</p>
                )}
            </CardContent>
        </Card>
    )
}
