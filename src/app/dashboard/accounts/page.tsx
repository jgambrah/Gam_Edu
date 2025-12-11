
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
import { Loader2, PlusCircle, MoreVertical, FileCog, Edit, Utensils, Bus, User, ChevronDown, DollarSign, HandCoins, Receipt, AlertCircle, Eye, Wallet } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';

// --- Types ---
// Enhanced schema to support "Opening Balance"
const extendedFinancialRecordSchema = financialRecordSchema.extend({
    isOpeningBalance: z.boolean().optional(),
});

// --- SUB-COMPONENT: Transaction Detail Modal ---
function TransactionDetailModal({ record, open, setOpen }: { record: FinancialRecord | null, open: boolean, setOpen: (o: boolean) => void }) {
    if (!record) return null;

    // Calculate balance specific to this invoice
    const balance = record.billedAmount - (record.amountPaid || 0) - (record.waiverAmount || 0);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-indigo-600"/> Transaction Details
                    </DialogTitle>
                    <DialogDescription>Transaction ID: {record.id.slice(0, 8)}...</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Type</p>
                            <Badge variant="outline">{record.type}</Badge>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Status</p>
                            <Badge variant={record.status === 'Paid' ? 'default' : 'destructive'}>{record.status}</Badge>
                        </div>
                    </div>
                    
                    <div className="space-y-1">
                         <p className="text-xs font-medium text-muted-foreground">Description</p>
                         <div className="p-3 bg-slate-50 rounded-md border text-sm">{record.description}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div>
                            <p className="text-xs text-slate-500 mb-1">Billed</p>
                            <p className="text-md font-bold text-slate-800">GH₵{record.billedAmount.toFixed(2)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Paid</p>
                            <p className="text-md font-bold text-green-600">GH₵{(record.amountPaid || 0).toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-slate-500 mb-1">Balance</p>
                             <p className="text-md font-bold text-red-600">GH₵{balance.toFixed(2)}</p>
                        </div>
                    </div>

                    <Separator />
                    
                    <div className="space-y-2 text-xs text-slate-500">
                        <div className="flex justify-between">
                            <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3"/> Created At:</span>
                            <span>{record.createdAt ? format(record.createdAt.toDate(), 'PPP p') : 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3"/> Due Date:</span>
                            <span className="text-red-500 font-medium">{record.dueDate ? format(record.dueDate.toDate(), 'PPP') : 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- FORM: Financial Record (With Opening Balance support) ---
function FinancialRecordForm({ setOpen, students, onRecordAdded }: { setOpen: (open: boolean) => void; students: Student[], onRecordAdded: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof extendedFinancialRecordSchema>>({
    resolver: zodResolver(extendedFinancialRecordSchema),
    defaultValues: { type: 'Tuition Fee', billedAmount: 0, isOpeningBalance: false }
  });

  const isOpeningBalance = form.watch('isOpeningBalance');

  // Auto-set description if Opening Balance is checked
  useEffect(() => {
      if (isOpeningBalance) {
          form.setValue('type', 'Other');
          form.setValue('description', 'Opening Balance (Arrears from previous term)');
      }
  }, [isOpeningBalance, form]);

  async function onSubmit(values: z.infer<typeof extendedFinancialRecordSchema>) {
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
        status: 'Unpaid', // Always unpaid initially
        createdAt: serverTimestamp(),
        // If it's opening balance, set date to past to ensure it appears first in ledger
        dueDate: values.dueDate || new Date(), 
      };
      
      await addDocumentNonBlocking(collection(firestore, 'financialRecords'), newRecord);
      toast({ title: 'Success', description: isOpeningBalance ? 'Opening balance recorded.' : 'Bill added.' });
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
        
        {/* Toggle for Opening Balance */}
        <div className="flex items-center gap-2 p-2 bg-slate-100 rounded mb-2">
            <input 
                type="checkbox" 
                id="openingBalance"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                {...form.register('isOpeningBalance')}
            />
            <label htmlFor="openingBalance" className="text-sm font-medium text-slate-700 cursor-pointer">
                This is an Opening Balance (Arrears)
            </label>
        </div>

        <FormField control={form.control} name="studentId" render={({ field }) => (
            <FormItem><FormLabel>Student</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a student"/></SelectTrigger></FormControl><SelectContent>{students.map(s => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )}/>
        
        {!isOpeningBalance && (
            <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>Fee Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{['Tuition Fee', 'Library Fine', 'Lab Fee', 'Sports Fee', 'Canteen Fee', 'Transport Fee', 'Other'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
        )}
        
        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="billedAmount" render={({ field }) => (
                <FormItem><FormLabel>Amount (GH₵)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="dueDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Due Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                <Button variant={'outline'} className={cn('pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/></PopoverContent></Popover><FormMessage /></FormItem>
            )}/>
        </div>
        <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} {isOpeningBalance ? 'Save Opening Balance' : 'Add Bill'}</Button>
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
    
    // Calculate remaining balance for THIS SPECIFIC bill
    const balance = record.billedAmount - (record.amountPaid || 0) - (record.waiverAmount || 0);

    const form = useForm<z.infer<typeof recordPaymentSchema>>({
        resolver: zodResolver(recordPaymentSchema),
        defaultValues: { method: 'Card' }
    });

    async function onSubmit(values: z.infer<typeof recordPaymentSchema>) {
        if (!firestore || !user) return;
        
        if (values.amount > balance) {
            form.setError('amount', { message: `Payment cannot exceed outstanding balance of GH₵${balance}` });
            return;
        }
        
        setIsSubmitting(true);
        try {
            const batch = writeBatch(firestore);
            const recordRef = doc(firestore, 'financialRecords', record.id);
            const newAmountPaid = (record.amountPaid || 0) + values.amount;
            const newBalance = record.billedAmount - newAmountPaid - (record.waiverAmount || 0);
            
            // Logic 3: Update Outstanding Balance automatically
            // If fully paid, status changes to Paid
            const newStatus = newBalance <= 0 ? 'Paid' : 'Unpaid';
            
            batch.update(recordRef, {
                amountPaid: newAmountPaid,
                status: newStatus,
            });

            // If paying cash, record in Till
            if (values.method === 'Cash') {
                const tillQuery = query(collection(firestore, 'tills'), where('accountantId', '==', user.uid), where('status', '==', 'Open'));
                const tillSnapshot = await getDocs(tillQuery);
                if (tillSnapshot.empty) {
                    throw new Error("You do not have an open till. Please open one before recording cash payments.");
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
                    description: `Payment for: ${record.description} (${record.type})`
                });
            }

            await batch.commit();

            toast({ title: 'Success', description: 'Payment recorded and balance updated.' });
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
            <DialogHeader><DialogTitle>Record Payment</DialogTitle><DialogDescription>Paying for: {record.description}</DialogDescription></DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-center mb-4">
                         <p className="text-xs text-indigo-600 uppercase font-semibold">Outstanding Balance</p>
                         <p className="text-3xl font-bold text-indigo-900">GH₵{balance.toFixed(2)}</p>
                    </div>
                    
                    <FormField control={form.control} name="amount" render={({ field }) => (
                        <FormItem><FormLabel>Payment Amount (GH₵)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="method" render={({ field }) => (
                        <FormItem><FormLabel>Payment Method</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{['Cash', 'Card', 'Bank Transfer', 'Other'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="notes" render={({ field }) => (
                        <FormItem><FormLabel>Notes (Optional)</FormLabel><FormControl><Textarea {...field}/></FormControl><FormMessage /></FormItem>
                    )}/>
                    <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Confirm Payment</Button>
                </form>
            </Form>
        </DialogContent>
    );
}

// ... (ApplyWaiverDialog and EditRecordDialog remain same, just ensure they are included below)
function ApplyWaiverDialog({ record, setOpen, onUpdate }: { record: FinancialRecord, setOpen: (open: boolean) => void, onUpdate: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const balance = record.billedAmount - (record.amountPaid || 0) - (record.waiverAmount || 0);

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
            const newStatus = ((record.amountPaid || 0) + newWaiverAmount) >= record.billedAmount ? 'Paid' : record.status;

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
            <DialogHeader><DialogTitle>Apply Waiver</DialogTitle></DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="p-2 bg-yellow-50 text-yellow-800 rounded mb-2 text-sm">Max Waiver: GH₵{balance.toFixed(2)}</div>
                    <FormField control={form.control} name="amount" render={({ field }) => (
                        <FormItem><FormLabel>Waiver Amount</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="reason" render={({ field }) => (
                        <FormItem><FormLabel>Reason</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
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
    
    const editSchema = financialRecordSchema.omit({ studentId: true }); 

    const form = useForm<z.infer<typeof editSchema>>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            type: record.type,
            description: record.description,
            billedAmount: record.billedAmount,
            dueDate: record.dueDate.toDate(), 
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
                <DialogTitle>Edit Record</DialogTitle>
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
                            <FormItem><FormLabel>Billed Amount</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
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
  const [transactionDetail, setTransactionDetail] = useState<FinancialRecord | null>(null);

  const finQuery = useMemoFirebase(() => firestore ? collection(firestore, 'financialRecords') : null, [firestore]);
  const { data: records, isLoading: isLoadingRecords, forceRefetch } = useCollection<FinancialRecord>(finQuery);
  
  const studentQuery = useMemoFirebase(() => firestore ? collection(firestore, 'students') : null, [firestore]);
  const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentQuery);

  const { data: classes } = useCollection(useMemoFirebase(() => firestore ? collection(firestore, 'classes') : null, [firestore]));

  const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);
  const isLoading = isLoadingRecords || isLoadingStudents;

  // --- STATS LOGIC (UPDATED: Calculates Outstanding per Type) ---
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
        // Calculate remaining balance for this specific record
        const balance = record.billedAmount - (record.amountPaid || 0) - (record.waiverAmount || 0);
        
        totalBilled += record.billedAmount;
        totalPaid += (record.amountPaid || 0) + (record.waiverAmount || 0);

        // Logic 3: Update component-based outstanding balance
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

  // --- LEDGER LOGIC (UPDATED: Correct Running Balance) ---
  const studentFinancials = useMemo(() => {
    if (!records || !students) return [];

    return students.map(student => {
      const studentRecords = records.filter(r => r.studentId === student.uid);
      
      // Calculate total balance
      const totalBilled = studentRecords.reduce((acc, r) => acc + r.billedAmount, 0);
      const totalPaid = studentRecords.reduce((acc, r) => acc + (r.amountPaid || 0), 0);
      const totalWaivers = studentRecords.reduce((acc, r) => acc + (r.waiverAmount || 0), 0);
      const balance = totalBilled - totalPaid - totalWaivers;
      
      // Logic 1: Sort by Date (Oldest First) to calculate running balance correctly
      const sortedRecords = studentRecords.sort((a,b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));

      let runningBalance = 0;
      const ledger = sortedRecords.map(rec => {
            const debit = rec.billedAmount;
            const credit = (rec.amountPaid || 0) + (rec.waiverAmount || 0);
            runningBalance += (debit - credit); // Add Bill, Subtract Payment
            return {
                ...rec,
                debit: debit,
                credit: credit,
                runningBalance: runningBalance,
            }
        });

      return {
        student,
        balance,
        hasOverdue: studentRecords.some(r => r.status === 'Overdue'),
        ledger: ledger.reverse(), // Reverse for display (Newest First) so user sees recent activity top
      };
    }).filter(sf => 
        (sf.ledger.length > 0 || searchTerm) && // Show even if empty if searching
        (sf.student.firstName + " " + sf.student.lastName).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, students, searchTerm]);


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
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Bill/Balance
                </Button>
                <Button variant={activeForm === 'bulk' ? 'default' : 'outline'} onClick={() => setActiveForm(activeForm === 'bulk' ? null : 'bulk')}>
                    <FileCog className="mr-2 h-4 w-4" /> Add Bulk Bill
                </Button>
                </div>
            </div>
            </CardHeader>
            <CardContent>
                {/* Logic 2: Render the updated form with Opening Balance checkbox */}
                {activeForm === 'single' && <FinancialRecordForm setOpen={() => setActiveForm(null)} students={students || []} onRecordAdded={forceRefetch} />}
                {activeForm === 'bulk' && <BulkBillingForm setOpen={() => setActiveForm(null)} classes={classes || []} students={students || []} onRecordsAdded={forceRefetch} />}
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <div className="flex justify-between">
                <Input placeholder="Search by student name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="max-w-sm"/>
            </div>
        </CardHeader>
        <CardContent>
            {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div> : (
                <div className="space-y-4">
                    {studentFinancials.map(({ student, balance, hasOverdue, ledger }) => (
                         <Collapsible key={student.uid} className="border rounded-lg">
                            <CollapsibleTrigger className="w-full p-4 hover:bg-muted/50 rounded-lg flex justify-between items-center group">
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarFallback>{student.firstName.charAt(0)}{student.lastName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="text-left">
                                        <p className="font-semibold">{student.firstName} {student.lastName}</p>
                                        <p className="text-sm text-muted-foreground">{classes?.find(c => c.id === student.classId)?.name || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Balance</p>
                                        <p className={cn("font-bold text-lg", balance > 0 && "text-destructive", balance < 0 && "text-green-600")}>
                                            GH₵{balance.toFixed(2)}
                                        </p>
                                    </div>
                                    <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                </div>
                            </CollapsibleTrigger>
                             <CollapsibleContent className="p-4 bg-slate-50 border-t">
                                <div className="border rounded-md overflow-hidden bg-white">
                                 <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">Debit</TableHead>
                                            <TableHead className="text-right">Credit</TableHead>
                                            <TableHead className="text-right">Run. Bal</TableHead>
                                            <TableHead className="w-[120px] text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ledger.map(rec => (
                                            <TableRow key={rec.id}>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {rec.createdAt ? format(rec.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A'}
                                                </TableCell>
                                                <TableCell className="max-w-[200px]">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium truncate">{rec.description}</span>
                                                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">{rec.type}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-red-600">
                                                    {rec.debit > 0 ? `GH₵${rec.debit.toFixed(2)}` : '-'}
                                                </TableCell>
                                                <TableCell className="text-right font-mono text-green-600">
                                                    {rec.credit > 0 ? `GH₵${rec.credit.toFixed(2)}` : '-'}
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-slate-700">GH₵{rec.runningBalance.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1 justify-end">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => setTransactionDetail(rec)}>
                                                            <Eye className="h-4 w-4"/>
                                                        </Button>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreVertical /></Button></DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuItem onClick={() => handleOpenEditDialog(rec)}><Edit className="mr-2 h-4 w-4" /> Edit Bill</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleOpenDialog('payment', rec)}><Wallet className="mr-2 h-4 w-4"/> Record Payment</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleOpenDialog('waiver', rec)}><HandCoins className="mr-2 h-4 w-4"/> Apply Waiver</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                </div>
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
      
      <TransactionDetailModal 
        record={transactionDetail} 
        open={!!transactionDetail} 
        setOpen={(open) => !open && setTransactionDetail(null)}
      />

    </div>
  );
}