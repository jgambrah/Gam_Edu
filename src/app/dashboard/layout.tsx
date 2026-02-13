
'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/navigation/header';
import { useUser, useFirestore } from '@/firebase';
import { Loader2 } from 'lucide-react';
import AppSidebar from '@/components/navigation/sidebar';
import SchoolSetupWizard from '@/components/onboarding/SchoolSetupWizard'; 
import TrialBanner from '@/components/TrialBanner';
import dynamic from 'next/dynamic';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';

const AiChat = dynamic(
  () => import('@/components/ai-chat').then((mod) => mod.AiChat),
  { 
    ssr: false,
    loading: () => null
  }
);

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { schoolId, loading: isSchoolLoading } = useCurrentSchool();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const [isLocked, setIsLocked] = useState(false);

  // Subscription Gatekeeper Logic
  useEffect(() => {
    async function checkSubscription() {
      if (!user || !firestore || !schoolId) return;

      // 1. CEO Bypass (You should never be locked out)
      if (user.email === 'jamesgambrah@gmail.com') return;

      try {
        const schoolDoc = await getDoc(doc(firestore, 'schools', schoolId));
        if (schoolDoc.exists()) {
          const data = schoolDoc.data();

          // 2. Check if Trial is Expired
          if (data.plan === 'Trial' && data.trialEndsAt) {
            const expiryDate = data.trialEndsAt.toDate();
            const now = new Date();

            if (now > expiryDate) {
              // 3. If Expired, Block Access
              setIsLocked(true);

              // 4. Force Redirect to Subscription Page (unless already there)
              if (!pathname.includes('/dashboard/subscription')) {
                router.replace('/dashboard/subscription');
              }
            } else {
                setIsLocked(false);
            }
          } else {
             // Plan is Premium or no expiry set
             setIsLocked(false);
          }
        }
      } catch (error) {
        console.error("Subscription Check Failed:", error);
      }
    }

    if (!isSchoolLoading && !isUserLoading) {
        checkSubscription();
    }
  }, [user, firestore, schoolId, isSchoolLoading, isUserLoading, pathname, router]);

  const handleIframeMessage = useCallback(async (event: MessageEvent) => {
    // SECURITY: Ensure the message is from our trusted app
    if (event.origin !== "https://nursery-bloom-825774943692.us-west1.run.app") {
      return;
    }
    
    const { type, payload } = event.data;

    if (type === 'saveToStorage' && payload.path && payload.dataUrl) {
      toast({ title: "Saving...", description: "Uploading your creation to the cloud." });
      // In a real app, you would call a server action here to handle the upload.
      console.log("Received save request from Iframe:", payload.path);
      toast({ title: "Save Request Received!", description: "File upload logic would run here." });
    }
  }, [toast]);

  useEffect(() => {
    window.addEventListener('message', handleIframeMessage);
    return () => {
      window.removeEventListener('message', handleIframeMessage);
    };
  }, [handleIframeMessage]);

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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col overflow-hidden">
          <TrialBanner />
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
            {children}

            {/* LOCK OVERLAY */}
            {isLocked && !pathname.includes('/dashboard/subscription') && (
             <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                    <h2 className="text-3xl font-bold text-red-600 mb-2">Access Locked</h2>
                    <p className="text-slate-600 mb-6">Your free trial has ended. Please upgrade your plan to continue accessing your school data.</p>
                    <Loader2 className="h-8 w-8 animate-spin text-red-500 mx-auto" />
                    <p className="text-xs text-muted-foreground mt-2">Redirecting to payment...</p>
                </div>
             </div>
           )}

          </main>
        </div>
        <SchoolSetupWizard />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutContent>{children}</DashboardLayoutContent>
  );
}
