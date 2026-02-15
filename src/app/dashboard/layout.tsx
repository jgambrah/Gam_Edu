
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from '@/components/navigation/header';
import { useUser, useFirestore } from '@/firebase';
import { Loader2 } from 'lucide-react';
import AppSidebar from '@/components/navigation/sidebar';
import SchoolSetupWizard from '@/components/onboarding/SchoolSetupWizard';
import TrialBanner from '@/components/TrialBanner';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { doc, getDoc } from 'firebase/firestore';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { schoolId, loading: isSchoolLoading } = useCurrentSchool();
  const router = useRouter();
  const pathname = usePathname();
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      if (!user || !firestore || !schoolId) return;
      if (user.email === 'jamesgambrah@gmail.com') return;

      try {
        const schoolDoc = await getDoc(doc(firestore, 'schools', schoolId));
        if (schoolDoc.exists()) {
          const data = schoolDoc.data();
          if (data.plan === 'Trial' && data.trialEndsAt) {
            const expiryDate = data.trialEndsAt.toDate();
            const now = new Date();
            if (now > expiryDate) {
              setIsLocked(true);
              if (!pathname.includes('/dashboard/subscription')) {
                router.replace('/dashboard/subscription');
              }
            } else {
              setIsLocked(false);
            }
          } else {
            setIsLocked(false);
          }
        }
      } catch (error) {
        console.error('Subscription Check Failed:', error);
      }
    }

    if (!isSchoolLoading && !isUserLoading) {
      checkSubscription();
    }
  }, [user, firestore, schoolId, isSchoolLoading, isUserLoading, pathname, router]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || isSchoolLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden md:ml-64">
        <TrialBanner />
        <Header />
        <main className="relative flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
          {isLocked && !pathname.includes('/dashboard/subscription') && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
              <div className="p-8 text-center max-w-md">
                <h2 className="mb-2 text-3xl font-bold text-red-600">Access Locked</h2>
                <p className="mb-6 text-slate-600">
                  Your free trial has ended. Please upgrade your plan to continue accessing
                  your school data.
                </p>
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-red-500" />
                <p className="mt-2 text-xs text-muted-foreground">Redirecting to payment...</p>
              </div>
            </div>
          )}
        </main>
      </div>
      <SchoolSetupWizard />
    </div>
  );
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutContent>{children}</DashboardLayoutContent>
  );
}
