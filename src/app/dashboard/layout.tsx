
'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Header from '@/components/navigation/header';
import TrialBanner from '@/components/TrialBanner';
import { AiChat } from '@/components/ai-chat'; // Import the AiChat component

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
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                    <TrialBanner />
                    <Header />
                    <main className="flex-1 overflow-auto bg-slate-50/50 p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                    <AiChat />
                </div>
            </div>
        </SidebarProvider>
    );
}
