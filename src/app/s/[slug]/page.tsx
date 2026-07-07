'use client';
import { use, useState, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { AdmissionForm } from '@/components/public/AdmissionForm';
import {
  Loader2, MapPin, Phone, Mail, Globe,
  Camera, Info, Facebook, Instagram, Linkedin, Video,
  Megaphone, Calendar, ArrowRight, Sparkles, GraduationCap,
  User, Users, ChevronDown, Star, BookOpen, Award, Menu, X
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';

// ─── helpers ────────────────────────────────────────────────
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

function isLightColor(colorHex: string) {
  if (!colorHex || typeof colorHex !== 'string') return false;
  const hex = colorHex.replace('#', '');
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 140;
  }
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 140;
  }
  return false;
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
  const [newsList, setNewsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // scroll detection for nav & body scroll override
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'auto';

    const handler = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler);

    return () => {
      window.removeEventListener('scroll', handler);
      document.body.style.overflow = originalOverflow || 'hidden';
    };
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

  // sync team and newsList from school data
  useEffect(() => {
    if (school) {
      setTeam(school.customStaff || []);
      setNewsList(school.customNews || []);
    }
  }, [school]);

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
  const secondaryColor = school.secondaryColor || brand;
  const tertiaryColor = school.tertiaryColor || brand;
  const bannerBgColor = school.bannerBgColor || '#090d16';
  const isLight = isLightColor(bannerBgColor);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const navLinks = [
    { label: 'About', id: 'about' },
    (school.directorMessage || school.principalMessage) && { label: 'Leadership', id: 'leadership' },
    team.length > 0 && { label: 'Team', id: 'team' },
    newsList && newsList.length > 0 && { label: 'News', id: 'news' },
    school.gallery?.length > 0 && { label: 'Gallery', id: 'gallery' },
    { label: 'Contact', id: 'contact' },
  ].filter(Boolean) as { label: string; id: string }[];

  // ── render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,700;0,9..40,900;1,9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');
        .serif { font-family: 'DM Serif Display', Georgia, serif; }
        html { scroll-behavior: smooth; }
        body { overflow: auto !important; }
        .hero-grain::after {
          content:''; position:absolute; inset:0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events:none; z-index:2;
        }
        .card-hover { transition: transform 0.3s cubic-bezier(.22,.68,0,1.2), box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-6px); box-shadow: 0 24px 48px -12px rgba(0,0,0,0.15); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .prose-school h1 { font-size: 2rem; font-weight: 900; margin-top: 2.5rem; margin-bottom: 1rem; line-height: 1.2; }
        .prose-school h2 { font-size: 1.5rem; font-weight: 800; margin-top: 2rem; margin-bottom: 0.75rem; line-height: 1.3; }
        .prose-school h3 { font-size: 1.25rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.5rem; }
        .prose-school p { margin-bottom: 1rem; line-height: 1.8; }
        .prose-school strong { font-weight: 700; color: #1e293b; }
        .prose-school em { font-style: italic; }
        .prose-school ul, .prose-school ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .prose-school li { margin-bottom: 0.35rem; line-height: 1.7; }
        .prose-school ul { list-style-type: disc; }
        .prose-school ol { list-style-type: decimal; }
        .prose-school hr { border: none; border-top: 2px solid #e2e8f0; margin: 2.5rem 0; }
        .prose-school blockquote { border-left: 4px solid #cbd5e1; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #475569; }
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
              style={{ color: navScrolled ? brand : (isLight ? '#0f172a' : 'white') }}
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
                  navScrolled 
                    ? 'text-slate-500 hover:text-slate-900' 
                    : (isLight ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white')
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('apply')}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-black uppercase tracking-widest transition-opacity hover:opacity-90 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}
            >
              Apply Now
            </button>
          </div>

          {/* Hamburger for Mobile */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="flex md:hidden p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all"
            style={{ color: navScrolled ? brand : (isLight ? '#0f172a' : 'white') }}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-x-0 top-[72px] z-40 bg-slate-950/95 backdrop-blur-md md:hidden animate-in fade-in slide-in-from-top duration-300 flex flex-col justify-between p-8 border-t border-slate-900 overflow-y-auto" style={{ height: 'calc(100vh - 72px)' }}>
            <div className="flex flex-col gap-6 text-center pt-8">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    scrollTo(link.id);
                  }}
                  className="text-xl font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors py-3 border-b border-slate-900/60"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  scrollTo('apply');
                }}
                className="w-full py-4 rounded-2xl text-white text-lg font-black uppercase tracking-tight transition-opacity hover:opacity-90 shadow-lg mt-4"
                style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}
              >
                Apply Now
              </button>
            </div>
            
            <div className="text-center text-xs text-slate-650 font-bold uppercase tracking-widest pb-6">
              Powered by GAM Edu
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO ───────────────────────────────────────────── */}
      <section 
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden hero-grain"
        style={{ backgroundColor: bannerBgColor }}
      >
        {/* cover image */}
        {school.coverImageUrl && (
          <img
            src={school.coverImageUrl}
            alt="Campus"
            className="absolute inset-0 w-full h-full object-cover opacity-75"
          />
        )}

        {/* gradient overlay */}
        {isLight ? (
          <>
            <div
              className="absolute inset-0 opacity-20"
              style={{ background: `radial-gradient(ellipse at 60% 40%, ${brand}22 0%, transparent 70%)` }}
            />
            <div className="absolute inset-0 bg-white/15" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/70" />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 opacity-40"
              style={{ background: `radial-gradient(ellipse at 60% 40%, ${brand}33 0%, transparent 70%)` }}
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/70" />
          </>
        )}

        {/* content */}
        <div className="relative z-10 max-w-5xl fade-up space-y-8">
          {isLight ? (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 border border-black/10 text-slate-800 text-[10px] font-black uppercase tracking-widest backdrop-blur-sm animate-pulse">
              <Sparkles className="h-3 w-3 text-yellow-500" /> Admissions Open
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-yellow-400" /> Admissions Open
            </span>
          )}

          {isLight ? (
            <h1 className="serif text-6xl md:text-9xl text-slate-900 leading-none italic">
              {school.name}
            </h1>
          ) : (
            <h1 className="serif text-6xl md:text-9xl text-white leading-none italic drop-shadow-2xl">
              {school.name}
            </h1>
          )}

          {school.motto && (
            <p className={isLight ? "text-xl md:text-2xl text-slate-650 font-semibold max-w-2xl mx-auto" : "text-xl md:text-2xl text-white/70 font-medium max-w-2xl mx-auto"}>
              {school.motto}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={() => scrollTo('apply')}
              className="px-10 py-4 rounded-2xl text-white text-lg font-black uppercase tracking-tight shadow-2xl transition-transform hover:scale-105 active:scale-95"
              style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}
            >
              Start Application
            </button>
            {isLight ? (
              <button
                onClick={() => scrollTo('about')}
                className="px-10 py-4 rounded-2xl bg-black/5 border border-black/20 text-slate-800 text-lg font-black uppercase tracking-tight backdrop-blur-sm hover:bg-black/10 transition-colors"
              >
                Learn More
              </button>
            ) : (
              <button
                onClick={() => scrollTo('about')}
                className="px-10 py-4 rounded-2xl bg-white/10 border border-white/30 text-white text-lg font-black uppercase tracking-tight backdrop-blur-sm hover:bg-white/20 transition-colors"
              >
                Learn More
              </button>
            )}
          </div>
        </div>

        {/* scroll cue */}
        <div className={isLight ? "absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-slate-500/70" : "absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40"}>
          <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </section>

      {/* ─── STATS BAR ──────────────────────────────────────── */}
      {(school.studentCount || school.staffCount || school.yearsEstablished || school.programCount) && (
        <div className="py-12 px-6" style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor}, ${tertiaryColor})` }}>
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
              <div className="prose-school text-lg text-slate-600 leading-relaxed">
                <ReactMarkdown>
                  {school.aboutText || 'Welcome to our institution where excellence is the standard and every student is empowered to thrive.'}
                </ReactMarkdown>
              </div>
            </div>

            {/* mission / vision / core values */}
            {(school.mission || school.vision || school.coreValues) && (
              <div className="space-y-6 pt-4">
                <div className="grid sm:grid-cols-2 gap-6">
                  {school.mission && (
                    <div className="relative p-8 rounded-[2rem] bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm overflow-hidden group/card transition-shadow hover:shadow-md">
                      <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-[2rem]" style={{ background: `linear-gradient(90deg, ${brand}, ${brand}80)` }} />
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${brand}15` }}>
                          <Star className="h-5 w-5" style={{ color: brand }} />
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-wider" style={{ color: brand }}>Mission</h4>
                      </div>
                      <div className="prose-school text-slate-700 text-sm leading-relaxed">
                        <ReactMarkdown>{school.mission}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                  {school.vision && (
                    <div className="relative p-8 rounded-[2rem] bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm overflow-hidden group/card transition-shadow hover:shadow-md">
                      <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-[2rem]" style={{ background: `linear-gradient(90deg, ${secondaryColor}, ${secondaryColor}80)` }} />
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${secondaryColor}15` }}>
                          <BookOpen className="h-5 w-5" style={{ color: secondaryColor }} />
                        </div>
                        <h4 className="text-lg font-black uppercase tracking-wider" style={{ color: secondaryColor }}>Vision</h4>
                      </div>
                      <div className="prose-school text-slate-700 text-sm leading-relaxed">
                        <ReactMarkdown>{school.vision}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
                {school.coreValues && (
                  <div className="relative p-8 rounded-[2rem] bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm overflow-hidden group/card transition-shadow hover:shadow-md">
                    <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-[2rem]" style={{ background: `linear-gradient(90deg, ${tertiaryColor}, ${tertiaryColor}80)` }} />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${tertiaryColor}15` }}>
                        <Award className="h-5 w-5" style={{ color: tertiaryColor }} />
                      </div>
                      <h4 className="text-lg font-black uppercase tracking-wider" style={{ color: tertiaryColor }}>Core Values</h4>
                    </div>
                    <div className="prose-school text-slate-700 text-sm leading-relaxed">
                      <ReactMarkdown>{school.coreValues}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Visual campus banner */}
          <div className="relative aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-slate-100 group sticky top-32">
            {school.coverImageUrl ? (
              <img
                src={school.coverImageUrl}
                alt="Campus View"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <GraduationCap className="h-20 w-20 text-slate-350" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Our Campus</span>
              <h4 className="serif text-2xl mt-1 font-bold">{school.name}</h4>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LEADERSHIP MESSAGES ────────────────────────────── */}
      {(school.directorMessage || school.principalMessage) && (
        <section id="leadership" className="py-32 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-20">
            <SectionHeader eyebrow="Leadership" title="Messages from Leadership" color={brand} />

            <div className="space-y-16">
              {/* Director's Message */}
              {school.directorMessage && (
                <div className="relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-lg">
                  <div className="absolute top-0 left-0 w-full h-2" style={{ background: `linear-gradient(90deg, ${brand}, ${secondaryColor})` }} />
                  <div className={`flex flex-col ${school.directorLayout === 'alongside' ? 'lg:flex-row' : ''}`}>
                    {/* Photo */}
                    <div className={`relative bg-slate-100 flex items-center justify-center overflow-hidden ${
                      school.directorLayout === 'alongside'
                        ? 'lg:w-[340px] xl:w-[400px] min-h-[320px] lg:min-h-[400px] shrink-0'
                        : 'w-full h-[320px] sm:h-[400px]'
                    }`}>
                      {school.directorPhotoUrl ? (
                        <img src={school.directorPhotoUrl} alt="School Director" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-slate-300">
                          <User className="h-24 w-24" />
                          <span className="text-xs font-bold uppercase tracking-widest">Director</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute bottom-5 left-6 z-10">
                        <span
                          className="inline-block px-4 py-1.5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-sm"
                          style={{ background: `linear-gradient(135deg, ${brand}dd, ${secondaryColor}dd)` }}
                        >
                          School Director
                        </span>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex-1 p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                      <h3 className="serif text-2xl md:text-3xl italic mb-6" style={{ color: brand }}>
                        Message from the Director
                      </h3>
                      <div className="prose-school text-slate-600 leading-relaxed text-[15px]">
                        <ReactMarkdown>{school.directorMessage}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Principal's Message */}
              {school.principalMessage && (
                <div className="relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-lg">
                  <div className="absolute top-0 left-0 w-full h-2" style={{ background: `linear-gradient(90deg, ${secondaryColor}, ${tertiaryColor})` }} />
                  <div className={`flex flex-col ${school.principalLayout === 'alongside' ? 'lg:flex-row' : ''}`}>
                    {/* Photo */}
                    <div className={`relative bg-slate-100 flex items-center justify-center overflow-hidden ${
                      school.principalLayout === 'alongside'
                        ? 'lg:w-[340px] xl:w-[400px] min-h-[320px] lg:min-h-[400px] shrink-0'
                        : 'w-full h-[320px] sm:h-[400px]'
                    }`}>
                      {school.principalPhotoUrl ? (
                        <img src={school.principalPhotoUrl} alt="School Principal" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-slate-300">
                          <User className="h-24 w-24" />
                          <span className="text-xs font-bold uppercase tracking-widest">Principal</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                      <div className="absolute bottom-5 left-6 z-10">
                        <span
                          className="inline-block px-4 py-1.5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest shadow-lg backdrop-blur-sm"
                          style={{ background: `linear-gradient(135deg, ${secondaryColor}dd, ${tertiaryColor}dd)` }}
                        >
                          School Principal
                        </span>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex-1 p-8 md:p-12 lg:p-14 flex flex-col justify-center">
                      <h3 className="serif text-2xl md:text-3xl italic mb-6" style={{ color: secondaryColor }}>
                        Message from the Principal
                      </h3>
                      <div className="prose-school text-slate-600 leading-relaxed text-[15px]">
                        <ReactMarkdown>{school.principalMessage}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ─── TEAM ───────────────────────────────────────────── */}
      {team.length > 0 && (
        <section id="team" className="py-32 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <SectionHeader eyebrow="Our People" title="Meet the Educators" color={brand} />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, idx) => {
                const name = member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim();
                const photo = member.photoUrl || member.publicPhotoUrl;
                const bio = member.bio || member.publicBio;
                return (
                  <div key={member.id || idx} className="bg-white rounded-3xl overflow-hidden border border-slate-100 card-hover">
                    {/* photo */}
                    <div className="h-64 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                      {photo ? (
                        <img
                          src={photo}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-20 w-20 text-slate-350" />
                      )}
                      {/* role badge */}
                      <div
                        className="absolute top-4 right-4 px-3 py-1.5 rounded-xl text-white text-[9px] font-black uppercase tracking-widest shadow-md"
                        style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}
                      >
                        {member.role}
                      </div>
                    </div>

                    {/* info */}
                    <div className="p-7 space-y-3">
                      <h4 className="text-xl font-black text-slate-800">
                        {name}
                      </h4>
                      {member.qualifications && (
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <GraduationCap size={13} style={{ color: brand }} />
                          {member.qualifications}
                        </p>
                      )}
                      {bio && (
                        <p className="text-sm text-slate-500 leading-relaxed border-l-2 pl-4 italic"
                          style={{ borderColor: `${secondaryColor}80` }}>
                          "{bio}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
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
      {newsList && newsList.length > 0 && (
        <section id="news" className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <SectionHeader eyebrow="Bulletins" title="News & Updates" color={brand} />

            <div className="grid md:grid-cols-3 gap-8">
              {newsList.map((news: any, idx: number) => {
                const cardAccents = [brand, secondaryColor, tertiaryColor];
                const currentAccent = cardAccents[idx % cardAccents.length];
                
                const formattedDate = (() => {
                  if (!news.date) return 'Recent';
                  try {
                    const [y, m, d] = news.date.split('-');
                    if (y && m && d) {
                      return format(new Date(parseInt(y), parseInt(m) - 1, parseInt(d)), 'dd MMM yyyy');
                    }
                    return news.date;
                  } catch {
                    return news.date;
                  }
                })();

                return (
                  <article
                    key={idx}
                    className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm card-hover flex flex-col"
                  >
                    {/* banner image */}
                    {news.imageUrl && (
                      <div className="h-48 w-full overflow-hidden bg-slate-100 relative">
                        <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* header stripe if no image */}
                    {!news.imageUrl && (
                      <div className="h-1.5 w-full" style={{ backgroundColor: currentAccent }} />
                    )}

                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-5">
                        <span
                          className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white"
                          style={{ backgroundColor: currentAccent }}
                        >
                          {news.type || 'Update'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formattedDate}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-slate-800 leading-snug mb-3">{news.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-4 flex-1">{news.content}</p>

                      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: currentAccent }}>
                            Official Bulletin
                          </span>
                          <ArrowRight className="h-3 w-3" style={{ color: currentAccent }} />
                        </div>
                        {news.videoUrl && (
                          <a
                            href={news.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest hover:opacity-85 transition-opacity"
                            style={{ color: currentAccent }}
                          >
                            <Video className="h-3.5 w-3.5 mr-1" /> Watch ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
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
            <div className="h-2" style={{ background: `linear-gradient(90deg, ${brand}, ${secondaryColor}, ${tertiaryColor})` }} />
            <div className="p-10 md:p-14">
              <AdmissionForm schoolId={school.id} primaryColor={brand} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER & CONTACT US ───────────────────────────────── */}
      <footer id="contact" className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-400 py-24 px-6 border-t border-slate-900 overflow-hidden">
        {/* Soft glowing ambient circles in footer */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-[0.03] transition-all duration-1000" style={{ backgroundColor: brand }} />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-[0.02] transition-all duration-1000" style={{ backgroundColor: secondaryColor }} />
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 pb-16">
            {/* Left Side: Brand & Copyright */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-10">
              <div className="space-y-4">
                {school.logoUrl ? (
                  <div className="inline-block p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl">
                    <img src={school.logoUrl} alt="Logo" className="h-12 w-12 object-contain" />
                  </div>
                ) : (
                  <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl" style={{ backgroundImage: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}>
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                )}
                <div>
                  <h4 className="serif text-3xl italic text-white tracking-wide">{school.name}</h4>
                  {school.motto && (
                    <p className="text-sm text-slate-500 max-w-sm mt-2 font-medium leading-relaxed italic">
                      "{school.motto}"
                    </p>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-550 leading-relaxed font-medium">
                &copy; {new Date().getFullYear()} {school.name} Portal. Assisted by GAM Edu Multitenant Core. All rights reserved.
              </p>
            </div>

            {/* Right Side: Contact & Socials */}
            <div className="md:col-span-7 space-y-12">
              {/* Connect & Locate Us */}
              <div className="space-y-4">
                <h5 className="text-xs font-black uppercase tracking-[0.2em] text-white">Connect & Locate Us</h5>
                <div className="space-y-3 text-sm font-semibold">
                  {school.address && (
                    <div className="space-y-1">
                      <p className="text-slate-300 font-bold">{school.address}</p>
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(school.address)}`} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-350 transition-colors"
                        style={{ color: brand }}
                      >
                        📍 Click to navigate map ↗
                      </a>
                    </div>
                  )}
                  {school.email && (
                    <p>
                      <a href={`mailto:${school.email}`} className="text-slate-400 hover:text-white transition-colors">
                        {school.email}
                      </a>
                    </p>
                  )}
                  {school.phone && (
                    <p>
                      <a href={`tel:${school.phone}`} className="text-slate-400 hover:text-white transition-colors">
                        {school.phone}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* Digital Communities */}
              <div className="space-y-4">
                <h5 className="text-xs font-black uppercase tracking-[0.2em] text-white">Digital Communities</h5>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xl font-medium">
                  Follow our school on authorized social networks for premium updates, campus highlights, and live events broadcasts.
                </p>
                
                {(school.facebookUrl || school.instagramUrl || school.linkedinUrl) ? (
                  <div className="flex gap-6 pt-2 text-sm font-bold">
                    {school.facebookUrl && (
                      <a href={school.facebookUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group/soc">
                        <Facebook className="h-4 w-4" /> Facebook
                      </a>
                    )}
                    {school.instagramUrl && (
                      <a href={school.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group/soc">
                        <Instagram className="h-4 w-4" /> Instagram
                      </a>
                    )}
                    {school.linkedinUrl && (
                      <a href={school.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group/soc">
                        <Linkedin className="h-4 w-4" /> LinkedIn
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic max-w-sm leading-relaxed font-medium">
                    No social media links configured yet. Use the CMS admin panel tuner to apply your channels.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Powered by */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 text-xs font-bold uppercase tracking-widest text-slate-650 border-t border-slate-900">
            <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-full border border-slate-900/50 backdrop-blur-sm">
              <Globe className="h-3.5 w-3.5 text-slate-500 animate-pulse" />
              <span className="text-slate-500">Powered by <strong className="text-slate-450">GAM Edu</strong></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
