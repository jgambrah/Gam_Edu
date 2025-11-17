'use client';

import { useState, useMemo } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { PerformanceReview, performanceReviewSchema, Staff, UserRole } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

// Star rating component
function StarRating({ rating, setRating, readOnly = false }: { rating: number; setRating?: (rating: number) => void; readOnly?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'h-6 w-6',
            rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300',
            !readOnly && 'cursor-pointer'
          )}
          onClick={() => !readOnly && setRating && setRating(star)}
        />
      ))}
    </div>
  );
}

// Performance Review Form
function PerformanceReviewForm({ setOpen }: { setOpen: (open: boolean) => void }) {
  const firestore = useFirestore();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const staffQuery = useMemoFirebase(() => {
    const excludedRoles: UserRole[] = ['Administrator', 'Director'];
    return query(collection(firestore, 'staff'), where('role', 'not-in', excludedRoles));
  }, [firestore]);
  const { data: staffList } = useCollection<Staff>(staffQuery);

  const form = useForm<z.infer<typeof performanceReviewSchema>>({
    resolver: zodResolver(performanceReviewSchema),
    defaultValues: {
      rating: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof performanceReviewSchema>) {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'performanceReviews'), {
        ...values,
        reviewerId: user.uid,
        reviewerName: user.displayName || user.email,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Success', description: 'Performance review has been logged.' });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error logging review:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not log the review.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="staffId" render={({ field }) => (
          <FormItem><FormLabel>Staff Member</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a staff member" /></SelectTrigger></FormControl><SelectContent>{staffList?.map(s => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="reviewDate" render={({ field }) => (
            <FormItem className="flex flex-col"><FormLabel>Review Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="rating" render={({ field }) => (
            <FormItem><FormLabel>Overall Rating</FormLabel><FormControl><StarRating rating={field.value} setRating={field.onChange} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="strengths" render={({ field }) => (
          <FormItem><FormLabel>Strengths</FormLabel><FormControl><Textarea placeholder="Note down observed strengths..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="improvementAreas" render={({ field }) => (
          <FormItem><FormLabel>Areas for Improvement</FormLabel><FormControl><Textarea placeholder="Note down areas for professional growth..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="goals" render={({ field }) => (
          <FormItem><FormLabel>Goals for Next Period</FormLabel><FormControl><Textarea placeholder="Set clear, actionable goals..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="staffComments" render={({ field }) => (
          <FormItem><FormLabel>Staff Comments (Optional)</FormLabel><FormControl><Textarea placeholder="Record any comments from the staff member..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Log Review
        </Button>
      </form>
    </Form>
  );
}

// Main page component
export default function PerformanceReviewsPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [isFormOpen, setFormOpen] = useState(false);

  const staffQuery = useMemoFirebase(() => {
    const excludedRoles: UserRole[] = ['Administrator', 'Director'];
    return query(collection(firestore, 'staff'), where('role', 'not-in', excludedRoles));
  }, [firestore]);
  const { data: staffList } = useCollection<Staff>(staffQuery);

  const reviewsQuery = useMemoFirebase(
    () => selectedStaffId ? query(collection(firestore, 'performanceReviews'), where('staffId', '==', selectedStaffId), orderBy('reviewDate', 'desc')) : null,
    [firestore, selectedStaffId]
  );
  const { data: reviews, isLoading: isLoadingReviews } = useCollection<PerformanceReview>(reviewsQuery);
  
  if (role !== 'Administrator' && role !== 'Director') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>This module is only accessible to Administrators and Directors.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Performance Reviews</h1>
          <p className="text-muted-foreground">Document, track, and review staff appraisals.</p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Log New Review</Button></DialogTrigger>
          <DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>New Performance Review</DialogTitle><DialogDescription>Fill out the form to log a new review for a staff member.</DialogDescription></DialogHeader><PerformanceReviewForm setOpen={setFormOpen} /></DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Staff Member</CardTitle>
          <div className="w-full md:w-1/3 pt-2">
            <Select onValueChange={setSelectedStaffId}>
              <SelectTrigger><SelectValue placeholder="Select a staff member to view reviews" /></SelectTrigger>
              <SelectContent>{staffList?.map(s => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingReviews && selectedStaffId && (
             <div className="space-y-2">
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
            </div>
          )}

          {!isLoadingReviews && selectedStaffId && reviews && reviews.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              {reviews.map(review => (
                <AccordionItem value={review.id} key={review.id}>
                  <AccordionTrigger>
                    <div className='flex justify-between items-center w-full pr-4'>
                        <span>Review on {format(review.reviewDate.toDate(), 'PPP')} by {review.reviewerName}</span>
                        <StarRating rating={review.rating} readOnly />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 bg-muted/50 rounded-md space-y-4">
                     <div className='prose prose-sm max-w-none'>
                        <h4>Strengths</h4><p>{review.strengths}</p>
                        <h4>Areas for Improvement</h4><p>{review.improvementAreas}</p>
                        <h4>Goals for Next Period</h4><p>{review.goals}</p>
                        {review.staffComments && <><h4>Staff Comments</h4><p className='italic'>{review.staffComments}</p></>}
                     </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          {!isLoadingReviews && selectedStaffId && (!reviews || reviews.length === 0) && (
            <div className="text-center py-10"><p className="text-muted-foreground">No performance reviews found for this staff member.</p></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
