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
  role: UserRole | null; // Allow null for "No Role Found"
  setRole: Dispatch<SetStateAction<UserRole | null>>;
  isRoleLoading: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

function RoleProviderContent({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null); // Start as NULL
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    const determineRole = async () => {
      if (isAuthLoading || !firestore) return;

      setIsRoleLoading(true);

      if (!user) {
        setRole('Parent'); // Guest/Logged out defaults to Parent view (Safe)
        setIsRoleLoading(false);
        return;
      }

      console.log("🔍 Checking Role for UID:", user.uid);

      // 1. Check Custom Claims (Fastest)
      try {
        const idTokenResult = await user.getIdTokenResult();
        const claimsRole = idTokenResult.claims.role;
        if (claimsRole && typeof claimsRole === 'string') {
          console.log("✅ Found Role via Claims:", claimsRole);
          setRole(claimsRole as UserRole);
          setIsRoleLoading(false);
          return;
        }
      } catch (e) { console.warn(e); }
      
      // 2. Check Staff Collection
      try {
        const staffDoc = await getDoc(doc(firestore, 'staff', user.uid));
        if (staffDoc.exists()) {
          const r = staffDoc.data().role || 'Teacher';
          console.log("✅ Found in Staff:", r);
          setRole(r as UserRole);
          setIsRoleLoading(false);
          return;
        }
      } catch (e) { console.log("Not staff or permission denied"); }

      // 3. Check Students Collection
      try {
        const studentDoc = await getDoc(doc(firestore, 'students', user.uid));
        if (studentDoc.exists()) {
          console.log("✅ Found in Students");
          setRole('Student');
          setIsRoleLoading(false);
          return;
        }
      } catch (e) { console.log("Not student"); }

      // 4. Check Parents Collection (Explicit Check)
      try {
        const parentDoc = await getDoc(doc(firestore, 'parents', user.uid));
        if (parentDoc.exists()) {
          console.log("✅ Found in Parents");
          setRole('Parent');
          setIsRoleLoading(false);
          return;
        }
      } catch (e) { console.log("Not parent"); }
      
      // 5. FINAL FALLBACK: Do NOT default to Parent. Default to NULL.
      console.warn("❌ User not found in any collection.");
      setRole(null); // No role found
      setIsRoleLoading(false);
    };

    determineRole();
    
  }, [user, firestore, isAuthLoading]);

  // @ts-ignore
  return <RoleContext.Provider value={{ role, setRole, isRoleLoading }}>{children}</RoleContext.Provider>;
}

export function RoleProvider({ children }: { children: ReactNode }) {
  return <RoleProviderContent>{children}</RoleProviderContent>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) throw new Error('useRole must be used within a RoleProvider');
  return context;
}

// --- 2. UPDATED ROLE GUARD ---
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

      // 2. Logged In? -> Check Redirects
      if (user && role) {
        const isStaff = ['Teacher', 'Administrator', 'Director', 'Accountant', 'Librarian'].includes(role);

        // A. STAFF Redirects
        if (isStaff) {
            if (pathname === '/dashboard' || pathname.startsWith('/dashboard/students') || pathname.startsWith('/dashboard/parents')) {
                router.push('/dashboard/staff');
            }
        }
        // B. STUDENT
        else if (role === 'Student') {
             if (pathname === '/dashboard' || pathname.startsWith('/dashboard/staff') || pathname.startsWith('/dashboard/parents')) {
                 router.push('/dashboard/students'); // Redirect to Student Portal
             }
        }
        // C. PARENT
        else if (role === 'Parent') {
            if (pathname === '/dashboard' || pathname.startsWith('/dashboard/staff') || pathname.startsWith('/dashboard/students')) {
                router.push('/dashboard/parents'); // Redirect to Parent Portal
            }
        }
      }
  }, [isLoading, user, role, pathname, router]);

  // --- AMENDMENT: Loading Screen ---
  // If loading, OR if we are sitting on the root '/dashboard' (waiting to be redirected), show the spinner.
  // This prevents the "wrong" dashboard from flashing on the screen.
  if (isLoading || (user && pathname === '/dashboard')) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">
                {isLoading ? "Verifying account..." : "Loading your portal..."}
            </p>
          </div>
      </div>
    )
  }

  // --- AMENDMENT: Account Not Configured ---
  if (!isLoading && user && !role && pathname.startsWith('/dashboard')) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
            <Card className="max-w-md w-full border-red-200 shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-2">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-red-700">Account Not Configured</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-slate-600">
                        You are logged in as <strong>{user.email}</strong>, but we couldn't find your profile in the Student, Staff, or Parent database.
                    </p>
                    <div className="bg-slate-100 p-3 rounded text-xs font-mono text-left">
                        UID: {user.uid} <br/>
                        Status: Role Missing
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Please contact the IT administrator to link your account correctly.
                    </p>
                    <Button onClick={() => router.push('/')} variant="outline">Back to Home</Button>
                </CardContent>
            </Card>
        </div>
      );
  }
  
  return <>{children}</>;
}
