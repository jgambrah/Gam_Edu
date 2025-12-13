
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';

// --- PDF Generation Logic ---

// Helper function to load the PDF library dynamically
const loadPdfLibrary = async () => {
  const module = await import('@react-pdf/renderer');
  return module;
};

// This is a mock function. A real implementation would be more complex.
function getGrade(percentage: number) {
    if (percentage >= 80) return { grade: 'A', remark: 'Excellent' };
    if (percentage >= 70) return { grade: 'B', remark: 'Very Good' };
    if (percentage >= 60) return { grade: 'C', remark: 'Good' };
    if (percentage >= 50) return { grade: 'D', remark: 'Pass' };
    return { grade: 'F', remark: 'Fail' };
}

export function GenerateReportCard(props: any) {
    const [PdfLib, setPdfLib] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // Pre-load the library when the component mounts to avoid delay on click
        loadPdfLibrary().then(lib => setPdfLib(lib));
    }, []);

    const reportCardData = useMemo(() => {
        if (!props.assessments || !props.subjects) return [];
        return props.subjects.map((subject: any) => {
            const subjectAssessments = props.assessments.filter((a: any) => a.subjectId === subject.id);
            if (subjectAssessments.length === 0) return { subject: subject.name, finalGrade: 'N/A', percentage: 0, remark: 'No assessments' };
            
            // Calculate CA and Exam separately
            const caAssessments = subjectAssessments.filter((a: any) => a.assessmentType?.includes('(CA)'));
            const examAssessments = subjectAssessments.filter((a: any) => a.assessmentType?.includes('(Exam)'));

            const caTotal = caAssessments.reduce((acc: any, a: any) => acc + (a.score || 0), 0);
            const caMax = caAssessments.reduce((acc: any, a: any) => acc + (a.maxScore || 0), 0);
            const caWeighted = caMax > 0 ? (caTotal / caMax) * 50 : 0;
            
            const examTotal = examAssessments.reduce((acc: any, a: any) => acc + (a.score || 0), 0);
            const examMax = examAssessments.reduce((acc: any, a: any) => acc + (a.maxScore || 0), 0);
            const examWeighted = examMax > 0 ? (examTotal / examMax) * 50 : 0;
            
            const percentage = caWeighted + examWeighted;
            const { grade, remark } = getGrade(percentage);

            return { subject: subject.name, finalGrade: grade, remark, percentage: parseFloat(percentage.toFixed(1)) };
        });
    }, [props.assessments, props.subjects]);

    const overallAverage = useMemo(() => {
        if (!reportCardData || reportCardData.length === 0) return 0;
        const validGrades = reportCardData.filter((s: any) => s.percentage > 0);
        if (validGrades.length === 0) return 0;
        return validGrades.reduce((acc: any, s: any) => acc + s.percentage, 0) / validGrades.length;
    }, [reportCardData]);

    const handleDownload = () => {
        setIsGenerating(true);
        setTimeout(() => setIsGenerating(false), 2000); 
    };

    if (!PdfLib) {
        return (
            <Button variant="outline" className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading PDF Engine...
            </Button>
        );
    }
    
    const { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Image } = PdfLib;

    const styles = StyleSheet.create({
        page: { fontFamily: 'Helvetica', fontSize: 10, padding: 40, color: '#333' },
        header: { textAlign: 'center', marginBottom: 20, borderBottom: '1 solid #ccc', paddingBottom: 10 },
        schoolName: { fontSize: 24, fontFamily: 'Helvetica-Bold', color: '#1E40AF' },
        subHeader: { fontSize: 9, color: '#555' },
        reportTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', marginTop: 10, textDecoration: 'underline' },
        studentInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, fontSize: 11 },
        table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
        tableRow: { margin: "auto", flexDirection: "row" },
        tableColHeader: { width: "25%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, backgroundColor: '#f0f0f0', padding: 5, fontFamily: 'Helvetica-Bold' },
        tableCol: { width: "25%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
        subjectCol: { width: "40%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
        commentCol: { width: "60%", borderStyle: "solid", borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0, padding: 5 },
        summarySection: { flexDirection: 'row', marginTop: 20, gap: 20 },
        summaryCard: { flex: 1, border: '1 solid #eee', padding: 15, borderRadius: 5 },
        footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: 'grey' }
    });

    const MyDocument = (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    {props.schoolProfile?.logoUrl && (
                        <Image 
                            src={props.schoolProfile.logoUrl} 
                            style={{ width: 50, height: 50, alignSelf: 'center', marginBottom: 10 }} 
                        />
                    )}
                    <Text style={styles.schoolName}>
                        {props.schoolProfile?.name || "Sunnyside International School"}
                    </Text>
                    <Text style={styles.subHeader}>
                        {props.schoolProfile?.address || "Address: N/A"} • {props.schoolProfile?.phone || "Phone: N/A"}
                    </Text>
                    <Text style={styles.subHeader}>
                        {props.schoolProfile?.email || ""} • {props.schoolProfile?.website || ""}
                    </Text>
                    <Text style={{...styles.subHeader, fontStyle: 'italic', marginTop: 2}}>
                        "{props.schoolProfile?.motto || 'Excellence • Integrity • Service'}"
                    </Text>
                    <Text style={styles.reportTitle}>TERMINAL REPORT CARD</Text>
                </View>
                <View style={styles.studentInfo}>
                    <Text>Student: {props.student.firstName} {props.student.lastName}</Text>
                    <Text>Term: {props.term}</Text>
                    <Text>Year: {props.year}</Text>
                    <Text>Position: {props.rank}/{props.totalStudents}</Text>
                </View>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableColHeader}>Subject</Text>
                        <Text style={styles.tableColHeader}>Score (%)</Text>
                        <Text style={styles.tableColHeader}>Grade</Text>
                        <Text style={styles.tableColHeader}>Remark</Text>
                    </View>
                    {reportCardData.map((item: any) => (
                        <View key={item.subject} style={styles.tableRow}>
                            <Text style={styles.tableCol}>{item.subject}</Text>
                            <Text style={styles.tableCol}>{item.percentage > 0 ? item.percentage : 'N/A'}</Text>
                            <Text style={styles.tableCol}>{item.finalGrade}</Text>
                            <Text style={styles.tableCol}>{item.remark}</Text>
                        </View>
                    ))}
                </View>
                 <View style={styles.summarySection}>
                    <View style={styles.summaryCard}>
                        <Text style={{fontFamily: 'Helvetica-Bold'}}>Overall Average</Text>
                        <Text style={{fontSize: 24, fontFamily: 'Helvetica-Bold', marginTop: 5}}>{overallAverage.toFixed(1)}%</Text>
                    </View>
                    <View style={styles.summaryCard}>
                        <Text style={{fontFamily: 'Helvetica-Bold'}}>General Comment</Text>
                        <Text style={{marginTop: 5}}>A satisfactory performance. Keep it up.</Text>
                    </View>
                 </View>
                
                <View style={styles.footer} fixed>
                    <Text>Generated by CampusConnect on {new Date().toLocaleDateString()}</Text>
                </View>
            </Page>
        </Document>
    );

    return (
        <PDFDownloadLink 
            document={MyDocument} 
            fileName={`${props.student.firstName}_${props.year}_${props.term}_Report.pdf`}
            className="w-full"
        >
            {({ blob, url, loading, error }) => (
                <Button 
                    variant="outline" 
                    className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    disabled={loading || isGenerating}
                    onClick={handleDownload}
                >
                    {(loading || isGenerating) ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileDown className="mr-2 h-4 w-4"/>}
                    Download Report Card
                </Button>
            )}
        </PDFDownloadLink>
    );
}
