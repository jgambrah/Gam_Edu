
'use client';

import React, { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/navigation/header';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import AppSidebar from '@/components/navigation/sidebar';
import SchoolSetupWizard from '@/components/onboarding/SchoolSetupWizard'; 
import TrialBanner from '@/components/TrialBanner';
import dynamic from 'next/dynamic';
import { useToast } from '@/hooks/use-toast';

const AiChat = dynamic(
  () => import('@/components/ai-chat').then((mod) => mod.AiChat),
  { 
    ssr: false,
    loading: () => null
  }
);

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const handleIframeMessage = useCallback(async (event: MessageEvent) => {
    // SECURITY: Ensure the message is from our trusted app
    if (event.origin !== "https://nursery-bloom-825774943692.us-west1.run.app") {
      return;
    }
    
    const { type, payload } = event.data;

    if (type === 'saveToStorage' && payload.path && payload.dataUrl) {
      toast({ title: "Saving...", description: "Uploading your creation to the cloud." });
      // In a real app, you would call a server action here to handle the upload.
      // For now, we just log it to prove the concept.
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

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
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
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {children}
          </main>
        </div>
        {/* <AiChat /> */}
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
