'use client';

import { useState, useEffect, useMemo } from 'react';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, writeBatch, doc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { 
  PenTool, CheckCircle2, ShieldCheck, 
  Loader2, Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ReportCardTemplate from '../components/ReportCardTemplate';
import { notifyParents } from '@/app/actions/notifications';
import { getReportCardSeriesKey, getReportCardSeriesLabel } from '@/lib/academic-series';

export default function ReportSigningPortal() {
  const { user } = useUser();
  const { profile } = useRole();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [seriesFilter, setSeriesFilter] = useState<string>('all');
  const [previewReport, setPreviewReport] = useState<any | null>(null);

  const schoolRef = useMemoFirebase(
    () => (firestore && schoolId ? doc(firestore, 'schools', schoolId) : null),
    [firestore, schoolId]
  );
  const { data: schoolData } = useDoc<any>(schoolRef);

  const schoolSettingsRef = useMemoFirebase(
    () => (firestore && schoolId ? doc(firestore, 'schoolSettings', schoolId) : null),
    [firestore, schoolId]
  );
  const { data: schoolSettings } = useDoc<any>(schoolSettingsRef);

  useEffect(() => {
    if (!schoolId || !firestore) return;
    
    const q = query(
      collection(firestore, "report-cards"),
      where("schoolId", "==", schoolId),
      where("status", "==", "Draft")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setReports(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter((r: any) => r.isArchived !== true));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [schoolId, firestore]);

  const seriesPills = useMemo(() => {
    const map = new Map<string, { id: string; label: string; count: number }>();
    reports.forEach(r => {
      const k = getReportCardSeriesKey(r);
      const lbl = getReportCardSeriesLabel(r);
      const cur = map.get(k) || { id: k, label: lbl, count: 0 };
      cur.count++;
      map.set(k, cur);
    });
    return Array.from(map.values());
  }, [reports]);

  const visibleReports = useMemo(() => {
    if (seriesFilter === 'all') return reports;
    return reports.filter(r => getReportCardSeriesKey(r) === seriesFilter);
  }, [reports, seriesFilter]);

  const handleHeadmasterSignOff = async (report: any) => {
    const resolvedSignatureUrl = profile?.signatureUrl || schoolData?.headmasterSignatureUrl || report?.headmasterSignatureUrl || null;
    if (!resolvedSignatureUrl) {
        toast({
          variant: 'destructive',
          title: "Signature Required",
          description: "Please upload the Headmaster signature in School Settings or your staff profile first."
        });
        return;
    }

    if (!firestore) return;

    setSigning(true);
    const batch = writeBatch(firestore);

    try {
      const reportRef = doc(firestore, "report-cards", report.id);
      const verificationHash = `VER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const signerName = profile?.firstName
        ? `${profile.firstName} ${profile.lastName || ''}`.trim()
        : (schoolData?.headmasterName || 'Head of School');
      const seriesLabel = getReportCardSeriesLabel(report);

      batch.update(reportRef, {
        status: 'Published',
        publishedAt: serverTimestamp(),
        headmasterName: signerName,
        headmasterSignatureUrl: resolvedSignatureUrl,
        headmasterSignedAt: serverTimestamp(),
        digitalFingerprint: verificationHash,
      });

      await batch.commit();
      if (report.studentId) {
        notifyParents(
          [report.studentId],
          `${seriesLabel} Report Ready 🎓`,
          `${seriesLabel} report card for ${report.student?.firstName || 'your ward'} has been signed and released.`,
          "/dashboard/my-reports"
        ).catch(() => {});
      }
      if (previewReport?.id === report.id) {
        setPreviewReport(null);
      }
      toast({
        title: "Document Signed & Published 🎓",
        description: `Authorized ${report.student?.firstName || 'student'}'s ${seriesLabel} report card.`
      });
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Authorization Failed", description: e.message });
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto text-black font-bold animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b-8 border-slate-900 pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Academic <span className="text-blue-600">Authorization</span></h1>
          <p className="text-slate-500 font-bold text-xs uppercase italic">Vetting and Electronic Signing of End of Term, Mid-Term &amp; Mock Reports.</p>
        </div>
        <div className="bg-[#0f172a] text-white p-4 rounded-3xl flex items-center gap-3 shadow-xl w-fit">
           <PenTool size={20} className="text-blue-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Review: {visibleReports.length}</span>
        </div>
      </div>

      {seriesPills.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setSeriesFilter('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-black uppercase border transition-all ${
              seriesFilter === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Pending ({reports.length})
          </button>
          {seriesPills.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSeriesFilter(p.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-black uppercase border transition-all ${
                seriesFilter === p.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p.label} ({p.count})
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-blue-600"/></div>
        ) : visibleReports.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[40px]">
                <div className="bg-white p-6 rounded-full w-fit mx-auto mb-4 shadow-sm border-2 border-slate-100">
                    <CheckCircle2 className="h-12 w-12 text-slate-200" />
                </div>
                <p className="text-xl font-black text-slate-400 uppercase tracking-tighter">Desk Clear: No Pending Reports</p>
            </div>
        ) : visibleReports.map(report => (
          <div key={report.id} className="bg-white p-8 rounded-[40px] border-4 border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 hover:border-blue-600 transition-all group">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center font-black text-blue-600 text-xl border-2 border-blue-100">
                   {report.student?.firstName?.[0] || 'S'}
                </div>
                <div>
                   <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{report.className} • {report.term}</p>
                      <Badge className={`text-[9px] font-black uppercase px-2 py-0.5 ${
                          getReportCardSeriesKey(report).startsWith('mock_')
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : getReportCardSeriesKey(report) === 'mid_term'
                                  ? 'bg-teal-100 text-teal-900 border-teal-300'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                          {getReportCardSeriesLabel(report)}
                      </Badge>
                   </div>
                   <h3 className="text-2xl font-black uppercase text-black">{report.student?.firstName} {report.student?.lastName}</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 size={10} className="text-green-600" /></div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase italic">Master Preview Compiled</p>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-4 flex-wrap justify-end">
                <div className="flex flex-col items-end mr-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Overall Avg</span>
                    <span className="text-2xl font-black text-indigo-600">{report.overallAverage}%</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPreviewReport(report)}
                  className="rounded-3xl h-12 px-5 font-black uppercase text-xs tracking-wider border-2 border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  <Eye className="h-4 w-4 mr-2 text-blue-600" /> Preview
                </Button>
                <button 
                  onClick={() => handleHeadmasterSignOff(report)}
                  disabled={signing}
                  className="bg-blue-600 text-white px-8 py-3.5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-black transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                >
                  {signing ? <Loader2 className="animate-spin h-5 w-5" /> : <ShieldCheck size={20} />}
                  Authorize &amp; Sign
                </button>
             </div>
          </div>
        ))}
      </div>

      <Dialog open={!!previewReport} onOpenChange={(open) => !open && setPreviewReport(null)}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto rounded-[2.5rem] border border-slate-800 bg-slate-950/95 p-6 shadow-2xl">
          <DialogHeader className="mb-3">
            <div className="flex items-center justify-between pr-8 flex-wrap gap-3">
              <DialogTitle className="text-white font-black uppercase tracking-tight text-lg">
                {previewReport ? `${previewReport.student?.firstName || ''} ${previewReport.student?.lastName || ''} • ${getReportCardSeriesLabel(previewReport)}` : 'Transcript Preview'}
              </DialogTitle>
              {previewReport && (
                <Button
                  onClick={() => handleHeadmasterSignOff(previewReport)}
                  disabled={signing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-xs px-5 h-10"
                >
                  {signing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
                  Sign &amp; Publish Now
                </Button>
              )}
            </div>
          </DialogHeader>
          {previewReport && (
            <div className="bg-slate-900/40 p-2 md:p-6 rounded-[2rem] flex justify-center overflow-auto">
              <div className="shadow-2xl rounded-2xl overflow-hidden bg-white scale-[0.8] sm:scale-[0.9] md:scale-100 origin-top">
                <ReportCardTemplate
                  data={{
                    ...previewReport,
                    logoUrl: previewReport.logoUrl || schoolSettings?.logoUrl || null,
                    headmasterSignatureUrl: previewReport.headmasterSignatureUrl || profile?.signatureUrl || schoolData?.headmasterSignatureUrl || null,
                  }}
                  classTeacherComment={previewReport.classTeacherComment || ''}
                  headmasterComment={previewReport.headmasterComment || ''}
                  caWeight={previewReport.caWeight ?? schoolSettings?.caWeight ?? 30}
                  examWeight={previewReport.examWeight ?? schoolSettings?.examWeight ?? 70}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
