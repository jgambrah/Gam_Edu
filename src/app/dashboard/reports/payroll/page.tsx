
'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, where, getDocs, doc, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Printer, Landmark, Download, FileSpreadsheet } from 'lucide-react';
import { PayrollRecord } from '@/lib/types';
import Link from 'next/link';
import { PayslipDialog } from '../../payroll/payslip-dialog';
import { useCurrentSchool } from '@/hooks/use-current-school';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PayrollReportsPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { toast } = useToast();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

    const today = new Date();
    const defaultPeriod = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const [period, setPeriod] = useState(defaultPeriod);
    const [fetchedRecords, setFetchedRecords] = useState<PayrollRecord[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);
    const [activeTab, setActiveTab] = useState<'summary' | 'remittance'>('summary');
    const [selectedDeductionId, setSelectedDeductionId] = useState<string>('');
    const [isExportingPDF, setIsExportingPDF] = useState(false);

    const schoolProfileRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    const canAccess = ['Administrator', 'Director', 'Accountant'].includes(role || '');

    const handleFetchRecords = async () => {
        if (!firestore || !schoolId) return;
        setIsFetching(true);
        setFetchedRecords([]); // Clear previous results
        try {
            const recordsQuery = query(
                collection(firestore, 'payrollRecords'), 
                where('schoolId', '==', schoolId),
                where('period', '==', period)
            );
            const querySnapshot = await getDocs(recordsQuery);
            const records = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PayrollRecord[];
            setFetchedRecords(records);
            if (records.length > 0) {
                toast({ title: 'Success', description: `Fetched ${records.length} records for ${period}.`});
            } else {
                toast({ title: 'No Records', description: `No payroll records found for ${period}.`});
            }
        } catch(e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch records.' });
        } finally {
            setIsFetching(false);
        }
    };
    
    const summary = useMemo(() => {
        if (!fetchedRecords || fetchedRecords.length === 0) {
            return { gross: 0, deductions: 0, net: 0 };
        }
        return fetchedRecords.reduce((acc, rec) => {
            acc.gross += rec.grossSalary || 0;
            acc.deductions += rec.totalDeductions || 0;
            acc.net += rec.netSalary || 0;
            return acc;
        }, { gross: 0, deductions: 0, net: 0 });
    }, [fetchedRecords]);

    const availableDeductions = useMemo(() => {
        const list = [
            { id: 'statutory-paye', name: 'PAYE (Tax)', type: 'statutory' },
            { id: 'statutory-ssnit-employee', name: 'SSNIT (Employee Contribution)', type: 'statutory' },
            { id: 'statutory-ssnit-employer', name: 'SSNIT (Employer Contribution)', type: 'statutory' },
        ];
        
        const voluntaryNames = new Set<string>();
        fetchedRecords.forEach(rec => {
            (rec.deductions || []).forEach(d => {
                if (d.name && d.name.trim() !== '') {
                    voluntaryNames.add(d.name.trim());
                }
            });
        });
        
        voluntaryNames.forEach(name => {
            list.push({ id: `voluntary-${name}`, name, type: 'voluntary' });
        });
        
        return list;
    }, [fetchedRecords]);

    const remittanceData = useMemo(() => {
        if (!selectedDeductionId) return [];
        
        const selected = availableDeductions.find(d => d.id === selectedDeductionId);
        if (!selected) return [];
        
        return fetchedRecords.map(rec => {
            let amount = 0;
            if (selected.id === 'statutory-paye') {
                amount = rec.statutory?.paye || 0;
            } else if (selected.id === 'statutory-ssnit-employee') {
                amount = rec.statutory?.ssnitEmployee || 0;
            } else if (selected.id === 'statutory-ssnit-employer') {
                amount = rec.statutory?.ssnitEmployer || 0;
            } else {
                const match = (rec.deductions || []).find(d => d.name === selected.name);
                amount = match ? match.amount : 0;
            }
            
            return {
                staffName: rec.staffName,
                ssnitNumber: rec.ssnitNumber || 'N/A',
                tinNumber: rec.tinNumber || 'N/A',
                basicSalary: rec.basicSalary || 0,
                grossSalary: rec.grossSalary || 0,
                deductionAmount: amount
            };
        }).filter(row => row.deductionAmount > 0);
    }, [fetchedRecords, selectedDeductionId, availableDeductions]);

    const remittanceSummary = useMemo(() => {
        return remittanceData.reduce((acc, row) => {
            acc.basic += row.basicSalary;
            acc.gross += row.grossSalary;
            acc.deduction += row.deductionAmount;
            return acc;
        }, { basic: 0, gross: 0, deduction: 0 });
    }, [remittanceData]);

    const handleExportCSV = () => {
        if (remittanceData.length === 0) return;
        const selected = availableDeductions.find(d => d.id === selectedDeductionId);
        const title = selected ? selected.name : 'Payroll Remittance';
        
        const headers = ["Staff Name", "SSNIT Number", "TIN Number", "Basic Salary (GH₵)", "Gross Salary (GH₵)", "Deduction Amount (GH₵)"];
        const rows = remittanceData.map(row => [
            `"${row.staffName.replace(/"/g, '""')}"`,
            row.ssnitNumber,
            row.tinNumber,
            row.basicSalary,
            row.grossSalary,
            row.deductionAmount
        ]);
        
        const schoolHeader = [
            [`"${schoolProfile?.name || 'School Name'}"`],
            [`"${schoolProfile?.address || 'Address'}"`],
            [`"Payroll Deduction Remittance Report: ${title} (${period})"`],
            [],
            headers
        ];
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + [...schoolHeader, ...rows].map(e => e.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Payroll_Remittance_${title.replace(/\s+/g, '_')}_${period}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({ title: 'Exported', description: 'CSV file successfully downloaded.' });
    };

    const handleDownloadPDF = async () => {
        const element = document.getElementById('remittance-report-printable');
        if (!element) return;
        
        setIsExportingPDF(true);
        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            const selected = availableDeductions.find(d => d.id === selectedDeductionId);
            const title = selected ? selected.name : 'Deductions';
            pdf.save(`Remittance_Report_${title.replace(/\s+/g, '_')}_${period}.pdf`);
            toast({ title: "Report Downloaded" });
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: "Export Failed" });
        } finally {
            setIsExportingPDF(false);
        }
    };

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
                    <h1 className="text-3xl font-bold flex items-center gap-2"><Landmark /> Payroll Reports</h1>
                    <p className="text-muted-foreground">Review and analyze historical payroll data.</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline"><Link href="/dashboard/reports/academics">Academics</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/enrollment">Enrollment</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/attendance">Attendance</Link></Button>
                    <Button asChild variant="outline"><Link href="/dashboard/reports/financials">Financials</Link></Button>
                    <Button onClick={() => window.print()}><Printer className="mr-2"/>Print</Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                    <CardDescription>Select a pay period to generate a report.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} className="w-fit" />
                    <Button onClick={handleFetchRecords} disabled={isFetching || isLoadingSchool}>
                        {(isFetching || isLoadingSchool) && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>} Fetch Records
                    </Button>
                </CardContent>
            </Card>
            
            {isFetching ? (
                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-slate-100"><Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600"/></div>
            ) : fetchedRecords.length > 0 ? (
                <div className="space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex bg-slate-100 p-1 rounded-xl gap-1 w-fit border border-slate-200/50 print:hidden">
                        <button
                            type="button"
                            onClick={() => setActiveTab('summary')}
                            className={`rounded-lg font-bold text-xs h-9 px-4 flex items-center transition-all ${
                                activeTab === 'summary' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            <FileText className="mr-2 h-3.5 w-3.5" /> Payroll Summary
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('remittance')}
                            className={`rounded-lg font-bold text-xs h-9 px-4 flex items-center transition-all ${
                                activeTab === 'remittance' ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            <Landmark className="mr-2 h-3.5 w-3.5" /> Deduction Remittances
                        </button>
                    </div>

                    {activeTab === 'summary' ? (
                        <>
                            <div className="grid gap-4 md:grid-cols-3">
                                <Card className="border-none shadow-md rounded-2xl p-4 bg-white">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Gross Salary</p>
                                    <p className="text-2xl font-black text-slate-950 mt-1">GH₵{summary.gross.toFixed(2)}</p>
                                </Card>
                                <Card className="border-none shadow-md rounded-2xl p-4 bg-white">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Deductions</p>
                                    <p className="text-2xl font-black text-rose-600 mt-1">GH₵{summary.deductions.toFixed(2)}</p>
                                </Card>
                                <Card className="border-none shadow-md rounded-2xl p-4 bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-100/30">
                                    <p className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Total Net Payout</p>
                                    <p className="text-2xl font-black text-indigo-700 mt-1">GH₵{summary.net.toFixed(2)}</p>
                                </Card>
                            </div>
                            
                            <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
                                <CardHeader className="bg-slate-50 border-b border-slate-100">
                                    <CardTitle className="text-slate-800 font-bold text-lg">Payroll Summary Records ({period})</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow>
                                                <TableHead>Staff Name</TableHead>
                                                <TableHead>Gross Salary</TableHead>
                                                <TableHead>Deductions</TableHead>
                                                <TableHead>Net Salary</TableHead>
                                                <TableHead className="text-right print:hidden">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {fetchedRecords.map(rec => (
                                                <TableRow key={rec.id} className="hover:bg-slate-50 transition-colors">
                                                    <TableCell className="font-semibold text-slate-800">{rec.staffName}</TableCell>
                                                    <TableCell className="font-mono text-slate-600">GH₵{(rec.grossSalary || 0).toFixed(2)}</TableCell>
                                                    <TableCell className="font-mono text-rose-600">GH₵{(rec.totalDeductions || 0).toFixed(2)}</TableCell>
                                                    <TableCell className="font-mono font-bold text-indigo-700">GH₵{(rec.netSalary || 0).toFixed(2)}</TableCell>
                                                    <TableCell className="text-right print:hidden">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline" size="sm" onClick={() => setSelectedPayslip(rec)} className="rounded-xl font-bold">View Payslip</Button>
                                                            </DialogTrigger>
                                                            {selectedPayslip && selectedPayslip.id === rec.id && (
                                                                <PayslipDialog payslip={selectedPayslip} />
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
                    ) : (
                        /* Deduction Remittances Report Tab */
                        <div className="space-y-6">
                            {/* Controls card */}
                            <Card className="border-none shadow-md bg-white rounded-2xl p-4 print:hidden">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-center gap-2 flex-1 w-full">
                                        <Label className="font-bold text-xs uppercase tracking-wider text-slate-400 shrink-0">Deduction Type:</Label>
                                        <Select value={selectedDeductionId} onValueChange={setSelectedDeductionId}>
                                            <SelectTrigger className="flex-1 max-w-[280px] bg-slate-50 border-slate-100 rounded-xl font-medium text-slate-700">
                                                <SelectValue placeholder="Select deduction..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableDeductions.map(d => (
                                                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <Button
                                            onClick={handleExportCSV}
                                            disabled={remittanceData.length === 0}
                                            variant="outline"
                                            className="rounded-xl h-11 font-bold border-slate-200 text-slate-700 hover:bg-slate-50 flex-1 md:flex-none"
                                        >
                                            <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Export CSV
                                        </Button>
                                        <Button
                                            onClick={handleDownloadPDF}
                                            disabled={remittanceData.length === 0 || isExportingPDF}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 font-bold flex-1 md:flex-none"
                                        >
                                            {isExportingPDF ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Download className="mr-2 h-4 w-4" />}
                                            Save PDF
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            {selectedDeductionId ? (
                                remittanceData.length > 0 ? (
                                    /* Branded Report Preview Card */
                                    <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden p-8" id="remittance-report-printable">
                                        {/* School/Tenant Header */}
                                        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
                                            <div className="flex items-center gap-4">
                                                {schoolProfile?.logoUrl ? (
                                                    <img src={schoolProfile.logoUrl} className="h-16 w-16 object-contain" alt="Logo" />
                                                ) : (
                                                    <Landmark className="h-16 w-16 text-indigo-600" />
                                                )}
                                                <div>
                                                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">{schoolProfile?.name || 'SCHOOL NAME'}</h2>
                                                    <p className="text-xs text-slate-500 font-medium">{schoolProfile?.address || 'ADDRESS'}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{schoolProfile?.phone || ''} {schoolProfile?.email ? `· ${schoolProfile.email}` : ''}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest leading-none">Remittance Report</h3>
                                                <p className="text-xs font-black text-indigo-600 mt-1 uppercase tracking-wider">
                                                    {availableDeductions.find(d => d.id === selectedDeductionId)?.name || ''}
                                                </p>
                                                <p className="text-[10px] font-bold text-slate-500 mt-0.5">Period: {period}</p>
                                            </div>
                                        </div>

                                        {/* Table of staff deductions */}
                                        <Table className="text-sm">
                                            <TableHeader className="bg-slate-905 text-white hover:bg-slate-905">
                                                <TableRow className="bg-slate-900 text-white hover:bg-slate-900">
                                                    <TableHead className="text-white font-bold rounded-tl-xl">Staff Name</TableHead>
                                                    <TableHead className="text-white font-bold">SSNIT Number</TableHead>
                                                    <TableHead className="text-white font-bold">TIN Number</TableHead>
                                                    <TableHead className="text-right text-white font-bold">Basic Salary</TableHead>
                                                    <TableHead className="text-right text-white font-bold">Gross Salary</TableHead>
                                                    <TableHead className="text-right text-white font-bold rounded-tr-xl">Deduction Amt</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody className="border-x border-b rounded-b-xl overflow-hidden">
                                                {remittanceData.map((row, idx) => (
                                                    <TableRow key={idx} className="hover:bg-slate-50 transition-colors border-b">
                                                        <TableCell className="font-semibold text-slate-800">{row.staffName}</TableCell>
                                                        <TableCell className="font-mono text-xs text-slate-500">{row.ssnitNumber}</TableCell>
                                                        <TableCell className="font-mono text-xs text-slate-500">{row.tinNumber}</TableCell>
                                                        <TableCell className="text-right font-mono">GH₵{row.basicSalary.toFixed(2)}</TableCell>
                                                        <TableCell className="text-right font-mono">GH₵{row.grossSalary.toFixed(2)}</TableCell>
                                                        <TableCell className="text-right font-mono font-bold text-rose-600">GH₵{row.deductionAmount.toFixed(2)}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {/* Totals Summary Row */}
                                                <TableRow className="bg-indigo-50 font-black text-indigo-950 border-t-2 border-indigo-200">
                                                    <TableCell colSpan={3} className="text-base uppercase">Total Remittance Payout</TableCell>
                                                    <TableCell className="text-right font-mono text-xs">GH₵{remittanceSummary.basic.toFixed(2)}</TableCell>
                                                    <TableCell className="text-right font-mono text-xs">GH₵{remittanceSummary.gross.toFixed(2)}</TableCell>
                                                    <TableCell className="text-right font-mono text-lg text-rose-700">GH₵{remittanceSummary.deduction.toFixed(2)}</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>

                                        {/* Signatures block */}
                                        <div className="grid grid-cols-2 gap-8 mt-16 pt-8 border-t border-dashed">
                                            <div className="text-center">
                                                <div className="border-b border-black h-8 mb-2"></div>
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Finance Accountant</p>
                                                <p className="text-[8px] font-bold text-slate-500">Prepared & Approved By</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="border-b border-black h-8 mb-2"></div>
                                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">School Director</p>
                                                <p className="text-[8px] font-bold text-slate-500">Vetted & Authorized Official</p>
                                            </div>
                                        </div>
                                    </Card>
                                ) : (
                                    <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-slate-100 text-slate-400">
                                        <Landmark className="h-12 w-12 mx-auto mb-4 opacity-20"/>
                                        <p className="font-bold uppercase tracking-widest text-xs">No payroll deductions matching this type in {period}.</p>
                                    </div>
                                )
                            ) : (
                                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-slate-100 text-slate-400">
                                    <Landmark className="h-12 w-12 mx-auto mb-4 opacity-20"/>
                                    <p className="font-bold uppercase tracking-widest text-xs">Select a deduction type above to generate the report.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                 !isFetching && <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-slate-100 text-slate-400"><p className="text-slate-400 font-bold uppercase tracking-wider text-xs">Please select a period and click "Fetch Records".</p></div>
            )}
             <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    #report-content, #report-content * {
                        visibility: visible !important;
                    }
                    #remittance-report-printable, #remittance-report-printable * {
                        visibility: visible !important;
                    }
                    #report-content {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                    }
                }
             `}</style>
        </div>
    );
}
