'use client';

import { useState, useMemo, useRef } from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, orderBy, doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Download, Printer, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

export default function MyReportsPage() {
    const { user } = useUser();
    const { role, profile, loading: roleLoading } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const { toast } = useToast();

    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [isExporting, setIsExporting] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const targetStudentIds = useMemo(() => {
        if (role === 'Student' && user) return [user.uid];
        if (role === 'Parent' && profile?.studentIds) return profile.studentIds;
        return [];
    }, [role, user, profile]);

    const reportsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || targetStudentIds.length === 0 || roleLoading) return null;
        
        // Students/Parents only list published reports where they are the owner
        return query(
            collection(firestore, 'report-cards'),
            where('schoolId', '==', schoolId),
            where('studentId', 'in', targetStudentIds),
            where('status', '==', 'Published'),
            orderBy('publishedAt', 'desc')
        );
    }, [firestore, schoolId, targetStudentIds, roleLoading]);

    const { data: reports, isLoading: reportsLoading } = useCollection<any>(reportsQuery);

    const schoolProfileRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    const handleDownloadPDF = async () => {
        const element = printRef.current;
        if (!element || !selectedReport) return;
        setIsExporting(true);
        try {
            element.style.display = 'block';
            
            const canvas = await html2canvas(element, { 
                scale: 2, 
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${selectedReport.studentName}_Report_${selectedReport.term}.pdf`);
            
            element.style.display = 'none';
            toast({ title: "Success", description: "Report card downloaded." });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Download Failed" });
        } finally {
            setIsExporting(false);
        }
    };

    if (schoolLoading || reportsLoading || roleLoading) {
        return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-primary h-8 w-8"/></div>;
    }

    if (!selectedReport && (!reports || reports.length === 0)) {
        return (
            <div className="p-6">
                <Card className="border-2 border-dashed bg-slate-50/50">
                    <CardContent className="py-20 flex flex-col items-center gap-4 text-muted-foreground">
                        <FileText className="h-12 w-12 opacity-20" />
                        <p className="text-lg font-medium">No published reports found.</p>
                        <p className="text-sm">Reports will appear here once they are released by the school administration.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (selectedReport) {
        return (
            <div className="space-y-6 max-w-5xl mx-auto pb-20">
                <div className="flex justify-between items-center print:hidden">
                    <Button variant="ghost" onClick={() => setSelectedReport(null)} className="gap-2">
                        <ChevronRight className="rotate-180 h-4 w-4" /> Back to List
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4"/> Print</Button>
                        <Button onClick={handleDownloadPDF} disabled={isExporting} className="bg-indigo-600">
                            {isExporting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Download className="mr-2 h-4 w-4"/>}
                            Download PDF
                        </Button>
                    </div>
                </div>

                <Card className="border-none shadow-xl overflow-hidden bg-white">
                    <CardHeader className="bg-slate-50 border-b p-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl text-slate-900">{selectedReport.studentName}</CardTitle>
                                <CardDescription className="text-lg font-medium text-indigo-600">
                                    {selectedReport.academicYear} • {selectedReport.term}
                                </CardDescription>
                                <div className="mt-4 flex gap-4 text-sm text-slate-500">
                                    <Badge variant="outline" className="bg-white">{selectedReport.className}</Badge>
                                    <span>Pos: <strong>{selectedReport.classPosition}</strong> of {selectedReport.totalStudents}</span>
                                    <span>Avg: <strong>{selectedReport.overallAverage}%</strong></span>
                                </div>
                            </div>
                            {schoolProfile?.logoUrl && (
                                <img 
                                    src={schoolProfile.logoUrl} 
                                    alt="School Logo" 
                                    className="w-20 h-20 object-contain" 
                                />
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50">
                                    <TableHead className="font-bold">Subject</TableHead>
                                    <TableHead className="text-center">CA</TableHead>
                                    <TableHead className="text-center">Exam</TableHead>
                                    <TableHead className="text-center">Total</TableHead>
                                    <TableHead className="text-center">Grade</TableHead>
                                    <TableHead>Remark</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selectedReport.rows.map((row: any, i: number) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-semibold">{row.subjectName}</TableCell>
                                        <TableCell className="text-center text-slate-500">{row.ca}</TableCell>
                                        <TableCell className="text-center text-slate-500">{row.exam}</TableCell>
                                        <TableCell className="text-center font-bold">{row.total}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={row.grade === 'F' ? 'destructive' : 'default'}>{row.grade}</Badge>
                                        </TableCell>
                                        <TableCell className="text-xs italic text-slate-600">{row.autoRemark}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-6 p-8 border-t bg-slate-50/30">
                        <div className="w-full grid md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Class Teacher's Remark</h4>
                                <div className="p-4 bg-white border rounded-lg italic text-slate-700">
                                    {selectedReport.classTeacherComment || "No comment provided."}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-sm font-bold uppercase text-slate-400 tracking-wider">Headmaster's Remark</h4>
                                <div className="p-4 bg-white border rounded-lg italic text-slate-700">
                                    {selectedReport.headmasterComment || "No comment provided."}
                                </div>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <FileText className="text-indigo-600 h-8 w-8" /> My Report Cards
                </h1>
                <p className="text-muted-foreground">View and download your official terminal results.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports?.map((report: any) => (
                    <Card 
                        key={report.id} 
                        className="cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all group overflow-hidden"
                        onClick={() => setSelectedReport(report)}
                    >
                        <CardHeader className="bg-slate-50 group-hover:bg-indigo-50 transition-colors">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="bg-white border-indigo-200 text-indigo-700">
                                    {report.academicYear}
                                </Badge>
                                <span className="text-[10px] uppercase font-bold text-slate-400">
                                    {report.publishedAt ? format(report.publishedAt.toDate(), 'dd MMM yyyy') : ''}
                                </span>
                            </div>
                            <CardTitle className="pt-2 text-xl">{report.term}</CardTitle>
                            <CardDescription>{report.studentName}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 flex justify-between items-center">
                            <div className="text-sm font-medium text-slate-600">
                                Avg: <span className="text-indigo-600 font-bold">{report.overallAverage}%</span>
                            </div>
                            <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                                View Details <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
