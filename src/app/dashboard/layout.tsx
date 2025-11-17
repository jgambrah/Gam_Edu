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
      <ClientBoundary>
        <SidebarProvider>
          <Sidebar>
            <AppSidebar />
          </Sidebar>
          <SidebarInset>
            <Header />
            <main className="p-4 lg:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </ClientBoundary>
    </RoleProvider>
  );
}
