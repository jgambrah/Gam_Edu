
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, doc, writeBatch, serverTimestamp, updateDoc, setDoc, where, getDocs, getDoc, increment, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, MoreVertical, FileCog, Edit, Utensils, Bus, User, ChevronDown, DollarSign, HandCoins, Receipt, AlertCircle, Eye, Wallet, CheckSquare, Coffee, Printer } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isPast, startOfDay, endOfDay } from 'date-fns';
import { FinancialRecord, financialRecordSchema, bulkBillingSchema, recordPaymentSchema, applyWaiverSchema, Student, Till, Class } from '@/lib/types';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { StudentDisplay } from '@/components/student-display';
import { StudentSearchInput } from '@/components/student-search';
import { searchStudent } from '@/lib/student-utils';
import { StudentSelect } from '@/components/StudentSelect';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { GenerateReceipt } from './generate-receipt';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { DateRange } from 'react-day-picker';
import { GenerateStatement } from '@/components/dashboard/finance/GenerateStatement';


// --- Types ---
const extendedFinancialRecordSchema = financialRecordSchema.extend({
    isOpeningBalance: z.boolean().optional(),
});

// --- SUB-COMPONENT: Transaction Detail Modal ---
function TransactionDetailModal({ record, open, setOpen }: { record: FinancialRecord | null, open: boolean, setOpen: (o: boolean) => void }) {
    if (!record) return null;
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

// --- COMPONENT: Manual Daily Charge Form (NEW FEATURE) ---
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
            const settingsRef = doc(firestore, `schoolSettings/${schoolId}/rates`, docId);
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
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus/></PopoverContent>
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

function RecordPaymentDialog({ record, open, setOpen, onUpdate }: { record: FinancialRecord, open: boolean, setOpen: (open: boolean) => void, onUpdate: () => void }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { schoolId } = useCurrentSchool();
    
    const balance = record.billedAmount - (record.amountPaid || 0) - (record.waiverAmount || 0);

    const form = useForm<z.infer<typeof recordPaymentSchema>>({
        resolver: zodResolver(recordPaymentSchema),
        defaultValues: { method: 'Card' }
    });

    async function onSubmit(values: z.infer<typeof recordPaymentSchema>) {
        if (!firestore || !user || !schoolId) return;
        
        setIsSubmitting(true);
        try {
            const batch = writeBatch(firestore);
            const recordRef = doc(firestore, 'financialRecords', record.id);
            const newAmountPaid = (record.amountPaid || 0) + values.amount;
            
            const newBalance = record.billedAmount - newAmountPaid - (record.waiverAmount || 0);
            const newStatus = newBalance <= 0 ? 'Paid' : 'Unpaid';
            
            batch.update(recordRef, {
                amountPaid: newAmountPaid,
                status: newStatus,
            });

            if (values.method === 'Cash') {
                const tillQuery = query(collection(firestore, 'tills'), where('accountantId', '==', user.uid), where('status', '==', 'Open'), where('schoolId', '==', schoolId));
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
                    description: `Payment for: ${record.description} (${record.type})`,
                    schoolId: schoolId,
                });
                
                batch.update(doc(firestore, 'tills', activeTill.id), {
                    currentBalance: increment(values.amount)
                });
            }

            await batch.commit();

            toast({ 
                title: 'Payment Recorded', 
                description: newBalance < 0 
                    ? `Overpayment accepted. Account is now in credit by GH₵${Math.abs(newBalance).toFixed(2)}`
                    : 'Payment recorded successfully.' 
            });
            
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
                                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                </FormControl>
                                <FormMessage />
                                <p className="text-[10px] text-muted-foreground">You can enter an amount higher than the balance to create a credit.</p>
                            </FormItem>
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
        </Dialog>
    );
}

function ApplyWaiverDialog({ record, open, setOpen, onUpdate }: { record: FinancialRecord, open: boolean, setOpen: (open: boolean) => void, onUpdate: () => void }) {
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
        <Dialog open={open} onOpenChange={setOpen}>
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
        </Dialog>
    );
}

// --- Main Page ---
export default function AccountsPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
    
    const [activeForm, setActiveForm] = useState<'single' | 'bulk' | 'daily' | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogState, setDialogState] = useState<{ type: 'payment' | 'waiver', record: FinancialRecord | null }>({ type: 'payment', record: null });
    const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null);
    const [transactionDetail, setTransactionDetail] = useState<FinancialRecord | null>(null);
    const [studentDateRange, setStudentDateRange] = useState<Record<string, DateRange | undefined>>({});

    const finQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: records, isLoading: isLoadingRecords, forceRefetch } = useCollection<FinancialRecord>(finQuery);
    
    const studentQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: students, isLoading: isLoadingStudents } = useCollection<Student>(studentQuery);
  
    const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: classes } = useCollection<Class>(classesQuery);
  
    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);
    const isLoading = isLoadingSchool || isLoadingRecords || isLoadingStudents;
  
    const dashboardStats = useMemo(() => {
      if (!records) return { totalRevenue: 0, totalOutstanding: 0, outstandingTuition: 0, outstandingCanteen: 0, outstandingTransport: 0 };
  
      let totalPaid = 0;
      let totalBilled = 0;
      let outstandingTuition = 0;
      let outstandingCanteen = 0;
      let outstandingTransport = 0;
  
      for (const record of records) {
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
        const studentRecords = records.filter(r => r.studentId === student.uid);

        const dateRange = studentDateRange[student.uid];
        const filteredRecords = dateRange?.from ? studentRecords.filter(rec => {
            const recDate = rec.createdAt.toDate();
            const from = startOfDay(dateRange.from!);
            const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from!);
            return recDate >= from && recDate <= to;
        }) : studentRecords;


        const totalBilled = filteredRecords.reduce((acc, r) => acc + r.billedAmount, 0);
        const totalPaid = filteredRecords.reduce((acc, r) => acc + (r.amountPaid || 0), 0);
        const totalWaivers = filteredRecords.reduce((acc, r) => acc + (r.waiverAmount || 0), 0);
        const balance = totalBilled - totalPaid - totalWaivers;
        
        const sortedRecords = filteredRecords.sort((a,b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
  
        let runningBalance = 0;
        const ledger = sortedRecords.map(rec => {
              const debit = rec.billedAmount;
              const credit = (rec.amountPaid || 0) + (rec.waiverAmount || 0);
              runningBalance += (debit - credit); 
              return { ...rec, debit, credit, runningBalance };
          });
  
        return {
          student,
          balance,
          hasOverdue: studentRecords.some(r => r.status === 'Overdue'),
          ledger: ledger.reverse(),
          summary: { totalBilled, totalPaid, balance }
        };
      }).filter(sf => 
          (sf.ledger.length > 0 || searchTerm) && 
          searchStudent(sf.student, searchTerm)
      );
    }, [records, students, searchTerm, studentDateRange]);
  
  
    if (!canAccess) {
      return (
        <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is restricted to financial staff.</CardDescription></CardHeader></Card>
      );
    }
  
    const handleOpenDialog = (type: 'payment' | 'waiver', record: FinancialRecord) => setDialogState({ type, record });
    const handleCloseDialog = () => setDialogState({ type: 'payment', record: null });
    const handleOpenEditDialog = (record: FinancialRecord) => setEditingRecord(record);
    const handleCloseEditDialog = () => setEditingRecord(null);
  
    return (
      <div className="space-y-6">
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
                  <div><CardTitle>Student Billing</CardTitle><CardDescription>Create, manage, and track all student financial records.</CardDescription></div>
                  <div className="flex gap-2">
                      <Dialog open={activeForm === 'daily'} onOpenChange={(open) => setActiveForm(open ? 'daily' : null)}>
                          <DialogTrigger asChild>
                              <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                  <Coffee className="mr-2 h-4 w-4" /> Add Daily Charge
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
                  <div className="space-y-4">
                      {studentFinancials.map(({ student, balance, hasOverdue, ledger, summary }) => (
                           <Collapsible key={student.uid} className="border rounded-lg">
                              <CollapsibleTrigger className="w-full p-4 hover:bg-muted/50 rounded-lg flex justify-between items-center group">
                                  <StudentDisplay student={student} variant="full" showAvatar />
                                  <div className="flex items-center gap-4">
                                      <div className="text-right">
                                          <p className="text-sm text-muted-foreground">Balance</p>
                                          <p className={cn("font-bold text-lg", balance > 0 && "text-destructive", balance < 0 && "text-green-600")}>GH₵{balance.toFixed(2)}</p>
                                      </div>
                                      <ChevronDown className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                                  </div>
                              </CollapsibleTrigger>
                               <CollapsibleContent className="p-4 bg-slate-50/50 border-t">
                                  <div className="flex justify-end mb-4">
                                    <DatePickerWithRange 
                                        date={studentDateRange[student.uid]}
                                        onDateChange={(range) => setStudentDateRange(prev => ({ ...prev, [student.uid]: range }))}
                                    />
                                  </div>
                                  <div className="border rounded-md overflow-hidden bg-white">
                                   <Table>
                                      <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Debit</TableHead><TableHead className="text-right">Credit</TableHead><TableHead className="text-right">Run. Bal</TableHead><TableHead className="w-[120px] text-right">Actions</TableHead></TableRow></TableHeader>
                                      <TableBody>
                                          {ledger.map(rec => (
                                              <TableRow key={rec.id}>
                                                  <TableCell className="text-xs text-muted-foreground">{rec.createdAt ? format(rec.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A'}</TableCell>
                                                  <TableCell className="font-medium max-w-[200px] truncate">{rec.description}</TableCell>
                                                  <TableCell className="text-right font-mono text-red-600">{rec.debit > 0 ? `GH₵${rec.debit.toFixed(2)}` : '-'}</TableCell>
                                                  <TableCell className="text-right font-mono text-green-600">{rec.credit > 0 ? `GH₵${rec.credit.toFixed(2)}` : '-'}</TableCell>
                                                  <TableCell className="text-right font-bold text-slate-700">GH₵{rec.runningBalance.toFixed(2)}</TableCell>
                                                  <TableCell>
                                                      <div className="flex gap-1 justify-end">
                                                          {(rec.amountPaid || 0) > 0 && <GenerateReceipt transaction={rec} />}
                                                          <DropdownMenu>
                                                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400"><MoreVertical /></Button></DropdownMenuTrigger>
                                                              <DropdownMenuContent>
                                                                  <DropdownMenuItem onClick={() => setTransactionDetail(rec)}><Eye className="mr-2 h-4 w-4"/> View Details</DropdownMenuItem>
                                                                  <DropdownMenuItem onClick={() => handleOpenEditDialog(rec)}><Edit className="mr-2 h-4 w-4" /> Edit Bill</DropdownMenuItem>
                                                                  <DropdownMenuItem onClick={() => handleOpenDialog('payment', rec)}>Record Payment</DropdownMenuItem>
                                                                  <DropdownMenuItem onClick={() => handleOpenDialog('waiver', rec)}>Apply Waiver</DropdownMenuItem>
                                                              </DropdownMenuContent>
                                                          </DropdownMenu>
                                                      </div>
                                                  </TableCell>
                                              </TableRow>
                                          ))}
                                      </TableBody>
                                  </Table>
                                  </div>
                                   <div className="mt-4">
                                    <GenerateStatement 
                                        student={student}
                                        records={ledger.reverse()} // Use filtered and sorted records
                                        dateRange={studentDateRange[student.uid]}
                                        summary={summary}
                                    />
                                </div>
                              </CollapsibleContent>
                          </Collapsible>
                      ))}
                  </div>
              )}
          </CardContent>
        </Card>
        
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
        {editingRecord && (
          <EditRecordDialog 
              record={editingRecord} 
              open={!!editingRecord} 
              setOpen={handleCloseEditDialog} 
              onUpdate={forceRefetch} 
          />
        )}
        {transactionDetail && (
          <TransactionDetailModal 
              record={transactionDetail} 
              open={!!transactionDetail} 
              setOpen={() => setTransactionDetail(null)}
          />
        )}
      </div>
    );
  }
