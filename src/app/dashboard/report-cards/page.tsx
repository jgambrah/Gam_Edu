'use client';

import { useState, useMemo, useRef } from 'react';
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
import { Loader2, Printer, Download, Search, CheckCircle, FileCheck, GraduationCap, Calendar as CalendarIcon } from 'lucide-react';
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

// --- GES GRADING SYSTEM WITH AUTO REMARKS ---
function getGradeAndRemark(score: number) {
    if (score >= 80) return { grade: 'A', autoRemark: 'Excellent' };
    if (score >= 70) return { grade: 'B', autoRemark: 'Very Good' };
    if (score >= 60) return { grade: 'C', autoRemark: 'Good' };
    if (score >= 50) return { grade: 'D', autoRemark: 'Credit' };
    if (score >= 40) return { grade: 'E', autoRemark: 'Pass' };
    return { grade: 'F', autoRemark: 'Fail' };
}

// --- MAIN COMPONENT ---
export default function ReportCardsPage() {
    const { user } = useAuth();
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const { toast } = useToast();

    // Filters
    const [classId, setClassId] = useState('');
    const [term, setTerm] = useState('First Term');
    const [academicYear, setAcademicYear] = useState('2024-2025');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    // Term Dates for Attendance Filtering
    const [termStartDate, setTermStartDate] = useState<Date | undefined>(undefined);
    const [termEndDate, setTermEndDate] = useState<Date | undefined>(undefined);

    // Final Comments State
    const [classTeacherComment, setClassTeacherComment] = useState('');
    const [headmasterComment, setHeadmasterComment] = useState('');

    const [isGenerating, setIsGenerating] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [processedReport, setProcessedReport] = useState<any>(null);
    const printRef = useRef<HTMLDivElement>(null);

    const canManage = ['Administrator', 'Director', 'Teacher'].includes(role || '');

    // --- DATA FETCHING ---
    const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: classes } = useCollection<any>(classesQuery);

    const studentsQuery = useMemoFirebase(() => (firestore && schoolId && classId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('classId', '==', classId)) : null, [firestore, schoolId, classId]);
    const { data: students } = useCollection<any>(studentsQuery);

    const subjectsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: subjects } = useCollection<any>(subjectsQuery);

    // Dynamic Weighting Fetch
    const schoolProfileRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    const CA_WEIGHT = schoolProfile?.caWeight ?? 30;
    const EXAM_WEIGHT = schoolProfile?.examWeight ?? 70;

    // --- THE CALCULATION ENGINE ---
    const generateReport = async () => {
        if (!firestore || !schoolId || !classId || !selectedStudentId) return;
        setIsGenerating(true);

        try {
            // 1. Fetch ALL assessments for this class, term, and year
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
                    const caScore = cas.reduce((sum, a) => sum + (a.score || 0), 0);
                    const caMax = cas.reduce((sum, a) => sum + (a.maxScore || 100), 0);
                    const weightedCA = caMax > 0 ? (caScore / caMax) * CA_WEIGHT : 0;

                    const exams = stuSubjAssessments.filter(a => a.assessmentType.includes('Exam'));
                    const examScore = exams.reduce((sum, a) => sum + (a.score || 0), 0);
                    const examMax = exams.reduce((sum, a) => sum + (a.maxScore || 100), 0);
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
            const reportRows = [];
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
                
                const mySubjectRank = subjectStats[sub.id].totalScores.sort((a,b)=>b-a).indexOf(total100) + 1;
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
                academicYear,
                term,
                status: 'Published',
                publishedAt: serverTimestamp(),
                classTeacherComment,
                headmasterComment,
                studentName: `${processedReport.student.firstName} ${processedReport.student.lastName}`,
                className: classes?.find((c:any) => c.id === classId)?.name || ''
            }, { merge: true });
            toast({ title: "Success", description: "Report card published to portal." });
        } catch (e) {
            toast({ variant: 'destructive', title: "Error", description: "Publishing failed." });
        } finally {
            setIsPublishing(false);
        }
    };

    const handleDownloadPDF = async () => {
        const element = printRef.current;
        if (!element) return;
        try {
            element.style.display = 'block';
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${processedReport?.student?.firstName}_Report_${term}.pdf`);
            element.style.display = 'none';
        } catch (error) {
            toast({ variant: 'destructive', title: "Export Failed" });
        }
    };

    if (!canManage) return <div className="p-8">Access Denied.</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-2"><GraduationCap className="h-8 w-8 text-indigo-600"/> Terminal Report Cards</h1>

            {/* CONTROLS */}
            <Card className="border-t-4 border-t-indigo-600 print:hidden shadow-md">
                <CardHeader><CardTitle>Report Generator</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                        <Select value={term} onValueChange={setTerm}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="First Term">First Term</SelectItem><SelectItem value="Second Term">Second Term</SelectItem><SelectItem value="Third Term">Third Term</SelectItem></SelectContent></Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Class</Label>
                        <Select value={classId} onValueChange={setClassId}><SelectTrigger><SelectValue placeholder="Select Class"/></SelectTrigger><SelectContent>{classes?.map((c:any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent></Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Select Student</Label>
                        <Select value={selectedStudentId || ''} onValueChange={setSelectedStudentId} disabled={!classId}><SelectTrigger><SelectValue placeholder="Choose Student"/></SelectTrigger><SelectContent>{students?.map((s:any) => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}</SelectContent></Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Term Start Date (for Attendance)</Label>
                        <Popover><PopoverTrigger asChild><Button variant="outline" className="w-full text-left font-normal">{termStartDate ? format(termStartDate, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50"/></Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={termStartDate} onSelect={setTermStartDate} initialFocus /></PopoverContent></Popover>
                    </div>
                    <div className="space-y-2">
                        <Label>Term End Date (for Attendance)</Label>
                        <Popover><PopoverTrigger asChild><Button variant="outline" className="w-full text-left font-normal">{termEndDate ? format(termEndDate, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50"/></Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={termEndDate} onSelect={setTermEndDate} initialFocus /></PopoverContent></Popover>
                    </div>
                </CardContent>
                <CardFooter className="justify-end bg-slate-50 pt-4 border-t">
                    <Button onClick={generateReport} disabled={isGenerating || !selectedStudentId} className="bg-indigo-600">
                        {isGenerating ? <Loader2 className="animate-spin mr-2"/> : <Search className="mr-2 h-4 w-4"/>} 
                        Generate Report
                    </Button>
                </CardFooter>
            </Card>

            {/* PREVIEW & ACTIONS */}
            {processedReport && (
                <Card className="print:hidden border-t-4 border-t-orange-400 animate-in slide-in-from-top-4 shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-orange-800"><FileCheck className="h-5 w-5"/> Final Remarks</CardTitle>
                        <CardDescription>Add final administrative comments before publishing or printing.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="font-bold">Class Teacher's Remark</Label>
                            <Textarea placeholder="Overall performance..." value={classTeacherComment} onChange={(e) => setClassTeacherComment(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold">Headmaster's Remark</Label>
                            <Textarea placeholder="Final decision..." value={headmasterComment} onChange={(e) => setHeadmasterComment(e.target.value)} />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end gap-2 bg-slate-50 border-t pt-4">
                        <Button variant="outline" onClick={() => { if (printRef.current) { printRef.current.style.display = 'block'; window.print(); printRef.current.style.display = 'none'; } }}><Printer className="mr-2 h-4 w-4"/> Print</Button>
                        <Button onClick={handleDownloadPDF} variant="secondary"><Download className="mr-2 h-4 w-4"/> PDF</Button>
                        <Button onClick={handlePublish} disabled={isPublishing} className="bg-green-600">
                            {isPublishing ? <Loader2 className="animate-spin mr-2"/> : <CheckCircle className="mr-2 h-4 w-4"/>} 
                            Publish to Portal
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* HIDDEN PRINT TEMPLATE */}
            {processedReport && (
                <div className="overflow-x-auto bg-slate-200 p-8 flex justify-center print:hidden">
                    <div ref={printRef} className="bg-white p-12 shadow-2xl" style={{ width: '210mm', minHeight: '297mm', color: 'black' }} id="pdf-content">
                        {/* HEADER */}
                        <div className="text-center border-b-4 border-double border-slate-800 pb-6 mb-6">
                            {schoolProfile?.logoUrl && (
                                <img src={schoolProfile.logoUrl} alt="Logo" className="w-24 h-24 mx-auto mb-4 object-contain" crossOrigin="anonymous" />
                            )}
                            <h1 className="text-4xl font-black uppercase tracking-widest">{schoolProfile?.name || "SCHOOL NAME"}</h1>
                            <p className="text-sm font-bold mt-1">{schoolProfile?.address || ""}</p>
                            <p className="text-sm font-bold">{schoolProfile?.phone} | {schoolProfile?.email}</p>
                            <h2 className="text-2xl font-bold mt-6 bg-slate-100 py-2 border border-slate-300 uppercase tracking-widest">Terminal Report Card</h2>
                        </div>

                        {/* STUDENT INFO */}
                        <div className="grid grid-cols-2 gap-4 mb-8 text-sm border-2 p-4 font-medium bg-slate-50/50">
                            <div><strong>Name:</strong> {processedReport.student.firstName} {processedReport.student.lastName}</div>
                            <div><strong>Term:</strong> {term}</div>
                            <div><strong>Class:</strong> {classes?.find((c:any) => c.id === classId)?.name}</div>
                            <div><strong>Academic Year:</strong> {academicYear}</div>
                            <div className="mt-2"><strong>Attendance:</strong> {processedReport.studentPresentDays} out of {processedReport.totalClassDays} days</div>
                            <div className="col-span-2 mt-2 pt-2 border-t flex justify-between items-center">
                                <span><strong>Position in Class:</strong> <span className="text-lg underline font-bold">{processedReport.classPosition}</span> of {processedReport.totalStudents}</span>
                                <span><strong>Overall Average:</strong> <span className="text-lg underline font-bold">{processedReport.overallAverage}%</span></span>
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
                                    <th className="border border-slate-800 p-2 text-left">Teacher's Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedReport.rows.map((row: any, i: number) => (
                                    <tr key={i}>
                                        <td className="border border-slate-800 p-2 font-bold">{row.subjectName}</td>
                                        <td className="border border-slate-800 p-2 text-center">{row.ca}</td>
                                        <td className="border border-slate-800 p-2 text-center">{row.exam}</td>
                                        <td className="border border-slate-800 p-2 text-center font-black bg-slate-50">{row.total}</td>
                                        <td className="border border-slate-800 p-2 text-center text-slate-500 italic text-xs">{row.classAverage}</td>
                                        <td className="border border-slate-800 p-2 text-center font-bold">{row.grade}</td>
                                        <td className="border border-slate-800 p-2 text-center">{row.position}</td>
                                        <td className="border border-slate-800 p-2 italic text-xs text-slate-600">{row.teacherRemark || row.autoRemark}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* FINAL COMMENTS */}
                        <div className="space-y-4 mb-16">
                            <div className="border-b-2 border-dotted border-slate-400 pb-2">
                                <p className="text-xs font-bold uppercase text-slate-500">Class Teacher's Remark:</p>
                                <p className="text-sm italic mt-1 font-serif">{classTeacherComment || ".................................................................................................................................."}</p>
                            </div>
                            <div className="border-b-2 border-dotted border-slate-400 pb-2">
                                <p className="text-xs font-bold uppercase text-slate-500">Headmaster's Remark:</p>
                                <p className="text-sm italic mt-1 font-serif">{headmasterComment || ".................................................................................................................................."}</p>
                            </div>
                        </div>

                        {/* SIGNATURES */}
                        <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-dashed border-slate-300">
                            <div className="text-center">
                                <div className="h-10 border-b border-black w-3/4 mx-auto mb-2"></div>
                                <p className="font-bold uppercase text-[10px]">Class Teacher Signature</p>
                            </div>
                            <div className="text-center">
                                <div className="h-10 border-b border-black w-3/4 mx-auto mb-2"></div>
                                <p className="font-bold uppercase text-[10px]">Headmaster Signature</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style jsx global>{`
                @media print {
                    body * { visibility: hidden; }
                    .print\\:hidden { display: none; }
                    #pdf-content, #pdf-content * { visibility: visible; }
                    #pdf-content { position: absolute; left: 0; top: 0; width: 100%; }
                }
            `}</style>
        </div>
    );
}