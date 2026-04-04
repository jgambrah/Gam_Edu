'use client';
import { use, useState, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { AdmissionForm } from '@/components/public/AdmissionForm';
import { 
  Loader2, MapPin, Phone, Mail, CheckCircle2, Globe, 
  Camera, Play, Info, Facebook, Instagram, Linkedin, Video,
  Megaphone, Calendar, ArrowRight, Sparkles, GraduationCap, Heart, FileText, User
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function PublicSchoolPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const firestore = useFirestore();
    const [school, setSchool] = useState<any>(null);
    const [team, setTeam] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch School Data by Slug
    useEffect(() => {
        const fetchSchool = async () => {
            if (!firestore || !slug) return;
            try {
                const q = query(collection(firestore, 'schools'), where('slug', '==', slug));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    setSchool({ id: snap.docs[0].id, ...snap.docs[0].data() });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSchool();
    }, [firestore, slug]);

    // 2. Fetch Public Announcements
    const announcementsQuery = useMemoFirebase(() => {
        if (!firestore || !school?.id) return null;
        return query(
            collection(firestore, 'announcements_v2'),
            where('schoolId', '==', school.id),
            where('audience', 'array-contains', 'Everybody'),
            orderBy('publishedAt', 'desc'),
            limit(3)
        );
    }, [firestore, school?.id]);
    
    const { data: announcements } = useCollection<any>(announcementsQuery);

    // 3. Fetch Public Team
    useEffect(() => {
        const fetchTeam = async () => {
            if (!firestore || !school?.id) return;
            try {
                const q = query(
                    collection(firestore, 'staff'), 
                    where('schoolId', '==', school.id),
                    where('showOnWebsite', '==', true)
                );
                const snap = await getDocs(q);
                const staffData = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => {
                    if (a.role === 'Director') return -1;
                    if (b.role === 'Director') return 1;
                    return 0;
                });
                setTeam(staffData);
            } catch (err) {
                console.error("Failed to load team:", err);
            }
        };
        if (school) fetchTeam();
    }, [firestore, school]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="h-10 w-10 animate-spin text-indigo-600"/></div>;
    if (!school) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-slate-500">School Not Found.</div>;

    const brandColor = school.primaryColor || '#2563eb';

    const getYouTubeId = (url: string) => {
        const match = url?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const scrollToForm = () => {
        document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* NAVBAR */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center sticky top-0 z-[100]">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black tracking-tight" style={{ color: brandColor }}>{school.name}</h1>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-500">
                    <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
                    {team.length > 0 && <a href="#team" className="hover:text-slate-900 transition-colors">Team</a>}
                    {announcements && announcements.length > 0 && <a href="#news" className="hover:text-slate-900 transition-colors">News</a>}
                    {school.gallery?.length > 0 && <a href="#gallery" className="hover:text-slate-900 transition-colors">Gallery</a>}
                    <button 
                        onClick={scrollToForm}
                        className="px-6 py-2 rounded-full text-white transition-opacity hover:opacity-90 font-black uppercase text-xs tracking-widest" 
                        style={{ backgroundColor: brandColor }}
                    >
                        Enroll Now
                    </button>
                </div>
            </nav>

            {/* HERO SECTION */}
            <div className="relative h-[500px] md:h-[700px] w-full bg-slate-900 flex items-center justify-center text-center px-4 overflow-hidden">
                {school.coverImageUrl && (
                    <img src={school.coverImageUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105" />
                )}
                <div className="relative z-10 max-w-4xl space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                        <Sparkles className="h-3 w-3 text-yellow-400" /> Admissions Open
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase italic drop-shadow-2xl">
                        {school.name}
                    </h2>
                    <div className="h-2 w-24 mx-auto rounded-full" style={{ backgroundColor: brandColor }} />
                    <p className="text-xl md:text-2xl text-slate-200 font-medium max-w-2xl mx-auto drop-shadow-lg">{school.motto}</p>
                    <div className="pt-8">
                        <button 
                            onClick={scrollToForm}
                            className="px-12 py-5 rounded-2xl text-white text-xl font-black uppercase tracking-tighter shadow-2xl transition-transform hover:scale-105 active:scale-95 inline-block" 
                            style={{ backgroundColor: brandColor }}
                        >
                            Start Online Application
                        </button>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
                
                {/* SECTION: ABOUT */}
                <section id="about" className="grid md:grid-cols-2 gap-20 items-start border-b pb-24 border-slate-100">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                            <Info className="h-3 w-3" /> Discover Our School
                        </div>
                        <h3 className="text-5xl font-black tracking-tight" style={{ color: brandColor }}>Welcome to Our Campus</h3>
                        <p className="text-xl text-slate-600 leading-relaxed whitespace-pre-wrap">{school.aboutText || "Welcome to our institution where excellence is standard."}</p>
                        
                        <div className="grid sm:grid-cols-2 gap-6 pt-4">
                            {school.mission && (
                                <div className="bg-slate-50 p-8 rounded-3xl border-l-8" style={{ borderColor: brandColor }}>
                                    <h4 className="font-black text-xs uppercase tracking-widest mb-3 opacity-50">Our Mission</h4>
                                    <p className="text-slate-800 font-bold leading-relaxed">{school.mission}</p>
                                </div>
                            )}
                            {school.vision && (
                                <div className="bg-slate-50 p-8 rounded-3xl border-l-8" style={{ borderColor: brandColor }}>
                                    <h4 className="font-black text-xs uppercase tracking-widest mb-3 opacity-50">Our Vision</h4>
                                    <p className="text-slate-800 font-bold leading-relaxed">{school.vision}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-xl space-y-8 sticky top-32">
                        <h3 className="text-3xl font-black uppercase italic tracking-tighter">Get in Touch</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 text-slate-300">
                                <MapPin className="h-6 w-6 text-indigo-400 shrink-0"/> 
                                <span className="font-bold text-lg">{school.address || "Address not provided"}</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-300">
                                <Phone className="h-6 w-6 text-indigo-400 shrink-0"/> 
                                <span className="font-bold text-lg">{school.phone || "Phone not provided"}</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-300">
                                <Mail className="h-6 w-6 text-indigo-400 shrink-0"/> 
                                <span className="font-bold text-lg">{school.email || "Email not provided"}</span>
                            </div>
                        </div>
                        
                        {(school.facebookUrl || school.instagramUrl || school.linkedinUrl) && (
                            <div className="flex gap-4 pt-6 border-t border-slate-800">
                                {school.facebookUrl && (
                                    <a href={school.facebookUrl} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 rounded-full hover:bg-blue-600 transition-colors">
                                        <Facebook className="h-6 w-6" />
                                    </a>
                                )}
                                {school.instagramUrl && (
                                    <a href={school.instagramUrl} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 rounded-full hover:bg-pink-600 transition-colors">
                                        <Instagram className="h-6 w-6" />
                                    </a>
                                )}
                                {school.linkedinUrl && (
                                    <a href={school.linkedinUrl} target="_blank" rel="noreferrer" className="p-3 bg-slate-800 rounded-full hover:bg-blue-800 transition-colors">
                                        <Linkedin className="h-6 w-6" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* SECTION: TEAM */}
                {team.length > 0 && (
                    <section id="team" className="space-y-12">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                <Users className="h-3 w-3" /> Staff Directory
                            </div>
                            <h3 className="text-5xl font-black uppercase italic tracking-tighter" style={{ color: brandColor }}>Meet Our Educators</h3>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {team.map(member => (
                                <div key={member.id} className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden hover:-translate-y-2 transition-transform duration-300 group">
                                    <div className="h-72 bg-slate-100 w-full overflow-hidden flex items-center justify-center relative">
                                        {member.publicPhotoUrl ? (
                                            <img src={member.publicPhotoUrl} alt={member.firstName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <User className="h-24 w-24 text-slate-300 opacity-20" />
                                        )}
                                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-white" style={{ color: brandColor }}>
                                            {member.role}
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-5">
                                        <div>
                                            <h4 className="text-2xl font-black text-slate-800 tracking-tight">{member.firstName} {member.lastName}</h4>
                                            {member.qualifications && (
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                                                    <GraduationCap size={14} style={{ color: brandColor }} /> {member.qualifications}
                                                </p>
                                            )}
                                        </div>
                                        {member.publicBio && (
                                            <p className="text-sm text-slate-500 leading-relaxed border-l-4 pl-4 italic" style={{ borderColor: `${brandColor}40` }}>
                                                "{member.publicBio}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SECTION: VIDEOS */}
                {school.videoUrls?.length > 0 && (
                    <section id="videos" className="space-y-12">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                <Video className="h-3 w-3" /> Media Library
                            </div>
                            <h3 className="text-5xl font-black uppercase italic tracking-tighter" style={{ color: brandColor }}>Video Showcase</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            {school.videoUrls.map((video: any, i: number) => {
                                const ytId = getYouTubeId(video.url || video);
                                if (!ytId) return null;
                                return (
                                    <div key={i} className="space-y-4">
                                        <div className="rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video border-[12px] border-slate-50 ring-1 ring-slate-200 bg-black">
                                            <iframe 
                                                width="100%" height="100%" 
                                                src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`} 
                                                title={`Video ${i+1}`} 
                                                frameBorder="0" allowFullScreen
                                            ></iframe>
                                        </div>
                                        {video.title && (
                                            <div className="px-4 text-center">
                                                <h4 className="text-xl font-bold text-slate-800">{video.title}</h4>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* SECTION: GALLERY */}
                {school.gallery?.length > 0 && (
                    <section id="gallery" className="space-y-12">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                <Camera className="h-3 w-3" /> Snapshots
                            </div>
                            <h3 className="text-5xl font-black uppercase italic tracking-tighter" style={{ color: brandColor }}>Life at {school.name}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {school.gallery.map((item: any, i: number) => (
                                <div key={i} className="group space-y-4">
                                    <div className="rounded-3xl overflow-hidden aspect-square shadow-xl border-4 border-white ring-1 ring-slate-100 hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
                                        <img src={item.url || item} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    {item.caption && (
                                        <p className="text-sm font-medium text-slate-500 text-center px-4 italic leading-relaxed">
                                            "{item.caption}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SECTION: NEWS */}
                {announcements && announcements.length > 0 && (
                    <section id="news" className="space-y-12">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                <Megaphone className="h-3 w-3" /> Bulletins
                            </div>
                            <h3 className="text-5xl font-black uppercase italic tracking-tighter" style={{ color: brandColor }}>News & Updates</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {announcements.map((news: any) => (
                                <div key={news.id} className="bg-white border rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all border-slate-100 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-4">
                                        <Badge variant="outline" className="uppercase text-[9px] font-black tracking-widest">
                                            {news.priority || 'Normal'}
                                        </Badge>
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                            <Calendar className="h-3 w-3"/>
                                            {news.publishedAt ? format(news.publishedAt.toDate(), 'dd MMM yyyy') : 'Just now'}
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-black text-slate-800 leading-tight mb-4">{news.title}</h4>
                                    <p className="text-sm text-slate-500 line-clamp-4 leading-relaxed mb-6 flex-1 italic">
                                        "{news.content}"
                                    </p>
                                    <div className="pt-4 border-t border-slate-50 mt-auto">
                                        <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2">
                                            Official Update <ArrowRight className="h-3 w-3"/>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* SECTION: ADMISSIONS */}
                <section id="apply" className="bg-slate-50 rounded-[4rem] p-12 md:p-24 border-2 border-slate-100 shadow-inner">
                    <div className="max-w-3xl mx-auto text-center space-y-12">
                        <div className="space-y-4">
                            <h3 className="text-6xl font-black tracking-tighter uppercase italic" style={{ color: brandColor }}>Enroll Today</h3>
                            <p className="text-xl text-slate-500 font-medium">Join our community. Fill out the enquiry form below.</p>
                        </div>
                        <AdmissionForm schoolId={school.id} primaryColor={brandColor} />
                    </div>
                </section>
            </div>

            {/* FOOTER */}
            <footer className="bg-slate-900 text-slate-500 py-16 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h4 className="text-white text-2xl font-black uppercase italic mb-2">{school.name}</h4>
                        <p className="text-sm font-medium">Empowering minds, shaping futures.</p>
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest">&copy; {new Date().getFullYear()} {school.name}</p>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                        <Globe className="h-3 w-3" />
                        <span>Powered by GAM Edu</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
