
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
      
      setLoading(true);
      try {
        // Strategy: Check collections in order of likelihood based on typical roles
        // 1. Check 'users' (The centralized place - if you updated your create-user action)
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().schoolId) {
            setSchoolId(userDoc.data().schoolId);
            setLoading(false);
            return;
        }

        // 2. Check 'staff'
        const staffDoc = await getDoc(doc(firestore, 'staff', user.uid));
        if (staffDoc.exists() && staffDoc.data().schoolId) {
            setSchoolId(staffDoc.data().schoolId);
            setLoading(false);
            return;
        }

        // 3. Check 'students'
        const studentDoc = await getDoc(doc(firestore, 'students', user.uid));
        if (studentDoc.exists() && studentDoc.data().schoolId) {
            setSchoolId(studentDoc.data().schoolId);
            setLoading(false);
            return;
        }

        // 4. Check 'parents'
        const parentDoc = await getDoc(doc(firestore, 'parents', user.uid));
        if (parentDoc.exists() && parentDoc.data().schoolId) {
            setSchoolId(parentDoc.data().schoolId);
            setLoading(false);
            return;
        }

        console.warn("No School ID found for this user.");
        setSchoolId(null);

      } catch (error) {
        console.error("Failed to fetch school ID", error);
        setSchoolId(null);
      } finally {
        setLoading(false);
      }
    }

    fetchSchool();
  }, [user, firestore]);

  return { schoolId, loading };
}
