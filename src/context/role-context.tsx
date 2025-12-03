
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
      if (isAuthLoading || !firestore) {
        // Still waiting for auth or firestore to be ready
        return;
      }

      setIsRoleLoading(true);

      if (!user) {
        // No user is logged in, so they have no role.
        setRole(null);
        setIsRoleLoading(false);
        return;
      }

      console.log("🔍 Checking role for user:", user.uid);
      
      // Sequentially check collections. This is a robust way to find the user's role.
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
                    userRole = docSnap.data()[collectionInfo.roleField] as UserRole;
                }
                
                if (userRole) {
                    console.log(`✅ Found user in '${collectionInfo.name}' with role: ${userRole}`);
                    setRole(userRole);
                    setIsRoleLoading(false);
                    return; // Role found, exit the loop and function.
                }
            }
        } catch (e) {
            console.warn(`Could not check collection '${collectionInfo.name}':`, e);
        }
      }

      // --- FINAL FALLBACK ---
      // If the loop completes without finding a role, the user has an auth record but no profile in the DB.
      console.warn("❌ User authenticated but has no profile in 'staff', 'students', or 'parents'.");
      setRole(null); // Set role to null to indicate a problem.
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
    
    // Only redirect if the user is on the base dashboard page and has a role
    if (user && role && pathname === '/dashboard') {
      const isStaff = ['Administrator', 'Director', 'Accountant', 'Librarian', 'Cook'].includes(role);

      if (role === 'Teacher') {
        router.push('/dashboard/assignments');
      } else if (isStaff) {
        router.push('/dashboard/staff-management-v2');
      } else if (role === 'Student') {
        router.push('/dashboard/assignments');
      } else if (role === 'Parent') {
        router.push('/dashboard/parents-v2');
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

  // If user is authenticated but has no valid role, show an error screen.
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
                    <p className="text-slate-600">Your account (<strong>{user.email}</strong>) is authenticated, but we couldn't find an associated staff, student, or parent profile.</p>
                    <p className="text-sm text-muted-foreground">Please contact your school administrator to get your account set up correctly.</p>
                    <Button onClick={() => router.push('/')} variant="outline">Back to Home</Button>
                </CardContent>
            </Card>
        </div>
      );
  }
  
  return <>{children}</>;
}
