

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
import { collection, doc, setDoc, writeBatch, query, where, getDocs, serverTimestamp, Timestamp, increment } from 'firebase/firestore';
import { Loader2, PlusCircle, Trash2, FileText, Utensils, Bus, RefreshCw } from 'lucide-react';
import { PayrollSettings, payrollSettingsFormSchema } from '@/lib/types';
import { useRole } from '@/context/role-context';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { format, startOfDay, endOfDay, getYear, getMonth } from 'date-fns';
import { ManualBillingReconciliation } from '@/components/dashboard/finance/manual-billing-reconciliation';

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

    const form = useForm(); // Create a dummy form to provide context

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
                        type: 'Canteen Fee', description: `Canteen - ${format(recordDate, 'PPP')}`, status: 'Unpaid', dueDate: recordDate,
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
            <CardContent>
                <Form {...form}>
                    <form className="flex items-end gap-4">
                        <FormItem className="flex-1">
                            <FormLabel>Date Range</FormLabel>
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
                        </FormItem>
                        <Button type="button" onClick={handleReprocess} disabled={isProcessing}>
                            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            Reprocess
                        </Button>
                    </form>
                </Form>
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
