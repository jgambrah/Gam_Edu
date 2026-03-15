
'use client';

import { AppLogo } from '@/components/icons/app-logo';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { PayrollRecord } from '@/lib/types';
import { format } from 'date-fns';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';

export function PayslipDialog({ payslip }: { payslip: PayrollRecord }) {
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();
  
  const schoolRef = useMemoFirebase(
    () => (firestore && schoolId ? doc(firestore, 'schools', schoolId) : null),
    [firestore, schoolId]
  );
  const { data: schoolProfile } = useDoc(schoolRef);

  const handlePrint = () => {
    window.print();
  };

  return (
    <DialogContent className="max-w-3xl print:max-w-full print:border-none print:shadow-none">
      <div id="payslip-content">
        <DialogHeader className="text-center print:text-left">
          <div className="flex items-center justify-center print:justify-start gap-4">
            {schoolProfile?.logoUrl ? (
              <img src={schoolProfile.logoUrl} alt="Logo" className="h-16 w-16 object-contain" />
            ) : (
              <AppLogo className="h-12 w-12 text-primary" />
            )}
            <div>
              <DialogTitle className="text-3xl">{schoolProfile?.name || 'School Name'}</DialogTitle>
              <DialogDescription>Payslip for Period: {payslip.period}</DialogDescription>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="text-left text-sm space-y-1">
            <p><strong>Staff Name:</strong> {payslip.staffName}</p>
            <p><strong>Staff ID:</strong> {payslip.staffId}</p>
            <p><strong>Pay Date:</strong> {payslip.createdAt?.toDate ? format(payslip.createdAt.toDate(), 'PPP') : 'N/A'}</p>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-8 py-6">
          <div>
            <h4 className="font-semibold text-lg mb-2 border-b pb-1">Earnings</h4>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Basic Salary</TableCell>
                  <TableCell className="text-right">GH₵{(payslip.basicSalary || 0).toFixed(2)}</TableCell>
                </TableRow>
                {(payslip.allowances || []).map((allowance, index) => (
                  <TableRow key={`allowance-${index}`}>
                    <TableCell>{allowance.name}</TableCell>
                    <TableCell className="text-right">GH₵{(allowance.amount || 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>Gross Salary</TableCell>
                  <TableCell className="text-right">GH₵{(payslip.grossSalary || 0).toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-2 border-b pb-1">Deductions</h4>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>SSNIT (Employee)</TableCell>
                  <TableCell className="text-right">GH₵{(payslip.statutory?.ssnitEmployee || 0).toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>PAYE Tax</TableCell>
                  <TableCell className="text-right">GH₵{(payslip.statutory?.paye || 0).toFixed(2)}</TableCell>
                </TableRow>
                {(payslip.deductions || []).map((deduction, index) => (
                  <TableRow key={`deduction-${index}`}>
                    <TableCell>{deduction.name}</TableCell>
                    <TableCell className="text-right">GH₵{(deduction.amount || 0).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                 <TableRow className="font-bold bg-muted/50">
                  <TableCell>Total Deductions</TableCell>
                  <TableCell className="text-right">GH₵{(payslip.totalDeductions || 0).toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        <div className="bg-primary text-primary-foreground p-4 rounded-md flex justify-between items-center">
            <span className="text-xl font-bold">Net Salary</span>
            <span className="text-2xl font-bold">GH₵{(payslip.netSalary || 0).toFixed(2)}</span>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
            <p>Employer SSNIT Contribution: GH₵{(payslip.statutory?.ssnitEmployer || 0).toFixed(2)}</p>
        </div>
      </div>
       <div className="flex justify-end mt-4 print:hidden">
            <Button onClick={handlePrint}>Print Payslip</Button>
      </div>
       <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #payslip-content, #payslip-content * {
            visibility: visible;
          }
          #payslip-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </DialogContent>
  );
}
