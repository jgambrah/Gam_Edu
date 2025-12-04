

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useDoc, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, doc, writeBatch, serverTimestamp, updateDoc, setDoc, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, MoreVertical, FileCog, Edit, Utensils, Bus, User, ChevronDown, ChevronUp, DollarSign, HandCoins, Receipt } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isPast } from 'date-fns';
import { FinancialRecord, financialRecordSchema, bulkBillingSchema, recordPaymentSchema, applyWaiverSchema, Student, Till } from '@/lib/types';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


// --- Forms ---
function FinancialRecordForm({ setOpen, students, onRecordAdded }: { setOpen: (open: boolean) => void; students: Student[], onRecordAdded: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof financialRecordSchema>>({
    resolver: zodResolver(financialRecordSchema),
    defaultValues: { type: 'Tuition Fee', billedAmount: 0 }
  });

  async function onSubmit(values: z.infer<typeof financialRecordSchema>) {
    if (!firestore) return;
    setIsSubmitting(true);
    try {
        const student = students.find(s => s.uid === values.studentId);
        if(!student) throw new Error("Student not found");

      const newRecord = {
        ...values,
        studentName: `${student.firstName} ${student.lastName}`,
        classId: student.classId,
        amountPaid: 0,
        status: isPast(values.dueDate) ? 'Overdue' : 'Unpaid',
        createdAt: serverTimestamp(),
      };
      await addDocumentNonBlocking(collection(firestore, 'financialRecords'), newRecord);
      toast({ title: 'Success', description: 'Financial record added.' });
      onRecordAdded();
      setOpen(false);
      form.reset();
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add record.' });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="studentId" render={({ field }) => (
            <FormItem><FormLabel>Student</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a student"/></SelectTrigger></FormControl><SelectContent>{students.map(s => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )}/>
        <FormField control={form.control} name="type" render={({ field }) => (
            <FormItem><FormLabel>Fee Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{['Tuition Fee', 'Library Fine', 'Lab Fee', 'Sports Fee', 'Canteen Fee', 'Transport Fee', 'Other'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )}/>
        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="billedAmount" render={({ field }) => (
                <FormItem><FormLabel>Billed Amount (GH₵)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="dueDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Due Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                <Button variant={'outline'} className={cn('pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>
            )}/>
        </div>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Add Record</Button>
      </form>
    </Form>
  )
}

function BulkBillingForm({ setOpen, classes, students, onRecordsAdded }: { setOpen: (open: boolean) => void; classes: any[], students: Student[], onRecordsAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<z.infer<typeof bulkBillingSchema>>({
      resolver: zodResolver(bulkBillingSchema),
      defaultValues: { type: 'Tuition Fee' }
    });
  
    async function onSubmit(values: z.infer<typeof bulkBillingSchema>) {
      if (!firestore) return;
      setIsSubmitting(true);
      const studentsInClass = students.filter(s => s.classId === values.classId);
      if(studentsInClass.length === 0) {
        toast({variant: 'destructive', title: 'No Students', description: 'There are no students in the selected class.'});
        setIsSubmitting(false);
        return;
      }

      try {
        const batch = writeBatch(firestore);
        studentsInClass.forEach(student => {
            const newRecordRef = doc(collection(firestore, 'financialRecords'));
            batch.set(newRecordRef, {
                ...values,
                studentId: student.uid,
                studentName: `${student.firstName} ${student.lastName}`,
                amountPaid: 0,
                status: isPast(values.dueDate) ? 'Overdue' : 'Unpaid',
                createdAt: serverTimestamp(),
            });
        });
        await batch.commit();
        toast({ title: 'Success', description: `Billed ${studentsInClass.length} students successfully.` });
        onRecordsAdded();
        setOpen(false);
        form.reset();
      } catch (e) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to create bulk bills.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="classId" render={({ field }) => (
                <FormItem><FormLabel>Class</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a class"/></SelectTrigger></FormControl><SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>Fee Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{['Tuition Fee', 'Lab Fee', 'Sports Fee', 'Canteen Fee', 'Transport Fee', 'Other'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="e.g., Spring Term Tuition" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="billedAmount" render={({ field }) => (
                    <FormItem><FormLabel>Amount per Student (GH₵)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="dueDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>Due Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                    <Button variant={'outline'} className={cn('pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                    </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>
                )}/>
            </div>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Add Bulk Bill</Button>
        </form>
      </Form>
    )
}

function RecordPaymentDialog({ record, setOpen, onUpdate }: { record: FinancialRecord, setOpen: (open: boolean) => void, onUpdate: () => void }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const balance = record.billedAmount - record.amountPaid - (record.waiverAmount || 0);

    const form = useForm<z.infer<typeof recordPaymentSchema>>({
        resolver: zodResolver(recordPaymentSchema),
        defaultValues: { method: 'Card' }
    });

    async function onSubmit(values: z.infer<typeof recordPaymentSchema>) {
        if (!firestore || !user) return;
        if(values.amount > balance) {
            form.setError('amount', { message: 'Payment cannot exceed balance.' });
            return;
        }
        setIsSubmitting(true);
        try {
            const batch = writeBatch(firestore);
            const recordRef = doc(firestore, 'financialRecords', record.id);
            const newAmountPaid = record.amountPaid + values.amount;
            const newStatus = newAmountPaid >= record.billedAmount ? 'Paid' : record.status;
            
            batch.update(recordRef, {
                amountPaid: newAmountPaid,
                status: newStatus,
            });

            // If payment is cash, log it to the active till
            if (values.method === 'Cash') {
                const tillQuery = query(collection(firestore, 'tills'), where('accountantId', '==', user.uid), where('status', '==', 'Open'));
                const tillSnapshot = await getDocs(tillQuery);
                if (tillSnapshot.empty) {
                    throw new Error("You do not have an open till. Please open a till before recording cash payments.");
                }
                const activeTill = tillSnapshot.docs[0];
                const transactionRef = doc(collection(firestore, `tills/${activeTill.id}/transactions`));
                batch.set(transactionRef, {
                    tillId: activeTill.id,
                    financialRecordId: record.id,
                    studentId: record.studentId,
                    studentName: record.studentName,
                    amount: values.amount,
                    timestamp: serverTimestamp(),
                    description: `Fee Payment: ${record.description}`
                });
            }

            await batch.commit();

            toast({ title: 'Success', description: 'Payment recorded.' });
            onUpdate();
            setOpen(false);
        } catch(e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: e.message || 'Failed to record payment.' });
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <DialogContent>
            <DialogHeader><DialogTitle>Record Payment for {record.studentName}</DialogTitle><DialogDescription>Balance due: GH₵{balance.toFixed(2)}</DialogDescription></DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="amount" render={({ field }) => (
                        <FormItem><FormLabel>Payment Amount (GH₵)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="method" render={({ field }) => (
                        <FormItem><FormLabel>Payment Method</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{['Cash', 'Card', 'Bank Transfer', 'Other'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem><FormLabel>Notes (Optional)</FormLabel><FormControl><Textarea {...field}/></FormControl><FormMessage /></FormItem>
                    )}/>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Record Payment</Button>
                </form>
            </Form>
        </DialogContent>
    );
}

function ApplyWaiverDialog({ record, setOpen, onUpdate }: { record: FinancialRecord, setOpen: (open: boolean) => void, onUpdate: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const balance = record.billedAmount - record.amountPaid - (record.waiverAmount || 0);

    const form = useForm<z.infer<typeof applyWaiverSchema>>({ resolver: zodResolver(applyWaiverSchema) });

    async function onSubmit(values: z.infer<typeof applyWaiverSchema>) {
        if (!firestore) return;
        if(values.amount > balance) {
            form.setError('amount', { message: 'Waiver cannot exceed balance.' });
            return;
        }
        setIsSubmitting(true);
        try {
            const recordRef = doc(firestore, 'financialRecords', record.id);
            const newWaiverAmount = (record.waiverAmount || 0) + values.amount;
            const newStatus = (record.amountPaid + newWaiverAmount) >= record.billedAmount ? 'Paid' : record.status;

            await updateDoc(recordRef, {
                waiverAmount: newWaiverAmount,
                waiverReason: values.reason,
                status: newStatus
            });

            toast({ title: 'Success', description: 'Waiver applied.' });
            onUpdate();
            setOpen(false);
        } catch(e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to apply waiver.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DialogContent>
            <DialogHeader><DialogTitle>Apply Waiver/Concession for {record.studentName}</DialogTitle></DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="amount" render={({ field }) => (
                        <FormItem><FormLabel>Waiver Amount (GH₵)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="reason" render={({ field }) => (
                        <FormItem><FormLabel>Reason for Waiver</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Apply Waiver</Button>
                </form>
            </Form>
        </DialogContent>
    );
}

function EditRecordDialog({ record, setOpen, onUpdate }: { record: FinancialRecord, setOpen: (open: boolean) => void, onUpdate: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Create a schema specifically for editing, inheriting from the base schema
    const editSchema = financialRecordSchema.omit({ studentId: true }); // Can't change the student

    const form = useForm<z.infer<typeof editSchema>>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            type: record.type,
            description: record.description,
            billedAmount: record.billedAmount,
            dueDate: record.dueDate.toDate(), // Convert Firestore Timestamp to Date
        }
    });

    async function onSubmit(values: z.infer<typeof editSchema>) {
        if (!firestore) return;
        setIsSubmitting(true);
        try {
            const recordRef = doc(firestore, 'financialRecords', record.id);
            await updateDocumentNonBlocking(recordRef, values);
            toast({ title: 'Success', description: 'Record updated successfully.' });
            onUpdate();
            setOpen(false);
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update record.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Financial Record</DialogTitle>
                <DialogDescription>
                    Editing record for <strong>{record.studentName}</strong>.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField control={form.control} name="type" render={({ field }) => (
                        <FormItem><FormLabel>Fee Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{['Tuition Fee', 'Library Fine', 'Lab Fee', 'Sports Fee', 'Canteen Fee', 'Transport Fee', 'Other'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="billedAmount" render={({ field }) => (
                            <FormItem><FormLabel>Billed Amount (GH₵)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="dueDate" render={({ field }) => (
                            <FormItem className="flex flex-col"><FormLabel>Due Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={'outline'} className={cn('pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                            </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>
                        )}/>
                    </div>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Save Changes</Button>
                </form>
            </Form>
        </DialogContent>
    );
}

// --- Main Page ---
export default function AccountsPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const [activeForm, setActiveForm] = useState<'single' | 'bulk' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogState, setDialogState] = useState<{ type: 'payment' | 'waiver'; record: FinancialRecord | null }>({ type: 'payment', record: null });
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null);


  const finQuery = useMemoFirebase(() => firestore ? collection(firestore, 'financialRecords') : null, [firestore]);
  const { data: records, isLoading: isLoadingRecords, forceRefetch } = useCollection<FinancialRecord>(finQuery);
  
  const studentQuery = useMemoFirebase(() => firestore ? collection(firestore, 'students') : null, [firestore]);
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentQuery);

  const { data: classes } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'classes') : null, [firestore]));

  const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);
  const isLoading = isLoadingRecords || isLoadingStudents;

  const dashboardStats = useMemo(() => {
    if (!records) {
        return {
            totalRevenue: 0,
            totalOutstanding: 0,
            outstandingTuition: 0,
            outstandingCanteen: 0,
            outstandingTransport: 0,
        };
    }

    let totalPaid = 0;
    let totalBilled = 0;
    let outstandingTuition = 0;
    let outstandingCanteen = 0;
    let outstandingTransport = 0;

    for (const record of records) {
        const balance = record.billedAmount - record.amountPaid - (record.waiverAmount || 0);
        totalBilled += record.billedAmount;
        totalPaid += record.amountPaid + (record.waiverAmount || 0);

        if (balance > 0) {
            if (record.type === 'Tuition Fee') outstandingTuition += balance;
            else if (record.type === 'Canteen Fee') outstandingCanteen += balance;
            else if (record.type === 'Transport Fee') outstandingTransport += balance;
        }
    }
    
    return {
        totalRevenue: totalPaid,
        totalOutstanding: totalBilled - totalPaid,
        outstandingTuition,
        outstandingCanteen,
        outstandingTransport
    };
  }, [records]);

  const getStudentById = (studentId: string) => students?.find(s => s.uid === studentId);

  const studentFinancials = useMemo(() => {
    if (!records || !students) return [];

    const financialsByStudent = students.map(student => {
      const studentRecords = records.filter(r => r.studentId === student.uid);
      const totalBilled = studentRecords.reduce((acc, r) => acc + r.billedAmount, 0);
      const totalPaid = studentRecords.reduce((acc, r) => acc + r.amountPaid, 0);
      const totalWaivers = studentRecords.reduce((acc, r) => acc + (r.waiverAmount || 0), 0);
      const balance = totalBilled - totalPaid - totalWaivers;

      return {
        student,
        records: studentRecords,
        balance,
        hasOverdue: studentRecords.some(r => r.status === 'Overdue'),
      };
    });

    return financialsByStudent.filter(sf => 
        sf.records.length > 0 &&
        (sf.student.firstName + " " + sf.student.lastName).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, students, searchTerm]);


  const getStatusVariant = (status: FinancialRecord['status']) => {
    switch (status) {
      case 'Paid': return 'default';
      case 'Unpaid': return 'secondary';
      case 'Overdue': return 'destructive';
      default: return 'outline';
    }
  };

  if (!canAccess) {
    return (
      <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is restricted to financial staff.</CardDescription></CardHeader></Card>
    );
  }

  const handleOpenDialog = (type: 'payment' | 'waiver', record: FinancialRecord) => {
    setDialogState({ type, record });
  };
  
  const handleCloseDialog = () => {
    setDialogState({ type: 'payment', record: null });
  };
  
  const handleOpenEditDialog = (record: FinancialRecord) => {
    setEditingRecord(record);
  };
  
  const handleCloseEditDialog = () => {
    setEditingRecord(null);
  };


  return (
    <div className="space-y-6">
        <Card>
            <CardHeader><CardTitle>Financial Overview</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Outstanding</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">GH₵{dashboardStats.totalOutstanding.toFixed(2)}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Revenue (Paid)</CardTitle><HandCoins className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">GH₵{dashboardStats.totalRevenue.toFixed(2)}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Tuition Debt</CardTitle><Receipt className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">GH₵{dashboardStats.outstandingTuition.toFixed(2)}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Canteen Debt</CardTitle><Utensils className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">GH₵{dashboardStats.outstandingCanteen.toFixed(2)}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Transport Debt</CardTitle><Bus className="h-4 w-4 text-muted-foreground" /></CardHeader>
                    <CardContent><div className="text-2xl font-bold">GH₵{dashboardStats.outstandingTransport.toFixed(2)}</div></CardContent>
                </Card>
            </CardContent>
        </Card>

       <div className="grid lg:grid-cols-1 gap-6">
        <Card>
            <CardHeader>
            <div className="flex justify-between items-center">
                <div>
                <CardTitle>Student Billing</CardTitle>
                <CardDescription>Create, manage, and track all student financial records.</CardDescription>
                </div>
                <div className="flex gap-2">
                <Button variant={activeForm === 'single' ? 'default' : 'outline'} onClick={() => setActiveForm(activeForm === 'single' ? null : 'single')}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Single Bill
                </Button>
                <Button variant={activeForm === 'bulk' ? 'default' : 'outline'} onClick={() => setActiveForm(activeForm === 'bulk' ? null : 'bulk')}>
                    <FileCog className="mr-2 h-4 w-4" /> Add Bulk Bill
                </Button>
                </div>
            </div>
            </CardHeader>
            <CardContent>
                {activeForm === 'single' && <FinancialRecordForm setOpen={() => setActiveForm(null)} students={students || []} onRecordAdded={forceRefetch} />}
                {activeForm === 'bulk' && <BulkBillingForm setOpen={() => setActiveForm(null)} classes={classes || []} students={students || []} onRecordsAdded={forceRefetch} />}
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <Input placeholder="Search by student name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-sm"/>
        </CardHeader>
        <CardContent>
            {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div> : (
                <div className="space-y-4">
                    {studentFinancials.map(({ student, records, balance, hasOverdue }) => (
                         <Collapsible key={student.uid} className="border rounded-lg">
                            <CollapsibleTrigger className="w-full p-4 hover:bg-muted/50 rounded-lg flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>{student.firstName.charAt(0)}{student.lastName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-left">
                                        <p className="font-semibold">{student.firstName} {student.lastName}</p>
                                        <p className="text-sm text-muted-foreground">{getStudentById(student.uid)?.classId || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Balance</p>
                                        <p className={cn("font-bold text-lg", balance > 0 && "text-destructive")}>GH₵{balance.toFixed(2)}</p>
                                    </div>
                                    <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                </div>
                            </CollapsibleTrigger>
                             <CollapsibleContent className="p-4 bg-slate-50 border-t">
                                 <Table>
                                    <TableHeader><TableRow><TableHead>Description</TableHead><TableHead>Type</TableHead><TableHead>Billed</TableHead><TableHead>Paid</TableHead><TableHead>Balance</TableHead><TableHead>Due</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {records.map(rec => {
                                            const recordBalance = rec.billedAmount - rec.amountPaid - (rec.waiverAmount || 0);
                                            return (
                                            <TableRow key={rec.id}>
                                                <TableCell className="font-medium">{rec.description}</TableCell>
                                                <TableCell>{rec.type}</TableCell>
                                                <TableCell>GH₵{rec.billedAmount.toFixed(2)}</TableCell>
                                                <TableCell>GH₵{rec.amountPaid.toFixed(2)}</TableCell>
                                                <TableCell className="font-semibold">GH₵{recordBalance.toFixed(2)}</TableCell>
                                                <TableCell>{rec.dueDate?.toDate ? format(rec.dueDate.toDate(), 'PPP') : 'N/A'}</TableCell>
                                                <TableCell><Badge variant={getStatusVariant(rec.status)}>{rec.status}</Badge></TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical /></Button></DropdownMenuTrigger>
                                                        <DropdownMenuContent>
                                                            <DropdownMenuItem onClick={() => handleOpenEditDialog(rec)}><Edit className="mr-2 h-4 w-4" /> Edit Bill</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleOpenDialog('payment', rec)}>Record Payment</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleOpenDialog('waiver', rec)}>Apply Waiver/Concession</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        )})}
                                    </TableBody>
                                </Table>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>
            )}
        </CardContent>
      </Card>
      
      <Dialog open={!!dialogState.record} onOpenChange={(open) => !open && handleCloseDialog()}>
          {dialogState.record && (
            dialogState.type === 'payment' 
            ? <RecordPaymentDialog record={dialogState.record} setOpen={handleCloseDialog} onUpdate={forceRefetch} />
            : <ApplyWaiverDialog record={dialogState.record} setOpen={handleCloseDialog} onUpdate={forceRefetch} />
          )}
      </Dialog>
      
      <Dialog open={!!editingRecord} onOpenChange={(open) => !open && handleCloseEditDialog()}>
          {editingRecord && (
            <EditRecordDialog record={editingRecord} setOpen={handleCloseEditDialog} onUpdate={forceRefetch} />
          )}
      </Dialog>
    </div>
  );
}
