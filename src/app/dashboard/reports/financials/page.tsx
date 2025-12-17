
'use client';

import { useState, useMemo, useRef } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, where } from 'firebase/firestore';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { 
  Printer, Filter, TrendingUp, TrendingDown, Scale, 
  BookOpen, FileBarChart, DollarSign, CalendarIcon, Loader2, Landmark 
} from 'lucide-react';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Account, JournalEntry, JournalLine } from '@/lib/types';

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
export default function FinancialReportsPage() {
    const firestore = useFirestore();
    const { role } = useRole();
    const { user } = useAuth();
    
    // Date Filtering
    const [fromDate, setFromDate] = useState<Date>(startOfMonth(new Date()));
    const [toDate, setToDate] = useState<Date>(endOfMonth(new Date()));

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);

    // 1. Fetch ALL Accounts
    const accountsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'accounts')) : null, [firestore]);
    const { data: accounts, isLoading: accLoading } = useCollection<Account>(accountsQuery);

    // 2. Fetch ALL Journals
    const journalsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'journal_entries'), orderBy('date', 'asc')) : null, [firestore]);
    const { data: allJournals, isLoading: jLoading } = useCollection<JournalEntry>(journalsQuery);

    // 3. Process Data
    const { calculatedBalances, netIncome } = useMemo(() => {
        if (!accounts || !allJournals) return { calculatedBalances: [], netIncome: 0 };

        const filteredJournals = allJournals.filter(j => {
            const d = j.date.toDate();
            return d >= fromDate && d <= toDate;
        });

        const balances: AccountBalance[] = accounts.map(acc => {
            let debit = 0;
            let credit = 0;

            filteredJournals.forEach(j => {
                const line = j.lines.find(l => l.accountId === acc.id);
                if (line) {
                    debit += line.debit;
                    credit += line.credit;
                }
            });

            let net = 0;
            if (['Asset', 'Expense'].includes(acc.type)) {
                net = debit - credit;
            } else {
                net = -(credit - debit); 
            }

            return { ...acc, debit, credit, net };
        });

        const revenue = Math.abs(balances.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + (a.net < 0 ? a.net : 0), 0));
        const expense = balances.filter(a => a.type === 'Expense').reduce((sum, a) => sum + (a.net > 0 ? a.net : 0), 0);

        return { calculatedBalances: balances, netIncome: revenue - expense };

    }, [accounts, allJournals, fromDate, toDate]);

    if (!canAccess) return <div className="p-8 text-center text-red-500">Access Denied</div>;

    const isLoading = accLoading || jLoading;

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><FileBarChart className="text-indigo-600"/> Financial Reports</h1>
                    <p className="text-muted-foreground">Generate standard accounting statements.</p>
                </div>
                
                {/* Date Filter */}
                <div className="flex items-center gap-2 bg-white p-2 rounded-md border shadow-sm">
                    <Popover>
                        <PopoverTrigger asChild><Button variant="outline" className="w-[140px] justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{format(fromDate, "PP")}</Button></PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={fromDate} onSelect={(d) => d && setFromDate(d)} initialFocus/></PopoverContent>
                    </Popover>
                    <span className="text-slate-400">to</span>
                    <Popover>
                        <PopoverTrigger asChild><Button variant="outline" className="w-[140px] justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{format(toDate, "PP")}</Button></PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={toDate} onSelect={(d) => d && setToDate(d)} initialFocus/></PopoverContent>
                    </Popover>
                </div>
            </div>

            {isLoading ? <Loader2 className="mx-auto mt-20 animate-spin"/> : (
                <Tabs defaultValue="ledger">
                    <TabsList className="print:hidden">
                        <TabsTrigger value="ledger"><BookOpen className="h-4 w-4 mr-2"/> General Ledger</TabsTrigger>
                        <TabsTrigger value="tb"><Scale className="h-4 w-4 mr-2"/> Trial Balance</TabsTrigger>
                        <TabsTrigger value="pl"><TrendingUp className="h-4 w-4 mr-2"/> Income Statement</TabsTrigger>
                        <TabsTrigger value="bs"><Landmark className="h-4 w-4 mr-2"/> Balance Sheet</TabsTrigger>
                    </TabsList>

                    <TabsContent value="ledger" className="mt-4">
                        <GeneralLedger accounts={accounts || []} journals={allJournals || []} />
                    </TabsContent>

                    <TabsContent value="tb" className="mt-4">
                        <TrialBalance data={calculatedBalances} />
                    </TabsContent>

                    <TabsContent value="pl" className="mt-4">
                        <IncomeStatement data={calculatedBalances} />
                    </TabsContent>

                    <TabsContent value="bs" className="mt-4">
                        <BalanceSheet data={calculatedBalances} netIncome={netIncome} />
                    </TabsContent>
                </Tabs>
            )}

            <style jsx global>{`
                @media print {
                    .print\\:hidden { display: none !important; }
                    nav, header, aside { display: none !important; }
                    body { background: white; }
                    .card { border: none; shadow: none; }
                }
            `}</style>
        </div>
    );
}
