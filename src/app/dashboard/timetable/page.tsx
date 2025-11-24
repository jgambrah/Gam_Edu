
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, writeBatch, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimetableDisplay } from './timetable-display';
import { TimeSlot, TimetableEntry, Subject, Room } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2 } from 'lucide-react';
import { generateTimetable } from '@/ai/flows/generate-timetable-flow';

type Teacher = { uid: string; firstName: string; lastName: string; subjects: string[] };
type ClassData = { id: string; name: string };
type Student = { classId: string; id: string; uid: string; };

export default function TimetablePage() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [selectedClassId, setSelectedClassId] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [customConstraint, setCustomConstraint] = useState('');

  const classesQuery = useMemoFirebase(
    () => user && (role === 'Administrator' || role === 'Director') 
      ? collection(firestore, 'classes') 
      : query(collection(firestore, 'classes'), where('teacherId', '==', user?.uid || '')),
    [firestore, user, role]
  );
  const { data: classes } = useCollection<ClassData>(classesQuery);

  const { data: allTeachers } = useCollection<Teacher>(useMemoFirebase(() => user ? query(collection(firestore, 'staff'), where('role', '==', 'Teacher')) : null, [firestore, user]));
  const { data: subjects } = useCollection<Subject>(useMemoFirebase(() => user ? collection(firestore, 'subjects') : null, [firestore, user]));
  const { data: rooms } = useCollection<Room>(useMemoFirebase(() => user ? collection(firestore, 'rooms') : null, [firestore, user]));
  const { data: timeSlots } = useCollection<TimeSlot>(useMemoFirebase(() => user ? collection(firestore, 'timeSlots') : null, [firestore, user]));
  const { data: timetable, isLoading: isTimetableLoading } = useCollection<TimetableEntry>(useMemoFirebase(() => user ? collection(firestore, 'timetables') : null, [firestore, user]));
  const { data: studentData } = useCollection<Student>(useMemoFirebase(() => user && role === 'Student' ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user, role]));

  useEffect(() => {
    if (role === 'Student' && studentData && studentData.length > 0) {
      const currentStudent = studentData[0];
      if (currentStudent) {
        setSelectedClassId(currentStudent.classId);
      }
    }
  }, [role, studentData]);

  const canAccess = ['Student', 'Teacher', 'Administrator', 'Director'].includes(role);
  const canGenerate = ['Administrator', 'Director'].includes(role);

  const handleGenerateTimetable = async () => {
    if (!canGenerate || !allTeachers || !subjects || !classes || !rooms || !timeSlots) return;
    setIsGenerating(true);
    toast({ title: "AI is on the job!", description: "Generating a new timetable. This may take a moment." });

    try {
      const simplifiedTeachers = allTeachers.map(t => ({
        uid: t.uid,
        firstName: t.firstName,
        lastName: t.lastName,
        subjects: subjects.filter(s => s.teacherIds.includes(t.uid)).map(s => s.id)
      }));

      const input = {
        teachers: simplifiedTeachers,
        subjects: subjects.map(({ id, name }) => ({ id, name })),
        classes: classes.map(({ id, name }) => ({ id, name })),
        rooms: rooms.map(({ id, name }) => ({ id, name })),
        timeSlots: timeSlots.map(({ id, day, startTime, endTime }) => ({ id, day, startTime, endTime })),
        customConstraint: customConstraint,
      };

      const result = await generateTimetable(input);
      
      const batch = writeBatch(firestore);

      // Clear existing timetable
      timetable?.forEach(entry => {
        batch.delete(doc(firestore, 'timetables', entry.id));
      });
      
      // Add new timetable entries
      result.timetable.forEach(entry => {
        const newDocRef = doc(collection(firestore, 'timetables'));
        batch.set(newDocRef, entry);
      });
      
      await batch.commit();

      // Placeholder for school-wide notification
      console.log("School-wide notification: Timetable has been updated.");

      toast({ title: "Success!", description: "A new timetable has been generated and saved." });

    } catch (error) {
      console.error("Error generating timetable:", error);
      toast({ variant: 'destructive', title: "AI Error", description: "Could not generate timetable." });
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
                  <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
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
              placeholder="Enter a rescheduling reason or custom constraint. e.g., 'Cancel all classes on Friday afternoon for a school event' or 'Math classes should be in the morning'."
              value={customConstraint}
              onChange={(e) => setCustomConstraint(e.target.value)}
              rows={3}
            />
            <Button onClick={handleGenerateTimetable} disabled={isGenerating} className="w-full">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Generate New Timetable with AI
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
