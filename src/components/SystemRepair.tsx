
'use client';

import { useState } from 'react';
import { useAuth, useFirestore } from '@/firebase'; 
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, Wrench, AlertTriangle } from 'lucide-react';

export default function SystemRepair() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);
  const [debugMsg, setDebugMsg] = useState("");

  const fixSystem = async () => {
    console.log("--- System Repair Started ---");
    setLoading(true);
    setDebugMsg("Starting...");

    // 1. DEBUG CHECKS (Make the silent failure LOUD)
    if (!user) {
        const msg = "❌ Error: User is NULL. Please sign out and sign in again.";
        alert(msg);
        setDebugMsg(msg);
        setLoading(false);
        return;
    }

    if (!firestore) {
        const msg = "❌ Error: Firestore SDK is missing. Check your firebase/client.ts file.";
        alert(msg);
        setDebugMsg(msg);
        setLoading(false);
        return;
    }

    try {
      setDebugMsg(`Found User: ${user.uid}. Updating Role...`);
      
      // 2. FORCE ADMIN ROLE
      await setDoc(doc(firestore, 'users', user.uid), {
        email: user.email,
        role: 'Admin', 
        repairedAt: new Date().toISOString()
      }, { merge: true });

      setDebugMsg("Role Set. Creating Dummy Timetable...");

      // 3. FORCE COLLECTION INIT
      // We create a dummy doc to force the collection into existence
      await addDoc(collection(firestore, 'timetables'), {
        day: 'Monday',
        subject: 'System Test',
        timeSlotId: 999,
        startTime: '00:00',
        endTime: '00:00',
        classId: 'test-class',
        note: 'You can delete this'
      });

      setDebugMsg("✅ Success! Refresh the page.");
      alert("✅ SUCCESS! \n\n1. Role set to 'Admin'.\n2. 'timetables' collection created.\n\nPlease refresh the page now.");
      
    } catch (error: any) {
      console.error(error);
      const errorText = `❌ CRASH: ${error.message}`;
      setDebugMsg(errorText);
      alert(errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-lg my-4 shadow-md">
      <h3 className="font-bold text-orange-900 flex items-center gap-2">
        <Wrench className="h-5 w-5"/> Debug Repair Tool
      </h3>
      
      <div className="text-sm text-orange-800 mb-3 space-y-1">
        <p><strong>User Status:</strong> {user ? "✅ Logged In" : "❌ Not Detected"}</p>
        <p><strong>Database Status:</strong> {firestore ? "✅ Connected" : "❌ Not Connected"}</p>
      </div>

      <Button onClick={fixSystem} disabled={loading} className="bg-orange-600 hover:bg-orange-700 w-full font-bold">
        {loading ? <Loader2 className="animate-spin mr-2"/> : <AlertTriangle className="mr-2 h-4 w-4" />}
        CLICK TO FIX
      </Button>

      {debugMsg && (
        <div className="mt-2 p-2 bg-white border border-orange-200 text-xs font-mono text-black rounded">
            {debugMsg}
        </div>
      )}
    </div>
  );
}
