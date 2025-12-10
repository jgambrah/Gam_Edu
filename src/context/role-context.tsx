
'use client';

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
import { Loader2, AlertCircle, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { doc, getDoc, collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAuth, signOut } from 'firebase/auth';
import { useCollection } from '@/firebase/firestore/use-collection';

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

  // FIX: Make queries conditional on user object
  const staffQuery = useMemoFirebase(() => (firestore && user) ? query(collection(firestore, 'staff'), where('uid', '==', user.uid)) : null, [firestore, user]);
  const studentQuery = useMemoFirebase(() => (firestore && user) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user]);
  const parentQuery = useMemoFirebase(() => (firestore && user) ? query(collection(firestore, 'parents'), where('uid', '==', user.uid)) : null, [firestore, user]);

  const { data: staffData, isLoading: isStaffLoading } = useCollection(staffQuery);
  const { data: studentData, isLoading: isStudentLoading } = useCollection(studentQuery);
  const { data: parentData, isLoading: isParentLoading } = useCollection(parentQuery);

  useEffect(() => {
    // We are now loading if auth is loading OR any of our conditional queries are loading
    const isDataLoading = isStaffLoading || isStudentLoading || isParentLoading;
    setIsRoleLoading(isAuthLoading || isDataLoading);

    if (isAuthLoading) return; // Wait for auth to resolve first
    if (!user) { // No user, not loading, no role
        setRole(null);
        setIsRoleLoading(false);
        return;
    }

    if (!isDataLoading && user) { // Auth and data queries are complete
        if (staffData && staffData.length > 0) {
            const rawRole = (staffData[0] as any).role;
            if (rawRole) {
                const normalizedRole = (rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase()) as UserRole;
                setRole(normalizedRole);
            } else {
                 setRole(null);
            }
        } else if (studentData && studentData.length > 0) {
            setRole('Student');
        } else if (parentData && parentData.length > 0) {
            setRole('Parent');
        } else {
            console.warn("User authenticated but no profile found in staff, students, or parents.");
            setRole(null);
        }
    }
    
  }, [user, isAuthLoading, staffData, studentData, parentData, isStaffLoading, isStudentLoading, isParentLoading]);

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

  // Handle Redirects
  useEffect(() => {
    if (isLoading) return;

    // 1. Not logged in -> Login Page
    if (!user && pathname.startsWith('/dashboard')) {
      router.push('/');
      return;
    }
    
    // 2. Logged In + On Dashboard Root -> Redirect to Portal
    if (user && role && pathname === '/dashboard') {
      console.log("🔀 Redirecting based on role:", role);

      if (role === 'Teacher') {
        router.push('/dashboard/academics'); 
      } else if (role === 'Student') {
        router.push('/dashboard/assignments');
      } else if (role === 'Parent') {
        router.push('/dashboard/report-cards');
      } else {
        // Admins, Directors, etc.
        router.push('/dashboard/staff-management-v2');
      }
    }
  }, [isLoading, user, role, pathname, router]);


  // --- LOADING SCREEN ---
  if (isLoading || (user && role && pathname === '/dashboard')) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-muted-foreground animate-pulse font-medium">
                {isAuthLoading ? "Verifying account..." : "Loading your portal..."}
            </p>
          </div>
      </div>
    )
  }

  // --- ERROR: NO ROLE FOUND ---
  if (!isLoading && user && !role && pathname.startsWith('/dashboard')) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4">
            <Card className="max-w-md w-full border-red-200 shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-2">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle className="text-red-700">Profile Not Found</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-slate-600">
                        We found your account (<strong>{user.email}</strong>), but we could not find your 
                        <strong> Staff, Student, or Parent</strong> profile in the database.
                    </p>
                    <div className="text-sm text-muted-foreground bg-slate-100 p-3 rounded text-left">
                        <strong>Troubleshooting:</strong>
                        <ul className="list-disc list-inside mt-1">
                            <li>Are you logged into the correct account?</li>
                            <li>Has the admin created your profile yet?</li>
                        </ul>
                    </div>
                    <div className="flex gap-2 justify-center pt-2">
                        <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
                        <Button onClick={() => signOut(getAuth())} variant="destructive">
                            <LogOut className="mr-2 h-4 w-4"/> Sign Out
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
      );
  }
  
  return <>{children}</>;
}
