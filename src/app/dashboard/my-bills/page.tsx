
'use client';

import { useState, useMemo, Suspense } from 'react';
import { useAuth, useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, doc, query, where, Timestamp, documentId, orderBy } from 'firebase/firestore';
import { Student, FinancialRecord } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, FileText, ShieldAlert } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { StudentDisplay } from '@/components/student-display';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { GenerateStatement } from '@/components/dashboard/finance/GenerateStatement';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';

function StudentBillView({ studentId }: { studentId: string }) {
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    const recordsQuery = useMemoFirebase(() => {
        if (!firestore || !studentId || !schoolId) return null;
        return query(
            collection(firestore, 'financialRecords'), 
            where('schoolId', '==', schoolId),
            where('studentId', '==', studentId),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, studentId, schoolId]);
    const { data: records, isLoading } = useCollection<FinancialRecord>(recordsQuery);

    const { data: student } = useDoc<Student>(useMemoFirebase(() => firestore && studentId ? doc(firestore, 'students', studentId) : null, [firestore, studentId]));

    const overallSummary = useMemo(() => {
        if (!records) return { totalBilled: 0, totalPaid: 0, totalWaivers: 0, balance: 0 };
        const totalBilled = records.reduce((acc, r) => acc + (r.billedAmount || 0), 0);
        const totalPaid = records.reduce((acc, r) => acc + (r.amountPaid || 0), 0);
        const totalWaivers = records.reduce((acc, r) => acc + (r.waiverAmount || 0), 0);
        const balance = totalBilled - totalPaid - totalWaivers;
        return { totalBilled, totalPaid: totalPaid + totalWaivers, totalWaivers, balance };
    }, [records]);

    const filteredRecords = useMemo(() => {
        if (!records) return [];
        
        if (!dateRange || !dateRange.from) return records;
        
        return records.filter(rec => {
            if (!rec.dueDate?.toDate) return false;
            const recDate = rec.dueDate.toDate();
            const from = startOfDay(dateRange.from!);
            const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from!);
            return recDate >= from && recDate <= to;
        });
    }, [records, dateRange]);


    const getStatusVariant = (status: FinancialRecord['status']) => {
        switch (status) {
            case 'Paid': return 'default';
            case 'Unpaid': return 'secondary';
            case 'Overdue': return 'destructive';
            default: return 'outline';
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
    }
    
    if (!records || records.length === 0) {
        return <p className="text-center text-muted-foreground p-4 italic">No financial records found.</p>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Billed</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">GH₵{overallSummary.totalBilled.toFixed(2)}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Paid</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold text-green-600">GH₵{overallSummary.totalPaid.toFixed(2)}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Waivers</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">GH₵{overallSummary.totalWaivers.toFixed(2)}</p></CardContent>
                </Card>
                 <Card className={cn(overallSummary.balance > 0.01 ? "border-destructive" : "border-green-500")}>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">GH₵{Math.max(0, overallSummary.balance).toFixed(2)}</p></CardContent>
                </Card>
            </div>
            <div className="overflow-x-auto w-full border rounded-xl overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRecords.map(rec => (
                            <TableRow key={rec.id}>
                                <TableCell className="font-medium">{rec.description}</TableCell>
                                <TableCell className="text-right font-bold">GH₵{(rec.billedAmount || 0).toFixed(2)}</TableCell>
                                <TableCell className="text-xs">{rec.dueDate?.toDate ? format(rec.dueDate.toDate(), 'PPP') : 'N/A'}</TableCell>
                                <TableCell><Badge variant={getStatusVariant(rec.status)}>{rec.status}</Badge></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="mt-4">
                <GenerateStatement 
                    student={student}
                    records={filteredRecords}
                    dateRange={dateRange}
                    summary={overallSummary}
                />
            </div>
        </div>
    );
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
                <Loader2 className="h-5 w-5 animate-spin text-primary"/>
                <span className="ml-2 text-muted-foreground">Loading child...</span>
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
        <AccordionItem value={student.uid || studentUid} key={student.uid || studentUid} className="border rounded-xl mb-3 overflow-hidden shadow-sm bg-white">
            <AccordionTrigger className="px-4 py-5 hover:no-underline hover:bg-slate-50 transition-all">
                <StudentDisplay student={student} variant="list" showAvatar/>
            </AccordionTrigger>
            <AccordionContent className="p-4 bg-slate-50/50 border-t">
                <StudentBillView studentId={student.uid || studentUid} />
            </AccordionContent>
        </AccordionItem>
    );
}


function MyBillsPageContent() {
    const { user } = useUser();
    const { role, profile, loading: isRoleLoading } = useRole();
    const firestore = useFirestore();

    // Robust field mapping for linked students
    const studentIds = useMemo(() => {
        return profile?.studentIds || profile?.student_ids || profile?.students || profile?.childrenIds || profile?.linkedStudentIds || [];
    }, [profile]);
    const studentIdsStr = studentIds.join(',');
    
    const { data: studentForStudentRole } = useCollection<Student>(
        useMemoFirebase(() => (role === 'Student' && user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user?.uid, role])
    );
    
    if (role === 'Student') {
        const student = studentForStudentRole?.[0];
        if (!student) {
            return (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        Your student profile could not be loaded.
                    </CardContent>
                </Card>
            );
        }
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText /> My Bills</CardTitle>
                    <CardDescription>A summary of your financial records with the school.</CardDescription>
                </CardHeader>
                <CardContent>
                    <StudentBillView studentId={student.uid} />
                </CardContent>
            </Card>
        );
    }

    if (role === 'Parent') {
        if (!studentIds || studentIds.length === 0) {
            return (
                <Card className="border-2 border-dashed bg-slate-50">
                    <CardHeader className="text-center">
                        <Users className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                        <CardTitle>No Children Linked</CardTitle>
                        <CardDescription>We couldn't find any children associated with your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center pb-8">
                        <p className="text-sm text-slate-500">Please contact the school office to link your children to your parent account.</p>
                    </CardContent>
                </Card>
            );
        }
        
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-900 tracking-tight">
                        <FileText className="text-indigo-600 h-8 w-8" /> My Children's Bills
                    </h1>
                    <p className="text-slate-500">Official financial statements and outstanding dues.</p>
                </div>

                <Accordion type="single" collapsible defaultValue={studentIds[0]} className="w-full">
                    {studentIds.map(uid => (
                        <StudentAccordionItem key={uid} studentUid={uid} />
                    ))}
                </Accordion>
            </div>
        );
    }

    // Fallback for other roles
    return (
        <Card>
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>This page is for parents and students only.</CardDescription>
            </CardHeader>
        </Card>
    );
}

export default function MyBillsPage() {
    const { isUserLoading } = useUser();
    const { loading: isRoleLoading } = useRole();

    const isLoading = isUserLoading || isRoleLoading;
    
    return (
      <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
        {isLoading ? (
          <div className="flex justify-center p-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="p-4 md:p-6 max-w-5xl mx-auto">
            <MyBillsPageContent />
          </div>
        )}
      </Suspense>
    );
}
