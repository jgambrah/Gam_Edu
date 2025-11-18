
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
import { useUser, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
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
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  const staffDocRef = useMemoFirebase(() => (user && firestore) ? doc(firestore, 'staff', user.uid) : null, [firestore, user]);
  const { data: staffData, isLoading: isStaffLoading } = useDoc<{ role: UserRole }>(staffDocRef);

  useEffect(() => {
    const determineRole = async () => {
      if (isUserLoading || isStaffLoading) return;

      if (!user) {
        setIsRoleLoading(false);
        return;
      }

      if (user.email === 'jamesgambrah@sunnyside.com') {
        setRole('Director');
      } else if (staffData) {
        setRole(staffData.role);
      } else if (user.email?.endsWith('@sunnyside-student.com')) {
        setRole('Student');
      } else if (user.email?.endsWith('@sunnyside-parent.com')) {
        setRole('Parent');
      } else {
        setRole('Parent'); // Default fallback
      }
      setIsRoleLoading(false);
    };

    determineRole();
  }, [user, staffData, isUserLoading, isStaffLoading]);

  return (
    <RoleContext.Provider value={{ role, setRole, isRoleLoading: isUserLoading || isRoleLoading }}>
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
      if (!isUserLoading && !user && pathname.startsWith('/dashboard')) {
        router.push('/');
      }
  }, [isUserLoading, user, pathname, router]);

  if (isLoading && pathname.startsWith('/dashboard')) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    )
  }
  
  return <>{children}</>;
}
