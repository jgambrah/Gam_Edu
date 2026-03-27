'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase, useDoc, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, getDocs, getDoc, doc, setDoc, serverTimestamp, orderBy, updateDoc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Printer, Download, Search, CheckCircle, FileCheck, GraduationCap, Calendar as CalendarIcon, Eye, Save, Send, ShieldCheck, Lock, AlertCircle, PenTool } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';
import { format, startOfDay, endOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import ReportCardTemplate from './components/ReportCardTemplate';
import { notifyParents } from '@/app/actions/notifications';

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

    const termStartMs = schoolProfile?.termStartDate ? schoolProfile.termStartDate.toDate().getTime() : 0;
    const termEndMs = schoolProfile?.termEndDate ? schoolProfile.termEndDate.toDate().getTime() : Infinity;
    const areDatesMissing = !schoolProfile?.termStartDate || !schoolProfile?.termEndDate;

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
        
        if (areDatesMissing) {
            toast({ variant: 'destructive', title: "Incomplete Configuration", description: "Please ask the Administrator to configure the Term Dates." });
            return;
        }

        setIsGenerating(true);
        setProcessedReport(null);

        try {
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

            const myTotal = studentTotals[selectedStudentId] || 0;
            const higherCount = Object.values(studentTotals).filter(t => t > myTotal).length;
            const classPositionNum = higherCount + 1;
            const classPosition = formatOrdinal(classPositionNum);

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

                const exams = myAssessments.filter(a => a.studentId === selectedStudentId && a.subjectId === sub.id && a.assessmentType.includes('Exam'));
                const examScore = exams.reduce((sum, a) => sum + (a.score || 0), 0);
                const examMax = exams.reduce((sum, a) => sum + (a.maxScore || 100), 0);
                const weightedExam = examMax > 0 ? (examScore / examMax) * EXAM_WEIGHT : 0;

                const total100 = Math.round(weightedCA + weightedExam);
                myGrandTotal += total100;
                subjectsTaken++;

                const { grade, autoRemark } = getGradeAndRemark(total100);
                const teacherRemarksList = myAssessments.map(a => a.teacherRemark).filter(Boolean);
                const customTeacherRemark = teacherRemarksList.length > 0 ? teacherRemarksList[teacherRemarksList.length - 1] : "";

                const subjectHigherCount = subjectStats[sub.id].totalScores.filter(s => s > total100).length;
                const subjectRankNum = subjectHigherCount + 1;
                const mySubjectRank = formatOrdinal(subjectRankNum);

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

            const attendanceRef = collection(firestore, 'attendance');
            const attQuery = query(attendanceRef, where('schoolId', '==', schoolId), where('classId', '==', classId));
            const attSnap = await getDocs(attQuery);
            const allClassAttendance = attSnap.docs.map(d => d.data());

            const termAttendance = allClassAttendance.filter(a => {
                if (!a.date) return false;
                const recordTime = a.date.toDate ? a.date.toDate().getTime() : new Date(a.date).getTime();
                return recordTime >= termStartMs && recordTime <= termEndMs;
            });

            const uniqueDays = new Set(
                termAttendance.map(a => {
                    const d = a.date.toDate ? a.date.toDate() : new Date(a.date);
                    return format(d, 'yyyy-MM-dd');
                })
            );
            const totalClassDays = uniqueDays.size;

            const myAttendance = termAttendance.filter(a => 
                a.studentId === selectedStudentId && 
                (a.status === 'Present' || a.status === 'Late')
            );
            const studentPresentDays = myAttendance.length;

            let finalLogoStr = '';
            if (schoolProfile?.logoUrl) {
                finalLogoStr = await getBase64ImageFromUrl(schoolProfile.logoUrl);
            }

            setProcessedReport({
                student: targetStudent,
                studentId: selectedStudentId,
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
            
            // THE KEY: Capture the signature URL at the moment of signing/saving
            const teacherDetails = isTeacher ? {
                classTeacherName: `${profile?.firstName} ${profile?.lastName}`,
                classTeacherSignatureUrl: profile?.signatureUrl || null
            } : {};

            await setDoc(doc(firestore!, 'report-cards', reportId), {
                ...processedReport,
                ...teacherDetails,
                id: reportId,
                studentId: selectedStudentId,
                schoolId,
                status: 'Draft',
                classTeacherComment,
                headmasterComment,
                lastUpdatedBy: user?.uid,
                updatedAt: serverTimestamp()
            }, { merge: true });
            toast({ title: "Draft Saved & Signed", description: "The report data and your signature have been stored." });
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
            
            // Capture signature at publish time
            const teacherDetails = isTeacher ? {
                classTeacherName: `${profile?.firstName} ${profile?.lastName}`,
                classTeacherSignatureUrl: profile?.signatureUrl || null
            } : {};

            await setDoc(doc(firestore!, 'report-cards', reportId), {
                ...processedReport,
                ...teacherDetails,
                id: reportId,
                studentId: selectedStudentId,
                schoolId,
                status: 'Published',
                publishedAt: serverTimestamp(),
                classTeacherComment,
                headmasterComment,
                generatedBy: user?.uid
            }, { merge: true });
            
            toast({ 
                title: "Report Published & Locked! 🚀", 
                description: "Parents and Students can now view this verified report." 
            });

            // Send Push Notification
            await notifyParents(
                [selectedStudentId!], 
                "Report Card Available 🎓",
                `The Terminal Report for ${processedReport.student?.firstName} is now available. Tap to view and download.`,
                "/dashboard/my-reports"
            );

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

            <Card className="border-t-4 border-t-indigo-600 shadow-md print:hidden">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg">Report Configuration</CardTitle>
                            <CardDescription>Select a student and academic period.</CardDescription>
                        </div>
                        {schoolProfile && (
                            <Badge variant="outline" className={cn("px-3 py-1", areDatesMissing ? "text-red-600 border-red-200 bg-red-50" : "text-emerald-600 border-emerald-200 bg-emerald-50")}>
                                {areDatesMissing ? (
                                    <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3"/> Term Dates Not Set</span>
                                ) : (
                                    <span className="flex items-center gap-1"><Lock className="h-3 w-3"/> Attendance: {format(termStartMs, 'dd MMM')} - {format(termEndMs, 'dd MMM')}</span>
                                )}
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                </CardContent>
                <CardFooter className="justify-end bg-slate-50 pt-4 border-t">
                    <Button onClick={generateReport} disabled={isGenerating || !selectedStudentId || areDatesMissing} className="bg-indigo-600 hover:bg-indigo-700 px-8 h-12 rounded-xl font-bold">
                        {isGenerating ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Search className="mr-2 h-4 w-4"/>}
                        {areDatesMissing ? "Configuration Required" : "Generate Master Preview"}
                    </Button>
                </CardFooter>
            </Card>

            {areDatesMissing && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Term Dates Missing</AlertTitle>
                    <AlertDescription>
                        The official term dates have not been set in the School Profile. This is required to calculate student attendance correctly. 
                    </AlertDescription>
                </Alert>
            )}

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
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PenTool className="mr-2 h-4 w-4"/>}
                                Sign & Save Draft
                            </Button>

                            {isAdminOrDirector && (
                                <Button onClick={handlePublish} disabled={isPublishing} className="bg-green-600 hover:bg-green-700 rounded-xl h-11 px-8 font-black shadow-lg shadow-green-900/10">
                                    {isPublishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <ShieldCheck className="mr-2 h-4 w-4"/>}
                                    Sign & Publish
                                </Button>
                            )}
                        </CardFooter>
                    </Card>

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
                    #pdf-content,
                    #pdf-content * { visibility: visible !important; }
                    #pdf-content {
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        margin: 0 !important;
                        padding: 24px 32px !important;
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
