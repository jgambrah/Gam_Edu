'use client';

import { use, useEffect, useState } from 'react';
import { getPublicInvoiceDetails } from '@/app/actions/public-payment';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ShieldCheck } from 'lucide-react';
// @ts-ignore
import { PaystackButton } from 'react-paystack';

export default function PublicPaymentPage({ params }: { params: Promise<{ recordId: string }> }) {
    const { recordId } = use(params);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
            const res = await getPublicInvoiceDetails(recordId);
            if (res.success) setData(res);
            else setError(res.error || "Unknown error");
            setLoading(false);
        }
        load();
    }, [recordId]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="h-10 w-10 animate-spin text-blue-600"/></div>;
    if (error) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-red-600 font-bold text-xl">{error}</div>;
    if (data.invoice.balance <= 0.01) return <div className="min-h-screen flex items-center justify-center bg-green-50 text-green-700 font-bold text-2xl text-center p-6">This invoice has already been paid in full! 🎉</div>;

    const paymentProps = {
        email: 'parent@gamedu.app', 
        amount: Math.round(data.invoice.balance * 100), // Pesewas
        currency: 'GHS',
        publicKey: data.school.paystackPubKey,
        text: `Pay GH₵ ${data.invoice.balance.toFixed(2)}`,
        metadata: {
            type: 'school_fee_payment',
            schoolId: data.school.id,
            studentId: data.invoice.studentId,
            recordId: data.invoice.id
        },
        onSuccess: () => {
            alert("Payment Successful! Thank you.");
            window.location.reload();
        },
        onClose: () => {},
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-t-8" style={{ borderTopColor: data.school.primaryColor }}>
                <CardHeader className="text-center pb-2">
                    {data.school.logoUrl && <img src={data.school.logoUrl} alt="Logo" className="h-16 mx-auto mb-4 object-contain" />}
                    <CardTitle className="text-2xl font-black">{data.school.name}</CardTitle>
                    <CardDescription className="font-bold uppercase text-[10px] tracking-widest">Secure Online Payment Portal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                    <div className="bg-slate-100 p-5 rounded-2xl space-y-2 border">
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Student</p>
                            <p className="text-lg font-black text-slate-800 uppercase tracking-tight">{data.invoice.studentName}</p>
                        </div>
                        <hr className="my-2 border-slate-200"/>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Payment For</p>
                            <p className="text-md font-bold text-slate-700">{data.invoice.description}</p>
                        </div>
                    </div>

                    <div className="text-center py-4">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] mb-1">Amount Due</p>
                        <p className="text-5xl font-black tracking-tighter" style={{ color: data.school.primaryColor }}>GH₵{data.invoice.balance.toFixed(2)}</p>
                    </div>

                    <PaystackButton 
                        className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-widest text-white shadow-xl transition-all active:scale-95 hover:brightness-110" 
                        style={{ backgroundColor: data.school.primaryColor }}
                        {...paymentProps} 
                    />

                    <div className="flex flex-col items-center gap-4 mt-6">
                        <p className="text-center text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                            <ShieldCheck className="h-3 w-3"/> Secured by Paystack & GAM Edu
                        </p>
                        <div className="h-1 w-20 bg-slate-200 rounded-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
