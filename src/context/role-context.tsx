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

// Hardcoded Super Admin / CEO Identities & School Owners
const SUPER_ADMIN_EMAIL = 'jamesgambrah@gmail.com';
const SUPER_ADMIN_UID = 'L4oE5XWweKRYrhtIXn6hB8IDHBC2';
const MERCY_ADMIN_EMAIL = 'atampokaadongo@gmail.com';
const MERCY_ADMIN_UID = '7GVi5qCxC4YDnjKkjVwSjAYtQz73';
const MERCY_SCHOOL_ID = 'oHr3BrGdK2eS5MQ5zmZU';

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  
  // Initialize from sessionStorage to prevent any flash of unauthenticated or restricted state on navigation
  const [role, setRole] = useState<Role>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('gam_cached_role');
        return cached ? (cached as Role) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [profile, setProfile] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem('gam_cached_profile');
        return cached ? JSON.parse(cached) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshRole = useCallback(() => setRefreshTrigger(prev => prev + 1), []);

  useEffect(() => {
    let isCancelled = false;

    async function fetchRole(currentUser: User, attempt = 1): Promise<void> {
      if (!firestore) return;

      // Keep loading indicator true while actively verifying
      setLoading(true);

      try {
        // --- FAST-PATH 0: Check Custom Claims on currentUser token ---
        try {
          const tokenResult = await currentUser.getIdTokenResult();
          const claimRole = tokenResult?.claims?.role as Role;
          if (claimRole && !isCancelled) {
            setRole(claimRole);
            try {
              sessionStorage.setItem('gam_cached_role', claimRole);
            } catch {}
          }
        } catch {
          // Token claims check is optional
        }

        // --- 0. SUPER ADMIN / SCHOOL OWNER CHECK ---
        const isSuperAdminUser = currentUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL || currentUser.uid === SUPER_ADMIN_UID;
        const isMercyAdminUser = currentUser.email?.toLowerCase() === MERCY_ADMIN_EMAIL || currentUser.uid === MERCY_ADMIN_UID;

        if (isSuperAdminUser || isMercyAdminUser) {
          if (isCancelled) return;
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
              console.warn("[RoleContext] Staff query by email failed:", err);
            }
          }

          const storedSchoolId = typeof window !== 'undefined'
            ? (localStorage.getItem('gam_school_id') || localStorage.getItem('selected_school_id'))
            : null;
          const finalSchoolId = isMercyAdminUser ? MERCY_SCHOOL_ID : (staffData?.schoolId || storedSchoolId || 'oHr3BrGdK2eS5MQ5zmZU');

          // Ensure users/{uid} and staff/{uid} exist in Firestore so security rules and backend recognize the admin immediately
          try {
            await setDoc(doc(firestore, 'users', currentUser.uid), {
              uid: currentUser.uid,
              role: 'Director',
              schoolId: finalSchoolId,
              email: currentUser.email?.toLowerCase() || '',
              firstName: staffData?.firstName || (isMercyAdminUser ? 'Mercy' : 'Super'),
              lastName: staffData?.lastName || (isMercyAdminUser ? 'Atampoka Adongo' : 'Admin'),
            }, { merge: true });

            await setDoc(doc(firestore, 'staff', currentUser.uid), {
              uid: currentUser.uid,
              role: 'Director',
              schoolId: finalSchoolId,
              email: currentUser.email?.toLowerCase() || '',
              firstName: staffData?.firstName || (isMercyAdminUser ? 'Mercy' : 'Super'),
              lastName: staffData?.lastName || (isMercyAdminUser ? 'Atampoka Adongo' : 'Admin'),
              isActive: true,
              ...(staffData || {})
            }, { merge: true });
          } catch (syncErr) {
            console.warn("[RoleContext] Admin record sync warning:", syncErr);
          }

          const directorProfile = {
            firstName: staffData?.firstName || (isMercyAdminUser ? 'Mercy' : 'Super'),
            lastName: staffData?.lastName || (isMercyAdminUser ? 'Atampoka Adongo' : 'Admin'),
            email: currentUser.email,
            role: 'Director',
            schoolId: finalSchoolId,
            ...(staffData || {})
          };

          if (!isCancelled) {
            setProfile(directorProfile);
            try {
              sessionStorage.setItem('gam_cached_role', 'Director');
              sessionStorage.setItem('gam_cached_profile', JSON.stringify(directorProfile));
            } catch {}
            setLoading(false);
          }
          return;
        }

        // --- 1. DIRECT DOCUMENT FETCHES (Fastest, O(1), immune to collection query rules) ---

        // A. Check users/{currentUser.uid}
        const userRef = doc(firestore, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data?.role) {
            if (isCancelled) return;
            setRole(data.role as Role);
            setProfile(data);
            try {
              sessionStorage.setItem('gam_cached_role', data.role);
              sessionStorage.setItem('gam_cached_profile', JSON.stringify(data));
            } catch {}
            setLoading(false);
            return;
          }
        }

        // B. Check staff/{currentUser.uid}
        const staffRef = doc(firestore, 'staff', currentUser.uid);
        const staffSnap = await getDoc(staffRef);
        if (staffSnap.exists()) {
          const data = staffSnap.data();
          if (isCancelled) return;
          setRole(data.role as Role); 
          setProfile(data);
          try {
            sessionStorage.setItem('gam_cached_role', data.role);
            sessionStorage.setItem('gam_cached_profile', JSON.stringify(data));
          } catch {}

          if (data.role && data.schoolId) {
            try {
              await setDoc(doc(firestore, 'users', currentUser.uid), {
                uid: currentUser.uid,
                role: data.role,
                schoolId: data.schoolId,
                email: currentUser.email?.toLowerCase(),
                firstName: data.firstName || '',
                lastName: data.lastName || '',
              }, { merge: true });
            } catch (err) {
              console.warn("[RoleContext] User sync warning:", err);
            }
          }
          setLoading(false);
          return;
        }

        // C. Check students/{currentUser.uid}
        const studentRef = doc(firestore, 'students', currentUser.uid);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          if (isCancelled) return;
          setRole('Student');
          setProfile(studentSnap.data());
          try {
            sessionStorage.setItem('gam_cached_role', 'Student');
            sessionStorage.setItem('gam_cached_profile', JSON.stringify(studentSnap.data()));
          } catch {}
          setLoading(false);
          return;
        }

        // D. Check parents/{currentUser.uid}
        const parentRef = doc(firestore, 'parents', currentUser.uid);
        const parentSnap = await getDoc(parentRef);
        if (parentSnap.exists()) {
          if (isCancelled) return;
          setRole('Parent');
          setProfile(parentSnap.data());
          try {
            sessionStorage.setItem('gam_cached_role', 'Parent');
            sessionStorage.setItem('gam_cached_profile', JSON.stringify(parentSnap.data()));
          } catch {}
          setLoading(false);
          return;
        }

        // --- 2. FALLBACK QUERIES BY EMAIL (For accounts linked by email address) ---
        if (currentUser.email) {
          const cleanEmail = currentUser.email.toLowerCase().trim();

          // Try Staff by Email fallback
          try {
            const staffEmailQ = query(collection(firestore, 'staff'), where('email', '==', cleanEmail));
            const staffEmailSnap = await getDocs(staffEmailQ);
            if (!staffEmailSnap.empty) {
              const staffDoc = staffEmailSnap.docs[0];
              const data = staffDoc.data();
              if (isCancelled) return;
              setRole(data.role as Role);
              setProfile(data);
              try {
                sessionStorage.setItem('gam_cached_role', data.role);
                sessionStorage.setItem('gam_cached_profile', JSON.stringify(data));
              } catch {}

              if (data.role && data.schoolId) {
                try {
                  await setDoc(doc(firestore, 'users', currentUser.uid), {
                    uid: currentUser.uid,
                    role: data.role,
                    schoolId: data.schoolId,
                    email: cleanEmail,
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    staffDocId: staffDoc.id,
                  }, { merge: true });

                  if (staffDoc.id !== currentUser.uid) {
                    await setDoc(doc(firestore, 'staff', currentUser.uid), {
                      ...data,
                      uid: currentUser.uid,
                      originalDocId: staffDoc.id,
                    }, { merge: true });
                  }
                } catch (err) {
                  console.warn("[RoleContext] Could not sync user record to users/uid:", err);
                }
              }

              setLoading(false);
              return;
            }
          } catch (e) {
            console.warn("[RoleContext] Staff query by email failed:", e);
          }

          // Try users collection by Email fallback
          try {
            const userEmailQ = query(collection(firestore, 'users'), where('email', '==', cleanEmail));
            const userEmailSnap = await getDocs(userEmailQ);
            if (!userEmailSnap.empty) {
              const data = userEmailSnap.docs[0].data();
              if (data.role) {
                if (isCancelled) return;
                setRole(data.role as Role);
                setProfile(data);
                try {
                  sessionStorage.setItem('gam_cached_role', data.role);
                  sessionStorage.setItem('gam_cached_profile', JSON.stringify(data));
                } catch {}

                if (data.schoolId) {
                  setDoc(doc(firestore, 'users', currentUser.uid), {
                    uid: currentUser.uid,
                    role: data.role,
                    schoolId: data.schoolId,
                    email: cleanEmail,
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

        // --- RETRY RESILIENCE ---
        // If no role was found on this attempt, allow up to 3 retry attempts with exponential delay
        // to give Firestore authentication token binding enough time to synchronize on initial login.
        if (attempt < 3 && !isCancelled) {
          const delayMs = attempt * 400;
          console.info(`[RoleContext] Verification attempt ${attempt} pending. Retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          return fetchRole(currentUser, attempt + 1);
        }

        if (!isCancelled) {
          setRole(null);
          setProfile(null);
        }

      } catch (error) {
        console.error(`[RoleContext] Error on attempt ${attempt}:`, error);
        if (attempt < 3 && !isCancelled) {
          const delayMs = attempt * 400;
          await new Promise(resolve => setTimeout(resolve, delayMs));
          return fetchRole(currentUser, attempt + 1);
        }
        if (!isCancelled) {
          setRole(null);
          setProfile(null);
        }
      } finally {
        if (attempt >= 3 && !isCancelled) {
          setLoading(false);
        }
      }
    }

    if (isUserLoading) {
      setLoading(true);
    } else if (user) {
      fetchRole(user);
    } else {
      try {
        sessionStorage.removeItem('gam_cached_role');
        sessionStorage.removeItem('gam_cached_profile');
      } catch {}
      setRole(null);
      setProfile(null);
      setLoading(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [user, isUserLoading, firestore, refreshTrigger]);

  return (
    <RoleContext.Provider value={{ role, setRole, loading, profile, refreshRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => useContext(RoleContext);
