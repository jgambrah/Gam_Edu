
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

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
      if (!user || !firestore) {
        setRole(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        // We check collections in order of priority
        
        // 1. Check USERS (This is where the Repair Tool put you!)
        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          // Map "Admin" to the role state
          setRole(data.role as Role); 
          setProfile(data);
          setLoading(false);
          return;
        }

        // 2. Check STAFF
        const staffRef = doc(firestore, 'staff', user.uid);
        const staffSnap = await getDoc(staffRef);
        if (staffSnap.exists()) {
          const data = staffSnap.data();
          setRole(data.role as Role); // e.g. "Teacher", "Accountant"
          setProfile(data);
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

        console.warn("User authenticated but no profile found in users, staff, students, or parents.");
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
