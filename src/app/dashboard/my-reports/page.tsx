'use client';

import { useState, useMemo, useRef } from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, orderBy, doc, getDoc } from 'firebase/firestore';

/** On-demand single fetch for archived term report cards (NO onSnapshot real-time listener) */
async function fetchArchivedReportCard(firestore: any, schoolId: string, studentId: string, termId: string) {
  const docId = `term_report_card_${schoolId}_${studentId}_${termId}`;
  const docRef = doc(firestore, 'term_report_cards', docId);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }
  return null;
}
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Download, Printer, ChevronRight, Users, Award, GraduationCap } from 'lucide-react';
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

    const displayReport = useMemo(() => {
        if (!selectedReport) return null;
        return {
            ...selectedReport,
            schoolPhone: selectedReport.schoolPhone || schoolProfile?.phone || null,
            schoolEmail: selectedReport.schoolEmail || schoolProfile?.email || null,
            schoolWebsite: selectedReport.schoolWebsite || selectedReport.website || schoolProfile?.website || schoolProfile?.schoolWebsite || null,
            website: selectedReport.website || selectedReport.schoolWebsite || schoolProfile?.website || schoolProfile?.schoolWebsite || null,
            logoUrl: selectedReport.logoUrl || schoolProfile?.logoUrl || null,
            brandColor: selectedReport.brandColor || schoolProfile?.brandColor || '#1e293b',
            gradingSystem: (selectedReport.gradingSystem && Array.isArray(selectedReport.gradingSystem) && selectedReport.gradingSystem.length > 0)
                ? selectedReport.gradingSystem
                : (schoolProfile?.gradingSystem && Array.isArray(schoolProfile.gradingSystem) && schoolProfile.gradingSystem.length > 0 ? schoolProfile.gradingSystem : null),
        };
    }, [selectedReport, schoolProfile]);

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
        return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600 h-8 w-8"/></div>;
    }

    if (!selectedReport && (!reports || reports.length === 0)) {
        return (
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-8 md:p-10 shadow-xl border border-indigo-950/20 text-white">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[80px]" />

                    <div className="relative z-10 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-indigo-200 text-xs font-black uppercase tracking-wider">
                            <GraduationCap className="h-3.5 w-3.5" /> Academic Transcript Hub
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                                My Reports
                            </h1>
                            <p className="text-indigo-200/85 text-sm md:text-base max-w-xl font-medium leading-relaxed font-sans">
                                Official terminal results released by the school administration.
                            </p>
                        </div>
                    </div>
                </div>

                <Card className="border-2 border-dashed bg-slate-50/50 rounded-[2rem]">
                    <CardContent className="py-20 flex flex-col items-center gap-4 text-muted-foreground">
                        <Users className="h-12 w-12 text-slate-300" />
                        <p className="text-lg font-medium text-slate-700">No published reports found.</p>
                        <p className="text-sm text-slate-500 text-center max-w-md">Reports will appear here once they are released by the school administration.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (selectedReport && displayReport) {
        return (
            <div className="space-y-6 max-w-5xl mx-auto pb-20 p-4 md:p-6">
                <div className="flex justify-between items-center print:hidden bg-slate-50/40 p-4 rounded-2xl border border-slate-100/50 backdrop-blur-md">
                    <Button variant="ghost" onClick={() => setSelectedReport(null)} className="gap-2 font-bold hover:bg-slate-100/80 rounded-xl">
                        <ChevronRight className="rotate-180 h-4 w-4" /> Back to List
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.print()} className="rounded-xl font-bold border-slate-200 shadow-sm"><Printer className="mr-2 h-4 w-4 text-indigo-600"/> Print</Button>
                        <Button onClick={handleDownloadPDF} disabled={isExporting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md">
                            {isExporting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Download className="mr-2 h-4 w-4"/>}
                            Download PDF
                        </Button>
                    </div>
                </div>

                <div className="flex justify-center bg-slate-950/95 p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-auto">
                    <div className="shadow-2xl border border-slate-900 rounded-3xl overflow-hidden bg-white scale-[0.8] origin-top md:scale-100">
                        <ReportCardTemplate
                            data={displayReport}
                            classTeacherComment={displayReport.classTeacherComment}
                            headmasterComment={displayReport.headmasterComment}
                            caWeight={displayReport.caWeight ?? CA_WEIGHT}
                            examWeight={displayReport.examWeight ?? EXAM_WEIGHT}
                        />
                    </div>
                </div>

                <div
                    ref={printRef}
                    style={{ display: 'none', visibility: 'hidden', position: 'absolute', top: 0, left: 0, zIndex: -1, width: '794px' }}
                >
                    <ReportCardTemplate
                        data={displayReport}
                        classTeacherComment={displayReport.classTeacherComment}
                        headmasterComment={displayReport.headmasterComment}
                        caWeight={displayReport.caWeight ?? CA_WEIGHT}
                        examWeight={displayReport.examWeight ?? EXAM_WEIGHT}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-6">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-8 md:p-10 shadow-xl border border-indigo-950/20 text-white">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-[80px]" />
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[80px]" />

                <div className="relative z-10 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-indigo-200 text-xs font-black uppercase tracking-wider">
                        <GraduationCap className="h-3.5 w-3.5" /> Academic Transcript Hub
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                            My Reports
                        </h1>
                        <p className="text-indigo-200/85 text-sm md:text-base max-w-xl font-medium leading-relaxed font-sans">
                            Official terminal results released by the school administration.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Academic Transcript List
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports?.map((report: any) => {
                        const average = report.overallAverage || report.finalPercentage || 0;
                        
                        const getAverageColor = (avg: number) => {
                            if (avg >= 80) return 'from-emerald-500 to-teal-500 text-white';
                            if (avg >= 70) return 'from-indigo-500 to-indigo-600 text-white';
                            if (avg >= 50) return 'from-amber-500 to-orange-500 text-white';
                            return 'from-rose-500 to-red-500 text-white';
                        };

                        return (
                            <Card 
                                key={report.id} 
                                className="cursor-pointer hover:ring-2 hover:ring-indigo-500 hover:shadow-md transition-all group overflow-hidden rounded-3xl border border-slate-100/80 bg-white"
                                onClick={() => setSelectedReport(report)}
                            >
                                <CardHeader className="bg-slate-50/50 border-b border-slate-100 group-hover:bg-indigo-50/30 transition-colors p-6">
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="bg-white border-indigo-200 text-indigo-700 rounded-lg font-bold text-[10px] uppercase">
                                            {report.academicYear}
                                        </Badge>
                                        <span className="text-[10px] uppercase font-bold text-slate-400">
                                            {report.publishedAt ? format(report.publishedAt.toDate(), 'dd MMM yyyy') : ''}
                                        </span>
                                    </div>
                                    <CardTitle className="pt-3 text-lg font-black text-slate-800 leading-snug">{report.term}</CardTitle>
                                    <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                        {report.student?.firstName} {report.student?.lastName}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 flex justify-between items-center">
                                    <div className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${getAverageColor(average)} font-black text-[11px] shadow-sm flex items-center justify-center gap-1.5`}>
                                        <span className="opacity-80">AVG</span>
                                        <span>{average}%</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform font-bold text-xs uppercase text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/50 p-0 h-auto">
                                        View Report <ChevronRight className="ml-1 h-3.5 w-3.5" />
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}