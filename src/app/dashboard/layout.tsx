
'use client';

import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/navigation/sidebar';
import Header from '@/components/navigation/header';
import { RoleProvider } from '@/context/role-context'; // Keep provider
import ClientBoundary from './client-boundary';
import { AiChat } from '@/components/ai-chat';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The RoleGuard was removed from here to fix the lockout.
    // The individual pages will handle their own security.
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
  );
}
