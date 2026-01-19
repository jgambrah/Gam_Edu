'use client';

import { type ReactNode } from 'react';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from '@/components/ui/toaster';
import { RoleProvider } from '@/context/role-context';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      <RoleProvider>
        {children}
      </RoleProvider>
      <Toaster />
    </FirebaseClientProvider>
  );
}
