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
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, query, getDocs, where } from 'firebase/firestore';
import { Loader2, PlusCircle, Trash2, Users, Save, Search, Sparkles, Scale, Landmark } from 'lucide-react';
import { Staff, StaffPayrollConfig, staffPayrollConfigSchema } from '@/lib/types';
import { useRole } from '@/context/role-context';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { cn } from '@/lib/utils';

function StaffPayrollForm({ staff, schoolId }: { staff: Staff; schoolId: string; }) {
    const firestore = useFirestore(); 
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingConfig, setIsLoadingConfig] = useState(true);

    const form = useForm<z.infer<typeof staffPayrollConfigSchema>>({
        resolver: zodResolver(staffPayrollConfigSchema),
        defaultValues: {
            basicSalary: 0,
            allowances: [],
            deductions: [],
            ssnitNumber: '',
            tinNumber: '',
            bankName: '',
            accountNumber: '',
        },
    });

    const { fields: allowanceFields, append: appendAllowance, remove: removeAllowance } = useFieldArray({
        control: form.control, name: "allowances",
    });

    const { fields: deductionFields, append: appendDeduction, remove: removeDeduction } = useFieldArray({
        control: form.control, name: "deductions",
    });

    // Form Watches & Live Calculator
    const watchBasic = form.watch('basicSalary');
    const watchAllowances = form.watch('allowances');
    const watchDeductions = form.watch('deductions');

    const calculatedSummary = useMemo(() => {
        const basic = parseFloat(String(watchBasic)) || 0;
        const totalAllowances = watchAllowances?.reduce((sum, item) => sum + (parseFloat(String(item.amount)) || 0), 0) || 0;
        const totalDeductions = watchDeductions?.reduce((sum, item) => sum + (parseFloat(String(item.amount)) || 0), 0) || 0;
        const netPayable = (basic + totalAllowances) - totalDeductions;
        return { basic, totalAllowances, totalDeductions, netPayable };
    }, [watchBasic, watchAllowances, watchDeductions]);

    useEffect(() => {
        async function fetchConfig() {
            if (!staff || !firestore) return;
            setIsLoadingConfig(true);
            try {
                const configQuery = query(collection(firestore, `staff/${staff.uid}/payroll`));
                const snapshot = await getDocs(configQuery);
                if (!snapshot.empty) {
                    form.reset(snapshot.docs[0].data() as StaffPayrollConfig);
                } else {
                    form.reset({
                        basicSalary: 0,
                        allowances: [],
                        deductions: [],
                        ssnitNumber: '',
                        tinNumber: '',
                        bankName: '',
                        accountNumber: '',
                    });
                }
            } catch (e) {
                console.error("Fetch Config Error:", e);
            } finally {
                setIsLoadingConfig(false);
            }
        }
        fetchConfig();
    }, [staff, firestore, form]);

    async function onSubmit(values: z.infer<typeof staffPayrollConfigSchema>) {
        if(!firestore) return;
        setIsSubmitting(true);
        try {
            const configRef = doc(firestore, `staff/${staff.uid}/payroll`, 'main');
            await setDoc(configRef, { ...values, schoolId });
            toast({ title: 'Success', description: `Payroll settings for ${staff.firstName} updated.` });
        } catch(e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not save settings.' });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    if (isLoadingConfig) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Live Estimator Dashboard Card */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-gradient-to-br from-violet-900 to-indigo-950 text-white rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/5 blur-xl pointer-events-none" />
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase font-bold text-indigo-300">Basic Salary</p>
                        <p className="text-xl font-black font-mono">GH₵{calculatedSummary.basic.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1 border-l border-white/10 pl-4">
                        <p className="text-[10px] uppercase font-bold text-indigo-300">Total Allowances</p>
                        <p className="text-xl font-black font-mono text-emerald-400">+GH₵{calculatedSummary.totalAllowances.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1 border-l border-white/10 pl-4">
                        <p className="text-[10px] uppercase font-bold text-indigo-300">Total Deductions</p>
                        <p className="text-xl font-black font-mono text-rose-400">-GH₵{calculatedSummary.totalDeductions.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1 border-l border-white/10 pl-4 bg-white/5 rounded-2xl p-2">
                        <p className="text-[10px] uppercase font-bold text-indigo-300">Est. Net Take-Home</p>
                        <p className="text-2xl font-black font-mono text-indigo-200">GH₵{calculatedSummary.netPayable.toFixed(2)}</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border border-slate-100 shadow-lg rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-5">
                            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                                <Landmark className="h-4 w-4 text-indigo-600" /> Salary & Statutory Registrations
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-400">Configure core monthly compensation and tax numbers.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-5">
                            <FormField control={form.control} name="basicSalary" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Basic Monthly Salary (GH₵)</FormLabel>
                                    <FormControl><Input type="number" {...field} className="h-10 bg-slate-50 border-slate-200 font-mono font-bold" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="ssnitNumber" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">SSNIT Pension Number</FormLabel>
                                    <FormControl><Input {...field} placeholder="e.g. C012345678901" className="h-10 bg-slate-50 border-slate-200 font-mono font-semibold" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="tinNumber" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ghana Card PIN / Tax Identification (TIN)</FormLabel>
                                    <FormControl><Input {...field} placeholder="e.g. GHA-123456789-0" className="h-10 bg-slate-50 border-slate-200 font-mono font-semibold" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </CardContent>
                    </Card>
                    
                    <Card className="border border-slate-100 shadow-lg rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-5">
                            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                                <Scale className="h-4 w-4 text-indigo-600" /> Bank Disbursements Details
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-400">Account details for monthly direct deposit transfers.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-5">
                            <FormField control={form.control} name="bankName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bank Name</FormLabel>
                                    <FormControl><Input {...field} placeholder="e.g. GCB Bank, Ecobank Ghana" className="h-10 bg-slate-50 border-slate-200" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="accountNumber" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Number</FormLabel>
                                    <FormControl><Input {...field} placeholder="e.g. 1011121314151" className="h-10 bg-slate-50 border-slate-200 font-mono font-bold" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border border-slate-100 shadow-lg rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300">
                        <CardHeader className="flex flex-row justify-between items-center bg-slate-50/50 border-b border-slate-100 p-5">
                            <div>
                                <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                                    <Sparkles className="h-4 w-4 text-indigo-600" /> Allowances
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-400">Recurring cash allowances added to base pay.</CardDescription>
                            </div>
                            <Button type="button" size="sm" variant="outline" className="rounded-xl border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-50" onClick={() => appendAllowance({name: '', amount: 0})}>
                                <PlusCircle className="mr-1 h-4 w-4"/> Add
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4 p-5">
                            {allowanceFields.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-6 font-medium">No allowances defined.</p>
                            ) : (
                                allowanceFields.map((field, index) => (
                                    <div key={field.id} className="flex items-end gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                        <FormField control={form.control} name={`allowances.${index}.name`} render={({ field }) => (
                                            <FormItem className="flex-grow">
                                                <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Allowance Name</FormLabel>
                                                <FormControl><Input {...field} placeholder="e.g. Transport" className="h-10 bg-white" /></FormControl>
                                            </FormItem>
                                        )}/>
                                        <FormField control={form.control} name={`allowances.${index}.amount`} render={({ field }) => (
                                            <FormItem className="w-32">
                                                <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (GH₵)</FormLabel>
                                                <FormControl><Input type="number" {...field} className="h-10 bg-white font-mono font-bold" /></FormControl>
                                            </FormItem>
                                        )}/>
                                        <Button type="button" variant="ghost" size="icon" className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl h-10 w-10 border border-slate-200/50 bg-white" onClick={() => removeAllowance(index)}>
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border border-slate-100 shadow-lg rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300">
                        <CardHeader className="flex flex-row justify-between items-center bg-slate-50/50 border-b border-slate-100 p-5">
                            <div>
                                <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                                    <Trash2 className="h-4 w-4 text-rose-600" /> Deductions
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-400">Recurring cash subtractions from salary.</CardDescription>
                            </div>
                            <Button type="button" size="sm" variant="outline" className="rounded-xl border-rose-200 text-rose-700 font-bold hover:bg-rose-50" onClick={() => appendDeduction({name: '', amount: 0})}>
                                <PlusCircle className="mr-1 h-4 w-4"/> Add
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4 p-5">
                            {deductionFields.length === 0 ? (
                                <p className="text-xs text-slate-400 text-center py-6 font-medium">No deductions defined.</p>
                            ) : (
                                deductionFields.map((field, index) => (
                                    <div key={field.id} className="flex items-end gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                        <FormField control={form.control} name={`deductions.${index}.name`} render={({ field }) => (
                                            <FormItem className="flex-grow">
                                                <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Deduction Name</FormLabel>
                                                <FormControl><Input {...field} placeholder="e.g. Loan repayment" className="h-10 bg-white" /></FormControl>
                                            </FormItem>
                                        )}/>
                                        <FormField control={form.control} name={`deductions.${index}.amount`} render={({ field }) => (
                                            <FormItem className="w-32">
                                                <FormLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider">Amount (GH₵)</FormLabel>
                                                <FormControl><Input type="number" {...field} className="h-10 bg-white font-mono font-bold" /></FormControl>
                                            </FormItem>
                                        )}/>
                                        <Button type="button" variant="ghost" size="icon" className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl h-10 w-10 border border-slate-200/50 bg-white" onClick={() => removeDeduction(index)}>
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>} 
                    Save Payroll Configuration for {staff.firstName}
                </Button>
            </form>
        </Form>
    );
}

export default function StaffPayrollConfigPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
    const [staffSearch, setStaffSearch] = useState('');

    const staffListQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: staffList } = useCollection<Staff>(staffListQuery);
    
    const filteredStaff = useMemo(() => {
        if (!staffList) return [];
        if (!staffSearch.trim()) return staffList;
        const queryStr = staffSearch.toLowerCase();
        return staffList.filter(s => 
            `${s.firstName} ${s.lastName}`.toLowerCase().includes(queryStr) ||
            (s.role || '').toLowerCase().includes(queryStr)
        );
    }, [staffList, staffSearch]);

    if (!['Administrator', 'Director', 'Accountant'].includes(role || '')) {
        return <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is restricted.</CardDescription></CardHeader></Card>;
    }
    
    const selectedStaff = staffList?.find(s => s.uid === selectedStaffId);

    return (
        <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen">
            {/* Executive Glowing Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-indigo-500/20">
                {/* Decorative glow elements */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-md border border-white/10">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-300 animate-pulse" />
                            <span>Staff Compensation & Payroll Configuration</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                            Staff Payroll Configuration
                        </h1>
                        <p className="text-sm text-indigo-100 font-medium max-w-xl">
                            Configure basic monthly salaries, recurring allowances, manual deductions, bank information, and statutory tax registrations for all staff.
                        </p>
                    </div>

                    <div className="bg-black/15 backdrop-blur-lg rounded-2xl p-4 border border-white/5 text-center md:text-left">
                        <p className="text-[10px] uppercase text-indigo-300 font-bold tracking-wider">Total Staff Members</p>
                        <p className="text-2xl font-black font-mono text-white mt-1">{staffList?.length || 0}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT SIDEBAR: Staff List */}
                <Card className="lg:col-span-4 border border-slate-100 shadow-lg rounded-2xl bg-white overflow-hidden self-stretch flex flex-col max-h-[800px]">
                    <CardHeader className="border-b border-slate-50 p-4">
                        <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
                            <Users className="text-indigo-600 h-5 w-5" /> Staff Registry
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-400">Select a staff member to configure compensation details.</CardDescription>
                        <div className="relative mt-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <Input 
                                placeholder="Search staff..." 
                                className="pl-9 h-9 text-xs bg-slate-50 border-0 rounded-lg focus-visible:ring-1 focus-visible:ring-indigo-500"
                                value={staffSearch}
                                onChange={(e) => setStaffSearch(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-y-auto flex-grow divide-y divide-slate-100 max-h-[600px]">
                        {!filteredStaff || filteredStaff.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <Users className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                <p className="text-xs font-bold uppercase tracking-wider">No staff found</p>
                            </div>
                        ) : (
                            filteredStaff.map(s => {
                                const isSelected = selectedStaffId === s.uid;
                                return (
                                    <button
                                        key={s.uid}
                                        onClick={() => setSelectedStaffId(s.uid)}
                                        className={cn(
                                            "w-full text-left p-4 transition-all duration-150 flex items-center justify-between hover:bg-slate-50/50",
                                            isSelected ? "bg-indigo-50/50 border-l-4 border-l-indigo-600 pl-3 font-semibold" : ""
                                        )}
                                    >
                                        <div className="space-y-1">
                                            <p className={cn("text-sm font-bold", isSelected ? "text-indigo-900" : "text-slate-700")}>
                                                {s.firstName} {s.lastName}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.role || 'Staff Member'}</p>
                                        </div>
                                        {isSelected && <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />}
                                    </button>
                                );
                            })
                        )}
                    </CardContent>
                </Card>

                {/* RIGHT PANEL: Form Details */}
                <div className="lg:col-span-8 space-y-6">
                    {selectedStaff && schoolId ? (
                        <div className="space-y-6">
                            <Card className="border border-indigo-100 shadow-md rounded-2xl bg-indigo-50/20 overflow-hidden">
                                <CardContent className="p-4 flex items-center gap-4">
                                    <div className="h-12 w-12 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
                                        {(selectedStaff.firstName || '')[0] || ''}{(selectedStaff.lastName || '')[0] || ''}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800">{selectedStaff.firstName} {selectedStaff.lastName}</h3>
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">{selectedStaff.role || 'Staff Member'} • uid: {selectedStaff.uid.slice(0,8)}...</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <StaffPayrollForm staff={selectedStaff} schoolId={schoolId} />
                        </div>
                    ) : (
                        <Card className="border border-dashed border-slate-300 rounded-3xl p-16 text-center bg-white shadow-sm h-[400px] flex flex-col justify-center items-center">
                            <Users className="h-16 w-16 text-slate-300 mb-4 stroke-1 animate-pulse" />
                            <h3 className="text-lg font-black text-slate-700">No Staff Selected</h3>
                            <p className="text-slate-400 text-sm max-w-sm mt-1">Select a staff member from the registry sidebar to view or edit their payroll configurations.</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
