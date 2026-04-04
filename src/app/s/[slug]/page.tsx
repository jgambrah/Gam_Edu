'use client';
import { use, useState, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { AdmissionForm } from '@/components/public/AdmissionForm';
import {
  Loader2, MapPin, Phone, Mail, Globe,
  Camera, Info, Facebook, Instagram, Linkedin, Video,
  Megaphone, Calendar, ArrowRight, Sparkles, GraduationCap,
  User, Users, ChevronDown, Star, BookOpen, Award
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

// ─── helpers ────────────────────────────────────────────────
function getYouTubeId(url: string) {
  const m = url?.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return m && m[2].length === 11 ? m[2] : null;
}

// ─── stat pill ──────────────────────────────────────────────
function StatPill({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-6">
      <Icon className="h-6 w-6 text-white/70" />
      <span className="text-3xl font-black text-white">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">{label}</span>
    </div>
  );
}

// ─── section header ─────────────────────────────────────────
function SectionHeader({ eyebrow, title, color }: any) {
  return (
    <div className="text-center space-y-3 mb-16">
      <span
        className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border"
        style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}
      >
        {eyebrow}
      </span>
      <h2 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color }}>
        {title}
      </h2>
    </div>
  );
}

// ════════════════════════════════════════════════════════════
export default function PublicSchoolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const firestore = useFirestore();
  const [school, setSchool] = useState<any>(null);
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [navScrolled, setNavScrolled] = useState(false);

  // scroll detection for nav
  useEffect(() => {
    const handler = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // fetch school by slug
  useEffect(() => {
    const fetch_ = async () => {
      if (!firestore || !slug) return;
      try {
        const snap = await getDocs(query(collection(firestore, 'schools'), where('slug', '==', slug)));
        if (!snap.empty) setSchool({ id: snap.docs[0].id, ...snap.docs[0].data() });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch_();
  }, [firestore, slug]);

  // fetch announcements
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

  // fetch team
  useEffect(() => {
    if (!firestore || !school?.id) return;
    const fetch_ = async () => {
      try {
        const snap = await getDocs(
          query(collection(firestore, 'staff'),
            where('schoolId', '==', school.id),
            where('showOnWebsite', '==', true))
        );
        setTeam(
          snap.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .sort((a: any, b: any) => (a.role === 'Director' ? -1 : b.role === 'Director' ? 1 : 0))
        );
      } catch (e) { console.error(e); }
    };
    fetch_();
  }, [firestore, school?.id]);

  // ── loading / not found ────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
    </div>
  );
  if (!school) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-2xl font-black text-slate-500">
      School not found.
    </div>
  );

  const brand = school.primaryColor || '#4f46e5';

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const navLinks = [
    { label: 'About', id: 'about' },
    team.length > 0 && { label: 'Team', id: 'team' },
    announcements && announcements.length > 0 && { label: 'News', id: 'news' },
    school.gallery?.length > 0 && { label: 'Gallery', id: 'gallery' },
  ].filter(Boolean) as { label: string; id: string }[];

  // ── render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,700;0,9..40,900;1,9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');
        .serif { font-family: 'DM Serif Display', Georgia, serif; }
        html { scroll-behavior: smooth; }
        .hero-grain::after {
          content:''; position:absolute; inset:0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events:none; z-index:2;
        }
        .card-hover { transition: transform 0.3s cubic-bezier(.22,.68,0,1.2), box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 24px 48px -12px rgba(0,0,0,0.15); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
      `}</style>

      {/* ─── NAV ────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        navScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* logo / name */}
          <div className="flex items-center gap-3">
            {school.logoUrl && (
              <img src={school.logoUrl} alt="Logo" className="h-10 w-10 object-contain rounded-xl" />
            )}
            <span
              className="text-xl font-black tracking-tight"
              style={{ color: navScrolled ? brand : 'white' }}
            >
              {school.name}
            </span>
          </div>

          {/* links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-sm font-bold uppercase tracking-widest transition-colors ${
                  navScrolled ? 'text-slate-500 hover:text-slate-900' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('apply')}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-black uppercase tracking-widest transition-opacity hover:opacity-90 shadow-lg"
              style={{ backgroundColor: brand }}
            >
              Apply Now
            </button>
          </div>
        </div>
      </nav>

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden hero-grain bg-slate-950">
        {/* cover image */}
        {school.coverImageUrl && (
          <img
            src={school.coverImageUrl}
            alt="Campus"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}

        {/* gradient overlay */}
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: `radial-gradient(ellipse at 60% 40%, ${brand}55 0%, transparent 70%)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/20 to-slate-950/80" />

        {/* content */}
        <div className="relative z-10 max-w-5xl fade-up space-y-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
            <Sparkles className="h-3 w-3 text-yellow-400" /> Admissions Open
          </span>

          <h1 className="serif text-6xl md:text-9xl text-white leading-none italic drop-shadow-2xl">
            {school.name}
          </h1>

          {school.motto && (
            <p className="text-xl md:text-2xl text-white/70 font-medium max-w-2xl mx-auto">
              {school.motto}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => scrollTo('apply')}
              className="px-10 py-4 rounded-2xl text-white text-lg font-black uppercase tracking-tight shadow-2xl transition-transform hover:scale-105 active:scale-95"
              style={{ backgroundColor: brand }}
            >
              Start Application
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="px-10 py-4 rounded-2xl bg-white/10 border border-white/30 text-white text-lg font-black uppercase tracking-tight backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40">
          <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </section>

      {/* ─── STATS BAR ──────────────────────────────────────── */}
      {(school.studentCount || school.staffCount || school.yearsEstablished || school.programCount) && (
        <div className="py-12 px-6" style={{ backgroundColor: brand }}>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            {school.studentCount && <StatPill icon={Users} label="Students" value={school.studentCount} color={brand} />}
            {school.staffCount && <StatPill icon={User} label="Staff" value={school.staffCount} color={brand} />}
            {school.yearsEstablished && <StatPill icon={Award} label="Years Est." value={school.yearsEstablished} color={brand} />}
            {school.programCount && <StatPill icon={BookOpen} label="Programs" value={school.programCount} color={brand} />}
          </div>
        </div>
      )}

      {/* ─── ABOUT ──────────────────────────────────────────── */}
      <section id="about" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-start">

          {/* text */}
          <div className="space-y-10">
            <div>
              <span
                className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border mb-4"
                style={{ color: brand, borderColor: `${brand}40`, backgroundColor: `${brand}10` }}
              >
                About Us
              </span>
              <h2 className="serif text-5xl md:text-6xl italic leading-tight mb-6" style={{ color: brand }}>
                Welcome to Our Campus
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                {school.aboutText || 'Welcome to our institution where excellence is the standard and every student is empowered to thrive.'}
              </p>
            </div>

            {/* mission / vision */}
            {(school.mission || school.vision) && (
              <div className="grid sm:grid-cols-2 gap-6">
                {school.mission && (
                  <div className="p-8 rounded-3xl bg-slate-50 border-l-4" style={{ borderColor: brand }}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Mission</p>
                    <p className="text-slate-800 font-semibold leading-relaxed">{school.mission}</p>
                  </div>
                )}
                {school.vision && (
                  <div className="p-8 rounded-3xl bg-slate-50 border-l-4" style={{ borderColor: brand }}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Vision</p>
                    <p className="text-slate-800 font-semibold leading-relaxed">{school.vision}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* contact card */}
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl sticky top-32">
            {/* card header */}
            <div className="p-10 text-white" style={{ backgroundColor: brand }}>
              <h3 className="serif text-3xl italic mb-1">Get In Touch</h3>
              <p className="text-white/70 text-sm font-medium">We'd love to hear from you</p>
            </div>

            {/* card body */}
            <div className="bg-slate-900 p-10 space-y-6">
              {[
                { Icon: MapPin, value: school.address, label: 'Address' },
                { Icon: Phone, value: school.phone, label: 'Phone' },
                { Icon: Mail, value: school.email, label: 'Email' },
              ].filter(x => x.value).map(({ Icon, value, label }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${brand}25` }}>
                    <Icon className="h-5 w-5" style={{ color: brand }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">{label}</p>
                    <p className="text-white font-semibold">{value}</p>
                  </div>
                </div>
              ))}

              {/* social */}
              {(school.facebookUrl || school.instagramUrl || school.linkedinUrl) && (
                <div className="flex gap-3 pt-6 border-t border-slate-800">
                  {school.facebookUrl && (
                    <a href={school.facebookUrl} target="_blank" rel="noreferrer"
                      className="p-3 rounded-xl bg-slate-800 hover:bg-blue-600 transition-colors">
                      <Facebook className="h-5 w-5 text-white" />
                    </a>
                  )}
                  {school.instagramUrl && (
                    <a href={school.instagramUrl} target="_blank" rel="noreferrer"
                      className="p-3 rounded-xl bg-slate-800 hover:bg-pink-600 transition-colors">
                      <Instagram className="h-5 w-5 text-white" />
                    </a>
                  )}
                  {school.linkedinUrl && (
                    <a href={school.linkedinUrl} target="_blank" rel="noreferrer"
                      className="p-3 rounded-xl bg-slate-800 hover:bg-blue-800 transition-colors">
                      <Linkedin className="h-5 w-5 text-white" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TEAM ───────────────────────────────────────────── */}
      {team.length > 0 && (
        <section id="team" className="py-32 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <SectionHeader eyebrow="Our People" title="Meet the Educators" color={brand} />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map(member => (
                <div key={member.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 card-hover">
                  {/* photo */}
                  <div className="h-64 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                    {member.publicPhotoUrl ? (
                      <img
                        src={member.publicPhotoUrl}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-20 w-20 text-slate-300" />
                    )}
                    {/* role badge */}
                    <div
                      className="absolute top-4 right-4 px-3 py-1.5 rounded-xl text-white text-[9px] font-black uppercase tracking-widest"
                      style={{ backgroundColor: brand }}
                    >
                      {member.role}
                    </div>
                  </div>

                  {/* info */}
                  <div className="p-7 space-y-3">
                    <h4 className="text-xl font-black text-slate-800">
                      {member.firstName} {member.lastName}
                    </h4>
                    {member.qualifications && (
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <GraduationCap size={13} style={{ color: brand }} />
                        {member.qualifications}
                      </p>
                    )}
                    {member.publicBio && (
                      <p className="text-sm text-slate-500 leading-relaxed border-l-2 pl-4 italic"
                        style={{ borderColor: `${brand}50` }}>
                        "{member.publicBio}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── VIDEOS ─────────────────────────────────────────── */}
      {school.videoUrls?.length > 0 && (
        <section id="videos" className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <SectionHeader eyebrow="Media" title="Video Showcase" color={brand} />

            <div className="grid md:grid-cols-2 gap-10">
              {school.videoUrls.map((video: any, i: number) => {
                const ytId = getYouTubeId(video.url || video);
                if (!ytId) return null;
                return (
                  <div key={i} className="space-y-4">
                    <div className="rounded-3xl overflow-hidden aspect-video shadow-xl border border-slate-100">
                      <iframe
                        width="100%" height="100%"
                        src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                        title={video.title || `Video ${i + 1}`}
                        frameBorder="0" allowFullScreen
                      />
                    </div>
                    {video.title && (
                      <p className="text-center text-lg font-bold text-slate-700">{video.title}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── GALLERY ────────────────────────────────────────── */}
      {school.gallery?.length > 0 && (
        <section id="gallery" className="py-32 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <SectionHeader eyebrow="Campus Life" title={`Life at ${school.name}`} color={brand} />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {school.gallery.map((item: any, i: number) => (
                <div
                  key={i}
                  className={`group overflow-hidden rounded-2xl shadow-md border-4 border-white card-hover ${
                    i === 0 ? 'col-span-2 row-span-2' : ''
                  }`}
                >
                  <img
                    src={item.url || item}
                    alt={item.caption || ''}
                    className="w-full h-full object-cover aspect-square"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── NEWS ───────────────────────────────────────────── */}
      {announcements && announcements.length > 0 && (
        <section id="news" className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <SectionHeader eyebrow="Bulletins" title="News & Updates" color={brand} />

            <div className="grid md:grid-cols-3 gap-8">
              {announcements.map((news: any) => (
                <article
                  key={news.id}
                  className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm card-hover flex flex-col"
                >
                  {/* header stripe */}
                  <div className="h-1.5 w-full" style={{ backgroundColor: brand }} />

                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-5">
                      <span
                        className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white"
                        style={{ backgroundColor: brand }}
                      >
                        {news.priority || 'Update'}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {news.publishedAt ? format(news.publishedAt.toDate(), 'dd MMM yyyy') : 'Recent'}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-slate-800 leading-snug mb-3">{news.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-4 flex-1">{news.content}</p>

                    <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: brand }}>
                        Official Bulletin
                      </span>
                      <ArrowRight className="h-3 w-3" style={{ color: brand }} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── APPLY ──────────────────────────────────────────── */}
      <section id="apply" className="py-32 px-6" style={{ backgroundColor: `${brand}08` }}>
        <div className="max-w-3xl mx-auto">
          {/* header */}
          <div className="text-center mb-16 space-y-4">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border"
              style={{ color: brand, borderColor: `${brand}40`, backgroundColor: `${brand}10` }}
            >
              Admissions
            </span>
            <h2 className="serif text-5xl md:text-6xl italic" style={{ color: brand }}>
              Join Our Community
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Take the first step. Fill in the form below and our admissions team will be in touch within 24 hours.
            </p>
          </div>

          {/* form wrapper */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="h-2" style={{ backgroundColor: brand }} />
            <div className="p-10 md:p-14">
              <AdmissionForm schoolId={school.id} primaryColor={brand} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* top row */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 pb-12 border-b border-slate-800">
            {/* brand */}
            <div className="space-y-3">
              {school.logoUrl && (
                <img src={school.logoUrl} alt="Logo" className="h-12 w-12 object-contain rounded-xl" />
              )}
              <h4 className="serif text-2xl italic text-white">{school.name}</h4>
              {school.motto && (
                <p className="text-sm text-slate-500 max-w-xs">{school.motto}</p>
              )}
            </div>

            {/* quick links */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Navigate</p>
              <div className="flex flex-col gap-2">
                {navLinks.map(link => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className="text-sm font-semibold text-slate-400 hover:text-white transition-colors text-left"
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => scrollTo('apply')}
                  className="text-sm font-semibold hover:text-white transition-colors text-left"
                  style={{ color: brand }}
                >
                  Apply Now
                </button>
              </div>
            </div>

            {/* contact */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Contact</p>
              <div className="space-y-2 text-sm">
                {school.phone && <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{school.phone}</p>}
                {school.email && <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{school.email}</p>}
                {school.address && <p className="flex items-start gap-2"><MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />{school.address}</p>}
              </div>
            </div>
          </div>

          {/* bottom row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 text-xs font-bold uppercase tracking-widest text-slate-600">
            <p>&copy; {new Date().getFullYear()} {school.name}. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <Globe className="h-3 w-3" />
              <span>Powered by GAM Edu</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
