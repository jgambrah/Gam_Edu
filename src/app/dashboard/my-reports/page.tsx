'use client';

import { useState, useMemo, useRef } from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, orderBy, doc, getDoc } from 'firebase/firestore';

/** On-demand single fetch for archived term report cards (NO onSnapshot real-time listener) */
async function fetchArchivedReportCard(firestore: any, schoolId: string, studentId: string, termId: string, reportSeries?: string) {
  const baseId = `term_report_card_${schoolId}_${studentId}_${termId}`;
  const docId = reportSeries && reportSeries !== 'end_of_term' ? `${baseId}__${reportSeries}` : baseId;
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
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import ReportCardTemplate from '../report-cards/components/ReportCardTemplate';
import { getReportCardSeriesKey, getReportCardSeriesLabel, sanitizeReportFilenamePart } from '@/lib/academic-series';

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
        const raw = profile?.studentIds || profile?.student_ids || profile?.students || profile?.childrenIds || profile?.linkedStudentIds || profile?.linked_students || profile?.studentIDs || [];
        return Array.from(new Set((Array.isArray(raw) ? raw : []).map((id: any) => String(id || '').trim()).filter(Boolean))).slice(0, 30);
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
            const pageHeight = 297;
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;

            if (imgHeight <= pageHeight + 4) {
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(imgHeight, pageHeight));
            } else {
                let heightLeft = imgHeight;
                let position = 0;
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pageHeight;
                while (heightLeft > 2) {
                    position -= pageHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
                    heightLeft -= pageHeight;
                }
            }
            const safeStudent = sanitizeReportFilenamePart(`${selectedReport.student?.firstName || 'Student'}_${selectedReport.student?.lastName || ''}`);
            const safeSeries = sanitizeReportFilenamePart(getReportCardSeriesLabel(selectedReport));
            const safeYear = sanitizeReportFilenamePart(selectedReport.academicYear);
            const safeTerm = sanitizeReportFilenamePart(selectedReport.term);
            pdf.save(`${safeStudent}_${safeSeries}_Report_${safeYear}_${safeTerm}.pdf`);
            
            toast({ title: "Success", description: "Report card downloaded." });
        } catch (error) {
            console.error("PDF Download Error:", error);
            toast({ variant: 'destructive', title: "Download Failed" });
        } finally {
            setIsExporting(false);
        }
    };

    const avgOf = (r: any) => Math.round((Number(r.overallAverage ?? r.finalPercentage) || 0) * 10) / 10;
    const bandColor = (v: number) => v >= 80 ? 'text-emerald-600' : v >= 70 ? 'text-indigo-600' : v >= 50 ? 'text-amber-600' : 'text-rose-600';
    // One section per child, newest report first (End of Term ranked above Mocks/Mid-Term within the same term).
    const childGroups = useMemo(() => {
        const termNo = (t: any) => { const m = String(t || '').match(/(first|1)|(second|2)|(third|3)/i); return m ? (m[1] ? 1 : m[2] ? 2 : 3) : 0; };
        const seriesOrderScore = (r: any) => {
            const k = getReportCardSeriesKey(r);
            if (k === 'end_of_term') return '99';
            const m = k.match(/^mock_(\d+)$/);
            if (m) return String(Math.min(89, 50 + parseInt(m[1], 10))).padStart(2, '0');
            if (k.startsWith('mock_')) return '50';
            if (k === 'mid_term') return '10';
            return '00';
        };
        const map = new Map<string, { key: string; name: string; reports: any[] }>();
        (reports || []).forEach((r: any) => {
            const key = r.studentId || r.student?.uid || r.id;
            const name = `${r.student?.firstName || ''} ${r.student?.lastName || ''}`.trim() || r.studentName || 'Student';
            if (!map.has(key)) map.set(key, { key, name, reports: [] });
            map.get(key)!.reports.push(r);
        });
        const order = (r: any) => `${String(r.academicYear || '').slice(0, 4)}-${termNo(r.term)}-${seriesOrderScore(r)}`;
        const groups = Array.from(map.values());
        groups.forEach(g => g.reports.sort((a, b) => order(b).localeCompare(order(a))));
        return groups.sort((a, b) => parentStudentIds.indexOf(a.key) - parentStudentIds.indexOf(b.key));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reports, parentStudentIdsStr]);

    if (schoolLoading || reportsLoading || roleLoading) {
        return <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-indigo-600 h-8 w-8"/></div>;
    }

    if (!selectedReport && (!reports || reports.length === 0)) {
        return (
            <div className="p-6 max-w-5xl mx-auto space-y-6">
                <div>
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-indigo-600">Results</p>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Report Cards</h1>
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
        <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6">
            <div>
                <p className="text-[10px] font-black tracking-[0.2em] uppercase text-indigo-600">Results</p>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Report Cards</h1>
                <p className="text-xs text-slate-500 font-medium mt-1">Official End-of-Term, Mid-Term, and Mock report cards released by the school. Open one to view, print or download it.</p>
            </div>

            {childGroups.map(group => {
                const latestPrimary = group.reports.find((r: any) => getReportCardSeriesKey(r) === 'end_of_term') || group.reports[0];
                return (
                <Card key={group.key} className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black shrink-0">
                                {group.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('')}
                            </div>
                            <div className="min-w-0">
                                <CardTitle className="text-base font-black text-slate-900 truncate">{group.name}</CardTitle>
                                <CardDescription className="text-[11px] font-semibold">
                                    {group.reports.length} report{group.reports.length === 1 ? '' : 's'}{latestPrimary?.className ? ` · latest in ${latestPrimary.className}` : ''}
                                </CardDescription>
                            </div>
                        </div>
                        {latestPrimary && (
                            <div className="text-right shrink-0">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                                    Latest ({getReportCardSeriesLabel(latestPrimary)})
                                </p>
                                <p className={cn("text-xl font-black", bandColor(avgOf(latestPrimary)))}>{avgOf(latestPrimary)}%</p>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        {group.reports.map((report: any, i: number) => {
                            const avg = avgOf(report);
                            const seriesKey = getReportCardSeriesKey(report);
                            // Compare strictly within the SAME report series (never compare Mock 2 against End-of-Term!)
                            const prev = group.reports.slice(i + 1).find((r: any) => getReportCardSeriesKey(r) === seriesKey);
                            const diff = prev ? Math.round((avg - avgOf(prev)) * 10) / 10 : null;
                            const showPos = (report.reportCardPositionMode || 'both') === 'both' && report.classPosition;
                            const size = report.totalClassStudents || report.cohortTotal || report.totalStudents;
                            const published = report.publishedAt?.toDate ? format(report.publishedAt.toDate(), 'd MMM yyyy') : '';
                            return (
                                <button key={report.id} onClick={() => setSelectedReport(report)}
                                    className="w-full text-left flex items-center gap-4 px-6 py-4 border-t border-slate-100 hover:bg-indigo-50/40 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-black text-slate-800">{report.term} <span className="text-slate-400 font-bold">· {report.academicYear}</span></p>
                                            <Badge className={cn("border text-[9px] font-black uppercase px-2 py-0.2",
                                                getReportCardSeriesKey(report).startsWith('mock_')
                                                    ? "bg-amber-100 text-amber-900 border-amber-300"
                                                    : getReportCardSeriesKey(report) === 'mid_term'
                                                        ? "bg-purple-100 text-purple-900 border-purple-300"
                                                        : "bg-indigo-50 text-indigo-800 border-indigo-200"
                                            )}>
                                                {getReportCardSeriesLabel(report)}
                                            </Badge>
                                        </div>
                                        <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                                            {report.className ? `${report.className} · ` : ''}{showPos ? `Position ${report.classPosition}${size ? ` of ${size}` : ''} · ` : ''}{report.beceAggregate ? `BECE Agg. ${report.beceAggregate} · ` : ''}{published ? `Released ${published}` : ''}
                                        </p>
                                        {report.promotionDecision ? (
                                            <Badge className={cn("mt-1.5 border-none text-[9px] font-black uppercase",
                                                report.promotionDecision === 'Repeated' ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800")}>
                                                {report.promotionDecision === 'Promoted' ? `Promoted${report.promotedToClassName ? ` to ${report.promotedToClassName}` : ''}` : report.promotionDecision}
                                            </Badge>
                                        ) : null}
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className={cn("text-lg font-black", bandColor(avg))}>{avg}%</p>
                                        <p className={cn("text-[10px] font-black", diff === null ? "text-slate-300" : diff > 0 ? "text-emerald-600" : diff < 0 ? "text-rose-600" : "text-slate-400")}>
                                            {diff === null ? 'first report' : diff > 0 ? `▲ ${diff} vs previous` : diff < 0 ? `▼ ${Math.abs(diff)} vs previous` : 'same as previous'}
                                        </p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
                                </button>
                            );
                        })}
                    </CardContent>
                </Card>
                );
            })}
        </div>
    );
}
