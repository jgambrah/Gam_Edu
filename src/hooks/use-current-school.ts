'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Hook to retrieve the current school ID for the authenticated user.
 * It checks staff, users, students, and parents collections.
 */
export function useCurrentSchool() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  
  const [schoolId, setSchoolId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const lastUid = localStorage.getItem('gam_last_uid');
        if (lastUid) return localStorage.getItem(`gam_school_id_${lastUid}`) || null;
      } catch {}
    }
    return null;
  });

  const [loading, setLoading] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const lastUid = localStorage.getItem('gam_last_uid');
        if (lastUid && localStorage.getItem(`gam_school_id_${lastUid}`)) return false;
      } catch {}
    }
    return true;
  });

  useEffect(() => {
    async function fetchSchool() {
      if (!user || !firestore) {
        if (!isUserLoading) {
          setLoading(false);
          setSchoolId(null);
        }
        return;
      }

      // Fast-path: Synchronously check cached school ID
      try {
        const cachedSchoolId = localStorage.getItem(`gam_school_id_${user.uid}`);
        if (cachedSchoolId) {
          setSchoolId(cachedSchoolId);
          setLoading(false);
        }
      } catch {}

      try {
        // Parallel queries across candidate collections
        const [staffSnap, userSnap, studentSnap, parentSnap] = await Promise.all([
          getDoc(doc(firestore, 'staff', user.uid)).catch(() => null),
          getDoc(doc(firestore, 'users', user.uid)).catch(() => null),
          getDoc(doc(firestore, 'students', user.uid)).catch(() => null),
          getDoc(doc(firestore, 'parents', user.uid)).catch(() => null)
        ]);

        const candidateSnaps = [staffSnap, userSnap, studentSnap, parentSnap];
        let resolvedSchoolId: string | null = null;

        for (const snap of candidateSnaps) {
          if (snap && snap.exists()) {
            const data = snap.data();
            if (data?.schoolId) {
              resolvedSchoolId = data.schoolId;
              break;
            }
          }
        }

        setSchoolId(resolvedSchoolId);
        if (resolvedSchoolId) {
          try {
            localStorage.setItem(`gam_school_id_${user.uid}`, resolvedSchoolId);
          } catch {}
        }
      } catch (error) {
        console.error("Failed to fetch school ID:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (!isUserLoading) {
      fetchSchool();
    }
  }, [user, isUserLoading, firestore]);

  return { schoolId, loading };
}

export default useCurrentSchool;
