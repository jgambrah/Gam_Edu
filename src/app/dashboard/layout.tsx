'use client';

import AppSidebar from '@/components/navigation/sidebar';
import Header from '@/components/navigation/header';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ClientBoundary from './client-boundary';
import { AiChat } from '@/components/ai-chat';

/**
 * The RoleGuard has been removed from this layout to allow direct access
 * without requiring a login, as requested.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
