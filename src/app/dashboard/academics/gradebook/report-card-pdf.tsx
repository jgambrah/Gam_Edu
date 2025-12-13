'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { HTMLReportCard } from './HTMLReportCard'; // Import the visual component

export function GenerateReportCard(props: any) {
    const [loading, setLoading] = useState(false);
    
    // We render the report card into this invisible container to capture it
    const printRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = async () => {
        if (!printRef.current) return;
        setLoading(true);

        try {
            // 1. Capture the HTML element
            const element = printRef.current;
            
            // Wait a split second to ensure fonts/images are rendered
            await new Promise(resolve => setTimeout(resolve, 100));

            const canvas = await html2canvas(element, {
                scale: 2, // Higher scale for better quality
                useCORS: true, // Allow loading images from Firebase Storage
                logging: false,
                backgroundColor: '#ffffff'
            });

            // 2. Convert to Image
            const imgData = canvas.toDataURL('image/png');

            // 3. Create PDF (A4 size)
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Calculate height to maintain aspect ratio
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = imgWidth / imgHeight;
            const width = pdfWidth;
            const height = width / ratio;

            // 4. Add Image to PDF
            pdf.addImage(imgData, 'PNG', 0, 0, width, height);

            // 5. Save
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
            {/* The Trigger Button */}
            <Button 
                variant="outline" 
                className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50" 
                disabled={loading || !props.student}
                onClick={handleDownloadPdf}
            >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDown className="mr-2 h-4 w-4"/>}
                {loading ? 'Generating...' : 'Download Report Card'}
            </Button>

            {/* The Invisible Report Card (Rendered off-screen) */}
            <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
                <div ref={printRef}>
                    <HTMLReportCard {...props} />
                </div>
            </div>
        </>
    );
}
