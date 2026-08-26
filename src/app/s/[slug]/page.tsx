'use client';
import { use, useState, useEffect, useRef } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { AdmissionForm, AdmissionEnquiryForm } from '@/components/public/AdmissionForm';
import {
  Loader2, MapPin, Phone, Mail, Globe,
  Camera, Info, Facebook, Instagram, Linkedin, Video,
  Megaphone, Calendar, ArrowRight, Sparkles, GraduationCap,
  User, Users, ChevronDown, ChevronLeft, ChevronRight, Star, BookOpen, Award, Menu, X, Atom,
  MessageCircle, Quote, Eye, Type, ZapOff, RotateCcw
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

function getCleanEmailLink(emailStr: string) {
  if (!emailStr) return '';
  const trimmed = emailStr.trim();
  if (trimmed.toLowerCase().startsWith('mailto:')) {
    return trimmed;
  }
  return `mailto:${trimmed}`;
}

function getCleanPhoneLink(phoneStr: string) {
  if (!phoneStr) return '';
  const trimmed = phoneStr.trim();
  if (trimmed.toLowerCase().startsWith('tel:')) {
    return trimmed;
  }
  return `tel:${trimmed}`;
}

function getCleanWhatsAppLink(waStr: string) {
  if (!waStr) return '';
  const trimmed = waStr.trim();
  if (trimmed.toLowerCase().startsWith('http://') || trimmed.toLowerCase().startsWith('https://')) {
    return trimmed;
  }
  const numbersOnly = trimmed.replace(/[^0-9]/g, '');
  return `https://wa.me/${numbersOnly}`;
}

// ─── auto logo color extraction ─────────────────────────────
function extractLogoColors(
  logoUrl: string,
  callback: (colors: { primary: string; secondary: string }) => void
) {
  if (!logoUrl) return;
  const img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 32;
      canvas.height = 32;
      ctx.drawImage(img, 0, 0, 32, 32);
      const imageData = ctx.getImageData(0, 0, 32, 32).data;

      const colorCounts: { [hex: string]: number } = {};
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];
        if (a < 128) continue; // ignore transparent pixels

        const isWhite = r > 230 && g > 230 && b > 230;
        const isBlack = r < 25 && g < 25 && b < 25;
        if (isWhite || isBlack) continue;

        const qr = Math.round(r / 16) * 16;
        const qg = Math.round(g / 16) * 16;
        const qb = Math.round(b / 16) * 16;
        const hex = `#${((1 << 24) + (qr << 16) + (qg << 8) + qb).toString(16).slice(1)}`;
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      const sorted = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
      if (sorted.length > 0) {
        callback({
          primary: sorted[0],
          secondary: sorted[1] || sorted[0]
        });
      }
    } catch {
      // Fallback gracefully on CORS restriction
    }
  };
  img.src = logoUrl;
}

// ─── animated impact counters (AOS IntersectionObserver) ─────
function ImpactCounters({
  targetNumber,
  label,
  suffix = '+',
  icon: Icon,
}: {
  targetNumber: number | string;
  label: string;
  suffix?: string;
  icon?: any;
}) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);

  const numVal = typeof targetNumber === 'number'
    ? targetNumber
    : parseInt(String(targetNumber).replace(/[^0-9]/g, ''), 10) || 0;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && numVal > 0) {
          let start = 0;
          const duration = 2000;
          const increment = numVal / (duration / 16);

          const counter = setInterval(() => {
            start += increment;
            if (start >= numVal) {
              setCount(numVal);
              clearInterval(counter);
            } else {
              setCount(Math.ceil(start));
            }
          }, 16);

          if (countRef.current) observer.unobserve(countRef.current);
        }
      },
      { threshold: 0.5 }
    );

    const currentRef = countRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => observer.disconnect();
  }, [numVal]);

  return (
    <div
      ref={countRef}
      className="flex flex-col items-center justify-center text-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8 shadow-xl hover:scale-105 transition-all duration-300 group"
    >
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
          <Icon className="h-6 w-6 text-white" />
        </div>
      )}
      <div className="text-4xl md:text-5xl font-black text-white font-mono tracking-tight">
        {count}
        <span className="text-amber-300 font-sans ml-0.5">{suffix}</span>
      </div>
      <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-white/80">
        {label}
      </span>
    </div>
  );
}

// ─── scroll reveal component (AOS - Animate On Scroll) ───────
function ScrollReveal({
  children,
  className = '',
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.12 }
    );

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{
        transitionDelay: `${delayMs}ms`,
      }}
      className={`reveal-on-scroll ${
        isVisible ? 'is-visible' : ''
      } ${className}`}
    >
      {children}
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
  const [extractedColors, setExtractedColors] = useState<{ primary?: string; secondary?: string }>({});
  const [team, setTeam] = useState<any[]>([]);
  const [newsList, setNewsList] = useState<any[]>([]);
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [admissionTab, setAdmissionTab] = useState<'enquiry' | 'apply'>('enquiry');
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState<number | null>(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);

  // Accessibility (WCAG) controls
  const [a11yOpen, setA11yOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeStep, setFontSizeStep] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaInstallBanner, setShowPwaInstallBanner] = useState(false);

  const defaultFallbackBanners = [
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1920'
  ];

  const defaultFallbackGallery = [
    { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200', caption: 'Campus Quadrangle' },
    { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200', caption: 'Interactive Classroom Learning' },
    { url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200', caption: 'School Resource Library' },
    { url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200', caption: 'STEM & Computer Laboratory' },
    { url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200', caption: 'Inter-House Sports Tournament' },
    { url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=1200', caption: 'Robotics & Coding Workshop' },
    { url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200', caption: 'Music & Creative Performing Arts' },
    { url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=1200', caption: 'Annual Science Fair Showcase' }
  ];

  const defaultTestimonials = [
    {
      quote: "Enrolling our children here was the best decision we ever made. The balance between academic excellence and moral character building is truly exceptional.",
      name: "Dr. Kwame Mensah",
      role: "Parent (Grade 4 & Grade 8)",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    },
    {
      quote: "The dedicated STEM labs and robotics programs prepared me so well for University. The teachers genuinely care about every student's personal growth.",
      name: "Akosua Osei",
      role: "Alumni & Software Engineer",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
    },
    {
      quote: "A nurturing environment with world-class facilities. My daughter has grown in confidence, leadership, and curiosity since joining.",
      name: "Mrs. Abena Appiah",
      role: "Parent (Preschool)",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    }
  ];

  const banners = school?.bannerImages && school.bannerImages.length > 0
    ? school.bannerImages
    : (school?.coverImageUrl ? [school.coverImageUrl] : defaultFallbackBanners);

  const galleryList = school?.gallery && school.gallery.length > 0
    ? school.gallery
    : defaultFallbackGallery;

  const testimonialList = (Array.isArray(school?.testimonials) && school.testimonials.length > 0)
    ? school.testimonials
    : (Array.isArray(school?.customTestimonials) && school.customTestimonials.length > 0)
    ? school.customTestimonials
    : (Array.isArray(school?.reviews) && school.reviews.length > 0)
    ? school.reviews
    : (Array.isArray(school?.parentReviews) && school.parentReviews.length > 0)
    ? school.parentReviews
    : defaultTestimonials;

  const validVideos = (school?.videoUrls || [])
    .map((v: any) => ({
      title: typeof v === 'object' ? v.title : null,
      url: typeof v === 'object' ? v.url : v,
      ytId: getYouTubeId(typeof v === 'object' ? v.url : v)
    }))
    .filter((v: any) => !!v.ytId);

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

  // sync team and newsList from school data & extract logo colors automatically
  useEffect(() => {
    if (school) {
      setTeam(school.customStaff || []);
      setNewsList(school.customNews || []);
      if (school.logoUrl && !school.primaryColor) {
        extractLogoColors(school.logoUrl, (colors) => {
          setExtractedColors(colors);
        });
      }
    }
  }, [school]);

  // ── PWA Installation Listener ─────────────────────────────
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPwaInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPwaInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  // ── Automated SEO & OpenGraph Meta + Dynamic PWA Manifest Injection ──
  useEffect(() => {
    if (!school) return;

    // Extract first 150 words of About Us
    const rawAbout = school.aboutText || school.motto || 'Dedicated to academic excellence and student success.';
    const words = rawAbout.trim().split(/\s+/).slice(0, 150).join(' ');
    const metaDescription = words.length > 280 ? words.substring(0, 277) + '...' : words;
    const pageTitle = `${school.name} | Official Website`;
    const shareImage = school.logoUrl || school.coverImageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=1200';

    document.title = pageTitle;

    // Inject meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', metaDescription);

    // OpenGraph & Twitter tags
    const ogTags = [
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: metaDescription },
      { property: 'og:image', content: shareImage },
      { property: 'og:url', content: typeof window !== 'undefined' ? window.location.href : '' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: `${school.name} - GAM Edu` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: pageTitle },
      { name: 'twitter:description', content: metaDescription },
      { name: 'twitter:image', content: shareImage },
      { name: 'theme-color', content: school.primaryColor || '#4f46e5' }
    ];

    ogTags.forEach((tag) => {
      const key = tag.property ? `property="${tag.property}"` : `name="${tag.name}"`;
      let el = document.querySelector(`meta[${key}]`);
      if (!el) {
        el = document.createElement('meta');
        if (tag.property) el.setAttribute('property', tag.property);
        if (tag.name) el.setAttribute('name', tag.name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', tag.content);
    });

    // Dynamic PWA Web Manifest Injection
    const manifestJson = {
      name: school.name,
      short_name: school.name.length > 15 ? school.name.substring(0, 12) + '...' : school.name,
      description: metaDescription,
      start_url: typeof window !== 'undefined' ? window.location.pathname : '/',
      display: 'standalone',
      background_color: '#090d16',
      theme_color: school.primaryColor || '#4f46e5',
      icons: [
        {
          src: school.logoUrl || '/favicon.ico',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: school.logoUrl || '/favicon.ico',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    };

    const blob = new Blob([JSON.stringify(manifestJson)], { type: 'application/json' });
    const manifestUrl = URL.createObjectURL(blob);

    let manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      manifestLink = document.createElement('link');
      manifestLink.setAttribute('rel', 'manifest');
      document.head.appendChild(manifestLink);
    }
    manifestLink.setAttribute('href', manifestUrl);

    return () => {
      URL.revokeObjectURL(manifestUrl);
    };
  }, [school]);

  // WCAG High Contrast Data Attribute Sync
  const toggleHighContrast = (enable?: boolean) => {
    const root = document.documentElement;
    const shouldEnable = enable !== undefined ? enable : root.getAttribute('data-theme') !== 'high-contrast';
    if (shouldEnable) {
      root.setAttribute('data-theme', 'high-contrast');
      setHighContrast(true);
    } else {
      root.removeAttribute('data-theme');
      setHighContrast(false);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.setAttribute('data-theme', 'high-contrast');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [highContrast]);

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

  const brand = school.primaryColor || extractedColors.primary || '#4f46e5';
  const secondaryColor = school.secondaryColor || extractedColors.secondary || brand;
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
      title: 'School Library & Resource Center',
      description: 'A quiet, well-structured learning environment stocked with rich literary collections, reference materials, and digital reading portals to cultivate lifelong research and reading habits.',
      icon: 'BookOpen',
      imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200'
    },
    {
      title: 'Computer & Science Innovation Labs',
      description: 'Equipped with modern computer setups, high-speed connectivity, and modern science experimentation kits to provide practical STEM education and digital literacy skills.',
      icon: 'Atom',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200'
    },
    {
      title: 'Sports & Creative Athletics',
      description: 'Dynamic extra-curricular programs spanning team sports, track activities, creative arts, and performing clubs designed to foster teamwork, health, and holistic student growth.',
      icon: 'Sparkles',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200'
    }
  ];

  const pillars = (school.academicsPillars && school.academicsPillars.length > 0)
    ? school.academicsPillars
    : (school.facilities && school.facilities.length > 0)
    ? school.facilities
    : (school.campusPillars && school.campusPillars.length > 0)
    ? school.campusPillars
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

  const defaultEvents = [
    {
      id: 'ev-1',
      title: '1st Term PTA General Executive Meeting',
      date: '2026-09-15',
      time: '10:00 AM - 12:30 PM',
      location: 'Assembly Hall / Online Zoom',
      category: 'PTA Meeting',
      description: 'Bi-annual parent-teacher association meeting discussing term academic targets and facility enhancements.'
    },
    {
      id: 'ev-2',
      title: 'Mid-Term Comprehensive Examinations',
      date: '2026-10-05',
      time: '08:00 AM - 03:00 PM',
      location: 'Academic Classrooms & Exam Halls',
      category: 'Exams',
      description: 'Standardized mid-term assessments across all departments (Primary & JHS).'
    },
    {
      id: 'ev-3',
      title: 'Inter-House Sports & Cultural Festival',
      date: '2026-11-12',
      time: '09:00 AM - 04:00 PM',
      location: 'Main Sports Complex & Oval',
      category: 'Campus Life',
      description: 'Annual inter-house track & field athletics, choir performances, and cultural dance competitions.'
    },
    {
      id: 'ev-4',
      title: 'End of Term Vacation & Awards Day',
      date: '2026-12-18',
      time: '09:30 AM - 01:00 PM',
      location: 'Main Auditorium',
      category: 'Vacation & Awards',
      description: 'End of term speech & prize-giving ceremony honoring academic excellence and leadership achievement.'
    }
  ];

  const eventsList = (Array.isArray(school?.events) && school.events.length > 0)
    ? school.events
    : (Array.isArray(school?.customEvents) && school.customEvents.length > 0)
    ? school.customEvents
    : (Array.isArray(school?.upcomingEvents) && school.upcomingEvents.length > 0)
    ? school.upcomingEvents
    : (Array.isArray(school?.calendarEvents) && school.calendarEvents.length > 0)
    ? school.calendarEvents
    : defaultEvents;

  // ── DYNAMIC INSTITUTIONAL IMPACT STATISTICS RESOLUTION ───────
  const dynamicStats: Array<{
    label: string;
    value: number | string;
    suffix?: string;
    icon?: any;
  }> = (() => {
    // 1. Direct custom statistics array from tenant backend
    if (Array.isArray(school?.customStats) && school.customStats.length > 0) {
      return school.customStats.map((st: any) => ({
        label: st.label || st.title || 'Metric',
        value: st.value || st.number || st.count || 0,
        suffix: st.suffix || '+',
        icon: st.icon === 'Award' ? Award : st.icon === 'Sparkles' ? Sparkles : st.icon === 'User' ? User : Users,
      }));
    }
    if (Array.isArray(school?.stats) && school.stats.length > 0) {
      return school.stats.map((st: any) => ({
        label: st.label || st.title || 'Metric',
        value: st.value || st.number || st.count || 0,
        suffix: st.suffix || '+',
        icon: st.icon === 'Award' ? Award : st.icon === 'Sparkles' ? Sparkles : st.icon === 'User' ? User : Users,
      }));
    }

    // 2. Individual fields populated in school management document
    const items: Array<{ label: string; value: any; suffix: string; icon: any }> = [];
    if (school?.yearsEstablished) {
      items.push({
        label: 'Years of Excellence',
        value: school.yearsEstablished,
        suffix: '+',
        icon: Award,
      });
    }
    if (school?.passRate) {
      items.push({
        label: 'BECE Pass Rate',
        value: school.passRate,
        suffix: '%',
        icon: Sparkles,
      });
    }
    if (school?.staffCount) {
      items.push({
        label: 'Certified Educators',
        value: school.staffCount,
        suffix: '+',
        icon: User,
      });
    }
    if (school?.studentCount) {
      items.push({
        label: 'Enrolled Students',
        value: school.studentCount,
        suffix: '+',
        icon: Users,
      });
    }
    if (school?.programCount) {
      items.push({
        label: 'Academic Programs',
        value: school.programCount,
        suffix: '+',
        icon: BookOpen,
      });
    }

    // 3. Fallback dataset if tenant metrics are unspecified
    if (items.length === 0) {
      return [
        { label: 'Years of Excellence', value: school?.yearsEstablished || 25, suffix: '+', icon: Award },
        { label: 'BECE Pass Rate', value: school?.passRate || 100, suffix: '%', icon: Sparkles },
        { label: 'Certified Educators', value: school?.staffCount || 50, suffix: '+', icon: User },
        { label: 'Enrolled Students', value: school?.studentCount || 500, suffix: '+', icon: Users },
      ];
    }

    return items;
  })();

  const navLinks = [
    { label: 'About', id: 'about' },
    (school.directorMessage || school.principalMessage) && { label: 'Leadership', id: 'leadership' },
    { label: 'Academics', id: 'academics' },
    team.length > 0 && { label: 'Team', id: 'team' },
    eventsList.length > 0 && { label: 'Events', id: 'events' },
    newsList && newsList.length > 0 && { label: 'News', id: 'news' },
    galleryList.length > 0 && { label: 'Gallery', id: 'gallery' },
    testimonialList.length > 0 && { label: 'Reviews', id: 'testimonials' },
    { label: 'Contact', id: 'contact' },
  ].filter(Boolean) as { label: string; id: string }[];

  // ── render ─────────────────────────────────────────────────
  return (
    <div
      className={`min-h-screen bg-white text-slate-900 ${
        highContrast ? 'a11y-high-contrast' : ''
      } ${
        fontSizeStep === 'large'
          ? 'a11y-font-large'
          : fontSizeStep === 'xlarge'
          ? 'a11y-font-xlarge'
          : ''
      } ${reducedMotion ? 'a11y-reduced-motion' : ''}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >

      {/* Google Font & WCAG Accessibility Overrides */}
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

        :root {
          --text-primary: #1F2937;
          --bg-primary: #ffffff;
          --focus-ring: 2px solid #3B82F6;
        }

        [data-theme='high-contrast'] {
          --text-primary: #000000;
          --bg-primary: #ffffff;
          --focus-ring: 4px solid #FFED4A;
          filter: contrast(145%) brightness(105%);
        }

        [data-theme='high-contrast'] a:focus,
        [data-theme='high-contrast'] button:focus {
          outline: var(--focus-ring) !important;
          outline-offset: 2px !important;
        }

        /* Fade-Up on Scroll (CSS) */
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.5, 0, 0, 1);
        }
        .reveal-on-scroll.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* WCAG 2.1 Overrides */
        .a11y-font-large { font-size: 115% !important; }
        .a11y-font-xlarge { font-size: 130% !important; }
        .a11y-reduced-motion *, .a11y-reduced-motion *::before, .a11y-reduced-motion *::after {
          animation: none !important;
          transition: none !important;
          scroll-behavior: auto !important;
        }
      `}</style>

      {/* ─── NAV ────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        navScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* name / crest */}
          <div className="flex items-center gap-3 shrink-0">
            <span
              className="font-black tracking-tight leading-tight transition-colors whitespace-normal break-words"
              style={{
                fontSize: 'clamp(0.85rem, 2vw, 1.15rem)',
                color: navScrolled ? brand : (isLight ? '#1e293b' : 'white')
              }}
            >
              {school.name}
            </span>
            {school.logoUrl && (
              <img src={school.logoUrl} alt={school.name} className="h-10 w-10 shrink-0 object-contain rounded-xl" />
            )}
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
              className={`px-5 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-sm border flex items-center gap-1.5 hover:scale-[1.03] active:scale-[0.97] ${
                navScrolled 
                  ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              <GraduationCap className="h-4 w-4" /> Portal Login
            </a>
            <button
              onClick={() => setA11yOpen(true)}
              className={`p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center ${
                navScrolled 
                  ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              title="Accessibility Settings (WCAG)"
              aria-label="Accessibility Settings"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollTo('apply')}
              className="px-6 py-2.5 rounded-xl text-white text-sm font-black uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-[0.97] hover:shadow-lg shadow-md cursor-pointer"
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

      {/* ─── PWA ADD TO HOME SCREEN PROMPT BANNER ──────────── */}
      {showPwaInstallBanner && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-in slide-in-from-top-6 duration-300">
          <div className="bg-slate-950/95 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3">
              {school.logoUrl ? (
                <img src={school.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded-xl bg-white/10 p-1 shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shrink-0">
                  <GraduationCap className="h-5 w-5" />
                </div>
              )}
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Install {school.name} App</h4>
                <p className="text-[10px] text-slate-400 font-medium">Add to Home Screen for fast app-like access</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleInstallPwa}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Install
              </button>
              <button
                onClick={() => setShowPwaInstallBanner(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <section 
        className="relative min-h-screen flex items-center px-6 overflow-hidden hero-grain"
        style={{ backgroundColor: banners.length > 0 ? '#ffffff' : bannerBgColor }}
      >
        {/* cover image slideshow */}
        {banners.length > 0 ? (
          banners.map((imgUrl: string, idx: number) => (
            <img
              key={idx}
              src={imgUrl}
              alt={`Campus Banner ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                idx === currentBannerIdx ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ filter: 'brightness(1.15) saturate(1.25) contrast(1.05)' }}
            />
          ))
        ) : (
          school.coverImageUrl && (
            <img
              src={school.coverImageUrl}
              alt="Campus"
              className="absolute inset-0 w-full h-full object-cover opacity-100"
              style={{ filter: 'brightness(1.15) saturate(1.25) contrast(1.05)' }}
            />
          )
        )}

        {/* premium glassmorphism glow overlay */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 60% 40%, ${brand}22 0%, transparent 70%)` }}
        />
        {/* Enforced CSS gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.25))' }}
        />

        {/* content: Carleton University Style Left-Aligned Hero Overlay Card */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 flex justify-start items-center">
          <div className="w-full max-w-xl bg-slate-950/85 backdrop-blur-xl border border-white/20 p-8 md:p-12 rounded-[2.5rem] shadow-2xl space-y-6 text-left fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-950/30">
              <Sparkles className="h-3.5 w-3.5 text-yellow-400 animate-pulse" /> Admissions Open
            </span>

            <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.1] tracking-tight drop-shadow-md">
              Join a Smart, Caring Community
            </h1>

            <p className="text-slate-200 text-sm md:text-base leading-relaxed font-medium">
              {school.motto || school.aboutText || 'Find your purpose and excel in academic excellence, leadership development, and moral character with exceptional student support.'}
            </p>

            <div className="pt-2">
              <button
                onClick={() => scrollTo('apply')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-white text-base font-black uppercase tracking-tight shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2.5 border border-white/20 cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}
              >
                <GraduationCap className="h-5 w-5" /> Start Application
              </button>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/40">
          <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Scroll</span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </div>
      </section>

      {/* ─── ANIMATED IMPACT STATISTICS BANNER ─────────────── */}
      {dynamicStats.length > 0 && (
        <section id="impact" className="py-20 px-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor}, ${tertiaryColor})` }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10 space-y-8">
            <div className="text-center">
              <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] bg-white/15 text-white border border-white/20 backdrop-blur-md shadow-sm">
                Institutional Impact
              </span>
            </div>

            <div className={`grid grid-cols-2 ${
              dynamicStats.length >= 4 ? 'lg:grid-cols-4' : dynamicStats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
            } gap-6 md:gap-8`}>
              {dynamicStats.map((st, idx) => (
                <ImpactCounters
                  key={idx}
                  icon={st.icon || Award}
                  label={st.label}
                  targetNumber={st.value}
                  suffix={st.suffix || '+'}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── ABOUT ──────────────────────────────────────────── */}
      <section id="about" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* text */}
            <div className="space-y-6">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border"
                style={{ color: brand, borderColor: `${brand}40`, backgroundColor: `${brand}10` }}
              >
                About Us
              </span>
              <h2 className="serif text-5xl md:text-6xl italic leading-tight" style={{ color: brand }}>
                Welcome to Our Campus
              </h2>
              <div className="prose-school text-lg text-slate-600 leading-relaxed font-medium">
                <ReactMarkdown>
                  {school.aboutText || 'Welcome to our institution where excellence is the standard and every student is empowered to thrive.'}
                </ReactMarkdown>
              </div>
            </div>

            {/* Visual campus banner */}
            <div className="relative aspect-[4/3] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-slate-100 group">
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

          {/* mission / vision / core values responsive 3-column CSS grid */}
          {(school.mission || school.vision || school.coreValues) && (
            <div className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                {school.mission && (
                  <div className="relative p-8 rounded-[2rem] bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-[2rem]" style={{ background: `linear-gradient(90deg, ${brand}, ${brand}80)` }} />
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${brand}15` }}>
                          <Star className="h-6 w-6" style={{ color: brand }} />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-wider" style={{ color: brand }}>Mission</h4>
                      </div>
                      <div className="prose-school text-slate-700 text-sm leading-relaxed font-medium">
                        <ReactMarkdown>{school.mission}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
                {school.vision && (
                  <div className="relative p-8 rounded-[2rem] bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-[2rem]" style={{ background: `linear-gradient(90deg, ${secondaryColor}, ${secondaryColor}80)` }} />
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${secondaryColor}15` }}>
                          <BookOpen className="h-6 w-6" style={{ color: secondaryColor }} />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-wider" style={{ color: secondaryColor }}>Vision</h4>
                      </div>
                      <div className="prose-school text-slate-700 text-sm leading-relaxed font-medium">
                        <ReactMarkdown>{school.vision}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
                {school.coreValues && (
                  <div className="relative p-8 rounded-[2rem] bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md flex flex-col justify-between overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 rounded-t-[2rem]" style={{ background: `linear-gradient(90deg, ${tertiaryColor}, ${tertiaryColor}80)` }} />
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${tertiaryColor}15` }}>
                          <Award className="h-6 w-6" style={{ color: tertiaryColor }} />
                        </div>
                        <h4 className="text-xl font-black uppercase tracking-wider" style={{ color: tertiaryColor }}>Core Values</h4>
                      </div>
                      <div className="prose-school text-slate-700 text-sm leading-relaxed font-medium">
                        <ReactMarkdown>{school.coreValues}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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

          {/* Departments Horizontal Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {departments.map((dept: any, i: number) => {
              const hasImg = !!dept.imageUrl;
              return (
                <ScrollReveal key={i} delayMs={i * 120} className="h-full">
                  <div
                    className="relative rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-white border border-slate-100/80 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group flex flex-col justify-between overflow-hidden h-full"
                  >
                    <div>
                      {/* Designated space for an illustrative icon or photo */}
                      {hasImg ? (
                        <div className="relative h-48 w-full overflow-hidden">
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
                      ) : (
                        <div className="h-48 w-full bg-indigo-50/60 border-b border-indigo-100/50 flex flex-col items-center justify-center relative p-6">
                          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-indigo-100 group-hover:scale-110 transition-transform mb-3">
                            <GraduationCap className="h-7 w-7 text-indigo-600" />
                          </div>
                          {dept.ageRange && (
                            <span className="text-[10px] font-black tracking-widest uppercase px-3 py-1 bg-white text-indigo-700 border border-indigo-100 rounded-full font-mono shadow-xs">
                              {dept.ageRange}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="p-8 space-y-3">
                        <h3 className="text-xl font-black tracking-tight text-slate-800">{dept.level}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium line-clamp-3">{dept.focus}</p>
                      </div>
                    </div>

                    {/* Standardized "Inquire" text link */}
                    <div 
                      onClick={() => {
                        setAdmissionTab('enquiry');
                        scrollTo('apply');
                      }}
                      className="mx-8 mb-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer group/link"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Facilities / Campus Life Alternating Layout */}
          {school.showAcademicsPillars !== false && pillars.length > 0 && (
            <div className="space-y-12 pt-12 border-t border-slate-100">
              <div className="text-center space-y-3">
                <span
                  className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border"
                  style={{ color: brand, borderColor: `${brand}40`, backgroundColor: `${brand}10` }}
                >
                  Facilities & Infrastructure
                </span>
                <h3 className="serif text-4xl md:text-5xl italic font-black" style={{ color: brand }}>
                  Campus Life & Resources
                </h3>
              </div>

              <div className="space-y-12">
                {pillars.map((pillar: any, idx: number) => {
                  const isEven = idx % 2 === 0;
                  const facilityImg = pillar.imageUrl || pillar.photoUrl || pillar.image || pillar.buildingImg || pillar.photo || (
                    idx === 0
                      ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200'
                      : idx === 1
                      ? 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200'
                      : 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200'
                  );

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-10 lg:gap-14 bg-gradient-to-br from-slate-50 to-white border border-slate-100 rounded-[2.5rem] p-8 lg:p-12 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden`}
                    >
                      {/* Visual proof photo */}
                      <div className="w-full lg:w-1/2 aspect-[16/10] rounded-[2rem] overflow-hidden shadow-md border border-slate-200/80 relative group shrink-0">
                        <img
                          src={facilityImg}
                          alt={pillar.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-4 left-6 z-10 flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                            {getPillarIcon(pillar.icon)}
                          </div>
                          <span className="text-xs font-black uppercase tracking-widest text-white font-mono drop-shadow-sm">
                            Facility 0{idx + 1}
                          </span>
                        </div>
                      </div>

                      {/* Text details */}
                      <div className="w-full lg:w-1/2 space-y-5">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em]">
                          {getPillarIcon(pillar.icon)}
                          <span>Facility Highlight</span>
                        </div>
                        <h3 className="text-3xl font-black tracking-tight text-slate-900">{pillar.title}</h3>
                        <p className="text-slate-600 text-base leading-relaxed font-medium">{pillar.description}</p>
                      </div>
                    </div>
                  );
                })}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {team.map((member, idx) => {
                const rawName = member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim();
                const isAllCaps = (s: string) => s === s.toUpperCase() && s.length > 3;
                const toTitleCase = (s: string) => s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
                const toSentenceCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
                const name = isAllCaps(rawName) ? toTitleCase(rawName) : rawName;

                const photo = member.photoUrl || member.publicPhotoUrl;
                const rawBio = member.bio || member.publicBio || '';
                const bio = rawBio.replace(/^"|"$/g, '').trim();
                const role = member.role ? (isAllCaps(member.role) ? toTitleCase(member.role) : member.role) : '';
                const qualificationsList = (member.qualifications || '')
                  .split(/[,;\n]/)
                  .map((q: string) => q.trim())
                  .filter(Boolean);

                return (
                  <ScrollReveal key={member.id || idx} delayMs={idx * 100} className="h-full">
                    <div
                      className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl group flex flex-col items-center text-center justify-between h-full cursor-pointer overflow-hidden"
                    >
                      <div className="w-full flex flex-col items-center space-y-4">
                        {/* Avatar Image with sleek circular mask & GAM Edu Silhouette fallback */}
                        <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-slate-200 via-slate-100 to-indigo-100 shadow-inner shrink-0 mb-2 overflow-hidden">
                          <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center relative">
                            {photo ? (
                              <img
                                src={photo}
                                alt={name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              /* Polished GAM Edu Default Silhouette */
                              <div className="w-full h-full bg-gradient-to-br from-indigo-50 via-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400 relative transition-transform duration-500 group-hover:scale-110">
                                <User className="h-14 w-14 text-slate-400" />
                                <div className="absolute bottom-1 px-2 py-0.5 rounded-full bg-indigo-600/10 text-[7px] font-black uppercase tracking-widest text-indigo-700 font-mono">
                                  GAM EDU
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bold Name */}
                        <h4 className="text-xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                          {name}
                        </h4>

                        {/* Muted Title/Role */}
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                          {role || 'Faculty Educator'}
                        </p>

                        {/* Bio excerpt if available */}
                        {bio && (
                          <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2 px-2">
                            {isAllCaps(bio) ? toSentenceCase(bio) : bio}
                          </p>
                        )}
                      </div>

                      {/* Bulleted List for Qualifications */}
                      {qualificationsList.length > 0 && (
                        <div className="w-full pt-5 border-t border-slate-100 space-y-2 mt-6">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block text-left">
                            Qualifications
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-650 font-medium text-left">
                            {qualificationsList.map((q: string, qIdx: number) => (
                              <li key={qIdx} className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: brand }} />
                                <span className="leading-snug">{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── VIDEOS ─────────────────────────────────────────── */}
      {validVideos.length > 0 && (
        <section id="videos" className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <SectionHeader eyebrow="Media" title="Video Showcase" color={brand} />

            <div className="grid md:grid-cols-2 gap-10">
              {validVideos.map((video: any, i: number) => (
                <div key={i} className="space-y-4">
                  <div className="rounded-3xl overflow-hidden aspect-video shadow-xl border border-slate-100">
                    <iframe
                      width="100%" height="100%"
                      src={`https://www.youtube.com/embed/${video.ytId}?rel=0&modestbranding=1`}
                      title={video.title || `Video ${i + 1}`}
                      frameBorder="0" allowFullScreen
                    />
                  </div>
                  {video.title && (
                    <p className="text-center text-lg font-bold text-slate-700">{video.title}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── GALLERY ────────────────────────────────────────── */}
      {galleryList.length > 0 && (
        <section id="gallery" className="py-32 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-12">
            <SectionHeader eyebrow="Campus Life" title={`Life at ${school.name}`} color={brand} />

            {/* Masonry Grid layout limiting initial display to max 8 thumbnails */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {galleryList.slice(0, 8).map((item: any, i: number) => {
                const imgUrl = item.url || item;
                const isLastInitial = i === 7 && galleryList.length > 8;
                const remainingCount = galleryList.length - 8;

                return (
                  <div
                    key={i}
                    onClick={() => {
                      setActiveImageIdx(i);
                      setGalleryOpen(true);
                    }}
                    className={`group relative overflow-hidden rounded-[2rem] shadow-sm border-2 border-white/80 card-hover cursor-pointer transition-all duration-300 ${
                      i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={item.caption || `Gallery photo ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors" />

                    {/* If 8th image and there are remaining photos, show overlay */}
                    {isLastInitial ? (
                      <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center">
                        <span className="text-3xl font-black font-mono">+{remainingCount}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-1">More Photos</span>
                      </div>
                    ) : (
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-md p-2 rounded-xl border border-white/30 text-white">
                        <Camera className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* View Full Gallery Button */}
            <div className="text-center pt-4">
              <button
                onClick={() => {
                  setActiveImageIdx(0);
                  setGalleryOpen(true);
                }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 text-xs font-black uppercase tracking-widest shadow-md hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Camera className="h-4 w-4 text-indigo-600" />
                <span>View Full Gallery ({galleryList.length} Photos)</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ─── UPCOMING EVENTS CALENDAR WIDGET ───────────────── */}
      {eventsList.length > 0 && (
        <section id="events" className="py-32 px-6 bg-slate-50 border-t border-b border-slate-100">
          <div className="max-w-7xl mx-auto space-y-16">
            <SectionHeader eyebrow="Campus Calendar" title="Upcoming Events & Schedules" color={brand} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {eventsList.slice(0, 3).map((ev: any, idx: number) => {
                let monthStr = 'SEP';
                let dayStr = '15';
                if (ev.date) {
                  try {
                    const [y, m, d] = ev.date.split('-');
                    if (y && m && d) {
                      const dt = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                      monthStr = format(dt, 'MMM').toUpperCase();
                      dayStr = format(dt, 'dd');
                    }
                  } catch {
                    // Fallback
                  }
                }

                return (
                  <ScrollReveal key={ev.id || idx} delayMs={idx * 120} className="h-full">
                    <div
                      className="bg-white rounded-[2rem] p-6 border border-slate-200/80 shadow-sm transition-all duration-300 hover:shadow-md card-hover flex gap-5 items-start group h-full"
                    >
                      {/* Date Badge pulled to the left side */}
                      <div
                        className="flex flex-col items-center justify-center w-20 h-22 rounded-2xl shrink-0 text-white shadow-md transition-transform group-hover:scale-105"
                        style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}
                      >
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-85 font-mono">
                          {monthStr}
                        </span>
                        <span className="text-3xl font-black font-mono leading-none mt-1">
                          {dayStr}
                        </span>
                      </div>

                      {/* Event Details (Visually locked flex-1) */}
                      <div className="space-y-2.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border"
                            style={{ color: brand, borderColor: `${brand}30`, backgroundColor: `${brand}10` }}
                          >
                            {ev.category || 'Event'}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {ev.title}
                        </h4>

                        {ev.time && (
                          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 font-mono pt-0.5">
                            <Calendar className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                            <span>{ev.time}</span>
                          </p>
                        )}

                        {ev.location && (
                          <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 truncate">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            <span className="truncate">{ev.location}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── NEWS ───────────────────────────────────────────── */}
      {newsList && newsList.length > 0 && (
        <section id="news" className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <SectionHeader eyebrow="Bulletins" title="News & Updates" color={brand} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
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
                    className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm card-hover flex flex-col justify-between group h-full"
                  >
                    <div>
                      {/* Featured image or placeholder with floating top-left date badge */}
                      <div className="h-52 w-full overflow-hidden relative bg-slate-100 shrink-0">
                        {/* Floating top-left Date Badge */}
                        <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-white/40 shadow-md text-slate-900 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 font-mono">
                          <Calendar className="h-3.5 w-3.5" style={{ color: currentAccent }} />
                          <span>{formattedDate}</span>
                        </div>

                        {news.imageUrl ? (
                          <img
                            src={news.imageUrl}
                            alt={news.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          /* Featured Image Placeholder */
                          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-center relative p-6 text-white text-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 border border-white/15">
                              <Megaphone className="h-6 w-6 text-indigo-300" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60 font-mono">
                              Official Bulletin
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-8 space-y-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white"
                            style={{ backgroundColor: currentAccent }}
                          >
                            {news.type || 'Update'}
                          </span>
                        </div>

                        {/* Bold Headline */}
                        <h3
                          className="text-xl font-black text-slate-900 leading-snug tracking-tight hover:text-indigo-600 transition-colors line-clamp-2 cursor-pointer"
                          onClick={() => setSelectedNews(news)}
                        >
                          {news.title}
                        </h3>

                        {/* Auto-Truncated Excerpt */}
                        <p
                          className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-3 cursor-pointer"
                          onClick={() => setSelectedNews(news)}
                        >
                          {news.content}
                        </p>
                      </div>
                    </div>

                    <div className="px-8 pb-8 pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <button
                        onClick={() => setSelectedNews(news)}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-left bg-transparent border-0 p-0 focus:outline-none"
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: currentAccent }}>
                          Read Bulletin
                        </span>
                        <ArrowRight className="h-3.5 w-3.5" style={{ color: currentAccent }} />
                      </button>
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
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}


      {/* ─── TESTIMONIALS / SOCIAL PROOF CAROUSEL ──────────── */}
      {testimonialList.length > 0 && (
        <section id="testimonials" className="py-32 px-6 bg-slate-900 text-white relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none opacity-10" style={{ backgroundColor: brand }} />

          <div className="max-w-6xl mx-auto space-y-16 relative z-10">
            <SectionHeader eyebrow="Community Trust" title="What Parents & Alumni Say" color="#ffffff" />

            {/* Testimonials 3-Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {testimonialList.map((t: any, idx: number) => {
                const quote = t.quote || t.text || t.comment || t.review || t.content || '';
                const name = t.name || t.author || t.parentName || t.studentName || 'Parent / Alumni';
                const role = t.role || t.title || t.relation || 'Parent';
                const avatar = t.avatar || t.photoUrl || t.imageUrl || t.image;
                const rating = t.rating || 5;

                const isSelected = idx === activeTestimonialIdx;
                return (
                  <ScrollReveal key={idx} delayMs={idx * 120} className="h-full">
                    <div
                      onClick={() => setActiveTestimonialIdx(idx)}
                      className={`bg-slate-950/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 border transition-all duration-500 flex flex-col justify-between cursor-pointer group h-full ${
                        isSelected
                          ? 'border-indigo-500/80 shadow-2xl shadow-indigo-500/10 scale-105 bg-slate-950'
                          : 'border-white/10 hover:border-white/20 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="space-y-6">
                        {/* Rating Stars & Quote Icon */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {[...Array(rating)].map((_, starIdx) => (
                              <Star key={starIdx} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <Quote className="h-8 w-8 text-white/20 group-hover:text-indigo-400/40 transition-colors" />
                        </div>

                        {/* Quote Text */}
                        <p className="text-base text-slate-300 leading-relaxed italic font-medium">
                          "{quote}"
                        </p>
                      </div>

                      {/* Author Footer */}
                      <div className="flex items-center gap-4 pt-6 mt-6 border-t border-white/10">
                        {avatar ? (
                          <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400/40 shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                            {name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="text-base font-bold text-white leading-tight">{name}</h4>
                          <p className="text-xs text-indigo-300/80 font-medium mt-0.5">{role}</p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setActiveTestimonialIdx(prev => (prev > 0 ? prev - 1 : testimonialList.length - 1))}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2">
                {testimonialList.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonialIdx(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeTestimonialIdx ? 'w-8 bg-indigo-400' : 'w-2.5 bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={() => setActiveTestimonialIdx(prev => (prev < testimonialList.length - 1 ? prev + 1 : 0))}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
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
            <div className="lg:col-span-7 space-y-6">
              {/* Tab Selector */}
              <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-full max-w-sm">
                <button
                  type="button"
                  onClick={() => setAdmissionTab('enquiry')}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                    admissionTab === 'enquiry'
                      ? 'bg-white text-slate-800 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-700 font-semibold'
                  }`}
                >
                  Enquire Online
                </button>
                <button
                  type="button"
                  onClick={() => setAdmissionTab('apply')}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                    admissionTab === 'apply'
                      ? 'bg-white text-slate-800 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-700 font-semibold'
                  }`}
                >
                  Start Application
                </button>
              </div>

              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="h-2" style={{ background: `linear-gradient(90deg, ${brand}, ${secondaryColor}, ${tertiaryColor})` }} />
                <div className="p-10 md:p-14">
                  {admissionTab === 'enquiry' ? (
                    <AdmissionEnquiryForm schoolId={school.id} primaryColor={brand} />
                  ) : (
                    <AdmissionForm schoolId={school.id} primaryColor={brand} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER & CONTACT US ───────────────────────────────── */}
      <footer id="contact" className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-400 border-t border-slate-900 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none opacity-[0.04]" style={{ backgroundColor: brand }} />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none opacity-[0.03]" style={{ backgroundColor: secondaryColor }} />

        {/* Carleton-Style Institutional Land & Mission Acknowledgment */}
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center border-b border-white/10 relative z-10">
          <p className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-slate-300 font-mono leading-relaxed max-w-4xl mx-auto">
            {school.name} acknowledges and celebrates the rich cultural heritage, academic excellence, and moral leadership across all our learning communities.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative z-10 space-y-16">
          {/* Multi-Column 4-Column Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10 pb-16 border-b border-white/10">

            {/* Column 1: School Logo & Short About Text Clamp */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <h4 className="serif text-2xl italic text-white tracking-wide leading-tight font-bold">{school.name}</h4>
                {school.logoUrl ? (
                  <div className="p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl shrink-0">
                    <img src={school.logoUrl} alt="Logo" className="h-10 w-10 object-contain" />
                  </div>
                ) : (
                  <div className="p-2.5 rounded-2xl shadow-xl shrink-0" style={{ backgroundImage: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}>
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                )}
              </div>

              <p className="text-sm text-slate-400 leading-relaxed font-medium line-clamp-4">
                {school.aboutText || school.motto || 'Dedicated to academic excellence, leadership development, and character building in a supportive learning environment.'}
              </p>

              {school.website && (
                <a
                  href={school.website.startsWith('http') ? school.website : `https://${school.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-white transition-colors pt-2"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>{school.website}</span>
                </a>
              )}
            </div>

            {/* Column 2: Quick Links (auto-generated from navigation tree) */}
            <div className="space-y-4">
              <h5 className="text-xs font-black uppercase tracking-[0.2em] text-white">Quick Links</h5>
              <ul className="space-y-2.5 text-sm font-semibold">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollTo(link.id)}
                      className="text-slate-400 hover:text-white transition-colors flex items-center gap-2.5 group/link cursor-pointer"
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-400 transition-transform group-hover/link:translate-x-1" />
                      <span>{link.label}</span>
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => scrollTo('apply')}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2.5 group/link cursor-pointer"
                  >
                    <ArrowRight className="h-3.5 w-3.5 text-indigo-400 transition-transform group-hover/link:translate-x-1" />
                    <span>Apply Now</span>
                  </button>
                </li>
                <li>
                  <a
                    href="https://gam-it-service.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2.5 group/link"
                  >
                    <GraduationCap className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Portal Login ↗</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Details using unified SVG icons */}
            <div className="space-y-4">
              <h5 className="text-xs font-black uppercase tracking-[0.2em] text-white">Contact Details</h5>
              <div className="space-y-4 text-sm font-medium">
                {school.address && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(school.address)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:border-indigo-400/50">
                      <MapPin className="h-4 w-4 text-indigo-400" />
                    </div>
                    <span className="leading-snug line-clamp-2">{school.address}</span>
                  </a>
                )}

                {school.phone && (
                  <a
                    href={getCleanPhoneLink(school.phone)}
                    className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-indigo-400/50">
                      <Phone className="h-4 w-4 text-indigo-400" />
                    </div>
                    <span>{school.phone}</span>
                  </a>
                )}

                {school.email && (
                  <a
                    href={`mailto:${school.email.trim()}`}
                    className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover/item:border-indigo-400/50">
                      <Mail className="h-4 w-4 text-indigo-400" />
                    </div>
                    <span className="truncate">{school.email}</span>
                  </a>
                )}

                {school.whatsappNumber && (
                  <a
                    href={getCleanWhatsAppLink(school.whatsappNumber)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 text-emerald-400 hover:text-emerald-300 transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center shrink-0 group-hover/item:border-emerald-500/50">
                      <MessageCircle className="h-4 w-4 text-emerald-400" />
                    </div>
                    <span>WhatsApp: {school.whatsappNumber}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Column 4: Embedded Google Maps iframe block */}
            <div className="space-y-4">
              <h5 className="text-xs font-black uppercase tracking-[0.2em] text-white">Find Our Campus</h5>
              <div className="h-48 w-full rounded-2xl overflow-hidden border border-white/15 bg-slate-900 relative shadow-lg group">
                <iframe
                  title="School Location Map"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    school.gpsCoordinates || (school.latitude && school.longitude ? `${school.latitude},${school.longitude}` : null) || school.address || school.name
                  )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0 filter saturate-90 brightness-95 group-hover:brightness-100 transition-all duration-300"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between text-[10px] text-white">
                  <span className="font-mono truncate max-w-[140px]">
                    {school.gpsCoordinates || school.address || school.name}
                  </span>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      school.gpsCoordinates || (school.latitude && school.longitude ? `${school.latitude},${school.longitude}` : null) || school.address || school.name
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 font-bold hover:underline shrink-0 ml-1"
                  >
                    View Map ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Carleton-Style Contact Sub-Header Line */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400 font-mono pt-2">
            <div>
              <span>Contact us by </span>
              {school.phone && (
                <a href={getCleanPhoneLink(school.phone)} className="text-indigo-400 hover:text-white underline">phone</a>
              )}
              {school.phone && school.email && <span> or </span>}
              {school.email && (
                <a href={`mailto:${school.email.trim()}`} className="text-indigo-400 hover:text-white underline">email</a>
              )}
            </div>

            {school.address && (
              <div className="text-center text-slate-300 font-sans font-semibold normal-case">
                {school.address}
              </div>
            )}

            {/* Social media icons */}
            <div className="flex items-center gap-4 text-slate-300">
              {school.facebookUrl && (
                <a href={school.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {school.instagramUrl && (
                <a href={school.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {school.linkedinUrl && (
                <a href={school.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-sky-400 transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Carleton University Signature Dynamic Curved Brand Swoosh Banner */}
        <div className="relative w-full overflow-hidden pt-24 pb-16 bg-slate-950 border-t border-slate-900/80">
          {/* Dual Layered Dynamic Brand Swoosh Waves (Adapts dynamically to school primary & secondary brand colors) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg
              className="absolute bottom-0 left-0 w-full h-48 md:h-64"
              viewBox="0 0 1440 320"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Secondary Brand Color Curve Accent */}
              <path
                d="M0,192 C320,300 640,120 960,220 C1280,320 1440,180 1440,180 L1440,320 L0,320 Z"
                fill={secondaryColor}
                opacity="0.85"
              />
              {/* Primary Brand Color Swoosh Wave (School Primary Accent / Carleton Red Swoosh) */}
              <path
                d="M0,240 C360,140 720,280 1080,180 C1260,130 1440,220 1440,220 L1440,320 L0,320 Z"
                fill={brand}
              />
            </svg>
          </div>

          {/* Centered Carleton-Style Institutional Logo & Crest Banner */}
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 px-6 pt-4">
            <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl transition-transform hover:scale-105 duration-300">
              {school.logoUrl ? (
                <img src={school.logoUrl} alt={school.name} className="h-14 md:h-20 object-contain drop-shadow-md" />
              ) : (
                <GraduationCap className="h-12 w-12 text-white drop-shadow-md" />
              )}
            </div>
            <h3 className="serif text-3xl md:text-5xl italic text-white font-black drop-shadow-md tracking-tight">
              {school.name}
            </h3>
            {school.address && (
              <p className="text-xs uppercase tracking-[0.25em] text-white/90 font-bold font-mono drop-shadow-sm">
                {school.address}
              </p>
            )}

            <div className="pt-6 text-[11px] font-bold uppercase tracking-widest text-white/70">
              &copy; {new Date().getFullYear()} {school.name}. All Rights Reserved. Powered by GAM Edu Platform.
            </div>
          </div>
        </div>
      </footer>

      {/* ─── NEWS DETAILED MODAL ─────────────────────────────── */}
      {selectedNews && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-slate-100 relative animate-in zoom-in-95 duration-200">
            {/* Header/Banner Image if available */}
            {selectedNews.imageUrl && (
              <div className="h-56 w-full overflow-hidden bg-slate-100 relative shrink-0">
                <img src={selectedNews.imageUrl} alt={selectedNews.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent" />
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-5 right-5 z-10 p-2.5 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-700 hover:text-slate-900 transition-colors shadow-sm"
            >
              <X size={18} />
            </button>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <span
                  className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm"
                  style={{ backgroundColor: brand }}
                >
                  {selectedNews.type || 'Update'}
                </span>
                {selectedNews.date && (
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {(() => {
                      try {
                        const [y, m, d] = selectedNews.date.split('-');
                        if (y && m && d) {
                          return format(new Date(parseInt(y), parseInt(m) - 1, parseInt(d)), 'dd MMM yyyy');
                        }
                        return selectedNews.date;
                      } catch {
                        return selectedNews.date;
                      }
                    })()}
                  </span>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                {selectedNews.title}
              </h2>

              <div className="prose prose-slate text-sm leading-relaxed text-slate-650 font-medium whitespace-pre-wrap">
                {selectedNews.content}
              </div>
              
              {selectedNews.videoUrl && (
                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <a
                    href={selectedNews.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest shadow-md transition-all hover:-translate-y-0.5"
                  >
                    <Video className="h-4 w-4" /> Watch Video ↗
                  </a>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                {school.logoUrl && (
                  <img src={school.logoUrl} alt={school.name} className="h-6 w-6 object-contain rounded-md" />
                )}
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {school.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="px-6 py-2 rounded-xl text-xs font-bold text-slate-650 hover:bg-slate-200/50 hover:text-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── FULL GALLERY LIGHTBOX MODAL ────────────────────── */}
      {galleryOpen && activeImageIdx !== null && galleryList.length > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-6 md:p-10 animate-in fade-in duration-300">
          {/* Header */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <Camera className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white tracking-tight">{school.name} Photo Gallery</h4>
                <p className="text-xs text-white/60 font-mono">
                  Photo {activeImageIdx + 1} of {galleryList.length}
                </p>
              </div>
            </div>

            <button
              onClick={() => setGalleryOpen(false)}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all hover:scale-105 cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main Viewing Area with Prev/Next Controls */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {/* Prev Button */}
            <button
              onClick={() => setActiveImageIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : galleryList.length - 1))}
              className="absolute left-2 md:left-6 z-20 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Active Image */}
            <div className="max-w-5xl max-h-[70vh] flex flex-col items-center justify-center p-2 relative">
              <img
                src={galleryList[activeImageIdx]?.url || galleryList[activeImageIdx]}
                alt={galleryList[activeImageIdx]?.caption || `Photo ${activeImageIdx + 1}`}
                className="max-h-[65vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
              />
              {galleryList[activeImageIdx]?.caption && (
                <p className="text-sm font-medium text-white/80 mt-4 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
                  {galleryList[activeImageIdx].caption}
                </p>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => setActiveImageIdx((prev) => (prev !== null && prev < galleryList.length - 1 ? prev + 1 : 0))}
              className="absolute right-2 md:right-6 z-20 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all hover:scale-110 cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Bottom Thumbnail Strip */}
          <div className="flex items-center justify-center gap-3 overflow-x-auto py-2 px-4 shrink-0 max-w-full">
            {galleryList.map((item: any, idx: number) => {
              const url = item.url || item;
              const isActive = idx === activeImageIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    isActive ? 'border-indigo-400 scale-110 shadow-lg shadow-indigo-500/20' : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── GLOBAL STICKY FLOATING ACTION BUTTON (FAB) ───────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Expanded Quick Contact Menu */}
        {fabOpen && (
          <div className="bg-slate-950/95 backdrop-blur-xl border border-white/15 p-3 rounded-3xl shadow-2xl space-y-2.5 animate-in slide-in-from-bottom-5 fade-in duration-200 min-w-[210px]">
            <div className="px-3 py-1.5 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Quick Connect
            </div>

            {/* WhatsApp */}
            <a
              href={getCleanWhatsAppLink(school.whatsappNumber || '+233000000000')}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs font-bold hover:bg-emerald-900/60 transition-all group"
            >
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <MessageCircle className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <span>WhatsApp Us</span>
            </a>

            {/* Call */}
            {school.phone && (
              <a
                href={getCleanPhoneLink(school.phone)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all group"
              >
                <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                </div>
                <span>Call Campus</span>
              </a>
            )}

            {/* Apply Now */}
            <button
              onClick={() => {
                setFabOpen(false);
                scrollTo('apply');
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-indigo-600 border border-indigo-500 text-white text-xs font-bold hover:bg-indigo-500 transition-all group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <GraduationCap className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
              </div>
              <span>Start Application</span>
            </button>
          </div>
        )}

        {/* Main Trigger FAB */}
        <button
          onClick={() => setFabOpen(!fabOpen)}
          aria-label="Toggle Quick Contact Menu"
          className="w-14 h-14 rounded-full text-white shadow-2xl flex items-center justify-center border border-white/20 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer relative group"
          style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}
        >
          {fabOpen ? (
            <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
          ) : (
            <>
              <MessageCircle className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </>
          )}
        </button>
      {/* ─── ACCESSIBILITY (WCAG 2.1) CONTROL TOOLBAR MODAL ── */}
      {a11yOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Accessibility (WCAG 2.1)</h3>
                  <p className="text-xs text-slate-500 font-medium">Display & Contrast Enhancements</p>
                </div>
              </div>
              <button
                onClick={() => setA11yOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                aria-label="Close Accessibility Controls"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* High Contrast Mode */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">High Contrast Mode</span>
                    <span className="text-xs text-slate-500 font-medium">Enhanced contrast & clarity</span>
                  </div>
                </div>
                <button
                  onClick={() => setHighContrast(!highContrast)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    highContrast ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle High Contrast Mode"
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Font Size Scaling */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <Type className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Text Size Scaling</span>
                    <span className="text-xs text-slate-500 font-medium">Adjust font sizing</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {(['normal', 'large', 'xlarge'] as const).map((step) => (
                    <button
                      key={step}
                      onClick={() => setFontSizeStep(step)}
                      className={`py-2 px-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                        fontSizeStep === step
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {step === 'normal' ? 'Standard' : step === 'large' ? 'Large +15%' : 'Extra +30%'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <ZapOff className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">Pause Animations</span>
                    <span className="text-xs text-slate-500 font-medium">Disable keyframes & motion</span>
                  </div>
                </div>
                <button
                  onClick={() => setReducedMotion(!reducedMotion)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                    reducedMotion ? 'bg-amber-600' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle Pause Animations"
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    reducedMotion ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => {
                  setHighContrast(false);
                  setFontSizeStep('normal');
                  setReducedMotion(false);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset Default
              </button>
              <button
                onClick={() => setA11yOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-md cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}


