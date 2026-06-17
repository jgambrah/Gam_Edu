'use client';

import { useState, useMemo, useRef } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, orderBy, where, doc, addDoc, runTransaction, serverTimestamp, increment } from 'firebase/firestore';
import { 
  Book, Scale, CreditCard, FileText, Plus, Landmark, 
  Save, Loader2, CornerDownRight, Trash2, Receipt, BarChart, TrendingUp, BookOpen, Printer,
  Search, Filter, CheckCircle2, AlertTriangle, CalendarIcon, ArrowDownRight, ArrowUpRight, ShieldCheck
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
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// --- TYPES & HELPERS ---
type AccountBalance = {
    id: string;
    code: string;
    name: string;
    type: string;
    debit: number;
    credit: number;
    net: number; // Positive = Debit Balance, Negative = Credit Balance
};

function formatDateSafe(timestamp: any) {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) {
        return format(timestamp.toDate(), 'dd/MM/yyyy');
    }
    if (timestamp instanceof Date) {
        return format(timestamp, 'dd/MM/yyyy');
    }
    return format(new Date(timestamp), 'dd/MM/yyyy');
}

// Accounting Classification Rules (IAS Standard Prefixes)
function getRevenueCategory(code: string): 'Operating' | 'Trading' {
    const num = parseInt(code) || 4000;
    return num < 4400 ? 'Operating' : 'Trading';
}

function getExpenseCategory(code: string): 'Operating' | 'Administrative' {
    const num = parseInt(code) || 5000;
    return num < 5400 ? 'Operating' : 'Administrative';
}

function getAssetCategory(code: string): 'Current' | 'Non-Current' {
    const num = parseInt(code) || 1000;
    return num < 1500 ? 'Current' : 'Non-Current';
}

function getLiabilityCategory(code: string): 'Current' | 'Non-Current' {
    const num = parseInt(code) || 2000;
    return num < 2500 ? 'Current' : 'Non-Current';
}

// Printed Signature Sign-off blocks component
function PrintedSignatures() {
    return (
        <div className="hidden print:flex justify-between mt-16 pt-8 border-t border-slate-200 text-xs text-slate-500">
            <div className="text-center w-64">
                <div className="border-t border-slate-300 pt-2 font-semibold text-slate-700">Prepared By: Principal Accountant</div>
                <div className="mt-1 text-[10px]">Date: __________________</div>
            </div>
            <div className="text-center w-64">
                <div className="border-t border-slate-300 pt-2 font-semibold text-slate-700">Approved By: School Director</div>
                <div className="mt-1 text-[10px]">Date: __________________</div>
            </div>
        </div>
    );
}

// --- COMPONENT: Detailed Ledger ---
function GeneralLedger({ 
    accounts, 
    journals 
}: { 
    accounts: any[], 
    journals: JournalEntry[] 
}) {
    const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');

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

    const filteredLines = useMemo(() => {
        if (!searchQuery) return ledgerData;
        return ledgerData.filter(line => 
            line.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            line.ref.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [ledgerData, searchQuery]);

    const aggregates = useMemo(() => {
        let debits = 0;
        let credits = 0;
        filteredLines.forEach(l => {
            debits += l.debit;
            credits += l.credit;
        });
        return { debits, credits };
    }, [filteredLines]);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center print:hidden flex-wrap gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex gap-3 items-center flex-1 max-w-lg">
                    <div className="w-[280px]">
                        <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                            <SelectTrigger className="bg-white"><SelectValue placeholder="Select Account Ledger" /></SelectTrigger>
                            <SelectContent>
                                {accounts.sort((a,b) => a.code.localeCompare(b.code)).map(a => (
                                    <SelectItem key={a.id} value={a.id}>{a.code} - {a.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedAccountId !== 'all' && (
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                            <Input 
                                placeholder="Search transactions..." 
                                className="pl-9 h-9 bg-white" 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    )}
                </div>
                {selectedAccountId !== 'all' && (
                    <Button variant="outline" onClick={() => window.print()} className="border-slate-300"><Printer className="mr-2 h-4 w-4"/> Print Ledger Sheet</Button>
                )}
            </div>

            {selectedAccountId !== 'all' && selectedAccount ? (
                <Card className="border-slate-200 shadow-md">
                    <CardHeader className="pb-3 border-b flex flex-row justify-between items-start flex-wrap gap-4 bg-slate-50/50">
                        <div>
                            <CardTitle className="text-slate-800 text-lg font-bold">Ledger: {selectedAccount.code} - {selectedAccount.name}</CardTitle>
                            <CardDescription className="text-xs">Classification Group: <Badge variant="secondary" className="uppercase font-bold text-[9px]">{selectedAccount.type}</Badge></CardDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-700 bg-white p-3 rounded-lg border shadow-sm print:grid-cols-2">
                            <div>
                                <span className="text-[10px] text-slate-400 block font-bold">PERIOD TOTAL DEBITS</span>
                                <span className="font-extrabold text-slate-800">GH₵{aggregates.debits.toFixed(2)}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-400 block font-bold">PERIOD TOTAL CREDITS</span>
                                <span className="font-extrabold text-slate-800">GH₵{aggregates.credits.toFixed(2)}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="pl-6 font-bold text-xs">Date</TableHead>
                                    <TableHead className="font-bold text-xs">Reference</TableHead>
                                    <TableHead className="font-bold text-xs">Description Details</TableHead>
                                    <TableHead className="text-right font-bold text-xs">Debit (Inflow)</TableHead>
                                    <TableHead className="text-right font-bold text-xs">Credit (Outflow)</TableHead>
                                    <TableHead className="text-right pr-6 font-bold text-xs">Running Balance</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLines.length === 0 ? (
                                    <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-xs">No transactions matching search query.</TableCell></TableRow>
                                ) : (
                                    filteredLines.map((row) => (
                                        <TableRow key={row.id} className="hover:bg-slate-50/55">
                                            <TableCell className="pl-6 text-xs text-slate-500">{formatDateSafe(row.date)}</TableCell>
                                            <TableCell className="text-xs font-bold font-mono text-slate-600">{row.ref}</TableCell>
                                            <TableCell className="text-xs text-slate-700">{row.description}</TableCell>
                                            <TableCell className="text-right text-xs font-mono font-semibold text-slate-650">{row.debit > 0 ? `GH₵${row.debit.toFixed(2)}` : '-'}</TableCell>
                                            <TableCell className="text-right text-xs font-mono font-semibold text-slate-650">{row.credit > 0 ? `GH₵${row.credit.toFixed(2)}` : '-'}</TableCell>
                                            <TableCell className="text-right text-sm font-mono pr-6 font-bold text-slate-800">GH₵{row.balance.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-slate-50/50">
                    <BookOpen className="mx-auto h-12 w-12 text-slate-400 stroke-1 mb-2"/>
                    <p className="text-slate-500 font-semibold text-sm">Select an account from the dropdown selection above to load ledger transactions.</p>
                </div>
            )}
            <PrintedSignatures />
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
        <Card className="border-slate-200 shadow-md">
            <CardHeader className="flex flex-row justify-between items-center border-b pb-4 bg-slate-50/50">
                <div>
                    <CardTitle className="text-slate-800 font-bold text-lg">Trial Balance Statement</CardTitle>
                    <CardDescription className="text-xs">Summary of debits and credits from active accounts.</CardDescription>
                </div>
                <div className="flex gap-2 items-center print:hidden">
                    {isBalanced ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-7"><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Ledger Balanced</Badge>
                    ) : (
                        <Badge variant="destructive" className="animate-pulse h-7"><AlertTriangle className="h-3.5 w-3.5 mr-1" /> Ledger Unbalanced</Badge>
                    )}
                    <Button variant="outline" onClick={() => window.print()} className="border-slate-300 h-8 text-xs"><Printer className="mr-2 h-4 w-4"/> Print Report</Button>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50/60">
                        <TableRow>
                            <TableHead className="pl-6 font-bold text-xs">Account Code</TableHead>
                            <TableHead className="font-bold text-xs">Account Name</TableHead>
                            <TableHead className="font-bold text-xs">Classification</TableHead>
                            <TableHead className="text-right font-bold text-xs">Debit (GH₵)</TableHead>
                            <TableHead className="text-right pr-6 font-bold text-xs">Credit (GH₵)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.sort((a,b) => a.code.localeCompare(b.code)).map(account => {
                            if (account.displayDebit === 0 && account.displayCredit === 0) return null;
                            return (
                                <TableRow key={account.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-mono text-xs font-bold text-slate-500 pl-6">{account.code}</TableCell>
                                    <TableCell className="text-xs font-semibold text-slate-800">{account.name}</TableCell>
                                    <TableCell><Badge variant="outline" className="text-[9px] uppercase font-bold">{account.type}</Badge></TableCell>
                                    <TableCell className="text-right font-mono text-xs text-slate-700">
                                        {account.displayDebit > 0 ? `GH₵${account.displayDebit.toFixed(2)}` : '-'}
                                    </TableCell>
                                    <TableCell className="text-right font-mono text-xs text-slate-700 pr-6">
                                        {account.displayCredit > 0 ? `GH₵${account.displayCredit.toFixed(2)}` : '-'}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                        <TableRow className="bg-slate-100/80 font-extrabold border-t-2 border-slate-350">
                            <TableCell colSpan={3} className="pl-6 text-sm text-slate-700">Totals Summary</TableCell>
                            <TableCell className="text-right font-mono text-sm text-slate-800">GH₵{totalDebit.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-mono text-sm text-slate-800 pr-6">GH₵{totalCredit.toFixed(2)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                
                {!isBalanced && (
                    <div className="m-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-center rounded-xl flex items-center justify-center gap-2 text-xs font-bold">
                        <AlertTriangle className="h-5 w-5 text-rose-600 animate-bounce" />
                        TRIAL BALANCE ERROR: Total debits (GH₵{totalDebit.toFixed(2)}) do not match total credits (GH₵{totalCredit.toFixed(2)}). Discrepancy is GH₵{Math.abs(totalDebit - totalCredit).toFixed(2)}.
                    </div>
                )}
            </CardContent>
            <PrintedSignatures />
        </Card>
    );
}

// --- COMPONENT: Income Statement (P&L) ---
function IncomeStatement({ data }: { data: AccountBalance[] }) {
    const revenue = data.filter(a => a.type === 'Revenue');
    const expenses = data.filter(a => a.type === 'Expense');

    // Revenue Sub-categorization
    const operatingRevenue = revenue.filter(r => getRevenueCategory(r.code) === 'Operating');
    const tradingRevenue = revenue.filter(r => getRevenueCategory(r.code) === 'Trading');

    const totalOperatingRevenue = Math.abs(operatingRevenue.reduce((sum, a) => sum + (a.net < 0 ? a.net : 0), 0));
    const totalTradingRevenue = Math.abs(tradingRevenue.reduce((sum, a) => sum + (a.net < 0 ? a.net : 0), 0));
    const grossRevenue = totalOperatingRevenue + totalTradingRevenue;

    // Expenses Sub-categorization
    const directExpenses = expenses.filter(e => getExpenseCategory(e.code) === 'Operating');
    const administrativeExpenses = expenses.filter(e => getExpenseCategory(e.code) === 'Administrative');

    const totalDirectExpenses = directExpenses.reduce((sum, a) => sum + (a.net > 0 ? a.net : 0), 0);
    const totalAdministrativeExpenses = administrativeExpenses.reduce((sum, a) => sum + (a.net > 0 ? a.net : 0), 0);
    const totalExpenses = totalDirectExpenses + totalAdministrativeExpenses;
    
    const netIncome = grossRevenue - totalExpenses;
    const expenseRatio = grossRevenue > 0 ? Math.min(100, Math.round((totalExpenses / grossRevenue) * 100)) : 0;

    return (
        <Card className="border-slate-200 shadow-md">
            <CardHeader className="flex flex-row justify-between items-center border-b pb-4 bg-slate-50/50">
                <div>
                    <CardTitle className="text-slate-800 font-bold text-lg">Income Statement (Profit & Loss)</CardTitle>
                    <CardDescription className="text-xs">Summary of operating revenues and administrative expenditures.</CardDescription>
                </div>
                <Button variant="outline" onClick={() => window.print()} className="print:hidden border-slate-300"><Printer className="mr-2 h-4 w-4"/> Print Statement</Button>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                
                {/* Revenue Section */}
                <div className="space-y-3">
                    <h3 className="font-extrabold text-sm text-emerald-800 border-b pb-1.5 uppercase tracking-wider">I. REVENUE</h3>
                    
                    <div className="space-y-1 pl-2">
                        <h4 className="text-xs font-bold text-slate-400 tracking-wider">A. OPERATING STUDENT INCOME</h4>
                        <Table>
                            <TableBody>
                                {operatingRevenue.map(r => (
                                    <TableRow key={r.id} className="hover:bg-slate-50/30">
                                        <TableCell className="text-xs pl-4">{r.name}</TableCell>
                                        <TableCell className="text-right text-xs font-mono font-medium text-slate-700">GH₵{Math.abs(r.net).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="font-semibold text-xs bg-slate-50/50">
                                    <TableCell className="pl-4 italic">Subtotal Operating Revenue</TableCell>
                                    <TableCell className="text-right font-mono">GH₵{totalOperatingRevenue.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="space-y-1 pl-2 mt-4">
                        <h4 className="text-xs font-bold text-slate-400 tracking-wider">B. TRADING & GENERAL INFLOWS</h4>
                        <Table>
                            <TableBody>
                                {tradingRevenue.map(r => (
                                    <TableRow key={r.id} className="hover:bg-slate-50/30">
                                        <TableCell className="text-xs pl-4">{r.name}</TableCell>
                                        <TableCell className="text-right text-xs font-mono font-medium text-slate-700">GH₵{Math.abs(r.net).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="font-semibold text-xs bg-slate-50/50">
                                    <TableCell className="pl-4 italic">Subtotal Trading Revenue</TableCell>
                                    <TableCell className="text-right font-mono">GH₵{totalTradingRevenue.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-between items-center bg-emerald-50 text-emerald-950 font-black p-3.5 rounded-xl border border-emerald-250 mt-2 text-sm">
                        <span>GROSS OPERATING REVENUE</span>
                        <span className="font-mono">GH₵{grossRevenue.toFixed(2)}</span>
                    </div>
                </div>

                {/* Expense Section */}
                <div className="space-y-3 pt-4">
                    <h3 className="font-extrabold text-sm text-red-800 border-b pb-1.5 uppercase tracking-wider">II. EXPENDITURES</h3>
                    
                    <div className="space-y-1 pl-2">
                        <h4 className="text-xs font-bold text-slate-400 tracking-wider">A. DIRECT EDUCATIONAL/OPERATIONAL COST</h4>
                        <Table>
                            <TableBody>
                                {directExpenses.map(e => (
                                    <TableRow key={e.id} className="hover:bg-slate-50/30">
                                        <TableCell className="text-xs pl-4">{e.name}</TableCell>
                                        <TableCell className="text-right text-xs font-mono font-medium text-slate-700">GH₵{Math.abs(e.net).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="font-semibold text-xs bg-slate-50/50">
                                    <TableCell className="pl-4 italic">Subtotal Direct Costs</TableCell>
                                    <TableCell className="text-right font-mono">GH₵{totalDirectExpenses.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="space-y-1 pl-2 mt-4">
                        <h4 className="text-xs font-bold text-slate-400 tracking-wider">B. ADMINISTRATIVE & SYSTEM EXPENSES</h4>
                        <Table>
                            <TableBody>
                                {administrativeExpenses.map(e => (
                                    <TableRow key={e.id} className="hover:bg-slate-50/30">
                                        <TableCell className="text-xs pl-4">{e.name}</TableCell>
                                        <TableCell className="text-right text-xs font-mono font-medium text-slate-700">GH₵{Math.abs(e.net).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="font-semibold text-xs bg-slate-50/50">
                                    <TableCell className="pl-4 italic">Subtotal Administrative Cost</TableCell>
                                    <TableCell className="text-right font-mono">GH₵{totalAdministrativeExpenses.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-between items-center bg-red-50 text-red-950 font-black p-3.5 rounded-xl border border-red-200 mt-2 text-sm">
                        <span>TOTAL OPERATING EXPENSES</span>
                        <span className="font-mono">GH₵{totalExpenses.toFixed(2)}</span>
                    </div>
                </div>

                {/* Net Income */}
                <div className={`p-4 rounded-xl flex justify-between items-center text-lg font-black border mt-6 ${netIncome >= 0 ? 'bg-emerald-500 text-white border-emerald-600 shadow-md' : 'bg-red-500 text-white border-red-650 shadow-md'}`}>
                    <span className="uppercase text-xs tracking-widest font-black">Net Income / Surplus (Deficit)</span>
                    <span className="font-mono text-xl">GH₵{netIncome.toFixed(2)}</span>
                </div>

                {/* Revenue vs Expense ratio indicator */}
                {grossRevenue > 0 && (
                    <div className="space-y-2 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200 print:hidden">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>Cost Ratio Share (Expenses vs Revenue)</span>
                            <span className="font-mono">{expenseRatio}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden flex">
                            <div className="bg-red-500 h-3" style={{ width: `${expenseRatio}%` }} />
                            <div className="bg-emerald-500 h-3 flex-1" />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-medium font-mono pt-1">
                            <span>Expenses: GH₵{totalExpenses.toFixed(2)}</span>
                            <span>Net Profit: GH₵{netIncome.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </CardContent>
            <PrintedSignatures />
        </Card>
    );
}

// --- COMPONENT: Balance Sheet ---
function BalanceSheet({ data, netIncome }: { data: AccountBalance[], netIncome: number }) {
    const assets = data.filter(a => a.type === 'Asset');
    const liabilities = data.filter(a => a.type === 'Liability');
    const equity = data.filter(a => a.type === 'Equity');

    // Asset subgroups
    const currentAssets = assets.filter(a => getAssetCategory(a.code) === 'Current');
    const nonCurrentAssets = assets.filter(a => getAssetCategory(a.code) === 'Non-Current');

    const totalCurrentAssets = currentAssets.reduce((sum, a) => sum + a.net, 0);
    const totalNonCurrentAssets = nonCurrentAssets.reduce((sum, a) => sum + a.net, 0);
    const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

    // Liability subgroups
    const currentLiabilities = liabilities.filter(l => getLiabilityCategory(l.code) === 'Current');
    const nonCurrentLiabilities = liabilities.filter(l => getLiabilityCategory(l.code) === 'Non-Current');

    const totalCurrentLiabilities = Math.abs(currentLiabilities.reduce((sum, a) => sum + a.net, 0));
    const totalNonCurrentLiabilities = Math.abs(nonCurrentLiabilities.reduce((sum, a) => sum + a.net, 0));
    const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;

    // Equity calculations
    const totalEquityRaw = Math.abs(equity.reduce((sum, a) => sum + a.net, 0));
    const totalEquity = totalEquityRaw + netIncome;
    
    const totalEquityAndLiabilities = totalLiabilities + totalEquity;

    const discrepancy = Math.abs(totalAssets - totalEquityAndLiabilities);
    const isBalanced = discrepancy < 0.1;

    return (
        <Card className="border-slate-200 shadow-md">
            <CardHeader className="flex flex-row justify-between items-center border-b pb-4 bg-slate-50/50">
                <div>
                    <CardTitle className="text-slate-800 font-bold text-lg">Statement of Financial Position</CardTitle>
                    <CardDescription className="text-xs">Balanced report of school assets, liabilities, and retained equity reserves.</CardDescription>
                </div>
                <div className="flex gap-2 items-center print:hidden">
                    {isBalanced ? (
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-7"><ShieldCheck className="h-3.5 w-3.5 mr-1" /> Reconciled & Balanced</Badge>
                    ) : (
                        <Badge variant="destructive" className="animate-pulse h-7"><AlertTriangle className="h-3.5 w-3.5 mr-1" /> Reconciliation Discrepancy</Badge>
                    )}
                    <Button variant="outline" onClick={() => window.print()} className="border-slate-300 h-8 text-xs"><Printer className="mr-2 h-4 w-4"/> Print Sheet</Button>
                </div>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 pt-6">
                
                {/* Assets Side */}
                <div className="space-y-4">
                    <h3 className="font-extrabold text-sm text-indigo-800 border-b pb-1.5 uppercase tracking-wider">I. ASSETS</h3>
                    
                    <div className="space-y-1 pl-2">
                        <h4 className="text-xs font-bold text-slate-400 tracking-wider">A. CURRENT ASSETS</h4>
                        <Table>
                            <TableBody>
                                {currentAssets.map(a => (
                                    <TableRow key={a.id} className="hover:bg-slate-50/30">
                                        <TableCell className="text-xs pl-4">{a.name}</TableCell>
                                        <TableCell className="text-right text-xs font-mono font-medium text-slate-700">GH₵{a.net.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="font-semibold text-xs bg-slate-50/50">
                                    <TableCell className="pl-4 italic">Total Current Assets</TableCell>
                                    <TableCell className="text-right font-mono">GH₵{totalCurrentAssets.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="space-y-1 pl-2 mt-4">
                        <h4 className="text-xs font-bold text-slate-400 tracking-wider">B. NON-CURRENT FIXED ASSETS</h4>
                        <Table>
                            <TableBody>
                                {nonCurrentAssets.map(a => (
                                    <TableRow key={a.id} className="hover:bg-slate-50/30">
                                        <TableCell className="text-xs pl-4">{a.name}</TableCell>
                                        <TableCell className="text-right text-xs font-mono font-medium text-slate-700">GH₵{a.net.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="font-semibold text-xs bg-slate-50/50">
                                    <TableCell className="pl-4 italic">Total Non-Current Assets</TableCell>
                                    <TableCell className="text-right font-mono">GH₵{totalNonCurrentAssets.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-between items-center bg-indigo-50 text-indigo-950 font-black p-3.5 rounded-xl border border-indigo-250 mt-4 text-sm">
                        <span>TOTAL ASSETS ASSET VALUE</span>
                        <span className="font-mono">GH₵{totalAssets.toFixed(2)}</span>
                    </div>
                </div>

                {/* Liabilities & Equity Side */}
                <div className="space-y-4">
                    <h3 className="font-extrabold text-sm text-slate-800 border-b pb-1.5 uppercase tracking-wider">II. LIABILITIES & EQUITY</h3>
                    
                    <div className="space-y-1 pl-2">
                        <h4 className="text-xs font-bold text-slate-400 tracking-wider">A. CURRENT LIABILITIES</h4>
                        <Table>
                            <TableBody>
                                {currentLiabilities.map(l => (
                                    <TableRow key={l.id} className="hover:bg-slate-50/30">
                                        <TableCell className="text-xs pl-4">{l.name}</TableCell>
                                        <TableCell className="text-right text-xs font-mono font-medium text-slate-700">GH₵{Math.abs(l.net).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="font-semibold text-xs bg-slate-50/50">
                                    <TableCell className="pl-4 italic">Total Current Liabilities</TableCell>
                                    <TableCell className="text-right font-mono">GH₵{totalCurrentLiabilities.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="space-y-1 pl-2 mt-4">
                        <h4 className="text-xs font-bold text-slate-400 tracking-wider">B. LONG-TERM FINANCIAL LIABILITIES</h4>
                        <Table>
                            <TableBody>
                                {nonCurrentLiabilities.map(l => (
                                    <TableRow key={l.id} className="hover:bg-slate-50/30">
                                        <TableCell className="text-xs pl-4">{l.name}</TableCell>
                                        <TableCell className="text-right text-xs font-mono font-medium text-slate-700">GH₵{Math.abs(l.net).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="font-semibold text-xs bg-slate-50/50">
                                    <TableCell className="pl-4 italic">Total Long-Term Liabilities</TableCell>
                                    <TableCell className="text-right font-mono">GH₵{totalNonCurrentLiabilities.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="space-y-1 pl-2 mt-4">
                        <h4 className="text-xs font-bold text-slate-400 tracking-wider">C. RETENTION EQUITY & CAPITAL</h4>
                        <Table>
                            <TableBody>
                                {equity.map(e => (
                                    <TableRow key={e.id} className="hover:bg-slate-50/30">
                                        <TableCell className="text-xs pl-4">{e.name}</TableCell>
                                        <TableCell className="text-right text-xs font-mono font-medium text-slate-700">GH₵{Math.abs(e.net).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="hover:bg-slate-50/30">
                                    <TableCell className="text-xs text-emerald-700 font-bold pl-4">Retained Surplus Earnings (P&L)</TableCell>
                                    <TableCell className="text-right text-xs font-mono font-bold text-emerald-700">GH₵{netIncome.toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow className="font-semibold text-xs bg-slate-50/50">
                                    <TableCell className="pl-4 italic">Total Capital & Reserves</TableCell>
                                    <TableCell className="text-right font-mono">GH₵{totalEquity.toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-between items-center bg-slate-100 text-slate-900 font-black p-3.5 rounded-xl border border-slate-300 mt-4 text-sm">
                        <span>TOTAL EQUITY & LIABILITIES</span>
                        <span className="font-mono">GH₵{totalEquityAndLiabilities.toFixed(2)}</span>
                    </div>
                </div>

            </CardContent>

            {!isBalanced && (
                <div className="m-6 p-4 bg-amber-50 border border-amber-200 text-amber-900 text-center rounded-xl flex items-center justify-center gap-2 text-xs font-bold">
                    <AlertTriangle className="h-5 w-5 text-amber-600 animate-bounce" />
                    RECONCILIATION ERROR: Total assets (GH₵{totalAssets.toFixed(2)}) do not match total liabilities & equity (GH₵{totalEquityAndLiabilities.toFixed(2)}). Discrepancy variance is GH₵{discrepancy.toFixed(2)}.
                </div>
            )}
            <PrintedSignatures />
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
                <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-indigo-50/50 to-white">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-indigo-650 font-black uppercase tracking-wider text-[10px]">Total Departmental Cost</CardDescription>
                        <CardTitle className="text-2xl font-black text-slate-800">GH₵{totals.expenses.toFixed(2)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-emerald-600 font-black uppercase tracking-wider text-[10px]">Total Coded Revenues</CardDescription>
                        <CardTitle className="text-2xl font-black text-slate-800">GH₵{totals.revenues.toFixed(2)}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-slate-50 to-white">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-slate-500 font-black uppercase tracking-wider text-[10px]">Highest Cost Center</CardDescription>
                        <CardTitle className="text-lg font-bold text-slate-800">
                            {highestExpenseDept.val > 0 ? (
                                <>{highestExpenseDept.name} <span className="text-xs text-slate-400 font-mono">(GH₵{highestExpenseDept.val.toFixed(2)})</span></>
                            ) : 'None'}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Table Breakdown */}
                <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row justify-between items-center pb-3 border-b bg-slate-50/50">
                        <div>
                            <CardTitle className="text-slate-800 font-bold text-md">Departmental Allocation & Cost Breakdown</CardTitle>
                            <CardDescription className="text-xs">Breakdown of revenues, expenses, and net allocation by cost center.</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden border-slate-300">
                            <Printer className="mr-2 h-4 w-4" /> Print Costs
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="pl-6 font-bold text-xs">Department / Cost Center</TableHead>
                                    <TableHead className="text-right font-bold text-xs">Expenses</TableHead>
                                    <TableHead className="text-right font-bold text-xs">Revenues</TableHead>
                                    <TableHead className="text-right pr-6 font-bold text-xs">Net Allocation</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.map(r => (
                                    <TableRow key={r.id} className="hover:bg-slate-50/55 transition-colors">
                                        <TableCell className="font-bold text-slate-700 text-xs pl-6">{r.name}</TableCell>
                                        <TableCell className="text-right text-rose-600 font-mono text-xs font-semibold">
                                            {r.expenses > 0 ? `GH₵${r.expenses.toFixed(2)}` : 'GH₵0.00'}
                                        </TableCell>
                                        <TableCell className="text-right text-emerald-600 font-mono text-xs font-semibold">
                                            {r.revenues > 0 ? `GH₵${r.revenues.toFixed(2)}` : 'GH₵0.00'}
                                        </TableCell>
                                        <TableCell className={cn(
                                            "text-right font-bold font-mono text-xs pr-6",
                                            r.net >= 0 ? "text-emerald-700" : "text-rose-700"
                                        )}>
                                            {r.net >= 0 ? '+' : ''}GH₵{r.net.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="bg-slate-100 font-bold border-t-2 border-slate-350">
                                    <TableCell className="pl-6 text-xs text-slate-700">Totals</TableCell>
                                    <TableCell className="text-right text-rose-750 font-mono text-xs">GH₵{totals.expenses.toFixed(2)}</TableCell>
                                    <TableCell className="text-right text-emerald-750 font-mono text-xs">GH₵{totals.revenues.toFixed(2)}</TableCell>
                                    <TableCell className={cn(
                                        "text-right font-black font-mono text-xs pr-6",
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
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-slate-800 font-bold text-md">Expense Share Percentage</CardTitle>
                        <CardDescription className="text-xs">Visual distribution of departmental expenses.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
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
            <PrintedSignatures />
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

    const { calculatedBalances, netIncome, totalRevenue, totalExpense } = useMemo(() => {
        if (!accounts || !allJournals || !dateRange?.from) return { calculatedBalances: [], netIncome: 0, totalRevenue: 0, totalExpense: 0 };
        
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

        return { 
            calculatedBalances: balances, 
            netIncome: revenue - expense,
            totalRevenue: revenue,
            totalExpense: expense
        };

    }, [accounts, allJournals, dateRange]);

    if (!canAccess) return <div className="p-8 text-center text-red-500">Access Denied</div>;

    const isLoading = isLoadingSchool || accLoading || jLoading;

    return (
        <div className="space-y-6">
            
            {/* Emerald/Indigo Executive Gradient Banner */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-lg border border-indigo-950/50 print:hidden">
                <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
                    <Scale className="w-64 h-64" />
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                    <div className="space-y-2">
                        <Badge className="bg-indigo-500 text-white font-bold px-2 py-0.5 text-[10px]">FINANCIAL AUDITS & RECONCILIATIONS</Badge>
                        <h1 className="text-3xl font-black tracking-tight">Executive Financial Statements</h1>
                        <p className="text-indigo-100/70 text-sm max-w-lg">Reconcile account transactions, evaluate departmental cost share allocations, and generate balance sheets.</p>
                    </div>

                    <div className="bg-white/10 p-2 rounded-xl border border-white/10 backdrop-blur-sm flex items-center shadow-md">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" className="w-[280px] justify-start text-left font-normal text-white hover:text-indigo-100 hover:bg-white/10 h-9">
                                    <CalendarIcon className="mr-2 h-4 w-4 text-indigo-300" />
                                    {dateRange?.from ? (
                                        dateRange.to ? (<>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>) : (format(dateRange.from, "LLL dd, y"))
                                    ) : (
                                        <span>Pick reporting date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="end">
                                <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                    <div>
                        <span className="text-[10px] text-indigo-200/60 uppercase font-black tracking-wider block">Reporting Period Revenues</span>
                        <span className="text-xl font-bold block text-emerald-400">GH₵{totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-indigo-200/60 uppercase font-black tracking-wider block">Reporting Period Expenses</span>
                        <span className="text-xl font-bold block text-rose-400">GH₵{totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-indigo-200/60 uppercase font-black tracking-wider block">Net Period surplus / (deficit)</span>
                        <span className="text-xl font-bold block">GH₵{netIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                        <span className="text-[10px] text-indigo-200/60 uppercase font-black tracking-wider block">Auditor Status Check</span>
                        <Badge className={cn("mt-1 text-[10px] font-black", netIncome >= 0 ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-rose-500 hover:bg-rose-600 text-white")}>
                            {netIncome >= 0 ? 'Surplus' : 'Deficit'}
                        </Badge>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600 h-10 w-10"/></div>
            ) : (
                <Tabs defaultValue="ledger" className="flex flex-col">
                    <TabsList className="print:hidden w-[650px] bg-slate-100 p-1 rounded-xl">
                        <TabsTrigger value="ledger" className="rounded-lg font-bold"><BookOpen className="h-4 w-4 mr-1.5"/> General Ledger</TabsTrigger>
                        <TabsTrigger value="tb" className="rounded-lg font-bold"><Scale className="h-4 w-4 mr-1.5"/> Trial Balance</TabsTrigger>
                        <TabsTrigger value="pl" className="rounded-lg font-bold"><TrendingUp className="h-4 w-4 mr-1.5"/> Income Statement</TabsTrigger>
                        <TabsTrigger value="bs" className="rounded-lg font-bold"><Landmark className="h-4 w-4 mr-1.5"/> Balance Sheet</TabsTrigger>
                        <TabsTrigger value="departments" className="rounded-lg font-bold"><BarChart className="h-4 w-4 mr-1.5"/> Departmental Costs</TabsTrigger>
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
                    nav, header, aside, .relative.rounded-2xl { display: none !important; }
                    body { background: white; color: #000 !important; }
                    .card { border: none !important; shadow: none !important; box-shadow: none !important; }
                    table th, table td { color: #000 !important; border-color: #64748b !important; }
                }
            `}</style>
        </div>
    );
}
