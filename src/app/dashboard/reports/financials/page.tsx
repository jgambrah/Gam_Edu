
'use client';

import { useState, useMemo, useRef } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, orderBy, where, doc, addDoc, runTransaction, serverTimestamp, increment } from 'firebase/firestore';
import { 
  Book, Scale, CreditCard, FileText, Plus, Landmark, 
  Save, Loader2, CornerDownRight, Trash2, Receipt, BarChart, TrendingUp, BookOpen, Printer
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Account, JournalEntry, JournalLine, journalEntrySchema, AccountType, accountSchema, ACCOUNT_TYPES } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn, getCostCenters } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
    accounts: any[], 
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
    const rows = useMemo(() => {
        return data.map(account => {
            const balance = account.net;
            const isDebitNature = ['Asset', 'Expense'].includes(account.type);
            
            let debit = 0;
            let credit = 0;

            if (isDebitNature) {
                if (balance >= 0) {
                    debit = balance;
                } else {
                    credit = -balance;
                }
            } else {
                if (balance <= 0) {
                    credit = -balance;
                } else {
                    debit = balance;
                }
            }

            return {
                ...account,
                displayDebit: debit,
                displayCredit: credit
            };
        });
    }, [data]);

    const totalDebit = useMemo(() => rows.reduce((sum, r) => sum + r.displayDebit, 0), [rows]);
    const totalCredit = useMemo(() => rows.reduce((sum, r) => sum + r.displayCredit, 0), [rows]);
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
                        {rows.sort((a,b) => a.code.localeCompare(b.code)).map(account => {
                            if (account.displayDebit === 0 && account.displayCredit === 0) {
                                return (
                                    <TableRow key={account.id}>
                                        <TableCell className="font-mono text-xs">{account.code}</TableCell>
                                        <TableCell>{account.name}</TableCell>
                                        <TableCell className="text-right">-</TableCell>
                                        <TableCell className="text-right">-</TableCell>
                                    </TableRow>
                                );
                            }

                            return (
                                <TableRow key={account.id}>
                                    <TableCell className="font-mono text-xs">{account.code}</TableCell>
                                    <TableCell>{account.name}</TableCell>
                                    <TableCell className="text-right">
                                        {account.displayDebit > 0 ? `GH₵${account.displayDebit.toFixed(2)}` : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {account.displayCredit > 0 ? `GH₵${account.displayCredit.toFixed(2)}` : '-'}
                                    </TableCell>
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
                                <TableCell className="text-right">GH₵{totalEquityAndLiabilities.toFixed(2)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

            </CardContent>
        </Card>
    );
}


// --- COMPONENT: Departmental Costs ---
function DepartmentalCosts({ 
    accounts, 
    journals, 
    dateRange,
    schoolProfile
}: { 
    accounts: AccountBalance[], 
    journals: JournalEntry[], 
    dateRange: DateRange | undefined,
    schoolProfile: any
}) {
    const filteredJournals = useMemo(() => {
        if (!journals || !dateRange?.from) return [];
        const start = startOfDay(dateRange.from);
        const end = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
        return journals.filter(j => {
            const d = j.date.toDate ? j.date.toDate() : new Date(j.date);
            return d >= start && d <= end;
        });
    }, [journals, dateRange]);

    const departmentalSummary = useMemo(() => {
        const summary: Record<string, { name: string; expenses: number; revenues: number; net: number }> = {};
        const costCenters = getCostCenters(schoolProfile);
        
        // Initialize all known cost centers
        costCenters.forEach(cc => {
            summary[cc.id] = { name: cc.name, expenses: 0, revenues: 0, net: 0 };
        });

        filteredJournals.forEach(j => {
            j.lines.forEach(l => {
                const ccId = l.costCenter || 'General';
                if (!summary[ccId]) {
                    summary[ccId] = { name: ccId, expenses: 0, revenues: 0, net: 0 };
                }

                const balanceAcc = accounts.find(a => a.id === l.accountId);
                const type = balanceAcc?.type || 'Expense';

                if (type === 'Expense') {
                    summary[ccId].expenses += (l.debit - l.credit);
                } else if (type === 'Revenue') {
                    summary[ccId].revenues += (l.credit - l.debit);
                }
            });
        });

        // Compute net allocation
        Object.keys(summary).forEach(key => {
            summary[key].net = summary[key].revenues - summary[key].expenses;
        });

        return summary;
    }, [filteredJournals, accounts]);

    const rows = useMemo(() => {
        return Object.entries(departmentalSummary).map(([id, data]) => ({
            id,
            ...data
        }));
    }, [departmentalSummary]);

    const totals = useMemo(() => {
        let totalExpenses = 0;
        let totalRevenues = 0;
        rows.forEach(r => {
            totalExpenses += r.expenses;
            totalRevenues += r.revenues;
        });
        return {
            expenses: totalExpenses,
            revenues: totalRevenues,
            net: totalRevenues - totalExpenses
        };
    }, [rows]);

    const highestExpenseDept = useMemo(() => {
        let highest = { name: 'None', val: 0 };
        rows.forEach(r => {
            if (r.expenses > highest.val) {
                highest = { name: r.name, val: r.expenses };
            }
        });
        return highest;
    }, [rows]);

    return (
        <div className="space-y-6">
            {/* Overview cards */}
            <div className="grid md:grid-cols-3 gap-4 print:grid-cols-3">
                <Card className="border-none shadow-md bg-gradient-to-br from-indigo-50 to-white">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-indigo-600 font-bold uppercase tracking-wider text-xs">Total Departmental Expenses</CardDescription>
                        <CardTitle className="text-2xl font-black text-slate-800">GH₵{totals.expenses.toFixed(2)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-none shadow-md bg-gradient-to-br from-emerald-50 to-white">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-emerald-600 font-bold uppercase tracking-wider text-xs">Total Departmental Revenues</CardDescription>
                        <CardTitle className="text-2xl font-black text-slate-800">GH₵{totals.revenues.toFixed(2)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-none shadow-md bg-gradient-to-br from-slate-50 to-white">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-slate-500 font-bold uppercase tracking-wider text-xs">Highest Cost Center</CardDescription>
                        <CardTitle className="text-xl font-black text-slate-800">
                            {highestExpenseDept.val > 0 ? (
                                <>{highestExpenseDept.name} <span className="text-xs text-slate-400 font-medium">(GH₵{highestExpenseDept.val.toFixed(2)})</span></>
                            ) : 'None'}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Table Breakdown */}
                <Card className="lg:col-span-2 border-none shadow-md">
                    <CardHeader className="flex flex-row justify-between items-center pb-2">
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800">Departmental Allocation & Cost Breakdown</CardTitle>
                            <CardDescription>Breakdown of revenues, expenses, and net allocation by cost center.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden">
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Department / Cost Center</TableHead>
                                    <TableHead className="text-right">Expenses</TableHead>
                                    <TableHead className="text-right">Revenues</TableHead>
                                    <TableHead className="text-right">Net Allocation</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map(r => (
                                    <TableRow key={r.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell className="font-bold text-slate-700">{r.name}</TableCell>
                                        <TableCell className="text-right text-rose-600 font-mono">
                                            {r.expenses > 0 ? `GH₵${r.expenses.toFixed(2)}` : 'GH₵0.00'}
                                        </TableCell>
                                        <TableCell className="text-right text-emerald-600 font-mono">
                                            {r.revenues > 0 ? `GH₵${r.revenues.toFixed(2)}` : 'GH₵0.00'}
                                        </TableCell>
                                        <TableCell className={cn(
                                            "text-right font-black font-mono",
                                            r.net >= 0 ? "text-emerald-700" : "text-rose-700"
                                        )}>
                                            {r.net >= 0 ? '+' : ''}GH₵{r.net.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="bg-slate-100 font-bold border-t-2 border-slate-300">
                                    <TableCell>Totals</TableCell>
                                    <TableCell className="text-right text-rose-700 font-mono">GH₵{totals.expenses.toFixed(2)}</TableCell>
                                    <TableCell className="text-right text-emerald-700 font-mono">GH₵{totals.revenues.toFixed(2)}</TableCell>
                                    <TableCell className={cn(
                                        "text-right font-black font-mono",
                                        totals.net >= 0 ? "text-emerald-800" : "text-rose-800"
                                    )}>
                                        {totals.net >= 0 ? '+' : ''}GH₵{totals.net.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Progress Indicators */}
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-800">Expense Share %</CardTitle>
                        <CardDescription>Visual distribution of departmental expenses.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {rows.map(r => {
                            const percent = totals.expenses > 0 ? (r.expenses / totals.expenses) * 100 : 0;
                            return (
                                <div key={r.id} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-slate-700">
                                        <span>{r.name}</span>
                                        <span className="font-mono text-slate-500">{percent.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className={cn(
                                                "h-2 rounded-full transition-all duration-500",
                                                r.id === 'General' ? "bg-slate-500" :
                                                r.id === 'Academics' ? "bg-indigo-600" :
                                                r.id === 'Sports' ? "bg-amber-500" :
                                                r.id === 'Transport' ? "bg-blue-500" :
                                                r.id === 'Catering' ? "bg-emerald-500" :
                                                "bg-rose-500"
                                            )} 
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-right text-slate-400 font-mono font-medium">
                                        GH₵{r.expenses.toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


// --- MAIN PAGE ---
export default function FinancialReportsPage() {
    const firestore = useFirestore();
    const { role } = useRole();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
    
    // Date Filtering
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfMonth(new Date()),
        to: endOfMonth(new Date()),
    });

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role || '');

    // Fetch school-specific data
    const accountsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'accounts'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: accounts, isLoading: accLoading } = useCollection<Account>(accountsQuery);

    const journalsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'journal_entries'), where('schoolId', '==', schoolId), orderBy('date', 'asc')) : null, [firestore, schoolId]);
    const { data: allJournals, isLoading: jLoading } = useCollection<JournalEntry>(journalsQuery);

    const schoolProfileRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    const { calculatedBalances, netIncome } = useMemo(() => {
        if (!accounts || !allJournals || !dateRange?.from) return { calculatedBalances: [], netIncome: 0 };
        
        const start = startOfDay(dateRange.from);
        const end = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);

        const filteredJournals = allJournals.filter(j => {
            const d = j.date.toDate();
            return d >= start && d <= end;
        });

        // Track virtual accounts from journal entries that are not in the main accounts chart
        const journalAccountMap = new Map<string, { name: string; type: string }>();
        filteredJournals.forEach(j => {
            j.lines.forEach(l => {
                if (!journalAccountMap.has(l.accountId)) {
                    let type = 'Expense';
                    if (l.accountId.includes('VAT') || l.accountId.toLowerCase().includes('asset') || l.accountId.includes('DEFAULT-VAT')) {
                        type = 'Asset';
                    } else if (l.accountId.includes('WHT') || l.accountId.toLowerCase().includes('payable') || l.accountId.toLowerCase().includes('liability') || l.accountId.includes('DEFAULT-WHT')) {
                        type = 'Liability';
                    }
                    journalAccountMap.set(l.accountId, {
                        name: l.accountName || l.accountId,
                        type: type
                    });
                }
            });
        });

        // Always ensure default virtual accounts are defined in journalAccountMap
        if (!journalAccountMap.has('VAT-INPUT-DEFAULT')) {
            journalAccountMap.set('VAT-INPUT-DEFAULT', { name: 'VAT Input', type: 'Asset' });
        }
        if (!journalAccountMap.has('WHT-PAYABLE-DEFAULT')) {
            journalAccountMap.set('WHT-PAYABLE-DEFAULT', { name: 'WHT Payable', type: 'Liability' });
        }

        const allAccountIds = new Set([
            ...accounts.map(a => a.id),
            ...journalAccountMap.keys()
        ]);

        const balances: AccountBalance[] = Array.from(allAccountIds).map(id => {
            const officialAcc = accounts.find(a => a.id === id);
            const journalAcc = journalAccountMap.get(id);

            const accName = officialAcc?.name || journalAcc?.name || id;
            const accCode = officialAcc?.code || (id.includes('VAT') ? '1999' : id.includes('WHT') ? '2999' : '9999');
            const accType = officialAcc?.type || journalAcc?.type || 'Expense';

            let debit = 0;
            let credit = 0;

            filteredJournals.forEach(j => {
                const line = j.lines.find(l => l.accountId === id);
                if (line) {
                    debit += line.debit;
                    credit += line.credit;
                }
            });

            const net = debit - credit;

            return {
                id,
                code: accCode,
                name: accName,
                type: accType,
                debit,
                credit,
                net
            };
        });

        const revenue = Math.abs(balances.filter(a => a.type === 'Revenue').reduce((sum, a) => sum + (a.net < 0 ? a.net : 0), 0));
        const expense = balances.filter(a => a.type === 'Expense').reduce((sum, a) => sum + (a.net > 0 ? a.net : 0), 0);

        return { calculatedBalances: balances, netIncome: revenue - expense };

    }, [accounts, allJournals, dateRange]);

    if (!canAccess) return <div className="p-8 text-center text-red-500">Access Denied</div>;

    const isLoading = isLoadingSchool || accLoading || jLoading;

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><FileText className="text-indigo-600"/> Financial Reports</h1>
                    <p className="text-muted-foreground">Generate standard accounting statements.</p>
                </div>
                
                <div className="flex items-center gap-2 bg-white p-2 rounded-md border shadow-sm">
                    <Popover>
                        <PopoverTrigger asChild><Button variant="outline" className="w-[300px] justify-start text-left font-normal"><CalendarIcon className="mr-2 h-4 w-4" />{dateRange?.from ? (dateRange.to ? (<>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>) : (format(dateRange.from, "LLL dd, y"))) : (<span>Pick date range</span>)}</Button></PopoverTrigger>
                        <PopoverContent className="w-auto p-0"><Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} /></PopoverContent>
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
                        <TabsTrigger value="departments"><BarChart className="h-4 w-4 mr-2"/> Departmental Costs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="ledger" className="mt-4">
                        <GeneralLedger accounts={calculatedBalances} journals={allJournals || []} />
                    </TabsContent>
                    <TabsContent value="tb" className="mt-4"><TrialBalance data={calculatedBalances} /></TabsContent>
                    <TabsContent value="pl" className="mt-4"><IncomeStatement data={calculatedBalances} /></TabsContent>
                    <TabsContent value="bs" className="mt-4"><BalanceSheet data={calculatedBalances} netIncome={netIncome} /></TabsContent>
                    <TabsContent value="departments" className="mt-4">
                        <DepartmentalCosts accounts={calculatedBalances} journals={allJournals || []} dateRange={dateRange} schoolProfile={schoolProfile} />
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
