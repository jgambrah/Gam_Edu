
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Role = 'Admin' | 'Teacher' | 'Student' | 'Parent' | 'Staff' | 'Director' | 'Administrator' | null;

interface RoleContextType {
  role: Role;
  loading: boolean;
  profile: any;
}

const RoleContext = createContext<RoleContextType>({ role: null, loading: true, profile: null });

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [role, setRole] = useState<Role>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      // 1. If not logged in, stop loading
      if (!user) {
        setRole(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // 2. If logged in but Firestore isn't ready yet, keep loading
      if (!firestore) {
        return; 
      }

      try {
        // --- PRIORITY 1: CHECK 'USERS' (Admin/Repair Tool Fix) ---
        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setRole(data.role as Role); 
          setProfile(data);
          setLoading(false);
          return;
        }

        // --- PRIORITY 2: CHECK 'STAFF' ---
        const staffRef = doc(firestore, 'staff', user.uid);
        const staffSnap = await getDoc(staffRef);
        if (staffSnap.exists()) {
          const data = staffSnap.data();
          setRole(data.role as Role);
          setProfile(data);
          setLoading(false);
          return;
        }

        // --- PRIORITY 3: CHECK 'STUDENTS' ---
        const studentRef = doc(firestore, 'students', user.uid);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          setRole('Student');
          setProfile(studentSnap.data());
          setLoading(false);
          return;
        }

        // --- PRIORITY 4: CHECK 'PARENTS' ---
        const parentRef = doc(firestore, 'parents', user.uid);
        const parentSnap = await getDoc(parentRef);
        if (parentSnap.exists()) {
          setRole('Parent');
          setProfile(parentSnap.data());
          setLoading(false);
          return;
        }

        // If no document found in any collection
        console.warn("User authenticated but no profile found.");
        setRole(null);
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [user, firestore]);

  return (
    <RoleContext.Provider value={{ role, loading, profile }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);

// --- RESTORED ROLEGUARD COMPONENT ---
// This was missing, causing your build error
export function RoleGuard({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { role, loading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!loading && role && !allowedRoles.includes(role)) {
      // Optional: Redirect unauthorized users
      // router.push('/dashboard'); 
    }
  }, [role, loading, allowedRoles, router]);

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

  // If strictly enforcing (return null), or just rendering children (for layout handling)
  // Here we return null if role doesn't match, acting as a true Guard
  if (!role || !allowedRoles.includes(role)) {
    return null; 
  }

  return <>{children}</>;
}
