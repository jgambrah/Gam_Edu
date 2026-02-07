'use client';

import { AppLogo } from '@/components/icons/app-logo';
import { format } from 'date-fns';
import { FinancialRecord, Student, PaymentTransaction } from '@/lib/types';
import { formatStudentId } from '@/lib/student-utils';

interface PaymentReceiptProps {
  transaction: FinancialRecord;
  payment: PaymentTransaction;
  student: Student;
  schoolProfile: any; 
}

export function PaymentReceipt({ transaction, payment, student, schoolProfile }: PaymentReceiptProps) {
  const amountPaid = payment.amount || 0;
  const paymentDate = payment.paidAt?.toDate ? format(payment.paidAt.toDate(), 'PPP') : 'N/A';
  const balanceBefore = transaction.billedAmount - (transaction.amountPaid - payment.amount) - (transaction.waiverAmount || 0);
  const balanceAfter = balanceBefore - payment.amount;

  return (
    <div 
        className="bg-white text-black font-sans p-8 mx-auto"
        style={{ width: '148mm', minHeight: '210mm', position: 'relative' }}
    >
      <header className="flex items-center justify-between pb-4 border-b-2 border-black">
        <div className="flex items-center gap-4">
          {schoolProfile?.logoUrl ? (
            <img 
              src={schoolProfile.logoUrl} 
              alt="School Logo" 
              className="w-16 h-16 object-contain"
              crossOrigin="anonymous"
            />
          ) : (
            <AppLogo className="h-12 w-12 text-slate-800" />
          )}
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wide">{schoolProfile?.name || 'School Name'}</h1>
            <p className="text-[10px] text-gray-500">{schoolProfile?.address || 'School Address'}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold uppercase text-gray-400 tracking-wider">Receipt</h2>
          <p className="text-[10px] font-mono text-gray-500 mt-1">
            #{payment.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
      </header>
      
      <section className="grid grid-cols-2 gap-8 my-6 text-xs">
        <div>
          <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-1">Billed To</h3>
          <p className="font-bold text-sm">{student?.firstName} {student?.lastName}</p>
          <p className="text-gray-600 font-mono">{student ? formatStudentId(student) : ''}</p>
        </div>
        <div className="text-right">
          <h3 className="text-[10px] uppercase font-bold text-gray-500 mb-1">Payment Details</h3>
          <p><span className="font-semibold">Payment Date:</span> {paymentDate}</p>
          <p><span className="font-semibold">Payment Method:</span> {payment.method}</p>
          {payment.notes && <p><span className="font-semibold">Ref:</span> {payment.notes}</p>}
        </div>
      </section>

      <section>
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr className="border-b border-t border-gray-200">
              <th className="text-left p-2 font-bold uppercase text-gray-600">Description</th>
              <th className="text-right p-2 font-bold uppercase text-gray-600">Amount Paid</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="p-2">
                <p className="font-medium">{transaction.description}</p>
                <p className="text-[10px] text-gray-500">Payment towards fee: {transaction.type}</p>
              </td>
              <td className="text-right p-2 font-mono">GH₵ {amountPaid.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </section>
      
      <section className="flex justify-end mt-6">
        <div className="w-1/2 text-xs">
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Balance Before Payment</span>
            <span className="font-mono">GH₵ {balanceBefore.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="font-medium">Amount Paid</span>
            <span className="font-mono text-green-600">- GH₵ {amountPaid.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-3 bg-gray-100 px-2 rounded-b-lg text-sm">
            <span className="font-bold">New Balance Outstanding</span>
            <span className="font-bold">GH₵ {balanceAfter.toFixed(2)}</span>
          </div>
        </div>
      </section>

      <footer className="absolute bottom-6 left-6 right-6 text-xs">
        <div className="text-center mb-6">
            <h3 className="text-sm font-bold text-gray-700">Thank You!</h3>
        </div>
        <div className="flex justify-between items-end pt-8">
            <div className="text-center w-1/3">
                <div className="border-b-2 border-dashed border-gray-300 mb-1 w-4/5 mx-auto"></div>
                <p className="text-[10px] font-bold uppercase">Bursar's Signature</p>
            </div>
             <div className="w-1/3 text-right">
                <p className="text-[10px] text-gray-400">Generated by GAM Edu</p>
             </div>
        </div>
      </footer>
    </div>
  );
}
