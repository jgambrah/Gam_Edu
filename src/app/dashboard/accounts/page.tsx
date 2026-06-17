
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, doc, writeBatch, serverTimestamp, updateDoc, setDoc, where, getDocs, getDoc, increment, orderBy, deleteField, addDoc, Timestamp, deleteDoc } from 'firebase/firestore';
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
import { Loader2, PlusCircle, FileCog, Edit, Utensils, Bus as BusIcon, DollarSign, HandCoins, Receipt, AlertCircle, Wallet, CalendarIcon, RefreshCw, ChevronsUpDown, Check, XCircle, CheckCircle2, MoreVertical, Search, Sparkles, Route as RouteIcon, ChevronDown, ShieldAlert, Trash2, Globe, Send, Clock, TrendingUp, Layers, BookOpen } from 'lucide-react';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

import { Student, financialRecordSchema, recordPaymentSchema, bulkBillingSchema, applyWaiverSchema, Class, PaymentTransaction, Route, FinancialRecord } from '@/lib/types';
import { StudentDisplay } from '@/components/student-display';
import { searchStudent, generateNextReceiptId } from '@/lib/student-utils';
import { GenerateReceipt } from './generate-receipt';
import { GenerateStatement } from '@/components/dashboard/finance/GenerateStatement';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { billStudentForAttendance } from '@/lib/billing';
import { ManualBillingReconciliation } from '@/components/dashboard/finance/manual-billing-reconciliation';
import { StudentSearchInput } from '@/components/student-search';
import { sendSchoolSMSAction } from '@/app/actions/sms';

const extendedFinancialRecordSchema = financialRecordSchema.extend({
    isOpeningBalance: z.boolean().optional(),
});

// --- SUB-COMPONENT: Apply Waiver Dialog ---
function ApplyWaiverDialog({ record, open, setOpen, onUpdate }: { record: FinancialRecord, open: boolean, setOpen: (open: boolean) => void, onUpdate: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<z.infer<typeof applyWaiverSchema>>({
        resolver: zodResolver(applyWaiverSchema),
        defaultValues: { amount: 0, reason: '' }
    });

    const balance = record.billedAmount - (record.amountPaid || 0) - (record.waiverAmount || 0);

    async function onSubmit(values: z.infer<typeof applyWaiverSchema>) {
        if (!firestore || !record.id) return;
        setIsSubmitting(true);
        try {
            const recordRef = doc(firestore, 'financialRecords', record.id);
            const newWaiverAmount = (record.waiverAmount || 0) + values.amount;
            const isFullySettled = (record.billedAmount - (record.amountPaid || 0) - newWaiverAmount) <= 0.01;
            
            await updateDoc(recordRef, {
                waiverAmount: newWaiverAmount,
                waiverReason: values.reason,
                status: isFullySettled ? 'Paid' : record.status
            });
            
            toast({ title: 'Waiver Applied', description: `GH₵${values.amount.toFixed(2)} waived.` });
            onUpdate();
            setOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Apply Waiver</DialogTitle>
                    <DialogDescription>Reducing the amount owed for: {record.description}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg text-center">
                            <p className="text-xs uppercase font-bold text-orange-600">Current Outstanding</p>
                            <p className="text-2xl font-bold text-orange-900">GH₵{balance.toFixed(2)}</p>
                        </div>
                        <FormField control={form.control} name="amount" render={({ field }) => {
                          return (
                            <FormItem>
                                <FormLabel>{"Waiver Amount (GH₵)"}</FormLabel>
                                <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)}/></FormControl>
                                <FormMessage />
                            </FormItem>
                          );
                        }}/>
                        <FormField control={form.control} name="reason" render={({ field }) => {
                          return (
                            <FormItem>
                                <FormLabel>Reason for Waiver</FormLabel>
                                <FormControl><Textarea placeholder="e.g. Scholarship discount, Administrative correction" {...field}/></FormControl>
                                <FormMessage />
                            </FormItem>
                          );
                        }}/>
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Apply Waiver
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

// --- SUB-COMPONENT: Edit Record Dialog ---
function EditRecordDialog({ record, open, setOpen, onUpdate }: { record: FinancialRecord, open: boolean, setOpen: (open: boolean) => void, onUpdate: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<z.infer<typeof financialRecordSchema>>({
        resolver: zodResolver(financialRecordSchema),
        defaultValues: {
            studentId: record.studentId,
            type: record.type as any,
            description: record.description,
            billedAmount: record.billedAmount,
            dueDate: record.dueDate?.toDate ? record.dueDate.toDate() : new Date(record.dueDate),
            academicYear: record.academicYear,
            term: record.term
        }
    });

    async function onSubmit(values: z.infer<typeof financialRecordSchema>) {
        if (!firestore || !record.id) return;
        setIsSubmitting(true);
        try {
            const recordRef = doc(firestore, 'financialRecords', record.id);
            const isFullyPaid = (values.billedAmount - (record.amountPaid || 0) - (record.waiverAmount || 0)) <= 0.01;
            
            await updateDoc(recordRef, {
                ...values,
                dueDate: Timestamp.fromDate(values.dueDate),
                status: isFullyPaid ? 'Paid' : 'Unpaid'
            });
            
            toast({ title: 'Bill Updated' });
            onUpdate();
            setOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Update Failed', description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Edit Bill</DialogTitle>
                    <DialogDescription>Modify the details of this financial record.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="type" render={({ field }) => {
                          return (
                            <FormItem>
                                <FormLabel>Fee Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {['Tuition Fee', 'Admission Fee', 'Maintenance Fee', 'Examination Fee', 'PTA Levy', 'Library Fine', 'Lab Fee', 'Sports Fee', 'Canteen Fee', 'Transport Fee', 'Other', 'Correction / Reversal'].map(t => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                          );
                        }}/>
                        <FormField control={form.control} name="description" render={({ field }) => {
                          return (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                            </FormItem>
                          );
                        }}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="billedAmount" render={({ field }) => {
                              return (
                                <FormItem>
                                    <FormLabel>{"Total Bill (GH₵)"}</FormLabel>
                                    <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)}/></FormControl>
                                </FormItem>
                              );
                            }}/>
                            <FormField control={form.control} name="dueDate" render={({ field }) => {
                              return (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Due Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={'outline'} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </FormItem>
                              );
                            }}/>
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Save Changes
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

// --- SUB-COMPONENT: Reversal Request Dialog ---
function ReversalRequestDialog({ record, open, setOpen, onUpdate }: { record: FinancialRecord, open: boolean, setOpen: (open: boolean) => void, onUpdate: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reason, setReason] = useState('');

    async function handleRequest() {
        if (!firestore || !record.id || !reason.trim()) return;
        setIsSubmitting(true);
        try {
            await updateDoc(doc(firestore, 'financialRecords', record.id), {
                status: 'Pending Reversal',
                reversalReason: reason,
                reversalRequestedAt: serverTimestamp()
            });
            toast({ title: 'Reversal Requested', description: 'Administrator will review this request.' });
            onUpdate();
            setOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Error', description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Request Transaction Reversal</DialogTitle>
                    <DialogDescription>This will flag the record for administrative review and possible cancellation.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Reason for Reversal</Label>
                        <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Explain why this transaction needs to be reversed..." />
                    </div>
                    <Button variant="destructive" onClick={handleRequest} disabled={isSubmitting || !reason.trim()} className="w-full">
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Submit Reversal Request
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- SUB-COMPONENT: Daily Charge Form ---
function DailyChargeForm({ setOpen, classes, students, schoolId, onRecordsAdded }: { setOpen: (open: boolean) => void; classes: any[], students: Student[], schoolId: string, onRecordsAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [chargeType, setChargeType] = useState<'Canteen' | 'Transport'>('Canteen');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    
    const [canteenSettings, setCanteenSettings] = useState<any>(null);
    const [studentToRouteRateMap, setStudentToRouteRateMap] = useState<Map<string, number>>(new Map());
    
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [studentSearch, setStudentSearch] = useState('');
    
    const classStudents = useMemo(() => students.filter(s => s.classId === selectedClassId), [students, selectedClassId]);
    const filteredStudents = useMemo(() => 
        classStudents.filter(s => searchStudent(s, studentSearch)), 
    [classStudents, studentSearch]);

    // Fetch Rates on Mount
    useEffect(() => {
        if(!firestore || !schoolId) return;
        const fetchRates = async () => {
            const cSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen'));
            if(cSnap.exists()) setCanteenSettings(cSnap.data());

            const rSnap = await getDocs(query(collection(firestore, 'routes'), where('schoolId', '==', schoolId)));
            const sMap = new Map<string, number>();
            
            rSnap.docs.forEach(d => {
                const data = d.data();
                const rate = Number(data.dailyRate) || 0;
                data.stops?.forEach((stop: any) => {
                    stop.assignedStudentIds?.forEach((sid: string) => {
                        sMap.set(sid, rate);
                    });
                });
            });
            setStudentToRouteRateMap(sMap);
        };
        fetchRates();
    }, [firestore, schoolId]);

    const toggleStudent = (uid: string) => {
        if(selectedStudents.includes(uid)) setSelectedStudents(prev => prev.filter(id => id !== uid));
        else setSelectedStudents(prev => [...prev, uid]);
    };

    const toggleAll = () => {
        if(selectedStudents.length === filteredStudents.length && filteredStudents.length > 0) setSelectedStudents([]);
        else setSelectedStudents(filteredStudents.map(s => s.uid));
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

                let appliedRate = 0;
                if (chargeType === 'Canteen' && canteenSettings) {
                    const model = canteenSettings.pricingModel || 'Flat';
                    if (model === 'Flat') appliedRate = canteenSettings.dailyRate || 0;
                    else appliedRate = canteenSettings.classRates?.[selectedClassId] || 0;
                } else if (chargeType === 'Transport') {
                    appliedRate = studentToRouteRateMap.get(uid) || 0;
                }

                if (appliedRate <= 0) return;

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
        <Dialog open={true} onOpenChange={(open) => !open && setOpen(false)}>
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
                            <SelectContent>{classes?.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>

                    {selectedClassId && (
                        <div className="space-y-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <StudentSearchInput value={studentSearch} onChange={setStudentSearch} placeholder="Search student in class..." className="pl-8 h-9" />
                            </div>
                            <div className="border rounded-md max-h-[300px] overflow-y-auto p-2 bg-slate-50/50">
                                <div className="flex items-center gap-2 p-2 border-b mb-2 sticky top-0 bg-white z-10">
                                    <Checkbox checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0} onCheckedChange={toggleAll}/>
                                    <Label className="text-xs font-bold uppercase text-slate-500">Select All ({filteredStudents.length})</Label>
                                </div>
                                {filteredStudents.map(s => (
                                    <div key={s.uid} className="flex items-center gap-2 p-2 hover:bg-white rounded transition-colors cursor-pointer" onClick={() => toggleStudent(s.uid)}>
                                        <Checkbox checked={selectedStudents.includes(s.uid)} onCheckedChange={() => toggleStudent(s.uid)}/>
                                        <span className="text-sm font-medium">{s.firstName} {s.lastName}</span>
                                        <Badge variant="outline" className="text-[10px] ml-auto">
                                            {chargeType === 'Transport' ? `GH₵ ${studentToRouteRateMap.get(s.uid) || 0}` : `Canteen`}
                                        </Badge>
                                    </div>
                                ))}
                                {filteredStudents.length === 0 && <p className="text-center py-10 text-muted-foreground text-xs italic">No students match your search.</p>}
                            </div>
                        </div>
                    )}

                    <Button onClick={handleSubmit} disabled={isSubmitting || selectedStudents.length === 0} className="w-full h-12 text-lg">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4"/>}
                        Generate Bills
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function FinancialRecordForm({ setOpen, students, schoolId, onRecordAdded }: { setOpen: (open: boolean) => void; students: Student[], schoolId: string, onRecordAdded: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  
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

  const filteredStudents = useMemo(() => 
    students.filter(s => searchStudent(s, studentSearch)), 
  [students, studentSearch]);

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
                render={({ field }) => {
                  return (
                    <FormItem>
                        <FormLabel>Search & Select Student</FormLabel>
                        <div className="space-y-2">
                            <StudentSearchInput value={studentSearch} onChange={setStudentSearch} placeholder="Start typing name or ID..." className="h-9"/>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Choose student from results..."/></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <ScrollArea className="h-[200px]">
                                        {filteredStudents.map(s => (
                                            <SelectItem key={s.uid} value={s.uid}>
                                                <StudentDisplay student={s} variant="compact" />
                                            </SelectItem>
                                        ))}
                                        {filteredStudents.length === 0 && <p className="p-4 text-center text-xs text-muted-foreground">No students match your search.</p>}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                        </div>
                        <FormMessage />
                    </FormItem>
                  );
                }}
            />

            {isOpeningBalance ? null : (
                <FormField 
                    control={form.control} 
                    name="type" 
                    render={({ field }) => {
                      return (
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
                      );
                    }}
                />
            )}

            <FormField 
                control={form.control} 
                name="description" 
                render={({ field }) => {
                  return (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Input placeholder="Brief description of charge" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  );
                }}
            />

            <div className="grid grid-cols-2 gap-4">
                <FormField 
                    control={form.control} 
                    name="billedAmount" 
                    render={({ field }) => {
                      return (
                        <FormItem>
                            <FormLabel>{"Amount (GH₵)"}</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                      );
                    }}
                />
                <FormField 
                    control={form.control} 
                    name="dueDate" 
                    render={({ field }) => {
                      return (
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
                      );
                    }}
                />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg">
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
                render={({ field }) => {
                  return (
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
                  );
                }}
            />
            <FormField 
                control={form.control} 
                name="type" 
                render={({ field }) => {
                  return (
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
                  );
                }}
            />
            <FormField 
                control={form.control} 
                name="description" 
                render={({ field }) => {
                  return (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Spring Term Tuition" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  );
                }}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField 
                    control={form.control} 
                    name="billedAmount" 
                    render={({ field }) => {
                      return (
                        <FormItem>
                            <FormLabel>{"Amount per Student (GH₵)"}</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(e.target.value === '' ? 0 : parseFloat(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                      );
                    }}
                />
                <FormField 
                    control={form.control} 
                    name="dueDate" 
                    render={({ field }) => {
                      return (
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
                      );
                    }}
                />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-6 animate-spin"/> : null} 
                Add Bulk Bill
            </Button>
        </form>
      </Form>
    );
}

function TermlyTransportForm({ setOpen, classes, students, schoolId, onRecordsAdded }: { setOpen: (open: boolean) => void; classes: Class[], students: Student[], schoolId: string, onRecordsAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Routes
    const routesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'routes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: routes } = useCollection<Route>(routesQuery);

    const termlyTransportSchema = z.object({
      academicYear: z.string().min(1, "Academic Year is required"),
      term: z.string().min(1, "Term is required"),
      targetType: z.enum(['all', 'class', 'route']),
      targetId: z.string().optional(),
      dueDate: z.date({ required_error: "Due Date is required" }),
      rateModel: z.enum(['route', 'flat']),
      flatAmount: z.coerce.number().optional()
    }).refine(data => data.targetType === 'all' || !!data.targetId, {
      message: "Target Selection is required",
      path: ["targetId"]
    }).refine(data => data.rateModel === 'route' || (data.flatAmount !== undefined && data.flatAmount > 0), {
      message: "Flat amount override must be greater than 0",
      path: ["flatAmount"]
    });

    const form = useForm<z.infer<typeof termlyTransportSchema>>({ 
      resolver: zodResolver(termlyTransportSchema), 
      defaultValues: { 
        academicYear: '2025/2026',
        term: 'Term 1',
        targetType: 'all',
        targetId: '',
        dueDate: new Date(),
        rateModel: 'route',
        flatAmount: 0
      } 
    });

    const targetType = form.watch('targetType');
    const rateModel = form.watch('rateModel');

    async function onSubmit(values: z.infer<typeof termlyTransportSchema>) {
      if (!firestore || !schoolId) return;
      setIsSubmitting(true);
      
      let targets = students.filter(s => s.usesBusService === true && s.transportBillingModel === 'Termly');
      if (values.targetType === 'class' && values.targetId) {
        targets = targets.filter(s => s.classId === values.targetId);
      } else if (values.targetType === 'route' && values.targetId) {
        targets = targets.filter(s => s.routeId === values.targetId);
      }

      if (targets.length === 0) {
        toast({
          variant: 'destructive',
          title: 'No Subscribers Found',
          description: 'No active termly transport subscribers match your criteria.'
        });
        setIsSubmitting(false);
        return;
      }

      const sMap = new Map<string, number>();
      if (values.rateModel === 'route') {
        const routesSnap = await getDocs(query(collection(firestore, 'routes'), where('schoolId', '==', schoolId)));
        routesSnap.docs.forEach(d => {
          const data = d.data() as Route;
          const rate = Number(data.termlyRate) || 0;
          if (data.id) {
            sMap.set(data.id, rate);
          }
          data.stops?.forEach(stop => {
            stop.assignedStudentIds?.forEach(sid => {
              sMap.set(sid + '_stop', rate);
            });
          });
        });
      }

      try {
        const batch = writeBatch(firestore);
        let billedCount = 0;
        let skippedCount = 0;

        targets.forEach(student => {
          let amount = 0;
          if (values.rateModel === 'flat') {
            amount = values.flatAmount || 0;
          } else {
            const routeRate = student.routeId ? sMap.get(student.routeId) : undefined;
            const stopRate = sMap.get(student.uid + '_stop');
            amount = routeRate !== undefined ? routeRate : (stopRate !== undefined ? stopRate : 0);
          }

          if (amount <= 0) {
            skippedCount++;
            return;
          }

          const safeYearStr = values.academicYear.replace(/[\/\s]/g, '-');
          const safeTermStr = values.term.replace(/[\/\s]/g, '-');
          const recordId = `transport-termly-${student.uid}-${safeYearStr}-${safeTermStr}`;
          const recordRef = doc(firestore, 'financialRecords', recordId);

          batch.set(recordRef, {
            studentId: student.uid,
            studentName: `${student.firstName} ${student.lastName}`,
            classId: student.classId || '',
            type: 'Transport Fee (Termly)',
            description: `Transport Fee - ${values.academicYear} ${values.term} (Termly)`,
            billedAmount: amount,
            amountPaid: 0,
            waiverAmount: 0,
            status: 'Unpaid',
            dueDate: Timestamp.fromDate(values.dueDate),
            createdAt: serverTimestamp(),
            academicYear: values.academicYear,
            term: values.term,
            schoolId: schoolId,
          }, { merge: true });

          billedCount++;
        });

        if (billedCount === 0) {
          toast({
            variant: 'destructive',
            title: 'No Invoices Created',
            description: `Skipped ${skippedCount} students because their transport rate is 0. Check routes rates.`
          });
          setIsSubmitting(false);
          return;
        }

        await batch.commit();
        toast({
          title: 'Success',
          description: `Billed ${billedCount} students successfully.${skippedCount > 0 ? ` (Skipped ${skippedCount} with 0 rates)` : ''}`
        });
        onRecordsAdded();
        setOpen(false);
      } catch (e: any) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Error', description: e.message });
      } finally {
        setIsSubmitting(false);
      }
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField 
                    control={form.control} 
                    name="academicYear" 
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>Academic Year</FormLabel>
                          <FormControl><Input placeholder="e.g., 2025/2026" {...field} /></FormControl>
                          <FormMessage />
                      </FormItem>
                    )}
                />
                <FormField 
                    control={form.control} 
                    name="term" 
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>Term</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>
                                  {['Term 1', 'Term 2', 'Term 3'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                              </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField 
                    control={form.control} 
                    name="targetType" 
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>Billing Target</FormLabel>
                          <Select onValueChange={(val) => { field.onChange(val); form.setValue('targetId', ''); }} value={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>
                                  <SelectItem value="all">All Termly Subscribers</SelectItem>
                                  <SelectItem value="class">Specific Class</SelectItem>
                                  <SelectItem value="route">Specific Route</SelectItem>
                              </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                    )}
                />
                
                {targetType !== 'all' && (
                  <FormField 
                      control={form.control} 
                      name="targetId" 
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>{targetType === 'class' ? 'Select Class' : 'Select Route'}</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {targetType === 'class' 
                                      ? classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)
                                      : (routes || []).map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)
                                    }
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                      )}
                  />
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField 
                    control={form.control} 
                    name="rateModel" 
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>Rate Option</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>
                                  <SelectItem value="route">Use Route Termly Rates</SelectItem>
                                  <SelectItem value="flat">Flat Override Amount</SelectItem>
                              </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                    )}
                />

                {rateModel === 'flat' ? (
                  <FormField 
                      control={form.control} 
                      name="flatAmount" 
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Flat Fee (GH₵)</FormLabel>
                            <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)}/></FormControl>
                            <FormMessage />
                        </FormItem>
                      )}
                  />
                ) : (
                  <FormField 
                      control={form.control} 
                      name="dueDate" 
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-end">
                            <FormLabel className="mb-2">Invoice Due Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
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
                )}
            </div>

            {rateModel === 'flat' && (
              <FormField 
                  control={form.control} 
                  name="dueDate" 
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Invoice Due Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
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
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-6 animate-spin"/> : null} 
                Generate Termly Transport Invoices
            </Button>
        </form>
      </Form>
    );
}

function TermlyCanteenForm({ setOpen, classes, students, schoolId, onRecordsAdded }: { setOpen: (open: boolean) => void; classes: Class[], students: Student[], schoolId: string, onRecordsAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const termlyCanteenSchema = z.object({
      academicYear: z.string().min(1, "Academic Year is required"),
      term: z.string().min(1, "Term is required"),
      targetType: z.enum(['all', 'class']),
      targetId: z.string().optional(),
      dueDate: z.date({ required_error: "Due Date is required" }),
      rateModel: z.enum(['settings', 'flat']),
      flatAmount: z.coerce.number().optional()
    }).refine(data => data.targetType === 'all' || !!data.targetId, {
      message: "Target Selection is required",
      path: ["targetId"]
    }).refine(data => data.rateModel === 'settings' || (data.flatAmount !== undefined && data.flatAmount > 0), {
      message: "Flat amount override must be greater than 0",
      path: ["flatAmount"]
    });

    const form = useForm<z.infer<typeof termlyCanteenSchema>>({ 
      resolver: zodResolver(termlyCanteenSchema), 
      defaultValues: { 
        academicYear: '2025/2026',
        term: 'Term 1',
        targetType: 'all',
        targetId: '',
        dueDate: new Date(),
        rateModel: 'settings',
        flatAmount: 0
      } 
    });

    const targetType = form.watch('targetType');
    const rateModel = form.watch('rateModel');

    async function onSubmit(values: z.infer<typeof termlyCanteenSchema>) {
      if (!firestore || !schoolId) return;
      setIsSubmitting(true);

      let targets = students.filter(s => s.canteenBillingMode === 'Termly');
      if (values.targetType === 'class' && values.targetId) {
        targets = targets.filter(s => s.classId === values.targetId);
      }

      if (targets.length === 0) {
        toast({
          variant: 'destructive',
          title: 'No Subscribers Found',
          description: 'No active termly canteen subscribers match your criteria.'
        });
        setIsSubmitting(false);
        return;
      }

      let canteenSettings: any = null;
      if (values.rateModel === 'settings') {
        const cSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen'));
        if (cSnap.exists()) {
          canteenSettings = cSnap.data();
        }
      }

      try {
        const batch = writeBatch(firestore);
        let billedCount = 0;
        let skippedCount = 0;

        targets.forEach(student => {
          let amount = 0;
          if (values.rateModel === 'flat') {
            amount = values.flatAmount || 0;
          } else if (canteenSettings) {
            const pricingModel = canteenSettings.pricingModel || 'Flat';
            if (pricingModel === 'Flat') {
              amount = Number(canteenSettings.termlyRate) || 0;
            } else {
              amount = Number(canteenSettings.classTermlyRates?.[student.classId]) || 0;
            }
          }

          if (amount <= 0) {
            skippedCount++;
            return;
          }

          const safeYearStr = values.academicYear.replace(/[\/\s]/g, '-');
          const safeTermStr = values.term.replace(/[\/\s]/g, '-');
          const recordId = `canteen-termly-${student.uid}-${safeYearStr}-${safeTermStr}`;
          const recordRef = doc(firestore, 'financialRecords', recordId);

          batch.set(recordRef, {
            studentId: student.uid,
            studentName: `${student.firstName} ${student.lastName}`,
            classId: student.classId || '',
            type: 'Canteen Fee (Termly)',
            description: `Canteen Fee - ${values.academicYear} ${values.term} (Termly)`,
            billedAmount: amount,
            amountPaid: 0,
            waiverAmount: 0,
            status: 'Unpaid',
            dueDate: Timestamp.fromDate(values.dueDate),
            createdAt: serverTimestamp(),
            academicYear: values.academicYear,
            term: values.term,
            schoolId: schoolId,
          }, { merge: true });

          billedCount++;
        });

        if (billedCount === 0) {
          toast({
            variant: 'destructive',
            title: 'No Invoices Created',
            description: `Skipped ${skippedCount} students because their canteen rate is 0. Check settings.`
          });
          setIsSubmitting(false);
          return;
        }

        await batch.commit();
        toast({
          title: 'Success',
          description: `Billed ${billedCount} students successfully.${skippedCount > 0 ? ` (Skipped ${skippedCount} with 0 rates)` : ''}`
        });
        onRecordsAdded();
        setOpen(false);
      } catch (e: any) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Error', description: e.message });
      } finally {
        setIsSubmitting(false);
      }
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField 
                    control={form.control} 
                    name="academicYear" 
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>Academic Year</FormLabel>
                          <FormControl><Input placeholder="e.g., 2025/2026" {...field} /></FormControl>
                          <FormMessage />
                      </FormItem>
                    )}
                />
                <FormField 
                    control={form.control} 
                    name="term" 
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>Term</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>
                                  {['Term 1', 'Term 2', 'Term 3'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                              </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                    )}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField 
                    control={form.control} 
                    name="targetType" 
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>Billing Target</FormLabel>
                          <Select onValueChange={(val) => { field.onChange(val); form.setValue('targetId', ''); }} value={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>
                                  <SelectItem value="all">All Termly Subscribers</SelectItem>
                                  <SelectItem value="class">Specific Class</SelectItem>
                              </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                    )}
                />
                
                {targetType !== 'all' && (
                  <FormField 
                      control={form.control} 
                      name="targetId" 
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select Class</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Choose..." /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                      )}
                  />
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField 
                    control={form.control} 
                    name="rateModel" 
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>Rate Option</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent>
                                  <SelectItem value="settings">Use Settings Termly Rates</SelectItem>
                                  <SelectItem value="flat">Flat Override Amount</SelectItem>
                              </SelectContent>
                          </Select>
                          <FormMessage />
                      </FormItem>
                    )}
                />

                {rateModel === 'flat' ? (
                  <FormField 
                      control={form.control} 
                      name="flatAmount" 
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Flat Fee (GH₵)</FormLabel>
                            <FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)}/></FormControl>
                            <FormMessage />
                        </FormItem>
                      )}
                  />
                ) : (
                  <FormField 
                      control={form.control} 
                      name="dueDate" 
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-end">
                            <FormLabel className="mb-2">Invoice Due Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
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
                )}
            </div>

            {rateModel === 'flat' && (
              <FormField 
                  control={form.control} 
                  name="dueDate" 
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Invoice Due Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
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
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-6 animate-spin"/> : null} 
                Generate Termly Canteen Invoices
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
                        <FormField control={form.control} name="amount" render={({ field }) => {
                          return (
                            <FormItem><FormLabel>{"Payment Amount (GH₵)"}</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)}/></FormControl><FormMessage /></FormItem>
                          );
                        }}/>
                        <FormField control={form.control} name="method" render={({ field }) => {
                          return (
                            <FormItem>
                                <FormLabel>Payment Method</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {['Cash', 'Card', 'Bank Transfer', 'Mobile Money', 'Other'].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                          );
                        }}/>
                        <FormField control={form.control} name="notes" render={({ field }) => {
                          return (
                            <FormItem>
                                <FormLabel>Reference / Notes (Optional)</FormLabel>
                                <FormControl><Textarea placeholder="Ref or notes..." {...field}/></FormControl>
                                <FormMessage />
                            </FormItem>
                          );
                        }}/>
                        <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Confirm Payment</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
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
        const activeRecords = records.filter(r => r.status !== 'Pending Reversal');
        const totalBilled = activeRecords.reduce((acc, r) => acc + (Number(r.billedAmount) || 0), 0);
        const totalPaid = activeRecords.reduce((acc, r) => acc + (Number(r.amountPaid) || 0) + (Number(r.waiverAmount) || 0), 0);
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
                          const balance = (Number(rec.billedAmount) || 0) - (Number(rec.amountPaid) || 0) - (Number(rec.waiverAmount) || 0);
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
                                                      <DropdownMenuItem 
                                                          disabled={balance <= 0.01}
                                                          onClick={async () => {
                                                              const parentQ = query(collection(firestore!, 'parents'), where('schoolId', '==', schoolId), where('studentIds', 'array-contains', rec.studentId));
                                                              const pSnap = await getDocs(parentQ);
                                                              if (pSnap.empty || !pSnap.docs[0].data().phone) {
                                                                  return toast({ variant: 'destructive', title: "No Parent Phone Found" });
                                                              }
                                                              
                                                              const phone = pSnap.docs[0].data().phone;
                                                              const link = `https://gam-it-service.app/pay/${rec.id}`;
                                                              const msg = `Dear Parent, you have an outstanding bill of GHS ${balance.toFixed(2)} for ${rec.studentName} (${rec.description}). Please pay securely here: ${link} - GAM Edu`;
                                                              
                                                              toast({ title: "Sending SMS...", description: "Please wait." });
                                                              const result = await sendSchoolSMSAction(schoolId!, phone, msg);
                                                              
                                                              if (result.success) toast({ title: "Payment Link Sent!" });
                                                              else toast({ variant: 'destructive', title: "Failed to send SMS", description: result.error });
                                                          }}
                                                      >
                                                          <Globe className="mr-2 h-4 w-4 text-blue-600"/> Send Payment Link via SMS
                                                      </DropdownMenuItem>
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

export default function AccountsPage() {
  const { role, profile } = useRole(); 
  const firestore = useFirestore(); 
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();
  
  const [activeForm, setActiveForm] = useState<'single' | 'bulk' | 'levy' | 'termly-transport' | 'termly-canteen' | 'daily' | null>(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogState, setDialogState] = useState<{ type: 'payment' | 'waiver' | 'reversal' | 'history', record: FinancialRecord | null }>({ type: 'payment', record: null });
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null); 
  const [activeTab, setActiveTab] = useState('billing');
  const [analyticsTab, setAnalyticsTab] = useState('summary');
  const [isProcessingReversal, setIsProcessingReversal] = useState<string | null>(null);

  const recordsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: records, isLoading: isLoadingRecords, forceRefetch } = useCollection<FinancialRecord>(recordsQuery);
  
  const rawStudentsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: rawStudents, isLoading: isLoadingStudents } = useCollection<Student>(rawStudentsQuery);
  
  const students = useMemo(() => {
      if (!rawStudents) return [];
      return rawStudents.filter(s => s.enrollmentStatus === 'Active' || !s.enrollmentStatus);
  }, [rawStudents]);

  const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: classes } = useCollection<Class>(classesQuery);

  const schoolSettingsRef = useMemoFirebase(
    () => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null,
    [firestore, schoolId]
  );
  const { data: schoolSettings } = useDoc<any>(schoolSettingsRef);

  const canAccess = 
    role === 'Director' || 
    role === 'Accountant' || 
    (role === 'Administrator' && schoolSettings?.allowAdminFinanceAccess !== false) ||
    profile?.email === 'jamesgambrah@gmail.com';

  const isLoading = isLoadingRecords || isLoadingStudents;

  const dashboardStats = useMemo(() => {
    if (!records || !students) return { totalRevenue: 0, totalOutstanding: 0, outstandingTuition: 0, outstandingCanteen: 0, outstandingTransport: 0, otherDebt: 0 };
    
    const activeStudentIds = new Set(students.map(s => s.uid));

    // Consolidate filters for accuracy
    const activeRecords = records.filter(r => 
        activeStudentIds.has(r.studentId) && 
        r.status !== 'Pending Reversal'
    );

    let totalPaid = 0, totalBilled = 0, totalWaivers = 0, outstandingTuition = 0, outstandingCanteen = 0, outstandingTransport = 0, otherDebt = 0;

    for (const record of activeRecords) {
        const billed = Number(record.billedAmount) || 0;
        const paid = Number(record.amountPaid) || 0;
        const waiver = Number(record.waiverAmount) || 0;
        const balance = billed - paid - waiver;
        totalBilled += billed; totalPaid += paid; totalWaivers += waiver;
        
        if (balance > 0) {
            const type = record.type.toLowerCase();
            if (type.includes('tuition')) outstandingTuition += balance;
            else if (type.includes('canteen')) outstandingCanteen += balance;
            else if (type.includes('transport')) outstandingTransport += balance;
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

  // --- DEBT AGING CALCULATION ---
  const debtAgingStats = useMemo(() => {
    if (!records || !students) return { current: 0, age30: 0, age60: 0, age90: 0, total: 0 };
    
    const activeStudentIds = new Set(students.map(s => s.uid));
    const today = startOfDay(new Date());

    let current = 0; // Due date in the future or today
    let age30 = 0;   // Overdue 1-30 days
    let age60 = 0;   // Overdue 31-60 days
    let age90 = 0;   // Overdue 61+ days

    records.forEach(r => {
      if (!activeStudentIds.has(r.studentId) || r.status === 'Pending Reversal') return;
      
      const billed = Number(r.billedAmount) || 0;
      const paid = Number(r.amountPaid) || 0;
      const waiver = Number(r.waiverAmount) || 0;
      const balance = billed - paid - waiver;

      if (balance <= 0.01) return;

      const dueDate = r.dueDate?.toDate ? r.dueDate.toDate() : new Date(r.dueDate);
      const diffTime = today.getTime() - startOfDay(dueDate).getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        current += balance;
      } else if (diffDays <= 30) {
        age30 += balance;
      } else if (diffDays <= 60) {
        age60 += balance;
      } else {
        age90 += balance;
      }
    });

    const total = current + age30 + age60 + age90;
    return { current, age30, age60, age90, total };
  }, [records, students]);

  // --- CLASS COLLECTIONS PACE CALCULATION ---
  const classCollectionsStats = useMemo(() => {
    if (!records || !students || !classes) return [];

    const activeStudentIds = new Set(students.map(s => s.uid));
    const studentsByClass: Record<string, Student[]> = {};
    students.forEach(s => {
      if (!studentsByClass[s.classId]) studentsByClass[s.classId] = [];
      studentsByClass[s.classId].push(s);
    });

    const recordsByStudent: Record<string, FinancialRecord[]> = {};
    records.forEach(r => {
      if (!recordsByStudent[r.studentId]) recordsByStudent[r.studentId] = [];
      recordsByStudent[r.studentId].push(r);
    });

    return classes.map(c => {
      const classStudents = studentsByClass[c.id] || [];
      let totalBilled = 0;
      let totalPaid = 0;
      let totalWaivers = 0;

      classStudents.forEach(s => {
        const studentRecs = recordsByStudent[s.uid] || [];
        studentRecs.forEach(r => {
          if (r.status === 'Pending Reversal') return;
          totalBilled += Number(r.billedAmount) || 0;
          totalPaid += Number(r.amountPaid) || 0;
          totalWaivers += Number(r.waiverAmount) || 0;
        });
      });

      const netBilled = totalBilled - totalWaivers;
      const outstanding = netBilled - totalPaid;
      const rate = netBilled > 0 ? (totalPaid / netBilled) * 100 : 100;

      return {
        classId: c.id,
        className: c.name,
        studentCount: classStudents.length,
        totalBilled,
        totalPaid,
        totalWaivers,
        outstanding: outstanding > 0 ? outstanding : 0,
        rate
      };
    }).sort((a, b) => b.rate - a.rate); // default sort by collection rate descending
  }, [records, students, classes]);

  const studentFinancials = useMemo(() => {
    if (!records || !students) return [];
    
    const recordsByStudent: Record<string, FinancialRecord[]> = {};
    records.forEach(r => { if (!recordsByStudent[r.studentId]) recordsByStudent[r.studentId] = []; recordsByStudent[r.studentId].push(r); });
    
    return students.map(student => {
          const studentRecords = recordsByStudent[student.uid] || [];
          const activeRecords = studentRecords.filter(r => r.status !== 'Pending Reversal');
          const totalBilled = activeRecords.reduce((acc, r) => acc + (Number(r.billedAmount) || 0), 0);
          const totalPaid = activeRecords.reduce((acc, r) => acc + (Number(r.amountPaid) || 0) + (Number(r.waiverAmount) || 0), 0);
          return { student, balance: totalBilled - totalPaid, hasOverdue: activeRecords.some(r => r.status === 'Overdue'), records: studentRecords };
      }).sort((a, b) => b.balance - a.balance);
}, [records, students]);

  const filteredStudentsWithBills = useMemo(() => studentFinancials.filter(sf => searchStudent(sf.student, searchTerm)), [studentFinancials, searchTerm]);
  const pendingReversals = useMemo(() => records?.filter(r => r.status === 'Pending Reversal') || [], [records]);

  // --- REVERSAL HANDLERS ---
  const handleApproveReversal = async (record: FinancialRecord) => {
    if (!firestore || isProcessingReversal) return;
    setIsProcessingReversal(record.id);
    try {
        await deleteDoc(doc(firestore, 'financialRecords', record.id));
        toast({ title: "Reversal Approved", description: "The bill has been permanently removed from the student's ledger." });
        forceRefetch();
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Approval Failed", description: e.message });
    } finally {
        setIsProcessingReversal(null);
    }
  };

  const handleRejectReversal = async (record: FinancialRecord) => {
    if (!firestore || isProcessingReversal) return;
    setIsProcessingReversal(record.id);
    try {
        await updateDoc(doc(firestore, 'financialRecords', record.id), { status: 'Rejected Reversal' });
        toast({ title: "Reversal Rejected", description: "The bill remains active on the student's ledger." });
        forceRefetch();
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Rejection Failed", description: e.message });
    } finally {
        setIsProcessingReversal(null);
    }
  };

  if (!canAccess && !isLoading) {
    return (
        <div className="p-6">
            <Card className="border-red-100 bg-red-50/50">
                <CardHeader className="text-center">
                    <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                        <ShieldAlert className="h-8 w-8 text-red-600" />
                    </div>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>The Director has restricted financial access for Administrators.</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-6">
        {/* PREMIUM gradient hero banner */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute left-1/3 bottom-0 translate-y-1/2 w-60 h-60 bg-teal-500/20 rounded-full blur-xl pointer-events-none" />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <Sparkles className="h-5 w-5 text-emerald-300 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Financial Model</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Student Accounts & Billing</h1>
                    <p className="text-emerald-100 text-sm mt-1 max-w-xl">
                        Manage student ledgers, record fees, apply waivers, process daily attendance charges, and execute batch termly invoices.
                    </p>
                </div>
                {/* High Level Quick KPI Badge */}
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-md">
                    <div className="p-3 bg-emerald-500/30 rounded-lg text-emerald-100">
                        <Wallet className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] text-emerald-200 font-bold uppercase tracking-wide">Overall Collection Rate</p>
                        <p className="text-2xl font-extrabold tracking-tight text-white mt-0.5">
                            {((dashboardStats.totalRevenue / (dashboardStats.totalRevenue + dashboardStats.totalOutstanding + 0.0001)) * 100).toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-slate-100/80 p-1 rounded-xl mb-4 border border-slate-200/50">
                <TabsTrigger value="billing" className="rounded-lg font-semibold px-4">Student Billing</TabsTrigger>
                <TabsTrigger value="approval" className="rounded-lg font-semibold px-4">
                    Reversal Requests 
                    <Badge className="ml-2 bg-red-500 text-white border-0 hover:bg-red-600">{pendingReversals.length}</Badge>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="billing" className="space-y-6">
                
                {/* Advanced Analytics Tabs */}
                <div className="bg-white border rounded-2xl p-4 shadow-sm">
                    <Tabs value={analyticsTab} onValueChange={setAnalyticsTab} className="w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-3 mb-4">
                            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Collections Advisory Desk</h3>
                            <TabsList className="bg-slate-100 p-0.5 rounded-lg border">
                                <TabsTrigger value="summary" className="text-xs px-3 py-1 rounded-md">Financial Summary</TabsTrigger>
                                <TabsTrigger value="aging" className="text-xs px-3 py-1 rounded-md">Debt Aging</TabsTrigger>
                                <TabsTrigger value="classPace" className="text-xs px-3 py-1 rounded-md">Class Pace</TabsTrigger>
                            </TabsList>
                        </div>
                        
                        <TabsContent value="summary" className="mt-0">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                                <Card className="border-l-4 border-l-rose-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                                  <CardHeader className="p-4 pb-1 flex flex-row justify-between items-center space-y-0">
                                    <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase">Total Outstanding</CardTitle>
                                    <Wallet className="h-4 w-4 text-rose-500" />
                                  </CardHeader>
                                  <CardContent className="p-4 pt-1">
                                    <div className="text-xl font-extrabold text-rose-600">GH₵{dashboardStats.totalOutstanding.toFixed(2)}</div>
                                  </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-emerald-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                                  <CardHeader className="p-4 pb-1 flex flex-row justify-between items-center space-y-0">
                                    <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase">Total Revenue</CardTitle>
                                    <DollarSign className="h-4 w-4 text-emerald-500" />
                                  </CardHeader>
                                  <CardContent className="p-4 pt-1">
                                    <div className="text-xl font-extrabold text-emerald-600">GH₵{dashboardStats.totalRevenue.toFixed(2)}</div>
                                  </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                                  <CardHeader className="p-4 pb-1 flex flex-row justify-between items-center space-y-0">
                                    <CardTitle className="text-[10px] font-medium text-muted-foreground">Tuition Debt</CardTitle>
                                    <BookOpen className="h-4 w-4 text-blue-500" />
                                  </CardHeader>
                                  <CardContent className="p-4 pt-1">
                                    <div className="text-lg font-bold text-slate-800">GH₵{dashboardStats.outstandingTuition.toFixed(2)}</div>
                                  </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-orange-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                                  <CardHeader className="p-4 pb-1 flex flex-row justify-between items-center space-y-0">
                                    <CardTitle className="text-[10px] font-medium text-muted-foreground">Canteen Debt</CardTitle>
                                    <Utensils className="h-4 w-4 text-orange-500" />
                                  </CardHeader>
                                  <CardContent className="p-4 pt-1">
                                    <div className="text-lg font-bold text-slate-800">GH₵{dashboardStats.outstandingCanteen.toFixed(2)}</div>
                                  </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-amber-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                                  <CardHeader className="p-4 pb-1 flex flex-row justify-between items-center space-y-0">
                                    <CardTitle className="text-[10px] font-medium text-muted-foreground">Transport Debt</CardTitle>
                                    <BusIcon className="h-4 w-4 text-amber-500" />
                                  </CardHeader>
                                  <CardContent className="p-4 pt-1">
                                    <div className="text-lg font-bold text-slate-800">GH₵{dashboardStats.outstandingTransport.toFixed(2)}</div>
                                  </CardContent>
                                </Card>
                                <Card className="border-l-4 border-l-slate-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                                  <CardHeader className="p-4 pb-1 flex flex-row justify-between items-center space-y-0">
                                    <CardTitle className="text-[10px] font-medium text-muted-foreground">Other Fees</CardTitle>
                                    <HandCoins className="h-4 w-4 text-slate-400" />
                                  </CardHeader>
                                  <CardContent className="p-4 pt-1">
                                    <div className="text-lg font-bold text-slate-800">GH₵{dashboardStats.otherDebt.toFixed(2)}</div>
                                  </CardContent>
                                </Card>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="aging" className="mt-0">
                            <div className="space-y-4">
                                <div className="h-5 flex rounded-lg overflow-hidden bg-slate-100 border shadow-inner">
                                    {debtAgingStats.total > 0 ? (
                                        <>
                                            {debtAgingStats.current > 0 && (
                                                <div 
                                                    style={{ width: `${(debtAgingStats.current / debtAgingStats.total) * 100}%` }} 
                                                    className="bg-emerald-500 transition-all duration-500 hover:opacity-90"
                                                    title={`Current: GH₵ ${debtAgingStats.current.toFixed(2)}`}
                                                />
                                            )}
                                            {debtAgingStats.age30 > 0 && (
                                                <div 
                                                    style={{ width: `${(debtAgingStats.age30 / debtAgingStats.total) * 100}%` }} 
                                                    className="bg-amber-400 transition-all duration-500 hover:opacity-90"
                                                    title={`1-30 Days Overdue: GH₵ ${debtAgingStats.age30.toFixed(2)}`}
                                                />
                                            )}
                                            {debtAgingStats.age60 > 0 && (
                                                <div 
                                                    style={{ width: `${(debtAgingStats.age60 / debtAgingStats.total) * 100}%` }} 
                                                    className="bg-orange-500 transition-all duration-500 hover:opacity-90"
                                                    title={`31-60 Days Overdue: GH₵ ${debtAgingStats.age60.toFixed(2)}`}
                                                />
                                            )}
                                            {debtAgingStats.age90 > 0 && (
                                                <div 
                                                    style={{ width: `${(debtAgingStats.age90 / debtAgingStats.total) * 100}%` }} 
                                                    className="bg-rose-600 transition-all duration-500 hover:opacity-90"
                                                    title={`61+ Days Overdue: GH₵ ${debtAgingStats.age90.toFixed(2)}`}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full bg-slate-100 flex items-center justify-center text-xs text-muted-foreground italic">No Outstanding Debt</div>
                                    )}
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card className="p-3 border-l-4 border-l-emerald-500 bg-emerald-50/10 bg-slate-50/20">
                                        <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Current (Not Overdue)</p>
                                        <p className="text-lg font-bold text-slate-800 mt-1">GH₵{debtAgingStats.current.toFixed(2)}</p>
                                        <p className="text-[10px] text-muted-foreground">{debtAgingStats.total > 0 ? ((debtAgingStats.current / debtAgingStats.total) * 100).toFixed(1) : 0}% of debt</p>
                                    </Card>
                                    <Card className="p-3 border-l-4 border-l-amber-400 bg-amber-50/10 bg-slate-50/20">
                                        <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3 text-amber-500" /> 1 - 30 Days Overdue</p>
                                        <p className="text-lg font-bold text-amber-700 mt-1">GH₵{debtAgingStats.age30.toFixed(2)}</p>
                                        <p className="text-[10px] text-muted-foreground">{debtAgingStats.total > 0 ? ((debtAgingStats.age30 / debtAgingStats.total) * 100).toFixed(1) : 0}% of debt</p>
                                    </Card>
                                    <Card className="p-3 border-l-4 border-l-orange-500 bg-orange-50/10 bg-slate-50/20">
                                        <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3 text-orange-500" /> 31 - 60 Days Overdue</p>
                                        <p className="text-lg font-bold text-orange-700 mt-1">GH₵{debtAgingStats.age60.toFixed(2)}</p>
                                        <p className="text-[10px] text-muted-foreground">{debtAgingStats.total > 0 ? ((debtAgingStats.age60 / debtAgingStats.total) * 100).toFixed(1) : 0}% of debt</p>
                                    </Card>
                                    <Card className="p-3 border-l-4 border-l-rose-600 bg-rose-50/10 bg-slate-50/20">
                                        <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><AlertCircle className="h-3 w-3 text-rose-600" /> 61+ Days Overdue</p>
                                        <p className="text-lg font-bold text-rose-700 mt-1">GH₵{debtAgingStats.age90.toFixed(2)}</p>
                                        <p className="text-[10px] text-muted-foreground">{debtAgingStats.total > 0 ? ((debtAgingStats.age90 / debtAgingStats.total) * 100).toFixed(1) : 0}% of debt</p>
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="classPace" className="mt-0">
                            {classCollectionsStats.length === 0 ? (
                                <p className="text-center py-10 text-muted-foreground italic text-xs">No class data found.</p>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {classCollectionsStats.map(stat => {
                                        const progressBarColor = stat.rate >= 80 ? 'bg-emerald-500' : stat.rate >= 50 ? 'bg-amber-500' : 'bg-rose-500';
                                        const badgeColor = stat.rate >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : stat.rate >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200';
                                        
                                        return (
                                            <Card key={stat.classId} className="p-4 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all duration-300 bg-slate-50/20">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-slate-800 text-sm">{stat.className}</h4>
                                                            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.studentCount} Students</p>
                                                        </div>
                                                        <Badge variant="outline" className={cn("font-bold text-xs px-2 py-0.5", badgeColor)}>
                                                            {stat.rate.toFixed(1)}%
                                                        </Badge>
                                                    </div>
                                                    <div className="space-y-1.5 mt-3">
                                                        <div className="flex justify-between text-xs font-mono text-slate-600">
                                                            <span>Billed:</span>
                                                            <span>GH₵{(stat.totalBilled - stat.totalWaivers).toFixed(0)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs font-mono text-emerald-600">
                                                            <span>Collected:</span>
                                                            <span>GH₵{stat.totalPaid.toFixed(0)}</span>
                                                        </div>
                                                        <div className="flex justify-between text-xs font-mono text-rose-600">
                                                            <span>Owed:</span>
                                                            <span>GH₵{stat.outstanding.toFixed(0)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-2 border-t">
                                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                        <div 
                                                            className={cn("h-full transition-all duration-500", progressBarColor)}
                                                            style={{ width: `${Math.min(stat.rate, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
                
                <Card className="border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden">
                    <CardHeader className="bg-slate-50/50 border-b pb-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-800">Student Accounts & Invoices</CardTitle>
                                <CardDescription>Search for students to view ledgers, record custom bills, or register payments.</CardDescription>
                            </div>
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
                    <CardContent className="p-6 space-y-6">
                        {activeForm === 'single' && schoolId && (
                            <div className="bg-slate-50 p-4 rounded-lg border mb-4 animate-in slide-in-from-top-2">
                                <h3 className="font-bold mb-4 text-blue-900">Create Single Bill</h3>
                                <FinancialRecordForm setOpen={() => setActiveForm(null)} students={students || []} schoolId={schoolId} onRecordAdded={forceRefetch} />
                            </div>
                        )}
                        
                        {activeForm === 'bulk' && schoolId && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4 animate-in slide-in-from-top-2">
                                <h3 className="font-bold mb-4 text-blue-900">{"Bulk Class Billing (Tuition/Levies)"}</h3>
                                <BulkBillingForm setOpen={() => setActiveForm(null)} classes={classes || []} students={students || []} schoolId={schoolId} onRecordsAdded={forceRefetch} />
                            </div>
                        )}

                        {activeForm === 'termly-transport' && schoolId && (
                            <div className="bg-amber-50/60 p-4 rounded-lg border border-amber-200 mb-4 animate-in slide-in-from-top-2">
                                <h3 className="font-bold mb-4 text-amber-900 flex items-center gap-2">
                                    <BusIcon className="h-5 w-5 text-amber-600" /> Batch Bill Termly Transport Fee
                                </h3>
                                <TermlyTransportForm setOpen={() => setActiveForm(null)} classes={classes || []} students={students || []} schoolId={schoolId} onRecordsAdded={forceRefetch} />
                            </div>
                        )}

                        {activeForm === 'termly-canteen' && schoolId && (
                            <div className="bg-green-50/60 p-4 rounded-lg border border-green-200 mb-4 animate-in slide-in-from-top-2">
                                <h3 className="font-bold mb-4 text-green-900 flex items-center gap-2">
                                    <Utensils className="h-5 w-5 text-green-600" /> Batch Bill Termly Canteen Fee
                                </h3>
                                <TermlyCanteenForm setOpen={() => setActiveForm(null)} classes={classes || []} students={students || []} schoolId={schoolId} onRecordsAdded={forceRefetch} />
                            </div>
                        )}

                        {activeForm === 'levy' && schoolId && (
                            <DailyChargeForm 
                                setOpen={() => setActiveForm(null)} 
                                classes={classes || []} 
                                students={students || []} 
                                schoolId={schoolId} 
                                onRecordsAdded={forceRefetch} 
                            />
                        )}
                        
                        <div className="flex items-center gap-2 relative max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <StudentSearchInput value={searchTerm} onChange={setSearchTerm} className="pl-8" placeholder="Search student by name or ID..." />
                        </div>
                        
                        {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div> : (
                            <div className="space-y-2">
                                {filteredStudentsWithBills.length === 0 ? (
                                    <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">No students found.</div>
                                ) : (
                                    <Accordion type="single" collapsible className="w-full">
                                        {filteredStudentsWithBills.map(({ student, balance, records }) => (
                                            <AccordionItem value={student.uid} key={student.uid} className="border rounded-lg mb-2 px-4 bg-white hover:border-slate-300 transition-colors">
                                                <AccordionTrigger className="hover:no-underline py-4">
                                                    <div className='flex justify-between items-center w-full pr-4'>
                                                        <StudentDisplay student={student} variant="full" showAvatar />
                                                        <div className="text-right">
                                                            <p className="text-[10px] uppercase font-bold text-muted-foreground">Balance</p>
                                                            <p className={cn("font-bold text-lg", balance > 0.01 ? "text-red-600" : "text-green-600")}>
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
            <TabsContent value="approval" className="space-y-6">
                 <Card>
                    <CardHeader>
                        <CardTitle>Transaction Reversal Approvals</CardTitle>
                        <CardDescription>Review requests to reverse or cancel recorded student bills.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingReversals.map(r => (
                                    <TableRow key={r.id}>
                                        <TableCell className="font-bold">{r.studentName}</TableCell>
                                        <TableCell className="text-sm">{r.description}</TableCell>
                                        <TableCell className="font-mono">GH₵{r.billedAmount.toFixed(2)}</TableCell>
                                        <TableCell className="max-w-xs italic text-xs">{(r as any).reversalReason}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="text-red-600" 
                                                    disabled={isProcessingReversal === r.id}
                                                    onClick={() => handleRejectReversal(r)}
                                                >
                                                    {isProcessingReversal === r.id ? <Loader2 className="h-4 w-4 animate-spin"/> : "Reject"}
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    className="bg-red-600 hover:bg-red-700"
                                                    disabled={isProcessingReversal === r.id}
                                                    onClick={() => handleApproveReversal(r)}
                                                >
                                                    {isProcessingReversal === r.id ? <Loader2 className="h-4 w-4 animate-spin"/> : "Confirm Delete"}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {pendingReversals.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">No pending reversal requests.</TableCell></TableRow>}
                            </TableBody>
                         </Table>
                    </CardContent>
                 </Card>
            </TabsContent>
        </Tabs>

        {dialogState.record && dialogState.type === 'payment' && (
            <RecordPaymentDialog record={dialogState.record} open={true} setOpen={() => setDialogState({type:'payment', record: null})} onUpdate={forceRefetch} />
        )}
        {dialogState.record && dialogState.type === 'waiver' && (
            <ApplyWaiverDialog record={dialogState.record} open={true} setOpen={() => setDialogState({type:'waiver', record: null})} onUpdate={forceRefetch} />
        )}
        {dialogState.record && dialogState.type === 'reversal' && (
            <ReversalRequestDialog record={dialogState.record} open={true} setOpen={() => setDialogState({type:'reversal', record: null})} onUpdate={forceRefetch} />
        )}
        {editingRecord && (
            <EditRecordDialog record={editingRecord} open={true} setOpen={() => setEditingRecord(null)} onUpdate={forceRefetch} />
        )}
    </div>
  );
}
