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
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchool() {
      if (!user || !firestore) {
        if (!isUserLoading) {
          setLoading(false);
          setSchoolId(null);
        }
        return;
      }
      
      setLoading(true);
      try {
        const collectionsToTry = ['staff', 'users', 'students', 'parents'];
        for (const collectionName of collectionsToTry) {
          const docRef = doc(firestore, collectionName, user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().schoolId) {
            setSchoolId(docSnap.data().schoolId);
            setLoading(false);
            return;
          }
        }
        setSchoolId(null);
      } catch (error) {
        console.error("Failed to fetch school ID:", error);
        setSchoolId(null);
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
