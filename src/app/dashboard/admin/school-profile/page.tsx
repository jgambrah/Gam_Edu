'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
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
  Facebook, Instagram, Linkedin, Shield, Palette, Lock, Eraser,
  MessageSquare
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export default function SchoolProfilePage() {
  const firestore = useFirestore();
  const { user } = useAuth();
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
  const [autoLockDebtors, setAutoLockDebtors] = useState(false);
  const [autoLockStudents, setAutoLockStudents] = useState(false);
  const [debtorLockThreshold, setDebtorLockThreshold] = useState(0);

  // WhatsApp Automation States
  const [waInstanceId, setWaInstanceId] = useState('');
  const [waToken, setWaToken] = useState('');
  const [enableWhatsApp, setEnableWhatsApp] = useState(false);
  
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
        setAutoLockDebtors(profile.autoLockDebtors === true);
        setAutoLockStudents(profile.autoLockStudents === true);
        setDebtorLockThreshold(Number(profile.debtorLockThreshold) || 0);

        setWaInstanceId(profile.waInstanceId || '');
        setWaToken(profile.waToken || '');
        setEnableWhatsApp(profile.enableWhatsApp === true);
        
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

  // Only the School Director or the Platform CEO can manage school-wide settings
  const canManage = role === 'Director' || user?.email === 'jamesgambrah@gmail.com';

  if (!isSchoolLoading && !isLoading && !canManage) {
      return (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
              <p className="text-slate-600">Only the School Director can modify School Settings and Permissions.</p>
          </div>
      );
  }

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
            autoLockDebtors,
            autoLockStudents,
            debtorLockThreshold,
            waInstanceId,
            waToken,
            enableWhatsApp,
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
                            <Label className="text-sm font-bold text-slate-700">Institutional Branding</Label>
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

                        {/* --- WHATSAPP AUTOMATION SECTION --- */}
                        <div className="space-y-4 p-5 border-2 rounded-[2rem] bg-emerald-50/30 border-emerald-100 mt-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-black text-emerald-800 flex items-center gap-2 uppercase tracking-tight">
                                        <MessageSquare className="h-5 w-5 text-emerald-600"/> WhatsApp Automation (API)
                                    </Label>
                                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Connect your school to the WhatsApp network</p>
                                </div>
                                <Checkbox 
                                    checked={enableWhatsApp} 
                                    onCheckedChange={(c) => setEnableWhatsApp(!!c)} 
                                    className="h-7 w-7 rounded-lg border-2 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                                />
                            </div>
                            
                            {enableWhatsApp && (
                                <div className="grid md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 pt-2">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Instance ID</Label>
                                        <Input 
                                            value={waInstanceId} 
                                            onChange={e => setWaInstanceId(e.target.value)} 
                                            placeholder="e.g. instance8372" 
                                            className="border-2 bg-white rounded-xl h-11 font-mono text-xs" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">API Token</Label>
                                        <Input 
                                            type="password" 
                                            value={waToken} 
                                            onChange={e => setWaToken(e.target.value)} 
                                            placeholder="e.g. 1a2b3c4d5e..." 
                                            className="border-2 bg-white rounded-xl h-11 font-mono text-xs" 
                                        />
                                    </div>
                                    
                                    {/* --- CLICKABLE SETUP GUIDE --- */}
                                    <div className="col-span-2 md:col-span-2 bg-green-50 p-4 rounded-xl border border-green-200 mt-2">
                                        <h4 className="text-sm font-bold text-green-900 mb-2">How to connect your school's WhatsApp:</h4>
                                        <ol className="list-decimal pl-5 text-xs text-green-800 space-y-1 mb-3">
                                            <li>
                                                Go to <a href="https://ultramsg.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline inline-flex items-center">UltraMsg.com <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a> and create a free account.
                                            </li>
                                            <li>Copy your new <strong>Instance ID</strong> and <strong>Token</strong> and paste them in the boxes above.</li>
                                            <li>On the UltraMsg dashboard, scan the QR Code using your school's official WhatsApp phone to link the number.</li>
                                        </ol>
                                        <p className="text-[11px] text-green-700 italic">
                                            * No need to type your phone number here! Once you scan the QR code on UltraMsg, messages will automatically send from your school's phone.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                        <div className="flex items-center gap-2"><Globe className="h-5 w-5 text-indigo-600"/><h3 className="text-lg font-black text-slate-800 uppercase tracking-tight italic">Social Media Links</h3></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2"><Label className="flex items-center gap-2 text-blue-600"><Facebook className="h-3 w-3"/> Facebook</Label><Input value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} placeholder="https://..." className="h-11 border-2 rounded-xl" /></div>
                            <div className="space-y-2"><Label className="flex items-center gap-2 text-pink-600"><Instagram className="h-3 w-3"/> Instagram</Label><Input value={instagramUrl} onChange={e => setInstagramUrl(e.target.value)} placeholder="https://..." className="h-11 border-2 rounded-xl" /></div>
                            <div className="space-y-2"><Label className="flex items-center gap-2 text-blue-800"><Linkedin className="h-3 w-3"/> LinkedIn</Label><Input value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="https://..." className="h-11 border-2 rounded-xl" /></div>
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
                                    className="h-7 w-7 rounded-lg border-2"
                                />
                            </div>

                            {/* --- FINANCIAL ENFORCEMENT --- */}
                            <div className="flex flex-col rounded-2xl border-4 p-6 bg-red-50/50 border-red-100 shadow-sm space-y-6">
                                <div className="flex flex-row items-center justify-between">
                                    <div className="space-y-1 pr-4">
                                        <Label className="text-base font-black text-red-800 flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-red-600"/>
                                            Auto-Lock Debtors (Parent Portal)
                                        </Label>
                                        <p className="text-xs font-medium text-red-600/70 max-w-md">Restrict parent access to report cards and grades if they owe fees above a threshold.</p>
                                    </div>
                                    <Checkbox 
                                        checked={autoLockDebtors} 
                                        onCheckedChange={(checked) => setAutoLockDebtors(!!checked)} 
                                        className="h-7 w-7 rounded-lg border-2 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                                    />
                                </div>

                                <div className="flex flex-row items-center justify-between rounded-2xl border p-4 mt-2 bg-orange-50/50 border-orange-100">
                                    <div className="space-y-1 pr-4">
                                        <Label className="text-base font-black text-orange-800 flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-orange-600"/>
                                            Auto-Lock Students (Assignments & Reports)
                                        </Label>
                                        <p className="text-xs font-medium text-orange-600/70 max-w-md">Restrict student access to official assessments and report cards if their fees exceed the threshold. (Learning clubs remain open).</p>
                                    </div>
                                    <Checkbox 
                                        checked={autoLockStudents} 
                                        onCheckedChange={(checked) => setAutoLockStudents(!!checked)} 
                                        className="h-7 w-7 rounded-lg border-2 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600"
                                    />
                                </div>

                                {(autoLockDebtors || autoLockStudents) && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                                        <Label className="text-red-800 font-bold uppercase text-[10px] tracking-widest">Lock threshold amount PER CHILD (GH₵)</Label>
                                        <Input 
                                            type="number" 
                                            value={debtorLockThreshold} 
                                            onChange={e => setDebtorLockThreshold(Number(e.target.value))} 
                                            className="max-w-[200px] h-12 border-2 border-red-200 font-black text-red-600 text-lg rounded-xl focus:ring-red-500"
                                            placeholder="0.00"
                                        />
                                        <p className="text-[10px] font-bold text-red-500 uppercase italic">Example: If set to 500, a parent with 3 children is locked out only if their total debt exceeds 1,500 GH₵.</p>
                                    </div>
                                )}
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
