
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
import { Loader2, AlertCircle } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type RoleContextType = {
  role: UserRole | null; 
  setRole: Dispatch<SetStateAction<UserRole | null>>;
  isRoleLoading: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

function RoleProviderContent({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null); 
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    const determineRole = async () => {
      // Wait for Auth & Firestore
      if (isAuthLoading || !firestore) return;

      setIsRoleLoading(true);

      if (!user) {
        setRole('Parent'); 
        setIsRoleLoading(false);
        return;
      }

      console.log("🔍 STARTING ROLE CHECK for:", user.uid);

      // --- PRIORITY 1: CHECK DATABASE (The Truth) ---
      
      // 1. Check Students Collection (Moved to Top for Students)
      try {
        const studentDoc = await getDoc(doc(firestore, 'students', user.uid));
        if (studentDoc.exists()) {
          console.log("✅ Found in Students DB");
          setRole('Student');
          setIsRoleLoading(false);
          return; // STOP HERE if found
        }
      } catch (e) { console.log("Not student check error"); }

      // 2. Check Staff Collection
      try {
        const staffDoc = await getDoc(doc(firestore, 'staff', user.uid));
        if (staffDoc.exists()) {
          const r = staffDoc.data().role || 'Teacher';
          console.log("✅ Found in Staff DB:", r);
          setRole(r as UserRole);
          setIsRoleLoading(false);
          return; // STOP HERE if found
        }
      } catch (e) { console.log("Not staff check error"); }

      // 3. Check Parents Collection
      try {
        const parentDoc = await getDoc(doc(firestore, 'parents', user.uid));
        if (parentDoc.exists()) {
          console.log("✅ Found in Parents DB");
          setRole('Parent');
          setIsRoleLoading(false);
          return; // STOP HERE if found
        }
      } catch (e) { console.log("Not parent check error"); }


      // --- PRIORITY 2: CHECK CLAIMS (Backup Only) ---
      // Only runs if NOT found in any database collection above
      try {
        const idTokenResult = await user.getIdTokenResult(); // Don't force refresh to save speed
        const claimsRole = idTokenResult.claims.role;
        if (claimsRole && typeof claimsRole === 'string') {
          console.log("⚠️ Database check failed. Using Claim:", claimsRole);
          setRole(claimsRole as UserRole);
          setIsRoleLoading(false);
          return;
        }
      } catch (e) { console.warn(e); }
      
      // --- FINAL FALLBACK ---
      console.warn("❌ User not found in DB or Claims.");
      setRole(null); // No role found -> Show Error Screen
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
  if (context === undefined) throw new Error('useRole must be used within a RoleProvider');
  return context;
}

// --- ROLE GUARD ---
export function RoleGuard({ children }: { children: ReactNode }) {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { role, isRoleLoading } = useRole();
  const router = useRouter();
  const pathname = usePathname();

  const isLoading = isAuthLoading || isRoleLoading;

  useEffect(() => {
      if (isLoading) return;

      if (!user && pathname.startsWith('/dashboard')) {
        router.push('/');
        return;
      }

      if (user && role) {
        const isStaff = ['Teacher', 'Administrator', 'Director', 'Accountant', 'Librarian', 'Cook'].includes(role);

        // A. STAFF
        if (isStaff) {
            if (pathname.startsWith('/dashboard/students') || pathname.startsWith('/dashboard/parents') || pathname === '/dashboard') {
                router.push('/dashboard/staff');
            }
        }
        // B. STUDENT
        else if (role === 'Student') {
             if (pathname.startsWith('/dashboard/staff') || pathname.startsWith('/dashboard/parents') || pathname === '/dashboard') {
                 router.push('/dashboard/students'); // <--- Redirects to Student Portal
             }
        }
        // C. PARENT
        else if (role === 'Parent') {
            if (pathname.startsWith('/dashboard/staff') || pathname.startsWith('/dashboard/students') || pathname === '/dashboard') {
                router.push('/dashboard/parents');
            }
        }
      }
  }, [isLoading, user, role, pathname, router]);

  if (isLoading || (user && pathname === '/dashboard')) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Loading Portal...</p>
          </div>
      </div>
    )
  }

  if (!isLoading && user && !role && pathname.startsWith('/dashboard')) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
            <Card className="max-w-md w-full border-red-200 shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-2">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-red-700">Account Not Found</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-slate-600">Logged in as <strong>{user.email}</strong></p>
                    <div className="bg-slate-100 p-3 rounded text-xs font-mono text-left">
                        UID: {user.uid}<br/>Status: No profile in Students/Staff/Parents
                    </div>
                    <Button onClick={() => router.push('/')} variant="outline">Back to Home</Button>
                </CardContent>
            </Card>
        </div>
      );
  }
  
  return <>{children}</>;
}
