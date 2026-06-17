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
import { 
    Loader2, PlusCircle, Star, TrendingUp, Sparkles, Printer, User, Lock, 
    CheckCircle2, AlertTriangle, ShieldCheck, ChevronRight, Award, Trophy, Compass, Check,
    ShieldAlert, FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { generateStaffAppraisalAction } from '@/app/actions/insights-ai';

const toDateSafe = (d: any): Date => {
    if (!d) return new Date();
    if (d instanceof Date) return d;
    if (d.toDate && typeof d.toDate === 'function') return d.toDate();
    if (d.seconds) return new Date(d.seconds * 1000);
    return new Date(d);
};

const getInitials = (name?: string) => {
  if (!name) return 'ST';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarGradient = (name?: string) => {
  if (!name) return 'from-slate-500 to-slate-600';
  const code = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-teal-400 to-emerald-600',
    'from-violet-500 to-purple-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-indigo-500 to-cyan-600'
  ];
  return gradients[code % gradients.length];
};

// --- COMPONENTS ---

function StarRating({ rating, setRating, readOnly = false, size = "md" }: { rating: number; setRating?: (rating: number) => void; readOnly?: boolean, size?: "sm" | "md" }) {
  const iconSize = size === "sm" ? "h-4.5 w-4.5" : "h-6 w-6";
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            iconSize,
            rating >= star ? 'text-yellow-500 fill-yellow-500 filter drop-shadow-sm' : 'text-slate-200',
            !readOnly && 'cursor-pointer hover:scale-115 active:scale-95 transition-transform'
          )}
          onClick={() => !readOnly && setRating && setRating(star)}
        />
      ))}
    </div>
  );
}

function MetricInput({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) {
    return (
        <div className="space-y-3.5 border border-slate-200 p-4 rounded-xl bg-slate-50/50 shadow-inner group transition-all hover:bg-slate-50/80 hover:border-slate-300">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">{label}</span>
                <span className="text-xs font-extrabold text-indigo-600 font-mono bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">{value}/5</span>
            </div>
            <Slider 
                defaultValue={[value]} 
                max={5} 
                step={1} 
                onValueChange={(vals) => onChange(vals[0])} 
                className="cursor-pointer py-1"
            />
            <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest px-0.5">
                <span>Improve</span>
                <span>Role Model</span>
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
  const selectedStaffId = form.watch('staffId');
  const averageRating = Math.round((metrics.teaching + metrics.punctuality + metrics.engagement + metrics.professionalism) / 4);

  const handleAiGenerate = async () => {
      if (!selectedStaffId) {
          toast({ variant: 'destructive', title: 'Action Denied', description: 'Please select a staff member first.' });
          return;
      }
      const staffMember = staffList.find(s => s.uid === selectedStaffId);
      const name = staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : 'Staff Member';

      setAiLoading(true);
      try {
          const res = await generateStaffAppraisalAction(schoolId, name, metrics);
          if (res.success && res.data) {
              form.setValue('strengths', res.data.strengths || '');
              form.setValue('improvementAreas', res.data.improvements || '');
              form.setValue('goals', res.data.goals || '');
              toast({ title: "AI Appraisal Draft Drafted", description: "Successfully generated comments based on metrics." });
          } else {
              throw new Error(res.error || "Failed to call AI.");
          }
      } catch (err: any) {
          console.error(err);
          toast({ variant: 'destructive', title: "AI Generation Failed", description: err.message || "Failed to generate evaluation feedback." });
      } finally {
          setAiLoading(false);
      }
  };

  async function onSubmit(values: any) {
    if (!firestore || !user || !schoolId) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'performanceReviews'), {
        ...values,
        rating: averageRating,
        reviewerId: user.uid,
        reviewerName: user.displayName || user.email,
        createdAt: serverTimestamp(),
        schoolId: schoolId,
      });
      toast({ title: 'Evaluation Logged', description: 'Performance review has been successfully recorded.' });
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in-50 duration-200">
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="staffId" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase text-slate-400">Staff Member</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="rounded-xl border border-slate-200 h-11 bg-white font-semibold text-slate-805 text-xs">
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl max-h-60">
                  {staffList
                    ?.filter(s => s.uid && s.firstName)
                    .map(s => (
                      <SelectItem key={s.uid} value={s.uid} className="text-xs font-semibold">
                        {s.firstName} {s.lastName}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
            )} />
            <FormField control={form.control} name="reviewDate" render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-xs font-black uppercase text-slate-400">Review Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant={'outline'} className={cn('pl-3 text-left font-semibold text-xs h-11 rounded-xl border border-slate-200 bg-white text-slate-800', !field.value && 'text-muted-foreground')}>
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 text-indigo-500 opacity-80" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus className="rounded-xl border-0 shadow-lg bg-white" />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
            )} />
        </div>

        <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1.5 flex items-center gap-1.5"><Trophy className="h-4 w-4 text-indigo-500"/> Performance Scorecard</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MetricInput label="Core Job / Teaching Quality" value={metrics.teaching} onChange={(v) => form.setValue('metrics.teaching', v)} />
                <MetricInput label="Punctuality & Attendance" value={metrics.punctuality} onChange={(v) => form.setValue('metrics.punctuality', v)} />
                <MetricInput label="Student & Team Engagement" value={metrics.engagement} onChange={(v) => form.setValue('metrics.engagement', v)} />
                <MetricInput label="Professionalism" value={metrics.professionalism} onChange={(v) => form.setValue('metrics.professionalism', v)} />
            </div>
            
            <div className="flex justify-between items-center bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 shadow-inner">
                <span className="font-extrabold text-indigo-900 text-xs uppercase tracking-wider">Calculated Rating:</span>
                <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-indigo-700 font-mono">{averageRating}/5</span>
                    <StarRating rating={averageRating} readOnly />
                </div>
            </div>
        </div>

        <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-1.5">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Compass className="h-4 w-4 text-indigo-500"/> Written Feedback Appraisal</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAiGenerate} 
                  disabled={aiLoading} 
                  className="text-xs text-purple-600 border-purple-200 bg-purple-50/40 hover:bg-purple-50 font-bold rounded-xl h-9 px-3 flex items-center gap-1"
                >
                    {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Sparkles className="w-3.5 h-3.5"/>}
                    AI Draft Appraisal
                </Button>
            </div>
            
            <FormField control={form.control} name="strengths" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase text-slate-400">Core Strengths</FormLabel>
              <FormControl>
                <Textarea placeholder="Detail key achievements and positive traits..." {...field} className="min-h-[80px] rounded-xl border border-slate-200 text-xs font-semibold placeholder:text-slate-400 focus-visible:ring-indigo-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
            )} />
            
            <FormField control={form.control} name="improvementAreas" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase text-slate-400">Areas for Improvement</FormLabel>
              <FormControl>
                <Textarea placeholder="Detail growth opportunities and constructive critique..." {...field} className="min-h-[80px] rounded-xl border border-slate-200 text-xs font-semibold placeholder:text-slate-400 focus-visible:ring-indigo-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
            )} />
            
            <FormField control={form.control} name="goals" render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase text-slate-400">Upcoming Goals</FormLabel>
              <FormControl>
                <Textarea placeholder="List actionable development goals for the next period..." {...field} className="rounded-xl border border-slate-200 text-xs font-semibold placeholder:text-slate-400 focus-visible:ring-indigo-500" />
              </FormControl>
              <FormMessage />
            </FormItem>
            )} />
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> : null} Submit Staff Appraisal
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
  const [acknowledgedList, setAcknowledgedList] = useState<Record<string, boolean>>({});

  const { toast } = useToast();

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

  // Set default selected staff for admin once loaded
  useEffect(() => {
      if (isAdmin && reviewableStaff.length > 0 && !selectedStaffId) {
          setSelectedStaffId(reviewableStaff[0].uid);
      }
  }, [isAdmin, reviewableStaff, selectedStaffId]);

  // 4. FETCH REVIEWS (Filtered by School & Staff)
  const reviewsQuery = useMemoFirebase(() => {
    if (!firestore || !user || !selectedStaffId || !schoolId) return null;
    return query(
        collection(firestore, 'performanceReviews'),
        where('staffId', '==', selectedStaffId),
        where('schoolId', '==', schoolId),
        orderBy('reviewDate', 'asc')
    );
  }, [firestore, user, selectedStaffId, schoolId]);
  const { data: rawReviews, isLoading: isLoadingReviews } = useCollection<PerformanceReview>(reviewsQuery);

  const sortedReviews = useMemo(() => rawReviews ? [...rawReviews].reverse() : [], [rawReviews]);
  
  const chartData = useMemo(() => {
      if (!rawReviews) return [];
      return rawReviews.map(r => ({
          date: format(toDateSafe(r.reviewDate), 'MMM dd'),
          rating: r.rating,
          metrics: r.metrics 
      }));
  }, [rawReviews]);

  const averages = useMemo(() => {
      if (!rawReviews || rawReviews.length === 0) return { overall: '0.0', teaching: '0.0', punctuality: '0.0', engagement: '0.0', professionalism: '0.0' };
      const count = rawReviews.length;
      let totalRating = 0, totalTeach = 0, totalPunct = 0, totalEng = 0, totalProf = 0;
      let metricCount = 0;

      rawReviews.forEach(r => {
         totalRating += r.rating;
         if (r.metrics) {
            totalTeach += r.metrics.teaching || 0;
            totalPunct += r.metrics.punctuality || 0;
            totalEng += r.metrics.engagement || 0;
            totalProf += r.metrics.professionalism || 0;
            metricCount++;
         }
      });

      const denominator = metricCount || 1;
      return {
         overall: (totalRating / count).toFixed(1),
         teaching: (totalTeach / denominator).toFixed(1),
         punctuality: (totalPunct / denominator).toFixed(1),
         engagement: (totalEng / denominator).toFixed(1),
         professionalism: (totalProf / denominator).toFixed(1),
      };
  }, [rawReviews]);

  const activeStaffMember = useMemo(() => {
      if (isAdmin) {
          return reviewableStaff.find(s => s.uid === selectedStaffId);
      }
      return { firstName: user?.displayName || 'My', lastName: 'Profile', email: user?.email };
  }, [isAdmin, reviewableStaff, selectedStaffId, user]);

  const handleAcknowledge = (reviewId: string) => {
      setAcknowledgedList(prev => ({ ...prev, [reviewId]: true }));
      toast({
         title: "Evaluation Acknowledged",
         description: "Your digital signature has been successfully logged for HR review.",
      });
  };

  // Block Access if neither Admin nor Staff
  if (!isStaff) {
    return (
      <div className="p-8 flex justify-center">
        <Card className="max-w-md w-full border-red-100 bg-red-50/50 rounded-3xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95">
            <CardHeader className="text-center p-8">
                <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4 animate-pulse">
                    <ShieldAlert className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl font-extrabold text-slate-900">Access Restricted</CardTitle>
                <CardDescription className="text-slate-500 mt-2">
                    Performance reviews and evaluation logs are restricted to school personnel.
                </CardDescription>
            </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto flex flex-col h-full">
      
      {/* Premium Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white p-6 md:p-8 shadow-xl border border-slate-800/40">
        <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-12 -translate-y-12">
          <TrendingUp className="w-96 h-96" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-500 text-white font-extrabold px-2.5 py-0.5 text-[10px] uppercase tracking-wider">
                {isAdmin ? 'ADMIN CONSOLE' : 'EMPLOYEE CENTER'}
              </Badge>
              <Badge className="bg-white/10 text-indigo-200 border border-white/10 font-bold px-2.5 py-0.5 text-[10px] uppercase">APPRAISALS</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white animate-in slide-in-from-left-4 duration-300">
               {isAdmin ? 'Staff Performance Appraisal' : 'My Performance Profile'}
            </h1>
            <p className="text-indigo-100/70 text-sm max-w-xl">
               {isAdmin ? 'Assess employee performance, analyze historic trends, and generate AI-guided appraisal feedback.' : 'Track your career path development, read HR reviews, and acknowledge appraisals.'}
            </p>
          </div>
          
          {isAdmin && (
            <div className="shrink-0 w-full md:w-auto">
              <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                     <PlusCircle className="mr-1.5 h-4.5 w-4.5" /> Log Evaluation Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-0 p-6 md:p-8 shadow-2xl bg-white animate-in fade-in-50 zoom-in-95">
                    <DialogHeader className="pb-3 border-b">
                       <DialogTitle className="text-slate-900 font-black tracking-tight text-xl flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-indigo-500"/> Staff Evaluation Form
                       </DialogTitle>
                       <DialogDescription className="font-semibold text-slate-500 text-xs">Evaluate staff performance metrics and draft written summaries.</DialogDescription>
                    </DialogHeader>
                    {schoolId && <PerformanceReviewForm setOpen={setFormOpen} staffList={reviewableStaff || []} schoolId={schoolId} />}
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Sidebar Employee Selector / Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b p-5">
                    <CardTitle className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        {isAdmin ? "Personnel Directory" : "My Profile Card"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                    {isAdmin ? (
                       <div className="space-y-3">
                           <Select onValueChange={setSelectedStaffId} value={selectedStaffId}>
                             <SelectTrigger className="w-full border rounded-xl h-11 bg-white shadow-sm font-bold text-xs"><SelectValue placeholder="Select Staff..." /></SelectTrigger>
                             <SelectContent className="max-h-60 rounded-xl">
                               {reviewableStaff?.map(s => <SelectItem key={s.id} value={s.uid} className="text-xs font-semibold">{s.firstName} {s.lastName}</SelectItem>)}
                             </SelectContent>
                           </Select>
                           
                           {/* Quick scrollable list directory */}
                           <div className="border-t pt-3 mt-1 space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                               {reviewableStaff?.map(s => {
                                  const active = selectedStaffId === s.uid;
                                  const initials = getInitials(`${s.firstName} ${s.lastName}`);
                                  const avatarGrad = getAvatarGradient(`${s.firstName} ${s.lastName}`);
                                  return (
                                     <button 
                                        key={s.uid}
                                        onClick={() => setSelectedStaffId(s.uid)}
                                        className={cn(
                                          "w-full text-left p-2.5 rounded-xl flex items-center justify-between border transition-all text-xs font-semibold",
                                          active ? "bg-indigo-50 border-indigo-200 text-indigo-900 shadow-inner scale-[0.98]" : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
                                        )}
                                     >
                                        <div className="flex items-center gap-2">
                                           <div className={cn("h-7 w-7 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-extrabold text-[9px] shadow-sm", avatarGrad)}>
                                              {initials}
                                           </div>
                                           <div>
                                              <span className="block font-extrabold">{s.firstName} {s.lastName}</span>
                                              <span className="text-[8px] text-slate-400 font-bold block uppercase mt-0.5">{s.role}</span>
                                           </div>
                                        </div>
                                        {active && <ChevronRight className="h-4 w-4 text-indigo-500" />}
                                     </button>
                                  );
                               })}
                           </div>
                       </div>
                    ) : (
                        <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 shadow-inner">
                            <div className="bg-gradient-to-br from-indigo-500 to-cyan-600 h-10 w-10 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md">
                               {getInitials(user?.displayName || 'ST')}
                            </div>
                            <div>
                                <p className="font-extrabold text-sm text-slate-800">{user?.displayName || 'Staff'}</p>
                                <p className="text-[10px] text-indigo-650 font-black uppercase font-mono tracking-wider">{role}</p>
                            </div>
                        </div>
                    )}
                    
                    {selectedStaffId && (
                        <div className="mt-6 flex flex-col items-center text-center space-y-4 pt-5 border-t">
                            <div className={cn("h-16 w-16 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-extrabold text-lg shadow-md border-4 border-white ring-2 ring-slate-100", getAvatarGradient(activeStaffMember?.firstName))}>
                                {getInitials(activeStaffMember?.firstName ? `${activeStaffMember.firstName} ${activeStaffMember.lastName || ''}` : '')}
                            </div>
                            <div>
                                <p className="font-black text-slate-800 text-base">{activeStaffMember?.firstName} {activeStaffMember?.lastName || ''}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{activeStaffMember?.email}</p>
                            </div>
                            
                            {/* Score Stats card */}
                            <div className="w-full pt-4 border-t bg-slate-50 border p-3 rounded-2xl shadow-inner font-mono text-center">
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Appraisal Average</div>
                                <div className="text-3xl font-black text-indigo-600 mt-1 font-sans">{averages.overall}</div>
                                <div className="flex justify-center mt-1.5"><StarRating rating={Math.round(Number(averages.overall))} readOnly size="sm"/></div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
          </div>

          {/* Main Appraisals Panel & Chart */}
          <div className="lg:col-span-3 space-y-6">
              
              {/* Performance History Chart */}
              {selectedStaffId && chartData.length > 0 && (
                  <Card className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white">
                      <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center justify-between">
                         <div>
                            <CardTitle className="text-slate-900 font-black tracking-tight text-base flex items-center gap-2"><TrendingUp className="h-5 w-5 text-indigo-500"/> Historic Appraisal Trend</CardTitle>
                            <CardDescription className="font-semibold text-slate-500 text-xs mt-0.5">Calculated scorecard growth metrics mapped chronologically.</CardDescription>
                         </div>
                      </CardHeader>
                      <CardContent className="p-6">
                          <div className="h-[250px] w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: -25 }}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                      <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                                      <YAxis domain={[0, 5]} ticks={[1,2,3,4,5]} stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                                      <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontFamily: 'monospace', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                      />
                                      <Line type="monotone" dataKey="rating" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 7 }} />
                                  </LineChart>
                              </ResponsiveContainer>
                          </div>
                      </CardContent>
                  </Card>
              )}

              {/* Scorecard metric averages */}
              {selectedStaffId && chartData.length > 0 && (
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-md flex flex-col items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase text-center">Teaching Quality</span>
                        <span className="text-2xl font-black text-slate-800 mt-2 font-mono">{averages.teaching}</span>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                           <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(Number(averages.teaching) / 5) * 100}%` }}></div>
                        </div>
                     </div>
                     <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-md flex flex-col items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase text-center">Punctuality</span>
                        <span className="text-2xl font-black text-slate-800 mt-2 font-mono">{averages.punctuality}</span>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                           <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(Number(averages.punctuality) / 5) * 100}%` }}></div>
                        </div>
                     </div>
                     <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-md flex flex-col items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase text-center">Student Engagement</span>
                        <span className="text-2xl font-black text-slate-800 mt-2 font-mono">{averages.engagement}</span>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                           <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(Number(averages.engagement) / 5) * 100}%` }}></div>
                        </div>
                     </div>
                     <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-md flex flex-col items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase text-center">Professionalism</span>
                        <span className="text-2xl font-black text-slate-800 mt-2 font-mono">{averages.professionalism}</span>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                           <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(Number(averages.professionalism) / 5) * 100}%` }}></div>
                        </div>
                     </div>
                 </div>
              )}

              {/* Feedback History Review Accordion Cards */}
              <Card className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center gap-4">
                  <div className="bg-indigo-500/10 text-indigo-600 rounded-2xl p-3 shadow-inner shrink-0">
                    <FileText className="h-6 w-6"/>
                  </div>
                  <div>
                    <CardTitle className="text-slate-900 font-black tracking-tight text-lg">Evaluation Log Archives</CardTitle>
                    <CardDescription className="font-semibold text-slate-500 text-xs mt-0.5">Written report sheets and scorecard details.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoadingReviews && (
                    <div className="space-y-3">
                       <Skeleton className="h-14 w-full rounded-xl" />
                       <Skeleton className="h-14 w-full rounded-xl" />
                    </div>
                  )}
                  
                  {!isLoadingReviews && selectedStaffId && sortedReviews.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full space-y-3.5">
                      {sortedReviews.map(review => {
                        const reviewD = toDateSafe(review.reviewDate);
                        const isAck = acknowledgedList[review.id] || false;
                        
                        return (
                          <AccordionItem value={review.id} key={review.id} className="border border-slate-200 rounded-2xl overflow-hidden px-4 hover:border-slate-300 bg-white transition-all">
                            <AccordionTrigger className="hover:no-underline py-4">
                              <div className='flex items-center gap-4 w-full pr-3'>
                                  <div className={cn(
                                    "flex flex-col items-center justify-center h-11 w-11 rounded-xl shadow-inner font-mono border",
                                    review.rating >= 4 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                    review.rating >= 3 ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                                    'bg-rose-50 text-rose-700 border-rose-200'
                                  )}>
                                      <span className="font-black text-lg">{review.rating}</span>
                                  </div>
                                  <div className="text-left flex-1">
                                      <p className="font-extrabold text-slate-800 text-xs">Evaluation Sheet: {format(reviewD, 'PPP')}</p>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Reviewer: {review.reviewerName}</p>
                                  </div>
                                  {isAck && (
                                     <Badge className="bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-extrabold text-[8px] uppercase tracking-wide rounded-md py-0.5 px-2">
                                        Signed Acknowledged
                                     </Badge>
                                  )}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-5 pt-3 border-t mt-1">
                               <div className="grid md:grid-cols-3 gap-6 items-start">
                                  {review.metrics ? (
                                      <div className="space-y-3 bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-inner md:col-span-1">
                                          <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Score Breakdown</h5>
                                          <div className="space-y-2 text-xs font-semibold text-slate-600">
                                            <div className="flex justify-between items-center"><span>Teaching:</span> <strong className="text-slate-850">{review.metrics.teaching}/5</strong></div>
                                            <div className="flex justify-between items-center border-t pt-1.5"><span>Punctuality:</span> <strong className="text-slate-850">{review.metrics.punctuality}/5</strong></div>
                                            <div className="flex justify-between items-center border-t pt-1.5"><span>Team Engagement:</span> <strong className="text-slate-850">{review.metrics.engagement}/5</strong></div>
                                            <div className="flex justify-between items-center border-t pt-1.5"><span>Professionalism:</span> <strong className="text-slate-850">{review.metrics.professionalism}/5</strong></div>
                                          </div>
                                      </div>
                                  ) : (
                                      <div className="md:col-span-1 bg-slate-50 p-4 rounded-xl border italic text-slate-400 text-xs">No metrics checklist logged.</div>
                                  )}
                                  
                                  <div className="space-y-4 md:col-span-2">
                                      {review.strengths && (
                                         <div className="bg-emerald-50/20 border border-emerald-100/60 p-3.5 rounded-xl">
                                            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1"><Award size={13}/> Core Strengths</span>
                                            <p className="text-xs text-slate-700 font-semibold mt-1.5 leading-relaxed">"{review.strengths}"</p>
                                         </div>
                                      )}
                                      {review.improvementAreas && (
                                         <div className="bg-amber-50/20 border border-amber-100/60 p-3.5 rounded-xl">
                                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1"><Compass size={13}/> Areas of Growth</span>
                                            <p className="text-xs text-slate-700 font-semibold mt-1.5 leading-relaxed">"{review.improvementAreas}"</p>
                                         </div>
                                      )}
                                      {review.goals && (
                                         <div className="bg-indigo-50/20 border border-indigo-100/60 p-3.5 rounded-xl">
                                            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1"><TrendingUp size={13}/> Development Goals</span>
                                            <p className="text-xs text-slate-700 font-semibold mt-1.5 leading-relaxed">"{review.goals}"</p>
                                         </div>
                                      )}
                                  </div>
                               </div>
                               
                               <div className="mt-6 pt-4 border-t flex justify-end">
                                  <Button 
                                    onClick={() => handleAcknowledge(review.id)}
                                    disabled={isAck}
                                    variant="outline" 
                                    size="sm" 
                                    className={cn(
                                       "text-xs font-extrabold h-9 rounded-xl px-4 transition-all flex items-center gap-1.5 active:scale-[0.98]",
                                       isAck ? "border-emerald-200 bg-emerald-50 text-emerald-600 cursor-default" : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                    )}
                                  >
                                      {isAck ? <Check className="h-4 w-4 text-emerald-600"/> : <CheckCircle2 className="h-4 w-4 text-slate-400"/>} 
                                      {isAck ? 'Evaluation Acknowledged' : 'Acknowledge Appraisal'}
                                  </Button>
                               </div>
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  ) : selectedStaffId ? (
                    <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed text-slate-400 flex flex-col items-center gap-3">
                        <FileText className="h-10 w-10 text-slate-300"/>
                        <p className="text-xs font-semibold italic">No performance appraisals have been logged for this staff member.</p>
                        {isAdmin && <Button variant="link" onClick={() => setFormOpen(true)} className="text-xs font-bold text-indigo-600 hover:underline">Write the first appraisal review</Button>}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-3">
                        <Lock className="h-10 w-10 text-slate-300 opacity-80"/>
                        <p className="text-xs font-semibold italic">Please select a profile from the directory to review records.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}
