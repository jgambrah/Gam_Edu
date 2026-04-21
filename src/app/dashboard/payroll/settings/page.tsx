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
import { useFirestore, useMemoFirebase, useDoc, useCollection } from '@/firebase';
import { collection, doc, setDoc, writeBatch, query, where, getDocs, serverTimestamp, getDoc, Timestamp } from 'firebase/firestore';
import { Loader2, Utensils, Bus, RefreshCw, ListChecks, CalendarRange } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Class } from '@/lib/types';

const canteenRateSchema = z.object({
    pricingModel: z.enum(['Flat', 'Class-Based']),
    dailyRate: z.coerce.number().min(0, "Rate must be a positive number."),
    termlyRate: z.coerce.number().min(0, "Rate must be a positive number.").optional(),
    classRates: z.record(z.string(), z.coerce.number().min(0)).optional(),
    classTermlyRates: z.record(z.string(), z.coerce.number().min(0)).optional()
});

const transportRateSchema = z.object({
    dailyRate: z.coerce.number().min(0, "Rate must be a positive number.")
});


// --- Canteen Rate Settings Component ---
function CanteenSettings({ schoolId }: { schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    // Fetch Classes for Class-Based pricing
    const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

    const settingsRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen') : null, [firestore, schoolId]);
    const { data: canteenSettings, isLoading: isLoadingSettings } = useDoc(settingsRef);

    const form = useForm<z.infer<typeof canteenRateSchema>>({
        resolver: zodResolver(canteenRateSchema),
        defaultValues: { 
            pricingModel: 'Flat',
            dailyRate: 0,
            termlyRate: 0,
            classRates: {},
            classTermlyRates: {}
        }
    });

    const pricingModel = form.watch('pricingModel');

    useEffect(() => {
        if (canteenSettings) {
            form.reset({
                pricingModel: canteenSettings.pricingModel || 'Flat',
                dailyRate: canteenSettings.dailyRate || 0,
                termlyRate: canteenSettings.termlyRate || 0,
                classRates: canteenSettings.classRates || {},
                classTermlyRates: canteenSettings.classTermlyRates || {}
            });
        }
    }, [canteenSettings, form]);

    const handleSave = async (values: z.infer<typeof canteenRateSchema>) => {
        if (!firestore || !settingsRef) return;
        
        setIsSaving(true);
        
        // Clean data for Firestore
        const data: any = {
            pricingModel: values.pricingModel,
            dailyRate: values.dailyRate || 0,
            termlyRate: values.termlyRate || 0,
            updatedAt: serverTimestamp()
        };

        if (values.classRates) data.classRates = values.classRates;
        if (values.classTermlyRates) data.classTermlyRates = values.classTermlyRates;
        
        try {
            await setDoc(settingsRef, data, { merge: true });
            toast({ title: 'Success', description: 'Canteen settings have been updated.' });
        } catch (error: any) {
            console.error("Save failed:", error);
            if (error.code === 'permission-denied') {
                const permissionError = new FirestorePermissionError({
                    path: settingsRef.path,
                    operation: 'write',
                    requestResourceData: data,
                });
                errorEmitter.emit('permission-error', permissionError);
            } else {
                toast({ variant: 'destructive', title: 'Error', description: error.message });
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="border-t-4 border-t-orange-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl"><Utensils className="text-orange-500"/> Canteen Billing Logic</CardTitle>
                <CardDescription>Configure how students are billed for meals (Daily vs Termly).</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="pricingModel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pricing Model</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white border-2">
                                                <SelectValue placeholder="Select model" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Flat">Flat Rate (Same for everyone)</SelectItem>
                                            <SelectItem value="Class-Based">Class-Based Rate (Custom by Grade)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="dailyRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Daily Fee (Flat) (GH₵)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} value={field.value ?? 0} className="h-12 border-2" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="termlyRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Termly Fee (Flat) (GH₵)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} value={field.value ?? 0} className="h-12 border-2" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {pricingModel === 'Class-Based' && (
                            <div className="space-y-4 border rounded-xl p-4 bg-slate-50 animate-in fade-in slide-in-from-top-2">
                                <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <ListChecks className="h-4 w-4"/> Define Class Rates
                                </h4>
                                {isLoadingClasses ? (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/> Loading classes...</div>
                                ) : (
                                    <div className="space-y-6">
                                        {classes?.map((c) => (
                                            <div key={c.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 border rounded-lg bg-white shadow-sm">
                                                <div className="md:col-span-2 text-xs font-black text-indigo-600 uppercase tracking-widest">{c.name}</div>
                                                <FormField
                                                    control={form.control}
                                                    name={`classRates.${c.id}`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-[10px] font-bold text-slate-500 uppercase">Daily Rate (GH₵)</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" step="0.01" {...field} value={field.value ?? 0} className="bg-white" placeholder="0.00" />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`classTermlyRates.${c.id}`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-[10px] font-bold text-slate-500 uppercase">Termly Rate (GH₵)</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" step="0.01" {...field} value={field.value ?? 0} className="bg-white" placeholder="0.00" />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <Button type="submit" disabled={isSaving || isLoadingSettings} className="w-full h-12 text-lg font-bold bg-orange-600 hover:bg-orange-700">
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Canteen Logic
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

    const handleSave = async (values: z.infer<typeof transportRateSchema>) => {
        if (!firestore || !settingsRef) return;
        
        setIsSaving(true);
        const data = { dailyRate: values.dailyRate, updatedAt: serverTimestamp() };
        
        try {
            await setDoc(settingsRef, data, { merge: true });
            toast({ title: 'Success', description: 'Transport daily rate has been updated.' });
        } catch (error: any) {
            if (error.code === 'permission-denied') {
                const permissionError = new FirestorePermissionError({
                    path: settingsRef.path,
                    operation: 'write',
                    requestResourceData: data,
                });
                errorEmitter.emit('permission-error', permissionError);
            } else {
                toast({ variant: 'destructive', title: "Update Failed", description: error.message });
            }
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="border-t-4 border-t-indigo-500">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bus className="text-indigo-500"/> Transport Settings</CardTitle>
                <CardDescription>Set the default daily fee for bus usage. Specific route rates will override this.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="flex items-end gap-4">
                        <FormField
                            control={form.control}
                            name="dailyRate"
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormLabel>Default Daily Transport Fee (GH₵)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" placeholder="e.g., 10.00" {...field} value={field.value ?? 0} disabled={isLoading} className="h-12 border-2" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSaving || isLoading} className="h-12">
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

            // 1. Fetch Canteen Settings
            const canteenSettingsSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen'));
            const canteenData = canteenSettingsSnap.data();
            const canteenModel = canteenData?.pricingModel || 'Flat';
            const globalCanteenRate = canteenData?.dailyRate || 0;
            const classCanteenRates = canteenData?.classRates || {};

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
            const studentMap = new Map<string, { usesBus: boolean, routeId: string, transportMode: string, canteenMode: string }>();

            studentsSnap.docs.forEach(doc => {
                const data = doc.data();
                studentMap.set(doc.id, { 
                    usesBus: data.usesBusService === true, 
                    routeId: data.routeId || '',
                    transportMode: data.transportBillingModel || 'Daily',
                    canteenMode: data.canteenBillingMode || 'Daily'
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
                const studentInfo = studentMap.get(record.studentId);

                // A. Determine the correct Canteen Rate for this specific student's class
                // ONLY bill daily Canteen if their mode is 'Daily'
                if (studentInfo?.canteenMode === 'Daily') {
                    let studentCanteenRate = 0;
                    if (canteenModel === 'Flat') {
                        studentCanteenRate = globalCanteenRate;
                    } else if (canteenModel === 'Class-Based') {
                        studentCanteenRate = classCanteenRates[record.classId] || 0;
                    }

                    // Apply Canteen Bill
                    if (studentCanteenRate > 0) {
                        const canteenRecordId = `canteen-${record.studentId}-${dateKey}`;
                        const financialRecordRef = doc(firestore, 'financialRecords', canteenRecordId);
                        billingBatch.set(financialRecordRef, {
                            billedAmount: studentCanteenRate,
                            studentId: record.studentId, 
                            studentName: record.studentName, 
                            classId: record.classId,
                            type: 'Canteen Fee (Daily)', 
                            description: `Canteen - ${format(recordDate, 'PPP')}`, 
                            status: 'Unpaid', 
                            dueDate: Timestamp.fromDate(recordDate),
                            createdAt: serverTimestamp(), 
                            amountPaid: 0, 
                            schoolId,
                        }, { merge: true });
                    }
                }

                // B. Transport Billing (DYNAMIC ROUTE RATE & MODE CHECK)
                // ONLY bill daily Transport if they use the bus AND their mode is 'Daily'
                if (studentInfo?.usesBus && studentInfo?.routeId && studentInfo?.transportMode === 'Daily') {
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
        <Card className="border-t-4 border-t-slate-800">
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
                                    className={cn("w-full justify-start text-left font-normal h-12 border-2 bg-white", !dateRange && "text-muted-foreground")}
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
                        <Button type="button" onClick={handleReprocess} disabled={isProcessing} className="h-12 px-8">
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
    return <Card className="m-6"><CardHeader><CardTitle>Access Denied</CardTitle></CardHeader></Card>;
  }

  if (isLoadingSchool) {
      return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!schoolId) {
       return <Card className="m-6"><CardHeader><CardTitle>School Not Found</CardTitle></CardHeader></Card>;
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
        <div className="flex flex-col gap-1 mb-4">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Financial Settings</h1>
            <p className="text-muted-foreground font-medium italic">Configure automated billing rates and reprocess history.</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
            <CanteenSettings schoolId={schoolId} />
            <TransportSettings schoolId={schoolId} />
        </div>
        
        <div className="space-y-6">
            <ManualBillingReconciliation schoolId={schoolId} />
            <RetrospectiveBilling schoolId={schoolId} />
        </div>
    </div>
  );
}
