
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function StaffRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard/staff-management-v2');
    }, [router]);

    return (
        <div className="flex h-full w-full items-center justify-center p-8 text-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <p>Redirecting to the new Staff Management page...</p>
            </div>
        </div>
    );
}

    