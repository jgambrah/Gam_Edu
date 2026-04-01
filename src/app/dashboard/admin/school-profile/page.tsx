'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, Save, Loader2, Phone, Mail, Globe, 
  Upload, CheckCircle2, AlertCircle, GraduationCap,
  CalendarDays, CalendarIcon, ArrowRightCircle, PenTool, X
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export default function SchoolProfilePage() {
  const firestore = useFirestore();
  const { role } = useRole();
  const { schoolId, loading: isSchoolLoading } = useCurrentSchool();
  const { toast } = useToast();
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const schoolRef = useMemoFirebase(
    () => (firestore && schoolId ? doc(firestore, 'schools', schoolId) : null),
    [firestore, schoolId]
  );
  
  const { data: profile, isLoading } = useDoc(schoolRef);

  const [name, setName] = useState('');
  const [motto, setMotto] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [headmasterSignature, setHeadmasterSignature] = useState<string>('');

  const [caWeight, setCaWeight] = useState<number>(30);
  const [examWeight, setExamWeight] = useState<number>(70);
  
  const [termStartDate, setTermStartDate] = useState<Date | undefined>(undefined);
  const [termEndDate, setTermEndDate] = useState<Date | undefined>(undefined);
  const [nextTermDate, setNextTermDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (profile) {
        setName(profile.name || '');
        setMotto(profile.motto || '');
        setAddress(profile.address || '');
        setPhone(profile.phone || '');
        setEmail(profile.email || '');
        setWebsite(profile.website || '');
        setLogoUrl(profile.logoUrl || '');
        setHeadmasterSignature(profile.headmasterSignature || profile.headmasterSignatureUrl || '');
        setCaWeight(profile.caWeight ?? 30);
        setExamWeight(profile.examWeight ?? 70);
        
        // Handle both legacy Timestamps and new ISO strings
        if (profile.termStartDate) {
            setTermStartDate(typeof profile.termStartDate === 'string' ? parseISO(profile.termStartDate) : profile.termStartDate.toDate());
        }
        if (profile.termEndDate) {
            setTermEndDate(typeof profile.termEndDate === 'string' ? parseISO(profile.termEndDate) : profile.termEndDate.toDate());
        }
        if (profile.nextTermDate) {
            setNextTermDate(typeof profile.nextTermDate === 'string' ? parseISO(profile.nextTermDate) : profile.nextTermDate.toDate());
        }
    }
  }, [profile]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !schoolId) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({ variant: 'destructive', title: "File Too Large", description: "Logo must be smaller than 2MB." });
      return;
    }

    setIsUploadingLogo(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `schools/${schoolId}/assets/logo`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setLogoUrl(url);
      toast({ title: "Logo Uploaded", description: "Preview updated. Remember to save changes." });
    } catch (error: any) {
      console.error(`logo upload error:`, error);
      toast({ variant: 'destructive', title: "Upload Failed", description: "Could not save logo." });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
        toast({ variant: 'destructive', title: 'File too large', description: 'Signature image must be under 500KB.' });
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        setHeadmasterSignature(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !schoolId) return;

    if (caWeight + examWeight !== 100) {
        toast({ variant: 'destructive', title: "Weighting Error", description: "The sum of CA and Exam weights must equal 100%." });
        return;
    }

    setIsSaving(true);
    try {
        const brandingData = {
            name, motto, address, phone, email, website, logoUrl, 
            headmasterSignature,
            headmasterSignatureUrl: headmasterSignature,
            // STORE AS ISO STRINGS TO PREVENT TIMEZONE SHIFTS
            termStartDate: termStartDate ? format(termStartDate, 'yyyy-MM-dd') : null,
            termEndDate: termEndDate ? format(termEndDate, 'yyyy-MM-dd') : null,
            nextTermDate: nextTermDate ? format(nextTermDate, 'yyyy-MM-dd') : null,
            updatedAt: serverTimestamp()
        };

        await setDoc(doc(firestore, 'schools', schoolId), {
            ...brandingData,
            caWeight, examWeight,
        }, { merge: true });

        await setDoc(doc(firestore, 'schoolSettings', schoolId), {
            ...brandingData,
            caWeight,
            examWeight,
        }, { merge: true });
        
        toast({ title: "Settings Saved", description: "School profile updated successfully." });
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 pb-24">
        <Card className="border-t-4 border-t-blue-600 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Building2 className="text-blue-600"/> School Profile Settings
                </CardTitle>
                <CardDescription>Configure official school information for reports and receipts.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700">Official School Logo</Label>
                            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 transition-colors hover:bg-slate-50 h-full justify-center text-center">
                                <div className="relative h-32 w-32 border-4 border-white rounded-2xl overflow-hidden bg-white shadow-xl flex items-center justify-center shrink-0">
                                    {logoUrl ? <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain"/> : <Building2 className="h-12 w-12 text-slate-200" />}
                                </div>
                                <div>
                                    <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} disabled={isUploadingLogo} className="hidden"/>
                                    <Button type="button" variant="outline" onClick={() => document.getElementById('logo-upload')?.click()} disabled={isUploadingLogo} className="bg-white border-2 font-bold">
                                        {isUploadingLogo ? <Loader2 className="animate-spin h-4 w-4"/> : <Upload className="mr-2 h-4 w-4"/>} Logo
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700">Headmaster Signature (Global)</Label>
                            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 transition-colors hover:bg-slate-50 h-full justify-center text-center">
                                <div className="relative h-32 w-full border-4 border-white rounded-2xl overflow-hidden bg-white shadow-xl flex items-center justify-center shrink-0">
                                    {headmasterSignature ? (
                                        <div className="relative w-full h-full p-2">
                                            <img src={headmasterSignature} alt="Signature Preview" className="h-full w-full object-contain mix-blend-multiply" />
                                            <button type="button" className="absolute top-1 right-1 bg-red-50 text-white rounded-full p-1" onClick={() => setHeadmasterSignature('')}><X className="h-3 w-3"/></button>
                                        </div>
                                    ) : (
                                        <PenTool className="h-12 w-12 text-slate-200" />
                                    )}
                                </div>
                                <div>
                                    <input id="sig-upload" type="file" accept="image/png, image/jpeg" onChange={handleSignatureUpload} className="hidden" />
                                    <Button type="button" variant="outline" onClick={() => document.getElementById('sig-upload')?.click()} className="bg-white border-2 font-bold">
                                        <Upload className="mr-2 h-4 w-4"/> Signature
                                    </Button>
                                    <p className="text-[9px] text-slate-400 mt-2 font-black uppercase tracking-widest">PNG/JPG, Max 500KB. Base64 Optimized.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2"><Label>School Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sunnyside International School" required /></div>
                            <div className="space-y-2"><Label>Motto / Slogan</Label><Input value={motto} onChange={e => setMotto(e.target.value)} placeholder="e.g. Excellence & Integrity" /></div>
                        </div>
                        <div className="space-y-2"><Label>Physical Address</Label><Textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 123 Education Street, Accra, Ghana" rows={3} /></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2"><Label className="flex items-center gap-2"><Phone className="h-3 w-3"/> Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+233..." /></div>
                            <div className="space-y-2"><Label className="flex items-center gap-2"><Mail className="h-3 w-3"/> Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@school.com" /></div>
                            <div className="space-y-2"><Label className="flex items-center gap-2"><Globe className="h-3 w-3"/> Website</Label><Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="www.school.com" /></div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                        <div className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-indigo-600"/><h3 className="text-lg font-bold text-slate-800">Current Academic Term</h3></div>
                        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700 text-xs uppercase">Term Start</Label>
                                    <Popover>
                                        <PopoverTrigger asChild><Button variant="outline" className="w-full text-left font-normal bg-white h-12 border-2 rounded-xl">{termStartDate ? format(termStartDate, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={termStartDate} onSelect={setTermStartDate} initialFocus /></PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700 text-xs uppercase">Term End</Label>
                                    <Popover>
                                        <PopoverTrigger asChild><Button variant="outline" className="w-full text-left font-normal bg-white h-12 border-2 rounded-xl">{termEndDate ? format(termEndDate, "PPP") : <span>Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={termEndDate} onSelect={setTermEndDate} initialFocus /></PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-indigo-700 text-xs uppercase flex items-center gap-1"><ArrowRightCircle className="h-3 w-3" /> Next Term Begins</Label>
                                    <Popover>
                                        <PopoverTrigger asChild><Button variant="outline" className="w-full text-left font-bold bg-white h-12 border-4 border-indigo-100 rounded-xl text-indigo-600">{nextTermDate ? format(nextTermDate, "PPP") : <span>To Be Announced</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={nextTermDate} onSelect={setNextTermDate} initialFocus /></PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                        <div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-indigo-600"/><h3 className="text-lg font-bold text-slate-800">Academic Weighting</h3></div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2"><div className="flex justify-between"><Label className="font-bold">CA Weight (%)</Label><span className="text-indigo-600 font-black">{caWeight}%</span></div><Input type="number" value={caWeight} onChange={e => { const val = parseInt(e.target.value) || 0; setCaWeight(val); setExamWeight(100 - val); }} min={0} max={100} className="h-12 border-2"/></div>
                                <div className="space-y-2"><div className="flex justify-between"><Label className="font-bold">Exam Weight (%)</Label><span className="text-indigo-600 font-black">{examWeight}%</span></div><Input type="number" value={examWeight} onChange={e => { const val = parseInt(e.target.value) || 0; setExamWeight(val); setCaWeight(100 - val); }} min={0} max={100} className="h-12 border-2"/></div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                        <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 w-[200px] h-12 text-lg font-bold">
                            {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>} Save Profile
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}