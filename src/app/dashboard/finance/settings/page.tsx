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
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useFirestore, useMemoFirebase, useDoc, useCollection, useUser } from '@/firebase';
import { collection, doc, setDoc, writeBatch, query, where, getDocs, serverTimestamp, getDoc, Timestamp } from 'firebase/firestore';
import { logAuditEvent } from '@/lib/audit';
import { Loader2, Utensils, Bus, RefreshCw, ListChecks, CalendarRange, Settings, Search, Save, AlertTriangle, XCircle, ShieldAlert, Info } from 'lucide-react';
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
import { Class, Student } from '@/lib/types';

const canteenRateSchema = z.object({
    pricingModel: z.enum(['Flat', 'Class-Based']),
    dailyRate: z.coerce.number().min(0, "Rate must be 0 or more."),
    termlyRate: z.coerce.number().min(0, "Rate must be 0 or more.").optional(),
    classRates: z.record(z.string(), z.coerce.number().min(0)).optional(),
    classTermlyRates: z.record(z.string(), z.coerce.number().min(0)).optional()
});

const transportRateSchema = z.object({
    dailyRate: z.coerce.number().min(0, "Rate must be 0 or more.")
});


// --- Canteen Rate Settings Component ---
function CanteenSettings({ schoolId }: { schoolId: string }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { profile } = useRole();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: classes } = useCollection<Class>(classesQuery);

    const settingsRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen') : null, [firestore, schoolId]);
    const { data: canteenSettings } = useDoc<any>(settingsRef);

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

    const handleSave = (values: z.infer<typeof canteenRateSchema>) => {
        if (!firestore || !settingsRef) return;
        
        console.log("--- SAVING CANTEEN SETTINGS ---", values);
        setIsSaving(true);
        
        const data: any = {
            pricingModel: values.pricingModel,
            dailyRate: Number(values.dailyRate) || 0,
            termlyRate: Number(values.termlyRate) || 0,
            updatedAt: serverTimestamp()
        };

        if (values.classRates) {
            data.classRates = Object.fromEntries(
                Object.entries(values.classRates).map(([k, v]) => [k, Number(v) || 0])
            );
        }
        if (values.classTermlyRates) {
            data.classTermlyRates = Object.fromEntries(
                Object.entries(values.classTermlyRates).map(([k, v]) => [k, Number(v) || 0])
            );
        }
        
        setDoc(settingsRef, data, { merge: true })
          .then(async () => {
            toast({ title: 'Settings Updated', description: 'Canteen billing logic has been saved.' });
            await logAuditEvent({
                firestore,
                schoolId,
                userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
                action: 'UPDATE_CANTEEN_SETTINGS',
                details: `Updated canteen billing rate settings: dailyRate=GH₵${data.dailyRate}, termlyRate=GH₵${data.termlyRate}, pricingModel=${data.pricingModel}`
            });
          })
          .catch((error: any) => {
            console.error("SAVE FAILED:", error.code, error.message, error);
            if (error.code === 'permission-denied') {
                const permissionError = new FirestorePermissionError({
                    path: settingsRef.path,
                    operation: 'write',
                    requestResourceData: data,
                });
                errorEmitter.emit('permission-error', permissionError);
            } else {
                toast({ 
                    variant: 'destructive', 
                    title: 'Update Failed', 
                    description: error.message || 'Check your internet connection.' 
                });
            }
          })
          .finally(() => {
            setIsSaving(false);
          });
    };

    const onFormError = (errors: any) => {
        console.warn("Canteen Form Validation Errors:", errors);
        toast({
            variant: 'destructive',
            title: 'Form Error',
            description: 'Please check your inputs and ensure all rates are 0 or positive numbers.'
        });
    };

    return (
        <Card className="border border-slate-200 shadow-lg rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center gap-4">
                <div className="bg-orange-500/10 text-orange-600 rounded-2xl p-3 shadow-inner shrink-0">
                    <Utensils className="h-6 w-6"/>
                </div>
                <div>
                    <CardTitle className="text-slate-900 font-black tracking-tight text-lg">Canteen Billing Logic</CardTitle>
                    <CardDescription className="font-semibold text-slate-500 text-xs mt-0.5">Configure how students are billed for meals (Daily vs Termly).</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave, onFormError)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="pricingModel"
                            render={({ field }) => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="font-bold text-slate-700 text-xs">Pricing Model Scheme</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl font-semibold shadow-sm h-11 focus:ring-2 focus:ring-orange-500">
                                                <SelectValue placeholder="Select model" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Flat" className="font-semibold">Flat Rate (Universal default fee)</SelectItem>
                                            <SelectItem value="Class-Based" className="font-semibold">Class-Based Custom (Custom rates by Grade level)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="dailyRate"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="font-bold text-slate-700 text-xs">{"Default Daily Canteen Fee (GH₵)"}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute left-3 top-3 text-slate-400 font-bold text-xs">GH₵</span>
                                                <Input type="number" step="0.01" {...field} value={field.value ?? 0} className="h-11 pl-11 border border-slate-200 rounded-xl font-bold shadow-sm focus-visible:ring-orange-500" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="termlyRate"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="font-bold text-slate-700 text-xs">{"Default Termly Canteen Fee (GH₵)"}</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute left-3 top-3 text-slate-400 font-bold text-xs">GH₵</span>
                                                <Input type="number" step="0.01" {...field} value={field.value ?? 0} className="h-11 pl-11 border border-slate-200 rounded-xl font-bold shadow-sm focus-visible:ring-orange-500" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {pricingModel === 'Class-Based' && (
                            <div className="space-y-4 border border-slate-100 rounded-2xl p-4 bg-slate-50/60 animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                        <ListChecks className="h-4 w-4 text-orange-500"/> Custom Class Rates
                                    </h4>
                                    <Badge className="bg-orange-100 text-orange-700 border-none font-bold text-[9px]">Class Rates Active</Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-1">
                                    {classes?.map((c) => (
                                        <div key={c.id} className="group p-4 border border-slate-200 hover:border-orange-500/30 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-black text-slate-900 tracking-tight">{c.name}</span>
                                                <Badge variant="outline" className="font-bold bg-slate-50 text-slate-500 border-slate-200 text-[8px] uppercase">Grade Billing</Badge>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name={`classRates.${c.id}`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-1">
                                                            <FormLabel className="text-[9px] font-bold text-slate-500 uppercase">Daily (GH₵)</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" step="0.01" {...field} value={field.value ?? 0} className="bg-white rounded-lg h-9 text-xs font-semibold px-2" placeholder="0.00" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`classTermlyRates.${c.id}`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-1">
                                                            <FormLabel className="text-[9px] font-bold text-slate-500 uppercase">Termly (GH₵)</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" step="0.01" {...field} value={field.value ?? 0} className="bg-white rounded-lg h-9 text-xs font-semibold px-2" placeholder="0.00" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    {(!classes || classes.length === 0) && (
                                        <div className="text-center py-6 text-xs text-slate-400 font-semibold italic col-span-2">No classes found to configure.</div>
                                    )}
                                </div>
                            </div>
                        )}

                        <Button type="submit" disabled={isSaving} className="w-full h-12 text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-650 hover:to-amber-700 text-white rounded-xl shadow-md transition-all active:scale-[0.98]">
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
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
    const { user } = useUser();
    const { profile } = useRole();
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
        
        console.log("--- SAVING TRANSPORT SETTINGS ---", values);
        setIsSaving(true);
        const data = { dailyRate: Number(values.dailyRate) || 0, updatedAt: serverTimestamp() };
        
        setDoc(settingsRef, data, { merge: true })
          .then(async () => {
            toast({ title: 'Success', description: 'Transport daily rate has been updated.' });
            await logAuditEvent({
                firestore,
                schoolId,
                userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
                action: 'UPDATE_TRANSPORT_SETTINGS',
                details: `Updated default daily transport rate to GH₵${data.dailyRate}`
            });
          })
          .catch((error: any) => {
            console.error("SAVE FAILED:", error.code, error.message, error);
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
          })
          .finally(() => {
            setIsSaving(false);
          });
    };

    return (
        <Card className="border border-slate-200 shadow-lg rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center gap-4">
                <div className="bg-indigo-500/10 text-indigo-600 rounded-2xl p-3 shadow-inner shrink-0">
                    <Bus className="h-6 w-6"/>
                </div>
                <div>
                    <CardTitle className="text-slate-900 font-black tracking-tight text-lg">Transport Settings</CardTitle>
                    <CardDescription className="font-semibold text-slate-500 text-xs mt-0.5">Set the default daily fee for bus usage. Specific route rates will override this.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                        <FormField
                            control={form.control}
                            name="dailyRate"
                            render={({ field }) => (
                                <FormItem className="flex-grow space-y-1.5">
                                    <FormLabel className="font-bold text-slate-700 text-xs">Default Daily Transport Fee (GH₵)</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3.5 text-slate-400 font-bold text-xs">GH₵</span>
                                            <Input type="number" step="0.01" placeholder="e.g., 10.00" {...field} value={field.value ?? 0} disabled={isLoading} className="h-12 pl-11 border border-slate-200 rounded-xl font-bold shadow-sm focus-visible:ring-indigo-500" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSaving} className="h-12 px-6 font-bold bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl shadow-md transition-all active:scale-[0.98] shrink-0">
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Default Rate
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

// --- Budget Control Policy Settings Component ---
const budgetSettingsSchema = z.object({
    policy: z.enum(['warning', 'block', 'override'])
});

function BudgetPolicySettings({ schoolId }: { schoolId: string }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { profile } = useRole();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const settingsRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId, 'rates', 'budget') : null, [firestore, schoolId]);
    const { data: settings, isLoading } = useDoc(settingsRef);

    const form = useForm<z.infer<typeof budgetSettingsSchema>>({
        resolver: zodResolver(budgetSettingsSchema),
        defaultValues: { policy: 'warning' }
    });

    const activePolicy = form.watch('policy');

    useEffect(() => {
        if (settings && settings.policy) {
            form.setValue('policy', settings.policy);
        }
    }, [settings, form]);

    const handleSave = (values: z.infer<typeof budgetSettingsSchema>) => {
        if (!firestore || !settingsRef) return;
        
        setIsSaving(true);
        const data = { policy: values.policy, updatedAt: serverTimestamp() };
        
        setDoc(settingsRef, data, { merge: true })
          .then(async () => {
            toast({ title: 'Success', description: 'Budget exceeded control policy has been updated.' });
            await logAuditEvent({
                firestore,
                schoolId,
                userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
                action: 'UPDATE_BUDGET_SETTINGS',
                details: `Updated budget control policy to: ${values.policy}`
            });
          })
          .catch((error: any) => {
            toast({ variant: 'destructive', title: "Update Failed", description: error.message });
          })
          .finally(() => {
            setIsSaving(false);
          });
    };

    return (
        <Card className="border border-slate-200 shadow-lg rounded-3xl overflow-hidden bg-white flex flex-col justify-between">
            <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center gap-4">
                <div className="bg-amber-500/10 text-amber-600 rounded-2xl p-3 shadow-inner shrink-0">
                    <ListChecks className="h-6 w-6"/>
                </div>
                <div>
                    <CardTitle className="text-slate-900 font-black tracking-tight text-lg">Budget Control Policy</CardTitle>
                    <CardDescription className="font-semibold text-slate-500 text-xs mt-0.5">Determine how the system handles payment vouchers that exceed the allocated budget.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5 flex-grow flex flex-col justify-between">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4 flex-grow flex flex-col justify-between">
                        <FormField
                            control={form.control}
                            name="policy"
                            render={({ field }) => (
                                <FormItem className="space-y-1.5">
                                    <FormLabel className="font-bold text-slate-700 text-xs">Exceeded Budget Action Policy</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl font-semibold shadow-sm h-11 focus:ring-2 focus:ring-amber-500">
                                                <SelectValue placeholder="Select policy..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="warning" className="font-semibold">Soft Warning (Notify but allow payments)</SelectItem>
                                            <SelectItem value="block" className="font-semibold">Hard Block (Completely stop transaction)</SelectItem>
                                            <SelectItem value="override" className="font-semibold">Director Override (Hold voucher for approval)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Interactive dynamic preview panels */}
                        <div className="min-h-[70px]">
                            {activePolicy === 'warning' && (
                               <div className="bg-amber-50/80 border border-amber-200/50 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-amber-900 animate-in fade-in duration-300">
                                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                                  <div className="space-y-0.5">
                                     <span className="font-extrabold block text-slate-900">Soft Warning Policy Active</span>
                                     <span className="font-semibold text-slate-500 leading-relaxed block">The system will alert staff about budget overruns during voucher creation, but will not prevent them from submitting and processing the transaction.</span>
                                  </div>
                               </div>
                            )}
                            {activePolicy === 'block' && (
                               <div className="bg-rose-50/80 border border-rose-200/50 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-rose-900 animate-in fade-in duration-300">
                                  <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
                                  <div className="space-y-0.5">
                                     <span className="font-extrabold block text-slate-900">Hard Block Policy Active</span>
                                     <span className="font-semibold text-slate-500 leading-relaxed block">Any payment voucher exceeding its allocated general ledger account budget is completely blocked. Transactions cannot be saved or submitted.</span>
                                  </div>
                               </div>
                            )}
                            {activePolicy === 'override' && (
                               <div className="bg-indigo-50/80 border border-indigo-200/50 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-indigo-900 animate-in fade-in duration-300">
                                  <ShieldAlert className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5 animate-pulse" />
                                  <div className="space-y-0.5">
                                     <span className="font-extrabold block text-slate-900">Director Override Required</span>
                                     <span className="font-semibold text-slate-500 leading-relaxed block">Vouchers exceeding budget limits are automatically put on administrative hold. They will require explicit digital approval and commentary by the Director to resolve.</span>
                                  </div>
                               </div>
                            )}
                        </div>

                        <Button type="submit" disabled={isSaving || isLoading} className="w-full h-12 font-bold bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-xl shadow-md transition-all active:scale-[0.98]">
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Control Policy
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
    const { user } = useUser();
    const { profile } = useRole();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });
    
    const handleReprocess = async () => {
        if (!firestore || !dateRange?.from || !schoolId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a valid date range.' });
            return;
        }
        setIsProcessing(true);
        toast({ title: "Reprocessing billing...", description: `Scanning attendance records...`});

        try {
            const start = startOfDay(dateRange.from);
            const end = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

            // Fetch Canteen Settings
            const canteenSettingsSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen'));
            const canteenData = canteenSettingsSnap.data();
            const canteenModel = canteenData?.pricingModel || 'Flat';
            const globalCanteenRate = canteenData?.dailyRate || 0;
            const classCanteenRates = canteenData?.classRates || {};

            // Fetch ALL Transport Routes
            const routesQuery = query(collection(firestore, 'routes'), where('schoolId', '==', schoolId));
            const routesSnap = await getDocs(routesQuery);
            const routeRatesMap = new Map<string, any>();
            routesSnap.docs.forEach(doc => {
                routeRatesMap.set(doc.id, doc.data());
            });

            // Fetch Students
            const studentsQuery = query(collection(firestore, 'students'), where('schoolId', '==', schoolId));
            const studentsSnap = await getDocs(studentsQuery);
            const studentMap = new Map<string, { usesBus: boolean, routeId: string, transportMode: string, canteenMode: string, status: string }>();

            studentsSnap.docs.forEach(doc => {
                const data = doc.data();
                studentMap.set(doc.id, { 
                    usesBus: data.usesBusService === true, 
                    routeId: data.routeId || '',
                    transportMode: data.transportBillingModel || 'Daily',
                    canteenMode: data.canteenBillingMode || 'Daily',
                    status: data.enrollmentStatus || 'Active'
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
                const studentInfo = studentMap.get(record.studentId);

                if (!studentInfo || studentInfo.status === 'Inactive') continue;

                const recordDate = record.date.toDate();
                const dateKey = format(recordDate, 'yyyy-MM-dd');

                if (studentInfo.canteenMode === 'Daily') {
                    let studentCanteenRate = 0;
                    if (canteenModel === 'Flat') {
                        studentCanteenRate = globalCanteenRate;
                    } else if (canteenModel === 'Class-Based') {
                        studentCanteenRate = classCanteenRates[record.classId] || 0;
                    }

                    if (studentCanteenRate > 0) {
                        const canteenRecordId = `canteen-${record.studentId}-${dateKey}`;
                        const financialRecordRef = doc(firestore, 'financialRecords', canteenRecordId);
                        billingBatch.set(financialRecordRef, {
                            billedAmount: Number(studentCanteenRate),
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

                if (studentInfo.usesBus && studentInfo.routeId && studentInfo.transportMode === 'Daily') {
                    const specificTransportRate = routeRatesMap.get(studentInfo.routeId)?.dailyRate || 0;

                    if (specificTransportRate > 0) {
                        const transportRecordId = `transport-${record.studentId}-${dateKey}`;
                        const financialRecordRef = doc(firestore, 'financialRecords', transportRecordId);
                        
                        billingBatch.set(financialRecordRef, {
                            billedAmount: Number(specificTransportRate),
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
            
            await logAuditEvent({
                firestore,
                schoolId,
                userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
                action: 'RUN_RETRO_BILLING',
                details: `Reprocessed retrospective billing for date range ${format(start, 'yyyy-MM-dd')} to ${format(end, 'yyyy-MM-dd')} (${recordsToProcess.length} attendance records)`
            });
        } catch (error: any) {
            console.error('Error reprocessing billing:', error);
            toast({ variant: 'destructive', title: 'Error', description: error.message });
        } finally {
            setIsProcessing(false);
        }
    };
    
    return (
        <Card className="border border-slate-200 shadow-lg rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center gap-4">
                <div className="bg-slate-750/10 text-slate-800 rounded-2xl p-3 shadow-inner shrink-0">
                    <RefreshCw className="h-6 w-6"/>
                </div>
                <div>
                    <CardTitle className="text-slate-900 font-black tracking-tight text-lg">Retrospective Billing Operations</CardTitle>
                    <CardDescription className="font-semibold text-slate-500 text-xs mt-0.5">Recalculate and apply fees for a past date range based on actual student attendance logs.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="bg-slate-50 p-4 border border-slate-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-semibold text-slate-650">
                    <div className="flex items-start gap-2.5">
                        <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-black text-slate-800 block mb-1">Billing Reconciliation Audit Steps</span>
                            <span className="leading-relaxed">This tool will check attendance logs for the specified period. Students with marked attendance who are set to "Daily" billing mode will have their canteen and transport charges generated or reconciled.</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 w-full md:w-auto text-[10px] uppercase font-black tracking-wider text-center pt-2 md:pt-0">
                        <div className="bg-white border p-2 rounded-xl text-slate-700 shadow-sm"><span className="text-indigo-600 block text-xs mb-0.5">1</span> Select Dates</div>
                        <div className="bg-white border p-2 rounded-xl text-slate-700 shadow-sm"><span className="text-indigo-600 block text-xs mb-0.5">2</span> Scan Present</div>
                        <div className="bg-white border p-2 rounded-xl text-slate-700 shadow-sm"><span className="text-indigo-600 block text-xs mb-0.5">3</span> Apply Fees</div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-stretch md:items-end gap-4">
                    <div className="flex-1 w-full space-y-1.5">
                        <Label className="font-bold text-slate-700 text-xs">Target Re-billing Date Range</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className={cn("w-full justify-start text-left font-semibold h-12 border border-slate-200 bg-white rounded-xl shadow-sm focus-visible:ring-indigo-500", !dateRange && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4 text-indigo-500" />
                                {dateRange?.from ? (dateRange.to ? (<>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>) : (format(dateRange.from, "LLL dd, y"))) : (<span>Pick a date range</span>)}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button type="button" onClick={handleReprocess} disabled={isProcessing} className="h-12 px-10 font-bold bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white rounded-xl shadow-lg transition-all active:scale-[0.98] w-full md:w-auto flex items-center justify-center gap-1.5">
                        {isProcessing ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin"/> : <RefreshCw className="mr-1.5 h-4 w-4"/>}
                        Run Retrospective Audit
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function FinancialSettingsPage() {
  const { role } = useRole();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
  const firestore = useFirestore();

  // Fetch rate configuration documents to show live indicators in the premium banner
  const canteenRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen') : null, [firestore, schoolId]);
  const { data: canteenSettings } = useDoc<any>(canteenRef);

  const budgetRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId, 'rates', 'budget') : null, [firestore, schoolId]);
  const { data: budgetSettings } = useDoc<any>(budgetRef);

  const transportRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId, 'rates', 'transport') : null, [firestore, schoolId]);
  const { data: transportSettings } = useDoc<any>(transportRef);
  
  if (!['Administrator', 'Director', 'Accountant'].includes(role || '')) {
    return (
        <div className="p-8 flex justify-center">
            <Card className="max-w-md w-full border border-red-150 bg-red-50/30 rounded-3xl p-6 text-center">
                <CardHeader>
                    <div className="bg-red-100/80 text-red-650 p-4 rounded-full w-fit mx-auto mb-4 shadow-inner">
                        <Settings size={36} className="animate-spin-slow" />
                    </div>
                    <CardTitle className="font-black text-slate-900">Access Restricted</CardTitle>
                    <CardDescription className="font-semibold text-slate-500 mt-1">Only Accountants and Administrators can access financial configurations.</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
  }

  if (isLoadingSchool) {
      return <div className="flex justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-indigo-650" /></div>;
  }

  if (!schoolId) {
       return <Card className="m-6 rounded-3xl border border-slate-200 bg-slate-50/50"><CardHeader><CardTitle className="font-black">School Settings Context Not Found</CardTitle></CardHeader></Card>;
  }

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto flex flex-col h-full">
        {/* Premium Executive Settings Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-xl border border-indigo-950/40">
          <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-10 -translate-y-10">
            <Settings className="w-80 h-80" />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-indigo-500 text-white font-extrabold px-2 py-0.5 text-[10px] uppercase tracking-wider">SYSTEM CONFIG & POLICIES</Badge>
                <Badge className="bg-white/10 text-indigo-200 border border-white/10 font-bold px-2 py-0.5 text-[10px] uppercase">OPERATIONAL LOGIC</Badge>
              </div>
              <h1 className="text-3xl font-black tracking-tight">Financial Logic Center</h1>
              <p className="text-indigo-100/70 text-sm max-w-md">Configure automated billing rates, class-based pricing models, budget overrun action thresholds, and run retrospective billing audits.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4">
               <div className="text-xs space-y-1">
                  <span className="text-indigo-200/60 block uppercase font-extrabold tracking-wider text-[9px]">Active Pricing Model</span>
                  <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/20 uppercase font-black text-[9px] px-2 py-0.5 block w-fit">
                     {canteenSettings?.pricingModel === 'Class-Based' ? 'Custom Class Rates' : 'Flat Daily Fees'}
                  </Badge>
               </div>
               <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
               <div className="text-xs space-y-1">
                  <span className="text-indigo-200/60 block uppercase font-extrabold tracking-wider text-[9px]">Budget Policy</span>
                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/20 uppercase font-black text-[9px] px-2 py-0.5 block w-fit">
                     {budgetSettings?.policy || 'Warning Only'}
                  </Badge>
               </div>
               <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
               <div className="text-xs space-y-1">
                  <span className="text-indigo-200/60 block uppercase font-extrabold tracking-wider text-[9px]">Default Bus Fee</span>
                  <span className="font-extrabold block text-xs text-indigo-100">GH₵{Number(transportSettings?.dailyRate || 0).toFixed(2)}</span>
               </div>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
            <CanteenSettings schoolId={schoolId} />
            <div className="space-y-6">
                <TransportSettings schoolId={schoolId} />
                <BudgetPolicySettings schoolId={schoolId} />
            </div>
        </div>
        
        <div className="space-y-6">
            <div className="flex flex-col gap-1.5 pt-4">
                <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <RefreshCw className="text-indigo-600 h-5 w-5"/> Billing Reconciliation & Audits
                </h2>
                <p className="text-xs text-muted-foreground font-semibold">Manually adjust student statements and reprocess retrospective attendance-based fee logs.</p>
            </div>
            <ManualBillingReconciliation schoolId={schoolId} />
            <RetrospectiveBilling schoolId={schoolId} />
        </div>
    </div>
  );
}
