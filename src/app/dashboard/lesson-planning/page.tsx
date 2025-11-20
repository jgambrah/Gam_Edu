
'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
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
  const { role } = useRole();
  const { user } = useAuth();
  const firestore = useFirestore();
  const [isFormOpen, setFormOpen] = useState(false);

  const canAccess = role === 'Teacher' || role === 'Administrator' || role === 'Director';

  const lessonPlansQuery = useMemoFirebase(() => {
    if (!user) return null;
    if (role === 'Teacher') {
      return query(collection(firestore, 'lesson-plans'), where('teacherId', '==', user.uid), orderBy('date', 'desc'));
    }
    if (role === 'Administrator' || role === 'Director') {
      return query(collection(firestore, 'lesson-plans'), orderBy('date', 'desc'));
    }
    return null;
  }, [firestore, user, role]);

  const { data: lessonPlans, isLoading } = useCollection<LessonPlan>(lessonPlansQuery);
  const { data: classes } = useCollection<ClassData>(useMemoFirebase(() => user ? collection(firestore, 'classes') : null, [firestore, user]));
  const { data: staff } = useCollection<StaffData>(useMemoFirebase(() => user ? collection(firestore, 'staff') : null, [firestore, user]));
  
  const enrichedLessonPlans = useMemo(() => {
    if (!lessonPlans || !classes || !staff) return [];
    return lessonPlans.map(plan => {
      const className = classes.find(c => c.id === plan.classId)?.name || 'Unknown Class';
      const teacher = staff.find(s => s.uid === plan.teacherId);
      const teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher';
      return { ...plan, className, teacherName };
    });
  }, [lessonPlans, classes, staff]);

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
          <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Lesson Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Lesson Plan</DialogTitle>
                <DialogDescription>Fill out the form below to create a new lesson plan.</DialogDescription>
              </DialogHeader>
              <LessonPlanForm setOpen={setFormOpen} />
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
                            <span>{format(plan.date.toDate(), 'PPP')}</span>
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
