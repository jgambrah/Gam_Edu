
'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, query, where, Timestamp, documentId } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, User, CalendarIcon, ShieldAlert } from 'lucide-react';
import { FinancialRecord, Student } from '@/lib/types';
import { format, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { StudentDisplay } from '@/components/student-display';

function StudentBillView({ studentId }: { studentId: string }) {
    const firestore = useFirestore();
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

    const recordsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        let q = query(collection(firestore, 'financialRecords'), where('studentId', '==', studentId));
        if (dateRange?.from) {
            q = query(q, where('dueDate', '>=', Timestamp.fromDate(startOfDay(dateRange.from))));
        }
        if (dateRange?.to) {
            q = query(q, where('dueDate', '<=', Timestamp.fromDate(endOfDay(dateRange.to))));
        }
        return q;
    }, [firestore, studentId, dateRange]);
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
        return <p className="text-center text-muted-foreground p-4">No financial records found for the selected period.</p>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn("w-[300px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (dateRange.to ? (<>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>) : (format(dateRange.from, "LLL dd, y"))) : (<span>Filter by Due Date</span>)}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                    </PopoverContent>
                </Popover>
            </div>
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
            <div className="overflow-x-auto w-full">
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
        </div>
    );
}

// ✅ FIXED: Query student by UID instead of document ID
function StudentAccordionItem({ studentUid }: { studentUid: string }) {
    const firestore = useFirestore();
    
    // ✅ FIX: Fetch directly by Document ID to be 100% accurate
    const studentDocRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'students', studentUid) : null,
        [firestore, studentUid]
    );
    
    // ✅ Use useDoc instead of useCollection
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
                <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Student Record ({studentUid}) not found in the database.</span>
                </div>
            </div>
        );
    }

    return (
        <AccordionItem value={student.uid || studentUid} key={student.uid || studentUid}>
            <AccordionTrigger>
                <StudentDisplay student={student} variant="list" showAvatar/>
            </AccordionTrigger>
            <AccordionContent className="p-1">
                <StudentBillView studentId={student.uid || studentUid} />
            </AccordionContent>
        </AccordionItem>
    );
}


export default function MyBillsPage() {
    const { user, isUserLoading } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();

    const parentDocRef = useMemoFirebase(() => (role === 'Parent' && user && firestore) ? doc(firestore, 'parents', user.uid) : null, [firestore, user?.uid, role]);
    const { data: parentData, isLoading: isParentLoading } = useDoc<{ studentIds: string[] }>(parentDocRef);
    
    const { data: studentForStudentRole, isLoading: isStudentLoading } = useCollection<Student>(
        useMemoFirebase(() => (role === 'Student' && user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user?.uid, role])
    );
    
    const studentIds = useMemo(() => parentData?.studentIds || [], [parentData]);
    const isLoading = isUserLoading || isParentLoading || isStudentLoading;

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
            </Card>
        );
    }

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
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><FileText /> My Bills</CardTitle>
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
                    <CardTitle className="flex items-center gap-2"><FileText /> My Bills</CardTitle>
                    <CardDescription>
                        Financial records for {studentIds.length} {studentIds.length === 1 ? 'child' : 'children'}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
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
                <CardDescription>This page is for parents and students only.</CardDescription>
            </CardHeader>
        </Card>
    );
}
