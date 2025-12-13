'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { ReportDocument } from './ReportDocument'; 
import type { Assessment } from '@/lib/types';


export function GenerateReportCard(props: any) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            // 1. Import PDF Library On-Demand
            const { pdf } = await import('@react-pdf/renderer');
            
            // 2. Construct the document element
            const docElement = (
                <ReportDocument {...props} />
            );

            // 3. Generate Blob and Trigger Download
            const blob = await pdf(docElement).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Report_${props.student.firstName}_${props.student.lastName}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("PDF Gen Error:", error);
            alert("Failed to generate PDF. Please try again.");
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
