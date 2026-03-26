'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, doc, writeBatch, serverTimestamp, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Receipt, Printer, Landmark, Banknote, ShieldCheck } from 'lucide-react';
import { Account, JournalLine } from '@/lib/types';

// --- PHASE 1: TAX CONSTANTS ---
const GHANA_WHT_RATES = [
  { label: 'None (0%)', rate: 0 },
  { label: 'Goods / Supply (3%)', rate: 0.03 },
  { label: 'Services (7.5%)', rate: 0.075 },
  { label: 'Rent (8%)', rate: 0.08 },
  { label: 'Consultancy/Professional (7.5%)', rate: 0.075 },
];

const GHANA_VAT_RATES = [
  { label: 'No VAT (0%)', rate: 0 },
  { label: 'Standard VAT + Levies (21.9%)', rate: 0.219 }, 
  { label: 'Flat Rate Scheme (4%)', rate: 0.04 },
];

// --- SCHEMA ---
const pvSchema = z.object({
    payee: z.string().min(1, "Payee name is required."),
    description: z.string().min(1, "Particulars are required."),
    grossAmount: z.coerce.number().min(0.01, "Amount must be positive."),
    whtRate: z.coerce.number(),
    vatRate: z.coerce.number(),
    debitAccountId: z.string().min(1, "Select an expense or asset account."),
    creditAccountId: z.string().min(1, "Select a bank or cash account."),
});

type PVFormValues = z.infer<typeof pvSchema>;

// --- PHASE 2: FORM COMPONENT ---
function PaymentVoucherForm({ 
    setOpen, 
    accounts, 
    schoolId, 
    onSuccess 
}: { 
    setOpen: (o: boolean) => void; 
    accounts: Account[]; 
    schoolId: string;
    onSuccess: () => void;
}) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<PVFormValues>({
        resolver: zodResolver(pvSchema),
        defaultValues: {
            whtRate: 0,
            vatRate: 0,
            grossAmount: 0,
        }
    });

    const watchGross = form.watch('grossAmount');
    const watchWHT = form.watch('whtRate');
    const watchVAT = form.watch('vatRate');

    const calculations = useMemo(() => {
        const gross = parseFloat(String(watchGross)) || 0;
        const wht = gross * (parseFloat(String(watchWHT)) || 0);
        const vat = gross * (parseFloat(String(watchVAT)) || 0);
        const net = (gross + vat) - wht;
        return { wht, vat, net };
    }, [watchGross, watchWHT, watchVAT]);

    const expenseAccounts = accounts.filter(a => ['Expense', 'Asset'].includes(a.type) && !a.isControlAccount);
    const assetAccounts = accounts.filter(a => ['Asset'].includes(a.type) && !a.isControlAccount);

    // --- PHASE 3: SUBMISSION LOGIC ---
    async function onSubmit(values: PVFormValues) {
        if (!firestore || !user || !schoolId) return;
        setIsSubmitting(true);

        try {
            const batch = writeBatch(firestore);
            const timestamp = serverTimestamp();
            
            // 1. Generate PV Number
            const pvNumber = `PV-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            
            const pvRef = doc(collection(firestore, 'payment_vouchers'));
            const { wht, vat, net } = calculations;

            batch.set(pvRef, {
                pvNumber,
                payee: values.payee,
                description: values.description,
                grossAmount: values.grossAmount,
                whtAmount: wht,
                vatAmount: vat,
                netPayable: net,
                debitAccountId: values.debitAccountId,
                creditAccountId: values.creditAccountId,
                status: 'Processed',
                preparedBy: user.uid,
                preparedByName: user.displayName || user.email,
                schoolId: schoolId,
                createdAt: timestamp
            });

            // 2. Double-Entry Journal
            const journalLines: JournalLine[] = [];
            
            // Debit the primary account (Expense or Asset)
            const debitAcc = accounts.find(a => a.id === values.debitAccountId);
            journalLines.push({
                accountId: values.debitAccountId,
                accountName: debitAcc?.name || 'Account',
                debit: values.grossAmount,
                credit: 0
            });

            // Credit the Bank/Cash account (The check/transfer amount)
            const creditAcc = accounts.find(a => a.id === values.creditAccountId);
            journalLines.push({
                accountId: values.creditAccountId,
                accountName: creditAcc?.name || 'Cash/Bank',
                debit: 0,
                credit: net
            });

            // Tax Lines
            if (wht > 0) {
                const whtAcc = accounts.find(a => a.name.toLowerCase().includes('withholding tax')) || 
                               accounts.find(a => a.type === 'Liability' && a.name.includes('Tax'));
                journalLines.push({
                    accountId: whtAcc?.id || 'WHT-PAYABLE-DEFAULT',
                    accountName: whtAcc?.name || 'WHT Payable',
                    debit: 0,
                    credit: wht
                });
            }

            if (vat > 0) {
                const vatAcc = accounts.find(a => a.name.toLowerCase().includes('vat input')) || 
                               accounts.find(a => a.type === 'Asset' && a.name.includes('VAT'));
                journalLines.push({
                    accountId: vatAcc?.id || 'VAT-INPUT-DEFAULT',
                    accountName: vatAcc?.name || 'VAT Input',
                    debit: vat,
                    credit: 0
                });
            }

            const journalRef = doc(collection(firestore, 'journal_entries'));
            batch.set(journalRef, {
                date: timestamp,
                reference: pvNumber,
                description: `PV ${pvNumber}: ${values.description} to ${values.payee}`,
                lines: journalLines,
                totalAmount: values.grossAmount + vat, // Balanced debits
                createdBy: user.uid,
                createdAt: timestamp,
                schoolId: schoolId
            });

            await batch.commit();
            toast({ title: "PV Processed", description: `Voucher ${pvNumber} generated and ledger updated.` });
            onSuccess();
            setOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Processing Error", description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Payee Name</Label>
                    <Input {...form.register('payee')} placeholder="Vendor or Staff Name" />
                    {form.formState.errors.payee && <p className="text-xs text-red-500">{form.formState.errors.payee.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label>Description / Particulars</Label>
                    <Input {...form.register('description')} placeholder="Reason for payment" />
                    {form.formState.errors.description && <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="space-y-2">
                    <Label>Gross Amount (GH₵)</Label>
                    <Input type="number" step="0.01" {...form.register('grossAmount')} className="font-bold text-lg" />
                </div>
                <div className="space-y-2">
                    <Label>WHT Rate</Label>
                    <Select onValueChange={(v) => form.setValue('whtRate', parseFloat(v))} defaultValue="0">
                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {GHANA_WHT_RATES.map(r => <SelectItem key={r.label} value={String(r.rate)}>{r.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>VAT Rate</Label>
                    <Select onValueChange={(v) => form.setValue('vatRate', parseFloat(v))} defaultValue="0">
                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {GHANA_VAT_RATES.map(r => <SelectItem key={r.label} value={String(r.rate)}>{r.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* LIVE CALCULATIONS PREVIEW */}
            <div className="grid grid-cols-3 gap-2 py-4 border-y border-dashed">
                <div className="text-center"><p className="text-[10px] uppercase text-slate-400 font-bold">VAT Added</p><p className="text-sm font-bold text-emerald-600">+GH₵{calculations.vat.toFixed(2)}</p></div>
                <div className="text-center"><p className="text-[10px] uppercase text-slate-400 font-bold">WHT Deducted</p><p className="text-sm font-bold text-rose-600">-GH₵{calculations.wht.toFixed(2)}</p></div>
                <div className="text-center bg-indigo-50 rounded-lg py-1"><p className="text-[10px] uppercase text-indigo-400 font-bold">Net Payable</p><p className="text-sm font-black text-indigo-700">GH₵{calculations.net.toFixed(2)}</p></div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Debit Account (Expense/Asset)</Label>
                    <Select onValueChange={(v) => form.setValue('debitAccountId', v)}>
                        <SelectTrigger><SelectValue placeholder="Select account..." /></SelectTrigger>
                        <SelectContent>
                            {expenseAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Credit Account (Bank/Cash)</Label>
                    <Select onValueChange={(v) => form.setValue('creditAccountId', v)}>
                        <SelectTrigger><SelectValue placeholder="Select account..." /></SelectTrigger>
                        <SelectContent>
                            {assetAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 font-bold">
                {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <Receipt className="mr-2 h-4 w-4"/>}
                Process Payment Voucher
            </Button>
        </form>
    );
}

// --- PHASE 4: MAIN PAGE ---
export default function PaymentVouchersPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const { toast } = useToast();

    const [isAddOpen, setIsAddOpen] = useState(false);

    const accountsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'accounts'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: accounts, isLoading: accountsLoading } = useCollection<Account>(accountsQuery);

    const pvQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'payment_vouchers'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, [firestore, schoolId]);
    const { data: vouchers, isLoading: pvLoading, forceRefetch } = useCollection<any>(pvQuery);

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role || '');

    if (!canAccess) return <Card className="m-6"><CardHeader><CardTitle>Access Denied</CardTitle></CardHeader></Card>;

    const isLoading = schoolLoading || accountsLoading || pvLoading;

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <Receipt className="h-8 w-8 text-indigo-600"/> Payment Vouchers
                    </h1>
                    <p className="text-muted-foreground font-medium italic">Process payments with automatic Ghana tax calculations.</p>
                </div>
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 font-bold shadow-lg shadow-indigo-900/10">
                            <Plus className="mr-2 h-4 w-4" /> New Voucher
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Create Payment Voucher</DialogTitle>
                            <DialogDescription>Ensure all taxes and GL accounts are correctly assigned.</DialogDescription>
                        </DialogHeader>
                        {schoolId && accounts && (
                            <PaymentVoucherForm 
                                setOpen={setIsAddOpen} 
                                accounts={accounts} 
                                schoolId={schoolId} 
                                onSuccess={forceRefetch} 
                            />
                        )}
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-indigo-600"/></div>
                    ) : !vouchers || vouchers.length === 0 ? (
                        <div className="text-center py-32 text-slate-400 bg-slate-50/50">
                            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-20"/>
                            <p className="font-bold uppercase tracking-widest text-xs">No vouchers processed yet.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead>PV Number</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Payee</TableHead>
                                    <TableHead className="text-right">Gross</TableHead>
                                    <TableHead className="text-right">VAT</TableHead>
                                    <TableHead className="text-right">WHT</TableHead>
                                    <TableHead className="text-right font-bold">Net Payable</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vouchers.map((pv: any) => (
                                    <TableRow key={pv.id} className="hover:bg-slate-50 transition-colors">
                                        <TableCell className="font-mono font-bold text-xs">{pv.pvNumber}</TableCell>
                                        <TableCell className="text-xs text-slate-500">
                                            {pv.createdAt?.toDate ? format(pv.createdAt.toDate(), 'dd MMM yy') : 'Pending'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-800 text-sm">{pv.payee}</span>
                                                <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{pv.description}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-xs">GH₵{pv.grossAmount?.toFixed(2)}</TableCell>
                                        <TableCell className="text-right text-xs text-emerald-600">+{pv.vatAmount?.toFixed(2)}</TableCell>
                                        <TableCell className="text-right text-xs text-rose-600">-{pv.whtAmount?.toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-black text-indigo-700">GH₵{pv.netPayable?.toFixed(2)}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 uppercase text-[9px] font-black">
                                                {pv.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
