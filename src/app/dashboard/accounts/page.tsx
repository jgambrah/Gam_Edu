'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, doc, writeBatch, serverTimestamp, updateDoc, setDoc, where, getDocs, getDoc, increment, orderBy, deleteField, deleteDoc, addDoc, Timestamp } from 'firebase/firestore';
import { format, isPast, startOfDay, endOfDay, startOfMonth } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, FileCog, Edit, Utensils, Bus as BusIcon, DollarSign, HandCoins, Receipt, AlertCircle, Wallet, CalendarIcon, RefreshCw, ChevronsUpDown, Check, XCircle, CheckCircle2, MoreVertical, Search, Smartphone, Sparkles, Route as RouteIcon, ChevronDown } from 'lucide-react';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

import { Student, FinancialRecord, financialRecordSchema, recordPaymentSchema, bulkBillingSchema, Class, PaymentTransaction, Till, TillTransaction, Route, Stop, Bus } from '@/lib/types';
import { StudentDisplay } from '@/components/student-display';
import { StudentSearchInput } from '@/components/student-search';
import { searchStudent, generateNextReceiptId } from '@/lib/student-utils';
import { GenerateReceipt } from './generate-receipt';
import { GenerateStatement } from '@/components/dashboard/finance/GenerateStatement';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { StudentSelect } from '@/components/StudentSelect';
import { billStudentForAttendance, billMultipleStudents } from '@/lib/billing';
import { ManualBillingReconciliation } from '@/components/dashboard/finance/manual-billing-reconciliation';

const extendedFinancialRecordSchema = financialRecordSchema.extend({
    isOpeningBalance: z.boolean().optional(),
});

function BulkTermlyTransportModal({ schoolId, onComplete }: { schoolId: string, onComplete: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [termName, setTermName] = useState('First Term');
    const [dueDate, setDueDate] = useState<Date>(new Date());

    const handleBulkTermlyTransport = async () => {
        if (!firestore || !schoolId) return;
        setIsSubmitting(true);
        
        try {
            const routesSnap = await getDocs(query(collection(firestore, 'routes'), where('schoolId', '==', schoolId)));
            const routeMap = new Map();
            routesSnap.docs.forEach(d => routeMap.set(d.id, d.data().termlyRate || 0));

            const studentsSnap = await getDocs(query(
                collection(firestore, 'students'), 
                where('schoolId', '==', schoolId), 
                where('usesBusService', '==', true), 
                where('transportBillingModel', '==', 'Termly'),
                where('enrollmentStatus', '==', 'Active')
            ));

            if (studentsSnap.empty) {
                toast({ variant: 'destructive', title: "No Students Found", description: "No students on Termly transport billing mode." });
                setIsSubmitting(false);
                return;
            }

            const batch = writeBatch(firestore);
            let count = 0;

            studentsSnap.docs.forEach(docSnap => {
                const student = docSnap.data();
                const termlyRate = routeMap.get(student.routeId);

                if (termlyRate > 0) {
                    const recordRef = doc(collection(firestore, 'financialRecords'));
                    batch.set(recordRef, {
                        studentId: docSnap.id,
                        studentName: `${student.firstName} ${student.lastName}`,
                        classId: student.classId || '',
                        type: 'Transport Fee (Termly)',
                        description: `Termly Bus Fare - ${termName}`,
                        billedAmount: termlyRate,
                        amountPaid: 0,
                        status: 'Unpaid',
                        dueDate: Timestamp.fromDate(startOfDay(dueDate)),
                        createdAt: serverTimestamp(),
                        schoolId: schoolId
                    });
                    count++;
                }
            });

            await batch.commit();
            toast({ title: 'Success', description: `Generated ${count} termly transport bills.` });
            onComplete();
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Academic Term Name</Label>
                <Input value={termName} onChange={e => setTermName(e.target.value)} placeholder="e.g., First Term 2025" />
            </div>
            <div className="space-y-2">
                <Label>Payment Due Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-white border-2">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(dueDate, "PPP")}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={dueDate} onSelect={(d) => d && setDueDate(d)} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>
            <Button onClick={handleBulkTermlyTransport} disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                Generate Termly Bills
            </Button>
        </div>
    );
}

function BulkTermlyCanteenModal({ schoolId, onComplete }: { schoolId: string, onComplete: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [termName, setTermName] = useState('First Term');
    const [dueDate, setDueDate] = useState<Date>(new Date());

    const handleBulkTermlyCanteen = async () => {
        if (!firestore || !schoolId) return;
        setIsSubmitting(true);
        
        try {
            const settingsSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen'));
            if (!settingsSnap.exists()) {
                throw new Error("Canteen rates not configured. Please check Financial Settings.");
            }
            const settings = settingsSnap.data();
            const model = settings.pricingModel || 'Flat';
            const flatRate = settings.termlyRate || 0;
            const classRates = settings.classTermlyRates || {};

            const studentsSnap = await getDocs(query(
                collection(firestore, 'students'), 
                where('schoolId', '==', schoolId), 
                where('canteenBillingMode', '==', 'Termly'),
                where('enrollmentStatus', '==', 'Active')
            ));

            if (studentsSnap.empty) {
                toast({ variant: 'destructive', title: "No Students Found", description: "No students on Termly canteen billing mode." });
                setIsSubmitting(false);
                return;
            }

            const batch = writeBatch(firestore);
            let count = 0;
            const termId = termName.replace(/\s+/g, '');

            studentsSnap.docs.forEach(docSnap => {
                const student = docSnap.data();
                let rate = 0;
                
                if (model === 'Class-Based') {
                    rate = classRates[student.classId] || 0;
                } else {
                    rate = flatRate;
                }

                if (rate > 0) {
                    const termBillId = `canteen-term-${docSnap.id}-${termId}`;
                    const recordRef = doc(firestore, 'financialRecords', termBillId);
                    
                    batch.set(recordRef, {
                        studentId: docSnap.id,
                        studentName: `${student.firstName} ${student.lastName}`,
                        classId: student.classId || '',
                        type: 'Canteen Fee (Daily)',
                        description: `Termly Canteen - ${termName}`,
                        billedAmount: rate,
                        amountPaid: 0,
                        status: 'Unpaid',
                        dueDate: Timestamp.fromDate(startOfDay(dueDate)),
                        createdAt: serverTimestamp(),
                        schoolId: schoolId
                    }, { merge: true });
                    count++;
                }
            });

            if (count === 0) {
                throw new Error("No bills were generated. Please check if rates are set for the students' classes.");
            }

            await batch.commit();
            toast({ title: 'Success', description: `Generated ${count} termly canteen bills.` });
            onComplete();
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Academic Term Name</Label>
                <Input value={termName} onChange={e => setTermName(e.target.value)} placeholder="e.g., First Term 2025" />
            </div>
            <div className="space-y-2">
                <Label>Payment Due Date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-white border-2">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {format(dueDate, "PPP")}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={dueDate} onSelect={(d) => d && setDueDate(d)} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>
            <Button onClick={handleBulkTermlyCanteen} disabled={isSubmitting} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4"/>}
                Generate Termly Bills
            </Button>
        </div>
    );
}

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
                    No payment transactions recorded for this charge.
                </p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-2">
            {payments.map(p => (
                <div key={p.id} className="flex justify-between items-center text-xs bg-white p-2 border rounded">
                    <span>{p.id}: GH₵{p.amount.toFixed(2)} ({p.method}) - {p.paidAt?.toDate ? format(p.paidAt.toDate(), 'dd MMM yy') : ''}</span>
                    <GenerateReceipt transaction={record} payment={p} variant="icon" />
                </div>
            ))}
        </div>
    );
}

function FinancialRecordForm({ setOpen, students, schoolId, onRecordAdded }: { setOpen: (open: boolean) => void; students: Student[], schoolId: string, onRecordAdded: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof extendedFinancialRecordSchema>>({ 
    resolver: zodResolver(extendedFinancialRecordSchema), 
    defaultValues: { 
      studentId: '',
      type: 'Tuition Fee', 
      description: '',
      billedAmount: 0, 
      dueDate: new Date(),
      isOpeningBalance: false 
    } 
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
          classId: student.classId || '', 
          amountPaid: 0, 
          status: 'Unpaid', 
          createdAt: serverTimestamp(), 
          dueDate: Timestamp.fromDate(values.dueDate || new Date()), 
          schoolId: schoolId 
      };
      await addDoc(collection(firestore, 'financialRecords'), newRecord);
      toast({ title: 'Success', description: isOpeningBalance ? 'Opening balance recorded.' : 'Bill added.' });
      onRecordAdded(); 
      setOpen(false); 
      form.reset();
    } catch (e) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add record.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-2 p-2 bg-slate-100 rounded mb-2">
                <Checkbox 
                    id="openingBalance" 
                    checked={isOpeningBalance}
                    onCheckedChange={(checked) => form.setValue('isOpeningBalance', checked as boolean)}
                />
                <label htmlFor="openingBalance" className="text-sm font-medium text-slate-700 cursor-pointer">
                    This is an Opening Balance (Arrears)
                </label>
            </div>

            <FormField 
                control={form.control} 
                name="studentId" 
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Student</FormLabel>
                        <StudentSelect students={students || []} value={field.value} onValueChange={field.onChange} />
                        <FormMessage />
                    </FormItem>
                )}
            />

            {isOpeningBalance ? null : (
                <FormField 
                    control={form.control} 
                    name="type" 
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fee Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select type"/></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {[
                                        'Tuition Fee', 
                                        'Admission Fee',
                                        'Maintenance Fee',
                                        'Examination Fee',
                                        'PTA Levy',
                                        'Library Fine', 
                                        'Lab Fee', 
                                        'Sports Fee', 
                                        'Canteen Fee', 
                                        'Other', 
                                        'Correction / Reversal'
                                    ].map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}

            <FormField 
                control={form.control} 
                name="description" 
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Input placeholder="Brief description of charge" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField 
                    control={form.control} 
                    name="billedAmount" 
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount (GH₵)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control} 
                    name="dueDate" 
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Due Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={'outline'} className={cn('pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}>
                                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null} 
                {isOpeningBalance ? 'Save Opening Balance' : 'Add Bill'}
            </Button>
        </form>
    </Form>
  );
}

function BulkBillingForm({ setOpen, classes, students, schoolId, onRecordsAdded }: { setOpen: (open: boolean) => void; classes: Class[], students: Student[], schoolId: string, onRecordsAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<z.infer<typeof bulkBillingSchema>>({ 
      resolver: zodResolver(bulkBillingSchema), 
      defaultValues: { 
        classId: '',
        type: 'Tuition Fee', 
        description: '', 
        billedAmount: 0,
        dueDate: new Date()
      } 
    });
  
    async function onSubmit(values: z.infer<typeof bulkBillingSchema>) {
      if (!firestore || !schoolId) return;
      setIsSubmitting(true);
      
      const targetStudents = values.classId === 'all' 
        ? students 
        : students.filter(s => s.classId === values.classId);

      if(targetStudents.length === 0) { 
        toast({
            variant: 'destructive', 
            title: 'No Students', 
            description: values.classId === 'all' ? 'There are no active students in the school.' : 'There are no active students in the selected class.'
        }); 
        setIsSubmitting(false); 
        return; 
      }

      try {
        const batch = writeBatch(firestore);
        targetStudents.forEach(student => {
            const newRecordRef = doc(collection(firestore, 'financialRecords'));
            batch.set(newRecordRef, { 
                ...values, 
                studentId: student.uid, 
                studentName: `${student.firstName} ${student.lastName}`, 
                amountPaid: 0, 
                status: isPast(values.dueDate) ? 'Overdue' : 'Unpaid', 
                createdAt: serverTimestamp(), 
                dueDate: Timestamp.fromDate(values.dueDate),
                schoolId: schoolId 
            });
        });
        await batch.commit();
        toast({ title: 'Success', description: `Billed ${targetStudents.length} students successfully.` });
        onRecordsAdded(); 
        setOpen(false); 
        form.reset();
      } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to create bulk bills.' });
      } finally {
        setIsSubmitting(false);
      }
    }
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField 
                control={form.control} 
                name="classId" 
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Class / Target</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select target..."/></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="all" className="font-bold text-indigo-600 italic">All Active Students (Whole School)</SelectItem>
                                <Separator className="my-1" />
                                {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField 
                control={form.control} 
                name="type" 
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fee Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select fee type"/></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {[
                                    'Tuition Fee', 
                                    'Admission Fee',
                                    'Maintenance Fee',
                                    'Examination Fee',
                                    'PTA Levy',
                                    'Lab Fee', 
                                    'Sports Fee', 
                                    'Canteen Fee', 
                                    'Transport Fee', 
                                    'Other'
                                ].map(t => (
                                    <SelectItem key={t} value={t}>{t}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField 
                control={form.control} 
                name="description" 
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Spring Term Tuition" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField 
                    control={form.control} 
                    name="billedAmount" 
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Amount per Student (GH₵)</Label>
                            <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField 
                    control={form.control} 
                    name="dueDate" 
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Due Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={'outline'} className={cn('pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}>
                                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus/>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-6 animate-spin"/> : null} 
                Add Bulk Bill
            </Button>
        </form>
      </Form>
    );
}

function RecordPaymentDialog({ record, open, setOpen, onUpdate }: { record: FinancialRecord, open: boolean, setOpen: (open: boolean) => void, onUpdate: () => void }) {
    const firestore = useFirestore(); 
    const { user } = useUser(); 
    const { toast } = useToast(); 
    const [isSubmitting, setIsSubmitting] = useState(false); 
    const { schoolId } = useCurrentSchool();
    const balance = record.billedAmount - (record.amountPaid || 0) - (record.waiverAmount || 0);
    const form = useForm<z.infer<typeof recordPaymentSchema>>({ resolver: zodResolver(recordPaymentSchema), defaultValues: { method: 'Cash', amount: 0, notes: '' } });
    
    useEffect(() => {
        if (record && open) {
            const newBalance = record.billedAmount - (record.amountPaid || 0) - (record.waiverAmount || 0);
            form.reset({ method: 'Cash', amount: newBalance > 0 ? parseFloat(newBalance.toFixed(2)) : 0, notes: '' });
        }
    }, [record, open, form]);

    async function onSubmit(values: z.infer<typeof recordPaymentSchema>) {
        if (!firestore || !user || !record.id || !schoolId) return;
        setIsSubmitting(true);
        try {
            const batch = writeBatch(firestore);
            const receiptId = await generateNextReceiptId(firestore, schoolId);
            const paymentDocRef = doc(firestore, 'financialRecords', record.id, 'payments', receiptId);
            
            const paymentData = { 
                id: receiptId,
                amount: values.amount, 
                method: values.method, 
                notes: values.notes || '', 
                paidAt: serverTimestamp(), 
                processedById: user.uid, 
                processedByName: user.displayName || user.email, 
                studentId: record.studentId, 
                description: record.description, 
                schoolId: schoolId 
            };
            const recordRef = doc(firestore, 'financialRecords', record.id);
            const newAmountPaid = (record.amountPaid || 0) + values.amount;
            const isFullyPaid = (record.billedAmount - newAmountPaid - (record.waiverAmount || 0)) <= 0.001;
            batch.update(recordRef, { amountPaid: newAmountPaid, status: isFullyPaid ? 'Paid' : 'Unpaid', lastPaymentDate: serverTimestamp() });
            
            if (values.method === 'Cash') {
                const tillQuery = query(collection(firestore, 'tills'), where('accountantId', '==', user.uid), where('status', '==', 'Open'), where('schoolId', '==', schoolId));
                const tillSnap = await getDocs(tillQuery);
                if (tillSnap.empty) throw new Error("You must have an OPEN TILL to accept cash.");
                const activeTill = tillSnap.docs[0];
                const tillTransRef = doc(collection(firestore, `tills/${activeTill.id}/transactions`));
                batch.set(tillTransRef, { amount: values.amount, studentName: record.studentName, timestamp: serverTimestamp(), type: 'Payment', description: `Cash: ${record.description} (Receipt: ${receiptId})`, status: 'Completed', schoolId: schoolId });
                batch.update(doc(firestore, 'tills', activeTill.id), { currentBalance: increment(values.amount) });
            }
            batch.set(paymentDocRef, paymentData);
            await batch.commit();
            toast({ title: 'Payment Logged', description: `Receipt ${receiptId} generated.` });
            onUpdate(); setOpen(false);
        } catch (e: any) {
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
                            <p className="text-xs uppercase font-semibold text-slate-500">{balance <= 0 ? "Current Credit" : "Outstanding Balance"}</p>
                            <p className={`text-3xl font-bold ${balance <= 0 ? "text-green-700" : "text-indigo-900"}`}>GH₵{Math.abs(balance).toFixed(2)}</p>
                        </div>
                        <FormField control={form.control} name="amount" render={({ field }) => (
                            <FormItem><FormLabel>Payment Amount (GH₵)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))}/></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="method" render={({ field }) => (<FormItem><FormLabel>Payment Method</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl><SelectContent>{['Cash', 'Card', 'Bank Transfer', 'Mobile Money', 'Other'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="notes" render={({ field }) => (<FormItem><FormLabel>Reference / Notes (Optional)</FormLabel><FormControl><Textarea placeholder="Ref or notes..." {...field}/></FormControl><FormMessage /></FormItem>)}/>
                        <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Confirm Payment</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function StudentLedgerDetail({ student, records, onRecordPayment, onApplyWaiver, onEditRecord, onReverseTransaction }: { student: Student; records: FinancialRecord[]; onRecordPayment: (record: FinancialRecord) => void; onApplyWaiver: (record: FinancialRecord) => void; onEditRecord: (record: FinancialRecord) => void; onReverseTransaction: (record: FinancialRecord) => void; }) {
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();
    const [isBilling, setIsBilling] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({ from: startOfMonth(new Date()), to: endOfDay(new Date()) });
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
        return { totalBilled, totalPaid, balance: totalBilled - totalPaid };
    }, [records]);

    const handleManualServiceBill = async () => {
        if (!firestore || !schoolId || isBilling) return;
        setIsBilling(true);
        try {
            const today = new Date();
            const result = await billStudentForAttendance(firestore, student, today, schoolId);
            if (result.success) {
                toast({ title: result.amountBilled > 0 ? "Billed" : "Already Billed", description: result.message });
            } else {
                throw new Error(result.message);
            }
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Billing Failed", description: e.message });
        } finally {
            setIsBilling(false);
        }
    };

    const getStatusVariant = (status: FinancialRecord['status']) => {
        switch (status) { case 'Paid': return 'default'; case 'Unpaid': return 'secondary'; case 'Overdue': return 'destructive'; case 'Pending Reversal': return 'secondary'; case 'Rejected Reversal': return 'destructive'; default: return 'outline'; }
    };

    return (
      <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <Popover>
                  <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("w-full sm:w-[300px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (dateRange.to ? (<>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>) : (format(dateRange.from, "LLL dd, y"))) : (<span>Filter by Due Date</span>)}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                      <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                  </PopoverContent>
              </Popover>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={handleManualServiceBill} disabled={isBilling} className="bg-orange-50 text-orange-700 border-orange-200">
                    {isBilling ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Utensils className="h-4 w-4 mr-2"/>}
                    Bill Today's Services
                </Button>
                {student && (<GenerateStatement student={student} records={filteredRecords} dateRange={dateRange} summary={overallSummary} />)}
              </div>
          </div>
          <div className="overflow-x-auto w-full border rounded-md bg-white">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Date & Description</TableHead>
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
                                          <p className="text-[10px] text-muted-foreground">{rec.createdAt?.toDate ? format(rec.createdAt.toDate(), 'dd MMM yy') : 'Pending...'}</p>
                                          <span className="font-medium">{rec.description}</span>
                                          <p className="text-[10px] uppercase font-bold text-slate-400">{rec.type}</p>
                                      </TableCell>
                                      <TableCell className={`text-right font-mono ${rec.billedAmount < 0 ? 'text-green-600' : ''}`}>GH₵{rec.billedAmount.toFixed(2)}</TableCell>
                                      <TableCell className="text-right font-mono text-green-600">GH₵{(rec.amountPaid || 0).toFixed(2)}</TableCell>
                                      <TableCell className="text-xs">{rec.dueDate?.toDate ? format(rec.dueDate.toDate(), 'PPP') : 'N/A'}</TableCell>
                                      <TableCell><Badge variant={getStatusVariant(rec.status)}>{rec.status}</Badge></TableCell>
                                      <TableCell>
                                          <div className="flex gap-1 justify-end">
                                              <Button variant="ghost" size="icon" onClick={() => setOpenRowId(openRowId === rec.id ? null : rec.id)}><ChevronsUpDown className="h-4 w-4 text-slate-500"/></Button>
                                              <DropdownMenu>
                                                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button></DropdownMenuTrigger>
                                                  <DropdownMenuContent>
                                                      <DropdownMenuItem onClick={() => onRecordPayment(rec)}><DollarSign className="mr-2 h-4 w-4"/> Record Payment</DropdownMenuItem>
                                                      <DropdownMenuItem onClick={() => onApplyWaiver(rec)} disabled={balance <= 0}><FileCog className="mr-2 h-4 w-4"/> Apply Waiver</DropdownMenuItem>
                                                      <DropdownMenuItem onClick={() => onEditRecord(rec)}><Edit className="mr-2 h-4 w-4"/> Edit Record</DropdownMenuItem>
                                                      <DropdownMenuSeparator />
                                                      <DropdownMenuItem onClick={() => onReverseTransaction(rec)} className="text-red-600"><RefreshCw className="mr-2 h-4 w-4"/> Request Reversal</DropdownMenuItem>
                                                      <DropdownMenuSeparator />
                                                      <Dialog>
                                                          <DialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}><Receipt className="mr-2 h-4 w-4"/> Print Full Receipt</DropdownMenuItem></DialogTrigger>
                                                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                              <DialogHeader><DialogTitle>Full Statement Receipt</DialogTitle><DialogDescription>Consolidated receipt for all payments made against this bill.</DialogDescription></DialogHeader>
                                                              <GenerateReceipt transaction={rec} payment={{ id: 'consolidated-' + rec.id, amount: rec.amountPaid, method: 'Total Recorded', paidAt: rec.lastPaymentDate || rec.createdAt, notes: 'Consolidated Receipt for ' + rec.description } as any} variant="full" />
                                                          </DialogContent>
                                                      </Dialog>
                                                  </DropdownMenuContent>
                                              </DropdownMenu>
                                          </div>
                                      </TableCell>
                                  </TableRow>
                                  {openRowId === rec.id && (<TableRow className="bg-slate-50/50"><TableCell colSpan={6} className="p-0"><PaymentHistory record={rec} /></TableCell></TableRow>)}
                              </React.Fragment>
                          ); 
                      })}
                  </TableBody>
              </Table>
          </div>
      </div>
    );
}

// --- SUB-COMPONENT: Daily Charge Form ---
function DailyChargeForm({ setOpen, classes, students, schoolId, onRecordsAdded }: { setOpen: (open: boolean) => void; classes: any[], students: Student[], schoolId: string, onRecordsAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const[isSubmitting, setIsSubmitting] = useState(false);
    
    const [selectedClassId, setSelectedClassId] = useState('');
    const[chargeType, setChargeType] = useState<'Canteen' | 'Transport'>('Canteen');
    const [date, setDate] = useState<Date>(new Date());
    
    // Global Canteen Rate (Transport uses individual route rates)
    const[canteenRate, setCanteenRate] = useState(0);
    const [routesMap, setRoutesMap] = useState<Map<string, number>>(new Map());
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    
    const classStudents = useMemo(() => students.filter(s => s.classId === selectedClassId), [students, selectedClassId]);

    // Fetch Rates on Mount
    useEffect(() => {
        if(!firestore || !schoolId) return;
        const fetchRates = async () => {
            // Fetch Canteen Rate
            const cSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen'));
            if(cSnap.exists()) setCanteenRate(Number(cSnap.data().dailyRate) || 0);

            // Fetch Transport Routes
            const rSnap = await getDocs(query(collection(firestore, 'routes'), where('schoolId', '==', schoolId)));
            const rMap = new Map<string, number>();
            rSnap.docs.forEach(d => rMap.set(d.id, Number(d.data().dailyRate) || 0));
            setRoutesMap(rMap);
        };
        fetchRates();
    }, [firestore, schoolId]);

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
        if(selectedStudents.length === 0) return toast({ variant: 'destructive', title: 'Error', description: 'Select at least one student.' });

        setIsSubmitting(true);
        try {
            const batch = writeBatch(firestore);
            const dateStr = format(date, 'yyyy-MM-dd');
            let billedCount = 0;

            selectedStudents.forEach(uid => {
                const student = classStudents.find(s => s.uid === uid);
                if(!student) return;

                // Determine Rate
                let appliedRate = 0;
                if (chargeType === 'Canteen') {
                    appliedRate = canteenRate;
                } else if (chargeType === 'Transport') {
                    if (!student.routeId) return; // Skip if no route assigned
                    appliedRate = routesMap.get(student.routeId) || 0;
                }

                if (appliedRate <= 0) return; // Don't create 0 bills

                const recordId = `${chargeType.toLowerCase()}-${uid}-${dateStr}`;
                const recordRef = doc(firestore, 'financialRecords', recordId);
                
                batch.set(recordRef, {
                    studentId: uid,
                    studentName: `${student.firstName} ${student.lastName}`,
                    classId: selectedClassId,
                    type: `${chargeType} Fee (Daily)`,
                    description: `${chargeType} (Manual) - ${format(date, 'PPP')}`,
                    billedAmount: appliedRate,
                    amountPaid: 0,
                    status: 'Unpaid',
                    dueDate: Timestamp.fromDate(startOfDay(date)),
                    createdAt: serverTimestamp(),
                    schoolId: schoolId,
                }, { merge: true });
                
                billedCount++;
            });

            if (billedCount === 0) {
                toast({ variant: 'destructive', title: 'No Bills Created', description: 'Check if students have assigned routes or if rates are > 0.' });
                return;
            }

            await batch.commit();
            toast({ title: 'Success', description: `Generated ${billedCount} bills successfully.` });
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
                            <SelectContent><SelectItem value="Canteen">Canteen</SelectItem><SelectItem value="Transport">Transport</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild><Button variant={'outline'} className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{date ? format(date, 'PP') : <span>Pick a date</span>}</Button></PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus/></PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Class</Label>
                    <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                        <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                        <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                    {chargeType === 'Canteen' && <p className="text-xs text-muted-foreground mt-1">Current Rate: GH₵{canteenRate}</p>}
                    {chargeType === 'Transport' && <p className="text-xs text-blue-600 mt-1">Rates will be applied dynamically based on each student's assigned route.</p>}
                </div>

                {selectedClassId && (
                    <div className="border rounded-md max-h-[300px] overflow-y-auto p-2">
                        <div className="flex items-center gap-2 p-2 border-b mb-2 sticky top-0 bg-white">
                            <Checkbox checked={selectedStudents.length === classStudents.length && classStudents.length > 0} onCheckedChange={toggleAll}/>
                            <Label>Select All ({classStudents.length})</Label>
                        </div>
                        {classStudents.map(s => (
                            <div key={s.uid} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded">
                                <Checkbox checked={selectedStudents.includes(s.uid)} onCheckedChange={() => toggleStudent(s.uid)}/>
                                <span className="text-sm">{s.firstName} {s.lastName}</span>
                                {chargeType === 'Transport' && s.routeId && (
                                    <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-200 ml-auto">GH₵ {routesMap.get(s.routeId) || 0}</Badge>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <Button onClick={handleSubmit} disabled={isSubmitting || selectedStudents.length === 0} className="w-full">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4"/>}
                    Generate Bills
                </Button>
            </div>
        </DialogContent>
    );
}

export default function AccountsPage() {
  const { role } = useRole(); 
  const firestore = useFirestore(); 
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();
  
  const [activeForm, setActiveForm] = useState<'single' | 'bulk' | 'levy' | 'termly-transport' | 'termly-canteen' | 'daily' | null>(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogState, setDialogState] = useState<{ type: 'payment' | 'waiver' | 'reversal' | 'history', record: FinancialRecord | null }>({ type: 'payment', record: null });
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null); 
  const [activeTab, setActiveTab] = useState('billing');

  const recordsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: records, isLoading: isLoadingRecords, forceRefetch } = useCollection<FinancialRecord>(recordsQuery);
  
  const rawStudentsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: rawStudents, isLoading: isLoadingStudents } = useCollection<Student>(rawStudentsQuery);
  
  // Strictly only use active students for this operational page
  const students = useMemo(() => {
      if (!rawStudents) return [];
      return rawStudents.filter(s => s.enrollmentStatus === 'Active' || !s.enrollmentStatus);
  }, [rawStudents]);

  const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: classes } = useCollection<Class>(classesQuery);

  const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role || '');
  const isAdmin = ['Administrator', 'Director'].includes(role || '');
  const isLoading = isLoadingRecords || isLoadingStudents;

  const dashboardStats = useMemo(() => {
    if (!records || !students) return { totalRevenue: 0, totalOutstanding: 0, outstandingTuition: 0, outstandingCanteen: 0, outstandingTransport: 0, otherDebt: 0 };
    
    // Cross-reference with active students only
    const activeStudentIds = new Set(students.map(s => s.uid));

    const activeRecords = records.filter(r => 
        r.status !== 'Pending Reversal' && 
        r.status !== 'Rejected Reversal' &&
        activeStudentIds.has(r.studentId)
    );

    let totalPaid = 0, totalBilled = 0, totalWaivers = 0, outstandingTuition = 0, outstandingCanteen = 0, outstandingTransport = 0, otherDebt = 0;

    for (const record of activeRecords) {
        const billed = record.billedAmount || 0;
        const paid = record.amountPaid || 0;
        const waiver = record.waiverAmount || 0;
        const balance = billed - paid - waiver;
        totalBilled += billed; totalPaid += paid; totalWaivers += waiver;
        
        if (balance > 0) {
            if (record.type.includes('Tuition')) outstandingTuition += balance;
            else if (record.type.includes('Canteen')) outstandingCanteen += balance;
            else if (record.type.includes('Transport')) outstandingTransport += balance;
            else otherDebt += balance;
        }
    }
    return { 
        totalRevenue: totalPaid, 
        totalOutstanding: totalBilled - totalPaid - totalWaivers, 
        outstandingTuition, 
        outstandingCanteen, 
        outstandingTransport, 
        otherDebt 
    };
  }, [records, students]);

  const studentFinancials = useMemo(() => {
    if (!records || !students) return [];
    
    const recordsByStudent: Record<string, FinancialRecord[]> = {};
    records.forEach(r => { if (!recordsByStudent[r.studentId]) recordsByStudent[r.studentId] = []; recordsByStudent[r.studentId].push(r); });
    
    return students.map(student => {
          const studentRecords = recordsByStudent[student.uid] || [];
          const activeRecords = studentRecords.filter(r => r.status !== 'Pending Reversal' && r.status !== 'Rejected Reversal');
          const totalBilled = activeRecords.reduce((acc, r) => acc + r.billedAmount, 0);
          const totalPaid = activeRecords.reduce((acc, r) => acc + (r.amountPaid || 0) + (r.waiverAmount || 0), 0);
          return { student, balance: totalBilled - totalPaid, hasOverdue: activeRecords.some(r => r.status === 'Overdue'), records: studentRecords };
      }).sort((a, b) => b.balance - a.balance);
}, [records, students]);

  const filteredStudentsWithBills = useMemo(() => studentFinancials.filter(sf => searchStudent(sf.student, searchTerm)), [studentFinancials, searchTerm]);
  const pendingReversals = useMemo(() => records?.filter(r => r.status === 'Pending Reversal') || [], [records]);

  if (!canAccess) return <Card><CardHeader><CardTitle>Access Denied</CardTitle></CardHeader></Card>;

  return (
    <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
                <TabsTrigger value="billing">Student Billing</TabsTrigger>
                {isAdmin ? <TabsTrigger value="approval">Reversal Requests <Badge className="ml-2">{pendingReversals.length}</Badge></TabsTrigger> : null}
            </TabsList>
            <TabsContent value="billing" className="space-y-6">
                
                <Card>
                    <CardHeader><CardTitle>Financial Overview</CardTitle></CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                        <Card className="border-l-4 border-l-red-500"><CardHeader className="p-4 pb-2"><CardTitle className="text-xs font-black text-muted-foreground uppercase">Total Outstanding</CardTitle></CardHeader><CardContent className="p-4 pt-0"><div className="text-2xl font-bold text-red-600">GH₵{dashboardStats.totalOutstanding.toFixed(2)}</div></CardContent></Card>
                        <Card className="border-l-4 border-l-green-500"><CardHeader className="p-4 pb-2"><CardTitle className="text-xs font-black text-muted-foreground uppercase">Total Revenue</CardTitle></CardHeader><CardContent className="p-4 pt-0"><div className="text-2xl font-bold text-green-600">GH₵{dashboardStats.totalRevenue.toFixed(2)}</div></CardContent></Card>
                        <Card><CardHeader className="p-4 pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">Tuition Debt</CardTitle></CardHeader><CardContent className="p-4 pt-0"><div className="text-xl font-bold">GH₵{dashboardStats.outstandingTuition.toFixed(2)}</div></CardContent></Card>
                        <Card><CardHeader className="p-4 pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">Canteen Debt</CardTitle></CardHeader><CardContent className="p-4 pt-0"><div className="text-xl font-bold">GH₵{dashboardStats.outstandingCanteen.toFixed(2)}</div></CardContent></Card>
                        <Card><CardHeader className="p-4 pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">Transport Debt</CardTitle></CardHeader><CardContent className="p-4 pt-0"><div className="text-xl font-bold">GH₵{dashboardStats.outstandingTransport.toFixed(2)}</div></CardContent></Card>
                        <Card><CardHeader className="p-4 pb-2"><CardTitle className="text-xs font-medium text-muted-foreground">Other Fees</CardTitle></CardHeader><CardContent className="p-4 pt-0"><div className="text-xl font-bold">GH₵{dashboardStats.otherDebt.toFixed(2)}</div></CardContent></Card>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <CardTitle>Student Accounts</CardTitle>
                            <div className="flex items-center gap-3 flex-wrap">
                                <Button 
                                    variant="default" 
                                    className="bg-blue-600 hover:bg-blue-700 shadow-sm"
                                    onClick={() => setActiveForm(activeForm === 'single' ? null : 'single')}
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" /> Single Bill
                                </Button>

                                <Dialog open={activeForm === 'daily'} onOpenChange={(open) => setActiveForm(open ? 'daily' : null)}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 shadow-sm">
                                            <RefreshCw className="mr-2 h-4 w-4" /> Sync Daily Bills
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                        <DialogHeader>
                                            <DialogTitle>Daily Billing Sync</DialogTitle>
                                            <DialogDescription>Scan attendance records and generate missing invoices.</DialogDescription>
                                        </DialogHeader>
                                        {schoolId && <ManualBillingReconciliation schoolId={schoolId} />}
                                    </DialogContent>
                                </Dialog>

                                <Button 
                                    variant={activeForm === 'levy' ? 'default' : 'outline'} 
                                    className="border-orange-200 text-orange-700 hover:bg-orange-50 shadow-sm"
                                    onClick={() => setActiveForm(activeForm === 'levy' ? null : 'levy')}
                                >
                                    <HandCoins className="mr-2 h-4 w-4" /> Manual Levy
                                </Button>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="bg-slate-50 border-slate-300 text-slate-700">
                                            Termly Batch Operations <ChevronDown className="ml-2 h-4 w-4 text-slate-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>Start of Term Billing</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        
                                        <DropdownMenuItem onClick={() => setActiveForm('bulk')} className="cursor-pointer">
                                            <FileCog className="mr-2 h-4 w-4 text-blue-600" /> Batch Bill Class (General)
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuItem onClick={() => setActiveForm('termly-transport')} className="cursor-pointer">
                                            <BusIcon className="mr-2 h-4 w-4 text-amber-600" /> Generate Termly Transport
                                        </DropdownMenuItem>
                                        
                                        <DropdownMenuItem onClick={() => setActiveForm('termly-canteen')} className="cursor-pointer">
                                            <Utensils className="mr-2 h-4 w-4 text-green-600" /> Generate Termly Canteen
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {activeForm === 'single' && schoolId && (
                            <div className="bg-slate-50 p-4 rounded-lg border mb-4 animate-in slide-in-from-top-2">
                                <h3 className="font-bold mb-4 text-blue-900">Create Single Bill</h3>
                                <FinancialRecordForm setOpen={() => setActiveForm(null)} students={students || []} schoolId={schoolId} onRecordAdded={forceRefetch} />
                            </div>
                        )}
                        
                        {activeForm === 'bulk' && schoolId && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4 animate-in slide-in-from-top-2">
                                <h3 className="font-bold mb-4 text-blue-900">Bulk Class Billing (Tuition/Levies)</h3>
                                <BulkBillingForm setOpen={() => setActiveForm(null)} classes={classes || []} students={students || []} schoolId={schoolId} onRecordsAdded={forceRefetch} />
                            </div>
                        )}

                        {activeForm === 'levy' && schoolId && (
                            <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100 mb-4 animate-in slide-in-from-top-2">
                                <h3 className="font-bold mb-4 text-indigo-900">Manual Daily Service Levy</h3>
                                <DailyChargeForm setOpen={() => setActiveForm(null)} classes={classes || []} students={students || []} schoolId={schoolId} onRecordsAdded={forceRefetch} />
                            </div>
                        )}

                        {activeForm === 'termly-transport' && schoolId && (
                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mb-4 animate-in slide-in-from-top-2">
                                <h3 className="font-bold mb-4 text-amber-900">Termly Transport Billing</h3>
                                <p className="text-sm text-amber-700 mb-4">This will bill all students on the 'Termly' transport plan based on their route rates.</p>
                                <BulkTermlyTransportModal schoolId={schoolId} onComplete={() => { forceRefetch(); setActiveForm(null); }} />
                            </div>
                        )}

                        {activeForm === 'termly-canteen' && schoolId && (
                            <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-4 animate-in slide-in-from-top-2">
                                <h3 className="font-bold mb-4 text-green-900">Termly Canteen Billing</h3>
                                <p className="text-sm text-green-700 mb-4">This will bill all students on the 'Termly' canteen plan.</p>
                                <BulkTermlyCanteenModal schoolId={schoolId} onComplete={() => { forceRefetch(); setActiveForm(null); }} />
                            </div>
                        )}
                        
                        <StudentSearchInput value={searchTerm} onChange={setSearchTerm} className="max-w-sm"/>
                        {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div> : (
                            <div className="space-y-2">
                                {filteredStudentsWithBills.length === 0 ? (
                                    <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">No students found.</div>
                                ) : (
                                    <Accordion type="single" collapsible className="w-full">
                                        {filteredStudentsWithBills.map(({ student, balance, records }) => (
                                            <AccordionItem value={student.uid} key={student.uid} className="border rounded-lg mb-2 px-4 bg-white">
                                                <AccordionTrigger className="hover:no-underline py-4">
                                                    <div className='flex justify-between items-center w-full pr-4'>
                                                        <StudentDisplay student={student} variant="full" showAvatar />
                                                        <div className="text-right">
                                                            <p className="text-xs uppercase font-bold text-muted-foreground">Balance</p>
                                                            <p className={cn("font-bold text-xl", balance > 0.01 ? "text-red-600" : "text-green-600")}>
                                                                GH₵{Math.abs(balance).toFixed(2)} {balance < -0.01 ? "(CR)" : ""}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent className="pt-2 pb-4 border-t mt-2">
                                                    <StudentLedgerDetail 
                                                        student={student} 
                                                        records={records} 
                                                        onRecordPayment={(rec) => setDialogState({ type: 'payment', record: rec })} 
                                                        onApplyWaiver={(rec) => setDialogState({ type: 'waiver', record: rec })} 
                                                        onEditRecord={(rec) => setEditingRecord(rec)} 
                                                        onReverseTransaction={(rec) => setDialogState({ type: 'reversal', record: rec })}
                                                    />
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        {dialogState.record && dialogState.type === 'payment' ? (<RecordPaymentDialog record={dialogState.record} open={true} setOpen={() => setDialogState({type:'payment', record: null})} onUpdate={forceRefetch} />) : null}
    </div>
  );
}

// --- SUB-COMPONENT: Daily Charge Form ---
function DailyChargeForm({ setOpen, classes, students, schoolId, onRecordsAdded }: { setOpen: (open: boolean) => void; classes: any[], students: Student[], schoolId: string, onRecordsAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const[isSubmitting, setIsSubmitting] = useState(false);
    
    const [selectedClassId, setSelectedClassId] = useState('');
    const[chargeType, setChargeType] = useState<'Canteen' | 'Transport'>('Canteen');
    const [date, setDate] = useState<Date>(new Date());
    
    // Global Canteen Rate (Transport uses individual route rates)
    const[canteenRate, setCanteenRate] = useState(0);
    const [routesMap, setRoutesMap] = useState<Map<string, number>>(new Map());
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    
    const classStudents = useMemo(() => students.filter(s => s.classId === selectedClassId), [students, selectedClassId]);

    // Fetch Rates on Mount
    useEffect(() => {
        if(!firestore || !schoolId) return;
        const fetchRates = async () => {
            // Fetch Canteen Rate
            const cSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen'));
            if(cSnap.exists()) setCanteenRate(Number(cSnap.data().dailyRate) || 0);

            // Fetch Transport Routes
            const rSnap = await getDocs(query(collection(firestore, 'routes'), where('schoolId', '==', schoolId)));
            const rMap = new Map<string, number>();
            rSnap.docs.forEach(d => rMap.set(d.id, Number(d.data().dailyRate) || 0));
            setRoutesMap(rMap);
        };
        fetchRates();
    }, [firestore, schoolId]);

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
        if(selectedStudents.length === 0) return toast({ variant: 'destructive', title: 'Error', description: 'Select at least one student.' });

        setIsSubmitting(true);
        try {
            const batch = writeBatch(firestore);
            const dateStr = format(date, 'yyyy-MM-dd');
            let billedCount = 0;

            selectedStudents.forEach(uid => {
                const student = classStudents.find(s => s.uid === uid);
                if(!student) return;

                // Determine Rate
                let appliedRate = 0;
                if (chargeType === 'Canteen') {
                    appliedRate = canteenRate;
                } else if (chargeType === 'Transport') {
                    if (!student.routeId) return; // Skip if no route assigned
                    appliedRate = routesMap.get(student.routeId) || 0;
                }

                if (appliedRate <= 0) return; // Don't create 0 bills

                const recordId = `${chargeType.toLowerCase()}-${uid}-${dateStr}`;
                const recordRef = doc(firestore, 'financialRecords', recordId);
                
                batch.set(recordRef, {
                    studentId: uid,
                    studentName: `${student.firstName} ${student.lastName}`,
                    classId: selectedClassId,
                    type: `${chargeType} Fee (Daily)`,
                    description: `${chargeType} (Manual) - ${format(date, 'PPP')}`,
                    billedAmount: appliedRate,
                    amountPaid: 0,
                    status: 'Unpaid',
                    dueDate: Timestamp.fromDate(startOfDay(date)),
                    createdAt: serverTimestamp(),
                    schoolId: schoolId,
                }, { merge: true });
                
                billedCount++;
            });

            if (billedCount === 0) {
                toast({ variant: 'destructive', title: 'No Bills Created', description: 'Check if students have assigned routes or if rates are > 0.' });
                return;
            }

            await batch.commit();
            toast({ title: 'Success', description: `Generated ${billedCount} bills successfully.` });
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
                            <SelectContent><SelectItem value="Canteen">Canteen</SelectItem><SelectItem value="Transport">Transport</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 space-y-2">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild><Button variant={'outline'} className="w-full justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{date ? format(date, 'PP') : <span>Pick a date</span>}</Button></PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus/></PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Class</Label>
                    <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                        <SelectTrigger><SelectValue placeholder="Select Class" /></SelectTrigger>
                        <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                    {chargeType === 'Canteen' && <p className="text-xs text-muted-foreground mt-1">Current Rate: GH₵{canteenRate}</p>}
                    {chargeType === 'Transport' && <p className="text-xs text-blue-600 mt-1">Rates will be applied dynamically based on each student's assigned route.</p>}
                </div>

                {selectedClassId && (
                    <div className="border rounded-md max-h-[300px] overflow-y-auto p-2">
                        <div className="flex items-center gap-2 p-2 border-b mb-2 sticky top-0 bg-white">
                            <Checkbox checked={selectedStudents.length === classStudents.length && classStudents.length > 0} onCheckedChange={toggleAll}/>
                            <Label>Select All ({classStudents.length})</Label>
                        </div>
                        {classStudents.map(s => (
                            <div key={s.uid} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded">
                                <Checkbox checked={selectedStudents.includes(s.uid)} onCheckedChange={() => toggleStudent(s.uid)}/>
                                <span className="text-sm">{s.firstName} {s.lastName}</span>
                                {chargeType === 'Transport' && s.routeId && (
                                    <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-200 ml-auto">GH₵ {routesMap.get(s.routeId) || 0}</Badge>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <Button onClick={handleSubmit} disabled={isSubmitting || selectedStudents.length === 0} className="w-full">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4"/>}
                    Generate Bills
                </Button>
            </div>
        </DialogContent>
    );
}
