'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useRole } from '@/context/role-context';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Loader2, Globe, LayoutTemplate, Palette, Save, Video, 
  Image as ImageIcon, Plus, Trash2, Phone, Mail, MapPin, 
  Facebook, Instagram, Linkedin, Play
} from 'lucide-react';
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
    gallery: [] as string[],
    videoUrls: [] as string[], // NEW: Support for multiple videos
    // Contact Info
    phone: '',
    email: '',
    address: '',
    // Social Links
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: ''
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');

  useEffect(() => {
    if (schoolData) {
      setFormData({
        slug: schoolData.slug || schoolData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
        mission: schoolData.mission || '',
        vision: schoolData.vision || '',
        aboutText: schoolData.aboutText || '',
        coverImageUrl: schoolData.coverImageUrl || '',
        primaryColor: schoolData.primaryColor || '#2563eb',
        gallery: schoolData.gallery || [],
        videoUrls: schoolData.videoUrls || (schoolData.youtubeUrl ? [schoolData.youtubeUrl] : []),
        phone: schoolData.phone || '',
        email: schoolData.email || '',
        address: schoolData.address || '',
        facebookUrl: schoolData.facebookUrl || '',
        instagramUrl: schoolData.instagramUrl || '',
        linkedinUrl: schoolData.linkedinUrl || ''
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

  const addVideo = () => {
    if (!newVideoUrl.trim()) return;
    setFormData(prev => ({
        ...prev,
        videoUrls: [...prev.videoUrls, newVideoUrl.trim()]
    }));
    setNewVideoUrl('');
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
        ...prev,
        videoUrls: prev.videoUrls.filter((_, i) => i !== index)
    }));
  };

  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
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
                            <CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5 text-indigo-600"/> Contact Information</CardTitle>
                            <CardDescription>Official details displayed on the public page footer.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Phone className="h-3 w-3" /> Phone Number</Label>
                                    <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+233..." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Mail className="h-3 w-3" /> Email Address</Label>
                                    <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="admin@school.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><MapPin className="h-3 w-3" /> Campus Address</Label>
                                <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="123 Education St, Accra" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Video className="h-5 w-5 text-indigo-600"/> Video Library</CardTitle>
                            <CardDescription>Share your school's promo videos, tours, and event highlights.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex gap-2">
                                <Input 
                                    value={newVideoUrl} 
                                    onChange={e => setNewVideoUrl(e.target.value)} 
                                    placeholder="YouTube URL (e.g. https://www.youtube.com/watch?v=...)" 
                                />
                                <Button type="button" onClick={addVideo} variant="secondary">
                                    <Plus className="h-4 w-4"/>
                                </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {formData.videoUrls.map((url, i) => {
                                    const ytId = extractYouTubeId(url);
                                    return (
                                        <div key={i} className="relative aspect-video rounded-xl overflow-hidden border bg-slate-900 group">
                                            {ytId ? (
                                                <iframe 
                                                    width="100%" height="100%" 
                                                    src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`} 
                                                    frameBorder="0" allowFullScreen
                                                    className="absolute inset-0"
                                                ></iframe>
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-white gap-2">
                                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                                    <span className="text-[10px] font-bold">Invalid Video URL</span>
                                                </div>
                                            )}
                                            <button 
                                                type="button"
                                                onClick={() => removeVideo(i)}
                                                className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            >
                                                <Trash2 className="h-3 w-3"/>
                                            </button>
                                        </div>
                                    );
                                })}
                                {formData.videoUrls.length === 0 && (
                                    <div className="col-span-full py-10 text-center border-2 border-dashed rounded-xl bg-slate-50 text-slate-400">
                                        No videos in your library yet.
                                    </div>
                                )}
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
                            <CardTitle className="text-sm uppercase tracking-widest text-indigo-600">Site Appearance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Hero / Cover Image URL</Label>
                                <Input value={formData.coverImageUrl} onChange={e => setFormData({...formData, coverImageUrl: e.target.value})} placeholder="https://..." />
                                {formData.coverImageUrl && (
                                    <img src={formData.coverImageUrl} className="mt-2 rounded-lg border aspect-video object-cover" alt="Cover Preview" />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-widest text-slate-500">Social Presence</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-blue-600"><Facebook className="h-3 w-3"/> Facebook URL</Label>
                                <Input value={formData.facebookUrl} onChange={e => setFormData({...formData, facebookUrl: e.target.value})} placeholder="https://facebook.com/..." className="text-xs" />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-pink-600"><Instagram className="h-3 w-3"/> Instagram URL</Label>
                                <Input value={formData.instagramUrl} onChange={e => setFormData({...formData, instagramUrl: e.target.value})} placeholder="https://instagram.com/..." className="text-xs" />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-blue-800"><Linkedin className="h-3 w-3"/> LinkedIn URL</Label>
                                <Input value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} placeholder="https://linkedin.com/in/..." className="text-xs" />
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
