'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school'; // <--- NEW HOOK
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Building2, Save, Loader2, Globe, Phone, Mail, MapPin } from 'lucide-react';

export default function SchoolProfilePage() {
  const firestore = useFirestore();
  const { role } = useRole();
  const { schoolId, loading: isSchoolLoading } = useCurrentSchool(); // <--- GET ID
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch from the specific School Document
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
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !schoolId) return;

    setIsSaving(true);
    try {
        // 2. Save to specific School Document
        await setDoc(doc(firestore, 'schools', schoolId), {
            name, motto, address, phone, email, website, logoUrl,
            updatedAt: serverTimestamp()
        }, { merge: true }); // <--- MERGE IS CRITICAL (Keeps 'plan' & 'trialEndsAt' safe)
        
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
                <form onSubmit={handleSave} className="space-y-6">
                    
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
                        <p className="text-xs text-muted-foreground">Paste a direct link to your logo (or use Settings > Uploads to host it).</p>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                        <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 w-[150px]">
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
