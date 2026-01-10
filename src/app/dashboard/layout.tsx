'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Header from '@/components/navigation/header';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TrialBanner from '@/components/TrialBanner';

// Dynamically import the sidebar
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
    // ✅ CRITICAL: Wrap everything with SidebarProvider
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TrialBanner />
          {/* Header with SidebarTrigger */}
          <Header />
          
          {/* Page content */}
          <main className="flex-1 overflow-auto bg-slate-50/50 p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
