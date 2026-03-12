'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
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

// Hardcoded Super Admin / CEO Identities
const SUPER_ADMIN_EMAIL = 'jamesgambrah@gmail.com';
const SUPER_ADMIN_UID = 'L4oE5XWweKRYrhtIXn6hB8IDHBC2';

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
        // --- 0. SUPER ADMIN CHECK ---
        // If this is the CEO, assign Director role immediately to prevent "No Role"
        if (currentUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL || currentUser.uid === SUPER_ADMIN_UID) {
          setRole('Director');
          // Try to get a profile but don't fail if missing
          const staffRef = doc(firestore, 'staff', currentUser.uid);
          const staffSnap = await getDoc(staffRef);
          if (staffSnap.exists()) {
            setProfile(staffSnap.data());
          } else {
            setProfile({ firstName: 'Super', lastName: 'Admin', role: 'Director' });
          }
          setLoading(false);
          return;
        }

        // --- 1. PRIMARY: STAFF COLLECTION ---
        const staffRef = doc(firestore, 'staff', currentUser.uid);
        const staffSnap = await getDoc(staffRef);
        if (staffSnap.exists()) {
          const data = staffSnap.data();
          setRole(data.role as Role); 
          setProfile(data);
          setLoading(false);
          return;
        }
        
        // --- 2. SECONDARY: USERS MAPPING (FAST LOOKUP) ---
        // Check central user mapping if specific staff record is missing
        const userRef = doc(firestore, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
             const data = userSnap.data();
             if(data.role) {
                setRole(data.role as Role);
                setProfile(data);
                setLoading(false);
                return;
             }
        }

        // --- 3. TERTIARY: STUDENTS ---
        const studentRef = doc(firestore, 'students', currentUser.uid);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          setRole('Student');
          setProfile(studentSnap.data());
          setLoading(false);
          return;
        }

        // --- 4. QUATERNARY: PARENTS ---
        const parentRef = doc(firestore, 'parents', currentUser.uid);
        const parentSnap = await getDoc(parentRef);
        if (parentSnap.exists()) {
          setRole('Parent');
          setProfile(parentSnap.data());
          setLoading(false);
          return;
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
