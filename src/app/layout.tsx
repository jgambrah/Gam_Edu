
import { RoleProvider } from '@/context/role-context';
import { SidebarProvider } from '@/components/ui/sidebar';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import ClientBoundary from './dashboard/client-boundary';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className="antialiased">
        <FirebaseClientProvider>
          <RoleProvider>
            <SidebarProvider>
              <ClientBoundary>
                {children}
              </ClientBoundary>
              <Toaster />
            </SidebarProvider>
          </RoleProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
