
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
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Loader2, PlusCircle, Trash2, FileText } from 'lucide-react';
import { PayrollSettings, payrollSettingsFormSchema } from '@/lib/types';
import { useRole } from '@/context/role-context';

export default function PayrollSettingsPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const settingsQuery = useMemoFirebase(() => collection(firestore, 'payrollSettings'), [firestore]);
  const { data: settingsList, isLoading } = useCollection<PayrollSettings>(settingsQuery);
  const existingSettings = settingsList?.[0];

  const form = useForm<z.infer<typeof payrollSettingsFormSchema>>({
    resolver: zodResolver(payrollSettingsFormSchema),
    defaultValues: {
        ssnitEmployeeContributionRate: 0,
        ssnitEmployerContributionRate: 0,
        payeeBrackets: [{ from: 0, to: null, rate: 0 }],
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "payeeBrackets",
  });

  useEffect(() => {
    if (existingSettings) {
      form.reset({
        ...existingSettings,
        payeeBrackets: existingSettings.payeeBrackets.map(b => ({...b, to: b.to === undefined ? null : b.to }))
      });
    }
  }, [existingSettings, form]);

  async function onSubmit(values: z.infer<typeof payrollSettingsFormSchema>) {
    setIsSubmitting(true);
    try {
      const settingsRef = doc(firestore, 'payrollSettings', existingSettings?.id || 'global');
      await setDoc(settingsRef, values);
      toast({ title: 'Success', description: 'Payroll settings have been updated.' });
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update settings.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (!['Administrator', 'Accountant'].includes(role)) {
    return <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is restricted.</CardDescription></CardHeader></Card>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><FileText /> Payroll Settings</CardTitle>
        <CardDescription>Configure global statutory rates and tax brackets for payroll processing.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
                <CardHeader><CardTitle>SSNIT Contribution Rates</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-6">
                    <FormField control={form.control} name="ssnitEmployeeContributionRate" render={({ field }) => (
                        <FormItem><FormLabel>Employee Rate (e.g., 0.055 for 5.5%)</FormLabel><FormControl><Input type="number" step="0.001" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="ssnitEmployerContributionRate" render={({ field }) => (
                        <FormItem><FormLabel>Employer Rate (e.g., 0.13 for 13%)</FormLabel><FormControl><Input type="number" step="0.001" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>PAYE Tax Brackets</CardTitle>
                        <Button type="button" variant="outline" size="sm" onClick={() => append({ from: 0, to: null, rate: 0 })}><PlusCircle className="mr-2"/>Add Bracket</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-end gap-4 p-4 border rounded-md">
                            <FormField control={form.control} name={`payeeBrackets.${index}.from`} render={({ field }) => (
                                <FormItem><FormLabel>From ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name={`payeeBrackets.${index}.to`} render={({ field }) => (
                                <FormItem><FormLabel>To ($)</FormLabel><FormControl><Input type="number" placeholder="Leave empty for last tier" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name={`payeeBrackets.${index}.rate`} render={({ field }) => (
                                <FormItem><FormLabel>Rate (e.g., 0.1 for 10%)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2/></Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
