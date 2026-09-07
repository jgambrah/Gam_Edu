'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

type Role = 'Director' | 'Administrator' | 'Teacher' | 'Accountant' | 'Student' | 'Parent' | 'Librarian' | 'Cook' | 'Transport Staff' | 'Cleaner' | 'Security Officer' | 'Secretary' | 'Receptionist' | null;

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
  
  const [role, setRole] = useState<Role>(() => {
    if (typeof window !== 'undefined') {
      try {
        const lastUid = localStorage.getItem('gam_last_uid');
        if (lastUid) return (localStorage.getItem(`gam_role_${lastUid}`) as Role) || null;
      } catch {}
    }
    return null;
  });

  const [profile, setProfile] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const lastUid = localStorage.getItem('gam_last_uid');
        if (lastUid) {
          const raw = localStorage.getItem(`gam_profile_${lastUid}`);
          if (raw) return JSON.parse(raw);
        }
      } catch {}
    }
    return null;
  });

  const [loading, setLoading] = useState(() => {
    // If we already have a cached role from previous session, don't block the screen
    if (typeof window !== 'undefined') {
      try {
        const lastUid = localStorage.getItem('gam_last_uid');
        if (lastUid && localStorage.getItem(`gam_role_${lastUid}`)) return false;
      } catch {}
    }
    return true;
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshRole = useCallback(() => setRefreshTrigger(prev => prev + 1), []);

  useEffect(() => {
    async function fetchRole(currentUser: User) {
      if (!firestore) return;

      // Remember active user ID for instant local cache retrieval
      try {
        localStorage.setItem('gam_last_uid', currentUser.uid);
      } catch {}

      // Fast-path: Check cached role in localStorage for instant 0ms unblocking
      try {
        const cachedRole = localStorage.getItem(`gam_role_${currentUser.uid}`) as Role;
        const cachedProfileRaw = localStorage.getItem(`gam_profile_${currentUser.uid}`);
        if (cachedRole) {
          setRole(cachedRole);
          if (cachedProfileRaw) setProfile(JSON.parse(cachedProfileRaw));
          setLoading(false);
        }
      } catch {}

      try {
        // --- 0. SUPER ADMIN CHECK ---
        if (currentUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL || currentUser.uid === SUPER_ADMIN_UID) {
          const resolvedRole: Role = 'Director';
          setRole(resolvedRole);
          const staffRef = doc(firestore, 'staff', currentUser.uid);
          const staffSnap = await getDoc(staffRef);
          const resolvedProfile = staffSnap.exists() ? staffSnap.data() : { firstName: 'Super', lastName: 'Admin', role: 'Director' };
          setProfile(resolvedProfile);
          setLoading(false);
          try {
            localStorage.setItem(`gam_role_${currentUser.uid}`, resolvedRole);
            localStorage.setItem(`gam_profile_${currentUser.uid}`, JSON.stringify(resolvedProfile));
          } catch {}
          return;
        }

        // --- 1. PARALLELIZED CANDIDATE LOOKUPS (Replaces 4 sequential network waterfalls) ---
        const staffRef = doc(firestore, 'staff', currentUser.uid);
        const studentRef = doc(firestore, 'students', currentUser.uid);
        const parentRef = doc(firestore, 'parents', currentUser.uid);
        const userRef = doc(firestore, 'users', currentUser.uid);

        const [staffSnap, studentSnap, parentSnap, userSnap] = await Promise.all([
          getDoc(staffRef).catch(() => null),
          getDoc(studentRef).catch(() => null),
          getDoc(parentRef).catch(() => null),
          getDoc(userRef).catch(() => null)
        ]);

        let resolvedRole: Role = null;
        let resolvedProfile: any = null;

        if (staffSnap && staffSnap.exists()) {
          const data = staffSnap.data();
          resolvedRole = data.role as Role;
          resolvedProfile = data;
        } else if (studentSnap && studentSnap.exists()) {
          resolvedRole = 'Student';
          resolvedProfile = studentSnap.data();
        } else if (parentSnap && parentSnap.exists()) {
          resolvedRole = 'Parent';
          resolvedProfile = parentSnap.data();
        } else if (userSnap && userSnap.exists()) {
          const data = userSnap.data();
          if (data.role) {
            resolvedRole = data.role as Role;
            resolvedProfile = data;
          }
        }

        setRole(resolvedRole);
        setProfile(resolvedProfile);

        if (resolvedRole) {
          try {
            localStorage.setItem(`gam_role_${currentUser.uid}`, resolvedRole);
            if (resolvedProfile) {
              localStorage.setItem(`gam_profile_${currentUser.uid}`, JSON.stringify(resolvedProfile));
            }
          } catch {}
        }

      } catch (error) {
        console.error("[RoleContext] Error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isUserLoading) {
      // If we already have a cached role, don't show full-page loading spinner
      if (!role) setLoading(true);
    } else if (user) {
      fetchRole(user);
    } else {
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
