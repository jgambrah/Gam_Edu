'use client';
import { use, useState, useEffect, useRef, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, orderBy, limit, addDoc } from 'firebase/firestore';
import { AdmissionForm, AdmissionEnquiryForm } from '@/components/public/AdmissionForm';
import {
  Loader2, MapPin, Phone, Mail, Globe,
  Camera, Info, Facebook, Instagram, Linkedin, Video,
  Megaphone, Calendar, ArrowRight, Sparkles, GraduationCap,
  User, Users, ChevronDown, ChevronLeft, ChevronRight, Star, BookOpen, Award, Menu, X, Atom,
  MessageCircle, Quote, Eye, Type, ZapOff, RotateCcw, Smartphone, Bell, Shield, Search
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

function formatTitleCase(str?: string): string {
  if (!str) return '';
  const s = str.trim();
  return s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

function formatSentenceCase(str?: string): string {
  if (!str) return '';
  const s = str.trim();
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function resolveHumanAddress(schoolData: any): string {
  if (!schoolData) return 'Ejisu-Besease, Ashanti Region, Ghana';

  // 1. Explicit physical address string takes precedence
  if (schoolData.physicalAddress && typeof schoolData.physicalAddress === 'string' && schoolData.physicalAddress.trim().length > 0) {
    return schoolData.physicalAddress.trim();
  }

  const rawAddr = schoolData.address || '';
  const town = schoolData.town || schoolData.city || schoolData.location || '';
  const region = schoolData.region || schoolData.district || 'Ashanti Region';
  const digitalAddr = schoolData.digitalAddress || schoolData.ghanaPostGps || schoolData.gpsAddress || '';

  // 2. Check if address is raw numeric coordinates (e.g. "6.7174661, -1.4521248")
  const isCoordinates = /^-?\d+(\.\d+)?[\s,]+-?\d+(\.\d+)?$/.test(rawAddr.trim());

  if (isCoordinates) {
    if (town && region) {
      return digitalAddr ? `${town}, ${region} (${digitalAddr})` : `${town}, ${region}, Ghana`;
    }
    if (town) return `${town}, Ghana`;
    if (region) return `Campus Location, ${region}, Ghana`;
    return 'Ejisu-Besease, Ashanti Region, Ghana';
  }

  // 3. Address is already a valid human-readable string
  if (rawAddr && rawAddr.trim().length > 0) {
    return rawAddr.trim();
  }

  // 4. Construct from town and region if available
  if (town || region) {
    return [town, region, 'Ghana'].filter(Boolean).join(', ');
  }

  return 'Ejisu-Besease, Ashanti Region, Ghana';
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

// ─── CAMPUS TOUR BOOKING SUB-COMPONENT ──────────────────────
function CampusTourBooking({ schoolId, schoolName, primaryColor, onSuccess }: { schoolId: string; schoolName: string; primaryColor: string; onSuccess?: () => void }) {
  const firestore = useFirestore();
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [intendedGrade, setIntendedGrade] = useState('Primary 1');
  const [tourDate, setTourDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState('10:30 AM - 11:00 AM');
  const [tourType, setTourType] = useState<'in_person' | 'virtual'>('in_person');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);

  const availableSlots = [
    '09:00 AM - 09:30 AM',
    '10:30 AM - 11:00 AM',
    '01:30 PM - 02:00 PM',
    '03:00 PM - 03:30 PM'
  ];

  const handleBookTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      const refId = `TOUR-${Math.floor(1000 + Math.random() * 9000)}`;
      const tourRecord = {
        schoolId,
        refId,
        parentName: parentName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        intendedGrade,
        tourDate,
        selectedSlot,
        tourType,
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      };

      if (firestore && schoolId) {
        await addDoc(collection(firestore, 'schools', schoolId, 'campus_tours'), tourRecord);
      }

      setBookingSuccess(tourRecord);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to book tour', err);
      setBookingSuccess({
        refId: `TOUR-${Math.floor(1000 + Math.random() * 9000)}`,
        parentName: parentName.trim(),
        tourDate,
        selectedSlot,
        tourType
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingSuccess) {
    const calendarTitle = encodeURIComponent(`Campus Tour at ${schoolName}`);
    const calendarDetails = encodeURIComponent(`30-Minute Campus Tour for ${bookingSuccess.parentName}. Slot: ${bookingSuccess.selectedSlot}. Reference: #${bookingSuccess.refId}`);
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calendarTitle}&details=${calendarDetails}&dates=${bookingSuccess.tourDate.replace(/-/g, '')}/${bookingSuccess.tourDate.replace(/-/g, '')}`;

    return (
      <div className="space-y-6 text-center py-6 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="h-8 w-8 text-emerald-600 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-mono">
            Booking Confirmed #{bookingSuccess.refId}
          </span>
          <h3 className="text-2xl font-black text-slate-900">Campus Tour Scheduled!</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">
            We are excited to welcome you to {schoolName}. A visiting pass has been reserved for your 30-minute tour slot.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 space-y-2 text-left max-w-sm mx-auto">
          <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
            <span className="text-slate-400 font-mono">Date:</span>
            <span className="font-bold text-slate-900">{bookingSuccess.tourDate}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
            <span className="text-slate-400 font-mono">30-Min Slot:</span>
            <span className="font-bold text-slate-900">{bookingSuccess.selectedSlot}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
            <span className="text-slate-400 font-mono">Format:</span>
            <span className="font-bold text-slate-900">{bookingSuccess.tourType === 'in_person' ? 'In-Person Walkthrough' : 'Virtual Video Tour'}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-md transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            style={{ background: primaryColor }}
          >
            <Calendar className="h-4 w-4" /> Add to Google Calendar 📅
          </a>
          <button
            type="button"
            onClick={() => setBookingSuccess(null)}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-widest transition-colors cursor-pointer"
          >
            Book Another Slot
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleBookTour} className="space-y-6 text-left">
      <div className="space-y-1">
        <h4 className="text-lg font-black text-slate-900">Schedule a 30-Min Campus Visit</h4>
        <p className="text-xs text-slate-500 font-medium">Select your preferred date and visiting slot to tour classrooms & facilities.</p>
      </div>

      {/* Tour Format Selector */}
      <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-2xl">
        <button
          type="button"
          onClick={() => setTourType('in_person')}
          className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            tourType === 'in_person' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="h-3.5 w-3.5 text-indigo-600" /> In-Person Walkthrough
        </button>
        <button
          type="button"
          onClick={() => setTourType('virtual')}
          className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            tourType === 'virtual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Video className="h-3.5 w-3.5 text-purple-600" /> Virtual Video Tour
        </button>
      </div>

      {/* Date & Slot Picker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block font-mono">
            Select Tour Date
          </label>
          <input
            type="date"
            required
            value={tourDate}
            onChange={(e) => setTourDate(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block font-mono">
            Target Grade Level
          </label>
          <select
            value={intendedGrade}
            onChange={(e) => setIntendedGrade(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-slate-50"
          >
            <option value="Creche & Nursery">Creche & Nursery (2-3 yrs)</option>
            <option value="Kindergarten">Kindergarten (4-5 yrs)</option>
            <option value="Primary School">Primary School (Grades 1-6)</option>
            <option value="JHS Academy">JHS Academy (JHS 1-3)</option>
          </select>
        </div>
      </div>

      {/* 30-Min Time Slot Selector */}
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block font-mono">
          Available 30-Min Visiting Slots
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {availableSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setSelectedSlot(slot)}
              className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedSlot === slot
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <Calendar className="h-3.5 w-3.5 text-indigo-500" />
              <span>{slot}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Parent Details */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <div>
          <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block font-mono mb-1">
            Parent / Guardian Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Dr. Kwame Mensah"
            value={parentName}
            onChange={(e) => setParentName(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block font-mono mb-1">
              Phone / WhatsApp Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 0244123456"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div>
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-500 block font-mono mb-1">
              Email Address (Optional)
            </label>
            <input
              type="email"
              placeholder="parent@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        style={{ background: primaryColor }}
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
        <span>Confirm 30-Min Visit Booking</span>
      </button>
    </form>
  );
}

// ─── LITE YOUTUBE PLAYER SUB-COMPONENT ──────────────────────
function LiteYouTubePlayer({ ytId, title, brandColor }: { ytId: string; title: string; brandColor: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgSrc, setImgSrc] = useState(`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`);

  if (isPlaying) {
    return (
      <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-white/10">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsPlaying(true)}
      className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-950 group cursor-pointer select-none"
    >
      {/* High-res Cover Image */}
      <img
        src={imgSrc}
        alt={title}
        onError={() => setImgSrc(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`)}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
      />

      {/* Dark Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

      {/* Custom Branded Play Button with Pulse Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div
            className="absolute -inset-3 rounded-full opacity-60 blur-md animate-ping pointer-events-none"
            style={{ backgroundColor: brandColor }}
          />
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-full text-white shadow-2xl flex items-center justify-center border-2 border-white/40 transition-transform duration-300 group-hover:scale-110 relative z-10"
            style={{ background: `linear-gradient(135deg, ${brandColor}, #ef4444)` }}
          >
            <Video className="h-8 w-8 text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>

      {/* Top Media Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest font-mono border border-white/20 shadow-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> HD Video
        </span>
      </div>

      {/* Bottom Action Hint */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-white text-xs font-bold">
        <span className="truncate max-w-[75%] font-medium text-slate-200">{title}</span>
        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest font-mono border border-white/30">
          Click to Play ▶
        </span>
      </div>
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
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [admissionTab, setAdmissionTab] = useState<'enquiry' | 'apply' | 'tour'>('enquiry');
  const [tourModalOpen, setTourModalOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState<number | null>(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [activePortalTab, setActivePortalTab] = useState<'grades' | 'attendance' | 'fees' | 'stories'>('grades');
  const [currentLang, setCurrentLang] = useState<'en' | 'fr' | 'tw' | 'ar' | 'es'>('en');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [realtimeClasses, setRealtimeClasses] = useState<any[]>([]);

  const i18nDict: Record<string, Record<string, string>> = {
    en: {
      about: 'About',
      academics: 'Academics',
      team: 'Team',
      events: 'Events',
      news: 'News',
      gallery: 'Gallery',
      reviews: 'Reviews',
      contact: 'Contact',
      applyNow: 'Apply Now',
      portalLogin: 'Portal Login',
      admissions: 'Admissions',
      joinCommunity: 'Join Our Community',
      campusTour: 'Book Campus Tour',
      accreditation: 'Institutional Accreditation'
    },
    fr: {
      about: 'À Propos',
      academics: 'Programmes',
      team: 'Équipe',
      events: 'Événements',
      news: 'Actualités',
      gallery: 'Galerie',
      reviews: 'Avis',
      contact: 'Contact',
      applyNow: 'Postuler',
      portalLogin: 'Connexion Portail',
      admissions: 'Admissions',
      joinCommunity: 'Rejoignez Notre Communauté',
      campusTour: 'Réserver une Visite',
      accreditation: 'Accréditations & Normes'
    },
    tw: {
      about: 'Kyerɛ Mu',
      academics: 'Adesua',
      team: 'Akyerɛkyerɛfoɔ',
      events: 'Ndwuma',
      news: 'Asem Foforo',
      gallery: 'Mfonin',
      reviews: 'Adwene',
      contact: 'Nkitahodi',
      applyNow: 'Gye Tumii Seesei',
      portalLogin: 'Kɔ Mu',
      admissions: 'Nsramu',
      joinCommunity: 'Bata Yɛn Ho',
      campusTour: 'Sra Skuul Ha',
      accreditation: 'Aban Nsramu'
    },
    ar: {
      about: 'عن المدرسة',
      academics: 'الأكاديميات',
      team: 'الهيئة التدريسية',
      events: 'الفعاليات',
      news: 'الأخبار',
      gallery: 'معرض الصور',
      reviews: 'الآراء',
      contact: 'اتصل بنا',
      applyNow: 'قدّم الآن',
      portalLogin: 'تسجيل الدخول',
      admissions: 'القبول والتسجيل',
      joinCommunity: 'انضم إلى مجتمعنا',
      campusTour: 'حجز جولة',
      accreditation: 'الاعتماد الأكاديمي'
    },
    es: {
      about: 'Nosotros',
      academics: 'Académico',
      team: 'Profesores',
      events: 'Eventos',
      news: 'Noticias',
      gallery: 'Galería',
      reviews: 'Reseñas',
      contact: 'Contacto',
      applyNow: 'Aplicar Ahora',
      portalLogin: 'Iniciar Sesión',
      admissions: 'Admisiones',
      joinCommunity: 'Únete a la Comunidad',
      campusTour: 'Reservar Visita',
      accreditation: 'Acreditaciones'
    }
  };

  const t = i18nDict[currentLang] || i18nDict.en;

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

  const testimonialList = (() => {
    if (school?.hideTestimonials) return [];

    // 1. If school explicitly defined customTestimonials array in DB
    if (Array.isArray(school?.customTestimonials) && school.customTestimonials.length > 0) {
      return school.customTestimonials;
    }
    if (Array.isArray(school?.testimonials) && school.testimonials.length > 0) {
      return school.testimonials;
    }
    if (Array.isArray(school?.reviews) && school.reviews.length > 0) {
      return school.reviews;
    }
    if (Array.isArray(school?.parentReviews) && school.parentReviews.length > 0) {
      return school.parentReviews;
    }

    // 2. Single field overrides on school doc (parentTestimonialQuote / parentTestimonialName / etc)
    if (school?.parentTestimonialQuote || school?.parentTestimonialName || school?.testimonialQuote || school?.testimonialName) {
      return [
        {
          quote: school?.parentTestimonialQuote || school?.testimonialQuote || defaultTestimonials[0].quote,
          name: school?.parentTestimonialName || school?.testimonialName || defaultTestimonials[0].name,
          role: school?.parentTestimonialRole || school?.testimonialRole || defaultTestimonials[0].role,
          rating: Number(school?.parentTestimonialRating || 5),
          avatar: school?.parentTestimonialAvatar || school?.testimonialAvatar || defaultTestimonials[0].avatar
        },
        ...defaultTestimonials.slice(1)
      ];
    }

    return defaultTestimonials;
  })();

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

  // ── Fetch Live Real-Time Class Capacity from ERP ──────────────
  useEffect(() => {
    const fetchClasses = async () => {
      if (!firestore || !school) return;
      try {
        let list: any[] = [];
        
        // 1. Check subcollection 'schools/{school.id}/classes'
        try {
          const subSnap = await getDocs(collection(firestore, 'schools', school.id, 'classes'));
          if (!subSnap.empty) {
            list = subSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          }
        } catch (e) { /* ignore subcollection error */ }

        // 2. If subcollection empty, query root 'classes' collection by schoolId
        if (list.length === 0) {
          const rootSnap = await getDocs(query(collection(firestore, 'classes'), where('schoolId', '==', school.id)));
          if (!rootSnap.empty) {
            list = rootSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          }
        }

        // 3. Try slug query if still empty
        if (list.length === 0 && school.slug) {
          const slugSnap = await getDocs(query(collection(firestore, 'classes'), where('schoolId', '==', school.slug)));
          if (!slugSnap.empty) {
            list = slugSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          }
        }

        if (list.length > 0) {
          setRealtimeClasses(list);
        }
      } catch (e) {
        console.error('Failed to fetch real-time class capacity quotas:', e);
      }
    };
    fetchClasses();
  }, [firestore, school]);

  // ── AUTOMATED REAL-TIME ERP & WEB BUILDER SEAT AVAILABILITY COMPUTATION ────
  const liveSeatQuotas = useMemo(() => {
    if (school?.hideSeatAvailability) return [];

    // 1. WEB BUILDER TOP PRIORITY: Explicit custom vacancies array entered in Web Builder
    const webBuilderQuotas = Array.isArray(school?.enrollmentQuotas) && school.enrollmentQuotas.length > 0
      ? school.enrollmentQuotas
      : Array.isArray(school?.vacancies) && school.vacancies.length > 0
      ? school.vacancies
      : Array.isArray(school?.customQuotas) && school.customQuotas.length > 0
      ? school.customQuotas
      : [];

    if (webBuilderQuotas.length > 0) {
      return webBuilderQuotas.map((q: any) => ({
        grade: q.grade || q.name || q.category || q.className || 'Class Stream',
        remaining: typeof q.remaining === 'number'
          ? q.remaining
          : (Number(q.total || q.capacity || 30) - Number(q.enrolled || q.students || 0)),
        total: Number(q.total || q.capacity || 30)
      }));
    }

    // 2. WEB BUILDER CATEGORY INPUTS: Individual class category seat fields
    const webBuilderCategorySeats: Array<{ grade: string; remaining: number; total: number }> = [];
    if (school?.preschoolSeats != null && school.preschoolSeats !== '') {
      webBuilderCategorySeats.push({ grade: 'Pre-School / Creche', remaining: Number(school.preschoolSeats), total: Number(school.preschoolCap || 25) });
    }
    if (school?.kgSeats != null && school.kgSeats !== '') {
      webBuilderCategorySeats.push({ grade: 'Kindergarten 1 & 2', remaining: Number(school.kgSeats), total: Number(school.kgCap || 30) });
    }
    if (school?.primaryLowerSeats != null && school.primaryLowerSeats !== '') {
      webBuilderCategorySeats.push({ grade: 'Primary (Lower)', remaining: Number(school.primaryLowerSeats), total: Number(school.primaryLowerCap || 35) });
    }
    if (school?.primaryUpperSeats != null && school.primaryUpperSeats !== '') {
      webBuilderCategorySeats.push({ grade: 'Primary (Upper)', remaining: Number(school.primaryUpperSeats), total: Number(school.primaryUpperCap || 35) });
    }
    if (school?.jhsSeats != null && school.jhsSeats !== '') {
      webBuilderCategorySeats.push({ grade: 'JHS Academy', remaining: Number(school.jhsSeats), total: Number(school.jhsCap || 40) });
    }

    if (webBuilderCategorySeats.length > 0) {
      return webBuilderCategorySeats;
    }

    // 3. ERP CLASS MODULE AUTO-CALCULATION: From realtimeClasses or embedded school.classes
    const embeddedClasses = Array.isArray(school?.classes) && school.classes.length > 0
      ? school.classes
      : Array.isArray(school?.classStreams) && school.classStreams.length > 0
      ? school.classStreams
      : Array.isArray(school?.customClasses) && school.customClasses.length > 0
      ? school.customClasses
      : [];

    const activeClassesList = realtimeClasses.length > 0 ? realtimeClasses : embeddedClasses;

    if (activeClassesList.length > 0) {
      return activeClassesList.map((c: any) => {
        const total = Number(c.capacity || c.maxCapacity || c.totalCapacity || c.targetCapacity || 30);
        const enrolled = Number(c.currentStudents || c.studentsCount || c.enrolledCount || c.students || (Array.isArray(c.studentIds) ? c.studentIds.length : 0));
        const remaining = Math.max(0, total - enrolled);
        return {
          grade: c.name || c.className || c.title || 'Class Stream',
          remaining,
          total
        };
      });
    }

    // 4. Default Streams with dynamic capacity calculation
    return [
      { grade: 'Pre-School / Creche', remaining: Number(school?.preschoolSeats ?? 4), total: Number(school?.preschoolCap ?? 25) },
      { grade: 'Kindergarten 1 & 2', remaining: Number(school?.kgSeats ?? 6), total: Number(school?.kgCap ?? 30) },
      { grade: 'Primary (Lower)', remaining: Number(school?.primaryLowerSeats ?? 3), total: Number(school?.primaryLowerCap ?? 35) },
      { grade: 'Primary (Upper)', remaining: Number(school?.primaryUpperSeats ?? 6), total: Number(school?.primaryUpperCap ?? 35) },
      { grade: 'JHS Academy', remaining: Number(school?.jhsSeats ?? 2), total: Number(school?.jhsCap ?? 40) }
    ];
  }, [school, realtimeClasses]);

  // ── DYNAMIC PARENT PORTAL PREVIEW SHOWCASE RESOLVER ──────────
  const portalSample = useMemo(() => {
    if (school?.portalSampleData) return school.portalSampleData;
    return {
      showTeaser: school?.hideParentPortalTeaser !== true && school?.hidePortalPreview !== true,
      gpa: school?.showcaseGpa || '3.92 / 4.0',
      term: school?.showcaseTerm || 'Term 1 GPA',
      grades: Array.isArray(school?.showcaseGrades) && school.showcaseGrades.length > 0
        ? school.showcaseGrades
        : [
            { subject: 'Mathematics & STEM Robotics', score: school?.mathScore || 96, grade: 'A+' },
            { subject: 'English Language & Literature', score: school?.englishScore || 91, grade: 'A' },
            { subject: 'Integrated Science', score: school?.scienceScore || 94, grade: 'A+' },
            { subject: 'Creative Arts & Design', score: school?.artsScore || 88, grade: 'B+' }
          ],
      attendanceRate: school?.showcaseAttendance || school?.attendanceRate || '100% (22/22 Days)',
      feeStatus: school?.feeStatusText || 'Status: Paid in Full',
      tuitionAmount: school?.showcaseTuition || 'GH₵ 1,850.00',
      labPassAmount: school?.showcaseLabPass || 'GH₵ 250.00',
      storyCategory: school?.showcaseStoryCategory || 'STEM Workshop',
      storyAuthor: school?.showcaseStoryAuthor || 'Lead Educator',
      storyAuthorInitials: school?.showcaseStoryAuthor ? school.showcaseStoryAuthor.split(' ').map((n: string) => n.charAt(0)).join('').toUpperCase().slice(0, 2) : 'ED',
      storyText: school?.showcaseStoryText || "Students successfully assembled their first solar-powered vehicle prototypes in today's STEM workshop!"
    };
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

  // ── AUTOMATED GLOBAL SEARCH COMPUTATION (Hook placed before early returns) ──
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !school) return [];
    const q = searchQuery.toLowerCase().trim();
    const results: Array<{
      id: string;
      title: string;
      category: string;
      snippet: string;
      targetId: string;
      action?: () => void;
    }> = [];

    // 1. Academics & Facilities
    const pillarsList = (Array.isArray(school?.academicsPillars) && school.academicsPillars.length > 0)
      ? school.academicsPillars
      : (Array.isArray(school?.facilities) && school.facilities.length > 0)
      ? school.facilities
      : (Array.isArray(school?.campusPillars) && school.campusPillars.length > 0)
      ? school.campusPillars
      : [];

    pillarsList.forEach((p: any, i: number) => {
      if (
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      ) {
        results.push({
          id: `pillar-${i}`,
          title: p.title || 'Academic Pillar',
          category: 'Academics & Facilities',
          snippet: p.description || 'Explore our campus academic facilities.',
          targetId: 'academics'
        });
      }
    });

    // 2. Admissions & Fees
    if (
      'admissions'.includes(q) || 'fees'.includes(q) || 'tuition'.includes(q) ||
      'application'.includes(q) || 'requirements'.includes(q) || 'cut-off'.includes(q) || 'bus'.includes(q)
    ) {
      results.push({
        id: 'admissions-sec',
        title: 'Admissions Guidelines & Tuition Payment',
        category: 'Admissions & Fees',
        snippet: 'Review entry requirements, document checklists, and online application forms.',
        targetId: 'apply'
      });
    }

    const faqsList = (Array.isArray(school?.faqs) && school.faqs.length > 0)
      ? school.faqs
      : (Array.isArray(school?.customFaqs) && school.customFaqs.length > 0)
      ? school.customFaqs
      : (Array.isArray(school?.admissionsFaqs) && school.admissionsFaqs.length > 0)
      ? school.admissionsFaqs
      : [];

    faqsList.forEach((faq: any, i: number) => {
      const qText = (faq.q || faq.question || '').toLowerCase();
      const aText = (faq.a || faq.answer || '').toLowerCase();
      if (qText.includes(q) || aText.includes(q)) {
        results.push({
          id: `faq-${i}`,
          title: faq.q || faq.question || 'Admissions FAQ',
          category: 'Admissions FAQ',
          snippet: faq.a || faq.answer || '',
          targetId: 'apply',
          action: () => setOpenFaqIdx(i)
        });
      }
    });

    // 3. News & Bulletins
    (newsList || []).forEach((n: any, i: number) => {
      const title = (n.title || '').toLowerCase();
      const summary = (n.summary || n.content || '').toLowerCase();
      if (title.includes(q) || summary.includes(q)) {
        results.push({
          id: `news-${n.id || i}`,
          title: n.title || 'News Bulletin',
          category: 'News & Announcements',
          snippet: n.summary || n.content || '',
          targetId: 'news',
          action: () => setSelectedNews(n)
        });
      }
    });

    // 4. Events
    const events = (Array.isArray(school?.events) && school.events.length > 0)
      ? school.events
      : (Array.isArray(school?.customEvents) && school.customEvents.length > 0)
      ? school.customEvents
      : (Array.isArray(school?.upcomingEvents) && school.upcomingEvents.length > 0)
      ? school.upcomingEvents
      : (Array.isArray(school?.calendarEvents) && school.calendarEvents.length > 0)
      ? school.calendarEvents
      : [];

    events.forEach((ev: any, i: number) => {
      const title = (ev.title || '').toLowerCase();
      const desc = (ev.description || '').toLowerCase();
      const cat = (ev.category || '').toLowerCase();
      if (title.includes(q) || desc.includes(q) || cat.includes(q)) {
        results.push({
          id: `event-${ev.id || i}`,
          title: ev.title || 'Campus Event',
          category: 'Events & Calendar',
          snippet: `${ev.date || ''} • ${ev.description || ''}`,
          targetId: 'events',
          action: () => setSelectedEvent(ev)
        });
      }
    });

    // 5. Educators & Team
    (team || []).forEach((m: any, i: number) => {
      const name = (m.name || `${m.firstName || ''} ${m.lastName || ''}`).toLowerCase();
      const role = (m.role || '').toLowerCase();
      const bio = (m.bio || '').toLowerCase();
      if (name.includes(q) || role.includes(q) || bio.includes(q)) {
        results.push({
          id: `team-${m.id || i}`,
          title: m.name || `${m.firstName || ''} ${m.lastName || ''}`,
          category: 'Faculty & Staff',
          snippet: `${m.role || 'Educator'} • ${m.highestDegree || m.qualifications || ''}`,
          targetId: 'team'
        });
      }
    });

    return results;
  }, [searchQuery, school, newsList, team]);

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
    : [];

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

  const defaultAdmissionsFaqs = [
    {
      q: "What is the cut-off age for Pre-School & Kindergarten enrollment?",
      a: "Our Pre-School program welcomes toddlers starting from 2 years old (Creche & Nursery). Kindergarten 1 requires children to be 4 years old by the start of the academic year, while KG2 requires 5 years old."
    },
    {
      q: "Are there school bus transport services available for students?",
      a: "Yes! We operate safe, air-conditioned campus school buses with real-time GPS tracking and dedicated bus attendants. Pick-up and drop-off routes cover major residential neighborhoods surrounding the school."
    },
    {
      q: "How do parents track their child's daily academic progress & attendance?",
      a: "Parents receive login credentials to our 24/7 GAM Edu Parent Portal & Mobile App. You can view instant NFC gate check-in alerts, weekly continuous assessment grades, teacher notes, and term report cards."
    },
    {
      q: "What are the entry placement requirements for transfer students?",
      a: "Transfer students from Primary 1 through JHS 2 undergo a standard placement assessment in English and Mathematics to ensure accurate grade placement, alongside submitting previous terminal reports."
    },
    {
      q: "How are tuition fees paid and are flexible payment terms available?",
      a: "Tuition and facility fees can be paid conveniently via Mobile Money or Visa/Mastercard on the Parent Portal with instant e-receipts. Flexible term installment plans are available upon request at the Accounts Office."
    }
  ];

  const admissionsFaqs = (Array.isArray(school?.faqs) && school.faqs.length > 0)
    ? school.faqs
    : (Array.isArray(school?.customFaqs) && school.customFaqs.length > 0)
    ? school.customFaqs
    : (Array.isArray(school?.admissionsFaqs) && school.admissionsFaqs.length > 0)
    ? school.admissionsFaqs
    : defaultAdmissionsFaqs;

  // ── DYNAMIC INSTITUTIONAL ACCREDITATION & TRUST RESOLUTION ───
  const accreditationsList = (() => {
    if (school?.hideAccreditations) return [];

    // 1. If school uploaded custom accreditations array in DB
    if (Array.isArray(school?.accreditations) && school.accreditations.length > 0) {
      return school.accreditations.map((acc: any) => ({
        title: acc.title || acc.name || 'Accreditation',
        subtitle: acc.subtitle || acc.authority || acc.council || 'Regulatory Board',
        regNo: acc.regNo || acc.regNumber || acc.certificateNo || acc.code || '',
        badge: acc.badge || acc.grade || acc.status || 'Verified',
        flag: acc.flag || acc.emoji || '🛡️',
        logoUrl: acc.logoUrl || acc.logo || acc.image
      }));
    }
    if (Array.isArray(school?.customAccreditations) && school.customAccreditations.length > 0) {
      return school.customAccreditations.map((acc: any) => ({
        title: acc.title || acc.name || 'Accreditation',
        subtitle: acc.subtitle || acc.authority || acc.council || 'Regulatory Board',
        regNo: acc.regNo || acc.regNumber || acc.certificateNo || acc.code || '',
        badge: acc.badge || acc.grade || acc.status || 'Verified',
        flag: acc.flag || acc.emoji || '🛡️',
        logoUrl: acc.logoUrl || acc.logo || acc.image
      }));
    }

    // 2. Default Regulatory Catalog (Data Protection is ON for all; GES is default for target market but toggleable)
    const catalog = [
      {
        id: 'dpc',
        title: 'Data Protection Commission',
        subtitle: 'Act 843 Security Compliant',
        regNo: school?.dpcCertNumber || 'Cert: DPC/PRIV/8942',
        badge: '256-Bit Encrypted',
        flag: '🛡️',
        logoUrl: school?.dpcLogoUrl,
        enabled: school?.enableDpcAccreditation ?? true // Always enabled for all by default
      },
      {
        id: 'ges',
        title: 'Ghana Education Service',
        subtitle: 'Ministry of Education',
        regNo: school?.gesRegNumber || 'Reg: GES/ASH/EJ/2024',
        badge: 'Certified Grade-A',
        flag: '🇬🇭',
        logoUrl: school?.gesLogoUrl,
        enabled: school?.enableGesAccreditation ?? (school?.curriculumType ? school.curriculumType === 'ges' : true)
      },
      {
        id: 'cambridge',
        title: 'Cambridge Assessment',
        subtitle: 'Global Education Centre',
        regNo: school?.cambridgeCentreId || 'Centre ID: GH-842',
        badge: 'IGCSE & Primary',
        flag: '🇬🇧',
        logoUrl: school?.cambridgeLogoUrl,
        enabled: school?.enableCambridgeAccreditation ?? (school?.curriculumType === 'cambridge' || school?.isCambridgeSchool === true)
      },
      {
        id: 'waec',
        title: 'WAEC Examination Board',
        subtitle: 'National Exam Center',
        regNo: school?.waecCentreCode || 'Centre: 0050849',
        badge: 'BECE & WASSCE',
        flag: '🏅',
        logoUrl: school?.waecLogoUrl,
        enabled: school?.enableWaecAccreditation ?? (school?.curriculumType !== 'cambridge')
      },
      {
        id: 'stem',
        title: 'Ghana STEM Council',
        subtitle: 'Robotics & AI Hub',
        regNo: school?.stemHubId || 'Hub ID: STEM-GH-26',
        badge: 'Innovator Hub',
        flag: '🤖',
        logoUrl: school?.stemLogoUrl,
        enabled: school?.enableStemAccreditation ?? true
      },
      {
        id: 'ib',
        title: 'International Baccalaureate',
        subtitle: 'IB World Organization',
        regNo: school?.ibSchoolCode || 'School Code: IB-00482',
        badge: 'IB World School',
        flag: '🌐',
        logoUrl: school?.ibLogoUrl,
        enabled: school?.enableIbAccreditation ?? (school?.curriculumType === 'ib')
      }
    ];

    // Explicit ID selection array configured by school web builder
    if (Array.isArray(school?.enabledAccreditationIds) && school.enabledAccreditationIds.length > 0) {
      return catalog.filter(item => school.enabledAccreditationIds.includes(item.id));
    }

    return catalog.filter(item => item.enabled !== false);
  })();

  const navLinks = [
    { label: t.about || 'About', id: 'about' },
    (school.directorMessage || school.principalMessage) && { label: 'Leadership', id: 'leadership' },
    { label: t.academics || 'Academics', id: 'academics' },
    team.length > 0 && { label: t.team || 'Team', id: 'team' },
    eventsList.length > 0 && { label: t.events || 'Events', id: 'events' },
    newsList && newsList.length > 0 && { label: t.news || 'News', id: 'news' },
    galleryList.length > 0 && { label: t.gallery || 'Gallery', id: 'gallery' },
    testimonialList.length > 0 && { label: t.reviews || 'Reviews', id: 'testimonials' },
    { label: t.contact || 'Contact', id: 'contact' },
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
        navScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100'
          : 'bg-slate-950/80 backdrop-blur-md border-b border-white/10 shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* name / crest */}
          <div className="flex items-center gap-3 shrink-0">
            <span
              className="font-black tracking-tight leading-tight transition-colors whitespace-normal break-words"
              style={{
                fontSize: 'clamp(0.85rem, 2vw, 1.15rem)',
                color: navScrolled ? brand : 'white'
              }}
            >
              {school.name}
            </span>
            {school.logoUrl && (
              <img src={school.logoUrl} alt={school.name} className="h-10 w-10 shrink-0 object-contain rounded-xl bg-white/10 p-1 border border-white/20" />
            )}
          </div>

          {/* links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-xs lg:text-sm font-black uppercase tracking-widest transition-colors cursor-pointer ${
                  navScrolled 
                    ? 'text-slate-600 hover:text-slate-900' 
                    : 'text-slate-100 hover:text-white drop-shadow-sm'
                }`}
              >
                {link.label}
              </button>
            ))}
            <a
              href="https://gam-it-service.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm border flex items-center gap-1.5 hover:scale-[1.03] active:scale-[0.97] ${
                navScrolled 
                  ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" /> {t.portalLogin || 'Portal Login'}
            </a>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`px-3 py-2 rounded-xl border text-xs font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                  navScrolled 
                    ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' 
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
                title="Select Language / Langue"
              >
                <span>{currentLang === 'en' ? '🇬🇧 EN' : currentLang === 'fr' ? '🇫🇷 FR' : currentLang === 'tw' ? '🇬🇭 TW' : currentLang === 'ar' ? '🇦🇪 AR' : '🇪🇸 ES'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-white/15 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in duration-200">
                  {[
                    { code: 'en', label: 'English', flag: '🇬🇧' },
                    { code: 'fr', label: 'Français', flag: '🇫🇷' },
                    { code: 'tw', label: 'Twi (Akan)', flag: '🇬🇭' },
                    { code: 'ar', label: 'العربية', flag: '🇦🇪' },
                    { code: 'es', label: 'Español', flag: '🇪🇸' }
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang.code as any);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        currentLang === lang.code ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span>{lang.flag} {lang.label}</span>
                      {currentLang === lang.code && <span className="text-[10px]">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Global Search Button Trigger */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={`p-2 rounded-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center ${
                navScrolled 
                  ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              title="Global Site Search"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            <button
              onClick={() => setA11yOpen(true)}
              className={`p-2 rounded-xl border transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center ${
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
              className="px-5 py-2.5 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-[0.97] hover:shadow-lg shadow-md cursor-pointer shrink-0"
              style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}
            >
              {t.applyNow || 'Apply Now'}
            </button>
          </div>

          {/* Hamburger for Mobile */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="flex md:hidden p-2 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-white"
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
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.15))' }}
        />

        {/* content: Carleton University Style Bottom-Left Rectangular Hero Overlay Banner */}
        <div className="absolute bottom-8 md:bottom-12 left-6 md:left-12 right-6 md:right-auto z-20 max-w-3xl w-full">
          <div className="bg-slate-950/45 backdrop-blur-md border border-white/25 p-6 md:p-8 rounded-3xl shadow-2xl space-y-4 text-left fade-up">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em] shadow-md shadow-emerald-950/30 font-mono">
                <Sparkles className="h-3.5 w-3.5 text-yellow-400 animate-pulse" /> Admissions Open
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300 font-mono">
                {school.name}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-1">
              <div className="space-y-2 flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                  Join a Smart, Caring Community
                </h1>
                <p className="text-slate-200 text-xs md:text-sm leading-relaxed font-medium">
                  {school.motto || 'Empowering young minds with academic rigor, STEM innovation, and moral character. Nurturing confident, creative, and future-ready leaders.'}
                </p>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => scrollTo('apply')}
                  className="w-full md:w-auto px-6 py-3.5 rounded-2xl text-white text-sm font-black uppercase tracking-tight shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 border border-white/20 cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}
                >
                  <GraduationCap className="h-4 w-4" /> Start Application
                </button>
              </div>
            </div>
          </div>
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
          {/* ─── LIVE ERP FACILITY METRICS BAR ──────────────────── */}
          {!school.hideCampusMetrics && (
            <div className="pt-12 border-t border-slate-200/80">
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase font-mono tracking-widest border border-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Real-Time ERP System Data
                      </span>
                      <h4 className="text-2xl font-black text-white tracking-tight">Live Campus System Metrics</h4>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Updated Live • GAM Edu OS</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between text-indigo-400">
                        <BookOpen className="h-6 w-6" />
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Synchronized</span>
                      </div>
                      <div className="text-3xl font-black text-white font-mono tracking-tight">{Number(school.libraryBookCount || school.digitalLibraryCount || 4520).toLocaleString()}</div>
                      <span className="text-xs font-bold text-slate-300 block">Digital Library Collections</span>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between text-purple-400">
                        <Sparkles className="h-6 w-6" />
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Active</span>
                      </div>
                      <div className="text-3xl font-black text-white font-mono tracking-tight">{Number(school.clubCount || school.studentClubsCount || 12).toLocaleString()}</div>
                      <span className="text-xs font-bold text-slate-300 block">Student Clubs & Societies</span>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between text-amber-400">
                        <Award className="h-6 w-6" />
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Verified</span>
                      </div>
                      <div className="text-3xl font-black text-white font-mono tracking-tight">{Number(school.trophyCount || school.awardsCount || 38).toLocaleString()}</div>
                      <span className="text-xs font-bold text-slate-300 block">Academic & Sports Awards</span>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between text-sky-400">
                        <Atom className="h-6 w-6" />
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">Online</span>
                      </div>
                      <div className="text-3xl font-black text-white font-mono tracking-tight">{Number(school.labCount || school.stemWorkstationsCount || 45).toLocaleString()}</div>
                      <span className="text-xs font-bold text-slate-300 block">STEM & Robotics Workstations</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── SMART CAMPUS / TECHNOLOGY SHOWCASE MODULE ────────────── */}
      <section id="technology" className="py-32 px-6 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20" style={{ backgroundColor: brand }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-15" style={{ backgroundColor: secondaryColor }} />

        <div className="max-w-7xl mx-auto relative z-10 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Interactive Parent Dashboard Teaser Module */}
            {portalSample.showTeaser !== false && (
              <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1 space-y-4">
                {/* Teaser Tab Switcher */}
                <div className="flex gap-1.5 p-1.5 bg-slate-900 border border-white/10 rounded-2xl w-full text-[10px] font-black uppercase tracking-wider font-mono">
                  <button
                    type="button"
                    onClick={() => setActivePortalTab('grades')}
                    className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      activePortalTab === 'grades' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5" /> Grades
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePortalTab('attendance')}
                    className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      activePortalTab === 'attendance' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Bell className="h-3.5 w-3.5" /> Attendance
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePortalTab('fees')}
                    className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      activePortalTab === 'fees' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Shield className="h-3.5 w-3.5" /> Fees
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePortalTab('stories')}
                    className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      activePortalTab === 'stories' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" /> Stories
                  </button>
                </div>

                {/* Dynamic Dashboard Preview Card */}
                <ScrollReveal delayMs={100} className="w-full">
                  <div className="relative rounded-[2.5rem] p-6 md:p-8 bg-slate-900/90 backdrop-blur-xl border border-white/15 shadow-2xl shadow-indigo-950/80 space-y-6 text-left">
                    {/* Top Header Bar */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        {school.logoUrl ? (
                          <img src={school.logoUrl} alt="Logo" className="w-9 h-9 object-contain rounded-xl bg-white/10 p-1" />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                            <GraduationCap className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-sm font-black text-white leading-tight">{school.name}</h4>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest font-mono">GAM Edu Parent Portal</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase font-mono border border-emerald-500/30 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live Sync
                      </span>
                    </div>

                    {/* Tab 1: Grades */}
                    {activePortalTab === 'grades' && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">Continuous Assessment Overview</span>
                          <span className="text-xs font-black text-yellow-400 bg-yellow-400/10 px-2.5 py-1 rounded-full border border-yellow-400/20 font-mono">
                            {portalSample.term}: {portalSample.gpa}
                          </span>
                        </div>

                        <div className="space-y-3">
                          {portalSample.grades.map((sub: any, idx: number) => (
                            <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                              <div className="flex items-center justify-between text-xs font-bold text-white">
                                <span>{sub.subject}</span>
                                <span className="text-emerald-400 font-mono">{sub.score}% ({sub.grade})</span>
                              </div>
                              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full" style={{ width: `${sub.score}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="pt-2 flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-medium">Terminal Report Card Ready</span>
                          <a
                            href="https://gam-it-service.app/"
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-400 font-bold hover:underline flex items-center gap-1"
                          >
                            Download Report PDF 📄
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Attendance */}
                    {activePortalTab === 'attendance' && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">Gate Check-In & Transport</span>
                          <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 font-mono">Present Today (08:15 AM)</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                              <Bell className="h-5 w-5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-white">NFC Smart Gate Check-In</h5>
                              <p className="text-[11px] text-slate-300 font-medium">Student scanned entrance badge at Main Campus Gate 1.</p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-white">
                            <span>Monthly Attendance Rate</span>
                            <span className="text-emerald-400 font-mono">{portalSample.attendanceRate}</span>
                          </div>
                          <div className="grid grid-cols-7 gap-1.5 pt-1">
                            {[...Array(21)].map((_, i) => (
                              <div key={i} className="h-5 rounded-lg bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-[8px] font-black text-emerald-300">
                                ✓
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Tab 3: Fees */}
                    {activePortalTab === 'fees' && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">Tuition & Facility Billing</span>
                          <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full border border-emerald-400/20 font-mono">{portalSample.feeStatus}</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 space-y-3 text-xs">
                          <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-slate-300">Term 1 Tuition & Learning Aids</span>
                            <span className="font-bold text-white">{portalSample.tuitionAmount}</span>
                          </div>
                          <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-slate-300">STEM & Robotics Lab Pass</span>
                            <span className="font-bold text-white">{portalSample.labPassAmount}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-slate-400 font-medium">Digital Receipt Issued</span>
                          <a
                            href="https://gam-it-service.app/"
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] uppercase tracking-wider transition-colors"
                          >
                            Pay Tuition Online
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Tab 4: Stories */}
                    {activePortalTab === 'stories' && (
                      <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">Classroom Daily Photo Feed</span>
                          <span className="text-xs font-black text-purple-300 bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-400/30 font-mono">{portalSample.storyCategory}</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-xs font-mono">
                              {portalSample.storyAuthorInitials}
                            </div>
                            <div>
                              <h5 className="font-bold text-white">{portalSample.storyAuthor}</h5>
                              <span className="text-[10px] text-slate-400">Posted today in Class Feed</span>
                            </div>
                          </div>
                          <p className="text-slate-300 text-xs leading-relaxed font-medium">
                            "{portalSample.storyText}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              </div>
            )}

            {/* Right Column: Technology Selling Points & Features */}
            <div className="lg:col-span-6 space-y-8 text-left order-1 lg:order-2">
              <ScrollReveal delayMs={200} className="space-y-4">
                <span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border backdrop-blur-md"
                  style={{ color: '#38bdf8', borderColor: '#38bdf840', backgroundColor: '#38bdf815' }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-yellow-400 animate-pulse" /> Smart Campus Technology
                </span>

                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                  Always Connected to Your Child's Journey
                </h2>

                <p className="text-slate-300 text-base md:text-lg leading-relaxed font-medium">
                  {school.name} leverages the state-of-the-art <strong className="text-white">GAM Edu Multitenant Platform</strong> to provide parents with 24/7 real-time visibility, automated security alerts, and seamless digital interaction.
                </p>
              </ScrollReveal>

              {/* Feature Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mb-3">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-black text-white">Real-Time Academic Tracking</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    View live gradebooks, weekly continuous assessments, homework schedules, and official term report card downloads instantly.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-3">
                    <Bell className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-black text-white">Automated Attendance Alerts</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Receive instant SMS & push notifications as soon as your child checks into campus, enters the classroom, or boards school transport.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-3">
                    <Users className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-black text-white">Direct Parent-Teacher Messaging</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Communicate directly with class educators, view daily classroom story photos, and request one-on-one consultation appointments.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md space-y-2 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400 mb-3">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h4 className="text-base font-black text-white">Secure Digital Fee Payments</h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    Pay tuition fees securely via Mobile Money or Visa/Mastercard with instant digital receipts and automated balance tracking.
                  </p>
                </div>
              </div>

              {/* Action Link to Portal Login */}
              <div className="pt-4 flex items-center gap-4">
                <a
                  href="https://gam-it-service.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-2xl text-white text-sm font-black uppercase tracking-widest shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.03] active:scale-95 flex items-center gap-2.5 border border-white/20 cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}
                >
                  <GraduationCap className="h-5 w-5" /> Access Parent Portal ↗
                </a>
              </div>
            </div>
          </div>
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

                      {/* Structured Educator Profile Cards: [Highest Degree], [Years Experience], [Key Achievement] */}
                      <div className="w-full pt-5 border-t border-slate-100 space-y-2 mt-6 text-left">
                        {(member.highestDegree || member.degree) && (
                          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <GraduationCap className="h-4 w-4 text-indigo-600 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-mono">Highest Degree</span>
                              <span className="text-xs font-bold text-slate-800 truncate block">{formatTitleCase(member.highestDegree || member.degree)}</span>
                            </div>
                          </div>
                        )}

                        {(member.yearsExperience || member.experience) && (
                          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <Award className="h-4 w-4 text-amber-600 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-mono">Experience</span>
                              <span className="text-xs font-bold text-slate-800 truncate block">{member.yearsExperience || member.experience}</span>
                            </div>
                          </div>
                        )}

                        {(member.keyAchievement || member.achievement) && (
                          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                            <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block font-mono">Key Achievement</span>
                              <span className="text-xs font-bold text-slate-800 truncate block">{formatSentenceCase(member.keyAchievement || member.achievement)}</span>
                            </div>
                          </div>
                        )}

                        {qualificationsList.length > 0 && !(member.highestDegree || member.degree) && (
                          <div className="pt-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block text-left mb-1.5">
                              Qualifications
                            </span>
                            <ul className="space-y-1 text-xs text-slate-650 font-medium text-left">
                              {qualificationsList.map((q: string, qIdx: number) => (
                                <li key={qIdx} className="flex items-start gap-2">
                                  <span className="h-1.5 w-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: brand }} />
                                  <span className="leading-snug">{formatTitleCase(q)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
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

      {/* ─── VIDEOS / MEDIA SHOWCASE ─────────────────────────── */}
      {validVideos.length > 0 && (
        <section id="videos" className="py-32 px-6 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto space-y-16">
            <SectionHeader eyebrow="Media & Campus Life" title="Video Showcase" color={brand} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
              {validVideos.map((video: any, i: number) => (
                <ScrollReveal key={i} delayMs={i * 120} className="h-full">
                  <div className="bg-white border border-slate-200/80 rounded-[2.5rem] p-6 md:p-8 shadow-sm transition-all duration-300 hover:shadow-xl group flex flex-col justify-between h-full space-y-6">
                    <div className="space-y-6">
                      {/* Lite YouTube Embed Player */}
                      <LiteYouTubePlayer ytId={video.ytId} title={video.title} brandColor={brand} />

                      {/* Video Information Wrapper */}
                      <div className="space-y-3 px-2 text-left">
                        <div className="flex items-center gap-2">
                          <span
                            className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                            style={{ color: brand, borderColor: `${brand}30`, backgroundColor: `${brand}10` }}
                          >
                            {video.category || 'Featured Showcase'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 font-mono">Verified HD</span>
                        </div>

                        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                          {video.title}
                        </h3>

                        <p className="text-sm text-slate-600 leading-relaxed font-medium line-clamp-3">
                          {video.description}
                        </p>
                      </div>
                    </div>

                    {/* External Watch Link */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between px-2 text-xs font-bold text-slate-500">
                      <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest">{school.name} Channel</span>
                      <a
                        href={`https://www.youtube.com/watch?v=${video.ytId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 font-black uppercase text-[11px] tracking-wider hover:underline"
                      >
                        Watch on YouTube ↗
                      </a>
                    </div>
                  </div>
                </ScrollReveal>
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

            {/* Carleton University 4-Column Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {eventsList.slice(0, 4).map((ev: any, idx: number) => {
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

                const eventFallbackImages = [
                  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800',
                  'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800',
                  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
                  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800'
                ];
                const eventImg = ev.imageUrl || ev.image || ev.photoUrl || eventFallbackImages[idx % eventFallbackImages.length];

                return (
                  <ScrollReveal key={ev.id || idx} delayMs={idx * 100} className="h-full">
                    <div
                      onClick={() => setSelectedEvent(ev)}
                      className="bg-white rounded-[2rem] border border-slate-200/80 shadow-sm transition-all duration-300 hover:shadow-xl card-hover flex flex-col justify-between overflow-hidden group h-full cursor-pointer"
                    >
                      <div>
                        {/* Top Featured Image Banner */}
                        <div className="h-44 w-full overflow-hidden relative bg-slate-100 shrink-0">
                          <img
                            src={eventImg}
                            alt={ev.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
                          
                          {/* Carleton Style Floating Date Badge */}
                          <div
                            className="absolute top-3 left-3 flex flex-col items-center justify-center w-14 h-16 rounded-2xl text-white shadow-lg backdrop-blur-md border border-white/30"
                            style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}
                          >
                            <span className="text-[9px] font-black uppercase tracking-widest opacity-90 font-mono">
                              {monthStr}
                            </span>
                            <span className="text-xl font-black font-mono leading-none mt-0.5">
                              {dayStr}
                            </span>
                          </div>
                        </div>

                        {/* Event Details Content */}
                        <div className="p-6 space-y-3">
                          <span
                            className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border"
                            style={{ color: brand, borderColor: `${brand}30`, backgroundColor: `${brand}10` }}
                          >
                            {ev.category || 'Event'}
                          </span>

                          <h4 className="text-base font-black text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {ev.title}
                          </h4>

                          {ev.time && (
                            <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 font-mono pt-1">
                              <Calendar className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                              <span className="truncate">{ev.time}</span>
                            </p>
                          )}

                          {ev.location && (
                            <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 truncate">
                              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{ev.location}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Carleton Style Red / Brand "More Info" Button */}
                      <div className="px-6 pb-6 pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(ev);
                          }}
                          className="w-full py-3 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                          style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}
                        >
                          <span>More Info</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
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

          {/* ─── LIVE SEAT AVAILABILITY & URGENCY INDICATOR ─────── */}
          {liveSeatQuotas.length > 0 && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-[2.5rem] p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-600 shrink-0">
                    <ZapOff className="h-5 w-5 animate-bounce text-amber-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <h4 className="text-base font-black text-slate-900 uppercase tracking-wider font-mono">Live Enrollment Capacity</h4>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">Real-time seat quotas pulled from GAM Edu Registrar ERP. Apply now before remaining seats fill up.</p>
                  </div>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-red-500/10 text-red-700 text-[10px] font-black uppercase font-mono tracking-widest border border-red-500/20 shrink-0">
                  High Demand Enrollment Season
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {liveSeatQuotas.map((item: any, idx: number) => {
                  const isFull = item.remaining <= 0;
                  return (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 text-left">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono truncate">{item.grade}</span>
                      <div className="flex items-baseline justify-between">
                        <span className={`text-sm font-black font-mono ${isFull ? 'text-slate-500' : 'text-red-600'}`}>
                          {isFull ? 'Waitlist Only' : `${item.remaining} Seats Left`}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 font-mono">Cap: {item.total}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${isFull ? 'bg-slate-400' : 'bg-gradient-to-r from-amber-500 to-red-500'}`}
                          style={{ width: `${Math.min(100, Math.round(((item.total - item.remaining) / item.total) * 100))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Guidelines Column */}
            <div className="lg:col-span-5 bg-white border border-slate-100/80 p-8 md:p-10 rounded-[2.5rem] shadow-sm space-y-6 flex flex-col justify-between">
              <div className="prose-school text-slate-650 text-sm leading-relaxed font-medium">
                <ReactMarkdown>{admissionsGuidelinesText}</ReactMarkdown>
              </div>

              {/* Dedicated Campus Tour CTA Banner Card */}
              <div className="p-6 rounded-3xl bg-indigo-50/70 border border-indigo-100 space-y-3">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  <h4 className="text-sm font-black uppercase tracking-wider font-mono">Experience Our Campus</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Would you prefer a 1-on-1 walkthrough of our classrooms & sports complex? Book a 30-minute visiting pass today.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAdmissionTab('tour');
                    setTourModalOpen(true);
                  }}
                  className="w-full py-3 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-md transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: brand }}
                >
                  <Calendar className="h-4 w-4" /> Book a Campus Tour 📅
                </button>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Tab Selector */}
              <div className="flex gap-1.5 p-1.5 bg-slate-100 rounded-2xl w-full">
                <button
                  type="button"
                  onClick={() => setAdmissionTab('enquiry')}
                  className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
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
                  className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                    admissionTab === 'apply'
                      ? 'bg-white text-slate-800 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-700 font-semibold'
                  }`}
                >
                  Start Application
                </button>
                <button
                  type="button"
                  onClick={() => setAdmissionTab('tour')}
                  className={`flex-1 py-3 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    admissionTab === 'tour'
                      ? 'bg-white text-indigo-700 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-700 font-semibold'
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5 text-indigo-600" /> Tour Campus
                </button>
              </div>

              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
                <div className="h-2" style={{ background: `linear-gradient(90deg, ${brand}, ${secondaryColor}, ${tertiaryColor})` }} />
                <div className="p-8 md:p-12">
                  {admissionTab === 'enquiry' ? (
                    <AdmissionEnquiryForm schoolId={school.id} primaryColor={brand} />
                  ) : admissionTab === 'apply' ? (
                    <AdmissionForm schoolId={school.id} primaryColor={brand} />
                  ) : (
                    <CampusTourBooking schoolId={school.id} schoolName={school.name} primaryColor={brand} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ─── INTERACTIVE ADMISSIONS ACCORDION (FAQ) MODULE ──── */}
          <div className="pt-16 border-t border-slate-200/80 space-y-10 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <span
                className="inline-block px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border"
                style={{ color: brand, borderColor: `${brand}30`, backgroundColor: `${brand}10` }}
              >
                Admissions FAQ
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h3>
              <p className="text-sm text-slate-500 font-medium">
                Everything you need to know about enrolling your child at {school.name}.
              </p>
            </div>

            <div className="space-y-4">
              {admissionsFaqs.map((faq: any, idx: number) => {
                const isOpen = openFaqIdx === idx;
                const questionText = faq.q || faq.question || faq.title || '';
                const answerText = faq.a || faq.answer || faq.content || faq.description || '';

                return (
                  <ScrollReveal key={idx} delayMs={idx * 60}>
                    <div
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? 'bg-white border-indigo-200 shadow-md ring-2 ring-indigo-500/10'
                          : 'bg-white/80 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                        className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                              isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            Q{idx + 1}
                          </div>
                          <h4 className="text-base font-bold text-slate-800 leading-snug">
                            {questionText}
                          </h4>
                        </div>

                        <div
                          className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-300 ${
                            isOpen
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-600 rotate-180'
                              : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </button>

                      {/* Smooth Collapsible Content Drawer */}
                      {isOpen && (
                        <div className="px-6 pb-6 pt-0 border-t border-slate-100/80 text-sm text-slate-600 leading-relaxed font-medium animate-in fade-in duration-200 pl-17">
                          <p className="pt-4">{answerText}</p>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── REGIONAL TRUST & ACCREDITATION BANNER ─────────────── */}
      {accreditationsList.length > 0 && (
        <section className="py-20 px-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white border-t border-slate-800 relative overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="max-w-7xl mx-auto space-y-12 relative z-10 text-center">
            <div className="space-y-3 max-w-3xl mx-auto">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] border backdrop-blur-md"
                style={{ color: '#38bdf8', borderColor: '#38bdf840', backgroundColor: '#38bdf815' }}
              >
                <Shield className="h-3.5 w-3.5 text-emerald-400" /> Regulatory Compliance & Standards
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Institutional Accreditation & Regional Trust
              </h3>
              <p className="text-sm text-slate-300 font-medium">
                {school.name} is fully recognized by government regulatory bodies and international academic councils.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {accreditationsList.map((acc: any, idx: number) => (
                <ScrollReveal key={idx} delayMs={idx * 80}>
                  <div className="bg-white/5 border border-white/10 hover:border-indigo-400/40 rounded-3xl p-6 transition-all duration-300 hover:bg-white/10 group flex flex-col justify-between items-center text-center space-y-4 h-full">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform p-1.5 overflow-hidden">
                      {acc.logoUrl ? (
                        <img src={acc.logoUrl} alt={acc.title} className="w-full h-full object-contain" />
                      ) : (
                        <span>{acc.flag || '🛡️'}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-white leading-tight group-hover:text-indigo-300 transition-colors">
                        {acc.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">{acc.subtitle}</p>
                    </div>

                    <div className="w-full pt-3 border-t border-white/10 space-y-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-300 text-[9px] font-black uppercase font-mono tracking-widest border border-emerald-400/20 block">
                        {acc.badge}
                      </span>
                      {acc.regNo && (
                        <span className="text-[9px] text-slate-400 font-mono block truncate">{acc.regNo}</span>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

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
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      school.gpsCoordinates || (school.latitude && school.longitude ? `${school.latitude},${school.longitude}` : null) || school.address || school.name
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group/item"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:border-indigo-400/50">
                      <MapPin className="h-4 w-4 text-indigo-400" />
                    </div>
                    <span className="leading-snug line-clamp-2">{resolveHumanAddress(school)}</span>
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
                    {resolveHumanAddress(school)}
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

      {/* ─── EVENT DETAILED MODAL ─────────────────────────────── */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] max-w-xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-slate-100 relative shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header image or banner */}
            <div className="h-52 w-full relative bg-slate-900 overflow-hidden shrink-0">
              {selectedEvent.imageUrl || selectedEvent.image ? (
                <img
                  src={selectedEvent.imageUrl || selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex flex-col items-center justify-center text-white relative p-6 text-center"
                  style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}
                >
                  <Calendar className="h-14 w-14 text-white/40 mb-2" />
                  <span className="text-xs font-black uppercase tracking-widest opacity-80 font-mono">Campus Event Details</span>
                </div>
              )}

              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/60 text-white hover:bg-slate-950 transition-colors cursor-pointer border border-white/20 z-10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-6 px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-widest border border-white/40 shadow-md">
                {selectedEvent.category || 'Event'}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-10 overflow-y-auto space-y-6 flex-1">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                  {selectedEvent.title}
                </h3>
                {selectedEvent.date && (
                  <p className="text-xs font-bold text-indigo-600 font-mono">
                    📅 Scheduled: {selectedEvent.date}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-100 text-xs font-semibold text-slate-700">
                {selectedEvent.time && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase block font-mono">Time</span>
                      <span className="font-bold text-slate-800">{selectedEvent.time}</span>
                    </div>
                  </div>
                )}

                {selectedEvent.location && (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase block font-mono">Venue</span>
                      <span className="font-bold text-slate-800">{selectedEvent.location}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Event Overview & Details</h4>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {selectedEvent.description || 'Join us for this important school event. Further instructions and agenda schedules will be communicated by the administration.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-4 rounded-2xl text-white text-xs font-black uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${brand}, ${secondaryColor})` }}
                >
                  Close Details
                </button>
                {selectedEvent.location && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(selectedEvent.location)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <MapPin className="h-4 w-4 text-indigo-600" /> Map ↗
                  </a>
                )}
              </div>
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

      {/* ─── CAMPUS TOUR MODAL POPUP ───────────────────────── */}
      {tourModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100 relative animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-900">{school.name}</h4>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase font-mono tracking-widest">30-Min Campus Visit</span>
                </div>
              </div>
              <button
                onClick={() => setTourModalOpen(false)}
                className="p-2.5 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              <CampusTourBooking
                schoolId={school.id}
                schoolName={school.name}
                primaryColor={brand}
              />
            </div>
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

            {/* Schedule Campus Tour */}
            <button
              onClick={() => {
                setFabOpen(false);
                setAdmissionTab('tour');
                setTourModalOpen(true);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-amber-600 border border-amber-500 text-white text-xs font-bold hover:bg-amber-500 transition-all group cursor-pointer"
            >
              <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
              </div>
              <span>Schedule Campus Tour</span>
            </button>

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

      {/* ─── AUTOMATED GLOBAL SEARCH OVERLAY ──────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-200 flex flex-col items-center p-6 md:p-12 overflow-y-auto">
          <div className="w-full max-w-3xl space-y-8">
            {/* Close & Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-indigo-400" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-300 font-mono">Instant Site Search</span>
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Input Bar */}
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type keywords (e.g., fees, admissions, bus, calendar, robotics)..."
                className="w-full pl-15 pr-6 py-5 rounded-3xl bg-white/10 border border-white/20 text-white text-lg font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 shadow-2xl"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider font-mono bg-white/10 px-2.5 py-1 rounded-lg"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Keyword Suggestion Pills */}
            {!searchQuery && (
              <div className="space-y-3 pt-2 text-left">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono block">Popular Searches:</span>
                <div className="flex flex-wrap gap-2">
                  {['Admissions & Fees', 'School Bus Routes', 'Academic Calendar', 'Pre-School Cut-Off', 'STEM Robotics', 'Headmaster Profile'].map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSearchQuery(tag)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
                    >
                      🔍 {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results List */}
            {searchQuery && (
              <div className="space-y-4 pt-4 text-left">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Found {searchResults.length} matching results</span>
                  <span>Press ESC to exit</span>
                </div>

                {searchResults.length === 0 ? (
                  <div className="p-10 rounded-3xl bg-white/5 border border-white/10 text-center space-y-2">
                    <p className="text-slate-300 font-bold text-base">No content found matching "{searchQuery}"</p>
                    <p className="text-slate-400 text-xs font-medium">Try searching for "fees", "admissions", "calendar", or "teachers".</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {searchResults.map((res) => (
                      <div
                        key={res.id}
                        onClick={() => {
                          setSearchOpen(false);
                          if (res.action) res.action();
                          scrollTo(res.targetId);
                        }}
                        className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-400/40 hover:bg-white/10 transition-all cursor-pointer group space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-black uppercase tracking-widest font-mono">
                            {res.category}
                          </span>
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                        </div>
                        <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {res.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 font-medium">
                          {res.snippet}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}


