
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
  // FIX: Don't destructure immediately. useAuth() might be null during SSR or Init.
  const auth = useAuth();
  const user = auth?.user; 
  
  const firestore = useFirestore();
  const [role, setRole] = useState<Role>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      // 1. If auth system isn't ready yet, keep loading
      if (!auth) {
        return; 
      }

      // 2. If auth is ready but no user is logged in
      if (!user) {
        setRole(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // 3. If logged in but Firestore isn't ready
      if (!firestore) {
        return; 
      }

      try {
        // --- PRIORITY 1: CHECK 'USERS' (Admin Fix) ---
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

        // Found user in Auth but not in DB
        console.warn("User authenticated but no profile found.");
        setRole(null);
      } catch (error) {
        console.error("Error fetching role:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [auth, user, firestore]); // Dependencies updated

  return (
    <RoleContext.Provider value={{ role, loading, profile }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);

// --- ROLE GUARD COMPONENT ---
export function RoleGuard({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { role, loading } = useRole();
  const router = useRouter();

  useEffect(() => {
    // Optional: Add redirect logic here if needed
    // if (!loading && role && !allowedRoles.includes(role)) {
    //   router.push('/dashboard'); 
    // }
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

  // Hide content if role doesn't match
  if (!role || !allowedRoles.includes(role)) {
    return null; 
  }

  return <>{children}</>;
}
