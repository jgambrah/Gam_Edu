
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, writeBatch, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimetableDisplay } from './timetable-display';
import { TimeSlot, TimetableEntry, Subject, Room, Student, Class } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { generateTimetable } from '@/ai/flows/generate-timetable-flow';
import TimetableSeeder from '@/components/TimetableSeeder';

type Teacher = { uid: string; firstName: string; lastName: string; subjects: string[] };

export default function TimetablePage() {
  const { user } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [selectedClassId, setSelectedClassId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customConstraint, setCustomConstraint] = useState('');

  // 1. Classes Query
  const { data: classes } = useCollection<Class>(
    useMemoFirebase(
        () => firestore ? query(collection(firestore, 'classes')) : null, 
        [firestore]
    )
  );

  // 2. Teachers Query
  const { data: allTeachers } = useCollection<Teacher>(
    useMemoFirebase(
        () => firestore ? query(collection(firestore, 'staff'), where('role', '==', 'Teacher')) : null, 
        [firestore]
    )
  );

  // 3. Subjects Query
  const { data: subjects } = useCollection<Subject>(
    useMemoFirebase(
        () => firestore ? query(collection(firestore, 'subjects')) : null, 
        [firestore]
    )
  );

  // 4. Rooms Query
  const { data: rooms } = useCollection<Room>(
    useMemoFirebase(
        () => firestore ? query(collection(firestore, 'rooms')) : null, 
        [firestore]
    )
  );

  // 5. TimeSlots Query (Ordered)
  const { data: timeSlots } = useCollection<TimeSlot>(
    useMemoFirebase(
        () => firestore ? query(collection(firestore, 'timeSlots'), orderBy('startTime')) : null, 
        [firestore]
    )
  );

  // 6. Timetable Query
  const { data: timetable, isLoading: isTimetableLoading, forceRefetch } = useCollection<TimetableEntry>(
    useMemoFirebase(
        () => firestore ? query(collection(firestore, 'timetables')) : null, 
        [firestore]
    )
  );

  // 7. Student Data (Only if role is Student)
  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(
        () => (user && role === 'Student') ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null,
        [firestore, user, role]
    )
  );

  // Auto-select class for Students
  useEffect(() => {
    if (role === 'Student' && studentData && studentData.length > 0) {
      const currentStudent = studentData[0];
      if (currentStudent) {
        setSelectedClassId(currentStudent.classId);
      }
    }
  }, [role, studentData]);

  const canAccess = ['Student', 'Teacher', 'Admin', 'Administrator', 'Director'].includes(role || '');
  const canGenerate = ['Admin', 'Administrator', 'Director'].includes(role || '');

  const handleGenerateTimetable = async () => {
    if (!canGenerate || !allTeachers || !subjects || !classes || !rooms || !timeSlots || !firestore) return;
    setIsGenerating(true);
    toast({ title: "AI is on the job!", description: "Generating a new timetable. This may take a moment." });

    try {
      // FIX: Filter out invalid teachers (missing UIDs) to satisfy AI Schema
      const validTeachers = allTeachers.filter(t => t.uid && t.firstName && t.lastName);

      const simplifiedTeachers = validTeachers.map(t => ({
        uid: t.uid,
        firstName: t.firstName,
        lastName: t.lastName,
        // Ensure subjects logic is safe
        subjects: subjects.filter(s => s.teacherIds?.includes(t.uid)).map(s => s.id)
      }));

      if (simplifiedTeachers.length === 0) {
        throw new Error("No valid teachers found. Check Staff records.");
      }

      const input = {
        teachers: simplifiedTeachers,
        subjects: subjects.map(({ id, name }) => ({ id, name })),
        classes: classes?.map(({ id, name }) => ({ id, name })) || [],
        rooms: rooms?.map(({ id, name }) => ({ id, name })) || [],
        timeSlots: timeSlots?.map(({ id, day, startTime, endTime }) => ({ id, day, startTime, endTime })) || [],
        customConstraint: customConstraint,
      };

      const result = await generateTimetable(input);
      
      const batch = writeBatch(firestore);

      if(timetable) {
          timetable.forEach(entry => {
            batch.delete(doc(firestore, 'timetables', entry.id));
          });
      }
      
      if (result && result.timetable) {
          result.timetable.forEach((entry: any) => {
            const newDocRef = doc(collection(firestore, 'timetables'));
            batch.set(newDocRef, entry);
          });
      }
      
      await batch.commit();

      toast({ title: "Success!", description: "A new timetable has been generated and saved." });
      forceRefetch(); 

    } catch (error: any) {
      console.error("Error generating timetable:", error);
      toast({ variant: 'destructive', title: "AI Error", description: error.message || "Could not generate timetable." });
    } finally {
      setIsGenerating(false);
    }
  };


  if (!canAccess) {
    return (
      <Card>
        <CardHeader><CardTitle>Access Denied</CardTitle></CardHeader>
        <CardContent><p>This module is not available for your role.</p></CardContent>
      </Card>
    );
  }

  const filteredTimetable = timetable?.filter(entry => entry.classId === selectedClassId) || [];

  return (
    <div className="space-y-6">
      {canGenerate && (
          <TimetableSeeder />
      )}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Class Timetable</CardTitle>
              <CardDescription>View the weekly schedule for a selected class.</CardDescription>
            </div>
            {role !== 'Student' && (
              <div className="w-1/3">
                <Select onValueChange={setSelectedClassId} value={selectedClassId}>
                  <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                  <SelectContent>
                      {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isTimetableLoading ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : selectedClassId ? (
            <TimetableDisplay 
                timetable={filteredTimetable}
                subjects={subjects || []}
                teachers={allTeachers || []}
                rooms={rooms || []}
                timeSlots={timeSlots || []}
            />
          ) : (
            <p className="text-center text-muted-foreground py-10">Please select a class to view its timetable.</p>
          )}
        </CardContent>
      </Card>

      {canGenerate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Wand2 /> AI Timetable Generation</CardTitle>
            <CardDescription>Generate or reschedule the school's entire timetable using AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter a rescheduling reason or custom constraint (e.g. 'Math classes should be in the morning')"
              value={customConstraint}
              onChange={(e) => setCustomConstraint(e.target.value)}
              rows={3}
            />
            <Button onClick={handleGenerateTimetable} disabled={isGenerating} className="w-full">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Generate New Timetable
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
