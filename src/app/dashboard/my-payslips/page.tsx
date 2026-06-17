'use client';

import { useState, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { query, collection, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, FileText, Sparkles, Landmark, Coins, Eye } from 'lucide-react';
import { PayrollRecord } from '@/lib/types';
import { PayslipDialog } from '../payroll/payslip-dialog';
import { useCurrentSchool } from '@/hooks/use-current-school';

export default function MyPayslipsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const payslipsQuery = useMemoFirebase(
    () => (user && schoolId && firestore) ? query(
        collection(firestore, 'payrollRecords'), 
        where('schoolId', '==', schoolId),
        where('staffId', '==', user.uid), 
        orderBy('period', 'desc')
    ) : null,
    [firestore, user, schoolId]
  );
  const { data: payslips, isLoading: isLoadingPayslips } = useCollection<PayrollRecord>(payslipsQuery);

  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);

  const isLoading = isLoadingSchool || isLoadingPayslips;

  const stats = useMemo(() => {
    if (!payslips || payslips.length === 0) return { totalSlips: 0, latestPeriod: 'N/A', ytdNet: 0 };
    const totalSlips = payslips.length;
    const latestPeriod = payslips[0].period || 'N/A';
    const ytdNet = payslips.reduce((sum, item) => sum + (item.netSalary || 0), 0);
    return { totalSlips, latestPeriod, ytdNet };
  }, [payslips]);

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen">
      {/* Executive Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase flex items-center gap-2.5">
            <FileText className="h-8 w-8 text-indigo-600" /> My Payslips
          </h1>
          <p className="text-muted-foreground font-medium italic">View, print, and audit your monthly salary distributions.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>
      ) : payslips && payslips.length > 0 ? (
        <div className="space-y-6">
          {/* Quick Staff Payout Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Accumulated Net Earnings</p>
                  <p className="text-xl font-black font-mono text-emerald-600">GH₵{stats.ytdNet.toFixed(2)}</p>
                </div>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Coins className="h-5 w-5" /></div>
              </CardContent>
            </Card>

            <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Latest Pay Period</p>
                  <p className="text-xl font-black font-mono text-indigo-700">{stats.latestPeriod}</p>
                </div>
                <div className="p-2 bg-indigo-50 text-indigo-650 rounded-xl"><Sparkles className="h-5 w-5" /></div>
              </CardContent>
            </Card>

            <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Payslips</p>
                  <p className="text-xl font-black font-mono text-slate-800">{stats.totalSlips} records</p>
                </div>
                <div className="p-2 bg-slate-50 text-slate-500 rounded-xl"><Landmark className="h-5 w-5" /></div>
              </CardContent>
            </Card>
          </div>

          <Card className="border border-slate-100 shadow-lg rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-5">
              <CardTitle className="text-sm font-bold text-slate-850">Historical Payout Records</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="pl-6 font-bold text-xs">Pay Period</TableHead>
                    <TableHead className="font-bold text-xs">Gross Salary</TableHead>
                    <TableHead className="font-bold text-xs">Net Take-Home</TableHead>
                    <TableHead className="text-right pr-6 font-bold text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payslips.map((slip) => (
                    <TableRow key={slip.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="py-4 pl-6 font-bold text-slate-800 text-sm">{slip.period}</TableCell>
                      <TableCell className="font-mono text-slate-500 font-medium">GH₵{slip.grossSalary.toFixed(2)}</TableCell>
                      <TableCell className="font-mono font-black text-indigo-750">GH₵{slip.netSalary.toFixed(2)}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedPayslip(slip)} className="rounded-xl hover:bg-slate-100 hover:text-indigo-700 font-semibold text-xs h-9">
                              <Eye className="h-4 w-4 mr-1.5" /> View Payslip
                            </Button>
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
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="border border-dashed border-slate-350 bg-white rounded-3xl p-16 text-center max-w-lg mx-auto shadow-sm">
          <FileText className="mx-auto h-14 w-14 text-slate-200 mb-4 stroke-1" />
          <h3 className="text-lg font-black text-slate-700">No Payslips Found</h3>
          <p className="text-slate-400 text-sm mt-1">You do not have any historical processed payslip records in this school.</p>
        </Card>
      )}
    </div>
  );
}
