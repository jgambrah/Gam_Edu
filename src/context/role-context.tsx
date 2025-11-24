
"use client";

import { 
  createContext, 
  useState, 
  useContext, 
  type ReactNode, 
  type Dispatch, 
  type SetStateAction, 
  useEffect
} from 'react';
import type { UserRole } from '@/lib/types';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { doc } from 'firebase/firestore';

type RoleContextType = {
  role: UserRole;
  setRole: Dispatch<SetStateAction<UserRole>>;
  isRoleLoading: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

function RoleProviderContent({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('Parent');
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();

  const staffDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'staff', user.uid) : null),
    [firestore, user]
  );
  const { data: staffData, isLoading: isStaffLoading } = useDoc<{ role: UserRole }>(staffDocRef);

  const isRoleLoading = isAuthLoading || isStaffLoading;

  useEffect(() => {
    if (isAuthLoading) {
      // Still waiting for Firebase Auth to determine if a user is logged in.
      // Do nothing until we know.
      return;
    }

    if (!user) {
      // Auth is settled, and there's definitely no user.
      setRole('Parent'); // Default for non-logged-in users.
      return;
    }

    // Now we have a user, but we might be waiting for their staff document.
    if (isStaffLoading) {
      return;
    }

    // At this point, we have a user, and their staff data has been fetched (or not found).
    if (staffData) {
      setRole(staffData.role);
    } else if (user.email?.endsWith('@sunnyside-student.com')) {
      setRole('Student');
    } else if (user.email?.endsWith('@sunnyside-parent.com')) {
      setRole('Parent');
    } else {
      // Fallback for an authenticated user who is not a student, parent, or in the staff collection.
      // Defaults to 'Director' to allow initial admin setup.
      setRole('Director'); 
    }
  }, [user, staffData, isAuthLoading, isStaffLoading]);

  return (
    <RoleContext.Provider value={{ role, setRole, isRoleLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function RoleProvider({ children }: { children: ReactNode }) {
  return <RoleProviderContent>{children}</RoleProviderContent>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

export function RoleGuard({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const { isRoleLoading } = useRole();
  const router = useRouter();
  const pathname = usePathname();

  const isLoading = isUserLoading || isRoleLoading;

  useEffect(() => {
      if (!isLoading && !user && pathname.startsWith('/dashboard')) {
        router.push('/');
      }
  }, [isLoading, user, pathname, router]);

  if (isLoading && pathname.startsWith('/dashboard')) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    )
  }
  
  return <>{children}</>;
}
