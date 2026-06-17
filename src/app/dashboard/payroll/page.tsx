'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RedirectToFinancePayroll() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/dashboard/finance/payroll');
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50/50">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600 mb-2" />
            <p className="text-sm text-slate-500 font-semibold">Redirecting to Payroll Hub...</p>
        </div>
    );
}
