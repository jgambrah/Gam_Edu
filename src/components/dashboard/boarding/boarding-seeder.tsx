'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, doc, getDocs, query, where, limit, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Loader2, Database, Home } from 'lucide-react';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useToast } from '@/hooks/use-toast';

export default function BoardingSeeder({ onSeedComplete }: { onSeedComplete?: () => void }) {
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const seedData = async () => {
    if (!firestore || !schoolId) {
      toast({ variant: 'destructive', title: 'Configuration Error', description: 'School ID not found. Please refresh.' });
      return;
    }
    setLoading(true);

    try {
      const batch = writeBatch(firestore);

      // 1. Define Hostel Blocks to seed
      const blocksData = [
        { name: 'Prestige Boys Block A', genderRestriction: 'Male', totalFloors: 2 },
        { name: 'Elite Girls Block B', genderRestriction: 'Female', totalFloors: 2 },
      ];

      // Query one active student to create a sample check-in allocation
      const studentsQuery = query(
        collection(firestore, 'students'),
        where('schoolId', '==', schoolId),
        where('enrollmentStatus', '==', 'Active'),
        limit(1)
      );
      const studentSnap = await getDocs(studentsQuery);
      const sampleStudent = !studentSnap.empty ? studentSnap.docs[0] : null;

      for (const block of blocksData) {
        const blockRef = doc(collection(firestore, 'hostel_blocks'));
        const blockId = blockRef.id;

        batch.set(blockRef, {
          id: blockId,
          schoolId,
          name: block.name,
          genderRestriction: block.genderRestriction,
          totalFloors: block.totalFloors,
          createdAt: serverTimestamp(),
          createdBy: 'SYSTEM_SEEDER',
        });

        // 2. Seed rooms for each block (2 rooms per block: Floor 0 and Floor 1)
        for (let floor = 0; floor < block.totalFloors; floor++) {
          const roomNumber = `${block.genderRestriction === 'Male' ? '1' : '2'}0${floor + 1}`;
          const roomRef = doc(collection(firestore, 'hostel_rooms'));
          const roomId = roomRef.id;

          batch.set(roomRef, {
            id: roomId,
            schoolId,
            blockId,
            roomNumber,
            floorLevel: floor,
            totalCapacity: 4,
            roomType: floor === 0 ? 'Standard' : 'AC',
            status: 'Available',
            createdAt: serverTimestamp(),
          });

          // 3. Seed beds for each room (4 beds per room)
          for (let bedNum = 1; bedNum <= 4; bedNum++) {
            const bedRef = doc(collection(firestore, 'hostel_beds'));
            const bedId = bedRef.id;
            const bedIdentifier = `Bed ${bedNum}`;

            // If we have a sample student, let's assign them to the very first bed of the first room
            const shouldOccupy = sampleStudent && block.genderRestriction === 'Male' && floor === 0 && bedNum === 1;
            const occupantId = shouldOccupy ? sampleStudent.id : null;
            const occupantName = shouldOccupy
              ? `${sampleStudent.data().firstName || ''} ${sampleStudent.data().lastName || ''}`.trim()
              : null;

            batch.set(bedRef, {
              id: bedId,
              schoolId,
              blockId,
              roomId,
              bedIdentifier,
              status: shouldOccupy ? 'Occupied' : 'Available',
              currentOccupantId: occupantId,
              createdAt: serverTimestamp(),
            });

            // 4. Create a sample allocation history entry if assigned
            if (shouldOccupy && occupantId) {
              const allocationRef = doc(collection(firestore, 'hostel_allocations'));
              batch.set(allocationRef, {
                id: allocationRef.id,
                schoolId,
                studentId: occupantId,
                studentName: occupantName,
                blockId,
                blockName: block.name,
                roomId,
                roomNumber,
                bedId,
                bedIdentifier,
                checkInDate: serverTimestamp(),
                checkOutDate: null,
                status: 'Active',
                allocatedById: 'SYSTEM_SEEDER',
                allocatedByName: 'System Seeder',
                createdAt: serverTimestamp(),
              });
            }
          }
        }
      }

      await batch.commit();
      toast({ title: 'Database Initialized! 🏢', description: 'Sample Hostel Blocks, Rooms, and Beds have been created.' });
      if (onSeedComplete) onSeedComplete();
    } catch (error: any) {
      console.error('Seeding Error:', error);
      toast({ variant: 'destructive', title: 'Seeding Failed', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100 rounded-3xl mb-6 shadow-sm">
      <h3 className="font-black text-indigo-900 flex items-center gap-2 mb-2 uppercase text-sm tracking-wider">
        <Home className="h-5 w-5 text-indigo-600" /> Boarding Setup Seeder
      </h3>
      <p className="text-xs text-indigo-700/80 font-medium mb-4 leading-relaxed">
        Use this developer utility tool to initialize standard Hostel Blocks, Rooms (Standard and AC), and Beds for testing.
        If active students exist, the seeder will also automatically configure an active allocation.
      </p>
      <Button onClick={seedData} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl shadow-md transition-all active:scale-95">
        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Database className="mr-2 h-4 w-4" />}
        Initialize Boarding Schema
      </Button>
    </div>
  );
}
