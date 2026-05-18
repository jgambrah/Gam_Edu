'use client';

import { useState, useMemo } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Check, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { LeaveRequest, leaveApplicationSchema, managerApprovalSchema, managerRejectionSchema, PublicHoliday, LeaveStatus, Staff, LEAVE_TYPES } from '@/lib/types';
import { MOCK_PUBLIC_HOLIDAYS } from '@/lib/data';
import { useCurrentSchool } from '@/hooks/use-current-school';


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
        schoolId: schoolId, // SAAS STAMP
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="leaveType" render={({ field }) => (
          <FormItem><FormLabel>Leave Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a leave type" /></SelectTrigger></FormControl><SelectContent>
          {LEAVE_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
          </SelectContent></Select><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="endDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
            )}/>
        </div>
        <FormField control={form.control} name="reason" render={({ field }) => (
          <FormItem><FormLabel>Reason</FormLabel><FormControl><Textarea placeholder="Please provide a brief reason for your leave request..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Submit Request
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
        (user && schoolId) ? query(collection(firestore, 'leaveRequests'), where('staffId', '==', user.uid), where('schoolId', '==', schoolId)) : null, 
    [firestore, user, schoolId]);
    const { data: myRequests, isLoading } = useCollection<LeaveRequest>(myRequestsQuery);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className='flex flex-row justify-between items-center'>
                    <CardTitle>My Leave Requests</CardTitle>
                    <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                        <DialogTrigger asChild><Button disabled={!schoolId}><PlusCircle className="mr-2 h-4 w-4" /> Apply for Leave</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>New Leave Application</DialogTitle><DialogDescription>Fill out the form below to request time off.</DialogDescription></DialogHeader>
                            {schoolId && <LeaveApplicationForm setOpen={setFormOpen} schoolId={schoolId} />}
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                     {isLoading ? <div className='flex justify-center p-8'><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                        <Table>
                            <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Dates</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {myRequests?.map(req => (
                                    <TableRow key={req.id}>
                                        <TableCell>{req.leaveType}</TableCell>
                                        <TableCell>{format(req.startDate.toDate(), 'PPP')} - {format(req.endDate.toDate(), 'PPP')}</TableCell>
                                        <TableCell className="max-w-xs truncate">{req.reason}</TableCell>
                                        <TableCell><Badge>{req.status}</Badge></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                     )}
                </CardContent>
            </Card>
        </div>
    );
}


// --- Manager View Components ---

function TeamAvailabilityCalendar({ approvedLeaves, holidays }: { approvedLeaves: LeaveRequest[], holidays: PublicHoliday[] }) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const onLeave = approvedLeaves.flatMap(leave => {
        const dates = [];
        let currentDate = leave.startDate.toDate();
        const endDate = leave.endDate.toDate();
        while (currentDate <= endDate) {
            dates.push({ date: new Date(currentDate), staffName: leave.staffName });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    });

    const isHoliday = (date: Date) => MOCK_PUBLIC_HOLIDAYS.find(h => format(h.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));

    const modifiers = {
        onLeave: onLeave.map(l => l.date),
        holiday: MOCK_PUBLIC_HOLIDAYS.map(h => h.date),
    };
    const modifiersStyles = {
        onLeave: { backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' },
        holiday: { backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' },
    };

    const selectedDateInfo = {
        leaves: onLeave.filter(l => format(l.date, 'yyyy-MM-dd') === (date ? format(date, 'yyyy-MM-dd') : '')),
        holiday: date ? isHoliday(date) : null
    }

    return (
         <Card>
            <CardHeader><CardTitle>Team Availability</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                />
                <div>
                    <h4 className="font-semibold mb-2">Details for {date ? format(date, 'PPP') : 'selected date'}:</h4>
                    {selectedDateInfo.holiday && <p className="font-bold text-primary">{selectedDateInfo.holiday.name}</p>}
                    <ul className="list-disc pl-5">
                        {selectedDateInfo.leaves.map((l, i) => <li key={i}>{l.staffName}</li>)}
                    </ul>
                    {!selectedDateInfo.holiday && selectedDateInfo.leaves.length === 0 && <p className="text-muted-foreground text-sm">Everyone is available.</p>}
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
        if (!user) return;
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
         <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{action} Leave Request?</AlertDialogTitle>
                <AlertDialogDescription>You are about to {action.toLowerCase()} the leave request for <strong>{request.staffName}</strong> from {format(request.startDate.toDate(), 'PPP')} to {format(request.endDate.toDate(), 'PPP')}.</AlertDialogDescription>
            </AlertDialogHeader>
            <Form {...form}>
                <form id="approval-form" onSubmit={form.handleSubmit(handleDecision)}>
                     <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem>
                            <FormLabel>{action === 'Approve' ? 'Approver Notes (Optional)' : 'Rejection Reason (Required)'}</FormLabel>
                            <FormControl><Textarea {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                     )} />
                </form>
            </Form>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <Button type="submit" form="approval-form" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Confirm {action}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
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
    <div className="space-y-6">
        <TeamAvailabilityCalendar approvedLeaves={approvedRequests} holidays={[]} />
        <Card>
            <CardHeader><CardTitle>Pending Leave Requests</CardTitle></CardHeader>
            <CardContent>
                 {isLoading ? <div className='flex justify-center p-8'><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                     <Table>
                        <TableHeader><TableRow><TableHead>Staff Name</TableHead><TableHead>Dates</TableHead><TableHead>Reason</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {pendingRequests.map(req => (
                                <TableRow key={req.id}>
                                    <TableCell>{req.staffName}</TableCell>
                                    <TableCell>{format(req.startDate.toDate(), 'PPP')} - {format(req.endDate.toDate(), 'PPP')}</TableCell>
                                    <TableCell className="max-w-sm truncate">{req.reason}</TableCell>
                                    <TableCell className="space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => openDialog(req, 'Approve')}><Check className="mr-1 h-4 w-4" />Approve</Button>
                                        <Button variant="destructive" size="sm" onClick={() => openDialog(req, 'Reject')}><X className="mr-1 h-4 w-4" />Reject</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                     </Table>
                 )}
                 {pendingRequests.length === 0 && !isLoading && <p className="text-center text-muted-foreground p-4">No pending requests.</p>}
            </CardContent>
        </Card>

        {dialogState.open && dialogState.request && (
             <AlertDialog open={dialogState.open} onOpenChange={closeDialog}>
                <ManagerApprovalDialog request={dialogState.request} setOpen={closeDialog} action={dialogState.action} />
             </AlertDialog>
        )}

        <Card>
            <CardHeader><CardTitle>Resolved Requests</CardTitle></CardHeader>
             <CardContent>
                 {isLoading ? <div className='flex justify-center p-8'><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                     <Table>
                        <TableHeader><TableRow><TableHead>Staff Name</TableHead><TableHead>Dates</TableHead><TableHead>Status</TableHead><TableHead>Approver Notes</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {resolvedRequests.map(req => (
                                <TableRow key={req.id}>
                                    <TableCell>{req.staffName}</TableCell>
                                    <TableCell>{format(req.startDate.toDate(), 'PPP')} - {format(req.endDate.toDate(), 'PPP')}</TableCell>
                                    <TableCell><Badge variant={req.status === 'Approved' ? 'default' : 'destructive'}>{req.status}</Badge></TableCell>
                                    <TableCell>{req.approverNotes}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                     </Table>
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
  const isStaff = ['Teacher', 'Accountant', 'Librarian', 'Cook', 'Transport Staff', 'Cleaner', 'Security Officer'].includes(role || '') || isManager;
  
  if (!isStaff) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>This module is only accessible to staff members.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return isManager ? <ManagerLeaveView /> : <StaffLeaveView />;
}
