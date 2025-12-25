
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // This sends the user from "/" to your main dashboard automatically
    router.push('/dashboard/senior-academy');
  }, [router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
      <h1 className="text-xl font-bold text-slate-600">Redirecting to Studio...</h1>
    </div>
  );
}
