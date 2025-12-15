
'use client';

import AppSidebar from '@/components/navigation/sidebar';
import Header from '@/components/navigation/header';
import { RoleGuard } from '@/context/role-context';
import { ALL_ROLES } from '@/lib/types';
import { Sidebar, SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ClientBoundary from './client-boundary';
import { AiChat } from '@/components/ai-chat';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure all valid roles are allowed into the general dashboard layout.
  // Specific pages within the dashboard should handle their own more restrictive permissions if needed.
  return (
    <RoleGuard allowedRoles={[...ALL_ROLES]}>
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
