
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function useCurrentSchool() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchool() {
      if (!user || !firestore) return;
      try {
        // 1. Check Staff Collection (Most common)
        const staffDoc = await getDoc(doc(firestore, 'staff', user.uid));
        if (staffDoc.exists() && staffDoc.data().schoolId) {
            setSchoolId(staffDoc.data().schoolId);
            setLoading(false);
            return;
        }

        // 2. Check Users Collection (Fallback for CEO/SuperAdmin)
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().schoolId) {
            setSchoolId(userDoc.data().schoolId);
        }
      } catch (error) {
        console.error("Failed to fetch school ID", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSchool();
  }, [user, firestore]);

  return { schoolId, loading };
}
