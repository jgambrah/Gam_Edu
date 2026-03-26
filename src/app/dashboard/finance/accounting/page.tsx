'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, query, orderBy, where, doc, addDoc, runTransaction, serverTimestamp, increment, setDoc, getDocs } from 'firebase/firestore';
import { 
  Book, Scale, CreditCard, FileText, Plus, Landmark, 
  Save, Loader2, CornerDownRight, Trash2, Receipt, BarChart, TrendingUp, BookOpen, PlusCircle, BookMarked, Printer, Eye, ShieldCheck, Download
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { useCurrentSchool } from '@/hooks/use-current-school';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Account, JournalEntry, JournalLine, journalEntrySchema, AccountType, accountSchema, MOCK_CHART_OF_ACCOUNTS, ACCOUNT_TYPES } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AppLogo } from '@/components/icons/app-logo';

// --- CONSTANTS: GHANA TAX ---
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

type AccountBalance = {
    id: string;
    code: string;
    name: string;
    type: string;
    debit: number;
    credit: number;
    net: number; // Positive = Debit Balance, Negative = Credit Balance
};

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

            <div className="grid grid-cols-2 gap-12 mt-16 pt-8 border-t border-dashed">
                <div className="text-center">
                    <div className="border-b border-black h-8 mb-2"></div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Prepared By</p>
                    <p className="text-xs font-bold">{pv.preparedByName}</p>
                </div>
                <div className="text-center">
                    <div className="border-b border-black h-8 mb-2"></div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Authorized Official</p>
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
    const bankAccounts = accounts.filter(a => ['Asset'].includes(a.type) && !a.isControlAccount);

    async function onSubmit(values: PVFormValues) {
        if (!firestore || !user || !schoolId) return;
        setIsSubmitting(true);

        try {
            const batch = writeBatch(firestore);
            const timestamp = serverTimestamp();
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

            // Double-Entry Journal
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
                    <Label>Gross Amount (GH₵)</Label>
                    <Input type="number" step="0.01" {...form.register('grossAmount')} className="font-bold text-lg" />
                </div>
                <div className="space-y-2">
                    <Label>WHT Rate</Label>
                    <Select onValueChange={(v) => form.setValue('whtRate', parseFloat(v))} defaultValue="0">
                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>{GHANA_WHT_RATES.map(r => <SelectItem key={r.label} value={String(r.rate)}>{r.label}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>VAT Rate</Label>
                    <Select onValueChange={(v) => form.setValue('vatRate', parseFloat(v))} defaultValue="0">
                        <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                        <SelectContent>{GHANA_VAT_RATES.map(r => <SelectItem key={r.label} value={String(r.rate)}>{r.label}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-4 border-y border-dashed text-center">
                <div><p className="text-[10px] uppercase text-slate-400 font-bold">VAT Added</p><p className="text-sm font-bold text-emerald-600">+GH₵{calculations.vat.toFixed(2)}</p></div>
                <div><p className="text-[10px] uppercase text-slate-400 font-bold">WHT Deducted</p><p className="text-sm font-bold text-rose-600">-GH₵{calculations.wht.toFixed(2)}</p></div>
                <div className="bg-indigo-50 rounded-lg py-1"><p className="text-[10px] uppercase text-indigo-400 font-bold">Net Payable</p><p className="text-sm font-black text-indigo-700">GH₵{calculations.net.toFixed(2)}</p></div>
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

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 font-bold">
                {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <Receipt className="mr-2 h-4 w-4"/>}
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
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

    const accountsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'accounts'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: accounts, isLoading: accountsLoading, forceRefetch: forceRefetchAccounts } = useCollection<Account>(accountsQuery);

    const journalsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'journal_entries'), where('schoolId', '==', schoolId), orderBy('date', 'desc')) : null, [firestore, schoolId]);
    const { data: journals, isLoading: jLoading, forceRefetch: forceRefetchJournals } = useCollection<JournalEntry>(journalsQuery);

    const pvQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'payment_vouchers'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, [firestore, schoolId]);
    const { data: vouchers, isLoading: pvLoading, forceRefetch: forceRefetchPVs } = useCollection<any>(pvQuery);

    const schoolProfileRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role || '');
    if (!canAccess) return <div className="p-8 text-center text-red-500">Access Denied</div>;

    const isLoading = isLoadingSchool || accountsLoading || jLoading || pvLoading;

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Landmark className="h-8 w-8 text-indigo-700"/>
                <div><h1 className="text-2xl font-bold text-slate-800">Accounting & General Ledger</h1><p className="text-muted-foreground">Manage chart of accounts and school expenditures.</p></div>
            </div>
            
            <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="overview">Chart of Accounts</TabsTrigger>
                    <TabsTrigger value="journal">Journal Entry</TabsTrigger>
                    <TabsTrigger value="ledger">General Ledger</TabsTrigger>
                    <TabsTrigger value="pv">Payment Vouchers</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4">
                    {isLoading ? <Loader2 className="mx-auto animate-spin"/> : <ChartOfAccounts accounts={accounts || []} schoolId={schoolId!} onAccountsChanged={forceRefetchAccounts} />}
                </TabsContent>

                <TabsContent value="journal" className="mt-4">
                    <div className="max-w-3xl mx-auto">
                        <JournalEntryForm accounts={accounts || []} schoolId={schoolId!} onEntryAdded={forceRefetchJournals} />
                    </div>
                </TabsContent>

                <TabsContent value="ledger" className="mt-4">
                    <GeneralLedger accounts={accounts || []} journals={journals || []} />
                </TabsContent>

                <TabsContent value="pv" className="mt-4">
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 font-bold shadow-lg">
                                        <Plus className="mr-2 h-4 w-4" /> New Voucher
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Create Payment Voucher</DialogTitle>
                                        <DialogDescription>Statutory taxes and GL accounts are automatically calculated.</DialogDescription>
                                    </DialogHeader>
                                    {schoolId && accounts && <PaymentVoucherForm setOpen={setIsAddOpen} accounts={accounts} schoolId={schoolId} onSuccess={() => { forceRefetchPVs(); forceRefetchJournals(); }} />}
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
                                                                <Button variant="ghost" size="sm" onClick={() => setSelectedPV(pv)}><Eye className="h-4 w-4 mr-1"/> View</Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                                                <DialogHeader><DialogTitle>Voucher Detail</DialogTitle></DialogHeader>
                                                                <div className="p-4 bg-slate-100 rounded-xl overflow-hidden"><VoucherDocument pv={pv} schoolProfile={schoolProfile} /></div>
                                                                <DialogFooter className="print:hidden"><Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4"/> Print</Button></DialogFooter>
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

// --- Chart of Accounts Logic ---
function ChartOfAccounts({ accounts, schoolId, onAccountsChanged }: { accounts: Account[], schoolId: string, onAccountsChanged: () => void }) {
    const [isFormOpen, setFormOpen] = useState(false);
    const sortedAccounts = useMemo(() => {
        const controlAccounts = accounts.filter(a => a.isControlAccount).sort((a, b) => (a.code || '').localeCompare(b.code || ''));
        const subAccounts = accounts.filter(a => !a.isControlAccount);
        const result: Account[] = [];
        controlAccounts.forEach(control => {
            result.push(control);
            const children = subAccounts.filter(sub => sub.parentAccountId === control.id).sort((a, b) => (a.code || '').localeCompare(b.code || ''));
            result.push(...children);
        });
        return result;
    }, [accounts]);
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle className="flex items-center gap-2"><BookMarked /> Chart of Accounts</CardTitle><CardDescription>The foundational structure of the school's financial ledger.</CardDescription></div>
                <Dialog open={isFormOpen} onOpenChange={setFormOpen}><DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> New Account</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Create New Ledger Account</DialogTitle></DialogHeader><AccountForm setOpen={setFormOpen} onAccountAdded={onAccountsChanged} accounts={accounts} schoolId={schoolId} /></DialogContent></Dialog>
            </CardHeader>
            <CardContent><Table><TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Account Name</TableHead><TableHead>Type</TableHead><TableHead>Parent</TableHead><TableHead>Description</TableHead></TableRow></TableHeader><TableBody>{sortedAccounts.map(acc => (<TableRow key={acc.id} className={cn(acc.isControlAccount && 'bg-muted/50 font-bold')}><TableCell>{acc.code}</TableCell><TableCell>{acc.name}</TableCell><TableCell>{acc.type}</TableCell><TableCell>{accounts.find(p => p.id === acc.parentAccountId)?.name || '-'}</TableCell><TableCell>{acc.description}</TableCell></TableRow>))}</TableBody></Table></CardContent>
        </Card>
    );
}

// --- Journal Entry Form Logic ---
function JournalEntryForm({ accounts, schoolId, onEntryAdded }: { accounts: Account[], schoolId: string, onEntryAdded: () => void }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const postableAccounts = accounts.filter(acc => !acc.isControlAccount);
    const form = useForm<z.infer<typeof journalEntrySchema>>({ resolver: zodResolver(journalEntrySchema), defaultValues: { description: '', amount: 0, debitAccountId: '', creditAccountId: '' } });
    async function onSubmit(values: z.infer<typeof journalEntrySchema>) {
        if (!firestore || !user) return;
        setIsSubmitting(true);
        try {
            const debitAcc = accounts.find(a => a.id === values.debitAccountId);
            const creditAcc = accounts.find(a => a.id === values.creditAccountId);
            const entryData = {
                date: serverTimestamp(),
                description: values.description,
                lines: [
                    { accountId: values.debitAccountId, accountName: debitAcc?.name || '', debit: values.amount, credit: 0 },
                    { accountId: values.creditAccountId, accountName: creditAcc?.name || '', debit: 0, credit: values.amount },
                ],
                totalAmount: values.amount,
                createdBy: user.uid,
                createdAt: serverTimestamp(),
                schoolId: schoolId,
            };
            await addDoc(collection(firestore, 'journal_entries'), entryData);
            toast({ title: 'Success', description: 'Journal entry has been recorded.' });
            onEntryAdded();
            form.reset();
        } catch (error) { toast({ variant: 'destructive', title: 'Error' }); } finally { setIsSubmitting(false); }
    }
    return (
        <Card><CardHeader><CardTitle>Manual Journal Entry</CardTitle></CardHeader><CardContent><Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"><FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="e.g., Office supplies purchase" {...field} /></FormControl><FormMessage /></FormItem>)} /><FormField control={form.control} name="amount" render={({ field }) => (<FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>)} /><div className="grid grid-cols-2 gap-4"><FormField control={form.control} name="debitAccountId" render={({ field }) => (<FormItem><FormLabel>Debit Account</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Choose account to debit" /></SelectTrigger></FormControl><SelectContent>{postableAccounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.name} ({acc.code})</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} /><FormField control={form.control} name="creditAccountId" render={({ field }) => (<FormItem><FormLabel>Credit Account</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Choose account to credit" /></SelectTrigger></FormControl><SelectContent>{postableAccounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.name} ({acc.code})</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} /></div><Button type="submit" disabled={isSubmitting} className="w-full h-12">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Record Entry</Button></form></Form></CardContent></Card>
    );
}