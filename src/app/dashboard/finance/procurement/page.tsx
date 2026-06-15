'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, serverTimestamp, updateDoc, writeBatch, query, where, addDoc, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, CalendarIcon, Truck } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Vendor, AccountsPayableRecord, payableSchema } from '@/lib/types';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCurrentSchool } from '@/hooks/use-current-school';


function PayableForm({ setOpen, onBillAdded, schoolId }: { setOpen: (open: boolean) => void; onBillAdded: () => void; schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { data: vendors } = useCollection<Vendor>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'vendors'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));

    const form = useForm<z.infer<typeof payableSchema>>({
        resolver: zodResolver(payableSchema),
        defaultValues: {
            description: '',
            amount: 0,
            invoiceNumber: '',
            vendorId: '',
            expenseAccountId: '',
        }
    });

    async function onSubmit(values: z.infer<typeof payableSchema>) {
        if (!firestore || !schoolId) return;
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'accountsPayable'), {
                ...values,
                status: 'Unpaid',
                createdAt: serverTimestamp(),
                schoolId: schoolId,
            });
            toast({ title: 'Success', description: 'Bill has been recorded.' });
            onBillAdded();
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to record bill.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="vendorId" render={({ field }) => (
                    <FormItem><FormLabel>Vendor</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a vendor" /></SelectTrigger></FormControl><SelectContent>{vendors?.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="e.g., Janitorial services for March" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="amount" render={({ field }) => (
                        <FormItem><FormLabel>Amount (GH₵)</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="dueDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Due Date</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                        <Button variant={'outline'} className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                        </FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="invoiceNumber" render={({ field }) => (
                    <FormItem><FormLabel>Invoice # (Optional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="expenseAccountId" render={({ field }) => (
                    <FormItem><FormLabel>Expense Account</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an expense account" /></SelectTrigger></FormControl><SelectContent>
                        {/* Static mapping for now, in a real app this would come from the Chart of Accounts */}
                        <SelectItem value="office-supplies">Office Supplies</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent></Select><FormMessage /></FormItem>
                )} />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Record Bill
                </Button>
            </form>
        </Form>
    );
}

function PayBillDialog({ bill, setOpen, onBillPaid }: { bill: AccountsPayableRecord; setOpen: (open: boolean) => void; onBillPaid: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentAccountId, setPaymentAccountId] = useState('');

    async function handlePayment() {
        if (!firestore || !paymentAccountId) {
            toast({ variant: 'destructive', title: 'Error', description: 'Please select a payment account.' });
            return;
        }
        setIsSubmitting(true);
        try {
            await updateDoc(doc(firestore, 'accountsPayable', bill.id), {
                status: 'Paid',
                paidAt: serverTimestamp(),
                paymentAccountId,
            });
            toast({ title: 'Success', description: 'Bill has been marked as paid.' });
            onBillPaid();
            setOpen(false);
        } catch(error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to process payment.' });
        } finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <DialogContent>
            <DialogHeader><DialogTitle>Confirm Bill Payment</DialogTitle><DialogDescription>You are about to pay a bill for GH₵{bill.amount.toFixed(2)} to a vendor.</DialogDescription></DialogHeader>
            <div className="space-y-4 py-4">
                <Select onValueChange={setPaymentAccountId}>
                    <SelectTrigger><SelectValue placeholder="Select payment account (e.g., bank)"/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bank-main">Main Operating Bank Account</SelectItem>
                        <SelectItem value="petty-cash">Petty Cash</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <Button onClick={handlePayment} disabled={isSubmitting} className="w-full">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Payment
            </Button>
        </DialogContent>
    );
}


const formatDateSafe = (date: any) => {
    if (!date) return 'N/A';
    if (typeof date.toDate === 'function') return format(date.toDate(), 'PPP');
    return format(new Date(date), 'PPP');
};

export default function AccountsPayablePage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const [isFormOpen, setFormOpen] = useState(false);
    const [payingBill, setPayingBill] = useState<AccountsPayableRecord | null>(null);

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role || '');

    const payablesQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'accountsPayable'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, 
    [firestore, schoolId]);
    const { data: payables, isLoading: isLoadingPayables, forceRefetch } = useCollection<AccountsPayableRecord>(payablesQuery);
    
    const vendorsQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'vendors'), where('schoolId', '==', schoolId)) : null, 
    [firestore, schoolId]);
    const { data: vendors } = useCollection<Vendor>(vendorsQuery);
    
    const unpaidBills = useMemo(() => payables?.filter(p => p.status === 'Unpaid'), [payables]);
    const paidBills = useMemo(() => payables?.filter(p => p.status === 'Paid'), [payables]);

    const getVendorName = (vendorId: string) => vendors?.find(v => v.id === vendorId)?.name || 'Unknown Vendor';

    const isLoading = schoolLoading || isLoadingPayables;

    if (!canAccess) {
        return <Card className="m-6"><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is restricted to financial staff.</CardDescription></CardHeader></Card>;
    }
    
    return (
        <div className="space-y-6 p-6">
            <Card className="border-t-4 border-t-indigo-600 shadow-sm">
                <CardHeader>
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2"><Truck className="text-indigo-600 h-6 w-6"/> Procurement & Payables</CardTitle>
                            <CardDescription>Track and manage bills from vendors and suppliers.</CardDescription>
                        </div>
                        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-indigo-600 hover:bg-indigo-700">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Record New Bill
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader><DialogTitle>Record a New Bill</DialogTitle><DialogDescription>Enter the details from the vendor's invoice.</DialogDescription></DialogHeader>
                                {schoolId && <PayableForm setOpen={setFormOpen} onBillAdded={forceRefetch} schoolId={schoolId} />}
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="unpaid">
                        <TabsList className="mb-4">
                            <TabsTrigger value="unpaid">Unpaid Bills ({unpaidBills?.length || 0})</TabsTrigger>
                            <TabsTrigger value="paid">Paid Bills ({paidBills?.length || 0})</TabsTrigger>
                        </TabsList>
                        <TabsContent value="unpaid">
                            {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div> : (
                                <div className="rounded-md border bg-white">
                                    <Table>
                                        <TableHeader><TableRow><TableHead>Vendor</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Due Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            {unpaidBills && unpaidBills.length > 0 ? unpaidBills.map(bill => (
                                                <TableRow key={bill.id}>
                                                    <TableCell className="font-medium">{getVendorName(bill.vendorId)}</TableCell>
                                                    <TableCell className="max-w-xs truncate">{bill.description}</TableCell>
                                                    <TableCell className="text-right font-bold">GH₵{bill.amount.toFixed(2)}</TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">{formatDateSafe(bill.dueDate)}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button size="sm" onClick={() => setPayingBill(bill)} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200">
                                                            Process Payment
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">No unpaid bills found.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </TabsContent>
                         <TabsContent value="paid">
                            {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div> : (
                                <div className="rounded-md border bg-white">
                                    <Table>
                                        <TableHeader><TableRow><TableHead>Vendor</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Paid At</TableHead></TableRow></TableHeader>
                                        <TableBody>
                                            {paidBills && paidBills.length > 0 ? paidBills.map(bill => (
                                                <TableRow key={bill.id}>
                                                    <TableCell className="font-medium">{getVendorName(bill.vendorId)}</TableCell>
                                                    <TableCell className="max-w-xs truncate">{bill.description}</TableCell>
                                                    <TableCell className="text-right font-bold">GH₵{bill.amount.toFixed(2)}</TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">{formatDateSafe(bill.paidAt)}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground">No payment history found.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <Dialog open={!!payingBill} onOpenChange={(open) => !open && setPayingBill(null)}>
                {payingBill && <PayBillDialog bill={payingBill} setOpen={() => setPayingBill(null)} onBillPaid={forceRefetch} />}
            </Dialog>
        </div>
    );
}