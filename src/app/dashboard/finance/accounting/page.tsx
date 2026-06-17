'use client';

import { useState, useMemo, useRef, Fragment } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, orderBy, where, doc, addDoc, serverTimestamp, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { 
  Loader2, Plus, Landmark, Save, Receipt, BookMarked, Printer, Eye, BookOpen, PlusCircle, Download, ShieldCheck, Search, ShieldAlert, ArrowUpRight, ArrowDownRight, Tag, Wallet, Sparkles
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
import { cn, getCostCenters } from '@/lib/utils';
import { SearchableAccountSelect } from '@/components/ui/account-select';

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
    costCenter: z.string().default('General'),
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
            name: '',
            type: 'Asset',
            parentAccountId: 'None',
            description: '',
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
function JournalEntryForm({ accounts, schoolId, schoolProfile, onEntryAdded }: { accounts: Account[], schoolId: string, schoolProfile: any, onEntryAdded: () => void }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const costCenters = getCostCenters(schoolProfile);

    const form = useForm<z.infer<typeof journalEntrySchema>>({
        resolver: zodResolver(journalEntrySchema),
        defaultValues: {
            description: '',
            amount: 0,
            debitAccountId: '',
            creditAccountId: '',
            costCenter: 'General',
        }
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
                { accountId: values.debitAccountId, accountName: debitAcc?.name || 'Account', debit: values.amount, credit: 0, costCenter: values.costCenter || 'General' },
                { accountId: values.creditAccountId, accountName: creditAcc?.name || 'Account', debit: 0, credit: values.amount, costCenter: values.costCenter || 'General' }
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
                        <FormField control={form.control} name="costCenter" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Department / Cost Center</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || 'General'}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Department..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {costCenters.map(cc => (
                                            <SelectItem key={cc.id} value={cc.id}>{cc.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="debitAccountId" render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="mb-1">Debit Account</FormLabel>
                                    <FormControl>
                                        <SearchableAccountSelect
                                            accounts={accounts}
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            placeholder="Choose account..."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="creditAccountId" render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="mb-1">Credit Account</FormLabel>
                                    <FormControl>
                                        <SearchableAccountSelect
                                            accounts={accounts}
                                            value={field.value || ''}
                                            onChange={field.onChange}
                                            placeholder="Choose account..."
                                        />
                                    </FormControl>
                                    <FormMessage />
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
        <div className="bg-white text-black p-8 border shadow-sm rounded-lg font-sans max-w-3xl mx-auto relative overflow-hidden" id="printable-voucher">
            {/* Watermark for visual authenticity */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center select-none z-0">
                <Landmark className="h-96 w-96 text-slate-900" />
            </div>

            <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start border-b-4 border-slate-800 pb-6 mb-6">
                    <div className="flex items-center gap-4">
                        {schoolProfile?.logoUrl ? (
                            <img src={schoolProfile.logoUrl} className="h-16 w-16 object-contain" alt="Logo" />
                        ) : (
                            <div className="h-16 w-16 bg-slate-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold border border-slate-200">
                                <Landmark className="h-8 w-8 text-indigo-600" />
                            </div>
                        )}
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">{schoolProfile?.name || 'SCHOOL NAME'}</h1>
                            <p className="text-xs text-slate-500 font-bold tracking-wide">{schoolProfile?.address || 'ADDRESS'}</p>
                            {schoolProfile?.phone && <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Tel: {schoolProfile.phone}</p>}
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="bg-slate-900 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider">Payment Voucher</span>
                        <h2 className="text-xl font-extrabold text-slate-800 mt-2 font-mono">{pv.pvNumber}</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Status: Processed</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 border-b pb-6 text-sm">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payee / Claimant:</p>
                        <p className="text-lg font-bold text-slate-900">{pv.payee}</p>
                    </div>
                    <div className="text-right space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Processed:</p>
                        <p className="text-sm font-bold text-slate-900">
                            {pv.createdAt?.toDate ? format(pv.createdAt.toDate(), 'PPP p') : 'Pending'}
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Particulars / Payment Details:</p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-slate-800 font-medium text-sm leading-relaxed">
                        {pv.description}
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Summary Breakdown:</p>
                    <table className="w-full text-sm border-collapse border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <thead className="bg-slate-900 text-white font-bold text-xs uppercase tracking-wider">
                            <tr>
                                <th className="text-left p-3.5">Line Description</th>
                                <th className="text-right p-3.5 w-[150px]">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b bg-white">
                                <td className="p-3.5 font-medium text-slate-700">Gross Expenditure Amount</td>
                                <td className="p-3.5 text-right font-mono font-bold text-slate-800">GH₵{pv.grossAmount?.toFixed(2)}</td>
                            </tr>
                            <tr className="border-b bg-slate-50/50 text-emerald-600">
                                <td className="p-3.5 font-medium flex items-center gap-1.5"><ArrowUpRight className="h-4 w-4" /> VAT Claimable / Added (Consolidated 20%)</td>
                                <td className="p-3.5 text-right font-mono font-bold">+{pv.vatAmount?.toFixed(2)}</td>
                            </tr>
                            <tr className="border-b bg-white text-rose-600">
                                <td className="p-3.5 font-medium flex items-center gap-1.5"><ArrowDownRight className="h-4 w-4" /> Withholding Tax (WHT) Deducted</td>
                                <td className="p-3.5 text-right font-mono font-bold">-{pv.whtAmount?.toFixed(2)}</td>
                            </tr>
                            <tr className="bg-indigo-50 font-black text-indigo-900">
                                <td className="p-4 text-sm uppercase tracking-wide">Net Amount Paid / Payable</td>
                                <td className="p-4 text-right text-xl font-mono">GH₵{pv.netPayable?.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Audit & Authorization Signatures Section */}
                <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-dashed border-slate-300">
                    <div className="text-center space-y-4">
                        <div className="border-b border-slate-400 h-10 w-3/4 mx-auto relative flex items-end justify-center">
                            {pv.preparedByName && <span className="text-[10px] text-slate-500 font-mono absolute -bottom-1 text-center truncate max-w-full">{pv.preparedByName}</span>}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Accountant</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Prepared By</p>
                        </div>
                    </div>
                    <div className="text-center space-y-4">
                        <div className="border-b border-slate-400 h-10 w-3/4 mx-auto relative">
                            {/* Visual stamp placeholder */}
                            <div className="absolute right-0 bottom-1 border border-indigo-200/50 rounded text-[7px] text-indigo-400/40 uppercase font-black px-1 pointer-events-none select-none tracking-widest rotate-6">Vetted</div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Internal Auditor</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Cleared & Audited</p>
                        </div>
                    </div>
                    <div className="text-center space-y-4">
                        <div className="border-b border-slate-400 h-10 w-3/4 mx-auto"></div>
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-700 tracking-wider">Director</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Authorized Approval</p>
                        </div>
                    </div>
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
    schoolProfile,
    onSuccess 
}: { 
    setOpen: (o: boolean) => void; 
    accounts: Account[]; 
    schoolId: string;
    schoolProfile: any;
    onSuccess: () => void;
}) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const costCenters = getCostCenters(schoolProfile);

    const form = useForm<PVFormValues>({
        resolver: zodResolver(pvSchema),
        defaultValues: {
            payee: '',
            description: '',
            grossAmount: 0,
            whtRateId: 'wht-none',
            vatRateId: 'vat-none',
            debitAccountId: '',
            creditAccountId: '',
            costCenter: 'General',
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

    const expenseAccounts = accounts.filter(a => ['Expense', 'Asset'].includes(a.type));
    const bankAccounts = accounts.filter(a => ['Asset'].includes(a.type));

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
                costCenter: values.costCenter || 'General',
                createdAt: timestamp
            });

            const journalLines: JournalLine[] = [];
            const debitAcc = accounts.find(a => a.id === values.debitAccountId);
            journalLines.push({ accountId: values.debitAccountId, accountName: debitAcc?.name || 'Account', debit: values.grossAmount, credit: 0, costCenter: values.costCenter || 'General' });

            const creditAcc = accounts.find(a => a.id === values.creditAccountId);
            journalLines.push({ accountId: values.creditAccountId, accountName: creditAcc?.name || 'Cash/Bank', debit: 0, credit: net, costCenter: values.costCenter || 'General' });

            if (wht > 0) {
                const whtAcc = accounts.find(a => a.name.toLowerCase().includes('withholding tax')) || accounts.find(a => a.name.toLowerCase().includes('wht'));
                journalLines.push({ accountId: whtAcc?.id || 'WHT-PAYABLE-DEFAULT', accountName: whtAcc?.name || 'WHT Payable', debit: 0, credit: wht, costCenter: values.costCenter || 'General' });
            }
            if (vat > 0) {
                const vatAcc = accounts.find(a => a.name.toLowerCase().includes('vat input')) || accounts.find(a => a.name.toLowerCase().includes('vat'));
                journalLines.push({ accountId: vatAcc?.id || 'VAT-INPUT-DEFAULT', accountName: vatAcc?.name || 'VAT Input', debit: vat, credit: 0, costCenter: values.costCenter || 'General' });
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

            <div className="space-y-2">
                <Label className="font-bold text-xs uppercase tracking-widest text-slate-500">Department / Cost Center</Label>
                <Select 
                    value={form.watch('costCenter') || 'General'} 
                    onValueChange={(val) => form.setValue('costCenter', val)}
                >
                    <SelectTrigger className="bg-white border-2 h-12 rounded-xl font-bold">
                        <SelectValue placeholder="Select Department..." />
                    </SelectTrigger>
                    <SelectContent>
                        {costCenters.map(cc => (
                            <SelectItem key={cc.id} value={cc.id} className="font-semibold">{cc.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-tight mt-1">
                    Categorize this expense by departmental cost center (e.g. Sports, Fleet/Transport, Academics).
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col justify-end">
                    <Label className="mb-1">Debit Account (Expense/Asset)</Label>
                    <SearchableAccountSelect
                        accounts={expenseAccounts}
                        value={form.watch('debitAccountId') || ''}
                        onChange={(v) => form.setValue('debitAccountId', v)}
                        placeholder="Select account..."
                    />
                </div>
                <div className="space-y-2 flex flex-col justify-end">
                    <Label className="mb-1">Credit Account (Bank/Cash)</Label>
                    <SearchableAccountSelect
                        accounts={bankAccounts}
                        value={form.watch('creditAccountId') || ''}
                        onChange={(v) => form.setValue('creditAccountId', v)}
                        placeholder="Select account..."
                    />
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
const getTypeBadge = (type: string) => {
    switch (type) {
        case 'Asset':
            return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50';
        case 'Liability':
            return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50';
        case 'Equity':
            return 'bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/20 dark:text-violet-400 dark:border-violet-900/50';
        case 'Revenue':
            return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50';
        case 'Expense':
            return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50';
        default:
            return 'bg-slate-50 text-slate-700 border-slate-100';
    }
};

export default function AccountingPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
    const { toast } = useToast();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isPvOpen, setIsPvOpen] = useState(false);
    const [selectedPV, setSelectedPV] = useState<any>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [ledgerSearch, setLedgerSearch] = useState('');
    const [pvSearch, setPvSearch] = useState('');
    const [expandedJournalId, setExpandedJournalId] = useState<string | null>(null);

    const accountsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'accounts'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: accounts, isLoading: accountsLoading, forceRefetch: forceRefetchAccounts } = useCollection<Account>(accountsQuery);

    const journalsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'journal_entries'), where('schoolId', '==', schoolId), orderBy('date', 'desc')) : null, [firestore, schoolId]);
    const { data: journals, isLoading: jLoading, forceRefetch: forceRefetchJournals } = useCollection<JournalEntry>(journalsQuery);

    const pvQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'paymentVouchers'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, [firestore, schoolId]);
    const { data: vouchers, isLoading: pvLoading, forceRefetch: forceRefetchPVs } = useCollection<any>(pvQuery);

    const schoolProfileRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    // --- ANALYTICS & FILTERING ---
    const filteredJournals = useMemo(() => {
      if (!journals) return [];
      if (!ledgerSearch.trim()) return journals;
      const queryStr = ledgerSearch.toLowerCase();
      return journals.filter(j => 
          j.description.toLowerCase().includes(queryStr) || 
          j.reference?.toLowerCase().includes(queryStr) ||
          j.lines?.some(l => l.accountName.toLowerCase().includes(queryStr))
      );
    }, [journals, ledgerSearch]);

    const filteredVouchers = useMemo(() => {
      if (!vouchers) return [];
      if (!pvSearch.trim()) return vouchers;
      const queryStr = pvSearch.toLowerCase();
      return vouchers.filter(pv => 
          pv.payee.toLowerCase().includes(queryStr) || 
          pv.pvNumber.toLowerCase().includes(queryStr) ||
          pv.description.toLowerCase().includes(queryStr)
      );
    }, [vouchers, pvSearch]);

    const pvStats = useMemo(() => {
      if (!vouchers) return { gross: 0, vat: 0, wht: 0, net: 0 };
      let gross = 0, vat = 0, wht = 0, net = 0;
      vouchers.forEach((v: any) => {
          if (v.status !== 'Rejected') {
              gross += Number(v.grossAmount) || 0;
              vat += Number(v.vatAmount) || 0;
              wht += Number(v.whtAmount) || 0;
              net += Number(v.netPayable) || 0;
          }
      });
      return { gross, vat, wht, net };
    }, [vouchers]);

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
        <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen">
            {/* Executive Glowing Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-indigo-500/20">
                {/* Decorative glow elements */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-md border border-white/10">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-300 animate-pulse" />
                            <span>Executive Financial Suite</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                            Accounting & General Ledger
                        </h1>
                        <p className="text-sm text-indigo-100 font-medium max-w-xl">
                            Consolidated corporate ledger, Ghana Act 1151 compliance tracking, cost center reporting, and payment voucher audit authorization.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 md:gap-4 bg-black/15 backdrop-blur-lg rounded-2xl p-4 border border-white/5">
                        <div className="text-center md:text-left px-2">
                            <p className="text-[10px] uppercase text-indigo-300 font-bold tracking-wider">Total Accounts</p>
                            <p className="text-2xl font-black font-mono text-white mt-1">{accounts?.length || 0}</p>
                        </div>
                        <div className="text-center md:text-left px-2 border-l border-white/10">
                            <p className="text-[10px] uppercase text-indigo-300 font-bold tracking-wider">Ledger Status</p>
                            <div className="flex items-center gap-1 mt-1 justify-center md:justify-start">
                                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                                <span className="text-xs font-bold text-emerald-400">Audited</span>
                            </div>
                        </div>
                        <div className="text-center md:text-left px-2 border-l border-white/10">
                            <p className="text-[10px] uppercase text-indigo-300 font-bold tracking-wider">Cost Centers</p>
                            <p className="text-2xl font-black font-mono text-white mt-1">{getCostCenters(schoolProfile).length}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-slate-100 p-1.5 rounded-2xl inline-flex w-auto border border-slate-200/50">
                    <TabsTrigger value="overview" className="rounded-xl px-4 py-2 text-sm font-semibold transition-all">Chart of Accounts</TabsTrigger>
                    <TabsTrigger value="journal" className="rounded-xl px-4 py-2 text-sm font-semibold transition-all">Journal Entry</TabsTrigger>
                    <TabsTrigger value="ledger" className="rounded-xl px-4 py-2 text-sm font-semibold transition-all">General Ledger</TabsTrigger>
                    <TabsTrigger value="pv" className="rounded-xl px-4 py-2 text-sm font-semibold transition-all">Payment Vouchers</TabsTrigger>
                </TabsList>

                {/* CHART OF ACCOUNTS */}
                <TabsContent value="overview" className="mt-0">
                    {isLoading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>
                    ) : (
                        <Card className="border border-slate-100 shadow-lg rounded-2xl overflow-hidden bg-white">
                            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 p-6 bg-slate-50/50">
                                <div>
                                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                        <BookMarked className="text-indigo-600 h-5 w-5" /> Chart of Accounts
                                    </CardTitle>
                                    <CardDescription className="text-slate-500 font-medium">Structure and categories of the school's financial ledger.</CardDescription>
                                </div>
                                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md">
                                            <PlusCircle className="mr-2 h-4 w-4" /> New Account
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md rounded-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-lg font-bold">Create New Ledger Account</DialogTitle>
                                        </DialogHeader>
                                        {schoolId && accounts && (
                                            <AccountForm 
                                                setOpen={setIsAddOpen} 
                                                onAccountAdded={forceRefetchAccounts} 
                                                accounts={accounts} 
                                                schoolId={schoolId} 
                                            />
                                        )}
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50/80 text-slate-600 font-semibold">
                                            <TableRow className="border-b border-slate-100">
                                                <TableHead className="py-4 pl-6 font-bold w-[120px]">Code</TableHead>
                                                <TableHead className="py-4 font-bold">Account Name</TableHead>
                                                <TableHead className="py-4 font-bold">Type</TableHead>
                                                <TableHead className="py-4 font-bold text-right pr-6 w-[160px]">Balance</TableHead>
                                                <TableHead className="py-4 font-bold">Description</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {accounts?.sort((a,b) => a.code.localeCompare(b.code)).map(acc => (
                                                <TableRow 
                                                    key={acc.id} 
                                                    className={cn(
                                                        "transition-all border-b border-slate-100/80 hover:bg-slate-50/50",
                                                        acc.isControlAccount ? 'bg-slate-50/30 font-bold text-slate-900' : 'text-slate-600'
                                                    )}
                                                >
                                                    <TableCell className="font-mono font-bold py-4 pl-6">{acc.code}</TableCell>
                                                    <TableCell className="py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span>{acc.name}</span>
                                                            {acc.isControlAccount ? (
                                                                <Badge className="bg-slate-200 text-slate-700 hover:bg-slate-200 border-none font-bold text-[9px] uppercase px-1.5 py-0.5">Control</Badge>
                                                            ) : (
                                                                <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-50 border-indigo-100 font-bold text-[9px] uppercase px-1.5 py-0.5">Postable</Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <Badge variant="outline" className={cn("font-bold text-[10px] uppercase py-0.5 px-2.5", getTypeBadge(acc.type))}>
                                                            {acc.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-right pr-6 font-mono font-bold text-slate-800">
                                                        GH₵{(acc.balance || 0).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="py-4 text-slate-400 font-medium text-xs max-w-xs truncate">{acc.description || '-'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* RECORD JOURNAL */}
                <TabsContent value="journal" className="mt-0">
                    <div className="max-w-3xl mx-auto">
                        {accounts && schoolId && (
                            <JournalEntryForm accounts={accounts} schoolId={schoolId} schoolProfile={schoolProfile} onEntryAdded={forceRefetchJournals} />
                        )}
                    </div>
                </TabsContent>

                {/* GENERAL LEDGER */}
                <TabsContent value="ledger" className="mt-0">
                    <Card className="border border-slate-100 shadow-lg rounded-2xl overflow-hidden bg-white">
                        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 p-6 bg-slate-50/50">
                            <div>
                                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                                    <BookOpen className="text-indigo-600 h-5 w-5" /> Journal History & Ledger Splits
                                </CardTitle>
                                <CardDescription className="text-slate-500 font-medium">Search and inspect specific journal transactions. Click any row to expand double-entry splits.</CardDescription>
                            </div>
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                    placeholder="Search ledger..." 
                                    className="pl-9 bg-white border border-slate-200 h-10 rounded-xl"
                                    value={ledgerSearch}
                                    onChange={(e) => setLedgerSearch(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50 text-slate-600 font-semibold">
                                        <TableRow className="border-b border-slate-100">
                                            <TableHead className="py-4 pl-6 font-bold w-[120px]">Date</TableHead>
                                            <TableHead className="py-4 font-bold">Transaction Details</TableHead>
                                            <TableHead className="py-4 font-bold text-right pr-6 w-[160px]">Total Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {!filteredJournals || filteredJournals.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-20 text-slate-400">
                                                    <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                                    <p className="font-bold uppercase tracking-widest text-[10px]">No ledger records found.</p>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredJournals.map(j => {
                                                const isExpanded = expandedJournalId === j.id;
                                                return (
                                                    <Fragment key={j.id}>
                                                        <TableRow 
                                                            className="cursor-pointer hover:bg-slate-50/50 transition-colors border-b border-slate-100"
                                                            onClick={() => setExpandedJournalId(isExpanded ? null : (j.id || null))}
                                                        >
                                                            <TableCell className="font-mono text-xs pl-6 py-4">
                                                                {j.date?.toDate ? format(j.date.toDate(), 'dd/MM/yyyy') : 'N/A'}
                                                            </TableCell>
                                                            <TableCell className="py-4">
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-slate-800">{j.description}</span>
                                                                    <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">Ref: {j.reference || 'MANUAL'}</span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-right pr-6 font-mono font-black text-slate-800 py-4">
                                                                GH₵{j.totalAmount.toFixed(2)}
                                                            </TableCell>
                                                        </TableRow>
                                                        {isExpanded && (
                                                            <TableRow className="bg-slate-50/40 hover:bg-slate-50/40">
                                                                <TableCell colSpan={3} className="p-4 pl-6 border-b border-slate-100">
                                                                    <div className="space-y-3 pl-4 border-l-2 border-indigo-600">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                                                                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Double-Entry Posting Splits</p>
                                                                        </div>
                                                                        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
                                                                            <Table>
                                                                                <TableHeader className="bg-slate-50 text-slate-600">
                                                                                    <TableRow className="border-b border-slate-200">
                                                                                        <TableHead className="py-2.5 font-bold text-xs">Account Name</TableHead>
                                                                                        <TableHead className="py-2.5 font-bold text-xs text-right w-[150px]">Debit (Dr)</TableHead>
                                                                                        <TableHead className="py-2.5 font-bold text-xs text-right w-[150px]">Credit (Cr)</TableHead>
                                                                                        <TableHead className="py-2.5 font-bold text-xs text-center w-[120px]">Cost Center</TableHead>
                                                                                    </TableRow>
                                                                                </TableHeader>
                                                                                <TableBody>
                                                                                    {j.lines?.map((line, idx) => (
                                                                                        <TableRow key={idx} className="hover:bg-slate-50/40 border-b border-slate-100 last:border-b-0">
                                                                                            <TableCell className="py-2.5 font-semibold text-xs text-slate-700">{line.accountName}</TableCell>
                                                                                            <TableCell className="py-2.5 text-right font-mono text-xs font-bold text-emerald-600">
                                                                                                {line.debit > 0 ? `GH₵${line.debit.toFixed(2)}` : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell className="py-2.5 text-right font-mono text-xs font-bold text-rose-600">
                                                                                                {line.credit > 0 ? `GH₵${line.credit.toFixed(2)}` : '-'}
                                                                                            </TableCell>
                                                                                            <TableCell className="py-2.5 text-center">
                                                                                                <Badge variant="outline" className="text-[9px] font-bold py-0.5 px-2 bg-slate-50 border-slate-200">
                                                                                                    {line.costCenter || 'General'}
                                                                                                </Badge>
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </Fragment>
                                                );
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* PAYMENT VOUCHERS */}
                <TabsContent value="pv" className="mt-0">
                    <div className="space-y-6">
                        {/* Cumulative Expenditure Summary Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="border border-slate-100 shadow-sm rounded-2xl hover:shadow-md transition-all bg-white">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Gross Spend</p>
                                        <p className="text-xl font-black font-mono text-slate-800">GH₵{pvStats.gross.toFixed(2)}</p>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-violet-50 text-violet-600">
                                        <Wallet className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-100 shadow-sm rounded-2xl hover:shadow-md transition-all bg-white">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">VAT Added (Claimable)</p>
                                        <p className="text-xl font-black font-mono text-emerald-600">GH₵{pvStats.vat.toFixed(2)}</p>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                                        <ArrowUpRight className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-slate-100 shadow-sm rounded-2xl hover:shadow-md transition-all bg-white">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">WHT Withheld</p>
                                        <p className="text-xl font-black font-mono text-rose-600">GH₵{pvStats.wht.toFixed(2)}</p>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                                        <ArrowDownRight className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-indigo-100/80 shadow-sm rounded-2xl hover:shadow-md transition-all bg-indigo-50/30">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-wider text-indigo-500">Net Cash Disbursed</p>
                                        <p className="text-xl font-black font-mono text-indigo-700">GH₵{pvStats.net.toFixed(2)}</p>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Search and Action Bar */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                    placeholder="Search by Payee, PV#, Details..." 
                                    className="pl-9 h-11 bg-white rounded-xl border border-slate-200" 
                                    value={pvSearch}
                                    onChange={(e) => setPvSearch(e.target.value)}
                                />
                            </div>
                            
                            <Dialog open={isPvOpen} onOpenChange={setIsPvOpen}>
                                <DialogTrigger asChild>
                                    <Button className="w-full sm:w-auto bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-750 hover:to-indigo-750 text-white font-bold h-11 rounded-xl shadow-md border-0">
                                        <Plus className="mr-2 h-4 w-4" /> New Voucher
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                            <Receipt className="text-indigo-600 h-5 w-5" /> Create Payment Voucher
                                        </DialogTitle>
                                        <DialogDescription className="text-slate-500 font-medium">
                                            Process vendor invoice or internal claim under Ghana 2026 Act 1151 compliance schemas.
                                        </DialogDescription>
                                    </DialogHeader>
                                    {schoolId && accounts && (
                                        <PaymentVoucherForm 
                                            setOpen={setIsPvOpen} 
                                            accounts={accounts} 
                                            schoolId={schoolId} 
                                            schoolProfile={schoolProfile}
                                            onSuccess={() => { forceRefetchPVs(); forceRefetchJournals(); }} 
                                        />
                                    )}
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Vouchers Table */}
                        <Card className="border border-slate-100 shadow-lg bg-white rounded-2xl overflow-hidden">
                            <CardContent className="p-0">
                                {!filteredVouchers || filteredVouchers.length === 0 ? (
                                    <div className="text-center py-24 text-slate-400 bg-slate-50/50">
                                        <Receipt className="h-12 w-12 mx-auto mb-4 opacity-20"/>
                                        <p className="font-bold uppercase tracking-widest text-xs">No vouchers matching search.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-slate-50 text-slate-600 font-semibold">
                                                <TableRow className="border-b border-slate-100">
                                                    <TableHead className="py-4 pl-6 font-bold w-[140px]">PV Number</TableHead>
                                                    <TableHead className="py-4 font-bold">Date</TableHead>
                                                    <TableHead className="py-4 font-bold">Payee / Claimant</TableHead>
                                                    <TableHead className="py-4 font-bold text-right pr-6 w-[160px]">Net Payable</TableHead>
                                                    <TableHead className="py-4 font-bold text-center w-[120px]">Status</TableHead>
                                                    <TableHead className="py-4 font-bold text-right pr-6 w-[120px]">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredVouchers.map((pv: any) => (
                                                    <TableRow key={pv.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                                                        <TableCell className="font-mono font-bold text-xs pl-6 py-4 text-slate-700">{pv.pvNumber}</TableCell>
                                                        <TableCell className="text-xs text-slate-500 py-4">
                                                            {pv.createdAt?.toDate ? format(pv.createdAt.toDate(), 'dd MMM yy') : 'Pending'}
                                                        </TableCell>
                                                        <TableCell className="py-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-slate-800 text-sm">{pv.payee}</span>
                                                                <span className="text-[10px] text-slate-400 font-medium truncate max-w-[200px] mt-0.5">{pv.description}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right pr-6 font-mono font-black text-indigo-700 py-4">
                                                            GH₵{pv.netPayable?.toFixed(2)}
                                                        </TableCell>
                                                        <TableCell className="text-center py-4">
                                                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 uppercase text-[9px] font-black px-2 py-0.5 rounded-full">
                                                                {pv.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right pr-6 py-4">
                                                            <Dialog>
                                                                <DialogTrigger asChild>
                                                                    <Button variant="ghost" size="sm" className="h-8 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 font-bold" onClick={() => setSelectedPV(pv)}>
                                                                        <Eye className="h-4 w-4 mr-1"/> View
                                                                    </Button>
                                                                </DialogTrigger>
                                                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
                                                                    <DialogHeader>
                                                                        <DialogTitle className="text-lg font-bold">Voucher Document Preview</DialogTitle>
                                                                    </DialogHeader>
                                                                    <div className="p-4 bg-slate-100/50 rounded-2xl border border-slate-200/60 overflow-hidden">
                                                                        <VoucherDocument pv={pv} schoolProfile={schoolProfile} />
                                                                    </div>
                                                                    <DialogFooter className="print:hidden gap-2 sm:gap-0 mt-4">
                                                                        <Button variant="outline" className="rounded-xl font-bold" onClick={() => window.print()}>
                                                                            <Printer className="mr-2 h-4 w-4"/> Print
                                                                        </Button>
                                                                        <Button onClick={() => handleDownloadPDF(pv)} disabled={isExporting} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold">
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
                                    </div>
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
