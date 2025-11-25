
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
      console.log("%c[DIAGNOSTIC] Starting Role Check...", "color: blue; font-weight: bold;");

      if (isAuthLoading || !firestore) {
        console.log("[DIAGNOSTIC] Waiting for Auth/Firestore...");
        return;
      }

      setIsRoleLoading(true);

      if (!user) {
        console.log("[DIAGNOSTIC] No user found. Defaulting to Parent.");
        setRole('Parent');
        setIsRoleLoading(false);
        return;
      }

      console.log(`[DIAGNOSTIC] User Found: ${user.uid} (${user.email})`);
      
      // 1. Check Staff Collection
      try {
        console.log("[DIAGNOSTIC] Step 1: Checking 'staff' collection in Firestore...");
        const staffDocRef = doc(firestore, 'staff', user.uid);
        const staffDocSnap = await getDoc(staffDocRef);
        
        if (staffDocSnap.exists()) {
          const staffData = staffDocSnap.data();
          console.log("[DIAGNOSTIC] Staff Document Data:", staffData);
          if (staffData.role) {
            console.log(`%c[DIAGNOSTIC] SUCCESS! Setting Role via Firestore (Staff) to: ${staffData.role}`, "color: green; font-weight: bold;");
            setRole(staffData.role as UserRole);
            setIsRoleLoading(false);
            return;
          } else {
             console.log("[DIAGNOSTIC] Staff doc exists, but has no 'role' field.");
          }
        } else {
          console.log("[DIAGNOSTIC] No document found in 'staff' collection for this UID.");
        }
      } catch (e) {
        // THIS IS COMMON: Permission Denied errors appear here
        console.error("[DIAGNOSTIC] Error checking staff collection:", e);
      }

      // 2. Check Students Collection
      try {
        console.log("[DIAGNOSTIC] Step 2: Checking 'students' collection...");
        const studentDocRef = doc(firestore, 'students', user.uid);
        const studentDocSnap = await getDoc(studentDocRef);
        if (studentDocSnap.exists()) {
           console.log("%c[DIAGNOSTIC] SUCCESS! Found in students. Setting to Student.", "color: green; font-weight: bold;");
          setRole('Student');
          setIsRoleLoading(false);
          return;
        } else {
           console.log("[DIAGNOSTIC] No document found in 'students' collection.");
        }
      } catch (e) {
          console.error("[DIAGNOSTIC] Error checking students collection:", e);
      }
      
      // 3. Fallback
      console.log("%c[DIAGNOSTIC] FAILED all checks. Defaulting to Parent.", "color: red; font-weight: bold;");
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
  const { role, isRoleLoading } = useRole();
  const router = useRouter();
  const pathname = usePathname();

  const isLoading = isAuthLoading || isRoleLoading;

  useEffect(() => {
      // 1. Redirect if not logged in
      if (!isLoading && !user && pathname.startsWith('/dashboard')) {
        router.push('/');
        return;
      }

      // 2. Redirect based on Role (The logic you were missing)
      if (!isLoading && user && role) {
        if (role === 'Teacher' && pathname === '/dashboard/parent') {
           router.push('/dashboard/staff'); // Send teacher away from parent portal
        }
        else if (role === 'Student' && pathname === '/dashboard/parent') {
           router.push('/dashboard'); // Send student to their main dashboard
        }
      }
  }, [isLoading, user, role, pathname, router]);

  if (isLoading && pathname.startsWith('/dashboard')) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    )
  }
  
  return <>{children}</>;
}
