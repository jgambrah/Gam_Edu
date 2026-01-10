
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
            {/* ✅ Root: Fixed to viewport, no overflow */}
            <div className="fixed inset-0 flex overflow-hidden">
                {/* ✅ Sidebar: Scrollable if needed */}
                <div className="flex-shrink-0">
                    <AppSidebar />
                </div>
                
                {/* ✅ Content area: Takes remaining space */}
                <div className="flex flex-col flex-1 min-w-0 h-full">
                    {/* ✅ Fixed header elements - no scroll */}
                    <div className="flex-shrink-0">
                        <TrialBanner />
                        <Header />
                    </div>
                    
                    {/* ✅ SCROLLABLE MAIN: Vertical only, fits width */}
                    <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/50">
                        <div className="w-full max-w-full p-4 md:p-6 lg:p-8">
                            {children}
                        </div>
                    </main>
                    
                    {/* ✅ Fixed footer element - no scroll */}
                    <div className="flex-shrink-0">
                        <AiChat />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
