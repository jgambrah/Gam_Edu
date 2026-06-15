'use client';

import { useState, useMemo, useRef } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, doc, writeBatch, serverTimestamp, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
import { Loader2, Plus, Receipt, Printer, Landmark, Banknote, ShieldCheck, Eye, ArrowLeft, Download, X, Search } from 'lucide-react';
import { Account, JournalLine } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { AppLogo } from '@/components/icons/app-logo';

// --- CONSTANTS: GHANA TAX 2025/2026 ---
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

// --- SCHEMA ---
const pvSchema = z.object({
    mode: z.enum(['single', 'bulk']),
    description: z.string().min(1, "Particulars are required."),
    whtRateId: z.string(),
    vatRateId: z.string(),
    debitAccountId: z.string().min(1, "Select an expense or asset account."),
    creditAccountId: z.string().min(1, "Select a bank or cash account."),
    // Single mode fields
    payee: z.string().optional(),
    grossAmount: z.coerce.number().optional(),
    // Bulk mode fields
    bulkPayees: z.array(z.object({
        payee: z.string().min(1, "Payee name is required."),
        grossAmount: z.coerce.number().min(0.01, "Amount must be positive."),
        description: z.string().optional()
    })).optional()
}).superRefine((data, ctx) => {
    if (data.mode === 'single') {
        if (!data.payee || data.payee.trim() === '') {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Payee name is required.",
                path: ["payee"]
            });
        }
        if (!data.grossAmount || data.grossAmount <= 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Amount must be positive.",
                path: ["grossAmount"]
            });
        }
    } else {
        if (!data.bulkPayees || data.bulkPayees.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Add at least one payee for bulk generation.",
                path: ["bulkPayees"]
            });
        } else {
            data.bulkPayees.forEach((item, index) => {
                if (!item.payee || item.payee.trim() === '') {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Payee name is required.",
                        path: ["bulkPayees", index, "payee"]
                    });
                }
                if (!item.grossAmount || item.grossAmount <= 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Amount must be positive.",
                        path: ["bulkPayees", index, "grossAmount"]
                    });
                }
            });
        }
    }
});

type PVFormValues = z.infer<typeof pvSchema>;

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
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter leading-tight">Accountant</p>
                    <p className="text-[8px] font-bold text-slate-500">Prepared By: {pv.preparedByName}</p>
                </div>
                <div className="text-center">
                    <div className="border-b border-black h-8 mb-2"></div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter leading-tight">Internal Auditor</p>
                    <p className="text-[8px] font-bold text-slate-500">Vetted & Cleared</p>
                </div>
                <div className="text-center">
                    <div className="border-b border-black h-8 mb-2"></div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter leading-tight">Director</p>
                    <p className="text-[8px] font-bold text-slate-500">Authorized Official</p>
                </div>
            </div>
        </div>
    );
}

// --- FORM COMPONENT ---
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
            mode: 'single',
            whtRateId: 'wht-none',
            vatRateId: 'vat-none',
            grossAmount: 0,
            bulkPayees: [{ payee: '', grossAmount: 0, description: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "bulkPayees"
    });

    const watchMode = form.watch('mode');
    const watchGross = form.watch('grossAmount');
    const watchBulkPayees = form.watch('bulkPayees');
    const watchWHTId = form.watch('whtRateId');
    const watchVATId = form.watch('vatRateId');

    const calculations = useMemo(() => {
        const whtRateVal = GHANA_WHT_RATES.find(r => r.id === watchWHTId)?.rate ?? 0;
        const vatRateVal = GHANA_VAT_RATES.find(r => r.id === watchVATId)?.rate ?? 0;

        if (watchMode === 'single') {
            const gross = parseFloat(String(watchGross)) || 0;
            const wht = gross * whtRateVal;
            const vat = gross * vatRateVal;
            const net = (gross + vat) - wht;
            return { wht, vat, net, totalGross: gross };
        } else {
            let totalGross = 0;
            (watchBulkPayees || []).forEach(row => {
                totalGross += parseFloat(String(row?.grossAmount)) || 0;
            });
            const wht = totalGross * whtRateVal;
            const vat = totalGross * vatRateVal;
            const net = (totalGross + vat) - wht;
            return { wht, vat, net, totalGross };
        }
    }, [watchMode, watchGross, watchBulkPayees, watchWHTId, watchVATId]);

    const expenseAccounts = accounts.filter(a => ['Expense', 'Asset'].includes(a.type) && !a.isControlAccount);
    const bankAccounts = accounts.filter(a => ['Asset'].includes(a.type) && !a.isControlAccount);

    async function onSubmit(values: PVFormValues) {
        if (!firestore || !user || !schoolId) return;
        setIsSubmitting(true);

        try {
            const batch = writeBatch(firestore);
            const timestamp = serverTimestamp();
            const whtRateVal = GHANA_WHT_RATES.find(r => r.id === values.whtRateId)?.rate ?? 0;
            const vatRateVal = GHANA_VAT_RATES.find(r => r.id === values.vatRateId)?.rate ?? 0;

            if (values.mode === 'single') {
                const pvNumber = `PV-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
                const pvRef = doc(collection(firestore, 'paymentVouchers'));
                const { wht, vat, net } = calculations;

                batch.set(pvRef, {
                    pvNumber,
                    payee: values.payee,
                    description: values.description,
                    grossAmount: values.grossAmount || 0,
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
                journalLines.push({ accountId: values.debitAccountId, accountName: debitAcc?.name || 'Account', debit: values.grossAmount || 0, credit: 0 });

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
                    totalAmount: (values.grossAmount || 0) + vat,
                    createdBy: user.uid,
                    createdAt: timestamp,
                    schoolId: schoolId
                });
            } else {
                const dateStr = format(new Date(), 'yyyyMMdd');
                const randomPrefix = Math.floor(Math.random() * 100).toString().padStart(2, '0');
                
                for (let i = 0; i < (values.bulkPayees || []).length; i++) {
                    const row = values.bulkPayees![i];
                    const gross = row.grossAmount;
                    const wht = gross * whtRateVal;
                    const vat = gross * vatRateVal;
                    const net = (gross + vat) - wht;
                    const rowDesc = row.description?.trim() || values.description;
                    
                    const pvNumber = `PV-${dateStr}-${randomPrefix}${Math.floor(Math.random() * 10).toString()}-${i}`;
                    const pvRef = doc(collection(firestore, 'paymentVouchers'));

                    batch.set(pvRef, {
                        pvNumber,
                        payee: row.payee,
                        description: rowDesc,
                        grossAmount: gross,
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
                    journalLines.push({ accountId: values.debitAccountId, accountName: debitAcc?.name || 'Account', debit: gross, credit: 0 });

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
                        description: `PV ${pvNumber}: ${rowDesc} to ${row.payee} (Bulk)`,
                        lines: journalLines,
                        totalAmount: gross + vat,
                        createdBy: user.uid,
                        createdAt: timestamp,
                        schoolId: schoolId
                    });
                }
            }

            await batch.commit();
            toast({ 
                title: "Vouchers Processed", 
                description: values.mode === 'single' 
                    ? "Payment Voucher generated and ledger updated." 
                    : `Batch of ${values.bulkPayees?.length} payment vouchers generated successfully.` 
            });
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
            {/* Mode selector */}
            <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200/50">
                <Button
                    type="button"
                    variant={watchMode === 'single' ? 'default' : 'ghost'}
                    onClick={() => form.setValue('mode', 'single')}
                    className={`flex-1 rounded-lg font-bold text-xs h-9 transition-all ${
                        watchMode === 'single' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                    Single Payee
                </Button>
                <Button
                    type="button"
                    variant={watchMode === 'bulk' ? 'default' : 'ghost'}
                    onClick={() => {
                        form.setValue('mode', 'bulk');
                        if (fields.length === 0) {
                            append({ payee: '', grossAmount: 0, description: '' });
                        }
                    }}
                    className={`flex-1 rounded-lg font-bold text-xs h-9 transition-all ${
                        watchMode === 'bulk' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                    Multiple Payees (Bulk)
                </Button>
            </div>

            {/* General Description / Particulars */}
            <div className="space-y-2">
                <Label>Description / Main Particulars</Label>
                <Input {...form.register('description')} placeholder="e.g. Transport Allowance for Staff, Utility Bill, Supplies..." />
            </div>

            {/* Single Payee Mode UI */}
            {watchMode === 'single' && (
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Payee Name</Label>
                        <Input {...form.register('payee')} placeholder="Vendor or Staff Name" />
                    </div>
                    <div className="space-y-2">
                        <Label>{"Gross Amount (GH₵)"}</Label>
                        <Input type="number" step="0.01" {...form.register('grossAmount')} placeholder="0.00" className="font-bold font-mono" />
                    </div>
                </div>
            )}

            {/* Bulk Payees Mode UI */}
            {watchMode === 'bulk' && (
                <div className="space-y-4 border-2 border-dashed border-slate-100 rounded-2xl p-4 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Payee List ({fields.length})</Label>
                        <Button 
                            type="button" 
                            variant="outline" 
                            size="sm" 
                            onClick={() => append({ payee: '', grossAmount: 0, description: '' })}
                            className="border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100/70 h-8 rounded-lg font-bold px-3 text-xs"
                        >
                            + Add Payee
                        </Button>
                    </div>
                    
                    <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 items-center bg-white p-3 rounded-xl border border-slate-100 relative group shadow-sm">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-[9px] text-slate-400 font-bold uppercase">Payee Name</Label>
                                        <Input 
                                            {...form.register(`bulkPayees.${index}.payee` as const)} 
                                            placeholder="e.g. John Doe" 
                                            className="h-9 text-xs"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] text-slate-400 font-bold uppercase">Amount (GH₵)</Label>
                                        <Input 
                                            type="number" 
                                            step="0.01" 
                                            {...form.register(`bulkPayees.${index}.grossAmount` as const)} 
                                            placeholder="0.00" 
                                            className="h-9 text-xs font-mono font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[9px] text-slate-400 font-bold uppercase">Particulars (Optional)</Label>
                                        <Input 
                                            {...form.register(`bulkPayees.${index}.description` as const)} 
                                            placeholder="Defaults to main particulars" 
                                            className="h-9 text-xs"
                                        />
                                    </div>
                                </div>
                                {fields.length > 1 && (
                                    <Button 
                                        type="button" 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => remove(index)} 
                                        className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 p-1.5 rounded-lg mt-4 h-8 w-8 shrink-0 self-center animate-fade-in"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tax Settings Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="space-y-2">
                    <Label>WHT Rate (Ghana Tax 2025/2026)</Label>
                    <Select onValueChange={(id) => form.setValue('whtRateId', id)} defaultValue="wht-none">
                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {GHANA_WHT_RATES.map(r => <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>VAT Rate</Label>
                    <Select onValueChange={(id) => form.setValue('vatRateId', id)} defaultValue="vat-none">
                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {GHANA_VAT_RATES.map(r => <SelectItem key={r.id} value={r.id}>{r.label}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Totals Box */}
            <div className="grid grid-cols-3 gap-2 py-4 border-y border-dashed text-center">
                <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Total VAT</p>
                    <p className="text-sm font-bold text-emerald-600">{" +GH₵ " + calculations.vat.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Total WHT</p>
                    <p className="text-sm font-bold text-rose-600">{" -GH₵ " + calculations.wht.toFixed(2)}</p>
                </div>
                <div className="text-center bg-indigo-50 rounded-xl py-1 border border-indigo-100/50">
                    <p className="text-[10px] uppercase text-indigo-400 font-bold tracking-wider">Total Net Payable</p>
                    <p className="text-sm font-black text-indigo-700">{" GH₵ " + calculations.net.toFixed(2)}</p>
                </div>
            </div>

            {/* Debit/Credit accounts */}
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

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl text-white">
                {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Receipt className="mr-2 h-4 w-4"/>}
                {watchMode === 'single' ? 'Process Payment Voucher' : `Process Batch of ${fields.length} Vouchers`}
            </Button>
        </form>
    );
}

// --- MAIN PAGE ---
export default function PaymentVouchersPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const { toast } = useToast();

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedPV, setSelectedPV] = useState<any>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');

    const accountsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'accounts'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: accounts, isLoading: accountsLoading } = useCollection<Account>(accountsQuery);

    const pvQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'paymentVouchers'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, [firestore, schoolId]);
    const { data: vouchers, isLoading: pvLoading, forceRefetch } = useCollection<any>(pvQuery);

    const filteredVouchers = useMemo(() => {
        if (!vouchers) return [];
        return vouchers.filter(pv => {
            const matchesSearch = 
                (pv.pvNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (pv.payee || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (pv.description || '').toLowerCase().includes(searchTerm.toLowerCase());
            
            if (!matchesSearch) return false;

            if (dateFilter === 'all') return true;
            const pvDate = pv.createdAt?.toDate ? pv.createdAt.toDate() : new Date(pv.createdAt);
            const now = new Date();
            
            if (dateFilter === 'today') {
                return format(pvDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd');
            }
            if (dateFilter === 'week') {
                const diffTime = Math.abs(now.getTime() - pvDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
            }
            if (dateFilter === 'month') {
                return pvDate.getMonth() === now.getMonth() && pvDate.getFullYear() === now.getFullYear();
            }
            if (dateFilter === 'year') {
                return pvDate.getFullYear() === now.getFullYear();
            }
            return true;
        });
    }, [vouchers, searchTerm, dateFilter]);

    const archiveStats = useMemo(() => {
        if (!filteredVouchers) return { count: 0, gross: 0, wht: 0, vat: 0, net: 0 };
        return filteredVouchers.reduce((acc, pv) => {
            acc.count += 1;
            acc.gross += pv.grossAmount || 0;
            acc.wht += pv.whtAmount || 0;
            acc.vat += pv.vatAmount || 0;
            acc.net += pv.netPayable || 0;
            return acc;
        }, { count: 0, gross: 0, wht: 0, vat: 0, net: 0 });
    }, [filteredVouchers]);

    const handleExportCSV = () => {
        if (!filteredVouchers || filteredVouchers.length === 0) return;
        
        const headers = ["PV Number", "Date", "Payee", "Description", "Gross Amount", "VAT Amount", "WHT Amount", "Net Payable", "Status"];
        const rows = filteredVouchers.map(pv => {
            const dateStr = pv.createdAt?.toDate ? format(pv.createdAt.toDate(), 'yyyy-MM-dd HH:mm') : '';
            return [
                pv.pvNumber || '',
                dateStr,
                `"${(pv.payee || '').replace(/"/g, '""')}"`,
                `"${(pv.description || '').replace(/"/g, '""')}"`,
                pv.grossAmount || 0,
                pv.vatAmount || 0,
                pv.whtAmount || 0,
                pv.netPayable || 0,
                pv.status || ''
            ];
        });
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Payment_Vouchers_Archive_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: "Archive Exported", description: "CSV file successfully downloaded." });
    };

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

    if (!canAccess) return <Card className="m-6"><CardHeader><CardTitle>Access Denied</CardTitle></CardHeader></Card>;

    const isLoading = schoolLoading || accountsLoading || pvLoading;

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Receipt className="h-8 w-8 text-indigo-600"/> Payment Vouchers
                    </h1>
                    <p className="text-muted-foreground font-medium italic">Archive of school expenditures and statutory tax records.</p>
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

            {/* KPI Stats Cards */}
            {!isLoading && vouchers && vouchers.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card className="border-none shadow-md bg-white rounded-2xl p-4">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Vouchers</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">{archiveStats.count}</p>
                    </Card>
                    <Card className="border-none shadow-md bg-white rounded-2xl p-4">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Gross Spend</p>
                        <p className="text-2xl font-black text-slate-900 mt-1">GH₵{archiveStats.gross.toFixed(2)}</p>
                    </Card>
                    <Card className="border-none shadow-md bg-white rounded-2xl p-4">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total VAT</p>
                        <p className="text-2xl font-black text-emerald-600 mt-1">GH₵{archiveStats.vat.toFixed(2)}</p>
                    </Card>
                    <Card className="border-none shadow-md bg-white rounded-2xl p-4">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total WHT</p>
                        <p className="text-2xl font-black text-rose-600 mt-1">GH₵{archiveStats.wht.toFixed(2)}</p>
                    </Card>
                    <Card className="border-none shadow-md bg-white rounded-2xl p-4 col-span-2 lg:col-span-1 bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100/30">
                        <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Net Disbursed</p>
                        <p className="text-2xl font-black text-indigo-700 mt-1">GH₵{archiveStats.net.toFixed(2)}</p>
                    </Card>
                </div>
            )}

            {/* Search and Filters */}
            {!isLoading && vouchers && vouchers.length > 0 && (
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex flex-1 flex-col md:flex-row gap-2 w-full">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by PV number, payee name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 h-11 bg-slate-50 border-slate-100 focus-visible:ring-indigo-500 rounded-xl"
                            />
                        </div>
                        <Select value={dateFilter} onValueChange={(v: any) => setDateFilter(v)}>
                            <SelectTrigger className="w-full md:w-[180px] h-11 bg-slate-50 border-slate-100 rounded-xl font-medium text-slate-600 focus:ring-0">
                                <SelectValue placeholder="Filter by date..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Time</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="week">This Week</SelectItem>
                                <SelectItem value="month">This Month</SelectItem>
                                <SelectItem value="year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button 
                        onClick={handleExportCSV} 
                        disabled={!filteredVouchers || filteredVouchers.length === 0} 
                        variant="outline"
                        className="h-11 rounded-xl font-bold border-slate-200 text-slate-700 w-full md:w-auto hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <Download className="mr-2 h-4 w-4" /> Export Archive (CSV)
                    </Button>
                </div>
            )}

            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-indigo-600"/></div>
                    ) : !vouchers || vouchers.length === 0 ? (
                        <div className="text-center py-32 text-slate-400 bg-slate-50/50">
                            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-20"/>
                            <p className="font-bold uppercase tracking-widest text-xs">No vouchers processed yet.</p>
                        </div>
                    ) : filteredVouchers.length === 0 ? (
                        <div className="text-center py-24 text-slate-400 bg-slate-50/50">
                            <Search className="h-12 w-12 mx-auto mb-4 opacity-20"/>
                            <p className="font-bold uppercase tracking-widest text-xs">No vouchers match your filter criteria.</p>
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
                                {filteredVouchers.map((pv: any) => (
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
                                        <TableCell className="text-right font-black text-indigo-700">GH₵{pv.netPayable?.toFixed(2)}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 uppercase text-[9px] font-black">
                                                {pv.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" onClick={() => setSelectedPV(pv)}>
                                                        <Eye className="h-4 w-4 mr-1"/> View
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Payment Voucher Detail</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="p-4 bg-slate-100 rounded-xl overflow-hidden">
                                                        <VoucherDocument pv={pv} schoolProfile={schoolProfile} />
                                                    </div>
                                                    <DialogFooter className="print:hidden">
                                                        <Button variant="outline" onClick={() => window.print()}>
                                                            <Printer className="mr-2 h-4 w-4"/> Print
                                                        </Button>
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
            
            <style jsx global>{`
                @media print {
                    body * { visibility: hidden !important; }
                    #printable-voucher, #printable-voucher * { visibility: visible !important; }
                    #printable-voucher {
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 210mm !important;
                        height: auto !important;
                        margin: 0 !important;
                        padding: 40px !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
