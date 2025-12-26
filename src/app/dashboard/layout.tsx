
'use client';

import React from 'react';
import AppSidebar from '@/components/navigation/sidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import Header from '@/components/navigation/header';
import { AiChat } from '@/components/ai-chat'; // Import the new component

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      {/* The main content area that will fill the remaining space */}
      <SidebarInset>
        <div className="flex h-screen flex-col overflow-hidden">
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
