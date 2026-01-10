
'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import Header from '@/components/navigation/header';
import TrialBanner from '@/components/TrialBanner';
import { AiChat } from '@/components/ai-chat';

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
            {/* ✅ Root container: Fixed height, no overflow */}
            <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />
                
                {/* ✅ Content column: Fixed height, no overflow */}
                <div className="flex flex-col h-screen flex-1 min-w-0">
                    {/* ✅ Fixed elements at top - auto height */}
                    <TrialBanner />
                    <Header />
                    
                    {/* ✅ CRITICAL: Main area takes remaining height and scrolls */}
                    <main className="flex-1 min-h-0 overflow-x-auto overflow-y-auto bg-slate-50/50 p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                    
                    {/* ✅ Fixed element at bottom - auto height */}
                    <AiChat />
                </div>
            </div>
        </SidebarProvider>
    );
}
