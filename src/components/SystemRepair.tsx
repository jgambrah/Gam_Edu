
'use client';

import { useState } from 'react';
import { useAuth, useFirestore } from '@/firebase'; // Adjust path to your firebase config
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, Wrench } from 'lucide-react';

export default function SystemRepair() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);

  const fixSystem = async () => {
    if (!user || !firestore) return;
    setLoading(true);
    try {
      // 1. CREATE YOUR ADMIN PROFILE
      // This fixes the "Role-Based" rule check.
      // It creates a document in 'staff' with your UID.
      await setDoc(doc(firestore, 'staff', user.uid), {
        email: user.email,
        role: 'Director', // <--- THIS IS THE KEY
        uid: user.uid,
        firstName: 'Admin',
        lastName: 'User',
        createdAt: new Date().toISOString()
      }, { merge: true });

      // 2. CREATE A DUMMY TIMETABLE (To Initialize Collection)
      // This ensures the 'timetables' collection actually exists.
      const timetableRef = collection(firestore, 'timetables');
      await addDoc(timetableRef, {
        day: 'Monday',
        subject: 'Mathematics',
        timeSlotId: 1,
        startTime: '08:00',
        endTime: '09:00',
        classId: 'demo-class'
      });

      alert("✅ System Repaired!\n1. Admin Role Assigned.\n2. Timetables Collection Initialized.\n\nTry refreshing the Dashboard now.");
      
    } catch (error: any) {
      console.error(error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg my-4">
      <h3 className="font-bold text-orange-800 flex items-center gap-2">
        <Wrench className="h-4 w-4"/> System Repair Tool
      </h3>
      <p className="text-sm text-orange-700 mb-3">
        Click this to force-create your Admin Role and initialize collections.
      </p>
      <Button onClick={fixSystem} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
        {loading ? <Loader2 className="animate-spin mr-2"/> : null}
        Fix Admin Permissions & Data
      </Button>
    </div>
  );
}
