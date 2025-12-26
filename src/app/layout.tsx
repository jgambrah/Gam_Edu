
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { RoleProvider } from '@/context/role-context';
import { SidebarProvider } from '@/components/ui/sidebar';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <FirebaseClientProvider>
          <RoleProvider>
            <SidebarProvider>
              {children}
              <Toaster />
            </SidebarProvider>
          </RoleProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
