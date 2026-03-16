'use client';

import { useForm } from 'react-hook-form';
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
import { useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { collection, doc, setDoc, writeBatch, query, where, getDocs, serverTimestamp, getDoc, Timestamp } from 'firebase/firestore';
import { Loader2, Utensils, Bus, RefreshCw } from 'lucide-react';
import { useRole } from '@/context/role-context';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { format, startOfDay, endOfDay } from 'date-fns';
import { ManualBillingReconciliation } from '@/components/dashboard/finance/manual-billing-reconciliation';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const canteenRateSchema = z.object({
    dailyRate: z.coerce.number().min(0, "Rate must be a positive number.")
});

const transportRateSchema = z.object({
    dailyRate: z.coerce.number().min(0, "Rate must be a positive number.")
});


// --- Canteen Rate Settings Component ---
function CanteenSettings({ schoolId }: { schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const settingsRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen') : null, [firestore, schoolId]);
    const { data: canteenSettings, isLoading } = useDoc(settingsRef);

    const form = useForm<z.infer<typeof canteenRateSchema>>({
        resolver: zodResolver(canteenRateSchema),
        defaultValues: { dailyRate: 0 }
    });

    useEffect(() => {
        if (canteenSettings && typeof canteenSettings.dailyRate === 'number') {
            form.setValue('dailyRate', canteenSettings.dailyRate);
        }
    }, [canteenSettings, form]);

    const handleSave = (values: z.infer<typeof canteenRateSchema>) => {
        if (!firestore || !settingsRef) return;
        
        setIsSaving(true);
        const data = { dailyRate: values.dailyRate, updatedAt: serverTimestamp() };
        setDoc(settingsRef, data, { merge: true })
            .then(() => {
                toast({ title: 'Success', description: 'Canteen daily rate has been updated.' });
            })
            .catch(async (error) => {
                const permissionError = new FirestorePermissionError({
                    path: settingsRef.path,
                    operation: 'write',
                    requestResourceData: data,
                });
                errorEmitter.emit('permission-error', permissionError);
            })
            .finally(() => {
                setIsSaving(false);
            });
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
                                        <Input type="number" step="0.01" placeholder="e.g., 5.00" {...field} disabled={isLoading} />
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
function TransportSettings({ schoolId }: { schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const settingsRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId, 'rates', 'transport') : null, [firestore, schoolId]);
    const { data: transportSettings, isLoading } = useDoc(settingsRef);

    const form = useForm<z.infer<typeof transportRateSchema>>({
        resolver: zodResolver(transportRateSchema),
        defaultValues: { dailyRate: 0 }
    });

    useEffect(() => {
        if (transportSettings && typeof transportSettings.dailyRate === 'number') {
            form.setValue('dailyRate', transportSettings.dailyRate);
        }
    }, [transportSettings, form]);

    const handleSave = (values: z.infer<typeof transportRateSchema>) => {
        if (!firestore || !settingsRef) return;
        
        setIsSaving(true);
        const data = { dailyRate: values.dailyRate, updatedAt: serverTimestamp() };
        setDoc(settingsRef, data, { merge: true })
            .then(() => {
                toast({ title: 'Success', description: 'Transport daily rate has been updated.' });
            })
            .catch(async (error) => {
                const permissionError = new FirestorePermissionError({
                    path: settingsRef.path,
                    operation: 'write',
                    requestResourceData: data,
                });
                errorEmitter.emit('permission-error', permissionError);
            })
            .finally(() => {
                setIsSaving(false);
            });
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
                                        <Input type="number" step="0.01" placeholder="e.g., 10.00" {...field} disabled={isLoading} />
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
function RetrospectiveBilling({ schoolId }: { schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });
    
    const form = useForm();

    const handleReprocess = async () => {
        if (!firestore || !dateRange?.from || !schoolId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a valid date range.' });
            return;
        }
        setIsProcessing(true);
        toast({ title: "Reprocessing billing...", description: `Scanning attendance from ${format(dateRange.from, 'PPP')} to ${dateRange.to ? format(dateRange.to, 'PPP') : format(dateRange.from, 'PPP')}`});

        try {
            const start = startOfDay(dateRange.from);
            const end = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

            // 1. Fetch Global Canteen Rate
            const canteenSettingsSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen'));
            const canteenRate = canteenSettingsSnap.data()?.dailyRate || 0;

            // 2. Fetch ALL Transport Routes for this school to build a Rate Map
            const routesQuery = query(collection(firestore, 'routes'), where('schoolId', '==', schoolId));
            const routesSnap = await getDocs(routesQuery);
            const routeRatesMap = new Map<string, any>();
            routesSnap.docs.forEach(doc => {
                routeRatesMap.set(doc.id, doc.data());
            });

            // 3. Fetch Students to know their route and billing model
            const studentsQuery = query(collection(firestore, 'students'), where('schoolId', '==', schoolId));
            const studentsSnap = await getDocs(studentsQuery);
            const studentTransportMap = new Map<string, { usesBus: boolean, routeId: string, billingMode: string }>();

            studentsSnap.docs.forEach(doc => {
                const data = doc.data();
                studentTransportMap.set(doc.id, { 
                    usesBus: data.usesBusService === true, 
                    routeId: data.routeId || '',
                    billingMode: data.transportBillingModel || 'Daily'
                });
            });
            
            const attendanceQuery = query(
                collection(firestore, 'attendance'),
                where('schoolId', '==', schoolId),
                where('status', 'in', ['Present', 'Late'])
            );

            const attendanceSnapshot = await getDocs(attendanceQuery);
            let recordsToProcess = attendanceSnapshot.docs;
            
            recordsToProcess = recordsToProcess.filter(doc => {
                const data = doc.data();
                const date = data.date.toDate();
                return date >= start && date <= end;
            });

            if(recordsToProcess.length === 0) {
                toast({ title: 'Nothing to Process', description: 'No "Present" or "Late" records found.' });
                setIsProcessing(false);
                return;
            }
            
            const billingBatch = writeBatch(firestore);
            
            for (const attendanceDoc of recordsToProcess) {
                const record = attendanceDoc.data();
                const recordDate = record.date.toDate();
                const dateKey = format(recordDate, 'yyyy-MM-dd');
                const studentInfo = studentTransportMap.get(record.studentId);

                // A. Canteen Billing (Global Rate)
                if (canteenRate > 0) {
                    const canteenRecordId = `canteen-${record.studentId}-${dateKey}`;
                    const financialRecordRef = doc(firestore, 'financialRecords', canteenRecordId);
                    billingBatch.set(financialRecordRef, {
                        billedAmount: canteenRate,
                        studentId: record.studentId, 
                        studentName: record.studentName, 
                        classId: record.classId,
                        type: 'Canteen Fee', 
                        description: `Canteen - ${format(recordDate, 'PPP')}`, 
                        status: 'Unpaid', 
                        dueDate: Timestamp.fromDate(recordDate),
                        createdAt: serverTimestamp(), 
                        amountPaid: 0, 
                        schoolId,
                    }, { merge: true });
                }

                // B. Transport Billing (DYNAMIC ROUTE RATE & MODE CHECK)
                // ONLY bill daily if they use the bus AND their mode is 'Daily'
                if (studentInfo?.usesBus && studentInfo?.routeId && studentInfo?.billingMode === 'Daily') {
                    const specificTransportRate = routeRatesMap.get(studentInfo.routeId)?.dailyRate || 0;

                    if (specificTransportRate > 0) {
                        const transportRecordId = `transport-${record.studentId}-${dateKey}`;
                        const financialRecordRef = doc(firestore, 'financialRecords', transportRecordId);
                        
                        billingBatch.set(financialRecordRef, {
                            billedAmount: specificTransportRate,
                            studentId: record.studentId, 
                            studentName: record.studentName, 
                            classId: record.classId,
                            type: 'Transport Fee (Daily)', 
                            description: `Transport - ${format(recordDate, 'PPP')}`, 
                            status: 'Unpaid', 
                            dueDate: Timestamp.fromDate(recordDate),
                            createdAt: serverTimestamp(), 
                            amountPaid: 0, 
                            schoolId,
                        }, { merge: true });
                    }
                }
            }

            await billingBatch.commit();
            toast({ title: 'Success!', description: `Reprocessed billing for ${recordsToProcess.length} records.` });

        } catch (error: any) {
            console.error('Error reprocessing billing:', error);
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsProcessing(false);
        }
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><RefreshCw/> Retrospective Billing</CardTitle>
                <CardDescription>Recalculate and apply fees for a past date range.</CardDescription>
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
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
  
  if (!['Administrator', 'Director', 'Accountant'].includes(role || '')) {
    return <Card><CardHeader><CardTitle>Access Denied</CardTitle></CardHeader></Card>;
  }

  if (isLoadingSchool) {
      return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!schoolId) {
       return <Card><CardHeader><CardTitle>School Not Found</CardTitle></CardHeader></Card>;
  }

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold">Financial Settings</h1>
        <div className="grid lg:grid-cols-2 gap-6">
            <CanteenSettings schoolId={schoolId} />
            <TransportSettings schoolId={schoolId} />
        </div>
        <ManualBillingReconciliation schoolId={schoolId} />
        <RetrospectiveBilling schoolId={schoolId} />
    </div>
  );
}
