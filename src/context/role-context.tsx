
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

  const isRoleLoading = isAuthLoading;

  useEffect(() => {
    if (isAuthLoading || !firestore) {
      return;
    }

    if (!user) {
      setRole('Parent'); // Default for non-logged-in users.
      return;
    }

    const determineRole = async () => {
      // 1. Check for custom claims first (most reliable)
      const idTokenResult = await user.getIdTokenResult();
      const claimsRole = idTokenResult.claims.role;
      if (claimsRole && typeof claimsRole === 'string') {
        setRole(claimsRole as UserRole);
        return;
      }
      
      // 2. Check if user is in the 'staff' collection
      try {
        const staffDocRef = doc(firestore, 'staff', user.uid);
        const staffDocSnap = await getDoc(staffDocRef);
        if (staffDocSnap.exists()) {
          const staffData = staffDocSnap.data();
          if (staffData.role) {
            setRole(staffData.role as UserRole);
            return;
          }
        }
      } catch (e) {
        console.warn("Could not check staff collection:", e);
      }

      // 3. Check if user is in the 'students' collection
      try {
        const studentDocRef = doc(firestore, 'students', user.uid);
        const studentDocSnap = await getDoc(studentDocRef);
        if (studentDocSnap.exists()) {
          setRole('Student');
          return;
        }
      } catch (e) {
          console.warn("Could not check students collection:", e);
      }
      
      // 4. Fallback to email domain
      if (user.email?.endsWith('@sunnyside-student.com')) {
          setRole('Student');
          return;
      }

      if (user.email?.endsWith('@sunnyside.com')) {
          setRole('Director'); // Or a more appropriate default for staff domain
          return;
      }
      
      // 5. Default to Parent if no other role is found
      setRole('Parent');
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
