
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { Assessment } from '@/lib/types';

// --- HELPER: Grading Logic ---
function getGrade(percentage: number) {
    if (percentage >= 80) return { grade: 'A', remark: 'Excellent' };
    if (percentage >= 70) return { grade: 'B', remark: 'Very Good' };
    if (percentage >= 60) return { grade: 'C', remark: 'Good' };
    if (percentage >= 50) return { grade: 'D', remark: 'Pass' };
    return { grade: 'F', remark: 'Fail' };
}

// --- STYLES (Plain Objects to prevent crash) ---
const styles = {
    page: { flexDirection: 'column' as const, backgroundColor: '#FFFFFF', padding: 30, fontFamily: 'Helvetica' },
    header: { marginBottom: 20, textAlign: 'center' as const, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 10 },
    schoolName: { fontSize: 24, fontWeight: 'bold' as const, marginBottom: 5, textTransform: 'uppercase' as const },
    subHeader: { fontSize: 10, color: 'grey', marginBottom: 5 },
    reportTitle: { fontSize: 16, fontWeight: 'bold' as const, marginTop: 10, textDecoration: 'underline' as const },
    
    infoContainer: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, marginBottom: 20, fontSize: 11 },
    infoCol: { flexDirection: 'column' as const, gap: 4 },
    infoRow: { flexDirection: 'row' as const },
    label: { fontWeight: 'bold' as const, width: 80 },
    value: { },

    table: { width: 'auto', borderStyle: 'solid' as const, borderWidth: 1, borderColor: '#bfbfbf', borderRightWidth: 0, borderBottomWidth: 0 },
    tableRow: { margin: 'auto', flexDirection: 'row' as const },
    tableHeaderRow: { margin: 'auto', flexDirection: 'row' as const, backgroundColor: '#f0f0f0' },
    tableCol: { borderStyle: 'solid' as const, borderWidth: 1, borderColor: '#bfbfbf', borderLeftWidth: 0, borderTopWidth: 0 },
    tableCellHeader: { margin: 5, fontSize: 10, fontWeight: 'bold' as const },
    tableCell: { margin: 5, fontSize: 10 },

    summary: { marginTop: 30, padding: 15, borderWidth: 1, borderColor: '#000', borderStyle: 'dashed' as const },
    summaryRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, marginBottom: 5, fontSize: 11 },
    
    footer: { position: 'absolute' as const, bottom: 30, left: 30, right: 30, fontSize: 9, textAlign: 'center' as const, color: 'grey' }
};

// --- PDF DOCUMENT COMPONENT ---
// Defined outside to keep it pure and avoid closure issues during PDF generation
const ReportCardDocument = ({ student, assessments, year, term, rank, totalStudents, subjects, schoolProfile, pdfComponents }: any) => {
    // Destructure the components passed from the parent (Document, Page, etc.)
    const { Document, Page, Text, View, Image } = pdfComponents;

    // Data Processing
    const subjectMap = subjects?.reduce((acc: any, s: any) => {
        acc[s.id] = s.name || s.title;
        return acc;
    }, {}) || {};

    const reportData = Object.values(assessments.reduce((acc: any, curr: Assessment) => {
        if (curr.studentId !== student.uid) return acc;
        
        const subId = curr.subjectId || 'unknown';
        const name = subjectMap[subId] || (curr as any).subjectName || 'Unknown Subject';

        if (!acc[subId]) {
            acc[subId] = { id: subId, name, total: 0, max: 0 };
        }
        acc[subId].total += curr.score || 0;
        acc[subId].max += curr.maxScore || 0;
        return acc;
    }, {})).map((item: any) => {
        const pct = item.max > 0 ? (item.total / item.max) * 100 : 0;
        return { ...item, pct, ...getGrade(pct) };
    });

    const average = reportData.length > 0 
        ? reportData.reduce((sum: number, i: any) => sum + i.pct, 0) / reportData.length 
        : 0;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {schoolProfile?.logoUrl && (
                        <Image 
                            src={schoolProfile.logoUrl} 
                            style={{ width: 50, height: 50, alignSelf: 'center', marginBottom: 10 }} 
                        />
                    )}
                    <Text style={styles.schoolName}>{schoolProfile?.name || "Sunnyside International School"}</Text>
                    <Text style={styles.subHeader}>
                        {schoolProfile?.address || "Address: N/A"} • {schoolProfile?.phone || "Phone: N/A"}
                    </Text>
                     <Text style={styles.subHeader}>{schoolProfile?.motto || "Excellence • Integrity • Service"}</Text>
                    <Text style={styles.reportTitle}>TERMINAL REPORT CARD</Text>
                </View>

                <View style={styles.infoContainer}>
                    <View style={styles.infoCol}>
                        <View style={styles.infoRow}><Text style={styles.label}>Name:</Text><Text style={styles.value}>{student.firstName} {student.lastName}</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>Student ID:</Text><Text style={styles.value}>{student.id.slice(0, 8).toUpperCase()}</Text></View>
                    </View>
                    <View style={styles.infoCol}>
                        <View style={styles.infoRow}><Text style={styles.label}>Year:</Text><Text style={styles.value}>{year}</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>Term:</Text><Text style={styles.value}>{term}</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>Class:</Text><Text style={styles.value}>{student.classId || 'N/A'}</Text></View>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableHeaderRow}>
                        <View style={{...styles.tableCol, width: '40%'}}><Text style={styles.tableCellHeader}>Subject</Text></View>
                        <View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableCellHeader}>Score</Text></View>
                        <View style={{...styles.tableCol, width: '15%'}}><Text style={styles.tableCellHeader}>Grade</Text></View>
                        <View style={{...styles.tableCol, width: '25%'}}><Text style={styles.tableCellHeader}>Remark</Text></View>
                    </View>
                    {reportData.map((row: any, i: number) => (
                        <View key={i} style={styles.tableRow}>
                            <View style={{...styles.tableCol, width: '40%'}}><Text style={styles.tableCell}>{row.name}</Text></View>
                            <View style={{...styles.tableCol, width: '20%'}}><Text style={styles.tableCell}>{row.pct.toFixed(1)}%</Text></View>
                            <View style={{...styles.tableCol, width: '15%'}}><Text style={styles.tableCell}>{row.grade}</Text></View>
                            <View style={{...styles.tableCol, width: '25%'}}><Text style={styles.tableCell}>{row.remark}</Text></View>
                        </View>
                    ))}
                    {reportData.length === 0 && (
                        <View style={styles.tableRow}>
                            <View style={{...styles.tableCol, width: '100%'}}><Text style={{...styles.tableCell, textAlign: 'center', padding: 10}}>No grades recorded.</Text></View>
                        </View>
                    )}
                </View>

                <View style={styles.summary}>
                    <View style={styles.summaryRow}><Text>Average:</Text><Text style={{fontWeight: 'bold'}}>{average.toFixed(2)}%</Text></View>
                    <View style={styles.summaryRow}><Text>Rank:</Text><Text style={{fontWeight: 'bold'}}>{rank} / {totalStudents}</Text></View>
                    <View style={{...styles.summaryRow, marginTop: 10}}><Text>Principal&apos;s Remark:</Text><Text style={{fontStyle: 'italic'}}>{getGrade(average).remark}</Text></View>
                </View>

                <View style={{flexDirection: 'row', marginTop: 40, justifyContent: 'space-between', paddingHorizontal: 20}}>
                    <View style={{borderTopWidth: 1, width: 150, alignItems: 'center'}}><Text style={{fontSize: 9, marginTop: 5}}>Class Teacher</Text></View>
                    <View style={{borderTopWidth: 1, width: 150, alignItems: 'center'}}><Text style={{fontSize: 9, marginTop: 5}}>Principal</Text></View>
                </View>

                <Text style={styles.footer}>Generated via Sunnyside SIS • {format(new Date(), 'PPP')}</Text>
            </Page>
        </Document>
    );
};

// --- EXPORTED CLIENT BUTTON ---
export function GenerateReportCard(props: any) {
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        try {
            // 1. Import PDF Library On-Demand
            // @ts-ignore
            const pdfLib = await import('@react-pdf/renderer');
            const { pdf, Document, Page, Text, View, Image } = pdfLib;

            // 2. Generate Blob
            // We pass the library components down as props so the Document uses the same instance
            const pdfComponents = { Document, Page, Text, View, Image };
            
            const docElement = (
                <ReportCardDocument 
                    {...props} 
                    pdfComponents={pdfComponents} 
                />
            );

            const blob = await pdf(docElement).toBlob();
            
            // 3. Force Download
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Report_${props.student.firstName}_${props.student.lastName}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("PDF Error:", error);
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

