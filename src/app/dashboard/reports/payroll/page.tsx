
'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Printer, Landmark } from 'lucide-react';
import { PayrollRecord } from '@/lib/types';
import Link from 'next/link';
import { PayslipDialog } from '../../payroll/payslip-dialog';

export default function PayrollReportsPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();

    const today = new Date();
    const defaultPeriod = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const [period, setPeriod] = useState(defaultPeriod);
    const [fetchedRecords, setFetchedRecords] = useState<PayrollRecord[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);

    const handleFetchRecords = async () => {
        setIsFetching(true);
        try {
            const recordsQuery = query(collection(firestore, 'payrollRecords'), where('period', '==', period));
            const querySnapshot = await getDocs(recordsQuery);
            const records = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PayrollRecord[];
            setFetchedRecords(records);
            if (records.length > 0) {
                toast({ title: 'Success', description: `Fetched ${records.length} records for ${period}.`});
            } else {
                toast({ title: 'No Records', description: `No payroll records found for ${period}.`});
            }
        } catch(e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch records.' });
        } finally {
            setIsFetching(false);
        }
    };
    
    const summary = useMemo(() => {
        return fetchedRecords.reduce((acc, rec) => {
            acc.gross += rec.grossSalary;
            acc.deductions += rec.totalDeductions;
            acc.net += rec.netSalary;
            return acc;
        }, { gross: 0, deductions: 0, net: 0 });
    }, [fetchedRecords]);

    if (!canAccess) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>This module is restricted to financial and administrative staff.</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    return (
        <div className="space-y-6" id="report-content">
            <div className="flex items-center justify-between print:hidden">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2"><Landmark /> Payroll Reports</h1>
                    <p className="text-muted-foreground">Review and analyze historical payroll data.</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline"><Link href="/dashboard/reports/academics">Academics</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/enrollment">Enrollment</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/attendance">Attendance</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/financials">Financials</Link></Button>
                    <Button onClick={() => window.print()}><Printer className="mr-2"/>Print</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>Select a pay period to generate a report.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} className="w-fit" />
                    <Button onClick={handleFetchRecords} disabled={isFetching}>
                        {isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null} Fetch Records
                    </Button>
                </CardContent>
            </Card>
            
            {fetchedRecords.length > 0 ? (
                <>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card><CardHeader><CardTitle>Total Gross Salary</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">${summary.gross.toFixed(2)}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle>Total Deductions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">${summary.deductions.toFixed(2)}</p></CardContent></Card>
                        <Card><CardHeader><CardTitle>Total Net Payout</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">${summary.net.toFixed(2)}</p></CardContent></Card>
                    </div>
                    <Card>
                        <CardHeader><CardTitle>Payroll Records for {period}</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader><TableRow><TableHead>Staff Name</TableHead><TableHead>Gross Salary</TableHead><TableHead>Deductions</TableHead><TableHead>Net Salary</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {fetchedRecords.map(rec => (
                                        <TableRow key={rec.id}>
                                            <TableCell className="font-medium">{rec.staffName}</TableCell>
                                            <TableCell>${rec.grossSalary.toFixed(2)}</TableCell>
                                            <TableCell>${rec.totalDeductions.toFixed(2)}</TableCell>
                                            <TableCell className="font-bold">${rec.netSalary.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" onClick={() => setSelectedPayslip(rec)}>View Payslip</Button>
                                                    </DialogTrigger>
                                                    {selectedPayslip && selectedPayslip.id === rec.id && (
                                                        <PayslipDialog payslip={selectedPayslip} />
                                                    )}
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            ) : (
                 !isFetching && <div className="text-center py-20 bg-muted rounded-lg"><p className="text-muted-foreground">Please select a period and click "Fetch Records".</p></div>
            )}
             <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print\\:hidden {
                        display: none;
                    }
                    #report-content, #report-content * {
                        visibility: visible;
                    }
                    #report-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
