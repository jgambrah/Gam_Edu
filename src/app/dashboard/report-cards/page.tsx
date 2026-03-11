'use client';

import { useState, useMemo, useRef } from 'react';
import { useAuth, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, getDocs, doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Printer, Download, Search } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

// --- GES GRADING SYSTEM ---
function getGradeAndRemark(score: number) {
    if (score >= 80) return { grade: 'A', remark: 'Excellent' };
    if (score >= 70) return { grade: 'B', remark: 'Very Good' };
    if (score >= 60) return { grade: 'C', remark: 'Good' };
    if (score >= 50) return { grade: 'D', remark: 'Credit' };
    if (score >= 40) return { grade: 'E', remark: 'Pass' };
    return { grade: 'F', remark: 'Fail' };
}

// --- MAIN COMPONENT ---
export default function ReportCardsPage() {
    const { user } = useAuth();
    const { role } = useRole();
    const firestore = useFirestore();
    const { schoolId } = useCurrentSchool();
    const { toast } = useToast();

    // Filters
    const [classId, setClassId] = useState('');
    const [term, setTerm] = useState('First Term');
    const [academicYear, setAcademicYear] = useState('2024-2025');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    // Global Remarks State
    const [classTeacherRemark, setClassTeacherRemark] = useState('');
    const [headmasterRemark, setHeadmasterRemark] = useState('');

    // State for generation
    const [isGenerating, setIsGenerating] = useState(false);
    const [processedReport, setProcessedReport] = useState<any>(null);

    // Refs for PDF
    const printRef = useRef<HTMLDivElement>(null);

    const canManage = ['Administrator', 'Director', 'Teacher'].includes(role || '');

    // --- DATA FETCHING ---
    const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: classes } = useCollection<any>(classesQuery);

    const studentsQuery = useMemoFirebase(() => (firestore && schoolId && classId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('classId', '==', classId)) : null, [firestore, schoolId, classId]);
    const { data: students } = useCollection<any>(studentsQuery);

    const subjectsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
    const { data: subjects } = useCollection<any>(subjectsQuery);

    const schoolProfileRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

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

            // 2. Calculate Class Averages & Positions
            const subjectStats: Record<string, { totalScores: number[], sum: number }> = {};
            const studentTotals: Record<string, number> = {};

            subjects?.forEach((sub: any) => { subjectStats[sub.id] = { totalScores: [], sum: 0 }; });

            students?.forEach((stu: any) => {
                let grandTotal = 0;
                let subjectsTaken = 0;
                
                subjects?.forEach((sub: any) => {
                    const stuSubjAssessments = allAssessments.filter(a => a.studentId === stu.uid && a.subjectId === sub.id);
                    if (stuSubjAssessments.length === 0) return;

                    const cas = stuSubjAssessments.filter(a => a.assessmentType.includes('CA'));
                    const caScore = cas.reduce((sum, a) => sum + a.score, 0);
                    const caMax = cas.reduce((sum, a) => sum + a.maxScore, 0);
                    const weightedCA = caMax > 0 ? (caScore / caMax) * 50 : 0;

                    const exams = stuSubjAssessments.filter(a => a.assessmentType.includes('Exam'));
                    const examScore = exams.reduce((sum, a) => sum + a.score, 0);
                    const examMax = exams.reduce((sum, a) => sum + a.maxScore, 0);
                    const weightedExam = examMax > 0 ? (examScore / examMax) * 50 : 0;

                    const total100 = weightedCA + weightedExam;
                    grandTotal += total100;
                    subjectsTaken++;

                    if (subjectStats[sub.id]) {
                        subjectStats[sub.id].totalScores.push(total100);
                        subjectStats[sub.id].sum += total100;
                    }
                });
                studentTotals[stu.uid] = subjectsTaken > 0 ? grandTotal / subjectsTaken : 0;
            });

            const sortedStudents = Object.entries(studentTotals).sort(([,a], [,b]) => b - a);
            const classPosition = sortedStudents.findIndex(([uid]) => uid === selectedStudentId) + 1;

            // 3. Extract Data for the Selected Student
            const targetStudent = students?.find((s:any) => s.uid === selectedStudentId);
            const reportRows = [];
            let myGrandTotal = 0;
            let mySubjectsTaken = 0;

            subjects?.forEach((sub: any) => {
                const myAssessments = allAssessments.filter(a => a.studentId === selectedStudentId && a.subjectId === sub.id);
                if (myAssessments.length === 0) return; 

                const cas = myAssessments.filter(a => a.assessmentType.includes('CA'));
                const caScore = cas.reduce((sum, a) => sum + a.score, 0);
                const caMax = cas.reduce((sum, a) => sum + a.maxScore, 0);
                const weightedCA = caMax > 0 ? (caScore / caMax) * 50 : 0;

                const exams = myAssessments.filter(a => a.assessmentType.includes('Exam'));
                const examScore = exams.reduce((sum, a) => sum + a.score, 0);
                const examMax = exams.reduce((sum, a) => sum + a.maxScore, 0);
                const weightedExam = examMax > 0 ? (examScore / examMax) * 50 : 0;

                const total100 = Math.round(weightedCA + weightedExam);
                myGrandTotal += total100;
                mySubjectsTaken++;

                const { grade, remark } = getGradeAndRemark(total100);
                
                const mySubjectRank = subjectStats[sub.id].totalScores.sort((a,b)=>b-a).indexOf(total100) + 1;
                const subjectAverage = subjectStats[sub.id].totalScores.length > 0 
                    ? Math.round(subjectStats[sub.id].sum / subjectStats[sub.id].totalScores.length) 
                    : 0;

                // Use the last specific teacher remark entered if available
                const savedRemark = myAssessments.find(a => a.remark)?.remark;

                reportRows.push({
                    subjectName: sub.name,
                    ca: Math.round(weightedCA),
                    exam: Math.round(weightedExam),
                    total: total100,
                    grade,
                    remark: savedRemark || remark,
                    classAverage: subjectAverage,
                    position: mySubjectRank
                });
            });

            const overallAverage = mySubjectsTaken > 0 ? Math.round(myGrandTotal / mySubjectsTaken) : 0;

            setProcessedReport({
                student: targetStudent,
                rows: reportRows,
                overallAverage,
                totalScore: myGrandTotal,
                classPosition,
                totalStudents: students?.length || 0
            });

        } catch (error: any) {
            console.error(error);
            toast({ variant: 'destructive', title: "Error", description: "Failed to generate report." });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPDF = async () => {
        const element = printRef.current;
        if (!element) return;

        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${processedReport?.student?.firstName}_ReportCard_${term}.pdf`);
        } catch (error) {
            console.error("PDF Error:", error);
            toast({ variant: 'destructive', title: "Export Failed" });
        }
    };

    if (!canManage) return <div className="p-8 text-center text-muted-foreground">Access Restricted. Only staff can generate official reports.</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Terminal Report Cards</h1>
            </div>

            <Card className="border-t-4 border-t-indigo-600 shadow-sm">
                <CardHeader><CardTitle>Report Generator</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Academic Year</Label>
                            <Input value={academicYear} onChange={(e: any) => setAcademicYear(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Term</Label>
                            <Select value={term} onValueChange={setTerm}>
                                <SelectTrigger><SelectValue/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="First Term">First Term</SelectItem>
                                    <SelectItem value="Second Term">Second Term</SelectItem>
                                    <SelectItem value="Third Term">Third Term</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Class</Label>
                            <Select value={classId} onValueChange={setClassId}>
                                <SelectTrigger><SelectValue placeholder="Select Class"/></SelectTrigger>
                                <SelectContent>
                                    {classes?.map((c:any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Select Student</Label>
                            <Select value={selectedStudentId || ''} onValueChange={setSelectedStudentId} disabled={!classId}>
                                <SelectTrigger><SelectValue placeholder="Choose Student"/></SelectTrigger>
                                <SelectContent>
                                    {students?.map((s:any) => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                        <div className="space-y-2">
                            <Label className="text-blue-700 font-bold">Class Teacher's Remark</Label>
                            <Textarea 
                                placeholder="General remark on behavior and academic progress..." 
                                value={classTeacherRemark} 
                                onChange={e => setClassTeacherRemark(e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-red-700 font-bold">Headmaster's Remark</Label>
                            <Textarea 
                                placeholder="Principal's final endorsement..." 
                                value={headmasterRemark} 
                                onChange={e => setHeadmasterRemark(e.target.value)} 
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-end bg-slate-50 pt-4">
                    <Button onClick={generateReport} disabled={isGenerating || !selectedStudentId} className="bg-indigo-600">
                        {isGenerating ? <Loader2 className="animate-spin mr-2"/> : <Search className="mr-2 h-4 w-4"/>}
                        Generate Report
                    </Button>
                </CardFooter>
            </Card>

            {processedReport && (
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => window.print()} className="print:hidden">
                        <Printer className="mr-2 h-4 w-4"/> Print
                    </Button>
                    <Button onClick={handleDownloadPDF} className="bg-green-600 hover:bg-green-700">
                        <Download className="mr-2 h-4 w-4"/> Download PDF
                    </Button>
                </div>
            )}

            {processedReport && (
                <div className="overflow-x-auto bg-slate-200 p-8 flex justify-center rounded-xl border border-slate-300">
                    <div 
                        ref={printRef} 
                        className="bg-white p-12 shadow-2xl" 
                        style={{ width: '210mm', minHeight: '297mm', color: 'black' }}
                        id="pdf-content"
                    >
                        {/* HEADER */}
                        <div className="text-center border-b-4 border-double border-slate-800 pb-6 mb-6">
                            <h1 className="text-4xl font-black uppercase tracking-widest">{schoolProfile?.name || "SCHOOL NAME"}</h1>
                            <p className="text-sm font-bold mt-1">{schoolProfile?.address || "Address Line 1"}</p>
                            <p className="text-sm font-bold">{schoolProfile?.phone || "Phone"} | {schoolProfile?.email || "Email"}</p>
                            <h2 className="text-2xl font-bold mt-6 bg-slate-100 py-2 border border-slate-300">TERMINAL REPORT</h2>
                        </div>

                        {/* STUDENT INFO */}
                        <div className="grid grid-cols-2 gap-4 mb-8 text-sm border-2 p-4 font-medium">
                            <div><strong>Name:</strong> {processedReport.student.firstName} {processedReport.student.lastName}</div>
                            <div><strong>Term:</strong> {term}</div>
                            <div><strong>Class:</strong> {classes?.find((c:any) => c.id === classId)?.name}</div>
                            <div><strong>Academic Year:</strong> {academicYear}</div>
                            <div><strong>Position in Class:</strong> {processedReport.classPosition} out of {processedReport.totalStudents}</div>
                            <div><strong>Overall Average:</strong> {processedReport.overallAverage}%</div>
                        </div>

                        {/* GRADES TABLE */}
                        <table className="w-full text-xs border-collapse border border-slate-800 mb-8">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="border border-slate-800 p-2 text-left">Subject</th>
                                    <th className="border border-slate-800 p-2 text-center w-12">CA (50)</th>
                                    <th className="border border-slate-800 p-2 text-center w-12">Exam (50)</th>
                                    <th className="border border-slate-800 p-2 text-center w-12">Total</th>
                                    <th className="border border-slate-800 p-2 text-center w-12">Class Avg</th>
                                    <th className="border border-slate-800 p-2 text-center w-12">Pos</th>
                                    <th className="border border-slate-800 p-2 text-center w-12">Grade</th>
                                    <th className="border border-slate-800 p-2 text-left w-32">Teacher's Remark</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedReport.rows.map((row: any, i: number) => (
                                    <tr key={i}>
                                        <td className="border border-slate-800 p-2 font-bold">{row.subjectName}</td>
                                        <td className="border border-slate-800 p-2 text-center">{row.ca}</td>
                                        <td className="border border-slate-800 p-2 text-center">{row.exam}</td>
                                        <td className="border border-slate-800 p-2 text-center font-bold">{row.total}</td>
                                        <td className="border border-slate-800 p-2 text-center text-slate-500">{row.classAverage}</td>
                                        <td className="border border-slate-800 p-2 text-center">{row.position}</td>
                                        <td className="border border-slate-800 p-2 text-center font-bold">{row.grade}</td>
                                        <td className="border border-slate-800 p-2 italic">{row.remark}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* REMARKS SECTION */}
                        <div className="space-y-4 mb-8">
                            <div className="p-3 border border-slate-800 rounded">
                                <p className="text-xs font-bold uppercase mb-1">Class Teacher's Remark:</p>
                                <p className="text-sm italic min-h-[3em]">{classTeacherRemark || "No remark entered."}</p>
                            </div>
                            <div className="p-3 border border-slate-800 rounded">
                                <p className="text-xs font-bold uppercase mb-1">Headmaster's Remark:</p>
                                <p className="text-sm italic min-h-[3em]">{headmasterRemark || "No remark entered."}</p>
                            </div>
                        </div>

                        {/* SIGNATURES */}
                        <div className="grid grid-cols-2 gap-8 mt-16 pt-8 border-t-2 border-dashed">
                            <div className="text-center">
                                <div className="h-10 border-b border-black w-3/4 mx-auto mb-2"></div>
                                <p className="font-bold">Class Teacher Signature</p>
                            </div>
                            <div className="text-center">
                                <div className="h-10 border-b border-black w-3/4 mx-auto mb-2"></div>
                                <p className="font-bold">Headmaster Signature</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
