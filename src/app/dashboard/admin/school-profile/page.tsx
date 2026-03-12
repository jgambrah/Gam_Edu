
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Save, Loader2, Globe, Phone, Mail, GraduationCap, AlertCircle, Upload, CheckCircle2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function SchoolProfilePage() {
  const firestore = useFirestore();
  const { role } = useRole();
  const { schoolId, loading: isSchoolLoading } = useCurrentSchool();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Fetch from the specific School Document
  const schoolRef = useMemoFirebase(
    () => (firestore && schoolId ? doc(firestore, 'schools', schoolId) : null),
    [firestore, schoolId]
  );
  
  const { data: profile, isLoading } = useDoc(schoolRef);

  // Form State
  const [name, setName] = useState('');
  const [motto, setMotto] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Academic Settings State
  const [caWeight, setCaWeight] = useState<number>(30);
  const [examWeight, setExamWeight] = useState<number>(70);

  // Load data when fetched
  useEffect(() => {
    if (profile) {
        setName(profile.name || '');
        setMotto(profile.motto || '');
        setAddress(profile.address || '');
        setPhone(profile.phone || '');
        setEmail(profile.email || '');
        setWebsite(profile.website || '');
        setLogoUrl(profile.logoUrl || '');
        setCaWeight(profile.caWeight ?? 30);
        setExamWeight(profile.examWeight ?? 70);
    }
  }, [profile]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !schoolId) return;

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        variant: 'destructive',
        title: "File Too Large",
        description: "Please select an image smaller than 2MB."
      });
      return;
    }

    setIsUploadingLogo(true);
    try {
      const storage = getStorage();
      const logoRef = ref(storage, `schools/${schoolId}/branding/logo`);
      const snapshot = await uploadBytes(logoRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      setLogoUrl(url);
      toast({ 
        title: "Logo Uploaded Successfully", 
        description: "The preview has been updated. Remember to save all changes below." 
      });
    } catch (error: any) {
      console.error("Logo upload error:", error);
      toast({ 
        variant: 'destructive', 
        title: "Upload Failed", 
        description: "Could not save logo. Please try again." 
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !schoolId) return;

    // Validation: Weights must sum to 100
    if (caWeight + examWeight !== 100) {
        toast({ 
            variant: 'destructive', 
            title: "Weighting Error", 
            description: "The sum of CA and Exam weights must equal 100%." 
        });
        return;
    }

    setIsSaving(true);
    try {
        await setDoc(doc(firestore, 'schools', schoolId), {
            name, motto, address, phone, email, website, logoUrl,
            caWeight, examWeight,
            updatedAt: serverTimestamp()
        }, { merge: true });
        
        toast({ title: "Settings Saved", description: "School profile and academic settings updated." });
    } catch (error: any) {
        console.error(error);
        toast({ variant: 'destructive', title: "Error", description: "Could not save profile." });
    } finally {
        setIsSaving(false);
    }
  };

  const canManage = ['Administrator', 'Director'].includes(role || '');

  if (!canManage) {
      return <div className="p-8 text-center text-red-500">Access Denied. Only Directors can manage school profile.</div>;
  }

  if (isLoading || isSchoolLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600 h-8 w-8"/></div>;

  if (!schoolId) return <div className="p-8 text-center text-orange-500">No School Linked to this account.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="border-t-4 border-t-blue-600 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Building2 className="text-blue-600"/> School Profile Settings
                </CardTitle>
                <CardDescription>
                    These details will appear on Report Cards, Receipts, and Official Documents.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-8">
                    
                    <div className="space-y-6">
                        {/* LOGO UPLOAD SECTION */}
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700">Official School Logo</Label>
                            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 transition-colors hover:bg-slate-50">
                                <div className="relative group">
                                    <div className="h-32 w-32 border-4 border-white rounded-2xl overflow-hidden bg-white shadow-xl flex items-center justify-center shrink-0">
                                        {logoUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img 
                                                key={logoUrl} // Force re-render when URL changes
                                                src={logoUrl} 
                                                alt="" 
                                                className="max-h-full max-w-full object-contain"
                                                onError={(e) => {
                                                    // Fallback if image fails to load
                                                    (e.target as any).src = "https://placehold.co/200x200?text=Error+Loading";
                                                }}
                                            />
                                        ) : (
                                            <Building2 className="h-12 w-12 text-slate-200" />
                                        )}
                                    </div>
                                    {logoUrl && (
                                        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 shadow-lg border-2 border-white">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-3 text-center sm:text-left">
                                    <div>
                                        <h4 className="font-bold text-slate-800">Upload Branding</h4>
                                        <p className="text-xs text-slate-500">Logo will be used on all automated receipts and reports.</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Input 
                                            id="logo-upload" 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleLogoUpload}
                                            disabled={isUploadingLogo}
                                            className="hidden"
                                        />
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => document.getElementById('logo-upload')?.click()}
                                            disabled={isUploadingLogo}
                                            className="w-full sm:w-fit bg-white border-2 hover:border-blue-400 hover:bg-blue-50 transition-all font-bold"
                                        >
                                            {isUploadingLogo ? (
                                                <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Processing...</>
                                            ) : (
                                                <><Upload className="mr-2 h-4 w-4"/> Select New Logo</>
                                            )}
                                        </Button>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Recommended: Square PNG, max 2MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>School Name</Label>
                                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sunnyside International School" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Motto / Slogan</Label>
                                <Input value={motto} onChange={e => setMotto(e.target.value)} placeholder="e.g. Excellence & Integrity" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Physical Address / Location</Label>
                            <Textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 123 Education Street, Accra, Ghana" rows={3} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Phone className="h-3 w-3"/> Contact Phone</Label>
                                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+233..." />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Mail className="h-3 w-3"/> Official Email</Label>
                                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@school.com" />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Globe className="h-3 w-3"/> Website URL</Label>
                                <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="www.school.com" />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* ACADEMIC SETTINGS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-indigo-600"/>
                            <h3 className="text-lg font-bold text-slate-800">Academic & Grading Settings</h3>
                        </div>
                        
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="h-4 w-4 text-amber-600"/>
                                <p className="text-sm font-medium text-slate-600">Define the weighting ratio for Terminal Reports (e.g., 30% CA / 70% Exam).</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label className="font-bold">Continuous Assessment (CA) %</Label>
                                        <span className="text-indigo-600 font-black">{caWeight}%</span>
                                    </div>
                                    <Input 
                                        type="number" 
                                        value={caWeight} 
                                        onChange={e => {
                                            const val = parseInt(e.target.value) || 0;
                                            setCaWeight(val);
                                            setExamWeight(100 - val);
                                        }}
                                        min={0}
                                        max={100}
                                        className="h-12 border-2"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label className="font-bold">End of Term Exam %</Label>
                                        <span className="text-indigo-600 font-black">{examWeight}%</span>
                                    </div>
                                    <Input 
                                        type="number" 
                                        value={examWeight} 
                                        onChange={e => {
                                            const val = parseInt(e.target.value) || 0;
                                            setExamWeight(val);
                                            setCaWeight(100 - val);
                                        }}
                                        min={0}
                                        max={100}
                                        className="h-12 border-2"
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-6 flex items-center justify-center p-3 rounded-xl bg-white border-2 border-indigo-100">
                                <p className="text-sm font-bold text-slate-700">
                                    Report Total: <span className={cn(caWeight + examWeight === 100 ? "text-green-600" : "text-red-600")}>
                                        {caWeight + examWeight}%
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                        <Button type="submit" disabled={isSaving || isUploadingLogo || (caWeight + examWeight !== 100)} className="bg-blue-600 hover:bg-blue-700 w-[200px] h-12 text-lg font-bold shadow-lg shadow-blue-600/20">
                            {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
                            Save All Settings
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
