
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
            {/* ✅ Fixed: Added overflow-hidden to prevent body scroll */}
            <div className="flex h-screen w-full overflow-hidden">
                <AppSidebar />
                
                {/* ✅ Fixed: Proper flex column with overflow control */}
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                    <TrialBanner />
                    <Header />
                    
                    {/* ✅ Fixed: Main scrollable area with both vertical and horizontal scroll */}
                    <main className="flex-1 overflow-x-auto overflow-y-auto bg-slate-50/50 p-4 md:p-6 lg:p-8">
                        {/* ✅ Content wrapper ensures proper width */}
                        <div className="min-w-fit">
                            {children}
                        </div>
                    </main>
                    
                    {/* ✅ AiChat stays fixed at bottom */}
                    <AiChat />
                </div>
            </div>
        </SidebarProvider>
    );
}
