
'use client';

import React from 'react';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarInset className="flex flex-1 flex-col overflow-hidden">
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Dashboard
            </span>
        </div>
      </header>
      
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </SidebarInset>
  );
}
