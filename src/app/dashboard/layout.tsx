'use client';

import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/navigation/sidebar';
import Header from '@/components/navigation/header';
import { RoleProvider, RoleGuard } from '@/context/role-context';
import ClientBoundary from './client-boundary';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { AiChat } from '@/components/ai-chat';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="flex min-h-screen w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
      <RoleProvider>
        <RoleGuard>
            <SidebarProvider>
            <Sidebar>
                <AppSidebar />
            </Sidebar>
            <SidebarInset>
                <Header />
                <ClientBoundary>
                  <main className="p-4 lg:p-6">{children}</main>
                  <AiChat />
                </ClientBoundary>
            </SidebarInset>
            </SidebarProvider>
        </RoleGuard>
      </RoleProvider>
    </Suspense>
  );
}
