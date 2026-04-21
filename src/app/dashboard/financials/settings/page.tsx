'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RedirectToFinanceSettings() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/dashboard/finance/settings');
    }, [router]);
    return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;
}
