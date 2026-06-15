
'use client';

import { useState, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LessonPlan } from '@/lib/types';
import { ClipboardList, Loader2, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';
import { LessonPlanForm } from './lesson-plan-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentSchool } from '@/hooks/use-current-school';

const toDateSafe = (d: any): Date => {
  if (!d) return new Date();
  if (typeof d.toDate === 'function') return d.toDate();
  if (d instanceof Date) return d;
  if (d.seconds) return new Date(d.seconds * 1000);
  return new Date(d);
};

type ClassData = { id: string, name: string };
type StaffData = { uid: string, firstName: string, lastName: string };

function LessonPlanDetails({ plan }: { plan: LessonPlan & { teacherName?: string } }) {
  return (
    <div className="prose prose-sm max-w-none">
        {plan.teacherName && <p><strong>Teacher:</strong> {plan.teacherName}</p>}
        <h4>Learning Objectives</h4>
        <p>{plan.objectives}</p>
        <h4>Activities</h4>
        <p>{plan.activities}</p>
        <h4>Materials & Resources</h4>
        <p>{plan.materials}</p>
        {plan.notes && (
            <>
                <h4>Teacher Notes</h4>
                <p className="text-muted-foreground">{plan.notes}</p>
            </>
        )}
    </div>
  );
}

export default function LessonPlanningPage() {
  const { role, profile } = useRole();
  const { user } = useUser();
  const firestore = useFirestore();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const canAccess = role === 'Teacher' || role === 'Administrator' || role === 'Director';
  const isAdminOrDirector = role === 'Administrator' || role === 'Director';

  const plansQuery = useMemoFirebase(() => {
    if (!user || !firestore || !schoolId) return null;
    let q = query(collection(firestore, 'lesson-plans'), where('schoolId', '==', schoolId), orderBy('date', 'desc'));
    if (role === 'Teacher') {
      q = query(q, where('teacherId', '==', user.uid));
    }
    return q;
  }, [firestore, user, role, schoolId]);
  const { data: lessonPlans, isLoading: isLoadingPlans } = useCollection<LessonPlan>(plansQuery);

  const classesQuery = useMemoFirebase(() => {
    if (!user || !firestore || !schoolId) return null;
    let q = query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
    if (role === 'Teacher') {
      q = query(q, where('teacherId', '==', user.uid));
    }
    return q;
  }, [firestore, user, role, schoolId]);
  const { data: classes, isLoading: isLoadingClasses } = useCollection<ClassData>(classesQuery);

  // Guard the staff query so only admins execute it.
  const staffQuery = useMemoFirebase(() => (firestore && schoolId && isAdminOrDirector) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId, isAdminOrDirector]);
  const { data: staff, isLoading: isLoadingStaff } = useCollection<StaffData>(staffQuery);
  
  const isLoading = isLoadingPlans || isLoadingClasses || (isAdminOrDirector && isLoadingStaff) || isLoadingSchool;

  const enrichedLessonPlans = useMemo(() => {
    if (!lessonPlans || !classes) return [];
    
    return lessonPlans.map(plan => {
      const className = classes.find(c => c.id === plan.classId)?.name || 'Unknown Class';
      
      let teacherName = 'Unknown Teacher';
      if (role === 'Teacher' && plan.teacherId === user?.uid) {
          // If viewing own plans as a teacher, use own profile info.
          teacherName = profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'Me';
      } else if (staff) {
          // If viewing as admin, resolve from staff collection.
          const teacher = staff.find(s => s.uid === plan.teacherId);
          teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher';
      }
      
      return { ...plan, className, teacherName };
    });
  }, [lessonPlans, classes, staff, role, profile, user?.uid]);

  if (!canAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>This module is only available to Teachers, Administrators, and Directors.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList />
              Lesson Planning
            </CardTitle>
            <CardDescription>Create and manage daily lesson plans for your classes.</CardDescription>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button disabled={isLoading || !schoolId}>
                {(isLoading) ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                Create New Lesson Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Lesson Plan</DialogTitle>
                <DialogDescription>Fill out the form below to create a new lesson plan.</DialogDescription>
              </DialogHeader>
              <LessonPlanForm setOpen={setIsFormOpen} classes={classes || []} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : enrichedLessonPlans && enrichedLessonPlans.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {enrichedLessonPlans.map(plan => (
                <AccordionItem value={plan.id} key={plan.id}>
                  <AccordionTrigger>
                    <div className="flex justify-between w-full pr-4 text-sm">
                        <span className="font-semibold">{plan.topic}</span>
                        <div className='flex gap-4 text-muted-foreground'>
                            {role !== 'Teacher' && <span>{plan.teacherName}</span>}
                            <span>{plan.className}</span>
                            <span>{format(toDateSafe(plan.date), 'PPP')}</span>
                        </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <LessonPlanDetails plan={plan} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No lesson plans found.</p>
              <p className="text-sm text-muted-foreground">Click "Create New Lesson Plan" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
