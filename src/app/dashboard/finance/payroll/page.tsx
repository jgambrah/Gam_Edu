'use client';

import { useState, useMemo, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useUser, useDoc } from '@/firebase'; 
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, addDoc, serverTimestamp, doc, setDoc, writeBatch, where, getDocs, runTransaction, increment } from 'firebase/firestore';
import { 
  Banknote, Calculator, Settings, UserCog, CheckCircle2, 
  FileText, Loader2, Save, Printer, DollarSign, Landmark, History, Eye, Search, FileDown, ShieldCheck, Plus, Trash2
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Staff, StaffPayrollConfig, PayrollSettings, PayrollRecord } from '@/lib/types';
import { PayslipDialog } from '../../payroll/payslip-dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
    }))
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
        statutory: {
            ssnitEmployee,
            ssnitEmployer: employerSSNIT,
            paye: taxPayable
        }
    };
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
            <Card className="bg-slate-50 border-slate-200 print:hidden">
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
                                className="bg-white w-[200px]"
                            />
                            <Button onClick={() => window.print()} variant="outline">
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
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">SSNIT Remittance Schedule - {period}</h3>
                            <p className="text-sm text-slate-500">Tier 1 & Tier 2 Contributions (18.5% Total)</p>
                        </div>
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
                                    <TableRow key={`ssnit-${r.id}`}>
                                        <TableCell className="font-medium">{r.staffName}</TableCell>
                                        <TableCell className="font-mono text-xs">{(r as any).ssnitNumber || '-'}</TableCell>
                                        <TableCell className="text-right">GH₵{(r.basicSalary || 0).toFixed(2)}</TableCell>
                                        <TableCell className="text-right">GH₵{(r.statutory?.ssnitEmployee || 0).toFixed(2)}</TableCell>
                                        <TableCell className="text-right">GH₵{(r.statutory?.ssnitEmployer || 0).toFixed(2)}</TableCell>
                                        <TableCell className="text-right font-bold">GH₵{((r.statutory?.ssnitEmployee || 0) + (r.statutory?.ssnitEmployer || 0)).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="bg-slate-100 font-black">
                                    <TableCell colSpan={2}>Grand Totals</TableCell>
                                    <TableCell className="text-right">GH₵{ssnitTotals.basic.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">GH₵{ssnitTotals.employee.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">GH₵{ssnitTotals.employer.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">GH₵{ssnitTotals.total.toLocaleString()}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    {/* PAYE REPORT */}
                    <div className="space-y-4 pt-8 border-t-2">
                        <div className="border-b pb-2">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PAYE Tax Remittance (GRA) - {period}</h3>
                            <p className="text-sm text-slate-500">Monthly Individual Income Tax Summary</p>
                        </div>
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
                                    <TableRow key={`paye-${r.id}`}>
                                        <TableCell className="font-medium">{r.staffName}</TableCell>
                                        <TableCell className="font-mono text-xs">{(r as any).tinNumber || '-'}</TableCell>
                                        <TableCell className="text-right">GH₵{(r.grossSalary || 0).toFixed(2)}</TableCell>
                                        <TableCell className="text-right">GH₵{(r as any).taxableIncome?.toFixed(2) || '0.00'}</TableCell>
                                        <TableCell className="text-right font-bold text-rose-700">GH₵{(r.statutory?.paye || 0).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow className="bg-slate-100 font-black">
                                    <TableCell colSpan={2}>Grand Totals</TableCell>
                                    <TableCell className="text-right">GH₵{payeTotals.gross.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">GH₵{payeTotals.taxable.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-rose-700">GH₵{payeTotals.paye.toLocaleString()}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <Card className="bg-slate-50 border-slate-200">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg">Reference Past Runs</CardTitle>
                            <CardDescription>Select a period to view saved payroll data.</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Label className="text-xs uppercase font-bold text-slate-500">Month</Label>
                            <Input 
                                type="month" 
                                value={period} 
                                onChange={e => setPeriod(e.target.value)} 
                                className="bg-white w-[200px]"
                            />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-indigo-600"/></div>
            ) : records.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-dashed rounded-3xl">
                    <History className="mx-auto h-12 w-12 text-slate-200 mb-2"/>
                    <p className="text-slate-500">No payroll records found for {period}.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-indigo-50 border-indigo-100">
                            <CardContent className="p-4"><p className="text-xs font-bold text-indigo-600 uppercase">Gross Payout</p><p className="text-2xl font-black">GH₵{totals.gross.toLocaleString()}</p></CardContent>
                        </Card>
                        <Card className="bg-rose-50 border-rose-100">
                            <CardContent className="p-4"><p className="text-xs font-bold text-rose-600 uppercase">Total PAYE Tax</p><p className="text-2xl font-black">GH₵{totals.tax.toLocaleString()}</p></CardContent>
                        </Card>
                        <Card className="bg-emerald-50 border-emerald-100">
                            <CardContent className="p-4"><p className="text-xs font-bold text-emerald-600 uppercase">Total Net Paid</p><p className="text-2xl font-black">GH₵{totals.net.toLocaleString()}</p></CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Staff Member</TableHead>
                                        <TableHead className="text-right">Gross</TableHead>
                                        <TableHead className="text-right">Net Salary</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.map(r => (
                                        <TableRow key={r.id}>
                                            <TableCell className="font-bold">{r.staffName}</TableCell>
                                            <TableCell className="text-right text-slate-500">GH₵{(r.grossSalary || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-right font-black text-emerald-700">GH₵{(r.netSalary || 0).toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="sm" onClick={() => setSelectedSlip(r)}>
                                                            <Eye className="h-4 w-4 mr-2"/> View Slip
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
function RunPayroll({ staff, config }: { staff: any[], config: any }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    const [isProcessing, setIsProcessing] = useState(false);
    const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
    const [previewData, setPreviewData] = useState<any[]>([]);

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
                return { staffId: emp.uid, staffName: `${emp.firstName} ${emp.lastName}`, ...calc };
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

            await batch.commit();
            toast({ title: "Payroll Processed", description: `Paid ${previewData.length} employees for ${month}.` });
            setPreviewData([]);
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-l-4 border-l-indigo-600">
                <CardHeader>
                    <CardTitle>Calculate Monthly Payroll</CardTitle>
                    <CardDescription>Generate salaries based on individual staff configurations and global tax settings.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4 items-end bg-slate-50/50 p-6 border-t border-b">
                    <div className="space-y-2 flex-1">
                        <Label className="text-xs font-black text-slate-500 uppercase">Payout Month</Label>
                        <Input type="month" value={month} onChange={e => setMonth(e.target.value)} className="bg-white h-12" />
                    </div>
                    <Button onClick={handlePreview} className="bg-indigo-600 h-12 px-8 font-bold" disabled={isProcessing}>
                        {isProcessing ? <Loader2 className="animate-spin mr-2"/> : <Calculator className="mr-2 h-4 w-4"/>} 
                        Generate Preview
                    </Button>
                </CardContent>
            </Card>

            {previewData.length > 0 && (
                <Card className="animate-in slide-in-from-bottom-2 duration-500">
                    <CardHeader className="flex flex-row justify-between items-center bg-slate-50 border-b">
                        <div>
                            <CardTitle>Approval Required: {month}</CardTitle>
                            <CardDescription>Review the net payouts before committing to the ledger.</CardDescription>
                        </div>
                        <Button onClick={handleCommit} disabled={isProcessing} className="bg-green-600 hover:bg-green-700 h-12 px-10 font-black shadow-lg shadow-green-900/10">
                            {isProcessing ? <Loader2 className="animate-spin"/> : <CheckCircle2 className="mr-2 h-5 w-5"/>}
                            Approve & Save Payroll
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50">
                                    <TableHead>Staff Member</TableHead>
                                    <TableHead className="text-right">Gross</TableHead>
                                    <TableHead className="text-right">SSNIT (5.5%)</TableHead>
                                    <TableHead className="text-right">PAYE Tax</TableHead>
                                    <TableHead className="text-right font-bold">Net Pay</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {previewData.map((p) => (
                                    <TableRow key={p.staffId}>
                                        <TableCell className="font-bold">{p.staffName}</TableCell>
                                        <TableCell className="text-right text-slate-500">GH₵{(p.grossSalary || 0).toFixed(2)}</TableCell>
                                        <TableCell className="text-right text-rose-500">-{p.statutory?.ssnitEmployee?.toFixed(2) || '0.00'}</TableCell>
                                        <TableCell className="text-right text-rose-500">-{p.statutory?.paye?.toFixed(2) || '0.00'}</TableCell>
                                        <TableCell className="text-right font-black text-emerald-700">GH₵{(p.netSalary || 0).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// --- COMPONENT: Payroll Settings ---
function PayrollSettingsTab() {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    
    const settingsRef = useMemoFirebase(() => firestore ? doc(firestore, 'payrollSettings', 'global') : null, [firestore]);
    const { data: config, isLoading } = useDoc(settingsRef);

    const form = useForm<z.infer<typeof payrollSettingsSchema>>({
        resolver: zodResolver(payrollSettingsSchema),
        defaultValues: {
            ssnitEmployeeContributionRate: 0.055,
            ssnitEmployerContributionRate: 0.13,
            payeeBrackets: DEFAULT_TAX_BRACKETS
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "payeeBrackets"
    });

    useEffect(() => {
        if (config) {
            form.reset({
                ssnitEmployeeContributionRate: config.ssnitEmployeeContributionRate,
                ssnitEmployerContributionRate: config.ssnitEmployerContributionRate,
                payeeBrackets: config.payeeBrackets || DEFAULT_TAX_BRACKETS
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
            toast({ title: "Settings Saved", description: "Global payroll configuration updated." });
        } catch (e) {
            toast({ variant: 'destructive', title: "Error", description: "Could not save settings." });
        } finally {
            setIsSaving(false);
        }
    }

    if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Statutory Rates</CardTitle>
                            <CardDescription>Configure SSNIT and mandatory contributions.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="ssnitEmployeeContributionRate" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employee SSNIT (5.5% = 0.055)</FormLabel>
                                        <FormControl><Input type="number" step="0.001" {...field} /></FormControl>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="ssnitEmployerContributionRate" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Employer SSNIT (13% = 0.13)</FormLabel>
                                        <FormControl><Input type="number" step="0.001" {...field} /></FormControl>
                                    </FormItem>
                                )}/>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>PAYE Tax Brackets (Monthly)</CardTitle>
                                    <CardDescription>Income tax bands according to GRA 2024 laws.</CardDescription>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ from: 0, to: 0, rate: 0 })}>
                                    <Plus className="h-4 w-4 mr-1"/> Add Band
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>From</TableHead>
                                        <TableHead>To</TableHead>
                                        <TableHead>Rate (%)</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell className="p-1">
                                                <FormField control={form.control} name={`payeeBrackets.${index}.from`} render={({ field }) => (
                                                    <FormControl><Input type="number" className="h-8 text-xs" {...field} /></FormControl>
                                                )}/>
                                            </TableCell>
                                            <TableCell className="p-1">
                                                <FormField control={form.control} name={`payeeBrackets.${index}.to`} render={({ field }) => (
                                                    <FormControl><Input type="number" className="h-8 text-xs" {...field} /></FormControl>
                                                )}/>
                                            </TableCell>
                                            <TableCell className="p-1">
                                                <FormField control={form.control} name={`payeeBrackets.${index}.rate`} render={({ field }) => (
                                                    <FormControl><Input type="number" step="0.001" className="h-8 text-xs" {...field} /></FormControl>
                                                )}/>
                                            </TableCell>
                                            <TableCell className="p-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => remove(index)}>
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving} className="bg-indigo-600 h-12 px-10 font-bold">
                        {isSaving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>}
                        Save Global Config
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

    const canManage = ['Administrator', 'Director', 'Accountant'].includes(role || '');

    const isLoading = schoolLoading || isLoadingStaff || isLoadingSettings;

    if (!canManage) return <div className="p-8 text-center text-red-500">Access Denied. Financial staff only.</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
                        <Banknote className="h-8 w-8 text-white"/>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Payroll Hub</h1>
                        <p className="text-muted-foreground font-medium italic">Generate salaries and track compliance.</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="run" className="w-full">
                <TabsList className="w-full md:w-auto bg-slate-100 p-1 rounded-xl mb-6">
                    <TabsTrigger value="run" className="rounded-lg px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Calculator className="h-4 w-4 mr-2"/> Run Payroll
                    </TabsTrigger>
                    <TabsTrigger value="history" className="rounded-lg px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <History className="h-4 w-4 mr-2"/> History
                    </TabsTrigger>
                    <TabsTrigger value="remittance" className="rounded-lg px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <ShieldCheck className="h-4 w-4 mr-2"/> Remittance
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="rounded-lg px-6 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Settings className="h-4 w-4 mr-2"/> Tax Config
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="run">
                    {isLoading ? (
                        <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>
                    ) : (
                        <RunPayroll staff={staff || []} config={config} />
                    )}
                </TabsContent>

                <TabsContent value="history">
                    {schoolId && <PayrollHistory schoolId={schoolId} />}
                </TabsContent>

                <TabsContent value="remittance">
                    {schoolId && <RemittanceReports schoolId={schoolId} />}
                </TabsContent>

                <TabsContent value="settings">
                    <PayrollSettingsTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
