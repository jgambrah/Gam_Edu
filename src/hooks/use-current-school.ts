'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';

const SUPER_ADMIN_EMAIL = 'jamesgambrah@gmail.com';
const SUPER_ADMIN_UID = 'L4oE5XWweKRYrhtIXn6hB8IDHBC2';
const DEFAULT_FALLBACK_SCHOOL_ID = 'oHr3BrGdK2eS5MQ5zmZU'; // Mercy's Springfield Academy

/**
 * Hook to retrieve and manage the current school ID for the authenticated user.
 * Features:
 * 1. Immediate local-storage retrieval to prevent layout flashing
 * 2. Multi-tier resolution (doc UID, user email query, Super Admin fallback, primary school fallback)
 * 3. Cross-tab and in-memory synchronization via window events
 */
export function useCurrentSchool() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const [schoolId, setSchoolIdState] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('gam_school_id') || localStorage.getItem('selected_school_id') || null;
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Synchronized setter that broadcasts changes
  const setSchoolId = useCallback((newId: string | null) => {
    if (typeof window !== 'undefined') {
      if (newId) {
        localStorage.setItem('gam_school_id', newId);
        localStorage.setItem('selected_school_id', newId);
      } else {
        localStorage.removeItem('gam_school_id');
        localStorage.removeItem('selected_school_id');
      }
      window.dispatchEvent(new CustomEvent('gam_school_change', { detail: { schoolId: newId } }));
    }
    setSchoolIdState(newId);
  }, []);

  // Listen to cross-component school switches
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCustomChange = (e: any) => {
      if (e.detail?.schoolId !== undefined) {
        setSchoolIdState(e.detail.schoolId);
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gam_school_id' || e.key === 'selected_school_id') {
        setSchoolIdState(e.newValue || null);
      }
    };

    window.addEventListener('gam_school_change', handleCustomChange);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('gam_school_change', handleCustomChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    async function fetchSchool() {
      if (!user || !firestore) {
        if (!isUserLoading) {
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      try {
        const isSuperAdmin =
          user.email?.toLowerCase() === SUPER_ADMIN_EMAIL ||
          user.uid === SUPER_ADMIN_UID;

        // 1. If stored schoolId is already valid in localStorage, keep it
        const stored = typeof window !== 'undefined'
          ? (localStorage.getItem('gam_school_id') || localStorage.getItem('selected_school_id'))
          : null;

        if (stored) {
          setSchoolIdState(stored);
          setLoading(false);
          // If super admin has stored school, that's their selected campus
          if (isSuperAdmin) return;
        }

        // 2. Direct UID lookup across key user profile collections
        const collectionsToTry = ['staff', 'users', 'students', 'parents'];
        for (const collectionName of collectionsToTry) {
          const docRef = doc(firestore, collectionName, user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().schoolId) {
            const foundId = docSnap.data().schoolId;
            setSchoolId(foundId);
            setLoading(false);
            return;
          }
        }

        // 3. Fallback lookup by Email in staff / users (handles auto-generated Firestore doc IDs)
        if (user.email) {
          for (const collectionName of ['staff', 'users']) {
            try {
              const q = query(
                collection(firestore, collectionName),
                where('email', '==', user.email.toLowerCase()),
                limit(1)
              );
              const snap = await getDocs(q);
              if (!snap.empty && snap.docs[0].data().schoolId) {
                const foundId = snap.docs[0].data().schoolId;
                setSchoolId(foundId);
                setLoading(false);
                return;
              }
            } catch (err) {
              console.warn(`[useCurrentSchool] Email query on ${collectionName} failed:`, err);
            }
          }
        }

        // 4. If Super Admin or no school resolved, find default primary school
        if (isSuperAdmin || !stored) {
          try {
            const schoolsQ = query(collection(firestore, 'schools'), limit(1));
            const schoolsSnap = await getDocs(schoolsQ);
            if (!schoolsSnap.empty) {
              const primaryId = schoolsSnap.docs[0].id;
              setSchoolId(primaryId);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.warn("[useCurrentSchool] Schools query fallback failed:", err);
          }

          // Hardcoded fallback primary school ID
          setSchoolId(DEFAULT_FALLBACK_SCHOOL_ID);
          setLoading(false);
          return;
        }

        // Retain current state if already set
        if (!schoolId && stored) {
          setSchoolIdState(stored);
        }
      } catch (error) {
        console.error("[useCurrentSchool] Failed to resolve school ID:", error);
        // Fallback gracefully so user is never locked out of financial views
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('gam_school_id') || localStorage.getItem('selected_school_id');
          setSchoolIdState(stored || DEFAULT_FALLBACK_SCHOOL_ID);
        } else {
          setSchoolIdState(DEFAULT_FALLBACK_SCHOOL_ID);
        }
      } finally {
        setLoading(false);
      }
    }

    if (!isUserLoading) {
      fetchSchool();
    }
  }, [user, isUserLoading, firestore, setSchoolId]);

  return { schoolId, setSchoolId, loading };
}

export default useCurrentSchool;
