
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, ShieldAlert, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import SystemRepair from '@/components/SystemRepair';

type Role = 'Admin' | 'Teacher' | 'Student' | 'Parent' | 'Staff' | 'Director' | 'Administrator' | null;

interface RoleContextType {
  role: Role;
  loading: boolean;
  profile: any;
  refreshRole: () => void;
}

const RoleContext = createContext<RoleContextType>({ role: 'Director', loading: false, profile: null, refreshRole: () => {} });

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('Director');
  
  // In a no-login setup, we can default to a powerful role like 'Director'
  // to ensure all features are accessible for demonstration.
  const value = {
    role: 'Director',
    loading: false,
    profile: null,
    refreshRole: () => {},
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);

// --- ROLE GUARD (Altered to always allow access) ---
export function RoleGuard({ children, allowedRoles = [] }: { children: React.ReactNode; allowedRoles?: string[] }) {
  // This guard is now simplified to always render children,
  // effectively disabling role-based restrictions.
  return <>{children}</>;
}
