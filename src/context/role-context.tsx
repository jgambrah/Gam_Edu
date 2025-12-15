
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, ShieldAlert, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import SystemRepair from '@/components/SystemRepair';

type Role = 'Admin' | 'Teacher' | 'Student' | 'Parent' | 'Staff' | 'Director' | 'Administrator' | null;

interface RoleContextType {
  role: Role;
  loading: boolean;
  profile: any;
  refreshRole: () => void;
}

const RoleContext = createContext<RoleContextType>({ role: null, loading: true, profile: null, refreshRole: () => {} });

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const user = auth?.user;
  const firestore = useFirestore();
  
  const [role, setRole] = useState<Role>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshRole = () => setRefreshTrigger(prev => prev + 1);

  useEffect(() => {
    async function fetchRole() {
      if (!auth) return; 
      if (!user) {
        setRole(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      if (!firestore) return;

      setLoading(true);
      try {
        console.log(`[RoleContext] Checking roles for ${user.uid}...`);

        // 1. Check STAFF (Primary location for roles)
        const staffRef = doc(firestore, 'staff', user.uid);
        const staffSnap = await getDoc(staffRef);
        if (staffSnap.exists()) {
          console.log("[RoleContext] Found in 'staff'");
          setRole(staffSnap.data().role as Role);
          setProfile(staffSnap.data());
          setLoading(false);
          return;
        }

        // 2. Check STUDENTS
        const studentRef = doc(firestore, 'students', user.uid);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          setRole('Student');
          setProfile(studentSnap.data());
          setLoading(false);
          return;
        }

        // 3. Check PARENTS
        const parentRef = doc(firestore, 'parents', user.uid);
        const parentSnap = await getDoc(parentRef);
        if (parentSnap.exists()) {
          setRole('Parent');
          setProfile(parentSnap.data());
          setLoading(false);
          return;
        }

        console.warn("[RoleContext] No profile found in DB for this authenticated user.");
        setRole(null); // Explicitly set role to null if no profile is found
      } catch (error) {
        console.error("[RoleContext] Error fetching role:", error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [auth, user, firestore, refreshTrigger]);

  return (
    <RoleContext.Provider value={{ role, loading, profile, refreshRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);

// --- ROLE GUARD ---
export function RoleGuard({ children, allowedRoles = [] }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { role, loading, refreshRole } = useRole();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  // If we are still checking the user or their role, show a loading screen.
  if (loading || isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // If loading is finished but there is no user, redirect to login page.
  if (!user) {
    router.push('/');
    return null; 
  }
  
  // If user is logged in but has no assigned role, they can't proceed.
  if (!role) {
     return (
        <div className="flex h-screen w-full items-center justify-center bg-red-50 p-6">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border border-red-200 text-center">
                <UserX className="h-12 w-12 text-red-400 mx-auto mb-4"/>
                <h1 className="text-xl font-bold text-red-800">Profile Not Found</h1>
                <p className="text-slate-600 text-sm my-2">
                    Your user account is authenticated, but no corresponding profile (Staff, Student, or Parent) was found in the database.
                </p>
                <p className="text-xs text-slate-400 mb-4">Please contact your school administrator to have your profile created.</p>
                
                <SystemRepair onRepair={refreshRole} />

                <Button onClick={() => router.push('/')} variant="outline" className="w-full mt-4">
                    Go Back to Login
                </Button>
            </div>
        </div>
    );
  }

  // If a role is found, check if it is in the list of allowed roles for the page.
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-yellow-50 p-6">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border border-yellow-200 text-center">
                <ShieldAlert className="h-12 w-12 text-yellow-500 mx-auto mb-4"/>
                <h1 className="text-xl font-bold text-yellow-800">Access Denied</h1>
                <p className="text-slate-600 text-sm my-2">
                    Your role as a <strong className="text-black">{role}</strong> does not have permission to view this page.
                </p>
                 <Button onClick={() => router.push('/dashboard')} variant="outline" className="w-full">
                    Go to Dashboard
                </Button>
            </div>
        </div>
    );
  }

  // If all checks pass, render the children.
  return <>{children}</>;
}
