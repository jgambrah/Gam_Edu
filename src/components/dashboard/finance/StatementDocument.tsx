'use client';

import { AppLogo } from '@/components/icons/app-logo';
import { format } from 'date-fns';
import { FinancialRecord, Student } from '@/lib/types';
import { formatStudentId } from '@/lib/student-utils';
import { DateRange } from 'react-day-picker';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface StatementDocumentProps {
  student?: Student;
  records: FinancialRecord[];
  dateRange?: DateRange;
  summary: { 
    totalBilled: number;
    totalPaid: number;
    balance: number;
  };
  schoolProfile: any;
}

export function StatementDocument({ student, records, dateRange, summary, schoolProfile }: StatementDocumentProps) {
  
  const primaryTheme = schoolProfile?.brandColor || '#1e293b';
  const secondaryTheme = schoolProfile?.secondaryColor || primaryTheme;

  // Calculate summary for the PERIOD being displayed
  const periodSummary = useMemo(() => {
    if (!records) return { totalBilled: 0, totalPaid: 0 };
    const totalBilled = records.reduce((acc, r) => acc + r.billedAmount, 0);
    const totalPaid = records.reduce((acc, r) => acc + (r.amountPaid || 0) + (r.waiverAmount || 0), 0);
    return { totalBilled, totalPaid };
  }, [records]);
  
  // Running balance calculation needs to account for the starting balance of the period
  const balanceBroughtForward = useMemo(() => {
    const periodNetChange = periodSummary.totalBilled - periodSummary.totalPaid;
    return summary.balance - periodNetChange;
  }, [summary, periodSummary]);


  let runningBalance = balanceBroughtForward;

  return (
    <div 
      className="bg-white text-black font-sans flex flex-col"
      style={{ 
          width: '210mm', 
          minHeight: '297mm',
          position: 'relative' 
      }}
    >
      {/* Header: High Impact Institutional Branding */}
      <header 
        className="flex items-center justify-between px-10 py-10 mb-8 rounded-b-[3rem] shadow-lg"
        style={{ backgroundColor: primaryTheme, color: '#ffffff' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-2xl p-2 flex items-center justify-center shadow-inner">
            {schoolProfile?.logoBase64 ? (
              <img 
                src={schoolProfile.logoBase64} 
                alt="School Logo" 
                className="w-full h-full object-contain"
              />
            ) : (
              <AppLogo className="w-full h-full text-slate-800" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight leading-none mb-1">
              {schoolProfile?.name || 'School Name'}
            </h1>
            <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">{schoolProfile?.address || 'School Address'}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-4xl font-black uppercase tracking-widest opacity-20">Statement</h2>
          <p className="text-[10px] font-mono font-bold mt-1 opacity-60">
            GENERATED: {format(new Date(), 'PPP')}
          </p>
        </div>
      </header>
      
      <div className="px-10 flex-1">
        {/* Billed To & Details */}
        <section className="grid grid-cols-2 gap-8 my-8 text-sm">
          <div>
            <h3 className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">Statement Prepared For</h3>
            <p className="font-black text-xl text-slate-900 uppercase">{student?.firstName} {student?.lastName}</p>
            <p className="text-slate-500 font-mono font-bold text-xs">{student ? formatStudentId(student) : ''}</p>
          </div>
          <div className="text-right">
            <h3 className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">Accounting Period</h3>
            <p className="font-bold text-slate-600">{dateRange?.from ? format(dateRange.from, 'PPP') : 'Start of Records'} - {dateRange?.to ? format(dateRange.to, 'PPP') : 'Today'}</p>
          </div>
        </section>

        {/* Line Items Table */}
        <section className="mt-8">
            <h3 
                className="text-[11px] font-black uppercase tracking-[0.3em] mb-4 pb-1 border-b-4"
                style={{ color: primaryTheme, borderBottomColor: secondaryTheme }}
            >
                Transaction History
            </h3>
            <table className="w-full text-xs border-collapse rounded-xl overflow-hidden shadow-sm" style={{ border: `2px solid ${secondaryTheme}` }}>
                <thead>
                    <tr style={{ backgroundColor: secondaryTheme, color: '#ffffff' }}>
                        <th className="text-left p-4 font-black uppercase text-[10px] tracking-widest">Date & Description</th>
                        <th className="text-right p-4 font-black uppercase text-[10px] tracking-widest">Charges</th>
                        <th className="text-right p-4 font-black uppercase text-[10px] tracking-widest">Payments</th>
                        <th className="text-right p-4 font-black uppercase text-[10px] tracking-widest bg-black/10">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-slate-50 border-b" style={{ borderBottomColor: `${secondaryTheme}20` }}>
                        <td colSpan={3} className="p-4 font-black text-slate-400 uppercase tracking-widest text-[9px]">Balance Brought Forward</td>
                        <td className="text-right p-4 font-black text-sm">GH₵ {balanceBroughtForward.toFixed(2)}</td>
                    </tr>
                    {records.map((rec, i) => {
                        const debit = rec.billedAmount;
                        const credit = (rec.amountPaid || 0) + (rec.waiverAmount || 0);
                        runningBalance += (debit - credit);
                        return (
                            <tr key={rec.id} className={cn("border-b", i % 2 === 0 ? "bg-white" : "bg-slate-50/50")} style={{ borderBottomColor: `${secondaryTheme}10` }}>
                                <td className="p-4 border-r" style={{ borderRightColor: `${secondaryTheme}10` }}>
                                    <p className="font-bold text-slate-800">{rec.description}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{format(rec.createdAt.toDate(), 'dd MMM yyyy')}</p>
                                </td>
                                <td className="text-right p-4 font-bold text-slate-600 border-r" style={{ borderRightColor: `${secondaryTheme}10` }}>{debit > 0 ? `GH₵ ${debit.toFixed(2)}` : '-'}</td>
                                <td className="text-right p-4 font-bold text-emerald-600 border-r" style={{ borderRightColor: `${secondaryTheme}10` }}>{credit > 0 ? `GH₵ ${credit.toFixed(2)}` : '-'}</td>
                                <td className="text-right p-4 font-black text-sm" style={{ color: primaryTheme }}>GH₵ {runningBalance.toFixed(2)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </section>
        
        {/* Summary Totals */}
        <section className="flex justify-end mt-10">
            <div className="w-1/2 space-y-2">
                <div className="flex justify-between py-2 border-b text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <span>Charges this Period</span>
                    <span className="text-slate-900 font-mono">GH₵ {periodSummary.totalBilled.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <span>Payments this Period</span>
                    <span className="text-emerald-600 font-mono">GH₵ {periodSummary.totalPaid.toFixed(2)}</span>
                </div>
                <div 
                    className="flex justify-between items-center py-6 px-6 rounded-2xl shadow-2xl text-white mt-4"
                    style={{ backgroundColor: primaryTheme }}
                >
                    <span className="font-black uppercase tracking-tighter text-sm">Statement Balance</span>
                    <span className="font-black text-2xl font-mono">GH₵ {summary.balance.toFixed(2)}</span>
                </div>
                <p className="text-[9px] text-slate-400 font-bold italic text-right pt-2 uppercase">
                    * Verified Institutional Transcript of Accounts
                </p>
            </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="px-10 pb-12 mt-auto">
        <div className="flex justify-between items-end">
            <div className="text-center w-1/3">
                <div className="border-b-2 border-dashed border-slate-300 mb-2 w-full"></div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Bursar's Verified Seal</p>
            </div>
             <div className="text-right opacity-20">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">GAM-EDU Cloud Ledger System</p>
             </div>
        </div>
      </footer>
    </div>
  );
}