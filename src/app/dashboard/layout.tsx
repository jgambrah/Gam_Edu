
'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/navigation/header';
import { AiChat } from '@/components/ai-chat';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import TrialBanner from '@/components/TrialBanner'; // Import the banner

// Dynamically import the sidebar
const AppSidebar = dynamic(() => import('@/components/navigation/sidebar'), {
  loading: () => <div className="w-64 h-full bg-slate-100 animate-pulse" />, // Simple placeholder
  ssr: false,
});


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const firestore = useFirestore();
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    // If the user data has loaded and there is no user, redirect to login.
    if (!isUserLoading && !user) {
      router.replace('/');
      return;
    }
    
    // Check the trial status once the user is loaded
    async function checkTrialStatus() {
        if (!user || !firestore) {
            setIsCheckingStatus(false);
            return;
        };

        try {
            const userDoc = await getDoc(doc(firestore, 'users', user.uid));
            const schoolId = userDoc.data()?.schoolId;

            if (!schoolId) {
                setIsCheckingStatus(false);
                return; // Not part of a school, no trial to check
            }

            const schoolDoc = await getDoc(doc(firestore, 'schools', schoolId));
            const schoolData = schoolDoc.data();

            if (schoolData && schoolData.plan === 'Trial' && schoolData.trialEndsAt) {
                const endDate = schoolData.trialEndsAt.toDate();
                if (new Date() > endDate) {
                    setIsTrialExpired(true);
                }
            }
        } catch (error) {
            console.error("Failed to check trial status:", error);
        } finally {
            setIsCheckingStatus(false);
        }
    }
    
    if (user) {
        checkTrialStatus();
    }

  }, [user, isUserLoading, router, firestore]);
  
  // The Redirect Logic
  useEffect(() => {
      if (isTrialExpired && pathname !== '/dashboard/subscription') {
          router.replace('/dashboard/subscription');
      }
  }, [isTrialExpired, pathname, router]);


  // While checking user auth OR trial status, show a loading screen.
  if (isUserLoading || isCheckingStatus) {
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
  
  // If expired and on the subscription page, show a minimal layout
  if (isTrialExpired) {
      return (
          <div className="min-h-screen bg-slate-100">
               <main className="p-4 md:p-6 lg:p-8">
                    {children}
                </main>
          </div>
      )
  }

  return (
    <>
        <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col overflow-hidden">
          <TrialBanner />
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
