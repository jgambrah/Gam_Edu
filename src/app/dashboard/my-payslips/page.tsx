
'use client';

import { useState } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, FileText } from 'lucide-react';
import { PayrollRecord } from '@/lib/types';
import { PayslipDialog } from '../payroll/payslip-dialog';

export default function MyPayslipsPage() {
  const { user } = useAuth();
  const firestore = useFirestore();

  const payslipsQuery = useMemoFirebase(
    () => user ? query(collection(firestore, 'payrollRecords'), where('staffId', '==', user.uid), orderBy('period', 'desc')) : null,
    [firestore, user]
  );
  const { data: payslips, isLoading } = useCollection<PayrollRecord>(payslipsQuery);

  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText /> My Payslips
          </CardTitle>
          <CardDescription>View and download your historical payslips.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : payslips && payslips.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pay Period</TableHead>
                  <TableHead>Gross Salary</TableHead>
                  <TableHead>Net Salary</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.map((slip) => (
                  <TableRow key={slip.id}>
                    <TableCell className="font-medium">{slip.period}</TableCell>
                    <TableCell>GH₵{slip.grossSalary.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold">GH₵{slip.netSalary.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                       <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" onClick={() => setSelectedPayslip(slip)}>View Payslip</Button>
                            </DialogTrigger>
                            {selectedPayslip && selectedPayslip.id === slip.id && (
                               <PayslipDialog payslip={selectedPayslip} />
                            )}
                       </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No payslips found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
