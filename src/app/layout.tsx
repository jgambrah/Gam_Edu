
import { RoleProvider } from '@/context/role-context';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';

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
              {children}
              <Toaster />
          </RoleProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
