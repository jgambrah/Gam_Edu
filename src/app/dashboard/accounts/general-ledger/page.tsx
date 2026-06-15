'use client';

import { useState, useMemo, useRef } from 'react';
import { useRole } from '@/context/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Printer, BookOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MOCK_CHART_OF_ACCOUNTS, MOCK_JOURNAL_ENTRIES } from '@/lib/data';
import { GeneralLedgerTransaction, journalEntrySchema, ChartOfAccount } from '@/lib/types';

// --- Manual Journal Entry Form ---
function JournalEntryForm({ setOpen, onEntryAdded }: { setOpen: (open: boolean) => void; onEntryAdded: () => void }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const postableAccounts = MOCK_CHART_OF_ACCOUNTS.filter(acc => !acc.isControlAccount);

    const form = useForm<z.infer<typeof journalEntrySchema>>({
        resolver: zodResolver(journalEntrySchema),
    });

    function onSubmit(values: z.infer<typeof journalEntrySchema>) {
        setIsSubmitting(true);
        // Simulate adding the entry
        const newEntry: GeneralLedgerTransaction = {
            id: MOCK_JOURNAL_ENTRIES.length + 1,
            ref: `MANUAL-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            description: values.description,
            debits: [{ accountId: values.debitAccountId, amount: values.amount }],
            credits: [{ accountId: values.creditAccountId, amount: values.amount }],
        };
        MOCK_JOURNAL_ENTRIES.push(newEntry);
        
        toast({ title: 'Success', description: 'Journal entry has been recorded.' });
        onEntryAdded();
        form.reset();
        setOpen(false);
        setIsSubmitting(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="e.g., Office supplies purchase" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="amount" render={({ field }) => (
                    <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="debitAccountId" render={({ field }) => (
                        <FormItem><FormLabel>Debit Account</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Choose account to debit" /></SelectTrigger></FormControl><SelectContent>{postableAccounts.map(acc => <SelectItem key={acc.accountId} value={acc.accountId}>{acc.name} ({acc.accountId})</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="creditAccountId" render={({ field }) => (
                        <FormItem><FormLabel>Credit Account</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Choose account to credit" /></SelectTrigger></FormControl><SelectContent>{postableAccounts.map(acc => <SelectItem key={acc.accountId} value={acc.accountId}>{acc.name} ({acc.accountId})</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                </div>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Record Entry</Button>
            </form>
        </Form>
    );
}

export default function GeneralLedgerPage() {
    const { role } = useRole();
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
    const [isFormOpen, setFormOpen] = useState(false);
    const ledgerRef = useRef<HTMLDivElement>(null);

    const postableAccounts = MOCK_CHART_OF_ACCOUNTS.filter(acc => !acc.isControlAccount);

    // This function would be a backend call in a real app
    const getAccountLedger = (accountId: string) => {
        const transactions = MOCK_JOURNAL_ENTRIES.filter(entry => 
            entry.debits.some(d => d.accountId === accountId) ||
            entry.credits.some(c => c.accountId === accountId)
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let runningBalance = 0;
        let totalDebits = 0;
        let totalCredits = 0;

        const ledgerEntries = transactions.map(tx => {
            const debit = tx.debits.find(d => d.accountId === accountId)?.amount || 0;
            const credit = tx.credits.find(c => c.accountId === accountId)?.amount || 0;
            totalDebits += debit;
            totalCredits += credit;
            runningBalance += (debit - credit);
            return { ...tx, debit, credit, balance: runningBalance };
        });

        return {
            entries: ledgerEntries,
            summary: {
                totalDebits,
                totalCredits,
                endingBalance: runningBalance
            }
        };
    };

    const ledger = useMemo(() => {
        if (!selectedAccountId) return null;
        return getAccountLedger(selectedAccountId);
    }, [selectedAccountId]);

    const handlePrint = () => {
        const printContents = ledgerRef.current?.innerHTML;
        const originalContents = document.body.innerHTML;
        if (printContents) {
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); // Reload to restore event listeners
        }
    };

    if (!role || !['Administrator', 'Director', 'Accountant'].includes(role)) {
        return <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is restricted to financial staff.</CardDescription></CardHeader></Card>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2"><BookOpen /> General Ledger</CardTitle>
                            <CardDescription>View detailed transaction history for any account.</CardDescription>
                        </div>
                        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                            <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> New Journal Entry</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Manual Journal Entry</DialogTitle><DialogDescription>Record a double-entry transaction.</DialogDescription></DialogHeader>
                                <JournalEntryForm setOpen={setFormOpen} onEntryAdded={() => { if(selectedAccountId) { setSelectedAccountId(null); setTimeout(() => setSelectedAccountId(selectedAccountId), 0); } }} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="w-full md:w-1/3">
                        <Select onValueChange={setSelectedAccountId}>
                            <SelectTrigger><SelectValue placeholder="Select an account to view ledger" /></SelectTrigger>
                            <SelectContent>{postableAccounts.map(acc => <SelectItem key={acc.accountId} value={acc.accountId}>{acc.name} ({acc.accountId})</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {selectedAccountId && ledger && (
                <div ref={ledgerRef}>
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Ledger for: {MOCK_CHART_OF_ACCOUNTS.find(a => a.accountId === selectedAccountId)?.name}</CardTitle>
                                    <CardDescription>Account ID: {selectedAccountId}</CardDescription>
                                </div>
                                <Button variant="outline" onClick={handlePrint} className="print:hidden"><Printer className="mr-2 h-4 w-4" /> Print Statement</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Ref #</TableHead>
                                        <TableHead className="text-right">Debit</TableHead><TableHead className="text-right">Credit</TableHead><TableHead className="text-right">Balance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ledger.entries.map(entry => (
                                        <TableRow key={entry.id}>
                                            <TableCell>{entry.date}</TableCell><TableCell>{entry.description}</TableCell><TableCell>{entry.ref}</TableCell>
                                            <TableCell className="text-right">{entry.debit > 0 ? `GH₵${entry.debit.toFixed(2)}` : '-'}</TableCell>
                                            <TableCell className="text-right">{entry.credit > 0 ? `GH₵${entry.credit.toFixed(2)}` : '-'}</TableCell>
                                            <TableCell className="text-right font-medium">GH₵{entry.balance.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                        <CardFooter>
                            <div className="w-full grid md:grid-cols-3 gap-4">
                                <Card><CardHeader><CardTitle>Total Debits</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">GH₵{ledger.summary.totalDebits.toFixed(2)}</p></CardContent></Card>
                                <Card><CardHeader><CardTitle>Total Credits</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">GH₵{ledger.summary.totalCredits.toFixed(2)}</p></CardContent></Card>
                                <Card className="border-primary"><CardHeader><CardTitle>Ending Balance</CardTitle></CardHeader><CardContent><p className="text-xl font-bold">GH₵{ledger.summary.endingBalance.toFixed(2)}</p></CardContent></Card>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    );
}
