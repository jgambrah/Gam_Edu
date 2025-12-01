
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
import { useUser, useFirestore } from '@/firebase';
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
  const [role, setRole] = useState<UserRole>('Parent'); // Default safe role
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    const determineRole = async () => {
      // Wait for Auth to initialize
      if (isAuthLoading || !firestore) return;

      setIsRoleLoading(true);

      if (!user) {
        setRole('Parent');
        setIsRoleLoading(false);
        return;
      }

      console.log("Checking role for:", user.uid);

      // 1. Check Custom Claims First (Fastest & Most Reliable)
      // This requires your backend to set custom claims on signup/update
      try {
        const idTokenResult = await user.getIdTokenResult(true); // Force refresh
        const claimsRole = idTokenResult.claims.role;
        
        if (claimsRole && typeof claimsRole === 'string') {
          console.log("Found Role via Claims:", claimsRole);
          setRole(claimsRole as UserRole);
          setIsRoleLoading(false);
          return;
        }
      } catch (e) {
        console.warn("Failed to check ID Token claims:", e);
      }
      
      // 2. Check Staff Collection
      try {
        const staffDocRef = doc(firestore, 'staff', user.uid);
        const staffDocSnap = await getDoc(staffDocRef);
        
        if (staffDocSnap.exists()) {
          const staffData = staffDocSnap.data();
          if (staffData.role) {
            console.log("Found Role via Staff DB:", staffData.role);
            setRole(staffData.role as UserRole);
            setIsRoleLoading(false);
            return;
          }
        }
      } catch (e: any) {
        // Important: If permission denied, it means they MIGHT be a student/parent
        // because staff rules usually block non-staff.
        console.warn("Staff check failed (likely permission denied):", e.code);
      }

      // 3. Check Students Collection
      try {
        const studentDocRef = doc(firestore, 'students', user.uid);
        const studentDocSnap = await getDoc(studentDocRef);
        if (studentDocSnap.exists()) {
          setRole('Student');
          setIsRoleLoading(false);
          return;
        }
      } catch (e) {
          console.warn("Student check failed:", e);
      }

      // 4. Default to Parent (Fallthrough)
      // If we reached here, we checked Claims, Staff, and Student, and found nothing.
      console.log("No specific role found, defaulting to Parent.");
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
      // 1. Redirect unauthenticated users
      if (!isLoading && !user && pathname.startsWith('/dashboard')) {
        router.push('/');
        return;
      }

      // 2. Redirect Authenticated Users based on Role
      if (!isLoading && user && role) {
        
        const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role);
        
        // --- REDIRECT RULES ---
        
        // A. STAFF: Should not see Parent Registration or Student Registration
        if (isStaff) {
            if (pathname === '/dashboard/parent' || pathname === '/dashboard/student-registration') {
                 // Redirect Teachers to their main dashboard or academics
                 router.push('/dashboard/academics'); 
            }
        }
        
        // B. STUDENTS: Should not see Staff/Parent pages
        else if (role === 'Student') {
             if (pathname === '/dashboard/parent' || pathname.startsWith('/dashboard/staff') || pathname === '/dashboard/admissions') {
                 router.push('/dashboard');
             }
        }

        // C. PARENTS: Should not see Staff/Student pages
        else if (role === 'Parent') {
            if (pathname.startsWith('/dashboard/staff') || pathname === '/dashboard/academics') {
                router.push('/dashboard');
            }
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
