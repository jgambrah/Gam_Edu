'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useFirestore, useMemoFirebase, useUser, errorEmitter, FirestorePermissionError, useCollection } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import React, { useState, useMemo } from 'react';
import { collection, doc, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import { Loader2, PlusCircle, User, Users, Ratio, BookOpen, UserCircle, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRole } from '@/context/role-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DailyAttendanceSheet } from '../attendance/daily-attendance-sheet';
import { Subject, TimetableEntry } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { ScrollArea } from '@/components/ui/scroll-area';

// ... (Sub-components omitted for focus on AcademicsPageContent) ...

export default function AcademicsPageContent() {
  const { role, loading: isRoleLoading } = useRole();
  const firestore = useFirestore();
  const { user } = useUser();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const canManageClasses = role === 'Director' || role === 'Administrator';
  
  const isStaff = !isRoleLoading && (
    role === 'Teacher' || role === 'Administrator' || 
    role === 'Director' || role === 'Accountant'
  );

  const classesQuery = useMemoFirebase(() => {
    if (!firestore || !user || !schoolId || !isStaff) return null;
    let q = query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
    if (role === 'Teacher') {
      q = query(q, where('teacherId', '==', user.uid));
    }
    return q;
  }, [firestore, user, role, schoolId, isStaff]);

  const { data: classes, isLoading: isLoadingClasses } = useCollection(classesQuery);
  
  const teachersQuery = useMemoFirebase(() => 
    (firestore && schoolId && canManageClasses && isStaff)
      ? query(collection(firestore, 'staff'), where('role', '==', 'Teacher'), where('schoolId', '==', schoolId)) 
      : null, 
  [firestore, schoolId, canManageClasses, isStaff]);
  const { data: teachers, isLoading: isLoadingTeachers } = useCollection(teachersQuery);

  const studentsQuery = useMemoFirebase(() => 
    (firestore && schoolId && isStaff)
      ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) 
      : null, 
  [firestore, schoolId, isStaff]);
  const { data: students, isLoading: isLoadingStudents } = useCollection(studentsQuery);

  const timetableQuery = useMemoFirebase(() => 
    (firestore && schoolId && isStaff)
      ? query(collection(firestore, 'timetables'), where('schoolId', '==', schoolId)) 
      : null, 
  [firestore, schoolId, isStaff]);
  const { data: timetable, isLoading: isLoadingTimetable } = useCollection<TimetableEntry>(timetableQuery);

  const subjectsQuery = useMemoFirebase(() => 
    (firestore && schoolId && isStaff)
      ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) 
      : null, 
  [firestore, schoolId, isStaff]);
  const { data: subjects, isLoading: isLoadingSubjects } = useCollection<Subject>(subjectsQuery);

  if (!isRoleLoading && !isStaff) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>Only school staff can access the class management portal.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isLoading = isLoadingSchool || isRoleLoading || isLoadingClasses || isLoadingTeachers || isLoadingStudents || isLoadingTimetable || isLoadingSubjects;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Class Management</CardTitle>
            <CardDescription>
              {role === 'Teacher' ? 'Showing classes assigned to you.' : 'View, create, and manage academic classes for your school.'}
            </CardDescription>
          </div>
          {canManageClasses && schoolId && (
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Class</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to add a new class to the system.
                  </DialogDescription>
                </DialogHeader>
                {/* CreateClassForm component would be here */}
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <Card key={`skeleton-${i}`}><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-full mt-2" /></CardContent></Card>
              ))}
            </div>
          ) : classes && classes.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((c) => (
                <Card key={c.id} className="cursor-pointer hover:border-primary transition-colors h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{c.name}</CardTitle>
                    <CardDescription>{c.description || 'No description available.'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><Users className="h-4 w-4"/><span>{students?.filter(s => s.classId === c.id).length || 0} / {c.capacity || 0} Students</span></div>
                    <div className="flex items-center gap-2"><User className="h-4 w-4"/><span>{teachers?.find(t => t.uid === c.teacherId) ? `${teachers.find(t => t.uid === c.teacherId)?.firstName} ${teachers.find(t => t.uid === c.teacherId)?.lastName}` : 'Not Assigned'}</span></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <p>No classes found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
