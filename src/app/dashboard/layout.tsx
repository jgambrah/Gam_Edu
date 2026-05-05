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
import { useRole } from '@/context/role-context';
import ForcePasswordChange from '@/components/auth/ForcePasswordChange';
import { AiChat } from '@/components/ai-chat';
import { PushNotificationManager } from '@/components/PushNotificationManager';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const { role, profile, loading: isRoleLoading } = useRole();
  const firestore = useFirestore();
  const { schoolId, loading: isSchoolLoading } = useCurrentSchool();
  const router = useRouter();
  const pathname = usePathname();
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    async function checkSubscription() {
      if (!user || !firestore || !schoolId || !profile) return;
      if (user.email === 'jamesgambrah@gmail.com') return;
      
      // SKIP: Don't perform subscription check for parents as they are blocked from reading the school doc
      if (profile.role === 'Parent') return;

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

    if (!isSchoolLoading && !isUserLoading && !isRoleLoading) {
      checkSubscription();
    }
  }, [user, firestore, schoolId, isSchoolLoading, isUserLoading, isRoleLoading, profile, pathname, router]);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || isSchoolLoading || isRoleLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Mandatory Password Change Check
  const needsPasswordChange = profile?.requirePasswordChange === true;

  // Determine collection name for push tokens
  let collectionName = 'staff';
  if (profile?.role === 'Student') collectionName = 'students';
  if (profile?.role === 'Parent') collectionName = 'parents';

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-slate-800">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden md:ml-64 relative">
        <TrialBanner />
        <Header />
        <main className="relative flex-1 overflow-y-auto scroll-smooth">
          {/* DECORATIVE BACKGROUND GLOWS */}
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="p-4 md:p-8 relative z-10">
            <div className="pb-24">
              {children}
            </div>
          </div>
          
          {/* Overlay for expired trial */}
          {isLocked && !pathname.includes('/dashboard/subscription') && (
            <div key="access-locked-overlay" className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
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

          {/* Mandatory Password Change Overlay */}
          {needsPasswordChange && (
            <ForcePasswordChange user={user} profile={profile} />
          )}
        </main>
      </div>
      <AiChat />
      <PushNotificationManager collectionName={collectionName} />
      <SchoolSetupWizard />
    </div>
  );
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutContent>{children}</DashboardLayoutContent>
  );
}
