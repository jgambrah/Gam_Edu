
'use client';

import { useState, useMemo } from 'react';
import { useUser, useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where, Timestamp, documentId, orderBy } from 'firebase/firestore';
import { ReportCard, Student } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, AlertTriangle, ShieldAlert, Users } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { StudentReportCard } from './student-report-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Suspense } from 'react';
import { useRole } from '@/context/role-context';
import { StudentDisplay } from '@/components/student-display';
import { useCurrentSchool } from '@/hooks/use-current-school';

function ReportListForStudent({ student }: { student: Student }) {
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const studentIdentifier = student.id || student.uid;

    const reportsQuery = useMemoFirebase(
      () => (studentIdentifier && firestore && schoolId) ? query(
          collection(firestore, 'report-cards'), 
          where('schoolId', '==', schoolId),
          where('studentId', '==', studentIdentifier), 
          where('status', '==', 'Published'),
          orderBy('publishedAt', 'desc')
      ) : null,
      [firestore, studentIdentifier, schoolId]
    );
    const { data: reports, isLoading } = useCollection<ReportCard>(reportsQuery);

    if (isLoading) {
        return <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
    }

    if (!reports || reports.length === 0) {
        return (
            <div className="p-8 text-center bg-white/50 border border-dashed rounded-xl m-3">
                <p className="text-sm text-slate-500 italic">No published report cards available for this child yet.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-3 p-4">
            {reports.map(report => (
                <div key={report.id} className="flex justify-between items-center p-4 border rounded-xl bg-white shadow-sm hover:border-indigo-200 transition-all">
                    <div>
                        <p className="font-bold text-slate-900">{report.academicYear} - {report.term}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">
                            Average: <span className="text-indigo-600">{(report as any).overallAverage || report.finalPercentage || 0}%</span> • Rank: <span className="text-indigo-600">{report.classPosition}</span>
                        </p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="rounded-xl font-bold border-indigo-100 text-indigo-700 hover:bg-indigo-50">View Report</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto rounded-[2rem] border-8 border-indigo-50">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black uppercase tracking-tight">Academic Achievement Report</DialogTitle>
                            </DialogHeader>
                            <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
                                <StudentReportCard student={student} term={report.term} year={report.academicYear} savedReport={report} />
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
            <div className="flex items-center p-6 border-b">
                <Loader2 className="h-5 w-5 animate-spin text-primary"/>
                <span className="ml-3 text-sm font-medium text-slate-500">Loading academic history...</span>
            </div>
        );
    }
    
    if (!student) {
        return (
             <div className="p-4 border-b text-red-500 bg-red-50 rounded-md my-2">
                <ShieldAlert className="h-4 w-4 inline mr-2" />
                <span>Student record could not be found.</span>
            </div>
        );
    }

    return (
        <AccordionItem value={studentUid} key={studentUid} className="border rounded-2xl mb-4 overflow-hidden shadow-sm bg-white">
            <AccordionTrigger className="hover:no-underline px-6 py-5 hover:bg-slate-50 transition-all">
                <StudentDisplay student={student} variant="list" showAvatar/>
            </AccordionTrigger>
            <AccordionContent className="p-0 bg-slate-50/30 border-t">
                <ReportListForStudent student={student} />
            </AccordionContent>
        </AccordionItem>
    );
}


export default function StudentParentReportCardView() {
    const firestore = useFirestore();
    const { user, isUserLoading } = useUser();
    const { role, profile, loading: isRoleLoading } = useRole();
    const { schoolId } = useCurrentSchool();

    // Robust field mapping for linked students
    const studentIds = useMemo(() => {
        return profile?.studentIds || profile?.student_ids || profile?.students || profile?.childrenIds || profile?.linkedStudentIds || [];
    }, [profile]);
    const studentIdsStr = studentIds.join(',');

    const { data: studentForStudentRole, isLoading: isStudentLoading } = useCollection<Student>(
        useMemoFirebase(() => (role === 'Student' && user && firestore && schoolId) ? query(collection(firestore, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, [firestore, user?.uid, role, schoolId])
    );
    
    const isLoading = isUserLoading || isRoleLoading || isStudentLoading;

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }
    
    // --- View for Students ---
    if (role === 'Student') {
        const student = studentForStudentRole?.[0];
        if (!student) return (
            <div className="p-12 text-center border-2 border-dashed rounded-3xl bg-slate-50 max-w-2xl mx-auto">
                <p className="text-slate-500">Student profile not found.</p>
            </div>
        );
        
        return (
            <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                        <FileText className="text-indigo-600 h-8 w-8" /> My Report Cards
                    </h1>
                    <p className="text-slate-500">Official terminal results and academic assessments.</p>
                </div>
                <Card className="rounded-3xl shadow-lg border-indigo-50">
                    <CardContent className="p-0">
                        <ReportListForStudent student={student} />
                    </CardContent>
                </Card>
            </div>
        );
    }

    // --- View for Parents ---
    if (role === 'Parent') {
        if (!studentIds || studentIds.length === 0) {
            return (
                <div className="p-12 text-center border-2 border-dashed rounded-3xl bg-slate-50 max-w-2xl mx-auto mt-10">
                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-slate-800">No Reports Available</h3>
                    <p className="text-slate-500 mt-2">We couldn't find any children linked to your account.</p>
                </div>
            );
        }
        
        return (
            <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                        <FileText className="text-indigo-600 h-8 w-8" /> Children's Reports
                    </h1>
                    <p className="text-slate-500">Download official academic records for your children.</p>
                </div>

                <Accordion type="single" collapsible defaultValue={studentIds[0]} className="w-full">
                    {studentIds.map((uid: string) => (
                        <StudentAccordionItem key={uid} studentUid={uid} />
                    ))}
                </Accordion>
            </div>
        );
    }
    
    return null;
}
