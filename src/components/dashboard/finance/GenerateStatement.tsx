'use client';

import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Download, Loader2, Printer } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, collection, getDocs } from 'firebase/firestore';
import { FinancialRecord, Student } from '@/lib/types';
import { StatementDocument } from './StatementDocument';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Skeleton } from '@/components/ui/skeleton';
import { DateRange } from 'react-day-picker';

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

interface GenerateStatementProps {
    student?: Student;
    records: FinancialRecord[];
    dateRange?: DateRange;
    summary: { // This is now the OVERALL summary
        totalBilled: number;
        totalPaid: number;
        balance: number;
    };
}

export function GenerateStatement({ student, records, dateRange, summary }: GenerateStatementProps) {
    const [loading, setLoading] = useState(false);
    const [logoBase64, setLogoBase64] = useState<string>('');
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const printRef = useRef<HTMLDivElement>(null);

    // FETCH BRANDING FROM PUBLIC PATH
    const schoolProfileRef = useMemoFirebase(
        () => (firestore && schoolId ? doc(firestore, 'schoolSettings', schoolId) : null),
        [firestore, schoolId]
    );
    const { data: schoolProfile, isLoading: isLoadingProfile } = useDoc(schoolProfileRef);

    // FETCH STUDENT PAYMENTS BY SUBCOLLECTIONS OF BILLS TO PREVENT INDEX & PERMISSION ERRORS
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoadingPayments, setIsLoadingPayments] = useState(false);

    useEffect(() => {
        if (!firestore || !records || records.length === 0) {
            setPayments([]);
            return;
        }

        let active = true;
        setIsLoadingPayments(true);

        const fetchAllSubcollectionPayments = async () => {
            try {
                const promises = records.map(async (rec) => {
                    if (!rec.id) return [];
                    const q = collection(firestore, 'financialRecords', rec.id, 'payments');
                    const snap = await getDocs(q);
                    return snap.docs.map(d => ({
                        ...d.data(),
                        id: d.id,
                        recordId: rec.id
                    }));
                });
                const results = await Promise.all(promises);
                if (active) {
                    setPayments(results.flat());
                }
            } catch (err) {
                console.error("Failed to load subcollection payments:", err);
            } finally {
                if (active) {
                    setIsLoadingPayments(false);
                }
            }
        };

        fetchAllSubcollectionPayments();
        return () => {
            active = false;
        };
    }, [firestore, records]);

    // Convert logo to base64 when profile is loaded
    useEffect(() => {
        if (schoolProfile?.logoUrl) {
            getBase64ImageFromUrl(schoolProfile.logoUrl).then(setLogoBase64);
        }
    }, [schoolProfile]);

    const isLoadingData = isLoadingProfile || isLoadingPayments;

    const handleDownloadPdf = async () => {
        if (!printRef.current || !student) return;
        setLoading(true);

        try {
            const element = printRef.current;
            const liveRect = element.getBoundingClientRect();
            const cssWidth = Math.ceil(liveRect.width);
            const liveHeight = Math.max(element.scrollHeight, Math.ceil(liveRect.height));

            // Keep the bitmap small: 1.5x is sharp enough for A4 text; shrink for very long statements so the
            // canvas stays under the ~16M pixel limit of mobile/Safari browsers (a bigger canvas silently
            // truncates the bottom of the page - i.e. the final balance).
            const scale = Math.max(0.8, Math.min(1.5, Math.sqrt(16_000_000 / (cssWidth * liveHeight))));

            // Row / block bottoms are measured inside html2canvas's own clone, so they match the rendered
            // bitmap exactly even if the clone lays out slightly differently from the live preview.
            let breakPoints: number[] = [];
            const canvas = await html2canvas(element, {
                scale,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: cssWidth,
                onclone: (_doc, clonedEl) => {
                    const top = clonedEl.getBoundingClientRect().top;
                    breakPoints = Array.from(clonedEl.querySelectorAll('tr, [data-pdf-keep]'))
                        .map(n => n.getBoundingClientRect().bottom - top)
                        .filter(b => b > 0)
                        .sort((a, b) => a - b);
                },
            });
            const ratio = canvas.width / cssWidth; // canvas px per CSS px
            // The bitmap itself is the source of truth for total height, so the last page can never be dropped.
            const cssHeight = canvas.height / ratio;

            // A4 page height expressed in CSS px (page width = element width).
            const pageCssHeight = Math.floor((cssWidth * 297) / 210);

            const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4', compress: true });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            let start = 0;
            let pageIndex = 0;
            while (start < cssHeight - 1) {
                const limit = start + pageCssHeight;
                let end = limit;
                if (limit >= cssHeight) {
                    end = cssHeight;
                } else {
                    const candidates = breakPoints.filter(b => b > start + pageCssHeight * 0.5 && b <= limit);
                    if (candidates.length > 0) end = candidates[candidates.length - 1];
                }

                const sliceCssHeight = end - start;
                const sliceCanvas = document.createElement('canvas');
                sliceCanvas.width = canvas.width;
                sliceCanvas.height = Math.max(1, Math.min(canvas.height - Math.round(start * ratio), Math.round(sliceCssHeight * ratio)));
                const ctx = sliceCanvas.getContext('2d');
                if (!ctx) throw new Error('Canvas context unavailable');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
                ctx.drawImage(
                    canvas,
                    0, Math.round(start * ratio), canvas.width, sliceCanvas.height,
                    0, 0, sliceCanvas.width, sliceCanvas.height
                );

                if (pageIndex > 0) pdf.addPage();
                const sliceMmHeight = Math.min(pdfHeight, (sliceCssHeight * pdfWidth) / cssWidth);
                pdf.addImage(sliceCanvas.toDataURL('image/jpeg', 0.85), 'JPEG', 0, 0, pdfWidth, sliceMmHeight, undefined, 'FAST');

                sliceCanvas.width = 0; // release memory
                sliceCanvas.height = 0;
                start = end;
                pageIndex++;
            }
            canvas.width = 0;
            canvas.height = 0;

            pdf.save(`Statement_${student.firstName}_${student.lastName}.pdf`);
        } catch (error) {
            console.error('PDF Generation Failed:', error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                    <Printer className="mr-2 h-4 w-4"/> Download Statement
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Statement Preview</DialogTitle>
                    <DialogDescription>Review the statement below before downloading.</DialogDescription>
                </DialogHeader>
                
                <div className="max-h-[70vh] overflow-y-auto bg-slate-100 p-4">
                    {isLoadingData ? (
                        <div className="space-y-4">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-48 w-full" />
                        </div>
                    ) : (
                         <div ref={printRef}>
                            <StatementDocument 
                                student={student}
                                records={records}
                                payments={payments || []}
                                dateRange={dateRange}
                                summary={summary}
                                schoolProfile={{...schoolProfile, logoBase64}}
                            />
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