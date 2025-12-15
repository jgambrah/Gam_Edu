
'use client';

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase'; // Using your App's hooks
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, Wrench, Terminal } from 'lucide-react';

export default function SystemRepair() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `> ${msg}`]);

  const fixSystem = async () => {
    setLoading(true);
    setLogs([]); // Clear previous logs
    addLog("Starting repair process...");

    if (!user) {
        addLog("❌ Error: No User found from useUser() hook.");
        setLoading(false);
        return;
    }
    if (!firestore) {
        addLog("❌ Error: Firestore not initialized.");
        setLoading(false);
        return;
    }

    addLog(`User Detected: ${user.email} (${user.uid})`);

    try {
      // 1. SET ADMIN ROLE
      addLog("Attempting to write to 'users' collection...");
      const userRef = doc(firestore, 'users', user.uid);
      
      await setDoc(userRef, {
        email: user.email,
        role: 'Admin', // Setting the role
        fixedAt: new Date().toISOString()
      }, { merge: true });
      
      addLog("✅ User Profile Created/Updated successfully.");

      // 2. CREATE DUMMY TIMETABLE (To fix 'timetables' permission issues)
      addLog("Attempting to create dummy timetable...");
      const timetableRef = collection(firestore, 'timetables');
      await addDoc(timetableRef, {
        day: 'SystemCheck',
        note: 'Initialization Entry',
        createdAt: new Date()
      });
      
      addLog("✅ Timetable collection initialized.");
      addLog("🎉 SUCCESS! You are now an Admin.");
      addLog("👉 PLEASE REFRESH THE PAGE NOW.");

    } catch (error: any) {
      console.error(error);
      addLog(`❌ FAILURE: ${error.message}`);
      addLog(`Code: ${error.code}`);
      
      if (error.code === 'permission-denied') {
        addLog("⚠️ HINT: Your Firestore Rules are blocking the write.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-900 text-green-400 border-2 border-green-500 rounded-lg my-4 shadow-xl font-mono text-sm">
      <div className="flex justify-between items-center mb-4 border-b border-green-800 pb-2">
        <h3 className="font-bold flex items-center gap-2">
            <Terminal className="h-5 w-5"/> Admin Repair Terminal
        </h3>
      </div>
      
      <div className="mb-4 space-y-1">
        <p>User: {user ? "✅ Connected" : "❌ Disconnected"}</p>
        <p>DB: {firestore ? "✅ Connected" : "❌ Disconnected"}</p>
      </div>

      <div className="bg-black p-3 rounded h-40 overflow-y-auto mb-4 border border-green-900">
        {logs.length === 0 ? <span className="opacity-50">Waiting for command...</span> : logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>

      <Button 
        onClick={fixSystem} 
        disabled={loading} 
        className="bg-green-700 hover:bg-green-600 text-white w-full font-bold"
      >
        {loading ? <Loader2 className="animate-spin mr-2"/> : <Wrench className="mr-2 h-4 w-4" />}
        RUN FIX SCRIPT
      </Button>
    </div>
  );
}
