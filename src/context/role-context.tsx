
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

  const staffDocRef = useMemoFirebase(() => user ? doc(firestore, 'staff', user.uid) : null, [firestore, user]);
  const { data: staffData, isLoading: isStaffLoading } = useDoc<{ role: UserRole }>(staffDocRef);

  const parentDocRef = useMemoFirebase(() => user ? doc(firestore, 'parents', user.uid) : null, [firestore, user]);
  const { data: parentData, isLoading: isParentLoading } = useDoc(parentDocRef);
  
  const studentDocRef = useMemoFirebase(() => user ? doc(firestore, 'students', user.uid) : null, [firestore, user]);
  const { data: studentData, isLoading: isStudentLoading } = useDoc(studentDocRef);

  const isRoleDataLoading = isStaffLoading || isParentLoading || isStudentLoading;

  useEffect(() => {
    if (isUserLoading || isRoleDataLoading || !user) return;

    // Special override for the admin user
    if (user.email === 'jamesgambrah@sunnyside.com') {
        setRole('Director');
        return;
    }
    
    if (staffData) {
        setRole(staffData.role);
    } else if (studentData) {
        setRole('Student');
    } else if (parentData) {
        setRole('Parent');
    } else {
        setRole('Parent'); // Fallback to a default role if no profile is found
    }
  }, [user, staffData, parentData, studentData, isUserLoading, isRoleDataLoading]);

  return (
    <RoleContext.Provider value={{ role, setRole, isRoleLoading: isUserLoading || isRoleDataLoading }}>
      {children}
    </RoleContext.Provider>
  );
}


export function RoleProvider({ children }: { children: ReactNode }) {
    return (
        <Suspense fallback={<div className="flex min-h-screen w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
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

export function RoleGuard({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const { isRoleLoading } = useRole();
  const router = useRouter();
  const pathname = usePathname();

  const isLoading = isUserLoading || isRoleLoading;

  useEffect(() => {
      if (!isLoading && !user && pathname !== '/') {
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
