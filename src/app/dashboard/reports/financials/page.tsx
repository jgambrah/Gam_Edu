
'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Printer, Scale, Banknote, ArrowDownUp, Landmark } from 'lucide-react';
import { MOCK_CHART_OF_ACCOUNTS, MOCK_JOURNAL_ENTRIES } from '@/lib/data';
import { ChartOfAccount } from '@/lib/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';


// Helper function to calculate balances
function getAccountBalances() {
    const balances = new Map<string, number>();

    MOCK_JOURNAL_ENTRIES.forEach(entry => {
        entry.debits.forEach(debit => {
            balances.set(debit.accountId, (balances.get(debit.accountId) || 0) + debit.amount);
        });
        entry.credits.forEach(credit => {
            balances.set(credit.accountId, (balances.get(credit.accountId) || 0) - credit.amount);
        });
    });

    // Handle accounts with no transactions
    MOCK_CHART_OF_ACCOUNTS.forEach(account => {
        if (!balances.has(account.accountId)) {
            balances.set(account.accountId, 0);
        }
    });

    return balances;
}

// --- Report Components ---

function TrialBalance() {
    const balances = getAccountBalances();
    let totalDebits = 0;
    let totalCredits = 0;

    return (
        <Card>
            <CardHeader><CardTitle>Trial Balance</CardTitle><CardDescription>As of {new Date().toLocaleDateString()}</CardDescription></CardHeader>
            <CardContent>
                <Table>
                    <TableHeader><TableRow><TableHead>Account</TableHead><TableHead className="text-right">Debit</TableHead><TableHead className="text-right">Credit</TableHead></TableRow></TableHeader>
                    <TableBody>
                        {MOCK_CHART_OF_ACCOUNTS.sort((a,b) => a.accountId.localeCompare(b.accountId)).map(account => {
                            const balance = balances.get(account.accountId) || 0;
                            const isDebit = ['Asset', 'Expense'].includes(account.type);
                            const finalBalance = isDebit ? balance : -balance;

                            if (finalBalance > 0) totalDebits += finalBalance;
                            else totalCredits += -finalBalance;

                            return (
                                <TableRow key={account.accountId}>
                                    <TableCell>{account.accountId} - {account.name}</TableCell>
                                    <TableCell className="text-right">{finalBalance > 0 ? `GH₵${finalBalance.toFixed(2)}` : '-'}</TableCell>
                                    <TableCell className="text-right">{finalBalance < 0 ? `GH₵${(-finalBalance).toFixed(2)}` : '-'}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    <CardFooter className="font-bold text-lg">
                        <TableRow>
                            <TableCell>Totals</TableCell>
                            <TableCell className="text-right">GH₵{totalDebits.toFixed(2)}</TableCell>
                            <TableCell className="text-right">GH₵{totalCredits.toFixed(2)}</TableCell>
                        </TableRow>
                    </CardFooter>
                </Table>
            </CardContent>
        </Card>
    );
}

function IncomeStatement() {
    const balances = getAccountBalances();
    
    const revenues = MOCK_CHART_OF_ACCOUNTS.filter(a => a.type === 'Revenue' && !a.isControlAccount);
    const expenses = MOCK_CHART_OF_ACCOUNTS.filter(a => a.type === 'Expense' && !a.isControlAccount);

    const totalRevenue = revenues.reduce((sum, acc) => sum + -(balances.get(acc.accountId) || 0), 0);
    const totalExpense = expenses.reduce((sum, acc) => sum + (balances.get(acc.accountId) || 0), 0);
    const netIncome = totalRevenue - totalExpense;

    return (
        <Card>
            <CardHeader><CardTitle>Income Statement</CardTitle><CardDescription>For the Period Ending {new Date().toLocaleDateString()}</CardDescription></CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Revenue</h3>
                    <Table>
                        <TableBody>
                            {revenues.map(acc => <TableRow key={acc.accountId}><TableCell>{acc.name}</TableCell><TableCell className="text-right">GH₵{(-(balances.get(acc.accountId) || 0)).toFixed(2)}</TableCell></TableRow>)}
                            <TableRow className="font-bold"><TableCell>Total Revenue</TableCell><TableCell className="text-right">GH₵{totalRevenue.toFixed(2)}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Expenses</h3>
                    <Table>
                        <TableBody>
                            {expenses.map(acc => <TableRow key={acc.accountId}><TableCell>{acc.name}</TableCell><TableCell className="text-right">GH₵{(balances.get(acc.accountId) || 0).toFixed(2)}</TableCell></TableRow>)}
                            <TableRow className="font-bold"><TableCell>Total Expenses</TableCell><TableCell className="text-right">GH₵{totalExpense.toFixed(2)}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <CardFooter className="font-bold text-xl justify-between p-6 bg-muted rounded-b-lg">
                <span>Net Income</span>
                <span className={cn(netIncome >= 0 ? 'text-green-600' : 'text-red-600')}>GH₵{netIncome.toFixed(2)}</span>
            </CardFooter>
        </Card>
    );
}

function BalanceSheet() {
    const balances = getAccountBalances();
    const netIncome = MOCK_CHART_OF_ACCOUNTS.filter(a => a.type === 'Revenue').reduce((sum, acc) => sum + -(balances.get(acc.accountId) || 0), 0) - MOCK_CHART_OF_ACCOUNTS.filter(a => a.type === 'Expense').reduce((sum, acc) => sum + (balances.get(acc.accountId) || 0), 0);

    const assets = MOCK_CHART_OF_ACCOUNTS.filter(a => a.type === 'Asset' && !a.isControlAccount);
    const liabilities = MOCK_CHART_OF_ACCOUNTS.filter(a => a.type === 'Liability' && !a.isControlAccount);
    const equity = MOCK_CHART_OF_ACCOUNTS.filter(a => a.type === 'Equity' && !a.isControlAccount);
    
    const totalAssets = assets.reduce((sum, acc) => sum + (balances.get(acc.accountId) || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, acc) => sum + -(balances.get(acc.accountId) || 0), 0);
    let totalEquity = equity.reduce((sum, acc) => sum + -(balances.get(acc.accountId) || 0), 0);
    totalEquity += netIncome; // Add current period's net income to equity

    return (
        <Card>
            <CardHeader><CardTitle>Balance Sheet</CardTitle><CardDescription>As of {new Date().toLocaleDateString()}</CardDescription></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-2">Assets</h3>
                     <Table>
                        <TableBody>
                            {assets.map(acc => <TableRow key={acc.accountId}><TableCell>{acc.name}</TableCell><TableCell className="text-right">GH₵{(balances.get(acc.accountId) || 0).toFixed(2)}</TableCell></TableRow>)}
                             <TableRow className="font-bold"><TableCell>Total Assets</TableCell><TableCell className="text-right">GH₵{totalAssets.toFixed(2)}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold mb-2">Liabilities & Equity</h3>
                     <Table>
                        <TableHeader><TableRow><TableHead colSpan={2}>Liabilities</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {liabilities.map(acc => <TableRow key={acc.accountId}><TableCell>{acc.name}</TableCell><TableCell className="text-right">GH₵{(-(balances.get(acc.accountId) || 0)).toFixed(2)}</TableCell></TableRow>)}
                             <TableRow className="font-semibold"><TableCell>Total Liabilities</TableCell><TableCell className="text-right">GH₵{totalLiabilities.toFixed(2)}</TableCell></TableRow>
                        </TableBody>
                        <TableHeader><TableRow><TableHead colSpan={2}>Equity</TableHead></TableRow></TableHeader>
                        <TableBody>
                             {equity.map(acc => <TableRow key={acc.accountId}><TableCell>{acc.name}</TableCell><TableCell className="text-right">GH₵{(-(balances.get(acc.accountId) || 0)).toFixed(2)}</TableCell></TableRow>)}
                             <TableRow><TableCell>Net Income</TableCell><TableCell className="text-right">GH₵{netIncome.toFixed(2)}</TableCell></TableRow>
                             <TableRow className="font-semibold"><TableCell>Total Equity</TableCell><TableCell className="text-right">GH₵{totalEquity.toFixed(2)}</TableCell></TableRow>
                             <TableRow className="font-bold"><TableCell>Total Liabilities & Equity</TableCell><TableCell className="text-right">GH₵{(totalLiabilities + totalEquity).toFixed(2)}</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}

function CashFlowStatement() {
    const balances = getAccountBalances();
    const netIncome = MOCK_CHART_OF_ACCOUNTS.filter(a => a.type === 'Revenue').reduce((sum, acc) => sum + -(balances.get(acc.accountId) || 0), 0) - MOCK_CHART_OF_ACCOUNTS.filter(a => a.type === 'Expense').reduce((sum, acc) => sum + (balances.get(acc.accountId) || 0), 0);
    const arBalance = balances.get('1200') || 0;
    const apBalance = balances.get('2100') || 0;

    // Simplified indirect method
    const cashFromOps = netIncome - arBalance + apBalance;
    const netCashFlow = cashFromOps; // Assuming no investing/financing activities in mock data

    return (
        <Card>
            <CardHeader><CardTitle>Statement of Cash Flows</CardTitle><CardDescription>For the Period Ending {new Date().toLocaleDateString()}</CardDescription></CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader><TableRow><TableHead>Cash Flow from Operating Activities</TableHead><TableHead></TableHead></TableRow></TableHeader>
                    <TableBody>
                        <TableRow><TableCell>Net Income</TableCell><TableCell className="text-right">GH₵{netIncome.toFixed(2)}</TableCell></TableRow>
                        <TableRow><TableCell>Change in Accounts Receivable</TableCell><TableCell className="text-right">(GH₵{(arBalance).toFixed(2)})</TableCell></TableRow>
                        <TableRow><TableCell>Change in Accounts Payable</TableCell><TableCell className="text-right">GH₵{apBalance.toFixed(2)}</TableCell></TableRow>
                        <TableRow className="font-bold"><TableCell>Net Cash from Operating Activities</TableCell><TableCell className="text-right">GH₵{cashFromOps.toFixed(2)}</TableCell></TableRow>
                    </TableBody>
                    <CardFooter className="font-bold text-lg justify-between p-6">
                        <span>Net Increase in Cash</span>
                        <span>GH₵{netCashFlow.toFixed(2)}</span>
                    </CardFooter>
                 </Table>
            </CardContent>
        </Card>
    );
}

export default function FinancialReportsPage() {
    const { role } = useRole();
    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role);

    if (!canAccess) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>This module is restricted to financial and administrative staff.</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    return (
        <div className="space-y-6" id="report-content">
            <div className="flex items-center justify-between print:hidden">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2"><FileText /> Financial Reports</h1>
                    <p className="text-muted-foreground">Generate and view key financial statements.</p>
                </div>
                 <div className="flex gap-2">
                    <Button asChild variant="outline"><Link href="/dashboard/reports/academics">Academics</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/attendance">Attendance</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/enrollment">Enrollment</Link></Button>
                    <Button onClick={() => window.print()}><Printer className="mr-2"/>Print</Button>
                </div>
            </div>

            <Tabs defaultValue="income-statement">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="income-statement"><Banknote className="mr-2"/>Income Statement</TabsTrigger>
                    <TabsTrigger value="balance-sheet"><Scale className="mr-2"/>Balance Sheet</TabsTrigger>
                    <TabsTrigger value="trial-balance"><Landmark className="mr-2"/>Trial Balance</TabsTrigger>
                    <TabsTrigger value="cash-flow"><ArrowDownUp className="mr-2"/>Cash Flow</TabsTrigger>
                </TabsList>
                <TabsContent value="income-statement"><IncomeStatement /></TabsContent>
                <TabsContent value="balance-sheet"><BalanceSheet /></TabsContent>
                <TabsContent value="trial-balance"><TrialBalance /></TabsContent>
                <TabsContent value="cash-flow"><CashFlowStatement /></TabsContent>
            </Tabs>

             <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print\\:hidden {
                        display: none;
                    }
                    #report-content, #report-content * {
                        visibility: visible;
                    }
                    #report-content {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
