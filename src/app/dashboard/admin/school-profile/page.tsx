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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Building2, Save, Loader2, Phone, Mail, Globe, 
  Upload, CheckCircle2, AlertCircle, GraduationCap,
  CalendarDays, CalendarIcon, ArrowRightCircle, PenTool, X,
  Facebook, Instagram, Linkedin, Shield, Palette, Lock, Eraser
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export default function SchoolProfilePage() {
  const firestore = useFirestore();
  const { role, profile: userProfile } = useRole();
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
  const [brandColor, setBrandColor] = useState('#2563eb');
  const [secondaryColor, setSecondaryColor] = useState('');
  const [headmasterSignature, setHeadmasterSignature] = useState<string>('');
  const [allowAdminFinanceAccess, setAllowAdminFinanceAccess] = useState(true);
  const [allowAdminBillingToggles, setAllowAdminBillingToggles] = useState(false);
  
  // Social Links
  const [facebookUrl, setFacebookUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

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
        setBrandColor(profile.brandColor || '#2563eb');
        setSecondaryColor(profile.secondaryColor || '');
        setHeadmasterSignature(profile.headmasterSignature || profile.headmasterSignatureUrl || '');
        setFacebookUrl(profile.facebookUrl || '');
        setInstagramUrl(profile.instagramUrl || '');
        setLinkedinUrl(profile.linkedinUrl || '');
        setCaWeight(profile.caWeight ?? 30);
        setExamWeight(profile.examWeight ?? 70);
        setAllowAdminFinanceAccess(profile.allowAdminFinanceAccess !== false);
        setAllowAdminBillingToggles(profile.allowAdminBillingToggles === true);
        
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
            name, motto, address, phone, email, website, logoUrl, brandColor,
            secondaryColor,
            headmasterSignature,
            headmasterSignatureUrl: headmasterSignature,
            facebookUrl,
            instagramUrl,
            linkedinUrl,
            termStartDate: termStartDate ? format(termStartDate, 'yyyy-MM-dd') : null,
            termEndDate: termEndDate ? format(termEndDate, 'yyyy-MM-dd') : null,
            nextTermDate: nextTermDate ? format(nextTermDate, 'yyyy-MM-dd') : null,
            allowAdminFinanceAccess,
            allowAdminBillingToggles,
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

  const isDirector = role === 'Director' || role === 'Administrator';
  const isCEO = userProfile?.email === 'jamesgambrah@gmail.com';

  if (!isDirector && !isCEO) {
      return <div className="p-8 text-center text-red-500">Access Denied. Only Directors can manage school profile.</div>;
  }

  if (isLoading || isSchoolLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600 h-8 w-8"/></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 pb-24 text-black">
        <Card className="border-t-4 border-t-blue-600 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-tight">
                    <Building2 className="text-blue-600"/> School Profile Settings
                </CardTitle>
                <CardDescription className="font-medium">Configure official school information for reports and receipts.</CardDescription>
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
                                    <Button type="button" variant="outline" onClick={() => document.getElementById('logo-upload')?.click()} disabled={isUploadingLogo} className="bg-white border-2 font-bold rounded-xl h-10 px-6">
                                        {isUploadingLogo ? <Loader2 className="animate-spin h-4 w-4"/> : <Upload className="mr-2 h-4 w-4"/>} Upload Logo
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700">Instituional Branding</Label>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-slate-500">Primary Color</Label>
                                        <div className="flex gap-2 items-center">
                                            <input 
                                                type="color" 
                                                value={brandColor} 
                                                onChange={e => setBrandColor(e.target.value)} 
                                                className="h-12 w-12 rounded-xl cursor-pointer border-4 border-white shadow-sm p-0 overflow-hidden" 
                                            />
                                            <Input value={brandColor} onChange={e => setBrandColor(e.target.value)} className="font-mono font-bold uppercase border-2 h-12" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-slate-500">Secondary Color</Label>
                                        <div className="flex gap-2 items-center">
                                            <input 
                                                type="color" 
                                                value={secondaryColor || '#ffffff'} 
                                                onChange={e => setSecondaryColor(e.target.value)} 
                                                className="h-12 w-12 rounded-xl cursor-pointer border-4 border-white shadow-sm p-0 overflow-hidden" 
                                            />
                                            <Input value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} placeholder="None" className="font-mono font-bold uppercase border-2 h-12" />
                                            <Button type="button" variant="ghost" size="icon" onClick={() => setSecondaryColor('')} className="h-12 w-12 border-2 text-slate-400 hover:text-red-500"><Eraser className="h-4 w-4"/></Button>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-500 font-bold uppercase leading-tight">Primary: Backgrounds/Titles. Secondary: Table borders/Accents.</p>

                                <div className="space-y-2">
                                    <Label className="font-bold">Digital Signature (Headmaster)</Label>
                                    <div className="relative h-20 w-full border-2 border-dashed rounded-xl bg-white flex items-center justify-center overflow-hidden">
                                        {headmasterSignature ? (
                                            <>
                                                <img src={headmasterSignature} alt="Signature Preview" className="h-full w-auto object-contain mix-blend-multiply" />
                                                <button type="button" className="absolute top-1 right-1 bg-red-50 text-red-500 rounded-full p-1" onClick={() => setHeadmasterSignature('')}><X className="h-3 w-3"/></button>
                                            </>
                                        ) : (
                                            <PenTool className="h-8 w-8 text-slate-200" />
                                        )}
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <input id="sig-upload" type="file" accept="image/png, image/jpeg" onChange={handleSignatureUpload} className="hidden" />
                                        <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('sig-upload')?.click()} className="text-xs h-8 border-2 font-bold w-full">
                                            <Upload className="mr-1 h-3 w-3"/> Upload Signature
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2"><Label className="font-bold">School Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sunnyside International School" className="h-12 border-2 rounded-xl" required /></div>
                            <div className="space-y-2"><Label className="font-bold">Motto / Slogan</Label><Input value={motto} onChange={e => setMotto(e.target.value)} placeholder="e.g. Excellence & Integrity" className="h-12 border-2 rounded-xl" /></div>
                        </div>
                        <div className="space-y-2"><Label className="font-bold">Physical Address</Label><Textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 123 Education Street, Accra, Ghana" rows={3} className="border-2 rounded-xl" /></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2"><Label className="flex items-center gap-2 font-bold"><Phone className="h-3 w-3"/> Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+233..." className="h-11 border-2 rounded-xl" /></div>
                            <div className="space-y-2"><Label className="flex items-center gap-2 font-bold"><Mail className="h-3 w-3"/> Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@school.com" className="h-11 border-2 rounded-xl" /></div>
                            <div className="space-y-2"><Label className="flex items-center gap-2 font-bold"><Globe className="h-3 w-3"/> Website</Label><Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="www.school.com" className="h-11 border-2 rounded-xl" /></div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                        <div className="flex items-center gap-2"><Globe className="h-5 w-5 text-indigo-600"/><h3 className="text-lg font-black text-slate-800 uppercase tracking-tight italic">Social Media Links</h3></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2"><Label className="flex items-center gap-2 text-blue-600 font-bold"><Facebook className="h-3 w-3"/> Facebook</Label><Input value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} placeholder="https://..." className="h-11 border-2 rounded-xl" /></div>
                            <div className="space-y-2"><Label className="flex items-center gap-2 text-pink-600 font-bold"><Instagram className="h-3 w-3"/> Instagram</Label><Input value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} placeholder="https://..." className="h-11 border-2 rounded-xl" /></div>
                            <div className="space-y-2"><Label className="flex items-center gap-2 text-blue-800 font-bold"><Linkedin className="h-3 w-3"/> LinkedIn</Label><Input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://..." className="h-11 border-2 rounded-xl" /></div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                        <div className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-indigo-600"/><h3 className="text-lg font-black text-slate-800 uppercase tracking-tight italic">Current Academic Term</h3></div>
                        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 shadow-inner">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">Term Start</Label>
                                    <Popover>
                                        <PopoverTrigger asChild><Button variant="outline" className="w-full text-left font-bold bg-white h-12 border-2 rounded-xl">{termStartDate ? format(termStartDate, "PPP") : <span className="opacity-40">Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-indigo-600" /></Button></PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={termStartDate} onSelect={setTermStartDate} initialFocus /></PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-black text-slate-700 text-[10px] uppercase tracking-widest">Term End</Label>
                                    <Popover>
                                        <PopoverTrigger asChild><Button variant="outline" className="w-full text-left font-bold bg-white h-12 border-2 rounded-xl">{termEndDate ? format(termEndDate, "PPP") : <span className="opacity-40">Pick date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-indigo-600" /></Button></PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={termEndDate} onSelect={setTermEndDate} initialFocus /></PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-black text-indigo-700 text-[10px] uppercase tracking-widest flex items-center gap-1"><ArrowRightCircle className="h-3 w-3" /> Next Term Begins</Label>
                                    <Popover>
                                        <PopoverTrigger asChild><Button variant="outline" className="w-full text-left font-black bg-white h-12 border-4 border-indigo-100 rounded-xl text-indigo-600">{nextTermDate ? format(nextTermDate, "PPP") : <span>To Be Announced</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={nextTermDate} onSelect={setNextTermDate} initialFocus /></PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                        <div className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-indigo-600"/><h3 className="text-lg font-black text-slate-800 uppercase tracking-tight italic">Academic & Security Settings</h3></div>
                        <div className="bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-200 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2"><div className="flex justify-between"><Label className="font-black text-xs uppercase tracking-widest text-slate-500">CA Weight (%)</Label><span className="text-indigo-600 font-black">{caWeight}%</span></div><Input type="number" value={caWeight} onChange={e => { const val = parseInt(e.target.value) || 0; setCaWeight(val); setExamWeight(100 - val); }} min={0} max={100} className="h-12 border-2 rounded-xl font-bold"/></div>
                                <div className="space-y-2"><div className="flex justify-between"><Label className="font-black text-xs uppercase tracking-widest text-slate-500">Exam Weight (%)</Label><span className="text-indigo-600 font-black">{examWeight}%</span></div><Input type="number" value={examWeight} onChange={e => { const val = parseInt(e.target.value) || 0; setExamWeight(val); setCaWeight(100 - val); }} min={0} max={100} className="h-12 border-2 rounded-xl font-bold"/></div>
                            </div>

                            <div className="flex flex-row items-center justify-between rounded-2xl border-2 border-indigo-100 p-6 bg-white shadow-sm">
                                <div className="space-y-1 pr-4">
                                    <Label className="text-base font-black text-slate-800 flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-indigo-600"/>
                                        Administrator Finance Access
                                    </Label>
                                    <p className="text-xs font-medium text-slate-500 max-w-md">Allow staff with the 'Administrator' role to view and manage financial records, bills, and tills.</p>
                                </div>
                                <Checkbox 
                                    checked={allowAdminFinanceAccess} 
                                    onCheckedChange={(checked) => setAllowAdminFinanceAccess(!!checked)} 
                                    disabled={role !== 'Director' && !isCEO}
                                    className="h-7 w-7 rounded-lg border-2"
                                />
                            </div>

                            <div className="flex flex-row items-center justify-between rounded-2xl border-2 border-orange-100 p-6 bg-white shadow-sm">
                                <div className="space-y-1 pr-4">
                                    <Label className="text-base font-black text-slate-800 flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-orange-600"/>
                                        Administrator Billing Toggles
                                    </Label>
                                    <p className="text-xs font-medium text-slate-500 max-w-md">Allow Administrators to turn Canteen and Transport billing ON/OFF for students.</p>
                                </div>
                                <Checkbox 
                                    checked={allowAdminBillingToggles} 
                                    onCheckedChange={(checked) => setAllowAdminBillingToggles(!!checked)} 
                                    disabled={role !== 'Director' && !isCEO}
                                    className="h-7 w-7 rounded-lg border-2"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t flex justify-end">
                        <Button type="submit" disabled={isSaving} className="bg-slate-900 hover:bg-black text-white w-full sm:w-[220px] h-14 text-lg font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-200 transition-all active:scale-95">
                            {isSaving ? <Loader2 className="animate-spin mr-2 h-5 w-5"/> : <Save className="mr-2 h-5 w-5"/>} Save Settings
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
