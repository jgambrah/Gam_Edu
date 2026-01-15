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
import { Loader2, School, CheckCircle2, Globe, Brain, Shield, Users, BookOpen } from 'lucide-react';

// --- DATA: TESTIMONIALS ---
// You can add more here later!
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
  const [testimonialIndex, setTestimonialIndex] = useState(0); // State for rotation
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();


  // Auto-rotate testimonials every 5 seconds
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
      <div className="hidden lg:flex flex-col justify-between bg-blue-950 text-white p-12 relative overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-2xl font-bold mb-8">
            <School className="h-8 w-8 text-blue-400" />
            GAM Edu
          </div>
          
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            The Intelligent Future of <span className="text-blue-400">School Management</span>.
          </h1>
          <p className="text-blue-200 text-lg mb-8 max-w-lg">
            Empower your institution with AI-driven insights, automated finance, and personalized learning clubs.
          </p>

          <div className="space-y-5">
            <FeatureRow icon={Brain} title="Intelligent AI Core" desc="Auto-generate quizzes, lesson plans & personalized tutors." />
            <FeatureRow icon={School} title="Complete Management Suite" desc="Staff, Students, Payroll & Finance in one secure cloud." />
            <FeatureRow icon={Shield} title="Role-Based Security" desc="Dedicated portals for Directors, Teachers & Parents." />
            <FeatureRow icon={Users} title="Engaging STEM Clubs" desc="Math, Science & Coding clubs with leaderboards." />
            <FeatureRow icon={BookOpen} title="Smart Financials" desc="Auto-reconciliation for fees & expenses." />
          </div>
        </div>

        {/* DYNAMIC TESTIMONIAL CARD */}
        <div className="relative z-10 mt-12">
            <div className="bg-white/10 p-6 rounded-xl border border-white/10 backdrop-blur-md transition-all duration-500 ease-in-out">
            <p className="font-medium italic text-lg leading-relaxed">"{currentTestimonial.text}"</p>
            <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shadow-lg">
                    {currentTestimonial.initials}
                </div>
                <div>
                <p className="text-sm font-bold text-white">{currentTestimonial.name}</p>
                <p className="text-xs text-blue-200">{currentTestimonial.role}</p>
                </div>
            </div>
            </div>
            {/* Dots Indicator */}
            <div className="flex gap-2 mt-4 justify-center lg:justify-start">
                {TESTIMONIALS.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === testimonialIndex ? 'w-6 bg-blue-400' : 'w-1.5 bg-white/30'}`}
                    />
                ))}
            </div>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-blue-600">
          <CardHeader className="space-y-1 pb-2">
            <div className="lg:hidden flex justify-center mb-4">
               <School className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-center">Portal Login</CardTitle>
            <CardDescription className="text-center">
              Access your school dashboard securely.
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
                  className="bg-white"
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
                  className="bg-white"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base shadow-lg hover:shadow-xl transition-all" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Secure Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 bg-slate-100/50 pt-6 border-t pb-8">
            <div className="text-center text-sm text-slate-600">
              New to GAM Edu?
            </div>
            <Link href="/register-school" className="w-full">
              <Button variant="outline" className="w-full border-blue-200 hover:bg-white text-blue-700 font-bold border-2 h-11">
                <Globe className="mr-2 h-4 w-4"/> Request School Demo
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function FeatureRow({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 p-2 hover:bg-white/5 rounded-lg transition-colors">
      <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-blue-300" />
      </div>
      <div>
        <h3 className="font-bold text-white text-sm">{title}</h3>
        <p className="text-blue-200 text-xs leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
