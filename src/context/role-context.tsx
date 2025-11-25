
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
import { doc, getDoc } from 'firebase/firestore';

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

  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    const determineRole = async () => {
      if (isAuthLoading || !firestore) {
        // We can't do anything until authentication state is resolved.
        // The effect will re-run once isAuthLoading becomes false.
        return;
      }

      setIsRoleLoading(true);

      if (!user) {
        // If there's no user, default to Parent and stop loading.
        setRole('Parent');
        setIsRoleLoading(false);
        return;
      }

      // 1. Check for custom claims first
      try {
        const idTokenResult = await user.getIdTokenResult();
        const claimsRole = idTokenResult.claims.role;
        if (claimsRole && typeof claimsRole === 'string') {
          setRole(claimsRole as UserRole);
          setIsRoleLoading(false);
          return;
        }
      } catch (e) {
        console.warn("Could not get custom claims:", e);
      }
      
      // 2. Check staff collection
      try {
        const staffDocRef = doc(firestore, 'staff', user.uid);
        const staffDocSnap = await getDoc(staffDocRef);
        if (staffDocSnap.exists()) {
          const staffData = staffDocSnap.data();
          if (staffData.role) {
            setRole(staffData.role as UserRole);
            setIsRoleLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn("Could not check staff collection:", e);
      }

      // 3. Check students collection
      try {
        const studentDocRef = doc(firestore, 'students', user.uid);
        const studentDocSnap = await getDoc(studentDocRef);
        if (studentDocSnap.exists()) {
          setRole('Student');
          setIsRoleLoading(false);
          return;
        }
      } catch (e) {
          console.warn("Could not check students collection:", e);
      }
      
      // 4. Default to Parent if no other role is found
      setRole('Parent');
      setIsRoleLoading(false);
    };

    determineRole();
    
  }, [user, firestore, isAuthLoading]);

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
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { isRoleLoading } = useRole();
  const router = useRouter();
  const pathname = usePathname();

  const isLoading = isAuthLoading || isRoleLoading;

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
