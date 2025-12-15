'use client';

import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/navigation/sidebar';
import Header from '@/components/navigation/header';
import { RoleGuard } from '@/context/role-context';
import ClientBoundary from './client-boundary';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { AiChat } from '@/components/ai-chat';
import { ALL_ROLES } from '@/lib/types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={ALL_ROLES}>
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
  );
}
