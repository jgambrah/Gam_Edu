'use client';

import { useState, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
    Loader2, PlusCircle, Check, X, Calendar as CalendarIcon, 
    CheckCircle2, AlertTriangle, FileText, ArrowRight, ShieldCheck, 
    UserCheck, Inbox, ShieldAlert, Award, Plane, CalendarCheck, Clock, CheckSquare, Trash2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { LeaveRequest, leaveApplicationSchema, managerApprovalSchema, managerRejectionSchema, PublicHoliday, LEAVE_TYPES } from '@/lib/types';
import { useCurrentSchool } from '@/hooks/use-current-school';

const MOCK_PUBLIC_HOLIDAYS = [
  { name: "New Year's Day", date: new Date(new Date().getFullYear(), 0, 1) },
  { name: "Constitution Day", date: new Date(new Date().getFullYear(), 0, 7) },
  { name: "Independence Day", date: new Date(new Date().getFullYear(), 2, 6) },
  { name: "Good Friday", date: new Date(2025, 3, 18) },
  { name: "Easter Monday", date: new Date(2025, 3, 21) },
  { name: "May Day", date: new Date(new Date().getFullYear(), 4, 1) },
  { name: "Eid-ul-Fitr", date: new Date(2025, 2, 31) },
  { name: "Eid-ul-Adha", date: new Date(2025, 5, 7) },
  { name: "Founder's Day", date: new Date(new Date().getFullYear(), 7, 4) },
  { name: "Kwame Nkrumah Memorial Day", date: new Date(new Date().getFullYear(), 8, 21) },
  { name: "Farmer's Day", date: new Date(new Date().getFullYear(), 11, 5) },
  { name: "Christmas Day", date: new Date(new Date().getFullYear(), 11, 25) },
  { name: "Boxing Day", date: new Date(new Date().getFullYear(), 11, 26) }
];

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
    'from-rose-500 to-pink-650',
    'from-amber-400 to-orange-600',
    'from-indigo-500 to-cyan-600'
  ];
  return gradients[code % gradients.length];
};

const getDurationInDays = (start?: any, end?: any) => {
  if (!start || !end) return 0;
  const s = start.toDate ? start.toDate() : new Date(start);
  const e = end.toDate ? end.toDate() : new Date(end);
  return differenceInDays(e, s) + 1;
};

// --- Staff View: Form for applying for leave ---
function LeaveApplicationForm({ setOpen, schoolId }: { setOpen: (open: boolean) => void, schoolId: string }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const staffName = user?.displayName || user?.email;

  const form = useForm<z.infer<typeof leaveApplicationSchema>>({
    resolver: zodResolver(leaveApplicationSchema),
  });

  async function onSubmit(values: z.infer<typeof leaveApplicationSchema>) {
    if (!user || !staffName || !schoolId || !firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'Missing required data. Please refresh.' });
        return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'leaveRequests'), {
        ...values,
        staffId: user.uid,
        staffName: staffName,
        status: 'Pending',
        createdAt: serverTimestamp(),
        schoolId: schoolId,
      });
      toast({ title: 'Request Submitted', description: 'Your leave request has been submitted for approval.' });
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not submit your request.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 animate-in fade-in-50 duration-200">
        <FormField control={form.control} name="leaveType" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-black uppercase text-slate-400">Leave Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="rounded-xl border border-slate-200 h-11 bg-white font-semibold text-slate-800 text-xs">
                  <SelectValue placeholder="Select a leave type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="rounded-xl">
                {LEAVE_TYPES.map(type => <SelectItem key={type} value={type} className="text-xs font-semibold">{type}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xs font-black uppercase text-slate-400">Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={'outline'} className={cn('pl-3 text-left font-semibold text-xs h-11 rounded-xl border border-slate-200 bg-white text-slate-800', !field.value && 'text-muted-foreground')}>
                          {field.value ? format(field.value, 'PPP') : <span>Pick start date</span>}
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
            )}/>
            <FormField control={form.control} name="endDate" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-xs font-black uppercase text-slate-400">End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={'outline'} className={cn('pl-3 text-left font-semibold text-xs h-11 rounded-xl border border-slate-200 bg-white text-slate-800', !field.value && 'text-muted-foreground')}>
                          {field.value ? format(field.value, 'PPP') : <span>Pick end date</span>}
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
            )}/>
        </div>
        
        <FormField control={form.control} name="reason" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-xs font-black uppercase text-slate-400">Reason</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Please describe why you are requesting this leave..." 
                className="rounded-xl border border-slate-200 min-h-24 text-xs font-semibold placeholder:text-slate-400 focus-visible:ring-indigo-500" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full h-11 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-650 hover:to-purple-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] mt-2"
        >
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> : null} Submit Leave Request
        </Button>
      </form>
    </Form>
  );
}

// --- Staff View: Main Component ---
function StaffLeaveView() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const [isFormOpen, setFormOpen] = useState(false);

    const myRequestsQuery = useMemoFirebase(() => 
        (user && schoolId && firestore) ? query(collection(firestore, 'leaveRequests'), where('staffId', '==', user.uid), where('schoolId', '==', schoolId)) : null, 
    [firestore, user, schoolId]);
    const { data: myRequests, isLoading } = useCollection<LeaveRequest>(myRequestsQuery);

    const stats = useMemo(() => {
      if (!myRequests) return { total: 0, approved: 0, pending: 0 };
      return {
        total: myRequests.length,
        approved: myRequests.filter(r => r.status === 'Approved').length,
        pending: myRequests.filter(r => r.status === 'Pending').length,
      };
    }, [myRequests]);

    return (
        <div className="space-y-8 p-6 max-w-7xl mx-auto flex flex-col h-full">
            
            {/* Premium Staff Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 text-white p-6 md:p-8 shadow-xl border border-slate-950/40">
              <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-12 -translate-y-12">
                <Plane className="w-96 h-96" />
              </div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-indigo-500 text-white font-extrabold px-2.5 py-0.5 text-[10px] uppercase tracking-wider">EMPLOYEE PORTAL</Badge>
                    <Badge className="bg-white/10 text-indigo-200 border border-white/10 font-bold px-2.5 py-0.5 text-[10px] uppercase">LEAVE PLANNER</Badge>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white animate-in slide-in-from-left-4 duration-300">My Leave Planner</h1>
                  <p className="text-indigo-100/70 text-sm max-w-xl">Apply for paid/unpaid leaves, view state guidelines, and check the real-time status of your ongoing requests.</p>
                </div>
                
                <div className="shrink-0 w-full md:w-auto">
                  <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          disabled={!schoolId}
                          className="w-full md:w-auto h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <PlusCircle className="h-4 w-4" /> Apply for Leave
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-3xl border-0 p-6 md:p-8 max-w-md shadow-2xl bg-white animate-in fade-in-50 zoom-in-95">
                          <DialogHeader className="pb-3 border-b">
                              <DialogTitle className="text-slate-900 font-black tracking-tight text-xl flex items-center gap-2">
                                <Plane className="h-5 w-5 text-indigo-500"/> Apply for Time Off
                              </DialogTitle>
                              <DialogDescription className="font-semibold text-slate-500 text-xs">Complete the form details below to request a new leave period.</DialogDescription>
                          </DialogHeader>
                          {schoolId && <LeaveApplicationForm setOpen={setFormOpen} schoolId={schoolId} />}
                      </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="border border-slate-200/50 shadow-md bg-white rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
                    <div className="h-1 bg-slate-500"></div>
                    <CardHeader className="pb-1 pt-5 px-5 flex flex-row items-center justify-between">
                      <CardTitle className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Applied Requests</CardTitle>
                      <FileText className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent className="pb-5 px-5">
                      <p className="text-2xl md:text-3xl font-black text-slate-900">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card className="border border-amber-100 shadow-md bg-white rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
                    <div className="h-1 bg-amber-500"></div>
                    <CardHeader className="pb-1 pt-5 px-5 flex flex-row items-center justify-between">
                      <CardTitle className="text-[10px] font-black uppercase text-amber-500 tracking-wider">Awaiting Review</CardTitle>
                      <Clock className="h-4 w-4 text-amber-400" />
                    </CardHeader>
                    <CardContent className="pb-5 px-5">
                      <p className="text-2xl md:text-3xl font-black text-amber-600">{stats.pending}</p>
                    </CardContent>
                </Card>
                <Card className="border border-emerald-100 shadow-md bg-white rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
                    <div className="h-1 bg-emerald-500"></div>
                    <CardHeader className="pb-1 pt-5 px-5 flex flex-row items-center justify-between">
                      <CardTitle className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">Approved leaves</CardTitle>
                      <CheckSquare className="h-4 w-4 text-emerald-450" />
                    </CardHeader>
                    <CardContent className="pb-5 px-5">
                      <p className="text-2xl md:text-3xl font-black text-emerald-600">{stats.approved}</p>
                    </CardContent>
                </Card>
            </div>

            {/* My Requests Card & List */}
            <Card className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center gap-4">
                  <div className="bg-indigo-500/10 text-indigo-650 rounded-2xl p-3 shadow-inner shrink-0">
                    <CalendarCheck className="h-6 w-6"/>
                  </div>
                  <div>
                    <CardTitle className="text-slate-900 font-black tracking-tight text-lg">My Request History</CardTitle>
                    <CardDescription className="font-semibold text-slate-500 text-xs mt-0.5">Chronological summary of all leaves requested.</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                     {isLoading ? (
                        <div className="flex justify-center p-24 flex-col items-center gap-3">
                            <Loader2 className="h-9 w-9 animate-spin text-indigo-500 opacity-30" />
                            <p className="font-black text-[10px] uppercase tracking-wider text-slate-350">Syncing Request Ledger...</p>
                        </div>
                     ) : (
                        <div className="overflow-x-auto">
                          <Table>
                              <TableHeader className="bg-slate-50/70 border-b">
                                <TableRow>
                                  <TableHead className="font-black text-[10px] uppercase tracking-widest pl-8 py-5">Leave Category</TableHead>
                                  <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Leave Period / Duration</TableHead>
                                  <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Reason Details</TableHead>
                                  <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Review Status</TableHead>
                                  <TableHead className="font-black text-[10px] uppercase tracking-widest pr-8 py-5 text-right">Notes from Admin</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {myRequests?.map(req => {
                                      const startD = req.startDate?.toDate ? req.startDate.toDate() : new Date(req.startDate);
                                      const endD = req.endDate?.toDate ? req.endDate.toDate() : new Date(req.endDate);
                                      const duration = getDurationInDays(req.startDate, req.endDate);
                                      
                                      return (
                                          <TableRow key={req.id} className="hover:bg-slate-50/40 border-b border-slate-100 transition-colors h-16">
                                              <TableCell className="pl-8 font-extrabold text-slate-800 text-xs">{req.leaveType}</TableCell>
                                              <TableCell>
                                                  <div className="text-xs font-semibold text-slate-600">{format(startD, 'PPP')} - {format(endD, 'PPP')}</div>
                                                  <Badge variant="outline" className="mt-1 font-black text-[8px] border-indigo-200 text-indigo-600 bg-indigo-50/40 uppercase rounded-md py-0 px-1.5">{duration} Days duration</Badge>
                                              </TableCell>
                                              <TableCell className="max-w-xs truncate text-xs text-slate-500 font-semibold">{req.reason}</TableCell>
                                              <TableCell>
                                                  <Badge className={cn(
                                                    "font-black text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-lg border-0",
                                                    req.status === 'Approved' ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                                                    req.status === 'Rejected' ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-slate-100 text-slate-600"
                                                  )}>
                                                      {req.status}
                                                  </Badge>
                                              </TableCell>
                                              <TableCell className="pr-8 text-right text-xs text-slate-500 font-semibold italic max-w-xs truncate">
                                                {req.approverNotes || <span className="text-slate-300">Awaiting approver feedback</span>}
                                              </TableCell>
                                          </TableRow>
                                      );
                                  })}
                                  {(!myRequests || myRequests.length === 0) && (
                                      <TableRow>
                                          <TableCell colSpan={5} className="text-center py-20 text-slate-350 italic font-black uppercase tracking-[0.2em] text-xs">No leave requests found</TableCell>
                                      </TableRow>
                                  )}
                              </TableBody>
                          </Table>
                        </div>
                     )}
                </CardContent>
            </Card>
        </div>
    );
}

// --- Manager View Components ---

function TeamAvailabilityCalendar({ approvedLeaves }: { approvedLeaves: LeaveRequest[] }) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const onLeave = useMemo(() => {
        return approvedLeaves.flatMap(leave => {
            const dates = [];
            let currentDate = leave.startDate.toDate ? leave.startDate.toDate() : new Date(leave.startDate);
            const endDate = leave.endDate.toDate ? leave.endDate.toDate() : new Date(leave.endDate);
            
            // Limit loop guard to prevent crashes
            let count = 0;
            while (currentDate <= endDate && count < 100) {
                dates.push({ date: new Date(currentDate), staffName: leave.staffName });
                currentDate.setDate(currentDate.getDate() + 1);
                count++;
            }
            return dates;
        });
    }, [approvedLeaves]);

    const isHoliday = (date: Date) => MOCK_PUBLIC_HOLIDAYS.find(h => format(h.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

    const modifiers = {
        onLeave: onLeave.map(l => l.date),
        holiday: MOCK_PUBLIC_HOLIDAYS.map(h => h.date),
    };

    const selectedDateInfo = {
        leaves: onLeave.filter(l => format(l.date, 'yyyy-MM-dd') === (date ? format(date, 'yyyy-MM-dd') : '')),
        holiday: date ? isHoliday(date) : null
    };

    return (
         <Card className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-6">
              <CardTitle className="text-slate-900 font-black tracking-tight text-lg">Team Availability Roster</CardTitle>
              <CardDescription className="font-semibold text-slate-500 text-xs">Check which staff members are away or identify upcoming public holidays.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 grid md:grid-cols-2 gap-6 items-start">
                <div className="flex justify-center border border-slate-100 p-2 rounded-2xl shadow-inner bg-slate-50/40">
                  <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-xl border-0 bg-transparent text-slate-800"
                      modifiers={modifiers}
                      modifiersClassNames={{
                        onLeave: "bg-amber-500 text-white hover:bg-amber-600 focus:bg-amber-600 rounded-full font-black",
                        holiday: "bg-indigo-650 text-white hover:bg-indigo-700 focus:bg-indigo-700 rounded-full font-black",
                      }}
                  />
                </div>
                
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl h-full min-h-[300px] flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-3 pb-1.5 border-b flex items-center justify-between">
                         <span>Date Details</span>
                         <span className="text-indigo-600 text-[10px] font-mono">{date ? format(date, 'PPPP') : 'Select Date'}</span>
                      </h4>
                      
                      {selectedDateInfo.holiday && (
                        <div className="mb-4 bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center gap-2">
                           <Award className="h-5 w-5 text-indigo-655" />
                           <div>
                              <p className="font-extrabold text-xs text-indigo-900 uppercase">National Holiday</p>
                              <p className="text-[10px] text-indigo-700 font-bold mt-0.5">{selectedDateInfo.holiday.name}</p>
                           </div>
                        </div>
                      )}
                      
                      {selectedDateInfo.leaves.length > 0 ? (
                         <div className="space-y-2">
                            <p className="font-extrabold text-[10px] text-amber-650 uppercase tracking-widest flex items-center gap-1.5"><Plane className="h-4.5 w-4.5" /> Staff Out Of Office:</p>
                            <ul className="grid grid-cols-1 gap-2">
                                {selectedDateInfo.leaves.map((l, i) => (
                                  <li key={i} className="bg-white border border-slate-150 p-2.5 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-2.5">
                                      <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-700">{getInitials(l.staffName)}</div>
                                      <span>{l.staffName}</span>
                                  </li>
                                ))}
                            </ul>
                         </div>
                      ) : (
                         !selectedDateInfo.holiday && (
                            <div className="text-center py-10 text-slate-400 flex flex-col items-center gap-3">
                               <CheckCircle2 className="h-10 w-10 text-emerald-450 opacity-80" />
                               <p className="text-xs font-semibold italic">Everyone is fully available. No staff leaves registered.</p>
                            </div>
                         )
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t text-[9px] font-black font-mono text-slate-400 flex justify-between uppercase">
                       <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500"></span> Staff On Leave</span>
                       <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-indigo-600"></span> Public Holiday</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ManagerApprovalDialog({ request, setOpen, action }: { request: LeaveRequest, setOpen: (open: boolean) => void, action: 'Approve' | 'Reject' }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const formSchema = action === 'Approve' ? managerApprovalSchema : managerRejectionSchema;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { notes: '' }
    });

    async function handleDecision(values: z.infer<typeof formSchema>) {
        if (!user || !firestore) return;
        setIsSubmitting(true);
        try {
            const requestRef = doc(firestore, 'leaveRequests', request.id);
            await updateDoc(requestRef, {
                status: action === 'Approve' ? 'Approved' : 'Rejected',
                approverId: user.uid,
                approverName: user.displayName || user.email,
                approverNotes: values.notes
            });
            toast({ title: 'Success', description: `Request has been ${action.toLowerCase()}d.` });
            setOpen(false);
        } catch(e) {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not process request.'});
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
         <DialogContent className="rounded-3xl border-0 p-6 md:p-8 max-w-md shadow-2xl bg-white text-slate-800 animate-in fade-in-50 zoom-in-95">
            <DialogHeader className="pb-3 border-b">
                <DialogTitle className="text-slate-900 font-black tracking-tight text-xl">
                   {action} Leave Request?
                </DialogTitle>
                <DialogDescription className="font-semibold text-slate-500 text-xs">
                   You are about to {action.toLowerCase()} the request for <span className="font-black text-slate-800">{request.staffName}</span>.
                </DialogDescription>
            </DialogHeader>
            
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-xs space-y-1.5 font-semibold mt-4 text-slate-650">
               <div>Leave Category: <span className="text-slate-850 font-extrabold">{request.leaveType}</span></div>
               <div>Duration: <span className="text-indigo-600 font-extrabold">{getDurationInDays(request.startDate, request.endDate)} Days</span></div>
               <div className="border-t pt-1.5 mt-1 text-slate-500 italic">" {request.reason} "</div>
            </div>

            <Form {...form}>
                <form id="approval-form" onSubmit={form.handleSubmit(handleDecision)} className="space-y-4 mt-4">
                     <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-black uppercase text-slate-400">
                               {action === 'Approve' ? 'Approver Notes (Optional)' : 'Reason for Rejection'}
                            </FormLabel>
                            <FormControl>
                               <Textarea 
                                 placeholder={action === 'Approve' ? 'Add notes or remarks...' : 'Please write details explaining rejection...'} 
                                 className="rounded-xl border border-slate-200 min-h-20 text-xs font-semibold placeholder:text-slate-400 focus-visible:ring-indigo-500"
                                 {...field} 
                               />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                     )} />
                </form>
            </Form>
            
            <div className="flex gap-3 justify-end mt-6 pt-3 border-t">
                <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl h-11 px-5 text-xs font-extrabold border-slate-200">Cancel</Button>
                <Button 
                  type="submit" 
                  form="approval-form" 
                  disabled={isSubmitting}
                  className={cn(
                    "rounded-xl h-11 px-5 text-xs font-extrabold text-white shadow-md active:scale-[0.98] transition-all",
                    action === 'Approve' ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-650 hover:to-teal-700" : "bg-gradient-to-r from-rose-500 to-red-650 hover:from-rose-600 hover:to-red-750"
                  )}
                >
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" /> : null}
                    Confirm {action}
                </Button>
            </div>
        </DialogContent>
    );
}

function ManagerLeaveView() {
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();

  const { data: allRequests, isLoading } = useCollection<LeaveRequest>(
    useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'leaveRequests'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId])
  );

  const pendingRequests = useMemo(() => allRequests?.filter(r => r.status === 'Pending') || [], [allRequests]);
  const approvedRequests = useMemo(() => allRequests?.filter(r => r.status === 'Approved') || [], [allRequests]);
  const resolvedRequests = useMemo(() => allRequests?.filter(r => r.status === 'Approved' || r.status === 'Rejected') || [], [allRequests]);

  const [dialogState, setDialogState] = useState<{ open: boolean, request: LeaveRequest | null, action: 'Approve' | 'Reject' }>({ open: false, request: null, action: 'Approve' });

  const openDialog = (request: LeaveRequest, action: 'Approve' | 'Reject') => {
      setDialogState({ open: true, request: request, action: action });
  };
  
  const closeDialog = () => {
    setDialogState({ open: false, request: null, action: 'Approve' });
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto flex flex-col h-full">
        
        {/* Premium Manager Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-955 text-white p-6 md:p-8 shadow-xl border border-slate-950/40">
          <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-12 -translate-y-12">
            <UserCheck className="w-96 h-96" />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Badge className="bg-indigo-500 text-white font-extrabold px-2.5 py-0.5 text-[10px] uppercase tracking-wider">ADMINISTRATIVE VIEW</Badge>
                <Badge className="bg-white/10 text-indigo-200 border border-white/10 font-bold px-2.5 py-0.5 text-[10px] uppercase">LEAVE MANAGER</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white animate-in slide-in-from-left-4 duration-300">Staff Leave Approval Center</h1>
              <p className="text-indigo-100/70 text-sm max-w-xl">Review pending leave applications, track total team absences, and log institutional approval codes.</p>
            </div>
            
            <div className="flex gap-3 shrink-0 print:hidden w-full md:w-auto">
              <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3 w-full md:w-auto">
                 <Inbox className="h-5 w-5 text-indigo-300" />
                 <div>
                    <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 block">Pending Reviews</span>
                    <span className="text-sm font-extrabold text-white font-mono">{pendingRequests.length} Requests</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Availability calendar */}
        <TeamAvailabilityCalendar approvedLeaves={approvedRequests} />

        {/* Pending Requests Grid Card Overhaul */}
        <Card className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-slate-900 font-black tracking-tight text-lg">Pending Leave Requests</CardTitle>
                <CardDescription className="font-semibold text-slate-500 text-xs mt-0.5">Personnel applications awaiting review decision.</CardDescription>
              </div>
              <Badge className="bg-amber-50 text-amber-700 border border-amber-200 uppercase font-black text-[9px] py-1 px-3">
                 {pendingRequests.length} Action Needed
              </Badge>
            </CardHeader>
            <CardContent className="p-6">
                 {isLoading ? (
                    <div className="flex justify-center py-20 flex-col items-center gap-3">
                        <Loader2 className="h-9 w-9 animate-spin text-indigo-500 opacity-30" />
                        <p className="font-black text-[10px] uppercase tracking-wider text-slate-350">Syncing database log...</p>
                    </div>
                 ) : pendingRequests.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-3">
                       <Inbox className="h-12 w-12 text-slate-300"/>
                       <p className="text-sm font-extrabold italic">No leave applications currently awaiting review.</p>
                    </div>
                 ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-200">
                        {pendingRequests.map(req => {
                            const startD = req.startDate?.toDate ? req.startDate.toDate() : new Date(req.startDate);
                            const endD = req.endDate?.toDate ? req.endDate.toDate() : new Date(req.endDate);
                            const duration = getDurationInDays(req.startDate, req.endDate);
                            const initials = getInitials(req.staffName);
                            const gradient = getAvatarGradient(req.staffName);
                            
                            return (
                                <Card key={req.id} className="border border-slate-150 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-slate-350">
                                   <div className="p-5 space-y-4">
                                      <div className="flex items-center justify-between gap-3 pb-3 border-b">
                                         <div className="flex items-center gap-2.5">
                                            <div className={cn("h-8 w-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-extrabold text-[10px] shadow-sm", gradient)}>
                                               {initials}
                                            </div>
                                            <div>
                                               <span className="font-extrabold text-slate-800 text-xs block group-hover:text-indigo-650 transition-colors">{req.staffName}</span>
                                               <span className="text-[9px] font-bold text-slate-400 uppercase">UID: {req.staffId.slice(0, 8)}</span>
                                            </div>
                                         </div>
                                         <Badge className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-[8px] uppercase tracking-wider border-0 py-0.5 px-2 rounded-md">
                                            {req.leaveType}
                                         </Badge>
                                      </div>
                                      
                                      <div className="text-xs space-y-1 bg-slate-50 border p-3 rounded-xl font-semibold">
                                         <div className="flex justify-between items-center text-slate-500">
                                            <span>Period:</span>
                                            <span className="text-slate-800 font-bold">{format(startD, 'LLL dd')} - {format(endD, 'LLL dd, y')}</span>
                                         </div>
                                         <div className="flex justify-between items-center text-slate-500 border-t pt-1.5 mt-1">
                                            <span>Absence Duration:</span>
                                            <span className="text-indigo-600 font-extrabold">{duration} Days</span>
                                         </div>
                                      </div>

                                      <div className="text-xs text-slate-500 italic leading-relaxed border-l-2 pl-3 py-1 font-semibold border-slate-200">
                                         "{req.reason}"
                                      </div>
                                   </div>

                                   <div className="bg-slate-50 border-t p-3 flex gap-2.5">
                                      <Button 
                                         variant="outline" 
                                         size="sm" 
                                         onClick={() => openDialog(req, 'Reject')}
                                         className="flex-1 bg-white border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-650 hover:border-rose-200 font-extrabold text-xs rounded-xl h-10 transition-all active:scale-[0.98]"
                                      >
                                         <X className="mr-1.5 h-3.5 w-3.5" /> Reject
                                      </Button>
                                      <Button 
                                         size="sm" 
                                         onClick={() => openDialog(req, 'Approve')}
                                         className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs rounded-xl h-10 shadow-sm transition-all active:scale-[0.98]"
                                      >
                                         <Check className="mr-1.5 h-3.5 w-3.5" /> Approve
                                      </Button>
                                   </div>
                                </Card>
                            );
                        })}
                    </div>
                 )}
            </CardContent>
        </Card>

        {dialogState.open && dialogState.request && (
             <Dialog open={dialogState.open} onOpenChange={closeDialog}>
                <ManagerApprovalDialog request={dialogState.request} setOpen={closeDialog} action={dialogState.action} />
             </Dialog>
        )}

        {/* Resolved Requests Audit Log */}
        <Card className="rounded-3xl border border-slate-200 shadow-xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center gap-4">
              <div className="bg-slate-700/10 text-slate-800 rounded-2xl p-3 shadow-inner shrink-0">
                <CheckSquare className="h-6 w-6"/>
              </div>
              <div>
                <CardTitle className="text-slate-900 font-black tracking-tight text-lg">Resolved Requests Audit Log</CardTitle>
                <CardDescription className="font-semibold text-slate-500 text-xs mt-0.5">Historical log of approved and rejected leave requests.</CardDescription>
              </div>
            </CardHeader>
             <CardContent className="p-0">
                 {isLoading ? (
                    <div className="flex justify-center py-20 flex-col items-center gap-3">
                        <Loader2 className="h-9 w-9 animate-spin text-indigo-500 opacity-30" />
                        <p className="font-black text-[10px] uppercase tracking-wider text-slate-350">Loading archives...</p>
                    </div>
                 ) : (
                    <div className="overflow-x-auto">
                      <Table>
                          <TableHeader className="bg-slate-50/70 border-b">
                            <TableRow>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest pl-8 py-5">Staff Member</TableHead>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Leave Category</TableHead>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Leave Period / Duration</TableHead>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest py-5">Review Outcome</TableHead>
                              <TableHead className="font-black text-[10px] uppercase tracking-widest pr-8 py-5 text-right">Approver Remarks</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                              {resolvedRequests.map(req => {
                                  const startD = req.startDate?.toDate ? req.startDate.toDate() : new Date(req.startDate);
                                  const endD = req.endDate?.toDate ? req.endDate.toDate() : new Date(req.endDate);
                                  const duration = getDurationInDays(req.startDate, req.endDate);
                                  const initials = getInitials(req.staffName);
                                  const gradient = getAvatarGradient(req.staffName);
                                  
                                  return (
                                      <TableRow key={req.id} className="hover:bg-slate-50/40 border-b border-slate-100 transition-colors h-16">
                                          <TableCell className="pl-8">
                                              <div className="flex items-center gap-2.5">
                                                 <div className={cn("h-7 w-7 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-extrabold text-[9px] shadow-sm", gradient)}>
                                                    {initials}
                                                 </div>
                                                 <div>
                                                    <span className="font-extrabold text-slate-800 text-xs block">{req.staffName}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">ID: {req.staffId.slice(0, 8)}</span>
                                                 </div>
                                              </div>
                                          </TableCell>
                                          <TableCell className="font-extrabold text-slate-800 text-xs">{req.leaveType}</TableCell>
                                          <TableCell>
                                              <div className="text-xs font-semibold text-slate-600">{format(startD, 'PPP')} - {format(endD, 'PPP')}</div>
                                              <Badge variant="outline" className="mt-1 font-black text-[8px] border-indigo-100 text-indigo-650 bg-indigo-50/40 uppercase rounded-md py-0 px-1.5">{duration} Days</Badge>
                                          </TableCell>
                                          <TableCell>
                                              <Badge className={cn(
                                                "font-black text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-lg border-0",
                                                req.status === 'Approved' ? "bg-emerald-50 text-emerald-700 border border-emerald-250" : "bg-rose-50 text-rose-700 border border-rose-250"
                                              )}>
                                                  {req.status}
                                              </Badge>
                                          </TableCell>
                                          <TableCell className="pr-8 text-right text-xs text-slate-500 font-semibold italic max-w-xs truncate">
                                            {req.approverNotes ? `"${req.approverNotes}"` : <span className="text-slate-350">No notes recorded</span>}
                                          </TableCell>
                                      </TableRow>
                                  );
                              })}
                              {resolvedRequests.length === 0 && (
                                  <TableRow>
                                      <TableCell colSpan={5} className="text-center py-20 text-slate-350 italic font-black uppercase tracking-[0.2em] text-xs">No resolved requests found</TableCell>
                                  </TableRow>
                              )}
                          </TableBody>
                      </Table>
                    </div>
                 )}
            </CardContent>
        </Card>
    </div>
  );
}

// --- Main Page Component ---
export default function LeaveManagementPage() {
  const { role } = useRole();

  const isManager = role === 'Administrator' || role === 'Director';
  const isStaff = ['Teacher', 'Accountant', 'Librarian', 'Cook', 'Transport Staff', 'Cleaner', 'Security Officer', 'Secretary', 'Receptionist'].includes(role || '') || isManager;
  
  if (!isStaff) {
    return (
      <div className="p-8 flex justify-center">
        <Card className="max-w-md w-full border-red-100 bg-red-50/50 rounded-3xl shadow-xl overflow-hidden">
            <CardHeader className="text-center p-8">
                <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4 animate-pulse">
                    <ShieldAlert className="h-8 w-8 text-red-650" />
                </div>
                <CardTitle className="text-xl font-extrabold text-slate-900">Access Restricted</CardTitle>
                <CardDescription className="text-slate-500 mt-2">
                    Leave Management portals are restricted to academic staff and institutional administrative personnel.
                </CardDescription>
            </CardHeader>
        </Card>
      </div>
    );
  }

  return isManager ? <ManagerLeaveView /> : <StaffLeaveView />;
}
