'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { doc, getDoc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
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
        if (currentUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL || currentUser.uid === SUPER_ADMIN_UID) {
          setRole('Director');
          let staffData: any = null;
          const staffRef = doc(firestore, 'staff', currentUser.uid);
          const staffSnap = await getDoc(staffRef);
          if (staffSnap.exists()) {
            staffData = staffSnap.data();
          } else if (currentUser.email) {
            try {
              const q = query(collection(firestore, 'staff'), where('email', '==', currentUser.email.toLowerCase()));
              const snap = await getDocs(q);
              if (!snap.empty) {
                staffData = snap.docs[0].data();
              }
            } catch (err) {
              console.warn("[RoleContext] Super Admin staff query by email failed:", err);
            }
          }

          const storedSchoolId = typeof window !== 'undefined'
            ? (localStorage.getItem('gam_school_id') || localStorage.getItem('selected_school_id'))
            : null;
          const finalSchoolId = staffData?.schoolId || storedSchoolId || 'oHr3BrGdK2eS5MQ5zmZU';

          setProfile({
            firstName: staffData?.firstName || 'Super',
            lastName: staffData?.lastName || 'Admin',
            email: currentUser.email,
            role: 'Director',
            schoolId: finalSchoolId,
            ...(staffData || {})
          });
          setLoading(false);
          return;
        }

        // --- 1. CHECK SPECIFIC COLLECTIONS FIRST (Detailed Profiles) ---
        
        // Try Staff by UID
        const staffRef = doc(firestore, 'staff', currentUser.uid);
        const staffSnap = await getDoc(staffRef);
        if (staffSnap.exists()) {
          const data = staffSnap.data();
          setRole(data.role as Role); 
          setProfile(data);
          if (data.role && data.schoolId) {
            setDoc(doc(firestore, 'users', currentUser.uid), {
              uid: currentUser.uid,
              role: data.role,
              schoolId: data.schoolId,
              email: currentUser.email?.toLowerCase(),
              firstName: data.firstName || '',
              lastName: data.lastName || '',
            }, { merge: true }).catch(() => {});
          }
          setLoading(false);
          return;
        }

        // Try Staff by Email fallback
        if (currentUser.email) {
          try {
            const staffEmailQ = query(collection(firestore, 'staff'), where('email', '==', currentUser.email.toLowerCase()));
            const staffEmailSnap = await getDocs(staffEmailQ);
            if (!staffEmailSnap.empty) {
              const staffDoc = staffEmailSnap.docs[0];
              const data = staffDoc.data();
              setRole(data.role as Role);
              setProfile(data);

              if (data.role && data.schoolId) {
                // 1. Sync to users/{currentUser.uid} so Firestore Security Rules (getUserRole(), getUserSchoolId())
                // recognize the staff member immediately on all school collection requests
                setDoc(doc(firestore, 'users', currentUser.uid), {
                  uid: currentUser.uid,
                  role: data.role,
                  schoolId: data.schoolId,
                  email: currentUser.email.toLowerCase(),
                  firstName: data.firstName || '',
                  lastName: data.lastName || '',
                  staffDocId: staffDoc.id,
                }, { merge: true }).catch((err) => {
                  console.warn("[RoleContext] Could not sync user record to users/uid:", err);
                });

                // 2. Also ensure staff/{currentUser.uid} exists if staff was originally created with an auto-ID
                if (staffDoc.id !== currentUser.uid) {
                  setDoc(doc(firestore, 'staff', currentUser.uid), {
                    ...data,
                    uid: currentUser.uid,
                    originalDocId: staffDoc.id,
                  }, { merge: true }).catch(() => {});
                }
              }

              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn("[RoleContext] Staff query by email failed:", e);
          }
        }

        // Try Students
        const studentRef = doc(firestore, 'students', currentUser.uid);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          setRole('Student');
          setProfile(studentSnap.data());
          setLoading(false);
          return;
        }

        // Try Parents (CRITICAL for studentIds)
        const parentRef = doc(firestore, 'parents', currentUser.uid);
        const parentSnap = await getDoc(parentRef);
        if (parentSnap.exists()) {
          setRole('Parent');
          setProfile(parentSnap.data());
          setLoading(false);
          return;
        }
        
        // --- 2. FALLBACK: USERS MAPPING ---
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

        // Try users collection by Email fallback
        if (currentUser.email) {
          try {
            const userEmailQ = query(collection(firestore, 'users'), where('email', '==', currentUser.email.toLowerCase()));
            const userEmailSnap = await getDocs(userEmailQ);
            if (!userEmailSnap.empty) {
              const data = userEmailSnap.docs[0].data();
              if (data.role) {
                setRole(data.role as Role);
                setProfile(data);
                if (data.schoolId) {
                  setDoc(doc(firestore, 'users', currentUser.uid), {
                    uid: currentUser.uid,
                    role: data.role,
                    schoolId: data.schoolId,
                    email: currentUser.email.toLowerCase(),
                  }, { merge: true }).catch(() => {});
                }
                setLoading(false);
                return;
              }
            }
          } catch (e) {
            console.warn("[RoleContext] User query by email failed:", e);
          }
        }

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
