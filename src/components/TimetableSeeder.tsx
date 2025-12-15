
'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase'; 
import { collection, writeBatch, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, Database, Clock } from 'lucide-react';

export default function TimetableSeeder() {
  const firestore = useFirestore();
  const [loading, setLoading] = useState(false);

  const seedData = async () => {
    if (!firestore) return;
    setLoading(true);
    
    try {
      const batch = writeBatch(firestore);

      // 1. Create Standard Time Slots (8 periods)
      const times = [
        { startTime: '08:00', endTime: '08:45', type: 'Lesson' },
        { startTime: '08:45', endTime: '09:30', type: 'Lesson' },
        { startTime: '09:30', endTime: '10:15', type: 'Lesson' },
        { startTime: '10:15', endTime: '10:45', type: 'Break' }, // Break
        { startTime: '10:45', endTime: '11:30', type: 'Lesson' },
        { startTime: '11:30', endTime: '12:15', type: 'Lesson' },
        { startTime: '12:15', endTime: '13:00', type: 'Lesson' },
      ];

      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

      // Generate slots for every day
      times.forEach((slot, index) => {
        days.forEach(day => {
            const id = `${day.substring(0,3)}-${slot.startTime.replace(':','')}`;
            const ref = doc(collection(firestore, 'timeSlots'), id);
            batch.set(ref, {
                id: id,
                day: day,
                startTime: slot.startTime,
                endTime: slot.endTime,
                type: slot.type,
                order: index // Helps sorting
            });
        });
      });

      // 2. Create Standard Rooms
      const rooms = ['Room 101', 'Room 102', 'Room 103', 'Science Lab', 'Library', 'Art Studio'];
      rooms.forEach(room => {
          const ref = doc(collection(firestore, 'rooms'));
          batch.set(ref, { name: room, capacity: 30 });
      });

      await batch.commit();
      alert("✅ Success! Time Slots and Rooms created. You can now generate a timetable.");

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
        <Clock className="h-4 w-4"/> Timetable Setup
      </h3>
      <p className="text-sm text-blue-700 mb-3">
        Database empty? Click this to create standard Time Slots (8:00-1:00) and Rooms automatically.
      </p>
      <Button onClick={seedData} disabled={loading} className="bg-blue-600 hover:bg-blue-700 w-full">
        {loading ? <Loader2 className="animate-spin mr-2"/> : <Database className="mr-2 h-4 w-4" />}
        Initialize Time Slots & Rooms
      </Button>
    </div>
  );
}
