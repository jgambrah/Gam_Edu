'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase'; 
import { collection, writeBatch, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, Database, Clock } from 'lucide-react';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useToast } from '@/hooks/use-toast';

export default function TimetableSeeder() {
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const seedData = async () => {
    if (!firestore || !schoolId) {
        toast({ variant: 'destructive', title: "Configuration Error", description: "School ID not found. Please refresh." });
        return;
    }
    setLoading(true);
    
    try {
      const batch = writeBatch(firestore);

      // 1. Create Standard Time Slots (Typical 8 AM - 1 PM day)
      const times = [
        { startTime: '08:00', endTime: '08:45', type: 'Lesson' },
        { startTime: '08:45', endTime: '09:30', type: 'Lesson' },
        { startTime: '09:30', endTime: '10:15', type: 'Lesson' },
        { startTime: '10:15', endTime: '10:45', type: 'Break' },
        { startTime: '10:45', endTime: '11:30', type: 'Lesson' },
        { startTime: '11:30', endTime: '12:15', type: 'Lesson' },
        { startTime: '12:15', endTime: '13:00', type: 'Lesson' },
      ];

      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

      // Generate slots for every day with schoolId stamp
      times.forEach((slot, index) => {
        days.forEach(day => {
            const id = `${schoolId}-${day.substring(0,3)}-${slot.startTime.replace(':','')}`;
            const ref = doc(collection(firestore, 'timeSlots'), id);
            batch.set(ref, {
                id: id,
                day: day,
                startTime: slot.startTime,
                endTime: slot.endTime,
                type: slot.type,
                order: index,
                schoolId: schoolId
            });
        });
      });

      // 2. Create Standard Rooms with schoolId stamp
      const rooms = ['Room 101', 'Room 102', 'Science Lab', 'Library', 'Field'];
      rooms.forEach(roomName => {
          const ref = doc(collection(firestore, 'rooms'));
          batch.set(ref, { 
              name: roomName, 
              capacity: 30,
              isLab: roomName.toLowerCase().includes('lab'),
              schoolId: schoolId
          });
      });

      await batch.commit();
      toast({ title: "Database Initialized!", description: "Standard Time Slots and Rooms have been created for your school." });

    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: "Seeding Failed", description: error.message });
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
        The system is currently using standard 10:15 AM breaks. Use this tool to reset your school to a standard 8:00 AM - 1:00 PM schedule. 
        You can then edit any specific slot in the list below.
      </p>
      <Button onClick={seedData} disabled={loading} className="bg-blue-600 hover:bg-blue-700 w-full">
        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Database className="mr-2 h-4 w-4" />}
        Reset to Standard Intervals
      </Button>
    </div>
  );
}
