
'use client';

import { useState, useMemo, useRef } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy, where, doc, addDoc, runTransaction, serverTimestamp, increment } from 'firebase/firestore';
import { 
  Book, Scale, CreditCard, FileText, Plus, Landmark, 
  Save, Loader2, CornerDownRight, Trash2, Receipt, BarChart, TrendingUp, BookOpen, PlusCircle, BookMarked
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { useCurrentSchool } from '@/hooks/use-current-school';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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


// --- HELPER: Report Logic ---
type AccountBalance = {
    id: string;
    code: string;
    name: string;
    type: string;
    debit: number;
    credit: number;
    net: number; // Positive = Debit Balance, Negative = Credit Balance
};

// --- COMPONENT: Detailed Ledger ---
function GeneralLedger({ 
    accounts, 
    journals 
}: { 
    accounts: Account[], 
    journals: JournalEntry[] 
}) {
    const [selectedAccountId, setSelectedAccountId] = useState<string>('all');

    // Filter journals to find lines affecting specific account
    const ledgerData = useMemo(() => {
        if (!journals || !accounts) return [];
        
        if (selectedAccountId === 'all') return [];

        const account = accounts.find(a => a.id === selectedAccountId);
        if (!account) return [];

        const lines: any[] = [];
        let runningBalance = 0;

        const sortedJournals = [...journals].sort((a,b) => a.date.seconds - b.date.seconds);

        sortedJournals.forEach(journal => {
            const line = journal.lines.find(l => l.accountId === selectedAccountId);
            if (line) {
                let change = 0;
                if (['Asset', 'Expense'].includes(account.type)) {
                    change = line.debit - line.credit;
                } else {
                    change = line.credit - line.debit;
                }
                runningBalance += change;

                lines.push({
                    id: journal.id,
                    date: journal.date,
                    description: journal.description,
                    debit: line.debit,
                    credit: line.credit,
                    balance: runningBalance,
                    ref: journal.reference || '-'
                });
            }
        });

        return lines;
    }, [journals, selectedAccountId, accounts]);

    const selectedAccount = accounts.find(a => a.id === selectedAccountId);

    return (
        <div className="space-y-4">
            <div className="flex gap-4 items-center print:hidden">
                <div className="w-[300px]">
                    <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                        <SelectTrigger><SelectValue placeholder="Select Account to View" /></SelectTrigger>
                        <SelectContent>
                            {accounts.sort((a,b) => a.code.localeCompare(b.code)).map(a => (
                                <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4"/> Print Ledger</Button>
            </div>

            {selectedAccountId !== 'all' && selectedAccount ? (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle>Ledger: {selectedAccount.code} - {selectedAccount.name}</CardTitle>
                        <CardDescription>Type: {selectedAccount.type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Debit</TableHead>
                                    <TableHead className="text-right">Credit</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ledgerData.length === 0 ? (
                                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No transactions in this period.</TableCell></TableRow>
                                ) : (
                                    ledgerData.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{format(row.date.toDate(), 'dd/MM/yyyy')}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                            <TableCell className="text-right text-slate-600">{row.debit > 0 ? row.debit.toFixed(2) : '-'}</TableCell>
                                            <TableCell className="text-right text-slate-600">{row.credit > 0 ? row.credit.toFixed(2) : '-'}</TableCell>
                                            <TableCell className="text-right font-bold">GH₵{row.balance.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Select an account above to view its transaction history.</p>
                </div>
            )}
        </div>
    );
}

// --- COMPONENT: Trial Balance ---
function TrialBalance({ data }: { data: AccountBalance[] }) {
    const totalDebit = data.reduce((sum, a) => sum + a.debit, 0);
    const totalCredit = data.reduce((sum, a) => sum + a.credit, 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.1;

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div><CardTitle>Trial Balance</CardTitle><CardDescription>As of {new Date().toLocaleDateString()}</CardDescription></div>
                <Button variant="outline" onClick={() => window.print()} className="print:hidden"><Printer className="mr-2 h-4 w-4"/> Print</Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Account</TableHead>
                            <TableHead className="text-right">Debit</TableHead>
                            <TableHead className="text-right">Credit</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.sort((a,b) => a.code.localeCompare(b.code)).map(account => {
                            const balance = account.net;
                            const isDebitNature = ['Asset', 'Expense'].includes(account.type);
                            
                            let debit = 0;
                            let credit = 0;

                            if (isDebitNature) {
                                debit = balance;
                            } else {
                                credit = -balance;
                            }

                            return (
                                <TableRow key={account.id}>
                                    <TableCell className="font-mono text-xs">{account.code}</TableCell>
                                    <TableCell>{account.name}</TableCell>
                                    <TableCell className="text-right">{debit > 0 ? `GH₵${debit.toFixed(2)}` : '-'}</TableCell>
                                    <TableCell className="text-right">{credit > 0 ? `GH₵${credit.toFixed(2)}` : '-'}</TableCell>
                                </TableRow>
                            );
                        })}
                        <TableRow className="bg-slate-100 font-bold border-t-2 border-slate-300">
                            <TableCell colSpan={2}>Totals</TableCell>
                            <TableCell className="text-right">GH₵{totalDebit.toFixed(2)}</TableCell>
                            <TableCell className="text-right">GH₵{totalCredit.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                {!isBalanced && (
                    <div className="mt-4 p-2 bg-red-100 text-red-700 text-center rounded font-bold">
                        ⚠️ TRIAL BALANCE NOT BALANCED
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// --- COMPONENT: Income Statement (P&L) ---
function IncomeStatement({ data }: { data: AccountBalance[] }) {
    const revenue = data.filter(a => a.type === 'Revenue');
    const expenses = data.filter(a => a.type === 'Expense');

    const totalRevenue = Math.abs(revenue.reduce((sum, a) => sum + (a.net < 0 ? a.net : 0), 0));
    const totalExpense = expenses.reduce((sum, a) => sum + (a.net > 0 ? a.net : 0), 0);
    
    const netIncome = totalRevenue - totalExpense;

    return (
        <Card>
            <CardHeader><CardTitle>Income Statement (P&L)</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                
                {/* Revenue Section */}
                <div>
                    <h3 className="font-bold text-lg text-green-700 border-b pb-2 mb-2">Revenue</h3>
                    <Table>
                        <TableBody>
                            {revenue.map(r => (
                                <TableRow key={r.id}>
                                    <TableCell>{r.name}</TableCell>
                                    <TableCell className="text-right">GH₵{Math.abs(r.net).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="font-bold bg-green-50">
                                <TableCell>Total Revenue</TableCell>
                                <TableCell className="text-right">GH₵{totalRevenue.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Expense Section */}
                <div>
                    <h3 className="font-bold text-lg text-red-700 border-b pb-2 mb-2">Expenses</h3>
                    <Table>
                        <TableBody>
                            {expenses.map(e => (
                                <TableRow key={e.id}>
                                    <TableCell>{e.name}</TableCell>
                                    <TableCell className="text-right">GH₵{Math.abs(e.net).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="font-bold bg-red-50">
                                <TableCell>Total Expenses</TableCell>
                                <TableCell className="text-right">GH₵{totalExpense.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Net Income */}
                <div className={`p-4 rounded-lg flex justify-between items-center text-xl font-bold border ${netIncome >= 0 ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
                    <span>Net Income / (Loss)</span>
                    <span>GH₵{netIncome.toFixed(2)}</span>
                </div>

            </CardContent>
        </Card>
    );
}

// --- COMPONENT: Balance Sheet ---
function BalanceSheet({ data, netIncome }: { data: AccountBalance[], netIncome: number }) {
    const assets = data.filter(a => a.type === 'Asset');
    const liabilities = data.filter(a => a.type === 'Liability');
    const equity = data.filter(a => a.type === 'Equity');

    const totalAssets = assets.reduce((sum, a) => sum + a.net, 0);
    const totalLiabilities = Math.abs(liabilities.reduce((sum, a) => sum + a.net, 0));
    const totalEquity = Math.abs(equity.reduce((sum, a) => sum + a.net, 0));
    
    const totalEquityAndLiabilities = totalLiabilities + totalEquity + netIncome;

    return (
        <Card>
            <CardHeader><CardTitle>Statement of Financial Position</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
                
                {/* Assets */}
                <div>
                    <h3 className="font-bold text-lg text-blue-700 border-b pb-2 mb-2">Assets</h3>
                     <Table>
                        <TableBody>
                            {assets.map(a => (
                                <TableRow key={a.id}>
                                    <TableCell>{a.name}</TableCell>
                                    <TableCell className="text-right">GH₵{a.net.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                             <TableRow className="font-bold bg-blue-50">
                                <TableCell>Total Assets</TableCell>
                                <TableCell className="text-right">GH₵{totalAssets.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Liabilities & Equity */}
                <div>
                    <h3 className="font-bold text-lg text-slate-700 border-b pb-2 mb-2">Liabilities</h3>
                     <Table>
                        <TableHeader><TableRow><TableHead colSpan={2}>Liabilities</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {liabilities.map(l => (
                                <TableRow key={l.id}>
                                    <TableCell>{l.name}</TableCell>
                                    <TableCell className="text-right">GH₵{Math.abs(l.net).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                             <TableRow className="font-semibold bg-slate-100">
                                <TableCell>Total Liabilities</TableCell>
                                <TableCell className="text-right">GH₵{totalLiabilities.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                        <TableHeader><TableRow><TableHead colSpan={2}>Equity</TableHead></TableRow></TableHeader>
                        <TableBody>
                             {equity.map(e => (
                                <TableRow key={e.id}>
                                    <TableCell>{e.name}</TableCell>
                                    <TableCell className="text-right">GH₵{Math.abs(e.net).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                             <TableRow>
                                <TableCell className="italic text-green-700">Retained Earnings (Net Income)</TableCell>
                                <TableCell className="text-right font-bold text-green-700">GH₵{netIncome.toFixed(2)}</TableCell>
                            </TableRow>
                             <TableRow className="font-semibold bg-slate-100">
                                <TableCell>Total Equity</TableCell>
                                <TableCell className="text-right">GH₵{(totalEquity + netIncome).toFixed(2)}</TableCell>
                            </TableRow>
                             <TableRow className="font-bold bg-slate-200">
                                <TableCell>Total Liabilities & Equity</TableCell>
                                <TableCell className="text-right">GH₵{(totalLiabilities + totalEquity).toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

            </CardContent>
        </Card>
    );
}


// --- New Account Form ---
function AccountForm({ setOpen, onAccountAdded, accounts, schoolId }: { setOpen: (open: boolean) => void; onAccountAdded: () => void, accounts: Account[], schoolId: string }) {
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
        if (!firestore) return;
        setIsSubmitting(true);
        try {
            const newDocRef = doc(collection(firestore, 'accounts'));
            await setDoc(newDocRef, {
                ...values,
                id: newDocRef.id,
                schoolId: schoolId,
                balance: 0,
                isControlAccount: values.parentAccountId === 'None',
                parentAccountId: values.parentAccountId === 'None' ? null : values.parentAccountId,
                code: 'TEMP', // Will be updated
            });

            toast({ title: 'Success', description: 'New account has been added.' });
            onAccountAdded();
            form.reset();
            setOpen(false);
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error' });
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

// --- COMPONENT: Chart of Accounts Table ---
function ChartOfAccounts({ accounts, schoolId, onAccountsChanged }: { accounts: Account[], schoolId: string, onAccountsChanged: () => void }) {
    const [isFormOpen, setFormOpen] = useState(false);

    const sortedAccounts = useMemo(() => {
        if (!accounts) return [];
        const controlAccounts = accounts.filter(a => a.isControlAccount).sort((a, b) => (a.code || '').localeCompare(b.code || ''));
        const subAccounts = accounts.filter(a => !a.isControlAccount);

        const result: Account[] = [];
        controlAccounts.forEach(control => {
            result.push(control);
            const children = subAccounts.filter(sub => sub.parentId === control.id).sort((a, b) => (a.code || '').localeCompare(b.code || ''));
            result.push(...children);
        });
        return result;
    }, [accounts]);
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2"><BookMarked /> Chart of Accounts</CardTitle>
                    <CardDescription>The foundational structure of the school's financial ledger.</CardDescription>
                </div>
                <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" /> New Account</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Create New Ledger Account</DialogTitle></DialogHeader>
                        <AccountForm setOpen={setFormOpen} onAccountAdded={onAccountsChanged} accounts={accounts} schoolId={schoolId} />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Account Name</TableHead><TableHead>Type</TableHead><TableHead>Parent</TableHead><TableHead>Description</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {sortedAccounts.map(acc => (
                            <TableRow key={acc.id} className={cn(acc.isControlAccount && 'bg-muted/50 font-bold')}>
                                <TableCell>{acc.code}</TableCell><TableCell>{acc.name}</TableCell><TableCell>{acc.type}</TableCell>
                                <TableCell>{acc.parentAccountId || '-'}</TableCell><TableCell>{acc.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// --- COMPONENT: Journal Entry Form ---
function JournalEntryForm({ accounts, schoolId, onEntryAdded }: { accounts: Account[], schoolId: string, onEntryAdded: () => void }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const postableAccounts = accounts.filter(acc => !acc.isControlAccount);

    const form = useForm<z.infer<typeof journalEntrySchema>>({
        resolver: zodResolver(journalEntrySchema),
    });

    async function onSubmit(values: z.infer<typeof journalEntrySchema>) {
        if (!firestore || !user) return;
        setIsSubmitting(true);
        try {
            const entryData = {
                date: serverTimestamp(),
                description: values.description,
                lines: [
                    { accountId: values.debitAccountId, amount: values.amount, type: 'debit' },
                    { accountId: values.creditAccountId, amount: values.amount, type: 'credit' },
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
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to record entry.' });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card>
            <CardHeader><CardTitle>Manual Journal Entry</CardTitle></CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="e.g., Office supplies purchase" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="amount" render={({ field }) => (
                            <FormItem><FormLabel>Amount</FormLabel><FormControl><Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="debitAccountId" render={({ field }) => (
                                <FormItem><FormLabel>Debit Account</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Choose account to debit" /></SelectTrigger></FormControl><SelectContent>{postableAccounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.name} ({acc.code})</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="creditAccountId" render={({ field }) => (
                                <FormItem><FormLabel>Credit Account</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Choose account to credit" /></SelectTrigger></FormControl><SelectContent>{postableAccounts.map(acc => <SelectItem key={acc.id} value={acc.id}>{acc.name} ({acc.code})</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )} />
                        </div>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Record Entry</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

// Placeholder for PaymentVoucherForm
function PaymentVoucherForm({ accounts, schoolId }: { accounts: Account[], schoolId: string }) {
    return <Card><CardHeader><CardTitle>Payment Vouchers</CardTitle><CardDescription>This feature is under construction.</CardDescription></CardHeader></Card>
}


// --- MAIN PAGE ---
export default function AccountingPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

    const accountsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'accounts'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: accounts, isLoading: accLoading, forceRefetch: forceRefetchAccounts } = useCollection<Account>(accountsQuery);

    const journalsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'journal_entries'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, [firestore, schoolId]);
    const { data: journals, isLoading: jLoading, forceRefetch: forceRefetchJournals } = useCollection<JournalEntry>(journalsQuery);

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);
    if (!canAccess) return <div className="p-8 text-center text-red-500">Access Denied</div>;

    const isLoading = isLoadingSchool || accLoading || jLoading;

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Landmark className="h-8 w-8 text-indigo-700"/>
                <div><h1 className="text-2xl font-bold text-slate-800">Accounting & General Ledger</h1><p className="text-muted-foreground">Manage chart of accounts and expenditures.</p></div>
            </div>
            <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start"><TabsTrigger value="overview">Chart of Accounts</TabsTrigger><TabsTrigger value="journal">Journal Entry</TabsTrigger><TabsTrigger value="pv">Payment Voucher</TabsTrigger></TabsList>
                <TabsContent value="overview" className="mt-4">
                    <div className="grid grid-cols-1 gap-6">
                        {isLoading ? <Loader2 className="mx-auto animate-spin"/> : <ChartOfAccounts accounts={accounts || []} schoolId={schoolId!} onAccountsChanged={forceRefetchAccounts} />}
                    </div>
                </TabsContent>
                <TabsContent value="journal" className="mt-4"><JournalEntryForm accounts={accounts || []} schoolId={schoolId!} onEntryAdded={forceRefetchJournals} /></TabsContent>
                <TabsContent value="pv" className="mt-4"><PaymentVoucherForm accounts={accounts || []} schoolId={schoolId!} /></TabsContent>
            </Tabs>
        </div>
    );
}

