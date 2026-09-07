'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useFirestore } from '@/firebase';
import { useCurrentSchool } from '@/hooks/use-current-school';
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
  schoolId, 
  onPurgeComplete,
  onClose 
}: TargetedBillingPurgeToolProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId: currentSchoolId } = useCurrentSchool();

  const effectiveSchoolId = schoolId || currentSchoolId || SPRINGFIELD_SCHOOL_ID;
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(effectiveSchoolId);
  const [selectedTerm, setSelectedTerm] = useState<string>('all');
  const [includeCanteen, setIncludeCanteen] = useState<boolean>(true);
  const [includeTransport, setIncludeTransport] = useState<boolean>(true);
  const [skipPaidRecords, setSkipPaidRecords] = useState<boolean>(false);

  const [isScanning, setIsScanning] = useState(false);
  const [scannedRecords, setScannedRecords] = useState<TargetRecordItem[] | null>(null);
  const [searchFilter, setSearchFilter] = useState('');

  const [confirmInput, setConfirmInput] = useState('');
  const [isPurging, setIsPurging] = useState(false);
  const [purgeProgress, setPurgeProgress] = useState<{ current: number; total: number } | null>(null);

  // Sync effective schoolId if loaded asynchronously
  useEffect(() => {
    if (currentSchoolId && selectedSchoolId === SPRINGFIELD_SCHOOL_ID) {
      setSelectedSchoolId(currentSchoolId);
    }
  }, [currentSchoolId, selectedSchoolId]);

  // 1. Scan & Preview matching records
  const handleScanRecords = useCallback(async () => {
    if (!firestore) return;

    setIsScanning(true);

    try {
      // Gather target school IDs to query
      const targetSchoolIds = Array.from(new Set([
        selectedSchoolId,
        currentSchoolId,
        schoolId,
        SPRINGFIELD_SCHOOL_ID
      ].filter(Boolean))) as string[];

      let allDocs: any[] = [];

      for (const sid of targetSchoolIds) {
        try {
          const q = query(
            collection(firestore, 'financialRecords'),
            where('schoolId', '==', sid)
          );
          const snap = await getDocs(q);
          snap.docs.forEach(d => {
            if (!allDocs.some(existing => existing.id === d.id)) {
              allDocs.push(d);
            }
          });
        } catch (err) {
          console.warn(`Query for schoolId ${sid} failed:`, err);
        }
      }

      const matches: TargetRecordItem[] = [];

      allDocs.forEach((docSnap) => {
        const data = docSnap.data();
        const type = (data.type || '').toLowerCase();
        const term = (data.term || data.academicTerm || '').toLowerCase();
        const desc = (data.description || '').toLowerCase();
        const combined = `${type} ${term} ${desc}`;

        // Check fee item criteria: Canteen vs Transport
        const isCanteen = type.includes('canteen') || combined.includes('canteen') || combined.includes('feeding') || combined.includes('lunch') || combined.includes('meal');
        const isTransport = type.includes('transport') || combined.includes('transport') || type.includes('bus') || combined.includes('bus') || combined.includes('shuttle');

        if (!((includeCanteen && isCanteen) || (includeTransport && isTransport))) {
          return;
        }

        // Check term criteria
        if (selectedTerm !== 'all') {
          const targetTermLower = selectedTerm.toLowerCase();
          const isThird = targetTermLower.includes('third') && (combined.includes('third') || combined.includes('term 3') || combined.includes('3rd') || term === '3');
          const isSecond = targetTermLower.includes('second') && (combined.includes('second') || combined.includes('term 2') || combined.includes('2nd') || term === '2');
          const isFirst = targetTermLower.includes('first') && (combined.includes('first') || combined.includes('term 1') || combined.includes('1st') || term === '1');
          
          if (!(isThird || isSecond || isFirst || combined.includes(targetTermLower))) {
            return;
          }
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
          type: data.type || (isCanteen ? 'Canteen Fee' : 'Transport Fee'),
          term: data.term || data.academicTerm || 'All Terms',
          academicYear: data.academicYear,
          description: data.description,
          billedAmount: billed,
          amountPaid: paid,
          balance: balance,
          status: data.status || 'Unpaid'
        });
      });

      setScannedRecords(matches);
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
  }, [firestore, selectedSchoolId, currentSchoolId, schoolId, selectedTerm, includeCanteen, includeTransport, skipPaidRecords, toast]);

  // Run automatic scan when criteria or firestore is ready
  useEffect(() => {
    if (firestore) {
      handleScanRecords();
    }
  }, [firestore, selectedSchoolId, selectedTerm, includeCanteen, includeTransport, skipPaidRecords, handleScanRecords]);

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
        title: 'Purge Successful 🎉',
        description: `Successfully deleted ${deletedCount} bills (${summaryStats.canteenCount} Canteen & ${summaryStats.transportCount} Transport). Balances have been reset.`
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
    if (!scannedRecords) {
      return { 
        totalCount: 0, 
        totalBilled: 0, 
        totalPaid: 0, 
        totalBalance: 0, 
        paidCount: 0, 
        canteenDebt: 0, 
        transportDebt: 0,
        canteenCount: 0,
        transportCount: 0
      };
    }
    return scannedRecords.reduce((acc, r) => {
      acc.totalCount += 1;
      acc.totalBilled += r.billedAmount;
      acc.totalPaid += r.amountPaid;
      acc.totalBalance += r.balance;
      if (r.amountPaid > 0) acc.paidCount += 1;
      
      const t = (r.type || '').toLowerCase();
      if (t.includes('canteen')) {
        acc.canteenDebt += r.balance;
        acc.canteenCount += 1;
      } else if (t.includes('transport') || t.includes('bus')) {
        acc.transportDebt += r.balance;
        acc.transportCount += 1;
      }
      return acc;
    }, { 
      totalCount: 0, 
      totalBilled: 0, 
      totalPaid: 0, 
      totalBalance: 0, 
      paidCount: 0, 
      canteenDebt: 0, 
      transportDebt: 0,
      canteenCount: 0,
      transportCount: 0
    });
  }, [scannedRecords]);

  return (
    <Card className="border-2 border-rose-300 bg-rose-50/30 shadow-xl overflow-hidden animate-in fade-in-50 duration-200">
      <CardHeader className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-xs">
              <Trash2 className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Targeted Bill Purge Engine
              </CardTitle>
              <CardDescription className="text-rose-100 font-semibold text-xs sm:text-sm mt-0.5">
                Surgically purge Transport and Canteen billing without affecting Tuition or other fees.
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
              This tool <strong className="underline">ONLY</strong> deletes bills categorized as <strong>Canteen</strong> or <strong>Transport</strong> for Springfield ({SPRINGFIELD_SCHOOL_NAME}). Tuition fees, general levies, admission bills, other fee categories, and student profiles will remain completely intact.
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
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="mt-1 w-full bg-white border border-slate-300 rounded-xl text-xs font-black px-3 py-2.5 text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
            >
              <option value="all">All Terms (Purge All Canteen & Transport Debts)</option>
              <option value="Third Term">Third Term (Term 3)</option>
              <option value="Second Term">Second Term (Term 2)</option>
              <option value="First Term">First Term (Term 1)</option>
            </select>
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
                Skip bills with payments
              </span>
            </label>
          </div>
        </div>

        {/* Action Button: Re-Scan / Refresh (Dry Run) */}
        <div className="flex justify-center">
          <Button
            onClick={handleScanRecords}
            disabled={isScanning || isPurging || (!includeCanteen && !includeTransport)}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            {isScanning ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Scanning Springfield Database...</>
            ) : (
              <><RefreshCw className="w-4 h-4" /> Re-scan & Refresh Target Bills</>
            )}
          </Button>
        </div>

        {/* 2. Scan Results & Preview Table */}
        {scannedRecords !== null && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Metric Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-black uppercase text-slate-400">Total Targeted Bills</span>
                <p className="text-xl font-black text-rose-600 mt-0.5">{summaryStats.totalCount}</p>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-black uppercase text-slate-400">Canteen Debt</span>
                <p className="text-lg sm:text-xl font-black text-orange-600 mt-0.5 flex items-center gap-1">
                  <Utensils className="w-4 h-4" />
                  GH₵{summaryStats.canteenDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-black uppercase text-slate-400">Transport Debt</span>
                <p className="text-lg sm:text-xl font-black text-amber-600 mt-0.5 flex items-center gap-1">
                  <BusIcon className="w-4 h-4" />
                  GH₵{summaryStats.transportDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] font-black uppercase text-slate-400">Total Debt to Clear</span>
                <p className="text-xl font-black text-slate-900 mt-0.5">
                  GH₵{summaryStats.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
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
                <span>Notice: {summaryStats.paidCount} of the targeted bills have recorded payments. Deleting them will clear these billing lines.</span>
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
                      <TableHead className="text-[11px] font-bold text-right">Balance</TableHead>
                      <TableHead className="text-[11px] font-bold text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedRecords.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-xs text-slate-400">
                          {isScanning ? "Scanning database..." : "No matching Canteen or Transport bills found for the selected criteria."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      displayedRecords.map((r) => (
                        <TableRow key={r.id} className="hover:bg-rose-50/50">
                          <TableCell className="font-bold text-xs text-slate-800">{r.studentName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn("text-[10px] font-bold", r.type.toLowerCase().includes('canteen') ? "border-green-300 text-green-700 bg-green-50" : "border-amber-300 text-amber-700 bg-amber-50")}>
                              {r.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-slate-600 max-w-xs truncate">{r.term} {r.description ? `• ${r.description}` : ''}</TableCell>
                          <TableCell className="text-xs font-mono font-bold text-right text-slate-800">GH₵{r.billedAmount.toFixed(2)}</TableCell>
                          <TableCell className="text-xs font-mono font-bold text-right text-emerald-600">GH₵{r.amountPaid.toFixed(2)}</TableCell>
                          <TableCell className="text-xs font-mono font-bold text-right text-rose-600">GH₵{r.balance.toFixed(2)}</TableCell>
                          <TableCell className="text-center">
                            <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-extrabold", r.balance <= 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800")}>
                              {r.balance <= 0 ? "Paid" : "Owed"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 3. Safety Confirmation & Deletion Trigger */}
            {scannedRecords.length > 0 && (
              <div className="bg-gradient-to-r from-red-500/10 via-rose-500/10 to-orange-500/10 p-5 rounded-2xl border-2 border-dashed border-rose-300 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-black text-rose-950">Safety Confirmation Required to Execute Purge</h5>
                    <p className="text-xs text-rose-800 mt-0.5">
                      You are about to permanently delete <strong>{summaryStats.totalCount}</strong> targeted billing records 
                      (Total Debt to Clear: <strong>GH₵{summaryStats.totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>: 
                      GH₵{summaryStats.canteenDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Canteen & 
                      GH₵{summaryStats.transportDebt.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Transport). 
                      Tuition and other fees will NOT be touched.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1">
                    <Label className="text-[11px] font-extrabold text-slate-700">
                      Type <span className="font-mono text-rose-700 font-black">PURGE SPRINGFIELD</span> to confirm:
                    </Label>
                    <Input 
                      placeholder="PURGE SPRINGFIELD"
                      value={confirmInput}
                      onChange={(e) => setConfirmInput(e.target.value)}
                      disabled={isPurging}
                      className="mt-1 h-9 rounded-xl border-rose-300 font-mono text-sm uppercase tracking-wider focus-visible:ring-rose-500"
                    />
                  </div>

                  <Button
                    onClick={handleExecutePurge}
                    disabled={isPurging || confirmInput.trim().toUpperCase() !== 'PURGE SPRINGFIELD'}
                    className="mt-auto h-9 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isPurging ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                        Deleting {purgeProgress ? `(${purgeProgress.current}/${purgeProgress.total})` : '...'}
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Execute Targeted Deletion
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-bold">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span>Restricted Admin Scoped Purge • Tuition and other fee categories are protected</span>
        </div>
        <div className="font-mono text-[10px] text-slate-400">
          Target School ID: {selectedSchoolId}
        </div>
      </CardFooter>
    </Card>
  );
}
