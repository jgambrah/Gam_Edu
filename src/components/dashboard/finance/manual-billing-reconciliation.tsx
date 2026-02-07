'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { format, startOfDay } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, Loader2, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface MissingBillItem {
    id: string; // Unique ID (e.g. canteen-studentID-date)
    studentId: string;
    studentName: string;
    classId: string;
    type: 'Canteen' | 'Transport';
    amount: number;
    reason: string;
}

export function ManualBillingReconciliation({ schoolId }: { schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [date, setDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [isFixing, setIsFixing] = useState(false);
    const [missingBills, setMissingBills] = useState<MissingBillItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]); 

    // --- 1. SCAN LOGIC ---
    const handleCheck = async () => {
        if (!firestore || !schoolId) return;
        setIsLoading(true);
        setMissingBills([]);
        setSelectedItems([]);

        try {
            // A. Fetch Rates
            const canteenSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId, 'rates', 'canteen'));
            const transportSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId, 'rates', 'transport'));
            const canteenRate = canteenSnap.exists() ? Number(canteenSnap.data().dailyRate) : 0;
            const transportRate = transportSnap.exists() ? Number(transportSnap.data().dailyRate) : 0;

            const dateStr = format(date, 'yyyy-MM-dd');
            const searchDate = startOfDay(date); 

            console.log(`Scanning for missing bills on ${dateStr}... Rates: Canteen=${canteenRate}, Transport=${transportRate}`);

            // B. Get Attendance (Who was present?)
            const attendanceQ = query(
                collection(firestore, 'attendance'),
                where('schoolId', '==', schoolId),
                where('date', '==', searchDate),
                where('status', 'in', ['Present', 'Late'])
            );
            const attendanceSnap = await getDocs(attendanceQ);
            
            if (attendanceSnap.empty) {
                toast({ title: "No Attendance Found", description: "No students were marked Present/Late on this date." });
                setIsLoading(false);
                return;
            }

            // C. Get Existing Bills (Who already has a bill?)
            const billsQ = query(
                collection(firestore, 'financialRecords'),
                where('schoolId', '==', schoolId),
                where('dueDate', '==', searchDate) 
            );
            const billsSnap = await getDocs(billsQ);
            const existingBillIds = new Set(billsSnap.docs.map(d => d.id));

            const detectedMissing: MissingBillItem[] = [];

            // D. Compare
            let missingCounter = 0; // To ensure unique keys
            for (const attDoc of attendanceSnap.docs) {
                const att = attDoc.data();
                const studentName = att.studentName || "Unknown Student";
                
                // 1. Check Canteen Gap
                if (canteenRate > 0 && att.usesCanteen !== "false") {
                    const expectedCanteenId = `canteen-${att.studentId}-${dateStr}`;
                    
                    if (!existingBillIds.has(expectedCanteenId)) {
                        detectedMissing.push({
                            id: `${expectedCanteenId}-${missingCounter++}`,
                            studentId: att.studentId,
                            studentName: studentName,
                            classId: att.classId,
                            type: 'Canteen',
                            amount: canteenRate,
                            reason: 'Marked Present but no Canteen Bill found'
                        });
                    }
                }

                // 2. Check Transport Gap
                const usesBus = att.usesBusService === "true" || att.usesBusService === true;
                
                if (transportRate > 0 && usesBus) {
                    const expectedTransportId = `transport-${att.studentId}-${dateStr}`;
                    if (!existingBillIds.has(expectedTransportId)) {
                        detectedMissing.push({
                            id: `${expectedTransportId}-${missingCounter++}`,
                            studentId: att.studentId,
                            studentName: studentName,
                            classId: att.classId,
                            type: 'Transport',
                            amount: transportRate,
                            reason: 'Bus User Present but no Transport Bill found'
                        });
                    }
                }
            }

            setMissingBills(detectedMissing);
            setSelectedItems(detectedMissing.map(m => m.id)); // Auto-select all

            if (detectedMissing.length === 0) {
                toast({ title: "All Clean ✅", description: "No missing bills found for this date." });
            } else {
                toast({ title: "Issues Found", description: `Found ${detectedMissing.length} students missing bills.` });
            }

        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: "Scan Failed", description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    // --- 2. FIX LOGIC ---
    const handleProcess = async () => {
        if (!firestore || !schoolId) return;
        setIsFixing(true);
        const batch = writeBatch(firestore);
        
        const itemsToProcess = missingBills.filter(item => selectedItems.includes(item.id));
        
        itemsToProcess.forEach(item => {
            const cleanId = item.id.substring(0, item.id.lastIndexOf('-'));
            const ref = doc(firestore, 'financialRecords', cleanId);
            batch.set(ref, {
                billedAmount: item.amount,
                studentId: item.studentId,
                studentName: item.studentName,
                classId: item.classId,
                type: item.type === 'Canteen' ? 'Canteen Fee' : 'Transport Fee',
                description: `${item.type} fee for ${format(date, 'PPP')} (Manual Fix)`,
                status: 'Unpaid',
                dueDate: startOfDay(date),
                createdAt: serverTimestamp(),
                amountPaid: 0,
                schoolId: schoolId,
            });
        });

        try {
            await batch.commit();
            toast({ title: "Fixed!", description: `Generated ${itemsToProcess.length} invoices.` });
            setMissingBills(prev => prev.filter(p => !selectedItems.includes(p.id)));
            setSelectedItems([]);
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Error", description: e.message });
        } finally {
            setIsFixing(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === missingBills.length) setSelectedItems([]);
        else setSelectedItems(missingBills.map(m => m.id));
    };

    return (
        <Card className="mt-8 border-orange-200 bg-orange-50/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                    <AlertCircle className="h-5 w-5"/> Missing Bill Detector
                </CardTitle>
                <CardDescription>
                    Scan a specific date to find students who attended school but were not billed correctly due to system errors.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* CONTROLS */}
                <div className="flex flex-col sm:flex-row gap-4 items-end bg-white p-4 rounded-lg border">
                    <div className="space-y-2 flex-1 w-full">
                        <Label>Select Date to Audit</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button onClick={handleCheck} disabled={isLoading} className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>}
                        Scan for Errors
                    </Button>
                </div>

                {/* RESULTS */}
                {missingBills.length > 0 && (
                    <div className="border rounded-md bg-white overflow-hidden shadow-sm">
                        <div className="p-3 bg-orange-100 border-b flex justify-between items-center">
                            <h4 className="font-bold text-orange-800 text-sm flex items-center gap-2">
                                <AlertCircle className="h-4 w-4"/> Found {missingBills.length} Missing Bills
                            </h4>
                            <Button size="sm" onClick={handleProcess} disabled={isFixing || selectedItems.length === 0} className="bg-orange-600 hover:bg-orange-700">
                                {isFixing ? <Loader2 className="h-3 w-3 animate-spin mr-2"/> : <CheckCircle2 className="h-3 w-3 mr-2"/>}
                                Fix Selected ({selectedItems.length})
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox checked={selectedItems.length === missingBills.length && missingBills.length > 0} onCheckedChange={toggleSelectAll} />
                                    </TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Missing Fee</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Reason</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {missingBills.map((bill) => (
                                    <TableRow key={bill.id}>
                                        <TableCell>
                                            <Checkbox 
                                                checked={selectedItems.includes(bill.id)}
                                                onCheckedChange={(checked) => {
                                                    if(checked) setSelectedItems([...selectedItems, bill.id]);
                                                    else setSelectedItems(selectedItems.filter(id => id !== bill.id));
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{bill.studentName}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-bold border ${bill.type === 'Canteen' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                                {bill.type}
                                            </span>
                                        </TableCell>
                                        <TableCell>GH₵{bill.amount.toFixed(2)}</TableCell>
                                        <TableCell className="text-muted-foreground text-xs">{bill.reason}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
