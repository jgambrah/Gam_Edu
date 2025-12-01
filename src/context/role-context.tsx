
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
  role: UserRole | null; // Changed to nullable to distinguish "loading" from "assigned"
  setRole: Dispatch<SetStateAction<UserRole>>;
  isRoleLoading: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// --- 1. ROLE PROVIDER (Determines WHO they are) ---
function RoleProviderContent({ children }: { children: ReactNode }) {
  // Start with null so we know we haven't decided yet
  const [role, setRole] = useState<UserRole>('Parent'); 
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    const determineRole = async () => {
      if (isAuthLoading || !firestore) return;

      setIsRoleLoading(true);

      if (!user) {
        setRole('Parent'); // Default safe role for guests
        setIsRoleLoading(false);
        return;
      }

      console.log(`Checking role for UID: ${user.uid}...`);

      // 1. Check Custom Claims (Fastest)
      try {
        const idTokenResult = await user.getIdTokenResult(); // Removed 'true' to prevent rate limits, unless strictly needed
        const claimsRole = idTokenResult.claims.role;
        
        if (claimsRole && typeof claimsRole === 'string') {
          console.log("Role found via Claims:", claimsRole);
          setRole(claimsRole as UserRole);
          setIsRoleLoading(false);
          return;
        }
      } catch (e) {
        console.warn("Claims check failed, falling back to DB.");
      }
      
      // 2. Check Staff Collection
      try {
        const staffDoc = await getDoc(doc(firestore, 'staff', user.uid));
        if (staffDoc.exists() && staffDoc.data().role) {
          setRole(staffDoc.data().role as UserRole);
          setIsRoleLoading(false);
          return;
        }
      } catch (e) { 
        console.log("Not a staff member (or permission denied)"); 
      }

      // 3. Check Students Collection
      try {
        const studentDoc = await getDoc(doc(firestore, 'students', user.uid));
        if (studentDoc.exists()) {
          console.log("User identified as Student");
          setRole('Student');
          setIsRoleLoading(false);
          return;
        }
      } catch (e) {
         console.log("Not a student");
      }

      // 4. Check Parents Collection (Explicit check, don't just assume)
      try {
        const parentDoc = await getDoc(doc(firestore, 'parents', user.uid));
        if (parentDoc.exists()) {
          setRole('Parent');
          setIsRoleLoading(false);
          return;
        }
      } catch (e) {
          console.log("Not a parent");
      }
      
      // 5. Final Fallback
      console.warn("User has no profile in DB. Defaulting to Parent view.");
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

// --- 2. ROLE GUARD (Determines WHERE they go) ---
export function RoleGuard({ children }: { children: ReactNode }) {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { role, isRoleLoading } = useRole();
  const router = useRouter();
  const pathname = usePathname();

  const isLoading = isAuthLoading || isRoleLoading;

  useEffect(() => {
      if (isLoading) return;

      // 1. Not Logged In? -> Go Home
      if (!user && pathname.startsWith('/dashboard')) {
        router.push('/');
        return;
      }

      // 2. Logged In? -> Enforce Portals
      if (user && role) {
        
        const isStaff = ['Teacher', 'Administrator', 'Director', 'Accountant', 'Librarian'].includes(role);

        // --- A. STAFF LOGIC ---
        if (isStaff) {
            // If Staff tries to go to Student or Parent portal
            if (pathname.startsWith('/dashboard/students') || pathname.startsWith('/dashboard/parents')) {
                router.push('/dashboard/staff'); // Or /dashboard/academics
            }
            // If Staff is at root dashboard
            else if (pathname === '/dashboard') {
                router.push('/dashboard/staff');
            }
        }
        
        // --- B. STUDENT LOGIC ---
        else if (role === 'Student') {
             // If Student tries to go to Staff or Parent portal
             if (pathname.startsWith('/dashboard/staff') || pathname.startsWith('/dashboard/parents') || pathname === '/dashboard') {
                 router.push('/dashboard/students'); // Make sure you have a 'students' folder (plural)
             }
        }

        // --- C. PARENT LOGIC (The 404 Fix) ---
        else if (role === 'Parent') {
            // If Parent tries to go to Staff or Student portal
            if (pathname.startsWith('/dashboard/staff') || pathname.startsWith('/dashboard/students') || pathname === '/dashboard') {
                // FIX: Changed from '/dashboard/parent' to '/dashboard/parents'
                router.push('/dashboard/parents'); 
            }
        }
      }
  }, [isLoading, user, role, pathname, router]);

  if (isLoading && pathname.startsWith('/dashboard')) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Verifying access...</p>
          </div>
      </div>
    )
  }
  
  return <>{children}</>;
}

    