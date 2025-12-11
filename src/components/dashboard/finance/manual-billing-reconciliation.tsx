'use client';

import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, Loader2, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface MissingBillItem {
    id: string; // unique key for the row
    studentId: string;
    studentName: string;
    classId: string;
    type: 'Canteen' | 'Transport';
    amount: number;
    reason: string; // "Attended but no Canteen bill"
}

export function ManualBillingReconciliation() {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [date, setDate] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [missingBills, setMissingBills] = useState<MissingBillItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]); // IDs of items to process

    const handleCheck = async () => {
        if (!firestore) return;
        setIsLoading(true);
        setMissingBills([]);
        setSelectedItems([]);

        try {
            // 1. Get Rates
            const canteenSnap = await getDoc(doc(firestore, 'schoolSettings', 'canteen'));
            const transportSnap = await getDoc(doc(firestore, 'schoolSettings', 'transport'));
            const canteenRate = canteenSnap.exists() ? Number(canteenSnap.data().dailyRate) : 0;
            const transportRate = transportSnap.exists() ? Number(transportSnap.data().dailyRate) : 0;

            const dateStr = format(date, 'yyyy-MM-dd');
            const searchDate = date; 
            searchDate.setHours(0,0,0,0); // Start of day normalization

            // 2. Get Attendance (Who was present?)
            const attendanceQ = query(
                collection(firestore, 'attendance'),
                where('date', '==', searchDate),
                where('status', 'in', ['Present', 'Late'])
            );
            const attendanceSnap = await getDocs(attendanceQ);
            
            // 3. Get Existing Bills for this Date (Who already paid?)
            // Note: This relies on the ID naming convention or querying by date
            // Querying by date is safer if IDs change manually
            const billsQ = query(
                collection(firestore, 'financialRecords'),
                where('dueDate', '==', searchDate) // Assuming dueDate = attendance date
            );
            const billsSnap = await getDocs(billsQ);
            const existingBillIds = new Set(billsSnap.docs.map(d => d.id));

            const detectedMissing: MissingBillItem[] = [];

            // 4. Compare
            for (const attDoc of attendanceSnap.docs) {
                const att = attDoc.data();
                
                // Check Canteen
                const canteenBillId = `canteen-${att.studentId}-${dateStr}`;
                if (canteenRate > 0 && !existingBillIds.has(canteenBillId)) {
                    detectedMissing.push({
                        id: canteenBillId,
                        studentId: att.studentId,
                        studentName: att.studentName || 'Unknown',
                        classId: att.classId,
                        type: 'Canteen',
                        amount: canteenRate,
                        reason: 'Present but no Canteen Fee found'
                    });
                }

                // Check Transport
                // We need to know if they use the bus. 
                // Option A: Check 'usesBusService' on attendance record (if you added it previously)
                // Option B: Fetch student profile (slower but accurate)
                // Let's rely on the attendance record if available, or fetch student if missing
                let usesBus = att.usesBusService === "true" || att.usesBusService === true;
                
                if (transportRate > 0 && usesBus) {
                    const transportBillId = `transport-${att.studentId}-${dateStr}`;
                    if (!existingBillIds.has(transportBillId)) {
                        detectedMissing.push({
                            id: transportBillId,
                            studentId: att.studentId,
                            studentName: att.studentName || 'Unknown',
                            classId: att.classId,
                            type: 'Transport',
                            amount: transportRate,
                            reason: 'Bus User Present but no Transport Fee found'
                        });
                    }
                }
            }

            setMissingBills(detectedMissing);
            if (detectedMissing.length === 0) {
                toast({ title: "All Clear", description: "No missing bills found for this date." });
            }

        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Error", description: "Failed to scan records." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleProcess = async () => {
        if (!firestore || selectedItems.length === 0) return;
        setIsLoading(true);
        const batch = writeBatch(firestore);
        
        const itemsToProcess = missingBills.filter(item => selectedItems.includes(item.id));
        
        itemsToProcess.forEach(item => {
            const ref = doc(firestore, 'financialRecords', item.id);
            batch.set(ref, {
                billedAmount: item.amount,
                studentId: item.studentId,
                studentName: item.studentName,
                classId: item.classId,
                type: item.type === 'Canteen' ? 'Canteen Fee' : 'Transport Fee',
                description: `${item.type} fee for ${format(date, 'PPP')} (Manual Fix)`,
                status: 'Unpaid',
                dueDate: date,
                createdAt: serverTimestamp(),
                amountPaid: 0,
            });
        });

        try {
            await batch.commit();
            toast({ title: "Success", description: `Generated ${itemsToProcess.length} missing bills.` });
            setMissingBills(prev => prev.filter(p => !selectedItems.includes(p.id)));
            setSelectedItems([]);
        } catch (e) {
            toast({ variant: 'destructive', title: "Error", description: "Failed to create bills." });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === missingBills.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(missingBills.map(m => m.id));
        }
    };

    return (
        <Card className="mt-6 border-orange-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                    <AlertCircle className="h-5 w-5"/> Missing Bill Detector
                </CardTitle>
                <CardDescription>
                    Scan a specific date to find students who attended school but were not billed correctly.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                
                {/* Controls */}
                <div className="flex gap-4 items-end">
                    <div className="space-y-2">
                        <Label>Select Date to Audit</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button onClick={handleCheck} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>}
                        Scan for Errors
                    </Button>
                </div>

                {/* Results Table */}
                {missingBills.length > 0 && (
                    <div className="border rounded-lg p-4 space-y-4">
                         <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-orange-800">Found {missingBills.length} Missing Bills</h4>
                            <Button size="sm" onClick={handleProcess} disabled={isLoading || selectedItems.length === 0}>
                                Generate {selectedItems.length} Bills
                            </Button>
                        </div>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">
                                        <Checkbox 
                                            checked={selectedItems.length === missingBills.length && missingBills.length > 0}
                                            onCheckedChange={toggleSelectAll}
                                        />
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
                                        <TableCell>{bill.studentName}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${bill.type === 'Canteen' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
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