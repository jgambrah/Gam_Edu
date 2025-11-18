
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/navigation/sidebar';
import Header from '@/components/navigation/header';
import { RoleProvider } from '@/context/role-context';
import ClientBoundary from './client-boundary';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <SidebarProvider>
        <Sidebar>
          <AppSidebar />
        </Sidebar>
        <SidebarInset>
          <Header />
          <ClientBoundary>
            <main className="p-4 lg:p-6">{children}</main>
          </ClientBoundary>
        </SidebarInset>
      </SidebarProvider>
    </RoleProvider>
  );
}
