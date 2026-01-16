
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
import { Loader2, PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Vendor, AccountsPayableRecord, payableSchema } from '@/lib/types';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


function PayableForm({ setOpen, onBillAdded }: { setOpen: (open: boolean) => void; onBillAdded: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { data: vendors } = useCollection<Vendor>(useMemoFirebase(() => firestore ? collection(firestore, 'vendors') : null, [firestore]));

    const form = useForm<z.infer<typeof payableSchema>>({
        resolver: zodResolver(payableSchema),
    });

    async function onSubmit(values: z.infer<typeof payableSchema>) {
        if (!firestore) return;
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'accountsPayable'), {
                ...values,
                status: 'Unpaid',
                createdAt: serverTimestamp(),
            });
            // TODO: addJournalEntry
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
                        <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
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
                    <FormItem><FormLabel>Expense Account</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an expense account" /></SelectTrigger></FormControl><SelectContent>{/* TODO: Fetch expense accounts */}</SelectContent></Select><FormMessage /></FormItem>
                )} />

                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Record Bill</Button>
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
            // TODO: addJournalEntry
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
                <Select onValueChange={setPaymentAccountId}><SelectTrigger><SelectValue placeholder="Select payment account (e.g., bank)"/></SelectTrigger><SelectContent>{/* TODO: Fetch asset accounts */}</SelectContent></Select>
            </div>
             <Button onClick={handlePayment} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Confirm Payment</Button>
        </DialogContent>
    );
}


export default function AccountsPayablePage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const [isFormOpen, setFormOpen] = useState(false);
    const [payingBill, setPayingBill] = useState<AccountsPayableRecord | null>(null);

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);

    const payablesQuery = useMemoFirebase(() => firestore ? collection(firestore, 'accountsPayable') : null, [firestore]);
    const { data: payables, isLoading, forceRefetch } = useCollection<AccountsPayableRecord>(payablesQuery);
    const { data: vendors } = useCollection<Vendor>(useMemoFirebase(() => firestore ? collection(firestore, 'vendors') : null, [firestore]));
    
    const unpaidBills = useMemo(() => payables?.filter(p => p.status === 'Unpaid'), [payables]);
    const paidBills = useMemo(() => payables?.filter(p => p.status === 'Paid'), [payables]);

    const getVendorName = (vendorId: string) => vendors?.find(v => v.id === vendorId)?.name || 'Unknown Vendor';

    if (!canAccess) {
        return <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is restricted to financial staff.</CardDescription></CardHeader></Card>;
    }
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                     <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Accounts Payable</CardTitle>
                            <CardDescription>Track and manage bills from vendors.</CardDescription>
                        </div>
                        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                            <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> Record New Bill</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Record a New Bill</DialogTitle><DialogDescription>Enter the details from the vendor's invoice.</DialogDescription></DialogHeader>
                                <PayableForm setOpen={setFormOpen} onBillAdded={forceRefetch} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="unpaid">
                        <TabsList>
                            <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
                            <TabsTrigger value="paid">Paid</TabsTrigger>
                        </TabsList>
                        <TabsContent value="unpaid">
                            {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                                <Table>
                                    <TableHeader><TableRow><TableHead>Vendor</TableHead><TableHead>Description</TableHead><TableHead>Amount</TableHead><TableHead>Due Date</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {unpaidBills?.map(bill => (
                                            <TableRow key={bill.id}>
                                                <TableCell>{getVendorName(bill.vendorId)}</TableCell>
                                                <TableCell>{bill.description}</TableCell>
                                                <TableCell>GH₵{bill.amount.toFixed(2)}</TableCell>
                                                <TableCell>{bill.dueDate.toDate ? format(bill.dueDate.toDate(), 'PPP') : 'N/A'}</TableCell>
                                                <TableCell><Button size="sm" onClick={() => setPayingBill(bill)}>Pay Bill</Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </TabsContent>
                         <TabsContent value="paid">
                            {isLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                                <Table>
                                    <TableHeader><TableRow><TableHead>Vendor</TableHead><TableHead>Description</TableHead><TableHead>Amount</TableHead><TableHead>Paid At</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {paidBills?.map(bill => (
                                            <TableRow key={bill.id}>
                                                <TableCell>{getVendorName(bill.vendorId)}</TableCell>
                                                <TableCell>{bill.description}</TableCell>
                                                <TableCell>GH₵{bill.amount.toFixed(2)}</TableCell>
                                                <TableCell>{bill.paidAt?.toDate ? format(bill.paidAt.toDate(), 'PPP') : 'N/A'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
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

    