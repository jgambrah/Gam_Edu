
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import { Assessment, Student } from '@/lib/types';

// Dynamically import PDF components with SSR disabled to prevent server-side crashes.
const Document = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.Document), { ssr: false });
const Page = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.Page), { ssr: false });
const Text = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.Text), { ssr: false });
const View = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.View), { ssr: false });
const StyleSheet = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.StyleSheet), { ssr: false });
const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink), {
  ssr: false,
  loading: () => (
    <Button variant="outline" className="w-full" disabled>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing PDF...
    </Button>
  ),
});


// --- PDF STYLES ---
const styles: any = {
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
};

// Helper for Grading
function getGrade(percentage: number) {
    if (percentage >= 80) return { grade: 'A', remark: 'Excellent' };
    if (percentage >= 70) return { grade: 'B', remark: 'Very Good' };
    if (percentage >= 60) return { grade: 'C', remark: 'Good' };
    if (percentage >= 50) return { grade: 'D', remark: 'Pass' };
    return { grade: 'F', remark: 'Fail' };
}

// --- THE DOCUMENT LAYOUT ---
const ReportCardDocument = ({ student, assessments, year, term, rank, totalStudents, subjectsList }: any) => {
    
    const subjectMap = subjectsList?.reduce((acc: any, s: any) => {
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
                    <Text style={styles.schoolName}>Sunnyside International School</Text>
                    <Text style={styles.subHeader}>Excellence • Integrity • Service</Text>
                    <Text style={styles.reportTitle}>TERMINAL REPORT CARD</Text>
                </View>
                <View style={styles.infoContainer}>
                    <View style={styles.infoCol}><Text style={styles.label}>Name:</Text><Text style={styles.value}>{student.firstName} {student.lastName}</Text></View>
                    <View style={styles.infoCol}><Text style={styles.label}>Student ID:</Text><Text style={styles.value}>{student.id.slice(0, 8).toUpperCase()}</Text></View>
                    <View style={styles.infoCol}><Text style={styles.label}>Year:</Text><Text style={styles.value}>{year}</Text></View>
                    <View style={styles.infoCol}><Text style={styles.label}>Term:</Text><Text style={styles.value}>{term}</Text></View>
                    <View style={styles.infoCol}><Text style={styles.label}>Class:</Text><Text style={styles.value}>{student.classId || 'N/A'}</Text></View>
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
                </View>
                <View style={styles.summary}>
                    <View style={styles.summaryRow}><Text>Average:</Text><Text style={{fontWeight: 'bold'}}>{average.toFixed(2)}%</Text></View>
                    <View style={styles.summaryRow}><Text>Rank:</Text><Text style={{fontWeight: 'bold'}}>{rank} / {totalStudents}</Text></View>
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

export function GenerateReportCard({ student, assessments, year, term, rank, totalStudents, subjectsList }: {
    student: any;
    assessments: any[];
    year: string;
    term: string;
    rank: number;
    totalStudents: number;
    subjectsList: any[];
}) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient || !student || !assessments || !subjectsList) {
        return (
            <Button variant="outline" className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing PDF...
            </Button>
        );
    }
    
    return (
        <PDFDownloadLink
            document={<ReportCardDocument student={student} assessments={assessments} year={year} term={term} rank={rank} totalStudents={totalStudents} subjectsList={subjectsList} />}
            fileName={`Report_${student.firstName}_${student.lastName}.pdf`}
        >
            {({ loading }: { loading: boolean }) => (
                <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDown className="mr-2 h-4 w-4"/>}
                    {loading ? 'Generating...' : 'Download Report Card'}
                </Button>
            )}
        </PDFDownloadLink>
    );
}
