// This file has been deprecated and its functionality moved.
// The primary coding club page is now located at /dashboard/senior-academy
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeprecatedCodingClubPage() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/dashboard/senior-academy');
    }, [router]);
    return null; // Render nothing as it will redirect
}
