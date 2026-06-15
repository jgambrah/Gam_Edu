'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useDoc, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { logAuditEvent } from '@/lib/audit';
import { collection, query, where, getDocs, getDoc, doc, setDoc, serverTimestamp, orderBy, updateDoc, Timestamp, writeBatch } from 'firebase/firestore';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Printer, Download, Search, CheckCircle, FileCheck, GraduationCap, Calendar as CalendarIcon, Eye, Save, Send, ShieldCheck, Lock, AlertCircle, PenTool, Sparkles } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import ReportCardTemplate from './components/ReportCardTemplate';
import { notifyParents } from '@/app/actions/notifications';
import { generateReportCommentAction } from '@/app/actions/report-ai';

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

function formatOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export default function ReportCardManager() {
    const { user } = useUser();
    const { role, profile } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const { toast } = useToast();

    // Selection State
    const [classId, setClassId] = useState('');
    const [term, setTerm] = useState('First Term');
    const [academicYear, setAcademicYear] = useState('2024-2025');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    // Comments State
    const [classTeacherComment, setClassTeacherComment] = useState('');
    const [headmasterComment, setHeadmasterComment] = useState('');

    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isBulkPublishing, setIsBulkPublishing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isGeneratingTeacherComment, setIsGeneratingTeacherComment] = useState(false);
    const [isGeneratingHeadmasterComment, setIsGeneratingHeadmasterComment] = useState(false);
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

    const areDatesMissing = !schoolProfile?.termStartDate || !schoolProfile?.termEndDate;

    const activeStudents = useMemo(() => {
        if (!students) return [];
        return students.filter((s: any) => s.enrollmentStatus === 'Active' || !s.enrollmentStatus);
    }, [students]);

    const reportCardsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !classId || !academicYear || !term) return null;
        return query(
            collection(firestore, 'report-cards'),
            where('schoolId', '==', schoolId),
            where('classId', '==', classId),
            where('academicYear', '==', academicYear),
            where('term', '==', term)
        );
    }, [firestore, schoolId, classId, academicYear, term]);
    const { data: classReportCards } = useCollection<any>(reportCardsQuery);

    const classSummary = useMemo(() => {
        if (!activeStudents || !classReportCards) return null;
        
        const drafts: any[] = [];
        const published: any[] = [];
        const missing: any[] = [];
        
        activeStudents.forEach((student: any) => {
            const report = classReportCards.find((r: any) => r.studentId === student.uid);
            if (!report) {
                missing.push(student);
            } else if (report.status === 'Published') {
                published.push({ student, report });
            } else {
                drafts.push({ student, report });
            }
        });
        
        return { drafts, published, missing };
    }, [activeStudents, classReportCards]);

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
                setProcessedReport(data);
            } else {
                setClassTeacherComment('');
                setHeadmasterComment('');
            }
        };
        fetchExisting();
    }, [selectedStudentId, academicYear, term, firestore, schoolId]);

    const generateReport = async () => {
        if (!firestore || !schoolId || !classId || !selectedStudentId || !schoolProfile) return;
        
        if (areDatesMissing) {
            toast({ variant: 'destructive', title: "Incomplete Configuration", description: "Term dates are required to calculate attendance." });
            return;
        }

        setIsGenerating(true);
        setProcessedReport(null);

        try {
            const targetClass = classes?.find((c: any) => c.id === classId);
            const currentCaWeight = targetClass?.caWeight ?? CA_WEIGHT;
            const currentExamWeight = targetClass?.examWeight ?? EXAM_WEIGHT;

            // 1. Fetch Assessments
            const assessmentsRef = collection(firestore, 'assessments');
            const qAssessments = query(
                assessmentsRef, 
                where('schoolId', '==', schoolId),
                where('classId', '==', classId),
                where('academicYear', '==', academicYear),
                where('term', '==', term)
            );
            const assessmentSnap = await getDocs(qAssessments);
            const allAssessments = assessmentSnap.docs.map(d => d.data());

            // 2. Normalize and Fetch Attendance
            const tStartStr = schoolProfile.termStartDate;
            const tEndStr = schoolProfile.termEndDate;
            const tStartDate = typeof tStartStr === 'string' ? parseISO(tStartStr) : tStartStr.toDate();
            const tEndDate = typeof tEndStr === 'string' ? parseISO(tEndStr) : tEndStr.toDate();

            const attendanceRef = collection(firestore, 'attendance');
            const qAttendance = query(
                attendanceRef,
                where('schoolId', '==', schoolId),
                where('classId', '==', classId),
                where('date', '>=', Timestamp.fromDate(startOfDay(tStartDate))),
                where('date', '<=', Timestamp.fromDate(endOfDay(tEndDate)))
            );
            const attSnap = await getDocs(qAttendance);
            const allAttRecords = attSnap.docs.map(d => d.data());

            // 3. Calculate Attendance Stats
            const uniqueDates = new Set(allAttRecords.map(r => 
                r.date?.toDate ? r.date.toDate().toDateString() : new Date(r.date).toDateString()
            ));
            const totalClassDays = uniqueDates.size;

            const studentAtt = allAttRecords.filter(r => 
                r.studentId === selectedStudentId && (r.status === 'Present' || r.status === 'Late')
            );
            const studentPresentDays = studentAtt.length;

            // 4. Calculate Academic Stats
            const studentTotals: Record<string, number> = {};
            const subjectStats: Record<string, { totalScores: number[], sum: number }> = {};
            subjects?.forEach((sub: any) => { subjectStats[sub.id] = { totalScores: [], sum: 0 }; });
            
            activeStudents.forEach((stu: any) => {
                let grandTotal = 0;
                subjects?.forEach((sub: any) => {
                    const stuSubjAssessments = allAssessments.filter(a => a.studentId === stu.uid && a.subjectId === sub.id);
                    let total100 = 0;
                    if (stuSubjAssessments.length > 0) {
                        const cas = stuSubjAssessments.filter(a => a.assessmentType.includes('CA'));
                        const rawCA = cas.reduce((sum, a) => sum + (a.score || 0), 0) / Math.max(cas.reduce((sum, a) => sum + (a.maxScore || 100), 0), 1) * currentCaWeight;
                        const exams = stuSubjAssessments.filter(a => a.assessmentType.includes('Exam'));
                        const rawExam = exams.reduce((sum, a) => sum + (a.score || 0), 0) / Math.max(exams.reduce((sum, a) => sum + (a.maxScore || 100), 0), 1) * currentExamWeight;
                        
                        // FIX: Round components before adding to total
                        const finalCA = Math.round(rawCA);
                        const finalExam = Math.round(rawExam);
                        total100 = finalCA + finalExam;
                    }
                    grandTotal += total100;
                    if (subjectStats[sub.id]) {
                        subjectStats[sub.id].totalScores.push(total100);
                        subjectStats[sub.id].sum += total100;
                    }
                });
                studentTotals[stu.uid] = grandTotal;
            });

            const myTotal = studentTotals[selectedStudentId] || 0;
            const classPosition = formatOrdinal(Object.values(studentTotals).filter(t => t > myTotal).length + 1);
            const targetStudent = activeStudents.find((s: any) => s.uid === selectedStudentId);

            const reportRows: any[] = [];
            let myGrandTotal = 0;
            let subjectsTaken = 0;
            subjects?.forEach((sub: any) => {
                const myAssessments = allAssessments.filter(a => a.studentId === selectedStudentId && a.subjectId === sub.id);
                if (myAssessments.length === 0) return;
                const cas = myAssessments.filter(a => a.assessmentType.includes('CA'));
                const rawCA = cas.reduce((sum, a) => sum + (a.score || 0), 0) / Math.max(cas.reduce((sum, a) => sum + (a.maxScore || 100), 0), 1) * currentCaWeight;
                const exams = myAssessments.filter(a => a.assessmentType.includes('Exam'));
                const rawExam = exams.reduce((sum, a) => sum + (a.score || 0), 0) / Math.max(exams.reduce((sum, a) => sum + (a.maxScore || 100), 0), 1) * currentExamWeight;
                
                // FIX: Round components before adding to total to prevent addition errors on paper
                const finalCA = Math.round(rawCA);
                const finalExam = Math.round(rawExam);
                const total100 = finalCA + finalExam;

                myGrandTotal += total100;
                subjectsTaken++;
                const { grade, autoRemark } = getGradeAndRemark(total100);
                reportRows.push({
                    subjectName: sub.name,
                    ca: finalCA,
                    exam: finalExam,
                    total: total100, grade, autoRemark,
                    classAverage: subjectStats[sub.id].totalScores.length > 0
                        ? Math.round(subjectStats[sub.id].sum / subjectStats[sub.id].totalScores.length) : 0,
                    position: formatOrdinal(subjectStats[sub.id].totalScores.filter(s => s > total100).length + 1)
                });
            });

            // 5. Signatures Conversion
            const selectedClass = classes?.find((c: any) => c.id === classId);
            const classTeacherId = selectedClass?.teacherId;

            let classTeacherSignatureUrl = null;
            let classTeacherName = 'Class Teacher';

            if (classTeacherId) {
                const teacherDoc = await getDoc(doc(firestore, 'staff', classTeacherId));
                if (teacherDoc.exists()) {
                    const tData = teacherDoc.data();
                    classTeacherSignatureUrl = tData.signatureBase64 || tData.signatureUrl || null;
                    classTeacherName = `${tData.firstName || ''} ${tData.lastName || ''}`.trim();
                }
            }

            const schoolDoc = await getDoc(doc(firestore, 'schools', schoolId));
            const schoolData = schoolDoc.data();

            const [logoB64, headmasterSigB64, teacherSigB64] = await Promise.all([
                schoolProfile?.logoUrl ? getBase64ImageFromUrl(schoolProfile.logoUrl) : Promise.resolve(''),
                schoolData?.headmasterSignatureUrl ? getBase64ImageFromUrl(schoolData.headmasterSignatureUrl) : Promise.resolve(''),
                classTeacherSignatureUrl ? getBase64ImageFromUrl(classTeacherSignatureUrl) : Promise.resolve(''),
            ]);

            setProcessedReport({
                student: targetStudent,
                studentId: selectedStudentId,
                rows: reportRows,
                overallAverage: subjectsTaken > 0 ? Math.round(myGrandTotal / subjectsTaken) : 0,
                classPosition,
                totalStudents: activeStudents.length,
                studentPresentDays,
                totalClassDays,
                id: `${selectedStudentId}_${academicYear.replace(/\//g, '-')}_${term.replace(/\s+/g, '')}`,
                schoolName: schoolProfile?.name,
                schoolMotto: schoolProfile?.motto,
                schoolAddress: schoolProfile?.address,
                schoolPhone: schoolProfile?.phone,
                schoolEmail: schoolProfile?.email,
                brandColor: schoolProfile?.brandColor || '#1e293b',
                nextTermDate: schoolProfile?.nextTermDate || null,
                logoBase64: logoB64,
                headmasterSigBase64: headmasterSigB64,
                teacherSigBase64: teacherSigB64,
                classTeacherName: classTeacherName,
                classTeacherSignatureUrl: classTeacherSignatureUrl,
                headmasterSignatureUrl: schoolData?.headmasterSignatureUrl || null,
                term,
                academicYear,
                className: classes?.find((c: any) => c.id === classId)?.name || '',
                caWeight: currentCaWeight,
                examWeight: currentExamWeight,
            });

        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: "Error", description: "Failed to compile report. Ensure assessments and attendance are recorded." });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSaveProgress = async () => {
        if (!processedReport || !schoolId || isSaving) return;
        setIsSaving(true);
        try {
            const finalData = {
                ...processedReport,
                schoolId, 
                status: 'Draft', 
                classTeacherComment, 
                headmasterComment,
                lastUpdatedBy: user?.uid, 
                updatedAt: serverTimestamp()
            };
            
            const { logoBase64, teacherSigBase64, headmasterSigBase64, ...dbFriendlyData } = finalData;
            await setDoc(doc(firestore!, 'report-cards', processedReport.id), dbFriendlyData, { merge: true });
            toast({ title: "Draft Saved" });

            await logAuditEvent({
                firestore: firestore!,
                schoolId,
                userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
                action: 'SAVE_REPORT_CARD_DRAFT',
                details: `Saved draft report card for student ${processedReport.student?.firstName || ''} ${processedReport.student?.lastName || ''}`
            });
        } catch (e) {
            toast({ variant: 'destructive', title: "Error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!processedReport || !schoolId || isPublishing) return;
        setIsPublishing(true);
        try {
            const schoolDoc = await getDoc(doc(firestore!, 'schools', schoolId));
            const schoolData = schoolDoc.data();

            const finalData = {
                ...processedReport,
                status: 'Published', 
                publishedAt: serverTimestamp(),
                classTeacherComment, 
                headmasterComment,
                headmasterName: schoolData?.headmasterName || 'Head of School',
                headmasterSignatureUrl: schoolData?.headmasterSignatureUrl || null,
                headmasterSignedAt: serverTimestamp(),
                digitalFingerprint: `AUTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
            };

            const { logoBase64, teacherSigBase64, headmasterSigBase64, ...dbFriendlyData } = finalData;
            
            await setDoc(doc(firestore!, 'report-cards', processedReport.id), dbFriendlyData, { merge: true });
            
            toast({ title: "Report Published!" });
            
            await logAuditEvent({
                firestore: firestore!,
                schoolId,
                userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
                action: 'PUBLISH_REPORT_CARD',
                details: `Published report card for student ${processedReport.student?.firstName || ''} ${processedReport.student?.lastName || ''} (${term}, ${academicYear})`
            });

            await notifyParents([selectedStudentId!], "Report Card Ready 🎓", `Report for ${processedReport.student?.firstName} is now available.`, "/dashboard/my-reports");
        } catch (e) {
            toast({ variant: 'destructive', title: "Error" });
        } finally {
            setIsPublishing(false);
        }
    };

    const handleBulkPublish = async () => {
        if (!firestore || !schoolId || !classSummary || classSummary.drafts.length === 0 || isBulkPublishing) return;
        setIsBulkPublishing(true);
        try {
            const schoolDoc = await getDoc(doc(firestore, 'schools', schoolId));
            const schoolData = schoolDoc.data();
            const headmasterName = schoolData?.headmasterName || 'Head of School';
            const headmasterSignatureUrl = schoolData?.headmasterSignatureUrl || null;

            const batch = writeBatch(firestore);
            const studentIdsToNotify: string[] = [];

            classSummary.drafts.forEach(({ student, report }) => {
                const reportRef = doc(firestore, 'report-cards', report.id);
                batch.update(reportRef, {
                    status: 'Published',
                    publishedAt: serverTimestamp(),
                    headmasterName,
                    headmasterSignatureUrl,
                    headmasterSignedAt: serverTimestamp(),
                    digitalFingerprint: `AUTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
                });
                studentIdsToNotify.push(student.uid);
            });

            await batch.commit();
            toast({ title: "Bulk Publish Complete!", description: `Successfully published ${studentIdsToNotify.length} report cards.` });
            
            await logAuditEvent({
                firestore,
                schoolId,
                userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
                action: 'BULK_PUBLISH_REPORT_CARDS',
                details: `Bulk published ${studentIdsToNotify.length} report cards for class ${classes?.find(c => c.id === classId)?.name || classId} (${term}, ${academicYear})`
            });

            // Notify parents in background (non-blocking)
            notifyParents(studentIdsToNotify, "Report Card Ready 🎓", "Terminal report cards are now available.", "/dashboard/my-reports")
                .catch(err => console.error("Bulk notification failed:", err));
        } catch (e) {
            console.error("Bulk publish error:", e);
            toast({ variant: 'destructive', title: "Bulk Publish Failed" });
        } finally {
            setIsBulkPublishing(false);
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

            await new Promise(resolve => setTimeout(resolve, 800));

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 794,
                windowHeight: 1123,
            });

            element.style.visibility = 'hidden';
            element.style.position = 'absolute';
            element.style.display = 'none';

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            pdf.save(`${processedReport.student?.firstName}_Report_${term}.pdf`);
            toast({ title: "Export Complete" });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Export Failed" });
        } finally {
            setIsExporting(false);
        }
    };

    const handleGenerateComment = async (type: 'Teacher' | 'Headmaster') => {
        if (!processedReport || !schoolId) return;
        
        const setLoader = type === 'Teacher' ? setIsGeneratingTeacherComment : setIsGeneratingHeadmasterComment;
        const setComment = type === 'Teacher' ? setClassTeacherComment : setHeadmasterComment;
        
        setLoader(true);
        try {
            const res = await generateReportCommentAction(
                schoolId, 
                `${processedReport.student.firstName} ${processedReport.student.lastName}`, 
                processedReport.overallAverage, 
                type,
                term
            );
            
            if (res.success && res.text) {
                setComment(res.text); 
                toast({ title: "Comment Generated ✨", description: "You can edit the text before publishing." });
            } else {
                toast({ variant: 'destructive', title: "AI Error", description: res.error });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Report Card Manager</h1>
                    <p className="text-slate-500 font-medium italic">Sign and publish terminal results.</p>
                </div>
            </div>

            <Card className="border-t-4 border-t-indigo-600 shadow-md print:hidden">
                <CardHeader>
                    <CardTitle className="text-lg">Filter Student Records</CardTitle>
                    <CardDescription>Select academic period and student to compile report.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label>Academic Year</Label>
                        <Select value={academicYear} onValueChange={setAcademicYear}>
                            <SelectTrigger className="bg-white"><SelectValue/></SelectTrigger>
                            <SelectContent>{MOCK_ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Term</Label>
                        <Select value={term} onValueChange={setTerm}>
                            <SelectTrigger className="bg-white"><SelectValue/></SelectTrigger>
                            <SelectContent>{MOCK_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Class</Label>
                        <Select value={classId} onValueChange={setClassId}>
                            <SelectTrigger className="bg-white"><SelectValue placeholder="Select Class"/></SelectTrigger>
                            <SelectContent>{classes?.map((c:any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Student</Label>
                        <Select value={selectedStudentId || ''} onValueChange={setSelectedStudentId} disabled={!classId}>
                            <SelectTrigger className="bg-white"><SelectValue placeholder="Choose Student"/></SelectTrigger>
                            <SelectContent>{activeStudents.map((s:any) => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter className="justify-end bg-slate-50 pt-4 border-t">
                    <Button onClick={generateReport} disabled={isGenerating || !selectedStudentId} className="bg-indigo-600 hover:bg-indigo-700 px-8 h-12 rounded-xl font-bold">
                        {isGenerating ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Search className="mr-2 h-4 w-4"/>} Compile Report
                    </Button>
                </CardFooter>
            </Card>

            {classId && classSummary && (
                <Card className="border-t-4 border-t-emerald-600 shadow-md print:hidden">
                    <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <GraduationCap className="text-emerald-600 h-5 w-5" /> 
                                Class Status: {classes?.find((c: any) => c.id === classId)?.name || ''}
                            </CardTitle>
                            <CardDescription>
                                Overview of terminal report cards compilation for this class.
                            </CardDescription>
                        </div>
                        {isAdminOrDirector && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        disabled={classSummary.drafts.length === 0 || isBulkPublishing} 
                                        className="bg-green-600 hover:bg-green-700 font-bold"
                                    >
                                        {isBulkPublishing ? (
                                            <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                        ) : (
                                            <ShieldCheck className="mr-2 h-4 w-4" />
                                        )}
                                        Bulk Publish Drafts ({classSummary.drafts.length})
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Bulk Publish Report Cards?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will sign and publish all **{classSummary.drafts.length}** draft report cards for this class. 
                                            Parents will be notified immediately and will be able to view their children's terminal report cards.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                            onClick={handleBulkPublish} 
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Publish All Drafts
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-xl bg-green-50 border border-green-100 flex items-center gap-3">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                                <div>
                                    <p className="text-xs font-semibold text-green-600 uppercase">Published</p>
                                    <p className="text-2xl font-bold text-slate-800">{classSummary.published.length}</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-center gap-3">
                                <PenTool className="h-8 w-8 text-amber-600" />
                                <div>
                                    <p className="text-xs font-semibold text-amber-600 uppercase">Drafts Ready</p>
                                    <p className="text-2xl font-bold text-slate-800">{classSummary.drafts.length}</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                                <AlertCircle className="h-8 w-8 text-slate-400" />
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Not Compiled</p>
                                    <p className="text-2xl font-bold text-slate-800">{classSummary.missing.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* List breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t">
                            <div>
                                <h4 className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wide">Published ({classSummary.published.length})</h4>
                                <ScrollArea className="h-32 border rounded-lg p-2 bg-white">
                                    {classSummary.published.length > 0 ? (
                                        classSummary.published.map(({ student }: any) => (
                                            <div key={student.uid} className="text-xs py-1 border-b last:border-0 font-medium text-slate-700">
                                                ✅ {student.firstName} {student.lastName}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic p-2">No published report cards.</p>
                                    )}
                                </ScrollArea>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">Drafts Ready ({classSummary.drafts.length})</h4>
                                <ScrollArea className="h-32 border rounded-lg p-2 bg-white">
                                    {classSummary.drafts.length > 0 ? (
                                        classSummary.drafts.map(({ student }: any) => (
                                            <div key={student.uid} className="text-xs py-1 border-b last:border-0 font-medium text-slate-700 flex justify-between items-center">
                                                <span>📝 {student.firstName} {student.lastName}</span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-5 text-[10px] text-indigo-600 font-bold hover:text-indigo-800 px-1"
                                                    onClick={() => setSelectedStudentId(student.uid)}
                                                >
                                                    View
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic p-2">No drafts compiled.</p>
                                    )}
                                </ScrollArea>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Not Compiled ({classSummary.missing.length})</h4>
                                <ScrollArea className="h-32 border rounded-lg p-2 bg-white">
                                    {classSummary.missing.length > 0 ? (
                                        classSummary.missing.map((student: any) => (
                                            <div key={student.uid} className="text-xs py-1 border-b last:border-0 font-medium text-slate-700 flex justify-between items-center">
                                                <span>⚠️ {student.firstName} {student.lastName}</span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-5 text-[10px] text-indigo-600 font-bold hover:text-indigo-800 px-1"
                                                    onClick={() => setSelectedStudentId(student.uid)}
                                                >
                                                    Compile
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic p-2">All report cards compiled!</p>
                                    )}
                                </ScrollArea>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {processedReport && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <Card className="border-t-4 border-t-orange-400 shadow-md">
                        <CardHeader><CardTitle>Final Remarks</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="font-bold">Class Teacher's Remark</Label>
                                    <Button 
                                        variant="ghost" size="sm" 
                                        className="text-purple-600 h-6 gap-1" 
                                        onClick={() => handleGenerateComment('Teacher')}
                                        disabled={isGeneratingTeacherComment || (!isTeacher && !isAdminOrDirector)}
                                    >
                                        {isGeneratingTeacherComment ? <Loader2 className="h-3 w-3 animate-spin"/> : <Sparkles className="h-3 w-3"/>}
                                        AI Draft
                                    </Button>
                                </div>
                                <Textarea placeholder="Overall performance remark..." value={classTeacherComment} onChange={(e) => setClassTeacherComment(e.target.value)} rows={4} disabled={!isTeacher && !isAdminOrDirector}/>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="font-bold">Headmaster's Remark</Label>
                                    <Button 
                                        variant="ghost" size="sm" 
                                        className="text-purple-600 h-6 gap-1" 
                                        onClick={() => handleGenerateComment('Headmaster')}
                                        disabled={isGeneratingHeadmasterComment || !isAdminOrDirector}
                                    >
                                        {isGeneratingHeadmasterComment ? <Loader2 className="h-3 w-3 animate-spin"/> : <Sparkles className="h-3 w-3"/>}
                                        AI Draft
                                    </Button>
                                </div>
                                <Textarea placeholder="Headmaster final decision..." value={headmasterComment} onChange={(e) => setHeadmasterComment(e.target.value)} rows={4} disabled={!isAdminOrDirector}/>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end gap-2 bg-slate-50 border-t pt-4">
                            <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4"/> Print</Button>
                            <Button onClick={handleDownloadPDF} disabled={isExporting} variant="secondary">{isExporting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Download className="mr-2 h-4 w-4"/>} Save PDF</Button>
                            <Button onClick={handleSaveProgress} disabled={isSaving} className="bg-slate-800"><Save className="mr-2 h-4 w-4"/> Save Draft</Button>
                            {isAdminOrDirector && (
                                <Button onClick={handlePublish} disabled={isPublishing} className="bg-green-600 hover:bg-green-700">
                                    {isPublishing ? <Loader2 className="animate-spin h-4 w-4"/> : <ShieldCheck className="mr-2 h-4 w-4"/>} Sign & Publish
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    <div className="flex justify-center bg-slate-200 p-12 rounded-[3rem] border-8 border-white shadow-inner overflow-x-auto">
                        <div className="shadow-2xl ring-1 ring-black/10 bg-white" style={{ width: '794px' }}>
                            <ReportCardTemplate
                                data={processedReport}
                                classTeacherComment={classTeacherComment}
                                headmasterComment={headmasterComment}
                                caWeight={processedReport?.caWeight ?? CA_WEIGHT}
                                examWeight={processedReport?.examWeight ?? EXAM_WEIGHT}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div
                ref={printRef}
                style={{ visibility: 'hidden', position: 'absolute', top: 0, left: 0, zIndex: -1, width: '794px', display: 'none' }}
            >
                {processedReport && (
                    <ReportCardTemplate
                        data={processedReport}
                        classTeacherComment={classTeacherComment}
                        headmasterComment={headmasterComment}
                        caWeight={processedReport?.caWeight ?? CA_WEIGHT}
                        examWeight={processedReport?.examWeight ?? EXAM_WEIGHT}
                    />
                )}
            </div>

            <style jsx global>{`
                @media print {
                    body * { visibility: hidden !important; }
                    #pdf-content, #pdf-content * { visibility: visible !important; }
                    #pdf-content { position: fixed !important; left: 0 !important; top: 0 !important; width: 210mm !important; height: auto !important; margin: 0 !important; padding: 40px !important; border: none !important; box-shadow: none !important; }
                }
            `}</style>
        </div>
    );
}
