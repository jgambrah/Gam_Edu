
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import SystemRepair from '@/components/SystemRepair'; 
import { User } from 'firebase/auth';

type Role = 'Admin' | 'Teacher' | 'Student' | 'Parent' | 'Staff' | 'Director' | 'Administrator' | 'Accountant' | 'Librarian' | 'Transport Staff' | null;

interface RoleContextType {
  role: Role;
  loading: boolean;
  profile: any;
  refreshRole: () => void;
}

const RoleContext = createContext<RoleContextType>({ role: null, loading: true, profile: null, refreshRole: () => {} });

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const firestore = useFirestore();
  
  const [role, setRole] = useState<Role>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshRole = () => setRefreshTrigger(prev => prev + 1);

  useEffect(() => {
    async function fetchRole() {
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

        // PRIORITY 1: STAFF (Teachers, Accountants, etc.)
        const staffRef = doc(firestore, 'staff', user.uid);
        const staffSnap = await getDoc(staffRef);
        if (staffSnap.exists()) {
          const data = staffSnap.data();
          console.log(`Found in STAFF: ${data.role}`);
          setRole(data.role as Role); 
          setProfile(data);
          setLoading(false);
          return;
        }
        
        // PRIORITY 2: STUDENTS 
        const studentRef = doc(firestore, 'students', user.uid);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          console.log("Found in STUDENTS");
          setRole('Student');
          setProfile(studentSnap.data());
          setLoading(false);
          return;
        }

        // PRIORITY 3: PARENTS
        const parentRef = doc(firestore, 'parents', user.uid);
        const parentSnap = await getDoc(parentRef);
        if (parentSnap.exists()) {
          console.log("Found in PARENTS");
          setRole('Parent');
          setProfile(parentSnap.data());
          setLoading(false);
          return;
        }

        console.warn("[RoleContext] No primary profile found by ID. Querying collections...");

        // --- FALLBACK QUERIES (if ID-based lookup fails) ---
        
        // Query Students collection
        const studentQuery = query(collection(firestore, 'students'), where('uid', '==', user.uid));
        const studentQuerySnap = await getDocs(studentQuery);
        if (!studentQuerySnap.empty) {
            const studentDoc = studentQuerySnap.docs[0];
            console.log("Found in STUDENTS via query");
            setRole('Student');
            setProfile(studentDoc.data());
            setLoading(false);
            return;
        }

        // Query Parents collection
        const parentQuery = query(collection(firestore, 'parents'), where('uid', '==', user.uid));
        const parentQuerySnap = await getDocs(parentQuery);
        if (!parentQuerySnap.empty) {
            const parentDoc = parentQuerySnap.docs[0];
            console.log("Found in PARENTS via query");
            setRole('Parent');
            setProfile(parentDoc.data());
            setLoading(false);
            return;
        }
        
        // No profile found in any collection
        console.warn("[RoleContext] No profile found in any collection after query.");
        setRole(null);
        setProfile(null); // Explicitly clear profile if no role found

      } catch (error) {
        console.error("[RoleContext] Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [user, firestore, refreshTrigger]);

  return (
    <RoleContext.Provider value={{ role, loading, profile, refreshRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);

// --- ROLE GUARD ---
export function RoleGuard({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { role, loading, refreshRole } = useRole();
  const { user } = useUser();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Button onClick={() => router.push('/')}>Go to Login</Button>
        </div>
    );
  }

  const effectiveRole = (role === 'Administrator' || role === 'Director') ? 'Admin' : role;
  
  if (role && (allowedRoles.includes('all') || allowedRoles.includes(role) || (effectiveRole === 'Admin' && allowedRoles.includes('Admin')))) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-red-50 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 border border-red-200">
        <div className="flex items-center gap-2 text-red-600 mb-4">
          <ShieldAlert className="h-8 w-8" />
          <h1 className="text-xl font-bold">{!role ? "Profile Not Found" : "Access Denied"}</h1>
        </div>
        
        <div className="space-y-2 text-sm text-slate-600 mb-4">
            <p><strong>Your Role:</strong> {role || "None Detected"}</p>
            {!role ? (
              <p>You are authenticated as <strong>{user.email}</strong>, but we could not find a corresponding profile in the database.</p>
            ) : (
              <p>Your role does not have permission to view this page.</p>
            )}
        </div>

        {!role && (
            <div className="mb-4">
                <p className="text-xs font-bold text-orange-600 mb-2">ADMIN RECOVERY TOOL:</p>
                <SystemRepair onRepair={refreshRole} />
            </div>
        )}

        <div className="flex gap-2 mt-4">
            <Button onClick={() => auth.signOut()} variant="outline" className="w-full">
                Back to Login
            </Button>
            {role && (
                <Button onClick={() => router.push('/dashboard')} className="w-full">
                    Go to My Dashboard
                </Button>
            )}
        </div>
      </div>
    </div>
  );
}
