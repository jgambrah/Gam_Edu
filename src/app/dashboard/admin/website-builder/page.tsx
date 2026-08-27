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
  Facebook, Instagram, Linkedin, Copy, ExternalLink, Check, Upload, User, Users, Megaphone, GraduationCap, Sparkles, Star, MessageSquare, Pencil, BarChart3
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
    principalLayout: 'alongside' as 'alongside' | 'below',
    academicsOverview: '',
    academicsGrading: '',
    academicsDepartments: [] as { level: string; ageRange: string; focus: string; imageUrl?: string }[],
    admissionsGuidelines: '',
    bannerImages: [] as string[],
    academicsPillars: [] as { title: string; description: string; icon?: string }[],
    showAcademicsPillars: true,
    preschoolSeats: '',
    kgSeats: '',
    primaryLowerSeats: '',
    primaryUpperSeats: '',
    jhsSeats: '',
    hideSeatAvailability: false,
    customTestimonials: [] as { id?: string; name: string; role: string; quote: string; rating?: number; avatar?: string }[],
    hideTestimonials: false,
    hideParentPortalTeaser: false,
    showcaseTuition: '',
    showcaseLabPass: '',
    showcaseGpa: '',
    showcaseAttendance: '',
    feeStatusText: '',
    showcaseStoryText: '',
    showcaseStoryCategory: '',
    showcaseStoryAuthor: '',
    libraryBookCount: '',
    clubCount: '',
    trophyCount: '',
    labCount: '',
    hideCampusMetrics: false,
    mathScore: '',
    englishScore: '',
    scienceScore: '',
    artsScore: ''
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

  // Custom Academics Form States
  const [deptLevel, setDeptLevel] = useState('');
  const [deptAgeRange, setDeptAgeRange] = useState('');
  const [deptFocus, setDeptFocus] = useState('');
  const [deptImageUrl, setDeptImageUrl] = useState('');
  const [deptUploading, setDeptUploading] = useState(false);
  const [bannersUploading, setBannersUploading] = useState(false);

  // Custom Pillars Form States
  const [pillarTitle, setPillarTitle] = useState('');
  const [pillarDesc, setPillarDesc] = useState('');
  const [pillarIcon, setPillarIcon] = useState('BookOpen');

  // Custom Testimonials Form States
  const [testiName, setTestiName] = useState('');
  const [testiRole, setTestiRole] = useState('');
  const [testiQuote, setTestiQuote] = useState('');
  const [testiRating, setTestiRating] = useState('5');
  const [testiAvatarUrl, setTestiAvatarUrl] = useState('');
  const [testiAvatarUploading, setTestiAvatarUploading] = useState(false);
  const [editingTestiIdx, setEditingTestiIdx] = useState<number | null>(null);

  const handleTestiAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setTestiAvatarUploading(true);
    try {
      const url = await uploadSchoolMedia(file, 'testimonials');
      setTestiAvatarUrl(url);
      toast({ title: "Photo Uploaded!", description: "Author photo ready." });
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    } finally {
      setTestiAvatarUploading(false);
    }
  };

  const handleStartEditTestimonial = (index: number) => {
    const item = formData.customTestimonials[index];
    if (!item) return;
    setEditingTestiIdx(index);
    setTestiName(item.name || '');
    setTestiRole(item.role || '');
    setTestiQuote(item.quote || '');
    setTestiRating(String(item.rating || 5));
    setTestiAvatarUrl(item.avatar || '');
  };

  const handleCancelEditTestimonial = () => {
    setEditingTestiIdx(null);
    setTestiName('');
    setTestiRole('');
    setTestiQuote('');
    setTestiRating('5');
    setTestiAvatarUrl('');
  };

  const handleAddOrUpdateTestimonial = () => {
    if (!testiName.trim() || !testiQuote.trim()) {
      toast({ title: "Name & Quote Required", description: "Please enter author name and testimonial text.", variant: "destructive" });
      return;
    }

    if (editingTestiIdx !== null) {
      setFormData(prev => {
        const updated = [...prev.customTestimonials];
        updated[editingTestiIdx] = {
          ...updated[editingTestiIdx],
          name: testiName.trim(),
          role: testiRole.trim() || 'Parent',
          quote: testiQuote.trim(),
          rating: Number(testiRating) || 5,
          avatar: testiAvatarUrl
        };
        return { ...prev, customTestimonials: updated };
      });
      setEditingTestiIdx(null);
      toast({ title: "Testimonial Updated!", description: "Changes applied. Click Save & Publish Website." });
    } else {
      const newItem = {
        id: `testi-${Date.now()}`,
        name: testiName.trim(),
        role: testiRole.trim() || 'Parent',
        quote: testiQuote.trim(),
        rating: Number(testiRating) || 5,
        avatar: testiAvatarUrl
      };
      setFormData(prev => ({
        ...prev,
        customTestimonials: [...(prev.customTestimonials || []), newItem]
      }));
      toast({ title: "Testimonial Added!", description: "Review added. Click Save & Publish Website." });
    }

    setTestiName('');
    setTestiRole('');
    setTestiQuote('');
    setTestiRating('5');
    setTestiAvatarUrl('');
  };

  const handleRemoveTestimonial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customTestimonials: prev.customTestimonials.filter((_, i) => i !== index)
    }));
    if (editingTestiIdx === index) {
      handleCancelEditTestimonial();
    }
  };

  const handleClearAllTestimonials = () => {
    setFormData(prev => ({
      ...prev,
      customTestimonials: []
    }));
    handleCancelEditTestimonial();
    toast({ title: "All Reviews Cleared", description: "Default reviews erased. Add your custom parent reviews." });
  };

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
        principalLayout: schoolData.principalLayout || 'alongside',
        academicsOverview: schoolData.academicsOverview || '',
        academicsGrading: schoolData.academicsGrading || '',
        academicsDepartments: schoolData.academicsDepartments || [],
        admissionsGuidelines: schoolData.admissionsGuidelines || '',
        bannerImages: schoolData.bannerImages || [],
        academicsPillars: schoolData.academicsPillars || [],
        showAcademicsPillars: schoolData.showAcademicsPillars !== false,
        preschoolSeats: schoolData.preschoolSeats ?? '',
        kgSeats: schoolData.kgSeats ?? '',
        primaryLowerSeats: schoolData.primaryLowerSeats ?? '',
        primaryUpperSeats: schoolData.primaryUpperSeats ?? '',
        jhsSeats: schoolData.jhsSeats ?? '',
        hideSeatAvailability: schoolData.hideSeatAvailability === true,
        customTestimonials: Array.isArray(schoolData.customTestimonials) && schoolData.customTestimonials.length > 0
          ? schoolData.customTestimonials
          : (Array.isArray(schoolData.testimonials) && schoolData.testimonials.length > 0 ? schoolData.testimonials : []),
        hideTestimonials: schoolData.hideTestimonials === true,
        hideParentPortalTeaser: schoolData.hideParentPortalTeaser === true || schoolData.hidePortalPreview === true,
        showcaseTuition: schoolData.showcaseTuition || '',
        showcaseLabPass: schoolData.showcaseLabPass || '',
        showcaseGpa: schoolData.showcaseGpa || '',
        showcaseAttendance: schoolData.showcaseAttendance || schoolData.attendanceRate || '',
        feeStatusText: schoolData.feeStatusText || '',
        showcaseStoryText: schoolData.showcaseStoryText || '',
        showcaseStoryCategory: schoolData.showcaseStoryCategory || '',
        showcaseStoryAuthor: schoolData.showcaseStoryAuthor || '',
        libraryBookCount: schoolData.libraryBookCount ?? schoolData.digitalLibraryCount ?? '',
        clubCount: schoolData.clubCount ?? schoolData.studentClubsCount ?? '',
        trophyCount: schoolData.trophyCount ?? schoolData.awardsCount ?? '',
        labCount: schoolData.labCount ?? schoolData.stemWorkstationsCount ?? '',
        hideCampusMetrics: schoolData.hideCampusMetrics === true,
        mathScore: schoolData.mathScore ?? '',
        englishScore: schoolData.englishScore ?? '',
        scienceScore: schoolData.scienceScore ?? '',
        artsScore: schoolData.artsScore ?? ''
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
        await updateDoc(doc(firestore, 'schools', schoolId), { 
            ...formData,
            testimonials: formData.customTestimonials,
            customTestimonials: formData.customTestimonials,
            reviews: formData.customTestimonials,
            parentReviews: formData.customTestimonials
        });
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

  const addAcademicDept = () => {
    if (!deptLevel.trim() || !deptFocus.trim()) {
      toast({ variant: 'destructive', title: "Error", description: "Division Level and Focus Details are required." });
      return;
    }
    setFormData(prev => ({
      ...prev,
      academicsDepartments: [...(prev.academicsDepartments || []), {
        level: deptLevel.trim(),
        ageRange: deptAgeRange.trim(),
        focus: deptFocus.trim(),
        imageUrl: deptImageUrl
      }]
    }));
    setDeptLevel('');
    setDeptAgeRange('');
    setDeptFocus('');
    setDeptImageUrl('');
  };

  const handleDeptImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !schoolId) return;
    setDeptUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `schools/${schoolId}/website/academics_${Date.now()}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setDeptImageUrl(url);
      toast({ title: "Division Image Uploaded", description: "Image is ready. Click Add Division Level to save." });
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Upload Failed", description: err.message });
    } finally {
      setDeptUploading(false);
    }
  };

  const removeAcademicDept = (index: number) => {
    setFormData(prev => ({
      ...prev,
      academicsDepartments: (prev.academicsDepartments || []).filter((_, i) => i !== index)
    }));
  };

  const addPillar = () => {
    if (!pillarTitle || !pillarDesc) return;
    setFormData(prev => ({
      ...prev,
      academicsPillars: [
        ...(prev.academicsPillars || []),
        { title: pillarTitle, description: pillarDesc, icon: pillarIcon }
      ]
    }));
    setPillarTitle('');
    setPillarDesc('');
    setPillarIcon('BookOpen');
  };

  const removePillar = (index: number) => {
    setFormData(prev => ({
      ...prev,
      academicsPillars: (prev.academicsPillars || []).filter((_, i) => i !== index)
    }));
  };

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !schoolId) return;
    setBannersUploading(true);
    try {
      const storage = getStorage();
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const storageRef = ref(storage, `schools/${schoolId}/website/banner_${Date.now()}_${i}`);
        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(url);
      }
      setFormData(prev => ({
        ...prev,
        bannerImages: [...(prev.bannerImages || []), ...uploadedUrls]
      }));
      toast({ title: "Banners Uploaded", description: `${uploadedUrls.length} image(s) added to slideshow.` });
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Upload Failed", description: err.message });
    } finally {
      setBannersUploading(false);
    }
  };

  const removeBannerImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      bannerImages: (prev.bannerImages || []).filter((_, i) => i !== index)
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
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-indigo-600" /> Academics Setup
                            </CardTitle>
                            <CardDescription>Configure educational cycles, departments, and grading policy details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Academic Overview & Philosophy</Label>
                                <Textarea 
                                    value={formData.academicsOverview} 
                                    onChange={e => setFormData({...formData, academicsOverview: e.target.value})} 
                                    rows={3} 
                                    placeholder="e.g. We provide a rigorous STEM-based curriculum designed to foster critical thinking and practical innovation..." 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Grading & Assessment Policy (Optional)</Label>
                                <Textarea 
                                    value={formData.academicsGrading} 
                                    onChange={e => setFormData({...formData, academicsGrading: e.target.value})} 
                                    rows={3} 
                                    placeholder="e.g. Assessment is continuous, combining quizzes (40%) and term examinations (60%)..." 
                                    className="bg-white"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 border rounded-2xl">
                                <div className="space-y-0.5">
                                    <Label className="text-sm font-bold text-slate-800">Show Academic Resource Pillars</Label>
                                    <CardDescription className="text-xs">Display the Library, Science Labs, and Coding/STEM highlights on the storefront.</CardDescription>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={formData.showAcademicsPillars} 
                                    onChange={e => setFormData({...formData, showAcademicsPillars: e.target.checked})} 
                                    className="h-5 w-5 rounded border-slate-350 text-indigo-650 focus:ring-indigo-500 cursor-pointer" 
                                />
                            </div>

                            {/* Dynamic Departments list */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                                <h4 className="text-sm font-bold text-slate-800">Academic Divisions / Levels</h4>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-slate-600">Division Name</Label>
                                        <Input value={deptLevel} onChange={e => setDeptLevel(e.target.value)} placeholder="e.g. Senior High School" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-slate-600">Age Range</Label>
                                        <Input value={deptAgeRange} onChange={e => setDeptAgeRange(e.target.value)} placeholder="e.g. Ages 15 - 18" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-650">Division Focus & Details</Label>
                                    <Textarea value={deptFocus} onChange={e => setDeptFocus(e.target.value)} placeholder="e.g. Focus on specialized tracks in Science, Business, and Arts preparing students for WAEC examinations." rows={2} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-655">Optional Division Image (e.g. Robotics, Science Lab, Activities)</Label>
                                    <div className="flex gap-2">
                                        {deptImageUrl ? (
                                            <div className="h-10 w-10 rounded-lg overflow-hidden border shrink-0 bg-slate-200">
                                                <img src={deptImageUrl} className="h-full w-full object-cover" />
                                            </div>
                                        ) : null}
                                        <input type="file" accept="image/*" onChange={handleDeptImageUpload} className="hidden" id="dept-file-input" disabled={deptUploading} />
                                        <Button type="button" variant="outline" asChild disabled={deptUploading} className="w-full">
                                            <label htmlFor="dept-file-input" className="cursor-pointer flex items-center justify-center gap-1.5 font-bold">
                                                {deptUploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Upload className="h-4 w-4"/>}
                                                Upload Division Photo
                                            </label>
                                        </Button>
                                        {deptImageUrl && (
                                            <Button type="button" variant="destructive" size="icon" onClick={() => setDeptImageUrl('')} className="shrink-0">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <Button type="button" onClick={addAcademicDept} variant="secondary" className="w-full font-bold">
                                    <Plus className="mr-2 h-4 w-4"/> Add Division Level
                                </Button>
                            </div>

                            {/* Configured Departments List */}
                            <div className="space-y-3">
                                <Label>Configured Academic divisions</Label>
                                {formData.academicsDepartments?.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">No custom academic divisions added yet. High-fidelity defaults will be shown on the live site.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {formData.academicsDepartments?.map((dept, i) => (
                                            <div key={i} className="flex justify-between items-start p-4 bg-white border rounded-2xl relative group animate-in fade-in">
                                                <div className="flex items-center gap-3">
                                                    {dept.imageUrl && (
                                                        <div className="h-12 w-12 rounded-xl overflow-hidden border shrink-0 bg-slate-100">
                                                            <img src={dept.imageUrl} className="h-full w-full object-cover" />
                                                        </div>
                                                    )}
                                                    <div className="space-y-1">
                                                        <span className="font-bold text-slate-850 block">{dept.level} <span className="text-xs font-medium text-slate-500 font-mono ml-2">({dept.ageRange})</span></span>
                                                        <span className="text-xs text-slate-600 leading-normal block">{dept.focus}</span>
                                                    </div>
                                                </div>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => removeAcademicDept(i)} className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"><Trash2 className="h-4 w-4"/></Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Academic Resource Pillars list */}
                            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4 pt-4 border-t-2">
                                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                                    <Sparkles className="h-4 w-4 text-indigo-600"/> Academic Pillars / Special Assets
                                </h4>
                                <CardDescription className="text-xs">Configure custom school pillars (e.g. Digital Library, Science Labs, Music Studio, Swimming Pool).</CardDescription>
                                
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-slate-600">Pillar Title</Label>
                                        <Input value={pillarTitle} onChange={e => setPillarTitle(e.target.value)} placeholder="e.g. Modern Swimming Pool" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-slate-600">Icon Type</Label>
                                        <select 
                                            value={pillarIcon} 
                                            onChange={e => setPillarIcon(e.target.value)} 
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-bold"
                                        >
                                            <option value="BookOpen">📖 Book / Library</option>
                                            <option value="Atom">🔬 Atom / Science / Lab</option>
                                            <option value="Sparkles">✨ Star / Sparkles / Tech</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold text-slate-650">Pillar Description</Label>
                                    <Textarea value={pillarDesc} onChange={e => setPillarDesc(e.target.value)} placeholder="e.g. Standard sized pool for water sports and swimming lessons." rows={2} />
                                </div>
                                <Button type="button" onClick={addPillar} variant="outline" className="w-full font-bold">
                                    <Plus className="mr-2 h-4 w-4"/> Add Academic Pillar
                                </Button>
                            </div>

                            {/* Configured Pillars List */}
                            <div className="space-y-3 pt-2">
                                <Label>Configured Academic Pillars</Label>
                                {(formData.academicsPillars || []).length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">No custom academic pillars added. Default Library, Science Labs, and Coding program will be displayed.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {(formData.academicsPillars || []).map((p, i) => (
                                            <div key={i} className="flex justify-between items-center p-3 bg-white border rounded-2xl">
                                                <div>
                                                    <span className="font-bold text-slate-800 block text-sm">{p.title} <span className="text-[10px] text-slate-400 font-mono">({p.icon})</span></span>
                                                    <span className="text-xs text-slate-500 line-clamp-1">{p.description}</span>
                                                </div>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => removePillar(i)} className="text-red-500 hover:text-red-650 hover:bg-red-50 shrink-0"><Trash2 className="h-4 w-4"/></Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Megaphone className="h-5 w-5 text-indigo-600" /> Admissions Setup
                            </CardTitle>
                            <CardDescription>Share guidelines, checklists, and instructions for prospective parents filling out the admission form.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Admissions Guidelines & Requirements (Supports Markdown)</Label>
                                <Textarea 
                                    value={formData.admissionsGuidelines} 
                                    onChange={e => setFormData({...formData, admissionsGuidelines: e.target.value})} 
                                    rows={6} 
                                    placeholder="e.g. 
### Required Documents:
- Copy of Child's Birth Certificate
- Immunization card / health records
- 2 passport sized photographs
- Academic transcript from former school (for transfers)" 
                                />
                            </div>

                            <div className="pt-4 border-t space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                            <Users className="h-4 w-4 text-indigo-600" /> Class Stream Seat Vacancies (Live Enrollment Quotas)
                                        </h4>
                                        <p className="text-xs text-slate-500">Enter remaining vacant seats for each grade category to display on your public website.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="checkbox" 
                                            id="hideSeatAvailability"
                                            checked={formData.hideSeatAvailability}
                                            onChange={e => setFormData({...formData, hideSeatAvailability: e.target.checked})}
                                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <Label htmlFor="hideSeatAvailability" className="text-xs cursor-pointer font-semibold text-slate-700">Hide Vacancy Quotas Section</Label>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
                                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                        <Label className="text-xs font-bold text-slate-700 block truncate">👶 Pre-School / Creche</Label>
                                        <Input 
                                            type="number" 
                                            placeholder="e.g. 4" 
                                            value={formData.preschoolSeats} 
                                            onChange={e => setFormData({...formData, preschoolSeats: e.target.value})} 
                                            className="h-9 font-mono text-sm bg-white"
                                        />
                                    </div>

                                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                        <Label className="text-xs font-bold text-slate-700 block truncate">🎒 KG 1 & 2</Label>
                                        <Input 
                                            type="number" 
                                            placeholder="e.g. 6" 
                                            value={formData.kgSeats} 
                                            onChange={e => setFormData({...formData, kgSeats: e.target.value})} 
                                            className="h-9 font-mono text-sm bg-white"
                                        />
                                    </div>

                                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                        <Label className="text-xs font-bold text-slate-700 block truncate">📚 Primary (Lower)</Label>
                                        <Input 
                                            type="number" 
                                            placeholder="e.g. 3" 
                                            value={formData.primaryLowerSeats} 
                                            onChange={e => setFormData({...formData, primaryLowerSeats: e.target.value})} 
                                            className="h-9 font-mono text-sm bg-white"
                                        />
                                    </div>

                                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                        <Label className="text-xs font-bold text-slate-700 block truncate">✍️ Primary (Upper)</Label>
                                        <Input 
                                            type="number" 
                                            placeholder="e.g. 6" 
                                            value={formData.primaryUpperSeats} 
                                            onChange={e => setFormData({...formData, primaryUpperSeats: e.target.value})} 
                                            className="h-9 font-mono text-sm bg-white"
                                        />
                                    </div>

                                    <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                        <Label className="text-xs font-bold text-slate-700 block truncate">🎓 JHS Academy</Label>
                                        <Input 
                                            type="number" 
                                            placeholder="e.g. 2" 
                                            value={formData.jhsSeats} 
                                            onChange={e => setFormData({...formData, jhsSeats: e.target.value})} 
                                            className="h-9 font-mono text-sm bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="h-5 w-5 text-indigo-600" /> Parent & Alumni Testimonials (Reviews)
                                </CardTitle>
                                <CardDescription>Manage stories, feedback, and reviews from parents and alumni displayed on your public website.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="hideTestimonials"
                                    checked={formData.hideTestimonials}
                                    onChange={e => setFormData({...formData, hideTestimonials: e.target.checked})}
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <Label htmlFor="hideTestimonials" className="text-xs cursor-pointer font-semibold text-slate-700">Hide Testimonials Section</Label>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* New / Edit Testimonial Form */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                        {editingTestiIdx !== null ? (
                                            <><Pencil className="h-4 w-4 text-indigo-600" /> Edit Parent / Alumni Review</>
                                        ) : (
                                            <><Plus className="h-4 w-4 text-indigo-600" /> Add New Parent / Alumni Review</>
                                        )}
                                    </h4>
                                    {editingTestiIdx !== null && (
                                        <Button type="button" variant="ghost" size="sm" onClick={handleCancelEditTestimonial} className="text-xs text-slate-500 hover:text-slate-700">
                                            Cancel Editing
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Author Name *</Label>
                                        <Input 
                                            placeholder="e.g. Dr. Kwame Mensah" 
                                            value={testiName}
                                            onChange={e => setTestiName(e.target.value)}
                                            className="bg-white h-9 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Role / Grade Tag *</Label>
                                        <Input 
                                            placeholder="e.g. Parent (Grade 4 & Grade 8)" 
                                            value={testiRole}
                                            onChange={e => setTestiRole(e.target.value)}
                                            className="bg-white h-9 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Rating (1 to 5 Stars)</Label>
                                        <select 
                                            value={testiRating}
                                            onChange={e => setTestiRating(e.target.value)}
                                            className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium"
                                        >
                                            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                                            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                                            <option value="3">⭐⭐⭐ (3 Stars)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Testimonial Quote *</Label>
                                    <Textarea 
                                        placeholder="e.g. Enrolling our children here was the best decision we ever made. The balance between academic excellence and moral character building is truly exceptional." 
                                        value={testiQuote}
                                        onChange={e => setTestiQuote(e.target.value)}
                                        rows={3}
                                        className="bg-white text-sm"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                        {testiAvatarUrl ? (
                                            <div className="h-9 w-9 rounded-full overflow-hidden border shrink-0 bg-slate-200">
                                                <img src={testiAvatarUrl} className="h-full w-full object-cover" />
                                            </div>
                                        ) : null}
                                        <input type="file" accept="image/*" onChange={handleTestiAvatarUpload} className="hidden" id="testi-avatar-file" disabled={testiAvatarUploading} />
                                        <Button type="button" variant="outline" size="sm" asChild disabled={testiAvatarUploading}>
                                            <label htmlFor="testi-avatar-file" className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold">
                                                {testiAvatarUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin"/> : <Upload className="h-3.5 w-3.5"/>}
                                                {testiAvatarUrl ? 'Change Author Photo' : 'Upload Author Photo (Optional)'}
                                            </label>
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        {editingTestiIdx !== null && (
                                            <Button type="button" variant="outline" onClick={handleCancelEditTestimonial} size="sm" className="w-1/2 sm:w-auto">
                                                Cancel
                                            </Button>
                                        )}
                                        <Button type="button" onClick={handleAddOrUpdateTestimonial} size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto">
                                            {editingTestiIdx !== null ? (
                                                <><Pencil className="h-4 w-4 mr-1" /> Update Testimonial</>
                                            ) : (
                                                <><Plus className="h-4 w-4 mr-1" /> Add Testimonial</>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* List of Current Testimonials */}
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                        Active Testimonials ({formData.customTestimonials?.length || 0})
                                    </h4>
                                    {formData.customTestimonials && formData.customTestimonials.length > 0 && (
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={handleClearAllTestimonials}
                                            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 h-7"
                                        >
                                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Clear All Reviews
                                        </Button>
                                    )}
                                </div>
                                {(!formData.customTestimonials || formData.customTestimonials.length === 0) ? (
                                    <div className="p-6 text-center border-2 border-dashed rounded-xl bg-slate-50 text-slate-400 text-sm">
                                        No custom testimonials added yet. Click above to add your own parent & alumni reviews.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {formData.customTestimonials.map((t, idx) => (
                                            <div 
                                                key={t.id || idx} 
                                                className={`p-4 rounded-xl border bg-white space-y-2 relative group transition-all ${
                                                    editingTestiIdx === idx ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20' : 'border-slate-200 hover:border-indigo-200'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="h-9 w-9 rounded-full overflow-hidden bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 shrink-0 text-sm">
                                                            {t.avatar ? (
                                                                <img src={t.avatar} className="h-full w-full object-cover" />
                                                            ) : (
                                                                t.name.charAt(0)
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                                                            <div className="text-xs text-indigo-600 font-medium">{t.role}</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Button 
                                                            type="button" 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => handleStartEditTestimonial(idx)}
                                                            className="h-7 w-7 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                                                            title="Edit Testimonial"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button 
                                                            type="button" 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => handleRemoveTestimonial(idx)}
                                                            className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                            title="Delete Testimonial"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-600 italic line-clamp-3">"{t.quote}"</p>
                                                <div className="flex items-center gap-1 text-amber-400 text-xs">
                                                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                                                        <Star key={i} className="h-3 w-3 fill-amber-400" />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <LayoutTemplate className="h-5 w-5 text-indigo-600" /> Parent Portal Preview Teaser Module
                                </CardTitle>
                                <CardDescription>Customize or hide the interactive Parent Portal teaser mockup on your public website.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="hideParentPortalTeaser"
                                    checked={formData.hideParentPortalTeaser}
                                    onChange={e => setFormData({...formData, hideParentPortalTeaser: e.target.checked})}
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <Label htmlFor="hideParentPortalTeaser" className="text-xs cursor-pointer font-semibold text-slate-700">Hide Portal Teaser Section</Label>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-slate-500">
                                Customize the sample figures shown in the Parent Portal Preview Teaser mockup to match your school's actual fee structures and academic standards.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <Label className="text-xs font-bold text-slate-700">Term Tuition Amount</Label>
                                    <Input 
                                        placeholder="e.g. GH₵ 1,850.00" 
                                        value={formData.showcaseTuition} 
                                        onChange={e => setFormData({...formData, showcaseTuition: e.target.value})} 
                                        className="h-9 font-mono text-sm bg-white"
                                    />
                                </div>

                                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <Label className="text-xs font-bold text-slate-700">STEM & Lab Fee</Label>
                                    <Input 
                                        placeholder="e.g. GH₵ 250.00" 
                                        value={formData.showcaseLabPass} 
                                        onChange={e => setFormData({...formData, showcaseLabPass: e.target.value})} 
                                        className="h-9 font-mono text-sm bg-white"
                                    />
                                </div>

                                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <Label className="text-xs font-bold text-slate-700">Sample GPA / Performance</Label>
                                    <Input 
                                        placeholder="e.g. 3.92 / 4.0" 
                                        value={formData.showcaseGpa} 
                                        onChange={e => setFormData({...formData, showcaseGpa: e.target.value})} 
                                        className="h-9 font-mono text-sm bg-white"
                                    />
                                </div>

                                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <Label className="text-xs font-bold text-slate-700">Monthly Attendance Rate</Label>
                                    <Input 
                                        placeholder="e.g. 100% (22/22 Days)" 
                                        value={formData.showcaseAttendance} 
                                        onChange={e => setFormData({...formData, showcaseAttendance: e.target.value})} 
                                        className="h-9 font-mono text-sm bg-white"
                                    />
                                </div>

                                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <Label className="text-xs font-bold text-slate-700">Billing Badge Status</Label>
                                    <Input 
                                        placeholder="e.g. Status: Paid in Full" 
                                        value={formData.feeStatusText} 
                                        onChange={e => setFormData({...formData, feeStatusText: e.target.value})} 
                                        className="h-9 font-mono text-sm bg-white"
                                    />
                                </div>
                            </div>

                            <div className="pt-3 border-t space-y-3">
                                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    📸 Classroom Daily Photo Feed Highlight
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Feed Category Badge</Label>
                                        <Input 
                                            placeholder="e.g. STEM Workshop" 
                                            value={formData.showcaseStoryCategory} 
                                            onChange={e => setFormData({...formData, showcaseStoryCategory: e.target.value})} 
                                            className="bg-white h-9 text-sm"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold">Educator / Author Name</Label>
                                        <Input 
                                            placeholder="e.g. Lead Educator" 
                                            value={formData.showcaseStoryAuthor} 
                                            onChange={e => setFormData({...formData, showcaseStoryAuthor: e.target.value})} 
                                            className="bg-white h-9 text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-semibold">Class Story Highlight Text</Label>
                                    <Textarea 
                                        placeholder="e.g. Students successfully assembled their first solar-powered vehicle prototypes in today's STEM workshop!" 
                                        value={formData.showcaseStoryText} 
                                        onChange={e => setFormData({...formData, showcaseStoryText: e.target.value})} 
                                        rows={2} 
                                        className="bg-white text-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-3 border-t space-y-3">
                                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    📊 Continuous Assessment Overview Scores (%)
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                    <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                        <Label className="text-xs font-semibold">Maths & STEM Score</Label>
                                        <Input 
                                            type="number"
                                            placeholder="e.g. 96" 
                                            value={formData.mathScore} 
                                            onChange={e => setFormData({...formData, mathScore: e.target.value})} 
                                            className="bg-white h-8 text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                        <Label className="text-xs font-semibold">English Score</Label>
                                        <Input 
                                            type="number"
                                            placeholder="e.g. 91" 
                                            value={formData.englishScore} 
                                            onChange={e => setFormData({...formData, englishScore: e.target.value})} 
                                            className="bg-white h-8 text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                        <Label className="text-xs font-semibold">Science Score</Label>
                                        <Input 
                                            type="number"
                                            placeholder="e.g. 94" 
                                            value={formData.scienceScore} 
                                            onChange={e => setFormData({...formData, scienceScore: e.target.value})} 
                                            className="bg-white h-8 text-xs font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                        <Label className="text-xs font-semibold">Creative Arts Score</Label>
                                        <Input 
                                            type="number"
                                            placeholder="e.g. 88" 
                                            value={formData.artsScore} 
                                            onChange={e => setFormData({...formData, artsScore: e.target.value})} 
                                            className="bg-white h-8 text-xs font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-indigo-600" /> Live Campus System Metrics
                                </CardTitle>
                                <CardDescription>Display real-time campus statistics and system counts pulled from your ERP or custom numbers.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="hideCampusMetrics"
                                    checked={formData.hideCampusMetrics}
                                    onChange={e => setFormData({...formData, hideCampusMetrics: e.target.checked})}
                                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <Label htmlFor="hideCampusMetrics" className="text-xs cursor-pointer font-semibold text-slate-700">Hide System Metrics Bar</Label>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-slate-500">
                                Enter your actual facility and resource counts below. Leave empty to automatically display numbers cataloged in your GAM Edu ERP system!
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <Label className="text-xs font-bold text-slate-700">Digital Library Collections</Label>
                                    <Input 
                                        type="number" 
                                        placeholder="e.g. 4520" 
                                        value={formData.libraryBookCount} 
                                        onChange={e => setFormData({...formData, libraryBookCount: e.target.value})} 
                                        className="h-9 font-mono text-sm bg-white"
                                    />
                                </div>

                                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <Label className="text-xs font-bold text-slate-700">Student Clubs & Societies</Label>
                                    <Input 
                                        type="number" 
                                        placeholder="e.g. 12" 
                                        value={formData.clubCount} 
                                        onChange={e => setFormData({...formData, clubCount: e.target.value})} 
                                        className="h-9 font-mono text-sm bg-white"
                                    />
                                </div>

                                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <Label className="text-xs font-bold text-slate-700">Academic & Sports Awards</Label>
                                    <Input 
                                        type="number" 
                                        placeholder="e.g. 38" 
                                        value={formData.trophyCount} 
                                        onChange={e => setFormData({...formData, trophyCount: e.target.value})} 
                                        className="h-9 font-mono text-sm bg-white"
                                    />
                                </div>

                                <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                                    <Label className="text-xs font-bold text-slate-700">STEM & Robotics Workstations</Label>
                                    <Input 
                                        type="number" 
                                        placeholder="e.g. 45" 
                                        value={formData.labCount} 
                                        onChange={e => setFormData({...formData, labCount: e.target.value})} 
                                        className="h-9 font-mono text-sm bg-white"
                                    />
                                </div>
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
                            
                            <div className="space-y-2 pt-4 border-t border-indigo-100">
                                <Label className="flex items-center gap-2">Hero Slideshow Banner Images (Carousel)</Label>
                                <CardDescription className="text-xs">Upload several images. The live homepage banner will rotate these smoothly every 12 seconds to make the page look alive.</CardDescription>
                                
                                <div className="grid grid-cols-2 gap-2 pt-2">
                                    {(formData.bannerImages || []).map((img, i) => (
                                        <div key={i} className="relative aspect-video rounded-xl overflow-hidden border group bg-slate-100">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <button 
                                                type="button" 
                                                onClick={() => removeBannerImage(i)} 
                                                className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity active:scale-95 shadow-lg"
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className="relative pt-2">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        multiple 
                                        onChange={handleBannerImageUpload} 
                                        className="hidden" 
                                        id="slideshow-file-input" 
                                        disabled={bannersUploading} 
                                    />
                                    <Button type="button" variant="outline" asChild disabled={bannersUploading} className="w-full">
                                        <label htmlFor="slideshow-file-input" className="cursor-pointer flex items-center justify-center gap-1.5 font-bold">
                                            {bannersUploading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Upload className="h-4 w-4"/>}
                                            Upload Slideshow Photos
                                        </label>
                                    </Button>
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
