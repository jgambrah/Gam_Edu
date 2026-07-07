'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { 
  Loader2, Globe, LayoutTemplate, Palette, Save, Video, 
  Image as ImageIcon, Plus, Trash2, Phone, Mail, MapPin, 
  Facebook, Instagram, Linkedin, Copy, ExternalLink, Check, Upload, User, Users, Megaphone
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function getYouTubeId(url: string) {
  if (!url) return null;
  const cleanUrl = url.trim();
  
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  const m = cleanUrl.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/);
  if (m && m[2].length === 11) {
    return m[2];
  }

  const fallback = cleanUrl.match(/(?:v=|\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})(?:\?|&|$)/);
  if (fallback) {
    return fallback[1];
  }

  return null;
}

export default function WebsiteBuilderPage() {
  const { schoolId } = useCurrentSchool();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [directorUploading, setDirectorUploading] = useState(false);
  const [principalUploading, setPrincipalUploading] = useState(false);

  const schoolRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]);
  const { data: schoolData, isLoading } = useDoc<any>(schoolRef);

  const [formData, setFormData] = useState({
    slug: '', 
    customDomain: '',
    mission: '', 
    vision: '', 
    coreValues: '',
    aboutText: '', 
    coverImageUrl: '', 
    primaryColor: '#2563eb', 
    secondaryColor: '',
    tertiaryColor: '',
    bannerBgColor: '',
    gallery: [] as { url: string, caption: string }[],
    videoUrls: [] as { url: string, title: string }[],
    customStaff: [] as { name: string; role: string; qualifications: string; bio: string; photoUrl: string }[],
    customNews: [] as { title: string; content: string; type: 'News' | 'Announcement' | 'Event'; date: string; imageUrl: string; videoUrl: string }[],
    phone: '',
    email: '',
    address: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    directorMessage: '',
    directorPhotoUrl: '',
    directorLayout: 'alongside' as 'alongside' | 'below',
    principalMessage: '',
    principalPhotoUrl: '',
    principalLayout: 'alongside' as 'alongside' | 'below'
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [newGalleryCaption, setNewGalleryCaption] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newVideoTitle, setNewVideoTitle] = useState('');

  // Custom Staff Form States
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffQualifications, setStaffQualifications] = useState('');
  const [staffBio, setStaffBio] = useState('');
  const [staffPhotoUrl, setStaffPhotoUrl] = useState('');
  const [staffUploading, setStaffUploading] = useState(false);

  // Custom News Form States
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsType, setNewsType] = useState<'News' | 'Announcement' | 'Event'>('News');
  const [newsDate, setNewsDate] = useState('');
  const [newsImageUrl, setNewsImageUrl] = useState('');
  const [newsVideoUrl, setNewsVideoUrl] = useState('');
  const [newsImageUploading, setNewsImageUploading] = useState(false);

  useEffect(() => {
    if (schoolData) {
      // Data migration check: handle strings or objects for media arrays
      const rawGallery = schoolData.gallery || [];
      const formattedGallery = rawGallery.map((item: any) => 
        typeof item === 'string' ? { url: item, caption: '' } : item
      );

      const rawVideos = schoolData.videoUrls || (schoolData.youtubeUrl ? [{ url: schoolData.youtubeUrl, title: 'Promo Video' }] : []);
      const formattedVideos = rawVideos.map((item: any) => 
        typeof item === 'string' ? { url: item, title: 'Video Resource' } : item
      );

      setFormData({
        slug: schoolData.slug || schoolData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || '',
        customDomain: schoolData.customDomain || '',
        mission: schoolData.mission || '',
        vision: schoolData.vision || '',
        coreValues: schoolData.coreValues || '',
        aboutText: schoolData.aboutText || '',
        coverImageUrl: schoolData.coverImageUrl || '',
        primaryColor: schoolData.primaryColor || '#2563eb',
        secondaryColor: schoolData.secondaryColor || '',
        tertiaryColor: schoolData.tertiaryColor || '',
        bannerBgColor: schoolData.bannerBgColor || '',
        gallery: formattedGallery,
        videoUrls: formattedVideos,
        customStaff: schoolData.customStaff || [],
        customNews: schoolData.customNews || [],
        phone: schoolData.phone || '',
        email: schoolData.email || '',
        address: schoolData.address || '',
        facebookUrl: schoolData.facebookUrl || '',
        instagramUrl: schoolData.instagramUrl || '',
        linkedinUrl: schoolData.linkedinUrl || '',
        directorMessage: schoolData.directorMessage || '',
        directorPhotoUrl: schoolData.directorPhotoUrl || '',
        directorLayout: schoolData.directorLayout || 'alongside',
        principalMessage: schoolData.principalMessage || '',
        principalPhotoUrl: schoolData.principalPhotoUrl || '',
        principalLayout: schoolData.principalLayout || 'alongside'
      });
    }
  }, [schoolData]);

  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/s/${formData.slug}`
    : '';

  const handleCopyUrl = () => {
    if (!publicUrl) return;
    navigator.clipboard.writeText(publicUrl);
    setHasCopied(true);
    toast({ title: "Link Copied!", description: "Share this link with prospective parents." });
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !schoolId) return;
    setIsSaving(true);
    try {
        await updateDoc(doc(firestore, 'schools', schoolId), { ...formData });
        toast({ title: "Website Published!", description: "Your public page has been updated." });
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
        gallery: [...prev.gallery, { url: newGalleryUrl.trim(), caption: newGalleryCaption.trim() }]
    }));
    setNewGalleryUrl('');
    setNewGalleryCaption('');
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
        ...prev,
        gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  const addVideo = () => {
    if (!newVideoUrl.trim() || !newVideoTitle.trim()) {
      toast({ variant: 'destructive', title: "Validation Error", description: "Please enter both video title and YouTube URL." });
      return;
    }
    const ytId = getYouTubeId(newVideoUrl);
    if (!ytId) {
      toast({ variant: 'destructive', title: "Invalid YouTube URL", description: "We couldn't extract a valid YouTube video ID from that link." });
      return;
    }
    setFormData(prev => ({
        ...prev,
        videoUrls: [...prev.videoUrls, { url: newVideoUrl.trim(), title: newVideoTitle.trim() }]
    }));
    setNewVideoUrl('');
    setNewVideoTitle('');
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
        ...prev,
        videoUrls: prev.videoUrls.filter((_, i) => i !== index)
    }));
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !schoolId) return;
    setCoverUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `schools/${schoolId}/website/cover`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, coverImageUrl: url }));
      toast({ title: "Cover Image Uploaded", description: "Click SAVE & PUBLISH to save changes." });
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Upload Failed", description: err.message });
    } finally {
      setCoverUploading(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !schoolId) return;
    setGalleryUploading(true);
    try {
      const storage = getStorage();
      const newImages: { url: string; caption: string }[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `schools/${schoolId}/website/gallery_${Date.now()}_${i}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        newImages.push({ url, caption: file.name.split('.')[0] });
      }
      setFormData(prev => ({
        ...prev,
        gallery: [...prev.gallery, ...newImages]
      }));
      toast({ title: "Gallery Images Uploaded", description: `Added ${newImages.length} images. Click SAVE & PUBLISH to save.` });
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Upload Failed", description: err.message });
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleStaffPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !schoolId) return;
    setStaffUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `schools/${schoolId}/website/staff_${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setStaffPhotoUrl(url);
      toast({ title: "Staff Photo Uploaded", description: "Photo is ready to add." });
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Upload Failed", description: err.message });
    } finally {
      setStaffUploading(false);
    }
  };

  const addCustomStaff = () => {
    if (!staffName.trim() || !staffRole.trim()) {
      toast({ variant: 'destructive', title: "Error", description: "Name and Role are required." });
      return;
    }
    setFormData(prev => ({
      ...prev,
      customStaff: [...prev.customStaff, {
        name: staffName.trim(),
        role: staffRole.trim(),
        qualifications: staffQualifications.trim(),
        bio: staffBio.trim(),
        photoUrl: staffPhotoUrl
      }]
    }));
    setStaffName('');
    setStaffRole('');
    setStaffQualifications('');
    setStaffBio('');
    setStaffPhotoUrl('');
  };

  const removeCustomStaff = (index: number) => {
    setFormData(prev => ({
        ...prev,
        customStaff: prev.customStaff.filter((_, i) => i !== index)
    }));
  };

  const handleDirectorPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !schoolId) return;
    setDirectorUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `schools/${schoolId}/website/director_${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, directorPhotoUrl: url }));
      toast({ title: "Director Photo Uploaded", description: "Photo is ready. Save to publish." });
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Upload Failed", description: err.message });
    } finally {
      setDirectorUploading(false);
    }
  };

  const handlePrincipalPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !schoolId) return;
    setPrincipalUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `schools/${schoolId}/website/principal_${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, principalPhotoUrl: url }));
      toast({ title: "Principal Photo Uploaded", description: "Photo is ready. Save to publish." });
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Upload Failed", description: err.message });
    } finally {
      setPrincipalUploading(false);
    }
  };

  const handleNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !schoolId) return;
    setNewsImageUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `schools/${schoolId}/website/news_${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setNewsImageUrl(url);
      toast({ title: "News Image Uploaded", description: "Image is ready to add." });
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Upload Failed", description: err.message });
    } finally {
      setNewsImageUploading(false);
    }
  };

  const addCustomNews = () => {
    if (!newsTitle.trim() || !newsContent.trim()) {
      toast({ variant: 'destructive', title: "Error", description: "Title and Content are required." });
      return;
    }
    setFormData(prev => ({
      ...prev,
      customNews: [...prev.customNews, {
        title: newsTitle.trim(),
        content: newsContent.trim(),
        type: newsType,
        date: newsDate || new Date().toISOString().split('T')[0],
        imageUrl: newsImageUrl,
        videoUrl: newsVideoUrl.trim()
      }]
    }));
    setNewsTitle('');
    setNewsContent('');
    setNewsType('News');
    setNewsDate('');
    setNewsImageUrl('');
    setNewsVideoUrl('');
  };

  const removeCustomNews = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customNews: prev.customNews.filter((_, i) => i !== index)
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
                <p className="text-muted-foreground font-medium">Build and manage your school's public identity.</p>
            </div>
            {formData.slug && (
                <Link href={`/s/${formData.slug}`} target="_blank">
                    <Button variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 font-bold">
                        <ExternalLink className="mr-2 h-4 w-4"/> View Live Site
                    </Button>
                </Link>
            )}
        </div>

        {/* PUBLIC URL SHARE CARD */}
        <Card className="bg-slate-900 text-white border-none overflow-hidden rounded-3xl shadow-xl">
            <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Share Your School</p>
                    <h2 className="text-2xl font-bold tracking-tight">Your Official Web Address</h2>
                    <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl border border-white/10 font-mono text-sm break-all">
                        <Globe className="h-4 w-4 text-indigo-400 shrink-0"/>
                        <span className="opacity-80">{publicUrl}</span>
                    </div>
                </div>
                <Button 
                    onClick={handleCopyUrl} 
                    className={cn(
                        "h-14 px-8 rounded-2xl font-black transition-all active:scale-95 shrink-0",
                        hasCopied ? "bg-green-500 hover:bg-green-600" : "bg-white text-slate-900 hover:bg-slate-100"
                    )}
                >
                    {hasCopied ? <Check className="mr-2 h-5 w-5"/> : <Copy className="mr-2 h-5 w-5"/>}
                    {hasCopied ? "COPIED!" : "COPY LINK"}
                </Button>
            </CardContent>
        </Card>

        <form onSubmit={handleSave} className="space-y-6 pb-20">
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Basic Identity</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6 pb-4 border-b border-slate-100">
                                <div className="space-y-2">
                                    <Label>Website URL Slug</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground bg-slate-100 p-2 rounded border border-r-0 rounded-r-none text-sm font-black">/s/</span>
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
                                    <Label>Custom Domain (Optional)</Label>
                                    <Input 
                                        value={formData.customDomain} 
                                        onChange={e => setFormData({...formData, customDomain: e.target.value.toLowerCase().replace(/[^a-z0-9.-]/g, '')})} 
                                        className="font-bold" 
                                        placeholder="www.myschool.com"
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-4 space-y-4">
                                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                                    <Globe className="h-4 w-4 text-indigo-650"/> Custom Domain & Billing Guide
                                </h4>
                                <div className="text-xs text-slate-650 space-y-3 leading-relaxed">
                                    <p className="font-semibold text-slate-800">
                                        Connect your custom domain (e.g. <code className="font-mono text-[11px] text-slate-900 bg-slate-200/50 px-1 py-0.5 rounded">www.yourschool.com</code>) by following these simple, self-serve steps:
                                    </p>
                                    <ol className="list-decimal pl-4 space-y-3 font-semibold text-slate-650">
                                        <li>
                                            <strong>Get Your Domain from a Provider:</strong> 
                                            {" "}You must purchase a domain name directly from an external domain registrar. You pay them directly, and you own the domain. Click any of these popular, secure providers to get started:
                                            <div className="flex flex-wrap gap-3 mt-2">
                                                <a href="https://www.namecheap.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-indigo-600 hover:bg-slate-50 font-black shadow-sm transition-colors text-[10px]">
                                                    🌐 Go to Namecheap ↗
                                                </a>
                                                <a href="https://www.godaddy.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-indigo-600 hover:bg-slate-50 font-black shadow-sm transition-colors text-[10px]">
                                                    🌐 Go to GoDaddy ↗
                                                </a>
                                                <a href="https://www.hostinger.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-indigo-600 hover:bg-slate-50 font-black shadow-sm transition-colors text-[10px]">
                                                    🌐 Go to Hostinger ↗
                                                </a>
                                            </div>
                                        </li>
                                        <li>
                                            <strong>Configure DNS Settings:</strong> 
                                            {" "}Log in to the account where you purchased your domain, locate your <strong>DNS Settings</strong> or <strong>DNS Zone Editor</strong>, and add one of these records:
                                            <ul className="list-disc pl-4 mt-2 space-y-1 text-slate-500 font-bold">
                                                <li>For a root domain (e.g. <code className="font-mono">yourschool.com</code>): Add an <strong>A Record</strong> with Host as <code className="font-mono text-slate-800">@</code> pointing to IP address: <strong className="text-slate-800">76.76.21.21</strong></li>
                                                <li>For subdomains (e.g. <code className="font-mono">www.yourschool.com</code> or <code className="font-mono">portal.yourschool.com</code>): Add a <strong>CNAME Record</strong> with Host as <code className="font-mono text-slate-800">www</code> (or your subdomain prefix) pointing to value: <strong className="text-slate-800">cname.vercel-dns.com</strong></li>
                                            </ul>
                                        </li>
                                        <li>
                                            <strong>Link it in the Builder:</strong> 
                                            {" "}Once DNS records are configured, type your domain in the <strong>Custom Domain</strong> input field above (e.g. <code className="font-mono">www.yourschool.com</code>) and click <strong>SAVE & PUBLISH</strong>.
                                            <div className="mt-1.5 p-2 bg-indigo-50 text-indigo-800 rounded-xl text-[10px] font-bold border border-indigo-100 leading-snug max-w-lg">
                                                💡 Important: After saving, please notify platform support (or email support@gamedu.com) so we can activate the domain on the Vercel server and provision your SSL security certificate (HTTPS) automatically.
                                            </div>
                                        </li>
                                        <li>
                                            <strong>SaaS Portal Subscription:</strong> 
                                            {" "}To pay for your school portal hosting and builder subscription, go to the <Link href="/dashboard/subscription" className="text-indigo-600 hover:underline font-bold">Subscription Portal</Link> directly on your dashboard. You pay online securely via Card or Mobile Money without any manual admin involvement.
                                        </li>
                                    </ol>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6 pt-2">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Palette className="w-4 h-4"/> Primary Color</Label>
                                    <div className="flex gap-2">
                                        <input type="color" value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} className="h-10 w-10 rounded-lg cursor-pointer border-2 border-slate-200 shrink-0" />
                                        <Input value={formData.primaryColor} onChange={e => setFormData({...formData, primaryColor: e.target.value})} className="font-mono uppercase text-xs font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="flex items-center gap-2"><Palette className="w-4 h-4"/> Secondary Color (Optional)</Label>
                                        {formData.secondaryColor && (
                                            <button 
                                                type="button" 
                                                onClick={() => setFormData({...formData, secondaryColor: ''})} 
                                                className="text-xs text-red-500 hover:text-red-600 font-bold"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="color" value={formData.secondaryColor || '#6366f1'} onChange={e => setFormData({...formData, secondaryColor: e.target.value})} className="h-10 w-10 rounded-lg cursor-pointer border-2 border-slate-200 shrink-0" />
                                        <Input value={formData.secondaryColor} onChange={e => setFormData({...formData, secondaryColor: e.target.value})} placeholder="e.g. #6366f1" className="font-mono uppercase text-xs font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label className="flex items-center gap-2"><Palette className="w-4 h-4"/> Tertiary Color (Optional)</Label>
                                        {formData.tertiaryColor && (
                                            <button 
                                                type="button" 
                                                onClick={() => setFormData({...formData, tertiaryColor: ''})} 
                                                className="text-xs text-red-500 hover:text-red-600 font-bold"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="color" value={formData.tertiaryColor || '#10b981'} onChange={e => setFormData({...formData, tertiaryColor: e.target.value})} className="h-10 w-10 rounded-lg cursor-pointer border-2 border-slate-200 shrink-0" />
                                        <Input value={formData.tertiaryColor} onChange={e => setFormData({...formData, tertiaryColor: e.target.value})} placeholder="e.g. #10b981" className="font-mono uppercase text-xs font-bold" />
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
                        <CardHeader><CardTitle>Mission, Vision & Core Values</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Mission Statement</Label>
                                    <Textarea 
                                        value={formData.mission} 
                                        onChange={e => setFormData({...formData, mission: e.target.value})} 
                                        rows={3} 
                                        placeholder="Our mission is to..." 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Vision Statement</Label>
                                    <Textarea 
                                        value={formData.vision} 
                                        onChange={e => setFormData({...formData, vision: e.target.value})} 
                                        rows={3} 
                                        placeholder="Our vision is to..." 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Core Values</Label>
                                <Textarea 
                                    value={formData.coreValues} 
                                    onChange={e => setFormData({...formData, coreValues: e.target.value})} 
                                    rows={3} 
                                    placeholder="e.g. Excellence, Integrity, Collaboration..." 
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-indigo-605" /> Leadership Messages</CardTitle>
                            <CardDescription>Add personal messages from the Director and the Principal to display on the storefront.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Director's Message Section */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                                <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                    <User className="h-4 w-4 text-indigo-605" /> Director's Message
                                </h4>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Director's Photo</Label>
                                        <div className="flex gap-2">
                                            {formData.directorPhotoUrl ? (
                                                <div className="h-10 w-10 rounded-lg overflow-hidden border shrink-0 bg-slate-200">
                                                    <img src={formData.directorPhotoUrl} className="h-full w-full object-cover" />
                                                </div>
                                            ) : null}
                                            <input type="file" accept="image/*" onChange={handleDirectorPhotoUpload} className="hidden" id="director-file-input" disabled={directorUploading} />
                                            <Button type="button" variant="outline" asChild disabled={directorUploading} className="w-full">
                                                <label htmlFor="director-file-input" className="cursor-pointer flex items-center justify-center gap-1.5 font-bold">
                                                    {directorUploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Upload className="h-4 w-4"/>}
                                                    Upload Director Photo
                                                </label>
                                            </Button>
                                            {formData.directorPhotoUrl && (
                                                <Button type="button" variant="destructive" size="icon" onClick={() => setFormData({...formData, directorPhotoUrl: ''})} className="shrink-0">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Layout Type</Label>
                                        <select 
                                            value={formData.directorLayout} 
                                            onChange={e => setFormData({...formData, directorLayout: e.target.value as any})}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-bold"
                                        >
                                            <option value="alongside">Alongside Photo (Horizontal)</option>
                                            <option value="below">Below Photo (Vertical Stack)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Director's Message Text</Label>
                                    <Textarea 
                                        value={formData.directorMessage} 
                                        onChange={e => setFormData({...formData, directorMessage: e.target.value})} 
                                        placeholder="Write a welcoming or inspiring message from the School Director..." 
                                        rows={4} 
                                    />
                                </div>
                            </div>

                            {/* Principal's Message Section */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                                <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                    <User className="h-4 w-4 text-indigo-605" /> Principal's Message
                                </h4>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Principal's Photo</Label>
                                        <div className="flex gap-2">
                                            {formData.principalPhotoUrl ? (
                                                <div className="h-10 w-10 rounded-lg overflow-hidden border shrink-0 bg-slate-200">
                                                    <img src={formData.principalPhotoUrl} className="h-full w-full object-cover" />
                                                </div>
                                            ) : null}
                                            <input type="file" accept="image/*" onChange={handlePrincipalPhotoUpload} className="hidden" id="principal-file-input" disabled={principalUploading} />
                                            <Button type="button" variant="outline" asChild disabled={principalUploading} className="w-full">
                                                <label htmlFor="principal-file-input" className="cursor-pointer flex items-center justify-center gap-1.5 font-bold">
                                                    {principalUploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Upload className="h-4 w-4"/>}
                                                    Upload Principal Photo
                                                </label>
                                            </Button>
                                            {formData.principalPhotoUrl && (
                                                <Button type="button" variant="destructive" size="icon" onClick={() => setFormData({...formData, principalPhotoUrl: ''})} className="shrink-0">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Layout Type</Label>
                                        <select 
                                            value={formData.principalLayout} 
                                            onChange={e => setFormData({...formData, principalLayout: e.target.value as any})}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-bold"
                                        >
                                            <option value="alongside">Alongside Photo (Horizontal)</option>
                                            <option value="below">Below Photo (Vertical Stack)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Principal's Message Text</Label>
                                    <Textarea 
                                        value={formData.principalMessage} 
                                        onChange={e => setFormData({...formData, principalMessage: e.target.value})} 
                                        placeholder="Write a message or word of advice from the School Principal..." 
                                        rows={4} 
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Video className="h-5 w-5 text-indigo-600"/> Video Library</CardTitle>
                            <CardDescription>Add videos with titles to showcase your campus.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Input value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} placeholder="Video Title (e.g. Campus Tour)" />
                                <div className="flex gap-2">
                                    <Input value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} placeholder="YouTube URL" />
                                    <Button type="button" onClick={addVideo} variant="secondary"><Plus/></Button>
                                </div>
                            </div>
                            <div className="space-y-3 mt-4">
                                {formData.videoUrls.map((video, i) => {
                                    const ytId = getYouTubeId(typeof video === 'string' ? video : video.url);
                                    return (
                                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border rounded-2xl gap-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                {ytId ? (
                                                    <div className="relative h-14 aspect-video bg-black rounded-lg overflow-hidden border shrink-0">
                                                        <img 
                                                            src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} 
                                                            alt={video.title} 
                                                            className="w-full h-full object-cover" 
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                            <Video className="h-4 w-4 text-white" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-14 aspect-video bg-red-100 border border-red-200 text-red-650 rounded-lg flex items-center justify-center shrink-0">
                                                        <Video className="h-5 w-5" />
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <span className="text-sm font-bold text-slate-800 block truncate">{video.title}</span>
                                                    <span className="text-[10px] font-mono text-slate-500 block truncate max-w-[280px] sm:max-w-md">{typeof video === 'string' ? video : video.url}</span>
                                                    {!ytId && (
                                                        <span className="text-[10px] font-bold text-red-500 block">Invalid YouTube URL (will not show on live site)</span>
                                                    )}
                                                </div>
                                            </div>
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeVideo(i)} className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"><Trash2 className="h-4 w-4"/></Button>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
                            <div>
                                <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5 text-indigo-600"/> Photo Gallery (Activities)</CardTitle>
                                <CardDescription>Add photos of school activities and environment.</CardDescription>
                            </div>
                            <div className="relative shrink-0">
                                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" id="gallery-file-input" disabled={galleryUploading} />
                                <Button type="button" variant="outline" asChild disabled={galleryUploading}>
                                    <label htmlFor="gallery-file-input" className="cursor-pointer flex items-center gap-1.5 font-bold">
                                        {galleryUploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Upload className="h-4 w-4"/>}
                                        Upload Multiple Photos
                                    </label>
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Input value={newGalleryCaption} onChange={e => setNewGalleryCaption(e.target.value)} placeholder="Caption (e.g. Science Lab)" />
                                <div className="flex gap-2">
                                    <Input value={newGalleryUrl} onChange={e => setNewGalleryUrl(e.target.value)} placeholder="Or paste image URL..." />
                                    <Button type="button" onClick={addGalleryImage} variant="secondary"><Plus/></Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                                {formData.gallery.map((item, i) => (
                                    <div key={i} className="relative rounded-xl overflow-hidden border group bg-white">
                                        <img src={item.url} alt="" className="aspect-video w-full object-cover" />
                                        <div className="p-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-slate-600 truncate">{item.caption || "No caption"}</div>
                                        <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="h-3 w-3"/></button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-indigo-600"/> School Team / Staff</CardTitle>
                            <CardDescription>Manage the educators and staff displayed on your public storefront.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Add Staff form */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                                <h4 className="text-sm font-bold text-slate-800">Add Team Member</h4>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name *</Label>
                                        <Input value={staffName} onChange={e => setStaffName(e.target.value)} placeholder="e.g. Dr. John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Role / Position *</Label>
                                        <Input value={staffRole} onChange={e => setStaffRole(e.target.value)} placeholder="e.g. Principal, Director" />
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Qualifications (Optional)</Label>
                                        <Input value={staffQualifications} onChange={e => setStaffQualifications(e.target.value)} placeholder="e.g. PhD in Education" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Staff Photo</Label>
                                        <div className="flex gap-2">
                                            {staffPhotoUrl ? (
                                                <div className="h-10 w-10 rounded-lg overflow-hidden border shrink-0 bg-slate-200">
                                                    <img src={staffPhotoUrl} className="h-full w-full object-cover" />
                                                </div>
                                            ) : null}
                                            <input type="file" accept="image/*" onChange={handleStaffPhotoUpload} className="hidden" id="staff-file-input" disabled={staffUploading} />
                                            <Button type="button" variant="outline" asChild disabled={staffUploading} className="w-full">
                                                <label htmlFor="staff-file-input" className="cursor-pointer flex items-center justify-center gap-1.5 font-bold">
                                                    {staffUploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Upload className="h-4 w-4"/>}
                                                    Upload Photo
                                                </label>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Brief Bio / Description</Label>
                                    <Textarea value={staffBio} onChange={e => setStaffBio(e.target.value)} placeholder="Write a brief intro about this staff member..." rows={2} />
                                </div>
                                <Button type="button" onClick={addCustomStaff} className="bg-indigo-605 hover:bg-indigo-700 text-white w-full font-bold">
                                    <Plus className="mr-2 h-4 w-4"/> Add Staff Member
                                </Button>
                            </div>

                            {/* Staff List */}
                            <div className="space-y-3">
                                <Label>Current Website Staff</Label>
                                {formData.customStaff.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">No custom staff members added yet. Add some above.</p>
                                ) : (
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {formData.customStaff.map((member, i) => (
                                            <div key={i} className="flex gap-3 items-center p-3 bg-white border rounded-2xl relative group animate-in fade-in">
                                                <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden border shrink-0">
                                                    {member.photoUrl ? (
                                                        <img src={member.photoUrl} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <User className="h-full w-full p-2 text-slate-300" />
                                                    )}
                                                </div>
                                                <div className="truncate flex-1">
                                                    <p className="text-sm font-bold text-slate-800 truncate">{member.name}</p>
                                                    <p className="text-xs text-slate-500 truncate">{member.role}</p>
                                                </div>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => removeCustomStaff(i)} className="text-red-500 hover:text-red-600 hover:bg-red-50 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Megaphone className="h-5 w-5 text-indigo-600"/> News, Announcements & Events</CardTitle>
                            <CardDescription>Compose public news, announcements, and events to display on the storefront.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Add News form */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                                <h4 className="text-sm font-bold text-slate-800">Add Bulletin Item</h4>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Title *</Label>
                                        <Input value={newsTitle} onChange={e => setNewsTitle(e.target.value)} placeholder="e.g. Annual Sports Day" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Type *</Label>
                                        <select 
                                            value={newsType} 
                                            onChange={e => setNewsType(e.target.value as any)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-bold"
                                        >
                                            <option value="News">News</option>
                                            <option value="Announcement">Announcement</option>
                                            <option value="Event">Event</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Date (Optional)</Label>
                                        <Input type="date" value={newsDate} onChange={e => setNewsDate(e.target.value)} className="font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Video URL (YouTube/Instagram)</Label>
                                        <Input value={newsVideoUrl} onChange={e => setNewsVideoUrl(e.target.value)} placeholder="e.g. https://youtube.com/watch?v=..." />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Banner Image (Optional)</Label>
                                    <div className="flex gap-2">
                                        {newsImageUrl ? (
                                            <div className="h-10 w-10 rounded-lg overflow-hidden border shrink-0 bg-slate-200">
                                                <img src={newsImageUrl} className="h-full w-full object-cover" />
                                            </div>
                                        ) : null}
                                        <Input value={newsImageUrl} onChange={e => setNewsImageUrl(e.target.value)} placeholder="Paste image URL or upload..." className="flex-1 bg-white" />
                                        <input type="file" accept="image/*" onChange={handleNewsImageUpload} className="hidden" id="news-file-input" disabled={newsImageUploading} />
                                        <Button type="button" variant="outline" asChild disabled={newsImageUploading} className="shrink-0">
                                            <label htmlFor="news-file-input" className="cursor-pointer flex items-center gap-1.5 font-bold">
                                                {newsImageUploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Upload className="h-4 w-4"/>}
                                                Upload Image
                                            </label>
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Content / Description *</Label>
                                    <Textarea value={newsContent} onChange={e => setNewsContent(e.target.value)} placeholder="Write details about the update..." rows={3} />
                                </div>
                                <Button type="button" onClick={addCustomNews} className="bg-indigo-600 hover:bg-indigo-700 text-white w-full font-bold">
                                    <Plus className="mr-2 h-4 w-4"/> Add Bulletin Item
                                </Button>
                            </div>

                            {/* News List */}
                            <div className="space-y-3">
                                <Label>Current Website Bulletins</Label>
                                {formData.customNews.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">No bulletins added yet. Create one above.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {formData.customNews.map((item, i) => (
                                            <div key={i} className="flex gap-4 p-4 bg-white border rounded-2xl relative group animate-in fade-in">
                                                {item.imageUrl ? (
                                                    <div className="h-16 w-16 rounded-xl overflow-hidden border shrink-0 bg-slate-100">
                                                        <img src={item.imageUrl} className="h-full w-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="h-16 w-16 rounded-xl bg-slate-50 border flex items-center justify-center shrink-0">
                                                        <Megaphone className="h-6 w-6 text-slate-300" />
                                                    </div>
                                                )}
                                                <div className="truncate flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-650">
                                                            {item.type}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-semibold">{item.date}</span>
                                                    </div>
                                                    <h5 className="text-sm font-bold text-slate-800 truncate mt-1">{item.title}</h5>
                                                    <p className="text-xs text-slate-500 truncate mt-0.5">{item.content}</p>
                                                    {item.videoUrl && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] text-indigo-500 font-bold mt-1">
                                                            <Video className="h-3 w-3"/> Video link attached
                                                        </span>
                                                    )}
                                                </div>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => removeCustomNews(i)} className="text-red-500 hover:text-red-650 hover:bg-red-50 absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-indigo-50 border-indigo-100">
                        <CardHeader><CardTitle className="text-sm uppercase tracking-widest text-indigo-600">Site Appearance</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Hero / Cover Image (Main Banner)</Label>
                                {formData.coverImageUrl && (
                                    <div className="aspect-video w-full rounded-xl overflow-hidden border mb-2 bg-slate-100 relative group">
                                        <img src={formData.coverImageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button type="button" variant="destructive" size="sm" onClick={() => setFormData({...formData, coverImageUrl: ''})}><Trash2 className="h-4 w-4 mr-2"/> Remove</Button>
                                        </div>
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Input value={formData.coverImageUrl} onChange={e => setFormData({...formData, coverImageUrl: e.target.value})} placeholder="Paste image URL..." className="flex-1 bg-white" />
                                    <div className="relative shrink-0">
                                        <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" id="cover-file-input" disabled={coverUploading} />
                                        <Button type="button" variant="outline" asChild disabled={coverUploading}>
                                            <label htmlFor="cover-file-input" className="cursor-pointer flex items-center gap-1.5 font-bold">
                                                {coverUploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Upload className="h-4 w-4"/>}
                                                Upload Image
                                            </label>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 pt-2 border-t border-indigo-100">
                                <div className="flex justify-between items-center">
                                    <Label className="flex items-center gap-2"><Palette className="w-4 h-4"/> Banner Background Color</Label>
                                    {formData.bannerBgColor && (
                                        <button 
                                            type="button" 
                                            onClick={() => setFormData({...formData, bannerBgColor: ''})} 
                                            className="text-xs text-red-500 hover:text-red-650 font-bold"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        type="color" 
                                        value={formData.bannerBgColor || '#0f172a'} 
                                        onChange={e => setFormData({...formData, bannerBgColor: e.target.value})} 
                                        className="h-10 w-10 rounded-lg cursor-pointer border-2 border-slate-200 shrink-0 bg-white" 
                                    />
                                    <Input 
                                        value={formData.bannerBgColor} 
                                        onChange={e => setFormData({...formData, bannerBgColor: e.target.value})} 
                                        placeholder="e.g. #0f172a" 
                                        className="font-mono uppercase text-xs font-bold bg-white" 
                                    />
                                </div>
                                <p className="text-[10px] text-indigo-650 font-semibold leading-relaxed">
                                    This color shows behind the transparent banner image overlay. Use a lighter color (like white/beige) to make the image display brightly and clearly.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-sm uppercase tracking-widest text-slate-500">Contact Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Phone className="h-3 w-3"/> Phone</Label>
                                <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Mail className="h-3 w-3"/> Email</Label>
                                <Input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><MapPin className="h-3 w-3"/> Address</Label>
                                <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="text-sm uppercase tracking-widest text-slate-500">Social Media</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-blue-600"><Facebook className="h-3 w-3"/> Facebook</Label>
                                <Input value={formData.facebookUrl} onChange={e => setFormData({...formData, facebookUrl: e.target.value})} placeholder="https://..." />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-pink-600"><Instagram className="h-3 w-3"/> Instagram</Label>
                                <Input value={formData.instagramUrl} onChange={e => setFormData({...formData, instagramUrl: e.target.value})} placeholder="https://..." />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-blue-800"><Linkedin className="h-3 w-3"/> LinkedIn</Label>
                                <Input value={formData.linkedinUrl} onChange={e => setFormData({...formData, linkedinUrl: e.target.value})} placeholder="https://..." />
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
