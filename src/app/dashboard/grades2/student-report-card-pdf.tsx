
'use client';

import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Assessment, Student, Subject } from '@/lib/types';
import { MOCK_SUBJECTS } from '@/lib/data';

// Register fonts
Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2', fontWeight: 400 },
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMg1ZL7.woff2', fontWeight: 500 },
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnM21ZL7.woff2', fontWeight: 600 },
        { src: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnManZL7.woff2', fontWeight: 700 },
    ],
});

const styles = StyleSheet.create({
    page: { fontFamily: 'Inter', padding: 40, fontSize: 10, color: '#334155' },
    header: { textAlign: 'center', marginBottom: 20 },
    schoolName: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
    reportTitle: { fontSize: 12, color: '#64748B' },
    separator: { marginVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    studentInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#E2E8F0' },
    tableRow: { flexDirection: 'row' },
    tableColHeader: { width: '25%', backgroundColor: '#F8FAFC', padding: 6, borderStyle: 'solid', borderWidth: 1, borderColor: '#E2E8F0' },
    tableCol: { width: '25%', padding: 6, borderStyle: 'solid', borderWidth: 1, borderColor: '#E2E8F0' },
    subjectCol: { width: '40%' },
    gradeCol: { width: '15%', textAlign: 'center' },
    commentCol: { width: '30%' },
    bold: { fontWeight: 'bold' },
    summarySection: { flexDirection: 'row', gap: 20, marginTop: 20 },
    summaryCard: { flex: 1, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 4, padding: 12 },
    summaryTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
    overallGrade: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: '#1E293B' },
    overallPercent: { fontSize: 12, textAlign: 'center', color: '#64748B' },
    footer: { position: 'absolute', bottom: 40, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#94A3B8' },
    footerSignatures: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 60, paddingTop: 10 },
    signatureLine: { borderTopWidth: 1, borderTopColor: '#CBD5E1', width: 150, paddingTop: 4, textAlign: 'center' },
});

const getGradeForScore = (score: number): 'A' | 'B' | 'C' | 'D' | 'F' | 'N/A' => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    if (score > 0) return 'E';
    return 'F';
};

export function StudentReportCardPDF({ student, term, year, assessments, rank }: { student: Student, term: string, year: string, assessments: Assessment[], rank: string }) {

    const reportCardData = MOCK_SUBJECTS.map(subject => {
        const subjectAssessments = assessments.filter(a => a.studentId === student.uid && a.subjectId === subject.id && a.score != null && a.maxScore != null && a.maxScore > 0);
        if (subjectAssessments.length === 0) return { subjectName: subject.name, finalGrade: 'N/A', percentage: 0, comment: '' };
        
        const totalScore = subjectAssessments.reduce((acc, a) => acc + a.score!, 0);
        const totalMaxScore = subjectAssessments.reduce((acc, a) => acc + a.maxScore!, 0);
        const percentage = totalMaxScore > 0 ? (totalScore / totalMaxScore) * 100 : 0;
        
        return {
            subjectName: subject.name,
            finalGrade: getGradeForScore(percentage),
            percentage: parseFloat(percentage.toFixed(1)),
            comment: '', // Placeholder for comments
        };
    });

    const validGrades = reportCardData.filter(d => d.percentage > 0);
    const overallPercentage = validGrades.length > 0 ? validGrades.reduce((acc, d) => acc + d.percentage, 0) / validGrades.length : 0;
    const overallGrade = getGradeForScore(overallPercentage);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
            <Text style={styles.schoolName}>SunnySide High School</Text>
            <Text style={styles.reportTitle}>Student Report Card</Text>
        </View>
        <View style={styles.studentInfo}>
            <View>
                <Text><Text style={styles.bold}>Student:</Text> {student.firstName} {student.lastName}</Text>
                <Text><Text style={styles.bold}>Class:</Text> {student.classId}</Text>
            </View>
            <View style={{textAlign: 'right'}}>
                <Text><Text style={styles.bold}>Academic Year:</Text> {year}</Text>
                <Text><Text style={styles.bold}>Term:</Text> {term}</Text>
            </View>
        </View>

        <View style={styles.table}>
            <View style={styles.tableRow}>
                <Text style={{...styles.tableColHeader, ...styles.subjectCol}}>Subject</Text>
                <Text style={{...styles.tableColHeader, ...styles.gradeCol}}>Grade</Text>
                <Text style={{...styles.tableColHeader, ...styles.gradeCol}}>Score</Text>
                <Text style={{...styles.tableColHeader, ...styles.commentCol}}>Teacher's Remarks</Text>
            </View>
            {reportCardData.map(data => (
                <View key={data.subjectName} style={styles.tableRow}>
                    <Text style={{...styles.tableCol, ...styles.subjectCol}}>{data.subjectName}</Text>
                    <Text style={{...styles.tableCol, ...styles.gradeCol, fontWeight: 'bold'}}>{data.finalGrade}</Text>
                    <Text style={{...styles.tableCol, ...styles.gradeCol}}>{data.percentage > 0 ? `${data.percentage}%` : 'N/A'}</Text>
                    <Text style={{...styles.tableCol, ...styles.commentCol}}>{data.comment}</Text>
                </View>
            ))}
        </View>
        
        <View style={styles.summarySection}>
            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Overall Performance</Text>
                <Text style={styles.overallGrade}>{overallGrade}</Text>
                <Text style={styles.overallPercent}>({overallPercentage.toFixed(1)}%)</Text>
            </View>
            <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Class Position</Text>
                <Text style={styles.overallGrade}>{rank}</Text>
            </View>
            <View style={{...styles.summaryCard, flex: 2}}>
                <Text style={styles.summaryTitle}>General Remarks</Text>
                <Text>Student shows great potential but needs to improve focus in class.</Text>
            </View>
        </View>

        <View style={styles.footerSignatures}>
            <Text style={styles.signatureLine}>Class Teacher</Text>
            <Text style={styles.signatureLine}>Head of School</Text>
        </View>
        
        <Text style={styles.footer} fixed>Generated by CampusConnect on {new Date().toLocaleDateString()}</Text>
      </Page>
    </Document>
  );
}
