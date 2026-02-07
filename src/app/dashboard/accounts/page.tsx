
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, doc, writeBatch, serverTimestamp, updateDoc, setDoc, where, getDocs, getDoc, increment, orderBy } from 'firebase/firestore';
import { format, isPast, startOfDay, endOfDay, startOfMonth } from 'date-fns';
import type { DateRange } from 'react-day-picker';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, MoreVertical, FileCog, Edit, Utensils, Bus, DollarSign, HandCoins, Receipt, AlertCircle, Wallet, CalendarIcon, RefreshCw, AlertTriangle, ChevronsUpDown, Check, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

// Local Components & Utils
import { FeeCategory, PaymentTransaction, Student, FinancialRecord, financialRecordSchema, recordPaymentSchema, applyWaiverSchema, bulkBillingSchema, Class } from '@/lib/types';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { StudentDisplay } from '@/components/student-display';
import { StudentSearchInput } from '@/components/student-search';
import { searchStudent } from '@/lib/student-utils';
import { GenerateReceipt } from './generate-receipt';
import { GenerateStatement } from '@/components/dashboard/finance/GenerateStatement';
import { useCurrentSchool } from '@/hooks/use-current-school';


// --- Types ---
const extendedFinancialRecordSchema = financialRecordSchema.extend({
    isOpeningBalance: z.boolean().optional(),
});

const reversalSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be positive."),
  reason: z.string().min(5, "A reason for the reversal is required.")
});

// --- SUB-COMPONENT: Payment History (Inline Table Row) ---
function PaymentHistory({ record }: { record: FinancialRecord }) {
    const firestore = useFirestore();
    
    const paymentsQuery = useMemoFirebase(() =>
        (firestore && record?.id) ? 
        query(
            collection(firestore, 'financialRecords', record.id, 'payments'), 
            orderBy('paidAt', 'desc')
        ) : null,
        [firestore, record?.id]
    );
    
    const { data: payments, isLoading } = useCollection<PaymentTransaction>(paymentsQuery);

    if (isLoading) return <div className="p-4 text-xs animate-pulse">Loading history...</div>;
    
    if ((!payments || payments.length === 0) && (record.amountPaid || 0) > 0) {
        return (
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-md m-2 flex justify-between items-center">
                <div>
                    <p className="text-xs font-semibold text-blue-800">Legacy Payment Found</p>
                    <p className="text-[10px] text-blue-600">This payment was recorded before the detailed tracking update.</p>
                </div>
                <GenerateReceipt 
                    transaction={record} 
                    payment={{
                        id: 'legacy-' + record.id,
                        amount: record.amountPaid,
                        method: 'Recorded Payment',
                        paidAt: record.lastPaymentDate || record.createdAt,
                        notes: 'Legacy record'
                    } as any} 
                    variant="full" 
                />
            </div>
        );
    }

    if (!payments || payments.length === 0) {
        return (
            <div className="p-4 bg-slate-50 border border-dashed rounded-md m-2">
                <p className="text-xs text-muted-foreground italic text-center">
                    No payment transactions recorded for this specific charge yet.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-2">
            {payments.map(p => (
                <div key={p.id} className="flex justify-between items-center text-xs bg-white p-2 border rounded">
                    <span>GH₵{p.amount.toFixed(2)} ({p.method}) - {p.paidAt ? format(p.paidAt.toDate(), 'dd MMM yy') : ''}</span>
                    <GenerateReceipt transaction={record} payment={p} variant="icon" />
                </div>
            ))}
        </div>
    );
}

// --- SUB-COMPONENT: Reversal Dialog ---
function ReverseTransactionDialog({ record, open, setOpen, onUpdate }: { record: FinancialRecord, open: boolean, setOpen: (open: boolean) => void, onUpdate: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { schoolId } = useCurrentSchool();
    
    const form = useForm<z.infer<typeof reversalSchema>>({
        resolver: zodResolver(reversalSchema),
        defaultValues: { amount: 0, reason: '' }
    });

    async function onSubmit(values: z.infer<typeof reversalSchema>) {
        if (!firestore || !schoolId) return;
        setIsSubmitting(true);
        try {
            const newReversalRecord = {
                studentId: record.studentId,
                studentName: record.studentName,
                classId: record.classId,
                type: 'Correction / Reversal' as const,
                description: `Correction for: ${record.description}. Reason: ${values.reason}`,
                billedAmount: values.amount, 
                amountPaid: 0,
                status: 'Pending Reversal' as const, 
                dueDate: new Date(),
                createdAt: serverTimestamp(),
                schoolId: schoolId,
            };

            await addDocumentNonBlocking(collection(firestore, 'financialRecords'), newReversalRecord);
            
            toast({ title: "Reversal Pending", description: "Correction submitted for director's approval."});
            onUpdate();
            setOpen(false);
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to post reversal.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request Reversal / Debit Memo</DialogTitle>
                    <DialogDescription>Create a debit note to correct an error. This will require approval before it affects the student's balance.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="p-3 bg-slate-50 rounded-md border text-sm">
                            <p><strong>Original Item:</strong> {record.description}</p>
                            <p><strong>Billed:</strong> GH₵{record.billedAmount.toFixed(2)} | <strong>Paid:</strong> GH₵{(record.amountPaid || 0).toFixed(2)}</p>
                        </div>
                        <FormField control={form.control} name="amount" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount to Debit Student (GH₵)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === '' ? NaN : parseFloat(e.target.value))}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="reason" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Reason for Reversal</FormLabel>
                                <FormControl>
                                    <Textarea {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )} />
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 hover:bg-orange-700">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Submit for Approval
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

// --- SUB-COMPONENT: Daily Charge Form ---
function DailyChargeForm({ setOpen, classes, students, schoolId, onRecordsAdded }: { setOpen: (open: boolean) => void; classes: any[], students: Student[], schoolId: string, onRecordsAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Local State for this form
    const [selectedClassId, setSelectedClassId] = useState('');
    const [chargeType, setChargeType] = useState<'Canteen' | 'Transport'>('Canteen');
    const [date, setDate] = useState<Date>(new Date());
    const [rate, setRate] = useState(0);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    
    // Filter students by class
    const classStudents = useMemo(() => students.filter(s => s.classId === selectedClassId), [students, selectedClassId]);

    // Fetch Rate when type changes
    useEffect(() => {
        if(!firestore || !schoolId) return;
        const fetchRate = async () => {
            const docId = chargeType === 'Canteen' ? 'canteen' : 'transport';
            const settingsRef = doc(firestore, 'schoolSettings', schoolId, 'rates', docId);
            const snap = await getDoc(settingsRef);
            if(snap.exists()) {
                setRate(Number(snap.data().dailyRate) || 0);
            }
        };
        fetchRate();
    }, [chargeType, firestore, schoolId]);

    // Toggle Selection
    const toggleStudent = (uid: string) => {
        if(selectedStudents.includes(uid)) setSelectedStudents(prev => prev.filter(id => id !== uid));
        else setSelectedStudents(prev => [...prev, uid]);
    };

    const toggleAll = () => {
        if(selectedStudents.length === classStudents.length) setSelectedStudents([]);
        else setSelectedStudents(classStudents.map(s => s.uid));
    };

    const handleSubmit = async () => {
        if(!firestore || !schoolId) return;
        if(selectedStudents.length === 0) {
            toast({ variant: 'destructive', title: 'Error', description: 'Select at least one student.' });
            return;
        }
        if(rate <= 0) {
            toast({ variant: 'destructive', title: 'Error', description: 'Rate is 0. Please set rates in settings.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const batch = writeBatch(firestore);
            const dateStr = format(date, 'yyyy-MM-dd');

            selectedStudents.forEach(uid => {
                const student = classStudents.find(s => s.uid === uid);
                if(!student) return;

                const recordId = `${chargeType.toLowerCase()}-${uid}-${dateStr}`;
                const recordRef = doc(firestore, 'financialRecords', recordId);
                
                batch.set(recordRef, {
                    studentId: uid,
                    studentName: `${student.firstName} ${student.lastName}`,
                    classId: selectedClassId,
                    type: `${chargeType} Fee`,
                    description: `${chargeType} (Manual) - ${format(date, 'PPP')}`,
                    billedAmount: rate,
                    amountPaid: 0,
                    status: 'Unpaid',
                    dueDate: date,
                    createdAt: serverTimestamp(),
                    schoolId: schoolId, // SAAS Stamp
                }, { merge: true });
            });

            await batch.commit();
            toast({ title: 'Success', description: `Billed ${selectedStudents.length} students.` });
            onRecordsAdded();
            setOpen(false);
        } catch(e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Add Daily Charge (Manual)</DialogTitle>
                <DialogDescription>Manually bill specific students for Canteen or Transport.</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
                <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                        <Label>Type</Label>
                        <Select value={chargeType} onValueChange={(v: any) => setChargeType(v)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Canteen">Canteen</SelectItem>
                                <SelectItem value="Transport">Transport</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={'outline'} className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, 'PP') : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus/></PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-2">
                        <Label>Class</Label>
                        <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                            <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                            <SelectContent>
                                {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-1/3 space-y-2">
                        <Label>Rate</Label>
                        <Input value={`GH₵ ${rate.toFixed(2)}`} disabled className="bg-slate-100 font-bold text-slate-700"/>
                    </div>
                </div>

                {selectedClassId && (
                    <div className="border rounded-md max-h-[300px] overflow-y-auto p-2">
                        <div className="flex items-center gap-2 p-2 border-b mb-2 sticky top-0 bg-white">
                            <Checkbox 
                                checked={selectedStudents.length === classStudents.length && classStudents.length > 0} 
                                onCheckedChange={toggleAll}
                            />
                            <Label>Select All ({classStudents.length})</Label>
                        </div>
                        {classStudents.map(s => (
                            <div key={s.uid} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded">
                                <Checkbox 
                                    checked={selectedStudents.includes(s.uid)} 
                                    onCheckedChange={() => toggleStudent(s.uid)}
                                />
                                <span className="text-sm">{s.firstName} {s.lastName}</span>
                                {chargeType === 'Transport' && s.usesBusService && (
                                    <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-200 ml-auto">Bus User</Badge>
                                )}
                            </div>
                        ))}
                        {classStudents.length === 0 && <p className="text-center text-sm text-muted-foreground p-4">No students in class.</p>}
                    </div>
                )}

                <Button onClick={handleSubmit} disabled={isSubmitting || selectedStudents.length === 0} className="w-full">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4"/>}
                    Generate {selectedStudents.length} Bills
                </Button>
            </div>
        </DialogContent>
    );
}

// --- FORM: Financial Record (Single) ---
function FinancialRecordForm({ setOpen, students, schoolId, onRecordAdded }: { setOpen: (open: boolean) => void; students: Student[], schoolId: string, onRecordAdded: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof extendedFinancialRecordSchema>>({
    resolver: zodResolver(extendedFinancialRecordSchema),
    defaultValues: { type: 'Tuition Fee', billedAmount: 0, isOpeningBalance: false }
  });

  const isOpeningBalance = form.watch('isOpeningBalance');

  useEffect(() => {
      if (isOpeningBalance) {
          form.setValue('type', 'Other');
          form.setValue('description', 'Opening Balance (Arrears from previous term)');
      }
  }, [isOpeningBalance, form]);

  async function onSubmit(values: z.infer<typeof extendedFinancialRecordSchema>) {
    if (!firestore || !schoolId) return;
    setIsSubmitting(true);
    try {
        const student = students.find(s => s.uid === values.studentId);
        if(!student) throw new Error("Student not found");

      const newRecord = {
        ...values,
        studentName: `${student.firstName} ${student.lastName}`,
        classId: student.classId,
        amountPaid: 0,
        status: 'Unpaid',
        createdAt: serverTimestamp(),
        dueDate: values.dueDate || new Date(),
        schoolId: schoolId,
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
        
        <div className="flex items-center gap-2 p-2 bg-slate-100 rounded mb-2">
            <input 
                type="checkbox" id="openingBalance"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                {...form.register('isOpeningBalance')}
            />
            <label htmlFor="openingBalance" className="text-sm font-medium text-slate-700 cursor-pointer">
                This is an Opening Balance (Arrears)
            </label>
        </div>

        <FormField control={form.control} name="studentId" render={({ field }) => (
            <FormItem>
                <FormLabel>Student</FormLabel>
                <StudentSelect students={students || []} value={field.value} onValueChange={field.onChange} />
                <FormMessage />
            </FormItem>
        )}/>
        
        {!isOpeningBalance && (
            <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem><FormLabel>Fee Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{['Tuition Fee', 'Library Fine', 'Lab Fee', 'Sports Fee', 'Canteen Fee', 'Transport Fee', 'Other', 'Correction / Reversal'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
        )}
        
        <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )}/>
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="billedAmount" render={({ field }) => (
                <FormItem><FormLabel>Amount (GH₵)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? NaN : parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
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

function BulkBillingForm({ setOpen, classes, students, schoolId, onRecordsAdded }: { setOpen: (open: boolean) => void; classes: any[], students: Student[], schoolId: string, onRecordsAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<z.infer<typeof bulkBillingSchema>>({
      resolver: zodResolver(bulkBillingSchema),
      defaultValues: { type: 'Tuition Fee' }
    });
  
    async function onSubmit(values: z.infer<typeof bulkBillingSchema>) {
      if (!firestore || !schoolId) return;
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
                schoolId: schoolId,
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
                    <FormItem><FormLabel>Amount per Student (GH₵)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? NaN : parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
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

function RecordPaymentDialog({ record, open, setOpen, onUpdate }: { record: FinancialRecord, open: boolean, setOpen: (open: boolean) => void, onUpdate: () => void }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { schoolId } = useCurrentSchool();
    
    const balance = record.billedAmount - (record.amountPaid || 0) - (record.waiverAmount || 0);

    const form = useForm<z.infer<typeof recordPaymentSchema>>({
        resolver: zodResolver(recordPaymentSchema),
        defaultValues: { method: 'Cash' }
    });
    
    useEffect(() => {
        if (record && open) {
            const newBalance = record.billedAmount - (record.amountPaid || 0) - (record.waiverAmount || 0);
            form.reset({
                method: 'Cash',
                amount: newBalance > 0 ? parseFloat(newBalance.toFixed(2)) : 0,
                notes: '',
                paidAt: new Date(),
            });
        }
    }, [record, open, form]);


    async function onSubmit(values: z.infer<typeof recordPaymentSchema>) {
        const recordId = record.id; 
        if (!firestore || !user || !recordId || !schoolId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Missing record ID, user, or school context.' });
            return;
        }
    
        setIsSubmitting(true);
    
        try {
            const batch = writeBatch(firestore);
            
            const paymentDocRef = doc(collection(firestore, 'financialRecords', recordId, 'payments'));
            const paymentData = {
                amount: values.amount,
                method: values.method,
                notes: values.notes || '',
                paidAt: serverTimestamp(),
                processedById: user.uid,
                processedByName: user.displayName || user.email,
                studentId: record.studentId,
                description: record.description,
                schoolId: schoolId,
            };

            const recordRef = doc(firestore, 'financialRecords', recordId);
            const newAmountPaid = (record.amountPaid || 0) + values.amount;
            const isFullyPaid = (record.billedAmount - newAmountPaid - (record.waiverAmount || 0)) <= 0.001; // Epsilon for float issues
            const updateData = {
                amountPaid: newAmountPaid,
                status: isFullyPaid ? 'Paid' : 'Unpaid',
                lastPaymentDate: serverTimestamp()
            };
            batch.update(recordRef, updateData);

            if (values.method === 'Cash') {
                const tillQuery = query(collection(firestore, 'tills'), where('accountantId', '==', user.uid), where('status', '==', 'Open'), where('schoolId', '==', schoolId));
                const tillSnap = await getDocs(tillQuery);
                if (tillSnap.empty) throw new Error("You must have an OPEN TILL to accept cash.");
                
                const activeTill = tillSnap.docs[0];
                const tillTransRef = doc(collection(firestore, `tills/${activeTill.id}/transactions`));
                
                batch.set(tillTransRef, {
                    amount: values.amount,
                    studentName: record.studentName,
                    timestamp: serverTimestamp(),
                    type: 'Payment',
                    description: `Cash: ${record.description}`,
                    status: 'Completed',
                    schoolId: schoolId,
                });
                batch.update(doc(firestore, 'tills', activeTill.id), { currentBalance: increment(values.amount) });
    
            } else {
                const bankTransactionRef = doc(collection(firestore, 'bank_transactions'));
                batch.set(bankTransactionRef, {
                    amount: values.amount,
                    paymentMethod: values.method,
                    notes: values.notes || '',
                    studentId: record.studentId,
                    studentName: record.studentName,
                    financialRecordId: recordId,
                    recordedById: user.uid,
                    recordedByName: user.displayName || user.email,
                    recordedAt: serverTimestamp(),
                    status: 'Pending',
                    schoolId: schoolId,
                });
            }
    
            batch.set(paymentDocRef, paymentData);
            await batch.commit();
            
            toast({ title: 'Payment Logged', description: 'Receipt is now available.' });
            onUpdate();
            setOpen(false);
        } catch (e: any) {
            console.error("Payment Error:", e);
            toast({ variant: 'destructive', title: 'Payment Failed', description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>Record Payment</DialogTitle><DialogDescription>Paying for: {record.description}</DialogDescription></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className={`p-4 border rounded-lg text-center mb-4 ${balance <= 0 ? "bg-green-50 border-green-200" : "bg-indigo-50 border-indigo-100"}`}>
                            <p className="text-xs uppercase font-semibold text-slate-500">
                                {balance <= 0 ? "Current Credit" : "Outstanding Balance"}
                            </p>
                            <p className={`text-3xl font-bold ${balance <= 0 ? "text-green-700" : "text-indigo-900"}`}>
                                GH₵{Math.abs(balance).toFixed(2)}
                            </p>
                        </div>
                        
                        <FormField control={form.control} name="amount" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Payment Amount (GH₵)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? NaN : parseFloat(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                                <p className="text-[10px] text-muted-foreground">You can enter an amount higher than the balance to create a credit.</p>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="method" render={({ field }) => (
                            <FormItem><FormLabel>Payment Method</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{['Cash', 'Card', 'Bank Transfer', 'Mobile Money', 'Other'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="notes" render={({ field }) => (
                            <FormItem><FormLabel>Reference / Notes (Optional)</FormLabel><FormControl><Textarea {...field}/></FormControl><FormMessage /></FormItem>
                        )}/>
                        <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Confirm Payment</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function ApplyWaiverDialog({ record, open, setOpen, onUpdate }: { record: FinancialRecord, open: boolean, setOpen: (open: boolean) => void, onUpdate: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const balance = record.billedAmount - (record.amountPaid || 0) - (record.waiverAmount || 0);

    const form = useForm<z.infer<typeof applyWaiverSchema>>({ 
        resolver: zodResolver(applyWaiverSchema),
        defaultValues: {
            amount: 0.0,
            reason: '',
        }
    });

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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader><DialogTitle>Apply Waiver</DialogTitle><DialogDescription>Apply a financial discount or waiver to this specific record.</DialogDescription></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="p-2 bg-yellow-50 text-yellow-800 rounded mb-2 text-sm">Max Waiver: GH₵{balance.toFixed(2)}</div>
                        <FormField control={form.control} name="amount" render={({ field }) => (
                            <FormItem><FormLabel>Waiver Amount</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? NaN : parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="reason" render={({ field }) => (
                            <FormItem><FormLabel>Reason</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Apply Waiver</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function EditRecordDialog({ record, open, setOpen, onUpdate }: { record: FinancialRecord, open: boolean, setOpen: (open: boolean) => void, onUpdate: () => void }) {
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Record</DialogTitle>
                    <DialogDescription>Modify the details of this financial record.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="type" render={({ field }) => (
                            <FormItem><FormLabel>Fee Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{['Tuition Fee', 'Library Fine', 'Lab Fee', 'Sports Fee', 'Canteen Fee', 'Transport Fee', 'Other', 'Correction / Reversal'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="billedAmount" render={({ field }) => (
                                <FormItem><FormLabel>Billed Amount (GH₵)</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? NaN : parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
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
        </Dialog>
    );
}

// --- SUB-COMPONENT for Student Details ---
function StudentLedgerDetail({ 
    student, 
    records,
    onRecordPayment,
    onApplyWaiver,
    onEditRecord,
    onReverseTransaction,
}: { 
    student: Student; 
    records: FinancialRecord[];
    onRecordPayment: (record: FinancialRecord) => void;
    onApplyWaiver: (record: FinancialRecord) => void;
    onEditRecord: (record: FinancialRecord) => void;
    onReverseTransaction: (record: FinancialRecord) => void;
}) {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: endOfDay(new Date()),
    });
    
    const [openRowId, setOpenRowId] = useState<string | null>(null);
  
    const filteredRecords = useMemo(() => {
        if (!records) return [];
        if (!dateRange || !dateRange.from) return [...records].sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        
        const fromDate = startOfDay(dateRange.from);
        const toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
        
        return records.filter(rec => {
          const recDate = rec.createdAt?.toDate ? rec.createdAt.toDate() : new Date();
          return recDate >= fromDate && recDate <= toDate;
        }).sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      }, [records, dateRange]);
  
    const overallSummary = useMemo(() => {
        const activeRecords = records.filter(r => r.status !== 'Pending Reversal' && r.status !== 'Rejected Reversal');
        const totalBilled = activeRecords.reduce((acc, r) => acc + r.billedAmount, 0);
        const totalPaid = activeRecords.reduce((acc, r) => acc + (r.amountPaid || 0) + (r.waiverAmount || 0), 0);
        const balance = totalBilled - totalPaid;
        return { totalBilled, totalPaid, balance };
    }, [records]);

    const getStatusVariant = (status: FinancialRecord['status']) => {
        switch (status) {
            case 'Paid': return 'default';
            case 'Unpaid': return 'secondary';
            case 'Overdue': return 'destructive';
            case 'Pending Reversal': return 'secondary'
            case 'Rejected Reversal': return 'destructive'
            default: return 'secondary';
        }
    };
  
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button id="date" variant={"outline"} className={cn("w-full sm:w-[300px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (dateRange.to ? (<>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>) : (format(dateRange.from, "LLL dd, y"))) : (<span>Filter by Due Date</span>)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
            </PopoverContent>
          </Popover>
          {student && (
              <GenerateStatement 
                  student={student} 
                  records={filteredRecords} 
                  dateRange={dateRange}
                  summary={overallSummary} 
              />
          )}
        </div>
        
        <div className="overflow-x-auto w-full border rounded-md bg-white">
          <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Billed</TableHead>
                    <TableHead className="text-right">Paid</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right w-[200px]">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredRecords.map(rec => {
                    const balance = rec.billedAmount - (rec.amountPaid || 0) - (rec.waiverAmount || 0);
                    return (
                        <React.Fragment key={rec.id}>
                            <TableRow>
                                <TableCell>
                                    <span className="font-medium">{rec.description}</span>
                                    <p className="text-xs text-muted-foreground">{rec.type}</p>
                                </TableCell>
                                <TableCell className={`text-right font-mono ${rec.billedAmount < 0 ? 'text-green-600' : ''}`}>
                                    GH₵{rec.billedAmount.toFixed(2)}
                                </TableCell>
                                 <TableCell className="text-right font-mono text-green-600">
                                    GH₵{(rec.amountPaid || 0).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-xs">{rec.dueDate?.toDate ? format(rec.dueDate.toDate(), 'PPP') : 'N/A'}</TableCell>
                                <TableCell><Badge variant={getStatusVariant(rec.status)}>{rec.status}</Badge></TableCell>
                                <TableCell>
                                    <div className="flex gap-1 justify-end">
                                        <Button variant="ghost" size="icon" title="View Payment History" onClick={() => setOpenRowId(openRowId === rec.id ? null : rec.id)}>
                                            <ChevronsUpDown className="h-4 w-4 text-slate-500"/>
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem onClick={() => onRecordPayment(rec)}><DollarSign className="mr-2 h-4 w-4"/> Record Payment</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onApplyWaiver(rec)} disabled={balance <= 0}><FileCog className="mr-2 h-4 w-4"/> Apply Waiver</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => onEditRecord(rec)}><Edit className="mr-2 h-4 w-4"/> Edit Record</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => onReverseTransaction(rec)} className="text-red-600"><RefreshCw className="mr-2 h-4 w-4"/> Request Reversal</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                            <Receipt className="mr-2 h-4 w-4"/> Print Full Receipt
                                                        </DropdownMenuItem>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle>Full Statement Receipt</DialogTitle>
                                                            <DialogDescription>Consolidated receipt for all payments made against this bill.</DialogDescription>
                                                        </DialogHeader>
                                                        <GenerateReceipt 
                                                            transaction={rec} 
                                                            payment={{
                                                                id: 'consolidated-' + rec.id,
                                                                amount: rec.amountPaid,
                                                                method: 'Total Recorded',
                                                                paidAt: rec.lastPaymentDate || rec.createdAt,
                                                                notes: 'Consolidated Receipt for ' + rec.description
                                                            } as any} 
                                                            variant="full" 
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                            {openRowId === rec.id && (
                                <TableRow className="bg-slate-50/50">
                                    <TableCell colSpan={6} className="p-0">
                                        <PaymentHistory record={rec} />
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    );
                })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
}

// --- Reversal Approval Component ---
function ReversalApproval({ reversals, onUpdate }: { reversals: FinancialRecord[], onUpdate: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const handleDecision = async (record: FinancialRecord, decision: 'Unpaid' | 'Rejected Reversal') => {
        if (!firestore) return;
        setIsProcessing(record.id);
        try {
            await updateDoc(doc(firestore, 'financialRecords', record.id), { status: decision });
            toast({ title: `Reversal ${decision === 'Unpaid' ? 'Approved' : 'Rejected'}` });
            onUpdate();
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsProcessing(null);
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700"><AlertTriangle /> Reversal Requests</CardTitle>
                <CardDescription>Approve or reject debit memos created by accountants.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reversals.length === 0 && <TableRow><TableCell colSpan={4} className="text-center p-8">No pending reversals.</TableCell></TableRow>}
                        {reversals.map(rec => (
                            <TableRow key={rec.id}>
                                <TableCell>{rec.studentName}</TableCell>
                                <TableCell className="text-xs text-muted-foreground">{rec.description}</TableCell>
                                <TableCell className="text-right font-bold">GH₵{rec.billedAmount.toFixed(2)}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button size="sm" variant="destructive" onClick={() => handleDecision(rec, 'Rejected Reversal')} disabled={isProcessing === rec.id}>Reject</Button>
                                        <Button size="sm" onClick={() => handleDecision(rec, 'Unpaid')} disabled={isProcessing === rec.id}>Approve</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

// --- Main Page ---
export default function AccountsPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
    
    const [activeForm, setActiveForm] = useState<'single' | 'bulk' | 'daily' | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogState, setDialogState] = useState<{ type: 'payment' | 'waiver' | 'reversal' | 'history', record: FinancialRecord | null }>({ type: 'payment', record: null });
    const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null);
    const [activeTab, setActiveTab] = useState('billing');

    const finQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, [firestore, schoolId]);
    const { data: records, isLoading: isLoadingRecords, forceRefetch } = useCollection<FinancialRecord>(finQuery);
    
    const studentQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentQuery);
  
    const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: classes } = useCollection(classesQuery);
  
    const isAdmin = ['Administrator', 'Director'].includes(role);
    const canAccess = isAdmin || role === 'Accountant';
    const isLoading = isLoadingRecords || isLoadingStudents || isLoadingSchool;
  
    const dashboardStats = useMemo(() => {
      if (!records) return { totalRevenue: 0, totalOutstanding: 0, outstandingTuition: 0, outstandingCanteen: 0, outstandingTransport: 0 };
      
      const reportableRecords = records.filter(r => r.status !== 'Pending Reversal' && r.status !== 'Rejected Reversal');
  
      let totalPaid = 0;
      let totalBilled = 0;
      let outstandingTuition = 0;
      let outstandingCanteen = 0;
      let outstandingTransport = 0;
  
      for (const record of reportableRecords) {
          const balance = record.billedAmount - (record.amountPaid || 0) - (record.waiverAmount || 0);
          totalBilled += record.billedAmount;
          totalPaid += (record.amountPaid || 0) + (record.waiverAmount || 0);
  
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
  
    const studentFinancials = useMemo(() => {
      if (!records || !students) return [];
  
      return students.map(student => {
        const studentRecords = records.filter(r => r.studentId === student.uid && r.status !== 'Rejected Reversal');
        
        const activeRecords = studentRecords.filter(r => r.status !== 'Pending Reversal');
        const totalBilled = activeRecords.reduce((acc, r) => acc + r.billedAmount, 0);
        const totalPaid = activeRecords.reduce((acc, r) => acc + (r.amountPaid || 0) + (r.waiverAmount || 0), 0);
        const balance = totalBilled - totalPaid;
        
        return {
          student,
          balance,
          hasOverdue: activeRecords.some(r => r.status === 'Overdue'),
          records: studentRecords,
        };
      }).filter(sf => 
          (sf.records.length > 0 || searchTerm) && 
          searchStudent(sf.student, searchTerm)
      );
    }, [records, students, searchTerm]);
  
    const pendingReversals = useMemo(() => records?.filter(r => r.status === 'Pending Reversal') || [], [records]);

    if (!canAccess) {
      return (
        <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is restricted to financial staff.</CardDescription></CardHeader></Card>
      );
    }
  
    const handleOpenDialog = (type: 'payment' | 'waiver' | 'reversal' | 'history', record: FinancialRecord) => setDialogState({ type, record });
    const handleCloseDialog = () => setDialogState({ type: 'payment', record: null });
    const handleOpenEditDialog = (record: FinancialRecord) => setEditingRecord(record);
    const handleCloseEditDialog = () => setEditingRecord(null);

    return (
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
                <TabsTrigger value="billing">Student Billing</TabsTrigger>
                {isAdmin && <TabsTrigger value="approval">Reversal Requests <Badge className="ml-2">{pendingReversals.length}</Badge></TabsTrigger>}
            </TabsList>
            
            <TabsContent value="billing" className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Financial Overview</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Outstanding</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">GH₵{dashboardStats.totalOutstanding.toFixed(2)}</div></CardContent></Card>
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Revenue</CardTitle><HandCoins className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">GH₵{dashboardStats.totalRevenue.toFixed(2)}</div></CardContent></Card>
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Tuition Debt</CardTitle><Receipt className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">GH₵{dashboardStats.outstandingTuition.toFixed(2)}</div></CardContent></Card>
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Canteen Debt</CardTitle><Utensils className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">GH₵{dashboardStats.outstandingCanteen.toFixed(2)}</div></CardContent></Card>
                        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Transport Debt</CardTitle><Bus className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">GH₵{dashboardStats.outstandingTransport.toFixed(2)}</div></CardContent></Card>
                    </CardContent>
                </Card>
        
                <div className="grid lg:grid-cols-1 gap-6">
                <Card>
                    <CardHeader>
                    <div className="flex justify-between items-center">
                        <div><CardTitle>Create Bills</CardTitle><CardDescription>Create, manage, and track all student financial records.</CardDescription></div>
                        <div className="flex gap-2">
                            <Dialog open={activeForm === 'daily'} onOpenChange={(open) => setActiveForm(open ? 'daily' : null)}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                        <Utensils className="mr-2 h-4 w-4" /> Add Daily Charge
                                    </Button>
                                </DialogTrigger>
                                {schoolId && <DailyChargeForm setOpen={() => setActiveForm(null)} classes={classes || []} students={students || []} schoolId={schoolId} onRecordsAdded={forceRefetch} />}
                            </Dialog>
                            <Button variant={activeForm === 'single' ? 'default' : 'outline'} onClick={() => setActiveForm(activeForm === 'single' ? null : 'single')}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Single Bill
                            </Button>
                            <Button variant={activeForm === 'bulk' ? 'default' : 'outline'} onClick={() => setActiveForm(activeForm === 'bulk' ? null : 'bulk')}>
                                <FileCog className="mr-2 h-4 w-4" /> Bulk Bill
                            </Button>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent>
                        {activeForm === 'single' && schoolId && <FinancialRecordForm setOpen={() => setActiveForm(null)} students={students || []} schoolId={schoolId} onRecordAdded={forceRefetch} />}
                        {activeForm === 'bulk' && schoolId && <BulkBillingForm setOpen={() => setActiveForm(null)} classes={classes || []} students={students || []} schoolId={schoolId} onRecordsAdded={forceRefetch} />}
                    </CardContent>
                </Card>
                </div>
        
                <Card>
                <CardHeader>
                    <StudentSearchInput value={searchTerm} onChange={setSearchTerm}/>
                </CardHeader>
                <CardContent>
                    {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div> : (
                        <Accordion type="single" collapsible className="w-full">
                            {studentFinancials.map(({ student, balance, records }) => (
                                 <AccordionItem value={student.uid} key={student.uid}>
                                    <AccordionTrigger className="hover:no-underline p-4">
                                        <div className='flex justify-between items-center w-full'>
                                            <StudentDisplay student={student} variant="full" showAvatar />
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground">Balance</p>
                                                <p className={cn("font-bold text-lg", balance > 0 && "text-destructive", balance < 0 && "text-green-600")}>GH₵{balance.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 bg-slate-50/50 border-t">
                                        <StudentLedgerDetail 
                                            student={student} 
                                            records={records}
                                            onRecordPayment={(rec) => handleOpenDialog('payment', rec)}
                                            onApplyWaiver={(rec) => handleOpenDialog('waiver', rec)}
                                            onEditRecord={(rec) => handleOpenEditDialog(rec)}
                                            onReverseTransaction={(rec) => handleOpenDialog('reversal', rec)}
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="approval">
                <ReversalApproval reversals={pendingReversals} onUpdate={forceRefetch} />
            </TabsContent>

        </Tabs>
      
      {dialogState.record && dialogState.type === 'payment' && (
        <RecordPaymentDialog 
            record={dialogState.record} 
            open={!!dialogState.record} 
            setOpen={handleCloseDialog} 
            onUpdate={forceRefetch} 
        />
      )}
      {dialogState.record && dialogState.type === 'waiver' && (
        <ApplyWaiverDialog 
            record={dialogState.record} 
            open={!!dialogState.record} 
            setOpen={handleCloseDialog} 
            onUpdate={forceRefetch} 
        />
      )}
        {dialogState.record && dialogState.type === 'reversal' && (
            <ReverseTransactionDialog 
                record={dialogState.record}
                open={!!dialogState.record}
                setOpen={handleCloseDialog}
                onUpdate={forceRefetch}
            />
        )}
      {editingRecord && (
        <EditRecordDialog 
            record={editingRecord} 
            open={!!editingRecord} 
            setOpen={handleCloseEditDialog} 
            onUpdate={forceRefetch} 
        />
      )}
    </div>
  );
}
