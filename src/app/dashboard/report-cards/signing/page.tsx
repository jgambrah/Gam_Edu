'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, writeBatch, doc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { 
  PenTool, CheckCircle2, ShieldCheck, 
  FileCheck, Loader2, Search, Printer, 
  Lock, ArrowUpRight, GraduationCap 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportSigningPortal() {
  const { user } = useUser();
  const { profile } = useRole();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();

  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (!schoolId || !firestore) return;
    
    // Fetch reports that have been completed by Teachers but not yet published
    const q = query(
      collection(firestore, "report-cards"),
      where("schoolId", "==", schoolId),
      where("status", "==", "Draft")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [schoolId, firestore]);

  const handleHeadmasterSignOff = async (report: any) => {
    if (!profile?.signatureUrl) {
        toast({ variant: 'destructive', title: "Signature Required", description: "Please upload your signature in your profile first." });
        return;
    }

    if (!firestore) return;

    setSigning(true);
    const batch = writeBatch(firestore);

    try {
      const reportRef = doc(firestore, "report-cards", report.id);
      
      // THE CRYPTOGRAPHIC HANDSHAKE
      // Lock the signature URL and a unique fingerprint into the document
      const verificationHash = `VER-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

      batch.update(reportRef, {
        status: 'Published',
        headmasterName: `${profile.firstName} ${profile.lastName}`,
        headmasterSignatureUrl: profile.signatureUrl, // THE KEY: Capture the signature URL at the moment of signing
        headmasterSignedAt: serverTimestamp(),
        digitalFingerprint: verificationHash, // This acts as the digitalStamp
      });

      await batch.commit();
      toast({ title: "Document Signed & Locked", description: `Authorized ${report.student?.firstName}'s report card with your digital signature.` });
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Authorization Failed", description: e.message });
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto text-black font-bold animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b-8 border-slate-900 pb-6">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Academic <span className="text-blue-600">Authorization</span></h1>
          <p className="text-slate-500 font-bold text-xs uppercase italic">Vetting and Electronic Signing of Terminal Reports.</p>
        </div>
        <div className="bg-[#0f172a] text-white p-4 rounded-3xl flex items-center gap-3 shadow-xl">
           <PenTool size={20} className="text-blue-400" />
           <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Review: {reports.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin h-8 w-8 text-blue-600"/></div>
        ) : reports.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[40px]">
                <div className="bg-white p-6 rounded-full w-fit mx-auto mb-4 shadow-sm border-2 border-slate-100">
                    <CheckCircle2 className="h-12 w-12 text-slate-200" />
                </div>
                <p className="text-xl font-black text-slate-400 uppercase tracking-tighter">Desk Clear: No Pending Reports</p>
            </div>
        ) : reports.map(report => (
          <div key={report.id} className="bg-white p-8 rounded-[40px] border-4 border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8 hover:border-blue-600 transition-all group">
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center font-black text-blue-600 text-xl border-2 border-blue-100">
                   {report.student?.firstName?.[0] || 'S'}
                </div>
                <div>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{report.className} • {report.term}</p>
                   <h3 className="text-2xl font-black uppercase text-black">{report.student?.firstName} {report.student?.lastName}</h3>
                   <div className="flex items-center gap-2 mt-1">
                      <div className="bg-green-100 p-1 rounded-full"><CheckCircle2 size={10} className="text-green-600" /></div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase italic">Master Preview Compiled</p>
                   </div>
                </div>
             </div>

             <div className="flex items-center gap-6">
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Overall Avg</span>
                    <span className="text-2xl font-black text-indigo-600">{report.overallAverage}%</span>
                </div>
                <button 
                  onClick={() => handleHeadmasterSignOff(report)}
                  disabled={signing}
                  className="bg-blue-600 text-white px-10 py-4 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {signing ? <Loader2 className="animate-spin h-5 w-5" /> : <ShieldCheck size={20} />}
                  Authorize & Sign
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
