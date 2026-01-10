
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
            {/* ✅ Root: Fixed height, fixed width, no overflow */}
            <div className="flex h-screen w-screen overflow-hidden">
                {/* ✅ Sidebar: Fixed width */}
                <AppSidebar />
                
                {/* ✅ Content wrapper: Takes remaining width */}
                <div className="flex flex-col flex-1 h-screen min-w-0 overflow-hidden">
                    {/* ✅ Fixed header elements */}
                    <div className="flex-shrink-0">
                        <TrialBanner />
                        <Header />
                    </div>
                    
                    {/* ✅ SCROLLABLE MAIN AREA */}
                    <main className="flex-1 min-h-0 w-full overflow-auto bg-slate-50/50">
                        <div className="p-4 md:p-6 lg:p-8">
                            {children}
                        </div>
                    </main>
                    
                    {/* ✅ Fixed footer element */}
                    <div className="flex-shrink-0">
                        <AiChat />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
