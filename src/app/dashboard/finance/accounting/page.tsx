'use client';

import { useState, useMemo, useRef } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, orderBy, where, doc, addDoc, serverTimestamp, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { 
  Loader2, Plus, Landmark, Save, Receipt, BookMarked, Printer, Eye, BookOpen, PlusCircle, Download, ShieldCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AppLogo } from '@/components/icons/app-logo';
import { Account, JournalLine, JournalEntry, journalEntrySchema, ACCOUNT_TYPES, accountSchema } from '@/lib/types';
import { cn } from '@/lib/utils';

// --- CONSTANTS: GHANA TAX 2025/2026 (ACT 1151 COMPLIANT) ---
const GHANA_WHT_RATES = [
  { id: 'wht-none',          label: 'None (0%)',                        rate: 0 },
  { id: 'wht-goods',         label: 'Supply of Goods (3%)',             rate: 0.03 },
  { id: 'wht-works',         label: 'Supply of Works (5%)',             rate: 0.05 },
  { id: 'wht-services',      label: 'Supply of Services (7.5%)',        rate: 0.075 },
  { id: 'wht-rent-res',      label: 'Residential Rent (8%)',            rate: 0.08 },
  { id: 'wht-div-int',       label: 'Dividends / Interest (8%)',        rate: 0.08 },
  { id: 'wht-mgmt-nonres',   label: 'Mgmt Fees / Non-Res / Rent (15%)', rate: 0.15 },
  { id: 'wht-allowances',    label: 'Director Allowances (20%)',        rate: 0.20 },
];

const GHANA_VAT_RATES = [
  { id: 'vat-none',          label: 'No VAT (0%)',                      rate: 0 },
  { id: 'vat-consolidated',  label: 'Consolidated Standard Rate (20%)', rate: 0.20 },
];

const pvSchema = z.object({
    payee: z.string().min(1, "Payee name is required."),
    description: z.string().min(1, "Particulars are required."),
    grossAmount: z.coerce.number().min(0.01, "Amount must be positive."),
    whtRateId: z.string(),
    vatRateId: z.string(),
    debitAccountId: z.string().min(1, "Select an expense or asset account."),
    creditAccountId: z.string().min(1, "Select a bank or cash account."),
});

type PVFormValues = z.infer<typeof pvSchema>;

// --- SUB-COMPONENT: ACCOUNT FORM ---
function AccountForm({ setOpen, onAccountAdded, accounts, schoolId }: { setOpen: (open: boolean) => void; onAccountAdded: () => void; accounts: Account[]; schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const controlAccounts = accounts.filter(acc => acc.isControlAccount);

    const form = useForm<z.infer<typeof accountSchema>>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            parentAccountId: 'None',
        },
    });

    async function onSubmit(values: z.infer<typeof accountSchema>) {
        if (!firestore || !schoolId) return;
        setIsSubmitting(true);

        const isControl = values.parentAccountId === 'None';
        let newCode: string;

        if (isControl) {
            const sameTypeAccounts = accounts.filter(acc => acc.type === values.type && acc.isControlAccount);
            newCode = `${(ACCOUNT_TYPES.indexOf(values.type) + 1) * 1000 + (sameTypeAccounts.length * 100)}`;
        } else {
            const parentAccount = accounts.find(acc => acc.id === values.parentAccountId);
            const subAccounts = accounts.filter(acc => acc.parentAccountId === values.parentAccountId);
            newCode = `${parentAccount?.code || '0000'}-${(subAccounts.length + 1).toString().padStart(2, '0')}`;
        }
        
        try {
            const newDocRef = doc(collection(firestore, 'accounts'));
            await setDoc(newDocRef, {
                code: newCode,
                name: values.name,
                type: values.type,
                isControlAccount: isControl,
                parentAccountId: isControl ? null : values.parentAccountId,
                description: values.description || '',
                schoolId: schoolId,
                balance: 0,
                createdAt: serverTimestamp()
            });
            
            toast({ title: 'Success', description: 'New account has been added.' });
            onAccountAdded();
            form.reset();
            setOpen(false);
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsSubmitting(false);
        }
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
                    <FormItem><FormLabel>Parent Account</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="None">None (Create new Control Account)</SelectItem>{controlAccounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.name} ({acc.code})</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe the purpose of this account" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Create Account</Button>
            </form>
        </Form>
    );
}

// --- SUB-COMPONENT: JOURNAL ENTRY FORM ---
function JournalEntryForm({ accounts, schoolId, onEntryAdded }: { accounts: Account[], schoolId: string, onEntryAdded: () => void }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof journalEntrySchema>>({
        resolver: zodResolver(journalEntrySchema),
    });

    const postableAccounts = accounts.filter(a => !a.isControlAccount);

    async function onSubmit(values: z.infer<typeof journalEntrySchema>) {
        if (!firestore || !user || !schoolId) return;
        setIsSubmitting(true);

        try {
            const batch = writeBatch(firestore);
            const timestamp = serverTimestamp();
            const journalRef = doc(collection(firestore, 'journal_entries'));

            const debitAcc = accounts.find(a => a.id === values.debitAccountId);
            const creditAcc = accounts.find(a => a.id === values.creditAccountId);

            const lines: JournalLine[] = [
                { accountId: values.debitAccountId, accountName: debitAcc?.name || 'Account', debit: values.amount, credit: 0 },
                { accountId: values.creditAccountId, accountName: creditAcc?.name || 'Account', debit: 0, credit: values.amount }
            ];

            batch.set(journalRef, {
                date: timestamp,
                description: values.description,
                reference: 'MANUAL',
                lines,
                totalAmount: values.amount,
                createdBy: user.uid,
                createdAt: timestamp,
                schoolId: schoolId
            });

            await batch.commit();
            toast({ title: "Journal Entry Recorded" });
            form.reset();
            onEntryAdded();
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card>
            <CardHeader><CardTitle>Record Manual Journal Entry</CardTitle></CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Input placeholder="e.g. Office rent payment" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="amount" render={({ field }) => (
                            <FormItem><FormLabel>{"Amount (GH₵)"}</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="debitAccountId" render={({ field }) => (
                                <FormItem><FormLabel>Debit Account</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Choose account..." /></SelectTrigger></FormControl>
                                        <SelectContent>{postableAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}</SelectContent>
                                    </Select><FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="creditAccountId" render={({ field }) => (
                                <FormItem><FormLabel>Credit Account</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Choose account..." /></SelectTrigger></FormControl>
                                        <SelectContent>{postableAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}</SelectContent>
                                    </Select><FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Record Entry
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

// --- SUB-COMPONENT: VOUCHER DOCUMENT ---
function VoucherDocument({ pv, schoolProfile }: { pv: any, schoolProfile: any }) {
    return (
        <div className="bg-white text-black p-8 border shadow-sm rounded-lg font-sans max-w-3xl mx-auto" id="printable-voucher">
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
                <div className="flex items-center gap-4">
                    {schoolProfile?.logoUrl ? (
                        <img src={schoolProfile.logoUrl} className="h-16 w-16 object-contain" alt="Logo" />
                    ) : (
                        <AppLogo className="h-16 w-16 text-indigo-600" />
                    )}
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tight">{schoolProfile?.name || 'SCHOOL NAME'}</h1>
                        <p className="text-xs text-slate-500 font-medium">{schoolProfile?.address || 'ADDRESS'}</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-black text-slate-300 uppercase tracking-widest">Voucher</h2>
                    <p className="text-sm font-bold text-slate-900 mt-1">{pv.pvNumber}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pay To:</p>
                    <p className="text-lg font-bold text-slate-900">{pv.payee}</p>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Processed:</p>
                    <p className="text-sm font-bold text-slate-900">
                        {pv.createdAt?.toDate ? format(pv.createdAt.toDate(), 'PPP p') : 'Pending'}
                    </p>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Particulars / Description:</p>
                    <p className="text-slate-800 font-medium">{pv.description}</p>
                </div>
            </div>

            <table className="w-full text-sm mb-8">
                <thead className="bg-slate-900 text-white">
                    <tr>
                        <th className="text-left p-3 rounded-tl-xl">Financial Breakdown</th>
                        <th className="text-right p-3 rounded-tr-xl">Amount (GH₵)</th>
                    </tr>
                </thead>
                <tbody className="border-x border-b rounded-b-xl overflow-hidden">
                    <tr className="border-b">
                        <td className="p-3 font-medium">Gross Amount</td>
                        <td className="p-3 text-right font-mono">{pv.grossAmount?.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b text-emerald-600 font-medium">
                        <td className="p-3">VAT Added</td>
                        <td className="p-3 text-right font-mono">+{pv.vatAmount?.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b text-rose-600 font-medium">
                        <td className="p-3">Withholding Tax (WHT) Deducted</td>
                        <td className="p-3 text-right font-mono">-{pv.whtAmount?.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-indigo-50 font-black text-indigo-900">
                        <td className="p-3 text-lg uppercase">Net Amount Payable</td>
                        <td className="p-3 text-right text-2xl font-mono">GH₵{pv.netPayable?.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-dashed">
                <div className="text-center">
                    <div className="border-b border-black h-8 mb-2"></div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Accountant</p>
                    <p className="text-[8px] font-bold text-slate-500">Prepared By: {pv.preparedByName}</p>
                </div>
                <div className="text-center">
                    <div className="border-b border-black h-8 mb-2"></div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Internal Auditor</p>
                    <p className="text-[8px] font-bold text-slate-500">Vetted & Cleared</p>
                </div>
                <div className="text-center">
                    <div className="border-b border-black h-8 mb-2"></div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Director</p>
                    <p className="text-[8px] font-bold text-slate-500">Authorized Official</p>
                </div>
            </div>
        </div>
    );
}

// --- SUB-COMPONENT: Payment Voucher Form ---
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
            whtRateId: 'wht-none',
            vatRateId: 'vat-none',
            grossAmount: 0,
        }
    });

    const watchGross = form.watch('grossAmount');
    const watchWHTId = form.watch('whtRateId');
    const watchVATId = form.watch('vatRateId');

    const calculations = useMemo(() => {
        const gross = parseFloat(String(watchGross)) || 0;
        const whtRateVal = GHANA_WHT_RATES.find(r => r.id === watchWHTId)?.rate ?? 0;
        const vatRateVal = GHANA_VAT_RATES.find(r => r.id === watchVATId)?.rate ?? 0;
        
        const wht = gross * whtRateVal;
        const vat = gross * vatRateVal;
        const net = (gross + vat) - wht;
        return { wht, vat, net };
    }, [watchGross, watchWHTId, watchVATId]);

    const expenseAccounts = accounts.filter(a => ['Expense', 'Asset'].includes(a.type) && !a.isControlAccount);
    const bankAccounts = accounts.filter(a => ['Asset'].includes(a.type) && !a.isControlAccount);

    async function onSubmit(values: PVFormValues) {
        if (!firestore || !user || !schoolId) return;
        setIsSubmitting(true);

        try {
            const batch = writeBatch(firestore);
            const timestamp = serverTimestamp();
            const pvNumber = `PV-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
            const pvRef = doc(collection(firestore, 'paymentVouchers'));
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

            const journalLines: JournalLine[] = [];
            const debitAcc = accounts.find(a => a.id === values.debitAccountId);
            journalLines.push({ accountId: values.debitAccountId, accountName: debitAcc?.name || 'Account', debit: values.grossAmount, credit: 0 });

            const creditAcc = accounts.find(a => a.id === values.creditAccountId);
            journalLines.push({ accountId: values.creditAccountId, accountName: creditAcc?.name || 'Cash/Bank', debit: 0, credit: net });

            if (wht > 0) {
                const whtAcc = accounts.find(a => a.name.toLowerCase().includes('withholding tax')) || accounts.find(a => a.type === 'Liability');
                journalLines.push({ accountId: whtAcc?.id || 'WHT-PAYABLE-DEFAULT', accountName: whtAcc?.name || 'WHT Payable', debit: 0, credit: wht });
            }
            if (vat > 0) {
                const vatAcc = accounts.find(a => a.name.toLowerCase().includes('vat input')) || accounts.find(a => a.type === 'Asset');
                journalLines.push({ accountId: vatAcc?.id || 'VAT-INPUT-DEFAULT', accountName: vatAcc?.name || 'VAT Input', debit: vat, credit: 0 });
            }

            const journalRef = doc(collection(firestore, 'journal_entries'));
            batch.set(journalRef, {
                date: timestamp,
                reference: pvNumber,
                description: `PV ${pvNumber}: ${values.description} to ${values.payee}`,
                lines: journalLines,
                totalAmount: values.grossAmount + vat,
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
                </div>
                <div className="space-y-2">
                    <Label>Description / Particulars</Label>
                    <Input {...form.register('description')} placeholder="Reason for payment" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="space-y-2">
                    <Label>{"Gross Amount (GH₵)"}</Label>
                    <Input type="number" step="0.01" {...form.register('grossAmount')} className="font-bold text-lg" />
                </div>
                <div className="space-y-2">
                    <Label>WHT Type</Label>
                    <Select onValueChange={(id) => form.setValue('whtRateId', id)} value={watchWHTId}>
                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {GHANA_WHT_RATES.map(r => <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>VAT Rate (Act 1151)</Label>
                    <Select onValueChange={(id) => form.setValue('vatRateId', id)} value={watchVATId}>
                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {GHANA_VAT_RATES.map(r => <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-4 border-y border-dashed text-center">
                <div><p className="text-[10px] uppercase text-slate-400 font-bold">VAT Added</p><p className="text-sm font-bold text-emerald-600">{" +GH₵ " + calculations.vat.toFixed(2)}</p></div>
                <div><p className="text-[10px] uppercase text-slate-400 font-bold">WHT Deducted</p><p className="text-sm font-bold text-rose-600">{" -GH₵ " + calculations.wht.toFixed(2)}</p></div>
                <div className="bg-indigo-50 rounded-lg py-1"><p className="text-[10px] uppercase text-indigo-400 font-bold">Net Payable</p><p className="text-sm font-black text-indigo-700">{" GH₵ " + calculations.net.toFixed(2)}</p></div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Debit Account (Expense/Asset)</Label>
                    <Select onValueChange={(v) => form.setValue('debitAccountId', v)}>
                        <SelectTrigger><SelectValue placeholder="Select account..." /></SelectTrigger>
                        <SelectContent>{expenseAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Credit Account (Bank/Cash)</Label>
                    <Select onValueChange={(v) => form.setValue('creditAccountId', v)}>
                        <SelectTrigger><SelectValue placeholder="Select account..." /></SelectTrigger>
                        <SelectContent>{bankAccounts.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-indigo-600 font-bold">
                {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Receipt className="mr-2 h-4 w-4"/>}
                Process Payment Voucher
            </Button>
        </form>
    );
}

// --- MAIN PAGE ---
export default function AccountingPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
    const { toast } = useToast();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedPV, setSelectedPV] = useState<any>(null);
    const [isExporting, setIsExporting] = useState(false);

    const accountsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'accounts'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: accounts, isLoading: accountsLoading, forceRefetch: forceRefetchAccounts } = useCollection<Account>(accountsQuery);

    const journalsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'journal_entries'), where('schoolId', '==', schoolId), orderBy('date', 'desc')) : null, [firestore, schoolId]);
    const { data: journals, isLoading: jLoading, forceRefetch: forceRefetchJournals } = useCollection<JournalEntry>(journalsQuery);

    const pvQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'paymentVouchers'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, [firestore, schoolId]);
    const { data: vouchers, isLoading: pvLoading, forceRefetch: forceRefetchPVs } = useCollection<any>(pvQuery);

    const schoolProfileRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role || '');
    
    const handleDownloadPDF = async (pv: any) => {
        const element = document.getElementById('printable-voucher');
        if (!element) return;
        
        setIsExporting(true);
        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            pdf.save(`Voucher_${pv.pvNumber}.pdf`);
            toast({ title: "Voucher Downloaded" });
        } catch (e) {
            toast({ variant: 'destructive', title: "Export Failed" });
        } finally {
            setIsExporting(false);
        }
    };

    if (!canAccess) return <div className="p-8 text-center text-red-500">Access Denied</div>;

    const isLoading = isLoadingSchool || accountsLoading || jLoading || pvLoading;

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Landmark className="h-8 w-8 text-indigo-700"/>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Accounting & General Ledger</h1>
                    <p className="text-muted-foreground">Manage chart of accounts and school expenditures.</p>
                </div>
            </div>
            
            <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="overview">Chart of Accounts</TabsTrigger>
                    <TabsTrigger value="journal">Journal Entry</TabsTrigger>
                    <TabsTrigger value="ledger">General Ledger</TabsTrigger>
                    <TabsTrigger value="pv">Payment Vouchers</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                    {isLoading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>
                    ) : (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2"><BookMarked /> Chart of Accounts</CardTitle>
                                    <CardDescription>Structure of the school's financial ledger.</CardDescription>
                                </div>
                                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                    <DialogTrigger asChild>
                                        <Button><PlusCircle className="mr-2 h-4 w-4" /> New Account</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader><DialogTitle>Create New Ledger Account</DialogTitle></DialogHeader>
                                        {schoolId && accounts && <AccountForm setOpen={setIsAddOpen} onAccountAdded={forceRefetchAccounts} accounts={accounts} schoolId={schoolId} />}
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Account Name</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Description</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {accounts?.sort((a,b) => a.code.localeCompare(b.code)).map(acc => (
                                            <TableRow key={acc.id} className={cn(acc.isControlAccount && 'bg-muted/50 font-bold')}>
                                                <TableCell>{acc.code}</TableCell>
                                                <TableCell>{acc.name}</TableCell>
                                                <TableCell>{acc.type}</TableCell>
                                                <TableCell>{acc.description || '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="journal" className="mt-4">
                    <div className="max-w-3xl mx-auto">
                        {accounts && schoolId && (
                            <JournalEntryForm accounts={accounts} schoolId={schoolId} onEntryAdded={forceRefetchJournals} />
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="ledger" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Journal History</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">Total Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {journals?.map(j => (
                                        <TableRow key={j.id}>
                                            <TableCell>{j.date?.toDate ? format(j.date.toDate(), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                                            <TableCell>{j.description}</TableCell>
                                            <TableCell className="text-right font-bold">GH₵{j.totalAmount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pv" className="mt-4">
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 font-bold shadow-lg">
                                        <Plus className="mr-2 h-4 w-4" /> New Voucher
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Create Payment Voucher</DialogTitle>
                                        <DialogDescription>Statutory taxes and GL accounts are automatically calculated based on Ghana 2026 Act 1151.</DialogDescription>
                                    </DialogHeader>
                                    {schoolId && accounts && (
                                        <PaymentVoucherForm 
                                            setOpen={(val) => {}} 
                                            accounts={accounts} 
                                            schoolId={schoolId} 
                                            onSuccess={() => { forceRefetchPVs(); forceRefetchJournals(); }} 
                                        />
                                    )}
                                </DialogContent>
                            </Dialog>
                        </div>

                        <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
                            <CardContent className="p-0">
                                {!vouchers || vouchers.length === 0 ? (
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
                                                <TableHead className="text-right">Net Payable</TableHead>
                                                <TableHead className="text-center">Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {vouchers.map((pv: any) => (
                                                <TableRow key={pv.id} className="hover:bg-slate-50 transition-colors">
                                                    <TableCell className="font-mono font-bold text-xs">{pv.pvNumber}</TableCell>
                                                    <TableCell className="text-xs text-slate-500">{pv.createdAt?.toDate ? format(pv.createdAt.toDate(), 'dd MMM yy') : 'Pending'}</TableCell>
                                                    <TableCell><div className="flex flex-col"><span className="font-bold text-slate-800 text-sm">{pv.payee}</span><span className="text-[10px] text-slate-400 truncate max-w-[150px]">{pv.description}</span></div></TableCell>
                                                    <TableCell className="text-right font-black text-indigo-700">GH₵{pv.netPayable?.toFixed(2)}</TableCell>
                                                    <TableCell className="text-center"><Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 uppercase text-[9px] font-black">{pv.status}</Badge></TableCell>
                                                    <TableCell className="text-right">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="ghost" size="sm" onClick={() => setSelectedPV(pv)}>
                                                                    <Eye className="h-4 w-4 mr-1"/> View
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                                <DialogHeader><DialogTitle>Voucher Detail</DialogTitle></DialogHeader>
                                                                <div className="p-4 bg-slate-100 rounded-xl overflow-hidden"><VoucherDocument pv={pv} schoolProfile={schoolProfile} /></div>
                                                                <DialogFooter className="print:hidden">
                                                                    <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4"/> Print</Button>
                                                                    <Button onClick={() => handleDownloadPDF(pv)} disabled={isExporting} className="bg-indigo-600">
                                                                        {isExporting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Download className="mr-2 h-4 w-4"/>}
                                                                        Save PDF
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
            <style jsx global>{`
                @media print {
                    body * { visibility: hidden !important; }
                    #printable-voucher, #printable-voucher * { visibility: visible !important; }
                    #printable-voucher { position: fixed !important; left: 0 !important; top: 0 !important; width: 210mm !important; height: auto !important; margin: 0 !important; padding: 40px !important; border: none !important; box-shadow: none !important; }
                }
            `}</style>
        </div>
    );
}
