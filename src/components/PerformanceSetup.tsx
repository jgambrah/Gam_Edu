
'use client';

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, Database } from 'lucide-react';

export default function PerformanceSetup() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);

  const setupData = async () => {
    if (!user || !firestore) return;
    setLoading(true);
    try {
      // Create a dummy review to initialize the collection
      // This ensures the 'performanceReviews' path exists for the Rules to protect
      await addDoc(collection(firestore, 'performanceReviews'), {
        staffId: user.uid, // Assign to YOU so you can definitely read it
        reviewerId: user.uid,
        rating: 5,
        strengths: "System Initialization",
        reviewDate: serverTimestamp(),
        isSystemTest: true
      });

      alert("✅ Collection Initialized! \n\nIf you have created the Index in Firebase Console, the error should disappear.");
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
      <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-2">
        <Database className="h-4 w-4"/> Performance DB Setup
      </h3>
      <Button onClick={setupData} disabled={loading} className="bg-blue-600 hover:bg-blue-700 w-full">
        {loading ? <Loader2 className="animate-spin mr-2"/> : null}
        Initialize Collection
      </Button>
    </div>
  );
}
