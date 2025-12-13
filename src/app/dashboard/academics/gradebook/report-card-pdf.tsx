'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';

export function GenerateReportCard(props: any) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            // 1. Dynamic Import of Library
            const { pdf } = await import('@react-pdf/renderer');
            
            // 2. Dynamic Import of the Document Component (The file we just created)
            const { ReportDocument } = await import('./ReportDocument');

            // 3. Generate Blob
            const blob = await pdf(<ReportDocument {...props} />).toBlob();
            
            // 4. Force Download
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
            alert("Could not generate PDF. Please try again.");
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
