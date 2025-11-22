
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, doc, writeBatch, serverTimestamp, getDocs, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Student, AttendanceRecord } from '@/lib/types';
import { cn } from '@/lib/utils';

type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';
type ClassData = { id: string, name: string };

export default function ManualAttendancePage() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch classes for the current teacher or all classes for admin/director
  const classesQuery = useMemoFirebase(
    () => {
      if (!user || !firestore || !role) return null;
      if (role === 'Teacher') {
        return query(collection(firestore, 'classes'), where('teacherId', '==', user.uid));
      } else if (role === 'Administrator' || role === 'Director') {
        return query(collection(firestore, 'classes'));
      }
      return null;
    },
    [firestore, user, role] 
  );
  const { data: classes, isLoading: isLoadingClasses } = useCollection<ClassData>(classesQuery);

  // Fetch students for the selected class
  const studentsQuery = useMemoFirebase(
    () => (selectedClassId ? query(collection(firestore, 'students'), where('classId', '==', selectedClassId)) : null),
    [firestore, selectedClassId]
  );
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);
  
  // Fetch today's attendance records for the selected class
  useEffect(() => {
    if (!selectedClassId || !firestore || !students) return;

    const fetchTodaysAttendance = async () => {
      setIsLoading(true);
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const studentIds = students?.map(s => s.uid) || [];
      if (studentIds.length === 0) {
        setAttendance({});
        setIsLoading(false);
        return;
      }
      
      const attendanceQuery = query(
        collection(firestore, 'attendance'),
        where('studentId', 'in', studentIds),
        where('date', '>=', Timestamp.fromDate(todayStart))
      );

      const querySnapshot = await getDocs(attendanceQuery);
      const todaysRecords: Record<string, AttendanceStatus> = {};
      querySnapshot.forEach(doc => {
        const record = doc.data() as AttendanceRecord;
        todaysRecords[record.studentId] = record.status;
      });
      
      // Pre-fill with fetched records, default others to 'Present'
      const initialAttendance = students?.reduce((acc, student) => {
          acc[student.uid] = todaysRecords[student.uid] || 'Present';
          return acc;
      }, {} as Record<string, AttendanceStatus>) || {};

      setAttendance(initialAttendance);
      setIsLoading(false);
    };

    if (students) {
      fetchTodaysAttendance();
    }
  }, [selectedClassId, firestore, students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedClassId || !students || !user || !firestore) return;
    setIsSaving(true);
    try {
      const batch = writeBatch(firestore);
      const today = new Date();

      for (const student of students) {
        const status = attendance[student.uid];
        if (status) {
          const attendanceRef = doc(collection(firestore, 'attendance'));
          batch.set(attendanceRef, {
            studentId: student.uid,
            classId: selectedClassId,
            date: serverTimestamp(),
            status: status,
            markedBy: user.uid,
          });
        }
      }
      await batch.commit();
      toast({ title: 'Success', description: `Attendance for ${format(today, 'PPP')} has been saved.` });
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save attendance records.' });
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusButtonStyle = (currentStatus: AttendanceStatus, buttonStatus: AttendanceStatus) => {
    if (currentStatus === buttonStatus) {
        switch(buttonStatus) {
            case 'Present': return 'bg-green-500 hover:bg-green-600 text-white';
            case 'Absent': return 'bg-red-500 hover:bg-red-600 text-white';
            case 'Late': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
            case 'Excused': return 'bg-blue-500 hover:bg-blue-600 text-white';
        }
    }
    return 'bg-gray-200 hover:bg-gray-300 text-gray-700';
  }

  const canAccess = role === 'Teacher' || role === 'Administrator' || role === 'Director';

  if (!canAccess) {
    return (
      <Card>
        <CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is for teachers and administrators only.</CardDescription></CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manual Attendance</CardTitle>
          <CardDescription>Select a class to mark student attendance for today, {format(new Date(), 'PPP')}.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full md:w-1/3 mb-6">
            <Select onValueChange={setSelectedClassId} disabled={isLoadingClasses}>
              <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
              <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {(isLoadingStudents || isLoading) && selectedClassId && (
            <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
          )}
          {students && students.length > 0 && !isLoading && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map(student => (
                    <TableRow key={student.uid}>
                      <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {(['Present', 'Absent', 'Late', 'Excused'] as AttendanceStatus[]).map(status => (
                          <Button 
                            key={status}
                            size="sm" 
                            className={cn('transition-colors', getStatusButtonStyle(attendance[student.uid], status))}
                            onClick={() => handleStatusChange(student.uid, status)}
                          >
                            {status}
                          </Button>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveAttendance} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Attendance
                </Button>
              </div>
            </>
          )}
          {selectedClassId && !isLoadingStudents && (!students || students.length === 0) && (
            <p className="text-center text-muted-foreground py-8">No students found in this class.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
