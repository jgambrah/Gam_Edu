
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
import { useState, useEffect, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { collection, doc, setDoc, writeBatch, query, where, getDocs, serverTimestamp, Timestamp, increment, getDoc } from 'firebase/firestore';
import { Loader2, PlusCircle, Trash2, FileText, Utensils, Bus, RefreshCw, Search, AlertCircle } from 'lucide-react';
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
interface MissingBillItem {
    id: string; // unique key for the row
    studentId: string;
    studentName: string;
    classId: string;
    type: 'Canteen' | 'Transport';
    amount: number;
    reason: string; // "Attended but no Canteen bill"
}

function ManualBillingReconciliation() {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [date, setDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [missingBills, setMissingBills] = useState<MissingBillItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]); // IDs of items to process

    const handleCheck = async () => {
        if (!firestore) return;
        setIsLoading(true);
        setMissingBills([]);
        setSelectedItems([]);

        try {
            // 1. Get Rates
            const canteenSnap = await getDoc(doc(firestore, 'schoolSettings', 'canteen'));
            const transportSnap = await getDoc(doc(firestore, 'schoolSettings', 'transport'));
            const canteenRate = canteenSnap.exists() ? Number(canteenSnap.data().dailyRate) : 0;
            const transportRate = transportSnap.exists() ? Number(transportSnap.data().dailyRate) : 0;

            const dateStr = format(date, 'yyyy-MM-dd');
            const searchDate = date; 
            searchDate.setHours(0,0,0,0); // Start of day normalization

            // 2. Get Attendance (Who was present?)
            const attendanceQ = query(
                collection(firestore, 'attendance'),
                where('date', '==', searchDate),
                where('status', 'in', ['Present', 'Late'])
            );
            const attendanceSnap = await getDocs(attendanceQ);
            
            // 3. Get Existing Bills for this Date (Who already paid?)
            const billsQ = query(
                collection(firestore, 'financialRecords'),
                where('dueDate', '==', searchDate) // Assuming dueDate = attendance date
            );
            const billsSnap = await getDocs(billsQ);
            const existingBillIds = new Set(billsSnap.docs.map(d => d.id));

            const detectedMissing: MissingBillItem[] = [];

            // 4. Compare
            for (const attDoc of attendanceSnap.docs) {
                const att = attDoc.data();
                
                // Check Canteen
                const canteenBillId = `canteen-${att.studentId}-${dateStr}`;
                if (canteenRate > 0 && !existingBillIds.has(canteenBillId)) {
                    detectedMissing.push({
                        id: canteenBillId,
                        studentId: att.studentId,
                        studentName: att.studentName || 'Unknown',
                        classId: att.classId,
                        type: 'Canteen',
                        amount: canteenRate,
                        reason: 'Present but no Canteen Fee found'
                    });
                }

                // Check Transport
                let usesBus = att.usesBusService === "true" || att.usesBusService === true;
                
                if (transportRate > 0 && usesBus) {
                    const transportBillId = `transport-${att.studentId}-${dateStr}`;
                    if (!existingBillIds.has(transportBillId)) {
                        detectedMissing.push({
                            id: transportBillId,
                            studentId: att.studentId,
                            studentName: att.studentName || 'Unknown',
                            classId: att.classId,
                            type: 'Transport',
                            amount: transportRate,
                            reason: 'Bus User Present but no Transport Fee found'
                        });
                    }
                }
            }

            setMissingBills(detectedMissing);
            if (detectedMissing.length === 0) {
                toast({ title: "All Clear", description: "No missing bills found for this date." });
            }

        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Error", description: "Failed to scan records." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleProcess = async () => {
        if (!firestore || selectedItems.length === 0) return;
        setIsLoading(true);
        const batch = writeBatch(firestore);
        
        const itemsToProcess = missingBills.filter(item => selectedItems.includes(item.id));
        
        itemsToProcess.forEach(item => {
            const ref = doc(firestore, 'financialRecords', item.id);
            batch.set(ref, {
                billedAmount: item.amount,
                studentId: item.studentId,
                studentName: item.studentName,
                classId: item.classId,
                type: item.type === 'Canteen' ? 'Canteen Fee' : 'Transport Fee',
                description: `${item.type} fee for ${format(date, 'PPP')} (Manual Fix)`,
                status: 'Unpaid',
                dueDate: date,
                createdAt: serverTimestamp(),
                amountPaid: 0,
            });
        });

        try {
            await batch.commit();
            toast({ title: "Success", description: `Generated ${itemsToProcess.length} missing bills.` });
            setMissingBills(prev => prev.filter(p => !selectedItems.includes(p.id)));
            setSelectedItems([]);
        } catch (e) {
            toast({ variant: 'destructive', title: "Error", description: "Failed to create bills." });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === missingBills.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(missingBills.map(m => m.id));
        }
    };

    return (
        <Card className="mt-6 border-orange-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                    <AlertCircle className="h-5 w-5"/> Missing Bill Detector
                </CardTitle>
                <CardDescription>
                    Scan a specific date to find students who attended school but were not billed correctly.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* Controls */}
                <div className="flex gap-4 items-end">
                    <div className="space-y-2">
                        <Label>Select Date to Audit</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button onClick={handleCheck} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>}
                        Scan for Errors
                    </Button>
                </div>

                {/* Results Table */}
                {missingBills.length > 0 && (
                    <div className="border rounded-lg p-4 space-y-4">
                         <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-orange-800">Found {missingBills.length} Missing Bills</h4>
                            <Button size="sm" onClick={handleProcess} disabled={isLoading || selectedItems.length === 0}>
                                Generate {selectedItems.length} Bills
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox 
                                            checked={selectedItems.length === missingBills.length && missingBills.length > 0}
                                            onCheckedChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Missing Fee</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Reason</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {missingBills.map((bill) => (
                                    <TableRow key={bill.id}>
                                        <TableCell>
                                            <Checkbox 
                                                checked={selectedItems.includes(bill.id)}
                                                onCheckedChange={(checked) => {
                                                    if(checked) setSelectedItems([...selectedItems, bill.id]);
                                                    else setSelectedItems(selectedItems.filter(id => id !== bill.id));
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{bill.studentName}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${bill.type === 'Canteen' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {bill.type}
                                            </span>
                                        </TableCell>
                                        <TableCell>GH₵{bill.amount.toFixed(2)}</TableCell>
                                        <TableCell className="text-muted-foreground text-xs">{bill.reason}</TableCell>
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

    