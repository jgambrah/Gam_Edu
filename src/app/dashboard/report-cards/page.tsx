'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useAuth, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Printer, Download, Search, CheckCircle, FileCheck, GraduationCap, Calendar as CalendarIcon, Eye } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MOCK_ACADEMIC_YEARS } from '@/lib/data';
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
function ReportCardTemplate({ data, classTeacherComment, headmasterComment, caWeight, examWeight }: { data: any, classTeacherComment: string, headmasterComment: string, caWeight: number, examWeight: number }) {
    return (
        <div 
            className="bg-white px-10 py-8 flex flex-col justify-between" 
            style={{ 
                width: '794px',   // 210mm @ 96DPI
                height: '1123px', // 297mm @ 96DPI
                color: 'black',
                boxSizing: 'border-box',
                margin: '0 auto'
            }}
            id="pdf-content"
        >
            {/* --- TOP SECTION (Header + Info) --- */}
            <div>
                <div className="flex flex-row items-center justify-between border-b-4 border-double border-slate-800 pb-4 mb-4 w-full">
                    <div className="w-24 h-24 flex-shrink-0 flex items-center justify-start">
                        {data.logoBase64 ? (
                            <img 
                                src={data.logoBase64} 
                                alt="School Logo" 
                                style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }}
                            />
                        ) : (
                            <div style={{ width: 100, height: 100, background: '#f1f5f9', border: '1px dashed #94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: '#94a3b8' }}>
                                No Logo
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center px-4">
                        <h1 className="text-2xl font-black uppercase tracking-widest leading-tight">{data.schoolName || "SCHOOL NAME"}</h1>
                        {data.schoolMotto && <p className="text-[10px] italic text-slate-600">"{data.schoolMotto}"</p>}
                        <p className="text-[10px] font-bold mt-1">{data.schoolAddress || ""}</p>
                        <p className="text-[10px] font-bold">{data.schoolPhone || ""} | {data.schoolEmail || ""}</p>
                    </div>

                    <div className="w-24 flex-shrink-0"></div>
                </div>

                <h2 className="text-xl font-bold text-center mb-4 bg-slate-100 py-1 border border-slate-300 uppercase tracking-widest">Terminal Report Card</h2>

                {/* Student Info Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-[11px] border-2 p-3 font-medium bg-slate-50/50">
                    <div><strong>Name:</strong> {data.student.firstName} {data.student.lastName}</div>
                    <div><strong>Term:</strong> {data.term}</div>
                    <div><strong>Class:</strong> {data.className}</div>
                    <div><strong>Academic Year:</strong> {data.academicYear}</div>
                    <div className="mt-1"><strong>Attendance:</strong> {data.studentPresentDays} / {data.totalClassDays} days</div>
                    <div className="col-span-2 mt-1 pt-1 border-t flex justify-between items-center">
                        <span><strong>Position in Class:</strong> <span className="font-bold underline">{data.classPosition}</span> of {data.totalStudents}</span>
                        <span><strong>Overall Average:</strong> <span className="font-bold underline">{data.overallAverage}%</span></span>
                    </div>
                </div>
            </div>

            {/* --- MIDDLE SECTION (Grades Table) --- */}
            <div className="flex-grow flex flex-col">
                <table className="w-full text-[10px] border-collapse border border-slate-800 mb-2">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="border border-slate-800 p-1 text-left">Subject</th>
                            <th className="border border-slate-800 p-1 text-center w-10">CA ({caWeight})</th>
                            <th className="border border-slate-800 p-1 text-center w-10">Exam ({examWeight})</th>
                            <th className="border border-slate-800 p-1 text-center w-10">Total</th>
                            <th className="border border-slate-800 p-1 text-center w-10">Avg</th>
                            <th className="border border-slate-800 p-1 text-center w-8">Grd</th>
                            <th className="border border-slate-800 p-1 text-center w-8">Pos</th>
                            <th className="border border-slate-800 p-1 text-center w-20">Remark</th>
                            <th className="border border-slate-800 p-1 text-left">Teacher's Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows.map((row: any, i: number) => (
                            <tr key={i}>
                                <td className="border border-slate-800 py-0.5 px-1 font-bold">{row.subjectName}</td>
                                <td className="border border-slate-800 py-0.5 px-1 text-center">{row.ca}</td>
                                <td className="border border-slate-800 py-0.5 px-1 text-center">{row.exam}</td>
                                <td className="border border-slate-800 py-0.5 px-1 text-center font-black bg-slate-50">{row.total}</td>
                                <td className="border border-slate-800 py-0.5 px-1 text-center text-slate-500 italic">{row.classAverage}</td>
                                <td className="border border-slate-800 py-0.5 px-1 text-center font-bold">{row.grade}</td>
                                <td className="border border-slate-800 py-0.5 px-1 text-center">{row.position}</td>
                                <td className="border border-slate-800 py-0.5 px-1 text-center font-semibold text-[9px]">{row.autoRemark}</td>
                                <td className="border border-slate-800 py-0.5 px-1 italic text-[9px] text-slate-600">{row.teacherRemark || "-"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Grading Key */}
                <div className="border p-1 text-[9px] bg-slate-50 flex justify-between mb-4">
                    <strong>Key:</strong> 80-100:A (Exc) | 70-79:B (V.G) | 60-69:C (Good) | 50-59:D (Cred) | 40-49:E (Pass) | 0-39:F (Fail)
                </div>
            </div>

            {/* --- BOTTOM SECTION (Comments & Signatures) --- */}
            <div className="mt-auto pt-2">
                <div className="space-y-2 mb-6">
                    <div className="border-b border-dotted pb-1">
                        <p className="text-[10px] font-bold uppercase text-slate-500">Class Teacher's Remark:</p>
                        <p className="text-xs italic mt-1 font-serif">{classTeacherComment || "...................................................................................................."}</p>
                    </div>
                    <div className="border-b border-dotted pb-1">
                        <p className="text-[10px] font-bold uppercase text-slate-500">Headmaster's Remark:</p>
                        <p className="text-xs italic mt-1 font-serif">{headmasterComment || "...................................................................................................."}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-4">
                    <div className="text-center">
                        <div className="h-6 border-b border-black w-3/4 mx-auto mb-1"></div>
                        <p className="font-bold uppercase text-[9px]">Class Teacher Signature</p>
                    </div>
                    <div className="text-center">
                        <div className="h-6 border-b border-black w-3/4 mx-auto mb-1"></div>
                        <p className="font-bold uppercase text-[9px]">Headmaster Signature</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ReportCardsPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const { toast } = useToast();

    // Filters
    const [classId, setClassId] = useState('');
    const [term, setTerm] = useState('First Term');
    const [academicYear, setAcademicYear] = useState('2024-2025');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    // Term Dates for Attendance
    const [termStartDate, setTermStartDate] = useState<Date | undefined>(undefined);
    const [termEndDate, setTermEndDate] = useState<Date | undefined>(undefined);

    // Remarks
    const [classTeacherComment, setClassTeacherComment] = useState('');
    const [headmasterComment, setHeadmasterComment] = useState('');

    const [isGenerating, setIsGenerating] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [processedReport, setProcessedReport] = useState<any>(null);
    
    const printRef = useRef<HTMLDivElement>(null);

    const canManage = ['Administrator', 'Director', 'Teacher'].includes(role || '');

    // Data Fetching
    const { data: classes } = useCollection<any>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));
    const { data: students } = useCollection<any>(useMemoFirebase(() => (firestore && schoolId && classId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('classId', '==', classId)) : null, [firestore, schoolId, classId]));
    const { data: subjects } = useCollection<any>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));
    
    const { data: schoolProfile } = useDoc<any>(useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]));

    const CA_WEIGHT = schoolProfile?.caWeight ?? 30;
    const EXAM_WEIGHT = schoolProfile?.examWeight ?? 70;

    const generateReport = async () => {
        if (!firestore || !schoolId || !classId || !selectedStudentId) return;
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

            // 1. Initialize Subject Stats (Ensure arrays are clean)
            const subjectStats: Record<string, { totalScores: number[], sum: number }> = {};
            const studentTotals: Record<string, number> = {};

            subjects?.forEach((sub: any) => { 
                subjectStats[sub.id] = { totalScores: [], sum: 0 }; 
            });

            // 2. Loop ALL students to build the comparative data
            students?.forEach((stu: any) => {
                let grandTotal = 0;
                
                subjects?.forEach((sub: any) => {
                    const stuSubjAssessments = allAssessments.filter(a => a.studentId === stu.uid && a.subjectId === sub.id);
                    
                    // Even if length is 0, we must record a 0 score to maintain accurate ranking counts
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
                        // Push every student's score so the rank is out of the total class size
                        subjectStats[sub.id].totalScores.push(total100);
                        subjectStats[sub.id].sum += total100;
                    }
                });
                studentTotals[stu.uid] = grandTotal;
            });

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
                    grade: grade,
                    autoRemark: autoRemark,
                    teacherRemark: customTeacherRemark,
                    classAverage: subjectAverage,
                    position: mySubjectRank
                });
            });

            const overallAverage = subjectsTaken > 0 ? Math.round(myGrandTotal / subjectsTaken) : 0;

            // Attendance
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
            toast({ variant: 'destructive', title: "Error", description: "Failed to generate report." });
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePublish = async () => {
        if (!processedReport || !schoolId || isPublishing) return;
        setIsPublishing(true);
        try {
            const reportId = `${selectedStudentId}_${academicYear.replace(/\//g, '-')}_${term.replace(/\s+/g, '')}`;
            await setDoc(doc(firestore!, 'report-cards', reportId), {
                ...processedReport,
                schoolId,
                status: 'Published',
                publishedAt: serverTimestamp(),
                classTeacherComment,
                headmasterComment
            }, { merge: true });
            toast({ title: "Success", description: "Report card published." });
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
            // New logic: Use flex and fixed dimensions
            element.style.visibility = 'visible';
            element.style.position = 'fixed';
            element.style.top = '0';
            element.style.left = '0';
            element.style.zIndex = '-1';
            element.style.display = 'flex'; // Ensure flex layout for PDF

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
            element.style.display = 'block'; // Reset

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            // Image maps exactly to A4 (210mm x 297mm)
            pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);
            pdf.save(`${processedReport.student?.firstName}_Report_${term}.pdf`);
        } catch (error) {
            console.error("PDF Export Error:", error);
            toast({ variant: 'destructive', title: "Export Failed" });
        } finally {
            setIsExporting(false);
        }
    };

    if (!canManage) return <div className="p-8 text-center text-muted-foreground">Access Denied.</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-2"><GraduationCap className="h-8 w-8 text-indigo-600"/> Terminal Report Cards</h1>

            {/* Filter Section */}
            <Card className="border-t-4 border-t-indigo-600 shadow-md print:hidden">
                <CardHeader><CardTitle>Report Generator</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label>Academic Year</Label>
                        <Select value={academicYear} onValueChange={setAcademicYear}>
                            <SelectTrigger className="bg-white"><SelectValue/></SelectTrigger>
                            <SelectContent>{MOCK_ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Term</Label>
                        <Select value={term} onValueChange={setTerm}><SelectTrigger className="bg-white"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="First Term">First Term</SelectItem><SelectItem value="Second Term">Second Term</SelectItem><SelectItem value="Third Term">Third Term</SelectItem></SelectContent></Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Class</Label>
                        <Select value={classId} onValueChange={setClassId}><SelectTrigger className="bg-white"><SelectValue placeholder="Select Class"/></SelectTrigger><SelectContent>{classes?.map((c:any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Select Student</Label>
                        <Select value={selectedStudentId || ''} onValueChange={setSelectedStudentId} disabled={!classId}><SelectTrigger className="bg-white"><SelectValue placeholder="Choose Student"/></SelectTrigger><SelectContent>{students?.map((s:any) => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}</SelectContent></Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Term Start</Label>
                        <Popover><PopoverTrigger asChild><Button variant="outline" className="w-full text-left font-normal bg-white">{termStartDate ? format(termStartDate, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50"/></Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={termStartDate} onSelect={setTermStartDate} initialFocus /></PopoverContent></Popover>
                    </div>
                    <div className="space-y-2">
                        <Label>Term End</Label>
                        <Popover><PopoverTrigger asChild><Button variant="outline" className="w-full text-left font-normal bg-white">{termEndDate ? format(termEndDate, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50"/></Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={termEndDate} onSelect={setTermEndDate} initialFocus /></PopoverContent></Popover>
                    </div>
                </CardContent>
                <CardFooter className="justify-end bg-slate-50 pt-4 border-t">
                    <Button onClick={generateReport} disabled={isGenerating || !selectedStudentId} className="bg-indigo-600 hover:bg-indigo-700">
                        {isGenerating ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Search className="mr-2 h-4 w-4"/>} 
                        Generate Report
                    </Button>
                </CardFooter>
            </Card>

            {/* Remark Section & Live Preview */}
            {processedReport && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <Card className="border-t-4 border-t-orange-400 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-800"><FileCheck className="h-5 w-5"/> Final Remarks</CardTitle>
                            <CardDescription>Add terminal comments before publishing or printing.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="font-bold">Class Teacher's Remark</Label>
                                <Textarea placeholder="Overall performance..." value={classTeacherComment} onChange={(e) => setClassTeacherComment(e.target.value)} className="min-h-[100px]" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold">Headmaster's Remark</Label>
                                <Textarea placeholder="Final decision..." value={headmasterComment} onChange={(e) => setHeadmasterComment(e.target.value)} className="min-h-[100px]" />
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end gap-2 bg-slate-50 border-t pt-4">
                            <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4"/> Print</Button>
                            <Button onClick={handleDownloadPDF} disabled={isExporting} variant="secondary"><Download className="mr-2 h-4 w-4"/> {isExporting ? 'Generating PDF...' : 'Download PDF'}</Button>
                            <Button onClick={handlePublish} disabled={isPublishing} className="bg-green-600 hover:bg-green-700">
                                {isPublishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4"/>} 
                                Publish to Portal
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* VISIBLE LIVE PREVIEW */}
                    <Card className="border shadow-xl overflow-hidden">
                        <CardHeader className="bg-slate-900 text-white">
                            <CardTitle className="flex items-center gap-2 text-lg"><Eye className="h-5 w-5 text-indigo-400"/> Live Preview</CardTitle>
                            <CardDescription className="text-slate-400">Review the student's terminal report below as it will appear on the final document.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 bg-slate-200">
                            <ScrollArea className="h-[800px] w-full">
                                <div className="p-12">
                                    <div className="shadow-2xl ring-1 ring-black/5 bg-white mx-auto overflow-hidden rounded-sm">
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

            {/* HIDDEN PRINT TEMPLATE (Strict A4 Size) */}
            <div style={{ visibility: 'hidden', position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
                <div ref={printRef}>
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
            </div>

            <style jsx global>{`
                @media print {
                    body * { visibility: hidden !important; }
                    #pdf-content, #pdf-content * { visibility: visible !important; }
                    #pdf-content { 
                        position: absolute !important; 
                        left: 0 !important; 
                        top: 0 !important; 
                        width: 100% !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}