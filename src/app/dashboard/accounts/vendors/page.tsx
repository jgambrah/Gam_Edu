'use client';

import { useState, useCallback } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, where, serverTimestamp, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, PlusCircle, Trash2, Search, RefreshCw, UserCheck } from 'lucide-react';
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
import { useCurrentSchool } from '@/hooks/use-current-school';


function VendorForm({ setOpen, onVendorAdded, schoolId }: { setOpen: (open: boolean) => void; onVendorAdded: () => void; schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof vendorSchema>>({
        resolver: zodResolver(vendorSchema),
        defaultValues: { name: '', category: 'Office Supplies', email: '', phone: '' },
    });

    async function onSubmit(values: z.infer<typeof vendorSchema>) {
        if (!firestore || !schoolId) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore, 'vendors'), {
                ...values,
                schoolId: schoolId,
                createdAt: serverTimestamp(),
            });
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
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
                    <FormItem><FormLabel>Contact Phone</FormLabel><FormControl><Input placeholder="024-xxx-xxxx" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                    Add Vendor
                </Button>
            </form>
        </Form>
    );
}


export default function VendorsPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const [isFormOpen, setFormOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role || '');

    const vendorsQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'vendors'), where('schoolId', '==', schoolId), orderBy('name')) : null, 
    [firestore, schoolId]);
    const { data: vendors, isLoading: loadingVendors, forceRefetch } = useCollection<Vendor>(vendorsQuery);

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this vendor from your directory?")) return;
        try {
            await deleteDoc(doc(firestore!, 'vendors', id));
            toast({ title: "Deleted", description: "Vendor removed successfully." });
            forceRefetch();
        } catch (e) {
            toast({ variant: 'destructive', title: "Error", description: "Could not delete vendor." });
        }
    };

    const filteredVendors = useMemo(() => {
        if (!vendors) return [];
        return vendors.filter(v => 
            v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [vendors, searchTerm]);

    const isLoading = schoolLoading || loadingVendors;

    if (!canAccess) {
        return <Card className="m-6"><CardHeader><CardTitle>Access Denied</CardTitle></CardHeader></Card>;
    }

    return (
        <div className="space-y-6 p-6 max-w-6xl mx-auto">
            <Card className="border-t-4 border-t-indigo-600 shadow-sm">
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                                <UserCheck className="text-indigo-600 h-6 w-6"/> Vendor Directory
                            </CardTitle>
                            <CardDescription>Manage your school's official suppliers and contact information.</CardDescription>
                        </div>
                        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-indigo-600 hover:bg-indigo-700" disabled={!schoolId}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> New Vendor
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader><DialogTitle>Add New Vendor</DialogTitle><DialogDescription>Enter the details for the new supplier.</DialogDescription></DialogHeader>
                                {schoolId && <VendorForm setOpen={setFormOpen} onVendorAdded={forceRefetch} schoolId={schoolId} />}
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by name or email..." 
                            className="pl-8" 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {isLoading ? <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div> : (
                        <div className="rounded-md border overflow-hidden">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead>Vendor Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Contact Info</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredVendors && filteredVendors.length > 0 ? filteredVendors.map(vendor => (
                                        <TableRow key={vendor.id}>
                                            <TableCell className="font-bold">{vendor.name}</TableCell>
                                            <TableCell><Badge variant="outline" className="bg-white">{vendor.category}</Badge></TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-xs text-muted-foreground">
                                                    <span className="font-medium text-slate-700">{vendor.email}</span>
                                                    <span>{vendor.phone}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600" onClick={() => handleDelete(vendor.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                                {searchTerm ? "No vendors match your search." : "No vendors registered for this school yet."}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}