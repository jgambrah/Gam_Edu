'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PenTool, Upload, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function MyProfilePage() {
  const { user } = useUser();
  const { profile, role, refreshRole } = useRole();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();

  const [isUploading, setIsUploading] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState('');

  useEffect(() => {
    if (profile?.signatureUrl) {
      setSignatureUrl(profile.signatureUrl);
    }
  }, [profile]);

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !schoolId || !firestore) return;

    if (file.size > 1024 * 1024) {
        toast({ variant: 'destructive', title: "File Too Large", description: "Signature must be smaller than 1MB." });
        return;
    }

    setIsUploading(true);
    try {
      const storage = getStorage();
      const sigRef = ref(storage, `signatures/${schoolId}/${user.uid}/signature.png`);
      await uploadBytes(sigRef, file);
      const url = await getDownloadURL(sigRef);

      const collectionName = role === 'Student' ? 'students' : (role === 'Parent' ? 'parents' : 'staff');
      await updateDoc(doc(firestore, collectionName, user.uid), {
        signatureUrl: url,
        updatedAt: serverTimestamp()
      });

      setSignatureUrl(url);
      refreshRole();
      toast({ title: "Signature Locked", description: "Your digital signature has been securely stored." });
    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: "Upload Failed", description: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">
          Personal <span className="text-blue-600">Verification</span>
        </h1>
        <p className="text-slate-500 font-bold text-xs uppercase italic">Manage your secure identity and digital signature.</p>
      </div>

      <Card className="border-t-8 border-t-blue-600 rounded-[40px] shadow-2xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50 border-b-4 border-slate-100 p-10">
          <CardTitle className="text-2xl font-black uppercase">Electronic Signature</CardTitle>
          <CardDescription className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Used for authenticating official reports and documents.</CardDescription>
        </CardHeader>
        <CardContent className="p-10 space-y-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 space-y-6">
              <div className="bg-blue-50 p-6 rounded-[32px] border-4 border-dashed border-blue-200 text-center">
                <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-4">Current Signature</p>
                <div className="h-32 bg-white rounded-2xl flex items-center justify-center border-2 border-slate-100 shadow-inner overflow-hidden">
                  {signatureUrl ? (
                    <img src={signatureUrl} alt="Signature" className="max-h-full object-contain" />
                  ) : (
                    <div className="text-slate-300 flex flex-col items-center gap-2">
                      <PenTool className="h-8 w-8 opacity-20" />
                      <span className="text-xs font-bold uppercase tracking-tighter">No signature on file</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 space-y-6">
              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-2">Upload New Signature</Label>
                <div className="flex flex-col gap-4">
                  <Input 
                    type="file" 
                    accept="image/png" 
                    onChange={handleSignatureUpload} 
                    disabled={isUploading}
                    className="h-14 rounded-2xl border-4 border-slate-100 bg-slate-50 font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 font-bold leading-relaxed px-2">
                    Requirements: Transparent PNG, maximum 1MB. This signature will be applied to all reports you verify.
                  </p>
                </div>
              </div>
              
              {signatureUrl && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-2xl border-2 border-green-100">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-xs font-black uppercase tracking-tight">Identity Verified & Locked</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
