'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { collection, doc, setDoc, writeBatch, query, where, getDocs, serverTimestamp, Timestamp, increment, getDoc } from 'firebase/firestore';
import { Loader2, PlusCircle, Trash2, FileText, Utensils, Bus, RefreshCw } from 'lucide-react';
import { PayrollSettings, payrollSettingsFormSchema, Student, FinancialRecord, AttendanceRecord } from '@/lib/types';
import { useRole } from '@/context/role-context';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { format, startOfDay, endOfDay, getYear, getMonth } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const canteenRateSchema = z.object({
    dailyRate: z.coerce.number().min(0, "Rate must be a positive number.")
});

const transportRateSchema = z.object({
    dailyRate: z.coerce.number().min(0, "Rate must be a positive number.")
});


// --- Canteen Rate Settings Component ---
function CanteenSettings() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'schoolSettings', 'canteen') : null, [firestore]);
    const { data: canteenSettings, isLoading } = useDoc(settingsRef);

    const form = useForm<z.infer<typeof canteenRateSchema>>({
        resolver: zodResolver(canteenRateSchema),
        defaultValues: { dailyRate: 0 }
    });

    useEffect(() => {
        if (canteenSettings?.dailyRate) {
            form.setValue('dailyRate', canteenSettings.dailyRate);
        }
    }, [canteenSettings, form]);

    const handleSave = async (values: z.infer<typeof canteenRateSchema>) => {
        if (!firestore) return;
        
        setIsSaving(true);
        try {
            await setDoc(settingsRef, { dailyRate: values.dailyRate }, { merge: true });
            toast({ title: 'Success', description: 'Canteen daily rate has been updated.' });
        } catch (error) {
            console.error('Error saving canteen rate:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not save canteen settings.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Utensils /> Canteen Settings</CardTitle>
                <CardDescription>Set the daily fee for canteen usage, which will be billed automatically based on attendance.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="flex items-end gap-4">
                        <FormField
                            control={form.control}
                            name="dailyRate"
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormLabel>Daily Canteen Fee (GH₵)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 5.00" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSaving || isLoading}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Rate
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

// --- Transport Rate Settings Component ---
function TransportSettings() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'schoolSettings', 'transport') : null, [firestore]);
    const { data: transportSettings, isLoading } = useDoc(settingsRef);

    const form = useForm<z.infer<typeof transportRateSchema>>({
        resolver: zodResolver(transportRateSchema),
        defaultValues: { dailyRate: 0 }
    });

    useEffect(() => {
        if (transportSettings?.dailyRate) {
            form.setValue('dailyRate', transportSettings.dailyRate);
        }
    }, [transportSettings, form]);

    const handleSave = async (values: z.infer<typeof transportRateSchema>) => {
        if (!firestore) return;
        
        setIsSaving(true);
        try {
            await setDoc(settingsRef, { dailyRate: values.dailyRate }, { merge: true });
            toast({ title: 'Success', description: 'Transport daily rate has been updated.' });
        } catch (error) {
            console.error('Error saving transport rate:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not save transport settings.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bus /> Transport Settings</CardTitle>
                <CardDescription>Set the daily fee for bus usage, billed automatically for enrolled students on attendance.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="flex items-end gap-4">
                        <FormField
                            control={form.control}
                            name="dailyRate"
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormLabel>Daily Transport Fee (GH₵)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="e.g., 10.00" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSaving || isLoading}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Rate
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

// --- Retrospective Billing Component ---
function RetrospectiveBilling() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });

    const handleReprocess = async () => {
        if (!firestore || !dateRange?.from) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a valid date range.' });
            return;
        }
        setIsProcessing(true);
        toast({ title: "Reprocessing billing...", description: `Scanning attendance from ${format(dateRange.from, 'PPP')} to ${dateRange.to ? format(dateRange.to, 'PPP') : format(dateRange.from, 'PPP')}`});

        try {
            const start = startOfDay(dateRange.from);
            const end = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

            const canteenSettingsSnap = await getDoc(doc(firestore, 'schoolSettings', 'canteen'));
            const transportSettingsSnap = await getDoc(doc(firestore, 'schoolSettings', 'transport'));
            const canteenRate = canteenSettingsSnap.data()?.dailyRate || 0;
            const transportRate = transportSettingsSnap.data()?.dailyRate || 0;
            
            const attendanceQuery = query(
                collection(firestore, 'attendance'),
                where('date', '>=', Timestamp.fromDate(start)),
                where('date', '<=', Timestamp.fromDate(end)),
                where('status', 'in', ['Present', 'Late'])
            );

            const attendanceSnapshot = await getDocs(attendanceQuery);
            const recordsToProcess = attendanceSnapshot.docs;

            if(recordsToProcess.length === 0) {
                toast({ title: 'Nothing to Process', description: 'No "Present" or "Late" attendance records found in the selected range.' });
                setIsProcessing(false);
                return;
            }
            
            const billingBatch = writeBatch(firestore);
            let billsCount = 0;
            
            for (const attendanceDoc of recordsToProcess) {
                const record = attendanceDoc.data();
                let studentName = record.studentName;

                // FIX: If name is missing (legacy data), fetch it
                if (!studentName) {
                    try {
                        const studentDoc = await getDoc(doc(firestore, 'students', record.studentId));
                        if (studentDoc.exists()) {
                            studentName = `${studentDoc.data().firstName} ${studentDoc.data().lastName}`;
                        } else {
                            studentName = "Unknown Student";
                        }
                    } catch (e) { studentName = "Unknown Student"; }
                }

                const recordDate = record.date.toDate();
                const dateStr = format(recordDate, 'yyyy-MM-dd');

                if (canteenRate > 0) {
                    const canteenRecordId = `canteen-${record.studentId}-${dateStr}`;
                    const financialRecordRef = doc(firestore, 'financialRecords', canteenRecordId);
                    billingBatch.set(financialRecordRef, {
                        billedAmount: canteenRate,
                        studentId: record.studentId, studentName: studentName, classId: record.classId,
                        type: 'Canteen Fee', description: `Lunch for ${format(recordDate, 'PPP')}`, status: 'Unpaid', dueDate: recordDate,
                        createdAt: serverTimestamp(), amountPaid: 0,
                    }, { merge: true });
                    billsCount++;
                }

                if (transportRate > 0 && record.usesBusService) {
                     const transportRecordId = `transport-${record.studentId}-${dateStr}`;
                    const financialRecordRef = doc(firestore, 'financialRecords', transportRecordId);
                    billingBatch.set(financialRecordRef, {
                        billedAmount: transportRate,
                        studentId: record.studentId, studentName: studentName, classId: record.classId,
                        type: 'Transport Fee', description: `Transport - ${format(recordDate, 'PPP')}`, status: 'Unpaid', dueDate: recordDate,
                        createdAt: serverTimestamp(), amountPaid: 0,
                    }, { merge: true });
                    billsCount++;
                }
            }

            if (billsCount > 0) {
                await billingBatch.commit();
                toast({ title: 'Success!', description: `Reprocessed billing for ${recordsToProcess.length} attendance records.` });
            } else {
                 toast({ title: 'No Changes', description: 'No billable services found for the selected attendance records.' });
            }

        } catch (error: any) {
            console.error('Error reprocessing billing:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to reprocess billing.' });
        } finally {
            setIsProcessing(false);
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><RefreshCw/> Retrospective Billing</CardTitle>
                <CardDescription>Recalculate and apply fees for a past date range. Use this if rates have changed or if billing failed previously.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end gap-4">
                 <div className="flex-1">
                    <Label className="mb-2 block">Date Range</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange?.from ? (dateRange.to ? (<>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>) : (format(dateRange.from, "LLL dd, y"))) : (<span>Pick a date range</span>)}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                        </PopoverContent>
                    </Popover>
                 </div>
                 <Button onClick={handleReprocess} disabled={isProcessing}>
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                    Reprocess
                </Button>
            </CardContent>
        </Card>
    );
}

// --- NEW COMPONENT: Manual Billing Reconciliation ---
type MissingBill = {
    studentId: string;
    studentName: string;
    classId: string;
    missingCanteen: boolean;
    missingTransport: boolean;
};

function ManualBillingReconciliation() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [missingBills, setMissingBills] = useState<MissingBill[]>([]);
    const [selectedToBill, setSelectedToBill] = useState<Set<string>>(new Set());

    const handleCheck = async () => {
        if (!firestore || !selectedDate) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a date.' });
            return;
        }
        setIsLoading(true);
        setMissingBills([]);
        setSelectedToBill(new Set());

        try {
            const date = startOfDay(selectedDate);
            
            // Fetch all necessary data
            const attendanceQuery = query(collection(firestore, 'attendance'), where('date', '==', date), where('status', 'in', ['Present', 'Late']));
            const financialsQuery = query(collection(firestore, 'financialRecords'), where('dueDate', '==', date), where('type', 'in', ['Canteen Fee', 'Transport Fee']));
            const studentsQuery = collection(firestore, 'students');

            const [attSnap, finSnap, stuSnap] = await Promise.all([getDocs(attendanceQuery), getDocs(financialsQuery), getDocs(studentsQuery)]);

            const attendedRecords = attSnap.docs.map(d => d.data() as AttendanceRecord);
            const billedRecords = finSnap.docs.map(d => d.data() as FinancialRecord);
            const allStudents = stuSnap.docs.reduce((map, doc) => map.set(doc.id, doc.data() as Student), new Map<string, Student>());

            const billedCanteen = new Set(billedRecords.filter(r => r.type === 'Canteen Fee').map(r => r.studentId));
            const billedTransport = new Set(billedRecords.filter(r => r.type === 'Transport Fee').map(r => r.studentId));

            const missing: MissingBill[] = [];

            for (const attRecord of attendedRecords) {
                const student = allStudents.get(attRecord.studentId);
                if (!student) continue;

                const missCanteen = !billedCanteen.has(attRecord.studentId);
                const missTransport = student.usesBusService && !billedTransport.has(attRecord.studentId);

                if (missCanteen || missTransport) {
                    missing.push({
                        studentId: attRecord.studentId,
                        studentName: student.firstName + ' ' + student.lastName,
                        classId: student.classId,
                        missingCanteen: missCanteen,
                        missingTransport: missTransport,
                    });
                }
            }
            setMissingBills(missing);
            setSelectedToBill(new Set(missing.map(m => m.studentId))); // Select all by default
            toast({ title: 'Check Complete', description: `Found ${missing.length} students with missing bills.` });

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateBills = async () => {
        if (!firestore || !selectedDate || selectedToBill.size === 0) return;
        setIsLoading(true);

        try {
            const canteenSnap = await getDoc(doc(firestore, 'schoolSettings', 'canteen'));
            const transportSnap = await getDoc(doc(firestore, 'schoolSettings', 'transport'));
            const canteenRate = canteenSnap.data()?.dailyRate || 0;
            const transportRate = transportSnap.data()?.dailyRate || 0;

            const batch = writeBatch(firestore);
            const dateStr = format(selectedDate, 'yyyy-MM-dd');
            let billCount = 0;

            missingBills.forEach(bill => {
                if (selectedToBill.has(bill.studentId)) {
                    if (bill.missingCanteen && canteenRate > 0) {
                        const billRef = doc(firestore, 'financialRecords', `canteen-${bill.studentId}-${dateStr}`);
                        batch.set(billRef, {
                            studentId: bill.studentId, studentName: bill.studentName, classId: bill.classId,
                            type: 'Canteen Fee', description: `Lunch for ${dateStr}`, billedAmount: canteenRate,
                            status: 'Unpaid', dueDate: selectedDate, createdAt: serverTimestamp(), amountPaid: 0,
                        }, { merge: true });
                        billCount++;
                    }
                     if (bill.missingTransport && transportRate > 0) {
                        const billRef = doc(firestore, 'financialRecords', `transport-${bill.studentId}-${dateStr}`);
                        batch.set(billRef, {
                            studentId: bill.studentId, studentName: bill.studentName, classId: bill.classId,
                            type: 'Transport Fee', description: `Bus Ride for ${dateStr}`, billedAmount: transportRate,
                            status: 'Unpaid', dueDate: selectedDate, createdAt: serverTimestamp(), amountPaid: 0,
                        }, { merge: true });
                        billCount++;
                    }
                }
            });

            await batch.commit();
            toast({ title: 'Success', description: `${billCount} missing bills have been created.`});
            setMissingBills([]); // Clear list after successful billing
            setSelectedToBill(new Set());
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleStudentSelection = (studentId: string) => {
        const newSet = new Set(selectedToBill);
        if (newSet.has(studentId)) {
            newSet.delete(studentId);
        } else {
            newSet.add(studentId);
        }
        setSelectedToBill(newSet);
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText /> Manual Billing Reconciliation</CardTitle>
                <CardDescription>Find and create missing daily canteen or transport bills for a specific date if the automated system fails.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <Label>Date to Check</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-[280px] justify-start text-left font-normal", !selectedDate && "text-muted-foreground")} >
                                    <CalendarIcon className="mr-2 h-4 w-4" /> {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus /></PopoverContent>
                        </Popover>
                    </div>
                    <Button onClick={handleCheck} disabled={isLoading || !selectedDate}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Find Missing Bills
                    </Button>
                </div>
                 {missingBills.length > 0 && (
                    <div className="border rounded-lg p-4 space-y-4">
                         <div className="flex justify-between items-center">
                            <h4 className="font-semibold">{missingBills.length} student(s) with missing bills found.</h4>
                            <Button onClick={handleCreateBills} disabled={isLoading || selectedToBill.size === 0}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate {selectedToBill.size} Bill(s)
                            </Button>
                        </div>
                        <Table>
                            <TableHeader><TableRow><TableHead className="w-12"></TableHead><TableHead>Student</TableHead><TableHead>Missing Bill(s)</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {missingBills.map(bill => (
                                    <TableRow key={bill.studentId}>
                                        <TableCell><Checkbox checked={selectedToBill.has(bill.studentId)} onCheckedChange={() => toggleStudentSelection(bill.studentId)}/></TableCell>
                                        <TableCell>{bill.studentName}</TableCell>
                                        <TableCell className="space-x-2">
                                            {bill.missingCanteen && <Badge>Canteen</Badge>}
                                            {bill.missingTransport && <Badge>Transport</Badge>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}

export default function FinancialSettingsPage() {
  const { role } = useRole();
  
  if (!['Administrator', 'Director', 'Accountant'].includes(role)) {
    return <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is restricted.</CardDescription></CardHeader></Card>;
  }

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold">Financial Settings</h1>
        <div className="grid lg:grid-cols-2 gap-6">
            <CanteenSettings />
            <TransportSettings />
        </div>
        <ManualBillingReconciliation />
        <RetrospectiveBilling />
    </div>
  );
}
