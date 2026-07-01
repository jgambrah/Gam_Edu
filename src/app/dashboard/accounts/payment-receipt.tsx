'use client';

import { AppLogo } from '@/components/icons/app-logo';
import { format } from 'date-fns';
import { FinancialRecord, Student, PaymentTransaction } from '@/lib/types';
import { formatStudentId } from '@/lib/student-utils';
import { cn } from '@/lib/utils';

interface PaymentReceiptProps {
  transaction: FinancialRecord;
  payment: PaymentTransaction;
  student: Student;
  schoolProfile: any;
  totalBalance?: number; 
  isThermal?: boolean; 
  isPlainA5?: boolean;
}

export function PaymentReceipt({
  transaction,
  payment,
  student,
  schoolProfile,
  totalBalance = 0,
  isThermal = false,
  isPlainA5 = false,
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
        <div className="space-y-1 mb-3 text-[10px]">
          <div className="flex justify-between font-bold"><span>Date:</span> <span>{payment.paidAt?.toDate ? format(payment.paidAt.toDate(), 'dd/MM/yy HH:mm') : 'N/A'}</span></div>
          <div className="flex justify-between font-bold text-black"><span>Student:</span> <span>{student?.firstName} {student?.lastName}</span></div>
          <div className="flex justify-between font-bold"><span>ID:</span> <span className="font-mono font-bold">{student ? formatStudentId(student) : ''}</span></div>
          <div className="flex justify-between font-bold"><span>Method:</span> <span>{payment.method}</span></div>
          {payment.notes && <div className="flex justify-between font-bold"><span>Ref:</span> <span>{payment.notes}</span></div>}
        </div>
        <div className="border-t border-black border-dashed pt-2 mb-2 text-[10px]">
          <span className="font-black block text-[9px] uppercase tracking-wider mb-0.5 text-black">Narration</span>
          <div className="flex justify-between items-start gap-1 font-bold">
            <span className="text-black">{payment.description || transaction.description} ({transaction.type})</span>
            <span className="font-mono shrink-0">GH₵{amountPaid.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center py-1 border-t border-dashed border-black">
          <span className="font-bold">TOTAL PAID:</span>
          <span className="text-xl font-bold font-mono">GH₵{amountPaid.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="font-bold">OVERALL BAL:</span>
          <span className="font-bold font-mono" style={{ color: primaryTheme }}>GH₵{totalBalance.toFixed(2)}</span>
        </div>
      </div>
    );
  }

  // A5 Layout
  const balanceBefore = transaction.billedAmount - (transaction.amountPaid - payment.amount) - (transaction.waiverAmount || 0);

  return (
    <div 
        className="bg-white text-black font-sans flex flex-col relative overflow-hidden"
        style={{ width: '148mm', minHeight: '195mm', position: 'relative' }}
    >
      {/* Decorative top border */}
      {!isPlainA5 && <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-indigo-650 to-emerald-500" />}

      {/* Official background watermark */}
      {!isPlainA5 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.06] z-0">
            <span className="text-6xl font-black uppercase tracking-[0.2em] rotate-[25deg] select-none text-emerald-700">
                OFFICIAL RECEIPT PAID
            </span>
        </div>
      )}

      {/* Standard Colorful Banner Header */}
      {!isPlainA5 && (
        <header 
          className="flex items-center justify-between px-8 py-4 mb-3 relative z-10"
          style={{ backgroundColor: primaryTheme, color: '#ffffff' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-md border border-white/20">
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
              <h1 className="text-lg font-black uppercase tracking-tight leading-none text-white mb-0.5">
                {schoolProfile?.name || 'School Name'}
              </h1>
              
              <div className="mt-1 space-y-0.5 text-white font-semibold">
                  {schoolProfile?.motto && (
                      <p className="text-[9px] italic font-medium">"{schoolProfile.motto}"</p>
                  )}
                  {schoolProfile?.address && (
                      <p className="text-[8px] font-bold uppercase tracking-wider">{schoolProfile.address}</p>
                  )}
                  {(schoolProfile?.phone || schoolProfile?.email) && (
                      <p className="text-[8px] font-bold uppercase tracking-wider">
                          {schoolProfile?.phone || ""} {schoolProfile?.phone && schoolProfile?.email ? " • " : ""} {schoolProfile?.email || ""}
                      </p>
                  )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-black uppercase tracking-widest opacity-40 text-white">Receipt</h2>
            <p className="text-[8px] font-mono font-black mt-1 uppercase opacity-80 text-white">
              #{payment.id.slice(0, 16)}
            </p>
          </div>
        </header>
      )}

      {/* Alternative Minimalist B&W Text Header */}
      {isPlainA5 && (
        <header className="px-8 pt-4 pb-2 mb-2 border-b border-slate-300 relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {schoolProfile?.logoBase64 && (
              <img 
                src={schoolProfile.logoBase64} 
                alt="School Logo" 
                className="w-12 h-12 object-contain grayscale"
              />
            )}
            <div>
              <h1 className="text-base font-black uppercase tracking-tight text-slate-900 leading-none mb-1">
                {schoolProfile?.name || 'School Name'}
              </h1>
              <div className="space-y-0.5 text-slate-700 text-[8px] font-bold uppercase tracking-wider">
                {schoolProfile?.motto && <p className="italic text-slate-650">"{schoolProfile.motto}"</p>}
                {schoolProfile?.address && <p>{schoolProfile.address}</p>}
                {(schoolProfile?.phone || schoolProfile?.email) && (
                  <p>{schoolProfile?.phone} {schoolProfile?.phone && schoolProfile?.email ? " • " : ""} {schoolProfile?.email}</p>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-black uppercase tracking-wider text-slate-900">Official Receipt</h2>
            <p className="text-[8px] font-mono font-bold mt-1 text-slate-600">
              #{payment.id.slice(0, 16).toUpperCase()}
            </p>
          </div>
        </header>
      )}
      
      <div className="px-8 pb-8 flex-1 relative z-10">
        <section className="grid grid-cols-2 gap-8 my-3 text-xs bg-slate-100/40 p-3 rounded-xl border border-slate-200">
          <div>
            <h3 className="text-[8px] uppercase font-black text-slate-900 tracking-widest mb-1">Billed To</h3>
            <p className="font-black text-sm uppercase text-slate-800">{student?.firstName} {student?.lastName}</p>
            <p className="text-slate-900 font-mono font-black text-[10px] mt-0.5">{student ? formatStudentId(student) : ''}</p>
          </div>
          <div className="text-right">
            <h3 className="text-[8px] uppercase font-black text-slate-900 tracking-widest mb-1">Payment Details</h3>
            <p className="font-bold text-slate-700"><span className="font-extrabold text-slate-900">Date:</span> {paymentDate}</p>
            <p className="font-bold text-slate-700"><span className="font-extrabold text-slate-900">Method:</span> {payment.method}</p>
            {payment.notes && <p className="font-bold text-slate-700"><span className="font-extrabold text-slate-900">Ref:</span> {payment.notes}</p>}
          </div>
        </section>

        <section className="mt-4">
            <h3 
                className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 pb-1 border-b-2"
                style={isPlainA5 ? { borderColor: '#94a3b8', color: '#1e293b' } : { color: primaryTheme, borderBottomColor: secondaryTheme }}
            >
                Financial Breakdown
            </h3>
            <table className="w-full text-xs border rounded-xl overflow-hidden shadow-sm" style={isPlainA5 ? { borderColor: '#cbd5e1' } : { border: `1px solid ${secondaryTheme}40` }}>
                <thead style={isPlainA5 ? { backgroundColor: '#f1f5f9', color: '#1e293b' } : { backgroundColor: secondaryTheme, color: 'white' }}>
                    <tr className="border-b" style={isPlainA5 ? { borderBottomColor: '#cbd5e1' } : { borderBottomColor: `${secondaryTheme}30` }}>
                        <th className="text-left p-2 font-black uppercase tracking-widest text-[9px]">Description</th>
                        <th className="text-right p-2 font-black uppercase tracking-widest text-[9px]">Amount Paid</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white">
                        <td className="p-2 border-r" style={isPlainA5 ? { borderRightColor: '#cbd5e1' } : { borderRightColor: `${secondaryTheme}30` }}>
                            <p className="font-bold text-slate-800">{payment.description || transaction.description}</p>
                            <p className="text-[9px] text-slate-600 font-black uppercase mt-1">FEE TYPE: {transaction.type}</p>
                        </td>
                        <td className="text-right p-2 font-black text-slate-800 font-mono" style={isPlainA5 ? { color: '#0f172a' } : { color: primaryTheme }}>
                            GH₵ {amountPaid.toFixed(2)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
        
        <section className="flex justify-end mt-4">
            <div className="w-2/3 space-y-2">
                <div 
                    className="flex justify-between items-center py-2.5 px-4 rounded-xl border"
                    style={isPlainA5 ? { backgroundColor: '#f8fafc', borderColor: '#94a3b8', color: '#1e293b' } : { backgroundColor: primaryTheme, color: '#ffffff' }}
                >
                    <span className="font-black uppercase tracking-wide text-[10px]">Total Outstanding Ledger</span>
                    <span className="font-black text-base font-mono">GH₵ {totalBalance.toFixed(2)}</span>
                </div>
                
                <p className="text-[8px] text-slate-500 font-bold italic text-right pt-1 uppercase">
                    * Final balance includes all pending school fees.
                </p>
            </div>
        </section>
      </div>

      <footer className="px-8 pb-4 text-xs mt-auto relative z-10">
        <div className="flex justify-between items-end">
            <div className="text-center w-1/3 space-y-1.5">
                {/* SVG stamp seal marking it as PAID */}
                <div className={cn(
                  "relative flex items-center justify-center w-16 h-16 mx-auto rotate-[-12deg] opacity-90 border-2 border-dashed rounded-full p-1",
                  isPlainA5 ? "border-slate-700 text-slate-800" : "border-emerald-500 text-emerald-500"
                )}>
                    <div className={cn("flex flex-col items-center justify-center border rounded-full w-full h-full", isPlainA5 ? "border-slate-700 text-slate-800" : "border-emerald-500 text-emerald-500")}>
                        <span className="text-[5px] font-black uppercase tracking-widest">OFFICIAL</span>
                        <span className="text-[11px] font-black uppercase italic my-0.5">PAID</span>
                        <span className="text-[4px] font-black uppercase tracking-wider">{paymentDate.slice(0, 11)}</span>
                    </div>
                </div>
                <div className="border-b-2 border-dashed border-slate-400 w-full"></div>
                <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Bursar's Signature</p>
            </div>
             <div className="text-right opacity-50">
                <p className="text-[7px] font-black uppercase tracking-widest text-slate-500">GAM-EDU SECURE RECEIPT</p>
             </div>
        </div>
      </footer>
    </div>
  );
}