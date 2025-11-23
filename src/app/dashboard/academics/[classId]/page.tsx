'use client';

import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, UserCircle } from 'lucide-react';

type ClassData = {
  id: string;
  name: string;
  description?: string;
  teacherId?: string;
};

type Teacher = {
    uid: string;
    firstName: string;
    lastName: string;
};

type Student = {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
};

export default function ClassDetailsPage() {
  const { classId } = useParams();
  const firestore = useFirestore();

  const classRef = useMemoFirebase(
    () => (firestore && classId ? doc(firestore, 'classes', classId as string) : null),
    [firestore, classId]
  );
  const { data: classData, isLoading: isLoadingClass } = useDoc<ClassData>(classRef);

  const teacherRef = useMemoFirebase(
    () => (firestore && classData?.teacherId ? doc(firestore, 'staff', classData.teacherId) : null),
    [firestore, classData]
  );
  const { data: teacherData, isLoading: isLoadingTeacher } = useDoc<Teacher>(teacherRef);

  const studentsQuery = useMemoFirebase(
      () => (firestore && classId ? query(collection(firestore, 'students'), where('classId', '==', classId)) : null),
      [firestore, classId]
  );
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);


  const isLoading = isLoadingClass || isLoadingTeacher || isLoadingStudents;

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!classData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Class Not Found</CardTitle>
          <CardDescription>The requested class could not be found.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{classData.name}</CardTitle>
          <CardDescription>{classData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p><strong>Class Teacher:</strong> {teacherData ? `${teacherData.firstName} ${teacherData.lastName}` : 'Not Assigned'}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Enrolled Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students && students.length > 0 ? (
                students.map(student => (
                  <TableRow key={student.uid}>
                    <TableCell className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{student.firstName?.[0]}{student.lastName?.[0]}</AvatarFallback>
                        </Avatar>
                        {student.firstName} {student.lastName}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">No students enrolled in this class.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
