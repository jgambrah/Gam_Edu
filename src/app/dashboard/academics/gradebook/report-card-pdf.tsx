
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Assessment } from '@/lib/types';

// Helper for Grading
function getGrade(percentage: number) {
    if (percentage >= 80) return { grade: 'A', remark: 'Excellent' };
    if (percentage >= 70) return { grade: 'B', remark: 'Very Good' };
    if (percentage >= 60) return { grade: 'C', remark: 'Good' };
    if (percentage >= 50) return { grade: 'D', remark: 'Pass' };
    return { grade: 'F', remark: 'Fail' };
}

export function GenerateReportCard(props: any) {
    const [loading, setLoading] = useState(false);

    // This function handles the entire PDF generation process
    const handleDownload = async () => {
        setLoading(true);
        try {
            // 1. Dynamically import the library only when clicked
            const pdfLib = await import('@react-pdf/renderer');
            // FIX: Use the components directly from the pdfLib object
            // const { Document, Page, Text, View, StyleSheet, Image } = pdfLib;

            // 2. Define Styles (Inside the function to avoid global scope issues)
            const styles = pdfLib.StyleSheet.create({
                page: { flexDirection: 'column', backgroundColor: '#FFFFFF', padding: 30, fontFamily: 'Helvetica' },
                header: { marginBottom: 20, textAlign: 'center', borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 10 },
                schoolName: { fontSize: 24, fontWeight: 'bold', marginBottom: 5, textTransform: 'uppercase' },
                subHeader: { fontSize: 10, color: 'grey', marginBottom: 5 },
                reportTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10, textDecoration: 'underline' },
                
                infoContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, fontSize: 11 },
                infoCol: { flexDirection: 'column', gap: 4 },
                infoRow: { flexDirection: 'row' },
                label: { fontWeight: 'bold', width: 80 },
                value: { },

                table: { width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', borderRightWidth: 0, borderBottomWidth: 0 },
                tableRow: { margin: 'auto', flexDirection: 'row' },
                tableHeaderRow: { margin: 'auto', flexDirection: 'row', backgroundColor: '#f0f0f0' },
                tableCol: { borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', borderLeftWidth: 0, borderTopWidth: 0 },
                tableCellHeader: { margin: 5, fontSize: 10, fontWeight: 'bold' },
                tableCell: { margin: 5, fontSize: 10 },

                summary: { marginTop: 30, padding: 15, borderWidth: 1, borderColor: '#000', borderStyle: 'dashed' },
                summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, fontSize: 11 },
                footer: { position: 'absolute', bottom: 30, left: 30, right: 30, fontSize: 9, textAlign: 'center', color: 'grey' }
            });

            // 3. Process Data
            const subjectMap = props.subjects?.reduce((acc: any, s: any) => {
                acc[s.id] = s.name || s.title;
                return acc;
            }, {}) || {};

            const reportData = Object.values(props.assessments.reduce((acc: any, curr: Assessment) => {
                if (curr.studentId !== props.student.uid) return acc;
                
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

            // 4. Construct the Document
            const Doc = (
                <pdfLib.Document>
                    <pdfLib.Page size="A4" style={styles.page}>
                        <pdfLib.View style={styles.header}>
                            {props.schoolProfile?.logoUrl && (
                                <pdfLib.Image 
                                    src={props.schoolProfile.logoUrl} 
                                    style={{ width: 50, height: 50, alignSelf: 'center', marginBottom: 10 }} 
                                />
                            )}
                            <pdfLib.Text style={styles.schoolName}>{props.schoolProfile?.name || "Sunnyside International School"}</pdfLib.Text>
                            <pdfLib.Text style={styles.subHeader}>
                                {props.schoolProfile?.address || "Address: N/A"} • {props.schoolProfile?.phone || "Phone: N/A"}
                            </pdfLib.Text>
                            <pdfLib.Text style={styles.subHeader}>{props.schoolProfile?.motto || "Excellence • Integrity • Service"}</pdfLib.Text>
                            <pdfLib.Text style={styles.reportTitle}>TERMINAL REPORT CARD</pdfLib.Text>
                        </pdfLib.View>

                        <pdfLib.View style={styles.infoContainer}>
                            <pdfLib.View style={styles.infoCol}>
                                <pdfLib.View style={styles.infoRow}><pdfLib.Text style={styles.label}>Name:</pdfLib.Text><pdfLib.Text style={styles.value}>{props.student.firstName} {props.student.lastName}</pdfLib.Text></pdfLib.View>
                                <pdfLib.View style={styles.infoRow}><pdfLib.Text style={styles.label}>Student ID:</pdfLib.Text><pdfLib.Text style={styles.value}>{props.student.id.slice(0, 8).toUpperCase()}</pdfLib.Text></pdfLib.View>
                            </pdfLib.View>
                            <pdfLib.View style={styles.infoCol}>
                                <pdfLib.View style={styles.infoRow}><pdfLib.Text style={styles.label}>Year:</pdfLib.Text><pdfLib.Text style={styles.value}>{props.year}</pdfLib.Text></pdfLib.View>
                                <pdfLib.View style={styles.infoRow}><pdfLib.Text style={styles.label}>Term:</pdfLib.Text><pdfLib.Text style={styles.value}>{props.term}</pdfLib.Text></pdfLib.View>
                                <pdfLib.View style={styles.infoRow}><pdfLib.Text style={styles.label}>Class:</pdfLib.Text><pdfLib.Text style={styles.value}>{props.student.classId || 'N/A'}</pdfLib.Text></pdfLib.View>
                            </pdfLib.View>
                        </pdfLib.View>

                        <pdfLib.View style={styles.table}>
                            <pdfLib.View style={styles.tableHeaderRow}>
                                <pdfLib.View style={{...styles.tableCol, width: '40%'}}><pdfLib.Text style={styles.tableCellHeader}>Subject</pdfLib.Text></pdfLib.View>
                                <pdfLib.View style={{...styles.tableCol, width: '20%'}}><pdfLib.Text style={styles.tableCellHeader}>Score</pdfLib.Text></pdfLib.View>
                                <pdfLib.View style={{...styles.tableCol, width: '15%'}}><pdfLib.Text style={styles.tableCellHeader}>Grade</pdfLib.Text></pdfLib.View>
                                <pdfLib.View style={{...styles.tableCol, width: '25%'}}><pdfLib.Text style={styles.tableCellHeader}>Remark</pdfLib.Text></pdfLib.View>
                            </pdfLib.View>
                            {reportData.map((row: any, i) => (
                                <pdfLib.View key={i} style={styles.tableRow}>
                                    <pdfLib.View style={{...styles.tableCol, width: '40%'}}><pdfLib.Text style={styles.tableCell}>{row.name}</pdfLib.Text></pdfLib.View>
                                    <pdfLib.View style={{...styles.tableCol, width: '20%'}}><pdfLib.Text style={styles.tableCell}>{row.pct.toFixed(1)}%</pdfLib.Text></pdfLib.View>
                                    <pdfLib.View style={{...styles.tableCol, width: '15%'}}><pdfLib.Text style={styles.tableCell}>{row.grade}</pdfLib.Text></pdfLib.View>
                                    <pdfLib.View style={{...styles.tableCol, width: '25%'}}><pdfLib.Text style={styles.tableCell}>{row.remark}</pdfLib.Text></pdfLib.View>
                                </pdfLib.View>
                            ))}
                        </pdfLib.View>

                        <pdfLib.View style={styles.summary}>
                            <pdfLib.View style={styles.summaryRow}><pdfLib.Text>Average:</pdfLib.Text><pdfLib.Text style={{fontWeight: 'bold'}}>{average.toFixed(2)}%</pdfLib.Text></pdfLib.View>
                            <pdfLib.View style={styles.summaryRow}><pdfLib.Text>Rank:</pdfLib.Text><pdfLib.Text style={{fontWeight: 'bold'}}>{props.rank} / {props.totalStudents}</pdfLib.Text></pdfLib.View>
                            <pdfLib.View style={{...styles.summaryRow, marginTop: 10}}><pdfLib.Text>Principal&apos;s Remark:</pdfLib.Text><pdfLib.Text style={{fontStyle: 'italic'}}>{getGrade(average).remark}</pdfLib.Text></pdfLib.View>
                        </pdfLib.View>

                        <pdfLib.View style={{flexDirection: 'row', marginTop: 40, justifyContent: 'space-between', paddingHorizontal: 20}}>
                            <pdfLib.View style={{borderTopWidth: 1, width: 150, alignItems: 'center'}}><pdfLib.Text style={{fontSize: 9, marginTop: 5}}>Class Teacher</pdfLib.Text></pdfLib.View>
                            <pdfLib.View style={{borderTopWidth: 1, width: 150, alignItems: 'center'}}><pdfLib.Text style={{fontSize: 9, marginTop: 5}}>Principal</pdfLib.Text></pdfLib.View>
                        </pdfLib.View>

                        <pdfLib.Text style={styles.footer}>Generated via Sunnyside SIS • {format(new Date(), 'PPP')}</pdfLib.Text>
                    </pdfLib.Page>
                </pdfLib.Document>
            );

            // 5. Generate Blob and Trigger Download
            const blob = await pdfLib.pdf(Doc).toBlob();
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
