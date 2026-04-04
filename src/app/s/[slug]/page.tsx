'use client';
import { use, useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { AdmissionForm } from '@/components/public/AdmissionForm';
import { 
  Loader2, MapPin, Phone, Mail, CheckCircle2, Globe, 
  Camera, Play, Info, Facebook, Instagram, Linkedin, Video 
} from 'lucide-react';

export default function PublicSchoolPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const firestore = useFirestore();
    const[school, setSchool] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-blue-600"/></div>;
    if (!school) return <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-slate-500">School Not Found.</div>;

    const brandColor = school.primaryColor || '#2563eb';

    const getYouTubeId = (url: string) => {
        const match = url?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoUrls = school.videoUrls || (school.youtubeUrl ? [school.youtubeUrl] : []);

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* NAVBAR */}
            <nav className="bg-white/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center sticky top-0 z-[100]">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black tracking-tight" style={{ color: brandColor }}>{school.name}</h1>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-500">
                    <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
                    {videoUrls.length > 0 && <a href="#videos" className="hover:text-slate-900 transition-colors">Videos</a>}
                    {school.gallery?.length > 0 && <a href="#gallery" className="hover:text-slate-900 transition-colors">Gallery</a>}
                    <a href="#apply" className="px-6 py-2 rounded-full text-white transition-opacity hover:opacity-90" style={{ backgroundColor: brandColor }}>
                        Enroll Now
                    </a>
                </div>
            </nav>

            {/* HERO SECTION */}
            <div className="relative h-[500px] md:h-[700px] w-full bg-slate-900 flex items-center justify-center text-center px-4 overflow-hidden">
                {school.coverImageUrl && (
                    <img src={school.coverImageUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-50 scale-105" />
                )}
                <div className="relative z-10 max-w-4xl space-y-6">
                    <h2 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase italic">
                        {school.name}
                    </h2>
                    <div className="h-2 w-24 mx-auto rounded-full" style={{ backgroundColor: brandColor }} />
                    <p className="text-xl md:text-2xl text-slate-200 font-medium max-w-2xl mx-auto drop-shadow-lg">{school.motto}</p>
                    <div className="pt-8">
                        <a href="#apply" className="px-12 py-5 rounded-2xl text-white text-xl font-black uppercase tracking-tighter shadow-2xl transition-transform hover:scale-105 active:scale-95 inline-block" style={{ backgroundColor: brandColor }}>
                            Start Application
                        </a>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-6 py-24 space-y-32">
                
                {/* SECTION: ABOUT */}
                <section id="about" className="grid md:grid-cols-2 gap-20 items-start">
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

                {/* SECTION: VIDEOS */}
                {videoUrls.length > 0 && (
                    <section id="videos" className="space-y-12">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                <Video className="h-3 w-3" /> Media Library
                            </div>
                            <h3 className="text-5xl font-black uppercase italic tracking-tighter">Video Showcase</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {videoUrls.map((url: string, i: number) => {
                                const ytId = getYouTubeId(url);
                                if (!ytId) return null;
                                return (
                                    <div key={i} className="rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video border-[12px] border-slate-50 ring-1 ring-slate-200 bg-black">
                                        <iframe 
                                            width="100%" height="100%" 
                                            src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`} 
                                            title={`Promo Video ${i+1}`} 
                                            frameBorder="0" allowFullScreen
                                        ></iframe>
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
                                <Camera className="h-3 w-3" /> Snapshot
                            </div>
                            <h3 className="text-5xl font-black uppercase italic tracking-tighter">Life at {school.name}</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {school.gallery.map((url: string, i: number) => (
                                <div key={i} className="rounded-3xl overflow-hidden aspect-square shadow-xl border-4 border-white ring-1 ring-slate-100 hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
                                    <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
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
                            <p className="text-xl text-slate-500 font-medium">Join our community of learners. Fill out the enquiry form below and our admissions team will reach out to schedule a tour.</p>
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
