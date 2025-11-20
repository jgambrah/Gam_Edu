
'use client';

import { useState } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, writeBatch, getDocs, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Landmark } from 'lucide-react';
import { Staff, StaffPayrollConfig, PayrollSettings, PayrollRecord } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PayslipDialog } from './payslip-dialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

export default function PayrollPage() {
  const { role } = useRole();
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const today = new Date();
  const defaultPeriod = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  const [period, setPeriod] = useState(defaultPeriod);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fetchedRecords, setFetchedRecords] = useState<PayrollRecord[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

  // Data fetching
  const { data: staffList } = useCollection<Staff>(useMemoFirebase(() => user ? collection(firestore, 'staff') : null, [firestore, user]));
  const { data: payrollSettingsList } = useCollection<PayrollSettings>(useMemoFirebase(() => user ? collection(firestore, 'payrollSettings') : null, [firestore, user]));
  const payrollSettings = payrollSettingsList?.[0]; // Assuming singleton

  const hasRequiredData = staffList && payrollSettings;

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
  }

  const handleRunPayroll = async () => {
    if (!hasRequiredData) return;
    setIsProcessing(true);
    toast({ title: "Processing Payroll...", description: `Running payroll for ${period}. This may take a moment.`});

    try {
      // 1. Check if payroll for this period already exists
      const existingRecordsQuery = query(collection(firestore, 'payrollRecords'), where('period', '==', period));
      const existingRecordsSnapshot = await getDocs(existingRecordsQuery);
      if (!existingRecordsSnapshot.empty) {
        toast({ variant: 'destructive', title: 'Payroll Already Run', description: `Payroll for ${period} has already been processed.`});
        setIsProcessing(false);
        return;
      }
      
      const batch = writeBatch(firestore);

      for (const staff of staffList) {
        // 2. Get staff-specific payroll config
        const configSnapshot = await getDocs(query(collection(firestore, `staff/${staff.uid}/payroll`)));
        if (configSnapshot.empty) continue;
        const staffConfig = configSnapshot.docs[0].data() as StaffPayrollConfig;

        // 3. Perform calculations
        const totalAllowances = (staffConfig.allowances || []).reduce((acc, curr) => acc + curr.amount, 0);
        const grossSalary = staffConfig.basicSalary + totalAllowances;
        const ssnitEmployee = grossSalary * payrollSettings.ssnitEmployeeContributionRate;
        const ssnitEmployer = grossSalary * payrollSettings.ssnitEmployerContributionRate;
        const chargeableIncome = grossSalary - ssnitEmployee;
        
        let paye = 0;
        let remainingIncome = chargeableIncome;
        payrollSettings.payeeBrackets.forEach(bracket => {
            if (remainingIncome <= 0) return;
            const taxableInBracket = bracket.to ? Math.min(remainingIncome, bracket.to - bracket.from) : remainingIncome;
            if (taxableInBracket > 0) {
                paye += taxableInBracket * bracket.rate;
                remainingIncome -= taxableInBracket;
            }
        });

        const manualDeductions = (staffConfig.deductions || []).reduce((acc, curr) => acc + curr.amount, 0);
        const totalDeductions = ssnitEmployee + paye + manualDeductions;
        const netSalary = grossSalary - totalDeductions;
        
        // 4. Create payroll record
        const recordRef = doc(collection(firestore, 'payrollRecords'));
        const newRecord: Omit<PayrollRecord, 'id'> = {
          staffId: staff.uid,
          staffName: `${staff.firstName} ${staff.lastName}`,
          period,
          grossSalary,
          netSalary,
          basicSalary: staffConfig.basicSalary,
          totalAllowances,
          totalDeductions,
          allowances: staffConfig.allowances || [],
          deductions: staffConfig.deductions || [],
          statutory: { ssnitEmployee, ssnitEmployer, paye },
          createdAt: new Date(),
        };
        batch.set(recordRef, newRecord);
      }

      await batch.commit();
      toast({ title: "Payroll Run Complete!", description: `Successfully processed payroll for ${staffList.length} staff members.`});
      await handleFetchRecords(); // Refresh the view

    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'An error occurred during payroll processing.' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!['Administrator', 'Director', 'Accountant'].includes(role)) {
    return <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is restricted.</CardDescription></CardHeader></Card>;
  }

  const summary = fetchedRecords.reduce((acc, rec) => {
    acc.gross += rec.grossSalary;
    acc.deductions += rec.totalDeductions;
    acc.net += rec.netSalary;
    return acc;
  }, { gross: 0, deductions: 0, net: 0 });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Landmark/> Payroll Processing</CardTitle>
          <CardDescription>Run monthly payroll and view historical records.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} className="w-fit" />
          <Button onClick={handleFetchRecords} disabled={isFetching}>
            {isFetching && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Fetch Records
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={!hasRequiredData}>Run Payroll for {period}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will run payroll for {staffList?.length || 0} staff members for the period {period}. This action cannot be undone and may have financial implications.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRunPayroll} disabled={isProcessing}>
                  {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                  Yes, Run Payroll
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
        {!hasRequiredData && (
            <CardFooter>
                <p className="text-sm text-destructive">Payroll cannot be run. Please ensure both global settings and staff configurations are complete.</p>
            </CardFooter>
        )}
      </Card>
      
      {fetchedRecords.length > 0 && (
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
      )}
    </div>
  );
}
