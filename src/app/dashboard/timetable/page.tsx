
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
import { useCurrentSchool } from '@/hooks/use-current-school';

type Teacher = { uid: string; firstName: string; lastName: string; subjects: string[] };

export default function TimetablePage() {
  const { user } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const [selectedClassId, setSelectedClassId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customConstraint, setCustomConstraint] = useState('');

  // SAAS-AWARE QUERIES
  const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

  const allTeachersQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId), where('role', '==', 'Teacher')) : null, [firestore, schoolId]);
  const { data: allTeachers } = useCollection<Teacher>(allTeachersQuery);

  const subjectsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: subjects } = useCollection<Subject>(subjectsQuery);

  const roomsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'rooms'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: rooms } = useCollection<Room>(roomsQuery);

  const timeSlotsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'timeSlots'), where('schoolId', '==', schoolId), orderBy('startTime')) : null, [firestore, schoolId]);
  const { data: timeSlots } = useCollection<TimeSlot>(timeSlotsQuery);

  const timetableQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'timetables'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: timetable, isLoading: isTimetableLoading, forceRefetch } = useCollection<TimetableEntry>(timetableQuery);
  
  const studentsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: students } = useCollection<Student>(studentsQuery);


  // Auto-select class for Students
  useEffect(() => {
    if (role === 'Student' && user && students && students.length > 0) {
      const currentStudent = students.find(s => s.uid === user.uid);
      if (currentStudent) {
        setSelectedClassId(currentStudent.classId);
      }
    }
  }, [role, user, students]);

  const canAccess = ['Student', 'Teacher', 'Admin', 'Administrator', 'Director'].includes(role || '');
  const canGenerate = ['Admin', 'Administrator', 'Director'].includes(role || '');

  const handleGenerateTimetable = async () => {
    if (!canGenerate || !allTeachers || !subjects || !classes || !rooms || !timeSlots || !firestore || !schoolId) return;
    setIsGenerating(true);
    toast({ title: "AI is on the job!", description: "Generating a new timetable. This may take a moment." });

    try {
      const validTeachers = allTeachers.filter(t => t.uid && t.firstName && t.lastName);

      const simplifiedTeachers = validTeachers.map(t => ({
        uid: t.uid,
        firstName: t.firstName,
        lastName: t.lastName,
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
            // Stamp with schoolId
            batch.set(newDocRef, { ...entry, schoolId });
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
