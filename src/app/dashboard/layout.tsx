
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppSidebar from '@/components/navigation/sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/navigation/header';
import { AiChat } from '@/components/ai-chat';
import { useUser } from '@/firebase'; // Import the useUser hook
import { Loader2 } from 'lucide-react';

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
      <AppSidebar />
      {/* The main content area that will fill the remaining space */}
      <SidebarInset>
        <div className="flex h-screen flex-col overflow-hidden">
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
