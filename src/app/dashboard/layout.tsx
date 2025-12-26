
'use client';

import React from 'react';
import AppSidebar from '@/components/navigation/sidebar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/navigation/header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppSidebar />
      <div className="flex h-screen w-full flex-col overflow-hidden pl-0 md:pl-[var(--sidebar-width)] group-data-[state=collapsed]:md:pl-[var(--sidebar-width-icon)] transition-[padding-left] duration-300 ease-in-out">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </>
  );
}
