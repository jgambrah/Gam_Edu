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
  CalendarDays
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

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
  
  // Term Dates State
  const [termStartDate, setTermStartDate] = useState<Date | undefined>(undefined);
  const [termEndDate, setTermEndDate] = useState<Date | undefined>(undefined);

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
        
        // Load Term Dates
        if (profile.termStartDate) {
            setTermStartDate(profile.termStartDate.toDate());
        }
        if (profile.termEndDate) {
            setTermEndDate(profile.termEndDate.toDate());
        }
    }
  }, [profile]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !schoolId) return;

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
      const logoRef = ref(storage, `schools/${schoolId}/assets/logo`);
      const snapshot = await uploadBytes(logoRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      setLogoUrl(url);
      toast({ 
        title: "Logo Uploaded", 
        description: "Preview updated. Remember to save changes below." 
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
        const brandingData = {
            name, motto, address, phone, email, website, logoUrl,
            termStartDate: termStartDate ? Timestamp.fromDate(termStartDate) : null,
            termEndDate: termEndDate ? Timestamp.fromDate(termEndDate) : null,
            updatedAt: serverTimestamp()
        };

        // 1. Save to main schools document (Private staff-only view)
        await setDoc(doc(firestore, 'schools', schoolId), {
            ...brandingData,
            caWeight, examWeight,
        }, { merge: true });

        // 2. Save a public copy to schoolSettings (Mirror for Parents/Students)
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="border-t-4 border-t-blue-600 shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Building2 className="text-blue-600"/> School Profile Settings
                </CardTitle>
                <CardDescription>
                    Configure official school information for reports and receipts.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-8">
                    
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-bold text-slate-700">Official School Logo</Label>
                            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 transition-colors hover:bg-slate-50">
                                <div className="relative group">
                                    <div className="h-32 w-32 border-4 border-white rounded-2xl overflow-hidden bg-white shadow-xl flex items-center justify-center shrink-0">
                                        {logoUrl ? (
                                            <img 
                                                key={logoUrl} 
                                                src={logoUrl} 
                                                alt="Preview" 
                                                className="max-h-full max-w-full object-contain"
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
                                        <h4 className="font-bold text-slate-800">Branding Upload</h4>
                                        <p className="text-xs text-slate-500">Logo used on all automated receipts and reports.</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <input 
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
                                                <><Upload className="mr-2 h-4 w-4"/> Select Logo File</>
                                            )}
                                        </Button>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Square PNG or JPG recommended, max 2MB</p>
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
                            <Label>Physical Address</Label>
                            <Textarea value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. 123 Education Street, Accra, Ghana" rows={3} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Phone className="h-3 w-3"/> Phone</Label>
                                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+233..." />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Mail className="h-3 w-3"/> Email</Label>
                                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@school.com" />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Globe className="h-3 w-3"/> Website</Label>
                                <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="www.school.com" />
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* ACADEMIC TERM DATES */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-indigo-600"/>
                            <h3 className="text-lg font-bold text-slate-800">Current Academic Term</h3>
                        </div>
                        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                            <div className="flex items-center gap-2 mb-4 text-indigo-700">
                                <AlertCircle className="h-4 w-4"/>
                                <p className="text-sm font-medium">Set the official start and end dates for the current term. This ensures consistent attendance calculations on student reports.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Term Start Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full text-left font-normal bg-white h-12 border-2 rounded-xl">
                                                {termStartDate ? format(termStartDate, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={termStartDate} onSelect={setTermStartDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-700">Term End Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full text-left font-normal bg-white h-12 border-2 rounded-xl">
                                                {termEndDate ? format(termEndDate, "PPP") : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar mode="single" selected={termEndDate} onSelect={setTermEndDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-indigo-600"/>
                            <h3 className="text-lg font-bold text-slate-800">Academic Weighting</h3>
                        </div>
                        
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-2 mb-4">
                                <AlertCircle className="h-4 w-4 text-amber-600"/>
                                <p className="text-sm font-medium text-slate-600">Define the terminal report ratio (e.g., 30% CA / 70% Exam).</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <Label className="font-bold">CA Weight (%)</Label>
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
                                        <Label className="font-bold">Exam Weight (%)</Label>
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
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                        <Button type="submit" disabled={isSaving || isUploadingLogo || (caWeight + examWeight !== 100)} className="bg-blue-600 hover:bg-blue-700 w-[200px] h-12 text-lg font-bold">
                            {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
                            Save Profile
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}