
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, ShieldAlert, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Ensure you have this, or use standard <button>

type Role = 'Admin' | 'Teacher' | 'Student' | 'Parent' | 'Staff' | 'Director' | 'Administrator' | null;

interface RoleContextType {
  role: Role;
  loading: boolean;
  profile: any;
  refreshRole: () => void; // Added refresh function
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

        // 1. Check USERS (Admin Repair Tool location)
        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          console.log("[RoleContext] Found in 'users'");
          const data = userSnap.data();
          setRole(data.role as Role); 
          setProfile(data);
          setLoading(false);
          return;
        }

        // 2. Check STAFF
        const staffRef = doc(firestore, 'staff', user.uid);
        const staffSnap = await getDoc(staffRef);
        if (staffSnap.exists()) {
          console.log("[RoleContext] Found in 'staff'");
          setRole(staffSnap.data().role as Role);
          setProfile(staffSnap.data());
          setLoading(false);
          return;
        }

        // 3. Check STUDENTS
        const studentRef = doc(firestore, 'students', user.uid);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          setRole('Student');
          setProfile(studentSnap.data());
          setLoading(false);
          return;
        }

        // 4. Check PARENTS
        const parentRef = doc(firestore, 'parents', user.uid);
        const parentSnap = await getDoc(parentRef);
        if (parentSnap.exists()) {
          setRole('Parent');
          setProfile(parentSnap.data());
          setLoading(false);
          return;
        }

        console.warn("[RoleContext] No profile found in DB.");
        setRole(null);
      } catch (error) {
        console.error("[RoleContext] Error:", error);
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

// --- DEBUG ROLE GUARD ---
export function RoleGuard({ children, allowedRoles = [] }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { role, loading, refreshRole } = useRole();
  const auth = useAuth();
  const user = auth?.user;

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // 2. Success State
  // We map 'Administrator' and 'Director' to 'Admin' logic just in case
  const effectiveRole = (role === 'Administrator' || role === 'Director') ? 'Admin' : role;
  
  if (effectiveRole && allowedRoles.includes(effectiveRole)) {
    return <>{children}</>;
  }
  
  if (allowedRoles.includes('all')) {
    return <>{children}</>;
  }

  // 3. BLOCKED STATE (Debug View)
  // This replaces the "Blank Page" with useful info
  return (
    <div className="flex h-screen w-full items-center justify-center bg-red-50 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <ShieldAlert className="h-8 w-8" />
          <h1 className="text-xl font-bold">Access Denied</h1>
        </div>
        
        <div className="space-y-3 text-sm font-mono bg-slate-100 p-4 rounded mb-4">
          <p><strong>User ID:</strong> {user?.uid || "Not Logged In"}</p>
          <p><strong>Role Found:</strong> {role ? <span className="text-green-600">{role}</span> : <span className="text-red-600">NULL (No Profile)</span>}</p>
          <p><strong>Required Roles:</strong> {allowedRoles.join(', ')}</p>
        </div>

        <p className="text-slate-600 text-sm mb-4">
          Your account exists in Authentication, but the system cannot find a matching Profile Document in Firestore to verify your role.
        </p>

        <div className="flex gap-2">
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              Reload Page
            </Button>
            <Button onClick={refreshRole} className="w-full">
              Retry Check
            </Button>
        </div>
        
        {/* REPAIR BUTTON (Only shows if no role found) */}
        {!role && (
             <div className="mt-4 pt-4 border-t">
                 <p className="text-xs text-center text-slate-400 mb-2">Development Mode</p>
                 <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                    onClick={() => {
                        import('@/components/SystemRepair').then(mod => {
                            // We can't render the component easily here without complex state, 
                            // so we direct the user to the Login page where we put the repair tool
                            alert("Please go to the Login Page or Homepage to see the System Repair Tool.");
                            window.location.href = "/";
                        })
                    }}
                 >
                    <UserX className="h-4 w-4 mr-2"/>
                    Go to Repair Tool
                 </Button>
             </div>
        )}
      </div>
    </div>
  );
}
