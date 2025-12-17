
'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, User } from 'lucide-react';
import { FinancialRecord, Student } from '@/lib/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function StudentBillView({ studentId }: { studentId: string }) {
    const firestore = useFirestore();
    const recordsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'financialRecords'), where('studentId', '==', studentId)) : null, [firestore, studentId]);
    const { data: records, isLoading } = useCollection<FinancialRecord>(recordsQuery);

    const summary = useMemo(() => {
        if (!records) return { totalBilled: 0, totalPaid: 0, totalWaivers: 0, balance: 0 };
        const totalBilled = records.reduce((acc, r) => acc + r.billedAmount, 0);
        const totalPaid = records.reduce((acc, r) => acc + (r.amountPaid || 0), 0);
        const totalWaivers = records.reduce((acc, r) => acc + (r.waiverAmount || 0), 0);
        const balance = totalBilled - totalPaid - totalWaivers;
        return { totalBilled, totalPaid, totalWaivers, balance };
    }, [records]);

    const getStatusVariant = (status: FinancialRecord['status']) => {
        switch (status) {
            case 'Paid': return 'default';
            case 'Unpaid': return 'secondary';
            case 'Overdue': return 'destructive';
            default: return 'outline';
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }
    
    if (!records || records.length === 0) {
        return <p className="text-center text-muted-foreground p-4">No financial records found.</p>;
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                 <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Billed</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">GH₵{summary.totalBilled.toFixed(2)}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Paid</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold text-green-600">GH₵{summary.totalPaid.toFixed(2)}</p></CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Waivers</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">GH₵{summary.totalWaivers.toFixed(2)}</p></CardContent>
                </Card>
                 <Card className={cn(summary.balance > 0 ? "border-destructive" : "border-green-500")}>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">GH₵{summary.balance.toFixed(2)}</p></CardContent>
                </Card>
            </div>
            <Table>
                <TableHeader><TableRow><TableHead>Description</TableHead><TableHead>Amount</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                    {records.map(rec => (
                        <TableRow key={rec.id}>
                            <TableCell>{rec.description}</TableCell>
                            <TableCell>GH₵{rec.billedAmount.toFixed(2)}</TableCell>
                            <TableCell>{rec.dueDate?.toDate ? format(rec.dueDate.toDate(), 'PPP') : 'N/A'}</TableCell>
                            <TableCell><Badge variant={getStatusVariant(rec.status)}>{rec.status}</Badge></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default function MyBillsPage() {
    const { user, isUserLoading } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();

    const parentDocRef = useMemoFirebase(() => (role === 'Parent' && user) ? doc(firestore, 'parents', user.uid) : null, [firestore, user, role]);
    const { data: parentData, isLoading: isParentLoading } = useDoc<{ studentIds: string[] }>(parentDocRef);

    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !user) return null;
        if (role === 'Student') {
            return query(collection(firestore, 'students'), where('uid', '==', user.uid));
        }
        if (role === 'Parent' && parentData?.studentIds?.length) {
            return query(collection(firestore, 'students'), where('uid', 'in', parentData.studentIds));
        }
        return null;
    }, [firestore, user, role, parentData]);

    const { data: students, isLoading: areStudentsLoading } = useCollection<Student>(studentsQuery);
    
    const isLoading = isUserLoading || isParentLoading || areStudentsLoading;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText /> My Bills</CardTitle>
                <CardDescription>A summary of your financial records with the school.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : (role === 'Student' && students && students.length > 0) ? (
                    <StudentBillView studentId={students[0].uid} />
                ) : (role === 'Parent' && students && students.length > 0) ? (
                    <Accordion type="single" collapsible defaultValue={students[0].uid}>
                        {students.map(student => (
                            <AccordionItem value={student.uid} key={student.uid}>
                                <AccordionTrigger>
                                    <h3 className="text-lg font-semibold flex items-center gap-2"><User /> {student.firstName} {student.lastName}</h3>
                                </AccordionTrigger>
                                <AccordionContent className="p-1">
                                    <StudentBillView studentId={student.uid} />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center p-8 text-muted-foreground">
                        No student information found for your account.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
