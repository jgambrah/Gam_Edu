'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, doc, writeBatch, serverTimestamp, updateDoc, setDoc, where, getDocs, getDoc, increment, orderBy, deleteField, addDoc, Timestamp, deleteDoc, runTransaction } from 'firebase/firestore';
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
import { Loader2, PlusCircle, FileCog, Edit, Utensils, Bus as BusIcon, DollarSign, HandCoins, Receipt, AlertCircle, Wallet, CalendarIcon, RefreshCw, ChevronsUpDown, Check, XCircle, CheckCircle2, MoreVertical, Search, Sparkles, Route as RouteIcon, ChevronDown, ShieldAlert, Trash2, Globe, Send, Clock, TrendingUp, Layers, BookOpen, ArrowUpRight, AlertTriangle, X, Printer, Info, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
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
import { searchStudent, generateNextReceiptId, sendPaymentNotificationToParent } from '@/lib/student-utils';
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
    const { role, profile } = useRole();
    const { user } = useUser();
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
            if (role === 'Director') {
                const recordRef = doc(firestore, 'financialRecords', record.id);
                const newWaiverAmount = (record.waiverAmount || 0) + values.amount;
                const isFullySettled = (record.billedAmount - (record.amountPaid || 0) - newWaiverAmount) <= 0.01;
                
                await updateDoc(recordRef, {
                    waiverAmount: newWaiverAmount,
                    waiverReason: values.reason,
                    status: isFullySettled ? 'Paid' : record.status
                });
                
                toast({ title: 'Waiver Applied Directly', description: `GH₵${values.amount.toFixed(2)} waived.` });
            } else {
                await addDoc(collection(firestore, 'waiverRequests'), {
                    studentId: record.studentId,
                    studentName: record.studentName || 'Student',
                    recordId: record.id,
                    recordDescription: record.description || 'Fees Charge',
                    billedAmount: record.billedAmount,
                    amountPaid: record.amountPaid || 0,
                    currentWaiverAmount: record.waiverAmount || 0,
                    requestedAmount: values.amount,
                    reason: values.reason,
                    status: 'Pending',
                    requestedBy: user?.uid || '',
                    requestedByName: profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : 'Accountant',
                    schoolId: record.schoolId || '',
                    createdAt: serverTimestamp()
                });
                
                toast({ 
                    title: 'Waiver Requested', 
                    description: `Request for GH₵${values.amount.toFixed(2)} waiver has been submitted for Director approval.` 
                });
            }
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
// --- SUB-COMPONENT: Reversal Request Dialog ---
function ReversalRequestDialog({ record, activeTill, open, setOpen, onUpdate }: { record: FinancialRecord, activeTill: any, open: boolean, setOpen: (open: boolean) => void, onUpdate: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const { user } = useUser();
    const { schoolId } = useCurrentSchool();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reason, setReason] = useState('');
    const [payments, setPayments] = useState<PaymentTransaction[]>([]);
    const [loadingPayments, setLoadingPayments] = useState(true);

    useEffect(() => {
        async function fetchPayments() {
            if (!firestore || !record.id || !open) return;
            setLoadingPayments(true);
            try {
                const querySnap = await getDocs(collection(firestore, 'financialRecords', record.id, 'payments'));
                const list = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentTransaction));
                setPayments(list);
            } catch (e) {
                console.error("Failed to fetch payments for reversal check:", e);
            } finally {
                setLoadingPayments(false);
            }
        }
        fetchPayments();
    }, [firestore, record.id, open]);

    const isEligibleForImmediate = useMemo(() => {
        if (!activeTill || activeTill.status !== 'Open') return false;
        if (loadingPayments) return false;
        
        const openTime = activeTill.dateOpened?.toMillis ? activeTill.dateOpened.toMillis() : activeTill.dateOpened?.seconds ? activeTill.dateOpened.seconds * 1000 : 0;
        if (!openTime) return false;

        // If there are payments, check if all were logged under the current active till
        return payments.every(p => {
            if (p.tillId && p.tillId === activeTill.id) return true;
            
            // Fallback: Check if payment was paid during the active till session (paidAt >= dateOpened)
            const payTime = p.paidAt?.toMillis ? p.paidAt.toMillis() : p.paidAt?.seconds ? p.paidAt.seconds * 1000 : 0;
            return payTime >= openTime;
        });
    }, [payments, activeTill, loadingPayments]);

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

    async function handleImmediateReversal() {
        if (!firestore || !record.id || isSubmitting) return;
        setIsSubmitting(true);
        try {
            const batch = writeBatch(firestore);
            
            // 1. Mark payments as Reversed and write Reversal Payment Transactions
            for (const payment of payments) {
                const paymentRef = doc(firestore, 'financialRecords', record.id, 'payments', payment.id);
                batch.update(paymentRef, {
                    status: 'Reversed',
                    reversedAt: serverTimestamp(),
                    reversedBy: user?.displayName || user?.email || 'System'
                });

                // Write the reversal payment transaction
                const revId = `${payment.id}-REV`;
                const revPaymentRef = doc(firestore, 'financialRecords', record.id, 'payments', revId);
                batch.set(revPaymentRef, {
                    id: revId,
                    amount: -payment.amount,
                    method: payment.method,
                    notes: `Immediate Reversal of Receipt #${payment.id}`,
                    paidAt: serverTimestamp(),
                    processedById: user?.uid || 'system',
                    processedByName: user?.displayName || user?.email || 'System',
                    studentId: record.studentId,
                    description: `Reversal of Receipt #${payment.id}`,
                    schoolId: schoolId || record.schoolId || '',
                    tillId: activeTill ? activeTill.id : '',
                    status: 'Completed',
                    isReversal: true,
                    reversedReceiptId: payment.id
                });
                
                // 2. If Cash and activeTill, write negative reversal transaction and adjust drawer cash balance
                if (payment.method === 'Cash' && activeTill) {
                    const tillTransRef = doc(collection(firestore, `tills/${activeTill.id}/transactions`));
                    batch.set(tillTransRef, {
                        amount: -payment.amount,
                        studentName: record.studentName,
                        timestamp: serverTimestamp(),
                        type: 'Reversal',
                        description: `Reversal of Receipt #${payment.id} for ${record.description}`,
                        status: 'Completed',
                        schoolId: record.schoolId || ''
                    });
                    
                    const tillRef = doc(firestore, 'tills', activeTill.id);
                    batch.update(tillRef, {
                        currentBalance: increment(-payment.amount)
                    });
                }
            }
            
            // 3. Reset the parent record charge to unpaid/partially paid instead of deleting it
            const recordRef = doc(firestore, 'financialRecords', record.id);
            const totalReversed = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
            const newAmountPaid = Math.max(0, (record.amountPaid || 0) - totalReversed);
            const totalCredited = newAmountPaid + (record.waiverAmount || 0);
            
            let newStatus: 'Paid' | 'Partially Paid' | 'Unpaid' = 'Unpaid';
            if (totalCredited >= record.billedAmount) {
                newStatus = 'Paid';
            } else if (totalCredited > 0) {
                newStatus = 'Partially Paid';
            }
            
            batch.update(recordRef, {
                amountPaid: newAmountPaid,
                status: newStatus,
                reversalReason: deleteField(),
                reversalRequestedAt: deleteField()
            });

            // 4. Log the reversal to a permanent audit collection
            const logRef = doc(collection(firestore, 'reversalLogs'));
            batch.set(logRef, {
                id: logRef.id,
                recordId: record.id,
                studentId: record.studentId,
                studentName: record.studentName,
                chargeDescription: record.description,
                billedAmount: record.billedAmount,
                amountReversed: totalReversed,
                reason: 'Immediate Reversal',
                approvedBy: 'Cashier (Immediate)',
                timestamp: serverTimestamp(),
                schoolId: record.schoolId || ''
            });
            
            await batch.commit();
            
            toast({ title: 'Reversal Completed', description: 'Payment reversed immediately. The bill has been reset to unpaid/partially paid.' });
            onUpdate();
            setOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: 'Reversal Failed', description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEligibleForImmediate ? "Cancel & Reverse Transaction" : "Request Transaction Reversal"}</DialogTitle>
                    <DialogDescription>
                        {isEligibleForImmediate 
                          ? "This transaction is eligible for immediate cancellation and reversal." 
                          : "This will flag the record for administrative review and possible cancellation."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-2.5 shadow-xs">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="block text-[10px] uppercase font-black text-slate-400 tracking-wider">Student Profile</span>
                                <span className="text-sm font-bold text-slate-800">{record.studentName}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] uppercase font-black text-slate-400 tracking-wider">Charge Item</span>
                                <span className="text-xs font-bold text-slate-650 max-w-[180px] truncate block">{record.description}</span>
                            </div>
                        </div>
                        <div className="border-t border-dashed border-slate-200 my-2 pt-2 grid grid-cols-2 gap-4">
                            <div>
                                <span className="block text-[10px] uppercase font-black text-slate-400 tracking-wider">Total Billed</span>
                                <span className="text-xs font-mono font-bold text-slate-700">GH₵{record.billedAmount.toFixed(2)}</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] uppercase font-black text-slate-400 tracking-wider">To Be Reversed</span>
                                <span className="text-sm font-mono font-black text-red-600">GH₵{(record.amountPaid || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {loadingPayments ? (
                        <div className="flex items-center justify-center py-6 text-xs text-slate-400 font-bold uppercase tracking-wider">
                            <Loader2 className="h-5 w-5 animate-spin mr-2 text-indigo-650" /> Evaluating reversal eligibility...
                        </div>
                    ) : isEligibleForImmediate ? (
                        <>
                            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl space-y-1.5 shadow-sm">
                                <p className="text-xs font-black text-indigo-850 uppercase tracking-wider flex items-center gap-1.5">
                                    <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" /> Immediate Reversal Eligible
                                </p>
                                <p className="text-[11.5px] text-indigo-650 leading-relaxed font-semibold">
                                    All payments associated with this charge were logged during your current open till session. Your till balance will be automatically adjusted.
                                </p>
                            </div>
                            <Button variant="destructive" onClick={handleImmediateReversal} disabled={isSubmitting} className="w-full h-11 text-sm font-black uppercase tracking-wider shadow-sm mt-2">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Execute Immediate Reversal
                            </Button>
                        </>
                    ) : (
                        <>
                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5 shadow-xs">
                                <p className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <Info className="h-4 w-4 text-slate-500" /> Director Approval Required
                                </p>
                                <p className="text-[11.5px] text-slate-600 leading-relaxed font-semibold">
                                    This transaction belongs to a closed/submitted till session, or has past-shift payments. The request must be reviewed and approved by the Director.
                                </p>
                            </div>
                            
                            {/* Diagnostic Debug Block */}
                            <div className="bg-red-50/50 p-3 rounded-xl border border-red-100 text-[10px] font-mono space-y-1 my-2">
                                <p className="font-bold text-red-800">Diagnostics:</p>
                                <p>Till Open: {activeTill?.dateOpened?.toDate ? activeTill.dateOpened.toDate().toLocaleString() : 'N/A'}</p>
                                <p>Till ID: {activeTill?.id || 'None'}</p>
                                <p>Payments found: {payments.length}</p>
                                {payments.map((p, idx) => (
                                    <div key={p.id} className="border-t border-red-100 pt-1 mt-1">
                                        <p>Payment #{idx + 1}: {p.id} - GH₵{p.amount}</p>
                                        <p>Payment Till ID: {p.tillId || 'none'}</p>
                                        <p>Paid At: {p.paidAt?.toDate ? p.paidAt.toDate().toLocaleString() : p.paidAt?.seconds ? new Date(p.paidAt.seconds * 1000).toLocaleString() : 'N/A'}</p>
                                        <p>Eligible: {String((p.tillId && activeTill && p.tillId === activeTill.id) || (p.paidAt && activeTill?.dateOpened && (p.paidAt.toDate ? p.paidAt.toDate().getTime() : p.paidAt.seconds * 1000) >= (activeTill.dateOpened.toDate ? activeTill.dateOpened.toDate().getTime() : activeTill.dateOpened.seconds * 1000)))}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Reason for Reversal</Label>
                                <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Explain why this transaction needs to be reversed..." className="min-h-[100px] text-sm" />
                            </div>
                            <Button variant="destructive" onClick={handleRequest} disabled={isSubmitting || !reason.trim()} className="w-full h-11 text-sm font-black uppercase tracking-wider shadow-sm mt-2">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Submit Reversal Request
                            </Button>
                        </>
                    )}
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

interface SearchableSelectOption {
  id: string;
  name: string;
  subtext?: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Search and select...",
  className = ""
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const selectedOption = options.find(opt => opt.id === value);
  const displayValue = isOpen ? searchQuery : (selectedOption ? selectedOption.name : '');

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (opt.subtext && opt.subtext.toLowerCase().includes(searchQuery.toLowerCase())) ||
    opt.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Input
          type="text"
          placeholder={selectedOption ? selectedOption.name : placeholder}
          value={displayValue}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchQuery('');
          }}
          onBlur={() => {
            // Delay to allow clicking items in dropdown
            setTimeout(() => setIsOpen(false), 250);
          }}
          className="bg-white border-2 pr-10 cursor-pointer text-xs h-9 rounded-xl w-full"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onValueChange('');
                setSearchQuery('');
              }}
              className="hover:text-rose-500 p-0.5"
            >
              <X size={14} />
            </button>
          )}
          <ChevronsUpDown size={14} className="pointer-events-none" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onMouseDown={() => {
                  onValueChange(opt.id);
                  setSearchQuery('');
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex flex-col",
                  value === opt.id 
                    ? 'bg-indigo-50 text-indigo-900 font-bold' 
                    : 'hover:bg-slate-50 text-slate-700'
                )}
              >
                <span>{opt.name}</span>
                {opt.subtext && (
                  <span className="text-[10px] text-slate-400 font-normal mt-0.5">{opt.subtext}</span>
                )}
              </button>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-slate-400 italic">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

function FinancialRecordForm({ setOpen, students, classes, schoolId, onRecordAdded }: { setOpen: (open: boolean) => void; students: Student[], classes: Class[], schoolId: string, onRecordAdded: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const classMap = useMemo(() => {
    const map = new Map<string, string>();
    (classes || []).forEach(c => map.set(c.id, c.name));
    return map;
  }, [classes]);

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
                        <FormLabel>Search & Select Student</FormLabel>
                        <FormControl>
                            <SearchableSelect
                                options={students.map(s => ({
                                    id: s.uid,
                                    name: `${s.firstName} ${s.lastName}`,
                                    subtext: `ID: ${s.studentId || s.uid} | Class: ${classMap.get(s.classId) || 'N/A'}`
                                }))}
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder="Start typing name or ID..."
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
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
                                {classes?.map(c => c && <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
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
                                      ? classes?.map(c => c && <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)
                                      : (routes || []).map(r => r && <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)
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
                                    {classes?.map(c => c && <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
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
    const form = useForm<z.infer<typeof recordPaymentSchema>>({ resolver: zodResolver(recordPaymentSchema), defaultValues: { method: 'Cash', amount: 0, notes: '', customDescription: '' } });
    
    useEffect(() => {
        if (record && open) {
            const newBalance = record.billedAmount - (record.amountPaid || 0) - (record.waiverAmount || 0);
            form.reset({ method: 'Cash', amount: newBalance > 0 ? parseFloat(newBalance.toFixed(2)) : 0, notes: '', customDescription: '' });
        }
    }, [record, open, form]);

    async function onSubmit(values: z.infer<typeof recordPaymentSchema>) {
        if (!firestore || !user || !record.id || !schoolId) return;
        setIsSubmitting(true);
        try {
            // Retrieve open till session for the accountant if one exists
            const tillQuery = query(collection(firestore, 'tills'), where('accountantId', '==', user.uid), where('status', '==', 'Open'), where('schoolId', '==', schoolId));
            const tillSnap = await getDocs(tillQuery);
            const activeTill = !tillSnap.empty ? tillSnap.docs[0] : null;

            if (values.method === 'Cash' && !activeTill) {
                throw new Error("You must have an OPEN TILL to accept cash.");
            }

            const receiptId = await generateNextReceiptId(firestore, schoolId);
            const paymentDocRef = doc(firestore, 'financialRecords', record.id, 'payments', receiptId);
            const paymentDescription = values.customDescription?.trim() || record.description || 'School Fees Payment';
            
            const paymentData = { 
                id: receiptId,
                amount: values.amount, 
                method: values.method, 
                notes: values.notes || '', 
                paidAt: serverTimestamp(), 
                processedById: user.uid, 
                processedByName: user.displayName || user.email, 
                studentId: record.studentId, 
                description: paymentDescription, 
                schoolId: schoolId,
                tillId: activeTill ? activeTill.id : ''
            };
            const recordRef = doc(firestore, 'financialRecords', record.id);
            
            await runTransaction(firestore, async (transaction) => {
                const freshRecordDoc = await transaction.get(recordRef);
                if (!freshRecordDoc.exists) {
                    throw new Error("Financial record not found.");
                }
                const freshData = freshRecordDoc.data();
                const currentAmountPaid = freshData?.amountPaid || 0;
                const newAmountPaid = currentAmountPaid + values.amount;
                const isFullyPaid = (record.billedAmount - newAmountPaid - (record.waiverAmount || 0)) <= 0.001;

                transaction.update(recordRef, { 
                    amountPaid: newAmountPaid, 
                    status: isFullyPaid ? 'Paid' : 'Unpaid', 
                    lastPaymentDate: serverTimestamp(),
                    paymentNarration: paymentDescription
                });
                
                if (values.method === 'Cash' && activeTill) {
                    const tillTransRef = doc(collection(firestore, `tills/${activeTill.id}/transactions`));
                    transaction.set(tillTransRef, { amount: values.amount, studentName: record.studentName, timestamp: serverTimestamp(), type: 'Payment', description: `Cash: ${paymentDescription} (Receipt: ${receiptId})`, status: 'Completed', schoolId: schoolId });
                    transaction.update(doc(firestore, 'tills', activeTill.id), { currentBalance: increment(values.amount) });
                }
                transaction.set(paymentDocRef, paymentData);
            });

            // Send DM payment notification to parent(s) asynchronously
            if (record.studentId) {
                sendPaymentNotificationToParent({
                    firestore,
                    schoolId,
                    studentId: record.studentId,
                    studentName: record.studentName || 'Student',
                    paymentAmount: values.amount,
                    feeType: paymentDescription,
                    receiptId,
                    paymentMethod: values.method,
                    senderUid: user.uid,
                    senderName: user.displayName || user.email || 'Staff',
                    senderRole: 'Accountant'
                }).catch(err => {
                    console.error("Failed to send parent payment notification DM:", err);
                });
            }

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
                        <FormField control={form.control} name="customDescription" render={({ field }) => {
                          return (
                            <FormItem>
                                <FormLabel>Custom Narration (Optional)</FormLabel>
                                <FormControl><Input placeholder={`Default: ${record.description}`} {...field}/></FormControl>
                                <FormDescription className="text-[10px] text-slate-500">
                                    Leave blank to use the standard narration: "{record.description}".
                                </FormDescription>
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
                        notes: 'Legacy record',
                        description: (record as any).paymentNarration || record.description
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

function StudentLedgerDetail({ student, records, globalDateRange, onRecordPayment, onApplyWaiver, onEditRecord, onReverseTransaction }: { student: Student; records: FinancialRecord[]; globalDateRange?: DateRange; onRecordPayment: (record: FinancialRecord) => void; onApplyWaiver: (record: FinancialRecord) => void; onEditRecord: (record: FinancialRecord) => void; onReverseTransaction: (record: FinancialRecord) => void; }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();
    const [isBilling, setIsBilling] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(globalDateRange || { from: startOfMonth(new Date()), to: endOfDay(new Date()) });
    const [openRowId, setOpenRowId] = useState<string | null>(null);

    useEffect(() => {
        if (globalDateRange) {
            setDateRange(globalDateRange);
        }
    }, [globalDateRange]);
    
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
                                      <TableCell>
                                          <span className={cn(
                                              "px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider",
                                              rec.status === 'Paid' ? "bg-emerald-50 text-emerald-700 border-emerald-250" :
                                              rec.status === 'Unpaid' ? "bg-slate-50 text-slate-655 border-slate-200" :
                                              rec.status === 'Overdue' ? "bg-rose-50 text-rose-700 border-rose-200" :
                                              rec.status === 'Pending Reversal' ? "bg-amber-50 text-amber-700 border-amber-200 animate-pulse" :
                                              "bg-slate-100 text-slate-500 border-slate-200"
                                          )}>
                                              {rec.status}
                                          </span>
                                      </TableCell>
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
                                                              <GenerateReceipt transaction={rec} payment={{ id: 'consolidated-' + rec.id, amount: rec.amountPaid, method: 'Total Recorded', paidAt: rec.lastPaymentDate || rec.createdAt, notes: 'Consolidated Receipt for ' + rec.description, description: (rec as any).paymentNarration || rec.description } as any} variant="full" />
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
                                                              const idToken = await user?.getIdToken();
                                                              const result = await sendSchoolSMSAction(schoolId!, phone, msg, idToken);
                                                              
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

// --- SUB-COMPONENT: Print Debtors Dialog ---
interface PrintDebtorsDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  classes: Class[];
  printMode: 'all-classes-split' | 'single-class' | 'whole-school-grouped';
  setPrintMode: (mode: 'all-classes-split' | 'single-class' | 'whole-school-grouped') => void;
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  minDebt: number;
  setMinDebt: (val: number) => void;
  debtorsCount: number;
  classDebtorsCount: number;
  totalSum: number;
  onPrint: () => void;
}

function PrintDebtorsDialog({ 
  open, 
  setOpen, 
  classes, 
  printMode, 
  setPrintMode, 
  selectedClassId, 
  setSelectedClassId, 
  minDebt, 
  setMinDebt,
  debtorsCount,
  classDebtorsCount,
  totalSum,
  onPrint
}: PrintDebtorsDialogProps) {
  useEffect(() => {
    if (classes && classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId, setSelectedClassId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-indigo-650" /> Print Debtors Lists
          </DialogTitle>
          <DialogDescription>
            Configure the printing format. You can print sheet-by-sheet for class teachers or a full school list.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="space-y-2">
            <Label className="font-bold text-xs uppercase text-slate-500">Print Mode Option</Label>
            <Select value={printMode} onValueChange={(v: any) => setPrintMode(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-classes-split">All Classes (Individual sheets - Page breaks)</SelectItem>
                <SelectItem value="single-class">Single Class Only</SelectItem>
                <SelectItem value="whole-school-grouped">Whole School (Grouped by Class)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {printMode === 'single-class' && (
            <div className="space-y-2">
              <Label className="font-bold text-xs uppercase text-slate-500">Select Class</Label>
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class..." />
                </SelectTrigger>
                <SelectContent>
                  {classes?.map(c => c && (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label className="font-bold text-xs uppercase text-slate-500">Minimum Balance Owed (GH₵)</Label>
            <Input
              type="number"
              step="0.01"
              value={minDebt}
              onChange={e => setMinDebt(parseFloat(e.target.value) || 0)}
              placeholder="e.g. 5"
            />
          </div>

          <div className="p-3 bg-slate-50 border rounded-xl text-xs space-y-1.5 text-slate-650">
            <div className="flex justify-between">
              <span>Total school debtors found:</span>
              <span className="font-bold text-slate-800">{debtorsCount} students</span>
            </div>
            {printMode === 'single-class' && (
              <div className="flex justify-between">
                <span>Debtors in selected class:</span>
                <span className="font-bold text-slate-800">
                  {classDebtorsCount} students
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Total outstanding sum:</span>
              <span className="font-bold text-slate-800">
                GH₵{totalSum.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <Button onClick={onPrint} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-11 rounded-xl">
            <Printer className="mr-2 h-4 w-4" /> Open Print Setup / Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}



interface ParentLetterPrintAreaProps {
  parentId: string;
  parents: any[];
  students: Student[];
  classes: Class[];
  records: FinancialRecord[];
  schoolProfile: any;
}

function ParentLetterPrintArea({
  parentId,
  parents,
  students,
  classes,
  records,
  schoolProfile
}: ParentLetterPrintAreaProps) {
  const parent = parents?.find(p => p.id === parentId || p.uid === parentId);
  if (!parent) return null;

  const parentName = parent.name || `${parent.title ? parent.title + ' ' : ''}${parent.firstName || ''} ${parent.lastName || ''}`.trim() || 'Parent / Guardian';
  const schoolName = schoolProfile?.name || schoolProfile?.schoolName || 'GAM Edu School';
  const brandColor = schoolProfile?.brandColor || '#1e293b';

  const classMap = new Map<string, string>();
  classes?.forEach(c => classMap.set(c.id, c.name));

  const parentChildren = students?.filter(s => parent.studentIds?.includes(s.uid)) || [];

  const childrenDebts = parentChildren.map(s => {
    const studentRecords = records?.filter(r => r.studentId === s.uid && r.status !== 'Pending Reversal') || [];
    const totalBilled = studentRecords.reduce((sum, r) => sum + (Number(r.billedAmount) || 0), 0);
    const totalPaid = studentRecords.reduce((sum, r) => sum + (Number(r.amountPaid) || 0) + (Number(r.waiverAmount) || 0), 0);
    const balance = totalBilled - totalPaid;

    const tuitionDebt = studentRecords.filter(r => r.type.toLowerCase().includes('tuition')).reduce((sum, r) => sum + (Number(r.billedAmount) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0)), 0);
    const canteenDebt = studentRecords.filter(r => r.type.toLowerCase().includes('canteen')).reduce((sum, r) => sum + (Number(r.billedAmount) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0)), 0);
    const transportDebt = studentRecords.filter(r => r.type.toLowerCase().includes('transport')).reduce((sum, r) => sum + (Number(r.billedAmount) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0)), 0);
    const otherDebt = balance - tuitionDebt - canteenDebt - transportDebt;

    return {
      student: s,
      balance: Math.max(0, balance),
      breakdown: {
        tuition: Math.max(0, tuitionDebt),
        canteen: Math.max(0, canteenDebt),
        transport: Math.max(0, transportDebt),
        other: Math.max(0, otherDebt)
      }
    };
  }).filter(cd => cd.balance > 0);

  const grandTotal = childrenDebts.reduce((sum, cd) => sum + cd.balance, 0);

  return (
    <div id="parent-letter-print-area" className="hidden print:block text-black bg-white w-full p-4 font-serif leading-normal">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          html, body {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: hidden !important;
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: Georgia, 'Times New Roman', serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }

          ::-webkit-scrollbar {
            display: none !important;
            width: 0 !important;
            height: 0 !important;
          }

          /* Hide all interactive app elements */
          aside, nav, header, footer, button, [role="dialog"], [data-radix-portal], .fixed, .absolute, .fixed.inset-0 {
            display: none !important;
            height: 0 !important;
            width: 0 !important;
            visibility: hidden !important;
          }

          /* Reset layouts for natural A4 flow */
          div.flex.h-screen,
          div.flex.flex-1.flex-col,
          main,
          div.p-4.md\:p-8,
          div.pb-24,
          div.space-y-6.accounts-page-container {
            display: block !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: hidden !important;
            position: static !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
          }

          div.space-y-6.accounts-page-container > *:not(#parent-letter-print-area) {
            display: none !important;
          }

          #parent-letter-print-area {
            display: block !important;
            visibility: visible !important;
            position: static !important;
            width: 100% !important;
            height: auto !important;
            overflow: hidden !important;
            background: white !important;
            color: black !important;
            padding: 0.3in !important;
            margin: 0 !important;
            font-size: 12pt !important;
          }

          #parent-letter-print-area .print-banner-table {
            background-color: white !important;
            color: #0f172a !important;
            border-bottom: 3px solid ${brandColor} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          #parent-letter-print-area .print-banner-table td {
            color: #0f172a !important;
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          #parent-letter-print-area .print-banner-table h1 {
            color: ${brandColor} !important;
          }
          
          #parent-letter-print-area .print-banner-table p,
          #parent-letter-print-area .print-banner-table span {
            color: #475569 !important;
          }

          .letterhead-divider {
            border-top: 3px double ${brandColor} !important;
            margin-top: 8px !important;
            margin-bottom: 12px !important;
          }

          table.letter-table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-top: 10px !important;
            margin-bottom: 10px !important;
          }

          table.letter-table th, table.letter-table td {
            font-size: 12px !important;
            padding: 6px 8px !important;
            border: 1px solid #94a3b8 !important;
            text-align: left !important;
          }

          table.letter-table th {
            background-color: ${brandColor} !important;
            color: white !important;
            font-weight: bold !important;
            border-bottom: 2px solid ${brandColor} !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          table.letter-table td.amount {
            text-align: right !important;
            font-family: Courier, monospace !important;
            font-weight: 700;
          }

          .summary-box {
            border: 2.5px solid ${brandColor} !important;
            background-color: #f8fafc !important;
            padding: 10px 15px !important;
            margin-top: 12px !important;
            margin-bottom: 12px !important;
            border-radius: 6px !important;
            page-break-inside: avoid !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .recipient-box {
            border: 1px solid #e2e8f0 !important;
            background-color: #fafafa !important;
            padding: 10px !important;
            border-radius: 6px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .metadata-table {
            width: 100% !important;
            max-width: 100% !important;
            table-layout: fixed !important;
            border-collapse: collapse !important;
            border: none !important;
            margin-bottom: 12px !important;
          }

          .metadata-left-cell {
            width: 55% !important;
            vertical-align: top !important;
            border: none !important;
            padding: 0 !important;
            text-align: left !important;
          }

          .metadata-right-cell {
            width: 45% !important;
            vertical-align: top !important;
            border: none !important;
            padding: 0 !important;
            text-align: right !important;
          }

          .metadata-right-cell div {
            text-align: right !important;
            width: 100% !important;
            display: block !important;
          }

          .metadata-right-cell p {
            text-align: right !important;
            margin: 0 0 2px auto !important;
            display: block !important;
          }

          .metadata-right-cell .badge-container {
            text-align: right !important;
            display: block !important;
            width: 100% !important;
            margin-top: 4px !important;
          }

          .metadata-right-cell .badge {
            display: inline-block !important;
            float: right !important;
          }

          @page {
            size: A4 portrait;
            margin: 0.4in !important;
          }
        }
      `}} />

      {/* 1. Official School Letterhead Banner (Table-based for maximum print safety) */}
      <table className="print-banner-table" style={{
        width: '100%',
        backgroundColor: 'white',
        color: '#0f172a',
        borderBottom: `3px solid ${brandColor}`,
        borderRadius: '0px',
        marginBottom: '18px',
        borderCollapse: 'collapse',
        border: 'none',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact'
      }}>
        <tbody>
          <tr>
            <td style={{
              padding: '12px 0',
              width: '70px',
              verticalAlign: 'middle',
              border: 'none',
              backgroundColor: 'white'
            }}>
              {schoolProfile?.logoUrl ? (
                <div style={{
                  backgroundColor: 'white',
                  padding: '4px',
                  borderRadius: '8px',
                  display: 'inline-block',
                  width: '56px',
                  height: '56px',
                  textAlign: 'center',
                  boxSizing: 'border-box',
                  border: '1px solid #e2e8f0'
                }}>
                  <img src={schoolProfile.logoUrl} alt="Logo" style={{ height: '46px', width: '46px', objectFit: 'contain', verticalAlign: 'middle' }} />
                </div>
              ) : (
                <div style={{
                  backgroundColor: '#f1f5f9',
                  borderRadius: '8px',
                  display: 'inline-block',
                  width: '56px',
                  height: '56px',
                  lineHeight: '56px',
                  textAlign: 'center',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  color: brandColor,
                  border: `1px solid ${brandColor}`
                }}>
                  GAM Edu
                </div>
              )}
            </td>
            <td style={{
              padding: '12px 16px',
              verticalAlign: 'middle',
              textAlign: 'left',
              border: 'none',
              backgroundColor: 'white'
            }}>
              <h1 style={{ fontSize: '20px', fontWeight: '900', margin: '0', textTransform: 'uppercase', color: brandColor, lineHeight: '1.1' }}>
                {schoolName}
              </h1>
              {schoolProfile?.motto && (
                <p style={{ fontSize: '11px', fontStyle: 'italic', margin: '3px 0 0 0', color: '#475569', lineHeight: '1.2' }}>"{schoolProfile.motto}"</p>
              )}
              <p style={{ fontSize: '10px', margin: '3px 0 0 0', color: '#475569', lineHeight: '1.2' }}>
                {schoolProfile?.address || 'School Location Address'}
              </p>
              <p style={{ fontSize: '9px', margin: '2px 0 0 0', color: '#64748b', lineHeight: '1.2' }}>
                {schoolProfile?.phone && `Tel: ${schoolProfile.phone}`}
                {schoolProfile?.phone && schoolProfile?.email && ` | `}
                {schoolProfile?.email && `Email: ${schoolProfile.email}`}
              </p>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 2. Letter Metadata layout (Float-based for absolute alignment safety) */}
      <div style={{ width: '100%', marginBottom: '12px', clear: 'both', display: 'block', overflow: 'hidden' }}>
        <div style={{ float: 'left', width: '50%', textAlign: 'left' }}>
          <div className="recipient-box" style={{ marginRight: '10px', textAlign: 'left' }}>
            <p className="font-bold text-slate-500 uppercase tracking-wider text-[11px] mb-0.5" style={{ margin: '0', textAlign: 'left' }}>To Parent / Guardian:</p>
            <p className="text-sm font-bold text-slate-900" style={{ margin: '2px 0 0 0', textAlign: 'left' }}>{parentName}</p>
            {parent.phone && <p className="mt-0.5 text-[12px] font-medium text-slate-600" style={{ margin: '2px 0 0 0', textAlign: 'left' }}>Phone: {parent.phone}</p>}
            {parent.email && <p className="text-[12px] font-medium text-slate-600" style={{ margin: '2px 0 0 0', textAlign: 'left' }}>Email: {parent.email}</p>}
          </div>
        </div>
        <div style={{ float: 'right', width: '45%', textAlign: 'right' }}>
          <div style={{ textAlign: 'right', float: 'right', width: '100%' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', margin: '0', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>OFFICIAL NOTICE</p>
            <p style={{ fontSize: '10px', color: '#64748b', fontFamily: 'monospace', margin: '2px 0 4px 0', textAlign: 'right' }}>REF: GAM-EDU/{format(new Date(), 'yyyy')}/DEBT-{parentId.slice(-6).toUpperCase()}</p>
            <p style={{ fontSize: '12px', fontWeight: '500', margin: '0 0 4px 0', textAlign: 'right' }}><span style={{ fontWeight: 'bold' }}>DATE:</span> {format(new Date(), 'MMMM dd, yyyy')}</p>
            <div style={{ width: '100%', textAlign: 'right', marginTop: '4px', clear: 'both', display: 'block' }}>
              <span className="inline-flex rounded bg-rose-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-rose-700 border border-rose-200" style={{ display: 'inline-block', float: 'right' }}>
                Payment Demand
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Subject */}
      <div className="border-b border-slate-900 pb-0.5 mb-3">
        <h2 className="text-[12px] font-black uppercase tracking-wide text-slate-850">
          SUBJECT: NOTICE OF OUTSTANDING SCHOOL FEES ARREARS
        </h2>
      </div>

      {/* 4. Body Content */}
      <div className="space-y-3.5 text-[12pt] font-serif text-slate-800 leading-relaxed">
        <p>Dear {parentName},</p>
        
        <p>
          We request your prompt attention to outstanding fee balances on your child(ren)'s institutional ledger accounts. Below is the itemized breakdown of dues owed to **{schoolName}**:
        </p>

        {/* 5. Horizontal Wards Table */}
        <table className="letter-table">
          <thead>
            <tr>
              <th>Student (Ward) Name</th>
              <th>Class</th>
              <th className="text-right">Tuition</th>
              <th className="text-right">Canteen</th>
              <th className="text-right">Transport</th>
              <th className="text-right">Other Dues</th>
              <th className="text-right">Total Owed</th>
            </tr>
          </thead>
          <tbody>
            {childrenDebts.map((cd: any) => {
              let tuition = Math.max(0, cd.breakdown.tuition);
              let canteen = Math.max(0, cd.breakdown.canteen);
              let transport = Math.max(0, cd.breakdown.transport);
              const sumCategories = tuition + canteen + transport;
              let other = 0;

              if (sumCategories < cd.balance) {
                other = cd.balance - sumCategories;
              } else if (sumCategories > cd.balance) {
                const ratio = cd.balance / (sumCategories || 1);
                tuition = tuition * ratio;
                canteen = canteen * ratio;
                transport = transport * ratio;
                other = 0;
              }

              return (
                <tr key={cd.student.uid}>
                  <td className="font-bold text-slate-900">{cd.student.firstName} {cd.student.lastName}</td>
                  <td className="text-slate-600">{classMap.get(cd.student.classId) || 'N/A'}</td>
                  <td className="amount">GH₵{tuition.toFixed(2)}</td>
                  <td className="amount">GH₵{canteen.toFixed(2)}</td>
                  <td className="amount">GH₵{transport.toFixed(2)}</td>
                  <td className="amount">GH₵{other.toFixed(2)}</td>
                  <td className="amount font-bold text-rose-600">GH₵{cd.balance.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 6. Grand Summary Box */}
        <div className="summary-box">
          <table style={{ width: '100%', borderCollapse: 'collapse', border: 'none' }}>
            <tbody>
              <tr>
                <td style={{ border: 'none', padding: '0' }}>
                  <p className="text-[11px] uppercase font-black tracking-wider" style={{ color: brandColor }}>Total Consolidated Arrears Owed</p>
                  <p className="text-[10px] text-slate-500 italic mt-0.5">Aggregated family balance due immediately</p>
                </td>
                <td style={{ border: 'none', padding: '0', textAlign: 'right' }}>
                  <p className="text-xl font-black text-rose-600 font-mono">
                    GH₵{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 7. Polite request & payment instructions */}
        <p>
          Kindly arrange to clear these overdue arrears immediately. Your prompt support is crucial in helping the school run smoothly and maintain operational standards.
        </p>

        <div className="border-t pt-2 mt-2 page-break-inside-avoid">
          <p className="font-bold text-[11px] uppercase text-slate-700 mb-0.5">
            APPROVED PAYMENT OPTIONS:
          </p>
          <p className="text-[12px] text-slate-600">
            • <strong>Portal:</strong> Pay instantly via Mobile Money (MoMo) or Card. 
            • <strong>Bank Transfer:</strong> Pay to school's bank account & submit slip. 
            • <strong>POS/Cash:</strong> Walk in to pay at the finance office desk.
          </p>
        </div>

        <p className="italic text-[11px] text-slate-400">
          *Note: If you have made payments recently, please present the receipts at our accounts desk for immediate reconciliation. If you have any questions or require a payment plan, please contact the Principal or Accounts Officer.
        </p>

        {/* 8. Sign-off and headmaster signature */}
        <div className="pt-3 page-break-inside-avoid">
          <p>Sincerely,</p>
          <div style={{ marginTop: '8px' }}>
            {schoolProfile?.headmasterSignatureUrl ? (
              <img src={schoolProfile.headmasterSignatureUrl} alt="Headmaster Signature" style={{ height: '35px', objectFit: 'contain', display: 'block', marginBottom: '4px' }} />
            ) : (
              <div style={{ height: '35px', borderBottom: '1px dashed #cbd5e1', width: '150px', marginBottom: '4px' }}></div>
            )}
            <p className="font-bold text-slate-800 uppercase text-[12px] tracking-wide">Headmaster / Principal</p>
            <p className="text-slate-500 font-medium text-[11px]">{schoolName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SponsorStatementPrintAreaProps {
  sponsorId: string;
  sponsorsList: any[] | null;
  students: Student[];
  classes: Class[];
  records: any[] | null;
  schoolName: string;
  schoolProfile: any;
}

function SponsorStatementPrintArea({
  sponsorId,
  sponsorsList,
  students,
  classes,
  records,
  schoolName,
  schoolProfile
}: SponsorStatementPrintAreaProps) {
  const sponsor = sponsorsList?.find(sp => sp.id === sponsorId);
  
  const sponsorStudents = useMemo(() => {
    if (!sponsorId || !students || !records) return [];
    const list = students.filter(s => s.isSponsored && s.sponsorId === sponsorId);
    return list.map(s => {
        const studentRecords = records.filter(r => r.studentId === s.uid && r.status !== 'Pending Reversal');
        const tuition = studentRecords.filter(r => r.type.toLowerCase().includes('tuition')).reduce((sum, r) => sum + (Number(r.billedAmount) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0)), 0);
        const canteen = studentRecords.filter(r => r.type.toLowerCase().includes('canteen')).reduce((sum, r) => sum + (Number(r.billedAmount) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0)), 0);
        const transport = studentRecords.filter(r => r.type.toLowerCase().includes('transport')).reduce((sum, r) => sum + (Number(r.billedAmount) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0)), 0);
        const total = studentRecords.reduce((sum, r) => sum + (Number(r.billedAmount) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0)), 0);
        const other = total - tuition - canteen - transport;
        const classObj = classes?.find(c => c.id === s.classId);

        return {
            student: s,
            className: classObj?.name || 'Unplaced',
            tuition,
            canteen,
            transport,
            other,
            total
        };
    });
  }, [sponsorId, students, records, classes]);

  const grandTotal = useMemo(() => {
    return sponsorStudents.reduce((sum, s) => sum + s.total, 0);
  }, [sponsorStudents]);

  if (!sponsor) return null;

  return (
    <div id="sponsor-statement-print-area" className="hidden print:block text-black bg-white w-full p-4 font-sans leading-normal">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          div.space-y-6.accounts-page-container > *:not(#sponsor-statement-print-area) {
            display: none !important;
          }
          #sponsor-statement-print-area {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print { display: none !important; }
        }
        #sponsor-statement-print-area table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        #sponsor-statement-print-area th, #sponsor-statement-print-area td {
          border: 1px solid #cbd5e1;
          padding: 8px;
          text-align: left;
          font-size: 11px;
        }
        #sponsor-statement-print-area th {
          background-color: #f8fafc !important;
          font-weight: 800;
        }
      `}} />

      {/* School Letterhead */}
      <div className="border-b-4 border-slate-900 pb-4 text-center">
        <h1 className="text-2xl font-black uppercase tracking-tight">{schoolName}</h1>
        <p className="text-xs text-slate-500 font-bold uppercase mt-1">Sponsorship Billing Statement Invoice</p>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Date Generated: {format(new Date(), 'PPpp')}</p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 py-4 text-xs border-b">
        <div>
          <h3 className="font-extrabold uppercase text-slate-500 mb-1">Billed To (Sponsor):</h3>
          <p className="font-black text-sm text-slate-800">{sponsor.name}</p>
          {sponsor.contactPerson && <p className="font-medium text-slate-600">Attn: {sponsor.contactPerson}</p>}
          {sponsor.email && <p>Email: {sponsor.email}</p>}
          {sponsor.phone && <p>Phone: {sponsor.phone}</p>}
        </div>
        <div className="text-right flex flex-col justify-between items-end">
          <div>
            <h3 className="font-extrabold uppercase text-slate-500 mb-1">Invoice Metadata:</h3>
            <p><strong>Total Sponsored Ward(s):</strong> {sponsorStudents.length} student(s)</p>
            <p><strong>Sponsorship Credit Limit:</strong> GH₵{sponsor.budgetLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="mt-2 p-2 bg-slate-50 border rounded-lg inline-block self-end text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Grand Outstanding Total</span>
            <p className="text-base font-black text-indigo-700 font-mono">GH₵{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Class</th>
            <th className="text-right">Tuition</th>
            <th className="text-right">Canteen</th>
            <th className="text-right">Transport</th>
            <th className="text-right">Other</th>
            <th className="text-right">Total Owed</th>
          </tr>
        </thead>
        <tbody>
          {sponsorStudents.map(s => (
            <tr key={s.student.uid}>
              <td className="font-mono">{s.student.studentId || 'ID Pending'}</td>
              <td className="font-bold">{s.student.firstName} {s.student.lastName}</td>
              <td>{s.className}</td>
              <td className="text-right font-mono">GH₵{s.tuition.toFixed(2)}</td>
              <td className="text-right font-mono">GH₵{s.canteen.toFixed(2)}</td>
              <td className="text-right font-mono">GH₵{s.transport.toFixed(2)}</td>
              <td className="text-right font-mono">GH₵{s.other.toFixed(2)}</td>
              <td className="text-right font-bold font-mono text-indigo-700">GH₵{s.total.toFixed(2)}</td>
            </tr>
          ))}
          <tr className="bg-slate-50 font-bold">
            <td colSpan={3} className="text-right font-black uppercase text-xs">Total Bill Sum:</td>
            <td className="text-right font-mono">GH₵{sponsorStudents.reduce((sum, s) => sum + s.tuition, 0).toFixed(2)}</td>
            <td className="text-right font-mono">GH₵{sponsorStudents.reduce((sum, s) => sum + s.canteen, 0).toFixed(2)}</td>
            <td className="text-right font-mono">GH₵{sponsorStudents.reduce((sum, s) => sum + s.transport, 0).toFixed(2)}</td>
            <td className="text-right font-mono">GH₵{sponsorStudents.reduce((sum, s) => sum + s.other, 0).toFixed(2)}</td>
            <td className="text-right font-black font-mono text-indigo-700 text-sm">GH₵{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
          </tr>
        </tbody>
      </table>

      {/* Payment details */}
      <div className="mt-8 border p-3 rounded-lg bg-slate-50 text-[11px] leading-relaxed">
        <p className="font-bold text-slate-700 uppercase mb-0.5">Approved Disbursement Options:</p>
        <p className="text-slate-600">
          • Please remit bulk payment to the school's bank account.<br />
          • Specify the Sponsor / NGO Name: <strong>{sponsor.name}</strong> as reference on the slip.
        </p>
      </div>

      {/* Signatures */}
      <div className="grid grid-cols-2 gap-8 pt-16 text-center text-xs">
        <div>
          <div className="border-b border-slate-400 h-8 max-w-[200px] mx-auto"></div>
          <p className="font-bold text-slate-500 mt-2 uppercase text-[9px]">Sponsor Representative Sign & Seal</p>
        </div>
        <div>
          <div className="border-b border-slate-400 h-8 max-w-[200px] mx-auto"></div>
          <p className="font-bold text-slate-500 mt-2 uppercase text-[9px]">Authorized School Finance Officer</p>
        </div>
      </div>
    </div>
  );
}

interface ParentDemandLettersDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  parents: any[];
  students: Student[];
  classes: Class[];
  records: FinancialRecord[];
  isSending: boolean;
  onPrint: (parentId: string) => void;
}

function ParentDemandLettersDialog({
  open,
  setOpen,
  parents,
  students,
  classes,
  records,
  isSending,
  onPrint
}: ParentDemandLettersDialogProps) {
  const [selectedParentId, setSelectedParentId] = useState('');
  const classMap = useMemo(() => {
    const map = new Map<string, string>();
    (classes || []).forEach(c => map.set(c.id, c.name));
    return map;
  }, [classes]);

  const selectedParent = useMemo(() => {
    return parents?.find(p => p.id === selectedParentId || p.uid === selectedParentId);
  }, [selectedParentId, parents]);

  const childrenDebts = useMemo(() => {
    if (!selectedParent || !students || !records) return [];
    
    return (selectedParent.studentIds || []).map((sid: string) => {
      const student = students.find(s => s.uid === sid);
      if (!student) return null;

      const studentRecords = records.filter(r => r.studentId === sid && r.status !== 'Pending Reversal');
      const totalBilled = studentRecords.reduce((sum, r) => sum + (Number(r.billedAmount) || 0), 0);
      const totalPaid = studentRecords.reduce((sum, r) => sum + (Number(r.amountPaid) || 0) + (Number(r.waiverAmount) || 0), 0);
      const balance = totalBilled - totalPaid;

      return {
        student,
        balance
      };
    }).filter((cd: any) => cd !== null);
  }, [selectedParent, students, records]);

  const totalOutstanding = useMemo(() => {
    return childrenDebts.reduce((sum: number, cd: any) => sum + cd.balance, 0);
  }, [childrenDebts]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCog className="h-5 w-5 text-indigo-650" /> Parent Debt Letters
          </DialogTitle>
          <DialogDescription>
            Generate beautifully formatted print/PDF correspondence sheets for parents, itemized by child.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="space-y-2">
            <Label className="font-bold text-xs uppercase text-slate-500">Select Parent</Label>
            <SearchableSelect
              options={(parents || []).filter(Boolean).map(p => ({
                id: p.id || p.uid,
                name: p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Unnamed Parent',
                subtext: `Phone: ${p.phone || 'N/A'} | Linked Children: ${p.studentIds?.length || 0}`
              }))}
              value={selectedParentId}
              onValueChange={setSelectedParentId}
              placeholder="Search parent by name..."
            />
          </div>

          {selectedParentId && selectedParent && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-1">
              <div className="p-4 bg-slate-50 border rounded-xl space-y-2 text-xs text-slate-700">
                <div className="flex justify-between border-b pb-1 font-bold">
                  <span>Parent: {selectedParent.name || `${selectedParent.firstName || ''} ${selectedParent.lastName || ''}`.trim()}</span>
                  <span className="text-slate-550 font-mono">Phone: {selectedParent.phone || 'N/A'}</span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <p className="font-bold text-[10px] text-slate-400 uppercase">Linked Children Balances:</p>
                  {childrenDebts.map((cd: any) => (
                    <div key={cd.student.uid} className="flex justify-between items-center">
                      <span>{cd.student.firstName} {cd.student.lastName} ({classMap.get(cd.student.classId) || 'N/A'})</span>
                      <span className={cn("font-mono font-bold", cd.balance > 0.01 ? "text-rose-600" : "text-emerald-600")}>
                        GH₵{cd.balance.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t pt-2 font-black text-sm mt-2 text-slate-800">
                  <span>Total Debt Owed:</span>
                  <span className={totalOutstanding > 0.01 ? "text-rose-600 font-mono" : "text-emerald-600 font-mono"}>
                    GH₵{totalOutstanding.toFixed(2)}
                  </span>
                </div>
              </div>

              {totalOutstanding > 0.01 ? (
                <Button
                  onClick={() => onPrint(selectedParentId)}
                  disabled={isSending}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <Printer className="mr-2 h-4 w-4" /> Print/Save PDF Letter
                </Button>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center text-xs text-emerald-800 font-semibold animate-pulse">
                  This parent has no outstanding balance. Letter generation is locked.
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AccountsPage() {
  const { role, profile } = useRole(); 
  const firestore = useFirestore(); 
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();
  const { user } = useUser();
  
  const [activeForm, setActiveForm] = useState<'single' | 'bulk' | 'levy' | 'termly-transport' | 'termly-canteen' | 'daily' | null>(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogState, setDialogState] = useState<{ type: 'payment' | 'waiver' | 'reversal' | 'history', record: FinancialRecord | null }>({ type: 'payment', record: null });
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null); 
  const [printDebtorsOpen, setPrintDebtorsOpen] = useState(false); 
  const [parentLettersOpen, setParentLettersOpen] = useState(false);
  const [selectedParentIdForPrint, setSelectedParentIdForPrint] = useState<string>('');
  const [activePrintType, setActivePrintType] = useState<'debtors-list' | 'parent-letter' | 'sponsor-statement' | null>(null);
  const [printMode, setPrintMode] = useState<'all-classes-split' | 'single-class' | 'whole-school-grouped'>('all-classes-split');
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [minDebt, setMinDebt] = useState<number>(1); 
  const [activeTab, setActiveTab] = useState('billing');
  const [analyticsTab, setAnalyticsTab] = useState('summary');
  const [isProcessingReversal, setIsProcessingReversal] = useState<string | null>(null);
  const [isProcessingWaiver, setIsProcessingWaiver] = useState<string | null>(null);
  
  const [isSponsorDialogOpen, setIsSponsorDialogOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<any>(null);
  const [isSavingSponsor, setIsSavingSponsor] = useState(false);
  const [sponsorForm, setSponsorForm] = useState({ name: '', contactPerson: '', phone: '', email: '', budgetLimit: 0 });
  
  const [selectedSponsorIdForStudents, setSelectedSponsorIdForStudents] = useState<string | null>(null);
  const [selectedSponsorIdForPrint, setSelectedSponsorIdForPrint] = useState<string>('');
  
  const [isOpeningTill, setIsOpeningTill] = useState(false);
  const [sendingSMSStudentId, setSendingSMSStudentId] = useState<string | null>(null);
  const [globalDateRange, setGlobalDateRange] = useState<DateRange | undefined>({ 
      from: startOfMonth(new Date()), 
      to: endOfDay(new Date()) 
  });

  const activeTillQuery = useMemoFirebase(() => 
    (firestore && user?.uid && schoolId) ? 
    query(
        collection(firestore, 'tills'), 
        where('schoolId', '==', schoolId),
        where('accountantId', '==', user.uid), 
        where('status', '==', 'Open')
    ) : null,
    [firestore, user?.uid, schoolId]
  );
  const { data: activeTills, isLoading: isLoadingTills, forceRefetch: refetchActiveTill } = useCollection<any>(activeTillQuery);
  const activeTill = activeTills?.[0];

  const handleOpenTill = useCallback(async () => {
    if (!user || !schoolId || !firestore) return;
    setIsOpeningTill(true);
    try {
        const newTillRef = doc(collection(firestore, 'tills'));
        await setDoc(newTillRef, {
            accountantId: user.uid,
            accountantName: user.displayName || user.email,
            openingBalance: 0,
            currentBalance: 0,
            closingBalance: null,
            dateOpened: serverTimestamp(),
            dateClosed: null,
            status: 'Open',
            directorApproval: { directorId: null, directorName: null, approvedAt: null },
            schoolId: schoolId,
        });
        toast({ title: 'Success', description: 'New till opened for the day.' });
        if (refetchActiveTill) refetchActiveTill();
    } catch (e: any) {
        console.error(e);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to open till: ' + e.message });
    } finally {
        setIsOpeningTill(false);
    }
  }, [user, schoolId, firestore, refetchActiveTill, toast]);

  const recordsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'financialRecords'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: records, isLoading: isLoadingRecords, forceRefetch } = useCollection<FinancialRecord>(recordsQuery);

  const waiverRequestsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'waiverRequests'), where('schoolId', '==', schoolId), where('status', '==', 'Pending')) : null, [firestore, schoolId]);
  const { data: pendingWaivers, forceRefetch: refetchWaivers } = useCollection<any>(waiverRequestsQuery);
  
  const combinedRefetch = useCallback(() => {
      forceRefetch();
      refetchWaivers();
  }, [forceRefetch, refetchWaivers]);
  
  const rawStudentsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: rawStudents, isLoading: isLoadingStudents } = useCollection<Student>(rawStudentsQuery);

  const sponsorsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'sponsors'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: sponsorsList, forceRefetch: refetchSponsors } = useCollection<any>(sponsorsQuery);
  
  const students = useMemo(() => {
      if (!rawStudents) return [];
      return rawStudents.filter(s => s.enrollmentStatus === 'Active' || !s.enrollmentStatus);
  }, [rawStudents]);

  const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: classes } = useCollection<Class>(classesQuery);

  const parentsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'parents'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: parents, isLoading: isLoadingParents } = useCollection<any>(parentsQuery);

  const schoolRef = useMemoFirebase(
    () => (firestore && schoolId ? doc(firestore, 'schools', schoolId) : null),
    [firestore, schoolId]
  );
  const { data: schoolProfile } = useDoc<any>(schoolRef);
  const schoolName = schoolProfile?.name || 'GAM Edu School';

  const debtors = useMemo(() => {
    if (!students || !records) return [];

    const studentRecordsMap: Record<string, FinancialRecord[]> = {};
    records.forEach(r => {
      if (r.status === 'Pending Reversal') return;
      if (!studentRecordsMap[r.studentId]) {
        studentRecordsMap[r.studentId] = [];
      }
      studentRecordsMap[r.studentId].push(r);
    });

    return students.map(s => {
      const recs = studentRecordsMap[s.uid] || [];
      const totalBilled = recs.reduce((sum, r) => sum + (Number(r.billedAmount) || 0), 0);
      const totalPaid = recs.reduce((sum, r) => sum + (Number(r.amountPaid) || 0) + (Number(r.waiverAmount) || 0), 0);
      const balance = totalBilled - totalPaid;

      const tuitionDebt = recs.filter(r => r.type.toLowerCase().includes('tuition')).reduce((sum, r) => sum + (Number(r.billedAmount) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0)), 0);
      const canteenDebt = recs.filter(r => r.type.toLowerCase().includes('canteen')).reduce((sum, r) => sum + (Number(r.billedAmount) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0)), 0);
      const transportDebt = recs.filter(r => r.type.toLowerCase().includes('transport')).reduce((sum, r) => sum + (Number(r.billedAmount) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0)), 0);
      const otherDebt = balance - tuitionDebt - canteenDebt - transportDebt;

      return {
        student: s,
        balance,
        breakdown: {
          tuition: Math.max(0, tuitionDebt),
          canteen: Math.max(0, canteenDebt),
          transport: Math.max(0, transportDebt),
          other: Math.max(0, otherDebt)
        }
      };
    }).filter(d => d.balance >= minDebt);
  }, [students, records, minDebt]);

  const sponsorsWithBalances = useMemo(() => {
      if (!sponsorsList || !students || !records) return [];
      
      const studentSponsorMap = new Map<string, string>();
      students.forEach(s => {
          if (s.isSponsored && s.sponsorId) {
              studentSponsorMap.set(s.uid, s.sponsorId);
          }
      });
      
      const sponsorBalances = new Map<string, number>();
      records.forEach(r => {
          if (r.status === 'Pending Reversal') return;
          const sId = studentSponsorMap.get(r.studentId);
          if (sId) {
              const balance = (Number(r.billedAmount) || 0) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0);
              if (balance > 0) {
                  sponsorBalances.set(sId, (sponsorBalances.get(sId) || 0) + balance);
              }
          }
      });
      
      return (sponsorsList || []).filter(Boolean).map((sp: any) => {
          const outstanding = sponsorBalances.get(sp.id) || 0;
          const sponsoredCount = students.filter(s => s.isSponsored && s.sponsorId === sp.id).length;
          
          const hasBills = records.some(r => {
              if (r.status === 'Pending Reversal') return false;
              const sId = studentSponsorMap.get(r.studentId);
              return sId === sp.id;
          });

          return {
              ...sp,
              outstanding,
              sponsoredCount,
              hasBills
          };
      });
  }, [sponsorsList, students, records]);

  const selectedSponsor = useMemo(() => {
      return sponsorsList?.find((sp: any) => sp.id === selectedSponsorIdForStudents);
  }, [sponsorsList, selectedSponsorIdForStudents]);

  const sponsoredStudentsBreakdown = useMemo(() => {
      if (!selectedSponsorIdForStudents || !students || !records) return [];
      
      const list = students.filter(s => s.isSponsored && s.sponsorId === selectedSponsorIdForStudents);
      
      return list.map(s => {
          const studentRecords = records.filter(r => r.studentId === s.uid && r.status !== 'Pending Reversal');
          
          const tuition = studentRecords.filter(r => r.type.toLowerCase().includes('tuition')).reduce((sum, r) => sum + (Number(r.billedAmount) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0)), 0);
          const canteen = studentRecords.filter(r => r.type.toLowerCase().includes('canteen')).reduce((sum, r) => sum + (Number(r.billedAmount) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0)), 0);
          const transport = studentRecords.filter(r => r.type.toLowerCase().includes('transport')).reduce((sum, r) => sum + (Number(r.billedAmount) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0)), 0);
          const total = studentRecords.reduce((sum, r) => sum + (Number(r.billedAmount) - (Number(r.amountPaid) || 0) - (Number(r.waiverAmount) || 0)), 0);
          const other = total - tuition - canteen - transport;
          const classObj = classes?.find(c => c.id === s.classId);

          return {
              student: s,
              className: classObj?.name || 'Unplaced',
              tuition: Math.max(0, tuition),
              canteen: Math.max(0, canteen),
              transport: Math.max(0, transport),
              other: Math.max(0, other),
              total: Math.max(0, total)
          };
      });
  }, [selectedSponsorIdForStudents, students, records, classes]);

  const classGroupedDebtors = useMemo(() => {
    const groups: Record<string, typeof debtors> = {};
    debtors.forEach(d => {
      const cid = d.student.classId || 'unassigned';
      if (!groups[cid]) groups[cid] = [];
      groups[cid].push(d);
    });
    return groups;
  }, [debtors]);

  const classesToPrint = useMemo(() => {
    if (printMode === 'single-class') {
      return (classes || []).filter(c => c.id === selectedClassId);
    }
    return (classes || [])
      .filter(c => (classGroupedDebtors[c.id] || []).length > 0)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [classes, printMode, selectedClassId, classGroupedDebtors]);

  const classesMap = useMemo(() => {
    const map = new Map<string, string>();
    (classes || []).forEach(c => map.set(c.id, c.name));
    return map;
  }, [classes]);

  const handlePrintDebtorsList = () => {
    setActivePrintType('debtors-list');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handlePrintParentLetter = (parentId: string) => {
    setSelectedParentIdForPrint(parentId);
    setActivePrintType('parent-letter');
    setTimeout(() => {
      window.print();
    }, 150);
  };

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
    if (!records || !students) return { totalRevenue: 0, totalOutstanding: 0, outstandingTuition: 0, outstandingCanteen: 0, outstandingTransport: 0, otherDebt: 0, totalBilled: 0 };
    
    const activeStudentIds = new Set(students.map(s => s.uid));

    // Consolidate filters for accuracy
    const activeRecords = records.filter(r => 
        activeStudentIds.has(r.studentId) && 
        r.status !== 'Pending Reversal'
    );

    let totalPaid = 0, outstandingTuition = 0, outstandingCanteen = 0, outstandingTransport = 0, otherDebt = 0, totalBilled = 0;

    for (const record of activeRecords) {
        const billed = Number(record.billedAmount) || 0;
        const paid = Number(record.amountPaid) || 0;
        const waiver = Number(record.waiverAmount) || 0;
        const balance = billed - paid - waiver;
        totalPaid += paid;
        totalBilled += billed;
        
        if (balance > 0) {
            const type = record.type.toLowerCase();
            if (type.includes('tuition')) outstandingTuition += balance;
            else if (type.includes('canteen')) outstandingCanteen += balance;
            else if (type.includes('transport')) outstandingTransport += balance;
            else otherDebt += balance;
        }
    }
    const totalOutstanding = outstandingTuition + outstandingCanteen + outstandingTransport + otherDebt;
    return { 
        totalRevenue: totalPaid, 
        totalOutstanding, 
        outstandingTuition, 
        outstandingCanteen, 
        outstandingTransport, 
        otherDebt,
        totalBilled
    };
  }, [records, students]);

  // --- DEBT AGING CALCULATION ---
  const debtAgingStats = useMemo(() => {
    if (!records || !students) return { current: 0, age30: 0, age60: 0, age90: 0, total: 0, overpayments: 0, grossTotal: 0 };
    
    const activeStudentIds = new Set(students.map(s => s.uid));
    const today = startOfDay(new Date());

    let current = 0; // Due date in the future or today
    let age30 = 0;   // Overdue 1-30 days
    let age60 = 0;   // Overdue 31-60 days
    let age90 = 0;   // Overdue 61+ days
    let overpayments = 0;

    records.forEach(r => {
      if (!activeStudentIds.has(r.studentId) || r.status === 'Pending Reversal') return;
      
      const billed = Number(r.billedAmount) || 0;
      const paid = Number(r.amountPaid) || 0;
      const waiver = Number(r.waiverAmount) || 0;
      const balance = billed - paid - waiver;

      if (balance < 0) {
        overpayments += Math.abs(balance);
        return;
      }
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

    const total = current + age30 + age60 + age90 - overpayments;
    const grossTotal = current + age30 + age60 + age90;
    return { current, age30, age60, age90, total, overpayments, grossTotal };
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

  const collectionRate = useMemo(() => {
    const billed = dashboardStats.totalBilled;
    return billed > 0 ? (dashboardStats.totalRevenue / billed) * 100 : 100;
  }, [dashboardStats]);

  const categoryCollections = useMemo(() => {
    if (!records || !students) return [];
    
    const activeStudentIds = new Set(students.map(s => s.uid));
    const activeRecords = records.filter(r => activeStudentIds.has(r.studentId) && r.status !== 'Pending Reversal');
    
    const categories: Record<string, { billed: number, paid: number, waived: number }> = {
        'Tuition': { billed: 0, paid: 0, waived: 0 },
        'Canteen': { billed: 0, paid: 0, waived: 0 },
        'Transport': { billed: 0, paid: 0, waived: 0 },
        'PTA Levy': { billed: 0, paid: 0, waived: 0 },
        'Other': { billed: 0, paid: 0, waived: 0 }
    };
    
    activeRecords.forEach(r => {
        const type = r.type.toLowerCase();
        let cat = 'Other';
        if (type.includes('tuition')) cat = 'Tuition';
        else if (type.includes('canteen')) cat = 'Canteen';
        else if (type.includes('transport')) cat = 'Transport';
        else if (type.includes('pta')) cat = 'PTA Levy';
        
        categories[cat].billed += Number(r.billedAmount) || 0;
        categories[cat].paid += Number(r.amountPaid) || 0;
        categories[cat].waived += Number(r.waiverAmount) || 0;
    });
    
    return Object.entries(categories).map(([name, stats]) => {
        const netBilled = stats.billed - stats.waived;
        const rate = netBilled > 0 ? (stats.paid / netBilled) * 100 : 100;
        return {
            name,
            billed: stats.billed,
            paid: stats.paid,
            waived: stats.waived,
            outstanding: Math.max(0, netBilled - stats.paid),
            rate
        };
    });
  }, [records, students]);

  const topDebtors = useMemo(() => {
      const actualThreshold = Number(schoolSettings?.highArrearsThreshold) || 10000;
      const exceeding = studentFinancials.filter(sf => sf.balance >= actualThreshold);
      if (exceeding.length > 0) {
          return exceeding;
      }
      return studentFinancials.filter(sf => sf.balance > 0.01).slice(0, 5);
  }, [studentFinancials, schoolSettings]);

  const getOldestOverdueDays = useCallback((studentRecords: FinancialRecord[]) => {
      const unpaidOrOverdue = studentRecords.filter(r => 
          (r.status === 'Unpaid' || r.status === 'Overdue') && 
          (r.billedAmount - (r.amountPaid || 0) - (r.waiverAmount || 0) > 0.01)
      );
      if (unpaidOrOverdue.length === 0) return 0;
      
      const oldestDueDate = unpaidOrOverdue.reduce((oldest, current) => {
          const currentD = current.dueDate?.toDate ? current.dueDate.toDate() : new Date(current.dueDate);
          const oldestD = oldest.dueDate?.toDate ? oldest.dueDate.toDate() : new Date(oldest.dueDate);
          return currentD < oldestD ? current : oldest;
      });
      
      const oldestD = oldestDueDate.dueDate?.toDate ? oldestDueDate.dueDate.toDate() : new Date(oldestDueDate.dueDate);
      const diffTime = new Date().getTime() - oldestD.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
  }, []);

  const handleSendOverallSMSReminder = useCallback(async (studentId: string, studentName: string, balance: number) => {
      if (!firestore || !schoolId) return;
      setSendingSMSStudentId(studentId);
      try {
          const parentQ = query(collection(firestore, 'parents'), where('schoolId', '==', schoolId), where('studentIds', 'array-contains', studentId));
          const pSnap = await getDocs(parentQ);
          if (pSnap.empty) {
              toast({ variant: 'destructive', title: "No Parent Found", description: "No parent record is linked to this student." });
              return;
          }
          const parentData = pSnap.docs[0].data();
          const phone = parentData.phone;
          if (!phone) {
              toast({ variant: 'destructive', title: "No Phone Number", description: "Parent record has no phone number." });
              return;
          }

          const msg = `Dear Parent, you have an outstanding balance of GHS ${balance.toFixed(2)} for ${studentName}. Please log in to your Parent Portal to view bills and pay online. - GAM Edu`;
          
          toast({ title: "Sending SMS Reminder...", description: `Sending to ${phone}` });
          const idToken = await user?.getIdToken();
          const result = await sendSchoolSMSAction(schoolId, phone, msg, idToken);
          
          if (result.success) {
              toast({ title: "Reminder Sent!", description: "Parent has been notified successfully." });
          } else {
              throw new Error(result.error);
          }
      } catch (e: any) {
          toast({ variant: 'destructive', title: "Failed to send SMS", description: e.message });
      } finally {
          setSendingSMSStudentId(null);
      }
  }, [firestore, schoolId, toast]);



  // --- REVERSAL HANDLERS ---
  const handleApproveReversal = async (record: FinancialRecord) => {
    if (!firestore || isProcessingReversal) return;
    setIsProcessingReversal(record.id);
    try {
        const batch = writeBatch(firestore);
        
        // 1. Fetch payments from subcollection, mark them reversed, and add negative reversal transactions
        const querySnap = await getDocs(collection(firestore, 'financialRecords', record.id, 'payments'));
        const paymentsList = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PaymentTransaction));
        
        for (const p of paymentsList) {
            // Update original payment to mark as Reversed
            batch.update(doc(firestore, 'financialRecords', record.id, 'payments', p.id), {
                status: 'Reversed',
                reversedAt: serverTimestamp(),
                reversedBy: 'Director Approved'
            });

            // Write the negative reversal transaction
            const revId = `${p.id}-REV`;
            batch.set(doc(firestore, 'financialRecords', record.id, 'payments', revId), {
                id: revId,
                amount: -p.amount,
                method: p.method,
                notes: `Reversal of Receipt #${p.id}. Reason: ${(record as any).reversalReason || 'Director Approved Reversal'}`,
                paidAt: serverTimestamp(),
                processedById: user?.uid || 'system',
                processedByName: 'Director',
                studentId: record.studentId,
                description: `Reversal of Receipt #${p.id}`,
                schoolId: schoolId || record.schoolId || '',
                status: 'Completed',
                isReversal: true,
                reversedReceiptId: p.id
            });
        }
        
        // 2. Reset parent record charge status and amountPaid
        const recordRef = doc(firestore, 'financialRecords', record.id);
        const totalReversed = paymentsList.reduce((sum, p) => sum + (p.amount || 0), 0);
        const newAmountPaid = Math.max(0, (record.amountPaid || 0) - totalReversed);
        const totalCredited = newAmountPaid + (record.waiverAmount || 0);
        
        let newStatus: 'Paid' | 'Partially Paid' | 'Unpaid' = 'Unpaid';
        if (totalCredited >= record.billedAmount) {
            newStatus = 'Paid';
        } else if (totalCredited > 0) {
            newStatus = 'Partially Paid';
        }
        
        batch.update(recordRef, {
            amountPaid: newAmountPaid,
            status: newStatus,
            reversalReason: deleteField(),
            reversalRequestedAt: deleteField()
        });

        // 3. Log the reversal to a permanent audit collection
        const logRef = doc(collection(firestore, 'reversalLogs'));
        batch.set(logRef, {
            id: logRef.id,
            recordId: record.id,
            studentId: record.studentId,
            studentName: record.studentName,
            chargeDescription: record.description,
            billedAmount: record.billedAmount,
            amountReversed: totalReversed,
            reason: (record as any).reversalReason || 'Director Approved Reversal',
            approvedBy: 'Director',
            timestamp: serverTimestamp(),
            schoolId: record.schoolId || ''
        });
        
        await batch.commit();
        toast({ title: "Reversal Approved", description: "The payment has been reversed. The bill has been reset to unpaid/partially paid on the student's ledger." });
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

  const handleApproveWaiver = async (req: any) => {
    if (!firestore || isProcessingWaiver) return;
    setIsProcessingWaiver(req.id);
    try {
        const batch = writeBatch(firestore);

        const requestRef = doc(firestore, 'waiverRequests', req.id);
        batch.update(requestRef, {
            status: 'Approved',
            approvedBy: user?.uid || 'system',
            approvedByName: profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : 'Director',
            approvedAt: serverTimestamp()
        });

        const recordRef = doc(firestore, 'financialRecords', req.recordId);
        const newWaiverAmount = (req.currentWaiverAmount || 0) + req.requestedAmount;
        const isFullySettled = (req.billedAmount - (req.amountPaid || 0) - newWaiverAmount) <= 0.01;

        batch.update(recordRef, {
            waiverAmount: newWaiverAmount,
            waiverReason: req.reason,
            status: isFullySettled ? 'Paid' : 'Partially Paid'
        });

        const logRef = doc(collection(firestore, 'auditLogs'));
        batch.set(logRef, {
            schoolId: req.schoolId || schoolId || '',
            userName: profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : 'Director',
            action: 'APPROVE_WAIVER',
            details: `Approved waiver of GH₵${req.requestedAmount.toFixed(2)} for student ${req.studentName} on invoice ${req.recordDescription}. Reason: ${req.reason}`,
            timestamp: serverTimestamp(),
            userId: user?.uid || null
        });

        await batch.commit();
        toast({ title: "Waiver Approved", description: `GH₵${req.requestedAmount.toFixed(2)} waiver has been applied successfully.` });
        combinedRefetch();
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Approval Failed", description: e.message });
    } finally {
        setIsProcessingWaiver(null);
    }
  };

  const handleRejectWaiver = async (req: any) => {
    if (!firestore || isProcessingWaiver) return;
    setIsProcessingWaiver(req.id);
    try {
        const requestRef = doc(firestore, 'waiverRequests', req.id);
        await updateDoc(requestRef, {
            status: 'Rejected',
            rejectedBy: user?.uid || 'system',
            rejectedByName: profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : 'Director',
            rejectedAt: serverTimestamp()
        });
        
        await addDoc(collection(firestore, 'auditLogs'), {
            schoolId: req.schoolId || schoolId || '',
            userName: profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : 'Director',
            action: 'REJECT_WAIVER',
            details: `Rejected waiver request of GH₵${req.requestedAmount.toFixed(2)} for student ${req.studentName} on invoice ${req.recordDescription}.`,
            timestamp: serverTimestamp(),
            userId: user?.uid || null
        });

        toast({ title: "Waiver Rejected", description: `Waiver request of GH₵${req.requestedAmount.toFixed(2)} has been rejected.` });
        combinedRefetch();
    } catch (e: any) {
        toast({ variant: 'destructive', title: "Rejection Failed", description: e.message });
    } finally {
        setIsProcessingWaiver(null);
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
    <div className="space-y-6 accounts-page-container">
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
                            {(dashboardStats.totalBilled > 0 ? (dashboardStats.totalRevenue / dashboardStats.totalBilled) * 100 : 0).toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-slate-100/80 p-1 rounded-xl mb-4 border border-slate-200/50 flex gap-1 w-fit">
                <TabsTrigger value="billing" className="rounded-lg font-semibold px-4">Student Billing</TabsTrigger>
                <TabsTrigger value="approval" className="rounded-lg font-semibold px-4">
                    Approvals / Requests 
                    {(pendingReversals.length + (pendingWaivers?.length || 0)) > 0 && (
                        <Badge className="ml-2 bg-red-500 text-white border-0 hover:bg-red-600">
                            {pendingReversals.length + (pendingWaivers?.length || 0)}
                        </Badge>
                    )}
                </TabsTrigger>
                <TabsTrigger value="sponsors" className="rounded-lg font-semibold px-4">Sponsors Registry</TabsTrigger>
            </TabsList>
            <TabsContent value="billing" className="space-y-6">
                {/* Advanced Analytics Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Collections Advisory Desk */}
                    <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                        <Tabs value={analyticsTab} onValueChange={setAnalyticsTab} className="w-full">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-3 mb-4">
                                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Collections Advisory Desk</h3>
                                <TabsList className="bg-slate-100 p-0.5 rounded-lg border">
                                    <TabsTrigger value="summary" className="text-xs px-3 py-1 rounded-md">Financial Summary</TabsTrigger>
                                    <TabsTrigger value="debtors" className="text-xs px-3 py-1 rounded-md">Aged Debt Call List</TabsTrigger>
                                    <TabsTrigger value="aging" className="text-xs px-3 py-1 rounded-md">Debt Aging</TabsTrigger>
                                    <TabsTrigger value="classPace" className="text-xs px-3 py-1 rounded-md">Class Pace</TabsTrigger>
                                </TabsList>
                            </div>
                            
                            <TabsContent value="summary" className="mt-0 space-y-6 animate-in fade-in-50">
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

                                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6 pt-6 border-t border-slate-100">
                                    {/* SVG Target Collection Gauge */}
                                    <div className="md:col-span-2 flex flex-col items-center justify-center text-center p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-4">Overall Target Pace</h4>
                                        <div className="relative flex items-center justify-center h-32 w-32">
                                            {/* Background Circle */}
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="52"
                                                    className="stroke-slate-200 fill-none"
                                                    strokeWidth="10"
                                                />
                                                {/* Foreground Progress Circle */}
                                                <circle
                                                    cx="64"
                                                    cy="64"
                                                    r="52"
                                                    className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out"
                                                    strokeWidth="10"
                                                    strokeDasharray={2 * Math.PI * 52}
                                                    strokeDashoffset={2 * Math.PI * 52 - (collectionRate / 100) * (2 * Math.PI * 52)}
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                            <div className="absolute flex flex-col items-center justify-center">
                                                <span className="text-2xl font-black text-slate-800 font-mono">{collectionRate.toFixed(1)}%</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Collected</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 max-w-[240px]">
                                            <p className="text-[11px] font-medium text-slate-500 leading-normal">
                                                {collectionRate >= 80 ? (
                                                    "Excellent collection health. Continue regular cash auditing."
                                                ) : collectionRate >= 55 ? (
                                                    "Moderate collection health. Trigger reminders for aging accounts."
                                                ) : (
                                                    "Urgent attention needed. Overall collection rate is critical."
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Category Collections Pace */}
                                    <div className="md:col-span-3 space-y-4">
                                        <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Fee Stream Collection Performance</h4>
                                        <div className="space-y-3">
                                            {categoryCollections.map(cat => {
                                                const color = cat.rate >= 80 ? 'bg-emerald-500' : cat.rate >= 50 ? 'bg-amber-500' : 'bg-rose-500';
                                                const textColor = cat.rate >= 80 ? 'text-emerald-700' : cat.rate >= 50 ? 'text-amber-700' : 'text-rose-700';
                                                return (
                                                    <div key={cat.name} className="space-y-1">
                                                        <div className="flex justify-between text-xs">
                                                            <span className="font-semibold text-slate-700">{cat.name}</span>
                                                            <span className={cn("font-bold font-mono", textColor)}>{cat.rate.toFixed(1)}% ({cat.outstanding > 0 ? `GH₵${cat.outstanding.toFixed(0)} owed` : 'Settled'})</span>
                                                        </div>
                                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                            <div 
                                                                className={cn("h-full transition-all duration-500", color)}
                                                                style={{ width: `${Math.min(cat.rate, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="debtors" className="mt-0 space-y-4 animate-in fade-in-50">
                                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <AlertTriangle className="h-4 w-4 text-rose-500" /> Actionable Aged Debt Reminders
                                    </h4>
                                    <p className="text-xs text-slate-500 leading-normal">
                                        The following students have the largest outstanding balances. Click the SMS button to send parent reminder messages including safe payment portal instructions.
                                    </p>
                                </div>
                                
                                <div className="grid gap-3 max-h-[360px] overflow-y-auto pr-1">
                                    {topDebtors.map(({ student, balance, records: studentRecs }) => {
                                        const overdueDays = getOldestOverdueDays(studentRecs);
                                        const isSending = sendingSMSStudentId === student.uid;
                                        
                                        return (
                                            <div key={student.uid} className="bg-white border hover:border-slate-350 p-3.5 rounded-xl shadow-sm hover:shadow transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div className="flex items-center gap-3">
                                                    <StudentDisplay student={student} variant="compact" />
                                                    <div className="hidden sm:block border-l pl-3 py-1">
                                                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Oldest Aging</p>
                                                        <p className={cn("text-xs font-semibold mt-0.5", overdueDays > 30 ? "text-rose-600" : "text-slate-500")}>
                                                            {overdueDays > 0 ? `${overdueDays} Days Overdue` : "Current"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-2 sm:pt-0">
                                                    <div className="text-left sm:text-right">
                                                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Outstanding</p>
                                                        <p className="text-md font-extrabold text-rose-600 font-mono">
                                                            GH₵{balance.toFixed(2)}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="h-9 px-3 text-xs text-blue-600 border-blue-200 hover:bg-blue-50/50"
                                                            onClick={() => {
                                                                setSearchTerm(`${student.firstName} ${student.lastName}`);
                                                                setActiveTab('billing');
                                                            }}
                                                        >
                                                            View Ledger
                                                        </Button>
                                                        <Button 
                                                            size="sm" 
                                                            className="h-9 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                                                            disabled={isSending}
                                                            onClick={() => handleSendOverallSMSReminder(student.uid, `${student.firstName} ${student.lastName}`, balance)}
                                                        >
                                                            {isSending ? (
                                                                <>
                                                                    <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> Sending...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Send className="h-3 w-3 mr-1.5" /> Send Reminder
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {topDebtors.length === 0 && (
                                        <div className="text-center py-10 text-muted-foreground italic text-xs">
                                            All accounts are in good standing! No outstanding debt found.
                                        </div>
                                    )}
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="aging" className="mt-0">
                                <div className="space-y-4">
                                    <div className="h-5 flex rounded-lg overflow-hidden bg-slate-100 border shadow-inner">
                                        {debtAgingStats.grossTotal > 0 ? (
                                            <>
                                                {debtAgingStats.current > 0 && (
                                                    <div 
                                                        style={{ width: `${(debtAgingStats.current / debtAgingStats.grossTotal) * 100}%` }} 
                                                        className="bg-emerald-500 transition-all duration-500 hover:opacity-90"
                                                        title={`Current: GH₵ ${debtAgingStats.current.toFixed(2)}`}
                                                    />
                                                )}
                                                {debtAgingStats.age30 > 0 && (
                                                    <div 
                                                        style={{ width: `${(debtAgingStats.age30 / debtAgingStats.grossTotal) * 100}%` }} 
                                                        className="bg-amber-400 transition-all duration-500 hover:opacity-90"
                                                        title={`1-30 Days Overdue: GH₵ ${debtAgingStats.age30.toFixed(2)}`}
                                                    />
                                                )}
                                                {debtAgingStats.age60 > 0 && (
                                                    <div 
                                                        style={{ width: `${(debtAgingStats.age60 / debtAgingStats.grossTotal) * 100}%` }} 
                                                        className="bg-orange-500 transition-all duration-500 hover:opacity-90"
                                                        title={`31-60 Days Overdue: GH₵ ${debtAgingStats.age60.toFixed(2)}`}
                                                    />
                                                )}
                                                {debtAgingStats.age90 > 0 && (
                                                    <div 
                                                        style={{ width: `${(debtAgingStats.age90 / debtAgingStats.grossTotal) * 100}%` }} 
                                                        className="bg-rose-600 transition-all duration-500 hover:opacity-90"
                                                        title={`61+ Days Overdue: GH₵ ${debtAgingStats.age90.toFixed(2)}`}
                                                    />
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full bg-slate-100 flex items-center justify-center text-xs text-muted-foreground italic">No Outstanding Debt</div>
                                        )}
                                    </div>
                                    
                                    <div className={cn("grid grid-cols-2 gap-4", debtAgingStats.overpayments > 0 ? "md:grid-cols-3 lg:grid-cols-5" : "md:grid-cols-4")}>
                                        <Card className="p-3 border-l-4 border-l-emerald-500 bg-emerald-50/10 bg-slate-50/20">
                                            <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500" /> Current (Not Overdue)</p>
                                            <p className="text-lg font-bold text-slate-800 mt-1">GH₵{debtAgingStats.current.toFixed(2)}</p>
                                            <p className="text-[10px] text-muted-foreground">{debtAgingStats.grossTotal > 0 ? ((debtAgingStats.current / debtAgingStats.grossTotal) * 100).toFixed(1) : 0}% of gross</p>
                                        </Card>
                                        <Card className="p-3 border-l-4 border-l-amber-400 bg-amber-50/10 bg-slate-50/20">
                                            <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3 text-amber-500" /> 1 - 30 Days Overdue</p>
                                            <p className="text-lg font-bold text-amber-700 mt-1">GH₵{debtAgingStats.age30.toFixed(2)}</p>
                                            <p className="text-[10px] text-muted-foreground">{debtAgingStats.grossTotal > 0 ? ((debtAgingStats.age30 / debtAgingStats.grossTotal) * 100).toFixed(1) : 0}% of gross</p>
                                        </Card>
                                        <Card className="p-3 border-l-4 border-l-orange-500 bg-orange-50/10 bg-slate-50/20">
                                            <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3 text-orange-500" /> 31 - 60 Days Overdue</p>
                                            <p className="text-lg font-bold text-orange-700 mt-1">GH₵{debtAgingStats.age60.toFixed(2)}</p>
                                            <p className="text-[10px] text-muted-foreground">{debtAgingStats.grossTotal > 0 ? ((debtAgingStats.age60 / debtAgingStats.grossTotal) * 100).toFixed(1) : 0}% of gross</p>
                                        </Card>
                                        <Card className="p-3 border-l-4 border-l-rose-600 bg-rose-50/10 bg-slate-50/20">
                                            <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><AlertCircle className="h-3 w-3 text-rose-600" /> 61+ Days Overdue</p>
                                            <p className="text-lg font-bold text-rose-700 mt-1">GH₵{debtAgingStats.age90.toFixed(2)}</p>
                                            <p className="text-[10px] text-muted-foreground">{debtAgingStats.grossTotal > 0 ? ((debtAgingStats.age90 / debtAgingStats.grossTotal) * 100).toFixed(1) : 0}% of gross</p>
                                        </Card>
                                        {debtAgingStats.overpayments > 0 && (
                                            <Card className="p-3 border-l-4 border-l-teal-500 bg-teal-50/10 bg-slate-50/20">
                                                <p className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1"><HandCoins className="h-3 w-3 text-teal-650" /> Overpayments</p>
                                                <p className="text-lg font-bold text-teal-700 mt-1">-GH₵{debtAgingStats.overpayments.toFixed(2)}</p>
                                                <p className="text-[10px] text-muted-foreground">Prepayments & credits</p>
                                            </Card>
                                        )}
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
                    
                    {/* Right: Cash Register Registry Widget */}
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm">
                        <Card className="border-0 shadow-none p-0 flex flex-col justify-between h-full bg-transparent">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                                        <Wallet className="h-4 w-4 text-slate-500" /> Cash Register Desk
                                    </h3>
                                    {isLoadingTills ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                    ) : activeTill ? (
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold flex items-center gap-1.5 py-0.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" /> Open
                                        </Badge>
                                    ) : (
                                        <Badge variant="destructive" className="font-extrabold py-0.5">Closed</Badge>
                                    )}
                                </div>
                                
                                {activeTill ? (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                                            <p className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wide">Cash Balance in Till</p>
                                            <p className="text-3xl font-black text-emerald-800 tracking-tight mt-1">
                                                GH₵{activeTill.currentBalance?.toFixed(2) || "0.00"}
                                            </p>
                                            <p className="text-[9px] text-slate-500 mt-2 font-medium">
                                                Session ID: #{activeTill.id.substring(0, 8).toUpperCase()}
                                            </p>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            You are authorized to log cash payments from students. Receipts will link to this register desk.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-xl flex items-start gap-2.5">
                                            <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5 animate-pulse" />
                                            <div>
                                                <p className="text-xs font-bold text-rose-800">Closed Registry</p>
                                                <p className="text-[11px] text-rose-600/90 mt-0.5 leading-normal">
                                                    You must open a cash till session before accepting any Cash payments from student bill ledgers.
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">
                                            Open registry initiates the digital cashier till tracking for correct payment reconciliation.
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 pt-4 border-t flex flex-col gap-2">
                                {activeTill ? (
                                    <Button asChild className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-xs">
                                        <a href="/dashboard/accounts/cash-till" className="flex items-center justify-center gap-2 cursor-pointer">
                                            Open Till Dashboard <ArrowUpRight className="h-4 w-4" />
                                        </a>
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={handleOpenTill} 
                                        disabled={isOpeningTill || isLoadingTills}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 text-xs"
                                    >
                                        {isOpeningTill ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Activating Register...
                                            </>
                                        ) : (
                                            <>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Open Active Till
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </div>
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



                                <Button
                                    variant="outline"
                                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-sm font-semibold"
                                    onClick={() => setParentLettersOpen(true)}
                                >
                                    <Printer className="mr-2 h-4 w-4" /> Parent Debt Letters
                                </Button>

                                <Button
                                    variant="outline"
                                    className="border-rose-200 text-rose-700 hover:bg-rose-50 shadow-sm font-semibold"
                                    onClick={() => setPrintDebtorsOpen(true)}
                                >
                                    <Printer className="mr-2 h-4 w-4" /> Print Debtors
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
                            <div className="bg-blue-50/30 p-5 rounded-2xl border border-blue-100 mb-6 shadow-sm animate-in slide-in-from-top-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <PlusCircle className="h-5 w-5 text-blue-600" />
                                    <h3 className="font-bold text-blue-900 text-sm">Create Single Custom Bill</h3>
                                </div>
                                <FinancialRecordForm setOpen={() => setActiveForm(null)} students={students || []} classes={classes || []} schoolId={schoolId} onRecordAdded={forceRefetch} />
                            </div>
                        )}
                        
                        {activeForm === 'bulk' && schoolId && (
                            <div className="bg-indigo-50/30 p-5 rounded-2xl border border-indigo-100 mb-6 shadow-sm animate-in slide-in-from-top-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <FileCog className="h-5 w-5 text-indigo-600" />
                                    <h3 className="font-bold text-indigo-900 text-sm">{"Bulk Class Billing Setup (Tuition / Levies)"}</h3>
                                </div>
                                <BulkBillingForm setOpen={() => setActiveForm(null)} classes={classes || []} students={students || []} schoolId={schoolId} onRecordsAdded={forceRefetch} />
                            </div>
                        )}

                        {activeForm === 'termly-transport' && schoolId && (
                            <div className="bg-amber-50/30 p-5 rounded-2xl border border-amber-100 mb-6 shadow-sm animate-in slide-in-from-top-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <BusIcon className="h-5 w-5 text-amber-600" />
                                    <h3 className="font-bold text-amber-900 text-sm">Batch Bill Termly Transport Subscriptions</h3>
                                </div>
                                <TermlyTransportForm setOpen={() => setActiveForm(null)} classes={classes || []} students={students || []} schoolId={schoolId} onRecordsAdded={forceRefetch} />
                            </div>
                        )}

                        {activeForm === 'termly-canteen' && schoolId && (
                            <div className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-100 mb-6 shadow-sm animate-in slide-in-from-top-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <Utensils className="h-5 w-5 text-emerald-600" />
                                    <h3 className="font-bold text-emerald-900 text-sm">Batch Bill Termly Canteen Subscriptions</h3>
                                </div>
                                <TermlyCanteenForm setOpen={() => setActiveForm(null)} classes={classes || []} students={students || []} schoolId={schoolId} onRecordsAdded={forceRefetch} />
                            </div>
                        )}

                        {activeForm === 'levy' && schoolId && (
                            <div className="bg-orange-50/30 p-5 rounded-2xl border border-orange-100 mb-6 shadow-sm animate-in slide-in-from-top-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <HandCoins className="h-5 w-5 text-orange-600" />
                                    <h3 className="font-bold text-orange-950 text-sm">Generate Daily Attendance-based Charges (Manual)</h3>
                                </div>
                                <DailyChargeForm 
                                    setOpen={() => setActiveForm(null)} 
                                    classes={classes || []} 
                                    students={students || []} 
                                    schoolId={schoolId} 
                                    onRecordsAdded={forceRefetch} 
                                />
                            </div>
                        )}
                        
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
                            <div className="flex items-center gap-2 relative max-w-sm w-full">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <StudentSearchInput value={searchTerm} onChange={setSearchTerm} className="pl-8" placeholder="Search student by name or ID..." />
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">Global Date Filter:</span>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className={cn("w-full md:w-[280px] justify-start text-left font-normal text-xs", !globalDateRange && "text-muted-foreground")}>
                                            <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
                                            {globalDateRange?.from ? (
                                                globalDateRange.to ? (
                                                    <>{format(globalDateRange.from, "LLL dd, y")} - {format(globalDateRange.to, "LLL dd, y")}</>
                                                ) : (
                                                    format(globalDateRange.from, "LLL dd, y")
                                                )
                                            ) : (
                                                <span>Filter by Date Range</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="end">
                                        <Calendar initialFocus mode="range" defaultMonth={globalDateRange?.from} selected={globalDateRange} onSelect={setGlobalDateRange} numberOfMonths={2} />
                                    </PopoverContent>
                                </Popover>
                            </div>
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
                                                        globalDateRange={globalDateRange}
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
                                                    disabled={isProcessingReversal === r.id || role !== 'Director'}
                                                    onClick={() => handleRejectReversal(r)}
                                                >
                                                    {isProcessingReversal === r.id ? <Loader2 className="h-4 w-4 animate-spin"/> : "Reject"}
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    className="bg-red-600 hover:bg-red-700"
                                                    disabled={isProcessingReversal === r.id || role !== 'Director'}
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

                 <Card>
                    <CardHeader>
                        <CardTitle className="text-slate-800">Fees Waiver Approvals</CardTitle>
                        <CardDescription>
                            Review and authorize waiver requests submitted by the Accountant.
                            {role !== 'Director' && <span className="text-red-500 font-bold block mt-1 text-[11px] uppercase tracking-wider">⚠️ Action locked: Only the Director can approve waivers.</span>}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                          <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Requested Waiver</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Requested By</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingWaivers && pendingWaivers.map((w: any) => (
                                    <TableRow key={w.id}>
                                        <TableCell className="font-bold">{w.studentName}</TableCell>
                                        <TableCell className="text-sm">{w.recordDescription}</TableCell>
                                        <TableCell className="font-mono font-bold text-indigo-650">GH₵{w.requestedAmount.toFixed(2)}</TableCell>
                                        <TableCell className="max-w-xs italic text-xs">{w.reason}</TableCell>
                                        <TableCell className="text-xs">{w.requestedByName || 'Accountant'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="outline" 
                                                    className="text-red-650 hover:bg-red-50" 
                                                    disabled={isProcessingWaiver === w.id || role !== 'Director'}
                                                    onClick={() => handleRejectWaiver(w)}
                                                >
                                                    {isProcessingWaiver === w.id ? <Loader2 className="h-4 w-4 animate-spin"/> : "Reject"}
                                                </Button>
                                                <Button 
                                                    size="sm" 
                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                                                    disabled={isProcessingWaiver === w.id || role !== 'Director'}
                                                    onClick={() => handleApproveWaiver(w)}
                                                >
                                                    {isProcessingWaiver === w.id ? <Loader2 className="h-4 w-4 animate-spin"/> : "Approve"}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {(!pendingWaivers || pendingWaivers.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground italic">
                                            No pending waiver requests.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                          </Table>
                    </CardContent>
                 </Card>
             </TabsContent>
             <TabsContent value="sponsors" className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Sponsors & NGO Registry</h2>
                        <p className="text-sm text-slate-500 mt-1">Configure external sponsors and track deferred outstanding student balances against termly budgets.</p>
                    </div>
                    <Button onClick={() => {
                        setEditingSponsor(null);
                        setSponsorForm({ name: '', contactPerson: '', phone: '', email: '', budgetLimit: 0 });
                        setIsSponsorDialogOpen(true);
                    }}>
                        <PlusCircle className="h-4 w-4 mr-2" /> Add New Sponsor
                    </Button>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Sponsor / NGO Name</TableHead>
                                        <TableHead>Contact Details</TableHead>
                                        <TableHead className="text-center">Sponsored Students</TableHead>
                                        <TableHead className="text-right">Termly Budget Limit</TableHead>
                                        <TableHead className="text-right">Total Outstanding Balance</TableHead>
                                        <TableHead className="text-center">Budget Utilization</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sponsorsWithBalances.map((sp: any) => {
                                        const utilization = sp.budgetLimit > 0 ? Math.min(100, Math.round((sp.outstanding / sp.budgetLimit) * 100)) : 0;
                                        const limitExceeded = sp.outstanding > sp.budgetLimit && sp.budgetLimit > 0;
                                        return (
                                            <TableRow key={sp.id}>
                                                <TableCell className="font-bold text-slate-800">
                                                    <div className="flex flex-col">
                                                        <span>{sp.name}</span>
                                                        {limitExceeded && (
                                                            <span className="text-[10px] text-rose-600 font-extrabold uppercase mt-1 flex items-center gap-1 animate-pulse">
                                                                <AlertTriangle className="h-3 w-3" /> Budget Limit Exceeded
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs">
                                                    <div className="flex flex-col gap-0.5 text-slate-600">
                                                        {sp.contactPerson && <span className="font-medium text-slate-800">{sp.contactPerson}</span>}
                                                        {sp.phone && <span>Phone: {sp.phone}</span>}
                                                        {sp.email && <span>Email: {sp.email}</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {sp.sponsoredCount > 0 ? (
                                                        <Button 
                                                            variant="link" 
                                                            onClick={() => setSelectedSponsorIdForStudents(sp.id)}
                                                            className="font-bold text-indigo-650 hover:text-indigo-800 p-0 underline"
                                                        >
                                                            {sp.sponsoredCount} students
                                                        </Button>
                                                    ) : (
                                                        <span className="font-bold text-slate-400">0</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-mono font-bold text-slate-700">GH₵{sp.budgetLimit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                                <TableCell className="text-right font-mono font-black text-indigo-700">GH₵{sp.outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                                                <TableCell className="max-w-[150px]">
                                                    <div className="flex flex-col gap-1 px-4">
                                                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                                            <span>{utilization}%</span>
                                                            {sp.budgetLimit > 0 && <span>Limit: GH₵{Math.round(sp.budgetLimit)}</span>}
                                                        </div>
                                                        <Progress 
                                                            value={utilization} 
                                                            className={cn(
                                                                "h-2", 
                                                                limitExceeded ? "bg-rose-100 [&>[data-state=checked]]:bg-rose-600 animate-pulse" : "bg-slate-100 [&>[data-state=checked]]:bg-indigo-600"
                                                            )} 
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <Button variant="ghost" size="icon" onClick={() => {
                                                            setEditingSponsor(sp);
                                                            setSponsorForm({
                                                                name: sp.name,
                                                                contactPerson: sp.contactPerson || '',
                                                                phone: sp.phone || '',
                                                                email: sp.email || '',
                                                                budgetLimit: sp.budgetLimit || 0
                                                            });
                                                            setIsSponsorDialogOpen(true);
                                                        }}>
                                                            <Edit className="h-4 w-4 text-blue-600" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={async () => {
                                                            if (sp.outstanding > 0.01) {
                                                                toast({
                                                                    variant: 'destructive',
                                                                    title: 'Cannot Delete',
                                                                    description: 'This sponsor has outstanding bills of GH₵' + sp.outstanding.toFixed(2) + '. You cannot delete a sponsor with active financial liabilities.'
                                                                });
                                                                return;
                                                            }
                                                            if (sp.hasBills) {
                                                                toast({
                                                                    variant: 'destructive',
                                                                    title: 'Cannot Delete',
                                                                    description: 'This sponsor has historical billing records associated with their sponsored students. Deleting them would violate audit trails.'
                                                                });
                                                                return;
                                                            }
                                                            if (sp.sponsoredCount > 0) {
                                                                toast({
                                                                    variant: 'destructive',
                                                                    title: 'Cannot Delete',
                                                                    description: 'This sponsor is currently assigned to ' + sp.sponsoredCount + ' students. Unlink them first.'
                                                                });
                                                                return;
                                                            }
                                                            if (confirm('Are you sure you want to delete sponsor ' + sp.name + '?')) {
                                                                try {
                                                                    await deleteDoc(doc(firestore!, 'sponsors', sp.id));
                                                                    toast({ title: 'Deleted', description: 'Sponsor deleted successfully.' });
                                                                    if (refetchSponsors) refetchSponsors();
                                                                } catch (e: any) {
                                                                    toast({ variant: 'destructive', title: 'Error', description: e.message });
                                                                }
                                                            }
                                                        }}>
                                                            <Trash2 className="h-4 w-4 text-rose-600" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {sponsorsWithBalances.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-20 text-slate-400 italic text-xs uppercase tracking-wider font-bold">
                                                No Sponsors or NGOs registered. Click 'Add New Sponsor' to begin.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <Dialog open={isSponsorDialogOpen} onOpenChange={setIsSponsorDialogOpen}>
                    <DialogContent className="sm:max-w-[450px]">
                        <DialogHeader>
                            <DialogTitle>{editingSponsor ? 'Edit Sponsor Details' : 'Register New Sponsor'}</DialogTitle>
                            <DialogDescription>Add a new sponsor to the master registry to manage deferred student billing.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            if (!firestore || !schoolId) return;
                            setIsSavingSponsor(true);
                            try {
                                if (editingSponsor) {
                                    await updateDoc(doc(firestore, 'sponsors', editingSponsor.id), {
                                        ...sponsorForm,
                                        budgetLimit: Number(sponsorForm.budgetLimit) || 0,
                                        updatedAt: serverTimestamp()
                                    });
                                    toast({ title: 'Updated', description: 'Sponsor details saved successfully.' });
                                } else {
                                    const newSponsorRef = doc(collection(firestore, 'sponsors'));
                                    await setDoc(newSponsorRef, {
                                        id: newSponsorRef.id,
                                        ...sponsorForm,
                                        budgetLimit: Number(sponsorForm.budgetLimit) || 0,
                                        schoolId,
                                        createdAt: serverTimestamp()
                                    });
                                    toast({ title: 'Registered', description: 'New sponsor created successfully.' });
                                }
                                setIsSponsorDialogOpen(false);
                                if (refetchSponsors) refetchSponsors();
                            } catch (error: any) {
                                toast({ variant: 'destructive', title: 'Error', description: error.message });
                            } finally {
                                setIsSavingSponsor(false);
                            }
                        }} className="space-y-4 py-2">
                            <div className="space-y-1">
                                <Label>Sponsor / NGO Name *</Label>
                                <Input 
                                    required
                                    value={sponsorForm.name}
                                    onChange={e => setSponsorForm({...sponsorForm, name: e.target.value})}
                                    placeholder="e.g. Save the Children, Compassion Intl"
                                    className="bg-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Contact Person</Label>
                                <Input 
                                    value={sponsorForm.contactPerson}
                                    onChange={e => setSponsorForm({...sponsorForm, contactPerson: e.target.value})}
                                    placeholder="e.g. James Gambrah"
                                    className="bg-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label>Phone Number</Label>
                                    <Input 
                                        value={sponsorForm.phone}
                                        onChange={e => setSponsorForm({...sponsorForm, phone: e.target.value})}
                                        placeholder="e.g. +23324..."
                                        className="bg-white"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Email Address</Label>
                                    <Input 
                                        type="email"
                                        value={sponsorForm.email}
                                        onChange={e => setSponsorForm({...sponsorForm, email: e.target.value})}
                                        placeholder="e.g. contact@ngo.org"
                                        className="bg-white"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Termly Budget / Credit Limit (GH₵) *</Label>
                                <Input 
                                    type="number"
                                    required
                                    value={sponsorForm.budgetLimit}
                                    onChange={e => setSponsorForm({...sponsorForm, budgetLimit: parseFloat(e.target.value) || 0})}
                                    placeholder="e.g. 10000"
                                    className="bg-white"
                                />
                                <span className="text-[10px] text-slate-400">Sets the maximum limit of sponsored outstanding fees allowed for this term.</span>
                            </div>
                            <DialogFooter className="pt-4 border-t">
                                <Button type="submit" className="w-full" disabled={isSavingSponsor}>
                                    {isSavingSponsor ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                    {editingSponsor ? 'Save Details' : 'Register Sponsor'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </TabsContent>
        </Tabs>

        {dialogState.record && dialogState.type === 'payment' && (
            <RecordPaymentDialog record={dialogState.record} open={true} setOpen={() => setDialogState({type:'payment', record: null})} onUpdate={forceRefetch} />
        )}
        {dialogState.record && dialogState.type === 'waiver' && (
            <ApplyWaiverDialog record={dialogState.record} open={true} setOpen={() => setDialogState({type:'waiver', record: null})} onUpdate={forceRefetch} />
        )}
        {dialogState.record && dialogState.type === 'reversal' && (
            <ReversalRequestDialog record={dialogState.record} activeTill={activeTill} open={true} setOpen={() => setDialogState({type:'reversal', record: null})} onUpdate={forceRefetch} />
        )}
        {editingRecord && (
            <EditRecordDialog record={editingRecord} open={true} setOpen={() => setEditingRecord(null)} onUpdate={forceRefetch} />
        )}
        {selectedSponsorIdForStudents && (
            <Dialog open={true} onOpenChange={(open) => !open && setSelectedSponsorIdForStudents(null)}>
                <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold">
                            <Users className="h-5 w-5 text-indigo-650" />
                            {selectedSponsor?.name} - Sponsored Student Invoices
                        </DialogTitle>
                        <DialogDescription>
                            Itemized breakdown of fees and outstanding balances for all students sponsored by this organization.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {/* Quick metrics */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-slate-50 border p-3 rounded-xl">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Total Ward(s)</span>
                                <p className="text-xl font-extrabold text-slate-800 mt-1">{sponsoredStudentsBreakdown.length}</p>
                            </div>
                            <div className="bg-slate-50 border p-3 rounded-xl">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Total Budget Limit</span>
                                <p className="text-xl font-extrabold text-slate-800 mt-1">GH₵{selectedSponsor?.budgetLimit.toLocaleString()}</p>
                            </div>
                            <div className="bg-slate-50 border p-3 rounded-xl border-indigo-100 bg-indigo-50/20">
                                <span className="text-[10px] font-bold text-indigo-500 uppercase">Grand Outstanding Total</span>
                                <p className="text-xl font-black text-indigo-700 mt-1 font-mono">GH₵{sponsoredStudentsBreakdown.reduce((sum, s) => sum + s.total, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>

                        {/* Students breakdown table */}
                        <div className="border rounded-lg overflow-hidden bg-white">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Student ID</TableHead>
                                        <TableHead>Student Name</TableHead>
                                        <TableHead>Class</TableHead>
                                        <TableHead className="text-right">Tuition</TableHead>
                                        <TableHead className="text-right">Canteen</TableHead>
                                        <TableHead className="text-right">Transport</TableHead>
                                        <TableHead className="text-right">Other</TableHead>
                                        <TableHead className="text-right">Total Owed</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sponsoredStudentsBreakdown.map((s) => (
                                        <TableRow key={s.student.uid}>
                                            <TableCell className="font-mono text-xs">{s.student.studentId || 'ID Pending'}</TableCell>
                                            <TableCell className="font-bold text-slate-800">{s.student.firstName} {s.student.lastName}</TableCell>
                                            <TableCell className="text-xs font-semibold text-slate-500">{s.className}</TableCell>
                                            <TableCell className="text-right font-mono text-xs">GH₵{s.tuition.toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-mono text-xs">GH₵{s.canteen.toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-mono text-xs">GH₵{s.transport.toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-mono text-xs">GH₵{s.other.toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-bold font-mono text-indigo-650 text-xs">GH₵{s.total.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                    {sponsoredStudentsBreakdown.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-10 text-slate-400 italic text-xs uppercase tracking-wider font-bold">
                                                No students are currently linked to this sponsor.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t mt-2">
                        <Button variant="outline" onClick={() => setSelectedSponsorIdForStudents(null)}>Close</Button>
                        <Button 
                            disabled={sponsoredStudentsBreakdown.length === 0}
                            onClick={() => {
                                setSelectedSponsorIdForPrint(selectedSponsor.id);
                                setActivePrintType('sponsor-statement');
                                setTimeout(() => {
                                    window.print();
                                }, 150);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700"
                        >
                            <Printer className="mr-2 h-4 w-4" /> Print Sponsor Statement Invoice
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )}
        {activePrintType === 'sponsor-statement' && (
            <SponsorStatementPrintArea 
                sponsorId={selectedSponsorIdForPrint}
                sponsorsList={sponsorsList}
                students={students}
                classes={classes || []}
                records={records}
                schoolName={schoolName}
                schoolProfile={schoolProfile}
            />
        )}
        <PrintDebtorsDialog 
            open={printDebtorsOpen} 
            setOpen={setPrintDebtorsOpen} 
            classes={classes || []} 
            printMode={printMode}
            setPrintMode={setPrintMode}
            selectedClassId={selectedClassId}
            setSelectedClassId={setSelectedClassId}
            minDebt={minDebt}
            setMinDebt={setMinDebt}
            debtorsCount={debtors.length}
            classDebtorsCount={(classGroupedDebtors[selectedClassId] || []).length}
            totalSum={debtors.reduce((sum, d) => sum + d.balance, 0)}
            onPrint={handlePrintDebtorsList}
        />


        <ParentDemandLettersDialog
            open={parentLettersOpen}
            setOpen={setParentLettersOpen}
            parents={parents || []}
            students={students || []}
            classes={classes || []}
            records={records || []}
            isSending={false}
            onPrint={handlePrintParentLetter}
        />

        {activePrintType === 'parent-letter' && (
          <ParentLetterPrintArea
            parentId={selectedParentIdForPrint}
            parents={parents || []}
            students={students || []}
            classes={classes || []}
            records={records || []}
            schoolProfile={schoolProfile}
          />
        )}

        {activePrintType === 'debtors-list' && (
          <div id="debtors-print-area" className="hidden print:block text-black bg-white w-full">
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                html, body {
                  height: auto !important;
                  min-height: 0 !important;
                  max-height: none !important;
                  overflow: hidden !important;
                  background: white !important;
                  color: black !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  scrollbar-width: none !important;
                  -ms-overflow-style: none !important;
                }

                ::-webkit-scrollbar {
                  display: none !important;
                  width: 0 !important;
                  height: 0 !important;
                }

                /* Hide all interactive app elements and portal dialogs */
                aside, nav, header, footer, button, [role="dialog"], [data-radix-portal], .fixed.inset-0 {
                  display: none !important;
                  height: 0 !important;
                  width: 0 !important;
                  overflow: hidden !important;
                  visibility: hidden !important;
                }

                /* Reset parent layouts to block / natural flow and remove margins */
                div.flex.h-screen {
                  display: block !important;
                  height: auto !important;
                  min-height: 0 !important;
                  max-height: none !important;
                  overflow: hidden !important;
                  position: static !important;
                }

                div.flex.flex-1.flex-col {
                  display: block !important;
                  margin-left: 0 !important;
                  padding-left: 0 !important;
                  height: auto !important;
                  min-height: 0 !important;
                  max-height: none !important;
                  overflow: hidden !important;
                  position: static !important;
                }

                main {
                  display: block !important;
                  height: auto !important;
                  min-height: 0 !important;
                  max-height: none !important;
                  overflow: hidden !important;
                  position: static !important;
                  padding: 0 !important;
                  margin: 0 !important;
                }

                div.p-4.md\:p-8,
                div.pb-24,
                div.space-y-6.accounts-page-container {
                  display: block !important;
                  height: auto !important;
                  min-height: 0 !important;
                  max-height: none !important;
                  overflow: visible !important;
                  position: static !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  border: none !important;
                  box-shadow: none !important;
                }

                /* Hide other elements inside accounts-page-container except print area */
                .accounts-page-container > *:not(#debtors-print-area) {
                  display: none !important;
                }

                #debtors-print-area {
                  display: block !important;
                  visibility: visible !important;
                  position: static !important;
                  width: 100% !important;
                  height: auto !important;
                  overflow: visible !important;
                  background: white !important;
                  color: black !important;
                  margin: 0 !important;
                  padding: 0 !important;
                }

                .page-break {
                  page-break-after: always !important;
                  break-after: page !important;
                  height: 0 !important;
                  overflow: hidden !important;
                }

                table {
                  width: 100% !important;
                  border-collapse: collapse !important;
                  table-layout: fixed !important;
                  margin-top: 10px !important;
                }

                tr {
                  page-break-inside: avoid !important;
                }

                th, td {
                  font-size: 12px !important;
                  padding: 6px 6px !important;
                  border: 1px solid #1e293b !important;
                  word-wrap: break-word !important;
                  overflow: hidden !important;
                }

                th {
                  font-size: 13px !important;
                  background-color: #cbd5e1 !important;
                  color: #0f172a !important;
                  font-weight: 800 !important;
                }

                /* Make student name bold and highly readable */
                td:nth-child(2) {
                  font-size: 12px !important;
                  font-weight: 700 !important;
                  color: #0f172a !important;
                }

                /* Make financial numbers columns bold and clear */
                td.text-right {
                  font-weight: 700 !important;
                  font-size: 12.5px !important;
                  color: #1e293b !important;
                }

                /* Highlight outstanding total balance column with rose color and soft background */
                td.text-right:last-child {
                  font-weight: 900 !important;
                  font-size: 14px !important;
                  color: #be123c !important;
                  background-color: #fff1f2 !important;
                }

                /* Sizing and visibility overrides for headings */
                h1 {
                  font-size: 26px !important;
                  font-weight: 900 !important;
                  color: #0f172a !important;
                }
                h2 {
                  font-size: 18px !important;
                  font-weight: 800 !important;
                  color: #1e293b !important;
                }
                h3 {
                  font-size: 15px !important;
                  font-weight: 800 !important;
                  color: #0f172a !important;
                }

                /* Meta data info box at top of class sheet */
                .p-4.bg-slate-50 {
                  background-color: #f8fafc !important;
                  border: 2px solid #94a3b8 !important;
                  font-size: 12px !important;
                }
                .p-4.bg-slate-50 span {
                  font-weight: 800 !important;
                }

                .col-id { width: 14% !important; }
                .col-name { width: 22% !important; }
                .col-fee { width: 12% !important; }
                .col-total { width: 16% !important; }

                @page {
                  size: A4 portrait;
                  margin: 0.4in !important;
                }
              }
            `}} />

            {printMode === 'whole-school-grouped' ? (
              <div className="space-y-6">
                <div className="border-b-4 border-slate-900 pb-4 text-center">
                  <h1 className="text-2xl font-black uppercase tracking-tight">{schoolName}</h1>
                  <h2 className="text-lg font-extrabold uppercase tracking-wide text-slate-700 mt-1">Whole School Debtors List Report</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase mt-1">Generated: {format(new Date(), 'PPpp')}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 text-sm border-b mb-4">
                  <div className="border p-3 rounded-lg text-center bg-slate-50">
                    <p className="text-xs font-bold text-slate-500 uppercase">Total School Debtors</p>
                    <p className="text-xl font-extrabold text-slate-800 mt-1">{debtors.length}</p>
                  </div>
                  <div className="border p-3 rounded-lg text-center bg-slate-50">
                    <p className="text-xs font-bold text-slate-500 uppercase">Total Outstanding Sum</p>
                    <p className="text-xl font-extrabold text-rose-600 mt-1">GH₵{debtors.reduce((sum, d) => sum + d.balance, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>

                <div className="space-y-8">
                  {classesToPrint?.map(c => {
                    if (!c) return null;
                    const classDebtors = classGroupedDebtors[c.id] || [];
                    if (classDebtors.length === 0) return null;

                    return (
                      <div key={c.id} className="space-y-3">
                        <div className="bg-slate-100 p-2 rounded-lg border flex justify-between items-center">
                          <h3 className="font-extrabold text-sm uppercase text-slate-800">{c.name}</h3>
                          <span className="text-xs font-bold text-slate-650 font-mono">
                            {classDebtors.length} debtors | Total: GH₵{classDebtors.reduce((sum, d) => sum + d.balance, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>

                        <table>
                          <thead>
                            <tr>
                              <th className="col-id text-left">Student ID</th>
                              <th className="col-name text-left">Name</th>
                              <th className="col-fee text-right">Tuition</th>
                              <th className="col-fee text-right">Canteen</th>
                              <th className="col-fee text-right">Transport</th>
                              <th className="col-fee text-right">Other</th>
                              <th className="col-total text-right">Total Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {classDebtors.map(d => (
                              <tr key={d.student.uid}>
                                <td className="font-mono text-left">{d.student.studentId || 'ID Pending'}</td>
                                <td className="font-bold text-left">{d.student.firstName} {d.student.lastName}</td>
                                <td className="text-right font-mono">GH₵{d.breakdown.tuition.toFixed(2)}</td>
                                <td className="text-right font-mono">GH₵{d.breakdown.canteen.toFixed(2)}</td>
                                <td className="text-right font-mono">GH₵{d.breakdown.transport.toFixed(2)}</td>
                                <td className="text-right font-mono">GH₵{d.breakdown.other.toFixed(2)}</td>
                                <td className="text-right font-bold font-mono text-rose-600">GH₵{d.balance.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-8 pt-12 text-center text-xs">
                  <div>
                    <div className="border-b border-slate-400 h-8 max-w-[220px] mx-auto"></div>
                    <p className="font-bold text-slate-500 mt-2 uppercase text-[10px]">Accounts Officer Signature</p>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 h-8 max-w-[220px] mx-auto"></div>
                    <p className="font-bold text-slate-500 mt-2 uppercase text-[10px]">Headmaster / Director Approval</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {classesToPrint?.map((c, index) => {
                  if (!c) return null;
                  const classDebtors = classGroupedDebtors[c.id] || [];
                  if (classDebtors.length === 0) return null;

                  const classTotal = classDebtors.reduce((sum, d) => sum + d.balance, 0);

                  return (
                    <div key={c.id} className={cn("space-y-6", index < classesToPrint.length - 1 && "page-break")}>
                      <div className="border-b-4 border-slate-900 pb-4 text-center">
                        <h1 className="text-2xl font-black uppercase tracking-tight">{schoolName}</h1>
                        <h2 className="text-lg font-extrabold uppercase tracking-wide text-slate-700 mt-1">Class Debtors Collection Sheet</h2>
                        <h3 className="text-base font-black text-rose-600 uppercase tracking-wider mt-1">Class Target: {c.name}</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase mt-1">Printed Date: {format(new Date(), 'PP')}</p>
                      </div>

                      <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-xl grid grid-cols-2 gap-4 text-xs font-bold text-slate-700 uppercase">
                        <div>Class: <span className="font-extrabold text-slate-900">{c.name}</span></div>
                        <div className="text-right">Debtors Owed: <span className="font-extrabold text-slate-900">{classDebtors.length} ward(s)</span></div>
                        <div className="col-span-2 text-center border-t pt-2 mt-2 text-sm text-rose-700 font-black">
                          Total Class Deficit Owed: GH₵{classTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      <table>
                        <thead>
                          <tr>
                            <th className="col-id text-left">Student ID</th>
                            <th className="col-name text-left">Student Name</th>
                            <th className="col-fee text-right">Tuition</th>
                            <th className="col-fee text-right">Canteen</th>
                            <th className="col-fee text-right">Transport</th>
                            <th className="col-fee text-right">Other</th>
                            <th className="col-total text-right">Total Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {classDebtors.map(d => (
                            <tr key={d.student.uid}>
                              <td className="font-mono text-left">{d.student.studentId || 'ID Pending'}</td>
                              <td className="font-black text-slate-800 text-left">{d.student.firstName} {d.student.lastName}</td>
                              <td className="text-right font-mono">GH₵{d.breakdown.tuition.toFixed(2)}</td>
                              <td className="text-right font-mono">GH₵{d.breakdown.canteen.toFixed(2)}</td>
                              <td className="text-right font-mono">GH₵{d.breakdown.transport.toFixed(2)}</td>
                              <td className="text-right font-mono">GH₵{d.breakdown.other.toFixed(2)}</td>
                              <td className="text-right font-black font-mono text-rose-600 text-[11px]">GH₵{d.balance.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="pt-4 text-[10px] text-slate-400 leading-normal italic">
                        Notice to Class Teacher: Please check receipts or online portals for payments recorded after the printed date before enforcing balance reminders.
                      </div>

                      <div className="grid grid-cols-2 gap-8 pt-10 text-center text-xs">
                        <div>
                          <div className="border-b border-slate-400 h-8 max-w-[200px] mx-auto"></div>
                          <p className="font-bold text-slate-500 mt-2 uppercase text-[9px]">Class Teacher Signature</p>
                        </div>
                        <div>
                          <div className="border-b border-slate-400 h-8 max-w-[200px] mx-auto"></div>
                          <p className="font-bold text-slate-500 mt-2 uppercase text-[9px]">Authorized Finance Auditor</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
    </div>
  );
}
