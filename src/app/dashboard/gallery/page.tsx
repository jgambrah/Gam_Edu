'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useMemoFirebase, useUser, useCollection } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove, orderBy } from 'firebase/firestore';
import { useRole } from '@/context/role-context';
import { useToast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { format } from 'date-fns';

// UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, Video, Heart, Trash2, PlusCircle, Search, Image as ImageIcon, 
  Play, X, Calendar, User, Sparkles, Film, Tag, Loader2, HeartHandshake, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Schema for publishing gallery items
const galleryPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(5, "Description must be at least 5 characters long"),
  category: z.enum(['Classroom', 'Sports', 'Excursions', 'Awards', 'Cultural', 'Other']),
  mediaType: z.enum(['image', 'video']),
  mediaUrl: z.string().optional(),
  fileUpload: z.string().optional(), // For base64 data URLs
}).refine(data => data.mediaUrl || data.fileUpload, {
  message: "Either provide a Media URL or upload a file",
  path: ["mediaUrl"]
});

type GalleryPostFormData = z.infer<typeof galleryPostSchema>;

interface GalleryPost {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  category: 'Classroom' | 'Sports' | 'Excursions' | 'Awards' | 'Cultural' | 'Other';
  mediaType: 'image' | 'video';
  mediaUrl: string;
  likes: number;
  likedBy?: string[];
  postedBy: string;
  postedByRole: string;
  createdAt: any;
}

// Extract YouTube ID and return an embed url
function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
}

export default function GalleryPage() {
  const { user } = useUser();
  const { role, profile } = useRole();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMediaType, setSelectedMediaType] = useState<string>('All');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [activeMediaItem, setActiveMediaItem] = useState<GalleryPost | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch gallery posts for this school, sorted by newest first
  const galleryQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId || !user) return null;
    return query(
      collection(firestore, 'gallery'),
      where('schoolId', '==', schoolId),
      orderBy('createdAt', 'desc')
    );
  }, [firestore, schoolId, user]);

  const { data: posts, isLoading } = useCollection<GalleryPost>(galleryQuery);

  // Determine permissions: Directors, Administrators, and Teachers can publish
  const canPublish = useMemo(() => {
    return role === 'Director' || role === 'Administrator' || role === 'Teacher';
  }, [role]);

  // Form setup
  const form = useForm<GalleryPostFormData>({
    resolver: zodResolver(galleryPostSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Classroom',
      mediaType: 'image',
      mediaUrl: '',
      fileUpload: '',
    }
  });

  const formMediaType = form.watch('mediaType');

  // Handle local image file upload and convert to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File Too Large',
          description: 'Please upload an image smaller than 1.5MB.'
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result as string);
        form.setValue('fileUpload', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit new gallery post
  const onSubmit = async (values: GalleryPostFormData) => {
    if (!firestore || !schoolId || !user) return;
    setIsSubmitting(true);

    try {
      let finalMediaUrl = values.mediaUrl || '';

      // If it's a video, check if it's a YouTube link and convert it to embed
      if (values.mediaType === 'video' && values.mediaUrl) {
        const ytEmbed = getYouTubeEmbedUrl(values.mediaUrl);
        if (ytEmbed) {
          finalMediaUrl = ytEmbed;
        }
      } else if (values.mediaType === 'image' && fileBase64) {
        finalMediaUrl = fileBase64;
      }

      const userName = profile 
        ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() 
        : user.displayName || user.email || 'Staff Member';

      await addDoc(collection(firestore, 'gallery'), {
        schoolId,
        title: values.title,
        description: values.description,
        category: values.category,
        mediaType: values.mediaType,
        mediaUrl: finalMediaUrl,
        likes: 0,
        likedBy: [],
        postedBy: userName,
        postedByRole: role || 'Staff',
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Media Published!",
        description: "Your gallery post is now live and visible to parents."
      });

      setIsUploadDialogOpen(false);
      form.reset();
      setFileBase64(null);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Publish Error',
        description: error.message || 'Failed to publish post.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Post Deletion
  const handleDeletePost = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening lightbox
    if (!firestore) return;

    if (confirm("Are you sure you want to delete this gallery post?")) {
      try {
        await deleteDoc(doc(firestore, 'gallery', postId));
        toast({ title: 'Post Deleted' });
        if (activeMediaItem?.id === postId) {
          setActiveMediaItem(null);
        }
      } catch (error: any) {
        toast({ variant: 'destructive', title: 'Error', description: error.message });
      }
    }
  };

  // Handle Liking a Post
  const handleLikePost = async (post: GalleryPost, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening lightbox
    if (!firestore || !user) return;

    const postRef = doc(firestore, 'gallery', post.id);
    const hasLiked = post.likedBy?.includes(user.uid);

    try {
      if (hasLiked) {
        // Unlike post
        await updateDoc(postRef, {
          likes: Math.max(0, (post.likes || 0) - 1),
          likedBy: arrayRemove(user.uid)
        });
      } else {
        // Like post
        await updateDoc(postRef, {
          likes: (post.likes || 0) + 1,
          likedBy: arrayUnion(user.uid)
        });
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // Filter posts in memory
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            post.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesMediaType = selectedMediaType === 'All' || 
                              (selectedMediaType === 'Photos' && post.mediaType === 'image') ||
                              (selectedMediaType === 'Videos' && post.mediaType === 'video');

      return matchesSearch && matchesCategory && matchesMediaType;
    });
  }, [posts, searchTerm, selectedCategory, selectedMediaType]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Premium Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-teal-650 via-teal-600 to-indigo-850 p-8 md:p-12 text-white shadow-2xl border border-teal-400/20">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl animate-pulse" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl animate-pulse" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-teal-100 backdrop-blur-md">
              <Camera className="h-3.5 w-3.5 text-teal-300" /> Life at School
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight italic uppercase leading-none">
              School <span className="text-teal-200">Gallery</span>
            </h1>
            <p className="max-w-md text-sm font-medium text-teal-50">
              Browse snapshots, activity logs, excursions, sports events, and classroom memories. Connect directly with school events.
            </p>
          </div>
          
          {canPublish && (
            <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 rounded-2xl bg-white text-teal-700 hover:bg-teal-50 font-black uppercase tracking-wider shadow-lg transition-all hover:scale-102 active:scale-98 border-none shrink-0">
                  <PlusCircle className="mr-2 h-5 w-5 text-teal-605" /> Publish Media
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-[2.5rem] border-slate-900 border-2 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black uppercase italic text-slate-800 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-teal-605" /> Publish New Media
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                  
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Title</Label>
                    <Input placeholder="e.g. Sports Day 100m Finals" {...form.register('title')} className="h-11 border-2 rounded-xl bg-slate-50 focus:ring-teal-500" />
                    {form.formState.errors.title && <span className="text-xs text-red-500 font-semibold">{form.formState.errors.title.message}</span>}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Description</Label>
                    <Textarea placeholder="Describe the memory, who participated..." {...form.register('description')} className="border-2 rounded-xl bg-slate-50 focus:ring-teal-500 min-h-[80px]" />
                    {form.formState.errors.description && <span className="text-xs text-red-500 font-semibold">{form.formState.errors.description.message}</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Category</Label>
                      <Select 
                        onValueChange={(v) => form.setValue('category', v as any)} 
                        defaultValue={form.getValues('category')}
                      >
                        <SelectTrigger className="h-11 border-2 rounded-xl bg-slate-50">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="Classroom">Classroom Activity</SelectItem>
                          <SelectItem value="Sports">Sports Activity</SelectItem>
                          <SelectItem value="Excursions">Excursions</SelectItem>
                          <SelectItem value="Awards">Awards Ceremony</SelectItem>
                          <SelectItem value="Cultural">Cultural Event</SelectItem>
                          <SelectItem value="Other">Other Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Media Type</Label>
                      <Select 
                        onValueChange={(v) => {
                          form.setValue('mediaType', v as any);
                          setFileBase64(null);
                          form.setValue('fileUpload', '');
                        }} 
                        defaultValue={form.getValues('mediaType')}
                      >
                        <SelectTrigger className="h-11 border-2 rounded-xl bg-slate-50">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="image">Photo</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formMediaType === 'image' ? (
                    <div className="space-y-3 p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Upload Image File</Label>
                      <Input type="file" accept="image/*" onChange={handleFileChange} className="h-11 bg-white border-2 border-slate-100 rounded-xl" />
                      
                      {fileBase64 ? (
                        <div className="relative h-32 w-full rounded-xl overflow-hidden border">
                          <img src={fileBase64} alt="Upload preview" className="object-cover h-full w-full" />
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-2 right-2 h-6 w-6 rounded-full"
                            onClick={() => {
                              setFileBase64(null);
                              form.setValue('fileUpload', '');
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-2 text-xs font-semibold text-slate-400 uppercase">OR PASTE DIRECT URL BELOW</div>
                      )}

                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Direct Image Link</Label>
                        <Input placeholder="https://example.com/photo.jpg" {...form.register('mediaUrl')} className="h-10 border-2 rounded-xl bg-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">YouTube Link or Direct Video MP4 URL</Label>
                      <Input placeholder="e.g. https://www.youtube.com/watch?v=..." {...form.register('mediaUrl')} className="h-11 border-2 rounded-xl bg-white focus:ring-teal-500" />
                      <p className="text-[10px] text-slate-405 font-bold uppercase mt-1">YouTube links will be converted to high-performance embed elements.</p>
                      {form.formState.errors.mediaUrl && <span className="text-xs text-red-500 font-semibold">{form.formState.errors.mediaUrl.message}</span>}
                    </div>
                  )}

                  <Button type="submit" className="w-full h-12 text-sm font-black uppercase tracking-wider bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-lg transition-all" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Publish to Gallery"}
                  </Button>

                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* FILTER PANEL */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-sm flex-shrink-0">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search moments by description..." 
            className="pl-10 pr-4 bg-white border-slate-250/80 rounded-xl h-11 focus-visible:ring-teal-500" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Media Type Toggles */}
        <Tabs defaultValue="All" value={selectedMediaType} onValueChange={setSelectedMediaType} className="w-auto shrink-0">
          <TabsList className="bg-slate-100 rounded-xl p-1 h-11 border border-slate-205/20 text-slate-500">
            <TabsTrigger value="All" className="rounded-lg text-xs font-bold px-4 h-full data-[state=active]:bg-white data-[state=active]:text-slate-805 transition-all">All Media</TabsTrigger>
            <TabsTrigger value="Photos" className="rounded-lg text-xs font-bold px-4 h-full data-[state=active]:bg-white data-[state=active]:text-slate-805 transition-all">Photos</TabsTrigger>
            <TabsTrigger value="Videos" className="rounded-lg text-xs font-bold px-4 h-full data-[state=active]:bg-white data-[state=active]:text-slate-805 transition-all">Videos</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Event Type Filters */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0 justify-end w-full md:w-auto">
          {['All', 'Classroom', 'Sports', 'Excursions', 'Awards', 'Cultural', 'Other'].map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "h-9 rounded-xl text-xs font-bold px-3 transition-all",
                selectedCategory === cat 
                  ? "bg-teal-600 hover:bg-teal-700 text-white border-none shadow-md shadow-teal-600/10" 
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              )}
            >
              {cat === 'All' ? 'All Events' : cat}
            </Button>
          ))}
        </div>

      </div>

      {/* GALLERY GRID */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 text-slate-400 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-teal-650" />
          <span className="text-sm font-semibold animate-pulse text-slate-500">Loading school gallery...</span>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post) => {
            const hasLiked = user ? post.likedBy?.includes(user.uid) : false;

            return (
              <Card 
                key={post.id} 
                className="cursor-pointer border-none shadow-lg bg-white rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                onClick={() => setActiveMediaItem(post)}
              >
                <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden flex items-center justify-center">
                  
                  {/* Image render */}
                  {post.mediaType === 'image' ? (
                    <img 
                      src={post.mediaUrl} 
                      alt={post.title} 
                      className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500" 
                      onError={(e) => {
                        // Fallback image in case link dies
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1577896851231-70ee18881784?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                  ) : (
                    // Video render
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                      {/* Show YouTube thumbnail if it is an embed link */}
                      {post.mediaUrl.includes('youtube.com/embed') ? (
                        <img 
                          src={`https://img.youtube.com/vi/${post.mediaUrl.split('/embed/')[1]?.split('?')[0]}/0.jpg`} 
                          alt={post.title} 
                          className="object-cover h-full w-full opacity-65 group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="p-4 bg-slate-800 rounded-full text-white"><Film className="h-8 w-8"/></div>
                      )}
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/35 transition-colors">
                        <div className="h-14 w-14 rounded-full bg-white/95 text-teal-700 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300">
                          <Play className="h-6 w-6 fill-current ml-1" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Category Badge overlay */}
                  <Badge className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white border-none font-bold text-[10px] uppercase py-1 px-2.5 rounded-lg">
                    {post.category}
                  </Badge>

                  {/* Edit/Trash options for staff */}
                  {canPublish && (
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-4 right-4 h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeletePost(post.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-slate-800 text-base line-clamp-1 leading-snug group-hover:text-teal-705 transition-colors">{post.title}</h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">{post.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-teal-600" />
                      <span>{post.postedBy}</span>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{post.createdAt ? format(post.createdAt.toDate(), 'dd MMM yy') : 'Just now'}</span>
                      </div>
                      
                      {/* Like button */}
                      <button 
                        onClick={(e) => handleLikePost(post, e)}
                        className={cn(
                          "flex items-center gap-1 py-1 px-2.5 rounded-lg border-2 transition-all hover:scale-105 active:scale-95",
                          hasLiked 
                            ? "bg-rose-50 border-rose-200 text-rose-600 font-extrabold" 
                            : "bg-white border-slate-150 text-slate-400"
                        )}
                      >
                        <Heart className={cn("h-3.5 w-3.5", hasLiked && "fill-current text-rose-550 animate-bounce")} />
                        <span>{post.likes || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>

              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 gap-3">
          <ImageIcon className="h-12 w-12 text-slate-300" />
          <p className="text-sm font-extrabold text-slate-450 uppercase tracking-widest">No moments matching filters.</p>
          {canPublish && <p className="text-xs font-semibold text-slate-400 uppercase">Click "Publish Media" to share a new school event.</p>}
        </div>
      )}

      {/* DETAILED LIGHTBOX / VIDEO PLAYER DIALOG */}
      {activeMediaItem && (
        <Dialog open={!!activeMediaItem} onOpenChange={(open) => !open && setActiveMediaItem(null)}>
          <DialogContent className="sm:max-w-2xl rounded-[2.5rem] border-2 border-slate-900 overflow-hidden bg-slate-950 text-white p-0">
            
            <div className="relative w-full aspect-video bg-black flex items-center justify-center border-b border-slate-800">
              
              {/* Media viewer */}
              {activeMediaItem.mediaType === 'image' ? (
                <img 
                  src={activeMediaItem.mediaUrl} 
                  alt={activeMediaItem.title} 
                  className="object-contain max-h-full max-w-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1577896851231-70ee18881784?auto=format&fit=crop&q=80&w=800";
                  }}
                />
              ) : (
                // YouTube embed iframe or HTML5 video
                activeMediaItem.mediaUrl.includes('youtube.com/embed') ? (
                  <iframe 
                    src={`${activeMediaItem.mediaUrl}?autoplay=1&mute=0`} 
                    title={activeMediaItem.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    src={activeMediaItem.mediaUrl} 
                    controls 
                    autoPlay 
                    className="w-full h-full"
                  />
                )
              )}

              {/* Close Button on Image overlays */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-4 right-4 h-9 w-9 bg-slate-900/60 backdrop-blur-md hover:bg-slate-800 text-white rounded-full"
                onClick={() => setActiveMediaItem(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-teal-500/10 border-teal-500/35 text-teal-300 font-extrabold text-[9px] uppercase rounded-lg">
                      {activeMediaItem.category}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Posted {activeMediaItem.createdAt ? format(activeMediaItem.createdAt.toDate(), 'PPPP') : 'Just now'}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold tracking-tight text-white">{activeMediaItem.title}</h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* Like in lightbox */}
                  <Button 
                    variant="outline"
                    onClick={(e) => handleLikePost(activeMediaItem, e)}
                    className={cn(
                      "h-10 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 border-2",
                      activeMediaItem.likedBy?.includes(user?.uid || '') 
                        ? "bg-rose-500 hover:bg-rose-600 text-white border-none shadow-md shadow-rose-500/20" 
                        : "bg-slate-900 border-slate-800 hover:bg-slate-855 text-slate-300"
                    )}
                  >
                    <Heart className={cn("h-4 w-4 mr-2", activeMediaItem.likedBy?.includes(user?.uid || '') && "fill-current animate-bounce")} />
                    <span>{activeMediaItem.likes || 0} Likes</span>
                  </Button>
                </div>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed font-medium bg-slate-900/50 p-4 rounded-2xl border border-slate-900">{activeMediaItem.description}</p>
              
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider pt-2">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-teal-650 flex items-center justify-center font-bold text-white text-[10px]">
                    {activeMediaItem.postedBy.substring(0,2).toUpperCase()}
                  </div>
                  <span>Published by {activeMediaItem.postedBy} ({activeMediaItem.postedByRole})</span>
                </div>
              </div>
            </div>

          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
