
'use client';

import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Receipt, Download, Loader2, Printer } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { FinancialRecord, Student, PaymentTransaction } from '@/lib/types';
import { PaymentReceipt } from './payment-receipt';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Skeleton } from '@/components/ui/skeleton';

interface GenerateReceiptProps {
    transaction: FinancialRecord;
    payment: PaymentTransaction;
    variant?: 'icon' | 'full';
}


export function GenerateReceipt({ transaction, payment, variant = 'icon' }: GenerateReceiptProps) {
    const [loading, setLoading] = useState(false);
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const printRef = useRef<HTMLDivElement>(null);

    // FETCH BRANDING FROM PUBLIC PATH
    const schoolProfileRef = useMemoFirebase(
        () => (firestore && schoolId ? doc(firestore, 'schoolSettings', schoolId) : null),
        [firestore, schoolId]
    );
    const { data: schoolProfile, isLoading: isLoadingProfile } = useDoc(schoolProfileRef);

    const studentRef = useMemoFirebase(
        () => (firestore && transaction.studentId ? doc(firestore, 'students', transaction.studentId) : null),
        [firestore, transaction.studentId]
    );
    const { data: student, isLoading: isLoadingStudent } = useDoc<Student>(studentRef);

    const isLoadingData = isLoadingProfile || isLoadingStudent;

    const handleDownloadPdf = async () => {
        if (!printRef.current || !student) return;
        setLoading(true);

        try {
            const element = printRef.current;
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF('p', 'mm', 'a5'); // A5 is smaller, better for receipts
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
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
                
                <div className="max-h-[70vh] overflow-y-auto bg-slate-100 p-4">
                    {isLoadingData ? (
                        <div className="space-y-4">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-48 w-full" />
                        </div>
                    ) : (
                         <div ref={printRef}>
                            {student && <PaymentReceipt transaction={transaction} payment={payment} student={student} schoolProfile={schoolProfile} />}
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
