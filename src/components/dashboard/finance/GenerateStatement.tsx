'use client';

import { useState, useEffect } from 'react';
import { buildStatementPdf } from '@/lib/statement-pdf';
import { formatStudentId } from '@/lib/student-utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Download, Loader2, Printer, Share2 } from 'lucide-react';
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

    const fileName = student
        ? `Statement_${student.firstName}_${student.lastName}.pdf`.replace(/\s+/g, '_')
        : 'Statement.pdf';

    // Builds a real text PDF (not a screenshot): sharp, searchable, small, and paginated between rows.
    const makePdf = () => {
        if (!student) return null;
        const contactLine = [schoolProfile?.phone, schoolProfile?.email, schoolProfile?.website || schoolProfile?.schoolWebsite]
            .filter(Boolean)
            .join(' | ');
        return buildStatementPdf({
            studentName: `${student.firstName || ''} ${student.lastName || ''}`.trim(),
            studentCode: formatStudentId(student),
            records,
            payments: payments || [],
            dateRange,
            closingBalance: summary.balance,
            school: {
                name: schoolProfile?.name,
                motto: schoolProfile?.motto,
                address: schoolProfile?.address,
                contactLine,
                logoDataUrl: logoBase64 || undefined,
                primaryColor: schoolProfile?.brandColor,
                secondaryColor: schoolProfile?.secondaryColor,
            },
        });
    };

    const runPdfAction = async (action: 'download' | 'print' | 'share') => {
        if (!student) return;
        setLoading(true);
        try {
            const pdf = makePdf();
            if (!pdf) return;

            if (action === 'download') {
                pdf.save(fileName);
                return;
            }

            if (action === 'print') {
                pdf.autoPrint();
                const url = pdf.output('bloburl') as unknown as string;
                const win = window.open(url, '_blank');
                if (!win) pdf.save(fileName); // pop-up blocked: fall back to download
                return;
            }

            // share: use the phone's share sheet (WhatsApp, email, ...) when the browser supports files
            const blob = pdf.output('blob');
            const file = new File([blob], fileName, { type: 'application/pdf' });
            const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean };
            if (nav.share && nav.canShare?.({ files: [file] })) {
                try {
                    await nav.share({ files: [file], title: 'Student Financial Statement' });
                } catch (err: any) {
                    if (err?.name !== 'AbortError') throw err; // user closing the share sheet is not an error
                }
            } else {
                pdf.save(fileName);
            }
        } catch (error) {
            console.error('PDF Generation Failed:', error);
            alert('Failed to generate PDF. Please try again.');
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
                         <div>
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

                <div className="flex flex-wrap justify-end gap-2">
                    <Button variant="outline" onClick={() => runPdfAction('share')} disabled={loading || isLoadingData}>
                        <Share2 className="mr-2 h-4 w-4"/> Share
                    </Button>
                    <Button variant="outline" onClick={() => runPdfAction('print')} disabled={loading || isLoadingData}>
                        <Printer className="mr-2 h-4 w-4"/> Print
                    </Button>
                    <Button onClick={() => runPdfAction('download')} disabled={loading || isLoadingData} className="bg-indigo-600 hover:bg-indigo-700">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
                        {loading ? 'Generating...' : 'Download PDF'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}