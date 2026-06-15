
'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, BookMarked } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MOCK_CHART_OF_ACCOUNTS } from '@/lib/data';
import { accountSchema, ChartOfAccount, ACCOUNT_TYPES } from '@/lib/types';
import { cn } from '@/lib/utils';

// --- New Account Form ---
function AccountForm({ setOpen, onAccountAdded }: { setOpen: (open: boolean) => void; onAccountAdded: () => void }) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const controlAccounts = MOCK_CHART_OF_ACCOUNTS.filter(acc => acc.isControlAccount);

    const form = useForm<z.infer<typeof accountSchema>>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            parentAccountId: 'None',
        },
    });

    function onSubmit(values: z.infer<typeof accountSchema>) {
        setIsSubmitting(true);

        const isControl = values.parentAccountId === 'None';
        let newAccountId: string;

        if (isControl) {
            const sameTypeAccounts = MOCK_CHART_OF_ACCOUNTS.filter(acc => acc.type === values.type && acc.isControlAccount);
            newAccountId = `${(ACCOUNT_TYPES.indexOf(values.type) + 1) * 1000 + (sameTypeAccounts.length * 100)}`;
        } else {
            const parentAccount = MOCK_CHART_OF_ACCOUNTS.find(acc => acc.accountId === values.parentAccountId);
            const subAccounts = MOCK_CHART_OF_ACCOUNTS.filter(acc => acc.parentAccountId === values.parentAccountId);
            newAccountId = `${parentAccount?.accountId || '0000'}-${(subAccounts.length + 1).toString().padStart(2, '0')}`;
        }
        
        const newAccount: ChartOfAccount = {
            accountId: newAccountId,
            name: values.name,
            type: values.type,
            isControlAccount: isControl,
            parentAccountId: isControl ? undefined : values.parentAccountId,
            description: values.description,
        };

        MOCK_CHART_OF_ACCOUNTS.push(newAccount);
        
        toast({ title: 'Success', description: 'New account has been added to the chart.' });
        onAccountAdded();
        form.reset();
        setOpen(false);
        setIsSubmitting(false);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Account Name</FormLabel><FormControl><Input placeholder="e.g., Office Supplies" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>Account Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a type" /></SelectTrigger></FormControl><SelectContent>{ACCOUNT_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="parentAccountId" render={({ field }) => (
                    <FormItem><FormLabel>Parent Account</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="None">None (Create new Control Account)</SelectItem>{controlAccounts.map(acc => <SelectItem key={acc.accountId} value={acc.accountId}>{acc.name} ({acc.accountId})</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the purpose of this account" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Account</Button>
            </form>
        </Form>
    );
}

export default function ChartOfAccountsPage() {
    const { role } = useRole();
    const [isFormOpen, setFormOpen] = useState(false);
    const [accounts, setAccounts] = useState(MOCK_CHART_OF_ACCOUNTS);

    const canAccess = role ? ['Administrator', 'Director', 'Accountant'].includes(role) : false;

    const sortedAccounts = useMemo(() => {
        const controlAccounts = accounts.filter(a => a.isControlAccount).sort((a, b) => a.accountId.localeCompare(b.accountId));
        const subAccounts = accounts.filter(a => !a.isControlAccount);

        const result: ChartOfAccount[] = [];
        controlAccounts.forEach(control => {
            result.push(control);
            const children = subAccounts.filter(sub => sub.parentAccountId === control.accountId).sort((a, b) => a.accountId.localeCompare(b.accountId));
            result.push(...children);
        });
        return result;
    }, [accounts]);
    
    const onAccountAdded = () => {
        // This forces a re-render by creating a new array reference
        setAccounts([...MOCK_CHART_OF_ACCOUNTS]);
    }

    if (!canAccess) {
        return <Card><CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is restricted to financial staff.</CardDescription></CardHeader></Card>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="flex items-center gap-2"><BookMarked /> Chart of Accounts</CardTitle>
                            <CardDescription>The foundational structure of the school's financial ledger.</CardDescription>
                        </div>
                        <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                            <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> New Account</Button></DialogTrigger>
                            <DialogContent>
                                <DialogHeader><DialogTitle>Create New Ledger Account</DialogTitle><DialogDescription>Define a new account for financial tracking.</DialogDescription></DialogHeader>
                                <AccountForm setOpen={setFormOpen} onAccountAdded={onAccountAdded} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Account Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Parent Account</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedAccounts.map(acc => (
                                <TableRow key={acc.accountId} className={cn(acc.isControlAccount && 'bg-muted/50 font-bold')}>
                                    <TableCell>{acc.accountId}</TableCell>
                                    <TableCell>{acc.name}</TableCell>
                                    <TableCell>{acc.type}</TableCell>
                                    <TableCell>{acc.parentAccountId || '-'}</TableCell>
                                    <TableCell>{acc.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
