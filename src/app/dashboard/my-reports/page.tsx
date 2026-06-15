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
import { Loader2, FileText, Download, Printer, ChevronRight, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import ReportCardTemplate from '../report-cards/components/ReportCardTemplate';

export default function MyReportsPage() {
    const { user } = useUser();
    const { role, profile, loading: roleLoading } = useRole();
    const firestore = useFirestore();
    const { schoolId, loading: schoolLoading } = useCurrentSchool();
    const { toast } = useToast();

    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [isExporting, setIsExporting] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const parentStudentIds = useMemo(() => {
        return profile?.studentIds || profile?.student_ids || profile?.students || profile?.childrenIds || profile?.linkedStudentIds || profile?.linked_students || profile?.studentIDs || [];
    }, [profile]);
    const parentStudentIdsStr = parentStudentIds.join(',');

    const reportsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !role || roleLoading) return null;

        const baseQuery = collection(firestore, 'report-cards');

        if (role === 'Student') {
            return query(
                baseQuery,
                where('schoolId', '==', schoolId),
                where('studentId', '==', user?.uid),
                where('status', '==', 'Published'),
                orderBy('publishedAt', 'desc')
            );
        } 
        
        if (role === 'Parent') {
            if (parentStudentIds.length === 0) return null;
            
            return query(
                baseQuery,
                where('schoolId', '==', schoolId),
                where('studentId', 'in', parentStudentIds),
                where('status', '==', 'Published'),
                orderBy('publishedAt', 'desc')
            );
        }

        return null;
    }, [firestore, schoolId, role, user?.uid, parentStudentIdsStr, roleLoading]);

    const { data: reports, isLoading: reportsLoading } = useCollection<any>(reportsQuery);

    const schoolProfileRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    const CA_WEIGHT = schoolProfile?.caWeight ?? 30;
    const EXAM_WEIGHT = schoolProfile?.examWeight ?? 70;

    const handleDownloadPDF = async () => {
        const element = printRef.current;
        if (!element || !selectedReport) return;
        
        setIsExporting(true);
        try {
            element.style.display = 'block';
            element.style.visibility = 'visible';
            element.style.position = 'fixed';
            element.style.top = '0';
            element.style.left = '0';
            element.style.zIndex = '-1';

            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(element, { 
                scale: 2, 
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 794,
                windowHeight: 1123,
            });

            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.position = 'absolute';

            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, 297);
            pdf.save(`${selectedReport.student?.firstName || 'Student'}_Report_${selectedReport.term}.pdf`);
            
            toast({ title: "Success", description: "Report card downloaded." });
        } catch (error) {
            console.error("PDF Download Error:", error);
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
                        <Users className="h-12 w-12 text-slate-300" />
                        <p className="text-lg font-medium">No published reports found.</p>
                        <p className="text-sm">Reports will appear here once they are released by the school administration.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (selectedReport) {
        return (
            <div className="space-y-6 max-w-5xl mx-auto pb-20 p-4">
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

                <div className="flex justify-center bg-slate-100 p-4 rounded-xl border overflow-auto">
                    <div className="shadow-2xl ring-1 ring-black/5 scale-[0.8] origin-top md:scale-100">
                        <ReportCardTemplate
                            data={selectedReport}
                            classTeacherComment={selectedReport.classTeacherComment}
                            headmasterComment={selectedReport.headmasterComment}
                            caWeight={selectedReport.caWeight ?? CA_WEIGHT}
                            examWeight={selectedReport.examWeight ?? EXAM_WEIGHT}
                        />
                    </div>
                </div>

                <div
                    ref={printRef}
                    style={{ display: 'none', visibility: 'hidden', position: 'absolute', top: 0, left: 0, zIndex: -1, width: '794px' }}
                >
                    <ReportCardTemplate
                        data={selectedReport}
                        classTeacherComment={selectedReport.classTeacherComment}
                        headmasterComment={selectedReport.headmasterComment}
                        caWeight={selectedReport.caWeight ?? CA_WEIGHT}
                        examWeight={selectedReport.examWeight ?? EXAM_WEIGHT}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
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
                            <CardDescription>{report.student?.firstName} {report.student?.lastName}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 flex justify-between items-center">
                            <div className="text-sm font-medium text-slate-600">
                                Avg: <span className="text-indigo-600 font-bold">{report.overallAverage}%</span>
                            </div>
                            <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                                View Report <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}