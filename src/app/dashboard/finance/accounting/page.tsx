
'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, where, doc, addDoc, runTransaction, serverTimestamp, increment } from 'firebase/firestore';
import { 
  Book, Scale, CreditCard, FileText, Plus, Landmark, 
  Save, Loader2, CornerDownRight, Trash2, Receipt, BarChart, TrendingUp, BookOpen
} from 'lucide-react';
import { format } from 'date-fns';
import { useCurrentSchool } from '@/hooks/use-current-school';

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
import { Checkbox } from '@/components/ui/checkbox';
import { Account, JournalEntry, JournalLine, journalEntrySchema, AccountType } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

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

// --- MAIN PAGE ---
export default function AccountingPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();

    const accountsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'accounts'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: accounts, isLoading: accLoading } = useCollection<Account>(accountsQuery);

    const journalQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'journal_entries'), where('schoolId', '==', schoolId), orderBy('createdAt', 'desc')) : null, [firestore, schoolId]);
    const { data: journals } = useCollection<JournalEntry>(journalQuery);

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);
    if (!canAccess) return <div className="p-8 text-center text-red-500">Access Denied</div>;

    const isLoading = accLoading || !schoolId;

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Landmark className="h-8 w-8 text-indigo-700"/>
                <div><h1 className="text-2xl font-bold text-slate-800">Accounting & General Ledger</h1><p className="text-muted-foreground">Manage chart of accounts and expenditures.</p></div>
            </div>
            <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start"><TabsTrigger value="overview">Chart of Accounts</TabsTrigger><TabsTrigger value="journal">Journal Entry</TabsTrigger><TabsTrigger value="pv">Payment Voucher</TabsTrigger></TabsList>
                <TabsContent value="overview" className="mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">{isLoading ? <Loader2 className="mx-auto animate-spin"/> : <ChartOfAccounts accounts={accounts || []} schoolId={schoolId!} />}</div>
                        <div className="space-y-4">
                            <Card className="bg-blue-50 border-blue-100"><CardHeader><CardTitle className="text-sm">Total Assets</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-blue-700">GH₵{accounts?.filter(a => a.type === 'Asset').reduce((sum, a) => sum + a.balance, 0).toFixed(2)}</CardContent></Card>
                            <Card className="bg-green-50 border-green-100"><CardHeader><CardTitle className="text-sm">Total Revenue</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-green-700">GH₵{accounts?.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + a.balance, 0).toFixed(2)}</CardContent></Card>
                            <Card className="bg-red-50 border-red-100"><CardHeader><CardTitle className="text-sm">Total Expenses</CardTitle></CardHeader><CardContent className="text-2xl font-bold text-red-700">GH₵{accounts?.filter(a => a.type === 'Expense').reduce((sum, a) => sum + a.balance, 0).toFixed(2)}</CardContent></Card>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="journal" className="mt-4"><JournalEntryForm accounts={accounts || []} schoolId={schoolId!} /></TabsContent>
                <TabsContent value="pv" className="mt-4"><PaymentVoucherForm accounts={accounts || []} schoolId={schoolId!} /></TabsContent>
            </Tabs>
        </div>
    );
}
