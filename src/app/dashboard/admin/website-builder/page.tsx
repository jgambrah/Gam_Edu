
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Globe, LayoutTemplate, Palette, Save, Video } from 'lucide-react';
import Link from 'next/link';

export default function WebsiteBuilderPage() {
  const { schoolId } = useCurrentSchool();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const schoolRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]);
  const { data: schoolData, isLoading } = useDoc<any>(schoolRef);

  const [formData, setFormData] = useState({
    slug: '', mission: '', vision: '', aboutText: '', coverImageUrl: '', primaryColor: '#2563eb', youtubeUrl: ''
  });

  useEffect(() => {
    if (schoolData) {
      setFormData({
        slug: schoolData.slug || schoolData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        mission: schoolData.mission || '',
        vision: schoolData.vision || '',
        aboutText: schoolData.aboutText || '',
        coverImageUrl: schoolData.coverImageUrl || '',
        primaryColor: schoolData.primaryColor || '#2563eb',
        youtubeUrl: schoolData.youtubeUrl || ''
      });
    }
  }, [schoolData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !schoolId) return;
    setIsSaving(true);
    try {
        await updateDoc(doc(firestore, 'schools', schoolId), { ...formData });
        toast({ title: "Website Updated!", description: "Your public page is now live." });
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
        setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin"/></div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2"><LayoutTemplate className="text-blue-600"/> Website Builder</h1>
                <p className="text-muted-foreground">Customize your school's public admissions portal.</p>
            </div>
            {schoolData?.slug && (
                <Link href={`/s/${formData.slug}`} target="_blank">
                    <Button variant="outline" className="border-blue-200 text-blue-700 bg-blue-50"><Globe className="mr-2 h-4 w-4"/> View Live Site</Button>
                </Link>
            )}
        </div>

        <Card>
            <CardHeader><CardTitle>Content Settings</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Website URL Slug</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground bg-slate-100 p-2 rounded border border-r-0 rounded-r-none text-sm">/s/</span>
                                <Input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} className="rounded-l-none" required/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Palette className="w-4 h-4"/> Primary Brand Color</Label>
                            <div className="flex gap-2">
                                <input type="color" value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} className="h-10 w-10 rounded cursor-pointer" />
                                <Input value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label>Cover Image URL</Label>
                        <Input value={formData.coverImageUrl} onChange={e => setFormData({...formData, coverImageUrl: e.target.value})} placeholder="https://... (Link to a photo of your school)" />
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Video className="w-4 h-4"/> YouTube Promo Video URL</Label>
                        <Input value={formData.youtubeUrl} onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} placeholder="https://www.youtube.com/watch?v=..." />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2"><Label>Our Mission</Label><Textarea value={formData.mission} onChange={e => setFormData({...formData, mission: e.target.value})} rows={3} /></div>
                        <div className="space-y-2"><Label>Our Vision</Label><Textarea value={formData.vision} onChange={e => setFormData({...formData, vision: e.target.value})} rows={3} /></div>
                    </div>

                    <div className="space-y-2">
                        <Label>About Us</Label>
                        <Textarea value={formData.aboutText} onChange={e => setFormData({...formData, aboutText: e.target.value})} rows={5} placeholder="Welcome to our school..." />
                    </div>

                    <Button type="submit" disabled={isSaving} className="w-full h-12 text-lg"><Save className="mr-2"/> Save & Publish Website</Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
