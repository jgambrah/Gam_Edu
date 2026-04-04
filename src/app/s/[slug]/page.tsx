
'use client';
import { use, useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { AdmissionForm } from '@/components/public/AdmissionForm';
import { Loader2, MapPin, Phone, Mail, CheckCircle2, Globe } from 'lucide-react';

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

    // Extract YT ID for embed
    const ytMatch = school.youtubeUrl?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    const ytId = (ytMatch && ytMatch[2].length === 11) ? ytMatch[2] : null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* NAVBAR */}
            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <h1 className="text-2xl font-black" style={{ color: brandColor }}>{school.name}</h1>
                <a href="#apply" className="px-6 py-2 rounded-full text-white font-bold transition-opacity hover:opacity-90" style={{ backgroundColor: brandColor }}>
                    Apply Now
                </a>
            </nav>

            {/* HERO SECTION */}
            <div className="relative h-[400px] md:h-[500px] w-full bg-slate-900 flex items-center justify-center text-center px-4">
                {school.coverImageUrl && (
                    <img src={school.coverImageUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                )}
                <div className="relative z-10 max-w-3xl">
                    <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                        Welcome to <br/><span style={{ color: brandColor }}>{school.name}</span>
                    </h2>
                    <p className="text-xl text-slate-200 font-medium max-w-2xl mx-auto">{school.motto}</p>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-16">
                
                {/* Left: About Us */}
                <div className="space-y-12">
                    <section>
                        <h3 className="text-3xl font-bold mb-4" style={{ color: brandColor }}>About Us</h3>
                        <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">{school.aboutText || "Welcome to our institution."}</p>
                    </section>

                    <div className="grid sm:grid-cols-2 gap-8">
                        {school.mission && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4" style={{ borderColor: brandColor }}>
                                <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><CheckCircle2 style={{ color: brandColor }}/> Mission</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{school.mission}</p>
                            </div>
                        )}
                        {school.vision && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border-t-4" style={{ borderColor: brandColor }}>
                                <h4 className="font-bold text-lg mb-2 flex items-center gap-2"><Globe style={{ color: brandColor }}/> Vision</h4>
                                <p className="text-slate-600 text-sm leading-relaxed">{school.vision}</p>
                            </div>
                        )}
                    </div>

                    {ytId && (
                        <section className="rounded-2xl overflow-hidden shadow-xl aspect-video border-4 border-white">
                            <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${ytId}`} title="Promo Video" frameBorder="0" allowFullScreen></iframe>
                        </section>
                    )}
                </div>

                {/* Right: Admission Form & Contact */}
                <div className="space-y-8" id="apply">
                    <AdmissionForm schoolId={school.id} primaryColor={brandColor} />
                    
                    <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl space-y-4">
                        <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                        <div className="flex items-center gap-3 text-slate-300"><MapPin className="h-5 w-5 text-slate-400"/> {school.address || "Address not provided"}</div>
                        <div className="flex items-center gap-3 text-slate-300"><Phone className="h-5 w-5 text-slate-400"/> {school.phone || "Phone not provided"}</div>
                        <div className="flex items-center gap-3 text-slate-300"><Mail className="h-5 w-5 text-slate-400"/> {school.email || "Email not provided"}</div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-slate-950 text-slate-500 py-8 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} {school.name}. All rights reserved.</p>
                <p className="mt-2">Powered by <a href="/" className="text-slate-300 hover:text-white font-bold transition-colors">GAM Edu</a></p>
            </footer>
        </div>
    );
}
