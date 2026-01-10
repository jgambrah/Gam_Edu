
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import Header from '@/components/navigation/header';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import TrialBanner from '@/components/TrialBanner';

// Correctly import dynamic from 'next/dynamic'
const AppSidebar = dynamic(() => import('@/components/navigation/sidebar'), {
  loading: () => <div className="hidden w-64 h-full bg-slate-100 animate-pulse md:block" />,
  ssr: false,
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/');
    }
  }, [isUserLoading, user, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TrialBanner />
        <Header />
        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
