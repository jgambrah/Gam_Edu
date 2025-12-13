'use client';

import { useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { HTMLReportCard } from './HTMLReportCard';

export function GenerateReportCard(props: any) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            // Dynamically import libraries
            const html2canvas = (await import('html2canvas')).default;
            const jsPDF = (await import('jspdf')).default;

            // Create a temporary container to render the component for capturing
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            document.body.appendChild(container);

            // Render the HTML component into the offscreen container
            const reportElement = <HTMLReportCard {...props} />;
            // We use ReactDOM.render for this temporary, off-screen rendering
            await new Promise(resolve => {
                ReactDOM.render(reportElement, container, () => resolve(null));
            });

            const contentToCapture = container.firstChild as HTMLElement;
            if (!contentToCapture) throw new Error("Could not find rendered content to capture.");

            const canvas = await html2canvas(contentToCapture, {
                scale: 2, // Increase resolution
                useCORS: true, // Important for external images
                logging: false,
            });

            document.body.removeChild(container);

            // Create PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Report_${props.student.firstName}_${props.student.lastName}.pdf`);

        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("An error occurred while generating the PDF. Please check the console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button 
            variant="outline" 
            className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50" 
            disabled={loading || !props.student}
            onClick={handleDownload}
        >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDown className="mr-2 h-4 w-4"/>}
            {loading ? 'Generating...' : 'Download Report Card'}
        </Button>
    );
}
