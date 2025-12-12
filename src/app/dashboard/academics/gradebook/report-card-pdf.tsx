'use client';

import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

// --- TEMPORARY PLACEHOLDER ---
// The PDF generation logic is commented out/removed to test system stability.
export function GenerateReportCard(props: any) {
    
    const handleDownload = () => {
        alert("PDF Generation is temporarily disabled for testing. Please check back later.");
    };

    return (
        <Button 
            variant="outline" 
            className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50" 
            onClick={handleDownload}
        >
            <FileDown className="mr-2 h-4 w-4"/>
            Download Report Card (Maintenance)
        </Button>
    );
}
