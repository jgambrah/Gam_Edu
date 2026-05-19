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
  totalBalance?: number; 
  isThermal?: boolean; 
}

export function PaymentReceipt({
  transaction,
  payment,
  student,
  schoolProfile,
  totalBalance = 0,
  isThermal = false,
}: PaymentReceiptProps) {
  const amountPaid = payment.amount || 0;
  const paymentDate = payment.paidAt?.toDate ? format(payment.paidAt.toDate(), 'PPP') : 'N/A';
  
  const primaryTheme = schoolProfile?.brandColor || '#1e293b';
  const secondaryTheme = schoolProfile?.secondaryColor || primaryTheme;

  if (isThermal) {
    return (
      <div className="bg-white text-black font-mono p-2" style={{ width: '80mm', fontSize: '12px' }}>
        <div className="text-center mb-2">
          {schoolProfile?.logoBase64 && (
             <img 
                src={schoolProfile.logoBase64} 
                alt="" 
                className="w-12 h-12 mx-auto mb-1 object-contain"
             />
          )}
          <h1 className="text-lg font-bold uppercase" style={{ color: primaryTheme }}>{schoolProfile?.name}</h1>
          
          <div className="text-center mt-1 space-y-0.5">
              {schoolProfile?.motto && (
                  <p className="text-[10px] italic font-medium opacity-90">"{schoolProfile.motto}"</p>
              )}
              {schoolProfile?.address && (
                  <p className="text-[9px] font-medium">{schoolProfile.address}</p>
              )}
              {(schoolProfile?.phone || schoolProfile?.email) && (
                  <p className="text-[9px] font-medium">
                      {schoolProfile?.phone || ""} {schoolProfile?.phone && schoolProfile?.email ? " | " : ""} {schoolProfile?.email || ""}
                  </p>
              )}
          </div>

          <div className="border-b border-black border-dashed my-2"></div>
          <h2 className="text-sm font-bold tracking-widest">OFFICIAL RECEIPT</h2>
          <p className="text-[10px] font-bold">#{payment.id}</p>
          <div className="border-b border-black border-dashed my-2"></div>
        </div>
        <div className="space-y-1 mb-3">
          <div className="flex justify-between"><span>Date:</span> <span>{payment.paidAt?.toDate ? format(payment.paidAt.toDate(), 'dd/MM/yy HH:mm') : 'N/A'}</span></div>
          <div className="flex justify-between font-bold"><span>Student:</span> <span>{student?.firstName}</span></div>
        </div>
        <div className="flex justify-between items-center py-1 border-t border-dashed border-black">
          <span className="font-bold">TOTAL PAID:</span>
          <span className="text-xl font-bold">GH₵{amountPaid.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="font-bold">OVERALL BAL:</span>
          <span className="font-bold" style={{ color: primaryTheme }}>GH₵{totalBalance.toFixed(2)}</span>
        </div>
      </div>
    );
  }

  // A4 Layout
  const balanceBefore = transaction.billedAmount - (transaction.amountPaid - payment.amount) - (transaction.waiverAmount || 0);

  return (
    <div 
        className="bg-white text-black font-sans flex flex-col"
        style={{ width: '148mm', minHeight: '210mm', position: 'relative' }}
    >
      <header 
        className="flex items-center justify-between px-8 py-8 mb-6"
        style={{ backgroundColor: primaryTheme, color: '#ffffff' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-xl p-2 flex items-center justify-center">
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
            <h1 className="text-lg font-black uppercase tracking-tight leading-none text-white">
              {schoolProfile?.name || 'School Name'}
            </h1>
            
            <div className="mt-1 space-y-0.5">
                {schoolProfile?.motto && (
                    <p className="text-[10px] italic font-medium opacity-90">"{schoolProfile.motto}"</p>
                )}
                {schoolProfile?.address && (
                    <p className="text-[9px] font-medium">{schoolProfile.address}</p>
                )}
                {(schoolProfile?.phone || schoolProfile?.email) && (
                    <p className="text-[9px] font-medium">
                        {schoolProfile?.phone || ""} {schoolProfile?.phone && schoolProfile?.email ? " | " : ""} {schoolProfile?.email || ""}
                    </p>
                )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-black uppercase tracking-widest opacity-40">Receipt</h2>
          <p className="text-[9px] font-mono font-bold mt-1 uppercase opacity-60">
            #{payment.id}
          </p>
        </div>
      </header>
      
      <div className="px-8 pb-8 flex-1">
        <section className="grid grid-cols-2 gap-8 my-6 text-xs">
          <div>
            <h3 className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest">Billed To</h3>
            <p className="font-black text-sm uppercase">{student?.firstName} {student?.lastName}</p>
            <p className="text-slate-500 font-mono font-bold">{student ? formatStudentId(student) : ''}</p>
          </div>
          <div className="text-right">
            <h3 className="text-[10px] uppercase font-black text-slate-400 mb-1 tracking-widest">Payment Details</h3>
            <p className="font-bold text-slate-600"><span className="opacity-50">Date:</span> {paymentDate}</p>
            <p className="font-bold text-slate-600"><span className="opacity-50">Method:</span> {payment.method}</p>
            {payment.notes && <p className="font-bold text-slate-600"><span className="opacity-50">Ref:</span> {payment.notes}</p>}
          </div>
        </section>

        <section className="mt-8">
            <h3 
                className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 pb-1 border-b-2"
                style={{ color: primaryTheme, borderBottomColor: secondaryTheme }}
            >
                Financial Breakdown
            </h3>
            <table className="w-full text-xs border-2 rounded-xl overflow-hidden" style={{ borderColor: secondaryTheme }}>
                <thead style={{ backgroundColor: secondaryTheme, color: 'white' }}>
                    <tr className="border-b" style={{ borderBottomColor: secondaryTheme }}>
                        <th className="text-left p-3 font-black uppercase tracking-widest">Description</th>
                        <th className="text-right p-3 font-black uppercase tracking-widest">Amount Paid</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white">
                        <td className="p-3 border-r" style={{ borderRightColor: `${secondaryTheme}20` }}>
                            <p className="font-bold text-slate-800">{transaction.description}</p>
                            <p className="text-[9px] text-slate-400 font-black uppercase mt-0.5">FEE TYPE: {transaction.type}</p>
                        </td>
                        <td className="text-right p-3 font-black text-sm" style={{ color: primaryTheme }}>
                            GH₵ {amountPaid.toFixed(2)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
        
        <section className="flex justify-end mt-8">
            <div className="w-2/3 space-y-2">
                <div 
                    className="flex justify-between items-center py-4 px-5 text-white rounded-2xl shadow-xl"
                    style={{ backgroundColor: primaryTheme }}
                >
                    <span className="font-black uppercase tracking-tighter text-xs">Total Outstanding Ledger</span>
                    <span className="font-black text-lg font-mono">GH₵ {totalBalance.toFixed(2)}</span>
                </div>
                
                <p className="text-[8px] text-slate-400 font-bold italic text-right pt-2 uppercase">
                    * Final balance includes all pending school fees.
                </p>
            </div>
        </section>
      </div>

      <footer className="px-8 pb-8 text-xs mt-auto">
        <div className="flex justify-between items-end">
            <div className="text-center w-1/3">
                <div className="border-b-2 border-dashed border-slate-300 mb-1 w-full"></div>
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Bursar's Signature</p>
            </div>
             <div className="text-right opacity-30">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">GAM-EDU SECURE RECEIPT</p>
             </div>
        </div>
      </footer>
    </div>
  );
}