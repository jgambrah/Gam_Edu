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
import { Printer, Landmark, FileText, CheckCircle2 } from 'lucide-react';

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

  // Backwards compatibility mappings for legacy schemas
  const paye = payslip.statutory?.paye ?? (payslip as any).payeTax ?? 0;
  const ssnitEmployee = payslip.statutory?.ssnitEmployee ?? (payslip as any).ssnitDeduction ?? 0;
  const ssnitEmployer = payslip.statutory?.ssnitEmployer ?? (payslip as any).employerSSNIT ?? 0;
  const totalDeductions = payslip.totalDeductions ?? (ssnitEmployee + paye + (payslip.deductions || []).reduce((s, d) => s + (d.amount || 0), 0));
  
  const bankName = payslip.bankName ?? (payslip as any).bankName ?? '';
  const accountNumber = payslip.accountNumber ?? (payslip as any).accountNumber ?? '';
  const ssnitNumber = payslip.ssnitNumber ?? (payslip as any).ssnitNumber ?? '';
  const tinNumber = payslip.tinNumber ?? (payslip as any).tinNumber ?? '';

  return (
    <DialogContent className="max-w-3xl print:max-w-full print:border-none print:shadow-none print:p-0 rounded-2xl overflow-hidden bg-white shadow-xl border border-slate-100">
      <div id="payslip-content" className="p-6 md:p-8 space-y-6 bg-white relative">
        {/* Print-only corporate header decoration */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none flex items-center justify-center select-none z-0">
          <Landmark className="h-80 w-80 text-slate-900" />
        </div>

        <div className="relative z-10 space-y-6">
          {/* Header block */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
            <div className="flex items-center gap-4">
              {schoolProfile?.logoUrl ? (
                <img src={schoolProfile.logoUrl} alt="Logo" className="h-14 w-14 object-contain" />
              ) : (
                <div className="h-14 w-14 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100">
                  <Landmark className="h-7 w-7 text-indigo-650" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{schoolProfile?.name || 'School Name'}</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Official Employee Payslip</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider border border-indigo-100">Period allocation</span>
              <p className="text-lg font-black text-slate-800 mt-1.5 font-mono">{payslip.period}</p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Staff Member</span>
              <p className="font-bold text-slate-800 text-sm leading-tight">{payslip.staffName}</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Staff UID</span>
              <p className="font-mono text-slate-600 font-semibold">{payslip.staffId.slice(0, 10)}...</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Statutory Numbers</span>
              <p className="font-mono text-slate-600 leading-tight">
                {ssnitNumber ? `SSNIT: ${ssnitNumber}` : ''}
                {tinNumber ? <><br />{`TIN: ${tinNumber}`}</> : ''}
                {!ssnitNumber && !tinNumber ? 'None Provided' : ''}
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Payment Method</span>
              <p className="text-slate-700 font-medium leading-tight">
                {bankName ? (
                  <>
                    <span className="font-bold text-slate-800">{bankName}</span>
                    <br />
                    <span className="font-mono text-[11px] text-slate-500">{accountNumber}</span>
                  </>
                ) : (
                  'Cash/Till Disbursement'
                )}
              </p>
            </div>
          </div>

          {/* Calculations split columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            {/* Earnings */}
            <div className="space-y-3">
              <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest border-b pb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Cash Earnings & Additions
              </h4>
              <Table>
                <TableBody className="text-xs">
                  <TableRow className="hover:bg-transparent">
                    <TableCell className="py-2.5 font-medium text-slate-700">Basic Monthly Salary</TableCell>
                    <TableCell className="py-2.5 text-right font-mono font-bold text-slate-850">GH₵{(payslip.basicSalary || 0).toFixed(2)}</TableCell>
                  </TableRow>
                  {(payslip.allowances || []).map((allowance, index) => (
                    <TableRow key={`allowance-${index}`} className="hover:bg-transparent">
                      <TableCell className="py-2.5 font-medium text-slate-650">{allowance.name}</TableCell>
                      <TableCell className="py-2.5 text-right font-mono text-slate-700">GH₵{(allowance.amount || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-slate-50/50 hover:bg-slate-50/50 border-t">
                    <TableCell className="py-3 text-slate-800">Gross Salaries & Perks</TableCell>
                    <TableCell className="py-3 text-right font-mono text-slate-900">GH₵{(payslip.grossSalary || 0).toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Deductions */}
            <div className="space-y-3">
              <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest border-b pb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-rose-500" /> Deductions & Statutories
              </h4>
              <Table>
                <TableBody className="text-xs">
                  <TableRow className="hover:bg-transparent text-rose-650">
                    <TableCell className="py-2.5 font-medium text-slate-700">SSNIT Employee (5.5%)</TableCell>
                    <TableCell className="py-2.5 text-right font-mono font-semibold">-GH₵{ssnitEmployee.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow className="hover:bg-transparent text-rose-650">
                    <TableCell className="py-2.5 font-medium text-slate-700">GRA PAYE Income Tax</TableCell>
                    <TableCell className="py-2.5 text-right font-mono font-semibold">-GH₵{paye.toFixed(2)}</TableCell>
                  </TableRow>
                  {(payslip.deductions || []).map((deduction, index) => (
                    <TableRow key={`deduction-${index}`} className="hover:bg-transparent text-rose-650">
                      <TableCell className="py-2.5 font-medium text-slate-650">{deduction.name}</TableCell>
                      <TableCell className="py-2.5 text-right font-mono font-semibold">-GH₵{(deduction.amount || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-slate-50/50 hover:bg-slate-50/50 border-t">
                    <TableCell className="py-3 text-slate-800">Total Deductions Outflow</TableCell>
                    <TableCell className="py-3 text-right font-mono text-rose-600">GH₵{totalDeductions.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Net Pay box */}
          <div className="bg-indigo-600 text-white p-4.5 rounded-2xl flex justify-between items-center shadow-lg shadow-indigo-100 z-10 relative">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-200">Net Take-Home Pay</span>
              <p className="text-xs text-indigo-150 mt-0.5">Calculated compliance payout</p>
            </div>
            <span className="text-2xl font-black font-mono">GH₵{(payslip.netSalary || 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider px-2">
            <span>Employer SSNIT Share (13%): GH₵{ssnitEmployer.toFixed(2)}</span>
            <span>Date Paid: {payslip.createdAt?.toDate ? format(payslip.createdAt.toDate(), 'PPP') : 'Pending'}</span>
          </div>

          {/* Authorization signature area */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100 text-center">
            <div>
              <div className="border-b border-slate-300 h-8 max-w-[200px] mx-auto"></div>
              <p className="text-[9px] font-black uppercase text-slate-400 mt-2">Employee Signature</p>
            </div>
            <div>
              <div className="border-b border-slate-300 h-8 max-w-[200px] mx-auto"></div>
              <p className="text-[9px] font-black uppercase text-slate-400 mt-2">Authorizing Officer</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-100 print:hidden">
        <Button onClick={handlePrint} className="bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-xl h-10 px-5 shadow-sm border-0">
          <Printer className="mr-2 h-4 w-4"/> Print Payslip
        </Button>
      </div>
       <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #payslip-content, #payslip-content * {
            visibility: visible !important;
          }
          #payslip-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            border: none !important;
          }
        }
      `}</style>
    </DialogContent>
  );
}
