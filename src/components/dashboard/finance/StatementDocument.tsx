
'use client';

import { AppLogo } from '@/components/icons/app-logo';
import { format } from 'date-fns';
import { FinancialRecord, Student } from '@/lib/types';
import { formatStudentId } from '@/lib/student-utils';
import { DateRange } from 'react-day-picker';

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
  let runningBalance = 0;

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
      <header className="flex items-center justify-between pb-4 border-b-2 border-black">
        <div className="flex items-center gap-4">
          {schoolProfile?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
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
            <h1 className="text-2xl font-bold uppercase tracking-wide">{schoolProfile?.name || 'School Name'}</h1>
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
            <tr className="border-b border-t border-gray-200">
              <th className="text-left p-3 font-bold uppercase text-gray-600 w-1/2">Date & Description</th>
              <th className="text-right p-3 font-bold uppercase text-gray-600">Charges</th>
              <th className="text-right p-3 font-bold uppercase text-gray-600">Payments</th>
              <th className="text-right p-3 font-bold uppercase text-gray-600">Balance</th>
            </tr>
          </thead>
          <tbody>
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
                  <td className="text-right p-3 font-mono">GH₵{runningBalance.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
      
      {/* Totals */}
      <section className="flex justify-end mt-8">
        <div className="w-1/2">
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Total Charges</span>
            <span className="font-mono">GH₵ {summary.totalBilled.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Total Payments</span>
            <span className="font-mono text-green-600">GH₵ {summary.totalPaid.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-4 bg-gray-100 px-4 rounded-b-lg text-lg">
            <span className="font-bold">Balance Due</span>
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
