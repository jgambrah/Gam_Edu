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
import { Loader2, Globe, LayoutTemplate, Palette, Save, Video, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function WebsiteBuilderPage() {
  const { schoolId } = useCurrentSchool();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const schoolRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]);
  const { data: schoolData, isLoading } = useDoc<any>(schoolRef);

  const [formData, setFormData] = useState({
    slug: '', 
    mission: '', 
    vision: '', 
    aboutText: '', 
    coverImageUrl: '', 
    primaryColor: '#2563eb', 
    youtubeUrl: '',
    gallery: [] as string[]
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  useEffect(() => {
    if (schoolData) {
      setFormData({
        slug: schoolData.slug || schoolData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
        mission: schoolData.mission || '',
        vision: schoolData.vision || '',
        aboutText: schoolData.aboutText || '',
        coverImageUrl: schoolData.coverImageUrl || '',
        primaryColor: schoolData.primaryColor || '#2563eb',
        youtubeUrl: schoolData.youtubeUrl || '',
        gallery: schoolData.gallery || []
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

  const addGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, newGalleryUrl.trim()]
    }));
    setNewGalleryUrl('');
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <LayoutTemplate className="text-indigo-600"/> Website Builder
                </h1>
                <p className="text-muted-foreground font-medium">Customize your school's public presence and admissions portal.</p>
            </div>
            {schoolData?.slug && (
                <Link href={`/s/${formData.slug}`} target="_blank">
                    <Button variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 font-bold">
                        <Globe className="mr-2 h-4 w-4"/> View Live Site
                    </Button>
                </Link>
            )}
        </div>

        <form onSubmit={handleSave} className="space-y-6 pb-20">
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Identity</CardTitle>
                            <CardDescription>How the school appears in search and URL bars.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Website URL Slug</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground bg-slate-100 p-2 rounded border border-r-0 rounded-r-none text-[10px] font-black">/s/</span>
                                        <Input 
                                            value={formData.slug} 
                                            onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} 
                                            className="rounded-l-none font-bold" 
                                            placeholder="my-school-name"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Palette className="w-4 h-4"/> Primary Brand Color</Label>
                                    <div className="flex gap-2">
                                        <input type="color" value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} className="h-10 w-10 rounded-lg cursor-pointer border-2 border-slate-200" />
                                        <Input value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} className="font-mono uppercase" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label>About Us (Long Description)</Label>
                                <Textarea 
                                    value={formData.aboutText} 
                                    onChange={e => setFormData({...formData, aboutText: e.target.value})} 
                                    rows={6} 
                                    placeholder="Tell prospective parents about your school's history and facilities..." 
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5 text-indigo-600"/> Photo Gallery</CardTitle>
                            <CardDescription>Showcase your campus, classrooms, and students.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input 
                                    value={newGalleryUrl} 
                                    onChange={e => setNewGalleryUrl(e.target.value)} 
                                    placeholder="Paste image URL here..." 
                                />
                                <Button type="button" onClick={addGalleryImage} variant="secondary">
                                    <Plus className="h-4 w-4"/>
                                </Button>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {formData.gallery.map((url, i) => (
                                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden border group">
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => removeGalleryImage(i)}
                                            className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-3 w-3"/>
                                        </button>
                                    </div>
                                ))}
                                {formData.gallery.length === 0 && (
                                    <div className="col-span-full py-10 text-center border-2 border-dashed rounded-xl bg-slate-50 text-slate-400">
                                        No gallery photos added.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-indigo-50 border-indigo-100">
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-widest text-indigo-600">Visual Assets</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Hero / Cover Image URL</Label>
                                <Input value={formData.coverImageUrl} onChange={e => setFormData({...formData, coverImageUrl: e.target.value})} placeholder="https://..." />
                                {formData.coverImageUrl && (
                                    <img src={formData.coverImageUrl} className="mt-2 rounded-lg border aspect-video object-cover" alt="Cover Preview" />
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Video className="w-4 h-4"/> YouTube Promo URL</Label>
                                <Input value={formData.youtubeUrl} onChange={e => setFormData({...formData, youtubeUrl: e.target.value})} placeholder="https://..." />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-widest text-slate-500">Core Beliefs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Our Mission</Label>
                                <Textarea value={formData.mission} onChange={e => setFormData({...formData, mission: e.target.value})} rows={3} className="text-xs" />
                            </div>
                            <div className="space-y-2">
                                <Label>Our Vision</Label>
                                <Textarea value={formData.vision} onChange={e => setFormData({...formData, vision: e.target.value})} rows={3} className="text-xs" />
                            </div>
                        </CardContent>
                    </Card>

                    <Button type="submit" disabled={isSaving} className="w-full h-14 text-lg font-black bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200">
                        {isSaving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2"/>}
                        SAVE & PUBLISH
                    </Button>
                </div>
            </div>
        </form>
    </div>
  );
}
