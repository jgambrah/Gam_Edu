'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useDoc, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { logAuditEvent } from '@/lib/audit';
import { collection, query, where, getDocs, getDoc, doc, setDoc, serverTimestamp, updateDoc, Timestamp, writeBatch } from 'firebase/firestore';
import { format, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Printer, Download, Search, CheckCircle, FileCheck, GraduationCap, Eye, Save, ShieldCheck, AlertCircle, PenTool, Sparkles, BookOpen, User, ChevronRight, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { getGradeFromScale } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import CreditBalance from '@/components/CreditBalance';

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

    // Promotion State
    const [promotionDecision, setPromotionDecision] = useState<'Promoted' | 'Repeated' | 'Graduated' | ''>('');
    const [promotedToClassId, setPromotedToClassId] = useState<string>('');

    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isBulkPublishing, setIsBulkPublishing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isPrintingAll, setIsPrintingAll] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);
    const [batchLogoBase64, setBatchLogoBase64] = useState('');
    const [batchHeadmasterSigBase64, setBatchHeadmasterSigBase64] = useState('');
    const [batchTeacherSigBase64, setBatchTeacherSigBase64] = useState('');
    const [isGeneratingTeacherComment, setIsGeneratingTeacherComment] = useState(false);
    const [isGeneratingHeadmasterComment, setIsGeneratingHeadmasterComment] = useState(false);
    const [processedReport, setProcessedReport] = useState<any>(null);
    
    const printRef = useRef<HTMLDivElement>(null);

    const isAdminOrDirector = ['administrator', 'director'].includes(role?.toLowerCase() || '');
    const isTeacher = role?.toLowerCase() === 'teacher';

    // Data Fetching
    const classesQuery = useMemoFirebase(() => {
        if(!firestore || !user || !schoolId) return null;
        return query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
    }, [firestore, user, schoolId]);
    const { data: classes, isLoading: isLoadingClasses } = useCollection<any>(classesQuery);

    const timetableQuery = useMemoFirebase(() => 
      (firestore && schoolId && role?.toLowerCase() === 'teacher')
        ? query(collection(firestore, 'timetables'), where('schoolId', '==', schoolId)) 
        : null, 
    [firestore, schoolId, role]);
    const { data: timetable } = useCollection<any>(timetableQuery);

    const visibleClasses = useMemo(() => {
        if (!classes) return [];
        if (role?.toLowerCase() !== 'teacher') return classes;
        const subjectClassIds = timetable?.filter((t: any) => t.teacherId === user?.uid).map((t: any) => t.classId) || [];
        return classes.filter((c: any) => c.teacherId === user?.uid || subjectClassIds.includes(c.id));
    }, [classes, timetable, role, user?.uid]);

    // Class access guard
    useEffect(() => {
        if (classId && !isLoadingClasses) {
            if (role?.toLowerCase() === 'teacher') {
                const isAuthorized = visibleClasses.some((c: any) => c.id === classId);
                if (!isAuthorized) {
                    toast({
                        variant: 'destructive',
                        title: 'Access Restricted',
                        description: 'You do not have access to this class report cards.'
                    });
                    setClassId(visibleClasses[0]?.id || '');
                    setSelectedStudentId(null);
                    setProcessedReport(null);
                }
            }
        }
    }, [classId, role, visibleClasses, isLoadingClasses, toast]);

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

    useEffect(() => {
        if (schoolProfile) {
            if (schoolProfile.academicYear) {
                setAcademicYear(schoolProfile.academicYear);
            }
            if (schoolProfile.term) {
                setTerm(schoolProfile.term);
            }
        }
    }, [schoolProfile]);

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
        if (!selectedStudentId || !academicYear || !term || !firestore || !schoolId) {
            setClassTeacherComment('');
            setHeadmasterComment('');
            setPromotionDecision('');
            setPromotedToClassId('');
            return;
        }
        const reportId = `${selectedStudentId}_${academicYear.replace(/\//g, '-')}_${term.replace(/\s+/g, '')}`;
        const fetchExisting = async () => {
            const docRef = doc(firestore, 'report-cards', reportId);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                const data = snap.data();
                setClassTeacherComment(data.classTeacherComment || '');
                setHeadmasterComment(data.headmasterComment || '');
                setPromotionDecision(data.promotionDecision || '');
                setPromotedToClassId(data.promotedToClassId || '');
                setProcessedReport(data);
            } else {
                setClassTeacherComment('');
                setHeadmasterComment('');
                setPromotionDecision('');
                setPromotedToClassId('');
            }
        };
        fetchExisting();
    }, [selectedStudentId, academicYear, term, firestore, schoolId]);

    const generateReport = async () => {
        if (!firestore || !schoolId || !classId || !selectedStudentId || !schoolProfile) return;
        
        if (areDatesMissing) {
            toast({ variant: 'destructive', title: "Dates Not Configured", description: "Term start and end dates must be set under Settings to calculate attendance." });
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

            // 2. Attendance Date Calculation
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

            // 3. Attendance Ratios
            const uniqueDates = new Set(allAttRecords.map(r => 
                r.date?.toDate ? r.date.toDate().toDateString() : new Date(r.date).toDateString()
            ));
            const totalClassDays = uniqueDates.size;

            const studentAtt = allAttRecords.filter(r => 
                r.studentId === selectedStudentId && (r.status === 'Present' || r.status === 'Late')
            );
            const studentPresentDays = studentAtt.length;

            // 4. Grades Weighting & Position computation
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
                
                const finalCA = Math.round(rawCA);
                const finalExam = Math.round(rawExam);
                const total100 = finalCA + finalExam;

                myGrandTotal += total100;
                subjectsTaken++;
                const { grade, autoRemark } = getGradeFromScale(total100, schoolProfile?.gradingSystem);
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

            // 5. Signatures Base64 Conversion
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
                schoolId,
                classId,
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
                logoUrl: schoolProfile?.logoUrl || null, // Stored to assist parent view loading
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
                reportCardPositionMode: schoolProfile?.reportCardPositionMode || 'both',
                gradingSystem: schoolProfile?.gradingSystem || null,
            });

        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: "Compilation Error", description: "Failed to pull marks or dates ledger logs." });
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
                classId,
                status: 'Draft', 
                classTeacherComment, 
                headmasterComment,
                ...(term === 'Third Term' ? {
                    promotionDecision: promotionDecision || null,
                    promotedToClassId: promotionDecision === 'Promoted' ? promotedToClassId || null : null,
                    promotedToClassName: promotionDecision === 'Promoted' 
                        ? (classes?.find((c: any) => c.id === promotedToClassId)?.name || null)
                        : (promotionDecision === 'Repeated' ? processedReport.className : (promotionDecision === 'Graduated' ? 'Graduated' : null))
                } : {}),
                lastUpdatedBy: user?.uid, 
                updatedAt: serverTimestamp()
            };
            
            const { logoBase64, teacherSigBase64, headmasterSigBase64, ...dbFriendlyData } = finalData;
            await setDoc(doc(firestore!, 'report-cards', processedReport.id), dbFriendlyData, { merge: true });
            setProcessedReport(finalData);
            toast({ title: "Draft Report Saved" });

            await logAuditEvent({
                firestore: firestore!,
                schoolId,
                userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
                action: 'SAVE_REPORT_CARD_DRAFT',
                details: `Saved draft report card for student ${processedReport.student?.firstName || ''} ${processedReport.student?.lastName || ''}`
            });
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "Database Error", description: "Could not write draft to Firestore." });
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
                schoolId,
                classId,
                status: 'Published', 
                publishedAt: serverTimestamp(),
                classTeacherComment, 
                headmasterComment,
                ...(term === 'Third Term' ? {
                    promotionDecision: promotionDecision || null,
                    promotedToClassId: promotionDecision === 'Promoted' ? promotedToClassId || null : null,
                    promotedToClassName: promotionDecision === 'Promoted' 
                        ? (classes?.find((c: any) => c.id === promotedToClassId)?.name || null)
                        : (promotionDecision === 'Repeated' ? processedReport.className : (promotionDecision === 'Graduated' ? 'Graduated' : null))
                } : {}),
                headmasterName: schoolData?.headmasterName || 'Head of School',
                headmasterSignatureUrl: schoolData?.headmasterSignatureUrl || null,
                headmasterSignedAt: serverTimestamp(),
                digitalFingerprint: `AUTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
            };

            const { logoBase64, teacherSigBase64, headmasterSigBase64, ...dbFriendlyData } = finalData;
            await setDoc(doc(firestore!, 'report-cards', processedReport.id), dbFriendlyData, { merge: true });
            setProcessedReport(finalData);
            toast({ title: "Report Card Signed & Published! 🎓", description: "Parents and students can now view the official transcript." });
            
            await logAuditEvent({
                firestore: firestore!,
                schoolId,
                userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
                action: 'PUBLISH_REPORT_CARD',
                details: `Published report card for student ${processedReport.student?.firstName || ''} ${processedReport.student?.lastName || ''} (${term}, ${academicYear})`
            });

            await notifyParents([selectedStudentId!], "Report Card Ready 🎓", `Terminal report card for ${processedReport.student?.firstName} has been released.`, "/dashboard/my-reports");
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "Publish Error", description: "Database publish transaction failed." });
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
            toast({ title: "Bulk Publish Successful! 🎉", description: `Released ${studentIdsToNotify.length} report cards.` });
            
            await logAuditEvent({
                firestore,
                schoolId,
                userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Anonymous'),
                action: 'BULK_PUBLISH_REPORT_CARDS',
                details: `Bulk published ${studentIdsToNotify.length} report cards for class ${classes?.find(c => c.id === classId)?.name || classId} (${term}, ${academicYear})`
            });

            notifyParents(studentIdsToNotify, "Report Card Ready 🎓", "Terminal report cards are now available.", "/dashboard/my-reports")
                .catch(err => console.error("Bulk notification failed:", err));
        } catch (e: any) {
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
            toast({ title: "PDF Export Complete 📥" });
        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: "PDF Generation Failed" });
        } finally {
            setIsExporting(false);
        }
    };

    const handleDownloadAllPDF = async () => {
        if (!classReportCards || classReportCards.length === 0 || !schoolId || !schoolProfile) {
            toast({ variant: 'destructive', title: "No Reports", description: "There are no compiled report cards to print for this class." });
            return;
        }
        setIsExporting(true);
        setExportProgress(1);

        try {
            // 1. Pre-fetch school logo and signatures in base64 format once
            const schoolDoc = await getDoc(doc(firestore!, 'schools', schoolId));
            const schoolData = schoolDoc?.data();

            const [logoB64, headmasterSigB64] = await Promise.all([
                schoolProfile.logoUrl ? getBase64ImageFromUrl(schoolProfile.logoUrl) : Promise.resolve(''),
                schoolData?.headmasterSignatureUrl ? getBase64ImageFromUrl(schoolData.headmasterSignatureUrl) : Promise.resolve(''),
            ]);

            let classTeacherSignatureUrl = null;
            const selectedClass = classes?.find((c: any) => c.id === classId);
            const classTeacherId = selectedClass?.teacherId;

            if (classTeacherId) {
                const teacherDoc = await getDoc(doc(firestore!, 'staff', classTeacherId));
                if (teacherDoc.exists()) {
                    const tData = teacherDoc.data();
                    classTeacherSignatureUrl = tData.signatureBase64 || tData.signatureUrl || null;
                }
            }

            const teacherSigB64 = classTeacherSignatureUrl 
                ? await getBase64ImageFromUrl(classTeacherSignatureUrl) 
                : '';

            setBatchLogoBase64(logoB64);
            setBatchHeadmasterSigBase64(headmasterSigB64);
            setBatchTeacherSigBase64(teacherSigB64);
            
            setIsPrintingAll(true);

            // Give DOM time to render all report cards with base64 images
            await new Promise(resolve => setTimeout(resolve, 2000));

            const printArea = printRef.current;
            if (!printArea) throw new Error("Print area not found");

            // Make print area temporarily visible to the capture engine
            printArea.style.visibility = 'visible';
            printArea.style.position = 'fixed';
            printArea.style.top = '0';
            printArea.style.left = '0';
            printArea.style.zIndex = '-1000';
            printArea.style.display = 'block';

            const cardElements = printArea.getElementsByClassName('print-page-break');
            if (cardElements.length === 0) {
                printArea.style.visibility = 'hidden';
                printArea.style.position = 'absolute';
                printArea.style.display = 'none';
                throw new Error("No reports found to compile");
            }

            const pdf = new jsPDF('p', 'mm', 'a4');

            for (let i = 0; i < cardElements.length; i++) {
                setExportProgress(i + 1);
                const element = cardElements[i] as HTMLElement;
                
                const canvas = await html2canvas(element, {
                    scale: 1.5,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    windowWidth: 794,
                    windowHeight: 1123,
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.9);
                
                if (i > 0) {
                    pdf.addPage();
                }
                pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            }

            // Cleanup visibility
            printArea.style.visibility = 'hidden';
            printArea.style.position = 'absolute';
            printArea.style.display = 'none';

            const className = classes?.find((c: any) => c.id === classId)?.name || 'Class';
            pdf.save(`All_Reports_${className}_${term}.pdf`);
            toast({ title: "Class PDF Compilation Complete 📥", description: `Successfully generated a ${cardElements.length}-page report card document.` });
        } catch (error: any) {
            console.error(error);
            const printArea = printRef.current;
            if (printArea) {
                printArea.style.visibility = 'hidden';
                printArea.style.position = 'absolute';
                printArea.style.display = 'none';
            }
            toast({ variant: 'destructive', title: "PDF Generation Failed", description: error.message || "An error occurred during combined PDF rendering." });
        } finally {
            setIsExporting(false);
            setIsPrintingAll(false);
            setExportProgress(0);
            setBatchLogoBase64('');
            setBatchHeadmasterSigBase64('');
            setBatchTeacherSigBase64('');
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
                toast({ title: "AI Draft Remark Generated ✨", description: "Review and edit text comments before saving." });
            } else {
                toast({ variant: 'destructive', title: "AI Remark Failed", description: res.error });
            }
        } catch (e: any) {
            console.error(e);
            toast({ variant: 'destructive', title: "AI Connection Error", description: e.message || "Failed to generate AI comments." });
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            {/* Premium Gradient Header Banner */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-12 shadow-2xl border border-white/10 group">
                <div className="absolute right-[-40px] bottom-[-40px] opacity-10 text-white transition-transform duration-700 group-hover:scale-110 pointer-events-none">
                    <FileText className="h-60 w-60 animate-pulse" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
                            Report Card Manager
                        </h1>
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/10 text-indigo-300 rounded-full border border-white/5">
                                Resolved Role: {role || 'Loading...'}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-indigo-500/20 text-indigo-200 rounded-full border border-indigo-500/10">
                                Permission: {isAdminOrDirector ? 'Admin/Director (Sign & Publish Active)' : 'Staff/Teacher (Draft Only)'}
                            </span>
                        </div>
                        <p className="text-indigo-200 text-sm max-w-2xl font-light leading-relaxed">
                            Draft remarks, sign with electronic stamps, and batch publish certified academic terminal reports.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        {role?.toLowerCase() !== 'student' && role?.toLowerCase() !== 'parent' && (
                            <CreditBalance />
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Roster Selection Card */}
            <Card className="border border-slate-100 shadow-md rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="border-b border-slate-50 bg-slate-50/20 p-6">
                    <CardTitle className="text-lg font-black text-slate-800">Filter Student Records</CardTitle>
                    <CardDescription className="text-slate-400">Select academic term settings and target student to compile report card.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-white">
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Academic Year</Label>
                        <Select value={academicYear} onValueChange={setAcademicYear} disabled={role?.toLowerCase() === 'teacher'}>
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>{MOCK_ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Term</Label>
                        <Select value={term} onValueChange={setTerm} disabled={role?.toLowerCase() === 'teacher'}>
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>{MOCK_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Class</Label>
                        <Select value={classId} onValueChange={(val) => { setClassId(val); setSelectedStudentId(null); setProcessedReport(null); }}>
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm">
                                <SelectValue placeholder="Select Class"/>
                            </SelectTrigger>
                            <SelectContent>{visibleClasses?.map((c:any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Student</Label>
                        <Select value={selectedStudentId || ''} onValueChange={setSelectedStudentId} disabled={!classId}>
                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-500 shadow-sm">
                                <SelectValue placeholder="Choose Student"/>
                            </SelectTrigger>
                            <SelectContent>{activeStudents.map((s:any) => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter className="justify-end bg-slate-50/50 p-4 border-t border-slate-100">
                    <Button 
                      onClick={generateReport} 
                      disabled={isGenerating || !selectedStudentId} 
                      className="bg-indigo-600 hover:bg-indigo-700 px-8 h-11 rounded-xl font-bold text-white shadow-sm transition-all"
                    >
                        {isGenerating ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Search className="mr-2 h-4 w-4"/>} Compile Transcript
                    </Button>
                </CardFooter>
            </Card>

            {/* Class Summary widgets */}
            {classId && classSummary && (
                <Card className="border border-emerald-100 shadow-md rounded-[2rem] overflow-hidden bg-white">
                    <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-slate-50">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2 font-black text-slate-800">
                                <GraduationCap className="text-emerald-600 h-5 w-5" /> 
                                Class Status Summary: {classes?.find((c: any) => c.id === classId)?.name || ''}
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Overview of terminal report cards draft status for this class.
                            </CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                            {classReportCards && classReportCards.length > 0 && (
                                <Button 
                                    onClick={handleDownloadAllPDF} 
                                    disabled={isExporting} 
                                    className="bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl text-white shadow h-10 px-6 text-xs flex items-center"
                                >
                                    {isExporting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Download className="mr-2 h-4 w-4"/>}
                                    {isExporting && exportProgress > 0 
                                        ? `Compiling ${exportProgress} / ${classReportCards.length}...` 
                                        : `Download Combined PDF (${classReportCards.length})`}
                                </Button>
                            )}
                            {isAdminOrDirector && (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button 
                                            disabled={classSummary.drafts.length === 0 || isBulkPublishing} 
                                            className="bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-white shadow h-10 px-6 text-xs"
                                        >
                                            {isBulkPublishing ? (
                                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                            ) : (
                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                            )}
                                            Bulk Publish Drafts ({classSummary.drafts.length})
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="rounded-3xl border-0 shadow-2xl p-6">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="font-black text-slate-800">Bulk Publish Report Cards?</AlertDialogTitle>
                                            <AlertDialogDescription className="text-slate-400 text-sm leading-relaxed">
                                                This will officially sign and publish all **{classSummary.drafts.length}** draft report cards. Parents and students will be notified in-app and can download the files immediately.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter className="gap-2 mt-4">
                                            <AlertDialogCancel className="rounded-xl border border-slate-200 text-slate-600 font-bold">Cancel</AlertDialogCancel>
                                            <AlertDialogAction 
                                                onClick={handleBulkPublish} 
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                                            >
                                                Publish All Drafts
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-3">
                                <div className="bg-emerald-100 p-2.5 rounded-full text-emerald-700">
                                    <CheckCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-emerald-655 uppercase tracking-wider">Published</p>
                                    <p className="text-2xl font-black text-slate-800 mt-0.5">{classSummary.published.length}</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center gap-3">
                                <div className="bg-amber-100 p-2.5 rounded-full text-amber-700">
                                    <PenTool className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-amber-655 uppercase tracking-wider">Drafts Ready</p>
                                    <p className="text-2xl font-black text-slate-800 mt-0.5">{classSummary.drafts.length}</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 flex items-center gap-3">
                                <div className="bg-slate-100 p-2.5 rounded-full text-slate-500">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-wider">Not Compiled</p>
                                    <p className="text-2xl font-black text-slate-800 mt-0.5">{classSummary.missing.length}</p>
                                </div>
                            </div>
                        </div>

                        {/* List breakdown scrollables */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                            <div>
                                <h4 className="text-xs font-black text-emerald-700 mb-2 uppercase tracking-widest">Published ({classSummary.published.length})</h4>
                                <ScrollArea className="h-36 border border-slate-100 rounded-xl p-3 bg-white shadow-inner">
                                    {classSummary.published.length > 0 ? (
                                        classSummary.published.map(({ student }: any) => (
                                            <div key={student.uid} className="text-xs py-2 border-b border-slate-50 last:border-0 font-semibold text-slate-700 flex items-center gap-2">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                {student.firstName} {student.lastName}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 italic p-2">No published report cards.</p>
                                    )}
                                </ScrollArea>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-amber-700 mb-2 uppercase tracking-widest">Drafts Ready ({classSummary.drafts.length})</h4>
                                <ScrollArea className="h-36 border border-slate-100 rounded-xl p-3 bg-white shadow-inner">
                                    {classSummary.drafts.length > 0 ? (
                                        classSummary.drafts.map(({ student }: any) => (
                                            <div key={student.uid} className="text-xs py-1.5 border-b border-slate-50 last:border-0 font-semibold text-slate-700 flex justify-between items-center">
                                                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-amber-450 animate-pulse"></span> {student.firstName} {student.lastName}</span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-6 text-[10px] text-indigo-600 font-bold hover:text-indigo-800 hover:bg-indigo-50 px-2 rounded-lg"
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
                                <h4 className="text-xs font-black text-slate-500 mb-2 uppercase tracking-widest">Not Compiled ({classSummary.missing.length})</h4>
                                <ScrollArea className="h-36 border border-slate-100 rounded-xl p-3 bg-white shadow-inner">
                                    {classSummary.missing.length > 0 ? (
                                        classSummary.missing.map((student: any) => (
                                            <div key={student.uid} className="text-xs py-1.5 border-b border-slate-50 last:border-0 font-semibold text-slate-700 flex justify-between items-center">
                                                <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span> {student.firstName} {student.lastName}</span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-6 text-[10px] text-indigo-650 font-bold hover:text-indigo-800 hover:bg-indigo-50 px-2 rounded-lg"
                                                    onClick={() => setSelectedStudentId(student.uid)}
                                                >
                                                    Compile
                                                </Button>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-450 italic p-2">All report cards compiled!</p>
                                    )}
                                </ScrollArea>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {processedReport && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                    {/* Final Remarks card */}
                    <Card className="border border-orange-100 shadow-md rounded-[2rem] overflow-hidden bg-white">
                        <CardHeader className="border-b border-slate-50 bg-slate-50/10 p-6">
                            <CardTitle className="text-base font-black text-slate-800">Review Comments & Actions</CardTitle>
                            <CardDescription className="text-slate-400">Add final remarks, generate AI drafts, and publish terminal reports.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Class Teacher's Remark</Label>
                                    <Button 
                                        variant="ghost" size="sm" 
                                        className="text-purple-650 hover:text-purple-800 hover:bg-purple-50 h-7 px-2.5 rounded-lg text-[10px] font-bold gap-1 transition-all" 
                                        onClick={() => handleGenerateComment('Teacher')}
                                        disabled={isGeneratingTeacherComment || (!isTeacher && !isAdminOrDirector)}
                                    >
                                        {isGeneratingTeacherComment ? <Loader2 className="h-3 w-3 animate-spin"/> : <Sparkles className="h-3 w-3 text-purple-600 animate-pulse"/>}
                                        AI Draft (1 credit)
                                    </Button>
                                </div>
                                <Textarea 
                                  placeholder="Type class teacher remarks..." 
                                  value={classTeacherComment} 
                                  onChange={(e) => setClassTeacherComment(e.target.value)} 
                                  rows={4} 
                                  disabled={!isTeacher && !isAdminOrDirector}
                                  className="rounded-xl border border-slate-200 focus-visible:ring-indigo-500 shadow-sm text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Headmaster's Remark</Label>
                                    <Button 
                                        variant="ghost" size="sm" 
                                        className="text-purple-650 hover:text-purple-800 hover:bg-purple-50 h-7 px-2.5 rounded-lg text-[10px] font-bold gap-1 transition-all" 
                                        onClick={() => handleGenerateComment('Headmaster')}
                                        disabled={isGeneratingHeadmasterComment || !isAdminOrDirector}
                                    >
                                        {isGeneratingHeadmasterComment ? <Loader2 className="h-3 w-3 animate-spin"/> : <Sparkles className="h-3 w-3 text-purple-600 animate-pulse"/>}
                                        AI Draft (1 credit)
                                    </Button>
                                </div>
                                <Textarea 
                                  placeholder="Type headmaster comments..." 
                                  value={headmasterComment} 
                                  onChange={(e) => setHeadmasterComment(e.target.value)} 
                                  rows={4} 
                                  disabled={!isAdminOrDirector}
                                  className="rounded-xl border border-slate-200 focus-visible:ring-indigo-500 shadow-sm text-sm"
                                />
                            </div>
                            {term === 'Third Term' && (
                                <div className="col-span-1 md:col-span-2 border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Promotion Decision</Label>
                                        <Select 
                                            value={promotionDecision} 
                                            onValueChange={(val: any) => {
                                                setPromotionDecision(val);
                                                if (val !== 'Promoted') {
                                                    setPromotedToClassId('');
                                                }
                                            }}
                                            disabled={!isTeacher && !isAdminOrDirector}
                                        >
                                            <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-555 shadow-sm">
                                                <SelectValue placeholder="Select Decision" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Promoted">Promoted</SelectItem>
                                                <SelectItem value="Repeated">Repeated (Repeat Class)</SelectItem>
                                                <SelectItem value="Graduated">Graduated</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    {promotionDecision === 'Promoted' && (
                                        <div className="space-y-2 animate-in slide-in-from-top-2">
                                            <Label className="text-xs font-black text-slate-500 uppercase tracking-wider">Promote To Class</Label>
                                            <Select 
                                                value={promotedToClassId} 
                                                onValueChange={setPromotedToClassId}
                                                disabled={!isTeacher && !isAdminOrDirector}
                                            >
                                                <SelectTrigger className="bg-white border border-slate-200 rounded-xl h-11 focus:ring-indigo-555 shadow-sm">
                                                    <SelectValue placeholder="Select Target Class" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {classes?.filter((c: any) => c.id !== classId).sort((a: any, b: any) => a.name.localeCompare(b.name)).map((c: any) => (
                                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="justify-end gap-2 bg-slate-50/50 border-t border-slate-100 p-4">
                            <Button onClick={handleDownloadPDF} disabled={isExporting} variant="secondary" className="rounded-xl font-bold h-10">{isExporting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Download className="mr-2 h-4 w-4"/>} Download PDF</Button>
                            <Button onClick={handleSaveProgress} disabled={isSaving} className="bg-slate-800 hover:bg-slate-900 rounded-xl font-bold h-10 text-white"><Save className="mr-2 h-4 w-4"/> Save Draft</Button>
                            {isAdminOrDirector && (
                                <Button onClick={handlePublish} disabled={isPublishing} className="bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl h-10 text-white">
                                    {isPublishing ? <Loader2 className="animate-spin h-4 w-4"/> : <ShieldCheck className="mr-2 h-4 w-4"/>} Sign & Publish
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

                    {/* Styled Mockup Viewport container */}
                    <div className="flex flex-col items-center justify-center bg-slate-800 py-12 px-6 rounded-[2.5rem] border border-slate-700 shadow-inner relative group">
                        <div className="absolute top-4 left-6 flex items-center gap-2 text-slate-400 font-mono text-[10px]">
                            <Eye className="h-3.5 w-3.5 text-slate-500" /> A4 PAGE LIVE VIEWPORT MOCKUP
                        </div>
                        <div className="shadow-2xl ring-4 ring-black/40 bg-white scale-[0.7] sm:scale-[0.8] origin-top md:scale-100 transition-all rounded-sm overflow-hidden" style={{ width: '794px' }}>
                            <ReportCardTemplate
                                data={{
                                    ...processedReport,
                                    promotionDecision,
                                    promotedToClassId,
                                    promotedToClassName: promotionDecision === 'Promoted'
                                        ? (classes?.find((c: any) => c.id === promotedToClassId)?.name || 'Next Class')
                                        : (promotionDecision === 'Repeated' ? processedReport?.className : (promotionDecision === 'Graduated' ? 'Graduated' : ''))
                                }}
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
                id="print-area"
                style={{ visibility: 'hidden', position: 'absolute', top: 0, left: 0, zIndex: -1, width: '794px', display: 'none' }}
            >
                {isPrintingAll && classReportCards && classReportCards.length > 0 ? (
                    classReportCards.map((report: any) => (
                        <div key={report.id} className="print-page-break">
                            <ReportCardTemplate
                                data={{
                                    ...report,
                                    logoBase64: batchLogoBase64 || report.logoBase64 || '',
                                    headmasterSigBase64: batchHeadmasterSigBase64 || report.headmasterSigBase64 || '',
                                    teacherSigBase64: batchTeacherSigBase64 || report.teacherSigBase64 || ''
                                }}
                                classTeacherComment={report.classTeacherComment}
                                headmasterComment={report.headmasterComment}
                                caWeight={report.caWeight ?? CA_WEIGHT}
                                examWeight={report.examWeight ?? EXAM_WEIGHT}
                            />
                        </div>
                    ))
                ) : (
                    processedReport && (
                        <div className="print-page-break">
                            <ReportCardTemplate
                                data={{
                                    ...processedReport,
                                    promotionDecision,
                                    promotedToClassId,
                                    promotedToClassName: promotionDecision === 'Promoted'
                                        ? (classes?.find((c: any) => c.id === promotedToClassId)?.name || 'Next Class')
                                        : (promotionDecision === 'Repeated' ? processedReport?.className : (promotionDecision === 'Graduated' ? 'Graduated' : ''))
                                }}
                                classTeacherComment={classTeacherComment}
                                headmasterComment={headmasterComment}
                                caWeight={processedReport?.caWeight ?? CA_WEIGHT}
                                examWeight={processedReport?.examWeight ?? EXAM_WEIGHT}
                            />
                        </div>
                    )
                )}
            </div>

            <style jsx global>{`
                @media print {
                    body * { visibility: hidden !important; }
                    #print-area, #print-area * { visibility: visible !important; }
                    #print-area { position: absolute !important; left: 0 !important; top: 0 !important; width: 210mm !important; height: auto !important; display: block !important; }
                    .print-page-break {
                        page-break-after: always;
                        break-after: page;
                        display: block !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        box-sizing: border-box !important;
                    }
                }
            `}</style>
        </div>
    );
}
