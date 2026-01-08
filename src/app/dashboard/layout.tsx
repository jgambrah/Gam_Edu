
'use client';

import React, { useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/navigation/header';
import { AiChat } from '@/components/ai-chat';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import TrialBanner from '@/components/TrialBanner'; // Import the new banner

// Dynamically import the sidebar
const AppSidebar = dynamic(() => import('@/components/navigation/sidebar'), {
  loading: () => <div className="w-64 h-full bg-slate-100 animate-pulse" />, // Simple placeholder
  ssr: false,
});


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If the user data has loaded and there is no user, redirect to login.
    if (!isUserLoading && !user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  // While checking user auth, show a loading screen.
  if (isUserLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // If user is not logged in, render nothing to prevent flash of content before redirect
  if (!user) {
    return null;
  }

  return (
    <>
      <Suspense fallback={<div className="w-64 h-full bg-slate-100 animate-pulse" />}>
        <AppSidebar />
      </Suspense>
      {/* The main content area that will fill the remaining space */}
      <SidebarInset>
        <div className="flex h-screen flex-col overflow-hidden">
          <TrialBanner /> {/* Add the banner here */}
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
        <AiChat />
      </SidebarInset>
    </>
  );
}
