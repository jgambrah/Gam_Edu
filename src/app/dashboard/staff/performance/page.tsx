
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Star, TrendingUp, Sparkles, Printer, User, Lock, CheckCircle2 } from 'lucide-react';
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
import { PerformanceReview, performanceReviewSchema, Staff } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Slider } from "@/components/ui/slider";
import PerformanceSetup from '@/components/PerformanceSetup';
import { useCurrentSchool } from '@/hooks/use-current-school';

// --- COMPONENTS ---

function StarRating({ rating, setRating, readOnly = false, size = "md" }: { rating: number; setRating?: (rating: number) => void; readOnly?: boolean, size?: "sm" | "md" }) {
  const iconSize = size === "sm" ? "h-4 w-4" : "h-6 w-6";
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            iconSize,
            rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200',
            !readOnly && 'cursor-pointer hover:scale-110 transition-transform'
          )}
          onClick={() => !readOnly && setRating && setRating(star)}
        />
      ))}
    </div>
  );
}

function MetricInput({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) {
    return (
        <div className="space-y-2 border p-3 rounded-lg bg-slate-50/50">
            <div className="flex justify-between">
                <span className="text-sm font-medium">{label}</span>
                <span className="text-sm font-bold text-indigo-600">{value}/5</span>
            </div>
            <Slider 
                defaultValue={[value]} 
                max={5} 
                step={1} 
                onValueChange={(vals) => onChange(vals[0])} 
                className="cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                <span>Poor</span>
                <span>Excellent</span>
            </div>
        </div>
    );
}

function PerformanceReviewForm({ setOpen, staffList, schoolId }: { setOpen: (open: boolean) => void, staffList: Staff[], schoolId: string }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      staffId: '',
      reviewDate: new Date(),
      metrics: { teaching: 3, punctuality: 3, engagement: 3, professionalism: 3 },
      rating: 0,
      strengths: '',
      improvementAreas: '',
      goals: '',
      staffComments: ''
    },
  });

  const metrics = form.watch('metrics');
  const averageRating = Math.round((metrics.teaching + metrics.punctuality + metrics.engagement + metrics.professionalism) / 4);

  const handleAiGenerate = async () => {
      setAiLoading(true);
      setTimeout(() => {
        form.setValue('strengths', 'Excellent classroom management and rapport with students.');
        form.setValue('improvementAreas', 'Could incorporate more technology into lessons.');
        form.setValue('goals', 'Complete a professional development course on digital teaching tools.');
        toast({ title: "AI Draft Generated (Mock)" });
        setAiLoading(false);
      }, 1000);
  };

  async function onSubmit(values: any) {
    if (!user || !schoolId) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'performanceReviews'), {
        ...values,
        rating: averageRating,
        reviewerId: user.uid,
        reviewerName: user.displayName || user.email,
        createdAt: serverTimestamp(),
        schoolId: schoolId, // SAAS STAMP
      });
      toast({ title: 'Success', description: 'Performance review has been logged.' });
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not log the review.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="staffId" render={({ field }) => (
            <FormItem><FormLabel>Staff Member</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select staff" /></SelectTrigger></FormControl>
            <SelectContent>
              {staffList
                ?.filter(s => s.uid && s.firstName)
                .map(s => (
                  <SelectItem key={s.id} value={s.uid}>
                    {s.firstName} {s.lastName}
                  </SelectItem>
                ))
              }
            </SelectContent>
            </Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="reviewDate" render={({ field }) => (
            <FormItem className="flex flex-col"><FormLabel>Review Date</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
            )} />
        </div>

        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-1">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricInput label="Teaching Quality" value={metrics.teaching} onChange={(v) => form.setValue('metrics.teaching', v)} />
                <MetricInput label="Punctuality & Attendance" value={metrics.punctuality} onChange={(v) => form.setValue('metrics.punctuality', v)} />
                <MetricInput label="Student Engagement" value={metrics.engagement} onChange={(v) => form.setValue('metrics.engagement', v)} />
                <MetricInput label="Professionalism" value={metrics.professionalism} onChange={(v) => form.setValue('metrics.professionalism', v)} />
            </div>
            <div className="flex justify-between items-center bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                <span className="font-bold text-indigo-900">Calculated Score:</span>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-indigo-700">{averageRating}/5</span>
                    <StarRating rating={averageRating} readOnly />
                </div>
            </div>
        </div>

        <div className="space-y-3">
            <div className="flex justify-between items-end">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider border-b pb-1 flex-1">Written Feedback</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAiGenerate} disabled={aiLoading} className="text-xs text-purple-600 border-purple-200 hover:bg-purple-50">
                    {aiLoading ? <Loader2 className="w-3 h-3 animate-spin mr-1"/> : <Sparkles className="w-3 h-3 mr-1"/>}
                    Auto-Write
                </Button>
            </div>
            
            <FormField control={form.control} name="strengths" render={({ field }) => (
            <FormItem><FormLabel>Strengths</FormLabel><FormControl><Textarea placeholder="Key achievements..." {...field} className="min-h-[80px]" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="improvementAreas" render={({ field }) => (
            <FormItem><FormLabel>Areas for Improvement</FormLabel><FormControl><Textarea placeholder="Growth opportunities..." {...field} className="min-h-[80px]" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="goals" render={({ field }) => (
            <FormItem><FormLabel>Goals for Next Period</FormLabel><FormControl><Textarea placeholder="Actionable goals..." {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Submit Evaluation
        </Button>
      </form>
    </Form>
  );
}

// --- MAIN PAGE ---
export default function PerformanceReviewsPage() {
  const { role } = useRole();
  const { user } = useUser();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [isFormOpen, setFormOpen] = useState(false);

  // 1. DETERMINE PERMISSIONS
  const isAdmin = ['Admin', 'Administrator', 'Director'].includes(role || '');
  const isStaff = ['Teacher', 'Staff', 'Accountant', 'Librarian'].includes(role || '') || isAdmin;

  // 2. AUTO-SELECT FOR STAFF
  useEffect(() => {
      if (!isAdmin && user?.uid) {
          setSelectedStaffId(user.uid);
      }
  }, [isAdmin, user]);

  // 3. FETCH STAFF LIST (Admin Only, Filtered by School)
  const staffQuery = useMemoFirebase(() => {
      if (!isAdmin || !firestore || !schoolId) return null;
      return query(collection(firestore, 'staff'), where('schoolId', '==', schoolId));
    }, [firestore, isAdmin, schoolId]);
  const { data: staffList } = useCollection<Staff>(staffQuery);
  
  const reviewableStaff = useMemo(() => {
    if (!staffList) return [];
    return staffList.filter(s => 
        s.uid &&
        s.firstName &&
        !['Administrator', 'Director'].includes(s.role)
    );
  }, [staffList]);

  // 4. FETCH REVIEWS (Filtered by School & Staff)
  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore || !user || !selectedStaffId || !schoolId) return null;
    return query(
        collection(firestore, 'performanceReviews'),
        where('staffId', '==', selectedStaffId),
        where('schoolId', '==', schoolId), // SAAS Filter
        orderBy('reviewDate', 'asc')
    );
  }, [firestore, user, selectedStaffId, schoolId]);
  const { data: rawReviews, isLoading: isLoadingReviews } = useCollection<PerformanceReview>(reviewsQuery);

  const sortedReviews = useMemo(() => rawReviews ? [...rawReviews].reverse() : [], [rawReviews]);
  
  const chartData = useMemo(() => {
      if (!rawReviews) return [];
      return rawReviews.map(r => ({
          date: r.reviewDate?.toDate ? format(r.reviewDate.toDate(), 'MMM dd') : 'N/A',
          rating: r.rating,
          metrics: r.metrics 
      }));
  }, [rawReviews]);

  // Block Access if neither Admin nor Staff
  if (!isStaff) {
    return <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>Unauthorized.</CardDescription></CardHeader></Card>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
              {isAdmin ? "Staff Appraisals" : "My Performance Profile"}
          </h1>
          <p className="text-muted-foreground">
              {isAdmin ? "Monitor performance trends and growth." : "Track your growth and professional development."}
          </p>
        </div>
        
        {isAdmin && (
            <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild><Button className="bg-indigo-600 hover:bg-indigo-700"><PlusCircle className="mr-2 h-4 w-4" /> New Evaluation</Button></DialogTrigger>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Staff Evaluation Form</DialogTitle><DialogDescription>Rate performance across key metrics.</DialogDescription></DialogHeader>
                {schoolId && <PerformanceReviewForm setOpen={setFormOpen} staffList={reviewableStaff || []} schoolId={schoolId} />}
            </DialogContent>
            </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <Card className="lg:col-span-1 h-fit">
              <CardHeader>
                  <CardTitle className="text-sm uppercase text-slate-500">
                      {isAdmin ? "Employee Selector" : "My Profile"}
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  {isAdmin ? (
                      <Select onValueChange={setSelectedStaffId}>
                        <SelectTrigger><SelectValue placeholder="Select Staff..." /></SelectTrigger>
                        <SelectContent>{reviewableStaff?.map(s => <SelectItem key={s.id} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}</SelectContent>
                      </Select>
                  ) : (
                      <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                          <div className="bg-indigo-200 p-2 rounded-full"><User className="h-5 w-5 text-indigo-700"/></div>
                          <div>
                              <p className="font-bold text-sm text-indigo-900">{user?.displayName || 'Me'}</p>
                              <p className="text-xs text-indigo-600">{role}</p>
                          </div>
                      </div>
                  )}
                  
                  {selectedStaffId && (
                      <div className="mt-6 flex flex-col items-center text-center space-y-2">
                          <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center border-2 border-indigo-100">
                              <User className="h-10 w-10 text-slate-400" />
                          </div>
                          {isAdmin && (
                              <div>
                                  <p className="font-bold text-lg">{reviewableStaff.find(s => s.uid === selectedStaffId)?.firstName}</p>
                                  <p className="text-xs text-muted-foreground">Staff Member</p>
                              </div>
                          )}
                          <div className="w-full pt-4 border-t mt-2">
                              <div className="text-xs text-slate-500">Overall Average</div>
                              <div className="text-2xl font-bold text-indigo-600">
                                  {chartData.length > 0 ? (chartData.reduce((acc, curr) => acc + curr.rating, 0) / chartData.length).toFixed(1) : 0}
                              </div>
                          </div>
                      </div>
                  )}
              </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-6">
              
              {selectedStaffId && chartData.length > 0 && (
                  <Card>
                      <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><TrendingUp className="h-4 w-4"/> Performance History</CardTitle></CardHeader>
                      <CardContent>
                          <div className="h-[250px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                      <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                      <YAxis domain={[0, 5]} ticks={[1,2,3,4,5]} stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                      <Tooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                      />
                                      <Line type="monotone" dataKey="rating" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                  </LineChart>
                              </ResponsiveContainer>
                          </div>
                      </CardContent>
                  </Card>
              )}

              <Card>
                <CardHeader><CardTitle>Feedback & Reviews</CardTitle></CardHeader>
                <CardContent>
                  {isLoadingReviews && <Skeleton className="h-24 w-full" />}
                  
                  {!isLoadingReviews && selectedStaffId && sortedReviews.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full space-y-2">
                      {sortedReviews.map(review => (
                        <AccordionItem value={review.id} key={review.id} className="border rounded-lg px-2">
                          <AccordionTrigger className="hover:no-underline">
                            <div className='flex items-center gap-4 w-full'>
                                <div className={`flex flex-col items-center justify-center h-10 w-10 rounded-lg ${review.rating >= 4 ? 'bg-green-100 text-green-700' : review.rating >= 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                    <span className="font-bold">{review.rating}</span>
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-semibold text-sm">Evaluation on {review.reviewDate?.toDate ? format(review.reviewDate.toDate(), 'PPP') : 'N/A'}</p>
                                    <p className="text-xs text-muted-foreground">Reviewer: {review.reviewerName}</p>
                                </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="p-4 bg-slate-50 rounded-b-lg border-t mt-2">
                             <div className="grid md:grid-cols-2 gap-6 mb-4">
                                {review.metrics && (
                                    <div className="space-y-2 bg-white p-3 rounded border">
                                        <h5 className="text-xs font-bold text-slate-500 uppercase">Scorecard</h5>
                                        <div className="flex justify-between text-sm"><span>Teaching</span> <strong>{review.metrics.teaching}/5</strong></div>
                                        <div className="flex justify-between text-sm"><span>Punctuality</span> <strong>{review.metrics.punctuality}/5</strong></div>
                                        <div className="flex justify-between text-sm"><span>Engagement</span> <strong>{review.metrics.engagement}/5</strong></div>
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <div><span className="text-xs font-bold text-green-600 uppercase">Strengths</span><p className="text-sm text-slate-700">{review.strengths}</p></div>
                                    <div><span className="text-xs font-bold text-orange-600 uppercase">Improvements</span><p className="text-sm text-slate-700">{review.improvementAreas}</p></div>
                                </div>
                             </div>
                             
                             <div className="mt-4 pt-4 border-t flex justify-end">
                                <Button variant="outline" size="sm" className="text-xs gap-2" disabled>
                                    <CheckCircle2 className="h-3 w-3 text-green-600"/> 
                                    Acknowledged
                                </Button>
                             </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : selectedStaffId ? (
                    <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed">
                        <p className="text-muted-foreground">No reviews found.</p>
                        {isAdmin && <Button variant="link" onClick={() => setFormOpen(true)}>Create the first one</Button>}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
                        <Lock className="h-8 w-8 mb-2 opacity-20"/>
                        <p>No profile selected.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}
