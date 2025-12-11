'use client';

import { useState, useMemo } from 'react';
import { useAuth, useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, updateDoc, increment, getDocs, where, runTransaction } from 'firebase/firestore';
import { 
  Book, Scale, CreditCard, FileText, Plus, Landmark, 
  ArrowRightLeft, Save, Loader2, DollarSign, TrendingDown 
} from 'lucide-react';
import { format } from 'date-fns';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Account, JournalEntry, PaymentVoucher } from '@/lib/types';

// --- COMPONENT: Chart of Accounts Manager ---
function ChartOfAccounts({ accounts }: { accounts: Account[] | undefined }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [type, setType] = useState('Expense');

    const handleCreate = async () => {
        if (!code || !name) return;
        setIsSubmitting(true);
        try {
            await addDoc(collection(firestore, 'accounts'), {
                code, name, type, balance: 0, createdAt: serverTimestamp()
            });
            toast({ title: "Account Created" });
            setIsFormOpen(false);
            setCode(''); setName('');
        } catch (e) {
            toast({ variant: 'destructive', title: "Error", description: "Could not create account." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">General Ledger Accounts</h3>
                <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4"/> New Account</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Add Ledger Account</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Account Code</Label>
                                    <Input value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. 5001" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Asset">Asset (Cash/Bank/AR)</SelectItem>
                                            <SelectItem value="Liability">Liability (AP/Loans)</SelectItem>
                                            <SelectItem value="Equity">Equity</SelectItem>
                                            <SelectItem value="Revenue">Revenue (Income)</SelectItem>
                                            <SelectItem value="Expense">Expense</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Account Name</Label>
                                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Canteen Supplies" />
                            </div>
                            <Button onClick={handleCreate} disabled={isSubmitting} className="w-full">Save Account</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="border rounded-md bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Balance (GH₵)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accounts?.sort((a,b) => a.code.localeCompare(b.code)).map(acc => (
                            <TableRow key={acc.id}>
                                <TableCell className="font-mono">{acc.code}</TableCell>
                                <TableCell className="font-medium">{acc.name}</TableCell>
                                <TableCell><Badge variant="outline">{acc.type}</Badge></TableCell>
                                <TableCell className="text-right font-bold">{acc.balance.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

// --- COMPONENT: Journal Entry (Double Entry) ---
function JournalEntryForm({ accounts }: { accounts: Account[] | undefined }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [desc, setDesc] = useState('');
    const [lines, setLines] = useState([{ accountId: '', debit: 0, credit: 0 }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const totalDebit = lines.reduce((sum, line) => sum + (line.debit || 0), 0);
    const totalCredit = lines.reduce((sum, line) => sum + (line.credit || 0), 0);
    const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01 && totalDebit > 0;

    const addLine = () => setLines([...lines, { accountId: '', debit: 0, credit: 0 }]);
    const removeLine = (idx: number) => setLines(lines.filter((_, i) => i !== idx));

    const updateLine = (idx: number, field: string, value: any) => {
        const newLines = [...lines];
        (newLines[idx] as any)[field] = value;
        // Auto-zero the other side
        if(field === 'debit' && value > 0) newLines[idx].credit = 0;
        if(field === 'credit' && value > 0) newLines[idx].debit = 0;
        setLines(newLines);
    };

    const handlePost = async () => {
        if (!firestore || !user) return;
        if (!isBalanced) {
            toast({ variant: 'destructive', title: "Unbalanced", description: "Debits must equal Credits." });
            return;
        }

        setIsSubmitting(true);
        try {
            await runTransaction(firestore, async (transaction) => {
                // 1. Create Journal Entry
                const journalRef = doc(collection(firestore, 'journal_entries'));
                
                // Get Account Names for history
                const finalLines = lines.map(line => ({
                    ...line,
                    accountName: accounts?.find(a => a.id === line.accountId)?.name || 'Unknown'
                }));

                transaction.set(journalRef, {
                    date: new Date(date),
                    description: desc,
                    lines: finalLines,
                    totalAmount: totalDebit,
                    createdBy: user.uid,
                    createdAt: serverTimestamp()
                });

                // 2. Update Account Balances
                // Asset/Expense: Debit increases (+), Credit decreases (-)
                // Liability/Equity/Revenue: Credit increases (+), Debit decreases (-)
                for (const line of lines) {
                    const accRef = doc(firestore, 'accounts', line.accountId);
                    const accDoc = await transaction.get(accRef);
                    if (!accDoc.exists()) throw "Account not found";
                    
                    const accData = accDoc.data() as Account;
                    let change = 0;

                    if (['Asset', 'Expense'].includes(accData.type)) {
                        change = line.debit - line.credit;
                    } else {
                        change = line.credit - line.debit;
                    }

                    transaction.update(accRef, {
                        balance: increment(change)
                    });
                }
            });

            toast({ title: "Posted", description: "Journal Entry successful." });
            setDesc('');
            setLines([{ accountId: '', debit: 0, credit: 0 }, { accountId: '', debit: 0, credit: 0 }]);
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error", description: "Transaction failed." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader><CardTitle>Manual Journal Entry</CardTitle><CardDescription>Record complex adjustments or transfers.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div><Label>Date</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
                    <div className="col-span-2"><Label>Narration / Description</Label><Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Opening Balance Adjustment" /></div>
                </div>

                <div className="border rounded-md p-2 bg-slate-50 space-y-2">
                    {lines.map((line, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <Select value={line.accountId} onValueChange={(v) => updateLine(idx, 'accountId', v)}>
                                <SelectTrigger className="flex-1"><SelectValue placeholder="Select Account" /></SelectTrigger>
                                <SelectContent>
                                    {accounts?.map(a => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <div className="w-24"><Input type="number" placeholder="Dr" value={line.debit || ''} onChange={e => updateLine(idx, 'debit', parseFloat(e.target.value))} /></div>
                            <div className="w-24"><Input type="number" placeholder="Cr" value={line.credit || ''} onChange={e => updateLine(idx, 'credit', parseFloat(e.target.value))} /></div>
                            <Button variant="ghost" size="icon" onClick={() => removeLine(idx)}><Trash2 className="h-4 w-4 text-red-500"/></Button>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addLine}><Plus className="mr-2 h-4 w-4"/> Add Line</Button>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                    <div className="text-sm">
                        Total Dr: <span className="font-bold">₵{totalDebit.toFixed(2)}</span> | 
                        Total Cr: <span className="font-bold">₵{totalCredit.toFixed(2)}</span>
                        {!isBalanced && <span className="text-red-500 ml-2 font-bold">(Diff: ₵{Math.abs(totalDebit - totalCredit).toFixed(2)})</span>}
                    </div>
                    <Button onClick={handlePost} disabled={!isBalanced || isSubmitting || totalDebit === 0}>
                        {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>} Post Entry
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// --- COMPONENT: Payment Voucher (Expenditure) ---
function PaymentVoucherForm({ accounts }: { accounts: Account[] | undefined }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    
    const [payee, setPayee] = useState('');
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [expenseAcc, setExpenseAcc] = useState('');
    const [paymentAcc, setPaymentAcc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filter accounts
    const expenseAccounts = accounts?.filter(a => a.type === 'Expense' || a.type === 'Liability');
    const paymentAccounts = accounts?.filter(a => a.type === 'Asset'); // Cash or Bank

    const handleCreatePV = async () => {
        if (!firestore || !user) return;
        if (!payee || !amount || !expenseAcc || !paymentAcc) {
            toast({ variant: 'destructive', title: "Missing Fields" });
            return;
        }

        setIsSubmitting(true);
        try {
            await runTransaction(firestore, async (transaction) => {
                // 1. Create PV Record
                const pvRef = doc(collection(firestore, 'payment_vouchers'));
                transaction.set(pvRef, {
                    payee, description: desc, amount: parseFloat(amount),
                    expenseAccountId: expenseAcc, paymentAccountId: paymentAcc,
                    status: 'Paid', date: serverTimestamp(), createdBy: user.uid
                });

                // 2. Create Journal Entry (Debit Expense, Credit Bank)
                const journalRef = doc(collection(firestore, 'journal_entries'));
                const expName = accounts?.find(a => a.id === expenseAcc)?.name || '';
                const bankName = accounts?.find(a => a.id === paymentAcc)?.name || '';
                const val = parseFloat(amount);

                transaction.set(journalRef, {
                    date: new Date(),
                    description: `PV: ${desc} - ${payee}`,
                    totalAmount: val,
                    createdBy: user.uid,
                    createdAt: serverTimestamp(),
                    lines: [
                        { accountId: expenseAcc, accountName: expName, debit: val, credit: 0 },
                        { accountId: paymentAcc, accountName: bankName, debit: 0, credit: val }
                    ]
                });

                // 3. Update Balances
                // Expense (Debit) -> Increases Balance
                transaction.update(doc(firestore, 'accounts', expenseAcc), { balance: increment(val) });
                // Asset (Credit) -> Decreases Balance
                transaction.update(doc(firestore, 'accounts', paymentAcc), { balance: increment(-val) });
            });

            toast({ title: "Voucher Created", description: "Expense recorded and accounts updated." });
            setPayee(''); setAmount(''); setDesc('');
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error", description: "Failed to process voucher." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader><CardTitle>Payment Voucher (Expenditure)</CardTitle><CardDescription>Record payments to vendors or staff.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Payee / Vendor</Label><Input value={payee} onChange={e => setPayee(e.target.value)} placeholder="e.g. ECG Ghana" /></div>
                    <div className="space-y-2"><Label>Amount (GH₵)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} /></div>
                </div>
                <div className="space-y-2"><Label>Description / Particulars</Label><Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Electricity Bill for May" /></div>
                
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border">
                    <div className="space-y-2">
                        <Label>Debit Account (Expense)</Label>
                        <Select value={expenseAcc} onValueChange={setExpenseAcc}>
                            <SelectTrigger><SelectValue placeholder="Select Expense Category"/></SelectTrigger>
                            <SelectContent>
                                {expenseAccounts?.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Credit Account (Source of Funds)</Label>
                        <Select value={paymentAcc} onValueChange={setPaymentAcc}>
                            <SelectTrigger><SelectValue placeholder="Select Bank/Cash"/></SelectTrigger>
                            <SelectContent>
                                {paymentAccounts?.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Button onClick={handleCreatePV} disabled={isSubmitting} className="w-full">
                    {isSubmitting ? <Loader2 className="animate-spin"/> : <FileText className="mr-2 h-4 w-4"/>} 
                    Process Payment
                </Button>
            </CardContent>
        </Card>
    );
}

// --- MAIN PAGE ---
export default function AccountingPage() {
    const { role } = useRole();
    const firestore = useFirestore();

    const accountsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'accounts')) : null, [firestore]);
    const { data: accounts, isLoading } = useCollection<Account>(accountsQuery);

    const journalQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'journal_entries'), orderBy('createdAt', 'desc')) : null, [firestore]);
    const { data: journals } = useCollection<JournalEntry>(journalQuery);

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);

    if (!canAccess) return <div className="p-8 text-center text-red-500">Access Denied</div>;

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Landmark className="h-8 w-8 text-indigo-700"/>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Accounting & General Ledger</h1>
                    <p className="text-muted-foreground">Manage chart of accounts, journal entries, and expenditures.</p>
                </div>
            </div>

            <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="overview">Chart of Accounts</TabsTrigger>
                    <TabsTrigger value="journal">Journal Entry</TabsTrigger>
                    <TabsTrigger value="pv">Payment Voucher</TabsTrigger>
                    <TabsTrigger value="report">General Ledger</TabsTrigger>
                </TabsList>

                {/* TAB 1: COA */}
                <TabsContent value="overview" className="mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                             {isLoading ? <Loader2 className="mx-auto animate-spin"/> : <ChartOfAccounts accounts={accounts || []} />}
                        </div>
                        <div className="space-y-4">
                            <Card className="bg-blue-50 border-blue-100">
                                <CardHeader><CardTitle className="text-sm">Total Assets</CardTitle></CardHeader>
                                <CardContent className="text-2xl font-bold text-blue-700">
                                    GH₵{accounts?.filter(a => a.type === 'Asset').reduce((sum, a) => sum + a.balance, 0).toFixed(2)}
                                </CardContent>
                            </Card>
                            <Card className="bg-green-50 border-green-100">
                                <CardHeader><CardTitle className="text-sm">Total Revenue</CardTitle></CardHeader>
                                <CardContent className="text-2xl font-bold text-green-700">
                                    GH₵{accounts?.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + a.balance, 0).toFixed(2)}
                                </CardContent>
                            </Card>
                            <Card className="bg-red-50 border-red-100">
                                <CardHeader><CardTitle className="text-sm">Total Expenses</CardTitle></CardHeader>
                                <CardContent className="text-2xl font-bold text-red-700">
                                    GH₵{accounts?.filter(a => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0).toFixed(2)}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* TAB 2: JOURNAL */}
                <TabsContent value="journal" className="mt-4">
                    <JournalEntryForm accounts={accounts || []} />
                </TabsContent>

                {/* TAB 3: VOUCHERS */}
                <TabsContent value="pv" className="mt-4">
                    <PaymentVoucherForm accounts={accounts || []} />
                </TabsContent>

                {/* TAB 4: GL REPORT */}
                <TabsContent value="report" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>General Ledger Transactions</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Details (Dr/Cr)</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {journals?.map(j => (
                                        <TableRow key={j.id}>
                                            <TableCell className="text-xs">{j.date ? format(j.date.toDate(), 'PPP') : 'N/A'}</TableCell>
                                            <TableCell className="font-medium">{j.description}</TableCell>
                                            <TableCell>
                                                <div className="text-xs space-y-1">
                                                    {j.lines.map((line, i) => (
                                                        <div key={i} className="flex justify-between w-[200px]">
                                                            <span>{line.accountName}</span>
                                                            <span>
                                                                {line.debit > 0 ? <span className="text-slate-600">Dr {line.debit}</span> : <span className="text-slate-400">Cr {line.credit}</span>}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-bold">GH₵{j.totalAmount.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
