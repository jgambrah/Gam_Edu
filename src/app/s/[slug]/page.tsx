'use client';
import { use, useState, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { AdmissionForm } from '@/components/public/AdmissionForm';
import {
  Loader2, MapPin, Phone, Mail, Globe,
  Camera, Info, Facebook, Instagram, Linkedin, Video,
  Megaphone, Calendar, ArrowRight, Sparkles, GraduationCap,
  User, Users, ChevronDown, Star, BookOpen, Award, Menu, X, Atom
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
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);

  const banners = school?.bannerImages && school.bannerImages.length > 0
    ? school.bannerImages
    : (school?.coverImageUrl ? [school.coverImageUrl] : []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIdx(prev => (prev + 1) % banners.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [banners.length]);

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

  const fallbackDepartments = [
    {
      level: 'Early Years / Pre-School',
      ageRange: 'Ages 2 - 5',
      focus: 'Focuses on early sensory exploration, motor skills, social play, and basic pre-literacy/numerical concepts using interactive methods.'
    },
    {
      level: 'Primary / Basic School',
      ageRange: 'Ages 6 - 11',
      focus: 'Focuses on core subjects: Mathematics, English Language, Integrated Science, Citizenship Education, and Creative Arts with hands-on learning.'
    },
    {
      level: 'Junior High School (JHS)',
      ageRange: 'Ages 12 - 15',
      focus: 'Focuses on rigorous academic preparation, critical thinking, ICT/Coding projects, and preparing students for regional BECE qualifications.'
    }
  ];

  const departments = school.academicsDepartments && school.academicsDepartments.length > 0
    ? school.academicsDepartments
    : fallbackDepartments;

  const academicsOverviewText = school.academicsOverview || 'We are dedicated to providing a balanced, comprehensive academic program that fosters analytical thinking, creative problem-solving, and standard exam preparations. Our certified educators utilize modern learning aids to inspire curiosity and shape future leaders.';

  const gradingPolicyText = school.academicsGrading || 'Assessment is continuous throughout each term. Typically, students are graded on Class Assignments & Quizzes (10%), Project-based Assignments (30%), and End-of-Term Examinations (60%). Regular report cards are issued to track and communicate progress.';

  const fallbackPillars = [
    {
      title: 'School Library',
      description: 'A quiet space stocked with textbooks, reading books, and reference materials to encourage reading habits and support class studies.',
      icon: 'BookOpen'
    },
    {
      title: 'Computer & Science Room',
      description: 'Equipped with computer setups and basic science kits to give students hands-on practical skills in ICT and elementary sciences.',
      icon: 'Atom'
    },
    {
      title: 'Creative & Sports Activities',
      description: 'Healthy extra-curricular programs including arts, board games, and sports to develop students\' creative talents outside the classroom.',
      icon: 'Sparkles'
    }
  ];

  const pillars = school.academicsPillars && school.academicsPillars.length > 0
    ? school.academicsPillars
    : fallbackPillars;

  const getPillarIcon = (iconName?: string) => {
    switch (iconName) {
      case 'BookOpen':
      case 'library':
      case 'book':
        return <BookOpen className="h-6 w-6 text-indigo-400" />;
      case 'Atom':
      case 'lab':
      case 'science':
        return <Atom className="h-6 w-6 text-emerald-400" />;
      case 'Sparkles':
      case 'coding':
      case 'robotics':
      default:
        return <Sparkles className="h-6 w-6 text-yellow-400" />;
    }
  };

  const fallbackAdmissionsGuidelines = `
### Admissions Guidelines & Requirements

Welcome to our admissions portal! To ensure a smooth application process for your child, please review the requirements below:

#### 1. Required Documents Checklist:
*   **Copy of Child's Birth Certificate** (or passport copy)
*   **Immunization Card / Medical History** records
*   **2 Passport-sized Photographs** of the student
*   **Previous School Reports / Academic Transcripts** (if transferring)

#### 2. Next Steps in the Process:
1.  **Submit Admission Form**: Fill out the online form on this page.
2.  **Document Verification**: Our admissions officer will verify the details.
3.  **Entrance Assessment**: Prospective students may undergo a standard placement review.
4.  **Enrollment Confirmation**: Upon successful review, admission credentials will be generated automatically.
  `;

  const admissionsGuidelinesText = school.admissionsGuidelines || fallbackAdmissionsGuidelines;

  const navLinks = [
    { label: 'About', id: 'about' },
    (school.directorMessage || school.principalMessage) && { label: 'Leadership', id: 'leadership' },
    { label: 'Academics', id: 'academics' },
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
              style={{ color: navScrolled ? brand : (isLight ? '#1e293b' : 'white') }}
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
            <a
              href="https://gam-it-service.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-sm border flex items-center gap-1.5 ${
                navScrolled 
                  ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              <GraduationCap className="h-4 w-4" /> Portal Login
            </a>
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
            style={{ color: navScrolled ? brand : 'white' }}
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
              <a
                href="https://gam-it-service.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-2xl text-white text-lg font-black uppercase tracking-tight transition-opacity hover:opacity-90 shadow-lg mt-4 border border-white/20 bg-white/10 flex items-center justify-center gap-2"
              >
                <GraduationCap className="h-5 w-5" /> Portal Login
              </a>
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
        {/* cover image slideshow */}
        {banners.length > 0 ? (
          banners.map((imgUrl: string, idx: number) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`Campus Banner ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                idx === currentBannerIdx ? 'opacity-85' : 'opacity-0'
              }`}
            />
          ))
        ) : (
          school.coverImageUrl && (
            <img
              src={school.coverImageUrl}
              alt="Campus"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
          )
        )}

        {/* premium dark glassmorphism gradient overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: `radial-gradient(ellipse at 60% 40%, ${brand}22 0%, transparent 70%)` }}
        />
        <div className="absolute inset-0 bg-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/10 to-slate-950/70" />

        {/* content */}
        <div className="relative z-10 max-w-5xl fade-up space-y-8">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 text-[11px] font-black uppercase tracking-[0.25em] backdrop-blur-md shadow-lg shadow-emerald-950/30 animate-pulse">
            <Sparkles className="h-3.5 w-3.5 text-yellow-400" /> Admissions Open
          </span>

          <h1 className="serif text-6xl md:text-8xl text-white leading-none italic font-black drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
            {school.name}
          </h1>

          {school.motto && (
            <p className="text-xl md:text-2xl text-slate-100 font-semibold max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
              {school.motto}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a
              href="https://gam-it-service.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-2xl text-white text-lg font-black uppercase tracking-tight shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-white/10 hover:shadow-indigo-500/10 transition-all"
              style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}
            >
              <GraduationCap className="h-5 w-5" /> Portal Login
            </a>
            <button
              onClick={() => scrollTo('apply')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-lg font-black uppercase tracking-tight shadow-xl border border-emerald-400/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <GraduationCap className="h-5 w-5" /> Start Application
            </button>
            <button
              onClick={() => scrollTo('about')}
              className="px-8 py-4 rounded-2xl bg-white/10 border border-white/20 text-white text-lg font-black uppercase tracking-tight backdrop-blur-md hover:bg-white/20 transition-all hover:scale-105 active:scale-95"
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
                    <div className={`relative bg-slate-50 flex items-center justify-center overflow-hidden ${
                      school.directorLayout === 'alongside'
                        ? 'lg:w-[380px] xl:w-[460px] min-h-[350px] lg:min-h-[500px] xl:min-h-[580px] shrink-0 lg:border-r border-slate-100'
                        : 'w-full border-b border-slate-100'
                    }`}>
                      {school.directorPhotoUrl ? (
                        <img 
                          src={school.directorPhotoUrl} 
                          alt="School Director" 
                          className={`w-full object-contain ${
                            school.directorLayout === 'alongside'
                              ? 'h-full lg:max-h-[580px]'
                              : 'h-auto max-h-[450px] sm:max-h-[550px] md:max-h-[600px] py-4'
                          }`}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-slate-300 py-16">
                          <User className="h-24 w-24" />
                          <span className="text-xs font-bold uppercase tracking-widest">Director</span>
                        </div>
                      )}
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
                    <div className={`relative bg-slate-50 flex items-center justify-center overflow-hidden ${
                      school.principalLayout === 'alongside'
                        ? 'lg:w-[380px] xl:w-[460px] min-h-[350px] lg:min-h-[500px] xl:min-h-[580px] shrink-0 lg:border-r border-slate-100'
                        : 'w-full border-b border-slate-100'
                    }`}>
                      {school.principalPhotoUrl ? (
                        <img 
                          src={school.principalPhotoUrl} 
                          alt="School Principal" 
                          className={`w-full object-contain ${
                            school.principalLayout === 'alongside'
                              ? 'h-full lg:max-h-[580px]'
                              : 'h-auto max-h-[450px] sm:max-h-[550px] md:max-h-[600px] py-4'
                          }`}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-3 text-slate-300 py-16">
                          <User className="h-24 w-24" />
                          <span className="text-xs font-bold uppercase tracking-widest">Principal</span>
                        </div>
                      )}
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

      {/* ─── ACADEMICS ──────────────────────────────────────── */}
      <section id="academics" className="py-32 px-6 bg-white relative overflow-hidden">
        {/* Decorative subtle backdrop elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-slate-50 opacity-50 blur-3xl -z-10" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-indigo-50/10 opacity-30 blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border"
              style={{ color: brand, borderColor: `${brand}40`, backgroundColor: `${brand}10` }}
            >
              Academic Excellence
            </span>
            <h2 className="serif text-5xl md:text-6xl italic leading-tight" style={{ color: brand }}>
              Curriculum & Programs
            </h2>
            <div className="prose-school text-lg text-slate-650 leading-relaxed font-medium">
              <ReactMarkdown>{academicsOverviewText}</ReactMarkdown>
            </div>
          </div>

          {/* Departments Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {departments.map((dept: any, i: number) => {
              const hasImg = !!dept.imageUrl;
              return (
                <div
                  key={i}
                  className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-white border border-slate-100/80 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    {hasImg ? (
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img 
                          src={dept.imageUrl} 
                          alt={dept.level} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
                            <GraduationCap className="h-5 w-5 text-white" />
                          </div>
                          {dept.ageRange && (
                            <span className="text-[9px] font-black tracking-widest uppercase px-2.5 py-1 bg-white/20 text-white border border-white/10 backdrop-blur-md rounded-full font-mono">
                              {dept.ageRange}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : null}

                    <div className="p-8 space-y-4">
                      {!hasImg && (
                        <div className="flex justify-between items-start">
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-50 border border-indigo-100 shadow-inner group-hover:scale-110 transition-transform">
                            <GraduationCap className="h-6 w-6 text-indigo-600" />
                          </div>
                          {dept.ageRange && (
                            <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 bg-slate-100 text-slate-600 rounded-full font-mono">
                              {dept.ageRange}
                            </span>
                          )}
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-black tracking-tight text-slate-800 mb-2">{dept.level}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium">{dept.focus}</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => scrollTo('apply')}
                    className="mx-8 mb-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400 group-hover:text-indigo-650 transition-colors cursor-pointer"
                  >
                    <span>Inquire Admission</span>
                    <ChevronDown className="-rotate-90 h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Academic Resource Pillars */}
          {school.showAcademicsPillars !== false && pillars.length > 0 && (
            <div className="bg-slate-950 text-white rounded-[3rem] p-8 md:p-14 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
              <div className="relative z-10 grid md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-white/10">
                {pillars.map((pillar: any, idx: number) => (
                  <div key={idx} className="md:px-6 space-y-3 pt-6 md:pt-0 first:pt-0 first:pl-0 md:first:pt-0">
                    <div className="mx-auto md:mx-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      {getPillarIcon(pillar.icon)}
                    </div>
                    <h4 className="text-lg font-black uppercase tracking-wider">{pillar.title}</h4>
                    <p className="text-white/60 text-sm leading-relaxed font-medium">{pillar.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessment & Grading Policy Section */}
          {gradingPolicyText && (
            <div className="bg-slate-50 border border-slate-200/60 rounded-[2.5rem] p-8 md:p-12 max-w-4xl mx-auto space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-wider text-slate-800 animate-pulse">Grading & Assessment Framework</h3>
              </div>
              <p className="text-slate-650 text-[15px] leading-relaxed font-semibold">
                {gradingPolicyText}
              </p>
            </div>
          )}
        </div>
      </section>

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
        <div className="max-w-6xl mx-auto space-y-16">
          {/* header */}
          <div className="text-center space-y-4">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border"
              style={{ color: brand, borderColor: `${brand}40`, backgroundColor: `${brand}10` }}
            >
              Admissions
            </span>
            <h2 className="serif text-5xl md:text-6xl italic" style={{ color: brand }}>
              Join Our Community
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
              Take the first step. Fill out the application form or review our admissions checklist below.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Guidelines Column */}
            <div className="lg:col-span-5 bg-white border border-slate-100/80 p-8 md:p-10 rounded-[2.5rem] shadow-sm space-y-6">
              <div className="prose-school text-slate-650 text-sm leading-relaxed font-medium">
                <ReactMarkdown>{admissionsGuidelinesText}</ReactMarkdown>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="h-2" style={{ background: `linear-gradient(90deg, ${brand}, ${secondaryColor}, ${tertiaryColor})` }} />
              <div className="p-10 md:p-14">
                <AdmissionForm schoolId={school.id} primaryColor={brand} />
              </div>
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 text-xs font-bold uppercase tracking-widest text-slate-655 border-t border-slate-900">
            <div className="flex items-center gap-2 bg-slate-900/60 px-4 py-2 rounded-full border border-slate-900/50 backdrop-blur-sm">
              <Globe className="h-3.5 w-3.5 text-slate-500 animate-pulse" />
              <span className="text-slate-500">Powered by <strong className="text-slate-450">GAM Edu</strong></span>
            </div>
            <a
              href="https://gam-it-service.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <GraduationCap className="h-4 w-4 text-slate-400" /> Go to Portal Login
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
