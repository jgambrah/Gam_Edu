'use client';
import { useState, useEffect } from 'react';
import { useUser, useFirestore, useFirebaseApp } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { PenTool, UploadCloud, Trash2, CheckCircle2, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';

export default function SignatureManager() {
  const { user } = useUser();
  const { profile, role, refreshRole } = useRole();
  const firestore = useFirestore();
  const app = useFirebaseApp();
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();

  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // High-Grade Confirmation State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (profile?.signatureBase64 || profile?.signatureUrl) {
        setSignatureUrl(profile.signatureBase64 || profile.signatureUrl);
    }
  }, [profile]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid || !schoolId || !firestore || !app) return;

    if (file.size > 1024 * 1024) {
        toast({ variant: 'destructive', title: "File Too Large", description: "Signature must be smaller than 1MB." });
        return;
    }

    setUploading(true);
    
    // STEP 3: Ensure Teachers save as Base64 for Solid PDF Rendering
    const reader = new FileReader();
    reader.onloadend = async () => {
        try {
            const base64String = reader.result as string;
            
            // Backup to Storage for permanent URL access
            const storage = getStorage(app);
            const storageRef = ref(storage, `signatures/${schoolId}/${user.uid}/signature.png`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            const collectionName = role === 'Student' ? 'students' : (role === 'Parent' ? 'parents' : 'staff');
            
            await updateDoc(doc(firestore, collectionName, user.uid), {
                signatureUrl: downloadURL,
                signatureBase64: base64String, // The "Solid" field for PDFs
                updatedAt: serverTimestamp()
            });

            setSignatureUrl(base64String);
            refreshRole();
            toast({ 
                title: "Electronic Signature Locked", 
                description: "Your signature is now ready for digital signing." 
            });
        } catch (e: any) {
            toast({ variant: 'destructive', title: "Upload Failed", description: e.message });
        } finally {
            setUploading(false);
        }
    };
    reader.readAsDataURL(file);
  };

  const removeSignature = async () => {
    if (!user?.uid || !schoolId || !firestore || !app) return;

    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `signatures/${schoolId}/${user.uid}/signature.png`);
      await deleteObject(storageRef).catch(() => {});

      const collectionName = role === 'Student' ? 'students' : (role === 'Parent' ? 'parents' : 'staff');
      await updateDoc(doc(firestore, collectionName, user.uid), {
        signatureUrl: null,
        signatureBase64: null
      });

      setSignatureUrl(null);
      refreshRole();
      toast({ title: "Signature Revoked", variant: "default" });
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Error", description: e.message });
    } finally {
      setIsConfirmOpen(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[40px] border-4 border-slate-900 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="bg-blue-600 p-2 rounded-xl text-white">
          <PenTool size={20} />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Digital <span className="text-blue-600">Autograph</span></h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authentication for Reports & Vouchers</p>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center min-h-[200px]">
        {signatureUrl ? (
          <div className="space-y-4 text-center">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
               <img src={signatureUrl} alt="E-Signature" className="h-24 w-auto mx-auto mix-blend-multiply" />
            </div>
            <div className="flex justify-center gap-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1 border border-green-200">
                <ShieldCheck size={12}/> Verified Active
              </span>
              <button onClick={() => setIsConfirmOpen(true)} className="text-red-400 hover:text-red-600 transition-colors p-1">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center space-y-3 w-full">
             {uploading ? (
               <Loader2 size={40} className="animate-spin text-blue-600" />
             ) : (
               <>
                <UploadCloud size={40} className="text-slate-300 hover:text-blue-600 transition-colors" />
                <div className="text-center">
                   <p className="text-xs font-black uppercase text-black">Upload Scanned Signature</p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Recommended: Transparent PNG (Max 1MB)</p>
                </div>
               </>
             )}
             <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
        )}
      </div>

      <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
         <p className="text-[9px] font-medium text-blue-800 leading-relaxed uppercase italic">
            "Your digital signature is cryptographically linked to your UID. Any document you sign will carry this autograph and a secure digital fingerprint for audit verification."
         </p>
      </div>

      {/* --- TITAN-GRADE CONFIRMATION MODAL --- */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border-4 border-slate-900 space-y-6 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-600 border-2 border-red-100">
              <AlertTriangle size={40} className="animate-pulse" />
            </div>
            
            <div>
              <h2 className="text-2xl font-black uppercase italic text-black">Revoke <span className="text-red-600">Signature</span></h2>
              <p className="text-xs font-bold text-slate-400 uppercase mt-2 leading-relaxed">
                Are you sure? You will not be able to sign reports until you upload a new autograph.
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 py-4 font-black text-slate-400 uppercase text-xs tracking-widest hover:text-black transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={removeSignature}
                className="flex-[2] bg-red-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-red-100 hover:bg-black transition-all"
              >
                Yes, Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}