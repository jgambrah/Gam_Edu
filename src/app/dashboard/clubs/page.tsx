
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page is deprecated and now redirects to the central clubs page.
export default function StudyClubPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/dashboard/study-club');
    }, [router]);

    return (
        <div className="flex h-full w-full items-center justify-center">
            <p>Redirecting to the Study Club page...</p>
        </div>
    );
}
