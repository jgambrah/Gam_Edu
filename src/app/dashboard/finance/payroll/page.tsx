'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, serverTimestamp, doc, setDoc, writeBatch, where, getDocs } from 'firebase/firestore';
import { 
  Banknote, Calculator, Settings, CheckCircle2, 
  FileText, Loader2, Save, Printer, Landmark, History, Eye, FileDown, ShieldCheck, Plus, Trash2,
  Sparkles, Coins, Download, FileSpreadsheet, ArrowRightLeft, ShieldAlert
} from 'lucide-react';
import { format } from 'date-fns';
import { useCurrentSchool } from '@/hooks/use-current-school';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PayrollRecord } from '@/lib/types';
import { PayslipDialog } from '../../payroll/payslip-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SearchableAccountSelect } from '@/components/ui/account-select';

// Recharts components
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as ChartTooltip, Legend as ChartLegend } from 'recharts';
import { cn } from '@/lib/utils';
import { logAuditEvent } from '@/lib/audit';

// --- CONSTANTS: GHANA 2024 MONTHLY TAX TABLE ---
const DEFAULT_TAX_BRACKETS = [
    { from: 0, to: 490, rate: 0 },
    { from: 490, to: 600, rate: 0.05 },
    { from: 600, to: 730, rate: 0.10 },
    { from: 730, to: 3896.67, rate: 0.175 },
    { from: 3896.67, to: 19896.67, rate: 0.25 },
    { from: 19896.67, to: 50416.67, rate: 0.30 },
    { from: 50416.67, to: 99999999, rate: 0.35 }
];

const payrollSettingsSchema = z.object({
    ssnitEmployeeContributionRate: z.coerce.number().min(0).max(1),
    ssnitEmployerContributionRate: z.coerce.number().min(0).max(1),
    payeeBrackets: z.array(z.object({
        from: z.coerce.number().min(0),
        to: z.coerce.number().min(0),
        rate: z.coerce.number().min(0).max(1)
    })),
    // GL mapping fields
    salariesExpenseId: z.string().optional(),
    ssnitExpenseId: z.string().optional(),
    bankAccountId: z.string().optional(),
    ssnitPayableId: z.string().optional(),
    payePayableId: z.string().optional(),
    deductionsClearingId: z.string().optional()
});

// --- HELPER: CALCULATE PAYSLIP ---
function calculatePayslip(staff: any, config: any) {
    const basic = parseFloat(staff.basicSalary) || 0;
    
    // 1. Allowances
    const totalAllowances = (staff.allowances || []).reduce((sum: number, a: any) => sum + (parseFloat(a.amount) || 0), 0);
    const grossSalary = basic + totalAllowances;

    // 2. SSNIT (Tier 1 & 2 Employee Share - Default 5.5%)
    const ssnitEmployeeRate = config?.ssnitEmployeeContributionRate ?? 0.055;
    const ssnitEmployee = basic * ssnitEmployeeRate;

    // 3. Taxable Income (Basic + Allowances - SSNIT)
    const taxableIncome = grossSalary - ssnitEmployee;

    // 4. PAYE Calculation (Monthly Progressive)
    let taxPayable = 0;
    let remainingIncome = taxableIncome;
    const brackets = config?.payeeBrackets || DEFAULT_TAX_BRACKETS;

    for (const bracket of brackets) {
        if (remainingIncome <= 0) break;
        const width = bracket.to - bracket.from;
        const amountInBracket = Math.min(remainingIncome, width);
        if (amountInBracket > 0) {
            taxPayable += amountInBracket * bracket.rate;
            remainingIncome -= amountInBracket;
        }
    }

    // 5. Net Salary
    const manualDeductions = (staff.deductions || []).reduce((sum: number, d: any) => sum + (parseFloat(d.amount) || 0), 0);
    const totalDeductions = ssnitEmployee + taxPayable + manualDeductions;
    const netSalary = grossSalary - totalDeductions;

    // 6. Employer Costs
    const ssnitEmployerRate = config?.ssnitEmployerContributionRate ?? 0.13;
    const employerSSNIT = basic * ssnitEmployerRate;

    return {
        basicSalary: basic,
        totalAllowances,
        grossSalary,
        taxableIncome,
        netSalary,
        totalDeductions,
        allowances: staff.allowances || [],
        deductions: staff.deductions || [],
        ssnitNumber: staff.ssnitNumber || '',
        tinNumber: staff.tinNumber || '',
        bankName: staff.bankName || '',
        accountNumber: staff.accountNumber || '',
        statutory: {
            ssnitEmployee,
            ssnitEmployer: employerSSNIT,
            paye: taxPayable
        }
    };
}

// --- SUB-COMPONENT: Tax Simulator ---
function TaxSimulator({ config }: { config: any }) {
    const [grossInput, setGrossInput] = useState<number>(3000);
    
    const calculation = useMemo(() => {
        const basic = grossInput;
        const ssnitEmployeeRate = config?.ssnitEmployeeContributionRate ?? 0.055;
        const ssnitEmployee = basic * ssnitEmployeeRate;
        const taxableIncome = basic - ssnitEmployee;

        let taxPayable = 0;
        let remainingIncome = taxableIncome;
        const brackets = config?.payeeBrackets || DEFAULT_TAX_BRACKETS;
        const bracketBreakdown: any[] = [];

        for (const bracket of brackets) {
            const width = bracket.to - bracket.from;
            const amountInBracket = Math.min(Math.max(0, remainingIncome), width);
            const tax = amountInBracket * bracket.rate;
            
            bracketBreakdown.push({
                range: `GH₵${bracket.from.toLocaleString()} - ${(bracket.to > 10000000) ? 'Above' : `GH₵${bracket.to.toLocaleString()}`}`,
                rate: `${(bracket.rate * 100).toFixed(1)}%`,
                taxablePortion: amountInBracket,
                taxComputed: tax,
                capacity: width,
                percentageFilled: width > 0 ? (amountInBracket / width) * 100 : (amountInBracket > 0 ? 100 : 0)
            });

            if (amountInBracket > 0) {
                taxPayable += tax;
                remainingIncome -= amountInBracket;
            }
        }

        const netSalary = basic - ssnitEmployee - taxPayable;

        return {
            ssnitEmployee,
            taxableIncome,
            payeTax: taxPayable,
            netSalary,
            bracketBreakdown
        };
    }, [grossInput, config]);

    return (
        <Card className="border border-slate-100 shadow-lg rounded-2xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-5">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                    <Calculator className="h-4 w-4 text-indigo-600" /> Interactive Tax Bracket Simulator
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">Simulate progressive monthly tax deductions for any monthly gross salary.</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
                <div className="space-y-1">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Test Monthly Gross Salary (GH₵)</Label>
                    <div className="relative">
                        <Input 
                            type="number" 
                            value={grossInput || ''} 
                            onChange={e => setGrossInput(parseFloat(e.target.value) || 0)} 
                            className="h-11 rounded-xl bg-slate-50 font-mono font-bold text-indigo-800 text-lg pl-12 focus-visible:ring-indigo-500" 
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 font-sans">GH₵</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">SSNIT (5.5%)</p>
                        <p className="text-sm font-bold font-mono text-rose-500">-GH₵{calculation.ssnitEmployee.toFixed(2)}</p>
                    </div>
                    <div className="text-center border-x border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">PAYE Tax</p>
                        <p className="text-sm font-bold font-mono text-rose-500">-GH₵{calculation.payeTax.toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Est. Net Pay</p>
                        <p className="text-sm font-black font-mono text-emerald-600">GH₵{calculation.netSalary.toFixed(2)}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Progressive Bands Absorption Breakdown</Label>
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                        {calculation.bracketBreakdown.map((band, idx) => (
                            <div key={idx} className="text-[11px] p-2 bg-slate-50/50 rounded-lg border border-slate-100 space-y-1">
                                <div className="flex justify-between items-center font-medium">
                                    <span className="text-slate-600">{band.range} ({band.rate})</span>
                                    <span className="font-mono text-slate-700 font-bold">
                                        Portion: GH₵{band.taxablePortion.toFixed(2)} → Tax: <span className="text-rose-600">GH₵{band.taxComputed.toFixed(2)}</span>
                                    </span>
                                </div>
                                <div className="h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                                    <div 
                                        className={cn(
                                            "h-full rounded-full transition-all duration-300", 
                                            band.percentageFilled >= 100 ? "bg-indigo-600" : (band.percentageFilled > 0 ? "bg-indigo-400" : "bg-transparent")
                                        )}
                                        style={{ width: `${band.percentageFilled}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// --- COMPONENT: Remittance Reports ---
function RemittanceReports({ schoolId }: { schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [period, setPeriod] = useState(format(new Date(), 'yyyy-MM'));
    const [records, setRecords] = useState<PayrollRecord[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchRecords = async () => {
        if (!firestore || !schoolId) return;
        setLoading(true);
        try {
            const q = query(
                collection(firestore, 'payrollRecords'),
                where('schoolId', '==', schoolId),
                where('period', '==', period)
            );
            const snap = await getDocs(q);
            setRecords(snap.docs.map(d => ({ id: d.id, ...d.data() } as PayrollRecord)));
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error", description: "Failed to load remittance data." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (schoolId) fetchRecords();
    }, [period, schoolId]);

    const ssnitTotals = useMemo(() => {
        return records.reduce((acc, r) => ({
            basic: acc.basic + (r.basicSalary || 0),
            employee: acc.employee + (r.statutory?.ssnitEmployee || 0),
            employer: acc.employer + (r.statutory?.ssnitEmployer || 0),
            total: acc.total + (r.statutory?.ssnitEmployee || 0) + (r.statutory?.ssnitEmployer || 0)
        }), { basic: 0, employee: 0, employer: 0, total: 0 });
    }, [records]);

    const payeTotals = useMemo(() => {
        return records.reduce((acc, r) => ({
            gross: acc.gross + (r.grossSalary || 0),
            taxable: acc.taxable + (r.taxableIncome || 0),
            paye: acc.paye + (r.statutory?.paye || 0)
        }), { gross: 0, taxable: 0, paye: 0 });
    }, [records]);

    return (
        <div className="space-y-6">
            <Card className="bg-slate-50 border-slate-200 print:hidden shadow-sm rounded-2xl">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg">Compliance & Remittance Reports</CardTitle>
                            <CardDescription>Generate monthly summaries for SSNIT and GRA (PAYE).</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Input 
                                type="month" 
                                value={period} 
                                onChange={e => setPeriod(e.target.value)} 
                                className="bg-white w-[200px] rounded-xl h-11"
                            />
                            <Button onClick={() => window.print()} variant="outline" className="h-11 rounded-xl font-bold">
                                <Printer className="mr-2 h-4 w-4"/> Print
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-indigo-600"/></div>
            ) : records.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-dashed rounded-3xl print:hidden">
                    <FileDown className="mx-auto h-12 w-12 text-slate-200 mb-2"/>
                    <p className="text-slate-500">No data found for {period}. Please run payroll first.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {/* SSNIT REPORT */}
                    <div className="space-y-4">
                        <div className="border-b pb-2">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{"SSNIT Remittance Schedule - " + period}</h3>
                            <p className="text-sm text-slate-500">Tier 1 & Tier 2 Contributions (18.5% Total)</p>
                        </div>
                        <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead>Staff Name</TableHead>
                                        <TableHead>SSNIT Number</TableHead>
                                        <TableHead className="text-right">Basic Salary</TableHead>
                                        <TableHead className="text-right">Employee (5.5%)</TableHead>
                                        <TableHead className="text-right">Employer (13%)</TableHead>
                                        <TableHead className="text-right font-bold">Total (18.5%)</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.map(r => (
                                        <TableRow key={`ssnit-${r.id}`} className="hover:bg-slate-50/50">
                                            <TableCell className="font-semibold text-slate-800">{r.staffName}</TableCell>
                                            <TableCell className="font-mono text-xs text-slate-500">{(r as any).ssnitNumber || '-'}</TableCell>
                                            <TableCell className="text-right font-mono">GH₵{(r.basicSalary || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-mono text-rose-600">GH₵{(r.statutory?.ssnitEmployee || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-mono text-rose-600">GH₵{(r.statutory?.ssnitEmployer || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-mono font-bold text-indigo-700">GH₵{((r.statutory?.ssnitEmployee || 0) + (r.statutory?.ssnitEmployer || 0)).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-slate-100 font-black text-slate-900">
                                        <TableCell colSpan={2}>Grand Totals</TableCell>
                                        <TableCell className="text-right font-mono">GH₵{ssnitTotals.basic.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono">GH₵{ssnitTotals.employee.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono">GH₵{ssnitTotals.employer.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono text-indigo-700">GH₵{ssnitTotals.total.toLocaleString()}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* PAYE REPORT */}
                    <div className="space-y-4 pt-8 border-t-2">
                        <div className="border-b pb-2">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{"PAYE Tax Remittance (GRA) - " + period}</h3>
                            <p className="text-sm text-slate-500">Monthly Individual Income Tax Summary</p>
                        </div>
                        <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-slate-50">
                                        <TableHead>Staff Name</TableHead>
                                        <TableHead>TIN Number</TableHead>
                                        <TableHead className="text-right">Gross Salary</TableHead>
                                        <TableHead className="text-right">Taxable Income</TableHead>
                                        <TableHead className="text-right font-bold">PAYE Tax Due</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.map(r => (
                                        <TableRow key={`paye-${r.id}`} className="hover:bg-slate-50/50">
                                            <TableCell className="font-semibold text-slate-800">{r.staffName}</TableCell>
                                            <TableCell className="font-mono text-xs text-slate-500">{(r as any).tinNumber || '-'}</TableCell>
                                            <TableCell className="text-right font-mono">GH₵{(r.grossSalary || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-mono">GH₵{(r as any).taxableIncome?.toFixed(2) || '0.00'}</TableCell>
                                            <TableCell className="text-right font-mono font-bold text-rose-600">GH₵{(r.statutory?.paye || 0).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-slate-100 font-black text-slate-900">
                                        <TableCell colSpan={2}>Grand Totals</TableCell>
                                        <TableCell className="text-right font-mono">GH₵{payeTotals.gross.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono">GH₵{payeTotals.taxable.toLocaleString()}</TableCell>
                                        <TableCell className="text-right font-mono text-rose-700">GH₵{payeTotals.paye.toLocaleString()}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            )}
            <style jsx global>{`
                @media print {
                    .print\\:hidden { display: none !important; }
                    body { background: white; padding: 0; }
                    header, aside, nav { display: none !important; }
                    main { margin: 0 !important; padding: 0 !important; }
                    .card { border: none !important; box-shadow: none !important; }
                }
            `}</style>
        </div>
    );
}

// --- COMPONENT: Payroll History ---
function PayrollHistory({ schoolId }: { schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [period, setPeriod] = useState(format(new Date(), 'yyyy-MM'));
    const [records, setRecords] = useState<PayrollRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSlip, setSelectedSlip] = useState<PayrollRecord | null>(null);

    const fetchHistory = async () => {
        if (!firestore || !schoolId) return;
        setLoading(true);
        try {
            const q = query(
                collection(firestore, 'payrollRecords'),
                where('schoolId', '==', schoolId),
                where('period', '==', period)
            );
            const snap = await getDocs(q);
            setRecords(snap.docs.map(d => ({ id: d.id, ...d.data() } as PayrollRecord)));
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error", description: "Failed to load history." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (schoolId) fetchHistory();
    }, [period, schoolId]);

    const totals = useMemo(() => {
        return records.reduce((acc, r) => ({
            gross: acc.gross + (r.grossSalary || 0),
            net: acc.net + (r.netSalary || 0),
            tax: acc.tax + (r.statutory?.paye || 0)
        }), { gross: 0, net: 0, tax: 0 });
    }, [records]);

    const handleExportHistoryCSV = () => {
        if (records.length === 0) return;
        const headers = ["Employee Name", "Bank Name", "Account Number", "Net Salary (GH₵)", "Period", "Reference"];
        const rows = records.map(p => [
            `"${p.staffName.replace(/"/g, '""')}"`,
            `"${(p.bankName || 'GCB Bank').replace(/"/g, '""')}"`,
            `'${p.accountNumber || 'N/A'}`,
            p.netSalary.toFixed(2),
            period,
            `"PAYROLL-${period}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers, ...rows].map(e => e.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Bank_Dispatch_File_${period}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: 'Exported', description: `Downloaded bank dispatch CSV file for ${period}.` });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="bg-slate-50 border-slate-200 shadow-sm rounded-2xl">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg">Reference Past Runs</CardTitle>
                            <CardDescription>Select a period to view saved payroll data.</CardDescription>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Label className="text-xs uppercase font-bold text-slate-500">Month</Label>
                                <Input 
                                    type="month" 
                                    value={period} 
                                    onChange={e => setPeriod(e.target.value)} 
                                    className="bg-white w-[200px] rounded-xl h-11"
                                />
                            </div>
                            <Button 
                                onClick={handleExportHistoryCSV} 
                                disabled={records.length === 0}
                                variant="outline" 
                                className="h-11 rounded-xl font-bold border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                            >
                                <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Export Dispatch File
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-indigo-600"/></div>
            ) : records.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-dashed rounded-3xl shadow-sm">
                    <History className="mx-auto h-12 w-12 text-slate-200 mb-2"/>
                    <p className="text-slate-500">{"No payroll records found for " + period + "."}</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-indigo-50/50 border-indigo-150 shadow-sm rounded-2xl">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Gross Payout</p>
                                    <p className="text-xl font-black font-mono mt-0.5">GH₵{totals.gross.toLocaleString()}</p>
                                </div>
                                <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl"><Banknote className="h-5 w-5" /></div>
                            </CardContent>
                        </Card>
                        <Card className="bg-rose-50/50 border-rose-150 shadow-sm rounded-2xl">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Total PAYE Tax</p>
                                    <p className="text-xl font-black font-mono mt-0.5">GH₵{totals.tax.toLocaleString()}</p>
                                </div>
                                <div className="p-2 bg-rose-100 text-rose-700 rounded-xl"><Coins className="h-5 w-5" /></div>
                            </CardContent>
                        </Card>
                        <Card className="bg-emerald-50/50 border-emerald-150 shadow-sm rounded-2xl">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Total Net Paid</p>
                                    <p className="text-xl font-black font-mono mt-0.5">GH₵{totals.net.toLocaleString()}</p>
                                </div>
                                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl"><CheckCircle2 className="h-5 w-5" /></div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border border-slate-100 shadow-md rounded-2xl overflow-hidden bg-white">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="pl-6 font-bold">Staff Member</TableHead>
                                        <TableHead className="text-right font-bold">Gross</TableHead>
                                        <TableHead className="text-right font-bold">Net Salary</TableHead>
                                        <TableHead className="text-right pr-6 font-bold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.map(r => (
                                        <TableRow key={r.id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="py-4 pl-6 font-bold text-slate-800 text-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs text-indigo-600 border border-slate-200">
                                                        {(r.staffName || '')[0] || ''}
                                                    </div>
                                                    <span>{r.staffName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-mono text-slate-500 font-medium">GH₵{(r.grossSalary || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-mono font-black text-emerald-700">GH₵{(r.netSalary || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-right pr-6">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" onClick={() => setSelectedSlip(r)} className="rounded-xl hover:bg-slate-100 hover:text-indigo-700 font-semibold text-xs h-9">
                                                            <Eye className="h-4 w-4 mr-1.5"/> View Slip
                                                        </Button>
                                                    </DialogTrigger>
                                                    {selectedSlip && selectedSlip.id === r.id && (
                                                        <PayslipDialog payslip={selectedSlip} />
                                                    )}
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}

// --- COMPONENT: Run Payroll ---
interface RunPayrollProps {
    staff: any[];
    config: any;
    accounts: any[];
}
function RunPayroll({ staff, config, accounts }: RunPayrollProps) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    const [isProcessing, setIsProcessing] = useState(false);
    const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
    const [previewData, setPreviewData] = useState<any[]>([]);

    const glMapping = config || {};
    const salariesExpenseAcc = accounts.find((a: any) => a.id === glMapping.salariesExpenseId);
    const ssnitExpenseAcc = accounts.find((a: any) => a.id === glMapping.ssnitExpenseId);
    const bankAcc = accounts.find((a: any) => a.id === glMapping.bankAccountId);
    const ssnitPayableAcc = accounts.find((a: any) => a.id === glMapping.ssnitPayableId);
    const payePayableAcc = accounts.find((a: any) => a.id === glMapping.payePayableId);
    const deductionsClearingAcc = accounts.find((a: any) => a.id === glMapping.deductionsClearingId);

    const isGlMapped = !!(glMapping.salariesExpenseId && glMapping.ssnitExpenseId && glMapping.bankAccountId && glMapping.ssnitPayableId && glMapping.payePayableId);

    const handlePreview = async () => {
        if (!firestore || !schoolId) return;
        setIsProcessing(true);
        try {
            const existingRecordsQuery = query(collection(firestore, 'payrollRecords'), where('period', '==', month), where('schoolId', '==', schoolId));
            const existingRecordsSnapshot = await getDocs(existingRecordsQuery);
            if (!existingRecordsSnapshot.empty) {
                toast({ variant: 'destructive', title: 'Payroll Already Run', description: `Payroll for ${month} has already been processed.`});
                setIsProcessing(false);
                return;
            }

            const staffWithConfig = [];
            for (const emp of staff) {
                const configSnap = await getDocs(query(collection(firestore, `staff/${emp.uid}/payroll`)));
                if (!configSnap.empty) {
                    staffWithConfig.push({ ...emp, salaryInfo: configSnap.docs[0].data() });
                }
            }

            const generated = staffWithConfig.map(emp => {
                const salaryInfo = emp.salaryInfo || {};
                const calc = calculatePayslip(salaryInfo, config);
                return { staffId: emp.uid, staffName: `${emp.firstName || ''} ${emp.lastName || ''}`.trim(), ...calc };
            });
            setPreviewData(generated);
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: "Preview Error" });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCommit = async () => {
        if (!firestore || !user || !schoolId || previewData.length === 0) return;
        setIsProcessing(true);
        const batch = writeBatch(firestore);

        try {
            previewData.forEach(p => {
                const ref = doc(collection(firestore, 'payrollRecords'));
                const { staffId, staffName, ...payslipData } = p;
                batch.set(ref, {
                    staffId, staffName,
                    period: month,
                    ...payslipData,
                    createdAt: serverTimestamp(),
                    generatedBy: user.uid,
                    schoolId: schoolId,
                });
            });

            // Write balanced GL Journal Entry if mapped
            if (isGlMapped) {
                const journalRef = doc(collection(firestore, 'journal_entries'));
                const timestamp = serverTimestamp();
                
                const lines = [
                    { 
                        accountId: glMapping.salariesExpenseId, 
                        accountName: salariesExpenseAcc?.name || 'Salaries Expense', 
                        debit: totals.gross, 
                        credit: 0, 
                        costCenter: 'General' 
                    },
                    { 
                        accountId: glMapping.ssnitExpenseId, 
                        accountName: ssnitExpenseAcc?.name || 'Employer SSNIT Pension Expense', 
                        debit: totals.ssnitEmployer, 
                        credit: 0, 
                        costCenter: 'General' 
                    },
                    { 
                        accountId: glMapping.bankAccountId, 
                        accountName: bankAcc?.name || 'Cash/Bank Disbursement', 
                        debit: 0, 
                        credit: totals.net, 
                        costCenter: 'General' 
                    },
                    { 
                        accountId: glMapping.ssnitPayableId, 
                        accountName: ssnitPayableAcc?.name || 'SSNIT Payable', 
                        debit: 0, 
                        credit: totals.ssnitEmployee + totals.ssnitEmployer, 
                        costCenter: 'General' 
                    },
                    { 
                        accountId: glMapping.payePayableId, 
                        accountName: payePayableAcc?.name || 'PAYE Payable', 
                        debit: 0, 
                        credit: totals.paye, 
                        costCenter: 'General' 
                    }
                ];

                if (totals.manualDeductions > 0) {
                    lines.push({
                        accountId: glMapping.deductionsClearingId || glMapping.payePayableId, // Fallback
                        accountName: deductionsClearingAcc?.name || 'Other Deductions Clearing',
                        debit: 0,
                        credit: totals.manualDeductions,
                        costCenter: 'General'
                    });
                }

                batch.set(journalRef, {
                    date: timestamp,
                    description: `Automated posting for monthly payroll run - Period: ${month}`,
                    reference: `PAYROLL-${month}`,
                    lines,
                    totalAmount: totals.gross + totals.ssnitEmployer, // Total debits
                    createdBy: user.uid,
                    createdAt: timestamp,
                    schoolId: schoolId
                });
            }

            await batch.commit();
            toast({ title: "Payroll Processed", description: `Paid ${previewData.length} employees for ${month}. GL journal posted.` });
            setPreviewData([]);
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsProcessing(false);
        }
    };

    const totals = useMemo(() => {
        if (previewData.length === 0) return { gross: 0, ssnitEmployee: 0, ssnitEmployer: 0, paye: 0, net: 0, manualDeductions: 0 };
        return previewData.reduce((acc, curr) => {
            acc.gross += curr.grossSalary || 0;
            acc.ssnitEmployee += curr.statutory?.ssnitEmployee || 0;
            acc.ssnitEmployer += curr.statutory?.ssnitEmployer || 0;
            acc.paye += curr.statutory?.paye || 0;
            acc.net += curr.netSalary || 0;
            acc.manualDeductions += (curr.deductions || []).reduce((sum: number, d: any) => sum + (parseFloat(d.amount) || 0), 0);
            return acc;
        }, { gross: 0, ssnitEmployee: 0, ssnitEmployer: 0, paye: 0, net: 0, manualDeductions: 0 });
    }, [previewData]);

    const chartData = useMemo(() => {
        if (previewData.length === 0) return [];
        return [
            { name: 'Net Take-Home', value: totals.net },
            { name: 'PAYE Tax', value: totals.paye },
            { name: 'Employee SSNIT', value: totals.ssnitEmployee },
            { name: 'Employer SSNIT', value: totals.ssnitEmployer },
            { name: 'Manual Deductions', value: totals.manualDeductions }
        ].filter(d => d.value > 0);
    }, [totals]);

    const CHART_COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#d97706', '#94a3b8'];

    const handleExportBankDispatch = () => {
        if (previewData.length === 0) return;
        const headers = ["Employee Name", "Bank Name", "Account Number", "Net Salary (GH₵)", "Period", "Reference"];
        const rows = previewData.map(p => [
            `"${p.staffName.replace(/"/g, '""')}"`,
            `"${(p.bankName || 'GCB Bank').replace(/"/g, '""')}"`,
            `'${p.accountNumber || 'N/A'}`,
            p.netSalary.toFixed(2),
            month,
            `"PAYROLL-${month}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + [headers, ...rows].map(e => e.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Bank_Dispatch_File_${month}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: 'Exported', description: 'Bank dispatch CSV file downloaded successfully.' });
    };

    return (
        <div className="space-y-6">
            <Card className="border border-slate-100 shadow-md rounded-2xl bg-white overflow-hidden">
                <CardContent className="p-5 flex flex-col sm:flex-row gap-4 items-end bg-slate-50/20">
                    <div className="space-y-1.5 flex-grow w-full">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payroll Process Month</Label>
                        <Input type="month" value={month} onChange={e => setMonth(e.target.value)} className="h-11 rounded-xl bg-white focus-visible:ring-indigo-500 border-slate-200" />
                    </div>
                    <Button onClick={handlePreview} className="w-full sm:w-auto h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md border-0 shrink-0" disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Calculator className="mr-2 h-4 w-4"/>} 
                        Calculate Payroll
                    </Button>
                </CardContent>
            </Card>

            {previewData.length > 0 && (
                <div className="space-y-6">
                    {/* Live Calculator Totals Summary */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white hover:shadow-md transition-all">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Gross Payroll Cost</p>
                                    <p className="text-xl font-black font-mono text-slate-800">GH₵{(totals.gross + totals.ssnitEmployer).toFixed(2)}</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-violet-50 text-violet-650">
                                    <Banknote className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white hover:shadow-md transition-all">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total PAYE Tax</p>
                                    <p className="text-xl font-black font-mono text-rose-600">GH₵{totals.paye.toFixed(2)}</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                                    <Coins className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white hover:shadow-md transition-all">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">SSNIT Savings</p>
                                    <p className="text-xl font-black font-mono text-amber-600">GH₵{(totals.ssnitEmployee + totals.ssnitEmployer).toFixed(2)}</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-amber-50 text-amber-650">
                                    <Save className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-indigo-100 shadow-sm rounded-2xl bg-indigo-50/30 hover:shadow-md transition-all">
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-indigo-500 font-semibold">Net Cash Payable</p>
                                    <p className="text-xl font-black font-mono text-indigo-700">GH₵{totals.net.toFixed(2)}</p>
                                </div>
                                <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Summary preview table */}
                        <div className="lg:col-span-8 space-y-6">
                            <Card className="border border-slate-100 shadow-lg rounded-2xl overflow-hidden bg-white">
                                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 border-b border-slate-100 p-5">
                                    <div>
                                        <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                                            <Sparkles className="h-4 w-4 text-indigo-600" /> Payroll Calculation Preview: {month}
                                        </CardTitle>
                                        <CardDescription className="text-xs text-slate-400">Review employee statistics, statutory deductions, and bank targets.</CardDescription>
                                    </div>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <Button 
                                            onClick={handleExportBankDispatch}
                                            variant="outline" 
                                            className="rounded-xl border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-50"
                                        >
                                            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Export Dispatch File
                                        </Button>
                                        <Button onClick={handleCommit} disabled={isProcessing} className="bg-green-600 hover:bg-green-700 text-white h-10 px-6 rounded-xl font-bold shadow-md">
                                            {isProcessing ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <CheckCircle2 className="mr-2 h-4 w-4"/>}
                                            Approve & Save Payroll
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-slate-50 text-slate-600 font-semibold">
                                                <TableRow className="border-b border-slate-100">
                                                    <TableHead className="py-4 pl-6 font-bold">Staff Member</TableHead>
                                                    <TableHead className="py-4 font-bold text-right w-[110px]">Gross Pay</TableHead>
                                                    <TableHead className="py-4 font-bold text-right w-[110px]">SSNIT (5.5%)</TableHead>
                                                    <TableHead className="py-4 font-bold text-right w-[110px]">PAYE Tax</TableHead>
                                                    <TableHead className="py-4 font-bold text-right pr-6 w-[120px]">Net Payable</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {previewData.map((p) => (
                                                    <TableRow key={p.staffId} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-b-0">
                                                        <TableCell className="py-4 pl-6 font-bold text-slate-800 text-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs text-indigo-600 border border-slate-200">
                                                                    {(p.staffName || '')[0] || ''}
                                                                </div>
                                                                <div>
                                                                    <span>{p.staffName}</span>
                                                                    <div className="text-[10px] text-slate-400 font-medium font-mono mt-0.5">
                                                                        {p.bankName ? `${p.bankName} - ${p.accountNumber}` : 'No Bank Setup'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right py-4 font-mono font-bold text-slate-600">GH₵{p.grossSalary.toFixed(2)}</TableCell>
                                                        <TableCell className="text-right py-4 font-mono text-rose-600">-GH₵{p.statutory?.ssnitEmployee.toFixed(2)}</TableCell>
                                                        <TableCell className="text-right py-4 font-mono text-rose-600">-GH₵{p.statutory?.paye.toFixed(2)}</TableCell>
                                                        <TableCell className="text-right py-4 pr-6 font-mono font-black text-indigo-700">GH₵{p.netSalary.toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Balanced Ledger Posting Card */}
                            <Card className="border border-slate-100 shadow-md rounded-2xl bg-white overflow-hidden">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-5">
                                    <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                                        <Landmark className="h-4 w-4 text-indigo-600" /> Automated General Ledger Posting Preview
                                    </CardTitle>
                                    <CardDescription className="text-xs text-slate-400">
                                        Balanced double-entry journal splits mapped to the school's chart of accounts.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {!isGlMapped ? (
                                        <div className="p-8 text-center text-xs text-amber-600 bg-amber-50/50 font-semibold flex flex-col items-center justify-center gap-2">
                                            <ShieldAlert className="h-5 w-5 text-amber-500 animate-pulse" />
                                            <span>GL Account Mapping Incomplete. Set up account maps in the "Tax Config" tab to enable journal postings.</span>
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow>
                                                    <TableHead className="pl-6 font-bold text-xs">Account Split Details</TableHead>
                                                    <TableHead className="font-bold text-xs text-right w-[150px]">Debit (GH₵)</TableHead>
                                                    <TableHead className="font-bold text-xs text-right pr-6 w-[150px]">Credit (GH₵)</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="text-xs font-mono font-bold text-slate-600">
                                                <TableRow className="hover:bg-slate-50/50">
                                                    <TableCell className="py-3 pl-6 font-sans text-slate-700">{salariesExpenseAcc?.name} <span className="text-slate-400 font-mono font-medium">({salariesExpenseAcc?.code})</span></TableCell>
                                                    <TableCell className="text-right py-3 text-indigo-600">GH₵{totals.gross.toFixed(2)}</TableCell>
                                                    <TableCell className="text-right py-3 pr-6 text-slate-300">-</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-slate-50/50">
                                                    <TableCell className="py-3 pl-6 font-sans text-slate-700">{ssnitExpenseAcc?.name} <span className="text-slate-400 font-mono font-medium">({ssnitExpenseAcc?.code})</span></TableCell>
                                                    <TableCell className="text-right py-3 text-indigo-600">GH₵{totals.ssnitEmployer.toFixed(2)}</TableCell>
                                                    <TableCell className="text-right py-3 pr-6 text-slate-300">-</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-slate-50/50">
                                                    <TableCell className="py-3 pl-6 font-sans text-slate-700">{bankAcc?.name} <span className="text-slate-400 font-mono font-medium">({bankAcc?.code})</span></TableCell>
                                                    <TableCell className="text-right py-3 text-slate-300">-</TableCell>
                                                    <TableCell className="text-right py-3 pr-6 text-rose-600">GH₵{totals.net.toFixed(2)}</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-slate-50/50">
                                                    <TableCell className="py-3 pl-6 font-sans text-slate-700">{ssnitPayableAcc?.name} <span className="text-slate-400 font-mono font-medium">({ssnitPayableAcc?.code})</span></TableCell>
                                                    <TableCell className="text-right py-3 text-slate-300">-</TableCell>
                                                    <TableCell className="text-right py-3 pr-6 text-rose-600">GH₵{(totals.ssnitEmployee + totals.ssnitEmployer).toFixed(2)}</TableCell>
                                                </TableRow>
                                                <TableRow className="hover:bg-slate-50/50">
                                                    <TableCell className="py-3 pl-6 font-sans text-slate-700">{payePayableAcc?.name} <span className="text-slate-400 font-mono font-medium">({payePayableAcc?.code})</span></TableCell>
                                                    <TableCell className="text-right py-3 text-slate-300">-</TableCell>
                                                    <TableCell className="text-right py-3 pr-6 text-rose-600">GH₵{totals.paye.toFixed(2)}</TableCell>
                                                </TableRow>
                                                {totals.manualDeductions > 0 && (
                                                    <TableRow className="hover:bg-slate-50/50">
                                                        <TableCell className="py-3 pl-6 font-sans text-slate-700">{deductionsClearingAcc?.name || 'Manual Deductions Clearing'} <span className="text-slate-400 font-mono font-medium">({deductionsClearingAcc?.code || 'Clearing'})</span></TableCell>
                                                        <TableCell className="text-right py-3 text-slate-300">-</TableCell>
                                                        <TableCell className="text-right py-3 pr-6 text-rose-600">GH₵{totals.manualDeductions.toFixed(2)}</TableCell>
                                                    </TableRow>
                                                )}
                                                <TableRow className="bg-slate-100 font-sans font-black text-slate-900 border-t">
                                                    <TableCell className="pl-6 py-3">Totals Summary (Balanced Ledger)</TableCell>
                                                    <TableCell className="text-right py-3">GH₵{(totals.gross + totals.ssnitEmployer).toFixed(2)}</TableCell>
                                                    <TableCell className="text-right py-3 pr-6">GH₵{(totals.net + totals.ssnitEmployee + totals.ssnitEmployer + totals.paye + totals.manualDeductions).toFixed(2)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Cost visualizer chart card */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card className="border border-slate-100 shadow-lg rounded-2xl overflow-hidden bg-white">
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-5">
                                    <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                                        <Coins className="h-4 w-4 text-indigo-600" /> Payroll Expense Breakdown
                                    </CardTitle>
                                    <CardDescription className="text-xs text-slate-400">Percentage distribution of the monthly cash allocations.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 flex flex-col items-center justify-center min-h-[300px]">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={55}
                                                outerRadius={75}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip formatter={(value: number) => `GH₵${value.toFixed(2)}`} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="w-full mt-4 space-y-2 text-xs">
                                        {chartData.map((d, index) => (
                                            <div key={d.name} className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                                                    <span className="text-slate-650 font-medium">{d.name}</span>
                                                </div>
                                                <span className="font-mono font-bold text-slate-800">
                                                    GH₵{d.value.toFixed(2)} ({(d.value / (totals.gross + totals.ssnitEmployer) * 100).toFixed(0)}%)
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- COMPONENT: Payroll Settings ---
interface PayrollSettingsTabProps {
    config: any;
    accounts: any[];
}
function PayrollSettingsTab({ config, accounts }: PayrollSettingsTabProps) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    
    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'payrollSettings', 'global') : null, [firestore]);

    const form = useForm<z.infer<typeof payrollSettingsSchema>>({
        resolver: zodResolver(payrollSettingsSchema),
        defaultValues: {
            ssnitEmployeeContributionRate: 0.055,
            ssnitEmployerContributionRate: 0.13,
            payeeBrackets: DEFAULT_TAX_BRACKETS,
            salariesExpenseId: '',
            ssnitExpenseId: '',
            bankAccountId: '',
            ssnitPayableId: '',
            payePayableId: '',
            deductionsClearingId: ''
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "payeeBrackets"
    });

    useEffect(() => {
        if (config) {
            form.reset({
                ssnitEmployeeContributionRate: config.ssnitEmployeeContributionRate ?? 0.055,
                ssnitEmployerContributionRate: config.ssnitEmployerContributionRate ?? 0.13,
                payeeBrackets: config.payeeBrackets || DEFAULT_TAX_BRACKETS,
                salariesExpenseId: config.salariesExpenseId || '',
                ssnitExpenseId: config.ssnitExpenseId || '',
                bankAccountId: config.bankAccountId || '',
                ssnitPayableId: config.ssnitPayableId || '',
                payePayableId: config.payePayableId || '',
                deductionsClearingId: config.deductionsClearingId || ''
            });
        }
    }, [config, form]);

    async function onSubmit(values: z.infer<typeof payrollSettingsSchema>) {
        if (!firestore) return;
        setIsSaving(true);
        try {
            await setDoc(doc(firestore, 'payrollSettings', 'global'), {
                ...values,
                updatedAt: serverTimestamp()
            }, { merge: true });
            toast({ title: "Settings Saved", description: "Global payroll configuration and GL mapping updated." });
        } catch (e) {
            toast({ variant: 'destructive', title: "Error", description: "Could not save settings." });
        } finally {
            setIsSaving(false);
        }
    }

    const postableAccounts = useMemo(() => {
        return accounts.filter((a: any) => !a.isControlAccount) || [];
    }, [accounts]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Statutory Rates Card */}
                    <Card className="border border-slate-100 shadow-md rounded-2xl bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-5">
                            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                                <ShieldCheck className="h-4 w-4 text-indigo-600" /> Statutory Rates Configuration
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-400">Configure SSNIT and mandatory employee benefits rates.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-5">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="ssnitEmployeeContributionRate" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-bold text-slate-500 uppercase">Employee SSNIT (5.5% = 0.055)</FormLabel>
                                        <FormControl><Input type="number" step="0.001" className="h-10 bg-slate-50 rounded-xl" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="ssnitEmployerContributionRate" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[11px] font-bold text-slate-500 uppercase">Employer SSNIT (13% = 0.13)</FormLabel>
                                        <FormControl><Input type="number" step="0.001" className="h-10 bg-slate-50 rounded-xl" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                        </CardContent>
                    </Card>

                    {/* GL Mapping Card */}
                    <Card className="border border-slate-100 shadow-md rounded-2xl bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-5">
                            <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                                <Landmark className="h-4 w-4 text-indigo-600" /> General Ledger Accounts Mapping
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-400">Link payroll allocations directly to your bookkeeping system.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name="salariesExpenseId" render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-[10px] font-bold text-slate-500 uppercase mb-1">Salaries Expense</FormLabel>
                                        <FormControl>
                                            <SearchableAccountSelect
                                                accounts={postableAccounts}
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                                placeholder="Salaries Expense..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="ssnitExpenseId" render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-[10px] font-bold text-slate-500 uppercase mb-1">Employer SSNIT Expense</FormLabel>
                                        <FormControl>
                                            <SearchableAccountSelect
                                                accounts={postableAccounts}
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                                placeholder="Pension Expense..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="bankAccountId" render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-[10px] font-bold text-slate-500 uppercase mb-1">Cash / Bank Account</FormLabel>
                                        <FormControl>
                                            <SearchableAccountSelect
                                                accounts={postableAccounts}
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                                placeholder="Disbursement Bank..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="ssnitPayableId" render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-[10px] font-bold text-slate-500 uppercase mb-1">SSNIT Payable (Liability)</FormLabel>
                                        <FormControl>
                                            <SearchableAccountSelect
                                                accounts={postableAccounts}
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                                placeholder="SSNIT Payable..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="payePayableId" render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-[10px] font-bold text-slate-500 uppercase mb-1">PAYE Payable (Liability)</FormLabel>
                                        <FormControl>
                                            <SearchableAccountSelect
                                                accounts={postableAccounts}
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                                placeholder="PAYE Payable..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="deductionsClearingId" render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-[10px] font-bold text-slate-500 uppercase mb-1">Deductions Clearing Account</FormLabel>
                                        <FormControl>
                                            <SearchableAccountSelect
                                                accounts={postableAccounts}
                                                value={field.value || ''}
                                                onChange={field.onChange}
                                                placeholder="Clearing Account..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Brackets Form */}
                    <Card className="border border-slate-100 shadow-md rounded-2xl bg-white overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-5 flex flex-row justify-between items-center">
                            <div>
                                <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800">
                                    <Coins className="h-4 w-4 text-indigo-600" /> PAYE Tax Brackets (GRA Compliant)
                                </CardTitle>
                                <CardDescription className="text-xs text-slate-400">Monthly progressive income tax bands.</CardDescription>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ from: 0, to: 0, rate: 0 })} className="rounded-xl border-indigo-200 text-indigo-700 font-bold hover:bg-indigo-50">
                                <Plus className="h-3.5 w-3.5 mr-1"/> Add Band
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0 max-h-[360px] overflow-y-auto">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="pl-6 font-bold text-xs">From (GH₵)</TableHead>
                                        <TableHead className="font-bold text-xs">To (GH₵)</TableHead>
                                        <TableHead className="font-bold text-xs">Rate (Decimal)</TableHead>
                                        <TableHead className="pr-6"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id} className="hover:bg-slate-50/30">
                                            <TableCell className="p-2 pl-6">
                                                <FormField control={form.control} name={`payeeBrackets.${index}.from`} render={({ field }) => (
                                                    <FormControl><Input type="number" className="h-9 font-mono rounded-lg" {...field} /></FormControl>
                                                )}/>
                                            </TableCell>
                                            <TableCell className="p-2">
                                                <FormField control={form.control} name={`payeeBrackets.${index}.to`} render={({ field }) => (
                                                    <FormControl><Input type="number" className="h-9 font-mono rounded-lg" {...field} /></FormControl>
                                                )}/>
                                            </TableCell>
                                            <TableCell className="p-2">
                                                <FormField control={form.control} name={`payeeBrackets.${index}.rate`} render={({ field }) => (
                                                    <FormControl><Input type="number" step="0.001" className="h-9 font-mono rounded-lg" {...field} /></FormControl>
                                                )}/>
                                            </TableCell>
                                            <TableCell className="p-2 pr-6 text-right">
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl" onClick={() => remove(index)}>
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Tax bracket simulation widget */}
                    <TaxSimulator config={form.watch()} />
                </div>

                <div className="flex justify-end border-t pt-4">
                    <Button type="submit" disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-8 font-bold rounded-xl shadow-md border-0">
                        {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
                        Save Global Configuration & Mapping
                    </Button>
                </div>
            </form>
        </Form>
    );
}

// --- MAIN PAGE ---
export default function PayrollPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();

    const staffQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: staff, isLoading: isLoadingStaff } = useCollection<any>(staffQuery);

    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'payrollSettings', 'global') : null, [firestore]);
    const { data: config, isLoading: isLoadingSettings } = useDoc(settingsRef);

    const accountsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'accounts'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: accountsList, isLoading: isLoadingAccounts } = useCollection<any>(accountsQuery);

    const canManage = ['Administrator', 'Director', 'Accountant'].includes(role || '');

    const isLoading = schoolLoading || isLoadingStaff || isLoadingSettings || isLoadingAccounts;

    if (!canManage) return <div className="p-8 text-center text-red-500 font-bold">Access Denied. Financial staff only.</div>;

    return (
        <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen">
            {/* Executive Glowing Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-indigo-500/20">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-bold tracking-wide backdrop-blur-md border border-white/10">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-300 animate-pulse animate-duration-1000" />
                            <span>Statutory Payroll & Accounting Integration Suite</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                            Payroll Hub
                        </h1>
                        <p className="text-sm text-indigo-100 font-medium max-w-xl">
                            Process monthly staff payrolls, inspect statutory SSNIT & PAYE breakdowns, export bank dispatch spreadsheets, and automatically post balanced double-entry transactions to the General Ledger.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-black/15 backdrop-blur-lg rounded-2xl p-4 border border-white/5 text-left">
                        <div>
                            <p className="text-[10px] uppercase text-indigo-300 font-bold tracking-wider">Registered Staff</p>
                            <p className="text-2xl font-black font-mono text-white mt-0.5">{staff?.length || 0}</p>
                        </div>
                        <div className="border-l border-white/15 pl-4">
                            <p className="text-[10px] uppercase text-indigo-300 font-bold tracking-wider">Statutory Rules</p>
                            <p className="text-xs font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                                <ShieldCheck className="h-4 w-4" /> GRA Act 1151
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="run" className="w-full space-y-6">
                <TabsList className="bg-slate-100 p-1.5 rounded-2xl inline-flex w-auto border border-slate-200/50">
                    <TabsTrigger value="run" className="rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Calculator className="h-4 w-4 mr-2 text-indigo-600"/> Run Payroll
                    </TabsTrigger>
                    <TabsTrigger value="history" className="rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <History className="h-4 w-4 mr-2 text-indigo-600"/> History
                    </TabsTrigger>
                    <TabsTrigger value="remittance" className="rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <ShieldCheck className="h-4 w-4 mr-2 text-indigo-600"/> Remittance
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-xl px-5 py-2 text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Settings className="h-4 w-4 mr-2 text-indigo-600"/> Tax Config & GL Mapping
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="run" className="mt-0">
                    {isLoading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>
                    ) : (
                        <RunPayroll staff={staff || []} config={config} accounts={accountsList || []} />
                    )}
                </TabsContent>

                <TabsContent value="history" className="mt-0">
                    {schoolId && <PayrollHistory schoolId={schoolId} />}
                </TabsContent>

                <TabsContent value="remittance" className="mt-0">
                    {schoolId && <RemittanceReports schoolId={schoolId} />}
                </TabsContent>

                <TabsContent value="settings" className="mt-0">
                    {isLoading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>
                    ) : (
                        <PayrollSettingsTab config={config} accounts={accountsList || []} />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
