
"use client";

import { 
  createContext, 
  useState, 
  useContext, 
  type ReactNode, 
  type Dispatch, 
  type SetStateAction, 
  useEffect,
  Suspense 
} from 'react';
import { useSearchParams } from 'next/navigation';
import type { UserRole } from '@/lib/types';
import { useDoc, useFirebase, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

type RoleContextType = {
  role: UserRole;
  setRole: Dispatch<SetStateAction<UserRole>>;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

function RoleProviderContent({ children }: { children: ReactNode }) {
  const params = useSearchParams();
  const initialRole = (params.get('role') as UserRole) || 'Parent';
  const [role, setRole] = useState<UserRole>(initialRole);
  const { user } = useUser();
  const { firestore } = useFirebase();

  const staffDocRef = user ? doc(firestore, 'staff', user.uid) : null;
  const { data: staffData } = useDoc<{ role: UserRole }>(staffDocRef);

  useEffect(() => {
    const roleFromUrl = params.get('role') as UserRole;
    if (roleFromUrl) {
      setRole(roleFromUrl);
    } else if (staffData?.role) {
      setRole(staffData.role);
    }
  }, [params, staffData]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function RoleProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
      <RoleProviderContent>{children}</RoleProviderContent>
    </Suspense>
  )
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
