
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
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc, query, getDocs } from 'firebase/firestore';
import { Loader2, PlusCircle, Trash2, Users } from 'lucide-react';
import { Staff, StaffPayrollConfig, staffPayrollConfigSchema } from '@/lib/types';
import { useRole } from '@/context/role-context';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

function StaffPayrollForm({ staff }: { staff: Staff }) {
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

    useEffect(() => {
        async function fetchConfig() {
            if (!staff) return;
            setIsLoadingConfig(true);
            const configQuery = query(collection(firestore, `staff/${staff.uid}/payroll`));
            const snapshot = await getDocs(configQuery);
            if (!snapshot.empty) {
                form.reset(snapshot.docs[0].data() as StaffPayrollConfig);
            } else {
                form.reset(); // Reset to default if no config found
            }
            setIsLoadingConfig(false);
        }
        fetchConfig();
    }, [staff, firestore, form]);

    async function onSubmit(values: z.infer<typeof staffPayrollConfigSchema>) {
        setIsSubmitting(true);
        try {
            const configRef = doc(firestore, `staff/${staff.uid}/payroll`, 'main');
            await setDoc(configRef, values);
            toast({ title: 'Success', description: `Payroll settings for ${staff.firstName} updated.` });
        } catch(e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not save settings.' });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    if (isLoadingConfig) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle>Salary & Statutory</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="basicSalary" render={({ field }) => (
                                <FormItem><FormLabel>Basic Salary (Monthly)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="ssnitNumber" render={({ field }) => (
                                <FormItem><FormLabel>SSNIT Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="tinNumber" render={({ field }) => (
                                <FormItem><FormLabel>TIN Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Bank Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="bankName" render={({ field }) => (
                                <FormItem><FormLabel>Bank Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="accountNumber" render={({ field }) => (
                                <FormItem><FormLabel>Account Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><div className="flex justify-between items-center"><CardTitle>Allowances</CardTitle><Button type="button" size="sm" variant="outline" onClick={() => appendAllowance({name: '', amount: 0})}><PlusCircle className="mr-2"/>Add</Button></div></CardHeader>
                        <CardContent className="space-y-4">
                            {allowanceFields.map((field, index) => (
                                <div key={field.id} className="flex items-end gap-2"><FormField control={form.control} name={`allowances.${index}.name`} render={({ field }) => (
                                    <FormItem className="flex-grow"><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )}/><FormField control={form.control} name={`allowances.${index}.amount`} render={({ field }) => (
                                    <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )}/><Button type="button" variant="destructive" size="icon" onClick={() => removeAllowance(index)}><Trash2/></Button></div>
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><div className="flex justify-between items-center"><CardTitle>Manual Deductions</CardTitle><Button type="button" size="sm" variant="outline" onClick={() => appendDeduction({name: '', amount: 0})}><PlusCircle className="mr-2"/>Add</Button></div></CardHeader>
                        <CardContent className="space-y-4">
                           {deductionFields.map((field, index) => (
                                <div key={field.id} className="flex items-end gap-2"><FormField control={form.control} name={`deductions.${index}.name`} render={({ field }) => (
                                    <FormItem className="flex-grow"><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                )}/><FormField control={form.control} name={`deductions.${index}.amount`} render={({ field }) => (
                                    <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                )}/><Button type="button" variant="destructive" size="icon" onClick={() => removeDeduction(index)}><Trash2/></Button></div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Save Configuration</Button>
            </form>
        </Form>
    );
}

export default function StaffPayrollConfigPage() {
    const { role } = useRole();
    const { user } = useUser();
    const firestore = useFirestore();
    const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);

    const staffListQuery = useMemoFirebase(() => (user && firestore) ? collection(firestore, 'staff') : null, [firestore, user]);
    const { data: staffList } = useCollection<Staff>(staffListQuery);
    
    if (!['Administrator', 'Director', 'Accountant'].includes(role || '')) {
        return <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is restricted.</CardDescription></CardHeader></Card>;
    }
    
    const selectedStaff = staffList?.find(s => s.uid === selectedStaffId);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users /> Staff Payroll Configuration</CardTitle>
                    <CardDescription>Manage individual salary, allowance, and deduction settings for each staff member.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full md:w-1/3">
                        <Select onValueChange={setSelectedStaffId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a staff member to configure..." />
                            </SelectTrigger>
                            <SelectContent>
                                {staffList?.map(s => <SelectItem key={s.id} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {selectedStaff && <StaffPayrollForm staff={selectedStaff} />}
        </div>
    );
}
