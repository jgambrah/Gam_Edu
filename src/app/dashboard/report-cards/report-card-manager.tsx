'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth, useFirestore, useCollection, useMemoFirebase, useDoc, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, getDocs, getDoc, doc, setDoc, serverTimestamp, orderBy, updateDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Printer, Download, Search, CheckCircle, FileCheck, GraduationCap, Calendar as CalendarIcon, Eye, Save, Send, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

// --- HELPERS ---

async function getBase64ImageFromUrl(imageUrl: string): Promise<string> {
    try {
        const fetchUrl = imageUrl.startsWith('https://firebasestorage.googleapis.com')
            ? `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
            : imageUrl;

        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error: any) {
        console.error("❌ getBase64ImageFromUrl failed:", error.message);
        return "";
    }
}

function getGradeAndRemark(score: number) {
    if (score >= 80) return { grade: 'A', autoRemark: 'Excellent' };
    if (score >= 70) return { grade: 'B', autoRemark: 'Very Good' };
    if (score >= 60) return { grade: 'C', autoRemark: 'Good' };
    if (score >= 50) return { grade: 'D', autoRemark: 'Credit' };
    if (score >= 40) return { grade: 'E', autoRemark: 'Pass' };
    return { grade: 'F', autoRemark: 'Fail' };
}

// --- SUB-COMPONENT: ACTUAL REPORT CARD CONTENT ---
function ReportCardTemplate({ data, classTeacherComment, headmasterComment, caWeight, examWeight }: {
    data: any;
    classTeacherComment: string;
    headmasterComment: string;
    caWeight: number;
    examWeight: number;
}) {
    if (!data) return null;

    return (
        <div
            id="pdf-content"
            style={{
                width: '794px',
                minHeight: '1123px',
                maxHeight: '1123px',
                color: 'black',
                boxSizing: 'border-box',
                margin: '0 auto',
                backgroundColor: 'white',
                padding: '24px 36px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0px',
                overflow: 'hidden',
            }}
        >
            {/* ── HEADER ── */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '4px double #1e293b',
                paddingBottom: '10px',
                marginBottom: '8px',
            }}>
                {/* Logo */}
                <div style={{ width: '96px', height: '96px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    {data.logoBase64 ? (
                        <img
                            src={data.logoBase64}
                            alt="School Logo"
                            style={{ maxWidth: '96px', maxHeight: '96px', objectFit: 'contain', display: 'block' }}
                        />
                    ) : (
                        <div style={{ width: 96, height: 96, background: '#f1f5f9', border: '1px dashed #94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#94a3b8', textAlign: 'center' }}>
                            No Logo
                        </div>
                    )}
                </div>

                {/* School Info */}
                <div style={{ flex: 1, textAlign: 'center', padding: '0 12px' }}>
                    <div style={{ fontSize: '26px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.2 }}>
                        {data.schoolName || 'SCHOOL NAME'}
                    </div>
                    {data.schoolMotto && (
                        <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#475569', marginTop: '2px' }}>
                            "{data.schoolMotto}"
                        </div>
                    )}
                    <div style={{ fontSize: '12px', fontWeight: 700, marginTop: '3px' }}>{data.schoolAddress || ''}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700 }}>
                        {[data.schoolPhone, data.schoolEmail].filter(Boolean).join(' | ')}
                    </div>
                </div>

                <div style={{ width: '96px', flexShrink: 0 }} />
            </div>

            {/* ── REPORT TITLE ── */}
            <div style={{
                fontSize: '18px',
                fontWeight: 700,
                textAlign: 'center',
                marginBottom: '8px',
                background: '#f1f5f9',
                padding: '6px',
                border: '1px solid #cbd5e1',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
            }}>
                Terminal Report Card
            </div>

            {/* ── STUDENT INFO ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '4px 16px',
                marginBottom: '8px',
                fontSize: '14px',
                border: '2px solid #cbd5e1',
                padding: '10px 12px',
                fontWeight: 500,
                background: '#f8fafc',
            }}>
                <div><strong>Name:</strong> {data.student?.firstName} {data.student?.lastName}</div>
                <div><strong>Term:</strong> {data.term}</div>
                <div><strong>Class:</strong> {data.className}</div>
                <div><strong>Academic Year:</strong> {data.academicYear}</div>
                <div><strong>Attendance:</strong> {data.studentPresentDays} / {data.totalClassDays} days</div>
                <div style={{ gridColumn: '1 / -1', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                        <strong>Position in Class: </strong>
                        <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{data.classPosition}</span> of {data.totalStudents}
                    </span>
                    <span>
                        <strong>Overall Average: </strong>
                        <span style={{ fontWeight: 700, textDecoration: 'underline' }}>{data.overallAverage}%</span>
                    </span>
                </div>
            </div>

            {/* ── GRADES TABLE ── */}
            <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', marginBottom: '8px', tableLayout: 'fixed' }}>
                <colgroup>
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '6%' }} />
                    <col style={{ width: '7%' }} />
                    <col style={{ width: '6%' }} />
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '34%' }} />
                </colgroup>
                <thead>
                    <tr style={{ background: '#f1f5f9', fontSize: '13px' }}>
                        <th style={{ border: '1px solid #1e293b', padding: '4px 6px', textAlign: 'left', overflow: 'hidden' }}>Subject</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px 6px', textAlign: 'center' }}>CA ({caWeight})</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px 6px', textAlign: 'center' }}>Exam ({examWeight})</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px 6px', textAlign: 'center' }}>Total</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px 6px', textAlign: 'center' }}>Avg</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px 6px', textAlign: 'center' }}>Grd</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px 6px', textAlign: 'center' }}>Pos</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px 6px', textAlign: 'center' }}>Remark</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px 6px', textAlign: 'left' }}>Teacher's Comment</th>
                    </tr>
                </thead>
                <tbody>
                    {data.rows?.map((row: any, i: number) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 6px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.subjectName}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 6px', textAlign: 'center' }}>{row.ca}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 6px', textAlign: 'center' }}>{row.exam}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 6px', textAlign: 'center', fontWeight: 900, background: '#f1f5f9' }}>{row.total}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 6px', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>{row.classAverage}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 6px', textAlign: 'center', fontWeight: 700 }}>{row.grade}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 6px', textAlign: 'center' }}>{row.position}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 6px', textAlign: 'center', fontWeight: 600, fontSize: '11px' }}>{row.autoRemark}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 6px', fontStyle: 'italic', fontSize: '11px', color: '#475569', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{row.teacherRemark || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ── GRADING KEY ── */}
            <div style={{
                border: '1px solid #cbd5e1',
                padding: '4px 8px',
                fontSize: '11px',
                background: '#f8fafc',
                marginBottom: '10px',
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                alignItems: 'center',
            }}>
                <strong>Key:</strong>
                <span>80–100: A (Excellent)</span><span style={{ color: '#94a3b8' }}>|</span>
                <span>70–79: B (Very Good)</span><span style={{ color: '#94a3b8' }}>|</span>
                <span>60–69: C (Good)</span><span style={{ color: '#94a3b8' }}>|</span>
                <span>50–59: D (Credit)</span><span style={{ color: '#94a3b8' }}>|</span>
                <span>40–49: E (Pass)</span><span style={{ color: '#94a3b8' }}>|</span>
                <span>0–39: F (Fail)</span>
            </div>

            {/* ── REMARKS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px 10px', background: '#f8fafc' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '6px', letterSpacing: '0.06em' }}>
                        Class Teacher's Remark:
                    </div>
                    <div style={{
                        fontSize: '14px',
                        fontStyle: 'italic',
                        fontFamily: 'Georgia, serif',
                        color: '#1e293b',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        minHeight: '36px',
                    }}>
                        {classTeacherComment || '...'}
                    </div>
                </div>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '4px', padding: '8px 10px', background: '#f8fafc' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '6px', letterSpacing: '0.06em' }}>
                        Headmaster's Remark:
                    </div>
                    <div style={{
                        fontSize: '14px',
                        fontStyle: 'italic',
                        fontFamily: 'Georgia, serif',
                        color: '#1e293b',
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        minHeight: '36px',
                    }}>
                        {headmasterComment || '...'}
                    </div>
                </div>
            </div>

            {/* ── SIGNATURES ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '40px',
                borderTop: '2px dashed #cbd5e1',
                paddingTop: '12px',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ height: '32px', borderBottom: '1px solid black', width: '75%', margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Class Teacher Signature &amp; Date
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ height: '32px', borderBottom: '1px solid black', width: '75%', margin: '0 auto 6px' }} />
                    <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Headmaster Signature &amp; Date
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ReportCardManager() {
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const { toast } = useToast();

    // Selection State
    const [classId, setClassId] = useState('');
    const [term, setTerm] = useState('First Term');
    const [academicYear, setAcademicYear] = useState('2024-2025');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    // Attendance Period
    const [termStartDate, setTermStartDate] = useState<Date | undefined>(undefined);
    const [termEndDate, setTermEndDate] = useState<Date | undefined>(undefined);

    // Comments State
    const [classTeacherComment, setClassTeacherComment] = useState('');
    const [headmasterComment, setHeadmasterComment] = useState('');

    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [processedReport, setProcessedReport] = useState<any>(null);
    
    const printRef = useRef<HTMLDivElement>(null);

    const isAdminOrDirector = ['Administrator', 'Director'].includes(role || '');
    const isTeacher = role === 'Teacher';

    // Data Fetching
    const classesQuery = useMemoFirebase(() => {
        if(!firestore || !user || !schoolId) return null;
        let q = query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
        if (role === 'Teacher') q = query(q, where('teacherId', '==', user.uid));
        return q;
    }, [firestore, user, role, schoolId]);
    const { data: classes } = useCollection<any>(classesQuery);

    const { data: students } = useCollection<any>(useMemoFirebase(() => 
        (firestore && schoolId && classId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('classId', '==', classId)) : null, 
    [firestore, schoolId, classId]));

    const { data: subjects } = useCollection<any>(useMemoFirebase(() => 
        (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, 
    [firestore, schoolId]));
    
    const { data: schoolProfile } = useDoc<any>(useMemoFirebase(() => 
        (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, 
    [firestore, schoolId]));

    const CA_WEIGHT = schoolProfile?.caWeight ?? 30;
    const EXAM_WEIGHT = schoolProfile?.examWeight ?? 70;

    // Load existing report remarks if available
    useEffect(() => {
        if (!selectedStudentId || !academicYear || !term || !firestore || !schoolId) return;
        const reportId = `${selectedStudentId}_${academicYear.replace(/\//g, '-')}_${term.replace(/\s+/g, '')}`;
        const fetchExisting = async () => {
            const docRef = doc(firestore, 'report-cards', reportId);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                const data = snap.data();
                setClassTeacherComment(data.classTeacherComment || '');
                setHeadmasterComment(data.headmasterComment || '');
                // Also set the processed report if it matches the current view to allow previewing without regenerating
                if (data.schoolId === schoolId) {
                    setProcessedReport(prev => prev ? { ...prev, status: data.status } : null);
                }
            } else {
                setClassTeacherComment('');
                setHeadmasterComment('');
            }
        };
        fetchExisting();
    }, [selectedStudentId, academicYear, term, firestore, schoolId]);

    const generateReport = async () => {
        if (!firestore || !schoolId || !classId || !selectedStudentId) return;
        setIsGenerating(true);
        setProcessedReport(null);

        try {
            // 1. Fetch Assessments
            const assessmentsRef = collection(firestore, 'assessments');
            const q = query(
                assessmentsRef, 
                where('schoolId', '==', schoolId),
                where('classId', '==', classId),
                where('academicYear', '==', academicYear),
                where('term', '==', term)
            );
            const snap = await getDocs(q);
            const allAssessments = snap.docs.map(d => d.data());

            // 2. Statistical Analysis
            const subjectStats: Record<string, { totalScores: number[], sum: number }> = {};
            const studentTotals: Record<string, number> = {};

            subjects?.forEach((sub: any) => { 
                subjectStats[sub.id] = { totalScores: [], sum: 0 }; 
            });

            students?.forEach((stu: any) => {
                let grandTotal = 0;
                subjects?.forEach((sub: any) => {
                    const stuSubjAssessments = allAssessments.filter(a => a.studentId === stu.uid && a.subjectId === sub.id);
                    let total100 = 0;
                    if (stuSubjAssessments.length > 0) {
                        const cas = stuSubjAssessments.filter(a => a.assessmentType.includes('CA'));
                        const caScore = cas.reduce((sum, a) => sum + (a.score || 0), 0);
                        const caMax = cas.reduce((sum, a) => sum + (a.maxScore || 100), 0);
                        const weightedCA = caMax > 0 ? (caScore / caMax) * CA_WEIGHT : 0;

                        const exams = stuSubjAssessments.filter(a => a.assessmentType.includes('Exam'));
                        const examScore = exams.reduce((sum, a) => sum + (a.score || 0), 0);
                        const examMax = exams.reduce((sum, a) => sum + (a.maxScore || 100), 0);
                        const weightedExam = examMax > 0 ? (examScore / examMax) * EXAM_WEIGHT : 0;

                        total100 = Math.round(weightedCA + weightedExam);
                    }
                    grandTotal += total100;
                    if (subjectStats[sub.id]) {
                        subjectStats[sub.id].totalScores.push(total100);
                        subjectStats[sub.id].sum += total100;
                    }
                });
                studentTotals[stu.uid] = grandTotal;
            });

            // 3. Ranks
            const sortedStudentTotals = Object.entries(studentTotals).sort(([,a], [,b]) => b - a);
            const classPosition = sortedStudentTotals.findIndex(([uid]) => uid === selectedStudentId) + 1;

            const targetStudent = students?.find((s:any) => s.uid === selectedStudentId);
            const reportRows: any[] = [];
            let myGrandTotal = 0;
            let subjectsTaken = 0;

            subjects?.forEach((sub: any) => {
                const myAssessments = allAssessments.filter(a => a.studentId === selectedStudentId && a.subjectId === sub.id);
                if (myAssessments.length === 0) return; 

                const cas = myAssessments.filter(a => a.assessmentType.includes('CA'));
                const caScore = cas.reduce((sum, a) => sum + (a.score || 0), 0);
                const caMax = cas.reduce((sum, a) => sum + (a.maxScore || 100), 0);
                const weightedCA = caMax > 0 ? (caScore / caMax) * CA_WEIGHT : 0;

                const exams = myAssessments.filter(a => a.assessmentType.includes('Exam'));
                const examScore = exams.reduce((sum, a) => sum + (a.score || 0), 0);
                const examMax = exams.reduce((sum, a) => sum + (a.maxScore || 100), 0);
                const weightedExam = examMax > 0 ? (examScore / examMax) * EXAM_WEIGHT : 0;

                const total100 = Math.round(weightedCA + weightedExam);
                myGrandTotal += total100;
                subjectsTaken++;

                const { grade, autoRemark } = getGradeAndRemark(total100);
                const teacherRemarksList = myAssessments.map(a => a.teacherRemark).filter(Boolean);
                const customTeacherRemark = teacherRemarksList.length > 0 ? teacherRemarksList[teacherRemarksList.length - 1] : "";

                const sortedScores = [...subjectStats[sub.id].totalScores].sort((a, b) => b - a);
                const rankIndex = sortedScores.indexOf(total100);
                const mySubjectRank = rankIndex >= 0 ? rankIndex + 1 : sortedScores.length;

                const subjectAverage = subjectStats[sub.id].totalScores.length > 0 
                    ? Math.round(subjectStats[sub.id].sum / subjectStats[sub.id].totalScores.length) 
                    : 0;

                reportRows.push({
                    subjectName: sub.name,
                    ca: Math.round(weightedCA),
                    exam: Math.round(weightedExam),
                    total: total100,
                    grade,
                    autoRemark,
                    teacherRemark: customTeacherRemark,
                    classAverage: subjectAverage,
                    position: mySubjectRank
                });
            });

            const overallAverage = subjectsTaken > 0 ? Math.round(myGrandTotal / subjectsTaken) : 0;

            // 4. Attendance
            const attendanceRef = collection(firestore, 'attendance');
            const attQuery = query(attendanceRef, where('schoolId', '==', schoolId), where('classId', '==', classId));
            const attSnap = await getDocs(attQuery);
            const allAtt = attSnap.docs.map(d => d.data());

            let studentPresentDays = 0;
            let totalClassDays = 0;

            if (termStartDate && termEndDate) {
                const start = startOfDay(termStartDate).getTime();
                const end = endOfDay(termEndDate).getTime();
                const termAtt = allAtt.filter(a => {
                    const d = a.date?.toDate ? a.date.toDate().getTime() : new Date(a.date).getTime();
                    return d >= start && d <= end;
                });
                const uniqueDays = new Set(termAtt.map(a => format(a.date?.toDate ? a.date.toDate() : new Date(a.date), 'yyyy-MM-dd')));
                totalClassDays = uniqueDays.size;
                studentPresentDays = termAtt.filter(a => a.studentId === selectedStudentId && (a.status === 'Present' || a.status === 'Late')).length;
            }

            // 5. Assets & Final Structure
            let finalLogoStr = '';
            if (schoolProfile?.logoUrl) {
                finalLogoStr = await getBase64ImageFromUrl(schoolProfile.logoUrl);
            }

            setProcessedReport({
                student: targetStudent,
                rows: reportRows,
                overallAverage,
                totalScore: myGrandTotal,
                classPosition,
                totalStudents: students?.length || 0,
                studentPresentDays,
                totalClassDays,
                logoBase64: finalLogoStr,
                schoolName: schoolProfile?.name,
                schoolMotto: schoolProfile?.motto,
                schoolAddress: schoolProfile?.address,
                schoolPhone: schoolProfile?.phone,
                schoolEmail: schoolProfile?.email,
                term,
                academicYear,
                className: classes?.find((c:any) => c.id === classId)?.name || ''
            });

        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: "Error", description: "Failed to compile report data." });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveProgress = async () => {
        if (!processedReport || !schoolId || isSaving) return;
        setIsSaving(true);
        try {
            const reportId = `${selectedStudentId}_${academicYear.replace(/\//g, '-')}_${term.replace(/\s+/g, '')}`;
            await setDoc(doc(firestore!, 'report-cards', reportId), {
                ...processedReport,
                id: reportId,
                schoolId,
                status: 'Draft',
                classTeacherComment,
                headmasterComment,
                lastUpdatedBy: user?.uid,
                updatedAt: serverTimestamp()
            }, { merge: true });
            toast({ title: "Progress Saved", description: "The report and remarks have been stored." });
        } catch (e) {
            toast({ variant: 'destructive', title: "Error", description: "Failed to save progress." });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!processedReport || !schoolId || isPublishing) return;
        setIsPublishing(true);
        try {
            const reportId = `${selectedStudentId}_${academicYear.replace(/\//g, '-')}_${term.replace(/\s+/g, '')}`;
            await setDoc(doc(firestore!, 'report-cards', reportId), {
                ...processedReport,
                id: reportId,
                schoolId,
                status: 'Published',
                publishedAt: serverTimestamp(),
                classTeacherComment,
                headmasterComment,
                generatedBy: user?.uid
            }, { merge: true });
            toast({ title: "Report Published", description: "This result is now visible in the student portal." });
        } catch (e) {
            toast({ variant: 'destructive', title: "Error", description: "Publishing failed." });
        } finally {
            setIsPublishing(false);
        }
    };

    const handleDownloadPDF = async () => {
        const element = printRef.current;
        if (!element || !processedReport) return;

        setIsExporting(true);
        try {
            element.style.visibility = 'visible';
            element.style.position = 'fixed';
            element.style.top = '0';
            element.style.left = '0';
            element.style.zIndex = '-1';
            element.style.display = 'flex';

            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 794,
                windowHeight: 1123,
                imageTimeout: 0,
            });

            element.style.visibility = 'hidden';
            element.style.position = 'absolute';
            element.style.display = 'block';

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            pdf.save(`${processedReport.student?.firstName}_Report_${term}.pdf`);
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast({ variant: 'destructive', title: "Export Failed" });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black flex items-center gap-3 text-slate-900 uppercase tracking-tighter">
                        <GraduationCap className="h-10 w-10 text-indigo-600"/> Terminal Reports
                    </h1>
                    <p className="text-slate-500 font-medium italic">Generate, Review, and Publish Student Results.</p>
                </div>
            </div>

            {/* Filter Section */}
            <Card className="border-t-4 border-t-indigo-600 shadow-md print:hidden">
                <CardHeader><CardTitle className="text-lg">Report Configuration</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-400 uppercase">Academic Year</Label>
                        <Select value={academicYear} onValueChange={setAcademicYear}>
                            <SelectTrigger className="bg-white rounded-xl"><SelectValue/></SelectTrigger>
                            <SelectContent>{MOCK_ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-400 uppercase">Term</Label>
                        <Select value={term} onValueChange={setTerm}>
                            <SelectTrigger className="bg-white rounded-xl"><SelectValue/></SelectTrigger>
                            <SelectContent>
                                {MOCK_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-400 uppercase">Class</Label>
                        <Select value={classId} onValueChange={setClassId}>
                            <SelectTrigger className="bg-white rounded-xl"><SelectValue placeholder="Select Class"/></SelectTrigger>
                            <SelectContent>{classes?.map((c:any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-400 uppercase">Student</Label>
                        <Select value={selectedStudentId || ''} onValueChange={setSelectedStudentId} disabled={!classId}>
                            <SelectTrigger className="bg-white rounded-xl"><SelectValue placeholder="Choose Student"/></SelectTrigger>
                            <SelectContent>{students?.map((s:any) => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-400 uppercase">Attendance Start</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full text-left font-normal bg-white rounded-xl">
                                    {termStartDate ? format(termStartDate, "PPP") : <span>Pick date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={termStartDate} onSelect={setTermStartDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-400 uppercase">Attendance End</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full text-left font-normal bg-white rounded-xl">
                                    {termEndDate ? format(termEndDate, "PPP") : <span>Pick date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={termEndDate} onSelect={setTermEndDate} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardContent>
                <CardFooter className="justify-end bg-slate-50 pt-4 border-t">
                    <Button onClick={generateReport} disabled={isGenerating || !selectedStudentId} className="bg-indigo-600 hover:bg-indigo-700 px-8 h-12 rounded-xl font-bold">
                        {isGenerating ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Search className="mr-2 h-4 w-4"/>}
                        Generate Master Preview
                    </Button>
                </CardFooter>
            </Card>

            {processedReport && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <Card className="border-t-4 border-t-orange-400 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-800">
                                <FileCheck className="h-5 w-5"/> Final Sign-off & Remarks
                            </CardTitle>
                            <CardDescription>Review the compilation and add final comments.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Class Teacher's Remark</Label>
                                <Textarea 
                                    placeholder="Enter overall student performance remark..." 
                                    value={classTeacherComment} 
                                    onChange={(e) => setClassTeacherComment(e.target.value)} 
                                    className="min-h-[100px] rounded-xl" 
                                    disabled={!isTeacher && !isAdminOrDirector}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Headmaster's Remark</Label>
                                <Textarea 
                                    placeholder="Enter final headmaster decision/remark..." 
                                    value={headmasterComment} 
                                    onChange={(e) => setHeadmasterComment(e.target.value)} 
                                    className="min-h-[100px] rounded-xl" 
                                    disabled={!isAdminOrDirector}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end gap-2 bg-slate-50 border-t pt-4">
                            <Button variant="outline" className="rounded-xl h-11 px-6 font-bold" onClick={() => {
                                const el = printRef.current;
                                if (!el) return;
                                el.style.visibility = 'visible';
                                el.style.zIndex = '9999';
                                setTimeout(() => {
                                    window.print();
                                    setTimeout(() => { el.style.visibility = 'hidden'; el.style.zIndex = '-1'; }, 1000);
                                }, 100);
                            }}>
                                <Printer className="mr-2 h-4 w-4"/> Print
                            </Button>
                            <Button onClick={handleDownloadPDF} disabled={isExporting} variant="secondary" className="rounded-xl h-11 px-6 font-bold">
                                <Download className="mr-2 h-4 w-4"/> {isExporting ? 'Exporting...' : 'Save as PDF'}
                            </Button>
                            
                            <Button onClick={handleSaveProgress} disabled={isSaving} className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl h-11 px-6 font-bold">
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>}
                                Save Progress
                            </Button>

                            {isAdminOrDirector && (
                                <Button onClick={handlePublish} disabled={isPublishing} className="bg-green-600 hover:bg-green-700 rounded-xl h-11 px-8 font-black shadow-lg shadow-green-900/10">
                                    {isPublishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-4 w-4"/>}
                                    Publish to Portal
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    {/* LIVE PREVIEW SCROLL AREA */}
                    <Card className="border shadow-2xl overflow-hidden rounded-[2rem]">
                        <CardHeader className="bg-slate-900 text-white flex flex-row justify-between items-center px-8">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Eye className="h-5 w-5 text-indigo-400"/> Interactive Document Preview
                                </CardTitle>
                                <CardDescription className="text-slate-400">Exact replica of the A4 printable document.</CardDescription>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Weighting Applied</p>
                                    <p className="text-xs font-bold text-indigo-400">{CA_WEIGHT}% CA / {EXAM_WEIGHT}% Exam</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 bg-slate-200">
                            <ScrollArea className="h-[900px] w-full">
                                <div className="p-12 flex justify-center">
                                    <div className="shadow-2xl ring-1 ring-black/10 bg-white" style={{ width: '794px' }}>
                                        <ReportCardTemplate
                                            data={processedReport}
                                            classTeacherComment={classTeacherComment}
                                            headmasterComment={headmasterComment}
                                            caWeight={CA_WEIGHT}
                                            examWeight={EXAM_WEIGHT}
                                        />
                                    </div>
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* HIDDEN TEMPLATE FOR CAPTURE */}
            <div
                ref={printRef}
                style={{ visibility: 'hidden', position: 'absolute', top: 0, left: 0, zIndex: -1, width: '794px' }}
            >
                {processedReport && (
                    <ReportCardTemplate
                        data={processedReport}
                        classTeacherComment={classTeacherComment}
                        headmasterComment={headmasterComment}
                        caWeight={CA_WEIGHT}
                        examWeight={EXAM_WEIGHT}
                    />
                )}
            </div>

            <style jsx global>{`
                @media print {
                    body * { visibility: hidden !important; }
                    #print-template,
                    #print-template * { visibility: visible !important; }
                    #print-template {
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        visibility: visible !important;
                        z-index: 9999 !important;
                    }
                    @page {
                        size: A4 portrait;
                        margin: 0;
                    }
                }
            `}</style>
        </div>
    );
}
