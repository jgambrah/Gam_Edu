
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase'; // Use useUser instead of useAuth
import { doc, getDoc } from 'firebase/firestore';

export function useCurrentSchool() {
  const { user, isUserLoading } = useUser(); // Get user and its loading state
  const firestore = useFirestore();
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchool() {
      // Don't proceed until we have a user and firestore instance
      if (!user || !firestore) {
        // If auth is done but there's no user, we can stop loading.
        if (!isUserLoading) {
            setLoading(false);
            setSchoolId(null);
        }
        return;
      }
      
      setLoading(true);
      try {
        // Strategy: Check collections in order of likelihood
        const collectionsToTry = ['staff', 'users', 'students', 'parents'];
        for (const collectionName of collectionsToTry) {
            const docRef = doc(firestore, collectionName, user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().schoolId) {
                const fetchedId = docSnap.data().schoolId;
                if (fetchedId !== schoolId) {
                    setSchoolId(fetchedId);
                }
                setLoading(false);
                return; // Found it, exit the loop and function
            }
        }

        // If loop finishes and nothing is found
        console.warn("No School ID found for this user across all collections.");
        if (schoolId !== null) {
            setSchoolId(null);
        }

      } catch (error) {
        console.error("Failed to fetch school ID", error);
        setSchoolId(null);
      } finally {
        setLoading(false);
      }
    }
    
    // Only run the fetch logic when Firebase auth is no longer loading.
    if (!isUserLoading) {
        fetchSchool();
    }

  }, [user, isUserLoading, firestore, schoolId]); // Added schoolId to dependency array

  return { schoolId, loading };
}
