'use client';
import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Camera, Upload, Trash2, CheckCircle2, Loader2, User, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/context/role-context';

export default function ProfilePhotoManager() {
  const { user } = useUser();
  const { profile, role, refreshRole } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile?.photoURL) {
      setPhotoURL(profile.photoURL);
    }
  }, [profile]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid || !firestore) return;

    if (file.size > 1024 * 1024) {
      toast({ variant: 'destructive', title: "File Too Large", description: "Image must be smaller than 1MB." });
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result as string;
        
        // Save to appropriate collection
        const collectionName = role === 'Student' ? 'students' : (role === 'Parent' ? 'parents' : 'staff');
        
        await updateDoc(doc(firestore, collectionName, user.uid), {
          photoURL: base64String,
          updatedAt: serverTimestamp()
        });
        
        setPhotoURL(base64String);
        refreshRole();
        toast({ title: "Profile Picture Updated", description: "This will be used for AI identity verification during clock-in." });
      } catch (e: any) {
        toast({ variant: 'destructive', title: "Upload Failed", description: e.message });
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = async () => {
    if (!user?.uid || !firestore) return;
    try {
      const collectionName = role === 'Student' ? 'students' : (role === 'Parent' ? 'parents' : 'staff');
      await updateDoc(doc(firestore, collectionName, user.uid), {
        photoURL: null
      });
      setPhotoURL(null);
      refreshRole();
      toast({ title: "Profile Picture Removed" });
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Error", description: e.message });
    }
  };

  return (
    <div className="bg-white p-8 rounded-[40px] border-4 border-slate-900 shadow-xl space-y-6">
      <div className="flex items-center gap-3 border-b pb-4">
        <div className="bg-emerald-600 p-2 rounded-xl text-white">
          <Camera size={20} />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tighter">Identity <span className="text-emerald-600">Verification</span></h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official Portrait for Security</p>
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center min-h-[200px]">
        {photoURL ? (
          <div className="space-y-4 text-center">
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
               <img src={photoURL} alt="Profile" className="h-full w-full object-cover" />
            </div>
            <div className="flex justify-center gap-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1 border border-green-200">
                <ShieldCheck size={12}/> AI Ready
              </span>
              <button onClick={removePhoto} className="text-red-400 hover:text-red-600 transition-colors p-1">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center space-y-3 w-full text-center">
             {uploading ? (
               <Loader2 size={40} className="animate-spin text-emerald-600" />
             ) : (
               <>
                <User size={40} className="text-slate-300 hover:text-emerald-600 transition-colors" />
                <div className="text-center">
                   <p className="text-xs font-black uppercase text-black">Upload Official Portrait</p>
                   <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Clear facial photo required (Max 1MB)</p>
                </div>
               </>
             )}
             <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
        )}
      </div>

      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
         <p className="text-[9px] font-medium text-emerald-800 leading-relaxed uppercase italic">
            "Your profile picture is used by the AI to verify your identity every time you clock in. Ensure your face is clearly visible and well-lit."
         </p>
      </div>
    </div>
  );
}
