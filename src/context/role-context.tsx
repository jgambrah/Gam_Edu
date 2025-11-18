
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
import { useDoc, useFirestore, useUser, useMemoFirebase, FirebaseContext } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

type RoleContextType = {
  role: UserRole;
  setRole: Dispatch<SetStateAction<UserRole>>;
  isRoleLoading: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('Parent');
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { firestore, areServicesAvailable } = useContext(FirebaseContext)!; // Use context directly to get availability

  // Fetch staff role
  const staffDocRef = useMemoFirebase(() => (areServicesAvailable && user) ? doc(firestore, 'staff', user.uid) : null, [firestore, user, areServicesAvailable]);
  const { data: staffData, isLoading: isStaffLoading } = useDoc<{ role: UserRole }>(staffDocRef);

  // Fetch parent role
  const parentDocRef = useMemoFirebase(() => (areServicesAvailable && user) ? doc(firestore, 'parents', user.uid) : null, [firestore, user, areServicesAvailable]);
  const { data: parentData, isLoading: isParentLoading } = useDoc(parentDocRef);

  // Fetch student role
  const studentDocRef = useMemoFirebase(() => (areServicesAvailable && user) ? doc(firestore, 'students', user.uid) : null, [firestore, user, areServicesAvailable]);
  const { data: studentData, isLoading: isStudentLoading } = useDoc(studentDocRef);

  const isRoleLoading = isAuthLoading || isStaffLoading || isParentLoading || isStudentLoading;

  return (
    <RoleContext.Provider value={{ role, setRole, isRoleLoading }}>
      <RoleGuard>
        {children}
      </RoleGuard>
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}

export function RoleGuard({ children }: { children: ReactNode }) {
    const { role, setRole, isRoleLoading } = useRole();
    const { user, isUserLoading: isAuthLoading } = useUser();
    const { firestore, areServicesAvailable } = useContext(FirebaseContext)!;
    const router = useRouter();
    const pathname = usePathname();

    const staffDocRef = useMemoFirebase(() => (areServicesAvailable && user) ? doc(firestore, 'staff', user.uid) : null, [firestore, user, areServicesAvailable]);
    const { data: staffData } = useDoc<{ role: UserRole }>(staffDocRef);

    const parentDocRef = useMemoFirebase(() => (areServicesAvailable && user) ? doc(firestore, 'parents', user.uid) : null, [firestore, user, areServicesAvailable]);
    const { data: parentData } = useDoc(parentDocRef);
    
    const studentDocRef = useMemoFirebase(() => (areServicesAvailable && user) ? doc(firestore, 'students', user.uid) : null, [firestore, user, areServicesAvailable]);
    const { data: studentData } = useDoc(studentDocRef);

    useEffect(() => {
        if (!isRoleLoading && !user && pathname !== '/') {
          router.push('/');
        }
    }, [isRoleLoading, user, pathname, router]);

    useEffect(() => {
        if (user) {
          // Special override for the admin user
          if (user.email === 'jamesgambrah@sunnyside.com') {
            setRole('Director');
            return;
          }
    
          if (staffData) setRole(staffData.role);
          else if (parentData) setRole('Parent');
          else if (studentData) setRole('Student');
        }
      }, [user, staffData, parentData, studentData, setRole]);

  if (isRoleLoading && user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    )
  }
  
  return <>{children}</>;
}
