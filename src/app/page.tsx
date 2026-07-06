
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { useAuth } from '@/firebase'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, School, CheckCircle2, Globe, Brain, Shield, Users, BookOpen, Star, AlertCircle } from 'lucide-react';
import { AppLogo } from '@/components/icons/app-logo';

const TESTIMONIALS = [
  {
    name: "James Smith",
    role: "Principal, Galaxy Int. School",
    text: "This platform transformed how we run our school. The AI features save our teachers hours every week.",
    initials: "JS"
  },
  {
    name: "Sarah Osei",
    role: "Director, Future Leaders Academy",
    text: "Finally, a system that handles our finances and student learning in one place. The automated payroll is a lifesaver.",
    initials: "SO"
  },
  {
    name: "Dr. K. Mensah",
    role: "Headmaster, Royal High",
    text: "The personalized AI tutor is incredible. Our students are more engaged than ever before.",
    initials: "KM"
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [showSplash, setShowSplash] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Firebase is not initialized. Please refresh.",
      });
      return;
    }

    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      // Try popup first
      await signInWithPopup(auth, provider);
      toast({ title: "Welcome back!", description: "Logging you in via Google..." });
      router.push('/dashboard');
    } catch (error: any) {
      console.warn("Popup blocked or failed, falling back to redirect. Error:", error);
      if (
        error.code === 'auth/popup-blocked' || 
        error.code === 'auth/popup-closed-by-user' || 
        error.code === 'auth/cancelled-popup-request' ||
        error.message?.includes('popup')
      ) {
        // Fallback to redirect
        try {
          await signInWithRedirect(auth, provider);
        } catch (redirectErr: any) {
          console.error("Redirect auth failed:", redirectErr);
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Google authentication failed. Please check your browser settings."
          });
          setLoading(false);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.message || "Google authentication failed."
        });
        setLoading(false);
      }
    }
  };

  // Redirect to dashboard automatically if user session is active
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  useEffect(() => {
    // Only show splash screen if the app is launched as a PWA (standalone) or on small screens
    const isStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    if (isStandalone || isMobile) {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1500); // 1.5 seconds of branded loading
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = TESTIMONIALS[testimonialIndex];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!auth) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Firebase is not initialized. Please refresh.",
        });
        setLoading(false);
        return;
    }


    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Welcome back!", description: "Logging you in..." });
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      let message = "Invalid email or password.";
      
      // Clearer error feedback for common issues
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "The email or password you entered is incorrect. Please check your credentials and try again.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many attempts. Your account is temporarily locked for security. Try again later.";
      } else if (error.code === 'auth/network-request-failed') {
        message = "Network error. Please check your internet connection.";
      }
      
      toast({ 
        variant: "destructive", 
        title: "Login Failed", 
        description: message 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* --- FAKE SPLASH SCREEN (Mobile/PWA Only) --- */}
      {showSplash && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-indigo-950 text-white animate-out fade-out duration-500 delay-1000 fill-mode-forwards">
          <AppLogo className="h-24 w-24 mb-6 shadow-2xl animate-pulse" />
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">GAM EDU</h1>
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-[0.3em] opacity-80">Smarter Learning</p>
          </div>
        </div>
      )}

      {/* --- LOGIN PAGE --- */}
      <div className={`min-h-screen w-full lg:grid lg:grid-cols-2 ${showSplash ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}>
        
        {/* LEFT SIDE: MARKETING */}
        <div className="hidden lg:flex flex-col bg-slate-900 text-white p-8 lg:p-12 relative h-screen overflow-y-auto no-scrollbar">
          
          {/* Background Gradients */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col h-full">
            
            {/* Top Badge */}
            <div className="flex-shrink-0 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700 text-indigo-200 text-xs font-medium mb-4">
                <Star className="h-3 w-3 fill-current text-yellow-400" />
                Trusted by 50+ Modern Schools
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <AppLogo className="h-14 w-14 shadow-2xl" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black tracking-tighter leading-none">GAM EDU</span>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-1">Smarter Learning</span>
                </div>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-3 tracking-tight">
                The Intelligent OS for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Future-Ready Schools</span>.
              </h1>
              <p className="text-slate-400 text-base mb-8 max-w-lg leading-relaxed">
                Replace 10 different tools with one AI-powered platform. Manage admissions, finance, learning, and communication seamlessly.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-3 flex-grow mb-8">
              <FeatureRow icon={Brain} title="AI-Powered Learning" desc="Personalized tutors & lesson generation." />
              <FeatureRow icon={School} title="Complete Management Suite" desc="Staff, Students, Payroll & Finance in one secure cloud." />
              <FeatureRow icon={Shield} title="Bank-Grade Security" desc="Role-based access & encrypted data." />
              <FeatureRow icon={BookOpen} title="Smart Financials" desc="Automated billing & payroll." />
            </div>

            {/* Testimonial Card */}
            <div className="relative z-10 flex-shrink-0 mt-auto">
                <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700/50 backdrop-blur-md transition-all duration-500">
                  <div className="flex gap-1 mb-2">
                    {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 text-yellow-500 fill-current"/>)}
                  </div>
                  <p className="font-medium text-slate-200 italic text-sm mb-4 leading-relaxed">"{currentTestimonial.text}"</p>
                  <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-lg">
                          {currentTestimonial.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{currentTestimonial.name}</p>
                        <p className="text-xs text-slate-400">{currentTestimonial.role}</p>
                      </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: LOGIN */}
        <div className="flex items-center justify-center p-8 bg-slate-50 h-screen overflow-y-auto">
          <div className="w-full max-w-md space-y-6">
            
            <div className="lg:hidden text-center mb-6">
               <div className="inline-flex mb-3">
                 <AppLogo className="h-16 w-16 shadow-xl rounded-2xl" />
               </div>
               <h1 className="text-2xl font-black tracking-tighter text-slate-900">GAM EDU</h1>
            </div>

            <Card className="shadow-xl border-0 ring-1 ring-slate-200">
              <CardHeader className="space-y-1 pb-2">
                <CardTitle className="text-xl text-center font-bold">Portal Login</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@school.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      className="bg-slate-50 border-slate-200 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/password-reset" className="text-xs text-indigo-600 hover:underline font-medium">
                        Forgot password?
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      className="bg-slate-50 border-slate-200 focus:bg-white"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 text-base font-semibold shadow-lg shadow-indigo-900/10 transition-all" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                  </Button>
                </form>

                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-slate-200 w-full"></div>
                  <span className="bg-white px-3 text-[10px] text-slate-400 uppercase absolute font-bold tracking-wider">Or continue with</span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 h-11 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
                  disabled={loading}
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.472 0-6.287-2.815-6.287-6.287s2.815-6.287 6.287-6.287c1.713 0 3.228.68 4.35 1.796l3.074-3.074C19.336 2.015 15.996 1 12.24 1 6.033 1 12.24 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.867-4.237 10.867-11.24 0-.745-.067-1.464-.19-2.155H12.24z"
                    />
                  </svg>
                  Sign in with Google
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col gap-4 bg-slate-50/50 pt-6 border-t pb-6">
                <div className="text-center text-sm text-slate-500">
                  School not registered?
                </div>
                <Link href="/register-school" className="w-full">
                  <Button variant="outline" className="w-full border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 font-bold border h-10">
                    <Globe className="mr-2 h-4 w-4"/> Request School Demo
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            
            <p className="text-center text-xs text-slate-400">
              &copy; 2025 GAM IT Solutions. Secure & Encrypted.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function FeatureRow({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10 group">
      <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors">
        <Icon className="h-5 w-5 text-indigo-400 group-hover:text-indigo-300" />
      </div>
      <div>
        <h3 className="font-bold text-white text-sm">{title}</h3>
        <p className="text-slate-400 text-xs leading-relaxed group-hover:text-slate-300">{desc}</p>
      </div>
    </div>
  );
}
