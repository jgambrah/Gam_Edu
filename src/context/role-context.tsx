
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
import { useUser, useFirestore } from '@/firebase';
import { Loader2, AlertCircle, LogOut } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAuth, signOut } from 'firebase/auth';

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
    let isMounted = true;

    const determineRole = async () => {
      // 1. Wait for Auth and Firestore to be ready
      if (isAuthLoading || !firestore) return;

      // 2. If no user, stop loading
      if (!user) {
        if(isMounted) {
            setRole(null);
            setIsRoleLoading(false);
        }
        return;
      }

      if(isMounted) setIsRoleLoading(true);
      console.log("🔍 Checking role for user:", user.uid);
      
      // 3. Check Collections Sequentially
      const collectionsToTest: { name: string; roleField?: string, fixedRole?: UserRole }[] = [
        { name: 'staff', roleField: 'role' },
        { name: 'students', fixedRole: 'Student' },
        { name: 'parents', fixedRole: 'Parent' },
      ];

      for (const collectionInfo of collectionsToTest) {
        try {
            const docRef = doc(firestore, collectionInfo.name, user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                let userRole: UserRole | null = null;
                
                if (collectionInfo.fixedRole) {
                    userRole = collectionInfo.fixedRole;
                } else if (collectionInfo.roleField) {
                    const data = docSnap.data();
                    // Handle case sensitivity (e.g. "Teacher" vs "teacher")
                    const rawRole = data[collectionInfo.roleField];
                    if (rawRole) {
                        // Capitalize first letter to match UserRole type
                        userRole = (rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase()) as UserRole;
                    }
                }
                
                if (userRole) {
                    console.log(`✅ Found user in '${collectionInfo.name}' with role: ${userRole}`);
                    if(isMounted) {
                        setRole(userRole);
                        setIsRoleLoading(false);
                    }
                    return; 
                }
            }
        } catch (e) {
            console.warn(`Could not check collection '${collectionInfo.name}':`, e);
        }
      }

      // 4. No Role Found
      console.warn("❌ User authenticated but has no profile.");
      if(isMounted) {
          setRole(null); 
          setIsRoleLoading(false);
      }
    };

    determineRole();

    return () => { isMounted = false; };
    
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
        // Redirect teachers to Academics (Safest bet) or Assignments
        router.push('/dashboard/academics'); 
      } else if (role === 'Student') {
        router.push('/dashboard/student'); // Or /dashboard/academics
      } else if (role === 'Parent') {
        router.push('/dashboard/parents-v2'); // Or /dashboard/parent
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
