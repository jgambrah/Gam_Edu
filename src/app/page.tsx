
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase'; 
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, School, CheckCircle2, Globe, Brain, Shield, Users, BookOpen, Star } from 'lucide-react';

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
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();


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
      if (error.code === 'auth/too-many-requests') message = "Too many attempts. Try again later.";
      toast({ variant: "destructive", title: "Login Failed", description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      
      {/* LEFT SIDE: MARKETING */}
      <div className="hidden lg:flex flex-col bg-slate-900 text-white p-8 lg:p-12 relative h-screen overflow-y-auto no-scrollbar">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full">
          
          {/* Top Badge */}
          <div className="flex-shrink-0 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/50 border border-blue-700 text-blue-200 text-xs font-medium mb-4">
              <Star className="h-3 w-3 fill-current text-yellow-400" />
              Trusted by 50+ Modern Schools
            </div>
            
            <div className="flex items-center gap-3 text-2xl font-bold mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <School className="h-6 w-6 text-white" />
              </div>
              GAM Edu
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-3 tracking-tight">
              The Intelligent OS for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Future-Ready Schools</span>.
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
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-lg">
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
             <div className="inline-flex bg-blue-600 p-3 rounded-xl mb-3">
               <School className="h-8 w-8 text-white" />
             </div>
             <h1 className="text-2xl font-bold text-slate-900">GAM Edu</h1>
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
                    <Link href="/password-reset" className="text-xs text-blue-600 hover:underline font-medium">
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
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base font-semibold shadow-lg shadow-blue-900/10 transition-all" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 bg-slate-50/50 pt-6 border-t pb-6">
              <div className="text-center text-sm text-slate-500">
                School not registered?
              </div>
              <Link href="/register-school" className="w-full">
                <Button variant="outline" className="w-full border-blue-200 bg-white hover:bg-blue-50 text-blue-700 font-bold border h-10">
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
  );
}

function FeatureRow({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-all border border-transparent hover:border-white/10 group">
      <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
        <Icon className="h-5 w-5 text-blue-400 group-hover:text-blue-300" />
      </div>
      <div>
        <h3 className="font-bold text-white text-sm">{title}</h3>
        <p className="text-slate-400 text-xs leading-relaxed group-hover:text-slate-300">{desc}</p>
      </div>
    </div>
  );
}
