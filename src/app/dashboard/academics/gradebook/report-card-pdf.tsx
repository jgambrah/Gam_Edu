'use client';

import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { HTMLReportCard } from './HTMLReportCard'; 
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';

export function GenerateReportCard(props: any) {
    const [loading, setLoading] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);
    const firestore = useFirestore();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

    const schoolProfileRef = useMemoFirebase(
        () => (firestore && schoolId ? doc(firestore, 'schools', schoolId) : null),
        [firestore, schoolId]
    );
    const { data: schoolProfile, isLoading: isLoadingProfile } = useDoc(schoolProfileRef);
    
    const isReady = !isLoadingProfile && !isLoadingSchool;

    const handleDownloadPdf = async () => {
        if (!printRef.current || !isReady) return;
        setLoading(true);

        try {
            const element = printRef.current;
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgWidth / imgHeight;
            const width = pdfWidth;
            const height = width / ratio;

            pdf.addImage(imgData, 'PNG', 0, 0, width, height);
            pdf.save(`Report_${props.student.firstName}_${props.student.lastName}.pdf`);
        } catch (error) {
            console.error('PDF Generation Failed:', error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button 
                variant="outline" 
                className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50" 
                disabled={loading || !isReady || !props.student}
                onClick={handleDownloadPdf}
            >
                {loading || !isReady ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDown className="mr-2 h-4 w-4"/>}
                {loading ? 'Generating...' : (isReady ? 'Download Report Card' : 'Loading Data...')}
            </Button>

            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                <div ref={printRef}>
                    <HTMLReportCard {...props} schoolProfile={schoolProfile} />
                </div>
            </div>
        </>
    );
}
