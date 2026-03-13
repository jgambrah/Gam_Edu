'use client';

import { useState, useMemo } from 'react';
import { useUser, useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where, Timestamp, documentId } from 'firebase/firestore';
import { ReportCard, Student } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { StudentReportCard } from './student-report-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Suspense } from 'react';
import { useRole } from '@/context/role-context';
import { StudentDisplay } from '@/components/student-display';

function ReportListForStudent({ student }: { student: Student }) {
    const firestore = useFirestore();
    
    const studentIdentifier = student.id || student.uid;

    const reportsQuery = useMemoFirebase(
      () => studentIdentifier ? query(
          collection(firestore, 'report-cards'), 
          where('studentId', '==', studentIdentifier), 
          where('status', '==', 'Published')
      ) : null,
      [firestore, studentIdentifier]
    );
    const { data: reports, isLoading } = useCollection<ReportCard>(reportsQuery);

    if (isLoading) {
        return <div className="p-4 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>;
    }

    if (!reports || reports.length === 0) {
        return <p className="text-sm text-muted-foreground p-6 text-center italic">No published report cards available for this child.</p>;
    }
    
    return (
        <div className="space-y-2 p-3">
            {reports.map(report => (
                <div key={report.id} className="flex justify-between items-center p-3 border rounded-md bg-white shadow-sm">
                    <div>
                        <p className="font-medium text-slate-900">{report.academicYear} - {report.term}</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">View Report</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader><DialogTitle>Student Report Card</DialogTitle></DialogHeader>
                            <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
                                <StudentReportCard student={student} term={report.term} year={report.academicYear} />
                            </Suspense>
                        </DialogContent>
                    </Dialog>
                </div>
            ))}
        </div>
    )
}

function StudentAccordionItem({ studentUid }: { studentUid: string }) {
    const firestore = useFirestore();
    
    const studentDocRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'students', studentUid) : null,
        [firestore, studentUid]
    );
    
    const { data: student, isLoading } = useDoc<Student>(studentDocRef);

    if (isLoading) {
        return (
            <div className="flex items-center p-4 border-b">
                <Loader2 className="h-5 w-5 animate-spin"/>
                <span className="ml-2 text-muted-foreground">Loading child...</span>
            </div>
        );
    }
    
    if (!student) {
        return (
             <div className="p-4 border-b text-red-500 bg-red-50 rounded-md my-2">
                <ShieldAlert className="h-4 w-4 inline mr-2" />
                <span>Student record ({studentUid}) missing from database.</span>
            </div>
        );
    }

    return (
        <AccordionItem value={studentUid} key={studentUid} className="border rounded-lg mb-2 overflow-hidden px-2">
            <AccordionTrigger className="hover:no-underline py-4 px-2">
                <StudentDisplay student={student} variant="list" showAvatar/>
            </AccordionTrigger>
            <AccordionContent className="p-0 bg-slate-50 border-t">
                <ReportListForStudent student={student} />
            </AccordionContent>
        </AccordionItem>
    );
}


export default function StudentParentReportCardView() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { role } = useRole();

    const parentDocRef = useMemoFirebase(
        () => (role === 'Parent' && user && firestore) ? doc(firestore, 'parents', user.uid) : null,
        [firestore, user?.uid, role]
    );
    const { data: parentData, isLoading: isParentLoading } = useDoc<{ studentIds: string[] }>(parentDocRef);
    
    const { data: studentForStudentRole, isLoading: isStudentLoading } = useCollection<Student>(
        useMemoFirebase(() => (role === 'Student' && user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user?.uid, role])
    );
    
    const studentIds = useMemo(() => parentData?.studentIds || [], [parentData?.studentIds?.join(',')]);

    const studentsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        if (role === 'Parent' && studentIds.length > 0) {
            return query(collection(firestore, 'students'), where(documentId(), 'in', studentIds));
        }
        if (role === 'Student' && user) {
            return query(collection(firestore, 'students'), where('uid', '==', user.uid));
        }
        return null;
    }, [firestore, role, user?.uid, studentIds.join(',')]);

    const { data: students, isLoading: areStudentsLoading } = useCollection<Student>(studentsQuery);
    
    const isLoading = isUserLoading || isParentLoading || isStudentLoading || areStudentsLoading;

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }
    
    // --- View for Students ---
    if (role === 'Student') {
        const student = students?.[0];
        if (!student) return <div className="p-8 text-center text-muted-foreground">Your student profile could not be found.</div>;
        
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="text-primary" /> My Report Cards</CardTitle>
                </CardHeader>
                <CardContent>
                    <ReportListForStudent student={student} />
                </CardContent>
            </Card>
        );
    }

    // --- View for Parents ---
    if (role === 'Parent') {
        if (!students || students.length === 0) {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText className="text-primary" /> My Bills</CardTitle>
                        <CardDescription>A summary of your financial records with the school.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        No children linked to your account.
                    </CardContent>
                </Card>
            );
        }
        
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                        <FileText className="text-primary" /> My Children's Reports
                    </CardTitle>
                    <CardDescription>Select a child to view their published academic results.</CardDescription>
                </CardHeader>
                <CardContent>
                    {studentIds.length > students.length && (
                        <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700 flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3" />
                            Some linked student records could not be found.
                        </div>
                    )}

                    <Accordion type="single" collapsible defaultValue={studentIds[0]}>
                        {studentIds.map(uid => (
                            <StudentAccordionItem key={uid} studentUid={uid} />
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>This page is only accessible to Parents and Students.</CardDescription>
            </CardHeader>
        </Card>
    );
}