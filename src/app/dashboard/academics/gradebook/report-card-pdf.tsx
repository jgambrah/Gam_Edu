'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { Student, Assessment } from '@/lib/types';
import { format } from 'date-fns';
import { Printer, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- PDF STYLES ---
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica', fontSize: 10, color: '#333' },
  header: { marginBottom: 20, borderBottom: 1, borderBottomColor: '#ccc', paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  schoolName: { fontSize: 24, fontWeight: 'bold', color: '#1a365d', textTransform: 'uppercase' },
  schoolInfo: { fontSize: 9, color: '#666' },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginVertical: 15, textTransform: 'uppercase', letterSpacing: 1 },
  
  // Student Info Grid
  infoContainer: { flexDirection: 'row', marginBottom: 20, backgroundColor: '#f8fafc', padding: 10, borderRadius: 4 },
  infoCol: { flex: 1 },
  infoRow: { flexDirection: 'row', marginBottom: 4 },
  label: { width: 80, fontWeight: 'bold', color: '#64748b' },
  value: { flex: 1, fontWeight: 'bold' },

  // Table
  table: { width: 'auto', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', minHeight: 25, alignItems: 'center' },
  tableHeader: { backgroundColor: '#f1f5f9', fontWeight: 'bold' },
  colSubject: { width: '40%', padding: 5, borderRightWidth: 1, borderRightColor: '#e2e8f0' },
  colMetric: { width: '15%', padding: 5, borderRightWidth: 1, borderRightColor: '#e2e8f0', textAlign: 'center' },
  colRemark: { width: '30%', padding: 5, textAlign: 'left' },

  // Footer
  footer: { marginTop: 30, flexDirection: 'row', justifyContent: 'space-between' },
  signatureBox: { width: 200, borderTopWidth: 1, borderTopColor: '#000', paddingTop: 5, marginTop: 40, textAlign: 'center' },
  disclaimer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, textAlign: 'center', color: '#999' }
});

// Helper for Grading
function getGrade(percentage: number) {
    if (percentage >= 80) return { grade: 'A', remark: 'Excellent' };
    if (percentage >= 70) return { grade: 'B', remark: 'Very Good' };
    if (percentage >= 60) return { grade: 'C', remark: 'Good' };
    if (percentage >= 50) return { grade: 'D', remark: 'Pass' };
    return { grade: 'F', remark: 'Fail' };
}

// --- PDF DOCUMENT LAYOUT ---
const ReportCardDocument = ({ 
    student, 
    assessments, 
    year, 
    term,
    rank,
    totalStudents 
}: { 
    student: Student, 
    assessments: Assessment[], 
    year: string, 
    term: string,
    rank: number,
    totalStudents: number
}) => {
    
    // Process Data: Group assessments by Subject
    const subjectMap: Record<string, { name: string, total: number, max: number }> = {};
    
    assessments.forEach(curr => {
        // Use subjectId as key, but if you have a subjectName field, use that for display
        // Fallback to 'General' if missing
        const subName = curr.subjectId || 'General'; 
        
        if (!subjectMap[subName]) {
            subjectMap[subName] = { name: subName, total: 0, max: 0 };
        }
        subjectMap[subName].total += curr.score || 0;
        subjectMap[subName].max += curr.maxScore || 0;
    });

    const subjectGrades = Object.values(subjectMap).map(s => {
        const pct = s.max > 0 ? (s.total / s.max) * 100 : 0;
        return { ...s, percentage: pct, ...getGrade(pct) };
    });

    const overallAvg = subjectGrades.length > 0 
        ? subjectGrades.reduce((acc, s) => acc + s.percentage, 0) / subjectGrades.length 
        : 0;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                
                {/* HEADER */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.schoolName}>SunnySide Academy</Text>
                        <Text style={styles.schoolInfo}>123 Education Lane, Accra, Ghana</Text>
                        <Text style={styles.schoolInfo}>contact@sunnyside.com</Text>
                    </View>
                </View>

                <Text style={styles.title}>Student Report Card</Text>

                {/* STUDENT INFO */}
                <View style={styles.infoContainer}>
                    <View style={styles.infoCol}>
                        <View style={styles.infoRow}><Text style={styles.label}>Name:</Text><Text style={styles.value}>{student.firstName} {student.lastName}</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>ID:</Text><Text style={styles.value}>{student.id ? student.id.slice(0,8).toUpperCase() : 'N/A'}</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>Class:</Text><Text style={styles.value}>{student.classId}</Text></View>
                    </View>
                    <View style={styles.infoCol}>
                        <View style={styles.infoRow}><Text style={styles.label}>Year:</Text><Text style={styles.value}>{year}</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>Term:</Text><Text style={styles.value}>{term}</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>Position:</Text><Text style={styles.value}>{rank} / {totalStudents}</Text></View>
                    </View>
                </View>

                {/* GRADES TABLE */}
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.colSubject}>Subject</Text>
                        <Text style={styles.colMetric}>Percent</Text>
                        <Text style={styles.colMetric}>Grade</Text>
                        <Text style={styles.colRemark}>Remark</Text>
                    </View>
                    {subjectGrades.map((sub, i) => (
                        <View key={i} style={styles.tableRow}>
                            <Text style={styles.colSubject}>{sub.name}</Text>
                            <Text style={styles.colMetric}>{sub.percentage.toFixed(1)}%</Text>
                            <Text style={styles.colMetric}>{sub.grade}</Text>
                            <Text style={styles.colRemark}>{sub.remark}</Text>
                        </View>
                    ))}
                    {/* Total Row */}
                    <View style={[styles.tableRow, { borderTopWidth: 2, backgroundColor: '#f8fafc' }]}>
                        <Text style={[styles.colSubject, { fontWeight: 'bold' }]}>Overall Average</Text>
                        <Text style={[styles.colMetric, { fontWeight: 'bold' }]}>{overallAvg.toFixed(1)}%</Text>
                        <Text style={styles.colMetric}></Text>
                        <Text style={styles.colRemark}></Text>
                    </View>
                </View>

                {/* SIGNATURES */}
                <View style={styles.footer}>
                    <View style={styles.signatureBox}>
                        <Text>Class Teacher Signature</Text>
                    </View>
                    <View style={styles.signatureBox}>
                        <Text>Headmaster Signature</Text>
                    </View>
                </View>

                <Text style={styles.disclaimer}>Generated via CampusConnect System on {format(new Date(), 'PPP')}</Text>
            </Page>
        </Document>
    );
};

// --- BUTTON COMPONENT (This is what appears on the page) ---
export const GenerateReportCard = ({ 
    student, assessments, year, term, rank, totalStudents 
}: any) => (
    <PDFDownloadLink
        document={
            <ReportCardDocument 
                student={student} 
                assessments={assessments} 
                year={year} 
                term={term}
                rank={rank}
                totalStudents={totalStudents}
            />
        }
        fileName={`${student.firstName}_${student.lastName}_Report.pdf`}
    >
        {/* @ts-ignore */}
        {({ blob, url, loading, error }) => (
            <Button variant="outline" className="w-full gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Printer className="h-4 w-4"/>}
                {loading ? 'Generating...' : 'Download Report Card'}
            </Button>
        )}
    </PDFDownloadLink>
);