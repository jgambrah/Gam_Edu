'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Receipt, Download, Loader2, Printer } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { doc, query, collection, where } from 'firebase/firestore';
import { FinancialRecord, Student, PaymentTransaction } from '@/lib/types';
import { PaymentReceipt } from './payment-receipt';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Skeleton } from '@/components/ui/skeleton';

// Helper to get base64
async function getBase64ImageFromUrl(imageUrl: string): Promise<string> {
    try {
        const fetchUrl = imageUrl.startsWith('https://firebasestorage.googleapis.com')
            ? `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
            : imageUrl;

        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error: any) {
        console.error("❌ getBase64ImageFromUrl failed:", error.message);
        return "";
    }
}

interface GenerateReceiptProps {
    transaction: FinancialRecord;
    payment: PaymentTransaction;
    variant?: 'icon' | 'full';
}


export function GenerateReceipt({ transaction, payment, variant = 'icon' }: GenerateReceiptProps) {
    const [loading, setLoading] = useState(false);
    const [logoBase64, setLogoBase64] = useState<string>('');
    const [layoutStyle, setLayoutStyle] = useState<'standard' | 'plain' | 'thermal'>('standard');
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const printRef = useRef<HTMLDivElement>(null);

    // FETCH BRANDING FROM PUBLIC PATH
    const schoolProfileRef = useMemoFirebase(
        () => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null,
        [firestore, schoolId]
    );
    const { data: schoolProfile, isLoading: isLoadingProfile } = useDoc(schoolProfileRef);

    const studentRef = useMemoFirebase(
        () => (firestore && transaction.studentId) ? doc(firestore, 'students', transaction.studentId) : null,
        [firestore, transaction.studentId]
    );
    const { data: student, isLoading: isLoadingStudent } = useDoc<Student>(studentRef);

    // NEW: Fetch all records for the student to calculate total balance
    const allRecordsQuery = useMemoFirebase(() => 
        (firestore && transaction.studentId && schoolId) ? 
        query(collection(firestore, 'financialRecords'), 
              where('schoolId', '==', schoolId),
              where('studentId', '==', transaction.studentId)) : null,
        [firestore, transaction.studentId, schoolId]
    );
    const { data: allRecords, isLoading: isLoadingAllRecords } = useCollection<FinancialRecord>(allRecordsQuery);

    const totalBalance = useMemo(() => {
        if (!allRecords) return 0;
        return allRecords.reduce((acc, r) => {
            // Skip pending reversals in balance calculation
            if (r.status === 'Pending Reversal') return acc;
            return acc + (r.billedAmount - (r.amountPaid || 0) - (r.waiverAmount || 0));
        }, 0);
    }, [allRecords]);

    // Convert logo to base64 when profile is loaded
    useEffect(() => {
        if (schoolProfile?.logoUrl) {
            getBase64ImageFromUrl(schoolProfile.logoUrl).then(setLogoBase64);
        }
    }, [schoolProfile]);

    const isLoadingData = isLoadingProfile || isLoadingStudent || isLoadingAllRecords;

    const handleDownloadPdf = async () => {
        if (!printRef.current || !student) return;
        setLoading(true);

        try {
            const element = printRef.current;
            const rect = element.getBoundingClientRect();
            
            const canvas = await html2canvas(element, { 
                scale: 2, 
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                width: rect.width,
                height: rect.height,
                scrollX: window.scrollX,
                scrollY: window.scrollY,
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY
            });
            const imgData = canvas.toDataURL('image/png');
            
            const isThermal = layoutStyle === 'thermal';
            const width = isThermal ? 80 : 148;
            
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const aspect = canvasHeight / canvasWidth;
            const height = width * aspect;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: [width, height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, width, height);
            pdf.save(`Receipt_${student.firstName}_${student.lastName}_${transaction.id.slice(0,6)}.pdf`);
        } catch (error) {
            console.error('PDF Generation Failed:', error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    
    const triggerButton = variant === 'icon' ? (
        <Button variant="ghost" size="icon" className="h-7 w-7"><Printer className="h-4 w-4 text-blue-600"/></Button>
    ) : (
        <Button variant="outline" className="w-full">
            <Printer className="mr-2 h-4 w-4"/> Download Receipt
        </Button>
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                {triggerButton}
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Receipt Preview</DialogTitle>
                    <DialogDescription>Review the receipt below before downloading.</DialogDescription>
                </DialogHeader>

                <div className="mb-2">
                    <Tabs value={layoutStyle} onValueChange={(val: any) => setLayoutStyle(val)} className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1 rounded-xl">
                            <TabsTrigger value="standard" className="text-xs font-bold uppercase tracking-wider rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-650 transition-all">
                                Standard A5 (Color)
                            </TabsTrigger>
                            <TabsTrigger value="plain" className="text-xs font-bold uppercase tracking-wider rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-650 transition-all">
                                Minimalist A5 (B&W)
                            </TabsTrigger>
                            <TabsTrigger value="thermal" className="text-xs font-bold uppercase tracking-wider rounded-lg data-[state=active]:bg-white data-[state=active]:text-indigo-650 transition-all">
                                Thermal Till (80mm)
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                
                <div className="max-h-[75vh] overflow-y-auto bg-slate-100/80 p-6 rounded-2xl border border-slate-100">
                    {isLoadingData ? (
                        <div className="space-y-4 w-full">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-48 w-full" />
                        </div>
                    ) : (
                         <div ref={printRef} className="shadow-lg bg-white rounded-xl overflow-hidden mx-auto w-fit">
                            {student && (
                                <PaymentReceipt 
                                    transaction={transaction} 
                                    payment={payment} 
                                    student={student} 
                                    schoolProfile={{...schoolProfile, logoBase64}}
                                    totalBalance={totalBalance}
                                    isThermal={layoutStyle === 'thermal'}
                                    isPlainA5={layoutStyle === 'plain'}
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleDownloadPdf} disabled={loading || isLoadingData} className="bg-indigo-600 hover:bg-indigo-700">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
                        {loading ? 'Generating...' : 'Download PDF'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
