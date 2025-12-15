
'use client';

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase'; 
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, Database, CheckCircle2 } from 'lucide-react';
import { getDay } from 'date-fns';

export default function SystemRepair() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `> ${msg}`]);

  const populateData = async () => {
    setLoading(true);
    setLogs([]);
    addLog("Initializing Data Population...");

    if (!firestore || !user) return;

    try {
      // 1. Create a Class
      addLog("Creating Class: Grade 1...");
      const classRef = await addDoc(collection(firestore, 'classes'), {
        name: "Grade 1 - Alpha",
        capacity: 30,
        currentStudents: 1
      });

      // 2. Create a Student
      addLog("Creating Student: Demo Student...");
      await addDoc(collection(firestore, 'students'), {
        fullName: "Alice Wonderland",
        classId: classRef.id,
        gender: "Female",
        status: "Active"
      });

      // 3. Create Timetable for TODAY
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const todayName = days[getDay(new Date())];
      
      addLog(`Creating Schedule for: ${todayName}...`);
      
      await addDoc(collection(firestore, 'timetables'), {
        day: todayName, // Matches dashboard filter
        subjectId: "math-101",
        subject: "Mathematics", // Fallback name
        classId: classRef.id,
        timeSlotId: 1, // Matches sort order
        startTime: "09:00",
        endTime: "10:00",
        teacherId: user.uid
      });

      // 4. Create Subject
      await addDoc(collection(firestore, 'subjects'), {
        id: "math-101",
        name: "Mathematics",
        code: "MTH1"
      });

      addLog("✅ DATA POPULATED SUCCESSFULLY!");
      addLog("👉 REFRESH THE PAGE NOW.");

    } catch (error: any) {
      console.error(error);
      addLog(`❌ Error: ${error.message}`);
      
      if (error.message.includes("index")) {
        addLog("⚠️ INDEX MISSING! Check your browser console for a link to create it.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-900 text-green-400 border-2 border-green-500 rounded-lg my-4 shadow-xl font-mono text-sm">
      <div className="flex justify-between items-center mb-4 border-b border-green-800 pb-2">
        <h3 className="font-bold flex items-center gap-2">
            <Database className="h-5 w-5"/> Data Injector
        </h3>
      </div>
      
      <div className="bg-black p-3 rounded h-40 overflow-y-auto mb-4 border border-green-900">
        {logs.length === 0 ? <span className="opacity-50">Ready to inject data...</span> : logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>

      <Button 
        onClick={populateData} 
        disabled={loading} 
        className="bg-blue-600 hover:bg-blue-500 text-white w-full font-bold"
      >
        {loading ? <Loader2 className="animate-spin mr-2"/> : <CheckCircle2 className="mr-2 h-4 w-4" />}
        POPULATE DASHBOARD DATA
      </Button>
    </div>
  );
}
