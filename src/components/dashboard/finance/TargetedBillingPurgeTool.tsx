'use client';

import React, { useState, useMemo } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Trash2, Loader2, Search, CheckCircle2, ShieldAlert, RefreshCw, Bus as BusIcon, Utensils, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const SPRINGFIELD_SCHOOL_ID = 'oHr3BrGdK2eS5MQ5zmZU';
export const SPRINGFIELD_SCHOOL_NAME = "Mercy's Springfield Academy";

interface TargetedBillingPurgeToolProps {
  schoolId?: string;
  onPurgeComplete?: () => void;
  onClose?: () => void;
}

interface TargetRecordItem {
  id: string;
  studentId: string;
  studentName: string;
  classId?: string;
  type: string;
  term?: string;
  academicYear?: string;
  description?: string;
  billedAmount: number;
  amountPaid: number;
  balance: number;
  status?: string;
}

export function TargetedBillingPurgeTool({ 
  schoolId = SPRINGFIELD_SCHOOL_ID, 
  onPurgeComplete,
  onClose 
}: TargetedBillingPurgeToolProps) {
  const firestore = useFirestore();
  const { toast } = useToast();

  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(schoolId || SPRINGFIELD_SCHOOL_ID);
  const [selectedTerm, setSelectedTerm] = useState<string>('Third Term');
  const [includeCanteen, setIncludeCanteen] = useState<boolean>(true);
  const [includeTransport, setIncludeTransport] = useState<boolean>(true);
  const [skipPaidRecords, setSkipPaidRecords] = useState<boolean>(false);

  const [isScanning, setIsScanning] = useState(false);
  const [scannedRecords, setScannedRecords] = useState<TargetRecordItem[] | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const [confirmInput, setConfirmInput] = useState('');
  const [isPurging, setIsPurging] = useState(false);
  const [purgeProgress, setPurgeProgress] = useState<{ current: number; total: number } | null>(null);

  // 1. Scan & Preview matching records
  const handleScanRecords = async () => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore connection not ready.' });
      return;
    }

    setIsScanning(true);
    setScannedRecords(null);

    try {
      // Query all financial records for the target school
      const q = query(
        collection(firestore, 'financialRecords'),
        where('schoolId', '==', selectedSchoolId)
      );

      const snap = await getDocs(q);
      const matches: TargetRecordItem[] = [];

      snap.docs.forEach((docSnap) => {
        const data = docSnap.data();
        const type = data.type || '';
        const term = data.term || data.academicTerm || '';
        const desc = data.description || '';
        const combined = `${type} ${term} ${desc}`.toLowerCase();

        // Check fee item criteria: Canteen vs Transport
        const isCanteen = combined.includes('canteen');
        const isTransport = combined.includes('transport') || combined.includes('bus');

        if (!((includeCanteen && isCanteen) || (includeTransport && isTransport))) {
          return;
        }

        // Check term criteria: Third Term / Term 3 / 3rd Term
        const targetTermLower = selectedTerm.toLowerCase();
        const isTermMatch = combined.includes(targetTermLower) || 
                            combined.includes('third') || 
                            combined.includes('term 3') || 
                            combined.includes('3rd');

        if (!isTermMatch) {
          return;
        }

        const billed = Number(data.billedAmount || 0);
        const paid = Number(data.amountPaid || 0);
        const waiver = Number(data.waiverAmount || 0);
        const balance = billed - paid - waiver;

        if (skipPaidRecords && paid > 0) {
          return;
        }

        matches.push({
          id: docSnap.id,
          studentId: data.studentId || '',
          studentName: data.studentName || 'Unknown Student',
          classId: data.classId,
          type: data.type || 'Custom Bill',
          term: data.term || data.academicTerm || selectedTerm,
          academicYear: data.academicYear,
          description: data.description,
          billedAmount: billed,
          amountPaid: paid,
          balance: balance,
          status: data.status || 'Unpaid'
        });
      });

      setScannedRecords(matches);

      toast({
        title: `Scan Complete`,
        description: `Found ${matches.length} matching Third Term Canteen & Transport bills for Springfield.`
      });
    } catch (err: any) {
      console.error("Scan error:", err);
      toast({
        variant: 'destructive',
        title: "Scan Failed",
        description: err.message || "Failed to scan financial records."
      });
    } finally {
      setIsScanning(false);
    }
  };

  // 2. Perform safe, chunked deletion of matching records
  const handleExecutePurge = async () => {
    if (!firestore || !scannedRecords || scannedRecords.length === 0) return;
    if (confirmInput.trim().toUpperCase() !== 'PURGE SPRINGFIELD') {
      toast({
        variant: 'destructive',
        title: 'Confirmation Mismatch',
        description: 'Please type "PURGE SPRINGFIELD" exactly to confirm.'
      });
      return;
    }

    setIsPurging(true);
    setPurgeProgress({ current: 0, total: scannedRecords.length });

    try {
      const batchSize = 400; // Under Firestore 500-doc limit
      let deletedCount = 0;

      for (let i = 0; i < scannedRecords.length; i += batchSize) {
        const chunk = scannedRecords.slice(i, i + batchSize);
        const batch = writeBatch(firestore);

        chunk.forEach((item) => {
          const docRef = doc(firestore, 'financialRecords', item.id);
          batch.delete(docRef);
        });

        await batch.commit();
        deletedCount += chunk.length;
        setPurgeProgress({ current: deletedCount, total: scannedRecords.length });
      }

      toast({
        title: 'Purge Successful',
        description: `Successfully deleted ${deletedCount} Third Term Canteen & Transport bills for Springfield.`
      });

      setScannedRecords([]);
      setConfirmInput('');
      if (onPurgeComplete) onPurgeComplete();
    } catch (err: any) {
      console.error("Purge error:", err);
      toast({
        variant: 'destructive',
        title: 'Deletion Interrupted',
        description: err.message || 'Failed during batch deletion.'
      });
    } finally {
      setIsPurging(false);
      setPurgeProgress(null);
    }
  };

  // Filter scanned records for the display table
  const displayedRecords = useMemo(() => {
    if (!scannedRecords) return [];
    if (!searchFilter.trim()) return scannedRecords;
    const filter = searchFilter.toLowerCase();
    return scannedRecords.filter(r => 
      r.studentName.toLowerCase().includes(filter) ||
      r.studentId.toLowerCase().includes(filter) ||
      r.type.toLowerCase().includes(filter) ||
      (r.classId && r.classId.toLowerCase().includes(filter)) ||
      r.id.toLowerCase().includes(filter)
    );
  }, [scannedRecords, searchFilter]);

  const summaryStats = useMemo(() => {
    if (!scannedRecords) return { totalCount: 0, totalBilled: 0, totalPaid: 0, totalBalance: 0, paidCount: 0 };
    return scannedRecords.reduce((acc, r) => {
      acc.totalCount += 1;
      acc.totalBilled += r.billedAmount;
      acc.totalPaid += r.amountPaid;
      acc.totalBalance += r.balance;
      if (r.amountPaid > 0) acc.paidCount += 1;
      return acc;
    }, { totalCount: 0, totalBilled: 0, totalPaid: 0, totalBalance: 0, paidCount: 0 });
  }, [scannedRecords]);

  return (
    <Card className="border-2 border-rose-300 bg-rose-50/30 shadow-xl overflow-hidden animate-in fade-in-50 duration-200">
      <CardHeader className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl">
              <Trash2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Targeted Bill Purge Engine
              </CardTitle>
              <CardDescription className="text-rose-100 font-semibold text-xs sm:text-sm mt-0.5">
                Surgically purge Transport and Canteen billing for the Third Term without affecting Tuition or other terms.
              </CardDescription>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              Close
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Safety Alert Banner */}
        <div className="bg-amber-50 border-2 border-amber-300 p-3.5 rounded-2xl flex items-start gap-3 text-amber-900 shadow-xs">
          <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-extrabold text-amber-950">Safe Scoped Deletion Guarantee:</p>
            <p className="font-medium text-amber-800">
              This tool <strong className="underline">ONLY</strong> deletes Third Term bills categorized as <strong>Canteen</strong> or <strong>Transport</strong> for Springfield ({SPRINGFIELD_SCHOOL_NAME}). Tuition fees, general levies, admission bills, First/Second Term records, and student profiles will remain completely intact.
            </p>
          </div>
        </div>

        {/* 1. Target Configuration Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-2xl border border-rose-200 shadow-xs">
          <div>
            <Label className="text-xs font-bold text-slate-700">Target School</Label>
            <div className="mt-1 font-black text-sm text-rose-700 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 truncate">
              {SPRINGFIELD_SCHOOL_NAME}
            </div>
          </div>

          <div>
            <Label className="text-xs font-bold text-slate-700">Target Academic Term</Label>
            <div className="mt-1 font-black text-sm text-slate-800 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
              Third Term (Term 3)
            </div>
          </div>

          <div className="sm:col-span-2 flex flex-wrap items-center gap-4 pt-4 sm:pt-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox 
                checked={includeCanteen} 
                onCheckedChange={(c) => setIncludeCanteen(!!c)} 
              />
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-green-600" /> Canteen Bills
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox 
                checked={includeTransport} 
                onCheckedChange={(c) => setIncludeTransport(!!c)} 
              />
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <BusIcon className="w-3.5 h-3.5 text-amber-600" /> Transport Bills
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox 
                checked={skipPaidRecords} 
                onCheckedChange={(c) => setSkipPaidRecords(!!c)} 
              />
              <span className="text-xs font-bold text-slate-600">
                Skip bills with recorded payments
              </span>
            </label>
          </div>
        </div>

        {/* Action Button: Scan / Preview (Dry Run) */}
        <div className="flex justify-center">
          <Button
            onClick={handleScanRecords}
            disabled={isScanning || isPurging || (!includeCanteen && !includeTransport)}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md flex items-center gap-2 active:scale-95 transition-all"
          >
            {isScanning ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Scanning Springfield Database...</>
            ) : (
              <><Search className="w-4 h-4" /> Scan & Preview Target Bills (Dry Run)</>
            )}
          </Button>
        </div>

        {/* 2. Scan Results & Preview Table */}
        {scannedRecords !== null && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Metric Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-black uppercase text-slate-400">Total Targeted Bills</span>
                <p className="text-xl font-black text-rose-600 mt-0.5">{summaryStats.totalCount}</p>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-black uppercase text-slate-400">Total Billed Amount</span>
                <p className="text-xl font-black text-slate-800 mt-0.5">GH₵{summaryStats.totalBilled.toFixed(2)}</p>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-black uppercase text-slate-400">Total Recorded Paid</span>
                <p className="text-xl font-black text-emerald-600 mt-0.5">GH₵{summaryStats.totalPaid.toFixed(2)}</p>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-black uppercase text-slate-400">Bills with Payments</span>
                <p className={cn("text-xl font-black mt-0.5", summaryStats.paidCount > 0 ? "text-amber-600" : "text-slate-700")}>
                  {summaryStats.paidCount}
                </p>
              </div>
            </div>

            {summaryStats.paidCount > 0 && (
              <div className="bg-rose-100 border border-rose-300 p-3 rounded-xl flex items-center gap-2 text-xs text-rose-900 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Notice: {summaryStats.paidCount} of the targeted bills have existing payment transactions recorded. Deleting them will clear these invoices.</span>
              </div>
            )}

            {/* Table Search & Record Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between gap-3">
                <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">
                  Preview of Identified Records ({displayedRecords.length})
                </h4>
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <Input 
                    placeholder="Search student or type..." 
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="h-8 pl-8 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0">
                    <TableRow>
                      <TableHead className="text-[11px] font-bold">Student Name</TableHead>
                      <TableHead className="text-[11px] font-bold">Bill Type</TableHead>
                      <TableHead className="text-[11px] font-bold">Term / Description</TableHead>
                      <TableHead className="text-[11px] font-bold text-right">Billed</TableHead>
                      <TableHead className="text-[11px] font-bold text-right">Paid</TableHead>
                      <TableHead className="text-[11px] font-bold text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6 text-xs text-slate-400">
                          {scannedRecords.length === 0 
                            ? "No matching Third Term Canteen or Transport bills found for Springfield."
                            : "No records match search filter."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedRecords.map((rec) => (
                        <TableRow key={rec.id} className="hover:bg-rose-50/30">
                          <TableCell className="font-bold text-xs text-slate-800">
                            {rec.studentName}
                            <span className="block text-[10px] font-mono text-slate-400">{rec.studentId}</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              "text-[10px] font-extrabold",
                              rec.type.toLowerCase().includes('canteen') ? "border-green-300 text-green-700 bg-green-50" : "border-amber-300 text-amber-700 bg-amber-50"
                            )}>
                              {rec.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-slate-600 truncate max-w-[200px]" title={rec.description}>
                            {rec.description || rec.term}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs font-bold text-slate-900">
                            GH₵{rec.billedAmount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-xs text-emerald-600 font-bold">
                            GH₵{rec.amountPaid.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={rec.status === 'Paid' ? 'default' : 'secondary'} className="text-[9px] font-bold">
                              {rec.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 3. Execution Confirmation Guard */}
            {scannedRecords.length > 0 && (
              <div className="bg-red-50/80 border-2 border-red-300 p-4 sm:p-5 rounded-2xl space-y-4">
                <div>
                  <Label htmlFor="confirm-purge-input" className="text-xs font-black uppercase text-red-900 tracking-wider">
                    Confirm Permanent Deletion:
                  </Label>
                  <p className="text-xs text-red-700 mt-0.5">
                    Type <strong className="font-mono bg-white px-1.5 py-0.5 rounded border border-red-300 text-red-950 font-bold">PURGE SPRINGFIELD</strong> below to permanently delete the {scannedRecords.length} identified bills.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Input
                    id="confirm-purge-input"
                    value={confirmInput}
                    onChange={(e) => setConfirmInput(e.target.value)}
                    placeholder="Type PURGE SPRINGFIELD here"
                    className="bg-white border-red-300 focus:ring-red-500 font-bold"
                    autoComplete="off"
                    disabled={isPurging}
                  />

                  <Button
                    variant="destructive"
                    disabled={isPurging || confirmInput.trim().toUpperCase() !== 'PURGE SPRINGFIELD'}
                    onClick={handleExecutePurge}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-black text-sm shadow-md bg-red-600 hover:bg-red-700 active:scale-95 shrink-0"
                  >
                    {isPurging ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Deleting {purgeProgress?.current || 0} of {purgeProgress?.total}...</>
                    ) : (
                      <><Trash2 className="w-4 h-4 mr-2" /> Purge {scannedRecords.length} Third Term Bills</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
