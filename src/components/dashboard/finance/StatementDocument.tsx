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
      className="bg-white text-black font-sans flex flex-col relative overflow-hidden"
      style={{ 
          width: '210mm', 
          minHeight: '297mm',
          position: 'relative' 
      }}
    >
      {/* Decorative top border */}
      <div className="h-2 w-full bg-gradient-to-r from-amber-500 via-indigo-650 to-emerald-500" />

      {/* Official background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.025] z-0">
          <span className="text-8xl font-black uppercase tracking-[0.25em] rotate-[25deg] select-none text-slate-800">
              OFFICIAL STATEMENT
          </span>
      </div>

      {/* Header: High Impact Institutional Branding */}
      <header 
        className="flex items-center justify-between px-10 py-10 mb-8 rounded-b-[2.5rem] shadow-md relative z-10"
        style={{ backgroundColor: primaryTheme, color: '#ffffff' }}
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-white rounded-2xl p-2.5 flex items-center justify-center shadow-lg border border-white/20">
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
            <h1 className="text-2xl font-black uppercase tracking-tight leading-none mb-1 text-white">
              {schoolProfile?.name || 'School Name'}
            </h1>
            
            <div className="mt-1.5 space-y-0.5 opacity-90 text-white/80">
                {schoolProfile?.motto && (
                    <p className="text-[10px] italic font-medium">"{schoolProfile.motto}"</p>
                )}
                {schoolProfile?.address && (
                    <p className="text-[9px] font-bold uppercase tracking-wider">{schoolProfile.address}</p>
                )}
                {(schoolProfile?.phone || schoolProfile?.email) && (
                    <p className="text-[9px] font-bold uppercase tracking-wider">
                        {schoolProfile?.phone || ""} {schoolProfile?.phone && schoolProfile?.email ? " • " : ""} {schoolProfile?.email || ""}
                    </p>
                )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-black uppercase tracking-widest opacity-25 text-white">Statement</h2>
          <p className="text-[9px] font-mono font-black mt-1 opacity-60 text-white/80 uppercase">
            Run Date: {format(new Date(), 'PPP')}
          </p>
        </div>
      </header>
      
      <div className="px-10 flex-1 relative z-10">
        {/* Billed To & Details */}
        <section className="grid grid-cols-2 gap-8 my-8 text-sm bg-slate-50/50 p-6 rounded-3xl border border-slate-100/80">
          <div>
            <h3 className="text-[9px] uppercase font-black text-slate-400 mb-1.5 tracking-widest">Account Holder</h3>
            <p className="font-black text-lg text-slate-800 uppercase">{student?.firstName} {student?.lastName}</p>
            <p className="text-slate-500 font-mono font-bold text-xs mt-0.5">{student ? formatStudentId(student) : ''}</p>
          </div>
          <div className="text-right">
            <h3 className="text-[9px] uppercase font-black text-slate-400 mb-1.5 tracking-widest">Billing Period</h3>
            <p className="font-bold text-slate-700 text-sm">{dateRange?.from ? format(dateRange.from, 'PPP') : 'Opening of Ledger'} - {dateRange?.to ? format(dateRange.to, 'PPP') : 'Today'}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Verified Balance Statement</p>
          </div>
        </section>

        {/* Line Items Table */}
        <section className="mt-8">
            <h3 
                className="text-[10px] font-black uppercase tracking-[0.25em] mb-4 pb-1 border-b-2"
                style={{ color: primaryTheme, borderBottomColor: secondaryTheme }}
            >
                Ledger Transaction Entries
            </h3>
            <table className="w-full text-xs border-collapse rounded-2xl overflow-hidden shadow-sm" style={{ border: `1px solid ${secondaryTheme}20` }}>
                <thead>
                    <tr className="text-white" style={{ backgroundColor: secondaryTheme }}>
                        <th className="text-left p-4 font-black uppercase text-[9px] tracking-widest">Posting Date & Description</th>
                        <th className="text-right p-4 font-black uppercase text-[9px] tracking-widest">Charges (Debits)</th>
                        <th className="text-right p-4 font-black uppercase text-[9px] tracking-widest">Receipts (Credits)</th>
                        <th className="text-right p-4 font-black uppercase text-[9px] tracking-widest bg-black/10">Running Balance</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-slate-50/70 border-b border-dashed" style={{ borderBottomColor: `${secondaryTheme}20` }}>
                        <td colSpan={3} className="p-4 font-black text-slate-450 uppercase tracking-widest text-[8px] pl-6">Opening Balance brought forward</td>
                        <td className="text-right p-4 font-black text-xs font-mono">GH₵ {balanceBroughtForward.toFixed(2)}</td>
                    </tr>
                    {records.map((rec, i) => {
                        const debit = rec.billedAmount;
                        const credit = (rec.amountPaid || 0) + (rec.waiverAmount || 0);
                        runningBalance += (debit - credit);
                        return (
                            <tr key={rec.id} className={cn("border-b hover:bg-slate-50/30 transition-colors", i % 2 === 0 ? "bg-white" : "bg-slate-50/20")} style={{ borderBottomColor: `${secondaryTheme}10` }}>
                                <td className="p-4 border-r pl-6" style={{ borderRightColor: `${secondaryTheme}10` }}>
                                    <p className="font-bold text-slate-800 text-xs">{rec.description}</p>
                                    <p className="text-[8px] text-indigo-500 font-black uppercase tracking-wider mt-1">{rec.type || 'Charges'} • {format(rec.createdAt.toDate(), 'dd MMM yyyy')}</p>
                                </td>
                                <td className="text-right p-4 font-bold text-slate-700 border-r font-mono" style={{ borderRightColor: `${secondaryTheme}10` }}>{debit > 0 ? `GH₵ ${debit.toFixed(2)}` : '—'}</td>
                                <td className="text-right p-4 font-bold text-emerald-600 border-r font-mono" style={{ borderRightColor: `${secondaryTheme}10` }}>{credit > 0 ? `GH₵ ${credit.toFixed(2)}` : '—'}</td>
                                <td className="text-right p-4 font-black text-slate-800 font-mono" style={{ color: primaryTheme }}>GH₵ {runningBalance.toFixed(2)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </section>
        
        {/* Summary Totals */}
        <section className="flex justify-end mt-10">
            <div className="w-1/2 space-y-2.5">
                <div className="flex justify-between py-1.5 border-b border-dashed text-[9px] font-black uppercase text-slate-400 tracking-widest pl-2">
                    <span>Charges this Period</span>
                    <span className="text-slate-700 font-mono font-bold">GH₵ {periodSummary.totalBilled.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-dashed text-[9px] font-black uppercase text-slate-400 tracking-widest pl-2">
                    <span>Payments / Waivers this Period</span>
                    <span className="text-emerald-600 font-mono font-bold">GH₵ {periodSummary.totalPaid.toFixed(2)}</span>
                </div>
                <div 
                    className="flex justify-between items-center py-5 px-6 rounded-2xl shadow-xl text-white mt-4 border border-black/10"
                    style={{ backgroundColor: primaryTheme }}
                >
                    <span className="font-black uppercase tracking-wide text-xs">Statement Outstanding Balance</span>
                    <span className="font-black text-xl font-mono">GH₵ {summary.balance.toFixed(2)}</span>
                </div>
                <p className="text-[8px] text-slate-400 font-black tracking-widest text-right pt-2 uppercase">
                    * Authenticated Academic Ledger Transcript
                </p>
            </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="px-10 pb-10 mt-auto relative z-10">
        <div className="flex justify-between items-end">
            <div className="text-center w-1/3 space-y-2">
                {/* Official Stamp */}
                <div className="relative flex items-center justify-center w-20 h-20 mx-auto opacity-75">
                    <svg className="w-full h-full text-indigo-600/60" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.75" />
                        <path id="sealTextPath" d="M 17 50 A 33 33 0 1 1 83 50" fill="none" />
                        <text className="fill-current text-[6px] font-black tracking-widest uppercase">
                            <textPath href="#sealTextPath" startOffset="50%" textAnchor="middle">
                                GAM EDU AUDITED LEDGER
                            </textPath>
                        </text>
                        <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeWidth="0.75" />
                        <text x="50" y="53" className="fill-current text-[8px] font-black" textAnchor="middle">
                            OFFICIAL
                        </text>
                        <text x="50" y="61" className="fill-current text-[6px] font-bold" textAnchor="middle">
                            SEAL
                        </text>
                    </svg>
                </div>
                <div className="border-b-2 border-dashed border-slate-300 w-full"></div>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Bursar's Verified Seal</p>
            </div>
             <div className="text-right opacity-30">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">GAM-EDU Cloud Ledger System</p>
             </div>
        </div>
      </footer>
    </div>
  );
}
