'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { User } from 'firebase/auth';

type Role = 'Director' | 'Administrator' | 'Teacher' | 'Accountant' | 'Student' | 'Parent' | 'Librarian' | 'Cook' | 'Transport Staff' | null;

interface RoleContextType {
  role: Role;
  setRole: React.Dispatch<React.SetStateAction<Role>>;
  loading: boolean;
  profile: any;
  refreshRole: () => void;
}

const RoleContext = createContext<RoleContextType>({ role: null, setRole: () => {}, loading: true, profile: null, refreshRole: () => {} });

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  
  const [role, setRole] = useState<Role>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshRole = useCallback(() => setRefreshTrigger(prev => prev + 1), []);

  useEffect(() => {
    async function fetchRole(currentUser: User) {
      if (!firestore) return;

      setLoading(true);
      try {
        // Priority 1: STAFF (Director, Admin, Teacher, etc.)
        const staffRef = doc(firestore, 'staff', currentUser.uid);
        const staffSnap = await getDoc(staffRef);
        if (staffSnap.exists()) {
          const data = staffSnap.data();
          setRole(data.role as Role); 
          setProfile(data);
          return;
        }
        
        // Priority 2: STUDENTS
        const studentRef = doc(firestore, 'students', currentUser.uid);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          setRole('Student');
          setProfile(studentSnap.data());
          return;
        }

        // Priority 3: PARENTS
        const parentRef = doc(firestore, 'parents', currentUser.uid);
        const parentSnap = await getDoc(parentRef);
        if (parentSnap.exists()) {
          setRole('Parent');
          setProfile(parentSnap.data());
          return;
        }
        
        // Fallback: Check the generic 'users' collection for a role, if one exists
        // This is a safety net for your manual change.
        const userRef = doc(firestore, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
             const data = userSnap.data();
             if(data.role) {
                setRole(data.role as Role);
                setProfile(data); // Set profile with whatever data is here
                return;
             }
        }


        // Fallback if no profile found anywhere
        setRole(null);
        setProfile(null);

      } catch (error) {
        console.error("[RoleContext] Error:", error);
        setRole(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }

    if (isUserLoading) {
      setLoading(true);
    } else if (user) {
      fetchRole(user);
    } else {
      // No user is logged in
      setRole(null);
      setProfile(null);
      setLoading(false);
    }
  }, [user, isUserLoading, firestore, refreshTrigger]);

  return (
    <RoleContext.Provider value={{ role, setRole, loading, profile, refreshRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
