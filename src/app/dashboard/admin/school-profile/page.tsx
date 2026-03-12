'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Save, Loader2, Globe, Phone, Mail, GraduationCap, AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function SchoolProfilePage() {
  const firestore = useFirestore();
  const { role } = useRole();
  const { schoolId, loading: isSchoolLoading } = useCurrentSchool();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

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

                        <div className="space-y-2">
                            <Label>Logo URL</Label>
                            <div className="flex gap-2">
                                <Input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://..." />
                            </div>
                            <p className="text-xs text-muted-foreground">Paste a direct link to your logo.</p>
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
                        <Button type="submit" disabled={isSaving || (caWeight + examWeight !== 100)} className="bg-blue-600 hover:bg-blue-700 w-[200px] h-12 text-lg font-bold">
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
