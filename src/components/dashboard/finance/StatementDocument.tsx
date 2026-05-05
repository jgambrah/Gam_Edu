'use client';

import { AppLogo } from '@/components/icons/app-logo';
import { format } from 'date-fns';
import { FinancialRecord, Student } from '@/lib/types';
import { formatStudentId } from '@/lib/student-utils';
import { DateRange } from 'react-day-picker';
import { useMemo } from 'react';

interface StatementDocumentProps {
  student?: Student;
  records: FinancialRecord[];
  dateRange?: DateRange;
  summary: { // This is now the OVERALL summary
    totalBilled: number;
    totalPaid: number;
    balance: number;
  };
  schoolProfile: any;
}

export function StatementDocument({ student, records, dateRange, summary, schoolProfile }: StatementDocumentProps) {
  
  const themeColor = schoolProfile?.brandColor || '#1e293b';

  // Calculate summary for the PERIOD being displayed
  const periodSummary = useMemo(() => {
    if (!records) return { totalBilled: 0, totalPaid: 0 };
    const totalBilled = records.reduce((acc, r) => acc + r.billedAmount, 0);
    const totalPaid = records.reduce((acc, r) => acc + (r.amountPaid || 0) + (r.waiverAmount || 0), 0);
    return { totalBilled, totalPaid };
  }, [records]);
  
  // Running balance calculation needs to account for the starting balance of the period
  const balanceBroughtForward = useMemo(() => {
    // The overall balance minus the net change of the filtered period gives us the starting balance.
    const periodNetChange = periodSummary.totalBilled - periodSummary.totalPaid;
    return summary.balance - periodNetChange;
  }, [summary, periodSummary]);


  let runningBalance = balanceBroughtForward;

  return (
    <div 
      className="bg-white text-black font-sans p-8 mx-auto"
      style={{ 
          width: '210mm', 
          minHeight: '297mm',
          position: 'relative' 
      }}
    >
      {/* Header */}
      <header 
        className="flex items-center justify-between pb-4 border-b-2"
        style={{ borderBottomColor: themeColor }}
      >
        <div className="flex items-center gap-4">
          {schoolProfile?.logoBase64 ? (
            <img 
              src={schoolProfile.logoBase64} 
              alt="School Logo" 
              className="w-20 h-20 object-contain"
            />
          ) : schoolProfile?.logoUrl ? (
            <img 
              src={schoolProfile.logoUrl} 
              alt="School Logo" 
              className="w-20 h-20 object-contain"
              crossOrigin="anonymous"
            />
          ) : (
            <AppLogo className="h-16 w-16 text-slate-800" />
          )}
          <div>
            <h1 
              className="text-2xl font-bold uppercase tracking-wide"
              style={{ color: themeColor }}
            >
              {schoolProfile?.name || 'School Name'}
            </h1>
            <p className="text-xs text-gray-500">{schoolProfile?.address || 'School Address'}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold uppercase text-gray-400 tracking-wider">Statement</h2>
          <p className="text-xs font-mono text-gray-500 mt-1">
            {format(new Date(), 'PPP')}
          </p>
        </div>
      </header>
      
      {/* Billed To & Details */}
      <section className="grid grid-cols-2 gap-8 my-8 text-sm">
        <div>
          <h3 className="text-xs uppercase font-bold text-gray-500 mb-2">Statement For</h3>
          <p className="font-bold text-base">{student?.firstName} {student?.lastName}</p>
          <p className="text-gray-600 font-mono">{student ? formatStudentId(student) : ''}</p>
        </div>
        <div className="text-right">
          <h3 className="text-xs uppercase font-bold text-gray-500 mb-2">Statement Period</h3>
          <p>{dateRange?.from ? format(dateRange.from, 'PPP') : 'Start of Records'} - {dateRange?.to ? format(dateRange.to, 'PPP') : 'Today'}</p>
        </div>
      </section>

      {/* Line Items Table */}
      <section>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="border-b border-t border-gray-200" style={{ backgroundColor: themeColor, color: '#ffffff' }}>
              <th className="text-left p-3 font-bold uppercase text-[10px] w-1/2">Date & Description</th>
              <th className="text-right p-3 font-bold uppercase text-[10px]">Charges</th>
              <th className="text-right p-3 font-bold uppercase text-[10px]">Payments</th>
              <th className="text-right p-3 font-bold uppercase text-[10px]">Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 bg-slate-50">
                <td colSpan={3} className="p-3 font-bold">Balance Brought Forward</td>
                <td className="text-right p-3 font-mono font-bold">GH₵{balanceBroughtForward.toFixed(2)}</td>
            </tr>
            {records.map(rec => {
              const debit = rec.billedAmount;
              const credit = (rec.amountPaid || 0) + (rec.waiverAmount || 0);
              runningBalance += (debit - credit);
              return (
                <tr key={rec.id} className="border-b border-gray-200">
                  <td className="p-3">
                    <p className="font-medium">{rec.description}</p>
                    <p className="text-xs text-gray-500">{format(rec.createdAt.toDate(), 'PPP')}</p>
                  </td>
                  <td className="text-right p-3 font-mono">GH₵{debit > 0 ? debit.toFixed(2) : '-'}</td>
                  <td className="text-right p-3 font-mono text-green-600">GH₵{credit > 0 ? credit.toFixed(2) : '-'}</td>
                  <td className="text-right p-3 font-mono font-bold" style={{ color: themeColor }}>GH₵{runningBalance.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
      
      {/* Totals */}
      <section className="flex justify-end mt-8">
        <div className="w-1/2 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Charges this Period</span>
            <span className="font-mono">GH₵ {periodSummary.totalBilled.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Payments this Period</span>
            <span className="font-mono text-green-600">GH₵ {periodSummary.totalPaid.toFixed(2)}</span>
          </div>
          <div 
            className="flex justify-between py-4 px-4 rounded-b-lg text-lg text-white"
            style={{ backgroundColor: themeColor }}
          >
            <span className="font-bold">Total Outstanding Balance</span>
            <span className="font-bold">GH₵ {summary.balance.toFixed(2)}</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-8 left-8 right-8 text-sm">
        <div className="flex justify-between items-end pt-12">
            <div className="text-center w-1/3">
                <div className="border-b-2 border-dashed border-gray-300 mb-2 w-4/5 mx-auto"></div>
                <p className="text-xs font-bold uppercase">Bursar's Signature</p>
            </div>
             <div className="w-1/3 text-right">
                <p className="text-xs text-gray-400">Generated by GAM Edu</p>
             </div>
        </div>
      </footer>
    </div>
  );
}