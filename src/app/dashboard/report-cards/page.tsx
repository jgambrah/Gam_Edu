'use client';

import { useState, useMemo, useRef } from 'react';
import { useAuth, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Printer, Download, Search, CheckCircle, CalendarIcon, User } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import StudentParentReportCardView from './student-parent-view';
import { MOCK_ACADEMIC_YEARS, MOCK_TERMS } from '@/lib/data';

function getGradeAndRemark(score: number) {
    if (score >= 80) return { grade: 'A', autoRemark: 'Excellent' };
    if (score >= 70) return { grade: 'B', autoRemark: 'Very Good' };
    if (score >= 60) return { grade: 'C', autoRemark: 'Good' };
    if (score >= 50) return { grade: 'D', autoRemark: 'Credit' };
    if (score >= 40) return { grade: 'E', autoRemark: 'Pass' };
    return { grade: 'F', autoRemark: 'Fail' };
}

export default function ReportCardsPage() {
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();

    const [classId, setClassId] = useState('');
    const [term, setTerm] = useState(MOCK_TERMS[0]);
    const [academicYear, setAcademicYear] = useState(MOCK_ACADEMIC_YEARS[MOCK_ACADEMIC_YEARS.length - 1]);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    const [termStartDate, setTermStartDate] = useState<Date | undefined>(undefined);
    const [termEndDate, setTermEndDate] = useState<Date | undefined>(undefined);

    const [classTeacherComment, setClassTeacherComment] = useState('');
    const [headmasterComment, setHeadmasterComment] = useState('');

    const [isGenerating, setIsGenerating] = useState(false);
    const [processedReport, setProcessedReport] = useState<any>(null);
    const printRef = useRef<HTMLDivElement>(null);

    const canManage = ['Administrator', 'Director', 'Teacher'].includes(role || '');

    const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: classes } = useCollection<any>(classesQuery);

    const studentsQuery = useMemoFirebase(() => (firestore && schoolId && classId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('classId', '==', classId)) : null, [firestore, schoolId, classId]);
    const { data: students } = useCollection<any>(studentsQuery);

    const subjectsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: subjects } = useCollection<any>(subjectsQuery);

    const schoolProfileRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    const CA_WEIGHT = schoolProfile?.caWeight ?? 30;
    const EXAM_WEIGHT = schoolProfile?.examWeight ?? 70;

    const generateReport = async () => {
        if (!firestore || !schoolId || !classId || !selectedStudentId || !termStartDate || !termEndDate) {
            toast({ variant: 'destructive', title: "Missing Information", description: "Ensure all filters and term dates are selected." });
            return;
        }
        setIsGenerating(true);

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

            subjects?.forEach((sub: any) => { subjectStats[sub.id] = { totalScores: [], sum: 0 }; });

            students?.forEach((stu: any) => {
                let grandTotal = 0;
                subjects?.forEach((sub: any) => {
                    const stuSubjAssessments = allAssessments.filter(a => a.studentId === stu.uid && a.subjectId === sub.id);
                    if (stuSubjAssessments.length === 0) return;

                    const cas = stuSubjAssessments.filter(a => a.assessmentType.includes('CA'));
                    const caScore = cas.reduce((sum, a) => sum + a.score, 0);
                    const caMax = cas.reduce((sum, a) => sum + a.maxScore, 0);
                    const weightedCA = caMax > 0 ? (caScore / caMax) * CA_WEIGHT : 0;

                    const exams = stuSubjAssessments.filter(a => a.assessmentType.includes('Exam'));
                    const examScore = exams.reduce((sum, a) => sum + a.score, 0);
                    const examMax = exams.reduce((sum, a) => sum + a.maxScore, 0);
                    const weightedExam = examMax > 0 ? (examScore / examMax) * EXAM_WEIGHT : 0;

                    const total100 = weightedCA + weightedExam;
                    grandTotal += total100;

                    if (subjectStats[sub.id]) {
                        subjectStats[sub.id].totalScores.push(total100);
                        subjectStats[sub.id].sum += total100;
                    }
                });
                studentTotals[stu.uid] = grandTotal;
            });

            const sortedStudents = Object.entries(studentTotals).sort(([,a], [,b]) => b - a);
            const classPosition = sortedStudents.findIndex(([uid]) => uid === selectedStudentId) + 1;

            const targetStudent = students?.find((s:any) => s.uid === selectedStudentId);
            const reportRows: any[] = [];
            let myGrandTotal = 0;
            let subjectsTaken = 0;

            subjects?.forEach((sub: any) => {
                const myAssessments = allAssessments.filter(a => a.studentId === selectedStudentId && a.subjectId === sub.id);
                if (myAssessments.length === 0) return; 

                const cas = myAssessments.filter(a => a.assessmentType.includes('CA'));
                const caScore = cas.reduce((sum, a) => sum + a.score, 0);
                const caMax = cas.reduce((sum, a) => sum + a.maxScore, 0);
                const weightedCA = caMax > 0 ? (caScore / caMax) * CA_WEIGHT : 0;

                const exams = myAssessments.filter(a => a.studentId === selectedStudentId && a.subjectId === sub.id && a.assessmentType.includes('Exam'));
                const examScore = exams.reduce((sum, a) => sum + a.score, 0);
                const examMax = exams.reduce((sum, a) => sum + a.maxScore, 0);
                const weightedExam = examMax > 0 ? (examScore / examMax) * EXAM_WEIGHT : 0;

                const total100 = Math.round(weightedCA + weightedExam);
                myGrandTotal += total100;
                subjectsTaken++;

                const { grade, autoRemark } = getGradeAndRemark(total100);

                const teacherRemarksList = myAssessments.map(a => a.teacherRemark).filter(Boolean);
                const customTeacherRemark = teacherRemarksList.length > 0 ? teacherRemarksList[teacherRemarksList.length - 1] : "";

                const mySubjectRank = subjectStats[sub.id].totalScores.sort((a,b)=>b-a).indexOf(total100) + 1;
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

            const attendanceRef = collection(firestore, 'attendance');
            const attQuery = query(
                attendanceRef,
                where('schoolId', '==', schoolId),
                where('classId', '==', classId)
            );
            const attSnap = await getDocs(attQuery);
            const allClassAttendance = attSnap.docs.map(d => d.data());

            const termStartMs = termStartDate.getTime();
            const termEndMs = new Date(termEndDate).setHours(23, 59, 59, 999);

            const termAttendance = allClassAttendance.filter(a => {
                const recordTime = a.date.toDate ? a.date.toDate().getTime() : new Date(a.date).getTime();
                return recordTime >= termStartMs && recordTime <= termEndMs;
            });

            const uniqueDays = new Set(
                termAttendance.map(a => {
                    const d = a.date.toDate ? a.date.toDate() : new Date(a.date);
                    return d.toISOString().split('T')[0];
                })
            );
            const totalClassDays = uniqueDays.size;

            const myAttendance = termAttendance.filter(a => 
                a.studentId === selectedStudentId && 
                (a.status === 'Present' || a.status === 'Late')
            );
            const studentPresentDays = myAttendance.length;

            setProcessedReport({
                student: targetStudent,
                rows: reportRows,
                overallAverage,
                totalScore: myGrandTotal,
                classPosition,
                totalStudents: students?.length || 0,
                studentPresentDays,
                totalClassDays
            });
            
            setClassTeacherComment('');
            setHeadmasterComment('');

        } catch (error: any) {
            console.error("Report Generation Error:", error);
            toast({ variant: 'destructive', title: "Error", description: "Failed to generate report." });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPDF = async () => {
        const element = printRef.current;
        if (!element) return;
        try {
            element.style.display = 'block';
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${processedReport?.student?.firstName}_ReportCard_${term}.pdf`);
            element.style.display = 'none';
        } catch (error) {
            toast({ variant: 'destructive', title: "Export Failed" });
        }
    };

    const handlePublishReport = async () => {
        if (!firestore || !schoolId || !processedReport || !selectedStudentId) return;
        setIsGenerating(true);

        try {
            const reportId = `${selectedStudentId}_${academicYear.replace(/\//g, '-')}_${term.replace(/\s+/g, '')}`;
            const reportRef = doc(firestore, 'report-cards', reportId);

            await setDoc(reportRef, {
                studentId: selectedStudentId,
                schoolId: schoolId,
                academicYear: academicYear,
                term: term,
                studentName: `${processedReport.student.firstName} ${processedReport.student.lastName}`,
                className: classes?.find((c:any) => c.id === classId)?.name || '',
                classId: classId,
                overallAverage: processedReport.overallAverage,
                totalScore: processedReport.totalScore,
                classPosition: processedReport.classPosition,
                totalStudents: processedReport.totalStudents,
                studentPresentDays: processedReport.studentPresentDays,
                totalClassDays: processedReport.totalClassDays,
                rows: processedReport.rows, 
                classTeacherComment: classTeacherComment,
                headmasterComment: headmasterComment,
                status: 'Published',
                publishedAt: serverTimestamp(),
            });

            toast({ 
                title: "Report Published! 🚀", 
                description: "Parents and Students can now view this report on their dashboard." 
            });

        } catch (error: any) {
            console.error("Publish Error:", error);
            toast({ variant: 'destructive', title: "Error", description: "Failed to publish report." });
        } finally {
            setIsGenerating(false);
        }
    };

    if (role === 'Student' || role === 'Parent') {
        return <StudentParentReportCardView />;
    }

    if (!canManage) return <div className="p-8">Access Denied.</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Terminal Report Cards</h1>

            {/* CONTROLS */}
            <Card className="border-t-4 border-t-indigo-600 print:hidden">
                <CardHeader><CardTitle>Report Generator</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Academic Year</Label>
                            <Select value={academicYear} onValueChange={setAcademicYear}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {MOCK_ACADEMIC_YEARS.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Term</Label>
                            <Select value={term} onValueChange={setTerm}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    {MOCK_TERMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Class</Label>
                            <Select value={classId} onValueChange={setClassId}>
                                <SelectTrigger><SelectValue placeholder="Select Class"/></SelectTrigger>
                                <SelectContent>{classes?.map((c:any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Select Student</Label>
                            <Select value={selectedStudentId || ''} onValueChange={setSelectedStudentId} disabled={!classId}>
                                <SelectTrigger><SelectValue placeholder="Choose Student"/></SelectTrigger>
                                <SelectContent>{students?.map((s:any) => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                        <div className="space-y-2">
                            <Label>Term Start Date *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !termStartDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {termStartDate ? format(termStartDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={termStartDate} onSelect={setTermStartDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Label>Term End Date *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !termEndDate && "text-muted-foreground")}>
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {termEndDate ? format(termEndDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={termEndDate} onSelect={setTermEndDate} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-end bg-slate-50 pt-4">
                    <Button onClick={generateReport} disabled={isGenerating || !selectedStudentId || !termStartDate || !termEndDate} className="bg-indigo-600">
                        {isGenerating ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Search className="mr-2 h-4 w-4"/>} 
                        Generate Report
                    </Button>
                </CardFooter>
            </Card>

            {/* PRE-PRINT COMMENT ENTRY */}
            {processedReport && (
                <Card className="print:hidden border-t-4 border-t-orange-400 animate-in slide-in-from-top-4">
                    <CardHeader>
                        <CardTitle>Final Remarks (Add before printing)</CardTitle>
                        <CardDescription>These remarks will appear at the bottom of the printed report card.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Class Teacher's Remark</Label>
                            <Textarea 
                                placeholder="e.g. John has shown great improvement this term..." 
                                value={classTeacherComment}
                                onChange={(e) => setClassTeacherComment(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Headmaster's Remark</Label>
                            <Textarea 
                                placeholder="e.g. Promoted to the next class." 
                                value={headmasterComment}
                                onChange={(e) => setHeadmasterComment(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 bg-slate-50 pt-4">
                        <Button variant="outline" onClick={() => { if (printRef.current) { printRef.current.style.display = 'block'; window.print(); printRef.current.style.display = 'none'; } }}><Printer className="mr-2 h-4 w-4"/> Print</Button>
                        <Button onClick={handleDownloadPDF} variant="secondary" className="bg-slate-200 hover:bg-slate-300 text-slate-800">
                            <Download className="mr-2 h-4 w-4"/> Download PDF
                        </Button>
                        <Button onClick={handlePublishReport} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin mr-2"/> : <CheckCircle className="mr-2 h-4 w-4"/>}
                            Publish to Portal
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* HIDDEN PRINT TEMPLATE (A4 Size) */}
            {processedReport && (
                <div className="overflow-x-auto bg-slate-200 p-8 flex justify-center print:hidden">
                    <div ref={printRef} className="bg-white p-12 shadow-2xl" style={{ width: '210mm', minHeight: '297mm', color: 'black' }} id="pdf-content">
                        
                        {/* HEADER */}
                        <div className="text-center border-b-4 border-double border-slate-800 pb-6 mb-6">
                            <h1 className="text-4xl font-black uppercase tracking-widest">{schoolProfile?.name || "SCHOOL NAME"}</h1>
                            <p className="text-sm font-bold mt-1">{schoolProfile?.address || ""}</p>
                            <p className="text-sm font-bold">{schoolProfile?.phone || ""} | {schoolProfile?.email || ""}</p>
                            <h2 className="text-2xl font-bold mt-6 bg-slate-100 py-2 border border-slate-300">TERMINAL REPORT</h2>
                        </div>

                        {/* STUDENT INFO GRID */}
                        <div className="flex justify-between items-start gap-8 mb-8 border-2 p-4 font-medium relative">
                            <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                                <div><strong>Name:</strong> {processedReport.student.firstName} {processedReport.student.lastName}</div>
                                <div><strong>Term:</strong> {term}</div>
                                <div><strong>Class:</strong> {classes?.find((c:any) => c.id === classId)?.name}</div>
                                <div><strong>Academic Year:</strong> {academicYear}</div>
                                <div><strong>Position in Class:</strong> {processedReport.classPosition} out of {processedReport.totalStudents}</div>
                                <div><strong>Overall Average:</strong> {processedReport.overallAverage}%</div>
                                <div><strong>Attendance:</strong> {processedReport.studentPresentDays} out of {processedReport.totalClassDays} days</div>
                            </div>
                            
                            {/* STUDENT PHOTO */}
                            <div className="w-[100px] h-[100px] border-2 border-slate-200 rounded-lg overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center">
                                {processedReport.student.photoURL ? (
                                    <img src={processedReport.student.photoURL} alt="Student" style={{ width: '100px', height: '100px', objectFit: 'cover' }} crossOrigin="anonymous" />
                                ) : (
                                    <User className="h-12 w-12 text-slate-200" />
                                )}
                            </div>
                        </div>

                        {/* GRADES TABLE */}
                        <table className="w-full text-sm border-collapse border border-slate-800 mb-8">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="border border-slate-800 p-2 text-left">Subject</th>
                                    <th className="border border-slate-800 p-2 text-center w-12">CA ({CA_WEIGHT})</th>
                                    <th className="border border-slate-800 p-2 text-center w-12">Exam ({EXAM_WEIGHT})</th>
                                    <th className="border border-slate-800 p-2 text-center w-12">Total</th>
                                    <th className="border border-slate-800 p-2 text-center w-12">Avg</th>
                                    <th className="border border-slate-800 p-2 text-center w-12">Grd</th>
                                    <th className="border border-slate-800 p-2 text-center w-12">Pos</th>
                                    <th className="border border-slate-800 p-2 text-center w-24">Remark</th>
                                    <th className="border border-slate-800 p-2 text-left">Teacher's Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedReport.rows.map((row: any, i: number) => (
                                    <tr key={i}>
                                        <td className="border border-slate-800 p-2 font-bold">{row.subjectName}</td>
                                        <td className="border border-slate-800 p-2 text-center">{row.ca}</td>
                                        <td className="border border-slate-800 p-2 text-center">{row.exam}</td>
                                        <td className="border border-slate-800 p-2 text-center font-bold bg-slate-50">{row.total}</td>
                                        <td className="border border-slate-800 p-2 text-center text-slate-500">{row.classAverage}</td>
                                        <td className="border border-slate-800 p-2 text-center font-bold">{row.grade}</td>
                                        <td className="border border-slate-800 p-2 text-center">{row.position}</td>
                                        <td className="border border-slate-800 p-2 text-center font-semibold text-xs">{row.autoRemark}</td>
                                        <td className="border border-slate-800 p-2 italic text-xs text-slate-600">{row.teacherRemark || "-"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* GRADING KEY */}
                        <div className="mb-8 border p-2 text-xs bg-slate-50 flex justify-between">
                            <strong>Grading System:</strong>
                            <span>80-100: A</span><span>70-79: B</span><span>60-69: C</span><span>50-59: D</span><span>40-49: E</span><span>0-39: F</span>
                        </div>

                        {/* FINAL COMMENTS (From Pre-Print inputs) */}
                        <div className="space-y-4 mb-16">
                            <div className="border-b-2 border-dotted pb-2">
                                <p className="text-sm font-bold">Class Teacher's Remark:</p>
                                <p className="text-sm italic mt-1">{classTeacherComment || "_________________________________________________________"}</p>
                            </div>
                            <div className="border-b-2 border-dotted pb-2">
                                <p className="text-sm font-bold">Headmaster's Remark:</p>
                                <p className="text-sm italic mt-1">{headmasterComment || "_________________________________________________________"}</p>
                            </div>
                        </div>

                        {/* SIGNATURES */}
                        <div className="grid grid-cols-2 gap-8 pt-8">
                            <div className="text-center">
                                <div className="h-10 border-b border-black w-3/4 mx-auto mb-2"></div>
                                <p className="font-bold text-sm">Class Teacher Signature</p>
                            </div>
                            <div className="text-center">
                                <div className="h-10 border-b border-black w-3/4 mx-auto mb-2"></div>
                                <p className="font-bold text-sm">Headmaster Signature</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
