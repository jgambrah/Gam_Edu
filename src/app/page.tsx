'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { submitSchoolLead } from '@/app/actions/leads'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, Globe, Star, Phone, MessageSquare, 
  CheckCircle2, ArrowRight, Smartphone, MapPin, 
  Sparkles, GraduationCap, Wallet, ShieldCheck
} from 'lucide-react';
import { AppLogo } from '@/components/icons/app-logo';

const GHANA_TESTIMONIALS = [
  {
    name: "Rev. Dr. Emmanuel Mensah",
    role: "Proprietor, Royal Crown Academy",
    text: "With GAM Edu's direct MoMo collection, our term fee default rate dropped to near zero. Parents receive instant payment receipts on WhatsApp.",
    city: "Kumasi, Ashanti"
  },
  {
    name: "Sarah Osei-Bonsu",
    role: "Headmistress, Future Leaders International",
    text: "The 30,000+ NaCCA & BECE question bank transformed our mock examinations. Teachers assemble standard exam papers in minutes with comprehensive marking schemes.",
    city: "East Legon, Accra"
  },
  {
    name: "Kofi Owusu-Ansah",
    role: "Director of Studies, Starland College",
    text: "The geofenced campus attendance stopped proxy clock-ins dead in their tracks. We have 100% staff attendance verification before morning assembly.",
    city: "Takoradi, Western"
  }
];

export default function LandingAndDemoPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  // Navigation & Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  // Demo Request Lead Capture Form State
  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [phone, setPhone] = useState('+233 ');
  const [location, setLocation] = useState('');
  const [primaryInterest, setPrimaryInterest] = useState('Full School Management');
  const [leadEmail, setLeadEmail] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [isLeadSubmitted, setIsLeadSubmitted] = useState(false);

  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Redirect to dashboard automatically if user session is already active
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  // Mobile / PWA branded splash handling
  useEffect(() => {
    const isStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    if (isStandalone || isMobile) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Testimonial Carousel Auto-Rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % GHANA_TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = GHANA_TESTIMONIALS[testimonialIndex];

  // Lead Submission Handler
  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !schoolName.trim() || !phone.trim() || !location.trim()) {
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: "Please fill in your name, school, phone, and location.",
      });
      return;
    }

    setIsSubmittingLead(true);
    try {
      // 1. Submit to server action (Saves to Firestore 'leads' for CEO Command Center & dispatches Resend email alert)
      const res = await submitSchoolLead({
        schoolName: schoolName.trim(),
        contactName: fullName.trim(),
        email: leadEmail.trim() || undefined,
        phone: phone.trim(),
        location: location.trim(),
        primaryInterest
      });

      if (res?.error) {
        console.warn("submitSchoolLead warning:", res.error);
      }

      // 2. Fire Google Ads Conversion Tag
      if (typeof window !== 'undefined' && (window as any).gtag) {
        try {
          (window as any).gtag('event', 'generate_lead', {
            event_category: 'Demo_Request',
            event_label: schoolName.trim(),
            value: 1.0,
          });
        } catch (gtagErr) {
          console.warn("gtag trigger error:", gtagErr);
        }
      }

      setIsLeadSubmitted(true);
      toast({
        title: "Demo Request Received! 🇬🇭",
        description: "Our Ghanaian education team will reach out within 15 minutes.",
      });
    } catch (err: any) {
      console.error("Demo request error:", err);
      setIsLeadSubmitted(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Login Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    if (!auth) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Authentication service initializing. Please retry in a moment.",
      });
      setIsLoggingIn(false);
      return;
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      if (userCred.user) {
        await userCred.user.getIdToken(true);
      }
      toast({ title: "Welcome back!", description: "Opening your school dashboard..." });
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      let message = "Invalid email or password.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "The email or password you entered is incorrect. Please verify your credentials.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many attempts. Account temporarily locked for security. Try again later.";
      } else if (error.code === 'auth/network-request-failed') {
        message = "Network error. Please check your internet connection.";
      }
      
      toast({ 
        variant: "destructive", 
        title: "Login Failed", 
        description: message 
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Authentication service initializing. Please refresh.",
      });
      return;
    }

    setIsLoggingIn(true);
    const provider = new GoogleAuthProvider();
    try {
      const res = await signInWithPopup(auth, provider);
      if (res.user) {
        await res.user.getIdToken(true);
      }
      toast({ title: "Welcome back!", description: "Logging you in via Google..." });
      router.push('/dashboard');
    } catch (error: any) {
      console.warn("Popup blocked, attempting redirect. Error:", error);
      if (
        error.code === 'auth/popup-blocked' || 
        error.code === 'auth/popup-closed-by-user' || 
        error.code === 'auth/cancelled-popup-request' ||
        error.message?.includes('popup')
      ) {
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectErr: any) {
          console.error("Redirect auth failed:", redirectErr);
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Google authentication failed. Please check browser settings."
          });
          setIsLoggingIn(false);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message || "Google authentication failed."
        });
        setIsLoggingIn(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* --- FAKE SPLASH SCREEN (Mobile/PWA Only) --- */}
      {showSplash && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-indigo-950 text-white animate-out fade-out duration-500 delay-500 fill-mode-forwards">
          <AppLogo className="h-20 w-20 mb-4 shadow-2xl animate-pulse" />
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">GAM EDU</h1>
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.25em] opacity-90">Ghana's #1 School OS</p>
          </div>
        </div>
      )}

      {/* --- TOP NAVIGATION BAR --- */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Ghana Identifier */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <AppLogo className="h-10 w-10 sm:h-11 sm:w-11 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform rounded-2xl" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tighter text-white">GAM EDU</span>
                  <Badge variant="outline" className="hidden sm:inline-flex text-[10px] font-extrabold uppercase px-1.5 py-0 bg-amber-500/15 text-amber-300 border-amber-500/30">
                    🇬🇭 GHANA
                  </Badge>
                </div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hidden xs:block">
                  Smarter School Operating System
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Actions & Secondary Login Flow */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Direct Phone / WhatsApp Hotlink */}
            <a 
              href="https://wa.me/233244750903?text=Hello%20GAM%20Edu,%20I%20am%20a%20school%20head%20and%20would%20like%20to%20learn%20more%20about%20your%20system." 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-400 text-xs font-bold transition-all shadow-sm group"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Phone className="h-3.5 w-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span>+233 24 475 0903</span>
            </a>

            {/* "Already Registered? Sign In" Button (Secondary Flow) */}
            <Button
              onClick={() => setIsLoginModalOpen(true)}
              variant="outline"
              className="border-indigo-500/40 bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-200 hover:text-white font-bold text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Already Registered?</span>
              <span className="text-white underline decoration-indigo-400 font-extrabold ml-0.5">Sign In</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1 text-indigo-400" />
            </Button>
          </div>
        </div>
      </header>

      {/* --- HERO / MAIN B2B CONTENT VIEWPORT --- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* LEFT 7 COLUMNS: B2B VALUE PROPOSITION & GHANA-SPECIFIC DIFFERENTIATORS */}
          <div className="lg:col-span-7 flex flex-col space-y-8">
            
            {/* Top Positioning Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                <span>Purpose-Built for Ghanaian Basic & JHS Schools</span>
              </Badge>
              <Badge variant="outline" className="text-slate-400 border-slate-700 text-xs px-2.5 py-0.5 font-medium">
                NaCCA Aligned • BECE Exam Standard
              </Badge>
            </div>

            {/* Hero Sales Headline */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
                Eliminate School Fee Defaults & Automate Terminal Reports with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-indigo-400">
                  Ghana’s #1 School OS
                </span>.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                Engineered for proprietors, headteachers, and administrators across Ghana. 
                Collect fees directly through <strong>MTN MoMo & Telecel Cash</strong>, access 
                <strong> 30,000+ NaCCA-aligned practice questions and standard BECE-style mock items</strong>, and track staff attendance with 
                geofenced GPS verification.
              </p>
            </div>

            {/* Quick Proof Numbers Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
                <p className="text-2xl font-black text-amber-400">30,000+</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">BECE & NaCCA Items</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
                <p className="text-2xl font-black text-emerald-400">100%</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Direct MoMo Revenue</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
                <p className="text-2xl font-black text-cyan-400">200m</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">GPS Geofenced Campus</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm">
                <p className="text-2xl font-black text-indigo-400">10x</p>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Faster Report Cards</p>
              </div>
            </div>

            {/* THE 4 CORE GHANA-SPECIFIC FEATURE CARDS */}
            <div className="space-y-3.5 pt-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">
                Key Capabilities Built for Ghanaian Institutions
              </h3>

              <div className="grid grid-cols-1 gap-3.5">
                
                {/* Feature 1: NaCCA & BECE Bank */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/90 hover:border-amber-500/40 hover:bg-slate-850 transition-all group shadow-sm">
                  <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 group-hover:scale-105 transition-transform">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-amber-300 transition-colors">
                        30,000+ NaCCA & BECE Question Bank
                      </h4>
                      <Badge className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border-amber-500/30 py-0">
                        Standard Marking Rubrics
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      Engineered to match national exam standards, featuring comprehensive step-by-step worked solutions and rigorous marking schemes for basic and JHS schools. Teachers assemble termly test papers in minutes.
                    </p>
                  </div>
                </div>

                {/* Feature 2: Zero-Leak MoMo & Bank Collections */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/90 hover:border-emerald-500/40 hover:bg-slate-850 transition-all group shadow-sm">
                  <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 group-hover:scale-105 transition-transform">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-emerald-300 transition-colors">
                        Zero-Leak MoMo & Bank Collections
                      </h4>
                      <Badge className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border-emerald-500/30 py-0">
                        MTN & Telecel
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      Direct school fee payments via MTN MoMo, Telecel Cash, and AT Money straight into the school’s account with automated terminal debtor lockouts.
                    </p>
                  </div>
                </div>

                {/* Feature 3: Geofenced Campus Attendance */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/90 hover:border-cyan-500/40 hover:bg-slate-850 transition-all group shadow-sm">
                  <div className="h-11 w-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400 group-hover:scale-105 transition-transform">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors">
                        Geofenced Campus Attendance
                      </h4>
                      <Badge className="text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border-cyan-500/30 py-0">
                        Anti-Proxy GPS
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      200m GPS-restricted mobile check-in with live selfie verification to eliminate proxy attendance and ensure teachers are physically on campus.
                    </p>
                  </div>
                </div>

                {/* Feature 4: Turnkey School Website & Portal */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/90 hover:border-indigo-500/40 hover:bg-slate-850 transition-all group shadow-sm">
                  <div className="h-11 w-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400 group-hover:scale-105 transition-transform">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm sm:text-base text-white group-hover:text-indigo-300 transition-colors">
                        Turnkey School Website & Portal
                      </h4>
                      <Badge className="text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border-indigo-500/30 py-0">
                        Online Admissions
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      Instant public website and online admissions engine for every onboarded institution. Give prospective parents a modern first impression.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Ghanaian School Testimonial Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 relative overflow-hidden backdrop-blur-sm">
              <div className="flex gap-1 mb-2.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-sm italic text-slate-200 leading-relaxed mb-3">
                &ldquo;{currentTestimonial.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{currentTestimonial.name}</p>
                  <p className="text-[11px] text-slate-400">{currentTestimonial.role}</p>
                </div>
                <Badge variant="outline" className="text-[10px] text-amber-300 border-amber-500/30 bg-amber-500/10">
                  {currentTestimonial.city}
                </Badge>
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLUMNS: HIGH-CONVERTING "BOOK A FREE SCHOOL DEMO" LEAD CARD */}
          <div className="lg:col-span-5 w-full">
            <div className="sticky top-28">
              
              <Card className="bg-slate-900/95 border border-slate-700/80 shadow-2xl shadow-indigo-950/40 rounded-3xl overflow-hidden backdrop-blur-xl">
                
                {/* Card Top Banner */}
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 px-6 py-2.5 text-center">
                  <p className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-950 flex items-center justify-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Free 30-Minute In-Person or Online School Demo</span>
                  </p>
                </div>

                <CardHeader className="p-6 sm:p-7 pb-3 space-y-1.5">
                  <CardTitle className="text-2xl font-black text-white tracking-tight">
                    Book a Free School Demo
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Join over 100+ schools transforming student outcomes across Ghana. No commitment or upfront cost.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 sm:p-7 pt-2 space-y-4">
                  
                  {isLeadSubmitted ? (
                    // SUCCESS CONFIRMATION STATE
                    <div className="py-6 px-4 text-center space-y-4 animate-in fade-in duration-500">
                      <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-xl font-black text-white">Demo Request Received!</h3>
                        <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                          Thank you, <strong>{fullName}</strong>. We have received your request for <strong>{schoolName}</strong>.
                        </p>
                        <p className="text-xs text-emerald-400 font-semibold pt-1">
                          Our Ghanaian Education Consultant will contact you on <strong>{phone}</strong> within 15 minutes.
                        </p>
                      </div>

                      {/* Instant WhatsApp Escalation Button */}
                      <div className="pt-2 space-y-2">
                        <a
                          href={"https://wa.me/233244750903?text=Hello%20GAM%20Edu,%20I%20just%20booked%20a%20demo%20for%20" + encodeURIComponent(schoolName) + "%20(" + encodeURIComponent(location) + ").%20My%20name%20is%20" + encodeURIComponent(fullName) + "."}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Chat Instantly on WhatsApp</span>
                        </a>

                        <Button
                          variant="ghost"
                          onClick={() => {
                            setIsLeadSubmitted(false);
                            setSchoolName('');
                            setFullName('');
                          }}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          Submit Another Request
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // LEAD CAPTURE FORM
                    <form onSubmit={handleDemoSubmit} className="space-y-3.5">
                      
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="lead-name" className="text-xs font-bold text-slate-200">
                          Your Full Name & Title <span className="text-amber-400">*</span>
                        </Label>
                        <Input
                          id="lead-name"
                          placeholder="e.g., Rev. Dr. Emmanuel Mensah / Mad. Sarah"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="bg-slate-950/90 border-slate-700 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
                        />
                      </div>

                      {/* School Name */}
                      <div className="space-y-1.5">
                        <Label htmlFor="lead-school" className="text-xs font-bold text-slate-200">
                          School / Institution Name <span className="text-amber-400">*</span>
                        </Label>
                        <Input
                          id="lead-school"
                          placeholder="e.g., Royal Crown International School"
                          value={schoolName}
                          onChange={(e) => setSchoolName(e.target.value)}
                          required
                          className="bg-slate-950/90 border-slate-700 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
                        />
                      </div>

                      {/* Phone / WhatsApp with +233 flag */}
                      <div className="space-y-1.5">
                        <Label htmlFor="lead-phone" className="text-xs font-bold text-slate-200">
                          Phone / WhatsApp Number <span className="text-amber-400">*</span>
                        </Label>
                        <div className="relative flex items-center">
                          <div className="absolute left-3 flex items-center gap-1 text-xs font-bold text-slate-400 pointer-events-none border-r border-slate-700 pr-2">
                            <span>🇬🇭</span>
                          </div>
                          <Input
                            id="lead-phone"
                            placeholder="+233 24 123 4567"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="bg-slate-950/90 border-slate-700 text-white placeholder:text-slate-500 h-11 rounded-xl pl-14 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
                          />
                        </div>
                      </div>

                      {/* Official Email Address (Optional) */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="lead-email" className="text-xs font-bold text-slate-200">
                            Official Email Address
                          </Label>
                          <span className="text-[10px] text-slate-400 font-medium">Optional</span>
                        </div>
                        <Input
                          id="lead-email"
                          type="email"
                          placeholder="headteacher@school.edu.gh / gmail.com"
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          className="bg-slate-950/90 border-slate-700 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
                        />
                      </div>

                      {/* School Location / City */}
                      <div className="space-y-1.5">
                        <Label htmlFor="lead-location" className="text-xs font-bold text-slate-200">
                          School Location / City <span className="text-amber-400">*</span>
                        </Label>
                        <Input
                          id="lead-location"
                          placeholder="e.g., Kumasi, Accra, Takoradi, Sunyani, Tamale"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          required
                          className="bg-slate-950/90 border-slate-700 text-white placeholder:text-slate-500 h-11 rounded-xl focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm"
                        />
                      </div>

                      {/* Primary Interest Dropdown */}
                      <div className="space-y-1.5">
                        <Label htmlFor="lead-interest" className="text-xs font-bold text-slate-200">
                          Primary Interest Area
                        </Label>
                        <Select value={primaryInterest} onValueChange={setPrimaryInterest}>
                          <SelectTrigger id="lead-interest" className="bg-slate-950/90 border-slate-700 text-white h-11 rounded-xl text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400">
                            <SelectValue placeholder="Select interest..." />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-slate-700 text-white">
                            <SelectItem value="Full School Management" className="focus:bg-slate-800 focus:text-white cursor-pointer font-medium">
                              Full School Management (All-in-One)
                            </SelectItem>
                            <SelectItem value="BECE Digital Assessment Bank" className="focus:bg-slate-800 focus:text-white cursor-pointer font-medium">
                              BECE Digital Assessment Bank (30,000+ Questions)
                            </SelectItem>
                            <SelectItem value="MoMo Fee Collection" className="focus:bg-slate-800 focus:text-white cursor-pointer font-medium">
                              MoMo Fee Collection (Direct MTN / Telecel)
                            </SelectItem>
                            <SelectItem value="Geofenced Attendance" className="focus:bg-slate-800 focus:text-white cursor-pointer font-medium">
                              Geofenced Campus Attendance (GPS Verification)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* CTA Button */}
                      <Button
                        type="submit"
                        disabled={isSubmittingLead}
                        className="w-full h-12 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-orange-950/50 hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
                      >
                        {isSubmittingLead ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                            <span>Scheduling Demo...</span>
                          </>
                        ) : (
                          <>
                            <span>Request Free School Demo</span>
                            <ArrowRight className="h-4 w-4 stroke-[3]" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}

                  {/* Direct Contact / WhatsApp Trigger Beneath Form */}
                  <div className="pt-3 border-t border-slate-800 text-center space-y-2">
                    <p className="text-xs text-slate-400 font-medium">
                      Prefer to speak directly with an education specialist?
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      <a
                        href="tel:+233244750903"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
                      >
                        <Phone className="h-3 w-3 text-amber-400" />
                        <span>Call +233 24 475 0903</span>
                      </a>
                      <a
                        href="https://wa.me/233244750903?text=Hello%20GAM%20Edu,%20I%20am%20interested%20in%20a%20school%20demo."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition-colors"
                      >
                        <MessageSquare className="h-3 w-3 text-emerald-400" />
                        <span>WhatsApp Us</span>
                      </a>
                    </div>
                  </div>

                </CardContent>

                <CardFooter className="bg-slate-950/60 p-4 border-t border-slate-800 text-center flex flex-col gap-1.5">
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <span>Already a subscriber?</span>
                    <button
                      type="button"
                      onClick={() => setIsLoginModalOpen(true)}
                      className="font-bold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                    >
                      Sign In to Portal
                    </button>
                  </div>
                </CardFooter>
              </Card>

            </div>
          </div>

        </div>
      </main>

            {/* --- FOOTER --- */}
      <footer className="w-full border-t border-slate-800/80 py-8 bg-slate-950 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-[11px] leading-relaxed text-slate-500 max-w-4xl mx-auto text-center border-b border-slate-900 pb-3">
            Disclaimer: GAM Edu is an independent educational platform aligned with NaCCA curriculum guidelines and BECE assessment formats. WAEC and BECE trademarks belong to their respective holders and imply no direct endorsement or affiliation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <AppLogo className="h-6 w-6 rounded-lg opacity-80" />
              <span className="font-bold text-slate-400">GAM Edu</span>
              <span>&copy; {new Date().getFullYear()} GAM IT Solutions. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-medium">
              <span>Accra • Kumasi • Takoradi</span>
              <span>•</span>
              <a href="tel:+233244750903" className="hover:text-white transition-colors">
                +233 24 475 0903
              </a>
              <span>•</span>
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="hover:text-indigo-400 transition-colors underline cursor-pointer"
              >
                School Portal Sign In
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* --- SECONDARY LOGIN MODAL (TRIGGERED FROM HEADER / FOOTER) --- */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white p-6 sm:p-8 rounded-3xl shadow-2xl">
          <DialogHeader className="space-y-1.5 text-center">
            <div className="mx-auto mb-2">
              <AppLogo className="h-12 w-12 rounded-2xl shadow-lg shadow-indigo-500/20" />
            </div>
            <DialogTitle className="text-2xl font-black text-white tracking-tight">
              Portal Access
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Sign in to your headteacher, staff, student, or parent dashboard.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="login-email" className="text-xs font-bold text-slate-300">Email Address</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="head@school.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 h-11 rounded-xl text-sm focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-xs font-bold text-slate-300">Password</Label>
                <Link href="/password-reset" className="text-xs text-indigo-400 hover:underline font-semibold">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500 h-11 rounded-xl text-sm focus:border-indigo-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-indigo-600 hover:bg-indigo-500 h-11 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </Button>
          </form>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase font-bold tracking-wider absolute">
              Or continue with
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-2.5 h-11 border-slate-700 hover:bg-slate-800 text-slate-200 font-bold rounded-xl transition-all cursor-pointer"
          >
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.472 0-6.287-2.815-6.287-6.287s2.815-6.287 6.287-6.287c1.713 0 3.228.68 4.35 1.796l3.074-3.074C19.336 2.015 15.996 1 12.24 1 6.033 1 12.24 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.867-4.237 10.867-11.24 0-.745-.067-1.464-.19-2.155H12.24z"
              />
            </svg>
            <span>Sign in with Google</span>
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Want to see a demo first? <span className="text-amber-400 font-bold underline">Book Free Demo</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
