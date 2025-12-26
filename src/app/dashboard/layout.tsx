'use client';

import React from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/dashboard/app-sidebar';
import { Separator } from '@/components/ui/separator';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <SidebarInset className="flex flex-col flex-1 overflow-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/95 backdrop-blur z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex items-center gap-2">
             <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
               Dashboard
             </span>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </div>
  );
}
