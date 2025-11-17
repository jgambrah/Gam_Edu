
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Vendor, vendorSchema } from '@/lib/types';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';


function VendorForm({ setOpen, onVendorAdded }: { setOpen: (open: boolean) => void; onVendorAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof vendorSchema>>({
        resolver: zodResolver(vendorSchema),
        defaultValues: { name: '', category: 'Office Supplies', email: '', phone: '' },
    });

    async function onSubmit(values: z.infer<typeof vendorSchema>) {
        if (!firestore) return;
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'vendors'), values);
            toast({ title: 'Success', description: `Vendor '${values.name}' has been created.` });
            onVendorAdded();
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to add vendor.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Vendor Name</FormLabel><FormControl><Input placeholder="e.g., Office Supplies Co." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem><FormLabel>Category</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{['Office Supplies', 'Maintenance', 'IT Services', 'Catering', 'Transportation', 'Utilities', 'Other'].map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Contact Email</FormLabel><FormControl><Input type="email" placeholder="contact@officeco.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Contact Phone</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Add Vendor</Button>
            </form>
        </Form>
    );
}


export default function VendorsPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const [isFormOpen, setFormOpen] = useState(false);

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);

    const vendorsQuery = useMemoFirebase(() => firestore ? collection(firestore, 'vendors') : null, [firestore]);
    const { data: vendors, isLoading, forceRefetch } = useCollection<Vendor>(vendorsQuery);

    if (!canAccess) {
        return <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is restricted to financial staff.</CardDescription></CardHeader></Card>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Vendor Management</CardTitle>
                            <CardDescription>Add, view, and manage school suppliers.</CardDescription>
                        </div>
                        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                            <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> New Vendor</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Add New Vendor</DialogTitle><DialogDescription>Enter the details for the new supplier.</DialogDescription></DialogHeader>
                                <VendorForm setOpen={setFormOpen} onVendorAdded={forceRefetch} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                        <Table>
                            <TableHeader><TableRow><TableHead>Vendor Name</TableHead><TableHead>Category</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {vendors && vendors.length > 0 ? vendors.map(vendor => (
                                    <TableRow key={vendor.id}>
                                        <TableCell className="font-medium">{vendor.name}</TableCell>
                                        <TableCell><Badge variant="secondary">{vendor.category}</Badge></TableCell>
                                        <TableCell><Link href={`mailto:${vendor.email}`} className="text-primary hover:underline">{vendor.email}</Link></TableCell>
                                        <TableCell><Link href={`tel:${vendor.phone}`} className="text-primary hover:underline">{vendor.phone}</Link></TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">No vendors found. Click "New Vendor" to add one.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

    